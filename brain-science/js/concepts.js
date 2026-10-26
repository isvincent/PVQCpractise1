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
  u01: [['neuron', '神經元由樹突接收訊號，經細胞體，沿軸突傳出；髓鞘讓傳導更快。下方可以比較傳導時間。', 'Dendrites receive, the axon sends; myelin speeds conduction — try the calculator below.', ['neuron', 'dendrite', 'axon', 'myelin']],
    ['synapse', '突觸前末梢釋放神經傳導物質，與突觸後膜的受體結合。', 'Presynaptic terminals release transmitters onto postsynaptic receptors.', ['synapse', 'presynaptic', 'membrane']],
    ['reflex-arc', '傳入神經把感覺送進中樞，中間神經元處理後由傳出神經送到肌肉。', 'Afferent → interneuron → efferent.', ['afferent', 'interneuron', 'efferent', 'reflex']],
    ['glia', '星狀膠細胞支持神經元；訊號可分為興奮性與抑制性。', 'Astrocytes support neurons; signals are excitatory or inhibitory.', ['astrocyte', 'excitatory', 'inhibitory', 'potentials']]],
  u02: [['neurotransmitters', '主要神經傳導物質：乙醯膽鹼、多巴胺、血清素、正腎上腺素、麩胺酸。', 'Key transmitters: acetylcholine, dopamine, serotonin, noradrenaline, glutamate.', ['acetylcholine', 'dopamine', 'serotonin', 'noradrenaline', 'glutamate']],
    ['agonist-antagonist', '促效劑模仿傳導物質活化受體，拮抗劑阻斷受體。', 'Agonists activate receptors; antagonists block them.', ['agonist', 'antagonist', 'reuptake']],
    ['hormones', '荷爾蒙由內分泌腺分泌，例如皮質醇、催產素、褪黑激素。', 'Hormones: cortisol, oxytocin, melatonin.', ['cortisol', 'oxytocin', 'melatonin', 'endorphins']]],
  u03: [['directions', '前（anterior）是臉的方向，背側（dorsal）是腦的上方，內側（medial）靠近中線。', 'Anterior = toward the face; dorsal = top; medial = toward the midline.', ['anterior', 'posterior', 'dorsal', 'ventral', 'medial', 'lateral']],
    ['planes', '矢狀切面分左右，冠狀切面分前後。', 'Sagittal splits left/right; coronal splits front/back.', ['sagittal', 'coronal']],
    ['laterality', '左腦控制右半身：神經在中線交叉（對側控制）。', 'The left brain controls the right body (contralateral).', ['contralateral', 'ipsilateral', 'decussation', 'bilateral']]],
  u04: [['lobes', '大腦四葉：額葉（計畫）、頂葉（體感）、顳葉（聽覺、記憶）、枕葉（視覺）。', 'Frontal, parietal, temporal and occipital lobes.', ['frontal', 'parietal', 'temporal', 'occipital lobe']],
    ['cortex-areas', '前額葉負責計畫與決策，聯合區整合多種訊息。', 'Prefrontal cortex plans; association areas integrate.', ['prefrontal cortex', 'premotor cortex', 'association areas', 'primary cortex']],
    ['gyri-sulci', '大腦表面有隆起的腦迴與凹陷的腦溝，中央溝分開額葉與頂葉。', 'Gyri and sulci; the central fissure separates frontal from parietal.', ['gyrus', 'sulcus', 'central fissure', 'longitudinal fissure']],
    ['hemispheres', '左右半球由胼胝體相連；灰質在外、白質在內。', 'The corpus callosum joins the hemispheres; grey matter outside, white matter inside.', ['corpus callosum', 'cerebral hemispheres', 'grey matter', 'white matter']]],
  u05: [['midline', '正中切面可看到視丘、下視丘、腦下腺與腦幹。', 'A midline section shows thalamus, hypothalamus, pituitary and brainstem.', ['thalamus', 'hypothalamus', 'pituitary', 'pineal gland']],
    ['limbic', '邊緣系統：海馬迴與記憶、杏仁核與情緒。', 'Limbic system: hippocampus (memory), amygdala (emotion).', ['hippocampus', 'amygdala', 'fornix', 'mammillary bodies']],
    ['basal-ganglia', '基底核（紋狀體、殼核、尾核、蒼白球）參與動作控制。', 'Basal ganglia help control movement.', ['striatum', 'putamen', 'caudate nucleus', 'globus']],
    ['brainstem', '腦幹由上而下：中腦、橋腦、延髓；小腦負責平衡與協調。', 'Midbrain, pons, medulla; the cerebellum coordinates.', ['mesencephalon', 'pons', 'medulla', 'cerebellum']]],
  u06: [['eye-retina', '視網膜的錐狀細胞看顏色、桿狀細胞看暗光；中央窩最清晰。', 'Cones see colour, rods see dim light; the fovea is sharpest.', ['retina', 'cone', 'rod', 'fovea']],
    ['ear-cochlea', '耳蝸把聲波轉成神經訊號。', 'The cochlea turns sound into nerve signals.', ['cochlea', 'auditory']],
    ['smell-taste', '嗅覺與味覺是化學感覺。', 'Smell and taste are chemical senses.', ['olfactory', 'gustatory', 'anosmia']],
    ['illusions', '錯覺是誤判真實刺激，幻覺是沒有刺激卻有知覺。', 'Illusions misread real stimuli; hallucinations have none.', ['illusion', 'hallucination', 'blind sight', 'qualia']]],
  u07: [['autonomic', '交感神經負責戰或逃，副交感負責休息與消化。', 'Sympathetic: fight or flight; parasympathetic: rest and digest.', ['sympathetic', 'parasympathetic', 'autonomic', 'heartbeat']],
    ['sleep-stages', '一個睡眠週期約 90 分鐘，包含深睡與快速動眼期。下方可以推算起床時間。', 'A sleep cycle lasts about 90 minutes — try the calculator below.', ['sleep', 'insomnia', 'narcolepsy']],
    ['circadian', '光線經視交叉上核調節松果體分泌褪黑激素，形成晝夜節律。', 'Light regulates melatonin and the circadian rhythm.', ['circadian rhythm', 'melatonin', 'pineal gland']],
    ['brain-waves', '腦波：清醒專注 β 波、放鬆 α 波、深睡 δ 波。', 'Brain waves: β, α, θ, δ.', ['brain waves', 'oscillation', 'electroencephalograph']]],
  u08: [['memory-model', '訊息進入工作記憶，由中央執行系統管理，再進入長期記憶。', 'Working memory with a central executive feeds long-term memory.', ['working memory', 'central executive', 'implicit memory', 'explicit memory']],
    ['consolidation', '海馬迴協助把短期記憶鞏固成長期記憶；回想時可能再鞏固。', 'The hippocampus consolidates memories; recall can reconsolidate them.', ['consolidation', 'reconsolidation', 'amnesia']],
    ['forgetting-curve', '遺忘曲線顯示沒有複習時記憶快速流失。', 'The forgetting curve drops fast without review.', ['forget', 'remembrance', 'store']],
    ['plasticity', '大腦可塑性：經常使用的神經連結會變強；成人也會神經新生。', 'Plasticity strengthens used connections; neurogenesis continues.', ['plasticity', 'neurogenesis', 'reinforcement']]],
  u09: [['attention', '注意力像聚光燈，選擇要處理的訊息。', 'Attention works like a spotlight.', ['attention', 'situational awareness', 'grabbing attention']],
    ['top-down', '由上而下用經驗與期待解讀，由下而上從感覺資料開始。', 'Top-down uses expectations; bottom-up starts from data.', ['top-down', 'bottom-up', 'pattern matching', 'automated processing']],
    ['language-areas', '弓狀束連接語言區；受損會造成失讀、失寫、失名等障礙。', 'The arcuate fasciculus links language areas.', ['arcuate fasciculus', 'alexia', 'agraphia', 'anomia']],
    ['theory-of-mind', '心智理論是理解他人想法與信念的能力。', 'Theory of mind is understanding others’ beliefs.', ['theory of mind', 'empathy', 'cognition']]],
  u10: [['parkinsons', '帕金森氏症與多巴胺神經元退化有關，造成動作困難。', "Parkinson's disease involves loss of dopamine neurons.", ["Parkinson's disease", 'dopamine']],
    ['epilepsy', '癲癇是腦部異常同步放電，大發作會全身抽搐。', 'Epilepsy: abnormal synchronous firing; grand mal seizures.', ['epilepsy', 'seizure', 'grand mal']],
    ['mental-disorders', '常見精神疾病：憂鬱、焦慮、思覺失調、注意力不足過動症。', 'Depression, anxiety, schizophrenia, ADHD.', ['depression', 'anxiety', 'schizophrenia', 'attention deficit hyperactivity disorder']],
    ['brain-injury', '腦震盪、腦炎、腦性麻痺都會影響腦功能；失智症使記憶衰退。', 'Concussion, encephalitis, cerebral palsy; dementia.', ['concussion', 'encephalitis', 'cerebral palsy', 'dementia']]],
  u11: [['imaging', '斷層與功能性影像讓我們看到活的大腦；PET 使用正子。', 'Tomography and functional imaging; PET uses positrons.', ['tomography', 'functional imaging', 'positron']],
    ['eeg', '腦電圖與誘發電位記錄腦的電活動，時間解析度高。', 'EEG and evoked potentials record electrical activity.', ['electroencephalograph', 'evoked potentials']],
    ['tms', '經顱磁刺激可暫時改變皮質活動。', 'Transcranial stimulation alters cortical activity.', ['transcranial', 'neuroscience']],
    ['genetics', '分子生物學研究基因突變與 X 染色體失活。', 'Molecular biology: DNA mutation, X inactivation.', ['DNA mutation', 'X inactivation', 'molecular biology']]],
  u12: [['validity-reliability', '信度是一致性，效度是準確性：可信不一定有效。', 'Reliability = consistency; validity = accuracy.', ['reliability', 'validity', 'face validity', 'coefficient alpha']],
    ['normal-curve', 'Z 分數平均 0、標準差 1；T = 50 + 10Z。下方可以換算。', 'z: mean 0, SD 1; T = 50 + 10z — try the calculator.', ['z-score', 't-score', 'stanine', 'percentile ranks']],
    ['norms', '常模是比較的參照團體，例如地區常模、年級常模。', 'Norms are reference groups.', ['local norms', 'grade norms', 'grade equivalents']],
    ['regression', '迴歸方程式用一個變項預測另一個變項。', 'Regression equations predict one variable from another.', ['regression equation', 'cross-validation', 'representative sample']]],
  u13: [['assessment-types', '安置性評量在教學前、形成性在教學中、總結性在教學後。', 'Placement before, formative during, summative after teaching.', ['placement assessment', 'formative assessment', 'summative']],
    ['portfolio', '學習檔案收集作品：工作檔案、文件檔案、完成檔案。', 'Portfolios: working, documentation, finished.', ['working portfolio', 'documentation portfolio', 'finished portfolio']],
    ['test-item', '選擇題由題幹、正確選項與誘答選項組成。', 'A multiple-choice item: stem, key, decoys.', ['stem', 'decoys', 'alternatives', 'essay question']],
    ['rubric', '評分規準與檢核表讓評分更一致。', 'Rubrics and checklists make scoring consistent.', ['rubrics', 'checklist', 'peer appraisal']]],
  u14: [['emotion', '杏仁核與情緒反應有關；同理心讓我們感受他人情緒。', 'The amygdala drives emotion; empathy shares feelings.', ['emotion', 'empathy', 'amygdala']],
    ['social-cognition', '刻板印象、偏見與月暈效應都是社會判斷的偏誤。', 'Stereotyping, bias and the halo effect.', ['stereotyping', 'bias', 'halo effect', 'misattribution']],
    ['self-fulfilling', '期望會改變行為，進而讓預言成真。', 'Expectations can make prophecies come true.', ['expectancy', 'prophecy', 'suggestibility']],
    ['personality', '人格特質如悲觀、自卑情結；量表可以測量人格。', 'Traits such as pessimism; inventories measure personality.', ['pessimism', 'inferiority complex', 'personality inventory']]],
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

