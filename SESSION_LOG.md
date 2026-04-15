# SESSION_LOG.md — SeenGrid

Chronologisches Log aller Arbeits-Sessions am SeenGrid-Rebuild. **Jeder neue Chat** liest diese Datei beim Start (als drittes Dokument nach CLAUDE.md und BUILD_PLAN.md) und fügt am Ende der Session einen neuen Eintrag hinzu.

**Format pro Eintrag:**
- Datum (ISO)
- Teilnehmer (Jonas + Chat-Identifier wenn hilfreich)
- Was gemacht wurde (knappe Bulletpoints)
- Jonas-OK-Gates falls relevant
- Aktueller Stand am Ende der Session
- Nächster Schritt für den darauffolgenden Chat

**Regeln:**
- Nur **was gemacht wurde**, nicht was vielleicht mal gemacht werden soll (das gehört in BUILD_PLAN.md)
- Keine nachträglichen Edits alter Einträge (außer offensichtliche Tippfehler) — das Log ist historisch
- Neueste Einträge oben

---

## 2026-04-15 — Hard Reset, Rebuild-Plan

**Teilnehmer:** Jonas + Claude Opus 4.6 Chat

### Kontext vor der Session
- Zwei Wochen Phase-5-Arbeit am Character-Study-Renderer (`src/lib/skeletonRenderer.js`, 878 Zeilen, 4 Skeletons, 11 Module, 10 Golden-Dateien, 1 Test-File).
- Der Renderer war **nirgendwo in der UI eingehängt** — `GridOperator.jsx` lädt weiterhin die alten 18 statischen Preset-JSONs direkt.
- Pilot 2 (Character + World Merge) empirisch tot in NanoBanana: slop faces, falsche Proportionen, Identitätsdrift bei jedem Test.
- Branch-Chaos: Jeder neue Chat hat automatisch einen neuen `claude/…`-Branch aufgemacht, veraltete Stände gelesen, Drift produziert.
- CLAUDE.md war ~33 KB mit 6 Drift-Regeln, Pilot-Workflow, GT-First-Zeremonie — zu groß zum Lesen, hat zu eigenmächtigen Interpretationen geführt.
- Jonas seit 2-3 Tagen hauptsächlich damit beschäftigt Chats im Kontext zu halten statt zu bauen. Kognitive Überlastung.

### Was in der Session passierte

1. **Brutale Bestandsaufnahme.** Jonas hat eine ehrliche Einschätzung verlangt ob der Rebuild überhaupt noch Sinn macht. Claude hat bestätigt: das Konzept ist tragfähig, der Ausführungsweg war kaputt (overengineering + Pilot-Reihenfolge + orphaner Renderer). Nicht das Ziel ist falsch, sondern die Struktur drumherum.

2. **Vision des Grid Creators geschärft.** Jonas hat klargemacht dass der Grid Creator **keine Sheet-Galerie** ist, sondern eine **echte modulare Engine** mit vier Tiers (Signature / Core / Trendy / Custom Builder) und dass der Custom Builder **live reaktiv** sein muss (jeder Klick ändert den Prompt in Echtzeit). Panel-Orientierung (vertical/horizontal) als eigene Dimension neben Rows×Cols. Live SVG-Preview mit stilisierten Dummy-Figuren parallel zum Prompt.

3. **JSON-Durchbruch.** Jonas hat den wortwörtlich validierten Paragraph-Prompt aus `DISTILLATIONS/character-study-chatgpt-groundtruth.md` Step 2 von ChatGPT in ein strukturiertes JSON übersetzen lassen (ohne Projektkontext). Er hat dieses JSON **wortwörtlich in NanoBanana gepastet** und bekam **1:1 das gleiche Bild** wie mit dem Paragraph-GT. Danach hat er den Step-1-Normalizer genauso übersetzt und getestet — Ergebnis **sauberer als der Paragraph-GT**.

   **Folgerung:** NanoBanana akzeptiert strukturiertes JSON als Prompt-Input direkt und reagiert darauf bei Constraint-schweren Cases empirisch **präziser**. Das validiert die JSON-State + Compiler Architektur nicht spekulativ sondern auf echten Tests.

