import { useEffect, useMemo, useRef, useState } from 'react'
import { useWorkspaceState } from '../../../lib/workspaceStore.js'
import { compileWorkspace } from '../../../lib/compileWorkspace.js'
import { countTokens, isTokenWarning } from '../../../lib/tokenCount.js'
import { usePromptPreview } from '../../../context/PromptPreviewContext.jsx'
import styles from './PromptPreview.module.css'

/**
 * Prompt-Preview-Bar — live-kompiliertes JSON oberhalb der OutputBar.
 *
 * Rendert das JSON zeilenweise, damit zwei Feedback-Mechanismen
 * greifen:
 *
 *   1. Flash-Highlight bei Compile-Change: geänderte Zeilen
 *      leuchten kurz gelb, Auto-Scroll zum ersten Treffer. User
 *      sieht sofort wo sein Edit landet.
 *   2. Focus-Anchor über PromptPreviewContext: fokussierte Felder
 *      markieren "ihre" Zeile teal und scrollen sie ins Blickfeld.
 *      Beim Blur verschwindet die Markierung.
 *
 * Default: expandiert (240px). Kollabiert auf 32px Streifen mit
 * Token-Count + Top-Level-Keys-Peek. Im kollabierten Zustand gibt
 * es keine Line-Highlights (nur das Peek + Token-Count updaten).
 */
export default function PromptPreview() {
  const state = useWorkspaceState()
  const { anchor } = usePromptPreview()
  const [open, setOpen] = useState(true)
  const [flashLines, setFlashLines] = useState(() => new Set())

  const compiled = useMemo(() => compileWorkspace(state), [state])
  const tokens = useMemo(() => countTokens(compiled), [compiled])
  const tokenWarn = isTokenWarning(tokens)
  const peek = useMemo(() => extractPeek(compiled), [compiled])
  const lines = useMemo(() => compiled.split('\n'), [compiled])

  const prevCompiledRef = useRef(compiled)
  const bodyRef = useRef(null)
  const lineRefs = useRef([])
  const flashTimerRef = useRef(null)

  // Diff-Flash bei Compile-Change. Line-by-line compare ist bewusst
  // einfach — Insertions shiften Folgezeilen, das ist akzeptabel
  // (User sieht "da hat sich was gerührt"). Flash-Timer restartet
  // bei jedem Edit, damit Tipp-Sequenzen durchgängig markiert bleiben.
  useEffect(() => {
    const prev = prevCompiledRef.current
    prevCompiledRef.current = compiled
    if (prev === compiled) return

    const prevArr = prev.split('\n')
    const diff = new Set()
    const max = Math.max(prevArr.length, lines.length)
    for (let i = 0; i < max; i++) {
      if (prevArr[i] !== lines[i]) diff.add(i)
    }
    if (diff.size === 0) return

    setFlashLines(diff)
    if (open) {
      const first = Math.min(...diff)
      scrollLineIntoView(bodyRef.current, lineRefs.current[first])
    }
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current)
    flashTimerRef.current = setTimeout(() => {
      setFlashLines(new Set())
      flashTimerRef.current = null
    }, 1500)
  }, [compiled, lines, open])

  // Cleanup beim Unmount
  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current)
    }
  }, [])

  // Focus-Anchor: finde die passende Zeile im aktuellen Compile
  // und scrolle sie ins Blickfeld. Mehrfach vorkommende Keys
  // (z.B. "content" pro Panel) werden per `nth` disambiguiert.
  const anchorLineIndex = useMemo(
    () => resolveAnchorLine(lines, anchor),
    [lines, anchor]
  )

  useEffect(() => {
    if (!open) return
    if (anchorLineIndex < 0) return
    scrollLineIntoView(bodyRef.current, lineRefs.current[anchorLineIndex])
  }, [anchorLineIndex, open])

  return (
    <div className={`${styles.bar} ${open ? styles.open : styles.collapsed}`}>
      <div className={styles.head}>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-label={open ? 'collapse prompt preview' : 'expand prompt preview'}
          title={open ? 'collapse prompt preview' : 'expand prompt preview'}
        >
          <span className={styles.caret} aria-hidden>{open ? '▾' : '▸'}</span>
          <span className={styles.label}>prompt preview</span>
        </button>
        <span className={`${styles.tokens} ${tokenWarn ? styles.tokensWarn : ''}`}>
          ~{tokens} tok
        </span>
        {!open && (
          <span className={styles.peek} title={peek}>
            {peek}
          </span>
        )}
      </div>
      {open && (
        <div className={styles.body} ref={bodyRef}>
          {lines.map((line, i) => {
            const cls = [
              styles.line,
              flashLines.has(i) ? styles.lineFlash : '',
              i === anchorLineIndex ? styles.lineAnchor : '',
            ].filter(Boolean).join(' ')
            return (
              <div
                key={i}
                className={cls}
                ref={el => { lineRefs.current[i] = el }}
              >
                {line || ' '}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* -------------------- helpers -------------------- */

function scrollLineIntoView(container, lineEl) {
  if (!container || !lineEl) return
  // Wir scrollen den Container statt scrollIntoView am Element,
  // damit nicht die ganze Page scrollt sondern nur der Preview-Body.
  const containerRect = container.getBoundingClientRect()
  const lineRect = lineEl.getBoundingClientRect()
  const delta =
    lineRect.top - containerRect.top -
    containerRect.height / 2 + lineRect.height / 2
  container.scrollBy({ top: delta, behavior: 'smooth' })
}

/**
 * Findet die Zeile im JSON die zum Anchor passt. Keys werden als
 * `"<key>":` gesucht (JSON-String-Key-Form), die optional `nth`
 * wählt das Vorkommen (z.B. "content" für Panel 3 → nth=2). Wenn
 * der Key nicht gefunden wird, wird -1 zurückgegeben.
 */
function resolveAnchorLine(lines, anchor) {
  if (!anchor || !anchor.key) return -1
  const needle = `"${anchor.key}":`
  const nth = Number.isInteger(anchor.nth) ? anchor.nth : 0
  const hits = []
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(needle)) hits.push(i)
  }
  if (hits.length === 0) return -1
  // Clamp statt -1: wenn nth über Hits hinaus, nimm den nächstbesten.
  // Wichtig wenn Keys nur für non-empty Werte emittiert werden
  // (z.B. content/notes erscheinen pro Panel nur wenn der User etwas
  // getippt hat). User klickt auf Panel 4 ohne Notes → wir scrollen
  // zur letzten existierenden notes-Zeile, statt gar nicht.
  return hits[Math.min(nth, hits.length - 1)]
}

/**
 * Einzeilige Peek-Zusammenfassung für den kollabierten Zustand.
 */
function extractPeek(jsonString) {
  try {
    const obj = JSON.parse(jsonString)
    if (obj._empty) return obj.hint || 'empty'
    if (obj._stub) return `stub · ${obj.case}`
    const keys = Object.keys(obj)
    return keys.join(' · ')
  } catch {
    return jsonString.slice(0, 60)
  }
}
