# Phase 1 Status — Visual Overhaul

**Stand:** 2026-04-17  
**Branch:** `claude/seengrid-visual-overhaul-RQLjg`  
**Commits:** 12 (ab `444ac44` bis `a55f9d4`)

---

## Fertig

### Foundation
- `src/styles/tokens.css` — Alle V2 Design-Tokens mit `--sg2-*` Prefix (Farben, Typo, Layout, Radii, Shadows, Transitions)
- `src/styles/globals.css` — CDN-Font-Imports (Instrument Serif via Google Fonts, Geist Sans/Mono via jsdelivr), Scrollbar-Styles, Selection, `.sg2-shell` Reset
- `src/config/pages.config.json` — 10 Main-Pages + 2 Util-Pages, JSON-driven (id, label, icon, route, status, group, tooltip)
- `src/main.jsx` — tokens.css + globals.css Imports nach bestehendem theme.css

### Shell-Komponenten
- `src/components/shell/Rail.jsx` + `Rail.module.css` — 88px Rail mit Brand-Zone (96px Logo-Container, 46px 2×2-Grid, 17px Wordmark), Group-Labels, RailItems mit Coming/Active/Starred States, RichTooltip-Integration
- `src/components/shell/railIcons.jsx` — 12 SVG-Icons (28px Main, 24px Util), stroke-based, currentColor
- `src/components/shell/ShellHeader.jsx` + `ShellHeader.module.css` — 56px Header, dynamischer Title+Subtitle via usePageMeta, Version-Label + Divider + Avatar rechts
- `src/components/shell/StatusBar.jsx` + `StatusBar.module.css` — 28px Statusbar mit Ready-Dot, Counts, Timestamp
- `src/components/shell/ComingSoon.jsx` + `ComingSoon.module.css` — Placeholder-Page für Coming/Util-Pages
- `src/components/shared/RichTooltip.jsx` + `RichTooltip.module.css` — Wiederverwendbarer Tooltip mit Position-Awareness

### Landing Page
- `src/components/landing/LandingPage.jsx` + `LandingPage.module.css` — Hero (Logo-Grid + Wordmark + Tagline), 3 Bänder (Continue, Quick Start, Discover), Thumbnail-Komponenten (grid4/noir/teal/green/red/amber), Trending-Badges, Section-Labels mit Gradient-Lines

### Context + Routing
- `src/context/PageMetaContext.jsx` — usePageMeta Hook (Title/Subtitle pro Page, clearPageMeta bei Page-Wechsel)
- `src/App.jsx` + `src/App.css` — Flex-Row Layout (Rail + Content), PageMetaProvider, PAGE_TO_TAB Bridge für Legacy-Tabs, Coming-Routing

---

## Offene Bugs (nächster Chat muss fixen)

### Rail Aktiv-State → Border-Rahmen statt Glow
- **Problem:** Aktives Item zeigt trotz mehrfacher Fixes immer noch eine sichtbare Umrandung statt eines diffusen Außen-Glows
- **Mögliche Ursachen:**
  - `inset 0 0 0 1px` im box-shadow wurde zuletzt entfernt — prüfen ob der Fix tatsächlich greift (Build-Cache?)
  - Andere CSS-Properties die als Linie rendern könnten
- **Zielzustand:**
  ```css
  background: linear-gradient(180deg, rgba(43, 181, 178, 0.15) 0%, rgba(43, 181, 178, 0.08) 100%);
  box-shadow: 0 0 28px rgba(43, 181, 178, 0.35);
  border: none;
  ```
- **Referenz:** Linear-Sidebar, Frame.io-Sidebar, Arc-Browser — subtil, pro, kein Gaming-Neon
- **Linker Teal-Balken (::before) bleibt** als klarer Aktiv-Marker

