# STARTPROMPT — aktueller Chat-Start-Prompt

**Konvention:** Eine STARTPROMPT.md, immer der Startprompt für den **nächsten** Chat. Jeder Chat überschreibt sie am Ende für seinen Nachfolger.

**Aktuell für:** Engine-Free-Mode-Bau — Code-Session. Refactor der case-zentrierten Engine auf case-agnostisch + `free_mode` als gleichwertiger Case. 4-6h geschätzt.

**Arbeits-Branch:** `claude/seengrid-visual-overhaul-6RK4n`

---

```
Hi. Ich bin Jonas, Solo AI-Filmmaker, Nicht-Coder. Die Planungs-
Session für den Engine-Free-Mode ist durch. Spec liegt in
`docs/visual-overhaul/ENGINE_FREE_MODE_SPEC_V1.md`, 11 Abschnitte,
alle 5 Architektur-Weichen entschieden (OPEN_DECISIONS #15).

Dieser Chat: **Bau nach Spec.** Code-Session, keine Konzept-
Diskussion. Abweichungen von der Spec nur mit Rückfrage, nicht
im Alleingang.

**ALLERERSTE AKTION — BRANCH-WECHSEL:**

    git fetch origin claude/seengrid-visual-overhaul-6RK4n
    git checkout claude/seengrid-visual-overhaul-6RK4n
    git pull

Verifikation: `ls docs/visual-overhaul/` muss
ENGINE_FREE_MODE_SPEC_V1.md zeigen. `git log --oneline -5` muss
Commits mit `docs(free-mode)` zeigen (neuester zuerst).

---

**Pflicht-Lektüre (in dieser Reihenfolge):**

1. `docs/visual-overhaul/ENGINE_FREE_MODE_SPEC_V1.md` —
   die komplette Spec. Besonders §3 State-Shape, §4 Compiler,
   §7 Modul-Serialisierung, §8 Case-Bundle-Format, §10
   Build-Reihenfolge.
2. `docs/visual-overhaul/OPEN_DECISIONS.md` #15 — Entscheidungs-
   Resumé (W1-W5).
3. `docs/visual-overhaul/NUANCEN.md` §1, §14, §15, §16 —
   Anti-Drift (Gold-Systematik, Engine ≠ Free-Mode-Vision, nur
   2 Code-Cases, Signature-Terminologie).
4. `src/lib/cases/registry.js` — der Free-Mode-Refactor-Anchor.
   `TODO(free-mode)`-Marker im Header.
5. `src/lib/compiler/index.js` — Dispatcher, bekommt `free_mode`-Zweig.
6. `src/lib/cases/characterAngleStudy/{schema,defaults,panelRoleStrategy}.js`
   + `src/lib/compiler/serializers/json.js` — der bestehende Case
   der ins neue Bundle-Format überführt wird.
7. `src/lib/compileWorkspace.js` — Workspace→Engine-Adapter,
   bekommt `free_mode`-Zweig.
8. `src/config/modules.config.json` — bekommt `outputKey` +
   `emitPath`-Felder pro Modul (§7).
9. `CLAUDE.md` — Erweiterbarkeit ohne Rebuild, Branch-Regel
   überholt: Feature-Branch gewinnt.

---

**Scope dieser Build-Session (aus Spec §10):**

1. Case-Bundle-Format für `character_angle_study` einführen
   (§8). Tests grün halten.
2. Case-Bundle-Format für `character_normalizer`. Tests grün halten.
3. Generischer Compiler-Pfad der Case-Bundles liest.
4. `free_mode`-Case einführen (§3, §4): `case.json` +
   generischer Serializer + Compiler-Dispatch +
   `compileWorkspace`-Adapter.
5. `modules.config.json` erweitern (§7): `outputKey` +
   `emitPath`. 5 universelle Module bekommen Emit-Helper
   (`forbidden_elements_user`, `environment_mode`,
   `style_overlay`, `panel_content_fields`, `random_fill`).
6. Picker FROM SCRATCH aktivieren (§6): `isCaseActive('free_mode')`
   auf true, Card-State aktiv.
7. Workspace-UI-Anpassungen (§6): CaseContext-Free-Label,
   Inspector ohne Role-Dropdown im Free-Mode, Canvas ohne
   Silhouetten im Free-Mode.
8. Convert-to-Free-Mode-Action (§6, W5): OutputBar-Knopf +
   ConfirmDialog.
9. Manueller Smoke-Test: FROM SCRATCH → 5-Panel-Grid → 3 Module
   togglen → Copy JSON → paste-ready für NanoBanana.

---

**Akzeptanz-Kriterien:**

- 42 Engine-Tests grün (Output-Bytes für angle_study +
  normalizer identisch zum Vor-Refactor-Stand).
- `npm run build` grün.
- Picker FROM SCRATCH klickbar, lädt ins Workspace mit leeren
  Panels ohne Rollen.
- `compileWorkspace` auf einem Free-Mode-State liefert paste-ready
  JSON (kein `_stub: true`).
- Convert-to-Free-Mode-Knopf im Angle-Study-Workspace
  funktioniert (Constraints weg, Panels + Content bleiben).

---

**Anti-Drift (kritisch):**

- **NUANCEN 1** — Free-Mode-Label ist **neutral**, nicht Gold.
  Gold nur für Signatures (LookLab-Token).
- **NUANCEN 14 gilt weiterhin für Case-Templates** — empirische
  Validierung > theoretische Modularität. Free-Mode ist **die
  eine Ausnahme** wo der User in die theoretische Modularität
  rausdarf. Cases bleiben kuratiert.
- **NUANCEN 15** — nur angle_study + normalizer existieren. Keine
  neuen Cases in dieser Session. Case-Build-Out ist eigene Phase.
- **Grid-Engine-Tests niemals anfassen.** Refactor muss die
  Output-Bytes preservieren. Wenn ein Test fällt → Refactor ist
  kaputt, nicht der Test.
- **Keine neuen Module.** 13 bleiben 13. `emitPath`-Helper für
  5 universelle, Rest `TODO(module-emit-<id>)` wie Spec §7.
- **Spec §9 Nicht-Scope respektieren.** Kein Token-Store, keine
  NanoBanana-Validierung, kein Runtime-Case-Loading, kein
  User-Custom-Field-Editor.

---

**Mein Arbeitsstil:**
- Deutsch, direkt, brutal ehrlich, keine Sycophancy
- Kurze Antworten, kein Coding-Jargon
- Konflikt Spec vs. NUANCEN → NUANCEN gewinnt
- Unklarheit → fragen, nicht raten

**Wichtig:**
- Keine neuen Tokens ohne Jonas-OK
- Grid Engine Output-Bytes bei Refactor preservieren
- Post-v1-Scope (Token-Store, LookLab-Integration, LIB-Tab,
  Case-Build-Out) NICHT mitbauen
- Spec §10 Reihenfolge einhalten — nach jedem Slice sollte
  Build grün + Tests grün sein
- Prompt-Output-Änderungen (Free-Mode-Default-Strings) → erst
  rendern, Jonas-OK, dann committen (CLAUDE.md-Regel)

Bereit? Schritt 0: Branch-Wechsel + Pflicht-Lektüre. Dann sag
Bescheid wenn ich Slice 1 (§10.1) anfangen soll.
```
