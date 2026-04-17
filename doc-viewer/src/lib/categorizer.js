const CATEGORIES = [
  {
    id: 'seengrid',
    label: 'SeenGrid',
    color: '#2bb5b2',
    keywords: ['seengrid', 'seen grid', 'grid creator', 'grid operator', 'grid engine',
      'custom builder', 'prompt builder', 'look lab', 'prompt vault',
      'panel role', 'compile order', 'case catalog', 'module catalog'],
  },
  {
    id: 'film',
    label: 'Film & Produktion',
    color: '#e6994a',
    keywords: ['film', 'kino', 'szene', 'scene', 'drehbuch', 'screenplay', 'script',
      'character', 'charakter', 'storyboard', 'shot', 'frame', 'startframe',
      'cinematic', 'kamera', 'camera', 'regie', 'director', 'produktion',
      'production', 'post-production', 'editing', 'schnitt', 'color grading',
      'lighting', 'beleuchtung', 'set design', 'kostüm', 'costume'],
  },
  {
    id: 'ai-prompts',
    label: 'AI & Prompts',
    color: '#a78bfa',
    keywords: ['prompt', 'nanobanana', 'nano banana', 'midjourney', 'stable diffusion',
      'dall-e', 'dalle', 'chatgpt', 'gpt', 'grok', 'claude', 'anthropic',
      'comfyui', 'automatic1111', 'controlnet', 'lora', 'checkpoint',
      'negative prompt', 'cfg scale', 'sampler', 'seed', 'img2img',
      'txt2img', 'inpaint', 'upscale', 'ki-bild', 'ai image', 'generierung'],
  },
  {
    id: 'story',
    label: 'Story & Konzept',
    color: '#f472b6',
    keywords: ['story', 'geschichte', 'plot', 'narrative', 'erzählung',
      'konzept', 'concept', 'idee', 'idea', 'vision', 'brainstorm',
      'worldbuilding', 'world building', 'universe', 'universum',
      'protagonist', 'antagonist', 'konflikt', 'conflict', 'arc',
      'akt', 'act', 'kapitel', 'chapter', 'synopsis', 'treatment'],
  },
  {
    id: 'technik',
    label: 'Technik & Dev',
    color: '#60a5fa',
    keywords: ['code', 'vite', 'react', 'javascript', 'typescript', 'api',
      'server', 'deploy', 'vercel', 'netlify', 'github', 'git',
      'npm', 'node', 'css', 'html', 'component', 'database',
      'hosting', 'domain', 'bug', 'fix', 'feature', 'repository'],
  },
  {
    id: 'business',
    label: 'Business & Strategie',
    color: '#fbbf24',
    keywords: ['strategie', 'strategy', 'business', 'monetization', 'monetarisierung',
      'pricing', 'preis', 'launch', 'roadmap', 'milestone', 'zielgruppe',
      'target audience', 'marketing', 'branding', 'konkurrenz', 'competition',
      'revenue', 'umsatz', 'kosten', 'budget', 'investor', 'pitch'],
  },
  {
    id: 'notizen',
    label: 'Notizen',
    color: '#7a8ba0',
    keywords: [],
  },
];

export function categorize(content) {
  if (!content) return 'notizen';

  const lower = content.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const cat of CATEGORIES) {
    if (cat.keywords.length === 0) continue;
    let score = 0;
    for (const kw of cat.keywords) {
      const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = lower.match(regex);
      if (matches) {
        score += matches.length * kw.split(' ').length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = cat.id;
    }
  }

  return bestMatch || 'notizen';
}

export function autoName(content, filename) {
  if (!content || !content.trim()) return filename;

  const lines = content.trim().split('\n').filter(l => l.trim().length > 0);
  if (!lines.length) return filename;

  let candidate = lines[0].trim();

  candidate = candidate.replace(/^[#*\-=>\s]+/, '').trim();

  if (candidate.length < 3 && lines.length > 1) {
    candidate = lines[1].trim().replace(/^[#*\-=>\s]+/, '').trim();
  }

  if (candidate.length > 60) {
    const cut = candidate.substring(0, 57);
    const lastSpace = cut.lastIndexOf(' ');
    candidate = (lastSpace > 30 ? cut.substring(0, lastSpace) : cut) + '...';
  }

  return candidate || filename;
}

export function getCategory(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

export function getAllCategories() {
  return CATEGORIES;
}
