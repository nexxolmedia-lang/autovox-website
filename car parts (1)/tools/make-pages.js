/* Generates the static HTML shell for every route. Run once after adding a page:
     node tools/make-pages.js
   Each page is plain HTML: head metadata + <main> + the shared classic scripts.
   Content is rendered by js/pages/<page>.js from the typed data in js/. */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const CORE = ['core.js', 'art.js', 'data.js', 'articles-meta.js', 'engine.js', 'ui.js', 'shell.js'];
const pages = [
  ['index.html', 'اتووکس | قطعه درست، برای خودروی درست', 'فروشگاه قطعات خودرو با تطبیق دقیق بر اساس برند، مدل، سال، موتور و تیپ؛ با گزارش تطبیق برای هر قطعه.', ['pages/home.js']],
  ['shop.html', 'فروشگاه قطعات خودرو | اتووکس', 'همه قطعات خودرو با فیلتر سازگاری با خودروی شما.', ['listing.js', 'pages/shop.js']],
  ['categories.html', 'قطعات خودرو بر اساس سیستم | اتووکس', 'هشت سیستم اصلی خودرو و قطعات سازگار با خودروی شما.', ['pages/categories.js']],
  ['product.html', 'قطعه | اتووکس', 'مشخصات فنی، شماره OEM و گزارش تطبیق قطعه با خودروی شما.', ['pages/product.js']],
  ['search.html', 'جستجو | اتووکس', 'جستجوی قطعه با نام، کد فنی، شماره OEM یا مدل خودرو.', ['listing.js', 'pages/search.js']],
  ['vehicles.html', 'قطعات خودرو بر اساس خودرو | اتووکس', 'قطعات خودروهای داخلی و وارداتی: ایران‌خودرو، سایپا، KMC، BMW، هیوندای و دیگران.', ['pages/vehicles.js']],
  ['vehicle.html', 'قطعات خودرو | اتووکس', 'قطعات سازگار، برنامه سرویس و راهنمای این خودرو.', ['listing.js', 'pages/vehicle.js']],
  ['fit.html', 'قطعه سازگار | اتووکس', 'قطعه سازگار با این خودرو، با گزارش تطبیق.', ['listing.js', 'pages/combo.js']],
  ['brands.html', 'برندهای معتبر | اتووکس', 'قطعاتی از برندهایی که به کیفیتشان اعتماد داریم.', ['pages/brands.js']],
  ['brand.html', 'برند | اتووکس', 'معرفی برند و قطعات آن در اتووکس.', ['listing.js', 'pages/brand.js']],
  ['cart.html', 'سبد خرید | اتووکس', 'سبد خرید شما با بررسی سازگاری قطعات.', ['pages/cart.js']],
  ['checkout.html', 'تسویه حساب | اتووکس', 'ثبت سفارش و پرداخت امن.', ['pages/checkout.js']],
  ['success.html', 'سفارش ثبت شد | اتووکس', 'سفارش شما با موفقیت ثبت شد.', ['pages/success.js']],
  ['guides.html', 'راهنمای خودرو | اتووکس', 'مقاله‌های فنی درباره ترمز، موتور، فیلتر، سرویس دوره‌ای و خرید هوشمند قطعه.', ['pages/guides.js']],
  ['article.html', 'راهنما | اتووکس', 'راهنمای فنی خودرو.', ['articles-body.js', 'pages/article.js']],
  ['request.html', 'درخواست تأمین قطعه | اتووکس', 'کد فنی یا مشخصات خودروی خود را بفرستید؛ کارشناس فنی قطعه مناسب را بررسی می‌کند.', ['pages/request.js']],
  ['account.html', 'حساب کاربری | اتووکس', 'خودروهای من، سفارش‌ها، درخواست‌ها و آدرس‌ها.', ['pages/account.js']],
  ['design-system.html', 'سیستم طراحی | اتووکس', 'سیستم طراحی Technical Plate اتووکس: رنگ، تایپوگرافی و اجزای رابط.', ['pages/design-system.js']],
  ['404.html', 'صفحه پیدا نشد | اتووکس', 'این صفحه وجود ندارد.', ['pages/notfound.js']],
];

const tpl = (file, title, desc, scripts) => `<!doctype html>
<html lang="fa" dir="rtl" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#0B0D0F">
<meta property="og:site_name" content="AUTOVEX اتووکس">
<meta property="og:locale" content="fa_IR">
<link rel="icon" href="img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="fonts/vazirmatn-arabic-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/pages.css">
</head>
<body>
<main id="main"><noscript><p style="padding:24px">برای استفاده از اتووکس، جاوااسکریپت مرورگر را فعال کنید.</p></noscript></main>
${[...CORE, ...scripts].map((s) => `<script src="js/${s}"></script>`).join('\n')}
</body>
</html>
`;

pages.forEach(([file, title, desc, scripts]) => {
  fs.writeFileSync(path.join(ROOT, file), tpl(file, title, desc, scripts));
});
console.log(`wrote ${pages.length} pages`);
