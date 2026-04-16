/**
 * CustomBuilderPoc — Slice 3 Throwaway UI (BUILD_PLAN §14 conforming)
 *
 * Strikt nach BUILD_PLAN.md §14 Slice 3:
 *
 *   > Der Custom-Builder-Tab zeigt: Case-Dropdown (nur character_angle_study
 *   > bisher), Rows/Cols/Orientation-Picker, Live-JSON-Prompt-Output,
 *   > Copy-JSON-Button. KEIN Module-Panel, KEIN Visual Preview.
 *
 * Scope-Grenze (wichtig, hier lief der erste Versuch schief): Module-
 * Toggles gehören explizit NICHT in diese Slice:
 *   - face_reference           → Slice 4
 *   - environment mode picker  → Slice 5
 *   - SVG visual preview       → Slice 6
 *   - style_overlay token      → Slice 7
 *   - user-level forbiddens    → nicht in §14, später
 *
 * Die panel_count-Whitelist [3,4,6,8] für character_angle_study ist §6
 * Constrained Modularity (nicht ein Bug, sondern der ganze Punkt). Der
 * User erlebt sie via Rows × Cols mit einer Validitäts-Prüfung gegen
 * VALID_PANEL_COUNTS, nicht via nacktes panel_count-Dropdown — siehe
 * §4 Punkt 1 ("Rows × Cols als echtes Feature, plus Panel-Orientierung
 * als separate Dimension").
 *
 * Spalten-Konvention aus §4 Punkt 1: "4×1 horizontal-row mit vertical
 * panels" = 4 Spalten × 1 Reihe. Also cols × rows (width × height).
 * Die UI labelt beide Felder explizit, damit die Konvention nicht
 * geraten werden muss.
 *
 * Die Komponente ist weiterhin throwaway: inline styles, keine
 * .module.css, keine i18n. Finale Zieladresse per §14 ist
 * `src/components/GridOperator/CustomBuilder.jsx` nach Jonas' Visual
 * Overhaul (eigener Track).
 */

import React, { useState, useMemo } from 'react'
import { buildDefaultState } from '../lib/cases/characterAngleStudy/defaults.js'
import { compileToString } from '../lib/compiler/index.js'
import {
  VALID_PANEL_COUNTS,
  CASE_ID,
  ENVIRONMENT_MODES,
} from '../lib/cases/characterAngleStudy/schema.js'
import { panelRoleStrategy } from '../lib/cases/characterAngleStudy/panelRoleStrategy.js'

// Case-Registry für die POC. Nur ein Eintrag bisher, aber der Slot
// ist da — Slice 5+ kann hier einfach anhängen ohne die UI umzubauen.
const AVAILABLE_CASES = [
  { id: CASE_ID, label: 'character_angle_study' },
]

// Panel-Orientation ist eine separate Dimension zum Grid-Shape
// (§4 Punkt 1). Ein 4×1 Grid mit vertical panels sieht völlig anders
// aus als ein 4×1 Grid mit horizontal panels.
const PANEL_ORIENTATIONS = ['vertical', 'horizontal']

// panel_arrangement-Policy: der Default-State trägt "single_horizontal_row",
// was strukturell nur zu rows === 1 && cols > 1 passt (4×1, 3×1, 6×1, 8×1 —
// alle in VALID_PANEL_COUNTS). Bei allen anderen Shapes (1×4, 2×3, 2×2, …)
// wird das Feld aus dem Layout-Block entfernt statt einen neuen, nicht
// empirisch getesteten Enum-Wert wie "grid_2x3" zu erfinden (Jonas-OK
// 2026-04-16: "Nicht lügen, keine ungetesteten Enum-Wörter an NanoBanana
// schicken"). Spätere Slices können validierte Werte ergänzen, aber erst
// nach NanoBanana-Gegentest.
function applyPanelArrangement(layout, cols, rows) {
  if (rows === 1 && cols > 1) {
    layout.panel_arrangement = 'single_horizontal_row'
  } else {
    delete layout.panel_arrangement
  }
}

