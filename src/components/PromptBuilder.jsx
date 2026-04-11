import React, { useState, useCallback } from 'react'
import styles from './PromptBuilder.module.css'

import styleData     from '../data/styles.json'
import cameraData    from '../data/cameras.json'
import lensData      from '../data/lenses.json'
import focalData     from '../data/focal.json'
import apertureData  from '../data/aperture.json'
import shotData      from '../data/shotsize.json'
import angleData     from '../data/cameraangle.json'
import lightingData  from '../data/lighting.json'
import colorData     from '../data/colorgrade.json'
import effectsData   from '../data/effects.json'
import negativeData  from '../data/negative.json'
import aspectData    from '../data/aspectratio.json'

// ── NanoBanana Core optimization rules (from system-prompt-en.md) ──
// Rule 1: Replace feeling words with professional terms (covered by chip vocabulary)
// Rule 2: Replace adjectives with parameters (covered by aperture + focal chips)
// Rule 3: Add negative constraints (negative chip group)
// Rule 4: Sensory stacking (scene textarea free text)
// Rule 5: Group & cluster (section structure)
// Rule 6: Format adaptation (single assembled string)

const SECTIONS = [
  { id: 'style',       label: 'Film Style',      dot: '#e8a624', mode: 'single',  data: styleData },
  { id: 'shotsize',    label: 'Shot Size',        dot: '#7088a8', mode: 'single',  data: shotData },
  { id: 'cameraangle', label: 'Camera Angle',     dot: '#7088a8', mode: 'single',  data: angleData },
  { id: 'camera',      label: 'Camera System',    dot: '#5c9fc4', mode: 'single',  data: cameraData },
  { id: 'lens',        label: 'Lens / Optic',     dot: '#5c9fc4', mode: 'single',  data: lensData },
  { id: 'focal',       label: 'Focal Length',     dot: '#5c9fc4', mode: 'single',  data: focalData },
  { id: 'aperture',    label: 'Aperture / DOF',   dot: '#5c9fc4', mode: 'single',  data: apertureData },
  { id: 'aspectratio', label: 'Aspect Ratio',     dot: '#5c9fc4', mode: 'single',  data: aspectData },
  { id: 'lighting',    label: 'Lighting',         dot: '#c9a040', mode: 'multi',   data: lightingData },
  { id: 'colorgrade',  label: 'Color Grade',      dot: '#a07838', mode: 'single',  data: colorData },
  { id: 'effects',     label: 'Film Effects',     dot: '#9e6050', mode: 'multi',   data: effectsData },
  { id: 'negative',    label: 'Negative Prompt',  dot: '#52525e', mode: 'multi',   data: negativeData },
]

const RANDOM_SCENES = [
  'A detective stands in a rain-soaked alley, collar raised',
  'An old woman looks out through a frosted window at dusk',
  'Two figures face each other across a bare concrete room',
  'A child walks alone down a deserted suburban street at noon',
  'A man in a suit sits at the edge of a crumbling pier',
  'A figure disappears into fog at the end of a long corridor',
  'Hands grip the edge of a car door in a dark parking garage',
  'A woman reads a letter by the light of a single desk lamp',
  'An empty chair at a table set for two, candle burning low',
  'A figure silhouetted against the glow of a burning building',
]

function initState() {
  const state = { scene: '', negativeCustom: '', qualitySuffix: true }
  SECTIONS.forEach(s => {
    state[s.id] = s.mode === 'multi' ? new Set() : null
  })
  return state
}

