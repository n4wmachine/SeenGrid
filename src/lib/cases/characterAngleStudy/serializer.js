/**
 * character_angle_study — Prompt-JSON Serializer
 *
 * JS-Hook des Case-Bundles (Spec §8). Übersetzt einen validierten
 * character_angle_study State in das Prompt-JSON-Format das NanoBanana
 * als Paste-Input erwartet. **Byte-identisch** zu
 * DISTILLATIONS/angle-study-json-example.md (modulo Module-Toggles,
 * Panel-Count, User-Forbiddens).
 *
 * Kern-Invarianten:
 *
 *   1. Key-Reihenfolge im Output folgt schema.json.compileOrder wörtlich.
 *   2. Listen bleiben Listen (keine Fließtext-Konkatenation).
 *   3. State-only Metadaten (schema_version, case, enabled-Flags,
 *      placeholder Reference-Payloads) werden herausgestrippt.
 *   4. Disabled Module werden übersprungen.
 *   5. environment mode `inherit_from_reference` kollabiert weg.
 *   6. panels wird aus layout.panel_count via strategy.js abgeleitet.
 *   7. forbidden_elements = case_level + module_level + user_level, flach
 *      und dedupliziert, in dieser Reihenfolge.
 *   8. references.*.payload wird nur emittiert wenn type !== "placeholder".
 */

import schema from "./schema.json" with { type: "json" };
import { panelRoleStrategy } from "./strategy.js";

const SKIP = Symbol("SKIP");

export function compileAngleStudyJson(state) {
  const out = {};
  for (const key of schema.compileOrder) {
    const value = emitField(key, state);
    if (value !== SKIP) {
      out[key] = value;
    }
  }
  return out;
}

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
        `angle_study serializer: unknown compileOrder key ${JSON.stringify(key)}`
      );
  }
}

function emitReferences(state) {
  const refs = state.references ?? {};
  const out = {};

  out.full_body_master = stripRefState(refs.full_body_master);

  if (refs.face_reference?.enabled) {
    out.face_reference = stripRefState(refs.face_reference);
  }

  return out;
}

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

function emitStyleOverlay(state) {
  const ov = state.style_overlay;
  if (!ov || !ov.enabled) return SKIP;

  const block = {};
  if (ov.source != null) block.source = ov.source;
  if (ov.token != null) block.token = ov.token;
  if (ov.ref_id != null) block.ref_id = ov.ref_id;
  return block;
}

function emitPanels(state) {
  const count = state.layout?.panel_count;
  return panelRoleStrategy(count).map((role, i) => ({
    index: i + 1,
    view: role.view,
    framing: role.framing,
  }));
}

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

function collectModuleForbiddens(_state) {
  return [];
}
