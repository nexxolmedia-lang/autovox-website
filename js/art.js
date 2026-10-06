/* AUTOVEX technical line drawings — flat 2D strokes, never fake 3D.
   viewBox 0 0 200 200. Classes: s = main stroke, s2 = secondary, d = centerline,
   dim = dimension lines, accent = racing red (rare). */
(function (AV) {
  'use strict';
  const r2 = (n) => Math.round(n * 100) / 100;
  const pt = (cx, cy, r, deg) => {
    const a = (deg - 90) * Math.PI / 180;
    return [r2(cx + r * Math.cos(a)), r2(cy + r * Math.sin(a))];
  };
  const ring = (cx, cy, r, n, hr, off = 0, cls = 's2') => {
    let o = '';
    for (let i = 0; i < n; i++) { const [x, y] = pt(cx, cy, r, off + (360 / n) * i); o += `<circle class="${cls}" cx="${x}" cy="${y}" r="${hr}"/>`; }
    return o;
  };
  const arc = (cx, cy, r, a0, a1) => {
    const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1);
    const large = (a1 - a0) % 360 > 180 ? 1 : 0;
    return `M${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
  };
  const sector = (cx, cy, rO, rI, a0, a1) => {
    const [x0, y0] = pt(cx, cy, rO, a0), [x1, y1] = pt(cx, cy, rO, a1);
    const [x2, y2] = pt(cx, cy, rI, a1), [x3, y3] = pt(cx, cy, rI, a0);
    return `M${x0} ${y0} A${rO} ${rO} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${rI} ${rI} 0 0 0 ${x3} ${y3} Z`;
  };
  const cross = (cx = 100, cy = 100, w = 92) => `<path class="d" d="M${cx} ${cy - w}V${cy + w}M${cx - w} ${cy}H${cx + w}"/>`;

  const A = {};

  A.disc = () => {
    let vents = '';
    for (let i = 0; i < 36; i++) { const [x0, y0] = pt(100, 100, 52, i * 10); const [x1, y1] = pt(100, 100, 74, i * 10 + 6); vents += `<path class="s2" d="M${x0} ${y0}L${x1} ${y1}"/>`; }
    return cross() +
      `<circle class="s" cx="100" cy="100" r="80"/><circle class="s2" cx="100" cy="100" r="76"/>` + vents +
      `<circle class="s" cx="100" cy="100" r="48"/><circle class="s" cx="100" cy="100" r="34"/><circle class="s" cx="100" cy="100" r="13"/>` +
      ring(100, 100, 24, 5, 3.6) +
      `<path class="s" d="${sector(100, 100, 90, 58, 20, 92)}"/>` +
      `<path class="s2" d="${sector(100, 100, 85, 63, 28, 84)}"/>` +
      ring(100, 100, 74, 2, 3, 38, 's') ;
  };

  A.pad = () =>
    `<path class="d" d="M100 40V160"/>` +
    `<path class="s" d="M22 78 L22 66 Q22 58 30 58 L48 58 L52 50 L148 50 L152 58 L170 58 Q178 58 178 66 L178 78 L172 82 L172 112 Q150 146 100 146 Q50 146 28 112 L28 82 Z"/>` +
    `<circle class="s" cx="36" cy="70" r="5"/><circle class="s" cx="164" cy="70" r="5"/>` +
    `<path class="s" d="M44 76 L156 76 L156 106 Q140 132 100 132 Q60 132 44 106 Z"/>` +
    `<path class="s2" d="M96 78V130M104 78V130"/>` +
    `<path class="s2" d="M44 86 L54 76M146 76 L156 86"/>` +
    `<path class="s" d="M150 120 q14 10 26 4 q10 -6 18 2"/><rect class="s" x="186" y="122" width="10" height="8" rx="1"/>`;

  A.sensor = () =>
    `<path class="s" d="M30 150 C 60 150, 70 110, 100 110 S 140 70, 170 70"/>` +
    `<path class="s2" d="M30 156 C 60 156, 72 116, 100 116 S 142 76, 170 76"/>` +
    `<rect class="s" x="14" y="140" width="22" height="26" rx="2"/><path class="s2" d="M18 148h14M18 156h14"/>` +
    `<path class="s" d="M168 60 h16 v26 h-16 z"/><path class="s" d="M184 66 h8 v14 h-8"/>` +
    `<circle class="s" cx="100" cy="113" r="6"/>`;

  A.filter = () =>
    `<path class="d" d="M100 24V182"/>` +
    `<ellipse class="s" cx="100" cy="48" rx="46" ry="12"/>` +
    `<path class="s" d="M54 48 V150 Q54 166 100 166 Q146 166 146 150 V48"/>` +
    (() => { let o = ''; for (let i = 0; i < 9; i++) { const x = 62 + i * 9.5; o += `<path class="s2" d="M${x} ${57 + Math.abs(4 - i) * 0.6}V78"/>`; } return o; })() +
    `<path class="s2" d="M54 92 Q100 104 146 92M54 132 Q100 144 146 132"/>` +
    `<ellipse class="s2" cx="100" cy="48" rx="16" ry="4"/><ellipse class="s2" cx="100" cy="48" rx="30" ry="7.5"/>`;

  A.airfilter = () => {
    let z = 'M34 74';
    for (let i = 0; i < 16; i++) z += ` L${38 + i * 8.3} ${i % 2 ? 74 : 130}`;
    return `<path class="s" d="M20 66 H180 V138 H20 Z"/><path class="s2" d="M26 70 H174 V134 H26 Z"/>` +
      `<path class="s" d="${z}"/>` +
      `<path class="s" d="M20 66 L34 52 H194 L180 66M180 138 L194 124 V52"/>` +
      `<path class="d" d="M100 40V160"/>`;
  };

  A.cabin = () => {
    let z = 'M30 80';
    for (let i = 0; i < 18; i++) z += ` L${34 + i * 7.6} ${i % 2 ? 80 : 124}`;
    return `<path class="s" d="M18 70 H182 V134 H18 Z"/><path class="s" d="${z}"/>` +
      `<path class="d" d="M18 102 H182"/><path class="s2" d="M18 70 L30 58 H194 L182 70M182 134 L194 122 V58"/>` +
      `<path class="s2" d="M60 150 h80"/><path class="s2" d="M60 156 h50"/>`;
  };

  A.fuelfilter = () =>
    `<path class="d" d="M10 100H190"/>` +
    `<rect class="s" x="46" y="62" width="108" height="76" rx="10"/>` +
    `<path class="s2" d="M62 62V138M138 62V138"/>` +
    `<path class="s" d="M46 92 H24 V108 H46M154 92 H176 V108 H154"/>` +
    `<path class="s" d="M24 88 V112M176 88 V112"/>` +
    `<path class="s" d="M88 82 l24 0 l-6 -6M112 82"/><path class="s2" d="M82 120 h36"/>`;

  A.plug = () =>
    `<path class="d" d="M100 10V194"/>` +
    `<rect class="s" x="92" y="12" width="16" height="16" rx="2"/>` +
    `<path class="s" d="M88 28 H112 L114 96 H86 Z"/>` +
    (() => { let o = ''; for (let i = 0; i < 5; i++) o += `<path class="s2" d="M87 ${40 + i * 10} Q100 ${44 + i * 10} 113 ${40 + i * 10}"/>`; return o; })() +
    `<path class="s" d="M76 96 H124 V118 H76 Z"/><path class="s2" d="M92 96V118M108 96V118"/>` +
    `<path class="s" d="M84 118 H116 V156 H84 Z"/>` +
    (() => { let o = ''; for (let i = 0; i < 7; i++) o += `<path class="s2" d="M84 ${123 + i * 5} L116 ${126 + i * 5}"/>`; return o; })() +
    `<path class="s" d="M98 156 V172 M86 164 H100 Q108 164 108 174"/>`;

  A.coil = () =>
    `<path class="d" d="M100 14V192"/>` +
    `<path class="s" d="M58 20 H142 V58 H118 V70 H82 V58 H58 Z"/>` +
    `<path class="s" d="M142 30 H166 V48 H142"/><path class="s2" d="M150 34 H160 V44 H150"/>` +
    `<path class="s" d="M86 70 H114 V150 H86 Z"/>` +
    (() => { let o = ''; for (let i = 0; i < 6; i++) o += `<path class="s2" d="M86 ${82 + i * 11} H114"/>`; return o; })() +
    `<path class="s" d="M84 150 Q84 170 92 182 H108 Q116 170 116 150"/>` +
    `<circle class="s" cx="70" cy="38" r="5"/>`;

  A.belt = () =>
    cross(100, 100, 92) +
    `<circle class="s" cx="64" cy="132" r="34"/><circle class="s2" cx="64" cy="132" r="8"/>` +
    `<circle class="s" cx="140" cy="62" r="26"/><circle class="s2" cx="140" cy="62" r="6"/>` +
    `<circle class="s" cx="150" cy="148" r="18"/><circle class="s2" cx="150" cy="148" r="5"/>` +
    `<circle class="s" cx="88" cy="58" r="12"/>` +
    `<path class="s" d="M32 120 L82 50 Q90 42 100 50 L118 48 L162 46 L170 140 L156 165 L80 162 Q40 160 32 140 Z"/>` +
    ring(64, 132, 20, 6, 3) ;

  A.shock = () =>
    `<path class="d" d="M100 6V196"/>` +
    `<rect class="s" x="70" y="12" width="60" height="12" rx="2"/>` +
    `<path class="s" d="M96 24 V96 M104 24 V96"/>` +
    (() => { let o = 'M64 34'; for (let i = 0; i < 9; i++) o += ` L${i % 2 ? 64 : 136} ${40 + i * 7}`; return `<path class="s" d="${o}"/>`; })() +
    `<path class="s" d="M60 32 H140M60 102 H140"/>` +
    `<path class="s" d="M80 96 H120 V176 H80 Z"/><path class="s2" d="M80 110 H120"/>` +
    `<circle class="s" cx="100" cy="184" r="9"/><circle class="s2" cx="100" cy="184" r="4"/>`;

  A.strut = () => A.shock();

  A.link = () =>
    `<path class="d" d="M14 100H186"/>` +
    `<circle class="s" cx="38" cy="100" r="18"/><circle class="s2" cx="38" cy="100" r="9"/>` +
    `<circle class="s" cx="162" cy="100" r="18"/><circle class="s2" cx="162" cy="100" r="9"/>` +
    `<path class="s" d="M56 94 H144 M56 106 H144"/>` +
    `<path class="s" d="M38 82 V60 M32 64 H44 M162 118 V140 M156 136 H168"/>` +
    `<path class="s2" d="M28 60 h20M152 140 h20"/>`;

  A.bush = () =>
    cross() +
    `<circle class="s" cx="100" cy="100" r="72"/><circle class="s" cx="100" cy="100" r="64"/>` +
    `<circle class="s" cx="100" cy="100" r="22"/><circle class="s" cx="100" cy="100" r="14"/>` +
    `<path class="s2" d="${arc(100, 100, 46, 30, 150)} ${arc(100, 100, 36, 30, 150)}"/>` +
    `<path class="s2" d="${arc(100, 100, 46, 210, 330)} ${arc(100, 100, 36, 210, 330)}"/>`;

  A.pump = () => {
    let blades = '';
    for (let i = 0; i < 8; i++) { const [x0, y0] = pt(100, 100, 16, i * 45); const [x1, y1] = pt(100, 100, 52, i * 45 + 28); blades += `<path class="s" d="M${x0} ${y0} Q${pt(100, 100, 40, i * 45 + 2)[0]} ${pt(100, 100, 40, i * 45 + 2)[1]} ${x1} ${y1}"/>`; }
    return cross() + `<circle class="s" cx="100" cy="100" r="76"/><circle class="s2" cx="100" cy="100" r="58"/>` + blades +
      `<circle class="s" cx="100" cy="100" r="14"/>` + ring(100, 100, 68, 6, 4, 0, 's') + `<path class="s" d="M164 60 L186 48 L194 64 L172 76"/>`;
  };

  A.thermostat = () =>
    `<path class="d" d="M100 14V186"/>` +
    `<ellipse class="s" cx="100" cy="70" rx="64" ry="14"/><ellipse class="s2" cx="100" cy="70" rx="48" ry="9"/>` +
    `<path class="s" d="M84 84 V146 H116 V84"/>` +
    (() => { let o = 'M84 92'; for (let i = 0; i < 8; i++) o += ` L${i % 2 ? 84 : 116} ${98 + i * 6}`; return `<path class="s2" d="${o}"/>`; })() +
    `<path class="s" d="M70 40 H130 L120 56 H80 Z"/><path class="s" d="M100 146 V172 M88 172 H112"/>`;

  A.radiator = () => {
    let fins = '';
    for (let i = 0; i < 22; i++) fins += `<path class="s2" d="M${44 + i * 5.4} 50 V150"/>`;
    return `<rect class="s" x="28" y="40" width="144" height="120" rx="2"/>` +
      `<rect class="s" x="16" y="40" width="22" height="120" rx="2"/><rect class="s" x="162" y="40" width="22" height="120" rx="2"/>` + fins +
      `<path class="s" d="M16 60 H4 V74 H16M184 126 H196 V140 H184"/><circle class="s" cx="27" cy="30" r="6"/><path class="s" d="M27 36 V40"/>`;
  };

  A.battery = () =>
    `<rect class="s" x="24" y="62" width="152" height="104" rx="3"/>` +
    `<path class="s" d="M24 82 H176"/>` +
    `<rect class="s" x="46" y="48" width="20" height="14" rx="1"/><rect class="s" x="134" y="48" width="20" height="14" rx="1"/>` +
    `<path class="s" d="M50 104 h12 M56 98 v12 M138 104 h12"/>` +
    `<path class="s2" d="M80 52 Q100 30 120 52"/>` +
    `<path class="s2" d="M40 140 H160 M40 150 H120"/>` +
    `<path class="s accent" d="M96 116 L88 130 H100 L94 144"/>`;

  A.alternator = () => {
    let vents = '';
    for (let i = 0; i < 12; i++) { const [x0, y0] = pt(96, 100, 30, i * 30); const [x1, y1] = pt(96, 100, 52, i * 30 + 10); vents += `<path class="s2" d="M${x0} ${y0}L${x1} ${y1}"/>`; }
    return `<path class="d" d="M10 100H190"/><circle class="s" cx="96" cy="100" r="66"/><circle class="s2" cx="96" cy="100" r="58"/>` + vents +
      `<circle class="s" cx="96" cy="100" r="22"/><rect class="s" x="162" y="84" width="16" height="32" rx="2"/><path class="s" d="M178 90 H190 V110 H178"/>` +
      `<path class="s" d="M96 34 L96 22 L120 22 L120 38"/><circle class="s" cx="108" cy="22" r="0"/>`;
  };

  A.o2 = () =>
    `<path class="d" d="M10 100H190"/>` +
    `<path class="s" d="M40 86 H60 V114 H40 Z"/><path class="s" d="M60 80 H96 V120 H60 Z"/><path class="s2" d="M72 80V120M84 80V120"/>` +
    `<path class="s" d="M96 88 H140 V112 H96"/>` +
    (() => { let o = ''; for (let i = 0; i < 7; i++) o += `<path class="s2" d="M${100 + i * 6} 88 L${103 + i * 6} 112"/>`; return o; })() +
    `<path class="s" d="M140 92 H170 Q176 92 176 100 Q176 108 170 108 H140"/><path class="s2" d="M152 92V108M162 92V108"/>` +
    `<path class="s" d="M40 96 C 20 96, 24 140, 8 150 M40 104 C 26 104, 30 146, 14 156"/>`;

  A.oil = () =>
    `<path class="s" d="M44 50 H120 L156 74 V172 H44 Z"/>` +
    `<path class="s" d="M120 50 V34 H140 V50"/><rect class="s" x="116" y="24" width="28" height="10" rx="1"/>` +
    `<path class="s" d="M60 50 V38 Q60 30 70 30 H96 Q106 30 106 38 V50"/>` +
    `<rect class="s2" x="58" y="96" width="84" height="56"/>` +
    `<path class="s2" d="M66 110 H134 M66 122 H116 M66 134 H124"/>` +
    `<path class="d" d="M44 86 H156"/>`;

  A.coolant = () =>
    `<path class="s" d="M52 60 Q52 46 66 46 H120 Q134 46 134 60 V168 H52 Z"/>` +
    `<path class="s" d="M134 70 Q160 70 160 96 Q160 122 134 122"/><path class="s2" d="M134 82 Q148 82 148 96 Q148 110 134 110"/>` +
    `<rect class="s" x="74" y="30" width="30" height="16" rx="1"/>` +
    `<path class="s2" d="M52 104 H134"/><path class="s2" d="M66 124 h40 M66 136 h28"/>` +
    `<path class="s" d="M93 76 l-6 10 a7 7 0 1 0 12 0 z"/>`;

  A.wiper = () =>
    `<path class="s" d="M14 128 L186 70"/><path class="s" d="M16 136 L188 78"/>` +
    `<path class="s2" d="M14 132 L186 74"/>` +
    `<path class="s" d="M100 100 L118 40 L134 34"/><circle class="s" cx="134" cy="34" r="8"/><circle class="s2" cx="134" cy="34" r="3"/>` +
    `<rect class="s" x="90" y="94" width="22" height="12" rx="2" transform="rotate(-18 101 100)"/>` +
    `<path class="d" d="M10 160 Q100 60 190 160"/>`;

  A.piston = () =>
    `<path class="d" d="M100 8V196"/>` +
    `<path class="s" d="M56 26 H144 V96 Q144 104 136 104 H64 Q56 104 56 96 Z"/>` +
    `<path class="s2" d="M56 38 H144 M56 46 H144 M56 56 H144"/>` +
    `<circle class="s" cx="100" cy="80" r="10"/><circle class="s2" cx="100" cy="80" r="4"/>` +
    `<path class="s" d="M90 88 L84 150 M110 88 L116 150"/>` +
    `<circle class="s" cx="100" cy="164" r="24"/><circle class="s2" cx="100" cy="164" r="14"/>` +
    `<path class="s2" d="M70 164 H130"/>`;

  A.car = () =>
    `<path class="d" d="M6 150H194"/>` +
    `<path class="s" d="M14 132 Q12 118 26 114 L56 106 L82 82 Q90 76 102 76 H138 Q150 76 158 86 L176 108 Q190 112 190 124 V134 Q190 140 184 140 H170"/>` +
    `<path class="s" d="M14 132 V136 Q14 140 20 140 H34M78 140 H134"/>` +
    `<circle class="s" cx="56" cy="140" r="20"/><circle class="s2" cx="56" cy="140" r="10"/>` +
    `<circle class="s" cx="154" cy="140" r="20"/><circle class="s2" cx="154" cy="140" r="10"/>` +
    `<path class="s2" d="M70 106 L90 86 H118 V106 Z M124 86 H140 Q148 86 154 94 L162 106 H124 Z"/>`;

  A.engine = () => A.piston();
  A.brakes = () => A.disc();
  A.suspension = () => A.shock();
  A.filters = () => A.filter();
  A.cooling = () => A.radiator();
  A.electrical = () => A.battery();
  A.fluids = () => A.oil();
  A.body = () => A.wiper();
  A.request = () =>
    `<rect class="s" x="40" y="30" width="120" height="150" rx="2"/>` +
    `<path class="s2" d="M58 60 H142 M58 76 H142 M58 92 H118"/>` +
    `<circle class="s" cx="100" cy="134" r="22"/><path class="s" d="M116 150 L136 170"/>` +
    `<path class="s2" d="M92 134 H108 M100 126 V142"/>`;
  A.empty = () =>
    `<circle class="s" cx="86" cy="86" r="50"/><path class="s" d="M122 122 L170 170"/>` +
    `<path class="d" d="M60 86 H112"/><path class="s2" d="M86 60 V112"/>`;
  A.order = () =>
    `<path class="s" d="M100 20 L170 56 V140 L100 176 L30 140 V56 Z"/><path class="s" d="M30 56 L100 92 L170 56 M100 92 V176"/>` +
    `<path class="s2" d="M65 38 L135 74"/><path class="s accent" d="M118 122 l10 10 l20 -24"/>`;

  /* Hero composition: disc + caliper with dimension lines */
  A.hero = () =>
    A.disc() +
    `<path class="dim" d="M20 196 H180 M20 191 V201 M180 191 V201"/>` +
    `<text x="100" y="192" text-anchor="middle">Ø 348</text>` +
    `<path class="dim" d="M196 20 V180 M191 20 H201 M191 180 H201"/>` +
    `<path class="s accent" d="M${pt(100, 100, 90, 56)[0]} ${pt(100, 100, 90, 56)[1]} L${pt(100, 100, 104, 56)[0]} ${pt(100, 100, 104, 56)[1]}"/>`;

  const ALIAS = {
    'brake-pad': 'pad', 'brake-disc': 'disc', 'wear-sensor': 'sensor', 'oil-filter': 'filter', 'air-filter': 'airfilter',
    'cabin-filter': 'cabin', 'fuel-filter': 'fuelfilter', 'spark-plug': 'plug', 'coil': 'coil', 'timing-belt': 'belt',
    'drive-belt': 'belt', 'shock': 'shock', 'stab-link': 'link', 'bush': 'bush', 'water-pump': 'pump', 'thermostat': 'thermostat',
    'radiator': 'radiator', 'battery': 'battery', 'alternator': 'alternator', 'o2-sensor': 'o2', 'engine-oil': 'oil',
    'coolant': 'coolant', 'wiper': 'wiper',
  };

  AV.art = (key, opts = {}) => {
    const k = ALIAS[key] || key;
    const fn = A[k] || A.empty;
    const vb = opts.vb || '-6 -6 212 212';
    const tf = opts.transform ? `<g transform="${opts.transform}">${fn()}</g>` : fn();
    return AV.raw(`<svg class="art-svg" viewBox="${vb}" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">${tf}</svg>`);
  };

  /* Technical drawing with dimension lines for the product gallery */
  AV.drawing = (key, dims = {}) => {
    const k = ALIAS[key] || key;
    const fn = A[k] || A.empty;
    const w = dims.w ? `<path class="dim" d="M30 214 H190 M30 208 V220 M190 208 V220"/><text x="110" y="209" text-anchor="middle">${AV.esc(dims.w)}</text>` : '';
    const h = dims.h ? `<path class="dim" d="M208 30 V190 M202 30 H214 M202 190 H214"/><text x="214" y="112" text-anchor="start" transform="rotate(90 214 112)">${AV.esc(dims.h)}</text>` : '';
    return AV.raw(`<svg class="art-svg" viewBox="0 0 236 236" aria-hidden="true" focusable="false"><g transform="translate(30 30) scale(0.8)">${fn()}</g>${w}${h}</svg>`);
  };
})(window.AV);
