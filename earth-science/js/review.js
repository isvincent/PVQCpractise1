// 錯題與智慧複習：熟練度判定、間隔重複排程、推薦。規則公開寫在 README 與 App「演算法說明」。
import { today, addDays, L } from './ui.js';

export const STATUS = {
  new: { zh: '未學習', en: 'Not started', icon: '○' },
  learning: { zh: '學習中', en: 'Learning', icon: '◐' },
  weak: { zh: '待加強', en: 'Needs work', icon: '▲' },
  mastered: { zh: '已精熟', en: 'Mastered', icon: '★' },
};
export const statusLabel = (s) => `${STATUS[s].icon} ${L(STATUS[s].zh, STATUS[s].en)}`;

export function blankItem(id) {
  return { id, views: 0, listens: 0, practice: 0, correct: 0, wrong: 0, recent: [], streak: 0, lastTs: 0,
    ease: 2.5, interval: 0, reps: 0, due: null, lastSrsDay: null, fav: false, mark: null, totalMs: 0 };
}

const attempts = (it) => (it ? it.correct + it.wrong : 0);
/** 最近 8 次作答正確率 */
export const recentAcc = (it) => (it && it.recent.length ? it.recent.reduce((a, b) => a + b, 0) / it.recent.length : 0);

/**
 * 熟練狀態判定規則
 * - 未學習：沒看過也沒作答
 * - 已精熟：作答 ≥ 3 次、最近正確率 ≥ 80%、連續答對 ≥ 3；
 *           或自行標記「已熟悉」且作答 ≥ 2 次、最後一次答對
 * - 待加強：作答 ≥ 2 次且最近正確率 < 60%；或累計錯 ≥ 2 次且最後一次答錯；
 *           或標記「不熟悉」且最近正確率 < 80%
 * - 學習中：其他情況（看過但作答不足等）
 */
export function status(it) {
  if (!it || (it.views === 0 && attempts(it) === 0 && !it.mark)) return 'new';
  const n = attempts(it);
  const acc = recentAcc(it);
  const last = it.recent[it.recent.length - 1];
  if ((n >= 3 && acc >= 0.8 && it.streak >= 3) || (it.mark === 'familiar' && n >= 2 && last === 1)) return 'mastered';
  if ((n >= 2 && acc < 0.6) || (it.wrong >= 2 && last === 0) || (it.mark === 'unfamiliar' && n >= 1 && acc < 0.8)) return 'weak';
  return 'learning';
}

/** 熟練度分數 0–100：70% 最近正確率 + 30% 連對次數（上限 5），逾期複習每天扣 5 分（最多 30） */
export function masteryScore(it) {
  if (!it) return 0;
  if (!attempts(it)) return it.views ? 10 : 0;
  let s = 100 * (0.7 * recentAcc(it) + 0.3 * Math.min(it.streak, 5) / 5);
  const od = overdueDays(it);
  if (od > 0) s -= Math.min(30, od * 5);
  return Math.max(0, Math.round(s));
}

export function overdueDays(it) {
  if (!it?.due) return 0;
  const d = (new Date(today() + 'T00:00:00') - new Date(it.due + 'T00:00:00')) / 86400000;
  return Math.max(0, Math.round(d));
}

/**
 * 間隔重複（SM-2 簡化版）
 * 品質 q：答錯 1；答對且 ≤ 6 秒 5；答對但較慢 4
 * 答錯 → reps=0、今天再複習；答對 → 間隔 1 天 → 3 天 → 前次間隔 × ease
 * ease = max(1.3, ease + 0.1 − (5−q)(0.08 + (5−q)·0.02))
 * 同一天多次答對只推進一次，避免在同一天刷題就把間隔拉長
 */
export function schedule(it, correct, ms) {
  const d = today();
  const q = correct ? (ms != null && ms <= 6000 ? 5 : 4) : 1;
  if (!correct) {
    it.reps = 0;
    it.interval = 0;
    it.due = d;
    it.ease = Math.max(1.3, it.ease - 0.2);
  } else if (it.lastSrsDay !== d || !it.due) {
    it.reps += 1;
    it.interval = it.reps === 1 ? 1 : it.reps === 2 ? 3 : Math.round(it.interval * it.ease);
    it.ease = Math.max(1.3, it.ease + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    it.due = addDays(d, it.interval);
  }
  it.lastSrsDay = d;
  return it;
}

/** 推薦優先度：錯誤率高、錯誤次數多、逾期久、標記不熟悉者優先 */
export function priority(it) {
  if (!it) return 0;
  const n = attempts(it);
  const err = n ? 1 - recentAcc(it) : 0.5;
  return err * 2 + it.wrong * 0.3 + overdueDays(it) * 0.2 + (it.mark === 'unfamiliar' ? 0.5 : 0) - (it.mark === 'familiar' ? 0.3 : 0);
}

/** 今日待複習：有作答紀錄且到期日 ≤ 今天，依待加強→優先度排序 */
export function dueList(items) {
  const d = today();
  return items.filter((it) => attempts(it) > 0 && it.due && it.due <= d)
    .sort((a, b) => (status(b) === 'weak') - (status(a) === 'weak') || priority(b) - priority(a));
}

export { attempts };
