import { createContext, useContext, useMemo, useState, useCallback } from 'react'

/**
 * PromptPreviewContext
 *
 * Schmale Brücke zwischen einem gerade fokussierten Eingabefeld im
 * Workspace (Inspector, CaseContext, …) und der PromptPreview-Bar.
 *
 * Fields rufen `setAnchor({ key, nth? })` in onFocus und
 * `setAnchor(null)` in onBlur. Die PromptPreview schaut auf den
 * Anchor, sucht die passende Zeile im kompilierten JSON und scrollt
 * + markiert sie teal solange das Feld Fokus hat.
 *
 *   key: der JSON-Key (z.B. "content", "panel_orientation").
 *   nth: 0-indizierte Vorkommens-Nummer (nur wenn der Key mehrfach
 *        vorkommt, z.B. "content" pro Panel → nth = panelIndex).
 *
 * Wenn kein PromptPreviewProvider in der Baum hängt, sind alle
 * Aufrufe no-ops — Field-Komponenten können den Hook also gefahrlos
 * nutzen auch wenn sie in anderen Kontexten gerendert werden.
 */

const NOOP = () => {}

const PromptPreviewContext = createContext({
  anchor: null,
  setAnchor: NOOP,
})

export function PromptPreviewProvider({ children }) {
  const [anchor, setAnchorState] = useState(null)

  const setAnchor = useCallback(next => {
    setAnchorState(next || null)
  }, [])

  const value = useMemo(() => ({ anchor, setAnchor }), [anchor, setAnchor])

  return (
    <PromptPreviewContext.Provider value={value}>
      {children}
    </PromptPreviewContext.Provider>
  )
}

export function usePromptPreview() {
  return useContext(PromptPreviewContext)
}
