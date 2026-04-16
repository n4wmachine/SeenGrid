# BUILD_PLAN.md — SeenGrid Rebuild

**Datum:** 2026-04-15
**Status:** Rebuild-Plan nach Hard Reset. Grundlage für den Grid-Creator-Neubau.
**Gilt für:** Den **Grid Creator** (aktuell `src/components/GridOperator.jsx`). Alle anderen Module (Prompt Builder, MJ Cinematic Builder, Prompt Vault, Look Lab, Design System) sind Pre-Pivot Baseline und werden **nicht** neu gebaut.

Diese Datei ist das zweite von drei Koordinations-Dokumenten (siehe CLAUDE.md → Session-Start-Protokoll). Sie hält alles fest was in der Rebuild-Diskussion am 2026-04-14/15 zwischen Jonas und Claude erarbeitet wurde, **inklusive der Details**, damit kein neuer Chat wieder von Null anfängt.

---

## 1. Warum überhaupt ein Rebuild

Zwei Wochen Phase-5-Arbeit haben einen Character-Study-Renderer produziert (`src/lib/skeletonRenderer.js`, 4 Skeletons, 11 Module, 10 Golden-Dateien, ein Test-File) der **nirgendwo in der UI eingehängt war**. `GridOperator.jsx` lädt weiterhin die alten 18 statischen Preset-JSONs direkt — der modulare Unterbau wurde nie live. Gleichzeitig sind folgende strukturelle Probleme aufgetreten:

1. **Branch-Chaos.** Jeder neue Chat hat automatisch einen neuen `claude/…`-Branch aufgemacht, alte Stände gelesen, Drift produziert. Teilweise wurde gegen veraltete Goldens gerendert oder gegen Branches die nie in main gelandet sind.
2. **Kontext-Verlust zwischen Chats.** Kein verbindliches Session-Protokoll. Jeder Chat hat CLAUDE.md anders interpretiert, Phase-Nummern durcheinandergebracht, Pilot-Status falsch gelesen.
3. **Overengineering.** Die alte CLAUDE.md war ~33 KB mit 6 Drift-Regeln, einer Pilot-Merge-Zeremonie, GT-First-Workflow, Pre-Pivot-Block, mehrfach wiederholten Status-Angaben. Am Ende war der Plan zu komplex um ihn zu lesen bevor man anfing zu arbeiten.
4. **Empirische Sackgasse bei Pilot 2.** Der geplante "Character + World Merge"-Case (zwei Referenzbilder zu einem kombinieren) funktioniert in NanoBanana schlicht nicht: slop faces, falsche Proportionen, Identitätsdrift bei jedem Test. Wir haben mehrere Tage versucht es zu fixen; es ist empirisch tot.
5. **Kognitive Überlastung beim Nutzer.** Jonas hat 2-3 Tage hauptsächlich damit verbracht Chats im Kontext zusammenzuhalten statt zu bauen. Der Zeitpunkt für einen sauberen Schnitt war jetzt.

Der Rebuild ist deshalb **nicht** "den Renderer nochmal besser bauen". Er ist ein fundamentaler Umdenker: weg vom Pilot-getriebenen, String-template-basierten, orphaned-Modul-Baukasten hin zu einer **State-getriebenen, JSON-nativen, UI-gekoppelten Engine** mit klarer Tier-Struktur.

---

## 2. Mission: Was SeenGrid eigentlich ist

SeenGrid ist **kein generischer Prompt-Builder** und **kein Higgsfield-Killer** (das war eine übertriebene Framing-Wendung im Chat, Jonas hat es explizit korrigiert). SeenGrid ist:

> Ein **NanoBanana-nativer Workflow-Toolkit** für AI-Filmemacher die konsistente Character/World/Shot-Sheets erzeugen wollen, ohne jedes Mal einen Prompt von Hand zu tippen und ohne auf bezahlte Merge-Services angewiesen zu sein.

Das Tool konkurriert nicht mit bezahlten Image-Merge-Services. Es deckt die **80% der Aufgaben ab, für die man keinen Merge braucht** — also alles was über Referenzbild + strukturierten Prompt lösbar ist: Angle Studies, Start/End Frames, Zone Boards, Shot Coverage, Story Sequences.

Der Nutzer ist ein **solo AI-Filmemacher, deutschsprachig, kein Coder**. Er denkt in Filmlogik, nicht in Features. Er erwartet dass Prompts empirisch in NanoBanana funktionieren, nicht nur theoretisch schön aussehen. Er toleriert keine generischen AI-Outputs und besteht auf brutaler Ehrlichkeit. Der Builder muss **filmisch**, nicht softwareentwicklerisch fühlen.

---

## 3. Der Grid Creator — Das Herz von SeenGrid

Der Grid Creator hat vier Tiers als Tabs innerhalb des Grid-Moduls. Jeder Tier hat einen anderen Zweck und einen anderen Reifegrad. Die Reihenfolge im UI ist:

### Tier 1 — Signature
Jonas' handoptimierte, fertig in NanoBanana validierte Sheets und Grids. Ein Klick, fertiger paste-ready Prompt, keine Bearbeitung möglich. Der User kriegt hier garantierte Qualität.

**Stand 2026-04-15:** Es liegen ein paar Platzhalter-Einträge bereit, die sind aber **nur Platzhalter** — Jonas hat sie explizit so benannt. Die echten Signature-Sheets kommen erst beim Rebuild rein, kuratiert von Jonas selbst aus seinem NanoBanana-Testpool.

### Tier 2 — Core
Basis-Starter-Templates für die gängigen Consistency Use Cases: Character Study, Start/End Frame, World Zone Board, Shot Coverage, Story Sequence. Funktionieren direkt paste-ready, aber simpler aufgebaut als Signature. Für User die schnell einen funktionierenden Einstieg wollen ohne alles selbst zu konfigurieren.

### Tier 3 — Trendy
Kreative Community-Grids. **Idee:** aus dem Prompt Vault (1500+ Community-Prompts aus jau123/nanobanana-trending-prompts) werden diejenigen extrahiert/abgeleitet die sich als Grid-Konstellationen eignen. Keine Handarbeit pro Eintrag — eher automatisierte Ableitung plus optionale Kuratierung.

**Analyse-Aufgabe (offen):** Das Trending-Prompts-Repo sauber auf JSON-Schema scannen, brauchbare Grid-fähige Einträge herausfiltern, dann als Tier-3-Einträge exportieren. Das ist ein eigener Build-Schritt, nicht Teil des MVP des Custom Builders.

### Tier 4 — Custom Builder
**Die echte Engine. Der Grund für den ganzen Rebuild.** Siehe Abschnitt 4.

---

## 4. Custom Builder — Was er wirklich ist

Der Custom Builder ist **kein** "wähle ein Template aus einer Liste und zeig den Prompt". Er ist ein **live reaktiver, modularer Prompt-Builder** der wie folgt funktioniert:

1. **User wählt Grid-Dimensionen.** Rows × Cols als echtes Feature, **plus** Panel-Orientierung (vertical/horizontal) als separate Dimension — nicht impliziert aus rows/cols. Ein 4-Panel-Strip kann ein `4×1 horizontal-row mit vertical panels` sein (Angle Study) oder ein `2×2 grid` (Shot Coverage) oder ein `1×4 column mit horizontal panels` (Story Sequence).

2. **User wählt einen Case.** Z.B. "Character Angle Study", "Start/End Frame", "World Zone Board", "Shot Coverage", "Story Sequence". Der Case-Pick bestimmt welche Felder, Module und Panel-Rollen überhaupt verfügbar sind. Nicht jeder Case kombiniert mit jedem Modul (siehe Abschnitt 6 Constrained Modularity).

3. **User sieht sofort einen nackten, empirisch erprobten Skelett-Prompt.** Nicht ein leeres Template, sondern der **getestete GT-Prompt für genau diesen Case in seiner minimalen Form**. Für Angle Study ist das der 4-Panel-Front/R/L/Back-Prompt aus `DISTILLATIONS/character-study-chatgpt-groundtruth.md` Step 2.

4. **User fügt Module per Klick hinzu.** Face Reference an/aus, Environment Preserve an/aus, Style Overlay (Text-Token aus Look Lab), Custom Forbiddens. Jedes Modul ist ein Toggle oder ein kleines Formular (z.B. Env Preserve hat die Modi "inherit_from_reference | neutral_studio | custom_text").

5. **Der Prompt passt sich in Echtzeit an.** Jeder Klick löst einen Recompile aus. Der Output (strukturiertes JSON-Prompt-Format) wird live neben dem Builder angezeigt. Kein "Generate"-Button, kein Loading-State — pure Reaktivität.

6. **Live Visual Preview.** Parallel zum Prompt-Output zeigt eine SVG-basierte Vorschau **stilisierte Dummy-Figuren in den Panel-Rollen**. Für Angle Study: 4 Dummies in Front/R/L/Back-Orientierung. Für Shot Coverage: 1 Dummy in 4 Kameradistanzen. So sieht der User **sofort** was der Prompt produzieren wird, nicht nur leere Boxen mit Text drin.

7. **Copy-Output.** Paste-ready JSON, ein Klick zum Kopieren. Kein Auto-Submit an NanoBanana, kein API-Layer. Der User kopiert manuell in sein Tool. Das JSON-Format ist als transportables Prompt-Format bewusst gewählt — es funktioniert nicht nur in NanoBanana, sondern auch in Grok Imagine und voraussichtlich in anderen strukturschwachen Prompt-Interfaces, ohne dass der User umformatieren muss.

**Was der Custom Builder nicht ist:**
- Kein Template-Selector mit Preview
- Kein "wähle aus 50 fertigen Prompts"
- Kein Video-Prompt-Builder (Kling/Seedance explizit ausgeschlossen)
- Kein Kamera-Movement-Configurator (irrelevant für Bildgenerierung)
- Kein automatisierter NanoBanana-API-Client

---

## 5. Architektur: JSON-State + Compiler

Dies ist der **zentrale architektonische Durchbruch** der Rebuild-Diskussion am 2026-04-15. Früher war der Plan: "Funktion pro Case die einen String zurückgibt". Der neue Plan ist:

```
UI State  →  Case-Schema-Validator  →  JSON-Serializer  →  JSON-Prompt-Output
```

### 5.1 Warum JSON statt String-Templates

Am 2026-04-15 hat Jonas den wortwörtlich validierten Paragraph-Prompt aus `DISTILLATIONS/character-study-chatgpt-groundtruth.md` Step 2 von ChatGPT in ein strukturiertes JSON-Schema übersetzen lassen (ohne dass ChatGPT Projektkontext hatte — das ist wichtig, das JSON ist ein **Proof of Concept**, kein Architekturvorschlag). Er hat dieses JSON **wortwörtlich in NanoBanana als Prompt** gepastet und bekam **1:1 das gleiche Bild** wie mit dem Paragraph-Prompt.

**Danach hat er den Step-1-Normalizer genauso übersetzt und getestet.** Ergebnis: der JSON-Pfad produzierte bei diesem Case ein **saubereres** Bild als der Paragraph-Pfad. Jonas O-Ton: "er funktioniert als json sogar sauberer und besser als vorher."

**Das bedeutet:** NanoBanana akzeptiert strukturiertes JSON direkt als Input und reagiert darauf 1:1 wie auf natürliche Sprache — und bei Constraint-schweren Cases (viele Locks, viele Forbiddens, explizite Prioritäten) **präziser** weil die strukturellen Beziehungen weniger interpretationsoffen sind.

**Konsequenz für die Architektur:** Der Custom Builder hält seinen Zustand **nicht als String-Template-Fragmente**, sondern als **strukturiertes JSON-Objekt**. Aus diesem Objekt erzeugt ein Compiler einen **JSON-Prompt-Output** — das ist im MVP das einzige unterstützte Output-Format (Entscheidung vom 2026-04-15 abends, siehe §15 Item 2). Ein Paragraph-Serializer ist explizit **nicht** Teil des MVP und wird erst nachgezogen wenn ein realer Use Case auftaucht.

**Wichtig:** Der interne State (`State-JSON`) und der Output (`Prompt-JSON`) sind **nicht dieselbe Struktur**, auch wenn beide JSON sind. Der State enthält Felder die im Output nichts verloren haben — z.B. `enabled: false`-Flags, `schema_version`, Forbiddens-Quellen-Metadaten. Der Compiler übersetzt vom State-JSON in ein Prompt-JSON das NanoBanana (und Grok Imagine und ähnliche Backends) wortwörtlich als Input akzeptiert. Die Test-JSONs in `DISTILLATIONS/` sind **validierte Prompt-JSON-Zielzustände**, nicht State-Schemas — das State-Schema baut die sieben Lücken aus §8 drumherum auf.

### 5.2 Die beiden empirisch validierten JSON-Beispiele

Zwei JSON-Schemata liegen als Validated Ground Truth im Repo und dienen als **Ausgangspunkt** (nicht als finales Schema) für den Neubau:

1. **`DISTILLATIONS/angle-study-json-example.md`** — Step-2-Equivalent (`cinematic_panel_strip_v1`). Enthält: `id`, `type`, `goal`, `references` (mit `priority` + `authority_over`), `style` (mit `mode`, `not_mode`, `finish`), `layout` (mit `panel_count`, `panel_orientation`, `panel_arrangement`, `panel_spacing`, `figure_margin`), `panels` (Array), `orientation_rules`, `full_body_rules`, `consistency_rules`, `pose`, `forbidden_elements`.

2. **`DISTILLATIONS/character-normalizer-json-example.md`** — Step-1-Equivalent (`single_full_body_character_lock_v1`). Enthält: `id`, `type`, `goal`, `references`, `critical_full_body_rule`, `outfit_preservation`, `environment_preservation`, `pose`, `framing`, `lock`, `forbidden_elements`.

