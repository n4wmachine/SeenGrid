import styles from './WorkspacePlaceholder.module.css'

/**
 * Workspace-Placeholder. Echter Workspace-Bau ist eigene Phase
 * (siehe ROADMAP "Workspace"). Dieses Stub zeigt nur, dass der
 * Picker → Workspace State-Switch funktioniert.
 */
export default function WorkspacePlaceholder({ selection, onBack }) {
  const kind = selection?.kind ?? 'unknown'
  const label = selection?.label ?? '—'

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.monoLabel}>WORKSPACE · PLACEHOLDER</div>
        <div className={styles.title}>coming next phase</div>
        <div className={styles.meta}>
          <div className={styles.metaRow}>
            <span className={styles.metaKey}>picked</span>
            <span className={styles.metaVal}>{kind}</span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaKey}>target</span>
            <span className={styles.metaVal}>{label}</span>
          </div>
        </div>
        <button className={styles.backBtn} onClick={onBack}>
          ← back to picker
        </button>
      </div>
    </div>
  )
}
