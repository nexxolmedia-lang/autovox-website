/* AUTOVEX UI components — return template HTML (AV.html). Interactions are
   wired once by delegated listeners in shell.js via data-* attributes. */
(function (AV) {
  'use strict';
  const h = AV.html, get = AV.get;
  const ui = AV.ui = {};

  const SEAL_ICON = { fits: 'check', 'no-fit': 'x', verify: 'alert', 'no-vehicle': 'car' };

  /* ---------- FIT Seal (single source for compatibility UI) ---------- */
  ui.seal = (p, opts = {}) => {
    const fit = opts.fit || AV.fitFor(p);
    const st = fit.state;
    const label = opts.label || AV.FIT_COPY[st];
    const size = opts.size === 'lg' ? 'seal-lg' : '';
    const desc = st === 'no-vehicle' ? 'باز کردن انتخاب خودرو' : 'مشاهده گزارش تطبیق';
    return h`<button type="button" class="seal seal-${st} ${size}" data-seal="${p.sku}" data-state="${st}" ${opts.lg ? 'data-size="lg"' : ''} aria-label="${label} — ${desc}">${AV.icon(SEAL_ICON[st], { cls: 'seal-ico' })}<span>${label}</span></button>`;
  };
  /* Static (non-interactive) seal for examples and print */
  ui.sealStatic = (st, label) => h`<span class="seal seal-${st}">${AV.icon(SEAL_ICON[st], { cls: 'seal-ico' })}<span>${label || AV.FIT_COPY[st]}</span></span>`;

  /* Re-render every seal on the page after the active vehicle changes */
  ui.refreshSeals = (ctx = document) => {
    AV.$$('[data-seal]', ctx).forEach((el) => {
      const p = get.product(el.dataset.seal); if (!p) return;
      const prev = el.dataset.state;
      const tmp = document.createElement('div');
      tmp.innerHTML = String(ui.seal(p, { size: el.classList.contains('seal-lg') ? 'lg' : '' }));
      const fresh = tmp.firstElementChild;
      el.replaceWith(fresh);
      if (prev !== fresh.dataset.state) { fresh.classList.add('is-stamping'); setTimeout(() => fresh.classList.remove('is-stamping'), 260); }
    });
  };

  /* ---------- Part Number Chip ---------- */
  ui.pn = (code, opts = {}) => h`<button type="button" class="pn ${opts.size === 'sm' ? 'pn-sm' : ''}" data-copy="${code}" aria-label="${opts.label ? opts.label + ' ' : ''}${code} — کپی">${opts.label ? h`<span class="pn-label">${opts.label}</span>` : ''}${code}${AV.icon('copy')}</button>`;

  /* ---------- Media (designed placeholder: frame + line drawing + caption) ---------- */
  ui.media = (artKey, opts = {}) => h`<div class="media ${opts.light ? 'light' : ''} ${opts.ratio || 'ratio-1'} ${opts.ticked ? 'ticked ticked-inset' : ''} ${opts.cls || ''}" ${opts.alt ? h`role="img" aria-label="${opts.alt}"` : ''}><div class="art">${AV.art(artKey, opts.artOpts)}</div>${opts.caption ? h`<span class="media-caption">${opts.caption}</span>` : ''}</div>`;
  ui.altFor = (p) => `${get.type(p.type).fa} ${get.brand(p.brand).fa}${AV.POS[p.pos] ? ' برای ' + AV.POS[p.pos] : ''} — طرح فنی`;

  /* ---------- Stock / price / rating / origin ---------- */
  ui.stock = (p) => {
    if (p.stock <= 0) return h`<span class="stock stock-out">ناموجود</span>`;
    if (p.stock <= 5) return h`<span class="stock stock-low">کم‌موجود · ${AV.faDigits(p.stock)} عدد</span>`;
    return h`<span class="stock">موجود</span>`;
  };
  ui.rating = (p) => {
    const full = Math.round(p.rating);
    return h`<span class="rating"><span class="stars" aria-hidden="true">${[1, 2, 3, 4, 5].map((i) => AV.icon('star', { cls: i <= full ? 'on' : '' }))}</span><span>${AV.faDigits(p.rating.toFixed(1)).replace('.', '٫')} از ${AV.faDigits(5)} · ${AV.num(p.reviews)} نظر</span></span>`;
  };
  ui.origin = (p) => p.origin === 'oem' ? h`<span class="badge">کیفیت قطعه اصلی <span class="ltr">(OE)</span></span>` : h`<span class="badge">افترمارکت</span>`;
  ui.brandMark = (p, cls = '') => h`<span class="wordmark ${cls}">${get.brand(p.brand).name}</span>`;

  /* ---------- Product card ---------- */
  ui.card = (p, opts = {}) => {
    const t = get.type(p.type);
    const flag = p.stock > 0 && p.stock <= 5 ? h`<span class="badge badge-red p-card-flag">کم‌موجود</span>` : p.isNew ? h`<span class="badge p-card-flag" style="background:var(--white)">جدید</span>` : '';
    return h`<article class="p-card ${opts.cls || ''}">
      ${flag}
      ${ui.media(t.id, { light: true, ratio: 'ratio-1', alt: ui.altFor(p) })}
      <div class="p-card-body">
        ${ui.brandMark(p, 'p-card-brand')}
        <h3 class="p-card-title"><a href="${AV.url.product(p)}">${AV.faRaw(p.title)}</a></h3>
        <div>${ui.pn(p.sku, { size: 'sm' })}</div>
        <div>${ui.seal(p)}</div>
        <div class="p-card-foot">
          <div class="p-card-row">${AV.priceHTML(p.price)}${ui.stock(p)}</div>
          ${p.stock > 0
            ? h`<button type="button" class="btn btn-dark btn-sm p-card-add" data-add="${p.sku}">${AV.icon('plus', { size: 'sm' })}افزودن به سبد</button>`
            : h`<a class="btn btn-outline btn-sm p-card-add" href="${AV.url.request()}?sku=${p.sku}">درخواست تأمین</a>`}
        </div>
      </div>
    </article>`;
  };

  /* ---------- Spec Table ---------- */
  ui.specTable = (p) => h`${Object.entries(p.specs).map(([group, rows]) => h`
    <div class="spec-group"><h4>${group}</h4>
      <table class="spec"><tbody>${rows.map(([k, v]) => h`<tr><th scope="row">${AV.faRaw(k)}</th><td>${/^`[^`]+`$/.test(v) && /\d/.test(v) && !/\s·\s/.test(v) ? ui.pn(v.slice(1, -1), { size: 'sm' }) : AV.faRaw(v)}</td></tr>`)}</tbody></table>
    </div>`)}
    <div class="spec-group"><h4>سازگاری و گارانتی</h4>
      <table class="spec"><tbody>
        <tr><th scope="row">نوع قطعه</th><td>${get.type(p.type).fa}</td></tr>
        <tr><th scope="row">کد سازنده</th><td>${ui.pn(p.mpn, { size: 'sm' })}</td></tr>
        ${p.oem.length ? h`<tr><th scope="row">شماره OEM</th><td><div class="cluster" style="--gap:6px">${p.oem.map((o) => ui.pn(o, { size: 'sm' }))}</div></td></tr>` : ''}
        <tr><th scope="row">اصالت</th><td>${p.origin === 'oem' ? 'کیفیت قطعه اصلی (OE)' : 'افترمارکت با استاندارد اروپایی'}</td></tr>
        <tr><th scope="row">گارانتی</th><td>${p.warranty ? AV.faDigits(p.warranty) + ' ماه' : 'مصرفی؛ بدون گارانتی'}</td></tr>
      </tbody></table>
    </div>`;

  /* ---------- Fit Report ---------- */
  const MARK = { true: 'check', false: 'x', null: 'help' };
  ui.fitReport = (p, sel, opts = {}) => {
    const fit = AV.resolveFit(p, sel);
    if (fit.state === 'no-vehicle') {
      return h`<div class="fit-report"><div class="verdict">${ui.sealStatic('no-vehicle')}</div>
        <div style="padding:18px" class="stack"><p class="t-meta">برای دیدن گزارش تطبیق، خودروی خود را انتخاب کنید.</p>
        <button type="button" class="btn btn-outline-red btn-sm" data-open-garage>انتخاب خودروی من</button></div></div>`;
    }
    const verdict = {
      fits: 'این قطعه با خودروی شما سازگار است.',
      verify: `سازگاری به یک مشخصه بستگی دارد: ${fit.attr}.`,
      'no-fit': 'این قطعه با خودروی شما سازگار نیست.',
    }[fit.state];
    const alts = fit.state === 'no-fit' ? AV.alternatives(p, sel, 3) : [];
    const today = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(new Date());
    return h`<section class="fit-report" aria-label="گزارش تطبیق">
      <div class="fit-report-head"><strong>گزارش تطبیق</strong><span class="latin-label">AUTOVEX FIT · ${p.sku}</span></div>
      <div class="verdict">${ui.sealStatic(fit.state, fit.state === 'fits' ? 'مناسب خودروی شما' : null)}<span>${verdict}</span></div>
      <dl class="fit-rows">${fit.reasons.map((r) => h`<div class="fit-row ${r.ok === true ? 'ok' : r.ok === false ? 'bad' : r.ok === null ? 'unk' : ''}">
        <dt>${r.k}</dt><dd>${r.code ? h`<bdi class="code">${r.v}</bdi>` : r.v}</dd>
        <span class="mark">${r.ok === undefined ? '' : AV.icon(MARK[String(r.ok)], { label: r.ok ? 'تطبیق' : r.ok === false ? 'مغایرت' : 'نامشخص' })}</span></div>`)}
      </dl>
      ${fit.note ? h`<div style="padding:0 18px 14px" class="t-small t-meta">${fit.note}</div>` : ''}
      ${fit.state === 'verify' ? h`<div style="padding:0 18px 16px" class="stack" style="--stack:10px"><p class="t-small t-meta">کارشناس فنی با بررسی ${fit.attr} سازگاری را قطعی می‌کند. معمولاً کمتر از دو ساعت کاری پاسخ می‌دهیم.</p>
        <a class="btn btn-outline btn-sm" href="${AV.url.request()}?sku=${p.sku}&ask=1">${AV.icon('headset', { size: 'sm' })}پرسش از پشتیبان فنی</a></div>` : ''}
      ${alts.length ? h`<div style="padding:4px 18px 16px"><p class="t-small t-500" style="margin-block-end:8px">جایگزین‌های سازگار با خودروی شما</p>
        <ul class="list-reset">${alts.map((a) => h`<li class="between" style="padding-block:8px;border-block-start:1px solid var(--line)"><a class="link" href="${AV.url.product(a)}">${get.brand(a.brand).name} — ${AV.faRaw(a.title)}</a>${AV.priceHTML(a.price)}</li>`)}</ul></div>` : ''}
      ${opts.actions === false ? '' : h`<div class="fit-report-foot no-print">
        <button type="button" class="btn btn-ghost btn-sm" data-print-report="${p.sku}">${AV.icon('print', { size: 'sm' })}چاپ / ذخیره PDF</button>
        <button type="button" class="btn btn-ghost btn-sm" data-share="${p.sku}">${AV.icon('share', { size: 'sm' })}اشتراک‌گذاری</button>
        <span class="t-micro t-meta" style="margin-inline-start:auto;align-self:center">تاریخ گزارش: ${today}</span></div>`}
    </section>`;
  };

  /* ---------- Replace-Together Kit ---------- */
  ui.kit = (p) => {
    if (!p.kit || !p.kit.length) return '';
    const items = [p, ...p.kit.map(get.product).filter(Boolean)];
    const total = items.reduce((s, x) => s + x.price, 0);
    const sel = AV.garage.active();
    return h`<section class="kit" aria-labelledby="kit-h">
      <div class="between"><h3 id="kit-h" class="t-h3" style="font-size:1.25rem">معمولاً هم‌زمان تعویض می‌شود</h3><span class="latin-label t-meta">KIT · ${AV.faDigits(items.length)}</span></div>
      <p class="t-small t-meta">تعویض هم‌زمان این قطعات از سایش نامتوازن جلوگیری می‌کند و هزینه اجرت را یک‌بار می‌پردازید.</p>
      <div class="kit-items">${items.map((x, i) => h`<div class="kit-item">
        <span class="kit-plus">${i ? '+' : ''}</span>
        ${ui.media(x.type, { light: true })}
        <div><a class="title" href="${AV.url.product(x)}">${AV.faRaw(x.title)}</a>
          <div class="cluster" style="--gap:8px;margin-block-start:4px">${ui.brandMark(x, 't-meta')}${ui.pn(x.sku, { size: 'sm' })}${sel ? ui.seal(x) : ''}</div></div>
        ${AV.priceHTML(x.price)}</div>`)}
      </div>
      <div class="kit-total"><div><span class="t-small t-meta">مجموع کیت</span><div>${AV.priceHTML(total, 'price-lg')}</div></div>
        <button type="button" class="btn btn-primary" data-add-kit="${items.map((x) => x.sku).join(',')}">${AV.icon('plus')}افزودن کیت به سبد</button></div>
    </section>`;
  };

  /* ---------- Quantity stepper ---------- */
  ui.qty = (sku, qty, max, opts = {}) => h`<div class="qty ${opts.sm ? 'qty-sm' : ''}" role="group" aria-label="تعداد">
    <button type="button" data-qty="${sku}" data-delta="1" aria-label="افزایش تعداد" ${qty >= max ? 'disabled' : ''}>${AV.icon('plus', { size: 'sm' })}</button>
    <output aria-live="polite" data-qty-out="${sku}">${AV.faDigits(qty)}</output>
    <button type="button" data-qty="${sku}" data-delta="-1" aria-label="کاهش تعداد" ${qty <= 1 ? 'disabled' : ''}>${AV.icon('minus', { size: 'sm' })}</button>
  </div>`;

  /* ---------- Breadcrumbs (+ JSON-LD) ---------- */
  ui.crumbs = (items) => h`<nav class="crumbs" aria-label="مسیر صفحه"><ol>${items.map((it, i) => i === items.length - 1
    ? h`<li><span aria-current="page">${it.name}</span></li>`
    : h`<li><a href="${it.href}">${it.name}</a></li>`)}</ol></nav>`;
  ui.crumbsLD = (items) => ({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: AV.SITE + '/' + (it.href || location.pathname.split('/').pop() + location.search) })),
  });

  /* ---------- Empty state ---------- */
  ui.empty = ({ title, text, art = 'empty', actions = '' }) => h`<div class="empty"><div class="art">${AV.art(art)}</div><h3>${title}</h3>${text ? h`<p>${text}</p>` : ''}${actions ? h`<div class="cluster" style="justify-content:center">${actions}</div>` : ''}</div>`;

  /* ---------- System plate ---------- */
  ui.plate = (cat, opts = {}) => {
    const sel = AV.garage.active();
    const items = get.productsByCat(cat.id);
    const fitN = sel ? items.filter((p) => AV.resolveFit(p, sel).state === 'fits').length : 0;
    return h`<a class="plate ticked ${opts.light ? 'plate-light' : ''} ${opts.cls || ''}" href="${AV.url.category(cat.id)}">
      <div class="plate-art">${AV.art(cat.art)}</div>
      <div class="plate-top"><span class="plate-no">${AV.faDigits(String(cat.no).padStart(2, '0'))}</span><span class="latin-label" style="opacity:.8">PLATE ${String(cat.no).padStart(2, '0')}</span></div>
      <div class="stack" style="--stack:6px">
        <h3>${cat.fa}</h3>
        <p class="plate-meta">${cat.blurb}</p>
        <p class="plate-meta">${AV.faDigits(items.length)} قطعه</p>
        ${sel ? h`<p class="plate-fit" data-plate-fit="${cat.id}">${AV.icon('check')}${AV.faDigits(fitN)} قطعه سازگار با ${AV.vehicleOf(sel).variant.name}</p>` : ''}
      </div>
    </a>`;
  };

  /* ---------- Article card ---------- */
  ui.articleCard = (a, opts = {}) => h`<a class="a-card ${opts.cls || ''}" href="${AV.url.article(a.slug)}">
    ${opts.image === false ? '' : ui.media(a.art, { ratio: opts.ratio || 'ratio-32', ticked: opts.ticked, alt: '', caption: opts.caption })}
    <div class="a-meta"><span class="a-cat">${a.cat}</span><span>${AV.faDigits(a.minutes)} دقیقه مطالعه</span>${opts.byline ? h`<span>${a.author}</span>` : ''}</div>
    <h3>${AV.faRaw(a.title)}</h3>
    ${opts.excerpt ? h`<p class="t-meta">${AV.faRaw(a.excerpt)}</p>` : ''}
  </a>`;

  /* ---------- Vehicle line ---------- */
  ui.vehicleLine = (sel) => {
    const x = AV.vehicleOf(sel); if (!x) return '';
    return h`<span class="vehicle-line"><bdi>${x.variant.name}</bdi><span class="sep">·</span>${AV.yearHTML(x.year)}<span class="sep">·</span><span>${AV.engShort(x.variant)}</span><span class="sep">·</span><bdi>${x.variant.trim}</bdi></span>`;
  };

  /* ---------- Generic FAQ (+ JSON-LD) ---------- */
  ui.faq = (items) => h`<div class="acc">${items.map((f) => h`<details><summary>${f.q}${AV.icon('plus')}</summary><div class="acc-body">${f.a}</div></details>`)}</div>`;
  ui.faqLD = (items) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });

  ui.productLD = (p) => ({
    '@context': 'https://schema.org', '@type': 'Product', name: `${get.type(p.type).fa} ${get.brand(p.brand).name} ${p.sku}`,
    sku: p.sku, mpn: p.mpn, brand: { '@type': 'Brand', name: get.brand(p.brand).name }, category: get.cat(p.cat).fa,
    description: `${AV.fa(p.title)} — ${get.brand(p.brand).name}. شماره OEM: ${p.oem.join('، ') || '—'}`,
    offers: { '@type': 'Offer', priceCurrency: 'IRR', price: p.price * 10, availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: AV.SITE + '/' + AV.url.product(p) },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviews },
  });
  /* ---------- Forms: Persian validation, errors linked via aria-describedby ---------- */
  const clean = (v) => AV.latinDigits(String(v || '')).replace(/[\s\-]/g, '');
  AV.forms = {
    clean,
    isMobile: (v) => /^09\d{9}$/.test(clean(v)),
    isPostal: (v) => /^\d{10}$/.test(clean(v)),
    setError(field, msg) {
      const f = field.closest('.field'); if (!f) return;
      f.classList.toggle('has-error', !!msg);
      const id = (field.id || AV.uid('f')) + '-err';
      let e = f.querySelector('.error');
      if (!e) { e = document.createElement('p'); e.className = 'error'; e.id = id; f.appendChild(e); }
      e.innerHTML = msg ? String(h`${AV.icon('alert', { size: 'sm' })}<span>${msg}</span>`) : '';
      e.hidden = !msg;
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      const d = (field.getAttribute('aria-describedby') || '').split(' ').filter((x) => x && x !== e.id);
      if (msg) d.push(e.id);
      if (d.length) field.setAttribute('aria-describedby', d.join(' ')); else field.removeAttribute('aria-describedby');
    },
    /* rules: { fieldName: (value, form) => errorMessage | null } — returns true when valid */
    validate(form, rules) {
      let first = null;
      Object.entries(rules).forEach(([name, fn]) => {
        const el = form.elements[name]; if (!el) return;
        const msg = fn(el.value, form);
        AV.forms.setError(el, msg);
        if (msg && !first) first = el;
      });
      if (first) { first.focus(); AV.announce('لطفاً خطاهای فرم را برطرف کنید.'); }
      return !first;
    },
    live(form, rules) {
      form.addEventListener('blur', (e) => { const fn = rules[e.target.name]; if (fn && e.target.value) AV.forms.setError(e.target, fn(e.target.value, form)); }, true);
      form.addEventListener('input', (e) => { const fn = rules[e.target.name]; if (fn && e.target.getAttribute('aria-invalid') === 'true') AV.forms.setError(e.target, fn(e.target.value, form)); });
    },
    req: (label) => (v) => (String(v).trim() ? null : `${label} را وارد کنید.`),
    mobileRule: (v) => (!String(v).trim() ? 'شماره موبایل را وارد کنید.' : AV.forms.isMobile(v) ? null : 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود؛ مثل ۰۹۱۲۱۲۳۴۵۶۷.'),
    postalRule: (v) => (!String(v).trim() ? 'کد پستی را وارد کنید.' : AV.forms.isPostal(v) ? null : 'کد پستی باید ۱۰ رقم و بدون خط تیره باشد.'),
  };

  ui.itemListLD = (list) => ({ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: list.slice(0, 30).map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: AV.SITE + '/' + AV.url.product(p) })) });
})(window.AV);
