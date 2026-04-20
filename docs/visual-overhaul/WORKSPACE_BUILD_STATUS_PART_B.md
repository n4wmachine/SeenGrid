# Workspace-Bau Status — Part B: Layout + 3 Spalten

**Stand:** 2026-04-20
**Branch:** `claude/seengrid-visual-overhaul-6RK4n`
**Vorgänger:** WORKSPACE_BUILD_STATUS_PART_A.md, WORKSPACE_SPEC_V1.md
**Nachfolger:** WORKSPACE_BUILD_STATUS_PART_C.md (Part C schreibt das)

---

## Wo stehen wir

**Part B abgeschlossen.** Die Workspace-Komponente selbst + die drei Spalten (Case Context, Canvas, Inspector) liegen. GridCreator schaltet bei `mode === 'workspace'` auf die echte `Workspace`-Komponente (WorkspaceStoreProvider + WorkspaceHeaderProvider sind verdrahtet). `WorkspacePlaceholder` ist gelöscht. Build grün (`npm run build` ✓ 1.63s).

Toolbar / Preview-Strip / Signatures-Bar / Output-Bar sind als **Platzhalter-Divs** mit korrekter Höhe + Border angelegt — Inhalt kommt in Part C.

---

## Was gebaut wurde

### Stufe 4 — Workspace-Parent

- **`src/components/gridcreator/workspace/Workspace.jsx`** + **`Workspace.module.css`** — 6-Zonen-Stack (Toolbar 52 / 3-Spalten flex / Preview 96 / Sigs 52 / Output 32). Höhen aus `tokens.css`. Padding-Regeln via `:global(.sg2-shell)`-Specificity. 3-Spalten-Row: Case Context 260 | Canvas flex | Inspector 320. Preview / Sigs / Output strikt full-width unter der Row (NUANCEN 7).
- **`src/components/gridcreator/GridCreator.jsx`** — komplett umgebaut. `mode === 'workspace'` rendert `WorkspaceHeaderProvider` (onBackToPicker) → `WorkspaceStoreProvider` (initial aus `initialFromSelection(selection)`) → `Workspace`. Picker-Selection wird in initial state übersetzt: caseId + panelCount → rows/cols (Default-Layout pro Count), defaultRoles, activeModules (pre-aktiviert aus `modules.config.json.compatibility`).
- **`src/components/gridcreator/WorkspacePlaceholder.jsx` + `.module.css`** — gelöscht.

### Stufe 5 — Case Context Sidebar (260px)

- **`src/components/gridcreator/workspace/CaseContext.jsx`** + **`CaseContext.module.css`** — alle 6 Sektionen nach WORKSPACE_SPEC §4:
  - **CASE** — Read-only Readout (`caseDef.displayName` lowercase + `caseDef.description` Mono). Kein Edit (§4.2 + §15.3).
  - **REFERENCE STATE** — 2 Radios (`clean_full_body` / `needs_normalization`). Nur sichtbar wenn `caseDef.category === 'character'`.
  - **DIMENSIONS** — 6×4 Klick-Matrix mit Google-Docs-Hover-Highlight (alle Zellen `[1..hover.c][1..hover.r]` werden getintet). Display-Line oben `{cols} × {rows} · {total} panels`. Dim-Advisory darunter 2 Zeilen (@2K + @4K) mit Pixel-Werten und Quality-Tag, Farb-Code nach §12.3 (HIRES=teal, STANDARD=neutral, LOW/TINY=warning amber). Case-Constraint: `character_angle_study` hat `[3,4,6,8]` → ungültige Zellen disabled mit Tooltip.
  - **PANEL ORIENTATION** — Segmented-Control (vertical / horizontal / square).
  - **FORBIDDEN ELEMENTS** — Chip-List mit Remove-Button (`×`) + `[+ add]` Input + Enter-to-add.
  - **Modul-globale Settings** — datengetrieben aus `modules.config.json` (`hasGlobalSettings === true` + aktiv). `forbidden_elements_user` wird ausgespart (eigene Sektion). v1 voll umgesetzt: `environment_mode` (3 Radios + custom-text textarea), `style_overlay` (Token-Input). Alle anderen (`wardrobe`, `pose_override`, `expression_emotion`, `weather_atmosphere`, `face_reference`, `multi_character`, `object_anchor`) als Mini-Section (Modul-Name + Mono-Hint `global settings · part c`).

