// 課程與單字展示：首頁、教材清單、目錄、單字詳細、單字卡、PDF 原始順序、搜尋
import * as D from './data.js';
import * as P from './progress.js';
import { status, statusLabel, masteryScore, recentAcc, dueList } from './review.js';
import { esc, L, html, toast, shuffle, pct, fmtDate } from './ui.js';
import { speak, voiceInfo, supported as speechOk } from './speech.js';
import { illus } from './illustrations.js';
import { S } from './settings.js';
import { sfx } from './sound.js';
import { setCrumbs, go } from './app.js';

export const lvLabel = (l) => [, L('基礎', 'Basic'), L('進階', 'Advanced'), L('挑戰', 'Challenge')][l];
export const lvChip = (l) => `<span class="chip l${l}">${['', '🌱', '🌿', '🌳'][l]} ${lvLabel(l)}</span>`;
export const stChip = (id) => { const s = status(P.item(id)); return `<span class="chip st-${s}">${statusLabel(s)}</span>`; };
export const unitTitle = (u) => L(u.title, u.title_en);
const pdfLink = (t) => `${D.materials.find((m) => m.id === D.course.materialId)?.pdf || ''}#page=${t.src.page}`;

/** 單元完成率：五階段完成數 / 5；單字學習率：非「未學習」比例 */
export function unitStats(u) {
  const ids = u.terms;
  const st = ids.map((id) => status(P.item(id)));
  const prog = P.unitProgress(u.id);
  const stages = P.STAGES.filter((k) => prog.stages?.[k]).length;
  return {
    total: ids.length,
    learned: st.filter((s) => s !== 'new').length,
    mastered: st.filter((s) => s === 'mastered').length,
    weak: st.filter((s) => s === 'weak').length,
    stages, completion: Math.round((stages / 5) * 100),
  };
}

export function termCard(t) {
  return `<a class="card term-card" href="#/word/${t.id}" style="text-decoration:none;color:inherit">
    <div class="row between"><span class="en" lang="en">${esc(t.src.en)}</span>${stChip(t.id)}</div>
    <span class="zh">${esc(t.src.zh)}</span>
    <div class="row">${lvChip(t.level)}<span class="chip">${esc(t.ai.pos || '')}</span><span class="chip src" title="${L('來源頁碼', 'Source page')}">📄 p.${t.src.page}</span>
    ${P.item(t.id)?.fav ? '<span class="chip">❤️</span>' : ''}${t.fix.length ? `<span class="chip st-weak" title="${L('原文有更正建議', 'Has correction note')}">✎</span>` : ''}</div>
  </a>`;
}

