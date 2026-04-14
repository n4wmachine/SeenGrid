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

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { renderCharacterStudy } from '../src/lib/skeletonRenderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');

function readJson(relPath) {
  return JSON.parse(readFileSync(join(REPO_ROOT, relPath), 'utf8'));
}

function loadCharacterStudyBundle() {
  const mainSkeleton = readJson('src/data/skeletons/character-study.json');
  const normalizerSkeleton = readJson('src/data/skeletons/character-study-normalizer.json');
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

  return { mainSkeleton, normalizerSkeleton, modules };
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

// Each case has `goldens: string[]` — one golden file per emitted prompt.
//   - clean_full_body cases → length 1
//   - needs_normalization cases → length 2 (step1 + step2)

const CASES = [
  {
    name: 'Example A — 2×2 Cinematic Angle Study, MOD-A, Preserve (clean)',
    goldens: ['example-a.txt'],
    moduleConfig: {
      mode: 'cinematic',
      ref_completeness: 'clean_full_body',
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
    goldens: ['example-b.txt'],
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
    name: 'Example C — 2×4 Technical Reference Sheet, MOD-A, Custom, MOD-J (clean)',
    goldens: ['example-c.txt'],
    moduleConfig: {
      mode: 'technical',
      ref_completeness: 'clean_full_body',
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
    name: 'Example D — 3×3 Cinematic Storyboard, MOD-A, Preserve, MOD-G (clean)',
    goldens: ['example-d.txt'],
    moduleConfig: {
      mode: 'cinematic',
      ref_completeness: 'clean_full_body',
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
    name: 'Example E — 2×2 Cinematic Angle, MOD-B only (Additional Ref without Face Crop) (clean)',
    goldens: ['example-e.txt'],
    moduleConfig: {
      mode: 'cinematic',
      ref_completeness: 'clean_full_body',
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
  },
  {
    name: 'Example A2 — 2×2 Cinematic Angle Study, MOD-A, Preserve (needs_normalization)',
    goldens: ['example-a2-step1.txt', 'example-a2-step2.txt'],
    moduleConfig: {
      mode: 'cinematic',
      ref_completeness: 'needs_normalization',
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
    name: 'Example C2 — 2×4 Technical Reference Sheet, MOD-A, Custom, MOD-J (needs_normalization)',
    goldens: ['example-c2-step1.txt', 'example-c2-step2.txt'],
    moduleConfig: {
      mode: 'technical',
      ref_completeness: 'needs_normalization',
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
    name: 'Example D2 — 3×3 Cinematic Storyboard, MOD-A, Preserve, MOD-G (needs_normalization)',
    goldens: ['example-d2-step1.txt', 'example-d2-step2.txt'],
    moduleConfig: {
      mode: 'cinematic',
      ref_completeness: 'needs_normalization',
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
  }
];

// ────────────────────────────────────────────────────────────────────────────
// Runner
// ────────────────────────────────────────────────────────────────────────────

function writeGolden(name, content) {
  const path = join(REPO_ROOT, 'tests/golden/character-study', name);
  // Golden files are stored with a trailing POSIX newline; readGolden strips
  // exactly one. Preserve the invariant here so repeated writes are stable.
  writeFileSync(path, content.endsWith('\n') ? content : content + '\n', 'utf8');
}

function run() {
  const updateMode = process.argv.includes('--update');
  const bundle = loadCharacterStudyBundle();
  let passed = 0;
  let failed = 0;
  let updated = 0;

  for (const c of CASES) {
    let result;
    try {
      result = renderCharacterStudy(bundle, c.moduleConfig, c.userInputs);
    } catch (err) {
      console.error(`✗ ${c.name}\n  RENDER ERROR: ${err.message}`);
      failed++;
      continue;
    }

    const prompts = result.prompts;
    const goldens = c.goldens;
    if (prompts.length !== goldens.length) {
      console.error(`✗ ${c.name}\n  PROMPT COUNT MISMATCH: got ${prompts.length}, expected ${goldens.length}`);
      failed++;
      continue;
    }

    if (updateMode) {
      for (let i = 0; i < prompts.length; i++) {
        writeGolden(goldens[i], prompts[i]);
        updated++;
      }
      console.log(`↻ ${c.name} (${goldens.join(', ')})`);
      continue;
    }

    let caseFailed = false;
    for (let i = 0; i < prompts.length; i++) {
      const goldenPath = join(REPO_ROOT, 'tests/golden/character-study', goldens[i]);
      if (!existsSync(goldenPath)) {
        console.error(`✗ ${c.name}\n  MISSING GOLDEN: ${goldens[i]}`);
        caseFailed = true;
        continue;
      }
      const expected = readGolden(goldens[i]);
      if (prompts[i] === expected) continue;
      const label = prompts.length === 1 ? '' : ` [prompt ${i + 1}/${prompts.length} — ${goldens[i]}]`;
      console.error(`✗ ${c.name}${label}\n${diffReport(prompts[i], expected)}`);
      caseFailed = true;
    }
    if (caseFailed) {
      failed++;
    } else {
      console.log(`✓ ${c.name}`);
      passed++;
    }
  }

  console.log('');
  if (updateMode) {
    console.log(`Updated ${updated} golden file(s) across ${CASES.length} case(s).`);
    return;
  }
  console.log(`Result: ${passed} passed, ${failed} failed, ${CASES.length} total.`);
  if (failed > 0) process.exit(1);
}

run();
