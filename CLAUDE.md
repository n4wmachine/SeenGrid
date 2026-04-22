# CLAUDE.md — SeenGrid

## Was ist SeenGrid?

SeenGrid ist ein **grid-natives Produktions- und Kontrollsystem für AI-Visual-Workflows**. Kein generischer Prompt-Builder, kein Tutorial-Tool, kein Feature-Sammelsurium. SeenGrid ist die **Schicht vor der Generierung** — Szenenaufbau, Konsistenzstruktur, Produktionsvorbereitung, Workflow-Orchestrierung. Heute ein modulares Operator-Tool für Jonas' echten Workflow, langfristig ein Pre-Production OS.

Das **Herz** ist der **Grid Creator** mit seiner modularen Engine: User wählt Case, stellt Grid zusammen, toggled Module, der Prompt baut sich live in Echtzeit — kein statisches Template, kein Preset-Picker.

Funktioniert neben NanoBanana auch in anderen Bild-KIs (Grok Imagine, GPT Image, etc.). Kein Video-Tool — nur Bildgenerierung.

## Der Nutzer

Jonas. Solo AI-Filmemacher, Nicht-Coder. Denkt in Filmlogik, nicht in Software-Features. Erwartet kurze Antworten ohne Coding-Jargon — maximal 1-2 Sätze pro Punkt. Technische Details gehören in Code-Kommentare, nicht in den Chat. Toleriert keine generischen AI-Outputs und keine Wall-of-Text-Erklärungen.

## Tech Stack

Vite + React (JavaScript, kein TypeScript). Reine Client-App, kein Backend. Daten in JSON unter `src/data/`. Deploybar auf Vercel/Netlify.

---

## Architektur-Grundsatz: Erweiterbarkeit ohne Rebuild

**Das ist Kernanforderung, kein Bonus.** SeenGrid muss so gebaut sein dass Jonas jederzeit sagen kann: füge Case X hinzu, entferne Modul Y, ersetze Prompt A durch Prompt B, erweitere Feld Z — ohne dass das ganze Tool neu gebaut werden muss. Alles ist datengetrieben. Inhalte leben in JSON-Dateien, nicht hardcoded im UI-Code. Nur die Kernmechanik der Engine ist hardcoded. Alles drumherum (Cases, Module, Prompts, Styles, Presets) ist austauschbar.

Konkret: Ein neuer Case = neue Config-Dateien unter `src/lib/cases/`, kein neuer Compiler. Ein neues Modul = ein Key in der Compile-Order, ein Emit-Helper, ein UI-Control. Ein neues Trendy Sheet = eine JSON-Datei, kein Code.

---

## Grid Creator — Vier Tiers

Der Grid Creator hat vier Tiers:

Jeder Tier spricht eine andere Zielgruppe / einen anderen Use Case an:

1. **Custom Builder** — Für Leute die genau wissen was sie wollen und volle Kontrolle brauchen. Die echte modulare Live-Engine: Case wählen, Grid-Dimensionen, Panel-Orientierung, Module togglen, Panel-Rollen bearbeiten — Prompt passt sich in Echtzeit an. Live Visual Preview mit SVG-Dummies. **Das Herzstück.**
2. **Core** — Für schnelle Drafts oder eilige Leute. Vorgefertigte Starter-Templates für Standard-Cases (z.B. Standard Character Sheet). **Direkt im Custom Builder auswählbar** als Toggle `[ ] Custom [ ] Core` — der User entscheidet ob er bei Null anfängt oder mit einem vorgefüllten Template das er danach frei anpassen kann. **Läuft über die Engine.**
3. **Signature** — Für Leute die erprobte Klassiker übernehmen wollen wenn er auf ihren Use Case passt. Jonas' handoptimierte, NanoBanana-validierte Sheets. Ein Klick, fertiger Prompt, direkt kopierbar. **Läuft nicht über die Engine** — fertige, getestete Prompts die so bleiben wie sie sind.
4. **Trendy** — Casual / Social Media Zielgruppe. Kuratierte Community-Grids aus dem Prompt Vault / Trending-Prompts-Repo. Eigenständige Preset-Sammlung mit Copy-Paste-Output. **Läuft nicht über die Engine** — Community-Prompts passen nicht zwingend in das Case/Modul-Schema.

