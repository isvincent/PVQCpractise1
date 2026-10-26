// 互動概念圖：逐步示意（可自行控制速度與順序）、棋盤方格計算器、主題心智圖
import * as D from './data.js';
import * as P from './progress.js';
import { status } from './review.js';
import { illus } from './illustrations.js';
import { esc, L } from './ui.js';
import { setCrumbs } from './app.js';
import { unitTitle } from './vocab.js';

// 每單元的概念步驟：[示意圖鍵, 中文說明, 英文說明, 相關詞條英文]
export const STEPS = {
  u01: [['earth-spheres', '地球系統由大氣圈、水圈、生物圈與地圈組成，彼此交換物質與能量。', 'The Earth system: atmosphere, hydrosphere, biosphere and geosphere interact.', ['biosphere', 'hydrosphere', 'geosphere', 'Earth system']],
    ['earth-science-branches', '地球科學包含地質學、海洋學、地球物理學與天文學。', 'Branches: geology, oceanography, geophysics, astronomy.', ['geology', 'oceanography', 'geophysics', 'astronomy']],
    ['energy-resources', '資源與能源要兼顧永續性：再生能源與非再生能源。', 'Resources and energy with sustainability in mind.', ['resources', 'sustainability', 'non-renewable energy', 'solar energy']],
    ['observation-tools', '全球定位系統、雷達、水準測量等工具幫助觀測地球。', 'GPS, radar and levelling help us observe the Earth.', ['global positioning system', 'leveling', 'accelerometer', 'gauge']]],
  u02: [['minerals', '礦物是天然、有固定成分與晶體構造的固體，如石英、長石、雲母。', 'Minerals: quartz, feldspar, mica.', ['mineral', 'quartz', 'feldspar', 'mica']],
    ['igneous-rocks', '岩漿冷卻形成火成岩：花崗岩、玄武岩、安山岩、輝長岩。', 'Igneous rocks form from cooling magma.', ['granite', 'basalt', 'andesite', 'gabbro']],
    ['sedimentary-rocks', '沉積物固結形成沉積岩：頁岩、石灰岩、礫岩。', 'Sedimentary rocks: shale, limestone, conglomerate.', ['shale', 'limestone', 'conglomerate']],
    ['rock-cycle', '高溫高壓使岩石變質，形成具葉理的片麻岩；三類岩石可以互相轉換。', 'Metamorphism forms foliated gneiss; rocks cycle between types.', ['gneiss', 'foliation', 'rock']]],
  u03: [['earth-layers', '地球由外而內：地殼、地函（含軟流圈）、外核、內核。', 'Crust, mantle (with asthenosphere), outer core, inner core.', ['crust', 'mantle', 'core', 'asthenosphere']],
    ['plate-boundaries', '板塊在海溝隱沒，碰撞造山。', 'Plates subduct at trenches and collide to build mountains.', ['trench', 'orogeny', 'Pacific plate', 'Antarctic Plate']],
    ['pangea', '盤古大陸分裂的證據包括舌羊齒、水龍獸等化石。', 'Fossils such as Glossopteris and Lystrosaurus support Pangaea.', ['Pangea', 'glossopteris', 'lystrosaurus', 'cynognathus']],
    ['paleomagnetism', '海床兩側對稱的正、反向磁極條帶證明海底擴張。', 'Symmetric polarity stripes show seafloor spreading.', ['polarity', 'reverse polarity', 'isostasy', 'hot spot']]],
  u04: [['earthquake', '地震由斷層錯動產生，以規模描述能量大小。', 'Faults cause earthquakes; magnitude measures energy.', ['earthquake', 'seismic', 'magnitude', 'earthquake zone']],
    ['faults', '斷層依上盤移動方向分類；兩條正斷層間抬升的地塊為地壘。', 'Faults are classified by hanging-wall motion; a horst is an uplifted block.', ['fault', 'host', 'fracture', 'joint']],
    ['folds', '岩層受擠壓形成褶皺：向上拱起為背斜、向下凹為向斜。', 'Compression folds rocks into anticlines and synclines.', ['fold', 'anticline', 'syncline']],
    ['geohazards', '火山、海嘯、山崩、土石流與土壤液化都是地質災害。', 'Volcanoes, tsunamis, landslides, debris flows and liquefaction are geohazards.', ['volcano', 'tsunami', 'landslide', 'debris flow', 'soil liquefaction']]],
  u05: [['weathering-erosion', '岩石經風化、侵蝕、搬運，最後沉積。', 'Weathering → erosion → transportation → deposition.', ['weathering', 'erosion', 'transportation', 'deposition']],
    ['river-landforms', '降雨形成逕流，匯集於集水區，洪水堆積成氾濫平原。', 'Runoff collects in watersheds; floods build flood plains.', ['runoff', 'watershed', 'flood plain']],
    ['coastal-landforms', '海浪侵蝕形成海蝕平台與岬角，沉積形成海灘。', 'Waves cut platforms and headlands; deposition builds beaches.', ['wave-cut platform', 'headland', 'beach', 'shoreline']],
    ['sea-level', '海水面上升為海進、下降為海退。', 'Rising sea level is transgression; falling is regression.', ['transgression', 'regression']]],
  u06: [['geologic-time', '地質年代單位：宙 > 代 > 紀 > 世。', 'Geologic time: eon > era > period > epoch.', ['eon', 'era', 'period', 'epoch', 'Cambrian']],
    ['superposition', '未受擾動的岩層下老上新（疊置定律）；均變說認為「現在是了解過去的鑰匙」。', 'Superposition: older layers lie below; uniformitarianism.', ['superposition', 'succession', 'uniformitarianism']],
    ['fossils', '標準化石如三葉蟲、菊石可用來對比地層年代。', 'Index fossils such as trilobites and ammonites date strata.', ['fossil', 'trilobite', 'ammonite', 'foraminifera']],
    ['half-life', '放射性元素每經一個半衰期剩下一半，可用來推算岩石年齡。下方可以自己算。', 'Half-life dating — try the calculator below.', ['half life', 'zircon']]],
  u07: [['atmosphere-layers', '大氣依溫度變化分層：對流層、平流層、中氣層、增溫層。', 'Layers by temperature: troposphere, stratosphere, mesosphere, thermosphere.', ['tropopause', 'mesosphere', 'thermosphere', 'ionosphere']],
    ['ozone-layer', '平流層的臭氧層吸收紫外線，保護地表生物。', 'The ozone layer absorbs UV radiation.', ['ozone', 'ozone layer', 'ozone hole', 'ultraviolet']],
    ['humidity', '空氣中水氣達飽和就會凝結。', 'Air condenses when saturated.', ['humidity', 'saturation', 'moisture', 'condensation']],
    ['adiabatic-lifting', '空氣上升時絕熱膨脹冷卻，水氣凝結成雲。', 'Rising air cools adiabatically and forms clouds.', ['lifting', 'expansion', 'cooling', 'adiabatic process']]],
  u08: [['clouds', '雲與降水：積雲、霧、露、霜、冰雹。', 'Clouds and precipitation.', ['cumulus', 'fog', 'dew', 'frost', 'hail']],
    ['pressure-systems', '北半球低壓逆時針輻合上升、高壓順時針輻散下沉。', 'NH lows: counterclockwise convergence; highs: clockwise divergence.', ['cyclone', 'anticyclone', 'convergence', 'divergence']],
    ['typhoon', '颱風中心為颱風眼，周圍是眼牆與螺旋雨帶。', 'A typhoon has an eye, eye wall and spiral rain bands.', ['typhoon', 'typhoon eye', 'eye wall', 'spiral rain belt']],
    ['fronts', '冷氣團楔入暖空氣下方形成冷鋒，常帶來陣雨與降溫。', 'Cold air wedges under warm air at a cold front.', ['front', 'cold front', 'cold air mass', 'cold surge']]],
  u09: [['greenhouse', '溫室氣體吸收地表放出的長波輻射，使地表增溫。', 'Greenhouse gases absorb outgoing longwave radiation.', ['greenhouse effect', 'greenhouse gas', 'global warming']],
    ['climate-change', '全球暖化造成氣候變遷，京都議定書要求減少排放。', 'Global warming drives climate change; the Kyoto Protocol limits emissions.', ['climate change', 'Kyoto protocol', 'global change']],
    ['enso', '聖嬰年東太平洋海溫偏高，反聖嬰則偏低。', 'El Niño warms the eastern Pacific; La Niña cools it.', ['EL Nino', 'La Nina', 'anomaly']],
    ['pollution', '空氣、水、廢棄物與光害都是人類活動造成的污染。', 'Air, water, waste and light pollution.', ['air pollution', 'water pollution', 'light pollution', 'urbanization']]],
  u10: [['ocean-currents', '黑潮是流經臺灣東岸的暖流；湧升流把深層營養鹽帶上來。', 'The Kuroshio is a warm current east of Taiwan; upwelling brings nutrients up.', ['Kuroshio', 'current', 'upwelling', 'cold current']],
    ['seawater-profile', '海水分為混合層、斜溫層與深水層；鹽度是海水溶解鹽類的量。', 'Mixed layer, thermocline, deep layer; salinity.', ['thermocline', 'salinity', 'deep layer', 'water mass']],
    ['tides', '潮汐主要由月球引力造成：漲潮、退潮、低潮。', 'Tides come mainly from the Moon: flood tide, ebb tide, low tide.', ['tide', 'flood tide', 'ebb tide', 'low tide']],
    ['water-cycle', '水循環：蒸發、凝結、降水、逕流與地下水。', 'Water cycle: evaporation, condensation, precipitation, runoff, groundwater.', ['water cycle', 'evaporation', 'rainfall', 'ground water']]],
  u11: [['seasons', '地軸傾斜 23.5° 造成四季；夏至太陽直射北回歸線。下方可以計算正午太陽仰角。', 'Axial tilt causes seasons — try the noon-sun calculator below.', ['solstice', 'summer solstice', 'winter solstice', 'equator']],
    ['moon-phases', '月相週期是朔望月，約 29.5 天。', 'The synodic month is about 29.5 days.', ['synodic month', 'moon', 'synodic']],
    ['sidereal-solar-day', '恆星日約 23 時 56 分，比太陽日短約 4 分鐘。', 'A sidereal day is about 4 minutes shorter than a solar day.', ['sidereal', 'solar day', 'diurnal', 'leap year']],
    ['celestial-sphere', '用方位角、仰角或赤緯描述天體位置；天頂在觀測者正上方。', 'Locate stars with azimuth, altitude or declination; the zenith is overhead.', ['zenith', 'azimuth', 'declination', 'horizon']]],
  u12: [['solar-system', '行星由內而外：水、金、地、火、（小行星帶）、木、土、天、海。', 'Mercury, Venus, Earth, Mars, (asteroid belt), Jupiter, Saturn, Uranus, Neptune.', ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'asteroid belt']],
    ['small-bodies', '彗星有彗髮與彗尾；流星落到地面成為隕石。', 'Comets have comas; meteors that land are meteorites.', ['comet', 'coma', 'meteor', 'meteorite']],
    ['sun-structure', '太陽的日冕向外吹出太陽風。', 'The corona emits the solar wind.', ['corona', 'solar wind', 'solar disk']],
    ['aurora', '太陽風帶電粒子沿地球磁層進入極區大氣，產生極光。', 'Solar-wind particles enter the magnetosphere and create aurorae.', ['aurora', 'magnetosphere', 'space weather']]],
  u13: [['star-brightness', '星等數字越小越亮；光度是恆星每秒發出的總能量。', 'Smaller magnitude = brighter; luminosity is total power.', ['magnitude', 'luminosity', 'brightness']],
    ['distance-scale', '1 秒差距 ≈ 3.26 光年，等於視差 1 角秒的距離。下方可以換算。', '1 parsec ≈ 3.26 light years — try the distance calculator.', ['parsec', 'light year', 'parallax arcsecond']],
    ['star-life', '恆星由星雲誕生，晚年膨脹成紅巨星，大質量恆星可能成為黑洞。', 'Stars form in nebulae, become red giants, massive ones may form black holes.', ['nebula', 'red giant', 'black hole']],
    ['redshift', '遙遠星系的紅移顯示宇宙在膨脹。', 'Redshift of distant galaxies shows the universe is expanding.', ['redshift', 'galaxy', 'universe', 'Andromeda galaxy']]],
  u14: [['telescopes', '望遠鏡收集光線；太空望遠鏡（如哈伯）不受大氣干擾。', 'Telescopes collect light; space telescopes avoid the atmosphere.', ['telescope', 'optical telescope', 'Hubble space telescope', 'observatory']],
    ['em-spectrum', '不同波段的電磁波需要不同的望遠鏡觀測。', 'Different EM bands need different telescopes.', ['electromagnetic (EM) waves', 'radio', 'infrared', 'X-ray']],
    ['blackbody', '溫度越高，黑體輻射峰值波長越短（越偏藍）。', 'Hotter objects peak at shorter wavelengths.', ['blackbody radiation', 'radiation curve', 'wavelength']],
    ['spectra-lines', '發射線與吸收線可以判斷恆星的成分。', 'Emission and absorption lines reveal composition.', ['spectrum', 'emission line', 'absorption spectrum', 'spectrometer']]],
  u15: [['heat-transfer', '熱的三種傳遞方式：傳導、對流、輻射。', 'Heat moves by conduction, convection and radiation.', ['conduction', 'convection', 'radiation']],
    ['motion-physics', '運動用速度、加速度描述；轉動用角頻率與角加速度。', 'Velocity, acceleration, angular frequency and angular acceleration.', ['velocity', 'accelerated motion', 'angular frequency', 'angular acceleration']],
    ['atom-ion', '原子失去電子即電離，離子捕獲電子即復合。', 'Atoms ionise by losing electrons; ions recombine by capturing them.', ['atom', 'electron', 'ionization', 'recombination']]],
};

