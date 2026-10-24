# Meridian client website template

A reusable website for Meridian's local-service clients, built for GoHighLevel. It follows the layout of the ReviewHarvest client sites, which we captured and compared page by page on 24 Oct 2026: a floating header with Services, Service areas and About dropdowns, reviews up front, a quote form above the fold, a service ticker, tap-to-call everywhere, an eight-point why-trust list with the owner's story, a guarantee banner, three differentiators, a three-step process, Google reviews, a job gallery, a coverage map, a two-column FAQ, a dark final call to action and a sticky mobile call bar.

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

Pages: Home, Services hub, six service pages, Service areas hub, six area pages, About, Contact, Thank you (noindex), Privacy policy and Terms and conditions.

## Building

```sh
node client-template/scripts/build.mjs
```

This regenerates `dist/`. It fails if a section uses a custom value that isn't in `custom-values.json`, which stops typos reaching a client site.

## Setting up the template in GHL (once)

Do this in the Meridian AI Solutions sub-account. The 71 "Site ..." custom values are already there with example roofing content.

1. Test the fill script. On any page, add a Text element and paste `dist/ghl/TEST/1-text-element.txt` into it. Below it, add a Custom Code element and paste `dist/ghl/TEST/2-custom-code.html`. Preview: you should see only "Fill test: Roofing in Brisbane", with the Text element hidden.
2. Reuse the snapshot's "Website Form" in Sites > Forms as the quote form (there are two with that name, so use the one your workflows trigger on). Make sure it has name, mobile, email, service, job details and GHL's SMS consent field, with the consent text linking to `/privacy-policy` and `/terms-and-conditions`. Turn on its captcha, set "On submit" to redirect to `/thank-you`, and copy its form ID from Integrate into the Site Quote Form ID custom value.
3. Create the website in Sites > Websites, starting blank, and create the pages with the paths in `SEO-SETTINGS.md`. A service or area page's path must match its Slug custom value (`roof-repairs`, `roofing-logan` and so on). GHL page paths are a single segment, so pages sit at `/roof-repairs` rather than `/services/roof-repairs`. That ranks the same; the breadcrumbs and hub pages give Google the hierarchy.
4. Build the header global section. On the home page, add a full-width section with no padding. Put a Text element in it and paste `DATA-TEXT-ELEMENT.txt` into it (as plain text). Below that, add a Custom Code element and paste `dist/ghl/home/01-header.html`. Save the section as a Global section called "Header". It must be the first section on every page, because it carries the styles, the fill script and the data.
5. Add the other blocks. For each page, add one full-width section with no padding per remaining file in `dist/ghl/<page>/`, in order, each holding one Custom Code element with that file's contents. Save the trust strip, why trust us, guarantee, differentiators, how it works, reviews, gallery, service areas, FAQ, final CTA and footer as Global sections the first time and reuse them, so one change updates every page. The last file on most pages is the structured data block.
6. Turn on the website's sitemap in its settings. Once a client's domain is live, verify it in Google Search Console and submit the sitemap, and link the site from their Google Business Profile.
7. Set each page's SEO title and description from `SEO-SETTINGS.md`. Check on one page that the custom values in them render in the preview's browser tab title. Tick noindex on the Thank you page.
8. Upload a favicon and set the site's social share image. Leave the GHL chat widget off unless a client asks for it: only one of the nine ReviewHarvest sites runs one, and it costs about 5 to 10 Lighthouse points on mobile.
9. Take the snapshot.

## Onboarding a client

1. Load the snapshot into the client's sub-account.
2. Fill in every value in `dist/ghl/CUSTOM-VALUES.md`. Copy the Google rating and review count straight from their Google Business Profile, and use three real reviews.
3. Upload their logo (400 x 160 PNG or SVG), hero photo (1600 x 1000 WebP under 150 KB), owner photo (640 x 640 WebP) and six job photos (800 x 600 WebP) to Media and paste the links into the image custom values. A blank job photo is hidden, as are blank social links and a blank map.
4. Write the six Site Area Body values fresh for each client: 100 to 200 words each about local housing, weather and typical jobs. Area pages share their layout, so this text is what stops Google treating them as duplicates.
5. Update the Site Quote Form ID. The snapshot copies the form but gives it a new ID, and until you change the value the form on their site sends leads to the template account.
6. Connect their domain, then test the form, the phone links and the thank-you redirect on a phone.

