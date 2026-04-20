/* ============================================================
   WORKSPACE STORE (session-lokal)
   React Context + useReducer. Hält den Grid-Edit-State des
   Workspace — Case, Dimensions, Orientation, Panels, Module,
   Signatures, Notes. Keine Persistenz (WORKSPACE_SPEC §15.1:
   flüchtig bei Page-Reload). Überlebt Rail-Wechsel innerhalb
   der SPA (Provider steht im GridCreator, nicht in der Rail-
   Route).

   Part A legt Shape + Actions. Part B/C verkabelt die UI.

   TODO(workspace-store): persistentes Dump-/Restore-Verhalten
   wenn Jonas später Session-Recovery will.
   ============================================================ */

import { createContext, createElement, useContext, useMemo, useReducer, useCallback } from 'react'
import { getRandomPool } from '../data/random/index.js'
import { getDefaultRolesForCase, getRandomFieldPoolMap } from './cases/registry.js'

/* ---- INITIAL STATE ---------------------------------------- */

const DEFAULT_GRID = { rows: 2, cols: 2 }
const DEFAULT_ORIENTATION = 'vertical'

function buildPanels(rows, cols, defaultRoles = []) {
  const total = Math.max(1, rows * cols)
  return Array.from({ length: total }, (_, i) => ({
    id: `panel-${i + 1}`,
    role: defaultRoles[i] || null,
    fieldValues: {},
    overrides: {},
    customNotes: '',
    signatureId: null,
  }))
}

export function createInitialState({
  caseId = null,
  rows = DEFAULT_GRID.rows,
  cols = DEFAULT_GRID.cols,
  orientation = DEFAULT_ORIENTATION,
  defaultRoles = [],
  activeModules = [],
} = {}) {
  return {
    selectedCase: caseId,
    gridDims: { rows, cols },
    panelOrientation: orientation,
    panels: buildPanels(rows, cols, defaultRoles),
    selectedPanelId: `panel-1`,
    activeModules: [...activeModules],
    customNotes: '',
    appliedSignature: null,
    forbiddenElements: [],
    referenceState: null,
    environmentMode: 'inherit',
    environmentCustomText: '',
    styleOverlayToken: '',
  }
}

/* ---- ACTION TYPES ----------------------------------------- */

export const ACTIONS = {
  SET_CASE: 'SET_CASE',
  SET_DIMS: 'SET_DIMS',
  SET_ORIENTATION: 'SET_ORIENTATION',
  SELECT_PANEL: 'SELECT_PANEL',
  SET_FIELD_VALUE: 'SET_FIELD_VALUE',
  SET_PANEL_ROLE: 'SET_PANEL_ROLE',
  SET_PANEL_OVERRIDE: 'SET_PANEL_OVERRIDE',
  CLEAR_PANEL_OVERRIDE: 'CLEAR_PANEL_OVERRIDE',
  SET_PANEL_NOTES: 'SET_PANEL_NOTES',
  RESET_PANEL: 'RESET_PANEL',
  TOGGLE_MODULE: 'TOGGLE_MODULE',
  SET_MODULE_ACTIVE: 'SET_MODULE_ACTIVE',
  SET_FORBIDDEN: 'SET_FORBIDDEN',
  SET_REFERENCE_STATE: 'SET_REFERENCE_STATE',
  SET_ENVIRONMENT_MODE: 'SET_ENVIRONMENT_MODE',
  SET_ENVIRONMENT_CUSTOM_TEXT: 'SET_ENVIRONMENT_CUSTOM_TEXT',
  SET_STYLE_OVERLAY_TOKEN: 'SET_STYLE_OVERLAY_TOKEN',
  APPLY_SIGNATURE: 'APPLY_SIGNATURE',
  REMOVE_SIGNATURE: 'REMOVE_SIGNATURE',
  APPLY_SIGNATURE_TO_PANEL: 'APPLY_SIGNATURE_TO_PANEL',
  DETACH_SIGNATURE_FROM_PANEL: 'DETACH_SIGNATURE_FROM_PANEL',
  RANDOMIZE_FIELDS: 'RANDOMIZE_FIELDS',
  RESET_ALL: 'RESET_ALL',
}

