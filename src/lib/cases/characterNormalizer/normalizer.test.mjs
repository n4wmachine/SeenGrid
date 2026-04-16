/**
 * character_normalizer — Slice 8 Acceptance Tests
 *
 * Run:   node src/lib/cases/characterNormalizer/normalizer.test.mjs
 * Exit:  0 = alle grün, 1 = mindestens einer rot
 *
 * Tests:
 *   1. buildDefaultState() produces schema-valid state
 *   2. compile(defaultState) deep-equals normalizer GT
 *   3. compileToString byte-matches GT
 *   4. compile is deterministic
 *   5. compile throws on invalid state
 *   6. Key-order matches COMPILE_ORDER
 *   7. State-only fields stripped (schema_version, case, placeholder payloads)
 *   8. forbidden_elements merges case + user, deduplicates
 *   9. Normalizer dispatch works through main compile()
 */

import { compile, compileToString } from "../../compiler/index.js";
import { buildDefaultState } from "./defaults.js";
import { validateState, COMPILE_ORDER } from "./schema.js";
import { loadNormalizerGt, GT_FILE_PATH } from "./testHelpers.mjs";

// ---- Mini Test Harness -----------------------------------------------------

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  \u2713 ${name}`);
  } catch (err) {
    failed++;
    console.error(`  \u2717 ${name}`);
    console.error(`    ${err.message}`);
  }
}

function assertEquals(actual, expected, label) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    throw new Error(
      `${label}\n      expected: ${e}\n      actual:   ${a}`
    );
  }
}

function assertDeepEqual(actual, expected, label) {
  const a = JSON.stringify(actual, null, 2);
  const e = JSON.stringify(expected, null, 2);
  if (a !== e) {
    throw new Error(
      `${label}\n--- expected ---\n${e}\n--- actual ---\n${a}`
    );
  }
}

function assertStringEqual(actual, expected, label) {
  if (actual !== expected) {
    const aLines = actual.split("\n");
    const eLines = expected.split("\n");
    const max = Math.max(aLines.length, eLines.length);
    let diffLine = -1;
    for (let i = 0; i < max; i++) {
      if (aLines[i] !== eLines[i]) {
        diffLine = i;
        break;
      }
    }
    throw new Error(
      `${label}\n  first diff at line ${diffLine + 1}:` +
        `\n    expected: ${JSON.stringify(eLines[diffLine] ?? "")}` +
        `\n    actual:   ${JSON.stringify(aLines[diffLine] ?? "")}`
    );
  }
}

function assertThrows(fn, label) {
  let threw = false;
  try {
    fn();
  } catch {
    threw = true;
  }
  if (!threw) {
    throw new Error(`${label}: expected function to throw, but it did not`);
  }
}

function assertNotContains(haystack, needle, label) {
  if (typeof haystack === "object" && haystack !== null && needle in haystack) {
    throw new Error(
      `${label}: object unexpectedly has key ${JSON.stringify(needle)}`
    );
  }
}

// ---- Tests -----------------------------------------------------------------

console.log("\ncharacter_normalizer — Slice 8 acceptance tests\n");
console.log(`  GT source: ${GT_FILE_PATH}\n`);

test("buildDefaultState() produces schema-valid state", () => {
  const state = buildDefaultState();
  validateState(state);
});

test("compile(defaultState) deep-equals normalizer GT", () => {
  const state = buildDefaultState();
  const compiled = compile(state);
  const gt = loadNormalizerGt();
  assertDeepEqual(compiled, gt, "compile output diverges from GT");
});

test("compileToString(defaultState) byte-matches GT JSON block", () => {
  const state = buildDefaultState();
  const actual = compileToString(state);
  const expected = JSON.stringify(loadNormalizerGt(), null, 2);
  assertStringEqual(actual, expected, "stringified output diverges from GT");
});

test("compile is deterministic", () => {
  const state = buildDefaultState();
  const a = compile(state);
  const b = compile(state);
  assertDeepEqual(a, b, "two compile calls diverged");
});

test("compile throws on invalid state (wrong schema_version)", () => {
  const state = buildDefaultState();
  state.schema_version = "v0";
  assertThrows(() => compile(state), "compile with v0");
});

test("compile throws on wrong case id", () => {
  const state = buildDefaultState();
  state.case = "not_a_case";
  assertThrows(() => compile(state), "compile with wrong case");
});

test("output key order matches COMPILE_ORDER", () => {
  const state = buildDefaultState();
  const out = compile(state);
  const actual = Object.keys(out);
  const expected = COMPILE_ORDER.filter((k) => k in out);
  assertEquals(actual, expected, "output key order");
});

test("state-only fields stripped from output", () => {
  const state = buildDefaultState();
  const out = compile(state);
  assertNotContains(out, "schema_version", "schema_version stripped");
  assertNotContains(out, "case", "case stripped");
  // placeholder payloads stripped
  assertNotContains(
    out.references.reference_a,
    "payload",
    "reference_a placeholder payload stripped"
  );
  assertNotContains(
    out.references.reference_b,
    "payload",
    "reference_b placeholder payload stripped"
  );
});

test("forbidden_elements merges case + user, deduplicates", () => {
  const state = buildDefaultState();
  state.forbidden_elements.user_level = [
    "text", // dup
    "neon_signs", // new
  ];
  const out = compile(state);
  // case_level items first
  const caseItems = state.forbidden_elements.case_level;
  for (let i = 0; i < caseItems.length; i++) {
    if (out.forbidden_elements[i] !== caseItems[i]) {
      throw new Error(
        `case_level order broken at ${i}: expected ${caseItems[i]}, got ${out.forbidden_elements[i]}`
      );
    }
  }
  // user-only appended
  const userUnique = out.forbidden_elements.slice(caseItems.length);
  assertEquals(userUnique, ["neon_signs"], "user-unique items");
});

// ---- Summary ---------------------------------------------------------------

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) {
  process.exit(1);
}
