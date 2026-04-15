/**
 * character_angle_study — Slice 1 Acceptance Test
 *
 * Plain-Node-Script, kein externer Test-Runner (vermeidet Dependency-Bloat
 * für einen einzigen Test; kann später auf Vitest migriert werden wenn
 * tatsächlich mehr Tests dazukommen).
 *
 * Run:   node src/lib/cases/characterAngleStudy/schema.test.mjs
 * Exit:  0 = alle Tests grün, 1 = mindestens ein Test rot
 *
 * Was getestet wird (Slice 1 Done-Kriterium aus BUILD_PLAN.md §14):
 *
 *   1. buildDefaultState() produziert einen schema-validen State
 *   2. schema_version ist "v1", case ist "character_angle_study"
 *   3. panelRoleStrategy(3/4/6/8) gibt die erwarteten Rollen zurück
 *   4. panelRoleStrategy wirft bei unsupported counts
 *   5. EMPIRICALLY_VALIDATED_COUNTS enthält nur 4
 *   6. Der Default-State ist — nach Anwendung der sieben Schema-Lücken-
 *      Normalisierungen — strukturell identisch zu
 *      DISTILLATIONS/angle-study-json-example.md
 *
 * Punkt 6 ist die zentrale Zusage: das was der Slice-2-Compiler später
 * ausgibt muss 1:1 wie das empirisch validierte GT-JSON aussehen (modulo
 * die sieben Gap-Fixes). Dieser Test simuliert den minimal nötigen Teil
 * des Compilers in `projectForComparison` und prüft das Ergebnis gegen
 * das inlinierte GT.
 */

import {
  validateState,
  SCHEMA_VERSION,
  CASE_ID,
} from "./schema.js";
import {
  panelRoleStrategy,
  SUPPORTED_PANEL_COUNTS,
  EMPIRICALLY_VALIDATED_COUNTS,
  isEmpiricallyValidated,
} from "./panelRoleStrategy.js";
import { buildDefaultState } from "./defaults.js";

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

// ---- Ground Truth: angle-study-json-example.md (inlined, wortwörtlich) -----
//
// WICHTIG: Wenn DISTILLATIONS/angle-study-json-example.md sich ändert, muss
// dieser Block hier synchron aktualisiert werden — UND nur nach neuem
// NanoBanana-Test + explizitem Jonas-OK (CLAUDE.md Anti-Drift). Bis dahin
// ist der GT locked.

const ANGLE_STUDY_EXAMPLE_JSON = {
  id: "cinematic_panel_strip_v1",
  type: "character_sheet_cinematic",
  goal: "Create one finished cinematic panel strip as four tall vertical panels arranged side by side in a single horizontal row.",
  references: {
    full_body_master: {
      priority: 1,
      authority_over: [
        "body_proportions",
        "hairstyle",
        "outfit",
        "colors",
        "materials",
        "footwear",
      ],
    },
    face_reference: {
      priority: 1,
      authority_over: ["facial_identity", "fine_facial_details"],
    },
  },
  style: {
    mode: "cinematic_panel_strip",
    not_mode: "neutral_studio_turnaround_sheet",
    finish: "polished",
  },
  layout: {
    panel_count: 4,
    panel_orientation: "vertical",
    panel_arrangement: "single_horizontal_row",
    panel_spacing: "even",
    figure_margin: "small",
  },
  panels: [
    { index: 1, view: "front", framing: "full_body" },
    { index: 2, view: "right_profile", framing: "full_body" },
    { index: 3, view: "left_profile", framing: "full_body" },
    { index: 4, view: "back", framing: "full_body" },
  ],
  orientation_rules: {
    panel_2_must_show: "character_right_side_to_camera",
    panel_3_must_show: "character_left_side_to_camera",
    profiles_must_be_true_opposites: true,
    allow_mirrored_reuse: false,
    allow_duplicate_side_profile: false,
  },
  full_body_rules: {
    show_complete_figure_head_to_feet: true,
    both_shoes_fully_visible_in_every_panel: true,
    allow_cropped_legs: false,
    allow_cropped_feet: false,
    allow_hidden_footwear: false,
  },
  consistency_rules: {
    keep_identical: [
      "facial_identity",
      "hairstyle",
      "body_proportions",
      "outfit",
      "colors",
      "materials",
      "footwear",
    ],
    keep_constant_across_panels: [
      "environment",
      "lighting_direction",
      "mood",
      "rendering_quality",
    ],
  },
  pose: {
    base_pose: "natural_relaxed_standing",
    posture: "calm_balanced",
    only_change: "viewing_angle",
  },
  forbidden_elements: [
    "text",
    "labels",
    "captions",
    "watermarks",
    "extra_characters",
    "extra_props",
    "studio_background",
    "identity_drift",
    "outfit_drift",
    "hairstyle_drift",
    "material_drift",
    "cropped_body_parts",
    "hidden_shoes",
    "mirrored_same_side_profile",
  ],
};

