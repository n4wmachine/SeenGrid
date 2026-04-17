# SeenGrid — Visual Overhaul Handoff v2

**Datum:** 2026-04-17
**Session:** Planning mit Opus 4.7 (Planning-Phase) → Übergabe an Opus 4.6 1M (Implementierung)
**Zweck:** Verbindliche Grundlage für die Implementierung des Visual Overhauls. Ersetzt `DESIGN_SPEC.md` und `VISUAL_OVERHAUL_PLAN.md`. `FEATURE_VISION.md` bleibt gültig als Long-Term-Roadmap.

---

## 0. META: Wie dieser Doc zu lesen ist

Dieser Doc ist nicht ganz kurz (≈20k Tokens inkl. Mockup-Referenz-Code). Das ist bewusst. Im 1M-Context-Window ist das vernachlässigbar klein, und die Präzision spart Iterations-Runden.

**Lese-Reihenfolge:**
1. Abschnitt **1 (Kontext zum User + Projekt)** — essentiell, beeinflusst wie du arbeitest
2. Abschnitt **2 (Ziel)** — was erreicht werden soll
3. Abschnitte **3-9** — die Specs (Namensgebung, Rail, Shell, Farben, Typo, Token-System, Pages)
4. Abschnitte **10-18** — Grid Creator im Detail (der größte Bau-Block)
5. Abschnitt **19** — 4 kritische Nuancen die beim ersten Lesen leicht übersehen werden
6. Abschnitte **20-22** — Globale Rules, Files-Struktur, Implementation Priority
7. Abschnitt **23** — Mockup-Referenz-Code (vier Widgets als lebendige Visual-Referenz)

**Wenn du zweifelst: der Mockup-Code in Abschnitt 23 ist die verbindliche Quelle für visuelle Entscheidungen. Die textlichen Beschreibungen davor sind die Erklärung dazu.**

---

## 1. Kontext zum User und zum bestehenden Projekt

### 1.1 Wer ist der User

Der User heißt **Jonas**. Er ist:
- **Solo AI-Filmemacher, Nicht-Coder.** Denkt in Filmlogik, nicht in Dev-Logik.
- Spricht Deutsch. Kommunikation mit ihm bitte auf Deutsch.
- Erwartet **kurze, präzise Antworten ohne Coding-Jargon**.
- Empfindlich gegenüber AI-Sycophancy. Niemals "Super Idee!", "Das ist großartig!" etc. Brutal ehrlich sein, Probleme direkt ansprechen.

### 1.2 Wie du ihm Code übergibst

**Komplette Files statt Diffs.** Jonas kann Diffs nicht anwenden — er kopiert ganze Dateien 1:1 in VS Code. Liefere immer vollständige Datei-Inhalte, auch wenn nur 3 Zeilen geändert werden. Das ist non-negotiable.

**Ein File pro Antwort bevorzugt.** Bei mehreren Files klar trennen und sagen "hier kommt Datei 1 von 3".

**Keine kryptischen Einsparungen.** Nicht "wie oben" oder "ähnlich wie X" — immer der volle Code.

### 1.3 Bestehendes Projekt

**SeenGrid existiert bereits.** Repository: `n4wmachine/SeenGrid`, Deploy auf `n4wmachine.github.io/SeenGrid`. Lokale Dev-URL: `localhost:5173/SeenGrid/`.

**Tech-Stack:**
- Vite + React (JavaScript, nicht TypeScript)
- **CSS Modules** als Styling-System (bindend, nicht wechseln)
- Deploy via GitHub Pages
- Kein Backend (reine Client-App)

**Was bereits gebaut ist:**
- Fünf Tabs (die werden durch den Visual Overhaul durch Pages ersetzt): Prompt Builder (NanoBanana Studio), Grid Operator, MJ Cinematic, Prompt Vault, POC Custom Builder
- **Grid Engine** (Slices 1-8, 42/42 Tests grün) — diese Engine bleibt unberührt, sie produziert das paste-ready Prompt-JSON
- 10 Base Cases als JSON (character_sheet, character_angle_study, character_normalizer, start_end_frame, world_zone_board, world_angle_study, shot_coverage, story_sequence, expression_sheet, outfit_variation)
- 13 Module als JSON
- Character Angle Study als MVP-Case voll funktional

**Was der Visual Overhaul ersetzt:**
- Die Tab-Struktur → ersetzt durch Rail + Pages
- Das Default-Claude-Template-Aussehen → ersetzt durch cinematic Pro-Tool-Design
- Das Formular-Layout → ersetzt durch Canvas-zentriertes Pattern
- Alle CSS-Styles und Farben
- Die Informationsarchitektur der Pages

**Was unberührt bleibt:**
- Grid Engine (Code + Tests)
- Cases + Module JSON-Schemas
- Deploy-Pipeline
- CSS Modules Entscheidung

### 1.4 Git / Deployment Gotchas

Wichtig weil sonst Arbeitsfluss bricht:

- **GitHub MCP `push_files` hat Timeouts bei >5-6 Files pro Call.** Bei größeren Änderungen in mehrere push_files-Calls aufteilen.
- **GPG-Signing blockt lokales git.** Bypass-Befehl: `git -c commit.gpgsign=false commit -m "message"` (oder `git -c commit.gpgsign=false push`).
- **GitHub PAT** ist in `claude_desktop_config.json` unter Roaming AppData hinterlegt — Token-Auth funktioniert dadurch bereits.
- **Inhalte sollten JSON-getrieben sein** wo immer möglich, um später ohne Code-Rebuild erweiterbar zu sein.

### 1.5 Wie diese Planungs-Session ablief

Jonas hat mit Opus 4.7 eine intensive Planungs-Session durchgeführt. Dabei:
- Architektur-Entscheidungen mit vielen Iterationen getroffen (Rail-Position, Namensgebung, Token-System, Grid-Creator-Pattern)
- Vier interaktive Mockups gebaut (Shell+Landing, Grid-Creator-Picker, Workspace v1, Workspace v3)
- Den bisherigen Ansatz aus `VISUAL_OVERHAUL_PLAN.md` fundamental überarbeitet

**Diese Planungs-Session ist die Quelle der Wahrheit.** Widerspruche zu älteren Docs werden zugunsten dieses Handoffs aufgelöst.

---

## 2. Ziel

SeenGrid soll sich anfühlen wie ein **professionelles Pre-Production-Werkzeug** in der Liga von DaVinci Resolve, Rive, Frame.io, Runway — nicht wie eine React-Template-Webseite. Der Überhaul betrifft Architektur, Navigation, Farbsystem, Typografie, und das Kern-Interaktionsmodell.

**Nicht-Ziele:**
- Kein komplettes Rewrite der bestehenden Engine-Logik
- Keine neuen Features außer denen die explizit hier spezifiziert sind
- Keine Responsive-Anpassungen (Desktop-First, Mobile später)

---

## 3. Namensgebung / Markenfamilie

Finale Terminologie, bindend für UI und Code-Konvention:

