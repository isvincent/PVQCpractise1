// 教育遊戲：五種遊戲都直接使用教材單字，作答結果計入學習紀錄
import * as D from './data.js';
import * as P from './progress.js';
import * as db from './store.js';
import { make } from './questions.js';
import { matchBoard } from './practice.js';
import { esc, L, shuffle, sample, fmtTime, confetti, toast } from './ui.js';
import { speak } from './speech.js';
import { sfx } from './sound.js';
import { setCrumbs } from './app.js';
import { unitTitle } from './vocab.js';
import { illus } from './illustrations.js';

export const GAMES = [
  ['match', '🔗', '單字配對挑戰', 'Match challenge', '6 組英文與中文配對，越快越少失誤分數越高。', 'Pair 6 terms with their meanings fast.'],
  ['speed', '⚡', '限時單字快答', 'Speed round', '60 秒內連續作答，連對有加乘。', '60 seconds, combo bonus for streaks.'],
  ['spell', '🧱', '單字拼字闖關', 'Spelling quest', '用字母方塊拼出單字，一關比一關長，3 條命。', 'Build words from letter tiles, 3 lives.'],
  ['memory', '🃏', '翻牌記憶遊戲', 'Memory flip', '翻開兩張卡，找出英文與中文相同的一對。', 'Flip cards to find English–Chinese pairs.'],
  ['show', '🏆', '主題知識挑戰賽', 'Topic quiz show', '選單元與分數格答題，可分兩隊在課堂對戰。', 'Pick a topic and points; play in two teams.'],
];

const best = async (g) => (await db.getMeta('best-' + g, 0));
async function saveScore(g, score, extra = {}) {
  const b = await best(g);
  if (score > b) await db.setMeta('best-' + g, score);
  await P.log('game', { game: g, score, ...extra });
  await P.bump('games');
  await P.addXp(20);
  return score > b;
}
function scopeTerms(scope) { return scope && scope !== 'all' ? D.unitTerms(scope) : D.allTerms(); }
const scopeSel = (id = 'gscope') => `<label class="field" for="${id}">${L('範圍', 'Scope')}</label><select id="${id}"><option value="all">${L('全部單元', 'All units')}</option>${D.units.map((u) => `<option value="${u.id}">${esc(unitTitle(u))}</option>`).join('')}</select>`;

export async function gamesHub(v, g) {
  if (g) return GAME_FN[g]?.(v);
  setCrumbs([[L('學習遊戲', 'Games')]]);
  const bests = await Promise.all(GAMES.map(([k]) => best(k)));
  v.innerHTML = `<h1>🎮 ${L('學習遊戲', 'Learning games')}</h1>
  <p class="muted">${L('每場遊戲的作答都會計入熟練度與錯題本，完成遊戲可得經驗值。', 'Every answer counts toward mastery; finishing games earns XP.')}</p>
  <div class="grid">${GAMES.map(([k, i, zh, en, dz, de], n) => `<a class="card" href="#/games/${k}" style="text-decoration:none;color:inherit">
    <div style="font-size:2.4rem">${i}</div><h3 style="margin:.2rem 0">${L(zh, en)}</h3><p class="small">${L(dz, de)}</p><span class="chip">🏅 ${L('最高分', 'Best')} ${bests[n]}</span></a>`).join('')}</div>`;
}

function header(v, k) {
  const g = GAMES.find((x) => x[0] === k);
  setCrumbs([[L('學習遊戲', 'Games'), '#/games'], [L(g[2], g[3])]]);
  return `<h1>${g[1]} ${L(g[2], g[3])}</h1>`;
}

function endCard(v, score, isBest, again, extraHtml = '') {
  sfx('win'); if (isBest) confetti();
  v.querySelector('#gend').innerHTML = `<div class="feedback ok"><h3>${L('遊戲結束', 'Game over')}：${score} ${L('分', 'pts')} ${isBest ? '🏅 ' + L('新紀錄！', 'New best!') : ''}</h3>${extraHtml}
    <div class="row"><button class="btn" data-again>↺ ${L('再玩一次', 'Play again')}</button><a class="btn ghost" href="#/games">${L('回遊戲選單', 'All games')}</a></div></div>`;
  v.querySelector('[data-again]').onclick = again;
  v.querySelector('[data-again]').focus();
}

