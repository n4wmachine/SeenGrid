# CLAUDE.md — SeenGrid

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
