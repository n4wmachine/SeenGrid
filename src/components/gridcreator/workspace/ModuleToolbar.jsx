import { useMemo, useState } from 'react'
import {
  useWorkspaceState,
  useWorkspaceActions,
  useHasAnyPanelContent,
} from '../../../lib/workspaceStore.js'
import modulesConfig from '../../../config/modules.config.json'
import { getCompatibleModuleIds } from '../../../lib/cases/registry.js'
import ConfirmDialog from '../../ui/ConfirmDialog.jsx'
import styles from './ModuleToolbar.module.css'

/**
 * Module-Toolbar (52px, full-width). WORKSPACE_SPEC §3.
 *
 * Links: Modul-Chips datengetrieben aus modules.config.json. Pre-
 * aktivierte Module aus Case-Compatibility. Klick toggled.
 *
 * Rechts: random + reset, beide mit ConfirmDialog wenn Panels schon
 * Inhalt haben.
 */
export default function ModuleToolbar() {
  const state = useWorkspaceState()
  const actions = useWorkspaceActions()
  const hasContentFn = useHasAnyPanelContent()

  const compatibleIds = useMemo(
    () => getCompatibleModuleIds(state.selectedCase),
    [state.selectedCase]
  )

  // Modul-Chips: alle Module die für diesen Case kompatibel sind +
  // alle aktiven (auch wenn nicht-kompatibel toggle erlaubt sein soll —
  // hier strikt: nur kompatible werden gezeigt, NUANCEN 14 sagt v1
  // bleibt case-zentriert).
  const visibleModules = useMemo(() => {
    const set = new Set(compatibleIds)
    return modulesConfig.modules.filter(m => set.has(m.id))
  }, [compatibleIds])

  const [confirm, setConfirm] = useState(null) // 'random' | 'reset' | null

  function requestRandom() {
    if (hasContentFn()) setConfirm('random')
    else doRandom()
  }
  function doRandom() {
    actions.randomizeAll(state.selectedCase, state.activeModules)
    setConfirm(null)
  }

  function requestReset() {
    setConfirm('reset')
  }
  function doReset() {
    actions.resetAllToCaseDefaults(state.selectedCase, compatibleIds)
    setConfirm(null)
  }

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.chips}>
          {visibleModules.map(mod => {
            const active = state.activeModules.includes(mod.id)
            return (
              <button
                key={mod.id}
                type="button"
                className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                onClick={() => actions.toggleModule(mod.id)}
                title={`${mod.displayName} · ${active ? 'click to disable' : 'click to enable'}`}
              >
                {mod.displayName}
              </button>
            )
          })}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={requestRandom}
            title="auto-fill panel content with random pool values"
          >
            random
          </button>
          <span className={styles.divider}>·</span>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={requestReset}
            title="discard all changes on this grid and reset to case-defaults"
          >
            reset
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirm === 'random'}
        title="randomize all panels?"
        message="some panels already have content that will be overwritten."
        confirmLabel="randomize"
        cancelLabel="cancel"
        onConfirm={doRandom}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === 'reset'}
        title="reset grid?"
        message="reset will discard all changes on this grid — overrides, notes, signatures, module toggles."
        confirmLabel="reset"
        cancelLabel="cancel"
        destructive
        onConfirm={doReset}
        onCancel={() => setConfirm(null)}
      />
    </>
  )
}
