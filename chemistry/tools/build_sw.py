# -*- coding: utf-8 -*-
"""產生 service-worker.js：列出所有需預先快取的檔案，並以內容雜湊作為快取版本。

用法：python tools/build_sw.py   （每次修改網站檔案後執行，使用者會看到「有新版本」提示）
"""
import hashlib
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
INCLUDE = ["index.html", "manifest.webmanifest", "css", "js", "data/course-chem.json", "data/materials.json", "icons", "materials"]


def files():
    out = []
    for p in INCLUDE:
        q = ROOT / p
        out += sorted(x for x in (q.rglob("*") if q.is_dir() else [q]) if x.is_file())
    return out


def main():
    fl = files()
    h = hashlib.sha256()
    for f in fl:
        h.update(f.relative_to(ROOT).as_posix().encode())
        h.update(f.read_bytes())
    ver = h.hexdigest()[:10]
    urls = ["./"] + ["./" + quote(f.relative_to(ROOT).as_posix()) for f in fl]
    tpl = (ROOT / "tools" / "service-worker.template.js").read_text(encoding="utf-8")
    js = tpl.replace("__VERSION__", ver).replace("__FILES__", ",\n  ".join(f"'{u}'" for u in urls))
    (ROOT / "service-worker.js").write_text(js, encoding="utf-8")
    print(f"service-worker.js 版本 {ver}，預快取 {len(urls)} 個檔案")


if __name__ == "__main__":
    main()
