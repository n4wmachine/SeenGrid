/* ============================================================
   COMPILE WORKSPACE — Adapter Workspace-Store-State → Engine-State
   → Prompt-JSON.

   Der UI-Workspace-Store hat eine flache, UI-zentrierte Shape
   (panels[], activeModules, environmentMode, styleOverlayToken,
   forbiddenElements, …). Die Engine (src/lib/compiler/) erwartet
   eine case-spezifische Shape pro Case (siehe
   characterAngleStudy/defaults.js).

   Dieser Adapter übersetzt das eine ins andere und ruft den
   Compiler. Sein Output ist ein Prompt-JSON-String, fertig zum
   Pasten in NanoBanana.

   v1: nur character_angle_study unterstützt (NUANCEN 15,
   OPEN_DECISIONS #13). Andere Cases liefern einen Stub-Output.

   TODO(free-mode): bei Engine-Free-Mode-Refactor die case-Switch
   hier auf den generischen Pfad umstellen.
   ============================================================ */

import { compile, compileToString } from './compiler/index.js'
import { buildDefaultState } from './cases/characterAngleStudy/defaults.js'

const ANGLE_STUDY = 'character_angle_study'

/**
 * Übersetzt den Workspace-Store-State in eine Engine-State-Shape
 * und ruft den Compiler. Liefert das Prompt-JSON-Objekt.
 *
 * Wirft bei unbekannten Cases — explizit, damit kein still-broken
 * Output entsteht.
 */
export function compileWorkspaceToObject(workspaceState) {
  if (!workspaceState || !workspaceState.selectedCase) {
    return { _empty: true, hint: 'pick a template to start' }
  }
  const caseId = workspaceState.selectedCase
  if (caseId === ANGLE_STUDY) {
    return compile(toAngleStudyEngineState(workspaceState))
  }
  // v1-Fallback für noch nicht im Compiler abgebildete Papier-Cases.
  // Picker hält diese disabled, also ist das eher ein Sicherheitsnetz.
  return {
    _stub: true,
    case: caseId,
    note: 'this case is not yet compilable — coming with case build-out phase',
  }
}

/**
 * Wie compileWorkspaceToObject, aber als deterministischer Paste-
 * Ready-String mit 2-Space-Indent.
 */
export function compileWorkspace(workspaceState) {
  const obj = compileWorkspaceToObject(workspaceState)
  return JSON.stringify(obj, null, 2)
}

/**
 * Backwards-kompatibler Wrapper für Direkt-Use im UI:
 * gibt String + die geparseten Pixel-Größen zurück.
 */
export function compileWorkspaceWithMeta(workspaceState) {
  const obj = compileWorkspaceToObject(workspaceState)
  const text = JSON.stringify(obj, null, 2)
  return { text, obj }
}

/* -------------------- workspace → angle_study engine -------------------- */

/**
 * Mapping vom UI-Workspace-State auf einen character_angle_study-
 * Engine-State. Default-Engine-State liefert das Skelett, der
 * Workspace überschreibt nur die User-relevanten Felder.
 */
function toAngleStudyEngineState(ws) {
  const base = buildDefaultState()

  // panel_count aus rows × cols
  const panelCount = clampToValid(ws.gridDims.rows * ws.gridDims.cols, [3, 4, 6, 8])
  base.layout.panel_count = panelCount
  base.layout.panel_orientation = ws.panelOrientation || base.layout.panel_orientation

  // environment-Modus übersetzen
  base.environment.enabled = true
  switch (ws.environmentMode) {
    case 'inherit':
      base.environment.mode = 'inherit_from_reference'
      base.environment.custom_text = null
      break
    case 'neutral_studio':
      base.environment.mode = 'neutral_studio'
      base.environment.custom_text = null
      break
    case 'custom_text':
      base.environment.mode = 'custom_text'
      base.environment.custom_text = ws.environmentCustomText || ''
      break
    default:
      // bleibt wie buildDefaultState liefert
      break
  }

  // style_overlay
  if (ws.styleOverlayToken && ws.styleOverlayToken.trim()) {
    base.style_overlay = {
      enabled: true,
      source: 'looklab',
      token: ws.styleOverlayToken.trim(),
      ref_id: null,
    }
  } else {
    base.style_overlay = { enabled: false, source: null, token: null, ref_id: null }
  }

  // forbidden_elements user_level
  base.forbidden_elements = {
    ...base.forbidden_elements,
    user_level: Array.isArray(ws.forbiddenElements) ? [...ws.forbiddenElements] : [],
  }

  // Module-Toggles (Engine kennt nur face_reference + style_overlay +
  // environment auf dem character_angle_study-Case).
  const isActive = id => Array.isArray(ws.activeModules) && ws.activeModules.includes(id)
  if (!isActive('face_reference')) {
    if (base.references?.face_reference) {
      base.references.face_reference.enabled = false
    }
  }
  if (!isActive('environment_mode')) {
    base.environment.enabled = false
  }

  return base
}

function clampToValid(n, valid) {
  if (valid.includes(n)) return n
  // pick closest valid count
  let best = valid[0]
  let bestDiff = Math.abs(n - best)
  for (const v of valid) {
    const d = Math.abs(n - v)
    if (d < bestDiff) { best = v; bestDiff = d }
  }
  return best
}
