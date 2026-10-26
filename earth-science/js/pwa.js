// PWA 與離線：註冊 Service Worker、更新提示、網路狀態、安裝按鈕
import { L, toast, $ } from './ui.js';

let deferredPrompt = null;
export const canInstall = () => !!deferredPrompt;

export function init() {
  const net = () => {
    const el = $('#net-status');
    if (!el) return;
    el.textContent = navigator.onLine ? L('線上', 'Online') : L('離線', 'Offline');
    el.classList.toggle('off', !navigator.onLine);
    el.title = navigator.onLine ? '' : L('離線中：已快取的教材、練習、測驗、遊戲仍可使用；雲端語音可能無法發音。', 'Offline: cached content still works; online voices may not.');
  };
  addEventListener('online', () => { net(); toast(L('已恢復網路連線', 'Back online')); });
  addEventListener('offline', () => { net(); toast(L('目前離線：已快取內容仍可使用，學習紀錄會照常存在本機。', 'Offline: cached content still works and progress is saved locally.')); });
  net();

  addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; dispatchEvent(new Event('installable')); });
  addEventListener('appinstalled', () => { deferredPrompt = null; toast(L('已安裝到裝置 🎉', 'Installed 🎉')); });

  if (!('serviceWorker' in navigator)) return;
  if (location.protocol === 'file:') return; // 直接開檔案時無法使用 Service Worker
  if (new URLSearchParams(location.search).has('nosw')) return; // 開發測試用：網址加 ?nosw 不註冊快取
  // 以相對路徑註冊，GitHub Pages 專案子路徑（/repo/）也能正確限定範圍
  navigator.serviceWorker.register('./service-worker.js', { scope: './' }).then((reg) => {
    const ask = (w) => toast(L('有新版本可以使用', 'A new version is available'), { label: L('立即更新', 'Update'), run: () => w.postMessage('skipWaiting') });
    if (reg.waiting && navigator.serviceWorker.controller) ask(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const w = reg.installing;
      w?.addEventListener('statechange', () => {
        if (w.state === 'installed') {
          if (navigator.serviceWorker.controller) ask(w);
          else toast(L('已完成離線快取，之後沒有網路也能使用', 'Ready to work offline'));
        }
      });
    });
    setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
  }).catch((e) => console.warn('SW 註冊失敗', e));
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded) { reloaded = true; location.reload(); } });
}

export async function install() {
  if (!deferredPrompt) return false;
  deferredPrompt.prompt();
  const r = await deferredPrompt.userChoice.catch(() => null);
  deferredPrompt = null;
  return r?.outcome === 'accepted';
}

export function installHelp() {
  return L(`<ul><li><b>Android / Chrome / Edge</b>：按「安裝 App」按鈕，或瀏覽器選單 →「安裝應用程式／加到主畫面」。</li>
    <li><b>iPhone / iPad（Safari）</b>：按分享 ⬆️ →「加入主畫面」。</li>
    <li><b>電腦 Chrome / Edge</b>：網址列右側的安裝圖示 ⊕。</li></ul>
    <p class="small">安裝後第一次開啟需連網完成快取，之後可離線使用教材、練習、測驗與遊戲。發音若使用雲端語音，離線時可能無法播放。</p>`,
  `<ul><li><b>Android / Chrome / Edge</b>: tap “Install app” or browser menu → Install.</li><li><b>iPhone/iPad Safari</b>: Share → Add to Home Screen.</li><li><b>Desktop</b>: the install icon in the address bar.</li></ul>`);
}
