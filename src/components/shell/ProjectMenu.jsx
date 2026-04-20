import { useEffect, useRef, useState } from 'react'
import styles from './ProjectMenu.module.css'

/**
 * Inline-Projekt-Dropdown (WORKSPACE_SPEC §2.2).
 *
 * Öffnet sich unter dem Projekt-Label im ShellHeader. Entries:
 *   [no project]                   ← kontextfrei-Mode
 *   tokio-kurzfilm ✓               ← currently active (Checkmark)
 *   berlin-doku
 *   wuerzburg-serie
 *   —————————
 *   + new project                  ← TODO(projects-store)
 *   open project page →            ← Placeholder bis Page gebaut
 *
 * Keyboard:
 *   ArrowUp/Down = navigate
 *   Enter        = select focused
 *   Escape       = close
 * Click-Outside = close
 *
 * Farben bleiben Teal/neutral — kein Gold (NUANCEN 1).
 */
export default function ProjectMenu({
  open,
  anchorRef,
  projects = [],
  currentProjectId = null,
  onSelectProject,
  onCreateProject,
  onClose,
}) {
  const menuRef = useRef(null)
  const [focusIndex, setFocusIndex] = useState(0)

  const entries = buildEntries(projects)

  useEffect(() => {
    if (!open) return undefined
    setFocusIndex(() => {
      const idx = entries.findIndex(
        e => e.kind === 'project' && e.id === currentProjectId
      )
      return idx >= 0 ? idx : 0
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    function handlePointer(e) {
      const inMenu = menuRef.current && menuRef.current.contains(e.target)
      const inAnchor = anchorRef?.current && anchorRef.current.contains(e.target)
      if (!inMenu && !inAnchor) onClose && onClose()
    }

    function handleKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose && onClose()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusIndex(i => nextFocusable(entries, i, +1))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusIndex(i => nextFocusable(entries, i, -1))
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        const entry = entries[focusIndex]
        if (entry) triggerEntry(entry)
      }
    }

    document.addEventListener('mousedown', handlePointer)
    window.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      window.removeEventListener('keydown', handleKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, entries, focusIndex])

  function triggerEntry(entry) {
    if (entry.kind === 'project') {
      onSelectProject && onSelectProject(entry.id)
      onClose && onClose()
    } else if (entry.kind === 'no-project') {
      onSelectProject && onSelectProject(null)
      onClose && onClose()
    } else if (entry.kind === 'new-project') {
      // TODO(projects-store): inline input + echte project-creation
      if (onCreateProject) onCreateProject()
      onClose && onClose()
    } else if (entry.kind === 'open-page') {
      // TODO(projects-store): project-overview-page
      onClose && onClose()
    }
  }

  if (!open) return null

  return (
    <div ref={menuRef} className={styles.menu} role="menu" aria-label="Project menu">
      {entries.map((entry, i) => {
        if (entry.kind === 'separator') {
          return <div key={`sep-${i}`} className={styles.separator} role="separator" />
        }
        const focused = i === focusIndex
        const isActive =
          entry.kind === 'no-project' ? currentProjectId == null
          : entry.kind === 'project' ? entry.id === currentProjectId
          : false
        return (
          <button
            key={`${entry.kind}-${entry.id || i}`}
            type="button"
            role="menuitem"
            className={[
              styles.item,
              focused ? styles.itemFocused : '',
              isActive ? styles.itemActive : '',
              entry.kind === 'new-project' ? styles.itemAction : '',
              entry.kind === 'open-page' ? styles.itemFooter : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onMouseEnter={() => setFocusIndex(i)}
            onClick={() => triggerEntry(entry)}
          >
            <span className={styles.itemLabel}>{entry.label}</span>
            {isActive && <span className={styles.itemCheck}>✓</span>}
            {entry.kind === 'open-page' && (
              <span className={styles.itemArrow}>→</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function buildEntries(projects) {
  const list = [
    { kind: 'no-project', id: null, label: '[no project]' },
    ...projects.map(p => ({ kind: 'project', id: p.id, label: p.name })),
    { kind: 'separator' },
    { kind: 'new-project', id: '__new', label: '+ new project' },
    { kind: 'open-page', id: '__page', label: 'open project page' },
  ]
  return list
}

function nextFocusable(entries, from, step) {
  const len = entries.length
  let i = from
  for (let n = 0; n < len; n += 1) {
    i = (i + step + len) % len
    if (entries[i].kind !== 'separator') return i
  }
  return from
}
