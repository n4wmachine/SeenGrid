import React, { useState, useEffect, useMemo, useCallback } from 'react'
import styles from './PromptVault.module.css'
import { useLang } from '../context/LangContext.jsx'

const REPO_PROMPTS_URL =
  'https://raw.githubusercontent.com/jau123/nanobanana-trending-prompts/main/prompts/prompts.json'

const PAGE_SIZE = 30

export default function PromptVault() {
  const { t } = useLang()

  const SORT_OPTIONS = [
    { id: 'likes',   label: t('vault.sort_likes'),   desc: t('vault.sort_likes_desc') },
    { id: 'views',   label: t('vault.sort_views'),   desc: t('vault.sort_views_desc') },
    { id: 'newest',  label: t('vault.sort_newest'),  desc: t('vault.sort_newest_desc') },
  ]

  const ALL_CATEGORIES_LABEL = t('vault.all')

  const [prompts, setPrompts]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('__all__')
  const [sort, setSort]             = useState('likes')
  const [page, setPage]             = useState(1)
  const [copied, setCopied]         = useState(null)
  const [expanded, setExpanded]     = useState(null)

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
    return ['__all__', ...Array.from(cats).sort()]
  }, [prompts])

  const filtered = useMemo(() => {
    let result = prompts

    if (category !== '__all__') {
      result = result.filter(p => p.categories.includes(category))
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(p =>
        p.prompt.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q)
      )
    }

    if (sort === 'likes')  result = [...result].sort((a, b) => b.likes - a.likes)
    if (sort === 'views')  result = [...result].sort((a, b) => b.views - a.views)
    if (sort === 'newest') result = [...result].sort((a, b) => new Date(b.date) - new Date(a.date))

    return result
  }, [prompts, category, search, sort])

  const paginated = useMemo(
    () => filtered.slice(0, page * PAGE_SIZE),
    [filtered, page]
  )

  const hasMore = paginated.length < filtered.length

  useEffect(() => { setPage(1) }, [search, category, sort])

  async function handleCopy(id, text) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 2200)
    } catch { /* noop */ }
  }

  return (
    <div className={styles.root}>

      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <div className={styles.titleBlock}>
            <h2 className={styles.vaultTitle}>Prompt Vault</h2>
            <span className={styles.vaultCount}>
              {loading
                ? 'Lade…'
                : `${filtered.length.toLocaleString()} ${t('vault.count_of')} ${prompts.length.toLocaleString()} ${t('vault.prompts')}`
              }
            </span>
          </div>
          <p className={styles.vaultSub}>
            Community-Prompts aus <a
              href="https://github.com/jau123/nanobanana-trending-prompts"
              target="_blank"
              rel="noreferrer"
              className={styles.repoLink}
            >nanobanana-trending-prompts</a> — {t('vault.subtitle')}
          </p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <SearchIcon />
          <input
            type="text"
            className={styles.searchInput}
            placeholder={t('vault.search_placeholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            spellCheck={false}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch('')}>×</button>
          )}
        </div>

        <div className={styles.sortBtns}>
          {SORT_OPTIONS.map(s => (
            <button
              key={s.id}
              className={`${styles.sortBtn} ${sort === s.id ? styles.sortBtnActive : ''}`}
              onClick={() => setSort(s.id)}
              title={s.desc}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.catBar}>
        {allCategories.map(cat => (
          <button
            key={cat}
            className={`chip ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat === '__all__' ? ALL_CATEGORIES_LABEL : cat}
          </button>
        ))}
      </div>

      {loading && (
        <div className={styles.statusBox}>
          <div className={styles.spinner} />
          <p>{t('vault.loading')}</p>
        </div>
      )}

      {error && (
        <div className={styles.errorBox}>
          <p className={styles.errorTitle}>{t('vault.error_title')}</p>
          <p className={styles.errorMsg}>{error}</p>
          <p className={styles.errorHint}>{t('vault.error_hint')}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {paginated.length === 0 ? (
            <div className={styles.statusBox}>
              <p>{t('vault.no_results')}</p>
            </div>
          ) : (
            <div className={styles.gallery}>
              {paginated.map(prompt => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  copied={copied === prompt.id}
                  expanded={expanded === prompt.id}
                  onCopy={() => handleCopy(prompt.id, prompt.prompt)}
                  onToggleExpand={() => setExpanded(p => p === prompt.id ? null : prompt.id)}
                  copyLabel={t('vault.copy_btn')}
                  copiedLabel={t('vault.copied')}
                  showMoreLabel={t('vault.show_more')}
                  showLessLabel={t('vault.show_less')}
                />
              ))}
            </div>
          )}

          {hasMore && (
            <div className={styles.loadMoreRow}>
              <button
                className="btn btn-ghost"
                onClick={() => setPage(p => p + 1)}
              >
                {t('vault.load_more')} ({filtered.length - paginated.length} {t('vault.more_items')})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function PromptCard({ prompt, copied, expanded, onCopy, onToggleExpand, copyLabel, copiedLabel, showMoreLabel, showLessLabel }) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const hasImage = prompt.imageUrls.length > 0 && !imgError

  const truncated = prompt.prompt.length > 180
  const displayText = expanded || !truncated
    ? prompt.prompt
    : prompt.prompt.slice(0, 180) + '…'

  function fmtNum(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000)    return (n / 1000).toFixed(1) + 'K'
    return String(n)
  }

  return (
    <div className={styles.card}>
      {hasImage && (
        <div className={`${styles.imgWrap} ${imgLoaded ? styles.imgLoaded : ''}`}>
          <img
            src={prompt.imageUrls[0]}
            alt=""
            className={styles.img}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        </div>
      )}

      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          {prompt.author && (
            <span className={styles.cardAuthor}>@{prompt.author.replace('@', '')}</span>
          )}
          {prompt.likes > 0 && (
            <span className={styles.cardStat} title="Likes">
              <HeartIcon />{fmtNum(prompt.likes)}
            </span>
          )}
          {prompt.views > 0 && (
            <span className={styles.cardStat} title="Views">
              <EyeIcon />{fmtNum(prompt.views)}
            </span>
          )}
          {prompt.model && (
            <span className={styles.cardModel}>{prompt.model}</span>
          )}
        </div>

        <p className={styles.cardText}>{displayText}</p>

        {truncated && (
          <button className={styles.expandBtn} onClick={onToggleExpand}>
            {expanded ? showLessLabel : showMoreLabel}
          </button>
        )}

        {prompt.categories.filter(c => c !== 'Other').length > 0 && (
          <div className={styles.cardCats}>
            {prompt.categories.filter(c => c !== 'Other').map(c => (
              <span key={c} className={styles.cardCat}>{c}</span>
            ))}
          </div>
        )}

        <div className={styles.cardActions}>
          <button
            className={`btn btn-primary btn-sm ${styles.copyBtn}`}
            onClick={onCopy}
          >
            <CopyIcon />
            {copied ? copiedLabel : copyLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0, color: 'var(--t-2)' }}>
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
