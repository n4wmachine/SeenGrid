/**
 * character_normalizer — Serializer Re-Export (Slice-2-Refactor)
 *
 * Die echte Implementation lebt jetzt im Case-Bundle unter
 * `cases/characterNormalizer/serializer.js` (Spec §8). Diese Datei
 * re-exportiert die Compile-Funktion nur, damit `compiler/index.js`
 * unverändert weiterläuft.
 *
 * Wird in Slice 3 obsolet sobald der generische Compiler-Pfad den
 * Bundle-Serializer direkt ansteuert.
 */

export { compileNormalizerJson } from "../../cases/characterNormalizer/serializer.js";
