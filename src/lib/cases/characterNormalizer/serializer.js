/**
 * character_normalizer — Prompt-JSON Serializer
 *
 * JS-Hook des Case-Bundles (Spec §8). Übersetzt einen validierten
 * character_normalizer State in das Prompt-JSON das NanoBanana als
 * Paste-Input erwartet. **Byte-identisch** zu
 * DISTILLATIONS/character-normalizer-json-example.md.
 *
 * Einfacher als der Angle-Study-Serializer: kein Panel-Ableitung, keine
 * Module-Toggles (MVP), keine Environment-Modi. Locked Prompt.
 *
 * Kern-Invarianten:
 *   1. Key-Reihenfolge im Output folgt schema.json.compileOrder wörtlich.
 *   2. references-Reihenfolge folgt schema.json.referenceOrder
 *      (reference_b vor reference_a per GT).
 *   3. State-only Metadaten (schema_version, case, placeholder Payloads)
 *      werden herausgestrippt.
 *   4. forbidden_elements = case_level + user_level, flach & dedupliziert.
 */

import schema from "./schema.json" with { type: "json" };

const SKIP = Symbol("SKIP");

export function compileNormalizerJson(state) {
  const out = {};
  for (const key of schema.compileOrder) {
    const value = emitField(key, state);
    if (value !== SKIP) {
      out[key] = value;
    }
  }
  return out;
}

function emitField(key, state) {
  switch (key) {
    case "id":
    case "type":
    case "goal":
      return state[key];

    case "references":
      return emitReferences(state);

    case "critical_full_body_rule":
    case "outfit_preservation":
    case "environment_preservation":
    case "pose":
    case "framing":
    case "lock":
      return state[key];

    case "forbidden_elements":
      return emitForbiddenElements(state);

    default:
      throw new Error(
        `normalizer json serializer: unknown compileOrder key ${JSON.stringify(key)}`
      );
  }
}

function emitReferences(state) {
  const refs = state.references ?? {};
  const out = {};

  for (const refKey of schema.referenceOrder) {
    const ref = refs[refKey];
    if (!ref) continue;
    const clean = {
      priority: ref.priority,
      authority_over: ref.authority_over,
    };
    if (ref.payload && ref.payload.type && ref.payload.type !== "placeholder") {
      clean.payload = ref.payload;
    }
    out[refKey] = clean;
  }

  return out;
}

function emitForbiddenElements(state) {
  const fe = state.forbidden_elements ?? {};
  const caseLevel = Array.isArray(fe.case_level) ? fe.case_level : [];
  const userLevel = Array.isArray(fe.user_level) ? fe.user_level : [];

  const seen = new Set();
  const out = [];
  for (const src of [caseLevel, userLevel]) {
    for (const item of src) {
      if (typeof item !== "string") continue;
      if (!seen.has(item)) {
        seen.add(item);
        out.push(item);
      }
    }
  }
  return out;
}
