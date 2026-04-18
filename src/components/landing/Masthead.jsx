import styles from './Masthead.module.css'

// Editorial Masthead (~70-80px), loest den zentrierten Hero ab.
// Brand-Praesenz durch Zeitungskopfzeilen-Register + Session-Metadata
// rechts, nicht durch Raumverbrauch. Siehe LANDING_REDESIGN_STATUS.md.
export default function Masthead() {
  return (
    <header className={styles.masthead}>
      <div className={styles.left}>
        <span className={styles.wordmark}>SeenGrid</span>
        <span className={styles.divider} aria-hidden="true" />
        <span className={styles.claim}>pre-production OS for AI filmmakers</span>
      </div>
      <div className={styles.meta}>
        <span className={styles.metaItem}>v0.4.2</span>
        <span className={styles.metaItem}>
          3 signatures{/* TODO(token-store): connect to signatures count */}
        </span>
        <span className={styles.metaItem}>
          18 prompts{/* TODO(token-store): connect to prompts count */}
        </span>
        <span className={styles.metaItem}>
          saved 14m ago{/* TODO(workspace-store): connect to last save timestamp */}
        </span>
      </div>
    </header>
  )
}
