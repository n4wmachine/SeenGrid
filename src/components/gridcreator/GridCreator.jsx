import { useEffect } from 'react'
import Picker from './picker/Picker.jsx'
import Workspace from './workspace/Workspace.jsx'
import casesConfig from '../../config/cases.config.json'
import { useWorkspaceActions } from '../../lib/workspaceStore.js'
import {
  getCompatibleModuleIds,
  getDefaultRolesForCase,
} from '../../lib/cases/registry.js'
import { usePageMeta } from '../../context/PageMetaContext.jsx'

/**
 * Grid Creator
 * Prop-driven Dispatcher Picker/Workspace. Mode + Handler leben in
 * App.jsx, damit der ShellHeader (der oberhalb von GridCreator in
 * App.jsx rendert) denselben WorkspaceHeaderProvider sehen kann wie
 * der Workspace — sonst erscheint der Back-Button nie.
 *
 * Picker → `onPick` liefert `{ kind, caseId?, label, panelCount?,
 * defaultRoles?, presetId? }`. Aus der Selection leitet sich der
 * Workspace-State ab (Case, Panels, Module). App.jsx setzt mode auf
 * 'workspace' nach dem Pick.
 *
 * YOUR PRESETS: v1 lädt nur den Case. Volle Hydration kommt in
 * Token-Store Stufe 2 — siehe TODO(preset-hydration).
 */
export default function GridCreator({ mode, onPick }) {
  const { setPageMeta } = usePageMeta()
  const actions = useWorkspaceActions()

  useEffect(() => {
    if (mode === 'picker') {
      setPageMeta({ title: 'Grid Creator', subtitle: 'choose a template to begin' })
    } else {
      setPageMeta({ title: 'Grid Creator', subtitle: null })
    }
  }, [mode, setPageMeta])

  function handlePick(pick) {
    applyPickToStore(pick, actions)
    onPick(pick)
  }

  if (mode === 'workspace') {
    return <Workspace />
  }

  return <Picker onPick={handlePick} />
}

/* -------------------- selection → store -------------------- */

export function applyPickToStore(selection, actions) {
  if (!selection) return

  const caseId = selection.caseId

  // Free-Mode (FROM SCRATCH): case-los, alle 13 Module verfügbar.
  // Die zwei "always-visible"-Universals (panel_content_fields,
  // forbidden_elements_user) werden pre-aktiviert, sonst zeigen
  // ihre UI-Felder zwar Inputs an, der Wert landet aber nicht im
  // Output-JSON (Module-driven Gating, Slice 5 Option A).
  // Spec §3 / §6 / W3: alle anderen 11 Module bleiben aus.
  if (caseId === 'free_mode') {
    const panelCount = selection.panelCount ?? 4
    const { rows, cols } = rowsColsForPanelCount(panelCount)
    actions.setCase({
      caseId,
      rows,
      cols,
      orientation: 'vertical',
      defaultRoles: [],
      activeModules: ['panel_content_fields', 'forbidden_elements_user'],
    })
    return
  }

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
