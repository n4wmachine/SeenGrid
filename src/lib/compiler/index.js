/**
 * Compiler — SeenGrid State → Prompt-JSON
 *
 * Dispatcher-Einstiegspunkt für den JSON-Compiler. Nimmt einen Case-State,
 * validiert ihn, routet über die Case-Bundle-Registry auf den
 * case-spezifischen Serializer, gibt das Prompt-JSON zurück.
 *
 * Architektur (Spec §4 + §8, Slice 3):
 *
 *   State-JSON ──► bundleRegistry.hasBundle(state.case)
 *               ──► bundle.validate(state)
 *               ──► bundle.serialize(state)
 *               ──► Prompt-JSON
 *
 * Der Compiler ist **generisch** geworden — kein case-spezifischer
 * Switch-Case mehr. Neue Cases werden als Registry-Eintrag in
 * `cases/bundleRegistry.js` gepflegt.
 *
 * Zwei Entry-Points:
 *   - compile(state)         → JS-Objekt (für Diff, Tests, Preview)
 *   - compileToString(state) → deterministischer JSON-String mit 2-Space
 *                              Indent (für Paste in NanoBanana)
 */

import { getBundle, hasBundle, listCaseIds } from "../cases/bundleRegistry.js";

export function compile(state) {
  if (!state || typeof state !== "object") {
    throw new Error("compile: state must be an object");
  }

  if (!hasBundle(state.case)) {
    throw new Error(
      `compile: unsupported case ${JSON.stringify(state.case)}. ` +
        `Known: ${listCaseIds().join(", ")}.`
    );
  }

  const bundle = getBundle(state.case);
  bundle.validate(state);
  return bundle.serialize(state);
}

export function compileToString(state) {
  return JSON.stringify(compile(state), null, 2);
}
