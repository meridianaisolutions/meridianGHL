// Fills {{ custom_values.key }} tags inside Custom Code blocks, which GHL leaves unrendered.
// GHL does render custom values in native Text elements, so each page carries one Text
// element holding {mx:key}value{/mx} pairs (dist/ghl/DATA-TEXT-ELEMENT.txt). This script reads
// those pairs, hides that element, and swaps the tags in place before first paint.
// Values only ever go in through textContent or validated attributes, never as HTML.
(function () {
  var TAG = /\{\{\s*custom_values\.(\w+)\s*\}\}/g, HAS = /\{\{\s*custom_values\./, data = null;
  function load() {
    if (data) return data;
    var w = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT), t;
    // Skip script and style text: this script's own source contains '{mx:'.
    while ((t = w.nextNode())) if (t.nodeValue.indexOf('{mx:') > -1 && !/^(SCRIPT|STYLE)$/.test(t.parentNode.nodeName)) break;
    if (!t) return null;
    var el = t.parentNode;
    // Climb to the outermost wrapper that holds nothing but the data, so the whole element hides.
    var PAIRS = /\{mx:(\w+)\}([\s\S]*?)\{\/mx\}/g;
    while (el.parentNode && el.parentNode !== document.body && !el.parentNode.textContent.replace(PAIRS, '').trim()) el = el.parentNode;
    data = {};
    el.textContent.replace(PAIRS, function (_, k, v) { data[k] = v.trim(); });
    // Worked out here so the client fills fewer values: 0400 123 456 -> +61400123456, and
    // '12 Example Street, Newstead QLD 4006' -> street, suburb, state and postcode.
    if (data.site_phone_display && !data.site_phone_link) data.site_phone_link = data.site_phone_display.replace(/[^\d+]/g, '').replace(/^0/, '+61');
    var ad = /^(.+),\s*(.+?)\s+([A-Za-z]{2,3})\s+(\d{4})$/.exec(data.site_address || '');
    if (data.site_address && !data.site_street_address) {
      data.site_street_address = ad ? ad[1] : data.site_address;
      data.site_suburb = ad ? ad[2] : '';
      data.site_state = ad ? ad[3].toUpperCase() : '';
      data.site_postcode = ad ? ad[4] : '';
    }
    el.style.display = 'none';
    el.setAttribute('aria-hidden', 'true');
    return data;
  }
  function sub(s, esc) {
    return s.replace(TAG, function (m, k) { var v = data[k]; return v == null ? '' : esc ? esc(v) : v; });
  }
  // Blocks javascript:, data: and other schemes; allows web, phone, email and relative links.
  function safeUrl(u) { return (!/^[a-z][\w+.-]*:/i.test(u) || /^(https?|tel|mailto):/i.test(u)) && !/[\s"'<>\\]/.test(u) ? u : '#'; }
  function safeCss(c) { return /^#[0-9a-f]{3,8}$|^[a-z]+$/i.test(c) ? c : 'inherit'; }
  function json(v) { return JSON.stringify(v).slice(1, -1); }
  // Long copy lives in native Text elements, which GHL renders and Google sees in the HTML.
  // Each starts with a {text:name} line. Only the plain text moves into the matching slot, as
  // fresh <p> elements, so GHL's own text styles don't follow it. The emptied Text element
  // (and its section, if nothing else is in it) is then hidden.
  var BLOCK = /^(P|DIV|H[1-6]|LI|BLOCKQUOTE)$/;
  function moveText(root) {
    [].forEach.call(root.querySelectorAll('[data-mx-text]'), function (slot) {
      if (slot.childNodes.length) return;
      var mark = '{text:' + slot.getAttribute('data-mx-text') + '}', w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), t;
      while ((t = w.nextNode())) if (t.nodeValue.indexOf(mark) > -1 && !/^(SCRIPT|STYLE)$/.test(t.parentNode.nodeName)) break;
      if (!t) return;
      t.nodeValue = t.nodeValue.replace(mark, '');
      var block = t.parentNode;
      while (!BLOCK.test(block.nodeName) && block.parentNode) block = block.parentNode;
      var box = block.parentNode, paras = [];
      // If the marker shares a container with our own blocks, only its own paragraph is the text.
      if (box.querySelector('.mx')) box = block;
      // Leaf blocks are the paragraphs; with none (plain <br> text) split the text on blank lines.
      [].forEach.call(box.querySelectorAll('p,div,h1,h2,h3,h4,h5,h6,li,blockquote'), function (e) {
        var txt = e.textContent.trim();
        if (txt && !e.querySelector('p,div,h1,h2,h3,h4,h5,h6,li,blockquote')) paras.push(txt);
      });
      if (!paras.length) paras = box.textContent.split(/\n\s*\n/).map(function (x) { return x.trim(); }).filter(Boolean);
      paras.forEach(function (txt) {
        var p = document.createElement('p');
        p.textContent = txt;
        slot.appendChild(p);
      });
      while (box.firstChild) box.removeChild(box.firstChild);
      var el = box;
      while (el.parentNode && el.parentNode !== document.body && !el.parentNode.textContent.trim() && !el.parentNode.querySelector('img,iframe,video')) el = el.parentNode;
      el.style.display = 'none';
    });
  }
  var loaded = {};
  function embed(js, e, src) {
    var go = function () { e.setAttribute('src', src); };
    if (loaded[js] === true) return go();
    if (loaded[js]) return loaded[js].push(go);
    loaded[js] = [go];
    var s = document.createElement('script');
    s.src = js;
    s.onload = s.onerror = function () { var q = loaded[js]; loaded[js] = true; q.forEach(function (f) { f(); }); };
    document.body.appendChild(s);
  }
  window.mxFill = function (root) {
    if (!load() || !root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), t, list = [];
    while ((t = w.nextNode())) if (HAS.test(t.nodeValue)) list.push(t);
    list.forEach(function (n) {
      var p = n.parentNode && n.parentNode.nodeName;
      if (p === 'STYLE') n.nodeValue = sub(n.nodeValue, safeCss);
      else if (p === 'SCRIPT') n.nodeValue = n.parentNode.type === 'application/ld+json' ? sub(n.nodeValue, json) : n.nodeValue;
      else n.nodeValue = sub(n.nodeValue);
    });
    var els = root.querySelectorAll('*');
    for (var i = 0; i < els.length; i++) {
      var e = els[i], a = e.attributes;
      for (var j = 0; j < a.length; j++) {
        if (a[j].value.indexOf('custom_values') < 0) continue;
        var name = a[j].name, val = sub(a[j].value);
        if (name === 'href' || name === 'data-mx-src') val = safeUrl(val);
        e.setAttribute(name, val);
        // Optional links (social profiles) are left blank to hide them.
        if (name === 'href' && !val) e.style.display = 'none';
      }
      var src = e.getAttribute('data-mx-src');
      if (src != null) {
        e.removeAttribute('data-mx-src');
        // An empty value would load the page itself as an image, so hide the element instead.
        if (!src || /\/$/.test(src)) { (e.parentNode.nodeName === 'FIGURE' ? e.parentNode : e).style.display = 'none'; continue; }
        // GHL embeds (form, review widget) need their helper script listening before the iframe
        // loads, or the form stays hidden and keeps its fixed height. So the src waits for it.
        var js = e.getAttribute('data-mx-js');
        if (!js) e.setAttribute('src', src);
        else embed(js, e, src);
      }
    }
    // A service or area with a blank slug drops out of every menu, list and card grid.
    [].forEach.call(root.querySelectorAll('[data-mx-opt]'), function (e) {
      var l = e.nodeName === 'A' ? e : e.querySelector('a'), v = l ? l.getAttribute('href') : e.textContent.trim();
      if (!v || v === '/') e.style.display = 'none';
    });
    moveText(root);
  };
  document.addEventListener('DOMContentLoaded', function () {
    mxFill(document.body);
    // Blocks sit in separate GHL sections, so CSS can't alternate them; plain sections go white, grey, white...
    var alt = 0;
    [].forEach.call(document.querySelectorAll('.mx .sec:not(.band):not(.dark):not(#main)'), function (s) {
      if (s.offsetParent) s.classList.toggle('soft', !!(alt++ % 2));
    });
    // Shared blocks link to #quote; on pages without the form, send those links to the booking URL.
    // The build types the URL in here unless it stays a custom value.
    var book = (data && data.site_booking_url) || '{{cv.site_booking_url}}';
    if (!document.getElementById('quote'))
      [].forEach.call(document.querySelectorAll('a[href="#quote"]'), function (a) { a.setAttribute('href', safeUrl(book)); });
  });
})();