// 1 單字配對挑戰
function gMatch(v) {
  const setup = () => {
    v.innerHTML = header(v, 'match') + `<div class="card">${scopeSel()}<button class="btn" style="margin-left:.5rem" data-go>${L('開始', 'Start')}</button></div><div id="gb" style="margin-top:1rem"></div><div id="gend"></div>`;
    v.querySelector('[data-go]').onclick = () => play(v.querySelector('#gscope').value);
  };
  const play = (scope) => {
    const terms = sample(scopeTerms(scope), 6);
    const box = v.querySelector('#gb');
    v.querySelector('#gend').innerHTML = '';
    box.innerHTML = `<p class="muted" id="ginfo"></p><div id="mb"></div>`;
    const t0 = Date.now();
    const tick = setInterval(() => { if (!box.isConnected) return clearInterval(tick); box.querySelector('#ginfo').textContent = `⏱ ${Math.round((Date.now() - t0) / 1000)}s`; }, 500);
    matchBoard(box.querySelector('#mb'), terms, {
      ctxMode: 'game-match', right: (t) => t.zhShort,
      onDone: async ({ misses, ms }) => {
        clearInterval(tick);
        const score = Math.max(10, 600 - Math.round(ms / 1000) * 5 - misses * 40);
        endCard(v, score, await saveScore('match', score, { misses }), () => play(scope), `<p>${L('用時', 'Time')} ${fmtTime(ms)}・${L('失誤', 'Misses')} ${misses}</p>`);
      },
    });
  };
  setup();
}

// 2 限時單字快答
function gSpeed(v) {
  v.innerHTML = header(v, 'speed') + `<div class="card">${scopeSel()}<button class="btn" style="margin-left:.5rem" data-go>${L('開始 60 秒', 'Start 60s')}</button></div><div id="gb" style="margin-top:1rem"></div><div id="gend"></div>`;
  v.querySelector('[data-go]').onclick = () => {
    const pool = scopeTerms(v.querySelector('#gscope').value);
    const box = v.querySelector('#gb');
    v.querySelector('#gend').innerHTML = '';
    let score = 0, combo = 0, n = 0, ok = 0;
    const end = Date.now() + 60000;
    const misses = [];
    const next = () => {
      const left = Math.ceil((end - Date.now()) / 1000);
      if (left <= 0 || !box.isConnected) return finish();
      const t = pool[Math.floor(Math.random() * pool.length)];
      const q = make(Math.random() < 0.5 ? 'en2zh' : 'zh2en', t);
      const t0 = Date.now();
      box.innerHTML = `<div class="card q-card"><div class="qbar"><span class="timer">⏱ ${left}s</span><span>${L('分數', 'Score')} <b>${score}</b></span><span>🔥 ×${combo}</span></div>
        <div class="q-prompt">${q.prompt}</div><div class="options">${q.options.map((o, k) => `<button class="opt" data-v="${o.id}" ${q.optLang ? 'lang="en"' : ''}><span class="key">${k + 1}</span>${esc(o.label)}</button>`).join('')}</div></div>`;
      box.querySelectorAll('.opt').forEach((b) => b.onclick = async () => {
        const good = b.dataset.v === q.answer;
        n++;
        if (good) { ok++; combo++; score += 10 + Math.min(combo, 10) * 2; sfx('ok'); }
        else { combo = 0; sfx('no'); misses.push(t.id); }
        P.recordAnswer(t.id, good, { mode: 'game-speed', qtype: q.type, ms: Date.now() - t0, unit: t.unit });
        b.classList.add(good ? 'correct' : 'wrong');
        setTimeout(next, good ? 180 : 650);
      });
    };
    const keyh = (e) => { const k = +e.key; const bs = box.querySelectorAll('.opt'); if (k >= 1 && k <= bs.length) bs[k - 1].click(); };
    addEventListener('keydown', keyh);
    let done = false;
    const timer = setInterval(() => { if (Date.now() >= end || !box.isConnected) { clearInterval(timer); finish(); } else { const el = box.querySelector('.timer'); if (el) el.textContent = `⏱ ${Math.ceil((end - Date.now()) / 1000)}s`; } }, 300);
    async function finish() {
      if (done) return; done = true;
      removeEventListener('keydown', keyh); clearInterval(timer);
      if (!box.isConnected) return;
      box.innerHTML = '';
      endCard(v, score, await saveScore('speed', score, { n, ok }), () => v.querySelector('[data-go]').click(),
        `<p>${L('作答', 'Answered')} ${n}・${L('答對', 'Correct')} ${ok}</p>${misses.length ? `<p class="small">${L('需要複習', 'Review')}：${[...new Set(misses)].map((id) => `<a href="#/word/${id}" lang="en">${esc(D.term(id).src.en)}</a>`).join('、')}</p>` : ''}`);
    }
    next();
  };
}

