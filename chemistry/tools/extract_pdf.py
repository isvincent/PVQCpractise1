# -*- coding: utf-8 -*-
"""從 PDF 建立 data/source.json 與 data/corrections.json。

用法：python tools/extract_pdf.py [PDF 路徑]
  1. 以 PyMuPDF 讀取每頁文字層
  2. 檢查 source_terms.py 中每個英文詞條確實出現在該頁文字（防止漏抄、錯頁）
  3. 檢查是否有頁面文字未被任何詞條涵蓋（防止漏詞）
  4. 輸出原文 JSON（含檔名、頁碼、固定 id）
"""
import json, re, sys, os
from pathlib import Path

import fitz  # PyMuPDF

sys.path.insert(0, os.path.dirname(__file__))
from source_terms import TERMS, SOURCE_PDF
from corrections import CORRECTIONS, LAYOUT_ISSUES

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"


def slug(en):
    s = en.lower().replace("'", "")
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    # 只差大小寫的詞（earth 接地／Earth 地球）：大寫專有名詞加 -proper，id 仍固定
    if en[:1].isupper() and any(e == en.lower() for _, e, _ in TERMS):
        s += "-proper"
    return "t-" + s


def norm(s):
    return re.sub(r"\s+", " ", s).strip().lower()


def main():
    pdf = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "materials" / SOURCE_PDF
    doc = fitz.open(pdf)
    pages = [norm(p.get_text()) for p in doc]
    problems = []
    dups = []
    ids = set()
    items = []
    for order, (page, en, zh) in enumerate(TERMS, 1):
        tid = slug(en)
        if tid in ids:
            # PDF 中重複出現的詞條：保留第一次為學習項目，其餘出現處記在 also（頁碼、中文）以便追溯
            first = next(it for it in items if it["id"] == tid)
            first["source"].setdefault("also", []).append({"page": page, "order": order, "zh": zh})
            dups.append((en, first["source"]["page"], first["zh"], page, zh))
            continue
        ids.add(tid)
        if norm(en) not in pages[page - 1]:
            # 英文被斷行時，逐字檢查
            if not all(w.lower() in pages[page - 1] for w in en.split()):
                problems.append(f"p.{page} 找不到英文：{en}")
        zh_first = re.split(r"[；;(（ ]", zh)[0]
        if zh_first and norm(zh_first) not in pages[page - 1].replace(" ", ""):
            problems.append(f"p.{page} 找不到中文：{en} → {zh_first}")
        items.append({"id": tid, "en": en, "zh": zh, "source": {"file": pdf.name, "page": page, "order": order}})

    # 反向檢查：每頁的英文單字是否都屬於某個詞條
    for i, text in enumerate(pages, 1):
        words = set(re.findall(r"[a-z][a-z'\-]{2,}", text))
        covered = set()
        for (p, en, zh) in TERMS:
            if p == i:
                covered |= set(re.findall(r"[a-z][a-z'\-]{2,}", (en + " " + zh).lower()))
        extra = words - covered - {"specialist", "terms", "chinese", "traditional", "chemistry", "march", "pvqc", "for"}
        if extra:
            problems.append(f"p.{i} 未被涵蓋的英文字：{sorted(extra)}")

    by_en = {it["en"]: it["id"] for it in items}
    corr = []
    for en, field, orig, sug, why, sev in CORRECTIONS:
        if en not in by_en:
            problems.append(f"更正清單找不到詞條：{en}")
            continue
        corr.append({"id": by_en[en], "en": en, "field": field, "original": orig,
                     "suggestion": sug, "reason": why, "severity": sev})

    for en, p1, z1, p2, z2 in dups:
        same = z1 == z2
        corr.append({"id": by_en[en], "en": en, "field": "dup", "original": f"p.{p1}「{z1}」與 p.{p2}「{z2}」",
                     "suggestion": "合併為一個詞條" + ("" if same else f"：{z1}；{z2}"),
                     "reason": "同一英文詞條在 PDF 中出現兩次" + ("，中文相同。" if same else "，中文不同，App 合併並列出兩處原文。"),
                     "severity": "low" if same else "medium"})

    DATA.mkdir(exist_ok=True)
    meta = {"title": pdf.stem, "file": pdf.name, "pages": doc.page_count, "type": "vocabulary",
            "detectedMode": "vocabulary",
            "detectReason": "每頁皆為英文詞條＋繁體中文對照的兩欄表格，判定為詞彙型教材，採單字學習模式。",
            "termCount": len(items), "rowCount": len(TERMS)}
    (DATA / "source.json").write_text(json.dumps({"schema": 1, "material": meta, "terms": items},
                                                ensure_ascii=False, indent=1), encoding="utf-8")
    (DATA / "corrections.json").write_text(json.dumps({
        "schema": 1, "corrections": corr,
        "layoutIssues": [{"page": p, "note": n} for p, n in LAYOUT_ISSUES]},
        ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"PDF 列數 {len(TERMS)}，學習詞條 {len(items)} 筆（合併重複 {len(dups)}），更正建議 {len(corr)} 筆")
    for p in problems:
        print("⚠", p)


if __name__ == "__main__":
    main()
