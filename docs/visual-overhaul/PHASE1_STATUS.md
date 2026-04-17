# Phase 1 Status — Visual Overhaul

**Stand:** 2026-04-17  
**Branch:** `claude/seengrid-visual-phase-2-5ZC5a`  
**Vorgänger-Branch:** `claude/seengrid-visual-overhaul-RQLjg` (Phase 1 Shell+Landing, gemergt)

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

### Rail Active-State (diese Session gefixt)
- **Glow verworfen** — Nach 7+ Iterationen: box-shadow bandet auf 8-bit Panels, filter:blur() erzeugt Clipping-Artefakte, radial-gradient erzeugt sichtbare Formen. Entscheidung: kein Glow. Pro-Referenz (Linear, VS Code, Arc) zeigt: Sidebar-Glows sind unüblich.
- **Aktiv-State final:** Teal-Icon (`color: var(--sg2-teal)`) + linker Teal-Balken (::before, `left: 0`, Gradient transparent→teal→transparent) + kein Background. Drei klare Signale, keine Artefakte.
- **Specificity gefixt:** `.item.itemActive` (0,2,0) schlägt `.item:hover` (0,1,1) zuverlässig.
- **Hitbox gefixt:** RichTooltip `.trigger` hatte `justify-content: center` das den Button auf Icon-Größe schrumpfte. Entfernt. Button hat jetzt `flex: 1` und füllt die volle Rail-Breite.
- **Hover-Feedback:** Neutrales `rgba(255,255,255, 0.04)` auf `.item:hover` — zeigt klickbare Fläche als breites Rechteck, nicht als enge Ellipse.
- **Gold-Dot:** Horizontal zentriert über Icon (`left: 50%; transform: translateX(-50%)`), 5px.

---

## Offene Bugs

### Hero-Proportionen rendern zu klein
- **Problem:** Logo soll 160px hoch rendern, rendert aber kleiner
- **Mögliche Ursachen:** Übergeordnete CSS-Regel, Flex-Compression, Max-Width
- **Aktion:** Mit DevTools live messen, Computed Styles prüfen
- **Aktuelle CSS-Werte:** heroLogo 160×160, heroLogoInner 136×136, heroWordmark 72px, flex-shrink: 0

### Tooltip-Position
- RichTooltip soll rechts neben Rail-Item mit Pfeil erscheinen — Position-Awareness implementiert, visuelle Verifizierung steht aus

### Alter Tab-Header als Fallback
- Legacy Header mit Tabs läuft noch parallel für Pages lab/grid/frame/hub via PAGE_TO_TAB Bridge
- Wird erst entfernt wenn alle neuen Pages eigenständig stehen

---

## Etablierte Konventionen

- **Tech:** Vite + React (JavaScript), CSS Modules, kein TypeScript
- **CSS-Prefix:** `--sg2-*` für alle neuen Design-Tokens (koexistiert mit Legacy `--sg-*`)
- **Code-Übergabe:** Komplette Files statt Diffs, ein File pro Antwort
- **Routing:** Kein React-Router — `useState`-basiertes Page-Switching in App.jsx
- **Page-Titles:** `usePageMeta()` Hook erlaubt dynamisches Setzen von Title + Subtitle pro Page
- **Coming-Pages:** Klickbar, führen zu ComingSoon-Placeholder
- **Legacy-Bridge:** PAGE_TO_TAB Mapping hält alte Tab-Komponenten am Laufen während Transition
- **Fonts:** CDN (Google Fonts für Instrument Serif 400, jsdelivr für Geist Sans/Mono)
- **Farben:** Teal (#3ccfcc / #2bb5b2) = universeller UI-Akzent, Gold (#f5c961) = nur Signatures
- **Grid Engine:** Slices 1-8 fertig, 42 Tests — bleibt komplett unberührt
- **Rail Active-State:** Kein Glow, kein Background. Nur Teal-Icon + Balken + Hover-Highlight.

---

## Nächste Schritte (in Reihenfolge)

1. **Offene Bugs fixen** (Hero-Size, Tooltip-Position)
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
- Grid Engine (Slices 1-8, 42 Tests) bleibt komplett unberührt
- Branch: `claude/seengrid-visual-phase-2-5ZC5a`
- Instrument Serif hat auf Google Fonts nur weight 400 (kein 500/Medium)
- **Rail Glow ist bewusst verworfen** — nicht erneut versuchen. Entscheidung dokumentiert, pro-Referenzen bestätigen: Sidebars brauchen keinen Glow.
- **RichTooltip .trigger** hat kein `justify-content: center` mehr — das war die Ursache der zu engen Klickfläche. Nicht wieder hinzufügen.
