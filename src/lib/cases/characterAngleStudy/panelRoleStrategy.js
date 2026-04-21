/**
 * character_angle_study — Panel-Role-Strategy Re-Export (Slice-1-Refactor)
 *
 * Die echte Implementation lebt jetzt in `strategy.js` (Spec §8
 * Case-Bundle-Format). Diese Datei re-exportiert die API nur noch, damit
 * die bestehenden Imports (Tests, registry.js) unverändert weiterlaufen.
 *
 * Wird in Slice 3 obsolet sobald der generische Compiler-Pfad die
 * Strategy direkt über `strategy.js` ansteuert.
 */

export {
  panelRoleStrategy,
  SUPPORTED_PANEL_COUNTS,
  EMPIRICALLY_VALIDATED_COUNTS,
  isEmpiricallyValidated,
} from "./strategy.js";
