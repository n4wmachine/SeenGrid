# SEENGRID — Modular Grid Architecture

> **Created:** 2026-04-13, session `claude/seengrid-visual-overhaul-kzfBe`
> **Status:** Architecture spec + destillation plan, **no code written yet**
> **Next chat:** starts Character Study Phase 1 using this doc as the sole briefing
> **Read order for a new Opus:** this doc first (top to bottom, no skim), then `OPUS_CODE_HANDOFF.md`, then `CLAUDE.md`, then `ROADMAP.md`

---

## TL;DR for a brand-new Opus

1. SeenGrid's real USP is not the prompt builder, the MJ module, the Vault, or the Visual Overhaul. It is a **modular grid operator**: a small set of preset skeletons (Character Study, Character+World Merge, Start/Endframe, World Zone Board, Multishot Sequence) where every optional part is a toggle/select module, the base skeleton alone is NanoBanana-optimized and production-ready, and the live output updates as the user flips modules on/off.
2. The current Grid Operator is NOT this. It is a static template library — 18 prompt-text copies from `DeepSeek1.txt`, some with hardcoded Reference B mentions that the user has to delete manually every time, others with fixed looks that can't be swapped out. This is why every workflow feels like "prompt builder with extra steps".
3. The Visual Overhaul chat (the nominal purpose of the current session) pivoted mid-conversation because we realized it is pointless to repaint UI for a Grid Operator that is about to be structurally rewritten. **Structure first, then visual.** This is user-approved, locked in.
4. Your job, starting the next chat: **Phase 1 of Character Study destillation.** Read `DeepSeek1.txt`, pull all character-sheet-shaped variants, do the baseline-breakdown analysis, come back for the user's approval on the skeleton/module classification. Do not write code. Do not touch the Visual Overhaul. Do not re-litigate any decision in this doc — they are locked.
5. If at any point you catch yourself writing a generic "Grid Operator = template library" framing, **stop** — you've regressed to the pre-pivot model. Reread the *Core Concept* block below.

---

## The Problem with the Current Grid Operator

Today's `GridOperator.jsx` has three modes — Core, SeenGrid Signature, Custom Grid — and 18 presets split across five categories (character / world / multi-shot / detail / technical). Each preset is a static prompt string lifted 1:1 from `DeepSeek1.txt`.

Concrete user pain points (verbatim from the session dialogue, 2026-04-13):

- **"Wenn ich nur schnell was draften will muss ich jedes Mal im prompt das reference B rauslöschen."** Some presets hardcode `using reference A (full body) and reference B (zoomed face crop)` but the user often only has one reference image. They edit the output by hand, every single time.
- **"Die prompts an sich sind nicht seengrid optimiert bist jetzt."** The preset texts come from external sources (DeepSeek conversations, random templates, self-made experiments). They are not NanoBanana-optimized against the 6 core rules in `system-prompt-en.md`.
- **"Das sind teils technische sheets wie der mit dem technischen bauplan."** Most of the 18 presets are single-use technical sheets with little overlap in structure. They don't form a coherent vocabulary.
- **"Was jetzt für zumindest die modulare character sheet vorlage wichtig ist: es muss eine feste logik definiert werden, also der ausgangstext ohne zusatzmodule muss die beste basis bilden und perfekt auf nanobanana optimiert sein."** ← this is the mission statement for Phase 1.

Also rediscovered during the session:

- **Grid Operator is primarily image2sheet, not text2sheet.** In ≥90% of real user workflows the user already has a reference image (character portrait, location photo, production still) and wants the prompt that wraps *around* it to produce a sheet. Text-only sheet generation is the 10% fallback. This inverts the current Grid Operator layout which treats the scene text as the primary input and the image reference as a side-panel afterthought. **The Visual Overhaul must make the reference image the first-class entry point**, but that is the visual layer — the data model has to support it first.
- **The Look is structurally separate from the Scene in NanoBanana Studio.** Users experiment in NB Studio to find a look (film still / 35mm / low angle / Romanian 70s / ...) and then want to apply that look to a character or world sheet that they build in Grid Operator. The bridge between the two modules is not "promote scene to grid" (as the earlier Idea 4 framings suggested), it is **Look Transfer**: the NB Studio chip stack becomes a named, savable Look that the Grid Operator can load into a `Look` module slot inside any preset.

