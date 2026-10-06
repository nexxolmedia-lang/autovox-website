/* AUTOVEX engine — fit resolver, garage, cart, orders, search, service plan. */
(function (AV) {
  'use strict';
  const D = AV.data, get = AV.get;

  /* ======================= Vehicle labels ======================= */
  const engShort = (v) => (v.engLabel.split('·')[1] || v.engLabel).trim();
  AV.engShort = engShort;
  /* sel = { variantId, year } */
  AV.vehicleOf = (sel) => {
    if (!sel) return null;
    const variant = get.variant(sel.variantId);
    if (!variant) return null;
    const model = get.model(variant.model), brand = get.vbrand(model.brand);
    return { ...sel, variant, model, brand, isImport: brand.origin === 'import' };
  };
  AV.vehicleLabel = (sel, { parts = 'full' } = {}) => {
    const x = AV.vehicleOf(sel);
    if (!x) return '';
    const y = AV.faDigits(x.year);
    if (parts === 'short') return `${x.variant.name} · ${y}`;
    return `${x.variant.name} · ${y} · ${engShort(x.variant)} · ${x.variant.trim}`;
  };

  /* ======================= Fit resolver ======================= */
  const STATE_COPY = {
    fits: 'مناسب خودروی شما',
    'no-fit': 'با خودروی شما سازگار نیست',
    verify: 'نیاز به بررسی سازگاری',
    'no-vehicle': 'سازگاری را بررسی کنید',
  };
  AV.FIT_COPY = STATE_COPY;
  const POS = { front: 'محور جلو', rear: 'محور عقب', left: 'سمت چپ', right: 'سمت راست', '—': null };
  AV.POS = POS;

  /** Pure: resolveFit(product, sel|null) → { state, reasons[], attr?, note? } */
  AV.resolveFit = (p, sel) => {
    const x = sel ? AV.vehicleOf(sel) : null;
    if (!x) return { state: 'no-vehicle', reasons: [] };
    const v = x.variant;
    const yearTxt = x.isImport ? `${AV.faDigits(x.year)} · ${x.year + 621}` : AV.faDigits(x.year);
    const car = { k: 'خودرو', v: `${v.name} ${yearTxt}` };
    const extra = [];
    if (POS[p.pos]) extra.push({ k: 'محل نصب', v: POS[p.pos], ok: undefined });
    if (p.oem && p.oem.length) extra.push({ k: 'شماره OEM مرجع', v: p.oem[0], code: true, ok: undefined });

    if (p.universal) {
      return {
        state: 'fits', note: p.universalNote,
        reasons: [{ ...car, ok: true }, { k: 'نوع قطعه', v: 'عمومی؛ وابسته به مدل خودرو نیست', ok: true }, ...extra],
      };
    }
    const fitted = (p.fits || []).map(get.variant).filter(Boolean);
    if (p.fitSet.has(v.id)) {
      const inYears = x.year >= v.from && x.year <= v.to;
      const reasons = [
        { ...car, ok: true },
        { k: 'موتور', v: v.engLabel, ok: true },
        { k: 'بازه سال ساخت', v: AV.range(v.from, v.to), ok: inYears ? true : null },
        { k: 'تیپ', v: v.trim + (v.brakes && p.cat === 'brakes' ? ` (${v.brakes})` : ''), ok: true },
        ...extra,
      ];
      if (!inYears) return { state: 'verify', attr: 'سال ساخت', reasons };
      return { state: 'fits', reasons };
    }
    if (p.verify && p.verify[v.id]) {
      const attr = p.verify[v.id];
      return {
        state: 'verify', attr,
        reasons: [{ ...car, ok: true }, { k: 'موتور', v: v.engLabel, ok: true }, { k: attr, v: 'نامشخص؛ نیاز به بررسی با کارشناس', ok: null }, ...extra],
      };
    }
    if (p.noFit && p.noFit[v.id]) {
      return {
        state: 'no-fit', attr: 'مشخصات فنی',
        reasons: [{ ...car, ok: true }, { k: 'مغایرت', v: p.noFit[v.id], ok: false }, ...extra],
      };
    }
    const sameModel = fitted.filter((f) => f.model === v.model);
    if (sameModel.length) {
      const sameEngine = sameModel.filter((f) => f.eng === v.eng);
      if (sameEngine.length) {
        const trims = [...new Set(sameEngine.map((f) => f.trim))].join('، ');
        return {
          state: 'verify', attr: 'تیپ',
          reasons: [
            { ...car, ok: true }, { k: 'موتور', v: v.engLabel, ok: true },
            { k: 'تیپ', v: `${v.trim}؛ این قطعه برای تیپ ${trims} تأیید شده است`, ok: null }, ...extra,
          ],
        };
      }
      const engs = [...new Set(sameModel.map((f) => f.engLabel))].join('، ');
      return {
        state: 'no-fit', attr: 'موتور',
        reasons: [{ ...car, ok: true }, { k: 'موتور', v: `${v.engLabel}؛ این قطعه برای ${engs} است`, ok: false }, ...extra],
      };
    }
    const names = [...new Set(fitted.map((f) => get.model(f.model).fa))].slice(0, 3).join('، ');
    return {
      state: 'no-fit', attr: 'مدل',
      reasons: [{ ...car, ok: false, v: `${v.name}؛ این قطعه برای ${names || 'خودروهای دیگر'} است` }, ...extra],
    };
  };

  AV.fitFor = (p) => AV.resolveFit(p, AV.garage.active());
  AV.fitsActive = (p) => AV.fitFor(p).state === 'fits';
  AV.alternatives = (p, sel, n = 3) => {
    if (!sel) return [];
    const pool = D.products.filter((q) => q.sku !== p.sku && AV.resolveFit(q, sel).state === 'fits');
    const same = pool.filter((q) => q.type === p.type);
    const cat = pool.filter((q) => q.type !== p.type && q.cat === p.cat);
    return [...same, ...cat].sort((a, b) => b.sold - a.sold).slice(0, n);
  };
  AV.compatibleVariants = (p) => p.universal ? D.variants : (p.fits || []).map(get.variant).filter(Boolean);

  /* ======================= Garage (multi-vehicle, max 5) ======================= */
  const GKEY = 'garage';
  const readG = () => AV.storage.get(GKEY, { list: [], active: null });
  const writeG = (g) => { AV.storage.set(GKEY, g); AV.emit('garage', g); };
  AV.garage = {
    MAX: 5,
    list: () => readG().list.filter((e) => get.variant(e.variantId)),
    active: () => { const g = readG(); return g.list.find((e) => e.id === g.active && get.variant(e.variantId)) || null; },
    add(variantId, year, nick = '') {
      const g = readG();
      const dup = g.list.find((e) => e.variantId === variantId && e.year === year);
      if (dup) { g.active = dup.id; writeG(g); return { ok: true, entry: dup }; }
      if (g.list.length >= this.MAX) return { ok: false, reason: 'full' };
      const entry = { id: AV.uid('car'), variantId, year: Number(year), nick, added: Date.now() };
      g.list.push(entry); g.active = entry.id; writeG(g);
      return { ok: true, entry };
    },
    setActive(id) { const g = readG(); if (g.list.some((e) => e.id === id)) { g.active = id; writeG(g); } },
    remove(id) {
      const g = readG(); g.list = g.list.filter((e) => e.id !== id);
      if (g.active === id) g.active = g.list.length ? g.list[g.list.length - 1].id : null;
      writeG(g);
    },
    rename(id, nick) { const g = readG(); const e = g.list.find((x) => x.id === id); if (e) { e.nick = nick; writeG(g); } },
    clearActive() { const g = readG(); g.active = null; writeG(g); },
  };

  /* ======================= Cart ======================= */
  const readC = () => AV.storage.get('cart', []).filter((l) => get.product(l.sku));
  const writeC = (c) => { AV.storage.set('cart', c); AV.emit('cart', c); };
  AV.cart = {
    lines: () => readC().map((l) => ({ ...l, p: get.product(l.sku) })),
    count: () => readC().reduce((s, l) => s + l.qty, 0),
    qtyOf: (sku) => (readC().find((l) => l.sku === sku) || {}).qty || 0,
    add(sku, qty = 1) {
      const p = get.product(sku); if (!p || p.stock <= 0) return false;
      const c = readC(); const l = c.find((x) => x.sku === sku);
      if (l) l.qty = Math.min(p.stock, l.qty + qty); else c.push({ sku, qty: Math.min(p.stock, qty) });
      writeC(c); return true;
    },
    addMany(skus) { skus.forEach((s) => { const p = get.product(s); if (p && p.stock > 0 && !this.qtyOf(s)) this.add(s, 1); }); },
    set(sku, qty) {
      const c = readC(); const l = c.find((x) => x.sku === sku); if (!l) return;
      const p = get.product(sku); l.qty = Math.max(1, Math.min(p.stock, qty)); writeC(c);
    },
    remove(sku) { writeC(readC().filter((l) => l.sku !== sku)); },
    clear() { writeC([]); },
    subtotal: () => readC().reduce((s, l) => s + get.product(l.sku).price * l.qty, 0),
    promo: () => AV.storage.get('promo', null),
    setPromo(code) {
      const c = AV.normalize(code).toUpperCase().replace(/\s/g, '');
      if (c === 'FIT10') { AV.storage.set('promo', { code: 'FIT10', pct: 10, cap: 2000000 }); AV.emit('cart'); return true; }
      return false;
    },
    clearPromo() { AV.storage.del('promo'); AV.emit('cart'); },
    totals(shipKey = 'standard') {
      const sub = this.subtotal();
      const ship = AV.SHIPPING[shipKey] || AV.SHIPPING.standard;
      const shipping = sub === 0 ? 0 : (shipKey === 'standard' && sub >= AV.FREE_SHIP ? 0 : ship.price);
      const pr = this.promo();
      const discount = pr ? Math.min(Math.round(sub * pr.pct / 100 / 1000) * 1000, pr.cap) : 0;
      return { sub, shipping, discount, total: sub + shipping - discount };
    },
  };
  AV.FREE_SHIP = 10000000;
  AV.SHIPPING = {
    standard: { fa: 'ارسال عادی', eta: '۲ تا ۴ روز کاری', price: 290000 },
    express: { fa: 'ارسال فوری (تهران)', eta: 'همان روز تا ساعت ۲۱', price: 650000 },
    pickup: { fa: 'تحویل حضوری از انبار', eta: 'از فردا، ۹ تا ۱۸', price: 0 },
  };

  /* ======================= Recently viewed / searches / orders / requests / account ======================= */
  AV.recent = {
    list: () => AV.storage.get('recent', []).filter((s) => get.product(s)),
    push(sku) { const l = AV.recent.list().filter((s) => s !== sku); l.unshift(sku); AV.storage.set('recent', l.slice(0, 8)); },
  };
  AV.searches = {
    list: () => AV.storage.get('searches', []),
    push(q) { q = String(q).trim(); if (q.length < 2) return; const l = AV.searches.list().filter((s) => s !== q); l.unshift(q); AV.storage.set('searches', l.slice(0, 6)); },
    clear: () => AV.storage.set('searches', []),
  };
  AV.orders = {
    list: () => AV.storage.get('orders', []),
    get: (id) => AV.orders.list().find((o) => o.id === id),
    add(o) { const l = AV.orders.list(); l.unshift(o); AV.storage.set('orders', l.slice(0, 30)); },
  };
  AV.requests = {
    list: () => AV.storage.get('requests', []),
    add(r) { const l = AV.requests.list(); l.unshift(r); AV.storage.set('requests', l.slice(0, 30)); },
  };
  AV.account = {
    get: () => AV.storage.get('account', null),
    set(a) { AV.storage.set('account', a); AV.emit('account', a); },
    logout() { AV.storage.del('account'); AV.emit('account', null); },
  };
  AV.addresses = {
    list: () => AV.storage.get('addresses', []),
    save(list) { AV.storage.set('addresses', list); },
  };
  AV.trackingCode = (prefix) => `${prefix}-${String(Date.now()).slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

  /* ======================= Service plan ======================= */
  AV.servicePlan = (sel) => {
    if (!sel || !AV.vehicleOf(sel)) return [];
    return D.service.map((it) => {
      const items = it.types.map((t) => D.products
        .filter((p) => p.type === t && p.stock > 0 && AV.resolveFit(p, sel).state === 'fits')
        .sort((a, b) => (b.universal ? -1 : 0) - (a.universal ? -1 : 0) || b.sold - a.sold)[0]).filter(Boolean);
      const missing = it.types.filter((t) => !items.some((p) => p.type === t)).map((t) => get.type(t).fa);
      return { ...it, items, missing, total: items.reduce((s, p) => s + p.price, 0) };
    });
  };

  /* ======================= Search ======================= */
  const N = AV.normalize, C = AV.compact;
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    const m = a.length, n = b.length; let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  AV.lev = lev;
  let DICT, CODES;
  function buildIndex() {
    DICT = [];
    const add = (phrase, kind, id) => { const ph = N(phrase); if (ph) DICT.push({ ph, kind, id }); };
    D.partTypes.forEach((t) => { add(t.fa, 'type', t.id); t.syn.forEach((s) => add(s, 'type', t.id)); });
    D.vehicleBrands.forEach((b) => { add(b.fa, 'vbrand', b.id); add(b.en, 'vbrand', b.id); b.aliases.forEach((s) => add(s, 'vbrand', b.id)); });
    D.models.forEach((m) => { add(m.fa, 'model', m.id); (m.aliases || []).forEach((s) => add(s, 'model', m.id)); });
    add('پژو', 'model', 'peugeot-206');
    D.variants.forEach((v) => (v.aliases || []).forEach((s) => add(s, 'variant', v.id)));
    D.brands.forEach((b) => { add(b.name, 'brand', b.id); add(b.fa, 'brand', b.id); b.aliases.forEach((s) => add(s, 'brand', b.id)); });
    [['جلو', 'front'], ['عقب', 'rear'], ['front', 'front'], ['rear', 'rear']].forEach(([s, id]) => add(s, 'pos', id));
    // de-dupe, longest phrase first
    const seen = new Set();
    DICT = DICT.filter((d) => { const k = d.ph + '|' + d.kind + '|' + d.id; if (seen.has(k)) return false; seen.add(k); return true; })
      .sort((a, b) => b.ph.length - a.ph.length);
    CODES = [];
    D.products.forEach((p) => {
      CODES.push({ c: C(p.sku), sku: p.sku, label: p.sku, kind: 'کد کالا' });
      CODES.push({ c: C(p.mpn), sku: p.sku, label: p.mpn, kind: 'کد سازنده' });
      p.oem.forEach((o) => CODES.push({ c: C(o), sku: p.sku, label: o, kind: 'OEM' }));
      p.cross.forEach((o) => CODES.push({ c: C(o), sku: p.sku, label: o, kind: 'معادل' }));
      p.cross.forEach((o) => { const parts = o.split(' '); if (parts.length > 1) CODES.push({ c: C(parts.slice(1).join(' ')), sku: p.sku, label: o, kind: 'معادل' }); });
      p._hay = N([p.title, get.type(p.type).fa, get.brand(p.brand).name, get.brand(p.brand).fa, get.cat(p.cat).fa].join(' '));
    });
  }

  AV.parseQuery = (raw) => {
    if (!DICT) buildIndex();
    const q = N(raw);
    const out = { q, types: new Set(), vbrands: new Set(), models: new Set(), variants: new Set(), brands: new Set(), pos: null, free: [], codeHits: [], fuzzy: [] };
    if (!q) return out;
    // 1) code match on the whole query, then on each token
    const cq = C(raw);
    const codeScan = (c) => {
      if (c.length < 4 || !/\d/.test(c)) return;
      CODES.forEach((x) => {
        if (x.c === c) out.codeHits.push({ ...x, exact: true });
        else if (c.length >= 5 && x.c.startsWith(c)) out.codeHits.push({ ...x, exact: false });
      });
    };
    codeScan(cq);
    // 2) phrase classification (longest first)
    let rest = ` ${q} `;
    DICT.forEach((d) => {
      const needle = ` ${d.ph} `;
      if (rest.includes(needle)) {
        rest = rest.replace(needle, ' ');
        if (d.kind === 'pos') out.pos = d.id; else out[d.kind + 's'].add(d.id);
      }
    });
    // Also catch phrases glued without ZWNJ/space: "لنتترمز", "فیلترروغن"
    const glued = rest.trim().split(' ').filter(Boolean);
    const free = [];
    glued.forEach((tok) => {
      if (!out.codeHits.length) codeScan(C(tok));
      const exact = DICT.find((d) => d.ph.replace(/\s/g, '') === tok);
      if (exact) { if (exact.kind === 'pos') out.pos = exact.id; else out[exact.kind + 's'].add(exact.id); return; }
      if (tok.length >= 4 && !/^\d+$/.test(tok)) {
        const lim = tok.length >= 7 ? 2 : 1;
        let best = null;
        DICT.forEach((d) => { if (!d.ph.includes(' ')) { const dist = lev(tok, d.ph); if (dist <= lim && (!best || dist < best.dist)) best = { d, dist }; } });
        if (best && best.d.kind !== 'pos') { out[best.d.kind + 's'].add(best.d.id); out.fuzzy.push({ tok, to: best.d.ph }); return; }
      }
      free.push(tok);
    });
    out.free = free.filter((t) => !out.codeHits.some((h) => h.c.includes(C(t))));
    return out;
  };

  AV.search = (raw, opts = {}) => {
    const pq = AV.parseQuery(raw);
    const res = { parsed: pq, products: [], models: [], brands: [], guides: [] };
    if (!pq.q) return res;
    const sel = opts.sel === undefined ? AV.garage.active() : opts.sel;

    // vehicle constraint → variant ids
    let vset = null;
    if (pq.variants.size) vset = new Set(pq.variants);
    else if (pq.models.size) vset = new Set(D.variants.filter((v) => pq.models.has(v.model)).map((v) => v.id));
    else if (pq.vbrands.size) vset = new Set(D.variants.filter((v) => pq.vbrands.has(get.model(v.model).brand)).map((v) => v.id));
    if (pq.variants.size && pq.vbrands.size) {
      vset = new Set([...vset].filter((id) => pq.vbrands.has(get.model(get.variant(id).model).brand)));
    }
    const exactSkus = new Set(pq.codeHits.filter((h) => h.exact).map((h) => h.sku));
    const prefixSkus = new Set(pq.codeHits.filter((h) => !h.exact).map((h) => h.sku));
    const hasStruct = pq.types.size || vset || pq.brands.size || pq.pos;

    D.products.forEach((p) => {
      let s = 0;
      const code = exactSkus.has(p.sku) ? 1000 : prefixSkus.has(p.sku) ? 600 : 0;
      s += code;
      if (pq.types.size) { if (pq.types.has(p.type)) s += 300; else if (!code) return; }
      if (vset) {
        const hit = p.universal || (p.fits || []).some((id) => vset.has(id));
        if (hit) s += 250 + (pq.variants.size && (p.fits || []).some((id) => pq.variants.has(id)) ? 60 : 0);
        else if (!code) return;
      }
      if (pq.brands.size) { if (pq.brands.has(p.brand)) s += 200; else if (!code) return; }
      if (pq.pos) { if (p.pos === pq.pos) s += 40; else if (p.pos !== '—' && !code) return; }
      let freeHits = 0;
      pq.free.forEach((t) => {
        if (p._hay.includes(t)) { s += 40; freeHits++; }
        else if (t.length >= 4 && p._hay.split(' ').some((w) => lev(w, t) <= 1)) { s += 15; freeHits++; }
      });
      if (!code && !hasStruct && !freeHits) return;
      if (!code && pq.free.length && !hasStruct && freeHits < pq.free.length) return;
      if (sel && AV.resolveFit(p, sel).state === 'fits') s += 30;
      s += Math.min(20, p.sold / 300);
      res.products.push({ p, score: s, code: pq.codeHits.find((h) => h.sku === p.sku) });
    });
    res.products.sort((a, b) => b.score - a.score);

    // vehicles group
    const mset = new Set(pq.models);
    pq.variants.forEach((id) => mset.add(get.variant(id).model));
    if (pq.vbrands.size && !mset.size) D.models.filter((m) => pq.vbrands.has(m.brand)).forEach((m) => mset.add(m.id));
    pq.free.forEach((t) => D.models.forEach((m) => { if (N(m.fa).includes(t)) mset.add(m.id); }));
    res.models = [...mset].map(get.model).filter(Boolean).slice(0, 6);
    // brands group
    const bset = new Set(pq.brands);
    pq.free.forEach((t) => D.brands.forEach((b) => { if (N(b.name).includes(t) || N(b.fa).includes(t)) bset.add(b.id); }));
    res.brands = [...bset].map(get.brand).slice(0, 4);
    // guides
    if (AV.articles) {
      const words = [...pq.free, ...[...pq.types].map((t) => N(get.type(t).fa))];
      const typeIds = new Set(pq.types);
      res.guides = AV.articles.filter((a) => {
        const hay = N(a.title + ' ' + (a.tags || []).join(' '));
        return (a.types || []).some((t) => typeIds.has(t)) || words.some((w) => w.length > 2 && hay.includes(w));
      }).slice(0, 4);
    }
    return res;
  };

  AV.rebuildSearchIndex = buildIndex;
})(window.AV);
