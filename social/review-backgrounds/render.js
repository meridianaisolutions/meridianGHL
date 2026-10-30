// Renders the review post backgrounds from the site's hero gradient. Run: node render.js
const { chromium } = require('playwright');
const page = (w, h) => `<body style="margin:0"><div style="width:${w}px;height:${h}px;position:relative;
background:radial-gradient(${w*1.1}px ${h*0.8}px at 100% 0%,rgba(46,155,99,.9),transparent 65%),
radial-gradient(${w*0.8}px ${h*0.55}px at 0% 100%,rgba(255,216,74,.28),transparent 60%),
linear-gradient(135deg,#17603c,#12312a 55%,#0c231e)">
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
