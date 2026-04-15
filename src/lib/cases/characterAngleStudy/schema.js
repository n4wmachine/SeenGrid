/**
 * character_angle_study — Schema v1
 *
 * Basiert auf DISTILLATIONS/angle-study-json-example.md (empirisch validiert
 * in NanoBanana am 2026-04-15, 1:1 gleiche Ausgabe wie der Paragraph-GT)
 * plus die sieben Schema-Lücken aus BUILD_PLAN.md §8 und die vier
 * Struktur-Prinzipien aus BUILD_PLAN.md §5.4:
 *
 *   1. Prioritäten werden wörtlich als `priority` / `authority_over` kodiert
 *   2. Listen bleiben Listen (keine Fließtext-Konkatenation)
 *   3. Harte Regeln sind Booleans oder typisierte Enums
 *   4. Reihenfolge im Output = Priorität (stabile Compile-Order, siehe
 *      COMPILE_ORDER unten)
 *
 * WICHTIG: Dies ist ein **State-Schema**, kein Prompt-JSON-Schema (siehe
 * BUILD_PLAN §5.1). Der State hält Felder (schema_version, enabled-Flags,
 * reference payloads) die im Prompt-Output NICHT erscheinen. Der Compiler
 * (Slice 2) übersetzt State-JSON → Prompt-JSON.
 */

export const SCHEMA_VERSION = "v1";
export const CASE_ID = "character_angle_study";

/**
 * Compile-Order — bestimmt die Reihenfolge der Top-Level-Keys im
 * Prompt-JSON-Output. Stabil. NanoBanana und Grok Imagine interpretieren
 * Key-Reihenfolge in der Praxis als Priorität, also gehören wichtige
 * Constraints nach oben, weiche Präferenzen nach unten. Siehe
 * BUILD_PLAN.md §5.4 Prinzip 4.
 *
 * Diese Liste wird vom Slice-2-Compiler wörtlich iteriert. Keine
 * Umsortierung im Serializer, keine alphabetische Ausgabe, keine
 * implizite Reihenfolge durch Object-Key-Insertion.
 */
export const COMPILE_ORDER = [
  "id",
  "type",
  "goal",
  "references",
  "style",
  "style_overlay",
  "layout",
  "panels",
  "orientation_rules",
  "full_body_rules",
  "consistency_rules",
  "pose",
  "environment",
  "forbidden_elements",
];

/**
 * Environment-Modi (§8.6 Gap Fix).
 *
 *   - inherit_from_reference : Environment wird aus Referenzbild übernommen.
 *                              Der Compiler gibt KEINEN expliziten
 *                              environment-Block aus (die Inheritance
 *                              läuft implizit über `references` +
 *                              `consistency_rules.keep_constant_across_panels`).
 *   - neutral_studio         : Expliziter Studio-Backdrop-Block im Output.
 *   - custom_text            : User beschreibt die Umgebung in Worten;
 *                              der Text-String landet im Output-Block.
 *
 * image_reference ist Phase 2 (BUILD_PLAN §11.2) und im MVP nicht unterstützt.
 */
export const ENVIRONMENT_MODES = [
  "inherit_from_reference",
  "neutral_studio",
  "custom_text",
];

/**
 * Module-Registry für diesen Case. Jedes Modul hat ein `enabled`-Flag
 * (§8.2 Gap Fix) und wird beim Compilen übersprungen wenn disabled.
 *
 * Case-Level-Felder (orientation_rules, full_body_rules,
 * consistency_rules, pose, layout, style) sind KEINE Module — sie sind
 * strukturell fix für diesen Case und werden nicht toggelbar angeboten.
 * Das ist die Kern-Idee von Constrained Modularity (BUILD_PLAN §6).
 */
export const MODULES = ["face_reference", "style_overlay", "environment"];

/**
 * Valide Panel-Counts für diesen Case. Siehe panelRoleStrategy.js für die
 * konkrete Role-Ableitung pro Count.
 */
export const VALID_PANEL_COUNTS = [3, 4, 6, 8];

/**
 * Minimaler Shape-/Type-Validator für einen character_angle_study State.
 *
 * Wirft einen Error mit kompakter Fehlerliste wenn der State ungültig ist.
 * Das ist KEIN vollwertiger JSON-Schema-Validator (Ajv o.ä.) — nur genug
 * Shape-Checks um Slice 1 zu gaten. Ein robusterer Validator kann später
 * nachgezogen werden wenn er real gebraucht wird (YAGNI).
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

  // Top-level strings that become prompt-JSON keys verbatim
  for (const key of ["id", "type", "goal"]) {
    if (typeof state[key] !== "string" || state[key].length === 0) {
      errors.push(`${key} must be a non-empty string`);
    }
  }

  // references.full_body_master — required, not a module
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

  // references.face_reference — module (may be absent; if present must have enabled flag)
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

  // style — structural, always present
  if (!state.style || typeof state.style !== "object") {
    errors.push("style must be an object");
  } else {
    for (const key of ["mode", "not_mode", "finish"]) {
      if (typeof state.style[key] !== "string") {
        errors.push(`style.${key} must be a string`);
      }
    }
  }

  // style_overlay — module (§8.3)
  if (state.style_overlay !== undefined) {
    if (typeof state.style_overlay.enabled !== "boolean") {
      errors.push("style_overlay.enabled must be a boolean");
    }
  }

  // layout — structural
  if (!state.layout || typeof state.layout !== "object") {
    errors.push("layout must be an object");
  } else if (!VALID_PANEL_COUNTS.includes(state.layout.panel_count)) {
    errors.push(
      `layout.panel_count must be one of ${VALID_PANEL_COUNTS.join(", ")} ` +
        `(got ${JSON.stringify(state.layout.panel_count)})`
    );
  }

  // environment — module with modes (§8.6)
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

  // forbidden_elements — three-level split (§8.4)
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
