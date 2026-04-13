#!/usr/bin/env node
// Golden-file test for the Character Study skeleton renderer.
//
// Runs without a test framework: `node tests/renderCharacterStudy.test.js`
// Exit code 0 on success, 1 on any diff or error.
//
// Each case reproduces one of the five rendered examples from
// DISTILLATIONS/character-study.md section 9. The config/userInputs blocks
// under each example in the distillation are mirrored exactly in the
// CASES array below.

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { renderSkeleton } from '../src/lib/skeletonRenderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');

function readJson(relPath) {
  return JSON.parse(readFileSync(join(REPO_ROOT, relPath), 'utf8'));
}

function loadCharacterStudyBundle() {
  const skeleton = readJson('src/data/skeletons/character-study.json');
  const moduleDir = 'src/data/modules/character-study';
  const order = readJson(`${moduleDir}/_order.json`);

  const modules = {};
  for (const moduleId of order.modules) {
    modules[moduleId] = readJson(`${moduleDir}/${moduleId}.json`);
  }

  // Sanity: MOD-E and MOD-I must NOT be in the module set.
  const forbiddenIds = ['mod-e', 'mod-i'];
  for (const fid of forbiddenIds) {
    if (fid in modules) {
      throw new Error(`Module bundle contains forbidden module "${fid}" — see Distillation Anti-Patterns 11 + 12`);
    }
  }

  // Sanity: all 11 expected files present (1 × mode + 9 × mod-*  + _order).
  const expectedModuleIds = ['mode', 'mod-a', 'mod-b', 'mod-c', 'mod-d', 'mod-f', 'mod-g', 'mod-h', 'mod-j', 'mod-k'];
  for (const id of expectedModuleIds) {
    if (!(id in modules)) throw new Error(`Module bundle missing "${id}"`);
  }
  // Also spot-check directory for unexpected extras.
  const diskFiles = readdirSync(join(REPO_ROOT, moduleDir))
    .filter((f) => f.endsWith('.json') && f !== '_order.json')
    .map((f) => f.replace(/\.json$/, ''));
  for (const f of diskFiles) {
    if (!expectedModuleIds.includes(f)) {
      throw new Error(`Unexpected module file on disk: ${f}.json (not in _order.json)`);
    }
  }

  return { ...skeleton, modules };
}

function readGolden(name) {
  const raw = readFileSync(join(REPO_ROOT, 'tests/golden/character-study', name), 'utf8');
  // Strip exactly one trailing POSIX newline. The renderer joins blocks with
  // "\n\n" and does not append a final newline. Golden files keep a trailing
  // newline for POSIX compatibility; we strip it here for byte-exact compare.
  return raw.endsWith('\n') ? raw.slice(0, -1) : raw;
}

function diffReport(actual, expected) {
  const a = actual.split('\n');
  const e = expected.split('\n');
  const max = Math.max(a.length, e.length);
  const lines = [];
  for (let i = 0; i < max; i++) {
    if (a[i] === e[i]) continue;
    lines.push(`  line ${i + 1}:`);
    lines.push(`    expected: ${JSON.stringify(e[i] ?? '<EOF>')}`);
    lines.push(`    actual:   ${JSON.stringify(a[i] ?? '<EOF>')}`);
  }
  if (lines.length === 0 && actual !== expected) {
    lines.push('  (no line diff but strings differ — trailing whitespace?)');
    lines.push(`    expected length: ${expected.length}`);
    lines.push(`    actual length:   ${actual.length}`);
  }
  return lines.join('\n');
}

// ────────────────────────────────────────────────────────────────────────────
// Cases — mirror Section 9 User Inputs blocks byte-exact
// ────────────────────────────────────────────────────────────────────────────

