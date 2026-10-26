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
  u01: [['scientific-method', '科學探究從提出問題開始，形成可檢驗的假說，再以材料與方法設計實驗，最後整理結果並討論。', 'Inquiry: problem → hypothesis → materials & methods → result → discussion.', ['problem', 'hypothesis', 'material and method', 'result', 'discussion']],
    ['systems', '生命系統有多個層次，各部分交互作用會出現單一部分沒有的「突現」性質，常是自我組織、無中央控制的。', 'Living systems are multi-level; interactions give emergent, self-organised, decentralised behaviour.', ['emergence', 'self-organization', 'decentralized', 'multiple level', 'holistic']]],
  u02: [['microscope', '複式光學顯微鏡是基本工具；位相差、微分干涉差可觀察未染色的活細胞。', 'Light microscopes; phase contrast & DIC show unstained living cells.', ['microscope', 'phase contrast microscope', 'differential interference contrast']],
    ['microscope-advanced', '螢光與共軛焦顯微鏡利用螢光標記與針孔，取得清楚的光學切片。', 'Fluorescence & confocal microscopy use fluorescent labels and a pinhole.', ['fluorescence microscopy', 'confocal microscopy']],
    ['lab-solution', '強酸在水中幾乎完全解離、弱酸部分解離；緩衝液能抵抗 pH 變化。', 'Strong acids ionise fully, weak acids partly; buffers resist pH change.', ['strong acid', 'weak acid', 'phosphate buffer']]],
  u03: [['prokaryote', '原核細胞沒有細胞核，DNA 位於擬核區，常有質體、線毛、鞭毛與莢膜。', 'Prokaryotes lack a nucleus; DNA sits in the nucleoid region.', ['nucleoid region', 'plasmid', 'pili', 'capsule']],
    ['nucleus', '真核細胞的細胞核由核膜包圍，內有核仁與染色質。', 'The eukaryotic nucleus has a nuclear membrane, nucleolus and chromatin.', ['nucleus', 'nuclear membrane', 'nucleolus', 'chromatin']],
    ['endomembrane', '分泌路徑：粗糙型內質網上的核糖體合成蛋白質 → 囊泡 → 高基氏體修飾分選 → 分泌。', 'Secretory pathway: rough ER → vesicle → Golgi → secretion.', ['rough endoplasmic reticulum', 'vesicle', 'Golgi apparatus', 'secretory pathway']],
    ['cell-plant', '植物細胞另有細胞壁、中央液泡與葉綠體。', 'Plant cells add a cell wall, central vacuole and chloroplasts.', ['cell wall', 'central vacuole', 'chloroplast']]],
  u04: [['membrane', '流體鑲嵌模型：磷脂雙層像流體，蛋白質鑲嵌其中可移動。', 'Fluid mosaic model: proteins float in a phospholipid bilayer.', ['Fluid Mosaic Model']],
    ['channel', '運輸蛋白讓特定物質通過，例如離子通道與水通道蛋白。', 'Transport proteins such as ion channels and aquaporins.', ['transport protein', 'ion channel', 'aquaporin']],
    ['cytoskeleton', '細胞骨架由微管、中間絲、微絲三種纖維組成。', 'Cytoskeleton: microtubules, intermediate filaments, microfilaments.', ['microtubule', 'intermediate filaments', 'microfilament']]],
  u05: [['glycolysis', '糖解作用在細胞質中把葡萄糖分解成兩分子丙酮酸。', 'Glycolysis splits glucose into two pyruvate in the cytosol.', ['glycolysis']],
    ['krebs', '丙酮酸轉成乙醯輔酶 A 進入克氏循環（檸檬酸循環、三羧酸循環），釋出 CO2。', 'Acetyl-CoA enters the Krebs (citric acid / TCA) cycle.', ['acetyl-CoA', 'Krebs cycle', 'citric acid cycle']],
    ['etc', '電子傳遞鏈在粒線體內膜，以氧化磷酸化產生大量 ATP。', 'The electron transport chain drives oxidative phosphorylation.', ['electron transport chain', 'oxidative phosphorylation']],
    ['fermentation', '無氧時，細胞以酒精發酵或乳酸發酵再生 NAD⁺。', 'Without O2: alcohol or lactic acid fermentation.', ['alcohol fermentation', 'lactic acid fermentation']]],
  u06: [['chloroplast', '光合作用在葉綠體進行：光反應在類囊體膜，固碳反應在基質。', 'Light reactions on thylakoids; carbon reactions in the stroma.', ['chloroplast', 'thylakoid', 'granum']],
    ['light-reaction', '天線色素吸收光能，傳給反應中心，再交給初級電子接受者。', 'Antenna pigments funnel energy to the reaction center.', ['antenna pigment', 'reaction center', 'primary electron acceptor', 'photosystem']],
    ['calvin', '卡爾文循環：RuBP 固定 CO2 形成 3-PGA，再還原成 G3P，並再生 RuBP。', 'Calvin cycle: RuBP + CO2 → 3-PGA → G3P → RuBP.', ['Calvin cycle', 'ribulose-1,5-bisphosphate', '3-phosphoglycerate', 'glyceraldehyde-3-phosphate']]],
  u07: [['cell-cycle', '細胞週期分為間期（G1、S、G2）與分裂期（M）。', 'Cell cycle: interphase (G1, S, G2) and mitotic phase.', ['cell cycle', 'interphase', 'mitotic phase']],
    ['chromosome', '複製後的染色體由兩條姊妹染色分體在著絲點相連。', 'A replicated chromosome = two sister chromatids.', ['chromosome', 'sister chromatids', 'chromatin']],
    ['mitosis', '有絲分裂：前期 → 前中期 → 中期（排在中期板）→ 後期 → 末期。', 'Mitosis: prophase → prometaphase → metaphase → anaphase → telophase.', ['prophase', 'prometaphase', 'metaphase', 'anaphase', 'telophase']]],
  u08: [['meiosis', '減數分裂 I 同源染色體聯會形成四分體並分離；減數分裂 II 分開姊妹染色分體。', 'Meiosis I separates homologues (tetrads); meiosis II separates chromatids.', ['meiosis I', 'synapsis', 'tetrad', 'meiosis II']],
    ['gametes', '初級精母細胞 → 次級精母細胞 → 精細胞；卵母細胞分裂時產生極體。', 'Spermatocytes → spermatids; oocytes produce polar bodies.', ['primary spermatocyte', 'secondary spermatocyte', 'spermatid', 'polar body']],
    ['fertilization', '單倍體（n）的精子與卵受精，形成二倍體（2n）受精卵。', 'Haploid gametes fuse into a diploid zygote.', ['haploid', 'diploid', 'fertilization']]],
  u09: [['punnett', '分離律：成對的等位基因在形成配子時分離。用下方棋盤方格自己試試！', 'Law of segregation — try the Punnett square below!', ['law of segregation', 'allele', 'genotype', 'phenotype']],
    ['phenotype-blend', '不完全顯性產生中間型；共顯性兩種性狀同時表現。', 'Incomplete dominance blends; codominance shows both.', ['incomplete dominance', 'codominance']],
    ['pedigree', '譜系圖可追蹤性狀在家族中的遺傳。', 'Pedigrees trace traits through families.', ['pedigree', 'sex-linked inheritance']]],
  u10: [['dna', 'DNA 雙股以互補鹼基配對（A–T、C–G）結合。', 'DNA strands pair A–T and C–G.', ['complementary base pairing']],
    ['replication', 'DNA 聚合酶以半保留方式複製：每個新分子含一條舊股與一條新股。', 'Semiconservative replication by DNA polymerase.', ['semiconservative replication', 'DNA polymerase']],
    ['central-dogma', '中心法則：DNA 經轉錄成 RNA，再轉譯成蛋白質。', 'Central dogma: DNA → RNA → protein.', ['central dogma', 'transcription', 'translation', 'RNA polymerase']]],
  u11: [['plasmid-gmo', '把目標基因接入質體，製造基因轉殖生物。', 'Insert a target gene into a plasmid to make a transgenic organism.', ['target gene', 'transgenic organism', 'genetically modified organism']],
    ['gene-transfer', '常用轉殖方法：粒子槍法、微注射法、農桿菌感染法。', 'Gene transfer: gene gun, microinjection, Agrobacterium.', ['microprojectile bombardment', 'microinjection', 'Agrobacteria infection method']],
    ['reporter', '標誌基因幫忙篩選成功轉殖的細胞，報導基因讓表現情形看得見。', 'Marker genes select; reporter genes make expression visible.', ['selective marker genes', 'reporter genes']]],
  u12: [['blastocyst', '囊胚的內細胞群可取得胚胎幹細胞。', 'Embryonic stem cells come from the inner cell mass.', ['blastocyst', 'inner cell mass', 'embryonic stem cells']],
    ['stem-cell', '分化潛能由大到小：全能 → 多能 → 多潛能 → 寡能 → 單能。', 'Potency: totipotent → pluripotent → multipotent → oligopotent → unipotent.', ['totipotent', 'pluripotent', 'multipotent', 'oligopotent', 'unipotent']],
    ['blood-lineage', '造血幹細胞分出骨髓系與淋巴系幹細胞。', 'Hematopoietic stem cells give myeloid and lymphoid lines.', ['hematopoietic stem cell', 'myeloid stem cell', 'lymphoid stem cell']]],
  u13: [['natural-selection', '族群內有變異，適應環境者較能存活與繁殖（適者生存）。', 'Variation + selection → survival of the fittest.', ['variation', 'theory of natural selection', 'the survival of the fittest']],
    ['adaptive-radiation', '同一祖先分化出多種適應不同環境的物種。', 'One ancestor radiates into many adapted species.', ['adaptive radiation', 'adaption']],
    ['evolution-tree', '所有物種可追溯到共同祖先。', 'All species share common descent.', ['common descent', 'evolution']]],
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

