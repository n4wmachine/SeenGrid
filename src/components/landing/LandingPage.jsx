import Masthead from './Masthead.jsx'
import DiscoverStrip from './DiscoverStrip.jsx'
import ContinueStrip from './ContinueStrip.jsx'
import QuickStartBar from './QuickStartBar.jsx'
import styles from './LandingPage.module.css'

// Landing-Page = schlanker Container fuer vier Sub-Sections.
// Reihenfolge gemaess Landing-Redesign Slice: Masthead (editorial),
// dann Discover als visueller Anker, dann Continue, dann Quick Start.
// Ziel: alle Sections above the fold auf 1080p/1440p.
// Shell-Header wird auf Home in App.jsx unterdrueckt — der Masthead
// ist die einzige Kopfzeile dieser Page.
export default function LandingPage({ onNavigate }) {
  return (
    <div className={styles.page}>
      <Masthead />
      <DiscoverStrip />
      <ContinueStrip onNavigate={onNavigate} />
      <QuickStartBar onNavigate={onNavigate} />
    </div>
  )
}
