import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import Toast from './Toast.jsx'
import styles from './ToastProvider.module.css'

/**
 * Generischer Toast-Container (WORKSPACE_SPEC §16).
 * Position: bottom-right, Offset = Output-Bar-Höhe + 24px.
 * Max 3 gleichzeitig — beim 4. Toast wird der älteste entfernt.
 * Stack wächst nach oben.
 *
 * API: useToast() → { toast(message, type?) }
 *   type: 'success' | 'error' | 'info' (default 'info')
 */

const MAX_TOASTS = 3

const ToastContext = createContext(null)

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((message, type = 'info', options = {}) => {
    idRef.current += 1
    const id = `toast-${idRef.current}`
    setToasts(prev => {
      const next = [...prev, { id, message, type, duration: options.duration || 3000 }]
      return next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next
    })
    return id
  }, [])

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.stack} aria-live="polite" aria-atomic="false">
        {toasts.map(t => (
          <Toast
            key={t.id}
            id={t.id}
            message={t.message}
            type={t.type}
            duration={t.duration}
            onClose={dismiss}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
