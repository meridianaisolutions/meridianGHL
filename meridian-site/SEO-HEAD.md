# Page head tags (meridianaisolutions.com.au)

GHL doesn't output a canonical tag or `twitter:card`, so add them per page in
**Page > Settings > Tracking code > Header**. Use the page's own URL, never the
site-wide header, or every page would point its canonical at the home page.

```html
<link rel="canonical" href="https://meridianaisolutions.com.au/PATH">
<meta name="twitter:card" content="summary_large_image">
<meta property="og:image" content="IMAGE_URL">
```

| Page | `href` |
| --- | --- |
| Home | `https://meridianaisolutions.com.au/` |
| About | `https://meridianaisolutions.com.au/about` |
| Contact | `https://meridianaisolutions.com.au/contact` |
| Book a call | `https://meridianaisolutions.com.au/book-a-call` |
| Google reviews | `https://meridianaisolutions.com.au/google-reviews` |
| Google Business Profile | `https://meridianaisolutions.com.au/google-business-profile` |
| Websites | `https://meridianaisolutions.com.au/websites` |
| Local growth system | `https://meridianaisolutions.com.au/local-growth-system` |
| Privacy policy | `https://meridianaisolutions.com.au/privacy-policy` |

`IMAGE_URL`: a 1200 x 630 JPG or PNG uploaded to GHL Media. GHL page settings
have no social image field, so the tag goes in the header code above. X falls
back to `og:image` when there is no `twitter:image`.
