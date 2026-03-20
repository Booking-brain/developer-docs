/**
 * Copy for LLM — adds a floating button to doc pages that copies the page
 * content as clean Markdown, optimised for pasting into AI assistants.
 *
 * Inspired by Stripe's "Copy page for AI" feature.
 */

const BUTTON_ID = 'bb-copy-for-llm';

function getPageMarkdown() {
  const article = document.querySelector('article .markdown');
  if (!article) return null;

  const title = document.querySelector('article h1')?.textContent || document.title;
  const url = window.location.href;

  // Walk through the article and build Markdown
  const lines = [];
  lines.push(`# ${title}`);
  lines.push(`Source: ${url}`);
  lines.push('');

  const elements = article.querySelectorAll('h1, h2, h3, h4, h5, h6, p, pre, ul, ol, table, blockquote, .admonition, .alert');

  for (const el of elements) {
    // Skip the h1 — already added
    if (el.tagName === 'H1' && el === article.querySelector('h1')) continue;

    if (/^H[2-6]$/.test(el.tagName)) {
      const level = parseInt(el.tagName[1]);
      const hashes = '#'.repeat(level);
      lines.push('');
      lines.push(`${hashes} ${el.textContent.trim()}`);
      lines.push('');
    } else if (el.tagName === 'P') {
      // Skip if inside an already-processed container
      if (el.closest('li') || el.closest('blockquote') || el.closest('.admonition') || el.closest('.alert')) continue;
      lines.push(el.textContent.trim());
      lines.push('');
    } else if (el.tagName === 'PRE') {
      const code = el.querySelector('code');
      const lang = code?.className?.match(/language-(\w+)/)?.[1] || '';
      lines.push('```' + lang);
      lines.push(code?.textContent?.trim() || el.textContent.trim());
      lines.push('```');
      lines.push('');
    } else if (el.tagName === 'UL' || el.tagName === 'OL') {
      if (el.parentElement?.closest('ul, ol')) continue; // skip nested (handled by parent)
      const items = el.querySelectorAll(':scope > li');
      items.forEach((li, i) => {
        const prefix = el.tagName === 'OL' ? `${i + 1}. ` : '- ';
        lines.push(`${prefix}${li.textContent.trim()}`);
      });
      lines.push('');
    } else if (el.tagName === 'TABLE') {
      const rows = el.querySelectorAll('tr');
      rows.forEach((row, i) => {
        const cells = row.querySelectorAll('th, td');
        const line = '| ' + Array.from(cells).map(c => c.textContent.trim()).join(' | ') + ' |';
        lines.push(line);
        if (i === 0) {
          lines.push('| ' + Array.from(cells).map(() => '---').join(' | ') + ' |');
        }
      });
      lines.push('');
    } else if (el.tagName === 'BLOCKQUOTE') {
      const text = el.textContent.trim();
      lines.push(...text.split('\n').map(l => `> ${l.trim()}`));
      lines.push('');
    } else if (el.classList.contains('admonition') || el.classList.contains('alert')) {
      const heading = el.querySelector('.admonition-heading, .admonition-title')?.textContent?.trim();
      const content = el.querySelector('.admonition-content, .admonition-body')?.textContent?.trim()
        || el.textContent.trim();
      if (heading) {
        lines.push(`> **${heading}**`);
      }
      lines.push(`> ${content}`);
      lines.push('');
    }
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function createButton() {
  if (document.getElementById(BUTTON_ID)) return;

  const btn = document.createElement('button');
  btn.id = BUTTON_ID;
  btn.title = 'Copy page as Markdown for AI';
  btn.setAttribute('aria-label', 'Copy page content as Markdown for AI assistants');

  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '82px',
    right: '24px',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'var(--bb-brand-primary, #015A9C)',
    color: '#fff',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    zIndex: '9998',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
    fontSize: '18px',
    lineHeight: '1',
    padding: '0',
  });

  // AI/clipboard icon
  btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'scale(1.1)';
    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'scale(1)';
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  });

  btn.addEventListener('click', async () => {
    const md = getPageMarkdown();
    if (!md) return;

    try {
      await navigator.clipboard.writeText(md);
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
      btn.style.background = 'var(--bb-success, #00a67d)';

      setTimeout(() => {
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
        btn.style.background = 'var(--bb-brand-primary, #015A9C)';
      }, 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = md;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  });

  document.body.appendChild(btn);
}

function updateVisibility() {
  const btn = document.getElementById(BUTTON_ID);
  if (!btn) return;

  const isDocPage = !!document.querySelector('article .markdown');
  btn.style.display = isDocPage ? 'flex' : 'none';
}

// Show/hide on route changes
export function onRouteDidUpdate() {
  if (typeof document === 'undefined') return;

  setTimeout(() => {
    createButton();
    updateVisibility();
  }, 200);
}

// Initial load
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createButton();
      updateVisibility();
    });
  } else {
    createButton();
    updateVisibility();
  }
}
