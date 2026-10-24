// Builds the template into two outputs:
//   dist/ghl/<page>.html      paste-ready custom code with {{ custom_values.* }} merge tags
//   dist/preview/<page>.html  a standalone page with example values, for Lighthouse and review
// Usage: node client-template/scripts/build.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const { values } = JSON.parse(read('custom-values.json'));
const { pages } = JSON.parse(read('pages.json'));
const examples = Object.fromEntries(values.map((v) => [v.key, v.example]));
// The preview uses local images so it can be tested offline.
Object.assign(examples, { logo_link: 'assets/logo.png', site_hero_image_url: 'assets/hero.webp', site_owner_photo_url: 'assets/owner.webp' });
const known = new Set(values.map((v) => v.key));
const SERVICES = 6;

const svg = (body, size = 20) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const icons = {
  phone: svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>', 18),
  check: svg('<path d="M20 6 9 17l-5-5"/>'),
  star: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>`,
  shield: svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
  pin: svg('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'),
  clock: svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
  badge: svg('<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>'),
  mail: svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'),
  lock: svg('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', 14),
  menu: svg('<path d="M3 6h18M3 12h18M3 18h18"/>', 24),
  arrow: svg('<path d="M5 12h14M13 5l7 7-7 7"/>', 18),
  google: `<svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>`,
};
const stars = icons.star.repeat(5);

// Quote card. In GHL it embeds the client's quote form by ID; in the preview it shows a
// stand-in so Lighthouse measures the template rather than GHL's form app.
const quoteCard = (form) => `<div class="quote" id="quote">
    <h2>Get a free quote</h2>
    <p>Takes 30 seconds. We reply within 24 hours, no obligation.</p>
    ${form}
    <p class="fine">${icons.lock} Your details stay private and are never shared.</p>
  </div>`;
const ghlForm = `<iframe src="https://api.leadconnectorhq.com/widget/form/{{cv.site_quote_form_id}}" id="inline-{{cv.site_quote_form_id}}" title="Free quote form" loading="lazy" style="width:100%;height:560px;border:none;border-radius:8px" data-layout="{'id':'INLINE'}" data-trigger-type="alwaysShow" data-activation-type="alwaysActivated" data-deactivation-type="neverDeactivate" data-form-id="{{cv.site_quote_form_id}}" data-height="560"></iframe>
    <script src="https://link.msgsndr.com/js/form_embed.js" defer></script>`;
const previewForm = `<form class="f" action="#" onsubmit="return false">
      <label>Name<input name="name" autocomplete="name" required></label>
      <label>Mobile<input name="phone" type="tel" autocomplete="tel" inputmode="tel" required></label>
      <label>Suburb<input name="suburb" autocomplete="address-level2"></label>
      <label>What do you need?<select name="service"><option>{{cv.site_service_1_name}}</option><option>{{cv.site_service_2_name}}</option><option>{{cv.site_service_3_name}}</option><option>Something else</option></select></label>
      <button class="btn btn-accent" type="submit">Get My Free Quote</button>
    </form>`;

const serviceCards = (skip) =>
  Array.from({ length: SERVICES }, (_, i) => i + 1)
    .filter((n) => n !== skip)
    .map((n) => `<a class="card" href="/{{cv.site_service_${n}_slug}}"><span class="ico">${icons.check}</span><h3>{{cv.site_service_${n}_name}}</h3><p>{{cv.site_service_${n}_desc}}</p><span class="more">Learn more ${icons.arrow}</span></a>`)
    .join('\n    ');
const serviceLinks = Array.from({ length: SERVICES }, (_, i) => `<li><a href="/{{cv.site_service_${i + 1}_slug}}">{{cv.site_service_${i + 1}_name}}</a></li>`).join('');

// JSON-LD. Values are written as {{cv.x}} placeholders and filled per output, so the
// GHL output keeps merge tags and the preview gets JSON-escaped example text.
function schemaFor(page, n) {
  const blocks = [];
  const business = {
    '@context': 'https://schema.org',
    '@type': '{{cv.site_schema_type}}',
    '@id': '{{cv.site_url}}/#business',
    name: '{{cv.business_name}}',
    url: '{{cv.site_url}}',
    logo: '{{cv.logo_link}}',
    image: '{{cv.site_hero_image_url}}',
    telephone: '{{cv.site_phone_link}}',
    email: '{{cv.site_email}}',
    priceRange: '$$',
    foundingDate: '{{cv.site_founded_year}}',
    address: { '@type': 'PostalAddress', streetAddress: '{{cv.site_street_address}}', addressLocality: '{{cv.site_suburb}}', addressRegion: '{{cv.site_state}}', postalCode: '{{cv.site_postcode}}', addressCountry: 'AU' },
    areaServed: '{{cv.site_service_areas}}',
    openingHours: '{{cv.site_hours_schema}}',
    hasMap: '{{cv.site_google_maps_url}}',
    sameAs: ['{{cv.site_google_maps_url}}'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '{{cv.site_trade}} services',
      itemListElement: Array.from({ length: SERVICES }, (_, i) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: `{{cv.site_service_${i + 1}_name}}`, url: `{{cv.site_url}}/{{cv.site_service_${i + 1}_slug}}` } })),
    },
  };
  for (const kind of page.schema) {
    if (kind === 'business') blocks.push(business);
    if (kind === 'faq')
      blocks.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [1, 2, 3, 4].map((i) => ({ '@type': 'Question', name: `{{cv.site_faq_${i}_q}}`, acceptedAnswer: { '@type': 'Answer', text: `{{cv.site_faq_${i}_a}}` } })) });
    if (kind === 'service')
      blocks.push({ '@context': 'https://schema.org', '@type': 'Service', name: `{{cv.site_service_${n}_name}}`, serviceType: `{{cv.site_service_${n}_name}}`, description: `{{cv.site_service_${n}_desc}}`, areaServed: '{{cv.site_service_areas}}', provider: { '@id': '{{cv.site_url}}/#business' } });
    if (kind === 'breadcrumb')
      blocks.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: '{{cv.site_url}}/' }, { '@type': 'ListItem', position: 2, name: `{{cv.site_service_${n}_name}}`, item: `{{cv.site_url}}/{{cv.site_service_${n}_slug}}` }] });
  }
  return blocks.map((b) => `<script type="application/ld+json">${JSON.stringify(b)}</script>`).join('\n');
}

const css = read('site.css').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').trim();

function renderSection(name, page, n, mode) {
  let html = read(`sections/${name}.html`).replace(/^<!--[\s\S]*?-->\n?/, '');
  // The header carries the brand colours so every page that uses it is themed.
  if (name === '01-header') html = read('sections/00-theme.html').replace(/^<!--[\s\S]*?-->\n?/, '') + html;
  html = html
    .replaceAll('{{quote_card}}', quoteCard(mode === 'ghl' ? ghlForm : previewForm))
    .replaceAll('{{services_cards}}', serviceCards(n))
    .replaceAll('{{services_links}}', serviceLinks)
    .replaceAll('{{stars}}', stars)
    .replace(/\{\{icon:(\w+)\}\}/g, (_, k) => { if (!icons[k]) throw new Error(`Unknown icon ${k} in ${name}`); return icons[k]; });
  if (n) html = html.replaceAll('site_service_N_', `site_service_${n}_`);
  return html.trim();
}

// Fill {{cv.key}} tokens. Inside JSON-LD the example text is JSON-escaped.
function fill(html, mode) {
  const sub = (key, inJson) => {
    if (!known.has(key)) throw new Error(`Unknown custom value: ${key}`);
    if (mode === 'ghl') return `{{ custom_values.${key} }}`;
    const v = examples[key] ?? '';
    return inJson ? JSON.stringify(v).slice(1, -1) : v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  return html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)|\{\{cv\.(\w+)\}\}/g, (m, open, body, close, key) =>
    open ? open + body.replace(/\{\{cv\.(\w+)\}\}/g, (_, k) => sub(k, true)) + close : sub(key, false));
}

const out = join(root, 'dist');
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'ghl'), { recursive: true });
mkdirSync(join(out, 'preview'), { recursive: true });
cpSync(join(root, 'preview-assets'), join(out, 'preview', 'assets'), { recursive: true });

const seoRows = [];
for (const page of pages) {
  const ns = page.repeat ? Array.from({ length: page.repeat }, (_, i) => i + 1) : [null];
  for (const n of ns) {
    const id = n ? page.id.replace('N', n) : page.id;
    const sub = (s) => (n ? s.replaceAll('site_service_N_', `site_service_${n}_`) : s);
    const schema = schemaFor(page, n);
    const blocks = (mode) => page.sections.map((name) => ({ name, html: renderSection(name, page, n, mode) }));

    // GHL: one file per Custom Code element, in page order. Shared blocks (header,
    // footer and so on) are identical on every page, so they can be GHL global sections.
    const dir = join(out, 'ghl', id);
    mkdirSync(dir, { recursive: true });
    const ghlBlocks = blocks('ghl');
    if (schema) ghlBlocks.push({ name: '99-schema', html: schema });
    ghlBlocks.forEach(({ name, html }, i) =>
      writeFileSync(join(dir, `${String(i + 1).padStart(2, '0')}-${name.replace(/^\d+-/, '')}.html`), `<div class="mx">\n${fill(html, 'ghl')}\n</div>\n`));
    const previewBody = `<div class="mx">\n${blocks('preview').map((b) => b.html).join('\n')}\n</div>\n${schema}`;

    const title = fill(sub(page.title), 'preview');
    const desc = fill(sub(page.description), 'preview');
    const canonical = fill(`{{cv.site_url}}${sub(page.path) === '/' ? '/' : sub(page.path)}`, 'preview');
    writeFileSync(join(out, 'preview', `${id}.html`), `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
${page.noindex ? '<meta name="robots" content="noindex">\n' : ''}<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${fill('{{cv.site_hero_image_url}}', 'preview')}">
<link rel="icon" href="data:,">
<meta name="theme-color" content="${fill('{{cv.site_brand_color}}', 'preview')}">
<style>html,body{margin:0}${css}</style>
</head>
<body>
${fill(previewBody, 'preview')}
</body>
</html>
`);
    seoRows.push(`| ${id} | \`${fill(sub(page.path), 'ghl')}\` | ${fill(sub(page.title), 'ghl')} | ${fill(sub(page.description), 'ghl')} | ${page.noindex ? 'noindex' : 'index'} |`);
  }
}

writeFileSync(join(out, 'ghl', 'site.css'), css + '\n');
writeFileSync(join(out, 'ghl', 'SEO-SETTINGS.md'), `# Page SEO settings\n\nSet these in each page's Settings > SEO meta data in GHL.\n\n| Page | Path | Title | Description | Robots |\n| --- | --- | --- | --- | --- |\n${seoRows.join('\n')}\n`);
console.log(`Built ${seoRows.length} pages into ${out}`);

// Onboarding checklist of every custom value, grouped as in GHL.
const groups = [...new Set(values.map((v) => v.group))];
writeFileSync(join(out, 'ghl', 'CUSTOM-VALUES.md'), `# Custom values to fill for each client\n\nAll of these live in the sub-account under Settings > Custom Values. "Existing" values come from the review-automation snapshot.\n\n${groups.map((g) => `## ${g}\n\n| Name in GHL | Merge tag | What to enter |\n| --- | --- | --- |\n${values.filter((v) => v.group === g).map((v) => `| ${v.name}${v.status === 'existing' ? ' (existing)' : ''} | \`{{ custom_values.${v.key} }}\` | ${(v.help || `e.g. ${v.example}`).replace(/\|/g, '/')} |`).join('\n')}`).join('\n\n')}\n`);
