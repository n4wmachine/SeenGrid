import CaseContext from './CaseContext.jsx'
import Canvas from './Canvas.jsx'
import Inspector from './Inspector.jsx'
import styles from './Workspace.module.css'

/**
 * Workspace
 *
 * 6-Zonen-Stack (WORKSPACE_SPEC §1). ShellHeader + StatusBar liegen
 * außerhalb. Part B füllt Case Context / Canvas / Inspector. Toolbar,
 * Preview-Strip, Signatures-Bar und Output-Bar sind Platzhalter mit
 * korrekter Höhe — Inhalt kommt mit Part C.
 *
 * Erwartet `WorkspaceStoreProvider` + `WorkspaceHeaderProvider` vom
 * Parent (GridCreator.jsx).
 */
export default function Workspace() {
  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <span className={styles.placeholderLabel}>module toolbar · part c</span>
      </div>

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

      <div className={styles.previewStrip}>
        <span className={styles.placeholderLabel}>preview · part c</span>
      </div>
      <div className={styles.sigsBar}>
        <span className={styles.placeholderLabel}>signatures · part c</span>
      </div>
      <div className={styles.outputBar}>
        <span className={styles.placeholderLabel}>output · part c</span>
      </div>
    </div>
  )
}
