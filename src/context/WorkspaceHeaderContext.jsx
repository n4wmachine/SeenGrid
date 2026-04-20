import { createContext, useContext, useMemo, useState, useCallback } from 'react'

/**
 * WorkspaceHeaderContext
 *
 * Stellt dem ShellHeader die Workspace-spezifischen Slots zur
 * Verfügung — Back-to-Picker-Handler + Projekt-Selektor. Wenn der
 * Context nicht gesetzt ist (Picker, Landing, andere Pages),
 * rendert der ShellHeader wie gehabt. Im Workspace-Mode erscheinen
 * Back-Button + Projekt-Dropdown.
 *
 * Part A legt Plumbing an. Part C verkabelt den tatsächlichen
 * State-Switch in GridCreator.jsx (onBackToPicker) und das
 * Projekt-Selection-Verhalten.
 *
 * TODO(projects-store): currentProjectId + Selection durch echten
 * Projekt-Store ersetzen, sobald Projekt-Feature gebaut ist.
 */

const WorkspaceHeaderContext = createContext(null)

export function WorkspaceHeaderProvider({
  onBackToPicker,
  currentProjectId = null,
  onSelectProject,
  onCreateProject,
  children,
}) {
  const [internalProjectId, setInternalProjectId] = useState(currentProjectId)

  const selectProject = useCallback(
    id => {
      setInternalProjectId(id)
      if (onSelectProject) onSelectProject(id)
    },
    [onSelectProject]
  )

  const value = useMemo(
    () => ({
      workspaceActive: true,
      onBackToPicker: onBackToPicker || null,
      currentProjectId: internalProjectId,
      onSelectProject: selectProject,
      onCreateProject: onCreateProject || null,
    }),
    [onBackToPicker, internalProjectId, selectProject, onCreateProject]
  )

  return (
    <WorkspaceHeaderContext.Provider value={value}>
      {children}
    </WorkspaceHeaderContext.Provider>
  )
}

export function useWorkspaceHeader() {
  return useContext(WorkspaceHeaderContext)
}
