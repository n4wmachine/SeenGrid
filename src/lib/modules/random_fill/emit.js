/**
 * random_fill — Free-Mode Emit-Helper (Spec §7)
 *
 * Utility-Modul. Hat keinen Output — die Random-Fill-Logik läuft im
 * UI (Workspace-Random-Action), nicht im Compiler. Der Helper exists
 * trotzdem damit der modules_extra-Iterator das Modul kennt und es
 * NICHT als TODO-Placeholder in den Output schiebt.
 */

export function emitFreeMode() {
  return null;
}