### Stufe 6 — Canvas (Mitte, flex)

- **`src/components/gridcreator/workspace/Canvas.jsx`** + **`Canvas.module.css`** — zentrierte SVG-Panel-Darstellung. Panel-Größe berechnet live via `ResizeObserver` basierend auf Canvas-Innenmaß, `gridDims`, `panelOrientation` (aspect ratios: vertical 2:3, horizontal 3:2, square 1:1). 12px Gap, 28px Padding (NUANCEN 13).
- Silhouette-Paths aus der bestehenden Slice-6-Source (`CustomBuilderPoc.jsx`) übernommen — 8 Views für `character_angle_study`. Cases ohne Silhouette → Dashed-Rectangle-Fallback.
- State-Visuals nach §5.3 + NUANCEN 2:
  - Default: neutrale Border + Silhouette tertiary.
  - Hover: Teal-Subtle-Outline (via `:hover`).
  - Selected: Teal-Strong-Border + Teal-Glow.
  - Signature-Applied: Gold-Border-Tint + Gold-Glow ums ganze Panel.
  - Selected + Signature-Applied: Teal-Border gewinnt, Gold-Glow bleibt sichtbar (NUANCEN 2 §14.3).
  - Override-Dot (8×8px Gold) oben rechts — triggert wenn `panel.role !== strategyDefault` (und Role ist nicht null) ODER `overrides` hat Keys ODER `customNotes` nicht leer ODER `signatureId` gesetzt.
- Klick auf Panel → `actions.selectPanel(panelId)`. Klick auf Canvas-Leerraum → `actions.selectPanel(null)`. Auto-Select von Panel 1 kommt aus `createInitialState` (Part A).

### Stufe 7 — Inspector (320px, rechts)

- **`src/components/gridcreator/workspace/Inspector.jsx`** + **`Inspector.module.css`** + **`FieldRenderer.jsx`** — alle Sektionen nach WORKSPACE_SPEC §6:
  - **Header:** `PANEL N` + optional Rollen-Hint als zweite Zeile + `×`-Close-Button rechts (→ `selectPanel(null)`).
  - **ROLE:** Dropdown mit Schema-Optionen. Override-Badge `overriding global` + `↶`-Reset wenn `panel.role !== strategyDefault`. v1-Schema: `character_angle_study` hat alle 8 Views, andere Cases nutzen `defaultRoles` als Options-Pool (pragmatisch bis echte `panel_fields`-Schemas ausgebaut sind — TODO-Marker pro Case).
  - **Per-Panel-Overrides:** Iteriert aktive Module mit `hasPerPanelSettings === true`. v1: generic Text-Input pro Modul, Wert aus `panel.overrides[moduleId]`. Override-Badge + `↶`-Reset wenn gesetzt.
  - **SIGNATURE:** Gold-Border-Card wenn `panel.signatureId`. Liest Dummy aus `signatures.stub.json` (Name, Swatch-Farbe, Tagline). Body-Klick hat `TODO(looklab-jump)`-Marker. `detach`-Link.
  - **CUSTOM NOTES:** Textarea pro Panel.
  - **Reset-Footer:** `[ reset panel to case-default ]` → `actions.resetPanel(panelId)`.
  - **Empty-State** wenn `selectedPanelId === null`: `no panel selected — click a panel to edit` (Mono, zentriert).
- **`FieldRenderer.jsx`** — generischer Renderer für 4 Field-Types (`role`, `select`, `text`, `textarea`) nach WORKSPACE_SPEC §13.1. Architektur-Klausel §13 eingehalten: keine case-spezifische Inspector-Logik, alles fährt über Schema + aktive Module.

---

## Entscheidungen / Pragmata

