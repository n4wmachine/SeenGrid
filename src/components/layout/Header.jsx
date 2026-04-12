import React from 'react'
import './Header.css'
import { useLang } from '../../context/LangContext.jsx'

function SeenGridMark() {
  return (
    <svg
      className="headerMarkSvg"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 3x3 rounded-square grid — neutral (currentColor) */}
      <g stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinejoin="round">
        <rect x="14" y="14" width="26" height="26" rx="5" />
        <rect x="47" y="14" width="26" height="26" rx="5" />
        <rect x="80" y="14" width="26" height="26" rx="5" />
        <rect x="14" y="47" width="26" height="26" rx="5" />
        <rect x="47" y="47" width="26" height="26" rx="5" />
        <rect x="80" y="47" width="26" height="26" rx="5" />
        <rect x="14" y="80" width="26" height="26" rx="5" />
        <rect x="47" y="80" width="26" height="26" rx="5" />
        <rect x="80" y="80" width="26" height="26" rx="5" />
      </g>

      {/* Center diamond — filled with bg to cut out grid lines behind it */}
      <g transform="rotate(45 60 60)">
        <rect
          x="41"
          y="41"
          width="38"
          height="38"
          rx="4"
          fill="var(--sg-bg-app)"
          stroke="var(--sg-teal)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Eye lens (lemon shape) + iris */}
      <g
        fill="none"
        stroke="var(--sg-teal)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 49 60 Q 60 48 71 60 Q 60 72 49 60 Z" />
      </g>
      <circle cx="60" cy="60" r="3.4" fill="var(--sg-teal)" />
    </svg>
  )
}

export default function Header({ activeTab, tabs, onTabChange }) {
  const { lang, setLang } = useLang()

  return (
    <header className="header">
      <div className="headerLogo" aria-label="SeenGrid">
        <SeenGridMark />
        <span className="headerWordmark">
          Seen<span className="headerWordmarkAccent">Grid</span>
        </span>
      </div>

      <nav className="tabNav" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tabNavItem${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            title={tab.desc}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="headerRight">
        <button
          className="langToggle"
          onClick={() => setLang(lang === 'de' ? 'en' : 'de')}
          title="Sprache wechseln / Switch language"
        >
          {lang === 'de' ? 'DE' : 'EN'}
        </button>
      </div>
    </header>
  )
}
