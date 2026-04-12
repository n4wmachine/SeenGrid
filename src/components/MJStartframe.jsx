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
import randomPoolsData from '../data/mj/random-pools.json'

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
  const [randomMode, setRandomMode] = useState('full')
  const [recentPicks, setRecentPicks] = useState({})

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

    // Replace longest field IDs first so WHAT_IS_DARK / WHAT_WHERE beat WHAT.
    // Use a tolerant regex that allows annotations inside the brackets
    // (e.g. "[2-3 DETAILS]" still resolves to the DETAILS field) so a
    // designer typo in the template JSON can't silently break random output.
    const sortedFields = [...tpl.fields].sort((a, b) => b.id.length - a.id.length)
    sortedFields.forEach(f => {
      const val = fields[f.id]?.trim()
      if (!val) return
      const re = new RegExp('\\[[^\\]]*' + f.id + '\\]', 'g')
      prompt = prompt.replace(re, val)
    })

    prompt = prompt
      .replace(/\[[^\]]*MODIFIER\]/g,  state.medModifier)
      .replace(/\[[^\]]*GENRE\]/g,     state.medGenre)
      .replace(/\[[^\]]*FILMSTOCK\]/g, state.filmstock)

    if (fields['EMOTIONAL_HOOK']) {
      prompt = prompt.replace(/\[[^\]]*EMOTIONAL_HOOK\]/g, fields['EMOTIONAL_HOOK'])
    }

    const paramStr = `${state.ar}${state.rawFlag ? ' --raw' : ''}`
    prompt = prompt.replace(/--ar\s+[\d.:]+(\s+--raw)?/g, paramStr)

    return prompt
  }, [state])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch { /* noop */ }
  }

  function handleRandom(mode = randomMode) {
    const pools = randomPoolsData
    const narrative = new Set(pools._meta.narrative_fields)
    const visual    = new Set(pools._meta.visual_fields)

    // Anti-repetition: track last N picks per pool, exclude them from next pick
    const MEMORY = 8
    const newRecent = { ...recentPicks }
    function pickFromPool(key, arr) {
      if (!arr || arr.length === 0) return null
      const mem = newRecent[key] || []
      const fresh = arr.filter(v => !mem.includes(v))
      const src = fresh.length > 0 ? fresh : arr
      const choice = src[Math.floor(Math.random() * src.length)]
      const nextMem = [...mem, choice].slice(-Math.min(MEMORY, arr.length - 1))
      newRecent[key] = nextMem
      return choice
    }

    // Full mode: also roll a new template. Beat/Look keep the selected template.
    const tpl = mode === 'full'
      ? templatesData[Math.floor(Math.random() * templatesData.length)]
      : state.selectedTemplate

    // Start with fresh fields for full mode, preserve current for beat/look
    const baseFields = mode === 'full' ? initFields(tpl) : { ...state.fields }

    tpl.fields.forEach(field => {
      const fid = field.id
      // MODIFIER / GENRE are handled via medium-anchor state below (visual)
      if (fid === 'MODIFIER' || fid === 'GENRE') return

      const isNarr = narrative.has(fid)
      const isVis  = visual.has(fid)
      // Empty-seed check: on the very first random roll the template fields
      // are all "" (initFields). Without this, Beat would only fill narrative
      // fields while visual fields stay empty → the template falls back to
      // [FIELD_NAME] placeholders, which looks like the random generator is
      // broken. Always fill empty fields regardless of mode.
      const isEmpty = !baseFields[fid] || String(baseFields[fid]).trim() === ''
      const shouldRoll =
        mode === 'full' ||
        (mode === 'beat' && isNarr) ||
        (mode === 'look' && isVis) ||
        isEmpty

      if (!shouldRoll) return

      const pool = pools[fid]
      const picked = pickFromPool(fid, pool)
      if (picked) {
        baseFields[fid] = picked
      } else if (field.examples?.length > 0) {
        baseFields[fid] = field.examples[Math.floor(Math.random() * field.examples.length)]
      }
    })

    // EMOTIONAL_HOOK is narrative — also pull from hookData as a secondary source
    if ((mode === 'full' || mode === 'beat') && tpl.fields.some(f => f.id === 'EMOTIONAL_HOOK')) {
      // 50/50 split: pool hooks vs curated hookData
      if (Math.random() < 0.5 && hookData.length > 0) {
        baseFields['EMOTIONAL_HOOK'] = pickFromPool('EMOTIONAL_HOOK_HOOKDATA', hookData.map(h => h.v))
      }
    }

    const newState = { ...state, selectedTemplate: tpl, fields: baseFields }

    // Visual / look parameters: filmstock, modifier, genre, ar, raw
    if (mode === 'full' || mode === 'look') {
      newState.filmstock   = pickFromPool('FILMSTOCK',    filmstockData.map(f => f.v))
      newState.medModifier = pickFromPool('MED_MODIFIER', modifierData.map(m => m.v))
      newState.medGenre    = pickFromPool('MED_GENRE',    genreData.map(g => g.v))
      newState.ar          = pickFromPool('AR',           AR_OPTIONS.map(a => a.v))
      newState.rawFlag     = Math.random() > 0.2
    }

    setRecentPicks(newRecent)
    setState(newState)
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
  }, [output, randomMode, state, recentPicks])

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

        <div className={styles.randomCluster}>
          <button
            className={styles.randomDiceBtn}
            onClick={() => handleRandom()}
            title={`${t('mj.random_title') || 'Random'} (⌘⇧R)`}
          >
            <DiceIcon /> {t('common.random')}
          </button>
          <span className={styles.randomDivider} aria-hidden="true" />
          <span className={styles.randomModeLabel}>{t('common.mode') || 'MODE'}</span>
          <div className={styles.randomModeGroup}>
            <button
              className={[styles.randomModeBtn, randomMode === 'beat' && styles.active].filter(Boolean).join(' ')}
              onClick={() => { setRandomMode('beat'); handleRandom('beat') }}
              title={t('mj.random_mode_beat_title')}
            >
              {t('mj.random_mode_beat')}
            </button>
            <button
              className={[styles.randomModeBtn, randomMode === 'look' && styles.active].filter(Boolean).join(' ')}
              onClick={() => { setRandomMode('look'); handleRandom('look') }}
              title={t('mj.random_mode_look_title')}
            >
              {t('mj.random_mode_look')}
            </button>
            <button
              className={[styles.randomModeBtn, randomMode === 'full' && styles.active].filter(Boolean).join(' ')}
              onClick={() => { setRandomMode('full'); handleRandom('full') }}
              title={t('mj.random_mode_full_title')}
            >
              {t('mj.random_mode_full')}
            </button>
          </div>
        </div>

        <div className={styles.outputControls}>
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
