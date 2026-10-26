# -*- coding: utf-8 -*-
"""合併原文、AI 補充、課程架構與更正建議 → data/course-bio.json，並更新 data/materials.json。

用法：python tools/build_data.py
原文（source.json）與 AI 補充（supplement/*.json）在輸出中仍分屬 src / ai 兩個欄位，不混在一起。
"""
import json, sys, os, glob
from pathlib import Path

sys.path.insert(0, os.path.dirname(__file__))
from units import CHAPTERS, UNITS, ILLUS, SYNONYMS, REASSIGN

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
MATERIAL_ID = "chem-sci-en"
VERSION = "2026.10.26"
FIELDS = ["unit", "level", "pos", "ipa_us", "ipa_uk", "syllables", "def_en", "def_zh", "example_en", "example_zh",
          "morph", "related", "confusables", "illus", "tf", "confidence"]


def main():
    src = json.loads((DATA / "source.json").read_text(encoding="utf-8"))
    corr = json.loads((DATA / "corrections.json").read_text(encoding="utf-8"))
    sup = {}
    for f in sorted(glob.glob(str(DATA / "supplement" / "part*.json"))):
        for o in json.loads(Path(f).read_text(encoding="utf-8")):
            sup[o["id"]] = o
    ids = {t["id"] for t in src["terms"]}
    errors, terms = [], []
    unit_ids = {u["id"] for u in UNITS}
    for t in src["terms"]:
        a = sup.get(t["id"])
        if not a:
            errors.append(f"缺少 AI 補充：{t['id']}")
            continue
        ai = {k: a.get(k) for k in FIELDS if k not in ("unit", "level")}
        ai["related"] = [r for r in (a.get("related") or []) if r in ids and r != t["id"]]
        if a["unit"] not in unit_ids:
            errors.append(f"未知單元 {t['id']} {a['unit']}")
        if a.get("illus") not in ILLUS:
            errors.append(f"未知示意圖 {t['id']} {a.get('illus')}")
        if t["en"].lower() not in (a.get("example_en") or "").lower():
            errors.append(f"例句未含詞條 {t['id']}")
        unit_id = REASSIGN.get(a["unit"], {}).get(a.get("illus"), a["unit"])
        terms.append({"id": t["id"], "unit": unit_id, "level": int(a.get("level") or 1),
                      "src": {"en": t["en"], "zh": t["zh"], **t["source"]}, "ai": ai})

    units = []
    for u in UNITS:
        tl = [x for x in terms if x["unit"] == u["id"]]
        tl.sort(key=lambda x: (x["level"], x["src"]["en"].lower()))
        # 預估學習時間：每詞 1.5 分鐘（閱讀＋練習）＋ 前後測 15 分鐘
        minutes = round(len(tl) * 1.5 + 15)
        units.append({**u, "terms": [x["id"] for x in tl], "minutes": minutes,
                      "levels": {str(l): sum(1 for x in tl if x["level"] == l) for l in (1, 2, 3)}})
    for u in units:
        if not u["terms"]:
            errors.append(f"單元沒有詞條：{u['id']}")

    by_en = {t["src"]["en"]: t["id"] for t in terms}
    synonyms = []
    for g in SYNONYMS:
        miss = [e for e in g if e not in by_en]
        if miss:
            errors.append(f"同義詞組找不到詞條：{miss}")
        synonyms.append([by_en[e] for e in g if e in by_en])
    course = {
        "schema": 1, "version": VERSION, "material": {**src["material"], "id": MATERIAL_ID},
        "provenance": {"src": "PDF 原文（頁碼可追溯）", "ai": "AI 補充：音標、定義、例句、字根、相關詞、示意圖、正誤題、單元分類與難度；教師可在教師模式修訂"},
        "chapters": CHAPTERS, "units": units, "terms": terms,
        "synonyms": synonyms, "corrections": corr["corrections"], "layoutIssues": corr["layoutIssues"], "illus": ILLUS,
    }
    out = DATA / "course-chem.json"
    out.write_text(json.dumps(course, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    mats = {"schema": 1, "materials": [{"id": MATERIAL_ID, "title": src["material"]["title"], "file": "data/course-chem.json",
                                        "pdf": "materials/" + src["material"]["file"], "terms": len(terms),
                                        "mode": src["material"]["detectedMode"], "version": VERSION}]}
    (DATA / "materials.json").write_text(json.dumps(mats, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"詞條 {len(terms)}，單元 {len(units)}，輸出 {out.name} {out.stat().st_size // 1024} KB")
    for u in units:
        print(f"  {u['id']} {u['title']}: {len(u['terms'])} 詞 {u['levels']}")
    for e in errors:
        print("⚠", e)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
