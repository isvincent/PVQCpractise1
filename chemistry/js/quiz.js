// 練習與測驗：八種測驗、隨機題目與選項、計時、中途恢復、成效分析、成績匯出
import * as D from './data.js';
import * as P from './progress.js';
import * as db from './store.js';
import { build, qtypeLabel, QTYPES } from './questions.js';
import { run, reviewList } from './runner.js';
import { S, set as setSetting } from './settings.js';
import { esc, L, pct, fmtTime, fmtDate, download, confetti, dialog, toast, shuffle } from './ui.js';
import { sfx } from './sound.js';
import { setCrumbs, go } from './app.js';
import { unitTitle } from './vocab.js';

export const QUIZ_TYPES = {
  pre: { zh: '學前診斷測驗', en: 'Pre-test (diagnostic)', icon: '🧭', n: 6 },
  unit: { zh: '單元形成性測驗', en: 'Unit formative quiz', icon: '📘', n: 10 },
  chapter: { zh: '章節總結測驗', en: 'Chapter summary test', icon: '📗', n: 15 },
  challenge: { zh: '綜合挑戰測驗', en: 'Comprehensive challenge', icon: '🏆', n: 20 },
  custom: { zh: '自訂題數及難度', en: 'Custom quiz', icon: '🛠️', n: 10 },
  timed: { zh: '限時測驗', en: 'Timed quiz', icon: '⏱️', n: 40 },
  retest: { zh: '錯題重測', en: 'Wrong-answer retest', icon: '♻️', n: 10 },
  post: { zh: '學習後測驗', en: 'Post-test', icon: '🎯', n: 10 },
};
export const quizLabel = (k) => L(QUIZ_TYPES[k].zh, QUIZ_TYPES[k].en);
const ALL_Q = ['en2zh', 'zh2en', 'listen', 'image', 'def', 'cloze', 'tf'];

/** 依設定挑選題目來源單字 */
async function poolFor(cfg) {
  let terms;
  if (cfg.ids) terms = cfg.ids.map((id) => D.term(id)).filter(Boolean);
  else if (cfg.type === 'retest') {
    const wb = (await db.all('wrongbook')).filter((w) => !w.resolved).sort((a, b) => b.count - a.count);
    terms = wb.map((w) => D.term(w.id)).filter(Boolean);
  } else if (cfg.chapter) terms = D.chapters.find((c) => c.id === cfg.chapter).units.flatMap((u) => D.unitTerms(u));
  else if (cfg.units?.length) terms = cfg.units.flatMap((u) => D.unitTerms(u));
  else if (cfg.unit) terms = D.unitTerms(cfg.unit);
  else terms = D.allTerms();
  if (cfg.levels?.length) terms = terms.filter((t) => cfg.levels.includes(t.level));
  if (cfg.type === 'pre') terms = shuffle(terms.filter((t) => t.level <= 2));
  if (cfg.type === 'challenge') terms = shuffle(terms).sort((a, b) => b.level - a.level).slice(0, Math.max(cfg.count * 2, 30));
  return terms;
}

export async function startQuiz(v, cfg) {
  const terms = await poolFor(cfg);
  if (!terms.length) {
    v.innerHTML = `<div class="card"><p>${cfg.type === 'retest' ? L('錯題本目前是空的，太棒了！', 'Your wrong-answer book is empty!') : L('這個範圍沒有符合條件的題目。', 'No questions match.')}</p><a class="btn" href="#/quiz">${L('回測驗中心', 'Back')}</a></div>`;
    return;
  }
  const types = cfg.qtypes?.length ? cfg.qtypes : cfg.type === 'pre' ? ['en2zh', 'zh2en', 'tf'] : cfg.type === 'challenge' ? [...ALL_Q, 'spell'] : ALL_Q;
  const qs = build(terms, types, Math.min(cfg.count || QUIZ_TYPES[cfg.type].n, terms.length));
  const state = { cfg, qs, results: [], startTs: Date.now(), deadline: cfg.timeLimit ? Date.now() + cfg.timeLimit * 1000 : 0 };
  await db.setMeta('quizInProgress', state);
  play(v, state);
}

export async function resumeQuiz(v) {
  const st = await db.getMeta('quizInProgress');
  if (!st) return go('#/quiz');
  if (st.deadline) st.deadline = Date.now() + Math.max(10000, st.remaining || 30000); // 限時測驗恢復剩餘時間（至少 10 秒）
  play(v, st);
}

