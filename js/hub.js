// 科學專業英文 五科總覽首頁：設定、動畫、科目卡、學習進度、每日一字、跨科搜尋、小遊戲、PWA
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ---------- 設定 ----------
const KEY = 'hub.settings.v1';
const DEF = { lang: 'zh', theme: 'system', font: 'm', sound: 'on', motion: 'on' };
let S = { ...DEF };
try { S = { ...DEF, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { /* 無痕模式時使用預設 */ }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* 忽略 */ } };
const L = (zh, en) => (S.lang === 'en' ? en : zh);
const sysDark = matchMedia('(prefers-color-scheme: dark)');
const reduceSys = matchMedia('(prefers-reduced-motion: reduce)');
const motionOn = () => S.motion === 'on' && !reduceSys.matches;

const I18N = {
  skip: ['跳到主要內容', 'Skip to content'], brand: ['科學專業英文', 'Science English'], brandSub: ['AI 自主學習・五科總覽', 'AI self-learning · 5 subjects'],
  navSubjects: ['科目', 'Subjects'], navProgress: ['進度', 'Progress'], navWord: ['每日一字', 'Word of the day'], navSearch: ['搜尋', 'Search'], navGame: ['小遊戲', 'Game'],
  install: ['安裝', 'Install'], settings: ['設定', 'Settings'], setLang: ['語言', 'Language'], setTheme: ['色系', 'Theme'], setFont: ['字體', 'Font'],
  setSound: ['音效', 'Sound'], setMotion: ['動畫', 'Motion'], system: ['系統', 'System'], light: ['亮色', 'Light'], dark: ['暗色', 'Dark'], on: ['開', 'On'], off: ['關', 'Off'],
  eyebrow: ['PVQC 科學專業英文 × AI 自主學習', 'PVQC Science English × AI self-learning'],
  heroA: ['五個科學領域', 'Five science subjects'], heroB: ['一個入口，隨時開始學', 'one place to start learning'],
  lead: ['把五份 PDF 詞彙表變成可離線使用的學習 App：圖解單字、發音、練習、測驗、遊戲、智慧複習與學習儀表板。',
    'Five PDF word lists turned into offline-ready learning apps: illustrated words, pronunciation, practice, quizzes, games, spaced review and dashboards.'],
  ctaStart: ['選擇科目開始 ↓', 'Choose a subject ↓'], ctaSearch: ['🔍 跨科搜尋單字', '🔍 Search all subjects'],
  subTitle: ['五個科目', 'Five subjects'], subLead: ['每個科目都是獨立的 App，有自己的學習紀錄，也可以分別安裝到手機桌面。', 'Each subject is its own app with its own records, and can be installed separately.'],
  progTitle: ['我的五科學習進度', 'My progress across subjects'], progLead: ['讀取這台裝置瀏覽器中各科的學習紀錄（不會上傳，也不會修改任何資料）。', 'Read from this browser only — nothing is uploaded or changed.'],
  wordTitle: ['每日一字', 'Word of the day'], searchTitle: ['跨科搜尋', 'Search all subjects'], searchLabel: ['搜尋英文或中文', 'Search English or Chinese'], go: ['搜尋', 'Search'],
  gameTitle: ['小遊戲：這個字屬於哪一科？', 'Game: which subject is this word from?'],
  gameLead: ['看單字猜科目，一回合 10 題。有些詞同時出現在好幾科，選任何一個包含它的科目都算對。', 'Guess the subject — 10 per round. Words in several subjects accept any of them.'],
  flowTitle: ['每個單元的五階段自主學習', 'Five learning stages in every unit'], instTitle: ['安裝與離線使用', 'Install & offline use'],
  foot1: ['學習紀錄只存在你自己的瀏覽器（每科分開保存），不會上傳；清除網站資料或更換裝置前，請到各科「資料備份」頁下載備份。',
    'Records stay in your own browser (one store per subject). Back them up from each app before clearing data or switching devices.'],
  foot2: ['教材來源：PVQC 科學專業英文詞彙表（生物科學、物理、化學、地球科學、腦科學）。音標、定義、例句與示意圖為 AI 補充內容。',
    'Source: PVQC science word lists (biology, physics, chemistry, earth science, brain science). IPA, definitions, examples and diagrams are AI supplements.'],
};

function applySettings() {
  const root = document.documentElement;
  root.lang = S.lang === 'en' ? 'en' : 'zh-Hant-TW';
  root.dataset.theme = S.theme === 'dark' || (S.theme === 'system' && sysDark.matches) ? 'dark' : 'light';
  root.style.setProperty('--fs', { s: '15px', m: '17px', l: '20px' }[S.font]);
  document.body.classList.toggle('no-motion', !motionOn());
  $$('[data-i18n]').forEach((el) => { const v = I18N[el.dataset.i18n]; if (v) el.textContent = L(v[0], v[1]); });
  $('#q').placeholder = L('例如 cell、wave、acid、typhoon、海馬迴', 'e.g. cell, wave, acid, typhoon, neuron');
  $$('.seg').forEach((seg) => $$('button', seg).forEach((b) => b.setAttribute('aria-pressed', S[seg.dataset.set] === b.dataset.v)));
  document.title = L('科學專業英文 AI 自主學習｜五科總覽', 'Science English · AI Self-Learning Hub');
}
sysDark.addEventListener?.('change', applySettings);