- **SeenGrid** — die App als Ganzes
- **SeenLab** — die Page für Look-/Prompt-Entwicklung (ex "NanoBanana Studio")
- **SeenFrame** — die Page für MJ-optimierte cinematic Stills (ex "Midjourney Cinematic"). Untertitel im Page-Header: *"optimized for Midjourney v7"*
- **Classics** — die built-in Grid-Templates im Grid Creator Picker (erprobte Rezepte für Use-Cases wie technical blueprint, character reference sheet etc.). **Kein Gold-Badge.** Sind keine magischen Super-Prompts, sondern fertige Rezepte.
- **Signatures** — die vom User selbst erstellten/gespeicherten Look-Kombinationen aus SeenLab. **Gold-Akzent als Qualitäts-Signal.** *Ersetzt intern den Begriff "Token".*

**Konvention für UI-Texte (Englisch in der App):**
- "Save as Signature" (nicht "Save as Token", nicht "Save as Preset")
- "Apply Signature" / "Applied Signature"
- "My Signatures" / "3 Signatures saved"
- Im Status: "READY · 3 signatures · 2 grids · 18 prompts"

---

## 4. Navigation / Rail

Linke Icon-Rail als primäre Navigation. **72px breit, Icons only mit Tooltips, Gruppen-Trenner in Mono-Caps.**

### 4.1 Vollständige Struktur

```
[SG Logo]        — klickbar = Home

Home             — Landing Page

── PRE ──
Film             — coming (Filmsystem, 2-Stage LLM)
Board            — coming (Shot Board, visuelle Produktionsübersicht)

── MAKE ──
Grid      ★      — Grid Creator (Herzstück, Star-Indikator)
Lab              — SeenLab
Frame            — SeenFrame

── LIB ──
Hub              — Prompt Hub (community + signature + saved)

── TOOLS ──
Crop             — coming (Grid Cropper + Upscaler)
Rev              — coming (Reverse Engineer)
Kit              — coming (Consistency Kit Wizard)

Settings         — unten
Help             — unten
```

### 4.2 Implementierungs-Hinweise

- **Coming-Slots sind JSON-Einträge in einer `pages.config.json`** — umbenennbar, austauschbar, neu sortierbar ohne Code-Änderung. Wichtig weil Jonas die noch anpassen wird.
- **Coming-Items:** 55% Opacity im Default, kleiner `soon`-Marker rechts unten, 85% Opacity beim Hover. Klick → Placeholder-Page mit "COMING SOON" (als Mono-Label in 18% Opacity).
- **Star-Indikator:** Nur beim Grid-Item. Kleiner Gold-Dot (5px) oben rechts, mit Gold-Glow.
- **Tooltips:** Rich-Tooltips (siehe Abschnitt 20.3), **zwei Zeilen** — Titel + funktionale Beschreibung. NICHT nur das Label wiederholen.
  - Beispiele:
    - Home: "Home" / "where you left off, and where to go next"
    - Grid: "Grid Creator" / "multi-panel prompts for NanoBanana · your core workbench"
    - Lab: "SeenLab" / "develop looks, save as reusable tokens"
    - Frame: "SeenFrame" / "cinematic stills · optimized for Midjourney v7"
    - Hub: "Prompt Hub" / "community · signature · your saved tokens"
- **Aktives Item:** Teal-Gradient-Background `linear-gradient(180deg, rgba(60,207,204,0.22) 0%, rgba(60,207,204,0.12) 100%)`, 3px Teal-Strich links außerhalb des Items (`::before`), Teal-Glow.
- **Rail-Breite fix bei 72px.** Nicht expandierbar. (Entscheidung: Klarheit > Flexibilität.)
- **Gruppen-Trenner:** Mono 10px, 0.2em letter-spacing, `#6a6a82`, 600 weight, 14px padding oben / 4px unten, text-align center.

---

## 5. Shell-Architektur

Alle Pages teilen dieselbe äußere Hülle:

```
┌─────────────────────────────────────────────────────────┐
│ RAIL │ HEADER (56px)                                    │
│      │  Page-Title · subtitle_monospace       v / J     │
│      ├──────────────────────────────────────────────────┤
│      │                                                  │
│      │ PAGE CONTENT                                     │
│      │ (variiert pro Page)                              │
│      │                                                  │
│      ├──────────────────────────────────────────────────┤
│      │ STATUS BAR (28px)                                │
│      │ ● READY · 3 signatures · last save 14m ago       │
└──────┴──────────────────────────────────────────────────┘
```

- Header-Höhe: 56px, background `#0d0d16`, border-bottom `1px solid rgba(255,255,255,0.08)`
- Status-Bar-Höhe: 28px, background `#0d0d16`
- Content-Area dazwischen flex-1
- Page-Title: 16px / weight 500 / -0.01em letter-spacing / `#f0f0fa`
- Subtitle: 12px / monospace / `#7a7a92` / 0.02em letter-spacing
- Status-Bar: immer sichtbar, zeigt Ready-State (Teal-Dot mit Glow) + Token-Counts + Last-Save-Zeit
- Header rechts: Version-Label (Mono, klein, `#7a7a92`) + 1px vertikaler Separator + User-Avatar (28px, Teal-Border, Initial-Letter)

---

## 6. Farbsystem (bindend)

### 6.1 Primärfarben

- **Teal-Akzent:** `#3ccfcc` — alle aktiven States, Primary Actions, Focus, Aktiv-Rail-Item, Selected-Panel, Primary-Buttons, Status-Dot
  - Hover-Backgrounds: `rgba(60, 207, 204, 0.06)` bis `rgba(60, 207, 204, 0.12)`
  - Aktive Backgrounds: `rgba(60, 207, 204, 0.15)` bis `0.22`
  - Glow: `box-shadow: 0 0 [8-20]px rgba(60, 207, 204, [0.08-0.8])` — sparsam aber gezielt
- **Gold-Akzent:** `#f5c961` — **ausschließlich für Signatures** und User-persönliche Markierungen (Override-Dot an Panels, Applied-Signature-Badge, Signatures-Bar, Star-Indikator beim Grid-Rail-Item)
- **Kein Lila, kein sekundäres Blau.** Teal + Gold + Neutraltöne reichen.

### 6.2 Neutrale Palette (dark-native)

- Primary Background (Page): `#0a0a12`
- Secondary Background (Header, Status-Bar): `#0d0d16`
- Tertiary Background (Rail, Context-Panels, Signatures-Bar): `#0b0b15`
- Rail-Spezifisch: `#101018`
- Canvas (tiefste Ebene mit radial Gradient): `radial-gradient(ellipse at center, #12121e 0%, #0a0a12 80%)`
- Surface / Card: `#141420`
- Elevated Surface (Tooltips, Elevated Cards): `#1a1a26`
- Preview-Strip (besonders tief): `#08080f`

### 6.3 Text-Farben

- Primary Text: `#f0f0fa` (fast weiß — **niemals `#fff`**)
- Secondary Text: `#b0b0c8` bis `#e0e0f0`
- Tertiary Text / Labels: `#8a8aa0` bis `#9a9ab0`
- Quaternary / Mono-Hints: `#7a7a92`
- Muted / Disabled: `#6a6a82`

