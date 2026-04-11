import React, { useState, useMemo } from 'react'
import styles from './MJStartframe.module.css'
import { useLang } from '../context/LangContext.jsx'
import { useFavorites } from '../hooks/useFavorites.js'

import templatesData  from '../data/mj/templates.json'
import filmstockData  from '../data/mj/filmstocks.json'
import forbiddenData  from '../data/mj/forbidden.json'
import genreData      from '../data/mj/genres.json'
import modifierData   from '../data/mj/modifiers.json'
import hookData       from '../data/mj/emotional-hooks.json'
import randomSceneData from '../data/mj/random-scenes.json'

const AR_OPTIONS = [
  { v: '--ar 16:9',    t: 'Breitbild — Standard' },
  { v: '--ar 2.39:1',  t: 'Anamorphic Cinemascope' },
  { v: '--ar 1.85:1',  t: 'Flat Widescreen' },
  { v: '--ar 4:3',     t: 'Enge, Porträt, Retro' },
  { v: '--ar 9:16',    t: 'Vertikal / Mobile' },
  { v: '--ar 1:1',     t: 'Quadratisch' },
]

function initState() {
  return {
    selectedTemplate: templatesData[0],
    fields: initFields(templatesData[0]),
    filmstock: filmstockData[0].v,
    ar: '--ar 16:9',
    rawFlag: true,
    medModifier: modifierData[0].v,
    medGenre: genreData[0].v,
  }
}

function initFields(template) {
  const obj = {}
  template.fields.forEach(f => { obj[f.id] = '' })
  return obj
}

