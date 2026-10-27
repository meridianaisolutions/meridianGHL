// Builds the template into two outputs:
//   dist/ghl/<page>.html      paste-ready custom code with {{ custom_values.* }} merge tags
//   dist/preview/<page>.html  a standalone page with example values, for Lighthouse and review
// Usage: node client-template/scripts/build.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const { values: all, keep, derived } = JSON.parse(read('custom-values.json'));
// Only kept values stay merge tags; the rest are typed into the paste files from their example.
const values = all.filter((v) => keep.includes(v.key));
const tagged = new Set([...keep, ...derived]);
const { pages } = JSON.parse(read('pages.json'));
const texts = JSON.parse(read('texts.json'));
const examples = Object.fromEntries(all.map((v) => [v.key, v.example]));
// The preview uses local images so it can be tested offline.
Object.assign(examples, { logo_link: 'assets/logo.png', site_hero_image_url: 'assets/hero.webp', site_owner_photo_url: 'assets/owner.webp' });
for (let i = 1; i <= 6; i++) examples[`site_gallery_${i}_url`] = examples[`site_service_${i}_image_url`] = `assets/job-${i}.webp`;
const known = new Set(all.map((v) => v.key));
const SERVICES = 6;
const AREAS = 6;

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
  down: svg('<path d="m6 9 6 6 6-6"/>', 14),
  facebook: svg('<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>'),
  instagram: svg('<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>'),
  arrow: svg('<path d="M5 12h14M13 5l7 7-7 7"/>', 18),
  google: `<svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>`,
};
const stars = icons.star.repeat(5);

// Quote card. In GHL it embeds the client's quote form by ID; in the preview it shows a
// stand-in so Lighthouse measures the template rather than GHL's form app.
const quoteCard = (form) => `<div class="quote" id="quote">
    <h2>Get a free quote</h2>
    <p>Takes 30 seconds. We reply within 24 hours and there's no obligation.</p>
    ${form}
  </div>`;
const ghlForm = `<iframe data-mx-src="https://webapi.meridianaisolutions.com.au/widget/form/{{cv.site_quote_form_id}}" id="inline-{{cv.site_quote_form_id}}" title="Free quote form" loading="lazy" style="width:100%;height:560px;border:none;border-radius:8px" data-layout="{'id':'INLINE'}" data-trigger-type="alwaysShow" data-activation-type="alwaysActivated" data-deactivation-type="neverDeactivate" data-form-id="{{cv.site_quote_form_id}}" data-height="560" data-mx-js="https://link.msgsndr.com/js/form_embed.js"></iframe>`;
// Hero reviews. GHL shows the client's Reputation review widget (5-star filter and colours are
// set in the widget); the preview shows two static cards so it can be scored offline.
const ghlReviews = `<iframe class="lc_reviews_widget" data-mx-src="{{cv.site_review_widget_url}}" data-mx-js="https://reputationhub.site/reputation/assets/review-widget.js" title="Google reviews" loading="lazy" scrolling="no" style="width:100%;min-width:100%;border:0"></iframe>`;
const reviewCard = (n) => `<figure class="hr-card"><span class="stars" aria-hidden="true">${stars}</span><blockquote>{{cv.site_review_${n}_text}}</blockquote><figcaption>${icons.google} {{cv.site_review_${n}_name}}, {{cv.site_review_${n}_suburb}} <time>{{cv.site_review_${n}_date}}</time></figcaption></figure>`;
const previewForm = `<form class="f" action="#" onsubmit="return false">
      <label>Name<input name="name" autocomplete="name" required></label>
      <label>Mobile<input name="phone" type="tel" autocomplete="tel" inputmode="tel" required></label>
      <label>Suburb<input name="suburb" autocomplete="address-level2"></label>
      <label>Email<input name="email" type="email" autocomplete="email"></label>
      <label>What do you need?<select name="service">${Array.from({ length: SERVICES }, (_, i) => `<option>{{cv.site_service_${i + 1}_name}}</option>`).join('')}<option>Not sure yet</option></select></label>
      <label>Tell us about the job<textarea name="details" rows="3"></textarea></label>
      <label class="consent"><input type="checkbox" name="sms_consent"><span>I agree to receive texts about my quote and booking. Msg and data rates may apply. Reply STOP to opt out. See our <a href="/privacy-policy">privacy policy</a> and <a href="/terms-and-conditions">terms</a>.</span></label>
      <button class="btn btn-accent" type="submit">Send My Quote Request</button>
    </form>`;