**Wichtige Beobachtung:** Die beiden Schemata haben **verschiedene Feldstrukturen**. Der Normalizer hat `critical_full_body_rule` + `outfit_preservation` + `environment_preservation` als separate Top-Level-Blöcke. Der Angle Study hat `orientation_rules` + `full_body_rules` + `consistency_rules`. **Das ist kein Bug und nicht zu vereinheitlichen** — es ist der Kern der Constrained Modularity (Abschnitt 6): jeder Case bringt seine eigenen Spezial-Constraint-Blöcke mit, der Compiler iteriert **pro Case** über eine bekannte Feld-Menge, nicht über eine globale Modul-Liste.

### 5.3 Compiler-Verantwortung

Der Compiler nimmt einen JSON-State + den Case-Identifier und produziert Output. Seine Regeln:

1. **Keine freie Feld-Iteration.** Der Compiler weiß für jeden Case welche Felder existieren und in welcher Reihenfolge sie in den Prompt kommen (Compile-Order). Für Angle Study z.B. `goal → references → style → layout → panels → orientation_rules → full_body_rules → consistency_rules → pose → forbidden_elements`.
2. **Modul-Toggles werden respektiert.** Wenn ein Modul `enabled: false` hat, werden seine Felder übersprungen und seine Forbiddens nicht in den Merge aufgenommen.
3. **Forbiddens werden gemerged.** Case-Level-Forbiddens + aktive Modul-Level-Forbiddens + User-Custom-Forbiddens → dedupliziert → in eine finale Liste.
4. **Panel-Rollen werden deriviert, nicht gelesen.** Die `panels`-Liste im JSON ist **nicht hardcoded**, sondern kommt aus `layout.panel_count` + einer case-spezifischen Panel-Role-Strategy (siehe Abschnitt 8.1).
5. **Ein Output-Modus: JSON.** Der Compiler produziert einen JSON-Prompt mit stabiler Key-Order. Paragraph-Output ist explizit **nicht** Teil des MVP (siehe §15 Item 2). Die stabile Key-Order ist wichtig damit zwei identische States byte-identische Outputs erzeugen und der User keine kosmetischen Diff-Overheads beim Copy-Paste erlebt.

### 5.4 Wichtige Nuance: Nicht das JSON ist der Hebel — die Struktur ist es

**Aufgeklärt am 2026-04-15 abends nach weiteren NanoBanana-Tests:** Jonas hat nach dem initialen Angle-Study- und Normalizer-Test noch weitere Prompts im gleichen strukturierten Format probiert und berichtet: sie funktionieren **noch besser** als die unstrukturierten Paragraph-Varianten, und zwar konstanter und sauberer. ChatGPT hat dazu einen wichtigen Hinweis gegeben den wir hier festhalten:

> **Der Qualitätsgewinn kommt nicht vom JSON-Format an sich, sondern von der Strukturierung und den klaren Prioritäten die das JSON-Format erzwingt.**

Das ist ein bedeutender Unterschied in der Interpretation:

- **Falsche Lesart:** "JSON ist das magische Format, alle Prompts sollten JSON sein weil Format X."
- **Richtige Lesart:** "Saubere Hierarchien, explizite Prioritäten (`priority`, `authority_over`), harte Trennung zwischen Constraints und Präferenzen, und atomare Listen statt Fließtext sind die Qualitäten die NanoBanana besser versteht. JSON erzwingt diese Qualitäten einfach am effizientesten — und ist deshalb das gewählte Output-Format, nicht weil JSON-als-Symbol magisch ist."

**Warum das wichtig ist für das Schema-Design (Slice 1) und den Compiler (Slice 2):**

Wir liefern zwar nur JSON als Output aus — aber die obige Einsicht bestimmt **wie das Schema gestaltet wird und wie der Compiler den State in JSON übersetzt**. Ein strukturschwaches Schema würde ein strukturschwaches JSON produzieren, und der Vorteil wäre dahin. Die vier konkreten Prinzipien:

1. **Prioritäten werden wörtlich kodiert.** Wenn im State "Full-body master reference ist die höchste Autorität für X, Y, Z" gilt, kodiert das Schema dies als explizites `priority`-Feld und `authority_over: [...]` — nicht als vage Reihenfolge oder implizite Annahme. Der Compiler serialisiert diese Felder wortwörtlich in den Output, nicht umformuliert.

2. **Listen bleiben Listen.** Forbiddens sind im State ein Array (`["studio_background", "new_location", ...]`) und werden im Output-JSON auch als Array serialisiert — nie zu einem Fließtext-String zusammengezogen, nie in natürliche Sprache eingebettet.

3. **Harte vs. weiche Regeln sind explizit.** Ein `"allow_redesign": false` bleibt im Output-JSON exakt so — kein "preferably avoid", kein "try not to". Booleans bleiben Booleans, harte Constraints bleiben Negativ-Aussagen. Der Compiler hat eine Regel: boolsche Flags werden nicht paraphrasiert.

4. **Reihenfolge ist Priorität.** Die Compile-Order (in welcher Reihenfolge Felder im Output erscheinen) spiegelt die Gewichtung. Wichtigste Constraints oben, weiche Präferenzen unten. JSON-Objekte haben eigentlich keine garantierte Key-Order, aber NanoBanana (und auch Grok Imagine) interpretiert die Reihenfolge in der Praxis als Priorität. Deshalb garantiert der JSON-Serializer **stable key ordering** — das ist eine harte Anforderung an die Serializer-Implementation in Slice 2.

**Konsequenz für Slice 1:** Beim Schema-Design für `character_angle_study` werden diese vier Prinzipien direkt im Schema abgebildet. Jedes Feld das eine Priorität hat, bekommt ein `priority`- oder `authority_over`-Feld. Constraints sind Booleans oder typisierte Enums, nicht Freitext. Forbiddens sind Arrays. Die Compile-Order ist Teil des Schemas, nicht erst des Serializers.

**Konsequenz für Slice 2:** Der JSON-Serializer ist keine einfache `JSON.stringify()`-Wrapper-Funktion — er iteriert über die Compile-Order, entfernt interne State-Felder die nicht in den Output gehören (`enabled: false` Blöcke, `schema_version`, Quellen-Metadaten), mergt Forbiddens aus mehreren Quellen, und produziert deterministisches JSON. Zwei identische States erzeugen byte-identische Outputs.

**Konsequenz für die empirische Validierung:** Der Output des Slice-2-Compilers für den Default-4-Panel-State wird wortwörtlich gegen `DISTILLATIONS/angle-study-json-example.md` gediff-ed (modulo erlaubte Unterschiede durch die sieben Schema-Lücken-Erweiterungen). Wenn der Compiler-Output strukturell sauber ist aber in NanoBanana schlechter performt als das Test-JSON direkt, ist das ein **Compiler-Bug**, kein Grund vom JSON-Only-Default abzurücken.