const CASES = [
  {
    name: 'Example A — 2×2 Cinematic Angle Study, MOD-A, Preserve',
    golden: 'example-a.txt',
    moduleConfig: {
      mode: 'cinematic',
      rows: 2,
      cols: 2,
      mod_a: { active: true },
      mod_b: { active: false },
      mod_d: { active: true, preset: 'DS-06_N4' },
      mod_f: { active: false },
      mod_g: { active: false },
      mod_h: { active: true, value: 'Preserve' },
      mod_j: { active: false },
      mod_k: { active: true, value: 'Even' }
    },
    userInputs: {
      reference_a_description: 'full-body cinematic character image',
      mod_a_description: "upscaled close crop of the character's face"
    }
  },
  {
    name: 'Example B — 1×6 Cinematic Expression Strip, Single-Ref, MOD-F',
    golden: 'example-b.txt',
    moduleConfig: {
      mode: 'cinematic',
      rows: 1,
      cols: 6,
      mod_a: { active: false },
      mod_b: { active: false },
      mod_d: { active: false },
      mod_f: { active: true, preset: 'DS-17_N6' },
      mod_g: { active: false },
      mod_h: { active: false, value: null },
      mod_j: { active: false },
      mod_k: { active: true, value: 'Even' }
    },
    userInputs: {}
  },
  {
    name: 'Example C — 2×4 Technical Reference Sheet, MOD-A, Custom, MOD-J',
    golden: 'example-c.txt',
    moduleConfig: {
      mode: 'technical',
      rows: 2,
      cols: 4,
      mod_a: { active: true },
      mod_b: { active: false },
      mod_d: { active: true, preset: '8view_N8' },
      mod_f: { active: false },
      mod_g: { active: false },
      mod_h: { active: true, value: 'Custom' },
      mod_j: { active: true },
      mod_k: { active: true, value: 'Even' }
    },
    userInputs: {
      reference_a_description: 'full-body view — body proportions, posture, clothing, silhouette',
      mod_a_description: 'close-up face view — facial identity, expression, fine details',
      mod_h_custom_text: 'Soft studio backdrop with directional key light from camera-left',
      mod_j_look_name: 'Photoreal Studio Look',
      mod_j_look_description: 'Photoreal studio shoot, directional key light with soft fill, neutral color grade, sharp surface detail'
    }
  },
  {
    name: 'Example D — 3×3 Cinematic Storyboard, MOD-A, Preserve, MOD-G',
    golden: 'example-d.txt',
    moduleConfig: {
      mode: 'cinematic',
      rows: 3,
      cols: 3,
      mod_a: { active: true },
      mod_b: { active: false },
      mod_d: { active: true, preset: 'DS-04_N9' },
      mod_f: { active: false },
      mod_g: { active: true },
      mod_h: { active: true, value: 'Preserve' },
      mod_j: { active: false },
      mod_k: { active: true, value: 'Even' }
    },
    userInputs: {
      reference_a_description: 'character preservation / integration image (full body)',
      mod_a_description: 'upscaled face crop (highest authority for face)'
    }
  },
  {
    name: 'Example E — 2×2 Cinematic Angle, MOD-B only (Additional Ref without Face Crop)',
    golden: 'example-e.txt',
    moduleConfig: {
      mode: 'cinematic',
      rows: 2,
      cols: 2,
      mod_a: { active: false },
      mod_b: { active: true },
      mod_d: { active: true, preset: 'DS-06_N4' },
      mod_f: { active: false },
      mod_g: { active: false },
      mod_h: { active: true, value: 'Preserve' },
      mod_j: { active: false },
      mod_k: { active: true, value: 'Even' }
    },
    userInputs: {
      reference_a_description: 'full-body cinematic character image',
      mod_b_description: 'reference scene for environment and atmospheric lighting',
      mod_b_purpose: 'the environment, backdrop, and atmospheric lighting',
      mod_b_conflict_tail_descriptor: 'atmospheric'
    }
  }
];

// ────────────────────────────────────────────────────────────────────────────
// Runner
// ────────────────────────────────────────────────────────────────────────────

function run() {
  const bundle = loadCharacterStudyBundle();
  let passed = 0;
  let failed = 0;

  for (const c of CASES) {
    let actual;
    try {
      actual = renderSkeleton(bundle, c.moduleConfig, c.userInputs);
    } catch (err) {
      console.error(`✗ ${c.name}\n  RENDER ERROR: ${err.message}`);
      failed++;
      continue;
    }
    const expected = readGolden(c.golden);
    if (actual === expected) {
      console.log(`✓ ${c.name}`);
      passed++;
    } else {
      console.error(`✗ ${c.name}\n${diffReport(actual, expected)}`);
      failed++;
    }
  }

  console.log('');
  console.log(`Result: ${passed} passed, ${failed} failed, ${CASES.length} total.`);
  if (failed > 0) process.exit(1);
}

run();
