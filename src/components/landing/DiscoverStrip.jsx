import discoverData from '../../data/discover.json'
import styles from './DiscoverStrip.module.css'

// Discover wandert durch das Redesign nach oben und wird zum
// visuellen Anker der Landing. Mood-Colors sind Filmlook-
// Repraesentationen aus dem Preset-File, nicht an --sg2-*
// Semantik-Tokens gebunden — daher inline via style.
// Text-Farben kommen ebenfalls pro-Item explizit aus dem Preset
// (robuster als Laufzeit-Berechnung).
//
// Image-Support: Items mit `image`-Feld rendern das Bild als
// Background-Layer mit Gradient-Overlay (Netflix-Treatment).
// moodColor bleibt als Loading-Fallback erhalten — die Card ist
// nie schwarz, sondern startet in der Mood-Farbe und das Bild
// fadet darueber, sobald geladen.
export default function DiscoverStrip() {
  const items = discoverData.items || []

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>DISCOVER</span>
        <a className={styles.hint} href="#" onClick={(e) => e.preventDefault()}>
          trending looks · see all →
        </a>
      </div>

      <div className={styles.rowWrap}>
        <div className={styles.row}>
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
                {item.trending && (
                  <div className={styles.badge} style={{ color: item.titleColor }}>
                    TRENDING
                  </div>
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
        {items.length > 0 && <div className={styles.fade} aria-hidden="true" />}
      </div>
    </section>
  )
}