function play(v, st) {
  const { cfg, qs } = st;
  const title = cfg.title || quizLabel(cfg.type);
  v.innerHTML = `<h1>${QUIZ_TYPES[cfg.type].icon} ${esc(title)}</h1><div id="qroot"></div>
    <p class="small muted">${L('測驗中途離開會自動保存進度，回到「測驗中心」可繼續。數字鍵 1–4 選答，Enter 下一題。', 'Progress is saved automatically; you can resume from the quiz centre. Keys 1–4 answer.')}</p>`;
  run(v.querySelector('#qroot'), qs, {
    mode: 'quiz', ctxMode: 'quiz-' + cfg.type, start: st.results.length, results: st.results, deadline: st.deadline || 0,
    header: cfg.unit ? unitTitle(D.unit(cfg.unit)) : '',
    onProgress: async (i, results) => {
      st.results = results;
      if (st.deadline) st.remaining = st.deadline - Date.now();
      await db.setMeta('quizInProgress', st);
    },
    onDone: (results) => finish(v, st, results),
  });
}

/** 依學習目標（單元）與題型分類的成效分析 */
export function analyse(results) {
  const by = (key) => {
    const m = {};
    for (const r of results) { const k = r[key]; (m[k] ||= { n: 0, ok: 0, ms: 0 }); m[k].n++; m[k].ok += r.ok ? 1 : 0; m[k].ms += r.ms || 0; }
    return m;
  };
  return { byUnit: by('unit'), byType: by('type') };
}

