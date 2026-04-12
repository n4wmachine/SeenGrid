import React, { useState, useMemo, useEffect } from 'react'
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
  { v: '--ar 16:9',    t: 'Widescreen — standard',        t_en: 'Widescreen — standard',        t_de: 'Breitbild — Standard' },
  { v: '--ar 2.39:1',  t: 'Anamorphic Cinemascope',       t_en: 'Anamorphic Cinemascope',       t_de: 'Anamorphic Cinemascope' },
  { v: '--ar 1.85:1',  t: 'Flat Widescreen',              t_en: 'Flat Widescreen',              t_de: 'Flat Widescreen' },
  { v: '--ar 4:3',     t: 'Tight, portrait, retro',       t_en: 'Tight, portrait, retro',       t_de: 'Enge, Porträt, Retro' },
  { v: '--ar 9:16',    t: 'Vertical / mobile',            t_en: 'Vertical / mobile',            t_de: 'Vertikal / Mobile' },
  { v: '--ar 1:1',     t: 'Square',                       t_en: 'Square',                       t_de: 'Quadratisch' },
]

const SUB_TABS = [
  { id: 'fields',    labelKey: 'mj.sub_tab_fields',    descKey: 'mj.sub_tab_fields_desc' },
  { id: 'templates', labelKey: 'mj.sub_tab_templates', descKey: 'mj.sub_tab_templates_desc' },
  { id: 'params',    labelKey: 'mj.sub_tab_params',    descKey: 'mj.sub_tab_params_desc' },
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
  const { t, tData, lang } = useLang()
  const [state, setState] = useState(initState)
  const [copied, setCopied]     = useState(false)
  const [showForbidden, setShowForbidden] = useState(false)
  const [hooksOpen, setHooksOpen] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState('fields')
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
          found.push({ word: w, cat })
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
    const mod   = modifierData[Math.floor(Math.random() * modifierData.length)].v
    const genre = genreData[Math.floor(Math.random() * genreData.length)].v
    const ar    = AR_OPTIONS[Math.floor(Math.random() * AR_OPTIONS.length)].v
    const tpl   = templatesData[Math.floor(Math.random() * templatesData.length)]
    const fields = initFields(tpl)

    // Fill all available fields from random scene data
    if ('LOCATION'       in fields) fields['LOCATION']       = scene.location  || ''
    if ('TIME_OF_DAY'    in fields) fields['TIME_OF_DAY']    = scene.time      || ''
    if ('LIGHT_SOURCE'   in fields) fields['LIGHT_SOURCE']   = scene.light     || ''
    if ('WHAT_IS_DARK'   in fields) fields['WHAT_IS_DARK']   = scene.dark      || ''
    if ('EMOTIONAL_HOOK' in fields) fields['EMOTIONAL_HOOK'] = hook
    if ('SURFACES'       in fields) fields['SURFACES']       = scene.surfaces  || ''
    if ('PERSPECTIVE'    in fields) fields['PERSPECTIVE']    = scene.perspective || ''

    setState({
      selectedTemplate: tpl,
      fields,
      filmstock: stock,
      medModifier: scene.modifier || mod,
      medGenre: scene.genre || genre,
      ar,
      rawFlag: Math.random() > 0.3,
    })
    setWarnings([])
  }

  function handleReset() {
    setState(initState())
    setWarnings([])
  }

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        handleCopy()
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'G') {
        e.preventDefault()
        handleRandom()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [output])

  const hasContent = !output.includes('[')

  // Count filled fields for sub-tab badges
  const filledFieldCount = Object.values(state.fields).filter(v => v?.trim()).length
  const totalFieldCount = state.selectedTemplate.fields.filter(f => f.id !== 'MODIFIER' && f.id !== 'GENRE' && f.id !== 'FILMSTOCK').length

  return (
    <div className={styles.container}>

      {/* LINKE SPALTE: Builder */}
      <div className={styles.builderColumn}>

        {/* Sub-Tab Navigation */}
        <div className={styles.subTabNav}>
          {SUB_TABS.map(tab => (
            <button
              key={tab.id}
              className={[styles.subTabBtn, activeSubTab === tab.id && styles.active].filter(Boolean).join(' ')}
              onClick={() => setActiveSubTab(tab.id)}
              title={t(tab.descKey)}
            >
              {t(tab.labelKey)}
              {tab.id === 'fields' && filledFieldCount > 0 && (
                <span className={styles.subTabBadge}>{filledFieldCount}/{totalFieldCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* ═══ SUB-TAB: Felder ═══ */}
        {activeSubTab === 'fields' && (
          <>
            {/* 5-Element Architektur — compact */}
            <div className={styles.architectureBox}>
              <p className={styles.architectureTitle}>{t('mj.arch_title')}</p>
              <div className={styles.architectureList}>
                {[
                  { n: '1', labelKey: 'mj.step1_label', req: true },
                  { n: '2', labelKey: 'mj.step2_label', req: true },
                  { n: '3', labelKey: 'mj.step3_label', req: true },
                  { n: '4', labelKey: 'mj.step4_label', req: false },
                  { n: '5', labelKey: 'mj.step5_label', req: true },
                ].map(step => (
                  <span key={step.n} className={styles.archStep}>
                    <span className={styles.archNum}>{step.n}</span>
                    <span className={styles.archLabel}>{t(step.labelKey)}</span>
                    {step.req && <span className={styles.requiredDot} />}
                  </span>
                ))}
              </div>
            </div>

            {/* Template Fields */}
            <div className={styles.section}>
              <p className={styles.sectionTitle}>{t('mj.fill_fields')}</p>
              <p className={styles.templateIndicator}>
                Template: {tData(state.selectedTemplate, 'label')}
              </p>
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
                      tData={tData}
                      styles={styles}
                    />
                  ))
                }
              </div>
            </div>

            {/* Emotional Hooks — Collapsible */}
            <div className={styles.section}>
              <button
                className={styles.collapsibleHeader}
                onClick={() => setHooksOpen(p => !p)}
                title={t('mj.hook_toggle_title')}
              >
                <span className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                  {t('mj.hook_label')}
                  {state.fields['EMOTIONAL_HOOK'] && (
                    <span className={styles.hookPreview}>"{state.fields['EMOTIONAL_HOOK']}"</span>
                  )}
                </span>
                <span className={styles.chevron}>{hooksOpen ? '▴' : '▾'}</span>
              </button>
              {hooksOpen && (
                <div className={styles.collapsibleBody}>
                  <div className={styles.chipGrid}>
                    {hookData.map(h => (
                      <button
                        key={h.v}
                        className={[styles.chip, state.fields['EMOTIONAL_HOOK'] === h.v && styles.active].filter(Boolean).join(' ')}
                        onClick={() => updateField('EMOTIONAL_HOOK', h.v)}
                        title={tData(h, 't')}
                      >
                        &ldquo;{h.v}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══ SUB-TAB: Templates & Medium ═══ */}
        {activeSubTab === 'templates' && (
          <>
            {/* Shot Template */}
            <div className={styles.section}>
              <p className={styles.sectionTitle}>{t('mj.shot_template')}</p>
              <div className={styles.chipGrid}>
                {templatesData.map(tpl => (
                  <button
                    key={tpl.id}
                    className={[styles.chip, state.selectedTemplate.id === tpl.id && styles.active].filter(Boolean).join(' ')}
                    onClick={() => setTemplate(tpl)}
                    title={tData(tpl, 'desc')}
                  >
                    {tData(tpl, 'label')}
                  </button>
                ))}
              </div>
              <p className={styles.templateDesc}>
                {tData(state.selectedTemplate, 'desc')}
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
                    className={[styles.chip, state.medModifier === m.v && styles.active].filter(Boolean).join(' ')}
                    title={tData(m, 't')}
                    onClick={() => setState(p => ({ ...p, medModifier: m.v }))}
                  >{m.v}</button>
                ))}
              </div>

              <p className={styles.subLabel}>{t('mj.genre')}</p>
              <div className={styles.chipGrid}>
                {genreData.map(g => (
                  <button
                    key={g.v}
                    className={[styles.chip, state.medGenre === g.v && styles.active].filter(Boolean).join(' ')}
                    title={tData(g, 't')}
                    onClick={() => setState(p => ({ ...p, medGenre: g.v }))}
                  >{g.v}</button>
                ))}
              </div>

              <div className={styles.inlinePreview}>
                <code>{t('mj.medium_preview')} {state.medModifier} {state.medGenre} film…</code>
              </div>
            </div>
          </>
        )}

        {/* ═══ SUB-TAB: Filmstock & Parameter ═══ */}
        {activeSubTab === 'params' && (
          <>
            {/* Filmstock */}
            <div className={styles.section}>
              <p className={styles.sectionTitle}>{t('mj.filmstock')}</p>
              <div className={styles.chipGrid}>
                {filmstockData.map(fs => (
                  <button
                    key={fs.v}
                    className={[styles.chip, state.filmstock === fs.v && styles.active].filter(Boolean).join(' ')}
                    onClick={() => setState(p => ({ ...p, filmstock: fs.v }))}
                    title={tData(fs, 't')}
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
                    className={[styles.chip, state.ar === ar.v && styles.active].filter(Boolean).join(' ')}
                    title={tData(ar, 't')}
                    onClick={() => setState(p => ({ ...p, ar: ar.v }))}
                  >{ar.v.replace('--ar ', '')}</button>
                ))}
              </div>

              <p className={styles.subLabel} style={{ marginTop: 'var(--sg-space-lg)' }}>{t('mj.raw_label')}</p>
              <button
                className={[styles.chip, state.rawFlag && styles.active].filter(Boolean).join(' ')}
                onClick={() => setState(p => ({ ...p, rawFlag: !p.rawFlag }))}
                title={t('mj.raw_toggle_title')}
              >
                --raw {state.rawFlag ? '✓' : '○'}
              </button>
            </div>
          </>
        )}

      </div>

      {/* RECHTE SPALTE: Sticky Output */}
      <div className={styles.outputColumn}>

        <div className={styles.outputControls}>
          <button className={styles.ghostBtn} onClick={handleRandom} title="⌘⇧R">
            <DiceIcon /> {t('common.random')}
          </button>
          <button className={styles.ghostBtn} onClick={handleReset} title={t('mj.reset_title')}>
            <ResetIcon /> {t('common.reset')}
          </button>
        </div>

        {/* Anti-pattern warnings */}
        {warnings.length > 0 && (
          <div className={styles.warningBox}>
            <p className={styles.warningTitle}>
              {t('mj.warning_title')}
            </p>
            {warnings.map((w, i) => (
              <div key={i} className={styles.warningItem}>
                <code className={styles.warningWord}>"{w.word}"</code>
                <span className={styles.warningReason}> — {tData(w.cat, 'reason')}</span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.outputLabelRow}>
          <span className={styles.outputLabel}>{t('mj.output_label')}</span>
          <span className={styles.outputRawBadge}>{t('mj.raw_badge')}</span>
        </div>

        <div
          className={[styles.outputBox, hasContent && styles.filled].filter(Boolean).join(' ')}
          onClick={e => {
            const r = document.createRange()
            r.selectNodeContents(e.currentTarget)
            const s = window.getSelection()
            s.removeAllRanges(); s.addRange(r)
          }}
        >
          {/* Ghost preview: show template with placeholders in muted style when not filled */}
          {hasContent ? (
            <span>{output}</span>
          ) : (
            <span className={styles.ghostPreview}>{output}</span>
          )}
        </div>

        <button className={styles.copyButton} onClick={handleCopy} title="⌘⇧C">
          <CopyIcon />
          {copied ? t('common.copied') : t('mj.copy_btn')}
        </button>

        <button
          className={styles.ghostBtn}
          style={{ width: '100%' }}
          onClick={handleSaveFav}
          title={t('fav.save_title')}
        >
          <StarIcon filled={savedFav} />
          {' '}{savedFav ? t('fav.saved') : t('fav.save')}
        </button>

        {/* Anti-Pattern Reference Toggle */}
        <button
          className={styles.antiPatternToggle}
          onClick={() => setShowForbidden(p => !p)}
          title={t('mj.antipattern_title')}
        >
          {showForbidden ? '▴' : '▾'} {t('mj.antipattern_ref')}
        </button>

        {showForbidden && (
          <div className={styles.forbiddenBox}>
            {forbiddenData.categories.map(cat => (
              <div key={cat.label_en} className={styles.forbiddenCategory}>
                <p className={styles.forbiddenCatTitle}>
                  {tData(cat, 'label')}
                </p>
                <p className={styles.forbiddenCatReason}>{tData(cat, 'reason')}</p>
                <div className={styles.forbiddenWords}>
                  {cat.words.map(w => (
                    <code key={w} className={styles.forbiddenWord}>{w}</code>
                  ))}
                </div>
              </div>
            ))}
            <div className={styles.forbiddenRules}>
              {(forbiddenData[`rules_${lang}`] || forbiddenData.rules_en || forbiddenData.rules).map((r, i) => (
                <p key={i} className={styles.forbiddenRule}>→ {r}</p>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ── Field Input ──
function FieldInput({ field, value, onChange, lightSourceHint, tData, styles }) {
  return (
    <div>
      <label className={styles.fieldLabel}>
        {tData(field, 'label')}
        {field.id === 'LIGHT_SOURCE' && (
          <span className={styles.fieldHint}> — {lightSourceHint}</span>
        )}
      </label>
      {field.examples?.length > 0 && (
        <div className={styles.quickPicks}>
          {field.examples.map(ex => (
            <button
              key={ex}
              className={[styles.chip, styles.chipSmall].join(' ')}
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
        placeholder={tData(field, 'placeholder')}
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