// ---------- 音效（Web Audio，離線可用） ----------
let actx = null;
function tone(f, start, dur, type = 'triangle', vol = 0.15) {
  if (S.sound !== 'on') return;
  try {
    actx ||= new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + start;
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur + 0.02);
  } catch { /* 不支援時略過 */ }
}
const sfx = {
  click: () => tone(760, 0, 0.05, 'square', 0.05),
  ok: () => { tone(660, 0, 0.12); tone(990, 0.09, 0.18); },
  no: () => { tone(220, 0, 0.18, 'sawtooth', 0.08); tone(180, 0.12, 0.22, 'sawtooth', 0.07); },
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.24)),
};

function toast(msg, action) {
  const el = document.createElement('div');
  el.className = 'toast'; el.setAttribute('role', 'status');
  el.innerHTML = `<span>${esc(msg)}</span>`;
  if (action) { const b = document.createElement('button'); b.textContent = action.label; b.onclick = () => { action.run(); el.remove(); }; el.append(b); }
  $('#toasts').append(el);
  setTimeout(() => el.remove(), action ? 12000 : 3500);
}
function confetti() {
  if (!motionOn()) return;
  const box = document.createElement('div'); box.className = 'confetti'; box.setAttribute('aria-hidden', 'true');
  const c = ['#4f46e5', '#0d9488', '#ea580c', '#db2777', '#facc15', '#22c55e'];
  for (let i = 0; i < 70; i++) { const p = document.createElement('i'); p.style.left = Math.random() * 100 + 'vw'; p.style.background = c[i % c.length]; p.style.animationDelay = Math.random() * 0.5 + 's'; box.append(p); }
  document.body.append(box); setTimeout(() => box.remove(), 2500);
}

// ---------- 資料 ----------
let SUBJ = [], TERMS = [], BYKEY = {}, EN2SUBJ = new Map();
async function loadData() {
  const [s, t] = await Promise.all([fetch('data/subjects.json').then((r) => r.json()), fetch('data/terms.json').then((r) => r.json())]);
  SUBJ = s.subjects;
  BYKEY = Object.fromEntries(SUBJ.map((x) => [x.key, x]));
  TERMS = t.terms.map(([subject, id, en, zh, def, ipa, unit, level]) => ({ subject, id, en, zh, def, ipa, unit, level }));
  for (const w of TERMS) { const k = w.en.toLowerCase(); if (!EN2SUBJ.has(k)) EN2SUBJ.set(k, new Set()); EN2SUBJ.get(k).add(w.subject); }
}
const subjName = (k) => L(BYKEY[k].zh, BYKEY[k].en);
const grad = (s, deg = 135) => `linear-gradient(${deg}deg, ${s.colors[0]}, ${s.colors[1]} 60%, ${s.colors[2]})`;
const wordUrl = (w) => `${BYKEY[w.subject].dir}/index.html#/word/${encodeURIComponent(w.id)}`;