// ---------- 首頁 ----------
export async function home(v) {
  setCrumbs([]);
  const s = await P.summary(D.allTerms().length);
  const due = dueList([...P.items.values()]).length;
  const next = D.units.find((u) => unitStats(u).completion < 100) || D.units[0];
  const lv = P.levelOf(P.meta.xp);
  v.innerHTML = `
  <section class="hero">
    <h1>⚗️ ${esc(D.course.material.title)}</h1>
    <p>${L(`AI 智慧自主學習｜${s.total} 個專業詞彙・${D.units.length} 個單元・五階段自主學習`, `AI self-directed learning · ${s.total} terms · ${D.units.length} units · 5-stage learning cycle`)}</p>
  </section>
  <div class="kpis">
    <div class="card stat"><b>${s.learned}<small>/${s.total}</small></b><span>${L('已學習單字', 'Words studied')}</span></div>
    <div class="card stat"><b>${s.mastered}</b><span>${L('已精熟', 'Mastered')}</span></div>
    <div class="card stat"><b>${due}</b><span>${L('今日待複習', 'Due today')}</span></div>
    <div class="card stat"><b>🔥 ${s.streak}</b><span>${L('連續學習天數', 'Day streak')}</span></div>
    <div class="card stat"><b>Lv.${lv}</b><span>${P.meta.xp} XP</span></div>
  </div>
  <h2>${L('下一步建議', 'Suggested next step')}</h2>
  <div class="grid two">
    <div class="card"><h3 style="margin-top:0">📘 ${L('繼續單元', 'Continue unit')}：${esc(unitTitle(next))}</h3>
      <div class="progress"><i style="width:${unitStats(next).completion}%"></i></div>
      <p class="small muted">${L('五階段完成', 'Stages done')} ${unitStats(next).stages}/5</p>
      <a class="btn" href="#/unit/${next.id}">${L('前往單元', 'Open unit')}</a></div>
    <div class="card"><h3 style="margin-top:0">🔁 ${L('智慧複習', 'Smart review')}</h3>
      <p>${due ? L(`今天有 ${due} 個單字到期，先複習再學新內容效果最好。`, `${due} words are due today.`) : L('今天沒有到期的複習，可以學新單元或玩遊戲鞏固。', 'Nothing due today — learn something new!')}</p>
      <a class="btn teal" href="#/review">${L('開始複習', 'Start review')}</a></div>
  </div>
  <h2>${L('快速開始', 'Quick start')}</h2>
  <div class="grid tight">
    ${[['#/course', '🗂️', L('教材目錄', 'Course map')], ['#/flash/all', '🃏', L('單字卡', 'Flashcards')], ['#/practice', '✏️', L('練習', 'Practice')],
      ['#/quiz', '📝', L('測驗', 'Quizzes')], ['#/games', '🎮', L('遊戲', 'Games')], ['#/dashboard', '📊', L('學習儀表板', 'Dashboard')],
      ['#/map', '🕸️', L('概念心智圖', 'Mind map')], ['#/pdf', '📄', L('PDF 原始順序', 'PDF order')]]
      .map(([h, i, t]) => `<a class="card" href="${h}" style="text-decoration:none;color:inherit;text-align:center"><div style="font-size:2rem">${i}</div><b>${t}</b></a>`).join('')}
  </div>
  <p class="small muted" style="margin-top:1.2rem">🔒 ${L('學習紀錄只存在這台裝置的瀏覽器中；清除網站資料、使用無痕模式或更換裝置都可能遺失，請定期到「資料備份」匯出。', 'Your records stay in this browser only. Clearing site data, private mode or switching devices can lose them — back up regularly.')}</p>`;
}

// ---------- 教材清單 ----------
export function materialsPage(v) {
  setCrumbs([[L('教材清單', 'Materials')]]);
  v.innerHTML = `<h1>📚 ${L('教材清單', 'Materials')}</h1>
  <div class="grid">${D.materials.map((m) => `<div class="card">
    <h3 style="margin-top:0">${esc(m.title)}</h3>
    <p class="small">${L('詞條', 'Terms')} ${m.terms}・${L('學習模式', 'Mode')}：${m.mode === 'vocabulary' ? L('單字學習模式', 'Vocabulary mode') : L('概念理解模式', 'Concept mode')}・v${esc(m.version)}</p>
    <p class="small muted">${esc(D.course.material.detectReason || '')}</p>
    <div class="row"><button class="btn" data-m="${m.id}" ${m.id === D.course.materialId ? 'disabled' : ''}>${m.id === D.course.materialId ? L('使用中', 'In use') : L('切換到此教材', 'Use this')}</button>
    <a class="btn ghost" href="${esc(m.pdf)}" target="_blank" rel="noopener">${L('開啟原始 PDF', 'Open PDF')}</a></div></div>`).join('')}</div>
  <p class="small muted">${L('新增教材的方法請見 README「如何更換或加入 PDF 教材」。', 'See README for adding materials.')}</p>`;
  v.querySelectorAll('[data-m]').forEach((b) => b.onclick = async () => { await D.loadCourse(b.dataset.m); go('#/'); });
}

