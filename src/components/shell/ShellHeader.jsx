import { usePageMeta } from '../../context/PageMetaContext.jsx'
import styles from './ShellHeader.module.css'

export default function ShellHeader() {
  const { title, subtitle } = usePageMeta()

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.title}>{title}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      <div className={styles.right}>
        <div className={styles.version}>v0.4.2</div>
        <div className={styles.divider} />
        <div className={styles.avatar}>J</div>
      </div>
    </header>
  )
}
