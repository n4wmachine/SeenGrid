# SEENGRID — Opus Code Handoff

> **Last updated:** 2026-04-13, session `claude/seengrid-visual-overhaul-kzfBe` — **ARCHITECTURAL PIVOT: Modular Grid Operator discovered as the actual USP**. Visual Overhaul pushed behind modular architecture work.
> **⚠ READ FIRST:** [`MODULAR_GRID_ARCHITECTURE.md`](./MODULAR_GRID_ARCHITECTURE.md) — the dedicated briefing for the next Opus. 100% mandatory before planning anything. Contains: full pivot context, 5 pilot presets, 6-phase destillation methodology, 10 user-approved decisions, 10 anti-patterns, concrete next steps.
> **Read order for a new Opus:** 1) `MODULAR_GRID_ARCHITECTURE.md` (mandatory first read)  2) this doc  3) `ROADMAP.md`  4) `CLAUDE.md`
> **Rule:** update this doc after every fix. It is the snapshot-of-truth.
> **Next chat:** **Modular Grid — Character Study Phase 1** (not Visual Overhaul anymore). See `MODULAR_GRID_ARCHITECTURE.md` for the full plan and the concrete Phase 1 starting point.

---

## Quick Status

- **Branch:** `claude/seengrid-visual-overhaul-kzfBe` (chat was opened as Visual Overhaul, pivoted mid-session)
- **Latest commit:** see `git log --oneline -5`
- **Build:** `npx vite build` green (no code changes this session, only docs + plan)
- **Status:** **Massive architectural discovery this session. Idea 4 (NB ↔ Grid bridge) was supposed to be the first item. Over the course of the dialogue it became clear that the entire framing was wrong: Grid Operator is not a template library with optional bridges, it is supposed to be a modular prompt *operator* with swappable skeletons + optional modules. The current 18 presets are static prompt-text copies from DeepSeek1.txt, which is why every user workflow requires manual prompt editing (deleting Reference B, overriding look, etc.). The real USP of SeenGrid is the modular grid builder; everything else (Visual Overhaul, slogan, typography) comes after the architecture is right. See the new *Session 2026-04-13 — Architectural Pivot* section below for the complete record.**
- **⚠ READ FIRST BEFORE PLANNING:** The new *Session 2026-04-13 — Architectural Pivot* section is the 100% mandatory first read. It supersedes all Idea 1/4 discussion in the older sections below and contains the full 5-pilot-preset plan, the 6-phase destillation methodology, all user-approved decisions, and the anti-patterns to avoid.
- **Stack:** Vite + React + CSS Modules, no UI library
- **i18n:** `LangContext` + `src/data/i18n.json`, EN primary, DE fallback.
  UI strings via `t('key')`, data labels via `tData(obj, 'field')`.

---

## Module Status

### NanoBanana Studio (`PromptBuilder.jsx`)
Solid. Chip clusters, Sensory-Stacking random (Beat / Look / Full), 12 chip data files all migrated to `label_en/_de` + `t_en/_de`. Random pools in `src/data/random/`.
Recent: `padding-bottom: 22vh` on both scroll columns, section titles moved to body font, placeholder contrast fix via `--sg-placeholder #7a7a7a` token. Output box now absorbs the remaining column space (`flex: 1 1 0` + internal scroll) so the random cluster above never jumps when the prompt text length changes. **Accordion behavior shipped:** only one chip section is open at a time; opening a new one auto-closes the previous (single-ID `openSection` state). Full multi-column / icon-driven rethink is still deferred to Visual Overhaul.

### Grid Operator (`GridOperator.jsx`)
Focus of the current session. Modes: Core (default) / SeenGrid Signature (★ gold) / Custom. 18 presets in `src/data/presets/`, grouped dynamically via `_categories.json` + `groupByCategory()`.
Dim UX rebuilt: buttons 1–8 always visible, no clamp, every combo freely pickable. Objective pixel-based crop advisory shows real panel dimensions at 2K and 4K.
Dim labels + buttons moved from mono to body font so they no longer stick out against the new body-font advisory.
**Quick-nav pill row** sits directly under the Mode Toggle and lists every section of the current mode (Preset / Core Template / Grid Size / Layout / Ref / Style / Subject / Panel Roles) as clickable pills. Click smooth-scrolls to the target section and briefly flashes its border (teal glow, 1.4s one-shot). Section IDs are `grid-sec-*` and only render when their owning mode is active. Implementation: `jumpToSection(key)` → `document.getElementById(...).scrollIntoView({behavior:'smooth'})` + `highlightedSection` state + `sectionFlash` CSS class + `useEffect` cleanup for the flash timer.
**Advisory math:**
```js
panelW = floor(canvas_w / cols)   // square canvas 2048² / 4096²
panelH = floor(canvas_h / rows)
tier   = min(panelW2K, panelH2K)  // shortest edge bottleneck
// ≥1024 Hires  / ≥512 Standard  / ≥256 Low  / <256 Tiny
```
Tooltip on the advisory box documents the three assumptions: square canvas, floor rounding, shorter-edge tier. Tier logic is intentional (confirmed by ChatGPT review and user).
Category tabs replaced grid-size grouping for Signature mode. Preview column restructured (Copy + Info on top, prompt field collapsible below).

