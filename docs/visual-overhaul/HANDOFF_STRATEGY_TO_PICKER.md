# Übergabe: Produkt-Strategie → Picker-Phase

**Datum:** 2026-04-18
**Vorgänger:** Produkt-Strategie-Session (Opus 4.7)
**Nachfolger:** Picker-Planungs-Chat
**Status:** Strategie abgeschlossen, Picker-Phase kann starten

---

## Was die Produkt-Strategie entschieden hat (Kurzfassung)

Drei Ebenen im Datenmodell:

1. **Global Library** — Signatures (LookLab) + Grid-Presets (Grid Creator)
2. **SeenFrame-Library** (isoliert) — Filmlooks
3. **Projekte** (optional, narrative Container) — Referenzen auf Library-Assets + später eigene Inhalte

Library-Assets sind **immer global** und **via Live-Link** verknüpft. Projekte sind **Opt-in** und dürfen nie erzwungen werden. Projekt-Erstellung geht explizit (Plus-Slot) ODER implizit (beim Save).

Detail-Entscheidungen stehen in `PRODUCT_STRATEGY_V1.md` — dieses Dokument ist die **Primärquelle** für alle folgenden Phasen.

---

## Was der Picker konkret braucht

### Zwingend zu klären im Picker-Planer (vor Bau)

