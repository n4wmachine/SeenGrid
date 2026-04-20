import { useEffect, useMemo, useState } from 'react'
import Picker from './picker/Picker.jsx'
import Workspace from './workspace/Workspace.jsx'
import casesConfig from '../../config/cases.config.json'
import modulesConfig from '../../config/modules.config.json'
import { WorkspaceStoreProvider, createInitialState } from '../../lib/workspaceStore.js'
import { WorkspaceHeaderProvider } from '../../context/WorkspaceHeaderContext.jsx'
import { usePageMeta } from '../../context/PageMetaContext.jsx'

/**
 * Grid Creator
 * Parent-Komponente mit State-Switch zwischen Picker und Workspace.
 *
 * Picker → `onPick` liefert `{ kind, caseId?, label, panelCount?,
 * defaultRoles?, presetId? }`. Aus der Selection leitet sich der
 * initial State des Workspace ab (Case, Panels, pre-aktivierte
 * Module aus `modules.config.json.compatibility`).
 *
 * FROM SCRATCH ist in v1 im Picker disabled (OPEN_DECISIONS #11) —
 * hier muss kein Fallback berücksichtigt werden, Scratch-Selection
 * kommt nicht an.
 *
 * YOUR PRESETS: v1 lädt nur den Case (caseId). Volle Preset-
 * Hydration (Panel-Inhalte, Module-States, Signatures) kommt mit
 * Token-Store Stufe 2 — siehe TODO(preset-hydration).
 */
export default function GridCreator() {
  const [mode, setMode] = useState('picker')
  const [selection, setSelection] = useState(null)
  const { setPageMeta } = usePageMeta()

  useEffect(() => {
    if (mode === 'picker') {
      setPageMeta({ title: 'Grid Creator', subtitle: 'choose a template to begin' })
    } else {
      setPageMeta({ title: 'Grid Creator', subtitle: null })
    }
  }, [mode, setPageMeta])

  function handlePick(pick) {
    setSelection(pick)
    setMode('workspace')
  }

  function handleBackToPicker() {
    setMode('picker')
    setSelection(null)
  }

  if (mode === 'workspace') {
    return (
      <WorkspaceHeaderProvider onBackToPicker={handleBackToPicker} currentProjectId={null}>
        <WorkspaceStoreProvider initial={initialFromSelection(selection)}>
          <Workspace />
        </WorkspaceStoreProvider>
      </WorkspaceHeaderProvider>
    )
  }

  return <Picker onPick={handlePick} />
}

/* -------------------- selection → initial state -------------------- */

function initialFromSelection(selection) {
  if (!selection) return createInitialState()

  const caseId = selection.caseId
  const caseDef = casesConfig.cases.find(c => c.id === caseId)

  // v1-Fallback: unbekannter Case → leerer Workspace (Picker sollte
  // das nicht durchlassen, aber wir crashen nicht).
  if (!caseDef) return createInitialState({ caseId })

  const panelCount = selection.panelCount ?? caseDef.panelCount ?? 4
  const defaultRoles = selection.defaultRoles ?? caseDef.defaultRoles ?? []

  const { rows, cols } = rowsColsForPanelCount(panelCount)

  const activeModules = modulesConfig.modules
    .filter(m => Array.isArray(m.compatibility) && m.compatibility.includes(caseId))
    .map(m => m.id)

  return createInitialState({
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
  // Objekt übernehmen. v1 lädt nur den Case.
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
