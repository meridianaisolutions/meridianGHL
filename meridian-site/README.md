# Meridian AI Solutions website (GHL)

The new meridianaisolutions.com.au: review management, websites, Google Business Profile management and the all-in-one Local Growth System, modelled on reviewharvest.com, in the Meridian colours with the Inter font. It is built as lean HTML/CSS blocks that are pasted into **Custom Code** elements in a GHL website, with GHL's own calendar and form elements where people book or enquire.

```
site.config.json     brand, ABN, links, offer and pricing (one place to change them)
src/styles.css       all styles, scoped under .mr, colours as tokens at the top
src/partials/        header and footer (become GHL global sections)
src/pages/           one file per page, with its SEO meta at the top
build.mjs            node build.mjs  ->  dist/ghl (paste into GHL) + dist/preview (local preview)
dist/ghl/CHECKLIST.md  generated page-by-page install list
blog/                starter blog posts and the content plan (see blog/README.md)
```

Change copy in `src/`, prices in `site.config.json`, then run `node build.mjs` (Node 18+, no installs) and re-paste the changed blocks.

## Pages

| Page | Slug | Native GHL element |
|---|---|---|
| Home | `/` | none |
| Local Growth System (bundle) | `/local-growth-system` | none |
| Review Management | `/google-reviews` | none |
| Google Business Profile | `/google-business-profile` | none |
| Websites | `/websites` | none |
| Blog | `/blog` | Blog Post List between block 1 and block 2 |
| Book a free call | `/book-a-call` | Calendar ("Demo Call") between block 1 and block 2 |
| Contact | `/contact` | Form ("Website Form") after block 1 |
| Privacy policy | `/privacy-policy` | none |
| Terms and conditions | `/terms-and-conditions` | none |
| Thank you | `/thank-you` | none, noindex |

## Custom values

GHL prints `{{ custom_values.* }}` as raw text inside Custom Code elements (Marcus tested this on 24 Oct 2026), so the build bakes the real values into the blocks instead. `site.config.json` > `customValues` holds each value next to the sub-account custom value it mirrors:

