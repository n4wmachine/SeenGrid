# Angle Study — JSON Schema Example (empirisch validiert)

**Datum:** 2026-04-15
**Status:** NanoBanana-validiert — 1:1 gleicher Output wie der Paragraph-GT
**Quelle:** Mit ChatGPT aus dem validierten Paragraph-Prompt in
`character-study-chatgpt-groundtruth.md` → Step 2 übersetzt. Getestet von Jonas
am 2026-04-15 in NanoBanana, Ergebnis: identisches Bild wie mit dem
Paragraph-Prompt.
**Zweck:** Dies ist der **empirische Beweis** dass strukturiertes JSON als
interne Repräsentation für den Custom Builder funktioniert. Nicht das finale
Schema, sondern ein erster Wurf den wir für den Neubau als Ausgangspunkt
benutzen.
**Wichtig:** ChatGPT hatte beim Übersetzen keinen Projektkontext — das ist ein
Proof of Concept, nicht ein Architekturvorschlag. Der Neubau entwickelt sein
eigenes Schema aus diesem Start plus den im BUILD_PLAN dokumentierten
sieben Lücken.

---

## JSON (wortwörtlich, empirisch validiert)

```json
{
  "id": "cinematic_panel_strip_v1",
  "type": "character_sheet_cinematic",
  "goal": "Create one finished cinematic panel strip as four tall vertical panels arranged side by side in a single horizontal row.",
  "references": {
    "full_body_master": {
      "priority": 1,
      "authority_over": [
        "body_proportions",
        "hairstyle",
        "outfit",
        "colors",
        "materials",
        "footwear"
      ]
    },
    "face_reference": {
      "priority": 1,
      "authority_over": [
        "facial_identity",
        "fine_facial_details"
      ]
    }
  },
  "style": {
    "mode": "cinematic_panel_strip",
    "not_mode": "neutral_studio_turnaround_sheet",
    "finish": "polished"
  },
  "layout": {
    "panel_count": 4,
    "panel_orientation": "vertical",
    "panel_arrangement": "single_horizontal_row",
    "panel_spacing": "even",
    "figure_margin": "small"
  },
  "panels": [
    {
      "index": 1,
      "view": "front",
      "framing": "full_body"
    },
    {
      "index": 2,
      "view": "right_profile",
      "framing": "full_body"
    },
    {
      "index": 3,
      "view": "left_profile",
      "framing": "full_body"
    },
    {
      "index": 4,
      "view": "back",
      "framing": "full_body"
    }
  ],
  "orientation_rules": {
    "panel_2_must_show": "character_right_side_to_camera",
    "panel_3_must_show": "character_left_side_to_camera",
    "profiles_must_be_true_opposites": true,
    "allow_mirrored_reuse": false,
    "allow_duplicate_side_profile": false
  },
  "full_body_rules": {
    "show_complete_figure_head_to_feet": true,
    "both_shoes_fully_visible_in_every_panel": true,
    "allow_cropped_legs": false,
    "allow_cropped_feet": false,
    "allow_hidden_footwear": false
  },
  "consistency_rules": {
    "keep_identical": [
      "facial_identity",
      "hairstyle",
      "body_proportions",
      "outfit",
      "colors",
      "materials",
      "footwear"
    ],
    "keep_constant_across_panels": [
      "environment",
      "lighting_direction",
      "mood",
      "rendering_quality"
    ]
  },
  "pose": {
    "base_pose": "natural_relaxed_standing",
    "posture": "calm_balanced",
    "only_change": "viewing_angle"
  },
  "forbidden_elements": [
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
    "mirrored_same_side_profile"
  ]
}
```

---

## Bekannte Lücken die der Neubau schließen muss

Der Neubau übernimmt dieses Schema **nicht 1:1**. Die sieben identifizierten
Lücken sind im BUILD_PLAN.md dokumentiert:

1. Panel-Daten sind hier hardcoded statt aus `layout.panel_count` +
   Case-spezifischer Panel-Role-Strategy abgeleitet
2. Keine `enabled: true/false` Flags für Modul-Toggles (Face Reference an/aus,
   Env Preserve an/aus etc.)
3. Keine Integrations-Stelle für Look-Lab-Style-Token
4. `forbidden_elements` als flache hardcoded Liste, sollte aus Case-Level +
   Module-Level + User-Level gemerget werden
5. Keine Schema-Versionierung (`schema_version` Feld fehlt)
6. Environment unterspezifiziert (braucht Modi: `inherit_from_reference`,
   `neutral_studio`, `custom_text`)
7. Reference-Image-Payloads fehlen (kein Slot für tatsächliches Bild)

Siehe BUILD_PLAN.md Abschnitt "JSON-Schema Gaps" für die volle Begründung.