---

## Core Concept — Skeleton + Modules

Every pilot preset consists of three layers:

**1. Skeleton**
A fixed prompt template with placeholder slots, engineered to be NanoBanana-optimal on its own. The skeleton alone — with zero modules enabled — must already produce a production-usable prompt. If it doesn't, the skeleton isn't finished.

**2. Modules**
Every optional addition to the skeleton is a module. A module has:
- an input (toggle / select / multi-select / text-slot / look-dropdown / image-drop-zone / numeric)
- a rendering rule (what prompt snippet is produced for each input state)
- a placeholder anchor in the skeleton (where the snippet lands)
- a "disabled" behavior (usually: the placeholder and any surrounding punctuation collapse cleanly, no ghost brackets)

When a module is disabled, its placeholder disappears from the live output and the surrounding skeleton stays grammatical. No manual editing, ever.

**3. Live output**
A read-only text field that recomposes the full prompt from `skeleton + enabled modules` on every user interaction. Copy-to-clipboard copies this composed string. The user sees exactly what they are about to paste into NanoBanana.

**Why this is different from the current system:**
Today: `preset.prompt_text = "…hardcoded 1000-char string…"` → user edits manually.
New: `preset = { skeleton, modules[] }` → user toggles modules, live output updates, no manual edits.

**Why this is different from a generic form builder:**
The skeleton is not empty. It is a *NanoBanana-optimized opinionated baseline* per use case. A user who picks Character Study and changes nothing still gets a prompt that works. Modules are refinements on top of a working baseline, not a mandatory checklist to reach a working prompt.

---

## Character Study — worked example

This is the example used throughout the session dialogue. It is illustrative, not final — the actual skeleton and module set will be produced in Phase 1-5 of the destillation methodology.

```
GERÜST  Character [study|sheet] with [characters] showing [poses]
        from [angles], [expressions], [look], [references].

MODULE  (alle optional, alle zuschaltbar)

┌─ Mode (style-aware) ─────────────┐
│ ● Cinematic Study                │
│ ○ Technical Sheet                │  ← only enabled if Style = Photoreal
└──────────────────────────────────┘
┌─ Characters ─────────────────────┐
│ ● 1    ○ 2    ○ 3                │
└──────────────────────────────────┘
┌─ Poses ──────────────────────────┐
│ ☑ neutral standing  ☐ action     │
│ ☐ seated            ☐ walking    │
└──────────────────────────────────┘
┌─ Camera Angles ──────────────────┐
│ ☑ front  ☑ 3/4   ☑ profile       │
│ ☐ back   ☐ low   ☐ high          │
└──────────────────────────────────┘
┌─ Facial Expressions ─────────────┐
│ ● off   ○ show: ...              │
└──────────────────────────────────┘
┌─ Look ───────────────────────────┐
│ [From NB Studio ▾]               │
│   Romanian 70s indie              │
│   Wong Kar-wai Hong Kong          │
│   none                            │
└──────────────────────────────────┘
┌─ References ─────────────────────┐
│ ☑ Ref A (full body)              │
│ ☐ Ref B (zoomed face crop)       │
│ ☐ Ref C (additional)             │
└──────────────────────────────────┘

LIVE OUTPUT  ↓  recomposes on every toggle
```

Toggle Ref B off → the `references` placeholder renders only `using reference A (full body)` and the entire Ref-B sentence disappears from the live output. No manual editing.

---

## The style-aware Mode module (critical correction)

In the session dialogue the assistant first assumed *"sheet = technical, angle study = cinematic"* as a clean dichotomy. **The user corrected this mid-session and the correction must be preserved:**

- **Photorealism + "sheet":** Production/reference look, valid.
- **Photorealism + "angle study":** Cinematic film still, valid.
- **Illustration / Anime + "sheet":** NanoBanana collapses into its default children's-cartoon style. **This is a fail state. The word "sheet" must never appear in the prompt when the output style is illustrative.**
- **Illustration / Anime + "angle study" / "character study":** Art-book / cinematic anime, valid.

