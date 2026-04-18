# SeenGrid — Product Strategy V1

**Datum:** 2026-04-18
**Status:** Verbindlich. Ergebnis der Produkt-Strategie-Session.
**Gilt für:** Alle nachfolgenden Phasen (Picker, Workspace, Token-Store, SeenLab-Update, Filmsystem, Board).
**Vorgänger:** Brand-Session (abgeschlossen, dokumentiert in PHASE1_STATUS.md)
**Nachfolger:** Picker-Phase (HANDOFF_STRATEGY_TO_PICKER.md)

---

## 0. Positionierung SeenGrid (Nordstern)

**SeenGrid ist ein umfassender Pre-Production Workspace für cinematische AI-Generation.**

Das Tool betreut den User durch so viele oder so wenige Phasen der Pre-Production wie er will — Concept, Look-Development, Shotplanning, Frame-Generation, Board-Organisation, Consistency. Alle Module greifen zusammen, sind einzeln nutzbar, und kommen zusammen wenn der User das braucht.

**Zielgruppe:** Filmemacher UND Casuals die cinematische Bilder für Social Media etc. wollen. Das System darf niemanden ausschließen.

Am Ende der User-Journey: User wirft fertige Prompts in die Generatoren (NanoBanana, MJ, Kling) und editiert das Footage extern (CapCut etc.). Alles dazwischen ist SeenGrid.

**Dieser Nordstern ist nicht verhandelbar.** Alle späteren Produkt-Entscheidungen werden daran ausgerichtet.

---

## 1. Datenmodell

Das Datenmodell hat drei konzeptuelle Ebenen: **Global Library** (wiederverwendbare Assets für NanoBanana/Grid-Workflows), **SeenFrame-Library** (isolierte MJ-Filmlooks), und **Projekte** (optionale narrative Container).

### 1.1 Global Library (NanoBanana/Grid-kompatibel)

**Signatures**
- Gebaut im **LookLab** durch Chip-Kombination (oder per Random Generator "Überrasch mich")
- Save-Action: "Save as Signature" → global in der Library
- Global sichtbar und nutzbar, nie projekt-exklusiv
- Editierbar im LookLab — Änderungen wirken automatisch überall (Live-Link per ID-Referenz, keine Snapshots)
- Variante erstellen = "Duplicate" im LookLab → neue eigenständige Signature
- Im Grid-Workflow werden Signatures über das Modul `style_overlay` in den **Prompt-Output** eingehängt (nicht ins Grid-UI selbst)
- Auch im LookLab-eigenen Prompt-Workflow anhängbar

**Grid-Presets** (neue Entity)
- Gebaut im **Grid Creator** nach Grid-Konfiguration
- Save-Action: "Save as Preset" → Popup mit Flexi-Payload-Auswahl (siehe 2.2)
- Global in Library, wiederverwendbar über alle Projekte hinweg
- Signature-Verknüpfung per Live-Link-ID, kein Snapshot
- Edge-Case: verlinkte Signature gelöscht → Preset zeigt "Signature unavailable", User kann neu zuweisen; Preset stirbt nicht

### 1.2 SeenFrame-Library (isoliert, MJ-kompatibel)

SeenFrame ist der ehemalige "Midjourney Cinematic Tab" (umbenannt zu SeenFrame). Dort erstellt der User hochwertige MJ-optimierte Prompts für cinematische Filmstills. **Keine Grid-Erstellung möglich** — eigenständiges Feature.

**Filmlooks**
- Gebaut im SeenFrame durch MJ-spezifische Prompt-Bausteine
- Save-Mechanik analog zu Signatures (konsistente User-Workflow-Sprache)
- Leben in isolierter SeenFrame-Library — Namespace getrennt
- Nur SeenFrame konsumiert Filmlooks — **keine Cross-Tool-Übertragung**
- Begründung: MJ-Syntax (`--style raw`, `--sref`, etc.) ist fundamental anders als NanoBanana-Prompts; Auto-Übersetzung wäre entweder qualitativ kaputt oder infrastrukturell aufwändig → klare Grenzziehung (NUANCEN Punkt 9)

### 1.3 Projekte (narrative Container, optional)

**Projekte sind Container für einen konkreten Film/Serien-Case. Sie sind optional, nie Zwang.**

