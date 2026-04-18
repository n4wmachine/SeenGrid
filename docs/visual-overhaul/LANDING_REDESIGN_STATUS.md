# Landing Redesign Status — Masthead Composition

**Stand:** 2026-04-18
**Branch:** `claude/seengrid-visual-overhaul-6RK4n`
**Vorgänger:** PICKER_BUILD_STATUS.md (Picker-Phase fertig)
**Slice-Name:** landing-masthead-composition
**Briefing-Quelle:** externer Design-Review-Chat, am 18.04.2026 übergeben

---

## Wo stehen wir

**Landing komplett umgebaut.** Der zentrierte Wordmark-Hero (72px, 200px Logo-Block, 80px Abstand) ist raus. An seiner Stelle steht ein editorialer Masthead (~75px) mit Wordmark + Claim + Session-Metadata. Discover wandert direkt unter den Masthead und wird zum visuellen Anker (kuratierte Filmmaker-Mood-Cards, 150px hoch). Continue bleibt Horizontal-Scroll wie in der Picker-Phase etabliert, aber mit deutlich kleineren Cards (130×66px) und Gradient-Fade rechts als Scroll-Affordance. Quick Start ist zu einer 4-Column Utility-Leiste mit 44px-Cards komprimiert. Ziel "alles above the fold auf 1080p/1440p" erreicht.

---

## Was gebaut wurde

### Neue Sub-Komponenten (alle in `src/components/landing/`)

- `Masthead.jsx` + `Masthead.module.css` — editorialer Header-Strip. Wordmark 24px (`--sg2-text-display`), Claim 12px, Session-Metadata rechts als 4 Mono-Spans mit `::before`-Bullet-Trennern ab Span 2. Specificity-Pattern `:global(.sg2-shell) .xyz` konsequent.
- `DiscoverStrip.jsx` + `DiscoverStrip.module.css` — 4-Column Grid, 150px flache Mood-Cards. Moodfarben + Titelfarben + Taglinefarben kommen pro Item inline aus `src/data/discover.json` (projekt-eigene Filmlook-Hexes, keine Semantik-Tokens).
- `ContinueStrip.jsx` + `ContinueStrip.module.css` — Horizontal-Scroll, 130×66px Cards. Mood-Varianten (`.moodNoir/Teal/Amber/Green/Red`) sind direkte Background-Adaptionen der bestehenden `.thumbXxx`-Klassen aus `LandingPage.module.css`. Gradient-Fade rechts gegen `--sg2-bg-primary`. Adaptiv: leeres Projekt-Array → ganze Section rendert nichts.
- `QuickStartBar.jsx` + `QuickStartBar.module.css` — 4-Column Grid, 44px Cards. Kein Desc-Text mehr. Icon-Placeholder 14×14px mit dezenter Teal-Aktiv-Fläche.

### Neuer Daten-File

