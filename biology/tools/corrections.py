# -*- coding: utf-8 -*-
"""疑似錯誤清單：只提供建議，不覆寫 source.json 的原文。

每筆：(英文詞條, 欄位, 原始內容, 建議修正, 原因, 嚴重度)
嚴重度：high = 明顯錯字/誤譯；medium = 用詞不精確或與臺灣高中課本慣用不同；low = 格式或補充說明
"""

CORRECTIONS = [
    ("transport protein", "zh", "運輸單不", "運輸蛋白", "「單不」為明顯錯字，transport protein 為膜上的運輸蛋白。", "high"),
    ("law of segregation", "zh", "分離率", "分離律", "孟德爾的「分離律」，「率」為同音錯字（同 PDF 另有「獨立分配律」）。", "high"),
    ("gametogenesis", "zh", "配子行成", "配子形成", "「行」為同音錯字。", "high"),
    ("canine hip dysphasia", "en", "canine hip dysphasia", "canine hip dysplasia", "dysphasia 是語言障礙；髖關節發育不良應為 dysplasia。", "high"),
    ("canine hip dysphasia", "zh", "髖關節退化症", "犬髖關節發育不良", "dysplasia 指發育不良，canine 指犬隻。", "medium"),
    ("myeloid", "zh", "骨髓的；脊椎的", "骨髓的；脊髓的", "myeloid 字根 myel- 指骨髓或脊髓，不是脊椎。", "high"),
    ("myelin", "zh", "髓素；神經髓；髓燐脂", "髓鞘質；髓磷脂", "「燐」為舊字，現行用「磷」。", "low"),
    ("myoblast", "zh", "肌細胞", "肌母細胞（成肌細胞）", "myoblast 是尚未融合的肌肉前驅細胞，肌細胞為 muscle cell。", "medium"),
    ("inheritance", "zh", "傳遞", "遺傳", "生物學上 inheritance 一般譯為遺傳。", "medium"),
    ("evolution", "zh", "演化學", "演化", "evolution 指演化現象；演化學為 evolutionary biology。", "medium"),
    ("selection", "zh", "自然篩選", "選擇；天擇（natural selection）", "selection 單獨使用時為「選擇」，天擇對應 natural selection。", "medium"),
    ("Bioinformation", "en", "Bioinformation", "bioinformatics", "「生物資訊學」英文為 bioinformatics；bioinformation 指生物資訊本身。", "medium"),
    ("Boyles law", "en", "Boyles law", "Boyle's law", "缺少所有格撇號。", "low"),
    ("adaption", "en", "adaption", "adaptation", "生物學標準用語為 adaptation；adaption 為少用變體。", "low"),
    ("antibiotic genes", "en", "antibiotic genes", "antibiotic resistance genes", "中文「抗抗生素基因」對應的英文應含 resistance。", "medium"),
    ("selective marker genes", "en", "selective marker genes", "selectable marker genes", "基因轉殖常用 selectable marker；中文可作「選擇性標記基因」。", "low"),
    ("confocal microscopy", "zh", "共軛顯微鏡", "共軛焦顯微鏡", "confocal 意為共焦點，臺灣慣用「共軛焦顯微鏡」。", "medium"),
    ("phase contrast microscope", "zh", "位相差顯微鏡", "相位差顯微鏡", "臺灣高中課本慣用「相位差顯微鏡」。", "low"),
    ("scanning probe microscope", "zh", "掃描式原子探測顯微鏡", "掃描探針顯微鏡", "scanning probe microscope 一般譯為掃描探針顯微鏡。", "medium"),
    ("blastocyst", "zh", "早期囊胚", "囊胚（胚泡）", "blastocyst 即囊胚，不限「早期」。", "low"),
    ("sister chromatids", "zh", "姐妹染色分體", "姊妹染色分體", "臺灣課本用字為「姊妹」。", "low"),
    ("cell cycle", "zh", "細胞周期", "細胞週期", "臺灣慣用「週期」（同 PDF 的 cyclin 也作「週期素」）。", "low"),
    ("carotenoid pigment", "zh", "類胡蘿卜色素; 類葉紅素色素", "類胡蘿蔔素色素", "「卜」與「蔔」混用；同 PDF 的 carotenoid 作「類胡蘿蔔素」。", "low"),
    ("carotenoid pathway", "zh", "類胡蘿卜素途徑", "類胡蘿蔔素途徑", "「卜」與「蔔」混用。", "low"),
    ("bacterial carotenoid", "zh", "細菌類胡蘿卜素", "細菌類胡蘿蔔素", "「卜」與「蔔」混用。", "low"),
    ("ribulose-1,5-bisphosphate", "zh", "五碳化合物雙磷酸核酮糖", "1,5-雙磷酸核酮糖（RuBP，五碳化合物）", "原譯把說明與名稱接在一起，易誤讀。", "low"),
    ("3-phosphoglycerate", "zh", "三碳的磷酸甘油酸", "3-磷酸甘油酸（PGA）", "3- 代表磷酸接在第 3 號碳，不是「三碳的」。", "medium"),
    ("glyceraldehyde-3-phosphate", "zh", "磷酸甘油醛", "3-磷酸甘油醛（G3P / PGAL）", "補上位置編號，與英文對應。", "low"),
    ("material and method", "zh", "設計實驗", "材料與方法", "material(s) and method(s) 是科學論文章節名稱。", "medium"),
    ("result", "zh", "分析結果", "結果", "論文章節 Results 一般譯「結果」。", "low"),
    ("cyclic flow", "zh", "循環式", "循環式電子流", "原譯缺少中心名詞（光反應的電子流）。", "low"),
    ("noncyclic flow", "zh", "非循環式", "非循環式電子流", "原譯缺少中心名詞（光反應的電子流）。", "low"),
    ("emergence", "zh", "突顯", "突現；湧現", "系統生物學中 emergence 多譯為突現或湧現。", "low"),
    ("lymphoid", "zh", "淋巴", "淋巴的；類淋巴的", "lymphoid 為形容詞。", "low"),
    ("Drosophila melanogaster", "zh", "果蠅", "黑腹果蠅", "melanogaster 為種小名，完整中文為黑腹果蠅。", "low"),
    ("micrographia", "en", "micrographia", "Micrographia（虎克著作名）/ micrographia（醫學：寫字過小症）", "兩個意義大小寫不同，建議分開。", "low"),
    ("acid", "zh", "酸的；有酸味的；酸性的 n.酸；有酸味的東西", "adj. 酸的；酸性的　n. 酸", "原文詞性標記格式不一致（缺少 adj.）。", "low"),
    ("invadosome", "zh", "侵襲體；(在癌細胞中)侵襲性偽足；侵犯僞足", "侵襲體；侵襲性偽足", "「偽」「僞」異體字混用，且有重複義項。", "low"),
    ("camptothecin", "zh", "喜樹鹼；喜樹堿", "喜樹鹼", "「鹼」「堿」為異體字重複。", "low"),
    ("camptothecin alkaloids", "zh", "喜樹生物鹼；喜樹生物堿", "喜樹生物鹼", "「鹼」「堿」為異體字重複。", "low"),
    ("multipotent", "zh", "多分化(幹細胞)", "多潛能（幹細胞）", "與 pluripotent「多能性」區分，臺灣常用「多潛能」。", "low"),
    ("Agrobacteria infection method", "en", "Agrobacteria infection method", "Agrobacterium-mediated transformation", "學術常用寫法；屬名單數為 Agrobacterium。", "low"),
    ("the origin of species", "en", "the origin of species", "On the Origin of Species", "達爾文著作書名，應大寫並含 On。", "low"),
    ("sorting center", "zh", "配送中心", "分選中心（如高基氏體的分選功能）", "原文無上下文，生物學中多指蛋白質分選。", "low"),
]

# PDF 本身的版面問題（擷取時已處理，列出供教師了解）
LAYOUT_ISSUES = [
    (8, "law of independent assortment／lactic acid fermentation／lactate fermentation 三列表格錯位，英文被斷到下一列，已依版面拆回三個詞條。"),
    (9, "genotyping 與 genotype 擠在同一列，已拆成兩個詞條。"),
    (13, "Agrobacteria infection method、aerobic respiration、adult stem cells、adaptive radiation 四列文字層錯位，已依版面拆開。"),
    (14, "acid cycle 與 acid 擠在同一列，已拆成兩個詞條。"),
    (1, "第 1 頁頁首「BIOLOGY SPECIALIST TERMS / CHINESE TRADITIONAL」為表頭，不列入詞條。"),
    (0, "全份 PDF 為英中對照詞彙表，沒有定義、例句、音標或圖片；App 中這些欄位皆為 AI 補充內容並標示來源。"),
    (0, "詞條在 PDF 中依字母反序（Z→A）排列；同義詞重複出現（如 Krebs cycle／citric acid cycle／tricarboxylic acid cycle、lactic／lactate fermentation），App 以「相關詞」連結。"),
]
