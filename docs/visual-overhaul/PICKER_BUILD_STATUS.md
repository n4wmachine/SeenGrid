# Picker-Bau Status — Grid Creator Picker

**Stand:** 2026-04-18
**Branch:** `claude/seengrid-visual-overhaul-6RK4n`
**Vorgänger:** PICKER_SPEC_V1.md (Bauanleitung), HANDOFF_PICKER_TO_CODE.md (Übergabe)

---

## Wo stehen wir

**Picker-Bau abgeschlossen.** Der Grid Creator hat jetzt eine eigene Full-Page hinter dem Rail-Item "Grid" — Picker → Workspace-State-Switch funktioniert, Workspace selbst ist Placeholder bis die Workspace-Phase dran ist. Landing CONTINUE-Band ist auf Single-Row + Horizontal-Scroll umgebaut, `[+ neu]`-Slot ganz vorne, zuletzt-bearbeitet zuerst.

---

## Was gebaut wurde

### Neue Daten / Store

- `src/config/cases.config.json` — 10 Base Cases (id, displayName, category, panelCount, defaultRoles, description, keywords, thumbPattern) + Filter-Kategorien. Datengetrieben → neuer Case = JSON-Eintrag, kein Code-Change.
- `src/lib/presetStore.js` — Stub-Store, `useGridPresets()` gibt leeres Array. Dokumentiertes Preset-Interface (PRODUCT_STRATEGY §1.1 + §2.2). Persistenter Store kommt in Workspace-Phase.

### Grid Creator

- `src/components/gridcreator/GridCreator.jsx` — Parent mit `mode: 'picker' | 'workspace'` State. Setzt PageMeta-Subtitle je nach Mode ("choose a template to begin" / "workspace · placeholder").
- `src/components/gridcreator/WorkspacePlaceholder.jsx` + CSS — Stub. Zeigt die Auswahl (kind + label) + "← back to picker"-Button. Kein Grid-UI.

### Picker

- `src/components/gridcreator/picker/Picker.jsx` — Full-Page: Suche + Filter-Pills + drei Sektionen (YOUR PRESETS adaptiv, CORE TEMPLATES, START FROM SCRATCH).
- `src/components/gridcreator/picker/Picker.module.css` — Brand-konform (Teal universell, Gold nur auf YOUR PRESETS + Section-Star). Specificity-Pattern `:global(.sg2-shell) .xyz` konsequent für alle padding/margin-Regeln.
- `src/components/gridcreator/picker/ThumbPattern.jsx` + CSS — abstrakte Grid-Layout-Vorschauen, austauschbar per `thumbPattern`-Key in `cases.config.json`. Patterns: grid-4x1-figures, grid-3x2-faces, grid-2x2-world, grid-2x2-framing, grid-4x1-story, split-ref-master, split-start-end, world-zones. Fallback auf 2x2 für neue Patterns.

### Landing CONTINUE-Band

- `src/components/landing/LandingPage.jsx` — CONTINUE zeigt jetzt Projekte (nicht lose Assets, PRODUCT_STRATEGY §5.3). Dummy-Liste `CONTINUE_PROJECTS` als Placeholder bis Projekt-Store gebaut ist. Sortierung by `modifiedAt` desc. Band wird komplett weggelassen wenn `projects.length === 0` (Adaptivität).
- `src/components/landing/LandingPage.module.css` — `.continueGrid` (grid auto-fit) entfernt, ersetzt durch `.continueRow` (flex-row nowrap + horizontal-scroll + scroll-snap). Custom Scrollbar-Styling. Neue Klassen: `.newProjectCard`, `.continueCard`.

### Routing

- `src/App.jsx` — `GridCreator` import (eager, Haupt-Page). Legacy-`GridOperator` und `grid`-Tab aus dem Tab-Header entfernt. `grid` aus `PAGE_TO_TAB` raus → Rail-Klick auf Grid rendert direkt den neuen GridCreator. Default `activePage` von `lab` auf `home` gewechselt (User landet auf Landing, nicht im Legacy-PromptBuilder).
- `src/components/GridOperator.jsx` + CSS gelöscht — war Legacy-Platzhalter, laut Jonas raus.

---

## Sektions-Verhalten (Picker)

