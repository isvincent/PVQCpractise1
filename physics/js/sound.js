// 音效：以 Web Audio 即時合成，不需下載音檔，離線也可使用
import { S } from './settings.js';

let ctx = null;
const getCtx = () => {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

function tone(freq, start, dur, type = 'sine', vol = 0.18) {
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  const t = c.currentTime + start;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

const SOUNDS = {
  ok: () => { tone(660, 0, 0.12, 'triangle'); tone(990, 0.09, 0.18, 'triangle'); },
  no: () => { tone(220, 0, 0.18, 'sawtooth', 0.09); tone(180, 0.12, 0.22, 'sawtooth', 0.08); },
  flip: () => tone(520, 0, 0.07, 'square', 0.06),
  click: () => tone(800, 0, 0.04, 'square', 0.05),
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.22, 'triangle')),
  level: () => [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.08, 0.16, 'square', 0.07)),
  tick: () => tone(1200, 0, 0.03, 'sine', 0.05),
};

export function sfx(name) {
  if (!S.sound) return;
  try { SOUNDS[name]?.(); } catch { /* 忽略音效錯誤 */ }
}