### 6.4 Border-Hierarchie

- Default Border: `1px solid rgba(255, 255, 255, 0.08)`
- Emphasized Border: `1px solid rgba(255, 255, 255, 0.12)`
- Teal-Active Border: `1px solid rgba(60, 207, 204, 0.4)` (bis `0.5` beim Hover)
- Gold-Signature Border (rest): `1px solid rgba(245, 201, 97, 0.25)`
- Gold-Signature Border (hover): `1px solid rgba(245, 201, 97, 0.5)`
- Separator-Lines: Gradient `linear-gradient(90deg, transparent, rgba(60,207,204,0.1), transparent)`

### 6.5 Semantic Colors

- Success / Perfect-Quality: `#6adc78`
- Warning / Amber-Quality: `#f5c961` (shares mit Gold — same hex)
- Error / Forbidden: `#f0a0a0` (roter Forbid-Pill-Text)
- Error-BG: `rgba(245, 97, 97, 0.08)` mit `rgba(245, 97, 97, 0.25)` Border

---

## 7. Typografie

**Font-Richtung (User-Entscheidung): Mischung aus Vercel-/Linear-Präzision und A24-/Frame.io-Editorial-Charakter.**

### 7.1 Font-Stack

Drei Fonts, jede mit klarer Rolle. Alle kostenlos via Google Fonts / OSS-CDN:

- **Display / Headings:** `Instrument Serif` (400, 500) — für Page-Titles, Landing-Überschriften. Macht den filmisch-editorialen Teil.
  - Fallback wenn Serif zu mutig: `Inter Display` mit stylistic sets aktiviert
- **Body / UI:** `Geist Sans` (400, 500) — für Buttons, Labels, Card-Texte, alles Normal-UI-Text. Macht den engineered Teil.
- **Mono / Tech:** `Geist Mono` (400, 500) — für Subtitles, Status-Bar, Section-Labels, Quality-Tags, alle `code-artigen` Elemente

**Import via Google Fonts oder `npm install geist`** (Geist ist auch als npm-Package verfügbar).

### 7.2 Größen-Hierarchie

- Display (Page Hero): 22-24px / 500 / -0.02em letter-spacing
- H1 / Page Title: 16px / 500 / -0.01em
- H2 / Section Title: 14px / 500
- Body: 13px / 400
- Small: 12px / 400
- Caption / Mono-Hint: 11px / 500 / 0.04em letter-spacing
- Mono-Label: 10px / 600 / 0.15-0.2em letter-spacing (uppercase)
- Minimum: 9px (nur in Mono-Badges, sparsam)

### 7.3 Weight-Regel

**Nur zwei Weights: 400 (Regular) + 500 (Medium).** Niemals 600 oder 700 für Body/UI (wirkt zu schwer gegen Dark-BG). **Mono-Labels dürfen 500-600** weil Monospace generell leichter wirkt.

---

## 8. Token-System / Signatures-Architektur

### 8.1 Rückgrat-Architektur — jetzt aufsetzen, schrittweise befüllen

Zentraler Store (Zustand / Jotai / Context + persistiert in localStorage bzw. IndexedDB) mit einheitlichem Token-Interface. Vermeidet späteres Nachrüsten.

```javascript
// src/stores/tokenStore.js — Interface
const Token = {
  id: 'uuid',              // crypto.randomUUID()
  type: 'signature' | 'grid_template' | 'prompt' | 'scene' | 'filmlook',
  source: 'seenlab' | 'grid_creator' | 'hub' | 'filmsystem' | 'seenframe',
  name: 'string',          // User-vergeben
  created: 1234567890,     // timestamp
  modified: 1234567890,
  thumbnail: 'string?',    // Data-URL oder Asset-Path
  tags: ['array'],
  payload: {}              // typspezifisch — Look-Config, Grid-Spec, etc.
};
```

### 8.2 Rollout-Stufen

**Stufe 1 (Visual Overhaul, JETZT):**
- Store technisch aufsetzen
- **SeenLab** schreibt Signatures (nach "Save as Signature" Flow)
- **Grid Creator** liest Signatures (Signatures-Bar + Inspector zeigen sie)

**Stufe 2 (später, beim Hub-Build):**
- Hub liest: alles aus Library + ~1500 importierte Community-Prompts
- Hub schreibt: Bookmarks, Tags, Custom-Prompts
- Grid Creator schreibt zusätzlich: Grid-Templates

**Stufe 3 (Vision-Features):**
- Filmsystem schreibt Szenen-Tokens die Signatures referenzieren
- Shot Board liest alles, zeigt als visuelles Board

### 8.3 Ausnahme: SeenFrame

**SeenFrame ist Producer-only in eigener, isolierter Library.** MJ-Syntax ist fundamental anders — keine Cross-Tool-Kompatibilität. SeenFrame schreibt `type: 'filmlook'` Tokens, die **nur SeenFrame selbst** wieder konsumiert. Dasselbe UI-Pattern wie andere Token-Speicherungen, aber isolierter Namespace (separater Store-Slice oder Filter im gleichen Store).

---

## 9. Landing Page

Drei horizontale Bänder, vertikal gestapelt. Kein Pflicht-Stop — User kann direkt zur Rail.

### Band 1 — CONTINUE

Zeigt die letzten 3-5 Sessions als breite Cards (grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))).
- Thumbnail (aspect-ratio: 16/10) zeigt eine Vorschau des letzten States (Grid-Preview als 4-Panel-Mini, Look-Swatch als Gradient, Frame-Still als radial-gradient mit Farbstimmung)
- Title (13px / 500) + Sub-Line (10px Mono, "grid · 14m ago" / "look · 2h ago")
- Klick → springt direkt zurück in den State

### Band 2 — QUICK START

Vier Use-Case-Cards (minmax 240px) mit Icon + Titel + Mono-Desc:
- "build a character grid" / "angle study · expression · normalizer" → Grid Creator
- "develop a look" / "stack chips · save as token" → SeenLab
- "cinematic still" / "midjourney v7 · --raw required" → SeenFrame
- "browse the hub" / "community · signature · saved" → Prompt Hub

Icon-Container: 40×40px, Teal-Gradient-BG (`linear-gradient(135deg, rgba(60,207,204,0.2) 0%, rgba(60,207,204,0.08) 100%)`), Teal-Border.

### Band 3 — DISCOVER

Quadratische Thumbnail-Cards (minmax 200px, aspect-ratio 1/1). Zeigt Trending Signatures aus der Community/Hub, neue Looks, Inspiration.
- "TRENDING" Badge optional (Teal-Border, `rgba(10,10,18,0.7)` BG für Lesbarkeit auf Thumbnail)
- Funktioniert auch als Visit-Teaser für den Hub

### Layout-Rules

- Padding: 36px 44px
- Gap zwischen Bändern: 44px
- Gap zwischen Cards: 12-16px
- Section-Label: 11px Mono / 0.2em letter-spacing / 600 / `#8a8aa0`, mit Gradient-Linie danach (`flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.1), transparent);`)

---

## 10. Grid Creator

