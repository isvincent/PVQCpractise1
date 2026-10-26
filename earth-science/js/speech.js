// 發音控制：瀏覽器 SpeechSynthesis。不同裝置的聲線不同，找不到指定腔調時會提示。
import { S } from './settings.js';
import { L, toast } from './ui.js';

const synth = window.speechSynthesis;
export const supported = !!(synth && window.SpeechSynthesisUtterance);
let voices = [];
let warned = {};

function loadVoices() { voices = supported ? synth.getVoices() : []; }
if (supported) {
  loadVoices();
  synth.addEventListener?.('voiceschanged', () => {
    loadVoices();
    const el = document.getElementById('voice-info'); // 單字頁的語音說明在語音載入後更新
    if (el) el.textContent = voiceInfo();
  });
}

/** 依腔調挑選語音；離線時優先本機語音（雲端語音離線無法發音） */
export function pickVoice(accent = S.accent) {
  if (!voices.length) loadVoices();
  const want = accent === 'uk' ? 'en-GB' : 'en-US';
  const norm = (v) => v.lang.replace('_', '-');
  let list = voices.filter((v) => norm(v).toLowerCase() === want.toLowerCase());
  let exact = true;
  if (!list.length) { list = voices.filter((v) => /^en/i.test(v.lang)); exact = false; }
  if (!navigator.onLine) {
    const local = list.filter((v) => v.localService);
    if (local.length) list = local;
  }
  const v = list.find((x) => /natural|neural|google|samantha|daniel|aria|jenny|libby|sonia/i.test(x.name)) || list[0] || null;
  return { voice: v, exact };
}

export function voiceInfo() {
  if (!supported) return L('此瀏覽器不支援語音合成，無法播放發音。', 'Speech synthesis is not supported in this browser.');
  const { voice, exact } = pickVoice();
  if (!voice) return L('尚未找到英文語音（可能正在載入，或裝置未安裝英文語音）。', 'No English voice found on this device.');
  return `${voice.name}（${voice.lang}${voice.localService ? L('，本機', ', local') : L('，雲端：離線時可能無法發音', ', online voice – may fail offline')}）${exact ? '' : L(' ※找不到指定腔調，改用其他英文語音', ' – requested accent unavailable')}`;
}

/**
 * 朗讀英文。回傳 Promise<boolean>（是否成功開始）。
 * @param {string} text
 * @param {{rate?:number, accent?:string}} opt
 */
export function speak(text, opt = {}) {
  return new Promise((resolve) => {
    if (!supported) {
      if (!warned.sup) toast(L('此瀏覽器不支援發音功能，請改用 Chrome、Edge 或 Safari，或參考 IPA 音標。', 'Speech is not supported here; please use the IPA.'));
      warned.sup = true;
      return resolve(false);
    }
    const { voice, exact } = pickVoice(opt.accent);
    if (!voice && !warned.none) {
      toast(L('裝置上找不到英文語音，將使用系統預設聲音；也可在系統設定中安裝英文語音。', 'No English voice installed; using system default.'));
      warned.none = true;
    } else if (voice && !exact && !warned['acc' + S.accent]) {
      toast(L(`找不到${S.accent === 'uk' ? '英式' : '美式'}英文語音，改用 ${voice.lang}。`, `Requested accent not available; using ${voice.lang}.`));
      warned['acc' + S.accent] = true;
    }
    if (voice && !voice.localService && !navigator.onLine && !warned.off) {
      toast(L('目前離線，雲端語音可能無法發音，請參考 IPA 音標。', 'Offline: online voices may not work.'));
      warned.off = true;
    }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = voice?.lang || (S.accent === 'uk' ? 'en-GB' : 'en-US');
    u.rate = opt.rate || S.rate;
    let started = false;
    u.onstart = () => { started = true; resolve(true); };
    u.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') toast(L('發音播放失敗，請稍後再試或參考 IPA 音標。', 'Playback failed; please try again.'));
      if (!started) resolve(false);
    };
    synth.speak(u);
    // 部分瀏覽器不觸發 onstart
    setTimeout(() => { if (!started) resolve(synth.speaking); }, 1500);
  });
}

export const stop = () => supported && synth.cancel();
