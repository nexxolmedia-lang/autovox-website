/* AUTOVEX — Homepage (editorial narrative, Section 11.1) */
(function (AV) {
  'use strict';
  const h = AV.html, ui = AV.ui, D = AV.data, get = AV.get, $ = AV.$;

  AV.page({ nav: 'home' }, () => {
    $('[data-header]').classList.add('on-hero');
    AV.seo({
      title: 'اتووکس | قطعه درست، برای خودروی درست',
      description: 'فروشگاه قطعات خودرو با تطبیق دقیق بر اساس برند، مدل، سال، موتور و تیپ. لنت، فیلتر، شمع، تسمه و قطعات جلوبندی با گزارش تطبیق برای خودروی شما.',
      canonical: '',
      jsonld: [
        { '@context': 'https://schema.org', '@type': 'Organization', name: 'AUTOVEX اتووکس', url: AV.SITE, logo: AV.SITE + '/img/favicon.svg', slogan: 'قطعه درست، برای خودروی درست.' },
        { '@context': 'https://schema.org', '@type': 'WebSite', name: 'اتووکس', url: AV.SITE, inLanguage: 'fa-IR', potentialAction: { '@type': 'SearchAction', target: AV.SITE + '/search.html?q={search_term_string}', 'query-input': 'required name=search_term_string' } },
      ],
    });

    const main = $('#main');
    AV.render(main, h`
      <!-- ② Hero -->
      <section class="hero surface-dark" aria-labelledby="hero-h">
        <div class="container grid-rules">
          <div class="hero-inner">
            <div class="hero-copy">
              <span class="eyebrow">اتووکس · قطعات خودرو با تطبیق دقیق</span>
              <h1 id="hero-h">قطعه درست، برای خودروی <span class="u-red">درست</span>.</h1>
              <p class="hero-sub">قطعات خودرو را دقیقاً بر اساس مدل و مشخصات خودروی خود پیدا کنید.</p>
              <div class="hero-ctas">
                <button type="button" class="btn btn-primary btn-lg" data-open-garage>${AV.icon('car')}انتخاب خودرو</button>
                <a class="btn btn-outline btn-lg" href="shop.html">مشاهده قطعات</a>
              </div>
            </div>
            <figure class="hero-figure wipe">
              <div class="media ticked" role="img" aria-label="طرح فنی دیسک ترمز تهویه‌دار و کالیپر محور جلو با خطوط اندازه">
                <div class="art">${AV.art('hero', { vb: '-10 -10 220 220' })}</div>
                <div class="hero-specs latin-label"><span>FIG. 01 / BRAKE · FRONT AXLE</span><span>Ø 348 × 36 MM</span><span>ECE R90</span></div>
              </div>
              <figcaption class="fig-meta"><span>شکل ۱ — سیستم ترمز، محور جلو</span><span class="latin-label">PLATE 02</span></figcaption>
            </figure>
            <div class="hero-dock" id="hero-console"></div>
          </div>
        </div>
      </section>

      <!-- ③ Trust strip -->
      <section class="trust" aria-label="برندهای عرضه‌شده">
        <div class="container trust-row">
          <span class="t-small">برندهای عرضه‌شده در اتووکس</span>
          ${['BOSCH', 'BREMBO', 'SKF', 'VALEO', 'NGK', 'MANN-FILTER', 'KYB', 'GATES', 'MAHLE'].map((b) => h`<a class="wordmark" href="${AV.url.brand(D.brands.find((x) => x.name === b).id)}">${b}</a>`)}
        </div>
      </section>

      <!-- ④ Shop by system -->
      <section class="section" aria-labelledby="sys-h">
        <div class="container">
          <div class="section-head">
            <div class="stack" style="--stack:10px"><span class="eyebrow">پلیت‌های سیستم</span><h2 id="sys-h">قطعات را بر اساس سیستم خودرو پیدا کنید</h2></div>
            <a class="link-arrow" href="categories.html">همه سیستم‌ها ${AV.icon('arrow', { dir: true, size: 'sm' })}</a>
          </div>
          <div class="plates" data-plates></div>
        </div>
      </section>

      <!-- ⑤ Featured parts -->
      <section class="section surface-white section-rule" aria-labelledby="feat-h">
        <div class="container">
          <div class="section-head">
            <div class="stack" style="--stack:10px"><span class="eyebrow">انتخاب اتووکس</span><h2 id="feat-h">قطعات منتخب</h2></div>
            <div class="tabs-list" role="tablist" aria-label="دسته‌بندی قطعات منتخب" data-feat-tabs></div>
          </div>
          <div data-feat role="tabpanel" aria-labelledby="feat-h"></div>
        </div>
      </section>

      <!-- ⑥ How FIT works -->
      <section class="section surface-dark" aria-labelledby="how-h">
        <div class="container">
          <div class="section-head">
            <div class="stack" style="--stack:10px"><span class="eyebrow">AUTOVEX FIT</span><h2 id="how-h">اتووکس فیت چگونه کار می‌کند؟</h2></div>
            <p>سازگاری در اتووکس یک فیلتر نیست؛ یک گزارش است. برای هر قطعه نشان می‌دهیم چرا به خودروی شما می‌خورد، یا چرا نمی‌خورد.</p>
          </div>
          <ol class="how-steps list-reset">
            <li class="how-step reveal">
              <span class="how-arrow" aria-hidden="true">${AV.icon('arrow', { dir: true, size: 'sm' })}</span>
              <span class="how-no">۱</span><h3>خودرو را انتخاب کنید</h3>
              <p>پنج مرحله برند، مدل، سال، موتور و تیپ؛ یا یک شماره شاسی ۱۷ کاراکتری. خودرو در گاراژ شما ذخیره می‌شود.</p>
              <div class="how-visual"><div class="mini-console" aria-hidden="true">
                ${[['برند', 'بی‌ام‌و'], ['مدل', 'BMW سری ۳'], ['سال', '۱۴۰۲'], ['موتور', 'B48 · ۲.۰ توربو'], ['تیپ', 'M Sport']].map(([k, v]) => h`<div class="mini-step"><span>${k}</span><strong>${v}</strong></div>`)}
              </div></div>
            </li>
            <li class="how-step reveal">
              <span class="how-arrow" aria-hidden="true">${AV.icon('arrow', { dir: true, size: 'sm' })}</span>
              <span class="how-no">۲</span><h3>سازگاری را ببینید</h3>
              <p>کنار هر قطعه مهر سازگاری می‌آید و گزارش تطبیق، دلیلش را ردیف‌به‌ردیف نشان می‌دهد.</p>
              <div class="how-visual"><div class="fit-report" aria-hidden="true">
                <div class="verdict">${ui.sealStatic('fits')}</div>
                <dl class="fit-rows">
                  ${[['موتور', 'B48 · ۲.۰ توربو'], ['سال ساخت', '۱۳۹۸–۱۴۰۴'], ['تیپ', 'M Sport (ترمز بزرگ)']].map(([k, v]) => h`<div class="fit-row ok"><dt>${k}</dt><dd>${v}</dd><span class="mark">${AV.icon('check')}</span></div>`)}
                </dl></div></div>
            </li>
            <li class="how-step reveal">
              <span class="how-no">۳</span><h3>با اطمینان بخرید</h3>
              <p>سبد خرید و صفحه پرداخت سازگاری را دوباره بررسی می‌کنند. قطعه ناسازگار تا ۷ روز قابل بازگشت است.</p>
              <div class="how-visual"><div class="cart-mini" aria-hidden="true">
                <div class="between"><span class="wordmark">BREMBO</span>${AV.priceHTML(8900000)}</div>
                <div class="cluster" style="--gap:8px"><span class="t-small">لنت ترمز جلو سرامیکی</span><bdi class="code t-small">BP-47291</bdi></div>
                ${ui.sealStatic('fits')}
                <span class="t-small" style="color:var(--steel)">${AV.icon('check', { size: 'sm' })} همه قطعات با BMW 330i سازگارند.</span>
              </div></div>
            </li>
          </ol>
          <div class="cluster" style="margin-block-start:40px">
            ${ui.sealStatic('fits')}${ui.sealStatic('verify')}${ui.sealStatic('no-fit')}${ui.sealStatic('no-vehicle')}
          </div>
          <p class="t-small t-meta" style="margin-block-start:12px">چهار حالت مهر سازگاری؛ همیشه با آیکون و متن، نه فقط رنگ. <a class="link" href="article.html?a=fit-check">بیشتر بخوانید</a></p>
        </div>
      </section>

      <!-- ⑦ Service plan -->
      <section class="section" aria-labelledby="svc-h"><div class="container" data-service></div></section>

      <!-- ⑧ Why AUTOVEX -->
      <section class="section section-rule" aria-labelledby="why-h">
        <div class="container">
          <div class="section-head"><div class="stack" style="--stack:10px"><span class="eyebrow">اصول کار</span><h2 id="why-h">چرا اتووکس؟</h2></div></div>
          <div class="why">
            ${[['اصالت کالا', 'قطعات با مشخصات و اطلاعات شفاف؛ کد سازنده، شماره OEM و استاندارد برای هر قطعه.'],
               ['تطبیق دقیق', 'بررسی سازگاری قطعه با خودرو بر اساس موتور، سال ساخت و تیپ؛ با گزارش قابل چاپ.'],
               ['ارسال سریع', 'ارسال سفارش در کوتاه‌ترین زمان؛ ارسال فوری همان روز در تهران.'],
               ['پشتیبانی تخصصی', 'راهنمایی قبل از خرید توسط کارشناس فنی؛ پیش از آنکه قطعه اشتباه برسد.']].map(([t, d], i) => h`
              <div class="why-item reveal"><span class="why-no">${AV.faDigits('0' + (i + 1))}</span><h3>${t}</h3><p>${AV.faRaw(d)}</p></div>`)}
          </div>
        </div>
      </section>

      <!-- ⑨ Guides -->
      <section class="section surface-white section-rule" aria-labelledby="guides-h">
        <div class="container">
          <div class="section-head">
            <div class="stack" style="--stack:10px"><span class="eyebrow">مجله فنی</span><h2 id="guides-h">راهنمای خودرو</h2></div>
            <a class="link-arrow" href="guides.html">همه راهنماها ${AV.icon('arrow', { dir: true, size: 'sm' })}</a>
          </div>
          <div class="mag">
            <div class="mag-lead">${ui.articleCard(AV.articles[0], { ticked: true, excerpt: true, byline: true, caption: 'شکل — لنت ترمز، نمای روبه‌رو', ratio: 'ratio-169' })}
              <p class="t-small t-meta" style="margin-block-start:10px">${AV.AUTHORS[AV.articles[0].author]}</p></div>
            <div class="mag-list">${AV.articles.slice(1, 5).map((a, i) => h`<a class="a-card" href="${AV.url.article(a.slug)}">
              <span class="mag-no">${AV.faDigits('0' + (i + 2))}</span>
              <div class="a-meta"><span class="a-cat">${a.cat}</span><span>${AV.faDigits(a.minutes)} دقیقه مطالعه</span><span>${AV.AUTHORS[a.author].split(' · ')[0]}</span></div>
              <h3>${AV.faRaw(a.title)}</h3></a>`)}</div>
          </div>
        </div>
      </section>

      <!-- ⑩ Missing part -->
      <section class="section surface-graphite" aria-labelledby="miss-h">
        <div class="container missing">
          <div class="stack" style="--stack:16px">
            <div class="art" style="inline-size:72px;block-size:72px;color:var(--steel)">${AV.art('request')}</div>
            <h2 id="miss-h">قطعه موردنظرتان را پیدا نکردید؟</h2>
            <p>کد فنی یا مشخصات خودروی خود را برای ما ارسال کنید. ما قطعه مناسب را بررسی می‌کنیم.</p>
            <p class="t-small">${AV.icon('clock', { size: 'sm' })} پاسخ کارشناس معمولاً کمتر از دو ساعت کاری</p>
          </div>
          <form class="mini-form" data-mini novalidate></form>
        </div>
      </section>
    `);

    /* Hero console (docked) */
    AV.selector.mount($('#hero-console'), { mode: 'bar', showSaved: true });

    /* Plates */
    const ORDER = ['engine', 'suspension', 'brakes', 'filters', 'cooling', 'electrical', 'fluids', 'body'];
    const LIGHT = new Set(['filters', 'electrical', 'body']);
    const drawPlates = () => AV.render($('[data-plates]'), h`${ORDER.map((id) => ui.plate(get.cat(id), { cls: 'p-' + id + ' reveal', light: LIGHT.has(id) }))}`);
    drawPlates();

    /* Featured */
    let tab = AV.garage.active() ? 'mine' : 'best';
    const TABS = [['mine', 'مناسب خودروی من'], ['best', 'پرفروش‌ها'], ['new', 'جدیدترین‌ها']];
    function drawFeatured() {
      const sel = AV.garage.active();
      AV.render($('[data-feat-tabs]'), h`${TABS.map(([id, fa]) => h`<button type="button" class="tab" role="tab" aria-selected="${String(tab === id)}" data-ftab="${id}">${fa}</button>`)}`);
      let list;
      if (tab === 'mine') {
        if (!sel) {
          return AV.render($('[data-feat]'), ui.empty({ title: 'هنوز خودرویی انتخاب نکرده‌اید', text: 'خودروی خود را انتخاب کنید تا قطعات سازگار با آن را اینجا ببینید.', art: 'car', actions: h`<button type="button" class="btn btn-outline-red" data-open-garage>انتخاب خودروی من</button>` }));
        }
        list = D.products.filter((p) => AV.resolveFit(p, sel).state === 'fits' && !p.universal).sort((a, b) => b.sold - a.sold);
      } else if (tab === 'best') list = [...D.products].sort((a, b) => b.sold - a.sold);
      else list = D.products.filter((p) => p.isNew).concat(D.products.filter((p) => !p.isNew).reverse());
      AV.render($('[data-feat]'), h`<div class="scroller">${list.slice(0, 8).map((p) => ui.card(p))}</div>
        ${tab === 'mine' ? h`<p class="t-small t-meta" style="margin-block-start:20px">${AV.faDigits(list.length)} قطعه سازگار با <bdi>${AV.vehicleLabel(sel, { parts: 'short' })}</bdi> · <a class="link" href="shop.html">مشاهده همه</a></p>` : ''}`);
    }
    $('[data-feat-tabs]').addEventListener('click', (e) => { const b = e.target.closest('[data-ftab]'); if (b) { tab = b.dataset.ftab; drawFeatured(); } });
    $('[data-feat-tabs]').addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const ids = TABS.map((t) => t[0]); let i = ids.indexOf(tab);
      i = (i + (e.key === 'ArrowLeft' ? 1 : -1) + ids.length) % ids.length; // RTL: left = next
      tab = ids[i]; drawFeatured(); $(`[data-ftab="${tab}"]`).focus();
    });
    drawFeatured();

    /* Service plan */
    let km = 40000;
    function drawService() {
      const sel = AV.garage.active();
      const box = $('[data-service]');
      if (!sel) {
        return AV.render(box, h`<div class="service">
          <div class="stack" style="--stack:10px"><span class="eyebrow">برنامه سرویس</span><h2 id="svc-h">سرویس بعدی خودروی شما</h2></div>
          <div class="service-soft"><p>با انتخاب خودرو، برنامه سرویس کیلومتری و کیت قطعات سازگار برای هر مرحله را می‌بینید.</p>
          <button type="button" class="btn btn-outline-red" data-open-garage>${AV.icon('car', { size: 'sm' })}انتخاب خودروی من</button></div></div>`);
      }
      const plan = AV.servicePlan(sel);
      const cur = plan.find((p) => p.km === km) || plan[0];
      const x = AV.vehicleOf(sel);
      AV.render(box, h`<div class="service">
        <div class="stack" style="--stack:16px">
          <div class="stack" style="--stack:10px"><span class="eyebrow">برنامه سرویس</span><h2 id="svc-h">سرویس بعدی <bdi>${x.variant.name}</bdi></h2>
          <p class="t-meta t-small">بر اساس موتور ${x.variant.engLabel}. فاصله‌ها برای رانندگی معمولی است؛ در ترافیک سنگین زودتر سرویس کنید.</p></div>
          <div class="service-tabs" role="tablist" aria-label="مرحله سرویس">${plan.map((p) => h`<button type="button" class="service-tab" role="tab" aria-selected="${String(p.km === cur.km)}" data-km="${p.km}"><span>${p.note}</span><span class="km">${AV.num(p.km)} کیلومتر</span></button>`)}</div>
        </div>
        <div class="service-panel" role="tabpanel">
          <div class="between" style="margin-block-end:8px"><h3 style="font-size:1.25rem">${cur.fa}</h3><span class="latin-label t-meta">KIT · ${AV.num(cur.km)}</span></div>
          <div class="kit-items">${cur.items.map((p) => h`<div class="kit-item"><span class="kit-plus">${AV.icon('check', { size: 'sm', cls: 'ok-ico' })}</span>${ui.media(p.type, { light: true })}
            <div><a class="title" href="${AV.url.product(p)}">${AV.faRaw(p.title)}</a><div class="cluster" style="--gap:8px;margin-block-start:4px">${ui.brandMark(p, 't-meta')}${ui.pn(p.sku, { size: 'sm' })}</div></div>${AV.priceHTML(p.price)}</div>`)}</div>
          ${cur.missing.length ? h`<p class="t-small t-meta" style="margin-block-end:14px">برای این خودرو موجود نیست: ${cur.missing.join('، ')} — <a class="link" href="request.html">درخواست تأمین</a></p>` : ''}
          <div class="kit-total"><div><span class="t-small t-meta">مجموع کیت سرویس · ${AV.faDigits(cur.items.length)} قلم</span><div>${AV.priceHTML(cur.total, 'price-lg')}</div></div>
            <button type="button" class="btn btn-primary" data-add-kit="${cur.items.map((p) => p.sku).join(',')}" ${cur.items.length ? '' : 'disabled'}>${AV.icon('plus')}افزودن کیت سرویس</button></div>
        </div></div>`);
    }
    $('[data-service]').addEventListener('click', (e) => { const b = e.target.closest('[data-km]'); if (b) { km = Number(b.dataset.km); drawService(); $(`[data-km="${km}"]`).focus(); } });
    drawService();

    /* Missing part mini-form */
    const form = $('[data-mini]');
    function drawMini() {
      const sel = AV.garage.active();
      AV.render(form, h`
        <div class="field span-2"><span class="label" id="mini-car-l">خودرو</span>
          <div class="vehicle-box" aria-labelledby="mini-car-l">${sel ? h`<bdi>${AV.vehicleLabel(sel)}</bdi>` : h`<span class="t-meta">خودرویی انتخاب نشده</span>`}
          <button type="button" class="link t-small" data-open-garage>${sel ? 'تغییر' : 'انتخاب خودرو'}</button></div></div>
        <div class="field span-2"><label for="mini-part">کد فنی یا شرح قطعه</label>
          <input id="mini-part" name="part" class="input" placeholder="مثلاً واشر درب سوپاپ یا کد 11127588412" autocomplete="off"></div>
        <div class="field"><label for="mini-mob">شماره موبایل</label>
          <input id="mini-mob" name="mobile" class="input" dir="ltr" inputmode="numeric" autocomplete="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷"></div>
        <div class="field" style="align-content:end"><button type="submit" class="btn btn-primary btn-lg btn-block">درخواست تأمین قطعه</button></div>
        <p class="t-small span-2" style="color:var(--steel)">با ثبت درخواست، کارشناس فنی با شما تماس می‌گیرد. <a class="link" href="request.html">فرم کامل با امکان ارسال عکس</a></p>`);
    }
    drawMini();
    const rules = { part: AV.forms.req('کد فنی یا شرح قطعه'), mobile: AV.forms.mobileRule };
    AV.forms.live(form, rules);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!AV.forms.validate(form, rules)) return;
      const code = AV.trackingCode('RQ');
      const sel = AV.garage.active();
      AV.requests.add({ id: code, date: Date.now(), vehicle: sel, part: form.elements.part.value, mobile: AV.forms.clean(form.elements.mobile.value), status: 'در حال بررسی' });
      AV.render(form, h`<div class="span-2 callout ok" role="status" style="background:var(--graphite-2);color:var(--white)">${AV.icon('check')}<div class="stack" style="--stack:6px">
        <strong>درخواست شما ثبت شد</strong><span>کد پیگیری: <bdi class="code">${code}</bdi></span>
        <span class="t-small" style="color:var(--steel)">کارشناس فنی تا دو ساعت کاری آینده تماس می‌گیرد. وضعیت را در حساب کاربری ببینید.</span></div></div>`);
      AV.announce('درخواست شما ثبت شد. کد پیگیری ' + code);
    });

    AV.on('garage', () => { drawPlates(); if (AV.garage.active() && tab !== 'mine') tab = 'mine'; drawFeatured(); drawService(); if (form.querySelector('.vehicle-box')) drawMini(); AV.reveal(); });
  });
})(window.AV);