// 3 單字拼字闖關
function gSpell(v) {
  v.innerHTML = header(v, 'spell') + `<div class="card">${scopeSel()}<button class="btn" style="margin-left:.5rem" data-go>${L('開始闖關', 'Start')}</button></div><div id="gb" style="margin-top:1rem"></div><div id="gend"></div>`;
  v.querySelector('[data-go]').onclick = () => {
    // 依字長排序：越後面的關卡單字越長；只用單一單字（不含空白）以便字母方塊操作
    const pool = scopeTerms(v.querySelector('#gscope').value).filter((t) => /^[A-Za-z-]+$/.test(t.src.en) && t.src.en.length <= 18);
    if (pool.length < 3) return toast(L('這個範圍可拼字的單字太少，請選其他範圍。', 'Too few spellable words here.'));
    const byLen = shuffle(pool).sort((a, b) => a.src.en.length - b.src.en.length);
    const box = v.querySelector('#gb');
    v.querySelector('#gend').innerHTML = '';
    let level = 1, lives = 3, score = 0, idx = 0;
    const per = 3;
    const pickWord = () => {
      const band = Math.min(byLen.length - 1, Math.floor(((level - 1) / 8) * byLen.length) + Math.floor(Math.random() * Math.max(1, byLen.length / 8)));
      return byLen[Math.min(band, byLen.length - 1)];
    };
    const round = () => {
      if (!box.isConnected) return;
      const t = pickWord();
      const word = t.src.en;
      const letters = shuffle([...word.toLowerCase()].concat(sample('etaoinshrdlcump'.split(''), Math.min(3, 1 + Math.floor(level / 2)))));
      let typed = [];
      const t0 = Date.now();
      const draw = () => {
        box.innerHTML = `<div class="card q-card"><div class="qbar"><span>${L('第', 'Level')} ${level} ${L('關', '')}（${idx % per + 1}/${per}）</span><span>${'❤️'.repeat(lives)}${'🤍'.repeat(3 - lives)}</span><span>${L('分數', 'Score')} ${score}</span></div>
          <div class="q-prompt">${esc(t.zhQ)}</div><p class="small muted">${esc(t.ai.def_zh || '')}</p>
          <p><button class="btn soft small" data-say>🔊 ${L('聽發音', 'Listen')}</button></p>
          <div class="slots" aria-live="polite">${[...word].map((c, k) => `<span>${esc(typed[k]?.ch ?? '')}</span>`).join('')}</div>
          <div class="letters">${letters.map((c, k) => `<button data-k="${k}" ${typed.some((x) => x.k === k) ? 'disabled' : ''} lang="en" aria-label="${c}">${esc(c)}</button>`).join('')}</div>
          <div class="row" style="justify-content:center"><button class="btn ghost small" data-back>⌫ ${L('退回', 'Undo')}</button><button class="btn ghost small" data-clear>${L('清除', 'Clear')}</button><button class="btn" data-check>${L('確認', 'Check')}</button></div></div>`;
        box.querySelector('[data-say]').onclick = () => { speak(word); P.recordListen(t.id); };
        box.querySelectorAll('[data-k]').forEach((b) => b.onclick = () => { if (typed.length < word.length) { typed.push({ k: +b.dataset.k, ch: letters[+b.dataset.k] }); sfx('click'); draw(); } });
        box.querySelector('[data-back]').onclick = () => { typed.pop(); draw(); };
        box.querySelector('[data-clear]').onclick = () => { typed = []; draw(); };
        box.querySelector('[data-check]').onclick = async () => {
          const guess = typed.map((x) => x.ch).join('');
          const ok = guess === word.toLowerCase();
          await P.recordAnswer(t.id, ok, { mode: 'game-spell', qtype: 'spell', ms: Date.now() - t0, unit: t.unit });
          if (ok) { sfx('ok'); score += 20 + word.length * 5 + level * 5; idx++; if (idx % per === 0) { level++; sfx('level'); toast(L(`進入第 ${level} 關！`, `Level ${level}!`)); } setTimeout(round, 500); box.querySelector('.slots').classList.add('pop'); }
          else {
            sfx('no'); lives--;
            toast(L(`正確拼法：${word}`, `Correct: ${word}`));
            if (lives <= 0) return finish();
            setTimeout(round, 1300);
          }
        };
      };
      draw();
      speak(word);
    };
    const finish = async () => { box.innerHTML = ''; endCard(v, score, await saveScore('spell', score, { level }), () => v.querySelector('[data-go]').click(), `<p>${L('到達第', 'Reached level')} ${level} ${L('關', '')}</p>`); };
    round();
  };
}

