import { useRef, useState } from 'react'
import { usePageMeta } from '../../context/PageMetaContext.jsx'
import { useWorkspaceHeader } from '../../context/WorkspaceHeaderContext.jsx'
import ProjectMenu from './ProjectMenu.jsx'
import projectsStub from '../../data/projects.stub.json'
import styles from './ShellHeader.module.css'

/**
 * ShellHeader
 *
 * Default-Mode (Picker, Landing, andere Pages): zeigt Page-Title +
 * Subtitle aus PageMetaContext.
 *
 * Workspace-Mode (WorkspaceHeaderProvider wraps die Page): zeigt
 *   ← back   grid creator · {projekt-label} ▾
 * mit Back-Button links und Projekt-Dropdown als Inline-Menü
 * (WORKSPACE_SPEC §2.1 + §2.2, NUANCEN 6).
 *
 * Part A: UI + Context-Hook. Part C verkabelt den eigentlichen
 * State-Switch in GridCreator.jsx via WorkspaceHeaderProvider.
 */
export default function ShellHeader() {
  const { title, subtitle } = usePageMeta()
  const workspace = useWorkspaceHeader()
  const [menuOpen, setMenuOpen] = useState(false)
  const anchorRef = useRef(null)

  const inWorkspace = !!workspace?.workspaceActive

  if (inWorkspace) {
    const currentId = workspace.currentProjectId
    const projects = projectsStub.projects || []
    const current = projects.find(p => p.id === currentId)
    const projectLabel = current ? current.name : 'no project'

    return (
      <header className={styles.header}>
        <div className={styles.left}>
          {workspace.onBackToPicker && (
            <button
              type="button"
              className={styles.backBtn}
              onClick={workspace.onBackToPicker}
              aria-label="back to picker"
            >
              ← choose another template
            </button>
          )}
          <div className={styles.pageTitle}>grid creator</div>
          <div className={styles.projectAnchor} ref={anchorRef}>
            <button
              type="button"
              className={styles.projectTrigger}
              onClick={() => setMenuOpen(v => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span className={styles.projectLabel}>{projectLabel}</span>
              <span className={styles.projectCaret} aria-hidden>▾</span>
            </button>
            <ProjectMenu
              open={menuOpen}
              anchorRef={anchorRef}
              projects={projects}
              currentProjectId={currentId}
              onSelectProject={id => workspace.onSelectProject && workspace.onSelectProject(id)}
              onCreateProject={() => workspace.onCreateProject && workspace.onCreateProject()}
              onClose={() => setMenuOpen(false)}
            />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.version}>v0.4.2</div>
          <div className={styles.divider} />
          <div className={styles.avatar}>J</div>
        </div>
      </header>
    )
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.title}>{title}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      <div className={styles.right}>
        <div className={styles.version}>v0.4.2</div>
        <div className={styles.divider} />
        <div className={styles.avatar}>J</div>
      </div>
    </header>
  )
}
