# -*- coding: utf-8 -*-
"""疑似錯誤清單：只提供建議，不覆寫 source.json 的原文。

每筆：(英文詞條, 欄位, 原始內容, 建議修正, 原因, 嚴重度)
嚴重度：high = 明顯錯誤（機器直譯人名、錯誤譯名、殘缺譯名）；medium = 用詞不精確或與臺灣慣用不同；low = 格式、重複或非專業義項
（PDF 中重複出現的詞條由 extract_pdf.py 自動加入，欄位為 dup）
"""

CORRECTIONS = [
    # 人名與專有名詞被機器逐字直譯
    ("Daniel Offer", "zh", "丹尼爾報價", "丹尼爾·奧弗（Daniel Offer，青少年心理學家）", "Offer 是姓氏，被誤譯為「報價」。", "high"),
    ("cab Calloway", "zh", "出租車卡洛威", "凱布·卡洛威（Cab Calloway，美國爵士歌手）", "Cab 是人名，被誤譯為「出租車」；英文首字應大寫。", "high"),
    ("Thomas Inset", "en", "Thomas Inset", "Thomas Insel（湯瑪斯·因瑟爾，前美國國家心理衛生研究院院長）", "姓氏應為 Insel，被誤拼為 Inset 並譯成「插圖」。", "high"),
    ("Henry dryer", "zh", "亨利烘乾機", "（人名，疑為 Henry Dreyer；不是烘乾機）", "dryer 被當成一般名詞直譯為「烘乾機」。", "high"),
    ("Miguel Najdorf", "zh", "米格爾·奈多夫", "米格爾·納道夫（阿根廷西洋棋大師，以盲棋記憶聞名）", "譯名可用，但與腦科學的關聯需補充說明。", "low"),
    ("fast company", "zh", "快速公司", "《Fast Company》（美國商業雜誌名稱）", "應為雜誌名，不宜直譯。", "medium"),
    # 錯誤或不精確的譯名
    ("delusion", "zh", "失能；混亂；無秩序；騷亂；動亂", "妄想", "delusion 是精神醫學的「妄想」；原文為 disorder 的譯義，疑似錯置。", "high"),
    ("optic disk", "zh", "光盤", "視神經盤（視盤、盲點）", "optic disk 是視網膜上視神經離開眼球處，「光盤」為光碟的直譯。", "high"),
    ("circadian", "zh", "生物", "晝夜節律的（約 24 小時週期的）", "原文譯名殘缺。", "high"),
    ("globus", "zh", "蒼", "球（globus pallidus 蒼白球）", "原文譯名殘缺。", "medium"),
    ("pallidus", "zh", "白球", "蒼白的（globus pallidus 蒼白球）", "原文將「蒼白球」拆成兩個詞條。", "medium"),
    ("tendency", "zh", "偏", "傾向；趨勢", "原文譯名殘缺。", "high"),
    ("psychosis", "zh", "精神變態；精神病", "精神病（思覺失調等失去現實感的狀態）", "「精神變態」通常指 psychopathy，與 psychosis 不同。", "medium"),
    ("agnosia", "zh", "認識不能；部分或全部喪失感官之辨別力；病覺缺失症", "失認症（無法辨識感覺訊息）", "「病覺缺失症」是 anosognosia（不知道自己生病），與失認症不同。", "medium"),
    ("hallucination", "zh", "妄想；錯覺；幻覺", "幻覺", "妄想是 delusion、錯覺是 illusion，與幻覺不同。", "medium"),
    ("reflex", "zh", "反映；反射", "反射", "「反映」為 reflect 的意思，神經學用語為「反射」。", "medium"),
    ("inhibitory", "zh", "控制性", "抑制性的", "inhibitory 對應 excitatory「興奮性」，應為「抑制性」。", "medium"),
    ("ganglia", "zh", "核", "神經節（複數；basal ganglia 基底核）", "原文過度簡化。", "medium"),
    ("striatum", "zh", "紋狀", "紋狀體", "缺少「體」字。", "medium"),
    ("superior", "zh", "前；上", "上方的；上側（解剖方位）", "解剖學 superior 為「上」，「前」是 anterior。", "medium"),
    ("central executive", "zh", "中央執行官", "中央執行系統（工作記憶模型）", "Baddeley 工作記憶模型的術語。", "medium"),
    ("multimodal reinforcement", "zh", "多模態加固", "多模態增強", "心理學 reinforcement 譯為「增強」。", "medium"),
    ("corpus callosum", "zh", "有胼胝體", "胼胝體", "多了「有」字。", "medium"),
    ("aurora polaris", "en", "aurora polaris", "aurora borealis（北極光）／aurora polaris（極光）", "北極光的標準英文為 aurora borealis。", "medium"),
    ("human memory", "zh", "人類的記憶有關。", "人類記憶", "原文為句子殘段。", "medium"),
    ("anterograde", "zh", "階段前；順向", "順向的（anterograde amnesia 順向失憶）", "「階段前」不通順。", "low"),
    ("thalamus", "zh", "視神經床；丘腦", "視丘；丘腦", "「視神經床」為舊稱，臺灣常用「視丘」。", "low"),
    ("Glucocorticoids", "zh", "醣皮質素", "糖皮質素（糖皮質激素）", "常用「糖」；英文首字不須大寫。", "low"),
    ("hormones", "zh", "賀爾蒙", "荷爾蒙；激素", "臺灣常用「荷爾蒙」。", "low"),
    ("congenital amusia", "zh", "先天性失樂", "先天性失樂症", "缺少「症」字。", "low"),
    ("coefficient alpha", "zh", "a 係數", "α 係數（Cronbach's α，信度係數）", "希臘字母 α 被印成 a。", "low"),
    ("schema", "zh", "基模：輪廓；概要；略圖", "基模；概要", "冒號應為分號。", "low"),
    ("formative", "zh", "形成的；造形的；構成的形成性", "形成的；形成性的", "缺少分隔。", "low"),
    ("anecdotal", "zh", "軼事的軼事的；趣聞的；多軼事的；含軼事的", "軼事的；趣聞的", "「軼事的」重複。", "low"),
    ("ventricle", "zh", "室；腦室；心室；腦室", "腦室；心室", "「腦室」重複。", "low"),
    ("minded", "zh", "有意的；有心的；具有意志的 有意的；有心的；具有意志的", "有意的；有心的", "中文重複兩次；原列英文含音標與詞性，下一列為例句。", "low"),
    ("dendrites", "zh", "樹狀突；樹模石", "樹突（複數）", "「樹模石」應為礦物學的「樹枝石」，與神經學無關。", "low"),
    ("posterior", "zh", "後部；臀部；後方", "後側的（解剖方位）", "「臀部」為非專業義項。", "low"),
    ("jumping", "zh", "開合跳", "跳躍（jumping jacks 開合跳）", "jumping 單獨使用為跳躍。", "low"),
    ("Demon", "zh", "戴蒙", "（疑為 Maxwell's demon 或人名，原文無上下文）", "無法判斷所指。", "low"),
    ("frisson", "zh", "顫栗； 震顫；戰慄", "顫慄（聽音樂時的起雞皮疙瘩感）", "多餘空白。", "low"),
    ("Have you heard?", "en", "Have you heard?", "（一般問句，非專有名詞）", "原 PDF 混入一般語句。", "low"),
    ("as a senior executive", "zh", "身為高階主管。", "身為高階主管", "句子殘段，非專有名詞。", "low"),
]

