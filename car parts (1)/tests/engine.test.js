/* Unit tests — run: node --test tests/
   Loads the classic browser scripts into a minimal sandbox (no DOM needed). */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function load() {
  const store = new Map();
  const noop = () => {};
  const sandbox = {
    console, Intl, URLSearchParams, EventTarget, CustomEvent: class extends Event { constructor(t, o) { super(t); this.detail = o && o.detail; } }, Event,
    setTimeout, performance,
    localStorage: { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) },
    document: { documentElement: { classList: { remove: noop } }, querySelector: () => null, querySelectorAll: () => [], addEventListener: noop, createElement: () => ({ setAttribute: noop, classList: { add: noop } }), body: { appendChild: noop } },
    location: { search: '', href: 'http://localhost/' },
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  ['core.js', 'data.js', 'articles-meta.js', 'engine.js'].forEach((f) => {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', f), 'utf8'), sandbox, { filename: f });
  });
  return sandbox.AV;
}
const AV = load();
const sel = (variantId, year) => ({ variantId, year });
const P = (sku) => AV.get.product(sku);

/* ---------------- Formatters ---------------- */
test('formatPrice: Persian digits, ٬ separators, تومان suffix with NBSP', () => {
  assert.equal(AV.price(8900000), '۸٬۹۰۰٬۰۰۰ تومان');
  assert.equal(AV.num(1250), '۱٬۲۵۰');
});
test('year: Jalali default, Gregorian secondary for imports', () => {
  assert.equal(AV.year(1402), '۱۴۰۲');
  assert.equal(AV.year(1402, true), '۱۴۰۲ · 2023');
});
test('AV.fa converts plain numbers but keeps Latin codes', () => {
  assert.equal(AV.fa('ضخامت 20.3 میلی‌متر'), 'ضخامت ۲۰٫۳ میلی‌متر');
  assert.equal(AV.fa('هر 10,000 کیلومتر'), 'هر ۱۰٬۰۰۰ کیلومتر');
  assert.equal(AV.fa('روغن 5W-30 برای 330i'), 'روغن 5W-30 برای 330i');
  assert.equal(AV.fa('استاندارد `ECE R90`'), 'استاندارد ECE R90');
});
test('normalize: Arabic chars, digits, ZWNJ, case', () => {
  assert.equal(AV.normalize('ك ي ٢٠٦ ۲۰۶'), 'ک ی 206 206');
  assert.equal(AV.normalize('بی‌ام‌و'), 'بی ام و');
  assert.equal(AV.normalize('BMW'), 'bmw');
  assert.equal(AV.compact('BP-47291'), 'bp47291');
  assert.equal(AV.compact('34 11 6 888 123'), '34116888123');
});

/* ---------------- resolveFit ---------------- */
test('no vehicle → no-vehicle', () => {
  assert.equal(AV.resolveFit(P('BP-47291'), null).state, 'no-vehicle');
});
test('BMW 330i M Sport 1402 → front pads fit, with reasons', () => {
  const r = AV.resolveFit(P('BP-47291'), sel('bmw-330i-ms', 1402));
  assert.equal(r.state, 'fits');
  const keys = r.reasons.map((x) => x.k);
  ['خودرو', 'موتور', 'بازه سال ساخت', 'تیپ', 'محل نصب', 'شماره OEM مرجع'].forEach((k) => assert.ok(keys.includes(k), k));
  assert.equal(r.reasons.find((x) => x.k === 'شماره OEM مرجع').v, '34 11 6 888 123');
});
test('BMW 330i Luxury Line (same engine, other trim) → verify on تیپ', () => {
  const r = AV.resolveFit(P('BP-47291'), sel('bmw-330i-lux', 1402));
  assert.equal(r.state, 'verify');
  assert.equal(r.attr, 'تیپ');
});
test('BMW 320i (different engine) → no-fit', () => {
  assert.equal(AV.resolveFit(P('BP-47291'), sel('bmw-320i', 1402)).state, 'no-fit');
});
test('Peugeot 206 owner: 206 pads fit, BMW pads do not', () => {
  assert.equal(AV.resolveFit(P('BP-20614'), sel('p206-t5', 1395)).state, 'fits');
  assert.equal(AV.resolveFit(P('BP-47291'), sel('p206-t5', 1395)).state, 'no-fit');
});
test('explicit verify (Tara caliper) and explicit no-fit (206 tip 2 disc)', () => {
  const v = AV.resolveFit(P('BP-20614'), sel('tara-mt', 1403));
  assert.equal(v.state, 'verify'); assert.equal(v.attr, 'نوع کالیپر جلو');
  const n = AV.resolveFit(P('BD-20640'), sel('p206-t2', 1398));
  assert.equal(n.state, 'no-fit'); assert.match(n.reasons[1].v, /۲۴۷/);
});
test('universal coolant fits every vehicle', () => {
  AV.data.variants.forEach((v) => assert.equal(AV.resolveFit(P('CO-50001'), sel(v.id, v.to)).state, 'fits'));
});
test('all four states exist in seed data', () => {
  const s = sel('bmw-330i-lux', 1402);
  const states = new Set(AV.data.products.map((p) => AV.resolveFit(p, s).state));
  ['fits', 'verify', 'no-fit'].forEach((x) => assert.ok(states.has(x), x));
});
test('alternatives for a no-fit product are compatible', () => {
  const s = sel('p206-t5', 1395);
  const alts = AV.alternatives(P('BP-47291'), s);
  assert.ok(alts.length >= 1);
  alts.forEach((a) => assert.equal(AV.resolveFit(a, s).state, 'fits'));
  assert.equal(alts[0].type, 'brake-pad');
});
test('every product fitment references real variants; ≥40 products, 16 brands', () => {
  assert.ok(AV.data.products.length >= 40);
  assert.equal(AV.data.brands.length, 16);
  AV.data.products.forEach((p) => (p.fits || []).concat(Object.keys(p.verify || {}), Object.keys(p.noFit || {})).forEach((id) => assert.ok(AV.get.variant(id), `${p.sku} → ${id}`)));
  AV.data.products.forEach((p) => (p.kit || []).forEach((k) => assert.ok(AV.get.product(k), `${p.sku} kit ${k}`)));
});

