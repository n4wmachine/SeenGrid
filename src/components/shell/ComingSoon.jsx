import pagesConfig from '../../config/pages.config.json'
import styles from './ComingSoon.module.css'

const allPages = [...pagesConfig.pages, ...pagesConfig.utilPages]

export default function ComingSoon({ pageId, label }) {
  const page = allPages.find(p => p.id === pageId)
  const title = label || page?.tooltip?.title || page?.label || pageId

  return (
    <div className={styles.container}>
      <div className={styles.label}>COMING SOON</div>
      <div className={styles.title}>{title}</div>
      {page?.tooltip?.desc && (
        <div className={styles.desc}>{page.tooltip.desc}</div>
      )}
    </div>
  )
}
