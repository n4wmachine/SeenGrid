# SEENGRID — Opus Code Handoff

> **Last updated:** 2026-04-12, session `claude/read-handoff-context-CPMDU` — end of Grundstruktur UX-polish pass
> **Read order for a new Opus:** 1) this doc  2) `ROADMAP.md`  3) `CLAUDE.md`
> **Rule:** update this doc after every fix. It is the snapshot-of-truth.
> **Next chat:** Visual Overhaul (new dedicated chat). Base structure is solid. See *Pending: Visual Overhaul* below.

---

## Quick Status

- **Branch:** `claude/read-handoff-context-CPMDU`
- **Latest commit:** see `git log --oneline -5`
- **Build:** `npx vite build` green
- **Status:** All 5 approved Grundstruktur-fixes (#1 / #2 / #4-quick / #5 / #6) completed. Chat is ready to close; next work happens in a new Visual-Overhaul chat.
- **⚠ READ FIRST BEFORE PLANNING:** Section *Pending: Feature Ideas (accumulated, not yet built)* below — 4 user-collected ideas with triage + sequencing guidance. Don't jump into Visual Overhaul without reading that section; Idea 4 (architectural product-framing) must be the first conversation item in the next chat.
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

---

## Pending: Feature Ideas (accumulated, not yet built)

User collected these between sessions. Triage + sequencing guidance by Opus from this session. **These are NOT build orders** — each has an explicit gate and a triage category. Next Opus: read, discuss with user, don't guess priority.

### Idea 1 — Header slogan (cosmetic)

**What:** A micro-tagline in the currently-empty header area, ideally under the wordmark. The slogan MUST play on the Seen/Scene double meaning — otherwise the whole point of the name is wasted.

**User's list of candidates:** "Your scene. Perfectly seen.", "Scene it. See it. Grid it.", "If you can see it, you can scene it.", "Scene. Grid. Seen.", "Make Every Scene Seen", "SeenGrid – See the Scene.", "SeenGrid: Direct Your Vision."

**Opus triage:** ★ Cosmetic, 5-min change, but placement + typography are visual-design decisions → belongs in the Visual Overhaul chat, not before. Pro creator tools (Resolve, Cinema4D, Nuke) mostly don't carry slogans in their header because it reads as marketing on a workingtool — the SeenGrid name's double meaning is the only justification for breaking that convention.

**Opus's favorite from the list:** **"Scene. Grid. Seen."** — tightest. Three words, each a core verb/concept, reads as a workflow (scene it → grid it → it's seen). Rhythm sits, works in both DE and EN, no grammar traps. Alternatives worth considering: **"Seen as a Grid."** or **"From scene to seen."**

**Gate:** None. Do in Visual Overhaul chat once display-font + typography decisions are made — the slogan must pick up the same typographic treatment as the rest of the display-level text. Don't retrofit after the overhaul is done.

---

### Idea 2 — GridCropper ★★★ KILLER FEATURE

**What:** Close the loop. Currently SeenGrid is a one-way prompt generator (build prompt → user leaves → never comes back with anything). User wants: **build prompt → user generates in NanoBanana/MJ → comes back with a finished grid image → uploads it → 1-click gets perfectly cropped individual panels back out.** This is the difference between "SeenGrid is another prompt builder" and "SeenGrid is a closed production system". It is the feature that actually makes SeenGrid unique vs. every other prompt tool on the planet.

**Technical feasibility:** 100% client-side. Canvas API for the crop, JSZip for batch export, FileSaver for download. Zero backend, matches CLAUDE.md's no-backend rule. Size estimate: ~300–500 lines React + Canvas logic + small deps.

**Architecture decision:** Integrate into Grid Operator as a second sub-mode, NOT as a new tab. Reason: grid context (rows/cols, layout, panel-roles) is shared — if the user just built a 3×3 in Build mode, the Crop mode should already know it's 3×3. Ideal UX: sub-mode toggle at the top of Grid Operator: **"Build"** (current prompt-generating flow) | **"Crop"** (upload finished grid, extract panels). State shared between modes.