const serviceCards = (skip) =>
  Array.from({ length: SERVICES }, (_, i) => i + 1)
    .filter((n) => n !== skip)
    .map((n) => `<a class="card" data-mx-opt href="/{{cv.site_service_${n}_slug}}"><img src="{{cv.site_service_${n}_image_url}}" alt="{{cv.site_service_${n}_name}}" width="800" height="600" loading="lazy" decoding="async"><h3>{{cv.site_service_${n}_name}}</h3><p>{{cv.site_service_${n}_desc}}</p><span class="more">Learn more ${icons.arrow}</span></a>`)
    .join('\n    ');
const links = (slot, count, skip) =>
  Array.from({ length: count }, (_, i) => i + 1)
    .filter((n) => n !== skip)
    .map((n) => `<li data-mx-opt><a href="/{{cv.site_${slot}_${n}_slug}}">{{cv.site_${slot}_${n}_name}}</a></li>`)
    .join('');
const areaCards = Array.from({ length: AREAS }, (_, i) => i + 1)
  .map((n) => `<a class="card" data-mx-opt href="/{{cv.site_area_${n}_slug}}"><span class="ico">${icons.pin}</span><h3>{{cv.site_area_${n}_name}}</h3><p>{{cv.site_area_${n}_suburbs}}</p><span class="more">{{cv.site_trade}} in {{cv.site_area_${n}_name}} ${icons.arrow}</span></a>`)
  .join('\n    ');
const plainServices = Array.from({ length: SERVICES }, (_, i) => `<li data-mx-opt>{{cv.site_service_${i + 1}_name}}</li>`).join('');

// JSON-LD. Values are written as {{cv.x}} placeholders and filled per output, so the
// GHL output keeps merge tags and the preview gets JSON-escaped example text.
function schemaFor(page, n) {
  const slot = `site_${page.slot || 'service'}_${n}_`;
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
    if (kind === 'area')
      blocks.push({ '@context': 'https://schema.org', '@type': 'Service', name: `{{cv.site_trade}} in {{cv.${slot}name}}`, serviceType: '{{cv.site_trade}}', areaServed: { '@type': 'Place', name: `{{cv.${slot}name}}` }, provider: { '@id': '{{cv.site_url}}/#business' } });
    if (kind === 'breadcrumb-hub')
      blocks.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: '{{cv.site_url}}/' }, { '@type': 'ListItem', position: 2, name: page.crumb, item: `{{cv.site_url}}${page.path}` }] });
    if (kind === 'breadcrumb')
      blocks.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: '{{cv.site_url}}/' }, { '@type': 'ListItem', position: 2, name: `{{cv.${slot}name}}`, item: `{{cv.site_url}}/{{cv.${slot}slug}}` }] });
  }
  return blocks.map((b) => `<script type="application/ld+json">${JSON.stringify(b)}</script>`).join('\n');
}

const css = read('site.css').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').trim();
// fill.js swaps the merge tags in Custom Code blocks; strip its comments and indentation.
const fillJs = read('fill.js').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('//')).join('\n');
const refill = '<script>window.mxFill&&mxFill(document.currentScript.parentNode)</script>';