const byEn = (en) => D.allTerms().find((t) => t.src.en === en);

/** 逐步概念示意：學生可前後切換、自動播放、調整速度 */
export function stepper(root, uid) {
  const steps = STEPS[uid];
  if (!steps) { root.innerHTML = ''; return; }
  let i = 0, timer = null;
  const draw = () => {
    const [key, zh, en, terms] = steps[i];
    root.innerHTML = `<div class="card"><div class="row between"><b>🧠 ${L('互動概念圖', 'Interactive concept')}　${i + 1}/${steps.length}</b>
      <div class="row"><button class="btn soft small" data-p ${i ? '' : 'disabled'}>◀</button>
      <button class="btn soft small" data-auto aria-pressed="${!!timer}">${timer ? '⏸ ' + L('暫停', 'Pause') : '▶ ' + L('自動播放', 'Auto play')}</button>
      <label class="small">${L('速度', 'Speed')} <select data-sp><option value="9000">${L('慢', 'Slow')}</option><option value="6000" selected>${L('中', 'Medium')}</option><option value="3500">${L('快', 'Fast')}</option></select></label>
      <button class="btn soft small" data-n ${i < steps.length - 1 ? '' : 'disabled'}>▶</button></div></div>
      <div class="grid two" style="margin-top:.6rem"><div class="illus">${illus(key)}</div>
      <div><p style="font-size:1.1rem">${esc(L(zh, en))}</p><div class="row">${terms.map(byEn).filter(Boolean).map((t) => `<a class="chip" href="#/word/${t.id}" lang="en">${esc(t.src.en)}</a>`).join('')}</div></div></div></div>`;
    root.querySelector('[data-p]').onclick = () => { i--; draw(); };
    root.querySelector('[data-n]').onclick = () => { i++; draw(); };
    const sp = root.querySelector('[data-sp]');
    sp.value = String(root.dataset.speed || 6000);
    sp.onchange = () => { root.dataset.speed = sp.value; if (timer) { clearInterval(timer); timer = null; root.querySelector('[data-auto]').click(); } };
    root.querySelector('[data-auto]').onclick = () => {
      if (timer) { clearInterval(timer); timer = null; draw(); return; }
      timer = setInterval(() => { if (!root.isConnected) return clearInterval(timer); i = (i + 1) % steps.length; draw(); }, +(root.dataset.speed || 6000));
      draw();
    };
  };
  draw();
}