### Midjourney Cinematic (`MJStartframe.jsx`)
Rebranded from "MJ Startframe" → "Midjourney Cinematic" (UI + i18n). File name kept for migration. 3 sub-tabs: Felder / Templates & Medium / Filmstock & Parameter. Beat/Look/Full random driven by 22 pools in `src/data/mj/random-pools.json` (1433 entries).
Recent: empty-state output instead of `[FIELD]` ghost brackets when `filledFieldCount === 0`, 22vh scroll padding, `[2-3 DETAILS]` bug fix.

### Vault (`PromptVault.jsx`)
Dynamic fetch from `jau123/nanobanana-trending-prompts`. Not touched in this session. Card grid, thumbnails, hover polish → Visual Overhaul.

---

## Session Work Log (newest first)

| Commit | Summary |
|---|---|
| _pending_ | **Idea 1 cleanup / revert** — both v1 and v2 reverted after user pointed out that ongoing iteration before the display-font decision is token-waste. Header back to pre-`8e2eebe` state. Idea 1 status restored to "deferred to Visual Overhaul" with full anti-pattern record + lessons learned for the next Opus. The two failed commits stay in git history as documented anti-patterns. |
| `869169f` | **Idea 1 v2 (REVERTED)** — Header slogan typography overcorrection: 17px / weight 500 / `--sg-text-primary`, "Grid." in `--sg-teal` matching wordmark accent. Resulted in two new failures: (1) double-brand-echo (white-teal-white pattern duplicated next to wordmark), (2) gaming-clan / esports vibe (colored accent on single word + three-beat staccato). |
| `8e2eebe` | **Idea 1 v1 (REVERTED)** — Header slogan "Scene. Grid. Seen." 13px / 400 / dim, inline right of wordmark with thin vertical divider. Sat in the same visual category as the tab nav — user reported it "looked like another tool tab that can't be clicked". |
| `4e32a5b` | docs: refine feature ideas after user clarifications |
| `3df9d7e` | docs: capture 4 accumulated feature ideas in handoff |
| `709561b` | Fix wordmark token + document quick-nav visual defer |
| `7a6b1ad` | docs: sync handoff + roadmap after UX-polish pass |
| `cb92c58` | **Fix #2** — Grid Builder quick-nav pill row (scroll-to-section + highlight flash) |
| `29c893c` | **Fix #4-quick** — NanoBanana Studio accordion (only one chip section open at a time) |
| `d7aaec4` | **Fix #1 / #5 / #6** — stable random buttons (both studios), logo "Grid" in teal, grid dim typography mono→body |
| `2a65cf5` | Rewrite OPUS_CODE_HANDOFF on current session state |
| `d0053b7` | Grid advisory: math assumption tooltip |
| `aefadc0` | Grid advisory: correct per-axis panel math (non-square panels) |
| `4e3db76` | Grid crop-size advisory + 22vh scroll bottom padding on all 3 modules |
| `b421c3a` | 6 UX points: dim 1–8 always visible, section title fonts, panel roles auto-fit, MJ empty state, placeholder contrast, MJ rebrand |
| `4725ca9` | Grid signature: category tabs + preview column restructure |
| `014cb05` | MJ `[2-3 DETAILS]` bug, grid dim logic, signature gold, scroll |
| `5fceb2c` | Grid scroll, MJ random empty-field fallback, random cluster UX |

---

## Pending: Grundstruktur  — ALL DONE ✅

The 5 approved Grundstruktur-fixes are complete. All five below are shipped and covered by commits in the Session Work Log above.

