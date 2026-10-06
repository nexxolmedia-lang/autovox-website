/* AUTOVEX — Category index (all system plates) */
(function (AV) {
  'use strict';
  const h = AV.html, ui = AV.ui, D = AV.data, get = AV.get;

  AV.page({ nav: 'parts', strip: true }, () => {
    const crumbs = [{ name: 'خانه', href: 'index.html' }, { name: 'قطعات خودرو' }];
    AV.seo({ title: 'قطعات خودرو بر اساس سیستم', description: 'هشت سیستم اصلی خودرو: موتور، ترمز، جلوبندی و تعلیق، فیلترها، خنک‌کاری، برق، روغن و بدنه؛ با قطعات سازگار برای خودروی شما.', canonical: 'categories.html', jsonld: [ui.crumbsLD(crumbs)] });
    function draw() {
      const sel = AV.garage.active();
      AV.render(AV.$('#main'), h`<header class="page-band"><div class="container">${ui.crumbs(crumbs)}
          <h1>قطعات خودرو</h1><p class="t-lead">هر سیستم خودرو یک پلیت دارد. قطعه را از سیستم آن پیدا کنید؛ سازگاری با خودروی شما کنار هر قطعه نمایش داده می‌شود.</p></div></header>
        <div class="container section-tight"><div class="cat-index">
          ${D.categories.map((c) => {
            const items = get.productsByCat(c.id);
            const fitN = sel ? items.filter((p) => AV.resolveFit(p, sel).state === 'fits').length : null;
            return h`<section class="cat-row reveal" aria-labelledby="c-${c.id}">
              <div class="cat-art">${AV.art(c.art)}</div>
              <div class="stack" style="--stack:6px"><span class="plate-no" style="font-size:2rem">${AV.faDigits(String(c.no).padStart(2, '0'))}</span>
                <h2 id="c-${c.id}" class="t-h3"><a href="${AV.url.category(c.id)}">${c.fa}</a></h2><p class="t-small t-meta">${c.blurb}</p></div>
              <ul class="list-reset">${D.partTypes.filter((t) => t.cat === c.id).map((t) => h`<li><a class="chip chip-select" href="${AV.url.shop({ type: t.id })}">${t.fa}</a></li>`)}</ul>
              <div class="stack" style="--stack:4px"><span class="t-small">${AV.faDigits(items.length)} قطعه</span>${fitN != null ? h`<span class="t-small" style="color:var(--ink)">${AV.icon('check', { size: 'sm', cls: 'ok-ico' })} ${AV.faDigits(fitN)} سازگار</span>` : ''}
                <a class="link-arrow t-small" href="${AV.url.category(c.id)}">مشاهده ${AV.icon('arrow', { dir: true, size: 'sm' })}</a></div>
            </section>`;
          })}</div></div>`);
      AV.reveal();
    }
    draw();
    AV.on('garage', draw);
  });
})(window.AV);
