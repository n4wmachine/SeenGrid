# SeenGrid — Open Decisions

**Zweck:** Eine zentrale Liste ALLER offenen Produkt-/Design-Entscheidungen. Verhindert verstreute "für später"-Vermerke über viele Dokumente.

**Regel:** Jeder neue Planungs-Chat liest **diese Datei** zuerst. Neue Offen-Punkte werden hier eingetragen, nicht in Handoff-Dokumenten vergraben. Entschiedene Punkte werden mit Entscheidung + Datum + Link zur Quelle aktualisiert.

**Pflicht-Lektüre für:** Alle Planungs-Chats, Brand-Chats, Code-Chats die Architektur-Entscheidungen treffen.

---

## Format jedes Eintrags

- **Titel** (was ist zu entscheiden)
- **Kontext** (warum ist es offen)
- **Abhängig von** (welche Phase / welches Feature)
- **Wann entscheiden** (welche Phase oder Trigger)
- **Status** (offen / entschieden / verworfen)

---

## Offene Entscheidungen

### 2. Hero-Verhalten auf Landing (dauerhaft vs. Splash-Pre-Page)

**Kontext:** Aktuell ist der Hero (Logo + Wordmark + Tagline) dauerhaft auf der Landing präsent — NUANCEN-11-konform (bewusst starke Brand-Präsenz). Das kostet Rückkehrer jeden Tag vertikalen Platz vor Continue/Quick Start.

**Zwei legitime Varianten:**
- **Variante A (aktuell):** Hero dauerhaft auf Landing. Brand-Präsenz konstant, keine State-Logik, aber Rückkehrer scrollen täglich daran vorbei.
- **Variante B:** Splash-Pre-Page einmal pro Session. Brand-Moment für Erstbesucher/Rückkehrer einmal, danach direkt dichte Pro-Tool-Home. Braucht State-Tracking (schon gesehen / noch nicht).

Beide sind professionell, beide brand-konform. Keine von beiden beeinflusst die Produkt-Strategie (CONTINUE-Logik funktioniert bei beiden identisch).

**Abhängig von:** Nichts Blockierendes — reine Landing-Polierung

**Wann entscheiden:** Nach Picker-Phase, in einer kurzen Landing-Review-Session oder integriert in Workspace-Phase

**Status:** offen

---

### 4. Projekt-Overview-Layout

**Kontext:** Wenn ein User auf "Tokio-Kurzfilm" klickt — was sieht er?

**Mögliche Varianten:**
- Separate Projekt-Seite (eigene Page in der Rail-Logik)
- Overlay/Panel über bestehender Page
- Automatischer Wiedereinstieg in den zuletzt bearbeiteten Zustand (z.B. Grid Creator mit letztem Preset geladen), kein dedizierter Projekt-Overview
- Hybrid

**Abhängig von:** Welche Projekt-eigenen Inhalte wann gebaut werden (Szenenplan, Shot Board, Notizen). Aktuell hat ein Projekt nur Library-Referenzen — da ist ein vollständiger Overview eventuell overkill. Sobald Szenenplan + Board existieren, braucht das Projekt einen echten Zuhause-Bildschirm.

**Wann entscheiden:** Wenn Filmsystem-Phase oder Shot-Board-Phase ansteht. Vorher ist die Entscheidung verfrüht (würde spekulieren über noch nicht existierende Features).

**Status:** offen

---

### 5. LIB-Tab Aufbau und Funktionsumfang

**Kontext:** PRODUCT_STRATEGY_V1 §4.2 definiert LIB als Management-Ort für alle Library-Assets (Signatures, Grid-Presets, Filmlooks, später Prompts/Szenen-Tokens). Der Tab-Slot existiert bereits als Artefakt in der Rail, hat aber keine Funktion.