async function finish(v, st, results) {
  await db.setMeta('quizInProgress', null);
  const { cfg, qs } = st;
  const answered = results.length;
  const total = cfg.type === 'timed' ? answered : qs.length;
  const correct = results.filter((r) => r.ok).length;
  const score = pct(correct, total || 1);
  const durationMs = Date.now() - st.startTs;
  const passed = score >= S.passScore;
  const rec = { ts: Date.now(), type: cfg.type, unit: cfg.unit || null, chapter: cfg.chapter || null, title: cfg.title || quizLabel(cfg.type),
    total, answered, correct, score, durationMs, passed, mastery: score >= S.masteryScore, passScore: S.passScore, masteryScore: S.masteryScore,
    items: results.map((r) => ({ id: r.id, type: r.type, unit: r.unit, ok: r.ok, ms: r.ms })) };
  await db.add('quizzes', rec);
  if (passed) await P.bump('quizPass');
  // 單元階段
  if (cfg.unit) {
    if (cfg.type === 'pre') await P.markStage(cfg.unit, 'explore', { pre: score });
    if ((cfg.type === 'unit' || cfg.type === 'post') && passed) await P.markStage(cfg.unit, 'test', cfg.type === 'post' ? { post: score } : { lastTest: score });
    else if (cfg.type === 'post') await P.saveUnitExtra(cfg.unit, { post: score });
  }
  await P.checkBadges();
  sfx(passed ? 'win' : 'ok');
  if (score >= S.masteryScore) confetti();
  const { byUnit, byType } = analyse(results);
  const wrongIds = [...new Set(results.filter((r) => !r.ok).map((r) => r.id))];
  const avg = answered ? Math.round(results.reduce((a, r) => a + (r.ms || 0), 0) / answered / 100) / 10 : 0;
  v.innerHTML = `<h1>${QUIZ_TYPES[cfg.type].icon} ${L('測驗結果', 'Results')}：${esc(rec.title)}</h1>
  <div class="kpis">
    <div class="card stat"><b>${score}</b><span>${L('分數', 'Score')}</span></div>
    <div class="card stat"><b>${correct}/${total}</b><span>${L('答對題數', 'Correct')}</span></div>
    <div class="card stat"><b>${fmtTime(durationMs)}</b><span>${L('完成時間', 'Time')}（${L('平均', 'avg')} ${avg}s/${L('題', 'q')}）</span></div>
    <div class="card stat"><b>${score >= S.masteryScore ? '🌟 ' + L('精熟', 'Mastery') : passed ? '✅ ' + L('及格', 'Pass') : '⚠️ ' + L('未及格', 'Not yet')}</b><span>${L('及格', 'Pass')} ${S.passScore}・${L('精熟', 'Mastery')} ${S.masteryScore}</span></div>
  </div>
  ${cfg.type === 'post' && cfg.unit && P.unitProgress(cfg.unit).pre != null ? `<div class="card" style="margin-top:.9rem">📈 ${L('前後測比較', 'Pre vs post')}：${L('學前', 'Pre')} ${P.unitProgress(cfg.unit).pre} → ${L('學後', 'Post')} ${score}（${score - P.unitProgress(cfg.unit).pre >= 0 ? '+' : ''}${score - P.unitProgress(cfg.unit).pre}）</div>` : ''}
  <h2>${L('依學習目標（單元）分析', 'By learning objective (unit)')}</h2>
  <div class="card table-wrap"><table><thead><tr><th>${L('單元', 'Unit')}</th><th>${L('題數', 'Qs')}</th><th>${L('正確率', 'Accuracy')}</th><th>${L('平均時間', 'Avg time')}</th><th>${L('判定', 'Verdict')}</th></tr></thead><tbody>
  ${Object.entries(byUnit).map(([u, s]) => { const a = pct(s.ok, s.n); return `<tr><td>${esc(unitTitle(D.unit(u)))}</td><td>${s.n}</td><td>${a}%</td><td>${Math.round(s.ms / s.n / 100) / 10}s</td><td>${a >= S.masteryScore ? '🌟 ' + L('精熟', 'Mastered') : a >= S.passScore ? '✅ ' + L('達標', 'OK') : '▲ ' + L('概念弱點', 'Weak')}</td></tr>`; }).join('')}
  </tbody></table></div>
  <h2>${L('依題型分析', 'By question type')}</h2>
  <div class="row">${Object.entries(byType).map(([k, s]) => `<span class="chip">${qtypeLabel(k)} ${pct(s.ok, s.n)}%</span>`).join('')}</div>
  <h2>${L('標準答案與解說', 'Answers & explanations')}</h2>
  ${reviewList(results, qs)}
  <div class="row" style="margin-top:1rem">
    ${wrongIds.length ? `<button class="btn orange" data-remedy>🩹 ${L('補救練習（錯的 ' + wrongIds.length + ' 題）', 'Remedial practice (' + wrongIds.length + ')')}</button>
      <button class="btn pink" data-retest>♻️ ${L('錯題再測', 'Retest wrong ones')}</button>` : ''}
    <button class="btn ghost" data-again>↺ ${L('再測一次（重新抽題）', 'New attempt')}</button>
    <button class="btn soft" data-csv>⬇️ ${L('匯出這次成績 CSV', 'Export CSV')}</button>
    ${cfg.unit ? `<a class="btn" href="#/unit/${cfg.unit}/${cfg.type === 'pre' ? 'learn' : 'reflect'}">${cfg.type === 'pre' ? L('開始學習 ➜', 'Start learning ➜') : L('寫學習反思 ➜', 'Reflect ➜')}</a>` : ''}
  </div>
  ${cfg.type === 'pre' ? `<div class="card" style="margin-top:1rem"><b>🧭 ${L('學習建議', 'Recommendation')}</b><p>${score < 50 ? L('先從「基礎」單字開始，搭配單字卡與發音，再進入練習。', 'Start with Basic words and flashcards.') : score < 80 ? L('基礎已有概念，建議集中學習「進階」單字並多做句子填空。', 'Focus on Advanced words and cloze practice.') : L('表現很好！可以直接挑戰「挑戰」級單字與限時測驗。', 'Great — go for Challenge words and timed quizzes.')}</p></div>` : ''}`;
  v.querySelector('[data-remedy]')?.addEventListener('click', () => { sessionStorage.setItem('chemapp.ids', JSON.stringify(wrongIds)); go('#/practice/ids/mix'); });
  v.querySelector('[data-retest]')?.addEventListener('click', () => startQuiz(v, { type: 'retest', ids: wrongIds, unit: cfg.unit, title: L('錯題再測', 'Retest') }));
  v.querySelector('[data-again]').onclick = () => startQuiz(v, cfg);
  v.querySelector('[data-csv]').onclick = () => download(`測驗成績_${rec.title}_${fmtDate(rec.ts).replace(/[: ]/g, '-')}.csv`, quizCsv([rec]), 'text/csv');
}

export function quizCsv(recs) {
  const rows = [['時間', '測驗', '單元', '題數', '答對', '分數', '及格', '用時(秒)', '單字', '題型', '結果', '作答秒數']];
  for (const q of recs) {
    for (const it of q.items) {
      rows.push([fmtDate(q.ts), q.title, q.unit || '', q.total, q.correct, q.score, q.passed ? 'Y' : 'N', Math.round(q.durationMs / 1000),
        D.term(it.id)?.src.en || it.id, it.type, it.ok ? '正確' : '錯誤', Math.round((it.ms || 0) / 100) / 10]);
    }
  }
  return '﻿' + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
}

