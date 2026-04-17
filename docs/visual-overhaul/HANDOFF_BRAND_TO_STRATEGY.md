# Übergabe: Brand-Session → Produkt-Strategie-Session

**Datum:** 2026-04-17
**Vorgänger:** Brand-Session-Planungs-Chat (Opus 4.7)
**Nachfolger:** Produkt-Strategie-Planungs-Chat
**Status:** Brand-Session abgeschlossen, neue Phase eingeschoben

---

## Warum diese Session jetzt kommt (und nicht sofort der Picker)

Am Ende der Brand-Session hat Jonas beim Betrachten der fertigen Landing eine Produkt-Konzept-Frage aufgeworfen die nicht Visual-Overhaul-Scope ist, aber **vor dem Picker-Bau** geklärt werden muss:

> "Grids an denen man länger arbeitet — das ist Photoshop-Logik, passt nicht zum Tool. Man baut einen Grid zusammen in 2-5 Minuten, promptet ihn, fertig. Warum zeigt dann das Continue-Band auf der Landing 'woran du gearbeitet hast'?"

Aus dieser Frage hat sich im Gespräch die Einsicht entwickelt: **Das bestehende Datenmodell (Grid + Signature + Prompt) fehlt zwei Ebenen**, die für die Filmemacher-Realität zentral sind.

---

## Was Jonas konkret als richtig identifiziert hat

**1. Grid-Presets als neue Entity (persönliche Wiederverwendung):**
Zitat Jonas: "Ich baue mir meinen speziellen Grid für meinen speziellen Case zusammen, statt ihn jedes Mal aufs Neue zusammenzubauen speicher ich ihn und hab ihn immer direkt zur Hand, wahlweise auch direkt mit dem Stylecode/Signature den ich dafür gebaut hab und den Modulen."

Das ist ein **Konfigurations-Blueprint**: Case-Typ + Grid-Dimension + Module-Stack + Chips + optional verlinkter Signature. Aus dem Preset werden neue Grid-Instanzen erzeugt, die dann in NanoBanana geprompted werden.

**Beispiel:** "Angle Study 3×3 Kopf-Schulter-Preset mit Deakins-Signature" — nutzt Jonas für jeden neuen Charakter seiner Stadtserie, muss er nur den Charakter-Input ändern.

**2. Projekte als Parent-Container (narrative Organisation):**
Filmmakerisch arbeitet man nicht an einem Grid, sondern an einem **Film / einer Serie / einer Episode**. Darunter sammeln sich viele Assets: mehrere Grids für verschiedene Szenen, mehrere Signatures für verschiedene Looks, Prompts, später auch Film-Level-Artefakte.

**Beispiele:** "Stadtserie Ep. 02", "YOKURO Pilot", "Laundromat Owner Development".

Beide Ebenen sind unabhängig. Ein Grid-Preset ist wiederverwendbar **über** Projekte hinweg. Ein Projekt ist ein narrativer Container **für** Grids/Signatures/Prompts (die entweder aus Presets erstellt oder frei gebaut werden).

---

## Die konkreten offenen Fragen für diese Session

### A — Datenmodell

**A1:** Wie sieht ein **Projekt** minimal aus? (Name, Description, Thumbnail, Created-At, Last-Modified, Liste der zugehörigen Assets — minimal oder erweitert?)

**A2:** Wie sieht ein **Grid-Preset** minimal aus? (Blueprint der Grid-Konfiguration — was genau wird gespeichert? Welche Felder sind Preset-Bestandteil, welche werden bei Instantiierung neu befüllt?)

**A3:** **Signature-Verlinkung mit Preset** — optional oder verpflichtend? Wenn Jonas einen Preset speichert mit "Deakins-Signature angehängt" — ist das eine harte Referenz (Signature ändert sich → Preset ändert sich mit) oder ein Snapshot (Signature-Zustand wird beim Speichern eingefroren)?

**A4:** **Grid-Instanz zum Projekt zuordnen** — beim Erstellen verpflichtend? Oder kann ein Grid "lose" existieren ohne Projekt-Zugehörigkeit? (Jonas arbeitet manchmal explorativ — nicht jeder Grid ist für eine geplante Produktion.)

### B — UX / Workflow

**B1:** **Projekt erstellen** — wann passiert das? 
- Beim ersten Grid-Start (modal "zu welchem Projekt?")? 
- Separat als eigene Action ("Projekt anlegen") bevor man Grids baut? 
- Implizit (erste Untitled-Projekt wird automatisch angelegt, kann später umbenannt werden)?