/**
 * SVG silhouette paths per view direction — Slice 6.
 * Simple head+torso+legs outlines, distinguishable at small sizes.
 * viewBox is 0 0 60 120 for all.
 */
const SILHOUETTE_PATHS = {
  // Front: symmetric figure facing viewer
  front: 'M30 8 a8 8 0 1 0 .1 0 Z M22 24 L18 60 L22 60 L24 90 L20 112 L26 112 L30 95 L34 112 L40 112 L36 90 L38 60 L42 60 L38 24 Z',
  // Back: same shape, horizontal line across shoulders to suggest "away"
  back: 'M30 8 a8 8 0 1 0 .1 0 Z M22 24 L18 60 L22 60 L24 90 L20 112 L26 112 L30 95 L34 112 L40 112 L36 90 L38 60 L42 60 L38 24 Z M24 30 L36 30',
  // Right profile: figure shifted left, legs staggered
  right_profile: 'M28 8 a8 8 0 1 0 .1 0 Z M24 24 L20 60 L24 60 L22 90 L18 112 L24 112 L28 90 L32 60 L40 60 L36 24 Z M28 90 L32 112 L38 112 L34 90',
  // Left profile: mirrored right
  left_profile: 'M32 8 a8 8 0 1 0 .1 0 Z M24 24 L20 60 L28 60 L28 90 L22 112 L28 112 L32 90 L36 60 L40 60 L36 24 Z M32 90 L28 112 L22 112 L26 90',
  // Diagonal views — slight offset to suggest 3/4 angle
  front_right: 'M28 8 a8 8 0 1 0 .1 0 Z M21 24 L17 60 L21 60 L23 90 L19 112 L25 112 L29 95 L33 112 L39 112 L35 90 L37 60 L41 60 L37 24 Z',
  front_left: 'M32 8 a8 8 0 1 0 .1 0 Z M23 24 L19 60 L23 60 L25 90 L21 112 L27 112 L31 95 L35 112 L41 112 L37 90 L39 60 L43 60 L39 24 Z',
  back_right: 'M28 8 a8 8 0 1 0 .1 0 Z M21 24 L17 60 L21 60 L23 90 L19 112 L25 112 L29 95 L33 112 L39 112 L35 90 L37 60 L41 60 L37 24 Z M23 30 L35 30',
  back_left: 'M32 8 a8 8 0 1 0 .1 0 Z M23 24 L19 60 L23 60 L25 90 L21 112 L27 112 L31 95 L35 112 L41 112 L37 90 L39 60 L43 60 L39 24 Z M25 30 L37 30',
}

// Fallback for any view not in the map
const FALLBACK_SILHOUETTE = SILHOUETTE_PATHS.front

function PanelDummy({ index, view, isVertical }) {
  const path = SILHOUETTE_PATHS[view] || FALLBACK_SILHOUETTE
  const w = isVertical ? 60 : 90
  const h = isVertical ? 90 : 60
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
    }}>
      <div style={{
        width: w,
        height: h,
        border: '1px solid var(--sg-border, #2a2a2a)',
        borderRadius: '4px',
        background: 'var(--sg-bg-input, #0d0d0d)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <svg
          viewBox="0 0 60 120"
          width={isVertical ? 40 : 28}
          height={isVertical ? 70 : 48}
          style={{ opacity: 0.5 }}
        >
          <path d={path} fill="var(--sg-text-tertiary, #888)" fillRule="evenodd" />
        </svg>
      </div>
      <span style={{
        fontSize: '9px',
        fontFamily: 'var(--sg-font-mono, monospace)',
        color: 'var(--sg-text-tertiary, #888)',
        textAlign: 'center',
        lineHeight: 1.2,
      }}>
        {index}. {view}
      </span>
    </div>
  )
}