// ---------- 主視覺：知識網絡動畫 ----------
function heroCanvas() {
  const cv = $('#net-canvas'); const ctx = cv.getContext('2d');
  const colors = SUBJ.map((s) => s.colors[1]);
  const labels = shuffle(TERMS).slice(0, 26).map((t) => t.en);
  let W = 0, H = 0, nodes = [], mouse = null, visible = true, raf = 0;
  const resize = () => {
    const r = cv.getBoundingClientRect(); const dpr = Math.min(2, devicePixelRatio || 1);
    W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(90, Math.max(28, (W * H) / 16000)));
    nodes = Array.from({ length: n }, (_, i) => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: 2 + Math.random() * 3, c: colors[i % colors.length], label: i < labels.length && W > 640 ? labels[i] : null }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
        if (d < 130) { ctx.strokeStyle = `rgba(255,255,255,${0.16 * (1 - d / 130)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
    }
    for (const n of nodes) {
      ctx.fillStyle = n.c; ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 0.45, 0, Math.PI * 2); ctx.fill();
      if (n.label) { ctx.fillStyle = 'rgba(255,255,255,.38)'; ctx.font = '600 12px system-ui, sans-serif'; ctx.fillText(n.label, n.x + 7, n.y - 6); }
    }
  };
  const step = () => {
    for (const n of nodes) {
      if (mouse) { const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy); if (d < 160) { n.vx += dx / d * 0.02; n.vy += dy / d * 0.02; } }
      n.vx *= 0.995; n.vy *= 0.995; n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1; if (n.y < 0 || n.y > H) n.vy *= -1;
      n.x = Math.max(0, Math.min(W, n.x)); n.y = Math.max(0, Math.min(H, n.y));
      const sp = Math.hypot(n.vx, n.vy); if (sp > 1.2) { n.vx *= 1.2 / sp; n.vy *= 1.2 / sp; }
    }
    draw();
    raf = visible && motionOn() && document.visibilityState === 'visible' ? requestAnimationFrame(step) : 0;
  };
  const kick = () => { if (!raf && visible && motionOn()) raf = requestAnimationFrame(step); };
  resize(); draw(); kick();
  addEventListener('resize', () => { resize(); draw(); });
  cv.parentElement.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; });
  cv.parentElement.addEventListener('pointerleave', () => { mouse = null; });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }).observe(cv);
  document.addEventListener('visibilitychange', kick);
  return { kick, redraw: draw };
}

function countUp(el, to) {
  if (!motionOn()) { el.textContent = to.toLocaleString(); return; }
  const t0 = performance.now(), dur = 1200;
  const f = (now) => { const p = Math.min(1, (now - t0) / dur); el.textContent = Math.round(to * (1 - (1 - p) ** 3)).toLocaleString(); if (p < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}
function renderStats() {
  const sum = (k) => SUBJ.reduce((a, s) => a + s[k], 0);
  const items = [[SUBJ.length, L('個科目', 'subjects')], [sum('terms'), L('個專業詞彙', 'terms')], [sum('units'), L('個學習單元', 'units')],
    [sum('illus'), L('張示意圖', 'diagrams')], [SUBJ.reduce((a, s) => a + s.calcs.length, 0), L('個互動計算器', 'calculators')]];
  $('#stats').innerHTML = items.map(([n, t]) => `<div class="stat"><b data-n="${n}">0</b><span>${esc(t)}</span></div>`).join('');
  $$('#stats b').forEach((b) => countUp(b, +b.dataset.n));
  $('#orbit').innerHTML = SUBJ.map((s) => `<a href="#card-${s.key}" style="background:${s.colors[1]}55">${s.emoji} ${esc(subjName(s.key))}</a>`).join('');
}

// ---------- 科目卡 ----------
let filterKey = 'all';
const PROG = {}; // 各科學習進度（讀取自 IndexedDB）
const OFFLINE = new Set(); // 已有離線快取的科目
const CACHE_PREFIX = { biology: 'bioapp-', physics: 'phyapp-', chemistry: 'chemapp-', earth: 'earthapp-', brain: 'brainapp-' };
async function loadOffline() {
  OFFLINE.clear();
  try { const keys = await caches.keys(); for (const [k, p] of Object.entries(CACHE_PREFIX)) if (keys.some((x) => x.startsWith(p))) OFFLINE.add(k); } catch { /* 不支援 Cache API */ }
}
function ring(s) {
  const p = PROG[s.key]; const pct = p ? Math.round((p.learned / s.terms) * 100) : 0; const C = 2 * Math.PI * 30;
  return `<div class="ring" title="${L('已學習比例', 'Studied')}"><svg viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="8"/>
    <circle cx="36" cy="36" r="30" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}"/></svg>
    <b>${p ? pct + '%' : '—'}<small>${L('已學習', 'studied')}</small></b></div>`;
}
function renderCards() {
  $('#filter').innerHTML = [['all', L('全部', 'All'), '🗂️'], ...SUBJ.map((s) => [s.key, subjName(s.key), s.emoji])]
    .map(([k, t, e]) => `<button type="button" data-k="${k}" aria-pressed="${k === filterKey}">${e} ${esc(t)}</button>`).join('');
  $$('#filter button').forEach((b) => b.onclick = () => { filterKey = b.dataset.k; sfx.click(); renderCards(); });
  const lvc = ['#22c55e', '#eab308', '#ec4899'];
  $('#cards').innerHTML = SUBJ.map((s) => {
    const tot = s.levels['1'] + s.levels['2'] + s.levels['3'];
    return `<article class="card reveal ${filterKey !== 'all' && filterKey !== s.key ? 'hidden' : ''}" id="card-${s.key}" aria-labelledby="h-${s.key}">
      <div class="card-head" style="background:${grad(s)}">${ring(s)}
        <div class="emoji" aria-hidden="true">${s.emoji}</div>
        <h3 id="h-${s.key}">${esc(subjName(s.key))}</h3><small>${esc(L(s.en, s.zh))}・${esc(s.title)}</small></div>
      <div class="card-body">
        <div class="facts">
          <div><b>${s.terms}</b><span>${L('詞條', 'terms')}</span></div><div><b>${s.units}</b><span>${L('單元', 'units')}</span></div>
          <div><b>${s.illus}</b><span>${L('示意圖', 'diagrams')}</span></div><div><b>${s.pages}</b><span>${L('PDF 頁', 'PDF pages')}</span></div></div>
        <div><div class="levels" role="img" aria-label="${L('難度分布', 'Level mix')}：${s.levels['1']}/${s.levels['2']}/${s.levels['3']}">
          ${['1', '2', '3'].map((l, i) => `<i style="width:${(s.levels[l] / tot) * 100}%;background:${lvc[i]}"></i>`).join('')}</div>
          <div class="lv-legend">${[L('基礎', 'Basic'), L('進階', 'Advanced'), L('挑戰', 'Challenge')].map((t, i) => `<span><i style="background:${lvc[i]}"></i>${t} ${s.levels[String(i + 1)]}</span>`).join('')}</div></div>
        <div class="chips">${OFFLINE.has(s.key) ? `<span class="chip" title="${L('這台裝置已快取，可離線使用', 'Cached on this device')}">✅ ${L('可離線', 'Offline ready')}</span>` : `<span class="chip" title="${L('第一次開啟需要網路，之後即可離線', 'Needs a connection the first time')}">☁️ ${L('首次需連網', 'Online first time')}</span>`}
          ${s.calcs.map((c) => `<span class="chip">🧮 ${esc(L(c[0], c[1]))}</span>`).join('')}</div>
        <details class="units"><summary>📖 ${L(`${s.units} 個單元一覽`, `All ${s.units} units`)}</summary>
          <ol>${s.unitList.map((u) => `<li><a href="${s.dir}/index.html#/unit/${u.id}">${esc(L(u.zh, u.en))}</a> <span class="n">${u.n} ${L('詞', 'terms')}</span></li>`).join('')}</ol></details>
        <div class="card-actions">
          <a class="btn" href="${s.dir}/index.html" style="background:${s.colors[0]};color:#fff">${L('開始學習', 'Start learning')} →</a>
          <a class="btn soft small" href="${s.dir}/index.html#/review">🔁 ${L('複習', 'Review')}</a>
          <a class="btn soft small" href="${s.dir}/index.html#/games">🎮 ${L('遊戲', 'Games')}</a>
          <a class="btn soft small" href="${esc(s.pdf)}" target="_blank" rel="noopener">📄 PDF</a></div>
      </div></article>`;
  }).join('');
  tilt(); reveal();
}
function tilt() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  $$('.card').forEach((c) => {
    c.onpointermove = (e) => { if (!motionOn()) return; const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`; };
    c.onpointerleave = () => { c.style.transform = ''; };
  });
}
let io = null;
function reveal() {
  if (!('IntersectionObserver' in window) || !motionOn()) { $$('.reveal').forEach((e) => e.classList.add('in')); return; }
  io ||= new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
  $$('.reveal:not(.in)').forEach((e) => io.observe(e));
}

