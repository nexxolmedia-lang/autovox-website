/* AUTOVEX — Search results page (Section 11.7) */
(function (AV) {
  'use strict';
  const h = AV.html, ui = AV.ui, get = AV.get, $ = AV.$;

  AV.page({ nav: 'search', strip: true }, () => {
    const q = (AV.param('q') || '').trim();
    if (q) AV.searches.push(q);
    const r = AV.search(q, { sel: null });
    const scores = new Map(r.products.map((x) => [x.p.sku, x.score]));
    const base = r.products.map((x) => x.p);
    AV.seo({ title: q ? `جستجوی «${q}»` : 'جستجو', description: `نتایج جستجوی ${q} در قطعات خودرو اتووکس؛ بر اساس نام قطعه، کد فنی، شماره OEM و مدل خودرو.`, canonical: AV.url.search(q) });

    const main = $('#main');
    AV.render(main, h`<header class="page-band"><div class="container">
        ${ui.crumbs([{ name: 'خانه', href: 'index.html' }, { name: 'جستجو' }])}
        <h1>${q ? h`نتایج جستجو برای «${q}»` : 'جستجو'}</h1>
        <form class="cluster" role="search" action="search.html" style="margin-block-start:16px;max-inline-size:640px;flex-wrap:nowrap">
          <label for="sq" class="sr-only">جستجو</label>
          <input id="sq" name="q" class="input" type="search" value="${q}" placeholder="نام قطعه، کد فنی یا مدل خودرو را جستجو کنید...">
          <button class="btn btn-dark" type="submit">${AV.icon('search', { size: 'sm' })}جستجو</button>
        </form>
        ${r.parsed.fuzzy.length ? h`<p class="t-small t-meta" style="margin-block-start:10px">نتایج برای «${r.parsed.fuzzy.map((f) => f.to).join('، ')}» نمایش داده می‌شود.</p>` : ''}
        <div data-mine style="margin-block-start:16px"></div>
        ${r.models.length || r.brands.length || r.guides.length ? h`<div class="cluster" style="margin-block-start:20px;--gap:8px">
          ${r.models.map((m) => h`<a class="chip chip-select" href="${AV.url.model(m.id)}">${AV.icon('car', { size: 'sm' })}قطعات ${m.fa}</a>`)}
          ${r.brands.map((b) => h`<a class="chip chip-select" href="${AV.url.brand(b.id)}"><bdi class="wordmark" style="font-size:.6875rem">${b.name}</bdi></a>`)}
          ${r.guides.map((a) => h`<a class="chip chip-select" href="${AV.url.article(a.slug)}">${AV.icon('book', { size: 'sm' })}${AV.faRaw(a.title)}</a>`)}
        </div>` : ''}
      </div></header><div data-list></div>`);

    function drawMine() {
      const sel = AV.garage.active();
      const box = $('[data-mine]');
      if (!sel || !base.length) return AV.render(box, '');
      const mine = base.filter((p) => AV.resolveFit(p, sel).state === 'fits');
      AV.render(box, h`<div class="callout ${mine.length ? 'ok' : 'warn'}">${AV.icon(mine.length ? 'check' : 'alert')}<div>
        <strong>نتایجی برای <bdi>${AV.vehicleLabel(sel, { parts: 'short' })}</bdi>:</strong> ${mine.length ? `${AV.faDigits(mine.length)} قطعه از ${AV.faDigits(base.length)} نتیجه با خودروی شما سازگار است.` : 'هیچ‌کدام از نتایج با خودروی شما سازگار نیست.'}
        ${mine.length ? h` <button type="button" class="link" data-only-mine>فقط همین‌ها</button>` : ''}</div></div>`);
    }
    drawMine();
    AV.on('garage', drawMine);
    if (!q || !base.length) {
      AV.render($('[data-list]'), h`<div class="container section-tight">${ui.empty({
        title: q ? 'نتیجه‌ای پیدا نشد' : 'چه قطعه‌ای لازم دارید؟',
        text: q ? 'نتیجه‌ای پیدا نشد. کد فنی یا مشخصات خودرو را برایمان بفرستید.' : 'نام قطعه، کد فنی، شماره OEM یا مدل خودرو را جستجو کنید؛ مثل «لنت جلو ۲۰۶» یا «34116888123».',
        actions: h`<a class="btn btn-primary" href="request.html?q=${encodeURIComponent(q)}">درخواست تأمین قطعه</a><a class="btn btn-outline" href="shop.html">مشاهده فروشگاه</a>`,
      })}</div>`);
      return;
    }
    const L = AV.listing($('[data-list]'), { id: 'search', band: false, fitDefault: false, base: () => base, scores: () => scores });
    main.addEventListener('click', (e) => { if (e.target.closest('[data-only-mine]')) { L.state.fit = true; L.draw(); $('[data-list]').scrollIntoView({ behavior: AV.reducedMotion() ? 'auto' : 'smooth' }); } });
  });
})(window.AV);
