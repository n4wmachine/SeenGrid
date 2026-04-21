/**
 * character_normalizer — Schema (Slice-2-Refactor)
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
export const MODULES = schema.modules;

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

  if (!state.references?.reference_a) {
    errors.push("references.reference_a is required");
  }
  if (!state.references?.reference_b) {
    errors.push("references.reference_b is required");
  }

  if (!state.critical_full_body_rule || typeof state.critical_full_body_rule !== "object") {
    errors.push("critical_full_body_rule must be an object");
  }

  if (!state.outfit_preservation || typeof state.outfit_preservation !== "object") {
    errors.push("outfit_preservation must be an object");
  }

  if (!state.environment_preservation || typeof state.environment_preservation !== "object") {
    errors.push("environment_preservation must be an object");
  }

  if (!state.forbidden_elements || typeof state.forbidden_elements !== "object") {
    errors.push("forbidden_elements must be an object");
  } else {
    if (!Array.isArray(state.forbidden_elements.case_level)) {
      errors.push("forbidden_elements.case_level must be an array");
    }
    if (!Array.isArray(state.forbidden_elements.user_level)) {
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
