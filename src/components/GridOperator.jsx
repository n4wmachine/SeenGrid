import React, { useState, useEffect, useCallback } from 'react'
import styles from './GridOperator.module.css'

// ── Preset imports ──
import worldZone     from '../data/presets/world-zone-board-3x3.json'
import multiSingle   from '../data/presets/multishot-3x3-single-zone.json'
import multiCross    from '../data/presets/multishot-3x3-cross-zone.json'
import charAngle3x3  from '../data/presets/character-angle-3x3.json'
import charAngle2x2  from '../data/presets/character-angle-study-2x2.json'
import detailStrip   from '../data/presets/detail-anchor-strip.json'

const PRESETS = [
  worldZone,
  multiSingle,
  multiCross,
  charAngle3x3,
  charAngle2x2,
  detailStrip,
]

const LAYOUTS = [
  { id: 'even',       label: 'Even',       desc: 'Gleichmäßige Panels' },
  { id: 'letterbox',  label: 'Letterbox',  desc: '16:9 Breitbild-Panels' },
  { id: 'seamless',   label: 'Seamless',   desc: 'Kein Separator, nahtlos' },
  { id: 'framed',     label: 'Framed',     desc: 'Schwarze Rahmen' },
  { id: 'storyboard', label: 'Storyboard', desc: 'Skizzenhafter Storyboard-Look' },
  { id: 'polaroid',   label: 'Polaroid',   desc: 'Weiße Ränder, Retro-Feel' },
]

const MODES = [
  { id: 'seengrid',  label: 'SeenGrid Optimized', star: true,  desc: 'Exakte Templates aus DeepSeek1.txt — paste-ready' },
  { id: 'core',      label: 'Core',               star: false, desc: 'Freier Grid mit NanoBanana-Optimierung' },
]

const BADGE_COLORS = {
  'SeenGrid Optimized': { bg: 'rgba(245,166,35,0.12)', border: 'rgba(245,166,35,0.40)', color: '#f5a623' },
  'Core':               { bg: 'rgba(96,165,250,0.10)', border: 'rgba(96,165,250,0.30)', color: '#60a5fa' },
}