So the Mode module is not standalone. It couples to the output-style signal (either from an attached NB Studio Look or from a dedicated style chip/module):

- If style = Photorealistic → Mode offers both `Technical Sheet` and `Cinematic Study`.
- If style = Illustration / Anime → Mode collapses to `Cinematic Study` only, and the token "sheet" is systematically replaced with "character study" / "character reference" across all skeleton bausteine that touch it.

The exact coupling mechanism (does the Mode module disable itself, or does it hide entirely? does style come from a Look slot or a separate style chip?) is a **Phase 3 decision**, not a Phase 0 guess. Do not nail the UI here before reading the source variants in `DeepSeek1.txt`.

---

## Char + World Merge — the multi-input topology

All other pilot presets are `1 input → N outputs` (one character → many angles, one location → many zones, one scene → many shots). **Char + World Merge is the only `multi-input → 1-to-few-outputs` topology** and exists as a pilot specifically to validate that the modular architecture holds for multi-input cases, not just single-input ones.

This is also one of the biggest daily workflow painpoints: user has a character sheet, user has a world image, user wants to merge them so the character is a natural part of the world — correct proportions, matched color grade, shadows cast from the world's light source, natural pose instead of stiff-in-frame, look that reads as "one shot" instead of "photoshop collage".

**User-added critical constraint (2026-04-13):**
> *"wichtig hier ist zudem rauszufinden wie man nanobanana noch sagen kann dass die proportionen stimmen von charakter zu welt. kling übernimmt falsche proportionen im startframe."*

Translation for Opus context: if proportions are wrong in the merged still image, downstream video models (Kling, Seedance, Runway) inherit the wrong proportions in the start frame and the entire generated video is broken. Proportion-control in the merge prompt is therefore not cosmetic — it is the hinge that determines whether the whole downstream pipeline works. Phase 1 for this preset must include a deliberate search through the NanoBanana system prompt and any proportion-enforcement phrases in DeepSeek1.txt, and the resulting skeleton must include a dedicated proportion-control clause (not just mention scale, but explicitly instruct NB to match character-to-world ratio based on the reference images).

---

## The 5 Pilot Presets

The first implementation round destillates and builds exactly these five presets. The other 13 legacy presets stay visible and functional with a "Legacy" badge and are migrated incrementally later — this is user-approved, not a deferred decision.

### Pilot 1 — Character Study (most complex, multi-source destillation)

- **Topology:** `1 input → N outputs` (one character → multiple angles/poses/expressions)
- **Input type:** single character reference image (Ref A required), optional additional crops (Ref B, Ref C)
- **Destillation mode:** Best-of across multiple DeepSeek1.txt variants, autonomous destillation with user review at end (see methodology below)
- **Key modules (first draft, to be refined in Phase 5):**
  - `Mode` (style-aware: Technical Sheet / Cinematic Study, coupled to output style)
  - `Characters` (1 / 2 / 3)
  - `Poses` (multi-select from a pose vocabulary)
  - `Camera Angles` (multi-select: front / 3-quarter / profile / back / low / high / top-down)
  - `Facial Expressions` (off by default; opt-in multi-select: neutral / smile / anger / fear / surprise / contemplation / ...)
  - `Look` (dropdown bound to NB Studio Look Register, or "none")
  - `References` (toggle-group: Ref A required, Ref B optional face crop, Ref C optional additional)
- **Success criterion for Phase 6 validation:** the skeleton alone (no modules enabled beyond required Ref A) must produce a working basic character sheet prompt. Skeleton + Look + Ref A = the Standard Case. Skeleton + all modules = Full Loadout with no grammatical breaks.

### Pilot 2 — Character + World Merge (multi-input topology, proportion-critical)