// ---- Minimal Compiler-Projection (Stand-in für Slice 2) --------------------
//
// Simuliert die minimal nötigen Compiler-Transformationen damit der
// Slice-1-State gegen das Slice-0-GT-Beispiel diff-bar ist. Der echte
// Compiler in Slice 2 wird vollständiger sein (Forbiddens-Merge mit
// Modul-Quellen, Key-Order-Enforcement, Versions-Stripping, usw.). Hier
// bilden wir nur die Transformationen ab die für den Default-State relevant
// sind:
//
//   - Entferne State-only-Metadaten (schema_version, case)
//   - Entferne enabled:false Module (style_overlay im Default)
//   - Entferne references.*.enabled und references.*.payload
//   - Entferne environment-Block wenn mode="inherit_from_reference"
//   - Derive panels via panelRoleStrategy + 1-indexierter index
//   - Merge forbidden_elements.case_level + user_level → flaches dedupliziertes Array
//
// Reihenfolge der Keys im Output folgt COMPILE_ORDER aus schema.js.

function projectForComparison(state) {
  const out = {};

  out.id = state.id;
  out.type = state.type;
  out.goal = state.goal;

  // references — strip enabled + payload
  const refs = {
    full_body_master: {
      priority: state.references.full_body_master.priority,
      authority_over: state.references.full_body_master.authority_over,
    },
  };
  if (state.references.face_reference?.enabled) {
    refs.face_reference = {
      priority: state.references.face_reference.priority,
      authority_over: state.references.face_reference.authority_over,
    };
  }
  out.references = refs;

  out.style = state.style;

  // style_overlay: skip if disabled
  if (state.style_overlay?.enabled) {
    out.style_overlay = {
      source: state.style_overlay.source,
      token: state.style_overlay.token,
    };
  }

  out.layout = state.layout;

  // panels: derived via strategy + 1-indexed
  out.panels = panelRoleStrategy(state.layout.panel_count).map((role, i) => ({
    index: i + 1,
    view: role.view,
    framing: role.framing,
  }));

  out.orientation_rules = state.orientation_rules;
  out.full_body_rules = state.full_body_rules;
  out.consistency_rules = state.consistency_rules;
  out.pose = state.pose;

  // environment: only emit if mode != inherit_from_reference
  if (
    state.environment?.enabled &&
    state.environment.mode !== "inherit_from_reference"
  ) {
    const envBlock = { mode: state.environment.mode };
    if (state.environment.mode === "custom_text") {
      envBlock.custom_text = state.environment.custom_text;
    }
    out.environment = envBlock;
  }

  // forbidden_elements: merge case + user, dedupe, preserve case-level order
  const seen = new Set();
  const merged = [];
  for (const item of [
    ...state.forbidden_elements.case_level,
    ...state.forbidden_elements.user_level,
  ]) {
    if (!seen.has(item)) {
      seen.add(item);
      merged.push(item);
    }
  }
  out.forbidden_elements = merged;

  return out;
}

