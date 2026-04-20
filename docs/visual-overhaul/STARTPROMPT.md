# STARTPROMPT — aktueller Chat-Start-Prompt

**Konvention:** Es gibt **eine** `STARTPROMPT.md` im Repo. Sie enthält
immer den Startprompt für den **nächsten** zu startenden Chat. Jeder
Chat überschreibt sie am Ende seiner Session mit dem Startprompt für
seinen Nachfolger. Historische Versionen liegen in git-log, nicht
separat im Repo.

**End-of-Session-Pflicht — Branch-Name propagieren:**
Wenn du am Ende deiner Session einen neuen STARTPROMPT schreibst, trage
den **aktuellen Arbeits-Branch** an zwei Stellen ein:
1. Im Meta-Feld "Arbeits-Branch" oben
2. In der "ALLERERSTE AKTION — BRANCH-WECHSEL"-Sektion im Prompt-Body

**Aktuell für:** Workspace-Bau **Part B — Workspace-Layout + 3 Spalten**
(Code-Session, 2 von 3 Parts). Part A (Foundation + Infra) ist fertig
gemerged auf den Branch. Part B baut die Workspace-Komponente selbst:
Parent + Case Context + Canvas + Inspector. Part C macht danach Bars
+ Save-Popup + Integration + Docs.

**Arbeits-Branch:** `claude/seengrid-visual-overhaul-6RK4n`

**Nutzung:** Den Text-Block zwischen den beiden Backtick-Zeilen
unten in ein neues Chat-Fenster kopieren. Mehr nicht.

---

