import React, { createContext, useContext, useState, useCallback } from 'react'
import strings from '../data/i18n.json'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState('de')

  const t = useCallback((key) => {
    return strings[lang]?.[key] ?? strings.de?.[key] ?? key
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
