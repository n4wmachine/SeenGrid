import icons from '../shell/railIcons.jsx'
import styles from './LandingPage.module.css'

const CONTINUE_ITEMS = [
  { title: 'laundromat owner · angle study', sub: 'grid · 14m ago', thumb: 'grid4' },
  { title: 'deakins lighting · noir variant', sub: 'signature · 2h ago', thumb: 'noir' },
  { title: 'diner cook · expression sheet', sub: 'grid · yesterday', thumb: 'teal' },
]

const QUICK_START = [
  { id: 'grid', icon: 'grid', title: 'build a character grid', desc: 'angle study · expression · normalizer' },
  { id: 'lab', icon: 'lab', title: 'develop a look', desc: 'stack chips · save as signature' },
  { id: 'frame', icon: 'frame', title: 'cinematic still', desc: 'midjourney v7 · --raw required' },
  { id: 'hub', icon: 'hub', title: 'browse the hub', desc: 'community · classics · saved' },
]

const DISCOVER_ITEMS = [
  { title: 'prisoners look', sub: 'deakins · noir', thumb: 'noir', trending: true },
  { title: 'se7en fluorescence', sub: 'accent · green', thumb: 'green', trending: true },
  { title: 'wong kar-wai', sub: 'color · neon', thumb: 'red' },
  { title: 'argento giallo', sub: 'style · horror', thumb: 'amber' },
]

function SectionLabel({ text }) {
  return (
    <div className={styles.sectionLabel}>
      <span>{text}</span>
      <div className={styles.sectionLine} />
    </div>
  )
}

function Thumb({ type }) {
  const cls = {
    grid4: styles.thumbGrid,
    noir: styles.thumbNoir,
    teal: styles.thumbTeal,
    green: styles.thumbGreen,
    red: styles.thumbRed,
    amber: styles.thumbAmber,
  }
  if (type === 'grid4') {
    return (
      <div className={cls.grid4}>
        <div /><div /><div /><div />
      </div>
    )
  }
  return <div className={cls[type] || styles.thumbNoir} />
}

export default function LandingPage({ onNavigate }) {
  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <div className={styles.heroLogo}>
          <div className={styles.heroLogoInner}>
            <div className={styles.heroLogoCell} />
            <div className={`${styles.heroLogoCell} ${styles.heroLogoCellDim}`} />
            <div className={`${styles.heroLogoCell} ${styles.heroLogoCellDim}`} />
            <div className={styles.heroLogoCell} />
          </div>
        </div>
        <div className={styles.heroWordmark}>SeenGrid</div>
        <div className={styles.heroTagline}>pre-production OS for AI filmmakers</div>
      </div>

      <div className={styles.band}>
        <SectionLabel text="CONTINUE" />
        <div className={styles.continueGrid}>
          {CONTINUE_ITEMS.map((item) => (
            <div key={item.title} className={styles.landCard}>
              <div className={styles.landThumb}>
                <Thumb type={item.thumb} />
              </div>
              <div className={styles.landMeta}>
                <div className={styles.landTitle}>{item.title}</div>
                <div className={styles.landSub}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.band}>
        <SectionLabel text="QUICK START" />
        <div className={styles.quickGrid}>
          {QUICK_START.map((item) => (
            <div key={item.id} className={styles.qsCard} onClick={() => onNavigate(item.id)}>
              <div className={styles.qsIcon}>{icons[item.icon]}</div>
              <div className={styles.qsTitle}>{item.title}</div>
              <div className={styles.qsDesc}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.band}>
        <SectionLabel text="DISCOVER" />
        <div className={styles.discoverGrid}>
          {DISCOVER_ITEMS.map((item) => (
            <div key={item.title} className={styles.landCard}>
              <div className={`${styles.landThumb} ${styles.landThumbSquare}`}>
                <Thumb type={item.thumb} />
                {item.trending && <div className={styles.trendingBadge}>TRENDING</div>}
              </div>
              <div className={styles.landMeta}>
                <div className={styles.landTitle} style={{ fontSize: 13 }}>{item.title}</div>
                <div className={styles.landSub}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
