import React, { createContext, useContext, useState, useCallback } from 'react'
import strings from '../data/i18n.json'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  // English is the primary language — audience is primarily english-speaking.
  // German is the secondary translation.
  const [lang, setLang] = useState('en')

  // UI strings from i18n.json
  const t = useCallback((key) => {
    return strings[lang]?.[key] ?? strings.en?.[key] ?? key
  }, [lang])

  // Data strings from JSON files (presets, templates, filmstocks, etc.)
  // Reads obj[`${field}_${lang}`] with fallback chain:
  //   1. Current language field  (e.g. desc_de when lang='de')
  //   2. English field           (e.g. desc_en)
  //   3. Legacy unlocalized field (e.g. desc)  — lets us migrate data files incrementally
  //   4. Empty string            — never crash
  const tData = useCallback((obj, field) => {
    if (!obj || !field) return ''
    return obj[`${field}_${lang}`] ?? obj[`${field}_en`] ?? obj[field] ?? ''
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, setLang, t, tData }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
