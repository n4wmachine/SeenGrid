import CaseContext from './CaseContext.jsx'
import Canvas from './Canvas.jsx'
import Inspector from './Inspector.jsx'
import ModuleToolbar from './ModuleToolbar.jsx'
import PreviewStrip from './PreviewStrip.jsx'
import PromptPreview from './PromptPreview.jsx'
import SignaturesBar from './SignaturesBar.jsx'
import OutputBar from './OutputBar.jsx'
import { PromptPreviewProvider } from '../../../context/PromptPreviewContext.jsx'
import styles from './Workspace.module.css'

/**
 * Workspace
 *
 * 6-Zonen-Stack (WORKSPACE_SPEC §1). ShellHeader + StatusBar liegen
 * außerhalb. Bars sind in Part C live (vorher Platzhalter).
 *
 * Erwartet `WorkspaceStoreProvider` (App.jsx, Rail-Persistenz) +
 * `WorkspaceHeaderProvider` (GridCreator.jsx, Back-Button).
 */
export default function Workspace() {
  return (
    <PromptPreviewProvider>
      <div className={styles.page}>
        <ModuleToolbar />

        <div className={styles.threeCol}>
          <aside className={styles.sideLeft} aria-label="Case context">
            <CaseContext />
          </aside>
          <div className={styles.canvasSlot}>
            <Canvas />
          </div>
          <aside className={styles.sideRight} aria-label="Panel inspector">
            <Inspector />
          </aside>
        </div>

        <PreviewStrip />
        <SignaturesBar />
        <PromptPreview />
        <OutputBar />
      </div>
    </PromptPreviewProvider>
  )
}
