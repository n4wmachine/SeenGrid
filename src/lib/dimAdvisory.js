/* ============================================================
   DIM ADVISORY
   Portiert aus GridOperator.jsx (Commit 13ca30f~1, letzte Fassung
   vor Legacy-Löschung). Gibt pro Grid-Kombination die Panel-Pixel-
   Größen bei 2K und 4K + eine Quality-Stufe.

   Logik-Thresholds (unverändert, empirisch validiert):
     ≥ 1024 px short-edge → HIRES
     ≥  512 px short-edge → STANDARD
     ≥  256 px short-edge → LOW
     <  256 px short-edge → TINY

   UI-Casing ist UPPERCASE (WORKSPACE_SPEC §12.1, NUANCEN 13 —
   4 Stufen, kein PERFECT).

   Canvas-Annahme: quadratisch (2048 / 4096). Panels werden pro
   Achse berechnet, non-square Grids ergeben non-square Panels.
   Quality-Tag liest die kürzere Kante bei 2K — ein langgestrecktes
   Panel kann an seiner schmalen Achse nicht mehr Detail tragen.
   ============================================================ */

const SIZE_2K = 2048
const SIZE_4K = 4096

export const QUALITY_LABELS = {
  HIRES: 'HIRES',
  STANDARD: 'STANDARD',
  LOW: 'LOW',
  TINY: 'TINY',
}

export const QUALITY_DESCRIPTIONS = {
  HIRES: 'full-detail final-shot material',
  STANDARD: 'solid single-crop quality',
  LOW: 'usable as reference, not as finals',
  TINY: 'concept board only',
}

export function getDimAdvice(rows, cols) {
  const safeRows = Math.max(1, rows | 0)
  const safeCols = Math.max(1, cols | 0)

  const panelW2K = Math.floor(SIZE_2K / safeCols)
  const panelH2K = Math.floor(SIZE_2K / safeRows)
  const panelW4K = Math.floor(SIZE_4K / safeCols)
  const panelH4K = Math.floor(SIZE_4K / safeRows)

  const shortest2K = Math.min(panelW2K, panelH2K)
  let quality
  if (shortest2K >= 1024) quality = QUALITY_LABELS.HIRES
  else if (shortest2K >= 512) quality = QUALITY_LABELS.STANDARD
  else if (shortest2K >= 256) quality = QUALITY_LABELS.LOW
  else quality = QUALITY_LABELS.TINY

  return {
    panelW2K,
    panelH2K,
    panelW4K,
    panelH4K,
    quality,
    shortest2K,
  }
}

export function isWarningQuality(quality) {
  return quality === QUALITY_LABELS.LOW || quality === QUALITY_LABELS.TINY
}