/** 地球科學互動計算器：依單元提供（半衰期定年、正午太陽仰角、天文距離換算） */
const fmt = (x, d = 3) => (Number.isFinite(x) ? Number(x.toPrecision(d)).toLocaleString('en-US', { maximumFractionDigits: 6 }) : '—');

function halfLifeCalc(root) {
  root.innerHTML = `<div class="card"><b>⏳ ${L('半衰期定年計算器', 'Half-life dating')}</b>
    <div class="row" style="margin:.5rem 0"><label>${L('半衰期', 'half-life')} <input type="number" data-t value="704" min="0" step="any" style="width:100px"></label>
    <label class="sr-only" for="hl-unit">${L('時間單位', 'unit')}</label><select id="hl-unit" data-u><option value="年">${L('年', 'years')}</option><option value="千年">${L('千年', 'kyr')}</option><option value="百萬年" selected>${L('百萬年', 'Myr')}</option></select>
    <label>${L('剩餘母元素比例', 'parent remaining')} (%) <input type="number" data-r value="25" min="0" max="100" step="any" style="width:90px"></label></div>
    <p class="small muted">${L('預設為鈾-235（半衰期約 7.04 億年），常用於鋯石 zircon 定年；碳-14 的半衰期約 5730 年，請選「年」。', 'Default: U-235 (≈ 704 Myr, zircon dating); for carbon-14 use 5730 years.')}</p><div data-out></div></div>`;
  const calc = () => {
    const t = parseFloat(root.querySelector('[data-t]').value), r = parseFloat(root.querySelector('[data-r]').value);
    const u = root.querySelector('[data-u]').value;
    const uL = { 年: L('年', 'years'), 千年: L('千年', 'thousand years'), 百萬年: L('百萬年', 'million years') }[u];
    const out = root.querySelector('[data-out]');
    if (!(t > 0) || !(r > 0 && r <= 100)) { out.innerHTML = `<p class="small muted">${L('剩餘比例需在 0–100% 之間（不含 0）。', 'Remaining must be between 0 and 100%.')}</p>`; return; }
    const n = Math.log(100 / r) / Math.log(2), age = n * t;
    out.innerHTML = `<p>${L('經過', 'Elapsed')} <b>${fmt(n)}</b> ${L('個半衰期', 'half-lives')}　→　${L('年齡約', 'Age ≈')} <b>${fmt(age)}</b> ${uL}</p>
      <p class="small muted">${L('公式：剩餘比例 = (1/2)ⁿ，年齡 = n × 半衰期。剩 50% 為 1 個半衰期、25% 為 2 個、12.5% 為 3 個。', 'Remaining = (1/2)ⁿ; age = n × half-life.')}</p>`;
  };
  root.querySelectorAll('input').forEach((i) => (i.oninput = calc));
  root.querySelector('[data-u]').onchange = calc;
  calc();
}

