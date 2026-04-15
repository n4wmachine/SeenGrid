# Character Study — Pilot 1 Distillation

> **Pilot:** 1 of 5 (Character Study)
> **Status:** Phase 4 (distillation) **and** Phase 5 (code formalization) complete. Phase 6 (empirical NanoBanana validation) **in progress** — Ex A tested 2026-04-14, ~50% pass rate on 1-step flow uncovered a structural limitation (reconstruction + view-variation coupling). Distillation extended with Section 15 "Two-Step Flow for `needs_normalization`" and supporting patches (Section 3 spatial orientation vocab, new `CRITICAL REQUIREMENTS` block, Section 8.2 `ref_completeness` config, Section 14 Anti-Patterns 18–22). Stage 6 code (new normalizer skeleton, `renderCharacterStudy` orchestrator, per-preset `critical_rules`, regenerated golden files for Ex A/C/D/E + Ex A2/C2/D2) landed 2026-04-14 — 8/8 byte-exact green. Sections 3/7/8/9/14 were already patched three times during Phase 5 to resolve under-specifications surfaced by byte-exact testing against section 9 (first patch: TASK/INPUT_DECL/MODE_SIGNAL/FORBIDDEN structures; second patch: user-input text slots, technical.angle framing_mode collapse, MOD-B conflict_tail_descriptor; third patch: MOD-B two-slot description/purpose split after Ex E byte-exact failure).
> **Session:** `claude/modular-grid-operator-98Bcq`
> **Last updated:** 2026-04-14 (Phase 6 code formalization — two-step renderer + goldens landed)
> **Mandatory read first:** `MODULAR_GRID_ARCHITECTURE.md` (briefing) + `CLAUDE.md` (project bible)
> **Ground-truth precedence:** If sections 3–8 and section 9 disagree, **section 9 wins**. Section 9 Rendered Examples are the byte-exact contract. Phase 5 tests must reproduce them byte-exactly.

---

## 0. Executive Summary

The Character Study Pilot distills the Skeleton + Modules architecture from 4 validated SeenGrid Optimized sources. The result is a **15-block main skeleton** (`character-study.json`) + a **secondary 11-block normalizer skeleton** (`character-study-normalizer.json`, Section 15 Two-Step Flow) + **11 modules** that reproduces every source 1:1 while making axis, mode, reference count, look, layout, and reference-completeness all swappable without prompt editing.

**Key architectural outcomes:**
- **Positive / Negative Split rule** (skeleton-wide): all negatives are deferred to a single `FORBIDDEN` block at the end. The only exception is `MODE_SIGNAL`, where one inline contrast statement is allowed as a Mode-Defining Statement.
- **Axis XOR rule:** `MOD-D` (Camera Angles) and `MOD-F` (Facial Expressions) are mutually exclusive variation axes within Stage 6 scope.
- **Single-Ref fallback:** no `REFERENCE PRIORITY` block when only one reference is present; continuity is enforced by the `LOCKED` block instead (DS-17 compliant).
- **Mode coupling on QA:** Cinematic Study and Technical Sheet carry distinct `QUALITY ANCHOR` wordings, because they serve different rendering targets (storytelling vs. reference documentation).
- **User choice wins on `MOD-H`:** axis-based environment defaults (`MOD-D` → Preserve, `MOD-F` → Neutral) are pre-selections only. Explicit `MOD-H` picks always override them.
- **Two-Step Flow for incomplete refs (Section 15):** when the user's base reference is not a clean canonical full-body (cropped legs, partial framing, hidden feet, etc.), the renderer emits a two-prompt bundle. Step 1 is a single-image "Canonical Full-Body Normalizer" that produces a clean master; Step 2 feeds that master into the standard angle-study skeleton. Activated by `ref_completeness = needs_normalization` config, default is `clean_full_body`. Grounded in 2-step empirical finding (19/20 success rate vs ~50% on 1-step with incomplete refs, session 2026-04-14). Applies to all MOD-D (angle-axis) flows; MOD-F (expression-axis, head-and-shoulders) does not need normalization.
- **Spatial orientation vocabulary (Section 3, Anti-Pattern 18):** side-profile panels are phrased in terms of which body side faces the camera ("character's right side profile"), not as abstract orientation labels ("true right profile"). Enforced by a new `CRITICAL REQUIREMENTS` block (section 8.1) that carries template-specific orientation and visibility rules positively formulated — including the generalized "critical visibility positive" rule (of which "both shoes fully visible" is the full-body-template special case).

---

## 1. Source Corpus

All templates in this distillation are traceable to the following sources. No content was invented beyond what sources authorize.

| ID | Source | Shape | Status | Role in Pilot |
|---|---|---|---|---|
| DS-04 | `DeepSeek1.txt` — Cinematic 3x3 Character Grid | 3×3 | STABLE | Primary source for mixed-shot angle layouts (ECU + MS + Full-Body) |
| DS-06 | `DeepSeek1.txt` — Character Angle Study 2x2 | 2×2 | STABLE | Strongest conflict-resolution wording; primary dual-ref pattern |
| DS-17 | `DeepSeek1.txt` — Expression Target | 2×3 | EXPERIMENTAL | Primary source for `LOCKED`/`VARIABLE` pattern + Single-Ref fallback |
| 8view | `MISSING_PRESETS.txt` — 8-View Character Sheet | 2×4 | STABLE | Primary source for Technical Reference Sheet mode (photoreal/DSLR wording) |
| NEW-EXPR-1x6 | User-supplied (session 2026-04-13) | 1×6 | VALIDATED | Expression strip pattern, head-and-shoulders framing |
| NEW-EXPR-2x2 | User-supplied (session 2026-04-13) | 2×2 | VALIDATED | Expression grid variant |
| NEW-EXPR-1x4 | User-supplied (session 2026-04-13) | 1×4 | VALIDATED | Expression strip 4-step pattern |
| TWO-STEP-P6A | User-supplied empirical finding (Phase 6 session 2026-04-14) | 2-prompt bundle | VALIDATED 19/20 on project refs | Primary source for Section 15 Two-Step Flow, spatial orientation vocabulary, and `CRITICAL REQUIREMENTS` block. Result: 19/20 success on incomplete-ref inputs where 1-step achieved ~50%. **Project finding, not a general model guarantee.** |

**User confirmation on sources:** All 3 NEW-EXPR sources were empirically tested by the user before being added to the corpus. TWO-STEP-P6A was surfaced by user + ChatGPT iteration during Phase 6 on Example A and then generalized with the user's explicit scope (see Section 15).

---

## 2. Scope Boundaries

**Explicitly excluded from Character Study pilot:**

| Excluded | Reason |
|---|---|
| DS-07 (Detail Anchor Strip) | Out of scope — belongs to a separate Detail Operator pattern, not character identity preservation |
| Yokuro 4-Grid | Not in validated source corpus |
| Outfit Swap | Wardrobe/transformation test — belongs to a separate preset family |
| Two Character Integration | Multi-subject composition — belongs to Pilot 2 (Char + World Merge) |

**Grid sizing:** Free choice from 1×1 to 5×5. Warning surfaced at ≥6 panels via the existing crop-advisory system. No hard maximum — user explicitly decided to allow freedom with a soft warning.

---

## 3. Architectural Decision Log — Cluster 1 (C1)

**TITLE_TEMPLATE:**
```
{mode_title_word} — {rows}×{cols} {layout_word}
```

- `mode_title_word` ∈ `"Cinematic character study"` | `"Character reference sheet"`
- `layout_word` derived from grid shape:
  - `rows == 1` → `"horizontal strip"`
  - `cols == 1` → `"vertical strip"`
  - otherwise → `"grid"`

**INPUT_DECL_FORM:** First line is one of four intro variants selected via `(has_face_crop, has_extra_ref)`. When `ref_count ≥ 2`, the intro is followed by a reference listing (`Reference A = [description].` / `Reference B = [description].` / optionally `Reference C = [description].`) with one line per active reference slot.

**INPUT_DECL intro variants:**

| Condition | Intro line | Source |
|---|---|---|
| `is_single_ref` | `You are given a character reference image.` | Ex B (9.2) |
| `has_face_crop && !has_extra_ref` | `You are given two reference images of the same character.` | Ex A (9.1), Ex C (9.3), Ex D (9.4) |
| `!has_face_crop && has_extra_ref` | `You are given two reference images.` | Ex E (9.5) |
| `has_face_crop && has_extra_ref` | `You are given three reference images of the same character.` | UNTESTED — pending Phase 6 |

Derived booleans:
- `has_face_crop = MOD-A active`
- `has_extra_ref = MOD-B active`
- `is_single_ref = !has_face_crop && !has_extra_ref`
- `has_multi_ref = has_face_crop || has_extra_ref`
- `ref_count = 1 + (has_face_crop ? 1 : 0) + (has_extra_ref ? 1 : 0)`

The `"of the same character"` tail is present only when `has_face_crop == true`, because the face crop is by definition another image of the same character. MOD-B-only flows drop the tail because the additional reference may describe an environment, an atmospheric scene, or any non-character reference (Ex E).

**Reference listing — user-input text slots:**

Each `Reference X = ...` line carries a **user-editable description**. The descriptions are NOT hardcoded templates — they vary across examples with identical module configs (compare Ex A vs Ex D, both `cinematic+angle+MOD-A`, both rendering different Reference A and Reference B strings). The skeleton provides sensible defaults per mode, but users can and do override them.

| Slot | User-input source | Default (Cinematic mode) | Default (Technical mode) |
|---|---|---|---|
| Reference A (base image, always when `ref_count ≥ 2`) | always user-editable | `full-body cinematic character image` | `full-body view — body proportions, posture, clothing, silhouette` |
| Reference B (when `MOD-A` active) | MOD-A `description` text field | `upscaled close crop of the character's face` | `close-up face view — facial identity, expression, fine details` |
| Reference B (when `MOD-B` only) | MOD-B `description` text field, fallback to `purpose` if empty | (no default — user must describe) | (no default — user must describe) |
| Reference C (when `MOD-A + MOD-B`) | MOD-B `description` text field, fallback to `purpose` if empty | (no default — user must describe) | (no default — user must describe) |

