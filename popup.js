/* ============================================================
   CinePrompt – Popup Logic
   NanoBanana Pro Prompt Builder
   ============================================================ */

'use strict';

// ── Film Data ──────────────────────────────────────────────
const DATA = {
  style: [
    { v: 'Cinematic Blockbuster',  t: 'Hollywood-Blockbuster Look' },
    { v: 'Film Noir',              t: 'Düster, hoher Kontrast, Schatten' },
    { v: 'Neo Noir',               t: 'Moderner Noir, Neon-Elemente' },
    { v: 'Cyberpunk',              t: 'Futuristische Neon-Dystopie' },
    { v: 'Spaghetti Western',      t: 'Enger Ausschnitt, Staub, Hitze' },
    { v: 'Horror / Thriller',      t: 'Bedrohlich, dunkle Atmosphäre' },
    { v: 'Romantic Drama',         t: 'Warm, sanft, emotional' },
    { v: 'Documentary Vérité',     t: 'Handheld, realistisch, roh' },
    { v: 'Science Fiction',        t: 'Futuristisch, klar, technisch' },
    { v: 'Arthouse',               t: 'Künstlerisch, experimentell' },
    { v: 'Period Drama',           t: 'Historisch, aufwändig, warm' },
    { v: 'Action / Adventure',     t: 'Dynamisch, schnell, intensiv' },
    { v: 'Dark Fantasy',           t: 'Episch, mystisch, düster' },
    { v: 'Slice of Life',          t: 'Ruhig, natürlich, alltäglich' },
  ],

  camera: [
    { v: 'ARRI Alexa 35',        t: 'Industrie-Standard, organisch' },
    { v: 'RED V-RAPTOR 8K',      t: 'Hochauflösend, präzise' },
    { v: 'Sony Venice 2',        t: 'Dual ISO, filmisch' },
    { v: 'Blackmagic URSA',      t: 'RAW, Cost-efficient' },
    { v: 'Canon Cinema EOS',     t: 'Warm, vielseitig' },
    { v: '35mm Filmkamera',      t: 'Klassischer Film-Look, Korn' },
    { v: '16mm Filmkamera',      t: 'Indie-Look, stark körnig' },
    { v: 'Super 8',              t: 'Lo-Fi, nostalgisch, retro' },
  ],

  lens: [
    { v: 'Anamorphic',           t: 'Ovale Bokeh, Lens Flares, 2.39:1' },
    { v: 'Spherical Prime',      t: 'Scharf, clean, neutral' },
    { v: 'Vintage Character',    t: 'Weich, glühen, retro' },
    { v: 'Cinema Zoom',          t: 'Flexibel, leichter Schärfeverlust' },
    { v: 'Macro',                t: 'Extreme Nahaufnahmen, flache DOF' },
    { v: 'Tilt-Shift',           t: 'Selektive Unschärfe, Miniatur-Effekt' },
    { v: 'Fisheye',              t: 'Extreme Weitwinkel-Verzerrung' },
    { v: 'Cooke S7/i',           t: 'Cremig, warm, klassisch britisch' },
  ],

  focal: [
    { v: '14mm',   t: 'Ultra-Weitwinkel, dramatische Verzerrung' },
    { v: '24mm',   t: 'Weitwinkel, Umgebung betonen' },
    { v: '28mm',   t: 'Leicht weitwinklig, Reporter-Style' },
    { v: '35mm',   t: 'Normales Weitwinkel, Klassiker' },
    { v: '50mm',   t: 'Normal, nah am menschlichen Auge' },
    { v: '85mm',   t: 'Portät, schmeichelhaft, komprimiert' },
    { v: '105mm',  t: 'Kurzes Tele, flache Tiefenschärfe' },
    { v: '135mm',  t: 'Tele, sehr flache DOF, Trennung' },
    { v: '200mm',  t: 'Langes Tele, komprimierter Raum' },
  ],

  aperture: [
    { v: 'f/1.2',  t: 'Extrem flach',    dof: 'extrem flach' },
    { v: 'f/1.8',  t: 'Sehr flach',      dof: 'sehr flach' },
    { v: 'f/2.8',  t: 'Flach',           dof: 'flach' },
    { v: 'f/4',    t: 'Mittel',          dof: 'mittel' },
    { v: 'f/5.6',  t: 'Mittel-tief',     dof: 'mittel-tief' },
    { v: 'f/8',    t: 'Tief',            dof: 'tief' },
    { v: 'f/11',   t: 'Sehr tief',       dof: 'sehr tief' },
    { v: 'f/16',   t: 'Alles scharf',    dof: 'alles scharf' },
  ],

  lighting: [
    { v: 'Golden Hour',        t: 'Warmes, goldenes Stundenlicht' },
    { v: 'Magic Hour',         t: 'Kurzes Fenster nach Sonnenuntergang' },
    { v: 'Blue Hour',          t: 'Tiefblaues Dämmerungslicht' },
    { v: 'Harsh Midday',       t: 'Hartes Sonnenlicht, starke Schatten' },
    { v: 'Overcast Soft',      t: 'Bewölkt, gleichmäßig diffus' },
    { v: 'Studio 3-Point',     t: 'Klassisches Studiolicht' },
    { v: 'Neon Lights',        t: 'Bunte Neon-Lichter, urban' },
    { v: 'Practical Only',     t: 'Nur vorhandene Lichtquellen' },
    { v: 'Backlit / Rim',      t: 'Gegenlicht, Rim-Light auf Silhouette' },
    { v: 'High Key',           t: 'Hell, wenig Schatten, optimistisch' },
    { v: 'Low Key',            t: 'Dunkel, dramatische Schatten' },
    { v: 'Chiaroscuro',        t: 'Starker Hell-Dunkel-Kontrast' },
    { v: 'Candlelight',        t: 'Kerzenlicht, sehr warm, flackernd' },
    { v: 'Tungsten Warm',      t: 'Warmes Glühlampenlicht' },
  ],

  colorgrade: [
    { v: 'Orange & Teal',       t: 'Klassischer Blockbuster-Look' },
    { v: 'Warm Film',           t: 'Warme, goldene Töne' },
    { v: 'Cool / Desaturated',  t: 'Kühles, entsättigtes Bild' },
    { v: 'Bleach Bypass',       t: 'Kontraststark, entsättigt, hart' },
    { v: 'Kodak Vision 3',      t: 'Klassischer Filmstock-Look' },
    { v: 'Fuji Eterna',         t: 'Sanft, kühl, japanisch' },
    { v: 'High Contrast',       t: 'Starker Kontrast, intensiv' },
    { v: 'Monochrome B&W',      t: 'Klassisches Schwarzweiß' },
    { v: 'Sepia Vintage',       t: 'Altes Sepia, nostalgisch' },
    { v: 'Neon Vibrant',        t: 'Satte, leuchtende Farben' },
    { v: 'Faded / Washed',      t: 'Ausgeblichener Indie-Look' },
  ],

  movement: [
    { v: 'Static',          t: 'Kamera komplett still' },
    { v: 'Subtle Handheld', t: 'Leichtes Wackeln, authentisch' },
    { v: 'Heavy Handheld',  t: 'Starkes Wackeln, dokumentarisch' },
    { v: 'Dolly In',        t: 'Kamera fährt langsam rein (Push)' },
    { v: 'Dolly Out',       t: 'Kamera fährt langsam raus (Pull)' },
    { v: 'Crane Up',        t: 'Kamerakran schwenkt nach oben' },
    { v: 'Drone Orbit',     t: 'Drohne umkreist Motiv' },
    { v: 'Tracking Shot',   t: 'Kamera folgt dem Motiv' },
    { v: 'Whip Pan',        t: 'Schneller Schwenk, Bewegungsunschärfe' },
    { v: 'Slow Push In',    t: 'Sehr langsamer, subtiler Zoom' },
    { v: 'Rack Focus',      t: 'Schärfe wechselt zwischen Ebenen' },
    { v: 'Steadicam',       t: 'Smooth, fließend, stabilisiert' },
    { v: 'Dutch Angle',     t: 'Schräggestellte Kamera, Unbehagen' },
  ],

  effects: [
    { v: 'Heavy Film Grain',        t: 'Starkes Filmkorn, 16mm Look' },
    { v: 'Light Film Grain',        t: 'Subtiles Korn, 35mm Look' },
    { v: 'Anamorphic Lens Flares',  t: 'Horizontale Lens Flares' },
    { v: 'Subtle Lens Flare',       t: 'Leichte Gegenlicht-Blendfackeln' },
    { v: 'Creamy Bokeh',            t: 'Weiches, cremiges Unschärfebild' },
    { v: 'Strong Vignette',         t: 'Starke Randabdunkelung' },
    { v: 'Soft Vignette',           t: 'Sanfte Randabdunkelung' },
    { v: 'Chromatic Aberration',    t: 'Farbsäume an Kontrastkanten' },
    { v: 'Halation',                t: 'Filmisches Leuchten um helle Stellen' },
    { v: 'Soft Glow',               t: 'Sanfter Schimmer auf Lichtern' },
    { v: 'Sharp / Clinical',        t: 'Ultra-scharf, keine Weichheit' },
    { v: 'Motion Blur',             t: 'Bewegungsunschärfe bei Dynamik' },
  ],

  negative: [
    { v: 'blurry',          t: 'Unscharf / Verwackelt' },
    { v: 'overexposed',     t: 'Überbelichtet' },
    { v: 'underexposed',    t: 'Unterbelichtet' },
    { v: 'low quality',     t: 'Niedrige Qualität' },
    { v: 'watermark',       t: 'Wasserzeichen' },
    { v: 'distorted',       t: 'Verzerrt / Deformiert' },
    { v: 'ugly',            t: 'Unattraktiv' },
    { v: 'cartoon',         t: 'Cartoon-Style' },
    { v: 'anime',           t: 'Anime-Style' },
    { v: 'text / subtitles',t: 'Text oder Untertitel im Bild' },
    { v: 'duplicate',       t: 'Doppelte Elemente' },
    { v: 'noise',           t: 'Digitales Rauschen' },
  ],

  shotsize: [
    { v: 'Extreme Close-Up (ECU)', t: 'Extrem nah – einzelnes Detail (Auge, Lippe, Hand)' },
    { v: 'Close-Up (CU)',          t: 'Gesicht oder Detail füllt das Bild' },
    { v: 'Medium Close-Up (MCU)', t: 'Kopf bis Schultern' },
    { v: 'Medium Shot (MS)',       t: 'Taille aufwärts' },
    { v: 'Medium Long Shot (MLS)', t: 'Knie aufwärts' },
    { v: 'Full Shot (FS)',         t: 'Gesamte Person im Bild' },
    { v: 'Long Shot (LS)',         t: 'Person klein, Umgebung dominant' },
    { v: 'Extreme Long Shot (ELS)',t: 'Epische Weite, winzige Figur' },
    { v: 'Two-Shot',               t: 'Zwei Personen gleichzeitig im Bild' },
    { v: 'Over-the-Shoulder',      t: 'Über die Schulter einer Person gefilmt' },
    { v: 'POV Shot',               t: 'Aus der subjektiven Sicht der Figur' },
    { v: 'Insert Shot',            t: 'Detailaufnahme eines Objekts / Textes' },
  ],

  cameraangle: [
    { v: 'Eye Level',    t: 'Auf Augenhöhe – neutral, natürlich' },
    { v: 'High Angle',  t: 'Von oben herab – Figur wirkt klein / schwach' },
    { v: 'Low Angle',   t: 'Von unten – Figur wirkt mächtig / bedrohlich' },
    { v: "Bird's Eye",  t: 'Vogelperspektive – direkt senkrecht von oben' },
    { v: "Worm's Eye",  t: 'Wurmperspektive – extrem nah am Boden' },
    { v: 'Dutch Angle', t: 'Schräggestellte Kamera – erzeugt Unbehagen' },
    { v: 'Aerial',      t: 'Aus der Luft – Drohnen- oder Hubschrauberperspektive' },
  ],

  aspectratio: [
    { v: '2.39:1', t: 'Anamorphic Cinemascope – klassisches Kinoformat' },
    { v: '2.35:1', t: 'Scope-Format – großes Kino der 60er–90er' },
    { v: '1.85:1', t: 'Flat Widescreen – modernes Kinoformat' },
    { v: '16:9',   t: 'Standard Widescreen – Streaming & TV' },
    { v: '4:3',    t: 'Klassisch retro – Vintage Film & TV' },
    { v: '1:1',    t: 'Quadratisch – Social Media / Art House' },
    { v: '9:16',   t: 'Vertikal – Reels, Shorts, TikTok' },
  ],
};

