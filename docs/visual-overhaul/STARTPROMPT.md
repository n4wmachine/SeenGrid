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
   (die drei `git`-Zeilen)

**Arbeits-Branch heißt:** Der Branch auf dem die committed Arbeit lebt
(`git log`-Historie, Push-Ziel) — **nicht** der Branch auf dem die Harness
dich gestartet hat. Im Zweifel: `git branch --show-current` NACH dem
ersten Branch-Wechsel, oder Jonas fragen.

**Aktuell für:** Landing-Redesign-Chat (Code-Chat). Setzt ein externes
Design-Briefing um, das Jonas **separat im Chat mitschickt** (kommt nicht
aus diesem Repo). Workspace-Planung ist verschoben und kommt nach dem
Landing-Redesign dran.

**Arbeits-Branch:** `claude/seengrid-visual-overhaul-6RK4n`
Der Startprompt unten enthält die `git checkout`-Anweisung als erste
Aktion. Nicht streichen — ohne diesen Checkout findet der neue Chat
keine der Planungs-Docs.

**Nutzung:** Den Text-Block zwischen den beiden Backtick-Zeilen
unten in ein neues Chat-Fenster kopieren. Mehr nicht.

---

```
Hi. Ich bin Jonas, Solo AI-Filmmaker und Nicht-Coder. Der Grid Creator
Picker ist fertig und auf dem Feature-Branch gelandet. Jetzt kommt das
**Landing-Redesign** vor der Workspace-Phase rein — die aktuelle Landing
wirkt inkonsistent (v.a. Typografie + Informationsdichte). Ich schicke dir
in der **nächsten Nachricht** ein externes Design-Briefing (Typography,
Layout-Entscheidungen, evtl. konkrete Maße). Dieses Briefing kommt von
einem anderen Chat ohne Repo-Kontext — dein Job ist es, die Specs mit
dem echten Codebase abzugleichen und umzusetzen.

**ALLERERSTE AKTION — BRANCH-WECHSEL (nicht überspringen):**

Die gesamte Arbeit liegt auf dem Feature-Branch
`claude/seengrid-visual-overhaul-6RK4n`, NICHT auf main. Die Harness
startet dich auf einem frischen Zufalls-Branch.

Bevor du IRGENDWAS anderes tust, führe aus:

    git fetch origin claude/seengrid-visual-overhaul-6RK4n
    git checkout claude/seengrid-visual-overhaul-6RK4n
    git pull

Wenn das an Harness-Policies scheitert: stoppe, meld dich bei mir, wir
klären das.

Verifikation nach Checkout: `ls docs/visual-overhaul/` muss u.a. zeigen:
ROADMAP.md, PRODUCT_STRATEGY_V1.md, PHASE1_STATUS.md, PICKER_BUILD_STATUS.md,
NUANCEN.md. Wenn sie fehlen, bist du auf dem falschen Branch.

Die CLAUDE.md-Regel "direkt auf main" ist überholt — stammt aus der
Engine-Phase. Für Visual-Overhaul gilt der Feature-Branch.

---

**Deine Rolle:**
- Du bist **Code-Chat** für die Landing-Page
- Du liest zuerst die Repo-Docs (unten Liste), DANN wartest du auf mein
  externes Design-Briefing in der nächsten Nachricht
- Wenn Briefing und Repo-Konventionen kollidieren (z.B. unterschiedliche
  Farben, andere Fonts): **fragen**, nicht raten. Das Briefing hat keinen
  Repo-Kontext und könnte gegen unsere Brand-Entscheidungen laufen.
- Du schreibst Code, commitest, pushst auf den Work-Branch

**Mein Arbeitsstil:**
- Deutsch, direkte Kommunikation, brutal ehrlich, keine Sycophancy
- Kurze, präzise Antworten
- Nicht-Coder — keine Coding-Jargon-Wände
- Code-Übergabe: komplette Files, keine Diffs, ein File pro Antwort
  bevorzugt. Ich kopiere 1:1 in VS Code.

**Anti-Drift für diese Session:**
- **Scope eng:** Nur Landing-Page + deren CSS + evtl. Hero-Assets.
  Nichts an Rail, Shell, Header, StatusBar, Picker, Grid Engine
  oder Workspace-Placeholder ändern.
- **NUANCEN 1 (Gold/Teal-Systematik) ist unverhandelbar** — falls das
  externe Briefing andere Farben vorschlägt, mit mir besprechen, nicht
  spontan ersetzen.
- **NUANCEN 11 (Brand-Präsenz):** Logo + Wordmark + Tagline auf der
  Landing sind aktuell bewusst groß (72px Wordmark). Falls Briefing das
  auf ~20px reduziert, ist das OK als bewusstes Redesign-Ziel — dann
  aber mit mir abstimmen und PHASE1_STATUS später anpassen.
- **CONTINUE-Band** wurde in der Picker-Phase auf Single-Row +
  Horizontal-Scroll umgebaut (`[+ neu]` vorne, zuletzt-bearbeitet
  zuerst, Adaptivität bei leerem Projekt-Array). Das ist das neue
  Verhalten — Briefing-Vorschläge bitte gegen dieses Pattern abgleichen.
- **Specificity-Pattern** (`:global(.sg2-shell) .xyz` für padding/margin
  innerhalb `.sg2-shell`) konsequent beibehalten (PHASE1_STATUS).
- **Keine Regression** in Rail/Shell/Picker/Grid Engine. Grid Engine
  (Slices 1-8, 42 Tests) muss grün bleiben.
- Bei neuen Produkt-Ideen während des Baus: `OPEN_DECISIONS.md`
  eintragen (nach Rücksprache), nicht spontan integrieren.

**Bitte lies in dieser Reihenfolge, BEVOR du das externe Briefing liest:**
1. `docs/visual-overhaul/PHASE1_STATUS.md` — aktueller Landing-Stand
   (Schrift, Farben, Atmosphäre, Specificity-Pattern)
2. `docs/visual-overhaul/NUANCEN.md` — Anti-Drift (besonders 1, 11, 12)
3. `docs/visual-overhaul/PRODUCT_STRATEGY_V1.md` §5 — Landing-Logik
   (CONTINUE adaptiv, QUICK START, DISCOVER), §5.3 "NUR Projekte"
4. `docs/visual-overhaul/PICKER_BUILD_STATUS.md` — was seit Brand-Session
   geändert wurde (CONTINUE-Band, Default-Landing-Page, Legacy entfernt)
5. `docs/visual-overhaul/OPEN_DECISIONS.md` — Hero-Verhalten offen (#2)
6. `docs/visual-overhaul/ROADMAP.md` — aktive Phase
7. `src/components/landing/LandingPage.jsx` + `LandingPage.module.css` —
   aktueller Code (Referenz für das, was du anfasst)
8. `src/styles/tokens.css` — verfügbare Design-Tokens (`--sg2-*`)

**Danach — warte auf meine nächste Nachricht mit dem externen Briefing.**
Nicht einfach Vorschläge erfinden, die sich nicht im Briefing finden.

**Bevor du mit Code anfängst:**
- Bestätige dass du die Repo-Docs gelesen hast
- Fasse in 3-5 Sätzen zusammen, was die aktuelle Landing leistet und
  wo du Inkonsistenzen vermutest (v.a. Typografie)
- Warte auf mein externes Briefing
- Nach dem Briefing: Kurz-Abgleich Briefing ↔ Repo-Konventionen.
  Konflikte als Fragen an mich, nicht als Fait-accompli.
- Erst dann Code

**Was am Ende dieser Session vorliegen muss:**
1. Landing-Page nach Briefing umgesetzt (JSX + Module-CSS)
2. Abgleichs-Notiz im Kommentar oder im Status-Doc: welche Briefing-
   Punkte übernommen, welche angepasst, welche abgelehnt (mit Begründung)
3. ROADMAP aktualisiert (Landing-Redesign `[→]` → `[✓]`, Workspace-
   Planung `[→]`)
4. PHASE1_STATUS ergänzt oder neues `LANDING_REDESIGN_STATUS.md`
   (bevorzugt — PHASE1 ist der Brand-Session-Stand, neues Doc ist sauberer)
5. Neuer STARTPROMPT für den Workspace-Planning-Chat
6. Grid Engine (Slices 1-8, 42 Tests) bleibt unberührt und grün

**Wichtig:**
- Bei Zweifel im Scope: nachfragen, nicht vorpreschen
- Workspace-Startprompt haben wir schon mal geschrieben (siehe
  `git log` für Revision vor diesem Commit) — kannst du als Vorlage
  nehmen wenn du den neuen STARTPROMPT bauen musst

Bereit? Start mit Schritt 0: Branch-Wechsel + Repo-Docs lesen + kurze
Zusammenfassung. Dann warte auf das externe Briefing.
```
