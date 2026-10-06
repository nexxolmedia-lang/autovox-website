/* AUTOVEX — 404 */
(function (AV) {
  'use strict';
  const h = AV.html;
  AV.page({}, () => {
    AV.seo({ title: 'صفحه پیدا نشد', description: 'این صفحه وجود ندارد.' });
    AV.render(AV.$('#main'), h`<div class="container nf"><div class="stack" style="--stack:16px;justify-items:center;display:grid">
      <span class="latin-label t-meta">ERROR 404 · PLATE NOT FOUND</span>
      <div class="art" style="inline-size:140px;block-size:140px;color:var(--ink-2)">${AV.art('empty')}</div>
      <h1 class="t-h2">این صفحه پیدا نشد</h1>
      <p class="t-meta">ممکن است نشانی تغییر کرده باشد. قطعه یا خودروی خود را جستجو کنید.</p>
      <div class="cluster" style="justify-content:center"><button type="button" class="btn btn-dark" data-open-search>${AV.icon('search', { size: 'sm' })}جستجو</button><a class="btn btn-outline" href="index.html">صفحه اصلی</a></div>
    </div></div>`);
  });
})(window.AV);