---

## 6. Constrained Modularity — Was das heißt und was nicht

Im Chat habe ich initial geschrieben "Modularität ist eine Fiktion" — das war **falsch geframed** und Jonas hat es korrigiert. Die richtige Aussage ist: Modularität im SeenGrid-Sinn ist **constrained modularity**, nicht freie Kombinatorik.

**Freie Kombinatorik wäre:** Jedes Modul kombiniert mit jedem Case. Der User baut sich seinen Prompt aus beliebigen Lego-Steinen zusammen. Der Compiler iteriert über eine globale Modul-Liste und klatscht alles an.

**Constrained Modularity ist:** Jeder Case definiert selbst welche Module er unterstützt. Jonas' Signature-Sheets sind **empirisch getestete Konstellationen** — der 4-Panel Angle Study hat seine eigene Liste von Modulen die nachweislich mit diesem Case funktionieren, und der 3×3 World Zone Board hat eine **andere** Liste. Ein Face-Reference-Modul ergibt im Zone Board keinen Sinn (es gibt keine Figur im Fokus), also wird es dort gar nicht angeboten.

**Konkret für den Compiler:** Der Compiler hat **pro Case** eine bekannte Feld-Menge und eine feste Compile-Order. Er iteriert **nicht** über eine globale Modul-Tabelle. Das macht den Compiler-Code case-spezifischer als typische generische Builder, ist aber **absichtlich** so — jede Abweichung von Jonas' getesteten Konstellationen ist Risiko, und dieses Risiko wollen wir nicht im UI verstecken.

**Folge:** Ein neuer Case hinzuzufügen ist nicht "stell die Module-Checkboxen an". Es ist "definiere ein neues Schema mit Case-spezifischen Feld-Blöcken + eine Compile-Order + eine Panel-Role-Strategy + eine Liste der kompatiblen Module". Das ist mehr Arbeit, aber **das ist der ganze Punkt** — wir wollen keine Lego-Freiheit, wir wollen getestete Qualität.

---

## 7. Case-Liste für den Neubau

Die folgenden Cases sind im Custom-Builder-Scope. Alles was nicht hier steht, wird nicht gebaut.

### 7.1 Character Study (Haupt-Fokus Slice 1)
- **Step 2 — Cinematic Angle Study Panel Strip:** Default-Testfall. 4 vertikale Panels (Front / Right Profile / Left Profile / Back) in einer horizontalen Row. Varianten: 3 Panels (Front/R/L), 6 Panels (Front/FR/R/BR/B/FL-ähnlich), 8 Panels (360°-Turn). Die Panel-Rollen ergeben sich aus `layout.panel_count` + Case-spezifischer Strategy.
- **Step 1 — Canonical Full-Body Normalizer:** Optional vorgeschalteter Pfad wenn das Referenzbild gecropped oder unvollständig ist. Erzeugt einen "Full-body master reference" der dann in Step 2 als Haupt-Referenz benutzt wird. **Zwei-Schritt-Flow** im UI: User entscheidet ob er `clean_full_body` (direkt Step 2) oder `needs_normalization` (Step 1 → Step 2) läuft.

### 7.2 Start/End Frame
Zwei Panels die den Anfangs- und Endzustand eines Shots zeigen. Use Case: AI-Video-Pipelines die Start- und End-Frame als Input brauchen. Varianten: 2-Panel (Start/End), 3-Panel (Start/Mid/End). Char-Consistency ist Pflicht, Env-Consistency ist optional (bei Szenenwechsel gewollt).

### 7.3 World Zone Board
Ein Ort (Interior, Exterior, Location) aus mehreren Winkeln/Zonen. Default: 3×3 Grid mit 9 Zonen, oder 2×2 mit 4 Zonen. Kein Charakter im Fokus — der Case hat **kein** Face Reference Modul. Dafür hat er `environment_consistency_rules` die Lichtstimmung, Farbpalette und Material-Sprache über alle Zonen hinweg festzurren.

### 7.4 Shot Coverage
Ein einzelner Shot in verschiedenen Kamera-Distanzen: Wide / Medium / Close-Up / Detail. Default: 4 Panels, 2×2 oder 1×4. Char-Consistency + Framing-Rules sind Pflicht. Keine Kamera-Movement-Simulation (das ist irrelevant für Stills).

### 7.5 Story Sequence
N Panels die eine Micro-Story erzählen. Default: 4-6 Panels in einem Row-Strip. Char-Consistency ist Pflicht, Env kann variieren (Szenenwechsel). Pose + Expression sind die Haupt-Variablen pro Panel.

### 7.6 Was NICHT gebaut wird
- **Character + World Merge.** Empirisch tot in NanoBanana. Nicht versuchen.
- **Video-Prompt-Cases.** Kling, Seedance, Runway-Prompt-Builder — gehört nicht ins Tool.
- **Kamera-Movements.** Dolly, Steadicam, Crane — irrelevant für Stills.
- **Generische Sheet-Galerie ohne modulare Engine.** Das war der alte Ansatz, jetzt verworfen.

---

## 8. JSON-Schema: Die sieben Lücken die der Neubau schließen muss

Das von ChatGPT produzierte JSON (`DISTILLATIONS/angle-study-json-example.md`) ist ein **Proof of Concept**, kein fertiges Schema. ChatGPT hatte keinen Projektkontext. Die sieben identifizierten strukturellen Lücken, die der Neubau explizit adressieren muss:

### 8.1 Panel-Daten sind hardcoded statt deriviert
Im Beispiel-JSON ist `panels` ein Array mit 4 Einträgen, jeder mit fixen `index`, `view`, `framing`. Das funktioniert für genau 4 Panels. Für 3/6/8 Panels müsste man das Array manuell anpassen.

**Fix:** Der State hält nur `layout.panel_count`. Eine **Panel-Role-Strategy** pro Case leitet daraus die Panel-Liste ab.
- `character_angle_study.panel_role_strategy(4)` → `[front, right_profile, left_profile, back]`
- `character_angle_study.panel_role_strategy(3)` → `[front, right_profile, left_profile]`
- `character_angle_study.panel_role_strategy(6)` → `[front, front_right, right_profile, back, left_profile, front_left]` (genaue Reihenfolge ist zu entscheiden, empirisch zu testen)
- `character_angle_study.panel_role_strategy(8)` → 360°-Turn
- Der Strategy-Funktion wird der Case-Kontext übergeben, sie erzeugt eine validierte Panel-Liste mit Orientierungs-Metadaten die der Compiler dann seriellisiert.

### 8.2 Keine `enabled: true/false` Flags für Modul-Toggles
Im Beispiel-JSON sind alle Feld-Blöcke immer aktiv. Es gibt keinen Weg ein Modul abzuschalten ohne den ganzen Block manuell zu entfernen.

