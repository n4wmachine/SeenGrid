# STARTPROMPT — nächster Chat

**Konvention:** Eine STARTPROMPT.md, immer der Startprompt für den **nächsten** Chat. Jeder Chat überschreibt sie am Ende für seinen Nachfolger.

**Aktuell für:** nach Workspace-Bau Part C. Entscheidung durch Jonas am Anfang: **Option A (Engine-Free-Mode-Planung)** oder **Option B (UX-Polish)**. Empfehlung: A.

**Session-Typ:** Konzept-/Planungs-Session bei A, Code-Session bei B.

---

Hi. Ich bin Jonas, Solo AI-Filmmaker, Nicht-Coder. Die drei
Workspace-Build-Chats (Part A + B + C) sind durch, der case-
zentrierte v1-Workspace läuft (4 Bugs gefixt, 4 Bars live, Save
funktioniert, Toasts app-weit, Workspace-State überlebt Rail-
Wechsel). Jetzt steht zur Wahl zwischen **Option A (Engine-Free-
Mode-Planung)** und **Option B (UX-Polish)** — Details unten.
Kein Code-Bau in dieser Session (bei A), nur Spec.

**ALLERERSTE AKTION — BRANCH-WECHSEL:**

    git fetch origin claude/seengrid-visual-overhaul-6RK4n
    git checkout claude/seengrid-visual-overhaul-6RK4n
    git pull

Verifikation: `ls docs/visual-overhaul/` muss u.a. zeigen
`OPEN_DECISIONS.md`, `NUANCEN.md`, `WORKSPACE_SPEC_V1.md`,
`WORKSPACE_BUILD_STATUS_PART_A.md` + `_PART_B.md` + `_PART_C.md`.
`git log --oneline -1` muss `76d48f0` oder `eea295e` (oder neuer)
zeigen. Wenn die Dateien fehlen: stop, frag Jonas — nicht
weiterarbeiten. Die CLAUDE.md-Regel "direkt auf main" ist
überholt — Feature-Branch gewinnt.

---

## Option A (Default) — Engine-Free-Mode-Planung

Eigene Konzept-Session. Ziel: Spec für einen case-losen Builder.
Die Engine ist heute fest an einen konkreten `caseId` gebunden
(Compiler `switch`, `panelRoleStrategy`, `panel_fields`-Schema,
Modul-Kompatibilität). FROM SCRATCH im Picker ist deshalb disabled
(OPEN_DECISIONS #11). Post-v1 brauchen wir einen Engine-Free-Mode:
case-loser Panel-Container, generischer Compiler, universelle
Modul-Liste mit Compat-Flags, `panel_fields`-Schema als runtime-
loadable File.

**Scope dieser Planungs-Session:**
1. Free-Mode-State-Shape designen (wie sieht ein case-loser Grid-
   State aus? Welche Felder behält er, welche verliert er?).
2. Compiler-Pfad für den Free-Mode (generischer Serializer mit
   Modul-Opt-in? Oder "Blank"-Case mit generischem Schema?).
3. Modul-Whitelist im Free-Mode (alle außer den case-spezifischen
   wie `face_reference`? Oder alle + Warnings?).
4. UI-Konsequenzen: Picker-FROM-SCRATCH-Flow, Inspector ohne
   Role-Dropdown, CaseContext ohne Case-Readout.
5. Migration: wie wandert ein case-gebundener Preset in den Free-
   Mode (und umgekehrt)?

**Pflicht-Lektüre vorher:**
- `docs/visual-overhaul/OPEN_DECISIONS.md` #11, #12 (entschiedene
  Architektur-Klausel).
- `docs/visual-overhaul/NUANCEN.md` #14 (Engine ≠ Free-Mode-
  Vision).
- `docs/visual-overhaul/WORKSPACE_BUILD_STATUS_PART_C.md` (was
  Part C angepflanzt hat, insb. `registry.js` als Refactor-
  Anchor).
- `src/lib/cases/registry.js` (die `TODO(free-mode)`-Anchor-Datei
  — der Refactor geht hier rein).
- `src/lib/compiler/index.js` (case-switch, der weichen muss).
- `src/lib/cases/characterAngleStudy/schema.js` + `defaults.js`
  (wie ein case-gebundenes Schema aussieht, zur Kontrastierung).
- `MODULE_AND_CASE_CATALOG.md` (Modul-Kompatibilitäts-Matrix).

**Ergebnis:** `docs/visual-overhaul/ENGINE_FREE_MODE_SPEC_V1.md`
(neu) + ggf. Updates in OPEN_DECISIONS + ROADMAP [→]-Markierung
auf die folgende Engine-Free-Mode-Bau-Phase.

---

## Option B — UX-Polish auf dem case-zentrierten Workspace

Alternativ: kleine Iterationen auf dem jetzigen Stand statt
Engine-Refactor. Themen:
- Hover-/Focus-Zustände feintunen (Inspector-Inputs, Toolbar-
  Chips)
- Keyboard-Shortcuts (Escape deselect, Arrow-Keys zwischen
  Panels, Cmd+Enter = Copy)
- Forbidden-Elements-Chip-Look konsistent zur Module-Chip-Sprache
- Token-Count-Präzision (echter BPE statt `len/4`)
- Save-Popup-Micro-Polish (WORKSPACE_SPEC §19.1)
- Toast-Positionierung auf Nicht-Workspace-Pages (Output-Bar-
  Offset weg, wenn keine Output-Bar da ist)
- Responsive Min-Width-Message (OPEN_DECISIONS #10)
- Dim-Matrix-Hover-Precision
- Scrollbar-Harmonisierung

Kein Engine-Refactor.

---

## Jonas-Frage am Start

Welche Option — **A** (Engine-Free-Mode-Planung) oder **B** (UX-
Polish)?

**Meine Empfehlung: A.** Weil der Engine-Refactor die Case-
Interfaces ändert und sonst alle späteren Konsumenten (Token-
Store Stufe 1, LookLab-Integration, Case-Build-Out, LIB-Tab) auf
case-gebundenen Pfaden gebaut würden, die später nochmal
angefasst werden müssten. B kann jederzeit dazwischen geschoben
werden und ist nie ein Blocker.

---

**Arbeitsstil (unverändert):**
- Deutsch, direkt, kurz.
- Kein Coding-Jargon.
- Konflikt Spec vs. NUANCEN → NUANCEN gewinnt.
- Post-v1-Scope nicht vorab bauen.

**Grid Engine (42 Tests) niemals anfassen. Case-Build-Out ist
eine eigene Phase — nicht im Free-Mode-Refactor ziehen.**
