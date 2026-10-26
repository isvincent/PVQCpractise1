# -*- coding: utf-8 -*-
"""疑似錯誤清單：只提供建議，不覆寫 source.json 的原文。

每筆：(英文詞條, 欄位, 原始內容, 建議修正, 原因, 嚴重度)
嚴重度：high = 明顯錯字、拼字錯誤或錯誤譯名；medium = 用詞不精確或與臺灣高中地科課本慣用不同；low = 格式、異體字或非地科義項
"""

CORRECTIONS = [
    ("granite", "zh", "花岡岩", "花崗岩", "「岡」為錯字，應為「崗」。", "high"),
    ("coma", "zh", "慧髮", "彗髮", "彗星的彗髮，「慧」為錯字。", "high"),
    ("host", "en", "host", "horst", "「地壘」的英文是 horst；host 意為主體、寄主，疑似拼字錯誤。", "high"),
    ("Hipparchus", "zh", "依巴谷星座", "喜帕恰斯（依巴谷，古希臘天文學家）", "Hipparchus 是人名，不是星座。", "high"),
    ("cynognathus", "zh", "犬頭龍", "犬頜獸", "Cynognathus 是三疊紀的獸孔類（似哺乳爬行動物），通用譯名為「犬頜獸」，不是恐龍。", "medium"),
    ("faunal", "zh", "化石", "動物群的（如 faunal succession 動物群演替）", "faunal 意為「動物群的」，不是化石（fossil）。", "medium"),
    ("galaxy", "zh", "銀河系", "星系（大寫 the Galaxy 才專指銀河系）", "galaxy 泛指星系；同 PDF 的 galaxy cluster 譯為星系團。", "medium"),
    ("binary", "zh", "二進制", "雙星（binary star）；二元的", "天文學中 binary 多指雙星。", "medium"),
    ("sidereal", "zh", "恆星", "恆星的（如 sidereal day 恆星日）", "sidereal 為形容詞。", "low"),
    ("magnitude", "zh", "量數值；星等；規模", "星等；規模（地震）；量值", "「量數值」不通順。", "low"),
    ("reverse polarity", "zh", "負向磁極", "反向磁極（逆磁極期）", "古地磁學中 reverse polarity 為「反向」，與 normal polarity「正向」相對。", "medium"),
    ("thermocline", "zh", "斜温層；斜温", "斜溫層", "「温」為異體字，臺灣用「溫」。", "low"),
    ("Ordovician", "zh", "奥陶紀；奥陶系", "奧陶紀；奧陶系", "「奥」為簡體字形，臺灣用「奧」。", "low"),
    ("lifting", "zh", "擧升", "舉升", "「擧」為異體字。", "low"),
    ("period", "zh", "紀；期；周期", "紀；期；週期", "臺灣慣用「週期」。", "low"),
    ("coordinate", "zh", "坐標", "座標", "臺灣課本慣用「座標」。", "low"),
    ("EL Nino", "en", "EL Nino", "El Niño", "大小寫與西班牙文字母 ñ。", "low"),
    ("La Nina", "en", "La Nina", "La Niña", "西班牙文字母 ñ。", "low"),
    ("occlude", "zh", "封閉；堵塞；阻擋；吸收；(牙齒)咬合", "封閉；囚錮（occluded front 囚錮鋒）", "氣象學中 occlusion 為「囚錮」；「(牙齒)咬合」非地科義項，且原文跨行。", "low"),
    ("Cambrian", "zh", "寒武紀；寒武系；威爾斯人；寒武紀；寒武系的；威爾斯的；威爾斯人的", "寒武紀；寒武系", "「寒武紀」重複出現，且含與地科無關的義項。", "low"),
    ("asteroid", "zh", "星狀的；小行星；海星；小游星", "小行星", "「海星」等為非天文義項。", "low"),
    ("celestial", "zh", "天球的；天的；天空的；天國的；神聖的；神仙；天堂裡的居民", "天球的；天體的", "後段為非地科義項。", "low"),
    ("tropical", "zh", "熱帶的；位於熱帶的；酷熱的；薄型織物；男子夏裝；熱帶魚", "熱帶的", "後段為非地科義項。", "low"),
    ("transgression", "zh", "海進；違反；違法；罪過", "海進", "後段為非地科義項。", "low"),
    ("landslide", "zh", "山崩；滑坡；(選舉的)壓倒性勝利", "山崩；滑坡", "「壓倒性勝利」為非地科義項。", "low"),
    ("joint", "zh", "節理；接頭；接合點；關節；連接；.連接的；聯合的", "節理", "多一個句點，且後段為非地科義項。", "low"),
    ("fault", "zh", "斷層；缺點；缺陷；錯誤；弄錯；產生斷層", "斷層", "後段為非地科義項。", "low"),
    ("gauge", "zh", "量；測；估計；測量儀器；規；表；計；標準尺寸；標準規格", "計；測量儀器（如 rain gauge 雨量計）", "地科常見用法為各種測量儀器。", "low"),
    ("normal", "zh", "正向的；正常的；正規的；標準的；標準；常態；法線", "正常的；正斷層（normal fault）；正向（磁極）", "地科常見用法：normal fault、normal polarity。", "low"),
    ("cambium", "zh", "形成層 ；新生組織", "形成層（植物學用語）", "屬植物學詞彙；多一個空白。", "low"),
    ("aerobe", "zh", "好氧生物；以空中氧氣維生的細菌", "好氧生物", "說明冗長。", "low"),
    ("Ceres", "zh", "1 號小行星；穀神星", "穀神星（1 號小行星，現歸類為矮行星）", "2006 年起穀神星歸類為矮行星（dwarf planet）。", "low"),
    ("parallax arcsecond", "zh", "秒差距", "秒差距（parsec 的由來：視差 1 角秒）", "parsec 即 parallax arcsecond 的縮寫，與 parsec 同義。", "low"),
    ("superposition", "zh", "疊積 ; 疊置", "疊置（疊置定律 law of superposition）", "半形分號格式。", "low"),
    ("action at a distance", "zh", "超距力 ； 超距作用", "超距作用；超距力", "空白格式。", "low"),
    ("angular displacement", "zh", "角移", "角位移", "課本用「角位移」。", "low"),
]