function noonSunCalc(root) {
  root.innerHTML = `<div class="card"><b>☀️ ${L('正午太陽仰角', 'Noon sun altitude')}</b>
    <div class="row" style="margin:.5rem 0"><label>${L('緯度', 'latitude')} (°N，${L('南緯填負值', 'south negative')}) <input type="number" data-lat value="25" min="-90" max="90" step="any" style="width:90px"></label>
    <label>${L('日期', 'date')} <select data-d><option value="23.44">${L('夏至', 'June solstice')}（+23.44°）</option><option value="0" selected>${L('春分／秋分', 'Equinox')}（0°）</option><option value="-23.44">${L('冬至', 'December solstice')}（−23.44°）</option></select></label></div>
    <p class="small muted">${L('預設緯度 25°N（約臺北）。', 'Default 25°N (≈ Taipei).')}</p><div data-out></div></div>`;
  const calc = () => {
    const lat = parseFloat(root.querySelector('[data-lat]').value), dec = parseFloat(root.querySelector('[data-d]').value);
    const out = root.querySelector('[data-out]');
    if (!(lat >= -90 && lat <= 90)) { out.innerHTML = ''; return; }
    const alt = 90 - Math.abs(lat - dec);
    out.innerHTML = alt <= 0
      ? `<p>${L('太陽整天在地平線下（極夜）。', 'The sun stays below the horizon (polar night).')}</p>`
      : `<p>${L('正午太陽仰角', 'Noon altitude')} = 90° − |${L('緯度', 'lat')} − ${L('太陽直射緯度', 'subsolar lat')}| = <b>${fmt(alt, 4)}°</b>　${alt >= 89.99 ? L('（太陽在天頂 zenith！）', '(sun at the zenith!)') : ''}</p>
         <p class="small muted">${L('仰角越大，陽光越集中、氣溫越高，這就是四季 seasons 的成因之一。', 'Higher altitude → more concentrated sunlight → warmer seasons.')}</p>`;
  };
  root.querySelector('[data-lat]').oninput = calc;
  root.querySelector('[data-d]').onchange = calc;
  calc();
}

