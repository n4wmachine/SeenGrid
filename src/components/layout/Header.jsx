import React from 'react'
import './Header.css'
import { useLang } from '../../context/LangContext.jsx'

export default function Header({ activeTab, tabs, onTabChange }) {
  const { lang, setLang } = useLang()

  return (
    <header className="header">
      <div className="headerLogo">
        <img
          src={`${import.meta.env.BASE_URL}SGLogo5.png`}
          className="headerLogoIcon"
          alt="SeenGrid"
        />
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
