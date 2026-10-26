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
  u01: [['matter-tree', '物質分為純物質與混合物；純物質又分元素與化合物，混合物分均勻與不均勻。', 'Matter → pure substances (elements, compounds) or mixtures (homogeneous, heterogeneous).', ['matter', 'element', 'compound', 'mixture', 'homogeneous', 'heterogeneous']],
    ['carbon-allotropes', '同一元素的不同單質稱為同素異形體，例如鑽石與石墨。', 'Allotropes are different forms of one element, e.g. diamond and graphite.', ['allotrope', 'diamond', 'graphite']],
    ['atomic-models', '化學從煉金術發展而來，原子學說奠定了現代化學。', 'Chemistry grew out of alchemy; atomism laid its foundation.', ['alchemy', 'atomism', 'chemistry']]],
  u02: [['lab-equipment', '天平秤質量、滴管取少量液體、溫度計量溫度。', 'Balances weigh, droppers transfer drops, thermometers read temperature.', ['balance', 'dropper', 'thermometer', 'meter']],
    ['filtration', '過濾分離固液；傾析倒出上層清液。', 'Filtration and decantation separate solids from liquids.', ['filtration', 'decantation', 'separation']],
    ['distillation', '蒸餾利用沸點差分離液體。', 'Distillation separates liquids by boiling point.', ['distillation', 'evaporation', 'boiling']],
    ['chromatography', '層析與萃取依物質在兩相中的分配不同而分離。', 'Chromatography and extraction separate by partitioning.', ['chromatography', 'extraction', 'purification', 'recrystallization']],
    ['titration', '滴定到指示劑變色的終點；標定用來確定標準溶液濃度。', 'Titrate to the end point; standardise the titrant.', ['end point', 'standardization']]],
  u03: [['atom-structure', '原子由原子核（質子、中子）與電子組成；質子數決定元素。下方可以自己算。', 'Atoms: nucleus (protons, neutrons) and electrons — try the calculator below.', ['atom', 'proton', 'neutron', 'nucleus']],
    ['isotopes', '同位素質子數相同、中子數不同；同重素質量數相同。', 'Isotopes share proton number; isobars share mass number.', ['isotope', 'isobar', 'mass']],
    ['orbitals', '電子位於殼層與副殼層，軌域是電子出現機率高的區域（不同於軌道）。', 'Electrons occupy shells, subshells and orbitals (not orbits).', ['shell', 'subshell', 'orbital', 'orbit']],
    ['line-spectrum', '電子在能階間躍遷放出特定波長的光，形成光譜。', 'Electron transitions give line spectra.', ['spectrum', 'spectrometer', 'Bohr']]],
  u04: [['periodic-table', '週期表的橫列為週期、直行為族；左側金屬、右側非金屬，交界為類金屬。', 'Periods are rows, groups are columns; metals left, nonmetals right, metalloids between.', ['period', 'group', 'family', 'metal', 'nonmetal', 'metalloid']],
    ['element-families', '第 17 族鹵素活性大；第 18 族鈍氣很穩定；鑭系與錒系位於下方。', 'Halogens are reactive; noble gases are stable; lanthanides and actinides sit below.', ['halogen', 'noble gas', 'lanthanides', 'actinides']],
    ['minerals', '礦物是天然的結晶物質，例如石英、黃鐵礦、方鉛礦、鋁礬土。', 'Minerals: quartz, pyrite, galena, bauxite.', ['mineral', 'quartz', 'pyrite', 'galena', 'bauxite']]],
  u05: [['covalent-bond', '共價鍵由原子共用電子對形成。', 'Covalent bonds share electron pairs.', ['chemical bond', 'covalent', 'bonding']],
    ['electronegativity', '電負度差越大，鍵的極性越大。', 'Bigger electronegativity difference → more polar bond.', ['electronegativity', 'overlap']],
    ['hybridization', '甲烷的碳以 sp³ 混成，形成 109.5° 的四面體。', 'Carbon in methane is sp³ hybridised (tetrahedral).', ['hybridization', 'hybrid']],
    ['complex-ligand', '配位基以孤對電子與中心金屬結合；雙牙團可形成螯合物。', 'Ligands bind a metal; bidentate ligands form chelates.', ['ligand', 'bidentate', 'chelate', 'complex']],
    ['isomers', '分子式相同、結構不同即為異構物，包括順反與立體異構。', 'Isomers share a formula but differ in structure.', ['isomer', 'stereoisomer', 'conformation']]],
  u06: [['phase-changes', '熔化、凝固、蒸發、昇華、凝華都是相變。', 'Melting, freezing, evaporation, sublimation and deposition are phase changes.', ['freezing', 'evaporation', 'sublimation', 'deposition', 'phase']],
    ['crystal-lattice', '晶體粒子規則排列成晶格，如六方與單斜晶系；玻璃為非晶質。', 'Crystals form lattices; glass is amorphous.', ['crystal', 'lattice', 'hexagonal', 'monoclinic', 'amorphous']],
    ['liquid-crystal', '液晶分子有方向性，分為向列型、層列型與膽固醇型。', 'Liquid crystals: nematic, smectic, cholesteric.', ['nematic', 'smectic', 'cholesteric']],
    ['carbon-allotropes', '碳的奈米材料：富勒烯與奈米碳管。', 'Carbon nanomaterials: fullerenes and nanotubes.', ['fullerenes', 'nanotube', 'nanomaterials', 'nanoparticle']]],
  u07: [['mole-concept', '1 莫耳含 6.02×10²³ 個粒子（亞佛加厥數）。下方可以換算莫耳與濃度。', 'One mole = 6.02×10²³ particles — try the calculator below.', ['mol', 'mole', 'Avogadro']],
    ['concentration', '體積莫耳濃度 M = 溶質 mol / 溶液 L；重量莫耳濃度 m = 溶質 mol / 溶劑 kg。', 'Molarity = mol/L of solution; molality = mol/kg of solvent.', ['molarity', 'molality', 'normality', 'concentration']],
    ['reaction-equation', '依反應式計算理論產量，實際產量 ÷ 理論產量 = 產率。', 'Percentage yield = actual ÷ theoretical × 100%.', ['reactant', 'product', 'yield', 'actual']],
    ['energy-units', '能量單位：1 cal = 4.184 J，1 kJ = 1000 J。', 'Energy units: 1 cal = 4.184 J.', ['joule', 'kilojoule', 'calorie']]],
  u08: [['solution', '溶液由溶質溶在溶劑中形成；溶解度是飽和時溶解的量。', 'Solutes dissolve in solvents; solubility is the saturated amount.', ['solution', 'solute', 'solubility', 'miscible', 'aqueous']],
    ['colloid', '膠體粒子 1–1000 nm，會產生廷得耳效應；溶膠、凝膠、乳液、泡沫都是膠體。', 'Colloids scatter light (Tyndall effect): sols, gels, emulsions, foams.', ['colloid', 'sol', 'gel', 'emulsion', 'foam']],
    ['micelle', '界面活性劑一端親水、一端疏水，在水中形成微胞包住油污。', 'Surfactants form micelles that trap grease.', ['surfactant', 'micelle', 'hydrophilic', 'hydrophobic', 'soap']],
    ['osmosis', '滲透：水分子穿過半透膜，由稀溶液往濃溶液移動。', 'Osmosis: water moves through a membrane toward higher concentration.', ['osmosis', 'diffusion']]],
  u09: [['enthalpy-diagram', '放熱反應 ΔH < 0，吸熱反應 ΔH > 0。', 'Exothermic ΔH < 0; endothermic ΔH > 0.', ['enthalpy', 'exothermic', 'endothermic', 'thermochemistry']],
    ['activation-energy', '反應需越過活化能；催化劑降低活化能，但不改變 ΔH。', 'Catalysts lower activation energy, not ΔH.', ['activation', 'catalyst', 'inhibitor']],
    ['collision-theory', '只有能量足夠且方位正確的碰撞才會反應。', 'Only energetic, well-oriented collisions react.', ['collision', 'reaction']],
    ['combustion', '燃燒是快速的氧化反應，需要燃料、氧氣與足夠溫度。', 'Combustion needs fuel, oxygen and heat.', ['combustion', 'oxygen']]],
  u10: [['ph-scale', 'pH = −log[H⁺]；25 °C 時 pH 7 為中性。下方可以計算 pH。', 'pH = −log[H⁺]; pH 7 is neutral at 25 °C — try the calculator.', ['acid', 'base', 'acidity', 'alkaline']],
    ['conjugate-pair', '酸失去 H⁺ 成為共軛鹼；兩性物質可當酸也可當鹼。', 'An acid loses H⁺ to form its conjugate base; amphoteric species do both.', ['conjugate', 'amphoteric', 'zwitterion']],
    ['neutralization', '酸＋鹼→鹽＋水；制酸劑中和胃酸。', 'Acid + base → salt + water; antacids neutralise stomach acid.', ['salt', 'acid salt', 'antacid']]],
  u11: [['redox', '氧化是失去電子、還原是得到電子；氧化劑使別人氧化，本身被還原。', 'Oxidation loses electrons, reduction gains them.', ['oxidant', 'reductant', 'reduction', 'disproportionation']],
    ['galvanic-cell', '伽凡尼電池中，陽極發生氧化、陰極發生還原，電子經導線由陽極流向陰極。', 'In a galvanic cell, oxidation at the anode, reduction at the cathode.', ['anode', 'cathode', 'electrode', 'battery', 'galvanic']],
    ['electrolysis', '陽離子移向陰極、陰離子移向陽極；電泳依電荷分離粒子。', 'Cations move to the cathode, anions to the anode; electrophoresis separates by charge.', ['cation', 'anion', 'electrophoresis', 'nonelectrolyte']]],
  u12: [['alkane-series', '烷烴只有單鍵，依碳數命名：甲、乙、丙、丁、戊。', 'Alkanes have single bonds: methane, ethane, propane, butane, pentane.', ['methane', 'ethane', 'pentane', 'alkane']],
    ['alkene-alkyne', '烯有 C=C 雙鍵、炔有 C≡C 參鍵。', 'Alkenes have C=C, alkynes C≡C.', ['propene', 'ethyne', 'propyne', 'alkyne']],
    ['aromatic', '芳香烴含苯環，如苯、甲苯、二甲苯。', 'Arenes contain benzene rings.', ['benzene', 'toluene', 'xylene', 'arene']],
    ['petroleum', '石油經分餾、裂解與重組，得到燃料與石化原料。', 'Petroleum is fractionated, cracked and reformed.', ['petroleum', 'cracking', 'reforming', 'knocking']]],
  u13: [['functional-groups', '官能基決定有機物的性質：醇、醛、酮、羧酸、酯、胺、醯胺。', 'Functional groups: alcohols, aldehydes, ketones, acids, esters, amines, amides.', ['alcohol', 'aldehydes', 'ketones', 'ester', 'amine', 'amide']],
    ['esterification', '酸與醇脫水縮合成酯；油脂與鹼皂化成肥皂。', 'Esterification and saponification.', ['saponification', 'condensation', 'dehydration']],
    ['benzene-resonance', '酚與苯胺都含苯環，π 電子非定域化。', 'Phenol and aniline contain delocalised benzene rings.', ['phenol', 'aniline', 'delocalization']]],
  u14: [['polymerization', '單體以加成或縮合反應連成聚合物。', 'Monomers join by addition or condensation polymerisation.', ['monomer', 'polymer', 'polymerization', 'copolymer']],
    ['plastics', '熱塑性塑膠可再加熱塑形；熱固性塑膠交聯後不能再熔化。', 'Thermoplastics remelt; thermosets do not.', ['thermoplastic', 'thermosetting', 'plastic', 'polyethylene']],
    ['fibers', '尼龍與克維拉是醯胺鍵相連的高強度纖維。', 'Nylon and Kevlar are polyamide fibres.', ['nylon', 'Kevlar', 'polyester', 'fiber']],
    ['chip-making', '晶片製程：晶圓塗光阻、透過光罩曝光、蝕刻與摻雜。', 'Chip making: wafer, photoresist, mask, doping.', ['wafer', 'photoresist', 'mask', 'doping', 'semiconductor']]],
  u15: [['carbohydrates', '醣類分為單醣、雙醣與多醣。', 'Carbohydrates: mono-, di- and polysaccharides.', ['glucose', 'fructose', 'sucrose', 'starch', 'cellulose']],
    ['proteins', '胺基酸以肽鍵連成多肽與蛋白質；加熱會使蛋白質變性。', 'Amino acids form polypeptides; heat denatures proteins.', ['protein', 'polypeptide', 'denaturation', 'glycine']],
    ['enzyme', '酵素與受質專一結合，降低活化能。', 'Enzymes bind substrates specifically.', ['enzyme', 'substrate', 'specificity', 'coenzyme']],
    ['nucleobases', '核酸鹼基：A–T（DNA）或 A–U（RNA）、C–G 互補配對。', 'Nucleobases pair A–T (or A–U) and C–G.', ['adenine', 'thymine', 'cytosine', 'guanine', 'uracil']]],
  u17: [['drugs', '藥物有療效也有劑量限制；止痛、消炎、抗生素各有作用，部分為管制藥品。', 'Drugs work within safe doses; analgesics, anti-inflammatories, antibiotics; some are controlled.', ['aspirin', 'acetaminophen', 'penicillin', 'analgesic', 'dose']],
    ['tea-coffee', '茶含兒茶素、茶黃素、茶紅素；咖啡與茶含咖啡因。', 'Tea has catechins and theaflavins; tea and coffee contain caffeine.', ['catechin', 'theaflavin', 'thearubigin', 'caffeine', 'polyphenols']],
    ['lipids', '油脂由甘油與脂肪酸組成；氧化會使油脂酸敗，抗氧化劑可延緩。', 'Fats are glycerol + fatty acids; oxidation causes rancidity, antioxidants slow it.', ['fat', 'oil', 'margarine', 'rancidity', 'antioxidant']]],
  u16: [['atmosphere-layers', '大氣由下而上：對流層、平流層、中氣層、增溫層。', 'Troposphere, stratosphere, mesosphere, thermosphere.', ['troposphere', 'stratosphere', 'mesosphere', 'thermosphere', 'ionosphere']],
    ['ozone', '平流層的臭氧吸收紫外線；氟氯烷與海龍會破壞臭氧層。', 'Stratospheric ozone absorbs UV; CFCs and halons destroy it.', ['ozone', 'freon', 'halon', 'ultraviolet']],
    ['water-treatment', '酸雨與優養化危害水域；水處理包括凝聚、曝氣與消毒。', 'Acid rain, eutrophication and water treatment.', ['acid rain', 'eutrophication', 'aeration', 'disinfection']],
    ['radioactivity', '放射性元素會衰變；核分裂與核融合釋放巨大能量。', 'Radioactive decay, fission and fusion.', ['radioactivity', 'radon', 'fission', 'fusion']]],
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

