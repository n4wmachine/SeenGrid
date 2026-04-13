// Pure skeleton renderer for Character Study (Pilot 1 — Phase 5).
//
// Signature: renderSkeleton(skeleton, moduleConfig, userInputs) -> string
//
// Inputs:
//   - skeleton     : the loaded character-study.json bundle, with a `modules`
//                    property that maps module ids to their loaded JSON files
//                    (mode, mod-a, mod-b, mod-c, mod-d, mod-f, mod-g, mod-h,
//                    mod-j, mod-k). MOD-E and MOD-I are deliberately absent.
//   - moduleConfig : structural choices — { mode, rows, cols, mod_a, mod_b,
//                    mod_d, mod_f, mod_g, mod_h, mod_j, mod_k } where each
//                    mod_* entry carries at least { active }.
//   - userInputs   : text-slot values — reference_a_description,
//                    mod_a_description, mod_b_purpose,
//                    mod_b_conflict_tail_descriptor, mod_h_custom_text,
//                    mod_j_look_name, mod_j_look_description,
//                    panel_content_override (array or null).
//
// Output: a single paste-ready prompt string.
//
// Rules:
//   - Pure function: no side effects, no React imports, no dynamic eval,
//     no network or filesystem access.
//   - Condition DSL: "always" / { all_of }, { any_of }, { not }. Unknown
//     boolean names throw hard (no silent false).
//   - Blocks without a header render just their body; blocks with a header
//     render "HEADER\nbody" and are joined by skeleton.join ("\n\n").
//   - See DISTILLATIONS/character-study.md sections 3–9 + 14 for the full
//     contract. Section 9 examples are the byte-exact ground truth.

const NUMBER_WORDS = {
  1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
  6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
  11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen',
  16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty',
  21: 'twenty-one', 22: 'twenty-two', 23: 'twenty-three', 24: 'twenty-four', 25: 'twenty-five'
};

function numberToWord(n) {
  const w = NUMBER_WORDS[n];
  if (!w) throw new Error(`numberToWord: no word for ${n} (valid range 1..25)`);
  return w;
}

function layoutWord(rows, cols) {
  if (rows === 1) return 'horizontal strip';
  if (cols === 1) return 'vertical strip';
  return 'grid';
}

// ────────────────────────────────────────────────────────────────────────────
// Condition DSL
// ────────────────────────────────────────────────────────────────────────────

