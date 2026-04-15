/**
 * testHelpers — character_angle_study
 *
 * Test-only Utilities. Lädt das empirisch validierte Ground-Truth-JSON
 * wortwörtlich aus DISTILLATIONS/angle-study-json-example.md. Das gibt
 * uns **eine einzige Wahrheitsquelle** für Tests — die .md-Datei ist
 * der Master, Tests lesen sie zur Laufzeit.
 *
 * Warum nicht inline als const: Slice 1 hatte den GT inline in
 * schema.test.mjs. Das funktionierte, riskiert aber Drift wenn die
 * .md jemals aktualisiert wird (Anti-Drift-Regel: nur nach neuem
 * NanoBanana-Test + Jonas-OK) — dann müssten beide Stellen synchron
 * gehalten werden. Besser: Tests pullen direkt aus der .md.
 *
 * Warum nicht als .json-Fixture: Die .md ist der kanonische Speicher
 * für den GT (mit Dokumentation drumherum). Ein separates .json würde
 * die Wahrheit aufspalten.
 *
 * Nur in Tests verwenden — Runtime-Code darf nicht von .md-Dateien
 * abhängen.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GT_MD_PATH = path.resolve(
  __dirname,
  "../../../../DISTILLATIONS/angle-study-json-example.md"
);

/**
 * Liest den Ground-Truth-JSON-Block aus angle-study-json-example.md und
 * gibt ihn als geparstes Objekt zurück.
 *
 * Wirft wenn die Datei fehlt oder der JSON-Block nicht gefunden werden
 * kann — das ist Absicht, damit Tests sofort lautstark kaputtgehen wenn
 * die GT-Datei verschoben oder umbenannt wird.
 */
export function loadAngleStudyGt() {
  if (!fs.existsSync(GT_MD_PATH)) {
    throw new Error(
      `loadAngleStudyGt: GT file not found at ${GT_MD_PATH}`
    );
  }
  const md = fs.readFileSync(GT_MD_PATH, "utf-8");
  const match = md.match(/```json\s*\n([\s\S]*?)\n```/);
  if (!match) {
    throw new Error(
      `loadAngleStudyGt: could not find a \`\`\`json block in ${GT_MD_PATH}`
    );
  }
  try {
    return JSON.parse(match[1]);
  } catch (err) {
    throw new Error(
      `loadAngleStudyGt: JSON.parse failed on extracted block: ${err.message}`
    );
  }
}

export const GT_FILE_PATH = GT_MD_PATH;