/* ---------------- Garage ---------------- */
test('garage: add, dedupe, active, max 5', () => {
  const a = AV.garage.add('bmw-330i-ms', 1402);
  assert.ok(a.ok);
  assert.equal(AV.garage.add('bmw-330i-ms', 1402).entry.id, a.entry.id);
  ['p206-t5', 'samand-ef7', 'quick-mt', 'c200'].forEach((v) => AV.garage.add(v, 1400));
  assert.equal(AV.garage.list().length, 5);
  assert.equal(AV.garage.add('t7p', 1402).ok, false);
  AV.garage.setActive(a.entry.id);
  assert.equal(AV.vehicleLabel(AV.garage.active()), 'BMW 330i · ۱۴۰۲ · ۲.۰ توربو · M Sport');
});

/* ---------------- Search: the "must work" list ---------------- */
const top = (q, s = null) => AV.search(q, { sel: s }).products.map((x) => x.p.sku);
test('search: لنت BMW 330i → BP-47291 first', () => assert.equal(top('لنت BMW 330i')[0], 'BP-47291'));
test('search: codes with and without separators', () => {
  ['BP47291', 'BP-47291', 'bp 47291', 'bp-47291', '۳۴۱۱۶۸۸۸۱۲۳'].forEach((q) => assert.equal(top(q)[0], 'BP-47291', q));
  assert.equal(top('34116888123')[0], 'BP-47291');
  assert.equal(top('34 11 6 888 123')[0], 'BP-47291');
});
test('search: لنت جلو 206 / ۲۰۶ → 206 front pads', () => {
  assert.equal(top('لنت جلو 206')[0], 'BP-20614');
  assert.equal(top('لنت جلو ۲۰۶')[0], 'BP-20614');
  assert.ok(top('لنت جلو ۲۰۶').every((s) => AV.get.product(s).type === 'brake-pad'));
});
test('search: برمبو → only BREMBO parts, and brand group', () => {
  const r = AV.search('برمبو', { sel: null });
  assert.ok(r.products.length > 0);
  assert.ok(r.products.every((x) => x.p.brand === 'brembo'));
  assert.equal(r.brands[0].id, 'brembo');
});
test('search: فیلتر روغن سمند → Samand oil filter', () => {
  const r = top('فیلتر روغن سمند');
  assert.equal(r[0], 'OF-12100');
  assert.ok(r.every((s) => AV.get.product(s).type === 'oil-filter'));
});
test('search: Persian aliases for vehicles (پژو ۲۰۶, بی‌ام‌و)', () => {
  assert.ok(AV.search('پژو ۲۰۶', { sel: null }).models.some((m) => m.id === 'peugeot-206'));
  assert.ok(top('لنت بی‌ام‌و 330i').includes('BP-47291'));
});
test('search: typo tolerance (برمبوو, فیلترروغن)', () => {
  assert.ok(AV.search('برمبوو', { sel: null }).products.every((x) => x.p.brand === 'brembo'));
  assert.ok(top('فیلترروغن').length > 0);
});
test('search: cross-reference code TRW GDB2126 → BP-47291', () => assert.equal(top('GDB2126')[0], 'BP-47291'));
test('search: unknown query → empty', () => assert.equal(top('زززززز').length, 0));
test('search is fast (<100ms per query)', () => {
  const t0 = performance.now();
  for (let i = 0; i < 20; i++) AV.search('لنت جلو ۲۰۶', { sel: null });
  assert.ok((performance.now() - t0) / 20 < 100);
});

/* ---------------- VIN-free service plan ---------------- */
test('service plan for BMW 330i has a 10k kit with oil + oil filter', () => {
  const plan = AV.servicePlan(sel('bmw-330i-ms', 1402));
  const k10 = plan.find((p) => p.km === 10000);
  assert.equal(k10.items.map((p) => p.type).sort().join(','), 'engine-oil,oil-filter');
});

/* ---------------- Articles ---------------- */
test('20 articles with metadata', () => assert.equal(AV.articles.length, 20));