// ---------- 教材目錄 ----------
export function coursePage(v) {
  setCrumbs([[L('教材目錄', 'Course map')]]);
  v.innerHTML = `<h1>🗂️ ${L('教材目錄', 'Course map')}</h1>
  <p class="muted">${L('依知識概念與學習難度重新分類（非 PDF 頁序）。想看原始順序請用', 'Reorganised by concept and difficulty. For the original order see')} <a href="#/pdf">${L('PDF 原始順序', 'PDF order')}</a>・<a href="#/map">${L('概念心智圖', 'mind map')}</a></p>
  ${D.chapters.map((c, ci) => `<h2>${L('第', 'Ch.')} ${ci + 1} ${L('章', '')}　${esc(L(c.title, c.title_en))}</h2>
    <div class="grid">${c.units.map((uid) => { const u = D.unit(uid); const st = unitStats(u); return `
      <a class="card" href="#/unit/${u.id}" style="text-decoration:none;color:inherit">
        <div class="row between"><b>${esc(unitTitle(u))}</b><span class="chip">⏱ ${u.minutes} ${L('分', 'min')}</span></div>
        <p class="small muted" style="margin:.3rem 0">${esc(L(u.desc, u.desc_en))}</p>
        <div class="row small">${[1, 2, 3].map((l) => `${lvChip(l)} ${u.levels[l]}`).join(' ')}</div>
        <div class="progress" style="margin-top:.5rem" aria-label="${L('單元完成率', 'Unit completion')} ${st.completion}%"><i style="width:${st.completion}%"></i></div>
        <p class="small" style="margin:.3rem 0 0">${L('完成', 'Done')} ${st.completion}%・${L('學過', 'Studied')} ${st.learned}/${st.total}・${L('精熟', 'Mastered')} ${st.mastered}</p>
      </a>`; }).join('')}</div>`).join('')}`;
}

// ---------- PDF 原始順序 ----------
export function pdfPage(v) {
  setCrumbs([[L('PDF 原始順序', 'PDF order')]]);
  const byPage = {};
  for (const t of D.pdfOrder()) {
    (byPage[t.src.page] ||= []).push({ t, order: t.src.order, zh: t.src.zh });
    for (const a of t.src.also || []) (byPage[a.page] ||= []).push({ t, order: a.order, zh: a.zh, dup: true });
  }
  Object.values(byPage).forEach((arr) => arr.sort((a, b) => a.order - b.order));
  const ci = D.course.layoutIssues || [];
  v.innerHTML = `<h1>📄 ${L('PDF 原始順序檢視', 'Original PDF order')}</h1>
  <p class="muted">${L('來源檔案', 'Source')}：${esc(D.course.material.file)}・${D.course.material.pages} ${L('頁', 'pages')}・${D.course.material.rowCount && D.course.material.rowCount !== D.allTerms().length ? `${D.course.material.rowCount} ${L('列', 'rows')}（${L('合併重複後', 'merged')} ${D.allTerms().length} ${L('詞條', 'terms')}）` : `${D.allTerms().length} ${L('詞條', 'terms')}`}　<a href="${esc(D.materials[0].pdf)}" target="_blank" rel="noopener">${L('開啟原始 PDF', 'Open PDF')}</a></p>
  <details class="card"><summary><b>${L('擷取說明與版面問題', 'Extraction notes')}</b></summary><ul>${ci.map((x) => `<li>${x.page ? 'p.' + x.page + '：' : ''}${esc(x.note)}</li>`).join('')}</ul></details>
  ${Object.entries(byPage).map(([p, ts]) => `<h2 id="p${p}">${L('第', 'Page')} ${p} ${L('頁', '')} <a class="small" href="${esc(D.materials[0].pdf)}#page=${p}" target="_blank" rel="noopener">${L('看原頁', 'view page')}</a></h2>
    <div class="table-wrap card"><table><thead><tr><th>#</th><th>${L('英文', 'English')}</th><th>${L('中文（原文）', 'Chinese (original)')}</th><th>${L('單元', 'Unit')}</th><th>${L('狀態', 'Status')}</th></tr></thead>
    <tbody>${ts.map(({ t, order, zh, dup }) => `<tr><td>${order}</td><td lang="en"><a href="#/word/${t.id}">${esc(t.src.en)}</a>${dup ? ` <span class="chip">${L('重複', 'repeat')}</span>` : ''}</td><td>${esc(zh)}${t.fix.length ? ' <span class="chip st-weak">✎</span>' : ''}</td><td class="small">${esc(unitTitle(D.unit(t.unit)))}</td><td>${stChip(t.id)}</td></tr>`).join('')}</tbody></table></div>`).join('')}`;
}