**Was ein Projekt enthält:**
- **Referenzen** auf Library-Assets (Signatures, Grid-Presets, Filmlooks) — als Zugehörigkeits-Marker, ohne Besitzanspruch
- **Eigene Inhalte (perspektivisch, additiv in späteren Phasen):**
  - Szenenplan (aus 2-Stufen-LLM-Filmsystem, FEATURE_VISION §1)
  - Shot Dashboard / Visual Production Board (FEATURE_VISION §5)
  - Generierte Frames
  - Consistency Kit Output (FEATURE_VISION §3)
  - Notizen / Metadaten

**Minimale Projekt-Struktur zum Start:**
- Name
- Thumbnail (auto-generiert aus erstem zugeordnetem Asset, oder später upload-bar)
- Created / Last-Modified (automatisch)

Mehr wird nicht aufgenommen. Description, Tags, Projekt-Typ etc. kommen **additiv** wenn der Bedarf aus echter Nutzung entsteht. Kleinstmögliche Start-Struktur reduziert Friction.

### 1.4 Beziehungen — Übersicht

```
GLOBAL LIBRARY (NanoBanana-kompatibel):
├── Signatures    (LookLab-Output)
└── Grid-Presets  (Grid Creator-Output)

SEENFRAME-LIBRARY (isoliert, MJ-kompatibel):
└── Filmlooks     (SeenFrame-Output)

PROJEKTE (optional):
├── Referenzieren: Signatures + Grid-Presets + Filmlooks (Zugehörigkeits-Marker, keine Übersetzung zwischen Tools)
├── Enthalten später: Szenenplan, Shot Board, Frames, Notizen
└── Besitzen keine Library-Assets — reine Live-Link-Referenz

Live-Link-Prinzip (durchgängig):
· Grid-Preset → Signature: ID-Referenz, immer aktuelle Version
· Projekt → Library-Assets: ID-Referenz, immer aktuelle Version
· Änderung an Signature wirkt überall automatisch
```

**Cross-Library-Regel:** Ein Projekt kann sowohl Signatures als auch Filmlooks als "zum Film gehörend" markieren. Aber **kein Tool übersetzt** zwischen den Namespaces. Projekt-Verknüpfung ist organisatorisch, nicht funktional.

---

## 2. Speicher-Mechanik

### 2.1 Signatures speichern (LookLab)

**Save-Popup:**
```
SAVE AS SIGNATURE

Name: [_______________]

Wohin speichern:
( ) Library only         ← default
( ) Zu Projekt:          [Dropdown: bestehende Projekte]
( ) Neues Projekt anlegen: [_______________]

                              [Cancel] [Save]
```

**Variations-Strategie:**
- Signature dauerhaft verbessern → LookLab-Edit, wirkt überall (Live-Link)
- Dauerhafte Zweit-Variante → LookLab Duplicate, neue eigenständige Signature
- Einmaliger Sonderweg → Prompt einmal bauen, nichts speichern
- **Keine Override-Mechanik im Grid** — Signatures werden im LookLab gemanagt, im Grid nur ausgewählt

### 2.2 Grid-Presets speichern (Grid Creator)

**Save-Popup mit Flexi-Payload-Checkboxen:**
```
SAVE AS PRESET

Name: [_______________]

Was soll gespeichert werden:
[✓] Grid-Layout                   ← Pflicht (Case + Grid-Dim + Panel-Orientations)
[ ] Panel Content Fields          ← optional (pro-Panel Inhalte wie action/expression/zone)
[ ] Module-Auswahl                ← optional (welche Module aktiv + deren Payloads)
[ ] Signature-Link:  [Dropdown: aktuelle Signature vorausgewählt]

Wohin speichern:
( ) Library only         ← default
( ) Zu Projekt:          [Dropdown]
( ) Neues Projekt anlegen: [_______________]

                              [Cancel] [Save]
```

**Begründung Panel Content Fields als Checkbox:**
Cases wie `character_angle_study` haben strukturelle Panel-Fields (front/back/profile — wiederverwendbar). Cases wie `story_sequence` oder `world_zone_board` haben **inhaltliche** Panel-Fields (Freitext-Actions, Zonen — nicht automatisch wiederverwendbar). Zusätzlich relevant für text2video-Workflows wo User charakter-/szenenspezifische Beschreibungen wiederverwenden will. Der User entscheidet beim Speichern ob die Inhalte zum Preset gehören oder nicht.

