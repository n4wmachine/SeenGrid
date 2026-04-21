/**
 * character_angle_study — Serializer Re-Export (Slice-1-Refactor)
 *
 * Die echte Implementation lebt jetzt im Case-Bundle unter
 * `cases/characterAngleStudy/serializer.js` (Spec §8). Diese Datei
 * re-exportiert die Compile-Funktion nur, damit `compiler/index.js`
 * unverändert weiterläuft.
 *
 * Wird in Slice 3 obsolet sobald der generische Compiler-Pfad den
 * Bundle-Serializer direkt ansteuert.
 */

export { compileAngleStudyJson } from "../../cases/characterAngleStudy/serializer.js";