---

## Grid Engine — Architektur

### Wie sie funktioniert
User wählt Case + Grid-Größe + Module → **State-JSON** wird zusammengebaut → Compiler filtert disabled Module, merged Forbiddens aus drei Quellen (Case + Modul + User), leitet Panels aus Panel-Role-Strategy ab → Output = paste-ready **Prompt-JSON** mit stabiler Key-Order.

### State-JSON vs. Prompt-JSON
Zwei verschiedene Dinge. State-JSON = interner Zustand mit enabled-Flags, schema_version, Metadaten. Prompt-JSON = das was NanoBanana bekommt (clean, ohne interne Felder). Der Compiler übersetzt das eine ins andere. Die Test-JSONs in `DISTILLATIONS/` sind Prompt-JSON-Zielzustände.

### Warum JSON als Output
Jonas hat empirisch getestet: NanoBanana reagiert auf strukturiertes JSON 1:1 wie auf Paragraph-Prompts — bei Constraint-schweren Cases sogar **präziser**. Der Qualitätsgewinn kommt nicht vom Format selbst, sondern von den klaren Hierarchien, expliziten Prioritäten und harter Trennung zwischen Constraints und Präferenzen die JSON erzwingt.

### Vier Struktur-Prinzipien
1. Prioritäten werden wörtlich kodiert (`priority`, `authority_over`-Felder)
2. Listen bleiben Listen (Arrays, nie zu Fließtext zusammengezogen)
3. Harte Regeln bleiben Booleans (kein "preferably avoid")
4. Key-Reihenfolge = Priorität (stabile Compile-Order, wichtigstes oben)

### Constrained Modularity
Nicht jedes Modul kombiniert mit jedem Case. Jonas' Sheets sind empirisch getestete Konstellationen, keine Lego-Steine. Jeder Case definiert seine eigene Modul-Whitelist. Siehe Kompatibilitäts-Matrix in `MODULE_AND_CASE_CATALOG.md`.

---

## Look Lab → Grid Creator Pipeline

Look Lab ist Jonas' Style-Playground wo er in NanoBanana Styles/Looks entdeckt. Zwei Wege:

**Mit Speichern:** Style in Look Lab kreieren → als Token speichern → Token taucht im Custom Builder als Style-Overlay-Modul-Option auf → User wählt den Token → wird in den Prompt eingefügt.

**Direkt (ohne Speichern):** Style in Look Lab kreieren → direkt in den Custom Builder rüberschieben. Gleiche Funktionsweise, nur ohne Speicher-Zwischenschritt.

Phase 1 = Text-Token (im MVP, Slice 7). Phase 2 = Bild-Referenzen (später).

## JSON-Output: nur wo das Ziel-Tool es versteht

Der JSON-Prompt-Output ist spezifisch für den **Grid Creator** (empirisch validiert in NanoBanana, funktioniert auch in anderen Bild-KIs). Die anderen Module erzeugen Prompts im Format ihres Ziel-Tools: Prompt Builder → NanoBanana-Paragraph, MJ Builder → Midjourney-Syntax. Nicht alles wird durch die JSON-Engine geschickt.

---

## Aktueller Stand

**Letzte Session (2026-04-22):** Engine-Free-Mode komplett gebaut nach `docs/visual-overhaul/ENGINE_FREE_MODE_SPEC_V1.md` (9 Slices, Branch `claude/seengrid-visual-overhaul-6RK4n`). Alle 42 Engine-Tests grün, Output-Bytes für angle_study + normalizer byte-identisch preserviert. Free-Mode funktioniert als gleichwertiger Case: Picker FROM SCRATCH aktiv → Workspace mit leeren Panels ohne Rollen, alle 13 Module frei toggelbar. Case-Bundles eingeführt (`case.json` + `schema.json` + optional `strategy.js`/`serializer.js`/`validate.js`), zentrale `bundleRegistry.js` dispatcht generisch ohne Fallback-Switch. 5 universelle Module haben Emit-Helper unter `src/lib/modules/<id>/emit.js` (style_overlay, environment_mode, forbidden_elements_user, panel_content_fields, random_fill); 8 weitere landen als `_placeholder` unter `modules_extra` bis Emit-Helper folgen. `convert to free mode`-Knopf in OutputBar (Einbahnstraße, §6/W5).

