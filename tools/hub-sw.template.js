// 總覽首頁 Service Worker（由 tools/build_hub.py 產生，請勿直接修改）
// 只快取首頁自己的檔案；五個子站各有自己的 Service Worker 與快取，這裡一律放行不攔截。
const VERSION = '__VERSION__';
const CACHE = 'hubapp-' + VERSION;
const PRECACHE = [
  __FILES__
];
const SUBDIRS = __SUBDIRS__;
const BASE = new URL('./', self.location).pathname; // 例如 /repo/

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' })))));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('hubapp-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });

const isSubsite = (path) => SUBDIRS.some((d) => path.startsWith(BASE + d + '/') || path === BASE + d);

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (isSubsite(url.pathname)) return; // 子站交給子站自己的 Service Worker 或網路
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
