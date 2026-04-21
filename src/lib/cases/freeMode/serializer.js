/**
 * free_mode — Prompt-JSON Serializer
 *
 * JS-Hook des Case-Bundles (Spec §8 + §4). Übersetzt einen Free-Mode
 * State in ein paste-ready Prompt-JSON. Im Gegensatz zu den Case-
 * Serializern gibt es hier keine feste Feld-Menge — der Free-Mode
 * emittiert generisch was im State steht, mit SKIP-Regeln für
 * leere/disabled Blöcke.
 *
 * Kern-Invarianten:
 *   1. Key-Reihenfolge im Output folgt schema.json.compileOrder.
 *   2. Leere references → SKIP.
 *   3. style_overlay / environment nur wenn enabled.
 *   4. panels aus state.panels[] 1:1 (nicht aus einer Strategy).
 *      Jedes Panel: { index, content? }, content nur wenn non-empty.
 *   5. forbidden_elements = case_level + user_level, dedupliziert.
 *   6. modules_extra kommt in Slice 5 — in Slice 4 noch SKIP.
 */

import schema from "./schema.json" with { type: "json" };

const SKIP = Symbol("SKIP");

export function compileFreeModeJson(state) {
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

    case "style_overlay":
      return emitStyleOverlay(state);

    case "layout":
      return emitLayout(state);

    case "panels":
      return emitPanels(state);

    case "environment":
      return emitEnvironment(state);

    case "forbidden_elements":
      return emitForbiddenElements(state);

    case "modules_extra":
      return SKIP;

    default:
      throw new Error(
        `free_mode serializer: unknown compileOrder key ${JSON.stringify(key)}`
      );
  }
}

function emitReferences(state) {
  const refs = state.references;
  if (!refs || typeof refs !== "object") return SKIP;
  const keys = Object.keys(refs);
  if (keys.length === 0) return SKIP;

  const out = {};
  for (const k of keys) {
    const ref = refs[k];
    if (!ref) continue;
    const clean = {};
    if (typeof ref.priority === "number") clean.priority = ref.priority;
    if (Array.isArray(ref.authority_over)) clean.authority_over = ref.authority_over;
    if (ref.payload && ref.payload.type && ref.payload.type !== "placeholder") {
      clean.payload = ref.payload;
    }
    out[k] = clean;
  }
  return Object.keys(out).length === 0 ? SKIP : out;
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

function emitLayout(state) {
  const l = state.layout ?? {};
  const block = { panel_count: l.panel_count };
  if (typeof l.rows === "number") block.rows = l.rows;
  if (typeof l.cols === "number") block.cols = l.cols;
  if (l.panel_orientation) block.panel_orientation = l.panel_orientation;
  return block;
}

function emitPanels(state) {
  const panels = Array.isArray(state.panels) ? state.panels : [];
  return panels.map((panel, i) => {
    const out = { index: typeof panel.index === "number" ? panel.index : i + 1 };
    if (typeof panel.content === "string" && panel.content.trim().length > 0) {
      out.content = panel.content;
    }
    return out;
  });
}

function emitEnvironment(state) {
  const env = state.environment;
  if (!env || !env.enabled) return SKIP;

  const block = { mode: env.mode };
  if (env.mode === "custom_text" && env.custom_text) {
    block.custom_text = env.custom_text;
  }
  return block;
}

function emitForbiddenElements(state) {
  const fe = state.forbidden_elements ?? {};
  const caseLevel = Array.isArray(fe.case_level) ? fe.case_level : [];
  const userLevel = Array.isArray(fe.user_level) ? fe.user_level : [];

  const seen = new Set();
  const out = [];
  for (const src of [caseLevel, userLevel]) {
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
