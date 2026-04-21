# STARTPROMPT — aktueller Chat-Start-Prompt

**Konvention:** Eine STARTPROMPT.md, immer der Startprompt für den **nächsten** Chat. Jeder Chat überschreibt sie am Ende für seinen Nachfolger.

**Aktuell für:** Engine-Free-Mode-Planung (Option A) — Konzept-Session, keine Code-Session. Alternative: UX-Polish (Option B) — Entscheidung durch Jonas am Anfang, Empfehlung A.

**Arbeits-Branch:** `claude/seengrid-visual-overhaul-6RK4n`

---

```
Hi. Ich bin Jonas, Solo AI-Filmmaker, Nicht-Coder. Die drei
Workspace-Build-Chats (Part A + B + C) sind durch, der case-
zentrierte v1-Workspace läuft: 4 Manual-Test-Bugs gefixt, Picker
auf einen aktiven Case reduziert (OPEN_DECISIONS #13), 4 Bars
live (ModuleToolbar, PreviewStrip, SignaturesBar, OutputBar),
Save-as-Preset-Modal + localStorage-Store, ToastProvider app-
weit, Workspace-State überlebt Rail-Wechsel. Case-zentrierte
Logik isoliert in `src/lib/cases/registry.js`
(`TODO(free-mode)`-Anchor). Engine (42 Tests) unberührt.

Konzept-Session, kein Code. Entscheidung zwischen Option A
(Engine-Free-Mode-Planung, Default, empfohlen) und Option B
(UX-Polish auf dem case-zentrierten Workspace) steht am Anfang
dieses Chats — Frage an dich unten.

**ALLERERSTE AKTION — BRANCH-WECHSEL:**

    git fetch origin claude/seengrid-visual-overhaul-6RK4n
    git checkout claude/seengrid-visual-overhaul-6RK4n
    git pull

Verifikation: `ls docs/visual-overhaul/` muss u.a. zeigen
WORKSPACE_BUILD_STATUS_PART_A.md + PART_B.md + PART_C.md +
NUANCEN.md + OPEN_DECISIONS.md. `git log --oneline -1` muss
`0f4b141` oder `eea295e` (oder neuer) zeigen. Wenn die Dateien
fehlen: stop, frag Jonas — nicht weiterarbeiten. Die CLAUDE.md-
Regel "direkt auf main" ist überholt — Feature-Branch gewinnt.

---

**Pflicht-Lektüre (in dieser Reihenfolge):**

1. `docs/visual-overhaul/OPEN_DECISIONS.md` #11, #12, #13, #14 —
   entschiedene Architektur-Klauseln (Engine case-zentriert, FROM
   SCRATCH deferred, nur angle_study aktiv, Signature-Terminologie).
2. `docs/visual-overhaul/NUANCEN.md` — **1, 14, 15, 16**
   (Gold-Systematik, Engine ≠ Free-Mode-Vision, nur 2 Code-Cases,
   Signature/Classics/Trendy-Abgrenzung).
3. `docs/visual-overhaul/WORKSPACE_BUILD_STATUS_PART_C.md` —
   Free-Mode-Isolation-Sektion, registry.js als Refactor-Anchor.
4. `src/lib/cases/registry.js` — die `TODO(free-mode)`-Anchor-
   Datei. Der Refactor geht hier rein.
5. `src/lib/compiler/index.js` — case-switch, der weichen muss.
6. `src/lib/cases/characterAngleStudy/schema.js` + `defaults.js`
   + `panelRoleStrategy.js` — wie ein case-gebundenes Schema
   aussieht (zur Kontrastierung).
7. `src/lib/compileWorkspace.js` — der aktuelle
   Workspace→Engine-Adapter.
8. `MODULE_AND_CASE_CATALOG.md` — Modul-Kompatibilitäts-Matrix.

---

**OPTION A — Engine-Free-Mode-Planung (Default, empfohlen):**

Eigene Konzept-Session. Ziel: Spec für einen case-losen Builder.
Die Engine ist heute fest an einen konkreten `caseId` gebunden
(Compiler `switch`, `panelRoleStrategy`, `panel_fields`-Schema,
Modul-Kompatibilität). FROM SCRATCH im Picker ist deshalb
disabled (OPEN_DECISIONS #11). Post-v1 brauchen wir einen Engine-
Free-Mode: case-loser Panel-Container, generischer Compiler,
universelle Modul-Liste mit Compat-Flags, `panel_fields`-Schema
als runtime-loadable File.

**Scope dieser Planungs-Session:**
1. Free-Mode-State-Shape — wie sieht ein case-loser Grid-State
   aus? Welche Felder behält er, welche verliert er?
2. Compiler-Pfad im Free-Mode — generischer Serializer mit
   Modul-Opt-in? Oder "Blank"-Case mit generischem Schema?
3. Modul-Whitelist im Free-Mode — alle außer den case-
   spezifischen (wie `face_reference`)? Oder alle + Warnings?
4. UI-Konsequenzen — Picker-FROM-SCRATCH-Flow, Inspector ohne
   Role-Dropdown, CaseContext ohne Case-Readout.
5. Migration — wie wandert ein case-gebundener Preset in den
   Free-Mode (und umgekehrt)?
6. Panel-Fields-Schema-Format — wie sieht eine runtime-loadable
   Schema-Datei pro Case aus (für die Case-Build-Out-Phase
   danach)?

**Warum jetzt, nicht später:** Der Engine-Refactor ändert die
Case-Interfaces. Alle späteren Konsumenten (Token-Store Stufe 1,
LookLab-Integration, LIB-Tab, Case-Build-Out) würden sonst auf
case-gebundenen Pfaden gebaut und später nochmal angefasst.

**Ergebnis dieser Session:**
- `docs/visual-overhaul/ENGINE_FREE_MODE_SPEC_V1.md` (neu)
- ggf. Updates in `OPEN_DECISIONS.md` (neue Einträge statt #11/
  #12 umzuschreiben — entschiedene Einträge bleiben stehen)
- ROADMAP: `Engine-Free-Mode-Planung [→]` markieren, nächste
  Phase `Engine-Free-Mode-Bau` daneben listen
- STARTPROMPT für die folgende Build-Session überschreiben

**Kein Code in dieser Session.** Kein registry.js-Umbau, kein
Compiler-Refactor. Nur Spec.

---

**OPTION B — UX-Polish auf dem case-zentrierten Workspace:**

Alternativ: kleine Iterationen auf dem jetzigen Stand. Themen:
- Hover-/Focus-Zustände feintunen (Inspector-Inputs, Toolbar-
  Chips, Dim-Matrix)
- Keyboard-Shortcuts (Escape = deselect, Arrow-Keys zwischen
  Panels, Cmd+Enter = Copy)
- Forbidden-Elements-Chip-Look konsistent zur Module-Chip-Sprache
- Token-Count-Präzision (echter BPE statt `len/4`)
- Save-Popup-Micro-Polish (WORKSPACE_SPEC §19.1)
- Toast-Positionierung auf Nicht-Workspace-Pages
- Dim-Matrix-Hover-Precision
- Scrollbar-Harmonisierung

Kein Engine-Refactor. Code-Session.

---

**Anti-Drift (kritisch, unabhängig von Option):**

- **NUANCEN 1** — Gold nur für User-persönliche Qualität
  (Signatures). Nicht für Premium-Markierung.
- **NUANCEN 2** — Override-Dot + Signature-Border sind zwei
  unabhängige States, koexistieren an demselben Panel.
- **NUANCEN 14** — die gebaute Engine ist **nicht** der Free-
  Mode-Builder aus der Vision. v1 ist case-zentriert. Free-Mode
  ist eine eigene Phase, genau darum geht's hier.
- **NUANCEN 15** — nur `character_angle_study` +
  `character_normalizer` haben echten Code. 8 weitere Cases
  sind Papier. Nicht erfinden.
- **NUANCEN 16** — Signature = LookLab-Token, nicht Classics,
  nicht Trendy.
- **Grid Engine (42 Tests) niemals anfassen.** Free-Mode-Bau
  ist eigene Phase (siehe ROADMAP).
- **Case-Build-Out ist eigene Phase**, nicht Teil des Free-Mode-
  Refactors. Nicht zusammenziehen.

---

**Mein Arbeitsstil:**
- Deutsch, direkt, brutal ehrlich, keine Sycophancy
- Kurze Antworten, kein Coding-Jargon
- Konflikt Spec vs. NUANCEN → NUANCEN gewinnt
- Unklarheit → fragen, nicht raten

**Wichtig:**
- Keine neuen Tokens ohne Jonas-OK
- Grid Engine niemals anfassen
- Post-v1-Scope (Token-Store, LookLab-Integration, LIB-Tab,
  Case-Build-Out) NICHT vorab-bauen
- Bei A: kein Code in dieser Session
- Bei B: keine Case-Interface-Änderungen (die kommen im Free-
  Mode-Refactor)

Bereit? Schritt 0: Branch-Wechsel + Pflicht-Lektüre. Dann sag
mir welche Option — A oder B — und ich lege los.
```