/* ---- REDUCER ---------------------------------------------- */

function updatePanel(state, panelId, patch) {
  return {
    ...state,
    panels: state.panels.map(p => (p.id === panelId ? { ...p, ...patch } : p)),
  }
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CASE: {
      const {
        caseId,
        defaultRoles,
        rows,
        cols,
        orientation,
        activeModules,
      } = action.payload || {}
      const nextRows = rows ?? state.gridDims.rows
      const nextCols = cols ?? state.gridDims.cols
      // Wenn defaultRoles vom Caller mitgegeben → benutzen, sonst aus
      // dem registry für den neuen Case ableiten.
      const roles =
        defaultRoles ??
        getDefaultRolesForCase(caseId, nextRows * nextCols)
      return {
        ...createInitialState({
          caseId,
          rows: nextRows,
          cols: nextCols,
          orientation: orientation ?? state.panelOrientation,
          defaultRoles: roles,
          activeModules: activeModules ?? state.activeModules,
        }),
      }
    }

    case ACTIONS.SET_DIMS: {
      const { rows, cols } = action.payload
      const total = Math.max(1, rows * cols)
      // Bug aus Part B "Bekannte offene Punkte": neue Panels bekamen
      // role: null. Jetzt vergeben wir die Strategy-Rolle für jeden
      // Index — alte Panels behalten ihre user-overrides, nur fehlende
      // Indizes werden frisch erzeugt.
      const strategyRoles = getDefaultRolesForCase(state.selectedCase, total)
      const existing = state.panels
      const nextPanels = Array.from({ length: total }, (_, i) => {
        if (existing[i]) return existing[i]
        return {
          id: `panel-${i + 1}`,
          role: strategyRoles[i] ?? null,
          fieldValues: {},
          overrides: {},
          customNotes: '',
          signatureId: null,
        }
      })
      const selectedPanelId =
        nextPanels.find(p => p.id === state.selectedPanelId)?.id || nextPanels[0]?.id || null
      return {
        ...state,
        gridDims: { rows, cols },
        panels: nextPanels,
        selectedPanelId,
      }
    }

    case ACTIONS.SET_ORIENTATION:
      return { ...state, panelOrientation: action.payload }

    case ACTIONS.SELECT_PANEL:
      return { ...state, selectedPanelId: action.payload }

    case ACTIONS.SET_FIELD_VALUE: {
      const { panelId, fieldId, value } = action.payload
      const panel = state.panels.find(p => p.id === panelId)
      if (!panel) return state
      return updatePanel(state, panelId, {
        fieldValues: { ...panel.fieldValues, [fieldId]: value },
      })
    }

    case ACTIONS.SET_PANEL_ROLE:
      return updatePanel(state, action.payload.panelId, { role: action.payload.role })

    case ACTIONS.SET_PANEL_OVERRIDE: {
      const { panelId, key, value } = action.payload
      const panel = state.panels.find(p => p.id === panelId)
      if (!panel) return state
      return updatePanel(state, panelId, {
        overrides: { ...panel.overrides, [key]: value },
      })
    }

    case ACTIONS.CLEAR_PANEL_OVERRIDE: {
      const { panelId, key } = action.payload
      const panel = state.panels.find(p => p.id === panelId)
      if (!panel) return state
      const nextOverrides = { ...panel.overrides }
      delete nextOverrides[key]
      return updatePanel(state, panelId, { overrides: nextOverrides })
    }

    case ACTIONS.SET_PANEL_NOTES:
      return updatePanel(state, action.payload.panelId, {
        customNotes: action.payload.notes,
      })

    case ACTIONS.RESET_PANEL: {
      const { panelId } = action.payload
      return updatePanel(state, panelId, {
        overrides: {},
        customNotes: '',
        signatureId: null,
      })
    }

    case ACTIONS.TOGGLE_MODULE: {
      const id = action.payload
      const isActive = state.activeModules.includes(id)
      return {
        ...state,
        activeModules: isActive
          ? state.activeModules.filter(m => m !== id)
          : [...state.activeModules, id],
      }
    }

    case ACTIONS.SET_MODULE_ACTIVE: {
      const { moduleId, active } = action.payload
      const isActive = state.activeModules.includes(moduleId)
      if (active && !isActive) {
        return { ...state, activeModules: [...state.activeModules, moduleId] }
      }
      if (!active && isActive) {
        return { ...state, activeModules: state.activeModules.filter(m => m !== moduleId) }
      }
      return state
    }

    case ACTIONS.SET_FORBIDDEN:
      return { ...state, forbiddenElements: [...action.payload] }

    case ACTIONS.SET_REFERENCE_STATE:
      return { ...state, referenceState: action.payload }

    case ACTIONS.SET_ENVIRONMENT_MODE:
      return { ...state, environmentMode: action.payload }

    case ACTIONS.SET_ENVIRONMENT_CUSTOM_TEXT:
      return { ...state, environmentCustomText: action.payload }

    case ACTIONS.SET_STYLE_OVERLAY_TOKEN:
      return { ...state, styleOverlayToken: action.payload }

    case ACTIONS.APPLY_SIGNATURE:
      return { ...state, appliedSignature: action.payload }

    case ACTIONS.REMOVE_SIGNATURE:
      return { ...state, appliedSignature: null }

    case ACTIONS.APPLY_SIGNATURE_TO_PANEL:
      return updatePanel(state, action.payload.panelId, {
        signatureId: action.payload.signatureId,
      })

    case ACTIONS.DETACH_SIGNATURE_FROM_PANEL:
      return updatePanel(state, action.payload.panelId, { signatureId: null })

    case ACTIONS.RANDOMIZE_FIELDS: {
      const { fieldPoolMap } = action.payload || {}
      if (!fieldPoolMap || Object.keys(fieldPoolMap).length === 0) return state
      const nextPanels = state.panels.map(panel => {
        const nextValues = { ...panel.fieldValues }
        Object.entries(fieldPoolMap).forEach(([fieldId, poolKey]) => {
          const pool = getRandomPool(poolKey)
          if (pool.length > 0) {
            nextValues[fieldId] = pool[Math.floor(Math.random() * pool.length)]
          }
        })
        return { ...panel, fieldValues: nextValues }
      })
      return { ...state, panels: nextPanels }
    }

    case ACTIONS.RESET_ALL: {
      const { defaultRoles, activeModules } = action.payload || {}
      const total = state.gridDims.rows * state.gridDims.cols
      const roles =
        defaultRoles ?? getDefaultRolesForCase(state.selectedCase, total)
      return createInitialState({
        caseId: state.selectedCase,
        rows: state.gridDims.rows,
        cols: state.gridDims.cols,
        orientation: state.panelOrientation,
        defaultRoles: roles,
        activeModules: activeModules ?? state.activeModules,
      })
    }

    default:
      return state
  }
}

