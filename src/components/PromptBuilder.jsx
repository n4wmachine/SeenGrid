import React, { useState, useCallback } from 'react'
import styles from './PromptBuilder.module.css'
import { useLang } from '../context/LangContext.jsx'
import { useFavorites } from '../hooks/useFavorites.js'

import styleData     from '../data/styles.json'
import settingsData  from '../data/random/settings.json'
import subjectsData  from '../data/random/subjects.json'
import actionsData   from '../data/random/actions.json'
import moodsData     from '../data/random/moods.json'
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


function initState() {
  const state = { scene: '', negativeCustom: '', qualitySuffix: true }
  SECTIONS.forEach(s => {
    state[s.id] = s.mode === 'multi' ? new Set() : null
  })
  return state
}

export default function PromptBuilder() {
  const { t } = useLang()
  const [state, setState] = useState(initState)
  const [openSections, setOpenSections] = useState(
    () => new Set(['style', 'shotsize', 'cameraangle', 'camera', 'lens', 'focal', 'aperture', 'aspectratio', 'lighting', 'colorgrade'])
  )
  const [copied, setCopied] = useState(false)
  const { addFavorite } = useFavorites()
  const [savedFav, setSavedFav] = useState(false)

  function handleSaveFav() {
    if (!hasPrompt) return
    addFavorite({ id: 'pb-' + Date.now(), text: buildPrompt(), source: 'builder', imageUrls: [] })
    setSavedFav(true)
    setTimeout(() => setSavedFav(false), 2000)
  }

  // ── Toggle chip ──
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

  // ── Toggle accordion section ──
  const toggleSection = useCallback((id) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  // ── Build prompt string (NanoBanana Core rules) ──
  function buildPrompt() {
    const parts = []

    // Scene / subject (sensory stacking free text)
    if (state.scene) parts.push(state.scene)

    // Style (professional term, Rule 1)
    if (state.style) parts.push(`${state.style} cinematic style`)

    // Shot size + camera angle (grouped, Rule 5)
    const framing = []
    if (state.shotsize)    framing.push(state.shotsize)
    if (state.cameraangle) framing.push(`${state.cameraangle} angle`)
    if (framing.length)    parts.push(framing.join(', '))

    // Camera block (Rule 2: parameters not adjectives)
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

    // Lighting
    if (state.lighting.size > 0)
      parts.push([...state.lighting].join(' + ') + ' lighting')

    // Color grade
    if (state.colorgrade)
      parts.push(`${state.colorgrade} color grade`)

    // Film effects
    if (state.effects.size > 0)
      parts.push([...state.effects].join(', '))

    // Quality suffix (NanoBanana-style, not MJ anti-pattern territory)
    if (state.qualitySuffix && parts.length > 0)
      parts.push('ultra detailed, photorealistic, 8K cinema quality')

    return parts.join(', ')
  }

  // ── Build negative string ──
  function buildNegative() {
    const neg = [...state.negative]
    if (state.negativeCustom) {
      neg.push(...state.negativeCustom.split(',').map(s => s.trim()).filter(Boolean))
    }
    return neg.join(', ')
  }

  // ── Copy ──
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

  // ── Random ──
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
    const pick1 = arr => arr[Math.floor(Math.random() * arr.length)]
    const scene = `${pick1(settingsData)}. ${pick1(subjectsData)} ${pick1(actionsData)}. ${pick1(moodsData)}`
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

  // ── Reset ──
  function handleReset() {
    setState(initState())
  }

  const prompt    = buildPrompt()
  const negative  = buildNegative()
  const hasPrompt = prompt.length > 0

  return (
    <div className={styles.root}>
      {/* ── Two-column layout ── */}
      <div className={styles.layout}>

        {/* LEFT: Controls */}
        <div className={styles.controls}>

          {/* Scene input */}
          <div className={styles.sceneSection}>
            <div className={styles.sectionHeaderStatic}>
              <span className="label-xs">{t('builder.scene_label')}</span>
              <span className={styles.hint}>{t('builder.scene_hint')}</span>
            </div>
            <textarea
              className="field"
              rows={3}
              value={state.scene}
              onChange={e => setState(p => ({ ...p, scene: e.target.value }))}
              placeholder={t('builder.scene_placeholder')}
              spellCheck={false}
            />
          </div>

          {/* Chip sections */}
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

          {/* Negative custom input */}
          <div className={styles.negCustom}>
            <label className="label-xs" style={{ display: 'block', marginBottom: 6 }}>{t('builder.neg_custom_label')}</label>
            <input
              type="text"
              className="field"
              value={state.negativeCustom}
              onChange={e => setState(p => ({ ...p, negativeCustom: e.target.value }))}
              placeholder={t('builder.neg_custom_placeholder')}
            />
          </div>
        </div>

        {/* RIGHT: Output */}
        <div className={styles.outputPanel}>
          <div className={styles.outputSticky}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <button className="btn btn-ghost btn-sm" onClick={handleRandom} title={t('builder.random_title')}>
                <DiceIcon /> {t('common.random')}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleReset} title={t('builder.reset_title')}>
                <ResetIcon /> {t('common.reset')}
              </button>
              <label className={styles.qualityToggle} title={t('builder.quality_title')}>
                <input
                  type="checkbox"
                  checked={state.qualitySuffix}
                  onChange={e => setState(p => ({ ...p, qualitySuffix: e.target.checked }))}
                />
                <span className={`${styles.qualDot} ${state.qualitySuffix ? styles.qualDotOn : ''}`} />
                <span>{t('builder.quality_label')}</span>
              </label>
            </div>

            {/* Prompt output */}
            <div className={styles.outputBlock}>
              <div className={styles.outputLabel}>
                <span className="label-xs">{t('builder.generated_prompt')}</span>
                <span className={styles.charCount}>{prompt.length} {t('builder.char_count')}</span>
              </div>
              <div className={`output-box ${hasPrompt ? 'has-content' : ''} ${styles.promptBox}`}>
                {hasPrompt
                  ? <HighlightedPrompt state={state} apertureData={apertureData} />
                  : <span className={styles.placeholder}>{t('builder.prompt_placeholder')}</span>
                }
              </div>
              <button
                className={`btn btn-primary ${styles.copyBtn}`}
                disabled={!hasPrompt}
                onClick={handleCopy}
              >
                <CopyIcon />
                {copied ? t('common.copied') : t('builder.copy_btn')}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', marginTop: 6 }}
                disabled={!hasPrompt}
                onClick={handleSaveFav}
              >
                <StarIcon filled={savedFav} />
                {savedFav ? t('fav.saved') : t('fav.save')}
              </button>
            </div>

            {/* Negative prompt output */}
            {negative && (
              <div className={styles.outputBlock}>
                <div className={styles.outputLabel}>
                  <span className="label-xs" style={{ color: 'var(--t-2)' }}>{t('builder.neg_prompt_label')}</span>
                </div>
                <div className={`output-box ${styles.negBox}`}>{negative}</div>
              </div>
            )}

            {/* NanoBanana rules reminder */}
            <div className={styles.rulesCard}>
              <p className={styles.rulesTitle}>{t('builder.rules_title')}</p>
              <ol className={styles.rulesList}>
                <li>{t('builder.rule1')}</li>
                <li>{t('builder.rule2')}</li>
                <li>{t('builder.rule3')}</li>
                <li>{t('builder.rule4')}</li>
                <li>{t('builder.rule5')}</li>
                <li>{t('builder.rule6')}</li>
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
  const activeCount = mode === 'multi'
    ? state[id].size
    : state[id] ? 1 : 0

  return (
    <div className={styles.section}>
      <button
        className={styles.sectionHeader}
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span className={styles.sectionTitle}>
          <span
            className={styles.sectionBar}
            style={{ background: dot }}
          />
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
const StarIcon  = ({ filled = false }) => (
  <svg width="13" height="13" viewBox="0 0 16 16"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth={filled ? 0 : 1.4}
  >
    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
  </svg>
)
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
