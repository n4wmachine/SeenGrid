# MODULE_AND_CASE_CATALOG.md — SeenGrid

**Datum:** 2026-04-16
**Status:** Verbindlicher Katalog aller Cases und Module für den Custom Builder.
**Pflichtlektüre:** Jeder Chat liest diese Datei als vierte Datei im Session-Start-Protokoll (nach CLAUDE.md, BUILD_PLAN.md, SESSION_LOG.md).

---

## Zweck dieser Datei

Diese Datei ist die **einzige Wahrheit** für:
- Welche Cases existieren
- Welche Module existieren
- Welche Module mit welchen Cases kompatibel sind
- Was Custom Content Fields sind und wie sie pro Case funktionieren
- Was MVP ist und was später kommt

**Kein Chat darf Cases oder Module erfinden die hier nicht stehen.** Kein Chat darf Module weglassen die hier stehen. Wenn etwas fehlt, wird es hier ergänzt — nicht im Chat improvisiert.

---

## Wie die Engine funktioniert (Kurzfassung für jeden Chat)

1. Die Engine hat **ein universelles Schema-Gerüst**
2. Jeder Case ist eine **Konfigurationsdatei** (welche Felder, welche Module, welche Defaults, welche Compile-Order)
3. Neuer Case = neue Config-Datei, KEIN neuer Compiler, KEIN neuer Code
4. Core-Templates (Tier 2) sind **vorgefüllte Zustände** die in den Custom Builder laden (BUILD_PLAN §9.3) — kein eigener Tab, kein eigener Builder
5. Trendy Sheets (Tier 3) sind ebenfalls fertige Configs — ein JSON-File pro Sheet
6. Ein neuer Case = halbe Stunde. Ein neues Trendy Sheet = fünf Minuten. Der Krampf ist der einmalige Bau der Engine selbst.

---

## Die 10 Base Cases

Jeder Case hat: eine ID, einen Zweck in einem Satz, und Case-spezifische Panel Content Fields.

### 1. character_sheet
**Das klassische Referenzblatt.** Figur auf einem Sheet: Front, Seite, Rücken, Details — das Concept-Art-Format aus Animationsstudios.
- Panel Fields: `view` (Dropdown: front, side, back, detail…)
- Gegenstück zu character_angle_study: Sheet = klassisch, Angle Study = cinematisch

### 2. character_angle_study
**Cinematische Panel-Strips.** Figur aus mehreren Winkeln in vertikalen Kino-Panels nebeneinander.
- Panel Fields: `view` (Dropdown: front, right_profile, left_profile, back, front_right, front_left, back_right, back_left)
- VALID_PANEL_COUNTS: [3, 4, 6, 8]
- **MVP-Case** — Slices 1-8 bauen diesen Case zuerst

### 3. character_normalizer
**Optional vorgeschalteter 2-Step-Flow.** Erzeugt aus einem gecroppten/unvollständigen Referenzbild einen "Full-body master reference" für Step 2.
- Kein Grid, einzelnes Output-Bild
- Wird im UI als Toggle angeboten: "clean_full_body" (direkt Step 2) oder "needs_normalization" (Step 1 → Step 2)
- **MVP** — Slice 8

### 4. start_end_frame
**Zwei Bilder als Leitplanken für eine Video-KI.** Bild 1 = hier fängt der Clip an, Bild 2 = hier hört er auf. Alles dazwischen macht die Video-KI.
- Panel Fields: `scene_description` (Freitext pro Panel — kann alles sein, von minimalem Posenwechsel bis dramatischer Actionszene)
- Konsistenz-Locks: Character, Stil, Rendering-Qualität. Umgebung und Action sind FREI.
- NICHT dasselbe wie Story Sequence mit 2 Panels

### 5. world_zone_board
**Verschiedene ORTE einer Welt nebeneinander.** Marktplatz, Thronsaal, Hafen, Wald — wie eine Landkarte in Bildern.
- Panel Fields: `zone` (Freitext: welcher Ort/welche Zone)
- Kein Charakter im Fokus. KEIN Face Reference Modul.
- Eigene `environment_consistency_rules` für Lichtstimmung, Farbpalette, Material-Sprache über alle Zonen

### 6. world_angle_study
**EIN Ort, MEHRERE Kamerawinkel.** Dasselbe Zimmer von vorne, von der Seite, von oben, Detailansicht. Wie ein Location Scout der einen Drehort dokumentiert.
- Panel Fields: `camera_angle` (Dropdown: eye_level, low_angle, high_angle, bird_eye, wide_establishing, detail_corner…) + `zone_focus` (Freitext optional)
- Gegenstück zum Character Angle Study — statt Figur dreht sich die Kamera um einen Raum

### 7. shot_coverage
**Eine Szene, verschiedene Einstellungsgrößen.** Wide, Medium, Close-Up, Detail — klassische Kameraarbeit.
- Panel Fields: `framing` (Dropdown: wide, medium, close_up, extreme_close_up, detail) + `shot_detail` (Freitext optional)
- Character-Consistency + Framing-Rules sind Pflicht

