# Phase 1 Status — Visual Overhaul

**Stand:** 2026-04-17
**Branch:** `claude/seengrid-visual-overhaul-6RK4n`
**Vorgänger-Branch:** `claude/seengrid-visual-phase-2-5ZC5a` (Phase 1 Shell+Landing inkl. Rail-Fixes, gemergt als Fast-Forward)

---

## Wo stehen wir

**Foundation + Brand-Session abgeschlossen.** Landing-Page, Rail, Header, StatusBar, Tooltips laufen technisch und visuell auf Pro-Tool-Niveau. Nächster Schritt ist **nicht** direkt der Picker, sondern eine dedizierte **Produkt-Strategie-Session**, weil das Continue-Band auf der Landing eine Projekt-Hierarchie impliziert die es im Code noch nicht gibt.

---

## Brand-Entscheidungen (final, 2026-04-17)

### Schriften

- **General Sans** trägt Display + Body. Selbst gehostet aus `public/fonts/general-sans/`, drei Schnitte: Regular (400), Medium (500), Bold (700). Kein CDN.
- **JetBrains Mono** für alle Mono-Rollen: Section-Labels, Sub-Lines ("grid · 14m ago"), Version-Label, Status-Bar, Mono-Hints.
- **Geist + Geist Mono** bleiben als Fallback-Fonts in den Token-Definitionen (lokal via `@fontsource`) — werden nur genutzt wenn General Sans oder JetBrains Mono nicht laden.
- **Instrument Serif komplett entfernt.** Wordmark wirkte literarisch statt filmisch, Serif-Strategie wurde verworfen.
- **Space Grotesk** raus aus v2 (lebt nur noch in Legacy `theme.css` für Legacy-Komponenten).

### Font-Loading

- `public/fonts/general-sans/GeneralSans-Regular.woff2` (400)
- `public/fonts/general-sans/GeneralSans-Medium.woff2` (500)
- `public/fonts/general-sans/GeneralSans-Bold.woff2` (700)
- URL-Prefix `/SeenGrid/fonts/general-sans/` in `@font-face`-src (wegen Vite `base: '/SeenGrid/'`, funktioniert lokal und auf GitHub Pages).
- `font-display: swap` auf allen drei Faces.
- **`font-synthesis: none`** auf `.sg2-shell` als Qualitätssicherung — verhindert dass der Browser fehlende Weights synthetisch aus vorhandenen baut. Falls mal ein Weight fehlt, scheitert es sichtbar statt kaschiert.

### Hero (Landing)

- Wordmark "SeenGrid": 72px, Weight 700 (Bold), letter-spacing -0.005em (fast neutral, vorher -0.025em war zu eng), color `#f0f0fa`, line-height 1.
- Tagline "pre-production OS for AI filmmakers": 15px, Weight 400, General Sans (nicht mehr Mono), letter-spacing 0, color `#b0b0c8`, line-height 1.4.
- Atem: Logo→Wordmark 24px, Wordmark→Tagline 16px, Hero→erstes Band **80px**.

### Section-Labels (CONTINUE / QUICK START / DISCOVER)

- 12px, JetBrains Mono, Weight 600, letter-spacing 0.2em, color `#a0a0b8`, uppercase.
- Gap Label→Gradient-Linie: 16px. Margin-bottom zum ersten Grid: 22px.
- Gradient-Linie: `linear-gradient(90deg, rgba(60, 207, 204, 0.18), transparent)` (Teal-Tint statt reinem Weiß).

### Landing-Grids

- Alle drei Bänder: `auto-fit` statt `auto-fill` (füllt Screen-Breite wenn weniger Cards als Slots).
- CONTINUE + QUICK START: `minmax(260px, 1fr)`, gap 16px.
- DISCOVER: `minmax(200px, 1fr)`, gap 16px.
- Band-Abstand (margin-bottom): 56px.

### QUICK START Cards

- Padding: 28px 28px.
- Icon-Container: 36×36px (vorher 40), border-radius 8px.
- Gap Icon→Title: 20px. Gap Title→Desc: 7px.
- Title: 15px, Weight 500, General Sans. Desc: 12px, JetBrains Mono.

### CONTINUE + DISCOVER Cards

- `.landMeta` padding: 16px 18px.
- Title: 14px, Weight 500, General Sans, margin-bottom 6px.
- Sub-Line: 11px, JetBrains Mono ("grid · 14m ago").

### Rail

- Rail-Wordmark **entfernt.** Logo-Mark trägt die Brand-Präsenz allein. Wordmark lebt im Landing-Hero (groß) und im Header (als Page-Title). In der Rail redundant.
- BrandZone padding-bottom 20px (Abstand Logo→Separator).
- Focus-Ring: `:focus-visible` zeigt 2px Teal-Ring (`rgba(60, 207, 204, 0.6)`, 2px offset) auf Logo + Items. `:focus` unterdrückt Browser-Default bei Maus.

