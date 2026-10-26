// 教材資料處理：載入教材清單與結構化 JSON，套用教師編輯，提供查詢與搜尋
import * as db from './store.js';

export let materials = [];
export let course = null;     // 目前教材
export const T = new Map();   // id → term
export let units = [];
export let chapters = [];
const LS = 'chemapp.material';

export async function loadMaterials() {
  const r = await fetch('data/materials.json', { cache: 'no-cache' }).catch(() => fetch('data/materials.json'));
  materials = (await r.json()).materials;
  return materials;
}

export function currentMaterialId() {
  let id = null;
  try { id = localStorage.getItem(LS); } catch { /* 忽略 */ }
  return materials.find((m) => m.id === id)?.id || materials[0]?.id;
}

export async function loadCourse(id = currentMaterialId()) {
  const m = materials.find((x) => x.id === id) || materials[0];
  const r = await fetch(m.file);
  if (!r.ok) throw new Error('教材載入失敗：' + m.file);
  course = await r.json();
  course.materialId = m.id;
  try { localStorage.setItem(LS, m.id); } catch { /* 忽略 */ }
  units = course.units;
  chapters = course.chapters;
  T.clear();
  const fixes = new Map();
  for (const c of course.corrections || []) {
    if (!fixes.has(c.id)) fixes.set(c.id, []);
    fixes.get(c.id).push(c);
  }
  for (const t of course.terms) {
    t.fix = fixes.get(t.id) || [];
    // 測驗用中文：原文有明顯錯字（high）時使用建議修正，畫面上仍同時顯示原文
    const hi = t.fix.find((f) => f.field === 'zh' && f.severity === 'high');
    t.zhQ = hi ? hi.suggestion : t.src.zh;
    t.zhShort = t.zhQ.split(/[；;]/)[0].trim();
    T.set(t.id, t);
  }
  await applyOverrides();
  return course;
}

/** 教師在本機編輯過的 AI 補充欄位（不改原文） */
export async function applyOverrides() {
  const ov = await db.all('overrides');
  for (const o of ov) {
    const t = T.get(o.id);
    if (t) Object.assign(t.ai, o.ai);
  }
}

export const term = (id) => T.get(id);
export const unit = (id) => units.find((u) => u.id === id);
export const chapterOf = (uid) => chapters.find((c) => c.units.includes(uid));
export const unitTerms = (uid) => (unit(uid)?.terms || []).map((id) => T.get(id)).filter(Boolean);
export const allTerms = () => course.terms;
export const pdfOrder = () => course.terms.slice().sort((a, b) => a.src.order - b.src.order);

/** 全文搜尋：英文、原文中文、AI 定義與例句；回傳依相關度排序 */
export function search(q) {
  q = q.trim().toLowerCase();
  if (!q) return [];
  const res = [];
  for (const t of course.terms) {
    const en = t.src.en.toLowerCase();
    let score = 0;
    if (en === q) score = 100;
    else if (en.startsWith(q)) score = 60;
    else if (en.includes(q)) score = 40;
    if (t.src.zh.includes(q) || t.zhQ.includes(q)) score = Math.max(score, 50);
    const ai = t.ai;
    if (!score && [ai.def_zh, ai.def_en, ai.example_en, ai.example_zh].some((s) => (s || '').toLowerCase().includes(q))) score = 15;
    if (score) res.push({ t, score });
  }
  for (const u of units) {
    if (u.title.includes(q) || u.title_en.toLowerCase().includes(q)) res.push({ u, score: 55 });
  }
  return res.sort((a, b) => b.score - a.score);
}
