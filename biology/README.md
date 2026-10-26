# 🧬 生物科學專業英文 AI 智慧自主學習 App

把 PDF 教材《科學專業英文(生物科學)》（14 頁、263 個英中對照詞條）轉換成可安裝、可離線使用的自主學習網站（PWA）。網站兼顧學生課後自學、課堂活動與教師教學。

- 純前端靜態網站（HTML／CSS／原生 JavaScript 模組），不需要伺服器、資料庫或帳號
- 首頁為 `index.html`，可直接部署到 GitHub Pages（包含 `https://帳號.github.io/專案名稱/` 這種專案子路徑）
- 學習紀錄只存在使用者自己的瀏覽器（IndexedDB），不會上傳

---

## 1. 專案介紹

| 項目 | 內容 |
|---|---|
| 來源教材 | `materials/科學專業英文(生物科學).pdf`（14 頁，詞彙型教材） |
| 詞條數 | 263（逐頁校對，保留檔名與頁碼） |
| 課程架構 | 7 章 13 單元，依知識概念與難度重新分類（非 PDF 頁序）；每詞分為基礎／進階／挑戰 |
| PDF 疑似錯誤 | 44 筆（只列建議，不覆寫原文），另有 7 項版面擷取說明 |
| 示意圖 | 65 張離線 SVG 概念圖，部分有動畫（會依照系統的「減少動態效果」設定停止） |
| 判定模式 | 每頁都是「英文詞條＋繁中對照」兩欄表 → 自動判定為**詞彙型**，採單字學習模式 |

### 原文與 AI 補充分開儲存
- `data/source.json`：**PDF 原文**（英文、中文、檔名、頁碼、原始順序）
- `data/corrections.json`：**疑似錯誤清單**（原始內容／建議修正／原因／嚴重度）＋版面問題說明
- `data/supplement/part1–4.json`：**AI 補充**（IPA 美式／英式、音節、詞性、中英定義、例句與翻譯、字根字首字尾、相關詞、易混淆詞、示意圖、正誤題、單元分類、難度、把握度）
- `data/course-bio.json`：由上面三者合併，供網站使用；每個詞條仍分成 `src`（原文）與 `ai`（補充）兩個欄位

> PDF 只有英中對照，沒有音標、定義、例句或圖片，所以這些欄位全部屬於 AI 補充，畫面上會以 🤖 標示。把握度中等的 11 個罕見詞（如 nucleohyaloplasm、understructure）會另外標示「待教師確認」。

---

## 2. 系統功能

| 模組 | 功能 |
|---|---|
| 教材 | 教材清單與切換、教材目錄（章／單元／預估時間／完成率）、PDF 原始順序檢視（附頁碼與原頁連結）、全文搜尋、主題心智圖、單元單字關聯圖 |
| 五階段自主學習 | ① 探索與診斷（學習目標、先備知識、學前診斷 6 題、個人目標、學習建議）② 理解與學習（互動概念圖可自動播放／調速、難度篩選、5 種排序、單字卡）③ 演練與應用 ④ 測驗與補救（單元測驗、後測、補救練習、錯題再測）⑤ 成果與反思（成果統計、目標達成率、反思紀錄、單元成果 CSV） |
| 單字 | 英文、繁中、IPA（美／英）、音節、詞性、發音（可切換美式／英式、調整速度、連播 3 次）、示意圖、例句與翻譯、字根、相關詞、易混淆詞、收藏、標記不熟悉／已熟悉，並自動記錄觀看、聆聽、練習次數 |
| 練習（10 種） | 翻轉單字卡、英文選中文、中文選英文、拼字、聽力辨識、圖片配對、單字與定義配對、句子填空、正誤判斷、錯題專項（另有綜合隨機） |
| 測驗（8 種） | 學前診斷、單元形成性、章節總結、綜合挑戰、自訂題數與難度、限時、錯題重測、學習後測 |
| 遊戲（5 種） | 單字配對挑戰、限時單字快答、拼字闖關、翻牌記憶、主題知識挑戰賽（可分兩隊） |
| 遊戲化 | 經驗值與等級、14 種徽章、連續學習天數、各遊戲最高分 |
| 智慧複習 | 熟練度（未學習／學習中／待加強／已精熟）、間隔重複排程、今日待複習、下次複習日期、錯題本、個人化下一步建議 |
| 儀表板 | 總進度、各單元完成率、熟練狀態圓餅圖、14 天學習時間、日曆熱力圖、成長趨勢、測驗分數趨勢、題型弱點、常錯單字、待複習、目標達成率、徽章、最近紀錄、反思 |
| 資料 | JSON 完整備份與還原（驗證格式＋版本，可選擇合併或覆蓋）、CSV 學習歷程與測驗成績匯出、重設進度、清除紀錄、恢復預設設定 |
| 教師模式 | 教材總覽與疑似錯誤清單、課堂投影模式、題庫與答案解析（可列印）、練習與測驗切換、匯入多位學生的 JSON／CSV、單一學生分析、班級統計、內容編輯並匯出新教材 JSON／題庫 CSV、教師版報表 |
| 七大設定 | 全螢幕、音效、裝置預覽、版面、語言（繁中／英文）、字體（縮小／標準／放大）、色系（跟隨系統／亮色／暗色），以及「恢復預設設定」 |
| PWA | 可安裝、離線使用、網路狀態標示、新版本更新提示 |

