import { useState, useCallback } from 'react'

const STORAGE_KEY = 'sg_favorites'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}

function persist(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) }
  catch { /* quota exceeded */ }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(load)

  const isFavorite = useCallback((id) =>
    favorites.some(f => f.id === String(id)),
  [favorites])

  const toggleFavorite = useCallback((item) => {
    setFavorites(prev => {
      const sid = String(item.id)
      const exists = prev.some(f => f.id === sid)
      const next = exists
        ? prev.filter(f => f.id !== sid)
        : [{ ...item, id: sid, savedAt: Date.now() }, ...prev]
      persist(next)
      return next
    })
  }, [])

  const addFavorite = useCallback((item) => {
    setFavorites(prev => {
      const sid = String(item.id)
      if (prev.some(f => f.id === sid)) return prev
      const next = [{ ...item, id: sid, savedAt: Date.now() }, ...prev]
      persist(next)
      return next
    })
  }, [])

  const removeFavorite = useCallback((id) => {
    setFavorites(prev => {
      const next = prev.filter(f => f.id !== String(id))
      persist(next)
      return next
    })
  }, [])

  return { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite }
}
