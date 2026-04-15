# Character Normalizer — JSON Schema Example (empirisch validiert)

**Datum:** 2026-04-15
**Status:** NanoBanana-validiert — Ergebnis sogar sauberer als der
Paragraph-GT laut Jonas' Test
**Quelle:** Mit ChatGPT aus dem validierten Paragraph-Prompt in
`character-study-chatgpt-groundtruth.md` → Step 1 übersetzt. Getestet von
Jonas am 2026-04-15 in NanoBanana.
**Zweck:** Zweiter empirischer Beleg dafür dass strukturiertes JSON für
NanoBanana funktioniert. Dies ist der Normalizer-Pfad (Step 1) — wandelt ein
Referenzbild mit gecropptem oder unvollständigem Body in eine saubere
canonical full-body Darstellung des gleichen Charakters um, die dann als
Master-Referenz für den Angle Study (Step 2) dient.
**Besonders interessant:** laut Jonas produziert der JSON-Pfad bei diesem
Case ein **saubereres** Ergebnis als der Paragraph-Pfad — ein Hinweis darauf
dass strukturiertes JSON bei Constraints-schweren Cases sogar präziser
kommuniziert als natürliche Sprache.

---

## JSON (wortwörtlich, empirisch validiert)

```json
{
  "id": "single_full_body_character_lock_v1",
  "type": "single_character_cinematic_full_body",
  "goal": "Create one single full-body cinematic character image of the exact same person.",
  "references": {
    "reference_b": {
      "priority": 1,
      "authority_over": [
        "facial_identity",
        "fine_facial_details"
      ]
    },
    "reference_a": {
      "priority": 1,
      "authority_over": [
        "hairstyle",
        "body_proportions",
        "outfit_design",
        "garment_layering",
        "colors",
        "materials",
        "accessories",
        "footwear",
        "environment",
        "visual_world"
      ]
    }
  },
  "critical_full_body_rule": {
    "show_complete_character_head_to_feet": true,
    "both_shoes_fully_visible": true,
    "reconstruct_missing_lower_body_if_reference_is_cropped": true,
    "reconstruction_rule": "faithfully complete the missing lower body so the result becomes one complete canonical full-body version of the same character"
  },
  "outfit_preservation": {
    "preserve_exact_outfit_from_reference_a": true,
    "allow_redesign": false,
    "allow_restyle": false,
    "allow_replace_clothing": false,
    "allow_simplify_clothing": false,
    "allow_invent_new_clothing_items": false,
    "keep_identical": [
      "garment_structure",
      "layers",
      "silhouette",
      "colors",
      "materials",
      "patterns",
      "accessories",
      "footwear"
    ],
    "if_partially_obscured": "complete conservatively in the same design language without adding new fashion elements"
  },
  "environment_preservation": {
    "preserve_exact_environment_from_reference_a": true,
    "preserve_visual_world_from_reference_a": true,
    "allow_background_replacement": false,
    "allow_new_location": false,
    "allow_studio_backdrop": false,
    "allow_neutral_setting": false,
    "keep_identical": [
      "atmosphere",
      "spatial_context",
      "lighting_mood",
      "environmental_materials"
    ]
  },
  "pose": {
    "base_pose": "natural_relaxed_standing",
    "stance": "neutral_balanced",
    "allow_dramatic_action": false
  },
  "framing": {
    "shot_type": "full_body",
    "margin": "comfortable",
    "no_body_part_touches_frame_edge": true
  },
  "lock": {
    "keep_same": [
      "identity",
      "hairstyle",
      "outfit",
      "colors",
      "materials",
      "footwear",
      "environment"
    ]
  },
  "forbidden_elements": [
    "extra_characters",
    "extra_props",
    "text",
    "labels",
    "watermarks",
    "cropped_feet",
    "hidden_shoes",
    "outfit_changes",
    "new_clothing_items",
    "new_accessories",
    "hairstyle_changes",
    "new_background",
    "studio_background",
    "simplified_rendering"
  ]
}
```

---

## Beobachtung

Der Normalizer verwendet eine leicht andere Feld-Struktur als der Angle Study:
statt `orientation_rules` + `full_body_rules` zwei getrennte Blöcke, hat der
Normalizer einen einzelnen `critical_full_body_rule` Block plus eigene
`outfit_preservation` und `environment_preservation` Objekte. Das bedeutet:
**verschiedene Cases werden nicht exakt dieselben Felder haben** — jeder Case
bringt seine eigenen Spezial-Constraint-Blöcke mit. Das ist im Neubau als
Pattern zu respektieren: der Compiler wird nicht über eine starre Feld-Liste
iterieren, sondern **pro Case eine bekannte Feld-Menge** mit Compile-Order.
