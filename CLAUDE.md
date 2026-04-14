# CLAUDE.md — SeenGrid

---

## CURRENT STATUS — ZUERST LESEN

**Stand:** 2026-04-14
**Aktueller Pilot:** Pilot 1 — Character Study (Two-Step Flow)
**Phase:** 6 (empirische NanoBanana-Validierung) — Rebuild-Slice fertig, NanoBanana-Gegentest steht aus
**Working Branch:** `claude/modular-grid-operator-98Bcq` — der Modular-Code lebt hier, der Rebuild ist hier passiert, ab jetzt der einzige aktive Branch
**Rescue-Planungs-Archiv (nicht anfassen):** `claude/reconstruct-seengrid-history-EqIn8` — auf diesem Branch fand am 2026-04-14 die Diagnose und der Strict Diff statt. Enthält die frühen Versionen der Ground-Truth-Datei und der CLAUDE.md-Rescue-Additionen (wurden per Cherry-Pick hierher gebracht). Nicht löschen bis Rettung abgeschlossen, nicht weiterentwickeln.

**Was ist der Zustand:**
- Phase 5 war der letzte vorherige saubere Stand (5/5 Beispiele byte-exact grün bei NanoBanana validiert).
- Phase 6 hatte semantischen Drift: ein vorheriger Opus-Chat ohne Projektkontext hatte ChatGPT-optimierte Prompts verwässert.
- Die Wahrheitsquelle für Pilot 1 ist `DISTILLATIONS/character-study-chatgpt-groundtruth.md` (NanoBanana-validiert, wortwörtlich von Jonas mit ChatGPT erarbeitet, nicht editieren ohne Re-Test).
- **Rebuild-Slice abgeschlossen am 2026-04-14:** der 4-Winkel Cinematic Angle Study Fall ist neu gebaut über zwei neue Skeleton-Dateien plus Routing in `renderCharacterStudy`. Die alten Skeletons sind unverändert geblieben (uncertified Modi laufen byte-stable weiter).
- **Nächster Schritt:** Jonas testet die 3 neuen Goldens empirisch in NanoBanana gegen die GT. Wenn der Bildtest bestanden ist, ist Phase 6 zu für den 4-Winkel Fall. Erst danach: nächster Slice (entweder eigene GT für einen der uncertified Modi, oder neuer Pilot).

**Was Phase-6-Rebuild konkret gemacht hat:**
- NEU: `src/data/skeletons/character-study-cinematic-strip.json` (10 Blöcke, Title-Case-Header mit Doppelpunkt, semantische Reference-Labels)
- NEU: `src/data/skeletons/character-study-cinematic-normalizer.json` (9 Blöcke, GT Step-1-Form)
- NEU: in `src/lib/skeletonRenderer.js` 19 neue Block-Renderer (`cstrip_*`, `cnorm_*`) plus `shouldUseCinematicStrip()` Routing-Predicate in `renderCharacterStudy`
- Test-Cases `example-a` und `example-a2` umgestellt von `rows: 2, cols: 2` auf `rows: 1, cols: 4` (entspricht GT "four tall vertical panels arranged side by side in a single horizontal row")
- 3 Goldens neu geschrieben: `example-a.txt`, `example-a2-step1.txt`, `example-a2-step2.txt` — alle drei byte-exact mit der GT verifiziert (Script-gestützter Vergleich gegen die zwei Code-Blocks im GT-Markdown)
- 8 Legacy-Goldens (`example-b/c/d/e/c2/d2-*`) byte-stable unverändert — sie laufen über den alten Pfad weil das Routing-Predicate sie ausschließt
- Test-Status: **8 / 8 grün** (`node tests/renderCharacterStudy.test.js`)
- Wichtige Konsequenz der semantischen Labels: Step 2 clean (`example-a.txt`) ist byte-identisch zu Step 2 nach Normalizer (`example-a2-step2.txt`). Der `STEP2_MASTER_LABEL`-Override ist auf dem neuen Pfad obsolet (existiert nur noch als Fallback im alten Pfad).