### Tooltip (RichTooltip)

- Kein Border. Abgrenzung trägt Background-Escalation + Shadow.
- Background: hartcodiert `#22222f` (ca. 8 Werte heller als `--sg2-bg-elevated #1a1a26`) — bewusste Escalation.
- Shadow: `0 12px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)` (zwei Ebenen: weich schwebend + harte Unterkante).
- Padding: 12px 14px. Max-width: 280px. Overflow: visible.
- Title 13px Weight 500 General Sans, Desc 12px Weight 400 General Sans (**nicht** Mono — bewusste Abweichung vom Mockup 01 weil Tooltip-Desc erzählerisch ist, nicht strukturell).
- Arrow: `#22222f` ohne Border, Offsets -4px (vorher -5 mit Border-Stummel).

### Specificity-Pattern (Reset-Schutz)

**Kritisch:** Der globale Reset `.sg2-shell *, .sg2-shell *::before, .sg2-shell *::after { padding: 0; margin: 0; }` in `globals.css` hat Specificity `(0,1,0)` — identisch zu CSS-Module-Klassen. Bei gleicher Specificity entscheidet Lade-Reihenfolge, was in Vite-Dev-Mode instabil ist.

**Pattern:** Alle padding/margin-setzenden Regeln in `LandingPage.module.css` und `RichTooltip.module.css` laufen über `:global(.sg2-shell) .xyz` (Specificity `(0,2,0)`). Schlägt den Reset robust, ohne `!important`.

Für zukünftige Komponenten: Das Pattern übernehmen, sobald padding oder margin innerhalb von `.sg2-shell` gesetzt wird.

---

## Offener Punkt: Produkt-Strategie-Session steht an

**Problem:** Das Continue-Band auf der Landing zeigt aktuell drei hartcodierte Dummy-Einträge ("laundromat owner · angle study", "deakins lighting · noir variant", "diner cook · expression sheet"). Das impliziert eine Projekt-/Session-Hierarchie die es im Code noch nicht gibt.

**Vor dem Picker-Bau zu klären:**
- Was ist ein "Projekt" im SeenGrid-Sinn? (Container für Grids? Container für Szenen-Konfigurationen? Metadaten-Eintrag?)
- Wie hängen Grid-Presets an Projekten? (Speichert der User ein Grid pro Projekt? Pro Szene? Global?)
- Was erscheint konkret im Continue-Band? (Letzte Grids? Letzte Projekte? Letzte Sessions als Mischformat?)
- Wie hängen Signatures (Stufe 1 Token-Store) an dem allen? (Projekt-scoped? Global?)

**Bis dahin:** Continue-Band-Inhalte bleiben hartcodierte Placeholder. Werden sichtbar als Fertig-Dummy, nicht als echte User-Daten.

**Reihenfolge:** Produkt-Strategie-Session → Handoff-Doc → Picker-Phase kann starten.

---

## Fertig

### Foundation

- `src/styles/tokens.css` — alle V2 Design-Tokens mit `--sg2-*` Prefix. Font-Tokens auf General Sans + JetBrains Mono umgestellt, Geist als Fallback.
- `src/styles/globals.css` — `@font-face`-Blöcke für General Sans (self-hosted), Scrollbars, Selection, Focus, `.sg2-shell` Reset, `font-synthesis: none`.
- `src/config/pages.config.json` — 10 Main-Pages + 2 Util-Pages.
- `src/main.jsx` — tokens.css + globals.css + @fontsource Geist/Geist Mono/JetBrains Mono/Space Grotesk Imports.
- `index.html` — keine externen Font-Calls mehr (Fontshare-CDN + preconnects raus).

### Shell-Komponenten

- `src/components/shell/Rail.jsx` + `Rail.module.css` — Wordmark entfernt, Focus-Ring drin.
- `src/components/shell/railIcons.jsx`
- `src/components/shell/ShellHeader.jsx` + `ShellHeader.module.css`
- `src/components/shell/StatusBar.jsx` + `StatusBar.module.css`
- `src/components/shell/ComingSoon.jsx` + `ComingSoon.module.css`
- `src/components/shared/RichTooltip.jsx` + `RichTooltip.module.css` — borderlos, Background-Escalation, zwei-Ebenen-Shadow.

### Landing Page

- `src/components/landing/LandingPage.jsx` — Hero, 3 Bänder, Thumbnails, Trending-Badges (unverändert seit Phase 1).
- `src/components/landing/LandingPage.module.css` — Brand-finalisiert.

### Context + Routing