/** 孟德爾遺傳：棋盤方格計算器 */
export function punnett(root) {
  root.innerHTML = `<div class="card"><b>🧮 ${L('棋盤方格計算器（單一性狀）', 'Punnett square (one gene)')}</b>
    <div class="row" style="margin:.5rem 0"><label>${L('親代 1', 'Parent 1')} <select data-a>${['AA', 'Aa', 'aa'].map((g) => `<option ${g === 'Aa' ? 'selected' : ''}>${g}</option>`).join('')}</select></label>
    <label>${L('親代 2', 'Parent 2')} <select data-b>${['AA', 'Aa', 'aa'].map((g) => `<option ${g === 'Aa' ? 'selected' : ''}>${g}</option>`).join('')}</select></label>
    <label>${L('顯性模式', 'Dominance')} <select data-m><option value="c">${L('完全顯性', 'Complete')}</option><option value="i">${L('不完全顯性', 'Incomplete')}</option></select></label></div>
    <div data-out></div></div>`;
  const calc = () => {
    const a = root.querySelector('[data-a]').value, b = root.querySelector('[data-b]').value, m = root.querySelector('[data-m]').value;
    const cells = [];
    for (const x of a) for (const y of b) cells.push([x, y].sort().join(''));
    const cnt = {}; cells.forEach((c) => { cnt[c] = (cnt[c] || 0) + 1; });
    const ph = (g) => (m === 'c' ? (g.includes('A') ? L('顯性表現型', 'dominant') : L('隱性表現型', 'recessive')) : ({ AA: L('紅', 'red'), Aa: L('粉紅（中間型）', 'pink (intermediate)'), aa: L('白', 'white') })[g]);
    const phc = {}; cells.forEach((c) => { phc[ph(c)] = (phc[ph(c)] || 0) + 1; });
    root.querySelector('[data-out]').innerHTML = `<div class="table-wrap"><table style="max-width:320px;text-align:center"><tr><th></th><th>${b[0]}</th><th>${b[1]}</th></tr>
      <tr><th>${a[0]}</th><td>${cells[0]}</td><td>${cells[1]}</td></tr><tr><th>${a[1]}</th><td>${cells[2]}</td><td>${cells[3]}</td></tr></table></div>
      <p>${L('基因型比例', 'Genotype ratio')} genotype：${Object.entries(cnt).map(([g, n]) => `${g} ${n}/4`).join('，')}<br>
      ${L('表現型比例', 'Phenotype ratio')} phenotype：${Object.entries(phc).map(([g, n]) => `${g} ${n}/4`).join('，')}</p>
      <p class="small muted">${a === 'Aa' && b === 'aa' || a === 'aa' && b === 'Aa' ? L('這就是「試交 test cross」：用隱性同型合子判斷另一親代的基因型。', 'This is a test cross.') : L('AA、aa 是同型合子 homozygote；Aa 是異型合子 heterozygote。', 'AA/aa = homozygote; Aa = heterozygote.')}</p>`;
  };
  root.querySelectorAll('select').forEach((s) => s.onchange = calc);
  calc();
}

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
  svg += `<circle cx="${cx}" cy="${cy}" r="62" fill="#1e2340"/><text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" font-weight="800" style="fill:#fff">${L('生物科學', 'Biology')}</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="13" style="fill:#c7d2fe">${L('專業英文', 'English')}</text>`;
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
    <div class="card mindmap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${L('單元單字關聯圖', 'Unit word network')}">${lines}<circle cx="${cx}" cy="${cy}" r="58" fill="#5146e5"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="14" font-weight="800" style="fill:#fff">${esc(u.title.slice(0, 8))}</text>${nodes}</svg></div>
    <a class="btn ghost" href="#/map">← ${L('回全冊心智圖', 'Back to full map')}</a>`;
}