**Use-Case-Beispiele:**
- Casual: alle Haken rein, Standard-Preset speichern, fertig
- Serien-Producer: alle Haken, Preset als vollständige Wiederverwendung (Charakter/Szene + Look)
- Experimentierer: nur Grid-Layout, alles andere frei — jedes Mal frisch drauf bauen
- text2video-User: Panel Fields mitspeichern um szenenspezifische Beschreibungen nicht erneut zu tippen

### 2.3 Filmlooks speichern (SeenFrame)

Analog zu Signatures, aber in isolierter SeenFrame-Library. Gleicher Save-Popup-Aufbau. Keine Cross-Tool-Übertragung.

### 2.4 Save-Default: Library only

**Rote Linie:**
> Library-Use (LookLab-rumspielen, Preset ausprobieren, Signature random-generieren) darf niemals ein Projekt erzwingen.

Projekte sind **Opt-in, nicht Opt-out**. Wenn der User nichts sagt, landet das Asset lose in der Global Library.

---

## 3. Projekte — Erstellen und Verwalten

### 3.1 Projekt-Erstellung (zwei parallele Wege)

**Weg 1 — Explizit:**
- User klickt `[+ New Project]` in der Landing (Plus-Slot im CONTINUE-Band)
- Typisch für: Filmemacher mit klarem Vorhaben

**Weg 2 — Implizit beim Save:**
- User baut lose, wählt beim Save "Neues Projekt anlegen"
- Typisch für: spontan arbeitender User der nachträglich strukturiert

### 3.2 Asset-zu-Projekt-Relationen

**Alles, was geht:**
- Nachträgliche Zuordnung existierender Library-Assets zu Projekten
- Ein Asset kann **mehreren Projekten** gleichzeitig angehören (z.B. "Angle Study + Deakins" in "Tokio" und "Berlin")
- Entfernen aus Projekt löscht nur den Link, nicht das Asset
- Keine Mengenbegrenzung (weder wie viele Assets pro Projekt, noch wie viele Projekte pro Asset)

**Zuordnungs-Wege (beide möglich, symmetrisch):**
- Aus LIB heraus: Asset → "Zu Projekt zuordnen" → Projekt wählen
- Aus Projekt-Overview heraus: "Asset hinzufügen" → aus Library auswählen

**Projekt-Löschung:**
- Referenzierte Library-Assets überleben das Projekt — sie bleiben in der Library
- **Projekt-eigene Inhalte** (Szenenplan, Board, Notizen) sterben mit dem Projekt
- Bestätigungsdialog beim Löschen:
  ```
  Projekt "Tokio-Kurzfilm" löschen?
  · Szenenplan und Board-Inhalte werden gelöscht
  · Signatures, Presets und Filmlooks bleiben in deiner Library
  [Cancel] [Delete]
  ```

### 3.3 Projekt-Wechsel während der Arbeit

**Entscheidung:**
Der User ist immer in einem **expliziten Projekt-Kontext** ODER im **kontextfreien Modus** (= Library only). Projekt-Kontext wird im Header/Shell angezeigt (Details → Workspace-Phase).

Wenn User mitten im Grid-Bauen das Projekt wechselt:
- Der aktuelle ungespeicherte Grid-Zustand **bleibt erhalten** (nicht verworfen, nicht kopiert)
- Das Projekt-Label im Header ändert sich
- Beim nächsten Save-Action ist das neue Projekt als Default-Zuordnung vorausgewählt

**Pragmatisch:** Projekt ist **kein Session-Wrapper**, sondern ein **Zuordnungs-Kontext** beim Speichern. Arbeit an sich ist projekt-agnostisch. Wechsel ist harmlos.

---

## 4. Library-Browsing und -Management

**Zwei getrennte Zugriffswege:**

### 4.1 Creator-In-Place-Pick (Quick-Access zum Anwenden)

Im Grid Creator / LookLab / SeenFrame direkt beim Arbeiten:
- Signatures-Bar im Grid Creator Workspace (52px, siehe v2-Handoff 10.8)
- Dropdown im Inspector für Signature-Auswahl
- Dropdown im Picker für Preset-Laden
- Zuletzt-genutzt / Pinned-Favoriten sichtbar

