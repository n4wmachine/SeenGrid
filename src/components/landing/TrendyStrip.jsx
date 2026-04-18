import { useRef } from 'react'
import trendyData from '../../data/trendy-prompts.json'
import useOverflowDetection from '../../hooks/useOverflowDetection.js'
import styles from './TrendyStrip.module.css'

// Trendy-Strip = fotografischer Support-Content am Ende der Landing.
// Zeigt kuratierte trendige Community-Prompts mit Preview-Bild,
// Title (was der Prompt erzeugt) und Tagline (Stil-Kategorie).
// Der Klick-Pfad fuehrt in den Prompt Hub — eindeutig, im Gegensatz
// zu den frueheren Filmlook-Cards die kein sinnvolles Klick-Ziel
// hatten. Filmlook-Discovery wandert in den LookLab als interner
// Bereich.
//
// Visueller Kontrast zu Classics (geometrische Grid-Pattern-Thumbs)
// durch fotografische Bilder mit Netflix-Treatment. Signalisiert
// "Classics = bauen, Trendy = anschauen was andere gebaut haben".
//
// Image-Support: Items mit `image`-Feld rendern das Bild als
// Background-Layer mit Gradient-Overlay. moodColor bleibt als
// Loading-Fallback erhalten — die Card ist nie schwarz, sondern
// startet in der Mood-Farbe und das Bild fadet darueber.
//
// Fade-Affordance: Gradient-Fade rechts nur bei tatsaechlichem
// Overflow (useOverflowDetection).
export default function TrendyStrip() {
  const items = trendyData.items || []
  const rowRef = useRef(null)
  const hasOverflow = useOverflowDetection(rowRef)

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>TRENDY</span>
        <a className={styles.hint} href="#" onClick={(e) => e.preventDefault()}>
          more in prompt hub →
        </a>
      </div>

      <div className={styles.rowWrap}>
        <div ref={rowRef} className={styles.row}>
          {items.map((item, idx) => {
            const hasImage = Boolean(item.image)
            const cardClass = hasImage
              ? `${styles.card} ${styles.cardWithImage}`
              : styles.card

            return (
              <article
                key={item.id}
                className={cardClass}
                style={{ background: item.moodColor }}
              >
                {hasImage && (
                  <img
                    className={styles.cardImage}
                    src={item.image}
                    alt={item.title}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                )}
                <div className={styles.body}>
                  <div className={styles.title} style={{ color: item.titleColor }}>
                    {item.title}
                  </div>
                  <div className={styles.tagline} style={{ color: item.taglineColor }}>
                    {item.tagline}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        {hasOverflow && <div className={styles.fade} aria-hidden="true" />}
      </div>
    </section>
  )
}
