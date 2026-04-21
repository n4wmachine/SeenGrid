/**
 * panel_content_fields — Free-Mode Emit-Helper (Spec §7)
 *
 * Per-Panel Modul. Steuert das `content`-Feld in panels[]. Wenn das
 * Modul aktiv ist UND der User für das Panel einen Text eingetragen
 * hat, liefert der Helper den String; sonst null (→ Panel emittiert
 * nur { index }, kein content).
 */

export function emitFreeMode(state, panel) {
  if (!panel) return null;
  const content = typeof panel.content === "string" ? panel.content.trim() : "";
  return content.length === 0 ? null : panel.content;
}
