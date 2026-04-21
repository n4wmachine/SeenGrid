/**
 * character_normalizer — Default-State (Slice-2-Refactor)
 *
 * Der Default-State lebt jetzt in `case.json.defaultState` (Spec §8
 * Case-Bundle-Format). Diese Datei re-exportiert einen tiefen Klon davon
 * unter der alten API. Strings bleiben byte-identisch zum empirisch
 * validierten GT-Prompt aus DISTILLATIONS/character-normalizer-json-example.md.
 *
 * Wird in Slice 3 obsolet sobald der generische Compiler-Pfad
 * `case.json.defaultState` direkt liest.
 */

import caseConfig from "./case.json" with { type: "json" };

export function buildDefaultState() {
  return structuredClone(caseConfig.defaultState);
}
