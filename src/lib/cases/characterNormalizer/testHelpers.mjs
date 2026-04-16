/**
 * testHelpers — character_normalizer
 *
 * Lädt das empirisch validierte Ground-Truth-JSON wortwörtlich aus
 * DISTILLATIONS/character-normalizer-json-example.md.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GT_MD_PATH = path.resolve(
  __dirname,
  "../../../../DISTILLATIONS/character-normalizer-json-example.md"
);

export function loadNormalizerGt() {
  if (!fs.existsSync(GT_MD_PATH)) {
    throw new Error(
      `loadNormalizerGt: GT file not found at ${GT_MD_PATH}`
    );
  }
  const md = fs.readFileSync(GT_MD_PATH, "utf-8");
  const match = md.match(/```json\s*\n([\s\S]*?)\n```/);
  if (!match) {
    throw new Error(
      `loadNormalizerGt: could not find a \`\`\`json block in ${GT_MD_PATH}`
    );
  }
  try {
    return JSON.parse(match[1]);
  } catch (err) {
    throw new Error(
      `loadNormalizerGt: JSON.parse failed on extracted block: ${err.message}`
    );
  }
}

export const GT_FILE_PATH = GT_MD_PATH;
