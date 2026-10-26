// 教師工具：教材總覽、投影模式、題庫與解析、學生紀錄分析、班級統計、內容編輯與匯出、教師報表
// 注意：教師模式只是前端切換，不是身分驗證，也不能保護答案。
import * as D from './data.js';
import * as db from './store.js';
import { make, qtypeLabel } from './questions.js';
import { esc, L, toast, download, readFileText, pct, fmtDate, fmtTime } from './ui.js';
import { S, set as setSetting } from './settings.js';
import { speak } from './speech.js';
import { illus } from './illustrations.js';
import { setCrumbs, go } from './app.js';
import { unitTitle, lvChip } from './vocab.js';
import { validate } from './io.js';

const students = []; // 匯入的學生紀錄（只在記憶體，不寫入任何公開位置）

export function teacherPage(v, sub, arg) {
  if (!S.teacher) {
    setCrumbs([[L('教師模式', 'Teacher mode')]]);
    v.innerHTML = `<h1>👩‍🏫 ${L('教師模式', 'Teacher mode')}</h1><div class="card"><p>${L('教師模式提供投影、題庫解析、學生紀錄分析與內容編輯。', 'Projection, answer keys, student analysis and content editing.')}</p>
      <p class="fix-box small">${L('提醒：這只是介面切換，不是安全的身分驗證；學生也能開啟，題目答案不屬於機密保護。', 'Note: this is only a UI switch, not authentication; answers are not protected.')}</p>
      <button class="btn" data-on>${L('開啟教師模式', 'Turn on teacher mode')}</button></div>`;
    v.querySelector('[data-on]').onclick = () => { setSetting('teacher', true); teacherPage(v); };
    return;
  }
  const fn = { project, bank, students: studentsPage, edit, report }[sub];
  if (fn) return fn(v, arg);
  setCrumbs([[L('教師模式', 'Teacher mode')]]);
  const c = D.course;
  v.innerHTML = `<h1>👩‍🏫 ${L('教師工具', 'Teacher tools')}</h1>
  <div class="grid tight">${[['project/' + D.units[0].id, '📽️', L('課堂投影模式', 'Projector')], ['bank/' + D.units[0].id, '🗃️', L('題目與答案解析', 'Question bank')], ['students', '👥', L('學生紀錄與班級統計', 'Students & class')],
    ['edit', '✏️', L('教材內容編輯', 'Edit content')], ['report', '🧾', L('教師版成果報表', 'Teacher report')]].map(([h, i, t]) => `<a class="card" href="#/teacher/${h}" style="text-align:center;text-decoration:none;color:inherit"><div style="font-size:2rem">${i}</div><b>${t}</b></a>`).join('')}
    <button class="card" data-off style="text-align:center;cursor:pointer"><div style="font-size:2rem">🚪</div><b>${L('關閉教師模式', 'Exit teacher mode')}</b></button></div>
  <h2>${L('教材總覽', 'Material overview')}</h2>
  <div class="card"><p><b>${esc(c.material.title)}</b>（${esc(c.material.file)}，${c.material.pages} ${L('頁', 'pages')}，${c.terms.length} ${L('詞條', 'terms')}，v${esc(c.version)}）</p>
    <p class="small">${L('判定模式', 'Mode')}：${esc(c.material.detectReason)}</p>
    <div class="table-wrap"><table><tr><th>${L('單元', 'Unit')}</th><th>${L('詞數', 'Terms')}</th><th>${L('基礎/進階/挑戰', 'B/A/C')}</th><th>${L('預估時間', 'Time')}</th><th></th></tr>
    ${D.units.map((u) => `<tr><td>${esc(unitTitle(u))}</td><td>${u.terms.length}</td><td>${u.levels[1]} / ${u.levels[2]} / ${u.levels[3]}</td><td>${u.minutes} ${L('分', 'min')}</td>
      <td class="small"><a href="#/teacher/project/${u.id}">${L('投影', 'Project')}</a>・<a href="#/teacher/bank/${u.id}">${L('題庫', 'Bank')}</a>・<a href="#/practice/${u.id}/mix">${L('練習', 'Practice')}</a>・<a href="#/quiz/unit/${u.id}">${L('測驗', 'Quiz')}</a></td></tr>`).join('')}</table></div></div>
  <h2>${L('PDF 疑似錯誤清單', 'Possible errors in the PDF')}（${c.corrections.length}）</h2>
  <p class="small muted">${L('只提供建議，原文未被覆寫；測驗中「明顯錯字（high）」會以建議用字出題。', 'Suggestions only; originals are kept. High-severity typos use the suggestion in quizzes.')}</p>
  <div class="card table-wrap"><table><thead><tr><th>p.</th><th>${L('詞條', 'Term')}</th><th>${L('欄位', 'Field')}</th><th>${L('原始內容', 'Original')}</th><th>${L('建議修正', 'Suggestion')}</th><th>${L('原因', 'Reason')}</th><th>${L('嚴重度', 'Severity')}</th></tr></thead><tbody>
  ${c.corrections.map((x) => `<tr><td>${D.term(x.id).src.page}</td><td lang="en"><a href="#/word/${x.id}">${esc(x.en)}</a></td><td>${x.field === 'zh' ? L('中文', 'zh') : L('英文', 'en')}</td><td>${esc(x.original)}</td><td><b>${esc(x.suggestion)}</b></td><td class="small">${esc(x.reason)}</td><td>${{ high: '🔴 ' + L('高', 'high'), medium: '🟠 ' + L('中', 'med'), low: '🟢 ' + L('低', 'low') }[x.severity]}</td></tr>`).join('')}</tbody></table></div>
  <h3>${L('版面與擷取說明', 'Layout notes')}</h3><ul>${c.layoutIssues.map((x) => `<li>${x.page ? 'p.' + x.page + '：' : ''}${esc(x.note)}</li>`).join('')}</ul>
  <h3>${L('AI 補充把握度中等的詞條', 'Medium-confidence AI entries')}</h3><p>${c.terms.filter((t) => t.ai.confidence === 'medium').map((t) => `<a href="#/word/${t.id}" lang="en">${esc(t.src.en)}</a>`).join('、')}</p>`;
  v.querySelector('[data-off]').onclick = () => { setSetting('teacher', false); go('#/'); };
}