Post-Smoke-Test-Fixes nach User-Feedback: (1) Back-Button im ShellHeader erschien nie — `WorkspaceHeaderProvider` saß in `GridCreator` unterhalb vom Header. `gridMode` + Handler nach `App.jsx` gehoben, Provider wrappt jetzt Header + GridCreator gemeinsam. GridCreator ist prop-driven (`mode`, `onPick`). (2) Rail-Klick auf aktive Grid-Creator-Kachel war tot (setActivePage(same) bailed) — jetzt: wenn schon auf grid im Workspace, Rail-Klick → Picker. (3) Live-`PromptPreview`-Bar oberhalb OutputBar (240px scrollable JSON, kollabiert auf 32px Peek mit Token-Count + Top-Level-Keys) — User sieht jeden Edit sofort im kompilierten Output. Besonders relevant im Free-Mode, wo keine Silhouetten/Rollen mehr Feedback liefern.

Zweite Post-Smoke-Iteration (JSON-Navigation): Jonas konnte nicht erkennen wo sein Input im Prompt gelandet ist — Scrollen + Abgleichen durch den JSON-Block war unintuitiv. Fix in zwei Teilen: (a) Flash-on-Change — Preview rendert zeilenweise und diffet bei jedem Compile, geänderte Zeilen flashen gelb für ~1500ms (Timer restartet bei jedem Edit), erste geänderte Zeile scrollt automatisch ins Blickfeld. (b) Focus-Anchor — neuer `PromptPreviewContext` mit `setAnchor({ key, nth? })`; Textfelder rufen es in onFocus/onBlur. Preview findet die passende `"key":`-Zeile und markiert sie teal mit Inset-Bar solange das Feld Fokus hat. Verdrahtet: Inspector-Panel-Content (nth=panelIndex), CaseContext Forbidden-Input, Environment custom_text Textarea, Style-Overlay-Token-Input. Gold bleibt Signature-only (NUANCEN 1), Flash nutzt weiches Gelb-Amber.

Bekannte offene UX-Frage (Design, nicht Bug): Multi-Character im Free-Mode Content-Feld — aktuell Freitext-String pro Panel, sauber wäre das `multi_character`-Modul aus dem Katalog. Liegt als TODO-Emit-Platzhalter in `modules_extra`.

**Nächster Schritt:** Fresh Smoke-Test durch Jonas im Browser (Free-Mode durchklicken, neue Fixes verifizieren — Back-Button erscheint, Rail-Klick funktioniert, Preview flasht geänderte Zeilen + markiert fokussierte Felder teal + scrollt automatisch). Danach Entscheidung: (a) mit den 8 TODO-Modul-Emittern weiter (`camera_angle`, `weather_atmosphere`, `wardrobe`, `pose_override`, `expression_emotion`, `face_reference`, `multi_character`, `object_anchor`), oder (b) Design-Session zu `multi_character` / pose-per-Character / Content-Feld-Strukturierung.

### Bestehende Module (alles in Arbeit, nichts final)
- **Prompt Builder** — chip-basiert, Tab 1. Funktionsfähiger Platzhalter.
- **Grid Operator** — Tab 2. Lädt 18 statische Preset-JSONs, 3 Modi (Core/Signature/Custom). **Wird durch die Engine ERSETZT** sobald diese fertig ist. Bis dahin bleibt er parallel bestehen.
- **MJ Cinematic Builder** — Tab 3. Funktionsfähiger Platzhalter.
- **Prompt Vault** — 1500+ Community-Prompts, Tab 4. Funktionsfähiger Platzhalter.
- **Look Lab** — Style-Playground. Funktionsfähiger Platzhalter.
- **Design System** — cinematic dark theme, Teal-Akzent (Markenfarbe), Gold nur für Signature, i18n DE/EN.

