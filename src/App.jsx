import React, { useState, Suspense, lazy, useEffect } from 'react'
import Header from './components/layout/Header.jsx'
import Rail from './components/shell/Rail.jsx'
import ShellHeader from './components/shell/ShellHeader.jsx'
import StatusBar from './components/shell/StatusBar.jsx'
import ComingSoon from './components/shell/ComingSoon.jsx'
import LandingPage from './components/landing/LandingPage.jsx'
import GridCreator from './components/gridcreator/GridCreator.jsx'
import { PageMetaProvider, usePageMeta } from './context/PageMetaContext.jsx'
import { WorkspaceHeaderProvider } from './context/WorkspaceHeaderContext.jsx'
import { useLang } from './context/LangContext.jsx'
import { WorkspaceStoreProvider, useWorkspaceState } from './lib/workspaceStore.js'
import ToastProvider from './components/ui/ToastProvider.jsx'
import './App.css'

const PromptBuilder = lazy(() => import('./components/PromptBuilder.jsx'))
const MJStartframe = lazy(() => import('./components/MJStartframe.jsx'))
const PromptVault = lazy(() => import('./components/PromptVault.jsx'))
const CustomBuilderPoc = lazy(() => import('./components/CustomBuilderPoc.jsx'))

const TAB_DOTS = {
  builder: '#e8a624',
  mj:      '#c9a040',
  vault:   '#4aab7a',
  poc:     '#d46bbf',
}

// Legacy-Pages die weiter ueber den alten Tab-Header laufen.
// Grid ist raus — Grid Creator ist eigene Page hinter dem Rail.
const PAGE_TO_TAB = {
  home:  null,
  lab:   'builder',
  frame: 'mj',
  hub:   'vault',
}

const COMING_PAGES = new Set([
  'film', 'board', 'crop', 'rev', 'kit', 'settings', 'help'
])

function AppContent({ activePage, onPageChange }) {
  const [activeTab, setActiveTab] = useState('builder')
  const { t } = useLang()
  const { clearPageMeta } = usePageMeta()

  // Grid-Mode lebt auf App-Ebene, damit der ShellHeader denselben
  // WorkspaceHeaderProvider sieht wie der Workspace und der Back-
  // Button im Header erscheint. Re-Mount-Check: wenn der Workspace-
  // Store schon einen Case hält (Rail-Wechsel-Persistenz), starten
  // wir direkt im Workspace-Mode.
  const wsState = useWorkspaceState()
  const [gridMode, setGridMode] = useState(wsState.selectedCase ? 'workspace' : 'picker')

  useEffect(() => {
    clearPageMeta()
  }, [activePage, clearPageMeta])

  const TABS = [
    { id: 'builder', label: t('tabs.builder.label'), dot: TAB_DOTS.builder, desc: t('tabs.builder.desc') },
    { id: 'mj',      label: t('tabs.mj.label'),      dot: TAB_DOTS.mj,      desc: t('tabs.mj.desc') },
    { id: 'vault',   label: t('tabs.vault.label'),   dot: TAB_DOTS.vault,   desc: t('tabs.vault.desc') },
    { id: 'poc',     label: 'POC (S3)',               dot: TAB_DOTS.poc,     desc: 'Custom Builder POC — Slice 3 throwaway' },
  ]

  function handlePageChange(pageId) {
    // Rail-Klick auf den gerade aktiven Grid Creator im Workspace-Mode
    // → zurück zum Picker (Workspace-State bleibt dank Store erhalten,
    // User kommt zurück wie er war). Ohne diesen Zweig passiert gar
    // nichts, weil setActivePage denselben Wert bekommt.
    if (pageId === 'grid' && activePage === 'grid' && gridMode === 'workspace') {
      setGridMode('picker')
      return
    }
    onPageChange(pageId)
    if (pageId in PAGE_TO_TAB && PAGE_TO_TAB[pageId]) {
      setActiveTab(PAGE_TO_TAB[pageId])
    }
  }

  function handleGridPick() {
    setGridMode('workspace')
  }

  function handleBackToPicker() {
    // Workspace-State bewusst NICHT zurücksetzen — User kommt zurück,
    // sieht denselben Stand. Reset passiert nur explizit über Picker-
    // Auswahl (setCase wirft den Store).
    setGridMode('picker')
  }

  const showLegacyContent = activePage in PAGE_TO_TAB && PAGE_TO_TAB[activePage] !== null
  const showComingSoon = COMING_PAGES.has(activePage)
  const showHome = activePage === 'home'
  const showGridCreator = activePage === 'grid'
  const workspaceActive = showGridCreator && gridMode === 'workspace'

  // Shell-Header wird auf Home unterdrueckt — der Landing-Masthead
  // uebernimmt dort die Kopfrolle allein (Landing-Redesign Slice,
  // OPEN_DECISIONS #2). Auf allen anderen Pages bleibt der globale
  // ShellHeader die Kopfzeile.
  const showShellHeader = !showHome

  const content = (
    <>
      {showShellHeader && <ShellHeader />}
      {showLegacyContent && (
        <>
          <Header activeTab={activeTab} tabs={TABS} onTabChange={(tabId) => {
            setActiveTab(tabId)
            const pageMap = { builder: 'lab', mj: 'frame', vault: 'hub' }
            if (pageMap[tabId]) onPageChange(pageMap[tabId])
          }} />
          <main className="app-main">
            <Suspense fallback={<div className="tab-loading"><span>Loading…</span></div>}>
              {activeTab === 'builder' && <PromptBuilder />}
              {activeTab === 'mj'     && <MJStartframe />}
              {activeTab === 'vault'  && <PromptVault />}
              {activeTab === 'poc'    && <CustomBuilderPoc />}
            </Suspense>
          </main>
        </>
      )}
      {showGridCreator && (
        <GridCreator mode={gridMode} onPick={handleGridPick} />
      )}
      {showComingSoon && <ComingSoon pageId={activePage} />}
      {showHome && <LandingPage onNavigate={handlePageChange} />}
      <StatusBar />
    </>
  )

  return (
    <div className="app-shell sg2-shell">
      <Rail activePage={activePage} onPageChange={handlePageChange} />
      <div className="app-content">
        {workspaceActive ? (
          <WorkspaceHeaderProvider
            onBackToPicker={handleBackToPicker}
            currentProjectId={null}
          >
            {content}
          </WorkspaceHeaderProvider>
        ) : content}
      </div>
    </div>
  )
}

export default function App() {
  // WorkspaceStoreProvider lebt app-weit, damit Rail-Wechsel den
  // Workspace-State NICHT verwirft (WORKSPACE_SPEC §15.1).
  // ToastProvider gleicher Scope, damit alle Pages Toasts feuern können.
  return (
    <WorkspaceStoreProvider>
      <AppWithPages />
    </WorkspaceStoreProvider>
  )
}

function AppWithPages() {
  const [activePage, setActivePage] = useState('home')
  return (
    <PageMetaProvider activePage={activePage}>
      <ToastProvider>
        <AppContent activePage={activePage} onPageChange={setActivePage} />
      </ToastProvider>
    </PageMetaProvider>
  )
}