// 4 翻牌記憶遊戲
function gMemory(v) {
  v.innerHTML = header(v, 'memory') + `<div class="card">${scopeSel()}<button class="btn" style="margin-left:.5rem" data-go>${L('開始', 'Start')}</button></div><div id="gb" style="margin-top:1rem"></div><div id="gend"></div>`;
  v.querySelector('[data-go]').onclick = () => {
    const terms = sample(scopeTerms(v.querySelector('#gscope').value), 6);
    const cards = shuffle(terms.flatMap((t) => [{ id: t.id, face: t.src.en, en: true }, { id: t.id, face: t.zhShort, en: false }]));
    const box = v.querySelector('#gb');
    v.querySelector('#gend').innerHTML = '';
    let up = [], flips = 0, matched = 0, lock = false;
    const tried = new Set();
    const t0 = Date.now();
    box.innerHTML = `<p class="muted" id="mi">${L('翻牌次數', 'Flips')}：0</p><div class="mem-grid">${cards.map((c, k) => `<button class="mem-card" data-k="${k}" aria-label="${L('第', 'Card ')} ${k + 1} ${L('張牌（蓋著）', '(face down)')}">?</button>`).join('')}</div>`;
    box.querySelectorAll('.mem-card').forEach((b) => b.onclick = async () => {
      const k = +b.dataset.k;
      if (lock || b.classList.contains('up') || b.classList.contains('matched')) return;
      b.classList.add('up'); b.textContent = cards[k].face; if (cards[k].en) b.lang = 'en';
      b.setAttribute('aria-label', cards[k].face);
      sfx('flip'); up.push(k); flips++;
      box.querySelector('#mi').textContent = `${L('翻牌次數', 'Flips')}：${flips}`;
      if (up.length < 2) return;
      const [a, c] = up.map((x) => cards[x]);
      const ok = a.id === c.id && a.en !== c.en;
      // 每個單字只記錄第一次嘗試配對的結果
      for (const x of [a, c]) if (!tried.has(x.id) && (ok || a.id !== c.id)) { tried.add(x.id); P.recordAnswer(x.id, ok, { mode: 'game-memory', qtype: 'en2zh', unit: D.term(x.id).unit }); }
      if (ok) {
        sfx('ok'); up.forEach((x) => box.querySelector(`[data-k="${x}"]`).classList.replace('up', 'matched')); up = []; matched++;
        if (matched === terms.length) {
          const ms = Date.now() - t0;
          const score = Math.max(10, 500 - (flips - 12) * 15 - Math.round(ms / 1000));
          endCard(v, score, await saveScore('memory', score, { flips }), () => v.querySelector('[data-go]').click(), `<p>${L('翻牌', 'Flips')} ${flips}・${L('用時', 'Time')} ${fmtTime(ms)}</p>`);
        }
      } else {
        lock = true; sfx('no');
        setTimeout(() => { up.forEach((x) => { const el = box.querySelector(`[data-k="${x}"]`); el.classList.remove('up'); el.textContent = '?'; el.removeAttribute('lang'); }); up = []; lock = false; }, 900);
      }
    });
  };
}