**B2:** **Preset speichern** — wo und wie?
- Knopf im Grid Creator ("als Preset speichern")?
- Nach jeder Änderung fragt das System ob man die Preset-Variante überschreiben will?
- Eigener Preset-Manager als View im Grid Creator?

**B3:** **Preset anwenden** — wo im Flow?
- Im Picker als eigene Rubrik neben "Core Templates" und "Classics"?
- In einem Dropdown im Workspace?
- Beides?

**B4:** **Projekt-Wechsel während der Arbeit** — was passiert wenn Jonas mitten in einem Grid ist und das Projekt wechseln will? Wird der aktuelle Grid mitgenommen? Kopiert? Verworfen?

### C — Landing-Implikationen

**C1:** **Continue-Band** zeigt was jetzt?
- Option A: "Letzte Projekte" (primär Projekt-Items, "Stadtserie Ep. 02 — 2h ago")
- Option B: "Letzte Grids + Signatures + Prompts" (aktueller Stand, gemischt, wie aktuell)
- Option C: "Letzte Projekte + lose Einzel-Assets" (Mischung)

**C2:** **Discover-Band** — aktuell zeigt es Trending Signatures aus dem Hub. Bleibt so, oder kommen Trending Grid-Presets dazu?

**C3:** **Quick Start** — aktuelle Cards führen zu Grid Creator / SeenLab / SeenFrame / Hub. Ändert sich hier was durch Projekte? Z.B. "neues Projekt starten" als eigener Quick-Start-Eintrag?

### D — Picker-Implikationen (das ist der direkte Folge-Scope)

**D1:** **Picker-Eingang** — wie startet man einen neuen Grid?
- Im Kontext eines Projekts (man ist in Stadtserie Ep. 02 → neuer Grid → geht ins Projekt)?
- Projekt-unabhängig (man startet Grid → am Ende fragt das System wo es hinsoll)?
- Option zwischen beiden?

**D2:** **Template vs. Preset vs. Scratch** — wie sind diese drei im Picker sichtbar?
- Sind Presets die vierte Kategorie neben Core Templates / Classics / Scratch?
- Oder haben Presets eine prominente eigene Zone (weil es **persönliche** Assets sind, nicht generische Templates)?
- Was passiert mit dem Gold-Teal-System aus den NUANCEN? Presets sind persönliche Qualität → Gold-würdig, aber Templates sind neutral → Teal.

### E — Grid Creator + SeenLab Implikationen (Ausblick)

**E1:** Wie zeigt der **Grid Creator Workspace** das aktuelle Projekt? (Header-Info? Kontext-Spalte?)

**E2:** Wie zeigt **SeenLab** dass eine Signature zu einem Projekt gehört (oder nicht)?

**E3:** Kann eine Signature Projekt-spezifisch sein, oder sind Signatures immer global? (Wahrscheinlich global — aber verifizieren.)

Diese Fragen sind nicht für die Strategie-Session zu bauen, nur zu **entscheiden** damit der Picker-Planer und spätere Workspace-Planer darauf aufbauen können.

---

## Deine Rolle als Produkt-Strategie-Planer

Du bist **kein Code-Chat.** Du baust keine Komponenten, du schreibst keine CSS-Module, du entwickelst kein Datenmodell-Schema aus. 

Du bist **Konzept-Partner** für Jonas. Deine Aufgabe:

1. Die Fragen A–E durchgehen, **gemeinsam mit Jonas** Antworten finden
2. Bei jeder Frage **Optionen aufzeigen** (nicht die richtige Antwort vorgeben) — Jonas entscheidet, du strukturierst die Wahl
3. Am Ende die **Entscheidungen dokumentieren** in einem neuen Dokument: `PRODUCT_STRATEGY_V1.md`
4. Eine **saubere Übergabe an den Picker-Planer** schreiben: `HANDOFF_STRATEGY_TO_PICKER.md`
5. Einen **Startprompt für den Picker-Planer** schreiben: `STARTPROMPT_PICKER_PLANNING.md`

**Anti-Drift für diese Session:**

- **Du entwirfst nichts visuell.** Keine Mockups, keine Wireframes, keine Farben, keine Layouts. Das ist Picker-Planer-Scope.
- **Du entwirfst keine Code-Architektur.** Keine Komponenten-Hierarchie, keine State-Management-Entscheidungen. Das ist Code-Chat-Scope.
- **Du entscheidest nichts alleine.** Jonas entscheidet, du präsentierst Optionen mit Konsequenzen.
- **Du weichst nicht in Brand-Themen ab.** Brand-Entscheidungen sind final (dokumentiert in PHASE1_STATUS.md), werden nicht neu verhandelt.
- **Du dehnst den Scope nicht aus.** Wenn Jonas eine spannende Produkt-Idee hat die über die Fragen A–E hinausgeht — z.B. Kollaboration, Sharing, Version-Control — dann **notierst du sie für später** und ziehst zurück zum aktuellen Scope. Die Strategie-Session soll kurz sein (1-2h), nicht ausufern.