**Herzstück der App.** Zwei verbundene States: **Picker** und **Workspace**.

### 10.1 Picker State (Einstieg)

Full-Page-View (kein Overlay, kein Modal). Suche oben, Filter-Pills, dann drei Sektionen.

**Suche + Filter:**
- Search-Input mit Icon links, max-width 480px, background `#141420`, 1px border, radius 9px, padding `11px 16px 11px 40px`
- Filter-Pills: `all · character · world · sequence` (später erweiterbar). Active Pill: Teal-BG + Teal-Text + Teal-Border.

**Sektion: CORE TEMPLATES**
- 10 Base Cases aus dem Engine
- Card-Grid `repeat(auto-fill, minmax(240px, 1fr))`, gap 16px
- Jede Card: Thumbnail (16:10) + Title (13px/500) + Sub (10px Mono, "4 panels · front, right, left, back")
- Thumbnails sind `thumbnail_svg` oder `thumbnail_url` im JSON — austauschbar. In Version 1 nutze abstrakte Preview-Patterns (siehe Mockup-Code in Abschnitt 23 als Referenz).
- Hover: Teal-Border, `translateY(-2px)`, Shadow + Outline-Glow

**Sektion: CLASSICS**
- Section-Label ist **neutral, kein Gold** (Wichtig: nicht verwechseln mit Signatures!)
- Kein Gold-Badge auf Cards (Signatures sind Gold, Classics nicht)
- Inhalt wird später durch JSON befüllt, in v1 nur 2 Dummy-Cards als Platzhalter für Placeholder-Entwicklung

**Sektion: START FROM SCRATCH**
- Einzelne breite Card mit "+"-Icon und dashed Border (`border: 1px dashed rgba(60,207,204,0.3)`)
- Content: "empty grid" / "choose your own case, dimensions, and modules"
- Hover: Border stärker teal, BG leicht heller, Pfeil-Icon rechts rückt 4px nach rechts

### 10.2 Workspace State

**Layout (Top to Bottom):**

```
┌────────────────────────────────────────────────────────┐
│ HEADER (56px): Grid Creator · case_name · untitled     │
├────────────────────────────────────────────────────────┤
│ MODULE TOOLBAR (52px): 7 module toggles + 2 actions    │
├──────────┬─────────────────────────┬──────────────────┤
│ CASE     │                         │ INSPECTOR        │
│ CONTEXT  │     CANVAS              │                  │
│ 260px    │     (flex-1)            │ 320px            │
│          │                         │                  │
│ · Case   │   Grid with panels      │ Global (kein     │
│ · Ref    │   selected panel has    │ Panel selektiert)│
│   State  │   teal ring + glow      │                  │
│ · Dim    │                         │ Panel-Details    │
│   Build  │                         │ (Panel selektiert│
│ · Dim    │                         │                  │
│   Advi-  │                         │                  │
│   sory   │                         │                  │
│ · Panel  │                         │                  │
│   Orient │                         │                  │
│ · Forbid │                         │                  │
├──────────┴─────────────────────────┴──────────────────┤
│ PREVIEW STRIP (96px, FULL WIDTH):                      │
│ [OUTPUT PREVIEW · 4×1] [mini-panels horizontal scroll] │
├────────────────────────────────────────────────────────┤
│ SIGNATURES BAR (52px): gold ★ SIGNATURES · pills       │
├────────────────────────────────────────────────────────┤
│ OUTPUT BAR (32px): ● READY · 847 tokens · [copy etc.]  │
└────────────────────────────────────────────────────────┘
```

**WICHTIG: Layout-Flexbox-Struktur**

```
Workspace (flex column)
├── Header (flex-shrink: 0)
├── ModuleToolbar (flex-shrink: 0)
├── WorkspaceRow (flex: 1, flex row)        ← 3-Spalten-Zone
│   ├── CaseContext (width: 260px)
│   ├── Canvas (flex: 1)
│   └── Inspector (width: 320px)
├── PreviewStrip (flex-shrink: 0)            ← FULL WIDTH, NICHT in WorkspaceRow
├── SignaturesBar (flex-shrink: 0)
└── OutputBar (flex-shrink: 0)
```

PreviewStrip, SignaturesBar und OutputBar sind **Full-Width-Zonen unter der 3-Spalten-Row**, nicht in einer Spalte. In einer früheren Version wurde die PreviewStrip fälschlich in der Canvas-Spalte platziert — das zerreißt das Layout.

### 10.3 Module Toolbar

7 Module haben **uniforme Single-Word-Labels** mit `min-width: 92px` für konsistente Breite:
- face (face reference)
- env (environment — optional value-indicator wie "inherit")
- style (style overlay — wendet Signature global an)
- camera (camera angle)
- pose
- expr (expression)
- wardrobe

Rechts abgesetzt (margin-left: auto): `random` (Random Fill, Dice-Icon) und `reset` (Reset, Rotate-Icon).

**Module-Interaktion:**
- Klick = Toggle on/off
- Hover = Tooltip mit beschreibender Sekundärzeile ("Environment — backdrop and scene context")
- Aktive Module: Teal-Background `rgba(60, 207, 204, 0.1)`, Teal-Border, Teal-Text
- Detail-Popovers für Module die mehr als on/off brauchen (Environment hat 3 Modi + custom text, Style Overlay hat Signature-Picker, Camera hat Dropdown): Chevron-Button rechts vom Label → Popover öffnet sich unter dem Icon
- **Wichtig zur Abgrenzung:** Popover ≠ Inspector. Inspector = Panel-Kontext (wenn Panel selektiert). Popover = Modul-Config (wenn Modul-Chevron geklickt).

### 10.4 Case Context (links, 260px)

Scrollbare Spalte (custom Scrollbar, siehe Abschnitt 20.1), mit folgenden Sektionen in Reihenfolge:

1. **CASE** — Dropdown mit Case-Name + Case-Beschreibung (Mono, 10px)

2. **REFERENCE STATE** — **nur sichtbar wenn der Case ein Referenzbild erwartet** (character_angle_study, expression_sheet, outfit_variation etc.). Zwei Radio-Optionen:
   - "reference is clean" / "full body, proper proportions"
   - "needs normalization" / "2-step: ref → master → grid"
   - Bei Auswahl "needs normalization": Grid Creator wechselt in 2-Step-Modus (erst Normalizer-Grid erzeugen, dann eigentliches Grid). Visueller Indikator im Workflow-Flow sichtbar machen.

3. **DIMENSIONS** — **Hybrid-Builder**:
   - 6×4 Visual Grid mit Hover + Click-to-Select (Office-Word-Style Table-Insert)
   - Cells sind `#1f1f2e`, aktive/selected sind `rgba(60,207,204,0.4)` mit Teal-Border
   - Hover-Cells sind `rgba(60,207,204,0.25)` mit Teal-Border
   - Readout oben rechts im Builder ("4 × 1"), Teal-Color, Mono
   - Zwei Pills darunter ("cols" / "rows") für Feintuning > 6 oder > 4
   - Hint in Mono darunter: "click grid to set · pills to fine-tune beyond 6×4"
   - **Interaktion:** mouseenter paints hover-state; click paints selected-state; mouseleave on grid repaints selected-state only. Siehe Abschnitt 23 für den JS-Code.

