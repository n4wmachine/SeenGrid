# Workspace-Bau Status — Part C: Bugfixes + Bars + Save + Docs

**Stand:** 2026-04-20
**Branch:** `claude/seengrid-visual-overhaul-6RK4n`
**Vorgänger:** STATUS_PART_A, STATUS_PART_B
**Nachfolger:** Engine-Free-Mode-Planung

---

## Wo stehen wir

Part C abgeschlossen. Die 4 Manual-Test-Bugs sind gefixt, der Picker
ist auf den einen aktiven Case reduziert, alle 4 Bars sind live, der
Save-Popup + der User-Preset-Store laufen, Toasts sind app-weit
verdrahtet, Workspace-State überlebt Rail-Wechsel, SET_DIMS vergibt
Rollen korrekt, und die case-zentrierte Logik ist in `lib/cases/
registry.js` isoliert (Free-Mode-Refactor-Anchor).

Build: `npm run build` ✓ 2.44s. Engine-Tests: 3 file-suites (42
individuelle Tests) weiter grün.

---

## Stufe 0 — Bugfixes (Root-Cause-Fixes)

**Bug 1 & 3 gemeinsam: Legacy-Rollen-Leak.** Der Picker reichte
`cases.config.json.defaultRoles = ["front", "right", "left", "back"]`
durch, aber die Engine (+ Silhouette-Mapping + Role-Dropdown-Optionen)
nutzt die kanonischen Namen `right_profile` / `left_profile`. Panel
bekam `role: "right"` → dropdown zeigte nichts passendes, Silhouette
fiel auf Dashed-Rectangle zurück.

**Fix:**
1. `cases.config.json` für `character_angle_study` auf die
   kanonischen Rollen gesetzt (`["front", "right_profile",
   "left_profile", "back"]`).
2. Alle Default-Role-Ableitungen laufen jetzt über den zentralen
   Helper `getDefaultRolesForCase(caseId, panelCount)` aus
   `lib/cases/registry.js` — der ruft für `character_angle_study`
   direkt `panelRoleStrategy(panelCount)` auf.
3. Canvas hat einen defensiven Fallback: wenn `panel.role` nicht im
   Silhouette-Mapping ist, wird `strategyDefault[i]` verwendet.

**Bug 2: Fallback-Leak.** Der Inspector iterierte alle Module mit
`hasPerPanelSettings` und rendete für jedes ein Freitext-Feld —
darunter `panel_content_fields`, das als Catch-All für schema-lose
Cases gedacht ist. Bei `character_angle_study` (mit echtem Schema)
erschien dieses Feld zusätzlich zur Role-Dropdown.

**Fix:** `getPerPanelModulesForCase(caseId, activeModuleIds)` im
Registry unterdrückt `panel_content_fields` wenn der Case ein echtes
Schema hat. Zusätzlich: das generische "panel content"-Textarea im
Inspector ist jetzt **strikt** an `!hasRealSchema(caseId)` gekoppelt
(keine Modul-Abhängigkeit mehr).

**Bug 4: Inspector-Hints.** Jede Sektion bekommt einen knappen
Mono-Hint unter dem Label (`.fieldHint`-Klasse), und jedes Input hat
ein `title`-Attribut mit dem gleichen Text. Wortlaute aus
WORKSPACE_SPEC §6 abgeleitet.

---

## Stufe 1 — Picker-Scope (OPEN_DECISIONS #13)