**Zweck:** Schnelles Anwenden. **Kein Management.**

### 4.2 LIB-Tab (dediziertes Management)

Separate Rail-Page — existiert aktuell als Artefakt-Slot im UI, aber ohne Funktion. **Wird in späterer Phase mit Inhalt gefüllt.**

**Was LIB enthalten wird:**
- Signatures (Liste/Grid, Suche, Filter, Sortierung)
- Grid-Presets (dito)
- Filmlooks (dito, visuell getrennt wegen isolierter Namespace)
- Später: Prompts, Szenen-Tokens, Consistency Kits

**Mögliche Aktionen in LIB:**
- Umbenennen
- Löschen (mit Confirm-Dialog, warnt wenn Asset in Projekten referenziert ist)
- Duplicate
- Tags zuweisen (wenn Tags später eingeführt werden)
- Zu Projekt zuordnen / entfernen
- Bulk-Auswahl für Massenaktionen

**Nicht in LIB möglich:**
- **Neu erstellen** → geht nur im jeweiligen Creator-Tool
- **Inhaltlich editieren** → Klick auf Asset öffnet es im Creator-Tool

**Begründung:** Klare Trennung. Erstellung/Bearbeitung im Creator. Management in LIB. Kein doppelter UI-Code.

---

## 5. Landing-Page-Logik

### 5.1 Aufbau

```
HERO (Logo + Wordmark + Tagline) — dauerhaft oben
↓
CONTINUE    — adaptiv (siehe 5.2)
↓
QUICK START — Einstiegs-Aktionen (Grid Creator, LookLab, SeenFrame, Hub)
↓
DISCOVER    — Trending Signatures (später auch Trending Presets / Hub-Inhalte)
```

### 5.2 CONTINUE-Band (adaptiv)

**User hat Projekte:**
```
CONTINUE
[+ New Project] [Tokio-Kurzfilm · 3h] [Berlin-Doku · 2d] [...]
```
Plus-Slot ist immer dabei.

**User hat keine Projekte:**
```
CONTINUE-Band wird komplett weggelassen.
Scroll geht vom Hero direkt zu QUICK START.
```

**Begründung:**
- Kein Empty-State-Design nötig
- Neue User werden nicht irritiert ("muss ich ein Projekt starten?")
- Rückkehrer sehen Projekte an logischer Stelle
- Landing wächst mit dem User mit

### 5.3 CONTINUE-Inhalt: NUR Projekte

Keine losen Library-Items (keine Signatures/Presets einzeln) im CONTINUE-Band. Continue-Logik = Wiedereinstieg in narrative Arbeit, nicht Asset-Historie. Asset-Historie lebt in der LIB-Page.

### 5.4 QUICK START + DISCOVER

Bleiben wie aktuell spezifiziert. Projektfrei nutzbar. Alle User-Typen kriegen einen Einstieg über Quick Start, unabhängig von Projekt-Nutzung.

---

## 6. Grid Creator Picker — Preset-Präsentation

**Aufbau mit Presets:**
```
YOUR PRESETS      ← User-persönlich, Gold-Akzent, adaptiv (weg wenn leer)
CORE TEMPLATES    ← generisch, neutral
[CLASSICS]        ← offene Frage, siehe OPEN_DECISIONS.md
START FROM SCRATCH
```

**Regeln:**
- YOUR PRESETS steht oben weil aktive User wiederkehrend auf eigene Presets zugreifen
- Gold-Akzent nach NUANCEN Punkt 1 (User-persönliche Qualität)
- Sektion wird komplett weggelassen wenn User keine Presets hat (analog CONTINUE-Band-Logik)
- CORE TEMPLATES bleibt in aktueller Spec-Form (v2-Handoff 10.1)
- CLASSICS-Verortung ungeklärt (siehe OPEN_DECISIONS)

---

## 7. Workspace-Projekt-Kontext

**Entscheidung (minimal, wird in Workspace-Phase ausgebaut):**
- Wenn der User in einem Projekt-Kontext arbeitet, **zeigt der Grid Creator Header den Projekt-Namen** neben dem Case-Namen an
- Wenn kontextfrei: kein Projekt-Label im Header
- Klick auf Projekt-Label → führt zur Projekt-Overview (wenn gebaut, siehe OPEN_DECISIONS)

