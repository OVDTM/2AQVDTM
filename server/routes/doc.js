const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const DOCS_DIR = path.join(__dirname, '../../docs');

const PAGES = [
  { slug: 'index',        file: 'index.md',            title: 'Accueil' },
  { slug: 'architecture', file: 'Architecture_doc.md',  title: 'Architecture' },
  { slug: 'backend',      file: 'Backend_doc.md',       title: 'Backend' },
  { slug: 'frontend',     file: 'Frontend_doc.md',      title: 'Frontend' },
  { slug: 'database',     file: 'database_structure.md',title: 'Base de données' },
];

function renderPage(htmlContent, currentSlug) {
  const nav = PAGES.map(p => {
    const href = p.slug === 'index' ? '/doc' : `/doc/${p.slug}`;
    const active = currentSlug === p.slug ? ' class="active"' : '';
    return `<a href="${href}"${active}>${p.title}</a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documentation — 2AQVDTM</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    /* M3 color tokens */
    :root {
      --md-sys-color-primary:                  rgb(177 209 138);
      --md-sys-color-surface-tint:             rgb(177 209 138);
      --md-sys-color-on-primary:               rgb(31 55 1);
      --md-sys-color-primary-container:        rgb(53 78 22);
      --md-sys-color-on-primary-container:     rgb(205 237 163);
      --md-sys-color-secondary:                rgb(191 203 173);
      --md-sys-color-on-secondary:             rgb(42 51 30);
      --md-sys-color-secondary-container:      rgb(64 74 51);
      --md-sys-color-on-secondary-container:   rgb(220 231 200);
      --md-sys-color-tertiary:                 rgb(160 208 203);
      --md-sys-color-on-tertiary:              rgb(0 55 53);
      --md-sys-color-tertiary-container:       rgb(31 78 75);
      --md-sys-color-on-tertiary-container:    rgb(188 236 231);
      --md-sys-color-error:                    rgb(255 180 171);
      --md-sys-color-on-error:                 rgb(105 0 5);
      --md-sys-color-error-container:          rgb(147 0 10);
      --md-sys-color-on-error-container:       rgb(255 218 214);
      --md-sys-color-background:               rgb(18 20 14);
      --md-sys-color-on-background:            rgb(226 227 216);
      --md-sys-color-surface:                  rgb(18 20 14);
      --md-sys-color-on-surface:               rgb(226 227 216);
      --md-sys-color-surface-variant:          rgb(68 72 61);
      --md-sys-color-on-surface-variant:       rgb(197 200 186);
      --md-sys-color-outline:                  rgb(143 146 133);
      --md-sys-color-outline-variant:          rgb(68 72 61);
      --md-sys-color-shadow:                   rgb(0 0 0);
      --md-sys-color-inverse-surface:          rgb(226 227 216);
      --md-sys-color-inverse-on-surface:       rgb(47 49 42);
      --md-sys-color-inverse-primary:          rgb(76 102 43);
      --md-sys-color-surface-dim:              rgb(18 20 14);
      --md-sys-color-surface-bright:           rgb(56 58 50);
      --md-sys-color-surface-container-lowest: rgb(12 15 9);
      --md-sys-color-surface-container-low:    rgb(26 28 22);
      --md-sys-color-surface-container:        rgb(30 32 26);
      --md-sys-color-surface-container-high:   rgb(40 43 36);
      --md-sys-color-surface-container-highest:rgb(51 54 46);

      --md-ref-typeface-brand: 'Roboto', sans-serif;
      --md-ref-typeface-mono:  'Roboto Mono', monospace;

      --md-shape-corner-extra-large: 28px;
      --md-shape-corner-large:       16px;
      --md-shape-corner-medium:      12px;
      --md-shape-corner-small:       8px;
      --md-shape-corner-extra-small: 4px;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      display: flex; min-height: 100vh;
      font-family: var(--md-ref-typeface-brand);
      background: var(--md-sys-color-surface);
      color: var(--md-sys-color-on-surface);
    }

    /* ── Navigation Drawer (M3) ── */
    aside {
      width: 260px; min-height: 100vh; flex-shrink: 0;
      background: var(--md-sys-color-surface-container);
      display: flex; flex-direction: column;
      position: sticky; top: 0; height: 100vh; overflow-y: auto;
      border-right: 1px solid var(--md-sys-color-outline-variant);
    }

    .drawer-header {
      padding: 24px 28px 20px;
      display: flex; align-items: center; gap: 12px;
    }
    .drawer-header .brand-name {
      font-size: .95rem; font-weight: 700; letter-spacing: .04em;
      color: var(--md-sys-color-on-surface);
    }
    .drawer-header .brand-sub {
      font-size: .75rem; color: var(--md-sys-color-on-surface-variant); margin-top: 1px;
    }

    .drawer-section-label {
      font-size: .72rem; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
      color: var(--md-sys-color-on-surface-variant);
      padding: 16px 28px 6px;
    }

    aside nav { display: flex; flex-direction: column; padding: 4px 12px; gap: 2px; }

    aside nav a {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 16px; border-radius: var(--md-shape-corner-extra-large);
      color: var(--md-sys-color-on-surface-variant); text-decoration: none;
      font-size: .9rem; font-weight: 500; letter-spacing: .01em;
      transition: background .15s, color .15s;
      position: relative;
    }
    aside nav a::before {
      content: ''; width: 6px; height: 6px; border-radius: 50%;
      background: currentColor; opacity: 0; transition: opacity .15s;
      flex-shrink: 0;
    }
    aside nav a:hover {
      background: color-mix(in srgb, var(--md-sys-color-on-surface) 8%, transparent);
      color: var(--md-sys-color-on-surface);
    }
    aside nav a.active {
      background: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-primary-container);
      font-weight: 700;
    }
    aside nav a.active::before { opacity: 1; }

    .drawer-footer {
      margin-top: auto; padding: 12px;
      border-top: 1px solid var(--md-sys-color-outline-variant);
    }
    .drawer-footer a {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 16px; border-radius: var(--md-shape-corner-extra-large);
      color: var(--md-sys-color-on-surface-variant); text-decoration: none;
      font-size: .85rem; font-weight: 500;
      transition: background .15s, color .15s;
    }
    .drawer-footer a:hover {
      background: color-mix(in srgb, var(--md-sys-color-on-surface) 8%, transparent);
      color: var(--md-sys-color-on-surface);
    }

    /* ── Main content ── */
    main {
      flex: 1; padding: 48px 56px; max-width: 900px;
    }

    /* M3 Typography scale */
    main :is(h1) {
      font-size: 2.25rem; font-weight: 400; line-height: 1.2; letter-spacing: -.02em;
      color: var(--md-sys-color-primary); margin-bottom: 28px;
    }
    main :is(h2) {
      font-size: 1.35rem; font-weight: 500; line-height: 1.3; letter-spacing: -.01em;
      color: var(--md-sys-color-on-surface); margin: 40px 0 12px;
      padding-bottom: 8px; border-bottom: 1px solid var(--md-sys-color-outline-variant);
    }
    main :is(h3) {
      font-size: 1.05rem; font-weight: 600; line-height: 1.4;
      color: var(--md-sys-color-secondary); margin: 24px 0 8px;
    }
    main :is(h4) {
      font-size: .95rem; font-weight: 600;
      color: var(--md-sys-color-on-surface-variant); margin: 16px 0 6px;
    }
    main p  { font-size: .95rem; line-height: 1.8; color: var(--md-sys-color-on-surface); margin-bottom: 14px; }
    main ul, main ol { margin: 8px 0 14px 24px; }
    main li { font-size: .95rem; line-height: 1.8; margin-bottom: 4px; }
    main strong { font-weight: 600; color: var(--md-sys-color-on-surface); }

    main a { color: var(--md-sys-color-primary); text-underline-offset: 3px; }
    main a:hover { opacity: .8; }

    /* Inline code — M3 surface-variant chip */
    main :not(pre) > code {
      background: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-secondary);
      border-radius: var(--md-shape-corner-extra-small);
      padding: 2px 7px; font-size: .85em;
      font-family: var(--md-ref-typeface-mono);
      border: 1px solid var(--md-sys-color-outline-variant);
    }

    /* Code block — M3 elevated surface */
    main pre {
      background: #1c2120;
      border-radius: var(--md-shape-corner-large);
      padding: 24px 28px; overflow-x: auto; margin: 20px 0;
      box-shadow: 0 1px 3px rgba(0,0,0,.18), 0 4px 8px rgba(0,0,0,.1);
    }
    main pre code {
      background: none; color: #c8d8c8; padding: 0;
      font-size: .88em; font-family: var(--md-ref-typeface-mono);
      border: none; letter-spacing: .01em;
    }

    /* Table — M3 card style */
    main table {
      border-collapse: separate; border-spacing: 0;
      width: 100%; margin: 20px 0; font-size: .9rem;
      border-radius: var(--md-shape-corner-medium);
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0,0,0,.08);
      border: 1px solid var(--md-sys-color-outline-variant);
    }
    main th {
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      padding: 12px 18px; font-size: .85rem; font-weight: 500;
      letter-spacing: .04em; text-align: left;
    }
    main td { padding: 11px 18px; border-bottom: 1px solid var(--md-sys-color-outline-variant); }
    main tr:last-child td { border-bottom: none; }
    main tr:nth-child(even) td { background: var(--md-sys-color-surface-container); }

    /* Image — M3 card */
    main img {
      max-width: 100%; border-radius: var(--md-shape-corner-large);
      margin: 20px 0; display: block;
      box-shadow: 0 2px 6px rgba(0,0,0,.1), 0 8px 24px rgba(0,0,0,.07);
    }

    main hr { border: none; height: 1px; background: var(--md-sys-color-outline-variant); margin: 36px 0; }

    /* Blockquote — M3 tonal surface */
    main blockquote {
      background: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      border-radius: var(--md-shape-corner-medium);
      padding: 16px 20px; margin: 20px 0;
      border-left: 4px solid var(--md-sys-color-primary);
      font-size: .93rem; line-height: 1.7;
    }

    @media (max-width: 800px) {
      body { flex-direction: column; }
      aside { width: 100%; min-height: auto; height: auto; position: static; }
      aside nav { flex-direction: row; flex-wrap: wrap; padding: 8px; }
      aside nav a { padding: 10px 14px; font-size: .83rem; }
      main { padding: 28px 20px; }
    }
  </style>
</head>
<body>
  <aside>
    <div class="drawer-header">
      <div>
        <div class="brand-name">2AQVDTM</div>
        <div class="brand-sub">Documentation</div>
      </div>
    </div>
    <div class="drawer-section-label">Pages</div>
    <nav>${nav}</nav>
    <div class="drawer-footer">
      <a href="/">← Retour à l'application</a>
    </div>
  </aside>
  <main>${htmlContent}</main>
</body>
</html>`;
}

function renderMarkdownFile(file, res, slug) {
  const filePath = path.join(DOCS_DIR, file);
  if (!fs.existsSync(filePath)) return res.status(404).send('Page introuvable');
  const raw = fs.readFileSync(filePath, 'utf8');
  const fixed = raw.replace(/\.\/(MVP_architecture|Future_architecture)\.png/g, '/doc/img/$1.png');
  res.send(renderPage(marked(fixed), slug));
}

router.use('/img', express.static(DOCS_DIR));

router.get('/', (_req, res) => renderMarkdownFile('index.md', res, 'index'));

router.get('/:page', (req, res) => {
  const page = PAGES.find(p => p.slug === req.params.page);
  if (!page) return res.status(404).send('Page introuvable');
  renderMarkdownFile(page.file, res, page.slug);
});

module.exports = router;
