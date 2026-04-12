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
import categoriesData  from '../data/presets/_categories.json'

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

// Group presets by category using _categories.json metadata.
// Robust: unknown category → falls into "other". Empty groups not rendered.
function groupByCategory(presets, catData) {
  const buckets = {}
  presets.forEach(p => {
    const key = p.category && catData.categories[p.category] ? p.category : 'other'
    if (!buckets[key]) buckets[key] = []
    buckets[key].push(p)
  })

  const fallbackMeta = { label_en: 'Other', label_de: 'Andere', desc_en: '', desc_de: '' }
  const ordered = []

  // Follow explicit order from _categories.json
  catData.order.forEach(key => {
    if (buckets[key] && buckets[key].length > 0) {
      ordered.push({
        key,
        meta: catData.categories[key] || fallbackMeta,
        presets: buckets[key],
      })
    }
  })

  // Append "other" group last if it has items and wasn't in order
  if (buckets.other && buckets.other.length > 0 && !catData.order.includes('other')) {
    ordered.push({
      key: 'other',
      meta: catData.categories.other || fallbackMeta,
      presets: buckets.other,
    })
  }

  return ordered
}

const PRESET_GROUPS = groupByCategory(ALL_PRESETS, categoriesData)

function buildRoles(preset) {
  const total = preset.rows * preset.cols
  const roles = preset.panelRoles || []
  return Array.from({ length: total }, (_, i) => roles[i] || `Panel ${i + 1}`)
}

// Dim advisory: computes objective panel pixel sizes for a single cropped
// panel at 2K and 4K total-grid resolution. Users see exactly how large
// their single crops will end up — no subjective "good/ok/warn"
// interpretation, just math.
//
// Canvas assumption: square (2048×2048 / 4096×4096). Panel dimensions are
// computed per-axis so non-square grids produce correctly non-square
// panels (e.g. 2×3 at 4K → 1365×2048). Panels are only square when
// rows === cols.
//
// Quality tag reads from the shorter panel edge at 2K — a very elongated
// panel can't fit more detail along its narrow axis, so the short edge
// is what actually limits crop quality:
//   ≥1024 → Hires     (full-detail final-shot material)
//   512…1023 → Standard  (solid single-crop quality)
//   256…511 → Low     (usable as reference, not as finals)
//   <256 → Tiny       (concept board only)
function getDimAdvice(rows, cols) {
  const SIZE_2K = 2048
  const SIZE_4K = 4096
  const panelW2K = Math.floor(SIZE_2K / cols)
  const panelH2K = Math.floor(SIZE_2K / rows)
  const panelW4K = Math.floor(SIZE_4K / cols)
  const panelH4K = Math.floor(SIZE_4K / rows)

  const shortest2K = Math.min(panelW2K, panelH2K)
  let quality, icon
  if (shortest2K >= 1024)      { quality = 'Hires';    icon = '✓' }
  else if (shortest2K >= 512)  { quality = 'Standard'; icon = '✓' }
  else if (shortest2K >= 256)  { quality = 'Low';      icon = '→' }
  else                         { quality = 'Tiny';     icon = '!' }

  return { panelW2K, panelH2K, panelW4K, panelH4K, quality, icon }
}

