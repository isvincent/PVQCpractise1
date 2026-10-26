// 資料匯入與匯出：JSON 完整備份／還原（覆蓋或合併）、CSV 學習歷程、清除與重設
import * as D from './data.js';
import * as P from './progress.js';
import * as db from './store.js';
import { status, masteryScore } from './review.js';
import { esc, L, toast, download, readFileText, confirmDanger, dialog, fmtDate, today } from './ui.js';
import { reset as resetSettings } from './settings.js';
import { setCrumbs, go } from './app.js';
import { quizCsv } from './quiz.js';

export const APP_ID = 'chemistry-english-pwa';
export const APP_VERSION = '1.0.0';

export async function exportJson() {
  const data = await db.dumpAll();
  delete data.overrides; // 教師編輯內容另由教師工具匯出
  const profile = await db.getMeta('profile', {});
  return { app: APP_ID, appVersion: APP_VERSION, schema: db.DATA_SCHEMA, material: D.course.materialId, materialVersion: D.course.version,
    exportedAt: new Date().toISOString(), profile, data };
}

/** 驗證備份檔；回傳錯誤訊息陣列（空陣列＝通過） */
export function validate(obj) {
  const err = [];
  if (!obj || typeof obj !== 'object') return [L('不是有效的 JSON 物件', 'Not a JSON object')];
  if (obj.app !== APP_ID) err.push(L('這不是本 App 匯出的檔案（app 欄位不符）', 'Not exported by this app'));
  if (typeof obj.schema !== 'number') err.push(L('缺少資料版本 schema', 'Missing schema version'));
  else if (obj.schema > db.DATA_SCHEMA) err.push(L(`資料版本 ${obj.schema} 比 App 支援的 ${db.DATA_SCHEMA} 新，請先更新 App`, `Data schema ${obj.schema} is newer than supported ${db.DATA_SCHEMA}`));
  if (!obj.data || typeof obj.data !== 'object') err.push(L('缺少 data 區塊', 'Missing data block'));
  else {
    for (const k of Object.keys(obj.data)) if (!(k in db.STORES)) err.push(L(`未知的資料表：${k}`, `Unknown table: ${k}`));
    for (const [k, arr] of Object.entries(obj.data)) if (!Array.isArray(arr)) err.push(L(`資料表 ${k} 格式錯誤`, `Table ${k} malformed`));
    for (const it of obj.data.items || []) if (typeof it.id !== 'string' || typeof it.correct !== 'number') { err.push(L('單字紀錄格式錯誤', 'Item record malformed')); break; }
  }
  if (obj.material && D.course && obj.material !== D.course.materialId) err.push(L(`教材不同（檔案：${obj.material}）`, `Different material (${obj.material})`));
  return err;
}

/** 將舊版資料升級到目前版本（目前只有 schema 1，保留擴充點） */
function migrate(obj) {
  // if (obj.schema === 1) { ...轉換...; obj.schema = 2; }
  return obj;
}

