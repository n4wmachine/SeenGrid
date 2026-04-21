/**
 * forbidden_elements_user — Free-Mode Emit-Helper (Spec §7)
 *
 * Globals-only Modul. Liefert das deduplizierte user_level Array
 * sobald das Modul aktiv ist UND mindestens ein String drin steht.
 * Sonst null. Im Free-Mode ist case_level immer leer, deshalb ist
 * der Modul-Output identisch mit dem Top-Level forbidden_elements
 * Array.
 */

export function emitFreeMode(state) {
  const fe = state.forbidden_elements ?? {};
  const userLevel = Array.isArray(fe.user_level) ? fe.user_level : [];

  const seen = new Set();
  const out = [];
  for (const item of userLevel) {
    if (typeof item !== "string") continue;
    if (!seen.has(item)) {
      seen.add(item);
      out.push(item);
    }
  }
  return out.length === 0 ? null : out;
}
