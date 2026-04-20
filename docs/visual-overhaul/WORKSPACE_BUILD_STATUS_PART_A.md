# Workspace-Bau Status — Part A: Foundation + Infra

**Stand:** 2026-04-20
**Branch:** `claude/seengrid-visual-overhaul-6RK4n`
**Vorgänger:** STARTPROMPT.md (Part A), WORKSPACE_SPEC_V1.md, HANDOFF_WORKSPACE_TO_CODE.md

---

## Wo stehen wir

**Part A abgeschlossen.** Foundation + generische UI-Infra liegen. Workspace-Komponente selbst noch nicht gebaut (Part B). Der bestehende `WorkspacePlaceholder.jsx` läuft unverändert weiter, GridCreator-State-Switch unangetastet. Kein Crash, Build grün (`npm run build` ✓).

---

## Was gebaut wurde

### Stufe 1 — Daten + Libs

- **`src/lib/dimAdvisory.js`** — `getDimAdvice(rows, cols)` aus Git-History `13ca30f~1` portiert. 4 Quality-Stufen `HIRES / STANDARD / LOW / TINY` (uppercase). Thresholds unverändert: 1024 / 512 / 256. Exports: `getDimAdvice`, `QUALITY_LABELS`, `QUALITY_DESCRIPTIONS`, `isWarningQuality`.
- **`src/config/modules.config.json`** — 13 Module aus `MODULE_AND_CASE_CATALOG.md`. Pro Modul: `id`, `displayName` (lowercase natural), `category`, `hasGlobalSettings`, `hasPerPanelSettings`, `compatibility` (Case-IDs für Pre-Aktivierung; `●`-Cases ausgenommen, `—`-Cases ausgenommen).
- **`src/data/signatures.stub.json`** — 4 Dummies (prisoners-noir, kurosawa-rain, pastel-grain, deakins-dusk). `TODO(token-store)` ersetzt das in Token-Store-Stufe 1.
- **`src/data/projects.stub.json`** — 3 Dummies analog Continue-Band (tokio-kurzfilm, laundromat-kapitel-1, berlin-doku) + `noProjectId: null`.
- **`src/data/random/*.json`** — Legacy-Pools belassen (actions, atmospheres, moods, scene-patterns, sensory-details, settings, subjects, textures). Neu ergänzt: `expressions`, `outfits`, `zones`, `camera-angles`, `poses`, `objects`, `weather`, `scene-descriptions`. Strikte Dropdown-Enums (`view`, `framing`) bewusst nicht als Pool — Random respektiert Schema (Spec §11.2).
- **`src/data/random/index.js`** — Mapper. Exports: `getRandomPool(key)`, `pickRandom(key)`, `hasPool(key)`, `RANDOM_POOL_KEYS`. Aliase mappen Field-Type-IDs + Modul-IDs auf canonical Pool-Keys (z.B. `wardrobe → outfits`, `expression_emotion → expressions`).
- **`src/lib/workspaceStore.js`** — React Context + useReducer (keine neue Dep). Session-lokal, flüchtig bei Reload. Exports: `WorkspaceStoreProvider`, `useWorkspaceStore`, `useWorkspaceState`, `useWorkspaceActions`, `useSelectedPanel`, `useHasAnyPanelContent`, `createInitialState`, `ACTIONS`. Datei nutzt `React.createElement` (kein JSX), damit `.js`-Endung passt.

### Stufe 2 — Generische UI-Infra