LAYOUT_ISSUES = [
    (1, "第 1 頁頁首「PVQC for Brain Sciences Specialist (Sample for Beta version)／腦科學 專業級 (Beta Version)」與日期為表頭；各頁右上頁碼與「Brain Sciences SP n」頁尾不列入詞條。"),
    (0, "此 PDF 為單欄、英文與中文緊接在同一行的排版，長的中文會換行（如 temporal、stencil），擷取時已合併。"),
    (2, "minded 一列的英文含音標與詞性「[ˈmaɪndɪd] adj.」，中文重複兩次；下一列「She has enough money to buy it if she were minded to do so.／如果她想買下它，她有的是錢。」是例句，不列為詞條。"),
    (11, "coefficient alpha、DNA mutation、t-score、X inactivation、z-score 的中文以英文字母開頭（a／DNA／T／X／Z），已歸回中文。"),
    (0, "第 4–5 頁末與第 14–15 頁重複了第 1 頁的 17 個詞條（face validity、attention、medulla、Parkinson's disease 等），合併為一個學習詞條並保留每一處的頁碼。"),
    (0, "PDF 共 465 列，合併重複後為 448 個學習詞條。"),
    (0, "第 12–14 頁有多個人名被機器逐字直譯（Daniel Offer「丹尼爾報價」、cab Calloway「出租車卡洛威」、Thomas Inset「托馬斯插圖」、Henry dryer「亨利烘乾機」），以及一般語句或句子殘段（Have you heard?、faking it、as fierce as、in the brain、human memory「人類的記憶有關。」），已列入更正建議。"),
    (0, "詞表混合了腦科學、心理測驗與教育評量（效度、常模、檔案評量）、生活英文（owl／lark、hare、bait）與科技名詞（Arduino、Bluetooth、hackathons），App 依概念分單元。"),
    (0, "全份 PDF 為英中對照詞彙表（PVQC 腦科學專業級 Beta），沒有定義、例句、音標或圖片；App 中這些欄位皆為 AI 補充並標示來源。"),
]