4. **Architektur-Entscheidung.** Die neue Architektur heißt **`UI State → Case-Schema-Validator → Serializer(s) → Output(s)`**. Der Custom Builder hält seinen Zustand als strukturiertes JSON-Objekt (nicht als String-Template-Fragmente), aus dem ein Compiler zwei Output-Formen erzeugt: Paragraph-Prompt **oder** JSON-Prompt.

5. **Constrained Modularity.** Claude hatte initial "Modularität ist eine Fiktion" geschrieben — Jonas hat korrigiert zu **constrained modularity**: nicht jedes Modul kombiniert mit jedem Case, der Compiler iteriert **pro Case** über eine bekannte Feld-Menge mit fester Compile-Order. Jonas' Sheets sind empirisch getestete Konstellationen, keine Lego-Steine.

6. **Sieben Schema-Lücken identifiziert** im von ChatGPT produzierten JSON die der Neubau schließen muss:
   1. Panel-Daten hardcoded → Panel-Role-Strategy pro Case
   2. Keine `enabled: true/false` Modul-Flags
   3. Keine Look-Lab-Style-Integration
   4. Forbiddens als flache Liste statt Case/Modul/User-Merge
   5. Keine Schema-Versionierung
   6. Environment unterspezifiziert (braucht Modi)
   7. Reference-Image-Payloads fehlen

7. **Surgical Purge.** Jonas hat Option B (chirurgisch, kein Hard Revert) gewählt. Folgende Dateien wurden gelöscht/verschoben:
   - **Gelöscht:** `src/lib/skeletonRenderer.js`, `src/data/skeletons/` (4 Dateien), `src/data/modules/character-study/` (11 Dateien), `tests/` komplett (1 Test-File + 10 Goldens), `MODULAR_GRID_ARCHITECTURE.md`, `OPUS_CODE_HANDOFF.md`, `PHASE1_STATUS.md`, `ROADMAP.md`.
   - **Verschoben:** `DISTILLATIONS/character-study.md` → `DISTILLATIONS/archive/character-study-phase5-notes.md` (alte Phase-5-Distillation als Referenz behalten).
   - **Neu angelegt:** `DISTILLATIONS/angle-study-json-example.md` (empirisch validiertes JSON für Step 2), `DISTILLATIONS/character-normalizer-json-example.md` (empirisch validiertes JSON für Step 1).
   - **Preserved unberührt:** Die gesamte Pre-Pivot Baseline — Prompt Builder, MJ Cinematic Builder, Prompt Vault, Look Lab, Design System, `src/App.jsx`, `src/components/` (die vier sichtbaren Module), `src/data/` (chips, i18n, mj, random, presets, styles), `src/context/`, `src/hooks/`, `src/styles/`, `design-spec/`, `public/`, `popup.*`, `index.html`, `package.json`, `vite.config.js`, `DeepSeek1.txt`, `SEENGRID_STRATEGY_AND_FUTURE_VISION_BRIEFING.txt`, `SeenGrid_grundgeruest_fuer_claude.md`, `README.md`.

   Der Purge wurde vor dem Write geprüft: `skeletonRenderer.js` ist in `src/App.jsx` und `src/components/GridOperator.jsx` **nicht** importiert (via Grep verifiziert), also 100% safe — kein UI-Regressions-Risiko.

8. **Neue CLAUDE.md geschrieben.** ~150 Zeilen statt 32 KB. Enthält: Session-Start-Protokoll (drei Dateien in fester Reihenfolge lesen), was SeenGrid ist, Nutzer-Beschreibung, Grid-Creator-Tiers, fünf Architektur-Grundsätze (JSON-State + Compiler, Constrained Modularity, Look Lab als Style-Quelle, Live Visual Preview, Offen & erweiterbar), Branch-Regel (direkt auf main), Pre-Pivot Baseline Liste, was explizit NICHT gebaut wird, Datenquellen, Tech Stack, drei simple Anti-Drift-Regeln (direkt auf main + drei-Datei-Hierarchie + Rendered-Output-Review vor Commit). Die alten 6 Drift-Regeln + GT-First-Pilot-Workflow sind absichtlich **nicht mehr drin**.

