#!/usr/bin/env node
// Builds the Meridian site into:
//   dist/ghl/      paste-ready blocks for GoHighLevel (contact details baked in from site.config.json)
//   dist/preview/  standalone pages for local review and Lighthouse
// No dependencies. Run: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { icons } from './src/icons.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const src = (...p) => join(root, 'src', ...p);
const out = (...p) => join(root, 'dist', ...p);
const cfg = JSON.parse(readFileSync(join(root, 'site.config.json'), 'utf8'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

function minifyCss(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}').trim();
}
function minifyHtml(html) {
  return html
    .replace(/<!--(?!\s*@ghl)[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function planCard({ name, price, period, popular, lines, features, cta, ctaHref, extra = '' }) {
  return `
    <article class="mr-plan${popular ? ' mr-plan--pop' : ''}">
      ${popular ? '<span class="mr-tag">Most popular</span>' : ''}
      <h3>${esc(name)}</h3>
      <p class="mr-price">${esc(price)}<small>${esc(period)}</small></p>
      ${lines.map((l, i) => i === 0 ? `<p><strong>${esc(l)}</strong></p>` : `<p class="mr-micro" style="margin-top:6px">${esc(l)}</p>`).join('')}
      <ul class="mr-list">${features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      ${extra}
      <a class="mr-btn${popular ? '' : ' mr-btn--ghost'}" href="${ctaHref}">${esc(cta)}</a>
    </article>`;
}
function renderPlans(key) {
  const o = cfg.offer;
  if (key === 'reviews') return o.reviews.plans.map((p) => planCard({
    ...p, lines: [p.requests, p.blurb], features: o.reviews.features,
    cta: `Start my ${o.trialDays}-day free trial`, ctaHref: cfg.links.book,
  })).join('');
  if (key === 'websites') return o.websites.plans.map((p) => planCard({
    ...p, lines: [p.value, `Or buy it outright for ${p.outright}`], features: p.features,
    cta: `Choose ${p.name}`, ctaHref: cfg.links.book,
  })).join('');
  throw new Error(`Unknown plan set ${key}`);
}

// mode: 'ghl' for paste-ready blocks, 'preview' for the local preview (only differs where a value has a 'preview' override)
function render(tpl, mode, page = {}) {
  // no client login URL yet: drop the link rather than point it at nothing
  if (!cfg.customValues.login.value && mode === 'ghl') tpl = tpl.replace(/<li><a href="\{\{cv:login\}\}"[^>]*>Client login<\/a><\/li>/g, '');
  return tpl.replace(/\{\{\s*([a-zA-Z]+)[.:]([a-zA-Z0-9_.-]+)\s*\}\}/g, (m, ns, key) => {
    switch (ns) {
      case 'plans': return renderPlans(key);
      case 'cv': {
        const v = cfg.customValues[key];
        if (!v) throw new Error(`Unknown custom value ${key} in ${page.id}`);
        // GHL leaves merge fields raw inside Custom Code, so the real value is baked in
        const val = mode === 'preview' && v.preview !== undefined ? v.preview : v.value;
        if (!val && key !== 'login') throw new Error(`Custom value ${key} is empty in site.config.json`);
        return esc(val || '#');
      }
      case 'brand': return esc(get(cfg.brand, key));
      case 'link': return get(cfg.links, key);
      case 'offer': {
        const v = get(cfg.offer, key);
        if (v === undefined) throw new Error(`Unknown offer value ${key} in ${page.id}`);
        return esc(v);
      }
      case 'icon': {
        if (!icons[key]) throw new Error(`Unknown icon ${key}`);
        return icons[key];
      }
      case 'page': return esc(get(page, key));
      default: throw new Error(`Unknown token ${m}`);
    }
  });
}

function readPage(file) {
  const raw = readFileSync(src('pages', file), 'utf8');
  const m = raw.match(/^<!--meta\s*([\s\S]*?)-->\s*/);
  if (!m) throw new Error(`${file} needs a <!--meta {...} --> header`);
  return { ...JSON.parse(m[1]), id: file.replace(/\.html$/, ''), body: raw.slice(m[0].length) };
}

// JSON-LD is rendered from config, not custom values, so it is always valid JSON
function schemaFor(page) {
  const base = cfg.siteUrl.replace(/\/$/, '');
  const url = base + (page.slug === '/' ? '/' : page.slug);
  const org = {
    '@type': 'ProfessionalService',
    '@id': base + '/#org',
    name: cfg.brand.name,
    url: base + '/',
    telephone: cfg.brand.phoneE164,
    email: cfg.customValues.email.value,
    areaServed: { '@type': 'Country', name: cfg.brand.areaServed },
    address: { '@type': 'PostalAddress', addressLocality: cfg.brand.locality, addressRegion: cfg.brand.region, addressCountry: 'AU' },
    legalName: cfg.brand.legalName,
    taxID: 'ABN ' + cfg.brand.abn,
    logo: cfg.customValues.logo.value || undefined,
    description: 'Google review generation and automated local SEO for Australian service businesses.',
    knowsAbout: ['Google reviews', 'Google Business Profile optimisation', 'Local SEO', 'Reputation management'],
  };
  const graph = [org, { '@type': 'WebPage', '@id': url + '#page', url, name: page.title, description: page.description, isPartOf: { '@id': base + '/#site' }, about: { '@id': base + '/#org' }, inLanguage: 'en-AU' }];
  if (page.slug === '/') graph.push({ '@type': 'WebSite', '@id': base + '/#site', url: base + '/', name: cfg.brand.name, publisher: { '@id': base + '/#org' }, inLanguage: 'en-AU' });
  if (page.service) graph.push({ '@type': 'Service', name: page.service, serviceType: page.service, provider: { '@id': base + '/#org' }, areaServed: { '@type': 'Country', name: cfg.brand.areaServed }, url });
  if (page.crumb) graph.push({ '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: base + '/' },
    { '@type': 'ListItem', position: 2, name: page.crumb, item: url },
  ] });
  const faqs = [...page.body.matchAll(/<details[^>]*data-faq[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<div>([\s\S]*?)<\/div>\s*<\/details>/g)];
  if (faqs.length) graph.push({ '@type': 'FAQPage', mainEntity: faqs.map(([, q, a]) => ({
    '@type': 'Question', name: strip(render(q, 'preview', page)),
    acceptedAnswer: { '@type': 'Answer', text: strip(render(a, 'preview', page)) },
  })) });
  // escape "<" so nothing in the JSON can close the script tag
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;
}
const strip = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

// ---------- build ----------
rmSync(out(), { recursive: true, force: true });
const fonts = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400..800&display=swap" media="print" onload="this.media=\'all\'"><noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400..800&display=swap"></noscript>';
const css = minifyCss(readFileSync(src('styles.css'), 'utf8'));
const header = readFileSync(src('partials', 'header.html'), 'utf8');
const footer = readFileSync(src('partials', 'footer.html'), 'utf8');
const pages = readdirSync(src('pages')).filter((f) => f.endsWith('.html')).map(readPage);

// global GHL blocks
mkdirSync(out('ghl', 'global'), { recursive: true });
writeFileSync(out('ghl', 'global', '1-site-head-tracking-code.html'),
  `<meta name="theme-color" content="#12312a">\n${fonts}\n<style>${css}</style>\n`);
writeFileSync(out('ghl', 'global', '2-header-global-section.html'), minifyHtml(render(header, 'ghl')));
writeFileSync(out('ghl', 'global', '3-footer-global-section.html'), minifyHtml(render(footer, 'ghl')));

const manifest = [];
for (const page of pages) {
  // split around native-element markers: <!-- @ghl:form Website Form -->
  const parts = page.body.split(/<!--\s*@ghl:(\w+)\s*([^>]*?)\s*-->/);
  const dir = out('ghl', 'pages', page.id);
  mkdirSync(dir, { recursive: true });
  const steps = [];
  let n = 0;
  for (let i = 0; i < parts.length; i += 3) {
    const html = parts[i].trim();
    if (html) {
      n++;
      const name = `block-${n}.html`;
      writeFileSync(join(dir, name), minifyHtml(render(html, 'ghl', page)));
      steps.push(`Custom Code element: paste ${name}`);
    }
    if (parts[i + 1]) steps.push(`Native GHL ${parts[i + 1]} element: ${parts[i + 2]}`);
  }
  writeFileSync(join(dir, 'page-head-tracking-code.html'), schemaFor(page) + (page.noindex ? '\n<meta name="robots" content="noindex,follow">' : '') + '\n');
  const seo = [
    `Page name:        ${page.name}`,
    `URL slug:         ${page.slug}`,
    `SEO title:        ${page.title}  (${page.title.length} chars)`,
    `Meta description: ${page.description}  (${page.description.length} chars)`,
    `Keywords:         ${page.keywords || ''}`,
    `Indexing:         ${page.noindex ? 'noindex (thank-you page)' : 'index'}`,
    '',
    'Section order on the page (top to bottom):',
    '  Header global section',
    ...steps.map((s) => '  ' + s),
    '  Footer global section',
  ].join('\n');
  writeFileSync(join(dir, 'README.txt'), seo + '\n');
  manifest.push({ page, steps });

  // preview build
  const previewBody = parts.map((p, i) => {
    if (i % 3 === 0) return render(p, 'preview', page);
    if (i % 3 === 1) return `<div class="mr"><div class="mr-wrap" style="padding:28px 20px"><div style="border:2px dashed #94a3b8;border-radius:14px;padding:28px;text-align:center;color:#475569;font-weight:600">Native GHL ${esc(p)} element goes here: ${esc(parts[i + 1])}</div></div></div>`;
    return '';
  }).join('');
  const navHeader = render(header, 'preview', page).replace(`href="${page.slug}"`, `href="${page.slug}" aria-current="page"`);
  const previewDoc = `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(page.title)}</title><meta name="description" content="${esc(page.description)}"><link rel="canonical" href="${cfg.siteUrl}${page.slug === '/' ? '/' : page.slug}"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:type" content="website"><meta property="og:locale" content="en_AU"><meta name="theme-color" content="#12312a">${fonts}${page.noindex ? '<meta name="robots" content="noindex,follow">' : ''}<style>body{margin:0;background:#fffbf4}${css}</style>${schemaFor(page)}</head><body>${navHeader}<main id="main">${previewBody}</main>${render(footer, 'preview', page)}</body></html>`;
  const pdir = out('preview', page.slug === '/' ? '' : page.slug.slice(1));
  mkdirSync(pdir, { recursive: true });
  writeFileSync(join(pdir, 'index.html'), minifyHtml(previewDoc));
}

// install checklist
const lines = ['# GHL install checklist (generated)', '', 'Pages, in nav order:', ''];
for (const { page, steps } of manifest.sort((a, b) => a.page.order - b.page.order)) {
  lines.push(`## ${page.name} (${page.slug})`, '', `- SEO title: ${page.title}`, `- Meta description: ${page.description}`, `- Page head tracking code: \`pages/${page.id}/page-head-tracking-code.html\``, '- Sections, top to bottom:', '  - Header global section');
  for (const s of steps) lines.push(`  - ${s.replace('paste ', `paste \`pages/${page.id}/`).replace(/\.html$/, '.html`')}`);
  lines.push('  - Footer global section', '');
}
writeFileSync(out('ghl', 'CHECKLIST.md'), lines.join('\n'));
console.log(`Built ${pages.length} pages -> dist/ghl and dist/preview (css ${css.length} bytes)`);