**Offen:**
- Genauer Aufbau (eine Liste mit Tabs / separate Sub-Pages / einheitliche Table-View)
- Welche Aktionen konkret in v1 (nur Löschen/Umbenennen? Oder auch Tagging, Bulk-Aktionen?)
- Wann wird LIB gebaut? (Nach Picker? Nach Workspace? Mit Token-Store Stufe 1?)

**Abhängig von:** Menge an Library-Assets die beim Build-Zeitpunkt existieren. Solange User nur 3-5 Signatures und 0 Presets haben, ist LIB niedrig-priorisiert.

**Wann entscheiden:** Eigene Phase oder integriert in Token-Store Stufe 1 / 2

**Status:** offen

---

### 6. Tags für Library-Assets (Ja/Nein + wenn ja, Details)

**Kontext:** PRODUCT_STRATEGY_V1 erwähnt Tags als mögliche spätere Feature für Filterbarkeit in LIB. Nicht jetzt, aber auf dem Radar.

**Abhängig von:** Echte Nutzung — erst wenn User-Feedback zeigt dass Ordnung gebraucht wird

**Wann entscheiden:** Nach erstem realem Nutzer-Test, nicht vorher

**Status:** offen / niedrig priorisiert

---

### 7. Projekt-Wechsel-UI (wie wechselt der User aktiv zwischen Projekten)

**Kontext:** PRODUCT_STRATEGY_V1 §3.3 sagt: Arbeit ist projekt-agnostisch, Wechsel ist harmlos. Aber wie **vollzieht** der User den Wechsel konkret?

**Mögliche Orte:**
- Dropdown im Header
- Klick auf Projekt-Label → Projekt-Switcher öffnet sich
- Nur über Landing CONTINUE-Band
- Keyboard-Shortcut

**Abhängig von:** Workspace-Phase (Header-Gestaltung + Projekt-Kontext-Anzeige)

**Wann entscheiden:** Workspace-Phase

**Status:** offen

---

### 8. Hub-Prompt-Customization + Auto-Einpflege-Pipeline (überholungsbedürftig)

**Kontext:** In `docs/archive/VISUAL_OVERHAUL_PLAN.md` ist ein altes Konzept dokumentiert:
- Slot-System mit drei Slot-Typen (Text-Slot / Bild-Hinweis / Text+Bild)
- Drei Beispiel-Slots: `[CHARACTER]`, `[SETTING]`, `[STYLE]`
- Auto-Pipeline: Claude analysiert hochgeladene Prompts, erkennt austauschbare Stellen, setzt Slot-Klammern, weist Kategorie+Tags zu, erkennt Bild-Referenz-Hinweise. Jonas reviewed nur.

