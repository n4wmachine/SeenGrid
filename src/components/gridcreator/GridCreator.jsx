import { useEffect, useState } from 'react'
import Picker from './picker/Picker.jsx'
import Workspace from './workspace/Workspace.jsx'
import casesConfig from '../../config/cases.config.json'
import {
  useWorkspaceActions,
  useWorkspaceState,
} from '../../lib/workspaceStore.js'
import {
  getCompatibleModuleIds,
  getDefaultRolesForCase,
} from '../../lib/cases/registry.js'
import { WorkspaceHeaderProvider } from '../../context/WorkspaceHeaderContext.jsx'
import { usePageMeta } from '../../context/PageMetaContext.jsx'

/**
 * Grid Creator
 * Parent-Komponente mit State-Switch zwischen Picker und Workspace.
 *
 * Picker → `onPick` liefert `{ kind, caseId?, label, panelCount?,
 * defaultRoles?, presetId? }`. Aus der Selection leitet sich der
 * Workspace-State ab (Case, Panels, Module). Das Reset läuft via
 * `actions.setCase(...)` — der WorkspaceStoreProvider lebt in
 * App.jsx (Rail-Wechsel-Persistenz, WORKSPACE_SPEC §15.1).
 *
 * FROM SCRATCH ist im Picker disabled (OPEN_DECISIONS #11).
 *
 * YOUR PRESETS: v1 lädt nur den Case. Volle Hydration kommt in
 * Token-Store Stufe 2 — siehe TODO(preset-hydration).
 */
export default function GridCreator() {
  const [mode, setMode] = useState('picker')
  const { setPageMeta } = usePageMeta()
  const actions = useWorkspaceActions()
  const state = useWorkspaceState()

  useEffect(() => {
    if (mode === 'picker') {
      setPageMeta({ title: 'Grid Creator', subtitle: 'choose a template to begin' })
    } else {
      setPageMeta({ title: 'Grid Creator', subtitle: null })
    }
  }, [mode, setPageMeta])

  // Re-Mount-Check: wenn der Store noch einen Case hält (Rail-Wechsel-
  // Persistenz), springen wir direkt zurück in den Workspace.
  useEffect(() => {
    if (state.selectedCase && mode === 'picker') {
      setMode('workspace')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handlePick(pick) {
    applyPickToStore(pick, actions)
    setMode('workspace')
  }

  function handleBackToPicker() {
    // Workspace-State bewusst NICHT zurücksetzen — User kommt zurück,
    // sieht denselben Stand. Reset passiert nur explizit über Picker-
    // Auswahl (setCase wirft den Store).
    setMode('picker')
  }

  if (mode === 'workspace') {
    return (
      <WorkspaceHeaderProvider onBackToPicker={handleBackToPicker} currentProjectId={null}>
        <Workspace />
      </WorkspaceHeaderProvider>
    )
  }

  return <Picker onPick={handlePick} />
}

/* -------------------- selection → store -------------------- */

function applyPickToStore(selection, actions) {
  if (!selection) return

  const caseId = selection.caseId
  const caseDef = casesConfig.cases.find(c => c.id === caseId)
  if (!caseDef) return

  const panelCount = selection.panelCount ?? caseDef.panelCount ?? 4
  const { rows, cols } = rowsColsForPanelCount(panelCount)
  const defaultRoles = getDefaultRolesForCase(caseId, panelCount)
  const activeModules = getCompatibleModuleIds(caseId)

  actions.setCase({
    caseId,
    rows,
    cols,
    orientation: 'vertical',
    defaultRoles,
    activeModules,
  })

  // TODO(preset-hydration): bei selection.kind === 'preset' auch
  // Panel-fieldValues, Overrides, Module-Overrides, forbiddenElements,
  // environmentMode, styleOverlayToken, signatures aus dem Preset-
  // Objekt übernehmen. Erste Stufe via presetStore.loadWorkspaceFromPreset
  // (siehe Part C presetStore-Erweiterung).
}

/**
 * Default-Layout pro panel_count. Der User kann in der Dimensions-
 * Matrix jederzeit umstellen; dies ist nur der initiale Fit.
 */
function rowsColsForPanelCount(panelCount) {
  switch (panelCount) {
    case 2: return { rows: 1, cols: 2 }
    case 3: return { rows: 1, cols: 3 }
    case 4: return { rows: 1, cols: 4 }
    case 6: return { rows: 2, cols: 3 }
    case 8: return { rows: 2, cols: 4 }
    case 9: return { rows: 3, cols: 3 }
    default: {
      const cols = Math.min(4, Math.max(1, panelCount))
      const rows = Math.max(1, Math.ceil(panelCount / cols))
      return { rows, cols }
    }
  }
}
