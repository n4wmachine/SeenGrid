# SeenGrid — Grundgerüst für Claude / Claude Code

## Zweck dieses Dokuments

Dieses Dokument ist das **Grundgerüst** für das Projekt **SeenGrid**.

Es dient als:
- konzeptuelle Startbasis
- Architektur-Referenz
- inhaltliche Leitplanke für Claude / Claude Code
- Schutz gegen spätere Verwässerung des Projekts

Dieses Dokument beschreibt **nicht** schon jedes einzelne Promptdetail.
Es beschreibt:
- was SeenGrid sein soll
- wie es gedacht werden soll
- wie es aufgebaut werden soll
- welche Prinzipien dabei nicht verletzt werden dürfen

---

# 1. Projektidentität

## Name
**SeenGrid**

Stylisierte Form von:
- **Scene**
- **Grid**

Der Name soll wirken wie:
- ein echtes Produktionswerkzeug
- ein visueller Operator
- ein workflow-nahes System
- kein generischer AI-Hype-Name

---

# 2. Was SeenGrid ist

**SeenGrid ist ein modulares Operator-Tool für meinen AI-Film-/Bild-Workflow.**

Es soll mein bisher verstreutes Systemwissen aus:
- TXT-Dateien
- Promptsammlungen
- Grid-Formaten
- Filmsystemen
- Modellregeln
- Consistency-Workflows
- experimentellen Spezialformaten

in **eine operative, bedienbare, erweiterbare Oberfläche** überführen.

SeenGrid ist **nicht** einfach ein Prompt-Builder.
SeenGrid ist **auch nicht** nur eine Tool-Sammlung.

SeenGrid ist:

**ein modulares Produktions- und Orchestrierungssystem für NanoBanana / Kling / verwandte Visual-Workflows.**

---

# 3. Kernproblem, das SeenGrid löst

Aktuell liegt mein Wissen verteilt in:
- vielen Textdateien
- spezialisierten Promptformaten
- verschiedenen Workflows
- manuellen Copy-/Paste-Prozessen
- implizitem Erfahrungswissen
- verstreuten Speziallösungen

Das erzeugt:
- Reibung
- Vergessen
- Inkonsistenz
- unnötige Sucharbeit
- Angst vor Veralten
- schlechte Bedienbarkeit trotz gutem Wissensstand

SeenGrid soll das lösen.

## Ziel
**Keine Textdateien-Apokalypse mehr.**

Stattdessen:
- zentrale Bedienbarkeit
- modulare Kombinierbarkeit
- klare Trennung von Core und Spezialwissen
- leichte Pflege
- leichte Erweiterbarkeit
- systematische Nutzung meines vorhandenen Wissens

---

# 4. Was SeenGrid nicht sein soll

SeenGrid soll **nicht** sein:

- kein generischer AI-Content-Generator
- kein Allzweck-SaaS
- kein Tool für „alles“
- kein Social-Media-Automationsprodukt
- keine bloße hübsche UI für chaotische Promptblöcke
- kein Monster mit 100 Funktionen ohne klare Architektur
- kein System, das bei jeder Änderung neu gebaut werden muss

SeenGrid ist zuerst:
**ein egoistisches internes Operator-Tool für meinen echten Workflow.**

Erst später kann man über weitere Formen nachdenken.

---

# 5. Grundprinzipien

## 5.1 Datengetrieben statt hardcoded
SeenGrid darf nicht so gebaut werden, dass Inhalte überall hart im UI-Code verteilt sind.

Stattdessen:
- stabile App-Struktur
- editierbare Inhalte in Daten- und Dokumentdateien

Das ist Pflicht.

## 5.2 Operator statt starres Spezialtool
SeenGrid soll nicht primär aus festen Einzelfunktionen bestehen wie:
- 3x3 Grid Tool
- 2x2 Grid Tool
- Start-End Tool
- Character Merge Tool

Sondern aus:
- **generischen Operatoren**
- mit **Parametern**
- plus **Modes**
- plus **Preset Layer**

## 5.3 Modularität auf Operator-Ebene, Einfachheit auf Preset-Ebene
Unter der Haube flexibel.
An der Oberfläche schnell und klar bedienbar.

Nicht:
- 40 Felder für jeden Mini-Use-Case

Sondern:
- starke modulare Basis
- schnelle Alltags-Presets

## 5.4 Core und Spezialwissen sauber trennen
Allgemeine Operator-Logik darf nicht mit historisch optimierten Spezialformaten vermischt werden.

