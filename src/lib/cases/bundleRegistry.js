/**
 * Case-Bundle-Registry (Spec §8 + Slice 3)
 *
 * Zentraler Einstiegspunkt für den generischen Compiler-Pfad. Jeder Case
 * liefert hier sein vollständiges Bundle:
 *
 *   - caseConfig  (case.json)     : Metadaten + defaultState
 *   - schema      (schema.json)   : compileOrder, modules, etc.
 *   - validate    (validate.js)   : validateState(state)
 *   - serialize   (serializer.js) : compileToPromptJson(state)
 *   - strategy?   (strategy.js)   : optional, nur bei Cases mit Panel-Ableitung
 *                                   (angle_study = panelRoleStrategy,
 *                                    normalizer / free_mode = undefined)
 *
 * `compiler/index.js` dispatched ausschließlich über diese Registry —
 * kein Fallback-Switch auf case-IDs. Neue Cases = neuer Registry-Eintrag,
 * kein Compiler-Edit.
 */

import angleStudyCase from "./characterAngleStudy/case.json" with { type: "json" };
import angleStudySchema from "./characterAngleStudy/schema.json" with { type: "json" };
import { validateState as validateAngleStudy } from "./characterAngleStudy/validate.js";
import { compileAngleStudyJson } from "./characterAngleStudy/serializer.js";
import { panelRoleStrategy } from "./characterAngleStudy/strategy.js";

import normalizerCase from "./characterNormalizer/case.json" with { type: "json" };
import normalizerSchema from "./characterNormalizer/schema.json" with { type: "json" };
import { validateState as validateNormalizer } from "./characterNormalizer/validate.js";
import { compileNormalizerJson } from "./characterNormalizer/serializer.js";

import freeModeCase from "./freeMode/case.json" with { type: "json" };
import freeModeSchema from "./freeMode/schema.json" with { type: "json" };
import { validateState as validateFreeMode } from "./freeMode/validate.js";
import { compileFreeModeJson } from "./freeMode/serializer.js";

const BUNDLES = {
  [angleStudyCase.id]: {
    caseConfig: angleStudyCase,
    schema: angleStudySchema,
    validate: validateAngleStudy,
    serialize: compileAngleStudyJson,
    strategy: panelRoleStrategy,
  },
  [normalizerCase.id]: {
    caseConfig: normalizerCase,
    schema: normalizerSchema,
    validate: validateNormalizer,
    serialize: compileNormalizerJson,
  },
  [freeModeCase.id]: {
    caseConfig: freeModeCase,
    schema: freeModeSchema,
    validate: validateFreeMode,
    serialize: compileFreeModeJson,
  },
};

export function getBundle(caseId) {
  const bundle = BUNDLES[caseId];
  if (!bundle) {
    throw new Error(
      `bundleRegistry: unknown case ${JSON.stringify(caseId)}. ` +
        `Known: ${Object.keys(BUNDLES).join(", ")}.`
    );
  }
  return bundle;
}

export function hasBundle(caseId) {
  return Object.prototype.hasOwnProperty.call(BUNDLES, caseId);
}

export function listCaseIds() {
  return Object.keys(BUNDLES);
}
