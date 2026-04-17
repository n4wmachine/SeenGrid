# Phase 1 Status — Visual Overhaul

**Stand:** 2026-04-17
**Branch:** `claude/seengrid-visual-overhaul-6RK4n`
**Vorgänger-Branch:** `claude/seengrid-visual-phase-2-5ZC5a` (Phase 1 Shell+Landing inkl. Rail-Fixes, gemergt als Fast-Forward)

---

## Strategie-Wechsel am Ende dieser Session

Statt direkt in den Grid Creator Picker zu gehen, wird jetzt eine **dedizierte Brand-Session** geschaltet. Grund: die Foundation ist technisch sauber (Shell, Rail, Landing, Fonts laden), aber **visuell noch nicht tragfähig**. Die Brand-Entscheidungen (Schrift, Atmosphäre, Layout-Polish der Landing) müssen vor dem Picker stehen, damit der Picker nicht auf wackligem Boden gebaut wird und später nachgezogen werden muss.

**Picker wird erst nach der Brand-Session gebaut.**

---

## Session 2026-04-17 — Zusammenfassung

Drei Loose Ends geschlossen (Hero, Tooltip, Fonts). Danach Strategiewechsel in Richtung Brand-Session.

**Gemacht:**
- Hero-Logo Container hochgesetzt
- Tooltip funktional verifiziert
- Font-Loading repariert: jsdelivr-@imports für Geist waren kaputt. Fix: Geist + Geist Mono lokal via `@fontsource/geist` / `@fontsource/geist-mono`

---

## Aktueller Stand

### Fonts (technisch fertig)
- **Wordmark** läuft in **Instrument Serif** (via Google Fonts, 400)
- **Tagline** läuft in **Geist Mono**
- **Cards, UI-Text, Labels** laufen in **Geist Sans**
- Alle Fonts laden sauber. `npm install` wurde manuell vom User auf lokalem Rechner ausgeführt, Browser zeigt die Zielschriften.

### Hero-Container (Werte aktuell in `LandingPage.module.css`)
- `.heroLogo` — **200×200** (vorher 160×160)
- `.heroLogoInner` — **180×180** (vorher 136×136)
- `.heroWordmark` — 72px Instrument Serif (unverändert)

### Tooltip
- Position rechts vom Rail-Item, zwei Zeilen (Titel + Beschreibung), Inhalt pro Page korrekt
- Funktional verifiziert durch User

---

## Aktuelle Wahrnehmung des Users (Input für Brand-Session)

Die Foundation läuft technisch, aber **visuell unbefriedigend**. Konkrete Beobachtungen nach dem Font-Fix:

- **Wordmark wirkt zu schwer / zu buchhaft.** Instrument Serif in 72px fühlt sich an wie Titelseite eines Romans, nicht wie Pre-Production-Tool. Die filmisch-editoriale Richtung aus dem Handoff ist gemeint — aber der aktuelle Eindruck trifft sie nicht.
- **Tagline in Geist Mono ist semantisch falsch.** Monospace signalisiert "technisch, code-nah". Die Tagline "pre-production OS for AI filmmakers" sollte **emotional** wirken, nicht technisch. Mono ist für Status, Labels, Code-artige Hints korrekt — nicht für Brand-Tagline.
- **Cards wirken gequetscht.** Zu wenig Luft zwischen Thumbnail und Meta-Block, zu wenig Atem zwischen den Cards selbst.
- **Section-Labels zu klein, Gradient-Lines fehlen optisch.** Sie sind zwar codiert (`sectionLine` Gradient), wirken aber zu dünn / zu unauffällig — die Bänder-Trennung trägt das Layout nicht.
- **Atmosphäre fehlt generell.** Die Landing fühlt sich an wie ein sauber aufgeräumter Prototyp, nicht wie ein filmisches Pre-Production-Werkzeug im DaVinci-/Frame.io-/Runway-Territorium.

Diese Punkte gehen als Input in die Brand-Session.

---

## Nächster Schritt: Brand-Session (eigener Chat)

Klärt in Reihenfolge:

1. **Schrift-Richtung:** Welche Display-Schrift trägt den Wordmark ohne "zu buchhaft" zu wirken? Welche Schrift trägt die Tagline (nicht Mono)? Geist Sans als Body bleibt vermutlich stehen.
2. **Visuelle Atmosphäre:** Wie wirkt die Landing filmisch ohne kitschig zu werden? Farbtemperatur, Kontrast, evtl. subtile Hintergrund-Textur oder Noise.
3. **Layout-Polish:** Card-Padding, Section-Label-Hierarchie, Gradient-Line-Stärke, Gap-Werte zwischen Bändern und innerhalb der Grids.

Erst **nach** der Brand-Session kommt der Grid Creator Picker (Mockup 02). Dadurch wird der Picker auf dem finalen Brand-Fundament gebaut, nicht auf dem Platzhalter.

---

## Fertig (Phase 1 Foundation)