4. **PANEL SIZE ADVISORY** — unter Dimensions. Zeigt @ 2K und @ 4K Pixel-Größen + Quality-Tag:
   - Perfect: grün `#6adc78` (BG `rgba(100,220,120,0.15)`, Border `rgba(100,220,120,0.3)`)
   - Hires: teal `#3ccfcc`
   - Standard: Default-grau
   - Low: amber `#f5c961`
   - Tiny: red `#f0a0a0`

5. **PANEL ORIENTATION** — Dropdown (vertical / horizontal / auto)

6. **FORBIDDEN ELEMENTS** — Box mit roten Pills ("no text", "no logos") + dashed "+ add" Pill

### 10.5 Canvas (zentral)

- Background: `radial-gradient(ellipse at center, #12121e 0%, #0a0a12 80%)` für Tiefe
- Grid: `display: grid; grid-template-columns: repeat(N, 1fr); gap: 12px`
- Max-Width 680px (oder größer bei großen Grids), zentriert, Padding 28px

**Panel-States:**
- **Default:** Surface-Background `#141420`, 1px Border, Role-Label top-left in Mono (10px) mit dunklem Pill-BG (`rgba(10,10,18,0.8)`), zugewiesene Silhouette als Background-SVG (25-35% Opacity, Color `#6a8aa0`)
- **Hover:** Teal-Border (`rgba(60,207,204,0.4)`), `translateY(-2px)`
- **Selected:** 2px Teal-Border, Teal-Glow-Ring außen (`box-shadow: 0 0 0 4px rgba(60,207,204,0.08), 0 0 30px rgba(60,207,204,0.15)`), Role-Label wird Teal (mit `0.5px solid rgba(60,207,204,0.3)` border), Silhouette wird Teal
- **Has-Override (Gold-Dot):** Gold-Dot top-right (8px, mit `box-shadow: 0 0 8px rgba(245,201,97,0.6)`)
- **Has-Signature-Applied:** Gold-getinte Border + subtle Gold-Glow außen. **UNTERSCHIED zum Override-Dot:** Override bezeichnet per-Panel-Konfiguration die vom globalen Wert abweicht. Signature-Applied bezeichnet einen zugewiesenen gespeicherten Look-Token. Diese beiden Zustände können gleichzeitig existieren und brauchen unterschiedliche visuelle Sprache.

**Silhouetten:**
- Pro Rolle SVG im Background (front, right_profile, left_profile, back für character cases)
- Für world/scene cases: Landscape/Interior/Street-Silhouetten (später, in v1 können character cases erstmal Standard sein)
- Austauschbar per JSON, nicht hardcoded
- v1 kann die Silhouetten aus dem Mockup-Referenz-Code (Abschnitt 23) übernehmen

### 10.6 Inspector (rechts, 320px)

Scrollbar custom-styled.

**Wenn nichts selektiert:** Zeigt globale Settings (Header "GLOBAL SETTINGS" / "nothing selected"). Enthält die globalen Werte für Pose, Expression, Wardrobe, Camera, Style Overlay — dieselben Felder die bei per-Panel-Override zum "global value" werden.

**Wenn Panel selektiert:**
- Header: "PANEL N · SELECTED" Mono-Label (10px/600, 0.15em letter-spacing) + Rolle als Title (15px/500)
- Close-X top-right (schließt Selection, zurück zu globalen Settings)
- Dynamische Felder je nach Case:
  - **VIEW** Dropdown (bei angle_study, character_sheet)
  - **POSE** / **EXPRESSION** / **WARDROBE** — Input mit Override-Logik:
    - Default: "— inherit global —" (in `#8a8aa0`, Italic-optional)
    - Wenn Override gesetzt: Value in Teal-Border-Box + Override-Badge (gold: `color: #f5c961; background: rgba(245,201,97,0.1); border: 0.5px solid rgba(245,201,97,0.3)`) + "global: ~~strikethrough~~" Hint in Mono 10px
  - **SIGNATURE** — Applied Signature als Swatch-Card:
    - 36×36px Swatch (Look-Thumbnail-Gradient)
    - Kleiner 8×8 Gold-Stern oben rechts auf Swatch
    - Name (12px, `#f0f0fa`)
    - Sub "signature · applied" (10px Mono, `#7a7a92`)
    - Remove-X rechts
    - Container: Background `#141420`, Gold-Border `rgba(245,201,97,0.25)`
  - **CUSTOM NOTES** — Textarea für per-panel Freitext, Mono, min-height 60px

### 10.7 Preview Strip (Full-Width, 96px)

**ZWINGEND Full-Width**, zwischen Workspace-Row und Signatures-Bar. Nicht in einer Spalte!

- Background dunkler als normale Surfaces: `#08080f`
- Links: "OUTPUT PREVIEW" Mono-Label + Grid-Spec ("4 × 1 · vertical"), flex-shrink: 0
- Mitte: flex: 1, Horizontal scrollende Mini-Panels (56×78px, border-radius 5px, 0.5px border):
  - Silhouette (gleiche wie Canvas-Panels aber in `#6a8aa0` mit 0.4-0.5 opacity)
  - Label bottom (8px Mono, dark BG-Pill, text-center, "front" / "r_profile" / "l_profile" / "back")
  - Optional: Gold-Dot top-right wenn Signature applied (5px mit Gold-Glow)
  - Border wird Gold-getint wenn Signature applied
- Rechts: "PANELS · 4" Zähler (10px Mono-Label + 14px Mono-Number), flex-shrink: 0

Zweck: User sieht auf einen Blick "so wird das insgesamt aussehen" — unabhängig von den editierbaren Panels im Canvas. Separate Ebene vom Edit-Modus.

### 10.8 Signatures Bar (52px)

Über der Output-Bar, full-width.

- Background `#0b0b15`
- Border-Top in dezentem Gold: `rgba(245,201,97,0.12)`
- Links: Gold-Star-Icon (14px) + "SIGNATURES" (11px Mono Gold, 0.08em letter-spacing, 600 weight) + Counter "3 saved · drag onto panels" (10px Mono `#7a7a92`)
- Rechts: 3-5 sichtbare Signature-Pills + "expand" Button
- Pills: Gold-Border (`rgba(245,201,97,0.15)` rest, `0.5` hover), Swatch-Circle 22px, Label (11px Mono), `cursor: grab`
- Hover: `translateY(-1px)`, shadow mit Gold-Tint: `0 4px 12px rgba(245,201,97,0.1)`
- Drag auf Canvas-Panel → Signature wird dort angewendet
- Alternativ: Klick auf Pill → dann Klick auf Panel (beides muss funktionieren)
- "expand" Button → fährt als Drawer auf mit allen Signatures (später)

### 10.9 Output Bar (32px)