### Hero-Proportionen rendern zu klein
- **Problem:** Logo soll 160px hoch rendern, rendert aber kleiner. Trotz korrekter CSS-Werte (160px Container, 136px Inner Grid, 72px Wordmark)
- **Mögliche Ursachen:** Übergeordnete CSS-Regel, Flex-Compression, Max-Width, Build-Cache
- **Aktion:** Mit DevTools live messen, Computed Styles prüfen, nicht nur CSS-Werte setzen
- **Aktuelle CSS-Werte:** heroLogo 160×160, heroLogoInner 136×136, heroWordmark 72px, flex-shrink: 0 auf allen Elementen

### Tooltip-Position
- RichTooltip soll rechts neben Rail-Item mit Pfeil erscheinen — Position-Awareness implementiert, aber visuelle Verifizierung im Browser steht aus

### Alter Tab-Header als Fallback
- Legacy Header mit Tabs (PromptBuilder/GridOperator/MJ/Vault) läuft noch parallel für Pages lab/grid/frame/hub via PAGE_TO_TAB Bridge
- Wird erst entfernt wenn alle neuen Pages eigenständig stehen

---

## Etablierte Konventionen

- **Tech:** Vite + React (JavaScript), CSS Modules, kein TypeScript
- **CSS-Prefix:** `--sg2-*` für alle neuen Design-Tokens (koexistiert mit Legacy `--sg-*`)
- **Code-Übergabe:** Komplette Files statt Diffs, ein File pro Antwort (Ausnahme: kleine gruppierte Foundation-Files)
- **Routing:** Kein React-Router — `useState`-basiertes Page-Switching in App.jsx
- **Page-Titles:** `usePageMeta()` Hook erlaubt dynamisches Setzen von Title + Subtitle pro Page
- **Coming-Pages:** Klickbar, führen zu ComingSoon-Placeholder
- **Legacy-Bridge:** PAGE_TO_TAB Mapping hält alte Tab-Komponenten am Laufen während Transition
- **Fonts:** CDN (Google Fonts für Instrument Serif 400, jsdelivr für Geist Sans/Mono)
- **Farben:** Teal (#3ccfcc / #2bb5b2) = universeller UI-Akzent, Gold (#f5c961) = nur Signatures
- **Grid Engine:** Slices 1-8 fertig, 42 Tests — bleibt komplett unberührt

---

## Nächste Schritte (in Reihenfolge)

1. **Offene Bugs fixen** (Rail-Glow, Hero-Size, Tooltip-Position)
2. **Grid Creator Picker** — Neue Page, Template-Auswahl mit 10 Core Templates + Classics + Start from Scratch
3. **Grid Creator Workspace** — Größter Brocken: 3-Spalten-Layout + Full-Width Preview/Signatures/Output-Bars
4. **Token-Store Basis (Stufe 1)** — SeenLab schreibt, Grid Creator liest Signatures
5. **Coming-Placeholders finalisieren** für alle Rail-Items
6. **Alten Tab-Header rausschmeißen** wenn neue Pages stehen

---

## Referenzen

| Datei | Zweck |
|-------|-------|
| `docs/visual-overhaul/SEENGRID_VISUAL_OVERHAUL_HANDOFF_v2.md` | Komplette Spec |
| `docs/visual-overhaul/NUANCEN.md` | Design-Rationale, Nuancen |
| `docs/visual-overhaul/mockup_01_shell_landing.html` | Shell + Landing Mockup |
| `docs/visual-overhaul/mockup_02_gridcreator_picker.html` | Grid Creator Picker Mockup |
| `docs/visual-overhaul/mockup_03_gridcreator_workspace.html` | Grid Creator Workspace Mockup |

---

## Hinweise für den nächsten Chat

- **Jonas** ist Nicht-Coder, spricht Deutsch, will direkte Kommunikation
- Keine Sycophancy, brutale Ehrlichkeit bevorzugt
- Screenshots werden von separatem Chat analysiert, Fixes kommen als Text-Prompts
- Grid Engine (Slices 1-8, 42 Tests) bleibt komplett unberührt
- Branch-Regel laut CLAUDE.md: direkt auf main — aber aktuell wird auf Feature-Branch gearbeitet (`claude/seengrid-visual-overhaul-RQLjg`)
- Instrument Serif hat auf Google Fonts nur weight 400 (kein 500/Medium)