### FROM SCRATCH disabled (OPEN_DECISIONS #11)

FROM SCRATCH wird in v1 **nicht** ausgeliefert. Die Engine ist case-gebunden — echtes "from scratch" braucht einen Engine-Free-Mode, der Post-v1 geplant ist. Der Picker-Card wurde auf `disabled` + `coming soon`-Mono-Label umgebaut (`Picker.jsx` + `Picker.module.css`). Kein Fallback-Mapping nötig. Begründung in OPEN_DECISIONS #11 dokumentiert.

### YOUR PRESETS lädt v1 nur Case-Grundlage

v1 lädt bei `kind === 'preset'` nur den `caseId` aus dem Preset-Objekt. Panel-Inhalte, Module-States, Forbiddens, Signatures werden **nicht** hydriert. Volle Preset-Hydration kommt mit Token-Store Stufe 2. Marker `TODO(preset-hydration)` in `GridCreator.jsx`.

### Panel-Fields-Schemas v1

v1 hat nur **`character_angle_study`** ein echtes Panel-Fields-Schema (eingetragen im Inspector als `PANEL_FIELDS_BY_CASE`). Alle anderen 9 Cases nutzen den Fallback: Role-Dropdown aus `cases.config.json.defaultRoles` + Custom-Notes. Pro Case ein `TODO(panel-fields-schema-{caseId})`-Marker im Inspector-Code. Echte Schema-Auslagerung unter `src/lib/cases/{caseId}/schema.js` ist Post-v1-Erweiterung.

### Override-Dot-Trigger

Dot zeigt bei irgendeinem dieser Zustände (NUANCEN 2 + Scope-Text):
- `panel.role !== strategyDefault` (und role ≠ null)
- `Object.keys(panel.overrides).length > 0`
- `panel.customNotes.trim() !== ''`
- `panel.signatureId !== null`

Bei gesetzter Signature koexistieren Gold-Dot **und** Gold-Border-Tint — explizit so gewollt (NUANCEN 2: beide Signale sind unabhängige States und dürfen an demselben Panel zusammen erscheinen).

---

## Verifikation

### Automatisch (Build + Transform)

- **`npm run build`** läuft sauber durch (1.63s, keine Errors, keine Warnings zur neuen Codebase).
- **Vite dev-server** (`npm run dev`) startet auf :5173, alle 4 neuen Workspace-Files (`Workspace.jsx`, `Canvas.jsx`, `CaseContext.jsx`, `Inspector.jsx`) transformieren ohne Real-Error.

### Manuell-interaktiv (offen — braucht Jonas)

Part B konnte im Claude-CLI-Environment **keine echten Browser-Interaktionen** testen. Jonas muss folgende Stichproben nach dem Push im Browser durchklicken:

1. Picker → Klick auf CORE TEMPLATE `character angle study` → Workspace öffnet, 4 Panels rendern als vertikale Silhouetten, Panel 1 ist Teal-selected, Inspector zeigt `PANEL 1 · front`.
2. Dim-Matrix: Hover über (3, 2) → alle Zellen `[1..3][1..2]` werden getintet. Klick auf (3, 2) → Grid springt auf 3×2, Panel-Count = 6. Für angle_study: (2, 2) disabled (4 Panels OK, aber 2×2=4 ist OK, anderer Fall: (2, 3) sollte 6 Panels ergeben ✓).
3. Panel-Orientation-Segmented: Klick auf `horizontal` → Panels drehen im Canvas live.
4. Panel-Klick → Teal-Border, Inspector-Header zeigt neue Panel-Nummer + Rolle.
5. Klick in Canvas-Leerraum → Deselect, Inspector zeigt Empty-State.
6. Inspector-Close-Button (×) → Deselect.
7. Inspector-Role-Dropdown: andere Rolle wählen → Override-Badge erscheint, Override-Dot am Panel im Canvas erscheint.
8. Back-to-Picker über den ShellHeader-Link → zurück zum Picker, Workspace-State wird verworfen (bewusst v1, session nur so lange Workspace lebt).
9. YOUR PRESETS leer (Stub noch leer) → Workspace-Flow via CORE-Template.
10. FROM SCRATCH: Card ist dashed + getintet + `coming soon`, kein Klick möglich.
11. Forbidden Elements: Text eingeben + Enter → Chip erscheint. Klick auf `×` am Chip → Chip weg.