/** 化學互動計算器：依單元提供（原子組成、莫耳與濃度、pH） */
const fmt = (x, d = 3) => (Number.isFinite(x) ? Number(x.toPrecision(d)).toString() : '—');

function atomCalc(root) {
  root.innerHTML = `<div class="card"><b>⚛️ ${L('原子組成計算器', 'Atomic composition')}</b>
    <div class="row" style="margin:.5rem 0"><label>${L('原子序', 'atomic number')} Z <input type="number" data-z value="6" min="1" step="1" style="width:80px"></label>
    <label>${L('質量數', 'mass number')} A <input type="number" data-a value="14" min="1" step="1" style="width:80px"></label>
    <label>${L('電荷', 'charge')} <input type="number" data-q value="0" step="1" style="width:70px"></label></div><div data-out></div></div>`;
  const calc = () => {
    const z = parseInt(root.querySelector('[data-z]').value, 10), a = parseInt(root.querySelector('[data-a]').value, 10), q = parseInt(root.querySelector('[data-q]').value, 10) || 0;
    const out = root.querySelector('[data-out]');
    if (!(z > 0) || !(a >= z)) { out.innerHTML = `<p class="small muted">${L('質量數 A 必須大於或等於原子序 Z。', 'A must be ≥ Z.')}</p>`; return; }
    const e = z - q;
    out.innerHTML = `<p>${L('質子', 'Protons')} proton：<b>${z}</b>　${L('中子', 'Neutrons')} neutron：<b>${a - z}</b>　${L('電子', 'Electrons')} electron：<b>${e < 0 ? '—' : e}</b></p>
      <p class="small muted">${L('中子數 = A − Z；電子數 = Z − 電荷。質子數相同、中子數不同的原子互為同位素 isotope（例如 C-12、C-14）。', 'n = A − Z; electrons = Z − charge. Same Z, different n → isotopes.')}${q > 0 ? L('　帶正電：陽離子 cation', '　Positive: cation') : q < 0 ? L('　帶負電：陰離子 anion', '　Negative: anion') : ''}</p>`;
  };
  root.querySelectorAll('input').forEach((i) => (i.oninput = calc));
  calc();
}

