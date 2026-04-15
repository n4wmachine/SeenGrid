/**
 * Compiler — Slice 2 Acceptance Tests
 *
 * Plain-Node-Script, konsistent mit dem Slice-1-Test-Harness-Pattern
 * (kein Vitest-Dependency für jetzt).
 *
 * Run:   node src/lib/compiler/compiler.test.mjs
 * Exit:  0 = alle grün, 1 = mindestens einer rot
 *
 * Was getestet wird (BUILD_PLAN §14 Slice 2 Done-Kriterium):
 *
 *   1. compile(default-state) ist BYTE-IDENTISCH (deep equal + string equal)
 *      zu DISTILLATIONS/angle-study-json-example.md
 *   2. Determinismus: zwei Aufrufe produzieren identische Outputs
 *   3. compile wirft bei invalid state / unsupported case
 *   4. Panel-Ableitung funktioniert für 3/4/6/8 (Shape, Länge, framing)
 *   5. Module-Toggles: face_reference disabled → kein Block im Output
 *   6. Module-Toggles: style_overlay enabled → Block erscheint
 *   7. Environment-Modi: inherit_from_reference → kein env-Block;
 *      neutral_studio → env-Block mit mode; custom_text → env-Block mit text
 *   8. Forbiddens-Merge: case + user dedupliziert, case-Reihenfolge bleibt
 *   9. Key-Reihenfolge im Output matched COMPILE_ORDER
 *  10. State-only Felder (schema_version, case, references.*.enabled,
 *      placeholder payloads) sind NICHT im Output
 *
 * Quelle der Wahrheit für Test 1: DISTILLATIONS/angle-study-json-example.md
 * wird via loadAngleStudyGt() zur Laufzeit gelesen (kein Inline-Duplikat).
 */

import { compile, compileToString } from "./index.js";
import { buildDefaultState } from "../cases/characterAngleStudy/defaults.js";
import {
  loadAngleStudyGt,
  GT_FILE_PATH,
} from "../cases/characterAngleStudy/testHelpers.mjs";
import { COMPILE_ORDER } from "../cases/characterAngleStudy/schema.js";

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
    // Find first differing line for a nicer diff
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
  let caughtMessage = "";
  try {
    fn();
  } catch (err) {
    threw = true;
    caughtMessage = err?.message ?? "";
  }
  if (!threw) {
    throw new Error(`${label}: expected function to throw, but it did not`);
  }
  return caughtMessage;
}

function assertContains(haystack, needle, label) {
  if (Array.isArray(haystack)) {
    if (!haystack.includes(needle)) {
      throw new Error(
        `${label}: array does not contain ${JSON.stringify(needle)}`
      );
    }
    return;
  }
  if (typeof haystack === "object" && haystack !== null) {
    if (!(needle in haystack)) {
      throw new Error(`${label}: object has no key ${JSON.stringify(needle)}`);
    }
    return;
  }
  throw new Error(`${label}: haystack is neither array nor object`);
}

function assertNotContains(haystack, needle, label) {
  if (Array.isArray(haystack)) {
    if (haystack.includes(needle)) {
      throw new Error(
        `${label}: array unexpectedly contains ${JSON.stringify(needle)}`
      );
    }
    return;
  }
  if (typeof haystack === "object" && haystack !== null) {
    if (needle in haystack) {
      throw new Error(
        `${label}: object unexpectedly has key ${JSON.stringify(needle)}`
      );
    }
    return;
  }
  throw new Error(`${label}: haystack is neither array nor object`);
}

// ---- Tests -----------------------------------------------------------------

console.log("\ncompiler — Slice 2 acceptance tests\n");
console.log(`  GT source: ${GT_FILE_PATH}\n`);

test("compile(defaultState) deep-equals angle-study-json-example.md", () => {
  const state = buildDefaultState();
  const compiled = compile(state);
  const gt = loadAngleStudyGt();
  assertDeepEqual(compiled, gt, "compile output diverges from GT");
});

test("compileToString(defaultState) byte-matches GT JSON block", () => {
  const state = buildDefaultState();
  const actual = compileToString(state);
  const expected = JSON.stringify(loadAngleStudyGt(), null, 2);
  assertStringEqual(actual, expected, "stringified output diverges from GT");
});