function renderSection(name, page, n, mode) {
  let html = read(`sections/${name}.html`).replace(/^<!--[\s\S]*?-->\n?/, '');
  // The header carries the brand colours so every page that uses it is themed.
  if (name === '01-header') html = `<style>${css}</style>\n` + read('sections/00-theme.html').replace(/^<!--[\s\S]*?-->\n?/, '') + html;
  html = html
    .replaceAll('{{hero_reviews}}', mode === 'ghl' ? ghlReviews : reviewCard(1) + reviewCard(2))
    .replaceAll('{{reviews_widget}}', mode === 'ghl' ? ghlReviews : '<p class="rev-ph">Your Google review widget shows here</p>')
    .replaceAll('{{quote_card}}', quoteCard(mode === 'ghl' ? ghlForm : previewForm))
    .replaceAll('{{services_cards}}', serviceCards(page.slot === 'area' ? null : n))
    .replaceAll('{{services_links_plain}}', plainServices)
    .replaceAll('{{areas_cards}}', areaCards)
    .replaceAll('{{services_links}}', links('service', SERVICES))
    .replaceAll('{{areas_links}}', links('area', AREAS))
    .replaceAll('{{other_areas_links}}', links('area', AREAS, page.slot === 'area' ? n : null))
    .replaceAll('{{stars}}', stars)
    .replace(/\{\{icon:(\w+)\}\}/g, (_, k) => { if (!icons[k]) throw new Error(`Unknown icon ${k} in ${name}`); return icons[k]; });
  if (n) html = html.replaceAll(`site_${page.slot || 'service'}_N_`, `site_${page.slot || 'service'}_${n}_`);
  // Browsers would request an image or form URL before the tags are filled, so those wait in data-mx-src.
  html = html.replace(/<(img|iframe)([^>]*?) src="([^"]*\{\{cv\.[^"]*)"/g, '<$1$2 data-mx-src="$3"');
  html = html.trim();
  return name === '01-header' ? `${html}\n<script>${fillJs}\nmxFill(document.currentScript.parentNode)</script>` : `${html}\n${refill}`;
}

const esc = (v) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Fill {{cv.key}} tokens. Inside JSON-LD the example text is JSON-escaped.
function fill(html, mode) {
  const sub = (key, inJson) => {
    if (!known.has(key)) throw new Error(`Unknown custom value: ${key}`);
    // 'local' is the GHL code with the preview's local images, for the standalone preview.
    if (mode !== 'preview' && tagged.has(key)) return `{{ custom_values.${key} }}`;
    // Typed-in values use the real example, not the preview's local stand-in images.
    const v = (mode === 'ghl' ? all.find((x) => x.key === key).example : examples[key]) ?? '';
    return inJson ? JSON.stringify(v).slice(1, -1) : esc(v);
  };
  return html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)|\{\{cv\.(\w+)\}\}/g, (m, open, body, close, key) =>
    open ? open + body.replace(/\{\{cv\.(\w+)\}\}/g, (_, k) => sub(k, true)) + close : sub(key, false))
    // Images whose URL is now typed in can load straight away.
    .replace(/<img([^>]*?) data-mx-src="([^"{]*)"/g, '<img$1 src="$2"');
}

const out = join(root, 'dist');
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'ghl'), { recursive: true });
mkdirSync(join(out, 'preview'), { recursive: true });
cpSync(join(root, 'preview-assets'), join(out, 'preview', 'assets'), { recursive: true });