- **Topology:** `2+ inputs → 1 (or few) outputs`
- **Input type:** character reference image (required) + world reference image (required)
- **Destillation mode:** New skeleton, may have few DeepSeek1.txt precedents; partially new design work guided by NanoBanana system prompt rules + user's proportion-control requirement
- **Key modules (first draft):**
  - `Character Reference` [required] — character image
  - `World Reference` [required] — world/location image
  - `Integration Type` (Natural Placement / Interacting with Scene / Emotional Moment / Action Pose)
  - `Proportion Control` — **required clause, not optional**, ensures NB matches character-to-world scale ratio based on reference images (see critical constraint above; downstream video models depend on this)
  - `Lighting Match` (Auto-adapt to world / From specific source description)
  - `Color Grade Strategy` (Match world / Match character / New unified grade)
  - `Shadow Logic` (optional: cast-from direction hint)
  - `Pose Override` (optional text slot if user wants character to specifically stand/sit/act in a specific way)
  - `Look` (usually left empty here — the world image carries the look; opt-in if user wants to override)
  - `Output Mode` (Single merged frame / 2×2 variations with same character in same world at different moments)
- **Special attention:** the `Proportion Control` module needs a phrase that is strong enough to overcome NanoBanana's tendency to place characters at whatever scale its diffusion prior prefers. Phase 1 research: look for proportion-enforcement language in DeepSeek1.txt and in the jau123/nanobanana-trending-prompts repo. Candidate phrases to investigate: *"character scaled accurately relative to environment"*, *"realistic proportions matching world reference"*, *"match the size relationship shown in reference images"*, etc. The destillation must pick or craft the strongest one and validate it (if possible) against known problem cases.

### Pilot 3 — Start/Endframe Generator (temporal-pair topology, daily workflow)

- **Topology:** `1 transform → 2 outputs` (start state + end state with implicit motion interpolation)
- **Input type:** usually one reference image (the subject/scene that transforms), occasionally two (if start and end are genuinely different)
- **Why it's a pilot:** user explicitly flagged Start/Endframe as *"eines der wichtigsten dinge im täglichen workflow"* — downstream video models (Kling, Seedance, Runway) interpolate between start and end frames, so the quality of the framepair determines the quality of the generated video. Not optional, not deferrable.
- **Destillation mode:** Best-of from whatever variants exist in DeepSeek1.txt; probably fewer source variants than Character Study
- **Key modules (first draft):**
  - `Transform Type` (Subject Movement / Environment Change / Time Passage / Emotional State Shift / Camera Movement)
  - `Motion Hint` (optional text slot — one line describing the motion path for the video model)
  - `Duration Hint` (optional numeric — seconds, parametrizes the stretch of the transform)
  - `Reference` (single or paired)
  - `Look` (from NB Studio)
  - `Consistency Enforcement` (clause locking character/environment identity across the pair)