// ---------- 學習進度：安全讀取各科 IndexedDB（絕不建立或修改資料庫） ----------
function openExisting(name) {
  return new Promise((resolve) => {
    let req;
    try { req = indexedDB.open(name); } catch { return resolve(null); }
    req.onupgradeneeded = () => { req.transaction.abort(); }; // 資料庫不存在：取消，避免建立空資料庫
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
    req.onblocked = () => resolve(null);
  });
}
const getAll = (db, store) => new Promise((resolve) => {
  if (!db.objectStoreNames.contains(store)) return resolve([]);
  const r = db.transaction(store, 'readonly').objectStore(store).getAll();
  r.onsuccess = () => resolve(r.result || []); r.onerror = () => resolve([]);
});
// 與各科 App 相同的熟練判定規則
function status(it) {
  const n = (it.correct || 0) + (it.wrong || 0);
  if (!it.views && !n && !it.mark) return 'new';
  const rec = it.recent || []; const acc = rec.length ? rec.reduce((a, b) => a + b, 0) / rec.length : 0; const last = rec[rec.length - 1];
  if ((n >= 3 && acc >= 0.8 && it.streak >= 3) || (it.mark === 'familiar' && n >= 2 && last === 1)) return 'mastered';
  if ((n >= 2 && acc < 0.6) || (it.wrong >= 2 && last === 0) || (it.mark === 'unfamiliar' && n >= 1 && acc < 0.8)) return 'weak';
  return 'learning';
}
async function loadProgress() {
  if (!('indexedDB' in window)) return;
  let names = null;
  try { if (indexedDB.databases) names = new Set((await indexedDB.databases()).map((d) => d.name)); } catch { names = null; }
  for (const s of SUBJ) {
    if (names && !names.has(s.db)) { delete PROG[s.key]; continue; }
    const db = await openExisting(s.db);
    if (!db) { delete PROG[s.key]; continue; }
    const [items, quizzes, daily] = await Promise.all([getAll(db, 'items'), getAll(db, 'quizzes'), getAll(db, 'daily')]);
    db.close();
    const st = items.map(status);
    PROG[s.key] = { learned: st.filter((x) => x !== 'new').length, mastered: st.filter((x) => x === 'mastered').length, weak: st.filter((x) => x === 'weak').length,
      quizzes: quizzes.length, best: quizzes.length ? Math.max(...quizzes.map((q) => q.score)) : null, minutes: Math.round(daily.reduce((a, d) => a + (d.ms || 0), 0) / 60000) };
  }
}
function renderProgress() {
  const any = Object.keys(PROG).length;
  const tot = SUBJ.reduce((a, s) => a + s.terms, 0), learned = SUBJ.reduce((a, s) => a + (PROG[s.key]?.learned || 0), 0), mastered = SUBJ.reduce((a, s) => a + (PROG[s.key]?.mastered || 0), 0);
  $('#prog-panel').innerHTML = `
    ${any ? `<p style="margin-top:0"><b>${L('五科合計', 'All subjects')}</b>：${L('已學習', 'studied')} ${learned} / ${tot}・${L('已精熟', 'mastered')} ${mastered}</p>` :
    `<p style="margin-top:0">${L('這台裝置還沒有任何科目的學習紀錄。選一個科目開始學習後，這裡會顯示你的進度。', 'No records on this device yet — start a subject and your progress will appear here.')}</p>`}
    ${SUBJ.map((s) => { const p = PROG[s.key]; return `<div class="prog-row">
      <a class="prog-name" href="${s.dir}/index.html#/dashboard">${s.emoji} ${esc(subjName(s.key))}</a>
      <div class="bar" role="img" aria-label="${esc(subjName(s.key))}：${p ? p.learned : 0}/${s.terms}">
        <i class="learned" style="width:${p ? (p.learned / s.terms) * 100 : 0}%;background:${s.colors[1]}"></i>
        <i style="width:${p ? (p.mastered / s.terms) * 100 : 0}%;background:${grad(s, 90)}"></i></div>
      <span class="prog-num">${p ? `${p.learned}/${s.terms}・★${p.mastered}${p.quizzes ? `・${L('測驗', 'quizzes')} ${p.quizzes}` : ''}${p.minutes ? `・${p.minutes} ${L('分', 'min')}` : ''}` : L('尚未開始', 'Not started')}</span></div>`; }).join('')}
    <div class="prog-legend"><span>▮ ${L('淺色：已學習', 'light: studied')}</span><span>▮ ${L('深色：已精熟', 'dark: mastered')}</span>
      <button class="btn soft small" type="button" id="prog-refresh">↻ ${L('重新讀取', 'Refresh')}</button></div>`;
  $('#prog-refresh').onclick = async () => { sfx.click(); await Promise.all([loadProgress(), loadOffline()]); renderProgress(); renderCards(); toast(L('已更新學習進度', 'Progress refreshed')); };
}