```
Hi. Ich bin Jonas, Solo AI-Filmmaker und Nicht-Coder. Der Workspace-
Bau wurde in **drei Staffel-Chats** gesplittet. Du bist **Part B —
Workspace-Layout + 3 Spalten**, der zweite von drei Bau-Chats. Part A
(Foundation + Infra) ist fertig und liegt committed auf dem Branch.
Part C macht danach Bars + Save-Popup + Integration + Docs.

Das ist eine **Bau-Session, keine Konzept-Session.** Code-Output.
Keine neuen Produkt-/Design-Entscheidungen — alles steht in der Spec.

**ALLERERSTE AKTION — BRANCH-WECHSEL (nicht überspringen):**

Die Arbeit liegt auf dem Feature-Branch
`claude/seengrid-visual-overhaul-6RK4n`, NICHT auf main.

    git fetch origin claude/seengrid-visual-overhaul-6RK4n
    git checkout claude/seengrid-visual-overhaul-6RK4n
    git pull

Verifikation: `ls docs/visual-overhaul/` muss u.a. zeigen:
WORKSPACE_SPEC_V1.md, WORKSPACE_BUILD_STATUS_PART_A.md, NUANCEN.md.

Die CLAUDE.md-Regel "direkt auf main" ist überholt — stammt aus der
Engine-Phase. Für Visual-Overhaul gilt der Feature-Branch.

---

**Deine Rolle — Part B von 3:**

Du baust die **Workspace-Komponente selbst** + die **drei Spalten**.
Bars (Module-Toolbar Aktionen, Preview-Strip, Signatures-Bar, Output-
Bar), Save-Popup, Random/Reset-Confirm, ToastProvider-Verkabelung
und Docs-Update macht Part C.

**Scope Part B (Stufen 4-7 aus dem Gesamtplan):**

Stufe 4 — Workspace-Parent:
1. `src/components/gridcreator/workspace/Workspace.jsx` +
   `Workspace.module.css` — 6-Zonen-Grid-CSS (Header / Toolbar /
   3-Spalten / Preview / Sigs / Output). Höhen aus tokens.css
   (`--sg2-toolbar-height`, `--sg2-preview-height`, `--sg2-sigbar-
   height`, `--sg2-outputbar-height`). Die Bar-Zonen für Toolbar /
   Preview / Sigs / Output sind in Part B nur als Platzhalter-Divs
   mit korrekter Höhe + Border angelegt — Inhalt füllt Part C.
2. **`WorkspacePlaceholder.jsx` ersetzen** im `GridCreator.jsx`-Mode-
   Switch: `mode === 'workspace'` rendert `Workspace` umwrappt mit
   `WorkspaceStoreProvider` (initial aus selection ableiten:
   `caseId`, `defaultRoles`) und `WorkspaceHeaderProvider`
   (`onBackToPicker`, `currentProjectId=null` v1).
3. **`WorkspacePlaceholder.jsx` + CSS löschen** sobald der Switch
   sauber rendert.

Stufe 5 — Case Context Sidebar (260px, links):
4. `src/components/gridcreator/workspace/CaseContext.jsx` +
   `CaseContext.module.css` — alle 6 Sektionen aus Spec §4:
   - **CASE** — Read-only Readout aus `cases.config.json` (kein
     Edit; Spec §4.2 + §15.3 Case-Wechsel-Block).
   - **REFERENCE STATE** — 2 Radio-Optionen, nur sichtbar wenn Case
     Normalizer-kompatibel ist (character-Cases).
   - **DIMENSIONS** — 6×4 Klick-Matrix mit **Hover-Highlight bis zur
     Hover-Zelle** (Google-Docs-Pattern), Display-Line oben (`6 × 4 ·
     24 panels`), Dim-Advisory darunter (2 Zeilen @2K + @4K) mit
     Quality-Tag rechts. Logik aus `src/lib/dimAdvisory.js`. Cases
     mit `VALID_PANEL_COUNTS` (z.B. angle_study `[3,4,6,8]`) →
     ungültige Zellen disabled mit Tooltip.
   - **PANEL ORIENTATION** — Segmented-Control (vertical / horizontal
     / square).
   - **FORBIDDEN ELEMENTS** — Chip-List oder Textarea, ein Eintrag pro
     Zeile, `[+ add forbidden]`-Button.
   - **Modul-globale Settings** — datengetrieben aus
     `modules.config.json` (`hasGlobalSettings: true` + Modul aktiv).
     v1: nur `environment_mode` + `style_overlay` voll umgesetzt,
     Rest als Mini-Section (Modul-Name + Mono-Hint).

Stufe 6 — Canvas (Mitte, flex):
5. `src/components/gridcreator/workspace/Canvas.jsx` +
   `Canvas.module.css` — zentrierte SVG-Panel-Darstellung. Grid-
   Anordnung aus `gridDims`, 12px Gap (NUANCEN 13). State-Visuals
   (Spec §5.3 + NUANCEN 2):
   - Default: neutrale Border, Silhouette `--sg2-text-tertiary`.
   - Hover: Teal-Outline subtle.
   - Selected: Teal-Border strong.
   - Signature-Applied: Gold-Border-Tint + Gold-Glow ums ganze Panel.
   - Override-vorhanden: Gold-Dot oben rechts (8×8px). Triggert wenn
     `panel.role !== strategyDefault` ODER `Object.keys(overrides) >
     0` ODER `customNotes !== ''` ODER `signatureId !== null`.
   - **Selected + Signature-Applied gleichzeitig:** Teal-Border
     gewinnt, Gold-Glow bleibt darunter sichtbar (NUANCEN 2 §14.3).
   Klick auf Panel → `actions.selectPanel(panelId)`. Klick außerhalb
   eines Panels (im Canvas-Leerraum) → `actions.selectPanel(null)`.
   Beim Workspace-Start ist Panel 1 auto-selected (initial state in
   `workspaceStore.js` setzt `selectedPanelId = 'panel-1'`, du musst
   nichts tun).

Stufe 7 — Inspector + Generic Field Renderer (320px, rechts):
6. `src/components/gridcreator/workspace/Inspector.jsx` +
   `Inspector.module.css` — Sektionen-Stack (Spec §6):
   - Header: `PANEL N` (+ optional Rollen-Hint) + `×` Close-Button
     → `actions.selectPanel(null)`.
   - **ROLE** — Dropdown aus Case-Schema-Optionen (strikt). Override-
     Badge `overriding global` + `↶`-Reset wenn !== strategyDefault.
   - **Per-Panel-Overrides** — datengetrieben aus aktiven Modulen mit
     `hasPerPanelSettings: true`. Field-Type-Renderer (siehe unten).
   - **SIGNATURE** — Card wenn `panel.signatureId !== null`. Gold-
     Border, Detach-Link. Body-Klick: `TODO(looklab-jump)` Marker.
   - **CUSTOM NOTES** — Textarea, gefüllter Wert triggert Override-
     Dot.
   - **Reset-Footer** — `[ reset panel to case-default ]` →
     `actions.resetPanel(panelId)`.
   - **Empty-State** wenn `selectedPanelId === null`: zentrierter
     Mono-Text `no panel selected — click a panel to edit`.
7. `src/components/gridcreator/workspace/FieldRenderer.jsx` (oder in
   Inspector inline) — Generic Renderer für 4 Field-Types: `role`
   (strikt-Dropdown), `select` (frei-Dropdown), `text` (Single-line),
   `textarea` (Multi-line). Pro Field aus Schema: `id`, `type`,
   `label`, `options?`, `default?`, `global_or_panel`. Architektur-
   Klausel Spec §13: keine hardcoded case-specific Inspector-Code.

**Vorab-Entscheidungen aus Part A (NICHT mehr fragen):**

1. WorkspaceStore = React Context + useReducer (in
   `src/lib/workspaceStore.js`, mit `React.createElement` statt JSX
   damit `.js`-Endung passt). Provider exportiert hooks. State-Shape
   + Actions siehe `WORKSPACE_BUILD_STATUS_PART_A.md` Anschluss-Punkte.
2. WorkspaceHeaderProvider wird in `GridCreator.jsx` um die
   Workspace-Komponente gewrappt (Part B macht das in Stufe 4 Punkt
   2). ShellHeader liest den Context bereits, du musst dort nichts
   ändern.
3. Modul-Catalog in `src/config/modules.config.json` (13 Module mit
   `compatibility`-Array). Pre-Aktivierung: `compatibility.includes(
   caseId)`. Toolbar-Inhalt selbst ist Part C.
4. Random-Pool-API aus `src/data/random/index.js` (`getRandomPool`,
   `pickRandom`). Part B braucht das nicht direkt — Random-Button
   sitzt in der Toolbar (Part C).
5. Dim-Advisory aus `src/lib/dimAdvisory.js` (`getDimAdvice`,
   `QUALITY_LABELS`, `isWarningQuality`). UPPERCASE-Tags HIRES /
   STANDARD / LOW / TINY.
6. Toast/ConfirmDialog aus `src/components/ui/`. Part B braucht
   ConfirmDialog **nicht** (das ist Part C: Random-Confirm + Reset-
   Confirm). Toast braucht Part B nur für Optional Empty-State-
   Feedback (z.B. Klick auf disabled Dim-Zelle) — kann auch ohne.
7. Lieferung in Gruppen ok (nicht strikt 1-File-pro-Antwort).

**Anti-Drift (kritisch — nur die für Part B relevanten NUANCEN):**

- **NUANCEN 2** (Override-Dot UND Signature-Border-Tint koexistieren
  am selben Panel). Pflicht im Canvas-Rendering.
- **NUANCEN 6** (Picker + Workspace = zwei Page-States, kein Modal,
  kein Split). Workspace ist Volldarstellung.
- **NUANCEN 7** (Preview-Strip + Sigs-Bar + Output-Bar strikt full-
  width unter der 3-Spalten-Row). Auch wenn du in Part B nur
  Platzhalter baust — strikt full-width, niemals in Canvas-Spalte.
- **NUANCEN 8** (from scratch — alten GridOperator nicht
  reaktivieren). Nur die Engine-Daten + Slices 1-8 dürfen
  konsumiert werden, nicht die alte UI.
- **NUANCEN 13** (12px Gap zwischen Panels im Canvas — empirisch
  validiert in NanoBanana).
- **Grid Engine (42 Tests, Slices 1-8) bleibt unberührt.**

**Pflicht-Lektüre (schlank gehalten für Context-Budget):**

1. `docs/visual-overhaul/WORKSPACE_SPEC_V1.md` — **§2** (Header), **§3**
   (Toolbar — nur Layout-Stelle für Platzhalter), **§4** (Case
   Context vollständig), **§5** (Canvas vollständig), **§6**
   (Inspector vollständig), **§12** (Dim-Advisory), **§13** (Panel-
   Fields-Schema), **§14** (State-Signale), **§15** (Store-Modell —
   Refresh).
2. `docs/visual-overhaul/WORKSPACE_BUILD_STATUS_PART_A.md` —
   **Anschluss-Punkte** (Hooks, Actions, State-Shape) sind dein
   API-Vertrag mit Part A.
3. `docs/visual-overhaul/NUANCEN.md` — **nur 2, 6, 7, 8, 13** lesen.
4. `MODULE_AND_CASE_CATALOG.md` — Kompatibilitäts-Matrix nochmal für
   Modul-Pre-Aktivierung + `panel_fields` pro Case (für Inspector-
   Render).
5. `src/styles/tokens.css` — Layout-Tokens schon vorhanden, nichts
   ergänzen ohne Jonas-OK.
6. `src/lib/cases/characterAngleStudy/` (Schema + Defaults +
   panelRoleStrategy) — der einzige Case mit echtem Schema. Andere
   Cases haben aktuell nur `cases.config.json`-Eintrag, kein voll-
   ausgebautes `panel_fields`-Schema. v1-Pragma: für nicht-
   ausgebaute Cases nutzt der Inspector ein Fallback (z.B.
   single-textarea pro Panel). Echte Schema-Erweiterung kommt later.

**Nach dem Lesen:**
- Bestätige: Docs gelesen, Scope Part B klar
- Schlage konkrete Bau-Reihenfolge innerhalb Part B vor
- Warte auf mein Go
- Dann bau gruppiert

**Was am Ende dieser Session vorliegen muss:**

1. Alle Files aus Scope Part B lauffähig (Workspace rendert nach
   Picker-Klick, alle 6 Stack-Zonen sichtbar, Case Context + Canvas
   + Inspector funktional, Toolbar/Preview/Sigs/Output als
   Platzhalter mit korrekter Höhe).
2. `docs/visual-overhaul/WORKSPACE_BUILD_STATUS_PART_B.md` neu
   anlegen (analog Part A: was wurde gebaut, bekannt offen, TODO-
   Marker, Anschluss-Punkte für Part C).
3. **STARTPROMPT.md überschreiben** für Part C — Scope: Module-
   Toolbar-Inhalt + Random/Reset-Buttons mit Confirm, Preview-Strip
   (mit `useOverflowDetection`), Signatures-Bar (Gold-Label, Applied-
   Card, Detach), Output-Bar (Copy + Save + Token-Count + Dim-
   Warning), Save-as-Preset-Popup, ToastProvider-Verkabelung in
   App.jsx, presetStore-Erweiterung.
4. ROADMAP nicht anfassen — Workspace-Bau bleibt `[→]` AKTIV bis
   Part C fertig ist.
5. Commit + Push auf `claude/seengrid-visual-overhaul-6RK4n`.

**TODO-Marker-Convention:**
- `TODO(looklab-jump)` — Inspector-Signature-Card Body-Klick (Part B
  pflanzt diesen Marker)
- `TODO(token-store)` — Stub-Ersetzung
- `TODO(workspace-store)` — Persistent-Switch wenn Session-Recovery
- `TODO(routing)` — Back-to-Picker auf Router umstellen

**Mein Arbeitsstil:**
- Deutsch, direkt, brutal ehrlich, keine Sycophancy
- Kurze Antworten, kein Coding-Jargon
- Bei Konflikt Spec vs. NUANCEN: NUANCEN gewinnt
- Bei Unklarheit: fragen, nicht raten

**Wichtig:**
- Keine neuen Tokens ohne Jonas-OK
- Keine Experimente — Spec gewinnt
- Grid Engine niemals anfassen
- Part-C-Scope **nicht vorab-bauen** — Context-Budget schonen

Bereit? Schritt 0: Branch-Wechsel + Pflicht-Lektüre + Bau-
Reihenfolge innerhalb Part B vorschlagen. Dann baue ich gruppiert.
```