- **Note on Camera Movement:** the broader SeenGrid rule is *no camera movement in NanoBanana Studio* (it's a Kling/Seedance concern, not image generation). Start/Endframe is the **single legitimate exception** because the whole point of the framepair is to set up a camera motion for a downstream video model. Document this exception clearly in the skeleton comment so the next Opus doesn't accidentally "fix" it.

### Pilot 4 — World Zone Board (user-built, cross-check only)

- **Topology:** `1 input → N outputs` (one location → multiple zones/perspectives)
- **Input type:** world/location reference image
- **Destillation mode:** **Cross-check, not Best-of destillation.** The user built this preset themselves, it already works in practice. Phase 2 (variant comparison) is skipped. Phase 3 becomes "skeleton/module classification of the existing text". Phase 4 (NanoBanana optimization pass) is the real value-add here — check the existing text against the 6 core rules and flag anything that could be stronger, but do not rewrite wholesale.
- **Key modules (first draft, to be extracted from the existing text):**
  - `Zone Count` (3 / 4 / 6 / 9)
  - `Zone Labeling` (on/off — include named zones in the prompt)
  - `Perspective Mix` (uniform / varied / panoramic)
  - `Time of Day` (locked across zones / varied)
  - `Look` (from NB Studio)
  - `Reference` (single world image, required)
- **Success criterion:** modularization must preserve the user's intent and output quality. If the cross-check shows the existing text is already optimal, the skeleton/module split can be mechanical without content changes.

### Pilot 5 — Multishot Sequence (user-built, cross-check only)

- **Topology:** `1 input → N outputs` (one scene → narrative shot sequence)
- **Input type:** scene reference image (often a character-in-world still, or a key frame)
- **Destillation mode:** Cross-check, same as Pilot 4. **Phase 1 also searches for a "Storyboard" prompt in DeepSeek1.txt** which the user remembers existing and which would serve as a rough comparison reference if found.
- **Key modules (first draft):**
  - `Shot Count` (2 / 3 / 4 / 5 / 6)
  - `Shot Variation Axis` (camera distance / angle / moment in time / emotional beat)
  - `Narrative Arc` (off / simple / explicit — whether to include a beat structure in the prompt)
  - `Look` (from NB Studio)
  - `Reference` (scene image, required)
- **Special consideration:** Multishot Sequence and World Zone Board are both `1 → N` topology and could share base skeleton scaffolding. Phase 5 should explicitly check whether any modules can be hoisted to a shared level (e.g. `Shot Count`, `Look`, `Reference` are likely candidates for reuse across multiple presets). Cross-preset module reuse is a stretch goal for the first architecture round; if it makes Phase 5 significantly harder, defer to a later iteration.

### Processing order (not preset UI order)

The destillation work happens in this order:

1. **Character Study** — most complex single-input case, validates the architecture on its hardest input-side test
2. **Character + World Merge** — multi-input topology, validates the architecture on its structurally most different case; pulled forward from later position specifically so architectural breakage (if any) is discovered early
3. **Start/Endframe Generator** — temporal-pair topology, validates the 2-panel case
4. **World Zone Board** — cross-check of existing user-built text
5. **Multishot Sequence** — cross-check of existing user-built text

The UI order in the final Grid Operator is a separate decision and does not need to match the processing order.

---

## 6-Phase Destillation Methodology

This is the process applied to each pilot preset. Character Study uses all six phases. Char+World Merge uses all six with an extra research pass for proportion-control language. Start/Endframe uses all six with fewer source variants expected. World Zone Board and Multishot Sequence skip Phase 2 (variant comparison) and shrink Phase 3 to "classify the existing text".

### Phase 1 — Source collection (research only, no classification yet)

Pull every variant of the target preset out of `DeepSeek1.txt` (77 items total, several character-sheet-shaped entries per the user's recollection). Also:
- Read the current JSONs in `src/data/presets/` that touch the target preset (this is what lives in the tool today).
- Obtain the NanoBanana system prompt rules from `system-prompt-en.md` in `jau123/nanobanana-trending-prompts` — either local in the repo or fetched from GitHub. These are the 6 core rules that serve as the optimization lineal in Phase 4.
- Cross-reference against CLAUDE.md's "Core-Regeln" summary for a second perspective.
- For Char+World Merge specifically: search all sources for proportion-control phrases (see the "special attention" note on Pilot 2 above).

Deliverable: a corpus of source variants with provenance, ready for breakdown. **No classification, no judgments yet.** Just the raw material.

### Phase 2 — Baustein-Zerlegung (structural breakdown)

Split every variant into functional bausteine. Baustein examples:
- Framing statement (*"Character reference sheet featuring…"*)
- Subject description (how the character is described)
- Pose specification
- Angle specification
- Consistency enforcement (*"maintain identical facial features across all panels"* — this is the core of why character sheets work at all)
- Reference instruction (*"using reference A…"*)
- Technical parameters (aspect ratio, resolution, lighting consistency)
- Negative constraints (FORBIDDEN lists)
- Layout instruction (grid structure, panel arrangement)

Output: a table per variant. Baustein X → phrasing Y. Side-by-side comparable.

Skipped for user-built presets (World Zone Board, Multishot Sequence) — nothing to compare.

### Phase 3 — Classification + user review

Three questions per baustein:
1. **Does it appear in all variants?** → skeleton candidate. Without it, it's not the preset anymore.
2. **Does it appear in only some?** → module candidate. Optional.
3. **Which phrasing is strongest?** → best-of pick with justification.

Output: two lists (skeleton bausteine, module bausteine) with proposed phrasings. **Hard stop here for user review.** Do not proceed to Phase 4 until the user has approved the classification. This is where the user catches you if you misclassified something essential as optional.

### Phase 4 — NanoBanana optimization

Every skeleton baustein is checked against the 6 NanoBanana core rules:
- Feeling Words → Professional Terms (*"moody" → "low-key Rembrandt lighting with dramatic shadows"*)
- Adjectives → Parameters (*"sharp" → "f/2.8, 85mm, subject in focus"*)
- Negative Constraints actively used
- Sensory Stacking (visual + tactile + atmospheric layers)
- Grouping (related parameters together, not scattered)
- Format Adaptation (the prompt matches the output format — here: character sheet, not single frame)

Every baustein that violates a rule is rephrased. Goal: the skeleton alone, with no modules enabled beyond required ones, is already a production-usable prompt. If it isn't, the work isn't done — go back.

### Phase 5 — Module formalization

Every module gets a clear definition:
- Input type (toggle / select / multi-select / text-slot / look-dropdown / image-drop / numeric)
- Rendering rule (what prompt snippet is produced for each input state)
- Placeholder anchor in the skeleton (where the snippet lands)
- Disabled behavior (usually: placeholder collapses cleanly, no ghost brackets, surrounding punctuation adjusts)

Also flag any modules that look reusable across presets (e.g. `Look`, `Reference`, `Shot Count`). These become candidates for a shared module library in the code implementation.

### Phase 6 — Validation at real use cases

Three concrete usage scenarios per preset:
- **A) Skeleton alone, no optional modules** → must produce a working basic prompt
- **B) Skeleton + 1-2 most common modules** → the standard case
- **C) Skeleton + all modules enabled** → full loadout, no grammatical breaks, no ghost placeholders