// ---------- 每日一字 ----------
let wordIdx = 0;
function dayIndex() {
  const d = new Date(); const k = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  let h = 0; for (const c of k) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % TERMS.length;
}
function speak(text) {
  const syn = window.speechSynthesis;
  if (!syn) return toast(L('此瀏覽器不支援發音，請參考音標。', 'Speech is not supported here.'));
  const vs = syn.getVoices(); const v = vs.find((x) => /en-US/i.test(x.lang)) || vs.find((x) => /^en/i.test(x.lang));
  if (!v) toast(L('裝置上找不到英文語音，將使用系統預設聲音。', 'No English voice found; using the default voice.'));
  syn.cancel(); const u = new SpeechSynthesisUtterance(text); if (v) u.voice = v; u.lang = v?.lang || 'en-US'; u.rate = 0.9; syn.speak(u);
}
function renderWord(i = wordIdx, isToday = true) {
  wordIdx = i; const w = TERMS[i]; const s = BYKEY[w.subject];
  $('#word').style.setProperty('--wc', grad(s, 90));
  $('#word-body').innerHTML = `<span class="chip" style="background:${s.colors[0]};color:#fff">${s.emoji} ${esc(subjName(s.key))}</span>
    <span class="chip">${isToday ? L('今天的字', 'Today') : L('隨機', 'Random')}</span>
    <div class="w-en" lang="en">${esc(w.en)}</div><div class="w-ipa">${esc(w.ipa)}</div>
    <div class="w-zh">${esc(w.zh)}</div><p class="w-def">${esc(w.def)}</p><p class="small muted">${L('單元', 'Unit')}：${esc(w.unit)}</p>
    <div class="card-actions"><button class="btn" type="button" id="w-say">🔊 ${L('發音', 'Listen')}</button>
      <button class="btn soft" type="button" id="w-next">🎲 ${L('換一個', 'Another')}</button>
      <a class="btn ghost" href="${wordUrl(w)}">${L('前往學習', 'Study it')} →</a></div>`;
  $('#w-say').onclick = () => { sfx.click(); speak(w.en); };
  $('#w-next').onclick = () => { sfx.click(); renderWord(Math.floor(Math.random() * TERMS.length), false); };
}

