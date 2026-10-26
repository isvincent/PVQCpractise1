// Teaching schematics (set A): cells, organelles, microscopy, molecular biology, genetics.
// Each value is a self-contained SVG (viewBox 0 0 320 200) drawn for a light card background.
export default {
"cell-animal": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-cell-animal-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-cell-animal-t">動物細胞構造</title>
<ellipse cx="100" cy="100" rx="92" ry="80" fill="#fee2e2" stroke="#334155" stroke-width="2"/>
<path d="M130 66q8 8 0 15q-8 8 0 15q8 8 0 15M140 62q8 9 0 17q-8 8 0 16q8 9 0 17" fill="none" stroke="#0ea5e9" stroke-width="3"/>
<path d="M144 62q8 9 0 17q-8 8 0 16q8 9 0 17" fill="none" stroke="#1e3a8a" stroke-width="2.4" stroke-dasharray="0 6" stroke-linecap="round" transform="translate(4 0)"/>
<ellipse cx="52" cy="62" rx="20" ry="10" fill="#fdba74" stroke="#334155"/><path d="M36 62l5-6l5 12l5-12l5 12l5-12l5 6" fill="none" stroke="#9a3412"/>
<circle cx="95" cy="100" r="28" fill="#c7d2fe" stroke="#334155" stroke-width="1.5"/><circle cx="100" cy="96" r="8" fill="#6366f1"/>
<path d="M120 140q20-10 40 0M122 149q18-9 36 0M125 158q15-8 30 0" fill="none" stroke="#a855f7" stroke-width="4" stroke-linecap="round"/><circle cx="168" cy="136" r="3.5" fill="#d8b4fe" stroke="#a855f7"/>
<rect x="45" y="136" width="14" height="6" fill="#16a34a"/><rect x="62" y="132" width="6" height="14" fill="#16a34a"/>
<g stroke="#64748b" fill="none"><path d="M170 48L208 22M72 60L208 53M150 86L208 85M108 124L208 118M162 148L208 149M64 147L90 172L208 180"/></g>
<g fill="#1e293b"><text x="212" y="20">細胞膜<tspan x="212" dy="11" font-size="10" fill="#475569">cell membrane</tspan></text><text x="212" y="52">粒線體<tspan x="212" dy="11" font-size="10" fill="#475569">mitochondrion</tspan></text><text x="212" y="84">內質網<tspan x="212" dy="11" font-size="10" fill="#475569">rough ER</tspan></text><text x="212" y="116">細胞核<tspan x="212" dy="11" font-size="10" fill="#475569">nucleus</tspan></text><text x="212" y="148">高基氏體<tspan x="212" dy="11" font-size="10" fill="#475569">Golgi apparatus</tspan></text><text x="212" y="178">中心粒<tspan x="212" dy="11" font-size="10" fill="#475569">centriole</tspan></text></g></svg>`,

"cell-plant": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-cell-plant-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-cell-plant-t">植物細胞構造</title>
<rect x="10" y="14" width="190" height="172" rx="10" fill="#d9f99d" stroke="#3f6212" stroke-width="2"/>
<rect x="17" y="21" width="176" height="158" rx="7" fill="#f7fee7" stroke="#334155"/>
<rect x="45" y="40" width="120" height="95" rx="30" fill="#bae6fd" stroke="#0369a1" stroke-width="1.5"/>
<circle cx="55" cy="152" r="17" fill="#c7d2fe" stroke="#334155" stroke-width="1.5"/><circle cx="59" cy="149" r="5" fill="#6366f1"/>
<g fill="#22c55e" stroke="#166534"><ellipse cx="32" cy="80" rx="6" ry="12"/><ellipse cx="30" cy="115" rx="6" ry="12"/><ellipse cx="182" cy="60" rx="6" ry="12"/><ellipse cx="120" cy="162" rx="13" ry="6"/><ellipse cx="182" cy="165" rx="6" ry="10"/><ellipse cx="100" cy="30" rx="12" ry="5"/></g>
<g stroke="#64748b" fill="none"><path d="M197 40L208 30M188 62L208 66M160 100L208 106M72 148L208 146"/></g>
<g fill="#1e293b"><text x="212" y="28">細胞壁<tspan x="212" dy="11" font-size="10" fill="#475569">cell wall</tspan></text><text x="212" y="64">葉綠體<tspan x="212" dy="11" font-size="10" fill="#475569">chloroplast</tspan></text><text x="212" y="104">中央液泡<tspan x="212" dy="11" font-size="10" fill="#475569">central vacuole</tspan></text><text x="212" y="144">細胞核<tspan x="212" dy="11" font-size="10" fill="#475569">nucleus</tspan></text></g></svg>`,

"prokaryote": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-prokaryote-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-prokaryote-t">細菌（原核細胞）構造</title>
<style>@media (prefers-reduced-motion:no-preference){.prokaryote-fl{animation:prokaryote-w 1.6s ease-in-out infinite alternate;transform-origin:224px 104px}}@keyframes prokaryote-w{to{transform:scaleY(-1)}}</style>
<g stroke="#64748b" stroke-width="1.5"><path d="M90 62l-3-20M120 60l-2-20M150 60l1-20M180 62l3-20M100 146l-2 18M200 146l3 18"/></g>
<path class="prokaryote-fl" d="M224 104c15-15 25 15 40 0s25 15 40 0" fill="none" stroke="#0f766e" stroke-width="2.5"/>
<rect x="36" y="56" width="196" height="96" rx="48" fill="#fef9c3" stroke="#ca8a04" stroke-dasharray="4 3"/>
<rect x="44" y="64" width="180" height="80" rx="40" fill="#fde68a" stroke="#92400e" stroke-width="3"/>
<rect x="50" y="70" width="168" height="68" rx="34" fill="#fff7ed" stroke="#334155"/>
<path d="M95 100q10-18 20 0t20 0t20 0t20 0M100 110q10 12 20 0t20 0t20 0" fill="none" stroke="#7c3aed" stroke-width="2"/>
<g fill="none" stroke="#db2777" stroke-width="2"><circle cx="192" cy="96" r="7"/><circle cx="78" cy="118" r="6"/></g>
<g stroke="#64748b" fill="none"><path d="M64 33L86 48M224 34L214 64M50 168L70 143M150 170L140 106M240 168L195 102"/></g>
<g fill="#1e293b"><text x="22" y="30">線毛 pili</text><text x="204" y="30">莢膜 capsule</text><text x="312" y="80" text-anchor="end">鞭毛 flagellum</text><text x="10" y="180">細胞壁 cell wall<tspan x="10" dy="12" font-size="10" fill="#475569">（肽聚糖 peptidoglycan）</tspan></text><text x="150" y="182" text-anchor="middle">擬核區 nucleoid</text><text x="236" y="180">質體 plasmid</text></g></svg>`,

"nucleus": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-nucleus-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-nucleus-t">細胞核構造</title>
<circle cx="120" cy="100" r="80" fill="#ede9fe" stroke="#334155" stroke-width="2"/>
<circle cx="120" cy="100" r="74" fill="#f5f3ff" stroke="#334155" stroke-width="1.5"/>
<g fill="#fff" stroke="#0891b2" stroke-width="2"><circle cx="186.7" cy="61.5" r="4.5"/><circle cx="106.6" cy="24.2" r="4.5"/><circle cx="44.2" cy="86.6" r="4.5"/><circle cx="70.5" cy="159" r="4.5"/><circle cx="146.3" cy="172.4" r="4.5"/></g>
<circle cx="135" cy="110" r="20" fill="#8b5cf6" stroke="#5b21b6"/>
<path d="M70 80q8-10 16 0t16 0M78 130q6 8 12 0t12 0t12 0M120 52q8 8 16 0t16 0M140 140q6-8 12 0t12 0t12 0M64 108q6 6 12 0t12 0" fill="none" stroke="#db2777" stroke-width="1.6"/>
<g stroke="#64748b" fill="none"><path d="M177 43L208 27M191 61L208 62M155 108L208 97M176 140L208 132M110 150L208 167"/></g>
<g fill="#1e293b"><text x="212" y="24">核膜<tspan x="212" dy="11" font-size="10" fill="#475569">nuclear envelope</tspan></text><text x="212" y="59">核孔<tspan x="212" dy="11" font-size="10" fill="#475569">nuclear pore</tspan></text><text x="212" y="94">核仁<tspan x="212" dy="11" font-size="10" fill="#475569">nucleolus</tspan></text><text x="212" y="129">染色質<tspan x="212" dy="11" font-size="10" fill="#475569">chromatin</tspan></text><text x="212" y="164">核質<tspan x="212" dy="11" font-size="10" fill="#475569">nucleoplasm</tspan></text></g></svg>`,

"endomembrane": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-endomembrane-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-endomembrane-t">內膜系統與分泌路徑</title>
<defs><marker id="endomembrane-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#334155"/></marker></defs>
<style>@media (prefers-reduced-motion:no-preference){.endomembrane-flow{animation:endomembrane-d 1.2s linear infinite}}@keyframes endomembrane-d{to{stroke-dashoffset:-10}}</style>
<circle cx="34" cy="100" r="26" fill="#c7d2fe" stroke="#334155" stroke-width="1.5"/>
<g fill="none" stroke="#0ea5e9" stroke-width="5" stroke-linecap="round"><path d="M57.1 72.4A36 36 0 0 1 57.1 127.6M63.6 64.8A46 46 0 0 1 63.6 135.2M70 57.1A56 56 0 0 1 70 142.9"/></g>
<path d="M72 54.4A59.5 59.5 0 0 1 72 145.6" fill="none" stroke="#1e3a8a" stroke-width="2.5" stroke-dasharray="0 5" stroke-linecap="round"/>
<circle cx="112" cy="100" r="7" fill="#fde68a" stroke="#b45309"/>
<g fill="none" stroke="#a855f7" stroke-width="6" stroke-linecap="round"><path d="M148 66q14 34 0 68M158 66q14 34 0 68M168 66q14 34 0 68M178 66q14 34 0 68"/></g>
<circle cx="215" cy="100" r="8" fill="#fde68a" stroke="#b45309"/><circle cx="213" cy="98" r="1.6" fill="#b45309"/><circle cx="218" cy="102" r="1.6" fill="#b45309"/>
<path d="M272 24V84C256 88 256 112 272 116V156M280 24V84C266 92 266 108 280 116V156" fill="none" stroke="#334155" stroke-width="2"/>
<g fill="#f59e0b"><circle cx="290" cy="96" r="2.2"/><circle cx="297" cy="104" r="2.2"/><circle cx="288" cy="108" r="2.2"/></g>
<g class="endomembrane-flow" stroke="#334155" stroke-width="1.6" stroke-dasharray="4 6" marker-end="url(#endomembrane-ah)"><path d="M92 100H102"/><path d="M121 100H143"/><path d="M192 100H205"/><path d="M225 100H254"/></g>
<g fill="#1e293b" text-anchor="middle"><text x="34" y="157">細胞核<tspan x="34" dy="11" font-size="10" fill="#475569">nucleus</tspan></text><text x="66" y="30">粗糙型內質網<tspan x="66" dy="12" font-size="10" fill="#475569">rough ER</tspan></text><text x="112" y="135">囊泡<tspan x="112" dy="11" font-size="10" fill="#475569">vesicle</tspan></text><text x="166" y="30">高基氏體<tspan x="166" dy="12" font-size="10" fill="#475569">Golgi</tspan></text><text x="215" y="135">分泌囊泡<tspan x="215" dy="11" font-size="10" fill="#475569">secretory vesicle</tspan></text><text x="276" y="172">胞吐分泌<tspan x="276" dy="11" font-size="10" fill="#475569">exocytosis</tspan></text></g></svg>`,

"ribosome": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-ribosome-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-ribosome-t">核糖體與 mRNA</title>
<style>@media (prefers-reduced-motion:no-preference){.ribosome-slide{animation:ribosome-s 2.4s linear infinite}}@keyframes ribosome-s{to{transform:translateX(-12px)}}</style>
<ellipse cx="160" cy="78" rx="62" ry="36" fill="#93c5fd" stroke="#334155" stroke-width="1.5"/>
<ellipse cx="160" cy="128" rx="54" ry="16" fill="#fcd34d" stroke="#334155" stroke-width="1.5"/>
<line x1="20" y1="114" x2="300" y2="114" stroke="#e11d48" stroke-width="3"/>
<g class="ribosome-slide"><path d="M26 114v6M38 114v6M50 114v6M62 114v6M74 114v6M86 114v6M98 114v6M110 114v6M122 114v6M134 114v6M146 114v6M158 114v6M170 114v6M182 114v6M194 114v6M206 114v6M218 114v6M230 114v6M242 114v6M254 114v6M266 114v6M278 114v6M290 114v6" stroke="#e11d48" stroke-width="1.5"/></g>
<g stroke="#64748b" fill="none"><path d="M82 46L108 62M60 162L110 134M244 160L244 121"/></g>
<g fill="#1e293b"><text x="14" y="36">大次單元<tspan x="14" dy="11" font-size="10" fill="#475569">large subunit</tspan></text><text x="14" y="168">小次單元<tspan x="14" dy="11" font-size="10" fill="#475569">small subunit</tspan></text><text x="230" y="172">mRNA 傳訊 RNA</text><text x="12" y="110" font-size="12" font-weight="bold">5′</text><text x="308" y="110" font-size="12" font-weight="bold" text-anchor="end">3′</text></g></svg>`,

"mitochondrion": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-mitochondrion-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-mitochondrion-t">粒線體構造</title>
<ellipse cx="140" cy="100" rx="120" ry="64" fill="#fed7aa" stroke="#334155" stroke-width="2"/>
<ellipse cx="140" cy="100" rx="110" ry="55" fill="#fef3c7" stroke="#c2410c" stroke-width="2"/>
<g fill="#fed7aa" stroke="#c2410c" stroke-width="2"><path d="M70 51V108a5 5 0 0 0 10 0V51M110 43V108a5 5 0 0 0 10 0V43M150 42V108a5 5 0 0 0 10 0V42M190 48V108a5 5 0 0 0 10 0V48M90 155V92a5 5 0 0 1 10 0V155M130 159V92a5 5 0 0 1 10 0V159M170 157V92a5 5 0 0 1 10 0V157M210 145V92a5 5 0 0 1 10 0V145"/></g>
<g fill="#b45309"><circle cx="240" cy="96" r="2"/><circle cx="234" cy="106" r="2"/><circle cx="246" cy="104" r="2"/><circle cx="56" cy="96" r="2"/><circle cx="50" cy="106" r="2"/></g>
<g stroke="#64748b" fill="none"><path d="M40 23L58 50M232 23L226 66M42 176L93 140M268 176L242 110"/></g>
<g fill="#1e293b"><text x="8" y="19">外膜 outer membrane</text><text x="196" y="19">內膜 inner membrane</text><text x="8" y="188">嵴 cristae（內膜摺疊）</text><text x="312" y="188" text-anchor="end">基質 matrix</text></g></svg>`,

"chloroplast": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-chloroplast-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-chloroplast-t">葉綠體構造</title>
<ellipse cx="150" cy="100" rx="130" ry="72" fill="#bbf7d0" stroke="#334155" stroke-width="2"/>
<ellipse cx="150" cy="100" rx="123" ry="65" fill="#ecfdf5" stroke="#15803d" stroke-width="1.5"/>
<g stroke="#16a34a" stroke-width="2.5"><path d="M93 99L137 89M93 113L137 103M163 96L207 103M163 82L207 90"/></g>
<g fill="#22c55e" stroke="#14532d"><rect x="67" y="82" width="26" height="6" rx="3"/><rect x="67" y="89" width="26" height="6" rx="3"/><rect x="67" y="96" width="26" height="6" rx="3"/><rect x="67" y="103" width="26" height="6" rx="3"/><rect x="67" y="110" width="26" height="6" rx="3"/><rect x="137" y="72" width="26" height="6" rx="3"/><rect x="137" y="79" width="26" height="6" rx="3"/><rect x="137" y="86" width="26" height="6" rx="3"/><rect x="137" y="93" width="26" height="6" rx="3"/><rect x="137" y="100" width="26" height="6" rx="3"/><rect x="207" y="86" width="26" height="6" rx="3"/><rect x="207" y="93" width="26" height="6" rx="3"/><rect x="207" y="100" width="26" height="6" rx="3"/><rect x="207" y="107" width="26" height="6" rx="3"/><rect x="207" y="114" width="26" height="6" rx="3"/></g>
<g stroke="#64748b" fill="none"><path d="M40 24L58 48M244 24L224 87M52 177L78 118M252 177L186 136"/></g>
<g fill="#1e293b"><text x="8" y="19">外膜 outer membrane</text><text x="206" y="19">類囊體 thylakoid</text><text x="8" y="189">葉綠餅 granum（類囊體堆疊）</text><text x="312" y="189" text-anchor="end">基質 stroma</text></g></svg>`,

"membrane": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-membrane-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-membrane-t">流體鑲嵌模型</title>
<defs><pattern id="membrane-pl" x="8" y="63" width="12" height="74" patternUnits="userSpaceOnUse"><path d="M4 12v22M8 12v22M4 62V40M8 62V40" stroke="#b45309" stroke-width="1.3"/><circle cx="6" cy="7" r="5" fill="#fbbf24" stroke="#92400e"/><circle cx="6" cy="67" r="5" fill="#fbbf24" stroke="#92400e"/></pattern></defs>
<rect x="8" y="63" width="304" height="74" fill="url(#membrane-pl)"/>
<ellipse cx="95" cy="100" rx="18" ry="46" fill="#a78bfa" stroke="#334155" stroke-width="1.5"/>
<ellipse cx="250" cy="100" rx="15" ry="44" fill="#60a5fa" stroke="#334155" stroke-width="1.5"/>
<path d="M250 56V36" stroke="#15803d" stroke-width="1.5"/><g fill="#4ade80" stroke="#15803d"><circle cx="250" cy="50" r="4"/><circle cx="244" cy="42" r="4"/><circle cx="256" cy="40" r="4"/><circle cx="250" cy="32" r="4"/></g>
<ellipse cx="160" cy="146" rx="16" ry="9" fill="#f472b6" stroke="#334155" stroke-width="1.5"/>
<g stroke="#64748b" fill="none"><path d="M30 27L38 63M95 160V147M200 160L172 150M270 22L258 37"/></g>
<g fill="#1e293b"><text x="10" y="22">磷脂雙層 phospholipid bilayer</text><text x="312" y="18" text-anchor="end">醣蛋白 glycoprotein</text><text x="120" y="52" fill="#475569">細胞外 outside</text><text x="226" y="160" fill="#475569">細胞質 cytoplasm</text><g text-anchor="middle"><text x="95" y="174">鑲嵌蛋白<tspan x="95" dy="12" font-size="10" fill="#475569">integral protein</tspan></text><text x="200" y="174">周邊蛋白<tspan x="200" dy="12" font-size="10" fill="#475569">peripheral protein</tspan></text></g></g></svg>`,

"channel": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-channel-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-channel-t">通道蛋白與運輸蛋白</title>
<defs><pattern id="channel-pl" x="0" y="70" width="12" height="60" patternUnits="userSpaceOnUse"><path d="M4 11v16M8 11v16M4 49V33M8 49V33" stroke="#b45309" stroke-width="1.3"/><circle cx="6" cy="6" r="5" fill="#fbbf24" stroke="#92400e"/><circle cx="6" cy="54" r="5" fill="#fbbf24" stroke="#92400e"/></pattern>
<marker id="channel-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#475569"/></marker></defs>
<style>@media (prefers-reduced-motion:no-preference){.channel-ion{animation:channel-m 3s linear infinite}}@keyframes channel-m{from{transform:translateY(-14px);opacity:0}20%{opacity:1}80%{opacity:1}to{transform:translateY(34px);opacity:0}}</style>
<rect x="6" y="70" width="308" height="60" fill="url(#channel-pl)"/>
<rect x="100" y="60" width="22" height="80" rx="9" fill="#60a5fa" stroke="#334155" stroke-width="1.5"/><rect x="138" y="60" width="22" height="80" rx="9" fill="#60a5fa" stroke="#334155" stroke-width="1.5"/>
<g class="channel-ion" fill="#f59e0b" stroke="#92400e"><circle cx="130" cy="52" r="4.5"/><circle cx="130" cy="100" r="4.5"/><circle cx="130" cy="148" r="4.5"/></g>
<rect x="208" y="58" width="44" height="84" rx="18" fill="#34d399" stroke="#334155" stroke-width="1.5"/><path d="M222 58h16v26a8 8 0 0 1 -16 0z" fill="#fff" stroke="#334155"/>
<rect x="225" y="70" width="10" height="10" fill="#f472b6" stroke="#9d174d"/><rect x="225" y="154" width="10" height="10" fill="#f472b6" stroke="#9d174d"/>
<g stroke="#475569" stroke-width="1.5" marker-end="url(#channel-ah)"><path d="M90 56V146"/><path d="M270 60V146"/></g>
<g fill="#1e293b"><text x="8" y="44" fill="#475569">細胞外</text><text x="8" y="160" fill="#475569">細胞內</text><g text-anchor="middle"><text x="130" y="20">通道蛋白<tspan x="130" dy="12" font-size="10" fill="#475569">channel protein</tspan></text><text x="230" y="20">運輸蛋白<tspan x="230" dy="12" font-size="10" fill="#475569">carrier protein</tspan></text></g><text x="140" y="178">離子 ion／水 water</text><text x="244" y="182">溶質 solute</text></g></svg>`,

"cytoskeleton": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-cytoskeleton-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-cytoskeleton-t">細胞骨架三種纖維</title>
<defs><marker id="cytoskeleton-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#475569"/></marker></defs>
<rect x="44" y="44" width="28" height="104" rx="3" fill="#dbeafe" stroke="#334155" stroke-width="1.5"/>
<g stroke-width="6" stroke-linecap="round" stroke-dasharray="0 7"><path d="M51 48V146M65 48V146" stroke="#3b82f6"/><path d="M58 51.5V146" stroke="#1d4ed8"/></g>
<ellipse cx="58" cy="44" rx="14" ry="5" fill="#fff" stroke="#334155" stroke-width="1.5"/>
<g fill="none" stroke-width="4"><path d="M156 46q12 13 0 25t0 25t0 25t0 25" stroke="#f59e0b"/><path d="M168 46q-12 13 0 25t0 25t0 25t0 25" stroke="#d97706"/></g>
<g stroke-width="7" stroke-linecap="round" stroke-dasharray="0 8"><path d="M262 48V148" stroke="#ef4444"/><path d="M268 52V148" stroke="#f87171"/></g>
<path d="M110 22H210" stroke="#475569" stroke-width="1.5" marker-end="url(#cytoskeleton-ah)"/>
<g fill="#1e293b" text-anchor="middle"><text x="96" y="26">粗</text><text x="226" y="26">細</text><text x="58" y="168">微管（最粗）<tspan x="58" dy="12" font-size="10" fill="#475569">microtubule</tspan><tspan x="58" dy="12" font-size="10" fill="#475569">≈25 nm</tspan></text><text x="162" y="168">中間絲<tspan x="162" dy="12" font-size="10" fill="#475569">intermediate filament</tspan><tspan x="162" dy="12" font-size="10" fill="#475569">≈10 nm</tspan></text><text x="265" y="168">微絲（最細）<tspan x="265" dy="12" font-size="10" fill="#475569">microfilament</tspan><tspan x="265" dy="12" font-size="10" fill="#475569">≈7 nm</tspan></text></g></svg>`,

"centrosome": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-centrosome-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-centrosome-t">中心體構造</title>
<g stroke="#3b82f6" stroke-width="2" stroke-linecap="round"><path d="M196 100H230M191.2 82L220.6 65M178 68.8L195 39.4M160 64V30M142 68.8L125 39.4M128.8 82L99.4 65M124 100H90M128.8 118L99.4 135M142 131.2L125 160.6M160 136V170M178 131.2L195 160.6M191.2 118L220.6 135"/></g>
<circle cx="160" cy="100" r="34" fill="#fef3c7" stroke="#f59e0b" stroke-dasharray="4 3" stroke-width="1.5"/>
<rect x="134" y="93" width="28" height="14" rx="2" fill="#16a34a" stroke="#14532d"/><path d="M134 97.5h28M134 102.5h28" stroke="#bbf7d0"/>
<circle cx="178" cy="100" r="8" fill="#dcfce7" stroke="#16a34a" stroke-width="4" stroke-dasharray="3.6 1.985"/>
<g stroke="#64748b" fill="none"><path d="M240 38L184 92M66 101H88M262 160L190 118"/></g>
<g fill="#1e293b"><text x="8" y="22" font-weight="bold" font-size="12">中心體 centrosome</text><text x="236" y="22">中心粒 ×2<tspan x="236" dy="12" font-size="10" fill="#475569">centriole 互相垂直</tspan></text><text x="8" y="98">微管<tspan x="8" dy="12" font-size="10" fill="#475569">microtubule</tspan></text><text x="314" y="172" text-anchor="end">中心粒周圍物質<tspan x="314" dy="12" font-size="10" fill="#475569">pericentriolar material</tspan></text></g></svg>`,

"microscope": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-microscope-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-microscope-t">複式光學顯微鏡</title>
<path d="M84 150V20" stroke="#facc15" stroke-width="3" stroke-dasharray="4 3" opacity=".8"/>
<path d="M128 172V110Q128 70 100 52" fill="none" stroke="#475569" stroke-width="14" stroke-linecap="round"/>
<rect x="40" y="172" width="110" height="14" rx="4" fill="#64748b" stroke="#334155"/>
<rect x="72" y="40" width="24" height="50" fill="#94a3b8" stroke="#334155"/><rect x="77" y="16" width="14" height="26" rx="2" fill="#cbd5e1" stroke="#334155"/>
<path d="M66 90h36l-5 8H71z" fill="#475569"/><rect x="72" y="98" width="9" height="18" rx="2" fill="#e2e8f0" stroke="#334155"/><rect x="87" y="98" width="8" height="13" rx="2" fill="#e2e8f0" stroke="#334155"/>
<rect x="50" y="124" width="82" height="6" fill="#334155"/><rect x="64" y="120" width="40" height="4" fill="#bae6fd" stroke="#0369a1" stroke-width=".8"/>
<rect x="76" y="130" width="16" height="8" fill="#94a3b8" stroke="#334155"/>
<circle cx="84" cy="160" r="8" fill="#fde047" stroke="#ca8a04" stroke-width="1.5"/>
<circle cx="128" cy="142" r="9" fill="#64748b" stroke="#334155"/><circle cx="128" cy="142" r="4" fill="#cbd5e1"/>
<g stroke="#64748b" fill="none"><path d="M52 25H76M56 103L72 108M60 133H76M42 155L76 159M176 58L124 74M176 116L118 126M176 146L138 143"/></g>
<g fill="#1e293b"><text x="8" y="22">目鏡<tspan x="8" dy="11" font-size="10" fill="#475569">eyepiece</tspan></text><text x="8" y="100">物鏡<tspan x="8" dy="11" font-size="10" fill="#475569">objective</tspan></text><text x="8" y="130" font-size="10">聚光器</text><text x="8" y="152">光源<tspan x="8" dy="11" font-size="10" fill="#475569">light</tspan></text><text x="180" y="62">鏡臂 arm</text><text x="180" y="120">載物臺 stage</text><text x="180" y="150">調節輪 focus knob</text><text x="180" y="30" fill="#475569" font-size="10">光路 light path（黃虛線）</text></g></svg>`,

"microscope-advanced": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-microscope-advanced-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-microscope-advanced-t">共軛焦螢光顯微鏡原理</title>
<rect x="14" y="58" width="58" height="24" rx="3" fill="#fecaca" stroke="#334155" stroke-width="1.5"/><text x="43" y="74" text-anchor="middle" font-size="10" fill="#7f1d1d">LASER</text>
<path d="M72 70H156V104" fill="none" stroke="#3b82f6" stroke-width="3"/>
<path d="M150 122L160 152L170 122" fill="#bfdbfe" fill-opacity=".6" stroke="#3b82f6" stroke-width="1.5"/>
<path d="M164 150V36" stroke="#22c55e" stroke-width="3"/><path d="M164 36V24" stroke="#22c55e" stroke-width="3"/>
<path d="M180 92V44" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3"/>
<path d="M148 58L172 82" stroke="#64748b" stroke-width="4"/>
<path d="M144 104h32l-6 18h-20z" fill="#cbd5e1" stroke="#334155"/>
<rect x="100" y="140" width="120" height="26" fill="#fef9c3" stroke="#334155"/>
<path d="M96 152H224" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="5 3"/><circle cx="160" cy="152" r="3.5" fill="#22c55e"/>
<g fill="#334155"><rect x="130" y="38" width="30" height="5"/><rect x="168" y="38" width="30" height="5"/></g>
<rect x="144" y="8" width="40" height="18" rx="3" fill="#c4b5fd" stroke="#334155"/>
<g stroke="#64748b" fill="none"><path d="M228 44H200M228 72H174M228 113H178M66 150L100 154"/></g>
<g fill="#1e293b"><text x="192" y="21">偵測器 detector</text><text x="232" y="48">針孔 pinhole</text><text x="232" y="76">二色鏡 dichroic</text><text x="232" y="117">物鏡 objective</text><text x="230" y="150">焦平面<tspan x="230" dy="12" font-size="10" fill="#475569">focal plane</tspan></text><text x="14" y="98">雷射 laser</text><text x="14" y="148">樣本<tspan x="14" dy="11" font-size="10" fill="#475569">specimen</tspan></text></g>
<g font-size="10" fill="#334155"><path d="M14 176h18" stroke="#3b82f6" stroke-width="3"/><text x="36" y="180">激發光 excitation</text><path d="M14 190h18" stroke="#22c55e" stroke-width="3"/><text x="36" y="194">螢光 emission</text><path d="M140 190h18" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3"/><text x="162" y="194">失焦光被針孔擋住</text></g></svg>`,

"xray": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-xray-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-xray-t">X 光繞射</title>
<style>@media (prefers-reduced-motion:no-preference){.xray-tw{animation:xray-p 2s ease-in-out infinite alternate}}@keyframes xray-p{from{opacity:.45}}</style>
<rect x="10" y="85" width="40" height="30" rx="4" fill="#64748b" stroke="#334155"/><text x="30" y="104" text-anchor="middle" font-size="10" fill="#fff">X 光管</text>
<path d="M50 100H136" stroke="#8b5cf6" stroke-width="4"/>
<g stroke="#a78bfa" stroke-width="1.3" stroke-dasharray="4 3"><path d="M165 100L280 40M165 100L280 70M165 100L280 100M165 100L280 130M165 100L280 160"/></g>
<rect x="135" y="85" width="30" height="30" fill="#e0f2fe" stroke="#334155" stroke-width="1.5"/>
<g fill="#0369a1"><circle cx="142" cy="92" r="2"/><circle cx="150" cy="92" r="2"/><circle cx="158" cy="92" r="2"/><circle cx="142" cy="100" r="2"/><circle cx="150" cy="100" r="2"/><circle cx="158" cy="100" r="2"/><circle cx="142" cy="108" r="2"/><circle cx="150" cy="108" r="2"/><circle cx="158" cy="108" r="2"/></g>
<rect x="280" y="24" width="24" height="152" rx="2" fill="#1e293b"/>
<g class="xray-tw" fill="#fde047"><circle cx="292" cy="40" r="3.5"/><circle cx="292" cy="70" r="4"/><circle cx="292" cy="100" r="5"/><circle cx="292" cy="130" r="4"/><circle cx="292" cy="160" r="3.5"/><circle cx="286" cy="55" r="2"/><circle cx="298" cy="85" r="2.5"/><circle cx="286" cy="115" r="2.5"/><circle cx="298" cy="145" r="2"/></g>
<g fill="#1e293b"><text x="60" y="80">X 光束<tspan x="60" dy="12" font-size="10" fill="#475569">X-ray beam</tspan></text><text x="150" y="134" text-anchor="middle">晶體 crystal</text><text x="270" y="18" text-anchor="end" fill="#475569" font-size="10">偵測器 detector</text><text x="312" y="192" text-anchor="end">繞射點 diffraction spots</text></g></svg>`,

"stain": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-stain-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-stain-t">玻片染色</title>
<style>@media (prefers-reduced-motion:no-preference){.stain-drop{animation:stain-f 2s ease-in infinite}}@keyframes stain-f{from{transform:translateY(-6px);opacity:0}30%{opacity:1}to{transform:translateY(22px);opacity:0}}</style>
<rect x="50" y="44" width="16" height="12" fill="#e5e7eb" stroke="#334155"/>
<rect x="36" y="56" width="44" height="56" rx="6" fill="#a78bfa" stroke="#334155" stroke-width="1.5"/><rect x="44" y="76" width="28" height="18" rx="2" fill="#fff"/><text x="58" y="89" text-anchor="middle" font-size="10" fill="#5b21b6">染劑</text>
<ellipse cx="160" cy="30" rx="14" ry="16" fill="#ef4444" stroke="#334155" stroke-width="1.5"/>
<path d="M152 44h16l-5 66h-6z" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/><path d="M155 80h10l-2.3 30h-5.4z" fill="#8b5cf6"/>
<path class="stain-drop" d="M160 116q6 8 0 12q-6-4 0-12z" fill="#8b5cf6"/>
<rect x="40" y="140" width="240" height="26" rx="2" fill="#e0f2fe" stroke="#334155" stroke-width="1.5"/>
<rect x="190" y="136" width="50" height="4" fill="#f0f9ff" stroke="#64748b"/>
<ellipse cx="160" cy="150" rx="26" ry="7" fill="#c084fc" stroke="#7e22ce"/>
<g stroke="#64748b" fill="none"><path d="M182 62L168 64M160 172V158M262 129L236 137"/></g>
<g fill="#1e293b"><text x="186" y="60">滴管 dropper</text><text x="58" y="128" text-anchor="middle">染劑 stain</text><text x="160" y="184" text-anchor="middle">標本 specimen</text><text x="312" y="126" text-anchor="end">蓋玻片 coverslip</text><text x="262" y="184" text-anchor="middle">載玻片 slide</text></g></svg>`,

"lab-solution": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-lab-solution-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-lab-solution-t">酸、弱酸與緩衝液的 pH</title>
<defs><linearGradient id="lab-solution-ph" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset=".25" stop-color="#f97316"/><stop offset=".4" stop-color="#facc15"/><stop offset=".5" stop-color="#22c55e"/><stop offset=".7" stop-color="#3b82f6"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs>
<g stroke="#334155" stroke-width="2"><path d="M23 70v44q0 7 7 7h40q7 0 7-7V70z" fill="#ef4444" fill-opacity=".85" stroke="none"/><path d="M123 70v44q0 7 7 7h40q7 0 7-7V70z" fill="#f59e0b" fill-opacity=".85" stroke="none"/><path d="M223 70v44q0 7 7 7h40q7 0 7-7V70z" fill="#22c55e" fill-opacity=".85" stroke="none"/><path d="M22 36v78q0 8 8 8h40q8 0 8-8V36M122 36v78q0 8 8 8h40q8 0 8-8V36M222 36v78q0 8 8 8h40q8 0 8-8V36" fill="none"/></g>
<g fill="#fff" font-weight="bold" font-size="12" text-anchor="middle"><text x="50" y="102">pH 1</text><text x="150" y="102">pH 4</text><text x="250" y="102">pH 7.4</text></g>
<rect x="20" y="158" width="280" height="12" rx="2" fill="url(#lab-solution-ph)" stroke="#334155"/>
<g fill="#334155"><path d="M36 150h8l-4 7zM96 150h8l-4 7zM144 150h8l-4 7z"/></g>
<g fill="#1e293b" text-anchor="middle"><text x="50" y="137">強酸<tspan x="50" dy="11" font-size="10" fill="#475569">strong acid</tspan></text><text x="150" y="137">弱酸<tspan x="150" dy="11" font-size="10" fill="#475569">weak acid</tspan></text><text x="250" y="137">緩衝液<tspan x="250" dy="11" font-size="10" fill="#475569">buffer：pH 穩定</tspan></text><text x="20" y="184">0</text><text x="160" y="184">7 中性</text><text x="300" y="184">14</text></g>
<g fill="#475569" font-size="10"><text x="34" y="184">← 酸性 acidic</text><text x="282" y="184" text-anchor="end">鹼性 basic →</text><text x="160" y="22" text-anchor="middle" font-size="11" fill="#1e293b">pH 刻度 scale</text></g></svg>`,

"dna": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-dna-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-dna-t">DNA 雙股螺旋與鹼基配對</title>
<g stroke-width="5"><path d="M37.5 60V90M72.5 90V120" stroke="#ef4444"/><path d="M37.5 90V120M72.5 60V90" stroke="#f59e0b"/><path d="M55 50V90" stroke="#3b82f6"/><path d="M55 90V130" stroke="#22c55e"/>
<path d="M107.5 60V90M142.5 60V90" stroke="#22c55e"/><path d="M107.5 90V120M142.5 90V120" stroke="#3b82f6"/><path d="M125 50V90" stroke="#ef4444"/><path d="M125 90V130" stroke="#f59e0b"/>
<path d="M177.5 60V90" stroke="#3b82f6"/><path d="M177.5 90V120" stroke="#22c55e"/><path d="M195 50V90" stroke="#22c55e"/><path d="M195 90V130" stroke="#3b82f6"/><path d="M212.5 60V90" stroke="#f59e0b"/><path d="M212.5 90V120" stroke="#ef4444"/>
<path d="M247.5 60V90M265 50V90" stroke="#ef4444"/><path d="M247.5 90V120M265 90V130" stroke="#f59e0b"/><path d="M282.5 60V90" stroke="#3b82f6"/><path d="M282.5 90V120" stroke="#22c55e"/></g>
<g fill="none" stroke-width="5" stroke-linecap="round"><path d="M20 90Q55 10 90 90T160 90T230 90T300 90" stroke="#475569"/><path d="M20 90Q55 170 90 90T160 90T230 90T300 90" stroke="#94a3b8"/></g>
<path d="M300 40L284 59" stroke="#64748b"/>
<g font-size="12" font-weight="bold" fill="#fff" text-anchor="middle"><rect x="30" y="152" width="22" height="20" rx="3" fill="#ef4444"/><text x="41" y="166">A</text><rect x="80" y="152" width="22" height="20" rx="3" fill="#f59e0b"/><text x="91" y="166">T</text><rect x="196" y="152" width="22" height="20" rx="3" fill="#3b82f6"/><text x="207" y="166">C</text><rect x="246" y="152" width="22" height="20" rx="3" fill="#22c55e"/><text x="257" y="166">G</text></g>
<g stroke="#334155" stroke-dasharray="3 2"><path d="M54 159H78M54 165H78M220 157H244M220 162H244M220 167H244"/></g>
<g fill="#1e293b" text-anchor="middle"><text x="160" y="20" font-weight="bold" font-size="12">雙股螺旋 double helix</text><text x="66" y="188">A–T：2 個氫鍵</text><text x="232" y="188">C–G：3 個氫鍵</text><text x="160" y="166" fill="#475569">互補配對</text><text x="268" y="36" font-size="10" fill="#475569">糖–磷酸骨架</text></g></svg>`,

"replication": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-replication-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-replication-t">DNA 半保留複製</title>
<style>@media (prefers-reduced-motion:no-preference){.replication-grow{stroke-dasharray:126;animation:replication-g 4s linear infinite}}@keyframes replication-g{from{stroke-dashoffset:126}70%,to{stroke-dashoffset:0}}</style>
<g stroke="#cbd5e1" stroke-width="2"><path d="M24 92v16M36 92v16M48 92v16M60 92v16M72 92v16M84 92v16M96 92v16M108 92v16M186 50v12M198 50v12M210 50v12M222 50v12M234 50v12M246 50v12M258 50v12M270 50v12M282 50v12M294 50v12M186 138v12M198 138v12M210 138v12M222 138v12M234 138v12M246 138v12M258 138v12M270 138v12M282 138v12M294 138v12"/></g>
<g fill="none" stroke="#1d4ed8" stroke-width="4"><path d="M14 92H120C140 92 150 50 175 50H306M14 108H120C140 108 150 150 175 150H306"/></g>
<g class="replication-grow" fill="none" stroke="#f97316" stroke-width="4"><path d="M180 62H306"/><path d="M180 138H306"/></g>
<circle cx="128" cy="100" r="9" fill="#fde047" stroke="#a16207" stroke-width="1.5"/>
<g fill="#1e293b"><text x="14" y="80">親代 DNA parental</text><text x="100" y="130" text-anchor="middle">解旋酶<tspan x="100" dy="12" font-size="10" fill="#475569">helicase</tspan></text><g text-anchor="end" font-size="10"><text x="306" y="42" fill="#1d4ed8">舊股 old strand</text><text x="306" y="78" fill="#c2410c">新股 new strand</text><text x="306" y="130" fill="#c2410c">新股 new strand</text><text x="306" y="166" fill="#1d4ed8">舊股 old strand</text></g><text x="160" y="190" text-anchor="middle" font-weight="bold">每個子代 DNA = 1 舊股 + 1 新股</text></g></svg>`,

"transcription": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-transcription-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-transcription-t">轉錄作用</title>
<defs><marker id="transcription-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#4338ca"/></marker></defs>
<g stroke="#cbd5e1" stroke-width="2"><path d="M16 98v12M28 98v12M40 98v12M52 98v12M64 98v12M76 98v12M88 98v12M100 98v12M250 98v12M262 98v12M274 98v12M286 98v12M298 98v12"/></g>
<g fill="none" stroke-width="3.5"><path d="M10 98H110C125 98 130 80 150 80H200C220 80 225 98 240 98H310" stroke="#60a5fa"/><path d="M10 110H110C125 110 130 128 150 128H200C220 128 225 110 240 110H310" stroke="#1d4ed8"/></g>
<ellipse cx="175" cy="104" rx="48" ry="34" fill="#a5b4fc" fill-opacity=".5" stroke="#4338ca" stroke-width="1.5"/>
<path d="M190 120H150C120 120 110 80 100 50C95 36 80 30 60 28" fill="none" stroke="#e11d48" stroke-width="3.5"/>
<g stroke="#e11d48" stroke-width="1.5"><path d="M154 120v6M162 120v6M170 120v6M178 120v6M186 120v6"/></g>
<path d="M232 156H284" stroke="#4338ca" stroke-width="2" marker-end="url(#transcription-ah)"/>
<path d="M236 46L205 76" stroke="#64748b"/>
<g fill="#1e293b"><text x="52" y="32" text-anchor="end" font-weight="bold">5′</text><text x="194" y="116" font-size="10" font-weight="bold" fill="#be123c">3′</text><text x="112" y="50" fill="#be123c">mRNA</text><text x="230" y="30">RNA 聚合酶<tspan x="230" dy="12" font-size="10" fill="#475569">RNA polymerase</tspan></text><text x="14" y="134">模板股<tspan x="14" dy="12" font-size="10" fill="#475569">template strand</tspan></text><text x="306" y="90" text-anchor="end">DNA</text><text x="258" y="174" text-anchor="middle" font-size="10" fill="#475569">轉錄方向</text></g></svg>`,

"translation": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-translation-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-translation-t">轉譯作用</title>
<style>@media (prefers-reduced-motion:no-preference){.translation-in{animation:translation-d 2.6s ease-out infinite}}@keyframes translation-d{from{transform:translateY(-10px);opacity:.3}50%,to{transform:none;opacity:1}}</style>
<ellipse cx="170" cy="96" rx="72" ry="42" fill="#bfdbfe" fill-opacity=".75" stroke="#334155" stroke-width="1.5"/>
<ellipse cx="170" cy="152" rx="82" ry="16" fill="#fde68a" stroke="#334155" stroke-width="1.5"/>
<path d="M10 140H310" stroke="#e11d48" stroke-width="3"/><path d="M130 136v8M170 136v8M210 136v8" stroke="#e11d48" stroke-width="1.5"/>
<g fill="#93c5fd" stroke="#334155"><path d="M86 50L98 42L110 60L126 70L140 80" fill="none" stroke="#64748b" stroke-width="2"/><circle cx="92" cy="44" r="6.5" fill="#a3e635"/><circle cx="104" cy="52" r="6.5" fill="#fb923c"/><circle cx="116" cy="62" r="6.5" fill="#c084fc"/><circle cx="128" cy="72" r="6.5" fill="#facc15"/><circle cx="142" cy="82" r="6.5" fill="#34d399"/></g>
<rect x="139" y="100" width="22" height="38" rx="5" fill="#a7f3d0" stroke="#334155"/><path d="M150 100V90" stroke="#334155" stroke-width="2"/><circle cx="150" cy="88" r="6.5" fill="#22d3ee" stroke="#334155"/>
<g class="translation-in"><rect x="179" y="100" width="22" height="38" rx="5" fill="#fbcfe8" stroke="#334155"/><path d="M190 100V90" stroke="#334155" stroke-width="2"/><circle cx="190" cy="88" r="6.5" fill="#f472b6" stroke="#334155"/><text x="190" y="133" text-anchor="middle" font-size="10" fill="#1e293b">AAG</text></g>
<text x="150" y="133" text-anchor="middle" font-size="10" fill="#1e293b">CGA</text>
<g font-size="11" text-anchor="middle" fill="#1e293b" font-weight="bold"><text x="110" y="157">AUG</text><text x="150" y="157">GCU</text><text x="190" y="157">UUC</text><text x="230" y="157">GGA</text></g>
<g stroke="#64748b" fill="none"><path d="M60 30L84 40M66 122L139 128M250 108L201 116M190 176V166M240 44L195 82"/></g>
<g fill="#1e293b"><text x="10" y="26">多肽鏈 polypeptide</text><text x="236" y="28">胺基酸<tspan x="236" dy="12" font-size="10" fill="#475569">amino acid</tspan></text><text x="252" y="62">核糖體<tspan x="252" dy="12" font-size="10" fill="#475569">ribosome</tspan></text><text x="254" y="106">tRNA<tspan x="254" dy="12" font-size="10" fill="#475569">轉送 RNA</tspan></text><text x="10" y="116">反密碼子<tspan x="10" dy="12" font-size="10" fill="#475569">anticodon</tspan></text><text x="190" y="188" text-anchor="middle">密碼子 codon</text><text x="10" y="158" font-size="10">5′ mRNA</text><text x="310" y="158" font-size="10" text-anchor="end">3′</text></g></svg>`,

"central-dogma": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-central-dogma-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-central-dogma-t">中心法則</title>
<defs><marker id="central-dogma-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#334155"/></marker></defs>
<style>@media (prefers-reduced-motion:no-preference){.central-dogma-flow{animation:central-dogma-d 1s linear infinite}}@keyframes central-dogma-d{to{stroke-dashoffset:-9}}</style>
<rect x="20" y="80" width="70" height="44" rx="8" fill="#bfdbfe" stroke="#334155" stroke-width="1.5"/><rect x="125" y="80" width="70" height="44" rx="8" fill="#fecdd3" stroke="#334155" stroke-width="1.5"/><rect x="230" y="80" width="80" height="44" rx="8" fill="#bbf7d0" stroke="#334155" stroke-width="1.5"/>
<g class="central-dogma-flow" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="6 3" marker-end="url(#central-dogma-ah)"><path d="M92 102H122"/><path d="M197 102H227"/><path d="M36 80C22 44 72 44 58 78"/></g>
<g text-anchor="middle" fill="#1e293b"><text x="55" y="100" font-size="13" font-weight="bold">DNA</text><text x="55" y="115" font-size="10">去氧核糖核酸</text><text x="160" y="100" font-size="13" font-weight="bold">RNA</text><text x="160" y="115" font-size="10">核糖核酸</text><text x="270" y="100" font-size="13" font-weight="bold">蛋白質</text><text x="270" y="115" font-size="10">protein</text>
<text x="107" y="62">轉錄</text><text x="107" y="75" font-size="10" fill="#475569">transcription</text><text x="212" y="62">轉譯</text><text x="212" y="75" font-size="10" fill="#475569">translation</text><text x="47" y="24">複製</text><text x="47" y="36" font-size="10" fill="#475569">replication</text>
<text x="107" y="144" font-size="10" fill="#475569">（細胞核）</text><text x="212" y="144" font-size="10" fill="#475569">（核糖體）</text><text x="160" y="182" font-weight="bold">遺傳訊息的流向 genetic information flow</text></g></svg>`,

"gene": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-gene-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-gene-t">基因座與對偶基因</title>
<g stroke="#334155" stroke-width="1.5"><rect x="88" y="28" width="24" height="56" rx="12" fill="#f9a8d4"/><rect x="88" y="76" width="24" height="96" rx="12" fill="#f9a8d4"/><rect x="188" y="28" width="24" height="56" rx="12" fill="#93c5fd"/><rect x="188" y="76" width="24" height="96" rx="12" fill="#93c5fd"/></g>
<g fill="#facc15" stroke="#334155"><rect x="88" y="114" width="24" height="10"/><rect x="188" y="114" width="24" height="10"/></g>
<g fill="#4ade80" stroke="#334155"><rect x="88" y="44" width="24" height="8"/><rect x="188" y="44" width="24" height="8"/></g>
<path d="M112 119H188M112 48H188" stroke="#64748b" stroke-dasharray="4 3"/>
<g font-size="13" font-weight="bold" fill="#1e293b"><text x="80" y="124" text-anchor="end">A</text><text x="220" y="124">a</text><text x="80" y="53" text-anchor="end">B</text><text x="220" y="53">b</text></g>
<g fill="#1e293b" text-anchor="middle"><text x="150" y="18" font-weight="bold">同源染色體 homologous chromosomes</text><text x="150" y="113">基因座 locus</text><text x="150" y="140">對偶基因<tspan x="150" dy="12" font-size="10" fill="#475569">alleles（A / a）</tspan></text><text x="100" y="188" font-size="10" fill="#475569">來自母方</text><text x="200" y="188" font-size="10" fill="#475569">來自父方</text></g>
<g fill="#1e293b" font-size="10"><text x="238" y="76">基因 gene：</text><text x="238" y="90">染色體 DNA 上</text><text x="238" y="104">的特定片段</text></g></svg>`,

"chromosome": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-chromosome-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-chromosome-t">複製後的染色體</title>
<g stroke="#334155" stroke-width="1.5"><g transform="translate(141 100)"><g transform="rotate(-12)"><rect x="-11" y="-62" width="22" height="64" rx="11" fill="#60a5fa"/><rect x="-11" y="-44" width="22" height="6" fill="#fde047"/></g><g transform="rotate(12)"><rect x="-11" y="-2" width="22" height="64" rx="11" fill="#60a5fa"/><rect x="-11" y="30" width="22" height="6" fill="#f472b6"/></g></g>
<g transform="translate(159 100)"><g transform="rotate(12)"><rect x="-11" y="-62" width="22" height="64" rx="11" fill="#93c5fd"/><rect x="-11" y="-44" width="22" height="6" fill="#fde047"/></g><g transform="rotate(-12)"><rect x="-11" y="-2" width="22" height="64" rx="11" fill="#93c5fd"/><rect x="-11" y="30" width="22" height="6" fill="#f472b6"/></g></g></g>
<circle cx="150" cy="100" r="7" fill="#f43f5e" stroke="#334155" stroke-width="1.5"/>
<g stroke="#64748b" fill="none"><path d="M96 58L124 62M206 58L180 62M196 101H158"/></g>
<g fill="#1e293b"><text x="10" y="50">姊妹染色分體<tspan x="10" dy="12" font-size="10" fill="#475569">sister chromatid</tspan></text><text x="210" y="50">姊妹染色分體<tspan x="210" dy="12" font-size="10" fill="#475569">sister chromatid</tspan></text><text x="200" y="105">著絲點 centromere</text><text x="160" y="188" text-anchor="middle">兩條分體 DNA 相同（同位置有相同基因）</text></g></svg>`,

"cell-cycle": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-cell-cycle-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-cell-cycle-t">細胞週期</title>
<defs><marker id="cell-cycle-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#475569"/></marker></defs>
<style>@media (prefers-reduced-motion:no-preference){.cell-cycle-spin{animation:cell-cycle-r 12s linear infinite;transform-origin:110px 100px}}@keyframes cell-cycle-r{to{transform:rotate(360deg)}}</style>
<g stroke="#334155" stroke-width="1.5"><path d="M110 100L110 20A80 80 0 0 1 157 164.7Z" fill="#86efac"/><path d="M110 100L157 164.7A80 80 0 0 1 33.9 124.7Z" fill="#93c5fd"/><path d="M110 100L33.9 124.7A80 80 0 0 1 63 35.3Z" fill="#fcd34d"/><path d="M110 100L63 35.3A80 80 0 0 1 110 20Z" fill="#f9a8d4"/></g>
<path class="cell-cycle-spin" d="M140.8 15.4A90 90 0 0 1 198.6 84.4" fill="none" stroke="#475569" stroke-width="2" marker-end="url(#cell-cycle-ah)"/>
<g text-anchor="middle" fill="#1e293b"><text x="154" y="84" font-size="13" font-weight="bold">G1</text><text x="154" y="98" font-size="10">生長</text><text x="95" y="140" font-size="13" font-weight="bold">S</text><text x="95" y="154" font-size="10">DNA 複製</text><text x="66" y="84" font-size="13" font-weight="bold">G2</text><text x="66" y="98" font-size="10">準備分裂</text><text x="94" y="52" font-size="13" font-weight="bold">M</text></g>
<g fill="#1e293b"><rect x="210" y="31" width="10" height="10" fill="#86efac" stroke="#334155"/><text x="224" y="40">G1 期：細胞生長</text><rect x="210" y="53" width="10" height="10" fill="#93c5fd" stroke="#334155"/><text x="224" y="62">S 期：DNA 複製</text><rect x="210" y="75" width="10" height="10" fill="#fcd34d" stroke="#334155"/><text x="224" y="84">G2 期：準備分裂</text><rect x="210" y="97" width="10" height="10" fill="#f9a8d4" stroke="#334155"/><text x="224" y="106">M 期：細胞分裂</text><text x="210" y="138" font-weight="bold">間期 interphase</text><text x="210" y="152" font-size="10" fill="#475569">= G1 + S + G2（最長）</text><text x="210" y="172" font-size="10" fill="#475569">箭頭：週期進行方向</text></g></svg>`,

"mitosis": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-mitosis-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-mitosis-t">有絲分裂四個時期</title>
<defs><path id="mitosis-x" d="M-4-7Q0 0-4 7M4-7Q0 0 4 7" fill="none" stroke-width="3.2" stroke-linecap="round"/><path id="mitosis-l" d="M4-7Q-4 0 4 7" fill="none" stroke-width="3.2" stroke-linecap="round"/><path id="mitosis-r" d="M-4-7Q4 0-4 7" fill="none" stroke-width="3.2" stroke-linecap="round"/></defs>
<g fill="#fef3c7" stroke="#334155" stroke-width="1.5"><circle cx="44" cy="82" r="32"/><circle cx="120" cy="82" r="32"/><ellipse cx="196" cy="82" rx="36" ry="30"/><path d="M272 68A22 22 0 1 0 272 96A22 22 0 1 0 272 68Z"/></g>
<circle cx="44" cy="82" r="20" fill="none" stroke="#64748b" stroke-dasharray="3 3"/>
<g stroke="#16a34a" stroke-width=".9"><path d="M92 82L116 63M92 82L116 76M92 82L116 89M92 82L116 102M148 82L124 63M148 82L124 76M148 82L124 89M148 82L124 102M164 82L180 64M164 82L180 76M164 82L180 88M164 82L180 100M228 82L212 64M228 82L212 76M228 82L212 88M228 82L212 100"/></g>
<g fill="#16a34a"><circle cx="30" cy="56" r="2.6"/><circle cx="58" cy="56" r="2.6"/><circle cx="92" cy="82" r="2.6"/><circle cx="148" cy="82" r="2.6"/><circle cx="164" cy="82" r="2.6"/><circle cx="228" cy="82" r="2.6"/><circle cx="247" cy="70" r="2.2"/><circle cx="297" cy="70" r="2.2"/></g>
<use href="#mitosis-x" x="36" y="76" stroke="#ef4444"/><use href="#mitosis-x" x="51" y="76" stroke="#3b82f6"/><use href="#mitosis-x" x="38" y="92" stroke="#3b82f6"/><use href="#mitosis-x" x="51" y="91" stroke="#ef4444"/>
<use href="#mitosis-x" x="120" y="63" stroke="#ef4444"/><use href="#mitosis-x" x="120" y="76" stroke="#3b82f6"/><use href="#mitosis-x" x="120" y="89" stroke="#ef4444"/><use href="#mitosis-x" x="120" y="102" stroke="#3b82f6"/>
<use href="#mitosis-l" x="182" y="64" stroke="#ef4444"/><use href="#mitosis-l" x="182" y="76" stroke="#3b82f6"/><use href="#mitosis-l" x="182" y="88" stroke="#ef4444"/><use href="#mitosis-l" x="182" y="100" stroke="#3b82f6"/><use href="#mitosis-r" x="210" y="64" stroke="#ef4444"/><use href="#mitosis-r" x="210" y="76" stroke="#3b82f6"/><use href="#mitosis-r" x="210" y="88" stroke="#ef4444"/><use href="#mitosis-r" x="210" y="100" stroke="#3b82f6"/>
<g fill="none" stroke="#64748b" stroke-dasharray="2 2"><circle cx="257" cy="82" r="11"/><circle cx="287" cy="82" r="11"/></g>
<g stroke-width="2.4" stroke-linecap="round"><path d="M252 77l4 6M258 79l2 7M290 77l-4 6M284 79l-2 7" stroke="#ef4444"/><path d="M255 86l5-1M262 76l-1 5M282 76l1 5M289 86l-5-1" stroke="#3b82f6"/></g>
<g text-anchor="middle" fill="#1e293b"><g font-size="10" fill="#fff" font-weight="bold"><circle cx="44" cy="34" r="8" fill="#475569"/><text x="44" y="38">1</text><circle cx="120" cy="34" r="8" fill="#475569"/><text x="120" y="38">2</text><circle cx="196" cy="34" r="8" fill="#475569"/><text x="196" y="38">3</text><circle cx="272" cy="34" r="8" fill="#475569"/><text x="272" y="38">4</text></g>
<text x="44" y="136">前期<tspan x="44" dy="12" font-size="10" fill="#475569">prophase</tspan></text><text x="120" y="136">中期<tspan x="120" dy="12" font-size="10" fill="#475569">metaphase</tspan></text><text x="196" y="136">後期<tspan x="196" dy="12" font-size="10" fill="#475569">anaphase</tspan></text><text x="272" y="136">末期<tspan x="272" dy="12" font-size="10" fill="#475569">telophase</tspan></text>
<text x="160" y="182" font-size="10" fill="#475569">姊妹染色分體分離，平分到兩個子細胞（2n → 2n）</text></g></svg>`,

"meiosis": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-meiosis-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-meiosis-t">減數分裂</title>
<defs><path id="meiosis-x" d="M-4-8Q0 0-4 8M4-8Q0 0 4 8" fill="none" stroke-width="3.2" stroke-linecap="round"/><path id="meiosis-s" d="M-3-5Q0 0-3 5M3-5Q0 0 3 5" fill="none" stroke-width="3" stroke-linecap="round"/><path id="meiosis-c" d="M0-7V7" stroke-width="3.2" stroke-linecap="round"/><path id="meiosis-cs" d="M0-4V4" stroke-width="3" stroke-linecap="round"/>
<marker id="meiosis-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#475569"/></marker></defs>
<g fill="#ede9fe" stroke="#334155" stroke-width="1.5"><circle cx="40" cy="100" r="30"/><circle cx="130" cy="60" r="24"/><circle cx="130" cy="140" r="24"/><circle cx="250" cy="30" r="17"/><circle cx="250" cy="74" r="17"/><circle cx="250" cy="118" r="17"/><circle cx="250" cy="162" r="17"/></g>
<rect x="27" y="80" width="26" height="20" rx="6" fill="none" stroke="#a855f7" stroke-dasharray="2 2"/>
<use href="#meiosis-x" x="35" y="90" stroke="#ef4444"/><use href="#meiosis-x" x="45" y="90" stroke="#3b82f6"/><use href="#meiosis-s" x="35" y="112" stroke="#ef4444"/><use href="#meiosis-s" x="45" y="112" stroke="#3b82f6"/>
<use href="#meiosis-x" x="124" y="60" stroke="#ef4444"/><use href="#meiosis-s" x="138" y="61" stroke="#3b82f6"/><use href="#meiosis-x" x="124" y="140" stroke="#3b82f6"/><use href="#meiosis-s" x="138" y="141" stroke="#ef4444"/>
<use href="#meiosis-c" x="245" y="30" stroke="#ef4444"/><use href="#meiosis-cs" x="255" y="31" stroke="#3b82f6"/><use href="#meiosis-c" x="245" y="74" stroke="#ef4444"/><use href="#meiosis-cs" x="255" y="75" stroke="#3b82f6"/><use href="#meiosis-c" x="245" y="118" stroke="#3b82f6"/><use href="#meiosis-cs" x="255" y="119" stroke="#ef4444"/><use href="#meiosis-c" x="245" y="162" stroke="#3b82f6"/><use href="#meiosis-cs" x="255" y="163" stroke="#ef4444"/>
<g stroke="#475569" stroke-width="1.5" marker-end="url(#meiosis-ah)"><path d="M68 88L104 70"/><path d="M68 112L104 130"/><path d="M154 54L230 33"/><path d="M154 64L230 72"/><path d="M154 136L230 120"/><path d="M154 146L230 159"/></g>
<path d="M274 22h4v152h-4" fill="none" stroke="#64748b"/>
<g fill="#1e293b" text-anchor="middle"><text x="40" y="52">聯會→四分體<tspan x="40" dy="12" font-size="10" fill="#475569">tetrad</tspan></text><text x="40" y="148" font-weight="bold">2n</text><text x="130" y="102" font-size="10" fill="#475569">n（已複製）</text><text x="86" y="182">減數分裂 I<tspan x="86" dy="12" font-size="10" fill="#475569">同源染色體分離</tspan></text><text x="186" y="182">減數分裂 II<tspan x="186" dy="12" font-size="10" fill="#475569">姊妹染色分體分離</tspan></text><text x="298" y="90">4 個</text><text x="298" y="104">單倍體</text><text x="298" y="118" font-size="10" fill="#475569">haploid</text><text x="298" y="132" font-weight="bold">n</text></g></svg>`,

"gametes": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-gametes-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-gametes-t">配子形成</title>
<defs><marker id="gametes-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#475569"/></marker></defs>
<g stroke="#334155" stroke-width="1.3" fill="#bfdbfe"><circle cx="28" cy="50" r="14"/><circle cx="88" cy="50" r="16"/><circle cx="150" cy="30" r="12"/><circle cx="150" cy="70" r="12"/><circle cx="212" cy="20" r="8"/><circle cx="212" cy="40" r="8"/><circle cx="212" cy="60" r="8"/><circle cx="212" cy="80" r="8"/></g>
<path d="M265 50q5-5 10 0t10 0t10 0t10 0" fill="none" stroke="#334155" stroke-width="1.3"/><ellipse cx="258" cy="50" rx="7" ry="5" fill="#bfdbfe" stroke="#334155" stroke-width="1.3"/>
<g stroke="#334155" stroke-width="1.3" fill="#fecdd3"><circle cx="28" cy="140" r="14"/><circle cx="88" cy="140" r="18"/><circle cx="155" cy="140" r="18"/><circle cx="183" cy="116" r="6"/><circle cx="232" cy="140" r="20"/><circle cx="270" cy="124" r="5"/><circle cx="282" cy="140" r="5"/><circle cx="270" cy="156" r="5"/></g>
<g stroke="#475569" stroke-width="1.3" marker-end="url(#gametes-ah)"><path d="M44 50H70"/><path d="M105 44L136 32"/><path d="M105 56L136 68"/><path d="M163 26L202 20"/><path d="M163 33L202 39"/><path d="M163 67L202 60"/><path d="M163 74L202 79"/><path d="M222 50H250"/><path d="M44 140H68"/><path d="M108 140H135"/><path d="M108 132L175 117"/><path d="M175 140H210"/></g>
<g font-size="10" text-anchor="middle" fill="#1e293b"><text x="28" y="54">2n</text><text x="88" y="54">2n</text><text x="150" y="34">n</text><text x="150" y="74">n</text><text x="28" y="144">2n</text><text x="88" y="144">2n</text><text x="155" y="144">n</text><text x="232" y="144">n</text>
<text x="28" y="96">精原細胞</text><text x="88" y="96">初級<tspan x="88" dy="11">精母細胞</tspan></text><text x="150" y="96">次級<tspan x="150" dy="11">精母細胞</tspan></text><text x="212" y="102">精細胞 ×4</text><text x="270" y="72">精子 sperm</text>
<text x="28" y="186">卵原細胞</text><text x="88" y="178">初級<tspan x="88" dy="11">卵母細胞</tspan></text><text x="155" y="178">次級<tspan x="155" dy="11">卵母細胞</tspan></text><text x="232" y="186">卵 egg</text><text x="290" y="176">極體</text><text x="290" y="188">polar body</text></g></svg>`,

"fertilization": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-fertilization-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-fertilization-t">受精作用</title>
<defs><marker id="fertilization-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#334155"/></marker></defs>
<style>@media (prefers-reduced-motion:no-preference){.fertilization-swim{animation:fertilization-s 1.4s ease-in-out infinite alternate}}@keyframes fertilization-s{to{transform:translateX(5px)}}</style>
<g class="fertilization-swim"><path d="M51 90q-7-7-14 0t-14 0t-14 0" fill="none" stroke="#334155" stroke-width="1.5"/><ellipse cx="60" cy="90" rx="9" ry="6" fill="#93c5fd" stroke="#334155" stroke-width="1.5"/></g>
<text x="81" y="96" font-size="18" font-weight="bold" fill="#334155" text-anchor="middle">+</text>
<circle cx="130" cy="90" r="38" fill="none" stroke="#f9a8d4" stroke-width="3" stroke-dasharray="5 3"/>
<circle cx="130" cy="90" r="34" fill="#fecdd3" stroke="#334155" stroke-width="1.5"/><circle cx="130" cy="90" r="11" fill="#fda4af" stroke="#334155"/>
<path d="M176 90H210" stroke="#334155" stroke-width="2" marker-end="url(#fertilization-ah)"/>
<circle cx="262" cy="90" r="40" fill="#fde68a" stroke="#334155" stroke-width="1.5"/><circle cx="262" cy="90" r="14" fill="#fbbf24" stroke="#334155"/>
<g text-anchor="middle" fill="#1e293b"><text x="130" y="94" font-weight="bold">n</text><text x="262" y="94" font-weight="bold">2n</text><text x="193" y="80">受精</text><text x="40" y="124">精子 (n)<tspan x="40" dy="12" font-size="10" fill="#475569">sperm</tspan></text><text x="130" y="146">卵 (n)<tspan x="130" dy="12" font-size="10" fill="#475569">egg / ovum</tspan></text><text x="262" y="148">受精卵 (2n)<tspan x="262" dy="12" font-size="10" fill="#475569">zygote</tspan></text><text x="160" y="188" font-weight="bold">n + n = 2n　染色體數恢復為雙套</text></g></svg>`,

"punnett": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-punnett-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-punnett-t">棋盤方格 Aa × Aa</title>
<g stroke="#334155" stroke-width="1.5"><rect x="146" y="50" width="56" height="40" fill="#86efac"/><rect x="202" y="50" width="56" height="40" fill="#bbf7d0"/><rect x="146" y="90" width="56" height="40" fill="#bbf7d0"/><rect x="202" y="90" width="56" height="40" fill="#fecaca"/></g>
<g font-size="13" font-weight="bold" text-anchor="middle" fill="#1e293b"><text x="174" y="45">A</text><text x="230" y="45">a</text><text x="134" y="75">A</text><text x="134" y="115">a</text><text x="174" y="75">AA</text><text x="230" y="75">Aa</text><text x="174" y="115">Aa</text><text x="230" y="115">aa</text></g>
<g fill="#1e293b"><text x="160" y="17" text-anchor="middle" font-weight="bold" font-size="12">親代 Aa × Aa</text><text x="202" y="31" text-anchor="middle" font-size="10" fill="#475569">配子 gametes</text><text x="10" y="70" font-weight="bold">基因型 genotype</text><text x="10" y="86">AA : Aa : aa</text><text x="10" y="100">= 1 : 2 : 1</text><text x="10" y="124" font-weight="bold">表現型 phenotype</text><text x="10" y="140">顯性 : 隱性 = 3 : 1</text><text x="160" y="170" text-anchor="middle" font-size="10" fill="#475569">A = 顯性 dominant，a = 隱性 recessive</text></g>
<g font-size="10" fill="#334155"><rect x="146" y="180" width="10" height="10" fill="#bbf7d0" stroke="#334155"/><text x="160" y="189">顯性性狀</text><rect x="214" y="180" width="10" height="10" fill="#fecaca" stroke="#334155"/><text x="228" y="189">隱性性狀</text></g></svg>`,

"pedigree": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-pedigree-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-pedigree-t">譜系圖</title>
<g fill="none" stroke="#334155" stroke-width="1.5"><path d="M109 39H151M130 39V64M50 64H140M50 64V75M95 64V75M140 64V75M149 84H181M165 84V112M145 112H185M145 112V121M185 112V121"/></g>
<g stroke="#334155" stroke-width="1.8"><rect x="91" y="30" width="18" height="18" fill="#fff"/><circle cx="160" cy="39" r="9" fill="#fff"/><rect x="41" y="75" width="18" height="18" fill="#334155"/><circle cx="95" cy="84" r="9" fill="#334155"/><rect x="131" y="75" width="18" height="18" fill="#fff"/><circle cx="190" cy="84" r="9" fill="#fff"/><rect x="136" y="121" width="18" height="18" fill="#334155"/><circle cx="185" cy="130" r="9" fill="#fff"/></g>
<g fill="#475569" font-weight="bold"><text x="14" y="43">I</text><text x="14" y="88">II</text><text x="14" y="134">III</text></g>
<rect x="222" y="16" width="92" height="114" rx="6" fill="#f8fafc" stroke="#cbd5e1"/>
<g stroke="#334155" stroke-width="1.5"><rect x="230" y="26" width="12" height="12" fill="#fff"/><circle cx="236" cy="54" r="6" fill="#fff"/><rect x="230" y="70" width="12" height="12" fill="#334155"/><circle cx="236" cy="98" r="6" fill="#334155"/><path d="M229 120h14"/></g>
<g fill="#1e293b"><text x="248" y="36">男性 male</text><text x="248" y="58">女性 female</text><text x="248" y="80">男性患者</text><text x="248" y="102">女性患者</text><text x="248" y="124">婚配</text><text x="120" y="172" text-anchor="middle" font-size="10" fill="#475569">塗黑 = 患者 affected</text><text x="120" y="188" text-anchor="middle" font-size="10" fill="#475569">例：雙親正常卻生出患者 → 隱性遺傳</text></g></svg>`,

"sex-linked": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="il-sex-linked-t" font-family="system-ui,sans-serif" font-size="11"><title id="il-sex-linked-t">性染色體 X 與 Y</title>
<g stroke="#334155" stroke-width="1.5"><rect x="58" y="28" width="24" height="62" rx="12" fill="#f9a8d4"/><rect x="58" y="82" width="24" height="92" rx="12" fill="#f9a8d4"/><rect x="128" y="70" width="22" height="26" rx="11" fill="#93c5fd"/><rect x="128" y="90" width="22" height="60" rx="11" fill="#93c5fd"/></g>
<g stroke="#334155"><path d="M62 32h16v6H62zM132 73h14v5h-14z" fill="#cbd5e1"/><rect x="58" y="156" width="24" height="7" fill="#fde047"/><rect x="128" y="81" width="22" height="6" fill="#1d4ed8"/></g>
<g stroke="#64748b" fill="none"><path d="M90 24L78 32M118 24L134 72M52 160H58M154 84H150"/></g>
<g fill="#1e293b"><text x="104" y="20" text-anchor="middle" font-size="10">同源區段</text><text x="8" y="164" font-size="10">色盲基因</text><text x="156" y="82" font-weight="bold">SRY<tspan x="156" dy="12" font-size="10" font-weight="normal" fill="#475569">決定雄性</tspan></text><text x="70" y="190" text-anchor="middle" font-weight="bold">X 染色體</text><text x="139" y="168" text-anchor="middle" font-weight="bold">Y 染色體</text></g>
<rect x="212" y="20" width="102" height="128" rx="6" fill="#f8fafc" stroke="#cbd5e1"/>
<g stroke="#334155"><rect x="262" y="32" width="8" height="26" rx="4" fill="#f9a8d4"/><rect x="276" y="32" width="8" height="26" rx="4" fill="#f9a8d4"/><rect x="262" y="92" width="8" height="26" rx="4" fill="#f9a8d4"/><rect x="276" y="100" width="7" height="16" rx="3.5" fill="#93c5fd"/></g>
<g fill="#1e293b"><text x="220" y="50">女性</text><text x="220" y="110">男性</text><text x="273" y="76" text-anchor="middle" font-weight="bold" font-size="12">XX</text><text x="273" y="136" text-anchor="middle" font-weight="bold" font-size="12">XY</text><text x="257" y="168" text-anchor="middle" font-size="10" fill="#475569">X 上的隱性性狀</text><text x="257" y="182" text-anchor="middle" font-size="10" fill="#475569">男性較常見（如色盲）</text></g></svg>`
};