**Fix:** Jeder Modul-Block kriegt ein `enabled: true/false` Flag. Wenn `false`, überspringt der Compiler den Block komplett und nimmt auch seine Forbiddens nicht in den Merge. Das matched genau das User-Verhalten im Custom Builder: Checkbox an → Modul an, Checkbox aus → Modul aus.

### 8.3 Keine Integrations-Stelle für Look-Lab-Style-Token
Das Beispiel-JSON hat einen `style`-Block mit `mode: cinematic_panel_strip`, aber keinen Platz für "hier kommt ein Look-Lab-Style-Token rein".

**Fix:** Ein `style_overlay`-Modul mit drei Modi:
- `{ enabled: false }` → kein Overlay
- `{ enabled: true, source: "look_lab_text_token", token: "<text>" }` → Text-Token (Phase 1)
- `{ enabled: true, source: "look_lab_image_ref", ref_id: "<id>" }` → Bild-Referenz (Phase 2, nicht im MVP)

### 8.4 `forbidden_elements` ist flache hardcoded Liste statt gemerget
Im Beispiel-JSON ist `forbidden_elements` eine flache Array-Liste. Das reicht für einen statischen Prompt, aber nicht für einen dynamischen Builder wo Forbiddens aus mehreren Quellen kommen.

**Fix:** Der Compiler merged Forbiddens aus drei Quellen:
- **Case-Level-Forbiddens** (z.B. Angle Study verbietet immer `mirrored_same_side_profile`)
- **Modul-Level-Forbiddens** (z.B. Env-Preserve-Modul fügt `studio_background`, `new_location` hinzu wenn aktiv)
- **User-Level-Forbiddens** (Custom-Einträge die der User selbst im UI getippt hat)

Der Merge dedupliziert und erzeugt die finale Liste. Wenn ein Modul deaktiviert ist, werden seine Forbiddens nicht eingemerget.

### 8.5 Keine Schema-Versionierung
Das Beispiel-JSON hat kein `schema_version`-Feld. Das heißt: wenn wir das Schema später ändern, können wir gespeicherte User-Zustände nicht mehr lesen ohne kaputtzugehen.

**Fix:** Top-Level-Feld `schema_version: "v1"` im State (simpler Counter, siehe Entscheidung §15 Item 6). Der Validator akzeptiert nur bekannte Versionen. Bei Versions-Upgrades läuft eine Migration-Funktion, deren Signatur beim ersten tatsächlichen Bump festgelegt wird.

### 8.6 Environment unterspezifiziert
Das Beispiel-JSON hat `environment_preservation` als Binary (preserve ja/nein). Real brauchen wir mehrere Modi:
- `inherit_from_reference` — Env aus Referenzbild übernehmen (Default)
- `neutral_studio` — expliziter studio backdrop
- `custom_text` — User beschreibt die Umgebung in Worten
- `custom_image_reference` — User liefert separates Env-Referenzbild (Phase 2)

**Fix:** Ein `environment`-Modul mit `mode`-Feld und modus-abhängigen Zusatzfeldern.

### 8.7 Reference-Image-Payloads fehlen
Das Beispiel-JSON hat `references.full_body_master` + `references.face_reference` mit `priority` und `authority_over`, aber **keinen Slot für das tatsächliche Bild**. Im echten Builder muss der User ein Referenzbild hochladen oder aus einer Sammlung wählen können.

**Fix:** Referenzen kriegen einen `payload`-Slot: entweder `{ type: "url", value: "..." }` oder `{ type: "blob_id", value: "..." }` oder `{ type: "placeholder", label: "Reference A" }` (für den Prompt-Output wenn der User das Bild erst später pastet). Der JSON-Serializer übernimmt den `payload`-Slot wortwörtlich in den Output, so dass NanoBanana den Platzhalter beim Pasten durch das dann mitgeschickte Bild ersetzen kann.

### 8.8 Zusammenfassung
Diese sieben Lücken **definieren die Schema-Arbeit in Slice 1**. Ohne sie ist das Schema nicht erweiterbar genug um den Custom Builder zu tragen. Sie sind nicht optional.

---

## 9. Live Reactive UI — Wie der Builder sich anfühlen muss

Der Custom Builder ist **eine einzige reaktive Seite**, kein Wizard, keine Steps, keine Modals. Layout-Grundidee:

```
┌─────────────────────────────────────────────────────────────┐
│  Case: [Character Angle Study ▾]                            │
│  Layout: Rows [1] × Cols [4]   Orientation: [vertical ▾]    │
├──────────────────────┬──────────────────────────────────────┤
│  Modules             │  Live Visual Preview                 │
│  ────────────────    │  ┌──┐ ┌──┐ ┌──┐ ┌──┐                 │
│  [✓] Face Reference  │  │🯅 │ │🯅 │ │🯅 │ │🯅 │                 │
│  [✓] Env Preserve    │  │F │ │R │ │L │ │B │                 │
│      Mode: inherit   │  └──┘ └──┘ └──┘ └──┘                 │
│  [ ] Style Overlay   │                                      │
│  [ ] Custom Forbids  │  Output Format: JSON                 │
├──────────────────────┴──────────────────────────────────────┤
│  Live Prompt Output                                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Create one finished cinematic panel strip as four ...  │ │
│  │ ...                                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                         [ Copy ]            │
└─────────────────────────────────────────────────────────────┘
```

### 9.1 Reaktivität
Jeder Input-Change löst sofort einen Recompile aus. Kein Debounce länger als ~50ms. Kein Loading-State. Kein "Generate"-Button. Der Nutzer sieht unmittelbar was seine Klicks verändern.

### 9.2 State-Modell
Der UI-State entspricht **genau** dem JSON-Schema-State. Das heißt: es gibt keine Translation-Layer zwischen UI und Compiler. Die Checkbox "Face Reference" togglet direkt `state.modules.face_reference.enabled`. Die Auswahl "Mode: inherit" setzt direkt `state.modules.environment.mode = "inherit_from_reference"`. Der Compiler sieht den gleichen State den die UI editiert.

### 9.3 Presets laden
Wenn der User aus Tier 1/2/3 einen Signature/Core/Trendy-Eintrag lädt, wird dessen JSON-State direkt in den Custom Builder geladen. Der User kann dann **editieren** — es gibt keinen Unterschied zwischen "geladenes Preset" und "custom gebaut", außer dass Signature-Einträge einen dezenten Hinweis anzeigen "originaler Jonas-Prompt, Änderungen auf eigene Faust".

### 9.4 Copy-Output
Ein Button: "Copy JSON". Produziert paste-ready JSON-Text den der User direkt in NanoBanana, Grok Imagine, ChatGPT oder sein NanoBanana-System-Prompt-Setup pasten kann. Kein Auto-Submit. Ein zusätzlicher Paragraph-Copy-Button ist **nicht** im MVP (siehe §15 Item 2); wenn später ein Use Case auftaucht, wird er als sekundärer Button nachgezogen ohne den Default zu verändern.

---

## 10. Live Visual Preview — SVG-Dummies mit Panel-Rollen