9. **BUILD_PLAN.md geschrieben** (neu, erster Wurf). Enthält alle Details aus dem Chat damit kein späterer Chat sie rekonstruieren muss: Warum Rebuild, Mission, Grid Creator 4 Tiers, Custom Builder Beschreibung, JSON-State + Compiler Architektur mit den beiden empirischen Tests, Constrained Modularity Erklärung inklusive Claudes Korrektur seines eigenen falschen Framings, Case-Liste ohne Char+World Merge, die sieben Schema-Lücken mit Fix-Vorschlägen, Live Reactive UI Layout-Skizze, Live Visual Preview mit Panel-Role-Maps pro Case, Look Lab Integration Phase 1 (Text-Token) und Phase 2 (Image Reference), empirische Validierungs-Dokumentation, Was am alten Ansatz nicht funktioniert hat, acht Build Slices mit Done-Kriterien pro Slice, offene Entscheidungen die Jonas noch treffen muss, MVP Done-Definition.

10. **SESSION_LOG.md geschrieben** (diese Datei, erster Eintrag).

### Jonas-OK-Gates in dieser Session
Keine Prompt-Inhalt-Commits in dieser Session — die neue Anti-Drift-Regel (Rendered-Output-Review vor Commit) greift ab Slice 1 des Rebuilds. Diese Session hat **nur Struktur-Arbeit** gemacht (Purge, Docs schreiben, Schema-Beispiele ablegen), keinen neuen Prompt-Inhalt produziert.

### Stand am Ende der Session
- Branch: `claude/review-claude-md-8lhG6` (wird von Jonas morgen manuell nach main gemerged, **nicht** in dieser Session gemerged)
- Purge vollständig committet und gepusht (am Ende dieser Session)
- Drei Koordinations-Dateien vorhanden: CLAUDE.md (neu), BUILD_PLAN.md (neu), SESSION_LOG.md (neu)
- Zwei JSON-Beispiele als empirisch validierte Ausgangspunkte in DISTILLATIONS
- Pre-Pivot Baseline unberührt, Build sollte weiterhin funktionieren (nicht verifiziert in dieser Session — `npm run dev` nicht gestartet)
- Keine offenen Merge-Konflikte, kein unfertiger Code im Repo

### Nächster Schritt (für den Chat der morgen startet)
1. Jonas mergt `claude/review-claude-md-8lhG6` manuell nach main (nicht durch Chat).
2. Neuer Chat startet auf main, liest CLAUDE.md → BUILD_PLAN.md → SESSION_LOG.md in dieser Reihenfolge.
3. **Erster Arbeits-Slice:** Slice 1 aus BUILD_PLAN.md Abschnitt 14 — Schema-Fundament für `character_angle_study`. Konkrete erste Aktion: `src/lib/cases/characterAngleStudy/schema.js` anlegen, basierend auf `DISTILLATIONS/angle-study-json-example.md` + die sieben Schema-Lücken aus BUILD_PLAN.md Abschnitt 8.
4. **Vor dem ersten Compiler-Output** (Slice 2): Jonas-OK-Gate greifen. Der gerenderte Paragraph-Output wird im Chat gepostet, Jonas muss explizit "ja" sagen bevor committet wird.
5. **Offene Entscheidungen** aus BUILD_PLAN.md Abschnitt 15 nicht selbst entscheiden — Jonas fragen wenn sie relevant werden.

### Notizen für den nächsten Chat
- Der Custom Builder wird **parallel zum alten GridOperator.jsx** gebaut. Der alte Preset-Loader bleibt bestehen bis Core-Tab komplett ist. Nicht gleich beim ersten Slice `GridOperator.jsx` kaputt schrauben.
- Der Rendered-Output-Review ist der **einzige** verbliebene Drift-Schutz für Prompt-Inhalt. Kein Chat committet Prompt-Inhalt ohne Jonas-OK im Chat. Das ist keine Empfehlung, das ist Pflicht.
- `DISTILLATIONS/character-study-chatgpt-groundtruth.md` ist **locked**. Wortwörtlich wie Jonas ihn validiert hat. Keine Reformulierung, keine Kürzung, keine "Optimierung". Änderungen nur nach neuem NanoBanana-Gegentest und nur durch Jonas selbst.
- Die zwei JSON-Beispiele (`angle-study-json-example.md`, `character-normalizer-json-example.md`) sind **Proof of Concept, kein finales Schema**. Der Neubau entwickelt sein eigenes Schema aus diesen Starts **plus** den sieben dokumentierten Lücken. Nicht 1:1 übernehmen.

### Nachtrag am selben Abend (2026-04-15 spätabends)

