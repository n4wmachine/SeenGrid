# Engine Free-Mode — Spec v1

**Stand:** 2026-04-21
**Phase:** Planung (Konzept-Session, kein Code)
**Nachfolger:** Engine-Free-Mode-Bau (eigene Code-Session)

---

## 1. Zweck

Die v1-Engine ist hart case-zentriert (OPEN_DECISIONS #12, NUANCEN 14). FROM SCRATCH
im Picker ist deshalb disabled (OPEN_DECISIONS #11). Dieser Refactor entzerrt
das: ein case-loser Grid-Modus wird gleichwertig zu den Case-Modi, Cases werden
zu runtime-loadable Bundles, die UI bleibt weitgehend unberührt (dank
`registry.js` als Anchor, WORKSPACE_BUILD_STATUS_PART_C.md §Free-Mode-Isolation).

**Nicht Scope dieser Spec:**
- Neue Cases (Case-Build-Out ist eigene Phase)
- Token-Store / LookLab-Integration / LIB-Tab
- UI-Polish / Keyboard-Shortcuts
- Engine-Tests anfassen (die 42 bleiben grün)

---

## 2. Entscheidungs-Resumé (Chat 2026-04-21)

| # | Frage | Entscheidung |
|---|-------|--------------|
| W1 | Compiler-Architektur | Ein Dispatcher. `free_mode` ist Case #11 im selben Switch. |
| W2 | Panel-Fields im Free-Mode | Kein Schema. Generisches `content`-Textarea pro Panel (Fallback-Pfad, heute schon via `panel_content_fields`). Änderbar nach Tests. |
| W3 | Modul-Verfügbarkeit im Free-Mode | **Alle 13 Module frei.** Keine Filterung, keine Warnings. FROM SCRATCH = FROM SCRATCH. |
| W4 | Case-Bundle-Format | Hybrid: JSON deklarativ (Schema, Defaults, Compile-Order) + optionaler JS-Hook für custom Strategy (z.B. `panelRoleStrategy`). |
| W5 | Migration Case ↔ Free | Einbahnstraße **Case → Free**. "Convert to free mode"-Knopf im Workspace. Case-Panel-Count-Freiheit bleibt Case-Eigenschaft (Angle Study: 3/4/6/8). Wer andere Counts will, springt rüber ins Free. |

---

## 3. Free-Mode State-Shape

Heutiger Workspace-Store (`workspaceStore.js:37`) ist bereits case-agnostisch in
den UI-Feldern — `selectedCase` ist nur ein String. Der Free-Mode fügt keinen
neuen Shape hinzu, er nutzt `selectedCase === 'free_mode'` als Sentinel.

**Was im Free-Mode gilt / nicht gilt:**

| Feld | Case-Modus | Free-Mode |
|---|---|---|
| `selectedCase` | `"character_angle_study"` etc. | `"free_mode"` |
| `gridDims.rows × cols` | Case-Constraint (Angle Study: 3/4/6/8) | beliebig 1-N (Soft-Cap N=24 wegen Dim-Warning) |
| `panelOrientation` | vom Case default, user-overridable | user wählt |
| `panels[].role` | Strategy-Default (z.B. `front`) | `null` (kein Role-Dropdown im Inspector) |
| `panels[].fieldValues` | Case-Schema-Felder (z.B. `role`) | nur `content`-Freitext |
| `panels[].overrides` | gegen Case-Globals | gegen User-Globals (Modul-Inspector) |
| `panels[].customNotes` | frei | frei |
| `panels[].signatureId` | frei | frei |
| `activeModules` | Case-Compat-Whitelist pre-aktiviert | alle 13 verfügbar, nichts pre-aktiviert |
| `forbiddenElements` | frei | frei |
| `environmentMode` | frei | frei |
| `styleOverlayToken` | frei | frei |

**Keine neuen Action-Types nötig.** `SET_CASE` mit `caseId: 'free_mode'` reicht
— der Reducer macht das heute schon (`workspaceStore.js:101`) und fragt
`registry.getDefaultRolesForCase`, was für `free_mode` ein leeres Array
zurückgibt → alle Panels bekommen `role: null`. Saubere graceful degradation.

