// 學習歷程：單字紀錄、事件、錯題本、經驗值與徽章、學習時間、單元五階段進度
import * as db from './store.js';
import { blankItem, schedule, status } from './review.js';
import { today, L, toast, confetti } from './ui.js';
import { sfx } from './sound.js';

export const items = new Map(); // id → item（記憶體快取，寫入時同步存到 IndexedDB）
export let meta = { xp: 0, badges: {}, games: 0, quizPass: 0 };
const unitState = new Map();

export async function init() {
  for (const it of await db.all('items')) items.set(it.id, { ...blankItem(it.id), ...it });
  meta = { ...meta, ...(await db.getMeta('gami', {})) };
  for (const u of await db.all('units')) unitState.set(u.unit, u);
  startTimer();
}

export const item = (id) => items.get(id);
const ensure = (id) => { if (!items.has(id)) items.set(id, blankItem(id)); return items.get(id); };
const saveItem = (it) => db.put('items', it);

export async function log(type, data = {}) {
  await db.add('events', { ts: Date.now(), type, ...data });
}

export async function recordView(id, unit) {
  const it = ensure(id);
  it.views += 1;
  it.lastTs = Date.now();
  await saveItem(it);
  await log('view', { id, unit });
}
export async function recordListen(id) {
  const it = ensure(id);
  it.listens += 1;
  await saveItem(it);
  await log('listen', { id });
  if (it.listens === 1) await checkBadges();
}
export async function setMark(id, mark) {
  const it = ensure(id);
  it.mark = it.mark === mark ? null : mark;
  await saveItem(it);
  await log('mark', { id, mark: it.mark });
  return it.mark;
}
export async function toggleFav(id) {
  const it = ensure(id);
  it.fav = !it.fav;
  await saveItem(it);
  return it.fav;
}

/**
 * 記錄一次作答（練習、測驗、遊戲共用）
 * @param {string} id 單字 id
 * @param {boolean} correct
 * @param {{mode:string, ms?:number, unit?:string, qtype?:string}} ctx
 */
export async function recordAnswer(id, correct, ctx) {
  const it = ensure(id);
  const before = status(it);
  it.practice += 1;
  correct ? it.correct++ : it.wrong++;
  it.recent = [...it.recent, correct ? 1 : 0].slice(-8);
  it.streak = correct ? it.streak + 1 : 0;
  it.lastTs = Date.now();
  if (ctx.ms) it.totalMs += ctx.ms;
  schedule(it, correct, ctx.ms);
  await saveItem(it);
  await log('answer', { id, ok: correct, mode: ctx.mode, qtype: ctx.qtype, ms: ctx.ms, unit: ctx.unit });
  // 錯題本：答錯加入；之後在錯題練習中連續答對 2 次即標記已訂正
  const wb = (await db.get('wrongbook', id)) || { id, count: 0, firstWrong: Date.now(), resolved: false, okRun: 0, modes: [] };
  if (!correct) {
    wb.count += 1; wb.lastWrong = Date.now(); wb.resolved = false; wb.okRun = 0;
    if (!wb.modes.includes(ctx.qtype || ctx.mode)) wb.modes.push(ctx.qtype || ctx.mode);
    await db.put('wrongbook', wb);
  } else if (wb.count) {
    wb.okRun += 1;
    if (wb.okRun >= 2) wb.resolved = true;
    await db.put('wrongbook', wb);
  }
  await addXp(correct ? 10 : 2, false);
  const after = status(it);
  if (after === 'mastered' && before !== 'mastered') toast(L('🌟 精熟一個新單字！', '🌟 New word mastered!'));
  return it;
}

// ---------- 經驗值、等級、徽章 ----------
export const levelOf = (xp) => Math.floor(Math.sqrt(xp / 40)) + 1;
export const xpForLevel = (lv) => (lv - 1) ** 2 * 40;

export async function addXp(n, check = true) {
  const lvBefore = levelOf(meta.xp);
  meta.xp += n;
  await db.setMeta('gami', meta);
  if (levelOf(meta.xp) > lvBefore) {
    sfx('level');
    toast(L(`⬆️ 升級！目前等級 Lv.${levelOf(meta.xp)}`, `⬆️ Level up! Lv.${levelOf(meta.xp)}`));
  }
  if (check || meta.xp % 50 < n) await checkBadges();
}
export async function bump(key) {
  meta[key] = (meta[key] || 0) + 1;
  await db.setMeta('gami', meta);
  await checkBadges();
}