- Background `#0d0d16`, border-top 1px
- Font: 11px Mono, `#8a8aa0`, 0.04em letter-spacing
- Links: Teal-Dot (7px, mit Glow `0 0 10px rgba(60,207,204,0.8)`) + "READY" (`#b0b0c8`) + Separator (1px height 11px) + "prompt compiled · 847 tokens · 2553 chars"
- Rechts (flex-shrink: 0): Drei Buttons
  - `show JSON` (neutral) → expandiert Output-Drawer mit vollem JSON (scrollbar, 40% viewport height, expandiert nach oben, überschreibt Canvas-Bereich)
  - `copy` (Primary, Teal-Background) → sofort in Zwischenablage, kleiner Toast "copied"
  - `save as signature` (neutral) → öffnet Modal/Dialog "Name your signature"

---

## 11. SeenLab (spätere Session, nur Richtung dokumentiert)

**Layout-Richtung: 3-Spalten**
- Links: Galerie (visuelle Kacheln für Film Style, Lighting, Color Grade, Filmstock etc.)
- Mitte: Editor (Promptfeld, selektierte Chips, optional Mini-Preview)
- Rechts: Token-Schmiede (Random-Trigger, Output, Save-as-Signature, Copy)

**Chip-Visualisierung:**
- **Look-Chips werden visuelle Kacheln** mit Thumbnail-Vorschau (Film Style, Lighting, Color Grade, Filmstock)
- **Technik-Chips bleiben kompakte Text-Pills** (Aperture, Focal Length, Aspect Ratio, ISO — alles was Zahl ist)
- Such-Input oben, filtert/highlightet quer durch alle Sektionen ("noir" tippen → alle noir-bezogenen Kacheln leuchten)

Detaillierte Implementierung in separater Session. Für jetzt: Page-Placeholder mit "SeenLab — coming in next phase".

---

## 12. SeenFrame (später)

**Bleibt erstmal nah am aktuellen MJ Cinematic Design:**
- 3 Sub-Tabs (Fields / Templates & Medium / Filmstock & Parameters) bleiben
- Gleiche Output-Spalte rechts wie andere Tools, aber MIT Gold-Akzent-Option weil Filmlooks gespeichert werden können
- Untertitel im Page-Header: "optimized for Midjourney v7"
- **Kein Signature-Crossover** — eigene Library für MJ-Filmlooks (siehe 8.3)

Für jetzt: Bestehende MJ Cinematic Page mit neuen Farben/Fonts updaten, Sub-Tab-Struktur beibehalten.

---

## 13. Prompt Hub (später)

**Architektur-Richtung:**