**Edge cases already identified:**
- Non-square input (MJ 4:3, NanoBanana 1:1 or 16:9) → per-axis math (lesson learned from the advisory pass).
- Layout variants: **v1 only implements "Even" layout.** Seamless/Framed/Letterbox/Storyboard/Polaroid need separate handling and come in v2 when real use cases pile up.
- Gutters/borders: engines sometimes insert thin lines between panels. Optional "inset crop by N px" slider is useful.
- Export modes: per-panel download vs. ZIP. Naming convention suggestion: `{prompt-slug}_r{row}c{col}.png`.

**Opus triage:** ★★★ Killer feature. Large but bounded scope, worth its own dedicated Stage 6 chat. Independent of Visual Overhaul — can happen before or after, but user's strong recommendation is **after Visual Overhaul**, in a dedicated feature chat (don't mix visual work with feature work, context pollution risk).

**Gate:** None. Ready to build whenever user opens a new chat for it. Suggested chat-opening prompt: *"Stage 6: GridCropper. Read OPUS_CODE_HANDOFF.md → Idea 2 for full brief. Start with an implementation plan + architecture sketch, not code."*

---

### Idea 3 — Professional Character Sheet (Character Operator, Phase 2)

**What:** A structured multi-grid methodology for maximum character-consistency in Kling/Seedance workflows. Structure: **1 Hero Shot** (perfect single-image, primary identity extraction) anchors **3 reference sheets** around it — **Face Sheet** (3×2, 5–6 angles, corrects face), **Body Sheet** (3×2, 6 angles, corrects body), **Wildcard Sheet** (3×2, situational, corrects specific details). Each reference sheet is anchored back to the Hero Shot via prompt reference, so downstream video engines get maximum identity signal.

This is the concrete form of the **Character Operator** that is already listed as a Phase 2 item in CLAUDE.md ("Character Operator mit Multi-Varianten") — the user just now has the methodology clear in his head.

**⚠ HARD BLOCKER:** CLAUDE.md forbids inventing content. Rule 3 ("SeenGrid Signature Presets = exact templates from DeepSeek1.txt, not reinterpreted") and the "don't invent" rule both apply. **Before this can be built**, the exact prompt templates for each of the 4 sheet types (Hero / Face / Body / Wildcard) must exist as text in a source document — either as new entries in DeepSeek1.txt, or as a dedicated `CharacterSheet_methodology.txt` at repo root. If they don't exist yet, the user must write them before the next Opus can touch the feature, otherwise Opus will be forced to invent templates → rule violation.

**Implementation path options (once templates exist):**
- **A) 4 new presets** in the existing SeenGrid Signature Character category (Hero, Face, Body, Wildcard). Fastest. Loses the "this is ONE unified methodology" framing.
- **B) New preset group "Character Workflow"** in Grid Operator with a visual workflow representation (Hero at top → Face/Body/Wildcard as children). Medium effort. Recommended starting point.
- **C) Full Character Operator as its own tab** with a guided step-chain (Step 1: generate Hero, Step 2: generate Face using Hero as reference, Step 3: Body, Step 4: Wildcard). Largest effort. Cleanest match to the 4-layer architecture in CLAUDE.md. Worth it only after B proves the methodology works in real usage.

**Opus triage:** ★★ Medium-large. Strongly aligned with existing Phase 2 plans. Do option B first. **BLOCKED on template availability** — do not build without source text.

**Gate:** User provides the 4 prompt templates as text first. Then new chat: *"Stage 7: Character Operator (Option B). Templates live in `<path>`. Read OPUS_CODE_HANDOFF.md Idea 3 for the methodology. Build the preset group + workflow UI."*

---

### Idea 4 — Core + Modules product-framing (architectural, from ChatGPT via user)

