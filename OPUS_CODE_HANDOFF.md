# SEENGRID — Handoff für Opus Code Chat

## Was ist SeenGrid?
Modulares Operator-Tool für AI-Film-Workflows. 4 Tabs: Prompt Builder, Grid Operator, MJ Startframe, Prompt Vault.
- Vite + React, CSS Modules, keine UI-Library
- Fonts: Space Grotesk (body) + JetBrains Mono (code/labels), via @fontsource
- Repo: github.com/n4wmachine/SeenGrid — deployed auf GitHub Pages (gh-pages Branch)
- Lokaler Ordner: C:\Users\n4w\SeenGrid

## Aktueller Git-Stand
- `main` Branch, letzter guter Basis-Commit war `10bc901` (tab nav fix)
- Danach wurde "Paket 2" (JSX-Umbau) committed — 6 Dateien ersetzt
- Deploy läuft über `gh-pages` Branch, Settings sind korrekt (gh-pages / root)
- GPG Signing muss immer bypassed werden: `git -c commit.gpgsign=false commit -m "message"`

## Was aktuell funktioniert
- Header: Logo korrekt (72px), Teal-Akzent, Space Grotesk in Tab-Navigation
- Farbsystem: Neutrale Grautöne (#0a0a0a root, #111 app, #141414 surface-0, #181818 surface-1), Teal #2bb5b2 Akzent
- CSS-Variablen heißen noch `--sg-gold-*` aber Werte sind Teal
- PromptBuilder: Collapsible NanoBanana-Regeln (ℹ-Button) FUNKTIONIERT
- Fonts installiert: @fontsource/space-grotesk + @fontsource/jetbrains-mono

## Was BROKEN ist

### MJStartframe — Sub-Tabs rendern nicht (KRITISCH)
- Code ist in der Datei: `subTabNav`, `activeSubTab`, `SUB_TABS` Array — alles vorhanden
- CSS ist vorhanden: `.subTabNav` Klasse existiert in MJStartframe.module.css
- Sonnet bestätigt: State, Buttons, Conditional Rendering — alles korrekt verdrahtet
- ABER: Die Tabs erscheinen nicht. Kein Console-Error, kein sichtbarer Crash.
- Keyboard-Shortcut `Ctrl+Shift+R` wurde auf `Ctrl+Shift+G` geändert (kollidierte mit Browser Hard-Refresh)
- Vor dem Shortcut-Fix erschienen die Tabs sporadisch bei Hard-Refresh-Spam — das lag daran dass Ctrl+Shift+R den Random-Generator triggerte statt den Browser-Refresh
- Random-Generator wird nicht mehr getriggert (Fix bestätigt), aber Tabs kommen auch nicht mehr
- DIAGNOSE NÖTIG: Warum rendert die Komponente ohne die Sub-Tabs? Lazy-Import in App.jsx ist korrekt.

### GridOperator — Struktur-Problem
- Presets sind jetzt nach Grid-Größe gruppiert (3×3, 2×2 etc.) mit Sub-Headern — IST DRIN
- ABER: Bringt nicht viel Übersichtlichkeit, besser nach Art/Funktion gruppieren
- Hauptproblem: Layout, Style Override, Panel Roles sind UNTER der langen Preset-Liste → User muss ewig scrollen
- Fix: Controls (Layout, Style Override, Panel Roles) nach OBEN ziehen, Preset-Liste als Collapsible oder ans Ende

### PromptVault — Broken Layout
- Cards-Grid collapsed, Bilder sprengen Layout
- "Mehr/Weniger" geht im Text unter
- Sonnet hatte einen Fix auf Feature-Branch `d94269f` — wurde NICHT gemergt
- Vault wurde bewusst nicht in Paket 2 angefasst, Fix steht noch aus

### Generelles Design — sieht nicht professionell aus
- Paket 2 war nur struktureller JSX-Umbau (Collapsibles, Sub-Tabs, Gruppierung)
- Visuell hat sich quasi nichts geändert — gleiches CSS, gleiche Abstände, gleiche Chip-Optik
- Es fehlt ein echter visueller Design-Pass: Spacing, Hierarchie, Kontraste, Tiefe

## Paket 2 — was enthalten war (6 Dateien)

### PromptBuilder.jsx + .module.css
- NanoBanana Regeln: Collapsible mit ℹ-Button, default geschlossen ✅ FUNKTIONIERT
- Selection Tags: Wenn Section geschlossen aber Auswahl vorhanden → Werte als Tags im Header
- Count Badge: Nur sichtbar wenn Section offen
- Ghost Button: `sg-btn-ghost` durch CSS-Module `ghostBtn` ersetzt
- Keyboard Shortcuts: Cmd+Shift+G = Random, Cmd+Shift+C = Copy
- Chip Hover: scale(1.02), Chip Active: chipPulse Animation
- Font Cleanup: Chips/Buttons = font-body, nur Output/Labels = mono

### GridOperator.jsx + .module.css
- Presets nach Grid-Größe gruppiert mit Sub-Headern
- Alle globale `chip` Klassen → `styles.chip` (CSS Modules)
- Inline Styles eliminiert → eigene CSS-Klassen
- Keyboard Shortcuts: Cmd+Shift+C = Copy

### MJStartframe.jsx + .module.css
- Sub-Tabs: "Felder" | "Templates & Medium" | "Filmstock & Parameter" ← BROKEN, rendert nicht
- Felder-Tab: 5-Element-Architektur (compact), Template Fields, Emotional Hooks (collapsible)
- Templates-Tab: Shot-Templates + Modifier + Genre Chips
- Params-Tab: Filmstock + Aspect Ratio + --raw Toggle
- Ghost Preview: Output-Box zeigt Template mit Placeholders in disabled-Farbe
- Besserer Random: Alle 5 Felder + AR + --raw zufällig
- CSS Module Chips durchgängig

### Header.css
- .tabNavItem: font-family var(--sg-font-body), font-size 13px, text-transform none ✅ FUNKTIONIERT

## Tech-Kontext
- Jonas ist kein Webdev — klare Anweisungen, keine abstrakten Konzepte
- Bisherige Erfahrung: Textanweisungen → FAIL. Komplette Dateien zum 1:1 Copy-Paste → FUNKTIONIERT.
- Zwei-LLM-Setup (Opus creative + Sonnet code) hat NICHT funktioniert — zu viel Kontext-Verlust, Stille-Post-Fehler
- Deshalb jetzt: Opus direkt im Code Chat

## Fixes die zwischenzeitlich funktionierten, jetzt wieder broken

### Random-Generator (Prompt Builder)
- WAR GEFIXT: Hatte 3 Optionen — Text / Look / Both (nur Text randomisieren, nur visuelle Parameter, oder beides)
- JETZT: Wieder der alte einzelne Zufall-Button ohne Optionen

### Random-Generator (MJ Startframe)
- WAR NIE RICHTIG GEFIXT: Hatte nur einen "Zufall"-Button der nicht alle Felder sinnvoll befüllt hat
- SOLL: Analog zum Prompt Builder einen funktionierenden Random implementieren der alle 5 Felder mit sinnvollen Zufallswerten befüllt (Paket 2 Code hat das drin, rendert aber nicht weil MJ-Tabs broken)

### Chip-Hover und Active-Animationen
- WAR GEFIXT: Chip-Hover scale(1.02), Active-Pulse-Animation
- JETZT: Unklar ob es greift — CSS ist in den Dateien, aber visuell schwer zu prüfen solange andere Dinge broken sind

### Selection-Tags in geschlossenen Sections (Prompt Builder)
- WAR GEFIXT: Wenn Section geschlossen aber Auswahl vorhanden → Werte als kleine Tags im Header sichtbar
- JETZT: Code ist drin, visuell unbestätigt

### Output-Box Teal-Glow
- WAR GEFIXT: Subtiler Teal-Glow wenn Prompt vorhanden
- JETZT: CSS ist drin, visuell unbestätigt

## Sofort-Prioritäten (in dieser Reihenfolge)
1. MJStartframe Sub-Tabs fixen — warum rendert es nicht?
2. Random-Generator Prompt Builder: Text / Look / Both Optionen wiederherstellen
3. Random-Generator MJ Startframe: Alle 5 Felder sinnvoll befüllen
4. GridOperator Layout fixen — Controls nach oben, Presets als Collapsible
5. PromptVault Card-Layout fixen (Feature-Branch d94269f mergen oder neu machen)
6. Visueller Design-Pass über alle Tabs — aktuell sieht nichts professionell aus

## Design-Referenzen
- Neutrale Grautöne, KEIN Farbstich
- Akzentfarbe: Teal #2bb5b2
- Header: 96px Höhe, Logo 72px
- Zwei-Spalten-Layout: left scrollbar, right sticky, height: calc(100vh - 96px)
- Font-Regel: JetBrains Mono NUR für generierter Prompt-Output, Zeichenzähler, Section-Labels, Badges. Space Grotesk für ALLES ANDERE.