/* ---- CONTEXT + HOOKS -------------------------------------- */

const WorkspaceStoreContext = createContext(null)

export function WorkspaceStoreProvider({ initial, children }) {
  const [state, dispatch] = useReducer(reducer, initial || createInitialState())

  const actions = useMemo(() => ({
    setCase: payload => dispatch({ type: ACTIONS.SET_CASE, payload }),
    setDims: (rows, cols) => dispatch({ type: ACTIONS.SET_DIMS, payload: { rows, cols } }),
    setOrientation: orientation =>
      dispatch({ type: ACTIONS.SET_ORIENTATION, payload: orientation }),
    selectPanel: panelId => dispatch({ type: ACTIONS.SELECT_PANEL, payload: panelId }),
    setFieldValue: (panelId, fieldId, value) =>
      dispatch({ type: ACTIONS.SET_FIELD_VALUE, payload: { panelId, fieldId, value } }),
    setPanelRole: (panelId, role) =>
      dispatch({ type: ACTIONS.SET_PANEL_ROLE, payload: { panelId, role } }),
    setPanelOverride: (panelId, key, value) =>
      dispatch({ type: ACTIONS.SET_PANEL_OVERRIDE, payload: { panelId, key, value } }),
    clearPanelOverride: (panelId, key) =>
      dispatch({ type: ACTIONS.CLEAR_PANEL_OVERRIDE, payload: { panelId, key } }),
    setPanelNotes: (panelId, notes) =>
      dispatch({ type: ACTIONS.SET_PANEL_NOTES, payload: { panelId, notes } }),
    resetPanel: panelId => dispatch({ type: ACTIONS.RESET_PANEL, payload: { panelId } }),
    toggleModule: moduleId => dispatch({ type: ACTIONS.TOGGLE_MODULE, payload: moduleId }),
    setModuleActive: (moduleId, active) =>
      dispatch({ type: ACTIONS.SET_MODULE_ACTIVE, payload: { moduleId, active } }),
    setForbidden: list => dispatch({ type: ACTIONS.SET_FORBIDDEN, payload: list }),
    setReferenceState: v => dispatch({ type: ACTIONS.SET_REFERENCE_STATE, payload: v }),
    setEnvironmentMode: v => dispatch({ type: ACTIONS.SET_ENVIRONMENT_MODE, payload: v }),
    setEnvironmentCustomText: v =>
      dispatch({ type: ACTIONS.SET_ENVIRONMENT_CUSTOM_TEXT, payload: v }),
    setStyleOverlayToken: v => dispatch({ type: ACTIONS.SET_STYLE_OVERLAY_TOKEN, payload: v }),
    applySignature: sigId => dispatch({ type: ACTIONS.APPLY_SIGNATURE, payload: sigId }),
    removeSignature: () => dispatch({ type: ACTIONS.REMOVE_SIGNATURE }),
    applySignatureToPanel: (panelId, signatureId) =>
      dispatch({ type: ACTIONS.APPLY_SIGNATURE_TO_PANEL, payload: { panelId, signatureId } }),
    detachSignatureFromPanel: panelId =>
      dispatch({ type: ACTIONS.DETACH_SIGNATURE_FROM_PANEL, payload: { panelId } }),
    randomizeFields: fieldPoolMap =>
      dispatch({ type: ACTIONS.RANDOMIZE_FIELDS, payload: { fieldPoolMap } }),
    resetAll: (opts = {}) =>
      dispatch({ type: ACTIONS.RESET_ALL, payload: opts }),
    resetAllToCaseDefaults: (caseId, activeModules) => {
      // Hard reset auf Case-Defaults: Roles via Strategy, Module
      // wieder auf compatibility-Liste.
      dispatch({
        type: ACTIONS.RESET_ALL,
        payload: { defaultRoles: undefined, activeModules },
      })
    },
    randomizeAll: (caseId, activeModules) => {
      const fieldPoolMap = getRandomFieldPoolMap(caseId, activeModules)
      dispatch({ type: ACTIONS.RANDOMIZE_FIELDS, payload: { fieldPoolMap } })
    },
  }), [])

  const value = useMemo(() => ({ state, dispatch, actions }), [state, actions])

  return createElement(WorkspaceStoreContext.Provider, { value }, children)
}

export function useWorkspaceStore() {
  const ctx = useContext(WorkspaceStoreContext)
  if (!ctx) throw new Error('useWorkspaceStore must be used within WorkspaceStoreProvider')
  return ctx
}

export function useWorkspaceState() {
  return useWorkspaceStore().state
}

export function useWorkspaceActions() {
  return useWorkspaceStore().actions
}

export function useSelectedPanel() {
  const state = useWorkspaceState()
  return state.panels.find(p => p.id === state.selectedPanelId) || null
}

export function useHasAnyPanelContent() {
  const state = useWorkspaceState()
  return useCallback(() => {
    return state.panels.some(p => Object.values(p.fieldValues).some(v => v && String(v).trim()))
  }, [state.panels])
}
