import { useMemo } from 'react'
import pagesConfig from '../../config/pages.config.json'
import icons from './railIcons.jsx'
import RichTooltip from '../shared/RichTooltip.jsx'
import styles from './Rail.module.css'

function LogoMark({ onClick }) {
  return (
    <button className={styles.logo} onClick={onClick} aria-label="Home">
      <div className={styles.logoInner}>
        <div className={styles.logoCell} />
        <div className={`${styles.logoCell} ${styles.logoCellDim}`} />
        <div className={`${styles.logoCell} ${styles.logoCellDim}`} />
        <div className={styles.logoCell} />
      </div>
    </button>
  )
}

function RailItem({ page, isActive, onNavigate }) {
  const isComing = page.status === 'coming'
  const icon = icons[page.icon]

  const itemClass = [
    styles.item,
    isActive && styles.itemActive,
    isComing && styles.itemComing,
  ].filter(Boolean).join(' ')

  return (
    <RichTooltip
      title={page.tooltip?.title || page.label}
      desc={page.tooltip?.desc}
      position="right"
    >
      <button
        className={itemClass}
        onClick={() => onNavigate(page.id)}
        aria-label={page.label}
        aria-current={isActive ? 'page' : undefined}
      >
        <span className={styles.itemIcon}>{icon}</span>
        {page.starred && <span className={styles.starDot} />}
        {isComing && <span className={styles.soonTag}>soon</span>}
      </button>
    </RichTooltip>
  )
}

function GroupSeparator({ label }) {
  return <div className={styles.group}>{label}</div>
}

export default function Rail({ activePage, onPageChange }) {
  const { mainItems, utilItems } = useMemo(() => {
    const grouped = []
    let lastGroup = null

    for (const page of pagesConfig.pages) {
      if (page.group && page.group !== lastGroup) {
        grouped.push({ type: 'group', label: page.group })
        lastGroup = page.group
      }
      grouped.push({ type: 'page', page })
    }

    return {
      mainItems: grouped,
      utilItems: pagesConfig.utilPages || [],
    }
  }, [])

  return (
    <nav className={styles.rail} aria-label="Main navigation">
      <LogoMark onClick={() => onPageChange('home')} />

      <div className={styles.separator} />

      <div className={styles.mainSection}>
        {mainItems.map((item, i) =>
          item.type === 'group' ? (
            <GroupSeparator key={item.label} label={item.label} />
          ) : (
            <RailItem
              key={item.page.id}
              page={item.page}
              isActive={activePage === item.page.id}
              onNavigate={onPageChange}
            />
          )
        )}
      </div>

      <div className={styles.utilSection}>
        {utilItems.map((page) => (
          <RailItem
            key={page.id}
            page={page}
            isActive={activePage === page.id}
            onNavigate={onPageChange}
          />
        ))}
      </div>
    </nav>
  )
}