// ---------- 跨科搜尋 ----------
const norm = (s) => s.toLowerCase().normalize('NFKC').trim();
function hl(text, q) {
  const i = norm(text).indexOf(q); if (i < 0 || !q) return esc(text);
  return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
}
function doSearch(raw) {
  const q = norm(raw); const box = $('#results');
  if (!q) { box.innerHTML = ''; return; }
  const scored = [];
  for (const w of TERMS) {
    const en = norm(w.en), zh = norm(w.zh); let sc = 0;
    if (en === q || zh === q) sc = 100; else if (en.startsWith(q)) sc = 70; else if (en.includes(q)) sc = 45; else if (zh.includes(q)) sc = 50; else if (norm(w.def).includes(q)) sc = 10;
    if (sc) scored.push([sc, w]);
  }
  scored.sort((a, b) => b[0] - a[0] || a[1].en.length - b[1].en.length);
  if (!scored.length) { box.innerHTML = `<p class="muted">${L('找不到符合的單字，試試其他關鍵字。', 'No matches — try another keyword.')}</p>`; return; }
  const groups = {};
  for (const [, w] of scored) (groups[w.subject] ||= []).push(w);
  box.innerHTML = `<p class="small muted">${L(`共 ${scored.length} 筆`, `${scored.length} results`)}</p>` + SUBJ.filter((s) => groups[s.key]).map((s) => `
    <div class="res-group"><h3><span class="chip" style="background:${s.colors[0]};color:#fff">${s.emoji} ${esc(subjName(s.key))}</span> ${groups[s.key].length}</h3>
      ${groups[s.key].slice(0, 8).map((w) => `<a class="res" href="${wordUrl(w)}"><b lang="en">${hl(w.en, q)}</b><span class="u">${esc(w.unit)}</span><span class="z">${hl(w.zh, q)}</span></a>`).join('')}
      ${groups[s.key].length > 8 ? `<a class="small" href="${s.dir}/index.html#/search/${encodeURIComponent(raw)}">${L(`在${subjName(s.key)}中看全部 ${groups[s.key].length} 筆`, `See all ${groups[s.key].length} in ${subjName(s.key)}`)} →</a>` : ''}</div>`).join('');
}
function initSearch() {
  const hints = ['cell', 'energy', 'wave', 'acid', 'nucleus', 'pressure', 'memory', 'spectrum', '電子', '循環'];
  $('#search-hints').innerHTML = hints.map((h) => `<button class="chip" type="button">${esc(h)}</button>`).join('');
  $$('#search-hints .chip').forEach((b) => b.onclick = () => { $('#q').value = b.textContent; doSearch(b.textContent); sfx.click(); });
  $('#search-form').onsubmit = (e) => { e.preventDefault(); doSearch($('#q').value); };
  let t; $('#q').oninput = () => { clearTimeout(t); t = setTimeout(() => doSearch($('#q').value), 180); };
}

