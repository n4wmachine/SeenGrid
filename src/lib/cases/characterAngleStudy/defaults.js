/**
 * buildDefaultState — character_angle_study
 *
 * Baut den Default-State für einen 4-Panel Character Angle Study. Der Default
 * ist so gewählt, dass der Compiler (Slice 2) ihn strukturell identisch zu
 * DISTILLATIONS/angle-study-json-example.md ausgeben kann (modulo den sieben
 * Schema-Lücken-Erweiterungen aus BUILD_PLAN.md §8).
 *
 * Default-Entscheidungen:
 *   - face_reference        : enabled (empirisch zentraler Pfad im GT-Testfall)
 *   - style_overlay         : disabled (Look-Lab-Token kommt erst wenn User auswählt)
 *   - environment           : enabled, mode "inherit_from_reference"
 *                             → Compiler gibt KEINEN environment-Block aus,
 *                               Inheritance läuft implizit via references +
 *                               consistency_rules (matched das GT-Beispiel)
 *   - panel_count           : 4 (die empirisch validierte Konstellation)
 *   - forbidden_elements    : volle 13-Item-Case-Liste aus dem GT-Beispiel,
 *                             user_level leer
 *
 * WICHTIG (CLAUDE.md Anti-Drift): Alle englischen Prompt-Strings sind
 * WORTWÖRTLICH aus DISTILLATIONS/angle-study-json-example.md übernommen. Keine
 * Umformulierung, keine "Optimierung", keine Kürzung. Diese Strings sind
 * empirisch in NanoBanana validiert und werden nur nach neuem Gegentest und
 * explizitem Jonas-OK geändert.
 */

import { SCHEMA_VERSION, CASE_ID } from "./schema.js";

export function buildDefaultState() {
  return {
    // ---- State-only Metadaten (werden vom Compiler entfernt) ----
    schema_version: SCHEMA_VERSION,
    case: CASE_ID,

    // ---- Felder die im Prompt-JSON-Output als Top-Level-Keys landen ----
    // Reihenfolge orientiert sich an COMPILE_ORDER in schema.js.

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
        // Payload-Slot (§8.7 Gap Fix): bei Default ein Placeholder, damit
        // der User das Bild beim Pasten an NanoBanana mitschicken kann.
        payload: {
          type: "placeholder",
          label: "Full-body master reference",
        },
      },
      face_reference: {
        enabled: true,
        priority: 1,
        authority_over: ["facial_identity", "fine_facial_details"],
        payload: {
          type: "placeholder",
          label: "Face reference",
        },
      },
    },

    style: {
      mode: "cinematic_panel_strip",
      not_mode: "neutral_studio_turnaround_sheet",
      finish: "polished",
    },

    // Look Lab Style Overlay (§8.3 Gap Fix) — default disabled
    style_overlay: {
      enabled: false,
      source: null,
      token: null,
      ref_id: null,
    },

    layout: {
      panel_count: 4,
      panel_orientation: "vertical",
      panel_arrangement: "single_horizontal_row",
      panel_spacing: "even",
      figure_margin: "small",
    },

    // Panels werden NICHT im State gehalten — der Compiler leitet sie aus
    // layout.panel_count + panelRoleStrategy ab (§8.1 Gap Fix).

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

    // Environment-Module (§8.6 Gap Fix) — default inherit_from_reference,
    // d.h. der Compiler gibt keinen explizit environment-Block aus.
    environment: {
      enabled: true,
      mode: "inherit_from_reference",
      custom_text: null,
    },

    // Forbidden-Elements in drei Ebenen (§8.4 Gap Fix). Der Compiler merged
    // case_level + alle aktiven Modul-Level-Forbiddens + user_level in eine
    // flache deduplizierte Liste im Output.
    forbidden_elements: {
      case_level: [
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
      user_level: [],
    },
  };
}
