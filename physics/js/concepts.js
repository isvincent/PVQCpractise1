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
  u01: [['si-units', '物理量都要搭配單位：基本單位如安培 A、燭光 cd，導出單位如焦耳 J、瓦特 W、伏特 V、歐姆 Ω、法拉 F、韋伯 Wb。', 'Every quantity needs a unit: base units (A, cd) and derived units (J, W, V, Ω, F, Wb).', ['joule', 'watt', 'volt', 'ohm', 'farad', 'weber', 'ampere', 'candela']],
    ['length-scale', '長度單位相差很大：1 cm = 10⁻² m、1 µm = 10⁻⁶ m、1 nm = 10⁻⁹ m、1 fm = 10⁻¹⁵ m。', 'Length scales: cm, micron, nanometre, femtometre.', ['centimeter', 'micron', 'nanometer', 'femtometer']],
    ['vector-components', '向量有大小和方向，可拆成座標軸上的分量。', 'A vector has magnitude and direction and splits into components.', ['vector', 'component', 'coordinate', 'dimension']],
    ['meters', '安培計串聯量電流、伏特計並聯量電壓。', 'Ammeters go in series, voltmeters in parallel.', ['ammeter', 'voltmeter', 'thermometer', 'vernier']]],
  u02: [['displacement-path', '位移是起點到終點的向量，與實際走的路徑長不同。', 'Displacement is the start-to-end vector, not the path length.', ['displacement', 'velocity', 'average velocity', 'average speed']],
    ['velocity-graph', '速度—時間圖的斜率是加速度；斜率為負就是減速。', 'The slope of a v–t graph is acceleration.', ['acceleration', 'deceleration', 'accelerated motion', 'kinematics']],
    ['circular-motion', '等速圓周運動速度沿切線，向心加速度指向圓心。', 'In uniform circular motion, acceleration points to the centre.', ['centripetal acceleration', 'angular frequency', 'period']],
    ['angular-motion', '轉動用角位移 θ、角速度 ω、角加速度 α 描述。', 'Rotation uses angular displacement, angular velocity and angular acceleration.', ['angular displacement', 'angular acceleration', 'rotation']]],
  u03: [['free-body', '受力圖：把物體受到的重力、正向力、摩擦力、張力都畫出來。', 'A free-body diagram shows weight, normal force, friction and tension.', ['force', 'weight', 'tension', 'external force']],
    ['friction-graph', '推力增加時靜摩擦跟著增加，超過最大靜摩擦後變成較小的動摩擦。', 'Static friction grows until it is overcome; then kinetic friction acts.', ['static friction', 'kinetic friction', 'friction']],
    ['inertia', '牛頓第一定律：物體有保持原運動狀態的慣性。', "Newton's first law: inertia.", ['inertia', 'Newton', 'fictitious force']],
    ['torque', '力矩 = 力 × 力臂；力偶使物體轉動而不平移。', 'Torque = force × lever arm; a couple rotates without translating.', ['arm of force', 'force couple', 'center of gravity', 'equilibrium']]],
  u04: [['work-energy', '功 W = F·d；功能定理：合力作的功等於動能變化。', 'W = Fd; the work–kinetic energy theorem.', ['work', 'work-kinetic energy theorem', 'energy']],
    ['spring', '彈簧的彈力 F = −kx，k 為力常數，儲存彈性位能。', 'Spring force F = −kx stores elastic potential energy.', ['elastic force', 'force constant', 'elastic potential']],
    ['energy-conservation', '只有保守力作功時力學能守恆；耗散力（如摩擦）會使力學能減少。', 'Mechanical energy is conserved unless dissipative forces act.', ['conservation', 'dissipative force']],
    ['collision', '碰撞時動量守恆；彈性碰撞動能也守恆，恢復係數 e = 1。', 'Momentum is conserved in collisions; elastic ones also keep KE.', ['collision', 'elastic collision', 'impulse', 'restitution']]],
  u05: [['states-of-matter', '固體、液體、氣體粒子排列不同；液晶兼具液體流動性與晶體的有序性。', 'Solids, liquids, gases; liquid crystals are in between.', ['solid', 'liquid', 'gas', 'liquid crystal']],
    ['phase-diagram', '相圖顯示不同溫度與壓力下物質的相。', 'A phase diagram shows phases versus temperature and pressure.', ['phase diagram', 'vaporization', 'boiling point', 'fusion point']],
    ['pressure', '絕對壓力 = 錶壓力 + 大氣壓力。', 'Absolute pressure = gauge pressure + atmospheric pressure.', ['absolute pressure', 'gauge pressure', 'barometer', 'bar']],
    ['capillarity', '附著力大於內聚力時，液體在細管中上升（毛細現象）。', 'Capillarity: adhesion vs cohesion.', ['capillarity', 'adhesive force', 'cohesive force', 'wetting']]],
  u06: [['thermometer-scales', '水的冰點 0 °C = 32 °F = 273.15 K；絕對零度 0 K = −273.15 °C。下方可以自己換算。', 'Freezing point 0 °C = 32 °F = 273.15 K; absolute zero is 0 K. Try the converter below.', ['Celsius degree', 'Fahrenheit scale', 'absolute zero', 'thermometer']],
    ['heat-transfer', '熱可藉傳導、對流、輻射傳遞，最後達成熱平衡。', 'Heat moves by conduction, convection and radiation until thermal equilibrium.', ['conduction', 'convection', 'thermal equilibrium', 'thermal energy']],
    ['boyles-law', '定溫下氣體壓力與體積成反比（波以耳定律）；絕熱過程沒有熱交換。', "Boyle's law; adiabatic processes exchange no heat.", ["Boyle's law", 'adiabatic process', 'compression']],
    ['heat-engine', '熱機把熱能轉為功：汽油引擎用火星塞點火，柴油機靠壓縮點火。', 'Petrol engines use spark ignition; diesel engines use compression ignition.', ['gasoline engine', 'diesel engine']]],
  u07: [['transverse-wave', '波長、振幅、波峰、波谷；頻率 f 與週期 T 互為倒數，波速 v = fλ。', 'Wavelength, amplitude, crest, trough; v = fλ.', ['wavelength', 'amplitude', 'crest', 'wave trough', 'frequency']],
    ['standing-wave', '駐波有不動的波節與振動最大的波腹；最低的頻率是基頻。', 'Standing waves have nodes and antinodes; the lowest frequency is the fundamental.', ['antinode', 'fundamental frequency', 'natural frequency']],
    ['doppler', '波源靠近時觀察者收到的頻率變高、遠離時變低（都卜勒效應）。', 'Doppler effect: approaching source → higher frequency.', ['Doppler effect', 'bow wave']],
    ['decibel', '響度用分貝表示，人耳可聽頻率約 20 Hz 到 20 kHz；音色由波形決定。', 'Loudness in dB; audible range ~20 Hz–20 kHz; timbre depends on waveform.', ['decibel', 'audible frequency', 'timbre', 'echo']]],
  u08: [['refraction', '光進入不同介質會折射，折射率 n = c / v。', 'Light refracts between media; n = c/v.', ['refraction', 'index of refraction']],
    ['total-reflection', '入射角大於臨界角時發生全反射，光纖就是靠它傳光。', 'Beyond the critical angle light is totally reflected — the basis of fibre optics.', ['critical angle', 'fiber optics', 'cladding', 'fiberscope']],
    ['convex-lens', '凸透鏡（會聚透鏡）使平行光會聚於焦點，焦距為 f。下方可以計算成像。', 'A convex (converging) lens focuses parallel rays at the focal point — try the calculator below.', ['convex lens', 'converging lens', 'focal point', 'focal length']],
    ['eye-myopia', '近視時影像落在視網膜前，需用凹透鏡矯正。', 'Myopia is corrected with a concave lens.', ['myopia', 'concave lens', 'lens']]],
  u09: [['coulomb', '庫侖定律：兩電荷間的力與電量乘積成正比、與距離平方成反比。', "Coulomb's law: F ∝ q₁q₂/r².", ["Coulomb's law", 'charge', 'electron', 'electrostatic force']],
    ['electric-field', '電場線由正電荷出發、指向負電荷。', 'Field lines leave positive and end on negative charges.', ['electric field', 'electric potential', 'voltage']],
    ['circuit', '電動勢驅動電流通過電阻；串聯電阻相加，並聯倒數相加。下方可以自己算。', 'EMF drives current through resistors — try the calculator below.', ['electromotive force', 'electric current', 'resistor', 'equivalent resistance']],
    ['capacitor', '電容器以兩極板儲存電荷，電容 C = Q / V，單位法拉 F。', 'A capacitor stores charge: C = Q/V.', ['capacitor', 'capacitance', 'farad']]],
  u10: [['electromagnet', '電流產生磁場；線圈加鐵芯成為電磁鐵。', 'Current makes a magnetic field; a coil with an iron core is an electromagnet.', ['electromagnet', 'permeability', 'south pole']],
    ['induction', '穿過線圈的磁通量改變時產生感應電流（電磁感應）。', 'Changing flux induces a current.', ['electromagnetic induction', 'eddy current']],
    ['motor-generator', '馬達把電能變成力學能，發電機反之；直流馬達用換向器改變電流方向。', 'Motors and generators convert energy; commutators reverse current.', ['electric motor', 'electric generator', 'commutator']],
    ['em-spectrum', '電磁波譜依頻率由低到高：無線電、微波、紅外線、可見光、紫外線、X 射線、γ 射線。', 'The EM spectrum from radio to gamma rays.', ['electromagnetic spectrum', 'microwave', 'infrared light', 'X-ray']]],
  u11: [['band-gap', '導體的價帶與導帶重疊；半導體有小能隙；絕緣體能隙很大。', 'Band gaps distinguish conductors, semiconductors and insulators.', ['valence band', 'energy gap', 'conductor']],
    ['doping', '摻雜施體得到 n 型半導體，產生電洞則為 p 型；載子包括電子與電洞。', 'Doping makes n-type (donors) or p-type (holes).', ['doping', 'donor', 'hole', 'carrier']],
    ['diode-transistor', '二極體只讓電流單向通過；電晶體有射極、基極、集極。', 'Diodes conduct one way; transistors have emitter, base, collector.', ['diode', 'emitter', 'base', 'collector', 'field-effect transistor']],
    ['superconductor', '溫度低於臨界溫度時，超導體電阻變為零。', 'Below the critical temperature resistance vanishes.', ['superconductor', 'critical temperature']]],
  u12: [['bohr-atom', '波耳模型：電子在特定軌道上，最內層半徑為波耳半徑。', 'Bohr model: electrons in fixed orbits; the Bohr radius.', ['Bohr radius', 'atom', 'quantum']],
    ['energy-levels', '電子由激發態躍遷回較低能階時放出光子，能量是量子化的。', 'Electrons emit photons when dropping to lower levels.', ['energy level', 'ground state', 'excited state', 'quantization']],
    ['spectra', '連續光譜、發射光譜（亮線）、吸收光譜（暗線）；氫原子可見光區為巴耳末系。', 'Continuous, emission and absorption spectra; the Balmer series.', ['continuous spectrum', 'emission spectrum', 'absorption spectrum', 'Balmer series']],
    ['photoelectric', '光子能量大於功函數才能打出電子：光電效應顯示光的粒子性。', 'Photoelectric effect and the work function.', ['work function', 'wave-particle duality']]],
  u13: [['nucleus', '原子核由質子與中子（合稱核子）組成；質子數相同、中子數不同即為同位素。', 'Nuclei contain nucleons; isotopes differ in neutron number.', ['atomic nucleus', 'nucleon', 'neutron', 'isotope', 'atomic number']],
    ['decay', 'α 衰變放出氦核；β 衰變放出電子與反微中子。', 'Alpha decay emits a helium nucleus; beta decay emits an electron and an antineutrino.', ['alpha decay', 'beta decay', 'antineutrino']],
    ['fission-fusion', '重核分裂與輕核融合都會釋放能量（來自結合能差）；分裂可引發連鎖反應。', 'Fission and fusion release energy; fission can chain-react.', ['fission', 'fusion', 'chain reaction', 'binding energy']],
    ['particles', '基本粒子包括夸克與輕子；粒子遇到反粒子會湮滅。', 'Elementary particles: quarks and leptons; matter–antimatter annihilation.', ['down quark', 'lepton', 'antiparticle', 'annihilation']]],
  u14: [['solar-system', '太陽系行星依序為水、金、地、火、木、土、天、海；地球到太陽約 1 AU。', 'Planets in order; Earth–Sun distance ≈ 1 AU.', ['planet', 'Venus', 'Earth', 'Saturn', 'Uranus', 'Neptune']],
    ['orbit', '行星與衛星沿橢圓軌道運行；速度達脫離速度即可脫離引力束縛。', 'Elliptical orbits and escape velocity.', ['satellite', 'ellipse', 'escape velocity']],
    ['galaxy', '星系由大量恆星組成，仙女座星系是銀河系的鄰居；星系又聚成星系團。', 'Galaxies, the Andromeda galaxy and galaxy clusters.', ['galaxy', 'Andromeda galaxy', 'galaxy cluster', 'nebula']],
    ['big-bang', '宇宙由大霹靂開始膨脹，宇宙背景輻射是重要證據。', 'The big bang and the cosmic background radiation.', ['big bang theory', 'background radiation', 'blue shift']]],
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

