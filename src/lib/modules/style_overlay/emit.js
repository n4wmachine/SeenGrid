/**
 * style_overlay — Free-Mode Emit-Helper (Spec §7)
 *
 * Globals-only Modul. Emittiert den Top-Level `style_overlay`-Block
 * im Free-Mode-Output, sobald das Modul aktiv ist UND der Token
 * gesetzt ist. Sonst null (→ Compiler skipped den Slot).
 */

export function emitFreeMode(state) {
  const ov = state.style_overlay;
  if (!ov || !ov.enabled) return null;

  const block = {};
  if (ov.source != null) block.source = ov.source;
  if (ov.token != null) block.token = ov.token;
  if (ov.ref_id != null) block.ref_id = ov.ref_id;
  return Object.keys(block).length === 0 ? null : block;
}
