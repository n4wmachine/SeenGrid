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

const PRESETS = [
  worldZone, multiSingle, multiCross,
  charAngle3x3, charAngle2x2, detailStrip,
  twoCharInt, outfitSwap,
  envContinuity, expressionTgt,
  lightingTest, progression,
  cutaway, knolling,
  twoShotKey, archBlueprint, sceneSpatial,
  charSheet8,
]

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
  const [selectedPreset, setPreset]   = useState(PRESETS[0])
  const [panelRoles, setPanelRoles]   = useState(() => buildRoles(PRESETS[0]))
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
      parts.push(`LAYOUT: ${rows}\u00d7${cols} grid. ${getLayoutDesc(layout)}.`)
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

  const dimBtnStyle = (active) => ({
    fontFamily: 'var(--sg-font-mono)',
    fontSize: 'var(--sg-text-sm)',
    padding: '4px 10px',
    borderRadius: 'var(--sg-radius-sm)',
    border: `1px solid ${active ? 'var(--sg-gold-dim)' : 'var(--sg-border-subtle)'}`,
    background: active ? 'var(--sg-chip-bg-active)' : 'var(--sg-bg-surface-0)',
    color: active ? 'var(--sg-gold-text)' : 'var(--sg-text-tertiary)',
    cursor: 'pointer',
    transition: 'all 120ms ease',
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
              {m.star && '★ '}{m.label}
            </button>
          ))}
        </div>

        {/* SeenGrid Presets */}
        {mode === 'seengrid' && (
          <div className={styles.section}>
            <p className={styles.sectionTitle}>{t('grid.preset_label')}</p>
            <div className={styles.presetList}>
              {PRESETS.map(p => (
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
                  <span className={styles.presetBadge}>{p.rows}\u00d7{p.cols}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Core Templates */}
        {mode === 'core' && (
          <div className={styles.section}>
            <p className={styles.sectionTitle}>{t('grid.core_template')}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {coreTemplates.map(tpl => (
                <button
                  key={tpl.id}
                  className={`chip${coreTemplate.id === tpl.id ? ' active' : ''}`}
                  onClick={() => setCoreTemplate(tpl)}
                  title={tpl.desc}
                >
                  {tpl.label}
                </button>
              ))}
            </div>
            <p style={{ marginTop: 10, fontSize: 'var(--sg-text-xs)', color: 'var(--sg-text-tertiary)', fontFamily: 'var(--sg-font-mono)' }}>
              {coreTemplate.desc}
            </p>
          </div>
        )}

        {/* Grid Size */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>{t('grid.grid_size')}</p>
          {mode === 'seengrid' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className={styles.gridSize}>{rows}\u00d7{cols}</span>
              <span className={styles.gridSizeNote}>{t('grid.dim_locked')}</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 'var(--sg-text-xs)', fontFamily: 'var(--sg-font-mono)', color: 'var(--sg-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Rows</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} style={dimBtnStyle(rows === n)} onClick={() => setRows(n)}>{n}</button>
                  ))}
                </div>
              </div>
              <span style={{ fontSize: 'var(--sg-text-xl)', color: 'var(--sg-text-disabled)', fontFamily: 'var(--sg-font-mono)' }}>\u00d7</span>
              <div>
                <div style={{ fontSize: 'var(--sg-text-xs)', fontFamily: 'var(--sg-font-mono)', color: 'var(--sg-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Cols</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} style={dimBtnStyle(cols === n)} onClick={() => setCols(n)}>{n}</button>
                  ))}
                </div>
              </div>
              <span style={{ fontSize: 'var(--sg-text-xs)', fontFamily: 'var(--sg-font-mono)', color: 'var(--sg-text-tertiary)' }}>{totalPanels} {t('grid.panels')}</span>
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
                className={`chip${layout === l.id ? ' active' : ''}`}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--sg-font-mono)', fontSize: 'var(--sg-text-xs)', color: 'var(--sg-gold)', background: 'rgba(212,149,42,0.12)', border: '1px solid rgba(212,149,42,0.25)', borderRadius: 3, padding: '1px 6px' }}>A</span>
                <span style={{ fontSize: 'var(--sg-text-xs)', color: 'var(--sg-text-tertiary)' }}>{t('grid.ref_char')}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--sg-font-mono)', fontSize: 'var(--sg-text-xs)', color: 'var(--sg-gold)', background: 'rgba(212,149,42,0.12)', border: '1px solid rgba(212,149,42,0.25)', borderRadius: 3, padding: '1px 6px' }}>B</span>
                <span style={{ fontSize: 'var(--sg-text-xs)', color: 'var(--sg-text-tertiary)' }}>{t('grid.ref_style')}</span>
              </div>
              <p style={{ fontSize: 'var(--sg-text-xs)', color: 'var(--sg-text-disabled)', fontFamily: 'var(--sg-font-mono)', marginTop: 4 }}>{t('grid.ref_hint')}</p>
            </div>
          </div>
        )}

        {/* Style Override */}
        {mode !== 'custom' && (
          <div className={styles.section}>
            <p className={styles.sectionTitle}>
              {t('grid.style_override')}{' '}
              <span style={{ color: 'var(--sg-text-disabled)', fontWeight: 400 }}>{t('common.optional')}</span>
            </p>
            <input
              type="text"
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 6,
          }}>
            {panelRoles.slice(0, totalPanels).map((role, i) => (
              <input
                key={i}
                type="text"
                value={role}
                onChange={e => updatePanelRole(i, e.target.value)}
                title={`Panel ${i + 1}`}
                style={{ fontSize: 'var(--sg-text-xs)', padding: '6px 8px' }}
              />
            ))}
          </div>
        </div>

      </div>

      {/* RECHTE SPALTE: Preview */}
      <div className={styles.previewColumn}>

        <div className={styles.previewPanel}>
          <p className={styles.previewTitle}>{t('grid.grid_preview')}</p>
          <GridPreview rows={rows} cols={cols} layout={layout} panelRoles={panelRoles} />
        </div>

        <div className={styles.gridOutput}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--sg-font-mono)', fontSize: 'var(--sg-text-xs)', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--sg-text-tertiary)' }}>
              {mode === 'custom' ? t('grid.free_prompt') : t('grid.generated_prompt')}
            </span>
            {mode === 'seengrid' && (
              <span style={{ fontFamily: 'var(--sg-font-mono)', fontSize: 'var(--sg-text-xs)', color: 'var(--sg-gold)', letterSpacing: '0.04em' }}>★ SeenGrid Optimized</span>
            )}
          </div>

          {mode === 'custom' ? (
            <textarea
              value={customOutput}
              onChange={e => setCustomOutput(e.target.value)}
              placeholder={`${rows}\u00d7${cols} Grid — ${totalPanels} ${t('grid.panels')}. ${t('grid.custom_ph_suffix')}`}
              spellCheck={false}
              style={{ minHeight: 200 }}
            />
          ) : (
            <div
              style={{
                background: 'var(--sg-bg-surface-0)',
                border: '1px solid var(--sg-gold-dim)',
                borderRadius: 'var(--sg-radius-lg)',
                padding: 'var(--sg-space-xl)',
                minHeight: 200,
                fontFamily: 'var(--sg-font-mono)',
                fontSize: 'var(--sg-text-sm)',
                lineHeight: 1.7,
                color: 'var(--sg-text-primary)',
                boxShadow: '0 0 16px rgba(212,149,42,0.08)',
                whiteSpace: 'pre-wrap',
                cursor: 'text',
              }}
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
            className="sg-btn-primary"
            style={{ width: '100%', marginTop: 12 }}
            onClick={handleCopy}
          >
            <CopyIcon />
            {' '}{copied ? t('common.copied') : t('grid.copy_btn')}
          </button>

          {mode === 'seengrid' && (
            <div style={{
              marginTop: 16,
              padding: 'var(--sg-space-lg)',
              background: 'var(--sg-bg-surface-1)',
              border: '1px solid var(--sg-border-subtle)',
              borderRadius: 'var(--sg-radius-lg)',
            }}>
              <p style={{ fontFamily: 'var(--sg-font-mono)', fontSize: 'var(--sg-text-xs)', color: 'var(--sg-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                {selectedPreset.label}
              </p>
              <p style={{ fontSize: 'var(--sg-text-sm)', color: 'var(--sg-text-tertiary)' }}>{selectedPreset.desc}</p>
              <p style={{ fontFamily: 'var(--sg-font-mono)', fontSize: 'var(--sg-text-xs)', color: 'var(--sg-text-disabled)', marginTop: 6 }}>Source: {selectedPreset.source}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function GridPreview({ rows, cols, layout, panelRoles }) {
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
          <div key={i} style={{
            background: panelBg,
            border: layout === 'framed' ? 'none' : '1px solid var(--sg-border-subtle)',
            padding: layout === 'polaroid' ? '0 0 18px 0' : 0,
            borderRadius: layout === 'polaroid' ? '1px' : '2px',
            aspectRatio: layout === 'letterbox' ? '16/9' : '1/1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontSize: 7,
              fontFamily: 'var(--sg-font-mono)',
              color: layout === 'polaroid' ? '#777' : 'var(--sg-text-disabled)',
              letterSpacing: '0.3px', textAlign: 'center', padding: '0 4px', lineHeight: 1.3,
            }}>
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
