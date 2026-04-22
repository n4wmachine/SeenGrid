import { useMemo } from 'react'
import {
  useWorkspaceState,
  useWorkspaceActions,
  useSelectedPanel,
} from '../../../lib/workspaceStore.js'
import signaturesStub from '../../../data/signatures.stub.json'
import {
  getPanelFieldsSchema,
  getPerPanelModulesForCase,
  getStrategyDefaultForPanel,
  hasRealSchema,
} from '../../../lib/cases/registry.js'
import { usePromptPreview } from '../../../context/PromptPreviewContext.jsx'
import FieldRenderer from './FieldRenderer.jsx'
import styles from './Inspector.module.css'

/**
 * Inspector — 320px Sidebar rechts.
 *
 * Datengetrieben (WORKSPACE_SPEC §13). Keine case-spezifische Logik
 * im Body — alle case-Lookups laufen über lib/cases/registry.js
 * (TODO(free-mode)-Anchor).
 *
 * Fallback-Pfad (generisches Custom-Notes-Textfeld pro Panel) ist
 * **strikt** an "Case hat kein echtes Schema" gekoppelt — nicht an
 * eine generische Modul-Aktivierung. Damit bleibt der Inspector bei
 * angle_study sauber (Bug 2 aus Manual-Test Part B).
 */
export default function Inspector() {
  const state = useWorkspaceState()
  const actions = useWorkspaceActions()
  const panel = useSelectedPanel()
  const { setAnchor } = usePromptPreview()

  const panelIndex = useMemo(
    () => (panel ? state.panels.findIndex(p => p.id === panel.id) : -1),
    [panel, state.panels]
  )

  const caseId = state.selectedCase
  const panelFields = useMemo(() => getPanelFieldsSchema(caseId), [caseId])
  const roleField = panelFields.find(f => f.id === 'role' || f.type === 'role')
  const realSchema = hasRealSchema(caseId)

  const perPanelModules = useMemo(
    () => getPerPanelModulesForCase(caseId, state.activeModules),
    [caseId, state.activeModules]
  )

  if (!panel) {
    return (
      <div className={styles.root}>
        <div className={styles.empty}>
          no panel selected — click a panel to edit
        </div>
      </div>
    )
  }

  const strategyDefault = getStrategyDefaultForPanel(
    caseId,
    panelIndex,
    state.panels.length
  )
  const displayRole = panel.role || strategyDefault

  const signature = panel.signatureId
    ? signaturesStub.signatures.find(s => s.id === panel.signatureId) || null
    : null

  function handleRoleChange(val) {
    actions.setPanelRole(panel.id, val)
  }
  function handleResetRole() {
    actions.setPanelRole(panel.id, strategyDefault || null)
  }

  return (
    <div className={styles.root}>
      {/* ---- HEADER ---- */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerTitle}>panel {panelIndex + 1}</div>
          {displayRole && (
            <div className={styles.headerHint}>· {formatLabel(displayRole)}</div>
          )}
        </div>
        <button
          className={styles.closeBtn}
          onClick={() => actions.selectPanel(null)}
          aria-label="Close inspector"
          title="deselect panel"
        >
          ×
        </button>
      </div>

      {/* ---- ROLE ---- */}
      {roleField && (
        <div className={styles.section}>
          <div className={styles.sectionLabelRow}>
            <span className={styles.sectionLabel}>{roleField.label}</span>
            {strategyDefault && panel.role && panel.role !== strategyDefault && (
              <span className={styles.overrideBadge}>overriding global</span>
            )}
          </div>
          {roleField.hint && (
            <div className={styles.fieldHint} title={roleField.hint}>
              {roleField.hint}
            </div>
          )}
          <div className={styles.fieldRow}>
            <div className={styles.fieldControl}>
              <FieldRenderer
                field={roleField}
                value={panel.role || strategyDefault || ''}
                onChange={handleRoleChange}
              />
            </div>
            {strategyDefault && panel.role && panel.role !== strategyDefault && (
              <button
                className={styles.resetLink}
                onClick={handleResetRole}
                title="reset to global default"
              >
                ↶
              </button>
            )}
          </div>
        </div>
      )}

      {/* ---- PER-PANEL OVERRIDES (data-driven via registry) ---- */}
      {perPanelModules.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>per-panel overrides</div>
          <div className={styles.fieldHint}>
            override this panel only — leave empty to inherit global
          </div>
          {perPanelModules.map(mod => (
            <PerPanelOverrideField
              key={mod.id}
              mod={mod}
              value={panel.overrides[mod.id] ?? ''}
              onChange={val => {
                if (val === '' || val == null) {
                  actions.clearPanelOverride(panel.id, mod.id)
                } else {
                  actions.setPanelOverride(panel.id, mod.id, val)
                }
              }}
            />
          ))}
        </div>
      )}

      {/* ---- SIGNATURE ---- */}
      {signature && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>signature</div>
          <div
            className={styles.sigCard}
            onClick={() => {
              /* TODO(looklab-jump): später Signature in LookLab öffnen */
            }}
            role="button"
            tabIndex={0}
            title="click to open in LookLab (coming)"
          >
            <div className={styles.sigTop}>
              <span className={styles.sigStar}>★</span>
              <span
                className={styles.sigSwatch}
                style={{ background: signature.swatchColor }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span className={styles.sigName}>{signature.name}</span>
                {signature.tagline && (
                  <span className={styles.sigTagline}>{signature.tagline}</span>
                )}
              </div>
            </div>
            <button
              className={styles.sigDetach}
              onClick={e => {
                e.stopPropagation()
                actions.detachSignatureFromPanel(panel.id)
              }}
            >
              detach
            </button>
          </div>
        </div>
      )}

      {/* ---- PANEL CONTENT (fallback-only, see Bug 2 fix) ---- */}
      {!realSchema && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>panel content</div>
          <div className={styles.fieldHint}>
            describe what this panel shows · this case has no structured roles yet
          </div>
          <textarea
            className={styles.textarea}
            value={panel.overrides.panel_content ?? ''}
            placeholder="e.g. wide shot of the laundromat, harsh fluorescent overhead"
            title="case has no panel-fields schema yet — free text describes this panel"
            onFocus={() => setAnchor({ key: 'content', nth: panelIndex })}
            onBlur={() => setAnchor(null)}
            onChange={e => {
              const v = e.target.value
              if (v === '') actions.clearPanelOverride(panel.id, 'panel_content')
              else actions.setPanelOverride(panel.id, 'panel_content', v)
            }}
          />
        </div>
      )}

      {/* ---- CUSTOM NOTES ---- */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>custom notes</div>
        <div className={styles.fieldHint}>
          extra prose for this panel · directions, references, edge cases
        </div>
        <textarea
          className={styles.textarea}
          value={panel.customNotes}
          placeholder="panel-specific notes, directions, overrides in prose…"
          title="free-text notes appended to this panel in the prompt output"
          onChange={e => actions.setPanelNotes(panel.id, e.target.value)}
        />
      </div>

      {/* ---- RESET FOOTER ---- */}
      <div className={styles.resetFooter}>
        <button
          className={styles.resetFooterBtn}
          onClick={() => actions.resetPanel(panel.id)}
          title="clear all overrides + notes + signature on this panel"
        >
          reset panel to case-default
        </button>
      </div>
    </div>
  )
}

