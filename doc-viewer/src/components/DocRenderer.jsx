import React from 'react';
import { parseDocument, formatInline } from '../lib/parser';

function InlineContent({ text }) {
  const tokens = formatInline(text);
  return tokens.map((t, i) => {
    if (t.type === 'link') return <a key={i} href={t.text} target="_blank" rel="noopener noreferrer">{t.text}</a>;
    if (t.type === 'code') return <code key={i}>{t.text}</code>;
    if (t.type === 'bold') return <strong key={i}>{t.text}</strong>;
    return <React.Fragment key={i}>{t.text}</React.Fragment>;
  });
}

function Block({ block }) {
  switch (block.type) {
    case 'heading': {
      const Tag = `h${Math.min(block.level, 4)}`;
      return <Tag><InlineContent text={block.content} /></Tag>;
    }
    case 'paragraph':
      return (
        <p>
          {block.content.split('\n').map((line, i, arr) => (
            <React.Fragment key={i}>
              <InlineContent text={line} />
              {i < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag>
          {block.items.map((item, i) => (
            <li key={i}><InlineContent text={item} /></li>
          ))}
        </Tag>
      );
    }
    case 'quote':
      return (
        <blockquote>
          {block.content.split('\n').map((line, i, arr) => (
            <React.Fragment key={i}>
              <InlineContent text={line} />
              {i < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </blockquote>
      );
    case 'divider':
      return <hr />;
    default:
      return null;
  }
}

export default function DocRenderer({ content, searchQuery }) {
  const blocks = parseDocument(content);

  if (!blocks.length) {
    return <div className="doc-empty">Leeres Dokument</div>;
  }

  return (
    <article className="doc-rendered">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </article>
  );
}