**Routing-Bedingung für den neuen Pfad** (`shouldUseCinematicStrip`):
- `mode === 'cinematic'`
- `mod_d.active === true`
- `preset.framing_mode === 'uniform_full_body'`
- `mod_a.active === true` (face crop vorhanden)

Alles andere fällt durch zum alten (uncertified) Pfad.

**Bekannte Limitierungen des neuen Pfads** (für Phase 6 OK, später erweitern):
- MOD-J (Style Overlay), MOD-G (Strict View Rules), und MOD-H Custom/Neutral werden auf dem neuen Pfad **silent ignoriert**, weil sie nicht in der GT validiert sind. Wenn der User sie aktiviert, kommt trotzdem der reine GT-Output.
- Andere Panel-Counts (1×3, 1×5, 1×6) sind im neuen Skeleton parameterisiert (`{n_word}`, `{n_word_capitalized}`), aber bisher nur 1×4 byte-exact validiert.

**NICHT anfassen ohne explizite Freigabe von Jonas:**
- Die 18 Legacy-Presets in `src/data/presets/` (Phase-1-Snapshot, unabhängig von modularer Arbeit)
- `OPUS_CODE_HANDOFF.md` und `ROADMAP.md` Sync — bleiben bewusst auf "Phase 6 in Arbeit" stehen bis Phase 6 vollständig nach NanoBanana-Test grün ist
- Merge auf `main` — erst nach Phase 6 Abschluss für Pilot 1 (nach NanoBanana-Test)
- Löschung alter Branches — erst nach Abschluss der Rettung
- Die alten Skeletons `character-study.json` und `character-study-normalizer.json` — bewusst unverändert gelassen, sie tragen die uncertified Modi
- Die "uncertified" Modi (Expression Board, 3×3, Env-Ref, Technical Sheet) — nicht verschlimmbessern, nicht löschen, erst eigener Slice mit eigener GT

**Offene Scope-Entscheidungen (NICHT heimlich lösen, zuerst Jonas fragen):**
- Modulare Panel-Anzahl UI (1×2 / 1×3 / 1×5 / 1×6 Buttons für Character Study) — verschoben auf Post-Pilot-Phase, explizit NICHT Teil von Phase 6. Die Engine ist parameterisiert über `{n_word}`, nur die UI-Buttons kommen später
- Technical Sheet Mode Status — Klärung pending, aktuell läuft auf altem Pfad und ist uncertified
- Eigene Ground-Truth-Dateien für die uncertified Modi (Expression, 3×3, Env-Ref, Technical) — Entscheidung später welche davon überhaupt im Produkt bleiben
- Soll der neue Skeleton-Pfad MOD-J / MOD-G / MOD-H Custom unterstützen? Aktuell silent ignoriert. Wenn ja: braucht eigene GT-Validierung pro Variante

Dieser Block ist die Wahrheit über den Projektzustand. Jeder Chat liest ihn als ERSTE Handlung und aktualisiert ihn als LETZTE Handlung vor dem finalen Commit.

---

## Was ist SeenGrid?
SeenGrid ist ein modulares Operator-Tool für AI-Film-/Bild-Workflows. Es soll als eigenständige Web-App (Vite + React) gebaut werden, deploybar auf Vercel/Netlify.

Es ist KEIN generischer Prompt-Builder. Es ist ein Produktions- und Orchestrierungssystem für NanoBanana / Kling / Seedance / Midjourney Workflows.

## Der Nutzer
Solo AI-Filmemacher. Kommuniziert auf Deutsch, denkt in Filmlogik. Hat starke Prompt-Engineering-Instinkte. Bevorzugt brutale Ehrlichkeit, kein Sycophancy. Toleriert keine generischen AI-Outputs.

---

## ARCHITEKTUR — Die 4 Ebenen

