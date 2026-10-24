# Meridian client website template

A reusable website for Meridian's local-service clients, built for GoHighLevel. It follows the layout of the ReviewHarvest client sites: reviews up front, a quote form above the fold, tap-to-call everywhere, services, a three-step process, the owner's story, service areas, FAQ and a sticky mobile call bar.

Every piece of client-specific text, colour, image and link comes from a GHL custom value, so a new client is set up by loading the snapshot and filling in the custom values. No page editing is needed.

## How custom values reach the page

GHL fills in `{{ custom_values.* }}` in native elements (Text, Headline, Button, Image) but prints them as raw text inside Custom Code. So each page carries one native Text element holding every value as `{mx:key}value{/mx}` pairs, which GHL fills in. A small script in the header block (`fill.js`, about 2 KB) reads those pairs, hides the Text element, and swaps the tags in each block as the page is parsed, before it is first painted. Visitors and Google's renderer only ever see the filled page.

The script inserts values as plain text, only allows http, https, tel, mailto and relative links, only allows hex or named colours, and JSON-escapes values going into structured data, so a bad value can't inject code.

## What's in here

| Path | What it is |
| --- | --- |
| `dist/ghl/<page>/NN-*.html` | Paste these into GHL. One file per Custom Code element, in page order |
| `dist/ghl/DATA-TEXT-ELEMENT.txt` | Contents of the native Text element that carries the custom values |
| `dist/ghl/SEO-SETTINGS.md` | Title, description and path for each page |
| `dist/ghl/CUSTOM-VALUES.md` | Onboarding checklist of every custom value to fill per client |
| `dist/preview/*.html` | Standalone preview with example values. Open `home.html` in a browser |
| `dist/ghl/TEST/` | Two-part test that the fill script works in your GHL account |
| `sections/`, `site.css`, `fill.js`, `pages.json`, `custom-values.json` | The source. Edit these, then rebuild |

Pages: Home, six service pages, Contact, Thank you (noindex) and Privacy policy.

## Building

```sh
node client-template/scripts/build.mjs
```

This regenerates `dist/`. It fails if a section uses a custom value that isn't in `custom-values.json`, which stops typos reaching a client site.

## Setting up the template in GHL (once)

Do this in the Meridian AI Solutions sub-account. The 71 "Site ..." custom values are already there with example roofing content.

1. Test the fill script. On any page, add a Text element and paste `dist/ghl/TEST/1-text-element.txt` into it. Below it, add a Custom Code element and paste `dist/ghl/TEST/2-custom-code.html`. Preview: you should see only "Fill test: Roofing in Brisbane", with the Text element hidden.
2. Reuse the snapshot's "Website Form" in Sites > Forms as the quote form (there are two with that name, so use the one your workflows trigger on). Turn on its captcha, set "On submit" to redirect to `/thank-you`, and copy its form ID from Integrate into the Site Quote Form ID custom value.
3. Create the website in Sites > Websites, starting blank, and create the pages with the paths in `SEO-SETTINGS.md`. A service page's path must match that service's Slug custom value (`roof-repairs` and so on).
4. Build the header global section. On the home page, add a full-width section with no padding. Put a Text element in it and paste `DATA-TEXT-ELEMENT.txt` into it (as plain text). Below that, add a Custom Code element and paste `dist/ghl/home/01-header.html`. Save the section as a Global section called "Header". It must be the first section on every page, because it carries the styles, the fill script and the data.
5. Add the other blocks. For each page, add one full-width section with no padding per remaining file in `dist/ghl/<page>/`, in order, each holding one Custom Code element with that file's contents. Save the trust strip, how it works, reviews, FAQ, final CTA and footer as Global sections the first time and reuse them, so one change updates every page. The last file on most pages is the structured data block.
6. Turn on the website's sitemap in its settings. Once a client's domain is live, verify it in Google Search Console and submit the sitemap, and link the site from their Google Business Profile.
7. Set each page's SEO title and description from `SEO-SETTINGS.md`. Check on one page that the custom values in them render in the preview's browser tab title. Tick noindex on the Thank you page.
8. Upload a favicon and set the site's social share image.
9. Take the snapshot.