Rules for values: avoid `<` and `>`, never use `{mx:` or `{/mx}`, and use hex codes for the brand and accent colours. The accent colour is the button colour and needs at least 4.5:1 contrast with white text. Check it at webaim.org/resources/contrastchecker.

## Design review

### Conversion

One goal per page: get a quote or call. The quote form sits in the hero on desktop and directly under the headline on mobile, every section ends in a call to action, the phone number is in the top bar, header, hero, footer and a sticky bottom bar on mobile, and the Google rating appears in the first screen. The form asks for name and mobile, with email, service and job details optional, plus an SMS consent box, matching the ReviewHarvest forms. Social proof uses real Google reviews pulled from custom values, plus the owner's photo and story, which is what makes small local businesses feel safe to call.

### SEO

Page titles and descriptions are set in GHL's page settings, so they are in the HTML GHL serves. Body content is filled in by the script before first paint. Google renders JavaScript and indexes the filled page. Crawlers that don't run JavaScript (some AI and SEO tools) still see every value in the data Text element, but out of context. One H1 per page that combines the trade and city ("Roofing in Brisbane"), a dedicated page per service with "Service + City" titles, internal links from every service card and the footer, LocalBusiness, Service, FAQPage and BreadcrumbList structured data, Australian English copy and a consistent name, address and phone that should match the Google Business Profile exactly. Review stars are deliberately not marked up in structured data: Google ignores self-served review ratings on a business's own site and can treat them as spam.

### Performance

No web fonts, no frameworks, one 2 KB script, inline SVG icons, one stylesheet (about 9 KB, inside the header block), explicit image sizes so nothing shifts, the hero image marked high priority and everything below the fold lazy-loaded. The preview mimics what GHL serves (data Text element plus raw-tag blocks filled by the script) and scores 100 in all four Lighthouse categories on mobile and desktop. On GHL the score will be lower because GHL loads its own page scripts and the form is GHL's embedded form app, neither of which we control. The form iframe is lazy-loaded so on mobile it doesn't load until it scrolls near the screen. Expect roughly 85 to 95 on mobile once live, mostly from GHL's runtime.

### Security

The blocks have no inline event handlers, load no third-party scripts beyond GHL's own form embed, sanitise every value the fill script inserts (tested against script, link and CSS injection), use `rel="noopener noreferrer"` on every external link, and never echo visitor input. Form spam and injection are handled by GHL's form with captcha on. HTTPS, security headers and hosting are controlled by GHL. If a client wants stricter headers (HSTS, Content-Security-Policy), put the domain behind Cloudflare and add them there.

### Accessibility and UX

Skip link, visible focus rings, 48 px tap targets, WCAG AA colour contrast, a menu that works without JavaScript (`<details>`), FAQ accordions that work without JavaScript, reduced-motion support, and no horizontal scroll at 390 px wide.

## Known limits

- The header floats over the first section using fixed positioning, so it stays on screen as visitors scroll. If a GHL section ever stops it floating, check that the header section has no animation or transform set, since those break fixed positioning.
- Service pages share one layout and pull their unique text from the service name and description. For stronger rankings in competitive trades, add 300 to 600 words of genuinely unique copy per service page.
- Not copied from ReviewHarvest on purpose: the interactive floor-plan checklist, before/after slider, hero video, published prices, client portal button and ZIP-code quoting. Each suits only some trades, and the video and slider cost speed. They can be added per client.
- The template has six service and six area pages. For a client with fewer, leave the spare service's or area's Name and Slug blank and unpublish its page. It then drops out of the menus, footer and card grids.
- The footer credit reads "Website by Meridian AI Solutions Pty Ltd". To show a shorter name such as "Meridian AI Solutions", register it as a business name with ASIC first.
