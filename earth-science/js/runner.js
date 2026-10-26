// 答題元件：練習（即時回饋、可重新作答）與測驗（作答後統一檢討）共用
import { esc, L, html, $ } from './ui.js';
import { check, explainHtml, termOf } from './questions.js';
import { speak } from './speech.js';
import { illus } from './illustrations.js';
import { sfx } from './sound.js';
import * as P from './progress.js';

/**
 * @param {HTMLElement} root
 * @param {object[]} qs 題目
 * @param {{mode:'practice'|'quiz', ctxMode:string, start?:number, results?:object[],
 *   onProgress?:(i,results)=>void, onDone:(results)=>void, timeLimit?:number, header?:string}} opt
 */
export function run(root, qs, opt) {
  let i = opt.start || 0;
  const results = opt.results ? opt.results.slice() : [];
  let t0 = 0;
  let deadline = opt.timeLimit ? Date.now() + opt.timeLimit * 1000 : 0;
  if (opt.deadline) deadline = opt.deadline;
  let timer = null;
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    clearInterval(timer);
    document.removeEventListener('keydown', onKey);
    saving.then(() => opt.onDone(results));
  };

  if (deadline) {
    timer = setInterval(() => {
      if (!root.isConnected) { clearInterval(timer); document.removeEventListener('keydown', onKey); return; } // 離開頁面：保留進度不結算
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      const el = $('.timer', root);
      if (el) el.textContent = `⏱ ${left}s`;
      if (left <= 5 && left > 0) sfx('tick');
      if (left <= 0) finish();
    }, 500);
  }

  function onKey(e) {
    if (!root.isConnected) { document.removeEventListener('keydown', onKey); clearInterval(timer); return; }
    if (e.target.matches('input, textarea')) return;
    const n = parseInt(e.key, 10);
    const btns = [...root.querySelectorAll('.opt:not([disabled])')];
    if (n >= 1 && n <= btns.length) { btns[n - 1].click(); e.preventDefault(); }
    else if (e.key === 'Enter') { const nx = root.querySelector('[data-next]'); if (nx) { nx.click(); e.preventDefault(); } }
  }
  document.addEventListener('keydown', onKey);

  function show() {
    if (i >= qs.length) return finish();
    const q = qs[i];
    t0 = Date.now();
    const pctDone = Math.round((i / qs.length) * 100);
    root.innerHTML = `
      <div class="card q-card">
        <div class="qbar"><span>${opt.header ? esc(opt.header) + '　' : ''}${L('第', 'Q')} ${i + 1} / ${qs.length}${L(' 題', '')}</span>
          <div class="progress" role="progressbar" aria-valuenow="${pctDone}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pctDone}%"></i></div>
          ${deadline ? '<span class="timer" aria-live="off"></span>' : ''}</div>
        <p class="muted small" style="margin:0">${esc(q.ask || '')}</p>
        ${q.illus ? `<div class="illus" style="max-width:420px;margin:.4rem auto">${illus(q.illus)}</div>` : ''}
        <div class="q-prompt" id="q-prompt">${q.prompt}</div>
        ${q.sub ? `<p class="muted small">${q.sub}</p>` : ''}
        ${q.audio || q.speak ? `<p><button class="btn soft small" type="button" data-say>🔊 ${L('播放發音', 'Play')}</button>
          <button class="btn soft small" type="button" data-say-slow>🐢 ${L('慢速', 'Slow')}</button></p>` : ''}
        ${q.input ? `<form class="row" data-form autocomplete="off">
            <label class="sr-only" for="spell-in">${L('輸入英文拼字', 'Type the spelling')}</label>
            <input id="spell-in" type="text" lang="en" spellcheck="false" autocapitalize="off" style="flex:1;min-width:200px;font-size:1.2rem">
            <button class="btn" type="submit">${L('送出', 'Submit')}</button></form>
            <p class="small muted">${L('提示', 'Hint')}：<span lang="en" style="letter-spacing:.15em">${esc(q.hint)}</span>（${q.answer.length} ${L('個字元', 'chars')}）</p>`
        : `<div class="options" role="group" aria-labelledby="q-prompt">${q.options.map((o, k) =>
          `<button class="opt" type="button" data-v="${esc(o.id)}" ${q.optLang ? `lang="${q.optLang}"` : ''}><span class="key" aria-hidden="true">${k + 1}</span><span>${esc(o.label)}</span></button>`).join('')}</div>`}
        <div data-fb aria-live="polite"></div>
      </div>`;
    const say = (rate) => { speak(q.audio || q.speak, rate ? { rate } : {}); P.recordListen(q.id); };
    root.querySelector('[data-say]')?.addEventListener('click', () => say());
    root.querySelector('[data-say-slow]')?.addEventListener('click', () => say(0.6));
    if (q.audio && q.type !== 'en2zh') setTimeout(() => say(), 250);
    if (q.input) {
      const inp = $('#spell-in', root);
      inp.focus();
      root.querySelector('[data-form]').addEventListener('submit', (e) => { e.preventDefault(); if (inp.value.trim()) answer(inp.value); });
    } else {
      root.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => answer(b.dataset.v, b)));
      root.querySelector('.opt')?.focus({ preventScroll: true });
    }
  }

  let retrying = false;
  let saving = Promise.resolve();
  async function answer(value, btn) {
    const q = qs[i];
    const ms = Date.now() - t0;
    const ok = check(q, value);
    const t = termOf(q);
    if (!retrying) {
      results.push({ id: q.id, type: q.type, unit: q.unit, ok, ms, value });
      // 先給即時回饋，紀錄在背景寫入（依序排隊，不會互相覆蓋）
      saving = saving.then(() => P.recordAnswer(q.id, ok, { mode: opt.ctxMode, qtype: q.type, ms, unit: q.unit })).catch(console.error);
      opt.onProgress?.(i + 1, results);
    }
    sfx(ok ? 'ok' : 'no');
    if (opt.mode === 'quiz') { i++; retrying = false; show(); return; }

    // 練習：即時回饋
    root.querySelectorAll('.opt').forEach((b) => {
      b.disabled = true;
      if (b.dataset.v === q.answer) b.classList.add('correct');
    });
    if (btn && !ok) btn.classList.add('wrong');
    const inp = $('#spell-in', root);
    if (inp) inp.disabled = true;
    const chosen = q.type === 'tf' || q.input ? null : termOf({ id: value });
    const fb = root.querySelector('[data-fb]');
    fb.innerHTML = `<div class="feedback ${ok ? 'ok' : 'no'}">
      <h3>${ok ? L('✔ 答對了！', '✔ Correct!') : L('✘ 再想想', '✘ Not quite')}</h3>
      ${q.input && !ok ? `<p>${L('你的拼字', 'You typed')}：<b lang="en">${esc(value)}</b>　${L('正確', 'Answer')}：<b lang="en">${esc(q.answer)}</b></p>` : ''}
      ${q.note ? `<p>${q.note}</p>` : ''}
      ${explainHtml(t, chosen)}
      <div class="row">
        ${!ok ? `<button class="btn ghost" type="button" data-retry>↺ ${L('重新作答', 'Try again')}</button>` : ''}
        <button class="btn" type="button" data-next>${i + 1 < qs.length ? L('下一題 ➜', 'Next ➜') : L('看結果', 'See results')}</button>
      </div></div>`;
    fb.querySelector('[data-next]').addEventListener('click', () => { i++; retrying = false; show(); });
    fb.querySelector('[data-next]').focus({ preventScroll: true });
    fb.querySelector('[data-retry]')?.addEventListener('click', () => { retrying = true; const keep = i; show(); i = keep; });
  }

  show();
  return { stop: () => { finished = true; clearInterval(timer); document.removeEventListener('keydown', onKey); } };
}

/** 結果檢討清單（測驗結束與練習結束共用） */
export function reviewList(results, qs) {
  return `<div class="table-wrap"><table><thead><tr><th>#</th><th>${L('題目單字', 'Term')}</th><th>${L('結果', 'Result')}</th><th>${L('解說', 'Explanation')}</th></tr></thead><tbody>
    ${results.map((r, k) => {
      const t = termOf(r);
      const q = qs?.find((x) => x.id === r.id && x.type === r.type);
      return `<tr><td>${k + 1}</td><td lang="en"><b>${esc(t.src.en)}</b></td>
        <td>${r.ok ? `<span class="chip st-mastered">✔ ${L('正確', 'Correct')}</span>` : `<span class="chip st-weak">✘ ${L('錯誤', 'Wrong')}</span>`}</td>
        <td class="small">${esc(t.zhQ)}${q?.note ? '｜' + q.note : ''}${t.ai.def_zh ? '｜' + esc(t.ai.def_zh) : ''}</td></tr>`;
    }).join('')}</tbody></table></div>`;
}

export { html };