export default function MJStartframe() {
  const { t } = useLang()
  const [state, setState] = useState(initState)
  const [copied, setCopied]     = useState(false)
  const [showForbidden, setShowForbidden] = useState(false)
  const { addFavorite } = useFavorites()
  const [savedFav, setSavedFav] = useState(false)
  const [warnings, setWarnings] = useState([])

  function handleSaveFav() {
    addFavorite({ id: 'mj-' + Date.now(), text: output, source: 'mj', imageUrls: [] })
    setSavedFav(true)
    setTimeout(() => setSavedFav(false), 2000)
  }

  function setTemplate(tpl) {
    setState(prev => ({ ...prev, selectedTemplate: tpl, fields: initFields(tpl) }))
    setWarnings([])
  }

  function updateField(id, value) {
    setState(prev => ({ ...prev, fields: { ...prev.fields, [id]: value } }))
    checkForForbidden(value)
  }

  function checkForForbidden(text) {
    if (!text) { setWarnings([]); return }
    const found = []
    forbiddenData.categories.forEach(cat => {
      cat.words.forEach(w => {
        if (text.toLowerCase().includes(w.toLowerCase())) {
          found.push({ word: w, reason: cat.reason, label: cat.label })
        }
      })
    })
    setWarnings(found)
  }

  const output = useMemo(() => {
    const tpl    = state.selectedTemplate
    const fields = state.fields

    let prompt = tpl.template

    tpl.fields.forEach(f => {
      const val = fields[f.id]?.trim()
      const placeholder = `[${f.id}]`
      if (val) {
        prompt = prompt.replace(placeholder, val)
      }
    })

    prompt = prompt
      .replace('[MODIFIER]',       state.medModifier)
      .replace('[GENRE]',          state.medGenre)
      .replace('[FILMSTOCK]',      state.filmstock)
      .replace('[EMOTIONAL_HOOK]', fields['EMOTIONAL_HOOK'] || '[EMOTIONAL_HOOK]')

    const paramStr = `${state.ar}${state.rawFlag ? ' --raw' : ''}`
    prompt = prompt
      .replace('--ar 16:9 --raw', paramStr)
      .replace('--ar 16:9 --raw', paramStr)

    return prompt
  }, [state])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch { /* noop */ }
  }

  function handleRandom() {
    const scene = randomSceneData[Math.floor(Math.random() * randomSceneData.length)]
    const hook  = hookData[Math.floor(Math.random() * hookData.length)].v
    const stock = filmstockData[Math.floor(Math.random() * filmstockData.length)].v
    const tpl   = templatesData[Math.floor(Math.random() * templatesData.length)]
    const fields = initFields(tpl)
    if ('LOCATION'    in fields) fields['LOCATION']      = scene.location
    if ('TIME_OF_DAY' in fields) fields['TIME_OF_DAY']   = scene.time
    if ('LIGHT_SOURCE'in fields) fields['LIGHT_SOURCE']  = scene.light
    if ('WHAT_IS_DARK'in fields) fields['WHAT_IS_DARK']  = scene.dark
    if ('EMOTIONAL_HOOK' in fields) fields['EMOTIONAL_HOOK'] = hook
    setState(prev => ({ ...prev, selectedTemplate: tpl, fields, filmstock: stock, medModifier: scene.modifier, medGenre: scene.genre }))
    setWarnings([])
  }

  function handleReset() {
    setState(initState())
    setWarnings([])
  }

  const hasContent = !output.includes('[')

  const ARCH_STEPS = [
    { n: '1', labelKey: 'mj.step1_label', descKey: 'mj.step1_desc', required: true },
    { n: '2', labelKey: 'mj.step2_label', descKey: 'mj.step2_desc', required: true },
    { n: '3', labelKey: 'mj.step3_label', descKey: 'mj.step3_desc', required: true },
    { n: '4', labelKey: 'mj.step4_label', descKey: 'mj.step4_desc', required: false },
    { n: '5', labelKey: 'mj.step5_label', descKey: 'mj.step5_desc', required: true },
  ]

  return (
    <div className={styles.container}>

      {/* LINKE SPALTE: Builder */}
      <div className={styles.builderColumn}>

        {/* 5-Element Architektur */}
        <div className={styles.architectureBox}>
          <p className={styles.architectureTitle}>{t('mj.arch_title')}</p>
          <div className={styles.architectureList}>
            {ARCH_STEPS.map(step => (
              <div key={step.n} className={styles.architectureItem}>
                <span className={styles.architectureNumber}>{step.n}</span>
                <div>
                  <span className={styles.architectureLabel}>{t(step.labelKey)}</span>
                  <span className={styles.architectureDesc}> — {t(step.descKey)}</span>
                  {step.required && <span className={styles.requiredDot} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shot Template */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>{t('mj.shot_template')}</p>
          <div className={styles.chipGrid}>
            {templatesData.map(tpl => (
              <button
                key={tpl.id}
                className={`chip${state.selectedTemplate.id === tpl.id ? ' active' : ''}`}
                onClick={() => setTemplate(tpl)}
                title={tpl.desc}
              >
                {tpl.label}
              </button>
            ))}
          </div>
          <p style={{ marginTop: 10, fontSize: 'var(--sg-text-xs)', color: 'var(--sg-text-tertiary)', fontFamily: 'var(--sg-font-mono)' }}>
            {state.selectedTemplate.desc}
          </p>
        </div>

        {/* Medium Anker */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>{t('mj.medium_anchor')}</p>

          <p className={styles.subLabel}>{t('mj.modifier')}</p>
          <div className={styles.chipGrid}>
            {modifierData.map(m => (
              <button
                key={m.v}
                className={`chip${state.medModifier === m.v ? ' active' : ''}`}
                title={m.t}
                onClick={() => setState(p => ({ ...p, medModifier: m.v }))}
              >{m.v}</button>
            ))}
          </div>

          <p className={styles.subLabel}>{t('mj.genre')}</p>
          <div className={styles.chipGrid}>
            {genreData.map(g => (
              <button
                key={g.v}
                className={`chip${state.medGenre === g.v ? ' active' : ''}`}
                title={g.t}
                onClick={() => setState(p => ({ ...p, medGenre: g.v }))}
              >{g.v}</button>
            ))}
          </div>

          <div className={styles.inlinePreview}>
            <code>{t('mj.medium_preview')} {state.medModifier} {state.medGenre} film…</code>
          </div>
        </div>

        {/* Template Fields */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>{t('mj.fill_fields')}</p>
          <div className={styles.fieldGroup}>
            {state.selectedTemplate.fields
              .filter(f => f.id !== 'MODIFIER' && f.id !== 'GENRE' && f.id !== 'FILMSTOCK')
              .map(field => (
                <FieldInput
                  key={field.id}
                  field={field}
                  value={state.fields[field.id] || ''}
                  onChange={v => updateField(field.id, v)}
                  lightSourceHint={t('mj.light_source_hint')}
                  styles={styles}
                />
              ))
            }
          </div>
        </div>

        {/* Filmstock */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>{t('mj.filmstock')}</p>
          <div className={styles.chipGrid}>
            {filmstockData.map(fs => (
              <button
                key={fs.v}
                className={`chip${state.filmstock === fs.v ? ' active' : ''}`}
                onClick={() => setState(p => ({ ...p, filmstock: fs.v }))}
                title={fs.t}
              >
                {fs.v}
              </button>
            ))}
          </div>
        </div>

        {/* MJ Parameters */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>{t('mj.mj_params')}</p>

          <p className={styles.subLabel}>{t('mj.aspect_ratio')}</p>
          <div className={styles.chipGrid}>
            {AR_OPTIONS.map(ar => (
              <button
                key={ar.v}
                className={`chip${state.ar === ar.v ? ' active' : ''}`}
                title={ar.t}
                onClick={() => setState(p => ({ ...p, ar: ar.v }))}
              >{ar.v.replace('--ar ', '')}</button>
            ))}
          </div>

          <p className={styles.subLabel} style={{ marginTop: 'var(--sg-space-lg)' }}>{t('mj.raw_label')}</p>
          <button
            className={`chip${state.rawFlag ? ' active' : ''}`}
            onClick={() => setState(p => ({ ...p, rawFlag: !p.rawFlag }))}
          >
            --raw {state.rawFlag ? '✓' : '○'}
          </button>
        </div>

        {/* Emotional Hooks */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>{t('mj.hook_label')}</p>
          <div className={styles.chipGrid}>
            {hookData.map(h => (
              <button
                key={h.v}
                className={`chip${state.fields['EMOTIONAL_HOOK'] === h.v ? ' active' : ''}`}
                onClick={() => updateField('EMOTIONAL_HOOK', h.v)}
                title={h.t}
              >
                &ldquo;{h.v}&rdquo;
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* RECHTE SPALTE: Sticky Output */}
      <div className={styles.outputColumn}>

        <div className={styles.outputControls}>
          <button className="sg-btn-ghost" onClick={handleRandom}>
            <DiceIcon /> {t('common.random')}
          </button>
          <button className="sg-btn-ghost" onClick={handleReset}>
            <ResetIcon /> {t('common.reset')}
          </button>
        </div>

        {/* Anti-pattern warnings */}
        {warnings.length > 0 && (
          <div style={{
            background: 'rgba(196, 64, 64, 0.08)',
            border: '1px solid rgba(196, 64, 64, 0.25)',
            borderRadius: 'var(--sg-radius-lg)',
            padding: 'var(--sg-space-lg)',
          }}>
            <p style={{ fontFamily: 'var(--sg-font-mono)', fontSize: 'var(--sg-text-xs)', color: 'var(--sg-error)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              {t('mj.warning_title')}
            </p>
            {warnings.map((w, i) => (
              <div key={i} style={{ fontSize: 'var(--sg-text-xs)', marginBottom: 4 }}>
                <code style={{ color: 'var(--sg-error)', fontFamily: 'var(--sg-font-mono)' }}>"{w.word}"</code>
                <span style={{ color: 'var(--sg-text-tertiary)' }}> — {w.reason}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className={styles.outputLabel}>{t('mj.output_label')}</span>
          <span className={styles.outputRawBadge}>{t('mj.raw_badge')}</span>
        </div>

        <div className={[styles.outputBox, hasContent && styles.filled].filter(Boolean).join(' ')}
          onClick={e => {
            const r = document.createRange()
            r.selectNodeContents(e.currentTarget)
            const s = window.getSelection()
            s.removeAllRanges(); s.addRange(r)
          }}
        >
          {output}
        </div>

        <button className={styles.copyButton} onClick={handleCopy}>
          <CopyIcon />
          {copied ? t('common.copied') : t('mj.copy_btn')}
        </button>

        <button
          className="sg-btn-ghost"
          style={{ width: '100%' }}
          onClick={handleSaveFav}
        >
          <StarIcon filled={savedFav} />
          {' '}{savedFav ? t('fav.saved') : t('fav.save')}
        </button>

        {/* Anti-Pattern Reference Toggle */}
        <button
          className={styles.antiPatternToggle}
          onClick={() => setShowForbidden(p => !p)}
        >
          {showForbidden ? '▴' : '▾'} {t('mj.antipattern_ref')}
        </button>

        {showForbidden && (
          <div style={{
            background: 'var(--sg-bg-surface-1)',
            border: '1px solid var(--sg-border-subtle)',
            borderRadius: 'var(--sg-radius-lg)',
            padding: 'var(--sg-space-lg)',
          }}>
            {forbiddenData.categories.map(cat => (
              <div key={cat.label} style={{ marginBottom: 16 }}>
                <p style={{ fontFamily: 'var(--sg-font-mono)', fontSize: 'var(--sg-text-xs)', color: 'var(--sg-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
                  {cat.label}
                </p>
                <p style={{ fontSize: 'var(--sg-text-xs)', color: 'var(--sg-text-tertiary)', marginBottom: 6 }}>{cat.reason}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {cat.words.map(w => (
                    <code key={w} style={{
                      fontFamily: 'var(--sg-font-mono)', fontSize: 'var(--sg-text-xs)',
                      color: 'var(--sg-error)',
                      background: 'rgba(196,64,64,0.08)',
                      border: '1px solid rgba(196,64,64,0.2)',
                      borderRadius: 3, padding: '1px 5px',
                    }}>{w}</code>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--sg-border-subtle)', paddingTop: 12, marginTop: 4 }}>
              {forbiddenData.rules.map((r, i) => (
                <p key={i} style={{ fontFamily: 'var(--sg-font-mono)', fontSize: 'var(--sg-text-xs)', color: 'var(--sg-text-tertiary)', marginBottom: 4 }}>→ {r}</p>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ── Field Input ──
function FieldInput({ field, value, onChange, lightSourceHint, styles }) {
  return (
    <div>
      <label className={styles.fieldLabel}>
        {field.label}
        {field.id === 'LIGHT_SOURCE' && (
          <span style={{ fontWeight: 400, color: 'var(--sg-text-tertiary)', fontSize: 'var(--sg-text-sm)' }}> — {lightSourceHint}</span>
        )}
      </label>
      {field.examples?.length > 0 && (
        <div className={styles.quickPicks}>
          {field.examples.map(ex => (
            <button
              key={ex}
              className="chip"
              onClick={() => onChange(ex)}
              title={`Quick-fill: ${ex}`}
            >{ex}</button>
          ))}
        </div>
      )}
      <textarea
        className={styles.fieldTextarea}
        rows={2}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={field.placeholder}
        spellCheck={false}
      />
    </div>
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
