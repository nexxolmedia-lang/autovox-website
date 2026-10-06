/* AUTOVEX core — namespace, Persian/RTL helpers, templating, storage, bus,
   dialogs (focus-trapped), toasts, live announcements, reveal-on-scroll.
   Classic script (no modules) so pages also work when opened from disk. */
(function (root) {
  'use strict';
  const AV = root.AV = root.AV || {};
  document.documentElement.classList.remove('no-js');

  /* ---------------- Templating (auto-escaped) ---------------- */
  class Raw { constructor(s) { this.s = s; } toString() { return this.s; } }
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);
  function val(v) {
    if (v == null || v === false || v === true) return '';
    if (v instanceof Raw) return v.s;
    if (Array.isArray(v)) return v.map(val).join('');
    return esc(v);
  }
  AV.html = (strings, ...vals) => {
    let out = '';
    strings.forEach((s, i) => { out += s; if (i < vals.length) out += val(vals[i]); });
    return new Raw(out);
  };
  AV.raw = (s) => new Raw(String(s));
  AV.esc = esc;
  AV.render = (el, tpl) => { if (el) el.innerHTML = String(tpl); return el; };
  AV.$ = (sel, ctx = document) => ctx.querySelector(sel);
  AV.$$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  AV.param = (k) => new URLSearchParams(location.search).get(k);
  AV.uid = (p = 'av') => p + '-' + Math.random().toString(36).slice(2, 9);

  /* ---------------- Digits, numbers, prices, years ---------------- */
  const FA = '۰۱۲۳۴۵۶۷۸۹';
  AV.faDigits = (s) => String(s).replace(/[0-9]/g, (d) => FA[d]);
  AV.latinDigits = (s) => String(s)
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06F0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
  const nf = new Intl.NumberFormat('fa-IR');
  AV.num = (n) => nf.format(n).replace(/,/g, '٬');
  AV.price = (n) => AV.num(n) + ' تومان';
  AV.priceHTML = (n, cls = '') => AV.html`<span class="price ${cls}">${AV.num(n)}<span class="cur"> تومان</span></span>`;
  /* Jalali year; imports show Gregorian in small secondary text */
  AV.year = (y, greg = false) => greg ? `${AV.faDigits(y)} · ${y + 621}` : AV.faDigits(y);
  AV.yearHTML = (y, greg = false) => greg
    ? AV.html`${AV.faDigits(y)}<span class="t-meta t-small ltr"> · ${y + 621}</span>`
    : AV.html`${AV.faDigits(y)}`;
  AV.range = (a, b) => `${AV.faDigits(a)}–${AV.faDigits(b)}`;

  /* Converts pure number tokens in Persian prose to Persian digits.
     Tokens containing Latin letters (5W-30, 330i, R90) stay Latin.
     `backticks` mark codes -> LTR mono islands (HTML mode only). */
  function faToken(t) {
    if (/[A-Za-z]/.test(t)) return t;
    return t.replace(/(\d),(?=\d{3})/g, '$1٬').replace(/(\d)\.(?=\d)/g, '$1٫').replace(/[0-9]/g, (d) => FA[d]);
  }
  AV.fa = (s) => String(s).replace(/`([^`]*)`/g, '$1')
    .replace(/[A-Za-z0-9][A-Za-z0-9\-\/.,+×]*/g, (t) => {
      const trail = /[.,]$/.test(t) ? t.slice(-1) : '';
      const core = trail ? t.slice(0, -1) : t;
      return faToken(core) + trail;
    });
  AV.faHTML = (s) => String(s).split(/(`[^`]*`)/g).map((part) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
      return `<bdi class="code">${esc(part.slice(1, -1))}</bdi>`;
    }
    return AV.fa(part).split(/([A-Za-z][A-Za-z0-9\-\/.+]*(?: [A-Za-z0-9][A-Za-z0-9\-\/.+]*)*)/g)
      .map((seg, i) => (i % 2 ? `<bdi>${esc(seg)}</bdi>` : esc(seg))).join('');
  }).join('');
  AV.faRaw = (s) => AV.raw(AV.faHTML(s));

  /* ---------------- Persian-aware normalization ---------------- */
  AV.normalize = (s) => AV.latinDigits(String(s || ''))
    .replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/[ۀة]/g, 'ه')
    .replace(/[أإآٱ]/g, 'ا').replace(/ؤ/g, 'و').replace(/ئ/g, 'ی')
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[‌‍]/g, ' ').replace(/[‎‏‪-‮]/g, '')
    .toLowerCase()
    .replace(/[«»"'،؛,:;!؟?()\[\]]/g, ' ')
    .replace(/\s+/g, ' ').trim();
  AV.compact = (s) => AV.normalize(s).replace(/[\s\-_./]/g, '');

  /* ---------------- Storage (versioned keys, failure-safe) ---------------- */
  const K = (k) => `autovex:${k}:v1`;
  AV.storage = {
    get(k, fb) { try { const v = localStorage.getItem(K(k)); return v == null ? fb : JSON.parse(v); } catch (e) { return fb; } },
    set(k, v) { try { localStorage.setItem(K(k), JSON.stringify(v)); } catch (e) { /* private mode */ } },
    del(k) { try { localStorage.removeItem(K(k)); } catch (e) { /* noop */ } },
    key: K,
  };

  /* ---------------- Event bus ---------------- */
  const bus = new EventTarget();
  AV.on = (type, fn) => bus.addEventListener(type, (e) => fn(e.detail));
  AV.emit = (type, detail) => bus.dispatchEvent(new CustomEvent(type, { detail }));

  /* ---------------- Icons (Lucide-style, 1.5 stroke) ---------------- */
  const P = {
    search: '<circle cx="11" cy="11" r="7.5"/><path d="m20.5 20.5-4.2-4.2"/>',
    cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    user: '<circle cx="12" cy="8" r="4.5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    alert: '<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    help: '<circle cx="12" cy="12" r="9.5"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="9.5"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',          /* "forward" in LTR; mirrored with .i-dir */
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', /* mirrored with .i-dir */
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    copy: '<rect width="13" height="13" x="9" y="9" rx="1.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    print: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4"/><path d="m15.4 6.5-6.8 4"/>',
    menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h10"/>',
    filter: '<path d="M21 4h-7"/><path d="M10 4H3"/><path d="M21 12h-9"/><path d="M8 12H3"/><path d="M21 20h-5"/><path d="M12 20H3"/><path d="M14 2v4"/><path d="M8 10v4"/><path d="M16 18v4"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.6a1 1 0 0 0-.2-.6l-3.5-4.4A1 1 0 0 0 17.5 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
    headset: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    star: '<path d="M11.5 2.3a.5.5 0 0 1 .9 0l2.3 4.7a2 2 0 0 0 1.6 1.1l5.2.8a.5.5 0 0 1 .3.9l-3.8 3.6a2 2 0 0 0-.6 1.9l.9 5.1a.5.5 0 0 1-.8.6l-4.6-2.4a2 2 0 0 0-2 0l-4.6 2.4a.5.5 0 0 1-.8-.6l.9-5.1a2 2 0 0 0-.6-1.9L1.8 9.8a.5.5 0 0 1 .3-.9l5.2-.8a2 2 0 0 0 1.6-1.1z"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h6"/><path d="M9 13h6"/><path d="M9 17h6"/>',
    pin: '<path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    package: '<path d="M11 21.7a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7z"/><path d="M12 22V12"/><path d="m3.3 7 8.7 5 8.7-5"/>',
    clock: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3 2"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.8 9.8 0 0 0-6.7 2.7L3 8"/><path d="M3 3v5h5"/>',
    edit: '<path d="M21.2 6.8a2.8 2.8 0 0 0-4-4L3.8 16.2a2 2 0 0 0-.5.8l-1.3 4.4a.5.5 0 0 0 .6.6l4.4-1.3a2 2 0 0 0 .8-.5z"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    layers: '<path d="m12.8 2.2a2 2 0 0 0-1.7 0L2.6 6.1a1 1 0 0 0 0 1.8l8.6 3.9a2 2 0 0 0 1.7 0l8.6-3.9a1 1 0 0 0 0-1.8z"/><path d="m2 12 9.2 4.2a2 2 0 0 0 1.7 0L22 12"/><path d="m2 17 9.2 4.2a2 2 0 0 0 1.7 0L22 17"/>',
    gauge: '<path d="m12 14 4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/>',
    lock: '<rect width="16" height="11" x="4" y="11" rx="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    tag: '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z"/><circle cx="7.5" cy="7.5" r="1"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    garage: '<path d="M2 20V8.5L12 3l10 5.5V20"/><path d="M6 20v-8h12v8"/><path d="M6 16h12"/>',
    dot: '<circle cx="12" cy="12" r="3"/>',
  };
  AV.icon = (name, opts = {}) => {
    const cls = ['i', opts.size ? 'i-' + opts.size : '', opts.dir ? 'i-dir' : '', opts.cls || ''].join(' ').trim();
    const label = opts.label ? `role="img" aria-label="${esc(opts.label)}"` : 'aria-hidden="true" focusable="false"';
    return AV.raw(`<svg class="${cls}" viewBox="0 0 24 24" ${label}>${P[name] || ''}</svg>`);
  };

  /* ---------------- Live announcements ---------------- */
  let live;
  AV.announce = (msg) => {
    if (!live) {
      live = document.createElement('div');
      live.className = 'sr-only';
      live.setAttribute('aria-live', 'polite');
      live.setAttribute('role', 'status');
      document.body.appendChild(live);
    }
    live.textContent = '';
    setTimeout(() => { live.textContent = msg; }, 40);
  };

  /* ---------------- Toasts ---------------- */
  AV.toast = (msg, opts = {}) => {
    let host = AV.$('.toasts');
    if (!host) { host = document.createElement('div'); host.className = 'toasts'; document.body.appendChild(host); }
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = String(AV.html`${AV.icon(opts.icon || 'check')}<span>${msg}</span>${opts.href ? AV.html`<a href="${opts.href}">${opts.action}</a>` : ''}`);
    host.appendChild(t);
    AV.announce(msg);
    setTimeout(() => { t.classList.add('is-out'); setTimeout(() => t.remove(), 260); }, opts.ms || 3600);
  };

  /* ---------------- Clipboard ---------------- */
  AV.copy = async (text, btn) => {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      ta.remove();
    }
    if (btn) {
      const old = btn.querySelector('.pn-copied'); if (old) old.remove();
      const tip = document.createElement('span');
      tip.className = 'pn-copied'; tip.textContent = ok ? 'کپی شد' : 'کپی نشد';
      btn.appendChild(tip);
      setTimeout(() => tip.remove(), 1400);
    }
    AV.announce(ok ? `کد ${text} کپی شد` : 'کپی انجام نشد');
    return ok;
  };

  /* ---------------- Layers: dialog / sheet / drawer with focus trap ---------------- */
  const stack = [];
  let overlay;
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function ensureOverlay() {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.addEventListener('click', () => { const top = stack[stack.length - 1]; if (top) AV.layer.close(top.el); });
      document.body.appendChild(overlay);
    }
    return overlay;
  }
  AV.layer = {
    open(el, opts = {}) {
      if (stack.some((s) => s.el === el)) return;
      const ov = ensureOverlay();
      const ret = opts.returnFocus || document.activeElement;
      el.hidden = false;
      el.setAttribute('role', el.getAttribute('role') || 'dialog');
      el.setAttribute('aria-modal', 'true');
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      ov.hidden = false;
      ov.style.zIndex = String(89 + stack.length * 20);
      el.style.zIndex = String(100 + stack.length * 20);
      stack.push({ el, ret, onClose: opts.onClose });
      document.body.classList.add('is-locked');
      requestAnimationFrame(() => {
        ov.classList.add('is-open');
        el.classList.add('is-open');
        const target = (opts.focus && el.querySelector(opts.focus)) || el.querySelector('[autofocus]') || el.querySelector(FOCUSABLE) || el;
        target.focus({ preventScroll: true });
      });
    },
    close(el) {
      const i = stack.findIndex((s) => s.el === el);
      if (i < 0) return;
      const [entry] = stack.splice(i, 1);
      el.classList.remove('is-open');
      if (!stack.length) {
        overlay.classList.remove('is-open');
        document.body.classList.remove('is-locked');
        setTimeout(() => { if (!stack.length) overlay.hidden = true; }, 260);
      } else {
        overlay.style.zIndex = String(89 + (stack.length - 1) * 20);
      }
      setTimeout(() => { if (!el.classList.contains('is-open')) el.hidden = true; }, 480);
      if (entry.onClose) entry.onClose();
      if (entry.ret && entry.ret.focus && document.contains(entry.ret)) entry.ret.focus({ preventScroll: true });
    },
    top() { return stack.length ? stack[stack.length - 1].el : null; },
    isOpen(el) { return stack.some((s) => s.el === el); },
  };
  document.addEventListener('keydown', (e) => {
    const top = stack[stack.length - 1];
    if (!top) return;
    if (e.key === 'Escape') { e.preventDefault(); AV.layer.close(top.el); return; }
    if (e.key === 'Tab') {
      const f = AV.$$(FOCUSABLE, top.el).filter((n) => n.offsetParent !== null || n === document.activeElement);
      if (!f.length) { e.preventDefault(); return; }
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------------- Motion helpers ---------------- */
  AV.reducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let io;
  AV.reveal = (ctx = document) => {
    const els = AV.$$('.reveal:not(.is-in), .wipe:not(.is-in)', ctx);
    if (!('IntersectionObserver' in window) || AV.reducedMotion()) { els.forEach((el) => el.classList.add('is-in')); return; }
    if (!io) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    }
    els.forEach((el) => io.observe(el));
  };
  /* Short digit roll for changing numbers */
  AV.roll = (el, text) => {
    if (!el) return;
    if (el.textContent === text) return;
    el.textContent = text;
    if (AV.reducedMotion() || !el.animate) return;
    el.animate([{ transform: 'translateY(45%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 220, easing: 'cubic-bezier(0.2,0,0,1)' });
  };

  /* ---------------- SEO helpers ---------------- */
  AV.SITE = 'https://autovex.example';
  AV.seo = ({ title, description, canonical, type = 'website', jsonld = [] }) => {
    if (title) document.title = title.includes('اتووکس') ? title : `${title} | اتووکس AUTOVEX`;
    const setMeta = (attr, key, content) => {
      if (content == null) return;
      let m = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!m) { m = document.createElement('meta'); m.setAttribute(attr, key); document.head.appendChild(m); }
      m.setAttribute('content', content);
    };
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', document.title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:locale', 'fa_IR');
    setMeta('property', 'og:site_name', 'AUTOVEX اتووکس');
    if (canonical) {
      let l = document.head.querySelector('link[rel="canonical"]');
      if (!l) { l = document.createElement('link'); l.rel = 'canonical'; document.head.appendChild(l); }
      l.href = AV.SITE + '/' + canonical.replace(/^\//, '');
      setMeta('property', 'og:url', l.href);
    }
    AV.$$('script[data-ld="page"]').forEach((s) => s.remove());
    jsonld.filter(Boolean).forEach((obj) => {
      const s = document.createElement('script');
      s.type = 'application/ld+json'; s.dataset.ld = 'page';
      s.textContent = JSON.stringify(obj);
      document.head.appendChild(s);
    });
  };
})(window);