export const BADGES = [
  ['first', '🐣', '第一步', 'First step', '完成第一次作答', 'Answer your first question', (s) => s.answers >= 1],
  ['w50', '📗', '單字新手', 'Word rookie', '學過 50 個單字', 'Study 50 words', (s) => s.learned >= 50],
  ['w150', '📘', '單字達人', 'Word expert', '學過 150 個單字', 'Study 150 words', (s) => s.learned >= 150],
  ['wall', '📚', '全冊制霸', 'Full coverage', '全部單字都學過', 'Study every word', (s) => s.learned >= s.total],
  ['m20', '⭐', '精熟 20', 'Master 20', '精熟 20 個單字', 'Master 20 words', (s) => s.mastered >= 20],
  ['m100', '🌟', '精熟 100', 'Master 100', '精熟 100 個單字', 'Master 100 words', (s) => s.mastered >= 100],
  ['s3', '🔥', '連續 3 天', '3-day streak', '連續學習 3 天', 'Study 3 days in a row', (s) => s.streak >= 3],
  ['s7', '🏅', '連續 7 天', '7-day streak', '連續學習 7 天', 'Study 7 days in a row', (s) => s.streak >= 7],
  ['q100', '💯', '滿分', 'Perfect score', '任一測驗得到 100 分', 'Score 100 on any quiz', (s) => s.perfect],
  ['q5', '🎓', '測驗通過 ×5', 'Passed ×5', '通過 5 次測驗', 'Pass 5 quizzes', (s) => s.quizPass >= 5],
  ['g5', '🎮', '遊戲玩家', 'Gamer', '完成 5 場學習遊戲', 'Finish 5 learning games', (s) => s.games >= 5],
  ['u1', '🧩', '單元完成', 'Unit complete', '完成一個單元的五個階段', 'Finish all 5 stages of a unit', (s) => s.unitsDone >= 1],
  ['l100', '🎧', '專心聆聽', 'Good listener', '聆聽發音 100 次', 'Listen 100 times', (s) => s.listens >= 100],
  ['r3', '📝', '反思達人', 'Reflector', '寫下 3 篇學習反思', 'Write 3 reflections', (s) => s.reflections >= 3],
];

let summaryCache = null;
export async function summary(totalTerms) {
  const arr = [...items.values()];
  const quizzes = await db.all('quizzes');
  const refl = await db.all('reflections');
  const s = {
    total: totalTerms ?? summaryCache?.total ?? 0,
    answers: arr.reduce((a, it) => a + it.correct + it.wrong, 0),
    learned: arr.filter((it) => status(it) !== 'new').length,
    mastered: arr.filter((it) => status(it) === 'mastered').length,
    listens: arr.reduce((a, it) => a + it.listens, 0),
    streak: await streakDays(),
    perfect: quizzes.some((q) => q.score === 100),
    quizPass: quizzes.filter((q) => q.passed).length,
    games: meta.games || 0,
    reflections: refl.length,
    unitsDone: [...unitState.values()].filter((u) => STAGES.every((k) => u.stages?.[k])).length,
  };
  summaryCache = s;
  return s;
}

export async function checkBadges() {
  const s = await summary();
  if (!s.total) return;
  for (const [id, icon, zh, en, , , cond] of BADGES) {
    if (!meta.badges[id] && cond(s)) {
      meta.badges[id] = Date.now();
      await db.setMeta('gami', meta);
      sfx('win');
      confetti();
      toast(L(`${icon} 解鎖徽章：${zh}`, `${icon} Badge unlocked: ${en}`));
    }
  }
}

// ---------- 學習時間與連續天數 ----------
let lastAct = Date.now();
function startTimer() {
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((e) => addEventListener(e, () => { lastAct = Date.now(); }, { passive: true }));
  setInterval(async () => {
    // 只計算頁面可見且 60 秒內有操作的時間
    if (document.visibilityState !== 'visible' || Date.now() - lastAct > 60000) return;
    const d = today();
    const r = (await db.get('daily', d)) || { date: d, ms: 0 };
    r.ms += 15000;
    await db.put('daily', r);
  }, 15000);
}

export async function streakDays() {
  const days = new Set((await db.all('daily')).filter((r) => r.ms >= 60000).map((r) => r.date));
  const ev = await db.all('events');
  ev.forEach((e) => e.type === 'answer' && days.add(today(new Date(e.ts))));
  let n = 0;
  const d = new Date();
  if (!days.has(today(d))) d.setDate(d.getDate() - 1); // 今天還沒學不算中斷
  while (days.has(today(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

// ---------- 單元五階段 ----------
export const STAGES = ['explore', 'learn', 'practice', 'test', 'reflect'];
export const unitProgress = (uid) => unitState.get(uid) || { unit: uid, stages: {} };
export async function markStage(uid, stage, extra = {}) {
  const u = { ...unitProgress(uid) };
  const was = u.stages[stage];
  u.stages = { ...u.stages, [stage]: true };
  Object.assign(u, extra);
  unitState.set(uid, u);
  await db.put('units', u);
  if (!was) {
    await addXp(15);
    if (STAGES.every((k) => u.stages[k])) { sfx('win'); confetti(); }
  }
  return u;
}
export async function saveUnitExtra(uid, extra) {
  const u = { ...unitProgress(uid), ...extra };
  unitState.set(uid, u);
  await db.put('units', u);
}
export async function reloadAll() {
  items.clear();
  unitState.clear();
  meta = { xp: 0, badges: {}, games: 0, quizPass: 0 };
  for (const it of await db.all('items')) items.set(it.id, { ...blankItem(it.id), ...it });
  meta = { ...meta, ...(await db.getMeta('gami', {})) };
  for (const u of await db.all('units')) unitState.set(u.unit, u);
}