**What:** User (via ChatGPT's suggestion) wants to rethink whether SeenGrid is "four loose tools in four tabs" or "one core system with modules". ChatGPT's proposal: **Grid Operator is the core and the real USP**, NanoBanana Studio should be integrated INTO Grid Operator (because NanoBanana is strongest for grid/consistency work), MJ stays separate, and the guiding flow is **structure/grid/preset → engine/output mode → optional look/style layer**.

**Opus triage, honest:**

ChatGPT is **right on diagnosis, wrong on execution.**

Right: The app currently reads as four separate tools because the product hierarchy is not articulated anywhere in the UI. New users can't tell whether Grid Operator is a bigger version of NanoBanana Studio or a different workflow entirely. That's a real problem.

Wrong: Merging NanoBanana Studio into Grid Operator would force users through a full grid setup even when they just want a single-image prompt. That's a UX regression. NanoBanana Studio (Core generic builder) and Grid Operator (SeenGrid Signature multi-panel) already encode the Core-vs-Signature duality from CLAUDE.md — just split across two tabs instead of being articulated as one product.

**The real answer (Opus opinion, not an order):**

The four tabs can stay. But the product needs a clear hierarchy statement baked into the UI copy and tab order:
> **Grid Operator is the flagship.** NanoBanana Studio is "Quick Single-Prompt mode". Midjourney Cinematic is "Quick Single-Prompt mode with MJ rules". Vault is the community reference library.

Concrete UI consequences if the user picks this framing:
- **Tab order change:** Grid Operator first (currently second). 10-second code change, big symbolic effect.
- **Tab tooltip/description refresh:** "NanoBanana Studio" → "Quick NanoBanana prompts — single image mode", "Grid Operator" → "**Flagship.** Multi-panel grid builder with SeenGrid Signature presets", "Midjourney Cinematic" → "Quick Midjourney prompts — cinematic anchor format".
- **Possibly:** small ★ or "Core" badge on the Grid Operator tab indicating its primary status.
- **Optional:** a Home/Landing hub as a fifth pseudo-tab — instead of landing straight in a module, show a conceptual map ("Single-Shot Prompts" | "Grid Workflow" | "Inspiration") that routes into the right tab. Only if the Visual Overhaul has room for it.

**Options to present to user in the next chat** (do not decide unilaterally):
- **A)** Keep 4 tabs as-is, add a homepage/hub with a conceptual map.
- **B)** Promote Grid Operator to primary mode, rename others as "Quick Prompts — NanoBanana" / "Quick Prompts — Midjourney". Minimal structural change, maximum copy change.
- **C)** Add engine selector INSIDE Grid Operator (NanoBanana / MJ / Kling / Seedance as dropdown) + NanoBanana Studio stays as fast single-image mode. Medium structural change.
- **D)** Rename tabs + refresh tooltips only. Minimal invasive. Lowest risk.

**Opus triage:** ★★ Strategic/architectural, not implementation. **Must be the FIRST conversation item in the Visual Overhaul chat** because the answer drives layout, hierarchy, copy, and badges. Decision must come from the user, not from Opus.

**Gate:** This is a dialogue task, not a build task. Next Opus opens Visual Overhaul chat → starts with this question → presents options A/B/C/D → waits for user decision → feeds decision into the rest of the overhaul.

---

## Recommended sequencing across the next chats

Opus's proposed order (user can override):

1. **Visual Overhaul chat (next):**
   - Opens with **Idea 4** (architectural product-framing). 3–4 options, user picks.
   - Flows the decision into the visual work (mockups, tokens, section cards, quick-nav visual treatment, accordion vs multi-column).
   - **Idea 1** (slogan) lands in this chat too, using "Scene. Grid. Seen." as opening proposal.
   - **Explicitly NOT in this chat:** GridCropper and Character Sheet — keeps scope bounded.

2. **Stage 6 chat — GridCropper (dedicated, after Visual Overhaul):**
   - **Idea 2** end to end.
   - Sub-mode integration into Grid Operator.
   - v1 only handles "Even" layout.

3. **Stage 7 chat — Character Operator (blocked until templates exist):**
   - **Idea 3**, Option B implementation.
   - Does not start until the 4 Hero/Face/Body/Wildcard templates exist as committed text in the repo.

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