Nach dem Purge-Commit und dem Merge auf main kamen im gleichen Chat noch drei Dinge dazu die hier festgehalten werden müssen:

1. **Merge-Drama aufgelöst.** Beim Versuch den Feature-Branch `claude/review-claude-md-8lhG6` per Terminal nach main zu mergen sah es kurz so aus als gäbe es "zwei parallele mains" (lokaler Sandbox-main und echter GitHub-main divergent). Nach genauer Prüfung stellte sich heraus: der Sandbox-local-main war ein **veralteter Fossil-Stand** (die aktuellen UX-Polish-Arbeiten — erweiterte GridOperator/MJStartframe, random-pools statt random-scenes, aktualisierte Chip-Daten — lagen bereits auf origin/main vom Jonas-Desktop-Chat der zwischendurch gearbeitet hatte). Kein tatsächlicher Konflikt, der GitHub-main war strikt weiter als der lokale Sandbox. Jonas hat bestätigt dass er auf dem Desktop weitergearbeitet hatte. Ergebnis: Fast-Forward-Merge von `claude/review-claude-md-8lhG6` in den **echten** origin/main, lokaler Sandbox danach per `git fetch + reset --hard origin/main` auf den aktuellen Stand gebracht. Jonas hat auf seinem Desktop `git pull` laufen lassen, `npm run dev` bestätigt funktionsfähig, Purge ist live.

2. **Zwei offene Mikro-Entscheidungen aus BUILD_PLAN §15 sind jetzt entschieden** (Jonas wollte explizit nicht selbst in Tech-Details eintauchen, hat den Chat entscheiden lassen mit sinnvollen Defaults):
   - **§15 Item 2 — Default Serializer:** **Paragraph** ist Default-Output-Mode im Custom Builder. JSON per Toggle einen Klick weit weg. Begründung: gewohntes Format, nativer Look für die meisten Community-Prompts. Caveat: der Paragraph-Serializer wird gegen den JSON-Serializer empirisch gebencht (siehe Punkt 3 unten).
   - **§15 Item 6 — Schema-Versionierung:** **Simpler Counter** (`v1`, `v2`, `v3`) als `schema_version`-Feld am Root jedes Case-Schemas. Kein Semver, keine Überkomplikation für ein Solo-Tool ohne öffentliche API. Migration-Signatur wird beim ersten echten Versions-Bump festgelegt, nicht prospektiv.

3. **Wichtige Nuance zur JSON-Schema-Einsicht (neu in BUILD_PLAN §5.4 eingepflegt).** Jonas hat nach den initialen zwei Tests (Angle Study + Normalizer) **weitere Prompts** im strukturierten Format in NanoBanana getestet und berichtet: sie funktionieren **sogar noch besser** als die unstrukturierten Paragraph-Varianten. ChatGPT hat dazu einen wichtigen Hinweis gegeben den wir nicht als "aufgeblähten Fingerzeig" abtun sollten: **Der Qualitätsgewinn kommt nicht vom JSON-Format an sich, sondern von der Strukturierung und den klaren Prioritäten die das JSON-Format erzwingt** (Hierarchien, `priority`/`authority_over`-Felder, harte Trennung Constraints vs. Präferenzen, atomare Listen statt Fließtext). Konsequenz: Der Paragraph-Serializer darf nicht verwässern — harte Regeln bleiben harte Regeln, Listen bleiben Listen, Reihenfolge bleibt Priorität. Ab Slice 2 wird der Paragraph-Serializer gegen den JSON-Serializer **empirisch gebencht**; wenn Paragraph schlechter performt, ist der Serializer kaputt und muss strukturtreuer werden. Das ist jetzt Teil des Rebuild-Plans und nicht mehr nur eine Randnotiz. Siehe BUILD_PLAN.md §5.4 für den vollständigen Wortlaut.

### Frage-Klärungen die Jonas in dieser Late-Night-Phase hatte