**A — Classics-Verortung (OPEN_DECISIONS #1):**

Classics sollen laut Jonas in einer früheren Session eventuell in den Prompt Hub verschoben worden sein. Die frühere Entscheidung ist nicht vollständig dokumentiert. **Picker-Planer muss das als erstes klären** — entweder durch Session-Log-Prüfung mit Jonas oder durch neue Entscheidung.

Je nach Ausgang hat das Picker-Layout eine andere Sektion mehr oder weniger.

**B — CONTINUE-Band-Kapazität (OPEN_DECISIONS #3):**

Wenn Picker sich mit Landing-Details beschäftigt: was passiert wenn User 30+ Projekte hat? Horizontales Scrollen, "Show all", Pagination? Aktuell nicht entschieden.

### Direkt aus der Strategie übernehmbar (nicht neu verhandeln)

**Picker-Aufbau:**
```
YOUR PRESETS      ← neue Sektion, Gold-Akzent, adaptiv (weg wenn User keine Presets hat)
CORE TEMPLATES    ← bleibt wie v2-Handoff 10.1
[CLASSICS]        ← abhängig von OPEN_DECISIONS #1
START FROM SCRATCH
```

**Regeln:**
- YOUR PRESETS steht oben (häufigster Wiederzugriff)
- Gold-Akzent nach NUANCEN Punkt 1 (User-persönliche Qualität)
- Sektion wird komplett weggelassen wenn User keine Presets hat — analog CONTINUE-Band-Logik
- Preset-Cards zeigen: Name, Thumbnail, Case-Typ, Grid-Dim, ggf. verlinkte Signature (als kleines Gold-Badge)

**Landing-Band CONTINUE:**
- Adaptiv: weg wenn User keine Projekte hat
- Mit `[+ New Project]` Slot wenn Projekte vorhanden
- Zeigt nur Projekte, nie lose Library-Items

**Save-Popup für Grid-Preset (kommt vom Workspace, aber Picker sollte das verstehen):**
- Flexi-Payload mit 4 Checkboxen (Layout / Panel Fields / Module / Signature)
- Projekt-Zuordnung kombiniert im gleichen Popup (Library only / zu Projekt X / neues Projekt)

### Picker-Specs die unverändert bleiben

Die v2-Handoff-Spezifikation für den Picker (Abschnitt 10.1) bleibt vollumfänglich gültig. Die Produkt-Strategie ergänzt nur:

- YOUR-PRESETS-Sektion (neu, oben)
- Adaptivität der Sektionen (weg wenn leer)
- Classics-Verortungs-Offenheit

Suchfeld, Filter-Pills, Card-Grid-Layout, Scratch-Card bleiben unverändert.

---

## Was der Picker-Planer NICHT entscheidet

- **Datenmodell-Details** (steht fertig in PRODUCT_STRATEGY_V1 §1)
- **Save-Popup-Inhalt** (steht fertig in PRODUCT_STRATEGY_V1 §2.2)
- **Landing-Gesamtlogik** (steht fertig in PRODUCT_STRATEGY_V1 §5)
- **LIB-Tab-Details** — das ist eigene Phase (OPEN_DECISIONS #5)
- **Projekt-Overview-Layout** — abhängig von Filmsystem/Board-Phase (OPEN_DECISIONS #4)
- **Workspace-Projekt-Kontext** — Workspace-Phase (OPEN_DECISIONS #7)

---

## Pflicht-Lektüre für den Picker-Planer

In dieser Reihenfolge:

1. `docs/visual-overhaul/ROADMAP.md` — Phasen-Übersicht
2. `docs/visual-overhaul/OPEN_DECISIONS.md` — **zentrale Liste offener Punkte**
3. `docs/visual-overhaul/PRODUCT_STRATEGY_V1.md` — **primäre Produkt-Quelle**
4. `docs/visual-overhaul/PHASE1_STATUS.md` — Brand-Stand (nicht neu verhandeln)
5. `docs/visual-overhaul/NUANCEN.md` — Anti-Drift, besonders Punkte 1, 6, 10
6. `docs/visual-overhaul/SEENGRID_VISUAL_OVERHAUL_HANDOFF_v2.md` Abschnitt 10 (Grid Creator Specs)
7. Dieses Dokument
8. `docs/visual-overhaul/MODULE_AND_CASE_CATALOG.md` — für Verständnis der Cases die im Picker sichtbar werden

---

## Jonas-Profil (für den Picker-Planer)

- Solo AI-Filmmaker, Nicht-Coder, Deutsch
- Direkte Kommunikation, brutale Ehrlichkeit, keine Sycophancy
- Kurze präzise Antworten, hasst Analysis-Paralysis
- Nach langen Sessions kognitiv überlastet — **simpel halten**, keine Walls-of-Text
- Kann visuell sehr gut beurteilen ob etwas falsch wirkt
- Bei Produkt-Fragen braucht er einen Partner der Optionen strukturiert, **nicht alles alleine entscheidet**
- **Bei Konflikt oder Unklarheit:** Jonas entscheidet, nicht der Chat
- **Bei "weiß nicht mehr genau was entschieden wurde":** als Offen-Punkt in `OPEN_DECISIONS.md` eintragen, nicht raten

---

## Anti-Drift für Picker-Phase

- **Brand nicht neu verhandeln** — ist final (PHASE1_STATUS)
- **Produkt-Strategie nicht neu verhandeln** — ist final (dieses Dokument + PRODUCT_STRATEGY_V1)
- **Scope eng halten** — Picker ist Picker. Workspace-Themen, LIB-Themen, Filmsystem-Themen werden in ihre eigenen Phasen verwiesen
- **Bei neuen Produkt-Ideen während der Picker-Phase:** in `OPEN_DECISIONS.md` eintragen, nicht spontan integrieren
- **Code-Architektur nicht ausdehnen** — wenn technische Fragen auftauchen die über Picker hinausgehen, Picker-Scope halten und offen notieren

---

## Was am Ende der Picker-Phase vorliegen muss

1. Picker-Spec (visuell/strukturell) — bereit für Code-Chat
2. CONTINUE-Band-Capacity-Entscheidung in OPEN_DECISIONS aktualisiert
3. Classics-Verortung in OPEN_DECISIONS aktualisiert (egal welche Entscheidung)
4. ROADMAP aktualisiert (Picker-Phase → `[✓]`, nächste Phase → `[→]`)

---

**Ende Übergabe.**