---

## Wer ist Jonas

Solo AI-Filmmaker, Nicht-Coder, Deutsch. Direkter Stil, brutale Ehrlichkeit. **Keine Sycophancy** ("Super Idee!", "Großartig!" — nie). Pushed sofort zurück bei Drift oder Halluzination. Kann visuell sehr gut beurteilen wenn etwas falsch wirkt — bei **Produkt-Konzept-Fragen** braucht er einen Gesprächspartner der die Implikationen durchdenkt und Optionen strukturiert, weil er nicht jede Folge-Wirkung selbst durchdenken muss. Er will kurze, präzise Antworten ohne Roman-Erklärungen.

**Wichtig:** Jonas ist als Nicht-Coder der einzige Kontextträger zwischen den Chats. Er muss nicht "den großen Plan im Kopf behalten" — aber er muss die kleinen Entscheidungen halten können. Dein Job: ihm die Entscheidungen so präsentieren dass sie **robust trotz Reset** sind.

---

## Was du zuerst machen sollst

Nach der Initialisierung und deinem Setup-Check, **bevor du mit den Fragen beginnst**:

**Pitch-Check mit Jonas:** Kurze Zusammenfassung der A–E-Fragen in einem Überblick (max 10 Zeilen), dann fragen ob die Reihenfolge passt oder ob er woanders starten will. Manche Fragen sind interdependent (z.B. A1 beeinflusst B1 beeinflusst D1). Jonas soll wählen ob er sequentiell durchgehen will oder ob er eine Hauptfrage hat die er sofort klären will und der Rest sich draus ableitet.

**Danach:** Frage für Frage durcharbeiten. Pro Frage: Optionen nennen, Konsequenzen erklären, Jonas entscheidet, du dokumentierst.

---

## Ergebnis dieser Session

Am Ende müssen drei Dokumente im Repo liegen:

1. **`docs/visual-overhaul/PRODUCT_STRATEGY_V1.md`** — die getroffenen Entscheidungen, strukturiert nach A–E, mit Begründungen. Primärquelle für Picker-Planer und alle späteren Planer.

2. **`docs/visual-overhaul/HANDOFF_STRATEGY_TO_PICKER.md`** — kompakte Übergabe an den Picker-Planer mit genau den Strategy-Entscheidungen die der Picker konkret braucht (vor allem D1, D2, und Teile aus B und C).

3. **`docs/visual-overhaul/STARTPROMPT_PICKER_PLANNING.md`** — der Prompt den Jonas in den nächsten Planungs-Chat reinkopiert. Analog zu dem Prompt mit dem du gestartet wurdest, aber für Picker-Phase.

Nicht bauen, nicht coden, nicht Visuelles entwerfen. Nur Entscheidungen, Dokumentation, saubere Übergabe.

---

## ROADMAP-Update am Ende dieser Session

Wenn alle Dokumente geschrieben und committed sind: Lies `docs/visual-overhaul/ROADMAP.md`, markiere die Produkt-Strategie-Session als `[✓]` und die Picker-Phase als `[→]`. Stand-Datum aktualisieren. Committen als `docs: product strategy complete, picker phase active`.

---

## Bestehende Dokumente die du lesen musst

**Pflicht:**
- `docs/visual-overhaul/ROADMAP.md` — aktuelle Phasen-Übersicht
- `docs/visual-overhaul/PHASE1_STATUS.md` — Brand-Session-Ergebnis, finale Brand-Entscheidungen
- `docs/visual-overhaul/NUANCEN.md` — Anti-Drift-Leitplanken, besonders Punkt 1 (Gold-Teal-System), Punkt 10 (Signature-Naming), Punkt 13 (Tools-First)
- Dieses Dokument (du liest es gerade)

**Kontext-Relevant (Ausschnittsweise):**
- `docs/visual-overhaul/SEENGRID_VISUAL_OVERHAUL_HANDOFF_v2.md` — nur Abschnitte **8 (Token-System/Signatures-Architektur)** und **10 (Grid Creator Überblick)**. Der Rest ist für dich nicht relevant — visuelle Specs interessieren dich nicht.

**Nicht lesen:**
- Mockup-Files (sind visuelle Referenz, nicht Produkt-Strategie)
- Brand-Detail-Docs (Tooltip-Fixes, Font-Diagnose etc.)
- Code-Files

---

**Ende Übergabe.**