export async function importData(obj, mode) {
  obj = migrate(obj);
  const d = obj.data;
  if (mode === 'overwrite') {
    await db.clearAll(Object.keys(db.STORES).filter((s) => s !== 'overrides'));
    for (const [k, arr] of Object.entries(d)) if (k !== 'overrides') await db.putMany(k, arr.map((x) => { if (db.STORES[k] === '++') delete x.k; return x; }).map((x) => x));
    // autoIncrement 資料表重新編號
  } else {
    const cur = await db.dumpAll();
    const byKey = (arr, key) => new Map(arr.map((x) => [x[key], x]));
    // items：保留最近作答的一筆；收藏、標記取聯集
    const ci = byKey(cur.items, 'id');
    for (const it of d.items || []) {
      const c = ci.get(it.id);
      const win = !c || (it.lastTs || 0) > (c.lastTs || 0) ? it : c;
      await db.put('items', { ...win, fav: !!(it.fav || c?.fav), views: Math.max(it.views || 0, c?.views || 0), listens: Math.max(it.listens || 0, c?.listens || 0) });
    }
    // 流水帳類：以時間戳＋類型去重後附加
    for (const k of ['events', 'quizzes', 'reflections']) {
      const seen = new Set(cur[k].map((x) => `${x.ts}|${x.type || ''}|${x.id || x.unit || ''}`));
      for (const x of d[k] || []) { const key = `${x.ts}|${x.type || ''}|${x.id || x.unit || ''}`; if (!seen.has(key)) { const y = { ...x }; delete y.k; await db.add(k, y); } }
    }
    const cw = byKey(cur.wrongbook, 'id');
    for (const w of d.wrongbook || []) { const c = cw.get(w.id); await db.put('wrongbook', !c || w.count > c.count ? w : c); }
    const cg = byKey(cur.goals, 'unit');
    for (const g of d.goals || []) { const c = cg.get(g.unit); if (!c || (g.ts || 0) > (c.ts || 0)) await db.put('goals', g); }
    const cd = byKey(cur.daily, 'date');
    for (const x of d.daily || []) { const c = cd.get(x.date); await db.put('daily', { date: x.date, ms: Math.max(x.ms, c?.ms || 0) }); }
    const cu = byKey(cur.units, 'unit');
    for (const u of d.units || []) { const c = cu.get(u.unit) || { stages: {} }; await db.put('units', { ...c, ...u, stages: { ...c.stages, ...u.stages } }); }
    const cm = byKey(cur.meta, 'key');
    for (const m of d.meta || []) {
      if (m.key === 'gami') { const c = cm.get('gami')?.value || { xp: 0, badges: {} }; await db.put('meta', { key: 'gami', value: { ...c, ...m.value, xp: Math.max(c.xp || 0, m.value.xp || 0), games: Math.max(c.games || 0, m.value.games || 0), badges: { ...m.value.badges, ...c.badges } } }); }
      else if (!cm.has(m.key)) await db.put('meta', m);
    }
  }
  await P.reloadAll();
}

export function historyCsv() {
  const rows = [['英文', '中文(原文)', '單元', '難度', 'PDF頁碼', '狀態', '熟練度', '觀看', '聆聽', '作答', '答對', '答錯', '連對', '下次複習', '收藏', '標記']];
  for (const t of D.allTerms()) {
    const it = P.item(t.id) || {};
    rows.push([t.src.en, t.src.zh, D.unit(t.unit).title, t.level, t.src.page, status(P.item(t.id)), masteryScore(P.item(t.id)), it.views || 0, it.listens || 0,
      (it.correct || 0) + (it.wrong || 0), it.correct || 0, it.wrong || 0, it.streak || 0, it.due || '', it.fav ? 'Y' : '', it.mark || '']);
  }
  return '﻿' + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
}

