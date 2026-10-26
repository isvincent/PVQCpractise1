// 多元練習：十種模式，即時回饋、解說、重新作答、隨機、進度紀錄
import * as D from './data.js';
import * as P from './progress.js';
import * as db from './store.js';
import { build, qtypeLabel } from './questions.js';
import { run, reviewList } from './runner.js';
import { status } from './review.js';
import { esc, L, pct, shuffle, toast } from './ui.js';
import { sfx } from './sound.js';
import { setCrumbs, go } from './app.js';
import { unitTitle } from './vocab.js';

export const MODES = [
  ['flash', '🃏', '翻轉式單字記憶卡', 'Flip flashcards'],
  ['en2zh', '🔤', '英文選中文', 'English → Chinese'],
  ['zh2en', '🀄', '中文選英文', 'Chinese → English'],
  ['spell', '⌨️', '英文單字拼字', 'Spelling'],
  ['listen', '🎧', '聽力辨識', 'Listening'],
  ['image', '🖼️', '圖片與單字配對', 'Picture ↔ word'],
  ['match', '🔗', '單字與定義配對', 'Word ↔ definition'],
  ['cloze', '📄', '句子填空', 'Sentence cloze'],
  ['tf', '⭕', '正誤判斷', 'True / False'],
  ['wrong', '♻️', '錯題專項練習', 'Wrong-answer drill'],
];
const modeName = (k) => { const m = MODES.find((x) => x[0] === k); return m ? `${m[1]} ${L(m[2], m[3])}` : L('綜合練習', 'Mixed practice'); };

async function termsFor(scope, arg) {
  if (scope === 'all') return D.allTerms();
  if (scope === 'weak') return D.allTerms().filter((t) => status(P.item(t.id)) === 'weak' || P.item(t.id)?.mark === 'unfamiliar');
  if (scope === 'fav') return D.allTerms().filter((t) => P.item(t.id)?.fav);
  if (scope === 'wrong') return (await db.all('wrongbook')).filter((w) => !w.resolved).sort((a, b) => b.count - a.count).map((w) => D.term(w.id)).filter(Boolean);
  if (scope === 'word') return [D.term(arg)].filter(Boolean);
  if (scope === 'ids') { try { return JSON.parse(sessionStorage.getItem('chemapp.ids') || '[]').map((id) => D.term(id)).filter(Boolean); } catch { return []; } }
  return D.unitTerms(scope);
}
const scopeName = (scope) => ({ all: L('全部單字', 'All words'), weak: L('待加強', 'Needs work'), fav: L('收藏', 'Favourites'), wrong: L('錯題本', 'Wrong answers'), ids: L('補救練習', 'Remedial'), word: L('單一單字', 'Single word') }[scope] || unitTitle(D.unit(scope)));

export function practiceHub(v, preset) {
  setCrumbs([[L('練習', 'Practice')]]);
  const scopes = [['all', L('全部單字', 'All words')], ['weak', L('待加強與不熟悉', 'Needs work')], ['wrong', L('錯題本', 'Wrong answers')], ['fav', L('收藏', 'Favourites')],
    ...D.units.map((u) => [u.id, unitTitle(u)])];
  v.innerHTML = `<h1>✏️ ${L('多元練習', 'Practice')}</h1>
  <label class="field" for="scope">${L('練習範圍', 'Scope')}</label>
  <select id="scope">${scopes.map(([k, t]) => `<option value="${k}" ${k === preset ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>
  <div class="grid tight" style="margin-top:1rem">${MODES.map(([k, i, zh, en]) => `<button class="card" data-mode="${k}" style="text-align:center;cursor:pointer"><div style="font-size:2rem">${i}</div><b>${L(zh, en)}</b></button>`).join('')}
  <button class="card" data-mode="mix" style="text-align:center;cursor:pointer"><div style="font-size:2rem">🎲</div><b>${L('綜合隨機', 'Mixed')}</b></button></div>
  <p class="small muted">${L('練習會即時回饋與解說；答錯可「重新作答」，第一次作答才計入紀錄。', 'Instant feedback; only the first attempt is recorded.')}</p>`;
  v.querySelectorAll('[data-mode]').forEach((b) => b.onclick = () => {
    const s = v.querySelector('#scope').value;
    const m = b.dataset.mode;
    if (m === 'flash') return go(`#/flash/${['all', 'weak', 'fav'].includes(s) ? s : s === 'wrong' ? 'weak' : s}`);
    if (m === 'wrong') return go('#/practice/wrong/mix');
    go(`#/practice/${s}/${m}`);
  });
}