// 5 主題知識挑戰賽（可分隊）
function gShow(v) {
  v.innerHTML = header(v, 'show') + `<div class="card">
    <label class="field" for="teams">${L('隊伍數', 'Teams')}</label><select id="teams"><option value="1">${L('個人', 'Solo')}</option><option value="2">${L('兩隊對戰', '2 teams')}</option></select>
    <p class="small muted">${L('隨機抽 4 個單元作為主題，每格分數越高題目越難（100 基礎、200 進階、300 挑戰）。', '4 random topics; 100/200/300 points by difficulty.')}</p>
    <button class="btn" data-go>${L('開始', 'Start')}</button></div><div id="gb" style="margin-top:1rem"></div><div id="gend"></div>`;
  v.querySelector('[data-go]').onclick = () => {
    const teams = +v.querySelector('#teams').value;
    const cats = sample(D.units.filter((u) => u.terms.length >= 6), 4);
    const scores = Array(teams).fill(0);
    let turn = 0, played = 0;
    const usedCell = new Set();
    const box = v.querySelector('#gb');
    v.querySelector('#gend').innerHTML = '';
    const board = () => {
      box.innerHTML = `<div class="row between"><div class="row">${scores.map((s, i) => `<span class="chip" style="font-size:1rem">${teams > 1 ? (i ? '🟦 B' : '🟥 A') : '🙂'} ${s}</span>`).join('')}</div>
        ${teams > 1 ? `<b>${L('輪到', 'Turn')}：${turn ? '🟦 B' : '🟥 A'}</b>` : ''}</div>
        <div class="board" style="--cols:4;margin-top:.6rem">${cats.map((u) => `<div class="cat">${esc(unitTitle(u))}</div>`).join('')}
        ${[100, 200, 300].map((pts) => cats.map((u, ci) => `<button data-c="${ci}" data-p="${pts}" ${usedCell.has(ci + '-' + pts) ? 'disabled' : ''}>${pts}</button>`).join('')).join('')}</div>`;
      box.querySelectorAll('[data-c]').forEach((b) => b.onclick = () => ask(+b.dataset.c, +b.dataset.p));
    };
    const ask = (ci, pts) => {
      const lv = pts / 100;
      const u = cats[ci];
      let pool = D.unitTerms(u.id).filter((t) => t.level === lv);
      if (!pool.length) pool = D.unitTerms(u.id);
      const t = pool[Math.floor(Math.random() * pool.length)];
      const type = ['def', 'cloze', 'tf', 'image'][Math.floor(Math.random() * 4)];
      const q = make(type, t) || make('en2zh', t);
      const t0 = Date.now();
      box.innerHTML = `<div class="card q-card"><p class="muted">${esc(unitTitle(u))}・${pts} ${L('分', 'pts')}</p>
        ${q.illus ? `<div class="illus" style="max-width:380px;margin:0 auto">${illus(q.illus)}</div>` : ''}
        <div class="q-prompt">${q.prompt}</div>${q.sub ? `<p class="small muted">${q.sub}</p>` : ''}
        <div class="options">${q.options.map((o, k) => `<button class="opt" data-v="${o.id}" ${q.optLang ? 'lang="en"' : ''}><span class="key">${k + 1}</span>${esc(o.label)}</button>`).join('')}</div><div id="sfb"></div></div>`;
      box.querySelectorAll('.opt').forEach((b) => b.onclick = async () => {
        const ok = b.dataset.v === q.answer;
        box.querySelectorAll('.opt').forEach((x) => { x.disabled = true; if (x.dataset.v === q.answer) x.classList.add('correct'); });
        if (!ok) b.classList.add('wrong');
        sfx(ok ? 'ok' : 'no');
        await P.recordAnswer(t.id, ok, { mode: 'game-show', qtype: q.type, ms: Date.now() - t0, unit: t.unit });
        scores[turn] += ok ? pts : 0;
        usedCell.add(ci + '-' + pts); played++;
        box.querySelector('#sfb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'no'}"><b>${ok ? L('答對 +' + pts, 'Correct +' + pts) : L('答錯', 'Wrong')}</b>　<span lang="en">${esc(t.src.en)}</span> = ${esc(t.zhQ)}${q.note ? `<p class="small">${q.note}</p>` : ''}
          <div class="row"><button class="btn" data-back>${played >= 12 ? L('看結果', 'Results') : L('回看板', 'Back to board')}</button></div></div>`;
        box.querySelector('[data-back]').onclick = async () => {
          if (teams > 1) turn = 1 - turn;
          if (played >= 12) {
            box.innerHTML = '';
            const top = Math.max(...scores);
            endCard(v, top, await saveScore('show', top), () => v.querySelector('[data-go]').click(),
              teams > 1 ? `<p>🟥 A ${scores[0]}　🟦 B ${scores[1]}　${scores[0] === scores[1] ? L('平手！', 'Draw!') : (scores[0] > scores[1] ? '🟥 A' : '🟦 B') + L(' 獲勝！', ' wins!')}</p>` : '');
          } else board();
        };
        box.querySelector('[data-back]').focus();
      });
    };
    board();
  };
}

const GAME_FN = { match: gMatch, speed: gSpeed, spell: gSpell, memory: gMemory, show: gShow };
