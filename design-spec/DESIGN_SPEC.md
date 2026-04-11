# SEENGRID DESIGN SPEC — Implementierungs-Anleitung für Sonnet

## WICHTIG
Sonnet trifft KEINE eigenen Design-Entscheidungen. Alles ist in den CSS-Dateien definiert.
Wenn etwas unklar ist: CSS-Datei gilt, nicht Sonnet's Interpretation.

---

## DATEI-ZUORDNUNG

| CSS-Datei | Ersetzt | Notizen |
|---|---|---|
| `theme.css` | `src/styles/theme.css` | Kompletter Ersatz. Alle alten Variablen löschen. |
| `Header.css` | Header-Komponente CSS | Kein CSS Module — globale Klassen. |
| `PromptBuilder.module.css` | `src/components/PromptBuilder.module.css` | Kompletter Ersatz. |
| `GridOperator.module.css` | `src/components/GridOperator.module.css` | Kompletter Ersatz. |
| `MJStartframe.module.css` | `src/components/MJStartframe.module.css` | Kompletter Ersatz. |
| `PromptVault.module.css` | `src/components/PromptVault.module.css` | Kompletter Ersatz. |

---

## JSX-ANPASSUNGEN (Sonnet muss diese Änderungen im JSX machen)

### 1. PROMPT BUILDER — Zwei-Spalten-Layout

Das JSX muss so strukturiert sein:

```jsx
<div className={styles.container}>
  {/* LINKE SPALTE */}
  <div className={styles.leftColumn}>
    {/* Szene/Motiv Textfeld */}
    <div className={styles.sceneInput}>
      <div className={styles.sceneInputLabel}>
        <span>Szene / Motiv</span>
        <span className={styles.sceneInputHint}>Freitext — Sensory Stacking</span>
      </div>
      <textarea className={styles.sceneTextarea} ... />
    </div>

    {/* Alle Chip-Sections */}
    <div className={styles.sectionsWrapper}>
      {sections.map(section => (
        <div className={`${styles.section} ${section.hasActive ? styles.hasActive : ''} ${section.open ? styles.open : ''}`}>
          <div className={styles.sectionHeader} onClick={toggle}>
            <span className={styles.sectionTitle}>{section.name}</span>
            <span className={styles.sectionChevron}>▾</span>
          </div>
          {section.open && (
            <div className={styles.sectionBody}>
              <div className={styles.chipGrid}>
                {section.chips.map(chip => (
                  <button className={`${styles.chip} ${chip.active ? styles.active : ''}`} ...>
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>

  {/* RECHTE SPALTE — Output (sticky) */}
  <div className={styles.rightColumn}>
    <div className={styles.outputControls}>
      <button className="sg-btn-ghost">⟳ Random</button>
      <button className="sg-btn-ghost">↺ Reset</button>
      <button className={`${styles.suffixToggle} ${is8k ? styles.active : ''}`}>● 8K Suffix</button>
    </div>

    <div className={styles.outputLabel}>
      <span>Generierter Prompt</span>
      <span className={styles.charCount}>0 Zeichen</span>
    </div>

    <div className={`${styles.outputBox} ${hasContent ? styles.filled : styles.empty}`}>
      {promptText || "Wähle Optionen links um deinen Prompt zu bauen..."}
    </div>

    <button className={styles.copyButton}>
      📋 In Zwischenablage kopieren
    </button>

    {/* NanoBanana Core Regeln */}
    <div className={styles.rulesBox}>
      <div className={styles.rulesBoxTitle}>NanoBanana Core Regeln</div>
      <ol className={styles.rulesBoxList}>
        <li className={styles.rulesBoxItem} data-index="1.">...</li>
      </ol>
    </div>
  </div>
</div>
```

### 2. GRID OPERATOR — Zwei-Spalten-Layout

```jsx
<div className={styles.container}>
  <div className={styles.controlsColumn}>
    {/* Mode Toggle, Preset List, Grid Size, Layout Chips */}
  </div>
  <div className={styles.previewColumn}>
    <div className={styles.previewPanel}>
      {/* Grid Preview + Grid Cells */}
    </div>
    <div className={styles.gridOutput}>
      {/* Prompt Output */}
    </div>
  </div>
</div>
```

### 3. MJ STARTFRAME — Zwei-Spalten-Layout

