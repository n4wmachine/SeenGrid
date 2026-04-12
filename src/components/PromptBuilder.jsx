import React, { useState, useCallback, useEffect, useRef } from 'react'
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

const SECTIONS = [
  { id: 'style',       label: 'Film Style',      mode: 'single',  data: styleData },
  { id: 'shotsize',    label: 'Shot Size',        mode: 'single',  data: shotData },
  { id: 'cameraangle', label: 'Camera Angle',     mode: 'single',  data: angleData },
  { id: 'camera',      label: 'Camera System',    mode: 'single',  data: cameraData },
  { id: 'lens',        label: 'Lens / Optic',     mode: 'single',  data: lensData },
  { id: 'focal',       label: 'Focal Length',     mode: 'single',  data: focalData },
  { id: 'aperture',    label: 'Aperture / DOF',   mode: 'single',  data: apertureData },
  { id: 'aspectratio', label: 'Aspect Ratio',     mode: 'single',  data: aspectData },
  { id: 'lighting',    label: 'Lighting',         mode: 'multi',   data: lightingData },
  { id: 'colorgrade',  label: 'Color Grade',      mode: 'single',  data: colorData },
  { id: 'effects',     label: 'Film Effects',     mode: 'multi',   data: effectsData },
  { id: 'negative',    label: 'Negative Prompt',  mode: 'multi',   data: negativeData },
]

function initState() {
  const state = { scene: '', negativeCustom: '', qualitySuffix: true }
  SECTIONS.forEach(s => {
    state[s.id] = s.mode === 'multi' ? new Set() : null
  })
  return state
}