// ── State ──────────────────────────────────────────────────
const state = {
  scene:       '',
  style:       null,
  camera:      null,
  lens:        null,
  focal:       null,
  aperture:    null,
  aspectratio: null,
  shotsize:    null,
  cameraangle: null,
  lighting:    new Set(),
  colorgrade:  null,
  movement:    null,
  effects:     new Set(),
  negative:    new Set(),
  negativeCustom: '',
  qualitySuffix:  true,
};

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderAllChips();
  bindEvents();
  updatePrompt();
});

// ── Render Chips ───────────────────────────────────────────
function renderAllChips() {
  Object.entries(DATA).forEach(([group, items]) => {
    const container = document.querySelector(`.chips[data-group="${group}"]`);
    if (!container) return;

    container.innerHTML = '';
    items.forEach(({ v, t, dof }) => {
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.textContent = v;
      btn.dataset.value = v;
      btn.dataset.group = group;
      if (dof) btn.dataset.dof = dof;
      btn.title = t;
      container.appendChild(btn);
    });
  });
}

// ── Event Binding ──────────────────────────────────────────
function bindEvents() {
  // Scene textarea
  document.getElementById('sceneInput').addEventListener('input', e => {
    state.scene = e.target.value.trim();
    updatePrompt();
  });

  // Negative custom input
  document.getElementById('negativeInput').addEventListener('input', e => {
    state.negativeCustom = e.target.value.trim();
    updatePrompt();
  });

  // Chip clicks – event delegation per container
  document.querySelectorAll('.chips').forEach(container => {
    container.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;

      const group = chip.dataset.group;
      const value = chip.dataset.value;
      const mode  = container.dataset.mode;

      if (mode === 'single') {
        const current = state[group];
        if (current === value) {
          state[group] = null;
          chip.classList.remove('active');
        } else {
          container.querySelectorAll('.chip.active').forEach(c => c.classList.remove('active'));
          state[group] = value;
          chip.classList.add('active');
        }
      } else {
        // multi-select (Set)
        const set = state[group];
        if (set.has(value)) {
          set.delete(value);
          chip.classList.remove('active');
        } else {
          set.add(value);
          chip.classList.add('active');
        }
      }

      updatePrompt();
    });
  });

  // Accordion headers
  document.querySelectorAll('.section-header').forEach(header => {
    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', String(!expanded));
      const bodyId = header.dataset.target;
      const body   = document.getElementById(bodyId);
      if (body) body.classList.toggle('collapsed', expanded);
    });
  });

  // Quality suffix toggle
  document.getElementById('qualityToggle').addEventListener('click', () => {
    state.qualitySuffix = !state.qualitySuffix;
    const dot   = document.getElementById('qualityDot');
    const label = document.getElementById('qualityLabel');
    dot.classList.toggle('active', state.qualitySuffix);
    label.textContent = state.qualitySuffix ? '8K Suffix' : 'Suffix aus';
    updatePrompt();
  });

  // Copy
  document.getElementById('copyBtn').addEventListener('click', handleCopy);

  // Insert into page
  document.getElementById('insertBtn').addEventListener('click', handleInsert);

  // Reset
  document.getElementById('resetBtn').addEventListener('click', handleReset);

  // Random Inspiration
  document.getElementById('randomBtn').addEventListener('click', handleRandom);

  // CineGrid öffnen
  document.getElementById('gridBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('grid/index.html') });
  });
}