- **`src/components/ui/Toast.jsx`** + **`Toast.module.css`** — Einzelner Toast. Auto-Dismiss 3000ms, Pause-on-Hover, Slide-in/out 180ms. Border-Tint per Typ (success=teal, error=amber, info=neutral), Body neutral.
- **`src/components/ui/ToastProvider.jsx`** + **`ToastProvider.module.css`** — Stack bottom-right, Offset = `var(--sg2-outputbar-height) + 24px`. Max 3 sichtbar (älteste fällt raus). Exports: default `ToastProvider`, named `useToast()`.
- **`src/components/ui/ConfirmDialog.jsx`** + **`ConfirmDialog.module.css`** — Center-Modal. Default-Focus auf Cancel, Enter = Confirm, Escape = Cancel, Overlay-Klick = Cancel. Props: `open`, `title`, `message`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel`, `destructive` (optional, Confirm-Button-Tint).

### Stufe 3 — ShellHeader-Erweiterung

- **`src/context/WorkspaceHeaderContext.jsx`** — Neuer Context. Exports: `WorkspaceHeaderProvider`, `useWorkspaceHeader`. Provider-Props: `onBackToPicker`, `currentProjectId`, `onSelectProject`, `onCreateProject`. Wenn Context fehlt → ShellHeader rendert wie zuvor (Picker, Landing unangetastet).
- **`src/components/shell/ShellHeader.jsx`** — Rendert je nach `useWorkspaceHeader()`-Wert: Default-Branch unverändert, Workspace-Branch zeigt Back-Button + `grid creator` + Bullet + Projekt-Trigger mit `▾`. Liest Projekte direkt aus `projects.stub.json`.
- **`src/components/shell/ShellHeader.module.css`** — Workspace-Klassen ergänzt: `.backBtn`, `.pageTitle`, `.projectAnchor` (mit `::before`-Bullet), `.projectTrigger`, `.projectLabel`, `.projectCaret`. Teal/neutral, kein Gold (NUANCEN 1).
- **`src/components/shell/ProjectMenu.jsx`** + **`ProjectMenu.module.css`** — Inline-Dropdown unter Anchor. Click-Outside, Keyboard (`ArrowUp/Down`, `Enter`, `Escape`). Entries: `[no project]` → Projekt-Liste → Separator → `+ new project` (`TODO(projects-store)`) → `open project page →` (`TODO(projects-store)`). Currently-active mit `✓`.

---

## Was bewusst NICHT angefasst wurde (Part B/C-Scope)

- `src/components/gridcreator/GridCreator.jsx` — State-Switch `picker`/`workspace` bleibt. Part C verkabelt `WorkspaceHeaderProvider` + `WorkspaceStoreProvider` um die Workspace-Komponente.
- `src/components/gridcreator/WorkspacePlaceholder.jsx` — bleibt aktiv bis Part B die echte `Workspace.jsx` baut. Part B/C löscht den Placeholder.
- `src/lib/presetStore.js` — unberührt. Part C erweitert um echtes `addPreset()` + `useGridPresets()` mit State+Subscription.
- Grid Engine (`src/lib/cases/`, `src/lib/compiler/`) — komplett unberührt, 42 Tests bleiben grün.
- Alle bestehenden Komponenten (Landing, Picker, Rail, Masthead, Continue-Strip, etc.).

---

## Verifikation

- `npm run build` läuft sauber durch (1.40s, keine Errors, keine Warnings zur neuen Codebase).
- ShellHeader-Default-Pfad unverändert (Picker, Landing rendern wie vorher).
- WorkspacePlaceholder läuft weiter (kein State-Switch verändert).

---

## Anschluss-Punkte für Part B / Part C

### Hooks + Provider

| Symbol | Quelle | Zweck |
|---|---|---|
| `WorkspaceStoreProvider` | `src/lib/workspaceStore.js` | Wrap Workspace.jsx (Part B) + Inspector. Optional `initial` prop. |
| `useWorkspaceStore()` | `src/lib/workspaceStore.js` | Liefert `{ state, dispatch, actions }`. |
| `useWorkspaceState()` | `src/lib/workspaceStore.js` | Nur State (read-only). |
| `useWorkspaceActions()` | `src/lib/workspaceStore.js` | Nur Actions (Schreib-Pfade). |
| `useSelectedPanel()` | `src/lib/workspaceStore.js` | Aktuell selektiertes Panel-Objekt oder `null`. |
| `useHasAnyPanelContent()` | `src/lib/workspaceStore.js` | Returns Callback → `boolean` für Random-Confirm-Trigger. |
| `WorkspaceHeaderProvider` | `src/context/WorkspaceHeaderContext.jsx` | Wrap Workspace-Mode in GridCreator (Part C). Aktiviert Back-Button + Projekt-Dropdown im ShellHeader. |
| `useWorkspaceHeader()` | `src/context/WorkspaceHeaderContext.jsx` | Liest Workspace-Header-Slots (in ShellHeader bereits konsumiert). |
| `ToastProvider` | `src/components/ui/ToastProvider.jsx` | App-weit (Part C platziert es um die Workspace-Page oder höher in App.jsx). |
| `useToast()` | `src/components/ui/ToastProvider.jsx` | `{ toast(message, type?, options?), dismiss(id) }`. Types: `'success' \| 'error' \| 'info'`. |
| `ConfirmDialog` | `src/components/ui/ConfirmDialog.jsx` | Default-Component. Props siehe Datei-Header. |

### Store-Actions (alle in `actions` aus `useWorkspaceStore()`)

```
setCase({ caseId, defaultRoles, rows?, cols?, orientation? })
setDims(rows, cols)
setOrientation('vertical' | 'horizontal' | 'square')
selectPanel(panelId)
setFieldValue(panelId, fieldId, value)
setPanelRole(panelId, role)
setPanelOverride(panelId, key, value)
clearPanelOverride(panelId, key)
setPanelNotes(panelId, notes)
resetPanel(panelId)
toggleModule(moduleId)
setModuleActive(moduleId, active)
setForbidden(list)
setReferenceState(value)
setEnvironmentMode('inherit' | 'neutral_studio' | 'custom_text')
setEnvironmentCustomText(text)
setStyleOverlayToken(token)
applySignature(signatureId)            // grid-weit (Bar)
removeSignature()                      // grid-weit
applySignatureToPanel(panelId, signatureId)   // pro Panel (Inspector)
detachSignatureFromPanel(panelId)
randomizeFields(fieldPoolMap)          // { fieldId: poolKey, ... }
resetAll(defaultRoles)
```

### State-Shape

```
{
  selectedCase: string|null,
  gridDims: { rows: number, cols: number },
  panelOrientation: 'vertical'|'horizontal'|'square',
  panels: [{ id, role, fieldValues, overrides, customNotes, signatureId }],
  selectedPanelId: string|null,
  activeModules: string[],            // module-IDs
  customNotes: string,                // grid-weit
  appliedSignature: string|null,
  forbiddenElements: string[],
  referenceState: 'clean_full_body'|'needs_normalization'|null,
  environmentMode: 'inherit'|'neutral_studio'|'custom_text',
  environmentCustomText: string,
  styleOverlayToken: string,
}
```

### Dim-Advisory-API

```js
import { getDimAdvice, QUALITY_LABELS, isWarningQuality } from '../lib/dimAdvisory.js'