If any of the three breaks, back to Phase 4. Skeleton is only final when all three pass.

---

## User-approved decisions (locked, do not re-litigate)

Everything in this block was discussed and decided during the 2026-04-13 session. A new Opus should not re-open any of these without explicit user request.

1. **Structure before visual.** Modular grid architecture is built first, Visual Overhaul comes after. The current chat's nominal purpose (Visual Overhaul) is pushed back one step. No repainting a Grid Operator that is about to be structurally rewritten.
2. **5 pilot presets, not 3.** Character Study / Char+World Merge / Start/Endframe / World Zone Board / Multishot Sequence. Scope expansion is accepted because (a) Start/Endframe is daily workflow, (b) Merge is the biggest painpoint and a new topology test, (c) World Zone and Multishot are cross-checks not full destillations so net workload stays manageable.
3. **Legacy strategy for the other 13 presets:** they stay visible, functional, marked with a "Legacy" badge. Migrated incrementally later. They do not block the pilots. User wants to keep drafting with them during the migration period.
4. **Future Grid Operator will have more preset categories than today.** User plans to add a "Trendy Sheets" or "Community" category later (crazy collages, young→old time-lapse, other experimental sheet formats). The modular architecture should not assume a fixed category set.
5. **Best-of destillation with autonomous execution.** For Character Study (the only preset with real multi-source material), the next Opus picks the strongest phrasing per baustein autonomously, presents the finished skeleton at the end with justifications per baustein, and the user reviews as a whole. Not per-baustein ping-pong. User explicitly chose speed over granular control.
6. **Sheet vs. Angle Study is one preset with a style-aware Mode module, not two separate presets.** Cinematic Study is the safe default; Technical Sheet is an opt-in only valid for photorealistic style. The word "sheet" must never appear in prompts with illustrative style.
7. **Char+World Merge must include a Proportion Control clause as a non-optional skeleton element**, not a module. Downstream video models (Kling, Seedance) depend on correct proportions in the start frame, so this is load-bearing.
8. **Bridge from NB Studio to Grid Operator is Look Transfer, not Scene Transfer.** The earlier Idea 4 A/B/C/D bridge options are all obsolete — including the inline "Grid Switch" idea (Weg A) which was explored mid-session and then discarded once the user clarified that NB Studio → quick 2×2 is a fake use case. **There is no bridge UI in NB Studio.** The bridge is a shared data concept: NB Studio grows a "Save Look" button that persists the current chip stack to a Look Register, and the Grid Operator's `Look` module slot reads from that register. One direction, one mechanism, no UI gesture in NB Studio beyond the save button.
9. **Image-first in Grid Operator.** ≥90% of Grid Operator usage is image2sheet, not text2sheet. The data model must make reference images a first-class input. The visual layout (big drop zones, thumbnail display, reference as the first visible control) is a Visual Overhaul concern but the data model under it is part of this architectural round.
10. **Idea 1 (header slogan) gate is still closed.** Two failed attempts in the previous session (commits `8e2eebe` and `869169f`, both reverted). No slogan work until display-font is chosen. Display-font is chosen in the Visual Overhaul, which now comes after this architectural round. So slogan does not land until after the modular grid work is done.