**MOD-B two-slot semantic:** The INPUT_DECL `Reference B = ...` / `Reference C = ...` line describes *what is physically shown on the image* (short visual description), while the REFERENCE PRIORITY `Reference B provides ...` / `Reference C provides ...` line describes *what semantic role the image plays in generation* (purpose). These are intentionally separable — compare Ex E: `description = "reference scene for environment and atmospheric lighting"` (physical object) vs `purpose = "the environment, backdrop, and atmospheric lighting"` (semantic inventory). If the user leaves `description` empty, the renderer falls back to `purpose` so a single-field flow still works. This mirrors how MOD-A already splits `description` (INPUT_DECL short-desc) from the hardcoded REFERENCE PRIORITY face-authority template.

**Base-image description is not a module.** The "Reference A" base image slot is always the first image the user drops into the canvas — it is not represented as a MOD-* file. Its description text is carried on the skeleton itself, not on a module. The renderer reads it from `userInputs.reference_a_description` (with the mode-coupled default applied when empty).

The golden test files in `tests/golden/character-study/` feed the exact Ex A–E description strings as user-inputs to achieve byte-exact reproduction. See section 9 for the full user-input block per example.

**TASK_TEMPLATE:**
```
Create {N_word} {mode_noun} of the exact same character {variation_clause}, arranged in a {rows}×{cols} {layout_word}.
```

`N_word` = number-to-word ("four", "six", "nine"). `{mode_noun}` and `{variation_clause}` are selected from a **3D lookup** over `(mode, axis, framing_mode)`. `framing_mode` is a derived field from the active panel-content preset — see section 8.5.

**TASK variant table** (5 cases):

| Key | `mode_noun` | `variation_clause` | Source |
|---|---|---|---|
| `cinematic.angle.uniform_full_body` | `cinematic full-body shots` | `from {N_word} different camera angles` | Ex A (9.1), Ex E (9.5) |
| `cinematic.angle.mixed` | `cinematic captures` | `from {N_word} different camera angles and shot types` | Ex D (9.4) |
| `cinematic.expression` | `cinematic portraits` | `with controlled expression changes` | Ex B (9.2) |
| `technical.angle` | `reference views` | `from {N_word} different camera angles` | Ex C (9.3) |
| `technical.expression` | `expression studies` | `with controlled expression changes` | UNTESTED — pending Phase 6 |

**Collapse rules:**
- `cinematic.expression` and `technical.expression` collapse `framing_mode` — MOD-F has its own head-and-shoulders framing rule and does not participate in the framing_mode split.
- **`technical.angle` collapses `framing_mode` deliberately.** Technical Reference Sheets stay clinical regardless of panel-content framing — the `"and shot types"` suffix is cinematic-narrative language and is not inherited by Technical mode. Ex C (8view, 4 portraits + 4 full-body = mixed) renders `"from eight different camera angles"` without the suffix; this is the intended Technical tone. If a future empirical test shows Technical benefits from the suffix, the key can be re-split into `technical.angle.uniform_full_body` / `technical.angle.mixed`.

**MODE_SIGNAL_VARIANT = B** (Inline Contrast Statement):
When Mode = Cinematic, the following sentence is appended directly after TASK:

```
This is not a technical reference {contrast_word} — these are {N_word} cinematic film captures of the same person in a consistent {setting_word}.
```

Both slot values are derived from `(axis, framing_mode)`:

| Slot | Condition | Value |
|---|---|---|
| `contrast_word` | `framing_mode == mixed` | `sheet` |
| `contrast_word` | `framing_mode == uniform_full_body` | `layout` |
| `contrast_word` | `axis == expression` | `layout` |
| `setting_word` | `axis == angle` (MOD-D) | `environment` |
| `setting_word` | `axis == expression` (MOD-F) | `setup` |

Verification against examples:
- Ex A (MOD-D, uniform_full_body) → `layout` + `environment` ✓
- Ex B (MOD-F, expression) → `layout` + `setup` ✓
- Ex D (MOD-D, mixed) → `sheet` + `environment` ✓
- Ex E (MOD-D, uniform_full_body) → `layout` + `environment` ✓

This is the **only** skeleton block permitted to carry an inline negative formulation. All other negatives are deferred to `FORBIDDEN`.

When Mode = Technical Sheet, `MODE_SIGNAL` is **not rendered**. The Technical title already carries the reference-sheet signal.

**Skeleton-wide Positive/Negative Split rule:**
NanoBanana responds better to positive instructions inside topical blocks. All negatives are gathered in a single `FORBIDDEN` block at the end of the prompt. Exception: `MODE_SIGNAL` Variant B.

---

## 4. Architectural Decision Log — Cluster 2 (C2)

**PANEL_CONTENT_FORM:** Numbered list, one panel per line, reading order (left-to-right, row by row).

**PANEL_SLOT_SOURCE:**
- `MOD-D` (Camera Angles) slot source: `MOD-D.selected[i]`
- `MOD-F` (Facial Expressions) slot source: `MOD-F.selected[i]`
- Free text: user-entered per panel slot
- **MOD-D XOR MOD-F:** these axes are mutually exclusive within Stage 6. They require different `LOCKED`/`VARIABLE` configurations, so combining them is out of scope.

**Default slot fills:**
- MOD-D + N=4 → DS-06 (`Full-body front` · `character's right side profile` · `character's left side profile` · `back view`)
- MOD-D + N=9 → DS-04 (`ECU face` · `CU shoulders` · `MS waist-up` · `Full body front` · `Low angle heroic` · `High angle top-down` · `True side profile` · `OTS` · `3/4 rear`)
- MOD-D + N=8 → 8view (`Close-up portrait facing forward` · `Portrait facing right` · `Portrait facing left` · `Portrait from the back` · `Full-body front view` · `Full-body character's right side profile` · `Full-body character's left side profile` · `Full-body back view`)
- MOD-F + N=6 → DS-17 (`Neutral` · `Restrained subtle smile` · `Soft laughter` · `Confused` · `Angry controlled` · `Sad/exhausted`)
- MOD-F + N=4 → NEW-EXPR-1x4 pattern (`Neutral` · `Subtle smile` · `Soft laughter` · `Thoughtful`)
- Other sizes → user picks from axis pool

**Spatial orientation vocabulary rule (TWO-STEP-P6A, Anti-Pattern 18):** Side-profile panels at any framing use the phrase "character's right/left side profile" (or "character's right/left side to the camera"), not the earlier Phase 5 vocabulary "true right/left profile". The earlier wording was semantically ambiguous and produced ~50% mirrored-duplicate failures on Ex A. The spatial framing anchors the rule to body-side-relative-to-camera, which is unambiguous. The anti-duplication rule (Panel X and Panel Y must be true opposite side views, not mirrored) is carried positively by the new `CRITICAL REQUIREMENTS` block (section 8.1) when the active panel preset includes opposite-side profile panels.

**REFERENCE_PRIORITY_FORM:** Block is rendered **only when `ref_count ≥ 2`**. At `ref_count == 1`, the block is omitted entirely and continuity is enforced by `LOCKED` (DS-17 compliant).

**Single-Ref Fallback:** Locked to Variant A — no block, continuity via `LOCKED` with `", matching the reference image"` tail appended.

---

## 5. Architectural Decision Log — Cluster 3 (C3)

**QUALITY_ANCHOR_FORM:** Mode-coupled. Two distinct variants:

- **Cinematic Character Study variant:**
  ```
  QUALITY ANCHOR
  Each panel matches the rendering quality of the source image.
  Preserve material richness, lighting nuance, atmospheric depth, and surface detail across all panels.
  ```

- **Technical Reference Sheet variant:**
  ```
  QUALITY ANCHOR
  Each panel is rendered with consistent photorealistic, DSLR-level fidelity.
  Preserve sharp surface detail, natural muted tones, and clean rendering across all panels.
  ```

Justification for mode coupling (not unified): Cinematic and Technical target different rendering goals (storytelling richness vs. documentation clarity). `8view`-style DSLR wording is a production anchor, not a stylistic overlay. Format adaptation rule applied.

**LAYOUT_FORM:**
```
LAYOUT
{rows}×{cols} {layout_word}. {layout_style} spacing.
{visibility_clause}
```

- `{layout_style}` from `MOD-K`: `"Even"` (default) | `"Letterbox-framed"` | `"Seamless (borderless)"` | `"Framed with subtle separators"` | `"Storyboard"` | `"Polaroid-style"`
- `{visibility_clause}` axis-dependent:
  - MOD-D + full-body only (N=4 DS-06 default): `"Entire figure fully visible in all panels."`
  - MOD-D + mixed framing (N=9 DS-04 default, or 2×4 8view): `"Entire figure fully visible where full-body framing applies."`
  - MOD-F: `"Head-and-shoulders framing across all panels."`

**POSE_FORM:**

- **MOD-D variant:**
  ```
  POSE
  Natural relaxed stance. Consistent posture across all panels where the body is visible.
  ```

- **MOD-F variant:**
  ```
  POSE
  Identical body pose and framing across all panels, matching the reference.
  ```

**ENVIRONMENT_FORM — MOD-H (three variants):**

- **Preserve:**
  ```
  ENVIRONMENT
  Keep the same atmospheric environment from the source image across all panels.
  ```

- **Neutral:**
  ```
  ENVIRONMENT
  Neutral background across all panels. Consistent backdrop tone.
  ```

- **Custom:**
  ```
  ENVIRONMENT
  {user_environment_description}.
  ```

**MOD-H precedence (axis-based defaults + user override):**
1. User explicit `MOD-H` choice → always wins
2. Axis-based default (only when user has not explicitly chosen):
   - MOD-D active → default = Preserve
   - MOD-F active → default = Neutral
3. `MOD-H` is always user-controllable regardless of axis.

---

## 6. Architectural Decision Log — Cluster 4 (C4)

**LOCKED_FORM:** Always present. Four variants based on axis × ref_count.

- **MOD-D (Angles) — Dual/Triple Ref:**
  ```
  LOCKED
  Same facial identity, body proportions, hairstyle, outfit, colors, materials, and consistent lighting source and mood across all panels.
  ```

- **MOD-D (Angles) — Single Ref:**
  ```
  LOCKED
  Same facial identity, body proportions, hairstyle, outfit, colors, materials, and consistent lighting source and mood across all panels, matching the reference image.
  ```

