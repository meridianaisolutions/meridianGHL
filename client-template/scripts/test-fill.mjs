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
await page.setContent(after.replace('</body>', `<section id="ghl-sec"><div><div class="text-output" style="font-family:Georgia;color:red"><p><strong>{text:body}</strong></p>${moved}</div></div></section></body>`));
assert.ok((await page.textContent('[data-mx-text="body"]')).includes('Logan homes'), 'text placed after its block not moved');
assert.equal(await page.locator('[data-mx-text="body"] > p').count() > 0, true, 'moved text is not plain paragraphs');
assert.equal(await page.locator('[data-mx-text="body"] strong, [data-mx-text="body"] div').count(), 0, 'GHL markup followed the text');
assert.equal(await page.locator('#ghl-sec').evaluate((e) => e.style.display), 'none', 'emptied Text section not hidden');

// Bad values: markup, a javascript: link, a quote in JSON-LD, an empty image URL.
const home = readFileSync(join(preview, 'home.html'), 'utf8')
  .replace('{mx:business_owner_name}Dave', '{mx:business_owner_name}&lt;img src=x onerror=alert(1)&gt;')
  .replace(/\{mx:google_review_link\}[^{]*/, '{mx:google_review_link}javascript:alert(1)')
  .replace('{mx:business_name}', '{mx:business_name}"quoted" ')
  .replace(/\{mx:site_logo\}[^{]*/, '{mx:site_logo}');
let dialogs = 0;
page.on('dialog', (d) => { dialogs++; d.dismiss(); });
await page.setContent(home);
assert.equal(dialogs, 0, 'a value ran script');
assert.equal(await page.locator('img[src="x"]').count(), 0, 'markup in a value became an element');
assert.equal(await page.locator('a', { hasText: 'Leave us a review' }).getAttribute('href'), '#', 'javascript: link survived');
assert.equal(await page.locator('.logo img').evaluate((i) => i.style.display), 'none', 'empty image URL not hidden');
for (const ld of await page.$$eval('script[type="application/ld+json"]', (s) => s.map((x) => x.textContent))) JSON.parse(ld);

// Derived values: the phone link and address parts come from Site Phone Display and Site Address.
await page.goto(`file://${join(preview, 'contact.html')}`);
assert.equal(await page.locator('.mbar a[href^="tel:"]').getAttribute('href'), 'tel:+61400123456', 'phone link not derived');
assert.ok((await page.innerText('body')).includes('12 Example Street Newstead QLD 4006'), 'address parts not derived');
const odd = readFileSync(join(preview, 'contact.html'), 'utf8').replace(/\{mx:site_address\}[^{]*/, '{mx:site_address}PO Box 9');
await page.setContent(odd);
assert.ok((await page.innerText('body')).includes('PO Box 9'), 'unparsed address not shown as the street line');

// GHL embeds load their helper script once, and only after the iframe gets its URL.
const embeds = readFileSync(join(preview, 'home.html'), 'utf8').replace('<div class="hero-revs"', '<iframe data-mx-src="{{ custom_values.google_review_link }}/w" data-mx-js="https://example.com/w.js"></iframe><iframe data-mx-src="{{ custom_values.google_review_link }}/w2" data-mx-js="https://example.com/w.js"></iframe><div class="hero-revs"');
await page.route('https://example.com/**', (r) => r.abort());
await page.setContent(embeds);
assert.equal(await page.locator('script[src="https://example.com/w.js"]').count(), 1, 'embed script not loaded exactly once');

await browser.close();
console.log('fill.js checks passed');
