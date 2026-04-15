/**
 * panelRoleStrategy — character_angle_study
 *
 * Derived Panel-Role-List pro panel_count. Ersetzt das hardcoded
 * `panels`-Array aus DISTILLATIONS/angle-study-json-example.md
 * (BUILD_PLAN.md §8.1 Gap Fix).
 *
 * Der Compiler (Slice 2) ruft diese Strategy mit `state.layout.panel_count`
 * auf und seriellisiert die zurückgegebene Role-Liste ins `panels`-Feld des
 * Prompt-Outputs, wobei er den 1-indexierten `index` hinzufügt.
 *
 * STATUS 2026-04-15:
 *
 *   - 3 Panels : front / right_profile / left_profile
 *     (Logisch aus 4-Panel GT ableitbar; empirisch nicht gegengetestet,
 *     aber strukturell trivial da nur 1 Panel weggestrichen wird.)
 *
 *   - 4 Panels : front / right_profile / left_profile / back
 *     >>> EMPIRISCH VALIDIERTE GROUND TRUTH <<<
 *     Direkt aus DISTILLATIONS/angle-study-json-example.md. Dies ist der
 *     einzige Count der in NanoBanana am 2026-04-15 getestet und bestätigt
 *     wurde.
 *
 *   - 6 Panels : TENTATIVE, NOCH NICHT in NanoBanana getestet.
 *     Vorschlag aus BUILD_PLAN.md §8.1 übernommen, Reihenfolge kann sich
 *     ändern sobald Jonas empirisch gegentestet hat (§15 Item 1).
 *
 *   - 8 Panels : TENTATIVE 360°-Turn, NOCH NICHT in NanoBanana getestet.
 *     Gleicher Disclaimer wie 6.
 *
 * Jonas entscheidet per NanoBanana-Test ob die 6er/8er-Reihenfolgen
 * bleiben. Bis dahin: `isEmpiricallyValidated` gibt nur für 4 true zurück,
 * damit die UI in Slice 3+ einen "empirisch ungetestet"-Badge auf 3/6/8
 * setzen kann.
 */

const PANEL_ROLES = {
  3: ["front", "right_profile", "left_profile"],
  4: ["front", "right_profile", "left_profile", "back"],
  6: [
    "front",
    "front_right",
    "right_profile",
    "back",
    "left_profile",
    "front_left",
  ],
  8: [
    "front",
    "front_right",
    "right_profile",
    "back_right",
    "back",
    "back_left",
    "left_profile",
    "front_left",
  ],
};

export const SUPPORTED_PANEL_COUNTS = [3, 4, 6, 8];

/**
 * Nur diese Counts wurden in NanoBanana empirisch getestet. Siehe
 * BUILD_PLAN.md §12 für den Testprotokoll.
 */
export const EMPIRICALLY_VALIDATED_COUNTS = [4];

/**
 * Gibt für einen panelCount die Liste der Panel-Rollen zurück.
 * Jede Rolle: { view, framing }.
 *
 * Für character_angle_study ist `framing` immer `"full_body"` — der Case
 * ist strukturell ein Full-Body-Turn-Around. Andere Cases (z.B.
 * shot_coverage) haben variable Framings und brauchen eine eigene Strategy.
 *
 * Wirft bei unsupported counts.
 */
export function panelRoleStrategy(panelCount) {
  const roles = PANEL_ROLES[panelCount];
  if (!roles) {
    throw new Error(
      `panelRoleStrategy: unsupported panel_count ${JSON.stringify(panelCount)}. ` +
        `Supported: ${SUPPORTED_PANEL_COUNTS.join(", ")}.`
    );
  }
  return roles.map((view) => ({ view, framing: "full_body" }));
}

/**
 * Gibt true zurück wenn dieser panel_count in NanoBanana empirisch
 * gegengetestet wurde. Die UI kann das nutzen um ein "untested"-Badge
 * auf nicht-validierte Counts zu setzen.
 */
export function isEmpiricallyValidated(panelCount) {
  return EMPIRICALLY_VALIDATED_COUNTS.includes(panelCount);
}