function distanceCalc(root) {
  root.innerHTML = `<div class="card"><b>🔭 ${L('天文距離換算', 'Astronomical distance')}</b>
    <div class="row" style="margin:.5rem 0"><label>${L('視差', 'parallax')} (${L('角秒', 'arcsec')}) <input type="number" data-p value="0.379" min="0" step="any" style="width:100px"></label></div>
    <p class="small muted">${L('預設為天狼星 Sirius 的視差約 0.379 角秒。', 'Default: Sirius, parallax ≈ 0.379″.')}</p><div data-out></div></div>`;
  const calc = () => {
    const p = parseFloat(root.querySelector('[data-p]').value);
    const out = root.querySelector('[data-out]');
    if (!(p > 0)) { out.innerHTML = `<p class="small muted">${L('視差需大於 0。', 'Parallax must be > 0.')}</p>`; return; }
    const pc = 1 / p, ly = pc * 3.2616, au = pc * 206265;
    out.innerHTML = `<p>${L('距離', 'Distance')} d = 1 / p = <b>${fmt(pc)}</b> parsec（${L('秒差距', 'pc')}）＝ <b>${fmt(ly)}</b> ${L('光年', 'light years')} ＝ <b>${fmt(au)}</b> AU</p>
      <p class="small muted">${L('1 秒差距 ≈ 3.26 光年 ≈ 206,265 天文單位；視差越小，恆星越遠。', '1 pc ≈ 3.26 ly ≈ 206,265 AU; smaller parallax = farther star.')}</p>`;
  };
  root.querySelector('[data-p]').oninput = calc;
  calc();
}

