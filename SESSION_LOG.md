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