// ---------- 小遊戲：哪一科？ ----------
const G = { round: [], i: 0, score: 0, streak: 0, answers: [] };
const bestKey = 'hub.game.best';
const getBest = () => { try { return +localStorage.getItem(bestKey) || 0; } catch { return 0; } };
function newRound() {
  // 每科平均抽題，避免某科詞彙較多而偏重
  const per = {}; SUBJ.forEach((s) => { per[s.key] = shuffle(TERMS.filter((t) => t.subject === s.key)); });
  const pool = []; for (let k = 0; pool.length < 10; k++) for (const s of shuffle(SUBJ)) if (pool.length < 10) pool.push(per[s.key][k]);
  Object.assign(G, { round: pool, i: 0, score: 0, streak: 0, answers: [] });
  renderGame();
}
function renderGame() {
  const p = $('#game-panel');
  if (!G.round.length) {
    p.innerHTML = `<div class="g-term"><b>🧪 🔭 🧬 🌋 🧠</b><p>${L('最高分', 'Best')}：${getBest()} / 10</p></div>
      <div style="text-align:center"><button class="btn big" type="button" id="g-start">▶ ${L('開始遊戲', 'Start')}</button></div>`;
    $('#g-start').onclick = () => { sfx.click(); newRound(); };
    return;
  }
  if (G.i >= G.round.length) {
    const best = Math.max(getBest(), G.score); try { localStorage.setItem(bestKey, best); } catch { /* 忽略 */ }
    if (G.score >= 8) { sfx.win(); confetti(); }
    p.innerHTML = `<div class="g-term"><b>${G.score} / 10</b><p>${G.score >= 8 ? L('太厲害了！跨科概念很清楚 🎉', 'Excellent cross-subject sense! 🎉') : L('再挑戰一次，或到各科複習答錯的字。', 'Try again, or review the missed words.')}</p>
      <p class="small muted">${L('最高分', 'Best')}：${best}</p></div>
      ${G.answers.filter((a) => !a.ok).length ? `<p><b>${L('答錯的字', 'Missed')}</b>：${G.answers.filter((a) => !a.ok).map((a) => `<a href="${wordUrl(a.w)}" lang="en">${esc(a.w.en)}</a>`).join('、')}</p>` : ''}
      <div style="text-align:center"><button class="btn big" type="button" id="g-again">↺ ${L('再玩一次', 'Play again')}</button></div>`;
    $('#g-again').onclick = () => { sfx.click(); newRound(); };
    return;
  }
  const w = G.round[G.i];
  p.innerHTML = `<div class="g-top"><span><b>${L('第', 'Q')} ${G.i + 1} / 10</b>　${L('分數', 'Score')} ${G.score}　🔥${G.streak}</span>
      <span class="g-progress" aria-hidden="true">${G.round.map((_, k) => `<i class="${k < G.answers.length ? (G.answers[k].ok ? 'ok' : 'no') : ''}"></i>`).join('')}</span></div>
    <div class="g-term"><b lang="en">${esc(w.en)}</b><span class="muted">${esc(w.zh)}</span></div>
    <div class="g-opts" role="group" aria-label="${L('選擇科目', 'Choose a subject')}">${SUBJ.map((s, k) => `<button class="g-opt" type="button" data-k="${s.key}" style="background:${grad(s)}"><span class="e" aria-hidden="true">${s.emoji}</span>${esc(subjName(s.key))}<span class="sr-only">（${k + 1}）</span></button>`).join('')}</div>
    <div id="g-fb" aria-live="polite"></div>`;
  $$('.g-opt', p).forEach((b) => b.onclick = () => answer(b));
}
function answer(btn) {
  const w = G.round[G.i]; const valid = EN2SUBJ.get(w.en.toLowerCase());
  const ok = valid.has(btn.dataset.k);
  G.answers.push({ w, ok }); if (ok) { G.score++; G.streak++; sfx.ok(); } else { G.streak = 0; sfx.no(); }
  $$('.g-opt').forEach((b) => { b.disabled = true; if (valid.has(b.dataset.k)) b.classList.add('right'); });
  if (!ok) btn.classList.add('wrong');
  $('#g-fb').innerHTML = `<div class="g-fb ${ok ? 'ok' : 'no'}"><b>${ok ? L('✔ 答對了！', '✔ Correct!') : L('✘ 不對喔', '✘ Not quite')}</b>
    <span lang="en">${esc(w.en)}</span>＝${esc(w.zh)}，${L('出現在', 'appears in')}：${[...valid].map((k) => `${BYKEY[k].emoji} ${esc(subjName(k))}`).join('、')}
    <div class="card-actions" style="margin-top:.5rem"><button class="btn" type="button" id="g-next">${G.i + 1 < 10 ? L('下一題 →', 'Next →') : L('看結果', 'Results')}</button>
    <a class="btn soft small" href="${wordUrl(w)}">${L('看單字解說', 'See the word')}</a></div></div>`;
  $('#g-next').onclick = () => { G.i++; renderGame(); $('#game-panel').scrollIntoView({ block: 'nearest' }); };
  $('#g-next').focus({ preventScroll: true });
}
addEventListener('keydown', (e) => {
  if (e.target.matches('input, textarea')) return;
  const n = +e.key; const opts = $$('.g-opt:not([disabled])');
  if (n >= 1 && n <= 5 && opts.length === 5) opts[n - 1].click();
});

