const URL_RE = /https?:\/\/[^\s<>"')\]]+/g;
const BOLD_RE = /\*\*(.+?)\*\*|__(.+?)__/g;
const ITALIC_RE = /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)|(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g;
const INLINE_CODE_RE = /`([^`]+)`/g;

export function parseDocument(text) {
  if (!text || !text.trim()) return [];

  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const nextLine = lines[i + 1];

    if (line.trim() === '') {
      i++;
      continue;
    }

    if (nextLine && /^={3,}\s*$/.test(nextLine)) {
      blocks.push({ type: 'heading', level: 1, content: line.trim() });
      i += 2;
      continue;
    }

    if (nextLine && /^-{3,}\s*$/.test(nextLine)) {
      blocks.push({ type: 'heading', level: 2, content: line.trim() });
      i += 2;
      continue;
    }

    const mdHeading = line.match(/^(#{1,4})\s+(.+)/);
    if (mdHeading) {
      blocks.push({ type: 'heading', level: mdHeading[1].length, content: mdHeading[2].trim() });
      i++;
      continue;
    }

    if (isCapsHeading(line)) {
      blocks.push({ type: 'heading', level: 2, content: line.trim() });
      i++;
      continue;
    }

    if (/^[-*•]\s+/.test(line.trim())) {
      const items = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i]?.trim())) {
        items.push(lines[i].trim().replace(/^[-*•]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'list', ordered: false, items });
      continue;
    }

    if (/^\d+[.)]\s+/.test(line.trim())) {
      const items = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i]?.trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'list', ordered: true, items });
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'quote', content: quoteLines.join('\n') });
      continue;
    }

    if (/^---\s*$/.test(line) || /^\*\*\*\s*$/.test(line) || /^___\s*$/.test(line)) {
      blocks.push({ type: 'divider' });
      i++;
      continue;
    }

    const paraLines = [];
    while (i < lines.length && lines[i]?.trim() !== '' && !isBlockStart(lines[i], lines[i + 1])) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', content: paraLines.join('\n') });
    } else {
      i++;
    }
  }

  return blocks;
}

function isCapsHeading(line) {
  const trimmed = line.trim();
  if (trimmed.length < 3 || trimmed.length > 80) return false;
  const letters = trimmed.replace(/[^a-zA-ZÄÖÜäöü]/g, '');
  if (letters.length < 3) return false;
  return letters === letters.toUpperCase() && !/^\d+[.)]\s/.test(trimmed);
}

function isBlockStart(line, nextLine) {
  if (!line) return false;
  const t = line.trim();
  if (/^#{1,4}\s+/.test(t)) return true;
  if (/^[-*•]\s+/.test(t)) return true;
  if (/^\d+[.)]\s+/.test(t)) return true;
  if (/^>\s?/.test(t)) return true;
  if (/^---\s*$/.test(t) || /^\*\*\*\s*$/.test(t)) return true;
  if (isCapsHeading(t)) return true;
  if (nextLine && /^={3,}\s*$/.test(nextLine)) return true;
  if (nextLine && /^-{3,}\s*$/.test(nextLine.trim()) && t.length > 0) return true;
  return false;
}

export function formatInline(text) {
  if (!text) return [text];

  const parts = [];
  let remaining = text;
  let key = 0;

  const tokenize = (str) => {
    const tokens = [];
    let last = 0;

    const allMatches = [];

    for (const m of str.matchAll(URL_RE)) {
      allMatches.push({ type: 'link', start: m.index, end: m.index + m[0].length, text: m[0] });
    }
    for (const m of str.matchAll(INLINE_CODE_RE)) {
      allMatches.push({ type: 'code', start: m.index, end: m.index + m[0].length, text: m[1] });
    }
    for (const m of str.matchAll(BOLD_RE)) {
      allMatches.push({ type: 'bold', start: m.index, end: m.index + m[0].length, text: m[1] || m[2] });
    }

    allMatches.sort((a, b) => a.start - b.start);

    const used = [];
    const filtered = allMatches.filter(m => {
      if (used.some(u => m.start < u.end && m.end > u.start)) return false;
      used.push(m);
      return true;
    });

    for (const match of filtered) {
      if (match.start > last) {
        tokens.push({ type: 'text', text: str.slice(last, match.start) });
      }
      tokens.push(match);
      last = match.end;
    }
    if (last < str.length) {
      tokens.push({ type: 'text', text: str.slice(last) });
    }

    return tokens;
  };

  return tokenize(remaining);
}
