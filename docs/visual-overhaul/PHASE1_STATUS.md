# Phase 1 Status — Visual Overhaul

**Stand:** 2026-04-17
**Branch:** `claude/seengrid-visual-overhaul-6RK4n`
**Vorgänger-Branch:** `claude/seengrid-visual-phase-2-5ZC5a` (Phase 1 Shell+Landing inkl. Rail-Fixes, gemergt als Fast-Forward)

---

## Session 2026-04-17 — Zusammenfassung

Shell + Landing + Rail stehen stabil. In dieser Session wurden drei Loose Ends geschlossen (Hero, Tooltip, Fonts). Keine neuen Features — nur Bereinigung, damit Phase 2 auf sauberem Fundament weiterbauen kann.

**Gemacht:**
- Hero-Logo Container hochgesetzt (heroLogo 160→200, heroLogoInner 136→180)
- Tooltip funktional verifiziert
- Font-Loading repariert: jsdelivr-@imports für Geist waren kaputt, Browser fiel auf Fallback. Fix: Geist + Geist Mono lokal via `@fontsource/geist` und `@fontsource/geist-mono`

---

## Schrift-Status

- **Geist Sans + Geist Mono:** via `@fontsource/geist` / `@fontsource/geist-mono` lokal installiert, importiert in `main.jsx`. Keine CDN-Abhängigkeit mehr für Geist.
- **Instrument Serif:** läuft stabil via Google Fonts `@import` in `globals.css` (200 OK bestätigt). Bleibt als einzige CDN-Quelle vorerst.
- **Font-Stack in `tokens.css`:** Body `'Geist', system-ui, ...` (Phantom `'Geist Sans'` entfernt). Mono `'Geist Mono', 'SF Mono', 'Fira Code', monospace`. Display `'Instrument Serif', Georgia, serif`.
- **Finale Font-Wahl steht aus.** Wartet auf Brand-Session. Geist + Instrument Serif sind Platzhalter-Entscheidung — funktional sauber, aber nicht final gebrandet.

---

## Hero-Status

- **Akzeptiert mit Platzhalter-Logo.** Aktuelle Werte in `LandingPage.module.css`:
  - `.heroLogo` — 200×200
  - `.heroLogoInner` — 180×180 (2px Teal-Border, `gap: 8px`, sichtbare Zellen ~84px)
  - `.heroWordmark` — 72px Instrument Serif
- **Padding-Anomalie dokumentiert:** `globals.css` `.sg2-shell *` Reset nullt alle Paddings innerhalb der Shell. Falls später Innenabstand im Logo-Container nötig, spezifischere Regel nutzen (nicht `!important`).
- **Echtes Logo wartet auf Brand-Session.** Das 2×2-Raster ist Platzhalter.

---

## Tooltip-Status

- **Funktional verifiziert:** Position rechts vom Rail-Item, zwei Zeilen (Titel + Beschreibung), Inhalt pro Page korrekt.
- **Styling-Polish offen** (Pfeil-Form, Background-Shade, Border-Tint). Kommt erst wenn der alte Legacy-Tab-Header raus ist — solange parallele UIs laufen lässt sich der finale Eindruck nicht sauber bewerten.

---

## Fertig

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

### Landing Page
- `src/components/landing/LandingPage.jsx` + `LandingPage.module.css` — Hero, 3 Bänder, Thumbnails, Trending-Badges

### Context + Routing
- `src/context/PageMetaContext.jsx`
- `src/App.jsx` + `src/App.css` — Flex-Row Layout, PAGE_TO_TAB Bridge

### Rail Active-State (aus vorheriger Session)
- Glow verworfen (dokumentiert, nicht wieder versuchen)
- Active-State: Teal-Icon + linker Teal-Balken + kein Background
- Specificity, Hitbox, Hover-Feedback, Gold-Dot — alles final

---

## Offene Bugs

*Keine aktiven.* Hero und Tooltip sind oben unter Status abgehakt. Font-Loading ist gefixt.

---

## Etablierte Konventionen