Der Live Visual Preview ist der Unterschied zwischen "leere Grid-Boxen mit Text drin" und "ich sehe sofort was der Prompt produzieren wird". Er ist **nicht** ein echtes gerendertes Preview — wir rendern nicht mit NanoBanana im Voraus. Er ist ein **stilisiertes SVG-Schema** pro Panel-Rolle.

### 10.1 Panel-Role-Maps
Jeder Case definiert eine **Panel-Role-Map**: eine Funktion die einem Panel-Role-Identifier ein SVG-Template zuordnet.
- `character_angle_study`:
  - `front` → Dummy-Figur frontal
  - `right_profile` → Dummy-Figur im Rechts-Profil
  - `left_profile` → Dummy-Figur im Links-Profil
  - `back` → Dummy-Figur von hinten
  - `front_right`, `front_left`, `back_right`, `back_left` → Zwischen-Winkel
- `shot_coverage`:
  - `wide` → Kleine Figur in weiter Umgebung
  - `medium` → Mittlere Figur, halbe Umgebung
  - `close_up` → Großes Gesicht, Hintergrund unscharf
  - `detail` → Detail-Element (Hand, Auge, Objekt)
- `world_zone_board`:
  - Einzel-Zonen als leere Raum-Dummies mit Richtungs-Indikator
- `start_end_frame`:
  - Start-Pose + End-Pose (ggf. visuell leicht unterschiedlich animiert)
- `story_sequence`:
  - Pose/Expression-Slots

### 10.2 Fallback für Freitext-Anpassungen
Wenn der User Panel-Rollen freitextlich überschreibt (z.B. "Panel 2 soll ein Low-Angle sein statt Right Profile"), kann die SVG-Map das nicht mehr 1:1 darstellen. Dann zeigt das Preview-Panel einen **Text-Badge** mit der Rolle und einem generischen Dummy. Kein Abstürzen, kein Fehler — nur Fallback-Darstellung.

### 10.3 Stil-Vorgaben
- **Monochrom**, dezent, passt zum cinematic dark theme
- Dummies sind **nicht** Anime, nicht Disney — eher Schnittmuster-Figuren mit klarer Silhouette
- SVG inline, nicht extern geladen
- Responsiv, skaliert mit der Preview-Box

---

## 11. Look Lab Integration

**Look Lab (NanoBanana Studio) ist bereits gebaut** und liegt im Pre-Pivot Baseline. Es ist Jonas' Spielwiese wo er in NanoBanana Styles/Looks entdeckt und als Text-Token speichert. Der Custom Builder integriert Look Lab **als Style-Quelle**, nicht umgekehrt.

### 11.1 Phase 1 — Text-Token
- Look Lab hat gespeicherte Styles als `{ id, label, text_token }`.
- Der Custom Builder lädt diese Liste (read-only aus dem Look-Lab-State oder aus einer gemeinsamen Datenquelle).
- Im Custom Builder erscheint ein "Style Overlay"-Modul. Beim Aktivieren kann der User aus der Look-Lab-Liste wählen.
- Das gewählte `text_token` wird in den Compile-Flow eingefügt als zusätzliches Feld im `style_overlay`-Block.
- Der JSON-Serializer fügt es als `style_overlay.text_token` Feld in den Output ein, in der durch die Compile-Order definierten Position (typischerweise nach `style`, vor `pose`).

### 11.2 Phase 2 — Image Reference
- Look Lab speichert zusätzlich Style-Referenzbilder.
- Der Custom Builder kann diese als `image_reference` in den `style_overlay`-Block einsetzen.
- Payload-Handling entspricht 8.7 (Reference-Image-Payloads).
- **Nicht im MVP**, explizit Phase 2.

### 11.3 Koppelungs-Grenze
Look Lab wird **nicht** vom Custom Builder modifiziert. Der Custom Builder **liest** aus Look Lab, schreibt aber nicht zurück. Das hält die beiden Module entkoppelt.

---

## 12. Empirische Validierung — Was am 2026-04-15 getestet wurde

1. **Step 2 Angle Study Paragraph-Prompt** (Quelle: `DISTILLATIONS/character-study-chatgpt-groundtruth.md`) wurde in NanoBanana getestet und produziert den erwarteten 4-Panel-Strip mit sauberer Consistency über alle vier Views. Ground Truth.
2. **Step 2 JSON-Equivalent** (Quelle: `DISTILLATIONS/angle-study-json-example.md`, ChatGPT-Übersetzung ohne Projektkontext) wurde wortwörtlich in NanoBanana als Prompt gepastet. Ergebnis: **1:1 das gleiche Bild** wie der Paragraph-GT. Beweis dass JSON als NanoBanana-Input funktioniert.
3. **Step 1 Normalizer Paragraph-Prompt** (Quelle: gleiche GT-Datei) wurde in NanoBanana getestet und produziert ein canonical full-body aus einem gecroppten Referenzbild. Ground Truth.
4. **Step 1 JSON-Equivalent** (Quelle: `DISTILLATIONS/character-normalizer-json-example.md`) wurde wortwörtlich in NanoBanana als Prompt gepastet. Ergebnis laut Jonas: **sauberer und besser als der Paragraph-GT**. Beweis dass JSON bei Constraint-schweren Cases empirisch präziser arbeitet.

**Folgerung:** Die JSON-State + Compiler Architektur ist nicht spekulativ, sondern auf empirischen Tests gestützt. Der Neubau geht nicht ins Blaue.

---

## 13. Was beim alten Ansatz nicht funktioniert hat

Kurz-Diagnose damit nachfolgende Chats nicht die gleichen Fehler wiederholen:

1. **Pilot-Ansatz hat Sackgassen produziert.** Pilot 1 (Character Study) lief, Pilot 2 (Char+World Merge) ist empirisch tot. Pilot 3-8 hingen am Pilot-2-Erfolg ab. Die Pilot-Reihenfolge war keine Priorisierung nach Wert, sondern nach Kategorie — mit fatalem Abbruch bei Pilot 2.
2. **Der Renderer war nicht in der UI eingehängt.** `src/lib/skeletonRenderer.js` hatte 878 Zeilen Code, 4 Skeletons, 11 Module, 10 Golden-Dateien — und war in `src/App.jsx`/`GridOperator.jsx` nirgendwo importiert. Zwei Wochen Arbeit an Code ohne UI-Konsument.
3. **String-Templates mit 21 Slots waren brüchig.** Die "byte-exact contract"-Regel hat bei jedem Golden-Update zu Drift geführt. Jonas hat die finalen Prompts manuell verifizieren müssen.
4. **Branch-Chaos hat Kontext zerstört.** Jeder Chat hat einen neuen `claude/…`-Branch gemacht, alte CLAUDE.md-Versionen gelesen, falsche Goldens gerendert, unmerged states hinterlassen.
5. **Die CLAUDE.md war zu groß zum Lesen.** 32 KB mit 6 Drift-Regeln, Pilot-Workflow, GT-First-Zeremonie, Pre-Pivot-Block, Status-Header → ein neuer Chat hat nicht alles gelesen, hat dann Annahmen erfunden.

