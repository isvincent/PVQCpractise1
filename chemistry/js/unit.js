// 單元自主學習五階段：探索與診斷 → 理解與學習 → 演練與應用 → 測驗與補救 → 成果與反思
import * as D from './data.js';
import * as P from './progress.js';
import * as db from './store.js';
import { status, masteryScore } from './review.js';
import { esc, L, toast, pct, fmtDate, download, shuffle } from './ui.js';
import { setCrumbs, go } from './app.js';
import { unitTitle, unitStats, termCard, lvChip } from './vocab.js';
import { stepper, CALCS } from './concepts.js';
import { MODES } from './practice.js';
import { startQuiz } from './quiz.js';

const STAGE_INFO = {
  explore: ['🧭', '探索與診斷', 'Explore'],
  learn: ['📖', '理解與學習', 'Learn'],
  practice: ['✏️', '演練與應用', 'Practise'],
  test: ['📝', '測驗與補救', 'Test'],
  reflect: ['🌱', '成果與反思', 'Reflect'],
};

function stageNav(uid, cur) {
  const prog = P.unitProgress(uid);
  return `<nav class="stages" aria-label="${L('學習階段', 'Stages')}">${P.STAGES.map((k, i) => {
    const [ic, zh, en] = STAGE_INFO[k];
    return `<a href="#/unit/${uid}/${k}" class="${prog.stages?.[k] ? 'done' : ''}" ${k === cur ? 'aria-current="step"' : ''}>
      <span class="n">${prog.stages?.[k] ? '✅' : ic}</span><span>${i + 1}. ${L(zh, en)}</span><span class="sr-only">${prog.stages?.[k] ? L('已完成', 'done') : ''}</span></a>`;
  }).join('')}</nav>`;
}

export async function unitPage(v, uid, stage) {
  const u = D.unit(uid);
  if (!u) { v.innerHTML = `<p>${L('找不到單元', 'Unit not found')}</p>`; return; }
  if (!stage) {
    const prog = P.unitProgress(uid);
    stage = P.STAGES.find((k) => !prog.stages?.[k]) || 'reflect';
  }
  const ch = D.chapterOf(uid);
  setCrumbs([[L('教材目錄', 'Course'), '#/course'], [L(ch.title, ch.title_en)], [unitTitle(u), `#/unit/${uid}`], [L(STAGE_INFO[stage][1], STAGE_INFO[stage][2])]]);
  const st = unitStats(u);
  v.innerHTML = `<div class="hero" style="padding:1rem 1.2rem"><h1 style="font-size:1.4rem">${esc(unitTitle(u))}</h1>
    <p>⏱ ${L('預估', 'Est.')} ${u.minutes} ${L('分鐘', 'min')}・${u.terms.length} ${L('個單字', 'words')}・${L('完成', 'Done')} ${st.completion}%・${L('精熟', 'Mastered')} ${st.mastered}</p></div>
    ${stageNav(uid, stage)}<div id="stage"></div>`;
  const box = v.querySelector('#stage');
  await ({ explore, learn, practice, test, reflect })[stage](box, u);
}

// 第一階段：探索與診斷
async function explore(box, u) {
  const prog = P.unitProgress(u.id);
  const goal = (await db.get('goals', u.id)) || {};
  box.innerHTML = `<div class="grid two">
    <div class="card"><h2 style="margin-top:0">🎯 ${L('單元學習目標', 'Learning objectives')}</h2><ul>${(L(u.goals, u.goals_en) || u.goals).map((g) => `<li>${esc(g)}</li>`).join('')}</ul>
      <h3>${L('先備知識', 'Prerequisites')}</h3><ul>${(L(u.prereq, u.prereq_en) || u.prereq).map((g) => `<li>${esc(g)}</li>`).join('')}</ul>
      <h3>${L('關鍵概念', 'Key concepts')}</h3><div class="row">${u.concepts.map((c) => `<span class="chip" lang="en">${esc(c)}</span>`).join('')}</div>
      <p class="small muted">${esc(L(u.desc, u.desc_en))}</p></div>
    <div class="card"><h2 style="margin-top:0">🧭 ${L('學前診斷', 'Diagnostic pre-test')}</h2>
      ${prog.pre != null ? `<p>${L('你的學前分數', 'Your pre-test score')}：<b style="font-size:1.4rem">${prog.pre}</b></p><p>${recommend(prog.pre, u)}</p>` : `<p>${L('先做 6 題簡短診斷，系統會依結果推薦學習起點。', 'Take a 6-question diagnostic to get a recommended starting point.')}</p>`}
      <button class="btn" data-pre>${prog.pre != null ? L('重新診斷', 'Retake') : L('開始學前診斷', 'Start pre-test')}</button></div>
  </div>
  <form class="card" id="goal-f" style="margin-top:.9rem"><h2 style="margin-top:0">📌 ${L('設定我的學習目標', 'My learning goal')}</h2>
    <div class="row"><label>${L('目標測驗分數', 'Target score')} <input type="number" name="target" min="0" max="100" value="${goal.target ?? 80}" style="width:90px"></label>
      <label>${L('預計完成日', 'Target date')} <input type="date" name="date" value="${esc(goal.date || '')}"></label>
      <label>${L('目標精熟單字數', 'Words to master')} <input type="number" name="words" min="1" max="${u.terms.length}" value="${goal.words ?? Math.ceil(u.terms.length * 0.7)}" style="width:90px"></label></div>
    <label class="field" for="g-note">${L('我想達成的事（自己的話）', 'In my own words')}</label><textarea id="g-note" name="note">${esc(goal.note || '')}</textarea>
    <button class="btn teal" style="margin-top:.5rem">${L('儲存目標', 'Save goal')}</button></form>`;
  box.querySelector('[data-pre]').onclick = () => startQuiz(box, { type: 'pre', unit: u.id });
  box.querySelector('#goal-f').onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await db.put('goals', { unit: u.id, target: +fd.get('target'), date: fd.get('date'), words: +fd.get('words'), note: fd.get('note'), ts: Date.now() });
    await P.log('goal', { unit: u.id });
    toast(L('已儲存學習目標', 'Goal saved'));
  };
}