// ---- Tests -----------------------------------------------------------------

console.log("\ncharacter_angle_study — Slice 1 acceptance tests\n");

test("buildDefaultState() produces schema-valid state (v1)", () => {
  const state = buildDefaultState();
  validateState(state);
});

test("default state has schema_version v1 and case character_angle_study", () => {
  const state = buildDefaultState();
  assertEquals(state.schema_version, SCHEMA_VERSION, "schema_version mismatch");
  assertEquals(state.case, CASE_ID, "case mismatch");
});

test("panelRoleStrategy(4) = [front, right_profile, left_profile, back]", () => {
  assertEquals(
    panelRoleStrategy(4).map((r) => r.view),
    ["front", "right_profile", "left_profile", "back"],
    "views mismatch"
  );
});

test("panelRoleStrategy(3) = [front, right_profile, left_profile]", () => {
  assertEquals(
    panelRoleStrategy(3).map((r) => r.view),
    ["front", "right_profile", "left_profile"],
    "views mismatch"
  );
});

test("panelRoleStrategy(6) returns 6 roles (tentative, not validated)", () => {
  assertEquals(panelRoleStrategy(6).length, 6, "wrong length");
});

test("panelRoleStrategy(8) returns 8 roles (tentative, not validated)", () => {
  assertEquals(panelRoleStrategy(8).length, 8, "wrong length");
});

test("panelRoleStrategy(5) throws (unsupported count)", () => {
  assertThrows(() => panelRoleStrategy(5), "panelRoleStrategy(5)");
});

test("every role has framing 'full_body' (structural invariant for this case)", () => {
  for (const count of SUPPORTED_PANEL_COUNTS) {
    for (const role of panelRoleStrategy(count)) {
      if (role.framing !== "full_body") {
        throw new Error(
          `panelRoleStrategy(${count}) produced non-full_body framing: ${role.framing}`
        );
      }
    }
  }
});

test("only panel_count 4 is empirisch-validated in Slice 1", () => {
  if (!isEmpiricallyValidated(4)) {
    throw new Error("panel_count 4 should be validated");
  }
  if (isEmpiricallyValidated(3)) {
    throw new Error("panel_count 3 should NOT be empirisch-validated");
  }
  if (isEmpiricallyValidated(6)) {
    throw new Error("panel_count 6 should NOT be empirisch-validated");
  }
  if (isEmpiricallyValidated(8)) {
    throw new Error("panel_count 8 should NOT be empirisch-validated");
  }
  assertEquals(
    EMPIRICALLY_VALIDATED_COUNTS,
    [4],
    "EMPIRICALLY_VALIDATED_COUNTS mismatch"
  );
});

test("validateState rejects wrong schema_version", () => {
  const state = buildDefaultState();
  state.schema_version = "v0";
  assertThrows(() => validateState(state), "validateState with v0");
});

test("validateState rejects wrong case", () => {
  const state = buildDefaultState();
  state.case = "something_else";
  assertThrows(() => validateState(state), "validateState with wrong case");
});

test("validateState rejects invalid panel_count", () => {
  const state = buildDefaultState();
  state.layout.panel_count = 5;
  assertThrows(() => validateState(state), "validateState with panel_count 5");
});

test("validateState rejects invalid environment mode", () => {
  const state = buildDefaultState();
  state.environment.mode = "space_station";
  assertThrows(() => validateState(state), "validateState with bogus env mode");
});

test("default state projects to structure matching angle-study-json-example.md", () => {
  const projected = projectForComparison(buildDefaultState());
  assertDeepEqual(
    projected,
    ANGLE_STUDY_EXAMPLE_JSON,
    "projected default state does not match GT example"
  );
});

// ---- Summary ---------------------------------------------------------------

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) {
  process.exit(1);
}