test("compile is deterministic (two calls produce equal outputs)", () => {
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

test("compile throws on unknown case", () => {
  const state = buildDefaultState();
  state.case = "not_a_real_case";
  const msg = assertThrows(
    () => compile(state),
    "compile with unknown case"
  );
  if (!/unsupported case/i.test(msg)) {
    throw new Error(
      `expected error message to mention 'unsupported case', got: ${msg}`
    );
  }
});

test("compile throws on non-object state", () => {
  assertThrows(() => compile(null), "compile(null)");
  assertThrows(() => compile("string"), "compile(string)");
  assertThrows(() => compile(42), "compile(42)");
});

test("panel_count 3: panels array has 3 items with correct views", () => {
  const state = buildDefaultState();
  state.layout.panel_count = 3;
  const out = compile(state);
  assertEquals(out.panels.length, 3, "panels length");
  assertEquals(
    out.panels.map((p) => p.view),
    ["front", "right_profile", "left_profile"],
    "views"
  );
  for (const p of out.panels) {
    if (p.framing !== "full_body") {
      throw new Error(`non-full_body framing: ${p.framing}`);
    }
  }
  // Indices are 1-based and contiguous
  assertEquals(
    out.panels.map((p) => p.index),
    [1, 2, 3],
    "indices"
  );
});

test("panel_count 6: panels array has 6 items, indices 1..6", () => {
  const state = buildDefaultState();
  state.layout.panel_count = 6;
  const out = compile(state);
  assertEquals(out.panels.length, 6, "panels length");
  assertEquals(
    out.panels.map((p) => p.index),
    [1, 2, 3, 4, 5, 6],
    "indices"
  );
});

test("panel_count 8: panels array has 8 items, indices 1..8", () => {
  const state = buildDefaultState();
  state.layout.panel_count = 8;
  const out = compile(state);
  assertEquals(out.panels.length, 8, "panels length");
  assertEquals(
    out.panels.map((p) => p.index),
    [1, 2, 3, 4, 5, 6, 7, 8],
    "indices"
  );
});

test("face_reference disabled → references.face_reference absent in output", () => {
  const state = buildDefaultState();
  state.references.face_reference.enabled = false;
  const out = compile(state);
  assertContains(out.references, "full_body_master", "full_body_master present");
  assertNotContains(out.references, "face_reference", "face_reference absent");
});

test("style_overlay enabled → block appears with source/token", () => {
  const state = buildDefaultState();
  state.style_overlay = {
    enabled: true,
    source: "look_lab",
    token: "warm_neon_diner_glow",
    ref_id: null,
  };
  const out = compile(state);
  assertContains(out, "style_overlay", "style_overlay key present");
  assertEquals(
    out.style_overlay,
    { source: "look_lab", token: "warm_neon_diner_glow" },
    "style_overlay content"
  );
  // enabled flag must NOT leak
  assertNotContains(out.style_overlay, "enabled", "enabled flag stripped");
});

test("style_overlay disabled → no block in output (default)", () => {
  const state = buildDefaultState();
  const out = compile(state);
  assertNotContains(out, "style_overlay", "style_overlay absent");
});

test("environment inherit_from_reference → no environment block", () => {
  const state = buildDefaultState();
  // default already has mode="inherit_from_reference"
  const out = compile(state);
  assertNotContains(out, "environment", "environment absent");
});

test("environment neutral_studio → block with mode", () => {
  const state = buildDefaultState();
  state.environment.mode = "neutral_studio";
  const out = compile(state);
  assertContains(out, "environment", "environment present");
  assertEquals(
    out.environment,
    { mode: "neutral_studio" },
    "environment content"
  );
});

test("environment custom_text → block with mode + custom_text", () => {
  const state = buildDefaultState();
  state.environment.mode = "custom_text";
  state.environment.custom_text = "misty forest at dawn, shallow fog";
  const out = compile(state);
  assertEquals(
    out.environment,
    {
      mode: "custom_text",
      custom_text: "misty forest at dawn, shallow fog",
    },
    "environment content"
  );
});

test("forbidden_elements merges case + user, deduplicates, preserves order", () => {
  const state = buildDefaultState();
  state.forbidden_elements.user_level = [
    "text", // dup with case_level
    "neon_signs", // new
    "rain", // new
    "neon_signs", // dup within user
  ];
  const out = compile(state);
  // case_level order must stay intact at the front
  const caseStart = state.forbidden_elements.case_level;
  for (let i = 0; i < caseStart.length; i++) {
    if (out.forbidden_elements[i] !== caseStart[i]) {
      throw new Error(
        `case_level order broken at index ${i}: ` +
          `expected ${caseStart[i]}, got ${out.forbidden_elements[i]}`
      );
    }
  }
  // user-only items appended in first-seen order
  const userUnique = out.forbidden_elements.slice(caseStart.length);
  assertEquals(userUnique, ["neon_signs", "rain"], "user-unique items");
});

test("compile output key order matches COMPILE_ORDER", () => {
  const state = buildDefaultState();
  const out = compile(state);
  const actual = Object.keys(out);
  // Filter COMPILE_ORDER to only keys that are actually present
  const expected = COMPILE_ORDER.filter((k) => k in out);
  assertEquals(actual, expected, "output key order");
});

test("state-only fields are stripped from output", () => {
  const state = buildDefaultState();
  const out = compile(state);
  // Top-level
  assertNotContains(out, "schema_version", "schema_version stripped");
  assertNotContains(out, "case", "case stripped");
  // References: enabled flag and placeholder payload
  assertNotContains(
    out.references.full_body_master,
    "enabled",
    "full_body_master.enabled stripped (never existed)"
  );
  assertNotContains(
    out.references.full_body_master,
    "payload",
    "full_body_master placeholder payload stripped"
  );
  assertNotContains(
    out.references.face_reference,
    "enabled",
    "face_reference.enabled stripped"
  );
  assertNotContains(
    out.references.face_reference,
    "payload",
    "face_reference placeholder payload stripped"
  );
});

test("real (non-placeholder) reference payload is kept in output", () => {
  const state = buildDefaultState();
  state.references.full_body_master.payload = {
    type: "url",
    url: "https://example.com/master.png",
  };
  const out = compile(state);
  assertEquals(
    out.references.full_body_master.payload,
    { type: "url", url: "https://example.com/master.png" },
    "payload kept"
  );
});

// ---- Summary ---------------------------------------------------------------

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) {
  process.exit(1);
}