/* -------------------- helpers -------------------- */

function formatLabel(s) {
  return String(s).replace(/_/g, ' ').toLowerCase()
}

/* -------------------- PER-PANEL OVERRIDE FIELD -------------------- */

function PerPanelOverrideField({ mod, value, onChange }) {
  // v1-Pragma: jeder per-Panel-Modul bekommt einen Freitext-Input.
  // Echte field-type-Erkennung kommt mit case-schema-Erweiterung
  // (TODO(panel-fields-schema-…) im registry.js).
  const hasValue = value !== '' && value != null
  const hint = `override ${mod.displayName} only on this panel`
  return (
    <div>
      <div className={styles.sectionLabelRow} style={{ marginBottom: 4 }}>
        <span className={styles.headerHint}>{mod.displayName}</span>
        {hasValue && <span className={styles.overrideBadge}>overriding global</span>}
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.fieldControl}>
          <FieldRenderer
            field={{ type: 'text', label: mod.displayName }}
            value={value}
            onChange={onChange}
            placeholder={`per-panel ${mod.displayName}`}
            title={hint}
          />
        </div>
        {hasValue && (
          <button
            className={styles.resetLink}
            onClick={() => onChange('')}
            title="clear override"
          >
            ↶
          </button>
        )}
      </div>
    </div>
  )
}