export default function PromptBuilder() {
  const { t, tData } = useLang()
  const [state, setState] = useState(initState)
  const [openSections, setOpenSections] = useState(
    () => new Set(['style', 'shotsize', 'lighting'])
  )
  const [copied, setCopied] = useState(false)
  const { addFavorite } = useFavorites()
  const [savedFav, setSavedFav] = useState(false)
  const [rulesOpen, setRulesOpen] = useState(false)
  const containerRef = useRef(null)

  function handleSaveFav() {
    if (!hasPrompt) return
    addFavorite({ id: 'pb-' + Date.now(), text: buildPrompt(), source: 'builder', imageUrls: [] })
    setSavedFav(true)
    setTimeout(() => setSavedFav(false), 2000)
  }

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

  function handleReset() {
    setState(initState())
  }

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e) {
      // Cmd/Ctrl+Shift+C = copy prompt
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        handleCopy()
      }
      // Cmd/Ctrl+Shift+R = random
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'G') {
        e.preventDefault()
        handleRandom()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const prompt    = buildPrompt()
  const negative  = buildNegative()
  const hasPrompt = prompt.length > 0

  const RULES = [
    t('builder.rule1'),
    t('builder.rule2'),
    t('builder.rule3'),
    t('builder.rule4'),
    t('builder.rule5'),
    t('builder.rule6'),
  ]

  // Helper: get active selection labels for a section
  function getActiveLabels(sec) {
    if (sec.mode === 'multi') {
      const active = state[sec.id]
      if (!active || active.size === 0) return []
      return [...active]
    } else {
      return state[sec.id] ? [state[sec.id]] : []
    }
  }

  return (
    <div className={styles.container} ref={containerRef}>

      {/* LINKE SPALTE */}
      <div className={styles.leftColumn}>

        {/* Szene / Motiv Textfeld */}
        <div className={styles.sceneInput}>
          <div className={styles.sceneInputLabel}>
            <span>{t('builder.scene_label')}</span>
            <span className={styles.sceneInputHint}>{t('builder.scene_hint')}</span>
          </div>
          <textarea
            className={styles.sceneTextarea}
            rows={3}
            value={state.scene}
            onChange={e => setState(p => ({ ...p, scene: e.target.value }))}
            placeholder={t('builder.scene_placeholder')}
            spellCheck={false}
          />
        </div>

        {/* Chip Sections */}
        <div className={styles.sectionsWrapper}>
          {SECTIONS.map(sec => (
            <ChipSection
              key={sec.id}
              section={sec}
              state={state}
              isOpen={openSections.has(sec.id)}
              onToggle={() => toggleSection(sec.id)}
              onToggleChip={toggleChip}
              activeLabels={getActiveLabels(sec)}
              tData={tData}
              styles={styles}
            />
          ))}
        </div>

        {/* Negative custom input */}
        <div>
          <label className={styles.sceneInputLabel} style={{ marginBottom: 6 }}>
            {t('builder.neg_custom_label')}
          </label>
          <input
            type="text"
            className={styles.sceneTextarea}
            style={{ minHeight: 'auto', resize: 'none' }}
            value={state.negativeCustom}
            onChange={e => setState(p => ({ ...p, negativeCustom: e.target.value }))}
            placeholder={t('builder.neg_custom_placeholder')}
          />
        </div>
      </div>

      {/* RECHTE SPALTE — Sticky Output */}
      <div className={styles.rightColumn}>

        <div className={styles.outputControls}>
          <button className={styles.ghostBtn} onClick={handleRandom} title={`${t('builder.random_title')} (⌘⇧R)`}>
            <DiceIcon /> {t('common.random')}
          </button>
          <button className={styles.ghostBtn} onClick={handleReset} title={t('builder.reset_title')}>
            <ResetIcon /> {t('common.reset')}
          </button>
          <button
            className={[styles.suffixToggle, state.qualitySuffix && styles.active].filter(Boolean).join(' ')}
            onClick={() => setState(p => ({ ...p, qualitySuffix: !p.qualitySuffix }))}
            title={t('builder.quality_title')}
          >
            ● {t('builder.quality_label')}
          </button>
        </div>

        <div className={styles.outputLabel}>
          <span>{t('builder.generated_prompt')}</span>
          <span className={styles.charCount}>{prompt.length} {t('builder.char_count')}</span>
        </div>

        <div className={[styles.outputBox, hasPrompt ? styles.filled : styles.empty].filter(Boolean).join(' ')}>
          {hasPrompt
            ? <HighlightedPrompt state={state} apertureData={apertureData} />
            : t('builder.prompt_placeholder')
          }
        </div>

        <button
          className={styles.copyButton}
          disabled={!hasPrompt}
          onClick={handleCopy}
          title="⌘⇧C"
        >
          <CopyIcon />
          {copied ? t('common.copied') : t('builder.copy_btn')}
        </button>

        <button
          className={styles.ghostBtn}
          style={{ width: '100%' }}
          disabled={!hasPrompt}
          onClick={handleSaveFav}
          title={t('fav.save_title')}
        >
          <StarIcon filled={savedFav} />
          {' '}{savedFav ? t('fav.saved') : t('fav.save')}
        </button>

        {negative && (
          <div>
            <div className={styles.outputLabel} style={{ marginBottom: 8 }}>
              <span style={{ color: 'var(--sg-text-disabled)' }}>{t('builder.neg_prompt_label')}</span>
            </div>
            <div className={[styles.outputBox, styles.filled].join(' ')} style={{ minHeight: 'auto' }}>
              {negative}
            </div>
          </div>
        )}

        {/* NanoBanana Core Regeln — Collapsible */}
        <div className={styles.rulesBox}>
          <button
            className={styles.rulesToggle}
            onClick={() => setRulesOpen(p => !p)}
            title={t('builder.rules_toggle_title')}
          >
            <span className={styles.rulesToggleIcon}>ℹ</span>
            <span className={styles.rulesToggleLabel}>{t('builder.rules_title')}</span>
            <span className={styles.rulesChevron}>{rulesOpen ? '▴' : '▾'}</span>
          </button>
          {rulesOpen && (
            <div className={styles.rulesContent}>
              <ol className={styles.rulesBoxList}>
                {RULES.map((rule, i) => (
                  <li key={i} className={styles.rulesBoxItem} data-index={`${i + 1}.`}>
                    {rule}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

// ── Chip Section (accordion) ──
function ChipSection({ section, state, isOpen, onToggle, onToggleChip, activeLabels, tData, styles }) {
  const { id, label, mode, data } = section
  const activeCount = activeLabels.length

  return (
    <div className={[styles.section, activeCount > 0 && styles.hasActive, isOpen && styles.open].filter(Boolean).join(' ')}>
      <div className={styles.sectionHeader} onClick={onToggle}>
        <span className={styles.sectionTitle}>
          {label}
          {/* Show selection tags when section is closed */}
          {!isOpen && activeCount > 0 && (
            <span className={styles.selectionTags}>
              {activeLabels.slice(0, 3).map(val => (
                <span key={val} className={styles.selectionTag}>{val}</span>
              ))}
              {activeLabels.length > 3 && (
                <span className={styles.selectionTag}>+{activeLabels.length - 3}</span>
              )}
            </span>
          )}
          {/* Show count badge when section is open */}
          {isOpen && activeCount > 0 && (
            <span className={styles.countBadge}>{activeCount}</span>
          )}
        </span>
        <span className={styles.sectionChevron}>▾</span>
      </div>
      {isOpen && (
        <div className={styles.sectionBody}>
          <div className={styles.chipGrid}>
            {data.map(item => {
              const isActive = mode === 'multi'
                ? state[id].has(item.v)
                : state[id] === item.v
              return (
                <button
                  key={item.v}
                  className={[styles.chip, isActive && styles.active].filter(Boolean).join(' ')}
                  title={tData(item, 't')}
                  onClick={() => onToggleChip(id, item.v, mode)}
                >
                  {item.v}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Highlighted prompt (color-coded parts) ──
function HighlightedPrompt({ state, apertureData }) {
  const parts = []
  if (state.scene)      parts.push({ text: state.scene })
  if (state.style)      parts.push({ text: `${state.style} cinematic style` })
  const framing = []
  if (state.shotsize)    framing.push(state.shotsize)
  if (state.cameraangle) framing.push(`${state.cameraangle} angle`)
  if (framing.length)    parts.push({ text: framing.join(', ') })
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
  if (cam.length) parts.push({ text: cam.join(', ') })
  if (state.lighting.size > 0)
    parts.push({ text: [...state.lighting].join(' + ') + ' lighting' })
  if (state.colorgrade)
    parts.push({ text: `${state.colorgrade} color grade` })
  if (state.effects.size > 0)
    parts.push({ text: [...state.effects].join(', ') })
  if (state.qualitySuffix && parts.length > 0)
    parts.push({ text: 'ultra detailed, photorealistic, 8K cinema quality' })

  return (
    <p style={{ margin: 0, lineHeight: 1.9 }}>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          <span>{p.text}</span>
          {i < parts.length - 1 && <span style={{ color: 'var(--sg-text-disabled)' }}>, </span>}
        </React.Fragment>
      ))}
    </p>
  )
}

// ── Icons ──
const StarIcon = ({ filled = false }) => (
  <svg width="13" height="13" viewBox="0 0 16 16"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth={filled ? 0 : 1.4}
  >
    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
  </svg>
)
const CopyIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3z"/></svg>
const DiceIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zm0 1H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm4-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>
const ResetIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg>