Nur `character_angle_study` ist im Picker aktiv. Alle anderen 9
Core-Cards sind disabled, dashed-Border, `coming soon`-Badge rechts
oben an der Card. `isCaseActive(caseId)` aus dem Registry ist der
Gate. FROM SCRATCH bleibt disabled (OPEN_DECISIONS #11).

## Stufe 2 — OutputBar

- Links: `save as preset` (sekundär neutral) + `copy as json`
  (primary teal).
- Rechts: Token-Count (`~N tok`, warning-rot wenn > 8000) + Dim-
  Warning (`⚠ LOW @2K` / `⚠ TINY @2K`) wenn Quality unter STANDARD.
- Compile läuft über `lib/compileWorkspace.js` (Adapter Workspace-
  State → Engine-State → Compiler).
- Copy triggert `navigator.clipboard.writeText` + Toast `json copied`.
- Save öffnet das SavePresetDialog-Modal.

## Stufe 3 — PreviewStrip

Full-width unter der 3-Spalten-Row (NUANCEN 7). Mini-Silhouetten pro
Panel, Rollen-Label darunter, Klick → `selectPanel`. Selected
trägt Teal-Border, Signature-Applied trägt Gold-Border-Tint,
Override zeigt Gold-Dot (alle Signale koexistieren — NUANCEN 2).
`useOverflowDetection` triggert den Gradient-Fade rechts.

## Stufe 4 — SignaturesBar

Gold-Label `SIGNATURES` links (NUANCEN 1 + 16: Signature = nur
LookLab-Token, nicht Classics/Trendy). Applied-Cards (deduped aus
`panel.signatureId`) mit Gold-Border + Detach-×. `+ apply signature`
triggert Toast `signature picker coming soon` und trägt
`TODO(signature-picker)`.

## Stufe 5 — ModuleToolbar

Links: Modul-Chips datengetrieben aus `modules.config.json`,
gefiltert über `getCompatibleModuleIds(caseId)`. Aktive Chips haben
Teal-Border + Teal-BG. Klick toggled `activeModules`.

Rechts: `random` + `reset`. Beide öffnen einen ConfirmDialog bevor
sie zuschlagen. Random ruft `actions.randomizeAll(caseId,
activeModules)` → nutzt `getRandomFieldPoolMap(...)` aus dem
Registry. Reset ruft `actions.resetAllToCaseDefaults(caseId,
compatibleIds)` → voller Rollback auf Case-Defaults.

## Stufe 6 — SavePresetDialog

Center-Modal (Overlay `rgba(0,0,0,0.65)`, 460px), auto-Focus auf
Name-Input. Felder:

- `name` (required, ≥ 2 Zeichen, Default `{case} · YYYY-MM-DD`).
- `notes` (optional textarea).
- Preview-Chip oben: `CASE · character angle study`.

Buttons: Cancel (Overlay/Escape) + Save (disabled bis Name valid).
Save schreibt via `saveWorkspaceAsPreset(...)` in `localStorage`
unter Key `sg2.userPresets` und triggert Toast
`preset '<name>' saved`. Namens-Kollision zeigt Inline-Error unter
dem Input.

v1 macht bewusst **nur Save-as-New** (WORKSPACE_SPEC §10.6). Die 4
Checkboxen aus §10 (What to include / Where to save) kommen mit
Token-Store Stufe 2.

## Stufe 7 — presetStore

`src/lib/presetStore.js` komplett ersetzt. Public API:

- `saveWorkspaceAsPreset({name, notes, workspaceState})`
- `listUserPresets()`, `loadPreset(id)`, `deletePreset(id)`
- `loadWorkspaceFromPreset(preset, actions)` (v1-Stub:
  `actions.setCase(...)` mit case + dims + activeModules; voller
  Panel-Hydrate-Pfad trägt `TODO(preset-hydration)`)
- `useGridPresets()` React-Hook mit Listener-Registry (reactive
  ohne Lib).

localStorage-Schema:

```
{ id, name, notes, caseId, panelCount, createdAt, modifiedAt,
  workspaceState: <JSON snapshot of store state> }
```

## Stufe 8 — Wiring

- `App.jsx` wrapped jetzt `<WorkspaceStoreProvider>` +
  `<ToastProvider>` um den gesamten Shell-Content. Damit überlebt
  der Workspace-State den Rail-Wechsel (WORKSPACE_SPEC §15.1),
  und Toasts können aus jeder Page gefeuert werden.
- `GridCreator.jsx` legt keinen eigenen Store mehr an — nur noch
  den WorkspaceHeaderProvider + einen `useEffect`, der bei
  Re-Mount auf `workspace` springt wenn der Store noch einen Case
  hält.
- `workspaceStore.SET_DIMS` vergibt neuen Panels jetzt die
  Strategy-Rolle (via Registry), nicht mehr `null`.
- `workspaceStore.SET_CASE` akzeptiert `activeModules` im Payload
  und leitet `defaultRoles` ab wenn nicht mitgegeben.
- Neue Actions: `randomizeAll(caseId, activeModules)` und
  `resetAllToCaseDefaults(caseId, activeModules)`.

## Free-Mode-Isolation (kritischer Post-v1-Enabler)

**Neue Datei:** `src/lib/cases/registry.js`

Alle case-zentrierten Abfragen laufen **ausschließlich** über
diese Datei. Keine `if (caseId === '...')`-Zweige mehr in
UI-Komponenten.

Public API:

- `getPanelFieldsSchema(caseId)` → Schema-Array oder `[]`
- `hasRealSchema(caseId)` → bool
- `isCaseActive(caseId)` → `true` für `character_angle_study`,
  sonst `false`
- `getDefaultRolesForCase(caseId, panelCount)` → Rollen-Array
- `getStrategyDefaultForPanel(caseId, index, total)`
- `getCompatibleModuleIds(caseId)`
- `getPerPanelModulesForCase(caseId, activeModuleIds)`
- `getRandomFieldPoolMap(caseId, activeModuleIds)`

Konsumiert in: `Inspector.jsx`, `Canvas.jsx`, `PreviewStrip.jsx`,
`ModuleToolbar.jsx`, `GridCreator.jsx`, `Picker.jsx`,
`workspaceStore.js`, `compileWorkspace.js`.

`TODO(free-mode)`-Marker im Header. Der Engine-Free-Mode-Refactor
ersetzt **nur** diese Datei + den Compiler — die UI-Schicht bleibt
unberührt.

## Files neu / geändert / gelöscht

**Neu:**
- `src/lib/cases/registry.js`
- `src/lib/compileWorkspace.js`
- `src/lib/tokenCount.js`
- `src/components/gridcreator/workspace/OutputBar.jsx`
- `src/components/gridcreator/workspace/OutputBar.module.css`
- `src/components/gridcreator/workspace/PreviewStrip.jsx`
- `src/components/gridcreator/workspace/PreviewStrip.module.css`
- `src/components/gridcreator/workspace/SignaturesBar.jsx`
- `src/components/gridcreator/workspace/SignaturesBar.module.css`
- `src/components/gridcreator/workspace/ModuleToolbar.jsx`
- `src/components/gridcreator/workspace/ModuleToolbar.module.css`
- `src/components/gridcreator/workspace/SavePresetDialog.jsx`
- `src/components/gridcreator/workspace/SavePresetDialog.module.css`

**Geändert:**
- `src/App.jsx` (WorkspaceStoreProvider + ToastProvider app-weit)
- `src/components/gridcreator/GridCreator.jsx` (Store lebt oben,
  `applyPickToStore` statt `initialFromSelection`)
- `src/components/gridcreator/workspace/Workspace.jsx` (Platzhalter
  durch echte Bars ersetzt)
- `src/components/gridcreator/workspace/Workspace.module.css`
  (Zone-Styles aufgeräumt — Bars setzen Höhe selbst)
- `src/components/gridcreator/workspace/Inspector.jsx` (Registry-
  Lookup, strict Fallback, Field-Hints, Hook-Order korrigiert)
- `src/components/gridcreator/workspace/Inspector.module.css`
  (`.fieldHint`)
- `src/components/gridcreator/workspace/Canvas.jsx` (Registry-
  Lookup + Silhouette-Fallback)
- `src/components/gridcreator/workspace/FieldRenderer.jsx` (title-
  Prop)
- `src/components/gridcreator/picker/Picker.jsx`
  (`isCaseActive`-Gate, `CoreCard` disabled-State)
- `src/components/gridcreator/picker/Picker.module.css`
  (`.cardDisabled`, `.cardComing`, `.cardTitleRow`)
- `src/lib/workspaceStore.js` (SET_CASE / SET_DIMS / RESET_ALL +
  neue Actions)
- `src/lib/presetStore.js` (localStorage-basierter Store)
- `src/config/cases.config.json` (kanonische Rollen für
  angle_study)

## Verifikation

**Automatisch:**
- `npm run build` ✓ (2.44s, keine Warnings).
- Engine-Tests: `node --test` auf allen 3 Suites ✓ (42 individuelle
  Tests).
- Vite dev-server startet, alle neuen Module transformieren (200er
  auf `/src/lib/*` und `/src/components/.../workspace/*.jsx`).

**Manuell-interaktiv:**
- **Honest-Flag:** Der Claude-CLI-Runtime hat keinen Browser, also
  ist kein Click-Through-Test möglich. Jonas muss stichprobenweise
  prüfen:
  1. Picker: alle 9 Cards außer `character angle study` sind
     disabled + `coming soon`-Badge. Klick darauf tut nichts.
  2. `character angle study` klicken → Workspace mit 4 Panels,
     Panel 1 Teal-selected, Silhouetten sichtbar, ROLE-Dropdown
     zeigt alle 8 Views.
  3. ROLE ändern → Override-Dot erscheint am Panel + an dessen
     Thumb im Preview-Strip + `overriding global`-Badge im
     Inspector.
  4. Copy-Button → Toast `json copied`, Clipboard hat JSON.
  5. Save-Button → Modal öffnet, Name pre-filled, Save schreibt
     in localStorage (DevTools: Application → Storage →
     `sg2.userPresets`).
  6. Module-Chip togglen → Chip-Border wechselt Teal ↔ neutral.
  7. Random (wenn Felder leer → direkt; wenn nicht leer →
     ConfirmDialog). Reset → ConfirmDialog immer.
  8. Rail-Wechsel (z.B. Home → Grid): zurück → Workspace-State
     ist noch da (gleicher Panel selected, gleiche Overrides).
  9. Dim-Matrix auf (3×2 = 6 Panels) klicken → Canvas zeichnet
     6 Silhouetten, Inspector zeigt `panel 1 · front`.
  10. Forbidden Elements: Text + Enter → Chip, Klick × → weg.
  11. Token-Count in Output-Bar ändert sich live bei Toggles.
  12. Dim-Warning in Output-Bar erscheint wenn Dim-Matrix auf
      `6 × 4 = 24 panels` geklickt wird (Quality TINY @2K).

## Bekannte offene Punkte

- **TODO(preset-hydration):** `loadWorkspaceFromPreset` setzt v1
  nur `setCase(...)`. Panel-Inhalte, Overrides, Signatures werden
  beim Re-Open noch nicht hydriert — eigene HYDRATE-Action im
  Reducer kommt mit Token-Store Stufe 2.
- **TODO(signature-picker):** `+ apply signature` in der
  Signatures-Bar feuert nur Toast. Echter Library-Picker kommt mit
  Token-Store Stufe 1.
- **TODO(free-mode):** Case-zentrale Logik konzentriert in
  `lib/cases/registry.js`. Engine-Free-Mode-Session (eigene Phase)
  baut die freien Pfade.
- **TODO(projects-store):** ShellHeader-Projekt-Dropdown aus Part A
  unverändert.
- **TODO(looklab-jump):** Inspector-Signature-Card Body-Klick hat
  weiterhin keinen Effekt.
- **TODO(workspace-persist):** Session-Persistenz löst nach
  Rail-Wechsel durch hochgezogenen Provider. Page-Reload-
  Persistenz (localStorage-Dump) ist nicht gebaut — bewusst, v1
  Spec §15.1.

---

**Ende Status Part C.**
