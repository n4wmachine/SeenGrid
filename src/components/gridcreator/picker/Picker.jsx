import { useMemo, useState } from 'react'
import casesConfig from '../../../config/cases.config.json'
import { useGridPresets } from '../../../lib/presetStore.js'
import ThumbPattern from './ThumbPattern.jsx'
import styles from './Picker.module.css'

const CORE_CASES = casesConfig.cases
const FILTER_CATEGORIES = casesConfig.filterCategories

/**
 * Grid Creator Picker
 *
 * Full-Page-View (kein Overlay) — siehe NUANCEN 6.
 * Drei Sektionen (Reihenfolge fix):
 *   1. YOUR PRESETS     — adaptiv, Gold-Akzent
 *   2. CORE TEMPLATES   — neutral
 *   3. START FROM SCRATCH
 *
 * Suche + Filter-Pills wirken auf YOUR PRESETS + CORE TEMPLATES.
 * Scratch bleibt immer sichtbar.
 *
 * Spec: docs/visual-overhaul/PICKER_SPEC_V1.md
 */
export default function Picker({ onPick }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const presets = useGridPresets()

  const normalizedQuery = query.trim().toLowerCase()

  const visibleCores = useMemo(
    () => CORE_CASES.filter((c) => matchesFilter(c, filter) && matchesQuery(c, normalizedQuery)),
    [filter, normalizedQuery]
  )

  const visiblePresets = useMemo(
    () => presets.filter((p) => matchesFilterPreset(p, filter) && matchesQueryPreset(p, normalizedQuery)),
    [presets, filter, normalizedQuery]
  )

  const hasPresets = visiblePresets.length > 0
  const hasCores = visibleCores.length > 0
  const isSearching = normalizedQuery.length > 0
  const nothingMatches = isSearching && !hasPresets && !hasCores

  function handleClearSearch() {
    setQuery('')
  }

  function handleCorePick(c) {
    onPick({
      kind: 'core',
      caseId: c.id,
      label: c.displayName,
      panelCount: c.panelCount,
      defaultRoles: c.defaultRoles,
    })
  }

  function handlePresetPick(p) {
    onPick({
      kind: 'preset',
      presetId: p.id,
      caseId: p.caseId,
      label: p.name,
    })
  }

  function handleScratch() {
    onPick({ kind: 'scratch', label: 'empty grid' })
  }

  function handleHubHint() {
    onPick({ kind: 'hub-link', label: 'Prompt Hub (placeholder)' })
  }

  return (
    <div className={styles.page}>

      <div className={styles.topBar}>
        <div className={styles.searchWrap}>
          <svg
            className={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            className={styles.searchInput}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search templates · e.g. angle, expression, normalizer"
            aria-label="Search templates"
          />
        </div>

        <div className={styles.pills} role="tablist" aria-label="Category filter">
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={filter === cat.id}
              className={`${styles.pill} ${filter === cat.id ? styles.pillActive : ''}`}
              onClick={() => setFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {nothingMatches ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyText}>
            no templates match <span className={styles.emptyQuery}>"{query}"</span>
          </div>
          <button className={styles.clearBtn} onClick={handleClearSearch}>
            clear search
          </button>
        </div>
      ) : (
        <>
          {hasPresets && (
            <section className={styles.section}>
              <SectionLabel text="YOUR PRESETS" tone="gold" />
              <div className={styles.cardGrid}>
                {visiblePresets.map((p) => (
                  <PresetCard key={p.id} preset={p} onClick={() => handlePresetPick(p)} />
                ))}
              </div>
            </section>
          )}

          <section className={styles.section}>
            <SectionLabel text="CORE TEMPLATES" tone="neutral" />
            {hasCores ? (
              <div className={styles.cardGrid}>
                {visibleCores.map((c) => (
                  <CoreCard key={c.id} caseDef={c} onClick={() => handleCorePick(c)} />
                ))}
              </div>
            ) : (
              <div className={styles.miniEmpty}>no core templates in this category</div>
            )}
            <div className={styles.hubHint} onClick={handleHubHint}>
              more templates in Prompt Hub →
            </div>
          </section>

          <section className={styles.section}>
            <SectionLabel text="START FROM SCRATCH" tone="neutral" />
            <button className={styles.scratchCard} onClick={handleScratch}>
              <div className={styles.scratchIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div className={styles.scratchBody}>
                <div className={styles.scratchTitle}>empty grid</div>
                <div className={styles.scratchSub}>choose your own case, dimensions, and modules</div>
              </div>
              <div className={styles.scratchArrow}>→</div>
            </button>
          </section>
        </>
      )}
    </div>
  )
}

/* -------------------- helpers -------------------- */

function matchesFilter(c, filter) {
  if (filter === 'all') return true
  return c.category === filter
}

function matchesFilterPreset(p, filter) {
  if (filter === 'all') return true
  const caseDef = CORE_CASES.find((c) => c.id === p.caseId)
  return caseDef?.category === filter
}

function matchesQuery(c, q) {
  if (!q) return true
  const hay = [
    c.displayName,
    c.id.replace(/_/g, ' '),
    c.category,
    c.description,
    ...(c.keywords || []),
    ...(c.defaultRoles || []),
  ]
    .join(' ')
    .toLowerCase()
  return hay.includes(q)
}

function matchesQueryPreset(p, q) {
  if (!q) return true
  const caseDef = CORE_CASES.find((c) => c.id === p.caseId)
  const hay = [
    p.name,
    p.caseId?.replace(/_/g, ' ') ?? '',
    caseDef?.displayName ?? '',
    caseDef?.category ?? '',
    caseDef?.description ?? '',
    ...(caseDef?.keywords || []),
  ]
    .join(' ')
    .toLowerCase()
  return hay.includes(q)
}

/* -------------------- sub-components -------------------- */

function SectionLabel({ text, tone }) {
  return (
    <div className={`${styles.sectionLabel} ${tone === 'gold' ? styles.sectionLabelGold : ''}`}>
      {tone === 'gold' && (
        <span className={styles.sectionStar} aria-hidden="true">
          <StarIcon />
        </span>
      )}
      <span>{text}</span>
      <div className={styles.sectionLine} />
    </div>
  )
}

function StarIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.6 7.4 7.4.3-6 4.7 2.2 7.6-6.2-4.6-6.2 4.6 2.2-7.6-6-4.7 7.4-.3L12 2z" />
    </svg>
  )
}