LAYOUT_ISSUES = [
    (1, "第 1 頁頁首「PVQC for Earth Sciences Specialist (Sample for Beta V 1.3)／地球科學 專業級」與日期為表頭；各頁右上頁碼與「Earth Sciences SP n」頁尾不列入詞條。"),
    (0, "此 PDF 每頁為左右兩欄，英文與中文緊接在同一行、沒有固定欄位，長的中文解釋會換到下一行（如 turbulence、polarity、observatory、debris flow 等十餘處），擷取時已合併。"),
    (3, "undulation 的中文以「(土地等的)」開頭，括號被排到英文那一側，已修正。"),
    (4, "occlude 的中文跨行，第二行以「(牙齒)咬合」開頭，已合併。"),
    (5, "Ceres 的中文「1 號小行星」中的數字緊接英文，已修正為 Ceres／1 號小行星；穀神星。"),
    (7, "warm-core（暖心）與 angular frequency（角頻；角頻率）在原 PDF 擠在同一列，已拆成兩個詞條；alpha decay 的「α」緊接英文，已歸回中文。"),
    (7, "第 7 頁最後 13 個詞（angular frequency、angular displacement、angular acceleration、Andromeda galaxy、alpha decay、adiabatic process、adhesive force、action at a distance、acoustics、accelerated motion、absorption spectrum、absolute zero、weak force）與 PVQC 物理專業級詞彙表的結尾完全相同，疑似由物理詞彙表誤植；App 仍保留並標示來源頁碼。"),
    (0, "同義或重複詞條：wavelength／wave length、pole star／Polaris、parsec／parallax arcsecond、galaxy cluster／cluster of galaxies、low pressure／low air pressure、landslide／landslip、fracture belt／fractured zone 等，App 以同義詞組標示，出題時不互為干擾選項。"),
    (0, "全份 PDF 為英中對照詞彙表（PVQC 地球科學專業級 Beta），沒有定義、例句、音標或圖片；App 中這些欄位皆為 AI 補充並標示來源。"),
]
