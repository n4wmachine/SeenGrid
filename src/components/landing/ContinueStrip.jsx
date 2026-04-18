import { useRef } from 'react'
import useOverflowDetection from '../../hooks/useOverflowDetection.js'
import styles from './ContinueStrip.module.css'

// CONTINUE-Band (PRODUCT_STRATEGY §5.3: nur Projekte, keine losen
// Assets). Horizontal scroll, [+ new] vorne, zuletzt-bearbeitet
// zuerst. Adaptiv: leeres Array -> Band komplett weg.
// Mood-Rotation ueber 5 dezente Card-Varianten (NUANCEN 1: keine
// UI-Status-Tokens fuer Deko). Thumbnails kommen spaeter als echte
// Keyframes — bis dahin Mood-Tiles.
//
// Fade-Affordance: der Gradient-Fade rechts wird nur gerendert
// wenn die Row tatsaechlich ueberlaeuft (useOverflowDetection).
// Ohne Overflow ist der Fade irrefuehrend ("scroll fuer mehr"),
// obwohl alle Cards sichtbar sind.
const CONTINUE_PROJECTS = [
  { id: 'tokio',      title: 'Tokio Kurzfilm',        modifiedAt: Date.now() - 3 * 60 * 60 * 1000 },
  { id: 'laundromat', title: 'Laundromat Kapitel 1',  modifiedAt: Date.now() - 28 * 60 * 60 * 1000 },
  { id: 'berlin',     title: 'Berlin Doku',           modifiedAt: Date.now() - 2 * 24 * 60 * 60 * 1000 },
]

const MOOD_CLASSES = ['moodTeal', 'moodAmber', 'moodNoir', 'moodGreen', 'moodRed']

export default function ContinueStrip({ onNavigate }) {
  const projects = [...CONTINUE_PROJECTS].sort((a, b) => b.modifiedAt - a.modifiedAt)
  const rowRef = useRef(null)
  const hasOverflow = useOverflowDetection(rowRef)

  if (projects.length === 0) return null

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>CONTINUE</span>
        {hasOverflow && <span className={styles.hint}>horizontal scroll →</span>}
      </div>

      <div className={styles.rowWrap}>
        <div ref={rowRef} className={styles.row}>
          <button
            type="button"
            className={styles.newCard}
            onClick={() => onNavigate && onNavigate('home')}
            aria-label="New project"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span className={styles.newLabel}>new project</span>
          </button>

          {projects.map((p, idx) => {
            const moodClass = styles[MOOD_CLASSES[idx % MOOD_CLASSES.length]]
            return (
              <div key={p.id} className={`${styles.projectCard} ${moodClass}`}>
                <span className={styles.projectLabel}>{p.title}</span>
              </div>
            )
          })}
        </div>
        {hasOverflow && <div className={styles.fade} aria-hidden="true" />}
      </div>
    </section>
  )
}
