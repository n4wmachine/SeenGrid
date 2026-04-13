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

### Aktuelle Stufe: **Stufe 6 — Modulare Grid-Architektur (architektonischer Pivot, 2026-04-13)**

⚠ **Pflichtlektüre für den nächsten Opus-Chat:** [`MODULAR_GRID_ARCHITECTURE.md`](./MODULAR_GRID_ARCHITECTURE.md). Enthält die vollständige Briefing-Dokumentation: Problem-Statement, Skeleton+Module Kernkonzept, Character-Study-Beispiel, die 5 Pilot-Presets (Character Study / Char+World Merge / Start/Endframe / World Zone Board / Multishot Sequence), die 6-Phasen-Destillations-Methodologie, 10 User-bestätigte Entscheidungen und 10 Anti-Patterns.

**Kurzfassung des Pivots:** Die Session `claude/seengrid-visual-overhaul-kzfBe` wurde als Visual-Overhaul-Chat geöffnet (Idea 4 NB↔Grid-Bridge als erster Punkt). Im Dialog kam raus: das ganze Framing war falsch. Grid Operator ist nicht eine Template-Bibliothek mit Bridge-Optionen, sondern soll ein **modularer Prompt-Operator mit austauschbaren Skeletons + optionalen Modulen** sein. Die aktuellen 18 Presets sind statische Prompt-Text-Kopien aus DeepSeek1.txt — deshalb muss der User bei jedem Workflow manuell Prompts editieren (Reference B löschen, Look überschreiben etc.). Der tatsächliche USP von SeenGrid ist der modulare Grid-Builder. Alles andere (Visual Overhaul, Slogan, Typografie) kommt nach der Architektur.

**User verbatim:** _"das hier ist der absolut wichtigste schritt in dem gfanzen seengrid prozess, wir haben gerade den wirklichen USP entdeckt"_

**Visual Overhaul bleibt gestapelt** als Stufe 7. Erst Modular-Grid (Stufe 6) durchziehen, dann Visual-Overhaul auf der neuen Architektur.

**Fortschritt Stand 2026-04-13 (Session `claude/modular-grid-operator-98Bcq`):**
- Pilot 1 Character Study: Phase 1–5 komplett. Distillation + JSON-Schema + Modul-Files + `skeletonRenderer.js` + Golden-Files + Node-Test-Harness shipped. 5/5 Examples byte-exact grün. Siehe `DISTILLATIONS/character-study.md` + `OPUS_CODE_HANDOFF.md`.
- Pilot 1 Phase 6 (empirische NanoBanana-Validierung) steht als nächstes an — primär User-Task (Golden-Files durchjagen, Failure-Modes dokumentieren).
- Pilots 2–5 noch offen: Char+World Merge → Start/Endframe → World Zone Board → Multishot Sequence, in dieser Processing-Order (nicht UI-Order).

**Konkreter Start-Punkt im nächsten Chat (nach Phase 6):**
1. `OPUS_CODE_HANDOFF.md` lesen (aktuelle Snapshot-of-truth)
2. `DISTILLATIONS/character-study.md` lesen (Schablone für die folgenden Pilots)
3. `MODULAR_GRID_ARCHITECTURE.md` für Pilot-2-Briefing + Proportion-Control-Research-Notes
4. Pilot 2 (Char+World Merge) Phase 1 starten: Source-Sammlung + extra Research-Pass für Proportion-Control-Sprache (DeepSeek1.txt + jau123-repo)
5. Phasen 2–6 wie bei Pilot 1. Neue Distillation-Datei `DISTILLATIONS/char-world-merge.md`, neue JSON-Files unter `src/data/skeletons/` und `src/data/modules/char-world-merge/`, Renderer ggf. erweitern für multi-input Topologie
6. UI-Arbeit bleibt gestapelt bis alle 5 Pilots grün sind. Keine UI-Zwischenschritte.

Der Visual-Overhaul-Ideen-Pool (Farbtemperatur, Display-Font, Slogan, Section-Icons, Card-Shadows) bleibt in `OPUS_CODE_HANDOFF.md` als Stage 7 dokumentiert und unverändert.