Hub vereint drei Quellen:
1. **Community** (~1500 importierte externe Prompts)
2. **Classics** (fertige SeenGrid-Templates, auch im Grid Creator sichtbar)
3. **My Library** (User's eigene Signatures, Prompts, etc.)

Karten-Galerie mit:
- Kategorie-Filter-Pills oben
- Tag-Filter (NanoBanana, Midjourney, Grok, GPT etc.)
- Vorschaubild PFLICHT auf jeder Karte
- Slot-System für anpassbare Prompts: `[CHARACTER]`, `[SETTING]`, `[STYLE]`
- Icon-Marker auf Karte: Stift = anpassbar (hat Slots), Kamera = braucht Referenzbild, ohne = pure copy-paste

Für jetzt: Bestehende Prompt Vault mit neuen Farben/Fonts updaten, Karten-Struktur beibehalten.

---

## 14. Consistency Kit Wizard (separate Session)

**Wichtig zu verstehen:** Consistency Kit ist **kein einzelnes Grid**, sondern eine **choreographierte Abfolge von 3-4 Grids** für Kling-/Video-KI-Referenz-Pakete:
- Hauptbild (1× Perfect Single Shot)
- Face Identity Sheet (3×2)
- Body 360° Sheet (3×2)
- Wildcard Sheet (situativ: asymmetrische Features / Outfit-Details / Expression / Action Poses)

Das ist ein **Wizard**, kein Grid-Case. Öffnet intern mehrere vorkonfigurierte Grid-Creator-Instanzen nacheinander.

**In Phase 1 nur Placeholder-Page. Detailliertes Design in eigener Session.**

---

## 15. Vision-Pages (Filmsystem, Board, Cropper, Reverse, Kit)

**Alle in Phase 1 als Coming-Placeholder.** Klick → Page mit nur "COMING SOON" Mono-Label zeigen. Die Rail-Items sind sichtbar aber gedimmt.

Wichtig: JSON-Config `pages.config.json` so bauen, dass Jonas später ein coming-Slot einfach durch echten Page-Content ersetzen kann — z.B. könnte statt "Cropper" eine ganz andere Page dorthin wandern.

Beispiel-Schema:

```json
{
  "pages": [
    { "id": "home", "label": "Home", "icon": "home", "route": "/", "status": "active" },
    { "id": "film", "label": "Film", "icon": "film", "route": "/film", "status": "coming", "group": "PRE" },
    { "id": "board", "label": "Board", "icon": "board", "route": "/board", "status": "coming", "group": "PRE" },
    { "id": "grid", "label": "Grid", "icon": "grid", "route": "/grid", "status": "active", "group": "MAKE", "starred": true },
    { "id": "lab", "label": "Lab", "icon": "lab", "route": "/lab", "status": "active", "group": "MAKE" },
    { "id": "frame", "label": "Frame", "icon": "frame", "route": "/frame", "status": "active", "group": "MAKE" },
    { "id": "hub", "label": "Hub", "icon": "hub", "route": "/hub", "status": "active", "group": "LIB" },
    { "id": "crop", "label": "Crop", "icon": "crop", "route": "/crop", "status": "coming", "group": "TOOLS" },
    { "id": "rev", "label": "Rev", "icon": "rev", "route": "/rev", "status": "coming", "group": "TOOLS" },
    { "id": "kit", "label": "Kit", "icon": "kit", "route": "/kit", "status": "coming", "group": "TOOLS" }
  ]
}
```

---

## 16. Settings (später)

**Wichtig für Vision:**
- Brightness-Slider (Dark / Darker / Studio) — Jonas' Bildschirm ist nicht optimal, andere User haben OLED/Studio-Monitore. Brightness-Wahl sollte Farbwerte skalieren, nicht über CSS-Filter gelöst werden.
- Language (DE / EN) — bereits als Feature vorhanden in aktueller App
- Theme-Optionen (erstmal nur Dark; Light später optional)

Für Phase 1: Placeholder-Page, Brightness-Slider grundlegend wired (verändert CSS-Custom-Property `--brightness-multiplier` die auf die Hauptfarben angewendet wird).

---

## 17. Help (später)

Keyboard-Shortcuts, Docs-Links, Feedback-Form. Phase 1: Placeholder.

---

## 18. Kritische UI-Details die beim ersten Lesen übersehen werden

Diese Details wurden in der Planungs-Session als wichtig identifiziert und werden leicht überlesen:

### 18.1 Unterschied Override-Dot vs Signature-Applied

Ein Panel kann **gleichzeitig** zwei Zustände haben:
- **Has-Override:** einzelne Panel-Config weicht vom globalen Wert ab (z.B. andere Pose als global gesetzt) → kleiner Gold-Dot top-right am Panel (8px, Glow)
- **Has-Signature-Applied:** gespeicherte Signature (Look-Preset) ist auf dieses Panel angewendet → Gold-getinte Border des gesamten Panels + subtle Gold-Glow

Diese beiden Zustände müssen visuell unterscheidbar bleiben, auch wenn beide gleichzeitig aktiv sind.

### 18.2 Normalizer Two-Step ist kein Modul

**`needs normalization`** ist kein Modul-Toggle. Es ist ein **Workflow-Switch** im Case Context, der den ganzen Grid-Creator-Ablauf ändert:

- Bei "reference is clean": User arbeitet direkt im Grid-Workspace
- Bei "needs normalization": Zweistufen-Workflow — erst wird ein Normalizer-Grid erzeugt (2 Panels: User-Ref → Full-Body-Master), das Ergebnis-Bild wird als neues Referenzbild genommen, dann geht's erst ins eigentliche Grid

In Phase 1 reicht es, wenn der Switch existiert und bei "needs normalization" ein Info-Banner oder Stage-Indicator im Workspace erscheint ("Step 1 of 2: Normalize Reference"). Die tatsächliche 2-Step-Orchestrierung kann in späterer Session gebaut werden.

### 18.3 Gold gehört nur Signatures, nicht Classics

**Classics (built-in Templates) haben KEIN Gold**, keine Badges, keine Sterne. Sie sind ganz normale Cards mit neutralem Styling. Das war in früheren Design-Entwürfen anders — dort waren Classics als "Signature" mit Gold markiert, das wurde bewusst umgestellt.

**Gold erscheint nur:**
- Bei Signatures (User-erstellte Looks)
- Beim Grid-Rail-Item (Star-Indikator für Herzstück)
- Bei Override-Dots auf Panels
- In der Signatures-Bar
- Bei der Applied-Signature-Sektion im Inspector
- Bei Panels/Preview-Items die eine Signature-Applied haben

### 18.4 Scrollbars als subtile Qualitäts-Indikator

Browser-Default-Scrollbars sehen wie Windows-95-Artefakte aus und machen die gesamte App billig. **Überall eigene Scrollbars anwenden** (siehe 20.1 für CSS). Das ist ein kleiner Detail-Move mit großem Wirkungs-Effekt auf die "Pro Tool"-Wirkung.

---

## 19. Globale UI-Rules

### 19.1 Scrollbars

Niemals Browser-Default. Überall custom:

```css
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: rgba(60,207,204,0.3); }

/* Firefox */
* { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
```

Global in `globals.css` setzen, nicht pro Komponente duplizieren.

### 19.2 Transitions / Animations

- Default transition: `all 0.18s ease`
- Hover-Transform: `translateY(-1px)` bis `-2px` (subtil)
- Icons scale on hover: `scale(1.08)` — nur auf Rail/Toolbar
- Icons scale on active: `scale(0.94)` (feedback für click)
- Keine langen Animationen (> 300ms) — niemand wartet auf UI

### 19.3 Tooltips

Zwei Ebenen:
- **Simple Tooltip** (Buttons, Actions): 1-Zeiler in Mono, erscheint unten oder oben (position-aware), klein
- **Rich Tooltip** (Rail-Items, wichtige Navigation): 2-Zeilen-Karte mit:
  - Titel (13px / 500 / `#f0f0fa`)
  - Beschreibung (11px Mono / `#a0a0b8` / 0.02em letter-spacing / line-height 1.45)
  - Background `#1a1a26`
  - Border `1px solid rgba(60,207,204,0.35)`
  - Shadow `0 6px 20px rgba(0,0,0,0.7)`
  - Arrow der auf das Element zeigt (9×9px rotated square)
  - min-width 200px

### 19.4 Card-Hover-Pattern

Einheitlich über die App:
- `transform: translateY(-2px)`
- `border-color` wechselt zu `rgba(60,207,204,0.35-0.5)` (oder Gold-Äquivalent bei Signature-Cards: `rgba(245,201,97,0.5)`)
- `box-shadow: 0 10px 28px rgba(0,0,0,0.5), 0 0 0 1px rgba(60,207,204,0.15)` für Tiefe + Outline-Glow

### 19.5 Buttons

- **Default** (outline): transparent bg, `1px solid rgba(255,255,255,0.1)` border, hover wechselt Border zu Teal
- **Primary**: `rgba(60,207,204,0.12)` bg, Teal-Border, Teal-Text
- **Secondary** (Gold, für Signature-Actions): `rgba(245,201,97,0.1)` bg, Gold-Border, Gold-Text
- **Danger** (wenn nötig): rotes semantic color, sparsam
- Padding: `8px 12px` Standard, `4px 10px` Compact (Output-Bar), `6px 12px` Header-Buttons

### 19.6 Inputs

- Background `#141420`
- Border `1px solid rgba(255,255,255,0.08)`
- Focus: Teal-Border + subtle Glow
- Padding `10px 12px`
- Font 12-13px, never below 11px

---

## 20. Files-Struktur-Empfehlung

Keine komplette Restrukturierung, aber diese Konventionen für neue Komponenten:

```
src/
  components/
    shell/
      Rail.jsx
      Rail.module.css
      RailItem.jsx
      Header.jsx
      Header.module.css
      StatusBar.jsx
      StatusBar.module.css
    landing/
      LandingPage.jsx
      LandingPage.module.css
      ContinueBand.jsx
      QuickStartBand.jsx
      DiscoverBand.jsx
    gridcreator/
      GridCreator.jsx            // Parent, routing zwischen Picker/Workspace
      Picker/
        TemplatePicker.jsx
        TemplatePicker.module.css
        TemplateCard.jsx
      Workspace/
        Workspace.jsx
        Workspace.module.css
        ModuleToolbar.jsx
        CaseContext.jsx
        DimensionBuilder.jsx     // Die 6×4 Hover-Grid-Komponente
        Canvas.jsx
        Panel.jsx
        Inspector.jsx
        PreviewStrip.jsx
        SignaturesBar.jsx
        OutputBar.jsx
    shared/
      Tooltip.jsx
      RichTooltip.jsx
      Button.jsx                 // Mit variant: 'default' | 'primary' | 'gold'
      Pill.jsx
  stores/
    tokenStore.js                // Zentraler Token/Signature-Store (Stufe 1)
    uiStore.js                   // Rail-State, Settings, etc.
  config/
    pages.config.json            // Rail-Struktur, Coming-Slots
    cases.config.json            // 10 Base Cases (existiert schon evtl.)
    modules.config.json          // 7 Modules + Detail-Schemas
  styles/
    tokens.css                   // CSS Custom Properties für Farben/Sizes
    globals.css                  // Scrollbars, Fonts, Resets
```

---

## 21. Implementation Priority

### Phase 1 (dieser Handoff — Visual Overhaul Core)
1. **globals.css + tokens.css** — Farbsystem + Typographie + Custom Scrollbars
2. **Shell** (Rail + Header + StatusBar) mit pages.config.json
3. **Landing Page** (3 Bände mit Dummy-Daten)
4. **Grid Creator Picker** mit 10 Core Templates als Cards (Thumbnails aus Mockup-Code Abschnitt 23)
5. **Grid Creator Workspace** komplett (Case Context inkl. DimensionBuilder, Canvas mit Silhouetten-Panels, Inspector, PreviewStrip, SignaturesBar, OutputBar)
6. **Token-Store Basis** (Stufe 1: SeenLab schreibt, Grid Creator liest)
7. **Coming-Pages** (Placeholder mit "COMING SOON")

### Phase 2 (direkt danach)
- **SeenLab** visueller Umbau (Chips → Kacheln, 3-Spalten-Layout)
- **Modul-Popovers** im Grid Creator (Environment 3 Modi, Style Overlay Signature-Picker, Camera Dropdown)
- **Canvas-Silhouetten-Library** füllen (alle Cases, nicht nur character)

### Phase 3 (später)
- **Prompt Hub** mit kompletter Library-Integration
- **Consistency Kit Wizard** als eigene choreographierte Flow
- **Vision-Pages** (Filmsystem, Shot Board, Cropper, Reverse)
- **SeenFrame** visuelles Update

---

## 22. Was NICHT verändert wird

- Die bestehende Grid Engine (Slices 1-8, 42 Tests) bleibt unberührt
- Die bestehenden Case-Schemas und Module-Definitionen (JSON-Layer)
- Die Deploy-Pipeline (GitHub Pages, github.io/SeenGrid)
- Die Core-Entscheidung CSS Modules als Styling-System
- Bestehende .env, package.json, vite.config — außer neue Deps werden hinzugefügt (Geist Fonts, Instrument Serif, Zustand oder Jotai für Store)

---

## 23. Mockup-Referenz-Code

Vier HTML/CSS/JS-Widgets die in der Planungs-Session als interaktive Mockups gebaut wurden. Diese sind die **verbindliche visuelle Quelle** für die Implementierung — bei Unklarheit in der Beschreibung oben, immer hier nachschauen.

Format: jedes Mockup als Full-HTML zur Ansicht im Browser. Jonas kann diese Dateien lokal öffnen um die Mockups zu sehen. Claude Code soll den CSS-Code, die SVG-Icons, die Interaktions-Patterns und die exakten Farb-/Größen-Werte von hier übernehmen.

### 23.1 Shell + Landing (v3 — Kontrast-korrigiert)

Liegt separat als `mockup_01_shell_landing.html`. Wichtige Artefakte daraus:
- Rail-Struktur, Icons (SVG inline), Gruppen-Trenner
- Landing 3-Bände-Layout
- Header + Status-Bar
- Thumbnail-Gradient-Patterns für Preview-Bilder
- Alle Farb- und Spacing-Werte in CSS

### 23.2 Grid Creator Picker

Liegt separat als `mockup_02_gridcreator_picker.html`. Wichtige Artefakte:
- Template-Card-Struktur + Hover-Pattern
- Filter-Pills + Search-Input
- Classics-Sektion (neutral, kein Gold!)
- "Start from scratch"-Card mit dashed Border
- Thumbnail-Previews für die 10 Base Cases (abstrakte Patterns)

### 23.3 Grid Creator Workspace v3 (finale Version)

Liegt separat als `mockup_03_gridcreator_workspace.html`. **Das wichtigste Mockup.** Enthält:
- Komplettes Layout inkl. korrekter Full-Width-Zonen für PreviewStrip/SignaturesBar/OutputBar
- **Interaktiver Dimension-Builder** (6×4 Hover-Grid mit JS) — der JS-Code ist direkt übernehmbar
- Panel-States (default, hover, selected mit Override-Dot)
- Preview-Strip mit Mini-Panels
- Signatures-Bar mit Gold-Pills
- Output-Bar mit Buttons
- Inspector mit allen Sektionen inkl. Override-Badge-Logik

**Wegen Länge werden die HTML-Files in separaten Dateien bereitgestellt** (siehe Outputs dieser Session). Jonas hat sie lokal und kann sie im Browser öffnen.

---

## 24. Entscheidungs-Referenztabelle (Quick-Lookup)

| Frage | Antwort |
|---|---|
| Page-Navigation | Linke Icon-Rail, 72px fix, Gruppen-Trenner, Rich-Tooltips mit Beschreibung |
| Start-Page | Landing mit Continue/Quick-Start/Discover |
| Tabs-Struktur | Komplett gekippt — Pages statt Tabs |
| Name für gespeicherte Looks | **Signatures** (nicht Token, nicht Preset, nicht Cels, nicht Blends) |
| Name für built-in Templates | **Classics** (nicht Signature, nicht SeenClassics) |
| Gold-Zuordnung | Ausschließlich für Signatures (User-persönlich) |
| Teal-Zuordnung | Alle aktiven/Primary-States, universell |
| MJ-Tool-Name | **SeenFrame** mit "optimized for MJ v7" Untertitel |
| SeenFrame Token-Integration | Isoliert, keine Crossover |
| Grid Creator Einstieg | Picker-State als eigene Page (kein Overlay) |
| Dimensions-UI | Hybrid: 6×4 Hover-Grid + Pills für Feintuning |
| Preview-Position | Full-Width Strip unter Workspace-Row (NICHT in Spalte) |
| Consistency Kit | Eigene Wizard-Page (Rail: "Kit"), separate Session |
| Font-Richtung | Instrument Serif (Display) + Geist Sans (Body) + Geist Mono (Tech) |
| Scrollbars | Custom überall, nie Browser-Default |
| Module-Labels | Alle Single-Word, uniforme min-width 92px |
| Gold auf Classics | NEIN — Classics sind neutral |
| Override-Dot vs Signature-Applied | Beides Gold, aber unterschiedliche visuelle Sprache (Dot vs Border-Tint) |
| Normalizer | Workflow-Switch, nicht Modul |
| Coming-Pages | In Rail sichtbar (gedimmt), JSON-konfigurierbar |
| Code-Übergabe an Jonas | Komplette Files, keine Diffs, ein File pro Antwort |

---

## 25. Wie diese Phase startet

**Empfohlener erster Schritt für Claude Code:**

1. Lies diesen Handoff komplett
2. Öffne die drei Mockup-HTML-Dateien im Browser (oder lies ihren Quellcode falls sie mitgeliefert sind)
3. Richte ein: `globals.css`, `tokens.css`, `pages.config.json`, Google Fonts Imports (Instrument Serif, Geist Sans, Geist Mono)
4. Baue Shell (Rail, Header, StatusBar) und teste in Isolation
5. Baue Landing
6. Baue Grid Creator Picker
7. Baue Grid Creator Workspace (das ist der größte Brocken)
8. Verdrahte Token-Store (Stufe 1)
9. Coming-Placeholders für alle anderen Rail-Items

**Bei Unklarheit:** Jonas fragen. Er kennt das Projekt, die Codebase, und kann visuelle Entscheidungen schnell bestätigen/korrigieren. Nicht selbst raten — Iterationen sind schneller als falsche Annahmen.

**Ende Handoff v2.**