/** 物理互動計算器：依單元提供（溫標換算、透鏡成像、電阻串並聯） */
const fmt = (x) => (Number.isFinite(x) ? Math.round(x * 100) / 100 : '∞');

function tempCalc(root) {
  root.innerHTML = `<div class="card"><b>🌡️ ${L('溫標換算器', 'Temperature converter')}</b>
    <div class="row" style="margin:.5rem 0"><label>${L('攝氏', 'Celsius')} °C <input type="number" data-c value="25" step="any" style="width:110px"></label></div><div data-out></div></div>`;
  const calc = () => {
    const c = parseFloat(root.querySelector('[data-c]').value);
    if (!Number.isFinite(c)) { root.querySelector('[data-out]').innerHTML = ''; return; }
    const k = c + 273.15, f = (c * 9) / 5 + 32;
    root.querySelector('[data-out]').innerHTML = `<p><span lang="en">Fahrenheit scale</span>：<b>${fmt(f)} °F</b>（°F = °C × 9/5 + 32）<br>Kelvin：<b>${fmt(k)} K</b>（K = °C + 273.15）</p>
      ${k < 0 ? `<p class="fix-box">${L('低於絕對零度 absolute zero（0 K），物理上不可能！', 'Below absolute zero — impossible!')}</p>` : ''}`;
  };
  root.querySelector('[data-c]').oninput = calc;
  calc();
}

