import { useMemo, useState } from 'react'
import { useWorkspaceState, useWorkspaceActions } from '../../../lib/workspaceStore.js'
import { getDimAdvice } from '../../../lib/dimAdvisory.js'
import casesConfig from '../../../config/cases.config.json'
import modulesConfig from '../../../config/modules.config.json'
import { usePromptPreview } from '../../../context/PromptPreviewContext.jsx'
import styles from './CaseContext.module.css'

/**
 * Case Context Sidebar (260px).
 *
 * 6 Sektionen nach WORKSPACE_SPEC §4:
 *   1. CASE (read-only)
 *   2. REFERENCE STATE (nur Character-Cases)
 *   3. DIMENSIONS (6×4 Klick-Matrix + Dim-Advisory)
 *   4. PANEL ORIENTATION (segmented)
 *   5. FORBIDDEN ELEMENTS (chips + add-input)
 *   6. Modul-globale Settings (datengetrieben aus modules.config.json)
 *
 * Case-Wechsel ist im Workspace blockiert (WORKSPACE_SPEC §15.3) —
 * CASE-Sektion ist read-only.
 */

const MATRIX_COLS = 6
const MATRIX_ROWS = 4

// v1: nur angle_study hat empirisch validierte panel-count-Grenzen.
// Andere Cases akzeptieren jede Dimension im 6×4-Raster.
const VALID_PANEL_COUNTS_BY_CASE = {
  character_angle_study: [3, 4, 6, 8],
}

const CHARACTER_CATEGORY = 'character'

export default function CaseContext() {
  const state = useWorkspaceState()
  const actions = useWorkspaceActions()
  const { setAnchor } = usePromptPreview()
  const {
    selectedCase,
    gridDims,
    panelOrientation,
    forbiddenElements,
    referenceState,
    environmentMode,
    environmentCustomText,
    styleOverlayToken,
    activeModules,
  } = state

  const caseDef = useMemo(
    () => casesConfig.cases.find(c => c.id === selectedCase) || null,
    [selectedCase]
  )

  const isCharacterCase = caseDef?.category === CHARACTER_CATEGORY

  const activeModulesWithGlobals = useMemo(() => {
    const setActive = new Set(activeModules)
    return modulesConfig.modules.filter(
      m => m.hasGlobalSettings && setActive.has(m.id) && m.id !== 'forbidden_elements_user'
    )
  }, [activeModules])

  const isFreeMode = selectedCase === 'free_mode'

  return (
    <div className={styles.root}>
      {isFreeMode ? <SectionFreeMode /> : <SectionCase caseDef={caseDef} />}

      {isCharacterCase && (
        <SectionReferenceState
          value={referenceState}
          onChange={actions.setReferenceState}
        />
      )}

      <SectionDimensions
        caseId={selectedCase}
        rows={gridDims.rows}
        cols={gridDims.cols}
        onSetDims={actions.setDims}
      />

      <SectionOrientation
        value={panelOrientation}
        onChange={actions.setOrientation}
      />

      <SectionForbidden
        items={forbiddenElements}
        onChange={actions.setForbidden}
        setAnchor={setAnchor}
      />

      {activeModulesWithGlobals.map(mod => (
        <SectionModuleGlobal
          key={mod.id}
          mod={mod}
          environmentMode={environmentMode}
          environmentCustomText={environmentCustomText}
          styleOverlayToken={styleOverlayToken}
          actions={actions}
          setAnchor={setAnchor}
        />
      ))}
    </div>
  )
}

/* -------------------- SECTION: FREE MODE -------------------- */

// Kein Case-Readout. Neutrales Mini-Label (Spec §6 · NUANCEN 1:
// Gold bleibt für Signatures reserviert).
function SectionFreeMode() {
  return (
    <div className={styles.section}>
      <div className={styles.label}>mode</div>
      <div className={styles.caseName}>free mode</div>
      <div className={styles.caseDesc}>
        case-less grid · all modules available, nothing pre-selected
      </div>
    </div>
  )
}

/* -------------------- SECTION: CASE -------------------- */

