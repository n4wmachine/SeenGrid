import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useWorkspaceState, useWorkspaceActions } from '../../../lib/workspaceStore.js'
import { getDefaultRolesForCase } from '../../../lib/cases/registry.js'
import styles from './Canvas.module.css'

/**
 * Canvas — zentrierte SVG-Panel-Darstellung des Grids.
 *
 * Reagiert live auf State (gridDims, panelOrientation, panels,
 * selectedPanelId, signatures, overrides, customNotes, role).
 *
 * State-Visuals nach WORKSPACE_SPEC §5.3 + NUANCEN 2:
 *   - Default: neutraler Border, Silhouette tertiary
 *   - Hover: Teal-Outline subtle
 *   - Selected: Teal-Border strong
 *   - Signature-Applied: Gold-Border-Tint + Gold-Glow
 *   - Override-vorhanden: Gold-Dot oben rechts
 *
 * Selected + Signature-Applied: Teal gewinnt an der Border, Gold-Glow
 * bleibt sichtbar (NUANCEN 2 §14.3).
 *
 * Klick auf Canvas-Leerraum → Deselect. Klick auf Panel → select.
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

const ASPECT_RATIOS = {
  vertical: { w: 2, h: 3 },
  horizontal: { w: 3, h: 2 },
  square: { w: 1, h: 1 },
}

const GAP = 12
const PADDING = 28

export default function Canvas() {
  const state = useWorkspaceState()
  const actions = useWorkspaceActions()
  const { gridDims, panelOrientation, panels, selectedPanelId, selectedCase } = state

  const outerRef = useRef(null)
  const [panelSize, setPanelSize] = useState({ w: 120, h: 180 })

  const rows = Math.max(1, gridDims.rows)
  const cols = Math.max(1, gridDims.cols)

  useLayoutEffect(() => {
    if (!outerRef.current) return
    const el = outerRef.current
    const ratio = ASPECT_RATIOS[panelOrientation] || ASPECT_RATIOS.vertical

    function recompute() {
      const rect = el.getBoundingClientRect()
      const availW = Math.max(0, rect.width - 2 * PADDING - GAP * (cols - 1))
      const availH = Math.max(0, rect.height - 2 * PADDING - GAP * (rows - 1))
      const perCol = availW / cols
      const perRow = availH / rows
      // Fit aspect ratio within (perCol × perRow)
      let w, h
      if (perCol / ratio.w < perRow / ratio.h) {
        w = perCol
        h = (perCol * ratio.h) / ratio.w
      } else {
        h = perRow
        w = (perRow * ratio.w) / ratio.h
      }
      w = Math.max(32, Math.floor(w))
      h = Math.max(32, Math.floor(h))
      setPanelSize({ w, h })
    }

    recompute()
    const ro = new ResizeObserver(recompute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [rows, cols, panelOrientation])

  // Strategy-default pro Panel-Index — case-zentriert via registry
  // (TODO(free-mode): Refactor-Anchor).
  const strategyDefaults = useMemo(
    () => getDefaultRolesForCase(selectedCase, rows * cols),
    [selectedCase, rows, cols]
  )

  function handleOuterClick(e) {
    if (e.target === outerRef.current || e.target.dataset?.canvasBackground === 'true') {
      actions.selectPanel(null)
    }
  }

  function handlePanelClick(e, panelId) {
    e.stopPropagation()
    actions.selectPanel(panelId)
  }

  if (panels.length === 0) {
    return (
      <div className={styles.outer} ref={outerRef}>
        <span className={styles.empty}>no panels</span>
      </div>
    )
  }

  return (
    <div
      className={styles.outer}
      ref={outerRef}
      onClick={handleOuterClick}
      data-canvas-background="true"
    >
      <div
        className={styles.frame}
        style={{
          gridTemplateColumns: `repeat(${cols}, ${panelSize.w}px)`,
          gridTemplateRows: `repeat(${rows}, ${panelSize.h}px)`,
          gap: `${GAP}px`,
        }}
      >
        {panels.map((panel, i) => {
          // Bug 3 fix: panel.role kann ein Legacy-Wert sein (z.B. "right"
          // statt "right_profile"). Wenn er nicht im Silhouette-Mapping
          // ist, fallback auf strategyDefault — verhindert Dashed-
          // Rectangle-Fallback bei angle_study.
          const rawRole = panel.role || strategyDefaults[i] || null
          const role = rawRole && SILHOUETTE_PATHS[rawRole]
            ? rawRole
            : (strategyDefaults[i] || null)
          const isSelected = panel.id === selectedPanelId
          const hasSignature = Boolean(panel.signatureId)
          const hasOverride = hasOverrideState(panel, strategyDefaults[i])
          const silhouettePath = role ? SILHOUETTE_PATHS[role] : null
          const label = role ? formatRoleLabel(role) : `panel ${i + 1}`
          const classes = [
            styles.panel,
            isSelected ? styles.selected : '',
            hasSignature ? styles.signatured : '',
          ].filter(Boolean).join(' ')

          return (
            <div
              key={panel.id}
              className={classes}
              style={{ width: panelSize.w, height: panelSize.h + 18 }}
              data-panel-id={panel.id}
              onClick={e => handlePanelClick(e, panel.id)}
            >
              <div className={styles.panelBox} style={{ height: panelSize.h }}>
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
                {hasOverride && <div className={styles.overrideDot} aria-hidden="true" />}
              </div>
              <div className={styles.panelLabel}>{label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* -------------------- helpers -------------------- */

function hasOverrideState(panel, strategyDefault) {
  if (panel.role && strategyDefault && panel.role !== strategyDefault) return true
  if (panel.overrides && Object.keys(panel.overrides).length > 0) return true
  if (panel.customNotes && panel.customNotes.trim() !== '') return true
  if (panel.signatureId) return true
  return false
}

function formatRoleLabel(role) {
  return String(role).replace(/_/g, ' ').toLowerCase()
}
