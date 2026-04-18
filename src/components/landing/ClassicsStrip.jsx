import { useRef } from 'react'
import classicData from '../../data/classic-grids.json'
import ThumbPattern from '../gridcreator/picker/ThumbPattern.jsx'
import useOverflowDetection from '../../hooks/useOverflowDetection.js'
import styles from './ClassicsStrip.module.css'

// Classics-Strip sitzt zwischen Continue und Discover — Tool-naher
// Support-Content (kuratiertes Arbeitsmaterial), nicht Community-
// Aktivitaet (die bleibt im Prompt Hub als eigene Kategorie).
//
// Visuell bewusst anders als Discover: geometrische SVG-Grid-
// Pattern-Thumbs (aus der Picker-Phase wiederverwendet) statt
// fotografische Mood-Cards. Signalisiert "oben = bauen" vs
// "unten = schauen" — vermeidet Disney+/Streaming-Feel auf
// einem Pre-Production-Tool.
//
// Kein per-Item Trending-Badge (die ganze Section ist kuratiert,
// einzelne Marker waeren redundant).
export default function ClassicsStrip() {
  const items = classicData.items || []
  const rowRef = useRef(null)
  const hasOverflow = useOverflowDetection(rowRef)

  if (items.length === 0) return null

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>CLASSICS</span>
        <a className={styles.hint} href="#" onClick={(e) => e.preventDefault()}>
          more in prompt hub →
        </a>
      </div>

      <div className={styles.rowWrap}>
        <div ref={rowRef} className={styles.row}>
          {items.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.thumbWrap}>
                <ThumbPattern
                  pattern={item.pattern}
                  className={styles.thumb}
                />
              </div>
              <div className={styles.body}>
                <div className={styles.title}>{item.title}</div>
                <div className={styles.tagline}>{item.tagline}</div>
              </div>
            </article>
          ))}
        </div>
        {hasOverflow && <div className={styles.fade} aria-hidden="true" />}
      </div>
    </section>
  )
}