function recommend(pre, u) {
  if (pre < 50) return L(`建議從「基礎」的 ${u.levels[1]} 個單字開始，先看圖文解說與單字卡。`, `Start with the ${u.levels[1]} Basic words and flashcards.`);
  if (pre < 80) return L(`基礎不錯！建議重點學習「進階」的 ${u.levels[2]} 個單字。`, `Focus on the ${u.levels[2]} Advanced words.`);
  return L('表現優秀，可直接挑戰「挑戰」級單字，再做單元測驗。', 'Excellent — go straight to Challenge words and the unit test.');
}

// 第二階段：理解與學習
function learn(box, u) {
  const all = D.unitTerms(u.id);
  let lv = 0, sort = 'level';
  const viewed = () => all.filter((t) => (P.item(t.id)?.views || 0) > 0).length;
  const draw = () => {
    let list = lv ? all.filter((t) => t.level === lv) : all.slice();
    if (sort === 'az') list.sort((a, b) => a.src.en.localeCompare(b.src.en));
    else if (sort === 'pdf') list.sort((a, b) => a.src.order - b.src.order);
    else if (sort === 'rand') list = shuffle(list);
    else if (sort === 'need') list.sort((a, b) => masteryScore(P.item(a.id)) - masteryScore(P.item(b.id)));
    const vd = viewed();
    box.querySelector('#cards').innerHTML = list.map(termCard).join('');
    box.querySelector('#lp').innerHTML = `${L('已閱讀', 'Viewed')} ${vd}/${all.length}（${L('閱讀 80% 即完成本階段', '80% completes this stage')}）<div class="progress"><i style="width:${pct(vd, all.length)}%"></i></div>`;
  };
  box.innerHTML = `<div id="cstep"></div>${CALCS[u.id] ? '<div id="calc" style="margin-top:.9rem"></div>' : ''}
    <h2>${L('單字與圖文解說', 'Words & explanations')}</h2>
    <div class="row between"><div class="pill-tabs" role="group" aria-label="${L('難度', 'Level')}">
      ${[[0, L('全部', 'All')], [1, '🌱 ' + L('基礎', 'Basic')], [2, '🌿 ' + L('進階', 'Advanced')], [3, '🌳 ' + L('挑戰', 'Challenge')]].map(([k, t]) => `<button data-lv="${k}" aria-pressed="${k === lv}">${t}</button>`).join('')}</div>
      <label class="small">${L('排序', 'Order')} <select id="sort"><option value="level">${L('學習順序（由易到難）', 'Easy → hard')}</option><option value="need">${L('最需要加強', 'Needs most work')}</option><option value="az">A–Z</option><option value="pdf">${L('PDF 頁序', 'PDF order')}</option><option value="rand">${L('隨機', 'Random')}</option></select></label></div>
    <div id="lp" class="small" style="margin-bottom:.6rem"></div>
    <div class="row" style="margin-bottom:.8rem"><a class="btn" href="#/flash/${u.id}">🃏 ${L('單字卡模式', 'Flashcards')}</a><a class="btn ghost" href="#/map/${u.id}">🕸️ ${L('單字關聯圖', 'Word network')}</a></div>
    <div class="grid" id="cards"></div>`;
  stepper(box.querySelector('#cstep'), u.id);
  if (CALCS[u.id]) CALCS[u.id](box.querySelector('#calc'));
  box.querySelectorAll('[data-lv]').forEach((b) => b.onclick = () => { lv = +b.dataset.lv; box.querySelectorAll('[data-lv]').forEach((x) => x.setAttribute('aria-pressed', x === b)); draw(); });
  box.querySelector('#sort').onchange = (e) => { sort = e.target.value; draw(); };
  draw();
  if (viewed() >= Math.ceil(all.length * 0.8)) P.markStage(u.id, 'learn');
}