function SectionCase({ caseDef }) {
  return (
    <div className={styles.section}>
      <div className={styles.label}>case</div>
      <div className={styles.caseName}>
        {caseDef ? caseDef.displayName.toLowerCase() : '— no case'}
      </div>
      {caseDef?.description && (
        <div className={styles.caseDesc}>{caseDef.description}</div>
      )}
    </div>
  )
}

/* -------------------- SECTION: REFERENCE STATE -------------------- */

function SectionReferenceState({ value, onChange }) {
  const options = [
    { id: 'clean_full_body', label: 'clean_full_body' },
    { id: 'needs_normalization', label: 'needs_normalization' },
  ]
  return (
    <div className={styles.section}>
      <div className={styles.label}>reference state</div>
      {options.map(opt => (
        <label key={opt.id} className={styles.radioRow}>
          <input
            type="radio"
            name="reference_state"
            checked={value === opt.id}
            onChange={() => onChange(opt.id)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

/* -------------------- SECTION: DIMENSIONS -------------------- */

function SectionDimensions({ caseId, rows, cols, onSetDims }) {
  const [hover, setHover] = useState(null) // { c, r } in 1-based matrix
  const validCounts = VALID_PANEL_COUNTS_BY_CASE[caseId] // undefined → no constraint

  const totalPanels = rows * cols
  const advice = getDimAdvice(rows, cols)
  const q2k = qualityForShort(Math.min(advice.panelW2K, advice.panelH2K))
  const q4k = qualityForShort(Math.min(advice.panelW4K, advice.panelH4K))

  function isValidCount(c, r) {
    if (!validCounts) return true
    return validCounts.includes(c * r)
  }

  function cellClass(c, r) {
    const active = c === cols && r === rows
    const inHover = hover && c <= hover.c && r <= hover.r
    const disabled = !isValidCount(c, r)
    return [
      styles.cell,
      inHover ? styles.cellInRange : '',
      active ? styles.cellActive : '',
      disabled ? styles.cellDisabled : '',
    ].filter(Boolean).join(' ')
  }

  function handleCellClick(c, r) {
    if (!isValidCount(c, r)) return
    onSetDims(r, c) // setDims(rows, cols)
  }

  const cells = []
  for (let r = 1; r <= MATRIX_ROWS; r++) {
    for (let c = 1; c <= MATRIX_COLS; c++) {
      const disabled = !isValidCount(c, r)
      cells.push(
        <div
          key={`${c}-${r}`}
          className={cellClass(c, r)}
          style={{ gridColumn: c, gridRow: r }}
          onMouseEnter={() => setHover({ c, r })}
          onMouseLeave={() => setHover(null)}
          onClick={() => handleCellClick(c, r)}
          title={disabled ? 'invalid panel count for this case' : `${c} × ${r} · ${c * r} panels`}
        />
      )
    }
  }

  return (
    <div className={styles.section}>
      <div className={styles.dimHeaderRow}>
        <span className={styles.label}>dimensions</span>
        <span className={styles.dimDisplay}>
          {cols} × {rows} · {totalPanels} panels
        </span>
      </div>
      <div className={styles.matrix}>{cells}</div>
      <div className={styles.advisory}>
        <div className={styles.advisoryRow}>
          <span className={styles.advisoryLabel}>
            @ 2K  ~{advice.panelW2K} × {advice.panelH2K} px
          </span>
          <span className={styles[`q${q2k}`]}>{q2k}</span>
        </div>
        <div className={styles.advisoryRow}>
          <span className={styles.advisoryLabel}>
            @ 4K  ~{advice.panelW4K} × {advice.panelH4K} px
          </span>
          <span className={styles[`q${q4k}`]}>{q4k}</span>
        </div>
      </div>
    </div>
  )
}

function qualityForShort(shortEdge) {
  if (shortEdge >= 1024) return 'HIRES'
  if (shortEdge >= 512) return 'STANDARD'
  if (shortEdge >= 256) return 'LOW'
  return 'TINY'
}

/* -------------------- SECTION: ORIENTATION -------------------- */

function SectionOrientation({ value, onChange }) {
  const options = ['vertical', 'horizontal', 'square']
  return (
    <div className={styles.section}>
      <div className={styles.label}>panel orientation</div>
      <div className={styles.segmented}>
        {options.map(opt => (
          <button
            key={opt}
            className={`${styles.segmentedBtn} ${value === opt ? styles.segmentedActive : ''}`}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

/* -------------------- SECTION: FORBIDDEN -------------------- */

function SectionForbidden({ items, onChange, setAnchor }) {
  const [draft, setDraft] = useState('')

  function add() {
    const v = draft.trim()
    if (!v) return
    if (items.includes(v)) { setDraft(''); return }
    onChange([...items, v])
    setDraft('')
  }
  function remove(i) {
    onChange(items.filter((_, idx) => idx !== i))
  }

  return (
    <div className={styles.section}>
      <div className={styles.label}>forbidden elements</div>
      {items.length > 0 && (
        <div className={styles.forbiddenList}>
          {items.map((item, i) => (
            <div key={`${item}-${i}`} className={styles.forbiddenRow}>
              <span className={styles.forbiddenText}>{item}</span>
              <button
                className={styles.forbiddenRemove}
                onClick={() => remove(i)}
                aria-label={`remove ${item}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <div className={styles.addRow}>
        <input
          className={styles.inputText}
          type="text"
          value={draft}
          placeholder="e.g. no logos"
          onFocus={() => setAnchor && setAnchor({ key: 'forbidden_elements' })}
          onBlur={() => setAnchor && setAnchor(null)}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
        />
        <button className={styles.addBtn} onClick={add}>+ add</button>
      </div>
    </div>
  )
}

/* -------------------- SECTION: MODULE GLOBAL -------------------- */

function SectionModuleGlobal({
  mod,
  environmentMode,
  environmentCustomText,
  styleOverlayToken,
  actions,
  setAnchor,
}) {
  const anchorOn = key => () => setAnchor && setAnchor({ key })
  const anchorOff = () => setAnchor && setAnchor(null)

  if (mod.id === 'environment_mode') {
    return (
      <div className={styles.section}>
        <div className={styles.label}>environment</div>
        <label className={styles.radioRow}>
          <input
            type="radio"
            name="env_mode"
            checked={environmentMode === 'inherit'}
            onChange={() => actions.setEnvironmentMode('inherit')}
          />
          inherit from reference
        </label>
        <label className={styles.radioRow}>
          <input
            type="radio"
            name="env_mode"
            checked={environmentMode === 'neutral_studio'}
            onChange={() => actions.setEnvironmentMode('neutral_studio')}
          />
          neutral_studio
        </label>
        <label className={styles.radioRow}>
          <input
            type="radio"
            name="env_mode"
            checked={environmentMode === 'custom_text'}
            onChange={() => actions.setEnvironmentMode('custom_text')}
          />
          custom text
        </label>
        {environmentMode === 'custom_text' && (
          <textarea
            className={styles.textarea}
            value={environmentCustomText}
            placeholder="e.g. sparse studio backdrop, neutral grey"
            onFocus={anchorOn('custom_text')}
            onBlur={anchorOff}
            onChange={e => actions.setEnvironmentCustomText(e.target.value)}
          />
        )}
      </div>
    )
  }

  if (mod.id === 'style_overlay') {
    return (
      <div className={styles.section}>
        <div className={styles.label}>style overlay</div>
        <input
          className={styles.inputText}
          type="text"
          value={styleOverlayToken}
          placeholder="token · e.g. deakins-noir"
          onFocus={anchorOn('token')}
          onBlur={anchorOff}
          onChange={e => actions.setStyleOverlayToken(e.target.value)}
        />
      </div>
    )
  }

  // v1 fallback: Mini-Section, Module-Name + Hint.
  return (
    <div className={styles.section}>
      <div className={styles.label}>{mod.displayName}</div>
      <div className={styles.moduleMini}>
        <span className={styles.moduleMiniName}>{mod.id}</span>
        <span className={styles.moduleMiniHint}>global settings · part c</span>
      </div>
    </div>
  )
}
