import { useMemo, useRef } from 'react'
import {
  useWorkspaceState,
  useWorkspaceActions,
} from '../../../lib/workspaceStore.js'
import { getDefaultRolesForCase } from '../../../lib/cases/registry.js'
import useOverflowDetection from '../../../hooks/useOverflowDetection.js'
import styles from './PreviewStrip.module.css'

/**
 * Preview-Strip (96px, full-width) unter der 3-Spalten-Row.
 * WORKSPACE_SPEC §7. Niemals in der Canvas-Spalte (NUANCEN 7).
 *
 * Zeigt Mini-Silhouetten-Thumbs pro Panel, horizontal scrollbar.
 * Klick auf Thumb → selectPanel (gleich wie Canvas-Klick).
 *
 * State-Visuals (§7.3):
 *   Default / Selected (Teal) / Signature-Applied (Gold-Tint) /
 *   Override (Gold-Dot, koexistiert mit Signature).
 */

const SILHOUETTE_PATHS = {
  front: 'M30 8 a8 8 0 1 0 .1 0 Z M22 24 L18 60 L22 60 L24 90 L20 112 L26 112 L30 95 L34 112 L40 112 L36 90 L38 60 L42 60 L38 24 Z',
  back: 'M30 8 a8 8 0 1 0 .1 0 Z M22 24 L18 60 L22 60 L24 90 L20 112 L26 112 L30 95 L34 112 L40 112 L36 90 L38 60 L42 60 L38 24 Z M24 30 L36 30',
  right_profile: 'M28 8 a8 8 0 1 0 .1 0 Z M24 24 L20 60 L24 60 L22 90 L18 112 L24 112 L28 90 L32 60 L40 60 L36 24 Z M28 90 L32 112 L38 112 L34 90',
  left_profile: 'M32 8 a8 8 0 1 0 .1 0 Z M24 24 L20 60 L28 60 L28 90 L22 112 L28 112 L32 90 L36 60 L40 60 L36 24 Z M32 90 L28 112 L22 112 L26 90',
  front_right: 'M28 8 a8 8 0 1 0 .1 0 Z M21 24 L17 60 L21 60 L23 90 L19 112 L25 112 L29 95 L33 112 L39 112 L35 90 L37 60 L41 60 L37 24 Z',
  front_left: 'M32 8 a8 8 0 1 0 .1 0 Z M23 24 L19 60 L23 60 L25 90 L21 112 L27 112 L31 95 L35 112 L41 112 L37 90 L39 60 L43 60 L39 24 Z',
  back_right: 'M28 8 a8 8 0 1 0 .1 0 Z M21 24 L17 60 L21 60 L23 90 L19 112 L25 112 L29 95 L33 112 L39 112 L35 90 L37 60 L41 60 L37 24 Z M23 30 L35 30',
  back_left: 'M32 8 a8 8 0 1 0 .1 0 Z M23 24 L19 60 L23 60 L25 90 L21 112 L27 112 L31 95 L35 112 L41 112 L37 90 L39 60 L43 60 L39 24 Z M25 30 L37 30',
}

export default function PreviewStrip() {
  const state = useWorkspaceState()
  const actions = useWorkspaceActions()
  const scrollRef = useRef(null)
  const hasOverflow = useOverflowDetection(scrollRef)

  const strategyDefaults = useMemo(
    () => getDefaultRolesForCase(state.selectedCase, state.panels.length),
    [state.selectedCase, state.panels.length]
  )

  return (
    <div className={styles.bar}>
      <span className={styles.label}>preview</span>
      <div
        ref={scrollRef}
        className={`${styles.scroller} ${hasOverflow ? styles.hasOverflow : ''}`}
      >
        {state.panels.map((panel, i) => {
          const rawRole = panel.role || strategyDefaults[i] || null
          const role = rawRole && SILHOUETTE_PATHS[rawRole]
            ? rawRole
            : (strategyDefaults[i] || null)
          const silhouettePath = role ? SILHOUETTE_PATHS[role] : null
          const isSelected = panel.id === state.selectedPanelId
          const hasSignature = Boolean(panel.signatureId)
          const hasOverride =
            (panel.role && strategyDefaults[i] && panel.role !== strategyDefaults[i]) ||
            Object.keys(panel.overrides || {}).length > 0 ||
            (panel.customNotes && panel.customNotes.trim() !== '') ||
            Boolean(panel.signatureId)
          const classes = [
            styles.thumb,
            isSelected ? styles.selected : '',
            hasSignature ? styles.signatured : '',
          ].filter(Boolean).join(' ')
          const label = role ? String(role).replace(/_/g, ' ') : `panel ${i + 1}`
          return (
            <button
              key={panel.id}
              type="button"
              className={classes}
              onClick={() => actions.selectPanel(panel.id)}
              title={`panel ${i + 1} · ${label}`}
            >
              <div className={styles.thumbBox}>
                {silhouettePath ? (
                  <svg
                    className={styles.silhouette}
                    viewBox="0 0 60 120"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path d={silhouettePath} fill="currentColor" fillRule="evenodd" />
                  </svg>
                ) : (
                  <div className={styles.silhouetteRect} />
                )}
                {hasOverride && <div className={styles.overrideDot} />}
              </div>
              <div className={styles.thumbLabel}>{label}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