const unitSelect = (cur, base) => `<label class="small">${L('單元', 'Unit')} <select onchange="location.hash='#/teacher/${base}/'+this.value">${D.units.map((u) => `<option value="${u.id}" ${u.id === cur ? 'selected' : ''}>${esc(unitTitle(u))}</option>`).join('')}</select></label>`;

// 課堂投影模式
function project(v, uid = D.units[0].id) {
  setCrumbs([[L('教師模式', 'Teacher'), '#/teacher'], [L('投影', 'Projector')]]);
  const list = D.unitTerms(uid);
  let i = 0, reveal = 0;
  document.body.classList.add('projector');
  const exit = () => { document.body.classList.remove('projector'); removeEventListener('keydown', key); removeEventListener('hashchange', exit); };
  addEventListener('hashchange', exit);
  const draw = () => {
    const t = list[i];
    v.innerHTML = `<div class="proj"><div class="row between no-print"><span class="muted">${esc(unitTitle(D.unit(uid)))}　${i + 1}/${list.length}</span>
      <div class="row">${unitSelect(uid, 'project')}<button class="btn ghost small" data-x>✕ ${L('離開投影', 'Exit')}</button></div></div>
      <div class="en" lang="en">${esc(t.src.en)}</div><div class="ipa">${esc(t.ai.ipa_us || '')}　${lvChip(t.level)}</div>
      ${reveal >= 1 ? `<div style="font-size:2.2rem;font-weight:800">${esc(t.zhQ)}</div>` : ''}
      ${reveal >= 2 ? `<div class="grid two"><div class="illus">${illus(t.ai.illus)}</div><div><p>${esc(t.ai.def_zh || '')}</p><p lang="en">${esc(t.ai.example_en || '')}</p><p class="muted">${esc(t.ai.example_zh || '')}</p></div></div>` : ''}
      <div class="row no-print"><button class="btn ghost" data-p>←</button><button class="btn soft" data-say>🔊</button><button class="btn" data-r>${reveal < 2 ? L('揭示下一層（空白鍵）', 'Reveal (Space)') : L('下一個 →', 'Next →')}</button><button class="btn ghost" data-n>→</button></div>
      <p class="small muted no-print">${L('鍵盤：空白鍵揭示、← → 換字、S 發音、Esc 離開。建議搭配設定中的「全螢幕」與「字體放大」。', 'Keys: Space reveal, ← → move, S speak, Esc exit.')}</p></div>`;
    v.querySelector('[data-x]').onclick = () => { exit(); go('#/teacher'); };
    v.querySelector('[data-p]').onclick = () => move(-1);
    v.querySelector('[data-n]').onclick = () => move(1);
    v.querySelector('[data-r]').onclick = () => (reveal < 2 ? (reveal++, draw()) : move(1));
    v.querySelector('[data-say]').onclick = () => speak(t.src.en);
  };
  const move = (d) => { i = Math.max(0, Math.min(list.length - 1, i + d)); reveal = 0; draw(); };
  const key = (e) => {
    if (!document.body.classList.contains('projector')) return;
    if (e.key === 'ArrowRight') move(1); else if (e.key === 'ArrowLeft') move(-1);
    else if (e.key === ' ') { e.preventDefault(); v.querySelector('[data-r]').click(); }
    else if (e.key.toLowerCase() === 's') speak(list[i].src.en);
    else if (e.key === 'Escape') { exit(); go('#/teacher'); }
  };
  addEventListener('keydown', key);
  draw();
}

