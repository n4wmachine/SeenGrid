/**
 * environment_mode — Free-Mode Emit-Helper (Spec §7)
 *
 * Globals-only im v1. Emittiert den Top-Level `environment`-Block im
 * Free-Mode-Output, sobald das Modul aktiv ist UND env.enabled ist.
 */

export function emitFreeMode(state) {
  const env = state.environment;
  if (!env || !env.enabled) return null;

  const block = { mode: env.mode };
  if (env.mode === "custom_text" && env.custom_text) {
    block.custom_text = env.custom_text;
  }
  return block;
}
