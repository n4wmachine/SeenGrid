import React from 'react'
import './Header.css'

export default function Header({ activeTab, tabs, onTabChange }) {
  return (
    <header className="sg-header">
      <div className="sg-header__inner">
        {/* Logo */}
        <div className="sg-logo">
          <div className="sg-logo__mark">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="9" fill="#111120"/>
              {/* Film frame border sprockets */}
              <rect x="3" y="3" width="30" height="30" rx="5" stroke="rgba(245,166,35,0.25)" strokeWidth="1"/>
              {/* Grid lines */}
              <line x1="13" y1="3" x2="13" y2="33" stroke="rgba(245,166,35,0.18)" strokeWidth="1"/>
              <line x1="23" y1="3" x2="23" y2="33" stroke="rgba(245,166,35,0.18)" strokeWidth="1"/>
              <line x1="3" y1="13" x2="33" y2="13" stroke="rgba(245,166,35,0.18)" strokeWidth="1"/>
              <line x1="3" y1="23" x2="33" y2="23" stroke="rgba(245,166,35,0.18)" strokeWidth="1"/>
              {/* Center glow */}
              <rect x="14" y="14" width="8" height="8" rx="1.5" fill="rgba(245,166,35,0.80)"/>
              {/* Corner dots */}
              <rect x="4" y="4" width="5" height="5" rx="1" fill="rgba(245,166,35,0.35)"/>
              <rect x="27" y="4" width="5" height="5" rx="1" fill="rgba(245,166,35,0.35)"/>
              <rect x="4" y="27" width="5" height="5" rx="1" fill="rgba(245,166,35,0.35)"/>
              <rect x="27" y="27" width="5" height="5" rx="1" fill="rgba(245,166,35,0.35)"/>
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
              className={`sg-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              title={tab.desc}
            >
              <span
                className="sg-tab__dot"
                style={{ background: tab.dot, boxShadow: `0 0 6px ${tab.dot}88` }}
              />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Version badge */}
        <div className="sg-header__badge">Phase 1</div>
      </div>
    </header>
  )
}