| Zustand | Verhalten |
|---|---|
| User hat keine Presets | YOUR PRESETS-Sektion komplett weg. Picker startet mit CORE TEMPLATES. |
| Suche ohne Treffer | "no templates match 'xyz'" + [clear search]. Scratch + CORE + YOUR werden ausgeblendet, Scratch kommt zurück sobald gecleared. |
| Filter-Pill aktiv, keine Cores passen | "no core templates in this category" (Mono-Zeile), Label bleibt. |
| Klick auf Core | State-Switch → Workspace-Placeholder mit `{kind:'core', caseId, label, panelCount, defaultRoles}`. |
| Klick auf Preset | `{kind:'preset', presetId, caseId, label}`. |
| Klick auf Scratch | `{kind:'scratch', label:'empty grid'}`. |
| Klick auf "more in Prompt Hub →" | `{kind:'hub-link', ...}` — geht vorerst an den gleichen Placeholder, echte Hub-Page ist offen (OPEN_DECISIONS #8). |

---

## Suche

Durchsucht pro Case: `displayName`, `id` (underscores → spaces), `category`, `description`, `keywords`, `defaultRoles`. Für Presets zusätzlich über den verknüpften Case mit allen dessen Feldern — so findet "emotion" → `expression_sheet` (Keyword "emotion") und "noir" → ein Preset namens "Noir Tokio Sheet".

---

## Gold/Teal-Systematik (NUANCEN 1)

- **Gold:** YOUR PRESETS Section-Label + Star, YOUR-PRESET-Card-Border, Signature-Badge auf Preset-Cards, REF-Label im Normalizer-Thumb.
- **Teal:** alle universellen Akzente (Suche-Focus, aktive Filter-Pill, Scratch-Card-Akzente, Start-End-Pfeil im Thumb, Hover-Border auf CORE-Cards, Workspace-Placeholder Mono-Label).
- **Neutral:** CORE-Cards, CORE-Section-Label — kein Gold (Anti-Drift NUANCEN 1).

---

## Datengetriebene Erweiterbarkeit

- **Neuer Case:** Eintrag in `cases.config.json` reicht. Thumbnail: bestehendes `thumbPattern` verwenden oder neues Pattern in `ThumbPattern.jsx` (ein Case im Switch).
- **Neue Filter-Kategorie:** `filterCategories` in `cases.config.json` erweitern, `category` in einzelnen Cases setzen. Kein Code-Change am Picker nötig.
- **Optionaler Use-Case-Hinweis auf Cards:** nicht aktiviert in v1 (laut PICKER_SPEC §4.4 als Flag vorgesehen). Kann später per `useCaseHint`-Feld in `cases.config.json` + Sub-Line-Rendering nachgezogen werden.

---

## Was NICHT gebaut wurde (bewusst, eigene Phasen)

- Workspace-Aufbau (3-Spalten, Preview-Strip, Signatures-Bar) — Workspace-Phase.
- Save-as-Preset-Popup — kommt mit Workspace.
- Klassisch "more in Prompt Hub" → echte Hub-Page — Hub-Phase + OPEN_DECISIONS #8.
- Classics — gehören nicht zum Picker (entschieden in OPEN_DECISIONS #1, wandern in den Hub).
- Keyboard-Navigation (Arrow-Keys, Enter) — PICKER_SPEC §10 Mikro-Punkt 4, offen.
- Persistenter Preset-Store — Stub reicht bis Workspace-Phase den Save-Flow bringt.
- Token-/Signature-Store Stufe 1 — eigene Phase. Picker rendert Signature-Badge nur wenn Preset-Interface `signatureId` hat.

---

## Definition-of-Done-Check (aus HANDOFF_PICKER_TO_CODE §7)

1. Picker-Page rendert mit drei Sektionen (oder zweien wenn Preset-Store leer) ✅
2. Suche filtert live über Titel + Case-Typ + Sub-Line + Case-Description (inkl. keywords) ✅
3. Filter-Pills funktionieren, AND-kombinierbar mit Suche ✅
4. Leerzustand bei Suche ohne Treffer korrekt (inkl. clear-Button) ✅
5. Card-Hover + Card-Klick → State-Switch zu Workspace-Placeholder ✅
6. YOUR PRESETS adaptiv weg wenn Store leer ✅
7. CONTINUE auf Landing: horizontal scrollbar, `[+ neu]` vorne, zuletzt-bearbeitet zuerst ✅
8. Brand-Sprache klar (Teal/Gold systematisch), Specificity-Pattern konsequent ✅
9. Keine Regression in Shell, Rail, Header, StatusBar, Landing (außer CONTINUE) ✅
10. Grid Engine (Slices 1-8, 42 Tests) grün und unberührt ✅ (42 pass via `node --test`)

---

## Bekannte kleine Punkte (nicht blockierend)

- "more templates in Prompt Hub →" Wortlaut ist Platzhalter (PICKER_SPEC §4.3, §10.1). Finales Wording offen.
- CONTINUE-Dummy-Projekte bleiben als Placeholder bis Projekt-Store gebaut wird. Leer-Array-Zustand = Band adaptiv weg (testbar durch Setzen des Arrays auf `[]`).
- `activePage`-Default auf `home` (vorher `lab`). Falls das stört, leicht in `App.jsx` zurück auf `lab`.

---

## Offene Entscheidungen (relevant für die nächste Phase)

Siehe `OPEN_DECISIONS.md` — besonders #2 (Hero-Verhalten Landing), #5 (LIB-Tab), #7 (Projekt-Wechsel-UI), #8 (Hub-Customization).

---

## Git-Stand am Ende des Picker-Baus

- **Branch:** `claude/seengrid-visual-overhaul-6RK4n`
- Commits siehe `git log`.
- Working tree clean nach Commit.
