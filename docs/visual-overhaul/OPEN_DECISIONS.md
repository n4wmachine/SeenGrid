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

### 1. Classics-Verortung (Grid Creator Picker vs. Prompt Hub)

**Kontext:** In einer früheren Session (vor der Produkt-Strategie-Session 2026-04-18) wurde laut Jonas entschieden:
- Classics = erprobte Fertig-Prompts für bestimmte Cases (z.B. Character Sheets, Szenen-Bauplanerstellung)
- Classics bekommen **keinen Gold-/Premium-Marker** (NUANCEN-konform: neutral)
- Classics werden eventuell aus dem Grid Creator Picker in den Prompt Hub verschoben

Diese frühere Entscheidung ist **nicht in den aktuellen Handoff-Dokumenten** dokumentiert. Jonas konnte sich in der Strategie-Session nicht 100% erinnern.

**Offen:**
- Bleiben Classics als Sektion im Grid Creator Picker?
- Oder wandern sie in den Prompt Hub?
- Oder gibt's beide Zugriffswege?

**Abhängig von:** Picker-Phase (Bau) + Prompt-Hub-Phase (späterer Bau)

**Wann entscheiden:** Vor oder zu Beginn der Picker-Phase. Jonas prüft alte Session-Logs/Chats zur früheren Entscheidung. Falls nicht rekonstruierbar, wird neu entschieden.

**Status:** offen

---

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

### 3. CONTINUE-Band Kapazität / Überlauf-Verhalten

**Kontext:** Wenn ein User 30+ Projekte hat — wie verhält sich das CONTINUE-Band?

**Mögliche Lösungen:**
- Horizontales Scrollen bis N Projekte, dann "Show all" → LIB-Tab mit Projects-View
- Feste Anzahl (z.B. 5-8 zuletzt bearbeitet) + Link zu "alle Projekte"
- Pagination

**Abhängig von:** Picker-Phase (weil Picker-Phase sich mit Landing-Detail beschäftigt) oder separater Landing-Polish

**Wann entscheiden:** Picker-Phase

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

## Entschiedene Punkte

*(Bisher keine. Hier werden entschiedene Punkte aus dieser Liste dokumentiert, nachdem sie geklärt sind — mit Datum, Entscheidung, Link zur Quelle.)*

---

## Regel für neue Einträge

Wenn in einem Chat eine Entscheidung auftaucht die **nicht jetzt getroffen werden kann oder soll**:

1. Sofort hier eintragen (nicht in andere Dokumente als "später")
2. Format strikt befolgen (Titel / Kontext / Abhängig von / Wann entscheiden / Status)
3. Im Ziel-Dokument nur kurz vermerken: "siehe OPEN_DECISIONS #N"

So bleibt die Liste die **einzige Quelle der Wahrheit** für offene Punkte.

---

**Ende OPEN_DECISIONS.**
