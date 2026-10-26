// Service Worker（由 tools/build_sw.py 產生，請勿直接修改）
// 所有路徑皆為相對於 SW 所在位置，GitHub Pages 專案子路徑（https://帳號.github.io/repo/）可正常運作。
const VERSION = 'f9157ef777';
const CACHE = 'phyapp-' + VERSION;
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/app.js',
  './js/concepts.js',
  './js/dashboard.js',
  './js/data.js',
  './js/games.js',
  './js/illus-a.js',
  './js/illus-b.js',
  './js/illustrations.js',
  './js/io.js',
  './js/practice.js',
  './js/progress.js',
  './js/pwa.js',
  './js/questions.js',
  './js/quiz.js',
  './js/review.js',
  './js/runner.js',
  './js/settings.js',
  './js/sound.js',
  './js/speech.js',
  './js/store.js',
  './js/teacher.js',
  './js/ui.js',
  './js/unit.js',
  './js/vocab.js',
  './data/course-phy.json',
  './data/materials.json',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './materials/%E7%A7%91%E5%AD%B8%E5%B0%88%E6%A5%AD%E8%8B%B1%E6%96%87%28%E7%89%A9%E7%90%86%29.pdf'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' })))));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('phyapp-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });

// 同源 GET：快取優先（離線可用），背景更新教材 JSON；頁面導覽失敗時回傳 index.html
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put('./index.html', cp)); return r; })
      .catch(() => caches.match('./index.html', { ignoreSearch: true })));
    return;
  }
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: true });
    const net = fetch(req).then((r) => {
      if (r.ok && r.type === 'basic') { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); }
      return r;
    });
    if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
    return net.catch(() => new Response('', { status: 504, statusText: 'offline' }));
  })());
});
