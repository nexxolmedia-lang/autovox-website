/* AUTOVEX listing — FIT toggle, faceted filters (sidebar / bottom sheet),
   removable chips, sort, skeleton, "load more", URL state. Section 11.2. */
(function (AV) {
  'use strict';
  const h = AV.html, ui = AV.ui, D = AV.data, get = AV.get, $ = AV.$;
  const PAGE = 12;
  const SORTS = [['rel', 'مرتبط‌ترین'], ['fit', 'سازگاری'], ['cheap', 'ارزان‌ترین'], ['exp', 'گران‌ترین'], ['best', 'پرفروش']];
  const FIT_ORDER = { fits: 0, verify: 1, 'no-vehicle': 2, 'no-fit': 3 };

  AV.listing = (root, cfg) => {
    const P = new URLSearchParams(location.search);
    const list = (k) => (P.get(k) ? P.get(k).split(',').filter(Boolean) : []);
    const st = {
      fit: P.has('fit') ? P.get('fit') === '1' : cfg.fitDefault !== false,
      cat: cfg.lock && cfg.lock.cat ? [] : list('cat'),
      type: cfg.lock && cfg.lock.type ? [] : list('type'),
      brand: cfg.lock && cfg.lock.brand ? [] : list('brand'),
      origin: list('origin'), pos: list('pos'),
      stock: P.get('stock') === '1', rating: P.get('rating') === '4',
      min: P.get('min') || '', max: P.get('max') || '',
      sort: P.get('sort') || (cfg.scores ? 'rel' : 'best'),
      shown: PAGE, loading: true,
    };
    const base = () => cfg.base();
    const scoreOf = (p) => (cfg.scores ? cfg.scores().get(p.sku) || 0 : p.sold);
    const num = (v) => Number(AV.latinDigits(String(v).replace(/[٬,\s]/g, ''))) || 0;

    function apply(items, skip) {
      const sel = AV.garage.active();
      return items.filter((p) => {
        if (st.fit && sel && skip !== 'fit' && AV.resolveFit(p, sel).state !== 'fits') return false;
        if (st.cat.length && skip !== 'cat' && !st.cat.includes(p.cat)) return false;
        if (st.type.length && skip !== 'type' && !st.type.includes(p.type)) return false;
        if (st.brand.length && skip !== 'brand' && !st.brand.includes(p.brand)) return false;
        if (st.origin.length && skip !== 'origin' && !st.origin.includes(p.origin)) return false;
        if (st.pos.length && skip !== 'pos' && !st.pos.includes(p.pos)) return false;
        if (st.stock && p.stock <= 0) return false;
        if (st.rating && p.rating < 4) return false;
        if (st.min && p.price < num(st.min)) return false;
        if (st.max && p.price > num(st.max)) return false;
        return true;
      });
    }
    function sorted(items) {
      const sel = AV.garage.active();
      const arr = [...items];
      const by = {
        rel: (a, b) => scoreOf(b) - scoreOf(a),
        best: (a, b) => b.sold - a.sold,
        cheap: (a, b) => a.price - b.price,
        exp: (a, b) => b.price - a.price,
        fit: (a, b) => FIT_ORDER[AV.resolveFit(a, sel).state] - FIT_ORDER[AV.resolveFit(b, sel).state] || b.sold - a.sold,
      }[st.sort] || ((a, b) => b.sold - a.sold);
      return arr.sort(by);
    }
    function syncURL() {
      const q = new URLSearchParams(location.search);
      const set = (k, v) => { if (v && (!Array.isArray(v) || v.length)) q.set(k, Array.isArray(v) ? v.join(',') : v); else q.delete(k); };
      set('cat', st.cat); set('type', st.type); set('brand', st.brand); set('origin', st.origin); set('pos', st.pos);
      set('stock', st.stock ? '1' : ''); set('rating', st.rating ? '4' : ''); set('min', st.min); set('max', st.max);
      set('sort', st.sort === (cfg.scores ? 'rel' : 'best') ? '' : st.sort);
      if (AV.garage.active() && st.fit !== (cfg.fitDefault !== false)) q.set('fit', st.fit ? '1' : '0'); else q.delete('fit');
      const s = q.toString();
      history.replaceState(null, '', location.pathname + (s ? '?' + s : '') + location.hash);
    }

    /* ---------- Facets ---------- */
    function facet(key, title, options, open = true) {
      const pool = apply(base(), key);
      const rows = options.map(([val, label]) => ({ val, label, n: pool.filter((p) => (key === 'cat' ? p.cat : key === 'type' ? p.type : key === 'brand' ? p.brand : key === 'origin' ? p.origin : p.pos) === val).length }))
        .filter((r) => r.n || st[key].includes(r.val));
      if (!rows.length) return '';
      return h`<details class="f-group" ${open ? 'open' : ''}><summary>${title}${AV.icon('chevron-down', { size: 'sm' })}</summary>
        <div class="f-body">${rows.map((r) => h`<label class="check"><input type="checkbox" data-f="${key}" value="${r.val}" ${st[key].includes(r.val) ? 'checked' : ''}><span>${r.label}</span><span class="f-count">${AV.faDigits(r.n)}</span></label>`)}</div></details>`;
    }
    function filtersHTML() {
      const sel = AV.garage.active();
      const lock = cfg.lock || {};
      const types = D.partTypes.filter((t) => (!st.cat.length || st.cat.includes(t.cat)) && (!lock.cat || t.cat === lock.cat));
      return h`
        <div class="stack" style="--stack:12px;margin-block-end:8px">
          ${sel ? h`<label class="fit-toggle ${st.fit ? '' : 'is-off'}"><span>فقط قطعات سازگار با خودروی من</span>
              <span class="switch"><input type="checkbox" data-fit ${st.fit ? 'checked' : ''}><span class="track"></span></span></label>`
            : h`<div class="fit-toggle is-off" style="display:grid;gap:10px"><span>فقط قطعات سازگار با خودروی من</span>
              <span class="t-small t-meta">برای فعال شدن، ابتدا خودروی خود را انتخاب کنید.</span>
              <button type="button" class="btn btn-outline-red btn-sm" data-open-garage>${AV.icon('car', { size: 'sm' })}انتخاب خودروی من</button></div>`}
        </div>
        <details class="f-group" open><summary>خودرو${AV.icon('chevron-down', { size: 'sm' })}</summary>
          <div class="f-body">${sel ? h`<div class="between" style="padding-block:6px"><span class="t-small"><bdi>${AV.vehicleLabel(sel)}</bdi></span><button type="button" class="link t-small" data-open-garage>تغییر</button></div>` : h`<button type="button" class="link t-small" data-open-garage style="justify-self:start">انتخاب خودرو</button>`}</div></details>
        ${lock.cat ? '' : facet('cat', 'دسته‌بندی', D.categories.map((c) => [c.id, c.fa]))}
        ${lock.type ? '' : facet('type', 'نوع قطعه', types.map((t) => [t.id, t.fa]), !!st.type.length || !!lock.cat)}
        ${lock.brand ? '' : facet('brand', 'برند', D.brands.map((b) => [b.id, AV.raw(`<bdi>${AV.esc(b.name)}</bdi>`)]))}
        <details class="f-group" ${st.min || st.max ? 'open' : ''}><summary>محدوده قیمت (تومان)${AV.icon('chevron-down', { size: 'sm' })}</summary>
          <div class="f-body"><div class="price-range">
            <div class="field"><label class="t-micro" for="${cfg.id}-min">از</label><input id="${cfg.id}-min" class="input" inputmode="numeric" data-price="min" value="${st.min ? AV.num(num(st.min)) : ''}" placeholder="۰"></div>
            <div class="field"><label class="t-micro" for="${cfg.id}-max">تا</label><input id="${cfg.id}-max" class="input" inputmode="numeric" data-price="max" value="${st.max ? AV.num(num(st.max)) : ''}" placeholder="بدون سقف"></div>
          </div></div></details>
        <details class="f-group" open><summary>موجودی و امتیاز${AV.icon('chevron-down', { size: 'sm' })}</summary>
          <div class="f-body">
            <label class="check"><input type="checkbox" data-flag="stock" ${st.stock ? 'checked' : ''}><span>فقط کالاهای موجود</span></label>
            <label class="check"><input type="checkbox" data-flag="rating" ${st.rating ? 'checked' : ''}><span>امتیاز ۴ و بالاتر</span></label>
          </div></details>
        ${facet('origin', 'اصلی / افترمارکت', [['oem', 'کیفیت قطعه اصلی (OE)'], ['aftermarket', 'افترمارکت']], !!st.origin.length)}
        ${facet('pos', 'محل نصب', [['front', 'محور جلو'], ['rear', 'محور عقب']], !!st.pos.length)}`;
    }

    /* ---------- Chips ---------- */
    function chipsHTML() {
      const c = [];
      st.cat.forEach((v) => c.push(['cat', v, get.cat(v).fa]));
      st.type.forEach((v) => c.push(['type', v, get.type(v).fa]));
      st.brand.forEach((v) => c.push(['brand', v, get.brand(v).name]));
      st.origin.forEach((v) => c.push(['origin', v, v === 'oem' ? 'قطعه اصلی (OE)' : 'افترمارکت']));
      st.pos.forEach((v) => c.push(['pos', v, AV.POS[v]]));
      if (st.stock) c.push(['stock', '', 'فقط موجود']);
      if (st.rating) c.push(['rating', '', 'امتیاز ۴+']);
      if (st.min) c.push(['min', '', `از ${AV.price(num(st.min))}`]);
      if (st.max) c.push(['max', '', `تا ${AV.price(num(st.max))}`]);
      if (!c.length) return '';
      return h`<div class="chips" aria-label="فیلترهای فعال">${c.map(([k, v, label]) => h`<span class="chip">${label}<button type="button" data-chip="${k}" data-v="${v}" aria-label="حذف فیلتر ${label}">${AV.icon('x', { size: 'sm' })}</button></span>`)}
        <button type="button" class="link t-small" data-clear>پاک کردن همه</button></div>`;
    }

    /* ---------- Render ---------- */
    root.innerHTML = String(h`
      ${cfg.band === false ? '' : h`<header class="page-band"><div class="container">
        ${cfg.crumbs ? ui.crumbs(cfg.crumbs) : ''}
        <h1>${cfg.title}</h1>${cfg.intro ? h`<p class="t-lead">${cfg.intro}</p>` : ''}
        <div data-summary></div></div></header>`}
      <div class="container listing ${cfg.band === false ? 'embedded' : ''}">
        <aside class="filters" aria-label="فیلترها" data-filters></aside>
        <section aria-label="نتایج" style="min-inline-size:0">
          ${cfg.band === false ? h`<div data-summary style="margin-block-end:16px"></div>` : ''}
          <div class="list-tools">
            <button type="button" class="btn btn-outline btn-sm filter-btn" data-open-filters>${AV.icon('filter', { size: 'sm' })}فیلترها <span data-fcount></span></button>
            <span class="t-small t-meta" data-count aria-live="polite"></span>
            <label class="cluster" style="--gap:8px"><span class="t-small t-meta">مرتب‌سازی</span>
              <select class="select" data-sort>${SORTS.map(([v, l]) => h`<option value="${v}" ${st.sort === v ? 'selected' : ''}>${l}</option>`)}</select></label>
          </div>
          <div data-chips></div>
          <div data-grid></div>
        </section>
      </div>`);

    const sheet = document.createElement('div');
    sheet.className = 'sheet surface-light filter-sheet'; sheet.hidden = true; sheet.setAttribute('aria-label', 'فیلترها');
    document.body.appendChild(sheet);

    function draw() {
      const sel = AV.garage.active();
      const all = base();
      const res = sorted(apply(all));
      const fitN = sel ? all.filter((p) => AV.resolveFit(p, sel).state === 'fits').length : 0;
      const summary = sel
        ? h`<div class="fit-summary">${AV.icon('check')}<span><strong>${AV.faDigits(all.length)} قطعه</strong>، ${AV.faDigits(fitN)} مورد سازگار با خودروی شما</span><span class="t-meta t-small"><bdi>${AV.vehicleLabel(sel)}</bdi></span><button type="button" class="link t-small" data-open-garage>تغییر خودرو</button></div>`
        : h`<div class="fit-summary">${AV.icon('car')}<span><strong>${AV.faDigits(all.length)} قطعه</strong> · سازگاری بر اساس خودروی شما نمایش داده می‌شود.</span><button type="button" class="btn btn-outline-red btn-sm" data-open-garage>انتخاب خودروی من</button></div>`;
      root.querySelectorAll('[data-summary]').forEach((el) => AV.render(el, summary));
      const fhtml = filtersHTML();
      AV.render(root.querySelector('[data-filters]'), fhtml);
      if (AV.layer.isOpen(sheet)) drawSheet(res.length);
      AV.render(root.querySelector('[data-chips]'), chipsHTML());
      const activeN = st.cat.length + st.type.length + st.brand.length + st.origin.length + st.pos.length + (st.stock ? 1 : 0) + (st.rating ? 1 : 0) + (st.min ? 1 : 0) + (st.max ? 1 : 0);
      AV.render(root.querySelector('[data-fcount]'), activeN ? `(${AV.faDigits(activeN)})` : '');
      AV.roll(root.querySelector('[data-count]'), `${AV.faDigits(res.length)} نتیجه`);
      const grid = root.querySelector('[data-grid]');
      if (st.loading) {
        AV.render(grid, h`<div class="p-grid cols-4" aria-busy="true">${Array.from({ length: 8 }).map(() => h`<div class="p-card"><div class="skel ratio-1"></div><div class="p-card-body"><div class="skel" style="block-size:12px;inline-size:40%"></div><div class="skel" style="block-size:16px"></div><div class="skel" style="block-size:16px;inline-size:70%"></div><div class="skel" style="block-size:28px;inline-size:50%"></div></div></div>`)}</div>`);
        return;
      }
      if (!res.length) {
        const without = sorted(apply(all, 'fit'));
        AV.render(grid, st.fit && sel && without.length
          ? ui.empty({ title: 'قطعه سازگاری با این فیلترها پیدا نشد', text: `${AV.faDigits(without.length)} قطعه با این فیلترها وجود دارد که با ${AV.vehicleOf(sel).variant.name} سازگار نیست یا نیاز به بررسی دارد.`, art: 'empty',
              actions: h`<button type="button" class="btn btn-outline" data-fit-off>نمایش همه قطعات</button><a class="btn btn-primary" href="request.html">درخواست تأمین قطعه</a>` })
          : ui.empty({ title: 'نتیجه‌ای پیدا نشد', text: 'فیلترها را کم کنید یا کد فنی و مشخصات خودرو را برایمان بفرستید.', art: 'empty',
              actions: h`<button type="button" class="btn btn-outline" data-clear>پاک کردن فیلترها</button><a class="btn btn-primary" href="request.html">درخواست تأمین قطعه</a>` }));
        return;
      }
      const shown = res.slice(0, st.shown);
      AV.render(grid, h`<div class="p-grid cols-4">${shown.map((p) => ui.card(p))}</div>
        <div class="more-wrap">${res.length > st.shown ? h`<p class="t-small t-meta">نمایش ${AV.faDigits(shown.length)} از ${AV.faDigits(res.length)}</p><span class="progress-line" aria-hidden="true"><span style="inline-size:${Math.round(shown.length / res.length * 100)}%"></span></span>
          <button type="button" class="btn btn-outline" data-more>مشاهده بیشتر</button>` : h`<p class="t-small t-meta">همه ${AV.faDigits(res.length)} نتیجه نمایش داده شد.</p>`}</div>`);
      if (cfg.onDraw) cfg.onDraw(res);
    }
    function drawSheet(n) {
      AV.render(sheet, h`<div class="sheet-grip" aria-hidden="true"></div>
        <div class="panel-head"><h2>فیلترها</h2><button type="button" class="btn-icon" data-close-sheet aria-label="بستن">${AV.icon('x')}</button></div>
        <div class="panel-body">${filtersHTML()}</div>
        <div class="panel-foot cluster" style="flex-wrap:nowrap"><button type="button" class="btn btn-ghost" data-clear>پاک کردن</button>
        <button type="button" class="btn btn-primary btn-block" data-close-sheet>نمایش ${AV.faDigits(n)} نتیجه</button></div>`);
    }

    /* ---------- Events (sidebar + sheet share handlers) ---------- */
    function onChange(e) {
      const t = e.target;
      if (t.matches('[data-fit]')) { st.fit = t.checked; AV.announce(st.fit ? 'فقط قطعات سازگار نمایش داده می‌شود' : 'همه قطعات نمایش داده می‌شود'); }
      else if (t.matches('[data-f]')) { const k = t.dataset.f; st[k] = t.checked ? [...st[k], t.value] : st[k].filter((v) => v !== t.value); }
      else if (t.matches('[data-flag]')) st[t.dataset.flag] = t.checked;
      else if (t.matches('[data-price]')) st[t.dataset.price] = String(num(t.value) || '');
      else if (t.matches('[data-sort]')) st.sort = t.value;
      else return;
      st.shown = PAGE; syncURL(); refocus(t, draw);
    }
    function refocus(t, fn) {
      const key = t.dataset.f ? `[data-f="${t.dataset.f}"][value="${t.value}"]` : t.dataset.flag ? `[data-flag="${t.dataset.flag}"]` : t.matches('[data-fit]') ? '[data-fit]' : t.dataset.price ? `[data-price="${t.dataset.price}"]` : t.matches('[data-sort]') ? '[data-sort]' : null;
      const inSheet = sheet.contains(t);
      fn();
      if (key) { const el = (inSheet ? sheet : root).querySelector(key); if (el) el.focus({ preventScroll: true }); }
    }
    function onClick(e) {
      const t = e.target.closest('button'); if (!t) return;
      if (t.hasAttribute('data-more')) { st.shown += PAGE; draw(); const cards = root.querySelectorAll('.p-card'); const f = cards[st.shown - PAGE]; if (f) { const a = f.querySelector('a'); if (a) a.focus({ preventScroll: false }); } }
      else if (t.dataset.chip) {
        const k = t.dataset.chip;
        if (Array.isArray(st[k])) st[k] = st[k].filter((v) => v !== t.dataset.v); else st[k] = k === 'min' || k === 'max' ? '' : false;
        st.shown = PAGE; syncURL(); draw(); const c = root.querySelector('[data-chip]'); (c || root.querySelector('[data-sort]')).focus();
      }
      else if (t.hasAttribute('data-clear')) { Object.assign(st, { cat: [], type: [], brand: [], origin: [], pos: [], stock: false, rating: false, min: '', max: '', shown: PAGE }); syncURL(); draw(); }
      else if (t.hasAttribute('data-fit-off')) { st.fit = false; syncURL(); draw(); }
      else if (t.hasAttribute('data-open-filters')) { drawSheet(sorted(apply(base())).length); AV.layer.open(sheet); }
      else if (t.hasAttribute('data-close-sheet')) AV.layer.close(sheet);
    }
    root.addEventListener('change', onChange); sheet.addEventListener('change', onChange);
    root.addEventListener('click', onClick); sheet.addEventListener('click', onClick);
    AV.on('garage', () => { if (AV.garage.active() && !new URLSearchParams(location.search).has('fit')) st.fit = cfg.fitDefault !== false; st.shown = PAGE; draw(); });

    draw();
    setTimeout(() => { st.loading = false; draw(); AV.reveal(); }, AV.reducedMotion() ? 0 : 180);
    return { state: st, draw, results: () => sorted(apply(base())) };
  };
})(window.AV);