// 題庫與答案解析
function bank(v, uid = D.units[0].id) {
  setCrumbs([[L('教師模式', 'Teacher'), '#/teacher'], [L('題庫', 'Question bank')]]);
  const list = D.unitTerms(uid);
  v.innerHTML = `<h1>🗃️ ${L('題目與答案解析', 'Questions & answers')}</h1>
  <div class="row between no-print">${unitSelect(uid, 'bank')}<div class="row"><a class="btn small" href="#/practice/${uid}/mix">✏️ ${L('切換到練習', 'Practice')}</a><a class="btn teal small" href="#/quiz/unit/${uid}">📝 ${L('切換到測驗', 'Quiz')}</a><button class="btn soft small" onclick="print()">🖨️ ${L('列印', 'Print')}</button></div></div>
  <p class="small muted">${L('以下為各詞條可產生的題型範例（實際作答時選項會重新隨機抽取與排序）。', 'Sample items per term; real quizzes re-randomise options.')}</p>
  ${list.map((t, n) => {
    const cl = make('cloze', t), df = make('def', t);
    return `<div class="card"><div class="row between"><b>${n + 1}. <span lang="en">${esc(t.src.en)}</span>　${esc(t.zhQ)}</b>${lvChip(t.level)}</div>
      <ol class="small">
        <li>${qtypeLabel('en2zh')}：<span lang="en">${esc(t.src.en)}</span> → <b>${esc(t.zhQ)}</b></li>
        ${df ? `<li>${qtypeLabel('def')}：<span lang="en">${esc(t.ai.def_en)}</span> → <b lang="en">${esc(t.src.en)}</b></li>` : ''}
        ${cl ? `<li>${qtypeLabel('cloze')}：<span lang="en">${cl.prompt}</span> → <b lang="en">${esc(t.src.en)}</b>（${esc(t.ai.example_zh || '')}）</li>` : ''}
        ${t.ai.tf ? `<li>${qtypeLabel('tf')}：${esc(t.ai.tf.statement_zh)} → <b>${t.ai.tf.answer ? L('正確', 'True') : L('錯誤', 'False')}</b>｜${esc(t.ai.tf.explain || '')}</li>` : ''}
        <li>${qtypeLabel('spell')}：${esc(t.zhQ)} → <b lang="en">${esc(t.src.en)}</b>（${esc(t.ai.syllables || '')}）</li>
      </ol></div>`;
  }).join('')}`;
}