### Ebene 1: Operator
Die allgemeine Maschine. Beispiele: Grid Operator, Sequence Operator, Character Operator, Prompt Operator, Style Operator, Scene Operator.

### Ebene 2: Mode
Anwendungsmodus innerhalb eines Operators. Beispiele: world study, character study, multishot scene, start-end pair, progression, expression board, detail strip.

### Ebene 3: Preset Layer
Die Prompt-/Ausgabeform. Es gibt 4 Status-Stufen:
- **Core** — Allgemeine NanoBanana-optimierte Standardlogik (siehe Core-Regeln unten)
- **SeenGrid Optimized** — Die bewährten, hochoptimierten Spezialformate des Nutzers (aus DeepSeek1.txt). Diese enthalten VOLLSTÄNDIGE paste-ready Prompts mit Reference-Priority, FORBIDDEN-Listen, LAYOUT-Regeln etc.
- **Experimental** — Neue, noch nicht validierte Varianten
- **Deprecated** — Veraltete Formate, dokumentiert aber nicht empfohlen

### Ebene 4: Instance
Die aktuelle Nutzung eines Operators mit konkreten Parametern.

---

## KRITISCHE ARCHITEKTUR-REGELN

### 1. Datengetrieben, nicht hardcoded
Alle Inhalte (Styles, Presets, Prompts, Templates) müssen in editierbaren Daten-/JSON-Dateien liegen, NICHT im UI-Code verteilt. Der Nutzer muss Inhalte ändern können ohne dass die App neu gebaut wird.

### 2. Core ≠ SeenGrid Optimized
- **Core**: Nutzt die NanoBanana-Optimierungsregeln (system-prompt-en.md) um allgemein gute Prompts zu erzeugen. Feeling Words → Professional Terms, Adjektive → Parameter, Negative Constraints, Sensory Stacking, Grouping, Format Adaptation.
- **SeenGrid Optimized**: Die EXAKTEN Prompt-Templates aus DeepSeek1.txt — vollständige, paste-ready Prompts mit allen Regeln. Wenn der Nutzer "Character Angle Study ★" wählt, kommt der KOMPLETTE optimierte Prompt raus, nicht eine leere Grid-Tabelle.

### 3. Modulares Grid statt feste Buttons
Der Grid Operator hat KEINE festen "2x2" oder "3x3" Buttons. Stattdessen: frei wählbare Rows/Columns (1-5), plus Presets die bestimmte Konfigurationen vorbelegen.

### 4. Prompt-Output = Paste-Ready
Jeder Output muss DIREKT in NanoBanana/MJ/Kling kopierbar sein. Kein generisches Listing, sondern vollständige Prompts im richtigen Format.

---

## ARBEITSREGELN GEGEN DRIFT

Diese sechs Regeln sind entstanden aus dem Phase-6-Rettungsfall vom 2026-04-14. Sie sind nicht optional. Jeder Chat der SeenGrid anfasst hält sich daran ohne Ausnahme. Der gesamte Sinn dieser Regeln ist: kein Chat kann mehr heimlich driften, und kein Chat startet mehr aus einem leeren Kontext.

### Regel 1: STATUS-Block zuerst lesen, zuletzt aktualisieren
Der "CURRENT STATUS" Block oben in dieser Datei ist die Wahrheit über den aktuellen Projekt-Zustand. Jeder neue Chat liest ihn als erste Handlung und weiß damit sofort wo er steht. Jeder Chat aktualisiert ihn als letzte Handlung vor dem finalen Commit mit dem neuen Stand. Keine Session endet mit veraltetem Status-Block.

### Regel 2: Working Branch Pin
Der "Working Branch" aus dem STATUS-Block ist der einzige Branch auf dem Arbeit geschieht. Keine neuen Branches ohne explizite Freigabe von Jonas im Chat. Wenn die Claude-Code-Harness automatisch einen neuen Branch anlegt, wechselt der Chat als erste Handlung zurück auf den Working Branch. Branch-Chaos entsteht sonst durch Default-Verhalten, nicht durch Absicht.