- **"Muss ich jetzt nie wieder merge main machen?"** → **Ja, nie wieder.** Die Branch-Regel ist jetzt "direkt auf main". Keine Feature-Branches mehr, kein Merge-Schritt. Jeder Chat arbeitet direkt auf main, committet und pusht direkt. Der Merge-Schritt existiert in diesem Workflow nicht mehr. Dieser Nachtrag-Commit ist der **letzte** Merge-Commit den Jonas je machen musste — und auch der wurde vom Chat durchgeführt, nicht von Jonas selbst.
- **"Drifterei — hört das jetzt auf?"** → Ja, unter drei Bedingungen: (1) jeder Chat liest CLAUDE.md → BUILD_PLAN.md → SESSION_LOG.md beim Start, (2) jeder Chat aktualisiert SESSION_LOG.md am Ende, (3) kein Chat committet Prompt-Inhalt ohne Rendered-Output-Review + Jonas-OK im Chat. Die drei Bedingungen sind in CLAUDE.md festgeschrieben.
- **"Morgen neuer Chat, und der weiß sofort was Sache ist?"** → Ja. Der nächste Chat startet auf main, liest die drei Dateien, und beginnt mit Slice 1 aus BUILD_PLAN §14. Jonas muss nicht mehr erklären — der Plan erklärt sich selbst.

### Zusätzliche Notiz für den nächsten Chat (Slice 1 + Struktur-Hinweis)

Beim Implementieren von Slice 1 (Schema-Fundament `character_angle_study`) und insbesondere Slice 2 (Compiler) ist §5.4 aus BUILD_PLAN.md Pflichtlektüre. Die Schema-Felder sollen so gestaltet sein dass sie **explizit Prioritäten und Constraints-vs-Präferenzen kodieren** — nicht einfach flache Key-Value-Pairs. Der JSON-Serializer muss diese Struktur deterministisch und mit stabiler Key-Order in den Output bringen (Booleans bleiben Booleans, Arrays bleiben Arrays, Prioritäten bleiben wörtlich erhalten).

### Zweiter Nachtrag (2026-04-15 tief nachts) — Kurskorrektur auf JSON-only

Jonas hat eine wichtige empirische Korrektur an der Serializer-Default-Entscheidung gemacht. Der Stand nach dem ersten Nachtrag war: Paragraph als Default, JSON als Toggle, Bench-Pflicht Paragraph-vs-JSON. Dieser Stand war aus einem "sensible default"-Gedanken des Chats heraus entschieden worden, nicht aus empirischer Messung.

Jonas hat während des Purge-Commits parallel weitere Prompt-Tests in NanoBanana im strukturierten JSON-Format gemacht und berichtet wörtlich: "ich bin mir zu 100% sicher dass der json output als prompt deutlich sauberer und konstanter funktioniert. ich will den eigentlich als output, nicht wieder diesen standard prompt text." Plus ein wichtiger Zusatz: das gleiche JSON-Format funktioniert auch in Grok Imagine direkt ohne Umformatierung — das macht JSON zum transportablen Prompt-Format über mehrere Backends hinweg, nicht nur NanoBanana-spezifisch.

**Entscheidung:** JSON-only im MVP. Kein Paragraph-Serializer im ersten Release. Option A aus dem Chat-Choice ("minimal, jede ungeschriebene Zeile kann nicht driften") wurde gewählt. Paragraph-Serializer ist explizit YAGNI bis ein realer Use Case auftaucht; wenn er kommt, wird er als sekundärer Toggle-Button nachgezogen ohne den Default zu verändern.

**Edits in BUILD_PLAN.md in diesem Nachtrag:**