- `src/context/PageMetaContext.jsx`
- `src/App.jsx` + `src/App.css`

### Font-Dateien

- `public/fonts/general-sans/GeneralSans-Regular.woff2`
- `public/fonts/general-sans/GeneralSans-Medium.woff2`
- `public/fonts/general-sans/GeneralSans-Bold.woff2`

---

## Offene Bugs

*Keine aktiven Bugs.* Wahrgenommenes Banding auf Tooltip-Shadows bei Jonas' Monitor wurde als Hardware-Limitierung (6-bit IPS-Panel) diagnostiziert, nicht als Bug — auf anderen Websites reproduzierbar.

---

## Etablierte Konventionen

- **Tech:** Vite + React (JavaScript), CSS Modules, kein TypeScript.
- **CSS-Prefix:** `--sg2-*` für alle neuen Design-Tokens (koexistiert mit Legacy `--sg-*`).
- **Code-Übergabe:** Komplette Files statt Diffs, ein File pro Antwort.
- **Routing:** Kein React-Router — `useState`-basiertes Page-Switching.
- **Fonts:** General Sans self-hosted. JetBrains Mono + Geist + Space Grotesk lokal via `@fontsource`. Keine CDN-Fonts.
- **Farben:** Teal (#3ccfcc) = universeller UI-Akzent, Gold (#f5c961) = nur Signatures.
- **Grid Engine:** Slices 1-8 fertig, 42 Tests — bleibt komplett unberührt.
- **Rail Active-State:** Kein Glow, kein Background. Nur Teal-Icon + Balken + Hover-Highlight.
- **Reset-Schutz:** `:global(.sg2-shell) .xyz` für alle padding/margin-Regeln innerhalb `.sg2-shell`. Kein `!important`.
- **Tooltip-Abgrenzung:** Background-Escalation + Shadow statt Border. Gilt als Pattern für zukünftige Floating-UI-Elemente.

---

## Referenzen

| Datei | Zweck |
|-------|-------|
| `docs/visual-overhaul/ROADMAP.md` | Phasen-Übersicht, aktive Phase |
| `docs/visual-overhaul/SEENGRID_VISUAL_OVERHAUL_HANDOFF_v2.md` | Komplette Spec |
| `docs/visual-overhaul/NUANCEN.md` | Design-Rationale, Anti-Drift-Schutz |
| `docs/visual-overhaul/mockup_01_shell_landing.html` | Shell + Landing Mockup (historisch, Brand-Entscheidungen weichen ab) |
| `docs/visual-overhaul/mockup_02_gridcreator_picker.html` | Grid Creator Picker Mockup (wartet auf Produkt-Strategie + Picker-Phase) |
| `docs/visual-overhaul/mockup_03_gridcreator_workspace.html` | Grid Creator Workspace Mockup (wartet auf Picker + Workspace-Phase) |

---

## Hinweise für den nächsten Chat (Produkt-Strategie)

- **Jonas** ist Nicht-Coder, Deutsch, direkte Kommunikation, brutal ehrlich.
- Die Produkt-Strategie-Session ist **Entscheidungs-Session, nicht Bau-Session.** Klärt Produkt-Konzept, keine Code-Änderungen.
- Bestehende Foundation + Brand bleiben — Produkt-Strategie verändert nichts am Visual-Layer.
- Grid Engine (Slices 1-8, 42 Tests) bleibt komplett unberührt.
- **NUANCEN gewinnt bei Konflikten mit Mockups.** Brand-Entscheidungen in diesem Status-Doc sind finaler als das Shell-Mockup 01.
- Nach Produkt-Strategie: Picker (Mockup 02, potenziell angepasst), dann Workspace (Mockup 03).

---

## Git-Stand am Ende der Brand-Session

- **Branch:** `claude/seengrid-visual-overhaul-6RK4n`
- **Brand-Commits (Reihenfolge):**
  - `dfc6ead` — brand: swap to General Sans + JetBrains Mono, polish landing atmosphere
  - `f42f616` — brand fix: rail wordmark out, general sans via <link>, auto-fit grids, specificity for reset
  - `9486e8d` — brand fix r2: fontshare weight params, font-synthesis off, tooltip wrap, qs icon size
  - `06d9d95` — brand fix r3 (partial): tooltip padding via specificity, rail focus ring
  - `94352d3` — fonts: General Sans self-hosted woff2 files (manuell von Jonas gepusht)
  - `3930c6f` — brand fix r3 part 2: General Sans self-hosted via @font-face
  - `69d1f8d` — brand fix r4: tooltip border out, background-escalation, desc 12px
  - Letzter Commit: dieser Status + Roadmap-Update
- Alles gepusht auf `origin/claude/seengrid-visual-overhaul-6RK4n`.
- Working tree clean nach Commit.