- **MOD-F (Expressions) — Single Ref (default for expressions):**
  ```
  LOCKED
  Same face, facial proportions, hairstyle, skin tone, visible outfit, camera distance, camera height, framing, and lighting in all panels, matching the reference image.
  ```

- **MOD-F (Expressions) — Dual/Triple Ref (rare):**
  ```
  LOCKED
  Same face, facial proportions, hairstyle, skin tone, visible outfit, camera distance, camera height, framing, and lighting in all panels.
  ```

**"Consistent lighting source and mood"** was chosen over plain "consistent lighting" to be precise about what is locked: the light source is fixed, not the apparent light distribution across varying camera angles.

**VARIABLE_FORM:** Block is rendered **only when `MOD-F` is active**. At `MOD-D` (Angles), no `VARIABLE` block — variation is already explicit in `PANEL_CONTENT`.

- **MOD-F variant:**
  ```
  VARIABLE
  Only the facial expression. Controlled, readable changes in expression from panel to panel.
  ```

**STYLE_FORM:** Block is rendered **only when `MOD-J` is active** (Look injected from NanoBanana Studio Register).

- **MOD-J active variant:**
  ```
  STYLE
  {look_name}. {look_description}.
  ```

- **MOD-J inactive:** no `STYLE` block. Style signal is carried by `MODE_SIGNAL` + `QUALITY ANCHOR`.

**MOD-I soft-warning:** UI-only, not a prompt block. When user combines Technical Sheet mode with an illustrative look (anime, watercolor, gouache), the UI surfaces a soft warning: "Mode + Look combination is not optimal for illustrative styles — recommended: Cinematic Study." User's empirical evidence is concentrated at anime/illustration; Pixar/3D-rig behavior is untested.

---

## 7. Architectural Decision Log — Cluster 5 (C5)

**FORBIDDEN_FORM:** Always present. Grouped by topic following DS-06/DS-17 pattern. Always the last block in the prompt.

**Universal entries — split into `pre` and `post` groups.** Discovered by byte-exact reading of the rendered examples: the "no simplification" line appears *after* the axis-specific and toggle-specific entries, not grouped with the other four universals.

**`universal_pre` (4 lines, always, always first):**
```
No text, no labels, no captions, no watermarks.
No face drift, no identity drift between panels.
No hairstyle drift, no outfit change between panels.
No stylization drift between panels.
```

**`universal_post` (1 line, always, after axis/toggle blocks):**
```
No simplification, no flat utilitarian rendering, no quality downgrade from the source image.
```

**FORBIDDEN render order (byte-exact, verified against Ex A/B/D):**
1. `universal_pre` (4 lines)
2. axis-specific block (MOD-D: 2 lines, or MOD-F: 2 lines)
3. `mod_g_toggle` (1 line, only if MOD-G active)
4. `universal_post` (1 line)
5. `mod_h_preserve_conditional` (1 line, only if effective MOD-H == Preserve)

**MOD-D specific additions (when Angles active):**
```
No cropped head, no cropped feet, no hidden footwear.
No rigid or aggressive posture.
```

**MOD-F specific additions (when Expressions active):**
```
No age shift, no beautification drift.
No distortion, no exaggerated cartoon distortion.
```

**MOD-G specific additions (Strict View Rules toggle):**
```
No mirrored profiles, no three-quarter substitutes for true profile or back view.
```

**Conditional on effective MOD-H value being Preserve:**
```
No replacement of the source environment with a neutral studio backdrop.
```

The conditional fires on the **rendered** `MOD-H` value, not on user intent vs. axis default. If the final environment is Preserve (whether by user choice or axis default fallback), the line is added.

---

## 8. Architectural Decision Log — Cluster 6 (C6)

### 8.1 Skeleton Block Conditionality

| Block | Existence condition | Renderer |
|---|---|---|
| `TITLE` | Always | Mode + rows/cols (derives `layout_word`) |
| `INPUT_DECL` | Always | base + `MOD-A` + `MOD-B` |
| `TASK` | Always | Mode + rows/cols + axis + framing_mode |
| `MODE_SIGNAL` | Mode == Cinematic | Mode |
| `PANEL_CONTENT` | Always | `MOD-D` XOR `MOD-F` |
| `CRITICAL REQUIREMENTS` | Active panel preset exposes a non-empty `critical_rules` array | Panel preset |
| `REFERENCE PRIORITY` | `ref_count ≥ 2` | `MOD-A` + `MOD-B` + `MOD-C` |
| `QUALITY ANCHOR` | Always (2 mode-coupled variants) | Mode |
| `LAYOUT` | Always | rows/cols + `MOD-K` + axis visibility_clause |
| `POSE` | Always (2 axis-coupled variants) | Axis |
| `ENVIRONMENT` | Always | `MOD-H` (with axis-based default pre-selection) |
| `LOCKED` | Always (4 variants axis × ref_count) | Axis + ref_count |
| `VARIABLE` | `MOD-F` active | `MOD-F` |
| `STYLE` | `MOD-J` active | `MOD-J` |
| `FORBIDDEN` | Always (composition varies) | universal_pre + axis + mod_g + universal_post + mod_h_conditional |

**`CRITICAL REQUIREMENTS` block specification (added 2026-04-14, TWO-STEP-P6A):**

This block carries template-specific positive requirements that the model must satisfy. It renders between `PANEL_CONTENT` and `REFERENCE PRIORITY`. Content is driven by the active panel preset's `critical_rules` array (one rule per line). The block is omitted entirely when the active preset defines no rules or defines an empty array.

**Rationale for existence as a block (not extension of LAYOUT/PANEL_CONTENT):** The rules are cross-cutting — they touch orientation, visibility, framing integrity — and do not belong to any single existing block. They also require *positive* formulation that would pollute LAYOUT's spacing/figure-presence tone. Keeping them in their own labeled block keeps each block's topical concern clean (Positive/Negative Split rule, extended).

**Two category principles carried by this block:**

1. **Orientation integrity (L2 of TWO-STEP-P6A):** When panels specify opposite-side views, state explicitly which body side faces the camera and that the two panels must be true opposites, not duplicates or mirrored reuse. Replaces ambiguous semantic labels like "true left profile".
2. **Critical visibility, positively formulated (L4 of TWO-STEP-P6A):** When a template requires specific body parts to be visible in all panels, state that requirement positively (e.g. "Both shoes fully visible in every panel") instead of relying only on the FORBIDDEN-block negations (e.g. "No hidden footwear"). The positive formulation has empirically produced better compliance. "Both shoes visible" is the full-body special case; other templates may require different visibility guarantees (full face, full torso, etc.). Keep the rule template-specific — do not hardcode shoes into the block renderer.

The existing FORBIDDEN-block negation (`No cropped feet, no hidden footwear`) is *retained* alongside the positive formulation — the two reinforce each other. The positive rule primes the generation goal; the negative rule gates failure modes. Do not replace one with the other.

**Example `critical_rules` per preset (see `src/data/modules/character-study/mod-d.json` for the authoritative list):**

- `DS-06_N4`:
  - `Panel 2 shows the character's right side to the camera. Panel 3 shows the character's left side to the camera. Panels 2 and 3 must be true opposite side views, not duplicated and not mirrored versions of the same side.`
  - `Both shoes fully visible in every panel.`
- `DS-04_N9`:
  - `Panel 7 shows a true side profile of the character — one specific body side facing the camera, not a three-quarter substitute.`
  - `Both shoes fully visible in every panel where full-body framing applies.`
- `8view_N8`:
  - `Panel 6 shows the character's right side to the camera. Panel 7 shows the character's left side to the camera. Panels 6 and 7 must be true opposite side views, not duplicated and not mirrored versions of the same side.`
  - `Both shoes fully visible in every panel where full-body framing applies.`
- MOD-F expression presets: empty (no critical_rules) — head-and-shoulders framing does not need body-visibility rules, and the expression axis does not carry orientation panels.

### 8.2 Module Specifications

| Module | Type | Default | Effects |
|---|---|---|---|
| **MODE** | Select (`Cinematic Study` / `Technical Sheet`) | Cinematic | Controls `TITLE` mode_title_word, `TASK` variant selection (cinematic uses framing_mode split, technical collapses it), `MODE_SIGNAL` existence, `QUALITY ANCHOR` variant, **default text for `reference_a_description`** (cinematic: `"full-body cinematic character image"`, technical: `"full-body view — body proportions, posture, clothing, silhouette"`). Also controls Section 15 Step 1 (normalizer) environment behavior: Cinematic-mode Step 1 preserves the source environment; Technical-mode Step 1 does **not** preserve environment (studio backdrop is re-generated in Step 2 anyway). |
| **`ref_completeness`** (top-level config, not a module) | Select (`clean_full_body` / `needs_normalization`) | `clean_full_body` | **Added 2026-04-14 (Section 15).** Top-level flow switch, lives on `moduleConfig.ref_completeness`, not nested under any module. `clean_full_body` (default) → standard 1-prompt render pipeline. `needs_normalization` → two-prompt bundle: Step 1 renders via `character-study-normalizer.json` skeleton (Canonical Full-Body Normalizer), Step 2 renders the standard character-study skeleton with `reference_a_description` replaced by the Step 1 output semantic label. See Section 15 for the full contract. Only meaningful on MOD-D (angle-axis) flows — setting `needs_normalization` on a MOD-F flow is an error. |
| **MOD-A** | Image drop + text field (Face Crop Reference) | off | Adds next sequential reference slot. User-editable `description` field (default per mode: `"upscaled close crop of the character's face"` for cinematic, `"close-up face view — facial identity, expression, fine details"` for technical). Activates `REFERENCE PRIORITY` with face-priority template. Removes `", matching the reference image"` tail from `LOCKED`. |
| **MOD-B** | Image drop + three text fields (Additional Reference) | off | Adds next sequential reference slot. **Three user-input fields:** (1) `description` (optional, short visual description for the INPUT_DECL `Reference B = ...` / `Reference C = ...` line; falls back to `purpose` if empty), (2) `purpose` (required, semantic role for the REFERENCE PRIORITY `Reference B provides ...` / `Reference C provides ...` line — no default, user must fill), (3) `conflict_tail_descriptor` (optional, single descriptive word/phrase injected into the REFERENCE PRIORITY conflict clause, e.g. `"atmospheric"` in Ex E). Activates `REFERENCE PRIORITY` with generic template (Case 3 or Case 4). **Independent of MOD-A** — valid in A-only, B-only, and A+B flows. |
| **MOD-C** | Auto-injection | auto when `ref_count ≥ 2` | Appends conflict clause to `REFERENCE PRIORITY`: `"If the references conflict, preserve ..."` |
| **MOD-D** | Multi-select (Camera Angles) | on (primary axis) | Fills `PANEL_CONTENT`. Contributes `framing_mode` via active panel-content preset (see 8.5). Sets MOD-D variant for `LOCKED`, `POSE`. Sets `MOD-H` default pre-selection to Preserve. Adds MOD-D FORBIDDEN entries. XOR with MOD-F. |
| **MOD-F** | Multi-select (Facial Expressions) | off (XOR with MOD-D) | Fills `PANEL_CONTENT`. Bypasses `framing_mode` (expression path collapses the framing_mode axis). Sets MOD-F variant for `LOCKED`, `POSE`. Activates `VARIABLE` block. Sets `MOD-H` default pre-selection to Neutral. Adds MOD-F FORBIDDEN entries. XOR with MOD-D. |
| **MOD-G** | Toggle (Strict View Rules) | off | Adds MOD-G FORBIDDEN entries (mirrored profiles, three-quarter substitutes). |
| **MOD-H** | Select (Preserve / Neutral / Custom) | axis-based pre-selection, user-overridable | Renders `ENVIRONMENT` block per variant. User's explicit choice always wins over axis default. Conditional `FORBIDDEN` entry when effective value is Preserve. |
| **MOD-I** | UI-warning | auto when Technical + illustrative look | **No prompt effect. Excluded from renderer entirely.** No JSON module file, no `_order.json` entry. Surfaced only in the UI layer. |
| **MOD-J** | Select (Look from NanoBanana Studio Register) | off | Activates `STYLE` block. Look metadata pulled from NB Studio Register. |
| **MOD-K** | Select (Layout Style) | Even | Fills `{layout_style}` slot in `LAYOUT` block. **Does not affect `TITLE`.** Mixed layouts unlocked when empirically validated. |