function moleCalc(root) {
  root.innerHTML = `<div class="card"><b>🧪 ${L('莫耳與體積莫耳濃度', 'Moles & molarity')}</b>
    <div class="row" style="margin:.5rem 0"><label>${L('溶質質量', 'mass')} (g) <input type="number" data-m value="5.85" min="0" step="any" style="width:90px"></label>
    <label>${L('莫耳質量', 'molar mass')} (g/mol) <input type="number" data-mm value="58.5" min="0" step="any" style="width:90px"></label>
    <label>${L('溶液體積', 'volume')} (mL) <input type="number" data-v value="250" min="0" step="any" style="width:90px"></label></div>
    <p class="small muted">${L('預設為 5.85 g NaCl（58.5 g/mol）配成 250 mL。', 'Default: 5.85 g NaCl (58.5 g/mol) in 250 mL.')}</p><div data-out></div></div>`;
  const calc = () => {
    const m = parseFloat(root.querySelector('[data-m]').value), mm = parseFloat(root.querySelector('[data-mm]').value), v = parseFloat(root.querySelector('[data-v]').value);
    const out = root.querySelector('[data-out]');
    if (!(m >= 0) || !(mm > 0) || !(v > 0)) { out.innerHTML = `<p class="small muted">${L('請輸入大於 0 的數值。', 'Enter positive values.')}</p>`; return; }
    const n = m / mm, M = n / (v / 1000), N = n * 6.022e23;
    out.innerHTML = `<p>${L('莫耳數', 'Amount')} n = m / M = <b>${fmt(n)} mol</b>　${L('粒子數', 'Particles')} ≈ <b>${N.toExponential(3).replace('e+', ' × 10^')}</b><br>
      ${L('體積莫耳濃度', 'Molarity')} = n / V = <b>${fmt(M)} M</b>（mol/L）</p>`;
  };
  root.querySelectorAll('input').forEach((i) => (i.oninput = calc));
  calc();
}

