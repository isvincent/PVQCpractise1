// 顯示與操作設定：七大切換＋發音、測驗門檻。輕量偏好存在 localStorage。
import { L, setLang, toast, dialog, $, esc } from './ui.js';
import { sfx } from './sound.js';

const KEY = 'chemapp.settings.v1';
export const DEFAULTS = {
  fullscreen: false, // 1 全螢幕
  sound: true,       // 2 音效
  device: 'auto',    // 3 裝置預覽：auto / mobile / tablet / desktop
  layout: 'auto',    // 4 版面：auto / portrait / landscape
  lang: 'zh',        // 5 語言：zh / en
  font: 'm',         // 6 字體：s / m / l
  theme: 'system',   // 7 色系：system / light / dark
  accent: 'us',      // 發音：us / uk
  rate: 0.9,         // 發音速度
  passScore: 60,     // 及格標準
  masteryScore: 80,  // 精熟門檻
  teacher: false,    // 教師模式（僅前端切換，不是身分驗證）
};
export let S = { ...DEFAULTS };
const listeners = new Set();
export const onChange = (fn) => listeners.add(fn);

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) S = { ...DEFAULTS, ...JSON.parse(raw), fullscreen: false };
  } catch { /* 無痕模式或封鎖儲存時使用預設 */ }
  apply();
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* 忽略 */ }
}

export function set(key, value) {
  const prevLang = S.lang;
  S[key] = value;
  save();
  apply();
  listeners.forEach((fn) => fn(key, value, prevLang));
}

export function reset() {
  const keepTeacher = S.teacher;
  S = { ...DEFAULTS, teacher: keepTeacher };
  save();
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  apply();
  listeners.forEach((fn) => fn('*'));
}

const sysDark = matchMedia('(prefers-color-scheme: dark)');
sysDark.addEventListener?.('change', () => S.theme === 'system' && apply());

export function apply() {
  const root = document.documentElement;
  const b = document.body;
  // 7 色系
  const dark = S.theme === 'dark' || (S.theme === 'system' && sysDark.matches);
  root.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#12142a' : '#0f766e');
  // 6 字體
  root.style.setProperty('--fs', { s: '15px', m: '17px', l: '20px' }[S.font] || '17px');
  // 5 語言
  setLang(S.lang);
  // 3 裝置預覽（只改版型寬度，不改變實際裝置）
  b.dataset.device = S.device;
  const badge = $('#device-badge');
  if (badge) badge.textContent = S.device === 'auto' ? '' :
    L(`版型預覽：${{ mobile: '手機 390px', tablet: '平板 820px', desktop: '電腦 1280px' }[S.device]}（不會改變實際裝置）`,
      `Layout preview: ${{ mobile: 'phone 390px', tablet: 'tablet 820px', desktop: 'desktop 1280px' }[S.device]} (your real device is unchanged)`);
  // 4 版面
  b.dataset.layout = S.layout;
  b.classList.toggle('teacher', !!S.teacher);
}

// 1 全螢幕：處理不支援與被拒絕
export async function toggleFullscreen(want) {
  const el = document.documentElement;
  const req = el.requestFullscreen || el.webkitRequestFullscreen;
  if (want) {
    if (!req) { toast(L('此瀏覽器不支援全螢幕（iPhone Safari 可改用「加入主畫面」以 App 模式開啟）', 'Fullscreen is not supported in this browser.')); S.fullscreen = false; return false; }
    try {
      // 部分內嵌環境會讓請求一直懸置，3 秒未完成視同被拒絕
      await Promise.race([req.call(el), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))]);
      S.fullscreen = true; return true;
    }
    catch { toast(L('全螢幕請求被拒絕或需要由按鈕觸發，請再按一次。', 'Fullscreen request was denied.')); S.fullscreen = false; return false; }
  } else {
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (document.fullscreenElement && exit) await exit.call(document).catch(() => {});
    S.fullscreen = false;
    return true;
  }
}
document.addEventListener('fullscreenchange', () => { S.fullscreen = !!document.fullscreenElement; });