Das Konzept stammt aus der Pre-JSON-Output-Ära und ist überholt:
- Drei Slot-Typen reichen definitiv nicht
- Multi-Panel-Sheets brauchen Per-Panel-Inputs (vgl. `panel_fields` aus `MODULE_AND_CASE_CATALOG.md` für Custom-Builder-Cases) — das fehlt im alten Slot-System komplett
- Classics (vom Picker in den Hub gewandert, siehe #1) sind genau solche Multi-Panel-Sheets — ohne Per-Panel-Inputs nicht sinnvoll bedienbar

**Offen — neu zu konzipieren:**
- Welcher Customization-Mechanismus für Hub-Prompts insgesamt (Trendy, Classics, Community)?
- Erweiterung des Slot-Systems oder Übernahme des `panel_fields`-Mechanismus aus der Engine oder Hybrid?
- Wie funktioniert die Auto-Einpflege-Pipeline für die ~1500 Community-Prompts? Welche Erkennungs-Regeln, welcher Output, welcher Review-Flow?
- Was passiert mit Prompts wo Per-Panel-Inputs keinen Sinn machen (Single-Image-Prompts)? Pipeline muss differenzieren.

**ToDo:**
- Eigene Hub-Architektur-Session: konsolidierter Customization-Mechanismus + Pipeline-Spec für die ~1500 Prompts
- Davor: Hub-Phase darf nicht mit dem alten 3-Slot-System gebaut werden

**Abhängig von:** Hub-Phase (noch nicht geplant)

**Wann entscheiden:** Vor Hub-Bau. Eigene Konzept-Session nötig.

**Status:** offen — überholungsbedürftig

---

## Entschiedene Punkte

### 1. Classics-Verortung (Grid Creator Picker vs. Prompt Hub) — ENTSCHIEDEN

**Entscheidung (2026-04-18, Picker-Planungs-Session):**
Classics wandern komplett in den **Prompt Hub** als **separate, klar erkennbare Sektion** (nicht vermischt mit Trendy/Community-Prompts). Classics werden **nicht im Grid Creator Picker** angezeigt.

**Begründung:** Jonas' ursprüngliche Intuition (aus einer früheren Session erinnert, jetzt bestätigt): Classics sind erprobte erweiterte Alternativ-Sheets für bestimmte Use-Cases (z.B. andere Character Sheets, technische Bauplan-Erstellung von Szenen). Sie sind keine Premium-/Magic-Prompts (deshalb auch kein Gold, NUANCEN-konform). Im Picker würden sie den Fokus auf Custom Builder + eigene Presets verwässern. Im Hub stehen sie als kuratierte Alternativen neben Community und Trendy.

**Folge für den Picker:**
- CLASSICS-Sektion aus dem Picker gestrichen
- Picker hat nur noch drei Sektionen: YOUR PRESETS / CORE TEMPLATES / START FROM SCRATCH
- Im Picker unter CORE TEMPLATES ein Mini-Hinweis "more templates in Prompt Hub →" (Wortlaut TBD)

**Folge für den Hub (spätere Phase):**
- Classics erhalten eigene Sektion, visuell von Community/Trendy getrennt
- Customization-Mechanismus für Hub-Prompts ist offen (siehe #8)

**Quelle:** `docs/visual-overhaul/PICKER_SPEC_V1.md` §4, §12

---

### 3. CONTINUE-Band Kapazität / Überlauf-Verhalten — ENTSCHIEDEN

**Entscheidung (2026-04-18, Picker-Planungs-Session):**
**Variante A** — Single-Row mit horizontalem Scroll.

- Eine Reihe, immer
- `[+ neu]`-Slot ganz vorne (links)
- Projekte daneben, **zuletzt bearbeitet zuerst** (links nach rechts absteigend nach Modified-Timestamp)
- Bei Überlauf: horizontal scrollen/swipen
- Keine Abhängigkeit zu LIB-Tab — funktioniert sofort
- Wenn LIB später gebaut wird: "show all"-Link rechts optional nachrüstbar

**Begründung:** CONTINUE-Band = Wiedereinstieg-Schnellzugriff, kein Archiv. Konstante Höhe (kein Layout-Wachstum wenn Projekte zunehmen). Keine Dependency auf noch-nicht-existierende LIB-Page.

**Folge für die Landing-Page (Code-Umsetzung):**
- Container-CSS wechselt von `grid auto-fit` zu `flex-row nowrap` + Horizontal-Scroll
- Scrollbar-Styling gemäß `globals.css`-Pattern (custom, nicht Browser-Default)

**Quelle:** `docs/visual-overhaul/PICKER_SPEC_V1.md` §9

---

## Regel für neue Einträge

Wenn in einem Chat eine Entscheidung auftaucht die **nicht jetzt getroffen werden kann oder soll**:

1. Sofort hier eintragen (nicht in andere Dokumente als "später")
2. Format strikt befolgen (Titel / Kontext / Abhängig von / Wann entscheiden / Status)
3. Im Ziel-Dokument nur kurz vermerken: "siehe OPEN_DECISIONS #N"

So bleibt die Liste die **einzige Quelle der Wahrheit** für offene Punkte.

---

**Ende OPEN_DECISIONS.**
