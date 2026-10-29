# Security headers for GHL sites

Applies to the main site (`meridianaisolutions.com.au`, `www.`) and client sites built from `client-template/`.
Do **not** add any of these to `webapi.meridianaisolutions.com.au` or `dashboard.`: those are GHL's own app and form domains, and a frame header there stops the quote form iframes from loading on every site.

## How to apply them

GHL sites and funnels have no setting for response headers. Two options:

1. **Meta tag in Site settings > Tracking code > Head.** Only works for `Content-Security-Policy` (without `frame-ancestors`) and `Referrer-Policy`. Everything else is ignored as a meta tag.
2. **Your own Cloudflare in front (free plan). This is the real fix, but test it first.** GHL already runs custom domains through its own Cloudflare (you'll see `cdn-cgi` and `cloudflareinsights.com` requests). Putting your Cloudflare in front of theirs is "orange-to-orange" proxying, which only works when the SaaS provider allows it. If SSL errors or GHL marks the domain disconnected, switch the record back to DNS only and use the meta-tag option instead.
   - Add the domain to Cloudflare and copy **every** existing DNS record across before switching nameservers. Missing the GHL email records (SPF, DKIM, MX, tracking CNAMEs) breaks email.
   - Proxy (orange cloud) only the root and `www` records. Leave `webapi`, `dashboard`, email and tracking records on DNS only (grey cloud).
   - SSL/TLS mode: **Full**. Then check the site loads and that GHL's domain screen still shows the domain as connected. GHL validates and renews its certificate through the domain, so re-check it in a few days too.
   - Add the headers under **Rules > Transform Rules > Modify Response Header**, filtered to `http.host in {"meridianaisolutions.com.au" "www.meridianaisolutions.com.au"}`.
   - Check with `curl.exe -I https://meridianaisolutions.com.au` or securityheaders.com.

## Tier 1: safe, add now

| Header | Value | Why it's safe |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Only stops browsers guessing file types. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Already the browser default; this just makes it explicit. |
| `X-Frame-Options` | `SAMEORIGIN` | Stops other sites framing yours (clickjacking). Nothing frames the main site. The GHL editor previews on its own domain. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` | Nothing on the site uses these. Remove `microphone=()` if you switch on voice in the chat widget. |
| `Strict-Transport-Security` | `max-age=86400` | Forces HTTPS for one day, this host only. Raise it in tier 2 once a week goes by with no problems. |
| `Content-Security-Policy` | `object-src 'none'; base-uri 'self'; frame-ancestors 'self'; upgrade-insecure-requests` | The low-risk part of CSP. It restricts no scripts, styles or iframes, so the widget, forms, calendar and fonts keep working. |

## Tier 2: recommended, with breakage risk

**1. Full CSP, report-only first.** Add it as `Content-Security-Policy-Report-Only` and leave it a week. Browse every page, open the chat widget, submit a form, book a test appointment, then read the browser console (F12) for "Report Only" violations and add any blocked host. Switch the header name to `Content-Security-Policy` once the console is clean.

```
default-src 'self' https:;
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.leadconnectorhq.com https://*.msgsndr.com https://*.filesafe.space https://*.googleapis.com https://www.googletagmanager.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.leadconnectorhq.com;
font-src 'self' data: https://fonts.gstatic.com https://*.leadconnectorhq.com;
img-src 'self' data: blob: https:;
frame-src https://webapi.meridianaisolutions.com.au https://*.leadconnectorhq.com https://reputationhub.site https://maps.google.com https://www.google.com https://*.stripe.com;
connect-src 'self' https://webapi.meridianaisolutions.com.au https://*.leadconnectorhq.com https://*.msgsndr.com https://*.googleapis.com wss://*.leadconnectorhq.com https://*.firebaseio.com wss://*.firebaseio.com;
form-action 'self' https://webapi.meridianaisolutions.com.au https://*.leadconnectorhq.com;
object-src 'none'; base-uri 'self'; frame-ancestors 'self'; upgrade-insecure-requests
```

The GHL hosts above are a starting list, not a checked one. The console report decides. `'unsafe-inline'` and `'unsafe-eval'` have to stay because GHL's page builder renders inline scripts and the font loader uses an inline `onload`. That means CSP here mostly limits which domains can load, which is still worth having.

Risk: a missed host silently breaks the widget, a form or the calendar. Report-only mode means you see the break before visitors do.

**2. Stronger HSTS.** `max-age=31536000` after tier 1 has run cleanly for a week. Hold off on `includeSubDomains` and `preload`: they force HTTPS on every subdomain, including GHL email-tracking and any future CNAME, and preload takes months to undo.

**3. `Cross-Origin-Opener-Policy: same-origin-allow-popups`.** Small isolation gain. It could affect Stripe checkout or Google sign-in pop-ups, so test those.

## Don't add

- `Cross-Origin-Embedder-Policy`: blocks the form, map, review and calendar iframes.
- `X-XSS-Protection`: deprecated. Leave it off, or send `0`.
- Any of the above on `webapi.` or `dashboard.`.