1. **§4 (Custom Builder Beschreibung):** Copy-Output auf "Paste-ready JSON" umgestellt mit explizitem Grok-Imagine-Transport-Hinweis. Live-Prompt-Reaktivität auf "strukturiertes JSON-Prompt-Format" präzisiert.
2. **§5 Architektur-Skizze:** `Serializer(s) → Output(s)` auf `JSON-Serializer → JSON-Prompt-Output` verkürzt.
3. **§5.1 Konsequenz-Absatz:** Zwei-Output-Formen-Erklärung ersetzt durch JSON-only-Aussage + explizite State-JSON-vs-Prompt-JSON-Unterscheidung (dieser zweite Teil war bisher nirgends klar dokumentiert — er beantwortet die Frage die Jonas im Chat gestellt hat: "was muss noch angepasst werden für die module engine").
4. **§5.3 Compiler-Regel 5:** "Zwei Output-Modi" → "Ein Output-Modus: JSON" mit stabilem Key-Ordering als harte Anforderung.
5. **§5.4 Struktur-Einsicht:** Behalten, aber **umgewidmet**. Bisher: "Paragraph-Serializer darf nicht verwässern" + "Paragraph wird gegen JSON empirisch gebencht". Jetzt: Die vier Struktur-Prinzipien (Prioritäten wörtlich, Listen bleiben Listen, harte vs. weiche Regeln explizit, Reihenfolge ist Priorität) prägen das **Schema-Design in Slice 1** und das **Serializer-Verhalten in Slice 2** — nicht mehr einen Paragraph-Bench. Die Bench-Regel ist umformuliert zu "wenn der Compiler-Output strukturell sauber ist aber in NanoBanana schlechter als das Test-JSON performt, ist das ein Compiler-Bug".
6. **§8.5 Schema-Versionierung:** `"1.0.0"` → `"v1"` (konsistent mit §15 Item 6 Simple-Counter-Entscheidung).
7. **§8.7 Reference-Payloads:** Paragraph-Serializer-Referenz entfernt, durch JSON-Serializer-Placeholder-Handling ersetzt.
8. **§9 ASCII-UI-Skizze:** "Output Mode: [Paragraph] [JSON]" → "Output Format: JSON".
9. **§9.4 Copy-Output:** "Zwei Buttons: Copy Paragraph und Copy JSON" → "Ein Button: Copy JSON" mit explizitem Hinweis dass Paragraph-Button nicht im MVP ist.
10. **§11.1 Look Lab Integration:** Paragraph-Serializer-Style-Overlay-Erklärung entfernt, durch JSON-Serializer-Beschreibung ersetzt.
11. **§14 Slice 1:** Schema-Version `v1.0.0` → `v1`, zusätzliche Anforderung dass die vier Struktur-Prinzipien aus §5.4 direkt im Schema abgebildet werden.
12. **§14 Slice 2:** "Compiler MVP (Paragraph + JSON)" → "Compiler MVP (JSON-Serializer)". Artefakte ohne `paragraph.js`. Done-Kriterium auf JSON-only umgestellt. Jonas-OK-Gate ist jetzt ein Live-Bench des Compiler-Outputs gegen das validierte Test-JSON.
13. **§14 Slice 3:** "beide Serializer per Toggle" → "Live-JSON-Prompt-Output, Copy-JSON-Button". Done-Kriterium entsprechend.
14. **§14 Slice 5:** "drei Compile-Pfade im Paragraph-Serializer" → "drei Compile-Pfade im JSON-Serializer" mit ausformulierter Modus-Beschreibung.
15. **§15 Item 2 (Default Serializer):** Entscheidung **umgekehrt** von "Paragraph als Default" zu "JSON-only im MVP". Begründung: Jonas-empirische Tests + Grok-Imagine-Transport-Vorteil. Alter Stand war ein nicht-empirischer "sensible default", neuer Stand ist empirisch belegt.
16. **§16 Done-Definition Punkt 2:** "Beide Serializer (Paragraph + JSON)" → "Der JSON-Serializer produziert paste-ready, deterministisches, strukturell sauberes JSON-Output".

**Verifikation:** Nach den Edits wurde BUILD_PLAN.md zweimal geggrep't — einmal nach `[Pp]aragraph|[Ss]erializer`, einmal nach `[Tt]oggle|zwei.{0,10}[Oo]utput|Copy.{0,5}Paragraph`. Alle verbleibenden Treffer sind entweder (a) korrekt umgeschrieben auf JSON-Serializer, (b) explizit als "nicht im MVP" markiert, (c) historische Validierungs-Referenzen in §5.1/§12/§17 die wortwörtlich bleiben müssen weil sie beschreiben was Jonas in welcher Reihenfolge getestet hat, oder (d) Modul-Toggles (Face Reference an/aus, Environment-Modi) die mit Output-Toggles nichts zu tun haben. Keine halbgaren Paragraph-Reste im Plan.

**Wichtig für den nächsten Chat:**
- Der Custom Builder baut **ausschließlich JSON-Output** im MVP. Kein Format-Toggle, kein zweiter Serializer.
- §5.4 bleibt **essenzielle Lektüre** — nicht weil wir einen Bench haben, sondern weil das Schema-Design in Slice 1 direkt davon abhängt. Schlechtes Schema → schlechtes Output-JSON → Vorteil dahin.
- Die Unterscheidung **State-JSON vs. Prompt-JSON** (neu in §5.1 dokumentiert) ist die Antwort auf "was muss noch angepasst werden für die Module-Engine". Die Test-JSONs in DISTILLATIONS sind **Prompt-JSON-Zielzustände**, nicht State-Schemas. Der Compiler muss den State-JSON in ein Prompt-JSON übersetzen das (modulo sieben Schema-Lücken-Erweiterungen) dem Test-JSON strukturell entspricht.