---

## Anschluss-Punkte für Part C

### Bars füllen (Platzhalter-Divs existieren)

Teil C ersetzt die 4 Bar-Placeholder in `Workspace.jsx` durch echte Komponenten. Die CSS-Zonen sind bereits angelegt:

- `.toolbar` — Module-Toolbar (Chips für alle Module aus `modules.config.json`, Random + Reset rechts mit Confirm-Dialog)
- `.previewStrip` — Panel-Thumbs mit `useOverflowDetection`, Klick → `selectPanel`
- `.sigsBar` — Gold-Label `SIGNATURES` + Applied-Card + Pinned + Recent (aus `signatures.stub.json`)
- `.outputBar` — Copy + Save-Buttons + Token-Count + Dim-Warning (`isWarningQuality(advice.quality)` aus `dimAdvisory.js`)

### ToastProvider in `App.jsx`

Part A hat `ToastProvider` + `useToast()` bereit, aber nicht eingebunden. Part C setzt `<ToastProvider>` um die Workspace-Page (oder App-weit in `App.jsx`).

### Save-as-Preset-Popup

Part C baut das Modal (Spec §10). `ConfirmDialog` + Toast sind in `src/components/ui/` vorhanden.

### presetStore-Erweiterung

Part A hat `presetStore.js` Stub belassen. Part C erweitert um echtes `addPreset()` + reactive `useGridPresets()`.

### TODO(preset-hydration) einlösen

Wenn Part C in Save-Popup einen Preset speichert, sollte der Preset die volle Hydration-Payload enthalten (Panel-Inhalte, Module-States). Beim Re-Öffnen in `GridCreator.initialFromSelection` muss die Hydration dann nachgezogen werden. v1-Minimum: nur Case + grid-Dims + activeModules.

---

## Bekannte Bugs für Part C (aus manuellem Test 2026-04-20)

Jonas hat nach dem Commit d95591f manuell im Browser getestet. Folgende
Bugs müssen in Part C **zuerst** behoben werden, bevor die Bars gebaut
werden:

1. **ROLE-Dropdown bei `character_angle_study`** — prüfen ob wirklich
   alle 8 Rollen rendern (`front`, `front_right`, `right_profile`,
   `back_right`, `back`, `back_left`, `left_profile`, `front_left`).
   Falls nicht alle erscheinen: Bug im Inspector-Rendering oder in
   `PANEL_FIELDS_BY_CASE`-Options-Ableitung.
2. **Panel-Content-Field (Fallback-Leak) im Inspector** — bei
   `character_angle_study` (Case *mit* echtem Schema) erscheint
   trotzdem ein zusätzliches Fallback-Feld. Das Fallback-Feld
   (`Custom Notes`-artiger Textarea pro Panel als generischer
   Panel-Content) darf **nur** bei Cases ohne `panel_fields`-Schema
   erscheinen. Fix in Inspector.jsx: Fallback-Pfad strikt an "kein
   Schema für Case vorhanden" koppeln.
3. **SVG-Silhouetten-Rendering** — im Manual-Test nicht sichtbar
   (oder nur bei angle_study sporadisch). Debuggen: sind die Paths
   aus `SILHOUETTE_PATHS` wirklich referenziert, steht der `viewBox`
   korrekt, werden die Panels groß genug berechnet (ResizeObserver-
   Timing)? Cases ohne Silhouette zeigen Dashed-Rectangle-Fallback —
   OK. Problem ist angle_study-spezifisch.
4. **Inspector-Felder haben keine Kurz-Hints/Tooltips** — User weiß
   nicht was in `Custom Notes`, `Panel Content` etc. reingehört. Part
   C ergänzt knappe Mono-Hints (`title`-Attribut oder ein-Zeilen-Hint
   unter dem Label). Wortlaut aus WORKSPACE_SPEC §6 ableiten.

