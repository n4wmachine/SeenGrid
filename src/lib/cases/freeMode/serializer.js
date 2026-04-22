/**
 * free_mode — Prompt-JSON Serializer
 *
 * JS-Hook des Case-Bundles (Spec §8 + §4 + §7). Übersetzt einen
 * Free-Mode State in ein paste-ready Prompt-JSON. Im Gegensatz zu
 * den Case-Serializern ist hier kein Top-Level-Block "automatisch"
 * — jedes Feld erscheint nur wenn das passende Modul in
 * `state.active_modules` steht (Module-driven Architektur, Slice 5
 * Option A).
 *
 * Mapping Modul → Top-Level-Slot:
 *   style_overlay            → state.style_overlay  block
 *   environment_mode         → state.environment    block
 *   forbidden_elements_user  → forbidden_elements   array
 *   panel_content_fields     → panels[].content     string
 *   random_fill              → kein Output (UI-only)
 *
 * Module ohne Helper (camera_angle, weather_atmosphere, wardrobe,
 * pose_override, expression_emotion, face_reference, multi_character,
 * object_anchor) landen unter `modules_extra` als TODO-Placeholder
 * sobald sie aktiv sind. Echte Helper folgen in späteren Slices.
 *
 * Kern-Invarianten:
 *   1. Key-Reihenfolge im Output folgt schema.json.compileOrder.
 *   2. id/type/goal/layout/panels (ohne content) sind immer da.
 *   3. style_overlay/environment/forbidden_elements/panels[].content
 *      gated auf state.active_modules.
 *   4. modules_extra erscheint nur wenn mindestens ein TODO-Modul
 *      aktiv ist.
 */

import schema from "./schema.json" with { type: "json" };
import { getEmitter, hasEmitter } from "../../modules/emitRegistry.js";

const SKIP = Symbol("SKIP");

const TOP_LEVEL_MODULE_BY_KEY = {
  style_overlay: "style_overlay",
  environment: "environment_mode",
  forbidden_elements: "forbidden_elements_user",
};

const UNIVERSAL_MODULE_IDS = new Set([
  "style_overlay",
  "environment_mode",
  "forbidden_elements_user",
  "panel_content_fields",
  "random_fill",
]);

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
    case "environment":
    case "forbidden_elements":
      return emitGatedTopLevel(key, state);

    case "layout":
      return emitLayout(state);

    case "panels":
      return emitPanels(state);

    case "modules_extra":
      return emitModulesExtra(state);

    default:
      throw new Error(
        `free_mode serializer: unknown compileOrder key ${JSON.stringify(key)}`
      );
  }
}

function isModuleActive(state, moduleId) {
  return Array.isArray(state.active_modules) && state.active_modules.includes(moduleId);
}

function emitGatedTopLevel(key, state) {
  const moduleId = TOP_LEVEL_MODULE_BY_KEY[key];
  if (!moduleId || !isModuleActive(state, moduleId)) return SKIP;

  const emitter = getEmitter(moduleId);
  if (!emitter) return SKIP;

  const block = emitter(state);
  return block == null ? SKIP : block;
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
  const contentEmitter = isModuleActive(state, "panel_content_fields")
    ? getEmitter("panel_content_fields")
    : null;
  // User-definierte Output-Keys (fieldId → key). Default-Fallback
  // pro Feld. User benennt z.B. 'content' → 'pose', 'notes' →
  // 'director_comment'.
  const contentKey = resolveOutputKey(state, "panel_content", "content");
  const notesKey = resolveOutputKey(state, "panel_notes", "notes");

  return panels.map((panel, i) => {
    const out = { index: typeof panel.index === "number" ? panel.index : i + 1 };
    if (contentEmitter) {
      const content = contentEmitter(state, panel);
      if (content != null) out[contentKey] = content;
    }
    // Custom Notes (UI-Feld im Inspector) landen pro Panel.
    // Always-on, kein Modul-Gating — Notes sind reine User-
    // Annotation, kein optionales Feature.
    const notes = typeof panel.notes === "string" ? panel.notes.trim() : "";
    if (notes.length > 0) out[notesKey] = panel.notes;
    return out;
  });
}

function resolveOutputKey(state, fieldId, fallback) {
  const map = state && typeof state.output_keys === "object" ? state.output_keys : null;
  const v = map && typeof map[fieldId] === "string" ? map[fieldId].trim() : "";
  return v.length > 0 ? v : fallback;
}

function emitModulesExtra(state) {
  const active = Array.isArray(state.active_modules) ? state.active_modules : [];
  const out = {};
  for (const moduleId of active) {
    if (UNIVERSAL_MODULE_IDS.has(moduleId)) continue;
    if (hasEmitter(moduleId)) {
      const block = getEmitter(moduleId)(state);
      if (block != null) out[moduleId] = block;
    } else {
      out[moduleId] = {
        _placeholder: true,
        note: `TODO(module-emit-${moduleId}): emitter not implemented yet`,
      };
    }
  }
  return Object.keys(out).length === 0 ? SKIP : out;
}
