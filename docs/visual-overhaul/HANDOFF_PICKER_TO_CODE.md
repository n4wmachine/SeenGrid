# Übergabe: Picker-Planung → Picker-Code-Chat

**Datum:** 2026-04-18
**Vorgänger:** Picker-Planungs-Session (Opus 4.7, read-only)
**Nachfolger:** Picker-Code-Chat (baut den Grid Creator Picker)
**Status:** Planung abgeschlossen. Bau kann starten.
**Arbeits-Branch:** `claude/seengrid-visual-overhaul-6RK4n`

---

## 1. Was gebaut wird

**Scope eng:** Grid Creator Picker (Einstiegs-State des Grid Creators) + CONTINUE-Band-Adaption auf der Landing. Nichts anderes.

**Nicht Scope:**
- Workspace-State des Grid Creators (eigene Phase)
- Save-as-Preset-Popup (kommt mit Workspace)
- LIB-Tab (eigene Phase)
- Hub-Inhalte / Classics-Migration ins Hub (eigene Phase)
- Brand/Typo/Farben neu verhandeln (final in PHASE1_STATUS)

---

## 2. Pflicht-Lektüre (in dieser Reihenfolge)

1. `docs/visual-overhaul/PICKER_SPEC_V1.md` — **primäre Quelle**, die Picker-Bauanleitung
2. `docs/visual-overhaul/OPEN_DECISIONS.md` — offene + entschiedene Punkte
3. `docs/visual-overhaul/PRODUCT_STRATEGY_V1.md` — Datenmodell (Grid-Preset-Entity §1.1, §2.2)
4. `docs/visual-overhaul/PHASE1_STATUS.md` — Brand-Stand (Typo, Farben, Specificity-Pattern)
5. `docs/visual-overhaul/NUANCEN.md` — Anti-Drift (besonders Punkte 1, 6, 10)
6. `docs/visual-overhaul/SEENGRID_VISUAL_OVERHAUL_HANDOFF_v2.md` Abschnitt 10.1 — **historische Referenz**, durch PICKER_SPEC_V1 überschrieben. Nur zum Nachlesen falls Detail-Werte (Padding, Radius) fehlen.
7. `MODULE_AND_CASE_CATALOG.md` (Repo-Root, nicht unter docs/) — die 10 Cases + deren Beschreibungs-Texte (für Suche relevant)
8. Dieses Dokument

---

## 3. Was im Code bereits existiert (Stand 2026-04-18)

**Funktional:**
- Shell: Rail + Header + StatusBar + ComingSoon (siehe PHASE1_STATUS "Fertig")
- Landing-Page mit drei Bändern (CONTINUE, QUICK START, DISCOVER) + Hero
- Tooltip-System (RichTooltip)
- Routing (useState-basiert, kein React-Router)
- Context: PageMetaContext
- Tokens: `src/styles/tokens.css` mit `--sg2-*` Prefix
- Globals: `src/styles/globals.css` mit General Sans @font-face, Scrollbars, Specificity-Pattern
- Grid Engine (Slices 1-8, 42 Tests) — **bleibt unberührt**

**Noch nicht gebaut (Code-Chat-Aufgabe):**
- Grid-Preset-Datenmodell + Store-Slice (Minimal-Stub reicht — kann leere Liste sein, damit YOUR PRESETS-Sektion adaptiv ausgeblendet wird)
- Grid Creator Parent-Komponente mit Picker/Workspace-State-Switch
- Picker-Komponente selbst
- CONTINUE-Band-Adaption auf Landing (aktuell: `grid auto-fit`, Ziel: `flex-row nowrap` + Horizontal-Scroll)

**Token/Signature-Store:** Stufe 1 (SeenLab schreibt, Grid Creator liest) ist laut v2-Handoff §8.2 in diesem Visual-Overhaul geplant, existiert aber noch nicht als persistenter Store. Für den Picker **reicht ein Stub**: Signature-Badge auf YOUR-PRESETS-Cards kann in v1 mit Dummy-Daten oder leer rendern, solange das Interface (ID-Referenz) sauber ist.