### Regel 3: Ground-Truth-Datei pro Preset
Jedes Preset (Character Study, Char+World Merge, Start/Endframe, World Zone Board, Multishot Sequence) bekommt EINE wortwörtliche Wahrheitsquelle unter `DISTILLATIONS/<pilot>-chatgpt-groundtruth.md`. Diese Datei enthält die mit ChatGPT erarbeiteten und empirisch bei NanoBanana validierten Prompts, unverändert, in Code-Blöcken. Kein Code-Change an einem Preset ohne dass diese Datei existiert und der Chat sie vollständig gelesen hat. Jeder gerenderte Prompt-Output wird byte-exact gegen diese Datei gedifft. Abweichung = Bug in der Repo, niemals in der Ground Truth.

### Regel 4: Rendered-Output-Review vor Commit
Bevor irgendein Commit Prompt-Inhalt verändert (Skeletons, Module, Goldens, Renderer-Logik), postet der Chat den vollständig gerenderten Prompt im Chat zur Freigabe. Jonas sagt "ja" oder "nein". Erst bei "ja" wird committet. Das ist der Echtzeit-Drift-Catcher — keine Abkürzung, auch nicht bei vermeintlich "kleinen" Änderungen. Jonas ist kein Coder, aber er erkennt sofort ob ein Prompt-Text stimmt oder nicht.

### Regel 5: Slice-Disziplin
Ein Chat = ein Slice. Ein Slice ist: ein einzelner Block in einem Skeleton, ein einzelnes Modul, eine einzelne Golden-Datei, eine einzelne Patch-Zeile. "Phase 6 implementieren", "Pilot 2 bauen", "Modularen Panel-Count einbauen" sind KEINE Slices — das sind Projekte. Wenn ein Chat beim Lesen seines Auftrags merkt dass der Scope zu groß ist, stoppt er und fragt Jonas ob er splitten soll. Lieber zehn kleine Chats die je eine Sache richtig erledigen als ein großer Chat der vier Sachen halb macht. Genau daran ist der 2-step Opus am 2026-04-14 verstorben.

### Regel 6: Session-Übergabe-Protokoll
Jede Session schließt sich selbst sauber ab. Der nächste Chat startet NIEMALS aus einem leeren Kontext. Reihenfolge am Ende jeder Session, zwingend:

1. STATUS-Block oben in CLAUDE.md aktualisieren: neuer Stand, was wurde in dieser Session erledigt, was ist der nächste konkrete Schritt, was sind neue offene Punkte, welche Scope-Entscheidungen sind jetzt pending
2. Falls `OPUS_CODE_HANDOFF.md` im Repo existiert und mit der aktuellen Phase synchron sein soll: auch dort die Session-Zusammenfassung nachziehen
3. Letzter Commit der Session enthält diese Status-Updates und trägt die Session-ID im Commit-Body
4. Im Chat eine kurze schriftliche Übergabe posten: "Nächster Chat liest CLAUDE.md Status-Block, dann `DISTILLATIONS/<pilot>-chatgpt-groundtruth.md`, dann letzter Commit auf Working Branch, dann startet mit Schritt X."

Diese drei Quellen zusammen — STATUS-Block, Ground-Truth-Datei für den aktiven Piloten, letzter Commit — müssen ausreichen damit ein neuer Chat ohne manuelles Briefing von Jonas weiterarbeiten kann. Wenn eine Session endet ohne dass diese drei Quellen synchron sind, ist die Session nicht korrekt abgeschlossen.

---

## WAS GEBAUT WERDEN MUSS

### Phase 1: Kern (JETZT)

