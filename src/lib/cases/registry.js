/* ============================================================
   CASE REGISTRY — zentrale case-zentrierte Lookup-Schicht.

   Dies ist die EINZIGE Stelle in der UI, an der case-spezifische
   Logik abgefragt wird. Komponenten dürfen NICHT mehr direkt auf
   `caseId === '...'` switchen oder per-Case Schemas inline
   ableiten — alle solchen Pfade gehen über die Helper hier.

   Warum:
   v1 ist case-zentriert (NUANCEN 14, OPEN_DECISIONS #12). Post-v1
   kommt ein Engine-Free-Mode-Refactor. Damit der Refactor die UI
   nicht aufwühlen muss, sind alle case-Abfragen hier zentralisiert
   → der Refactor ersetzt nur diese Datei + ein paar Marker im
   Compiler.

   TODO(free-mode): bei Engine-Free-Mode-Refactor diese Helper auf
   case-loses Schema-File-System umstellen (z.B. runtime-loadable
   panel_fields per Case-Bundle). Nur diese Datei + Compiler
   anfassen, UI-Komponenten bleiben.
   ============================================================ */

import casesConfig from '../../config/cases.config.json'
import modulesConfig from '../../config/modules.config.json'
import {
  panelRoleStrategy,
  SUPPORTED_PANEL_COUNTS,
} from './characterAngleStudy/panelRoleStrategy.js'

/* ---- HARDCODED PANEL_FIELDS SCHEMAS PER CASE ---- */

// Die kanonischen 8 Views für character_angle_study (siehe
// panelRoleStrategy.js). Eine andere Liste an dieser Stelle bricht
// das Silhouette-Mapping (Canvas) und macht Inspector-Selections
// inkonsistent.
const ANGLE_STUDY_VIEWS = [
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
      hint: 'which side the camera looks at — drives the silhouette',
      options: ANGLE_STUDY_VIEWS,
      global_or_panel: 'panel',
    },
  ],
  // TODO(panel-fields-schema-character_sheet): echtes Schema, später
  // TODO(panel-fields-schema-expression_sheet): echtes Schema, später
  // TODO(panel-fields-schema-outfit_variation): echtes Schema, später
  // TODO(panel-fields-schema-world_zone_board): echtes Schema, später
  // TODO(panel-fields-schema-world_angle_study): echtes Schema, später
  // TODO(panel-fields-schema-shot_coverage): echtes Schema, später
  // TODO(panel-fields-schema-story_sequence): echtes Schema, später
  // TODO(panel-fields-schema-start_end_frame): echtes Schema, später
}

/* ---- READ HELPERS (alle Komponenten gehen hier durch) ---- */

/**
 * Schema des Cases. Leeres Array wenn kein Schema vorhanden →
 * Komponenten erkennen daran "Fallback-Pfad".
 */
export function getPanelFieldsSchema(caseId) {
  if (!caseId) return []
  return PANEL_FIELDS_BY_CASE[caseId] || []
}

export function hasRealSchema(caseId) {
  return getPanelFieldsSchema(caseId).length > 0
}

/**
 * v1-aktive Cases (im Picker klickbar). Rest ist disabled +
 * `coming soon` (OPEN_DECISIONS #13, NUANCEN 15).
 */
export function isCaseActive(caseId) {
  return caseId === 'character_angle_study'
}

/**
 * Default-Rollen für panelCount Panels in diesem Case.
 * Für angle_study: kanonische Strategy. Für andere Cases: was in
 * cases.config.json steht (Papier-Cases, v1 nicht aktiv).
 */
export function getDefaultRolesForCase(caseId, panelCount) {
  if (
    caseId === 'character_angle_study' &&
    SUPPORTED_PANEL_COUNTS.includes(panelCount)
  ) {
    return panelRoleStrategy(panelCount).map(r => r.view)
  }
  const caseDef = casesConfig.cases.find(c => c.id === caseId)
  if (!caseDef?.defaultRoles) return []
  return Array.from({ length: panelCount }, (_, i) => caseDef.defaultRoles[i] || null)
}

/**
 * Strategy-Default für ein einzelnes Panel-Index. Liefert null wenn
 * der Case für diesen Panel-Count keinen Default hat.
 */
export function getStrategyDefaultForPanel(caseId, index, totalPanels) {
  if (index < 0 || totalPanels <= 0) return null
  const roles = getDefaultRolesForCase(caseId, totalPanels)
  return roles[index] ?? null
}

/**
 * Liste aller Module die mit caseId pre-aktiviert werden sollen.
 * Liest aus modules.config.json.compatibility.
 */
export function getCompatibleModuleIds(caseId) {
  return modulesConfig.modules
    .filter(m => Array.isArray(m.compatibility) && m.compatibility.includes(caseId))
    .map(m => m.id)
}

/**
 * Per-Panel-Modul-Liste für den Inspector (Per-Panel-Overrides
 * Sektion). Filtert aus den active Modulen die heraus, die für die
 * "per-panel"-Sektion relevant sind.
 *
 * Strict-Coupling: wenn der Case ein **echtes Schema** hat, wird
 * `panel_content_fields` (das generische Catch-All-Textfeld)
 * unterdrückt. Sein Zweck ist explizit der Fallback für Cases
 * **ohne** Schema. (Bug 2 aus Manual-Test Part B: Fallback-Leak.)
 */
export function getPerPanelModulesForCase(caseId, activeModuleIds) {
  const activeSet = new Set(activeModuleIds || [])
  const real = hasRealSchema(caseId)
  return modulesConfig.modules.filter(m => {
    if (!m.hasPerPanelSettings) return false
    if (!activeSet.has(m.id)) return false
    if (real && m.id === 'panel_content_fields') return false
    return true
  })
}

/**
 * Random-Pool-Map für den Random-Button. Mappt Field-ID → Pool-Key
 * für die aktive Case+Module-Konstellation.
 *
 * Strikt: das role-Field aus dem Schema (strict enum) wird NICHT
 * randomized (WORKSPACE_SPEC §11.2). Nur per-Panel-Module mit
 * Random-Pool werden gemappt.
 */
export function getRandomFieldPoolMap(caseId, activeModuleIds) {
  const map = {}
  const perPanel = getPerPanelModulesForCase(caseId, activeModuleIds)
  for (const mod of perPanel) {
    map[mod.id] = mod.id
  }
  return map
}