// 第三階段：演練與應用
function practice(box, u) {
  const prog = P.unitProgress(u.id);
  const weak = D.unitTerms(u.id).filter((t) => status(P.item(t.id)) === 'weak');
  box.innerHTML = `<p>${L('選一種練習模式。本單元已練習', 'Pick a mode. Answers in this unit')}：<b>${prog.practiced || 0}</b> ${L('題（達', '(complete at')} ${Math.min(u.terms.length, 15)} ${L('題完成本階段）', ')')}</p>
    ${weak.length ? `<div class="fix-box"><b>▲ ${L('待加強', 'Needs work')}：</b>${weak.map((t) => `<a href="#/word/${t.id}" lang="en">${esc(t.src.en)}</a>`).join('、')}</div>` : ''}
    <div class="grid tight" style="margin-top:.8rem">${MODES.map(([k, i, zh, en]) => `<a class="card" href="${k === 'flash' ? '#/flash/' + u.id : k === 'wrong' ? '#/practice/wrong/mix' : `#/practice/${u.id}/${k}`}" style="text-align:center;text-decoration:none;color:inherit"><div style="font-size:1.8rem">${i}</div><b>${L(zh, en)}</b></a>`).join('')}
    <a class="card" href="#/practice/${u.id}/mix" style="text-align:center;text-decoration:none;color:inherit"><div style="font-size:1.8rem">🎲</div><b>${L('綜合隨機', 'Mixed')}</b></a></div>`;
}

// 第四階段：測驗與補救
async function test(box, u) {
  const prog = P.unitProgress(u.id);
  const qs = (await db.all('quizzes')).filter((q) => q.unit === u.id).sort((a, b) => b.ts - a.ts);
  const wb = (await db.all('wrongbook')).filter((w) => !w.resolved && D.term(w.id)?.unit === u.id);
  box.innerHTML = `<div class="grid two">
    <div class="card"><h2 style="margin-top:0">📘 ${L('單元形成性測驗', 'Unit formative quiz')}</h2><p>${L('10 題、多種題型，通過及格標準即完成本階段。', '10 mixed questions; pass to complete this stage.')}</p><button class="btn" data-q="unit">${L('開始測驗', 'Start')}</button></div>
    <div class="card"><h2 style="margin-top:0">🎯 ${L('學習後測驗', 'Post-test')}</h2><p>${L('與學前診斷比較進步幅度。', 'Compare with your pre-test.')}${prog.pre != null ? `（${L('學前', 'Pre')} ${prog.pre}${prog.post != null ? ` → ${L('學後', 'Post')} ${prog.post}` : ''}）` : ''}</p><button class="btn teal" data-q="post">${L('開始後測', 'Start')}</button></div>
    <div class="card"><h2 style="margin-top:0">🩹 ${L('補救學習', 'Remediation')}</h2>
      ${wb.length ? `<p>${L('本單元錯題本中還有', 'Unresolved in this unit')} <b>${wb.length}</b> ${L('個單字：', 'words:')}</p><p>${wb.map((w) => `<a href="#/word/${w.id}" lang="en">${esc(D.term(w.id).src.en)}</a>`).join('、')}</p>
        <div class="row"><button class="btn orange" data-remedy>${L('補救練習', 'Remedial practice')}</button><button class="btn pink" data-retest>${L('錯題再測', 'Retest')}</button></div>` : `<p>${L('本單元沒有未訂正的錯題 👍', 'No unresolved mistakes 👍')}</p>`}</div>
  </div>
  <h2>${L('本單元測驗紀錄', 'Quiz history')}</h2>
  ${qs.length ? `<div class="card table-wrap"><table><tr><th>${L('時間', 'Time')}</th><th>${L('類型', 'Type')}</th><th>${L('分數', 'Score')}</th></tr>${qs.map((q) => `<tr><td class="small">${fmtDate(q.ts)}</td><td>${esc(q.title)}</td><td>${q.score} ${q.passed ? '✅' : '⚠️'}</td></tr>`).join('')}</table></div>` : `<p class="muted">${L('尚無紀錄', 'None yet')}</p>`}`;
  box.querySelectorAll('[data-q]').forEach((b) => b.onclick = () => startQuiz(box, { type: b.dataset.q, unit: u.id }));
  box.querySelector('[data-remedy]')?.addEventListener('click', () => { sessionStorage.setItem('chemapp.ids', JSON.stringify(wb.map((w) => w.id))); go('#/practice/ids/mix'); });
  box.querySelector('[data-retest]')?.addEventListener('click', () => startQuiz(box, { type: 'retest', ids: wb.map((w) => w.id), unit: u.id }));
}

