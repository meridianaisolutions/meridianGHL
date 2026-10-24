# Meridian client website template

A reusable website for Meridian's local-service clients, built for GoHighLevel. It follows the layout of the ReviewHarvest client sites: reviews up front, a quote form above the fold, tap-to-call everywhere, services, a three-step process, the owner's story, service areas, FAQ and a sticky mobile call bar.

Every piece of client-specific text, colour, image and link comes from a GHL custom value, so a new client is set up by loading the snapshot and filling in the custom values. No page editing is needed.

## What's in here

| Path | What it is |
| --- | --- |
| `dist/ghl/<page>/NN-*.html` | **Paste these into GHL.** One file per Custom Code element, in page order |
| `dist/ghl/site.css` | Site-wide stylesheet, pasted once into the website's custom CSS |
| `dist/ghl/SEO-SETTINGS.md` | Title, description and path for each page |
| `dist/ghl/CUSTOM-VALUES.md` | Onboarding checklist of every custom value to fill per client |
| `dist/preview/*.html` | Standalone preview with example values. Open `home.html` in a browser |
| `sections/`, `site.css`, `pages.json`, `custom-values.json` | The source. Edit these, then rebuild |
| `test/custom-values-check.html` | One-line test that custom values render inside Custom Code |

Pages: Home, six service pages, Contact, Thank you (noindex) and Privacy policy.

## Building

```sh
node client-template/scripts/build.mjs
```

This regenerates `dist/`. It fails if a section uses a custom value that isn't in `custom-values.json`, which stops typos reaching a client site.

## Setting up the template in GHL (once)

Do this in the **Meridian AI Solutions** sub-account. The 71 "Site ..." custom values are already there with example roofing content.

1. **Check merge tags render.** Paste `test/custom-values-check.html` into a Custom Code element on any page and preview it. You should see "Roofing in Brisbane". If you see the raw `{{ custom_values... }}` text instead, stop and say so.
2. **Create the quote form** in Sites > Forms with Name, Phone, Suburb, Service needed and Message. Turn on the captcha, set "On submit" to redirect to `/thank-you`, and copy the form ID from Integrate into the **Site Quote Form ID** custom value.
3. **Create the website** in Sites > Websites, starting blank. In the website's settings, paste `dist/ghl/site.css` into Custom CSS. If your GHL version only has per-page CSS, paste it there on each page instead.
4. **Create the pages** with the paths in `SEO-SETTINGS.md`. A service page's path must match that service's **Slug** custom value (`roof-repairs` and so on).
5. **Add the blocks.** For each page, add one full-width section per file in `dist/ghl/<page>/`, in order. Remove the section's padding, drop in a Custom Code element and paste the file contents. Save the header, trust strip, how it works, reviews, FAQ, final CTA and footer blocks as **Global sections** the first time, then reuse them on the other pages so a change updates every page.
6. **Set each page's SEO** title and description from `SEO-SETTINGS.md`, and tick noindex on the Thank you page.
7. **Upload a favicon** and set the site's social share image.
8. Take the **snapshot**.

## Onboarding a client

1. Load the snapshot into the client's sub-account.
2. Fill in every value in `dist/ghl/CUSTOM-VALUES.md`. Copy the Google rating and review count straight from their Google Business Profile, and use three real reviews.
3. Upload their logo (400 x 160 PNG or SVG), hero photo (1600 x 1000 WebP under 150 KB) and owner photo (640 x 640 WebP) to Media and paste the links into the image custom values.
4. Recreate the quote form ID: the snapshot copies the form, but it gets a new ID in the new sub-account.
5. Connect their domain, then test the form, the phone links and the thank-you redirect on a phone.

Rules for values: no double quotes or `<` `>` characters (GHL inserts values as raw HTML, and a quote breaks the structured data), and brand/accent colours must be hex codes. The accent colour is the button colour and needs at least 4.5:1 contrast with white text. Check it at webaim.org/resources/contrastchecker.

## How it was reviewed

**Conversion.** One goal per page: get a quote or call. The quote form sits in the hero on desktop and directly under the headline on mobile, every section ends in a call to action, the phone number is in the top bar, header, hero, footer and a sticky bottom bar on mobile, and the Google rating appears in the first screen. The form asks for four things only. Social proof uses real Google reviews pulled from custom values, plus the owner's photo and story, which is what makes small local businesses feel safe to call.

**SEO.** One H1 per page that combines the trade and city ("Roofing in Brisbane"), a dedicated page per service with "Service + City" titles, internal links from every service card and the footer, LocalBusiness, Service, FAQPage and BreadcrumbList structured data, Australian English copy and a consistent name, address and phone that should match the Google Business Profile exactly. Review stars are deliberately **not** marked up in structured data: Google ignores self-served review ratings on a business's own site and can treat them as spam.

**Performance.** No web fonts, no JavaScript of our own, no frameworks, inline SVG icons, one CSS file (about 9 KB), explicit image sizes so nothing shifts, the hero image marked high priority and everything below the fold lazy-loaded. The preview scores 100 in all four Lighthouse categories on mobile and desktop. On GHL the score will be lower because GHL loads its own page scripts and the form is GHL's embedded form app, neither of which we control. The form iframe is lazy-loaded so on mobile it doesn't load until it scrolls near the screen. Expect roughly 85 to 95 on mobile once live, mostly from GHL's runtime.

**Security.** The blocks have no inline event handlers, load no third-party scripts beyond GHL's own form embed, use `rel="noopener noreferrer"` on every external link, and never echo visitor input. Form spam and injection are handled by GHL's form with captcha on. HTTPS, security headers and hosting are controlled by GHL. If a client wants stricter headers (HSTS, Content-Security-Policy), put the domain behind Cloudflare and add them there.

**Accessibility and UX.** Skip link, visible focus rings, 48 px tap targets, WCAG AA colour contrast, a menu that works without JavaScript (`<details>`), FAQ accordions that work without JavaScript, reduced-motion support, and no horizontal scroll at 390 px wide.

## Known limits

- The header is set to stick to the top, but GHL wraps each Custom Code element in its own section, which usually stops sticky positioning. The mobile call bar is fixed, so the main call to action stays visible either way. If you want a sticky header, turn on GHL's sticky setting for the header section.
- Service pages share one layout and pull their unique text from the service name and description. For stronger rankings in competitive trades, add 300 to 600 words of genuinely unique copy per service page.
- The ReviewHarvest client sites were not reachable from this environment, so this layout is built from the standard high-converting local-service pattern they use rather than a direct comparison. Revisit once those domains are allowed.
