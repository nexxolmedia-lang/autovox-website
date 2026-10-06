/* AUTOVEX seed catalog. Fictional store; brand names are typographic only.
   Years are Jalali. Digits in Persian strings are converted at render time
   (AV.fa); `backticks` mark Latin code islands. */
(function (AV) {
  'use strict';

  /* ---------------- Vehicle makers ---------------- */
  const vehicleBrands = [
    { id: 'ikco', fa: 'ایران‌خودرو', en: 'IKCO', origin: 'domestic', aliases: ['ایران خودرو', 'ایرانخودرو', 'ikco'] },
    { id: 'saipa', fa: 'سایپا', en: 'SAIPA', origin: 'domestic', aliases: ['saipa'] },
    { id: 'kmc', fa: 'کرمان موتور', en: 'KMC', origin: 'domestic', aliases: ['kmc', 'کی ام سی', 'کرمان موتور'] },
    { id: 'mvm', fa: 'ام‌وی‌ام', en: 'MVM', origin: 'domestic', aliases: ['mvm', 'ام وی ام'] },
    { id: 'fownix', fa: 'فونیکس', en: 'FOWNIX', origin: 'domestic', aliases: ['fownix', 'فونیکس'] },
    { id: 'chery', fa: 'چری', en: 'CHERY', origin: 'domestic', aliases: ['chery', 'چری'] },
    { id: 'jac', fa: 'جک', en: 'JAC', origin: 'domestic', aliases: ['jac', 'جک'] },
    { id: 'hyundai', fa: 'هیوندای', en: 'HYUNDAI', origin: 'import', aliases: ['hyundai', 'هیوندا', 'هیوندایی'] },
    { id: 'kia', fa: 'کیا', en: 'KIA', origin: 'import', aliases: ['kia'] },
    { id: 'toyota', fa: 'تویوتا', en: 'TOYOTA', origin: 'import', aliases: ['toyota'] },
    { id: 'nissan', fa: 'نیسان', en: 'NISSAN', origin: 'import', aliases: ['nissan'] },
    { id: 'bmw', fa: 'بی‌ام‌و', en: 'BMW', origin: 'import', aliases: ['bmw', 'بی ام و', 'بیامو', 'ب ام و', 'بی ام دبلیو'] },
    { id: 'mercedes', fa: 'مرسدس بنز', en: 'MERCEDES-BENZ', origin: 'import', aliases: ['mercedes', 'benz', 'بنز', 'مرسدس', 'mercedes benz'] },
    { id: 'audi', fa: 'آئودی', en: 'AUDI', origin: 'import', aliases: ['audi', 'اودی', 'آئودی', 'ائودی'] },
    { id: 'vw', fa: 'فولکس‌واگن', en: 'VOLKSWAGEN', origin: 'import', aliases: ['vw', 'volkswagen', 'فولکس', 'فولکس واگن'] },
    { id: 'porsche', fa: 'پورشه', en: 'PORSCHE', origin: 'import', aliases: ['porsche'] },
  ];

  /* ---------------- Models ---------------- */
  const models = [
    { id: 'peugeot-206', brand: 'ikco', fa: 'پژو ۲۰۶', aliases: ['206', 'پژو 206', 'peugeot 206', 'پژو۲۰۶', '206 sd'], popular: 1 },
    { id: 'samand', brand: 'ikco', fa: 'سمند', aliases: ['samand', 'سمند ال ایکس', 'سورن'], popular: 2 },
    { id: 'dena', brand: 'ikco', fa: 'دنا', aliases: ['dena', 'دنا پلاس'], popular: 3 },
    { id: 'tara', brand: 'ikco', fa: 'تارا', aliases: ['tara'], popular: 6 },
    { id: 'quick', brand: 'saipa', fa: 'کوییک', aliases: ['quick', 'کوئیک', 'کوییک'], popular: 4 },
    { id: 'shahin', brand: 'saipa', fa: 'شاهین', aliases: ['shahin'], popular: 5 },
    { id: 'kmc-j7', brand: 'kmc', fa: 'KMC J7', aliases: ['j7', 'جی 7', 'جی۷', 'جی هفت'], popular: 8 },
    { id: 'kmc-t8', brand: 'kmc', fa: 'KMC T8', aliases: ['t8', 'تی 8'] },
    { id: 'mvm-x22', brand: 'mvm', fa: 'MVM X22', aliases: ['x22', 'ایکس 22', 'x22 pro'] },
    { id: 'mvm-315', brand: 'mvm', fa: 'MVM 315', aliases: ['315'] },
    { id: 'tiggo-7-pro', brand: 'fownix', fa: 'فونیکس تیگو ۷ پرو', aliases: ['tiggo 7', 'tiggo 7 pro', 'تیگو 7', 'تیگو 7 پرو'] },
    { id: 'tiggo-8-pro', brand: 'chery', fa: 'چری تیگو ۸ پرو', aliases: ['tiggo 8', 'tiggo 8 pro', 'تیگو 8', 'تیگو 8 پرو'] },
    { id: 'jac-s5', brand: 'jac', fa: 'جک S5', aliases: ['s5', 'جک اس 5'] },
    { id: 'elantra', brand: 'hyundai', fa: 'هیوندای النترا', aliases: ['elantra', 'النترا'] },
    { id: 'tucson', brand: 'hyundai', fa: 'هیوندای توسان', aliases: ['tucson', 'توسان', 'ix35'] },
    { id: 'cerato', brand: 'kia', fa: 'کیا سراتو', aliases: ['cerato', 'سراتو'] },
    { id: 'sportage', brand: 'kia', fa: 'کیا اسپورتیج', aliases: ['sportage', 'اسپورتیج', 'اسپورتاژ'] },
    { id: 'corolla', brand: 'toyota', fa: 'تویوتا کرولا', aliases: ['corolla', 'کرولا'] },
    { id: 'x-trail', brand: 'nissan', fa: 'نیسان ایکس‌تریل', aliases: ['x-trail', 'xtrail', 'ایکس تریل', 'ایکستریل'] },
    { id: 'bmw-3', brand: 'bmw', fa: 'BMW سری ۳', aliases: ['سری 3', '3 series', 'g20', 'bmw 3'], popular: 7 },
    { id: 'bmw-5', brand: 'bmw', fa: 'BMW سری ۵', aliases: ['سری 5', '5 series', 'g30', 'bmw 5'] },
    { id: 'bmw-x3', brand: 'bmw', fa: 'BMW X3', aliases: ['x3', 'g01'] },
    { id: 'bmw-x5', brand: 'bmw', fa: 'BMW X5', aliases: ['x5', 'g05'] },
    { id: 'bmw-m3', brand: 'bmw', fa: 'BMW M3', aliases: ['m3', 'g80'] },
    { id: 'bmw-m4', brand: 'bmw', fa: 'BMW M4', aliases: ['m4', 'g82'] },
    { id: 'c-class', brand: 'mercedes', fa: 'مرسدس بنز کلاس C', aliases: ['c class', 'کلاس سی', 'c200', 'w205'] },
    { id: 'audi-a4', brand: 'audi', fa: 'آئودی A4', aliases: ['a4', 'b9'] },
    { id: 'passat', brand: 'vw', fa: 'فولکس‌واگن پاسات', aliases: ['passat', 'پاسات'] },
    { id: 'cayenne', brand: 'porsche', fa: 'پورشه کاین', aliases: ['cayenne', 'کاین', 'کایین'] },
  ];

  /* ---------------- Variants (engine × trim × year range) ---------------- */
  const V = (id, model, name, from, to, eng, engLabel, trim, extra = {}) => ({ id, model, name, from, to, eng, engLabel, trim, ...extra });
  const variants = [
    V('p206-t2', 'peugeot-206', 'پژو ۲۰۶', 1381, 1402, 'TU3', 'TU3 · ۱.۴ لیتر', 'تیپ ۲', { brakes: 'دیسک توپر ۲۴۷ میلی‌متر' }),
    V('p206-t5', 'peugeot-206', 'پژو ۲۰۶', 1384, 1399, 'TU5', 'TU5 · ۱.۶ لیتر', 'تیپ ۵', { brakes: 'دیسک تهویه‌دار ۲۶۶ میلی‌متر' }),
    V('p206-sd', 'peugeot-206', 'پژو ۲۰۶ صندوق‌دار', 1389, 1402, 'TU5', 'TU5 · ۱.۶ لیتر', 'V8', { brakes: 'دیسک تهویه‌دار ۲۶۶ میلی‌متر' }),
    V('samand-xu7', 'samand', 'سمند', 1381, 1393, 'XU7', 'XU7 · ۱.۸ لیتر', 'LX'),
    V('samand-ef7', 'samand', 'سمند', 1389, 1402, 'EF7', 'EF7 · ۱.۷ لیتر', 'LX EF7'),
    V('dena-ef7', 'dena', 'دنا', 1394, 1402, 'EF7', 'EF7 · ۱.۷ لیتر', 'معمولی'),
    V('dena-plus-t', 'dena', 'دنا پلاس', 1398, 1404, 'EF7TC', 'EF7 TC · ۱.۷ توربو', 'توربو'),
    V('tara-mt', 'tara', 'تارا', 1401, 1404, 'TU5P', 'TU5P · ۱.۶ لیتر', 'دستی'),
    V('tara-v4', 'tara', 'تارا', 1402, 1404, 'TU5P', 'TU5P · ۱.۶ لیتر', 'اتوماتیک V4'),
    V('quick-mt', 'quick', 'کوییک', 1396, 1404, 'M15', 'M15 · ۱.۵ لیتر', 'دستی'),
    V('quick-r', 'quick', 'کوییک', 1399, 1404, 'M15', 'M15 · ۱.۵ لیتر', 'اتوماتیک R'),
    V('shahin-g', 'shahin', 'شاهین', 1399, 1404, 'M15', 'M15 · ۱.۵ لیتر', 'G'),
    V('shahin-cvt', 'shahin', 'شاهین', 1402, 1404, 'M15T', 'M15T · ۱.۵ توربو', 'CVT پلاس'),
    V('kmc-j7', 'kmc-j7', 'KMC J7', 1400, 1404, 'HFC4GC', 'HFC4GC · ۱.۶ توربو', 'تیپ کامل'),
    V('kmc-t8', 'kmc-t8', 'KMC T8', 1402, 1404, 'HFC4GB', 'HFC4GB · ۲.۰ توربو', 'دوکابین'),
    V('x22-mt', 'mvm-x22', 'MVM X22', 1396, 1401, 'E4G15', 'E4G15 · ۱.۵ لیتر', 'دستی'),
    V('x22-pro', 'mvm-x22', 'MVM X22 Pro', 1401, 1404, 'E4T15', 'E4T15 · ۱.۵ توربو', 'Pro'),
    V('mvm315-hb', 'mvm-315', 'MVM 315', 1390, 1399, 'SQR477F', 'SQR477F · ۱.۵ لیتر', 'هاچبک'),
    V('mvm315-sd', 'mvm-315', 'MVM 315', 1390, 1399, 'SQR477F', 'SQR477F · ۱.۵ لیتر', 'صندوق‌دار'),
    V('t7p', 'tiggo-7-pro', 'فونیکس تیگو ۷ پرو', 1401, 1404, 'E4T15C', 'E4T15C · ۱.۵ توربو', 'Premium'),
    V('t8p', 'tiggo-8-pro', 'چری تیگو ۸ پرو', 1400, 1404, 'F4J16', 'F4J16 · ۱.۶ توربو', 'Luxury'),
    V('s5-15t', 'jac-s5', 'جک S5', 1395, 1401, 'HFC4GB15T', 'HFC4GB · ۱.۵ توربو', 'دستی'),
    V('s5-20t', 'jac-s5', 'جک S5', 1395, 1401, 'HFC4GA20T', 'HFC4GA · ۲.۰ توربو', 'اتوماتیک'),
    V('elantra-md', 'elantra', 'هیوندای النترا', 1391, 1395, 'G4NB', 'G4NB · ۱.۸ لیتر', 'GLS'),
    V('elantra-ad', 'elantra', 'هیوندای النترا', 1395, 1398, 'G4NA', 'G4NA · ۲.۰ لیتر', 'Limited'),
    V('tucson-20', 'tucson', 'هیوندای توسان', 1394, 1398, 'G4NA', 'G4NA · ۲.۰ لیتر', 'GL'),
    V('tucson-24', 'tucson', 'هیوندای توسان', 1394, 1398, 'G4KJ', 'G4KJ · ۲.۴ لیتر', 'Limited'),
    V('cerato-20', 'cerato', 'کیا سراتو', 1392, 1397, 'G4NA', 'G4NA · ۲.۰ لیتر', 'EX'),
    V('sportage-20', 'sportage', 'کیا اسپورتیج', 1395, 1398, 'G4NA', 'G4NA · ۲.۰ لیتر', 'EX'),
    V('sportage-24', 'sportage', 'کیا اسپورتیج', 1395, 1398, 'G4KJ', 'G4KJ · ۲.۴ لیتر', 'GT Line'),
    V('corolla-18', 'corolla', 'تویوتا کرولا', 1393, 1398, '2ZR-FE', '2ZR-FE · ۱.۸ لیتر', 'GLi'),
    V('xtrail-25', 'x-trail', 'نیسان ایکس‌تریل', 1393, 1398, 'QR25DE', 'QR25DE · ۲.۵ لیتر', 'SL'),
    V('bmw-320i', 'bmw-3', 'BMW 320i', 1398, 1404, 'B48B20M1', 'B48 · ۲.۰ توربو (۱۸۴ اسب)', 'Sport Line', { aliases: ['320i'], brakes: 'ترمز استاندارد ۳۱۲ میلی‌متر' }),
    V('bmw-330i-ms', 'bmw-3', 'BMW 330i', 1398, 1404, 'B48B20O1', 'B48 · ۲.۰ توربو', 'M Sport', { aliases: ['330i'], brakes: 'ترمز بزرگ M Sport' }),
    V('bmw-330i-lux', 'bmw-3', 'BMW 330i', 1398, 1404, 'B48B20O1', 'B48 · ۲.۰ توربو', 'Luxury Line', { aliases: ['330i'], brakes: 'ترمز استاندارد ۳۳۰ میلی‌متر' }),
    V('bmw-530i', 'bmw-5', 'BMW 530i', 1397, 1403, 'B48B20O1', 'B48 · ۲.۰ توربو', 'M Sport', { aliases: ['530i'] }),
    V('bmw-x3-30i', 'bmw-x3', 'BMW X3 xDrive30i', 1397, 1404, 'B48B20O1', 'B48 · ۲.۰ توربو', 'M Sport', { aliases: ['x3 30i', 'xdrive30i'] }),
    V('bmw-x5-40i', 'bmw-x5', 'BMW X5 xDrive40i', 1398, 1404, 'B58B30O1', 'B58 · ۳.۰ توربو', 'M Sport', { aliases: ['x5 40i', 'xdrive40i'] }),
    V('bmw-m3c', 'bmw-m3', 'BMW M3 Competition', 1400, 1404, 'S58B30T0', 'S58 · ۳.۰ توربو دوقلو', 'Competition', { aliases: ['m3 competition'] }),
    V('bmw-m4c', 'bmw-m4', 'BMW M4 Competition', 1400, 1404, 'S58B30T0', 'S58 · ۳.۰ توربو دوقلو', 'Competition', { aliases: ['m4 competition'] }),
    V('c200', 'c-class', 'Mercedes-Benz C200', 1394, 1400, 'M274', 'M274 · ۲.۰ توربو', 'AMG Line', { aliases: ['c200'] }),
    V('a4-40', 'audi-a4', 'Audi A4 40 TFSI', 1396, 1402, 'EA888', 'EA888 · ۲.۰ توربو', 'S line', { aliases: ['40 tfsi'] }),
    V('passat-18', 'passat', 'Volkswagen Passat', 1394, 1398, 'EA888-18', 'EA888 · ۱.۸ توربو', 'Highline'),
    V('cayenne-30', 'cayenne', 'Porsche Cayenne', 1397, 1404, 'EA839', 'EA839 · ۳.۰ توربو', 'Base'),
  ];

  /* ---------------- Systems (categories) & part types ---------------- */
  const categories = [
    { id: 'engine', no: 1, fa: 'موتور', art: 'engine', blurb: 'شمع، کویل، تسمه تایم و اجزای احتراق' },
    { id: 'brakes', no: 2, fa: 'ترمز', art: 'brakes', blurb: 'لنت، دیسک و سنسور سایش' },
    { id: 'suspension', no: 3, fa: 'جلوبندی و تعلیق', art: 'suspension', blurb: 'کمک‌فنر، میل‌موجگیر و بوش' },
    { id: 'filters', no: 4, fa: 'فیلترها', art: 'filters', blurb: 'فیلتر روغن، هوا، کابین و بنزین' },
    { id: 'cooling', no: 5, fa: 'خنک‌کاری', art: 'cooling', blurb: 'واترپمپ، ترموستات و رادیاتور' },
    { id: 'electrical', no: 6, fa: 'برق و الکترونیک', art: 'electrical', blurb: 'باتری، دینام و سنسور اکسیژن' },
    { id: 'fluids', no: 7, fa: 'روغن و مایعات', art: 'fluids', blurb: 'روغن موتور و ضدیخ' },
    { id: 'body', no: 8, fa: 'بدنه و دید', art: 'body', blurb: 'تیغه برف‌پاک‌کن' },
  ];
  const partTypes = [
    { id: 'brake-pad', cat: 'brakes', fa: 'لنت ترمز', syn: ['لنت', 'لنت ترمز', 'brake pad', 'pad', 'لنتترمز'], wear: true },
    { id: 'brake-disc', cat: 'brakes', fa: 'دیسک ترمز', syn: ['دیسک', 'دیسک ترمز', 'brake disc', 'disc', 'rotor'], wear: true },
    { id: 'wear-sensor', cat: 'brakes', fa: 'سنسور سایش لنت', syn: ['سنسور سایش', 'سنسور لنت', 'wear sensor'] },
    { id: 'spark-plug', cat: 'engine', fa: 'شمع', syn: ['شمع', 'شمع موتور', 'spark plug', 'plug'] },
    { id: 'coil', cat: 'engine', fa: 'کویل', syn: ['کویل', 'کوئل', 'coil', 'ignition coil'] },
    { id: 'timing-belt', cat: 'engine', fa: 'کیت تسمه تایم', syn: ['تسمه تایم', 'کیت تایم', 'timing belt', 'تایم'] },
    { id: 'drive-belt', cat: 'engine', fa: 'تسمه دینام', syn: ['تسمه دینام', 'تسمه کولر', 'drive belt', 'تسمه'] },
    { id: 'shock', cat: 'suspension', fa: 'کمک‌فنر', syn: ['کمک فنر', 'کمکفنر', 'کمک', 'shock', 'shock absorber', 'ambortisor'] },
    { id: 'stab-link', cat: 'suspension', fa: 'میل‌موجگیر', syn: ['میل موجگیر', 'موجگیر', 'stabilizer link', 'میلموجگیر'] },
    { id: 'bush', cat: 'suspension', fa: 'بوش طبق', syn: ['بوش طبق', 'بوش لاستیکی', 'bushing', 'طبق'] },
    { id: 'oil-filter', cat: 'filters', fa: 'فیلتر روغن', syn: ['فیلتر روغن', 'oil filter'] },
    { id: 'air-filter', cat: 'filters', fa: 'فیلتر هوا', syn: ['فیلتر هوا', 'air filter'] },
    { id: 'cabin-filter', cat: 'filters', fa: 'فیلتر کابین', syn: ['فیلتر کابین', 'فیلتر اتاق', 'cabin filter', 'فیلتر کولر'] },
    { id: 'fuel-filter', cat: 'filters', fa: 'فیلتر بنزین', syn: ['فیلتر بنزین', 'فیلتر سوخت', 'fuel filter'] },
    { id: 'water-pump', cat: 'cooling', fa: 'واترپمپ', syn: ['واترپمپ', 'واتر پمپ', 'پمپ آب', 'water pump'] },
    { id: 'thermostat', cat: 'cooling', fa: 'ترموستات', syn: ['ترموستات', 'thermostat'] },
    { id: 'radiator', cat: 'cooling', fa: 'رادیاتور', syn: ['رادیاتور', 'رادیات', 'radiator'] },
    { id: 'battery', cat: 'electrical', fa: 'باتری', syn: ['باتری', 'باطری', 'battery'] },
    { id: 'alternator', cat: 'electrical', fa: 'دینام', syn: ['دینام', 'alternator'] },
    { id: 'o2-sensor', cat: 'electrical', fa: 'سنسور اکسیژن', syn: ['سنسور اکسیژن', 'o2', 'oxygen sensor', 'لامبدا'] },
    { id: 'engine-oil', cat: 'fluids', fa: 'روغن موتور', syn: ['روغن موتور', 'روغن', 'engine oil', 'oil'] },
    { id: 'coolant', cat: 'fluids', fa: 'ضدیخ', syn: ['ضدیخ', 'ضد یخ', 'coolant', 'antifreeze'] },
    { id: 'wiper', cat: 'body', fa: 'تیغه برف‌پاک‌کن', syn: ['برف پاک کن', 'برفپاککن', 'تیغه برف پاک کن', 'وایپر', 'wiper'] },
  ];

  /* ---------------- Parts brands (typographic wordmarks only) ---------------- */
  const brands = [
    { id: 'bosch', name: 'BOSCH', fa: 'بوش', country: 'آلمان', aliases: ['bosch', 'بوش', 'بش'], line: 'سامانه‌های برق، احتراق و ترمز؛ از شمع تا باتری.', story: 'یکی از بزرگ‌ترین تأمین‌کنندگان قطعات اصلی خودروسازان اروپایی. در اتووکس بیشتر برای باتری، کویل، سنسورها و تیغه برف‌پاک‌کن انتخاب می‌شود.', specialties: ['باتری', 'سیستم جرقه', 'سنسورها', 'برف‌پاک‌کن'] },
    { id: 'brembo', name: 'BREMBO', fa: 'برمبو', country: 'ایتالیا', aliases: ['brembo', 'برمبو', 'برامبو'], line: 'متخصص سیستم ترمز؛ تأمین‌کننده ترمز خودروهای اسپرت.', story: 'برمبو تمرکز خود را فقط روی ترمز گذاشته است. لنت و دیسک‌های این برند در بسیاری از خودروهای اسپرت، قطعه اولیه کارخانه هستند.', specialties: ['لنت ترمز', 'دیسک ترمز'] },
    { id: 'skf', name: 'SKF', fa: 'اس‌کی‌اف', country: 'سوئد', aliases: ['skf', 'اس کی اف'], line: 'بلبرینگ، واترپمپ و کیت‌های گردنده.', story: 'نام SKF با بلبرینگ گره خورده است. واترپمپ‌ها و کیت‌های گردنده این برند با همان دقت ساخت تولید می‌شوند.', specialties: ['واترپمپ', 'بلبرینگ', 'کیت تایم'] },
    { id: 'valeo', name: 'VALEO', fa: 'والئو', country: 'فرانسه', aliases: ['valeo', 'والئو', 'والیو'], line: 'دینام، رادیاتور، لنت و برف‌پاک‌کن.', story: 'والئو تأمین‌کننده قدیمی خودروسازان فرانسوی است و برای خودروهای پژوپایه داخلی، گزینه‌ای آشناست.', specialties: ['دینام', 'رادیاتور', 'لنت ترمز'] },
    { id: 'ngk', name: 'NGK', fa: 'ان‌جی‌کی', country: 'ژاپن', aliases: ['ngk', 'ان جی کی'], line: 'شمع موتور؛ از نیکل تا ایریدیوم.', story: 'NGK بزرگ‌ترین سازنده شمع موتور جهان است. از شمع‌های نیکلی ساده تا ایریدیوم مخصوص موتورهای توربو.', specialties: ['شمع', 'سنسور اکسیژن'] },
    { id: 'mann', name: 'MANN-FILTER', fa: 'مان فیلتر', country: 'آلمان', aliases: ['mann', 'mann filter', 'mann-filter', 'مان', 'مان فیلتر'], line: 'فیلتر روغن، هوا و کابین با کیفیت قطعه اصلی.', story: 'مان‌فیلتر فقط فیلتر می‌سازد. فیلترهای کابین کربن‌دار این برند ذرات و بو را هم‌زمان می‌گیرند.', specialties: ['فیلتر روغن', 'فیلتر هوا', 'فیلتر کابین'] },
    { id: 'kyb', name: 'KYB', fa: 'کایابا', country: 'ژاپن', aliases: ['kyb', 'kayaba', 'کایابا', 'کی وای بی'], line: 'کمک‌فنر و اجزای تعلیق.', story: 'KYB از بزرگ‌ترین سازندگان کمک‌فنر است و کمک‌های سری Excel-G آن جایگزین مستقیم قطعه اصلی هستند.', specialties: ['کمک‌فنر'] },
    { id: 'gates', name: 'GATES', fa: 'گیتس', country: 'آمریکا', aliases: ['gates', 'گیتس', 'گیتز'], line: 'تسمه تایم، تسمه دینام و کیت‌های تسمه.', story: 'گیتس سازنده تسمه‌های صنعتی و خودرویی است. کیت‌های تایم آن همراه با بلبرینگ هرزگرد و تسمه‌سفت‌کن عرضه می‌شوند.', specialties: ['تسمه تایم', 'تسمه دینام'] },
    { id: 'sachs', name: 'SACHS', fa: 'زاکس', country: 'آلمان', aliases: ['sachs', 'زاکس', 'ساکس'], line: 'کمک‌فنر و کلاچ برای خودروهای اروپایی.', story: 'زاکس تأمین‌کننده قطعات تعلیق و کلاچ بسیاری از خودروهای آلمانی است.', specialties: ['کمک‌فنر', 'کلاچ'] },
    { id: 'trw', name: 'TRW', fa: 'تی‌آر‌دبلیو', country: 'آلمان', aliases: ['trw', 'تی ار دبلیو', 'تی آر دبلیو'], line: 'ترمز و فرمان؛ لنت و دیسک برای خودروهای پرتردد.', story: 'TRW سابقه طولانی در سیستم ترمز و فرمان دارد و برای خودروهای داخلی و آسیایی گزینه‌ای متعادل از نظر قیمت و دوام است.', specialties: ['لنت ترمز', 'دیسک ترمز'] },
    { id: 'denso', name: 'DENSO', fa: 'دنسو', country: 'ژاپن', aliases: ['denso', 'دنسو'], line: 'شمع ایریدیوم، سنسور و قطعات برقی.', story: 'دنسو تأمین‌کننده اصلی خودروسازان ژاپنی است. شمع‌های ایریدیوم آن عمر مفید بالایی دارند.', specialties: ['شمع', 'سنسور'] },
    { id: 'continental', name: 'CONTINENTAL', fa: 'کانتیننتال', country: 'آلمان', aliases: ['continental', 'contitech', 'کانتیننتال', 'کانتی'], line: 'تسمه و کیت تایم (ContiTech).', story: 'بخش ContiTech این برند تسمه تایم و دینام با لاستیک‌های مقاوم به حرارت تولید می‌کند.', specialties: ['تسمه تایم'] },
    { id: 'mahle', name: 'MAHLE', fa: 'ماله', country: 'آلمان', aliases: ['mahle', 'ماله', 'ماهله'], line: 'فیلتر، ترموستات و قطعات داخلی موتور.', story: 'ماله از پیستون تا فیلتر را برای خودروسازان می‌سازد و در فیلتر و ترموستات کیفیت قطعه اصلی دارد.', specialties: ['فیلتر', 'ترموستات'] },
    { id: 'lemforder', name: 'LEMFÖRDER', fa: 'لمفوردر', country: 'آلمان', aliases: ['lemforder', 'lemförder', 'لمفوردر', 'لم فوردر'], line: 'جلوبندی: طبق، بوش، میل‌موجگیر.', story: 'لمفوردر تأمین‌کننده قطعات جلوبندی خودروهای آلمانی است؛ از بوش طبق تا میل‌موجگیر.', specialties: ['میل‌موجگیر', 'بوش', 'طبق'] },
    { id: 'castrol', name: 'CASTROL', fa: 'کاسترول', country: 'بریتانیا', aliases: ['castrol', 'کاسترول'], line: 'روغن موتور و مایعات خودرو.', story: 'روغن‌های کاسترول EDGE برای موتورهای توربو و استانداردهای سخت‌گیرانه خودروسازان اروپایی تأییدیه دارند.', specialties: ['روغن موتور', 'ضدیخ'] },
    { id: 'mobil', name: 'MOBIL', fa: 'موبیل', country: 'آمریکا', aliases: ['mobil', 'موبیل', 'موبیل وان'], line: 'روغن موتور سنتتیک.', story: 'روغن‌های سنتتیک موبیل برای اغلب خودروهای داخلی و آسیایی، تعادل خوبی بین حفاظت و قیمت دارند.', specialties: ['روغن موتور'] },
  ];

  /* ---------------- Products ---------------- */
  const G = (groups) => groups; // readability
  const B48 = ['bmw-320i', 'bmw-330i-ms', 'bmw-330i-lux', 'bmw-530i', 'bmw-x3-30i'];
  const P206 = ['p206-t2', 'p206-t5', 'p206-sd'];
  const EF7 = ['samand-ef7', 'dena-ef7', 'dena-plus-t'];
  const products = [
    {
      sku: 'BP-47291', mpn: 'P 06 103', brand: 'brembo', type: 'brake-pad', title: 'لنت ترمز جلو سرامیکی', price: 8900000, stock: 14,
      origin: 'oem', pos: 'front', oem: ['34 11 6 888 123'], cross: ['TRW GDB2126', 'TEXTAR 2215101'],
      specs: G({ 'جنس و ساخت': [['جنس', 'سرامیکی'], ['محل نصب', 'محور جلو'], ['سنسور سایش', 'دارد (جداگانه)']], 'ابعاد': [['ضخامت لنت', '20.3 میلی‌متر'], ['عرض × ارتفاع', '174 × 70 میلی‌متر']], 'استاندارد': [['استاندارد', '`ECE R90`'], ['شماره OEM', '`34 11 6 888 123`']] }),
      dims: { w: '174 mm', h: '70 mm' }, warranty: 24, fits: ['bmw-330i-ms'], kit: ['BD-34811', 'WS-11872'], rating: 4.8, reviews: 126, sold: 940, tag: 'best',
    },
    {
      sku: 'BD-34811', mpn: '09.D522.13', brand: 'brembo', type: 'brake-disc', title: 'دیسک ترمز جلو تهویه‌دار 348 میلی‌متر (جفت)', price: 21400000, stock: 4,
      origin: 'oem', pos: 'front', oem: ['34 10 6 860 911'], cross: ['ZIMMERMANN 150.3492.20'],
      specs: G({ 'ابعاد': [['قطر', '348 میلی‌متر'], ['ضخامت', '36 میلی‌متر'], ['حداقل ضخامت مجاز', '34 میلی‌متر'], ['وزن هر عدد', '8.2 کیلوگرم']], 'جنس و ساخت': [['نوع', 'تهویه‌دار، دو تکه'], ['جنس', 'چدن خاکستری با پوشش ضدزنگ'], ['محل نصب', 'محور جلو']], 'استاندارد': [['استاندارد', '`ECE R90`']] }),
      dims: { w: 'Ø 348 mm', h: '36 mm' }, warranty: 24, fits: ['bmw-330i-ms'], kit: ['BP-47291', 'WS-11872'], rating: 4.9, reviews: 58, sold: 310,
    },
    {
      sku: 'WS-11872', mpn: '1 987 473 640', brand: 'bosch', type: 'wear-sensor', title: 'سنسور سایش لنت جلو', price: 1650000, stock: 31,
      origin: 'aftermarket', pos: 'front', oem: ['34 35 6 890 789'], cross: ['TEXTAR 98068800'],
      specs: G({ 'جنس و ساخت': [['طول کابل', '715 میلی‌متر'], ['محل نصب', 'محور جلو'], ['نوع اتصال', 'سوکت دوپین']] }),
      warranty: 12, fits: [...B48], kit: ['BP-47291', 'BD-34811'], rating: 4.6, reviews: 41, sold: 520,
    },
    {
      sku: 'BP-20614', mpn: 'GDB1550', brand: 'trw', type: 'brake-pad', title: 'لنت ترمز جلو', price: 1380000, stock: 52,
      origin: 'aftermarket', pos: 'front', oem: ['4253.98'], cross: ['BOSCH 0 986 424 794', 'VALEO 598 486'],
      specs: G({ 'جنس و ساخت': [['جنس', 'نیمه‌فلزی کم‌صدا'], ['محل نصب', 'محور جلو'], ['سنسور سایش', 'ندارد']], 'ابعاد': [['ضخامت لنت', '18.2 میلی‌متر'], ['عرض × ارتفاع', '120 × 54 میلی‌متر']], 'استاندارد': [['استاندارد', '`ECE R90`']] }),
      dims: { w: '120 mm', h: '54 mm' }, warranty: 12, fits: P206, verify: { 'tara-mt': 'نوع کالیپر جلو', 'tara-v4': 'نوع کالیپر جلو' }, kit: ['BD-20640'], rating: 4.5, reviews: 312, sold: 2400, tag: 'best',
    },
    {
      sku: 'BD-20640', mpn: 'DF4036', brand: 'trw', type: 'brake-disc', title: 'دیسک ترمز جلو تهویه‌دار 266 میلی‌متر (جفت)', price: 3950000, stock: 18,
      origin: 'aftermarket', pos: 'front', oem: ['4246.W9'], cross: ['BREMBO 09.8695.11'],
      specs: G({ 'ابعاد': [['قطر', '266 میلی‌متر'], ['ضخامت', '22 میلی‌متر'], ['حداقل ضخامت مجاز', '20 میلی‌متر'], ['وزن هر عدد', '4.9 کیلوگرم']], 'جنس و ساخت': [['نوع', 'تهویه‌دار'], ['محل نصب', 'محور جلو']] }),
      dims: { w: 'Ø 266 mm', h: '22 mm' }, warranty: 12, fits: ['p206-t5', 'p206-sd'], noFit: { 'p206-t2': 'تیپ ۲ دیسک توپر ۲۴۷ میلی‌متری دارد' }, kit: ['BP-20614'], rating: 4.4, reviews: 97, sold: 610,
    },
    {
      sku: 'BP-70711', mpn: '0 986 494 711', brand: 'bosch', type: 'brake-pad', title: 'لنت ترمز جلو', price: 1520000, stock: 40,
      origin: 'aftermarket', pos: 'front', oem: ['S2201030'], cross: ['TRW GDB1688'],
      specs: G({ 'جنس و ساخت': [['جنس', 'سرامیکی کم‌گرد'], ['محل نصب', 'محور جلو']], 'ابعاد': [['ضخامت لنت', '18.8 میلی‌متر'], ['عرض × ارتفاع', '131 × 59 میلی‌متر']], 'استاندارد': [['استاندارد', '`ECE R90`']] }),
      dims: { w: '131 mm', h: '59 mm' }, warranty: 12, fits: ['samand-xu7', ...EF7], rating: 4.5, reviews: 204, sold: 1750, tag: 'best',
    },
    {
      sku: 'BP-11207', mpn: '601 744', brand: 'valeo', type: 'brake-pad', title: 'لنت ترمز جلو', price: 2450000, stock: 22,
      origin: 'aftermarket', pos: 'front', oem: ['3501190U2210'], cross: [],
      specs: G({ 'جنس و ساخت': [['جنس', 'سرامیکی'], ['محل نصب', 'محور جلو']], 'ابعاد': [['ضخامت لنت', '17.5 میلی‌متر']] }),
      warranty: 12, fits: ['kmc-j7'], rating: 4.3, reviews: 38, sold: 260, isNew: true,
    },
    {
      sku: 'BP-30056', mpn: 'P 30 056', brand: 'brembo', type: 'brake-pad', title: 'لنت ترمز جلو', price: 4800000, stock: 16,
      origin: 'aftermarket', pos: 'front', oem: ['58101-D7A00'], cross: ['TRW GDB3576'],
      specs: G({ 'جنس و ساخت': [['جنس', 'سرامیکی'], ['محل نصب', 'محور جلو'], ['سنسور سایش', 'صوتی']], 'ابعاد': [['ضخامت لنت', '17 میلی‌متر'], ['عرض × ارتفاع', '141 × 57 میلی‌متر']], 'استاندارد': [['استاندارد', '`ECE R90`']] }),
      dims: { w: '141 mm', h: '57 mm' }, warranty: 18, fits: ['tucson-20', 'tucson-24', 'sportage-20', 'sportage-24'], rating: 4.7, reviews: 84, sold: 480,
    },
    {
      sku: 'BP-34250', mpn: 'GDB3425', brand: 'trw', type: 'brake-pad', title: 'لنت ترمز جلو', price: 3200000, stock: 11,
      origin: 'aftermarket', pos: 'front', oem: ['04465-02220'], cross: ['DENSO DP-1034'],
      specs: G({ 'جنس و ساخت': [['جنس', 'نیمه‌فلزی'], ['محل نصب', 'محور جلو']], 'ابعاد': [['ضخامت لنت', '17.3 میلی‌متر']] }),
      warranty: 12, fits: ['corolla-18'], rating: 4.4, reviews: 52, sold: 300,
    },
    {
      sku: 'BP-80312', mpn: 'P 06 113', brand: 'brembo', type: 'brake-pad', title: 'لنت ترمز جلو مسابقه‌ای کامپوزیت', price: 24500000, stock: 3,
      origin: 'oem', pos: 'front', oem: ['34 10 8 089 963'], cross: [],
      specs: G({ 'جنس و ساخت': [['جنس', 'کامپوزیت دمای بالا'], ['محل نصب', 'محور جلو'], ['کالیپر', 'شش پیستونه M']], 'ابعاد': [['ضخامت لنت', '17 میلی‌متر']], 'استاندارد': [['استاندارد', '`ECE R90`']] }),
      warranty: 24, fits: ['bmw-m3c', 'bmw-m4c'], rating: 4.9, reviews: 12, sold: 40, isNew: true,
    },
    {
      sku: 'BP-91055', mpn: 'P 65 033', brand: 'brembo', type: 'brake-pad', title: 'لنت ترمز جلو', price: 19800000, stock: 5,
      origin: 'oem', pos: 'front', oem: ['9Y0 698 151 B'], cross: [],
      specs: G({ 'جنس و ساخت': [['جنس', 'سرامیکی کم‌گرد'], ['محل نصب', 'محور جلو'], ['سنسور سایش', 'جداگانه']], 'ابعاد': [['ضخامت لنت', '18 میلی‌متر']] }),
      warranty: 24, fits: ['cayenne-30'], rating: 4.8, reviews: 9, sold: 22,
    },
    {
      sku: 'BP-56210', mpn: 'GDB2263', brand: 'trw', type: 'brake-pad', title: 'لنت ترمز جلو', price: 2100000, stock: 27,
      origin: 'aftermarket', pos: 'front', oem: ['J69-3501080'], cross: [],
      specs: G({ 'جنس و ساخت': [['جنس', 'سرامیکی'], ['محل نصب', 'محور جلو']], 'ابعاد': [['ضخامت لنت', '17.6 میلی‌متر']] }),
      warranty: 12, fits: ['x22-pro', 't7p', 't8p'], rating: 4.4, reviews: 66, sold: 540, isNew: true,
    },
    {
      sku: 'BP-88014', mpn: '601 880', brand: 'valeo', type: 'brake-pad', title: 'لنت ترمز جلو', price: 2900000, stock: 9,
      origin: 'aftermarket', pos: 'front', oem: ['3501250P3010'], cross: [],
      specs: G({ 'جنس و ساخت': [['جنس', 'نیمه‌فلزی سنگین‌کار'], ['محل نصب', 'محور جلو']] }),
      warranty: 12, fits: ['kmc-t8'], rating: 4.2, reviews: 14, sold: 80, isNew: true,
    },
    /* ---- Filters ---- */
    {
      sku: 'OF-60200', mpn: 'HU 6020 z', brand: 'mann', type: 'oil-filter', title: 'فیلتر روغن کارتریجی', price: 1450000, stock: 64,
      origin: 'oem', pos: '—', oem: ['11 42 8 575 211'], cross: ['MAHLE OX 813/1D', 'BOSCH F 026 407 205'],
      specs: G({ 'ابعاد': [['قطر خارجی', '62 میلی‌متر'], ['ارتفاع', '113 میلی‌متر']], 'جنس و ساخت': [['نوع', 'کارتریجی بدون فلز'], ['واشر', 'دارد (اورینگ همراه)']] }),
      dims: { w: 'Ø 62 mm', h: '113 mm' }, warranty: 6, fits: [...B48, 'bmw-x5-40i'], rating: 4.8, reviews: 233, sold: 1820, tag: 'best',
    },
    {
      sku: 'OF-70080', mpn: 'W 7008', brand: 'mann', type: 'oil-filter', title: 'فیلتر روغن', price: 420000, stock: 120,
      origin: 'aftermarket', pos: '—', oem: ['1109.AH'], cross: ['MAHLE OC 467', 'BOSCH 0 451 103 316'],
      specs: G({ 'ابعاد': [['قطر خارجی', '76 میلی‌متر'], ['ارتفاع', '79 میلی‌متر'], ['رزوه', '`M20x1.5`']], 'جنس و ساخت': [['نوع', 'پیچی با سوپاپ ضدبرگشت']] }),
      dims: { w: 'Ø 76 mm', h: '79 mm' }, warranty: 6, fits: [...P206, 'tara-mt', 'tara-v4'], rating: 4.6, reviews: 418, sold: 5100, tag: 'best',
    },
    {
      sku: 'OF-12100', mpn: 'OC 1210', brand: 'mahle', type: 'oil-filter', title: 'فیلتر روغن', price: 390000, stock: 95,
      origin: 'aftermarket', pos: '—', oem: ['EF7-1012010'], cross: ['MANN W 712/94'],
      specs: G({ 'ابعاد': [['قطر خارجی', '76 میلی‌متر'], ['ارتفاع', '86 میلی‌متر'], ['رزوه', '`M20x1.5`']] }),
      dims: { w: 'Ø 76 mm', h: '86 mm' }, warranty: 6, fits: ['samand-xu7', ...EF7], rating: 4.5, reviews: 302, sold: 3900, tag: 'best',
    },
    {
      sku: 'OF-15150', mpn: 'F 026 407 157', brand: 'bosch', type: 'oil-filter', title: 'فیلتر روغن', price: 360000, stock: 88,
      origin: 'aftermarket', pos: '—', oem: ['S1012100'], cross: [],
      specs: G({ 'ابعاد': [['قطر خارجی', '68 میلی‌متر'], ['ارتفاع', '65 میلی‌متر']] }),
      warranty: 6, fits: ['quick-mt', 'quick-r', 'shahin-g', 'shahin-cvt'], rating: 4.4, reviews: 187, sold: 2700,
    },
    {
      sku: 'OF-27411', mpn: 'HU 7010 z', brand: 'mann', type: 'oil-filter', title: 'فیلتر روغن کارتریجی', price: 1980000, stock: 12,
      origin: 'oem', pos: '—', oem: ['A 274 180 00 09'], cross: ['MAHLE OX 982D'],
      specs: G({ 'ابعاد': [['قطر خارجی', '71 میلی‌متر'], ['ارتفاع', '118 میلی‌متر']] }),
      warranty: 6, fits: ['c200'], rating: 4.7, reviews: 21, sold: 120,
    },
    {
      sku: 'OF-88820', mpn: 'OX 1222D', brand: 'mahle', type: 'oil-filter', title: 'فیلتر روغن کارتریجی', price: 1750000, stock: 15,
      origin: 'oem', pos: '—', oem: ['06L 115 562 B'], cross: ['MANN HU 6002 z'],
      specs: G({ 'ابعاد': [['قطر خارجی', '65 میلی‌متر'], ['ارتفاع', '127 میلی‌متر']] }),
      warranty: 6, fits: ['a4-40', 'passat-18'], rating: 4.6, reviews: 18, sold: 95,
    },
    {
      sku: 'OF-21015', mpn: 'F 026 407 210', brand: 'bosch', type: 'oil-filter', title: 'فیلتر روغن', price: 450000, stock: 47,
      origin: 'aftermarket', pos: '—', oem: ['1012100GH010'], cross: [],
      specs: G({ 'ابعاد': [['قطر خارجی', '76 میلی‌متر'], ['ارتفاع', '96 میلی‌متر']] }),
      warranty: 6, fits: ['kmc-j7', 'kmc-t8', 's5-15t', 's5-20t'], rating: 4.3, reviews: 61, sold: 690,
    },
    {
      sku: 'AF-26720', mpn: 'C 2672', brand: 'mann', type: 'air-filter', title: 'فیلتر هوا', price: 540000, stock: 73,
      origin: 'aftermarket', pos: '—', oem: ['1444.TT'], cross: ['MAHLE LX 1599'],
      specs: G({ 'ابعاد': [['طول', '267 میلی‌متر'], ['عرض', '178 میلی‌متر'], ['ارتفاع', '58 میلی‌متر']], 'جنس و ساخت': [['جنس', 'کاغذ سلولزی چندلایه']] }),
      dims: { w: '267 mm', h: '58 mm' }, warranty: 6, fits: P206, rating: 4.5, reviews: 266, sold: 3300, tag: 'best',
    },
    {
      sku: 'AF-77019', mpn: 'F 026 400 719', brand: 'bosch', type: 'air-filter', title: 'فیلتر هوا', price: 480000, stock: 58,
      origin: 'aftermarket', pos: '—', oem: ['EF7-1109010'], cross: [],
      specs: G({ 'ابعاد': [['طول', '246 میلی‌متر'], ['عرض', '186 میلی‌متر'], ['ارتفاع', '52 میلی‌متر']] }),
      warranty: 6, fits: EF7, rating: 4.4, reviews: 140, sold: 1600,
    },
    {
      sku: 'AF-40710', mpn: 'LX 4071', brand: 'mahle', type: 'air-filter', title: 'فیلتر هوا', price: 950000, stock: 20,
      origin: 'aftermarket', pos: '—', oem: ['1109101U1910'], cross: [],
      specs: G({ 'ابعاد': [['طول', '255 میلی‌متر'], ['عرض', '214 میلی‌متر']] }),
      warranty: 6, fits: ['kmc-j7'], rating: 4.3, reviews: 22, sold: 190,
    },
    {
      sku: 'AF-25330', mpn: 'LX 2533', brand: 'mahle', type: 'air-filter', title: 'فیلتر هوا', price: 1250000, stock: 10,
      origin: 'aftermarket', pos: '—', oem: ['16546-JG30A'], cross: ['MANN C 26 003'],
      specs: G({ 'ابعاد': [['طول', '262 میلی‌متر'], ['عرض', '196 میلی‌متر']] }),
      warranty: 6, fits: ['xtrail-25'], rating: 4.5, reviews: 17, sold: 85,
    },
    {
      sku: 'CF-26010', mpn: 'CUK 26 010', brand: 'mann', type: 'cabin-filter', title: 'فیلتر کابین کربن فعال (جفت)', price: 2350000, stock: 26,
      origin: 'oem', pos: '—', oem: ['64 11 9 382 886'], cross: ['MAHLE LAK 1210/S'],
      specs: G({ 'جنس و ساخت': [['لایه‌ها', 'الیاف + کربن فعال'], ['تعداد در بسته', '2 عدد']], 'ابعاد': [['طول', '263 میلی‌متر'], ['عرض', '205 میلی‌متر']] }),
      warranty: 6, fits: B48, rating: 4.7, reviews: 75, sold: 640,
    },
    {
      sku: 'CF-51420', mpn: 'LAK 514', brand: 'mahle', type: 'cabin-filter', title: 'فیلتر کابین کربن فعال', price: 890000, stock: 41,
      origin: 'aftermarket', pos: '—', oem: ['97133-D3000'], cross: ['MANN CUK 24 003'],
      specs: G({ 'جنس و ساخت': [['لایه‌ها', 'الیاف + کربن فعال']], 'ابعاد': [['طول', '240 میلی‌متر'], ['عرض', '200 میلی‌متر']] }),
      warranty: 6, fits: ['tucson-20', 'tucson-24', 'sportage-20', 'sportage-24', 'elantra-ad', 'cerato-20'], rating: 4.6, reviews: 109, sold: 900,
    },
    {
      sku: 'FF-34012', mpn: 'F 026 403 012', brand: 'bosch', type: 'fuel-filter', title: 'فیلتر بنزین', price: 310000, stock: 140,
      origin: 'aftermarket', pos: '—', oem: ['1567.C4'], cross: ['MANN WK 59 x'],
      specs: G({ 'ابعاد': [['قطر', '55 میلی‌متر'], ['طول', '152 میلی‌متر']], 'جنس و ساخت': [['بدنه', 'فلزی']] }),
      warranty: 6, fits: [...P206, 'samand-xu7', ...EF7, 'tara-mt', 'tara-v4'], rating: 4.4, reviews: 155, sold: 2100,
    },
    /* ---- Engine ---- */
    {
      sku: 'SP-60100', mpn: 'BKR6E', brand: 'ngk', type: 'spark-plug', title: 'شمع موتور نیکلی (بسته ۴ عددی)', price: 980000, stock: 90,
      origin: 'aftermarket', pos: '—', oem: ['5960.F0'], cross: ['BOSCH FR7DC+'],
      specs: G({ 'جنس و ساخت': [['الکترود', 'نیکل'], ['تعداد در بسته', '4 عدد'], ['دهانه الکترود', '0.9 میلی‌متر']], 'ابعاد': [['رزوه', '`M14x1.25`'], ['طول رزوه', '19 میلی‌متر'], ['آچارخور', '16 میلی‌متر']] }),
      warranty: 6, fits: [...P206, 'samand-xu7', 'tara-mt', 'tara-v4'], rating: 4.6, reviews: 380, sold: 4200, tag: 'best',
    },
    {
      sku: 'SP-97506', mpn: 'ILZKR8H8S', brand: 'ngk', type: 'spark-plug', title: 'شمع ایریدیوم (بسته ۴ عددی)', price: 5600000, stock: 19,
      origin: 'oem', pos: '—', oem: ['12 12 0 039 664'], cross: ['BOSCH ZR5TPP33'],
      specs: G({ 'جنس و ساخت': [['الکترود', 'ایریدیوم / پلاتین'], ['تعداد در بسته', '4 عدد'], ['دهانه الکترود', '0.8 میلی‌متر']], 'ابعاد': [['رزوه', '`M12x1.25`'], ['آچارخور', '14 میلی‌متر']] }),
      warranty: 12, fits: B48, verify: { 'bmw-x5-40i': 'تعداد سیلندر (موتور شش سیلندر به ۶ عدد نیاز دارد)' }, rating: 4.8, reviews: 64, sold: 410,
    },
    {
      sku: 'SP-20020', mpn: 'IK20TT', brand: 'denso', type: 'spark-plug', title: 'شمع ایریدیوم (بسته ۴ عددی)', price: 3400000, stock: 33,
      origin: 'aftermarket', pos: '—', oem: ['18846-11070'], cross: ['NGK SILZKR7B11'],
      specs: G({ 'جنس و ساخت': [['الکترود', 'ایریدیوم دوقلو'], ['تعداد در بسته', '4 عدد']], 'ابعاد': [['رزوه', '`M14x1.25`']] }),
      warranty: 12, fits: ['elantra-md', 'elantra-ad', 'tucson-20', 'tucson-24', 'cerato-20', 'sportage-20', 'sportage-24'], rating: 4.7, reviews: 92, sold: 520,
    },
    {
      sku: 'IC-22105', mpn: '0 221 504 470', brand: 'bosch', type: 'coil', title: 'کویل دوبل جرقه', price: 2250000, stock: 24,
      origin: 'aftermarket', pos: '—', oem: ['5970.80'], cross: ['VALEO 245 104'],
      specs: G({ 'جنس و ساخت': [['نوع', 'کویل یکپارچه چهار خروجی'], ['تعداد پین', '3']] }),
      warranty: 12, fits: ['p206-t5', 'p206-sd', 'tara-mt', 'tara-v4'], noFit: { 'p206-t2': 'موتور TU3 کویل با سوکت متفاوت دارد' }, rating: 4.5, reviews: 133, sold: 980,
    },
    {
      sku: 'IC-70014', mpn: '0 221 504 014', brand: 'bosch', type: 'coil', title: 'کویل تک‌سیلندری', price: 2600000, stock: 30,
      origin: 'aftermarket', pos: '—', oem: ['EF7-3705010'], cross: [],
      specs: G({ 'جنس و ساخت': [['نوع', 'مدادی تک‌سیلندری'], ['تعداد در بسته', '1 عدد']] }),
      warranty: 12, fits: EF7, rating: 4.4, reviews: 88, sold: 760,
    },
    {
      sku: 'TB-15580', mpn: 'K015580XS', brand: 'gates', type: 'timing-belt', title: 'کیت تسمه تایم با هرزگرد و تسمه‌سفت‌کن', price: 3850000, stock: 21,
      origin: 'aftermarket', pos: '—', oem: ['0831.S9'], cross: ['CONTINENTAL CT1026K1', 'SKF VKMA 03241'],
      specs: G({ 'جنس و ساخت': [['تعداد دندانه', '104'], ['عرض تسمه', '25 میلی‌متر'], ['اجزای کیت', 'تسمه، تسمه‌سفت‌کن، هرزگرد']], 'سرویس': [['فاصله تعویض پیشنهادی', '60,000 کیلومتر']] }),
      warranty: 12, fits: [...P206, 'tara-mt', 'tara-v4'], kit: ['WP-83021', 'DB-61040'], rating: 4.7, reviews: 211, sold: 1300, tag: 'best',
    },
    {
      sku: 'TB-70011', mpn: 'CT1179K1', brand: 'continental', type: 'timing-belt', title: 'کیت تسمه تایم', price: 4200000, stock: 17,
      origin: 'aftermarket', pos: '—', oem: ['EF7-1007050'], cross: [],
      specs: G({ 'جنس و ساخت': [['تعداد دندانه', '137'], ['اجزای کیت', 'تسمه، تسمه‌سفت‌کن']], 'سرویس': [['فاصله تعویض پیشنهادی', '60,000 کیلومتر']] }),
      warranty: 12, fits: EF7, rating: 4.6, reviews: 120, sold: 880,
    },
    {
      sku: 'WP-83021', mpn: 'VKPC 83621', brand: 'skf', type: 'water-pump', title: 'واترپمپ', price: 2700000, stock: 14,
      origin: 'aftermarket', pos: '—', oem: ['1201.G0'], cross: ['GATES WP0034'],
      specs: G({ 'جنس و ساخت': [['پروانه', 'فلزی'], ['واشر', 'همراه']] }),
      warranty: 12, fits: [...P206, 'tara-mt', 'tara-v4'], kit: ['TB-15580'], rating: 4.5, reviews: 74, sold: 450,
    },
    {
      sku: 'DB-61040', mpn: '6PK1040', brand: 'gates', type: 'drive-belt', title: 'تسمه دینام شش شیار', price: 690000, stock: 66,
      origin: 'aftermarket', pos: '—', oem: ['5750.XS'], cross: ['CONTINENTAL 6PK1045'],
      specs: G({ 'ابعاد': [['طول', '1040 میلی‌متر'], ['تعداد شیار', '6']] }),
      warranty: 6, fits: P206, rating: 4.4, reviews: 98, sold: 1150,
    },
    {
      sku: 'OS-25004', mpn: '0 258 006 028', brand: 'bosch', type: 'o2-sensor', title: 'سنسور اکسیژن (قبل از کاتالیست)', price: 3100000, stock: 13,
      origin: 'aftermarket', pos: '—', oem: ['1628.HN'], cross: ['NGK OZA527-E4'],
      specs: G({ 'جنس و ساخت': [['نوع', 'زیرکونیا گرم‌شونده'], ['تعداد سیم', '4'], ['طول کابل', '400 میلی‌متر']] }),
      warranty: 12, fits: ['p206-t5', 'p206-sd', 'samand-ef7', 'dena-ef7'], rating: 4.3, reviews: 46, sold: 330,
    },
    /* ---- Suspension ---- */
    {
      sku: 'SA-33320', mpn: '333420', brand: 'kyb', type: 'shock', title: 'کمک‌فنر جلو گازی Excel-G', price: 2950000, stock: 28,
      origin: 'aftermarket', pos: 'front', oem: ['5208.G0'], cross: ['SACHS 313 384'],
      specs: G({ 'جنس و ساخت': [['نوع', 'گازی دو لوله'], ['محل نصب', 'محور جلو (چپ و راست)'], ['تعداد', '1 عدد']], 'ابعاد': [['طول باز', '515 میلی‌متر'], ['طول بسته', '360 میلی‌متر']] }),
      warranty: 12, fits: P206, rating: 4.6, reviews: 154, sold: 1020, qtyHint: 'معمولاً به صورت جفت تعویض می‌شود.',
    },
    {
      sku: 'SA-31270', mpn: '317 594', brand: 'sachs', type: 'shock', title: 'کمک‌فنر جلو M Sport', price: 13800000, stock: 6,
      origin: 'oem', pos: 'front', oem: ['31 31 6 873 790'], cross: [],
      specs: G({ 'جنس و ساخت': [['نوع', 'گازی تک لوله اسپرت'], ['محل نصب', 'محور جلو'], ['تعداد', '1 عدد']] }),
      warranty: 24, fits: ['bmw-330i-ms'], verify: { 'bmw-320i': 'نوع تعلیق (استاندارد یا M Sport)' }, rating: 4.8, reviews: 19, sold: 70, qtyHint: 'معمولاً به صورت جفت تعویض می‌شود.',
    },
    {
      sku: 'SL-38710', mpn: '38710 01', brand: 'lemforder', type: 'stab-link', title: 'میل‌موجگیر جلو', price: 2150000, stock: 25,
      origin: 'oem', pos: 'front', oem: ['31 30 6 861 483'], cross: ['TRW JTS1156'],
      specs: G({ 'ابعاد': [['طول', '293 میلی‌متر']], 'جنس و ساخت': [['محل نصب', 'محور جلو (چپ و راست)']] }),
      warranty: 24, fits: ['bmw-320i', 'bmw-330i-ms', 'bmw-330i-lux'], rating: 4.7, reviews: 33, sold: 260,
    },
    {
      sku: 'BU-11520', mpn: '11520 01', brand: 'lemforder', type: 'bush', title: 'بوش طبق جلو (بزرگ)', price: 780000, stock: 44,
      origin: 'aftermarket', pos: 'front', oem: ['S2904110'], cross: [],
      specs: G({ 'جنس و ساخت': [['جنس', 'لاستیک تقویت‌شده با پوسته فلزی'], ['محل نصب', 'طبق جلو']] }),
      warranty: 12, fits: ['samand-xu7', ...EF7], rating: 4.3, reviews: 71, sold: 820,
    },
    {
      sku: 'SA-34905', mpn: '349052', brand: 'kyb', type: 'shock', title: 'کمک‌فنر عقب گازی', price: 4100000, stock: 8,
      origin: 'aftermarket', pos: 'rear', oem: ['55310-D3000'], cross: [],
      specs: G({ 'جنس و ساخت': [['نوع', 'گازی دو لوله'], ['محل نصب', 'محور عقب'], ['تعداد', '1 عدد']] }),
      warranty: 12, fits: ['tucson-20', 'tucson-24'], rating: 4.5, reviews: 27, sold: 150,
    },
    /* ---- Cooling ---- */
    {
      sku: 'RA-73208', mpn: '732080', brand: 'valeo', type: 'radiator', title: 'رادیاتور آب آلومینیومی', price: 4650000, stock: 7,
      origin: 'aftermarket', pos: '—', oem: ['1330.Q6'], cross: [],
      specs: G({ 'ابعاد': [['ابعاد هسته', '560 × 378 × 27 میلی‌متر']], 'جنس و ساخت': [['جنس هسته', 'آلومینیوم لحیم‌کاری‌شده'], ['مخزن', 'پلاستیک تقویت‌شده']] }),
      warranty: 12, fits: P206, rating: 4.4, reviews: 39, sold: 210,
    },
    {
      sku: 'TH-11538', mpn: 'TM 15 105', brand: 'mahle', type: 'thermostat', title: 'ترموستات با محفظه', price: 7900000, stock: 9,
      origin: 'oem', pos: '—', oem: ['11 53 8 635 689'], cross: [],
      specs: G({ 'جنس و ساخت': [['دمای بازشدن', '105 درجه سانتی‌گراد'], ['نوع', 'الکترونیکی با محفظه']] }),
      warranty: 24, fits: B48, rating: 4.7, reviews: 15, sold: 90,
    },
    {
      sku: 'WP-11518', mpn: 'VKPC 88620', brand: 'skf', type: 'water-pump', title: 'واترپمپ مکانیکی', price: 18500000, stock: 4,
      origin: 'oem', pos: '—', oem: ['11 51 8 635 089'], cross: [],
      specs: G({ 'جنس و ساخت': [['نوع', 'مکانیکی با کلاچ سوئیچ‌شونده'], ['واشر', 'همراه']] }),
      warranty: 24, fits: B48, kit: ['TH-11538'], rating: 4.8, reviews: 11, sold: 45,
    },
    /* ---- Electrical ---- */
    {
      sku: 'BA-60540', mpn: 'S4 005', brand: 'bosch', type: 'battery', title: 'باتری 60 آمپر ساعت', price: 5900000, stock: 35,
      origin: 'aftermarket', pos: '—', oem: [], cross: ['VARTA D24'],
      specs: G({ 'برق': [['ظرفیت', '60 آمپر ساعت'], ['جریان استارت سرد', '540 آمپر'], ['ولتاژ', '12 ولت']], 'ابعاد': [['ابعاد', '242 × 175 × 175 میلی‌متر'], ['قطب', 'مثبت سمت راست']] }),
      dims: { w: '242 mm', h: '175 mm' }, warranty: 18, fits: [...P206, 'samand-xu7', ...EF7, 'tara-mt', 'tara-v4', 'quick-mt', 'quick-r', 'shahin-g', 'shahin-cvt', 'mvm315-hb', 'mvm315-sd', 'x22-mt'], rating: 4.6, reviews: 276, sold: 2600, tag: 'best',
    },
    {
      sku: 'BA-80AGM', mpn: 'S5 A11', brand: 'bosch', type: 'battery', title: 'باتری AGM استارت-استاپ 80 آمپر ساعت', price: 14900000, stock: 10,
      origin: 'oem', pos: '—', oem: ['61 21 7 604 811'], cross: ['VARTA E39'],
      specs: G({ 'برق': [['ظرفیت', '80 آمپر ساعت'], ['جریان استارت سرد', '800 آمپر'], ['فناوری', 'AGM']], 'ابعاد': [['ابعاد', '315 × 175 × 190 میلی‌متر']] }),
      warranty: 24, fits: [...B48, 'c200', 'a4-40'], verify: { 'passat-18': 'ثبت باتری در ECU و اندازه سینی باتری' }, rating: 4.8, reviews: 44, sold: 260,
    },
    {
      sku: 'AL-70120', mpn: '440120', brand: 'valeo', type: 'alternator', title: 'دینام 90 آمپر', price: 9800000, stock: 0,
      origin: 'aftermarket', pos: '—', oem: ['EF7-3701010'], cross: [],
      specs: G({ 'برق': [['جریان خروجی', '90 آمپر'], ['ولتاژ', '14 ولت']], 'جنس و ساخت': [['پولی', 'شش شیار']] }),
      warranty: 12, fits: EF7, rating: 4.2, reviews: 23, sold: 140,
    },
    /* ---- Fluids ---- */
    {
      sku: 'EO-53004', mpn: 'EDGE 5W-30 LL', brand: 'castrol', type: 'engine-oil', title: 'روغن موتور تمام سنتتیک 5W-30 (5 لیتر)', price: 5950000, stock: 48,
      origin: 'aftermarket', pos: '—', oem: [], cross: [],
      specs: G({ 'مشخصات روغن': [['گرانروی', '`5W-30`'], ['حجم', '5 لیتر'], ['نوع', 'تمام سنتتیک']], 'استاندارد': [['تأییدیه‌ها', '`BMW LL-04 · MB 229.51 · VW 504/507`']] }),
      warranty: 0, fits: [...B48, 'bmw-x5-40i', 'c200', 'a4-40', 'passat-18'], rating: 4.8, reviews: 190, sold: 1400, tag: 'best',
    },
    {
      sku: 'EO-10400', mpn: 'Super 3000 X1 5W-40', brand: 'mobil', type: 'engine-oil', title: 'روغن موتور سنتتیک 5W-40 (4 لیتر)', price: 2850000, stock: 110,
      origin: 'aftermarket', pos: '—', oem: [], cross: [],
      specs: G({ 'مشخصات روغن': [['گرانروی', '`5W-40`'], ['حجم', '4 لیتر'], ['نوع', 'سنتتیک']], 'استاندارد': [['تأییدیه‌ها', '`API SN · ACEA A3/B4`']] }),
      warranty: 0, fits: [...P206, 'samand-xu7', ...EF7, 'tara-mt', 'tara-v4', 'quick-mt', 'quick-r', 'shahin-g', 'shahin-cvt', 'kmc-j7', 'x22-mt', 'x22-pro', 'mvm315-hb', 'mvm315-sd', 't7p', 't8p', 'elantra-md', 'elantra-ad', 'tucson-20', 'tucson-24', 'cerato-20', 'sportage-20', 'sportage-24'], rating: 4.6, reviews: 520, sold: 6100, tag: 'best',
    },
    {
      sku: 'CO-50001', mpn: 'Radicool SF', brand: 'castrol', type: 'coolant', title: 'ضدیخ کنسانتره ارگانیک (1 لیتر)', price: 690000, stock: 200,
      origin: 'aftermarket', pos: '—', oem: [], cross: [],
      specs: G({ 'مشخصات': [['پایه', 'اتیلن گلیکول، فناوری OAT'], ['حجم', '1 لیتر'], ['نسبت رقیق‌سازی', '50 درصد با آب مقطر']], 'استاندارد': [['هم‌ارز', '`G12+ · ASTM D3306`']] }),
      warranty: 0, universal: true, universalNote: 'ضدیخ ارگانیک برای همه سیستم‌های خنک‌کاری آلومینیومی مناسب است؛ با ضدیخ‌های معدنی قدیمی مخلوط نشود.', rating: 4.5, reviews: 140, sold: 2300, isNew: true,
    },
    /* ---- Body ---- */
    {
      sku: 'WB-60026', mpn: 'A 863 S', brand: 'bosch', type: 'wiper', title: 'تیغه برف‌پاک‌کن Aerotwin (جفت)', price: 2450000, stock: 30,
      origin: 'oem', pos: 'front', oem: ['61 61 5 A0E 8D1'], cross: [],
      specs: G({ 'ابعاد': [['طول سمت راننده', '650 میلی‌متر'], ['طول سمت سرنشین', '500 میلی‌متر']], 'جنس و ساخت': [['نوع', 'تخت بدون اسکلت']] }),
      warranty: 6, fits: ['bmw-320i', 'bmw-330i-ms', 'bmw-330i-lux'], rating: 4.7, reviews: 58, sold: 330, isNew: true,
    },
    {
      sku: 'WB-35002', mpn: 'VF 350', brand: 'valeo', type: 'wiper', title: 'تیغه برف‌پاک‌کن (جفت)', price: 790000, stock: 80,
      origin: 'aftermarket', pos: 'front', oem: ['6426.QQ'], cross: [],
      specs: G({ 'ابعاد': [['طول سمت راننده', '650 میلی‌متر'], ['طول سمت سرنشین', '400 میلی‌متر']], 'جنس و ساخت': [['نوع', 'تخت']] }),
      warranty: 6, fits: [...P206, 'samand-xu7', 'samand-ef7'], rating: 4.3, reviews: 120, sold: 1500,
    },
  ];

  /* ---------------- Service plan (intervals → part types) ---------------- */
  const service = [
    { km: 10000, fa: 'سرویس ۱۰٬۰۰۰ کیلومتر', types: ['engine-oil', 'oil-filter'], note: 'تعویض روغن و فیلتر روغن' },
    { km: 20000, fa: 'سرویس ۲۰٬۰۰۰ کیلومتر', types: ['engine-oil', 'oil-filter', 'air-filter', 'cabin-filter'], note: 'روغن، فیلتر روغن، هوا و کابین' },
    { km: 40000, fa: 'سرویس ۴۰٬۰۰۰ کیلومتر', types: ['engine-oil', 'oil-filter', 'air-filter', 'cabin-filter', 'fuel-filter', 'spark-plug', 'brake-pad'], note: 'سرویس کامل احتراق و بازدید ترمز' },
    { km: 60000, fa: 'سرویس ۶۰٬۰۰۰ کیلومتر', types: ['timing-belt', 'water-pump', 'drive-belt', 'coolant', 'brake-disc'], note: 'تسمه تایم، واترپمپ و مایع خنک‌کننده' },
  ];

  /* ---------------- Review pool (fictional) ---------------- */
  const reviewPool = [
    { n: 'مهدی ر.', t: 'بسته‌بندی سالم و کد قطعه دقیقاً با قطعه قبلی یکی بود. نصب بدون مشکل انجام شد.', s: 5 },
    { n: 'سارا ک.', t: 'قبل از خرید گزارش تطبیق را دیدم و همان را به مکانیک نشان دادم. کاملاً درست بود.', s: 5 },
    { n: 'امیر ح.', t: 'کیفیت خوب است. ارسال یک روز دیرتر از زمان اعلام‌شده رسید.', s: 4 },
    { n: 'نیلوفر م.', t: 'پشتیبانی فنی قبل از خرید سؤالم درباره تیپ خودرو را دقیق جواب داد.', s: 5 },
    { n: 'رضا ت.', t: 'نسبت به قطعه بازاری صدای کمتری دارد. قیمت کمی بالاتر است ولی ارزشش را دارد.', s: 4 },
    { n: 'حمید ص.', t: 'شماره OEM روی جعبه حک شده بود و با شماره داخل سایت تطبیق داشت.', s: 5 },
  ];

  AV.data = { vehicleBrands, models, variants, categories, partTypes, brands, products, service, reviewPool };

  /* ---------------- Indexes & lookups ---------------- */
  const by = (arr, k = 'id') => Object.fromEntries(arr.map((x) => [x[k], x]));
  const idx = AV.idx = {
    vbrand: by(vehicleBrands), model: by(models), variant: by(variants), cat: by(categories),
    type: by(partTypes), brand: by(brands), product: by(products, 'sku'),
  };
  products.forEach((p) => { p.cat = idx.type[p.type].cat; p.fitSet = new Set(p.fits || []); });
  AV.get = {
    product: (sku) => idx.product[String(sku || '').toUpperCase()] || idx.product[sku],
    variant: (id) => idx.variant[id], model: (id) => idx.model[id], vbrand: (id) => idx.vbrand[id],
    brand: (id) => idx.brand[id], cat: (id) => idx.cat[id], type: (id) => idx.type[id],
    variantsOf: (modelId) => variants.filter((v) => v.model === modelId),
    modelsOf: (brandId) => models.filter((m) => m.brand === brandId),
    isImport: (variantOrModel) => {
      const m = idx.model[variantOrModel.model] || variantOrModel;
      return idx.vbrand[m.brand].origin === 'import';
    },
    productsByCat: (cat) => products.filter((p) => p.cat === cat),
    productsByBrand: (b) => products.filter((p) => p.brand === b),
    productsByType: (t) => products.filter((p) => p.type === t),
  };

  /* ---------------- URLs ---------------- */
  AV.url = {
    home: () => 'index.html',
    shop: (q = {}) => 'shop.html' + qs(q),
    categories: () => 'categories.html',
    category: (id) => 'shop.html' + qs({ cat: id }),
    product: (p) => 'product.html' + qs({ sku: p.sku || p }),
    vehicles: () => 'vehicles.html',
    vehicleBrand: (id) => 'vehicle.html' + qs({ brand: id }),
    model: (id) => 'vehicle.html' + qs({ m: id }),
    combo: (type, model) => 'fit.html' + qs({ part: type, m: model }),
    brands: () => 'brands.html',
    brand: (id) => 'brand.html' + qs({ b: id }),
    search: (q) => 'search.html' + qs({ q }),
    cart: () => 'cart.html', checkout: () => 'checkout.html', success: (id) => 'success.html' + qs({ order: id }),
    guides: (cat) => 'guides.html' + qs({ cat }), article: (slug) => 'article.html' + qs({ a: slug }),
    request: () => 'request.html', account: (tab) => 'account.html' + (tab ? '#' + tab : ''),
  };
  function qs(o) {
    const s = new URLSearchParams(Object.entries(o).filter(([, v]) => v != null && v !== '')).toString();
    return s ? '?' + s : '';
  }
})(window.AV);
