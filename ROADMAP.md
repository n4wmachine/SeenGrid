# SEENGRID — ROADMAP & PERSISTENTES GEDÄCHTNIS

> **Für Claude:** Diese Datei zuerst lesen bei jedem neuen Chat. Sie ist das langfristige Gedächtnis des Projekts. `OPUS_CODE_HANDOFF.md` ist der aktuelle Snapshot-Zustand, `CLAUDE.md` ist die Projekt-Bibel. Diese Datei = Richtung, Entscheidungen, Ideen.

---

## 1. DESIGN-ENTSCHEIDUNGEN (festgelegt, nicht mehr diskutieren)

### Naming & Terminologie
- **Random-Modi:** `Beat` / `Look` / `Full Scene`
  - **Beat** = nur narrative Felder (Location, Object, Figure, Context, Hook). Filmbegriff für Story-Moment.
  - **Look** = nur visuelle Parameter (Filmstock, AR, Modifier, Genre, Light, Perspective, Direction, Time-of-Day). Bildsprache.
  - **Full Scene** = alles zusammen.
- **SeenGrid Optimized → `SeenGrid Signature`** (mit goldenem Stern ★)
- **Grid-Modi:** `Core` (default) / `SeenGrid Signature` / `Custom Grid`
- **Default-Mode beim Öffnen:** `Core` (Mittelweg — Signature für Anfänger, Custom für Profis, Core für alle dazwischen)

### Farben & Akzente
- **Teal `#2bb5b2`** = Standard-Akzent (Core, Custom, UI-Elemente, active states)
- **Gold/Amber** = Signature-Akzent (Stern neben "SeenGrid Signature", Stern neben jedem Signature-Preset, Hover-Glow bei Signature-Elementen)
- Die goldene Akzentfarbe hebt Signature klar als Premium-Klasse ab.
- CSS-Variablen heißen noch `--sg-gold-*` (Werte sind aktuell Teal) — bei Signature-Umbau wird eine neue echte Gold-Variable eingeführt, z.B. `--sg-signature-gold` / `--sg-signature-glow`.

### Typografie
- **Space Grotesk** = Body, Chips, Buttons, Labels (alles außer Output)
- **JetBrains Mono** = NUR Prompt-Output, Section-Labels, Badges, Zeichenzähler
- Regel strikt halten, keine Mischerei.

---

## 2. ARCHITEKTUR-LEITPLANKEN (niemals brechen)

### Datengetrieben, nicht hardcoded
- **Alle Inhalte in JSON-Dateien** unter `src/data/`. Kein Content im Component-Code.
- **Presets, Templates, Modes, Random-Pools, Categories** — alles JSON.
- Der User muss Inhalte ändern können, **ohne eine Zeile Component-Code anzufassen**.

### Dynamische Preset-Architektur (KRITISCH)
- Jede Preset-JSON hat ein `category`-Feld (z.B. `"category": "character"`)
- Component liest alle Presets, gruppiert automatisch nach `category`
- Gruppen-Metadaten (Label DE/EN, Sortier-Reihenfolge) in `src/data/presets/_categories.json`
- **Robustheit-Regeln:**
  - Preset mit unbekannter Category → fällt automatisch in "Other"-Gruppe, nichts crasht
  - Leere Category (im Mapping aber ohne Presets) → wird nicht gerendert
  - Neue Preset-Datei hinzufügen → nur Import + JSON-Datei, keine Logik-Änderung nötig
- **Gleiche Regel für:** Core-Templates, MJ-Templates, Random-Pools, Filmstocks, Modifier, Genre, etc.

### Sprache-Konsistenz (DE/EN)
- **UI-Strings:** via `useLang().t('key')` aus `LangContext`
- **Daten-Beschreibungen:** jede JSON hat `label_de` / `label_en` und `desc_de` / `desc_en` statt nur `label` / `desc`
- **Prompts selbst bleiben IMMER englisch** (werden in MJ/NanoBanana gepastet — Zielsystem ist englisch)
- **Tooltips überall:** jeder interaktive Button/Chip/Input hat einen `title=` der durch i18n läuft
- Beim Sprachwechsel DE↔EN darf NICHTS im UI englisch bleiben (außer die generierten Prompts).