const advice = getDimAdvice(rows, cols)
// advice = { panelW2K, panelH2K, panelW4K, panelH4K, quality, shortest2K }
// quality ∈ { 'HIRES', 'STANDARD', 'LOW', 'TINY' }
isWarningQuality(advice.quality) // true if LOW or TINY → trigger Output-Bar-Warning
```

### Random-Pool-API

```js
import { getRandomPool, pickRandom } from '../data/random/index.js'

getRandomPool('expression_emotion') // → expressions[]
pickRandom('action')                // → ein zufälliger string oder null
```

### Module-Config-Lesepfad

```js
import modulesConfig from '../config/modules.config.json'
const allModules = modulesConfig.modules
const preActiveForCase = allModules.filter(m => m.compatibility.includes(caseId))
```

---

## Bekannte offene Punkte

- **Workspace-Komponente selbst** — nicht in Part A. Part B baut `Workspace.jsx`, `CaseContext.jsx`, `Canvas.jsx`, `Inspector.jsx`.
- **`WorkspacePlaceholder.jsx`** — wird in Part B/C entfernt sobald die echte `Workspace.jsx` läuft.
- **Verkabelung von WorkspaceHeaderProvider in GridCreator** — Part C. Aktuell hat noch keine Page den Provider, also rendert ShellHeader weiterhin im Default-Branch (PageMeta).
- **`presetStore.js`** — Part C ersetzt `EMPTY_PRESETS`-Stub durch echten reaktiven Store.
- **`+ new project` Inline-Input** — heute Stub-Trigger (`onCreateProject`), Inline-Edit kommt mit Projekt-Store-Phase (`TODO(projects-store)`).
- **Random-Pool-Erweiterung** — pragmatische Defaults gesetzt (8-15 Einträge je Pool), kann jederzeit additiv erweitert werden ohne Code-Change.

---

## TODO-Marker im Code

| Marker | Wo | Bedeutung |
|---|---|---|
| `TODO(token-store)` | `src/data/signatures.stub.json` (implizit via Doc) | Stub durch Token-Store Stufe 1 ersetzen. |
| `TODO(projects-store)` | `src/components/shell/ProjectMenu.jsx` (`triggerEntry` für `new-project` + `open-page`), `src/context/WorkspaceHeaderContext.jsx` (Header-Kommentar) | Echter Projekt-Store mit Inline-Input + Projekt-Page. |
| `TODO(workspace-store)` | `src/lib/workspaceStore.js` (Header-Kommentar) | Persistentes Dump/Restore wenn Session-Recovery gewünscht. |

`TODO(looklab-jump)` und `TODO(routing)` sind Part B/C-Scope, in Part A nicht gepflanzt.

---

**Ende Status Part A.**
