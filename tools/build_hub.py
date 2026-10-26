# -*- coding: utf-8 -*-
"""建置總覽首頁：python tools/build_hub.py

1. 在每個子站的 index.html 加上「回總覽」按鈕（已存在就略過）
2. 重新產生每個子站的 service-worker.js（呼叫子站自己的 tools/build_sw.py）
3. 產生 data/subjects.json（各科統計）與 data/terms.json（跨科搜尋、每日一字、小遊戲用的精簡索引）
4. 產生總覽首頁的 service-worker.js（只快取首頁自己的檔案，不攔截子站）

修改任何子站內容後，在 Repo 根目錄重新執行本腳本即可。
"""
import hashlib, json, re, subprocess, sys
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent

# 科目設定：資料夾、顯示名稱、主題色（與子站配色一致）、計算器
SUBJECTS = [
    {"key": "biology", "dir": "biology", "emoji": "🧬", "zh": "生物科學", "en": "Biology",
     "colors": ["#5146e5", "#7c3aed", "#db2777"], "calcs": [["棋盤方格（孟德爾遺傳）", "Punnett square"]]},
    {"key": "physics", "dir": "physics", "emoji": "⚛️", "zh": "物理", "en": "Physics",
     "colors": ["#0b4fb3", "#0891b2", "#f59e0b"], "calcs": [["溫標換算", "Temperature"], ["薄透鏡成像", "Thin lens"], ["等效電阻", "Resistors"]]},
    {"key": "chemistry", "dir": "chemistry", "emoji": "⚗️", "zh": "化學", "en": "Chemistry",
     "colors": ["#065f46", "#0d9488", "#7c3aed"], "calcs": [["原子組成", "Atomic composition"], ["莫耳與濃度", "Moles & molarity"], ["pH 計算", "pH"]]},
    {"key": "earth", "dir": "earth-science", "emoji": "🌏", "zh": "地球科學", "en": "Earth Science",
     "colors": ["#1e3a8a", "#0e7490", "#4d7c0f"], "calcs": [["半衰期定年", "Half-life dating"], ["正午太陽仰角", "Noon sun altitude"], ["天文距離", "Parallax distance"]]},
    {"key": "brain", "dir": "brain-science", "emoji": "🧠", "zh": "腦科學", "en": "Brain Science",
     "colors": ["#86198f", "#6d28d9", "#2563eb"], "calcs": [["神經傳導時間", "Nerve conduction"], ["睡眠週期", "Sleep cycles"], ["標準分數", "Standard scores"]]},
]

HUB_LINK = ('<a class="icon-btn" id="hub-link" href="../index.html" aria-label="回到科目總覽" '
            'title="回到科目總覽（五科首頁）">🏫</a>')
HUB_FILES = ["index.html", "manifest.webmanifest", "css", "js", "data", "icons"]


def inject_hub_link(sub: Path):
    p = sub / "index.html"
    s = p.read_text(encoding="utf-8")
    if 'id="hub-link"' in s:
        return False
    anchor = '<span class="net" id="net-status"'
    if anchor not in s:
        raise SystemExit(f"{p} 找不到插入位置")
    s = s.replace(anchor, HUB_LINK + "\n    " + anchor, 1)
    p.write_text(s, encoding="utf-8")
    return True


def build_sub_sw(sub: Path):
    r = subprocess.run([sys.executable, str(sub / "tools" / "build_sw.py")], cwd=sub, capture_output=True, text=True,
                       encoding="utf-8", env={**__import__("os").environ, "PYTHONIOENCODING": "utf-8"})
    if r.returncode:
        raise SystemExit(r.stderr)
    return r.stdout.strip()


def db_name(sub: Path):
    m = re.search(r"DB_NAME = '([^']+)'", (sub / "js" / "store.js").read_text(encoding="utf-8"))
    return m.group(1)


def main():
    subjects, index = [], []
    for cfg in SUBJECTS:
        sub = ROOT / cfg["dir"]
        added = inject_hub_link(sub)
        sw = build_sub_sw(sub)
        mat = json.loads((sub / "data" / "materials.json").read_text(encoding="utf-8"))["materials"][0]
        course = json.loads((sub / mat["file"]).read_text(encoding="utf-8"))
        unit_title = {u["id"]: u["title"] for u in course["units"]}
        high = {c["id"]: c["suggestion"] for c in course["corrections"] if c["field"] == "zh" and c["severity"] == "high"}
        levels = {"1": 0, "2": 0, "3": 0}
        for t in course["terms"]:
            levels[str(t["level"])] += 1
            zh = high.get(t["id"], t["src"]["zh"])
            index.append([cfg["key"], t["id"], t["src"]["en"], re.split(r"[；;]", zh)[0].strip(),
                          (t["ai"].get("def_zh") or "")[:90], t["ai"].get("ipa_us") or "", unit_title[t["unit"]], t["level"]])
        subjects.append({
            **{k: cfg[k] for k in ("key", "dir", "emoji", "zh", "en", "colors", "calcs")},
            "title": mat["title"], "pdf": f'{cfg["dir"]}/{mat["pdf"]}', "db": db_name(sub),
            "terms": len(course["terms"]), "rows": course["material"].get("rowCount", len(course["terms"])),
            "pages": course["material"].get("pages"), "chapters": len(course["chapters"]), "units": len(course["units"]),
            "illus": len(course["illus"]), "corrections": len(course["corrections"]), "levels": levels,
            "unitList": [{"id": u["id"], "zh": u["title"], "en": u["title_en"], "n": len(u["terms"])} for u in course["units"]],
            "version": course.get("version"),
        })
        print(f'{cfg["dir"]:14s} 詞條 {len(course["terms"]):4d}  單元 {len(course["units"]):2d}  {"已加回總覽按鈕　" if added else ""}{sw}')
    (ROOT / "data").mkdir(exist_ok=True)
    (ROOT / "data" / "subjects.json").write_text(json.dumps({"schema": 1, "subjects": subjects}, ensure_ascii=False, indent=1), encoding="utf-8")
    (ROOT / "data" / "terms.json").write_text(json.dumps({"schema": 1, "fields": ["subject", "id", "en", "zh", "def", "ipa", "unit", "level"],
                                                          "terms": index}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    # 首頁 service worker
    files = []
    for p in HUB_FILES:
        q = ROOT / p
        files += sorted(x for x in (q.rglob("*") if q.is_dir() else [q]) if x.is_file())
    h = hashlib.sha256()
    for f in files:
        h.update(f.relative_to(ROOT).as_posix().encode()); h.update(f.read_bytes())
    ver = h.hexdigest()[:10]
    urls = ["./"] + ["./" + quote(f.relative_to(ROOT).as_posix()) for f in files]
    tpl = (ROOT / "tools" / "hub-sw.template.js").read_text(encoding="utf-8")
    js = (tpl.replace("__VERSION__", ver).replace("__FILES__", ",\n  ".join(f"'{u}'" for u in urls))
          .replace("__SUBDIRS__", json.dumps([s["dir"] for s in SUBJECTS])))
    (ROOT / "service-worker.js").write_text(js, encoding="utf-8")
    print(f"總計 {len(index)} 詞條；首頁 service-worker.js 版本 {ver}，預快取 {len(urls)} 個檔案")


if __name__ == "__main__":
    main()