**Naming clarification — modules vs. reference slots:**
Module identifiers `MOD-A`, `MOD-B`, `MOD-C` are internal. The reference slot names rendered in the prompt (`Reference A`, `Reference B`, `Reference C`) are assigned **sequentially based on active modules with no gaps**. If only MOD-B is active (Additional Reference without Face Crop), the additional reference renders as `Reference B`, not `Reference C`. Slot position is independent of module identity.

### 8.3 Rendering Assembly Order

```
1.  Render TITLE                ← MODE + rows/cols (derives layout_word)
2.  Render INPUT_DECL           ← intro variant from (has_face_crop, has_extra_ref) + sequential reference listing
3.  Render TASK                 ← MODE + axis + framing_mode (3D lookup) + rows/cols
4.  Render MODE_SIGNAL          ← only if MODE = Cinematic; slot-fills (contrast_word, setting_word) from (axis, framing_mode)
5.  Render PANEL_CONTENT        ← MOD-D XOR MOD-F fills
6.  Render CRITICAL REQUIREMENTS← only if active panel preset has non-empty critical_rules array
7.  Render REFERENCE PRIORITY   ← only if ref_count ≥ 2; variant by MOD-A/MOD-B combo
8.  Render QUALITY ANCHOR       ← MODE-coupled variant
9.  Render LAYOUT               ← rows/cols + MOD-K + axis visibility_clause
10. Render POSE                 ← axis-coupled variant
11. Render ENVIRONMENT          ← MOD-H (user choice > axis default)
12. Render LOCKED               ← axis + ref_count variant
13. Render VARIABLE             ← only if MOD-F active
14. Render STYLE                ← only if MOD-J active
15. Render FORBIDDEN            ← universal_pre + axis + mod_g + universal_post + mod_h_preserve_conditional
```

**Two-step flow assembly (`ref_completeness == needs_normalization`, see Section 15):** The renderer does **not** run the single-prompt pipeline above. Instead it calls the normalizer skeleton for Step 1 and the standard skeleton for Step 2, then returns a `{ prompts: [step1, step2] }` bundle. Step 2 uses the same 15-step assembly order as above, with `reference_a_description` replaced by a Step 1 semantic label (e.g. `"canonical full-body master of the character"`).

### 8.4 REFERENCE PRIORITY Variants (All 4 Cases)

**Case 1 — ref_count == 1 (single ref):** No block. Continuity via `LOCKED` with `", matching the reference image"` tail.

**Case 2 — MOD-A only (Face Crop active, no additional):**
```
REFERENCE PRIORITY
Reference A provides body proportions, hairstyle, outfit, materials, and footwear.
Reference B provides the highest-authority face: facial identity, facial structure, and fine facial details.
If the references conflict, preserve the face from Reference B first, then body and outfit from Reference A, then materials.
```

**Case 3 — MOD-B only (Additional Reference, no face crop):**

Two template variants depending on whether `conflict_tail_descriptor` is set:

*Without descriptor (default):*
```
REFERENCE PRIORITY
Reference A provides body proportions, hairstyle, outfit, materials, and footwear.
Reference B provides {user_ref_b_purpose}.
If the references conflict, preserve body and outfit from Reference A, then Reference B details.
```

*With descriptor (e.g. Ex E: `conflict_tail_descriptor = "atmospheric"`):*
```
REFERENCE PRIORITY
Reference A provides body proportions, hairstyle, outfit, materials, and footwear.
Reference B provides {user_ref_b_purpose}.
If the references conflict, preserve body and outfit from Reference A, then Reference B {conflict_tail_descriptor} details.
```

Verified against Ex E (9.5): `user_ref_b_purpose = "the environment, backdrop, and atmospheric lighting"`, `conflict_tail_descriptor = "atmospheric"` → renders `"...Reference A, then Reference B atmospheric details."`.

The descriptor is a **single word or short noun phrase** and is rendered with exactly one space on each side. Empty descriptor → first variant. Non-empty descriptor → second variant. The renderer must select the variant explicitly, not interpolate with an always-present slot — that avoids the double-space bug when descriptor is empty.

**Case 4 — MOD-A + MOD-B (all three):**

Same two-variant split for the Reference C conflict tail, using the same `conflict_tail_descriptor` field on MOD-B:

*Without descriptor (default):*
```
REFERENCE PRIORITY
Reference A provides body proportions, hairstyle, outfit, materials, and footwear.
Reference B provides the highest-authority face: facial identity, facial structure, and fine facial details.
Reference C provides {user_ref_c_purpose}.
If the references conflict, preserve the face from Reference B first, then body and outfit from Reference A, then Reference C details.
```

*With descriptor:*
```
REFERENCE PRIORITY
Reference A provides body proportions, hairstyle, outfit, materials, and footwear.
Reference B provides the highest-authority face: facial identity, facial structure, and fine facial details.
Reference C provides {user_ref_c_purpose}.
If the references conflict, preserve the face from Reference B first, then body and outfit from Reference A, then Reference C {conflict_tail_descriptor} details.
```

Case 4 is UNTESTED — no example covers MOD-A + MOD-B simultaneously. Behavior is theoretical, pending Phase 6.

### 8.5 `framing_mode` — Derived Field

`framing_mode` is a derived property of the active panel-content preset. It drives the `TASK` variant selection (section 3, **cinematic.angle only**) and the `MODE_SIGNAL` `contrast_word` slot (cinematic mode only, since Technical does not render MODE_SIGNAL). **Technical mode collapses `framing_mode` on the angle axis** — Technical Reference Sheets render `"from {N_word} different camera angles"` regardless of panel-content framing, and do not inherit the `"and shot types"` cinematic-narrative suffix.

| Panel-content preset | `framing_mode` value |
|---|---|
| DS-06 default (N=4 front/right/left/back) | `uniform_full_body` |
| DS-04 default (N=9 ECU/CU/MS/Full/Low/High/Profile/OTS/3-4-rear) | `mixed` |
| 8view default (N=8 4 portraits + 4 full-body) | `mixed` |
| User-custom panel content (free text) | `mixed` (safer fallback) |
| MOD-F active (any expression preset) | `N/A` — expression path bypasses framing_mode |

**Rationale:** DS-06 panels are all framed full-body and use uniform camera treatment, so the TASK phrasing reads `"full-body shots"`. DS-04 panels span ECU through full-body with mixed shot sizes, so the TASK phrasing reads `"captures"` and the variation clause adds `"and shot types"`. 8view is mixed for the same reason. The user-custom fallback defaults to `mixed` because `mixed` phrasing is permissive over any framing, whereas `uniform_full_body` phrasing becomes factually wrong the moment the user adds a non-full-body panel.

`framing_mode` is a pure derivation — it has no UI control and cannot be overridden. It follows panel content.

---

## 9. Rendered Examples

Concrete renderings covering the main module combinations. All examples are byte-exactly reproducible from the skeleton + module configuration listed above each example, and are backed by golden files in `tests/golden/character-study/` (regenerated 2026-04-14 after the Section 15 patch). Section 9.1–9.5 cover the five `clean_full_body` 1-step forms; Section 9.6 adds the `needs_normalization` two-step variant.

### 9.1 Example A — 2×2 Cinematic Angle Study, MOD-A, Preserve

**Config:** Mode=Cinematic, `ref_completeness=clean_full_body`, rows=2, cols=2, MOD-A=on, MOD-B=off, MOD-D=on (DS-06_N4 default), MOD-H=Preserve, MOD-J=off, MOD-K=Even

**User inputs (byte-exact for golden test):**
- `reference_a_description = "full-body cinematic character image"`
- `mod_a.description = "upscaled close crop of the character's face"`

