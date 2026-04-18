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

**Arbeits-Branch heißt:** Der Branch auf dem die committed Arbeit lebt
(`git log`-Historie, Push-Ziel) — **nicht** der Branch auf dem die Harness
dich gestartet hat.

**Aktuell für:** Workspace-Planning-Chat (Konzept-Session, keine
Bau-Session). Spec für den Grid Creator Workspace wird ausgearbeitet —
3-Spalten-Layout, Preview-Strip, Signatures-Bar, Output-Bar,
Projekt-Kontext im Header. Ergebnis: `WORKSPACE_SPEC_V1.md` +
`HANDOFF_WORKSPACE_TO_CODE.md` + ggf. Updates in `OPEN_DECISIONS.md`.

**Arbeits-Branch:** `claude/seengrid-visual-overhaul-6RK4n`

**Nutzung:** Den Text-Block zwischen den beiden Backtick-Zeilen
unten in ein neues Chat-Fenster kopieren. Mehr nicht.

---

```
Hi. Ich bin Jonas, Solo AI-Filmmaker und Nicht-Coder. Picker und
Landing-Redesign sind fertig. Jetzt kommt die **Workspace-Planung**
für den Grid Creator — die Konzept-Session bevor ein Bau-Chat den
Workspace tatsächlich implementiert.

Das ist eine **Konzept-Session, keine Bau-Session.** Am Ende liegt
eine Spec vor, kein Code. Analog zur Picker-Planungs-Phase
(`PICKER_SPEC_V1.md`).

**ALLERERSTE AKTION — BRANCH-WECHSEL (nicht überspringen):**

Die gesamte Arbeit liegt auf dem Feature-Branch
`claude/seengrid-visual-overhaul-6RK4n`, NICHT auf main.

    git fetch origin claude/seengrid-visual-overhaul-6RK4n
    git checkout claude/seengrid-visual-overhaul-6RK4n
    git pull

Verifikation: `ls docs/visual-overhaul/` muss u.a. zeigen: ROADMAP.md,
PRODUCT_STRATEGY_V1.md, PHASE1_STATUS.md, PICKER_BUILD_STATUS.md,
NUANCEN.md, LANDING_REDESIGN_STATUS.md (neu, landing-phase).

Die CLAUDE.md-Regel "direkt auf main" ist überholt — stammt aus der
Engine-Phase. Für Visual-Overhaul gilt der Feature-Branch.

---

**Deine Rolle:**
- **Konzept-/Planungs-Chat** für den Grid Creator Workspace
- Zuerst die Repo-Docs (unten Liste) lesen, DANN Fragen an mich stellen
- Kein Code schreiben — nur Spec + Handoff am Ende
- Mit mir Option für Option durchgehen, nicht mir eine fertige
  Lösung vorsetzen

**Mein Arbeitsstil:**
- Deutsch, direkt, brutal ehrlich, keine Sycophancy
- Kurze Antworten, kein Coding-Jargon
- Nicht-Coder
- In Konzept-Sessions: du stellst Optionen (A/B/C) mit Trade-offs,
  ich entscheide, wir fixieren im Protokoll
- Keine großen Wall-of-Text-Exposés ohne mein Eingrenzen

**Was in dieser Session zu klären ist (Kurzfassung):**

1. **3-Spalten-Layout** (Case Context | Canvas | Inspector)
   - Genaue Breiten (Token `--sg2-context-width: 260px` und
     `--sg2-inspector-width: 320px` existieren bereits — reichen sie?)
   - Collapse-Verhalten der Seiten-Spalten (NUANCEN 3: Rail ist
     nicht collapsible — gilt das auch für Context/Inspector?)
   - Was genau landet in Case Context (Case-Name, Module-Toggles,
     globale Settings)? Was in Inspector (per-Panel Overrides,
     Signature-Auswahl, Panel-Role-Edit)?

2. **Full-Width Preview-Strip** (96px, NUANCEN 7: unter 3-Spalten-Row,
   NICHT in Canvas-Spalte)
   - Zeigt er das Master-Grid oder die Einzel-Panels scrollbar?
   - Klick auf Strip-Item → Canvas springt zu Panel?
   - Position: strikt full-width unter Row, über Output-Bar?

3. **Signatures-Bar** (52px, Token `--sg2-sigbar-height`)
   - Horizontal-Scroll wie Continue auf Landing?
   - Nur angewendete Signatures oder Pin-Favoriten + Zuletzt-genutzt?
   - Gold-Akzent auf Applied-Card (NUANCEN 1)
   - Applied-State-Signal: Gold-Border-Tint + Glow (NUANCEN 2)?

4. **Output-Bar** (32px, Token `--sg2-outputbar-height`)
   - Inhalt: "Copy as JSON", "Copy as Paragraph", "Save as Preset",
     Token-Count? Warnings (Dim-Advisory aus CLAUDE.md)?
   - Layout: links Actions, rechts Meta?

5. **Projekt-Kontext im Header** (PRODUCT_STRATEGY §7)
   - Wo genau erscheint das Projekt-Label? (ShellHeader? Eigener
     Workspace-Chrome?)
   - OPEN_DECISIONS #7 (Projekt-Wechsel-UI) wird hier entschieden

6. **Save-as-Preset-Flow** (PRODUCT_STRATEGY §2.2)
   - Wo ist der Save-Button? (Output-Bar? Header-Ecke?)
   - Popup-Design (4 Checkboxen + Projekt-Dropdown) —
     kommt das Mockup bereits in dieser Spec oder erst im Bau?

7. **Dim Advisory** (aus CLAUDE.md „Wichtig bei Engine-
   Fertigstellung") — pro Grid-Kombo exakte Panel-Pixel-Größen bei
   2K/4K mit Quality-Tags. Wo im Workspace sichtbar?

8. **Panel-Role-Customization** (aus CLAUDE.md "Nach Slice 8") —
   User wählt pro Panel welchen Winkel er will. UI dafür?

**Anti-Drift für diese Session (kritisch):**
- **NUANCEN 1** (Gold/Teal) unverhandelbar. Gold nur Signatures +
  Override-Dots + Grid-Rail-Stern + Signatures-Bar + Applied-Card.
- **NUANCEN 2** (Override-Dot vs. Signature-Applied — zwei
  unabhängige Visual-States) muss im Workspace erhalten bleiben.
- **NUANCEN 6** (Picker/Workspace = zwei Page-States, KEIN Modal,
  kein Split) — Workspace ist volle Page hinter State-Wechsel.
- **NUANCEN 7** (Preview-Strip full-width, nicht in Canvas-Spalte) —
  wurde in alten Mockups falsch gemacht, darf nicht zurückkommen.
- **NUANCEN 11 neu** (Editorial statt Hero) bleibt konsistent — der
  Workspace-Header wird nicht wieder zum Splash-Bereich.
- **PRODUCT_STRATEGY_V1 §1.1 Live-Link** (Signature per ID-Referenz,
  nicht Snapshot) — Signature-Edits im LookLab wirken im Workspace
  automatisch.
- **Grid Engine (Slices 1-8, 42 Tests)** bleibt unberührt. Das ist
  Konzept-Session, kein Code.

**Bitte lies in dieser Reihenfolge, BEVOR du mit mir ins Gespräch
gehst:**
1. `docs/visual-overhaul/LANDING_REDESIGN_STATUS.md` — was gerade
   fertig wurde
2. `docs/visual-overhaul/PICKER_BUILD_STATUS.md` — Picker-Phase als
   Blueprint für Planungs-Arbeit
3. `docs/visual-overhaul/PICKER_SPEC_V1.md` — Format-Vorlage für
   die Spec die du schreiben wirst
4. `docs/visual-overhaul/PRODUCT_STRATEGY_V1.md` — Datenmodell +
   Save-Mechanik + §7 Projekt-Kontext
5. `docs/visual-overhaul/NUANCEN.md` — besonders 1, 2, 6, 7, 8, 11
6. `docs/visual-overhaul/OPEN_DECISIONS.md` — #4, #5, #7, #9 sind
   potenziell relevant. #7 wird hier entschieden.
7. `docs/visual-overhaul/ROADMAP.md` — aktive Phase
8. `CLAUDE.md` — besonders den Hinweis zum Dim Advisory und
   Panel-Role-Customization
9. `MODULE_AND_CASE_CATALOG.md` — welche Panel-Rollen existieren,
   welche Module gibt's
10. `src/components/gridcreator/` — aktueller Code-Stand
    (Picker fertig, Workspace ist Placeholder)
11. `src/styles/tokens.css` — Layout-Tokens für Workspace
    (context-width, inspector-width, preview-height, sigbar-height,
    outputbar-height)
12. `docs/visual-overhaul/mockup_03_gridcreator_workspace.html` —
    historischer Mockup, NUANCEN gewinnt bei Konflikten

**Nach dem Lesen:**
- Bestätige: Docs gelesen
- Fasse in 3-5 Sätzen zusammen: aktueller Stand + 8 Klärungspunkte
  (du kannst die Liste oben übernehmen) + wo du Konflikte mit
  NUANCEN erwartest
- Warte auf mein Go
- Dann gehen wir die Klärungspunkte durch — du stellst Optionen mit
  Trade-offs, ich entscheide, wir protokollieren

**Was am Ende dieser Session vorliegen muss:**
1. `docs/visual-overhaul/WORKSPACE_SPEC_V1.md` — vollständige Bau-
   Anleitung für den Workspace (analog `PICKER_SPEC_V1.md`)
2. `docs/visual-overhaul/HANDOFF_WORKSPACE_TO_CODE.md` — kompakte
   Übergabe an den Code-Chat (analog `HANDOFF_PICKER_TO_CODE.md`)
3. Updates in `OPEN_DECISIONS.md` (#7 entschieden, ggf. weitere
   neu)
4. ROADMAP aktualisiert (Workspace-Planung `[→]` → `[✓]`,
   Workspace-Bau `[ ]` → `[→]`)
5. Neuer STARTPROMPT für den Workspace-Bau-Chat
6. Grid Engine (42 Tests) bleibt grün — kein Code angefasst

**Wichtig:**
- **Keine Code-Änderungen.** Du liest, fragst, schreibst Specs.
- Keine Placeholder-Komponenten anlegen. Keine `WIP`-Files.
- Konzeptionelle Entscheidungen ohne mein OK werden nicht fixiert.
- Bei Unklarheiten: fragen, nicht raten.
- Wenn ein Mockup (aktuell `mockup_03_gridcreator_workspace.html`)
  gegen NUANCEN steht: NUANCEN gewinnt.

Bereit? Schritt 0: Branch-Wechsel + Repo-Docs lesen + Zusammenfassung.
Dann gehen wir Klärungspunkte durch.
```
