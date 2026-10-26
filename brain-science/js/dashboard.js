// 儀表板與圖表、今日複習與錯題本、演算法說明
import * as D from './data.js';
import * as P from './progress.js';
import * as db from './store.js';
import { status, statusLabel, masteryScore, dueList, priority, recentAcc, STATUS } from './review.js';
import { esc, L, pct, fmtTime, fmtDate, today, addDays } from './ui.js';
import { setCrumbs } from './app.js';
import { unitTitle, unitStats } from './vocab.js';
import { quizLabel } from './quiz.js';
import { qtypeLabel } from './questions.js';
import { S } from './settings.js';

const COLORS = { new: '#94a3b8', learning: '#14b8a6', weak: '#e11d48', mastered: '#16a34a' };

function donut(counts) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  let a0 = -Math.PI / 2, paths = '';
  for (const [k, n] of Object.entries(counts)) {
    if (!n) continue;
    const a1 = a0 + (n / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const p = (a) => `${80 + Math.cos(a) * 70},${80 + Math.sin(a) * 70}`;
    paths += n === total ? `<circle cx="80" cy="80" r="70" fill="${COLORS[k]}"/>` : `<path d="M80,80 L${p(a0)} A70,70 0 ${large} 1 ${p(a1)} Z" fill="${COLORS[k]}"><title>${STATUS[k].zh} ${n}</title></path>`;
    a0 = a1;
  }
  return `<svg viewBox="0 0 160 160" role="img" aria-label="${L('熟練狀態分布', 'Mastery distribution')}" style="max-width:180px">${paths}<circle cx="80" cy="80" r="40" fill="var(--card)"/><text x="80" y="86" text-anchor="middle" font-size="18" font-weight="800" style="fill:var(--ink)">${total}</text></svg>`;
}

function bars(data, { h = 160, fmt = (x) => x, color = '#5146e5', label = '' } = {}) {
  const W = 600, pad = 28, max = Math.max(1, ...data.map((d) => d.v));
  const bw = (W - pad * 2) / data.length;
  return `<svg viewBox="0 0 ${W} ${h + 30}" role="img" aria-label="${esc(label)}">${data.map((d, i) => {
    const bh = (d.v / max) * h;
    return `<rect x="${pad + i * bw + 3}" y="${h - bh + 5}" width="${bw - 6}" height="${bh}" rx="4" fill="${color}"><title>${esc(d.k)}：${esc(fmt(d.v))}</title></rect>
      ${data.length <= 8 || i % 2 === (data.length - 1) % 2 ? `<text x="${pad + i * bw + bw / 2}" y="${h + 24}" text-anchor="middle">${esc(d.k)}</text>` : ''}${d.v ? `<text x="${pad + i * bw + bw / 2}" y="${Math.max(18, h - bh)}" text-anchor="middle">${d.v}</text>` : ''}`;
  }).join('')}</svg>`;
}

