/**
 * Compiler — SeenGrid State → Prompt-JSON
 *
 * Dispatcher-Einstiegspunkt für den JSON-Compiler. Nimmt einen Case-State,
 * validiert ihn, routet auf den case-spezifischen Serializer, gibt das
 * Prompt-JSON zurück.
 *
 * Architektur (BUILD_PLAN §5.1 + §6 Constrained Modularity):
 *
 *   State-JSON  ──► validateState()  ──► case-aware serializer  ──► Prompt-JSON
 *
 * Der Compiler ist **case-aware**, nicht modul-agnostisch. Jeder Case hat
 * seine eigene bekannte Feld-Menge und Compile-Order (siehe z.B.
 * characterAngleStudy/schema.js COMPILE_ORDER). Es gibt bewusst KEINEN
 * generischen "iteriere über alle Module und füge sie dem Output hinzu"
 * Pfad — Cases sind kuratierte, empirisch getestete Konstellationen.
 *
 * Zwei Entry-Points:
 *
 *   - compile(state)         → JS-Objekt (für Diff, Tests, Preview)
 *   - compileToString(state) → deterministischer JSON-String mit 2-Space
 *                              Indent (für Paste in NanoBanana)
 *
 * Warum zwei: Tests und UI brauchen das Objekt, der End-User braucht den
 * String. compileToString ist dünner Wrapper, aber explizit damit niemand
 * in Tests JSON.stringify mit unterschiedlichen Indents aufruft.
 */

import {
  validateState as validateAngleStudyState,
  CASE_ID as ANGLE_STUDY_CASE_ID,
} from "../cases/characterAngleStudy/schema.js";
import {
  validateState as validateNormalizerState,
  CASE_ID as NORMALIZER_CASE_ID,
} from "../cases/characterNormalizer/schema.js";
import { compileAngleStudyJson } from "./serializers/json.js";
import { compileNormalizerJson } from "./serializers/normalizerJson.js";

/**
 * Compile-Dispatch — routet auf den case-spezifischen Serializer.
 *
 * Wirft wenn der State keiner bekannten Case-ID entspricht. Das ist Absicht:
 * unsupported Cases sollen laut kaputtgehen, nicht still ein generisches
 * JSON ausspucken.
 */
export function compile(state) {
  if (!state || typeof state !== "object") {
    throw new Error("compile: state must be an object");
  }

  switch (state.case) {
    case ANGLE_STUDY_CASE_ID:
      validateAngleStudyState(state);
      return compileAngleStudyJson(state);

    case NORMALIZER_CASE_ID:
      validateNormalizerState(state);
      return compileNormalizerJson(state);

    default:
      throw new Error(
        `compile: unsupported case ${JSON.stringify(state.case)}. ` +
          `Known: ${ANGLE_STUDY_CASE_ID}, ${NORMALIZER_CASE_ID}.`
      );
  }
}

/**
 * Compile-to-String — gibt den deterministischen Paste-Ready-String zurück.
 * 2-Space-Indent, identisch zum Format in DISTILLATIONS/angle-study-json-example.md.
 */
export function compileToString(state) {
  return JSON.stringify(compile(state), null, 2);
}
