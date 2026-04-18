import styles from './CreateZone.module.css'

// Create Zone = Primary-Zone der Landing (vormals Quick Start).
// Vier grosse Entry-Point-Cards fuer die vier aktiven Tool-Workspaces.
// Routing ist in diesem Slice nicht angeschlossen — onClick loggt
// Routing-Marker mit dem Workspace-Namen, damit die vier Handler
// spaeter per grep in einem Durchgang gebunden werden koennen
// (konsistent mit den token-store / workspace-store Markern im
// Masthead). Die vier Cards sind bewusst ausgerollt (keine .map)
// damit die Marker pro Card grep-bar bleiben.

export default function CreateZone() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>CREATE</span>
      </div>
      <div className={styles.grid}>
        <button
          type="button"
          className={styles.card}
          onClick={() => console.log('TODO(routing): navigate to grid-creator workspace')}
        >
          <span className={styles.icon} aria-hidden="true" />
          <div className={styles.body}>
            <div className={styles.title}>grid creator</div>
            <div className={styles.tagline}>build a grid</div>
          </div>
        </button>
        <button
          type="button"
          className={styles.card}
          onClick={() => console.log('TODO(routing): navigate to seenlab workspace')}
        >
          <span className={styles.icon} aria-hidden="true" />
          <div className={styles.body}>
            <div className={styles.title}>seenlab</div>
            <div className={styles.tagline}>develop a look</div>
          </div>
        </button>
        <button
          type="button"
          className={styles.card}
          onClick={() => console.log('TODO(routing): navigate to seenframe workspace')}
        >
          <span className={styles.icon} aria-hidden="true" />
          <div className={styles.body}>
            <div className={styles.title}>seenframe</div>
            <div className={styles.tagline}>cinematic still</div>
          </div>
        </button>
        <button
          type="button"
          className={styles.card}
          onClick={() => console.log('TODO(routing): navigate to prompt-hub workspace')}
        >
          <span className={styles.icon} aria-hidden="true" />
          <div className={styles.body}>
            <div className={styles.title}>prompt hub</div>
            <div className={styles.tagline}>browse prompts</div>
          </div>
        </button>
      </div>
    </section>
  )
}