```
Cinematic character study — 2×2 grid

You are given two reference images of the same character.
Reference A = full-body cinematic character image.
Reference B = upscaled close crop of the character's face.

TASK
Create four cinematic full-body shots of the exact same character from four different camera angles, arranged in a 2×2 grid.

This is not a technical reference layout — these are four cinematic film captures of the same person in a consistent environment.

PANEL CONTENT
Panel 1: Full-body front view.
Panel 2: Full-body character's right side profile.
Panel 3: Full-body character's left side profile.
Panel 4: Full-body back view.

CRITICAL REQUIREMENTS
Panel 2 shows the character's right side to the camera. Panel 3 shows the character's left side to the camera. Panels 2 and 3 must be true opposite side views, not duplicated and not mirrored versions of the same side.
Both shoes fully visible in every panel.

REFERENCE PRIORITY
Reference A provides body proportions, hairstyle, outfit, materials, and footwear.
Reference B provides the highest-authority face: facial identity, facial structure, and fine facial details.
If the references conflict, preserve the face from Reference B first, then body and outfit from Reference A, then materials.

QUALITY ANCHOR
Each panel matches the rendering quality of the source image.
Preserve material richness, lighting nuance, atmospheric depth, and surface detail across all panels.

LAYOUT
2×2 grid. Even spacing.
Entire figure fully visible in all panels.

POSE
Natural relaxed stance. Consistent posture across all panels where the body is visible.

ENVIRONMENT
Keep the same atmospheric environment from the source image across all panels.

LOCKED
Same facial identity, body proportions, hairstyle, outfit, colors, materials, and consistent lighting source and mood across all panels.

FORBIDDEN
No text, no labels, no captions, no watermarks.
No face drift, no identity drift between panels.
No hairstyle drift, no outfit change between panels.
No stylization drift between panels.
No cropped head, no cropped feet, no hidden footwear.
No rigid or aggressive posture.
No simplification, no flat utilitarian rendering, no quality downgrade from the source image.
No replacement of the source environment with a neutral studio backdrop.
```

### 9.2 Example B — 1×6 Cinematic Expression Strip, Single-Ref, MOD-F

**Config:** Mode=Cinematic, rows=1, cols=6, MOD-A=off, MOD-B=off, MOD-F=on (DS-17 defaults), MOD-H=Neutral (axis default), MOD-J=off, MOD-K=Even

**User inputs (byte-exact for golden test):**
- (none — single-ref path, no reference listing rendered)

```
Cinematic character study — 1×6 horizontal strip

You are given a character reference image.

TASK
Create six cinematic portraits of the exact same character with controlled expression changes, arranged in a 1×6 horizontal strip.

This is not a technical reference layout — these are six cinematic film captures of the same person in a consistent setup.

PANEL CONTENT
Panel 1: Neutral.
Panel 2: Restrained subtle smile.
Panel 3: Soft laughter.
Panel 4: Confused / uncertain.
Panel 5: Angry but controlled.
Panel 6: Sad / exhausted.

QUALITY ANCHOR
Each panel matches the rendering quality of the source image.
Preserve material richness, lighting nuance, atmospheric depth, and surface detail across all panels.

LAYOUT
1×6 horizontal strip. Even spacing.
Head-and-shoulders framing across all panels.

POSE
Identical body pose and framing across all panels, matching the reference.

ENVIRONMENT
Neutral background across all panels. Consistent backdrop tone.

LOCKED
Same face, facial proportions, hairstyle, skin tone, visible outfit, camera distance, camera height, framing, and lighting in all panels, matching the reference image.

VARIABLE
Only the facial expression. Controlled, readable changes in expression from panel to panel.

FORBIDDEN
No text, no labels, no captions, no watermarks.
No face drift, no identity drift between panels.
No hairstyle drift, no outfit change between panels.
No stylization drift between panels.
No age shift, no beautification drift.
No distortion, no exaggerated cartoon distortion.
No simplification, no flat utilitarian rendering, no quality downgrade from the source image.
```

### 9.3 Example C — 2×4 Technical Reference Sheet, MOD-A, Custom, MOD-J

**Config:** Mode=Technical, `ref_completeness=clean_full_body`, rows=2, cols=4, MOD-A=on, MOD-B=off, MOD-D=on (8view_N8 defaults), MOD-H=Custom (user override), MOD-J=on (Photoreal Studio Look), MOD-K=Even

**User inputs (byte-exact for golden test):**
- `reference_a_description = "full-body view — body proportions, posture, clothing, silhouette"`
- `mod_a.description = "close-up face view — facial identity, expression, fine details"`
- `mod_h.custom_text = "Soft studio backdrop with directional key light from camera-left"`
- `mod_j.look_name = "Photoreal Studio Look"`
- `mod_j.look_description = "Photoreal studio shoot, directional key light with soft fill, neutral color grade, sharp surface detail"`

```
Character reference sheet — 2×4 grid

You are given two reference images of the same character.
Reference A = full-body view — body proportions, posture, clothing, silhouette.
Reference B = close-up face view — facial identity, expression, fine details.

TASK
Create eight reference views of the exact same character from eight different camera angles, arranged in a 2×4 grid.

PANEL CONTENT
Panel 1: Close-up portrait facing forward.
Panel 2: Portrait facing right.
Panel 3: Portrait facing left.
Panel 4: Portrait from the back.
Panel 5: Full-body front view.
Panel 6: Full-body character's right side profile.
Panel 7: Full-body character's left side profile.
Panel 8: Full-body back view.

CRITICAL REQUIREMENTS
Panel 6 shows the character's right side to the camera. Panel 7 shows the character's left side to the camera. Panels 6 and 7 must be true opposite side views, not duplicated and not mirrored versions of the same side.
Both shoes fully visible in every panel where full-body framing applies.

REFERENCE PRIORITY
Reference A provides body proportions, hairstyle, outfit, materials, and footwear.
Reference B provides the highest-authority face: facial identity, facial structure, and fine facial details.
If the references conflict, preserve the face from Reference B first, then body and outfit from Reference A, then materials.

QUALITY ANCHOR
Each panel is rendered with consistent photorealistic, DSLR-level fidelity.
Preserve sharp surface detail, natural muted tones, and clean rendering across all panels.

LAYOUT
2×4 grid. Even spacing.
Entire figure fully visible where full-body framing applies.

POSE
Natural relaxed stance. Consistent posture across all panels where the body is visible.

ENVIRONMENT
Soft studio backdrop with directional key light from camera-left.

LOCKED
Same facial identity, body proportions, hairstyle, outfit, colors, materials, and consistent lighting source and mood across all panels.

STYLE
Photoreal Studio Look. Photoreal studio shoot, directional key light with soft fill, neutral color grade, sharp surface detail.

FORBIDDEN
No text, no labels, no captions, no watermarks.
No face drift, no identity drift between panels.
No hairstyle drift, no outfit change between panels.
No stylization drift between panels.
No cropped head, no cropped feet, no hidden footwear.
No rigid or aggressive posture.
No simplification, no flat utilitarian rendering, no quality downgrade from the source image.
```

### 9.4 Example D — 3×3 Cinematic Storyboard, MOD-A, Preserve, MOD-G

**Config:** Mode=Cinematic, `ref_completeness=clean_full_body`, rows=3, cols=3, MOD-A=on, MOD-B=off, MOD-D=on (DS-04_N9 9-shot defaults), MOD-G=on (Strict View Rules), MOD-H=Preserve, MOD-J=off, MOD-K=Even

**User inputs (byte-exact for golden test):**
- `reference_a_description = "character preservation / integration image (full body)"`
- `mod_a.description = "upscaled face crop (highest authority for face)"`

```
Cinematic character study — 3×3 grid

You are given two reference images of the same character.
Reference A = character preservation / integration image (full body).
Reference B = upscaled face crop (highest authority for face).

TASK
Create nine cinematic captures of the exact same character from nine different camera angles and shot types, arranged in a 3×3 grid.

This is not a technical reference sheet — these are nine cinematic film captures of the same person in a consistent environment.

PANEL CONTENT
Panel 1: Extreme close-up — face.
Panel 2: Close-up — shoulders.
Panel 3: Medium shot — waist up.
Panel 4: Full body — front.
Panel 5: Low angle — heroic.
Panel 6: High angle — top down.
Panel 7: True side profile.
Panel 8: Over-the-shoulder.
Panel 9: Three-quarter rear / back view.

CRITICAL REQUIREMENTS
Panel 7 shows a true side profile of the character — one specific body side facing the camera, not a three-quarter substitute and not a mirrored reuse of another panel.
Both shoes fully visible in every panel where full-body framing applies.

REFERENCE PRIORITY
Reference A provides body proportions, hairstyle, outfit, materials, and footwear.
Reference B provides the highest-authority face: facial identity, facial structure, and fine facial details.
If the references conflict, preserve the face from Reference B first, then body and outfit from Reference A, then materials.

QUALITY ANCHOR
Each panel matches the rendering quality of the source image.
Preserve material richness, lighting nuance, atmospheric depth, and surface detail across all panels.

LAYOUT
3×3 grid. Even spacing.
Entire figure fully visible where full-body framing applies.

POSE
Natural relaxed stance. Consistent posture across all panels where the body is visible.

ENVIRONMENT
Keep the same atmospheric environment from the source image across all panels.

LOCKED
Same facial identity, body proportions, hairstyle, outfit, colors, materials, and consistent lighting source and mood across all panels.

FORBIDDEN
No text, no labels, no captions, no watermarks.
No face drift, no identity drift between panels.
No hairstyle drift, no outfit change between panels.
No stylization drift between panels.
No cropped head, no cropped feet, no hidden footwear.
No rigid or aggressive posture.
No mirrored profiles, no three-quarter substitutes for true profile or back view.
No simplification, no flat utilitarian rendering, no quality downgrade from the source image.
No replacement of the source environment with a neutral studio backdrop.
```

### 9.5 Example E — 2×2 Cinematic Angle Study, MOD-B only (Additional Ref without Face Crop)

**Config:** Mode=Cinematic, `ref_completeness=clean_full_body`, rows=2, cols=2, MOD-A=off, MOD-B=on (Environment Reference), MOD-D=on (DS-06_N4 default), MOD-H=Preserve, MOD-J=off, MOD-K=Even

**User inputs (byte-exact for golden test):**
- `reference_a_description = "full-body cinematic character image"`
- `mod_b.description = "reference scene for environment and atmospheric lighting"`
- `mod_b.purpose = "the environment, backdrop, and atmospheric lighting"`
- `mod_b.conflict_tail_descriptor = "atmospheric"`

This example proves the **MOD-B independent flow** — using an additional reference for environment/atmosphere without requiring a face crop. It also proves the **optional `conflict_tail_descriptor`** field on MOD-B (see section 8.4 Case 3) and the **two-slot `description` / `purpose` split** on MOD-B (see section 3 "MOD-B two-slot semantic"). The INPUT_DECL short-description (`description`) is intentionally distinct from the REFERENCE PRIORITY semantic role (`purpose`).