**Behebung zuerst, dann Bar-Bau.** Die Bars haben keinen Sinn wenn
Inspector + Canvas-Basis buggy sind.

---

## Bekannte offene Punkte

- **Workspace-State bei Rail-Wechsel:** Aktuell unmount-et `GridCreator` wenn der User auf eine andere Rail-Page wechselt (App.jsx `{showGridCreator && <GridCreator />}`). Dadurch geht der Workspace-State verloren. WORKSPACE_SPEC §15.1 fordert "Session-weit persistent: User wechselt zu LookLab, kommt zurück, Workspace-State ist noch da". Das braucht eine Provider-Verankerung höher in App.jsx. **Part C entscheidet Architektur** (Option 1: Provider in App.jsx, Option 2: `display: none` statt Unmount).
- **SET_DIMS beim Dim-Wechsel:** Wenn User die Grid-Größe vergrößert, bekommen neue Panels `role: null` (Store erhält vorhandene Panels + füllt mit nulls auf). Canvas zeigt dann Rechteck-Fallback für diese Panels — OK. Aber: der Override-Dot-Check `panel.role !== strategyDefault` wird nur ausgeführt wenn `panel.role !== null` — korrektes Verhalten.
- **Preview-Strip-Empty-State:** Grid kann nicht leer sein (min 1×1), daher praktisch nie relevant.
- **Scratch-Selection-Fallback:** entfällt (FROM SCRATCH disabled, OPEN_DECISIONS #11).
- **ShellHeader-Workspace-Header:** Part A hat UI, aber GridCreator-Verkabelung stand bis jetzt aus. Part B verkabelt in Stufe 4. Back-Button + Projekt-Dropdown sind jetzt live.

---

## TODO-Marker im Code (Part B neu)

| Marker | Wo | Bedeutung |
|---|---|---|
| `TODO(looklab-jump)` | `Inspector.jsx` (Signature-Card Body-Klick) | Signature in LookLab öffnen |
| `TODO(preset-hydration)` | `GridCreator.jsx` (`initialFromSelection`) | v1 lädt nur Case, volle Preset-Payload kommt mit Token-Store Stufe 2 |
| `TODO(panel-fields-schema-{caseId})` | `Inspector.jsx` (PANEL_FIELDS_BY_CASE) | 9 Cases haben v1 kein echtes Schema — Fallback über `defaultRoles`, später Schema-File pro Case |

Part A-Marker bleiben gültig (`TODO(token-store)`, `TODO(projects-store)`, `TODO(workspace-store)`).

---

## Files neu / geändert / gelöscht

**Neu:**
- `src/components/gridcreator/workspace/Workspace.jsx`
- `src/components/gridcreator/workspace/Workspace.module.css`
- `src/components/gridcreator/workspace/Canvas.jsx`
- `src/components/gridcreator/workspace/Canvas.module.css`
- `src/components/gridcreator/workspace/CaseContext.jsx`
- `src/components/gridcreator/workspace/CaseContext.module.css`
- `src/components/gridcreator/workspace/Inspector.jsx`
- `src/components/gridcreator/workspace/Inspector.module.css`
- `src/components/gridcreator/workspace/FieldRenderer.jsx`

**Geändert:**
- `src/components/gridcreator/GridCreator.jsx` (Workspace-Verkabelung, WorkspaceStoreProvider + WorkspaceHeaderProvider)
- `src/components/gridcreator/picker/Picker.jsx` (FROM SCRATCH → disabled + `coming soon`)
- `src/components/gridcreator/picker/Picker.module.css` (Scratch-Disabled-Styles)
- `docs/visual-overhaul/OPEN_DECISIONS.md` (#11 neu)

**Gelöscht:**
- `src/components/gridcreator/WorkspacePlaceholder.jsx`
- `src/components/gridcreator/WorkspacePlaceholder.module.css`

---

**Ende Status Part B.**