export async function practiceRun(v, scope, mode, arg) {
  if (scope === 'word') { arg = mode; mode = 'mix'; }
  setCrumbs([[L('練習', 'Practice'), '#/practice'], [scopeName(scope)], [modeName(mode)]]);
  const terms = await termsFor(scope, arg);
  if (!terms.length) {
    v.innerHTML = `<div class="card"><p>${scope === 'wrong' ? L('錯題本目前是空的 🎉', 'No wrong answers 🎉') : L('這個範圍目前沒有單字。', 'Nothing here yet.')}</p><a class="btn" href="#/practice">${L('回練習選單', 'Back')}</a></div>`;
    return;
  }
  if (mode === 'match') return matchPractice(v, terms, scope);
  const types = mode === 'mix' ? ['en2zh', 'zh2en', 'listen', 'image', 'cloze', 'tf', 'spell', 'def'] : [mode];
  const n = scope === 'word' ? 4 : Math.min(10, terms.length);
  let qs = scope === 'word' ? ['en2zh', 'zh2en', 'spell', 'cloze'].map((t) => build(terms, [t], 1)[0]).filter(Boolean) : build(terms, types, n);
  if (!qs.length) { v.innerHTML = `<p>${L('這些單字無法產生此題型，請換一種模式。', 'This mode is not available for these words.')}</p>`; return; }
  const start = () => {
    v.innerHTML = `<h1>${modeName(mode)}</h1><div id="pr"></div>`;
    run(v.querySelector('#pr'), qs, { mode: 'practice', ctxMode: 'practice-' + mode, onDone: (res) => done(res) });
  };
  const done = async (res) => {
    const ok = res.filter((r) => r.ok).length;
    await afterPractice(scope, res.length);
    const wrong = [...new Set(res.filter((r) => !r.ok).map((r) => r.id))];
    sfx(ok === res.length ? 'win' : 'ok');
    v.innerHTML = `<h1>${L('練習完成', 'Practice complete')} 🎉</h1>
      <div class="kpis"><div class="card stat"><b>${ok}/${res.length}</b><span>${L('答對', 'Correct')}</span></div>
      <div class="card stat"><b>${pct(ok, res.length)}%</b><span>${L('正確率', 'Accuracy')}</span></div></div>
      <h2>${L('回顧', 'Review')}</h2>${reviewList(res, qs)}
      <div class="row" style="margin-top:1rem">
        <button class="btn" data-again>↺ ${L('重新練習（重新抽題）', 'Practise again')}</button>
        ${wrong.length ? `<button class="btn orange" data-wrong>🩹 ${L('只練剛剛錯的', 'Only the ones I missed')}</button>` : ''}
        <a class="btn ghost" href="#/practice/${['all', 'weak', 'fav', 'wrong', 'ids', 'word'].includes(scope) ? '' : scope}">${L('換一種練習', 'Other mode')}</a></div>`;
    v.querySelector('[data-again]').onclick = () => { qs = build(terms, types, n); start(); };
    v.querySelector('[data-wrong]')?.addEventListener('click', () => { qs = build(wrong.map((id) => D.term(id)), types, wrong.length); start(); });
  };
  start();
}

/** 單元練習量達標 → 第三階段完成 */
async function afterPractice(scope, n) {
  const u = D.unit(scope);
  if (!u) return;
  const prog = P.unitProgress(u.id);
  const practiced = (prog.practiced || 0) + n;
  await P.saveUnitExtra(u.id, { practiced });
  if (practiced >= Math.min(u.terms.length, 15)) await P.markStage(u.id, 'practice');
}

/** 配對板：左欄英文、右欄定義（中文或英文），每回合 5 組 */
export function matchBoard(root, terms, opt) {
  const right = opt.right || ((t) => t.ai.def_zh || t.zhQ);
  let left = shuffle(terms), rightList = shuffle(terms);
  let sel = null, matched = 0, misses = 0;
  const firstTry = new Map();
  const t0 = Date.now();
  root.innerHTML = `<div class="match-cols">
    <div class="stack" role="group" aria-label="${L('英文詞', 'Terms')}">${left.map((t) => `<button class="tile" data-l="${t.id}" lang="en">${esc(t.src.en)}</button>`).join('')}</div>
    <div class="stack" role="group" aria-label="${L('定義', 'Definitions')}">${rightList.map((t) => `<button class="tile small" data-r="${t.id}" style="font-weight:600;text-align:left">${esc(right(t))}</button>`).join('')}</div></div>`;
  root.querySelectorAll('[data-l]').forEach((b) => b.onclick = () => {
    if (b.classList.contains('done')) return;
    root.querySelectorAll('[data-l]').forEach((x) => x.classList.remove('sel'));
    b.classList.add('sel'); sel = b.dataset.l; sfx('click');
  });
  root.querySelectorAll('[data-r]').forEach((b) => b.onclick = async () => {
    if (!sel || b.classList.contains('done')) { if (!sel) toast(L('先選左邊的英文詞', 'Pick a term on the left first')); return; }
    const ok = b.dataset.r === sel;
    if (!firstTry.has(sel)) { firstTry.set(sel, ok); await P.recordAnswer(sel, ok, { mode: opt.ctxMode, qtype: 'def', unit: D.term(sel).unit }); }
    if (ok) {
      sfx('ok');
      b.classList.add('done'); root.querySelector(`[data-l="${sel}"]`).classList.add('done');
      root.querySelector(`[data-l="${sel}"]`).classList.remove('sel');
      sel = null; matched++;
      if (matched === terms.length) opt.onDone({ misses, ms: Date.now() - t0, results: [...firstTry].map(([id, ok2]) => ({ id, ok: ok2, type: 'def' })) });
    } else {
      sfx('no'); misses++;
      b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 400);
      opt.onMiss?.(misses);
    }
  });
}

function matchPractice(v, terms, scope) {
  const round = () => {
    const set = shuffle(terms).slice(0, 5);
    v.innerHTML = `<h1>${modeName('match')}</h1><p class="muted">${L('先點左邊的英文詞，再點右邊對應的中文解釋。', 'Tap a term, then its definition.')}</p><div id="mb"></div>`;
    matchBoard(v.querySelector('#mb'), set, {
      ctxMode: 'practice-match',
      onDone: async ({ misses, results }) => {
        await afterPractice(scope, results.length);
        sfx('win');
        v.insertAdjacentHTML('beforeend', `<div class="feedback ok"><h3>${L('全部配對完成！', 'All matched!')}</h3><p>${L('錯誤嘗試', 'Misses')}：${misses}</p>
          <div class="row"><button class="btn" data-next>${L('下一回合', 'Next round')}</button><a class="btn ghost" href="#/practice">${L('換一種練習', 'Other mode')}</a></div></div>`);
        v.querySelector('[data-next]').onclick = round;
      },
    });
  };
  round();
}

export { qtypeLabel };