function CoreCard({ caseDef, onClick }) {
  const roles = (caseDef.defaultRoles || []).join(', ')
  const sub = `${caseDef.panelCount} panels · ${roles}`
  return (
    <button className={styles.card} onClick={onClick}>
      <ThumbPattern pattern={caseDef.thumbPattern} />
      <div className={styles.cardMeta}>
        <div className={styles.cardTitle}>{caseDef.displayName.toLowerCase()}</div>
        <div className={styles.cardSub}>{sub}</div>
      </div>
    </button>
  )
}

function PresetCard({ preset, onClick }) {
  const caseDef = CORE_CASES.find((c) => c.id === preset.caseId)
  const caseLabel = caseDef?.displayName.toLowerCase() ?? preset.caseId
  const sub = `${caseLabel} · ${preset.panelCount} panels · ${formatTimeAgo(preset.modifiedAt)}`
  const hasSig = Boolean(preset.signatureId)

  return (
    <button className={`${styles.card} ${styles.cardPreset}`} onClick={onClick}>
      <div className={styles.thumbWrap}>
        <ThumbPattern pattern={caseDef?.thumbPattern ?? 'preset'} />
        {hasSig && (
          <div className={styles.sigBadge} aria-hidden="true">
            <span className={styles.sigStar}>
              <StarIcon />
            </span>
            <span className={styles.sigSwatch} />
          </div>
        )}
      </div>
      <div className={styles.cardMeta}>
        <div className={styles.cardTitle}>{preset.name}</div>
        <div className={styles.cardSub}>{sub}</div>
      </div>
    </button>
  )
}

function formatTimeAgo(ts) {
  if (!ts) return 'just now'
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}
