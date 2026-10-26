// Checks fill.js on the built preview: every tag is filled, and bad values can't inject code.
// Needs Playwright (npm i -D playwright). Usage: node client-template/scripts/build.mjs && node client-template/scripts/test-fill.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const { chromium } = createRequire(import.meta.url)('playwright');
const preview = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'preview');
const browser = await chromium.launch();
const page = await browser.newPage();

for (const file of readdirSync(preview).filter((f) => f.endsWith('.html'))) {
  await page.goto(`file://${join(preview, file)}`);
  const left = await page.evaluate(() => document.body.innerHTML.match(/custom_values\.\w+/g));
  assert.equal(left, null, `${file}: unfilled tags ${left}`);
  for (const ld of await page.$$eval('script[type="application/ld+json"]', (s) => s.map((x) => x.textContent))) JSON.parse(ld);
  assert.ok(!(await page.innerText('body')).includes('{text:'), `${file}: text marker left showing`);
  assert.equal(await page.$$eval('[data-mx-text]', (s) => s.filter((e) => !e.textContent.trim()).length), 0, `${file}: empty text slot`);
}

// A Text element placed after its block, inside its own GHL-style section, still moves in and its section hides.
const area = readFileSync(join(preview, 'area-1.html'), 'utf8');
const [el, moved] = area.match(/<div class="c-text"><p>\{text:body\}<\/p>(<p>[^]*?<\/p>)<\/div>\n/);
const after = area.replace(el, '');
await page.setContent(after.replace('</body>', `<section id="ghl-sec"><div><div class="text-output"><p><strong>{text:body}</strong></p>${moved}</div></div></section></body>`));
assert.ok((await page.textContent('[data-mx-text="body"]')).includes('Logan homes'), 'text placed after its block not moved');
assert.equal(await page.locator('#ghl-sec').evaluate((e) => e.style.display), 'none', 'emptied Text section not hidden');

// Bad values: markup, a javascript: link, CSS that breaks out of the colour, a quote in JSON-LD.
const home = readFileSync(join(preview, 'home.html'), 'utf8')
  .replace('{mx:site_city}Brisbane', '{mx:site_city}&lt;img src=x onerror=alert(1)&gt;')
  .replace(/\{mx:site_google_maps_url\}[^{]*/, '{mx:site_google_maps_url}javascript:alert(1)')
  .replace('{mx:site_brand_color}#0b2545', '{mx:site_brand_color}red;}body{display:none')
  .replace('{mx:site_faq_1_a}', '{mx:site_faq_1_a}"quoted"')
  .replace(/\{mx:site_owner_photo_url\}[^{]*/, '{mx:site_owner_photo_url}');
let dialogs = 0;
page.on('dialog', (d) => { dialogs++; d.dismiss(); });
await page.setContent(home);
assert.equal(dialogs, 0, 'a value ran script');
assert.equal(await page.locator('img[src="x"]').count(), 0, 'markup in a value became an element');
assert.equal(await page.locator('.rating').getAttribute('href'), '#', 'javascript: link survived');
assert.equal(await page.evaluate(() => getComputedStyle(document.body).display), 'block', 'CSS injection applied');
assert.equal(await page.locator('.owner img').evaluate((i) => i.style.display), 'none', 'empty image URL not hidden');
for (const ld of await page.$$eval('script[type="application/ld+json"]', (s) => s.map((x) => x.textContent))) JSON.parse(ld);

// Blank optional values: a sixth service, a job photo and a social link drop out.
const blanks = readFileSync(join(preview, 'home.html'), 'utf8')
  .replace(/\{mx:site_service_6_slug\}[^{]*/, '{mx:site_service_6_slug}')
  .replace(/\{mx:site_service_6_name\}[^{]*/, '{mx:site_service_6_name}')
  .replace(/\{mx:site_gallery_2_url\}[^{]*/, '{mx:site_gallery_2_url}')
  .replace(/\{mx:site_instagram_url\}[^{]*/, '{mx:site_instagram_url}');
await page.setContent(blanks);
assert.equal(await page.$$eval('li[data-mx-opt]', (l) => l.filter((e) => e.style.display === 'none').length), 5, 'blank service still listed');
assert.equal(await page.locator('#services a.card:visible').count(), 5, 'blank service card still shown');
assert.equal(await page.locator('.gallery figure:visible').count(), 5, 'blank job photo not hidden');
assert.equal(await page.locator('a[aria-label="Instagram"]').evaluate((a) => a.style.display), 'none', 'blank social link not hidden');

// GHL embeds load their helper script once, and only after the iframe gets its URL.
const embeds = readFileSync(join(preview, 'home.html'), 'utf8').replace('<div class="hero-revs"', '<iframe data-mx-src="{{ custom_values.site_url }}/w" data-mx-js="https://example.com/w.js"></iframe><iframe data-mx-src="{{ custom_values.site_url }}/w2" data-mx-js="https://example.com/w.js"></iframe><div class="hero-revs"');
await page.route('https://example.com/**', (r) => r.abort());
await page.setContent(embeds);
assert.equal(await page.locator('script[src="https://example.com/w.js"]').count(), 1, 'embed script not loaded exactly once');

await browser.close();
console.log('fill.js checks passed');
