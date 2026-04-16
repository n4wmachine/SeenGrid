# SESSION_LOG.md — SeenGrid

Chronologisches Log aller Arbeits-Sessions am SeenGrid-Rebuild. **Jeder neue Chat** liest diese Datei beim Start (als drittes Dokument nach CLAUDE.md und BUILD_PLAN.md) und fügt am Ende der Session einen neuen Eintrag hinzu.

**Format pro Eintrag:**
- Datum (ISO)
- Was gemacht wurde (knappe Bulletpoints)
- Aktueller Stand am Ende der Session
- Nächster Schritt für den darauffolgenden Chat

**Regeln:**
- Nur **was gemacht wurde**, nicht was vielleicht mal gemacht werden soll (das gehört in BUILD_PLAN.md)
- Keine nachträglichen Edits alter Einträge (außer offensichtliche Tippfehler) — das Log ist historisch
- Neueste Einträge oben
- **Einträge kurz halten.** Details gehören in Code-Kommentare und Git-History, nicht hier.

---

## 2026-04-16 — Brainstorm: MODULE_AND_CASE_CATALOG.md erstellt

Brainstorm-Session mit Jonas. Ergebnis: vollständiger Case- und Modul-Katalog.

- **NEU:** `MODULE_AND_CASE_CATALOG.md` — 10 Base Cases, 13 Module, Kompatibilitäts-Matrix, Custom Content Fields als universelles Konzept, Random Fill, Look Lab Pipeline
- **GEÄNDERT:** `CLAUDE.md` — Session-Start-Protokoll von 3 auf 4 Pflichtdateien erweitert

Wichtige Klärungen:
- Character Sheet ≠ Angle Study (klassisch vs. cinematisch)
- World Zone Board ≠ World Angle Study (verschiedene Orte vs. ein Ort mehrere Winkel)
- Start/End Frame = Leitplanken für Video-KI, NICHT Story Sequence mit 2 Panels
- Core-Templates (Tier 2) = Presets die in den Custom Builder laden, kein eigener Tab

### Stand
- `origin/main` HEAD: `0da32d1`
- MVP-Scope (Slices 1-8) unverändert
- Slices 1-3 fertig, Slice 4 wartet auf Jonas-Go

### Nächster Schritt
Jonas liefert Ground-Truth JSON-Prompts für die Base Cases → werden unter `DISTILLATIONS/` abgelegt (gleich wie die zwei die schon da liegen). Jeder Prompt wird im Katalog beim jeweiligen Case als GT-Referenz vermerkt. Danach Slice 4+5 bauen.

---

## 2026-04-16 — Slice-3-POC browser-verified + Feature-Request Panel-Role-Customization

- Jonas hat Slice-3-POC im Browser verifiziert: 3 Control-Sektionen (case / grid dimensions / panel orientation), keine Module-Toggles → **§14 Slice 3 ist nach Spec**
- **Feature-Request dokumentiert:** Panel-Role-Customization (User wählt pro Panel welcher Winkel). Additiv erweiterbar via `layout.panel_roles_override`. Implementation post-Slice-8.
- Harte Anweisungen an nächste Chats: Dateien lesen vor Fragen, max 1 Satz pro Konzept, Spec gewinnt immer

### Stand
- `origin/main` HEAD: `55cf803` (Slice-3-Fixup, dann `473933c` mit Session-Log-Update)
- Slices 1-3 fertig und verified

---

## 2026-04-16 — Slice 3 Fixup: POC Rewrite auf §14-Scope

- CustomBuilderPoc.jsx komplett neu geschrieben: alte Version hatte Module-Controls statt Case/Rows/Cols/Orientation (genau invertiert zu §14)
- `panel_arrangement`-Policy geklärt: nur emittieren wenn empirisch validiert (`rows === 1 && cols > 1`), sonst Feld weglassen
- Variante A bestätigt: §14 bleibt, 3 Module im MVP als Pipeline-Beweis
- 33/33 Tests grün, Build clean

---

## 2026-04-15 — Spec-Drift in Slice 3 POC entdeckt

- Jonas entdeckte per Browser-Screenshot dass Slice-3-POC (`d66a828`) falsche Controls hatte (Module statt Case/Rows/Cols)
- CLAUDE.md um Spec-Compliance-Absatz erweitert: (1) §14 wortwörtlich zitieren vor dem Bauen, (2) Spec vor Code prüfen, (3) UI-Slices brauchen Screenshot
- Commit `cb80d1e`

---

## 2026-04-15 — Slice 3: Custom Builder POC (erste Version, Spec-Drift)

- POC-Tab "POC (S3)" als fünfter Tab in App.jsx eingehängt (Magenta-Dot)
- **Hatte Spec-Drift** — wurde im nächsten Eintrag korrigiert
- Commit `d66a828`

---

## 2026-04-15 — Slice 2: Compiler MVP (JSON-Serializer)

- `src/lib/compiler/index.js` + `src/lib/compiler/serializers/json.js` — Case-aware Dispatcher, COMPILE_ORDER-Iteration, SKIP-Symbol, 7 Gap-Fixes verdrahtet
- `compileToString(buildDefaultState())` Output byte-identisch zum GT-JSON
- 19 Acceptance-Tests, alle grün. Gesamt 33/33.
- Commit `ff8f300`

---

## 2026-04-15 — Slice 1: Schema-Fundament character_angle_study v1

- 4 Dateien unter `src/lib/cases/characterAngleStudy/`: schema.js, panelRoleStrategy.js, defaults.js, schema.test.mjs
- 7 Schema-Lücken (§8) vollständig abgebildet, 4 Struktur-Prinzipien (§5.4) verdrahtet
- 14 Tests grün
- Commit `38eed9d`

---

## 2026-04-15 — Hard Reset, Rebuild-Plan

- Brutale Bestandsaufnahme: altes System (skeletonRenderer, 11 Module, 10 Goldens) war nirgends in UI eingehängt
- Surgical Purge aller orphanen Dateien
- JSON-Durchbruch: NanoBanana akzeptiert strukturiertes JSON als Prompt, empirisch sogar präziser
- CLAUDE.md, BUILD_PLAN.md, SESSION_LOG.md als 3-Datei-Hierarchie angelegt
- Entscheidungen: JSON-only im MVP, Schema-Version als simpler Counter, direkt auf main

Nachträge gleicher Nacht: Paragraph→JSON-only Kurskorrektur, Harness-Branch-Immunität in CLAUDE.md, Sandbox-Fossil-Protokoll in CLAUDE.md.
