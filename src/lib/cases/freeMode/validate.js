/**
 * free_mode — State-Validator
 *
 * JS-Hook des Case-Bundles (Spec §8). Free-Mode ist absichtlich
 * liberaler als die Case-Validatoren: keine Panel-Role-Constraints,
 * keine Module-Whitelist, keine feste References-Shape. Nur Grund-
 * Invarianten die der Serializer benötigt.
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

  // id / type / goal sind im Free-Mode optional. Der Serializer
  // skippt Leer-Strings, damit im NanoBanana-Prompt keine generischen
  // Platzhalter landen. Validator akzeptiert daher String oder
  // leer — nur andere Typen sind hart invalid.
  for (const key of ["id", "type", "goal"]) {
    if (state[key] !== undefined && typeof state[key] !== "string") {
      errors.push(`${key} must be a string if set`);
    }
  }

  if (!state.layout || typeof state.layout !== "object") {
    errors.push("layout must be an object");
  } else if (typeof state.layout.panel_count !== "number" || state.layout.panel_count < 1) {
    errors.push("layout.panel_count must be a positive number");
  }

  if (!Array.isArray(state.panels)) {
    errors.push("panels must be an array");
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