function lensCalc(root) {
  root.innerHTML = `<div class="card"><b>🔍 ${L('薄透鏡成像計算器', 'Thin-lens calculator')}</b>（1/f = 1/p + 1/q）
    <div class="row" style="margin:.5rem 0"><label>${L('焦距', 'focal length')} f (cm) <input type="number" data-f value="10" step="any" style="width:90px"></label>
    <label>${L('物距', 'object distance')} p (cm) <input type="number" data-p value="30" step="any" min="0" style="width:90px"></label></div>
    <p class="small muted">${L('凸透鏡 convex lens 的 f 為正，凹透鏡 concave lens 的 f 為負。', 'f > 0 for a convex lens, f < 0 for a concave lens.')}</p><div data-out></div></div>`;
  const calc = () => {
    const f = parseFloat(root.querySelector('[data-f]').value), p = parseFloat(root.querySelector('[data-p]').value);
    const out = root.querySelector('[data-out]');
    if (!f || !(p > 0)) { out.innerHTML = ''; return; }
    if (Math.abs(p - f) < 1e-9) { out.innerHTML = `<p>${L('物體在焦點上：折射光平行，不成像（成像在無窮遠）。', 'Object at the focal point: no image (at infinity).')}</p>`; return; }
    const q = 1 / (1 / f - 1 / p), m = -q / p;
    out.innerHTML = `<p>${L('像距', 'Image distance')} q = <b>${fmt(q)} cm</b>　${L('放大率', 'Magnification')} m = <b>${fmt(m)}</b></p>
      <p>${q > 0 ? L('實像（在透鏡另一側，可成像在屏幕上）', 'Real image (other side of the lens)') : L('虛像（與物體同側，屏幕接不到）', 'Virtual image (same side as the object)')}・${m < 0 ? L('倒立', 'inverted') : L('正立', 'upright')}・${Math.abs(m) > 1 ? L('放大', 'enlarged') : Math.abs(m) < 1 ? L('縮小', 'reduced') : L('等大', 'same size')}</p>`;
  };
  root.querySelectorAll('input').forEach((i) => (i.oninput = calc));
  calc();
}

