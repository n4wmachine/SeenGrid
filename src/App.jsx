import React, { useState, Suspense, lazy } from 'react'
import Header from './components/layout/Header.jsx'
import './App.css'

const PromptBuilder = lazy(() => import('./components/PromptBuilder.jsx'))
const GridOperator = lazy(() => import('./components/GridOperator.jsx'))
const MJStartframe = lazy(() => import('./components/MJStartframe.jsx'))
const PromptVault = lazy(() => import('./components/PromptVault.jsx'))

const TABS = [
  { id: 'builder',  label: 'Prompt Builder', dot: '#a78bfa', desc: 'NanoBanana-optimiert' },
  { id: 'grid',     label: 'Grid Operator',   dot: '#60a5fa', desc: 'World Boards & Multi-Shot' },
  { id: 'mj',       label: 'MJ Startframe',   dot: '#fbbf24', desc: '5-Element Architektur' },
  { id: 'vault',    label: 'Prompt Vault',     dot: '#34d399', desc: '1500+ Community Prompts' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('builder')

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
