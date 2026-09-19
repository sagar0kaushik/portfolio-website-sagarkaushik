import React, { useState } from 'react';
import { Check, Copy, Info, AlertTriangle, Lightbulb, ExternalLink } from 'lucide-react';

export const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  // Render inline formatting: code, bold, italic, underline, strike, links
  const renderInline = (text) => {
    if (!text) return null;

    // Tokenize text into inline parts
    const parts = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Inline code: `code`
      const codeMatch = remaining.match(/^`([^`]+)`/);
      if (codeMatch) {
        parts.push(
          <code key={key++} className="px-1.5 py-0.5 mx-0.5 rounded bg-[#073B32]/10 text-[#073B32] font-mono text-xs font-semibold">
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // Bold: **text** or __text__
      const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
      if (boldMatch) {
        parts.push(<strong key={key++} className="font-bold text-[#073B32]">{renderInline(boldMatch[2])}</strong>);
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // Underline: <u>text</u>
      const underlineMatch = remaining.match(/^<u>(.*?)<\/u>/i);
      if (underlineMatch) {
        parts.push(<u key={key++} className="underline underline-offset-2">{renderInline(underlineMatch[1])}</u>);
        remaining = remaining.slice(underlineMatch[0].length);
        continue;
      }

      // Strikethrough: ~~text~~
      const strikeMatch = remaining.match(/^~~(.*?)~~/);
      if (strikeMatch) {
        parts.push(<del key={key++} className="line-through text-gray-500">{renderInline(strikeMatch[1])}</del>);
        remaining = remaining.slice(strikeMatch[0].length);
        continue;
      }

      // Italic: *text* or _text_
      const italicMatch = remaining.match(/^(\*|_)(.*?)\1/);
      if (italicMatch && !italicMatch[2].includes('\n')) {
        parts.push(<em key={key++} className="italic text-[#073B32]">{renderInline(italicMatch[2])}</em>);
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // Link: [text](url)
      const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const isExternal = linkMatch[2].startsWith('http');
        parts.push(
          <a
            key={key++}
            href={linkMatch[2]}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-[#315BDD] underline underline-offset-2 font-medium hover:text-[#073B32] transition-colors inline-flex items-center gap-0.5"
          >
            <span>{linkMatch[1]}</span>
            {isExternal && <ExternalLink className="w-3 h-3 inline" />}
          </a>
        );
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }

      // Plain text up to next special symbol
      const nextSpecial = remaining.search(/[`*_~\[<]/);
      if (nextSpecial === -1) {
        parts.push(remaining);
        break;
      } else if (nextSpecial === 0) {
        parts.push(remaining[0]);
        remaining = remaining.slice(1);
      } else {
        parts.push(remaining.slice(0, nextSpecial));
        remaining = remaining.slice(nextSpecial);
      }
    }

    return parts;
  };

  // Helper for Code Block with Copy Button
  const CodeBlock = ({ language, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="my-6 rounded-lg overflow-hidden border border-[#073B32]/20 bg-[#0d1f1a] text-emerald-100 shadow-md">
        <div className="flex items-center justify-between px-4 py-2 bg-[#081814] border-b border-[#073B32]/40 text-xs font-mono text-emerald-400/80">
          <span className="uppercase font-bold tracking-wider">{language || 'CODE'}</span>
          <button
            onClick={handleCopy}
            type="button"
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#073B32]/40 hover:bg-[#315BDD] text-white transition-colors text-[11px]"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed selection:bg-emerald-800">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  // Parse lines into high-level structural blocks
  const lines = content.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 1. Fenced Code Blocks (```lang ... ```)
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <CodeBlock key={`code-${i}`} language={lang} code={codeLines.join('\n')} />
      );
      i++;
      continue;
    }

    // 2. Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-3xl sm:text-4xl font-extrabold text-[#073B32] tracking-tight mt-10 mb-4 first:mt-2">
          {renderInline(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-2xl sm:text-3xl font-extrabold text-[#073B32] tracking-tight mt-8 mb-3 border-b border-[#073B32]/12 pb-2">
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-xl sm:text-2xl font-bold text-[#073B32] tracking-tight mt-6 mb-2">
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="text-lg font-bold text-[#073B32] mt-4 mb-2">
          {renderInline(line.slice(5))}
        </h4>
      );
      i++;
      continue;
    }

    // 3. Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
      elements.push(
        <hr key={`hr-${i}`} className="my-8 border-t border-[#073B32]/16" />
      );
      i++;
      continue;
    }

    // 4. Callout / Alert boxes (> [!NOTE], > [!TIP], > [!WARNING], > [!CAUTION], > [!IMPORTANT])
    const calloutMatch = line.match(/^>\s*\[!(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]/i);
    if (calloutMatch) {
      const type = calloutMatch[1].toUpperCase();
      const calloutLines = [];
      i++;
      while (i < lines.length && lines[i].startsWith('>')) {
        calloutLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }

      let badgeBg = 'bg-blue-50/80 border-blue-300 text-blue-900';
      let IconComp = Info;
      if (type === 'TIP') {
        badgeBg = 'bg-emerald-50/80 border-emerald-300 text-emerald-900';
        IconComp = Lightbulb;
      } else if (type === 'WARNING' || type === 'CAUTION') {
        badgeBg = 'bg-amber-50/80 border-amber-300 text-amber-900';
        IconComp = AlertTriangle;
      }

      elements.push(
        <aside key={`callout-${i}`} className={`my-6 p-4 rounded-lg border-l-4 shadow-sm ${badgeBg} font-sans`}>
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <IconComp className="w-4 h-4" />
            <span>{type}</span>
          </div>
          <div className="text-sm leading-relaxed space-y-2">
            {calloutLines.map((cl, idx) => (
              <p key={idx}>{renderInline(cl)}</p>
            ))}
          </div>
        </aside>
      );
      continue;
    }

    // 5. Standard Blockquote (> text)
    if (line.startsWith('>')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      elements.push(
        <blockquote key={`quote-${i}`} className="my-6 pl-4 border-l-4 border-[#315BDD] italic text-base text-[#073B32]/90 bg-white/40 py-2 rounded-r">
          {quoteLines.map((ql, idx) => (
            <p key={idx} className="mb-1 last:mb-0">{renderInline(ql)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // 6. YouTube Embed: [youtube](url) or standalone youtube url
    const ytMatch = line.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch && (line.trim().startsWith('http') || line.trim().startsWith('[youtube]'))) {
      const videoId = ytMatch[1];
      elements.push(
        <div key={`yt-${i}`} className="my-8 aspect-video rounded-xl overflow-hidden border border-[#073B32]/20 shadow-lg">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      );
      i++;
      continue;
    }

    // 7. Standalone Images: ![alt|alignment](url)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      const rawAlt = imgMatch[1];
      const url = imgMatch[2];
      const [altText, align = 'center'] = rawAlt.split('|');

      const alignClass = align === 'left'
        ? 'mr-auto text-left'
        : align === 'right'
        ? 'ml-auto text-right'
        : 'mx-auto text-center';

      elements.push(
        <figure key={`img-${i}`} className={`my-8 max-w-3xl ${alignClass}`}>
          <img
            src={url}
            alt={altText || 'Blog image'}
            loading="lazy"
            className="rounded-xl border border-[#073B32]/16 shadow-md max-h-[480px] w-full object-cover"
          />
          {altText && (
            <figcaption className="mt-2 font-mono text-xs text-[#718078] tracking-wide">
              {altText}
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    // 8. Markdown Table (| Col 1 | Col 2 |)
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0].split('|').slice(1, -1).map(c => c.trim());
        const bodyRows = tableLines.slice(2).map(r => r.split('|').slice(1, -1).map(c => c.trim()));

        elements.push(
          <div key={`table-${i}`} className="my-6 overflow-x-auto rounded-lg border border-[#073B32]/18 bg-white/60 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead className="bg-[#073B32] text-[#F3F0E6] font-mono uppercase tracking-wider text-xs">
                <tr>
                  {headerRow.map((h, hi) => (
                    <th key={hi} className="p-3 border-b border-[#073B32]/20 font-bold">
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#073B32]/10 font-sans">
                {bodyRows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-white/80 transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className="p-3 text-[#073B32]">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 9. Checklists (- [ ] or - [x])
    if (line.match(/^-\s*\[([ xX])\]\s+(.*)/)) {
      const checkItems = [];
      while (i < lines.length) {
        const cm = lines[i].match(/^-\s*\[([ xX])\]\s+(.*)/);
        if (!cm) break;
        checkItems.push({ checked: cm[1].toLowerCase() === 'x', text: cm[2] });
        i++;
      }

      elements.push(
        <ul key={`checklist-${i}`} className="my-4 space-y-2 font-sans text-sm sm:text-base">
          {checkItems.map((item, ci) => (
            <li key={ci} className="flex items-start gap-2.5">
              <input
                type="checkbox"
                readOnly
                checked={item.checked}
                className="mt-1 rounded text-[#315BDD] border-gray-300 pointer-events-none"
              />
              <span className={item.checked ? 'line-through text-gray-500' : 'text-[#073B32]'}>
                {renderInline(item.text)}
              </span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 10. Bullet Lists (- or * )
    if (line.match(/^[\*\-]\s+(.*)/)) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^[\*\-]\s+(.*)/)) {
        listItems.push(lines[i].replace(/^[\*\-]\s+/, ''));
        i++;
      }

      elements.push(
        <ul key={`ul-${i}`} className="my-4 space-y-1.5 list-disc list-inside font-sans text-sm sm:text-base text-[#073B32] pl-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 11. Numbered Lists (1. )
    if (line.match(/^\d+\.\s+(.*)/)) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s+(.*)/)) {
        listItems.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }

      elements.push(
        <ol key={`ol-${i}`} className="my-4 space-y-1.5 list-decimal list-inside font-sans text-sm sm:text-base text-[#073B32] pl-2 font-semibold">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed font-normal">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 12. Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // 13. Regular Paragraph
    elements.push(
      <p key={`p-${i}`} className="my-3 font-sans text-base leading-relaxed text-[#073B32]">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div className="article-body-rendered">{elements}</div>;
};

export default MarkdownRenderer;