// 學生紀錄匯入與分析
function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  text = text.replace(/^﻿/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.length > 1);
}

function fromJson(obj, fname) {
  const d = obj.data;
  const items = new Map((d.items || []).map((it) => [it.id, it]));
  return { name: obj.profile?.name || fname.replace(/\.(json|csv)$/i, ''), cls: obj.profile?.cls || '', seat: obj.profile?.seat || '', source: 'JSON',
    items, quizzes: d.quizzes || [], reflections: d.reflections || [], daily: d.daily || [], units: d.units || [], exportedAt: obj.exportedAt };
}
function fromCsv(rows, fname) {
  const head = rows[0];
  const iEn = head.indexOf('英文'), iC = head.indexOf('答對'), iW = head.indexOf('答錯'), iV = head.indexOf('觀看');
  if (iEn < 0 || iC < 0) return null;
  const byEn = new Map(D.allTerms().map((t) => [t.src.en, t.id]));
  const items = new Map();
  for (const r of rows.slice(1)) {
    const id = byEn.get(r[iEn]);
    if (id) items.set(id, { id, correct: +r[iC] || 0, wrong: +r[iW] || 0, views: +r[iV] || 0, recent: [] });
  }
  return { name: fname.replace(/\.csv$/i, ''), source: 'CSV', items, quizzes: [], reflections: [], daily: [], units: [] };
}

function studentStats(s) {
  const its = [...s.items.values()];
  const ans = its.reduce((a, it) => a + it.correct + it.wrong, 0);
  const ok = its.reduce((a, it) => a + it.correct, 0);
  const byUnit = {};
  for (const it of its) { const t = D.term(it.id); if (!t) continue; (byUnit[t.unit] ||= { n: 0, ok: 0 }); byUnit[t.unit].n += it.correct + it.wrong; byUnit[t.unit].ok += it.correct; }
  const scores = s.quizzes.map((q) => q.score);
  return { learned: its.filter((it) => it.views || it.correct + it.wrong).length, ans, acc: pct(ok, ans), byUnit,
    quizN: scores.length, avg: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null, best: scores.length ? Math.max(...scores) : null,
    time: s.daily.reduce((a, d) => a + d.ms, 0), missed: its.filter((it) => it.wrong).sort((a, b) => b.wrong - a.wrong).slice(0, 8) };
}

