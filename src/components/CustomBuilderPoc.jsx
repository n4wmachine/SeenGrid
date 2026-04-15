/**
 * CustomBuilderPoc — Slice 3 Throwaway UI
 *
 * WICHTIG: Dies ist KEINE finale Komponente. Sie ist bewusst Throwaway:
 * nackter Funktionsbeweis dass der Slice-2-Compiler von einem echten React
 * State-Holder angetrieben werden kann. Kein Polish, kein Design, keine
 * i18n, keine SVG-Preview.
 *
 * Die Zieladresse für den echten Custom Builder ist per BUILD_PLAN §14
 * Slice 3/4 → `src/components/GridOperator/CustomBuilder.jsx`. Der Wechsel
 * dorthin passiert NACH Jonas' Visual Overhaul (eigener Track, nicht
 * Teil dieser Slice-Kette). Bis dahin lebt diese POC-Komponente als
 * temporärer fünfter Tab in `App.jsx`.
 *
 * Was die POC beweisen muss:
 *   1. buildDefaultState() + compileToString() funktionieren im Browser
 *      (nicht nur in Node-Tests).
 *   2. Live-Edits am State produzieren live-updates am JSON-Output.
 *   3. panel_count-Slider, Module-Toggles, Environment-Modi, User-Level-
 *      Forbiddens sind alle als Controls verdrahtet und ändern den Output
 *      sichtbar.
 *   4. Der fertige JSON-String ist per Copy-Button paste-ready.
 *
 * Was die POC NICHT macht:
 *   - Kein LookLab-Browsing, Token-Picker wird nackt als Text-Input gebaut
 *   - Keine SVG-Dummy-Preview der Panels (kommt in einem späteren Slice)
 *   - Keine History, Undo, oder State-Persistence
 *   - Kein Empty-State-Design, keine Onboarding-Texte
 *   - Kein Fokus auf Styling — inline styles gegen die globalen CSS-Vars
 */

import React, { useState, useMemo } from 'react'
import { buildDefaultState } from '../lib/cases/characterAngleStudy/defaults.js'
import { compileToString } from '../lib/compiler/index.js'
import {
  VALID_PANEL_COUNTS,
  ENVIRONMENT_MODES,
} from '../lib/cases/characterAngleStudy/schema.js'
import { isEmpiricallyValidated } from '../lib/cases/characterAngleStudy/panelRoleStrategy.js'

// Inline-Style-Tokens. Bewusst nicht in eine .module.css ausgelagert damit
// beim Wegwerfen der Komponente auch wirklich alles weg ist — kein
// CSS-Fragment das irgendwo hängen bleibt.
const styles = {
  wrap: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '24px',
    padding: '24px',
    height: '100%',
    overflow: 'auto',
    fontFamily: 'var(--sg-font-sans, system-ui)',
    color: 'var(--sg-text-primary, #e6e6e6)',
    background: 'var(--sg-bg-app, #111)',
    boxSizing: 'border-box',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    overflowY: 'auto',
  },
  header: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  subheader: {
    margin: 0,
    fontSize: '11px',
    color: 'var(--sg-text-tertiary, #888)',
    fontFamily: 'var(--sg-font-mono, monospace)',
  },
  warning: {
    padding: '8px 10px',
    fontSize: '11px',
    fontFamily: 'var(--sg-font-mono, monospace)',
    color: '#f6c35c',
    border: '1px solid #6b5020',
    background: 'rgba(246, 195, 92, 0.08)',
    borderRadius: '4px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '12px',
    border: '1px solid var(--sg-border, #2a2a2a)',
    borderRadius: '6px',
    background: 'var(--sg-bg-panel, #181818)',
  },
  sectionTitle: {
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--sg-text-tertiary, #888)',
    fontFamily: 'var(--sg-font-mono, monospace)',
  },
  label: {
    fontSize: '12px',
    color: 'var(--sg-text-secondary, #bbb)',
  },
  control: {
    padding: '6px 8px',
    fontSize: '12px',
    fontFamily: 'var(--sg-font-mono, monospace)',
    background: 'var(--sg-bg-input, #0d0d0d)',
    color: 'var(--sg-text-primary, #e6e6e6)',
    border: '1px solid var(--sg-border, #2a2a2a)',
    borderRadius: '4px',
    outline: 'none',
  },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
  },
  preview: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minHeight: 0,
  },
  previewHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  copyBtn: {
    padding: '6px 12px',
    fontSize: '11px',
    fontFamily: 'var(--sg-font-mono, monospace)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--sg-text-primary, #e6e6e6)',
    background: 'var(--sg-bg-panel, #181818)',
    border: '1px solid var(--sg-border, #2a2a2a)',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  output: {
    flex: 1,
    margin: 0,
    padding: '16px',
    fontSize: '11px',
    lineHeight: 1.5,
    fontFamily: 'var(--sg-font-mono, monospace)',
    color: 'var(--sg-text-primary, #e6e6e6)',
    background: 'var(--sg-bg-input, #0d0d0d)',
    border: '1px solid var(--sg-border, #2a2a2a)',
    borderRadius: '6px',
    overflow: 'auto',
    whiteSpace: 'pre',
  },
  error: {
    color: '#f27272',
    borderColor: '#6a2a2a',
  },
}