---

## Anti-patterns (things this session proved wrong, do not repeat)

1. **Do not treat Grid Operator as a template library.** It is a modular prompt operator. If you catch yourself designing a "better template picker" you have regressed.
2. **Do not build a "Grid Switch" inside NanoBanana Studio** that turns NB Studio's single-prompt output into a quick 2×2. This was explored mid-session as "Weg A" and explicitly rejected by the user after he clarified that the real Grid Operator use case is image2sheet and the casual "quick 2×2 of a random scene" fake-need does not exist. If you see the old Idea 4 bridge options A/B/C/D in the older handoff sections, **they are all obsolete**. The only bridge is Look Transfer.
3. **Do not build a "Promote to Grid" button in NanoBanana Studio** either. Same reason.
4. **Do not assume "sheet" is the professional/technical word and "angle study" is the cinematic word.** For photorealism both work. For illustration/anime, "sheet" triggers NanoBanana's children's-cartoon default style and breaks the output. The Mode module is style-aware, not style-agnostic.
5. **Do not skip Phase 3 (user review)** in the destillation process for Character Study. Best-of phrase selection needs the user's taste, not the Opus's guess. Present the finished skeleton with per-baustein justifications and wait for approval.
6. **Do not start with the Visual Overhaul.** The structure has to be right first. Repainting a soon-to-be-rewritten Grid Operator is wasted work and the user has explicitly agreed to the reordering.
7. **Do not invent new presets** beyond the 5 pilots. The 13 legacy presets stay static for now. New preset categories (Trendy/Community) are a later stage.
8. **Do not re-attempt the slogan** until display-font is chosen in the Visual Overhaul. That gate is still closed, pushed back one more step by the pivot.
9. **Do not add camera-movement concepts to any preset except Start/Endframe.** Camera movement is a Kling/Seedance concern, not image generation. Start/Endframe is the single exception because the whole point of the framepair is to set up a video model's camera motion. Document this exception in the skeleton comment.
10. **Do not write code in the first Phase 1-3 pass.** Destillation is dialog + analysis, not implementation. Code starts only after all 5 pilots have user-approved skeletons + module specs.

---

## Concrete next steps for the next Opus

**Chat opening move (no more exploration, no more re-litigating decisions):**

1. Read this doc top to bottom (no skim).
2. Read `OPUS_CODE_HANDOFF.md` Quick Status + Module Status sections for tech context.
3. Read `CLAUDE.md` for project bible + user style.
4. `git log --oneline -15` for recent context.
5. Confirm to the user: *"Handoff gelesen. Starte Phase 1 für Character Study: Lesen von DeepSeek1.txt + aktuelle Preset-JSONs + NanoBanana system-prompt. Melde mich mit der Baustein-Tabelle zurück, keine Code-Edits."*
6. Execute Phase 1: read `DeepSeek1.txt`, extract all character-sheet-shaped variants (likely several, different sources, different phrasings), read all character-related JSONs in `src/data/presets/`, obtain the NanoBanana system prompt.
7. Execute Phase 2: per-variant baustein breakdown.
8. Present Phase 3 output (skeleton candidates + module candidates + best-of picks with justification per baustein) and **wait for user review**. Do not proceed to Phase 4 until the classification is approved.
9. After user approval: Phase 4 (NB optimization) → Phase 5 (module formalization) → Phase 6 (validation).
10. After Character Study is done: proceed to Pilot 2 (Char+World Merge) with the same phased process, but with extra Phase 1 research on proportion-control language.

**What the next Opus is NOT doing:**
- Not touching the Visual Overhaul.
- Not writing code.
- Not re-opening any of the 10 user-approved decisions above.
- Not expanding scope beyond the 5 pilots.
- Not repeating the anti-patterns.

---

## Open questions that may surface in the next chat

These are not blockers for Phase 1 but the next Opus should be ready to ask the user when they come up:

1. **Look Register data shape:** does a saved Look include the scene text or only the chip stack? (Current leaning: chip stack only, because the scene is project-specific and not part of the look signature. But worth confirming once the user hits it in a real usage.)
2. **Look Register storage:** localStorage only, or eventually a JSON file the user can edit by hand like the other data files in `src/data/`? Current leaning: start with localStorage, migrate to JSON if the user wants cross-device persistence.
3. **Module reuse across presets:** if `Look`, `Reference`, and `Shot Count` are identical in multiple presets, should they be hoisted to a shared module library in Phase 5? Current leaning: yes, but only if the hoisting is trivial. If it complicates the first architecture round, defer.
4. **Legacy preset UI treatment:** where does the "Legacy" badge go visually? Next to the preset name? As a dimmed card state? This is mostly a Visual Overhaul question but may need a placeholder decision earlier if legacy presets and pilot presets are visible side by side during migration.
5. **Char+World Merge output mode default:** single frame vs. 2×2 variations. Most image2sheet use cases want the single frame. But the 2×2 variation is strong when the user wants to see the same character in the same world at several moments. Default is likely Single; confirm with user in Phase 5.
6. **Proportion-control phrasing validation:** the destilled proportion-control clause needs real-world validation against known problem cases. The user has personally hit this issue with Kling. Phase 6 validation for this preset might need actual test generation against NB, which is outside SeenGrid's scope — at minimum, flag the need for the user to run a manual test round before code ship.

---

## File reference

- **This doc:** `MODULAR_GRID_ARCHITECTURE.md` — the architecture spec, read first
- **`OPUS_CODE_HANDOFF.md`:** snapshot-of-truth for tech state + older session history; older Idea 1-4 sections are now obsolete but kept as history (do not re-read them as current spec)
- **`ROADMAP.md`:** long-term memory, stage checklist, decisions log; has a new Stage 6 "Modular Grid Architecture" entry pointing here
- **`CLAUDE.md`:** project bible, user context, architectural ground rules
- **`DeepSeek1.txt`:** source material for destillation (77 items)
- **`src/data/presets/`:** current 18 legacy preset JSONs (what lives in the tool today)
- **`src/data/i18n.json`:** all UI strings, EN primary + DE translation
- **`src/styles/theme.css`:** CSS tokens (gold/teal/surfaces) — relevant for later Visual Overhaul, not for this architectural round
- **NanoBanana system prompt:** `https://github.com/jau123/nanobanana-trending-prompts/blob/main/prompts/system-prompt-en.md` — 6 core rules, the optimization lineal for Phase 4

---

## Session log — what this chat did and did not do

**Did:**
- Discovered that Grid Operator needs to be modular (skeleton + modules), not a template library
- Killed the NB Studio "Grid Switch" idea (explored as Weg A, rejected after the user clarified image2sheet vs text2sheet)
- Killed the "Promote to Grid" handoff idea (Weg B) for the same reason
- Established Look Transfer as the only bridge between NB Studio and Grid Operator
- Defined the 5 pilot presets with first-draft module sketches
- Established the style-aware Mode module (Sheet vs Study) with illustration-style correction
- Established Char+World Merge as the multi-input topology pilot with proportion-control as load-bearing
- Established Start/Endframe as a dedicated pilot (not a module in another preset) with camera-movement exception
- Defined the 6-phase destillation methodology
- Locked 10 architectural decisions (see "User-approved decisions" block)
- Wrote this document as the briefing for the next chat

**Did not (deferred to next chats):**
- Did not read DeepSeek1.txt (Phase 1 of the actual destillation starts next chat)
- Did not read the current preset JSONs in detail (only the CLAUDE.md + ROADMAP.md summaries)
- Did not write any code
- Did not touch the Visual Overhaul
- Did not design the Look Register's concrete data shape or UI
- Did not start the Image-First layout work in GridOperator.jsx

**Why this chat ended here:**
User-approved decision to write a full handoff and end the chat while context is still clean, so the destillation work starts in a fresh chat with the full document as briefing. The reasoning: the destillation is the single most important step in the whole SeenGrid process (user's words), and cramming it into the tail of an already-long dialogue risks context compression and quality loss on the exact step that matters most.