function phCalc(root) {
  root.innerHTML = `<div class="card"><b>🧫 ${L('pH 計算器（25 °C）', 'pH calculator (25 °C)')}</b>
    <div class="row" style="margin:.5rem 0"><label>[H⁺] (mol/L) <input type="number" data-h value="0.001" min="0" step="any" style="width:120px"></label>
    <span class="muted">${L('或', 'or')}</span><label>pH <input type="number" data-ph step="any" style="width:80px"></label></div><div data-out></div></div>`;
  const hIn = root.querySelector('[data-h]'), pIn = root.querySelector('[data-ph]');
  const show = (h) => {
    const ph = -Math.log10(h), poh = 14 - ph, oh = 1e-14 / h;
    const kind = Math.abs(ph - 7) < 1e-9 ? L('中性', 'neutral') : ph < 7 ? L('酸性 acidic', 'acidic') : L('鹼性 basic／alkaline', 'basic / alkaline');
    root.querySelector('[data-out]').innerHTML = `<p>pH = −log[H⁺] = <b>${fmt(ph, 4)}</b>　pOH = <b>${fmt(poh, 4)}</b>　[OH⁻] = <b>${oh.toExponential(2)}</b> M　→ <b>${kind}</b></p>
      <p class="small muted">${L('pH 每差 1，[H⁺] 相差 10 倍；pH + pOH = 14。', 'Each pH unit is a 10× change in [H⁺]; pH + pOH = 14.')}</p>`;
  };
  hIn.oninput = () => { const h = parseFloat(hIn.value); if (h > 0) { pIn.value = fmt(-Math.log10(h), 4); show(h); } };
  pIn.oninput = () => { const p = parseFloat(pIn.value); if (Number.isFinite(p)) { const h = 10 ** -p; hIn.value = h.toExponential(3); show(h); } };
  hIn.oninput();
}

export const CALCS = { u03: atomCalc, u07: moleCalc, u10: phCalc };

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
  svg += `<circle cx="${cx}" cy="${cy}" r="62" fill="#1e2340"/><text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" font-weight="800" style="fill:#fff">${L('化學', 'Chemistry')}</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="13" style="fill:#bae6fd">${L('專業英文', 'English')}</text>`;
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
    <div class="card mindmap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${L('單元單字關聯圖', 'Unit word network')}">${lines}<circle cx="${cx}" cy="${cy}" r="58" fill="#0f7a55"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="14" font-weight="800" style="fill:#fff">${esc(u.title.slice(0, 8))}</text>${nodes}</svg></div>
    <a class="btn ghost" href="#/map">← ${L('回全冊心智圖', 'Back to full map')}</a>`;
}