---

## 4. Konkrete Bau-Schritte (Empfehlung, nicht bindend)

1. **Datenmodell-Stubs anlegen** — `gridPreset`-Interface gemäß PRODUCT_STRATEGY §1.1 + Store-Slice (leeres Array als Default)
2. **Grid Creator Parent** — `GridCreator.jsx` mit State `mode: 'picker' | 'workspace'`. Workspace-State darf ein einfacher Placeholder sein ("Workspace — coming next phase") solange der State-Switch funktioniert.
3. **Picker-Komponente** mit Sektionen gemäß PICKER_SPEC §1-§5
4. **Card-Komponenten** (CORE, YOUR PRESETS, SCRATCH) gemäß PICKER_SPEC §3-§5
5. **Suche + Filter-Pills** gemäß PICKER_SPEC §2
6. **Leerzustände** gemäß PICKER_SPEC §8
7. **Thumbnail-Pattern** für CORE-Cards — abstrakte Grid-Layout-Vorschauen. v2-Handoff §23.2 hat Mockup-Referenz-Code, falls Jonas die Mockup-HTML bereitstellt
8. **CONTINUE-Band-Adaption** — aktuelles Grid-Layout auf Horizontal-Scroll umbauen, `[+ neu]`-Slot ganz vorne, custom Scrollbar gemäß globals.css-Pattern
9. **Rail-Navigation checken** — Grid-Rail-Item führt weiterhin zum Grid Creator (Picker-State als Default)

---

## 5. Daten-Quellen für Inhalte

**CORE TEMPLATES:** Die 10 Cases aus `MODULE_AND_CASE_CATALOG.md` §"Die 10 Base Cases". Für jedes Case:
- Display-Name (in natürlicher Sprache)
- Case-ID (intern)
- Default-Panel-Zahl + Default-Rollen (für Sub-Line)
- Kurze Beschreibung (für Suche-Index)
- Kategorie (`character`, `world`, `sequence`) für Filter-Pills

Strukturieren als JSON unter `src/config/cases.config.json` oder ähnlich — damit später Cases austauschbar sind ohne Code-Änderung (CLAUDE.md Regel: "Erweiterbarkeit ist Pflicht").

**YOUR PRESETS:** aus Preset-Store (v1 leer — Sektion dann adaptiv weg)

**Filter-Pill-Kategorien:** `all · character · world · sequence` — Mapping zu Cases über ein `category`-Feld in der Case-Config

---

## 6. Anti-Drift für Code-Chat

- **PICKER_SPEC_V1 gewinnt** über v2-Handoff §10.1 bei Konflikt
- **PHASE1_STATUS gewinnt** bei Typo/Farb-Konflikten mit v2-Handoff §7
- **Workspace nicht anfangen** — auch nicht "nur schon mal das Gerüst". Ist eigene Phase.
- **Save-Popup nicht einbauen** — kommt mit Workspace
- **Gold nur für Signatures + User-persönlich** (NUANCEN 1). YOUR PRESETS = Gold, CORE TEMPLATES = neutral, CLASSICS kommen gar nicht vor
- **Specificity-Pattern beachten:** `:global(.sg2-shell) .xyz` für alle padding/margin-setzenden Regeln (PHASE1_STATUS "Etablierte Konventionen")
- **Komplette Files an Jonas liefern**, keine Diffs (v2-Handoff §1.2)
- Bei neuen Produkt-Ideen während des Baus: in `OPEN_DECISIONS.md` eintragen (über Jonas), nicht spontan integrieren

---

## 7. Definition of Done

