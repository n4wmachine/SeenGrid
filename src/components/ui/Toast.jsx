import { useEffect, useRef, useState } from 'react'
import styles from './Toast.module.css'

/**
 * Einzelner Toast. Auto-Dismiss nach 3000ms mit Pause-on-Hover.
 * Border-Tint je Typ (success/error/info). Body bleibt neutral
 * (WORKSPACE_SPEC §16.3).
 */
export default function Toast({ id, message, type = 'info', duration = 3000, onClose }) {
  const [leaving, setLeaving] = useState(false)
  const remainingRef = useRef(duration)
  const startedAtRef = useRef(Date.now())
  const timerRef = useRef(null)

  function startTimer(ms) {
    clearTimer()
    startedAtRef.current = Date.now()
    timerRef.current = setTimeout(triggerClose, ms)
  }

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  function triggerClose() {
    setLeaving(true)
    setTimeout(() => onClose && onClose(id), 180)
  }

  useEffect(() => {
    startTimer(remainingRef.current)
    return clearTimer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleEnter() {
    const elapsed = Date.now() - startedAtRef.current
    remainingRef.current = Math.max(0, remainingRef.current - elapsed)
    clearTimer()
  }

  function handleLeave() {
    startTimer(remainingRef.current)
  }

  const className = [
    styles.toast,
    styles[`toast--${type}`] || '',
    leaving ? styles.leaving : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={className}
      role="status"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span className={styles.message}>{message}</span>
      <button
        type="button"
        className={styles.close}
        onClick={triggerClose}
        aria-label="dismiss"
      >
        ×
      </button>
    </div>
  )
}
