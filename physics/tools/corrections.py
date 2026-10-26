# -*- coding: utf-8 -*-
"""疑似錯誤清單：只提供建議，不覆寫 source.json 的原文。

每筆：(英文詞條, 欄位, 原始內容, 建議修正, 原因, 嚴重度)
嚴重度：high = 明顯錯字/錯誤數值；medium = 用詞不精確或與臺灣高中課本慣用不同；low = 格式、異體字或非物理義項
"""

CORRECTIONS = [
    ("femtometer", "zh", "飛米；飛米(10-21m)", "飛米（10⁻¹⁵ m）", "飛米 femto- 為 10⁻¹⁵，原文 10-21 數值錯誤（10⁻²¹ 為 zepto-）。", "high"),
    ("doping", "zh", "參雜", "摻雜", "半導體 doping 為「摻雜」，「參」為錯字。", "high"),
    ("charge-coupled device", "zh", "電荷耦合元件；僅稱CCD", "電荷耦合元件；簡稱 CCD", "「僅稱」應為「簡稱」。", "high"),
    ("envelope", "zh", "包络；包封", "包絡；包封", "「络」為簡體字，繁體為「絡」。", "medium"),
    ("donor", "zh", "施子", "施體（施子）", "臺灣半導體教材多稱「施體」，與受體 acceptor 對應。", "medium"),
    ("eye-lens", "zh", "目鏡", "接目鏡的眼透鏡（eye lens）；目鏡一般為 eyepiece", "eye lens 指目鏡中靠近眼睛的那片透鏡，或眼睛的水晶體；目鏡英文常用 eyepiece。", "medium"),
    ("ballistic transport", "zh", "無礙傳輸", "彈道傳輸", "ballistic transport 指載子不受散射的傳輸，學界多譯「彈道傳輸」。", "medium"),
    ("candela", "zh", "燭光；燭光 (亮度單位)", "燭光（發光強度單位，cd）", "candela 是發光強度（luminous intensity）單位，不是亮度；且「燭光」重複。", "medium"),
    ("wed", "en", "wed", "（疑似非物理詞彙，可能為誤植）", "wed（結婚、使結合）不是物理專有名詞，建議教師確認是否為其他詞（如 wedge 楔）誤植。", "medium"),
    ("gauge pressure", "zh", "計示壓", "錶壓力（計示壓力）", "臺灣課本常用「錶壓力」。", "low"),
    ("Coulomb blockade", "zh", "庫侖障礙", "庫侖阻塞", "奈米電子學多譯「庫侖阻塞」。", "low"),
    ("hot big bang", "zh", "大熱爆", "熱大霹靂", "與同 PDF 的「大霹靂理論」一致。", "low"),
    ("blue shift", "zh", "藍位移", "藍移", "天文學常用「藍移」（對應紅移）。", "low"),
    ("angular displacement", "zh", "角移", "角位移", "與 displacement 位移對應，課本用「角位移」。", "low"),
    ("Celsius degree", "zh", "攝度；攝氏度", "攝氏度", "「攝度」少用。", "low"),
    ("period", "zh", "周期", "週期", "臺灣課本慣用「週期」。", "low"),
    ("coordinate", "zh", "坐標", "座標", "臺灣課本慣用「座標」（兩者皆可）。", "low"),
    ("astronomical unit", "zh", "天文單位：簡稱 AU", "天文單位（AU）", "格式統一。", "low"),
    ("lens", "zh", "透鏡；鏡片；（照相機等的）鏡頭 ；給……攝影", "透鏡；鏡片；鏡頭", "「給……攝影」為動詞義，非物理用法。", "low"),
    ("force", "zh", "力；力量；力氣；武力；強迫；迫使；用力推進力", "力", "物理只取「力」，其餘為一般字典義項。", "low"),
    ("mechanics", "zh", "力學 ；機械學；技術性的部分；技術；技巧", "力學", "後段為一般字典義項。", "low"),
    ("conservation", "zh", "守恆；保存；(對資源的)保護；管理", "守恆", "物理用法為守恆。", "low"),
    ("component", "zh", "分量；構成要素；零件；成分；組成的；構成的", "分量；元件", "物理用法為（向量的）分量或電路元件。", "low"),
    ("coefficient", "zh", "係數；協同因素；共同作用的；合作的", "係數", "物理用法為係數。", "low"),
    ("circular", "zh", "圓的；圓形的；環形的；循環的；通知；公告；傳單", "圓的；圓形的；環形的", "「通知；公告；傳單」為名詞義，非物理用法。", "low"),
    ("restitution", "zh", "恢復；賠償；歸還；復職", "恢復（恢復係數 coefficient of restitution）", "物理用於碰撞的恢復係數。", "low"),
    ("Newton", "zh", "牛頓(人名)", "牛頓（人名）；newton 為力的單位 N", "人名大寫，單位小寫。", "low"),
    ("nature", "zh", "本性", "自然；本質", "物理語境多指自然或本質。", "low"),
    ("femtometer", "en", "femtometer", "femtometer（又稱 fermi）", "核物理常用 fermi 表示 10⁻¹⁵ m。", "low"),
    ("aether", "zh", "以太；高處清新空氣", "以太（古典物理假想的傳光介質）", "與 ether 為同一概念的不同拼法。", "low"),
    ("gas", "zh", "氣[體]", "氣體", "方括號格式。", "low"),
    ("capacitor", "zh", "電容[器]", "電容器", "方括號格式。", "low"),
    ("charge", "zh", "[電]荷", "電荷", "方括號格式。", "low"),
    ("action at a distance", "zh", "超距力 ； 超距作用", "超距作用；超距力", "空白格式。", "low"),
]

LAYOUT_ISSUES = [
    (1, "第 1 頁頁首「PVQC for Physics (Beta Version) Specialist／物理 專業級／Terms／Chinese Traditional」與日期為表頭，不列入詞條；各頁「LIT SP n」為頁尾。"),
    (5, "circular 的中文解釋跨兩行（「傳」「單」被斷開），已合併為一個詞條。"),
    (6, "work-kinetic energy theorem 的英文跨兩行，已合併。"),
    (9, "alpha decay 的中文在文字層中比英文高一行，已依版面對齊。"),
    (0, "全份 PDF 為英中對照詞彙表（PVQC 物理專業級），沒有定義、例句、音標或圖片；App 中這些欄位皆為 AI 補充並標示來源。"),
    (0, "詞條由數段 Z→A 反向字母序組成（單字一段、片語一段等），並非依概念排列；App 依概念重新分單元，並保留原始順序檢視。"),
    (0, "部分詞條附有非物理的一般字典義項（如 force、lens、circular），以及同義重複（ether／aether、focus／focal point、wave crest／crest），App 以更正建議與相關詞標示。"),
]