```jsx
<div className={styles.container}>
  <div className={styles.builderColumn}>
    {/* Architektur-Box, Shot-Template, Medium-Anker, Felder */}
  </div>
  <div className={styles.outputColumn}>
    {/* Output Controls, Output Box, Copy Button, Anti-Pattern */}
  </div>
</div>
```

### 4. PROMPT VAULT — Vollbreite mit Card-Grid

```jsx
<div className={styles.container}>
  <div className={styles.vaultHeader}>...</div>
  <div className={styles.filterBar}>
    <input className={styles.searchInput} ... />
    <div className={styles.sortGroup}>...</div>
  </div>
  <div className={styles.categoryChips}>
    {/* Kategorie-Chips, gleiche .chip Klasse wie überall */}
  </div>
  <div className={styles.cardGrid}>
    {/* Cards */}
  </div>
</div>
```

---

## CHIP STYLES — Gelten überall

ECKIG (border-radius: 4px), NICHT pillenförmig.

Chips verwenden in ALLEN Tabs dieselben CSS-Variablen:
- `--sg-chip-bg`, `--sg-chip-border`, `--sg-chip-text` (default)
- `--sg-chip-bg-hover`, `--sg-chip-border-hover`, `--sg-chip-text-hover` (hover)
- `--sg-chip-bg-active`, `--sg-chip-border-active`, `--sg-chip-text-active` (selected)

Wenn der Chip NICHT in einem CSS Module liegt sondern global gebraucht wird,
diese Klasse in theme.css einfügen oder als shared module exportieren.

---

## HEADER — JSX-Struktur

```jsx
<header className="header">
  <div className="headerLogo">
    <img src="/SGLogo5-icon.png" className="headerLogoIcon" alt="SG" />
    <span className="headerLogoText">Seen<span>Grid</span></span>
    <span className="headerSubtitle">AI Film Operator</span>
  </div>

  <nav className="tabNav">
    {tabs.map(tab => (
      <button className={`tabNavItem ${tab.active ? 'active' : ''}`}>
        {tab.name}
      </button>
    ))}
  </nav>

  <div className="headerRight">
    <button className="langToggle">DE / EN</button>
    <span className="phaseBadge">Phase 1</span>
  </div>
</header>
```

---

## TYPOGRAPHIE-REGELN

| Element | Font | Größe | Weight | Transform |
|---|---|---|---|---|
| Section-Labels | JetBrains Mono | 11px (text-xs) | 500 | UPPERCASE, letter-spacing: 0.14em |
| Chip-Text | Space Grotesk | 12px (text-sm) | 400 (500 active) | normal |
| Prompt-Output | JetBrains Mono | 12px (text-sm) | 400 | normal |
| Body-Text | Space Grotesk | 13px (text-base) | 400 | normal |
| Tab-Labels | JetBrains Mono | 11px (text-xs) | 400 (500 active) | UPPERCASE, letter-spacing: 0.12em |
| Button-Labels | JetBrains Mono | 12px (text-sm) | 500 | UPPERCASE, letter-spacing: 0.08em |
| Subtitle | JetBrains Mono | 11px (text-xs) | 400 | UPPERCASE, letter-spacing: 0.16em |

---

## FARBREGELN — Was Sonnet NICHT ändern darf

1. Body/Root Background: #050508 / #07070c — NICHT heller
2. Surfaces steigen in 4-5 Hex-Stufen: 0d → 11 → 16 → 1b → 1f
3. Gold (#d4952a) NUR für: aktive Chips, aktive Tabs, Output-Glow, Primary Buttons, Section-Titel wenn aktiv
4. Teal (#2bb5b2) NUR für: Logo-Icon, --sg-info Farbe. NICHT als zweiter UI-Akzent überall
5. KEIN Lila, KEIN Blau als Akzent, KEIN Weiß (#fff) nirgendwo
6. Text-Primary ist #e8e8f0, NICHT #ffffff

---

## LOGO-INTEGRATION

1. SGLogo5.png Icon (Grid+Auge) extrahieren als separates Icon-File (28x28 im Header)
2. Alternativ: das komplette SGLogo5.png auf 28px Höhe skaliert als headerLogoIcon verwenden
3. Der Text "SeenGrid" wird per HTML/CSS gesetzt, NICHT als Bild
