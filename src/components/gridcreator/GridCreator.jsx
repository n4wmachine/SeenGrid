import { useEffect, useState } from 'react'
import Picker from './picker/Picker.jsx'
import WorkspacePlaceholder from './WorkspacePlaceholder.jsx'
import { usePageMeta } from '../../context/PageMetaContext.jsx'

/**
 * Grid Creator
 * Parent-Komponente mit State-Switch zwischen Picker und Workspace.
 * Der Workspace ist in dieser Phase ein Placeholder — echter Bau
 * erfolgt in der Workspace-Phase (siehe ROADMAP.md).
 *
 * Klick auf eine Picker-Card setzt den Mode auf 'workspace' und
 * übergibt die gewählte Grundlage (Case/Preset/Scratch). Der
 * Placeholder zeigt nur an, dass der Switch funktioniert.
 */
export default function GridCreator() {
  const [mode, setMode] = useState('picker')
  const [selection, setSelection] = useState(null)
  const { setPageMeta } = usePageMeta()

  useEffect(() => {
    if (mode === 'picker') {
      setPageMeta({ title: 'Grid Creator', subtitle: 'choose a template to begin' })
    } else {
      setPageMeta({ title: 'Grid Creator', subtitle: 'workspace · placeholder' })
    }
  }, [mode, setPageMeta])

  function handlePick(pick) {
    setSelection(pick)
    setMode('workspace')
  }

  function handleBackToPicker() {
    setMode('picker')
    setSelection(null)
  }

  if (mode === 'workspace') {
    return <WorkspacePlaceholder selection={selection} onBack={handleBackToPicker} />
  }

  return <Picker onPick={handlePick} />
}
