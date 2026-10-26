// 詞彙示意圖：依概念鍵值提供 SVG（離線可用，不依賴外部圖片）
import A from './illus-a.js';
import B from './illus-b.js';

export const ILLUS = { ...A, ...B };

export function illus(key) {
  return ILLUS[key] || `<svg viewBox="0 0 320 200" role="img" aria-label="示意圖缺漏"><rect width="320" height="200" fill="#f1f5f9"/><text x="160" y="105" text-anchor="middle" fill="#64748b" font-size="14">（此概念暫無示意圖）</text></svg>`;
}
