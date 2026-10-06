/* AUTOVEX shell — header + Garage Dock, mega panel, footer, bottom nav,
   Vehicle Selector Console (steps + VIN), Garage sheet, search palette,
   Fit Report dialog / print, delegated interactions, page boot. */
(function (AV) {
  'use strict';
  const h = AV.html, get = AV.get, D = AV.data, ui = AV.ui, $ = AV.$, $$ = AV.$$;

  /* ======================= Wordmark (SVG, custom geometric) ======================= */
  const GLYPHS = {
    A: 'M0 24 L20 0 L40 24 M9 15 H31',
    U: 'M0 0 V12 A12 12 0 0 0 12 24 H28 A12 12 0 0 0 40 12 V0',
    T: 'M0 0 H40 M20 0 V24',
    O: 'M12 0 H28 A12 12 0 0 1 28 24 H12 A12 12 0 0 1 12 0 Z',
    V: 'M0 0 L20 24 L40 0',
    E: 'M40 0 H0 V24 H40 M0 12 H30',
    X: 'M0 0 L40 24 M40 0 L0 24',
  };
  AV.logoSVG = () => {
    let x = 0, out = '';
    'AUTOVEX'.split('').forEach((c) => {
      out += `<path transform="translate(${x} 0)" d="${GLYPHS[c]}"/>`;
      if (c === 'V') out += `<path transform="translate(${x} 0)" d="M14.5 17.4 L20 24 L25.5 17.4" stroke="#C92A2A"/>`;
      x += 52;
    });
    return AV.raw(`<svg viewBox="-2 -2 358 28" role="img" aria-label="AUTOVEX" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linejoin="miter" stroke-linecap="butt">${out}</svg>`);
  };
  const logo = (href = 'index.html') => h`<a class="logo" href="${href}" aria-label="اتووکس — صفحه اصلی">${AV.logoSVG()}<span class="logo-fa">اتووکس</span></a>`;

  /* ======================= Header ======================= */
  const NAV = [
    { id: 'shop', fa: 'فروشگاه', href: 'shop.html' },
    { id: 'parts', fa: 'قطعات خودرو', href: 'categories.html', mega: true },
    { id: 'brands', fa: 'برندها', href: 'brands.html' },
    { id: 'vehicles', fa: 'خودروها', href: 'vehicles.html' },
    { id: 'guides', fa: 'راهنما', href: 'guides.html' },
  ];
  function dockHTML() {
    const sel = AV.garage.active();
    if (!sel) return h`<button type="button" class="btn btn-outline-red btn-sm dock-empty" data-open-garage>${AV.icon('car', { size: 'sm' })}انتخاب خودروی من</button>`;
    const x = AV.vehicleOf(sel);
    return h`<button type="button" class="dock" data-open-garage aria-label="خودروی من: ${AV.vehicleLabel(sel, { parts: 'short' })} — تغییر خودرو">
      ${AV.icon('car')}<span class="dock-text"><span class="dock-k">خودروی من</span><span class="dock-v"><bdi>${x.variant.name}</bdi> · ${AV.faDigits(x.year)}</span></span><span class="dock-change">تغییر</span></button>`;
  }
  function headerHTML(opts) {
    if (opts.minimal) {
      return h`<header class="site-header surface-dark minimal" data-header><div class="container header-row">
        ${logo()}<div class="header-tools"><span class="secure-note">${AV.icon('lock', { size: 'sm' })}پرداخت امن</span>
        <a class="link t-small" href="cart.html">بازگشت به سبد خرید</a></div></div></header>`;
    }
    const count = AV.cart.count();
    return h`<a class="skip-link" href="#main">پرش به محتوای اصلی</a>
    <header class="site-header surface-dark" data-header>
      <div class="container header-row">
        <button type="button" class="btn-icon menu-btn" data-open-menu aria-label="باز کردن منو">${AV.icon('menu', { size: 'lg' })}</button>
        ${logo()}
        <nav class="main-nav" aria-label="ناوبری اصلی"><ul class="list-reset">
          ${NAV.map((n) => n.mega
            ? h`<li><button type="button" class="nav-link" data-mega aria-expanded="false" aria-controls="mega">${n.fa}${AV.icon('chevron-down', { size: 'sm' })}</button></li>`
            : h`<li><a class="nav-link" href="${n.href}" ${opts.nav === n.id ? 'aria-current="page"' : ''}>${n.fa}</a></li>`)}
        </ul></nav>
        <div class="header-tools">
          <button type="button" class="search-trigger" data-open-search aria-label="جستجو (کلید /)">${AV.icon('search')}<span class="st-text">جستجوی قطعه، کد فنی یا خودرو</span><kbd>/</kbd></button>
          <div class="dock-wrap" data-dock>${dockHTML()}</div>
          <a class="btn-icon tool-account" href="account.html" aria-label="حساب کاربری">${AV.icon('user')}</a>
          <a class="btn-icon cart-btn" href="cart.html" aria-label="سبد خرید" data-cart-link>${AV.icon('cart')}<span class="count-badge" data-cart-count ${count ? '' : 'hidden'}>${AV.faDigits(count)}</span></a>
        </div>
      </div>
      <div class="mega surface-dark" id="mega" hidden>
        <div class="container mega-grid">
          ${D.categories.map((c) => h`<div class="mega-col">
            <a class="mega-head" href="${AV.url.category(c.id)}"><span class="mega-no">${AV.faDigits(String(c.no).padStart(2, '0'))}</span><span>${c.fa}</span></a>
            <ul class="list-reset">${D.partTypes.filter((t) => t.cat === c.id).map((t) => h`<li><a href="${AV.url.shop({ type: t.id })}">${t.fa}</a></li>`)}</ul>
          </div>`)}
          <div class="mega-foot"><a class="link-arrow" href="categories.html">همه سیستم‌های خودرو ${AV.icon('arrow', { dir: true, size: 'sm' })}</a>
          <span class="t-small t-meta">${AV.garage.active() ? `قطعات بر اساس ${AV.vehicleLabel(AV.garage.active(), { parts: 'short' })} علامت‌گذاری می‌شوند.` : 'برای دیدن قطعات سازگار، ابتدا خودروی خود را انتخاب کنید.'}</span></div>
        </div>
      </div>
    </header>
    ${opts.strip ? h`<div class="garage-strip" data-strip>${stripHTML()}</div>` : ''}`;
  }
  function stripHTML() {
    const sel = AV.garage.active();
    if (!sel) return h`<button type="button" class="strip-btn" data-open-garage>${AV.icon('car', { size: 'sm' })}<span>خودروی خود را انتخاب کنید تا سازگاری قطعات را ببینید</span>${AV.icon('chevron', { dir: true, size: 'sm' })}</button>`;
    return h`<button type="button" class="strip-btn" data-open-garage>${AV.icon('car', { size: 'sm' })}<span class="t-meta">خودروی من:</span><strong><bdi>${AV.vehicleLabel(sel, { parts: 'short' })}</bdi></strong><span class="strip-change">تغییر</span></button>`;
  }

  /* ======================= Footer & bottom nav ======================= */
  function footerHTML(opts) {
    if (opts.minimal) return h`<footer class="site-footer surface-dark minimal"><div class="container footer-bottom"><span>© ${AV.faDigits(1405)} اتووکس</span><span class="t-micro">AUTOVEX یک برند نمایشی است. محصولات، قیمت‌ها و برندها صرفاً برای نمونه‌کار هستند.</span></div></footer>`;
    const popular = D.models.filter((m) => m.popular).sort((a, b) => a.popular - b.popular);
    const arts = (AV.articles || []).slice(0, 6);
    return h`<footer class="site-footer surface-dark" aria-labelledby="footer-h">
      <h2 id="footer-h" class="sr-only">پانویس</h2>
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">${logo()}<p class="t-meta">قطعه درست، برای خودروی درست. فروشگاه قطعات خودرو با تطبیق دقیق بر اساس مدل، سال، موتور و تیپ.</p>
            <ul class="list-reset footer-trust">
              <li>${AV.icon('shield', { size: 'sm' })}اصالت کالا با شماره OEM</li>
              <li>${AV.icon('check', { size: 'sm' })}گزارش تطبیق برای هر قطعه</li>
              <li>${AV.icon('rotate', { size: 'sm' })}۷ روز بازگشت برای قطعه ناسازگار</li>
            </ul>
          </div>
          <nav class="footer-cols" aria-label="پیوندهای پانویس">
            <div><h3>سیستم‌های خودرو</h3><ul class="list-reset">${D.categories.map((c) => h`<li><a href="${AV.url.category(c.id)}">${c.fa}</a></li>`)}</ul></div>
            <div><h3>خودروهای پرطرفدار</h3><ul class="list-reset">${popular.map((m) => h`<li><a href="${AV.url.model(m.id)}">قطعات ${m.fa}</a></li>`)}<li><a href="vehicles.html">همه خودروها</a></li></ul></div>
            <div><h3>برندها</h3><ul class="list-reset">${D.brands.slice(0, 8).map((b) => h`<li><a href="${AV.url.brand(b.id)}"><bdi>${b.name}</bdi></a></li>`)}<li><a href="brands.html">همه برندها</a></li></ul></div>
            <div><h3>راهنمای خودرو</h3><ul class="list-reset">${arts.map((a) => h`<li><a href="${AV.url.article(a.slug)}">${AV.faRaw(a.title)}</a></li>`)}</ul></div>
            <div><h3>پشتیبانی</h3><ul class="list-reset">
              <li><a href="request.html">درخواست تأمین قطعه</a></li>
              <li><a href="account.html">حساب کاربری و سفارش‌ها</a></li>
              <li><a href="account.html#garage">خودروهای من</a></li>
              <li><a href="article.html?a=fit-check">بررسی سازگاری قبل از خرید</a></li>
              <li><a href="article.html?a=find-vin">پیدا کردن شماره شاسی</a></li>
              <li><span class="t-meta">پشتیبانی فنی: </span><bdi class="code">021-9100-4410</bdi></li>
            </ul></div>
          </nav>
        </div>
        <div class="footer-bottom">
          <span>© ${AV.faDigits(1405)} اتووکس · همه حقوق محفوظ است.</span>
          <span class="t-micro">AUTOVEX یک برند نمایشی است. محصولات، قیمت‌ها و برندها صرفاً برای نمونه‌کار هستند.</span>
        </div>
      </div>
    </footer>`;
  }
  function bottomNavHTML(opts) {
    const sel = AV.garage.active();
    const count = AV.cart.count();
    const cur = (id) => (opts.nav === id ? 'aria-current="page"' : '');
    return h`<nav class="bottom-nav surface-dark" aria-label="ناوبری پایین">
      <a href="index.html" ${cur('home')}>${AV.icon('home')}<span>خانه</span></a>
      <a href="shop.html" ${cur('shop')}>${AV.icon('grid')}<span>فروشگاه</span></a>
      <button type="button" data-open-search>${AV.icon('search')}<span>جستجو</span></button>
      <button type="button" data-open-garage class="bn-garage ${sel ? 'has-car' : ''}">${AV.icon('car')}<span>خودروی من</span><span class="bn-sub" data-bn-car>${sel ? AV.vehicleOf(sel).variant.name : 'انتخاب نشده'}</span></button>
      <a href="cart.html" ${cur('cart')} class="bn-cart">${AV.icon('cart')}<span>سبد</span><span class="count-badge" data-cart-count ${count ? '' : 'hidden'}>${AV.faDigits(count)}</span></a>
    </nav>`;
  }

  /* ======================= Mobile menu drawer ======================= */
  function openMenu() {
    let d = $('#menu-drawer');
    if (!d) {
      d = document.createElement('div');
      d.id = 'menu-drawer'; d.className = 'drawer surface-dark'; d.hidden = true;
      d.setAttribute('aria-label', 'منو');
      document.body.appendChild(d);
    }
    AV.render(d, h`<div class="panel-head">${logo()}<button type="button" class="btn-icon" data-close aria-label="بستن منو">${AV.icon('x')}</button></div>
      <div class="panel-body menu-body">
        <ul class="list-reset menu-list">${NAV.map((n) => h`<li><a href="${n.href}">${n.fa}${AV.icon('chevron', { dir: true, size: 'sm' })}</a></li>`)}
          <li><a href="request.html">درخواست تأمین قطعه${AV.icon('chevron', { dir: true, size: 'sm' })}</a></li>
          <li><a href="account.html">حساب کاربری${AV.icon('chevron', { dir: true, size: 'sm' })}</a></li></ul>
        <p class="menu-sub t-small t-meta">سیستم‌های خودرو</p>
        <ul class="list-reset menu-cats">${D.categories.map((c) => h`<li><a href="${AV.url.category(c.id)}"><span class="mega-no">${AV.faDigits(String(c.no).padStart(2, '0'))}</span>${c.fa}</a></li>`)}</ul>
      </div>`);
    d.querySelector('[data-close]').addEventListener('click', () => AV.layer.close(d));
    AV.layer.open(d);
  }

  /* ======================= Vehicle Selector Console ======================= */
  const VIN_DB = {
    WBA: { variant: 'bmw-330i-ms' }, WBS: { variant: 'bmw-m3c' }, WDD: { variant: 'c200' }, WAU: { variant: 'a4-40' },
    WVW: { variant: 'passat-18' }, WP1: { variant: 'cayenne-30' }, KMH: { variant: 'tucson-20' }, KNA: { variant: 'sportage-24' },
    JTD: { variant: 'corolla-18' }, JN1: { variant: 'xtrail-25' },
    NAA: { by4: { N: 'p206-t5', T: 'p206-t2', S: 'p206-sd', M: 'samand-ef7', D: 'dena-ef7', P: 'dena-plus-t', R: 'tara-mt' } },
    NAS: { by4: { Q: 'quick-mt', H: 'shahin-g' } },
    NAG: { by4: { J: 'kmc-j7', T: 'kmc-t8' } },
  };
  const MY = { L: 2020, M: 2021, N: 2022, P: 2023, R: 2024, S: 2025, T: 2026, K: 2019, J: 2018, H: 2017, G: 2016, F: 2015, E: 2014, D: 2013, C: 2012, B: 2011, A: 2010 };
  AV.SAMPLE_VIN = 'WBA5R1C05PF123456';
  AV.decodeVin = (raw) => {
    const vin = String(raw || '').toUpperCase().replace(/\s/g, '');
    if (vin.length !== 17) return { ok: false, msg: 'شماره شاسی باید دقیقاً ۱۷ کاراکتر باشد.' };
    if (/[IOQ]/.test(vin)) return { ok: false, msg: 'حروف I، O و Q در شماره شاسی استفاده نمی‌شوند؛ احتمالاً منظور ۱ یا ۰ است.' };
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return { ok: false, msg: 'فقط حروف لاتین و اعداد مجاز است.' };
    const rec = VIN_DB[vin.slice(0, 3)];
    if (!rec) return { ok: false, msg: 'این شماره شاسی در بانک اطلاعاتی نمونه پیدا نشد. از انتخاب مرحله‌ای استفاده کنید یا درخواست بررسی ثبت کنید.', unknown: true };
    const vid = rec.variant || (rec.by4 && rec.by4[vin[3]]) || Object.values(rec.by4)[0];
    const v = get.variant(vid);
    const greg = MY[vin[9]];
    let year = greg ? greg - 621 : v.to;
    year = Math.max(v.from, Math.min(v.to, year));
    return { ok: true, vin, variantId: vid, year };
  };

  AV.selector = { mount };
  function mount(root, opts = {}) {
    const mode = opts.mode || 'sheet';
    const st = {
      tab: opts.tab || 'steps', brand: null, model: null, year: null, eng: null, variant: null,
      active: 0, open: mode === 'sheet' ? 0 : null, filter: '', cursor: 0, vin: '', vinMsg: null, vinOk: null,
      saved: !!(opts.showSaved && AV.garage.active()), touched: false,
    };
    if (opts.step != null) { st.open = opts.step; }
    const id = AV.uid('sel');

    const yearsOf = (modelId) => {
      const set = new Set();
      get.variantsOf(modelId).forEach((v) => { for (let y = v.from; y <= v.to; y++) set.add(y); });
      return [...set].sort((a, b) => b - a);
    };
    const STEPS = [
      { key: 'brand', fa: 'برند', ph: 'جستجوی برند...', opts: () => D.vehicleBrands.map((b) => ({ value: b.id, label: b.fa, mark: b.en, group: b.origin === 'domestic' ? 'تولید داخل' : 'وارداتی', s: AV.normalize([b.fa, b.en, ...b.aliases].join(' ')) })), show: (v) => get.vbrand(v).fa },
      { key: 'model', fa: 'مدل', ph: 'جستجوی مدل...', opts: () => get.modelsOf(st.brand).sort((a, b) => (a.popular || 99) - (b.popular || 99)).map((m) => ({ value: m.id, label: m.fa, sub: `${AV.faDigits(get.variantsOf(m.id).length)} تیپ و موتور`, s: AV.normalize([m.fa, ...(m.aliases || [])].join(' ')) })), show: (v) => get.model(v).fa },
      { key: 'year', fa: 'سال', ph: 'مثلاً ۱۴۰۲', opts: () => { const imp = get.isImport(get.model(st.model)); return yearsOf(st.model).map((y) => ({ value: y, label: AV.faDigits(y), sub: imp ? String(y + 621) : '', s: `${y} ${y + 621}` })); }, show: (v) => AV.faDigits(v) },
      { key: 'eng', fa: 'موتور', ph: 'جستجوی موتور...', opts: () => {
        const vs = get.variantsOf(st.model).filter((v) => st.year >= v.from && st.year <= v.to);
        const map = new Map(); vs.forEach((v) => { if (!map.has(v.eng)) map.set(v.eng, []); map.get(v.eng).push(v); });
        return [...map.entries()].map(([eng, list]) => ({ value: eng, label: list[0].engLabel, sub: [...new Set(list.map((v) => v.name))].join('، '), s: AV.normalize(list[0].engLabel + ' ' + eng + ' ' + list.map((v) => v.name).join(' ')) }));
      }, show: (v) => { const x = get.variantsOf(st.model).find((q) => q.eng === v); return x ? x.engLabel : v; } },
      { key: 'variant', fa: 'تیپ', ph: 'جستجوی تیپ...', opts: () => get.variantsOf(st.model).filter((v) => v.eng === st.eng && st.year >= v.from && st.year <= v.to).map((v) => ({ value: v.id, label: v.trim, sub: v.name + (v.brakes ? ` · ${v.brakes}` : ''), s: AV.normalize(v.trim + ' ' + v.name) })), show: (v) => get.variant(v).trim },
    ];
    const enabled = (i) => i === 0 || st[STEPS[i - 1].key] != null;
    const firstEmpty = () => { const i = STEPS.findIndex((s) => st[s.key] == null); return i < 0 ? 4 : i; };
    const complete = () => st.variant != null;

    function select(i, value) {
      st.touched = true;
      st[STEPS[i].key] = value;
      for (let j = i + 1; j < STEPS.length; j++) st[STEPS[j].key] = null;
      for (let j = i + 1; j < STEPS.length; j++) { const o = STEPS[j].opts(); if (o.length === 1) st[STEPS[j].key] = o[0].value; else break; }
      st.filter = ''; st.cursor = 0;
      if (complete()) {
        const r = AV.garage.add(st.variant, st.year);
        if (!r.ok) { AV.toast('گاراژ شما پر است (حداکثر ۵ خودرو). یکی را از «خودروهای من» حذف کنید.', { icon: 'alert' }); return draw(); }
        st.saved = true; st.open = null;
        AV.announce(`خودروی شما ذخیره شد: ${AV.vehicleLabel(r.entry)}`);
        if (opts.onSave) opts.onSave(r.entry);
      } else {
        st.open = firstEmpty();
      }
      draw(true);
    }
    function loadSel(sel) {
      const v = get.variant(sel.variantId), m = get.model(v.model);
      Object.assign(st, { brand: m.brand, model: m.id, year: sel.year, eng: v.eng, variant: v.id });
    }
    if (opts.showSaved && AV.garage.active()) loadSel(AV.garage.active());

    function optionsHTML(i) {
      const step = STEPS[i];
      const f = AV.normalize(st.filter);
      const list = step.opts().filter((o) => !f || o.s.includes(f) || AV.normalize(o.label).includes(f));
      st._list = list;
      if (st.cursor >= list.length) st.cursor = Math.max(0, list.length - 1);
      let lastGroup = null;
      return h`<div class="options ${mode === 'bar' ? 'options-pop' : ''}" data-options>
        <div class="options-head">
          <label class="sr-only" for="${id}-f">${step.fa} — جستجو</label>
          <input id="${id}-f" class="input" type="text" autocomplete="off" placeholder="${step.ph}" value="${st.filter}"
            role="combobox" aria-expanded="true" aria-controls="${id}-lb" aria-activedescendant="${list.length ? `${id}-o${st.cursor}` : ''}" data-filter>
        </div>
        <div class="options-list" id="${id}-lb" role="listbox" aria-label="${step.fa}">
          ${list.length ? list.map((o, k) => {
            const g = o.group && o.group !== lastGroup ? h`<div class="opt-group" role="presentation">${o.group}</div>` : '';
            lastGroup = o.group || lastGroup;
            return h`${g}<button type="button" class="opt ${k === st.cursor ? 'is-cursor' : ''}" role="option" id="${id}-o${k}" aria-selected="${String(st[step.key] === o.value)}" data-pick="${i}" data-val="${o.value}" tabindex="-1">
              <span><span class="t-500">${o.label}</span>${o.sub ? h`<span class="opt-sub"> · ${o.sub}</span>` : ''}</span>${o.mark ? h`<span class="opt-wordmark">${o.mark}</span>` : ''}</button>`;
          }) : h`<p class="t-small t-meta" style="padding:12px">موردی پیدا نشد.</p>`}
        </div></div>`;
    }
    function stepBtn(i) {
      const s = STEPS[i], val = st[s.key], dis = !enabled(i);
      const isOpen = st.open === i;
      return h`<button type="button" class="step ${val != null ? 'is-done' : ''} ${isOpen ? 'is-active' : ''}" data-step="${i}" ${dis ? 'disabled' : ''} aria-expanded="${String(isOpen)}">
        <span class="step-no">${val != null ? AV.icon('check', { size: 'sm' }) : '0' + (i + 1)}</span>
        <span style="min-width:0"><span class="step-k">${AV.faDigits('0' + (i + 1))} · ${s.fa}</span><span class="step-val">${val != null ? s.show(val) : dis ? '—' : 'انتخاب کنید'}</span></span>
        ${AV.icon(isOpen ? 'chevron-down' : 'chevron', { size: 'sm', dir: !isOpen })}
      </button>`;
    }
    function vinHTML() {
      const n = st.vin.length;
      return h`<div class="vin stack" style="--stack:12px">
        <div class="field ${st.vinMsg && !st.vinOk ? 'has-error' : ''}">
          <label for="${id}-vin">شماره شاسی (VIN)</label>
          <div class="vin-row"><input id="${id}-vin" class="input" dir="ltr" inputmode="text" autocapitalize="characters" autocomplete="off" spellcheck="false" maxlength="17" placeholder="۱۷ کاراکتر، مثل WBA5R1C05PF123456" value="${st.vin}" aria-describedby="${id}-vinmsg ${id}-vincount" data-vin>
          <button type="button" class="btn btn-dark" data-vin-go ${n === 17 ? '' : 'disabled'}>رمزگشایی</button></div>
          <div class="between"><span id="${id}-vinmsg" class="${st.vinMsg && !st.vinOk ? 'error' : 'hint'}" aria-live="polite">${st.vinMsg || 'شماره شاسی همه مراحل را یک‌جا و با اطمینان بیشتر پر می‌کند.'}</span><span class="vin-count" id="${id}-vincount">${n}/17</span></div>
        </div>
        <button type="button" class="link t-small" data-vin-sample style="justify-self:start">استفاده از شماره شاسی نمونه</button>
        <details class="vin-help"><summary>${AV.icon('help', { size: 'sm' })}شماره شاسی را کجا پیدا کنم؟</summary>
          <ul class="t-small" style="padding-inline-start:20px;margin-block:6px 10px">
            <li>پشت کارت خودرو، ردیف «شماره شاسی» (VIN)</li><li>سند مالکیت یا برگ سبز خودرو</li>
            <li>پایین شیشه جلو، سمت راننده (از بیرون خودرو)</li><li>ستون در راننده، روی برچسب مشخصات</li></ul>
          <a class="link" href="article.html?a=find-vin">راهنمای کامل پیدا کردن شماره شاسی</a></details>
      </div>`;
    }
    function savedHTML() {
      const sel = AV.garage.active();
      return h`<div class="console-summary">
        <div class="stack" style="--stack:4px"><span class="t-small t-meta">${AV.icon('check', { size: 'sm', cls: 'ok-ico' })} خودروی من</span>${ui.vehicleLine(sel)}</div>
        <div class="cluster">
          ${mode === 'bar' ? h`<a class="btn btn-primary" href="shop.html">نمایش قطعات سازگار</a>` : ''}
          <button type="button" class="btn ${mode === 'bar' ? 'btn-outline' : 'btn-outline btn-sm'}" data-edit>${AV.icon('edit', { size: 'sm' })}ویرایش خودرو</button>
        </div></div>`;
    }
    function draw(focus) {
      const tabs = h`<div class="console-tabs" role="tablist" aria-label="روش انتخاب خودرو">
        <button type="button" class="tab" role="tab" aria-selected="${String(st.tab === 'steps')}" data-tab="steps">انتخاب مرحله‌ای</button>
        <button type="button" class="tab" role="tab" aria-selected="${String(st.tab === 'vin')}" data-tab="vin">شماره شاسی (VIN)</button></div>`;
      let body;
      if (st.saved) body = savedHTML();
      else if (st.tab === 'vin') body = vinHTML();
      else if (mode === 'bar') {
        body = h`<div class="bar-steps">${STEPS.map((_, i) => stepBtn(i))}
          <button type="button" class="btn btn-primary btn-lg bar-cta" disabled>نمایش قطعات سازگار</button></div>
          ${st.open != null ? optionsHTML(st.open) : ''}`;
      } else {
        const done = STEPS.filter((s) => st[s.key] != null).length;
        body = h`<div class="sel-progress"><span class="t-small t-meta">مرحله ${AV.faDigits(Math.min(done + 1, 5))} از ${AV.faDigits(5)}</span><span class="progress-line" aria-hidden="true"><span style="inline-size:${done * 20}%"></span></span></div>
          <div class="steps">${STEPS.map((_, i) => h`${stepBtn(i)}${st.open === i ? optionsHTML(i) : ''}`)}</div>`;
      }
      AV.render(root, h`<div class="console console-${mode}">
        ${mode === 'bar' ? h`<div class="console-head"><div><h2 class="console-title">خودروی خود را انتخاب کنید</h2><p class="t-small t-meta">قطعات سازگار با خودروی شما را پیدا کنید.</p></div>${st.saved ? '' : tabs}</div>
          <div class="bar-mobile"><button type="button" class="btn btn-primary btn-lg btn-block" data-open-garage>${AV.icon('car')}انتخاب خودرو</button>
          <button type="button" class="btn btn-outline btn-block" data-open-garage="vin">${AV.icon('scan', { size: 'sm' })}با شماره شاسی (VIN)</button></div>` : st.saved ? '' : tabs}
        <div class="console-body">${body}</div></div>`);
      if (focus) {
        const f = root.querySelector('[data-filter]') || root.querySelector('[data-vin]') || root.querySelector('[data-edit]');
        if (f && (st.touched || mode === 'sheet')) f.focus({ preventScroll: mode === 'bar' });
        const cur = root.querySelector('.opt.is-cursor'); if (cur) cur.scrollIntoView({ block: 'nearest' });
      }
      if (opts.onChange) opts.onChange(st);
    }

    root.addEventListener('click', (e) => {
      const t = e.target.closest('button, a'); if (!t || !root.contains(t)) return;
      if (t.dataset.tab) { st.tab = t.dataset.tab; st.touched = true; draw(true); }
      else if (t.dataset.step != null) { const i = +t.dataset.step; st.open = st.open === i && mode === 'bar' ? null : i; st.filter = ''; st.cursor = 0; st.touched = true; draw(true); }
      else if (t.dataset.pick != null) { const i = +t.dataset.pick; const raw = t.dataset.val; select(i, STEPS[i].key === 'year' ? Number(raw) : raw); }
      else if (t.hasAttribute('data-edit')) { st.saved = false; st.open = mode === 'sheet' ? 4 : null; st.touched = true; draw(true); }
      else if (t.hasAttribute('data-vin-sample')) { st.vin = AV.SAMPLE_VIN; st.vinMsg = null; draw(true); }
      else if (t.hasAttribute('data-vin-go')) runVin();
    });
    function runVin() {
      const r = AV.decodeVin(st.vin);
      st.vinOk = r.ok; st.vinMsg = r.ok ? null : r.msg;
      if (!r.ok) return draw(true);
      loadSel(r);
      const add = AV.garage.add(r.variantId, r.year);
      if (!add.ok) { AV.toast('گاراژ شما پر است (حداکثر ۵ خودرو).', { icon: 'alert' }); return; }
      st.saved = true; st.touched = true;
      AV.announce(`شماره شاسی تأیید شد: ${AV.vehicleLabel(add.entry)}`);
      if (opts.onSave) opts.onSave(add.entry);
      draw(true);
    }
    root.addEventListener('input', (e) => {
      if (e.target.matches('[data-filter]')) {
        st.filter = e.target.value; st.cursor = 0;
        const pos = e.target.selectionStart; draw(true);
        const f = root.querySelector('[data-filter]'); if (f) { f.setSelectionRange(pos, pos); }
      } else if (e.target.matches('[data-vin]')) {
        const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        st.vin = v; st.vinMsg = /[IOQ]/.test(v) ? 'حروف I، O و Q در شماره شاسی استفاده نمی‌شوند.' : null; st.vinOk = null;
        const pos = e.target.selectionStart; draw(true);
        const f = root.querySelector('[data-vin]'); if (f) f.setSelectionRange(pos, pos);
      }
    });
    root.addEventListener('keydown', (e) => {
      if (e.target.matches('[data-filter]')) {
        const n = (st._list || []).length;
        if (e.key === 'ArrowDown') { e.preventDefault(); st.cursor = (st.cursor + 1) % Math.max(n, 1); draw(true); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); st.cursor = (st.cursor - 1 + n) % Math.max(n, 1); draw(true); }
        else if (e.key === 'Enter' && n) { e.preventDefault(); const o = st._list[st.cursor]; select(st.open, o.value); }
        else if (e.key === 'Escape' && mode === 'bar') { e.stopPropagation(); const i = st.open; st.open = null; draw(); const b = root.querySelector(`[data-step="${i}"]`); if (b) b.focus(); }
      } else if (e.target.matches('[data-vin]') && e.key === 'Enter') { e.preventDefault(); if (st.vin.length === 17) runVin(); }
    });
    if (mode === 'bar') {
      document.addEventListener('click', (e) => { if (st.open != null && !root.contains(e.target)) { st.open = null; draw(); } });
    }
    AV.on('garage', () => {
      if (!document.contains(root)) return;
      const a = AV.garage.active();
      if (mode === 'bar') { if (a) { loadSel(a); st.saved = true; } else { st.saved = false; } draw(); }
    });
    draw(false);
    return { state: st, draw, reset() { Object.assign(st, { brand: null, model: null, year: null, eng: null, variant: null, saved: false, open: 0, filter: '' }); draw(true); } };
  }

  /* ======================= Garage sheet ======================= */
  let gSheet;
  AV.openGarage = (o = {}) => {
    if (!gSheet) {
      gSheet = document.createElement('div');
      gSheet.className = 'sheet full as-dialog-md surface-light garage-sheet';
      gSheet.hidden = true;
      gSheet.setAttribute('aria-labelledby', 'g-title');
      document.body.appendChild(gSheet);
    }
    const list = AV.garage.list();
    let view = o.add || !list.length ? 'add' : 'list';
    const ctaLabel = o.ctaLabel || 'نمایش قطعات سازگار';
    function cta(enabled) {
      return o.onDone
        ? h`<button type="button" class="btn btn-primary btn-lg btn-block" data-g-done ${enabled ? '' : 'disabled'}>${ctaLabel}</button>`
        : enabled ? h`<a class="btn btn-primary btn-lg btn-block" href="shop.html">${ctaLabel}</a>` : h`<button type="button" class="btn btn-primary btn-lg btn-block" disabled>${ctaLabel}</button>`;
    }
    function drawSheet() {
      const items = AV.garage.list(), act = AV.garage.active();
      AV.render(gSheet, h`<div class="sheet-grip" aria-hidden="true"></div>
        <div class="panel-head"><div><h2 id="g-title">${view === 'list' ? 'خودروهای من' : 'خودروی خود را انتخاب کنید'}</h2>
          <p class="t-small t-meta">${view === 'list' ? `${AV.faDigits(items.length)} از ${AV.faDigits(5)} خودرو · خودروی فعال، سازگاری همه قطعات را تعیین می‌کند.` : 'قطعات سازگار با خودروی شما را پیدا کنید.'}</p></div>
          <button type="button" class="btn-icon" data-g-close aria-label="بستن">${AV.icon('x')}</button></div>
        <div class="panel-body">
          ${view === 'list' ? h`<ul class="list-reset garage-list" role="list">${items.map((e) => h`<li class="g-item ${act && act.id === e.id ? 'is-active' : ''}">
              <button type="button" class="g-pick" data-g-set="${e.id}" aria-pressed="${String(!!(act && act.id === e.id))}">
                <span class="g-radio" aria-hidden="true"></span>
                <span class="stack" style="--stack:2px">${ui.vehicleLine(e)}${e.nick ? h`<span class="t-small t-meta">${e.nick}</span>` : ''}</span></button>
              <button type="button" class="btn-icon" data-g-del="${e.id}" aria-label="حذف ${AV.vehicleLabel(e, { parts: 'short' })}">${AV.icon('trash', { size: 'sm' })}</button></li>`)}</ul>
            ${items.length < 5 ? h`<button type="button" class="btn btn-outline btn-block" data-g-add style="margin-block-start:16px">${AV.icon('plus')}افزودن خودروی دیگر</button>` : h`<p class="t-small t-meta" style="margin-block-start:12px">گاراژ پر است؛ برای افزودن خودروی جدید یکی را حذف کنید.</p>`}`
            : h`<div data-g-console></div>${items.length ? h`<button type="button" class="link t-small" data-g-back style="margin-block-start:16px">بازگشت به خودروهای من</button>` : ''}`}
        </div>
        <div class="panel-foot" data-g-foot>${cta(view === 'list' ? !!act : false)}</div>`);
      if (view === 'add') {
        AV.selector.mount(gSheet.querySelector('[data-g-console]'), {
          mode: 'sheet', tab: o.tab === 'vin' ? 'vin' : 'steps',
          onSave: () => { AV.render(gSheet.querySelector('[data-g-foot]'), cta(true)); const b = gSheet.querySelector('[data-g-foot] .btn'); if (b) setTimeout(() => b.focus(), 30); },
        });
        o.tab = null;
      }
    }
    gSheet.onclick = (e) => {
      const t = e.target.closest('button, a'); if (!t) return;
      if (t.hasAttribute('data-g-close')) AV.layer.close(gSheet);
      else if (t.dataset.gSet) { AV.garage.setActive(t.dataset.gSet); drawSheet(); AV.toast(`خودروی فعال: ${AV.vehicleLabel(AV.garage.active(), { parts: 'short' })}`); }
      else if (t.dataset.gDel) { AV.garage.remove(t.dataset.gDel); if (!AV.garage.list().length) view = 'add'; drawSheet(); }
      else if (t.hasAttribute('data-g-add')) { view = 'add'; drawSheet(); }
      else if (t.hasAttribute('data-g-back')) { view = 'list'; drawSheet(); }
      else if (t.hasAttribute('data-g-done')) { AV.layer.close(gSheet); if (o.onDone) o.onDone(); }
    };
    drawSheet();
    AV.layer.open(gSheet, { focus: view === 'add' ? '[data-filter], [data-vin]' : '.g-item.is-active .g-pick' });
  };

  /* ======================= Search palette ======================= */
  let pal, palState = { q: '', cursor: 0, items: [] };
  const SUGGEST = ['لنت BMW 330i', 'فیلتر روغن سمند', 'BP-47291', 'لنت جلو ۲۰۶', 'برمبو', '34116888123'];
  AV.openSearch = (initial = '') => {
    if (!pal) {
      pal = document.createElement('div');
      pal.className = 'dialog palette surface-light';
      pal.hidden = true;
      pal.setAttribute('aria-label', 'جستجو');
      AV.render(pal, h`<div class="palette-input">${AV.icon('search')}
          <label for="pal-q" class="sr-only">جستجو</label>
          <input id="pal-q" type="search" autocomplete="off" spellcheck="false" placeholder="نام قطعه، کد فنی یا مدل خودرو را جستجو کنید..." role="combobox" aria-expanded="true" aria-controls="pal-lb" aria-autocomplete="list">
          <button type="button" class="btn btn-ghost btn-sm" data-pal-close>بستن</button></div>
        <div class="palette-results" id="pal-lb" role="listbox" aria-label="نتایج جستجو"></div>
        <div class="palette-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> حرکت</span><span><kbd>Enter</kbd> باز کردن</span><span><kbd>Esc</kbd> بستن</span><span style="margin-inline-start:auto" data-pal-car></span></div>`);
      document.body.appendChild(pal);
      const inp = pal.querySelector('#pal-q');
      inp.addEventListener('input', () => { palState.q = inp.value; palState.cursor = 0; drawPal(); });
      inp.addEventListener('keydown', (e) => {
        const n = palState.items.length;
        if (e.key === 'ArrowDown') { e.preventDefault(); palState.cursor = (palState.cursor + 1) % Math.max(n, 1); markCursor(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); palState.cursor = (palState.cursor - 1 + n) % Math.max(n, 1); markCursor(); }
        else if (e.key === 'Enter') {
          e.preventDefault();
          const it = palState.items[palState.cursor];
          if (it) { if (it.dataset.q) { inp.value = it.dataset.q; palState.q = it.dataset.q; drawPal(); return; } AV.searches.push(palState.q); location.href = it.getAttribute('href'); }
          else if (palState.q.trim()) { AV.searches.push(palState.q); location.href = AV.url.search(palState.q.trim()); }
        }
      });
      pal.addEventListener('click', (e) => {
        const t = e.target.closest('[data-pal-close], [data-q], [data-clear-recent], a');
        if (!t) return;
        if (t.hasAttribute('data-pal-close')) AV.layer.close(pal);
        else if (t.hasAttribute('data-clear-recent')) { AV.searches.clear(); drawPal(); }
        else if (t.dataset.q) { e.preventDefault(); inp.value = t.dataset.q; palState.q = t.dataset.q; drawPal(); inp.focus(); }
        else if (t.tagName === 'A' && palState.q.trim()) AV.searches.push(palState.q);
      });
    }
    const inp = pal.querySelector('#pal-q');
    inp.value = initial; palState.q = initial; palState.cursor = 0;
    const sel = AV.garage.active();
    AV.render(pal.querySelector('[data-pal-car]'), sel ? h`سازگاری بر اساس <bdi>${AV.vehicleLabel(sel, { parts: 'short' })}</bdi>` : 'خودرویی انتخاب نشده');
    drawPal();
    AV.layer.open(pal, { focus: '#pal-q' });
  };
  function markCursor() {
    palState.items.forEach((el, i) => el.setAttribute('aria-selected', String(i === palState.cursor)));
    const cur = palState.items[palState.cursor];
    const inp = pal.querySelector('#pal-q');
    if (cur) { inp.setAttribute('aria-activedescendant', cur.id); cur.scrollIntoView({ block: 'nearest' }); } else inp.removeAttribute('aria-activedescendant');
  }
  function drawPal() {
    const box = pal.querySelector('.palette-results');
    const q = palState.q.trim();
    const sel = AV.garage.active();
    let k = 0;
    const opt = (href, inner, extra = '') => h`<a class="p-item" role="option" id="pal-o${k++}" href="${href}" ${AV.raw(extra)}>${inner}</a>`;
    if (!q) {
      const rec = AV.searches.list();
      AV.render(box, h`
        ${rec.length ? h`<div role="group" aria-label="جستجوهای اخیر"><div class="p-group-title"><span>جستجوهای اخیر</span><button type="button" class="link t-micro" data-clear-recent>پاک کردن</button></div>
          ${rec.map((r) => opt(AV.url.search(r), h`<span class="media" style="background:transparent">${AV.icon('clock')}</span><span class="p-item-title">${r}</span>`, `data-q="${AV.esc(r)}"`))}</div>` : ''}
        <div role="group" aria-label="پیشنهادها"><div class="p-group-title"><span>نمونه جستجو</span></div>
          ${SUGGEST.map((s) => opt(AV.url.search(s), h`<span class="media" style="background:transparent">${AV.icon('search')}</span><span class="p-item-title">${s}</span>`, `data-q="${AV.esc(s)}"`))}</div>`);
    } else {
      const t0 = performance.now();
      const r = AV.search(q);
      const ms = Math.round(performance.now() - t0);
      const prods = r.products.slice(0, 6);
      if (!prods.length && !r.models.length && !r.brands.length && !r.guides.length) {
        AV.render(box, h`<div class="empty" style="margin:16px 8px"><div class="art">${AV.art('empty')}</div>
          <p>نتیجه‌ای پیدا نشد. کد فنی یا مشخصات خودرو را برایمان بفرستید.</p>
          <a class="btn btn-primary btn-sm" href="request.html?q=${encodeURIComponent(q)}">درخواست تأمین قطعه</a></div>`);
      } else {
        AV.render(box, h`
          ${prods.length ? h`<div role="group" aria-label="قطعات"><div class="p-group-title"><span>قطعات${sel ? ' · مرتب‌شده برای خودروی شما' : ''}</span><span>${AV.faDigits(r.products.length)} نتیجه · ${AV.faDigits(ms)} میلی‌ثانیه</span></div>
            ${prods.map(({ p, code }) => opt(AV.url.product(p), h`${ui.media(p.type, { light: true })}
              <span style="min-width:0"><span class="p-item-title">${AV.faRaw(p.title)}</span>
              <span class="p-item-sub"><span class="wordmark" style="font-size:.6875rem">${get.brand(p.brand).name}</span><bdi class="code">${p.sku}</bdi>${code && code.kind !== 'کد کالا' ? h`<span>${code.kind}: <bdi class="code">${code.label}</bdi></span>` : ''}${AV.priceHTML(p.price)}</span></span>
              ${ui.sealStatic(AV.fitFor(p).state)}`))}</div>` : ''}
          ${r.models.length ? h`<div role="group" aria-label="خودروها"><div class="p-group-title"><span>خودروها</span></div>
            ${r.models.map((m) => opt(AV.url.model(m.id), h`<span class="media">${AV.icon('car')}</span><span class="p-item-title">قطعات ${m.fa}<span class="p-item-sub">${AV.faDigits(get.variantsOf(m.id).length)} تیپ و موتور · ${get.vbrand(m.brand).fa}</span></span>`))}</div>` : ''}
          ${r.brands.length ? h`<div role="group" aria-label="برندها"><div class="p-group-title"><span>برندها</span></div>
            ${r.brands.map((b) => opt(AV.url.brand(b.id), h`<span class="media" style="background:transparent"><span class="wordmark" style="font-size:.5rem">${b.name.slice(0, 4)}</span></span><span class="p-item-title"><bdi>${b.name}</bdi> · ${b.fa}<span class="p-item-sub">${AV.faDigits(get.productsByBrand(b.id).length)} قطعه</span></span>`))}</div>` : ''}
          ${r.guides.length ? h`<div role="group" aria-label="راهنما"><div class="p-group-title"><span>راهنما</span></div>
            ${r.guides.map((a) => opt(AV.url.article(a.slug), h`<span class="media" style="background:transparent">${AV.icon('book')}</span><span class="p-item-title">${AV.faRaw(a.title)}<span class="p-item-sub">${AV.faDigits(a.minutes)} دقیقه مطالعه</span></span>`))}</div>` : ''}
          ${opt(AV.url.search(q), h`<span class="media" style="background:transparent">${AV.icon('arrow', { dir: true })}</span><span class="p-item-title">مشاهده همه نتایج برای «${q}»</span>`)}`);
      }
    }
    palState.items = $$('[role="option"]', box);
    markCursor();
  }

  /* ======================= Fit Report dialog / print / share ======================= */
  let frDlg;
  AV.openFitReport = (sku) => {
    const p = get.product(sku); if (!p) return;
    if (!frDlg) { frDlg = document.createElement('div'); frDlg.className = 'dialog surface-light fr-dialog'; frDlg.hidden = true; frDlg.setAttribute('aria-labelledby', 'fr-title'); document.body.appendChild(frDlg); }
    const sel = AV.garage.active();
    AV.render(frDlg, h`<div class="panel-head"><div><h2 id="fr-title">گزارش تطبیق</h2><p class="t-small t-meta"><span class="wordmark" style="font-size:.6875rem">${get.brand(p.brand).name}</span> · ${AV.faRaw(p.title)} · <bdi class="code">${p.sku}</bdi></p></div>
      <button type="button" class="btn-icon" data-fr-close aria-label="بستن">${AV.icon('x')}</button></div>
      <div class="panel-body stack">${ui.fitReport(p, sel)}
        <div class="cluster"><a class="link t-small" href="${AV.url.product(p)}#compat">فهرست کامل خودروهای سازگار</a><button type="button" class="link t-small" data-open-garage>تغییر خودرو</button></div></div>`);
    frDlg.querySelector('[data-fr-close]').onclick = () => AV.layer.close(frDlg);
    AV.layer.open(frDlg);
  };
  AV.printReport = (sku, orderId) => {
    let root = $('#print-root');
    if (!root) { root = document.createElement('div'); root.id = 'print-root'; document.body.appendChild(root); }
    const sel = AV.garage.active();
    const now = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full', timeStyle: 'short' }).format(new Date());
    let content;
    if (orderId) {
      const o = AV.orders.get(orderId);
      const osel = o && o.vehicle ? o.vehicle : sel;
      content = h`<p>سفارش <bdi class="code">${orderId}</bdi> · خودرو: <bdi>${osel ? AV.vehicleLabel(osel) : '—'}</bdi></p>${(o ? o.lines : []).map((l) => { const p = get.product(l.sku); return h`<h3 style="margin-block:18px 8px">${get.brand(p.brand).name} — ${AV.faRaw(p.title)} <bdi class="code">${p.sku}</bdi> × ${AV.faDigits(l.qty)}</h3>${ui.fitReport(p, osel, { actions: false })}`; })}`;
    } else {
      const p = get.product(sku);
      content = h`<h3 style="margin-block:12px 4px">${get.brand(p.brand).name} — ${AV.faRaw(p.title)}</h3><p>کد کالا: <bdi class="code">${p.sku}</bdi> · کد سازنده: <bdi class="code">${p.mpn}</bdi> · قیمت: ${AV.price(p.price)}</p>${ui.fitReport(p, sel, { actions: false })}`;
    }
    AV.render(root, h`<div class="print-head">${AV.logoSVG()}<div><strong>گزارش تطبیق اتووکس</strong><div>${now}</div></div></div>${content}
      <p class="print-foot">این گزارش بر اساس مشخصات واردشده خودرو تهیه شده است. AUTOVEX یک برند نمایشی است؛ محصولات و قیمت‌ها صرفاً برای نمونه‌کار هستند.</p>`);
    document.body.classList.add('printing-report');
    const done = () => { document.body.classList.remove('printing-report'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
    setTimeout(done, 1500);
  };
  AV.share = async (sku) => {
    const p = get.product(sku);
    const url = new URL(AV.url.product(p), location.href).href;
    const title = `${get.brand(p.brand).name} ${AV.fa(p.title)} — گزارش تطبیق اتووکس`;
    if (navigator.share) { try { await navigator.share({ title, url }); return; } catch (e) { if (e.name === 'AbortError') return; } }
    await AV.copy(url);
    AV.toast('پیوند گزارش کپی شد');
  };

  /* ======================= Delegated interactions ======================= */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-copy], [data-seal], [data-add], [data-add-kit], [data-open-garage], [data-open-search], [data-print-report], [data-share], [data-open-menu], [data-mega], [data-qty]');
    if (!t) return;
    if (t.dataset.copy) { e.preventDefault(); AV.copy(t.dataset.copy, t); }
    else if (t.dataset.seal) {
      e.preventDefault();
      if (t.dataset.state === 'no-vehicle') AV.openGarage({ returnFocus: t });
      else AV.openFitReport(t.dataset.seal);
    }
    else if (t.dataset.add) {
      const p = get.product(t.dataset.add);
      if (AV.cart.add(p.sku, Number(t.dataset.qtyAdd || 1))) {
        const st = AV.fitFor(p).state;
        AV.toast(st === 'no-fit' ? `${get.type(p.type).fa} به سبد اضافه شد — با خودروی فعال شما سازگار نیست.` : `${get.type(p.type).fa} ${get.brand(p.brand).name} به سبد اضافه شد`, { href: 'cart.html', action: 'مشاهده سبد', icon: st === 'no-fit' ? 'alert' : 'check' });
      }
    }
    else if (t.dataset.addKit) { AV.cart.addMany(t.dataset.addKit.split(',')); AV.toast('کیت به سبد خرید اضافه شد', { href: 'cart.html', action: 'مشاهده سبد' }); }
    else if (t.hasAttribute('data-open-garage')) { e.preventDefault(); if (AV.layer.top() && AV.layer.top() !== gSheet) AV.layer.close(AV.layer.top()); AV.openGarage({ tab: t.dataset.openGarage || null }); }
    else if (t.hasAttribute('data-open-search')) { e.preventDefault(); AV.openSearch(''); }
    else if (t.dataset.printReport) AV.printReport(t.dataset.printReport);
    else if (t.dataset.share) AV.share(t.dataset.share);
    else if (t.hasAttribute('data-open-menu')) openMenu();
    else if (t.hasAttribute('data-mega')) toggleMega(t);
    else if (t.dataset.qty && t.closest('[data-cart-line]')) {
      const sku = t.dataset.qty; AV.cart.set(sku, AV.cart.qtyOf(sku) + Number(t.dataset.delta));
    }
  });
  function toggleMega(btn, force) {
    const m = $('#mega'); if (!m) return;
    const open = force != null ? force : btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    m.hidden = !open;
    if (open) { const f = m.querySelector('a'); if (f && force == null) f.focus({ preventScroll: true }); }
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !AV.layer.top() && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) { e.preventDefault(); AV.openSearch(''); }
    if (e.key === 'Escape') { const b = $('[data-mega][aria-expanded="true"]'); if (b) { toggleMega(b, false); b.focus(); } }
  });
  document.addEventListener('click', (e) => {
    const b = $('[data-mega][aria-expanded="true"]');
    if (b && !e.target.closest('#mega') && !e.target.closest('[data-mega]')) toggleMega(b, false);
  });

  /* ======================= Live updates ======================= */
  AV.on('garage', () => {
    const dock = $('[data-dock]'); if (dock) AV.render(dock, dockHTML());
    const strip = $('[data-strip]'); if (strip) AV.render(strip, stripHTML());
    const bn = $('.bn-garage'); const sel = AV.garage.active();
    if (bn) { bn.classList.toggle('has-car', !!sel); AV.roll(bn.querySelector('[data-bn-car]'), sel ? AV.vehicleOf(sel).variant.name : 'انتخاب نشده'); }
    ui.refreshSeals();
  });
  AV.on('cart', () => {
    const n = AV.cart.count();
    $$('[data-cart-count]').forEach((el) => { el.hidden = !n; AV.roll(el, AV.faDigits(n)); });
    AV.announce(`سبد خرید: ${AV.faDigits(n)} قلم`);
  });
  window.addEventListener('storage', (e) => {
    if (e.key === AV.storage.key('garage')) AV.emit('garage');
    if (e.key === AV.storage.key('cart')) AV.emit('cart');
  });

  /* ======================= Page boot ======================= */
  AV.page = (opts, init) => {
    const main = $('#main');
    main.setAttribute('tabindex', '-1');
    const head = document.createElement('div');
    head.innerHTML = String(headerHTML(opts));
    main.before(...head.childNodes);
    const foot = document.createElement('div');
    foot.innerHTML = String(footerHTML(opts)) + (opts.minimal ? '' : String(bottomNavHTML(opts)));
    main.after(...foot.childNodes);
    if (!opts.minimal) document.body.classList.add('has-bottom-nav');
    const header = $('[data-header]');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    try { if (init) init(); } catch (err) { console.error(err); AV.render(main, h`<div class="container section">${ui.empty({ title: 'خطایی رخ داد', text: 'نمایش این صفحه با مشکل روبه‌رو شد. صفحه را دوباره بارگذاری کنید.' })}</div>`); }
    AV.reveal();
  };
})(window.AV);