## Onboarding a client

1. Load the snapshot into the client's sub-account.
2. Fill in every value in `dist/ghl/CUSTOM-VALUES.md`. Copy the Google rating and review count straight from their Google Business Profile, and use three real reviews.
3. Upload their logo (400 x 160 PNG or SVG), hero photo (1600 x 1000 WebP under 150 KB) and owner photo (640 x 640 WebP) to Media and paste the links into the image custom values.
4. Update the Site Quote Form ID. The snapshot copies the form but gives it a new ID, and until you change the value the form on their site sends leads to the template account.
5. Connect their domain, then test the form, the phone links and the thank-you redirect on a phone.

Rules for values: avoid `<` and `>`, never use `{mx:` or `{/mx}`, and use hex codes for the brand and accent colours. The accent colour is the button colour and needs at least 4.5:1 contrast with white text. Check it at webaim.org/resources/contrastchecker.

## Design review

### Conversion

One goal per page: get a quote or call. The quote form sits in the hero on desktop and directly under the headline on mobile, every section ends in a call to action, the phone number is in the top bar, header, hero, footer and a sticky bottom bar on mobile, and the Google rating appears in the first screen. The form asks for four things only. Social proof uses real Google reviews pulled from custom values, plus the owner's photo and story, which is what makes small local businesses feel safe to call.

### SEO

Page titles and descriptions are set in GHL's page settings, so they are in the HTML GHL serves. Body content is filled in by the script before first paint. Google renders JavaScript and indexes the filled page. Crawlers that don't run JavaScript (some AI and SEO tools) still see every value in the data Text element, but out of context. One H1 per page that combines the trade and city ("Roofing in Brisbane"), a dedicated page per service with "Service + City" titles, internal links from every service card and the footer, LocalBusiness, Service, FAQPage and BreadcrumbList structured data, Australian English copy and a consistent name, address and phone that should match the Google Business Profile exactly. Review stars are deliberately not marked up in structured data: Google ignores self-served review ratings on a business's own site and can treat them as spam.

### Performance

No web fonts, no frameworks, one 2 KB script, inline SVG icons, one stylesheet (about 9 KB, inside the header block), explicit image sizes so nothing shifts, the hero image marked high priority and everything below the fold lazy-loaded. The preview mimics what GHL serves (data Text element plus raw-tag blocks filled by the script) and scores 100 in all four Lighthouse categories on mobile and desktop. On GHL the score will be lower because GHL loads its own page scripts and the form is GHL's embedded form app, neither of which we control. The form iframe is lazy-loaded so on mobile it doesn't load until it scrolls near the screen. Expect roughly 85 to 95 on mobile once live, mostly from GHL's runtime.

### Security

The blocks have no inline event handlers, load no third-party scripts beyond GHL's own form embed, sanitise every value the fill script inserts (tested against script, link and CSS injection), use `rel="noopener noreferrer"` on every external link, and never echo visitor input. Form spam and injection are handled by GHL's form with captcha on. HTTPS, security headers and hosting are controlled by GHL. If a client wants stricter headers (HSTS, Content-Security-Policy), put the domain behind Cloudflare and add them there.

### Accessibility and UX

Skip link, visible focus rings, 48 px tap targets, WCAG AA colour contrast, a menu that works without JavaScript (`<details>`), FAQ accordions that work without JavaScript, reduced-motion support, and no horizontal scroll at 390 px wide.

## Known limits

- The header is set to stick to the top, but GHL wraps each Custom Code element in its own section, which usually stops sticky positioning. The mobile call bar is fixed, so the main call to action stays visible either way. If you want a sticky header, turn on GHL's sticky setting for the header section.
- Service pages share one layout and pull their unique text from the service name and description. For stronger rankings in competitive trades, add 300 to 600 words of genuinely unique copy per service page.
- The ReviewHarvest client sites were not reachable from this environment, so this layout is built from the standard high-converting local-service pattern they use rather than a direct comparison. Revisit once those domains are allowed.
