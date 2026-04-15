/**
 * JSON-Serializer — character_angle_study
 *
 * Übersetzt einen validierten character_angle_study State in das Prompt-JSON
 * Format das NanoBanana als Paste-Input erwartet. Das Ausgabe-Format ist
 * **byte-identisch** zu DISTILLATIONS/angle-study-json-example.md (modulo
 * Module-Toggles, Panel-Count und User-Forbiddens die der User live ändert).
 *
 * Kern-Invarianten (aus BUILD_PLAN §5.4 und §8):
 *
 *   1. Key-Reihenfolge im Output folgt COMPILE_ORDER wörtlich. Keine
 *      alphabetische Sortierung, kein implizites Object.keys-Verhalten,
 *      kein Umstellen.
 *
 *   2. Listen bleiben Listen. Keine Fließtext-Konkatenation, keine
 *      ", "-Joins. Arrays gehen 1:1 in den Output.
 *
 *   3. State-only Metadaten (schema_version, case, enabled-Flags, placeholder
 *      Reference-Payloads) werden komplett herausgestrippt. Sie sind für
 *      den UI-State relevant, nicht für NanoBanana.
 *
 *   4. Disabled Module werden übersprungen (§8.2). Ein disabled-Modul
 *      erzeugt NICHT einen leeren Block im Output.
 *
 *   5. `environment` mode `inherit_from_reference` kollabiert weg — die
 *      Inheritance läuft implizit über `references` und
 *      `consistency_rules.keep_constant_across_panels` (§8.6).
 *
 *   6. `panels` wird aus `layout.panel_count` via panelRoleStrategy abgeleitet,
 *      nicht aus dem State gelesen (§8.1).
 *
 *   7. `forbidden_elements` wird aus case_level + Modul-Level + user_level
 *      zu einer flachen deduplizierten Liste gemerget, in genau dieser
 *      Reihenfolge (§8.4).
 *
 *   8. `references.*.payload` wird nur emittiert wenn `type !== "placeholder"`
 *      (§8.7). Ein Placeholder ist ein UI-Label, kein echtes Referenzbild.
 *
 * SKIP-Symbol: emitField gibt `SKIP` zurück wenn ein Feld NICHT im Output
 * erscheinen soll. Der Top-Level-Loop übergeht diese Felder. Das ist
 * expliziter als "null oder undefined bedeutet skip" — null könnte im
 * Output ein valides Feld sein.
 */

import {
  COMPILE_ORDER,
} from "../../cases/characterAngleStudy/schema.js";
import { panelRoleStrategy } from "../../cases/characterAngleStudy/panelRoleStrategy.js";

const SKIP = Symbol("SKIP");

/**
 * Entry-Point für den character_angle_study Serializer.
 * Erwartet einen **bereits validierten** State (validateState() wird im
 * Dispatcher vorher aufgerufen).
 */
export function compileAngleStudyJson(state) {
  const out = {};
  for (const key of COMPILE_ORDER) {
    const value = emitField(key, state);
    if (value !== SKIP) {
      out[key] = value;
    }
  }
  return out;
}

/**
 * Field-Dispatch: ruft den passenden Emit-Handler pro Top-Level-Key auf.
 * Wirft bei unbekannten Keys — COMPILE_ORDER und dieser Switch müssen
 * synchron bleiben, unbekannte Keys sollen laut kaputtgehen.
 */
function emitField(key, state) {
  switch (key) {
    case "id":
    case "type":
    case "goal":
      return state[key];

    case "references":
      return emitReferences(state);

    case "style":
      return state.style;

    case "style_overlay":
      return emitStyleOverlay(state);

    case "layout":
      return state.layout;

    case "panels":
      return emitPanels(state);

    case "orientation_rules":
    case "full_body_rules":
    case "consistency_rules":
    case "pose":
      return state[key];

    case "environment":
      return emitEnvironment(state);

    case "forbidden_elements":
      return emitForbiddenElements(state);

    default:
      throw new Error(
        `json serializer: unknown COMPILE_ORDER key ${JSON.stringify(key)}`
      );
  }
}