// 4 版面：嘗試鎖定螢幕方向（多數桌機瀏覽器不支援，失敗時只改版面不強制旋轉）
async function tryOrientation(v) {
  const o = screen.orientation;
  if (v === 'auto') { try { o?.unlock?.(); } catch { /* 忽略 */ } return; }
  if (!o?.lock) return;
  try { await o.lock(v === 'portrait' ? 'portrait' : 'landscape'); }
  catch { /* 需全螢幕或不支援，僅調整版面 */ }
}

const OPTS = () => [
  ['fullscreen', L('全螢幕', 'Fullscreen'), [[true, L('開啟', 'On')], [false, L('關閉', 'Off')]]],
  ['sound', L('音效', 'Sound effects'), [[true, L('開啟', 'On')], [false, L('關閉', 'Off')]]],
  ['device', L('裝置', 'Device'), [['auto', L('自動', 'Auto')], ['mobile', L('手機', 'Phone')], ['tablet', L('平板', 'Tablet')], ['desktop', L('電腦', 'Desktop')]]],
  ['layout', L('版面', 'Layout'), [['auto', L('自動', 'Auto')], ['portrait', L('直式', 'Portrait')], ['landscape', L('橫式', 'Landscape')]]],
  ['lang', L('語言', 'Language'), [['zh', '繁體中文'], ['en', 'English']]],
  ['font', L('字體', 'Font size'), [['s', L('縮小', 'Small')], ['m', L('標準', 'Standard')], ['l', L('放大', 'Large')]]],
  ['theme', L('色系', 'Theme'), [['system', L('跟隨系統', 'System')], ['light', L('亮色', 'Light')], ['dark', L('暗色', 'Dark')]]],
  ['accent', L('發音腔調', 'Accent'), [['us', L('美式', 'US')], ['uk', L('英式', 'UK')]]],
  ['rate', L('發音速度', 'Speech rate'), [[0.6, '0.6×'], [0.8, '0.8×'], [0.9, '0.9×'], [1, '1.0×'], [1.2, '1.2×']]],
];

export function openPanel() {
  const body = OPTS().map(([k, label, opts]) => `
    <div class="set-row" role="group" aria-label="${esc(label)}"><b>${esc(label)}</b>
      <span class="seg">${opts.map(([v, t]) => `<button type="button" data-k="${k}" data-v='${JSON.stringify(v)}' aria-pressed="${S[k] === v}">${esc(t)}</button>`).join('')}</span>
    </div>`).join('') +
    `<p class="small muted" style="margin-top:.8rem">${L('裝置切換是「版型預覽」，不會改變你實際使用的裝置；版面切換若瀏覽器不支援螢幕方向鎖定，只會調整網頁排列。', 'Device switch is a layout preview only. Layout switch rearranges the page; it cannot rotate your device if the browser does not support orientation lock.')}</p>`;
  const p = dialog(L('顯示與操作設定', 'Display settings'), body, [
    { label: L('恢復預設設定', 'Restore defaults'), value: 'reset', cls: 'ghost' },
    { label: L('完成', 'Done'), value: 'ok' },
  ]);
  const dlg = $('#dlg');
  dlg.querySelectorAll('.seg button').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const k = btn.dataset.k;
      const v = JSON.parse(btn.dataset.v);
      if (k === 'fullscreen') await toggleFullscreen(v);
      else if (k === 'layout') { set(k, v); tryOrientation(v); }
      else set(k, v);
      if (k === 'sound' && v) sfx('ok');
      dlg.querySelectorAll(`.seg button[data-k="${k}"]`).forEach((b) => b.setAttribute('aria-pressed', JSON.stringify(S[k]) === b.dataset.v));
      if (k === 'lang') { dlg.close(); openPanel(); }
    });
  });
  p.then((v) => { if (v === 'reset') { reset(); toast(L('已恢復預設設定', 'Defaults restored')); } });
}