// ---------- 測驗中心 ----------
export async function quizHub(v, type, arg) {
  if (type === 'resume') { setCrumbs([[L('測驗中心', 'Quizzes'), '#/quiz'], [L('繼續作答', 'Resume')]]); return resumeQuiz(v); }
  if (type) {
    setCrumbs([[L('測驗中心', 'Quizzes'), '#/quiz'], [quizLabel(type)]]);
    if (['pre', 'unit', 'post'].includes(type) && arg) return startQuiz(v, { type, unit: arg });
    if (type === 'chapter' && arg) return startQuiz(v, { type, chapter: arg });
    if (type === 'challenge' || type === 'retest') return startQuiz(v, { type });
  }
  setCrumbs([[L('測驗中心', 'Quizzes')]]);
  const ip = await db.getMeta('quizInProgress');
  const hist = (await db.all('quizzes')).sort((a, b) => b.ts - a.ts);
  const unitOpts = D.units.map((u) => `<option value="${u.id}">${esc(unitTitle(u))}</option>`).join('');
  v.innerHTML = `<h1>📝 ${L('測驗中心', 'Quiz centre')}</h1>
  ${ip ? `<div class="card fix-box"><b>⏸ ${L('有未完成的測驗', 'Unfinished quiz')}</b>：${esc(ip.cfg.title || quizLabel(ip.cfg.type))}（${ip.results.length}/${ip.qs.length}）
    <div class="row" style="margin-top:.4rem"><a class="btn" href="#/quiz/resume">${L('繼續作答', 'Resume')}</a><button class="btn ghost" data-discard>${L('放棄這次', 'Discard')}</button></div></div>` : ''}
  <div class="card"><b>⚙️ ${L('評量標準', 'Thresholds')}</b>
    <div class="row"><label>${L('及格標準', 'Pass score')} <input type="number" id="pass" min="0" max="100" value="${S.passScore}" style="width:90px"></label>
    <label>${L('精熟門檻', 'Mastery score')} <input type="number" id="mast" min="0" max="100" value="${S.masteryScore}" style="width:90px"></label>
    <button class="btn small" data-save-th>${L('儲存', 'Save')}</button></div></div>
  <div class="grid" style="margin-top:.9rem">
    ${['pre', 'unit', 'post'].map((k) => `<form class="card" data-q="${k}"><h3 style="margin-top:0">${QUIZ_TYPES[k].icon} ${quizLabel(k)}</h3>
      <label class="field" for="u-${k}">${L('單元', 'Unit')}</label><select id="u-${k}" name="unit">${unitOpts}</select>
      <p class="small muted">${QUIZ_TYPES[k].n} ${L('題', 'questions')}</p><button class="btn">${L('開始', 'Start')}</button></form>`).join('')}
    <form class="card" data-q="chapter"><h3 style="margin-top:0">📗 ${quizLabel('chapter')}</h3>
      <label class="field" for="c-sel">${L('章節', 'Chapter')}</label><select id="c-sel" name="chapter">${D.chapters.map((c, i) => `<option value="${c.id}">${i + 1}. ${esc(L(c.title, c.title_en))}</option>`).join('')}</select>
      <p class="small muted">15 ${L('題', 'questions')}</p><button class="btn">${L('開始', 'Start')}</button></form>
    <form class="card" data-q="challenge"><h3 style="margin-top:0">🏆 ${quizLabel('challenge')}</h3><p class="small">${L('全冊 20 題，偏重進階與挑戰級，含拼字題。', '20 questions from all units, harder words, includes spelling.')}</p><button class="btn">${L('開始', 'Start')}</button></form>
    <form class="card" data-q="timed"><h3 style="margin-top:0">⏱️ ${quizLabel('timed')}</h3>
      <label class="field" for="t-sec">${L('時間', 'Time')}</label><select id="t-sec" name="sec"><option value="60">60 ${L('秒', 's')}</option><option value="120" selected>120 ${L('秒', 's')}</option><option value="180">180 ${L('秒', 's')}</option></select>
      <label class="field" for="t-u">${L('範圍', 'Scope')}</label><select id="t-u" name="unit"><option value="">${L('全部單元', 'All units')}</option>${unitOpts}</select>
      <p class="small muted">${L('時間內答越多越好，分數以已作答題數計算', 'Answer as many as you can')}</p><button class="btn">${L('開始', 'Start')}</button></form>
    <form class="card" data-q="retest"><h3 style="margin-top:0">♻️ ${quizLabel('retest')}</h3><p class="small">${L('從錯題本中尚未訂正的題目抽題。', 'Draws from unresolved wrong answers.')}</p><button class="btn">${L('開始', 'Start')}</button></form>
    <form class="card" data-q="custom"><h3 style="margin-top:0">🛠️ ${quizLabel('custom')}</h3>
      <label class="field" for="cu-n">${L('題數', 'Questions')}</label><input id="cu-n" name="n" type="number" min="5" max="50" value="15">
      <fieldset style="border:0;padding:0;margin:.5rem 0"><legend class="field">${L('難度', 'Level')}</legend>
        ${[1, 2, 3].map((l) => `<label><input type="checkbox" name="lv" value="${l}" checked> ${[, L('基礎', 'Basic'), L('進階', 'Advanced'), L('挑戰', 'Challenge')][l]}</label> `).join('')}</fieldset>
      <fieldset style="border:0;padding:0;margin:.5rem 0"><legend class="field">${L('題型', 'Types')}</legend>
        ${[...ALL_Q, 'spell'].map((k) => `<label style="display:inline-block;margin-right:.5rem"><input type="checkbox" name="qt" value="${k}" ${k !== 'spell' ? 'checked' : ''}> ${qtypeLabel(k)}</label>`).join('')}</fieldset>
      <label class="field" for="cu-u">${L('單元（可多選，不選＝全部）', 'Units (none = all)')}</label><select id="cu-u" name="units" multiple size="5" style="width:100%">${unitOpts}</select>
      <button class="btn" style="margin-top:.6rem">${L('開始', 'Start')}</button></form>
  </div>
  <h2>${L('測驗紀錄', 'History')}</h2>
  ${hist.length ? `<div class="card table-wrap"><table><thead><tr><th>${L('時間', 'Time')}</th><th>${L('測驗', 'Quiz')}</th><th>${L('分數', 'Score')}</th><th>${L('正確率', 'Accuracy')}</th><th>${L('用時', 'Time used')}</th></tr></thead><tbody>
    ${hist.slice(0, 30).map((q) => `<tr><td class="small">${fmtDate(q.ts)}</td><td>${esc(q.title)}${q.unit ? `<br><span class="small muted">${esc(unitTitle(D.unit(q.unit)))}</span>` : ''}</td><td><b>${q.score}</b> ${q.passed ? '✅' : '⚠️'}</td><td>${q.correct}/${q.total}</td><td>${fmtTime(q.durationMs)}</td></tr>`).join('')}
  </tbody></table></div><button class="btn soft" style="margin-top:.6rem" data-allcsv>⬇️ ${L('匯出全部測驗紀錄 CSV', 'Export all (CSV)')}</button>` : `<p class="muted">${L('還沒有測驗紀錄。', 'No quizzes yet.')}</p>`}`;
  v.querySelector('[data-discard]')?.addEventListener('click', async () => { await db.setMeta('quizInProgress', null); quizHub(v); });
  v.querySelector('[data-save-th]').onclick = () => {
    const p = Math.max(0, Math.min(100, +v.querySelector('#pass').value)), m = Math.max(0, Math.min(100, +v.querySelector('#mast').value));
    if (m < p) return toast(L('精熟門檻不能低於及格標準', 'Mastery must be ≥ pass'));
    setSetting('passScore', p); setSetting('masteryScore', m); toast(L('已儲存評量標準', 'Saved'));
  };
  v.querySelector('[data-allcsv]')?.addEventListener('click', () => download('全部測驗紀錄.csv', quizCsv(hist), 'text/csv'));
  v.querySelectorAll('form[data-q]').forEach((f) => f.onsubmit = async (e) => {
    e.preventDefault();
    if (ip && !(await dialog(L('覆蓋未完成的測驗？', 'Replace unfinished quiz?'), `<p>${L('開始新測驗會放棄目前未完成的測驗進度。', 'Starting a new quiz discards the unfinished one.')}</p>`,
      [{ label: L('取消', 'Cancel'), value: false, cls: 'ghost' }, { label: L('開始新測驗', 'Start new'), value: true }]))) return;
    const k = f.dataset.q;
    const fd = new FormData(f);
    const cfg = { type: k };
    if (fd.get('unit')) cfg.unit = fd.get('unit');
    if (k === 'chapter') cfg.chapter = fd.get('chapter');
    if (k === 'timed') { cfg.timeLimit = +fd.get('sec'); cfg.count = 60; }
    if (k === 'custom') {
      cfg.count = Math.max(5, Math.min(50, +fd.get('n') || 10));
      cfg.levels = fd.getAll('lv').map(Number);
      cfg.qtypes = fd.getAll('qt');
      cfg.units = [...f.querySelector('[name=units]').selectedOptions].map((o) => o.value);
      if (!cfg.levels.length || !cfg.qtypes.length) return toast(L('請至少選一個難度與題型', 'Pick at least one level and type'));
    }
    setCrumbs([[L('測驗中心', 'Quizzes'), '#/quiz'], [quizLabel(k)]]);
    startQuiz(v, cfg);
  });
}

export { QTYPES };