export async function dataPage(v) {
  setCrumbs([[L('資料備份與設定', 'Backup & data')]]);
  const profile = await db.getMeta('profile', {});
  let est = '';
  try { const e = await navigator.storage?.estimate(); if (e) est = `${(e.usage / 1024 / 1024).toFixed(2)} MB / ${(e.quota / 1024 / 1024 / 1024).toFixed(1)} GB`; } catch { /* 忽略 */ }
  const persisted = await navigator.storage?.persisted?.().catch(() => false);
  v.innerHTML = `<h1>💾 ${L('學習資料備份、還原與轉移', 'Backup, restore & transfer')}</h1>
  <div class="fix-box"><b>⚠️ ${L('重要提醒', 'Important')}</b><p style="margin:.3rem 0">${L('本 App 不需要登入，所有學習紀錄只存在「這台裝置的這個瀏覽器」。清除瀏覽器網站資料、使用無痕模式、或更換裝置／瀏覽器時，紀錄可能消失。請定期下載 JSON 備份；換裝置時用「匯入」還原。', 'No login: records live only in this browser. Clearing site data, private browsing or switching devices can lose them. Download a JSON backup regularly.')}</p>
    <p class="small" style="margin:0">${db.persistent ? `IndexedDB ✔　${est}　${persisted ? L('（瀏覽器已允許持久儲存）', '(persistent storage granted)') : L('（瀏覽器可能在空間不足時清除）', '(may be evicted when space is low)')}` : L('⚠️ 此瀏覽器無法使用 IndexedDB（可能是無痕模式），關閉頁面後紀錄會消失！', '⚠️ IndexedDB unavailable — records will be lost when you close the page!')}</p></div>
  <form class="card" id="pf" style="margin-top:.9rem"><h2 style="margin-top:0">👤 ${L('學生資料（選填，只寫入匯出檔，供老師辨識）', 'Student info (optional, only included in exports)')}</h2>
    <div class="row"><label>${L('姓名或代號', 'Name / alias')} <input type="text" name="name" value="${esc(profile.name || '')}"></label>
    <label>${L('班級', 'Class')} <input type="text" name="cls" value="${esc(profile.cls || '')}" style="width:110px"></label>
    <label>${L('座號', 'No.')} <input type="text" name="seat" value="${esc(profile.seat || '')}" style="width:80px"></label>
    <button class="btn small">${L('儲存', 'Save')}</button></div></form>
  <div class="grid two" style="margin-top:.9rem">
    <div class="card"><h2 style="margin-top:0">⬇️ ${L('匯出', 'Export')}</h2>
      <div class="stack"><button class="btn block" data-json>${L('完整備份（JSON，可還原）', 'Full backup (JSON)')}</button>
      <button class="btn teal block" data-csv>${L('學習歷程（CSV，Excel 可開）', 'Learning history (CSV)')}</button>
      <button class="btn soft block" data-qcsv>${L('測驗成績（CSV）', 'Quiz results (CSV)')}</button></div></div>
    <div class="card"><h2 style="margin-top:0">⬆️ ${L('匯入／還原', 'Import / restore')}</h2>
      <label class="field" for="imp">${L('選擇 JSON 備份檔', 'Choose a JSON backup')}</label><input id="imp" type="file" accept=".json,application/json">
      <p class="small muted">${L('匯入前會先檢查格式與資料版本，並讓你選擇「合併」或「覆蓋」。', 'The file is validated first; then choose merge or overwrite.')}</p></div>
    <div class="card"><h2 style="margin-top:0">🧹 ${L('清除與重設', 'Clear & reset')}</h2><div class="stack">
      <button class="btn ghost block" data-reset-prog>${L('重設學習進度（保留測驗與反思）', 'Reset progress (keep quizzes & reflections)')}</button>
      <button class="btn danger block" data-clear>${L('清除全部個人紀錄', 'Delete all my records')}</button>
      <button class="btn soft block" data-defaults>${L('恢復預設設定', 'Restore default settings')}</button></div></div>
  </div>`;
  v.querySelector('#pf').onsubmit = async (e) => { e.preventDefault(); const fd = new FormData(e.target); await db.setMeta('profile', { name: fd.get('name'), cls: fd.get('cls'), seat: fd.get('seat') }); toast(L('已儲存', 'Saved')); };
  const stamp = () => today().replace(/-/g, '');
  v.querySelector('[data-json]').onclick = async () => { const o = await exportJson(); download(`化學英文學習備份_${o.profile?.name || ''}_${stamp()}.json`, JSON.stringify(o)); await db.setMeta('lastBackup', Date.now()); toast(L('已下載備份檔', 'Backup downloaded')); };
  v.querySelector('[data-csv]').onclick = () => download(`學習歷程_${stamp()}.csv`, historyCsv(), 'text/csv');
  v.querySelector('[data-qcsv]').onclick = async () => download(`測驗成績_${stamp()}.csv`, quizCsv(await db.all('quizzes')), 'text/csv');
  v.querySelector('#imp').onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    let obj;
    try { obj = JSON.parse(await readFileText(f)); } catch { e.target.value = ''; return dialog(L('無法匯入', 'Import failed'), `<p>${L('檔案不是有效的 JSON。', 'Not valid JSON.')}</p>`); }
    const errs = validate(obj);
    if (errs.length) { e.target.value = ''; return dialog(L('無法匯入', 'Import failed'), `<ul>${errs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`); }
    const n = obj.data.items?.length || 0, q = obj.data.quizzes?.length || 0;
    const mode = await dialog(L('選擇匯入方式', 'Import mode'), `<p>${L('檔案', 'File')}：${esc(f.name)}<br>${L('匯出時間', 'Exported')}：${esc(fmtDate(obj.exportedAt))}${obj.profile?.name ? '<br>' + L('學生', 'Student') + '：' + esc(obj.profile.name) : ''}<br>${L('單字紀錄', 'Words')} ${n}・${L('測驗', 'Quizzes')} ${q}・${L('資料版本', 'Schema')} ${obj.schema}</p>
      <p><b>${L('合併', 'Merge')}</b>：${L('保留目前紀錄，加入檔案中較新的資料（建議）。', 'Keep current data and add newer data (recommended).')}<br><b>${L('覆蓋', 'Overwrite')}</b>：${L('刪除目前所有紀錄，完全改用檔案內容。', 'Replace everything with the file.')}</p>`,
      [{ label: L('取消', 'Cancel'), value: null, cls: 'ghost' }, { label: L('覆蓋', 'Overwrite'), value: 'overwrite', cls: 'danger' }, { label: L('合併', 'Merge'), value: 'merge' }]);
    e.target.value = '';
    if (!mode) return;
    if (mode === 'overwrite' && !(await confirmDanger(L('確定覆蓋？', 'Really overwrite?'), L('目前裝置上的所有學習紀錄會被刪除並以檔案取代，無法復原。建議先匯出備份。', 'All current records will be replaced. This cannot be undone.')))) return;
    await importData(obj, mode);
    toast(L('匯入完成', 'Import complete'));
    go('#/dashboard');
  };
  v.querySelector('[data-reset-prog]').onclick = async () => {
    if (!(await confirmDanger(L('重設學習進度？', 'Reset progress?'), L('單字熟練度、錯題本、複習排程、單元進度、經驗值會清空；測驗紀錄與反思會保留。', 'Mastery, wrong-answer book, schedule, unit progress and XP will be cleared.')))) return;
    await db.clearAll(['items', 'wrongbook', 'units']);
    await db.setMeta('gami', { xp: 0, badges: {}, games: 0, quizPass: 0 });
    await P.reloadAll(); toast(L('已重設學習進度', 'Progress reset'));
  };
  v.querySelector('[data-clear]').onclick = async () => {
    if (!(await confirmDanger(L('清除全部個人紀錄？', 'Delete all records?'), L('所有學習紀錄、測驗、反思、目標都會刪除且無法復原。建議先匯出備份。', 'Everything will be deleted permanently. Export a backup first.')))) return;
    if (!(await confirmDanger(L('再次確認', 'Confirm again'), L('真的要刪除全部紀錄嗎？', 'Really delete everything?'), L('全部刪除', 'Delete all')))) return;
    await db.clearAll(Object.keys(db.STORES).filter((s) => s !== 'overrides'));
    await P.reloadAll(); toast(L('已清除全部紀錄', 'All records deleted')); go('#/');
  };
  v.querySelector('[data-defaults]').onclick = async () => { if (await confirmDanger(L('恢復預設設定？', 'Restore defaults?'), L('七大顯示設定、發音與測驗門檻會回到預設值，學習紀錄不受影響。', 'Display, speech and quiz thresholds go back to defaults. Records are kept.'), L('恢復預設', 'Restore'))) { resetSettings(); toast(L('已恢復預設設定', 'Defaults restored')); } };
}
