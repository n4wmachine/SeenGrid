import React, { useState, useEffect } from 'react'
import styles from './GridOperator.module.css'
import { useLang } from '../context/LangContext.jsx'

import worldZone     from '../data/presets/world-zone-board-3x3.json'
import multiSingle   from '../data/presets/multishot-3x3-single-zone.json'
import multiCross    from '../data/presets/multishot-3x3-cross-zone.json'
import charAngle3x3  from '../data/presets/character-angle-3x3.json'
import charAngle2x2  from '../data/presets/character-angle-study-2x2.json'
import detailStrip   from '../data/presets/detail-anchor-strip.json'
import coreTemplates from '../data/core-templates.json'

const PRESETS = [worldZone, multiSingle, multiCross, charAngle3x3, charAngle2x2, detailStrip]

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
    } catch { /* fallback */ }
  }

  function updatePanelRole(index, value) {
    setPanelRoles(prev => { const n = [...prev]; n[index] = value; return n })
  }

  return (
    <div className={styles.root}>
      <div className={styles.layout}>

        <div className={styles.config}>

          <div className={styles.block}>
            <p className="label-xs" style={{ marginBottom: 8 }}>{t('grid.operator_mode')}</p>
            <div className={styles.modeGrid}>
              {MODES.map(m => (
                <button
                  key={m.id}
                  className={`${styles.modeBtn} ${mode === m.id ? styles.modeBtnActive : ''}`}
                  onClick={() => setMode(m.id)}
                  title={m.desc}
                >
                  {m.star && <span className={styles.star}>★</span>}
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {mode === 'seengrid' && (
            <div className={styles.block}>
              <p className="label-xs" style={{ marginBottom: 10 }}>{t('grid.preset_label')}</p>
              <div className={styles.presetGrid}>
                {PRESETS.map(p => (
                  <button
                    key={p.id}
                    className={`${styles.presetCard} ${selectedPreset.id === p.id ? styles.presetCardActive : ''}`}
                    onClick={() => setPreset(p)}
                    title={p.desc}
                  >
                    <div className={styles.presetCardTop}>
                      <span className={styles.presetLabel}>{p.label}</span>
                      <span className={styles.presetBadge}>{p.rows}×{p.cols}</span>
                    </div>
                    <p className={styles.presetDesc}>{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'core' && (
            <div className={styles.block}>
              <p className="label-xs" style={{ marginBottom: 8 }}>{t('grid.core_template')}</p>
              <div className={styles.templateBtns}>
                {coreTemplates.map(tpl => (
                  <button
                    key={tpl.id}
                    className={`${styles.tplBtn} ${coreTemplate.id === tpl.id ? styles.tplBtnActive : ''}`}
                    onClick={() => setCoreTemplate(tpl)}
                    title={tpl.desc}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
              <p className={styles.tplDesc}>{coreTemplate.desc}</p>
            </div>
          )}

          <div className={styles.block}>
            <p className="label-xs" style={{ marginBottom: 8 }}>{t('grid.grid_size')}</p>
            {mode === 'seengrid' ? (
              <div className={styles.dimLocked}>
                <span className={styles.dimLockedBadge}>{rows}×{cols}</span>
                <span className={styles.dimLockedNote}>{t('grid.dim_locked')}</span>
              </div>
            ) : (
              <div className={styles.dimRow}>
                <div className={styles.dimGroup}>
                  <span className={styles.dimLabel}>Rows</span>
                  <div className={styles.dimBtns}>
                    {[1,2,3,4,5].map(n => (
                      <button
                        key={n}
                        className={`${styles.dimBtn} ${rows === n ? styles.dimBtnActive : ''}`}
                        onClick={() => setRows(n)}
                      >{n}</button>
                    ))}
                  </div>
                </div>
                <span className={styles.dimX}>×</span>
                <div className={styles.dimGroup}>
                  <span className={styles.dimLabel}>Cols</span>
                  <div className={styles.dimBtns}>
                    {[1,2,3,4,5].map(n => (
                      <button
                        key={n}
                        className={`${styles.dimBtn} ${cols === n ? styles.dimBtnActive : ''}`}
                        onClick={() => setCols(n)}
                      >{n}</button>
                    ))}
                  </div>
                </div>
                <span className={styles.totalPanels}>{totalPanels} {t('grid.panels')}</span>
              </div>
            )}
          </div>

          <div className={styles.block}>
            <p className="label-xs" style={{ marginBottom: 8 }}>{t('grid.layout')}</p>
            <div className={styles.layoutBtns}>
              {LAYOUTS.map(l => (
                <button
                  key={l.id}
                  className={`${styles.layoutBtn} ${layout === l.id ? styles.layoutBtnActive : ''}`}
                  onClick={() => setLayout(l.id)}
                  title={l.desc}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {mode === 'seengrid' && (
            <div className={styles.block}>
              <p className="label-xs" style={{ marginBottom: 8 }}>{t('grid.ref_images')}</p>
              <div className={styles.refNote}>
                <div className={styles.refNoteItem}>
                  <span className={styles.refTag}>A</span>
                  <span>{t('grid.ref_char')}</span>
                </div>
                <div className={styles.refNoteItem}>
                  <span className={styles.refTag}>B</span>
                  <span>{t('grid.ref_style')}</span>
                </div>
                <p className={styles.refNoteHint}>{t('grid.ref_hint')}</p>
              </div>
            </div>
          )}

          {mode !== 'custom' && (
            <div className={styles.block}>
              <p className="label-xs" style={{ marginBottom: 8 }}>
                {t('grid.style_override')}{' '}
                <span style={{ color: 'var(--t-2)', fontWeight: 400 }}>{t('common.optional')}</span>
              </p>
              <input
                type="text"
                className="field"
                value={coreStyle}
                onChange={e => setCoreStyle(e.target.value)}
                placeholder={
                  mode === 'seengrid'
                    ? t('grid.style_ph_sg')
                    : t('grid.style_ph_core')
                }
              />
            </div>
          )}

          {mode === 'core' && (
            <div className={styles.block}>
              <p className="label-xs" style={{ marginBottom: 8 }}>{t('grid.core_subject')}</p>
              <textarea
                className="field"
                rows={2}
                value={coreSubject}
                onChange={e => setCoreSubj(e.target.value)}
                placeholder={t('grid.core_subject_ph')}
              />
            </div>
          )}

          <div className={styles.block}>
            <p className="label-xs" style={{ marginBottom: 8 }}>{t('grid.panel_roles')}</p>
            <div
              className={styles.panelRoleGrid}
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
            >
              {panelRoles.slice(0, totalPanels).map((role, i) => (
                <input
                  key={i}
                  type="text"
                  className={`field ${styles.roleInput}`}
                  value={role}
                  onChange={e => updatePanelRole(i, e.target.value)}
                  title={`Panel ${i + 1}`}
                />
              ))}
            </div>
          </div>

        </div>

        <div className={styles.output}>
          <div className={styles.outputSticky}>

            <div className={styles.previewBlock}>
              <p className="label-xs" style={{ marginBottom: 10 }}>{t('grid.grid_preview')}</p>
              <GridPreview rows={rows} cols={cols} layout={layout} panelRoles={panelRoles} />
            </div>

            <div className={styles.outputBlock}>
              <div className={styles.outputHeader}>
                <span className="label-xs">
                  {mode === 'custom' ? t('grid.free_prompt') : t('grid.generated_prompt')}
                </span>
                {mode === 'seengrid' && (
                  <span className={styles.optimizedBadge}>★ SeenGrid Optimized</span>
                )}
                {mode === 'custom' && (
                  <span className={styles.customBadge}>{t('grid.no_template')}</span>
                )}
              </div>
              {mode === 'custom' ? (
                <textarea
                  className={`field ${styles.customTextarea}`}
                  value={customOutput}
                  onChange={e => setCustomOutput(e.target.value)}
                  placeholder={`${rows}×${cols} Grid — ${totalPanels} ${t('grid.panels')}. ${t('grid.custom_ph_suffix')}`}
                  spellCheck={false}
                />
              ) : (
                <div
                  className={`output-box has-content ${styles.promptOut}`}
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
              <button className={`btn btn-primary ${styles.copyBtn}`} onClick={handleCopy}>
                <CopyIcon />
                {copied ? t('common.copied') : t('grid.copy_btn')}
              </button>
            </div>

            {mode === 'seengrid' && (
              <div className={styles.infoBox}>
                <p className={styles.infoTitle}>{selectedPreset.label}</p>
                <p className={styles.infoDesc}>{selectedPreset.desc}</p>
                <p className={styles.infoSource}>Source: {selectedPreset.source}</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}

function GridPreview({ rows, cols, layout, panelRoles }) {
  const gap     = layout === 'seamless' ? 0 : layout === 'framed' ? 3 : 2
  const padding = layout === 'polaroid' ? 6 : 0
  const wrapBg  = layout === 'polaroid' ? '#f0ece4' : layout === 'framed' ? '#000' : 'var(--bg-2)'
  const panelBg = layout === 'storyboard'
    ? 'repeating-linear-gradient(45deg, var(--bg-3), var(--bg-3) 2px, var(--bg-4) 2px, var(--bg-4) 8px)'
    : 'var(--bg-3)'

  return (
    <div style={{ background: wrapBg, padding, borderRadius: 'var(--r-sm)', border: '1px solid var(--b-subtle)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>
        {Array.from({ length: rows * cols }, (_, i) => (
          <div key={i} style={{
            background: panelBg,
            border: layout === 'framed' ? 'none' : '1px solid var(--b-subtle)',
            padding: layout === 'polaroid' ? '0 0 18px 0' : 0,
            borderRadius: layout === 'polaroid' ? '1px' : '2px',
            aspectRatio: layout === 'letterbox' ? '16/9' : '1/1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontSize: 7,
              fontFamily: 'var(--font-mono)',
              color: layout === 'polaroid' ? '#777' : 'var(--t-2)',
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
  <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3z"/>
  </svg>
)