### 熟練度與複習規則（公開、可驗證）
- **已精熟**：作答 ≥ 3 次、最近 8 次正確率 ≥ 80%、連續答對 ≥ 3；或自己標記「已熟悉」，且作答 ≥ 2 次、最後一次答對
- **待加強**：作答 ≥ 2 次且最近正確率 < 60%；或累計答錯 ≥ 2 次且最後一次答錯；或標記「不熟悉」且最近正確率 < 80%
- **未學習**：沒看過也沒作答；其他情況都是 **學習中**
- **熟練度分數** = 70% × 最近正確率 + 30% × 連續答對次數／5（最多算到 5 次）；逾期未複習每天扣 5 分，最多扣 30 分
- **間隔重複**（SM-2 簡化版）：答錯 → 今天再複習；答對 → 間隔 1 天 → 3 天 → 前一次間隔 × 難易係數（預設 2.5，最低 1.3）；同一天答對多次只往前推一次
- **推薦優先度** = 錯誤率 × 2 + 答錯次數 × 0.3 + 逾期天數 × 0.2（標記不熟悉 +0.5）
- **錯題本**：答錯自動加入；之後連續答對 2 次，即標記為「已訂正」
- **單元完成率**：五個階段完成數 ÷ 5。各階段完成條件依序為：學前診斷做完、閱讀 80% 的單字、練習題數達 min(單元詞數, 15)、單元測驗或後測及格、儲存一篇反思

程式位置：`js/review.js`（判定與排程）、`js/progress.js`（紀錄寫入）。

---

## 3. 操作方法（學生）
1. 首頁 →「教材目錄」選單元，依序完成五個階段（上方的階段列可以自由切換）
2. 單字頁可聽發音、看示意圖與例句，也能收藏或標記熟悉度
3. 每天先到「智慧複習」完成到期的單字
4. 「資料備份」可輸入姓名／班級／座號（選填，只寫進匯出檔），下載 JSON 或 CSV 交給老師
5. 右上角 ⚙️ 是七大顯示設定。手機版底部有「☰ 更多」，可以打開全部功能

鍵盤：作答時按數字 1–4 選答案、Enter 到下一題；單字卡按空白鍵翻面、← → 換卡、S 發音；投影模式按空白鍵逐層揭示、Esc 離開。

## 教師使用
左側選單「教師模式」→ 開啟。**這只是介面切換，不是身分驗證**，學生也能開啟，所以題目答案不屬於機密保護。
- 課堂投影：建議同時開啟「全螢幕」與「字體放大」
- 學生紀錄：一次選多個學生匯出的 `.json` 或 `.csv`。資料只在當前分頁的記憶體中分析，重新整理就清除，不會上傳
- 內容編輯：只能修訂 AI 補充欄位，PDF 原文不能改。修改先存在本機，再按「匯出修改後的教材 JSON」，用下載的檔案取代 `data/course-bio.json` 並重新部署即可生效

---

## 4. 本機測試方式
ES 模組與 Service Worker 不能用 `file://` 開啟，必須透過本機伺服器：

```bash
cd bio-english-pwa
```

```bash
python -m http.server 8080
```

然後用瀏覽器開啟 `http://localhost:8080/`。

- 開發測試時可以改用 `http://localhost:8080/?nosw`，網址加 `?nosw` 就不會註冊離線快取，方便看到最新修改
- 如果同一個 localhost 連接埠以前跑過別的 PWA，可能會被舊的 Service Worker 攔截。請換一個連接埠，或在開發者工具 → Application → Service Workers 中按 Unregister

