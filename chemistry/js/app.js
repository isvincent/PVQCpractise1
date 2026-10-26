// App 進入點：路由、主選單、麵包屑、設定與搜尋
import * as db from './store.js';
import * as D from './data.js';
import * as P from './progress.js';
import * as Settings from './settings.js';
import * as PWA from './pwa.js';
import { L, esc, $, toast, dialog } from './ui.js';
import * as V from './vocab.js';
import { unitPage } from './unit.js';
import { practiceHub, practiceRun } from './practice.js';
import { quizHub } from './quiz.js';
import { gamesHub } from './games.js';
import { dashboard, reviewPage, aboutPage } from './dashboard.js';
import { dataPage } from './io.js';
import { teacherPage } from './teacher.js';
import { mindMap } from './concepts.js';
import { stop as stopSpeech } from './speech.js';

const view = () => $('#view');

const NAV = () => [
  ['#/', '🏠', L('首頁', 'Home'), true],
  ['#/course', '🗂️', L('教材目錄', 'Course'), true],
  ['#/review', '🔁', L('智慧複習', 'Review'), true],
  ['#/practice', '✏️', L('練習', 'Practice')],
  ['#/quiz', '📝', L('測驗', 'Quizzes')],
  ['#/games', '🎮', L('遊戲', 'Games'), true],
  ['#/dashboard', '📊', L('儀表板', 'Dashboard')],
  ['#/map', '🕸️', L('心智圖', 'Mind map')],
  ['#/pdf', '📄', L('PDF 原始順序', 'PDF order')],
  ['#/materials', '📚', L('教材清單', 'Materials')],
  ['#/data', '💾', L('資料備份', 'Backup')],
  ['#/teacher', '👩‍🏫', L('教師模式', 'Teacher')],
  ['#/about', 'ℹ️', L('說明', 'About')],
];

function renderNav() {
  const cur = '#/' + (location.hash.slice(2).split('/')[0] || '');
  const isCur = (h) => (h === '#/' ? cur === '#/' : cur === h);
  $('#side-nav').innerHTML = NAV().map(([h, i, t]) => `<a href="${h}" ${isCur(h) ? 'aria-current="page"' : ''}><span class="ico" aria-hidden="true">${i}</span>${esc(t)}</a>`).join('') +
    `<a href="#" id="nav-install" hidden><span class="ico">📲</span>${L('安裝 App', 'Install app')}</a>`;
  $('#tab-nav').innerHTML = NAV().filter((x) => x[3]).map(([h, i, t]) => `<a href="${h}" ${isCur(h) ? 'aria-current="page"' : ''}><span class="ico" aria-hidden="true">${i}</span>${esc(t)}</a>`).join('') +
    `<a href="#" id="tab-more" aria-haspopup="dialog"><span class="ico" aria-hidden="true">☰</span>${L('更多', 'More')}</a>`;
  $('#tab-more').onclick = (e) => {
    e.preventDefault();
    dialog(L('全部功能', 'All features'), `<nav class="grid tight" aria-label="${L('全部功能', 'All features')}">${NAV().map(([h, i, t]) => `<a class="btn soft" href="${h}" onclick="document.getElementById('dlg').close()">${i} ${esc(t)}</a>`).join('')}</nav>`, [{ label: L('關閉', 'Close'), value: null, cls: 'ghost' }]);
  };
  const inst = $('#nav-install');
  inst.hidden = false;
  inst.onclick = async (e) => {
    e.preventDefault();
    if (PWA.canInstall()) { await PWA.install(); return; }
    dialog(L('安裝 App', 'Install app'), PWA.installHelp());
  };
  $('#brand-title').textContent = L('化學專業英文', 'Chemistry English');
  $('#search-input').placeholder = L('搜尋單字、中文、例句…', 'Search words…');
  $('#search-label').textContent = L('全文搜尋', 'Search');
  $('#skip-link').textContent = L('跳到主要內容', 'Skip to content');
  $('#btn-settings').setAttribute('aria-label', L('顯示與操作設定', 'Settings'));
  $('#btn-search-m').setAttribute('aria-label', L('搜尋', 'Search'));
  $('#footer').innerHTML = `${L('教材來源', 'Source')}：${esc(D.course?.material.file || '')}・${L('學習紀錄只存在本機', 'Records stay on this device')}・<a href="#/about">${L('說明', 'About')}</a>`;
}

