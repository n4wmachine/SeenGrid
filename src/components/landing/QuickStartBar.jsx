import styles from './QuickStartBar.module.css'

// Quick Start komprimiert zu einer 4-Column Utility-Leiste.
// Keine Descriptions mehr — nur Label + Icon-Placeholder.
// Targets entsprechen den bestehenden Rail-Pages (grid, lab,
// frame, hub), damit der onNavigate-Pfad identisch zum alten
// Quick-Start bleibt.
const QUICK_START = [
  { id: 'grid',  target: 'grid',  label: 'character grid' },
  { id: 'lab',   target: 'lab',   label: 'develop a look' },
  { id: 'frame', target: 'frame', label: 'cinematic still' },
  { id: 'hub',   target: 'hub',   label: 'browse hub' },
]

export default function QuickStartBar({ onNavigate }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>QUICK START</span>
      </div>
      <div className={styles.grid}>
        {QUICK_START.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.card}
            onClick={() => onNavigate && onNavigate(item.target)}
          >
            <span className={styles.icon} aria-hidden="true" />
            <span className={styles.labelText}>{item.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
