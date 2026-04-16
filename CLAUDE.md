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

1. **Signature** — Jonas' handoptimierte, NanoBanana-validierte Sheets. Ein Klick, fertiger Prompt, direkt kopierbar. **Läuft nicht über die Engine** — das sind fertige, getestete Prompts die so bleiben wie sie sind. Aktuell Platzhalter, echte Sheets kommen rein sobald die Engine steht.
2. **Core** — Basis-Starter-Templates die als **vorgefüllte Zustände in den Custom Builder laden** (nicht ein eigener Tab — der User kann sie danach frei editieren). **Läuft über die Engine.**
3. **Trendy** — Kuratierte Community-Grids aus dem Prompt Vault / Trending-Prompts-Repo. **Eigenständige Preset-Sammlung mit Copy-Paste-Output** — werden NICHT in den Custom Builder geladen, weil Community-Prompts nicht zwingend in das Case/Modul-Schema passen. **Läuft nicht über die Engine.**
4. **Custom Builder** — Die echte modulare Live-Engine. User wählt Case, Grid-Dimensionen, Panel-Orientierung, toggled Module, bearbeitet Panel-Rollen — Prompt passt sich in Echtzeit an. Live Visual Preview mit SVG-Dummies zeigt was jedes Panel darstellt. **Das Herzstück.**

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

### Bestehende Module (alles in Arbeit, nichts final)
- **Prompt Builder** — chip-basiert, Tab 1. Funktionsfähiger Platzhalter.
- **Grid Operator** — Tab 2. Lädt 18 statische Preset-JSONs, 3 Modi (Core/Signature/Custom). **Wird durch die Engine ERSETZT** sobald diese fertig ist. Bis dahin bleibt er parallel bestehen.
- **MJ Cinematic Builder** — Tab 3. Funktionsfähiger Platzhalter.
- **Prompt Vault** — 1500+ Community-Prompts, Tab 4. Funktionsfähiger Platzhalter.
- **Look Lab** — Style-Playground. Funktionsfähiger Platzhalter.
- **Design System** — cinematic dark theme, i18n DE/EN.

### Grid Engine (Slices 1-3 fertig)
- Schema: `src/lib/cases/characterAngleStudy/{schema,defaults,panelRoleStrategy}.js`
- Compiler: `src/lib/compiler/{index.js,serializers/json.js}`
- POC UI: `src/components/CustomBuilderPoc.jsx` (throwaway Tab 5 — wird nach Visual Overhaul in den echten Grid Creator integriert)
- Tests: 33/33 grün (14 Schema + 19 Compiler)

### Offene Slices (4-8)

| Slice | Was | Kern |
|-------|-----|------|
| 4 | Face Reference Modul | Checkbox → `references.face_reference` erscheint/verschwindet im Output |
| 5 | Environment Modul | Drei Modi: inherit (kein Block), neutral_studio, custom_text |
| 6 | Live Visual Preview | SVG-Dummies für Panel-Rollen (Front/Right/Left/Back) |
| 7 | Look Lab Integration | Style-Token aus Look Lab in den Prompt einfügen |
| 8 | Normalizer Two-Step | Optionaler Pre-Step für unvollständige Referenzbilder |

**Nach Slice 8:** Weitere Cases + Module (siehe `MODULE_AND_CASE_CATALOG.md`), Panel-Role-Customization (User wählt pro Panel welchen Winkel er will).

---

## Roadmap nach der Engine

1. **Grid Engine fertig bauen** ← jetzt, kein Kompromiss
2. **Visual Overhaul** — komplette Layout-Neugestaltung. Visuelle Kacheln statt Textwände, professionelles Look & Feel. Design-Spec liegt bereit in `design-spec/DESIGN_SPEC.md` mit CSS-Dateien, Typographie, Farbsystem, Layout-Strukturen.
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
| `design-spec/DESIGN_SPEC.md` | Visual Overhaul Spec: CSS, Layout, Typographie, Farbsystem |
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
