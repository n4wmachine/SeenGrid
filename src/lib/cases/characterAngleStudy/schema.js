/**
 * character_angle_study — Schema (Slice-1-Refactor)
 *
 * Die deklarativen Schema-Daten leben jetzt in `schema.json` + `case.json`
 * (Spec §8 Case-Bundle-Format). Diese Datei hält nur noch den
 * `validateState()`-Validator und re-exportiert die kanonischen Konstanten
 * aus dem JSON-Bundle.
 *
 * Wird in Slice 3 obsolet sobald der generische Compiler-Pfad das Bundle
 * direkt liest.
 */

import caseConfig from "./case.json" with { type: "json" };
import schema from "./schema.json" with { type: "json" };

export const SCHEMA_VERSION = caseConfig.schemaVersion;
export const CASE_ID = caseConfig.id;
export const COMPILE_ORDER = schema.compileOrder;
export const ENVIRONMENT_MODES = schema.environmentModes;
export const MODULES = schema.modules;
export const VALID_PANEL_COUNTS = schema.validPanelCounts;

export function validateState(state) {
  const errors = [];

  if (!state || typeof state !== "object") {
    throw new Error("Schema v1 validation failed: state must be an object");
  }

  if (state.schema_version !== SCHEMA_VERSION) {
    errors.push(
      `schema_version must be "${SCHEMA_VERSION}", got ${JSON.stringify(state.schema_version)}`
    );
  }

  if (state.case !== CASE_ID) {
    errors.push(`case must be "${CASE_ID}", got ${JSON.stringify(state.case)}`);
  }

  for (const key of ["id", "type", "goal"]) {
    if (typeof state[key] !== "string" || state[key].length === 0) {
      errors.push(`${key} must be a non-empty string`);
    }
  }

  const fbm = state.references?.full_body_master;
  if (!fbm) {
    errors.push("references.full_body_master is required");
  } else {
    if (typeof fbm.priority !== "number") {
      errors.push("references.full_body_master.priority must be a number");
    }
    if (!Array.isArray(fbm.authority_over)) {
      errors.push("references.full_body_master.authority_over must be an array");
    }
  }

  const fr = state.references?.face_reference;
  if (fr !== undefined) {
    if (typeof fr.enabled !== "boolean") {
      errors.push("references.face_reference.enabled must be a boolean");
    }
    if (typeof fr.priority !== "number") {
      errors.push("references.face_reference.priority must be a number");
    }
    if (!Array.isArray(fr.authority_over)) {
      errors.push("references.face_reference.authority_over must be an array");
    }
  }

  if (!state.style || typeof state.style !== "object") {
    errors.push("style must be an object");
  } else {
    for (const key of ["mode", "not_mode", "finish"]) {
      if (typeof state.style[key] !== "string") {
        errors.push(`style.${key} must be a string`);
      }
    }
  }

  if (state.style_overlay !== undefined) {
    if (typeof state.style_overlay.enabled !== "boolean") {
      errors.push("style_overlay.enabled must be a boolean");
    }
  }

  if (!state.layout || typeof state.layout !== "object") {
    errors.push("layout must be an object");
  } else if (!VALID_PANEL_COUNTS.includes(state.layout.panel_count)) {
    errors.push(
      `layout.panel_count must be one of ${VALID_PANEL_COUNTS.join(", ")} ` +
        `(got ${JSON.stringify(state.layout.panel_count)})`
    );
  }

  if (state.environment !== undefined) {
    if (typeof state.environment.enabled !== "boolean") {
      errors.push("environment.enabled must be a boolean");
    }
    if (!ENVIRONMENT_MODES.includes(state.environment.mode)) {
      errors.push(
        `environment.mode must be one of ${ENVIRONMENT_MODES.join(", ")} ` +
          `(got ${JSON.stringify(state.environment.mode)})`
      );
    }
  }

  const fe = state.forbidden_elements;
  if (!fe || typeof fe !== "object") {
    errors.push("forbidden_elements must be an object");
  } else {
    if (!Array.isArray(fe.case_level)) {
      errors.push("forbidden_elements.case_level must be an array");
    }
    if (!Array.isArray(fe.user_level)) {
      errors.push("forbidden_elements.user_level must be an array");
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Schema v1 validation failed:\n  - ${errors.join("\n  - ")}`
    );
  }

  return true;
}