/** 腦科學互動計算器：依單元提供（神經傳導時間、睡眠週期、標準分數） */
const fmt = (x, d = 3) => (Number.isFinite(x) ? Number(x.toPrecision(d)).toLocaleString('en-US', { maximumFractionDigits: 4 }) : '—');

function conductionCalc(root) {
  root.innerHTML = `<div class="card"><b>⚡ ${L('神經傳導時間', 'Nerve conduction time')}</b>
    <div class="row" style="margin:.5rem 0"><label>${L('距離', 'distance')} (cm) <input type="number" data-d value="100" min="0" step="any" style="width:90px"></label></div>
    <p class="small muted">${L('預設 100 cm（約腳趾到脊髓）。速度採教科書常見概略值：有髓鞘粗纖維約 100 m/s，無髓鞘細纖維約 1 m/s。', 'Default 100 cm (≈ toe to spinal cord). Typical speeds: myelinated ≈ 100 m/s, unmyelinated ≈ 1 m/s.')}</p><div data-out></div></div>`;
  const calc = () => {
    const d = parseFloat(root.querySelector('[data-d]').value);
    const out = root.querySelector('[data-out]');
    if (!(d > 0)) { out.innerHTML = ''; return; }
    const m = d / 100, tMy = (m / 100) * 1000, tUn = (m / 1) * 1000;
    out.innerHTML = `<p>${L('有髓鞘', 'Myelinated')} myelin（≈100 m/s）：<b>${fmt(tMy)} ms</b>　${L('無髓鞘', 'Unmyelinated')}（≈1 m/s）：<b>${fmt(tUn)} ms</b>　→ ${L('快約', 'about')} <b>${fmt(tUn / tMy)}</b> ${L('倍', '× faster')}</p>
      <p class="small muted">${L('髓鞘讓動作電位在蘭氏結之間跳躍式傳導，所以快得多。', 'Myelin lets action potentials jump between nodes (saltatory conduction).')}</p>`;
  };
  root.querySelector('[data-d]').oninput = calc;
  calc();
}