// ---------- 搜尋 ----------
export function searchPage(v, q) {
  setCrumbs([[L('搜尋', 'Search')]]);
  const res = D.search(q);
  v.innerHTML = `<h1>🔍 ${L('搜尋', 'Search')}</h1>
  <form class="row" id="sf" role="search"><label class="sr-only" for="sq">${L('搜尋關鍵字', 'Keyword')}</label><input id="sq" type="search" value="${esc(q)}" style="flex:1" placeholder="${L('英文、中文、定義、例句', 'English, Chinese, definitions…')}"><button class="btn">${L('搜尋', 'Search')}</button></form>
  <p class="muted">${L(`找到 ${res.length} 筆`, `${res.length} results`)}</p>
  <div class="grid">${res.map((r) => r.u ? `<a class="card" href="#/unit/${r.u.id}" style="text-decoration:none;color:inherit"><b>📘 ${esc(unitTitle(r.u))}</b><p class="small muted">${esc(L(r.u.desc, r.u.desc_en))}</p></a>` : termCard(r.t)).join('')}</div>`;
  v.querySelector('#sf').onsubmit = (e) => { e.preventDefault(); go('#/search/' + encodeURIComponent(v.querySelector('#sq').value)); };
  v.querySelector('#sq').focus();
}

// ---------- 單字詳細 ----------
export async function wordPage(v, id) {
  const t = D.term(id);
  if (!t) { v.innerHTML = `<p>${L('找不到這個單字。', 'Word not found.')}</p>`; return; }
  const u = D.unit(t.unit);
  setCrumbs([[L('教材目錄', 'Course'), '#/course'], [unitTitle(u), `#/unit/${u.id}/learn`], [t.src.en]]);
  await P.recordView(id, t.unit);
  const it = P.item(id);
  const ai = t.ai;
  const list = D.unitTerms(t.unit);
  const k = list.findIndex((x) => x.id === id);
  const prev = list[k - 1], next = list[k + 1];
  v.innerHTML = `
  <div class="card">
    <div class="word-head"><span class="en" lang="en">${esc(t.src.en)}</span>
      <span class="chip">${esc(ai.pos || '')}</span>${lvChip(t.level)}${stChip(id)}</div>
    <p style="font-size:1.25rem;margin:.3rem 0">${esc(t.src.zh)}</p>
    <div class="row" style="margin:.4rem 0">
      <span class="ipa">🇺🇸 ${esc(ai.ipa_us || '—')}</span><button class="btn soft small" data-say="us">🔊 ${L('美式', 'US')}</button>
      <span class="ipa">🇬🇧 ${esc(ai.ipa_uk || '—')}</span><button class="btn soft small" data-say="uk">🔊 ${L('英式', 'UK')}</button>
      <button class="btn soft small" data-rep>🔁 ${L('連播 3 次', 'Repeat ×3')}</button>
    </div>
    <div class="row small"><label for="rate">${L('播放速度', 'Speed')}</label>
      <input id="rate" type="range" min="0.5" max="1.3" step="0.1" value="${S.rate}" style="width:140px"><output id="rate-o">${S.rate}×</output>
      <span class="muted">${L('音節', 'Syllables')}：<span lang="en">${esc(ai.syllables || '—')}</span></span></div>
    <p class="small muted" id="voice-info">${esc(voiceInfo())}</p>
    <div class="row">
      <button class="btn ${it?.fav ? 'on' : 'ghost'} small" data-fav>❤️ ${L('收藏', 'Favourite')}</button>
      <button class="btn ${it?.mark === 'unfamiliar' ? 'on' : 'ghost'} small" data-mark="unfamiliar">🤔 ${L('不熟悉', 'Unfamiliar')}</button>
      <button class="btn ${it?.mark === 'familiar' ? 'on' : 'ghost'} small" data-mark="familiar">😎 ${L('已熟悉', 'Familiar')}</button>
      <a class="btn soft small" href="#/practice/word/${id}">✏️ ${L('練習這個字', 'Practise this')}</a>
    </div>
  </div>
  <div class="grid two" style="margin-top:.9rem">
    <div class="stack">
      <div class="src-box"><b>📄 ${L('PDF 原文', 'PDF original')}</b><br><span lang="en">${esc(t.src.en)}</span>　${esc(t.src.zh)}<br>
        <span class="small">${L('來源', 'Source')}：${esc(t.src.file)}　${L('第', 'p.')} ${t.src.page} ${L('頁', '')}（#${t.src.order}）<a href="${esc(pdfLink(t))}" target="_blank" rel="noopener">${L('開啟', 'open')}</a></span>
        ${(t.src.also || []).map((a) => `<br><span class="small">${L('另見', 'Also on')} ${L('第', 'p.')} ${a.page} ${L('頁', '')}（#${a.order}）：${esc(a.zh)}</span>`).join('')}</div>
      ${t.fix.map((f) => `<div class="fix-box"><b>✎ ${L('疑似錯誤（建議，未覆寫原文）', 'Possible error (suggestion only)')}</b><br>
        ${L('原始', 'Original')}：${esc(f.original)}<br>${L('建議', 'Suggested')}：<b>${esc(f.suggestion)}</b><br><span class="small">${L('原因', 'Reason')}：${esc(f.reason)}</span></div>`).join('')}
      <div class="ai-box"><b>🤖 ${L('AI 補充內容', 'AI supplement')}</b>${ai.confidence === 'medium' ? ` <span class="chip st-weak">${L('把握度中等・待教師確認', 'Medium confidence')}</span>` : ''}
        <p style="margin:.3rem 0">${esc(ai.def_zh || '')}</p>
        <p lang="en" class="small" style="margin:.3rem 0">${esc(ai.def_en || '')}</p>
        <p style="margin:.6rem 0 .2rem"><b>${L('例句', 'Example')}</b> <button class="btn soft small" data-say-ex>🔊</button></p>
        <p lang="en" style="margin:0">${esc(ai.example_en || '')}</p><p class="small muted">${esc(ai.example_zh || '')}</p>
        ${ai.morph?.length ? `<p><b>${L('字根字首字尾', 'Word parts')}</b>：${ai.morph.map((m) => `<span class="chip" lang="en">${esc(m.part)}</span> ${esc(m.meaning)}`).join('　')}</p>` : ''}
        ${ai.related?.length ? `<p><b>${L('相關詞彙', 'Related')}</b>：${ai.related.map((r) => D.term(r)).filter(Boolean).map((r) => `<a href="#/word/${r.id}" lang="en">${esc(r.src.en)}</a>`).join('、')}</p>` : ''}
        ${ai.confusables?.length ? `<p><b>${L('易混淆', 'Confusable')}</b>：</p><ul class="small">${ai.confusables.map((c) => `<li><span lang="en"><b>${esc(c.term)}</b></span>（${esc(c.zh)}）— ${esc(c.note)}</li>`).join('')}</ul>` : ''}
      </div>
    </div>
    <div class="stack">
      <figure class="illus" style="margin:0">${illus(ai.illus)}<figcaption class="small" style="padding:.3rem .5rem;color:#475569">${L('概念示意圖', 'Concept diagram')}：${esc(D.course.illus[ai.illus] || '')}</figcaption></figure>
      <div class="card"><b>📈 ${L('我的學習紀錄', 'My record')}</b>
        <p class="small" style="margin:.3rem 0">${L('觀看', 'Views')} ${it?.views || 0}・${L('聆聽', 'Listens')} ${it?.listens || 0}・${L('練習', 'Answers')} ${it?.practice || 0}・${L('最近正確率', 'Recent accuracy')} ${Math.round(recentAcc(it) * 100)}%</p>
        <p class="small" style="margin:0">${L('熟練度', 'Mastery')} ${masteryScore(it)}/100・${L('下次建議複習', 'Next review')}：${it?.due || L('尚未排程（作答後自動安排）', 'not scheduled yet')}</p></div>
    </div>
  </div>
  <div class="row between" style="margin-top:1rem">
    ${prev ? `<a class="btn ghost" href="#/word/${prev.id}" lang="en">← ${esc(prev.src.en)}</a>` : '<span></span>'}
    ${next ? `<a class="btn" href="#/word/${next.id}" lang="en">${esc(next.src.en)} →</a>` : `<a class="btn" href="#/unit/${u.id}/practice">${L('去練習 ➜', 'Practice ➜')}</a>`}
  </div>`;
  const say = (accent, text = t.src.en) => { speak(text, { accent, rate: parseFloat(v.querySelector('#rate').value) }); P.recordListen(id); };
  v.querySelectorAll('[data-say]').forEach((b) => b.onclick = () => say(b.dataset.say));
  v.querySelector('[data-say-ex]').onclick = () => say(S.accent, ai.example_en);
  v.querySelector('[data-rep]').onclick = async () => {
    for (let n = 0; n < 3; n++) { await speak(t.src.en, { rate: parseFloat(v.querySelector('#rate').value) }); await new Promise((r) => setTimeout(r, 1400)); }
    P.recordListen(id);
  };
  v.querySelector('#rate').oninput = (e) => { v.querySelector('#rate-o').textContent = e.target.value + '×'; };
  v.querySelector('[data-fav]').onclick = async (e) => { const f = await P.toggleFav(id); e.target.classList.toggle('on', f); e.target.classList.toggle('ghost', !f); sfx('click'); };
  v.querySelectorAll('[data-mark]').forEach((b) => b.onclick = async () => {
    const m = await P.setMark(id, b.dataset.mark);
    v.querySelectorAll('[data-mark]').forEach((x) => { x.classList.toggle('on', x.dataset.mark === m); x.classList.toggle('ghost', x.dataset.mark !== m); });
    sfx('click');
  });
  if (!speechOk) v.querySelector('#voice-info').classList.add('fix-box');
}

// ---------- 單字卡 ----------
export function flashPage(v, scope) {
  let list, title;
  if (scope === 'all') { list = D.allTerms(); title = L('全部單字', 'All words'); }
  else if (scope === 'fav') { list = D.allTerms().filter((t) => P.item(t.id)?.fav); title = L('收藏單字', 'Favourites'); }
  else if (scope === 'due') { list = dueList([...P.items.values()]).map((it) => D.term(it.id)).filter(Boolean); title = L('今日待複習', 'Due today'); }
  else if (scope === 'weak') { list = D.allTerms().filter((t) => ['weak'].includes(status(P.item(t.id))) || P.item(t.id)?.mark === 'unfamiliar'); title = L('待加強與不熟悉', 'Needs work'); }
  else { const u = D.unit(scope); list = D.unitTerms(scope); title = unitTitle(u); }
  setCrumbs([[L('單字卡', 'Flashcards')], [title]]);
  if (!list.length) { v.innerHTML = `<h1>🃏 ${esc(title)}</h1><p>${L('這個範圍目前沒有單字。', 'No words in this set yet.')}</p><a class="btn" href="#/flash/all">${L('改看全部單字', 'All words')}</a>`; return; }
  let order = list.slice();
  let i = 0;
  let front = 'en'; // en：英文在正面；zh：中文在正面
  const draw = () => {
    const t = order[i];
    v.innerHTML = `<h1>🃏 ${L('翻轉式單字卡', 'Flashcards')}：${esc(title)}</h1>
    <div class="row between"><span class="muted">${i + 1} / ${order.length}</span>
      <div class="row"><button class="btn soft small" data-shuffle>🔀 ${L('隨機', 'Shuffle')}</button>
      <button class="btn soft small" data-side>⇄ ${front === 'en' ? L('改中文在正面', 'Chinese first') : L('改英文在正面', 'English first')}</button></div></div>
    <div class="flash" id="flash"><div class="flash-inner" tabindex="0" role="button" aria-label="${L('按空白鍵或點擊翻面', 'Press space or click to flip')}">
      <div class="flash-face front">${front === 'en' ? `<div class="big" lang="en">${esc(t.src.en)}</div><div class="ipa" style="color:#e0e7ff">${esc(t.ai.ipa_us || '')}</div>` : `<div class="big">${esc(t.src.zh)}</div>`}<small>${L('點擊翻面', 'Tap to flip')}</small></div>
      <div class="flash-face back">${front === 'en' ? `<div class="big">${esc(t.src.zh)}</div>` : `<div class="big" lang="en">${esc(t.src.en)}</div><div class="ipa">${esc(t.ai.ipa_us || '')}</div>`}
        <div class="illus" style="width:min(260px,70%)">${illus(t.ai.illus)}</div><p class="small" style="margin:0">${esc(t.ai.def_zh || '')}</p></div>
    </div></div>
    <div class="row" style="justify-content:center;margin-top:1rem">
      <button class="btn ghost" data-prev ${i === 0 ? 'disabled' : ''}>← ${L('上一張', 'Prev')}</button>
      <button class="btn soft" data-say>🔊</button>
      <button class="btn orange" data-know="0">🤔 ${L('不熟', 'Unsure')}</button>
      <button class="btn teal" data-know="1">😎 ${L('記得', 'Know it')}</button>
      <button class="btn ghost" data-next ${i === order.length - 1 ? 'disabled' : ''}>${L('下一張', 'Next')} →</button>
    </div>
    <p class="small muted" style="text-align:center">${L('鍵盤：空白鍵翻面、← → 換卡、S 發音。「記得／不熟」只標記熟悉度，不計入答題正確率。', 'Keys: Space flip, ← → move, S speak.')}</p>`;
    const card = v.querySelector('#flash');
    const inner = card.querySelector('.flash-inner');
    const flip = () => { card.classList.toggle('flipped'); sfx('flip'); };
    inner.onclick = flip;
    inner.onkeydown = (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } };
    v.querySelector('[data-prev]').onclick = () => { i--; draw(); };
    v.querySelector('[data-next]').onclick = () => { i++; draw(); };
    v.querySelector('[data-say]').onclick = () => { speak(t.src.en); P.recordListen(t.id); };
    v.querySelector('[data-shuffle]').onclick = () => { order = shuffle(order); i = 0; draw(); };
    v.querySelector('[data-side]').onclick = () => { front = front === 'en' ? 'zh' : 'en'; draw(); };
    v.querySelectorAll('[data-know]').forEach((b) => b.onclick = async () => {
      const it = P.item(t.id);
      const want = b.dataset.know === '1' ? 'familiar' : 'unfamiliar';
      if (it?.mark !== want) await P.setMark(t.id, want);
      if (i < order.length - 1) { i++; draw(); } else { toast(L('這一輪單字卡完成！', 'Deck finished!')); sfx('win'); }
    });
    P.recordView(t.id, t.unit);
    inner.focus({ preventScroll: true });
  };
  const onKey = (e) => {
    if (!v.isConnected || !v.querySelector('#flash')) return removeEventListener('keydown', onKey);
    if (e.key === 'ArrowRight' && i < order.length - 1) { i++; draw(); }
    else if (e.key === 'ArrowLeft' && i > 0) { i--; draw(); }
    else if (e.key.toLowerCase() === 's' && !e.target.matches('input,textarea')) { speak(order[i].src.en); P.recordListen(order[i].id); }
  };
  addEventListener('keydown', onKey);
  draw();
}

export { pct, fmtDate, html };