### Grid Engine (Slices 1-8 + Engine-Free-Mode-Refactor fertig)
- Case-Bundles: `src/lib/cases/<caseId>/{case.json, schema.json, serializer.js, validate.js}` + optional `strategy.js`
- Angle Study: `src/lib/cases/characterAngleStudy/{case,schema}.json + strategy.js + serializer.js + validate.js`
- Normalizer: `src/lib/cases/characterNormalizer/{case,schema}.json + serializer.js + validate.js`
- Free Mode: `src/lib/cases/freeMode/{case,schema}.json + serializer.js + validate.js` (case-los, module-driven)
- Bundle-Registry: `src/lib/cases/bundleRegistry.js` (zentraler Dispatch, kein Fallback-Switch)
- Module-Emit-Registry: `src/lib/modules/emitRegistry.js` + 5 Helper unter `src/lib/modules/<id>/emit.js`
- Compiler: `src/lib/compiler/{index.js,serializers/json.js,serializers/normalizerJson.js}` (serializers sind thin shims auf Bundle-Serializer)
- Thin-Shims rückwärtskompatibel für Tests: `characterAngleStudy/{schema,defaults,panelRoleStrategy}.js`, `characterNormalizer/{schema,defaults}.js`
- POC UI: `src/components/CustomBuilderPoc.jsx` (throwaway Tab 5)
- Tests: 42/42 grün (14 Schema + 19 Compiler + 9 Normalizer)
- Slice 4: Face Reference Toggle (Checkbox → references.face_reference erscheint/verschwindet)
- Slice 5: Environment Mode (inherit / neutral_studio / custom_text)
- Slice 6: Live Visual Preview (SVG-Silhouetten für 8 Panel-Rollen)
- Slice 7: Style Overlay (Token-Eingabe → style_overlay Block im Output)
- Slice 8: Normalizer Two-Step (character_normalizer Case + Compiler + Serializer)
- Engine-Free-Mode Slice 1-9 (2026-04-22): Case-Bundle-Refactor + free_mode + Picker-Aktivierung + Workspace-UI + Convert-Action