```
Cinematic character study — 2×2 grid

You are given two reference images.
Reference A = full-body cinematic character image.
Reference B = reference scene for environment and atmospheric lighting.

TASK
Create four cinematic full-body shots of the exact same character from four different camera angles, arranged in a 2×2 grid.

This is not a technical reference layout — these are four cinematic film captures of the same person in a consistent environment.

PANEL CONTENT
Panel 1: Full-body front view.
Panel 2: Full-body character's right side profile.
Panel 3: Full-body character's left side profile.
Panel 4: Full-body back view.

CRITICAL REQUIREMENTS
Panel 2 shows the character's right side to the camera. Panel 3 shows the character's left side to the camera. Panels 2 and 3 must be true opposite side views, not duplicated and not mirrored versions of the same side.
Both shoes fully visible in every panel.

REFERENCE PRIORITY
Reference A provides body proportions, hairstyle, outfit, materials, and footwear.
Reference B provides the environment, backdrop, and atmospheric lighting.
If the references conflict, preserve body and outfit from Reference A, then Reference B atmospheric details.

QUALITY ANCHOR
Each panel matches the rendering quality of the source image.
Preserve material richness, lighting nuance, atmospheric depth, and surface detail across all panels.

LAYOUT
2×2 grid. Even spacing.
Entire figure fully visible in all panels.

POSE
Natural relaxed stance. Consistent posture across all panels where the body is visible.

ENVIRONMENT
Keep the same atmospheric environment from the source image across all panels.

LOCKED
Same facial identity, body proportions, hairstyle, outfit, colors, materials, and consistent lighting source and mood across all panels.

FORBIDDEN
No text, no labels, no captions, no watermarks.
No face drift, no identity drift between panels.
No hairstyle drift, no outfit change between panels.
No stylization drift between panels.
No cropped head, no cropped feet, no hidden footwear.
No rigid or aggressive posture.
No simplification, no flat utilitarian rendering, no quality downgrade from the source image.
No replacement of the source environment with a neutral studio backdrop.
```

### 9.6 Example A2 — Needs-Normalization Variant (Two-Step Flow)

**Config:** Identical to Example A except `ref_completeness = "needs_normalization"`. Same Mode=Cinematic, rows=2, cols=2, MOD-A=on, MOD-D=DS-06_N4, MOD-H=Preserve. Same user inputs.

This example demonstrates the full two-prompt bundle emitted by `renderCharacterStudy` when the base reference is flagged as incomplete. Step 1 produces the canonical full-body master; Step 2 consumes that master as Reference A (auto-labeled) and produces the 2×2 angle grid. Both prompts are byte-exactly reproducible from `tests/golden/character-study/example-a2-step1.txt` and `example-a2-step2.txt`.

**Step 1 — Canonical Full-Body Normalizer:**

```
Canonical full-body character normalization

You are given two reference images of the same character.
Reference A = full-body cinematic character image.
Reference B = upscaled close crop of the character's face.

TASK
Create one single full-body cinematic character image of the exact same person.

REFERENCE PRIORITY
Reference A provides body proportions, hairstyle, outfit, materials, and footwear.
Reference B provides the highest-authority face: facial identity, facial structure, and fine facial details.
If the references conflict, preserve the face from Reference B first, then body and outfit from Reference A, then materials.

CRITICAL REQUIREMENTS
Show the complete character from the top of the head to the bottom of both feet.
Both shoes must be fully visible.
If the references are cropped or incomplete, reconstruct the missing lower body faithfully so the result becomes one complete canonical full-body version of the same character.

OUTFIT PRESERVATION
Preserve the exact outfit from Reference A.
Do not redesign, restyle, replace, simplify, or invent new clothing items.
Keep the same garment structure, layers, silhouette, colors, materials, patterns, accessories, and footwear from Reference A.
If any part of the outfit is partially obscured in the reference, complete it conservatively in the same design language without adding new fashion elements.

ENVIRONMENT PRESERVATION
Preserve the exact environment and visual world from Reference A.
Do not replace the background, do not move the character into a new location, and do not introduce a studio backdrop or neutral setting.
Keep the same atmosphere, spatial context, lighting mood, and environmental materials from Reference A.

POSE
Natural relaxed standing pose.
Neutral balanced stance.
No dramatic action.

FRAMING
Full-body shot with comfortable margin around the figure.
No body part touches the frame edge.

LOCKED
Same identity, same hairstyle, same outfit, same colors, same materials, same footwear, same environment.

FORBIDDEN
No text, no labels, no captions, no watermarks.
No extra characters, no extra props.
No cropped feet, no hidden footwear, no cropped body parts.
No outfit changes, no new clothing items, no new accessories, no hairstyle changes.
No studio background replacement, no simplified rendering.
No new background, no relocation of the character.
```

**Step 2 — Standard Angle Study with master label:**

```
Cinematic character study — 2×2 grid

You are given two reference images of the same character.
Reference A = canonical full-body master of the character.
Reference B = upscaled close crop of the character's face.

TASK
Create four cinematic full-body shots of the exact same character from four different camera angles, arranged in a 2×2 grid.

This is not a technical reference layout — these are four cinematic film captures of the same person in a consistent environment.

PANEL CONTENT
Panel 1: Full-body front view.
Panel 2: Full-body character's right side profile.
Panel 3: Full-body character's left side profile.
Panel 4: Full-body back view.

CRITICAL REQUIREMENTS
Panel 2 shows the character's right side to the camera. Panel 3 shows the character's left side to the camera. Panels 2 and 3 must be true opposite side views, not duplicated and not mirrored versions of the same side.
Both shoes fully visible in every panel.

REFERENCE PRIORITY
Reference A provides body proportions, hairstyle, outfit, materials, and footwear.
Reference B provides the highest-authority face: facial identity, facial structure, and fine facial details.
If the references conflict, preserve the face from Reference B first, then body and outfit from Reference A, then materials.

QUALITY ANCHOR
Each panel matches the rendering quality of the source image.
Preserve material richness, lighting nuance, atmospheric depth, and surface detail across all panels.

LAYOUT
2×2 grid. Even spacing.
Entire figure fully visible in all panels.

POSE
Natural relaxed stance. Consistent posture across all panels where the body is visible.

ENVIRONMENT
Keep the same atmospheric environment from the source image across all panels.

LOCKED
Same facial identity, body proportions, hairstyle, outfit, colors, materials, and consistent lighting source and mood across all panels.

FORBIDDEN
No text, no labels, no captions, no watermarks.
No face drift, no identity drift between panels.
No hairstyle drift, no outfit change between panels.
No stylization drift between panels.
No cropped head, no cropped feet, no hidden footwear.
No rigid or aggressive posture.
No simplification, no flat utilitarian rendering, no quality downgrade from the source image.
No replacement of the source environment with a neutral studio backdrop.
```

**Companion golden pairs** (same semantics, different configs — not quoted inline to keep this section readable):

- `example-c2-step1.txt` + `example-c2-step2.txt` — Technical mode + MOD-H=Custom. Step 1 **omits** `ENVIRONMENT PRESERVATION` (Anti-Pattern 21) and uses the `env_not_preserved` LOCKED variant + shorter FORBIDDEN list. Step 2 is the 2×4 technical 8view reference sheet with the custom studio backdrop and Photoreal Studio Look.
- `example-d2-step1.txt` + `example-d2-step2.txt` — Cinematic mode + MOD-H=Preserve + MOD-G (Strict View Rules) on the DS-04_N9 3×3 cinematic storyboard. Step 1 **includes** `ENVIRONMENT PRESERVATION` and uses the `env_preserved` LOCKED variant. Step 2 adds the MOD-G `No mirrored profiles…` FORBIDDEN line to the standard DS-04 output.

---

## 10. Source-to-Skeleton Traceability

| Source | Skeleton Reproduction | Block Origins |
|---|---|---|
| **DS-04** (Cinematic 3x3) | Example D | PANEL_CONTENT 9-shot defaults; REFERENCE PRIORITY priority wording; MODE_SIGNAL Variant B inline contrast; QA cinematic variant ("material richness, atmospheric depth") |
| **DS-06** (2x2 Angle Study) | Example A | MOD-D N=4 defaults (front/right/left/back); REFERENCE PRIORITY conflict clause (strongest source); QA cinematic variant; LOCKED dual-ref form; META rule "not a technical reference layout" → MODE_SIGNAL |
| **DS-17** (Expression Target) | Example B | MOD-F 6-step default pool; LOCKED MOD-F extended form (face + camera + framing); VARIABLE block (the only source with one); ENVIRONMENT default Neutral for Expressions |
| **8view** (2x4 Technical Sheet) | Example C | MODE=Technical variant; QA technical variant (DSLR wording); 8-shot panel defaults; mixed-framing visibility clause |
| **NEW-EXPR-1x4** | (MOD-F defaults N=4) | MOD-F N=4 defaults (Neutral / Subtle smile / Soft laughter / Thoughtful) |
| **NEW-EXPR-1x6** | Example B structure | MOD-F axis with head-and-shoulders framing, identity lock wording, neutral background |
| **NEW-EXPR-2x2** | (validates MOD-F at non-strip) | Confirms MOD-F works in non-strip grid shapes |

**Invented content:** None. Every skeleton block and every module effect is derived from one or more sources. Structural reorganization is minimal:
1. Extracting `STYLE` into its own block (sources embed style in QA/LAYOUT)
2. Consolidating all negatives into `FORBIDDEN` (sources scatter them)
3. Formalizing the MOD-H three-way environment choice
4. Formalizing single-ref fallback pattern (no REFERENCE PRIORITY block)

---

## 11. Phase 5 Entry Point — Module Formalization

**Goal:** Translate this distillation into a machine-readable module spec that the Grid Operator can consume at runtime.

**Suggested output format:**
- `src/data/skeletons/character-study.json` — skeleton metadata + block templates with placeholder anchors
- `src/data/modules/character-study/*.json` — one file per module (MOD-A through MOD-K) with module type, effect target blocks, default values, render snippets
- `src/data/modules/character-study/_order.json` — assembly order and conditional rules

