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
}

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

await browser.close();
console.log('fill.js checks passed');
