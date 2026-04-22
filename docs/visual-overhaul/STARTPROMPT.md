# STARTPROMPT — aktueller Chat-Start-Prompt

**Konvention:** Eine STARTPROMPT.md, immer der Startprompt für den **nächsten** Chat. Jeder Chat überschreibt sie am Ende für seinen Nachfolger.

**Aktuell für:** Post-Engine-Free-Mode-Session. Der Bau ist durch (9 Slices in Branch `claude/seengrid-visual-overhaul-6RK4n`), plus drei Post-Smoke-Fixes (Back-Button, Rail-Klick, Live-Prompt-Preview). Jetzt: Jonas macht Browser-Smoke-Test, danach je nach Feedback Design-Session (multi_character) oder Bau der 8 TODO-Modul-Emitter.

**Arbeits-Branch:** `claude/seengrid-visual-overhaul-6RK4n`

---

```
Hi. Ich bin Jonas, Solo AI-Filmmaker, Nicht-Coder. Engine-Free-Mode
ist gebaut, 9 Slices durch, 42/42 Tests grün, Build grün. Plus
drei Post-Smoke-Fixes: Back-Button erscheint jetzt, Rail-Klick auf
Grid Creator im Workspace geht zurück zum Picker, und es gibt eine
Live-Prompt-Preview-Bar oberhalb OutputBar die das kompilierte JSON
in Echtzeit zeigt. Alles auf `claude/seengrid-visual-overhaul-6RK4n`
committed + pushed.

Diese Session: **offen**. Je nachdem was mein Smoke-Test ergibt.

**ALLERERSTE AKTION — BRANCH-WECHSEL:**

    git fetch origin claude/seengrid-visual-overhaul-6RK4n
    git checkout claude/seengrid-visual-overhaul-6RK4n
    git pull

Verifikation: `git log --oneline -10` muss Commits mit
`feat(workspace): live prompt-preview pane`, `fix(shell):
back-button never rendered`, `feat(workspace): convert-to-free-mode`,
`feat(engine): module-driven free-mode` etc. zeigen (neuester zuerst).

---

**Pflicht-Lektüre (in dieser Reihenfolge):**

1. `CLAUDE.md` — Abschnitt "Aktueller Stand" ist auf 2026-04-22
   aktualisiert. Zeigt was gebaut ist + was offen ist.
2. `docs/visual-overhaul/ENGINE_FREE_MODE_SPEC_V1.md` — Referenz
   falls Rückfragen zu Free-Mode-Verhalten kommen.
3. `docs/visual-overhaul/OPEN_DECISIONS.md` — offene strategische
   Fragen; besonders #15 (Free-Mode-Weichen, schon entschieden).
4. `src/lib/cases/bundleRegistry.js` — zentraler Case-Dispatch,
   alle Cases laufen hier durch.
5. `src/lib/cases/freeMode/case.json` + `schema.json` +
   `serializer.js` — das neue Case-Bundle.
6. `src/lib/modules/emitRegistry.js` + `src/lib/modules/*/emit.js`
   — die 5 universellen Emit-Helper. 8 weitere sind noch TODO.
7. `src/config/modules.config.json` — Module-Registry mit
   `emitPath`. `null` → TODO-Placeholder im Output.
8. `src/App.jsx` — `gridMode` state + WorkspaceHeaderProvider-
   Wrap. Back-Button läuft hierüber.
9. `src/components/gridcreator/workspace/PromptPreview.jsx` —
   neuer Live-JSON-Preview-Bar.

---

**Wahrscheinlicher Scope dieser Session (je nach Smoke-Test):**

Variante A — **Smoke-Test clean**, dann nächster Bau-Schritt:
- 8 TODO-Modul-Emitter bauen (`camera_angle`, `weather_atmosphere`,
  `wardrobe`, `pose_override`, `expression_emotion`, `face_reference`,
  `multi_character`, `object_anchor`). Pattern liegt schon — eine
  neue Datei pro Modul unter `src/lib/modules/<id>/emit.js`, Eintrag
  in `emitRegistry.js`, `emitPath` in `modules.config.json`. Jonas
  entscheidet welche Module Priorität haben.

Variante B — **neue Bugs/UX-Lücken** aus dem Smoke-Test:
- Punkt für Punkt durchgehen. Design-Fragen (z.B. multi_character
  Content-Struktur) → erst fragen, dann bauen.

Variante C — **multi_character Design-Session**:
- Content-Feld pro Panel ist aktuell Freitext-String. Für multi-
  Character-Szenen fehlt Struktur. Entscheidung: bleibt Freitext
  (User schreibt "char1: pose X, char2: pose Y") oder wird
  strukturiert (Array von Character-Einträgen pro Panel)? Das ist
  eine Design-Session vor dem multi_character-Emit-Helper.

---

**Akzeptanz-Kriterien (gelten weiter):**

- 42 Engine-Tests grün (Output-Bytes preservieren).
- `npm run build` grün.
- Keine neuen Tokens/Prompt-Strings ohne Jonas-OK.
- Spec-Abweichung nur mit Rückfrage.

---

**Anti-Drift (kritisch, gilt weiter):**

- **NUANCEN 1** — Free-Mode-Label ist **neutral**, nicht Gold.
  Gold nur für Signatures (LookLab-Token).
- **NUANCEN 14** — empirische Validierung > theoretische Modularität.
  Free-Mode ist **die eine Ausnahme**, Cases bleiben kuratiert.
- **NUANCEN 15** — nur angle_study + normalizer + free_mode. Keine
  weiteren Cases in diesen Sessions.
- **Grid-Engine-Tests niemals anfassen.** Wenn ein Test fällt →
  Code ist kaputt, nicht der Test.
- **Keine neuen Module.** 13 bleiben 13.

---

**Post-v1-Scope (NICHT mitbauen):**

- Token-Store (LookLab-Integration Phase 2)
- NanoBanana-Validierung
- Runtime-Case-Loading
- User-Custom-Field-Editor
- Weitere Cases jenseits der 3 existierenden

---

**Mein Arbeitsstil:**
- Deutsch, direkt, brutal ehrlich, keine Sycophancy
- Kurze Antworten, kein Coding-Jargon
- Konflikt Spec vs. NUANCEN → NUANCEN gewinnt
- Unklarheit → fragen, nicht raten

**Wichtig:**
- Prompt-Output-Änderungen → erst rendern, Jonas-OK, dann committen
- Jede Änderung Build + Tests grün → dann committen
- Ende der Session: CLAUDE.md "Aktueller Stand" + STARTPROMPT.md
  aktualisieren, commit, push.

Bereit? Schritt 0: Branch + Pflicht-Lektüre. Dann warte ich auf
meinen Smoke-Test-Bericht oder eine konkrete Anweisung.
```