### Tooltips
- Jeder interaktive Element MUSS einen Tooltip haben
- Tooltips erklären was der Begriff/Parameter tut (nicht nur den Namen wiederholen)
- Tooltips durch i18n lokalisiert

---

## 3. AKTIVE BAUSTELLE

### Aktuelle Stufe: **1 — GridOperator Scroll-Fix**
CSS-Bug in `GridOperator.module.css:405-408`. Die `.previewColumn` hat `position: sticky` aber kein `max-height` / `overflow-y: auto`. Bei hohem Content ist der Output-Bereich unerreichbar. 5-Zeilen-Fix.

---

## 4. NÄCHSTE STUFEN (Checkliste, der Reihe nach)

- [ ] **Stufe 1** — GridOperator CSS Scroll-Fix (`.previewColumn` max-height + overflow)
- [ ] **Stufe 2** — Sprache-Konsistenz: alle JSON-Dateien auf `desc_de`/`desc_en`/`label_de`/`label_en` umstellen, alle Tooltips reviewen, LangContext-Mapping prüfen
- [ ] **Stufe 3** — GridOperator Komplett-Umbau:
  - Default = Core
  - "SeenGrid Signature" Wording + goldener ★ + Gold-Glow
  - Preset-Gruppierung nach Use-Case (Character / World / Multi-Shot / Detail / Layout) — dynamisch aus `_categories.json`
  - Jede Preset-JSON kriegt `category`-Feld
  - Controls (Layout, Style Override, Panel Roles) nach oben, Preset-Liste collapsible/weiter unten
  - Mode-Toggle prominenter (Pills statt unauffällige Leiste)
  - Section-Icons (SVG)
- [ ] **Stufe 4** — MJ Random komplett neu:
  - Neue `src/data/mj/random-pools.json` mit Pools pro Feld-Typ
  - Narrative Pools: 100–200+ Einträge (locations, objects, contexts, figures, hooks, textures, surfaces, details, what-is-dark, what-where, visible-areas, spaces, etc.)
  - Visuelle Pools: 30–60 Einträge (filmstock, modifier, genre, directions, perspectives, times)
  - Total ~1500–2000 narrative Bausteine
  - Neuer `handleRandom`: iteriert über `tpl.fields`, zieht pro `field.id` aus passendem Pool, fallback auf `field.examples[0]`
  - Anti-Wiederholung: letzte 8 gezogene pro Pool im State ausschließen
  - `Beat / Look / Full Scene` Toggle neben Random-Button
- [ ] **Stufe 5** — Header / Logo / Tab-Optik:
  - Logo-Datei inspizieren (PNG vs SVG?)
  - 2 Varianten bauen: (a) SVG mit currentColor + Glow (b) mix-blend-mode bei PNG
  - Größer machen, evtl. Wordmark daneben
  - Header-Tabs: Pills mit Hover-Glow, Icons vor Labels, aktiver Tab mit Teal-Background
- [ ] **Stufe 6** — Section-Icons über alle Tabs (SVG, aus Lucide oder custom)
  - Prompt Builder: Style, Camera, Lens, Lighting, etc. jeweils mit Icon
  - Grid, MJ, Vault: Section-Header mit Icons

---

## 5. IDEEN-POOL FÜR VISUAL OVERHAUL (Phase 2, später)

### Vorschaubilder auf Kacheln (wichtigste Idee)
- **Wörter direkt auf Vorschaubild** — wie Premiere Pro Presets / Magic Bullet Looks
- Kachel mit Bild-Hintergrund, Label als Overlay
- Gilt für: **Filmstocks, Camera-Angles, Lens-Looks, Color-Grades, Presets, MJ-Templates**
- Das ist die professionelle Zielversion der UI.

### Weitere Visual-Overhaul-Ideen
- Mini-Preview-Thumbnails für jeden Filmstock (Kodak Vision3 200T zeigt Beispielbild im Hover)
- Animierte Hover-Previews bei Presets
- Grid-Preset-Cards mit echten Beispiel-Grids als Hintergrund
- Lightbox/Expand für Preview-Kachel bei Click
- Dark/Light Theme Toggle (aktuell nur Dark)
- Tooltip-Previews mit Mini-Bild