function studentsPage(v, idx) {
  setCrumbs([[L('教師模式', 'Teacher'), '#/teacher'], [L('學生紀錄', 'Students')]]);
  if (idx != null && students[+idx]) return studentDetail(v, students[+idx]);
  const stats = students.map(studentStats);
  // 班級統計
  const unitAgg = {};
  stats.forEach((s) => Object.entries(s.byUnit).forEach(([u, x]) => { (unitAgg[u] ||= { n: 0, ok: 0 }); unitAgg[u].n += x.n; unitAgg[u].ok += x.ok; }));
  const missAgg = {};
  students.forEach((s) => s.items.forEach((it) => { if (it.wrong) missAgg[it.id] = (missAgg[it.id] || 0) + it.wrong; }));
  const avgs = stats.filter((s) => s.avg != null).map((s) => s.avg);
  v.innerHTML = `<h1>👥 ${L('學生學習歷程分析', 'Student records')}</h1>
  <div class="card no-print"><label class="field" for="sf">${L('匯入學生匯出的 JSON 或 CSV（可多選）', 'Import student JSON/CSV files (multi-select)')}</label>
    <input id="sf" type="file" multiple accept=".json,.csv,application/json,text/csv">
    <p class="small muted">${L('資料只在這個瀏覽器分頁的記憶體中分析，重新整理即清除，不會上傳或寫入任何公開位置。', 'Data stays in memory only and is never uploaded.')}</p>
    ${students.length ? `<button class="btn ghost small" data-clear>${L('清空匯入的學生', 'Clear imported')}</button>` : ''}</div>
  ${students.length ? `<h2>${L('班級統計', 'Class statistics')}（${students.length} ${L('人', 'students')}）</h2>
  <div class="kpis"><div class="card stat"><b>${avgs.length ? Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length) : '—'}</b><span>${L('平均測驗分數', 'Mean quiz score')}</span></div>
    <div class="card stat"><b>${Math.round(stats.reduce((a, s) => a + s.acc, 0) / stats.length)}%</b><span>${L('平均答對率', 'Mean accuracy')}</span></div>
    <div class="card stat"><b>${Math.round(stats.reduce((a, s) => a + s.learned, 0) / stats.length)}</b><span>${L('平均學習單字數', 'Mean words studied')}</span></div>
    <div class="card stat"><b>${stats.filter((s) => s.avg != null && s.avg >= S.passScore).length}/${students.length}</b><span>${L('平均及格人數', 'Passing (mean)')}</span></div></div>
  <div class="grid two" style="margin-top:.9rem"><div class="card table-wrap"><h3 style="margin-top:0">${L('各單元班級答對率', 'Accuracy by unit')}</h3><table>${D.units.map((u) => { const x = unitAgg[u.id]; return `<tr><td>${esc(unitTitle(u))}</td><td>${x ? pct(x.ok, x.n) + '%' : '—'}</td><td>${x ? x.n : 0} ${L('題', 'ans')}</td></tr>`; }).join('')}</table></div>
    <div class="card"><h3 style="margin-top:0">${L('全班最常錯的單字', 'Most-missed words')}</h3><ol>${Object.entries(missAgg).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([id, n]) => `<li><a href="#/word/${id}" lang="en">${esc(D.term(id)?.src.en || id)}</a> ✘${n}</li>`).join('')}</ol></div></div>
  <h2>${L('學生列表', 'Students')}</h2>
  <div class="card table-wrap"><table><thead><tr><th>${L('姓名', 'Name')}</th><th>${L('班級/座號', 'Class/No.')}</th><th>${L('學過單字', 'Studied')}</th><th>${L('答對率', 'Accuracy')}</th><th>${L('測驗數', 'Quizzes')}</th><th>${L('平均分', 'Mean')}</th><th>${L('學習時間', 'Time')}</th><th></th></tr></thead><tbody>
    ${students.map((s, i) => `<tr><td>${esc(s.name)}</td><td>${esc(s.cls || '')} ${esc(s.seat || '')}</td><td>${stats[i].learned}</td><td>${stats[i].acc}%</td><td>${stats[i].quizN}</td><td>${stats[i].avg ?? '—'}</td><td>${fmtTime(stats[i].time)}</td><td><a href="#/teacher/students/${i}">${L('分析', 'Detail')}</a></td></tr>`).join('')}</tbody></table></div>
  <div class="row no-print" style="margin-top:.6rem"><button class="btn soft" data-ccsv>⬇️ ${L('匯出班級統計 CSV', 'Export class CSV')}</button><a class="btn" href="#/teacher/report">🧾 ${L('教師版報表', 'Teacher report')}</a></div>` : `<p class="muted">${L('尚未匯入學生資料。學生可在「資料備份」頁下載 JSON 或 CSV 後交給老師。', 'No student files yet.')}</p>`}`;
  v.querySelector('#sf').onchange = async (e) => {
    let n = 0;
    for (const f of e.target.files) {
      try {
        const text = await readFileText(f);
        if (/\.json$/i.test(f.name) || text.trim().startsWith('{')) {
          const obj = JSON.parse(text);
          const errs = validate(obj).filter((x) => !/教材不同|Different material/.test(x));
          if (errs.length) { toast(`${f.name}：${errs[0]}`); continue; }
          students.push(fromJson(obj, f.name)); n++;
        } else {
          const s = fromCsv(parseCsv(text), f.name);
          if (!s) { toast(`${f.name}：${L('不是學習歷程 CSV', 'Not a history CSV')}`); continue; }
          students.push(s); n++;
        }
      } catch { toast(`${f.name}：${L('讀取失敗', 'Read failed')}`); }
    }
    toast(L(`已匯入 ${n} 位學生`, `${n} students imported`));
    studentsPage(v);
  };
  v.querySelector('[data-clear]')?.addEventListener('click', () => { students.length = 0; studentsPage(v); });
  v.querySelector('[data-ccsv]')?.addEventListener('click', () => {
    const rows = [['姓名', '班級', '座號', '學過單字', '答對率%', '測驗數', '平均分', '最高分', '學習分鐘', ...D.units.map((u) => u.title + ' 答對率%')]];
    students.forEach((s, i) => { const st = stats[i]; rows.push([s.name, s.cls || '', s.seat || '', st.learned, st.acc, st.quizN, st.avg ?? '', st.best ?? '', Math.round(st.time / 60000), ...D.units.map((u) => st.byUnit[u.id] ? pct(st.byUnit[u.id].ok, st.byUnit[u.id].n) : '')]); });
    download('班級學習統計.csv', '﻿' + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n'), 'text/csv');
  });
}

