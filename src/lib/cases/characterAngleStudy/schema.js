/**
 * character_angle_study — Schema Re-Export (Slice-3-Shim)
 *
 * Die deklarativen Daten leben in `case.json` + `schema.json`, der
 * Validator in `validate.js`, die Strategy in `strategy.js`, der
 * Serializer in `serializer.js`. Diese Datei ist ein reiner Re-Export
 * fürs Test-Surface — sobald die Tests auf die neuen Bundle-Pfade
 * umziehen, fällt sie weg.
 */

import caseConfig from "./case.json" with { type: "json" };
import schema from "./schema.json" with { type: "json" };

export const SCHEMA_VERSION = caseConfig.schemaVersion;
export const CASE_ID = caseConfig.id;
export const COMPILE_ORDER = schema.compileOrder;
export const ENVIRONMENT_MODES = schema.environmentModes;
export const MODULES = schema.modules;
export const VALID_PANEL_COUNTS = schema.validPanelCounts;

export { validateState } from "./validate.js";
