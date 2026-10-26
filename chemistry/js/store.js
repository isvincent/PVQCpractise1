// 學習歷程資料庫（IndexedDB）。所有紀錄只存在使用者本機瀏覽器。
// 每次寫入即時提交，重新整理不會遺失。IndexedDB 無法使用時改用記憶體並提示。

export const DB_NAME = 'chemistry-english-pwa';
export const DB_VERSION = 1;
export const DATA_SCHEMA = 1; // 匯出檔的資料格式版本
export const STORES = {
  items: 'id',          // 每個單字的學習狀態（固定 id）
  events: '++',         // 學習事件流水帳
  quizzes: '++',        // 測驗紀錄
  wrongbook: 'id',      // 錯題本（以單字 id 為鍵）
  reflections: '++',    // 學習反思
  goals: 'unit',        // 個人學習目標
  daily: 'date',        // 每日學習時間
  units: 'unit',        // 單元五階段進度
  meta: 'key',          // 經驗值、徽章、進行中的測驗等
  overrides: 'id',      // 教師編輯的補充內容
};

let db = null;
let memory = null; // 後備：記憶體儲存
export let persistent = true;

export async function open() {
  if (!('indexedDB' in window)) return useMemory();
  try {
    db = await new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const d = req.result;
        for (const [name, key] of Object.entries(STORES)) {
          if (d.objectStoreNames.contains(name)) continue;
          if (key === '++') d.createObjectStore(name, { keyPath: 'k', autoIncrement: true });
          else d.createObjectStore(name, { keyPath: key });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error('blocked'));
    });
    db.onversionchange = () => { db.close(); location.reload(); };
  } catch (e) {
    console.warn('IndexedDB 無法使用，改用記憶體', e);
    useMemory();
  }
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
}

function useMemory() {
  persistent = false;
  memory = Object.fromEntries(Object.keys(STORES).map((n) => [n, new Map()]));
  memory._seq = 1;
}

function tx(store, mode, fn) {
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const s = t.objectStore(store);
    let out;
    const r = fn(s);
    if (r) r.onsuccess = () => { out = r.result; };
    t.oncomplete = () => resolve(out);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

const keyOf = (store, obj) => obj[STORES[store] === '++' ? 'k' : STORES[store]];

export async function get(store, key) {
  if (memory) return structuredClone(memory[store].get(key));
  return tx(store, 'readonly', (s) => s.get(key));
}
export async function put(store, obj) {
  if (memory) {
    if (STORES[store] === '++' && obj.k == null) obj.k = memory._seq++;
    memory[store].set(keyOf(store, obj), structuredClone(obj));
    return keyOf(store, obj);
  }
  return tx(store, 'readwrite', (s) => s.put(obj));
}
export async function add(store, obj) {
  if (memory) return put(store, obj);
  return tx(store, 'readwrite', (s) => s.add(obj));
}
export async function del(store, key) {
  if (memory) { memory[store].delete(key); return; }
  return tx(store, 'readwrite', (s) => s.delete(key));
}
export async function all(store) {
  if (memory) return [...memory[store].values()].map((v) => structuredClone(v));
  return tx(store, 'readonly', (s) => s.getAll());
}
export async function clear(store) {
  if (memory) { memory[store].clear(); return; }
  return tx(store, 'readwrite', (s) => s.clear());
}
export async function putMany(store, arr) {
  if (memory) { for (const o of arr) await put(store, o); return; }
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, 'readwrite');
    const s = t.objectStore(store);
    for (const o of arr) s.put(o);
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
  });
}

export async function getMeta(key, dflt = null) {
  const r = await get('meta', key);
  return r ? r.value : dflt;
}
export const setMeta = (key, value) => put('meta', { key, value });

/** 匯出全部學習資料 */
export async function dumpAll() {
  const out = {};
  for (const name of Object.keys(STORES)) out[name] = await all(name);
  return out;
}

export async function clearAll(stores = Object.keys(STORES)) {
  for (const name of stores) await clear(name);
}