function studentDetail(v, s) {
  const st = studentStats(s);
  v.innerHTML = `<h1>👤 ${esc(s.name)} ${esc(s.cls || '')} ${esc(s.seat || '')}</h1>
  <p class="small muted">${L('來源', 'Source')}：${s.source}${s.exportedAt ? '・' + L('匯出時間', 'exported') + ' ' + fmtDate(s.exportedAt) : ''}</p>
  <div class="kpis"><div class="card stat"><b>${st.learned}</b><span>${L('學過單字', 'Studied')}</span></div><div class="card stat"><b>${st.acc}%</b><span>${L('答對率', 'Accuracy')}</span></div>
    <div class="card stat"><b>${st.avg ?? '—'}</b><span>${L('平均測驗分數', 'Mean score')}</span></div><div class="card stat"><b>${fmtTime(st.time)}</b><span>${L('學習時間', 'Time')}</span></div></div>
  <div class="grid two" style="margin-top:.9rem"><div class="card table-wrap"><h3 style="margin-top:0">${L('各單元答對率', 'By unit')}</h3><table>${D.units.map((u) => { const x = st.byUnit[u.id]; const a = x ? pct(x.ok, x.n) : null; return `<tr><td>${esc(unitTitle(u))}</td><td>${a != null ? a + '%' : '—'}</td><td>${a == null ? '' : a >= S.masteryScore ? '🌟' : a >= S.passScore ? '✅' : '▲ ' + L('需補救', 'needs help')}</td></tr>`; }).join('')}</table></div>
    <div class="card"><h3 style="margin-top:0">${L('常錯單字', 'Most missed')}</h3><ol>${st.missed.map((it) => `<li lang="en">${esc(D.term(it.id)?.src.en || it.id)} ✘${it.wrong}</li>`).join('') || `<li class="muted">${L('無', 'None')}</li>`}</ol></div>
    <div class="card table-wrap"><h3 style="margin-top:0">${L('測驗紀錄', 'Quizzes')}</h3><table>${s.quizzes.slice(-15).reverse().map((q) => `<tr><td class="small">${fmtDate(q.ts)}</td><td>${esc(q.title)}</td><td>${q.score}</td></tr>`).join('') || `<tr><td class="muted">${L('無', 'None')}</td></tr>`}</table></div>
    <div class="card"><h3 style="margin-top:0">${L('學習反思', 'Reflections')}</h3>${s.reflections.map((r) => `<p class="small">✅ ${esc(r.learned)}${r.unclear ? '<br>❓ ' + esc(r.unclear) : ''}${r.next ? '<br>➡️ ' + esc(r.next) : ''}</p>`).join('') || `<p class="muted small">${L('無', 'None')}</p>`}</div></div>
  <div class="row no-print" style="margin-top:1rem"><a class="btn ghost" href="#/teacher/students">← ${L('回學生列表', 'Back')}</a><button class="btn soft" onclick="print()">🖨️ ${L('列印', 'Print')}</button></div>`;
}

