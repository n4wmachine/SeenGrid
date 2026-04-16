/**
 * character_normalizer — Schema v1
 *
 * Basiert auf DISTILLATIONS/character-normalizer-json-example.md (empirisch
 * validiert in NanoBanana am 2026-04-15, sogar sauberer als Paragraph-GT).
 *
 * Der Normalizer ist ein Single-Image-Case (kein Grid): er nimmt ein
 * gecropptes/unvollständiges Referenzbild und erzeugt daraus einen
 * sauberen Full-Body Master Reference. Das Ergebnis dient als Input
 * für Step 2 (z.B. character_angle_study).
 *
 * Eigene Compile-Order, eigene Felder (critical_full_body_rule,
 * outfit_preservation, environment_preservation) — NICHT dieselbe
 * Struktur wie character_angle_study.
 */

export const SCHEMA_VERSION = "v1";
export const CASE_ID = "character_normalizer";

/**
 * Compile-Order — bestimmt die Reihenfolge der Top-Level-Keys im
 * Prompt-JSON-Output. Direkt aus dem GT-Beispiel abgeleitet.
 */
export const COMPILE_ORDER = [
  "id",
  "type",
  "goal",
  "references",
  "critical_full_body_rule",
  "outfit_preservation",
  "environment_preservation",
  "pose",
  "framing",
  "lock",
  "forbidden_elements",
];

/**
 * Module für diesen Case. Laut MODULE_AND_CASE_CATALOG.md:
 * - face_reference: ✓ (aber im Normalizer heißt die Ref "reference_b")
 * - style_overlay: ✓
 * - environment_mode: ✓
 *
 * Im MVP ist der Normalizer ein fester Prompt ohne Module-Toggles —
 * die Struktur ist locked weil empirisch validiert. Module kommen
 * post-MVP wenn Jonas sie braucht.
 */
export const MODULES = [];

/**
 * Minimaler Shape-Validator für einen character_normalizer State.
 */
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

  // references — reference_a and reference_b required
  if (!state.references?.reference_a) {
    errors.push("references.reference_a is required");
  }
  if (!state.references?.reference_b) {
    errors.push("references.reference_b is required");
  }

  // critical_full_body_rule
  if (!state.critical_full_body_rule || typeof state.critical_full_body_rule !== "object") {
    errors.push("critical_full_body_rule must be an object");
  }

  // outfit_preservation
  if (!state.outfit_preservation || typeof state.outfit_preservation !== "object") {
    errors.push("outfit_preservation must be an object");
  }

  // environment_preservation
  if (!state.environment_preservation || typeof state.environment_preservation !== "object") {
    errors.push("environment_preservation must be an object");
  }

  // forbidden_elements
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