// ---------- 流程與安裝說明 ----------
function renderStatic() {
  const flow = [['🧭', L('探索與診斷', 'Explore'), L('學習目標、學前診斷、設定個人目標', 'Goals, pre-test, personal targets')],
    ['📖', L('理解與學習', 'Learn'), L('圖解單字、發音、互動概念圖與計算器', 'Illustrated words, audio, concept steps, calculators')],
    ['✏️', L('演練與應用', 'Practise'), L('10 種練習模式，即時回饋與解說', '10 practice modes with instant feedback')],
    ['📝', L('測驗與補救', 'Test'), L('8 種測驗、錯題本與補救練習', '8 quiz types, mistakes book, remediation')],
    ['🌱', L('成果與反思', 'Reflect'), L('儀表板、反思紀錄與成果匯出', 'Dashboard, reflections, export')]];
  $('#flow-list').innerHTML = flow.map(([e, t, d]) => `<li class="reveal"><span class="e" aria-hidden="true">${e}</span><b>${esc(t)}</b><p>${esc(d)}</p></li>`).join('');
  const inst = [['📱', 'Android／Chrome', L('按上方「📲 安裝」，或瀏覽器選單 →「安裝應用程式／加到主畫面」。', 'Tap “📲 Install”, or browser menu → Install app.')],
    ['🍎', 'iPhone／iPad', L('用 Safari 開啟，按分享 ⬆️ →「加入主畫面」。', 'Open in Safari → Share → Add to Home Screen.')],
    ['💻', L('電腦', 'Desktop'), L('Chrome／Edge 網址列右側的安裝圖示 ⊕。', 'Use the install icon in the Chrome/Edge address bar.')],
    ['📦', L('各科也能單獨安裝', 'Install each subject'), L('進入某一科後再安裝，就會得到該科專屬的 App 圖示。', 'Open a subject and install it to get its own app icon.')],
    ['📶', L('離線使用', 'Offline'), L('首次開啟需要連網；之後首頁與已開啟過的科目都能離線使用。發音若用雲端語音，離線時可能無法播放。', 'First visit needs a connection; afterwards the hub and opened subjects work offline. Online voices may not work offline.')],
    ['🔒', L('資料保存', 'Your data'), L('每科的學習紀錄各自存在瀏覽器，可在各科「資料備份」頁匯出 JSON／CSV。', 'Each subject stores its own records; export JSON/CSV from its Backup page.')]];
  $('#inst-grid').innerHTML = inst.map(([e, t, d]) => `<div class="panel reveal"><h3>${e} ${esc(t)}</h3><p style="margin:0">${esc(d)}</p></div>`).join('');
}

// ---------- 設定面板 ----------
function initSettings(canvasCtl) {
  const btn = $('#btn-settings'), panel = $('#settings');
  const close = () => { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.onclick = (e) => { e.stopPropagation(); panel.hidden = !panel.hidden; btn.setAttribute('aria-expanded', String(!panel.hidden)); sfx.click(); };
  document.addEventListener('click', (e) => { if (!panel.hidden && !panel.contains(e.target) && e.target !== btn) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { close(); btn.focus(); } });
  $$('.seg', panel).forEach((seg) => $$('button', seg).forEach((b) => b.onclick = () => {
    S[seg.dataset.set] = b.dataset.v; save(); applySettings(); sfx.click();
    if (seg.dataset.set === 'lang') rerender();
    if (seg.dataset.set === 'motion') { canvasCtl.kick(); canvasCtl.redraw(); }
  }));
}
function rerender() { renderStats(); renderCards(); renderProgress(); renderWord(wordIdx); renderGame(); renderStatic(); reveal(); if ($('#q').value) doSearch($('#q').value); }

// ---------- PWA ----------
function initPwa() {
  const net = () => { const el = $('#net'); el.textContent = navigator.onLine ? L('線上', 'Online') : L('離線', 'Offline'); el.classList.toggle('off', !navigator.onLine); };
  addEventListener('online', () => { net(); toast(L('已恢復網路連線', 'Back online')); });
  addEventListener('offline', () => { net(); toast(L('目前離線：首頁與已開啟過的科目仍可使用', 'Offline: the hub and opened subjects still work')); });
  net();
  let deferred = null;
  addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; $('#btn-install').hidden = false; });
  $('#btn-install').onclick = async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice.catch(() => null); deferred = null; $('#btn-install').hidden = true; };
  addEventListener('appinstalled', () => toast(L('已安裝到裝置 🎉', 'Installed 🎉')));
  if (!('serviceWorker' in navigator) || location.protocol === 'file:' || new URLSearchParams(location.search).has('nosw')) return;
  navigator.serviceWorker.register('./service-worker.js', { scope: './' }).then((reg) => {
    const ask = (w) => toast(L('首頁有新版本', 'A new version is available'), { label: L('立即更新', 'Update'), run: () => w.postMessage('skipWaiting') });
    if (reg.waiting && navigator.serviceWorker.controller) ask(reg.waiting);
    reg.addEventListener('updatefound', () => { const w = reg.installing; w?.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) ask(w); }); });
  }).catch(() => {});
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded) { reloaded = true; location.reload(); } });
}

// ---------- 啟動 ----------
(async function boot() {
  applySettings();
  try { await loadData(); } catch (e) {
    $('#main').insertAdjacentHTML('afterbegin', `<div class="panel" style="margin:1rem">${L('資料載入失敗，請用網頁伺服器（例如 GitHub Pages）開啟，不能直接雙擊檔案。', 'Failed to load data. Open via a web server such as GitHub Pages.')}</div>`);
    return;
  }
  const canvasCtl = heroCanvas();
  renderStats(); renderCards(); renderStatic(); initSearch();
  wordIdx = dayIndex(); renderWord(wordIdx); renderGame();
  initSettings(canvasCtl); initPwa(); reveal();
  await Promise.all([loadProgress(), loadOffline()]); renderProgress(); renderCards();
  addEventListener('focus', async () => { await Promise.all([loadProgress(), loadOffline()]); renderProgress(); renderCards(); });
})();