// Inline style tokens — throwaway, no .module.css
const styles = {
  wrap: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '24px',
    padding: '24px',
    height: '100%',
    overflow: 'auto',
    fontFamily: 'var(--sg-font-sans, system-ui)',
    color: 'var(--sg-text-primary, #e6e6e6)',
    background: 'var(--sg-bg-app, #111)',
    boxSizing: 'border-box',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    overflowY: 'auto',
  },
  header: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  subheader: {
    margin: 0,
    fontSize: '11px',
    color: 'var(--sg-text-tertiary, #888)',
    fontFamily: 'var(--sg-font-mono, monospace)',
  },
  warning: {
    padding: '8px 10px',
    fontSize: '11px',
    fontFamily: 'var(--sg-font-mono, monospace)',
    color: '#f6c35c',
    border: '1px solid #6b5020',
    background: 'rgba(246, 195, 92, 0.08)',
    borderRadius: '4px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '12px',
    border: '1px solid var(--sg-border, #2a2a2a)',
    borderRadius: '6px',
    background: 'var(--sg-bg-panel, #181818)',
  },
  sectionTitle: {
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--sg-text-tertiary, #888)',
    fontFamily: 'var(--sg-font-mono, monospace)',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '11px',
    color: 'var(--sg-text-secondary, #bbb)',
    fontFamily: 'var(--sg-font-mono, monospace)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  control: {
    padding: '6px 8px',
    fontSize: '12px',
    fontFamily: 'var(--sg-font-mono, monospace)',
    background: 'var(--sg-bg-input, #0d0d0d)',
    color: 'var(--sg-text-primary, #e6e6e6)',
    border: '1px solid var(--sg-border, #2a2a2a)',
    borderRadius: '4px',
    outline: 'none',
  },
  gridRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  validityOk: {
    fontSize: '11px',
    fontFamily: 'var(--sg-font-mono, monospace)',
    color: 'var(--sg-text-tertiary, #888)',
  },
  validityBad: {
    fontSize: '11px',
    fontFamily: 'var(--sg-font-mono, monospace)',
    color: '#f6c35c',
  },
  preview: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minHeight: 0,
  },
  previewHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  copyBtn: {
    padding: '6px 12px',
    fontSize: '11px',
    fontFamily: 'var(--sg-font-mono, monospace)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--sg-text-primary, #e6e6e6)',
    background: 'var(--sg-bg-panel, #181818)',
    border: '1px solid var(--sg-border, #2a2a2a)',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  output: {
    flex: 1,
    margin: 0,
    padding: '16px',
    fontSize: '11px',
    lineHeight: 1.5,
    fontFamily: 'var(--sg-font-mono, monospace)',
    color: 'var(--sg-text-primary, #e6e6e6)',
    background: 'var(--sg-bg-input, #0d0d0d)',
    border: '1px solid var(--sg-border, #2a2a2a)',
    borderRadius: '6px',
    overflow: 'auto',
    whiteSpace: 'pre',
  },
  error: {
    color: '#f27272',
    borderColor: '#6a2a2a',
  },
}