**Strukturelle Fixes im Rebuild:**
- Grid Creator als einziger Refactor-Scope, Pre-Pivot Baseline unberührt
- UI-First: der Compiler wird **gleichzeitig mit** dem Custom Builder gebaut, kein orphaner Renderer
- JSON-State statt String-Slots → der Compiler ist datengetrieben, keine Byte-exact-Verträge
- Direkt auf main, keine Feature-Branches
- Drei-Datei-Hierarchie (CLAUDE.md + BUILD_PLAN.md + SESSION_LOG.md) als verbindliches Session-Start-Protokoll
- Rendered-Output-Review vor jedem Prompt-Inhalt-Commit (Jonas-OK per Chat)

---

## 14. Build Slices — Wie der Neubau in Etappen läuft

Der Rebuild wird in acht kleinen Slices gebaut, jeder mit klarem Done-Kriterium. Kein Slice wird begonnen bevor der vorherige in der UI funktioniert. **UI-First-Regel:** jeder Slice muss einen sichtbaren UI-Effekt haben oder er zählt nicht.

### Slice 1 — Schema-Fundament (Character Angle Study)
- **Ziel:** JSON-Schema-Definition für `character_angle_study` `v1`, inklusive Modul-Enabled-Flags, Panel-Role-Strategy für 3/4/6/8 Panels, Forbiddens-Merge-Logik, Schema-Version-Feld. Das Schema muss die vier Struktur-Prinzipien aus §5.4 abbilden: explizite `priority`/`authority_over`-Felder, Booleans für harte Regeln, Arrays für Listen, deklarierte Compile-Order.
- **Artefakte:** `src/lib/cases/characterAngleStudy/schema.js`, `src/lib/cases/characterAngleStudy/panelRoleStrategy.js`, `src/lib/cases/characterAngleStudy/defaults.js`.
- **Done:** Unit-Test der aus einem minimalen State einen gültigen, schema-validen JSON-State produziert und gegen den empirisch validierten JSON aus `DISTILLATIONS/angle-study-json-example.md` diff-bar ist (modulo `enabled`-Flags und Panel-Role-Ableitung).

### Slice 2 — Compiler MVP (JSON-Serializer)
- **Ziel:** Compiler der einen `character_angle_study` State in einen JSON-Prompt-Output umwandelt — mit stabiler Compile-Order, Forbiddens-Merge, Entfernung interner State-Felder (`enabled: false`-Blöcke, `schema_version`, Quellen-Metadaten) und deterministischem Key-Ordering.
- **Artefakte:** `src/lib/compiler/index.js`, `src/lib/compiler/serializers/json.js`.
- **Done:** Der JSON-Output für den Default-4-Panel-State matched `DISTILLATIONS/angle-study-json-example.md` strukturell (modulo die sieben Schema-Lücken-Erweiterungen aus §8 — z.B. neue Panel-Role-Strategy-Ableitung, `enabled`-Flags-Bereinigung). Zwei identische States erzeugen byte-identische Outputs.
- **Jonas-OK-Gate:** Der gerenderte JSON-Output wird im Chat gepostet und muss explizit von Jonas in NanoBanana getestet und abgenickt werden bevor irgendetwas committet wird. Das ist der erste echte Live-Bench des Compilers gegen das bereits validierte Test-JSON.

### Slice 3 — Live Reactive UI Shell
- **Ziel:** Der Custom-Builder-Tab im Grid Creator zeigt: Case-Dropdown (nur `character_angle_study` bisher), Rows/Cols/Orientation-Picker, Live-JSON-Prompt-Output, Copy-JSON-Button. Kein Module-Panel, kein Visual Preview.
- **Artefakte:** `src/components/GridOperator/CustomBuilder.jsx` (neu), State-Hook, Copy-Button.
- **Done:** User kann im Browser den Custom-Builder-Tab öffnen, Panel-Count ändern (3/4/6/8), den live aktualisierten JSON-Output sehen und per Klick kopieren. Output stimmt mit Slice 2 überein.

### Slice 4 — Erstes Modul: Face Reference
- **Ziel:** Face-Reference-Modul mit `enabled`-Flag. Aktivieren fügt `references.face_reference` in den State ein, Deaktivieren entfernt es.
- **Artefakte:** `src/lib/cases/characterAngleStudy/modules/faceReference.js`, UI-Checkbox im Module-Panel.
- **Done:** User kann im UI Face Reference an/aus togglen, der Prompt-Output passt sich live an. Jonas-OK-Gate für den modifizierten Prompt-Text.

### Slice 5 — Zweites Modul: Environment mit Modi
- **Ziel:** Environment-Modul mit `mode`-Feld (`inherit_from_reference | neutral_studio | custom_text`). UI-Select, State-Integration, Compiler-Unterstützung für alle drei Modi.
- **Artefakte:** `src/lib/cases/characterAngleStudy/modules/environment.js`, UI-Select, drei Compile-Pfade im JSON-Serializer (einer pro Modus — `inherit` entfernt den `environment`-Block komplett, `neutral_studio` setzt einen expliziten Studio-Backdrop-Block, `custom_text` emittiert den User-Text in einem dafür vorgesehenen Feld).
- **Done:** Alle drei Modi produzieren sinnvolle Prompt-Varianten. Jonas testet alle drei in NanoBanana und gibt OK.

### Slice 6 — Live Visual Preview (SVG-Dummies)
- **Ziel:** SVG-basiertes Visual Preview Panel im Custom Builder das für `character_angle_study` die Panel-Rollen visuell anzeigt. Fallback-Dummy wenn Rolle unbekannt.
- **Artefakte:** `src/components/GridOperator/VisualPreview.jsx`, `src/lib/visualPreview/dummies/character.js` (SVG-Templates).
- **Done:** User sieht beim Umschalten von 4 auf 6 Panels die SVG-Map sich live aktualisieren. Jede Panel-Rolle hat ein eigenes SVG.

### Slice 7 — Look Lab Integration (Text-Token)
- **Ziel:** Style-Overlay-Modul das Text-Token aus Look Lab lädt und in den State einfügt.
- **Artefakte:** `src/lib/cases/characterAngleStudy/modules/styleOverlay.js`, Look-Lab-Read-Adapter, UI-Dropdown mit Look-Lab-Einträgen.
- **Done:** User wählt aus Look Lab einen Text-Token, sieht ihn im Prompt-Output erscheinen. Phase-2-Image-Reference ausdrücklich **nicht** Teil dieses Slices.

