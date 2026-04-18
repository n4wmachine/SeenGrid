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

## Bekannte kleine Punkte (nicht blockierend)

- Session-Metadata-Zahlen sind Dummy-Werte — gleiche Zahlen wie die StatusBar-Dummies, aber bewusst nicht geshared (siehe Briefing: keine Shared-State-Infrastruktur).
- Gradient-Fade rechts fadet gegen `--sg2-bg-primary`. Sollte der Landing-Container später in einen anderen Surface-Background wechseln, muss der Fade angepasst werden.
- Continue-Projekte bleiben weiterhin hardcodiert als `CONTINUE_PROJECTS` in `ContinueStrip.jsx` bis der Projekt-Store in der Workspace-Phase gebaut wird.
- Responsive-Breakpoints: 1100px (Masthead-Meta kürzt), 900px (Discover/QuickStart auf 2-Column, Masthead-Meta kürzt weiter). Mobile <600px ist nicht Scope (Briefing explizit).
- Quick-Start hat aktuell Icon-Placeholder-Kästchen, keine echten Icons. Echte Icons würden die bestehende `railIcons.jsx`-Sammlung wiederverwenden (aus Scope-Gründen nicht mit reingepackt, kleiner Polish-Punkt für nächste Session).

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