export default function GridOperator() {
  const [mode, setMode]             = useState('seengrid')
  const [rows, setRows]             = useState(3)
  const [cols, setCols]             = useState(3)
  const [layout, setLayout]         = useState('even')
  const [selectedPreset, setPreset] = useState(PRESETS[0])
  const [panelRoles, setPanelRoles] = useState(buildRoles(PRESETS[0]))
  const [inputValues, setInputs]    = useState(buildInputs(PRESETS[0]))
  const [coreSubject, setCoreSubj]  = useState('')
  const [coreStyle, setCoreStyle]   = useState('')
  const [copied, setCopied]         = useState(false)

  // Sync when preset changes
  useEffect(() => {
    setRows(selectedPreset.rows)
    setCols(selectedPreset.cols)
    setLayout(selectedPreset.layout?.toLowerCase() || 'even')
    setPanelRoles(buildRoles(selectedPreset))
    setInputs(buildInputs(selectedPreset))
  }, [selectedPreset])

  function buildRoles(preset) {
    const total = preset.rows * preset.cols
    const roles = preset.panelRoles || []
    return Array.from({ length: total }, (_, i) => roles[i] || `Panel ${i + 1}`)
  }

  function buildInputs(preset) {
    const fields = preset.inputFields || []
    const obj = {}
    fields.forEach(f => { obj[f.id] = '' })
    return obj
  }

  // ── Build paste-ready prompt ──
  function buildOutput() {
    const totalPanels = rows * cols

    if (mode === 'seengrid') {
      // Start with the exact preset prompt template
      let prompt = selectedPreset.prompt

      // Inject input field values if provided
      const fields = selectedPreset.inputFields || []
      fields.forEach(field => {
        const val = inputValues[field.id]
        if (val && val.trim()) {
          // Replace placeholder-style references in the prompt
          // The prompts use generic "reference image or location description"
          // We append input values as a preamble
        }
      })

      // Build the input preamble
      const preamble = fields
        .filter(f => inputValues[f.id]?.trim())
        .map(f => `${f.label}: ${inputValues[f.id].trim()}`)
        .join('\n')

      // Layout annotation
      const layoutNote = `LAYOUT: ${rows}x${cols} grid. ${getLayoutDesc(layout)}`

      // Style suffix
      const styleSuffix = coreStyle ? `\n\nSTYLE: Apply ${coreStyle}.` : ''

      const parts = []
      if (preamble) parts.push(preamble)
      parts.push(prompt)
      parts.push(layoutNote)
      if (styleSuffix) parts.push(styleSuffix)

      return parts.join('\n\n')
    }

    // CORE mode: NanoBanana-optimized generic grid
    const panelLines = panelRoles
      .slice(0, totalPanels)
      .map((role, i) => `Panel ${i + 1} [${role}]: ${coreSubject ? `${coreSubject} — ` : ''}[describe this panel]`)
      .join('\n')

    return [
      coreSubject ? `SUBJECT: ${coreSubject}` : '',
      coreStyle   ? `STYLE: ${coreStyle}` : '',
      '',
      `${rows}x${cols} Grid — ${getLayoutDesc(layout)}`,
      '',
      panelLines,
      '',
      'QUALITY ANCHOR: Premium cinematic rendering, rich material detail, atmospheric depth.',
      'FORBIDDEN: No quality downgrade. No disconnected panels.',
    ].filter(l => l !== undefined).join('\n')
  }

  function getLayoutDesc(l) {
    const layout = LAYOUTS.find(x => x.id === l)
    return layout ? `${layout.label}. ${layout.desc}.` : ''
  }

  const output = buildOutput()
  const totalPanels = rows * cols

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch { /* fallback */ }
  }

  function updatePanelRole(index, value) {
    setPanelRoles(prev => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  // Sync panel roles array size when rows/cols change
  useEffect(() => {
    const total = rows * cols
    setPanelRoles(prev => {
      if (prev.length === total) return prev
      if (prev.length < total) {
        return [...prev, ...Array.from({ length: total - prev.length }, (_, i) => `Panel ${prev.length + i + 1}`)]
      }
      return prev.slice(0, total)
    })
  }, [rows, cols])

  return (
    <div className={styles.root}>
      <div className={styles.layout}>

        {/* ── LEFT: Configuration panel ── */}
        <div className={styles.config}>

          {/* Mode toggle */}
          <div className={styles.block}>
            <p className="label-xs" style={{ marginBottom: 8 }}>Operator Mode</p>
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

          {/* Preset selector (SeenGrid Optimized only) */}
          {mode === 'seengrid' && (
            <div className={styles.block}>
              <p className="label-xs" style={{ marginBottom: 10 }}>Preset</p>
              <div className={styles.presetGrid}>
                {PRESETS.map(p => {
                  const bc = BADGE_COLORS[p.badge] || BADGE_COLORS['Core']
                  return (
                    <button
                      key={p.id}
                      className={`${styles.presetCard} ${selectedPreset.id === p.id ? styles.presetCardActive : ''}`}
                      onClick={() => setPreset(p)}
                      title={p.desc}
                    >
                      <div className={styles.presetCardTop}>
                        <span className={styles.presetLabel}>{p.label}</span>
                        <span
                          className={styles.presetBadge}
                          style={{ background: bc.bg, borderColor: bc.border, color: bc.color }}
                        >
                          {p.rows}x{p.cols}
                        </span>
                      </div>
                      <p className={styles.presetDesc}>{p.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Grid dimensions (Core mode: fully free; SeenGrid: pre-set but adjustable) */}
          <div className={styles.block}>
            <p className="label-xs" style={{ marginBottom: 8 }}>Grid Größe</p>
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
              <span className={styles.totalPanels}>{totalPanels} Panels</span>
            </div>
          </div>

          {/* Layout options */}
          <div className={styles.block}>
            <p className="label-xs" style={{ marginBottom: 8 }}>Layout</p>
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

          {/* Input fields (SeenGrid Optimized) */}
          {mode === 'seengrid' && selectedPreset.inputFields?.length > 0 && (
            <div className={styles.block}>
              <p className="label-xs" style={{ marginBottom: 10 }}>Eingaben</p>
              {selectedPreset.inputFields.map(field => (
                <div key={field.id} className={styles.inputField}>
                  <label className={styles.fieldLabel}>
                    {field.label}
                    {field.required && <span className={styles.reqDot}> *</span>}
                  </label>
                  <textarea
                    className="field"
                    rows={2}
                    value={inputValues[field.id] || ''}
                    onChange={e => setInputs(p => ({ ...p, [field.id]: e.target.value }))}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Core mode inputs */}
          {mode === 'core' && (
            <div className={styles.block}>
              <p className="label-xs" style={{ marginBottom: 10 }}>Core Input</p>
              <div className={styles.inputField}>
                <label className={styles.fieldLabel}>Subjekt / Szene</label>
                <textarea
                  className="field"
                  rows={2}
                  value={coreSubject}
                  onChange={e => setCoreSubj(e.target.value)}
                  placeholder="z.B. 'abandoned Soviet factory, winter, blue dusk'"
                />
              </div>
              <div className={styles.inputField}>
                <label className={styles.fieldLabel}>Style</label>
                <input
                  type="text"
                  className="field"
                  value={coreStyle}
                  onChange={e => setCoreStyle(e.target.value)}
                  placeholder="z.B. Neo-Noir Cinematic Style"
                />
              </div>
            </div>
          )}

          {/* Style override (SeenGrid mode) */}
          {mode === 'seengrid' && (
            <div className={styles.block}>
              <p className="label-xs" style={{ marginBottom: 8 }}>Style Override (optional)</p>
              <input
                type="text"
                className="field"
                value={coreStyle}
                onChange={e => setCoreStyle(e.target.value)}
                placeholder="z.B. Neo-Noir Cinematic Style / Apply Style Asset from OpenArt"
              />
            </div>
          )}

          {/* Panel roles editor */}
          <div className={styles.block}>
            <p className="label-xs" style={{ marginBottom: 8 }}>Panel-Rollen bearbeiten</p>
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

        {/* ── RIGHT: Preview + Output ── */}
        <div className={styles.output}>
          <div className={styles.outputSticky}>

            {/* Grid preview */}
            <div className={styles.previewBlock}>
              <p className="label-xs" style={{ marginBottom: 10 }}>Grid Preview</p>
              <GridPreview
                rows={rows}
                cols={cols}
                layout={layout}
                panelRoles={panelRoles}
                preset={mode === 'seengrid' ? selectedPreset : null}
              />
            </div>

            {/* Prompt output */}
            <div className={styles.outputBlock}>
              <div className={styles.outputHeader}>
                <span className="label-xs">Generierter Prompt</span>
                {mode === 'seengrid' && (
                  <span className={styles.optimizedBadge}>★ SeenGrid Optimized</span>
                )}
              </div>
              <div
                className={`output-box has-content ${styles.promptOut}`}
                title="Click to select all"
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
              <button
                className={`btn btn-primary ${styles.copyBtn}`}
                onClick={handleCopy}
              >
                <CopyIcon />
                {copied ? '✓ Kopiert!' : 'Paste-Ready Prompt kopieren'}
              </button>
            </div>

            {/* SeenGrid Optimized info box */}
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

// ── Grid Preview ──
function GridPreview({ rows, cols, layout, panelRoles, preset }) {
  const gap = layout === 'seamless' ? 0 : layout === 'framed' ? 3 : 2
  const padding = layout === 'polaroid' ? 6 : layout === 'framed' ? 3 : 0
  const bg = layout === 'polaroid' ? '#f0ece4'
    : layout === 'framed' ? '#000'
    : 'var(--bg-2)'

  const panelBg = layout === 'storyboard'
    ? 'repeating-linear-gradient(45deg, var(--bg-3), var(--bg-3) 2px, var(--bg-4) 2px, var(--bg-4) 8px)'
    : 'var(--bg-3)'

  const panels = Array.from({ length: rows * cols }, (_, i) => i)

  const panelStyle = {
    background: panelBg,
    border: layout === 'framed' ? 'none' : '1px solid var(--b-subtle)',
    padding: layout === 'polaroid' ? '0 0 20px 0' : 0,
    borderRadius: layout === 'polaroid' ? '1px' : 'var(--r-xs)',
    aspectRatio: layout === 'letterbox' ? '16/9' : '1/1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 2,
    overflow: 'hidden',
  }

  return (
    <div style={{
      background: bg,
      padding,
      borderRadius: 'var(--r-sm)',
      border: '1px solid var(--b-subtle)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap,
      }}>
        {panels.map(i => (
          <div key={i} style={panelStyle}>
            <span style={{
              fontSize: 8,
              fontFamily: 'var(--font-mono)',
              color: layout === 'polaroid' ? '#666' : 'var(--t-2)',
              letterSpacing: '0.3px',
              textAlign: 'center',
              padding: '0 4px',
              lineHeight: 1.3,
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
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3z"/>
  </svg>
)
