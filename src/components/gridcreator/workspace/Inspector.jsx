import { useMemo } from 'react'
import {
  useWorkspaceState,
  useWorkspaceActions,
  useSelectedPanel,
} from '../../../lib/workspaceStore.js'
import casesConfig from '../../../config/cases.config.json'
import modulesConfig from '../../../config/modules.config.json'
import signaturesStub from '../../../data/signatures.stub.json'
import {
  panelRoleStrategy,
  SUPPORTED_PANEL_COUNTS,
} from '../../../lib/cases/characterAngleStudy/panelRoleStrategy.js'
import FieldRenderer from './FieldRenderer.jsx'
import styles from './Inspector.module.css'

/**
 * Inspector — 320px Sidebar rechts.
 *
 * Datengetrieben (WORKSPACE_SPEC §13). Keine case-spezifische Logik
 * im Inspector-Body — panel_fields + active-modules-Schema regieren
 * das Rendering.
 *
 * v1-Pragma: nur character_angle_study hat echtes panel_fields-
 * Schema. Andere Cases → Fallback-Schema aus `defaultRoles` des
 * Case-Config (TODO(panel-fields-schema-{caseId}) pro Case).
 */

// v1: panel_fields direkt im Inspector abgelegt, bis echte Case-
// Schema-Files pro Case existieren. Neue Cases → hier erweitern oder
// als Schema-File ablegen (WORKSPACE_SPEC §13.3).
const ANGLE_STUDY_ROLE_OPTIONS = [
  'front',
  'front_right',
  'right_profile',
  'back_right',
  'back',
  'back_left',
  'left_profile',
  'front_left',
]

const PANEL_FIELDS_BY_CASE = {
  character_angle_study: [
    {
      id: 'role',
      type: 'role',
      label: 'role',
      options: ANGLE_STUDY_ROLE_OPTIONS,
      global_or_panel: 'panel',
    },
  ],
  // TODO(panel-fields-schema-character_sheet): echtes Schema
  // TODO(panel-fields-schema-character_normalizer): echtes Schema
  // TODO(panel-fields-schema-expression_sheet): echtes Schema
  // TODO(panel-fields-schema-outfit_variation): echtes Schema
  // TODO(panel-fields-schema-world_zone_board): echtes Schema
  // TODO(panel-fields-schema-world_angle_study): echtes Schema
  // TODO(panel-fields-schema-shot_coverage): echtes Schema
  // TODO(panel-fields-schema-story_sequence): echtes Schema
  // TODO(panel-fields-schema-start_end_frame): echtes Schema
}

export default function Inspector() {
  const state = useWorkspaceState()
  const actions = useWorkspaceActions()
  const panel = useSelectedPanel()

  const panelIndex = useMemo(
    () => (panel ? state.panels.findIndex(p => p.id === panel.id) : -1),
    [panel, state.panels]
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

  const caseId = state.selectedCase
  const panelFields = getPanelFields(caseId)
  const roleField = panelFields.find(f => f.id === 'role' || f.type === 'role')

  const strategyDefault = getStrategyDefaultForPanel(
    caseId,
    panelIndex,
    state.panels.length
  )
  const displayRole = panel.role || strategyDefault

  const perPanelModules = useMemo(
    () =>
      modulesConfig.modules.filter(
        m => m.hasPerPanelSettings && state.activeModules.includes(m.id)
      ),
    [state.activeModules]
  )

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
          <div className={styles.fieldRow}>
            <div className={styles.fieldControl}>
              <FieldRenderer
                field={roleField}
                value={panel.role}
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

      {/* ---- PER-PANEL OVERRIDES (data-driven) ---- */}
      {perPanelModules.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>per-panel overrides</div>
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

      {/* ---- CUSTOM NOTES ---- */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>custom notes</div>
        <textarea
          className={styles.textarea}
          value={panel.customNotes}
          placeholder="panel-specific notes, directions, overrides in prose…"
          onChange={e => actions.setPanelNotes(panel.id, e.target.value)}
        />
      </div>

      {/* ---- RESET FOOTER ---- */}
      <div className={styles.resetFooter}>
        <button
          className={styles.resetFooterBtn}
          onClick={() => actions.resetPanel(panel.id)}
        >
          reset panel to case-default
        </button>
      </div>
    </div>
  )
}

/* -------------------- helpers -------------------- */

function getPanelFields(caseId) {
  if (PANEL_FIELDS_BY_CASE[caseId]) return PANEL_FIELDS_BY_CASE[caseId]
  const caseDef = casesConfig.cases.find(c => c.id === caseId)
  if (caseDef?.defaultRoles?.length) {
    return [
      {
        id: 'role',
        type: 'role',
        label: 'role',
        options: [...new Set(caseDef.defaultRoles)],
        global_or_panel: 'panel',
      },
    ]
  }
  return []
}

function getStrategyDefaultForPanel(caseId, index, totalPanels) {
  if (index < 0) return null
  if (
    caseId === 'character_angle_study' &&
    SUPPORTED_PANEL_COUNTS.includes(totalPanels)
  ) {
    return panelRoleStrategy(totalPanels)[index]?.view ?? null
  }
  const caseDef = casesConfig.cases.find(c => c.id === caseId)
  return caseDef?.defaultRoles?.[index] ?? null
}

function formatLabel(s) {
  return String(s).replace(/_/g, ' ').toLowerCase()
}

/* -------------------- PER-PANEL OVERRIDE FIELD -------------------- */

function PerPanelOverrideField({ mod, value, onChange }) {
  // v1-Pragma: jeder per-Panel-Modul bekommt einen Freitext-Input.
  // Echte field-type-Erkennung kommt mit case-schema-Erweiterung.
  const hasValue = value !== '' && value != null
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
