/**
 * 现代轻量 Markdown 解析与排版引擎（支持嵌套列表、层级编号、金融专业长文排版）
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseInline(text: string): string {
  if (!text) return '';
  // 1. 行内代码
  let res = text.replace(/`([^`]+)`/g, (_, code) => `<code>${escapeHtml(code)}</code>`);
  // 2. 粗斜体、粗体、斜体
  res = res.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  res = res.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  res = res.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // 3. 删除线
  res = res.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  // 4. 链接 [text](url)
  res = res.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return res;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractToc(source: string): TocItem[] {
  if (!source) return [];
  const lines = source.split(/\r?\n/);
  const items: TocItem[] = [];
  let inCodeBlock = false;
  let headingIndex = 0;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock || !trimmed) continue;

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const plainText = headingMatch[2]
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[*_~`]/g, '')
        .trim();
      items.push({
        id: `heading-${headingIndex++}`,
        text: plainText,
        level,
      });
    }
  }

  return items;
}

/**
 * 针对星友试读场景截取长文预览：统一按全文 20% 直接截断
 */
export function getPreviewMarkdown(source: string): { preview: string; isCut: boolean } {
  if (!source) return { preview: '', isCut: false };
  const lines = source.split(/\r?\n/);

  const cut = Math.max(1, Math.floor(lines.length * 0.2));
  if (cut >= lines.length) {
    return { preview: source, isCut: false };
  }
  return {
    preview: lines.slice(0, cut).join('\n'),
    isCut: true
  };
}

export function renderMarkdown(source: string): string {
  if (!source) return '';

  const lines = source.split(/\r?\n/);
  const output: string[] = [];

  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockContent: string[] = [];

  let inOl = false;
  let inSubUl = false;
  let inUl = false;
  let inBlockquote = false;
  let blockquoteContent: string[] = [];
  let inTable = false;
  let headingIndex = 0;

  const closeSubUl = () => {
    if (inSubUl) {
      output.push('</ul></li>');
      inSubUl = false;
    }
  };

  const closeList = () => {
    closeSubUl();
    if (inOl) {
      output.push('</ol>');
      inOl = false;
    }
    if (inUl) {
      output.push('</ul>');
      inUl = false;
    }
  };

  const closeBlockquote = () => {
    if (inBlockquote) {
      output.push(`<blockquote>${blockquoteContent.join('<br/>')}</blockquote>`);
      inBlockquote = false;
      blockquoteContent = [];
    }
  };

  const closeTable = () => {
    if (inTable) {
      output.push('</tbody></table>');
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. 代码块 ```
    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        closeList();
        closeBlockquote();
        closeTable();
        inCodeBlock = true;
        codeBlockLang = trimmed.slice(3).trim();
        codeBlockContent = [];
      } else {
        inCodeBlock = false;
        const codeText = escapeHtml(codeBlockContent.join('\n'));
        output.push(`<pre><code class="${codeBlockLang ? `language-${codeBlockLang}` : ''}">${codeText}</code></pre>`);
        codeBlockContent = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(rawLine);
      continue;
    }

    // 2. 空行
    if (!trimmed) {
      closeBlockquote();
      closeTable();
      // 在列表中遇到空行不轻易关闭 ol，避免隔行序号断裂
      continue;
    }

    // 3. 块级引用 >
    if (trimmed.startsWith('>')) {
      closeList();
      closeTable();
      inBlockquote = true;
      blockquoteContent.push(parseInline(trimmed.replace(/^>\s*/, '')));
      continue;
    } else {
      closeBlockquote();
    }

    // 4. 水平分割线
    if (/^(---|\*\*\*|___)$/.test(trimmed)) {
      closeList();
      closeTable();
      output.push('<hr/>');
      continue;
    }

    // 5. 标题 # ~ ######，附加 anchor id
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      closeList();
      closeTable();
      const level = headingMatch[1].length;
      const content = parseInline(headingMatch[2]);
      const anchorId = `heading-${headingIndex++}`;
      output.push(`<h${level} id="${anchorId}">${content}</h${level}>`);
      continue;
    }

    // 6. 有序列表（如 1. **标题**）
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      closeTable();
      closeSubUl();
      if (inUl) {
        output.push('</ul>');
        inUl = false;
      }
      if (!inOl) {
        output.push('<ol>');
        inOl = true;
      }
      output.push(`<li>${parseInline(olMatch[2])}`);
      continue;
    }

    // 7. 无序列表（如 - 子项 或 * 子项）
    const ulMatch = trimmed.match(/^[-*+]\s+(.*)$/);
    if (ulMatch) {
      closeTable();
      // 如果处于有序列表中，且该行缩进（或在有序项下），作为有序项的嵌套子列表
      if (inOl) {
        if (!inSubUl) {
          output.push('<ul class="nested-sub-list">');
          inSubUl = true;
        }
        output.push(`<li>${parseInline(ulMatch[1])}</li>`);
      } else {
        if (!inUl) {
          output.push('<ul>');
          inUl = true;
        }
        output.push(`<li>${parseInline(ulMatch[1])}</li>`);
      }
      continue;
    }

    // 非列表项，关闭可能打开的列表结构
    closeList();

    // 8. 表格 | col1 | col2 |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (/^\|[\s:-|-]+\|$/.test(trimmed)) {
        continue;
      }
      const cells = trimmed.slice(1, -1).split('|').map(c => parseInline(c.trim()));
      const isNextSeparator = (i + 1 < lines.length && /^\|[\s:-|-]+\|$/.test(lines[i + 1].trim()));
      if (isNextSeparator) {
        closeTable();
        output.push('<table><thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>');
        inTable = true;
      } else {
        if (!inTable) {
          output.push('<table><tbody>');
          inTable = true;
        }
        output.push('<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>');
      }
      continue;
    } else {
      closeTable();
    }

    // 9. 普通段落
    output.push(`<p>${parseInline(trimmed)}</p>`);
  }

  closeList();
  closeBlockquote();
  closeTable();

  if (inCodeBlock && codeBlockContent.length) {
    output.push(`<pre><code>${escapeHtml(codeBlockContent.join('\n'))}</code></pre>`);
  }

  return output.join('\n');
}