export default function GridOperator() {
  const { t, tData } = useLang()

  const LAYOUTS = [
    // promptDesc = fest englisch, landet im generierten Prompt
    // desc       = i18n via t(), nur für Tooltips im UI
    { id: 'even',       label: 'Even',       promptDesc: 'uniform cells, equal gaps',                desc: t('grid.layout_even_desc') },
    { id: 'letterbox',  label: 'Letterbox',  promptDesc: '16:9 widescreen cells',                    desc: t('grid.layout_letterbox_desc') },
    { id: 'seamless',   label: 'Seamless',   promptDesc: 'zero gap between cells',                   desc: t('grid.layout_seamless_desc') },
    { id: 'framed',     label: 'Framed',     promptDesc: 'black border frame around the grid',       desc: t('grid.layout_framed_desc') },
    { id: 'storyboard', label: 'Storyboard', promptDesc: 'sketch/storyboard-style cells',            desc: t('grid.layout_storyboard_desc') },
    { id: 'polaroid',   label: 'Polaroid',   promptDesc: 'polaroid-style cells with bottom margin',  desc: t('grid.layout_polaroid_desc') },
  ]

  // Core = Default (ROADMAP Stage 3). Signature steht prominent in der Mitte
  // mit Gold-Stern; Custom als "kein Overlay"-Option am Ende.
  const MODES = [
    { id: 'core',     label: 'Core',              star: false, desc: t('grid.mode_core_desc') },
    { id: 'seengrid', label: 'SeenGrid Signature', star: true, desc: t('grid.mode_seengrid_desc') },
    { id: 'custom',   label: 'Custom Grid',       star: false, desc: t('grid.mode_custom_desc') },
  ]

  const [mode, setMode]               = useState('core')
  const [rows, setRowsRaw]            = useState(3)
  const [cols, setColsRaw]            = useState(3)
  const [activeCategory, setActiveCategory] = useState(PRESET_GROUPS[0]?.key || 'character')
  const [outputExpanded, setOutputExpanded] = useState(false)

  // No dim clamp — all row×col combinations are freely selectable. The
  // advisory below the dim controls tells the user whether the chosen
  // combo is practical for single-cell detail crops or better suited as
  // an overview concept board. Preserving the setRows/setCols wrappers
  // keeps call sites uniform in case we add clamp-on-preset logic later.
  const setRows = setRowsRaw
  const setCols = setColsRaw
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
    // Keep the active category tab in sync with the selected preset so
    // deep-linked / random selections land on the correct tab.
    const group = PRESET_GROUPS.find(g => g.presets.some(p => p.id === selectedPreset.id))
    if (group) setActiveCategory(group.key)
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

  // WICHTIG: promptDesc (fest englisch) verwenden, NICHT desc (i18n).
  // Diese Funktion liefert den Text der im generierten Prompt landet —
  // der muss immer englisch bleiben, egal welche UI-Sprache aktiv ist.
  function getLayoutDesc(l) {
    const found = LAYOUTS.find(x => x.id === l)
    return found ? `${found.label} — ${found.promptDesc}` : l
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

        {/* Mode Toggle — Pills-style. Signature trägt Gold-Glow wenn aktiv. */}
        <div className={styles.modeToggle}>
          {MODES.map(m => (
            <button
              key={m.id}
              className={[
                styles.modeToggleBtn,
                m.id === 'seengrid' && styles.signaturePill,
                mode === m.id && styles.active,
              ].filter(Boolean).join(' ')}
              onClick={() => setMode(m.id)}
              title={m.desc}
            >
              {m.star && <span className={styles.starIcon}>★</span>}{m.label}
            </button>
          ))}
        </div>

        {/* SeenGrid Signature Presets — category-tab navigation.
            Matches Core mode's chip-row+body pattern so the two modes feel
            consistent, and keeps all downstream controls (Layout, Ref,
            Style Override, Panel Roles) visible without internal scroll. */}
        {mode === 'seengrid' && (() => {
          const currentGroup =
            PRESET_GROUPS.find(g => g.key === activeCategory) || PRESET_GROUPS[0]
          return (
            <div className={[styles.section, styles.signatureSection].join(' ')}>
              <p className={styles.sectionTitle}>
                <span className={styles.starIcon}>★</span>{' '}{t('grid.preset_label')}
              </p>

              {/* Category tabs */}
              <div className={styles.categoryTabs}>
                {PRESET_GROUPS.map(group => (
                  <button
                    key={group.key}
                    className={[
                      styles.categoryTab,
                      activeCategory === group.key && styles.active,
                    ].filter(Boolean).join(' ')}
                    onClick={() => setActiveCategory(group.key)}
                    title={tData(group.meta, 'desc')}
                  >
                    {tData(group.meta, 'label')}
                    <span className={styles.categoryTabCount}>{group.presets.length}</span>
                  </button>
                ))}
              </div>

              {/* Active category's preset items */}
              <div className={styles.presetList}>
                {currentGroup?.presets.map(p => (
                  <button
                    key={p.id}
                    className={[styles.presetItem, selectedPreset.id === p.id && styles.active].filter(Boolean).join(' ')}
                    onClick={() => setPreset(p)}
                    title={tData(p, 'desc')}
                  >
                    <div className={styles.presetItemBody}>
                      <div className={styles.presetName}>
                        {p.optimized && <span className={styles.presetStar}>★</span>}
                        {tData(p, 'label')}
                      </div>
                      <div className={styles.presetDesc}>{tData(p, 'desc')}</div>
                    </div>
                    <span className={styles.presetDims}>{p.rows}×{p.cols}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        })()}

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
                  title={tData(tpl, 'desc')}
                >
                  {tData(tpl, 'label')}
                </button>
              ))}
            </div>
            <p className={styles.templateDesc}>
              {tData(coreTemplate, 'desc')}
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
            <>
              <div className={styles.dimControls}>
                <div>
                  <div className={styles.dimLabel}>Rows</div>
                  <div className={styles.dimButtons}>
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <button
                        key={n}
                        className={[styles.dimBtn, rows === n && styles.active].filter(Boolean).join(' ')}
                        onClick={() => setRows(n)}
                        title={t('grid.set_rows_title').replace('{n}', n)}
                      >{n}</button>
                    ))}
                  </div>
                </div>
                <span className={styles.dimX}>×</span>
                <div>
                  <div className={styles.dimLabel}>Cols</div>
                  <div className={styles.dimButtons}>
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <button
                        key={n}
                        className={[styles.dimBtn, cols === n && styles.active].filter(Boolean).join(' ')}
                        onClick={() => setCols(n)}
                        title={t('grid.set_cols_title').replace('{n}', n)}
                      >{n}</button>
                    ))}
                  </div>
                </div>
                <span className={styles.dimTotal}>{totalPanels} {t('grid.panels')}</span>
              </div>

              {/* Objective crop-size advisory — shows the exact pixel
                  dimensions of a single cropped panel at 2K and 4K total
                  grid resolution, plus a quality tag. Users decide for
                  themselves whether the combo fits their use case. */}
              {(() => {
                const advice = getDimAdvice(rows, cols)
                return (
                  <div className={[styles.dimAdvice, styles[`dimAdvice${advice.quality}`]].filter(Boolean).join(' ')}>
                    <div className={styles.dimAdviceHeader}>
                      <span className={styles.dimAdviceLabel}>{t('grid.advice_panel_crop_label')}</span>
                      <span className={styles.dimAdviceQualityTag}>
                        <span className={styles.dimAdviceIcon} aria-hidden="true">{advice.icon}</span>
                        {t(`grid.quality_${advice.quality.toLowerCase()}`)}
                      </span>
                    </div>
                    <div className={styles.dimAdviceSizes}>
                      <span className={styles.dimAdviceRes}>
                        <span className={styles.dimAdviceResTag}>2K</span>
                        <span className={styles.dimAdviceSize}>{advice.panelW2K} × {advice.panelH2K} px</span>
                      </span>
                      <span className={styles.dimAdviceDivider} aria-hidden="true">·</span>
                      <span className={styles.dimAdviceRes}>
                        <span className={styles.dimAdviceResTag}>4K</span>
                        <span className={styles.dimAdviceSize}>{advice.panelW4K} × {advice.panelH4K} px</span>
                      </span>
                    </div>
                  </div>
                )
              })()}
            </>
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

        {/* Panel Roles — auto-fit grid so cells stay readable regardless of
            actual grid dimensions (1×8 strip vs 4×4 board produce the same
            ~170px-min edit cells). The rendered Grid Preview on the right
            is the place that shows true structure; this editor prioritizes
            label legibility. */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>{t('grid.panel_roles')}</p>
          <div className={styles.panelGrid}>
            {panelRoles.slice(0, totalPanels).map((role, i) => (
              <div key={i} className={styles.panelInputWrap}>
                <span className={styles.panelInputNum}>{i + 1}</span>
                <input
                  type="text"
                  className={styles.panelInput}
                  value={role}
                  onChange={e => updatePanelRole(i, e.target.value)}
                  title={`Panel ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RECHTE SPALTE: Preview — Copy + Info sitzen OBEN, Prompt-Feld
          darunter als aufklappbarer Vorschaubereich. So ist der primäre
          Action-Button immer sichtbar, und das potenziell lange Prompt-Feld
          wird erst auf Anfrage expandiert. */}
      <div className={styles.previewColumn}>

        <div className={styles.previewPanel}>
          <p className={styles.previewTitle}>{t('grid.grid_preview')}</p>
          <GridPreview rows={rows} cols={cols} layout={layout} panelRoles={panelRoles} styles={styles} />
        </div>

        <div className={styles.gridOutput}>

          {/* Copy Button — immer oben, immer sichtbar */}
          <button
            className={styles.copyButton}
            onClick={handleCopy}
            title="⌘⇧C"
          >
            <CopyIcon />
            {' '}{copied ? t('common.copied') : t('grid.copy_btn')}
          </button>

          {/* Preset Info — sitzt über dem Prompt-Feld statt darunter */}
          {mode === 'seengrid' && (
            <div className={styles.presetInfo}>
              <p className={styles.presetInfoTitle}>
                {tData(selectedPreset, 'label')}
              </p>
              <p className={styles.presetInfoDesc}>{tData(selectedPreset, 'desc')}</p>
              <p className={styles.presetInfoSource}>Source: {selectedPreset.source}</p>
            </div>
          )}

          {/* Output-Header mit Expand-Toggle */}
          <div className={styles.outputHeader}>
            <span className={styles.outputLabel}>
              {mode === 'custom' ? t('grid.free_prompt') : t('grid.generated_prompt')}
            </span>
            <div className={styles.outputHeaderRight}>
              {mode === 'seengrid' && (
                <span className={styles.sgBadge}>★ SeenGrid Signature</span>
              )}
              {mode !== 'custom' && (
                <button
                  className={styles.expandToggle}
                  onClick={() => setOutputExpanded(p => !p)}
                  title={outputExpanded ? t('grid.collapse_title') : t('grid.expand_title')}
                >
                  {outputExpanded ? '▴' : '▾'} {outputExpanded ? t('grid.collapse') : t('grid.expand')}
                </button>
              )}
            </div>
          </div>

          {/* Prompt-Feld — collapsible preview */}
          {mode === 'custom' ? (
            <textarea
              className={styles.textInput}
              value={customOutput}
              onChange={e => setCustomOutput(e.target.value)}
              placeholder={`${rows}×${cols} Grid — ${totalPanels} ${t('grid.panels')}. ${t('grid.custom_ph_suffix')}`}
              spellCheck={false}
              style={{ minHeight: 160 }}
            />
          ) : (
            <div
              className={[
                styles.outputBox,
                !outputExpanded && styles.outputBoxCollapsed,
              ].filter(Boolean).join(' ')}
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
    <div className={styles.gridPreviewFrame} style={{ background: wrapBg, padding, borderRadius: 'var(--sg-radius-md)', border: '1px solid var(--sg-border-subtle)' }}>
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