### 8. story_sequence
**Mini-Geschichte über N Panels.** Aktion A → B → C → D — narrative Progression.
- Panel Fields: `action` (Freitext: was passiert in diesem Panel)
- Character-Consistency Pflicht, Environment kann variieren (Szenenwechsel erlaubt)
- Pose + Expression sind die Hauptvariablen pro Panel

### 9. expression_sheet
**Gleiche Figur, gleicher Winkel, verschiedene Gesichtsausdrücke.** Emotionsbibliothek eines Characters.
- Panel Fields: `expression` (Dropdown/Freitext: wütend, traurig, hoffnungsvoll, neutral, überrascht, verachtend…)
- Alles außer Expression ist gelockt (Pose, Outfit, Environment, Winkel)

### 10. outfit_variation
**Gleiche Figur, gleicher Winkel, verschiedene Outfits.** Garderoben-Übersicht.
- Panel Fields: `outfit` (Freitext: Streetwear, Gala-Anzug, Kampfrüstung, Schuluniform…)
- Alles außer Outfit ist gelockt (Pose, Expression, Environment, Winkel)

---

## Weitere Cases (nicht im Custom Builder, sondern Tier 1/3)

Aus dem Grundgerüst (SeenGrid_grundgeruest_fuer_claude.md §8) und Jonas' Arbeitspool kommen weitere Formate die als **Signature Sheets (Tier 1)** oder **Trendy Sheets (Tier 3)** in die Engine geladen werden — NICHT als eigene Custom-Builder-Cases gebaut werden müssen:

- detail_strip, pose_comparison, identity_stress_test (Character Operator Modes)
- transformation_sequence, micro_action_strip, state_variation (Sequence Operator Modes)
- scene_topology, traversal_map, single_location_expansion (Scene Operator Modes)
- Lighting Studies, Color Studies, etc.
- 30-40+ Trendy Sheets aus Jonas' Pool

Diese sind **fertige Configs** die eine bestehende Case-Engine nutzen. Kein eigener Compiler, kein eigener Code.

---

## Custom Content Fields — Das universelle Konzept

Jeder Case definiert ein `panel_fields`-Template. Das sagt der Engine: "für diesen Case hat jedes Panel folgende Eingabefelder." Das ist **ein Mechanismus** für alle Cases, nicht 10 verschiedene Implementierungen.

- Feld-Typen: `dropdown` (vordefinierte Optionen) oder `text` (Freitext)
- Jedes Panel bekommt dieselben Felder, aber der User füllt sie individuell
- Die Werte landen 1:1 im Prompt-JSON-Output pro Panel
- Der "Random Fill / Überrasch mich"-Button füllt alle Panel-Fields mit Zufallswerten aus einem Case-spezifischen Pool

---

## Vollständige Modul-Liste

### Universelle Module (alle oder die meisten Cases)

| # | Modul-ID | Was es tut | Optionen |
|---|----------|-----------|----------|
| 1 | `style_overlay` | Look-Lab-Style-Token auf den Prompt legen | Dropdown aus gespeicherten Look-Lab-Styles. **Kern-Feature:** User kreiert Style in Look Lab → speichert als Chip-Token → Token taucht im Custom Builder auf. MVP Slice 7. |
| 2 | `panel_content_fields` | Pro Panel: die Case-spezifischen Eingabefelder (view, action, zone, expression…) | Siehe Case-Definitionen oben. Universeller Mechanismus, Case bestimmt welche Felder. |
| 3 | `random_fill` | "Überrasch mich" — füllt alle Panel-Fields mit sinnvollen Zufallswerten | Ein Button. Pool-Liste pro Case. |
| 4 | `forbidden_elements_user` | Eigene Verbotsliste zusätzlich zur Case-Level-Liste | Freitext, ein Eintrag pro Zeile. Wird mit Case-Level-Forbiddens gemerget. |
| 5 | `environment_mode` | Hintergrund-Kontrolle | Dropdown: inherit_from_reference / neutral_studio / custom_text. MVP Slice 5. |
| 6 | `camera_angle` | Kamerawinkel pro Panel | Dropdown: eye_level, low_angle, high_angle, bird_eye, dutch_angle, over_shoulder, worm_eye… Für Cases wo Camera relevant ist. |
| 7 | `weather_atmosphere` | Stimmungsschicht: Wetter und Atmosphäre | Dropdown/Freitext: Regen, Nebel, Dampf, Staub, Schnee, Hitzeflimmern… Grid-weit oder pro Panel. |
| 8 | `wardrobe` | Outfit-Beschreibung | Freitext. Grid-weit (alle Panels gleich) oder pro Panel wechselbar. Bei outfit_variation ist das kein Modul sondern das Panel Content Field selbst. |
| 9 | `pose_override` | Eigene Pose statt Case-Default | Freitext oder Dropdown: standing, sitting, walking, leaning, running, crouching… Global oder pro Panel. |
| 10 | `expression_emotion` | Gesichtsausdruck | Freitext oder Dropdown. Global oder pro Panel. Bei expression_sheet ist das kein Modul sondern das Panel Content Field selbst. |

### Character-spezifische Module (nur bei Cases mit Figur im Fokus)