**Details zur visuellen Darstellung, Positionierung, Projekt-Wechsel-UI** → Workspace-Phase.

---

## 8. Nicht-verhandelbare Eckpfeiler

Diese Punkte werden in keiner nachfolgenden Session neu verhandelt:

1. **NUANCEN 1** — Gold = User-persönliche Qualität (Signatures, Grid-Presets, Filmlooks); Teal = universeller UI-Akzent
2. **NUANCEN 9** — SeenFrame-Library isoliert, keine Cross-Tool-Signatures
3. **NUANCEN 10** — UI-Begriff "Signature" (nicht "Token"); intern `tokenStore` o.ä. erlaubt
4. **Rollout-Stufen (v2-Handoff 8.2):** Stufe 1 jetzt (SeenLab schreibt, Grid Creator liest), Stufe 2 später (Hub), Stufe 3 später (Vision-Features). Grid-Presets kommen in Stufe 2 dazu.
5. **Projekte sind optional** — nie Zwang
6. **Library-Use triggert niemals Projekt-Zwang** (rote Linie aus Session)
7. **Brand-Entscheidungen aus PHASE1_STATUS.md** (Schrift, Farben, Landing-Atmosphäre) bleiben unverändert

---

## 9. Entscheidungs-Chronologie (Session-Protokoll)

Damit spätere Chats nachvollziehen können wie das Modell entstand — in Reihenfolge:

1. ✓ Prompts werden nicht als separates Speicher-Objekt geführt
2. ✓ Keine eigene "Character"-Ebene — Character = Use Case, kein Entity-Typ
3. ✓ Grid-Preset = eine Entity mit Flexi-Payload (nicht mehrere Preset-Typen)
4. ✓ Signature-Verknüpfung = Live-Link per ID, kein Snapshot
5. ✓ Signature-Variation über LookLab Duplicate, keine Override-Mechanik im Grid
6. ✓ Signatures immer global, nie projekt-exklusiv
7. ✓ Grids können lose existieren (Scratch-Work ist legitimer Standard-Pfad)
8. ✓ SeenGrid = umfassender Pre-Production Workspace (Nordstern)
9. ✓ Projekte = Container für Library-Referenzen + später eigene Inhalte
10. ✓ Projekt-Erstellung: explizit + implizit (Option C der Session)
11. ✓ Save-Default: Library only
12. ✓ Projekt-Minimalstruktur: Name + Thumbnail + Timestamps (Option A der Session)
13. ✓ CONTINUE-Band adaptiv: weg wenn leer, mit `[+ New Project]`-Slot wenn Projekte vorhanden
14. ✓ CONTINUE zeigt nur Projekte, keine losen Assets
15. ✓ SeenFrame = ehemaliger MJ Cinematic Tab, Filmlooks speicherbar in isolierter Library
16. ✓ Grid-Preset-Save-Popup: 4 Checkboxen inkl. Panel Content Fields
17. ✓ Projekt-Zuordnung und Content-Auswahl kommen in **einem** Save-Popup zusammen
18. ✓ LIB-Tab = Management-Ort; Creator-Tools = In-Place-Pick zum Anwenden
19. ✓ Asset-zu-Projekt: N:M-Relation, keine Grenzen, nachträglich zuordenbar
20. ✓ Projekt-Löschung: Library-Assets überleben, Projekt-eigene Inhalte sterben
21. ✓ YOUR PRESETS im Picker: obere Sektion, Gold, adaptiv
22. ✓ Projekt-Wechsel: Arbeit ist projekt-agnostisch, Wechsel ist harmlos
23. ✓ Workspace zeigt Projekt-Label im Header (minimal)

---

## 10. Ergebnis-Dokumente dieser Session

- `PRODUCT_STRATEGY_V1.md` (dieses Dokument) — primäre Quelle der Produkt-Entscheidungen
- `HANDOFF_STRATEGY_TO_PICKER.md` — kompakte Übergabe an die Picker-Phase
- `STARTPROMPT_PICKER_PLANNING.md` — Startprompt für den nächsten Planungs-Chat
- `OPEN_DECISIONS.md` — zentrale Liste offener Entscheidungen (konsolidiert, damit keine verstreuten "für später"-Vermerke entstehen)

---

**Ende PRODUCT_STRATEGY_V1.**