## 5. GitHub Pages 部署步驟
1. 在 GitHub 建立新的 Repository（例如 `bio-english`）
2. 上傳本資料夾的**全部內容**（`index.html` 必須在 Repository 根目錄）
3. Settings → Pages → Source 選 **Deploy from a branch**，Branch 選 `main`／`/ (root)` → Save
4. 約 1 分鐘後即可用 `https://你的帳號.github.io/bio-english/` 開啟
5. 之後每次修改網站檔案，都先執行 `python tools/build_sw.py` 更新快取版本再上傳，使用者就會看到「有新版本」的更新提示

子路徑處理：所有資源都用相對路徑（`js/…`、`data/…`）。Service Worker 用 `./service-worker.js` 註冊，scope 為 `./`；manifest 的 `start_url`／`scope` 也都是相對路徑，所以部署在 `/repo名稱/` 下也能正常運作。

> ⚠️ 不要把學生的學習紀錄上傳到公開 Repository；`.gitignore` 已經排除常見的匯出檔名。
> 若教材 PDF 有著作權考量，可以刪掉 `materials/` 資料夾中的 PDF。App 的學習功能照常運作，只有「開啟原始 PDF」連結會失效。

## 6. 如何更換或加入 PDF 教材
需要 Python 3 與 PyMuPDF（`pip install pymupdf`）。

1. 把新的 PDF 放進 `materials/`
2. 在 `tools/source_terms.py` 填入逐列校對後的 `(頁碼, 英文, 中文)`，並修改 `SOURCE_PDF` 檔名。可以先用 PyMuPDF 印出各頁文字，再對照頁面圖片修正表格錯位
3. 在 `tools/corrections.py` 記錄疑似錯誤與版面問題（只放建議，不改原文）
4. 執行 `python tools/extract_pdf.py`。它會檢查每個詞條確實出現在該頁、每頁沒有漏掉的英文字，並輸出 `data/source.json`、`data/corrections.json`
5. 在 `tools/units.py` 設定章、單元與示意圖鍵值
6. 依照「教材 JSON 格式」中的 AI 補充欄位撰寫 `data/supplement/part*.json`（可請 AI 產生，務必由教師檢核）
7. 執行 `python tools/build_data.py`（會檢查缺漏、單元、圖鍵、例句是否含詞條）→ 再執行 `python tools/build_sw.py`
8. 要同時提供多份教材，就在 `tools/build_data.py` 設定不同的 `MATERIAL_ID`／輸出檔名，並把每份教材加進 `data/materials.json` 的 `materials` 陣列。「教材清單」頁可以切換教材

## 7. 教材 JSON 格式（`data/course-bio.json`）
```json
{
  "schema": 1, "version": "2026.10.25",
  "material": { "id": "bio-sci-en", "title": "科學專業英文(生物科學)", "file": "科學專業英文(生物科學).pdf", "pages": 14, "type": "vocabulary", "termCount": 263 },
  "chapters": [ { "id": "c1", "title": "…", "title_en": "…", "units": ["u01", "u02"] } ],
  "units": [ { "id": "u05", "title": "細胞呼吸與發酵", "title_en": "…", "desc": "…", "desc_en": "…",
               "goals": ["…"], "goals_en": ["…"], "prereq": ["…"], "prereq_en": ["…"], "concepts": ["…"],
               "terms": ["t-glycolysis", "…"], "minutes": 44, "levels": {"1": 9, "2": 7, "3": 3} } ],
  "terms": [ {
    "id": "t-glycolysis", "unit": "u05", "level": 1,
    "src": { "en": "glycolysis", "zh": "糖解作用", "file": "科學專業英文(生物科學).pdf", "page": 9, "order": 176 },
    "ai":  { "pos": "n.", "ipa_us": "/…/", "ipa_uk": "/…/", "syllables": "gly·col·y·sis",
             "def_en": "…", "def_zh": "…", "example_en": "…glycolysis…", "example_zh": "…",
             "morph": [{"part": "glyco-", "meaning": "糖"}], "related": ["t-krebs-cycle"],
             "confusables": [{"term": "…", "zh": "…", "note": "…"}], "illus": "glycolysis",
             "tf": {"statement_zh": "…", "answer": true, "explain": "…"}, "confidence": "high" } } ],
  "corrections": [ { "id": "t-transport-protein", "en": "transport protein", "field": "zh", "original": "運輸單不",
                     "suggestion": "運輸蛋白", "reason": "…", "severity": "high" } ],
  "layoutIssues": [ { "page": 8, "note": "…" } ],
  "illus": { "glycolysis": "示意圖說明" }
}
```
- 詞條 `id` 由英文產生（`t-` 加小寫連字號），固定且唯一，學習紀錄就靠它對應
- `example_en` 必須包含詞條本身，句子填空題才能出題
- 測驗用的中文：如果原文有 `severity: high` 的明顯錯字，會改用建議用字出題；畫面上仍會同時列出原文

