/**
 * character_angle_study — Panel-Role-Strategy
 *
 * JS-Hook des Case-Bundles (Spec §8). Liest die Panel-Rollen-Map aus
 * `schema.json` und exponiert die Strategy-API der alten
 * `panelRoleStrategy.js`. Das UI + Tests gehen beide durch diese
 * Strategy — sie ist die Quelle der Wahrheit für "welche Rollen bei
 * welchem Panel-Count".
 */

import schema from "./schema.json" with { type: "json" };

const PANEL_ROLES = Object.fromEntries(
  Object.entries(schema.panelRoles).map(([count, roles]) => [Number(count), roles])
);

export const SUPPORTED_PANEL_COUNTS = schema.validPanelCounts;

export const EMPIRICALLY_VALIDATED_COUNTS = schema.empiricallyValidatedCounts;

const PANEL_FRAMING = schema.panelFraming;

export function panelRoleStrategy(panelCount) {
  const roles = PANEL_ROLES[panelCount];
  if (!roles) {
    throw new Error(
      `panelRoleStrategy: unsupported panel_count ${JSON.stringify(panelCount)}. ` +
        `Supported: ${SUPPORTED_PANEL_COUNTS.join(", ")}.`
    );
  }
  return roles.map((view) => ({ view, framing: PANEL_FRAMING }));
}

export function isEmpiricallyValidated(panelCount) {
  return EMPIRICALLY_VALIDATED_COUNTS.includes(panelCount);
}