Es braucht eine klare Trennung zwischen:
- **Core**
- **SeenGrid Optimized**
- **Experimental**
- **Deprecated**

## 5.5 Erweiterbarkeit ohne Rebuild
Das Tool muss so gebaut werden, dass ich später sagen kann:
- füge Stil X hinzu
- entferne Tool Y
- ersetze Grid A durch Grid B
- erweitere Feld Z
- markiere etwas als deprecated

ohne dass Claude das ganze Tool neu bauen muss.

Das ist kein Bonus.
Das ist Kernanforderung.

---

# 6. Die Grundarchitektur

SeenGrid besteht aus 4 Ebenen:

## Ebene 1: Operator
Die allgemeine Maschine.

Beispiele:
- Grid Operator
- Sequence Operator
- Character Operator
- Integration Operator
- Scene Operator
- Style Operator
- Prompt Operator

## Ebene 2: Mode
Der konkrete Anwendungsmodus innerhalb eines Operators.

Beispiele:
- world study
- character study
- multishot scene
- detail strip
- expression board
- start-end pair
- progression
- merge
- topology

## Ebene 3: Preset Layer
Die konkrete Prompt-/Ausgabeform.

Status-/Arten:
- **Core**
- **SeenGrid Optimized**
- **Experimental**
- **Deprecated**

## Ebene 4: Instance
Die aktuelle Nutzung eines Operators.

Beispiel:
- Grid Operator
- mode = character study
- rows = 3
- columns = 3
- preset = SeenGrid Optimized
- character lock = high
- variation type = cinematic angle variation

---

# 7. Die Preset-Layer-Logik

## 7.1 Core
Die allgemeine modulare Standardlogik.

Eigenschaften:
- sauber
- flexibel
- nicht überoptimiert auf einen einzelnen Spezialfall
- gute Standardausgabe
- breite Wiederverwendbarkeit

## 7.2 SeenGrid Optimized
Meine bewährten hochoptimierten Spezialformate.

Diese basieren auf:
- bestehenden TXT-Dateien
- real getesteten Promptformaten
- Workflow-Erfahrung
- speziellen Nano-/Kling-Konfigurationen
- Use-Case-spezifischen Strukturen

Diese Presets sind **nicht** der allgemeine Standard.
Sie sind die **Expertenschicht**.

Beispiele:
- SeenGrid Optimized 2x2 Multishot
- SeenGrid Optimized 3x3 World Zone
- SeenGrid Optimized Character Angle Study
- SeenGrid Optimized Start-End
- SeenGrid Optimized Character+World Merge

## 7.3 Experimental
Für:
- neue Ideen
- noch nicht sauber validierte Varianten
- trendige neue Formate
- Dinge mit Potenzial, aber ohne sicheren Status

## 7.4 Deprecated
Für:
- veraltete Formate
- ersetzte Tools
- frühere Speziallösungen
- Dinge, die nicht mehr Hauptpfad sind

Wichtig:
Deprecated bleibt dokumentiert, aber klar als nicht empfohlen markiert.

---

# 8. SeenGrid soll nicht nur Tools enthalten, sondern Operatoren

## 8.1 Grid Operator
Nicht:
- 3x3 Tool
- 2x2 Tool

Sondern:
**ein allgemeiner Grid Builder**

### Mögliche Felder:
- rows
- columns
- panel intent
- continuity mode
- subject lock
- world lock
- allowed variation
- camera relationship
- layout instructions
- final style injection
- use case

### Mögliche Modes:
- character study
- world study
- scene progression
- detail strip
- expression board
- camera variant board
- story beat board

### Mögliche Presets:
- Core
- SeenGrid Optimized 2x2 Multishot
- SeenGrid Optimized 3x3 World Zone
- SeenGrid Optimized Character Angle Study
- Experimental

---

## 8.2 Sequence Operator
Nicht nur Start-End.
Sondern allgemeine Sequenzlogik.

### Mögliche Felder:
- number of states
- continuity lock
- motion element
- change intensity
- camera lock
- environment lock
- character lock
- sequence meaning

### Mögliche Modes:
- start-end
- progression
- micro-action strip
- transformation sequence
- motion test
- state variation

### Mögliche Presets:
- Core
- SeenGrid Optimized Start-End
- Experimental

---

## 8.3 Character Operator
Allgemeiner Operator für Character-Views, Identity-Checks, Pose-/Expression-Varianten.

### Mögliche Felder:
- number of views
- view types
- framing type
- full body / half body / close
- expression variation
- pose variation
- identity lock strength
- outfit lock
- face crop reference
- layout mode