function resistorCalc(root) {
  root.innerHTML = `<div class="card"><b>🔌 ${L('等效電阻與歐姆定律', "Equivalent resistance & Ohm's law")}</b>
    <div class="row" style="margin:.5rem 0"><label>R₁ (Ω) <input type="number" data-r1 value="6" min="0" step="any" style="width:80px"></label>
    <label>R₂ (Ω) <input type="number" data-r2 value="3" min="0" step="any" style="width:80px"></label>
    <label>${L('電動勢', 'EMF')} ε (V) <input type="number" data-v value="12" step="any" style="width:80px"></label></div><div data-out></div></div>`;
  const calc = () => {
    const r1 = parseFloat(root.querySelector('[data-r1]').value), r2 = parseFloat(root.querySelector('[data-r2]').value), v = parseFloat(root.querySelector('[data-v]').value);
    const out = root.querySelector('[data-out]');
    if (!(r1 > 0) || !(r2 > 0) || !Number.isFinite(v)) { out.innerHTML = `<p class="small muted">${L('請輸入大於 0 的電阻。', 'Enter resistances greater than 0.')}</p>`; return; }
    const s2 = r1 + r2, p = (r1 * r2) / (r1 + r2);
    out.innerHTML = `<div class="table-wrap"><table style="max-width:460px"><tr><th></th><th>${L('等效電阻', 'Equivalent R')}</th><th>${L('總電流', 'Current')} I = ε/R</th><th>${L('總功率', 'Power')} P = εI</th></tr>
      <tr><td>${L('串聯', 'Series')}</td><td>${fmt(s2)} Ω</td><td>${fmt(v / s2)} A</td><td>${fmt((v * v) / s2)} W</td></tr>
      <tr><td>${L('並聯', 'Parallel')}</td><td>${fmt(p)} Ω</td><td>${fmt(v / p)} A</td><td>${fmt((v * v) / p)} W</td></tr></table></div>
      <p class="small muted">${L('串聯：R = R₁ + R₂；並聯：1/R = 1/R₁ + 1/R₂（並聯後的等效電阻比任一個都小）。', 'Series adds; parallel adds reciprocals (smaller than either).')}</p>`;
  };
  root.querySelectorAll('input').forEach((i) => (i.oninput = calc));
  calc();
}

export const CALCS = { u06: tempCalc, u08: lensCalc, u09: resistorCalc };

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
  svg += `<circle cx="${cx}" cy="${cy}" r="62" fill="#1e2340"/><text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" font-weight="800" style="fill:#fff">${L('物理', 'Physics')}</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="13" style="fill:#bae6fd">${L('專業英文', 'English')}</text>`;
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
    <div class="card mindmap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${L('單元單字關聯圖', 'Unit word network')}">${lines}<circle cx="${cx}" cy="${cy}" r="58" fill="#1d5fd6"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="14" font-weight="800" style="fill:#fff">${esc(u.title.slice(0, 8))}</text>${nodes}</svg></div>
    <a class="btn ghost" href="#/map">← ${L('回全冊心智圖', 'Back to full map')}</a>`;
}
