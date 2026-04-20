import { useEffect, useRef } from 'react'
import styles from './ConfirmDialog.module.css'

/**
 * Generischer Confirm-Dialog (Center-Modal mit Backdrop).
 * Default-Focus auf Cancel (sichere Option), Enter = Confirm,
 * Escape = Cancel, Klick auf Overlay = Cancel.
 *
 * Props: open, title, message, confirmLabel, cancelLabel,
 *        onConfirm, onCancel, destructive?
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
}) {
  const cancelRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const t = setTimeout(() => {
      if (cancelRef.current) cancelRef.current.focus()
    }, 0)

    function handleKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel && onCancel()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        onConfirm && onConfirm()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', handleKey)
    }
  }, [open, onCancel, onConfirm])

  if (!open) return null

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onCancel && onCancel()
  }

  const confirmClass = [
    styles.btn,
    styles.btnConfirm,
    destructive ? styles.btnDestructive : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={styles.overlay}
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'confirm-dialog-title' : undefined}
      >
        {title && (
          <div id="confirm-dialog-title" className={styles.title}>
            {title}
          </div>
        )}
        {message && <div className={styles.message}>{message}</div>}
        <div className={styles.actions}>
          <button
            ref={cancelRef}
            type="button"
            className={`${styles.btn} ${styles.btnCancel}`}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button type="button" className={confirmClass} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
