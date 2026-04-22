import { useMemo, useState } from 'react'
import { useWorkspaceState } from '../../../lib/workspaceStore.js'
import { compileWorkspace } from '../../../lib/compileWorkspace.js'
import { countTokens, isTokenWarning } from '../../../lib/tokenCount.js'
import styles from './PromptPreview.module.css'

/**
 * Prompt-Preview-Bar — live-kompiliertes JSON oberhalb der OutputBar.
 *
 * Default: expandiert (240px), zeigt den kompletten Prompt-JSON
 * scrollbar. Toggle in der Header-Zeile kollabiert auf 32px-Streifen
 * mit Token-Count + aktuellem Top-Level-Keyset als Peek.
 *
 * Warum permanent sichtbar: im Free-Mode gibt's keine Silhouetten,
 * die "was verändert sich gerade" auf dem Canvas abbilden. User
 * braucht direktes visuelles Feedback beim Tippen in Content-Felder
 * oder beim Toggeln von Modulen — sonst läuft alles im Hintergrund.
 */
export default function PromptPreview() {
  const state = useWorkspaceState()
  const [open, setOpen] = useState(true)

  const compiled = useMemo(() => compileWorkspace(state), [state])
  const tokens = useMemo(() => countTokens(compiled), [compiled])
  const tokenWarn = isTokenWarning(tokens)

  const peek = useMemo(() => extractPeek(compiled), [compiled])

  return (
    <div className={`${styles.bar} ${open ? styles.open : styles.collapsed}`}>
      <div className={styles.head}>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-label={open ? 'collapse prompt preview' : 'expand prompt preview'}
          title={open ? 'collapse prompt preview' : 'expand prompt preview'}
        >
          <span className={styles.caret} aria-hidden>{open ? '▾' : '▸'}</span>
          <span className={styles.label}>prompt preview</span>
        </button>
        <span className={`${styles.tokens} ${tokenWarn ? styles.tokensWarn : ''}`}>
          ~{tokens} tok
        </span>
        {!open && (
          <span className={styles.peek} title={peek}>
            {peek}
          </span>
        )}
      </div>
      {open && (
        <pre className={styles.body}>
          <code>{compiled}</code>
        </pre>
      )}
    </div>
  )
}

/**
 * Einzeilige Peek-Zusammenfassung für den kollabierten Zustand.
 * Liest die Top-Level-Keys aus dem kompilierten JSON, fallback auf
 * ersten 60 Zeichen wenn das JSON nicht parsebar ist (z.B. _empty).
 */
function extractPeek(jsonString) {
  try {
    const obj = JSON.parse(jsonString)
    if (obj._empty) return obj.hint || 'empty'
    if (obj._stub) return `stub · ${obj.case}`
    const keys = Object.keys(obj)
    return keys.join(' · ')
  } catch {
    return jsonString.slice(0, 60)
  }
}