/** 麵包屑：[[文字, 連結?], ...] */
export function setCrumbs(list) {
  const el = $('#crumbs');
  el.setAttribute('aria-label', L('麵包屑', 'Breadcrumb'));
  if (!list.length) { el.innerHTML = ''; return; }
  el.innerHTML = `<button class="btn ghost small back" type="button" onclick="history.length>1?history.back():location.hash='#/'">← ${L('返回', 'Back')}</button>
    <a href="#/">${L('首頁', 'Home')}</a>` + list.map(([t, h], i) => ` › ${h && i < list.length - 1 ? `<a href="${h}">${esc(t)}</a>` : `<span ${i === list.length - 1 ? 'aria-current="page"' : ''}>${esc(t)}</span>`}`).join('');
}

export function go(hash, replace) {
  if (replace) { history.replaceState(null, '', hash); route(); }
  else if (location.hash === hash) route();
  else location.hash = hash;
}

async function route() {
  stopSpeech();
  document.body.classList.remove('projector');
  const parts = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  const [p0, p1, p2, p3] = parts;
  // 每次換頁使用新的容器：較慢完成的舊頁面只會寫進已移除的舊容器，不會蓋掉新頁面
  const v = document.createElement('div');
  view().replaceChildren(v);
  scrollTo(0, 0);
  renderNav();
  try {
    switch (p0) {
      case '': case undefined: await V.home(v); break;
      case 'materials': V.materialsPage(v); break;
      case 'course': V.coursePage(v); break;
      case 'pdf': V.pdfPage(v); break;
      case 'map': mindMap(v, p1); break;
      case 'search': V.searchPage(v, p1 || ''); break;
      case 'word': await V.wordPage(v, p1); break;
      case 'flash': V.flashPage(v, p1 || 'all'); break;
      case 'unit': await unitPage(v, p1, p2); break;
      case 'practice': if (p1 && p2) await practiceRun(v, p1, p2, p3); else practiceHub(v, p1); break;
      case 'quiz': await quizHub(v, p1, p2); break;
      case 'games': await gamesHub(v, p1); break;
      case 'review': await reviewPage(v); break;
      case 'dashboard': await dashboard(v); break;
      case 'data': await dataPage(v); break;
      case 'teacher': teacherPage(v, p1, p2); break;
      case 'about': aboutPage(v); break;
      default: v.innerHTML = `<p>${L('找不到頁面', 'Page not found')}</p><a class="btn" href="#/">${L('回首頁', 'Home')}</a>`;
    }
  } catch (e) {
    console.error(e);
    v.innerHTML = `<div class="card fix-box"><b>${L('頁面發生錯誤', 'Something went wrong')}</b><p class="small">${esc(e.message)}</p><a class="btn" href="#/">${L('回首頁', 'Home')}</a></div>`;
  }
  if (!v.isConnected) return;
  if (!v.contains(document.activeElement)) view().focus({ preventScroll: true });
}

async function boot() {
  Settings.load();
  await db.open();
  try {
    await D.loadMaterials();
    await D.loadCourse();
  } catch (e) {
    view().innerHTML = `<div class="card fix-box"><b>${L('教材載入失敗', 'Failed to load material')}</b><p>${esc(e.message)}</p><p class="small">${L('若直接以檔案方式開啟（file://），瀏覽器會阻擋讀取 JSON，請用本機伺服器開啟，見 README。', 'Opening via file:// blocks JSON loading; use a local server (see README).')}</p></div>`;
    return;
  }
  await P.init();
  await P.summary(D.allTerms().length);
  Settings.onChange((k, val, prevLang) => {
    if (k === 'lang' || k === '*' || (k === 'teacher')) { renderNav(); route(); }
  });
  matchMedia('(prefers-reduced-motion: reduce)').matches && document.body.classList.add('reduce-motion');
  $('#btn-settings').onclick = () => Settings.openPanel();
  $('#search-form').onsubmit = (e) => { e.preventDefault(); const q = $('#search-input').value.trim(); if (q) go('#/search/' + encodeURIComponent(q)); };
  $('#btn-search-m').onclick = () => go('#/search/');
  addEventListener('hashchange', route);
  PWA.init();
  if (!db.persistent) toast(L('⚠️ 此瀏覽器無法長期儲存（可能是無痕模式），關閉後紀錄會消失。', '⚠️ Storage unavailable (private mode?) — records will be lost.'));
  const last = await db.getMeta('lastBackup', 0);
  if (P.items.size > 30 && Date.now() - last > 7 * 86400000) setTimeout(() => toast(last ? L('已經一週沒有備份學習紀錄了', 'No backup for a week') : L('建議定期備份學習紀錄', 'Remember to back up your progress'), { label: L('去備份', 'Back up'), run: () => go('#/data') }), 4000);
  route();
}

boot();
