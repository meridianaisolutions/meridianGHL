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
  var loaded = {};
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
        e.setAttribute('src', src);
        // GHL embeds (form, review widget) need their helper script once the iframe is live.
        var js = e.getAttribute('data-mx-js');
        if (js && !loaded[js]) {
          loaded[js] = true;
          var s = document.createElement('script');
          s.src = js;
          s.defer = true;
          document.body.appendChild(s);
        }
      }
    }
    // A service or area with a blank slug drops out of every menu, list and card grid.
    [].forEach.call(root.querySelectorAll('[data-mx-opt]'), function (e) {
      var l = e.nodeName === 'A' ? e : e.querySelector('a'), v = l ? l.getAttribute('href') : e.textContent.trim();
      if (!v || v === '/') e.style.display = 'none';
    });
  };
  document.addEventListener('DOMContentLoaded', function () {
    mxFill(document.body);
    // Shared blocks link to #quote; on pages without the form, send those links to the booking URL.
    if (!document.getElementById('quote') && data && data.site_booking_url)
      [].forEach.call(document.querySelectorAll('a[href="#quote"]'), function (a) { a.setAttribute('href', safeUrl(data.site_booking_url)); });
  });
})();
