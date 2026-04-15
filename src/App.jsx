import React, { useState, Suspense, lazy } from 'react'
import Header from './components/layout/Header.jsx'
import { useLang } from './context/LangContext.jsx'
import './App.css'

const PromptBuilder = lazy(() => import('./components/PromptBuilder.jsx'))
const GridOperator = lazy(() => import('./components/GridOperator.jsx'))
const MJStartframe = lazy(() => import('./components/MJStartframe.jsx'))
const PromptVault = lazy(() => import('./components/PromptVault.jsx'))
// Slice 3 throwaway POC. Entry will be removed once the real Custom Builder
// moves into src/components/GridOperator/CustomBuilder.jsx after the visual
// overhaul. See SESSION_LOG.md 2026-04-15 Slice 3 entry.
const CustomBuilderPoc = lazy(() => import('./components/CustomBuilderPoc.jsx'))

const TAB_DOTS = {
  builder: '#e8a624',
  grid:    '#5c9fc4',
  mj:      '#c9a040',
  vault:   '#4aab7a',
  poc:     '#d46bbf',
}

export default function App() {
  const [activeTab, setActiveTab] = useState('builder')
  const { t } = useLang()

  const TABS = [
    { id: 'builder', label: t('tabs.builder.label'), dot: TAB_DOTS.builder, desc: t('tabs.builder.desc') },
    { id: 'grid',    label: t('tabs.grid.label'),    dot: TAB_DOTS.grid,    desc: t('tabs.grid.desc') },
    { id: 'mj',      label: t('tabs.mj.label'),      dot: TAB_DOTS.mj,      desc: t('tabs.mj.desc') },
    { id: 'vault',   label: t('tabs.vault.label'),   dot: TAB_DOTS.vault,   desc: t('tabs.vault.desc') },
    // Slice 3 throwaway POC tab — bypasses i18n on purpose so the temp
    // label is clearly distinguishable from the real tabs.
    { id: 'poc',     label: 'POC (S3)',               dot: TAB_DOTS.poc,     desc: 'Custom Builder POC — Slice 3 throwaway' },
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
          {activeTab === 'poc'    && <CustomBuilderPoc />}
        </Suspense>
      </main>
    </div>
  )
}