1. Picker-Page rendert mit drei Sektionen (oder zweien wenn User keine Presets hat)
2. Suche filtert live über Titel + Case-Typ + Sub-Line + Case-Description (aus Catalog)
3. Filter-Pills funktionieren, Pills + Suche AND-kombinierbar
4. Leerzustand bei Suche ohne Treffer wird korrekt angezeigt
5. Card-Hover + Card-Klick funktionieren (Klick → State-Switch zu Workspace-Placeholder)
6. YOUR-PRESETS-Sektion ist **adaptiv** (Sektion-Label + Cards verschwinden komplett wenn Store leer)
7. CONTINUE-Band auf Landing: horizontal scrollbar, `[+ neu]` ganz vorne, zuletzt-bearbeitet zuerst
8. Mockup-HTML (Jonas liefert bei Bedarf) als visuelle Referenz angeglichen — v1 muss nicht pixelperfekt sein, aber klar in der Brand-Sprache
9. Keine Regression in Shell, Rail, Header, StatusBar, Landing (außer CONTINUE-Band-Adaption)
10. Grid Engine (Slices 1-8, 42 Tests) bleibt grün und unberührt

---

## 8. Nach dem Bau

- ROADMAP aktualisieren: Picker-Bau `[→]` → `[✓]`, nächste Phase `[→]`
- STARTPROMPT überschreiben für nächsten Chat (entweder Workspace-Planung oder Token-Store-Stufe-1-Bau — Reihenfolge entscheidet Jonas)
- Status-Doc analog PHASE1_STATUS für diesen Build-Schritt anlegen oder ergänzen

---

## 9. Jonas-Profil (Kurz)

- Solo AI-Filmmaker, Nicht-Coder, Deutsch
- Direkte Kommunikation, brutal ehrlich, **keine Sycophancy**
- Kurze präzise Antworten, kein Coding-Jargon
- Nach langen Sessions kognitiv müde — **simpel halten**
- Kann visuell sehr gut beurteilen ob etwas falsch wirkt
- **Code-Übergabe:** komplette Files, keine Diffs, ein File pro Antwort bevorzugt (v2-Handoff §1.2)
- **Bei Unklarheit:** Jonas fragen. Nicht raten.
- **Arbeits-Branch:** `claude/seengrid-visual-overhaul-6RK4n` — hier liegt die gesamte committed Arbeit dieser Visual-Overhaul-Phase (Brand-Session, Produkt-Strategie, Picker-Planung, alle Planungs-Docs). **Nicht auf main wechseln.** Die Regel "direkt auf main" aus CLAUDE.md ist überholt — stammt aus der Engine-Phase und wurde mit dem Visual-Overhaul-Branch abgelöst. Bis Jonas explizit mergen/wechseln lässt: alle Commits + Pushes auf diesen Branch. Der Branch-Name ist auch im STARTPROMPT an zwei Stellen eingetragen (Meta-Header + `git checkout`).

---

## 10. Referenz-Quick-Lookup

| Frage | Antwort |
|---|---|
| Picker-Sektionen | YOUR PRESETS / CORE TEMPLATES / START FROM SCRATCH |
| YOUR PRESETS Sektion leer | Sektion komplett weg (adaptiv) |
| Gold-Border auf YOUR PRESETS Cards | Ja |
| Gold-Border auf CORE Cards | Nein, neutral |
| Classics im Picker | Nein — wandern in den Hub (siehe OPEN_DECISIONS #1) |
| CONTINUE-Band-Layout | Single-Row + Horizontal-Scroll (siehe OPEN_DECISIONS #3) |
| Typo Card-Titel | General Sans 13px / 500 |
| Typo Card-Sub-Line | JetBrains Mono 11px |
| Suche durchsucht | Titel + Case-Typ + Sub-Line + Case-Description |
| Filter-Pills | all · character · world · sequence |
| Klick auf Core-Card | Workspace mit Case+Defaults (Workspace darf Placeholder sein) |
| Klick auf YOUR PRESET Card | Workspace mit Preset vorgeladen |
| Klick auf Scratch-Card | Workspace, Case-Dropdown offen, Rest leer |
| Klick auf "more in Prompt Hub →" | Hub-Page (Placeholder bis Hub gebaut) |

---

**Ende HANDOFF_PICKER_TO_CODE.**