// ── Build Prompt ───────────────────────────────────────────
function buildPromptParts() {
  const parts = [];

  if (state.scene)      parts.push({ cls: 'p-scene',    text: state.scene });
  if (state.style)      parts.push({ cls: 'p-style',    text: `${state.style} cinematic style` });

  // Shot size & camera angle
  const shot = [];
  if (state.shotsize)    shot.push(state.shotsize);
  if (state.cameraangle) shot.push(`${state.cameraangle} angle`);
  if (shot.length) parts.push({ cls: 'p-shot', text: shot.join(', ') });

  // Camera block
  const cam = [];
  if (state.camera)  cam.push(`shot on ${state.camera}`);
  if (state.lens)    cam.push(`${state.lens} lens`);
  if (state.focal)   cam.push(`${state.focal} focal length`);
  if (state.aperture) {
    const item = DATA.aperture.find(a => a.v === state.aperture);
    const dofHint = item ? `, ${item.dof} depth of field` : '';
    cam.push(`${state.aperture} aperture${dofHint}`);
  }
  if (state.aspectratio) cam.push(`${state.aspectratio} aspect ratio`);
  if (cam.length) parts.push({ cls: 'p-camera', text: cam.join(', ') });

  if (state.lighting.size > 0) {
    parts.push({ cls: 'p-lighting', text: [...state.lighting].join(' + ') + ' lighting' });
  }

  if (state.colorgrade) {
    parts.push({ cls: 'p-color', text: `${state.colorgrade} color grade` });
  }

  if (state.movement) {
    parts.push({ cls: 'p-movement', text: `${state.movement} camera movement` });
  }

  if (state.effects.size > 0) {
    parts.push({ cls: 'p-effects', text: [...state.effects].join(', ') });
  }

  if (state.qualitySuffix && parts.length > 0) {
    parts.push({ cls: 'p-quality', text: 'ultra detailed, photorealistic, 8K cinema quality' });
  }

  return parts;
}