### Foundation
- `src/styles/tokens.css` — alle V2 Design-Tokens mit `--sg2-*` Prefix
- `src/styles/globals.css` — Scrollbars, Selection, `.sg2-shell` Reset, Instrument Serif @import
- `src/config/pages.config.json` — 10 Main-Pages + 2 Util-Pages
- `src/main.jsx` — tokens.css + globals.css + @fontsource Geist Imports

### Shell-Komponenten
- `src/components/shell/Rail.jsx` + `Rail.module.css`
- `src/components/shell/railIcons.jsx`
- `src/components/shell/ShellHeader.jsx` + `ShellHeader.module.css`
- `src/components/shell/StatusBar.jsx` + `StatusBar.module.css`
- `src/components/shell/ComingSoon.jsx` + `ComingSoon.module.css`
- `src/components/shared/RichTooltip.jsx` + `RichTooltip.module.css`

### Landing Page (Foundation-Level, visuelles Polish offen)
- `src/components/landing/LandingPage.jsx` + `LandingPage.module.css` — Hero, 3 Bänder, Thumbnails, Trending-Badges

### Context + Routing
- `src/context/PageMetaContext.jsx`
- `src/App.jsx` + `src/App.css`

### Rail Active-State
- Glow verworfen (dokumentiert, nicht wieder versuchen)
- Active-State: Teal-Icon + linker Teal-Balken + kein Background
- Specificity, Hitbox, Hover-Feedback, Gold-Dot — alles final

---

## Offene Bugs

*Keine aktiven Bugs.* Alle Loose Ends geschlossen. Die Wahrnehmungs-Punkte oben sind **Brand-Themen**, keine Bugs.

---

## Etablierte Konventionen

- **Tech:** Vite + React (JavaScript), CSS Modules, kein TypeScript
- **CSS-Prefix:** `--sg2-*` für alle neuen Design-Tokens (koexistiert mit Legacy `--sg-*`)
- **Code-Übergabe:** Komplette Files statt Diffs, ein File pro Antwort
- **Routing:** Kein React-Router — `useState`-basiertes Page-Switching
- **Fonts:** Lokal via `@fontsource` (Geist, Geist Mono, Space Grotesk, JetBrains Mono). Instrument Serif via Google Fonts.
- **Farben:** Teal (#3ccfcc) = universeller UI-Akzent, Gold (#f5c961) = nur Signatures
- **Grid Engine:** Slices 1-8 fertig, 42 Tests — bleibt komplett unberührt
- **Rail Active-State:** Kein Glow, kein Background. Nur Teal-Icon + Balken + Hover-Highlight.
- **Padding-Trap:** `.sg2-shell *` Reset in globals.css nullt `padding: 0` für alle Kinder. Bei Bedarf spezifischere Regel statt `!important`.

---

## Referenzen

| Datei | Zweck |
|-------|-------|
| `docs/visual-overhaul/SEENGRID_VISUAL_OVERHAUL_HANDOFF_v2.md` | Komplette Spec |
| `docs/visual-overhaul/NUANCEN.md` | Design-Rationale, Anti-Drift-Schutz |
| `docs/visual-overhaul/mockup_01_shell_landing.html` | Shell + Landing Mockup |
| `docs/visual-overhaul/mockup_02_gridcreator_picker.html` | Grid Creator Picker Mockup (wartet auf Brand-Session) |
| `docs/visual-overhaul/mockup_03_gridcreator_workspace.html` | Grid Creator Workspace Mockup (wartet auf Brand-Session + Picker) |

---

## Hinweise für den nächsten Chat (Brand-Session)

- **Jonas** ist Nicht-Coder, Deutsch, direkte Kommunikation, brutal ehrlich
- Die Brand-Session ist **Entscheidungs-Session, nicht Bau-Session.** Erst Richtung klären, dann eine separate Umsetzungs-Session
- Bestehende Foundation (Shell, Rail, Routing) bleibt — Brand-Session verändert nur Visual-Layer (Schrift, Atmosphäre, Landing-Polish)
- Grid Engine (Slices 1-8, 42 Tests) bleibt komplett unberührt
- **Rail Glow ist bewusst verworfen** — nicht wieder thematisieren
- **NUANCEN gewinnt bei Konflikten mit Mockups**
- Nach Brand-Session: Picker (Mockup 02), dann Workspace (Mockup 03)

---

## Git-Stand am Ende dieser Session

- **Branch:** `claude/seengrid-visual-overhaul-6RK4n`
- **Letzte Commits (Reihenfolge):**
  - `2d29e84` — fix: hero logo visible cells too small (erster Fix-Versuch, kein visueller Effekt wegen Padding-Reset)
  - `c75d1bb` — fix: hero logo container too small (real cause) — Container 200/180
  - `acc8270` — fix: geist fonts not loading — switch jsdelivr → @fontsource
  - Letzter Commit: dieser Status-Update (siehe `git log` auf dem Branch)
- Alles gepusht auf `origin/claude/seengrid-visual-overhaul-6RK4n`
- Working tree clean nach Commit
