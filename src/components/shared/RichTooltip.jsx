import { useState, useRef, useEffect } from 'react'
import styles from './RichTooltip.module.css'

export default function RichTooltip({ title, desc, children, position = 'right' }) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const tipRef = useRef(null)

  useEffect(() => {
    if (!visible || !triggerRef.current || !tipRef.current) return
    const tr = triggerRef.current.getBoundingClientRect()
    const tip = tipRef.current.getBoundingClientRect()

    let top, left
    if (position === 'right') {
      top = tr.top + tr.height / 2 - tip.height / 2
      left = tr.right + 12
    } else if (position === 'bottom') {
      top = tr.bottom + 8
      left = tr.left + tr.width / 2 - tip.width / 2
    } else if (position === 'top') {
      top = tr.top - tip.height - 8
      left = tr.left + tr.width / 2 - tip.width / 2
    }

    const pad = 8
    if (top < pad) top = pad
    if (top + tip.height > window.innerHeight - pad) top = window.innerHeight - pad - tip.height
    if (left + tip.width > window.innerWidth - pad) left = window.innerWidth - pad - tip.width
    if (left < pad) left = pad

    setCoords({ top, left })
  }, [visible, position])

  return (
    <div
      ref={triggerRef}
      className={styles.trigger}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          ref={tipRef}
          className={`${styles.tooltip} ${styles[position]}`}
          style={{ top: coords.top, left: coords.left }}
        >
          <div className={styles.arrow} />
          <div className={styles.title}>{title}</div>
          {desc && <div className={styles.desc}>{desc}</div>}
        </div>
      )}
    </div>
  )
}