**Phase 5 tasks:**
1. Design the JSON schema for `skeleton + modules` (one schema reused for all 5 pilot presets)
2. Convert this distillation into JSON files
3. Write a renderer function in React that assembles a prompt from `(skeleton, active_modules, user_inputs)`
4. Wire the renderer to a minimal test harness (no UI yet) that reproduces the 5 examples from section 9

**Validation criterion:** All 5 rendered examples (9.1 through 9.5) must be byte-exactly reproducible from the JSON + renderer pipeline.

**Phase 5 status (2026-04-13):** ✅ Complete. 5/5 byte-exact passes on the original single-prompt pipeline. After Section 15 was added, Phase 5 test harness was extended to cover the 2-prompt bundle form as well — see `tests/renderCharacterStudy.test.js` for the current CASES array (8 cases: 5 `clean_full_body` + 3 `needs_normalization` at the time of writing).

---

## 12. Phase 6 Entry Point — Empirical Validation

**Goal:** Verify that the 5 rendered examples actually produce correct results in NanoBanana.

**Phase 6 tasks:**
1. Run each of the 5 examples through NanoBanana with realistic reference images
2. Check for: identity drift, hairstyle drift, outfit change, cropped footwear, stylization drift, environment replacement
3. Document failure modes per example
4. Iterate on block wording only where empirical evidence shows a specific failure

**Phase 6 status (2026-04-14):** 🟡 In progress.

- **Example A (2×2 Cinematic Angle Study, MOD-A):** Tested on project refs. Result: ~50% failure rate on left/right side-profile separation (mirrored duplicates) and ~50% failure rate on full-body completeness (cropped legs or feet) when the input body ref was not already a clean canonical full-body. Diagnosis: NanoBanana cannot simultaneously hold identity, reconstruct missing body parts, distinguish opposite side profiles, and produce multiple views in a single generation pass — too much coupled uncertainty. A 2-step pipeline (Canonical Normalizer → Angle Study) reached 19/20 success on the same refs. Adopted as **Section 15 Two-Step Flow**. Project finding from session 2026-04-14, not a general model guarantee.
- **Examples B, C, D, E:** Pending empirical test with the updated Section 15 / Section 3 vocabulary. Ex B is expected to stay 1-step (head-and-shoulders, no body reconstruction needed); C, D, E will be tested in 2-step form.

**Known untested edges:**
- Mixed-panel-size layouts (rows × cols non-uniform) — deferred until empirical test
- Triple-ref flow (MOD-A + MOD-B simultaneously) — no source has 3 references; behavior theoretical
- Technical Sheet + illustrative Look combination — MOD-I soft-warning assumes this is unreliable at anime/illustration; Pixar/3D-rig untested
- Grid sizes ≥6 panels beyond 3×3 — crop advisory triggers but downstream behavior untested
- Two-step flow on expression axis (`MOD-F` + `needs_normalization`) — explicitly rejected; expression panels are head-and-shoulders and do not benefit from body normalization
- Whether the "decouple reconstruction from variation" principle (Section 15, L1 of TWO-STEP-P6A) generalizes to other pilots (World Study, Multi-Shot Scene, Start-End Pair) — to be assessed at Pilot 2+

---

## 13. Open Questions / Decisions Deferred

- **Combined axes (MOD-D + MOD-F simultaneously):** out of scope for Stage 6
- **Mixed layouts (rows × cols non-uniform):** slot exists in MOD-K but default is Even, unlocks when empirically tested
- **NanoBanana Studio Look Register:** MOD-J references a Look Register not yet defined in code — cross-module dependency between NB Studio and Grid Operator
- **Crop-advisory integration:** existing crop-advisory should surface the ≥6 panels warning — verify before Phase 5 code changes

---

## 14. Anti-Patterns (Do Not)

1. **Do not** treat the Grid Operator as a template library. The 18 static presets in `src/data/presets/` are Legacy Snapshot
2. **Do not** build a Grid Switch into NanoBanana Studio. The only bridge from NB Studio to Grid Operator is the Look Register (MOD-J)
3. **Do not** use "sheet" in preset labels when the active look is illustrative — cartoon-default trigger
4. **Do not** mix positive and negative instructions in the same block (exception: MODE_SIGNAL Variant B)
5. **Do not** invent module effects beyond what sources authorize
6. **Do not** couple `MOD-K` (Layout Style) to `TITLE`. Title depends only on Mode + rows/cols
7. **Do not** gate `MOD-B` on `MOD-A`. Additional references must be independently activatable
8. **Do not** override user's explicit `MOD-H` choice with an axis default. User wins
9. **Do not** render a `VARIABLE` block for MOD-D. Variation is already explicit in `PANEL_CONTENT`
10. **Do not** render a `REFERENCE PRIORITY` block at ref_count == 1. Continuity moves to `LOCKED`
11. **Do not** introduce `MOD-E`. It does not exist. The module letters deliberately skip from D to F, and from H to J. The canonical list is `MOD-A`, `MOD-B`, `MOD-C`, `MOD-D`, `MOD-F`, `MOD-G`, `MOD-H`, `MOD-I`, `MOD-J`, `MOD-K`
12. **Do not** place `MOD-I` in the renderer pipeline. It has no prompt effect. No JSON file, no `_order.json` entry. UI-only
13. **Do not** treat `framing_mode` as a user-controllable module. It is derived from the active panel-content preset and cannot be overridden
14. **Do not** merge all FORBIDDEN universals into a single group. The `universal_post` line ("No simplification…") always renders *after* axis-specific and toggle-specific entries
15. **Do not** hardcode `Reference A` / `Reference B` / `Reference C` description strings. They are user-editable text slots with per-mode defaults. Compare Ex A ("full-body cinematic character image") vs Ex D ("character preservation / integration image (full body)") — same module config, different strings. For MOD-B this means **two separate fields**: `description` feeds the INPUT_DECL short-description line, `purpose` feeds the REFERENCE PRIORITY semantic-role line. Compare Ex E: INPUT_DECL `Reference B = reference scene for environment and atmospheric lighting` vs REFERENCE PRIORITY `Reference B provides the environment, backdrop, and atmospheric lighting` — intentionally different strings
16. **Do not** assume `technical.angle.mixed` exists as a distinct TASK variant. Technical mode collapses framing_mode on the angle axis — there is only `technical.angle`. Adding "and shot types" to Technical mode breaks Ex C
17. **Do not** interpolate `{conflict_tail_descriptor}` as an always-present slot. Use two template variants (empty vs non-empty) and let the renderer branch. Interpolating an empty slot leaves a double-space artifact
18. **Do not** use semantic left/right profile labels (`true right profile`, `true left profile`) without explicit spatial anchoring. Always phrase side profiles in terms of which body side faces the camera (`character's right side profile`, `character's left side to the camera`) and pair the rule with an explicit anti-duplication clause in the `CRITICAL REQUIREMENTS` block. The earlier semantic wording produced ~50% mirrored-duplicate failures on Ex A empirically (session 2026-04-14)
19. **Do not** ask NanoBanana to simultaneously reconstruct missing body parts AND generate multiple views from an incomplete reference in a single prompt. Use the Section 15 Two-Step Flow: Step 1 produces a canonical full-body master, Step 2 generates views from the master. The single-step path is reserved for `ref_completeness == clean_full_body`. Ignoring this on incomplete refs produced ~50% failure rate on Ex A before Section 15 was added
20. **Do not** hardcode "Both shoes fully visible" (or any specific body part) as a universal rule in the renderer. It is the full-body-template special case of the generalized "positively formulate critical visibility" principle (section 8.1, L4 of TWO-STEP-P6A). Which body part is critical depends on the template — keep it per-preset in `critical_rules`, not in the skeleton code. Conversely, do not *remove* the "Both shoes visible" line from full-body presets just because the FORBIDDEN block already contains "No hidden footwear" — positive and negative reinforce each other, and the empirical finding uses both together
21. **Do not** preserve the source environment in Section 15 Step 1 whenever the effective Step 2 environment is **not** source-preserving. The Step 1 environment clause is coupled to the effective Step 2 environment (after MOD-H evaluation), not to Mode alone. If Step 2 will regenerate, neutralize, or custom-define the environment — whether through Technical mode, `MOD-H=Neutral`, `MOD-H=Custom`, or any future mode that does not preserve source env — Step 1 must omit the environment-preservation block. Preserving an environment that Step 2 discards wastes normalizer budget and contaminates the canonical master
22. **Do not** execute any panel-, view-, or grid-level logic in Step 1 of the Two-Step Flow. Step 1 (Canonical Full-Body Normalizer) is a single-image normalization pass; it knows nothing about `rows`, `cols`, `framing_mode`, `PANEL_CONTENT`, `MOD-D` presets, `MOD-F` expressions, or `MOD-B` environment/scene references. Its sole responsibility is producing a clean canonical full-body of the same character. All panel/view logic is deferred to Step 2. Concrete consequences: `MOD-B` environment refs bypass Step 1 entirely, `MOD-D` preset selection does not affect any Step 1 block, grid size does not affect Step 1, and the Step 1 `CRITICAL REQUIREMENTS` block carries only image-level invariants (full-body completeness, shoe visibility) — never panel-comparison or orientation-pair rules

---

## 15. Two-Step Flow for `needs_normalization`

**Source:** TWO-STEP-P6A (user empirical finding, Phase 6 session 2026-04-14, 19/20 success on project refs vs ~50% on 1-step).

**Scope:** Cinematic Angle Study and Technical Reference Sheet (all MOD-D / angle-axis flows). Explicitly **not** applied to MOD-F (expression axis) — head-and-shoulders framing does not require body reconstruction.

### 15.1 Activation

A top-level `moduleConfig.ref_completeness` field selects the flow:

| Value | Flow |
|---|---|
| `clean_full_body` (default) | Standard 1-prompt pipeline (sections 3–14). Unchanged. |
| `needs_normalization` | Two-prompt bundle. Step 1 = Canonical Full-Body Normalizer (new skeleton `character-study-normalizer.json`). Step 2 = standard character-study skeleton, with `reference_a_description` replaced by a Step 1 semantic label. |

**Hard constraint:** `ref_completeness == needs_normalization` is only valid when the active axis is `MOD-D`. Combining it with `MOD-F` is an error (the renderer throws).

**Determining activation in practice:** The user (or UI) decides `needs_normalization` when the base reference is cropped, partial, missing feet, missing lower body, or otherwise not a clean canonical full-body. This is currently a manual choice; automatic detection is out of scope for Stage 6.

