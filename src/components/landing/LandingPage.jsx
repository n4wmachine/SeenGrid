import Masthead from './Masthead.jsx'
import CreateZone from './CreateZone.jsx'
import ContinueStrip from './ContinueStrip.jsx'
import ClassicsStrip from './ClassicsStrip.jsx'
import TrendyStrip from './TrendyStrip.jsx'
import styles from './LandingPage.module.css'

// Landing-Page = schlanker Container fuer die Sub-Sections.
// Reihenfolge (Tool-Logik statt Content-Curator-Logik):
//   Masthead       (editorial chrome)
//   -> Create Zone (Primary: vier Tool-Workspace-Entry-Points)
//   -> Continue    (Wiedereinstieg in Projekte)
//   -> Classics    (Tool-naher Support: kuratierte Grid-Templates,
//                   geometrische Thumbs aus der Picker-Phase)
//   -> Trendy      (Prompt-Hub-Support: trendige Community-Prompts
//                   mit Preview-Bildern, Netflix-Treatment)
// Beide Support-Strips sind Grid-thematisch — Classics ist Struktur
// (wie baut man ein Grid), Trendy ist Output (was andere damit
// gebaut haben). Visueller Kontrast (geometrisch vs fotografisch)
// haelt die Strips auseinander — kein Streaming-Page-Feel.
//
// Shell-Header wird auf Home in App.jsx unterdrueckt — der Masthead
// ist die einzige Kopfzeile dieser Page.
export default function LandingPage({ onNavigate }) {
  return (
    <div className={styles.page}>
      <Masthead />
      <CreateZone />
      <ContinueStrip onNavigate={onNavigate} />
      <ClassicsStrip />
      <TrendyStrip />
    </div>
  )
}