// 第五階段：成果與反思
async function reflect(box, u) {
  const st = unitStats(u);
  const prog = P.unitProgress(u.id);
  const goal = await db.get('goals', u.id);
  const refl = (await db.all('reflections')).filter((r) => r.unit === u.id).sort((a, b) => b.ts - a.ts);
  const qs = (await db.all('quizzes')).filter((q) => q.unit === u.id);
  const bestScore = qs.length ? Math.max(...qs.map((q) => q.score)) : null;
  const goalRate = goal ? Math.round(((bestScore != null ? Math.min(1, bestScore / (goal.target || 100)) : 0) * 0.5 + Math.min(1, st.mastered / (goal.words || 1)) * 0.5) * 100) : null;
  box.innerHTML = `<div class="kpis">
    <div class="card stat"><b>${st.learned}/${st.total}</b><span>${L('已學習', 'Studied')}</span></div>
    <div class="card stat"><b>${st.mastered}</b><span>${L('已精熟', 'Mastered')}</span></div>
    <div class="card stat"><b>${st.weak}</b><span>${L('待加強', 'Needs work')}</span></div>
    <div class="card stat"><b>${bestScore ?? '—'}</b><span>${L('最佳測驗分數', 'Best score')}</span></div>
    <div class="card stat"><b>${prog.pre ?? '—'} → ${prog.post ?? '—'}</b><span>${L('前測 → 後測', 'Pre → post')}</span></div>
    <div class="card stat"><b>${goalRate != null ? goalRate + '%' : '—'}</b><span>${L('目標達成率', 'Goal achievement')}</span></div>
  </div>
  <form class="card" id="rf" style="margin-top:.9rem"><h2 style="margin-top:0">🌱 ${L('學習反思', 'Reflection')}</h2>
    <label class="field" for="r1">✅ ${L('我已經學會了…', 'I have learned…')}</label><textarea id="r1" name="learned" required></textarea>
    <label class="field" for="r2">❓ ${L('我還不太理解…', 'I still don\'t understand…')}</label><textarea id="r2" name="unclear"></textarea>
    <label class="field" for="r3">➡️ ${L('我的下一步目標…', 'My next step…')}</label><textarea id="r3" name="next"></textarea>
    <div class="row" style="margin-top:.6rem"><button class="btn teal">${L('儲存反思', 'Save reflection')}</button><button class="btn soft" type="button" data-exp>⬇️ ${L('匯出本單元成果', 'Export unit report')}</button></div></form>
  ${refl.length ? `<h2>${L('我的反思紀錄', 'My reflections')}</h2>${refl.map((r) => `<div class="card"><p class="small muted">${fmtDate(r.ts)}</p><p>✅ ${esc(r.learned)}</p>${r.unclear ? `<p>❓ ${esc(r.unclear)}</p>` : ''}${r.next ? `<p>➡️ ${esc(r.next)}</p>` : ''}</div>`).join('')}` : ''}`;
  box.querySelector('#rf').onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await db.add('reflections', { ts: Date.now(), unit: u.id, learned: fd.get('learned'), unclear: fd.get('unclear'), next: fd.get('next') });
    await P.markStage(u.id, 'reflect');
    await P.checkBadges();
    toast(L('已儲存反思', 'Reflection saved'));
    go(`#/unit/${u.id}/reflect`, true);
  };
  box.querySelector('[data-exp]').onclick = () => {
    const rows = [['單元', unitTitle(u)], ['匯出時間', fmtDate(Date.now())], ['已學習', `${st.learned}/${st.total}`], ['已精熟', st.mastered], ['學前', prog.pre ?? ''], ['學後', prog.post ?? ''], [],
      ['英文', '中文', '難度', '狀態', '熟練度', '觀看', '聆聽', '作答', '答對', '下次複習', '來源頁碼']];
    for (const t of D.unitTerms(u.id)) {
      const it = P.item(t.id) || {};
      rows.push([t.src.en, t.src.zh, t.level, status(P.item(t.id)), masteryScore(P.item(t.id)), it.views || 0, it.listens || 0, (it.correct || 0) + (it.wrong || 0), it.correct || 0, it.due || '', t.src.page]);
    }
    download(`單元成果_${u.title}.csv`, '﻿' + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n'), 'text/csv');
  };
}
export { lvChip };
