import React, { useState, useEffect } from 'react'
import styles from './GridOperator.module.css'
import { useLang } from '../context/LangContext.jsx'

import worldZone       from '../data/presets/world-zone-board-3x3.json'
import multiSingle     from '../data/presets/multishot-3x3-single-zone.json'
import multiCross      from '../data/presets/multishot-3x3-cross-zone.json'
import charAngle3x3    from '../data/presets/character-angle-3x3.json'
import charAngle2x2    from '../data/presets/character-angle-study-2x2.json'
import detailStrip     from '../data/presets/detail-anchor-strip.json'
import twoCharInt      from '../data/presets/two-character-integration.json'
import outfitSwap      from '../data/presets/outfit-swap.json'
import envContinuity   from '../data/presets/environment-continuity-2x3.json'
import expressionTgt   from '../data/presets/expression-target-2x3.json'
import lightingTest    from '../data/presets/lighting-test-2x2.json'
import progression     from '../data/presets/progression-1x4.json'
import cutaway         from '../data/presets/cutaway-worldbuilding.json'
import knolling        from '../data/presets/knolling-layout.json'
import twoShotKey      from '../data/presets/2shot-keyframe-2x2.json'
import archBlueprint   from '../data/presets/architectural-blueprint-2x2.json'
import sceneSpatial    from '../data/presets/scene-spatial-layout-2x2.json'
import charSheet8      from '../data/presets/character-sheet-8view.json'
import coreTemplates   from '../data/core-templates.json'

const ALL_PRESETS = [
  worldZone, multiSingle, multiCross,
  charAngle3x3, charAngle2x2, detailStrip,
  twoCharInt, outfitSwap,
  envContinuity, expressionTgt,
  lightingTest, progression,
  cutaway, knolling,
  twoShotKey, archBlueprint, sceneSpatial,
  charSheet8,
]

// Group presets by grid size
function groupPresets(presets) {
  const groups = {}
  presets.forEach(p => {
    const key = `${p.rows}×${p.cols}`
    if (!groups[key]) groups[key] = []
    groups[key].push(p)
  })
  // Sort groups: 3×3 first, then 2×2, then others
  const order = ['3×3', '2×2', '2×3', '1×4', '1×1', '4×2']
  const sorted = []
  order.forEach(k => { if (groups[k]) sorted.push({ key: k, presets: groups[k] }) })
  // Any remaining
  Object.keys(groups).forEach(k => {
    if (!order.includes(k)) sorted.push({ key: k, presets: groups[k] })
  })
  return sorted
}

const PRESET_GROUPS = groupPresets(ALL_PRESETS)

function buildRoles(preset) {
  const total = preset.rows * preset.cols
  const roles = preset.panelRoles || []
  return Array.from({ length: total }, (_, i) => roles[i] || `Panel ${i + 1}`)
}

