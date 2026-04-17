import { createContext, useContext, useState, useCallback } from 'react'
import pagesConfig from '../config/pages.config.json'

const allPages = [...pagesConfig.pages, ...(pagesConfig.utilPages || [])]

const PageMetaContext = createContext(null)

export function PageMetaProvider({ activePage, children }) {
  const [override, setOverride] = useState(null)

  const page = allPages.find(p => p.id === activePage)
  const defaultTitle = page?.tooltip?.title || page?.label || ''
  const defaultSubtitle = ''

  const title = override?.title ?? defaultTitle
  const subtitle = override?.subtitle ?? defaultSubtitle

  const setPageMeta = useCallback((meta) => {
    setOverride(meta)
  }, [])

  const clearPageMeta = useCallback(() => {
    setOverride(null)
  }, [])

  return (
    <PageMetaContext.Provider value={{ title, subtitle, setPageMeta, clearPageMeta }}>
      {children}
    </PageMetaContext.Provider>
  )
}

export function usePageMeta() {
  const ctx = useContext(PageMetaContext)
  if (!ctx) throw new Error('usePageMeta must be used within PageMetaProvider')
  return ctx
}
