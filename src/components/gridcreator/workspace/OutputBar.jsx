import { useMemo, useState } from 'react'
import { useWorkspaceState } from '../../../lib/workspaceStore.js'
import { compileWorkspace } from '../../../lib/compileWorkspace.js'
import { countTokens, isTokenWarning } from '../../../lib/tokenCount.js'
import { getDimAdvice, isWarningQuality } from '../../../lib/dimAdvisory.js'
import { useToast } from '../../ui/ToastProvider.jsx'
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
  const { toast } = useToast()
  const [saveOpen, setSaveOpen] = useState(false)

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
    </>
  )
}
