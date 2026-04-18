import discoverData from '../../data/discover.json'
import styles from './DiscoverStrip.module.css'

// Discover wandert durch das Redesign nach oben und wird zum
// visuellen Anker der Landing. Mood-Colors sind Filmlook-
// Repraesentationen aus dem Preset-File, nicht an --sg2-*
// Semantik-Tokens gebunden — daher inline via style.
// Text-Farben kommen ebenfalls pro-Item explizit aus dem Preset
// (robuster als Laufzeit-Berechnung).
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

      <div className={styles.grid}>
        {items.map((item) => (
          <article
            key={item.id}
            className={styles.card}
            style={{ background: item.moodColor }}
          >
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
        ))}
      </div>
    </section>
  )
}
