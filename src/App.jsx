import React, { useState, Suspense, lazy } from 'react'
import Header from './components/layout/Header.jsx'
import Rail from './components/shell/Rail.jsx'
import { useLang } from './context/LangContext.jsx'
import './App.css'

const PromptBuilder = lazy(() => import('./components/PromptBuilder.jsx'))
const GridOperator = lazy(() => import('./components/GridOperator.jsx'))
const MJStartframe = lazy(() => import('./components/MJStartframe.jsx'))
const PromptVault = lazy(() => import('./components/PromptVault.jsx'))
const CustomBuilderPoc = lazy(() => import('./components/CustomBuilderPoc.jsx'))

const TAB_DOTS = {
  builder: '#e8a624',
  grid:    '#5c9fc4',
  mj:      '#c9a040',
  vault:   '#4aab7a',
  poc:     '#d46bbf',
}

const PAGE_TO_TAB = {
  lab:   'builder',
  grid:  'grid',
  frame: 'mj',
  hub:   'vault',
}

export default function App() {
  const [activeTab, setActiveTab] = useState('builder')
  const [activePage, setActivePage] = useState('lab')
  const { t } = useLang()

  const TABS = [
    { id: 'builder', label: t('tabs.builder.label'), dot: TAB_DOTS.builder, desc: t('tabs.builder.desc') },
    { id: 'grid',    label: t('tabs.grid.label'),    dot: TAB_DOTS.grid,    desc: t('tabs.grid.desc') },
    { id: 'mj',      label: t('tabs.mj.label'),      dot: TAB_DOTS.mj,      desc: t('tabs.mj.desc') },
    { id: 'vault',   label: t('tabs.vault.label'),   dot: TAB_DOTS.vault,   desc: t('tabs.vault.desc') },
    { id: 'poc',     label: 'POC (S3)',               dot: TAB_DOTS.poc,     desc: 'Custom Builder POC — Slice 3 throwaway' },
  ]

  function handlePageChange(pageId) {
    setActivePage(pageId)
    const mappedTab = PAGE_TO_TAB[pageId]
    if (mappedTab) setActiveTab(mappedTab)
  }

  return (
    <div className="app-shell sg2-shell">
      <Rail activePage={activePage} onPageChange={handlePageChange} />
      <div className="app-content">
        <Header activeTab={activeTab} tabs={TABS} onTabChange={(tabId) => {
          setActiveTab(tabId)
          const pageMap = { builder: 'lab', grid: 'grid', mj: 'frame', vault: 'hub' }
          if (pageMap[tabId]) setActivePage(pageMap[tabId])
        }} />
        <main className="app-main">
          <Suspense fallback={<div className="tab-loading"><span>Loading…</span></div>}>
            {activeTab === 'builder' && <PromptBuilder />}
            {activeTab === 'grid'    && <GridOperator />}
            {activeTab === 'mj'     && <MJStartframe />}
            {activeTab === 'vault'  && <PromptVault />}
            {activeTab === 'poc'    && <CustomBuilderPoc />}
          </Suspense>
        </main>
      </div>
    </div>
  )
}
