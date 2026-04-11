import React, { useState, Suspense, lazy } from 'react'
import Header from './components/layout/Header.jsx'
import { useLang } from './context/LangContext.jsx'
import './App.css'

const PromptBuilder = lazy(() => import('./components/PromptBuilder.jsx'))
const GridOperator = lazy(() => import('./components/GridOperator.jsx'))
const MJStartframe = lazy(() => import('./components/MJStartframe.jsx'))
const PromptVault = lazy(() => import('./components/PromptVault.jsx'))

const TAB_DOTS = {
  builder: '#e8a624',
  grid:    '#5c9fc4',
  mj:      '#c9a040',
  vault:   '#4aab7a',
}

export default function App() {
  const [activeTab, setActiveTab] = useState('builder')
  const { t } = useLang()

  const TABS = [
    { id: 'builder', label: t('tabs.builder.label'), dot: TAB_DOTS.builder, desc: t('tabs.builder.desc') },
    { id: 'grid',    label: t('tabs.grid.label'),    dot: TAB_DOTS.grid,    desc: t('tabs.grid.desc') },
    { id: 'mj',      label: t('tabs.mj.label'),      dot: TAB_DOTS.mj,      desc: t('tabs.mj.desc') },
    { id: 'vault',   label: t('tabs.vault.label'),   dot: TAB_DOTS.vault,   desc: t('tabs.vault.desc') },
  ]

  return (
    <div className="app-shell">
      <Header activeTab={activeTab} tabs={TABS} onTabChange={setActiveTab} />
      <main className="app-main">
        <Suspense fallback={<div className="tab-loading"><span>Loading…</span></div>}>
          {activeTab === 'builder' && <PromptBuilder />}
          {activeTab === 'grid'    && <GridOperator />}
          {activeTab === 'mj'     && <MJStartframe />}
          {activeTab === 'vault'  && <PromptVault />}
        </Suspense>
      </main>
    </div>
  )
}
