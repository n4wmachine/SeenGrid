/* ============================================================
   TOKEN COUNT
   Grobe Schätzung der Token-Länge eines Strings.
   Annahme: ~4 Zeichen pro Token (gilt für englische Prompts ±20%).
   Genaueres bracht echte BPE-Library — overkill für eine UI-Anzeige.

   Genutzt in der Output-Bar (WORKSPACE_SPEC §9.3): User sieht ob
   sein Prompt ins NanoBanana-Context-Budget passt.

   Warning-Schwelle: 8000 Tokens (NanoBanana-Erfahrungswert).
   ============================================================ */

export const TOKEN_WARN_THRESHOLD = 8000

export function countTokens(text) {
  if (!text) return 0
  return Math.max(1, Math.ceil(String(text).length / 4))
}

export function isTokenWarning(count) {
  return count > TOKEN_WARN_THRESHOLD
}