## 8. 學習資料備份與還原
- 儲存位置：IndexedDB `bio-english-pwa`（資料表包括 items、events、quizzes、wrongbook、reflections、goals、daily、units、meta、overrides）。localStorage 只用來存顯示設定
- 每次作答、標記、設定目標都會**立即寫入**，重新整理不會遺失
- 匯出檔帶有 `app`、`schema`（資料版本）、`material`、`exportedAt`。匯入前會先驗證；如果版本比 App 新，會拒絕匯入
- 匯入方式：**合併**（保留目前資料，加入較新的內容並去除重複）或 **覆蓋**（覆蓋前會再確認一次）
- 刪除全部紀錄需要確認兩次
- ⚠️ 清除瀏覽器網站資料、使用無痕模式、換裝置或換瀏覽器，都可能讓紀錄消失，請定期備份。App 會提醒超過一週沒有備份

## 9. PWA 安裝方法
- **Android／Chrome／Edge**：左側選單「📲 安裝 App」，或瀏覽器選單 →「安裝應用程式」
- **iPhone／iPad（Safari）**：分享按鈕 →「加入主畫面」
- **電腦版 Chrome／Edge**：網址列右側的安裝圖示

第一次開啟需要連網完成快取（約 1.8 MB），之後可以離線使用教材、練習、測驗與遊戲。

## 10. 已知限制與常見問題
- **發音**使用瀏覽器內建的 SpeechSynthesis，不同裝置的聲線、腔調都不同。如果裝置沒有安裝英文語音，會顯示提示並請學生參考 IPA；部分雲端語音（例如 Chrome 的 Google 語音）離線時無法播放
- **音標、定義、例句、示意圖都是 AI 補充**，已經自動檢查格式，但仍建議教師抽查。罕見詞（標示「待教師確認」）的音標與詞義把握度比較低
- 示意圖是簡化的概念圖，不是精確的解剖圖或實測數據（例如色素吸收光譜曲線是近似值、犬髖關節是示意）
- **教師模式**不是身分驗證，答案沒有保護
- **全螢幕**：iPhone Safari 不支援，請改用「加入主畫面」；其他瀏覽器需要由按鈕觸發，被拒絕時會提示
- **版面切換**：瀏覽器不支援螢幕方向鎖定時，只會調整網頁排列，不會強制旋轉裝置
- **裝置切換**只是版型預覽（390／820／1280px），不會改變實際裝置
- 學習時間只計算頁面可見、而且 60 秒內有操作的時間，每 15 秒累計一次
- 用 `file://` 直接開啟 `index.html` 會無法載入，請使用本機伺服器或 GitHub Pages

## 專案結構
```
index.html               首頁
manifest.webmanifest     PWA 設定
service-worker.js        離線快取（由 tools/build_sw.py 產生）
css/app.css              全站樣式（亮色／暗色、RWD、投影、列印）
js/app.js                進入點、路由、選單、麵包屑
js/data.js               教材資料處理（載入、教師修訂、搜尋）
js/vocab.js              課程與單字展示（首頁、目錄、單字頁、單字卡、PDF 順序）
js/unit.js               單元五階段流程
js/concepts.js           互動概念圖、棋盤方格、心智圖
js/illustrations.js      示意圖（illus-a.js、illus-b.js 為 65 張 SVG）
js/speech.js             發音控制
js/questions.js          題目產生器（8 種題型、同義詞排除）
js/runner.js             答題元件
js/practice.js           練習系統
js/quiz.js               測驗系統
js/games.js              遊戲系統
js/review.js             錯題與智慧複習演算法
js/progress.js           學習歷程、經驗值、徽章、學習時間
js/store.js              IndexedDB 資料庫
js/dashboard.js          儀表板與圖表、複習頁、說明
js/settings.js           七大顯示與操作設定
js/io.js                 資料匯入與匯出
js/teacher.js            教師工具
js/pwa.js                PWA 與離線
js/sound.js、js/ui.js    音效與共用工具
data/                    教材 JSON（原文、更正、AI 補充、合併檔、教材清單）
materials/               原始 PDF
icons/                   App 圖示（192、512、maskable、apple-touch）
tools/                   教材處理與建置腳本
TEST_REPORT.md           系統測試與功能驗收清單
```
