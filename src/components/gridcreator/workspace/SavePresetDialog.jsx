import { useEffect, useRef, useState } from 'react'
import { useWorkspaceState } from '../../../lib/workspaceStore.js'
import { saveWorkspaceAsPreset } from '../../../lib/presetStore.js'
import casesConfig from '../../../config/cases.config.json'
import { useToast } from '../../ui/ToastProvider.jsx'
import styles from './SavePresetDialog.module.css'

/**
 * Save-as-Preset Modal. Öffnet aus Output-Bar.
 * WORKSPACE_SPEC §10 (vereinfacht v1: Name + Notes + Case-Chip,
 * "What to include" + "Where to save" sind v2-Scope und kommen mit
 * Projekt-Store / Token-Store).
 *
 * Verhalten:
 *   - Name required (≥2 Zeichen) → Save disabled bis valid
 *   - Default-Name: "{case} · {date}" prefilled
 *   - Cancel = Escape = Overlay-Klick = ohne Save schließen
 *   - Save → presetStore.saveWorkspaceAsPreset → Toast → schließen
 */
export default function SavePresetDialog({ open, onClose, compiledPreview }) {
  const state = useWorkspaceState()
  const { toast } = useToast()
  const inputRef = useRef(null)

  const caseDef = casesConfig.cases.find(c => c.id === state.selectedCase)
  const caseLabel = caseDef ? caseDef.displayName.toLowerCase() : 'untitled'

  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setName(defaultName(caseLabel))
    setNotes('')
    setError('')
    const t = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }, 0)
    return () => clearTimeout(t)
  }, [open, caseLabel])

  useEffect(() => {
    if (!open) return undefined
    function handleKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'Enter' && (e.target.tagName !== 'TEXTAREA')) {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, name, notes])

  if (!open) return null

  const isValid = name.trim().length >= 2

  function handleSave() {
    if (!isValid) {
      setError('name must be at least 2 characters')
      return
    }
    try {
      const preset = saveWorkspaceAsPreset({
        name,
        notes,
        workspaceState: state,
      })
      toast(`preset '${preset.name}' saved`, 'success')
      onClose()
    } catch (err) {
      setError(err.message || 'save failed')
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onMouseDown={handleOverlayClick} role="presentation">
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="save-preset-title">
        <div className={styles.header}>
          <span id="save-preset-title" className={styles.title}>save as preset</span>
          <button className={styles.close} onClick={onClose} aria-label="close">×</button>
        </div>

        <div className={styles.body}>
          <div className={styles.previewChip} title="grid case being saved">
            CASE · <span className={styles.previewChipName}>{caseLabel}</span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="save-preset-name">name</label>
            <input
              id="save-preset-name"
              ref={inputRef}
              type="text"
              className={styles.input}
              value={name}
              placeholder="e.g. noir tokio sheet"
              onChange={e => { setName(e.target.value); setError('') }}
            />
            {error && <div className={styles.error}>{error}</div>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="save-preset-notes">notes (optional)</label>
            <textarea
              id="save-preset-notes"
              className={styles.textarea}
              value={notes}
              placeholder="quick reminder for your future self"
              onChange={e => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>cancel</button>
          <button
            type="button"
            className={`${styles.btnSave} ${!isValid ? styles.btnSaveDisabled : ''}`}
            onClick={handleSave}
            disabled={!isValid}
          >
            save
          </button>
        </div>
      </div>
    </div>
  )
}

function defaultName(caseLabel) {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${caseLabel} · ${yyyy}-${mm}-${dd}`
}
