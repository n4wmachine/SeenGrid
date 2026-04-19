# Übergabe: Workspace-Planung → Workspace-Code-Chat

**Datum:** 2026-04-19
**Vorgänger:** Workspace-Planungs-Session (Konzept-Session, read-only)
**Nachfolger:** Workspace-Code-Chat (baut den Grid Creator Workspace)
**Status:** Planung abgeschlossen. Bau kann starten.
**Arbeits-Branch:** `claude/workspace-planning-grid-creator-earBn` (Fortsetzung auf `claude/seengrid-visual-overhaul-6RK4n` nach Merge)

---

## 1. Was gebaut wird

**Scope eng:** Grid Creator Workspace (Edit-State des Grid Creators). Alle Details in `WORKSPACE_SPEC_V1.md`. Keine Experimente, keine Abkürzungen durch Wiederverwendung des alten GridOperator (NUANCEN 8: from scratch).

**Nicht Scope:**
- Picker-State (bereits gebaut, `PICKER_SPEC_V1.md`)
- LookLab-Visual-Update (eigene Phase)
- LIB-Tab (eigene Phase, OPEN_DECISIONS #5)
- Projekt-Overview-Page (OPEN_DECISIONS #4, eigene Phase)
- Hub-Inhalt / Classics-Migration (OPEN_DECISIONS #8, eigene Phase)
- Token-Store Stufe 1 persistenter Build (Signatures-Bar arbeitet in v1 mit Stub, siehe §3 unten)
- Undo/Redo, Autosave, Multi-Select, Drag-Reorder — alle additiv v2

---

## 2. Pflicht-Lektüre (in dieser Reihenfolge)

1. `docs/visual-overhaul/WORKSPACE_SPEC_V1.md` — **primäre Quelle**, die Workspace-Bauanleitung
2. `docs/visual-overhaul/OPEN_DECISIONS.md` — offene + entschiedene Punkte (besonders #4, #5, #7 entschieden, neuer "Workspace Min-Width-Message")
3. `docs/visual-overhaul/PRODUCT_STRATEGY_V1.md` — Datenmodell + Save-Mechanik + §7 Projekt-Kontext
4. `docs/visual-overhaul/NUANCEN.md` — Anti-Drift (besonders 1, 2, 6, 7, 8, 13)
5. `docs/visual-overhaul/PICKER_BUILD_STATUS.md` + `docs/visual-overhaul/PICKER_SPEC_V1.md` — Picker ist bereits gebaut, Workspace hängt am Picker-State-Switch (`GridCreator.jsx`)
6. `docs/visual-overhaul/LANDING_REDESIGN_STATUS.md` — Masthead + Store-Patterns (Continue, `useOverflowDetection`) wiederverwenden
7. `MODULE_AND_CASE_CATALOG.md` (Repo-Root) — 10 Cases + 13 Module + Kompatibilitäts-Matrix
8. `CLAUDE.md` — Engine-Fertigstellungs-Hinweise (Dim Advisory + Panel-Role-Customization)
9. Dieses Dokument

---

## 3. Was im Code bereits existiert

**Funktional (nicht anfassen):**
- Shell: Rail + ShellHeader + StatusBar
- Landing + Masthead + Create / Continue / Classics / Trendy Strips
- Grid Creator Picker (Full-Page)
- Picker → Workspace-State-Switch in `GridCreator.jsx` (State `mode: 'picker' | 'workspace'`)
- `WorkspacePlaceholder.jsx` als aktueller Workspace-Stub (**ersetzen, nicht erweitern**)
- Tokens unter `src/styles/tokens.css` (alle Workspace-Tokens schon da)
- `useOverflowDetection`-Hook unter `src/hooks/useOverflowDetection.js`
- `cases.config.json` unter `src/config/` mit 10 Cases
- `presetStore.js` Stub unter `src/lib/`
- Grid Engine Slices 1-8 unter `src/lib/compiler/` + `src/lib/cases/` (**unberührt**, 42 Tests grün)
- `ThumbPattern.jsx` aus Picker-Bau (wiederverwendbar für Panel-Silhouetten wenn Pattern passt)

**Noch nicht gebaut (Code-Chat-Aufgabe):**
- Workspace-Parent mit 6-Zone-Stack (Header, Toolbar, 3-Col, Preview, Sigs, Output)
- Module-Toolbar-Komponente (alle Module + Case-Whitelist-Pre-Aktivierung)
- Case Context Sidebar (alle 6 Sektionen)
- Canvas-Komponente (SVG-Silhouetten oder wiederverwenden Panel-SVG aus Engine-POC)
- Inspector (datengetrieben aus `panel_fields`-Schema)
- Preview-Strip (full-width, horizontal scroll)
- Signatures-Bar (full-width, horizontal scroll, Gold-Territorium)
- Output-Bar (Copy + Save + Meta)
- Save-as-Preset-Popup (Center-Modal)
- Random-Confirm-Dialog
- Reset-Confirm-Dialog
- Generisches Toast-System (success / error / info, bottom-right, pause-on-hover, max 3)
- Projekt-Dropdown im ShellHeader (inline Dropdown + Footer-Link)
- Back-to-Picker-Element im ShellHeader
- Workspace-State-Store (session-lokal, Grid-State)
- Dim-Advisory-Utility-Funktion (aus Git-History portiert, siehe §4)

---

## 4. Konkrete Bau-Schritte (Empfehlung, nicht bindend)

1. **Git-History-Lookup** — `git show 13ca30f~1:src/components/GridOperator.jsx` extrahieren, `getDimAdvice`-Logik als Utility unter `src/lib/dimAdvisory.js` portieren (Commit-Hash bitte verifizieren — sollte der letzte Commit vor GridOperator-Löschung sein)
2. **Workspace-Parent** — `Workspace.jsx` + `Workspace.module.css` unter `src/components/gridcreator/workspace/`. Ersetzt `WorkspacePlaceholder.jsx` im `GridCreator.jsx`-Mode-Switch
3. **Workspace-State-Store** — `useWorkspaceState.js` (Zustand-Slice oder React Context), Grid-State session-lokal
4. **ShellHeader-Erweiterung** — `← back`, Projekt-Dropdown, Page-Title-Bullet-Trennung
5. **Module-Toolbar** — alle Module aus `MODULE_AND_CASE_CATALOG.md` als Chips, Case-Whitelist pre-aktiviert
6. **Case Context Sidebar** — alle 6 Sektionen, Dim-Matrix mit Hover-Highlight, Dim-Advisory inline
7. **Canvas** — SVG-Grid mit Panel-Silhouetten + State-Visuals (Selected Teal-Border, Override Gold-Dot, Signature Gold-Border-Tint)
8. **Inspector** — datengetrieben aus `panel_fields`-Schema (Generic Field-Renderer pro Type)
9. **Preview-Strip** — full-width, wiederverwende `useOverflowDetection`, scroll-snap-mandatory
10. **Signatures-Bar** — full-width, Gold-Label, Applied-Card fix links, Detach-Button, Empty-State-CTA
11. **Output-Bar** — Copy-Primary Teal, Save-Sekundär neutral, Token-Count + Dim-Warning
12. **Save-Popup** — Center-Modal, 4 Checkboxen, Projekt-Radio-Group, Validation + Error-Line
13. **Random + Reset + Confirm-Dialoge**
14. **Toast-System** — `src/components/ui/Toast.jsx` + `ToastProvider.jsx`, generisch nutzbar
15. **Data-Preparation** — `src/data/random/` Pools pro Field-Type (Legacy konsolidieren, Lücken füllen)

---

## 5. Daten-Quellen

**Cases:** `src/config/cases.config.json` (bereits da, 10 Cases). Schema-Erweiterung für `panel_fields` + `globalOrPanel`-Flags pro Field nötig.

**Module:** aus `MODULE_AND_CASE_CATALOG.md` — 13 Module. JSON-Config `src/config/modules.config.json` anlegen mit: `id`, `displayName`, `category`, `hasGlobalSettings`, `hasPerPanelSettings`, `compatibility` (Case-IDs Array).

**Random-Pools:** `src/data/random/{fieldType}.json` oder `src/data/random/{caseId}.json` — Code-Chat entscheidet Struktur, konsistent mit Engine-Erweiterbarkeits-Regel.

**Signatures (Stub):** bis Token-Store-Stufe-1 gebaut ist, `src/data/signatures.stub.json` mit 3-5 Dummy-Signatures (Name, Swatch-Color, Tagline). Signatures-Bar rendert aus Stub.

**Projects (Stub):** analog `src/data/projects.stub.json` mit den aktuellen Continue-Band-Dummies (Tokio-Kurzfilm, Berlin-Doku, etc.).

**Presets:** `src/lib/presetStore.js` aus Picker-Phase, Save-Flow schreibt rein.

---

## 6. Anti-Drift für Code-Chat

- **WORKSPACE_SPEC_V1 gewinnt** über v2-Handoff §10.2+ bei Konflikt
- **NUANCEN gewinnt** über `mockup_03_gridcreator_workspace.html` bei Konflikt
- **Nichts vom alten GridOperator wiederverwenden außer `getDimAdvice`-Logik** (NUANCEN 8: from scratch)
- **Preview-Strip + Signatures-Bar + Output-Bar strikt full-width** (NUANCEN 7)
- **Gold nur:** Signatures-Bar-Label + Applied-Card + Override-Dots + Inspector-Signature-Card (NUANCEN 1)
- **Override-Dot UND Signature-Border-Tint müssen am selben Panel koexistieren** (NUANCEN 2)
- **Spec nichts erfinden:** Module aus `MODULE_AND_CASE_CATALOG.md`, Cases aus `cases.config.json`
- **Specificity-Pattern** `:global(.sg2-shell) .xyz` für alle padding/margin-Regeln innerhalb Shell (aus PHASE1_STATUS)
- **Keine neuen Tokens** ohne Jonas-OK. Alle Layout-Tokens existieren bereits
- **Grid Engine nicht anfassen** (Slices 1-8, 42 Tests bleiben grün)
- **Keine Autosave-Mechanik, keine localStorage-Persistenz** in v1. Workspace-State = session-lokal only
- **TODO-Marker-Convention** beibehalten (analog Landing):
  - `TODO(looklab-jump)` — Body-Klick auf Applied-Signature-Card
  - `TODO(token-store)` — Signatures-Stub durch echten Store ersetzen (kommt Token-Store-Phase)
  - `TODO(projects-store)` — Projekt-Stub durch echten Store ersetzen
  - `TODO(workspace-store)` — Grid-State-Store wenn persistent werden soll

---

## 7. Definition of Done

Siehe `WORKSPACE_SPEC_V1.md` §22 — 19 Check-Punkte. Zusammengefasst:

- Alle 6 Stack-Zonen rendern korrekt
- Alle Interaktionen aus Spec §5, §6, §7, §8, §9, §10, §11 funktionieren
- State-Signale nach NUANCEN 2 konsistent (Canvas + Preview-Strip)
- Grid Engine grün und unberührt
- Keine Regression in Shell, Rail, Landing, Picker
- Workspace-State session-persistent bei Rail-Wechsel, flüchtig bei Page-Reload
- Toast-System generisch nutzbar für spätere Phasen

---

## 8. Nach dem Bau

- **WORKSPACE_BUILD_STATUS.md** anlegen (analog `PICKER_BUILD_STATUS.md` + `LANDING_REDESIGN_STATUS.md`) — was wurde gebaut, was ist bekannt offen
- **ROADMAP.md** aktualisieren: Workspace-Bau `[→]` → `[✓]`, nächste Phase `[→]`
- **NUANCEN 13** Korrektur committen (PERFECT streichen — ist bereits in diesem Workspace-Planning-Commit enthalten, aber nochmal verifizieren)
- **STARTPROMPT.md** überschreiben für Nachfolger-Chat (Jonas entscheidet Reihenfolge: Token-Store Stufe 1 / LookLab Visual-Update / anderes)

---

## 9. Jonas-Profil (Kurz)

- Solo AI-Filmmaker, Nicht-Coder, Deutsch
- Direkte Kommunikation, brutal ehrlich, **keine Sycophancy**
- Kurze Antworten, kein Coding-Jargon
- Nach langen Sessions kognitiv müde — **simpel halten**
- Kann visuell sehr gut beurteilen
- **Code-Übergabe:** komplette Files, keine Diffs, ein File pro Antwort bevorzugt
- **Bei Unklarheit:** Jonas fragen. Nicht raten.
- **Arbeits-Branch:** `claude/workspace-planning-grid-creator-earBn` (wurde von dieser Planungs-Session initialisiert). Die committed Arbeit der Picker-Phase + Landing-Phase liegt auf `claude/seengrid-visual-overhaul-6RK4n` — Jonas entscheidet ob diese Planungs-Commits dort hin gehen oder der aktive Branch wechselt.
- **CLAUDE.md "direkt auf main" ist überholt** — aus Engine-Phase, nicht auf Visual-Overhaul anwenden

---

## 10. Referenz-Quick-Lookup

| Frage | Antwort |
|---|---|
| Stack-Reihenfolge | Header 56 / Toolbar 52 / 3-Col / Preview 96 / Sigs 52 / Output 32 |
| Back-to-Picker | `← choose another template` im ShellHeader, setzt `mode: 'picker'` |
| Case-Wechsel im Workspace | Nicht möglich — nur via Back-to-Picker |
| Alle Module in Toolbar sichtbar? | Ja. Case-Whitelist = Pre-Aktivierung, nicht Visibility |
| Hart ausgeschlossene Module | `—` in Kompatibilitäts-Matrix, disabled-State mit Tooltip |
| Dim-Advisory Stufen | 4: HIRES / STANDARD / LOW / TINY (uppercase in UI) |
| Dim-Advisory Warn-Schwelle | LOW + TINY warnen in Output-Bar (Amber) |
| Quality-Tag-Source | `git show 13ca30f~1:src/components/GridOperator.jsx` → `getDimAdvice` |
| Random = ? | Field-Auto-Fill aller Panels aus Field-Type-Pools, nicht Role-Shuffle |
| Random-Confirm | Nur bei non-empty Panels, Default-Focus Cancel |
| Override-Dot vs. Signature-Border | Zwei unabhängige Signale, koexistieren (NUANCEN 2) |
| Applied-Signature-Gold | Nur auf Applied-Card in Sigs-Bar + Panel-Border-Tint + Inspector-Signature-Card |
| Sigs-Bar Empty-State | `no signatures yet — create in LookLab →` Ein-Zeiler |
| Multi-Select | Nicht v1 |
| Undo/Redo | Nicht v1 |
| Autosave | Nicht v1 |
| Cmd+C / Cmd+S | Nicht v1 |
| Workspace-State-Persistenz | Session-lokal (Rail-Wechsel harmlos), flüchtig bei Page-Reload |
| Signatures-Store | Stub in v1 (persistent kommt Token-Store Stufe 1) |
| Save-Popup-Typ | Center-Modal mit Overlay, Escape = Cancel |
| Save-Default | Library only |
| Save-Update vs. New | Nur Save-as-New in v1, Update-Flow additiv |
| Responsive Min-Breite | ~1100px brutal, keine Min-Width-Message v1 |
| Toast-Position | Bottom-right, 24px Rand + Output-Bar-Höhe, max 3 gestackt |
| Toast-Border-Tint Farben | Teal success / Amber error / neutral info |

---

**Ende HANDOFF_WORKSPACE_TO_CODE.**
