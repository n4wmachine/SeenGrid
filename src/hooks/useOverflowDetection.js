import { useEffect, useState } from 'react'

// Erkennt ob ein scrollbarer Container horizontal ueberlaeuft.
// Wird in horizontalen Card-Strips (Continue, Discover) verwendet,
// um den Gradient-Fade rechts nur dann zu rendern, wenn es
// tatsaechlich was zu scrollen gibt. Ohne Overflow ist der Fade
// irrefuehrend — er signalisiert "scroll fuer mehr", obwohl
// nichts mehr kommt.
//
// Reagiert auf:
//   - initialem Mount (Content-Laenge)
//   - Viewport-Resize (Window-Breite aendert sichtbare Spalten)
//   - DOM-Content-Changes (neue Items, Card-Dim-Aenderungen)
//     ueber ResizeObserver
export default function useOverflowDetection(ref) {
  const [hasOverflow, setHasOverflow] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const check = () => {
      setHasOverflow(node.scrollWidth > node.clientWidth + 1)
    }

    check()

    const observer = new ResizeObserver(check)
    observer.observe(node)
    window.addEventListener('resize', check)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', check)
    }
  }, [ref])

  return hasOverflow
}