| # | Modul-ID | Was es tut | Optionen |
|---|----------|-----------|----------|
| 11 | `face_reference` | Zweites Referenzbild nur fürs Gesicht | Toggle an/aus. Payload: placeholder oder echte Referenz. MVP Slice 4. |
| 12 | `multi_character` | Zweite oder dritte Person im selben Bild | Toggle + Anzahl (2/3). Pro zusätzlichem Character: eigene Referenz, eigene Consistency-Rules. Später erweiterbar. |
| 13 | `object_anchor` | Gegenstand der in jedem Panel konsistent sein soll | Freitext: Schwert, Kaffeetasse, Rucksack, Krone… Einer oder mehrere. |

### Kompatibilitäts-Matrix

`✓` = kompatibel, `—` = nicht sinnvoll, `●` = ist das Panel Content Field selbst (kein separates Modul nötig)

| Modul | char_sheet | angle_study | normalizer | start_end | zone_board | world_angle | shot_cov | story_seq | expression | outfit_var |
|-------|-----------|-------------|------------|-----------|------------|-------------|----------|-----------|------------|------------|
| style_overlay | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| panel_content_fields | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| random_fill | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| forbidden_elements | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| environment_mode | ✓ | ✓ | ✓ | ✓ | ● | ● | ✓ | ✓ | ✓ | ✓ |
| camera_angle | ✓ | ✓ | — | ✓ | — | ● | ✓ | ✓ | — | — |
| weather_atmosphere | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| wardrobe | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | ● |
| pose_override | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ● | ✓ | ✓ |
| expression_emotion | ✓ | ✓ | — | ✓ | — | — | ✓ | ✓ | ● | ✓ |
| face_reference | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | ✓ |
| multi_character | — | — | — | ✓ | — | — | ✓ | ✓ | — | — |
| object_anchor | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## MVP vs. Später

### MVP (BUILD_PLAN §14, Slices 1-8)
- **1 Case:** character_angle_study
- **3 Module:** face_reference, environment_mode, style_overlay
- **1 Flow:** character_normalizer (2-step)
- Alles andere kommt **nach Slice 8**, additiv, ohne bestehenden Code umzubauen

### Post-Slice-8 (Reihenfolge entscheidet Jonas)
- Restliche 9 Cases (jeweils: Config-Datei + Panel-Field-Template + Modul-Kompatibilitätsliste)
- Restliche 10 Module
- Panel Content Fields als universeller Mechanismus
- Random Fill
- Core-Template-Presets (Tier 2)
- Trendy Sheets (Tier 3)

### Architektur-Garantie
Jedes neue Modul kostet: einen Key in COMPILE_ORDER, einen case im emitField-Switch, einen Emit-Helper (~10-20 Zeilen), einen Default-Block, eine Validator-Regel, ein UI-Control. **Bestehende Module werden nicht angefasst.** Neue Cases laufen über eigenen Ordner unter `src/lib/cases/`. Die Engine ist additiv erweiterbar by design.

---

## Abgleich mit bestehenden Dokumenten

### BUILD_PLAN §7 (Cases)
§7 listet 5 Cases: Character Study (mit Normalizer), Start/End Frame, World Zone Board, Shot Coverage, Story Sequence. Dieser Katalog **erweitert** §7 um: character_sheet, world_angle_study, expression_sheet, outfit_variation. §7 bleibt gültig, dieser Katalog ist die vollständige Liste.

### BUILD_PLAN §8 (Schema-Gaps)
Alle 7 Gap-Fixes aus §8 gelten weiterhin. Custom Content Fields (panel_fields) ist ein **neues Konzept** das in §8 nicht existiert — es wird beim Bau der jeweiligen Cases als Schema-Erweiterung implementiert.

### BUILD_PLAN §14 (Slices)
Slices 1-8 bleiben unverändert. Dieser Katalog ändert NICHTS am MVP-Scope. Er dokumentiert was NACH dem MVP kommt, damit kein Chat raten muss.

### Grundgerüst (SeenGrid_grundgeruest_fuer_claude.md)
Die Operator/Mode/Preset-Architektur aus dem Grundgerüst ist das konzeptionelle Fundament. Die 10 Base Cases hier entsprechen den Modes der verschiedenen Operators (Grid Operator modes, Character Operator modes, Sequence Operator modes, Scene Operator modes). Die Preset-Layer-Logik (Core / SeenGrid Optimized / Experimental / Deprecated) gilt weiterhin.

### CLAUDE.md
Session-Start-Protokoll wird um diese Datei als **vierte Pflichtlektüre** erweitert.

---

## Regel für jeden Chat

1. **Lies diese Datei.** Vor dem Bauen, vor dem Fragen, vor dem Vorschlagen.
2. **Erfinde nichts.** Wenn ein Case oder Modul hier nicht steht, existiert es nicht.
3. **Frag Jonas** wenn du etwas ergänzen willst. Nicht selbst entscheiden.
4. **Die Kompatibilitäts-Matrix ist verbindlich.** Wenn ein Modul für einen Case als `—` markiert ist, wird es nicht angeboten.