// 教材內容編輯（只改 AI 補充欄位與難度，原文不可改）
async function edit(v, id) {
  setCrumbs([[L('教師模式', 'Teacher'), '#/teacher'], [L('內容編輯', 'Edit content')]]);
  const t = D.term(id) || D.allTerms()[0];
  const ov = await db.all('overrides');
  const F = [['ipa_us', 'IPA (US)'], ['ipa_uk', 'IPA (UK)'], ['syllables', L('音節', 'Syllables')], ['pos', L('詞性', 'POS')], ['def_zh', L('中文解釋', 'Chinese explanation')], ['def_en', L('英文定義', 'English definition')], ['example_en', L('英文例句（需含詞條）', 'Example (must contain term)')], ['example_zh', L('例句翻譯', 'Translation')]];
  v.innerHTML = `<h1>✏️ ${L('教材內容編輯', 'Edit content')}</h1>
  <p class="small muted">${L('PDF 原文不可修改；可修訂 AI 補充欄位。修改存在本機，可匯出成新的教材 JSON（取代 data/course-chem.json 後重新部署即生效）。', 'PDF originals are read-only; edit AI fields, then export a new course JSON.')}</p>
  <label class="field" for="ts">${L('選擇詞條', 'Term')}</label><select id="ts">${D.allTerms().slice().sort((a, b) => a.src.en.localeCompare(b.src.en)).map((x) => `<option value="${x.id}" ${x.id === t.id ? 'selected' : ''}>${esc(x.src.en)}${ov.some((o) => o.id === x.id) ? ' ✎' : ''}</option>`).join('')}</select>
  <form class="card" id="ef" style="margin-top:.8rem"><div class="src-box">📄 ${esc(t.src.en)}　${esc(t.src.zh)}（p.${t.src.page}）</div>
    ${F.map(([k, lab]) => `<label class="field" for="e-${k}">${lab}</label>${k.startsWith('def') || k.startsWith('example') ? `<textarea id="e-${k}" name="${k}" ${k.endsWith('en') ? 'lang="en"' : ''}>${esc(t.ai[k] || '')}</textarea>` : `<input type="text" id="e-${k}" name="${k}" value="${esc(t.ai[k] || '')}" style="width:100%">`}`).join('')}
    <div class="row" style="margin-top:.7rem"><button class="btn">${L('儲存修改', 'Save')}</button>${ov.some((o) => o.id === t.id) ? `<button type="button" class="btn ghost" data-undo>${L('還原為原始 AI 內容', 'Revert')}</button>` : ''}</div></form>
  <div class="card" style="margin-top:.8rem"><b>${L('已修改', 'Edited')}：${ov.length} ${L('筆', 'terms')}</b>
    <div class="row" style="margin-top:.5rem"><button class="btn teal" data-exp>⬇️ ${L('匯出修改後的教材 JSON', 'Export edited course JSON')}</button><button class="btn soft" data-bank>⬇️ ${L('匯出題庫 CSV', 'Export bank CSV')}</button></div></div>`;
  v.querySelector('#ts').onchange = (e) => go('#/teacher/edit/' + e.target.value);
  v.querySelector('#ef').onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const ai = Object.fromEntries(F.map(([k]) => [k, fd.get(k).trim()]));
    if (ai.example_en && !ai.example_en.toLowerCase().includes(t.src.en.toLowerCase())) return toast(L('英文例句必須包含詞條本身，句子填空題才能出題。', 'The example must contain the term.'));
    await db.put('overrides', { id: t.id, ai, ts: Date.now() });
    Object.assign(t.ai, ai);
    toast(L('已儲存', 'Saved'));
    edit(v, t.id);
  };
  v.querySelector('[data-undo]')?.addEventListener('click', async () => { await db.del('overrides', t.id); await D.loadCourse(D.course.materialId); toast(L('已還原', 'Reverted')); edit(v, t.id); });
  v.querySelector('[data-exp]').onclick = () => {
    const out = JSON.parse(JSON.stringify(D.course));
    for (const x of out.terms) { delete x.fix; delete x.zhQ; delete x.zhShort; }
    delete out.materialId;
    out.version = D.course.version + '-edited-' + new Date().toISOString().slice(0, 10);
    download('course-chem.json', JSON.stringify(out));
  };
  v.querySelector('[data-bank]').onclick = () => {
    const rows = [['id', '英文', '中文(原文)', '測驗用中文', '單元', '難度', 'IPA', '定義', '例句', '正誤題', '正誤答案', '頁碼']];
    for (const x of D.allTerms()) rows.push([x.id, x.src.en, x.src.zh, x.zhQ, D.unit(x.unit).title, x.level, x.ai.ipa_us, x.ai.def_zh, x.ai.example_en, x.ai.tf?.statement_zh || '', x.ai.tf ? (x.ai.tf.answer ? '正確' : '錯誤') : '', x.src.page]);
    download('題庫.csv', '﻿' + rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n'), 'text/csv');
  };
}

