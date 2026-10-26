// 題目產生器：練習、測驗、遊戲共用。選項每次隨機抽取並打亂，避免背選項位置。
import { allTerms, unitTerms, term, course } from './data.js';
import { shuffle, sample, esc, L, pick } from './ui.js';

export const QTYPES = {
  en2zh: { zh: '英文選中文', en: 'English → Chinese' },
  zh2en: { zh: '中文選英文', en: 'Chinese → English' },
  spell: { zh: '拼字', en: 'Spelling' },
  listen: { zh: '聽力辨識', en: 'Listening' },
  image: { zh: '圖片配對', en: 'Picture match' },
  def: { zh: '定義配對', en: 'Definition match' },
  cloze: { zh: '句子填空', en: 'Sentence cloze' },
  tf: { zh: '正誤判斷', en: 'True / False' },
};
export const qtypeLabel = (k) => L(QTYPES[k].zh, QTYPES[k].en);

const norm = (s) => s.toLowerCase().replace(/[‐-‒–—]/g, '-').replace(/[’`]/g, "'").replace(/\s+/g, ' ').trim();
/** 拼字判定：不分大小寫、忽略多餘空白；連字號與空白視為相同 */
export const spellOk = (input, en) => norm(input).replace(/-/g, ' ') === norm(en).replace(/-/g, ' ');

// 同義詞組（由教材 JSON 的 synonyms 提供）：彼此不可互為干擾選項，否則會有兩個正確答案
let synOf = null;
function synMap() {
  if (synOf && synOf.src === course) return synOf;
  synOf = new Map();
  synOf.src = course;
  for (const g of course?.synonyms || []) for (const id of g) synOf.set(id, new Set([...(synOf.get(id) || []), ...g]));
  return synOf;
}
/** 與 t 意義重疊、不適合當干擾選項的詞：同義詞組＋雙向「相關詞」 */
function overlaps(t, x) {
  return synMap().get(t.id)?.has(x.id) || (t.ai.related || []).includes(x.id) || (x.ai.related || []).includes(t.id);
}

/** 挑選干擾選項：優先同單元，排除中文或英文重複、同義或相關者 */
function distractors(t, n, key = (x) => x.zhShort, pool) {
  const seen = new Set([key(t), t.src.en.toLowerCase()]);
  const out = [];
  const tryAdd = (list) => {
    for (const x of shuffle(list)) {
      if (out.length >= n) break;
      if (x.id === t.id || overlaps(t, x) || seen.has(key(x)) || seen.has(x.src.en.toLowerCase())) continue;
      seen.add(key(x)); seen.add(x.src.en.toLowerCase());
      out.push(x);
    }
  };
  tryAdd(pool || unitTerms(t.unit));
  if (out.length < n) tryAdd(allTerms());
  return out;
}

export const ipaOf = (t, acc = 'us') => (acc === 'uk' ? t.ai.ipa_uk : t.ai.ipa_us) || '';

export function explainHtml(t, chosen) {
  let s = `<p><b lang="en">${esc(t.src.en)}</b> <span class="ipa">${esc(t.ai.ipa_us || '')}</span>　${esc(t.zhQ)}</p>`;
  if (t.ai.def_zh) s += `<p class="small">${esc(t.ai.def_zh)}</p>`;
  if (chosen && chosen.id !== t.id) s += `<p class="small">💡 ${L('你選的', 'You chose')} <b lang="en">${esc(chosen.src.en)}</b> = ${esc(chosen.zhQ)}</p>`;
  if (t.ai.confusables?.length) s += `<p class="small">⚠️ ${L('易混淆', 'Often confused')}：${t.ai.confusables.map((c) => `<span lang="en">${esc(c.term)}</span>（${esc(c.zh)}）`).join('、')}</p>`;
  return s;
}

function mc(t, type, prompt, optTerms, labelFn, extra = {}) {
  const opts = shuffle([t, ...optTerms]).map((x) => ({ id: x.id, label: labelFn(x) }));
  return { type, id: t.id, unit: t.unit, prompt, options: opts, answer: t.id, ...extra };
}

/** 依題型產生單題；無法產生時（例如缺例句）回傳 null */
export function make(type, t) {
  const ai = t.ai;
  switch (type) {
    case 'en2zh':
      return mc(t, type, `<span lang="en">${esc(t.src.en)}</span>`, distractors(t, 3), (x) => x.zhQ,
        { ask: L('這個英文詞的中文是？', 'Choose the Chinese meaning'), speak: t.src.en });
    case 'zh2en':
      return mc(t, type, esc(t.zhQ), distractors(t, 3), (x) => x.src.en, { ask: L('選出對應的英文', 'Choose the English term'), optLang: 'en' });
    case 'listen': {
      const pool = allTerms().filter((x) => x.src.en[0].toLowerCase() === t.src.en[0].toLowerCase() || Math.abs(x.src.en.length - t.src.en.length) <= 2);
      return mc(t, type, `🔊 ${L('播放發音後作答', 'Listen and choose')}`, distractors(t, 3, (x) => x.src.en.toLowerCase(), pool), (x) => x.src.en,
        { ask: L('你聽到的是哪一個？', 'Which word did you hear?'), audio: t.src.en, optLang: 'en' });
    }
    case 'image':
      if (!ai.illus) return null;
      return mc(t, type, '', distractors(t, 3, (x) => x.ai.illus || x.id), (x) => `${x.src.en}｜${x.zhShort}`,
        { ask: L('哪一個詞最符合這張示意圖？', 'Which term best matches the diagram?'), illus: ai.illus });
    case 'def':
      if (!ai.def_en) return null;
      return mc(t, type, `<span lang="en">${esc(ai.def_en)}</span>`, distractors(t, 3), (x) => x.src.en,
        { ask: L('哪一個詞符合這個英文定義？', 'Which term matches this definition?'), optLang: 'en', sub: esc(ai.def_zh || '') });
    case 'cloze': {
      if (!ai.example_en) return null;
      const re = new RegExp(t.src.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      if (!re.test(ai.example_en)) return null;
      const blank = esc(ai.example_en.replace(re, '\u0000')).replace('\u0000', '<b class="blank">______</b>');
      return mc(t, type, `<span lang="en">${blank}</span>`, distractors(t, 3), (x) => x.src.en,
        { ask: L('選出最適合填入空格的詞', 'Fill in the blank'), optLang: 'en', sub: esc(ai.example_zh || '') });
    }
    case 'tf': {
      // 一半用 AI 概念敘述，一半用中英對應判斷
      if (ai.tf && Math.random() < 0.5) {
        return { type, id: t.id, unit: t.unit, ask: L('判斷敘述是否正確', 'True or false?'), prompt: esc(ai.tf.statement_zh),
          options: [{ id: 'T', label: L('⭕ 正確', '⭕ True') }, { id: 'F', label: L('❌ 錯誤', '❌ False') }],
          answer: ai.tf.answer ? 'T' : 'F', note: esc(ai.tf.explain || '') };
      }
      const truth = Math.random() < 0.5;
      const shown = truth ? t : distractors(t, 1)[0];
      return { type, id: t.id, unit: t.unit, ask: L('判斷中英對應是否正確', 'Is this translation correct?'),
        prompt: `<span lang="en">${esc(t.src.en)}</span> ＝ ${esc(shown.zhQ)}`,
        options: [{ id: 'T', label: L('⭕ 正確', '⭕ True') }, { id: 'F', label: L('❌ 錯誤', '❌ False') }],
        answer: truth ? 'T' : 'F', note: truth ? '' : `${L('正確中文是', 'Correct meaning')}：${esc(t.zhQ)}` };
    }
    case 'spell':
      return { type, id: t.id, unit: t.unit, input: true, ask: L('聽發音並拼出英文', 'Listen and spell the term'),
        // 解釋中的英文字一律遮蔽，避免直接看到拼法
        prompt: esc(t.zhQ), sub: esc((ai.def_zh || '').replace(/[A-Za-z][A-Za-z'’-]{2,}/g, '＿＿')), audio: t.src.en, answer: t.src.en,
        hint: t.src.en.replace(/[A-Za-z]/g, (c, i) => (i === 0 ? c : '＿')) };
    default:
      return null;
  }
}

/** 檢查答案；回傳是否正確 */
export function check(q, value) {
  if (q.input) return spellOk(value, q.answer);
  return value === q.answer;
}

/** 依一組單字與題型產生題組（types 會隨機輪替） */
export function build(terms, types, n) {
  const list = shuffle(terms).slice(0, n ?? terms.length);
  const qs = [];
  for (const t of list) {
    let q = null;
    for (const ty of shuffle(types)) { q = make(ty, t); if (q) break; }
    if (q) qs.push(q);
  }
  return qs;
}

export const termOf = (q) => term(q.id);
export { sample, pick };
