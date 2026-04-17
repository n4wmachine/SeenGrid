import styles from './StatusBar.module.css'

export default function StatusBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <div className={styles.readyDot} />
        <span className={styles.readyLabel}>READY</span>
        <div className={styles.divider} />
        <span className={styles.info}>3 signatures · 2 grids · 18 prompts</span>
      </div>
      <span className={styles.timestamp}>last save 14m ago</span>
    </div>
  )
}