// 教師版成果報表（可列印）
function report(v) {
  setCrumbs([[L('教師模式', 'Teacher'), '#/teacher'], [L('教師版報表', 'Teacher report')]]);
  const stats = students.map(studentStats);
  v.innerHTML = `<h1>🧾 ${L('教師版學習成果報表', 'Teacher report')}</h1>
  <p>${esc(D.course.material.title)}・${L('產生時間', 'Generated')} ${fmtDate(Date.now())}・${L('及格', 'Pass')} ${S.passScore}／${L('精熟', 'Mastery')} ${S.masteryScore}</p>
  ${students.length ? `<div class="card table-wrap"><table><thead><tr><th>${L('學生', 'Student')}</th><th>${L('學過', 'Studied')}</th><th>${L('答對率', 'Acc.')}</th><th>${L('平均分', 'Mean')}</th><th>${L('最高分', 'Best')}</th><th>${L('需補救單元', 'Units needing help')}</th></tr></thead><tbody>
    ${students.map((s, i) => { const st = stats[i]; const weakU = D.units.filter((u) => st.byUnit[u.id] && pct(st.byUnit[u.id].ok, st.byUnit[u.id].n) < S.passScore).map((u) => u.title); return `<tr><td>${esc(s.name)} ${esc(s.cls || '')}${esc(s.seat || '')}</td><td>${st.learned}/${D.allTerms().length}</td><td>${st.acc}%</td><td>${st.avg ?? '—'}</td><td>${st.best ?? '—'}</td><td class="small">${esc(weakU.join('、') || '—')}</td></tr>`; }).join('')}
  </tbody></table></div>` : `<p class="muted">${L('請先到「學生紀錄」匯入學生檔案。', 'Import student files first.')}</p>`}
  <h2>${L('教材與題庫概況', 'Course & item bank')}</h2>
  <div class="card table-wrap"><table><tr><th>${L('單元', 'Unit')}</th><th>${L('詞數', 'Terms')}</th><th>${L('學習目標', 'Objectives')}</th></tr>${D.units.map((u) => `<tr><td>${esc(unitTitle(u))}</td><td>${u.terms.length}</td><td class="small">${L(u.goals, u.goals_en).map(esc).join(L('；', '; '))}</td></tr>`).join('')}</table></div>
  <div class="row no-print" style="margin-top:1rem"><button class="btn" onclick="print()">🖨️ ${L('列印／另存 PDF', 'Print / save PDF')}</button></div>`;
}
