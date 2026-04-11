import React from 'react'
import './Header.css'
import { useLang } from '../../context/LangContext.jsx'

export default function Header({ activeTab, tabs, onTabChange }) {
  const { lang, setLang } = useLang()

  return (
    <header className="sg-header">
      <div className="sg-header__inner">

        {/* Logo — SG monogram */}
        <div className="sg-logo">
          <div className="sg-logo__mark">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
              <rect width="34" height="34" rx="5" fill="#0d0d17"/>
              <rect x="0.5" y="0.5" width="33" height="33" rx="4.5" stroke="rgba(232,166,36,0.28)" strokeWidth="1"/>
              <text
                x="17" y="23"
                textAnchor="middle"
                fontFamily="'Space Grotesk', system-ui, sans-serif"
                fontWeight="700"
                fontSize="14.5"
                fill="#e8a624"
                letterSpacing="-0.5"
              >SG</text>
            </svg>
          </div>
          <div className="sg-logo__text">
            <span className="sg-logo__name">SeenGrid</span>
            <span className="sg-logo__sub">AI Film Operator</span>
          </div>
        </div>

        {/* Tab navigation */}
        <nav className="sg-nav" role="tablist">
          {tabs.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`sg-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              title={tab.desc}
            >
              <span className="sg-tab__dot" style={{ background: tab.dot }} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Language toggle */}
        <div className="sg-lang">
          <button
            className={`sg-lang__btn${lang === 'de' ? ' active' : ''}`}
            onClick={() => setLang('de')}
            title="Deutsch"
          >DE</button>
          <button
            className={`sg-lang__btn${lang === 'en' ? ' active' : ''}`}
            onClick={() => setLang('en')
            title="English"
          >EN</button>
        </div>

        {/* Version badge */}
        <div className="sg-header__badge">Phase 1</div>
      </div>
    </header>
  )
}