#### A. Prompt Builder (NanoBanana-optimiert)
- Chip-basierte Auswahl für: Style, Camera, Lens, Focal Length, Aperture, Aspect Ratio, Shot Size, Camera Angle, Lighting, Color Grade, Effects, Negative Prompt
- KEINE Kamera-Bewegung (Dolly, Steadicam etc.) — das ist Video/Kling-Kram, nicht relevant für NanoBanana Bildgenerierung
- Core-Modus: Prompt-Assembly nach NanoBanana-Optimierungsregeln
- Quality Suffix Toggle (8K)
- Tooltips auf JEDEM Chip (Beschreibung was der Begriff macht)
- Copy-to-Clipboard
- Random-Generator: Szenentext aus Bausteinen (Setting + Subjekt + Aktion + Stimmung) UND alle Optionen zufällig

#### B. Grid Operator
- Frei wählbare Rows/Columns (1-5)
- Presets mit VOLLSTÄNDIGEN Prompt-Templates (SeenGrid Optimized):
  - World Zone Board (3x3)
  - 2x2 Multi-Shot (Single-Zone + Cross-Zone Versionen)
  - Character Angle Study (mehrere Varianten — photorealistic + cinematic)
  - Start-End Pair
  - Expression Board
  - Detail Anchor Strip
  - Jedes weitere Format aus DeepSeek1.txt
- Core-Modus: Generischer Grid-Builder mit NanoBanana-Optimierung
- Panel-Rollen editierbar
- Layout-Optionen als Buttons (Even, Letterbox, Seamless, Framed, Storyboard, Polaroid)
- Output = KOMPLETTER paste-ready Prompt

#### C. MJ Startframe Modul
- 5-Element-Architektur: Medium-Anker → Szene → Licht (konkrete Quelle!) → Emotionaler Hook → Filmstock + --ar --raw
- 6 Templates (Establishing Wide, Enger Raum, Detail/CU, Charakter partiell, Pillow Shot, Oberfläche/Textur)
- Anti-Pattern-Warnung (verbotene Wörter)
- Filmstock-Auswahl mit Beschreibungen
- Random-Generator
- Output = paste-ready MJ Prompt

#### D. Prompt Vault / Community Prompts
- Integration der 1500+ NanoBanana-Trending-Prompts aus: https://github.com/jau123/nanobanana-trending-prompts
- Clone/Download des Repos, Prompts als JSON laden
- Die JSON-Daten enthalten: Prompt-Text, Bild-URL (Vorschaubild vom Original-Post), Kategorie, Likes/Engagement-Score
- GALERIE mit Vorschaubildern bauen! Nicht nur Textliste. Der Nutzer will sehen was der Prompt erzeugt.
- Kategorisiert, durchsuchbar, nach Engagement sortierbar, copy-ready
- Eigene Kategorie/Tab in der App ("Vault" oder "Community")

### Phase 2: Erweiterung (SPÄTER)
- Kling/Seedance Formatvorlagen mit T1-T9 Regeln
- Kamera-Bewegungen und Module C Techniken (NUR für Video/Kling/Seedance, NICHT für Bildgenerierung)
- Workflow Layer Grundstruktur (geführte Schrittketten)
- Character Operator mit Multi-Varianten

### Phase 3: Vollständige App
- Alles zusammen deploybar
- Workflow Guide (manuell geführte Pipeline)
- Später: Automation Layer Andockpunkte (NICHT jetzt bauen)

---

## DATENQUELLEN IM PROJEKTORDNER