### 15.2 Five learnings from TWO-STEP-P6A

These are the transferable core principles. They are **global** (likely reusable across other pilots); the specific rules derived from them (shoe visibility, left/right anchoring) are **template-specific**.

1. **L1 — Decouple reconstruction from variation.** When a single generation pass must hold identity AND complete missing body parts AND produce multiple views AND preserve outfit/environment, the coupled uncertainty overwhelms the model. Separate reconstruction (Step 1, one image) from variation (Step 2, N panels).
2. **L2 — Spatial orientation vocabulary.** Semantic labels like "true right profile" are ambiguous. Anchor orientation to which body side faces the camera. Pair with an explicit anti-duplication clause for opposite-side panel pairs.
3. **L3 — Conservative completion of missing parts.** Missing or occluded regions are completed in the same design language as the source reference — no new clothing items, no new accessories, no relocation. Applies to Step 1 only.
4. **L4 — Positively formulate critical visibility.** Requirements for body parts that must be visible in every panel (shoes, full face, etc.) get a positive line in `CRITICAL REQUIREMENTS`, reinforced by the matching negative in `FORBIDDEN`. Positive formulation is per-template; the skeleton does not hardcode specific body parts.
5. **L5 — Respect stable model layout preferences.** If the model reliably produces 1×4 tall panels for a 4-view study and fights 2×2, use 1×4. Out of scope for the distillation (layout is modular via `MOD-K`), but recorded here so future layout work does not re-fight a preference the model has already settled.

### 15.3 Step 1 — Canonical Full-Body Normalizer

**Skeleton:** `src/data/skeletons/character-study-normalizer.json` (new). Single-image output, not a grid.

**Block order (Step 1 skeleton):**

```
1.  TITLE                       "Canonical full-body character normalization"
2.  INPUT_DECL                  (single-ref or dual-ref based on MOD-A presence)
3.  TASK                        "Create one single full-body cinematic character image of the exact same person."
4.  REFERENCE PRIORITY          (only if MOD-A is active — face-priority hierarchy)
5.  CRITICAL REQUIREMENTS       positive full-body completeness + shoe visibility
6.  OUTFIT PRESERVATION         conservative completion rule (L3)
7.  ENVIRONMENT PRESERVATION    conditional on effective Step 2 environment being Preserve
8.  POSE                        "Natural relaxed standing pose. Neutral balanced stance."
9.  FRAMING                     "Full-body shot with comfortable margin around the figure. No body part touches the frame edge."
10. LOCKED                      "Same identity, same hairstyle, same outfit, same colors, same materials, same footwear" (+ environment clause if preserved)
11. FORBIDDEN                   normalizer-specific FORBIDDEN list
```

**Step 1 references used:**
- Always: Ref A (base character image, possibly incomplete).
- If MOD-A active: Ref B (face crop).
- If MOD-B active: **ignored** (Anti-Pattern 22). MOD-B environment/scene refs rejoin the pipeline in Step 2.

**Step 1 INPUT_DECL variants:**

| Input combination | Step 1 INPUT_DECL |
|---|---|
| Base only, no MOD-A, MOD-B inactive or env-ref only | `You are given a character reference image.` |
| Base + MOD-A face crop | `You are given two reference images of the same character.` + `Reference A = {body description}.` + `Reference B = {face description}.` |

**Step 1 TASK (always identical):**

```
Create one single full-body cinematic character image of the exact same person.
```

**Step 1 CRITICAL REQUIREMENTS (always):**

```
Show the complete character from the top of the head to the bottom of both feet.
Both shoes must be fully visible.
If the references are cropped or incomplete, reconstruct the missing lower body faithfully so the result becomes one complete canonical full-body version of the same character.
```

**Step 1 OUTFIT PRESERVATION (always, L3):**

```
Preserve the exact outfit from Reference A.
Do not redesign, restyle, replace, simplify, or invent new clothing items.
Keep the same garment structure, layers, silhouette, colors, materials, patterns, accessories, and footwear from Reference A.
If any part of the outfit is partially obscured in the reference, complete it conservatively in the same design language without adding new fashion elements.
```

**Step 1 ENVIRONMENT PRESERVATION — mode-coupled conditional (Anti-Pattern 21):**

The Step 1 environment clause is coupled to the **effective Step 2 environment** (after MOD-H evaluation), not to source mode alone.

| Step 2 effective environment | Step 1 environment clause |
|---|---|
| `Preserve` | Render the Step 1 environment-preservation block (identical to Ex-A-style wording below) |
| `Neutral` / `Custom` (Cinematic MOD-H override) | **Omit** the Step 1 environment-preservation block. The normalizer focuses only on character/outfit/completeness. |
| Technical mode (any) | **Omit.** Technical mode always produces studio or custom backdrop in Step 2 — preserving source env in Step 1 is wasted budget and contaminates the canonical master. |

**Step 1 environment-preservation block (when included):**

```
Preserve the exact environment and visual world from Reference A.
Do not replace the background, do not move the character into a new location, and do not introduce a studio backdrop or neutral setting.
Keep the same atmosphere, spatial context, lighting mood, and environmental materials from Reference A.
```

**Step 1 POSE (always):**

```
Natural relaxed standing pose.
Neutral balanced stance.
No dramatic action.
```

**Step 1 FRAMING (always):**

```
Full-body shot with comfortable margin around the figure.
No body part touches the frame edge.
```

**Step 1 LOCKED — environment-conditional:**

- Env preserved:
  ```
  Same identity, same hairstyle, same outfit, same colors, same materials, same footwear, same environment.
  ```
- Env not preserved:
  ```
  Same identity, same hairstyle, same outfit, same colors, same materials, same footwear.
  ```

**Step 1 FORBIDDEN (always):**

```
No text, no labels, no captions, no watermarks.
No extra characters, no extra props.
No cropped feet, no hidden footwear, no cropped body parts.
No outfit changes, no new clothing items, no new accessories, no hairstyle changes.
No studio background replacement, no simplified rendering.
```

When env is preserved, additionally:
```
No new background, no relocation of the character.
```

### 15.4 Step 2 — Standard Skeleton with Master Reference

**Skeleton:** `src/data/skeletons/character-study.json` (existing, unchanged structure).

**Difference from the 1-step flow:** Only the `reference_a_description` default changes. Instead of `"full-body cinematic character image"` (Cinematic) or `"full-body view — body proportions, posture, clothing, silhouette"` (Technical), Step 2 uses a Step-1-aware default:

| Mode | Step 2 `reference_a_description` default |
|---|---|
| Cinematic | `canonical full-body master of the character` |
| Technical | `canonical full-body master of the character` |

Users can still override. The description is mode-agnostic because the Step 1 output is the same artifact in both modes — only the Step 2 downstream differs.

**Step 2 reference count behavior:**
- MOD-A face crop is re-used in Step 2 as a separate reference (Step 1 output is the body reference; the face crop remains the highest-authority identity source). This matches the 1-step flow's REFERENCE PRIORITY Case 2 or Case 4, just with Reference A re-labeled.
- MOD-B env/scene ref re-joins the pipeline in Step 2. REFERENCE PRIORITY Case 3 or Case 4 applies.
- The `ref_count` in Step 2 is computed the same way as in the 1-step flow: `1 + (MOD-A active ? 1 : 0) + (MOD-B active ? 1 : 0)`.

All other Step 2 blocks (TASK, MODE_SIGNAL, PANEL_CONTENT, CRITICAL REQUIREMENTS, REFERENCE PRIORITY, QUALITY ANCHOR, LAYOUT, POSE, ENVIRONMENT, LOCKED, VARIABLE, STYLE, FORBIDDEN) render exactly as section 8.3. No special-casing.

### 15.5 Renderer Contract

The renderer entry point for Character Study is a bundle function:

```js
// src/lib/skeletonRenderer.js
export function renderCharacterStudy(bundle, moduleConfig, userInputs) -> { prompts: string[] }
```

- `bundle` carries both skeletons (`character-study.json` + `character-study-normalizer.json`) plus the shared module set.
- Returns `{ prompts: [string] }` (length 1) when `ref_completeness == clean_full_body`.
- Returns `{ prompts: [step1String, step2String] }` (length 2) when `ref_completeness == needs_normalization`.
- Internally delegates to the pure `renderSkeleton(skeleton, moduleConfig, userInputs) -> string` function for each skeleton — `renderSkeleton` stays pure and single-string. No plumbing changes to existing callers.

**Derived inputs for Step 2:** The renderer computes a derived `userInputs` object for the Step 2 call that overrides `reference_a_description` with the mode-coupled master label (section 15.4) unless the user already set a non-empty custom value. Everything else is passed through unchanged.

### 15.6 Golden Tests

The Phase 5 golden test harness is extended to handle 2-prompt bundles:

- Single-prompt cases (Ex B): one golden file, runner compares `prompts[0]` to the golden.
- Two-prompt cases (Ex A, C, D, E): two golden files per case — `example-X-step1.txt` and `example-X-step2.txt`. Runner compares `prompts[0]` to step1 and `prompts[1]` to step2.
- The runner's diff reporter prints a labeled line showing which step failed.

Ex A/C/D/E are regenerated with the new vocabulary (spatial orientation, `CRITICAL REQUIREMENTS` block, updated default reference_a_description for Step 2). Ex B is unchanged.

### 15.7 Scope Disclaimers

- **19/20 is a project finding, not a general model guarantee.** It was observed on the user's reference set during session 2026-04-14. Different characters, different NanoBanana versions, and different refs may produce different numbers.
- **Detection of `needs_normalization` is manual.** There is no automatic classifier. The user flips the switch when they know their ref is incomplete.
- **Not applied to expression axis.** MOD-F flows never use Two-Step. The head-and-shoulders framing of expression studies does not suffer from the reconstruction+variation coupling that angle studies exhibit.
- **Layout preference learning (L5) is out of scope for the distillation.** Recorded for the future UI layer; do not hardcode "1×4 is better than 2×2" anywhere in skeletons or modules. Layout stays modular.
- **Generalization to other pilots is a Pilot 2+ question.** World Study, Multi-Shot Scene, Start-End Pair may or may not benefit from a similar pre-normalizer. Do not preemptively refactor until empirical evidence appears.

---

**End of Character Study Pilot 1 Distillation.**