/**
 * references — full_body_master ist strukturell Pflicht, face_reference ist
 * ein Modul (§8.2). Module-Emission nur wenn enabled. Placeholder-Payloads
 * werden herausgestrippt (§8.7).
 */
function emitReferences(state) {
  const refs = state.references ?? {};
  const out = {};

  // full_body_master — always present, but payload-stripped
  out.full_body_master = stripRefState(refs.full_body_master);

  // face_reference — module, only if enabled
  if (refs.face_reference?.enabled) {
    out.face_reference = stripRefState(refs.face_reference);
  }

  return out;
}

/**
 * Strippt State-only Felder aus einem Reference-Block:
 *   - enabled    (Modul-Toggle, nur für UI)
 *   - payload    (nur wenn placeholder; echte URL/Blob-Refs bleiben)
 *
 * Behält:
 *   - priority
 *   - authority_over
 *   - payload wenn type != "placeholder"
 */
function stripRefState(ref) {
  const out = {
    priority: ref.priority,
    authority_over: ref.authority_over,
  };
  if (ref.payload && ref.payload.type && ref.payload.type !== "placeholder") {
    out.payload = ref.payload;
  }
  return out;
}

/**
 * style_overlay — Look-Lab-Modul (§8.3). Default disabled → SKIP.
 * Wenn enabled: emittiert source + token (+ optional ref_id für Phase 2
 * Bild-Referenz). enabled-Flag selbst landet NICHT im Output.
 */
function emitStyleOverlay(state) {
  const ov = state.style_overlay;
  if (!ov || !ov.enabled) return SKIP;

  const block = {};
  if (ov.source != null) block.source = ov.source;
  if (ov.token != null) block.token = ov.token;
  if (ov.ref_id != null) block.ref_id = ov.ref_id;
  return block;
}

/**
 * panels — derived aus layout.panel_count via panelRoleStrategy (§8.1).
 * Der State hält KEIN panels-Array; die Ableitung passiert hier.
 * Index ist 1-basiert um zum GT-Beispiel zu matchen.
 */
function emitPanels(state) {
  const count = state.layout?.panel_count;
  return panelRoleStrategy(count).map((role, i) => ({
    index: i + 1,
    view: role.view,
    framing: role.framing,
  }));
}

/**
 * environment — Modul mit Modi (§8.6).
 *   - disabled               → SKIP
 *   - inherit_from_reference → SKIP (inheritance läuft implizit)
 *   - neutral_studio         → { mode: "neutral_studio" }
 *   - custom_text            → { mode: "custom_text", custom_text: "..." }
 */
function emitEnvironment(state) {
  const env = state.environment;
  if (!env || !env.enabled) return SKIP;
  if (env.mode === "inherit_from_reference") return SKIP;

  const block = { mode: env.mode };
  if (env.mode === "custom_text") {
    block.custom_text = env.custom_text;
  }
  return block;
}

/**
 * forbidden_elements — merge case_level + Modul-Level + user_level in
 * eine flache deduplizierte Liste (§8.4). Reihenfolge: case zuerst,
 * dann Module in COMPILE_ORDER-Reihenfolge, dann user.
 *
 * Für Slice 2 tragen weder face_reference noch style_overlay noch
 * environment eigene Forbiddens bei — der 13-Item GT ist voll case_level.
 * `collectModuleForbiddens` ist der Einhängepunkt für spätere Slices.
 */
function emitForbiddenElements(state) {
  const fe = state.forbidden_elements ?? {};
  const caseLevel = Array.isArray(fe.case_level) ? fe.case_level : [];
  const userLevel = Array.isArray(fe.user_level) ? fe.user_level : [];
  const moduleLevel = collectModuleForbiddens(state);

  const seen = new Set();
  const out = [];
  for (const src of [caseLevel, ...moduleLevel, userLevel]) {
    for (const item of src) {
      if (typeof item !== "string") continue;
      if (!seen.has(item)) {
        seen.add(item);
        out.push(item);
      }
    }
  }
  return out;
}

/**
 * Sammelt alle Module-Level-Forbiddens von aktivierten Modulen.
 * Slice 2: kein Modul trägt bei. Hook für spätere Cases/Module.
 */
function collectModuleForbiddens(_state) {
  return [];
}