function buildNegativeParts() {
  const neg = [...state.negative];
  if (state.negativeCustom) {
    neg.push(...state.negativeCustom.split(',').map(s => s.trim()).filter(Boolean));
  }
  return neg;
}

function buildPromptString() {
  return buildPromptParts().map(p => p.text).join(', ');
}

// ── Update Prompt UI ───────────────────────────────────────
function updatePrompt() {
  const parts = buildPromptParts();
  const box   = document.getElementById('promptBox');
  const count = document.getElementById('promptCount');
  const copyBtn   = document.getElementById('copyBtn');
  const insertBtn = document.getElementById('insertBtn');

  if (parts.length === 0) {
    box.innerHTML = '<p class="prompt-placeholder">Wähle Optionen oben um deinen Prompt zu bauen…</p>';
    box.classList.remove('has-content');
    count.textContent = '0 Zeichen';
    copyBtn.disabled  = true;
    insertBtn.disabled = true;
    return;
  }

  // Build highlighted HTML
  const html = parts
    .map(({ cls, text }) =>
      `<span class="${cls}">${escHtml(text)}</span>`
    )
    .join('<span style="color:var(--t-2)">, </span>');

  box.innerHTML = `<p class="prompt-text">${html}</p>`;
  box.classList.add('has-content');

  const fullText = buildPromptString();
  count.textContent = `${fullText.length} Zeichen`;
  copyBtn.disabled  = false;
  insertBtn.disabled = false;
}