### Visual Overhaul (fertig)
- **theme.css**: Teal (#2bb5b2) als primärer UI-Akzent (Markenfarbe). Gold nur für Signature-Mode. Blue-tinted Surfaces. 56px Header.
- **Header**: Kompakt (56px), SVG-Mark, Mono-Tabs mit Diamond-Bullets, Teal-Akzent.
- **Alle Komponenten-CSS**: Header-Höhe-Referenzen auf `var(--sg-header-height)`, Teal als UI-Akzent konsistent durchgezogen. Gold nur in GridOperator Signature-Elementen.
- Betroffene Dateien: `theme.css`, `Header.css`, `Header.jsx`, `PromptBuilder.module.css`, `GridOperator.module.css`, `MJStartframe.module.css`, `PromptVault.module.css`

**Nach Slice 8:** Weitere Cases + Module (siehe `MODULE_AND_CASE_CATALOG.md`), Panel-Role-Customization (User wählt pro Panel welchen Winkel er will).

**Wichtig bei der Engine-Fertigstellung:** Der bestehende Grid Operator (`GridOperator.jsx`) hat einen **Dim Advisory** (`getDimAdvice()`) der dem User pro Grid-Kombination die exakten Panel-Pixel-Größen bei 2K und 4K zeigt, mit Quality-Tags (Hires/Standard/Low/Tiny). Das muss in die neue Engine übernommen werden — der User muss vor der Generierung wissen ob seine Panels als Startframes tauglich sind.

---

## Roadmap nach der Engine

1. **Grid Engine fertig bauen** ← jetzt, kein Kompromiss
2. **Visual Overhaul** — komplette Layout-Neugestaltung. Canvas-Pattern Grid Creator, Prompt Hub (ex Vault+Trendy), Shell-System. Plan liegt in `docs/VISUAL_OVERHAUL_PLAN.md`.
3. **UX Polish + Fixes** — auf dem neuen Design, nicht auf dem alten

---

## Wichtige Referenz-Dateien

| Datei | Zweck |
|-------|-------|
| `MODULE_AND_CASE_CATALOG.md` | 10 Cases, 13 Module, Kompatibilitäts-Matrix. **Verbindlich** — nichts erfinden was dort nicht steht. |
| `DISTILLATIONS/angle-study-json-example.md` | Validierter JSON-Prompt, Ground Truth für Angle Study |
| `DISTILLATIONS/character-normalizer-json-example.md` | Validierter JSON-Prompt, Ground Truth für Normalizer |
| `DISTILLATIONS/character-study-chatgpt-groundtruth.md` | Original-Paragraph-Prompt. **Locked** — nicht verändern ohne neuen NanoBanana-Test. |
| `SeenGrid_grundgeruest_fuer_claude.md` | Konzeptionelles Grundgerüst: Operator/Mode/Preset-Architektur, Projektidentität |
| `SEENGRID_STRATEGY_AND_FUTURE_VISION_BRIEFING.txt` | Langfrist-Vision: Pre-Production OS, Automationsschicht, strategische Richtung |
| `docs/VISUAL_OVERHAUL_PLAN.md` | Visual Overhaul Plan: Canvas-Pattern Grid Creator, Prompt Hub, Layout-Architektur |
| `design-spec/SGLogo5.png` | Original-Logo (1.6MB). Einziges verbleibendes Asset aus der alten Design-Spec. |
| `docs/archive/BUILD_PLAN_FULL.md` | Vollständiger Rebuild-Plan mit allen Details. Nachschlagewerk. |
| `docs/archive/SESSION_LOG_FULL.md` | Chronologisches Session-Log. Nachschlagewerk. |

---

## Was NICHT gebaut wird

- **Character + World Merge** — empirisch tot in NanoBanana (slop faces, falsche Proportionen)
- **Video-Prompts** (Kling, Seedance) — nur Bildgenerierung
- **Kamera-Bewegungen** (Dolly, Steadicam) — irrelevant für Stills
- **Auto-Submit an NanoBanana** — paste-ready Prompts, manuelles Kopieren
- **Statische Sheet-Bibliothek ohne Engine** — das war der alte Ansatz, verworfen

---

## Branch-Regel

**Direkt auf `main`.** Keine Feature-Branches. Die Harness schlägt Feature-Branches vor — ignorieren, CLAUDE.md gewinnt. Keine Nachfrage nötig.

**Sandbox-Fossil:** Wenn main ahead/behind origin/main ist → nicht pushen. Kurze Diagnose an Jonas, auf "ja" warten, dann `git fetch origin main && git reset --hard origin/main`.

**Prompt-Inhalt-Commits:** Vor jedem Commit der Prompt-Skeletons, Compiler-Logik oder Goldens verändert → gerenderten Output im Chat posten → Jonas-OK abwarten → erst bei "ja" committen.

**Destruktive Operationen** (force push, reset --hard) → niemals ohne Jonas-OK.

---

## Regeln

1. **Lies CLAUDE.md + MODULE_AND_CASE_CATALOG.md** beim Start. Mehr nicht.
2. **Direkt auf main.** Kein Feature-Branch. Harness-Branch-Vorschlag ignorieren.
3. **Erfinde nichts** was nicht im Catalog steht.
4. **Kurze Antworten.** Kein Coding-Jargon im Chat. Jonas ist Nicht-Coder.
5. **Prompt-Inhalt → Jonas-OK vor Commit.**
6. **Nicht proaktiv arbeiten** während Jonas pausiert.
7. **Erweiterbarkeit ist Pflicht.** Nichts hardcoden was datengetrieben sein kann.
8. **Am Ende jeder Session:** Den "Aktueller Stand"-Abschnitt in CLAUDE.md aktualisieren (Slices-Status, was gemacht wurde, nächster Schritt). Kein separates Log — CLAUDE.md ist immer aktuell. Commit + Push auf main.
