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

---

## 4. Compiler-Architektur

**Heutiger Dispatcher** (`compiler/index.js:52`):

```
switch (state.case) {
  case "character_angle_study":  → compileAngleStudyJson(state)
  case "character_normalizer":   → compileNormalizerJson(state)
  default: throw
}
```

**Post-Refactor:**

```
switch (state.case) {
  case "character_angle_study":  → compileAngleStudyJson(state)   // unverändert
  case "character_normalizer":   → compileNormalizerJson(state)   // unverändert
  case "free_mode":              → compileFreeModeJson(state)     // NEU
  default: throw
}
```

**compileFreeModeJson — was es tut:**

1. Keine `COMPILE_ORDER` aus einem Case-Schema. Stattdessen **generische Compile-Order** fix im Serializer:
   `id → type → goal → references → style_overlay → layout → panels → environment → forbidden_elements → modules_extra`.
2. `panels` wird aus `state.panels[]` 1:1 gelesen (nicht aus einer Strategy abgeleitet).
   Jedes Panel: `{ index, content }` wenn `content` nicht leer, sonst `{ index }`.
3. `references`, `style_overlay`, `environment`, `forbidden_elements` laufen durch
   die existierenden Emit-Helper (sind schon case-agnostisch geschrieben) oder ihre
   Free-Mode-Varianten wenn nötig.
4. Aktive Module mit Global-/Per-Panel-Werten landen in `modules_extra` als
   serialisierter Block pro Modul. Reihenfolge: `activeModules[]`-Reihenfolge
   des Users (stabil). Details in §7.
5. Placeholder-Felder (`id`, `type`, `goal`) bekommen Free-Mode-Defaults
   (`"freestyle_grid_v1"`, `"user_defined"`, vom User überschreibbar). Jonas-Test
   entscheidet ob die Defaults bleiben.

**Was der Refactor am existierenden Code anfasst:**

- `compiler/index.js` — eine Zeile `case "free_mode":` + Import.
- `compiler/serializers/freeModeJson.js` — neu, ~80-120 Zeilen.
- `compileWorkspace.js:39` — `case 'free_mode'` zweig ergänzen, der `toFreeModeEngineState(ws)` ruft.
- **Nichts an `angle_study`/`normalizer` anfassen.** Deren 42 Tests bleiben grün
  weil deren Pfade unverändert sind.

---

## 5. Modul-Verfügbarkeit im Free-Mode

**Regel (W3):** Alle 13 Module aus `modules.config.json` sind im Free-Mode
verfügbar. Keine Filterung, keine Warnings.

**Konkret:**

- `registry.getCompatibleModuleIds('free_mode')` gibt **alle** 13 Modul-IDs zurück.
- Kein Pre-Aktivieren: im Free-Mode startet `activeModules` leer. User togglet
  bewusst rein was er will.
- Module mit UI-Infrastruktur die heute case-gebunden ist (`face_reference`
  braucht Reference-Slots in der Inspector-Global-Sektion, `multi_character`
  braucht Multi-Ref-UI) müssen ihre UI case-agnostisch bereitstellen. Wenn ein
  Modul heute nur für Character-Cases ein UI hat, muss das UI im Free-Mode
  genauso aktivierbar sein. Kein "Modul toggelbar aber UI fehlt".

**Schema-Erweiterung `modules.config.json`:**

Jedes Modul bekommt `"freeMode": true` in der Compatibility-Liste (alle, per
default). Wenn ein Modul zukünftig doch nicht im Free-Mode soll (unwahrscheinlich),
wird es dort explizit ausgeschlossen — aber v1-Default ist: alle drin.

---

## 6. UI-Konsequenzen

**Picker (`Picker.jsx`):**

- FROM SCRATCH-Card wird aktiv (OPEN_DECISIONS #11 aufgehoben).
- Click → `actions.setCase({ caseId: 'free_mode', rows: 2, cols: 2 })` →
  Workspace mit 4 leeren Panels, keine Rollen, keine vorausgewählten Module.
- `isCaseActive('free_mode')` → `true` (neben `character_angle_study`).

**Workspace CaseContext (`CaseContext.jsx`):**

- Kein Case-Readout-Block. Stattdessen Mini-Label `FREE MODE` (neutral, kein
  Gold — Gold ist für Signatures reserviert, NUANCEN 1).
- Dim-Matrix: rows/cols frei wählbar (1-6 × 1-6, damit ≤ 24 Panels für
  Dim-Advisory). Angle-Study-typischer Advisory (HIRES/STANDARD/LOW/TINY) bleibt
  gültig, basiert rein auf Pixel-pro-Panel.

**Workspace Inspector (`Inspector.jsx`):**

- Kein Role-Dropdown (nur Cases mit `hasRealSchema` zeigen eins).
- Per-Panel-Sektion zeigt das generische `content`-Textarea (heute schon der
  Fallback-Pfad wenn `!hasRealSchema`) + alle aktiven Per-Panel-Module.
- Override-Dot-Logik + Signature-Applied-Border bleiben unverändert.

**Workspace Canvas (`Canvas.jsx`):**

- Keine SVG-Silhouetten im Free-Mode (die sind an Rollen gekoppelt). Statt
  Silhouette: leeres Panel mit Panel-Nummer-Label und dem `content`-Preview
  (erste ~20 Zeichen des Textareas).
- Selected-Teal-Border + Override-Dot + Signature-Border bleiben.

**Workspace "Convert to Free Mode"-Action (W5):**

- Im Case-Workspace: sekundärer Knopf `convert to free mode` in der
  OutputBar-Leiste (nicht primary, um Copy-as-JSON nicht zu verdrängen).
- Bestätigungs-Dialog (analog Random/Reset-Confirm): "Convert to free mode?
  You lose case constraints, your panels and content stay."
- Aktion: `selectedCase` → `'free_mode'`, `panels[].role` → `null`, Rest bleibt.
- Einbahnstraße: im Free-Mode gibt's **keinen** Reverse-Knopf. Wer Case will,
  geht `back to picker` → Case klicken.

**Preset-Hydration:**

Ein gespeicherter Free-Mode-Preset hat `caseId: 'free_mode'` und lädt genauso
wie ein Case-Preset — `presetStore.loadWorkspaceFromPreset` braucht keinen
Sonderpfad, sobald `SET_CASE` `free_mode` akzeptiert (tut es mit §3).