function line(points, { label = '', h = 160 } = {}) {
  const W = 600, pad = 30;
  if (!points.length) return `<p class="muted small">${L('尚無資料', 'No data yet')}</p>`;
  const x = (i) => pad + (points.length === 1 ? (W - 2 * pad) / 2 : (i / (points.length - 1)) * (W - 2 * pad));
  const y = (v) => 10 + (1 - v / 100) * h;
  const pass = y(S.passScore);
  return `<svg viewBox="0 0 ${W} ${h + 34}" role="img" aria-label="${esc(label)}">
    <line x1="${pad}" x2="${W - pad}" y1="${pass}" y2="${pass}" stroke="#ea580c" stroke-dasharray="6 4"/><text x="${W - pad}" y="${pass - 4}" text-anchor="end">${L('及格', 'pass')} ${S.passScore}</text>
    <polyline fill="none" stroke="#5146e5" stroke-width="3" points="${points.map((p, i) => `${x(i)},${y(p.v)}`).join(' ')}"/>
    ${points.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.v)}" r="5" fill="${p.v >= S.passScore ? '#16a34a' : '#e11d48'}"><title>${esc(p.k)}：${p.v}</title></circle>`).join('')}
    <text x="${pad}" y="${h + 30}">${esc(points[0].k)}</text><text x="${W - pad}" y="${h + 30}" text-anchor="end">${esc(points[points.length - 1].k)}</text></svg>`;
}

function heatmap(daily) {
  const map = new Map(daily.map((d) => [d.date, d.ms]));
  const start = new Date(); start.setDate(start.getDate() - 7 * 16 - start.getDay() + 1);
  let cells = '';
  for (let i = 0; i < 7 * 17; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    if (d > new Date()) break;
    const k = today(d), m = (map.get(k) || 0) / 60000;
    const l = m === 0 ? 0 : m < 5 ? 1 : m < 15 ? 2 : m < 30 ? 3 : 4;
    cells += `<i data-l="${l}" title="${k}：${Math.round(m)} ${L('分鐘', 'min')}"></i>`;
  }
  return `<div class="heat" role="img" aria-label="${L('最近 16 週學習日曆熱力圖', 'Study heatmap, last 16 weeks')}">${cells}</div>
    <div class="legend small"><span>${L('少', 'Less')}</span>${[0, 1, 2, 3, 4].map((l) => `<span><i style="background:${['var(--line)', '#a7f3d0', '#34d399', '#059669', '#065f46'][l]}"></i>${['0', '<5', '<15', '<30', '30+'][l]}${l ? L('分', 'm') : ''}</span>`).join('')}</div>`;
}

export async function dashboard(v) {
  setCrumbs([[L('學習儀表板', 'Dashboard')]]);
  const terms = D.allTerms();
  const s = await P.summary(terms.length);
  const counts = { new: 0, learning: 0, weak: 0, mastered: 0 };
  terms.forEach((t) => counts[status(P.item(t.id))]++);
  const daily = (await db.all('daily')).sort((a, b) => a.date.localeCompare(b.date));
  const totalMs = daily.reduce((a, d) => a + d.ms, 0);
  const todayMs = daily.find((d) => d.date === today())?.ms || 0;
  const quizzes = (await db.all('quizzes')).sort((a, b) => a.ts - b.ts);
  const events = (await db.all('events')).sort((a, b) => b.ts - a.ts);
  const goals = await db.all('goals');
  const refl = (await db.all('reflections')).sort((a, b) => b.ts - a.ts);
  const due = dueList([...P.items.values()]);
  const wb = (await db.all('wrongbook')).sort((a, b) => b.count - a.count);
  // 題型弱點
  const byType = {};
  events.filter((e) => e.type === 'answer' && e.qtype).forEach((e) => { (byType[e.qtype] ||= { n: 0, ok: 0 }); byType[e.qtype].n++; byType[e.qtype].ok += e.ok ? 1 : 0; });
  const last14 = Array.from({ length: 14 }, (_, i) => { const d = addDays(today(), i - 13); return { k: d.slice(5), v: Math.round((daily.find((x) => x.date === d)?.ms || 0) / 60000) }; });
  // 學習成長趨勢：每天累計已精熟數無法回推，改用每日答對率
  const byDay = {};
  events.filter((e) => e.type === 'answer').forEach((e) => { const d = today(new Date(e.ts)); (byDay[d] ||= { n: 0, ok: 0 }); byDay[d].n++; byDay[d].ok += e.ok ? 1 : 0; });
  const trend = Object.keys(byDay).sort().slice(-20).map((d) => ({ k: d.slice(5), v: pct(byDay[d].ok, byDay[d].n) }));
  const goalRates = goals.map((g) => {
    const u = D.unit(g.unit); if (!u) return null;
    const st = unitStats(u);
    const best = Math.max(0, ...quizzes.filter((q) => q.unit === g.unit).map((q) => q.score));
    return { u, rate: Math.round((Math.min(1, best / (g.target || 100)) * 0.5 + Math.min(1, st.mastered / (g.words || 1)) * 0.5) * 100), g };
  }).filter(Boolean);
  const evLabel = (e) => ({ view: L('看了單字', 'Viewed'), listen: L('聽了發音', 'Listened'), answer: e.ok ? L('答對', 'Correct') : L('答錯', 'Wrong'), mark: L('標記', 'Marked'), game: L('完成遊戲', 'Game'), goal: L('設定目標', 'Set goal') }[e.type] || e.type);

  v.innerHTML = `<h1>📊 ${L('學習儀表板', 'Learning dashboard')}</h1>
  <div class="kpis">
    <div class="card stat"><b>${pct(s.learned, s.total)}%</b><span>${L('教材總進度', 'Overall progress')}</span><div class="progress"><i style="width:${pct(s.learned, s.total)}%"></i></div></div>
    <div class="card stat"><b>${s.learned}</b><span>${L('已學習單字', 'Words studied')}</span></div>
    <div class="card stat"><b>${counts.mastered}</b><span>${L('已精熟', 'Mastered')}</span></div>
    <div class="card stat"><b>${counts.weak}</b><span>${L('待加強', 'Needs work')}</span></div>
    <div class="card stat"><b>${fmtTime(todayMs)}</b><span>${L('今日學習', 'Today')}</span></div>
    <div class="card stat"><b>${fmtTime(totalMs)}</b><span>${L('累積學習', 'Total time')}</span></div>
    <div class="card stat"><b>🔥 ${s.streak}</b><span>${L('連續學習天數', 'Day streak')}</span></div>
    <div class="card stat"><b>Lv.${P.levelOf(P.meta.xp)}</b><span>${P.meta.xp} XP・${L('下一級', 'next')} ${P.xpForLevel(P.levelOf(P.meta.xp) + 1)}</span></div>
  </div>
  <div class="grid two" style="margin-top:.9rem">
    <div class="card chart"><h2 style="margin-top:0">${L('熟練狀態分布', 'Mastery status')}</h2><div class="row">${donut(counts)}
      <div class="legend" style="flex-direction:column">${Object.keys(counts).map((k) => `<span><i style="background:${COLORS[k]}"></i>${statusLabel(k)}：${counts[k]}</span>`).join('')}</div></div></div>
    <div class="card chart"><h2 style="margin-top:0">${L('最近 14 天學習時間（分鐘）', 'Study minutes, last 14 days')}</h2>${bars(last14, { label: L('每日學習時間', 'Daily minutes'), color: '#0d9488' })}</div>
    <div class="card"><h2 style="margin-top:0">${L('學習日曆熱力圖', 'Study calendar')}</h2>${heatmap(daily)}</div>
    <div class="card chart"><h2 style="margin-top:0">${L('學習成長趨勢（每日答對率 %）', 'Growth trend (daily accuracy %)')}</h2>${line(trend, { label: L('每日答對率', 'Daily accuracy') })}</div>
  </div>
  <h2>${L('各單元完成率', 'Unit completion')}</h2>
  <div class="card table-wrap"><table><thead><tr><th>${L('單元', 'Unit')}</th><th>${L('五階段', 'Stages')}</th><th>${L('學過', 'Studied')}</th><th>${L('精熟', 'Mastered')}</th><th>${L('待加強', 'Weak')}</th></tr></thead><tbody>
    ${D.units.map((u) => { const st = unitStats(u); return `<tr><td><a href="#/unit/${u.id}">${esc(unitTitle(u))}</a></td><td style="min-width:120px"><div class="progress" aria-label="${st.completion}%"><i style="width:${st.completion}%"></i></div><span class="small">${st.stages}/5</span></td><td>${st.learned}/${st.total}</td><td>${st.mastered}</td><td>${st.weak}</td></tr>`; }).join('')}</tbody></table></div>
  <div class="grid two" style="margin-top:.9rem">
    <div class="card chart"><h2 style="margin-top:0">${L('測驗分數趨勢', 'Quiz scores')}</h2>${line(quizzes.map((q) => ({ k: fmtDate(q.ts).slice(5, 10) + ' ' + q.title, v: q.score })), { label: L('測驗分數', 'Scores') })}
      ${quizzes.length ? `<div class="table-wrap"><table><tr><th>${L('測驗', 'Quiz')}</th><th>${L('分數', 'Score')}</th><th>${L('正確率', 'Accuracy')}</th></tr>${quizzes.slice(-8).reverse().map((q) => `<tr><td class="small">${fmtDate(q.ts)} ${esc(q.title)}</td><td>${q.score}</td><td>${q.correct}/${q.total}</td></tr>`).join('')}</table></div>` : ''}</div>
    <div class="card"><h2 style="margin-top:0">${L('弱點分析', 'Weak spots')}</h2>
      <h3>${L('依題型', 'By question type')}</h3><div class="row">${Object.entries(byType).sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n).map(([k, x]) => `<span class="chip ${pct(x.ok, x.n) < S.passScore ? 'st-weak' : 'st-mastered'}">${qtypeLabel(k)} ${pct(x.ok, x.n)}%（${x.n}）</span>`).join('') || `<span class="muted small">${L('尚無資料', 'No data')}</span>`}</div>
      <h3>${L('常錯單字', 'Most-missed words')}</h3>${wb.length ? `<ol>${wb.slice(0, 10).map((w) => `<li><a href="#/word/${w.id}" lang="en">${esc(D.term(w.id)?.src.en || w.id)}</a> ✘${w.count} ${w.resolved ? `<span class="chip st-mastered">${L('已訂正', 'fixed')}</span>` : ''}</li>`).join('')}</ol>` : `<p class="muted small">${L('尚無錯題', 'None')}</p>`}</div>
    <div class="card"><h2 style="margin-top:0">🔁 ${L('待複習清單', 'Due for review')}（${due.length}）</h2>${due.length ? `<p>${due.slice(0, 15).map((it) => `<a href="#/word/${it.id}" lang="en">${esc(D.term(it.id)?.src.en)}</a>`).join('、')}</p><a class="btn teal" href="#/review">${L('開始複習', 'Review now')}</a>` : `<p class="muted">${L('今天沒有到期的複習', 'Nothing due')}</p>`}</div>
    <div class="card"><h2 style="margin-top:0">🎯 ${L('學習目標達成率', 'Goal achievement')}</h2>${goalRates.length ? goalRates.map((g) => `<p style="margin:.3rem 0">${esc(unitTitle(g.u))}：${g.rate}%（${L('目標', 'target')} ${g.g.target} ${L('分', 'pts')}、${g.g.words} ${L('字精熟', 'words')}）</p><div class="progress"><i style="width:${g.rate}%"></i></div>`).join('') : `<p class="muted small">${L('還沒設定目標，可在單元第一階段設定。', 'Set goals in stage 1 of a unit.')}</p>`}
      <p class="small muted">${L('達成率 = 50% × 最佳分數/目標分數 + 50% × 精熟數/目標字數', 'Rate = 50% best/target score + 50% mastered/target words')}</p></div>
    <div class="card"><h2 style="margin-top:0">🏅 ${L('徽章', 'Badges')}</h2><div class="grid tight">${P.BADGES.map(([id, ic, zh, en, dz, de]) => `<div style="text-align:center;opacity:${P.meta.badges[id] ? 1 : 0.35}" title="${esc(L(dz, de))}"><div style="font-size:1.8rem">${ic}</div><b class="small">${L(zh, en)}</b><div class="small muted">${P.meta.badges[id] ? '✔ ' + L('已解鎖', 'Unlocked') : L(dz, de)}</div></div>`).join('')}</div></div>
    <div class="card"><h2 style="margin-top:0">🕒 ${L('最近學習紀錄', 'Recent activity')}</h2><ul class="small">${events.slice(0, 15).map((e) => `<li>${fmtDate(e.ts)}　${evLabel(e)}${e.id ? ` <a href="#/word/${e.id}" lang="en">${esc(D.term(e.id)?.src.en || '')}</a>` : ''}${e.game ? ' ' + esc(e.game) + ' ' + e.score : ''}</li>`).join('') || `<li class="muted">${L('尚無紀錄', 'None yet')}</li>`}</ul></div>
    <div class="card"><h2 style="margin-top:0">🌱 ${L('個人學習反思', 'Reflections')}</h2>${refl.slice(0, 4).map((r) => `<p class="small"><b>${esc(unitTitle(D.unit(r.unit) || { title: '', title_en: '' }))}</b>　${fmtDate(r.ts)}<br>✅ ${esc(r.learned)}${r.unclear ? '<br>❓ ' + esc(r.unclear) : ''}${r.next ? '<br>➡️ ' + esc(r.next) : ''}</p>`).join('') || `<p class="muted small">${L('在單元第五階段寫下反思。', 'Write reflections in stage 5.')}</p>`}</div>
  </div>
  <div class="row" style="margin-top:1rem"><a class="btn" href="#/data">⬇️ ${L('下載完整學習歷程', 'Download full history')}</a><button class="btn soft" onclick="print()">🖨️ ${L('列印儀表板', 'Print')}</button></div>`;
}

export async function reviewPage(v) {
  setCrumbs([[L('智慧複習', 'Smart review')]]);
  const due = dueList([...P.items.values()]);
  const wb = (await db.all('wrongbook')).sort((a, b) => (a.resolved - b.resolved) || b.count - a.count);
  const recs = D.allTerms().map((t) => ({ t, it: P.item(t.id) })).filter((x) => x.it && (x.it.correct + x.it.wrong) > 0)
    .sort((a, b) => priority(b.it) - priority(a.it)).slice(0, 8);
  const nextUnit = D.units.find((u) => unitStats(u).completion < 100);
  const upcoming = [...P.items.values()].filter((it) => it.due && it.due > today()).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 12);
  v.innerHTML = `<h1>🔁 ${L('智慧複習', 'Smart review')}</h1>
  <div class="grid two">
    <div class="card"><h2 style="margin-top:0">📅 ${L('今日待複習', 'Due today')}（${due.length}）</h2>
      ${due.length ? `<p>${due.slice(0, 30).map((it) => `<a href="#/word/${it.id}" lang="en">${esc(D.term(it.id)?.src.en)}</a>`).join('、')}</p>
        <div class="row"><button class="btn teal" data-go>${L('開始複習測驗', 'Start review')}</button><a class="btn ghost" href="#/flash/due">🃏 ${L('用單字卡複習', 'Flashcards')}</a></div>` : `<p>${L('今天的複習都完成了 🎉', 'All caught up 🎉')}</p>`}</div>
    <div class="card"><h2 style="margin-top:0">🧭 ${L('個人化下一步建議', 'Personal next steps')}</h2><ol>
      ${due.length ? `<li>${L(`先完成 ${due.length} 個到期複習（間隔重複效果最好）。`, `Finish ${due.length} due reviews first.`)}</li>` : ''}
      ${recs.length ? `<li>${L('優先加強', 'Focus on')}：${recs.slice(0, 5).map((x) => `<a href="#/word/${x.t.id}" lang="en">${esc(x.t.src.en)}</a>`).join('、')}</li>` : ''}
      ${wb.some((w) => !w.resolved) ? `<li><a href="#/practice/wrong/mix">${L('做錯題專項練習', 'Drill wrong answers')}</a>（${wb.filter((w) => !w.resolved).length}）</li>` : ''}
      ${nextUnit ? `<li>${L('繼續單元', 'Continue')} <a href="#/unit/${nextUnit.id}">${esc(unitTitle(nextUnit))}</a></li>` : `<li>${L('全部單元完成！挑戰綜合測驗', 'All units done! Try the challenge quiz')} <a href="#/quiz/challenge">🏆</a></li>`}
    </ol></div>
  </div>
  <h2>📕 ${L('錯題本', 'Wrong-answer book')}</h2>
  <p class="small muted">${L('答錯的單字自動加入；之後連續答對 2 次即標記為「已訂正」。', 'Wrong answers are added automatically; two correct answers in a row marks them fixed.')}</p>
  ${wb.length ? `<div class="card table-wrap"><table><thead><tr><th>${L('單字', 'Word')}</th><th>${L('中文', 'Chinese')}</th><th>${L('錯誤次數', 'Misses')}</th><th>${L('錯誤題型', 'Types')}</th><th>${L('熟練度', 'Mastery')}</th><th>${L('狀態', 'Status')}</th></tr></thead><tbody>
    ${wb.map((w) => { const t = D.term(w.id); if (!t) return ''; return `<tr><td><a href="#/word/${w.id}" lang="en">${esc(t.src.en)}</a></td><td>${esc(t.zhQ)}</td><td>${w.count}</td><td class="small">${(w.modes || []).map((m) => QT(m)).join('、')}</td><td>${masteryScore(P.item(w.id))}</td><td>${w.resolved ? `<span class="chip st-mastered">✔ ${L('已訂正', 'Fixed')}</span>` : `<span class="chip st-weak">▲ ${L('未訂正', 'Open')}</span>`}</td></tr>`; }).join('')}
  </tbody></table></div><div class="row" style="margin-top:.6rem"><a class="btn orange" href="#/practice/wrong/mix">♻️ ${L('錯題專項練習', 'Drill')}</a><a class="btn pink" href="#/quiz/retest">${L('錯題重測', 'Retest')}</a></div>` : `<p class="muted">${L('錯題本是空的。', 'Empty.')}</p>`}
  <h2>🗓️ ${L('接下來的複習排程', 'Upcoming reviews')}</h2>
  ${upcoming.length ? `<div class="card table-wrap"><table><tr><th>${L('單字', 'Word')}</th><th>${L('下次建議複習日期', 'Next review')}</th><th>${L('間隔', 'Interval')}</th><th>${L('最近正確率', 'Recent acc.')}</th></tr>${upcoming.map((it) => `<tr><td lang="en"><a href="#/word/${it.id}">${esc(D.term(it.id)?.src.en)}</a></td><td>${it.due}</td><td>${it.interval} ${L('天', 'd')}</td><td>${Math.round(recentAcc(it) * 100)}%</td></tr>`).join('')}</table></div>` : `<p class="muted">${L('作答後會自動排程。', 'Scheduled after you answer.')}</p>`}
  <p><a href="#/about">ℹ️ ${L('熟練度與複習演算法說明', 'How mastery & scheduling work')}</a></p>`;
  v.querySelector('[data-go]')?.addEventListener('click', async () => {
    const { startQuiz } = await import('./quiz.js');
    startQuiz(v, { type: 'retest', ids: due.slice(0, 20).map((it) => it.id), title: L('今日複習', 'Daily review'), qtypes: ['en2zh', 'zh2en', 'listen', 'cloze', 'spell'] });
  });
}
const QT = (k) => { try { return qtypeLabel(k); } catch { return k; } };

export function aboutPage(v) {
  setCrumbs([[L('說明', 'About')]]);
  v.innerHTML = `<h1>ℹ️ ${L('演算法與使用說明', 'How it works')}</h1>
  <div class="card"><h2 style="margin-top:0">${L('熟練狀態判定', 'Mastery status rules')}</h2><ul>
    <li><b>${statusLabel('new')}</b>：${L('沒看過也沒作答。', 'Never viewed or answered.')}</li>
    <li><b>${statusLabel('mastered')}</b>：${L('作答 ≥ 3 次、最近 8 次正確率 ≥ 80%、連續答對 ≥ 3；或自行標記「已熟悉」且作答 ≥ 2 次、最後一次答對。', '≥3 answers, recent accuracy ≥80%, streak ≥3; or marked familiar with ≥2 answers and last correct.')}</li>
    <li><b>${statusLabel('weak')}</b>：${L('作答 ≥ 2 次且最近正確率 < 60%；或累計錯 ≥ 2 次且最後一次答錯；或標記「不熟悉」且最近正確率 < 80%。', '≥2 answers with recent accuracy <60%; or ≥2 misses and last wrong; or marked unfamiliar with accuracy <80%.')}</li>
    <li><b>${statusLabel('learning')}</b>：${L('其他情況。', 'Everything else.')}</li></ul>
    <p>${L('熟練度分數（0–100）＝ 70% × 最近正確率 ＋ 30% × 連對次數/5；逾期複習每天扣 5 分（最多扣 30）。', 'Mastery score = 70% recent accuracy + 30% streak/5, minus 5 per overdue day (max 30).')}</p></div>
  <div class="card"><h2 style="margin-top:0">${L('間隔重複排程（SM-2 簡化版）', 'Spaced repetition (simplified SM-2)')}</h2><ul>
    <li>${L('答錯：重設，今天再複習。', 'Wrong: reset, review again today.')}</li>
    <li>${L('答對：間隔 1 天 → 3 天 → 前次間隔 × 難易係數（預設 2.5，最低 1.3）。6 秒內答對視為熟練，係數略增。', 'Correct: 1 day → 3 days → interval × ease (2.5 default, min 1.3).')}</li>
    <li>${L('同一天多次答對只推進一次。', 'Only one step forward per day.')}</li>
    <li>${L('推薦優先度＝錯誤率×2＋錯誤次數×0.3＋逾期天數×0.2（標記不熟悉 +0.5）。', 'Priority = error rate×2 + misses×0.3 + overdue days×0.2.')}</li></ul></div>
  <div class="card"><h2 style="margin-top:0">${L('內容來源', 'Content sources')}</h2>
    <p>📄 <b>${L('PDF 原文', 'PDF original')}</b>：${L('英文詞條、中文對照、頁碼。', 'terms, Chinese, page numbers.')}　🤖 <b>${L('AI 補充', 'AI supplement')}</b>：${esc(D.course.provenance.ai)}</p>
    <p>${L('PDF 只有英中對照表，沒有音標、定義、例句與圖片，這些都是 AI 補充並明確標示；原文疑似錯誤只列建議，不覆寫原文。', 'The PDF only lists terms and translations; everything else is labelled AI supplement.')}</p></div>
  <div class="card"><h2 style="margin-top:0">${L('已知限制', 'Known limits')}</h2><ul>
    <li>${L('發音使用瀏覽器內建語音，不同裝置聲線不同；部分雲端語音離線時無法播放。', 'Speech uses built-in voices that differ per device; online voices may fail offline.')}</li>
    <li>${L('學習紀錄只存在本機瀏覽器，清除網站資料、無痕模式或換裝置會遺失，請定期備份。', 'Records stay in this browser only — back up regularly.')}</li>
    <li>${L('教師模式只是前端切換，不是身分驗證，也無法保護答案。', 'Teacher mode is a front-end switch, not authentication.')}</li></ul></div>`;
}
export { quizLabel };