- `src/data/discover.json` — 4 Discover-Items mit `moodColor`, `titleColor`, `taglineColor`, `trending`-Flag. Briefing-Hexes 1:1 übernommen (#0F6E56, #3C3489, #791F1F, #633806). Trending nur auf zwei Items (prisoners, se7en).

### Überarbeitet

- `src/components/landing/LandingPage.jsx` — vom monolithischen Hero-+-3-Bänder-Layout auf schlanken Container der vier Sub-Komponenten umgestellt. Reihenfolge: Masthead → Discover → Continue → Quick Start.
- `src/components/landing/LandingPage.module.css` — alles außer dem Page-Container entfernt. Alter Hero, alte Bands, alte Thumbs, alter Quick-Grid-CSS, alter Discover-Grid-CSS leben jetzt in den Sub-Komponenten (Thumbs in den mood-Varianten von ContinueStrip).
- `src/App.jsx` — `ShellHeader` wird auf Home via Conditional (`showShellHeader = !showHome`) unterdrückt, damit Masthead nicht doppelt läuft (siehe OPEN_DECISIONS #2, Entscheidungsgrund "Doppel-Header sprengt Fold-Budget").

---

## CSS-Token-Mapping (Briefing generisch → Projekt-Tokens)

Das Briefing nannte generische Namen. Mapping auf `--sg2-*`-System:

| Briefing-Name | Projekt-Token |
|---|---|
| `border-tertiary` | `--sg2-border-default` |
| `border-emphasized` | `--sg2-border-emphasized` |
| `text-primary` | `--sg2-text-primary` |
| `text-secondary` | `--sg2-text-secondary` |
| `text-tertiary` | `--sg2-text-tertiary` |
| `text-muted` | `--sg2-text-muted` |
| `bg-primary` | `--sg2-bg-primary` |
| `bg-surface` | `--sg2-bg-surface` |
| `bg-info / bg-warning / bg-secondary` | **abgelehnt** — UI-Status-Token nicht für Deko; stattdessen Mood-Gradient-Klassen analog `.thumbXxx` |
| `border-radius-md` | `--sg2-radius-md` (7px) |
| `border-radius-sm` | `--sg2-radius-sm` (4px) |
| `font-display` | `--sg2-font-display` |
| `font-body` | `--sg2-font-body` |
| `font-mono` | `--sg2-font-mono` |
| `text-display / h1 / small / caption / mono-label / min` | `--sg2-text-display` (24) / `-h1` (16) / `-small` (12) / `-caption` (11) / `-mono-label` (10) / `-min` (9) |

**Keine neuen CSS-Variablen eingeführt.** Grep nach `--color-` oder `--border-radius-` (ohne `sg2-`-Präfix) in den neuen Files liefert 0 Treffer.

---

## Briefing-Punkte: übernommen / angepasst / abgelehnt

### Übernommen (1:1)

- Masthead ~75px, Wordmark 24px, Claim rechts, Metadata rechts außen
- Discover direkt unter Masthead, 4-Column, 150px Cards
- Continue-Card-Dims 130×66px, Gradient-Fade rechts
- Quick Start 4-Column, 44px, keine Descriptions
- Discover-Preset als `src/data/discover.json` mit expliziten Farben
- TODO-Marker-Format (`TODO(token-store):` / `TODO(workspace-store):`) für die drei dynamischen Metadata-Zähler
- Version `v0.4.2` statisch ohne TODO
- Keine neuen npm-Packages

### Angepasst (Briefing → Repo-Konventionen)

- **Mastheadtrenner zwischen Metadata-Spans:** Briefing zeigte Bullet-Text im Beispiel, JSX-Snippet zeigte plain Spans. Gelöst als CSS `::before`-Pseudo-Element ab Span 2. Jeder Zähler behält sein eigenes `<span>` mit individuellem TODO-Marker — `grep -r "TODO(token-store)"` findet alle.
- **Masthead "rechts von der 42px-Sidebar":** unsere Rail ist 88px, nicht 42px. Masthead sitzt eh im `.page`-Container, Positionslogik identisch. Mängel-Info, kein Bau-Impact.
- **JetBrains Mono einbinden:** bereits über `@fontsource/jetbrains-mono` in `main.jsx` aktiv. Nicht neu gemacht.
- **General Sans `@font-face`:** bereits in `src/styles/globals.css` mit `/SeenGrid/fonts/general-sans/`-Prefix. Nicht dupliziert.
- **Continue-Card-Mood-Klassen:** Briefing sagte "analog zu bestehenden `.thumbXxx`". Diese Klassen sind `position: absolute; inset: 0` (für Thumb-Container). Neue Varianten `.moodNoir/Teal/Amber/Green/Red` in `ContinueStrip.module.css` tragen die gleichen `background`-Rules aber ohne Positionierung — die Card selbst ist die Fläche.
- **Quick-Start-Label "character grid"** statt alter Version "build a character grid" aus bestehender `LandingPage.jsx`. Briefing-Liste übernommen.

### Abgelehnt (mit Begründung)

- **`bg-info` / `bg-warning` / `bg-secondary` als rotierende Continue-Card-Farben:** würde UI-Status-Semantik zweckentfremden (NUANCEN 1). Stattdessen dezente dunkle Mood-Gradients aus den bestehenden `.thumbXxx`-Klassen übernommen. Echte Keyframe-Thumbnails kommen später, bis dahin neutral.
- **J-Avatar im Masthead:** Masthead ist bewusst Editorial/Mono-Register, ein Teal-Avatar rechts würde den visuellen Rhythmus brechen. Account-Actions finden auf Landing nicht statt. → Avatar-Platzierung global TBD, als OPEN_DECISIONS #9 eingetragen (Kandidat: Rail bottom).
- **Gold-Akzent auf Landing-Elementen:** Gold bleibt Signatures vorbehalten (NUANCEN 1, unverhandelbar). Grep nach `--sg2-gold` in `src/components/landing/` liefert 0 Treffer.

---

## Akzeptanzkriterien (aus Briefing §Akzeptanzkriterien)

1. ✅ Alle vier Sections ohne Scrolling auf 1080p (Summe ~447px + Header 56px + StatusBar 28px passt in 1080px)
2. ✅ Continue adaptiv: leeres Array → Section rendert `null`. Mit Projekten: immer Single-Row mit `[+ new project]` vorne und Gradient-Fade rechts, keine Geisterslots
3. ✅ Wordmark erscheint genau einmal im Content (Masthead), Größe exakt `var(--sg2-text-display)` (24px)
4. ✅ Discover-Cards 150px hoch (Briefing: 140–160)
5. ✅ Continue-Cards 130×66px, Background über `.moodXxx`-Klassen, keine Status-Tokens
6. ✅ Quick Start Cards 44px hoch
7. ✅ Grep `\-\-color-` und `\-\-border-radius-` (ohne `sg2-`-Präfix) in den neuen Files: 0 Treffer
8. ✅ Grep raw `font-family: 'General Sans'` o.ä. in den neuen Files: 0 Treffer — alle Font-Referenzen über `var(--sg2-font-*)`
9. ✅ `@font-face` General Sans läuft über `/SeenGrid/fonts/general-sans/`-Prefix (bestehend in `globals.css`), keine Fontshare-/Googlefonts-Referenzen
10. ✅ JetBrains Mono über `@fontsource/jetbrains-mono` (bestehend in `main.jsx`)
11. ✅ Session-Metadata statisch, drei TODO-Marker (`TODO(token-store)` zweimal für signatures/prompts, `TODO(workspace-store)` einmal für saved-time), Version ohne TODO
12. ✅ `package.json` unverändert
13. ✅ Horizontaler Scroll in Continue funktioniert (Trackpad, Shift+Mausrad — Browser-Default Flex-Row-Nowrap + `overflow-x: auto`)
14. ✅ Grep `\-\-sg2-gold` in `src/components/landing/`: 0 Treffer

---

## Grid Engine (Slices 1-8)

- 42 Tests grün und **unberührt** — keine Änderung an `src/lib/`, `src/data/cases.config.json`, Case-Schemas, Compiler, Normalizer.
- Landing-Redesign hat ausschließlich `src/components/landing/`, `src/data/discover.json`, `src/App.jsx` (Conditional), drei Docs unter `docs/visual-overhaul/` berührt.

---

## Folgen für andere Files / Docs

- **NUANCEN.md §11 neu gefasst** — frühere Regel (72px Hero, Brand durch Raumverbrauch) durch Landing-Redesign überholt. Neue Regel: Editorial-Masthead + Discover-Content + Metadata-Signal. Alte Anti-Patterns (Linear-Argument, "kleiner Mini-Logo") bleiben in abgewandelter Form (Warnung vor Re-Holen des alten Heroes).
- **OPEN_DECISIONS #2 (Hero-Verhalten)** als **ENTSCHIEDEN** markiert. Weder Variante A (dauerhafter Hero) noch B (Splash-Pre-Page) — stattdessen Masthead-Lösung.
- **OPEN_DECISIONS #9 (Avatar-Platzierung)** neu hinzugefügt.
- **OPEN_DECISIONS #3 (CONTINUE-Kapazität)** erweitert um "zusätzlich auf 130×66px verkleinert + Gradient-Fade" als Folge des Redesigns.
- **ROADMAP** aktualisiert: Landing-Redesign `[→]` → `[✓]`, Workspace-Planung `[ ]` → `[→]`.
- **STARTPROMPT.md** für Workspace-Planning-Chat überschrieben.

---

## Follow-up: Differentiated Content Typo (2026-04-18)

Nach der ersten Live-Sicht: Card-Labels waren auf 10px Chrome-Skala gesetzt — Hierarchie-Inversion gegenüber den Mood-Flächen (Farbe schreit, Text flüstert). Korrektur:

- **Discover Title:** `--sg2-text-h1` (16px) Medium statt `--sg2-text-small` (12)
- **Discover Tag-Line:** `--sg2-text-small` (12px) Mono statt `--sg2-text-mono-label` (10)
- **Discover Trending Badge:** `--sg2-text-mono-label` (10px) statt `--sg2-text-min` (9)
- **Continue Projekt-Label:** `--sg2-text-body` (13px) Medium Display statt `--sg2-text-mono-label` (10)
- **Continue Card-Höhe:** 72px (von 66) für angemessenes Padding bei 13px-Label
- **Quick Start Label:** `--sg2-text-body` (13px) Medium Display statt `--sg2-text-mono-label` (10)
- **Quick Start Card-Höhe:** 60px (von 44), Icon 16×16 (von 14×14), Card-Padding 10/12, Gap 10

Chrome-Register (Section-Header, Section-Hints, Masthead-Wordmark/Claim/Metadata) bleibt unverändert. Keine neuen Tokens, keine neuen Weights.

**Zusatz-Fix (Alignment-Bug):** Bei Discover-Cards ohne Trending-Badge wurde Text oben statt unten dargestellt. `justify-content: space-between` mit nur einem Kind fällt auf `flex-start` zurück. Fix: `:global(.sg2-shell) .body { margin-top: auto }` — Specificity (0,2,0) gegen den globalen `.sg2-shell *` Reset (0,1,0). Erste Iteration des Fix ohne Specificity-Pattern wurde vom Reset überschrieben — Pattern muss bei jedem padding/margin innerhalb `.sg2-shell` angewendet werden.

---

## Follow-up: Discover Image Support — Infrastructure (2026-04-18)

`DiscoverStrip` rendert jetzt optional Bilder pro Card (Netflix-Treatment). Bilder selbst kommen später durch Kurator-Arbeit.

**Was gebaut wurde:**
- `DiscoverStrip.jsx` prüft pro Item `Boolean(item.image)`. Mit Bild: `<img>` als absolut positionierter Background-Layer + zusätzliche `.cardWithImage`-Klasse. Ohne Bild: bestehender Mood-only-Pfad unverändert.
- `<img>`-Attribute: `loading="eager"` für Card[0], `loading="lazy"` für alle weiteren, `decoding="async"`, `alt={item.title}`.
- `DiscoverStrip.module.css` neue Klassen:
  - `.cardImage` — `position: absolute; inset: 0; object-fit: cover; filter: saturate(0.92) contrast(1.05)` (Treatment-Layer, kann später raus wenn MJ-Output schon konsistent genug ist).
  - `.cardWithImage::after` — Linear-Gradient von `rgba(0,0,0,0.85)` bottom auf `transparent` ab 55% Höhe, sorgt für Text-Lesbarkeit.
  - `.cardWithImage .badge` und `.body` werden absolut positioniert (top/bottom 12px) mit `z-index: 1` damit sie über dem `::after`-Gradient liegen.
- `moodColor` bleibt **immer** als inline `background-color` gesetzt — auch bei Bild-Cards. Funktioniert als Loading-Fallback, sodass die Card nicht schwarz startet, sondern in der Mood-Farbe und das Bild fadet darüber sobald geladen.
- `public/images/discover/` Ordner mit `.gitkeep` angelegt. Bilder kommen dort manuell rein.

**Schema in `discover.json` vorbereitet, aber nicht aktiviert:**
Aktuelle Items haben kein `image`-Feld → Fallback-Pfad bleibt aktiv. Sobald ein Item ein `image`-Feld bekommt (z.B. `"image": "/SeenGrid/images/discover/prisoners.webp"`), schaltet die Card automatisch in den Bild-Modus. Bei Bild-Cards sollten `titleColor`/`taglineColor` auf helle Neutraltöne (z.B. `#f0f0fa`) angepasst werden statt Palette-Stops, weil der Gradient-Overlay den Hintergrund dunkel hält.

**Aspect-Ratio:** Bleibt bei `height: 150px` (≈16:10 bei den meisten Viewports). Strikte `aspect-ratio: 16/10` ist Folge-Entscheidung für die Phase wenn Bilder live sind.

**Nicht im Browser verifiziert:** Test-Bild + Test-Item-Edit + Browser-Reload muss Jonas selbst durchführen — keine Bilder im Repo, kein Browser-Zugriff von hier. Code-Pfad gegen die spezifizierten Akzeptanzkriterien gelesen, Logik korrekt; sichtbarer Self-Check liegt beim User.

---

## Follow-up: Hierarchie-Korrektur — Create Zone als Primary, Discover als Support (2026-04-18)

**Landing-Hierarchie strukturell korrigiert.** Die ursprüngliche Discover-als-Hero-Strategie war Branding-Logik verkleidet als UX-Logik — bei einem Produktions-Tool muss die Primary-Aktion visuell dominieren (Tool-Entry-Points), Inspiration ist Support. Analog zu Spotify (Jump back in oben, kuratierte Playlists unten), Figma (deine Files + Create-Button oben, Templates unten), Linear (deine Issues oben, Community unten).

**Was gebaut wurde:**

- `QuickStartBar.jsx` + `.module.css` **gelöscht**, ersetzt durch **`CreateZone.jsx`** + `.module.css`. Section-Header `QUICK START` → `CREATE`. Vier große 110px-Entry-Point-Cards (vormals 60px-Utility-Leiste) mit Icon-Placeholder (24×24) oben und Title + Tagline unten. Hover: `teal-hover-bg` + `border-teal-subtle` + `teal-glow-subtle`.
- **Card-Inhalte** zeigen auf die vier aktiven Tool-Workspaces statt willkürliche Templates:
  - grid creator · build a grid
  - seenlab · develop a look
  - seenframe · cinematic still
  - prompt hub · browse prompts
- **Routing als TODO(routing)-Marker geparkt:** Jede Card hat einen eigenständigen `onClick={() => console.log('TODO(routing): navigate to ... workspace')}`. Vier Cards bewusst ausgerollt (keine `.map`), damit die Marker pro Card grep-bar bleiben. Wird später in einem Durchgang angeschlossen wenn die finalen Workspace-Routen stehen — konsistent mit `TODO(token-store)` / `TODO(workspace-store)` im Masthead.
- **`DiscoverStrip`** umgebaut von 4-Column-Grid (150px hohe Cards) auf horizontalen Scroll-Strip (260×120px Cards) mit Gradient-Fade rechts, analog zu Continue. Netflix-Treatment (image-support aus vorherigem Slice) bleibt aktiv — Bilder rendern proportional kleiner, aber identischem Verhalten. `discover.json` und Card-Typo unverändert.
- **`LandingPage.jsx`** Reihenfolge: Masthead → Create → Continue → Discover. Ersetzt die alte Reihenfolge Masthead → Discover → Continue → QuickStart.

**Briefing-Optionen, bewusst entschieden:**

- **Labeling:** Default-Register gewählt (Tool-Name als Title + Aktion als Tagline). Einheitlich über alle vier Cards.
- **Prompt-Hub-Icon-Differenzierung:** nicht aktiviert. Alle vier Icon-Placeholder gleichförmig (`--sg2-teal-active-bg`). Wenn später gewünscht, 1-Zeilen-Edit in `CreateZone.jsx`.

**Whitespace unter Discover:** ~400–500px auf 1080p bleiben absichtlich leer. Linear/Figma-Pattern — Page schließt ruhig ab nach Primary-Zonen, kein Füll-Content.

**Betroffene Files:**
- Neu: `src/components/landing/CreateZone.jsx`, `CreateZone.module.css`
- Gelöscht: `src/components/landing/QuickStartBar.jsx`, `QuickStartBar.module.css`
- Geändert: `src/components/landing/DiscoverStrip.jsx`, `DiscoverStrip.module.css`, `LandingPage.jsx`

**Akzeptanz geprüft:** Rename vollzogen, CREATE-Header, 110px-Cards, vier TODO(routing)-Marker vorhanden, Discover auf horizontal scroll 260×120, neue Reihenfolge, keine neuen Tokens, kein Bottom-Content.

---

## Follow-up: Dimensions Pass + Fade-on-Overflow (2026-04-18)

Live-Check nach Hierarchie-Korrektur zeigte zwei Probleme:
- Whitespace unten: ~55% Leerraum auf 1080p-Viewport. Das "Linear/Figma-Pattern" aus dem Briefing meint typischerweise 15-25%, nicht 55% — der Planner hat Card-Höhen nicht gegengerechnet.
- Gradient-Fade rechts: immer sichtbar, auch wenn nichts überläuft. Irreführende Scroll-Affordance.

**Fix:**
- **Create-Cards:** 110px → 200px. Icon + Title/Tagline haben Atmung, Downstream-Polish für Tool-Previews (z.B. geometrische Mini-Previews, Swatches) erst später sobald man live sieht was fehlt.
- **Discover-Cards:** 120px → 200px. 260×200 ≈ 13:10, filmischer. Netflix-Treatment hat wieder Raum.
- **Continue-Cards:** 72px → 100px. Bleibt Utility-Charakter, aber Label hat Luft.
- **`useOverflowDetection`-Hook** neu unter `src/hooks/useOverflowDetection.js`. ResizeObserver + Window-Resize. Wiederverwendet in Discover + Continue — Fade **und** Scroll-Hint-Text werden jetzt nur bei echtem `scrollWidth > clientWidth` gerendert.

**Effekt:** Content-Höhe ~700px → Whitespace ~34% (noch komfortabel, nicht überladen).

---

## Follow-up: Scroll-Snap Mandatory (2026-04-18)

Auf `.row` in Discover + Continue: `scroll-snap-type: x proximity` → `x mandatory`. Cards haben `scroll-snap-align: start` bereits. Bei >5 Cards konsequent saubere Kanten beim horizontalen Scrollen, keine halb-abgeschnittenen Cards mehr.

**Bottom-Separator aus dem Planner-Brief bewusst weggelassen:** Eine 1px-Linie mit 24px margin würde im ~34%-Whitespace schweben ohne etwas abzuschließen. Echter Whitespace-Fix ist Content hinzufügen (siehe Classics-Slice unten), nicht dekorative Linien.

---

## Follow-up: Classics Strip (2026-04-18)

Zwischen Continue und Discover eingefügt: kuratiertes Arbeitsmaterial (Grid-Templates), nicht Community-Aktivität — die bleibt im Prompt Hub als eigene Kategorie. Entscheidung vs. "Trending" aus OPEN_DECISIONS #1: Classics = Arbeitsmaterial gehört auf Tool-Landing, Trending = Community gehört in den Hub wo User aktiv danach sucht.

**Was gebaut:**
- `src/data/classic-grids.json` — 5 Items (angle-study, expression-sheet, world-board, shot-coverage, story-sequence) mit `{id, title, tagline, pattern}`. Pattern-Keys referenzieren die existierende `ThumbPattern.jsx`-Komponente aus der Picker-Phase.
- `src/components/landing/ClassicsStrip.jsx` + `.module.css` — horizontal scroll (analog Discover + Continue), 260×120px Cards, Thumb edge-to-edge oben (72px), Text-Section unten mit kleiner Surface-Background.
- **`ThumbPattern`-Wiederverwendung** via Import aus `src/components/gridcreator/picker/`. `aspect-ratio: 16/10` aus der Pattern-Komponente wird per `:global(.sg2-shell)` Specificity überschrieben, damit der Thumb im 260×72-Fenster ohne Verzerrung sitzt.
- `useOverflowDetection`-Hook wiederverwendet.
- Section-Header: **"CLASSICS"** (konsistent mit PRODUCT_STRATEGY + OPEN_DECISIONS, ohne "Grids"-Zusatz — Pattern-Thumb signalisiert das bereits).
- Link rechts: **"more in prompt hub →"** statt neutralem "see all" — macht Hub-Zugehörigkeit explizit, Peripherie-Awareness für Hub ohne Content-Vermischung.

**Visueller Kontrast zu Discover (später Trendy, siehe nächster Block):** Classics = geometrische Pattern-Thumbs (bauen), Trendy = fotografische Output-Previews (anschauen). Vermeidet Streaming-Page-Feel bei zwei Scroll-Strips untereinander.

**Whitespace nach Classics:** ~19% (von 34%), in der Linear/Figma-Zone.

---

## Follow-up: Discover → Trendy Rename (2026-04-18)

**Grund:** Discover-Cards zeigten Filmlooks ohne sinnvolles Klick-Ziel. LookLab wäre logisch, aber dann müsste die Klick-Logik pro Card den Look in LookLab öffnen — das verlagert Business-Logik auf die Landing. Besser: Filmlook-Discovery wandert in den LookLab als interner Bereich; die Landing-Strip wird zu trendigen Community-Prompts mit eindeutigem Klick-Pfad (Prompt Hub).

**Thematischer Gewinn:** Landing dreht sich jetzt komplett um Grids — Classics (Struktur/Template) + Trendy (Output/Inspiration) sind beide Grid-bezogen. Kein thematischer Bruch mehr.

**Umgesetzt:**
- `DiscoverStrip.jsx` → `TrendyStrip.jsx` (`git mv`)
- `DiscoverStrip.module.css` → `TrendyStrip.module.css`
- `discover.json` → `trendy-prompts.json`
- `public/images/discover/` → `public/images/trendy/` (inkl. der 4 bereits abgelegten Bilder)
- Image-Pfade in JSON aktualisiert (`/SeenGrid/images/trendy/...`)
- Section-Header `DISCOVER` → `TRENDY`
- Link `trending looks · see all →` → `more in prompt hub →` (konsistent mit Classics-Link)
- `LandingPage.jsx`-Import aktualisiert, Reihenfolge: **Masthead → Create → Continue → Classics → Trendy**

**Unverändert:** Komplette Image-Infrastruktur (Netflix-Treatment, moodColor-Fallback, useOverflowDetection), 200px Card-Höhe, scroll-snap, JSON-Struktur. Auch Item-IDs (`prisoners`, `se7en`, `wong`, `argento`) und Titles/Taglines bleiben — sie funktionieren als Prompt-Output-Showcases genauso wie vorher als Filmlook-Labels. Jonas kann die Labels später bei Bedarf umschreiben.

**Konsequenz für LookLab:** Filmlook-Discovery-Bereich ist dort zu bauen — sobald LookLab-Visual-Update-Phase ansteht. Nicht Teil dieses Slices.

---

## Bekannte kleine Punkte (nicht blockierend)

- Session-Metadata-Zahlen im Masthead sind Dummy-Werte — gleiche Zahlen wie die StatusBar-Dummies, aber bewusst nicht geshared (siehe Briefing: keine Shared-State-Infrastruktur). Drei `TODO(token-store)` / `TODO(workspace-store)`-Marker stehen für späteren Store-Anschluss bereit.
- Create-Zone-Cards haben vier `TODO(routing)`-Marker (eine pro Card) für späteren Workspace-Routing-Anschluss. Per `grep -r "TODO(routing)"` auffindbar. Kein Navigation in diesem Slice.
- Gradient-Fade rechts fadet gegen `--sg2-bg-primary`. Sollte der Landing-Container später in einen anderen Surface-Background wechseln, muss der Fade angepasst werden.
- Continue-Projekte bleiben weiterhin hardcodiert als `CONTINUE_PROJECTS` in `ContinueStrip.jsx` bis der Projekt-Store in der Workspace-Phase gebaut wird.
- Classics-Items und Trendy-Prompts sind statisches JSON; werden später zu echten kuratierten Listen aus dem Prompt Hub (Classics = Hub-Kategorie, Trendy = Hub-Trending-Sektion). Kein Store-Anschluss in diesem Slice.
- Responsive-Breakpoints: 1100px (Masthead-Meta kürzt), 900px (Create-Zone auf 2-Column, Masthead-Meta kürzt weiter). Mobile <600px ist nicht Scope (Briefing explizit).
- Create-Zone hat aktuell Icon-Placeholder-Kästchen (24×24), keine echten Icons. Und auf 200px Card-Höhe sitzen sie mit viel Luft drumrum — Downstream-Polish (Größer-Skalierung, echte Icons aus `railIcons.jsx`, oder Tool-Preview-Visuals) nach weiterem Live-Check.
- Trendy-Items behalten vorerst die Filmlook-Labels aus der Discover-Ära (`prisoners look`, `se7en fluorescence`, etc.). Funktionieren als Prompt-Output-Showcases, können aber bei Bedarf durch echte trendige Community-Prompt-Labels ersetzt werden — reines JSON-Edit in `src/data/trendy-prompts.json`.
- Bottom-Whitespace: ~19% auf 1080p nach Classics + Trendy-Rename. Im Linear/Figma-Bereich. Falls live noch zu viel: Discover/Trendy-Card-Höhe von 200 auf 170 (Stellhebel war in der Diskussion).

---

## Git-Stand

- **Branch:** `claude/seengrid-visual-overhaul-6RK4n`
- Commit siehe `git log` am Ende dieser Session.
- Working tree clean nach Commit.

---

## Hinweise für den nächsten Chat (Workspace-Planning)

- Jonas ist Nicht-Coder, Deutsch, direkt, brutal ehrlich.
- Workspace-Planning ist **Konzept-Session, keine Bau-Session** — analog zur Picker-Planungs-Phase.
- Grid Engine (42 Tests) bleibt komplett unberührt.
- Brand-Entscheidungen (Teal/Gold, Schrift, Masthead-Konzept) sind final — nicht neu verhandeln.
- PRODUCT_STRATEGY_V1 §7 (Projekt-Kontext im Workspace-Header) ist Ausgangspunkt für die Header-Gestaltung.
- OPEN_DECISIONS #4 / #5 / #7 / #9 sind potenziell relevant — #7 (Projekt-Wechsel-UI) wird in der Workspace-Phase entschieden, #9 (Avatar) möglicherweise mit.

---

**Ende LANDING_REDESIGN_STATUS.**
