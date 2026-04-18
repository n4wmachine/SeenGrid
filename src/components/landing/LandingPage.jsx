import Masthead from './Masthead.jsx'
import CreateZone from './CreateZone.jsx'
import ContinueStrip from './ContinueStrip.jsx'
import DiscoverStrip from './DiscoverStrip.jsx'
import styles from './LandingPage.module.css'

// Landing-Page = schlanker Container fuer vier Sub-Sections.
// Reihenfolge (Tool-Logik statt Content-Curator-Logik):
//   Masthead (editorial chrome)
//   -> Create Zone (Primary: vier Tool-Workspace-Entry-Points)
//   -> Continue (Wiedereinstieg in Projekte)
//   -> Discover (kompakter Support-Scroll-Strip)
// Shell-Header wird auf Home in App.jsx unterdrueckt — der Masthead
// ist die einzige Kopfzeile dieser Page.
export default function LandingPage({ onNavigate }) {
  return (
    <div className={styles.page}>
      <Masthead />
      <CreateZone />
      <ContinueStrip onNavigate={onNavigate} />
      <DiscoverStrip />
    </div>
  )
}
