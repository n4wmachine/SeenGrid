# VISUAL OVERHAUL PLAN — SeenGrid

Ergebnis der Brainstorming-Session vom 2026-04-16.
Ersetzt die alte `design-spec/DESIGN_SPEC.md` (wird gelöscht, Farbregeln waren falsch).

---

## Grundprinzip

SeenGrid soll sich anfühlen wie ein **professionelles Produktionswerkzeug** — DaVinci Resolve, Rive, Frame.io. Kein Formular, keine Webseite, kein Consumer-App-Feeling.

**Referenzen:**
- DaVinci Resolve — Color Page, Nodes als Interface
- Rive — Canvas-zentriert, Properties-Inspector, einblendbare Panels
- Frame.io — Thumbnails dominant, Text sekundär
- Milanote — visuelles Board, Kacheln statt Listen

---

## Farbsystem (VERBINDLICH)

- **Teal (#2bb5b2)** = Markenfarbe + primärer UI-Akzent. Aktive Chips, aktive Tabs, Focus-States, Primary Buttons, Glows, Output-Borders. Überall.
- **Gold** = NUR für Signature-Mode-Elemente. Sterne, Signature-Badges, Signature-Section-Borders. Sonst nirgendwo.
- **Kein Weiß (#fff)** — Text-Primary ist #e8e8f0
- **Kein Lila, kein Blau** als Akzent
- Surfaces: blue-tinted dark palette (#050508 → #1f1f32)

---

## Layout-Architektur

### Shell zuerst
Ein festes Layout-Raster das für ALLE Tabs/Tools gilt:
- Header (56px, steht)
- Content-Area
- Optionale Sidebar/Inspector-Panels

Die äußere Hülle ändert sich nie, nur der Inhalt darin. Neue Tools docken sich in dieselbe Shell ein.

### Wiederverwendbares Kachel/Panel-System
Grid-Zellen, Preview-Panels, Output-Boxen — alles aus denselben Bausteinen. Neues Tool = neue Kombination bestehender Kacheln, kein neues Design.

### Progressive Density
Clean und aufgeräumt by default. Power-User blenden Panels ein, klappen Sections auf, zeigen Details an. Die Oberfläche skaliert mit dem User.

### Nichts ist immer sichtbar
Alles erscheint kontextabhängig und verschwindet wenn nicht gebraucht.

---

## Grid Creator — Canvas-Pattern (Herzstück)

### Kern-Idee
**Das Grid selbst IST die UI.** Kein Zwei-Spalten-Formular (Controls links, Preview rechts). Stattdessen: Grid als zentrale Arbeitsfläche, groß und dominant. Alles andere gruppiert sich kontextabhängig darum.

### Interaktion
- **Klick auf Grid-Zelle** → Inspector-Panel fährt rechts raus (wie Figma). Zeigt kontextabhängig: Rolle, Winkel, Face Reference Status. Nur was dieses Panel betrifft.
- **Klick auf Grid-Hintergrund** (nichts selektiert) → globale Settings: Case-Wahl, Grid-Größe, Environment-Mode, Forbidden Elements.
- **Module als Toolbar** (oben oder links): Kleine Icons/Toggles — Face Reference on/off, Style Overlay on/off, Environment-Mode. Ein Klick toggled, Hover zeigt Details. Aufklappbar für Custom-Text-Eingabe.
- **Saved Looks als Palette-Drawer**: Von unten oder von der Seite reinziehbar. Grid mit Thumbnails/Labels der gespeicherten Tokens. Klick → wird aufs Grid angewendet. Zu, wenn nicht gebraucht.

### Core = Einstiegspunkt, kein Modus
Grid Creator öffnen → kleine Galerie von Core-Templates als Kacheln ("Character Angle Study 4er", "Character Normalizer", etc.). Klick → Grid füllt sich vor, alles sofort editierbar. Wer eilig ist kopiert sofort. Wer anpassen will klickt Zellen und ändert.

"Leeres Grid" als Option für User die bei Null anfangen wollen.

**Kein Toggle Custom/Core.** Gleiche UI, gleiche Engine, nur unterschiedliche Startbedingungen. Core-Templates sind vorgefüllte States.

### Signature im Grid Creator
Jonas' validierte Klassiker mit Gold-Badge. Im Grid Creator als eigene Sektion. Fertig zum Kopieren, nicht editierbar. Laufen nicht über die Engine.

---

## Prompt Hub (ex Prompt Vault + Trendy — zusammengelegt)

### Kern-Idee
Ein zentraler Hub für alle externen Prompts. Kein separates Vault und Trendy — der Unterschied war zu dünn. Alles rein, intern geordnet.

### Name
Noch offen. Kandidaten: SeenHub, Prompt Hub, Prompt Pool, Grid Feed, o.ä. Wortspiel mit SeenGrid gewünscht.

### Struktur
- **Kategorie-Chips** oben (Character, World, Style, Social Media, Lego, Age Lapse, etc.)
- **Tags** für Plattform (NanoBanana, Midjourney, GPT, etc.)
- **Karten-Grid** — jede Karte hat ein Vorschaubild (PFLICHT, keine Textwüste)

### Slot-System (Customization)
Prompts haben Platzhalter in eckigen Klammern: `[CHARACTER]`, `[SETTING]`, `[STYLE]`.

Drei Slot-Typen:
1. **Text-Slot** — austauschbarer Text, User tippt eigenen Inhalt ein
2. **Bild-Hinweis** — Info-Text der beschreibt welches Referenzbild der User in seinem KI-Tool mitgeben muss (z.B. "Braucht: Ganzkörper-Foto deines Charakters"). Kein Upload — SeenGrid ist die Schicht vor der Generierung.
3. **Text+Bild** — beides kombiniert

### Karten-UI
- Vorschaubild dominant (PFLICHT für jeden Prompt)
- Icon auf der Karte: Stift = anpassbar (hat Slots), Kamera = braucht Referenzbild, ohne = reines Copy-Paste
- "Anpassen"-Button → Textfelder für Slots aufklappen
- "Kopieren"-Button → fertigen Prompt in Zwischenablage

### Einpflege / Kategorisierung
Die bestehenden ~1500 Prompts werden von Claude automatisch verarbeitet:
- Prompt-Text lesen, austauschbare Stellen erkennen, Slot-Klammern setzen
- Kategorie und Tags zuweisen
- Bild-Referenz-Hinweise erkennen und markieren
- Angereicherte JSONs zurückschreiben

Jonas reviewed danach nur ob die Zuordnungen stimmen. Review statt Handarbeit.

**Offener Punkt:** Viele Prompts haben noch kein Vorschaubild. Claude kann eine Liste erstellen welche fehlen — die Bilder selbst muss Jonas generieren.

---

## Bestehendes (bleibt, wird integriert)

- **Prompt Builder** (Tab 1) — chip-basiert, funktionsfähig. Bekommt neues Layout aber gleiche Funktionalität.
- **MJ Cinematic Builder** (Tab 3) — funktionsfähig. Bekommt neues Layout.
- **Look Lab** — Style-Playground. Feeds in Grid Creator via Token-Speicher.

---

## Was die alte Design-Spec falsch hatte

1. **Farbregeln waren invertiert** — Gold als primärer UI-Akzent, Teal nur für Logo. Das Gegenteil ist richtig.
2. **Nur ein Recolor** — kein Layout-Umbau, keine neue Informationsarchitektur, kein Canvas-Pattern.
3. **Formular-Pattern beibehalten** — Zwei-Spalten mit Controls links + Preview rechts statt Canvas-zentriertes Design.