export default function CustomBuilderPoc() {
  // Slice 3 State: nur die vier Dinge aus §14 Slice 3.
  const [caseId, setCaseId] = useState(CASE_ID)
  const [cols, setCols] = useState(4)
  const [rows, setRows] = useState(1)
  const [panelOrientation, setPanelOrientation] = useState('vertical')
  const [faceReference, setFaceReference] = useState(true)
  const [envMode, setEnvMode] = useState('inherit_from_reference')
  const [envCustomText, setEnvCustomText] = useState('')
  const [styleOverlay, setStyleOverlay] = useState(false)
  const [styleToken, setStyleToken] = useState('')
  const [copied, setCopied] = useState(false)

  const panelCount = cols * rows
  const panelCountValid = VALID_PANEL_COUNTS.includes(panelCount)

  // Build state from UI state each render. Kein persistenter React-
  // State-Holder nötig — die vier Controls sind die single source of
  // truth, alles andere ist derived.
  const compiled = useMemo(() => {
    const s = buildDefaultState()
    s.case = caseId
    s.layout.panel_count = panelCount
    s.layout.panel_orientation = panelOrientation
    applyPanelArrangement(s.layout, cols, rows)
    s.references.face_reference.enabled = faceReference
    s.environment.mode = envMode
    s.environment.custom_text = envMode === 'custom_text' ? envCustomText : null
    s.style_overlay.enabled = styleOverlay
    s.style_overlay.source = styleOverlay ? 'look_lab' : null
    s.style_overlay.token = styleOverlay && styleToken.trim() ? styleToken.trim() : null

    if (!panelCountValid) {
      return {
        ok: false,
        output:
          `invalid panel_count for ${caseId}\n\n` +
          `  cols × rows = ${cols} × ${rows} = ${panelCount}\n` +
          `  supported:   ${VALID_PANEL_COUNTS.join(', ')}\n\n` +
          `pick cols and rows so their product is in the supported list.\n` +
          `e.g. 4×1, 1×4, 3×1, 1×3, 6×1, 2×3, 2×4.`,
      }
    }

    try {
      return { ok: true, output: compileToString(s) }
    } catch (err) {
      return { ok: false, output: err?.message ?? String(err) }
    }
  }, [caseId, cols, rows, panelOrientation, panelCount, panelCountValid, faceReference, envMode, envCustomText, styleOverlay, styleToken])

  const onCopy = async () => {
    if (!compiled.ok) return
    try {
      await navigator.clipboard.writeText(compiled.output)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Ignore clipboard failures in the POC.
    }
  }

  const clampDim = (v) => {
    const n = Number(v)
    if (!Number.isFinite(n)) return 1
    return Math.max(1, Math.min(8, Math.floor(n)))
  }

  return (
    <div style={styles.wrap}>
      {/* ---- Controls ------------------------------------------------- */}
      <div style={styles.controls}>
        <div>
          <h2 style={styles.header}>Custom Builder — POC (Slice 3)</h2>
          <p style={styles.subheader}>
            §14 slice 3 scope · case · rows×cols · orientation · copy
          </p>
        </div>

        <div style={styles.warning}>
          Provisorischer fünfter Tab. Finale Zieladresse:
          src/components/GridOperator/CustomBuilder.jsx nach Visual Overhaul.
          Module-Toggles: face_reference (4), environment (5),
          style_overlay (7), visual preview (6) — alle live.
        </div>

        {/* (a) Case */}
        <div style={styles.section}>
          <span style={styles.sectionTitle}>case</span>
          <select
            style={styles.control}
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
          >
            {AVAILABLE_CASES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <span style={styles.subheader}>
            only 1 case wired so far — more in slice 5+
          </span>
        </div>

        {/* (b) Rows × Cols */}
        <div style={styles.section}>
          <span style={styles.sectionTitle}>grid dimensions</span>
          <div style={styles.gridRow}>
            <label style={styles.label}>
              cols
              <input
                style={{ ...styles.control, width: '60px' }}
                type="number"
                min={1}
                max={8}
                value={cols}
                onChange={(e) => setCols(clampDim(e.target.value))}
              />
            </label>
            <span
              style={{
                ...styles.subheader,
                alignSelf: 'end',
                paddingBottom: '8px',
              }}
            >
              ×
            </span>
            <label style={styles.label}>
              rows
              <input
                style={{ ...styles.control, width: '60px' }}
                type="number"
                min={1}
                max={8}
                value={rows}
                onChange={(e) => setRows(clampDim(e.target.value))}
              />
            </label>
          </div>
          <span style={panelCountValid ? styles.validityOk : styles.validityBad}>
            panel_count = {cols} × {rows} = {panelCount}
            {!panelCountValid &&
              ` — invalid, must be one of ${VALID_PANEL_COUNTS.join(', ')}`}
          </span>
          <span style={styles.subheader}>
            §4: cols × rows convention. e.g. 4×1 = horizontal row of 4.
          </span>
        </div>

        {/* (c) Panel Orientation */}
        <div style={styles.section}>
          <span style={styles.sectionTitle}>panel orientation</span>
          <select
            style={styles.control}
            value={panelOrientation}
            onChange={(e) => setPanelOrientation(e.target.value)}
          >
            {PANEL_ORIENTATIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <span style={styles.subheader}>
            individual panel shape, separate dimension from grid (§4 pt 1)
          </span>
        </div>

        {/* (d) Face Reference — Slice 4 */}
        <div style={styles.section}>
          <span style={styles.sectionTitle}>modules</span>
          <label style={{ ...styles.label, flexDirection: 'row', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={faceReference}
              onChange={(e) => setFaceReference(e.target.checked)}
              style={{ accentColor: 'var(--sg-accent, #7c6aef)' }}
            />
            face_reference
          </label>
          <span style={styles.subheader}>
            adds a second reference image slot for facial identity
          </span>

          {/* (e) Environment Mode — Slice 5 */}
          <div style={{ borderTop: '1px solid var(--sg-border, #2a2a2a)', paddingTop: '10px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={styles.label}>
              environment
              <select
                style={styles.control}
                value={envMode}
                onChange={(e) => setEnvMode(e.target.value)}
              >
                {ENVIRONMENT_MODES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>
            {envMode === 'custom_text' && (
              <label style={styles.label}>
                custom environment
                <input
                  style={styles.control}
                  type="text"
                  placeholder="e.g. misty forest at dawn"
                  value={envCustomText}
                  onChange={(e) => setEnvCustomText(e.target.value)}
                />
              </label>
            )}
            <span style={styles.subheader}>
              inherit = from reference · neutral_studio = plain backdrop · custom = your text
            </span>
          </div>

          {/* (g) Style Overlay — Slice 7 */}
          <div style={{ borderTop: '1px solid var(--sg-border, #2a2a2a)', paddingTop: '10px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ ...styles.label, flexDirection: 'row', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={styleOverlay}
                onChange={(e) => setStyleOverlay(e.target.checked)}
                style={{ accentColor: 'var(--sg-accent, #7c6aef)' }}
              />
              style_overlay
            </label>
            {styleOverlay && (
              <label style={styles.label}>
                style token
                <input
                  style={styles.control}
                  type="text"
                  placeholder="e.g. warm_neon_diner_glow"
                  value={styleToken}
                  onChange={(e) => setStyleToken(e.target.value)}
                />
              </label>
            )}
            <span style={styles.subheader}>
              look lab style token · later: dropdown from saved styles
            </span>
          </div>
        </div>
      </div>

      {/* ---- Preview -------------------------------------------------- */}
      <div style={styles.preview}>

        {/* (f) Visual Preview — Slice 6 */}
        {panelCountValid && (
          <div style={styles.section}>
            <span style={styles.sectionTitle}>panel preview</span>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
              padding: '8px 0',
            }}>
              {panelRoleStrategy(panelCount).map((role, i) => (
                <PanelDummy
                  key={i}
                  index={i + 1}
                  view={role.view}
                  isVertical={panelOrientation === 'vertical'}
                />
              ))}
            </div>
          </div>
        )}

        <div style={styles.previewHeader}>
          <div>
            <div style={styles.sectionTitle}>compiled prompt-json</div>
            <div style={styles.subheader}>
              {compiled.ok
                ? `${compiled.output.length} chars · paste-ready for NanoBanana`
                : 'compile error'}
            </div>
          </div>
          <button
            style={styles.copyBtn}
            onClick={onCopy}
            disabled={!compiled.ok}
          >
            {copied ? '✓ copied' : 'copy'}
          </button>
        </div>
        <pre
          style={{
            ...styles.output,
            ...(compiled.ok ? {} : styles.error),
          }}
        >
          {compiled.output}
        </pre>
      </div>
    </div>
  )
}
