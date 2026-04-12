# SEENGRID — ROADMAP & PERSISTENTES GEDÄCHTNIS

> **Für Claude:** Diese Datei zuerst lesen bei jedem neuen Chat. Sie ist das langfristige Gedächtnis des Projekts. `OPUS_CODE_HANDOFF.md` ist der aktuelle Snapshot-Zustand, `CLAUDE.md` ist die Projekt-Bibel. Diese Datei = Richtung, Entscheidungen, Ideen.

---

## 1. DESIGN-ENTSCHEIDUNGEN (festgelegt, nicht mehr diskutieren)

### Naming & Terminologie
- **Tab-Namen (parallel, brand-basiert):**
  - `NanoBanana Studio` (vorher "Prompt Builder") — Chip-Stack primär für NanoBanana, funktioniert auch für andere Bildgeneratoren (Others); alle NanoBanana-optimierten Prompts
  - `Grid Operator` — Multi-Shot & World Boards (modellagnostisch)
  - `Midjourney Studio` (vorher "MJ Startframe") — 5-Element Startframe-Architektur, MJ-spezifisch
  - `Vault` — Community-Prompts
  - **Regel:** Neue Model-Module kriegen eigene Tabs nach demselben Muster (z.B. später `Kling Studio`, `Seedance Studio`). Kein Merge verschiedener Model-UIs in einen Tab mit Mode-Switch — State-Shapes und UIs sind fundamental unterschiedlich.
- **Random-Modi:** `Beat` / `Look` / `Full Scene`
  - **Beat** = nur narrative Felder (Location, Object, Figure, Context, Hook). Filmbegriff für Story-Moment.
  - **Look** = nur visuelle Parameter (Filmstock, AR, Modifier, Genre, Light, Perspective, Direction, Time-of-Day). Bildsprache.
  - **Full Scene** = alles zusammen.
  - **Gilt für BEIDE Studios** (NanoBanana + Midjourney). Beide brauchen den gleichen Toggle-Umbau.
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

### Sprache-Konsistenz (EN/DE)
- **Englisch ist Hauptsprache.** Zielgruppe ist primär englisch-sprachig. Default-Lang beim Öffnen der App = `'en'`.
- **Deutsch ist Sekundär-Übersetzung.** Bei fehlenden DE-Strings wird auf EN zurückgefallen, nie andersrum.
- **UI-Strings:** via `useLang().t('key')` aus `LangContext` — liest aus `src/data/i18n.json`
- **Daten-Strings (Preset-Labels, Descriptions, etc.):** via `useLang().tData(obj, field)` — liest `obj[field_<lang>]` mit Fallback-Kette `<lang>` → `en` → legacy `field` → leer
- **JSON-Schema:** jede Daten-Datei hat `label_en` / `label_de` und `desc_en` / `desc_de` statt nur `label` / `desc`. Legacy `label`/`desc` wird toleriert während der Migration (Fallback-Kette im `tData`).
- **Prompts selbst (der Output der nach MJ/NanoBanana/Kling gepastet wird) bleiben IMMER englisch**, egal welche UI-Sprache aktiv ist. Im Component-Code: nichts aus `t()` oder `tData()` in den Prompt-Output einbauen — dort nur feste englische Strings oder i18n-entkoppelte Felder (z.B. `promptDesc` wie in `GridOperator.jsx` LAYOUTS).
- **Tooltips überall:** jeder interaktive Button/Chip/Input hat einen `title=` der durch i18n läuft
- Beim Sprachwechsel EN↔DE darf NICHTS im UI englisch hängenbleiben (außer die generierten Prompts, die MÜSSEN englisch bleiben).

### Tooltips
- Jeder interaktive Element MUSS einen Tooltip haben
- Tooltips erklären was der Begriff/Parameter tut (nicht nur den Namen wiederholen)
- Tooltips durch i18n lokalisiert

---

## 3. AKTIVE BAUSTELLE

### Aktuelle Stufe: **5 — Header / Logo / Tab-Optik**
Stufen 2 + 3 + 4 (inkl. 4a MJ Random + 4b NanoBanana Random) komplett abgeschlossen. Tabs umbenannt auf `NanoBanana Studio` + `Midjourney Studio` + `Grid Operator` + `Vault` (parallele Brand-Namen statt "Prompt Builder" / "MJ Startframe" — konsistent, skaliert sauber für Kling/Seedance später).