### Asset-Pipeline für Phase 2
- Bilder per NanoBanana generieren, User kuratiert aus
- `public/previews/{category}/{id}.webp` Struktur
- Lazy-Loading für Performance
- Placeholder-Shimmer während Loading

---

## 6. OFFENE ENTSCHEIDUNGEN (auf User-Antwort warten)

_aktuell keine — alle 3 Rückfragen beantwortet: Beat ✓, SeenGrid Signature + Gold ✓, Core als Default ✓_

---

## 7. LESSONS LEARNED (nicht wiederholen)

- **Zwei-LLM-Setup (Opus creative + Sonnet code) funktioniert NICHT.** Zu viel Kontext-Verlust, Stille-Post-Fehler. Deshalb arbeite ich (Opus) direkt im Code.
- **Textanweisungen an Sonnet funktionierten nicht.** Komplette Dateien zum 1:1 Copy-Paste funktionieren.
- **Jonas ist kein Webdev.** Keine abstrakten Konzepte erklären, sondern konkrete Anweisungen / fertige Dateien.
- **`position: sticky` ohne `max-height` + `overflow-y: auto`** bricht Scroll wenn Content höher als Viewport. Siehe GridOperator Stufe 1.
- **Keyboard-Shortcut `Ctrl+Shift+R`** kollidiert mit Browser Hard-Refresh. Nicht verwenden. Wir nutzen `Ctrl+Shift+G` für Random, `Ctrl+Shift+C` für Copy.
- **Zwischen Random-Templates und Random-Pools nicht verwechseln.** `handleRandom` muss template-agnostisch sein: iteriert über die Felder des aktuell ausgewählten Templates und zieht pro Feld aus dem passenden Pool. Sonst bleiben Placeholders wie `[OBJECT]` stehen (der Bug den User gemeldet hat).

---

## 8. WORKFLOW-REGELN FÜR CLAUDE

### Beim Start eines neuen Chats
1. Diese Datei (`ROADMAP.md`) zuerst lesen
2. Dann `CLAUDE.md` (Projekt-Bibel)
3. Dann `OPUS_CODE_HANDOFF.md` (aktueller Snapshot)
4. Dann an der aktiven Stufe (Abschnitt 3) weiterarbeiten

### Nach jeder abgeschlossenen Stufe
1. Diese Datei updaten: Stufe in Abschnitt 4 abhaken, neue "Aktuelle Stufe" in Abschnitt 3 setzen
2. Lessons Learned ergänzen wenn was Überraschendes passiert ist
3. Ideen-Pool ergänzen wenn neue Ideen aufgetaucht sind
4. Commit + Push mit klarer Message

### Bei neuen Ideen vom User
- Sofort in Abschnitt 5 (Visual Overhaul Ideen) oder Abschnitt 4 (Stufen) notieren
- Nicht darauf verlassen dass sie im Chat-Kontext bleiben
- Chat wird irgendwann komprimiert → ROADMAP.md ist die einzige persistente Quelle

### Branch & Commit
- Development-Branch: siehe Chat-System-Prompt (aktuell `claude/read-handoff-context-CPMDU`)
- GPG Signing bypassen: `git -c commit.gpgsign=false commit -m "..."`
- Keine Push ohne User-Freigabe
- Commit-Messages klar auf Deutsch oder Englisch, Stufennummer erwähnen

---

## 9. VERKNÜPFUNG ZU ANDEREN DOKUMENTEN

- **`CLAUDE.md`** = Projekt-Bibel, Vision, Architektur-Prinzipien, Was ist SeenGrid
- **`OPUS_CODE_HANDOFF.md`** = Momentaufnahme: was ist broken, was wurde zuletzt gemacht, Tech-Kontext
- **`ROADMAP.md` (diese Datei)** = Richtung, Entscheidungen, Ideen-Pool, Stufen-Checkliste
- **`DeepSeek1.txt`** = Quelle für SeenGrid Signature Presets (77 extrahierte Items)
- **`SEENGRID_STRATEGY_AND_FUTURE_VISION_BRIEFING.txt`** = Langfrist-Vision, strategischer Kontext
- **`PHASE1_STATUS.md`** = Phase-1-Progress (falls vorhanden)