export function evalCondition(cond, flags) {
  if (cond === 'always' || cond == null) return true;
  if (typeof cond === 'string') {
    if (!(cond in flags)) {
      throw new Error(`evalCondition: unknown boolean flag "${cond}"`);
    }
    return !!flags[cond];
  }
  if (typeof cond !== 'object') {
    throw new Error(`evalCondition: invalid condition shape ${JSON.stringify(cond)}`);
  }
  const keys = Object.keys(cond);
  if (keys.length !== 1) {
    throw new Error(`evalCondition: condition object must have exactly one key, got ${JSON.stringify(cond)}`);
  }
  const op = keys[0];
  const val = cond[op];
  switch (op) {
    case 'all_of':
      if (!Array.isArray(val)) throw new Error('all_of expects an array');
      return val.every((sub) => evalCondition(sub, flags));
    case 'any_of':
      if (!Array.isArray(val)) throw new Error('any_of expects an array');
      return val.some((sub) => evalCondition(sub, flags));
    case 'not':
      return !evalCondition(val, flags);
    default:
      throw new Error(`evalCondition: unknown operator "${op}"`);
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Derived flags + context
// ────────────────────────────────────────────────────────────────────────────

function deriveContext(skeleton, moduleConfig, userInputs) {
  const mode = moduleConfig.mode;
  const rows = moduleConfig.rows;
  const cols = moduleConfig.cols;
  if (mode !== 'cinematic' && mode !== 'technical') {
    throw new Error(`deriveContext: mode must be 'cinematic' or 'technical', got "${mode}"`);
  }

  const isCinematic = mode === 'cinematic';
  const isTechnical = mode === 'technical';

  const modA = moduleConfig.mod_a || { active: false };
  const modB = moduleConfig.mod_b || { active: false };
  const modD = moduleConfig.mod_d || { active: false };
  const modF = moduleConfig.mod_f || { active: false };
  const modG = moduleConfig.mod_g || { active: false };
  const modH = moduleConfig.mod_h || { active: false, value: null };
  const modJ = moduleConfig.mod_j || { active: false };
  const modK = moduleConfig.mod_k || { active: true, value: 'Even' };

  const hasFaceCrop = modA.active === true;
  const hasExtraRef = modB.active === true;
  const isSingleRef = !hasFaceCrop && !hasExtraRef;
  const hasMultiRef = hasFaceCrop || hasExtraRef;
  const refCount = 1 + (hasFaceCrop ? 1 : 0) + (hasExtraRef ? 1 : 0);

  const axisAngle = modD.active === true;
  const axisExpression = modF.active === true;
  if (axisAngle && axisExpression) {
    throw new Error('deriveContext: MOD-D and MOD-F are mutually exclusive (XOR rule)');
  }
  if (!axisAngle && !axisExpression) {
    throw new Error('deriveContext: exactly one axis must be active — MOD-D or MOD-F');
  }

  // Resolve framing_mode from active panel-content preset (angle axis only).
  let framingMode = null;
  if (axisAngle) {
    const modDData = skeleton.modules['mod-d'];
    const presetId = modD.preset || 'DS-06_N4';
    const preset = modDData.panel_presets[presetId];
    if (!preset) throw new Error(`deriveContext: unknown MOD-D preset "${presetId}"`);
    framingMode = preset.framing_mode;
  }

  // MOD-H effective value: explicit user choice wins, else axis default.
  let modHEffective;
  const modHExplicit = modH.active === true && modH.value != null;
  if (modHExplicit) {
    modHEffective = modH.value;
  } else {
    modHEffective = axisAngle ? 'Preserve' : 'Neutral';
  }
  const effectiveEnvironmentPreserve = modHEffective === 'Preserve';

  const modBDescriptor =
    (userInputs && typeof userInputs.mod_b_conflict_tail_descriptor === 'string')
      ? userInputs.mod_b_conflict_tail_descriptor
      : '';
  const modBHasConflictDescriptor = hasExtraRef && modBDescriptor.length > 0;

  const flags = {
    is_cinematic: isCinematic,
    is_technical: isTechnical,
    axis_angle: axisAngle,
    axis_expression: axisExpression,
    has_face_crop: hasFaceCrop,
    has_extra_ref: hasExtraRef,
    is_single_ref: isSingleRef,
    has_multi_ref: hasMultiRef,
    mod_a_active: hasFaceCrop,
    mod_b_active: hasExtraRef,
    mod_b_has_conflict_descriptor: modBHasConflictDescriptor,
    mod_g_active: modG.active === true,
    mod_h_user_explicit: modHExplicit,
    mod_j_active: modJ.active === true,
    mod_k_active: modK.active !== false,
    effective_environment_preserve: effectiveEnvironmentPreserve
  };

  return {
    skeleton,
    moduleConfig,
    userInputs: userInputs || {},
    flags,
    derived: {
      mode,
      rows,
      cols,
      n_word: numberToWord(rows * cols),
      layout_word: layoutWord(rows, cols),
      framing_mode: framingMode,
      ref_count: refCount,
      mod_h_effective: modHEffective,
      mod: { a: modA, b: modB, d: modD, f: modF, g: modG, h: modH, j: modJ, k: modK }
    }
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Block renderers
// ────────────────────────────────────────────────────────────────────────────

function renderTitle(ctx) {
  const { skeleton, derived } = ctx;
  const modeWord = skeleton.modules.mode.title_word[derived.mode];
  return `${modeWord} — ${derived.rows}×${derived.cols} ${derived.layout_word}`;
}

function renderInputDecl(ctx) {
  const { skeleton, userInputs, derived, flags } = ctx;
  const variants = skeleton.lookups.input_decl_intro_variants;

  let intro;
  if (flags.is_single_ref) {
    intro = variants.is_single_ref;
  } else if (flags.has_face_crop && !flags.has_extra_ref) {
    intro = variants.mod_a_only;
  } else if (!flags.has_face_crop && flags.has_extra_ref) {
    intro = variants.mod_b_only;
  } else {
    intro = variants.mod_a_and_mod_b;
  }

  if (flags.is_single_ref) return intro;

  // Reference listing: one line per active slot, sequential.
  const modeData = skeleton.modules.mode;
  const refADescDefault = modeData.reference_a_description_default[derived.mode];
  const refADesc = (userInputs.reference_a_description && userInputs.reference_a_description.length > 0)
    ? userInputs.reference_a_description
    : refADescDefault;

  const lines = [intro, `Reference A = ${refADesc}.`];

  // Slot 2 = MOD-A if present, else MOD-B.
  if (flags.has_face_crop) {
    const modAData = skeleton.modules['mod-a'];
    const modADescDefault = modAData.description_default[derived.mode];
    const modADesc = (userInputs.mod_a_description && userInputs.mod_a_description.length > 0)
      ? userInputs.mod_a_description
      : modADescDefault;
    lines.push(`Reference B = ${modADesc}.`);
  } else if (flags.has_extra_ref) {
    const purpose = userInputs.mod_b_purpose;
    if (!purpose) {
      throw new Error('renderInputDecl: mod_b.purpose is required when MOD-B is active');
    }
    // MOD-B-only: the additional reference is rendered as "reference scene
    // for ..." style — i.e. a short description of the extra-ref image.
    // Section 9.5 shows the description is the same user-text as the purpose.
    lines.push(`Reference B = ${purpose}.`);
  }

  // Slot 3 = MOD-B if both MOD-A and MOD-B are active.
  if (flags.has_face_crop && flags.has_extra_ref) {
    const purpose = userInputs.mod_b_purpose;
    if (!purpose) {
      throw new Error('renderInputDecl: mod_b.purpose is required when MOD-B is active');
    }
    lines.push(`Reference C = ${purpose}.`);
  }

  return lines.join('\n');
}

function renderTask(ctx) {
  const { skeleton, derived, flags } = ctx;
  const variants = skeleton.lookups.task_variants;

  // Key assembly:
  //   cinematic.angle.{framing_mode}, cinematic.expression,
  //   technical.angle,               technical.expression
  let key;
  if (flags.is_cinematic && flags.axis_angle) {
    key = `cinematic.angle.${derived.framing_mode}`;
  } else if (flags.is_cinematic && flags.axis_expression) {
    key = 'cinematic.expression';
  } else if (flags.is_technical && flags.axis_angle) {
    key = 'technical.angle';
  } else if (flags.is_technical && flags.axis_expression) {
    key = 'technical.expression';
  } else {
    throw new Error('renderTask: could not resolve TASK variant key');
  }

  const variant = variants[key];
  if (!variant) throw new Error(`renderTask: no task variant for key "${key}"`);

  const variationClause = variant.variation_clause.replace('{n_word}', derived.n_word);
  return `Create ${derived.n_word} ${variant.mode_noun} of the exact same character ${variationClause}, arranged in a ${derived.rows}×${derived.cols} ${derived.layout_word}.`;
}

function renderModeSignal(ctx) {
  const { skeleton, derived, flags } = ctx;
  const tpl = skeleton.lookups.mode_signal_template;
  const slotRules = skeleton.lookups.mode_signal_slots;

  let contrastWord;
  if (flags.axis_expression) {
    contrastWord = slotRules.contrast_word.axis_expression;
  } else if (derived.framing_mode === 'mixed') {
    contrastWord = slotRules.contrast_word.framing_mixed;
  } else if (derived.framing_mode === 'uniform_full_body') {
    contrastWord = slotRules.contrast_word.framing_uniform_full_body;
  } else {
    throw new Error(`renderModeSignal: cannot derive contrast_word from framing_mode="${derived.framing_mode}"`);
  }

  const settingWord = flags.axis_angle
    ? slotRules.setting_word.axis_angle
    : slotRules.setting_word.axis_expression;

  return tpl
    .replace('{contrast_word}', contrastWord)
    .replace('{n_word}', derived.n_word)
    .replace('{setting_word}', settingWord);
}

function renderPanelContent(ctx) {
  const { skeleton, moduleConfig, userInputs, derived, flags } = ctx;
  let panels = null;

  if (userInputs.panel_content_override && Array.isArray(userInputs.panel_content_override)) {
    panels = userInputs.panel_content_override;
  } else if (flags.axis_angle) {
    const modDData = skeleton.modules['mod-d'];
    const presetId = moduleConfig.mod_d.preset || 'DS-06_N4';
    const preset = modDData.panel_presets[presetId];
    if (!preset) throw new Error(`renderPanelContent: unknown MOD-D preset "${presetId}"`);
    panels = preset.panels;
  } else if (flags.axis_expression) {
    const modFData = skeleton.modules['mod-f'];
    const presetId = moduleConfig.mod_f.preset || 'DS-17_N6';
    const preset = modFData.panel_presets[presetId];
    if (!preset) throw new Error(`renderPanelContent: unknown MOD-F preset "${presetId}"`);
    panels = preset.panels;
  }

  if (!panels) throw new Error('renderPanelContent: no panels resolved');
  const expected = derived.rows * derived.cols;
  if (panels.length !== expected) {
    throw new Error(`renderPanelContent: panel count mismatch — preset has ${panels.length}, grid requires ${expected}`);
  }

  return panels.map((p, i) => `Panel ${i + 1}: ${p}.`).join('\n');
}

function renderReferencePriority(ctx) {
  const { skeleton, userInputs, flags } = ctx;
  const variants = skeleton.lookups.reference_priority_variants;

  let variantKey;
  if (flags.has_face_crop && !flags.has_extra_ref) {
    variantKey = 'mod_a_only';
  } else if (!flags.has_face_crop && flags.has_extra_ref) {
    variantKey = flags.mod_b_has_conflict_descriptor
      ? 'mod_b_only_with_descriptor'
      : 'mod_b_only_without_descriptor';
  } else if (flags.has_face_crop && flags.has_extra_ref) {
    variantKey = flags.mod_b_has_conflict_descriptor
      ? 'mod_a_and_mod_b_with_descriptor'
      : 'mod_a_and_mod_b_without_descriptor';
  } else {
    // Should never be reached — block is gated on !is_single_ref.
    throw new Error('renderReferencePriority: invoked with single-ref state');
  }

  const variant = variants[variantKey];
  const purpose = userInputs.mod_b_purpose || '';
  const descriptor = userInputs.mod_b_conflict_tail_descriptor || '';

  const lines = variant.lines.map((line) =>
    line
      .replace('{purpose}', purpose)
      .replace('{descriptor}', descriptor)
  );
  return lines.join('\n');
}

function renderQualityAnchor(ctx) {
  const { skeleton, derived } = ctx;
  return skeleton.lookups.quality_anchor[derived.mode];
}

function renderLayout(ctx) {
  const { skeleton, derived, flags, moduleConfig } = ctx;

  const layoutStyle = (moduleConfig.mod_k && moduleConfig.mod_k.value) || 'Even';
  const headLine = `${derived.rows}×${derived.cols} ${derived.layout_word}. ${layoutStyle} spacing.`;

  let visibility;
  if (flags.axis_angle) {
    const modDData = skeleton.modules['mod-d'];
    visibility = modDData.visibility_clauses[derived.framing_mode];
    if (!visibility) {
      throw new Error(`renderLayout: no visibility clause for framing_mode "${derived.framing_mode}"`);
    }
  } else {
    const modFData = skeleton.modules['mod-f'];
    visibility = modFData.visibility_clause;
  }

  return `${headLine}\n${visibility}`;
}

function renderPose(ctx) {
  const { skeleton, flags } = ctx;
  if (flags.axis_angle) return skeleton.modules['mod-d'].pose;
  return skeleton.modules['mod-f'].pose;
}

function renderEnvironment(ctx) {
  const { skeleton, derived, userInputs } = ctx;
  const variants = skeleton.lookups.environment_variants;
  const effective = derived.mod_h_effective;
  const tpl = variants[effective];
  if (!tpl) throw new Error(`renderEnvironment: unknown effective MOD-H value "${effective}"`);
  if (effective === 'Custom') {
    const custom = userInputs.mod_h_custom_text || '';
    if (!custom) throw new Error('renderEnvironment: mod_h_custom_text is required when MOD-H=Custom');
    return tpl.replace('{custom_text}', custom);
  }
  return tpl;
}

function renderLocked(ctx) {
  const { skeleton, derived, flags } = ctx;
  const refTier = derived.ref_count >= 2 ? 'dual_or_triple_ref' : 'single_ref';
  if (flags.axis_angle) return skeleton.modules['mod-d'].locked[refTier];
  return skeleton.modules['mod-f'].locked[refTier];
}

function renderVariable(ctx) {
  return ctx.skeleton.modules['mod-f'].variable_block;
}

function renderStyle(ctx) {
  const { skeleton, userInputs } = ctx;
  const tpl = skeleton.lookups.style_template;
  const name = userInputs.mod_j_look_name || '';
  const desc = userInputs.mod_j_look_description || '';
  if (!name || !desc) {
    throw new Error('renderStyle: mod_j_look_name and mod_j_look_description are both required when MOD-J is active');
  }
  return tpl.replace('{look_name}', name).replace('{look_description}', desc);
}

function renderForbidden(ctx) {
  const { skeleton, flags } = ctx;
  const lines = [];

  // 1. universal_pre
  for (const l of skeleton.lookups.forbidden_universal_pre) lines.push(l);

  // 2. axis-specific
  if (flags.axis_angle) {
    for (const l of skeleton.modules['mod-d'].forbidden_entries) lines.push(l);
  } else {
    for (const l of skeleton.modules['mod-f'].forbidden_entries) lines.push(l);
  }

  // 3. mod_g toggle
  if (flags.mod_g_active) {
    for (const l of skeleton.modules['mod-g'].forbidden_entries) lines.push(l);
  }

  // 4. universal_post
  for (const l of skeleton.lookups.forbidden_universal_post) lines.push(l);

  // 5. mod_h preserve conditional
  if (flags.effective_environment_preserve) {
    lines.push(skeleton.lookups.forbidden_mod_h_preserve_line);
  }

  return lines.join('\n');
}

const RENDERERS = {
  title: renderTitle,
  input_decl: renderInputDecl,
  task: renderTask,
  mode_signal: renderModeSignal,
  panel_content: renderPanelContent,
  reference_priority: renderReferencePriority,
  quality_anchor: renderQualityAnchor,
  layout: renderLayout,
  pose: renderPose,
  environment: renderEnvironment,
  locked: renderLocked,
  variable: renderVariable,
  style: renderStyle,
  forbidden: renderForbidden
};

// ────────────────────────────────────────────────────────────────────────────
// Top-level renderer
// ────────────────────────────────────────────────────────────────────────────

export function renderSkeleton(skeleton, moduleConfig, userInputs) {
  if (!skeleton || !skeleton.blocks || !skeleton.modules) {
    throw new Error('renderSkeleton: skeleton bundle must include { blocks, modules }');
  }
  const ctx = deriveContext(skeleton, moduleConfig, userInputs);
  const parts = [];
  for (const block of skeleton.blocks) {
    if (!evalCondition(block.when, ctx.flags)) continue;
    const renderer = RENDERERS[block.render];
    if (!renderer) throw new Error(`renderSkeleton: no renderer for "${block.render}"`);
    const body = renderer(ctx);
    if (body == null || body === '') continue;
    parts.push(block.header ? `${block.header}\n${body}` : body);
  }
  return parts.join(skeleton.join || '\n\n');
}

export default renderSkeleton;
