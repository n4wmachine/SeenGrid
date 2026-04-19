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

**Aktuell für:** Workspace-Bau **Part A — Foundation + Infra** (Code-
Session, 1 von 3 Parts). Der Workspace-Bau wurde in drei Staffel-Chats
aufgeteilt, weil ein einziger Chat bei der Menge an Pflicht-Lektüre +
Bau-Umfang am Context-Limit kollabiert. Part A baut das Fundament
(Daten-Stubs, Libs, Stores, generische UI-Infra, ShellHeader-
Erweiterung). Part B baut Workspace-Layout + 3 Spalten. Part C baut
Bars + Save-Popup + Integration + Docs.

**Arbeits-Branch:** `claude/seengrid-visual-overhaul-6RK4n`

**Nutzung:** Den Text-Block zwischen den beiden Backtick-Zeilen
unten in ein neues Chat-Fenster kopieren. Mehr nicht.

---

```
Hi. Ich bin Jonas, Solo AI-Filmmaker und Nicht-Coder. Der Workspace-
Bau wurde in **drei Staffel-Chats** gesplittet (ein einziger Chat
kollabiert am Context-Limit). Du bist **Part A — Foundation + Infra**,
der erste von drei Bau-Chats.

Das ist eine **Bau-Session, keine Konzept-Session.** Code-Output.
Keine neuen Produkt-/Design-Entscheidungen — alles steht in der Spec.
Keine Fragen mehr die in der Planungs-Session bereits entschieden
wurden (siehe Vorab-Entscheidungen unten).

**ALLERERSTE AKTION — BRANCH-WECHSEL (nicht überspringen):**

Die Arbeit liegt auf dem Feature-Branch
`claude/seengrid-visual-overhaul-6RK4n`, NICHT auf main.

    git fetch origin claude/seengrid-visual-overhaul-6RK4n
    git checkout claude/seengrid-visual-overhaul-6RK4n
    git pull

Verifikation: `ls docs/visual-overhaul/` muss u.a. zeigen:
WORKSPACE_SPEC_V1.md, HANDOFF_WORKSPACE_TO_CODE.md, ROADMAP.md,
OPEN_DECISIONS.md, NUANCEN.md, PRODUCT_STRATEGY_V1.md.

Die CLAUDE.md-Regel "direkt auf main" ist überholt — stammt aus der
Engine-Phase. Für Visual-Overhaul gilt der Feature-Branch.

---

**Deine Rolle — Part A von 3:**

Du baust nur **Foundation + Infra**. Alles was später von Part B
(Workspace-Layout + 3 Spalten) und Part C (Bars + Save + Integration)
gebraucht wird, aber selbst keine Workspace-Komponente ist.

**Scope Part A (Stufen 1-3 aus dem Gesamtplan):**

Stufe 1 — Daten + Libs:
1. `src/lib/dimAdvisory.js` — Port `getDimAdvice()` aus Git-History
   (`git show 13ca30f~1:src/components/GridOperator.jsx` → Funktion
   extrahieren). 4 Stufen **HIRES/STANDARD/LOW/TINY** (uppercase in
   UI-Label, Logik-Thresholds unverändert: 1024/512/256 px). Exportiere
   als benannte Funktion plus eine Label-Map mit allen 4 Stufen.
2. `src/config/modules.config.json` — 13 Module aus
   `MODULE_AND_CASE_CATALOG.md` extrahieren. Pro Modul: `id`,
   `displayName`, `category`, `hasGlobalSettings`,
   `hasPerPanelSettings`, `compatibility` (Array von Case-IDs für die
   das Modul per Whitelist pre-aktiviert ist). Das ist die Wahrheit für
   Module-Toolbar + Inspector.
3. `src/data/signatures.stub.json` — 3-5 Dummy-Signatures (id, name,
   swatchColor, tagline). Bis Token-Store Stufe 1 live.
4. `src/data/projects.stub.json` — analog zu Continue-Band-Dummies.
   2-3 Projekte plus Marker für "no project yet".
5. `src/data/random/` — Random-Pools. Legacy-Pools prüfen (actions,
   atmospheres, moods, scene-patterns, sensory-details, settings,
   subjects, textures) und pro Field-Type zuordnen. **Fehlende Pools
   pragmatisch ergänzen** mit sinnvollen Defaults (z.B. expressions,
   outfits, views). Index-Datei `src/data/random/index.js` die pro
   Field-Type-Key das passende Array liefert.
6. `src/lib/workspaceStore.js` — Session-lokaler Grid-State als **React
   Context + useReducer** (keine neue Dep — Zustand-lib NICHT
   installieren). State-Shape minimal: selectedCase, gridDims (rows,
   cols), panelOrientation, panels (array mit {id, role, fieldValues,
   overrides, signatureId|null}), activeModules, customNotes,
   appliedSignature. Actions: setCase, setDims, setOrientation,
   selectPanel, setFieldValue, toggleModule, randomizeFields,
   resetAll, applySignature, removeSignature. Store persistiert
   **session-lokal** (kein localStorage in v1), flüchtig bei
   Page-Reload, überlebt Rail-Switch innerhalb SPA.

Stufe 2 — Generische UI-Infra (auch für spätere Phasen wiederverwendbar):
7. `src/components/ui/ToastProvider.jsx` + `Toast.jsx` + CSS — bottom-
   right, max 3 gleichzeitig, Stack von unten, 3000ms auto-dismiss,
   **pause-on-hover**, **Border-Tint statt Fill** für success/error/
   info (Border-Farbe tönen, Body bleibt neutral), 24px + Output-Bar-
   Höhe (32px) Offset vom unteren Viewport-Rand. `useToast()`-Hook
   exportiert `{ toast(msg, type) }`.
8. `src/components/ui/ConfirmDialog.jsx` + CSS — Center-Modal mit
   Backdrop, Default-Focus auf Cancel, Enter = Confirm, Escape =
   Cancel. Props: `open`, `title`, `message`, `confirmLabel`,
   `cancelLabel`, `onConfirm`, `onCancel`. Wird in Part C für
   Random-Confirm + Reset-Confirm verwendet.

Stufe 3 — ShellHeader-Erweiterung:
9. `ShellHeader.jsx` (oder gleichwertige Stelle — bitte aktuelle
   Struktur respektieren, NICHT neu bauen) um zwei Elemente erweitern,
   **nur wenn Workspace-Mode aktiv ist** (Picker-Mode unberührt):
   - **Back-to-Picker-Button** links im Header. State-Switch in
     `GridCreator.jsx` (kein Route-Change — siehe NUANCEN 6).
     Part-C-Chat wird den tatsächlichen State-Switch verkabeln; du
     legst nur die UI an + exportierst eine Prop oder einen Context-
     Handler `onBackToPicker`.
   - **Projekt-Dropdown** als Inline-Label-Menü: Anzeige-Format
     `grid creator · tokio-kurzfilm ▾` (lowercase, Bullet via ::before,
     Triangle rechts). Click öffnet Dropdown mit Projekt-Liste aus
     `projects.stub.json` + "no project" + "new project…" (Letzteres
     in v1 als `TODO(projects-store)` Platzhalter).
10. `ProjectMenu.jsx` (ausgelagert) mit Click-Outside-Close +
    Keyboard-Nav (Arrows + Enter + Escape).

---

**Vorab-Entscheidungen (aus Vorgänger-Chat bereits getroffen, NICHT
mehr fragen):**

1. `useOverflowDetection` ist ein default-export, wird in Continue/
   Trendy/Classics genutzt. Preview-Strip und Signatures-Bar (beide
   Part-B/C-Scope) werden ihn identisch nutzen. Part A muss sich
   nicht drum kümmern.
2. workspaceStore = **React Context + useReducer**. Keine neue Dep.
3. Random-Pools pragmatisch ergänzen wo Legacy-Lücken sind. Sinnvolle
   Defaults, keine Stock-Fotos-Level-Qualität nötig.
4. presetStore (in `src/lib/stores/presetStore.js` oder gleichwertig)
   wird in Part C erweitert um echtes `addPreset()` + `useGridPresets()`
   mit State+Subscription. Part A fasst presetStore **nicht** an.
5. Lieferung in Gruppen ok (nicht strikt 1-File-pro-Antwort). Sinnvoll
   clustern: z.B. erst alle JSON-Stubs auf einmal, dann die Libs, dann
   Toast/Confirm-Paar, dann ShellHeader-Erweiterung.

---

**Anti-Drift (kritisch — nur die für Part A relevanten NUANCEN):**

- **NUANCEN 1** (Gold = User-persönliche Qualität only). Part A ist
  fast Gold-frei — außer ShellHeader-Projekt-Dropdown: **kein Gold
  irgendwo**, auch nicht im Hover. Teal oder neutral.
- **NUANCEN 6** (Picker + Workspace = zwei Page-States, kein Modal,
  kein Split) — ShellHeader-Erweiterungen dürfen nur im Workspace-Mode
  sichtbar sein. Verkabelung macht Part C, du legst nur UI + Hook.
- **NUANCEN 13** (4 Stufen HIRES/STANDARD/LOW/TINY, uppercase in UI).
  Alte NUANCEN-Fassung hatte PERFECT als 5. Stufe — falsch, korrigiert
  in der Planungs-Session. Port nur 4 Stufen.
- **Grid Engine (42 Tests, Slices 1-8) bleibt unberührt.** Einzige
  Neuerung unter `src/lib/`: `dimAdvisory.js`.

---

**Pflicht-Lektüre (schlank gehalten für Context-Budget):**

1. `docs/visual-overhaul/WORKSPACE_SPEC_V1.md` — **nur** §1-3
   (Zweck + Gesamtstruktur + ShellHeader), §14 (Dim-Advisory), §15
   (Panel-Fields-Schema — nur überfliegen für Modul-Config-Verständnis),
   §16 (State-Signale — für Store-Shape), §17 (Workspace-Store-Modell
   — maßgeblich für deinen Store), §19 (Toast-System). Andere
   Sektionen sind Part-B/C-Scope.
2. `docs/visual-overhaul/HANDOFF_WORKSPACE_TO_CODE.md` — Quick-Lookup-
   Tabelle für schnelle Referenz
3. `docs/visual-overhaul/NUANCEN.md` — **nur 1, 6, 13** lesen
4. `MODULE_AND_CASE_CATALOG.md` — komplett (für modules.config.json)
5. `src/styles/tokens.css` — für Toast/Confirm-Tokens prüfen ob alles
   da ist (Spec hat bestätigt dass Workspace-Tokens vorhanden sind)
6. `src/components/shell/ShellHeader*` (oder wo auch immer) — aktuelle
   Struktur lesen, NICHT neu bauen

**Nach dem Lesen:**
- Bestätige: Docs gelesen, Scope Part A klar
- Schlage konkrete Bau-Reihenfolge innerhalb Part A vor (welche
  Gruppierung lieferst du in welcher Reihenfolge?)
- Warte auf mein Go
- Dann bau gruppiert

**Was am Ende dieser Session vorliegen muss:**

1. Alle 10 Files aus Scope Part A lauffähig (kein runtime-Crash,
   auch wenn noch nicht alles verdrahtet ist — Part B/C machen die
   Verkabelung)
2. `docs/visual-overhaul/WORKSPACE_BUILD_STATUS_PART_A.md` — neu
   anlegen, analog `PICKER_BUILD_STATUS.md` strukturiert: was wurde
   gebaut (File-für-File), was ist bekannt offen, welche TODO-Marker
   stehen drin, welche Anschluss-Punkte Part B/C kennen müssen
   (Export-Namen, Hook-Signaturen, Store-Actions, Toast-API-Signatur)
3. **STARTPROMPT.md überschreiben** für **Part B — Workspace-Layout +
   3 Spalten**. Scope Part B: `Workspace.jsx`-Parent mit 6-Zonen-Grid-
   CSS, `CaseContext.jsx` (inkl. Dim-Matrix mit Hover-Highlight +
   Advisory-Tag), `Canvas.jsx` (SVG-Panels mit Selected/Hover/Override-
   Dot/Signature-Tint-States — NUANCEN 2 strikt), `Inspector.jsx` +
   Generic Field Renderer (datengetrieben aus `panel_fields`-Schema).
   Pflicht-Lektüre Part B: Spec §2, §5-8, §15; NUANCEN 2/6/7/8;
   zusätzlich `WORKSPACE_BUILD_STATUS_PART_A.md` für Anschluss.
   Branch bleibt `claude/seengrid-visual-overhaul-6RK4n`. Referenz
   auf deinen Store + Toast + ConfirmDialog einbauen damit Part B
   direkt andocken kann.
4. ROADMAP nicht anfassen — Workspace-Bau bleibt `[→]` AKTIV bis
   Part C fertig ist. Erst Part C flippt auf `[✓]`.
5. Commit + Push auf `claude/seengrid-visual-overhaul-6RK4n`.

**TODO-Marker-Convention** (Code-Markers, grep-bar):
- `TODO(looklab-jump)` — Part B/C relevant, nicht Part A
- `TODO(token-store)` — Stub-Ersetzung wenn Token-Store Stufe 1 live
- `TODO(projects-store)` — "new project…"-Eintrag im Projekt-Dropdown
- `TODO(workspace-store)` — falls Grid-State später persistiert werden
  soll (v1: session-lokal)
- `TODO(routing)` — falls Back-to-Picker auf Router umgestellt wird

**Mein Arbeitsstil:**
- Deutsch, direkt, brutal ehrlich, keine Sycophancy
- Kurze Antworten, kein Coding-Jargon
- Nicht-Coder — Coding-Details gehören in Kommentare, nicht in den
  Chat
- Bei Konflikt Spec vs. NUANCEN: NUANCEN gewinnt
- Bei Unklarheit: fragen, nicht raten

**Wichtig:**
- Keine neuen Tokens ohne Jonas-OK
- Keine Experimente — Spec gewinnt
- Grid Engine niemals anfassen (außer neuer dimAdvisory-Port)
- Part-B/C-Scope **nicht vorab-bauen** — Context-Budget schonen,
  jeder Part bleibt auf seinem Scope

Bereit? Schritt 0: Branch-Wechsel + (schlanke) Pflicht-Lektüre +
Bau-Reihenfolge innerhalb Part A vorschlagen. Dann baue ich gruppiert.
```
