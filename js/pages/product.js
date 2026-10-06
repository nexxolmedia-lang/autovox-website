/* AUTOVEX — Product page (Section 11.4) */
(function (AV) {
  'use strict';
  const h = AV.html, ui = AV.ui, D = AV.data, get = AV.get, $ = AV.$, $$ = AV.$$;

  AV.page({ nav: 'shop', strip: true }, () => {
    const p = get.product(AV.param('sku'));
    const main = $('#main');
    if (!p) {
      AV.seo({ title: 'قطعه پیدا نشد', description: 'این قطعه در فهرست اتووکس وجود ندارد.' });
      AV.render(main, h`<div class="container section">${ui.empty({ title: 'این قطعه پیدا نشد', text: 'ممکن است کد کالا تغییر کرده باشد. کد فنی را جستجو کنید یا درخواست تأمین ثبت کنید.', actions: h`<button type="button" class="btn btn-dark" data-open-search>جستجوی کد</button><a class="btn btn-outline" href="request.html">درخواست تأمین قطعه</a>` })}</div>`);
      return;
    }
    AV.recent.push(p.sku);
    const t = get.type(p.type), c = get.cat(p.cat), b = get.brand(p.brand);
    const crumbs = [{ name: 'خانه', href: 'index.html' }, { name: c.fa, href: AV.url.category(c.id) }, { name: t.fa, href: AV.url.shop({ type: t.id }) }, { name: `${b.name} ${p.sku}` }];
    AV.seo({
      title: `${AV.fa(p.title)} ${b.name} ${p.sku}`,
      description: `${AV.fa(p.title)} ${b.name} با کد ${p.mpn}${p.oem.length ? ' و شماره OEM ' + p.oem[0] : ''}. سازگاری با خودروی خود را با گزارش تطبیق بررسی کنید. قیمت ${AV.price(p.price)}.`,
      canonical: AV.url.product(p), type: 'product',
      jsonld: [ui.productLD(p), ui.crumbsLD(crumbs)],
    });
    let qty = 1;
    const alt = ui.altFor(p);
    const views = [
      { label: 'نمای اصلی', html: ui.media(t.id, { light: true, alt, caption: 'نمای ۱ — روبه‌رو' }) },
      { label: 'نمای جزئیات', html: h`<div class="media light" role="img" aria-label="${alt} — نمای نزدیک"><div class="art" style="inline-size:100%;block-size:100%">${AV.art(t.id, { vb: '40 40 120 120' })}</div><span class="media-caption">نمای ۲ — جزئیات</span></div>` },
      { label: 'نقشه فنی با ابعاد', html: h`<div class="media" role="img" aria-label="${alt} — نقشه فنی با خطوط اندازه"><div class="art" style="inline-size:82%;block-size:82%">${AV.drawing(t.id, p.dims || {})}</div><span class="media-caption">نمای ۳ — نقشه فنی</span></div>` },
    ];
    const reviews = D.reviewPool.filter((_, i) => (i + p.sku.length) % 2 === 0 || i < 2).slice(0, 4);

    AV.render(main, h`
      <div class="container" style="padding-block-start:20px">${ui.crumbs(crumbs)}</div>
      <div class="container pdp">
        <div class="gallery" aria-label="تصاویر قطعه" aria-roledescription="carousel">
          <div class="gallery-thumbs" role="tablist" aria-label="انتخاب نما">${views.map((v, i) => h`<button type="button" role="tab" aria-label="${v.label}" aria-current="${String(i === 0)}" data-thumb="${i}">${ui.media(t.id, { light: i < 2, ratio: 'ratio-1' })}</button>`)}</div>
          <div><div class="gallery-track" data-track tabindex="0" aria-label="گالری؛ برای جابه‌جایی بکشید">${views.map((v, i) => h`<div data-slide="${i}" role="group" aria-roledescription="slide" aria-label="${AV.faDigits(i + 1)} از ${AV.faDigits(views.length)}: ${v.label}">${v.html}</div>`)}</div>
          <div class="gallery-dots">${views.map((v, i) => h`<button type="button" aria-label="نمای ${AV.faDigits(i + 1)}" aria-current="${String(i === 0)}" data-dot="${i}"></button>`)}</div>
          <p class="t-micro t-meta" style="margin-block-start:10px">تصویر واقعی محصول به‌زودی؛ طرح فنی بر اساس مشخصات قطعه ترسیم شده است.</p></div>
        </div>

        <div class="buy buy-sticky">
          <div class="cluster" style="--gap:10px"><a class="wordmark" href="${AV.url.brand(b.id)}" style="font-size:.875rem">${b.name}</a>${ui.origin(p)}</div>
          <h1>${AV.faRaw(p.title)}</h1>
          <div class="buy-codes">${ui.pn(p.sku, { label: 'کد کالا' })}${ui.pn(p.mpn, { label: 'سازنده' })}${p.oem[0] ? ui.pn(p.oem[0], { label: 'OEM' }) : ''}</div>
          <a href="#reviews" class="link" style="text-decoration:none">${ui.rating(p)}</a>
          <div data-fitblock></div>
          <div class="buy-price">${AV.priceHTML(p.price, 'price-lg')}${ui.stock(p)}</div>
          <ul class="list-reset buy-micro">
            <li>${AV.icon('truck', { size: 'sm' })}${p.stock > 0 ? 'ارسال از فردا · تحویل ۲ تا ۴ روز کاری · تهران: ارسال فوری همان روز' : 'ناموجود · می‌توانید درخواست تأمین ثبت کنید'}</li>
            ${p.qtyHint ? h`<li>${AV.icon('info', { size: 'sm' })}${p.qtyHint}</li>` : ''}
          </ul>
          ${p.stock > 0 ? h`<div class="buy-actions" data-main-cta>
              ${ui.qty('local', qty, p.stock)}
              <button type="button" class="btn btn-primary btn-lg" data-add="${p.sku}" data-qty-add="1">افزودن به سبد — ${AV.price(p.price)}</button>
            </div>` : h`<a class="btn btn-primary btn-lg btn-block" href="request.html?sku=${p.sku}" data-main-cta>درخواست تأمین این قطعه</a>`}
          <ul class="list-reset buy-micro">
            <li>${AV.icon('shield', { size: 'sm' })}${p.warranty ? `${AV.faDigits(p.warranty)} ماه گارانتی اصالت و سلامت فیزیکی` : 'کالای مصرفی؛ ضمانت اصالت'} · ۷ روز بازگشت برای قطعه ناسازگار</li>
          </ul>
        </div>
      </div>

      <nav class="pdp-nav" aria-label="بخش‌های صفحه"><div class="container"><div class="tabs-list">
        ${[['specs', 'مشخصات فنی'], ['compat', 'سازگاری'], ['oem', 'شماره‌های OEM و معادل‌ها'], ['ship', 'ارسال و گارانتی'], ['reviews', 'نظرات']].map(([id, fa]) => h`<a class="tab" href="#${id}">${fa}</a>`)}
      </div></div></nav>

      <div class="container pdp-sections">
        <section class="pdp-sec" id="specs" aria-labelledby="specs-h"><h2 id="specs-h">مشخصات فنی</h2>
          <div class="pdp-two"><div>${ui.specTable(p)}</div>
            <figure class="stack" style="--stack:10px"><div class="media ticked ratio-1" role="img" aria-label="نقشه فنی ${t.fa} با ابعاد"><div class="art" style="inline-size:86%;block-size:86%">${AV.drawing(t.id, p.dims || {})}</div></div>
            <figcaption class="t-small t-meta">نقشه فنی — ${t.fa}${p.dims ? ` · ابعاد: ${[p.dims.w, p.dims.h].filter(Boolean).join(' × ')}` : ''}</figcaption></figure></div>
        </section>

        <section class="pdp-sec" id="compat" aria-labelledby="compat-h"><h2 id="compat-h">سازگاری</h2><div data-compat></div></section>

        <section class="pdp-sec" id="oem" aria-labelledby="oem-h"><h2 id="oem-h">شماره‌های OEM و معادل‌ها</h2>
          <div class="pdp-two"><div class="table-wrap"><table class="dtable"><thead><tr><th>نوع شماره</th><th>شماره</th><th>توضیح</th></tr></thead><tbody>
            <tr><td>کد کالای اتووکس</td><td>${ui.pn(p.sku, { size: 'sm' })}</td><td class="t-small t-meta">شناسه این قطعه در فروشگاه</td></tr>
            <tr><td>کد سازنده (MPN)</td><td>${ui.pn(p.mpn, { size: 'sm' })}</td><td class="t-small t-meta">کد ${b.name} برای این قطعه</td></tr>
            ${p.oem.map((o) => h`<tr><td>شماره OEM</td><td>${ui.pn(o, { size: 'sm' })}</td><td class="t-small t-meta">شماره فنی خودروساز</td></tr>`)}
            ${p.cross.map((o) => h`<tr><td>معادل</td><td>${ui.pn(o, { size: 'sm' })}</td><td class="t-small t-meta">قطعه هم‌ارز از برند دیگر</td></tr>`)}
          </tbody></table></div>
          <div class="callout">${AV.icon('info')}<p class="t-small">شماره روی قطعه قبلی خود را با این جدول مقایسه کنید. فاصله، نقطه و خط تیره اهمیتی ندارند؛ جستجوی <bdi class="code">${p.oem[0] ? AV.compact(p.oem[0]).toUpperCase() : p.sku}</bdi> هم به همین قطعه می‌رسد. <a class="link" href="article.html?a=what-is-oem">شماره OEM چیست؟</a></p></div></div>
        </section>

        <section class="pdp-sec" id="ship" aria-labelledby="ship-h"><h2 id="ship-h">ارسال و گارانتی</h2>
          <div class="why">${[['ارسال عادی', `${AV.SHIPPING.standard.eta}؛ رایگان برای سفارش‌های بالای ${AV.price(AV.FREE_SHIP)}.`], ['ارسال فوری تهران', `${AV.SHIPPING.express.eta}؛ ${AV.price(AV.SHIPPING.express.price)}.`], ['گارانتی', p.warranty ? `${AV.faDigits(p.warranty)} ماه ضمانت اصالت و سلامت فیزیکی.` : 'کالای مصرفی؛ ضمانت اصالت کالا.'], ['بازگشت', 'اگر قطعه با خودرویی که در گزارش تطبیق ثبت شده سازگار نبود، تا ۷ روز بدون هزینه بازمی‌گردد.']].map(([k, v], i) => h`<div class="why-item"><span class="why-no">${AV.faDigits('0' + (i + 1))}</span><h3 style="font-size:1.0625rem">${k}</h3><p class="t-small">${v}</p></div>`)}</div>
        </section>

        <section class="pdp-sec" id="reviews" aria-labelledby="rev-h"><h2 id="rev-h">نظرات</h2>
          <div class="pdp-two"><div>${reviews.map((r) => h`<article class="review"><div class="review-head"><strong style="color:var(--fg)">${r.n}</strong><span>${AV.faDigits(r.s)} از ${AV.faDigits(5)} · خریدار</span></div><p>${r.t}</p></article>`)}</div>
          <div class="card-box stack" style="--stack:10px;align-self:start"><span class="price-lg" style="font-weight:800">${AV.faDigits(p.rating.toFixed(1)).replace('.', '٫')}</span>${ui.rating(p)}<p class="t-small t-meta">نظرات فقط از خریداران این قطعه ثبت می‌شود.</p></div></div>
        </section>

        ${p.kit ? h`<div class="pdp-sec">${ui.kit(p)}</div>` : ''}
        <section class="pdp-sec" aria-labelledby="sim-h" data-similar></section>
        <section class="pdp-sec" aria-labelledby="rv-h" data-recent style="border:0"></section>
      </div>

      ${p.stock > 0 ? h`<div class="sticky-buy" data-sticky aria-hidden="true"><span data-sticky-seal></span><button type="button" class="btn btn-primary" data-add="${p.sku}" tabindex="-1">افزودن به سبد — ${AV.price(p.price)}</button></div>` : ''}
    `);

    /* ---------- FIT block ---------- */
    function drawFit() {
      const sel = AV.garage.active();
      const box = $('[data-fitblock]');
      const fit = AV.resolveFit(p, sel);
      if (!sel) {
        AV.render(box, h`<section class="fit-block no-vehicle" aria-labelledby="fit-h"><div class="fit-block-head"><h2 id="fit-h" style="font-size:1rem">سازگاری با خودروی شما</h2><span class="t-small t-meta">خودروی خود را همین‌جا انتخاب کنید؛ از صفحه خارج نمی‌شوید.</span></div>
          <div class="fit-block-body"><div data-inline-sel></div></div></section>`);
        AV.selector.mount(box.querySelector('[data-inline-sel]'), { mode: 'sheet' });
      } else {
        const msg = { fits: 'این قطعه با خودروی شما سازگار است.', verify: `سازگاری به «${fit.attr}» بستگی دارد؛ پیش از خرید بررسی کنید.`, 'no-fit': 'این قطعه با خودروی شما سازگار نیست.' }[fit.state];
        const icon = { fits: 'check', verify: 'alert', 'no-fit': 'x' }[fit.state];
        const alts = fit.state === 'no-fit' ? AV.alternatives(p, sel, 3) : [];
        AV.render(box, h`<section class="fit-block ${fit.state}" aria-labelledby="fit-h" aria-live="polite">
          <div class="fit-block-head"><h2 id="fit-h" style="font-size:1rem">سازگاری با خودروی شما</h2>${ui.vehicleLine(sel)}</div>
          <div class="fit-block-body">
            <p class="fit-msg">${AV.icon(icon)}<span>${msg}</span></p>
            <div class="cluster">${ui.seal(p, { size: 'lg' })}<button type="button" class="link t-small" data-open-report>مشاهده گزارش تطبیق</button><button type="button" class="link t-small" data-open-garage>تغییر خودرو</button></div>
            ${fit.state === 'verify' ? h`<a class="btn btn-outline btn-sm" href="request.html?sku=${p.sku}&ask=1" style="justify-self:start">${AV.icon('headset', { size: 'sm' })}پرسش از پشتیبان فنی</a>` : ''}
            ${alts.length ? h`<div><p class="t-small t-500" style="margin-block-end:6px">جایگزین‌های سازگار:</p><ul class="list-reset">${alts.map((a) => h`<li class="between" style="padding-block:6px;border-block-start:1px solid var(--line)"><a class="link t-small" href="${AV.url.product(a)}">${get.brand(a.brand).name} — ${AV.faRaw(a.title)}</a>${AV.priceHTML(a.price)}</li>`)}</ul></div>` : ''}
          </div></section>`);
        const prev = box.dataset.state; box.dataset.state = fit.state;
        if (prev && prev !== fit.state) { const s = box.querySelector('.seal'); if (s) { s.classList.add('is-stamping'); } }
      }
      const ss = $('[data-sticky-seal]'); if (ss) AV.render(ss, ui.sealStatic(fit.state, fit.state === 'fits' ? 'سازگار' : fit.state === 'no-fit' ? 'ناسازگار' : fit.state === 'verify' ? 'بررسی' : 'خودرو؟'));
    }
    main.addEventListener('click', (e) => { if (e.target.closest('[data-open-report]')) AV.openFitReport(p.sku); });

    /* ---------- Compatibility list (searchable) ---------- */
    let cq = '';
    function drawCompat() {
      const sel = AV.garage.active();
      const box = $('[data-compat]');
      if (p.universal) {
        AV.render(box, h`<div class="pdp-two"><div class="callout ok">${AV.icon('check')}<p>${p.universalNote}</p></div><div>${ui.fitReport(p, sel)}</div></div>`);
        return;
      }
      const vs = AV.compatibleVariants(p);
      const verifyIds = Object.keys(p.verify || {});
      const f = AV.normalize(cq);
      const rows = vs.filter((v) => !f || AV.normalize(`${v.name} ${get.model(v.model).fa} ${v.engLabel} ${v.trim}`).includes(f));
      const byModel = new Map(); rows.forEach((v) => { if (!byModel.has(v.model)) byModel.set(v.model, []); byModel.get(v.model).push(v); });
      AV.render(box, h`<div class="pdp-two"><div>
        <div class="field" style="margin-block-end:12px"><label for="cq">جستجو در ${AV.faDigits(vs.length)} خودروی سازگار</label><input id="cq" class="input" type="search" placeholder="مثلاً ۲۰۶ یا 330i" value="${cq}" data-cq></div>
        <div class="compat-list" aria-live="polite">${[...byModel.entries()].map(([mid, list]) => h`
          <div class="stack" style="--stack:0"><p class="t-small t-500" style="padding-block:14px 4px"><a class="link" href="${AV.url.model(mid)}">${get.model(mid).fa}</a></p>
          ${list.map((v) => h`<div class="compat-item ${sel && sel.variantId === v.id ? 'is-mine' : ''}"><span><bdi>${v.name}</bdi> · ${v.trim} · <span class="t-meta">${v.engLabel} · ${AV.range(v.from, v.to)}</span></span>
            ${sel && sel.variantId === v.id ? h`<span class="badge">${AV.icon('check', { size: 'sm', cls: 'ok-ico' })}خودروی شما</span>` : ''}</div>`)}</div>`)}
          ${!rows.length ? h`<p class="t-meta" style="padding-block:16px">خودرویی با این عبارت در فهرست سازگاری نیست.</p>` : ''}
          ${verifyIds.length ? h`<p class="t-small t-500" style="padding-block:18px 4px">نیاز به بررسی</p>${verifyIds.map((id) => { const v = get.variant(id); return h`<div class="compat-item"><span><bdi>${v.name}</bdi> · ${v.trim}</span><span class="t-small t-meta">${p.verify[id]}</span></div>`; })}` : ''}
        </div></div>
        <div>${ui.fitReport(p, sel)}</div></div>`);
      const inp = box.querySelector('[data-cq]');
      inp.addEventListener('input', () => { cq = inp.value; const pos = inp.selectionStart; drawCompat(); const n = $('[data-cq]'); n.focus(); n.setSelectionRange(pos, pos); });
    }

    /* ---------- Similar / equivalents & recently viewed ---------- */
    function drawSimilar() {
      const sel = AV.garage.active();
      let sim = D.products.filter((q) => q.sku !== p.sku && q.type === p.type);
      if (sel) sim.sort((a, b2) => (AV.resolveFit(b2, sel).state === 'fits') - (AV.resolveFit(a, sel).state === 'fits') || b2.sold - a.sold);
      if (sim.length < 4) sim = sim.concat(D.products.filter((q) => q.sku !== p.sku && q.type !== p.type && q.cat === p.cat)).slice(0, 4);
      AV.render($('[data-similar]'), h`<div class="between" style="margin-block-end:20px"><h2 id="sim-h" style="font-size:1.5rem">محصولات مشابه و معادل</h2><a class="link-arrow t-small" href="${AV.url.shop({ type: p.type })}">همه ${t.fa} ${AV.icon('arrow', { dir: true, size: 'sm' })}</a></div>
        <div class="scroller">${sim.slice(0, 4).map((q) => ui.card(q))}</div>`);
      const rec = AV.recent.list().filter((s) => s !== p.sku).slice(0, 4).map(get.product);
      AV.render($('[data-recent]'), rec.length ? h`<h2 id="rv-h" style="font-size:1.5rem;margin-block-end:20px">بازدیدهای اخیر</h2><div class="scroller">${rec.map((q) => ui.card(q))}</div>` : '');
    }

    drawFit(); drawCompat(); drawSimilar();
    AV.on('garage', () => { drawFit(); drawCompat(); drawSimilar(); });

    /* ---------- Quantity (local) ---------- */
    main.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-qty="local"]'); if (!btn) return;
      qty = Math.max(1, Math.min(p.stock, qty + Number(btn.dataset.delta)));
      $('[data-qty-out="local"]').textContent = AV.faDigits(qty);
      $$('[data-qty="local"]').forEach((bt) => { bt.disabled = (bt.dataset.delta === '1' && qty >= p.stock) || (bt.dataset.delta === '-1' && qty <= 1); });
      const add = $('[data-main-cta] [data-add]'); add.dataset.qtyAdd = String(qty);
      add.textContent = `افزودن به سبد — ${AV.price(p.price * qty)}`;
    });

    /* ---------- Gallery: thumbs, dots, swipe (RTL-native scroll-snap) ---------- */
    const track = $('[data-track]');
    const go = (i) => { const s = track.querySelector(`[data-slide="${i}"]`); s.scrollIntoView({ block: 'nearest', inline: 'start', behavior: AV.reducedMotion() ? 'auto' : 'smooth' }); mark(i); };
    const mark = (i) => { $$('[data-thumb]').forEach((b2) => b2.setAttribute('aria-current', String(+b2.dataset.thumb === i))); $$('[data-dot]').forEach((b2) => b2.setAttribute('aria-current', String(+b2.dataset.dot === i))); };
    main.addEventListener('click', (e) => { const b2 = e.target.closest('[data-thumb], [data-dot]'); if (b2) go(Number(b2.dataset.thumb ?? b2.dataset.dot)); });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting && en.intersectionRatio > 0.6) mark(Number(en.target.dataset.slide)); }), { root: track, threshold: [0.6] });
      $$('[data-slide]').forEach((s) => io.observe(s));
    }
    track.addEventListener('keydown', (e) => {
      const cur = Number(($('[data-dot][aria-current="true"]') || { dataset: { dot: 0 } }).dataset.dot);
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(Math.min(views.length - 1, cur + 1)); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(Math.max(0, cur - 1)); }
    });

    /* ---------- Sticky mobile CTA ---------- */
    const sticky = $('[data-sticky]'), cta = $('[data-main-cta]');
    if (sticky && cta && 'IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => {
        const show = !en.isIntersecting && en.boundingClientRect.top < 0;
        sticky.classList.toggle('is-shown', show); sticky.setAttribute('aria-hidden', String(!show));
        sticky.querySelector('button').tabIndex = show ? 0 : -1;
      }).observe(cta);
    }
  });
})(window.AV);