export default function CustomBuilderPoc() {
  const [state, setState] = useState(() => buildDefaultState())
  const [copied, setCopied] = useState(false)

  // Immutable partial update helper. structuredClone ist in modernen
  // Browsern überall verfügbar; alle unsere Target-Browser unterstützen es.
  const update = (mutator) => {
    setState((prev) => {
      const next = structuredClone(prev)
      mutator(next)
      return next
    })
  }

  // Compile bei jedem Render. Wenn compile() wirft (z.B. weil ein Control
  // kurzzeitig einen invaliden State produziert), zeigen wir die Fehler-
  // Message statt die React-Tree zu crashen.
  const compiled = useMemo(() => {
    try {
      return { ok: true, output: compileToString(state) }
    } catch (err) {
      return { ok: false, output: err?.message ?? String(err) }
    }
  }, [state])

  const onCopy = async () => {
    if (!compiled.ok) return
    try {
      await navigator.clipboard.writeText(compiled.output)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Ignore clipboard failures in the POC — throwaway UI.
    }
  }

  const onReset = () => {
    setState(buildDefaultState())
  }

  const userLevelText = state.forbidden_elements.user_level.join('\n')
  const panelCount = state.layout.panel_count
  const panelCountValidated = isEmpiricallyValidated(panelCount)

  return (
    <div style={styles.wrap}>
      {/* ---- Controls ------------------------------------------------- */}
      <div style={styles.controls}>
        <div>
          <h2 style={styles.header}>Custom Builder — POC (Slice 3)</h2>
          <p style={styles.subheader}>
            character_angle_study · throwaway ui · wired to src/lib/compiler
          </p>
        </div>

        <div style={styles.warning}>
          Provisorischer fünfter Tab. Finale Zieladresse:
          src/components/GridOperator/CustomBuilder.jsx nach Visual Overhaul.
        </div>

        {/* panel_count */}
        <div style={styles.section}>
          <span style={styles.sectionTitle}>layout.panel_count</span>
          <select
            style={styles.control}
            value={panelCount}
            onChange={(e) =>
              update((n) => {
                n.layout.panel_count = Number(e.target.value)
              })
            }
          >
            {VALID_PANEL_COUNTS.map((c) => (
              <option key={c} value={c}>
                {c} panels
              </option>
            ))}
          </select>
          {!panelCountValidated && (
            <span style={{ ...styles.subheader, color: '#f6c35c' }}>
              ⚠ not empirically validated in NanoBanana
            </span>
          )}
        </div>

        {/* face_reference */}
        <div style={styles.section}>
          <span style={styles.sectionTitle}>references.face_reference</span>
          <label style={styles.checkRow}>
            <input
              type="checkbox"
              checked={state.references.face_reference.enabled}
              onChange={(e) =>
                update((n) => {
                  n.references.face_reference.enabled = e.target.checked
                })
              }
            />
            enabled
          </label>
        </div>

        {/* style_overlay */}
        <div style={styles.section}>
          <span style={styles.sectionTitle}>style_overlay (Look Lab hook)</span>
          <label style={styles.checkRow}>
            <input
              type="checkbox"
              checked={state.style_overlay.enabled}
              onChange={(e) =>
                update((n) => {
                  n.style_overlay.enabled = e.target.checked
                })
              }
            />
            enabled
          </label>
          {state.style_overlay.enabled && (
            <>
              <label style={styles.label}>source</label>
              <input
                style={styles.control}
                type="text"
                value={state.style_overlay.source ?? ''}
                placeholder="look_lab"
                onChange={(e) =>
                  update((n) => {
                    n.style_overlay.source = e.target.value || null
                  })
                }
              />
              <label style={styles.label}>token</label>
              <input
                style={styles.control}
                type="text"
                value={state.style_overlay.token ?? ''}
                placeholder="warm_neon_diner_glow"
                onChange={(e) =>
                  update((n) => {
                    n.style_overlay.token = e.target.value || null
                  })
                }
              />
            </>
          )}
        </div>

        {/* environment */}
        <div style={styles.section}>
          <span style={styles.sectionTitle}>environment</span>
          <label style={styles.checkRow}>
            <input
              type="checkbox"
              checked={state.environment.enabled}
              onChange={(e) =>
                update((n) => {
                  n.environment.enabled = e.target.checked
                })
              }
            />
            enabled
          </label>
          <label style={styles.label}>mode</label>
          <select
            style={styles.control}
            value={state.environment.mode}
            onChange={(e) =>
              update((n) => {
                n.environment.mode = e.target.value
              })
            }
          >
            {ENVIRONMENT_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {state.environment.mode === 'custom_text' && (
            <>
              <label style={styles.label}>custom_text</label>
              <textarea
                style={{ ...styles.control, minHeight: '60px' }}
                value={state.environment.custom_text ?? ''}
                placeholder="misty forest at dawn, shallow fog"
                onChange={(e) =>
                  update((n) => {
                    n.environment.custom_text = e.target.value || null
                  })
                }
              />
            </>
          )}
        </div>

        {/* forbidden_elements.user_level */}
        <div style={styles.section}>
          <span style={styles.sectionTitle}>forbidden_elements.user_level</span>
          <textarea
            style={{ ...styles.control, minHeight: '80px' }}
            value={userLevelText}
            placeholder={'one item per line\ne.g. neon_signs\nrain'}
            onChange={(e) =>
              update((n) => {
                n.forbidden_elements.user_level = e.target.value
                  .split('\n')
                  .map((s) => s.trim())
                  .filter((s) => s.length > 0)
              })
            }
          />
        </div>

        <button
          style={{ ...styles.copyBtn, alignSelf: 'flex-start' }}
          onClick={onReset}
        >
          reset to default
        </button>
      </div>

      {/* ---- Preview -------------------------------------------------- */}
      <div style={styles.preview}>
        <div style={styles.previewHeader}>
          <div>
            <div style={styles.sectionTitle}>compiled prompt-json</div>
            <div style={styles.subheader}>
              {compiled.ok
                ? `${compiled.output.length} chars · paste-ready for NanoBanana`
                : 'compile error'}
            </div>
          </div>
          <button
            style={styles.copyBtn}
            onClick={onCopy}
            disabled={!compiled.ok}
          >
            {copied ? '✓ copied' : 'copy'}
          </button>
        </div>
        <pre
          style={{
            ...styles.output,
            ...(compiled.ok ? {} : styles.error),
          }}
        >
          {compiled.output}
        </pre>
      </div>
    </div>
  )
}