function sleepCalc(root) {
  root.innerHTML = `<div class="card"><b>🌙 ${L('睡眠週期起床時間', 'Sleep-cycle wake times')}</b>
    <div class="row" style="margin:.5rem 0"><label>${L('上床時間', 'bedtime')} <input type="time" data-t value="23:00"></label>
    <label>${L('入睡需要', 'time to fall asleep')} (${L('分鐘', 'min')}) <input type="number" data-f value="15" min="0" max="120" style="width:70px"></label></div><div data-out></div></div>`;
  const calc = () => {
    const [h, m] = (root.querySelector('[data-t]').value || '23:00').split(':').map(Number);
    const f = Math.max(0, parseInt(root.querySelector('[data-f]').value, 10) || 0);
    const base = h * 60 + m + f;
    const z = (n) => String(n).padStart(2, '0');
    const at = (mins) => { const t = ((mins % 1440) + 1440) % 1440; return `${z(Math.floor(t / 60))}:${z(t % 60)}`; };
    const rows = [4, 5, 6].map((c) => `<li>${c} ${L('個週期', 'cycles')}（${c * 1.5} ${L('小時', 'h')}）→ <b>${at(base + c * 90)}</b></li>`).join('');
    root.querySelector('[data-out]').innerHTML = `<ul style="margin:.3rem 0">${rows}</ul>
      <p class="small muted">${L('一個睡眠週期約 90 分鐘（實際因人而異，約 70–120 分鐘）；在週期結束時醒來通常比較不昏沉。青少年建議每晚睡 8–10 小時。', 'One cycle ≈ 90 min (varies 70–120). Teens need about 8–10 hours.')}</p>`;
  };
  root.querySelectorAll('input').forEach((i) => (i.oninput = calc));
  calc();
}