export const CALCS = { u06: halfLifeCalc, u11: noonSunCalc, u13: distanceCalc };

/** 主題心智圖：教材 → 章 → 單元，點單元看單字關聯 */
export function mindMap(v, uid) {
  setCrumbs([[L('概念心智圖', 'Mind map')], ...(uid ? [[unitTitle(D.unit(uid))]] : [])]);
  if (uid) return unitNet(v, uid);
  const W = 1000, H = 640, cx = W / 2, cy = H / 2;
  const colors = ['#5146e5', '#0d9488', '#ea580c', '#db2777', '#ca8a04', '#2563eb', '#16a34a'];
  let svg = '';
  // 13 個單元平均分布在外圈，章節點放在所屬單元的平均角度上
  const order = D.chapters.flatMap((c) => c.units);
  const ang = (uid2) => (order.indexOf(uid2) / order.length) * Math.PI * 2 - Math.PI / 2;
  let chapters = '';
  D.chapters.forEach((c, i) => {
    const a = c.units.reduce((s2, u2) => s2 + ang(u2), 0) / c.units.length;
    const x = cx + Math.cos(a) * 200, y = cy + Math.sin(a) * 150;
    svg += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${colors[i]}" stroke-width="4"/>`;
    c.units.forEach((uid2) => {
      const ux = cx + Math.cos(ang(uid2)) * 400, uy = cy + Math.sin(ang(uid2)) * 262;
      svg += `<line x1="${x}" y1="${y}" x2="${ux}" y2="${uy}" stroke="${colors[i]}" stroke-width="2.5" stroke-dasharray="5 4"/>`;
      const u = D.unit(uid2);
      const done = u.terms.filter((id) => status(P.item(id)) === 'mastered').length;
      svg += `<a href="#/map/${uid2}" aria-label="${esc(unitTitle(u))}"><rect x="${ux - 85}" y="${uy - 26}" width="170" height="52" rx="14" fill="#fff" stroke="${colors[i]}" stroke-width="2.5"/>
        <text x="${ux}" y="${uy - 3}" text-anchor="middle" font-size="14" font-weight="700" style="fill:#1e2340">${esc(unitTitle(u).slice(0, 12))}</text>
        <text x="${ux}" y="${uy + 16}" text-anchor="middle" font-size="12" style="fill:#475569">${u.terms.length} ${L('詞', 'terms')}・★${done}</text></a>`;
    });
    chapters += `<rect x="${x - 78}" y="${y - 20}" width="156" height="40" rx="20" fill="${colors[i]}"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="14" font-weight="800" style="fill:#fff">${esc(L(c.title, c.title_en).slice(0, 11))}</text>`;
  });
  svg += chapters;
  svg += `<circle cx="${cx}" cy="${cy}" r="62" fill="#1e2340"/><text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" font-weight="800" style="fill:#fff">${L('地球科學', 'Earth Science')}</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="13" style="fill:#bae6fd">${L('專業英文', 'English')}</text>`;
  v.innerHTML = `<h1>🕸️ ${L('主題關聯心智圖', 'Topic mind map')}</h1><p class="muted">${L('中心是教材，外圈是章與單元；點單元可看單字之間的關聯（★ 為已精熟數）。', 'Click a unit to see how its words connect (★ = mastered).')}</p>
    <div class="card mindmap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${L('教材心智圖', 'Course mind map')}">${svg}</svg></div>`;
}

