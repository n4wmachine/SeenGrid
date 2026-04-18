import React, { useState, Suspense, lazy, useEffect } from 'react'
import Header from './components/layout/Header.jsx'
import Rail from './components/shell/Rail.jsx'
import ShellHeader from './components/shell/ShellHeader.jsx'
import StatusBar from './components/shell/StatusBar.jsx'
import ComingSoon from './components/shell/ComingSoon.jsx'
import LandingPage from './components/landing/LandingPage.jsx'
import GridCreator from './components/gridcreator/GridCreator.jsx'
import { PageMetaProvider, usePageMeta } from './context/PageMetaContext.jsx'
import { useLang } from './context/LangContext.jsx'
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
    onPageChange(pageId)
    if (pageId in PAGE_TO_TAB && PAGE_TO_TAB[pageId]) {
      setActiveTab(PAGE_TO_TAB[pageId])
    }
  }

  const showLegacyContent = activePage in PAGE_TO_TAB && PAGE_TO_TAB[activePage] !== null
  const showComingSoon = COMING_PAGES.has(activePage)
  const showHome = activePage === 'home'
  const showGridCreator = activePage === 'grid'

  return (
    <div className="app-shell sg2-shell">
      <Rail activePage={activePage} onPageChange={handlePageChange} />
      <div className="app-content">
        <ShellHeader />
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
        {showGridCreator && <GridCreator />}
        {showComingSoon && <ComingSoon pageId={activePage} />}
        {showHome && <LandingPage onNavigate={handlePageChange} />}
        <StatusBar />
      </div>
    </div>
  )
}

export default function App() {
  const [activePage, setActivePage] = useState('home')

  return (
    <PageMetaProvider activePage={activePage}>
      <AppContent activePage={activePage} onPageChange={setActivePage} />
    </PageMetaProvider>
  )
}