function scoreCalc(root) {
  root.innerHTML = `<div class="card"><b>📊 ${L('標準分數換算', 'Standard scores')}</b>
    <div class="row" style="margin:.5rem 0"><label>${L('原始分數', 'raw score')} <input type="number" data-x value="78" step="any" style="width:80px"></label>
    <label>${L('平均數', 'mean')} <input type="number" data-m value="70" step="any" style="width:80px"></label>
    <label>${L('標準差', 'SD')} <input type="number" data-s value="8" min="0" step="any" style="width:80px"></label></div><div data-out></div></div>`;
  // 標準常態累積機率（Abramowitz–Stegun 近似）
  const phi = (z) => { const t = 1 / (1 + 0.2316419 * Math.abs(z)); const d = 0.3989423 * Math.exp(-z * z / 2); const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; };
  const calc = () => {
    const x = parseFloat(root.querySelector('[data-x]').value), m = parseFloat(root.querySelector('[data-m]').value), s = parseFloat(root.querySelector('[data-s]').value);
    const out = root.querySelector('[data-out]');
    if (!Number.isFinite(x) || !Number.isFinite(m) || !(s > 0)) { out.innerHTML = `<p class="small muted">${L('標準差需大於 0。', 'SD must be > 0.')}</p>`; return; }
    const z = (x - m) / s, T = 50 + 10 * z, st = Math.min(9, Math.max(1, Math.round(2 * z + 5))), pr = phi(z) * 100;
    out.innerHTML = `<p>z-score = (x − mean) ÷ SD = <b>${fmt(z)}</b>　t-score = 50 + 10z = <b>${fmt(T)}</b>　stanine ${L('標準九', '')} = <b>${st}</b>　${L('百分等級', 'percentile rank')} ≈ <b>${fmt(pr)}</b></p>
      <p class="small muted">${L('假設分數呈常態分配。標準九 = 2z + 5 四捨五入，限制在 1–9。', 'Assumes a normal distribution. Stanine = round(2z + 5), clipped to 1–9.')}</p>`;
  };
  root.querySelectorAll('input').forEach((i) => (i.oninput = calc));
  calc();
}

export const CALCS = { u01: conductionCalc, u07: sleepCalc, u12: scoreCalc };

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
  svg += `<circle cx="${cx}" cy="${cy}" r="62" fill="#1e2340"/><text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" font-weight="800" style="fill:#fff">${L('腦科學', 'Brain Science')}</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="13" style="fill:#bae6fd">${L('專業英文', 'English')}</text>`;
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
    <div class="card mindmap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${L('單元單字關聯圖', 'Unit word network')}">${lines}<circle cx="${cx}" cy="${cy}" r="58" fill="#a3268f"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="14" font-weight="800" style="fill:#fff">${esc(u.title.slice(0, 8))}</text>${nodes}</svg></div>
    <a class="btn ghost" href="#/map">← ${L('回全冊心智圖', 'Back to full map')}</a>`;
}