### Mögliche Modes:
- angle study
- expression board
- pose comparison
- outfit comparison
- detail strip
- identity stress test

### Mögliche Presets:
- Core
- SeenGrid Optimized Character Angle Study
- SeenGrid Optimized Detail Strip
- Experimental

---

## 8.4 Integration Operator
Für das Zusammenführen mehrerer Elemente.

### Mögliche Felder:
- subject sources
- world source
- lock hierarchy
- atmosphere carryover
- scale logic
- perspective logic
- identity priority
- composition goal

### Mögliche Modes:
- character into world
- two character integration
- prop into scene
- outfit swap
- style merge
- environment transfer

### Mögliche Presets:
- Core
- SeenGrid Optimized Character+World Merge
- Experimental

---

## 8.5 Scene Operator
Für räumliche und szenische Operatoren.

### Mögliche Felder:
- number of zones
- connectedness strength
- zone role logic
- movement path visibility
- environment lock
- reveal hierarchy
- cinematic purpose
- transition emphasis

### Mögliche Modes:
- world zone board
- scene topology
- traversal map
- single-location expansion
- hidden passage logic
- threshold network

### Mögliche Presets:
- Core
- SeenGrid Optimized 3x3 World Zone
- Experimental

---

## 8.6 Prompt Operator
Der modulare Prompt-Assembler.

### Mögliche Blöcke:
- subject block
- camera block
- lens block
- focus block
- light block
- style block
- environment block
- continuity block
- negative / forbidden block
- special behavior block

Dieser Operator soll Promptzusammenstellung nicht als chaotischen Textblock, sondern als strukturierte Kombinationslogik behandeln.

---

## 8.7 Style Operator
Für Stilbibliothek und Stil-Injektion.

### Erstes Ziel:
Nicht 500 Styles.
Sondern:
- die real benutzten
- sauber kategorisiert
- mit Status versehen
- kombinierbar oder nicht kombinierbar
- mit Use-Case-Hinweisen

### Mögliche Felder:
- name
- category
- style description
- compatibility notes
- best use case
- status
- source
- optional prompt injection logic

---

# 9. Was SeenGrid in v1 enthalten soll

## Pflicht in v1
SeenGrid v1 soll zuerst **meinen echten Kernworkflow** bedienbar machen.

### Muss drin sein:
- Prompt Builder / Prompt Operator
- Style Library
- Lens / Aperture / Focus / Camera / Distance / Look Library
- Grid Operator
- Sequence Operator
- Character Operator
- Integration Operator
- Scene Operator
- Copy-ready Output
- klare Trennung zwischen Core und SeenGrid Optimized
- Statussystem
- leichte Erweiterbarkeit

### Ebenfalls wichtig:
- keine Textdateien-Apokalypse mehr
- alle zentralen Consistency-Werkzeuge per Klick erreichbar
- Grundlogik des Filmsystems bedienbar machen
- nicht nur sammeln, sondern operativ nutzbar machen

---

# 10. Was bewusst nicht in v1 rein soll

## Noch nicht:
- alles für alle Modelle
- riesige Trendbibliothek
- SaaS-/Multi-User-Komplexität
- Social-/Sharing-Funktionen
- komplette Vollautomatisierung
- übertriebene Stil-Explosion
- jede denkbare Community-Technik
- Monster-Feature-Scope

Die App soll zuerst:
**mein operatives Cockpit** werden.

---

# 11. Wissensschichten, die Claude / Claude Code später braucht

SeenGrid darf nicht auf random allgemeinen Nano-Annahmen basieren.

Es braucht mittelfristig 5 saubere Wissenssammlungen:

## 11.1 Prompt-Formate
Für jeden wichtigen Use Case:
- Pflichtblöcke
- optionale Blöcke
- Reihenfolge
- gute Defaults

## 11.2 Constraints
Was nie passieren darf:
- verbotene Begriffe
- redundante Formulierungen
- falsches Framing
- bekannte Drift-Verursacher
- unnötig hübsche, aber schwache Formulierungen

## 11.3 Trigger / Keywords / Framing-Regeln
Nicht alles aus dem Internet.
Nur:
- getestete Trigger
- plausible und dokumentierte Wirkungen
- Statuskennzeichnung

## 11.4 Status
Jeder relevante Eintrag bekommt Status:
- stable
- tested
- experimental
- deprecated

