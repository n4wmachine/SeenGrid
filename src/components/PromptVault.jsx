import React, { useState, useEffect, useMemo, useCallback } from 'react'
import styles from './PromptVault.module.css'
import { useLang } from '../context/LangContext.jsx'
import { useFavorites } from '../hooks/useFavorites.js'

const REPO_PROMPTS_URL =
  'https://raw.githubusercontent.com/jau123/nanobanana-trending-prompts/main/prompts/prompts.json'

const PAGE_SIZE = 30
const FAV_SENTINEL = '__favorites__'

export default function PromptVault() {
  const { t } = useLang()
  const { favorites, isFavorite, toggleFavorite, removeFavorite } = useFavorites()

  const SORT_OPTIONS = [
    { id: 'likes',   label: t('vault.sort_likes'),   desc: t('vault.sort_likes_desc') },
    { id: 'views',   label: t('vault.sort_views'),   desc: t('vault.sort_views_desc') },
    { id: 'newest',  label: t('vault.sort_newest'),  desc: t('vault.sort_newest_desc') },
  ]

  const ALL_CATEGORIES_LABEL = t('vault.all')

  const [prompts, setPrompts]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('__all__')
  const [sort, setSort]         = useState('likes')
  const [page, setPage]         = useState(1)
  const [copied, setCopied]     = useState(null)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(REPO_PROMPTS_URL)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        if (cancelled) return
        const normalized = (Array.isArray(data) ? data : data.prompts || []).map(item => ({
          id:         item.id || item.tweet_id || String(Math.random()),
          prompt:     item.prompt || item.text || '',
          imageUrls:  normalizeImages(item),
          categories: normalizeCategories(item),
          likes:      item.likes || item.hearts || item.engagement || 0,
          views:      item.views || item.impressions || 0,
          author:     item.author || item.username || item.twitter || '',
          model:      item.model || 'nanobanana',
          date:       item.date || item.created_at || '',
        }))
        setPrompts(normalized)
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message)
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  function normalizeImages(item) {
    if (item.imageUrls)  return Array.isArray(item.imageUrls) ? item.imageUrls : [item.imageUrls]
    if (item.image_url)  return [item.image_url]
    if (item.images)     return item.images
    if (item.id || item.tweet_id) {
      const tid = item.id || item.tweet_id
      return [`https://images.meigen.ai/tweets/${tid}/0.jpg`]
    }
    return []
  }

  function normalizeCategories(item) {
    if (item.categories) return Array.isArray(item.categories) ? item.categories : [item.categories]
    if (item.category)   return [item.category]
    return ['Other']
  }

  const allCategories = useMemo(() => {
    const cats = new Set()
    prompts.forEach(p => p.categories.forEach(c => cats.add(c)))
    return [FAV_SENTINEL, '__all__', ...Array.from(cats).sort()]
  }, [prompts])

  const showFavorites = category === FAV_SENTINEL

  const filtered = useMemo(() => {
    if (showFavorites) return []
    let result = prompts
    if (category !== '__all__') {
      result = result.filter(p => p.categories.includes(category))
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(p =>
        p.prompt.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
      )
    }
    if (sort === 'likes')  result = [...result].sort((a, b) => b.likes - a.likes)
    if (sort === 'views')  result = [...result].sort((a, b) => b.views - a.views)
    if (sort === 'newest') result = [...result].sort((a, b) => new Date(b.date) - new Date(a.date))
    return result
  }, [prompts, category, search, sort, showFavorites])

  const paginated = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page])
  const hasMore = paginated.length < filtered.length

  useEffect(() => { setPage(1) }, [search, category, sort])

  async function handleCopy(id, text) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 2200)
    } catch { /* noop */ }
  }

  function handleToggleStar(prompt) {
    toggleFavorite({
      id:        prompt.id,
      text:      prompt.prompt,
      source:    'vault',
      imageUrls: prompt.imageUrls,
      author:    prompt.author,
      likes:     prompt.likes,
    })
  }

  return (
    <div className={styles.container}>

      {/* Vault Header */}
      <div className={styles.vaultHeader}>
        <h2 className={styles.vaultTitle}>
          Prompt Vault
          <span className={styles.vaultCount}>
            {loading
              ? 'Lade\u2026'
              : showFavorites
              ? `${favorites.length} ${t('fav.tab')}`
              : `${filtered.length.toLocaleString()} / ${prompts.length.toLocaleString()}`
            }
          </span>
        </h2>
        <p className={styles.vaultSubtitle}>
          Community-Prompts aus{' '}
          <a href="https://github.com/jau123/nanobanana-trending-prompts" target="_blank" rel="noreferrer">
            nanobanana-trending-prompts
          </a>{' '}
          — {t('vault.subtitle')}
        </p>
      </div>

      {/* Filter Bar */}
      {!showFavorites && (
        <div className={styles.filterBar}>
          <div style={{ position: 'relative', flex: 1, minWidth: 280 }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--sg-text-tertiary)', pointerEvents: 'none',
            }}>
              <SearchIcon />
            </span>
            <input
              type="search"
              className={styles.searchInput}
              placeholder={t('vault.search_placeholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className={styles.sortGroup}>
            {SORT_OPTIONS.map(s => (
              <button
                key={s.id}
                className={[styles.sortBtn, sort === s.id && styles.active].filter(Boolean).join(' ')}
                onClick={() => setSort(s.id)}
                title={s.desc}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Chips */}
      <div className={styles.categoryChips}>
        {allCategories.map(cat => (
          <button
            key={cat}
            className={`chip${category === cat ? ' active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat === FAV_SENTINEL
              ? `\u2605 ${t('fav.tab')}${favorites.length > 0 ? ` (${favorites.length})` : ''}`
              : cat === '__all__'
              ? ALL_CATEGORIES_LABEL
              : cat
            }
          </button>
        ))}
      </div>

      {/* Favorites View */}
      {showFavorites ? (
        favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--sg-text-tertiary)' }}>
            <p>{t('fav.empty')}</p>
          </div>
        ) : (
          <div className={styles.cardGrid}>
            {favorites.map(fav => (
              <FavoriteCard
                key={fav.id}
                fav={fav}
                copied={copied === fav.id}
                onCopy={() => handleCopy(fav.id, fav.text)}
                onRemove={() => removeFavorite(fav.id)}
                copyLabel={t('vault.copy_btn')}
                copiedLabel={t('vault.copied')}
                removeLabel={t('fav.remove')}
              />
            ))}
          </div>
        )
      ) : (
        <>
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--sg-text-tertiary)' }}>
              <div style={{
                width: 24, height: 24, border: '2px solid var(--sg-border-subtle)',
                borderTopColor: 'var(--sg-gold)', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
              }} />
              <p>{t('vault.loading')}</p>
            </div>
          )}

          {error && (
            <div style={{
              padding: 'var(--sg-space-2xl)', background: 'rgba(196,64,64,0.06)',
              border: '1px solid rgba(196,64,64,0.2)', borderRadius: 'var(--sg-radius-lg)',
            }}>
              <p style={{ color: 'var(--sg-error)', fontFamily: 'var(--sg-font-mono)', fontSize: 'var(--sg-text-sm)', marginBottom: 8 }}>
                {t('vault.error_title')}
              </p>
              <p style={{ color: 'var(--sg-text-tertiary)', fontSize: 'var(--sg-text-sm)', marginBottom: 8 }}>{error}</p>
              <p style={{ color: 'var(--sg-text-disabled)', fontSize: 'var(--sg-text-xs)', fontFamily: 'var(--sg-font-mono)' }}>
                {t('vault.error_hint')}
              </p>
            </div>
          )}

          {!loading && !error && (
            <>
              {paginated.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--sg-text-tertiary)' }}>
                  <p>{t('vault.no_results')}</p>
                </div>
              ) : (
                <div className={styles.cardGrid}>
                  {paginated.map(prompt => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      copied={copied === prompt.id}
                      expanded={expanded === prompt.id}
                      starred={isFavorite(prompt.id)}
                      onCopy={() => handleCopy(prompt.id, prompt.prompt)}
                      onToggleExpand={() => setExpanded(p => p === prompt.id ? null : prompt.id)}
                      onToggleStar={() => handleToggleStar(prompt)}
                      copyLabel={t('vault.copy_btn')}
                      copiedLabel={t('vault.copied')}
                      showMoreLabel={t('vault.show_more')}
                      showLessLabel={t('vault.show_less')}
                      saveLabel={t('fav.save')}
                      removeLabel={t('fav.remove')}
                    />
                  ))}
                </div>
              )}

              {hasMore && (
                <div style={{ textAlign: 'center', paddingTop: 'var(--sg-space-2xl)' }}>
                  <button className="sg-btn-ghost" onClick={() => setPage(p => p + 1)}>
                    {t('vault.load_more')} ({filtered.length - paginated.length} {t('vault.more_items')})
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

function PromptCard({ prompt, copied, expanded, starred, onCopy, onToggleExpand, onToggleStar, copyLabel, copiedLabel, showMoreLabel, showLessLabel, saveLabel, removeLabel }) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const hasImage = prompt.imageUrls.length > 0 && !imgError

  const truncated = prompt.prompt.length > 180
  const displayText = expanded || !truncated
    ? prompt.prompt
    : prompt.prompt.slice(0, 180) + '\u2026'

  function fmtNum(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000)    return (n / 1000).toFixed(1) + 'K'
    return String(n)
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardImageWrapper}>
        {hasImage && (
          <img
            src={prompt.imageUrls[0]}
            alt=""
            className={styles.cardImage}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
          />
        )}
        <button
          className={[styles.favStar, starred && styles.active].filter(Boolean).join(' ')}
          onClick={e => { e.stopPropagation(); onToggleStar() }}
          title={starred ? removeLabel : saveLabel}
        >
          <StarIcon filled={starred} />
        </button>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          {prompt.author && (
            <span className={styles.cardAuthor}>@{prompt.author.replace('@', '')}</span>
          )}
          <span className={styles.cardStats}>
            {prompt.likes > 0 && (
              <span title="Likes"><HeartIcon />{fmtNum(prompt.likes)}</span>
            )}
            {prompt.views > 0 && (
              <span title="Views"><EyeIcon />{fmtNum(prompt.views)}</span>
            )}
          </span>
          {prompt.model && (
            <span className={`${styles.sourceBadge} ${styles.nanobanana}`}>{prompt.model}</span>
          )}
        </div>

        <p className={styles.cardPrompt}>{displayText}</p>

        {truncated && (
          <button className={styles.cardShowMore} onClick={onToggleExpand}>
            {expanded ? showLessLabel : showMoreLabel}
          </button>
        )}

        {prompt.categories.filter(c => c !== 'Other').map(c => (
          <span key={c} className={styles.cardCategory}>{c}</span>
        ))}
      </div>

      <button className={styles.cardCopyBtn} onClick={onCopy}>
        <CopyIcon />
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  )
}

function FavoriteCard({ fav, copied, onCopy, onRemove, copyLabel, copiedLabel, removeLabel }) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const hasImage = fav.imageUrls?.length > 0 && !imgError

  const sourceColor = {
    vault:   'var(--sg-teal)',
    builder: 'var(--sg-gold)',
    mj:      'var(--sg-text-secondary)',
  }[fav.source] || 'var(--sg-text-primary)'

  const truncated = fav.text.length > 180
  const [expanded, setExpanded] = useState(false)
  const displayText = expanded || !truncated ? fav.text : fav.text.slice(0, 180) + '\u2026'

  return (
    <div className={styles.card}>
      <div className={styles.cardImageWrapper}>
        {hasImage && (
          <img
            src={fav.imageUrls[0]}
            alt=""
            className={styles.cardImage}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
          />
        )}
        <button
          className={[styles.favStar, styles.active].filter(Boolean).join(' ')}
          onClick={onRemove}
          title={removeLabel}
        >
          <StarIcon filled />
        </button>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          {fav.author && (
            <span className={styles.cardAuthor}>@{fav.author.replace('@', '')}</span>
          )}
          <span className={styles.cardStats}>
            <span style={{ color: sourceColor, fontFamily: 'var(--sg-font-mono)', fontSize: 'var(--sg-text-xs)' }}>
              {fav.source}
            </span>
          </span>
        </div>

        <p className={styles.cardPrompt}>{displayText}</p>

        {truncated && (
          <button className={styles.cardShowMore} onClick={() => setExpanded(p => !p)}>
            {expanded ? '\u2212 weniger' : '+ mehr'}
          </button>
        )}
      </div>

      <button className={styles.cardCopyBtn} onClick={onCopy}>
        <CopyIcon />
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  )
}

const StarIcon = ({ filled = false }) => (
  <svg width="13" height="13" viewBox="0 0 16 16"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth={filled ? 0 : 1.4}
  >
    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
  </svg>
)
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.44 1.406a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
  </svg>
)
const CopyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3z"/>
  </svg>
)
const HeartIcon = () => (
  <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
  </svg>
)
const EyeIcon = () => (
  <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
  </svg>
)