---

### Vorherige Stufe: **Idea 1 (Header-Slogan) versucht, gescheitert, zurückgerollt — zurück auf "deferred to Visual Overhaul"**

Slogan **"Scene. Grid. Seen."** wurde in dieser Session zweimal gebaut, beide Versuche scheiterten am User-Review, beide wurden in derselben Session zurückgerollt. Der Header ist jetzt zurück auf dem Stand vor `8e2eebe`. Das ursprüngliche Opus-Gate ("nicht bauen bevor Display-Font entschieden ist") war korrekt — das Bypassen kostete zwei gescheiterte Iterationen.

**Anti-Pattern-Trail (vollständige Lessons Learned in `OPUS_CODE_HANDOFF.md` → Idea 1):**
- **v1 (commit `8e2eebe`, REVERTED):** 13px / 400 / dimgray. Sah aus wie ein nicht-anklickbarer Tab weil identisch zur Tab-Nav-Kategorie.
- **v2 (commit `869169f`, REVERTED):** Überkorrektur. 17px / 500 / primary + "Grid." in Teal. Zwei neue Probleme: (1) Double-Brand-Echo (Farbmuster `weiß-TEAL-weiß` direkt neben dem Wordmark, der genau dasselbe Muster trägt → Auge liest doppelten Brand-Marker), (2) Gaming-Clan-Vibe (farbiger Akzent auf einzelnem Wort + Drei-Beat-Staccato = Esports-Tagline-Territorium à la Faze/OpTic/Cloud9 seit ~2010).
- **v3 (this commit):** beide Reverts. Slogan komplett raus aus `Header.jsx` und `Header.css`. Header zurück auf pre-`8e2eebe`.

**Slogan-Inhalt bleibt gewählt:** "Scene. Grid. Seen." — der Inhalt ist nicht das Problem, nur die Umsetzung. Im Visual-Overhaul-Chat darf der Slogan wieder auf den Tisch, aber **erst nachdem die Display-Font entschieden ist**, und dann mit zwei Lehren aus den Reverts: (a) keine farbigen Akzente auf einzelnen Wörtern, (b) eher gestackt unter dem Wordmark als inline rechts daneben.

**Entscheidungs-Kontext:**
- User hatte drei Kandidaten zur Auswahl: "Scene. Grid. Seen." vs "Make your scene seen" vs "From scene to seen." → "Scene. Grid. Seen." gewählt wegen Rhythmus + Brand-Riff (die Silben sortieren sich aus "Seen|Grid" um).
- Grid-Lastigkeit des Slogans (er nennt Grid prominent, ignoriert NanoBanana/MJ/Vault) wurde diskutiert und akzeptiert: konsistent mit Idea 4's "Grid Operator = Flagship" Mental Model. Falls Idea 4 im Visual-Overhaul-Chat anders entschieden wird, ist der Slogan eine Ein-String-Edit zurück.
- Per-Tab-Sublines (Muse Sparks Sekundär-Vorschlag) **explizit zum Visual-Overhaul-Chat verschoben** weil sie mit der Idea-4-Architektur-Entscheidung verzahnt sind und nicht ohne diese sauber formuliert werden können.

