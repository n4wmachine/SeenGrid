import { useMemo, useRef } from 'react'
import {
  useWorkspaceState,
  useWorkspaceActions,
} from '../../../lib/workspaceStore.js'
import signaturesStub from '../../../data/signatures.stub.json'
import { useToast } from '../../ui/ToastProvider.jsx'
import useOverflowDetection from '../../../hooks/useOverflowDetection.js'
import styles from './SignaturesBar.module.css'

/**
 * Signatures-Bar (52px, full-width). WORKSPACE_SPEC §8.
 *
 * Terminologie (NUANCEN 16, OPEN_DECISIONS #14): Signature =
 * LookLab-Token. NICHT Classics, NICHT Trendy.
 *
 * Layout:
 *   [SIGNATURES (gold-label)] [applied-card×] [pinned] [recent] →
 *
 * v1: applied-Cards = panels mit signatureId (alle deduplizieren) +
 * "+ apply signature"-Button. Echte Pinned/Recent kommt mit Token-
 * Store Stufe 1.
 */
export default function SignaturesBar() {
  const state = useWorkspaceState()
  const actions = useWorkspaceActions()
  const { toast } = useToast()
  const scrollRef = useRef(null)
  const hasOverflow = useOverflowDetection(scrollRef)

  // Applied = alle signatureIds aus den Panels (deduped, in Reihenfolge).
  const appliedIds = useMemo(() => {
    const seen = new Set()
    const list = []
    for (const p of state.panels) {
      if (p.signatureId && !seen.has(p.signatureId)) {
        seen.add(p.signatureId)
        list.push(p.signatureId)
      }
    }
    return list
  }, [state.panels])

  const applied = useMemo(
    () => appliedIds
      .map(id => signaturesStub.signatures.find(s => s.id === id))
      .filter(Boolean),
    [appliedIds]
  )

  function handleDetach(sigId) {
    // Detach von allen Panels die diese Signature tragen
    state.panels.forEach(p => {
      if (p.signatureId === sigId) actions.detachSignatureFromPanel(p.id)
    })
    toast('signature detached', 'info')
  }

  function handleApplyClick() {
    // TODO(signature-picker): hier öffnet sich später ein Apply-
    // Signature-Popup mit Library-Picker + Per-Panel-Auswahl.
    toast('signature picker coming soon', 'info')
  }

  const empty = applied.length === 0

  return (
    <div className={styles.bar}>
      <span className={styles.label}>signatures</span>
      <div
        ref={scrollRef}
        className={`${styles.scroller} ${hasOverflow ? styles.hasOverflow : ''}`}
      >
        {empty && (
          <span className={styles.emptyHint}>no signature applied yet</span>
        )}
        {applied.map(sig => (
          <div key={sig.id} className={`${styles.card} ${styles.cardApplied}`}>
            <span className={styles.star}>★</span>
            <span className={styles.swatch} style={{ background: sig.swatchColor }} />
            <div className={styles.cardMeta}>
              <span className={styles.name}>{sig.name}</span>
              {sig.tagline && <span className={styles.tagline}>{sig.tagline}</span>}
            </div>
            <button
              className={styles.detach}
              onClick={() => handleDetach(sig.id)}
              aria-label={`detach ${sig.name}`}
              title="detach signature from all panels"
            >
              ×
            </button>
          </div>
        ))}
        <button
          className={styles.applyBtn}
          onClick={handleApplyClick}
          title="open signature picker (coming soon)"
        >
          + apply signature
        </button>
      </div>
    </div>
  )
}