- **Tech:** Vite + React (JavaScript), CSS Modules, kein TypeScript
- **CSS-Prefix:** `--sg2-*` für alle neuen Design-Tokens (koexistiert mit Legacy `--sg-*`)
- **Code-Übergabe:** Komplette Files statt Diffs, ein File pro Antwort
- **Routing:** Kein React-Router — `useState`-basiertes Page-Switching in App.jsx
- **Page-Titles:** `usePageMeta()` Hook
- **Coming-Pages:** Klickbar, führen zu ComingSoon-Placeholder
- **Fonts:** Lokal via `@fontsource` (Geist, Geist Mono, Space Grotesk, JetBrains Mono). Instrument Serif via Google Fonts.
- **Farben:** Teal (#3ccfcc) = universeller UI-Akzent, Gold (#f5c961) = nur Signatures
- **Grid Engine:** Slices 1-8 fertig, 42 Tests — bleibt komplett unberührt
- **Rail Active-State:** Kein Glow, kein Background. Nur Teal-Icon + Balken + Hover-Highlight.
- **Padding-Trap:** `.sg2-shell *` Reset in globals.css nullt `padding: 0` für alle Kinder. Bei Bedarf spezifischere Regel statt `!important`.

---

## Nächste Schritte (in Reihenfolge)

1. **Grid Creator Picker** — Neue Page, Template-Auswahl mit 10 Core Templates + Classics + Start from Scratch. Mockup: `mockup_02_gridcreator_picker.html`.
2. **Grid Creator Workspace** — Größter Brocken: 3-Spalten-Layout + Full-Width Preview/Signatures/Output-Bars. Mockup: `mockup_03_gridcreator_workspace.html`.
3. **Token-Store Basis (Stufe 1)** — SeenLab schreibt, Grid Creator liest Signatures.
4. **Coming-Placeholders finalisieren** für alle Rail-Items.
5. **Alten Tab-Header rausschmeißen** wenn neue Pages stehen. Dann Tooltip-Styling-Polish.
6. **Brand-Session** — finale Schrift + echtes Logo (verdrängt Platzhalter).

---

## Referenzen

| Datei | Zweck |
|-------|-------|
| `docs/visual-overhaul/SEENGRID_VISUAL_OVERHAUL_HANDOFF_v2.md` | Komplette Spec |
| `docs/visual-overhaul/NUANCEN.md` | Design-Rationale, Anti-Drift-Schutz |
| `docs/visual-overhaul/mockup_01_shell_landing.html` | Shell + Landing Mockup |
| `docs/visual-overhaul/mockup_02_gridcreator_picker.html` | Grid Creator Picker Mockup |
| `docs/visual-overhaul/mockup_03_gridcreator_workspace.html` | Grid Creator Workspace Mockup |

---

## Hinweise für den nächsten Chat

- **Jonas** ist Nicht-Coder, Deutsch, direkte Kommunikation, brutal ehrlich
- Grid Engine (Slices 1-8, 42 Tests) bleibt komplett unberührt
- **Rail Glow ist bewusst verworfen** — nicht erneut versuchen
- **RichTooltip `.trigger`** hat kein `justify-content: center` mehr — nicht wieder hinzufügen
- **Padding innerhalb `.sg2-shell`** wird vom `*`-Reset genullt — wer Innenabstand braucht, nutzt spezifischere Regel
- **NUANCEN gewinnt bei Konflikten mit Mockups** (siehe Hero: Mockup hat keinen, NUANCEN fordert einen, Hero bleibt)
- Font-Wahl ist nicht final. Swap später ist ein Zeilenlöscher + Zeilentausch in `main.jsx` + `tokens.css`.

---

## Git-Stand am Ende dieser Session

- **Branch:** `claude/seengrid-visual-overhaul-6RK4n`
- **Letzte relevante Commits:**
  - `2d29e84` — fix: hero logo visible cells too small (erster Fix-Versuch, kein visueller Effekt wegen Padding-Reset)
  - `c75d1bb` — fix: hero logo container too small (real cause) — Container 200/180
  - Font-Fix Commit folgt unten (siehe `git log` auf Branch)
