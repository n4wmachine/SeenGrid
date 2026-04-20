/* ============================================================
   PRESET STORE
   localStorage-basierter User-Preset-Store.

   v1: Save-as-New only (kein Update — siehe WORKSPACE_SPEC §10.6).
   Schema:
     {
       id:        string
       name:      string
       notes:     string
       caseId:    string
       panelCount:number
       createdAt: number
       modifiedAt:number
       workspaceState: <serialisierter workspaceStore-State>
     }

   Reactive: useGridPresets() liefert die aktuelle Liste, react-aware
   via einer einfachen Listener-Registry (kein Framework, kein
   Subscription-Lib — just enough).

   TODO(preset-hydration): loadWorkspaceFromPreset(preset) →
   workspaceStore.setCase + Panels + Module + Forbiddens hydrieren.
   v1 hat den Save-Pfad und einen Stub-Load via setCase.
   ============================================================ */

import { useEffect, useState } from 'react'

const LS_KEY = 'sg2.userPresets'

/* ---- READ ---- */

function readAll() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(LS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(list) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(list))
  } catch {
    // localStorage voll oder gesperrt — silent fail, UI zeigt Toast.
  }
  emit()
}

/* ---- LISTENER REGISTRY (mini reactive layer) ---- */

const listeners = new Set()

function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function emit() {
  listeners.forEach(fn => {
    try { fn() } catch {/* swallow */}
  })
}

/* ---- WRITE ---- */

export function saveWorkspaceAsPreset({ name, notes, workspaceState }) {
  const trimmed = (name || '').trim()
  if (trimmed.length < 2) {
    throw new Error('Preset name must be at least 2 characters.')
  }
  const list = readAll()
  if (list.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
    throw new Error('A preset with this name already exists.')
  }
  const now = Date.now()
  const panelCount = workspaceState?.panels?.length ?? 0
  const preset = {
    id: `preset-${now}-${Math.floor(Math.random() * 1e6)}`,
    name: trimmed,
    notes: notes || '',
    caseId: workspaceState?.selectedCase || null,
    panelCount,
    createdAt: now,
    modifiedAt: now,
    workspaceState: cloneState(workspaceState),
  }
  writeAll([preset, ...list])
  return preset
}

export function listUserPresets() {
  return readAll()
}

export function loadPreset(id) {
  return readAll().find(p => p.id === id) || null
}

export function deletePreset(id) {
  const next = readAll().filter(p => p.id !== id)
  writeAll(next)
}

/**
 * Hydratiert einen kompletten Preset-Snapshot zurück in den
 * workspaceStore. Caller braucht Zugriff auf actions (oder dispatch).
 *
 * v1-Pragma: Wir setzen Case + Dims + Module + Panel-Inhalte
 * sequentiell. Saubere "single dispatch"-Hydration kommt in einer
 * späteren Phase (TODO(preset-hydration)).
 */
export function loadWorkspaceFromPreset(preset, actions) {
  if (!preset || !preset.workspaceState || !actions) return
  const ws = preset.workspaceState
  actions.setCase({
    caseId: ws.selectedCase,
    rows: ws.gridDims?.rows,
    cols: ws.gridDims?.cols,
    orientation: ws.panelOrientation,
    activeModules: ws.activeModules,
  })
  // TODO(preset-hydration): nach setCase müssen Panel-Overrides,
  // Notes, Signatures, Forbiddens, environment, styleOverlay wieder
  // gesetzt werden. v1 lädt nur die Grundstruktur; volle Hydration
  // braucht ein dediziertes HYDRATE-Action im Reducer.
}

/* ---- HOOKS ---- */

export function useGridPresets() {
  const [list, setList] = useState(readAll)
  useEffect(() => {
    const unsubscribe = subscribe(() => setList(readAll()))
    return unsubscribe
  }, [])
  return list
}

/* ---- HELPERS ---- */

function cloneState(state) {
  // Strukturierter Clone via JSON — workspaceStore ist plain JS.
  try {
    return JSON.parse(JSON.stringify(state))
  } catch {
    return null
  }
}
