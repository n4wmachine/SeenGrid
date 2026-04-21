/**
 * Module-Emit-Registry (Spec §7 + Slice 5)
 *
 * Map moduleId → emitFreeMode(state, panel?) für die 5 v1-universellen
 * Module. Andere Module aus modules.config.json haben emitPath: null
 * — der Free-Mode-Compiler emittiert für sie einen TODO-Placeholder
 * unter modules_extra wenn der User sie aktiviert.
 *
 * Jeder Helper folgt der gleichen API:
 *   emitFreeMode(state, panel?) → block | null
 *
 *   - Globals-Aufruf: ohne `panel`. Liefert Top-Level-Block oder null.
 *   - Per-Panel-Aufruf: mit `panel`. Liefert Panel-Wert oder null.
 */

import { emitFreeMode as styleOverlayEmit } from "./style_overlay/emit.js";
import { emitFreeMode as environmentEmit } from "./environment_mode/emit.js";
import { emitFreeMode as forbiddenEmit } from "./forbidden_elements_user/emit.js";
import { emitFreeMode as panelContentEmit } from "./panel_content_fields/emit.js";
import { emitFreeMode as randomFillEmit } from "./random_fill/emit.js";

const REGISTRY = {
  style_overlay: styleOverlayEmit,
  environment_mode: environmentEmit,
  forbidden_elements_user: forbiddenEmit,
  panel_content_fields: panelContentEmit,
  random_fill: randomFillEmit,
};

export function getEmitter(moduleId) {
  return REGISTRY[moduleId] ?? null;
}

export function hasEmitter(moduleId) {
  return Object.prototype.hasOwnProperty.call(REGISTRY, moduleId);
}

export function listEmitterIds() {
  return Object.keys(REGISTRY);
}