**Stufe 3 erledigt:** GridOperator umgebaut zu Core-als-Default + SeenGrid Signature (echtes Gold) + dynamischer Preset-Gruppierung nach Category:
- **Default-Mode:** `core` statt `seengrid`. MODES-Array Reihenfolge: Core → SeenGrid Signature → Custom Grid.
- **"SeenGrid Signature" Wording** überall: Mode-Button-Label, Badge im Output-Header ("★ SeenGrid Signature"), i18n-Desc-Strings (DE + EN).
- **Echtes Gold** für Signature-Elemente via neue CSS-Tokens in `theme.css`: `--sg-signature-gold` (#d4a256), `-bright` (#e8bd6b), `-dim` (#a07e3a), `-glow` / `-glow-strong` / `-glow-subtle`, `-gradient`. Teal (`--sg-gold-*`) bleibt Standard für Core/Custom/UI-Chrome.
- **Mode-Toggle als Pills** statt unauffälliger segmentierter Leiste: einzelne Buttons mit Abstand, Hover-Glow, Border-Color-Transition. Signature-Pill trägt immer dezenten Gold-Border + Gold-Gradient-Background (vor Aktivierung schon erkennbar); wenn aktiv voller Gold-Glow.
- **Preset-Gruppierung nach Category** statt nach Grid-Size: neue `groupByCategory()`-Funktion liest `_categories.json` (order + label/desc DE/EN), gruppiert die 18 Presets in Character / World / Multi-Shot / Detail / Technical, liest Category-Label via `tData(group.meta, 'label')`. Unbekannte Category fällt automatisch auf "other"-Fallback zurück (robust).
- **Preset-Item Redesign:** Gold-Border bei hover/active, Gold-Glow bei active, `presetStar` (★) inline vor `presetName` wenn `optimized: true`, `presetDims` Badge (z.B. "3×3") rechts statt Grid-Size-Header.
- **Signature-Section** mit doppel-class-Selektor (`.section.signatureSection`) kriegt dezenten Gold-Border + Gold-Glow — hebt die Presets-Sektion vom Rest des Controls-Layouts ab.
- **Vite build grün** (GridOperator bundle 51.32 → 53.22 kB, CSS 11.46 → 13.23 kB wegen neuer Signature-Styles).

**Stufe 2h abgeschlossen:** Alle 12 PromptBuilder-Chip-Daten-Dateien auf `t_en`/`t_de` migriert, Fallback-Kette greift.

**Stufe 4a abgeschlossen:** MJ Random komplett neu. 22 Pools mit 1433 Einträgen in `src/data/mj/random-pools.json`. `_meta.narrative_fields` / `_meta.visual_fields` Klassifikation für Beat/Look Routing. Neuer `handleRandom(mode)` mit Anti-Repetition (letzte 8 pro Pool). Beat/Look/Full Scene Pills-Toggle über dem Random-Button, Default `full`. Beat = nur narrative Felder (Szene bleibt), Look = nur visuelle Parameter (Motiv bleibt), Full = alles inkl. neues Template. `random-scenes.json` gelöscht, alter Scene-basierter Random-Pfad entfernt. Vite build clean. i18n Keys `mj.random_mode_*` in beiden Sprachen.

**Stufe 4b abgeschlossen:** NanoBanana Random komplett neu. Vier neue Pool-Dateien unter `src/data/random/`: `sensory-details.json` (104), `atmospheres.json` (80), `textures.json` (71), `scene-patterns.json` (18 Sensory-Stacking-Muster mit `{setting}/{subject}/{action}/{mood}/{sensory_detail}/{atmosphere}/{texture}` Slots). Bestehende Pools massiv erweitert: `settings.json` 93→198, `subjects.json` 121→202, `actions.json` 144→206, `moods.json` 50→102. Neuer `handleRandom(mode)` in `PromptBuilder.jsx`: `pickFromPool` mit Anti-Repetition (letzte 8 pro Pool, dynamisch an Poolgröße gekappt), `buildScene()` wählt Pattern + fällt 7 Slots, Ersetzung via `pattern.replace(/\{(\w+)\}/g, …)`. Chip-Random mit `pickLookCombo()`: focal length zuerst, Aperture-Kandidaten je nach Brennweite gefiltert (tele ≥85mm → Aperture ≤ f/2.8, wide ≤24mm → Aperture ≥ f/2.8), realistische Kamera-Kombinationen statt rein zufällig. Beat/Look/Full Scene Pills-Toggle über Output-Controls, identisch zum MJ-Pattern (gleiche CSS-Klassen `.randomModeRow`/`.randomModeBtn`, teal active state). `beat` = nur `scene` Textarea, `look` = nur Chips, `full` = alles. i18n Keys `builder.random_mode_*` in beiden Sprachen. useEffect-Dependency für Ctrl+Shift+G auf `[randomMode, recentPicks, state]` aktualisiert. Vite build clean (PromptBuilder bundle 87.24 → 90.56 kB wegen der Pool-Expansion).

Als nächstes kommt Stufe 5 — Header / Logo / Tab-Optik.

Stufe 2f abgeschlossen: Fehlende `title=` Attribute auf den wichtigen interaktiven Elementen ergänzt, alle durch i18n lokalisiert. Konkret:
- **MJStartframe:** SubTab-Buttons (neue Keys `mj.sub_tab_*_desc`), Hook-Collapsible-Toggle (`mj.hook_toggle_title`), `--raw` Toggle (`mj.raw_toggle_title`), Reset-Button (`mj.reset_title`), Save-Favorite (`fav.save_title`), Anti-Pattern-Toggle (`mj.antipattern_title`).
- **GridOperator:** Row/Col-Dim-Buttons (parameterisierte Keys `grid.set_rows_title` / `grid.set_cols_title` mit `{n}` Placeholder).
- **PromptBuilder:** Save-Favorite (`fav.save_title`), NanoBanana Rules-Toggle (`builder.rules_toggle_title`).
- **PromptVault:** Category-Chips (`vault.category_title`), Load-more-Button, PromptCard-Copy-Button, FavoriteCard-Copy-Button. Hardcodete deutsche Strings `"− weniger"` / `"+ mehr"` in `FavoriteCard` durch `showMoreLabel`/`showLessLabel` Props ersetzt (nutzt existierende `vault.show_more` / `vault.show_less` Keys).

Vite-Build grün. Stage 2e (Legacy-Felder-Entfernung) ebenfalls durch — siehe commit `1a0285d`.

Noch offen: PromptBuilder-Daten (`styles.json`, `cameras.json`, `lenses.json`, `focal.json`, `aperture.json`, `shotsize.json`, `cameraangle.json`, `lighting.json`, `colorgrade.json`, `effects.json`, `negative.json`, `aspectratio.json`) haben noch nur Legacy `t` — die `tData`-Calls in PromptBuilder fallen via Fallback-Kette aber korrekt zurück, kein Regression. Diese Files kommen in Stufe **2h** dran.

### Stage 1 ✅ erledigt
- `5607a3f` GridOperator Scroll-Fix (`.previewColumn` max-height + overflow)
- `688e3ae` Prompt-Output bleibt bei DE/EN-Switch englisch (LAYOUTS promptDesc split)
- `6edba1d` Mode-Toggle visuell prominent (surface-2 bg, border-strong, tab-separators, teal underline active)

---

## 4. NÄCHSTE STUFEN (Checkliste, der Reihe nach)

- [x] **Stufe 1** — GridOperator CSS Scroll-Fix (`.previewColumn` max-height + overflow) + DE/EN Prompt-Output-Fix + Mode-Toggle sichtbar machen
- [ ] **Stufe 2** — Sprache-Konsistenz (EN/DE):
  - [x] 2a: LangContext Infrastruktur — Default auf `en`, `tData()` Helper mit Fallback-Kette
  - [x] 2b: Preset-JSONs (alle 18 in `src/data/presets/`) auf `label_en`/`label_de`/`desc_en`/`desc_de` + `category` Feld + neues `_categories.json`
  - [x] 2c: `core-templates.json` auf gleiche Struktur
  - [x] 2d: MJ Data-Files — `templates.json` (label/desc + field.label/field.placeholder), `filmstocks.json`, `modifiers.json`, `genres.json`, `emotional-hooks.json` (alle `t_en`/`t_de`), `forbidden.json` (label/reason/rules), `random-scenes.json` (keine Lokalisierung nötig, reine englische Daten)
  - [x] 2e: Components anpassen — `obj.label` / `obj.desc` / `obj.t` → `tData(obj, 'label')` / `tData(obj, 'desc')` / `tData(obj, 't')`. Legacy-Felder aus den migrierten JSONs entfernt (Presets, core-templates, MJ-Files außer random-scenes).
  - [x] 2f: Tooltip-Review — fehlende `title=` Attribute auf SubTabs, Row/Col-Dim-Buttons, Toggles, Save-Fav, Load-more, Card-Copy ergänzt; hardcodete deutsche `weniger`/`mehr` in PromptVault.FavoriteCard durch i18n ersetzt
  - [x] 2g: i18n.json DE/EN-Completeness — beide Blöcke haben 135 Keys, symmetrisch. Sanity-Check nach cross-Language-Strings ergab nur `common.reset: "Reset"` (internationalism, OK)
  - [x] 2h: PromptBuilder-Daten migriert — alle 12 Chip-Daten-Dateien (`styles.json`, `cameras.json`, `lenses.json`, `focal.json`, `aperture.json`, `shotsize.json`, `cameraangle.json`, `lighting.json`, `colorgrade.json`, `effects.json`, `negative.json`, `aspectratio.json`) auf `t_en`/`t_de`. Legacy `t` (DE-only) entfernt. Component nutzt `tData(item, 't')`. Vite build grün.
- [x] **Stufe 3** — GridOperator Komplett-Umbau:
  - [x] Default = Core
  - [x] "SeenGrid Signature" Wording + goldener ★ + Gold-Glow (echtes Gold-Token statt Teal)
  - [x] Preset-Gruppierung nach Category (Character / World / Multi-Shot / Detail / Technical) — dynamisch aus `_categories.json` via `groupByCategory()` + `tData(meta, 'label')`
  - [x] Jede Preset-JSON hat `category`-Feld (bereits in Stufe 2b erledigt)
  - [x] Mode-Toggle als Pills (einzelne Buttons mit Abstand + Hover-Glow, Signature-Pill Gold-Border)
  - [ ] Section-Icons (SVG) — **vertagt auf Stufe 6** (Icon-Sweep über alle Tabs)
  - [ ] Controls (Layout, Style Override, Panel Roles) nach oben, Preset-Liste collapsible — **offen** (Layout bleibt aktuell wie es ist, da Signature und Core unterschiedliche Controls haben)
- [x] **Stufe 4** — Random-Generatoren komplett neu (BEIDE Studios):
  - [x] **4a: Midjourney Studio Random** ✅
    - [x] Neue `src/data/mj/random-pools.json` mit 22 Pools (1433 Einträge)
    - [x] Narrative Pools: LOCATION(122), LIGHT_SOURCE(102), DETAILS(102), WHAT_IS_DARK(81), EMOTIONAL_HOOK(80), SPACE(81), WHAT_WHERE(69), SURFACE_TEXTURE(70), OBJECT(102), CONTEXT(81), WHAT(69), TEXTURE(69), FIGURE(80), VISIBLE_AREA(60), SURFACE(70)
    - [x] Visuelle Pools: MODIFIER(40), GENRE(30), PERSPECTIVE(30), TIME_OF_DAY(40), DARK_BLUR(15), SHADOW(15), DIRECTION(25)
    - [x] `_meta.narrative_fields` / `_meta.visual_fields` Klassifikation für Beat/Look Routing
    - [x] Neuer `handleRandom(mode)`: iteriert über `tpl.fields`, zieht pro `field.id` aus passendem Pool, fallback auf `field.examples`
    - [x] Anti-Wiederholung: `recentPicks` State, letzte 8 pro Pool ausgeschlossen, dynamisch an Poolgröße angepasst
    - [x] `Beat / Look / Full Scene` Pills-Toggle über Random-Button; `randomMode` State, Default `full`
    - [x] Beat = nur narrative Felder (LOCATION, OBJECT, LIGHT_SOURCE, …), Template + Look bleiben
    - [x] Look = nur visuelle Parameter (Modifier, Genre, Filmstock, AR, Perspective, …), Szene bleibt
    - [x] Full Scene = alles inkl. neuem Template, kompletter Reset
    - [x] `random-scenes.json` gelöscht
    - [x] Vite build clean
  - [x] **4b: NanoBanana Studio Random** ✅
    - [x] Scene-Konstruktion umgebaut: statt primitive Concat jetzt Sensory-Stacking-Template-basiert aus `src/data/random/scene-patterns.json` (18 Satzmuster mit `{setting}/{subject}/{action}/{mood}/{sensory_detail}/{atmosphere}/{texture}` Slots)
    - [x] Neue Pools: `sensory-details.json` (104), `atmospheres.json` (80), `textures.json` (71), `scene-patterns.json` (18)
    - [x] Bestehende Pools erweitert: `settings.json` 93→198, `subjects.json` 121→202, `actions.json` 144→206, `moods.json` 50→102
    - [x] Chip-Random mit `pickLookCombo()`: focal length zuerst, dann Aperture nach Brennweite gefiltert (tele ≥85mm → ≤ f/2.8, wide ≤24mm → ≥ f/2.8) — realistisch statt rein random
    - [x] Anti-Wiederholung: letzte 8 pro Pool, dynamisch an Poolgröße gekappt
    - [x] `Beat / Look / Full Scene` Pills-Toggle über Output-Controls (identisch zu 4a, gleiche CSS-Klassen)
    - [x] `Beat` = nur Scene-Textarea re-roll (chips bleiben)
    - [x] `Look` = nur Chips re-roll (Scene bleibt)
    - [x] `Full Scene` = beides
    - [x] i18n Keys `builder.random_mode_*` in DE + EN
    - [x] Vite build clean
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