| In the page | Mirrors custom value |
|---|---|
| Business name | `b3_our_business_name` |
| Phone (display and `tel:` links) | `b2_our_business_phone_number` |
| Email | `b1_our_business_email` |
| Header logo | `b5_our_business_logo_link` |
| Client login link | `b7_your_whitelabel_login_url` (https://client.meridianaisolutions.com.au; worth setting the custom value to match) |

When one of these changes in GHL, change it in `site.config.json`, run `node build.mjs` and re-paste the header, footer and any affected blocks. No new custom values were created, and the client template's `site_*` prefix and the review-automation values are untouched.

## Install in GHL

1. **Website.** In Sites > Websites, open (or duplicate) "Review Site Template" and rename it "Meridian Website". Create the pages and slugs in the table above.
2. **Site-wide head code.** Website Settings > Tracking Code > Header: paste `dist/ghl/global/1-site-head-tracking-code.html`. Set the favicon to Meridian's (the files are in `C:\MeridianGHL\_research\web\`).
3. **Header and footer.** On any page add a full-width section with zero padding, a full-width row and one Custom Code element. Paste `2-header-global-section.html`, then save the section as a Global Section named "Meridian Header". Do the same for the footer. Add both global sections to every page.
4. **Each page.** Follow `dist/ghl/CHECKLIST.md`. For every block, add a full-width section with zero padding and margins, a full-width row and a Custom Code element, then paste the block. In the page's Settings: SEO title and description from the checklist, a social share image, and paste the page's `page-head-tracking-code.html` into the page's Header tracking code.
5. **Calendar.** Calendars > "Demo Call": turn it on, rename it "Free Call", set the slot to 20 or 30 minutes, add yourself as the team member, and set the confirmation to redirect to `/thank-you`. Place it on `/book-a-call` where the checklist says.
6. **Form.** Reuse an existing form from the ReviewHarvest snapshot instead of building one. The account has two called "Website Form" (ids `TsKlS8XCtQ6Kt8JWknon` and `9OtY3GqkVxq7ijgq2aq0`) and a "Basic Contact Form" (`6zFw7GQczwSqqK8HAhRZ`). Use whichever has name, email, phone and message fields on `/contact`, add a business name field and a consent checkbox if it lacks them, and turn on its spam protection (captcha). The pop-up, referral and internal feedback forms aren't needed on this site.
7. **Check in preview.** Check the logo's proportions in the header. The block sets it to 36px high, and the width follows the image.
8. **Go live.** Connect meridianaisolutions.com.au to the website, then add URL redirects (Sites > URL Redirects): `/privacy` to `/privacy-policy`, `/terms` to `/terms-and-conditions`, and any old blog post URLs you are not keeping to `/`. Turn on the sitemap, and submit `https://meridianaisolutions.com.au/sitemap.xml` in Google Search Console.

## Review notes

**Speed.** Lighthouse (mobile, simulated throttling) on the preview build: Accessibility 100 and SEO 100 on every page, and Performance 100 on every page except home, which scores 96 to 100 between runs. Best Practices is 96 locally only because the preview server has no favicon. There's no JavaScript beyond loading the fonts without blocking, all icons are inline SVG, the CSS is about 18 KB, and the only images are the logo (and a founder photo later). Once inside GHL, its own page runtime and the calendar and form widgets add weight, so expect the live score to land lower, typically 85 to 95 on mobile. Keeping the home page free of native widgets protects the page that matters most.

**SEO.** One H1 per page, logical heading order, unique titles under 70 characters and descriptions under 160, `en-AU` content and spelling, internal links between the services, pricing and booking pages, and breadcrumbs. Structured data covers ProfessionalService (with ABN, Sydney, Australia-wide), WebSite, WebPage, Service, BreadcrumbList and FAQPage. Google no longer shows FAQ rich results for most sites, but the markup is harmless and helps AI search tools read the answers.

**Security (OWASP).** The pages are static: no scripts handle user input, nothing reads URL parameters, and JSON-LD escapes `<`. There are no third-party libraries (A06), external links use `rel="noopener noreferrer"`, and lead capture uses GHL's native form and calendar, so CSRF, validation and storage are handled by GHL. To finish it off: turn on captcha for the form, use 2FA on every GHL user (A07), and keep the custom values edited only by admins, since they are output into links. GHL doesn't let you set HTTP security headers (CSP, HSTS and so on). Putting Cloudflare in front of the domain can add them, but test it carefully because it can interfere with GHL's SSL.

**Compliance.** The copy avoids review gating (filtering unhappy customers away from Google), incentives and fake reviews, all of which break Google's policies and risk ACCC action. The "Review Faces" funnel isn't part of this website: it's the page clients' customers land on from a review request. It sends red and yellow ratings to an internal feedback page with a smaller "leave a public review" button, which is a soft form of review gating. Google says businesses must not "selectively solicit positive reviews", so the safest version shows every customer the same Google link with equal prominence (see `blog/review-gating-google-policy.html`). Messages mention Spam Act opt-outs. There are no testimonials or invented statistics. The "why reviews matter" facts come from Google's own help article, which is linked on the page.

**Conversion.** One primary action everywhere ("Book a free call"), a sticky call and booking bar on mobile, risk reversal in place of social proof (30-day free trial on reviews, 30-day money-back on websites and the system, no lock-in), review pricing on the home page (as ReviewHarvest does) and each other service priced on its own page, a founder note, a comparison table and FAQs that answer the main objections.

## To confirm before go-live

- **Prices.** Set by Marcus on 24 Oct 2026, in AUD including GST (`site.config.json` > `offer`): reviews $199/$299/$499, profile management $699, websites $249/$299/$499 a month or $4,995/$5,795/$8,295 outright, Site Booster $299, and the system $799 a month + $1,599 setup ($699 a month for 6 months, $666 a month annually). Still to confirm: hosting after month 24 ($99, ReviewHarvest's number).
- **Bundle name.** "Local Growth System" stands in for ReviewHarvest's "Local Authority System" (`brand.systemName`).
- **Guarantees.** 30-day money-back on websites and the system, websites paid off after 24 months, unlimited changes within 2 business days, first website draft in 7 days.
- **Claims** on the pricing and home pages that depend on how delivery is set up: live within 3 days, AI-written review replies, 5-star reviews posted to socials, "connects to the job software you use", unlimited users, 30-day cool-down for repeat customers.
- **Founder photo** for the home page (the spot currently shows an "M" tile; see the comment in `src/pages/home.html`).
- **Legal pages** are a plain-English starting point, not legal advice. Have them checked, especially the trial, cancellation and overseas data sections.
- Whether the old site's blog posts should be kept, since they may carry search traffic.