1. **SeenGrid_grundgeruest_fuer_claude.md** — Konzeptionelles Grundgerüst, Architektur, Prinzipien
2. **SEENGRID_STRATEGY_AND_FUTURE_VISION_BRIEFING.txt** — Strategischer Kontext, Langfrist-Vision (NICHT jetzt alles bauen, nur Architektur nicht verbauen)
3. **DeepSeek1.txt** — 77 extrahierte Items: MJ-Templates, Kling-Regeln, Seedance-Regeln, Grid-Presets, Kamera-Techniken. Die SeenGrid Optimized Presets kommen hieraus.
4. **popup.js / popup.html / popup.css** — Bestehender CinePrompt Prompt-Builder (Browser Extension). Datenstruktur und Chip-Kategorien als Referenz für den Library Layer. ACHTUNG: Enthält "Kamera Bewegung" als Kategorie — das ist FALSCH für Bildgenerierung und soll NICHT übernommen werden. Nur die bildrelevanten Kategorien verwenden (Style, Camera, Lens, Focal, Aperture, Lighting, Color Grade, Shot Size, Camera Angle, Aspect Ratio, Effects, Negative).
5. **NanoBanana System Prompt** — https://github.com/jau123/nanobanana-trending-prompts/blob/main/prompts/system-prompt-en.md — Die 6 Core-Regeln für NanoBanana-Prompt-Optimierung
6. **Trending Prompts Repo** — https://github.com/jau123/nanobanana-trending-prompts — 1500+ Community-Prompts als JSON

---

## DESIGN-ANFORDERUNGEN

- **KEIN generisches/default Template.** Die App soll professionell und eigenständig aussehen.
- Moderne, distinctive Schriftart (NICHT Inter, Roboto, Arial, System-Default)
- Cinematic Dark Theme — das Tool ist für Filmemacher
- Breites, großzügiges Layout — NICHT in ein schmales 500px Feld gequetscht
- Logo-Platzhalter (Nutzer erstellt eigenes Logo später)
- Responsive, aber Desktop-First
- Tooltip auf JEDEM interaktiven Element

---

## TECHNISCHE ANFORDERUNGEN

- Vite + React
- Keine Backend-Abhängigkeit
- Daten in JSON-Dateien (src/data/ oder public/data/)
- Deploybar auf Vercel/Netlify
- `npm run dev` für lokale Entwicklung

---

## PROJEKTSTRUKTUR (empfohlen)

```
SeenGrid/
  CLAUDE.md
  package.json
  vite.config.js
  public/
  src/
    App.jsx
    components/
    data/
      styles.json
      cameras.json
      lenses.json
      operators.json
      presets/
        character-angle-study.json
        world-zone-board.json
        multishot-2x2.json
        ... (jedes SeenGrid Optimized Preset als eigene Datei)
      mj/
        templates.json
        forbidden.json
        filmstocks.json
      community/
        trending-prompts.json  (aus GitHub Repo)
    styles/
```

---

## SELBST-VALIDIERUNG (nach jeder größeren Komponente)

Nach Fertigstellung jeder Komponente (Prompt Builder, Grid Operator, MJ Modul, Prompt Vault, etc.) MUSST du folgendes tun bevor du weiterbaust:

1. Lies CLAUDE.md erneut
2. Lies DeepSeek1.txt erneut (zumindest die relevanten Items)
3. Prüfe ob dein Output mit den Vorgaben übereinstimmt
4. Prüfe insbesondere: Sind die Prompt-Outputs paste-ready oder nur generische Auflistungen? Sind die SeenGrid Optimized Presets die EXAKTEN Templates aus den Quelldaten? Hast du Konzepte erfunden die nicht in den Quelldokumenten stehen?
5. Fasse zusammen was du gebaut hast und was als nächstes kommt
6. Erst dann weiterbauen

Diese Selbstvalidierung ist PFLICHT, nicht optional.

---

## WAS NIEMALS PASSIEREN DARF

- Prompt-Output der nur Panel-Nummern auflistet statt paste-ready Prompts
- Hardcoded Inhalte im UI-Code statt in Daten-Dateien
- Generisches Design das wie jedes andere AI-Tool aussieht
- Features erfinden die nicht in den Quelldokumenten stehen
- "Subject Lock" oder "Continuity" als UI-Konzepte verwenden wenn sie nicht im NanoBanana-Workflow existieren
- Zu schmale UI die alles zusammenquetscht
