import { useMemo, useState } from 'react'
import { useWorkspaceState, useWorkspaceActions } from '../../../lib/workspaceStore.js'
import { compileWorkspace } from '../../../lib/compileWorkspace.js'
import { countTokens, isTokenWarning } from '../../../lib/tokenCount.js'
import { getDimAdvice, isWarningQuality } from '../../../lib/dimAdvisory.js'
import { useToast } from '../../ui/ToastProvider.jsx'
import ConfirmDialog from '../../ui/ConfirmDialog.jsx'
import SavePresetDialog from './SavePresetDialog.jsx'
import styles from './OutputBar.module.css'

/**
 * Output-Bar (32px, full-width). WORKSPACE_SPEC §9.
 *
 * Links: Save + Copy (Copy = primary teal).
 * Rechts: Token-Count (warning-rot wenn > THRESHOLD) + Dim-Warning
 *         (warning amber wenn quality LOW/TINY).
 *
 * Compile via lib/compileWorkspace.js (case-aware adapter, nicht
 * Engine-direkt).
 */
export default function OutputBar() {
  const state = useWorkspaceState()
  const actions = useWorkspaceActions()
  const { toast } = useToast()
  const [saveOpen, setSaveOpen] = useState(false)
  const [convertOpen, setConvertOpen] = useState(false)
  const isFreeMode = state.selectedCase === 'free_mode'

  const compiled = useMemo(() => compileWorkspace(state), [state])
  const tokens = useMemo(() => countTokens(compiled), [compiled])
  const advice = getDimAdvice(state.gridDims.rows, state.gridDims.cols)
  const dimWarn = isWarningQuality(advice.quality)
  const tokenWarn = isTokenWarning(tokens)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(compiled)
      toast('json copied', 'success')
    } catch (err) {
      toast('copy failed — clipboard blocked', 'error')
    }
  }

  function handleConvertConfirm() {
    actions.convertToFreeMode()
    setConvertOpen(false)
    toast('converted to free mode', 'success')
  }

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.left}>
          <button
            className={styles.btnSecondary}
            onClick={() => setSaveOpen(true)}
            title="save current grid as a preset"
          >
            save as preset
          </button>
          {!isFreeMode && (
            <button
              className={styles.btnSecondary}
              onClick={() => setConvertOpen(true)}
              title="drop case constraints, keep your panels and content"
            >
              convert to free mode
            </button>
          )}
          <button
            className={styles.btnPrimary}
            onClick={handleCopy}
            title="copy compiled JSON to clipboard"
          >
            copy as json
          </button>
        </div>

        <div className={styles.right}>
          <span
            className={`${styles.tokens} ${tokenWarn ? styles.tokensWarn : ''}`}
            title={`estimated tokens · warning at >${8000}`}
          >
            ~{tokens} tok
          </span>
          {dimWarn && (
            <>
              <span className={styles.sep}>·</span>
              <span
                className={styles.dimWarn}
                title={`panel quality at 2K is ${advice.quality} — not startframe-ready`}
              >
                ⚠ {advice.quality} @2K
              </span>
            </>
          )}
        </div>
      </div>

      <SavePresetDialog
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        compiledPreview={compiled}
      />

      <ConfirmDialog
        open={convertOpen}
        title="convert to free mode?"
        message="you lose case constraints (roles, panel-count rules, case-specific schema). your panels, dimensions, content, notes, signatures and module selections stay. this is a one-way switch — to go back, use 'back to picker' and pick the case again."
        confirmLabel="convert"
        cancelLabel="cancel"
        onConfirm={handleConvertConfirm}
        onCancel={() => setConvertOpen(false)}
      />
    </>
  )
}