export default function GridOperator() {
  const { t } = useLang()

  const LAYOUTS = [
    { id: 'even',       label: 'Even',       desc: t('grid.layout_even_desc') },
    { id: 'letterbox',  label: 'Letterbox',  desc: t('grid.layout_letterbox_desc') },
    { id: 'seamless',   label: 'Seamless',   desc: t('grid.layout_seamless_desc') },
    { id: 'framed',     label: 'Framed',     desc: t('grid.layout_framed_desc') },
    { id: 'storyboard', label: 'Storyboard', desc: t('grid.layout_storyboard_desc') },
    { id: 'polaroid',   label: 'Polaroid',   desc: t('grid.layout_polaroid_desc') },
  ]

  const MODES = [
    { id: 'seengrid', label: 'SeenGrid Optimized', star: true,  desc: t('grid.mode_seengrid_desc') },
    { id: 'core',     label: 'Core',               star: false, desc: t('grid.mode_core_desc') },
    { id: 'custom',   label: 'Custom Grid',         star: false, desc: t('grid.mode_custom_desc') },
  ]

  const [mode, setMode]               = useState('seengrid')
  const [rows, setRows]               = useState(3)
  const [cols, setCols]               = useState(3)
  const [layout, setLayout]           = useState('even')
  const [selectedPreset, setPreset]   = useState(ALL_PRESETS[0])
  const [panelRoles, setPanelRoles]   = useState(() => buildRoles(ALL_PRESETS[0]))
  const [coreTemplate, setCoreTemplate] = useState(coreTemplates[0])
  const [coreSubject, setCoreSubj]    = useState('')
  const [coreStyle, setCoreStyle]     = useState('')
  const [customOutput, setCustomOutput] = useState('')
  const [copied, setCopied]           = useState(false)

  useEffect(() => {
    setRows(selectedPreset.rows)
    setCols(selectedPreset.cols)
    setLayout(selectedPreset.layout?.toLowerCase() || 'even')
    setPanelRoles(buildRoles(selectedPreset))
  }, [selectedPreset])

  useEffect(() => {
    if (mode !== 'core') return
    const key = `${rows}x${cols}`
    const defaults = coreTemplate.panelRoleDefaults?.[key] || coreTemplate.panelRoles || []
    if (defaults.length) setPanelRoles(defaults)
  }, [coreTemplate]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mode !== 'core' && mode !== 'custom') return
    const total = rows * cols
    setPanelRoles(prev => {
      if (prev.length === total) return prev
      if (prev.length < total) {
        return [...prev, ...Array.from({ length: total - prev.length }, (_, i) => `Panel ${prev.length + i + 1}`)]
      }
      return prev.slice(0, total)
    })
  }, [rows, cols, mode])

  function getLayoutDesc(l) {
    const found = LAYOUTS.find(x => x.id === l)
    return found ? `${found.label} — ${found.desc}` : l
  }

  function buildOutput() {
    const totalPanels = rows * cols

    if (mode === 'seengrid') {
      const parts = [selectedPreset.prompt]
      parts.push(`LAYOUT: ${rows}×${cols} grid. ${getLayoutDesc(layout)}.`)
      if (coreStyle) parts.push(`STYLE OVERRIDE: Apply ${coreStyle}.`)
      return parts.join('\n\n')
    }

    if (mode === 'custom') return customOutput

    const panelLines = panelRoles
      .slice(0, totalPanels)
      .map((role, i) => `  Panel ${i + 1} [${role}]:`)
      .join('\n')

    let prompt = coreTemplate.template
      .replace(/\{rows\}/g, rows)
      .replace(/\{cols\}/g, cols)
      .replace(/\{count\}/g, totalPanels)
      .replace(/\{panelLines\}/g, panelLines)
      .replace(/\{layout\}/g, getLayoutDesc(layout))

    if (coreSubject) prompt = `SUBJECT: ${coreSubject}\n\n` + prompt
    if (coreStyle)   prompt += `\n\nSTYLE: ${coreStyle}`

    return prompt
  }

  const output      = buildOutput()
  const totalPanels = rows * cols

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch { /* noop */ }
  }

  function updatePanelRole(index, value) {
    setPanelRoles(prev => { const n = [...prev]; n[index] = value; return n })
  }

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        handleCopy()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  return (
    <div className={styles.container}>

      {/* LINKE SPALTE: Controls */}
      <div className={styles.controlsColumn}>

        {/* Mode Toggle */}
        <div className={styles.modeToggle}>
          {MODES.map(m => (
            <button
              key={m.id}
              className={[styles.modeToggleBtn, mode === m.id && styles.active].filter(Boolean).join(' ')}
              onClick={() => setMode(m.id)}
              title={m.desc}
            >
              {m.star && <span className={styles.starIcon}>★</span>}{m.label}
            </button>
          ))}
        </div>

        {/* SeenGrid Presets — GROUPED */}
        {mode === 'seengrid' && (
          <div className={styles.section}>
            <p className={styles.sectionTitle}>{t('grid.preset_label')}</p>
            <div className={styles.presetList}>
              {PRESET_GROUPS.map(group => (
                <div key={group.key} className={styles.presetGroup}>
                  <div className={styles.presetGroupHeader}>
                    <span className={styles.presetGroupLabel}>{group.key}</span>
                    <span className={styles.presetGroupCount}>{group.presets.length}</span>
                  </div>
                  {group.presets.map(p => (
                    <button
                      key={p.id}
                      className={[styles.presetItem, selectedPreset.id === p.id && styles.active].filter(Boolean).join(' ')}
                      onClick={() => setPreset(p)}
                      title={p.desc}
                    >
                      <div>
                        <div className={styles.presetName}>{p.label}</div>
                        <div className={styles.presetDesc}>{p.desc}</div>
                      </div>
                      {p.optimized && (
                        <span className={styles.presetOptBadge}>★</span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Templates */}
        {mode === 'core' && (
          <div className={styles.section}>
            <p className={styles.sectionTitle}>{t('grid.core_template')}</p>
            <div className={styles.chipGrid}>
              {coreTemplates.map(tpl => (
                <button
                  key={tpl.id}
                  className={[styles.chip, coreTemplate.id === tpl.id && styles.active].filter(Boolean).join(' ')}
                  onClick={() => setCoreTemplate(tpl)}
                  title={tpl.desc}
                >
                  {tpl.label}
                </button>
              ))}
            </div>
            <p className={styles.templateDesc}>
              {coreTemplate.desc}
            </p>
          </div>
        )}

        {/* Grid Size */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>{t('grid.grid_size')}</p>
          {mode === 'seengrid' ? (
            <div className={styles.gridSizeDisplay}>
              <span className={styles.gridSize}>{rows}×{cols}</span>
              <span className={styles.gridSizeNote}>{t('grid.dim_locked')}</span>
            </div>
          ) : (
            <div className={styles.dimControls}>
              <div>
                <div className={styles.dimLabel}>Rows</div>
                <div className={styles.dimButtons}>
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      className={[styles.dimBtn, rows === n && styles.active].filter(Boolean).join(' ')}
                      onClick={() => setRows(n)}
                    >{n}</button>
                  ))}
                </div>
              </div>
              <span className={styles.dimX}>×</span>
              <div>
                <div className={styles.dimLabel}>Cols</div>
                <div className={styles.dimButtons}>
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      className={[styles.dimBtn, cols === n && styles.active].filter(Boolean).join(' ')}
                      onClick={() => setCols(n)}
                    >{n}</button>
                  ))}
                </div>
              </div>
              <span className={styles.dimTotal}>{totalPanels} {t('grid.panels')}</span>
            </div>
          )}
        </div>

        {/* Layout */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>{t('grid.layout')}</p>
          <div className={styles.layoutChips}>
            {LAYOUTS.map(l => (
              <button
                key={l.id}
                className={[styles.chip, layout === l.id && styles.active].filter(Boolean).join(' ')}
                onClick={() => setLayout(l.id)}
                title={l.desc}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reference Images (SeenGrid mode) */}
        {mode === 'seengrid' && (
          <div className={styles.section}>
            <p className={styles.sectionTitle}>{t('grid.ref_images')}</p>
            <div className={styles.refList}>
              <div className={styles.refItem}>
                <span className={styles.refBadge}>A</span>
                <span className={styles.refText}>{t('grid.ref_char')}</span>
              </div>
              <div className={styles.refItem}>
                <span className={styles.refBadge}>B</span>
                <span className={styles.refText}>{t('grid.ref_style')}</span>
              </div>
              <p className={styles.refHint}>{t('grid.ref_hint')}</p>
            </div>
          </div>
        )}

        {/* Style Override */}
        {mode !== 'custom' && (
          <div className={styles.section}>
            <p className={styles.sectionTitle}>
              {t('grid.style_override')}{' '}
              <span className={styles.optionalLabel}>{t('common.optional')}</span>
            </p>
            <input
              type="text"
              className={styles.textInput}
              value={coreStyle}
              onChange={e => setCoreStyle(e.target.value)}
              placeholder={mode === 'seengrid' ? t('grid.style_ph_sg') : t('grid.style_ph_core')}
            />
          </div>
        )}

        {/* Core Subject */}
        {mode === 'core' && (
          <div className={styles.section}>
            <p className={styles.sectionTitle}>{t('grid.core_subject')}</p>
            <textarea
              className={styles.textInput}
              rows={2}
              value={coreSubject}
              onChange={e => setCoreSubj(e.target.value)}
              placeholder={t('grid.core_subject_ph')}
            />
          </div>
        )}

        {/* Panel Roles */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>{t('grid.panel_roles')}</p>
          <div className={styles.panelGrid} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {panelRoles.slice(0, totalPanels).map((role, i) => (
              <input
                key={i}
                type="text"
                className={styles.panelInput}
                value={role}
                onChange={e => updatePanelRole(i, e.target.value)}
                title={`Panel ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* RECHTE SPALTE: Preview */}
      <div className={styles.previewColumn}>

        <div className={styles.previewPanel}>
          <p className={styles.previewTitle}>{t('grid.grid_preview')}</p>
          <GridPreview rows={rows} cols={cols} layout={layout} panelRoles={panelRoles} styles={styles} />
        </div>

        <div className={styles.gridOutput}>
          <div className={styles.outputHeader}>
            <span className={styles.outputLabel}>
              {mode === 'custom' ? t('grid.free_prompt') : t('grid.generated_prompt')}
            </span>
            {mode === 'seengrid' && (
              <span className={styles.sgBadge}>★ SeenGrid Optimized</span>
            )}
          </div>

          {mode === 'custom' ? (
            <textarea
              className={styles.textInput}
              value={customOutput}
              onChange={e => setCustomOutput(e.target.value)}
              placeholder={`${rows}×${cols} Grid — ${totalPanels} ${t('grid.panels')}. ${t('grid.custom_ph_suffix')}`}
              spellCheck={false}
              style={{ minHeight: 200 }}
            />
          ) : (
            <div
              className={styles.outputBox}
              onClick={e => {
                const range = document.createRange()
                range.selectNodeContents(e.currentTarget)
                const sel = window.getSelection()
                sel.removeAllRanges()
                sel.addRange(range)
              }}
            >
              {output}
            </div>
          )}

          <button
            className={styles.copyButton}
            onClick={handleCopy}
            title="⌘⇧C"
          >
            <CopyIcon />
            {' '}{copied ? t('common.copied') : t('grid.copy_btn')}
          </button>

          {mode === 'seengrid' && (
            <div className={styles.presetInfo}>
              <p className={styles.presetInfoTitle}>
                {selectedPreset.label}
              </p>
              <p className={styles.presetInfoDesc}>{selectedPreset.desc}</p>
              <p className={styles.presetInfoSource}>Source: {selectedPreset.source}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function GridPreview({ rows, cols, layout, panelRoles, styles }) {
  const gap     = layout === 'seamless' ? 0 : layout === 'framed' ? 3 : 2
  const padding = layout === 'polaroid' ? 6 : 0
  const wrapBg  = layout === 'polaroid' ? '#f0ece4' : layout === 'framed' ? '#000' : 'var(--sg-bg-surface-1)'
  const panelBg = layout === 'storyboard'
    ? 'repeating-linear-gradient(45deg, var(--sg-bg-surface-2), var(--sg-bg-surface-2) 2px, var(--sg-bg-surface-3) 2px, var(--sg-bg-surface-3) 8px)'
    : 'var(--sg-bg-surface-2)'

  return (
    <div style={{ background: wrapBg, padding, borderRadius: 'var(--sg-radius-md)', border: '1px solid var(--sg-border-subtle)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>
        {Array.from({ length: rows * cols }, (_, i) => (
          <div key={i} className={styles.gridCell} style={{
            background: panelBg,
            border: layout === 'framed' ? 'none' : undefined,
            padding: layout === 'polaroid' ? '0 0 18px 0' : 0,
            borderRadius: layout === 'polaroid' ? '1px' : '2px',
            aspectRatio: layout === 'letterbox' ? '16/9' : '1/1',
          }}>
            <span className={styles.gridCellLabel}>
              {panelRoles[i] || `P${i + 1}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3z"/>
  </svg>
)
