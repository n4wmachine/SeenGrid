/**
 * character_normalizer — State-Validator
 *
 * JS-Hook des Case-Bundles (Spec §8). Validiert einen character_normalizer
 * State gegen die deklarativen Constraints aus `case.json` + `schema.json`.
 */

import caseConfig from "./case.json" with { type: "json" };

const SCHEMA_VERSION = caseConfig.schemaVersion;
const CASE_ID = caseConfig.id;

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