1. ✅ **Random button layout stability (both studios)** — `d7aaec4`. `.outputBox` in both `PromptBuilder.module.css` and `MJStartframe.module.css` uses `flex: 1 1 0` + internal scroll so the random cluster above the output box never reflows. Verified by resizing output content in both studios.
2. ✅ **Grid Builder quick-nav pill row** — `cb92c58`. Horizontal pill row under the Mode Toggle lists all sections of the active mode; click smooth-scrolls + flashes the target. See Module Status → Grid Operator for the implementation outline.
3. ✅ **NanoBanana Studio accordion (quick fix)** — `29c893c`. Single-ID `openSection` state replaces the Set-based multi-open logic. Full multi-column rethink remains deferred to Visual Overhaul.
4. ✅ **Logo wordmark — "Grid" in teal** — `d7aaec4` (initial) + follow-up commit for color-token correction. `Header.jsx` wraps "Grid" in `.headerWordmarkAccent` span. **Important token detail:** `.headerWordmarkAccent` uses `--sg-teal` (#2bb5b2), **NOT** `--sg-gold-text` (#5ae0dd). The first token matches the logo SVG exactly (same token the mark, diamond and eye lens use). `--sg-gold-text` is the UI's active-state accent (tabs, chips, buttons) — using it on the wordmark made "Grid" visually disagree with the logo right next to it. On hover both words brighten to `--sg-gold-text` so the hover effect parallels the logo's drop-shadow intensifying.
5. ✅ **Grid dim typography consistency** — `d7aaec4`. `.dimLabel`, `.dimBtn`, `.dimX`, `.dimTotal` moved from `--sg-font-mono` to `--sg-font-body` with tweaked weights/sizes for visual parity with the advisory.

No Grundstruktur work is pending. The chat is at a clean handoff point.

---

## Pending: Visual Overhaul (new chat, separate session)

User will start a dedicated new chat for this. Process rule: mockup plan first, user approval, then code. No quick-polish pass — dedicated focused work (~1–2 hours). The base structure needs to be solid before this starts.

**Problem statement (user's own words):**
> "Die Struktur ist solide, aber die Oberfläche ist monochrom (grau-auf-schwarz + Teal-Akzent), überall gleiche Card-Borders, keine Tiefe, keine visuelle Hierarchie-Marker. Das fühlt sich technisch korrekt aber nicht cinematisch an."

**Concrete levers (user approved):**
1. Color-temperature variety: warm gold accents for Signature, cool blues for Info/Reference, amber for Warnings, teal stays Primary.
2. Background textures / gradients instead of flat `#141414` — subtle film grain overlay, radial gradients for depth.
3. Display font for large labels (candidates: Neue Machina, Space Mono Display, Instrument Serif) instead of only Space Grotesk uppercase.
4. Section icons / visual markers instead of plain text titles (Lucide or custom SVG).
5. Cards with real shadows + subtle highlights instead of flat 1px borders.
6. Accent dividers (gradient-to-transparent) instead of solid borders.

**Additional items explicitly deferred to Visual Overhaul:**
- Grid Preview panels: current label font is tiny gray mono on flat panels — whole preview needs a professional pass (font, contrast, card look, sizing).
- NanoBanana Studio full layout rethink: multi-column distribution of chip sections, section icons, visual hierarchy. Accordion is only a band-aid until this happens.
- Vault card grid: thumbnail quality, hover states, the whole gallery look.
- Image previews on tiles (Filmstocks, Camera Angles, Lens Looks, Color Grades, Presets, MJ Templates) — like Premiere Pro presets / Magic Bullet Looks. See ROADMAP.md Section 5.
- **Grid Operator Quick-Nav visual treatment.** The pill row functions correctly (smooth-scroll + 1.4s border flash on landing) but it looks like tags rather than a perceivable navigation bar because it uses the same surface/border treatment as the section cards below it. Needs: "Jump to:" label prefix OR icon prefix per pill OR sticky positioning with backdrop-blur OR distinctly different background tone — decision depends on how the section cards themselves are retreated in the overhaul, so must be designed as one piece with the rest.
- **Token naming cleanup.** `--sg-gold-*` holds teal values (historical relic from when the accent really was gold). Should be renamed to `--sg-accent-*` or `--sg-teal-ui-*` across ~20 files. Not a behavior change, just a readability / grep-hygiene fix. Do this together with the overhaul so the theme file gets one coherent pass.

### Open exploration items from end of `claude/review-docs-features-Sg7py` — SUGGESTIONS, not rules

> Captured at user request at the end of the slogan-revert session. **Framing:** these are observations and proposals collected at the end of one session, not a build spec. The next Opus should look at all of this with **fresh eyes** and decide what to take, what to leave, and how to orchestrate it inside the Visual Overhaul plan. Nothing in this subsection is a fixed instruction.

#### A. Lessons extracted from two NanoBanana-generated mockup images

User generated two mockups in NanoBanana with the prompt *"zeig mir wie eine professionelle Seite für ein Promptbuilder-Tool aussehen könnte"*. Neither image is a target design — but reading them as a designer next to the current SeenGrid UI surfaced concrete patterns worth considering:

1. **Image previews on tiles instead of plain text labels.** Both mockups used small thumbnail-style preview images on every selection tile (style chips, presets, templates) — like Premiere Pro / Magic Bullet preset libraries. SeenGrid currently shows pure-text chips for Filmstocks, Camera Angles, Lens Looks, Color Grades, Presets, MJ Templates. Visual previews on these tiles would close a real "what does this actually look like" gap and break the current monochrome grid-of-text feeling. Already partially captured in this section above; mockups confirm it.

2. **Three-column DAW-style layout.** One mockup used a left navigation rail / center work area / right inspector layout (think Ableton Live, DaVinci Resolve, Premiere Pro). Currently SeenGrid uses two-column layouts inside each tab (controls + preview/output). A third column for context-aware metadata, hints, or live readouts could give the UI the "professional production tool" silhouette it currently lacks. Worth considering for at least Grid Operator and NanoBanana Studio. **Caveat:** three columns only work at desktop widths; would need a graceful collapse strategy.

3. **Background textures / depth** — already on the lever list above, but the mockups showed how strong the effect is when done right. Subtle radial gradients, faint film-grain noise, soft inner shadows on cards. Current `#141414` flat fill makes everything read as one plane.

4. **Branded interior section names** instead of plain functional labels. Mockup labels read like product copy ("Composition Engine", "Look Reactor", "Frame Studio") rather than functional ("Style", "Camera", "Lens"). For SeenGrid this could mean section titles that lean into film vocabulary ("Lens Stack", "Lighting Grade", "Subject Block") instead of generic chip-category names. **Risk:** can tip into marketing-speak fast — needs taste, not enthusiasm.

**Things from the mockups that the user agreed should NOT be ported:**
- Drag-and-drop UI metaphors (mockups suggested it; SeenGrid is a prompt builder, not a node editor — adds complexity for no real gain).
- Fake parameter sliders that don't actually drive anything in NanoBanana (visual lying).
- Inline "Generate Preview" button that implies the tool runs inference (SeenGrid is intentionally **not** an inference engine — see CLAUDE.md no-backend rule).
- Seed / Steps / CFG sliders (NanoBanana is closed-source, these don't exist as user-facing knobs).

#### B. Grid Operator preview window — needs structural rethink

**Current state (`GridOperator.jsx:719-746` + `GridOperator.module.css:762-811`):** A grid preview already exists in the right column of Grid Operator. It renders `rows × cols` div cells with `aspect-ratio: 1/1`, layout-aware background colors, and panel-role labels at `font-size: 7px` italic disabled.

**What's broken:**
- `.gridCell` has `min-height: 56px` — this forces every cell to be at least 56px tall, so an 8×8 grid demands ~448px+ vertical space and the frame grows out of the viewport. User reports having to scroll to see the bottom of the preview at high grid sizes, instead of cells shrinking to fit.
- `.gridPreviewFrame` has `max-width: 440px` but **no max-height** — width is capped, height is unbounded. The grid drives the frame size instead of the frame containing the grid.
- Labels at `font-size: 7px` are barely legible — a smell that the implementation knew it was running out of space at high cell counts and solved it by shrinking text instead of by rethinking the layout.
- Layout-awareness is shallow: per-layout background colors only. Letterbox/Polaroid/Storyboard get a tint, but the geometry and framing don't actually behave like a letterbox or a polaroid would in a real storyboard.
- User's verbatim assessment: *"sieht aus wie placeholder von 1999"*, *"der ganze approach im moment ist sau weak, da muss grundlegend anders gedacht werden"*.

**Suggestion to consider (not a fixed plan):**

Treat the preview as a **fixed-aspect viewport** that the grid scales **into**, instead of a container that the grid scales **out of**. Concretely (one possible direction — next Opus may pick a different one):
- Set the frame to a fixed aspect (e.g. 4:3 or square), fixed max-height (~360–400px), no vertical overflow allowed.
- Compute cell size from `frameSize / max(rows, cols)` so cells shrink proportionally as the grid densifies.
- Render in **SVG with a `viewBox`** instead of CSS Grid divs — viewBox gives free, mathematically-correct scaling at any density and lets the layout-variants (letterbox, polaroid, framed, storyboard) be drawn as actual shapes rather than approximated with CSS background tricks.
- Drop `min-height` on cells. Replace fixed-px label sizes with viewBox-relative units that scale with the cell.
- At high density (e.g. ≥6×6), auto-collapse panel-role labels into hover-only tooltips so the cells stay clean. At low density (≤3×3), show role labels permanently.
- Layout variants get real geometric treatment: Letterbox cells render at 16:9, Polaroid cells get a real bottom margin rectangle, Framed cells share a black gutter, Storyboard cells get hand-drawn-feel borders, Seamless cells touch with zero gap.

**Why this matters beyond cosmetics:**
- **Closes a real UX gap.** Right now the Grid Operator tells users "3×3 World Zone Board, Multi-Shot 2×4" as text, but until they paste the prompt into NanoBanana they don't actually see the layout. A real preview makes the choice between presets *visible* instead of *readable*.
- **Layout decisions become instant.** Switching from Even to Letterbox to Polaroid currently changes a background color. With shape-aware rendering it would change the frame geometry, which is what the user actually cares about.
- **Half the GridCropper infrastructure (Idea 2) lives here already.** If the preview can render arbitrary `rows × cols × layout` geometry from data, then GridCropper can reuse the same renderer to overlay the user's uploaded grid image and define crop regions on top of it. Building this preview properly is **also** a free down-payment on Idea 2.

**Why this is a suggestion, not a directive:**
- The next Opus may have a totally different visual direction in mind that makes a different preview shape more sensible (e.g. if they go three-column DAW-style, the preview might live in the inspector column with a different aspect).
- SVG vs Canvas vs CSS Grid is an implementation choice the next Opus should make based on the broader rendering decisions of the overhaul.
- The exact label-collapse threshold (at what density do labels go to tooltip-only?) needs play-testing, not pre-specification.

**Anti-pattern to avoid:** Do **not** add any inference / "generate preview button" / random placeholder image to this preview window. The user explicitly considered repurposing the preview window in NanoBanana/MJ tabs for "a random placeholder image showing the current look aesthetic" and after discussion **rejected the idea himself** because: (a) actually generating breaks the no-inference rule, (b) pulling from Vault by tag-match feels arbitrary and adds dependency, (c) a static moodboard reflects nothing about the user's actual settings → it lies. The Grid Operator preview is the only place where a meaningful preview is structurally possible (because the grid layout is real client-side data) — do not extend the pattern to NanoBanana or MJ tabs.

---

## Pending: Feature Ideas (accumulated, not yet built)

User collected these between sessions. Triage + sequencing guidance by Opus from this session. **These are NOT build orders** — each has an explicit gate and a triage category. Next Opus: read, discuss with user, don't guess priority.

### Idea 1 — Header slogan ⛔ ATTEMPTED EARLY, FAILED, REVERTED — gate restored

**Status:** Attempted in session `claude/review-docs-features-Sg7py`. Two implementations shipped, both failed user review, both reverted in the same session. The original Opus's gate ("don't build before display-font is chosen, don't retrofit after the overhaul is done") was correct. **Do not re-attempt until display-font decision is locked in the Visual Overhaul chat.**

**Slogan choice (user-decided, still valid for the Visual Overhaul chat):**
- Three candidates were on the table: **"Scene. Grid. Seen."**, **"Make your scene seen"**, **"From scene to seen."**
- User picked **"Scene. Grid. Seen."** for rhythm and brand-riff value (the three syllables literally rearrange "Seen|Grid").
- Grid-only-skew was discussed and accepted: it pre-commits to the "Grid Operator = flagship" framing from Idea 4. If Idea 4 lands on a different bridge architecture in the Visual Overhaul chat, the slogan may need to be revisited.
- Per-tab sublines (Muse Spark's secondary suggestion) were **explicitly deferred to Visual Overhaul** because they're entangled with the Idea 4 architectural decision. Plan: descriptive (not poetic) one-liners inside each tab's content body, NOT in the header. Reserve the pun for the global slogan only.

**⚠ ANTI-PATTERN RECORD — what NOT to do (read commits `8e2eebe` v1 and `869169f` v2 for full code):**

**v1 (commit `8e2eebe`)** — 13px / Space Grotesk weight 400 / `--sg-text-secondary` (#909090) / letter-spacing 0.04em / inline right of wordmark with thin divider. **Result: invisible.** Sat in the exact same visual category as the tab nav (also 13px / 400 / dim) — user reported it looked like "another tool tab that can't be clicked". Accurate diagnosis: rolling straight into the tab-nav typography category created a tab-lookalike.

**v2 (commit `869169f`)** — overcorrection. Stacked five differentiators: 17px / weight 500 / `--sg-text-primary` (#e0e0e0) / "Grid." in `--sg-teal` matching wordmark accent / letter-spacing 0.015em. **Result: two new failures, both real:**
1. **Double-brand-echo.** Putting "Grid." in `--sg-teal` next to the wordmark's `Seen[Grid]` (also white + teal-Grid) created two sequential `white-TEAL-white` color patterns. Eye reads "doubled brand marker" instead of "wordmark + complementary tagline". Brand-echo theory was too literal — duplicated the wordmark's color DNA instead of complementing it.
2. **Gaming-clan / esports vibe.** Three contributing factors: (a) colored accent on a single word in an otherwise white tag is the exact treatment Faze/OpTic/NRG/C9 etc. have used since ~2010, (b) the three-beat hard-stop cadence rhymes with esports taglines ("Land. Loot. Win.", "Survive. Adapt. Conquer."), (c) bright + bold + mid-size typography reads as designed brand piece, not subtle pro-tool tagline. The slogan content itself carries (b), but (a) and (c) are typography choices that amplified it.

**v3 / cleanup (this commit)** — both attempts reverted, slogan removed from Header.jsx and Header.css entirely. `header.slogan` i18n key does NOT exist (was added in v1, removed in v2, never restored). Header is back to its pre-`8e2eebe` state.

**Lessons learned for the Visual Overhaul Opus:**
1. **Pro tools that DO carry a header tagline use uniform muted color, NEVER a colored accent on a single word.** Notion ("The connected workspace"), Adobe ("Photo and design") — all uniform gray, no per-word accent. The colored-accent treatment is the trigger for "designed brand piece" reading.
2. **Inline-right of wordmark is structurally risky** because the slogan shares a baseline with the tab nav. Even with size differentiation, the eye groups elements on the same scan line. Stacked layout (slogan UNDER the wordmark, part of the brand block) is the convention used by Notion/Linear/Adobe and may be the safer structural choice.
3. **The display-font decision really does matter.** Both failed attempts used Space Grotesk (body font). A real display font (Neue Machina / Space Mono Display / Instrument Serif) would change the slogan's character enough that the size/weight/color decisions would land differently. Building before the display font is chosen forces guesswork that doesn't transfer.
4. **The gate ("do this in Visual Overhaul chat") existed for a reason. Don't bypass it just because the user wants to "see how it looks".** Two failed attempts and a revert is more token-waste than waiting for the right context. If the user pushes to ship a gated item early, push back with the gate's reasoning instead of building on speculation.

**What the Visual Overhaul Opus should do:**
- Decide display font first (with the rest of the typography pass).
- THEN design the slogan treatment as part of the display-font system, not as an isolated header tweak.
- Strongly consider stacked-below-wordmark layout instead of inline-right.
- Strongly consider uniform color (no per-word accent) — match the Notion/Adobe convention.
- The slogan content **"Scene. Grid. Seen."** is user-approved and stays. Only the typographic treatment needs designing.

---

### Idea 2 — GridCropper ★★★ KILLER FEATURE

**What:** Close the loop. Currently SeenGrid is a one-way prompt generator (build prompt → user leaves → never comes back with anything). User wants: **build prompt in NanoBanana-optimized Grid Operator → user generates in NanoBanana → comes back with a finished grid image → uploads it → 1-click gets perfectly cropped individual panels back out.** This is the difference between "SeenGrid is another prompt builder" and "SeenGrid is a closed production system". It is the feature that actually makes SeenGrid unique vs. every other prompt tool on the planet.

**⚠ Engine scope — NanoBanana only.** Grid-based workflows are **NanoBanana-exclusive** in SeenGrid. Midjourney is intentionally **excluded from anything grid-related** because MJ is not stable enough in grid contexts — composition consistency across cells breaks down, aspect ratios are unreliable, and panel boundaries are not enforceable. MJ stays as a pure single-image cinematic tool (Midjourney Cinematic tab). The GridCropper therefore only needs to handle NanoBanana outputs — no MJ edge cases to worry about. See also Idea 4 for the product-framing consequences.

**Technical feasibility:** 100% client-side. Canvas API for the crop, JSZip for batch export, FileSaver for download. Zero backend, matches CLAUDE.md's no-backend rule. Size estimate: ~300–500 lines React + Canvas logic + small deps.

**Architecture decision:** Integrate into Grid Operator as a second sub-mode, NOT as a new tab. Reason: grid context (rows/cols, layout, panel-roles) is shared — if the user just built a 3×3 in Build mode, the Crop mode should already know it's 3×3. Ideal UX: sub-mode toggle at the top of Grid Operator: **"Build"** (current prompt-generating flow) | **"Crop"** (upload finished grid, extract panels). State shared between modes.

**Edge cases already identified (NanoBanana-only):**
- NanoBanana's common output aspect ratios: 1:1, 16:9, 9:16, 4:5. Per-axis math (canvas_w/cols, canvas_h/rows) — lesson learned from the advisory pass.
- Layout variants: **v1 only implements "Even" layout.** Seamless/Framed/Letterbox/Storyboard/Polaroid need separate handling and come in v2 when real use cases pile up.
- Gutters/borders: NanoBanana sometimes inserts thin lines between panels depending on prompt wording. Optional "inset crop by N px" slider is useful.
- Export modes: per-panel download vs. ZIP. Naming convention suggestion: `{prompt-slug}_r{row}c{col}.png`.

**Opus triage:** ★★★ Killer feature. Large but bounded scope, worth its own dedicated Stage 6 chat. Independent of Visual Overhaul — can happen before or after, but user's strong recommendation is **after Visual Overhaul**, in a dedicated feature chat (don't mix visual work with feature work, context pollution risk).

**Gate:** None. Ready to build whenever user opens a new chat for it. Suggested chat-opening prompt: *"Stage 6: GridCropper. Read OPUS_CODE_HANDOFF.md → Idea 2 for full brief. NanoBanana only, no MJ. Start with an implementation plan + architecture sketch, not code."*

---

### Idea 3 — Professional Character Sheet (Character Operator, Phase 2)

**What:** A structured multi-grid methodology for maximum character-consistency in Kling/Seedance workflows. Structure: **1 Hero Shot** (perfect single-image, primary identity extraction) anchors **3 reference sheets** around it — **Face Sheet** (3×2, 5–6 angles, corrects face), **Body Sheet** (3×2, 6 angles, corrects body), **Wildcard Sheet** (3×2, situational, corrects specific details). Each reference sheet is anchored back to the Hero Shot via prompt reference, so downstream video engines get maximum identity signal.

This is the concrete form of the **Character Operator** that is already listed as a Phase 2 item in CLAUDE.md ("Character Operator mit Multi-Varianten") — the user just now has the methodology clear in his head but has not yet **field-tested** it end-to-end.

**⚠ DOUBLE BLOCKER — both must clear before any build work:**

1. **User must field-test the 3-sheet methodology** (Hero + Face + Body + Wildcard) in real Kling/Seedance workflows and confirm it actually produces the identity consistency he expects. **User has explicitly said he wants to test this first before shipping it to Opus.** Until testing is done and validated, no implementation.

2. **Exact prompt templates must exist as committed text.** CLAUDE.md Rule 3 ("SeenGrid Signature Presets = exact templates from DeepSeek1.txt, not reinterpreted") and the "don't invent" rule both apply. The four Hero/Face/Body/Wildcard templates must exist either as new entries in DeepSeek1.txt or as a dedicated `CharacterSheet_methodology.txt` at repo root **before** Opus can touch the feature. Otherwise Opus is forced to invent templates → rule violation.

**Instruction for next Opus:** **Keep this in mind and plan for it in the overall roadmap, but DO NOT start building or pushing for immediate implementation the moment the next chat starts.** It's a later stage, not a next step. If the user hasn't explicitly said "templates are ready, let's build Stage 7", leave Idea 3 alone and focus on whatever the current chat's actual topic is.

**Implementation path options (once BOTH blockers clear, user prefers B or C over A):**
- ~~**A)** 4 new presets in the existing Character category.~~ — User rejects: loses the "this is ONE unified methodology" framing. Not the preferred path.
- **B) New preset group "Character Workflow"** in Grid Operator with a visual workflow representation (Hero at top → Face/Body/Wildcard as children). Medium effort. Keeps everything inside Grid Operator.
- **C) Full Character Operator as its own tab** with a guided step-chain (Step 1: generate Hero, Step 2: generate Face using Hero as reference, Step 3: Body, Step 4: Wildcard). Largest effort. Cleanest match to the 4-layer architecture in CLAUDE.md. Professional, standalone, maximum control.

**User preference:** Either B or C — decision stays open for the next chat. Next Opus presents both with concrete pros/cons and lets user pick.

**Opus triage:** ★★ Medium-large. Strongly aligned with existing Phase 2 plans. **BLOCKED on both field-testing AND template availability** — do not build until user confirms both gates are open.

**Gate:** (1) User confirms field-testing done and methodology works. (2) User provides the 4 prompt templates as committed text. (3) User explicitly opens Stage 7 chat. Until all three: plan for it in Opus's head, never build it.

---

### Idea 4 — Core + Modules product-framing (architectural)

**⚠ IMPORTANT — User has clarified the correct framing. Do not follow any earlier "merge NanoBanana into Grid" reading — that was ChatGPT's original wording and the user has explicitly corrected it.**

**User's actual mental model (the correct framing):**

- **Grid Operator** stands alone. It is its own flagship module for grid-based production workflows.
- **NanoBanana Studio** stands alone too. It is its own single-prompt builder. **However, the user wants an OPTIONAL bridge:** NanoBanana Studio should be able to combine with the Grid Builder on demand, so a user crafting a NanoBanana prompt can optionally promote it into a grid-capable prompt (rows/cols + NanoBanana-optimized grid instructions) without leaving the Studio. This is not a merge — it's an optional combine-toggle.
- **Midjourney Cinematic** stays completely separate and **never touches grids**. MJ is not stable in grid contexts (see Idea 2's engine-scope note). MJ is positioned purely as a cinematic single-image tool. No grid integration, no bridge, no combine-toggle.
- **Vault** stays as the community reference library.

**So the product hierarchy is:**
> Grid Operator = flagship grid workflow. NanoBanana Studio = single-prompt builder, optionally bridgeable into a grid. Midjourney Cinematic = cinematic single-image extra, strictly no grids. Vault = reference library.

**Why this matters:** This framing cleanly solves the confusion ChatGPT diagnosed (four loose tools, no articulated hierarchy) without forcing users through a full grid setup when they just want one NanoBanana prompt. It also draws a clean line between stable (NanoBanana × grid) and unstable (MJ × grid) engine behavior.

**Open architectural questions for the next chat — present 3–4 concrete options to the user, let user pick:**

How should the "NanoBanana ↔ Grid bridge" be surfaced in the UI? Some starting points (next Opus should extend/refine):
- **Option A** — "Promote to Grid" button inside NanoBanana Studio. Clicking it serializes the current prompt state into Grid Operator's Build mode and navigates there. One-way hand-off.
- **Option B** — Grid-mode toggle inside NanoBanana Studio itself. When enabled, a rows/cols picker appears and the output morphs into a grid-capable prompt. No tab switch, no hand-off. Single module, two output modes.
- **Option C** — Shared "engine + format" selector at a higher level. User first picks engine (NanoBanana / MJ / Vault) + format (Single / Grid); app routes them into the right module based on the choice. Grid+MJ combination is disabled in the selector.
- **Option D** — Keep everything as it is, but add a clearly-labeled cross-link chip at the top of NanoBanana Studio: *"Need a grid? → Grid Operator"*. No bridge logic, just navigation. Lowest effort, lowest risk.

**Tab ordering and copy questions (independent of the bridge decision):**
- Should Grid Operator be the first tab (currently second) to signal its flagship status?
- Should tabs carry a small badge/label indicating their role? (★ Grid, NanoBanana, MJ, Vault)
- Should tab tooltips be rewritten to explicitly state the hierarchy? *"Grid Operator — flagship multi-panel workflow"* / *"NanoBanana Studio — single prompt, optionally grid-bridgeable"* / *"Midjourney Cinematic — single-image cinematic, no grids"*

**Opus triage:** ★★ Strategic/architectural, not implementation. **Must be the FIRST conversation item in the Visual Overhaul chat** because the answer drives layout, hierarchy, copy, tab order, and badges. Decision must come from the user, not from Opus.

**Gate:** This is a dialogue task, not a build task. Next Opus opens Visual Overhaul chat → presents 3–4 bridge options (A/B/C/D above or refined versions) → waits for user decision → feeds decision into the rest of the overhaul. **Do not pick an option unilaterally. Do not build any of them without explicit user approval.**

---

## Recommended sequencing across the next chats

Opus's proposed order (user can override):

1. **Visual Overhaul chat (next):**
   - Opens with **Idea 4** (architectural product-framing using the user's corrected mental model — Grid Operator standalone, NanoBanana standalone + optional grid-bridge, MJ strictly no grids, Vault separate). 3–4 bridge options, user picks.
   - Flows the decision into the visual work (mockups, tokens, section cards, quick-nav visual treatment, accordion vs multi-column, tab order, badges, tooltip copy).
   - **Idea 1** (slogan) lands in this chat too, using "Scene. Grid. Seen." as opening proposal.
   - **Explicitly NOT in this chat:** GridCropper and Character Sheet — keeps scope bounded.

2. **Stage 6 chat — GridCropper (dedicated, after Visual Overhaul):**
   - **Idea 2** end to end.
   - **NanoBanana only, no MJ.** MJ is explicitly excluded from all grid-related features.
   - Sub-mode integration into Grid Operator (Build / Crop toggle).
   - v1 only handles "Even" layout.

3. **Stage 7 chat — Character Operator (LATER, fully blocked):**
   - **Idea 3**, Option B or C (user decides at that time, A rejected).
   - **Double-blocked:** (a) user must field-test the 3-sheet methodology first and confirm it works in real Kling/Seedance workflows, (b) the 4 prompt templates must exist as committed text in the repo.
   - **Instruction for next Opus:** keep this in the back of your head, remember it exists, plan around it in the overall roadmap — but do NOT push for it at the start of the next chat. It is explicitly a later-stage item and the user will say when it's ready.

---

## Absolute Rules (do not break)

1. **Data-driven, not hardcoded.** All content in JSON under `src/data/`.
2. **Prompt output always English**, even when UI is DE. Never feed `t()` or `tData()` into the generated prompt strings.
3. **SeenGrid Signature presets = exact templates from `DeepSeek1.txt`**, not reinterpreted.
4. **No camera movement** in NanoBanana Studio (Dolly/Steadicam etc. are Kling/Seedance concerns, not image generation).
5. **Gold = Signature, Teal = Standard.** Do not mix.
6. **Font discipline:** Space Grotesk for body, chips, buttons, labels. JetBrains Mono ONLY for generated prompt output, section labels, badges, character counters.
7. **EN is primary**, DE is the translation. `tData()` fallback chain: `<lang>` → `en` → legacy.
8. **Tooltips on every interactive element**, all routed through i18n.
9. **`Ctrl+Shift+G` = Random, `Ctrl+Shift+C` = Copy.** Never `Ctrl+Shift+R` (browser hard-refresh conflict).
10. **Paste-ready outputs**, never panel-number listings.

---

## Conventions

- **Branch:** development branch is supplied by the session system prompt. Current: `claude/read-handoff-context-CPMDU`. Do not push to other branches without explicit permission.
- **Commit style:** concise title, body explains *why*. Include the Claude Code session footer link when appropriate.
- **GPG signing:** currently not blocking. If a future commit fails on signing, use `git -c commit.gpgsign=false commit -m "..."`.
- **User context:** German-speaking solo AI filmmaker. Thinks in film terms, not webdev. Brutal honesty, no sycophancy, no generic AI output tolerated. Keep explanations concrete. Ask before making structural/design decisions — user has opinions and wants to be asked.
- **Two-LLM split (Opus + Sonnet) failed historically.** Do not re-attempt. Work directly in code.

---

## File Structure

```
src/
  App.jsx                       4 tab nav + lazy-import routing
  context/LangContext.jsx       i18n: t() + tData()
  styles/theme.css              CSS tokens: --sg-*, gold + teal + surfaces
  components/
    PromptBuilder.jsx            NanoBanana Studio (tab 1)
    GridOperator.jsx             Grid Operator (tab 2)
    MJStartframe.jsx             Midjourney Cinematic (tab 3, file name legacy)
    PromptVault.jsx              Vault (tab 4)
    layout/                      Header + tab nav
  data/
    i18n.json                    all UI strings EN + DE
    core-templates.json          Grid Core templates
    styles.json, cameras.json …  12 chip data files (t_en / t_de)
    presets/
      _categories.json           category order + DE/EN labels
      *.json                     18 SeenGrid Signature presets
    mj/
      templates.json, filmstocks.json, random-pools.json, …
    random/
      scene-patterns.json, settings.json, subjects.json, actions.json,
      moods.json, sensory-details.json, atmospheres.json, textures.json
```

---

## How a new Opus picks up the work

1. Read this doc top to bottom.
2. Read `ROADMAP.md` — persistent memory, stage checklist, decisions.
3. Read `CLAUDE.md` — project bible.
4. `git log --oneline -15` for recent context.
5. Ask the user what's next. Do not invent priorities.
6. After every completed fix:
   - `npx vite build` must stay green.
   - Commit + push on the branch from the system prompt.
   - **Update this handoff doc** (Quick Status, Module Status if relevant, Session Work Log).
   - Update ROADMAP.md only when a named stage completes.