// ── Handlers ───────────────────────────────────────────────
async function handleCopy() {
  const prompt = buildPromptString();
  if (!prompt) return;

  try {
    await navigator.clipboard.writeText(prompt);
    flashBtn('copyBtn', '✓ Kopiert!', 'success');
  } catch {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = prompt;
    ta.style.position = 'fixed';
    ta.style.opacity  = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    flashBtn('copyBtn', '✓ Kopiert!', 'success');
  }
}

async function handleInsert() {
  const prompt = buildPromptString();
  if (!prompt) return;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func:   injectPromptIntoPage,
      args:   [prompt],
    });
    const ok = results?.[0]?.result;
    if (ok) {
      flashBtn('insertBtn', '✓ Eingefügt!', 'success');
    } else {
      flashBtn('insertBtn', '✗ Kein Feld', null);
    }
  } catch (err) {
    console.error('Insert error:', err);
    flashBtn('insertBtn', '✗ Fehler', null);
  }
}

function handleReset() {
  // Clear state
  state.scene           = '';
  state.style           = null;
  state.camera          = null;
  state.lens            = null;
  state.focal           = null;
  state.aperture        = null;
  state.aspectratio     = null;
  state.shotsize        = null;
  state.cameraangle     = null;
  state.lighting        = new Set();
  state.colorgrade      = null;
  state.movement        = null;
  state.effects         = new Set();
  state.negative        = new Set();
  state.negativeCustom  = '';

  // Clear UI
  document.getElementById('sceneInput').value   = '';
  document.getElementById('negativeInput').value = '';
  document.querySelectorAll('.chip.active').forEach(c => c.classList.remove('active'));

  updatePrompt();
}