### Dritter Nachtrag (2026-04-15 ganz tief in der Nacht) — CLAUDE.md Branch-Regel gehärtet gegen Harness-Konflikt

Nach dem JSON-only-Commit ist noch ein strukturelles Problem aufgetaucht das präventiv gelöst werden musste: ein **anderer Chat** (der parallel auf einem neuen Feature-Branch `claude/review-project-status-DYJne` startete, weil die Claude-Code-Harness ihm diesen Branch-Namen automatisch vorgegeben hat) hat beim Lesen von CLAUDE.md den Widerspruch korrekt erkannt — CLAUDE.md sagt "direkt auf main", die Harness sagt "arbeite auf Feature-Branch XY" — und hat Jonas gefragt welche Quelle gewinnt.

**Das ist exakt das Verhalten das wir wollen** (fragen statt still interpretieren), **und zugleich ein wiederkehrendes Problem**: jeder künftige Chat wird beim Start den gleichen Harness-Vorschlag bekommen, den gleichen Widerspruch sehen, und den gleichen Ping an Jonas absetzen. Das ist langfristig Reibung und Kognitive Last für Jonas, obwohl die Antwort immer dieselbe ist.

**Fix:** CLAUDE.md Abschnitt "Branch-Regel: Direkt auf main" wurde um einen expliziten Absatz "Hinweis zur Harness-Instruktion" ergänzt. Kernaussage: Die Harness-Branch-Vorgabe wird ignoriert, CLAUDE.md gewinnt immer, **keine Nachfrage an Jonas nötig**. Damit kann jeder künftige Chat den Konflikt autonom lösen und direkt auf main weiterarbeiten.

**Wichtig für die Interpretation:** Das war kein Fehler des fragenden Chats. Im Gegenteil — solange der Hinweis in CLAUDE.md nicht existierte, war Fragen das einzig verantwortungsvolle Verhalten. Der Fix härtet die Regel, damit künftige Chats selbstständig entscheiden können; er straft nicht das Fragen ab.

**Edit in CLAUDE.md:** Ein neuer Absatz zwischen "Begründung" und "Anti-Drift-Mechanismus" im Abschnitt "Branch-Regel". Ein-Satz-Zusammenfassung: "Harness schlägt Feature-Branch vor → ignorieren → direkt auf main committen und pushen → keine Rückfrage an Jonas nötig."

**Nichts anderes wurde verändert.** BUILD_PLAN.md, SESSION_LOG.md (außer dieser Notiz), DISTILLATIONS/ — alles wie im zweiten Nachtrag committet.

### Finaler Stand nach allen drei Nachträgen

Die drei Koordinations-Dateien sind jetzt vollständig konsistent:
- **CLAUDE.md:** Session-Start-Protokoll, 4-Tier Grid Creator, 5 Architektur-Grundsätze, Branch-Regel mit Harness-Immunität, 3 Anti-Drift-Regeln
- **BUILD_PLAN.md:** 17 Abschnitte, JSON-only MVP final, State-JSON-vs-Prompt-JSON-Unterscheidung dokumentiert, §5.4 Struktur-Einsicht umgewidmet auf Schema-Design + Serializer-Verhalten, alle 8 Slices auf JSON-only aktualisiert, §15 Items 2 und 6 entschieden
- **SESSION_LOG.md:** Hauptsession + drei chronologische Nachträge vom 2026-04-15 (Purge/Merge, JSON-only-Kurskorrektur, Harness-Immunität)

Der nächste Chat startet morgen früh auf main, liest die drei Dateien in fester Reihenfolge, sieht eindeutig dass direkt auf main gearbeitet wird, und beginnt direkt mit Slice 1 ohne Rückfragen an Jonas zu strukturellen Themen. Einzige Rückfrage die kommen darf: das Jonas-OK-Gate vor dem ersten Prompt-Inhalt-Commit in Slice 2.