export default function PromptBuilder() {
  const [state, setState] = useState(initState)
  const [openSections, setOpenSections] = useState(
    () => new Set(['style', 'shotsize', 'cameraangle', 'camera', 'lens', 'focal', 'aperture', 'aspectratio', 'lighting', 'colorgrade'])
  )
  const [copied, setCopied] = useState(false)

  const toggleChip = useCallback((sectionId, value, mode) => {
    setState(prev => {
      const next = { ...prev }
      if (mode === 'multi') {
        const set = new Set(prev[sectionId])
        set.has(value) ? set.delete(value) : set.add(value)
        next[sectionId] = set
      } else {
        next[sectionId] = prev[sectionId] === value ? null : value
      }
      return next
    })
  }, [])

  const toggleSection = useCallback((id) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  function buildPrompt() {
    const parts = []
    if (state.scene) parts.push(state.scene)
    if (state.style) parts.push(`${state.style} cinematic style`)
    const framing = []
    if (state.shotsize)    framing.push(state.shotsize)
    if (state.cameraangle) framing.push(`${state.cameraangle} angle`)
    if (framing.length)    parts.push(framing.join(', '))
    const cam = []
    if (state.camera)  cam.push(`shot on ${state.camera}`)
    if (state.lens)    cam.push(`${state.lens} lens`)
    if (state.focal)   cam.push(`${state.focal} focal length`)
    if (state.aperture) {
      const item = apertureData.find(a => a.v === state.aperture)
      const dof = item ? `, ${item.dof} depth of field` : ''
      cam.push(`${state.aperture} aperture${dof}`)
    }
    if (state.aspectratio) cam.push(`${state.aspectratio} aspect ratio`)
    if (cam.length) parts.push(cam.join(', '))
    if (state.lighting.size > 0)
      parts.push([...state.lighting].join(' + ') + ' lighting')
    if (state.colorgrade)
      parts.push(`${state.colorgrade} color grade`)
    if (state.effects.size > 0)
      parts.push([...state.effects].join(', '))
    if (state.qualitySuffix && parts.length > 0)
      parts.push('ultra detailed, photorealistic, 8K cinema quality')
    return parts.join(', ')
  }

  function buildNegative() {
    const neg = [...state.negative]
    if (state.negativeCustom) {
      neg.push(...state.negativeCustom.split(',').map(s => s.trim()).filter(Boolean))
    }
    return neg.join(', ')
  }

  async function handleCopy() {
    const prompt = buildPrompt()
    if (!prompt) return
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = prompt; ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta); ta.select(); document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleRandom() {
    const pick = (arr, nullable = true) => {
      if (nullable && Math.random() < 0.15) return null
      return arr[Math.floor(Math.random() * arr.length)].v
    }
    const pickMulti = (arr, max = 2) => {
      const shuffled = [...arr].sort(() => Math.random() - 0.5)
      const count = Math.floor(Math.random() * (max + 1))
      return new Set(shuffled.slice(0, count).map(i => i.v))
    }
    const scene = RANDOM_SCENES[Math.floor(Math.random() * RANDOM_SCENES.length)]
    setState(prev => ({
      ...prev,
      scene,
      style:       pick(styleData, false),
      camera:      pick(cameraData),
      lens:        pick(lensData),
      focal:       pick(focalData),
      aperture:    pick(apertureData),
      aspectratio: pick(aspectData),
      shotsize:    pick(shotData),
      cameraangle: pick(angleData),
      colorgrade:  pick(colorData),
      lighting:    pickMulti(lightingData, 2),
      effects:     pickMulti(effectsData, 2),
      negative:    new Set(),
    }))
  }

  function handleReset() { setState(initState()) }

  const prompt    = buildPrompt()
  const negative  = buildNegative()
  const hasPrompt = prompt.length > 0

  return (
    <div className={styles.root}>
      <div className={styles.layout}>

        {/* LEFT: Controls */}
        <div className={styles.controls}>
          <div className={styles.sceneSection}>
            <div className={styles.sectionHeaderStatic}>
              <span className="label-xs">Szene / Motiv</span>
              <span className={styles.hint}>Freitext — Sensory Stacking</span>
            </div>
            <textarea
              className="field"
              rows={3}
              value={state.scene}
              onChange={e => setState(p => ({ ...p, scene: e.target.value }))}
              placeholder="Beschreibe deine Szene… z.B. 'A detective stands in a rain-soaked alley, collar raised, breath visible in cold air'"
              spellCheck={false}
            />
          </div>

          {SECTIONS.map(sec => (
            <ChipSection
              key={sec.id}
              section={sec}
              state={state}
              isOpen={openSections.has(sec.id)}
              onToggle={() => toggleSection(sec.id)}
              onToggleChip={toggleChip}
            />
          ))}

          <div className={styles.negCustom}>
            <label className="label-xs" style={{ display: 'block', marginBottom: 6 }}>Eigene Negativ-Begriffe</label>
            <input
              type="text"
              className="field"
              value={state.negativeCustom}
              onChange={e => setState(p => ({ ...p, negativeCustom: e.target.value }))}
              placeholder="Komma-getrennt: e.g. text, logo, extra limbs"
            />
          </div>
        </div>

        {/* RIGHT: Output */}
        <div className={styles.outputPanel}>
          <div className={styles.outputSticky}>
            <div className={styles.toolbar}>
              <button className="btn btn-ghost btn-sm" onClick={handleRandom} title="Zufällige Inspiration generieren">
                <DiceIcon /> Random
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleReset} title="Alle Auswahlen zurücksetzen">
                <ResetIcon /> Reset
              </button>
              <label className={styles.qualityToggle} title="8K Quality Suffix an/aus">
                <input
                  type="checkbox"
                  checked={state.qualitySuffix}
                  onChange={e => setState(p => ({ ...p, qualitySuffix: e.target.checked }))}
                />
                <span className={`${styles.qualDot} ${state.qualitySuffix ? styles.qualDotOn : ''}`} />
                <span>8K Suffix</span>
              </label>
            </div>

            <div className={styles.outputBlock}>
              <div className={styles.outputLabel}>
                <span className="label-xs">Generierter Prompt</span>
                <span className={styles.charCount}>{prompt.length} Zeichen</span>
              </div>
              <div className={`output-box ${hasPrompt ? 'has-content' : ''} ${styles.promptBox}`}>
                {hasPrompt
                  ? <HighlightedPrompt state={state} apertureData={apertureData} />
                  : <span className={styles.placeholder}>Wähle Optionen links um deinen Prompt zu bauen…</span>
                }
              </div>
              <button
                className={`btn btn-primary ${styles.copyBtn}`}
                disabled={!hasPrompt}
                onClick={handleCopy}
              >
                <CopyIcon />
                {copied ? '✓ Kopiert!' : 'In Zwischenablage kopieren'}
              </button>
            </div>

            {negative && (
              <div className={styles.outputBlock}>
                <div className={styles.outputLabel}>
                  <span className="label-xs" style={{ color: 'var(--t-2)' }}>Negativ Prompt</span>
                </div>
                <div className={`output-box ${styles.negBox}`}>{negative}</div>
              </div>
            )}

            <div className={styles.rulesCard}>
              <p className={styles.rulesTitle}>NanoBanana Core Regeln</p>
              <ol className={styles.rulesList}>
                <li>Feeling Words → Professional Terms</li>
                <li>Adjektive → Parameter (Focal, Aperture)</li>
                <li>Negative Constraints hinzufügen</li>
                <li>Sensory Stacking im Szenentext</li>
                <li>Group &amp; Cluster (Sektionen)</li>
                <li>Format Adaptation für NanoBanana</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Chip Section (accordion) ──
function ChipSection({ section, state, isOpen, onToggle, onToggleChip }) {
  const { id, label, dot, mode, data } = section
  const activeCount = mode === 'multi' ? state[id].size : state[id] ? 1 : 0

  return (
    <div className={styles.section}>
      <button
        className={styles.sectionHeader}
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span className={styles.sectionTitle}>
          <span className={styles.sectionBar} style={{ background: dot }} />
          {label}
          {activeCount > 0 && (
            <span className={styles.activeBadge}>{activeCount}</span>
          )}
        </span>
        <ChevronIcon isOpen={isOpen} />
      </button>
      {isOpen && (
        <div className={styles.sectionBody}>
          <div className={styles.chipGrid}>
            {data.map(item => (
              <button
                key={item.v}
                className={`chip ${
                  mode === 'multi'
                    ? state[id].has(item.v) ? 'active' : ''
                    : state[id] === item.v  ? 'active' : ''
                }`}
                title={item.t}
                onClick={() => onToggleChip(id, item.v, mode)}
              >
                {item.v}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Highlighted prompt parts ──
function HighlightedPrompt({ state, apertureData }) {
  const parts = []
  if (state.scene)      parts.push({ cls: 'scene',    text: state.scene })
  if (state.style)      parts.push({ cls: 'style',    text: `${state.style} cinematic style` })
  const framing = []
  if (state.shotsize)    framing.push(state.shotsize)
  if (state.cameraangle) framing.push(`${state.cameraangle} angle`)
  if (framing.length)    parts.push({ cls: 'shot', text: framing.join(', ') })
  const cam = []
  if (state.camera)  cam.push(`shot on ${state.camera}`)
  if (state.lens)    cam.push(`${state.lens} lens`)
  if (state.focal)   cam.push(`${state.focal} focal length`)
  if (state.aperture) {
    const item = apertureData.find(a => a.v === state.aperture)
    const dof = item ? `, ${item.dof} depth of field` : ''
    cam.push(`${state.aperture} aperture${dof}`)
  }
  if (state.aspectratio) cam.push(`${state.aspectratio} aspect ratio`)
  if (cam.length) parts.push({ cls: 'camera', text: cam.join(', ') })
  if (state.lighting.size > 0)
    parts.push({ cls: 'lighting', text: [...state.lighting].join(' + ') + ' lighting' })
  if (state.colorgrade)
    parts.push({ cls: 'color', text: `${state.colorgrade} color grade` })
  if (state.effects.size > 0)
    parts.push({ cls: 'effects', text: [...state.effects].join(', ') })
  if (state.qualitySuffix && parts.length > 0)
    parts.push({ cls: 'quality', text: 'ultra detailed, photorealistic, 8K cinema quality' })

  return (
    <p style={{ margin: 0, lineHeight: 1.9 }}>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          <span className={styles[`p_${p.cls}`]}>{p.text}</span>
          {i < parts.length - 1 && <span style={{ color: 'var(--t-2)' }}>, </span>}
        </React.Fragment>
      ))}
    </p>
  )
}

// ── Icons ──
const CopyIcon  = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3z"/></svg>
const DiceIcon  = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zm0 1H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm4-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>
const ResetIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg>
const ChevronIcon = ({ isOpen }) => (
  <svg
    width="11" height="11" viewBox="0 0 16 16" fill="currentColor"
    style={{ transform: isOpen ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform 0.2s', color: 'var(--t-2)', flexShrink: 0 }}
  >
    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
  </svg>
)