// Paste as plain text into one Paragraph element at the top of every page (inside the header global section), hidden on Desktop, Tablet and Mobile.
const dataLines = values.map((v) => `{mx:${v.key}}{{ custom_values.${v.key} }}{/mx}`);
const seoRows = [];
for (const page of pages) {
  const ns = page.repeat ? Array.from({ length: page.repeat }, (_, i) => i + 1) : [null];
  for (const n of ns) {
    const id = n ? page.id.replace('N', n) : page.id;
    const sub = (s) => (n ? s.replaceAll(`site_${page.slot || 'service'}_N_`, `site_${page.slot || 'service'}_${n}_`) : s);
    const schema = schemaFor(page, n);
    const blocks = (mode) => page.sections.map((name) => ({ name, html: renderSection(name, page, n, mode) }));

    // GHL: one file per Custom Code element, in page order. Shared blocks (header,
    // footer and so on) are identical on every page, so they can be GHL global sections.
    const dir = join(out, 'ghl', id);
    mkdirSync(dir, { recursive: true });
    const ghlBlocks = blocks('ghl');
    if (schema) ghlBlocks.push({ name: '99-schema', html: `${schema}\n${refill}` });
    const wrap = (html, mode = 'ghl') => `<div class="mx">\n${fill(html, mode)}\n</div>`;
    // Each data-mx-text slot gets its copy from a native Text element pasted just before its block.
    const textOf = (slot) => {
      const t = typeof texts[slot] === 'string' ? texts[slot] : texts[slot]?.[id];
      if (!t) throw new Error(`No ${slot} text for ${id} in texts.json`);
      return t;
    };
    const slotsIn = (html) => [...html.matchAll(/data-mx-text="(\w+)"/g)].map((m) => m[1]);
    const files = ghlBlocks.flatMap((b) => [...slotsIn(b.html).map((slot) => ({ name: `text-${slot}`, txt: `{text:${slot}}\n\n${textOf(slot)}\n` })), b]);
    files.forEach(({ name, html, txt }, i) => {
      const base = `${String(i + 1).padStart(2, '0')}-${name.replace(/^\d+-/, '')}`;
      writeFileSync(join(dir, txt ? `${base}.txt` : `${base}.html`), txt ?? `${wrap(html)}\n`);
    });
    // The preview is what GHL serves: the data Text element rendered with example values,
    // then the same blocks with raw merge tags, filled in the browser by fill.js.
    const previewBlocks = blocks('preview');
    if (schema) previewBlocks.push({ name: 'schema', html: `${schema}\n${refill}` });
    const previewBody = `<div class="c-text"><p>${dataLines.map((l) => fill(l.replace(/\{\{ custom_values\.(\w+) \}\}/, '{{cv.$1}}'), 'preview')).join('</p><p>')}</p></div>\n${previewBlocks.map((b) => slotsIn(b.html).map((slot) => `<div class="c-text"><p>{text:${slot}}</p>${textOf(slot).split(/\n\s*\n/).map((p) => `<p>${esc(p)}</p>`).join('')}</div>\n`).join('') + wrap(b.html, 'local')).join('\n')}`;

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
<style>html,body{margin:0}</style>
</head>
<body>
${previewBody}
</body>
</html>
`);
    seoRows.push(`| ${id} | \`${fill(sub(page.path), 'ghl')}\` | ${fill(sub(page.title), 'ghl').replace(/\|/g, '\\|')} | ${fill(sub(page.description), 'ghl')} | ${page.noindex ? 'noindex' : 'index'} |`);
  }
}

writeFileSync(join(out, 'ghl', 'DATA-TEXT-ELEMENT.txt'), dataLines.join('\n') + '\n');
writeFileSync(join(out, 'ghl', 'SEO-SETTINGS.md'), `# Page SEO settings\n\nSet these in each page's Settings > SEO meta data in GHL.\n\n| Page | Path | Title | Description | Robots |\n| --- | --- | --- | --- | --- |\n${seoRows.join('\n')}\n`);
console.log(`Built ${seoRows.length} pages into ${out}`);

// Onboarding checklist of every custom value, grouped as in GHL.
const groups = [...new Set(values.map((v) => v.group))];
writeFileSync(join(out, 'ghl', 'CUSTOM-VALUES.md'), `# Custom values to fill for each client\n\nAll of these live in the sub-account under Settings > Custom Values. "Existing" values come from the review-automation snapshot.\n\n${groups.map((g) => `## ${g}\n\n| Name in GHL | Merge tag | What to enter |\n| --- | --- | --- |\n${values.filter((v) => v.group === g).map((v) => `| ${v.name}${v.status === 'existing' ? ' (existing)' : ''} | \`{{ custom_values.${v.key} }}\` | ${(v.help || `e.g. ${v.example}`).replace(/\|/g, '/')} |`).join('\n')}`).join('\n\n')}\n`);

// Two-part install test: proves the fill script runs in a GHL Custom Code element.
mkdirSync(join(out, 'ghl', 'TEST'), { recursive: true });
writeFileSync(join(out, 'ghl', 'TEST', '1-text-element.txt'), '{mx:site_trade}{{ custom_values.site_trade }}{/mx}\n{mx:site_city}{{ custom_values.site_city }}{/mx}\n');
writeFileSync(join(out, 'ghl', 'TEST', '2-custom-code.html'), `<div class="mx"><p style="font:20px system-ui;padding:20px">Fill test: {{ custom_values.site_trade }} in {{ custom_values.site_city }}</p>\n<script>${fillJs}\nmxFill(document.currentScript.parentNode)</script></div>\n`);