## 11.5 Use-Case-Zuordnung
Nicht nur „gibt es“, sondern:
- wann sinnvoll
- wann nicht
- mit welchem Operator kombinierbar
- für welchen Use Case stark

---

# 12. Wie bestehendes Wissen integriert werden soll

Ich habe bereits viele spezialisierte Dokumente und Promptformate.

Diese sollen **nicht** 1:1 chaotisch in die App geschüttet werden.

Stattdessen sollen sie strukturiert extrahiert werden in:

## A. Core Rules
Was allgemein gilt

## B. Specialized Presets
Was an bestimmte Formate und Spezialfälle gebunden ist

## C. Constraints and Warnings
Was vermieden werden soll

## D. Status
stable / tested / experimental / deprecated

Wichtig:
Wenn bestehende TXT-Dateien hochoptimierte Spezialformate enthalten, sollen diese als:
**SeenGrid Optimized Presets**
integriert werden, nicht als allgemeine Core-Logik.

---

# 13. Die entscheidende UI-/Produktlogik

SeenGrid soll im Alltag zwei Nutzungsmodi erlauben:

## Variante 1: Basic / Core
Beispiel:
- ich wähle 2x2
- ich wähle Shot Generator
- ich wähle ein paar Parameter
- ich bekomme die modulare Standardlogik

Das ist die Basic-Version.

## Variante 2: Spezial / SeenGrid Optimized
Beispiel:
- ich wähle 2x2
- ich wähle Shot Generator
- ich aktiviere zusätzlich ein spezialisiertes Preset
- ich bekomme direkt das hochoptimierte Spezialformat aus meinem realen Systemwissen

Beispielhafte Benennung:
- Core
- SeenGrid Optimized
- Experimental
- Deprecated

Wichtig:
Die spezialisierten Presets müssen **sichtbar getrennt** vom Core bleiben.

---

# 14. Pflege- und Erweiterbarkeitsprinzip

SeenGrid wird nutzlos, wenn es ab dem ersten größeren Workflow-Update wieder veraltet ist.

Deshalb gilt:

## Das Tool muss so gebaut sein, dass ich später sagen kann:
- füge Stil X hinzu
- entferne Preset Y
- ersetze Grid A durch Grid B
- erweitere Operator C um Feld D
- markiere etwas als deprecated
- ändere Notes / Warnings
- ergänze ein neues SeenGrid Optimized Preset

ohne dass die App neu gebaut werden muss.

### Konsequenz:
**Inhalte müssen austauschbar sein.**
Nicht hardcoded.
Nicht überall verteilt.
Nicht nur im UI-Code versteckt.

---

# 15. Empfohlene interne Projektstruktur für Claude Code

```text
SeenGrid/
  CLAUDE.md
  docs/
    operators.md
    presets.md
    library_schema.md
    rules_and_status.md
    nano_prompt_rules.md
  data/
    operators.json
    presets.json
    styles.json
    lenses.json
    focus.json
    camera.json
    rules.json
  notes/
    experimental.md
    deprecated.md
```

## Bedeutung:

### `CLAUDE.md`
Meta-Regeln des Projekts:
- was SeenGrid ist
- was es nicht ist
- Datengetrieben statt hardcoded
- Operator = flexibel, Preset = schnell
- Core / SeenGrid Optimized / Experimental / Deprecated
- Änderungen minimal-invasiv

### `docs/`
Menschenlesbare Konzeption und Wissensstruktur

### `data/`
Die editierbaren Inhalte

### `notes/`
Unfertige, experimentelle, auslaufende Dinge

---

# 16. Die eine Regel, die niemals verloren gehen darf

**Baue die App so, dass Inhalte gepflegt und erweitert werden können, ohne die App neu denken zu müssen.**

Das ist der Kern.

---

# 17. Wichtigste Qualitätsregel

Nicht jede Vertiefung ist gut.

SeenGrid soll:
- Wert operationalisieren
- Wert absichern
- Wert vertiefen

Aber nicht in:
- unnötige Überkomplexität
- UI-Chaos
- Vollständigkeitswahn
- Monster-Engineering

kippen.

Die Leitregel lautet:

**Modularität auf Operator-Ebene, Einfachheit auf Preset-Ebene.**

---

# 18. Kurzfassung in einem Satz

**SeenGrid ist ein datengetriebenes, modulares Operator-Tool für meinen AI-Film-/Bild-Workflow, das Core-Logik und hochoptimierte SeenGrid-Optimized-Presets sauber trennt und meinen gesamten Workflow endlich bedienbar, pflegbar und erweiterbar macht.**
