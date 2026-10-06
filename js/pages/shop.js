/* AUTOVEX — Shop / Category listing (Section 11.2) */
(function (AV) {
  'use strict';
  const h = AV.html, ui = AV.ui, D = AV.data, get = AV.get;

  AV.page({ nav: 'shop', strip: true }, () => {
    const catId = AV.param('cat'), typeId = AV.param('type');
    const cat = catId && get.cat(catId);
    const type = !cat && typeId && get.type(typeId);
    let title, intro, crumbs, canonical, lock = {};
    if (cat) {
      title = AV.raw(`<span class="t-meta" style="font-weight:800">${AV.faDigits(String(cat.no).padStart(2, '0'))}</span> ${AV.esc(cat.fa)}`);
      intro = `پلیت ${AV.faDigits(String(cat.no).padStart(2, '0'))} — ${cat.blurb}. سازگاری هر قطعه با خودروی شما کنار آن نمایش داده می‌شود.`;
      crumbs = [{ name: 'خانه', href: 'index.html' }, { name: 'قطعات خودرو', href: 'categories.html' }, { name: cat.fa }];
      canonical = AV.url.category(cat.id); lock = { cat: cat.id };
    } else if (type) {
      title = type.fa;
      intro = `${type.fa} برای خودروهای داخلی و وارداتی؛ با کد سازنده، شماره OEM و گزارش تطبیق.`;
      crumbs = [{ name: 'خانه', href: 'index.html' }, { name: get.cat(type.cat).fa, href: AV.url.category(type.cat) }, { name: type.fa }];
      canonical = AV.url.shop({ type: type.id });
    } else {
      title = 'فروشگاه';
      intro = 'همه قطعات اتووکس. با انتخاب خودرو، فقط قطعاتی را می‌بینید که به خودروی شما می‌خورند.';
      crumbs = [{ name: 'خانه', href: 'index.html' }, { name: 'فروشگاه' }];
      canonical = 'shop.html';
    }
    const base = cat ? get.productsByCat(cat.id) : D.products;
    const plainTitle = cat ? `قطعات ${cat.fa} خودرو` : type ? `خرید ${type.fa}` : 'فروشگاه قطعات خودرو';
    AV.seo({
      title: plainTitle,
      description: cat ? `خرید قطعات ${cat.fa} خودرو (${cat.blurb}) با تطبیق دقیق بر اساس مدل، سال، موتور و تیپ. ${AV.faDigits(base.length)} قطعه با شماره OEM.` : `${intro}`,
      canonical,
      jsonld: [ui.crumbsLD(crumbs), ui.itemListLD(type ? get.productsByType(type.id) : base)],
    });
    AV.listing(AV.$('#main'), { id: 'shop', title, intro, crumbs, lock, base: () => base });
  });
})(window.AV);