function unitNet(v, uid) {
  const u = D.unit(uid);
  const ts = D.unitTerms(uid);
  const W = 900, H = 620, cx = W / 2, cy = H / 2;
  const pos = new Map();
  ts.forEach((t, i) => {
    const ring = t.level === 1 ? 150 : t.level === 2 ? 230 : 290;
    const a = (i / ts.length) * Math.PI * 2;
    pos.set(t.id, [cx + Math.cos(a) * ring * 1.35, cy + Math.sin(a) * ring]);
  });
  let lines = '', nodes = '';
  const seen = new Set();
  for (const t of ts) for (const r of t.ai.related || []) {
    if (!pos.has(r)) continue;
    const k = [t.id, r].sort().join();
    if (seen.has(k)) continue;
    seen.add(k);
    const [x1, y1] = pos.get(t.id), [x2, y2] = pos.get(r);
    lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#94a3b8" stroke-width="1.5"/>`;
  }
  const fill = { new: '#e2e8f0', learning: '#ccfbf1', weak: '#ffe1e6', mastered: '#dcfce7' };
  for (const t of ts) {
    const [x, y] = pos.get(t.id);
    const s = status(P.item(t.id));
    const w = Math.min(170, 14 + t.src.en.length * 7.2);
    nodes += `<a href="#/word/${t.id}"><rect x="${x - w / 2}" y="${y - 15}" width="${w}" height="30" rx="15" fill="${fill[s]}" stroke="#475569"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="12.5" style="fill:#1e2340" lang="en">${esc(t.src.en.length > 22 ? t.src.en.slice(0, 21) + '…' : t.src.en)}</text></a>`;
  }
  v.innerHTML = `<h1>🕸️ ${esc(unitTitle(u))}</h1><p class="muted">${L('內圈基礎、中圈進階、外圈挑戰；連線代表相關詞。底色：灰＝未學習、青＝學習中、紅＝待加強、綠＝已精熟。', 'Inner ring basic → outer challenge; lines link related terms.')}</p>
    <div class="card mindmap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${L('單元單字關聯圖', 'Unit word network')}">${lines}<circle cx="${cx}" cy="${cy}" r="58" fill="#2050c8"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="14" font-weight="800" style="fill:#fff">${esc(u.title.slice(0, 8))}</text>${nodes}</svg></div>
    <a class="btn ghost" href="#/map">← ${L('回全冊心智圖', 'Back to full map')}</a>`;
}
