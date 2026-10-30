// Renders the review post backgrounds from the site's hero gradient. Run: node render.js
const { chromium } = require('playwright');
const page = (w, h) => `<body style="margin:0"><div style="width:${w}px;height:${h}px;position:relative;
background:radial-gradient(${w*0.9}px ${h*0.55}px at 92% -8%,rgba(46,155,99,.45),transparent 62%),
radial-gradient(${w*0.7}px ${h*0.4}px at 0% 108%,rgba(255,216,74,.14),transparent 60%),
linear-gradient(180deg,#12312a,#0f2a24)">
<div style="position:absolute;top:${h*0.1}px;width:100%;text-align:center;color:#ffd84a;font:${w*0.06}px sans-serif;letter-spacing:${w*0.012}px">★★★★★</div>
<div style="position:absolute;inset:${h*0.2}px ${w*0.08}px ${h*0.12}px;border-radius:28px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12)"></div>
</div></body>`;
(async () => {
  const b = await chromium.launch();
  for (const [w, h] of [[1080, 1080], [1080, 1350]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.setContent(page(w, h));
    await p.screenshot({ path: `${__dirname}/meridian-review-${w}x${h}.png` });
  }
  await b.close();
})();