### Slice 8 — Normalizer Two-Step Flow
- **Ziel:** Character-Study-Normalizer als optionaler Pre-Step. User wählt `clean_full_body` oder `needs_normalization`. Im zweiten Fall wird Step 1 als eigener Prompt-Output angeboten, parallel zum Step-2-Prompt.
- **Artefakte:** `src/lib/cases/characterAngleStudy/normalizerFlow.js`, UI-Toggle, zwei Prompt-Output-Bereiche wenn normalizer aktiv.
- **Done:** User kann beide Pfade in NanoBanana testen. Step 1 matched `DISTILLATIONS/character-normalizer-json-example.md` strukturell. Jonas-OK-Gate.

### Was nach Slice 8 kommt (nicht im Scope dieses Plans)
- Weitere Cases (`start_end_frame`, `world_zone_board`, `shot_coverage`, `story_sequence`) — jeder kriegt sein eigenes Schema + Panel-Role-Strategy + Module-Liste.
- Tier 1 Signature Content (Jonas kuratiert die echten Signature-Einträge).
- Tier 3 Trendy-Community-Analyse.
- `GridOperator.jsx` Umbau: die alten 18 statischen Preset-JSONs werden durch die neue Engine ersetzt. Das ist ein **isolierter** Umbau, nicht Teil der Slices 1-8 weil die neue Engine unabhängig existieren soll.

---

## 15. Offene Entscheidungen

Punkte die im Chat aufgekommen sind und **noch nicht entschieden** sind. Jeder neue Chat muss diese lesen und **nicht selbst entscheiden** — Jonas entscheidet.

1. **Panel-Order-Konvention bei 6/8 Panels.** Für 4 ist es klar (Front/R/L/Back). Für 6 und 8 ist die optimale Reihenfolge empirisch zu testen. Erste Idee: 6 = Front/FR/R/Back/L/FL, 8 = volle 45°-Rotation. Muss Jonas in NanoBanana testen.
2. **Default Serializer.** ✅ ENTSCHIEDEN (2026-04-15 spätabends, korrigiert auf Basis zusätzlicher Jonas-Tests): **JSON-only im MVP.** Kein Paragraph-Serializer im ersten Release. Begründung: Jonas hat nach dem ersten Test weitere Prompts im strukturierten JSON-Format getestet und berichtet empirisch dass JSON "deutlich sauberer und konstanter" in NanoBanana performt als die Paragraph-Varianten. Plus transportable Vorteile — das gleiche JSON ist auch für Grok Imagine und vermutlich weitere strukturschwache Prompt-Interfaces direkt verwendbar, ohne Umformatierung. Ein Paragraph-Serializer ist YAGNI solange kein realer Use Case dafür auftaucht; wenn er irgendwann gebaut wird, kommt er als **sekundärer** Toggle-Button neben dem Default JSON, nicht als gleichberechtigter Zweitweg. Die Struktur-Einsicht aus §5.4 bleibt trotzdem relevant — sie prägt jetzt das Schema-Design in Slice 1 und das Serializer-Verhalten in Slice 2, nicht mehr einen Paragraph-vs-JSON-Bench.
3. **Signature-Content.** Welche konkreten Sheets werden Tier 1 im MVP? Jonas hat einen Pool — die Auswahl kommt separat.
4. **Tier 3 Scope im MVP.** Wird Tier 3 überhaupt im ersten Release gebaut oder später nachgezogen? Mein Vorschlag: später. Entscheidung offen.
5. **Look Lab State-Format.** Wie genau sieht der Read-Adapter zu Look Lab aus — direkter State-Import oder gemeinsame Datenquelle? Abhängig vom aktuellen Look-Lab-Code, muss bei Slice 7 geklärt werden.
6. **Schema-Versionierungs-Strategie.** ✅ ENTSCHIEDEN (2026-04-15 abends): **Simpler Counter** (`v1`, `v2`, `v3`…) als `schema_version`-Feld am Root jedes Case-Schemas. Begründung: Solo-Tool ohne öffentliche API, keine Überkomplikation durch Semver nötig. Breaking Change = Bump um 1. Migration-Funktion-Signatur (`migrate(oldState, fromVersion, toVersion)`) wird beim ersten tatsächlichen Versions-Bump festgelegt, nicht prospektiv.
7. **`GridOperator.jsx` Umbau-Zeitpunkt.** Wird der alte Preset-Loader beibehalten bis Core-Tab komplett ist, oder parallel ersetzt? Vorschlag: parallel halten, wenn Custom Builder stabil ist, Core-Tab umstellen, dann Preset-Loader entfernen. Entscheidung offen.
8. **Jonas-OK-Gate Mechanik.** Der Chat postet den gerenderten Prompt, Jonas antwortet "ja"/"nein". Was passiert bei "nein"? Rollback auf vorherigen bekannten guten State? Fix-Iteration ohne Commit? → Praxis zeigen.

---

## 16. Done-Definition für den MVP

Der MVP ist fertig wenn **alle** folgenden Punkte erfüllt sind:

1. Custom Builder Tab funktioniert für `character_angle_study` mit 3/4/6/8 Panels.
2. Der JSON-Serializer produziert paste-ready, deterministisches, strukturell sauberes JSON-Output.
3. Mindestens 3 Module sind integriert: Face Reference, Environment (3 Modi), Style Overlay (Text-Token).
4. Live Visual Preview zeigt SVG-Dummies für alle Angle-Study-Rollen.
5. Normalizer-Two-Step-Flow ist integriert und getestet.
6. Alle gerenderten Outputs sind von Jonas in NanoBanana validiert worden.
7. Die drei Koordinations-Dateien (CLAUDE.md, BUILD_PLAN.md, SESSION_LOG.md) sind aktuell gehalten.
8. `GridOperator.jsx` bleibt für die anderen Tabs funktional (nicht kaputt gemacht durch den Rebuild).

**Was der MVP explizit nicht tut:**
- Andere Cases als Character Study (kommen nach Slice 8)
- Image-Reference-Payloads (Phase 2)
- Tier 3 Trendy-Content (später)
- Automatisierte NanoBanana-Submit (nie)
- Video-Prompt-Cases (nie)

---

## 17. Querverweise

- **CLAUDE.md** — Projekt-Übersicht, Branch-Regel, Architektur-Grundsätze, Session-Start-Protokoll
- **SESSION_LOG.md** — Chronologisches Log aller Sessions, aktueller Stand, nächster Schritt
- **DISTILLATIONS/character-study-chatgpt-groundtruth.md** — Wortwörtlicher Paragraph-GT für Step 1 + Step 2, unveränderlich
- **DISTILLATIONS/angle-study-json-example.md** — Empirisch validiertes JSON für Step 2, Ausgangspunkt Schema
- **DISTILLATIONS/character-normalizer-json-example.md** — Empirisch validiertes JSON für Step 1, Ausgangspunkt Schema
- **DISTILLATIONS/archive/character-study-phase5-notes.md** — Alte Phase-5-Distillation (nicht aktuell, nur Referenz)
- **`src/components/GridOperator.jsx`** — Aktueller Grid-Creator der beim Rebuild auf die neue Engine umgestellt wird
- **`src/App.jsx`** — Pre-Pivot Baseline, nicht anfassen

