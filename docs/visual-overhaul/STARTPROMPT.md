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

**Aktuell für:** Landing-Redesign-Chat (Code-Chat). Setzt das externe
Briefing `landing-masthead-composition` um, das Jonas in der **nächsten
Nachricht** mitschickt. Radikaler Umbau: Masthead statt Hero, Discover
als visueller Anker nach oben, Continue kompakter, Quick Start
komprimiert. NUANCEN 11 (großer Hero-Wordmark) wird durch dieses
Redesign bewusst überholt — mit Jonas-OK.

**Arbeits-Branch:** `claude/seengrid-visual-overhaul-6RK4n`

**Nutzung:** Den Text-Block zwischen den beiden Backtick-Zeilen
unten in ein neues Chat-Fenster kopieren. Mehr nicht.

---

```
Hi. Ich bin Jonas, Solo AI-Filmmaker und Nicht-Coder. Der Grid Creator
Picker ist fertig. Jetzt kommt das **Landing-Redesign** (Slice-Name:
landing-masthead-composition). Die aktuelle Landing ist inkonsistent —
Hero frisst den Fold, Geisterslots bei < 4 Projekten, Discover landet
unten statt als Brand-Träger oben. Ich schicke dir in der **nächsten
Nachricht** den vollständigen Briefing-Text aus einer externen Design-
Review-Session. Dein Job: Briefing umsetzen, aber gegen die Repo-
Konventionen abgleichen — das Briefing kennt unsere Tokens und
NUANCEN nicht.

**ALLERERSTE AKTION — BRANCH-WECHSEL (nicht überspringen):**

Die gesamte Arbeit liegt auf dem Feature-Branch
`claude/seengrid-visual-overhaul-6RK4n`, NICHT auf main.

    git fetch origin claude/seengrid-visual-overhaul-6RK4n
    git checkout claude/seengrid-visual-overhaul-6RK4n
    git pull

Verifikation: `ls docs/visual-overhaul/` muss u.a. zeigen: ROADMAP.md,
PRODUCT_STRATEGY_V1.md, PHASE1_STATUS.md, PICKER_BUILD_STATUS.md,
NUANCEN.md. Wenn sie fehlen, falscher Branch.

Die CLAUDE.md-Regel "direkt auf main" ist überholt — stammt aus der
Engine-Phase. Für Visual-Overhaul gilt der Feature-Branch.

---

**Deine Rolle:**
- **Code-Chat** für die Landing-Page
- Zuerst die Repo-Docs (unten Liste) lesen, DANN auf Briefing warten
- Briefing umsetzen, Konflikte mit mir klären (nicht raten)
- Code schreiben, commiten, pushen auf den Work-Branch

**Mein Arbeitsstil:**
- Deutsch, direkt, brutal ehrlich, keine Sycophancy
- Kurze Antworten, kein Coding-Jargon
- Nicht-Coder
- Code-Übergabe: komplette Files, keine Diffs, ein File pro Antwort
  bevorzugt. Ich kopiere 1:1 in VS Code.

**Was das Redesign leistet — Kurzfassung (Details im Briefing):**
- **Masthead** (neu, ~70px) ersetzt den zentrierten Hero. Wordmark max
  22px, Claim rechts daneben, Session-Metadata (`v0.4.2 · 3 signatures
  · 18 prompts · saved 14m ago`) ganz rechts. **Bewusst editorial, nicht
  Marketing-Splash.**
- **Discover** wandert direkt unter den Masthead als visueller Anker.
  Cards 140–160px hoch (aktuell ~400px), Mood-Farben bleiben
  Filmstock/Look-Repräsentationen.
- **Continue** als horizontaler Scroll-Strip (~66px Card-Höhe, Breite
  ~130px). `[+ new project]` vorne, dann Projekte, Gradient-Fade
  rechts als Scroll-Affordance. **Hinweis:** In der Picker-Phase haben
  wir CONTINUE schon auf Horizontal-Scroll umgebaut — das Briefing
  iteriert das weiter (kleiner, Fade-Element neu). Unsere aktuelle
  Version als Ausgangspunkt, nicht komplett neu bauen.
- **Quick Start** komprimiert auf 4-Column Utility-Leiste, Cards 44px
  hoch, keine Descriptions mehr.
- Ziel: alle Sections above the fold auf 1080p/1440p.

**Anti-Drift für diese Session (kritisch):**
- **NUANCEN 11 (große Brand-Präsenz / 72px Wordmark) wird durch dieses
  Redesign bewusst überholt.** Der Briefing hat dafür eine klare
  Rationale ("Pro-Tool wie Linear/Figma, Brand durch Editorial-Sprache
  + kuratierte Discover-Cards statt durch Raumverbrauch"). Übernehmen,
  nicht neu verhandeln. NUANCEN 11 muss am Ende der Session aktualisiert
  werden (oder explizit als "überholt durch Landing-Redesign" markiert).
- **NUANCEN 1 (Gold/Teal-Systematik) bleibt unverhandelbar.** Falls das
  Briefing andere Farben impliziert, zurückfragen. Gold = nur
  User-persönlich, Teal = universeller UI-Akzent.
- **CSS-Token-Mapping:** Das Briefing nennt generische Namen
  (`border-tertiary`, `text-secondary`, `bg-info`, `border-radius-md`,
  `color-background-secondary`). Wir haben `--sg2-*`-Tokens in
  `src/styles/tokens.css`. **Mappe auf unsere Tokens**, führe keine
  neuen CSS-Variablen ein. Im Zweifel: `tokens.css` lesen, dort gibt
  es schon text-primary/secondary/tertiary/quaternary, border-default/
  emphasized/teal, bg-primary/surface/elevated, radius-sm/md/lg/xl.
- **Specificity-Pattern** (`:global(.sg2-shell) .xyz` für padding/
  margin innerhalb `.sg2-shell`) konsequent beibehalten
  (PHASE1_STATUS).
- **Scope eng:** Nur Landing-Page + deren Sub-Komponenten + deren CSS
  + evtl. ein neuer Daten-File (`src/data/discover.json` oder ähnlich).
  Nichts an Rail, Shell, Header, StatusBar, Picker, GridCreator,
  Grid Engine ändern.
- **Grid Engine (Slices 1-8, 42 Tests) muss grün bleiben.**
- **Keine neuen npm-Packages.** Briefing schreibt das auch vor.
- Bei neuen Produkt-Ideen: `OPEN_DECISIONS.md`, nicht spontan.

**Bitte lies in dieser Reihenfolge, BEVOR du das Briefing liest:**
1. `docs/visual-overhaul/PHASE1_STATUS.md` — aktueller Landing-Stand
   (Typo, Farben, Specificity-Pattern). Achtung: 72px-Wordmark wird
   durch das Redesign obsolet.
2. `docs/visual-overhaul/NUANCEN.md` — besonders 1 (unverhandelbar),
   11 (wird durch Redesign überholt), 12 (Pro-Tool-Details bleiben)
3. `docs/visual-overhaul/PRODUCT_STRATEGY_V1.md` §5 — Landing-Logik
   (Continue adaptiv, NUR Projekte, Quick Start, Discover)
4. `docs/visual-overhaul/PICKER_BUILD_STATUS.md` — was seit Brand-
   Session geändert wurde (Continue ist bereits horizontal-scroll)
5. `docs/visual-overhaul/OPEN_DECISIONS.md` — #2 (Hero-Verhalten) wird
   durch dieses Redesign entschieden → am Ende aktualisieren
6. `docs/visual-overhaul/ROADMAP.md` — aktive Phase
7. `src/components/landing/LandingPage.jsx` + `LandingPage.module.css`
   — der aktuelle Code, den du ersetzt
8. `src/styles/tokens.css` — die `--sg2-*`-Tokens (NICHT neue
   einführen)
9. `src/components/landing/` — schauen ob dort was anderes liegt

**Danach — warte auf meine Briefing-Nachricht.**

**Bevor du mit Code anfängst:**
- Bestätige: Repo-Docs gelesen
- Fasse in 3-5 Sätzen zusammen: aktueller Landing-Stand + was das
  Redesign ändert + wo ich Konflikte erwarte (Token-Mapping, NUANCEN 11)
- Warte auf Briefing
- Nach dem Briefing: Kurz-Abgleich Briefing ↔ Repo (Token-Mapping,
  File-Pfade wie `src/components/landing/` und nicht `src/pages/Home.jsx`,
  existierende Continue-Horizontal-Scroll-Basis)
- Konflikte als Fragen an mich, nicht als Fait-accompli
- Dann Komponenten-Reihenfolge vorschlagen, abwarten, Code schreiben

**Was am Ende dieser Session vorliegen muss:**
1. Landing-Page komplett umgebaut gemäß Briefing:
   - `Masthead.jsx` + `.module.css`
   - `DiscoverStrip.jsx` + `.module.css`
   - `ContinueStrip.jsx` + `.module.css`
   - `QuickStartBar.jsx` + `.module.css`
   - `LandingPage.jsx` als schlanker Container für die vier
   - `src/data/discover.json` (oder passender Pfad) mit Discover-Items
2. Akzeptanzkriterien-Check (alle 8 aus dem Briefing) im Status-Doc
3. NUANCEN.md: Punkt 11 aktualisiert (überholt / neu gefasst)
4. OPEN_DECISIONS.md: #2 (Hero-Verhalten) als entschieden markiert
5. `LANDING_REDESIGN_STATUS.md` (neu, analog PICKER_BUILD_STATUS) —
   was gebaut, welche Briefing-Punkte übernommen/angepasst/abgelehnt
   mit Begründung, welche Tokens gemappt wurden
6. ROADMAP aktualisiert (Landing-Redesign `[→]` → `[✓]`, Workspace-
   Planung `[→]`)
7. Neuer STARTPROMPT für den Workspace-Planning-Chat (Vorlage liegt
   in `git log` — Commit direkt vor diesem)
8. Grid Engine (42 Tests) bleibt grün

**Wichtig:**
- Das Briefing sagt „complete replacement files" — das passt zu meinem
  Wunsch „komplette Files, keine Diffs"
- Der Briefing spezifiziert konkrete Hex-Farben für Discover-Mood-Cards
  (#0F6E56, #3C3489, #791F1F, #633806) — die dürfen rein, sind
  Filmlook-Repräsentationen, nicht UI-Akzente
- **Continue-Card-Styling (Platzhalter-Regel):** Das Briefing schlägt
  rotierende semantische Farben (`bg-info` / `bg-warning` /
  `bg-secondary`) für Continue-Projekt-Cards vor — **nicht übernehmen.**
  Das würde UI-Status-Semantik zweckentfremden. Später kommen echte
  Keyframe-Thumbnails; bis dahin: einfarbige dunkle Card-Flächen mit
  dezenter Mood-Variation, analog zu den bestehenden Landing-Thumbs
  (`thumbNoir`, `thumbTeal`, `thumbAmber`, `thumbGreen`, `thumbRed`,
  `thumbAmber` in `LandingPage.module.css`). Keine bunten Status-Farben.
- **Session-Metadata im Masthead** (`v0.4.2 · 3 signatures · 18 prompts
  · saved 14m ago`): als statische Texte einbauen, aber jeden Zähler
  mit `{/* TODO(token-store): connect to signatures count */}` o.ä.
  markieren (ausser Version, die ist statisch). Einheitliches Format
  `TODO(token-store):` verwenden, damit der Token-Store-Chat später
  alles per `grep -r "TODO(token-store)"` findet. **Keine Fake-
  Zähl-Logik, keine halbfertige Store-Infrastruktur.** Saved-Time
  hängt vom Projekt-Store ab — nutze `TODO(workspace-store):` dafür.
- Mobile (<600px) ist kein Ziel für dieses Slice — im Briefing steht's,
  nicht überengineeren
- Bei Zweifel: nachfragen, nicht vorpreschen

Bereit? Schritt 0: Branch-Wechsel + Repo-Docs lesen + Zusammenfassung.
Dann warte auf das Briefing.
```
