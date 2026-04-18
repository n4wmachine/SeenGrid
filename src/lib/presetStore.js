/* ============================================================
   PRESET STORE (Stub, Phase: Picker-Bau)
   Gibt die Liste der User-Presets aus.
   Aktuell leer — YOUR-PRESETS-Sektion rendert dadurch adaptiv weg.
   Wird in Workspace-Phase durch persistenten Store (localStorage
   oder Signature-Store-Stufe-1-Integration) ersetzt.

   Preset-Interface (PRODUCT_STRATEGY_V1 §1.1 + §2.2):
   {
     id:            string
     name:          string            // User-vergebener Name
     caseId:        string            // → cases.config.json
     panelCount:    number
     createdAt:     number
     modifiedAt:    number
     signatureId?:  string            // Live-Link-ID
     payload: {
       layout:        { caseId, panelCount, orientation, roles }   // Pflicht
       panelFields?:  Record<panelIdx, any>                        // optional
       modules?:      Record<moduleId, any>                        // optional
     }
   }
   ============================================================ */

const EMPTY_PRESETS = []

export function useGridPresets() {
  return EMPTY_PRESETS
}

export function listPresets() {
  return EMPTY_PRESETS
}
