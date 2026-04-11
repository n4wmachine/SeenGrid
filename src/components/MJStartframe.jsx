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

  function handleSaveFav() {
    addFavorite({ id: 'mj-' + Date.now(), text: output, source: 'mj', imageUrls: [] })
    setSavedFav(true)
    setTimeout(() => setSavedFav(false), 2000)
  }
  const [warnings, setWarnings] = useState([])

  function setTemplate(tpl) {
    setState(prev => ({
      ...prev,
      selectedTemplate: tpl,
      fields: initFields(tpl),
    }))
    setWarnings([])
  }

  function updateField(id, value) {
    setState(prev => ({ ...prev, fields: { ...prev.fields, [id]: value } }))
    // Live anti-pattern check
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

  // ── Build MJ prompt ──
  const output = useMemo(() => {
    const tpl    = state.selectedTemplate
    const fields = state.fields

    let prompt = tpl.template

    // Replace template placeholders with field values or defaults
    tpl.fields.forEach(f => {
      const val = fields[f.id]?.trim()
      const placeholder = `[${f.id}]`
      if (val) {
        prompt = prompt.replace(placeholder, val)
      } else {
        // leave placeholder visible so user knows what's missing
      }
    })

    // Replace MODIFIER and GENRE from the quick-selects (if template uses them)
    prompt = prompt
      .replace('[MODIFIER]',       state.medModifier)
      .replace('[GENRE]',          state.medGenre)
      .replace('[FILMSTOCK]',      state.filmstock)
      .replace('[EMOTIONAL_HOOK]', fields['EMOTIONAL_HOOK'] || '[EMOTIONAL_HOOK]')

    // Swap out the MJ parameter section
    const paramStr = `${state.ar}${state.rawFlag ? ' --raw' : ''}`
    prompt = prompt
      .replace('--ar 16:9 --raw', paramStr)
      .replace('--ar 16:9 --raw', paramStr) // double-replace safety

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
    // Fill in common field IDs with random scene data
    if ('LOCATION'    in fields) fields['LOCATION']      = scene.location
    if ('TIME_OF_DAY' in fields) fields['TIME_OF_DAY']   = scene.time
    if ('LIGHT_SOURCE'in fields) fields['LIGHT_SOURCE']  = scene.light
    if ('WHAT_IS_DARK'in fields) fields['WHAT_IS_DARK']  = scene.dark
    if ('EMOTIONAL_HOOK' in fields) fields['EMOTIONAL_HOOK'] = hook
    setState(prev => ({
      ...prev,
      selectedTemplate: tpl,
      fields,
      filmstock: stock,
      medModifier: scene.modifier,
      medGenre: scene.genre,
    }))
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
    <div className={styles.root}>
      <div className={styles.layout}>

        {/* ── LEFT: Builder ── */}
        <div className={styles.builder}>

          {/* Architecture explainer */}
          <div className={styles.archCard}>
            <p className={styles.archTitle}>{t('mj.arch_title')}</p>
            <div className={styles.archSteps}>
              {ARCH_STEPS.map(step => (
                <div key={step.n} className={styles.archStep}>
                  <span className={styles.archNum}>{step.n}</span>
                  <div>
                    <span className={styles.archLabel}>{t(step.labelKey)}</span>
                    <span className={styles.archDesc}> — {t(step.descKey)}</span>
                    {step.required && <span className={styles.archReq}> *</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Template selector */}
          <div className={styles.block}>
            <p className="label-xs" style={{ marginBottom: 10 }}>{t('mj.shot_template')}</p>
            <div className={styles.templateGrid}>
              {templatesData.map(tpl => (
                <button
                  key={tpl.id}
                  className={`${styles.tplBtn} ${state.selectedTemplate.id === tpl.id ? styles.tplBtnActive : ''}`}
                  onClick={() => setTemplate(tpl)}
                  title={tpl.desc}
                >
                  {tpl.label}
                </button>
              ))}
            </div>
            <p className={styles.tplDesc}>{state.selectedTemplate.desc}</p>
          </div>

          {/* Medium Anker quick-selects */}
          <div className={styles.block}>
            <p className="label-xs" style={{ marginBottom: 8 }}>{t('mj.medium_anchor')}</p>
            <div className={styles.quickRow}>
              <div className={styles.quickGroup}>
                <span className={styles.quickLabel}>{t('mj.modifier')}</span>
                <div className={styles.chipFlex}>
                  {modifierData.map(m => (
                    <button
                      key={m.v}
                      className={`chip ${state.medModifier === m.v ? 'active' : ''}`}
                      title={m.t}
                      onClick={() => setState(p => ({ ...p, medModifier: m.v }))}
                    >{m.v}</button>
                  ))}
                </div>
              </div>
              <div className={styles.quickGroup}>
                <span className={styles.quickLabel}>{t('mj.genre')}</span>
                <div className={styles.chipFlex}>
                  {genreData.map(g => (
                    <button
                      key={g.v}
                      className={`chip ${state.medGenre === g.v ? 'active' : ''}`}
                      title={g.t}
                      onClick={() => setState(p => ({ ...p, medGenre: g.v }))}
                    >{g.v}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.medPreview}>
              <code>{t('mj.medium_preview')} {state.medModifier} {state.medGenre} film…</code>
            </div>
          </div>

          {/* Template field inputs */}
          <div className={styles.block}>
            <p className="label-xs" style={{ marginBottom: 10 }}>{t('mj.fill_fields')}</p>
            {state.selectedTemplate.fields
              .filter(f => f.id !== 'MODIFIER' && f.id !== 'GENRE' && f.id !== 'FILMSTOCK')
              .map(field => (
                <FieldInput
                  key={field.id}
                  field={field}
                  value={state.fields[field.id] || ''}
                  onChange={v => updateField(field.id, v)}
                  lightSourceHint={t('mj.light_source_hint')}
                />
              ))
            }
          </div>

          {/* Filmstock picker */}
          <div className={styles.block}>
            <p className="label-xs" style={{ marginBottom: 8 }}>{t('mj.filmstock')}</p>
            <div className={styles.filmstockGrid}>
              {filmstockData.map(fs => (
                <button
                  key={fs.v}
                  className={`${styles.fsBtn} ${state.filmstock === fs.v ? styles.fsBtnActive : ''}`}
                  onClick={() => setState(p => ({ ...p, filmstock: fs.v }))}
                  title={fs.t}
                >
                  <span className={styles.fsLabel}>{fs.v}</span>
                  <span className={styles.fsDesc}>{fs.t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* MJ Parameters */}
          <div className={styles.block}>
            <p className="label-xs" style={{ marginBottom: 8 }}>{t('mj.mj_params')}</p>
            <div className={styles.paramRow}>
              <div>
                <span className={styles.paramLabel}>{t('mj.aspect_ratio')}</span>
                <div className={styles.chipFlex}>
                  {AR_OPTIONS.map(ar => (
                    <button
                      key={ar.v}
                      className={`chip ${state.ar === ar.v ? 'active' : ''}`}
                      title={ar.t}
                      onClick={() => setState(p => ({ ...p, ar: ar.v }))}
                    >{ar.v.replace('--ar ', '')}</button>
                  ))}
                </div>
              </div>
              <label className={styles.rawToggle}>
                <input
                  type="checkbox"
                  checked={state.rawFlag}
                  onChange={e => setState(p => ({ ...p, rawFlag: e.target.checked }))}
                />
                <span className={`${styles.rawDot} ${state.rawFlag ? styles.rawDotOn : ''}`} />
                <span>{t('mj.raw_label')}</span>
              </label>
            </div>
          </div>

          {/* Emotional hooks quick-select */}
          <div className={styles.block}>
            <p className="label-xs" style={{ marginBottom: 8 }}>{t('mj.hook_label')}</p>
            <div className={styles.hookGrid}>
              {hookData.map(h => (
                <button
                  key={h.v}
                  className={`${styles.hookBtn} ${state.fields['EMOTIONAL_HOOK'] === h.v ? styles.hookBtnActive : ''}`}
                  onClick={() => updateField('EMOTIONAL_HOOK', h.v)}
                  title={h.t}
                >
                  &ldquo;{h.v}&rdquo;
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ── RIGHT: Output + Anti-patterns ── */}
        <div className={styles.outputCol}>
          <div className={styles.outputSticky}>

            {/* Toolbar */}
            <div className={styles.toolbar}>
              <button className="btn btn-ghost btn-sm" onClick={handleRandom}>
                <DiceIcon /> {t('common.random')}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleReset}>
                <ResetIcon /> {t('common.reset')}
              </button>
            </div>

            {/* Anti-pattern warnings */}
            {warnings.length > 0 && (
              <div className={styles.warningBox}>
                <p className={styles.warningTitle}>{t('mj.warning_title')}</p>
                {warnings.map((w, i) => (
                  <div key={i} className={styles.warningItem}>
                    <code className={styles.warningWord}>"{w.word}"</code>
                    <span className={styles.warningReason}> — {w.reason}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Prompt output */}
            <div className={styles.outputBlock}>
              <div className={styles.outputHeader}>
                <span className="label-xs">{t('mj.output_label')}</span>
                <span className={styles.mjBadge}>{t('mj.raw_badge')}</span>
              </div>
              <div
                className={`output-box ${hasContent ? 'has-content' : ''} ${styles.promptOut}`}
                onClick={e => {
                  const r = document.createRange()
                  r.selectNodeContents(e.currentTarget)
                  const s = window.getSelection()
                  s.removeAllRanges(); s.addRange(r)
                }}
              >
                {output}
              </div>
              <button
                className={`btn btn-primary ${styles.copyBtn}`}
                onClick={handleCopy}
              >
                <CopyIcon />
                {copied ? t('common.copied') : t('mj.copy_btn')}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', marginTop: 6 }}
                onClick={handleSaveFav}
              >
                <StarIcon filled={savedFav} />
                {savedFav ? t('fav.saved') : t('fav.save')}
              </button>
            </div>

            {/* Anti-pattern reference toggle */}
            <button
              className={styles.forbiddenToggle}
              onClick={() => setShowForbidden(p => !p)}
            >
              {showForbidden ? '▴' : '▾'} {t('mj.antipattern_ref')}
            </button>

            {showForbidden && (
              <div className={styles.forbiddenPanel}>
                {forbiddenData.categories.map(cat => (
                  <div key={cat.label} className={styles.forbiddenCat}>
                    <p className={styles.forbiddenLabel}>{cat.label}</p>
                    <p className={styles.forbiddenReason}>{cat.reason}</p>
                    <div className={styles.forbiddenWords}>
                      {cat.words.map(w => (
                        <code key={w} className={styles.forbiddenWord}>{w}</code>
                      ))}
                    </div>
                  </div>
                ))}
                <div className={styles.forbiddenRules}>
                  {forbiddenData.rules.map((r, i) => (
                    <p key={i} className={styles.forbiddenRule}>→ {r}</p>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

// ── Field Input ──
function FieldInput({ field, value, onChange, lightSourceHint }) {
  return (
    <div className={styles.fieldWrap}>
      <label className={styles.fieldLabel}>
        {field.label}
        {field.id === 'LIGHT_SOURCE' && (
          <span className={styles.fieldHint}> — {lightSourceHint}</span>
        )}
      </label>
      {field.examples?.length > 0 && (
        <div className={styles.fieldExamples}>
          {field.examples.map(ex => (
            <button
              key={ex}
              className={styles.exampleChip}
              onClick={() => onChange(ex)}
              title={`Quick-fill: ${ex}`}
            >{ex}</button>
          ))}
        </div>
      )}
      <textarea
        className="field"
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
