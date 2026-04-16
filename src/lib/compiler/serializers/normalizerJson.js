/**
 * JSON-Serializer — character_normalizer
 *
 * Übersetzt einen validierten character_normalizer State in das Prompt-JSON.
 * Ausgabe-Format ist byte-identisch zu
 * DISTILLATIONS/character-normalizer-json-example.md.
 *
 * Einfacher als der Angle-Study-Serializer: kein Panel-Ableitung, keine
 * Module-Toggles (MVP), keine Environment-Modi. Der Normalizer ist ein
 * locked Prompt — die Struktur ist empirisch validiert und wird 1:1
 * durchgereicht.
 *
 * State-only Felder (schema_version, case, payload placeholders) werden
 * gestrippt. forbidden_elements wird aus case_level + user_level gemerget.
 */

import { COMPILE_ORDER } from "../../cases/characterNormalizer/schema.js";

const SKIP = Symbol("SKIP");

export function compileNormalizerJson(state) {
  const out = {};
  for (const key of COMPILE_ORDER) {
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
        `normalizer json serializer: unknown COMPILE_ORDER key ${JSON.stringify(key)}`
      );
  }
}

/**
 * references — strip State-only fields (enabled, placeholder payloads).
 * GT order: reference_b first, then reference_a.
 */
function emitReferences(state) {
  const refs = state.references ?? {};
  const out = {};

  // GT order: reference_b, reference_a
  for (const refKey of ["reference_b", "reference_a"]) {
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

/**
 * forbidden_elements — merge case_level + user_level, deduplicate.
 */
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
