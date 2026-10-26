// 共用 UI 工具：語言切換字串、DOM 建立、提示、對話框、隨機
let lang = 'zh';
export const setLang = (l) => { lang = l; document.documentElement.lang = l === 'en' ? 'en' : 'zh-Hant-TW'; };
export const getLang = () => lang;
/** 介面文字：依語言設定回傳中文或英文。專有名詞不經翻譯，直接寫在兩邊。 */
export const L = (zh, en) => (lang === 'en' && en != null ? en : zh);

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** 以 HTML 字串建立元素（字串內的使用者資料一律先 esc） */
export function html(str) {
  const t = document.createElement('template');
  t.innerHTML = str.trim();
  return t.content.childElementCount === 1 ? t.content.firstElementChild : t.content;
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export const sample = (arr, n) => shuffle(arr).slice(0, n);
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function toast(msg, action) {
  // 對話框開啟時，提示放進對話框內才不會被遮住
  const dlg = $('#dlg');
  let box = $('#toasts');
  if (dlg?.open) { box = dlg.querySelector('.toast-box') || dlg.appendChild(html('<div class="toast-box" aria-live="polite"></div>')); }
  const el = html(`<div class="toast" role="status"><span>${esc(msg)}</span></div>`);
  if (action) {
    const b = document.createElement('button');
    b.textContent = action.label;
    b.onclick = () => { action.run(); el.remove(); };
    el.append(b);
  }
  box.append(el);
  setTimeout(() => el.remove(), action ? 12000 : 3200);
}

/** 對話框；buttons: [{label, value, cls}]，回傳 Promise<value> */
export function dialog(title, bodyHtml, buttons = [{ label: L('確定', 'OK'), value: true }]) {
  const dlg = $('#dlg');
  return new Promise((resolve) => {
    dlg.innerHTML = `<form method="dialog"><div class="dlg-body"><h2 id="dlg-title" style="margin-top:0">${esc(title)}</h2>${bodyHtml}</div>
      <div class="dlg-actions">${buttons.map((b, i) => `<button class="btn ${b.cls || ''}" value="${i}">${esc(b.label)}</button>`).join('')}</div></form>`;
    const onClose = () => {
      dlg.removeEventListener('close', onClose);
      const i = dlg.returnValue;
      resolve(i === '' || i == null || buttons[i] == null ? null : buttons[i].value);
    };
    dlg.addEventListener('close', onClose);
    dlg.returnValue = '';
    if (dlg.open) dlg.close();
    dlg.showModal();
  });
}

export const confirmDanger = (title, msg, okLabel) =>
  dialog(title, `<p>${esc(msg)}</p>`, [
    { label: L('取消', 'Cancel'), value: false, cls: 'ghost' },
    { label: okLabel || L('確定執行', 'Confirm'), value: true, cls: 'danger' },
  ]).then((v) => v === true);

export function confetti() {
  if (document.body.classList.contains('reduce-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = html('<div class="confetti" aria-hidden="true"></div>');
  const colors = ['#5146e5', '#0d9488', '#ea580c', '#db2777', '#facc15', '#22c55e'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = Math.random() * 0.5 + 's';
    box.append(p);
  }
  document.body.append(box);
  setTimeout(() => box.remove(), 2400);
}

export const today = (d = new Date()) => {
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};
export const addDays = (dateStr, n) => { const d = new Date(dateStr + 'T00:00:00'); d.setDate(d.getDate() + n); return today(d); };
export const fmtTime = (ms) => {
  const s = Math.round(ms / 1000);
  if (s < 60) return L(`${s} 秒`, `${s}s`);
  const m = Math.floor(s / 60);
  if (m < 60) return L(`${m} 分 ${s % 60} 秒`, `${m}m ${s % 60}s`);
  return L(`${Math.floor(m / 60)} 小時 ${m % 60} 分`, `${Math.floor(m / 60)}h ${m % 60}m`);
};
export const fmtDate = (ts) => {
  const d = new Date(ts);
  return `${today(d)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
export const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

/** 下載文字檔 */
export function download(name, text, type = 'application/json') {
  const blob = new Blob([text], { type: type + ';charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.append(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

/** 讀取使用者選取的檔案 */
export const readFileText = (file) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(r.result);
  r.onerror = () => rej(r.error);
  r.readAsText(file, 'utf-8');
});
