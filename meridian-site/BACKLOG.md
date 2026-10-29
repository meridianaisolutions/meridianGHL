# Meridian site backlog

## Get page copy into the raw HTML for AI search

The home page's headings and body copy live in one GHL Custom Code block,
which GHL draws with JavaScript. An SEO check on 29 Oct 2026 found only 6% of
the page text in the HTML GHL serves (24 words). Google renders JavaScript and
reads the full page, but AI crawlers such as ChatGPT and Perplexity mostly
don't, so they miss the copy.

`home-contact/home-head-schema.html` covers part of the gap. It gives crawlers
the business details, services, prices and FAQ in the page header.

To do:
- Rebuild the home page sections as native GHL Headline and Text elements,
  styled to match the current design. Start with the hero, then the FAQ.
- Check the result on mobile and against the live design.
- Re-run the SEO extension and confirm the share of text in raw HTML goes up.
- Then repeat for the other pages (about, services, contact).

Estimate: about half a day for the home page.
