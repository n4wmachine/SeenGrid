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

**Aktuell für:** Workspace-Bau **Part C — Bars + Save-Popup +
Integration + Docs** (Code-Session, 3 von 3 Parts). Part A (Foundation
+ Infra) und Part B (Workspace-Parent + 3 Spalten) sind fertig
committed auf dem Branch. Part C schließt den Workspace-Bau ab.

**Arbeits-Branch:** `claude/seengrid-visual-overhaul-6RK4n`

**Nutzung:** Den Text-Block zwischen den beiden Backtick-Zeilen
unten in ein neues Chat-Fenster kopieren. Mehr nicht.

---

```
Hi. Ich bin Jonas, Solo AI-Filmmaker und Nicht-Coder. Der Workspace-
Bau wurde in **drei Staffel-Chats** gesplittet. Du bist **Part C —
Bars + Save-Popup + Integration + Docs**, der letzte von drei Bau-
Chats. Part A (Foundation + Infra) und Part B (Workspace-Layout + 3
Spalten) sind fertig und liegen committed auf dem Branch.

Das ist eine **Bau-Session, keine Konzept-Session.** Code-Output.
Keine neuen Produkt-/Design-Entscheidungen — alles steht in der Spec.

**ALLERERSTE AKTION — BRANCH-WECHSEL (nicht überspringen):**

Die Arbeit liegt auf dem Feature-Branch
`claude/seengrid-visual-overhaul-6RK4n`, NICHT auf main.

    git fetch origin claude/seengrid-visual-overhaul-6RK4n
    git checkout claude/seengrid-visual-overhaul-6RK4n
    git pull

Verifikation: `ls docs/visual-overhaul/` muss u.a. zeigen:
WORKSPACE_SPEC_V1.md, WORKSPACE_BUILD_STATUS_PART_A.md,
WORKSPACE_BUILD_STATUS_PART_B.md, NUANCEN.md.

Die CLAUDE.md-Regel "direkt auf main" ist überholt — stammt aus der
Engine-Phase. Für Visual-Overhaul gilt der Feature-Branch.

---

**Deine Rolle — Part C von 3:**

Du schließt den Workspace-Bau ab: Module-Toolbar-Inhalt, Preview-
Strip, Signatures-Bar, Output-Bar, Save-as-Preset-Popup,
ToastProvider-Verkabelung in App.jsx, presetStore-Erweiterung, Docs-
Update. Danach ist der Workspace produktiv nutzbar.

**Scope Part C (Stufen 8-14 aus dem Gesamtplan):**

Stufe 8 — Module-Toolbar (oberhalb der 3 Spalten):
1. `src/components/gridcreator/workspace/ModuleToolbar.jsx` +
   `ModuleToolbar.module.css` — Spec §3. Linke Seite: **Modul-Chips**
   datengetrieben aus `modules.config.json` (nur Module mit
   `compatibility.includes(caseId)` sind sichtbar; aktive Module
   haben Teal-Border + Checkmark; Klick toggled `activeModules`-Array
   im Store). Rechte Seite: **Random**-Button + **Reset**-Button.
   - **Random** → ConfirmDialog ("alle Modul-Settings werden zufällig
     überschrieben, custom_notes bleibt") → bei OK:
     `actions.randomizeAll()`. Der Store-Action existiert in Part A.
     Pools kommen aus `src/data/random/index.js` (`getRandomPool`,
     `pickRandom`).
   - **Reset** → ConfirmDialog ("alle Settings zurück auf Case-
     Defaults, Panel-Overrides werden gelöscht, custom_notes
     geleert") → bei OK: `actions.resetAllToCaseDefaults()`.
   - ConfirmDialog-Component liegt in `src/components/ui/
     ConfirmDialog.jsx` (Part A).

Stufe 9 — Preview-Strip (full-width, unter den 3 Spalten):
2. `src/components/gridcreator/workspace/PreviewStrip.jsx` +
   `PreviewStrip.module.css` — Spec §7. Horizontale Panel-Vorschau
   mit Mini-Silhouetten (aus Canvas-SVG-Paths, kleinere Variante),
   Panel-Nummer, Rolle-Label. Klick auf Mini-Panel →
   `actions.selectPanel(id)`. Aktives Panel = Teal-Border.
   - **Overflow-Detection** via `useOverflowDetection`-Hook
     (`src/hooks/useOverflowDetection.js` — Part A). Wenn zu viele
     Panels nicht in die Strip-Breite passen: horizontal scrollbar
     mit custom scrollbar-Style (NUANCEN 11: Scrollbar nur wenn
     overflow).
   - Höhe aus `--sg2-preview-height`.

Stufe 10 — Signatures-Bar (full-width, unter Preview-Strip):
3. `src/components/gridcreator/workspace/SignaturesBar.jsx` +
   `SignaturesBar.module.css` — Spec §8. Linke Seite: **Gold-Label
   `SIGNATURES`** (Mono, Spacing, Gold-Farbe). Danach: applied-
   Signature-Cards für jede angewandte Signature (aus
   `signaturesStub.json` filtern nach `panel.signatureId !== null`).
   Jede Card: Swatch + Name + Panel-Reference + Detach-Link.
   - **Detach-Link** → `actions.detachSignatureFromPanel(panelId)`.
   - Rechte Seite: **`+ apply signature`** Button (stub für v1 —
     TODO(signature-picker): eigener Popup-Flow). Klick zeigt Toast
     "signature picker coming soon".
   - Leerzustand: nur das `SIGNATURES`-Label + `+ apply`-Button,
     keine Cards.
   - Höhe aus `--sg2-sigbar-height`.

Stufe 11 — Output-Bar (full-width, Footer):
4. `src/components/gridcreator/workspace/OutputBar.jsx` +
   `OutputBar.module.css` — Spec §9. Drei Zonen:
   - **Links:** `TOKEN-COUNT: ~1234` (approximiert via
     `src/lib/tokenCount.js` — Part A: `countTokens(str)`). Warnung
     rot wenn > 8000.
   - **Mitte:** **Dim-Warning** wenn `getDimAdvice(rows, cols)`
     `isWarningQuality(q2K) === true` → Mono-Text `LOW / TINY @ 2K —
     not startframe-ready` in Warning-Farbe.
   - **Rechts:** **Save**-Button (öffnet Save-Popup) + **Copy**-
     Button (kopiert Compile-Output JSON via `navigator.clipboard.
     writeText`, zeigt Toast "copied").
   - Compile-Call: `compileWorkspace(state)` aus
     `src/lib/compiler/workspaceCompile.js` (Part A-Adapter auf
     Slices 1-8 Engine). Liefert Prompt-JSON.
   - Höhe aus `--sg2-outputbar-height`.

Stufe 12 — Save-as-Preset-Popup:
5. `src/components/gridcreator/workspace/SavePresetDialog.jsx` +
   `SavePresetDialog.module.css` — Spec §10. Modal mit:
   - Input: **Preset-Name** (required, default: `{case-displayname}
     · {date}`).
   - Input: **Notes** (optional, Textarea).
   - Preview-Chip: `CASE: {caseDisplayName}` (read-only).
   - **Save**-Button → `presetActions.saveWorkspaceAsPreset({name,
     notes, workspaceState})` aus `src/lib/presetStore.js` (siehe
     Stufe 13). Toast "preset saved". Popup schließt.
   - **Cancel**-Button → schließt ohne Save.
   - Lokaler Component-State für Form, kein Store-Wire nötig.
   - Trigger: OutputBar Save-Button (Stufe 11).

Stufe 13 — presetStore-Erweiterung:
6. `src/lib/presetStore.js` erweitern (Part A hat Grundstruktur):
   - `saveWorkspaceAsPreset({name, notes, workspaceState})` — fügt
     Preset in `userPresets`-Array, speichert in localStorage unter
     `sg2.userPresets`.
   - `loadPreset(id)` — liefert gespeichertes Preset.
   - `deletePreset(id)` — löscht aus Array.
   - `listUserPresets()` — Array aller User-Presets für Picker
     "YOUR PRESETS".
   - Schema: `{id, name, notes, caseId, createdAt, workspaceState}`.
     **workspaceState** = komplettes State-Snapshot (inkl.
     activeModules, gridDims, panels-Array, etc.). TODO(preset-
     hydration): Part B Picker lädt aktuell nur `caseId` beim Preset-
     Click — Part C muss den Picker-Flow erweitern, damit ein User-
     Preset den **vollen** workspaceState wiederherstellt (via neuer
     Action `loadWorkspaceFromPreset(preset)` im workspaceStore).

Stufe 14 — ToastProvider-Verkabelung + Integration-Polish:
7. `src/App.jsx` — `<ToastProvider>` um die ganze App wrappen (Part A
   hat Provider + useToast-Hook angelegt, aber nicht verkabelt).
   Smoke-Test: Toast in Copy-Button zeigt sich.
8. **Bekannte offene Punkte aus Part B beheben:**
   - **Workspace-State-bei-Rail-Wechsel** — wenn User im Workspace
     ist und oben einen anderen Tab (Prompt Builder, MJ, etc.)
     klickt, dann zurück zu Grid Creator: aktuell geht State
     verloren. Lösung: Store bleibt im GridCreator-Subtree gemounted
     (Provider nicht bei Rail-Switch unmounten). Falls das
     architektonisch nicht billig ist: TODO(workspace-persist)
     markieren und mit Jonas klären.
   - **SET_DIMS new panels get null role** — wenn User Dimensions
     ändert, werden neue Panels mit `role: null` angelegt. Check:
     `panelRoleStrategy` sollte beim Resize die Default-Rollen
     setzen. Fix im `SET_DIMS`-Reducer in `workspaceStore.js`.
9. **Docs:**
   - `docs/visual-overhaul/WORKSPACE_BUILD_STATUS_PART_C.md`
     anlegen (analog A+B).
   - `ROADMAP.md`: Workspace-Bau von `[→]` auf `[✓]` umstellen.
   - `CLAUDE.md` "Aktueller Stand"-Abschnitt aktualisieren.

**Vorab-Entscheidungen aus Part A + B (NICHT mehr fragen):**

1. Store-API (hooks, actions) siehe `WORKSPACE_BUILD_STATUS_PART_A
   .md`.
2. Alle Bars + Toolbar sind strikt **full-width** unter der 3-Zone-
   Row (NUANCEN 7). Nicht in Canvas-Spalte verschachteln.
3. CSS-Modules mit `:global(.sg2-shell)` Specificity-Pattern (Part B-
   Konvention).
4. Module-Catalog + Random-Pools liegen schon in `src/config/` +
   `src/data/random/` (Part A).
5. `compileWorkspace(state)` ist der Adapter auf Slices 1-8 Engine.
   Wenn ein aktiver Case kein Schema hat (9/10 Cases in v1), liefert
   der Compiler Fallback-JSON mit `schema_version`-Warnung. Echte
   Schema-Erweiterung pro Case kommt later (TODO(panel-fields-
   schema-{caseId})-Marker sind in Part B gepflanzt).
6. FROM SCRATCH im Picker ist in v1 **disabled** (OPEN_DECISIONS
   #11). Part C muss da nichts ändern.
7. YOUR PRESETS v1 lädt aktuell nur `caseId` — Part C muss den Flow
   erweitern (siehe Stufe 13 TODO(preset-hydration)).
8. Lieferung in Gruppen ok (nicht strikt 1-File-pro-Antwort).

**Anti-Drift (kritisch — nur die für Part C relevanten NUANCEN):**

- **NUANCEN 2** (Override-Dot UND Signature-Border-Tint koexistieren).
  In Part B umgesetzt — Part C muss nichts ändern.
- **NUANCEN 7** (Preview-Strip + Sigs-Bar + Output-Bar strikt full-
  width). Hier echter Content — nicht einrücken.
- **NUANCEN 8** (from scratch — alten GridOperator nicht
  reaktivieren, auch nicht für Compile-Logik). Nur Engine Slices 1-8.
- **NUANCEN 11** (Scrollbars nur bei echtem Overflow, nie permanent).
  PreviewStrip ist der Hauptfall.
- **NUANCEN 13** (12px Gap zwischen Panels — auch in Preview-Strip
  Mini-Panels konsistent halten, wenn auch kleiner).
- **Grid Engine (42 Tests, Slices 1-8) bleibt unberührt.**

**Pflicht-Lektüre (schlank gehalten für Context-Budget):**

1. `docs/visual-overhaul/WORKSPACE_SPEC_V1.md` — **§3** (Toolbar
   vollständig), **§7** (Preview-Strip), **§8** (Signatures-Bar),
   **§9** (Output-Bar), **§10** (Save-Popup), **§11** (Toast),
   **§12** (Dim-Advisory Refresh), **§15** (Store-Modell).
2. `docs/visual-overhaul/WORKSPACE_BUILD_STATUS_PART_A.md` —
   **Anschluss-Punkte** (Hooks, Actions, State-Shape, ToastProvider,
   tokenCount, compileWorkspace).
3. `docs/visual-overhaul/WORKSPACE_BUILD_STATUS_PART_B.md` — was
   Part B gebaut hat, welche TODO-Marker gepflanzt wurden, welche
   Anschluss-Punkte Part C bedient.
4. `docs/visual-overhaul/NUANCEN.md` — **nur 7, 8, 11, 13** lesen.
5. `docs/visual-overhaul/OPEN_DECISIONS.md` — #11 (FROM SCRATCH
   disabled) und #12+ (falls Part B was ergänzt hat).
6. `src/lib/compiler/` — Slices 1-8 Engine, NICHT anfassen. Nur den
   `workspaceCompile`-Adapter (Part A) nutzen.

**Nach dem Lesen:**
- Bestätige: Docs gelesen, Scope Part C klar, Store-API-Vertrag
  klar
- Schlage konkrete Bau-Reihenfolge innerhalb Part C vor (meine
  Empfehlung: Toolbar → Preview-Strip → Sigs-Bar → Output-Bar →
  Save-Popup → presetStore → ToastProvider-Wire → offene Punkte aus
  Part B → Docs)
- Warte auf mein Go
- Dann bau gruppiert, mit manuellem Browser-Test am Ende

**Was am Ende dieser Session vorliegen muss:**

1. Alle Files aus Scope Part C lauffähig. Workspace ist voll
   funktional: Toolbar toggled Module, Random/Reset mit Confirm,
   Preview-Strip zeigt alle Panels + scrolled bei Overflow,
   Signatures-Bar zeigt applied Signatures + Detach-Flow, Output-
   Bar zeigt Token-Count + Dim-Warning + Copy + Save, Save-Popup
   speichert Preset in localStorage.
2. `App.jsx` hat ToastProvider eingebunden, Toasts funktionieren in
   allen Workspace-Buttons.
3. Offene Punkte aus Part B (Workspace-State-bei-Rail-Wechsel,
   SET_DIMS-null-role) adressiert oder sauber als TODO mit
   Begründung markiert.
4. `docs/visual-overhaul/WORKSPACE_BUILD_STATUS_PART_C.md` angelegt.
5. `ROADMAP.md`: Workspace-Bau `[→]` → `[✓]`.
6. `CLAUDE.md` "Aktueller Stand" aktualisiert.
7. **STARTPROMPT.md überschreiben** — nächster Scope: Prompt Hub
   Redesign ODER UX-Polish-Pass auf Grid Creator (je nachdem was
   Jonas priorisiert — Frage stellen am Ende der Session, nicht
   selbst entscheiden).
8. **Manueller Browser-Test vor Commit** (Dev-Server starten,
   durchklicken: Module togglen → Prompt aktualisiert, Random →
   Confirm → random values appear, Reset → Confirm → defaults
   return, Preview-Strip click selects panel, Signatures detach
   works, Copy button → clipboard + toast, Save button → popup →
   preset in localStorage). Honest flag wenn CLI-Environment keinen
   Browser erlaubt.
9. Commit + Push auf `claude/seengrid-visual-overhaul-6RK4n`.

**TODO-Marker-Convention (aus Part A + B + neu):**
- `TODO(looklab-jump)` — Inspector Signature-Card body click (Part B)
- `TODO(panel-fields-schema-{caseId})` — 9 Cases ohne echtes Schema
  (Part B)
- `TODO(preset-hydration)` — Picker lädt aktuell nur caseId beim
  Preset-Click (Part B → Part C erweitert)
- `TODO(signature-picker)` — Apply-Signature-Popup v2 (Part C pflanzt)
- `TODO(workspace-persist)` — falls Rail-Wechsel-Persistenz nicht
  billig ist (Part C-Entscheidung)
- `TODO(token-store)` — Stub-Ersetzung
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
- Post-Workspace-Scope nicht vorab-bauen — Context-Budget schonen

Bereit? Schritt 0: Branch-Wechsel + Pflicht-Lektüre + Bau-
Reihenfolge innerhalb Part C vorschlagen. Dann baue ich gruppiert.
```
