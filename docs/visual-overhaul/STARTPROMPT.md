# STARTPROMPT — aktueller Chat-Start-Prompt

**Konvention:** Eine STARTPROMPT.md, immer der Startprompt für den **nächsten** Chat. Jeder Chat überschreibt sie am Ende für seinen Nachfolger.

**Aktuell für:** Workspace-Bau **Part C** — Bugfixes + Bars + Save + Integration + Docs.

**Arbeits-Branch:** `claude/seengrid-visual-overhaul-6RK4n`

---

```
Hi. Ich bin Jonas, Solo AI-Filmmaker, Nicht-Coder. Du bist **Part C
von 3** — der letzte Workspace-Bau-Chat. Part A (Foundation) und
Part B (Workspace-Layout + 3 Spalten) sind committed (d95591f).
Part B hat im Manual-Test Bugs gezeigt + die Engine-Architektur-
Realität geklärt — das ändert Part-C-Scope massiv.

Code-Output, keine Konzept-Session. Alle Entscheidungen stehen in
Spec + OPEN_DECISIONS + NUANCEN.

**ALLERERSTE AKTION — BRANCH-WECHSEL:**

    git fetch origin claude/seengrid-visual-overhaul-6RK4n
    git checkout claude/seengrid-visual-overhaul-6RK4n
    git pull

Verifikation: `ls docs/visual-overhaul/` muss u.a. zeigen
WORKSPACE_BUILD_STATUS_PART_A.md + PART_B.md + NUANCEN.md + OPEN_
DECISIONS.md. Die CLAUDE.md-Regel "direkt auf main" ist überholt —
Feature-Branch gewinnt.

---

**Pflicht-Lektüre (in dieser Reihenfolge):**

1. `docs/visual-overhaul/OPEN_DECISIONS.md` #11, #12, #13, #14 —
   die entschiedenen Scope-Punkte für Part C.
2. `docs/visual-overhaul/NUANCEN.md` — **2, 6, 7, 14, 15, 16**.
3. `docs/visual-overhaul/WORKSPACE_BUILD_STATUS_PART_A.md` —
   Anschluss-Punkte (Hooks, Actions, State-Shape, ToastProvider,
   tokenCount, compileWorkspace).
4. `docs/visual-overhaul/WORKSPACE_BUILD_STATUS_PART_B.md` —
   **komplette** Datei lesen, speziell "Bekannte Bugs für Part C"
   (4 Bugs) + TODO-Marker-Tabelle.
5. `docs/visual-overhaul/WORKSPACE_SPEC_V1.md` — §4, §9, §10, §11,
   §12, §18 (Save-Popup), §22 (Token-Count). Für die Bars: §7-9.
6. `src/lib/compiler/` — Slices 1-8 Engine. **NICHT anfassen**, nur
   über `workspaceCompile`-Adapter (Part A) nutzen.

---

**SCOPE PART C — strikte Reihenfolge:**

**Stufe 0 — Bugfixes (vor allem anderen):**

Die 4 Bugs aus STATUS_PART_B "Bekannte Bugs für Part C":

1. **ROLE-Dropdown bei angle_study** — prüfen ob alle 8 Rollen
   rendern (front, front_right, right_profile, back_right, back,
   back_left, left_profile, front_left). Inspector.jsx-Options-
   Ableitung debuggen.
2. **Panel-Content-Field Fallback-Leak** — bei Cases *mit* Schema
   (angle_study) erscheint trotzdem ein Fallback-Feld. Fix:
   Fallback-Pfad strikt an "kein Schema vorhanden" koppeln.
3. **SVG-Silhouetten-Rendering** — bei angle_study teils unsichtbar.
   ViewBox, Paths-Referenz, ResizeObserver-Timing debuggen.
4. **Inspector-Hints fehlen** — User weiß nicht was in Custom Notes
   etc. reingehört. Knappe Mono-Hints pro Feld (ein-Zeilen-Hint
   unter Label oder `title`-Attribut). Wortlaut aus SPEC §6.

**Stufe 1 — Picker-Scope-Anpassung (OPEN_DECISIONS #13):**

5. Im Picker alle Cases **außer `character_angle_study`** auf
   disabled + `COMING SOON`-Mono-Label umstellen (visuell analog
   FROM SCRATCH aus Part B). Picker.jsx + Picker.module.css.

**Stufe 2 — Output-Bar PRIORISIERT (vor allen anderen Bars):**

Begründung: ohne Live-Prompt-Output ist der Inspector eine Black-
Box. User soll sofort sehen dass Änderungen im Prompt ankommen.

6. `OutputBar.jsx` + `.module.css` — SPEC §9:
   - Links: `TOKEN-COUNT: ~N` (via `countTokens` aus Part A).
     Warning-Rot wenn > 8000.
   - Mitte: Dim-Warning wenn `isWarningQuality(advice.quality2K)`
     `→ LOW / TINY @ 2K — not startframe-ready`.
   - Rechts: **Save**-Button (öffnet Save-Popup, Stufe 6) +
     **Copy**-Button (`navigator.clipboard.writeText` +
     Toast "copied").
   - Compile via `compileWorkspace(state)` aus Part A.
   - **Manual-Test durch Jonas hier!** — Module togglen,
     Dropdowns ändern, Token-Count live prüfen, Copy prüfen.

**Stufe 3 — PreviewStrip:**

7. `PreviewStrip.jsx` + `.module.css` — SPEC §7. Mini-Silhouetten,
   Panel-Nr, Rolle-Label, Klick → `selectPanel`. Selected = Teal-
   Border. `useOverflowDetection` aus Part A (NUANCEN 11).

**Stufe 4 — SignaturesBar:**

8. `SignaturesBar.jsx` + `.module.css` — SPEC §8. Gold-Label
   `SIGNATURES` + applied-Cards (aus `signatures.stub.json` +
   `panel.signatureId`), Detach-Link. `+ apply signature` Button
   zeigt Toast "signature picker coming soon"
   (TODO(signature-picker)).
   **Terminologie (NUANCEN 16):** Signature = LookLab-Token, NICHT
   Classics/Trendy. Applied-Cards sind ausschließlich LookLab-
   Signatures.

**Stufe 5 — ModuleToolbar:**

9. `ModuleToolbar.jsx` + `.module.css` — SPEC §3:
   - Links: Modul-Chips datengetrieben aus `modules.config.json`
     (nur compat mit `caseId`, Teal-Border wenn aktiv, Klick
     toggled `activeModules`).
   - Rechts: **Random** (ConfirmDialog → `randomizeAll()`) +
     **Reset** (ConfirmDialog → `resetAllToCaseDefaults()`).
   - `ConfirmDialog` aus Part A.

**Stufe 6 — SavePresetModal:**

10. `SavePresetDialog.jsx` + `.module.css` — SPEC §10. Modal mit
    Name (required, default `{case} · {date}`) + Notes + Preview-
    Chip `CASE: {displayName}`. Save → `presetActions.saveWorkspace
    AsPreset(...)` + Toast. Cancel schließt ohne Save.

**Stufe 7 — presetStore-Erweiterung:**

11. `src/lib/presetStore.js`:
    - `saveWorkspaceAsPreset({name, notes, workspaceState})` →
      localStorage `sg2.userPresets`.
    - `loadPreset(id)`, `deletePreset(id)`, `listUserPresets()`.
    - Schema: `{id, name, notes, caseId, createdAt, workspaceState}`.
    - **TODO(preset-hydration):** Picker-Flow erweitern damit ein
      User-Preset den vollen `workspaceState` wiederherstellt (neue
      Action `loadWorkspaceFromPreset(preset)` im Store).

**Stufe 8 — ToastProvider-Wire + offene Punkte Part B:**

12. `App.jsx` — `<ToastProvider>` app-weit wrappen. Smoke-Test:
    Copy-Toast funktioniert.
13. **Workspace-State bei Rail-Wechsel:** Store bleibt gemounted
    (Provider höher in App.jsx ODER `display:none` statt Unmount).
    Falls architektonisch teuer: `TODO(workspace-persist)` + Jonas
    fragen.
14. **SET_DIMS new panels get null role:** Im `SET_DIMS`-Reducer
    (`workspaceStore.js`) Panel-Rollen via `panelRoleStrategy`
    vergeben statt `null`.

**Stufe 9 — Docs:**

15. `docs/visual-overhaul/WORKSPACE_BUILD_STATUS_PART_C.md`
    anlegen (analog A+B).
16. `ROADMAP.md`: Workspace-Bau Part C `[→]` → `[✓]`. Nächste
    aktive Phase: Engine-Free-Mode-Planung.
17. `CLAUDE.md` "Aktueller Stand" aktualisieren.
18. **STARTPROMPT.md überschreiben** — Scope der nächsten Session
    (Engine-Free-Mode-Planung ODER UX-Polish, Frage an Jonas am
    Ende).

---

**FREE-MODE-ISOLATION (kritischer Kniff):**

Die Engine ist case-zentriert (NUANCEN 14 + OPEN_DECISIONS #12).
Post-v1 kommt ein Engine-Free-Mode-Refactor. Damit der Refactor
nicht durch die ganze UI wühlen muss, **zentralisierst du jetzt**
alle case-spezifischen Abfragen:

- Inspector liest `panel_fields`-Schema über **eine** zentrale
  Helper-Funktion (z.B. `getPanelFieldsSchema(caseId)`).
- ModuleToolbar liest Case-Modul-Whitelist über **eine** zentrale
  Stelle (z.B. `getCompatibleModules(caseId)`).
- Keine verstreuten `if (caseId === '...')` in Komponenten.
- Marker `TODO(free-mode)` an diesen zentralen Stellen.

Damit ist der Free-Mode-Refactor später ein chirurgischer Eingriff
an den markierten Stellen, kein UI-weites Aufwühlen.

---

**Anti-Drift (nur Part-C-relevant):**

- **NUANCEN 2** (Override-Dot + Signature koexistieren). Bleibt
  aus Part B erhalten, nicht kaputtmachen.
- **NUANCEN 6** (Picker + Workspace = zwei Page-States).
- **NUANCEN 7** (Bars strikt full-width, nie in Canvas-Spalte).
- **NUANCEN 14** (Engine case-zentriert, kein Free-Mode bauen).
- **NUANCEN 15** (nur angle_study aktiv, 9 Cases disabled).
- **NUANCEN 16** (Signature = LookLab, nicht Classics/Trendy).
- **Grid Engine (42 Tests) niemals anfassen.**

---

**Vorab-Entscheidungen (nicht mehr fragen):**

- Store-API komplett aus Part A + B — siehe STATUS-Docs.
- CSS-Modules mit `:global(.sg2-shell)`-Specificity (Part-B-
  Konvention).
- Random-Pools + ConfirmDialog + Toast + ToastProvider + useOverflow
  Detection + tokenCount + compileWorkspace sind Part-A-Infra, nur
  konsumieren.
- FROM SCRATCH bleibt disabled (#11).
- Lieferung in Gruppen OK (nicht strikt 1-File-pro-Antwort).

---

**TODO-Marker-Convention (Aktuell + neu):**

- `TODO(looklab-jump)` — Inspector Signature-Card (Part B)
- `TODO(panel-fields-schema-{caseId})` — 9 Papier-Cases (Part B)
- `TODO(preset-hydration)` — voll-Preset-Load (Part B → Part C löst)
- `TODO(signature-picker)` — Apply-Signature-Popup v2 (Part C)
- `TODO(free-mode)` — Case-zentrale-Stellen für späteren Refactor
  (Part C pflanzt)
- `TODO(workspace-persist)` — falls Rail-Wechsel-Persistenz teuer
- `TODO(token-store)`, `TODO(routing)` — unverändert

---

**Was am Ende vorliegt:**

1. Alle 4 Bugs gefixt, Picker auf 1 aktiven Case reduziert.
2. Alle 4 Bars funktional + ConfirmDialogs + Save-Popup.
3. `App.jsx` mit ToastProvider, Toasts funktional.
4. Rail-Wechsel-Persistenz + SET_DIMS-Role-Fix gelöst oder
   markiert.
5. STATUS_PART_C.md + ROADMAP-Update + CLAUDE.md-Update + neuer
   STARTPROMPT.
6. `free-mode`-Isolation zentralisiert + markiert.
7. **Manueller Browser-Test vor Commit** (Bugfixes prüfen,
   Output-Bar live-Prompt testen, Random/Reset-Flow, Save-Popup
   → localStorage prüfen). Honest-Flag wenn CLI-Env keinen Browser
   erlaubt.
8. Commit + Push auf `claude/seengrid-visual-overhaul-6RK4n`.

---

**Mein Arbeitsstil:**
- Deutsch, direkt, brutal ehrlich, keine Sycophancy
- Kurze Antworten, kein Coding-Jargon
- Konflikt Spec vs. NUANCEN → NUANCEN gewinnt
- Unklarheit → fragen, nicht raten

**Wichtig:**
- Keine neuen Tokens ohne Jonas-OK
- Grid Engine niemals anfassen
- Post-v1-Scope (Engine-Free-Mode, SeenLab, Case-Build-Out) NICHT
  vorab-bauen

Bereit? Schritt 0: Branch-Wechsel + Pflicht-Lektüre + Bestätigung
dass die 4 Bugs + Picker-Reduktion zuerst kommen. Dann Go.
```