function handleRandom() {
  // Pick random single value from a DATA group (or null with ~20% chance)
  function pickOne(group) {
    const items = DATA[group];
    if (!items || Math.random() < 0.15) return null;
    return items[Math.floor(Math.random() * items.length)].v;
  }

  // Pick random multi values from a DATA group (0–2 items)
  function pickMulti(group, max = 2) {
    const items = DATA[group];
    if (!items) return new Set();
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const count = Math.floor(Math.random() * (max + 1));
    return new Set(shuffled.slice(0, count).map(i => i.v));
  }

  // Reset state silently
  handleReset();

  // Apply random selections
  state.style       = pickOne('style');
  state.camera      = pickOne('camera');
  state.lens        = pickOne('lens');
  state.focal       = pickOne('focal');
  state.aperture    = pickOne('aperture');
  state.aspectratio = pickOne('aspectratio');
  state.shotsize    = pickOne('shotsize');
  state.cameraangle = pickOne('cameraangle');
  state.colorgrade  = pickOne('colorgrade');
  state.movement    = pickOne('movement');
  state.lighting    = pickMulti('lighting', 2);
  state.effects     = pickMulti('effects', 2);

  // Sync UI chips
  document.querySelectorAll('.chip').forEach(chip => {
    const group = chip.dataset.group;
    const value = chip.dataset.value;
    const stateVal = state[group];
    const isActive = stateVal instanceof Set
      ? stateVal.has(value)
      : stateVal === value;
    chip.classList.toggle('active', isActive);
  });

  updatePrompt();
  flashBtn('randomBtn', '✓', 'success');
}

function flashBtn(id, label, cls) {
  const btn  = document.getElementById(id);
  const orig = btn.innerHTML;
  const origCls = btn.className;

  if (cls) btn.classList.add(cls);
  btn.innerHTML = label;

  setTimeout(() => {
    btn.innerHTML   = orig;
    btn.className   = origCls;
  }, 2000);
}

// ── Page Injection (runs in page context) ──────────────────
function injectPromptIntoPage(prompt) {
  // Priority selectors for NanoBanana Pro and generic AI tools
  const selectors = [
    // NanoBanana-specific guesses
    '[data-testid="prompt-input"]',
    '[class*="prompt-input"]',
    '[class*="promptInput"]',
    '[placeholder*="prompt" i]',
    '[placeholder*="describe" i]',
    '[placeholder*="enter" i]',
    // Generic
    'textarea:not([readonly]):not([disabled])',
    '[contenteditable="true"]',
    'input[type="text"]:not([readonly]):not([disabled])',
  ];

  let target = null;

  for (const sel of selectors) {
    const candidates = [...document.querySelectorAll(sel)];
    const visible    = candidates.find(el =>
      el.offsetParent !== null &&
      getComputedStyle(el).visibility !== 'hidden' &&
      getComputedStyle(el).display !== 'none'
    );
    if (visible) { target = visible; break; }
  }

  if (!target) return false;

  target.focus();

  if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
    // Use native setter to trigger React/Vue reactivity
    const proto = target.tagName === 'TEXTAREA'
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;

    if (setter) setter.call(target, prompt);
    else target.value = prompt;

    target.dispatchEvent(new Event('input',  { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    // contenteditable
    target.textContent = '';
    document.execCommand('insertText', false, prompt);
    if (!target.textContent) {
      target.textContent = prompt;
      target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  return true;
}

// ── Util ───────────────────────────────────────────────────
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