**Implementation-Details:**
- 13px Space Grotesk Regular, `--sg-text-secondary` (#909090), letter-spacing 0.04em für die drei Hard-Stop-Beats
- Vertical-Divider 1px × 26px in `--sg-border-subtle`
- 28px margin-left vom Logo, 18px gap zwischen Divider und Text
- `aria-hidden="true"` weil pure Brand-Dekoration
- Hide unter `max-width: 1100px` damit die Tab-Nav auf schmaleren Viewports Luft behält
- `Header.jsx` destrukturiert jetzt `t` aus `useLang()` (vorher nur `lang, setLang`)

**⚠ Display-Font-Pass aussteht für Visual-Overhaul-Chat:**
Body-Font (Space Grotesk) ist nur v1. Sobald Display-Font entschieden ist (Neue Machina / Space Mono Display / Instrument Serif), Slogan re-typesetten — Font-Family Swap, evtl. Size 13px → 14-15px je nach x-Height der neuen Display-Font, Divider evtl. von flacher 1px-Linie auf Gradient-to-Transparent umstellen (passend zum Accent-Divider-System aus den Visual-Overhaul-Levern), Responsive-Breakpoint 1100px nochmal prüfen.

---

### Vorherige Stufe: **UX-Polish-Pass (Grundstruktur) — abgeschlossen**
Kleine, gezielte Fixes an der Grundstruktur, damit der nächste Chat sich komplett auf das Visual-Overhaul konzentrieren kann. Keine neuen Features, kein Refactor — nur Verhalten + Typografie.

Erledigt in diesem Pass:
- **Grid crop-advisory umgebaut** auf per-axis Pixel-Berechnung (`canvas_w/cols` × `canvas_h/rows`) statt `max(rows,cols)`-Shortcut. Quality-Tier liest `min(panelW, panelH)` bei 2K (Engpass). Annahmen (square canvas, floor-Rest, bottleneck-tier) in Tooltip dokumentiert (`grid.advice_tooltip`). Commits: `aefadc0`, `d0053b7`.
- **Fix #1 — Random-Button Layout-Stabilität** (beide Studios): `.outputBox` in PromptBuilder + MJStartframe auf `flex: 1 1 0` + internen Scroll umgestellt. Die Box absorbiert jetzt den Rest der Spalte, sodass die Random-/Mode-Cluster darüber NIE springen wenn sich der Output ändert. Commit `d7aaec4`.
- **Fix #5 — Logo-Akzent:** "Seen" bleibt neutral, "Grid" kriegt Teal (`--sg-gold-text`) + subtilen Hover-Glow. Semantischer Akzent statt Dekoration — matcht den Teal des Logo-Marks und liest als "see the grid" / "scene as grid" (Doppeldeutigkeit Seen/Scene vom Nutzer bestätigt). Commit `d7aaec4`.
- **Fix #6 — Grid-Dim Typografie:** `.dimLabel`, `.dimBtn`, `.dimX`, `.dimTotal` von `--sg-font-mono` auf `--sg-font-body` umgestellt. Sticht nicht mehr heraus gegen die neue body-font Advisory. Commit `d7aaec4`.
- **Fix #4 quick — NanoBanana Accordion:** `openSections` Set ersetzt durch single-ID `openSection` State. Nur eine Sektion offen zur Zeit — Öffnen einer neuen schließt die vorherige automatisch. Der Chip-Cluster schiebt nicht mehr alles aus dem Viewport. Voller Multi-Column-Rethink bleibt für den Visual-Overhaul. Commit `29c893c`.
- **Fix #2 — Grid-Builder Quick-Nav:** Horizontale Pill-Row direkt unter dem Mode-Toggle. Zeigt alle Sections des aktuellen Modus (Preset / Core Template / Grid Size / Layout / Ref / Style / Subject / Panel Roles) als klickbare Pills. Klick → smooth-scroll zum Ziel + 1.4s teal border-flash auf der Landing-Section. Section-IDs `grid-sec-*` render nur wenn ihr owning-Mode aktiv ist. Commit `cb92c58`.

**Deferred zum Visual-Overhaul-Chat:**
- Fix #3 — Grid-Preview Panel-Font/Look (braucht ganzheitlichen Karten-Rethink mit dem Rest des Designs).
- Fix #4 full — NanoBanana Multi-Column / Icons / Visual Hierarchy Rethink (nicht nur Accordion sondern echte Layout-Reorganisation).
- Die 6 Visual-Overhaul-Level (Farbtemperatur-Vielfalt, Background-Texturen/Gradients, Display-Fonts, Section-Icons, Cards mit Shadows, Accent-Dividers) — komplett neuer Chat.

---

### Stufe 5 — Header / Logo / Tab-Optik  (abgeschlossen vor dem UX-Polish-Pass)
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
- [ ] **Stufe 6** — Modulare Grid-Architektur (architektonischer Pivot, 2026-04-13) — siehe `MODULAR_GRID_ARCHITECTURE.md`
  - [x] Phase 1–3 Destillation **Character Study** (Bausteine sammeln → klassifizieren → User-Review)
  - [x] Phase 4 Character Study (NanoBanana-Optimierung) — siehe `DISTILLATIONS/character-study.md`
  - [x] Phase 5 Character Study (Module formalisieren: JSON-Schema, Modul-Files, `skeletonRenderer.js`, Golden-Files, Node-Test-Harness, 5/5 byte-exact grün) — Commits `b24b438` + `68bc3b6` auf `claude/modular-grid-operator-98Bcq`
  - [ ] Phase 6 Character Study (empirische NanoBanana-Validierung der 5 Rendered Examples gegen echte Referenzen)
  - [ ] Wiederholung für **Char+World Merge** (Multi-Input-Topologie + Proportion-Control-Research)
  - [ ] Wiederholung für **Start/Endframe Generator** (Temporal-Pair-Topologie, einzige legitime Ausnahme zur No-Camera-Movement-Regel)
  - [ ] Wiederholung für **World Zone Board** (Cross-Check der existierenden User-Version)
  - [ ] Wiederholung für **Multishot Sequence** (Cross-Check der existierenden User-Version)
  - [ ] Look Register Datenstruktur definieren (NB Studio → Grid Operator Look-Modul-Slot)
  - [ ] Code-Implementierung der Skeleton+Module-Engine (erst nach User-Approval aller 5 Pilot-Sheets)
  - [ ] Migration der 18 Legacy-Presets: behalten mit "Legacy"-Badge, inkrementell ablösen
- [ ] **Stufe 7** — Visual Overhaul (verschoben hinter Stufe 6)
  - 6 Lever: Farbtemperatur-Vielfalt, Background-Texturen/Gradients, Display-Fonts, Section-Icons, Cards mit Shadows, Accent-Dividers
  - Mockup-Plan zuerst, Code danach (im Visual-Overhaul-Chat)
  - Detail-Kontext + offene Exploration-Items in `OPUS_CODE_HANDOFF.md` → "Pending: Visual Overhaul"
- [ ] **Stufe 8** — Section-Icons über alle Tabs (SVG, aus Lucide oder custom) — ursprünglich Stufe 6, verschoben weil vom Visual Overhaul abhängig
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
- **Statische Presets = kein Operator, nur eine Textbibliothek.** Die 18 Presets der ersten Version waren reine DeepSeek1.txt-Kopien mit leeren Parameter-Slots. Das zwingt den User in jedem Workflow dazu, von Hand am Prompt zu editieren (Reference löschen, Look überschreiben, Mode-Wort austauschen). Ein echter Grid Operator ist **Skeleton + Module**: der Kern-Prompt ist fix und standalone-nutzbar, optionale Module lassen sich per Knopfdruck zuschalten und ändern den Skeleton minimal-invasiv. Siehe `MODULAR_GRID_ARCHITECTURE.md` für das komplette Konzept.
- **Grid Operator ist zu 90% image2sheet, nicht text2sheet.** Der User hat in praktisch jedem täglichen Workflow ein Referenzbild und will einen Wrapper-Prompt drum rum — nicht eine reine Text-Eingabe. UI-Entscheidungen müssen diesen image-first Use-Case spiegeln, nicht einen casual text2grid-Modus den es praktisch nicht gibt.
- **Look Transfer ist die echte Bridge zwischen NB Studio und Grid Operator, nicht Scene Transfer.** Der User experimentiert in NB Studio mit Looks (Chip-Stacks), dann will er den Look auf ein Sheet anwenden. Scene Transfer (generischer Szenentext → Sheet) ist ein Pseudo-Need. Die Bridge muss ein kleines "Save Look" in NB Studio sein + ein Look-Register das der Grid Operator in seinem Look-Modul-Slot liest.
- **"Sheet" triggert bei NanoBanana bei Illustration/Anime den Kinder-Cartoon-Default — FAIL state.** Das Mode-Modul muss style-aware sein: bei Photorealistic beide Optionen (Sheet / Cinematic Study), bei Illustration nur Cinematic Study. Diese Kopplung ist Pflicht, keine Kür.
- **Char+World Merge ist Multi-Input-Topologie (mehrere Inputs → 1 Output), alle anderen Topologien sind 1→N.** Kritisch: Downstream-Video-Modelle (Kling, Seedance) erben Proportionen aus dem Startframe — wenn die Figur im Merge falsche Proportionen zur Welt hat, sind alle nachfolgenden Clips kaputt. Das Proportion-Control-Modul ist NICHT optional bei Char+World Merge, sondern Pflicht.
- **Start/Endframe Generator ist Temporal-Pair-Topologie (1 Input → 2 zeitlich verbundene Outputs)** und der einzige legitime Use-Case für Kamera-Bewegung-Bezug im ansonsten rein bild-fokussierten SeenGrid (die No-Camera-Movement-Regel gilt für NB-Bild-Output, aber Start/Endframe-Pairs definieren die gewünschte Bewegung implizit über den Delta zwischen beiden Frames).
- **Einfache Sprache > Architekt-Jargon.** Der User ist kein Webdev und kein Designer. Wenn ein Opus in "Bridge 1+4 vs Bridge 2 mit Rückweg"-Fachsprache abrutscht, versteht der User nur Bahnhof und die Session verliert Tempo. Immer: simple deutsche Worte, konkrete Beispiele, Analogien aus Film/Küche/Werkzeug.
- **Die "Ship it even though gated"-Versuchung ist real und immer falsch.** Idea 1 (Slogan) wurde zweimal gebaut bevor die Display-Font entschieden war, weil der User "sehen wollte wie es aussieht". Beide Versuche gescheitert, beide gerevertet. Das ursprüngliche Gate war korrekt. Gates existieren aus einem Grund; pushback statt bypass.

---

## 8. WORKFLOW-REGELN FÜR CLAUDE

### Beim Start eines neuen Chats
1. **Falls aktuelle Stufe = Stufe 6 (Modulare Grid-Architektur):** zuerst `MODULAR_GRID_ARCHITECTURE.md` komplett lesen (Pflichtlektüre). Das ist der 100%-Kontext-Dump für den Pivot.
2. Diese Datei (`ROADMAP.md`) lesen
3. Dann `CLAUDE.md` (Projekt-Bibel)
4. Dann `OPUS_CODE_HANDOFF.md` (aktueller Snapshot)
5. Dann an der aktiven Stufe (Abschnitt 3) weiterarbeiten

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

- **`MODULAR_GRID_ARCHITECTURE.md`** = **⚠ Pflichtlektüre für Stufe 6.** 100%-Briefing für den modularen Grid-Operator-Pivot (Skeleton+Module Konzept, 5 Pilot-Presets, 6-Phasen-Destillation, 10 User-Entscheidungen, 10 Anti-Patterns, konkrete Next Steps).
- **`CLAUDE.md`** = Projekt-Bibel, Vision, Architektur-Prinzipien, Was ist SeenGrid
- **`OPUS_CODE_HANDOFF.md`** = Momentaufnahme: was ist broken, was wurde zuletzt gemacht, Tech-Kontext
- **`ROADMAP.md` (diese Datei)** = Richtung, Entscheidungen, Ideen-Pool, Stufen-Checkliste
- **`DeepSeek1.txt`** = Quelle für SeenGrid Signature Presets (77 extrahierte Items) — wird in Stufe 6 Phase 1 als Baustein-Quelle für die Destillation genutzt
- **`SEENGRID_STRATEGY_AND_FUTURE_VISION_BRIEFING.txt`** = Langfrist-Vision, strategischer Kontext
- **`PHASE1_STATUS.md`** = Phase-1-Progress (falls vorhanden)
