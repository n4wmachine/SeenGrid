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

**Aktuell für:** Workspace-Bau-Chat (Code-Session). Umsetzung der
`WORKSPACE_SPEC_V1.md` — 6 Stack-Zonen, 3-Spalten-Layout, Preview-Strip,
Signatures-Bar, Output-Bar, Save-Popup, Random-Confirm, Toast-System,
Back-to-Picker, Projekt-Dropdown im ShellHeader. Größter Bau-Block der
Visual-Overhaul-Phase.

**Arbeits-Branch:** `claude/seengrid-visual-overhaul-6RK4n`

(Die Workspace-Planungs-Session lief auf `claude/workspace-planning-
grid-creator-earBn`. Die dort entstandenen Docs werden in den
Overhaul-Branch gemerged. Falls noch nicht passiert: zuerst Merge klären
mit Jonas, dann Bau.)

**Nutzung:** Den Text-Block zwischen den beiden Backtick-Zeilen
unten in ein neues Chat-Fenster kopieren. Mehr nicht.

---

```
Hi. Ich bin Jonas, Solo AI-Filmmaker und Nicht-Coder. Die Workspace-
Planung ist fertig (`WORKSPACE_SPEC_V1.md` + `HANDOFF_WORKSPACE_TO_
CODE.md` liegen bereit). Jetzt kommt der **Workspace-Bau** — Umsetzung
der Spec im Code. Das ist der größte Bau-Block der Visual-Overhaul-
Phase.

Das ist eine **Bau-Session, keine Konzept-Session.** Code-Output.
Keine neuen Produkt-/Design-Entscheidungen — alles steht in der Spec.

**ALLERERSTE AKTION — BRANCH-WECHSEL (nicht überspringen):**

Die Arbeit liegt auf dem Feature-Branch
`claude/seengrid-visual-overhaul-6RK4n`, NICHT auf main.

    git fetch origin claude/seengrid-visual-overhaul-6RK4n
    git checkout claude/seengrid-visual-overhaul-6RK4n
    git pull

Verifikation: `ls docs/visual-overhaul/` muss u.a. zeigen:
WORKSPACE_SPEC_V1.md, HANDOFF_WORKSPACE_TO_CODE.md, ROADMAP.md,
OPEN_DECISIONS.md, NUANCEN.md, PRODUCT_STRATEGY_V1.md,
PICKER_SPEC_V1.md, LANDING_REDESIGN_STATUS.md, PICKER_BUILD_STATUS.md.

Die CLAUDE.md-Regel "direkt auf main" ist überholt — stammt aus der
Engine-Phase. Für Visual-Overhaul gilt der Feature-Branch.

---

**Deine Rolle:**
- Code-Chat für den Grid Creator Workspace
- `WORKSPACE_SPEC_V1.md` ist primäre Quelle — nichts erfinden, nichts
  weglassen
- `HANDOFF_WORKSPACE_TO_CODE.md` hat die Umsetzungs-Schritte + Quick-
  Lookup-Tabelle
- Bei Unklarheit: Jonas fragen, nicht raten
- Komplette Files liefern, keine Diffs

**Mein Arbeitsstil:**
- Deutsch, direkt, brutal ehrlich, keine Sycophancy
- Kurze Antworten, kein Coding-Jargon
- Nicht-Coder — Coding-Details gehören in Kommentare, nicht in den
  Chat
- Ein File pro Antwort bevorzugt

**Was zu bauen ist (Kurzfassung — Details in der Spec):**

Stack vertikal (Token-Werte aus `src/styles/tokens.css`):
- ShellHeader 56px mit Back-to-Picker + Projekt-Dropdown
- Module-Toolbar 52px (alle Module sichtbar, Case-Whitelist = Pre-
  Aktivierung)
- 3-Spalten-Row (Context 260 | Canvas flex | Inspector 320)
- Preview-Strip 96px full-width (Panel-Thumbs scrollbar)
- Signatures-Bar 52px full-width (Gold-Territorium, Applied fix links)
- Output-Bar 32px full-width (Copy-Primary + Save + Meta rechts)

Plus:
- Save-as-Preset-Popup (Center-Modal, 4 Checkboxen + Projekt-Radio)
- Random-Confirm-Dialog (Default-Focus Cancel)
- Reset-Confirm-Dialog
- Generisches Toast-System (bottom-right, pause-on-hover, max 3)
- Dim-Advisory-Utility aus Git-History portieren
  (`git show 13ca30f~1:src/components/GridOperator.jsx` →
  `getDimAdvice` → `src/lib/dimAdvisory.js`)

**Anti-Drift (kritisch — aus Spec + NUANCEN):**
- **NUANCEN 1** (Gold/Teal) unverhandelbar. Gold nur Signatures-Bar-
  Label, Applied-Signature-Border + Glow, Override-Dots, Inspector-
  Signature-Card. Alles andere Teal oder neutral.
- **NUANCEN 2** (Override-Dot + Signature-Applied sind zwei unabhängige
  Visual-States, koexistieren am selben Panel gleichzeitig) strikt.
- **NUANCEN 6** (Picker + Workspace = zwei Page-States, kein Modal,
  kein Split) — Back-to-Picker ist State-Switch in `GridCreator.jsx`,
  kein Route-Change.
- **NUANCEN 7** (Preview-Strip + Signatures-Bar + Output-Bar strikt
  full-width unter 3-Spalten-Row, NICHT in Canvas-Spalte).
- **NUANCEN 8** (Workspace from scratch bauen, nicht alten GridOperator
  recyceln). Einzige Ausnahme: `getDimAdvice`-Logik aus Git-History
  portieren.
- **NUANCEN 13** (Dim-Advisory = 4 Stufen HIRES/STANDARD/LOW/TINY,
  Casing uppercase in UI). Alte NUANCEN-Fassung hatte PERFECT als 5.
  Stufe — falsch, korrigiert.
- **Grid Engine (42 Tests, Slices 1-8) bleibt unberührt.**
- **Case-Wechsel im Workspace nicht möglich** — nur via Back-to-
  Picker.

**Pflicht-Lektüre (in dieser Reihenfolge):**
1. `docs/visual-overhaul/WORKSPACE_SPEC_V1.md` — primäre Quelle, 22
   Sektionen + Definition of Done
2. `docs/visual-overhaul/HANDOFF_WORKSPACE_TO_CODE.md` — Umsetzungs-
   Schritte, Quick-Lookup
3. `docs/visual-overhaul/NUANCEN.md` — Anti-Drift (1, 2, 6, 7, 8, 13)
4. `docs/visual-overhaul/OPEN_DECISIONS.md` — #4, #5, #10 potenziell
   relevant (alle offen)
5. `docs/visual-overhaul/PRODUCT_STRATEGY_V1.md` — Datenmodell + Save-
   Mechanik + §7 Projekt-Kontext
6. `MODULE_AND_CASE_CATALOG.md` — 10 Cases + 13 Module +
   Kompatibilitäts-Matrix (verbindlich)
7. `src/components/gridcreator/` — aktueller Stand (Picker fertig,
   Workspace-Placeholder ersetzbar)
8. `src/styles/tokens.css` — alle Workspace-Tokens bereits vorhanden
9. `src/hooks/useOverflowDetection.js` — wiederverwendbar für Preview-
   Strip + Signatures-Bar
10. `docs/visual-overhaul/PICKER_BUILD_STATUS.md` — Pattern-Referenz
    (ThumbPattern wiederverwendbar)
11. `docs/visual-overhaul/LANDING_REDESIGN_STATUS.md` — Continue-
    Scroll-Pattern, Specificity-Pattern, Überlauf-Handling

**Nach dem Lesen:**
- Bestätige: Docs gelesen, Spec verstanden
- Schlage konkreten Bau-Plan vor (in welcher Reihenfolge baust du die
  Komponenten? Welche Daten-Stubs legst du zuerst an?)
- Warte auf mein Go
- Dann bau Komponente für Komponente, File pro File

**Was am Ende dieser Session vorliegen muss:**
1. Funktionaler Grid Creator Workspace gemäß `WORKSPACE_SPEC_V1.md`
   §22 Definition of Done (19 Check-Punkte)
2. `WORKSPACE_BUILD_STATUS.md` analog `PICKER_BUILD_STATUS.md` +
   `LANDING_REDESIGN_STATUS.md` — was wurde gebaut, was ist bekannt
   offen, welche TODO-Marker stehen
3. ROADMAP aktualisiert (Workspace-Bau `[→]` → `[✓]`, nächste Phase
   `[→]`)
4. STARTPROMPT überschreiben für Nachfolger-Chat (Jonas entscheidet:
   Token-Store Stufe 1 / LookLab Visual-Update / LIB-Tab / anderes)
5. Grid Engine (42 Tests) bleibt grün — kein Code an `src/lib/`
   außer neuer `src/lib/dimAdvisory.js` (Port von getDimAdvice)

**Daten-Stubs (in v1 ausreichend):**
- `src/data/signatures.stub.json` — 3-5 Dummy-Signatures (Name,
  Swatch-Color, Tagline) bis Token-Store Stufe 1 gebaut ist
- `src/data/projects.stub.json` — analog zu Continue-Band-Dummies
- `src/data/random/` — Field-Type-Pools (Legacy konsolidieren, Lücken
  füllen pragmatisch)
- `src/config/modules.config.json` — aus `MODULE_AND_CASE_CATALOG.md`
  extrahieren (id, displayName, category, hasGlobalSettings,
  hasPerPanelSettings, compatibility-Array)

**TODO-Marker-Convention** (Code-Markers, grep-bar):
- `TODO(looklab-jump)` — Body-Klick auf Applied-Signature-Card (Spec
  §8.5)
- `TODO(token-store)` — Stub-Ersetzung wenn Token-Store Stufe 1 live
- `TODO(projects-store)` — Stub-Ersetzung wenn Projekt-Store live
- `TODO(workspace-store)` — falls Grid-State später persistiert werden
  soll (v1: session-lokal)
- `TODO(routing)` — falls Back-to-Picker auf Router umgestellt wird

**Wichtig:**
- Bei Unklarheiten: fragen, nicht raten
- Komplette Files liefern, keine Diffs
- Specificity-Pattern konsequent: `:global(.sg2-shell) .xyz` für alle
  padding/margin innerhalb Shell
- Keine neuen Tokens ohne Jonas-OK
- Keine Experimente — Spec gewinnt
- Bei Konflikt Mockup vs. Spec: Spec gewinnt
- Bei Konflikt Spec vs. NUANCEN: NUANCEN gewinnt (Spec ist kompatibel
  gebaut, aber bei versehentlicher Abweichung korrigiert NUANCEN)
- Grid Engine niemals anfassen (außer neuer dimAdvisory-Port)

Bereit? Schritt 0: Branch-Wechsel + Pflicht-Lektüre + Bau-Plan vorschlagen.
Dann baue ich Komponente für Komponente.
```
