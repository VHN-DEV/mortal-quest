import{s as e,t as S,u as _,v as $,e as P,h as x,i as T,F as E,w as C,d as A,x as I,y as K,G as j,z as F,C as G,E as R,n as V,A as f,S as D,b as O,a as U,H as k,f as Q,P as Y,J as W,K as B,T as z,B as M,L as w,N as q,O as J,Q as X,U as Z,j as H,k as N,r as L}from"./index-nUI4cWzq.js";import"./vendor-capacitor-DNzPfH2b.js";import"./vendor-gsap-CzGW6FVa.js";const ee=[{floor:1,name:"Ngoại Tháp - Tầng 1",description:"Nơi tập trung các luyện dược sư trẻ tuổi tài năng.",minAlchemyLevel:3,rewards:{expMult:1.2}},{floor:2,name:"Nội Tháp - Tầng 2",description:"Chỉ dành cho những người có thần thức mạnh mẽ.",minAlchemyLevel:5,rewards:{expMult:1.5,qualityBonus:.1}},{floor:3,name:"Thánh Đan Điện",description:"Nơi cư ngụ của các bậc Đan Thánh.",minAlchemyLevel:7,rewards:{expMult:2,qualityBonus:.25}}];class ae{constructor(){this.shopSubFilter="all",this.shopQualityFilter="all",this.shopSearchQuery="",this.shopSortMode="default",this.initElements(),this.initEvents()}initElements(){this.btnAlchemyTabRecipes=document.getElementById("alchemy-tab-recipes"),this.btnAlchemyTabGarden=document.getElementById("alchemy-tab-garden"),this.viewAlchemyRecipes=document.getElementById("alchemy-recipes-view"),this.viewAlchemyGarden=document.getElementById("alchemy-garden-view"),this.elAlchemyLvlText=document.getElementById("alchemy-level-text"),this.elAlchemyExpBar=document.getElementById("alchemy-exp-bar"),this.elGardenPlots=document.getElementById("garden-plots"),this.elShopLingShi=document.getElementById("shop-ling-shi"),this.elShopBuyView=document.getElementById("shop-buy-view"),this.elShopSellView=document.getElementById("shop-sell-view"),this.elShopSellGrid=document.getElementById("shop-sell-grid"),this.elShopSectionNav=document.getElementById("shop-section-nav"),this.elShopSubFilterNav=document.getElementById("shop-subfilter-nav"),this.elShopQualityFilterNav=document.getElementById("shop-quality-filter-nav"),this.elShopFiltersWrap=document.getElementById("shop-filters-wrap"),this.btnShopTabBuy=document.getElementById("shop-tab-buy"),this.btnShopTabSell=document.getElementById("shop-tab-sell"),this.elShopSearchInput=document.getElementById("shop-search-input"),this.elShopSortSelect=document.getElementById("shop-sort-select"),this.elGuildCerts=document.getElementById("guild-cert-list"),this.elTechListView=document.getElementById("tech-list-view"),this.elTechDetailView=document.getElementById("tech-detail-view"),this.elTechDetailContent=document.getElementById("tech-detail-content"),this.elTechPoints=document.getElementById("tech-points"),this.btnTechTabCultivation=document.getElementById("tech-tab-cultivation"),this.btnTechTabSecret=document.getElementById("tech-tab-secret"),this.btnTechTabCustom=document.getElementById("tech-tab-custom"),this.btnTechBack=document.getElementById("tech-back-btn"),this.elGuildMissions=document.getElementById("guild-mission-list"),this.elGuildRooms=document.getElementById("guild-room-list"),this.elTowerFloors=document.getElementById("tower-floor-list"),this.elSectsView=document.getElementById("sects-view")}initEvents(){this.btnAlchemyTabRecipes&&(this.btnAlchemyTabRecipes.onclick=()=>{e.views.alchemy="recipes",this.renderAlchemy()}),this.btnAlchemyTabGarden&&(this.btnAlchemyTabGarden.onclick=()=>{e.views.alchemy="garden",this.renderAlchemy()}),this.btnShopTabBuy&&(this.btnShopTabBuy.onclick=()=>{e.views.shop="buy",this.renderShop()}),this.btnShopTabSell&&(this.btnShopTabSell.onclick=()=>{e.views.shop="sell",this.renderShop()}),this.elShopSearchInput&&(this.elShopSearchInput.oninput=n=>{this.shopSearchQuery=n.target.value.toLowerCase().trim(),this.renderShop()}),this.elShopSortSelect&&(this.elShopSortSelect.onchange=n=>{this.shopSortMode=n.target.value,this.renderShop()}),this.btnTechTabCultivation&&(this.btnTechTabCultivation.onclick=()=>this.renderTechniques("cultivation")),this.btnTechTabSecret&&(this.btnTechTabSecret.onclick=()=>this.renderTechniques("secret")),this.btnTechTabCustom&&(this.btnTechTabCustom.onclick=()=>this.renderTechniques("custom")),this.btnTechBack&&(this.btnTechBack.onclick=()=>{this.elTechListView.classList.remove("hidden"),this.elTechDetailView.classList.add("hidden")})}renderAlchemy(){if(!e.player)return;const n=document.getElementById("alchemy-tools-container");e.views.alchemy==="recipes"?(this.viewAlchemyRecipes.classList.remove("hidden"),this.viewAlchemyGarden.classList.add("hidden"),n&&n.classList.remove("hidden"),this.btnAlchemyTabRecipes&&(this.btnAlchemyTabRecipes.className="flex-grow py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all"),this.btnAlchemyTabGarden&&(this.btnAlchemyTabGarden.className="flex-grow py-3 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all")):(this.viewAlchemyRecipes.classList.add("hidden"),this.viewAlchemyGarden.classList.remove("hidden"),n&&n.classList.add("hidden"),this.btnAlchemyTabRecipes&&(this.btnAlchemyTabRecipes.className="flex-grow py-3 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all"),this.btnAlchemyTabGarden&&(this.btnAlchemyTabGarden.className="flex-grow py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all"));const i=S(e.player.alchemyLevel);this.elAlchemyLvlText.textContent=i.name;const s=Math.max(1,e.player.alchemyLevel*100*Math.pow(1.5,e.player.alchemyLevel-1));this.elAlchemyExpBar.style.width=`${Math.min(100,e.player.alchemyExp/s*100)}%`,e.views.alchemy==="recipes"?this.renderRecipes():this.renderGarden();const t=document.getElementById("alchemy-cauldron-name"),l=document.getElementById("alchemy-flame-name");if(t){const a=_(e.player.currentCauldron);a?t.innerHTML=`<span class="text-white">${a.name}</span>`:t.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`}if(l){const a=$(e.player.currentFlame);a?l.innerHTML=`<span class="text-white">${a.name}</span>`:l.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`}}renderRecipes(){this.viewAlchemyRecipes.innerHTML="";const n=P.filter(i=>e.player.knownRecipes.includes(i.id));if(n.length===0){this.viewAlchemyRecipes.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được đan phương nào...</div>';return}n.forEach(i=>{const s=x(i.resultId);if(!s)return;const t=this.getQualityClass(s.quality),l=document.createElement("div");l.className="p-4 border border-gray-800 rounded-2xl bg-white/5 space-y-3";let a="";i.materials.forEach(r=>{const d=x(r.id);if(!d)return;const p=e.player.inventory.allItems.find(c=>c.id===r.id),u=p?p.quantity:0,h=u>=r.quantity;a+=`<div class="text-[10px] ${h?"text-gray-400":"text-red-500"}">${d.name}: ${u}/${r.quantity}</div>`});const o=e.player.alchemyLevel<i.level;l.innerHTML=`
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <span class="text-xl mr-2">${s.image?`<img src="${T(s.image)}" class="w-6 h-6 object-contain inline-block">`:s.icon||""}</span>
                        <span class="font-bold quality-${t} font-ancient">${s.name}</span>
                    </div>
                    ${o?`<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${i.level}</span>`:`<button class="px-3 py-1.5 btn-gold text-[10px] font-bold rounded-lg whitespace-nowrap" onclick="window.game.craft('${i.id}')">LUYỆN CHẾ</button>`}
                </div>
                <div class="grid grid-cols-2 gap-1">${a}</div>
                <div class="text-[9px] text-gray-500 italic">${i.description}</div>
            `,this.viewAlchemyRecipes.appendChild(l)})}renderGarden(){this.elGardenPlots.innerHTML="",e.player.gardenPlots.forEach((n,i)=>{const s=document.createElement("div"),t=E[n.grade]||E.PHAM,l=C[n.attribute]||C.NORMAL;s.className="p-4 border rounded-3xl bg-white/5 flex flex-col space-y-4 transition-all hover:border-qi-jade/30 border-white/5 relative overflow-hidden";const a=document.createElement("div");a.className="absolute -right-2 -bottom-2 text-4xl opacity-5 pointer-events-none",a.textContent=l.icon,s.appendChild(a);let o=`
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center space-x-2">
                            <span class="text-[9px] px-2 py-0.5 rounded-full border bg-white/5 text-gray-400 border-white/10 uppercase font-bold">${t.name}</span>
                            <span class="text-[9px] px-2 py-0.5 rounded-full border bg-white/5 text-[${l.color}] border-white/10 uppercase font-bold" style="color: ${l.color}">${l.icon} ${l.name}</span>
                        </div>
                    </div>
                    <button class="p-1.5 hover:bg-white/10 rounded-full transition-colors" onclick="window.game.showFieldMenu(${i})">
                        <i class="ph ph-gear text-gray-500 text-xs"></i>
                    </button>
                </div>
            `;if(n.seedId){const r=A.find(p=>p.id===n.seedId),d=x(r.herbId);o+=`
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/10">
                            ${(d==null?void 0:d.icon)||"🌱"}
                        </div>
                        <div class="flex-grow">
                            <h4 class="text-xs font-ancient text-white">${r.name}</h4>
                            <div class="flex items-center space-x-2 mt-1">
                                <span class="text-[10px] text-qi-jade font-bold">${n.stage}</span>
                                <span class="text-[9px] text-gray-500">(${Math.floor(n.age)} năm)</span>
                            </div>
                        </div>
                        <button class="px-3 py-1.5 bg-qi-jade/10 text-qi-jade text-[10px] font-bold rounded-xl border border-qi-jade/20 active:scale-95 transition-all" onclick="window.game.harvest(${i})">THU HOẠCH</button>
                    </div>
                `}else o+=`
                    <div class="flex flex-col items-center justify-center py-4 space-y-3">
                        <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                            <i class="ph ph-plus text-gray-600"></i>
                        </div>
                        <button class="px-6 py-2 bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] font-bold rounded-xl border border-white/10 transition-all" onclick="window.game.showPlantMenu(${i})">GIEO HẠT</button>
                    </div>
                `;s.innerHTML+=o,this.elGardenPlots.appendChild(s)})}renderShop(){if(!e.player)return;this.elShopLingShi.innerHTML=e.player.getFormattedLingShi();const n=document.getElementById("shop-vip-level");n&&(n.textContent=`VIP ${e.player.vipLevel}`,n.className=`px-2 py-0.5 rounded bg-gray-800 text-[8px] font-bold text-gray-400 border border-white/5 bg-vip-${e.player.vipLevel}`);const i=document.getElementById("shop-overlay-title");if(i&&e.systems.shop){const s=I[e.systems.shop.currentShopId];s&&(i.textContent=s.name.split(" - ")[0])}this.renderShopSections(),this.renderShopSubFilters(),this.btnShopTabBuy&&this.btnShopTabSell&&(e.views.shop==="buy"?(this.btnShopTabBuy.className="flex-grow py-3 text-cultivation-gold border-b-2 border-cultivation-gold text-xs",this.btnShopTabSell.className="flex-grow py-3 text-gray-500 border-b-2 border-transparent text-xs"):(this.btnShopTabBuy.className="flex-grow py-3 text-gray-500 border-b-2 border-transparent text-xs",this.btnShopTabSell.className="flex-grow py-3 text-cultivation-gold border-b-2 border-cultivation-gold text-xs")),e.views.shop==="buy"?(this.elShopBuyView.classList.remove("hidden"),this.elShopSellView.classList.add("hidden"),this.renderShopBuy()):(this.elShopBuyView.classList.add("hidden"),this.elShopSellView.classList.remove("hidden"),this.renderShopSell())}renderShopSections(){if(!this.elShopSectionNav)return;const n=e.systems.shop,i=[{id:"dan_duoc",name:"Đan Dược",icon:"💊"},{id:"phap_bao",name:"Trang Bị",icon:"⚔️"},{id:"cong_phap",name:"Bí Tịch",icon:"📜"},{id:"bach_nghe",name:"Bách Nghệ",icon:"⚒️"},{id:"ky_vat",name:"Kỳ Vật",icon:"💎"}];this.elShopSectionNav.querySelectorAll("button").length!==i.length&&(this.elShopSectionNav.innerHTML="",this.elShopSectionNav.dataset.shopId=n.currentShopId,i.forEach(t=>{const l=document.createElement("button");l.dataset.category=t.id,l.onclick=()=>{e.systems.shop&&(e.systems.shop.currentSection=t.id,this.shopSubFilter="all",this.shopQualityFilter="all",this.renderShop())},this.elShopSectionNav.appendChild(l)})),this.elShopSectionNav.querySelectorAll("button").forEach(t=>{const l=t.dataset.category,a=i.find(r=>r.id===l),o=n.currentSection===l;t.className=`px-4 py-2.5 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all whitespace-nowrap shrink-0 flex items-center space-x-2 ${o?"bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]":"text-gray-500 border border-white/5 hover:border-white/10 bg-white/[0.02]"}`,t.innerHTML=`<span>${a.icon}</span> <span>${a.name}</span>`})}renderShopSubFilters(){var l;if(!this.elShopSubFilterNav)return;const n=e.systems.shop;if(!n)return;this.renderShopQualityFilters();const i=n.currentSection;let s=[];if(i==="phap_bao"?s=[{id:"all",name:"--- Lọc Loại Trang Bị ---"},{id:"weapon",name:"Linh Khí (Vũ Khí)"},{id:"armor",name:"Pháp Y (Giáp)"},{id:"accessory",name:"Trang Sức"},{id:"attackArtifact",name:"Pháp Bảo: Chủ Chiến"},{id:"defenseArtifact",name:"Pháp Bảo: Hộ Thân"},{id:"flightArtifact",name:"Pháp Bảo: Phi Hành"},{id:"spaceArtifact",name:"Pháp Bảo: Càn Khôn"},{id:"formationArtifact",name:"Pháp Bảo: Trận Đạo"},{id:"supportArtifact",name:"Pháp Bảo: Phụ Trợ"},{id:"soulArtifact",name:"Pháp Bảo: Hồn Đạo"}]:i==="cong_phap"?s=[{id:"all",name:"--- Lọc Loại Bí Tịch ---"},{id:"cultivation",name:"Công Pháp Tu Luyện"},{id:"manual",name:"Bí Tịch Kỹ Năng"}]:i==="bach_nghe"?s=[{id:"all",name:"--- Lọc Loại Bách Nghệ ---"},{id:"nguyen_lieu",name:"Nguyên Liệu"},{id:"phu_luc",name:"Phù Lục"},{id:"tran_phap",name:"Trận Pháp"},{id:"luyen_khi",name:"Luyện Khí"},{id:"linh_dien",name:"Linh Điền"}]:i==="ky_vat"&&(s=[{id:"all",name:"--- Lọc Loại Kỳ Vật ---"},{id:"tui_tru_vat",name:"Túi Trữ Vật"},{id:"ky_trung",name:"Kỳ Trùng"},{id:"linh_thu",name:"Linh Thú"}]),(l=this.elShopFiltersWrap)==null||l.classList.remove("hidden"),s.length===0){this.elShopSubFilterNav.innerHTML="",this.elShopSubFilterNav.classList.add("hidden");return}this.elShopSubFilterNav.classList.remove("hidden"),this.elShopSubFilterNav.className="p-2",this.elShopSubFilterNav.innerHTML=`
            <select id="shop-subfilter-select" class="w-full bg-black/40 text-qi-blue border border-qi-blue/20 rounded-lg px-2 py-1.5 text-[9px] font-ancient uppercase tracking-widest outline-none transition-all focus:border-qi-blue/50">
                ${s.map(a=>`<option value="${a.id}" ${this.shopSubFilter===a.id?"selected":""}>${a.name}</option>`).join("")}
            </select>
        `;const t=this.elShopSubFilterNav.querySelector("#shop-subfilter-select");t.onchange=a=>{this.shopSubFilter=a.target.value,this.renderShop()}}renderShopQualityFilters(){if(!this.elShopQualityFilterNav)return;const n=e.systems.shop;if(!n)return;const i=n.currentSection;if(!["phap_bao","dan_duoc","cong_phap","bach_nghe"].includes(i)){this.elShopQualityFilterNav.classList.add("hidden"),this.elShopSubFilterNav.classList.remove("border-r","border-white/5"),this.elShopQualityFilterNav.innerHTML="";return}this.elShopSubFilterNav.classList.add("border-r","border-white/5");const t=[{id:"all",name:"Tất cả phẩm"},{id:"Phàm Khí",name:"Phàm Khí"},{id:"Pháp Khí",name:"Pháp Khí"},{id:"Linh Khí",name:"Linh Khí"},{id:"Pháp Bảo",name:"Pháp Bảo"},{id:"Cổ Bảo",name:"Cổ Bảo"},{id:"Linh Bảo",name:"Linh Bảo"},{id:"Thông Thiên Linh Bảo",name:"Thông Thiên Linh Bảo"},{id:"Tiên Khí",name:"Tiên Khí"},{id:"Danh Khí",name:"Danh Khí"}];this.elShopQualityFilterNav.classList.remove("hidden"),this.elShopQualityFilterNav.className="p-2 flex-1 border-white/5",this.elShopQualityFilterNav.innerHTML=`
            <select id="shop-quality-select" class="w-full bg-black/40 text-cultivation-gold border border-cultivation-gold/20 rounded-lg px-2 py-1.5 text-[9px] font-ancient uppercase tracking-widest outline-none transition-all focus:border-cultivation-gold/50">
                ${t.map(a=>`<option value="${a.id}" ${this.shopQualityFilter===a.id?"selected":""}>${a.name}</option>`).join("")}
            </select>
        `;const l=this.elShopQualityFilterNav.querySelector("#shop-quality-select");l.onchange=a=>{this.shopQualityFilter=a.target.value,this.renderShop()}}renderShopBuy(){const n=e.systems.shop;let i=n.getShopInventory();if(this.elShopBuyView.innerHTML="",this.shopSearchQuery&&(i=i.filter(s=>{const t=x(s.id);return t&&t.name.toLowerCase().includes(this.shopSearchQuery)})),this.shopSubFilter!=="all"&&(i=i.filter(s=>{var l;const t=x(s.id);if(!t)return!1;if(n.currentSection==="phap_bao")return t.type===this.shopSubFilter;if(n.currentSection==="cong_phap"){const a=t.action&&(t.action.startsWith("open_")||t.action.includes("linh_the_luc")||((l=t.effect)==null?void 0:l.type)==="unlock_profession"),o=(t.type==="book"||t.type==="technique")&&!a,r=t.type==="recipe"||t.type==="talisman_recipe"||a;if(this.shopSubFilter==="cultivation")return o;if(this.shopSubFilter==="manual")return r}else if(["bach_nghe","ky_vat"].includes(n.currentSection))return(I[n.currentShopId].sections[this.shopSubFilter]||[]).some(r=>r.id===s.id);return!0})),this.shopQualityFilter!=="all"&&(i=i.filter(s=>{const t=x(s.id);return t&&t.quality===this.shopQualityFilter})),this.shopSortMode!=="default"&&i.sort((s,t)=>{const l=x(s.id),a=x(t.id);if(!l||!a)return 0;if(this.shopSortMode==="price-asc")return l.price-a.price;if(this.shopSortMode==="price-desc")return a.price-l.price;if(this.shopSortMode==="quality"){const o=["Phàm Khí","Pháp Khí","Linh Khí","Pháp Bảo","Cổ Bảo","Linh Bảo","Thông Thiên Linh Bảo","Tiên Khí","Danh Khí","Hạ phẩm","Trung phẩm","Thượng phẩm","Cực phẩm","Hoàn Mỹ"];return o.indexOf(a.quality)-o.indexOf(l.quality)}return 0}),i.length===0){this.elShopBuyView.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Không tìm thấy bảo vật phù hợp...</div>';return}i.forEach(s=>{const t=x(s.id);if(!t)return;const l=this.getQualityClass(t.quality),a=document.createElement("div");a.className=`flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-xl hover:border-${l} cursor-pointer transition-colors duration-200`,a.onclick=()=>{window.game.screens.inventory&&window.game.screens.inventory.selectItem(s.id,!0)};const o=document.createElement("div");o.className="flex items-center space-x-3",o.innerHTML=`
                <div class="text-2xl bg-black/60 p-2 rounded-lg border border-${l}/30">${t.image?`<img src="${T(t.image)}" class="w-8 h-8 object-contain">`:t.icon||""}</div>
                <div>
                    <div class="text-sm font-bold text-white">${t.name}</div>
                    <div class="text-[9px] font-bold quality-${l}">${t.quality}${t.quality.toLowerCase().includes("khí")||t.quality.toLowerCase().includes("bảo")||t.quality.toLowerCase().includes("phẩm")||t.quality.toLowerCase().includes("giai")||t.quality.toLowerCase().includes("hỏa")||t.quality.toLowerCase().includes("lôi")||["Hoàn Mỹ","Tiên Khí","Linh Bảo","Danh Khí"].includes(t.quality)?"":" phẩm"} | Kho: ${s.stock}</div>
                </div>
            `;const r=Math.floor(t.price*(1-Math.min(.25,e.player.vipLevel*.05))),d=s.minVip&&e.player.vipLevel<s.minVip,p=document.createElement("div");p.className="flex items-center space-x-3",p.innerHTML=`
                <div class="text-right">
                    <div class="text-[8px] text-gray-500 line-through">${t.price} LT</div>
                    <div class="text-xs font-mono text-cultivation-gold whitespace-nowrap">${r} LT</div>
                    ${d?`<div class="text-[7px] text-red-500 font-bold uppercase animate-pulse">Yêu cầu VIP ${s.minVip}</div>`:""}
                </div>
            `;const u=document.createElement("button"),h=s.stock<=0;u.className=`px-3 py-1.5 btn-gold text-[10px] font-bold rounded-lg whitespace-nowrap ${h||d?"opacity-50 grayscale pointer-events-none":""}`,u.innerHTML='<i class="ph ph-shopping-cart-simple mr-1"></i>TRAO ĐỔI',u.onclick=c=>{c.stopPropagation(),window.game.buyItem(s.id)},p.appendChild(u),a.appendChild(o),a.appendChild(p),this.elShopBuyView.appendChild(a)})}renderShopSell(){if(this.elShopSellGrid.innerHTML="",!e.player||!e.player.inventory)return;const n=e.systems.shop.currentSection,i=this.shopSubFilter;let s=[...e.player.inventory.allItems];if(this.shopSearchQuery&&(s=s.filter(t=>{const l=x(t.id);return l&&l.name.toLowerCase().includes(this.shopSearchQuery)})),s=s.filter(t=>{var p;const l=x(t.id);if(!l)return!1;const a={dan_duoc:["consumable"],phap_bao:["weapon","armor","accessory","treasure","head","necklace","shoes","attackArtifact","defenseArtifact","flightArtifact","spaceArtifact","formationArtifact","supportArtifact","soulArtifact"],nguyen_lieu:["material","herb","ore","wood"],cong_phap:["book","technique","recipe","talisman_recipe","consumable"],tran_phap:["formation"],phu_luc:["talisman"],luyen_khi:["material","smithing_tool"],tui_tru_vat:["consumable"],ky_trung:["consumable"],linh_thu:["supportArtifact"]},d=({dan_duoc:["dan_duoc"],phap_bao:["phap_bao"],cong_phap:["cong_phap"],bach_nghe:["nguyen_lieu","phu_luc","tran_phap","luyen_khi","linh_dien"],ky_vat:["tui_tru_vat","ky_trung","linh_thu"]}[n]||[n]).flatMap(u=>a[u]||[]);if(d.length>0&&!d.includes(l.type))return!1;if(n==="cong_phap"){const u=l.action&&(l.action.startsWith("open_")||l.action.includes("linh_the_luc")),h=(l.type==="book"||l.type==="technique")&&!u,c=l.type==="recipe"||l.type==="talisman_recipe"||l.type==="consumable"&&((p=l.effect)==null?void 0:p.type)==="unlock_profession"||u;if(i==="cultivation"&&!h||i==="manual"&&h||i==="manual"&&!c&&!h||i==="all"&&!h&&!c)return!1}return!(["bach_nghe","ky_vat"].includes(n)&&i!=="all"&&(!a[i]||!a[i].includes(l.type))||n==="phap_bao"&&i!=="all"&&l.type!==i||i==="tui_tru_vat"&&l.action!=="expand_inventory"||this.shopQualityFilter!=="all"&&l.quality!==this.shopQualityFilter)}),this.shopSortMode!=="default"&&s.sort((t,l)=>{const a=x(t.id),o=x(l.id);if(!a||!o)return 0;if(this.shopSortMode==="price-asc")return a.price-o.price;if(this.shopSortMode==="price-desc")return o.price-a.price;if(this.shopSortMode==="quality"){const r=["Phàm Khí","Pháp Khí","Linh Khí","Pháp Bảo","Cổ Bảo","Linh Bảo","Thông Thiên Linh Bảo","Tiên Khí","Danh Khí","Hạ phẩm","Trung phẩm","Thượng phẩm","Cực phẩm","Hoàn Mỹ"];return r.indexOf(o.quality)-r.indexOf(a.quality)}return 0}),s.length===0){this.elShopSellGrid.innerHTML='<div class="col-span-4 text-center py-10 text-gray-600 italic text-xs">Không có bảo vật nào để giao dịch...</div>';return}s.forEach(t=>{const l=x(t.id);if(!l)return;const a=this.getQualityClass(l.quality);let o=.5;["material","herb","ore","wood"].includes(l.type)&&(o=.3);const r=document.createElement("div");r.className=`p-2 border border-gray-800 rounded-lg bg-black/20 flex flex-col items-center cursor-pointer hover:border-${a} transition-colors duration-200 active:scale-95`,r.innerHTML=`
                <div class="text-2xl mb-1">${l.image?`<img src="${T(l.image)}" class="w-8 h-8 object-contain">`:l.icon||""}</div>
                <div class="text-[9px] text-gray-400">x${t.quantity}</div>
                <div class="text-[8px] text-cultivation-gold mt-1">${Math.floor(l.price*o)} LT</div>
            `,r.onclick=()=>{window.game.screens.inventory&&window.game.screens.inventory.selectItem(t.id,!1,!0)},this.elShopSellGrid.appendChild(r)})}renderGuild(){e.player&&(this.elGuildCerts.innerHTML="",this.elGuildMissions=document.getElementById("guild-mission-list"),this.elGuildRooms=document.getElementById("guild-room-list"),K.forEach(n=>{var t;const i=e.player.alchemyLevel<n.requirements.alchemyLevel,s=document.createElement("div");s.className="p-4 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center",s.innerHTML=`
                <div>
                    <h4 class="text-sm font-ancient text-white">${n.name}</h4>
                    <p class="text-[10px] text-gray-500">Phí: ${n.requirements.fee} LT | Cần luyện: ${n.task.quantity} ${((t=x(n.task.targetId))==null?void 0:t.name)||"đan dược"}</p>
                </div>
                <button class="px-3 py-1.5 bg-qi-blue text-black text-[10px] font-bold rounded-lg ${i?"opacity-50":""}" 
                    onclick="window.game.guildCertify(${n.level})">KHẢO HẠCH</button>
            `,this.elGuildCerts.appendChild(s)}),this.elGuildMissions&&(this.elGuildMissions.innerHTML="",j.forEach(n=>{const i=document.createElement("div");i.className="p-4 border border-white/5 rounded-xl bg-white/5 space-y-2",i.innerHTML=`
                    <div class="flex justify-between items-center">
                        <h4 class="text-sm font-ancient text-white">${n.name}</h4>
                        <button class="px-3 py-1 bg-qi-purple text-white text-[10px] font-bold rounded-lg" 
                            onclick="window.game.guildMission('${n.id}')">GIAO NỘP</button>
                    </div>
                    <p class="text-[10px] text-gray-400 italic">${n.description}</p>
                    <p class="text-[9px] text-cultivation-gold">Thưởng: ${n.rewards.lingShi} LT | Danh vọng: ${n.rewards.reputation}</p>
                `,this.elGuildMissions.appendChild(i)})),this.elGuildRooms&&(this.elGuildRooms.innerHTML="",F.forEach(n=>{const i=e.player.currentAlchemyRoom===n.id,s=document.createElement("div");s.className=`p-4 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center ${i?"border-cultivation-gold":""}`,s.innerHTML=`
                    <div>
                        <h4 class="text-sm font-ancient text-white">${n.name} ${i?"⭐":""}</h4>
                        <p class="text-[10px] text-gray-500">Phí thuê: ${n.fee} LT | Tăng ${n.successBonus*100}% thành công</p>
                    </div>
                    <button class="px-3 py-1.5 ${i?"bg-gray-800":"bg-cultivation-gold"} text-black text-[10px] font-bold rounded-lg" 
                        onclick="window.game.guildRent('${n.id}')">${i?"ĐANG THUÊ":"THUÊ"}</button>
                `,this.elGuildRooms.appendChild(s)})))}renderTower(){const n=document.getElementById("tower-floor-list");n&&(n.innerHTML="",ee.forEach(i=>{const s=e.player.alchemyLevel<i.minAlchemyLevel,t=document.createElement("div");t.className=`p-6 border border-white/5 rounded-2xl bg-white/5 space-y-3 ${s?"opacity-40":"hover:border-cultivation-gold/50 cursor-pointer"}`,t.innerHTML=`
                <div class="flex justify-between items-center">
                    <h4 class="text-lg font-ancient text-cultivation-gold">${i.name}</h4>
                    ${s?`<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${i.minAlchemyLevel}</span>`:'<i class="ph ph-caret-right text-gray-500"></i>'}
                </div>
                <p class="text-xs text-gray-400">${i.description}</p>
            `,s||(t.onclick=()=>e.ui.toast(`Đang tiến vào ${i.name}...`,"success")),n.appendChild(t)}))}renderMountain(){const n=document.getElementById("mountain-layer-name"),i=document.getElementById("mountain-layer-desc"),s=document.getElementById("mountain-layer-progress-text"),t=document.getElementById("mountain-layer-progress-bar"),l=document.getElementById("mountain-oxygen-text"),a=document.getElementById("mountain-oxygen-bar"),o=document.getElementById("mountain-toxicity-text"),r=document.getElementById("mountain-toxicity-bar");if(document.getElementById("mountain-event-log"),!e.player.mountainSurvival)return;const d=e.systems.mountain,p=G.find(m=>m.id===d.currentLayer),u=R.find(m=>m.id===p.tier);if(n){const m={ngoai_son:"text-green-400",trung_son:"text-blue-400",noi_son:"text-purple-400",cam_khu:"text-red-500"}[p.tier]||"text-red-400";n.innerHTML=`<span class="text-[10px] block opacity-60 uppercase tracking-tighter">${u.name}</span>${p.name}`,n.className=`text-2xl font-ancient ${m} mb-1`}i&&(i.textContent=p.description);const h=d.discovery[d.currentLayer]||0;s&&(s.textContent=`${Math.floor(d.layerProgress)}% (Khám phá: ${Math.floor(h)}%)`),t&&(t.style.width=`${d.layerProgress}%`),l&&(l.textContent=`${Math.ceil(e.player.mountainSurvival.oxygen)}%`),a&&(a.style.width=`${e.player.mountainSurvival.oxygen}%`),o&&(o.textContent=`${Math.ceil(e.player.mountainSurvival.toxicity)}%`),r&&(r.style.width=`${e.player.mountainSurvival.toxicity}%`);const c=document.getElementById("btn-mountain-deeper");if(c){const m=d.bossDefeated[p.tier];d.layerProgress>=100&&!m?c.innerHTML='<span class="relative z-10 text-xs font-bold text-red-500 uppercase tracking-[0.2em] animate-pulse">KHIÊU CHIẾN THỦ LĨNH</span>':c.innerHTML='<span class="relative z-10 text-xs font-bold text-red-400 uppercase tracking-[0.2em]">TẦNG KẾ TIẾP</span>'}e.player.hp<=0&&(e.systems.mountain.stop(),e.ui.toggleOverlay(document.getElementById("mountain-overlay"),!1))}renderSects(){const n=document.getElementById("sects-view");if(n)if(n.innerHTML="",e.player.sectId){const i=V(e.player.sectId);n.innerHTML=`
                <div class="bg-white/5 rounded-2xl border border-qi-blue/30 overflow-hidden">
                    <div class="h-32 relative">
                        <img src="${i.portrait||f.backgrounds.sect}" class="w-full h-full object-cover opacity-40">
                        <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                        <div class="absolute bottom-4 left-4">
                            <h3 class="text-2xl font-ancient text-white">${i.name}</h3>
                            <p class="text-[10px] text-qi-blue uppercase">Đệ tử nội môn</p>
                        </div>
                    </div>
                    <div class="p-4 space-y-4">
                        <div class="flex justify-between text-xs">
                            <span class="text-gray-500">Điểm cống hiến:</span>
                            <span class="text-cultivation-gold">${e.player.sectContribution||0}</span>
                        </div>
                        <h4 class="text-xs font-ancient text-gray-300 uppercase tracking-widest border-b border-white/10 pb-2">Ủy Thác Tông Môn</h4>
                        <div class="space-y-3">
                            ${i.missions.map(s=>`
                                <div class="p-3 bg-black/40 rounded-lg border border-white/5 flex justify-between items-center">
                                    <div>
                                        <div class="text-sm font-bold">${s.name}</div>
                                        <div class="text-[9px] text-gray-500">${s.desc}</div>
                                    </div>
                                    <button class="px-4 py-2 bg-qi-purple/10 text-qi-purple text-[10px] font-bold rounded-lg flex items-center justify-center border border-qi-purple/20" onclick="window.game.doMission('${s.id}')">
                                        <i class="ph ph-scroll mr-1"></i>LÀM
                                    </button>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </div>
            `}else Object.values(D).forEach(i=>{const s=e.player.realmId>=i.minRealm,t=document.createElement("div");t.className=`p-4 border rounded-xl bg-black/40 space-y-3 ${s?"border-gray-800":"opacity-50 grayscale"}`,t.innerHTML=`
                    <div class="flex justify-between items-center">
                        <h3 class="text-xl font-ancient text-white">${i.name}</h3>
                        <span class="text-[10px] ${s?"text-qi-blue":"text-red-500"}">${s?"Có thể bái nhập":"Cần: "+O(i.minRealm).name}</span>
                    </div>
                    <p class="text-xs text-gray-500">${i.description}</p>
                    <button class="w-full py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-xl flex items-center justify-center ${s?"":"hidden"}" onclick="window.game.joinSect('${i.id}')">
                        <i class="ph ph-identification-badge mr-2"></i>BÁI NHẬP TÔNG MÔN
                    </button>
                `,n.appendChild(t)})}renderEnergy(){if(!e.player)return;const n=document.getElementById("env-energy-list"),i=document.getElementById("env-purity-tag");if(n&&e.currentLocId){const t=U(e.currentWorldId,e.currentLocId);if(t&&t.energies){if(i&&t.energies.length>0){const l=t.energies[0].purity||"TINH_THUAN",a=e.systems.energy.getPurity(l);i.textContent=a.name}n.innerHTML=t.energies.map(l=>{const a=e.systems.energy.getEnergyType(l.type);return`
                        <div class="flex flex-col items-center space-y-1">
                            <span class="text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">${a.icon}</span>
                            <div class="flex flex-col items-center">
                                <span class="text-[9px] text-white font-mono font-bold">${l.concentration}%</span>
                                <span class="text-[7px] text-gray-500 font-ancient uppercase tracking-widest">${a.name}</span>
                            </div>
                        </div>
                    `}).join("")}else n.innerHTML=""}const s=document.getElementById("char-energy-list");if(s){const t=Object.entries(e.player.qiAccumulated).filter(([l,a])=>a.amount>0);t.length===0?s.innerHTML='<div class="text-[9px] text-gray-600 italic">Chưa có khí tức tích lũy</div>':s.innerHTML=t.map(([l,a])=>{const o=e.systems.energy.getEnergyType(l),r=e.systems.energy.getPurity(a.purity),d=Math.log10(a.amount+1);return`
                        <div class="p-2 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <span class="text-sm">${o.icon}</span>
                                <div>
                                    <div class="text-[9px] font-bold text-white font-ancient">${o.name}</div>
                                    <div class="text-[7px] text-qi-blue uppercase">${r.name}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-[8px] font-mono text-gray-400">${Math.floor(a.amount).toLocaleString()} Qi</div>
                                <div class="text-[7px] text-cultivation-gold">+${(d*10).toFixed(1)} Bonus</div>
                            </div>
                        </div>
                    `}).join("")}}getQualityClass(n){return{"Phàm Khí":"pham-khi","Pháp Khí":"phap-khi","Linh Khí":"linh-khi","Pháp Bảo":"phap-bao","Cổ Bảo":"co-bao","Linh Bảo":"linh-bao","Thông Thiên Linh Bảo":"thong-thien","Tiên Khí":"tien-khi","Danh Khí":"danh-khi","Hạ phẩm":"pham","Trung phẩm":"hoang","Thượng phẩm":"huyen","Cực phẩm":"dia","Hoàn Mỹ":"thien"}[n]||"pham"}renderSmithing(){const n=document.getElementById("smithing-recipes");if(!n)return;n.innerHTML="";const i=document.getElementById("smithing-tool-name"),s=document.getElementById("smithing-flame-name");if(i){const o=e.player.smithingTool?x(e.player.smithingTool):null;o?i.innerHTML=`<span class="text-white">${o.name}</span>`:i.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'luyen_khi')" class="ml-2 text-[8px] text-red-400 underline hover:text-white transition-colors">MUA NGAY</button>`}if(s){const o=$(e.player.currentFlame);o?s.innerHTML=`<span class="text-white">${o.name}</span>`:s.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-red-400 underline hover:text-white transition-colors">MUA NGAY</button>`}const t=k(e.player.smithingLevel),l=document.getElementById("smithing-level-text");l&&(l.textContent=t.name);const a=Object.values(Q).filter(o=>e.player.knownSmithingRecipes.includes(o.id));if(a.length===0){n.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được bản vẽ nào...</div>';return}a.forEach(o=>{const r=x(o.id);if(!r)return;const d=this.getQualityClass(r.quality),p=document.createElement("div");p.className="p-4 border border-gray-800 rounded-2xl bg-white/5 space-y-3";let u="";o.materials.forEach(c=>{var b;const m=x(c.id),g=((b=e.player.inventory.allItems.find(v=>v.id===c.id))==null?void 0:b.quantity)||0,y=g>=c.quantity;u+=`<div class="text-[10px] ${y?"text-gray-400":"text-red-500"}">${(m==null?void 0:m.name)||c.id}: ${g}/${c.quantity}</div>`});const h=e.player.smithingLevel<o.level;p.innerHTML=`
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <span class="text-xl mr-2">${r.image?`<img src="${T(r.image)}" class="w-6 h-6 object-contain inline-block">`:r.icon||""}</span>
                        <span class="font-bold quality-${d} font-ancient">${r.name}</span>
                    </div>
                    ${h?`<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${o.level}</span>`:`<button class="px-4 py-2 btn-gold text-[10px] font-bold rounded-lg whitespace-nowrap" onclick="window.game.forge('${o.id}')">${o.type==="bag_upgrade"?"NÂNG CẤP":"RÈN ĐÚC"}</button>`}
                </div>
                <div class="grid grid-cols-2 gap-1">${u}</div>
                <div class="text-[9px] text-gray-500 italic">Thể lực: ${o.staminaCost} | Linh lực: ${o.manaCost}</div>
            `,n.appendChild(p)})}openCrafting(n){if(!e.player)return;if(!e.player.unlockedProfessions.includes(n)){e.ui.toast("Ngươi chưa nắm vững bí pháp của nghề này!","error");return}const t={alchemy:"screen-alchemy",smithing:"screen-smithing",talisman:"screen-talisman",formation:"screen-formation",beast:"screen-beast",puppet:"screen-puppet",corpse:"screen-corpse"}[n];t&&(e.ui.switchScreen(t),n==="alchemy"&&this.renderAlchemy(),n==="smithing"&&this.renderSmithing(),n==="talisman"&&this.renderTalisman(),n==="formation"&&this.renderFormation(),n==="beast"&&this.renderBeast(),n==="puppet"&&this.renderPuppet(),n==="corpse"&&this.renderCorpse())}openCraftingHub(){["screen-alchemy","screen-talisman","screen-smithing","screen-formation","screen-corpse","screen-beast","screen-puppet"].forEach(s=>{const t=document.getElementById(s);t&&(t.classList.add("hidden"),t.classList.remove("flex"))});const i=document.getElementById("screen-crafting-hub");i&&(i.classList.remove("hidden"),i.classList.add("flex"))}renderPuppet(){if(!e.player)return;const n=document.getElementById("puppet-level-text"),i=document.getElementById("puppet-exp-bar"),s=document.getElementById("puppet-list");if(n&&(n.textContent=`Khôi Lỗi Sư - Cấp ${e.player.puppetLevel}`),i){const t=Math.max(1,e.player.puppetLevel*100*Math.pow(1.5,e.player.puppetLevel-1));i.style.width=`${Math.min(100,e.player.puppetExp/t*100)}%`}if(s){s.innerHTML="";const t=Y.filter(l=>e.player.knownPuppetRecipes.includes(l.id));if(t.length===0){s.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa có bản thiết kế khôi lỗi nào...</div>';return}t.forEach(l=>{const a=document.createElement("div");a.className="p-5 border border-white/5 rounded-3xl bg-white/[0.02] space-y-4 group hover:border-qi-blue/30 transition-all";let o="";l.materials.forEach(p=>{var m;const u=x(p.id),h=((m=e.player.inventory.allItems.find(g=>g.id===p.id))==null?void 0:m.quantity)||0,c=h>=p.quantity;o+=`
                        <div class="flex justify-between items-center bg-black/20 p-2 rounded-xl border ${c?"border-white/5":"border-red-500/20"}">
                            <span class="text-[10px] text-gray-400">${(u==null?void 0:u.name)||p.id}</span>
                            <span class="text-[10px] font-mono ${c?"text-qi-jade":"text-red-500"}">${h}/${p.quantity}</span>
                        </div>
                    `});const r=e.player.puppetLevel<l.skillLevel,d=f.puppets[l.id];a.innerHTML=`
                    <div class="flex justify-between items-start">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 group-hover:scale-110 transition-transform">
                                ${d?`<img src="${d}" class="w-full h-full object-cover">`:"🤖"}
                            </div>
                            <div>
                                <h4 class="font-ancient text-white text-lg">${l.name}</h4>
                                <div class="flex space-x-2 mt-1">
                                    <span class="text-[8px] px-2 py-0.5 bg-qi-blue/10 text-qi-blue rounded-full border border-qi-blue/20 uppercase font-bold">${W[l.grade].name}</span>
                                    <span class="text-[8px] px-2 py-0.5 bg-white/5 text-gray-500 rounded-full border border-white/10 uppercase font-bold">${l.type}</span>
                                </div>
                            </div>
                        </div>
                        ${r?`<div class="text-[9px] text-red-500 font-bold uppercase py-2">Cần Cấp ${l.skillLevel}</div>`:`<button class="px-5 py-2.5 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue text-[10px] font-bold rounded-xl border border-qi-blue/20 active:scale-95 transition-all" onclick="window.game.craftPuppet('${l.id}')">LUYỆN CHẾ</button>`}
                    </div>
                    <p class="text-[10px] text-gray-500 italic leading-relaxed">${l.description}</p>
                    <div class="grid grid-cols-2 gap-2">${o}</div>
                `,s.appendChild(a)})}}renderTalisman(){if(!e.player)return;const n=B(e.player.talismanLevel),i=document.getElementById("talisman-level-text"),s=document.getElementById("talisman-exp-bar"),t=document.getElementById("talisman-recipes");if(i&&(i.textContent=n.name),s){const a=Math.max(1,e.player.talismanLevel*100*Math.pow(1.5,e.player.talismanLevel-1));s.style.width=`${Math.min(100,e.player.talismanExp/a*100)}%`}const l=document.getElementById("current-pen-name");if(l){const a=e.player.currentTalismanPen?x(e.player.currentTalismanPen):null;a?l.innerHTML=`<span class="text-white">${a.name}</span>`:l.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phu_luc')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`}if(t){t.innerHTML="";const a=Object.values(z).filter(o=>e.player.knownTalismanRecipes.includes(o.id));if(a.length===0){t.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được phù văn nào...</div>';return}a.forEach(o=>{const r=document.createElement("div");r.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3";let d="";o.materials.forEach(u=>{var m;const h=x(u.id),c=((m=e.player.inventory.allItems.find(g=>g.id===u.id))==null?void 0:m.quantity)||0;d+=`<div class="text-[9px] ${c>=u.quantity?"text-gray-400":"text-red-500"}">${h.name} x${u.quantity} (${c})</div>`});const p=e.player.talismanLevel<o.level;r.innerHTML=`
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-bold text-qi-blue">${o.name}</h4>
                        ${p?`<span class="text-[8px] text-red-500 uppercase">Cần Cấp ${o.level}</span>`:`<button class="px-3 py-1 bg-qi-blue/10 text-qi-blue text-[10px] rounded border border-qi-blue/20" onclick="window.game.drawTalisman('${o.id}')">VẼ PHÙ</button>`}
                    </div>
                    <div class="grid grid-cols-2 gap-1 mb-2">${d}</div>
                    <div class="text-[8px] text-gray-500 italic">Mana: ${o.manaCost} | Stamina: ${o.staminaCost}</div>
                `,t.appendChild(r)})}}renderBeast(){if(!e.player)return;const n=document.getElementById("beast-list-view"),i=document.getElementById("beast-hatch-view"),s=document.getElementById("beast-tab-beast"),t=document.getElementById("beast-tab-insect"),l=document.getElementById("beast-tab-hatch");e.views.beast||(e.views.beast="beast"),e.views.beast==="hatch"?(n&&n.classList.add("hidden"),i&&i.classList.remove("hidden")):(n&&n.classList.remove("hidden"),i&&i.classList.add("hidden"));const a=["bg-qi-jade/10","text-qi-jade","border-qi-jade/20"],o=["bg-transparent","text-gray-500","border-transparent"];[s,t,l].forEach(h=>{if(h){h.classList.remove(...a,...o);const c=h===s&&e.views.beast==="beast"||h===t&&e.views.beast==="insect"||h===l&&e.views.beast==="hatch";h.classList.add(...c?a:o)}});const r=document.getElementById("beast-level-text"),d=document.getElementById("beast-exp-bar"),p=e.views.beast==="insect"?e.player.insectLevel:e.player.beastLevel,u=e.views.beast==="insect"?e.player.insectExp:e.player.beastExp;if(r&&(r.textContent=`Cấp ${p}`),d){const h=Math.max(1,p*100*Math.pow(1.5,p-1));d.style.width=`${Math.min(100,u/h*100)}%`}if(n&&e.views.beast!=="hatch"){n.innerHTML="";const h=e.player.beasts.filter(c=>{const m=M[c.id];return m?e.views.beast==="beast"?[w.LINH_THU,w.DI_THU,w.THAN_THU].includes(m.type):e.views.beast==="insect"?[w.LINH_TRUNG,w.KY_TRUNG].includes(m.type):!0:!1});if(h.length===0){const c=e.views.beast==="beast"?"linh thú":"kỳ trùng";n.innerHTML=`<div class="text-center py-10 text-gray-600 italic">Ngươi chưa có ${c} nào...</div>`}else h.forEach(c=>{const m=M[c.id],g=q(c.level),y=J[c.bloodline],b=f.beasts[c.id],v=document.createElement("div");v.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] flex items-center space-x-4",v.innerHTML=`
                        <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0">
                            ${b?`<img src="${b}" class="w-full h-full object-cover">`:`<span class="text-3xl">${(m==null?void 0:m.icon)||"🐾"}</span>`}
                        </div>
                        <div class="flex-grow">
                            <div class="flex justify-between items-center">
                                <h4 class="font-bold text-white">${c.name}</h4>
                                <span class="text-[9px] font-bold" style="color: ${y.color}">${y.name}</span>
                            </div>
                            <div class="text-[9px] text-gray-500 mt-0.5">Cấp ${c.level} (${g.name})</div>
                            <div class="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                                <div class="h-full bg-qi-jade" style="width: ${c.exp/g.expRequired*100}%"></div>
                            </div>
                        </div>
                    `,n.appendChild(v)})}if(i&&e.views.beast==="hatch"){i.innerHTML="";const h=e.player.inventory.allItems.filter(c=>x(c.id).type==="beast_egg");h.length===0?i.innerHTML='<div class="text-center py-10 text-gray-600 italic">Ngươi không có trứng linh thú nào...</div>':h.forEach(c=>{const m=x(c.id),g=document.createElement("div");g.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] flex justify-between items-center",g.innerHTML=`
                        <div class="flex items-center space-x-3">
                            <div class="text-2xl">${m.icon}</div>
                            <div>
                                <h4 class="text-sm font-bold text-white">${m.name}</h4>
                                <p class="text-[9px] text-gray-500">Số lượng: ${c.quantity}</p>
                            </div>
                        </div>
                        <button class="px-4 py-2 bg-qi-jade/10 text-qi-jade text-[10px] rounded-xl border border-qi-jade/20" onclick="window.game.hatchBeast('${c.id}')">ẤP NỞ</button>
                    `,i.appendChild(g)})}s&&(s.onclick=()=>{e.views.beast="beast",this.renderBeast()}),t&&(t.onclick=()=>{e.views.beast="insect",this.renderBeast()}),l&&(l.onclick=()=>{e.views.beast="hatch",this.renderBeast()})}renderCraftingHub(){if(!e.player)return;[{id:"alchemy",key:"alchemy",name:"Luyện Dược Sư",level:e.player.alchemyLevel,exp:e.player.alchemyExp,getLevelInfo:S},{id:"talisman",key:"talisman",name:"Phù Sư",level:e.player.talismanLevel,exp:e.player.talismanExp,getLevelInfo:B},{id:"smithing",key:"smithing",name:"Luyện Khí Sư",level:e.player.smithingLevel,exp:e.player.smithingExp,getLevelInfo:k},{id:"formation",key:"formation",name:"Trận Pháp Sư",level:e.player.formationLevel,exp:e.player.formationExp,getLevelInfo:i=>({name:`Cấp ${i}`})},{id:"puppet",key:"puppet",name:"Khôi Lỗi Sư",level:e.player.puppetLevel,exp:e.player.puppetExp,getLevelInfo:i=>({name:`Cấp ${i}`})},{id:"corpse",key:"corpse",name:"Luyện Thi Sư",level:e.player.corpseLevel,exp:e.player.corpseExp,getLevelInfo:i=>({name:`Cấp ${i}`})},{id:"beast",key:"beast",name:"Ngự Thú Sư",level:e.player.beastLevel,exp:e.player.beastExp,getLevelInfo:q},{id:"insect",key:"insect",name:"Khu Trùng Sư",level:e.player.insectLevel,exp:e.player.insectExp,getLevelInfo:i=>({name:`Cấp ${i}`})}].forEach(i=>{const s=document.getElementById(`hub-${i.id}-level`),t=s==null?void 0:s.closest(".hub-card");if(!s||!t)return;const l=e.player.unlockedProfessions.includes(i.id);t.onclick=()=>window.game.openCrafting(i.id);const a={alchemy:"Đan Đạo Chân Giải",talisman:"Thái Thượng Phù Kinh",smithing:"Luyện Khí Tổng Cương",formation:"Trận Đạo Thiên Thư",puppet:"Cơ Quan Linh Kỹ",corpse:"Cửu U Luyện Thi Thuật",beast:"Vạn Thú Ngự Pháp",insect:"Thiên Trùng Bí Lục"};if(l){const o=i.getLevelInfo?i.getLevelInfo(i.level):{name:`Cấp ${i.level}`},r=i.level*100*Math.pow(1.5,i.level-1),d=Math.floor(i.exp/r*100);s.innerHTML=`${i.name} - ${o.name} <span class="text-white/30 ml-2">(${d}%)</span>`,t.classList.remove("opacity-40","grayscale"),t.classList.add("cursor-pointer")}else s.innerHTML=`
                    <div class="flex flex-col">
                        <span class="text-red-500/60 flex items-center"><i class="ph ph-lock-key mr-1"></i> Chưa mở khóa</span>
                        <span class="text-[7px] text-gray-600 italic mt-0.5">Cần: « ${a[i.id]} »</span>
                    </div>
                `,t.classList.add("opacity-40","grayscale"),t.classList.remove("cursor-pointer")})}renderFormation(){if(!e.player)return;const n=document.getElementById("formation-list");if(!n)return;if(n.innerHTML="",e.player.activeFormations.length>0){const t=document.createElement("h3");t.className="text-[10px] text-gray-500 uppercase tracking-widest mb-2",t.textContent="Trận Pháp Đang Hoạt Động",n.appendChild(t),e.player.activeFormations.forEach(l=>{const a=document.createElement("div");a.className="p-4 border border-qi-purple/30 rounded-2xl bg-qi-purple/5 mb-4 flex justify-between items-center",a.innerHTML=`
                    <div>
                        <h4 class="font-bold text-qi-purple">${l.name}</h4>
                        <p class="text-[9px] text-gray-500 mt-1">Đang kích hoạt...</p>
                    </div>
                    <button class="px-4 py-2 bg-red-500/10 text-red-500 text-[10px] rounded-xl border border-red-500/20" onclick="window.game.deactivateFormation('${l.id}')">THU HỒI</button>
                `,n.appendChild(a)})}const i=e.player.knownFormations||[],s=document.createElement("h3");if(s.className="text-[10px] text-gray-500 uppercase tracking-widest mt-6 mb-2",s.textContent="Trận Đồ Đã Lĩnh Ngộ",n.appendChild(s),i.length===0){const t=document.createElement("div");t.className="text-center py-6 text-gray-700 italic text-xs",t.textContent="Trống rỗng...",n.appendChild(t)}else i.forEach(t=>{const l=x(t);if(!l)return;const a=e.player.activeFormations.some(r=>r.id===t),o=document.createElement("div");o.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3 flex justify-between items-center",o.innerHTML=`
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">${l.icon||"📜"}</div>
                        <div>
                            <h4 class="text-sm font-bold text-white">${l.name}</h4>
                            <p class="text-[9px] text-gray-500">${l.description||""}</p>
                        </div>
                    </div>
                    ${a?'<span class="text-[9px] text-qi-purple font-bold">ĐÃ KÍCH HOẠT</span>':`<button class="px-4 py-2 bg-qi-purple/10 text-qi-purple text-[10px] rounded-xl border border-qi-purple/20" onclick="window.game.activateFormation('${t}')">KÍCH HOẠT</button>`}
                `,n.appendChild(o)})}renderCorpse(){if(!e.player)return;const n=document.getElementById("corpse-list"),i=document.getElementById("corpse-level-text"),s=document.getElementById("corpse-exp-bar");if(i&&(i.textContent=X(e.player.corpseLevel).name),s){const a=e.player.corpseLevel*100*Math.pow(1.5,e.player.corpseLevel-1);s.style.width=`${e.player.corpseExp/a*100}%`}if(!n)return;if(n.innerHTML="",e.player.refinedCorpses.length>0){const a=document.createElement("h3");a.className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-1",a.textContent="Thi Hài Đang Khống Chế",n.appendChild(a),e.player.refinedCorpses.forEach((o,r)=>{const d=f.corpses[o.id],p=document.createElement("div");p.className="p-4 border border-red-900/30 rounded-2xl bg-red-900/5 mb-4 flex items-center space-x-4",p.innerHTML=`
                    <div class="w-12 h-12 bg-red-950/20 rounded-2xl flex items-center justify-center overflow-hidden border border-red-900/20 flex-shrink-0">
                        ${d?`<img src="${d}" class="w-full h-full object-cover">`:'<span class="text-3xl">🧟</span>'}
                    </div>
                    <div class="flex-grow">
                        <div class="flex justify-between items-center">
                            <h4 class="font-bold text-red-400">${o.name}</h4>
                            <span class="text-[9px] px-2 py-0.5 bg-red-500/10 text-red-500 rounded border border-red-500/20 font-bold uppercase">${o.quality}</span>
                        </div>
                        <div class="text-[9px] text-gray-500 mt-1">Cấp ${o.level} | ATK: ${o.stats.atk} | HP: ${o.stats.hp}</div>
                    </div>
                `,n.appendChild(p)})}const t=document.createElement("h3");t.className="text-[10px] text-gray-500 uppercase tracking-widest mt-6 mb-3 border-b border-white/5 pb-1",t.textContent="Bản Vẽ Luyện Thi",n.appendChild(t);const l=Object.values(Z).filter(a=>e.player.knownCorpseRecipes.includes(a.id));if(l.length===0){const a=document.createElement("div");a.className="text-center py-6 text-gray-700 italic text-xs",a.textContent="Ngươi chưa có bí phương luyện thi nào...",n.appendChild(a)}else l.forEach(a=>{const o=f.corpses[a.id],r=document.createElement("div");r.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3 space-y-3";let d="";a.materials.forEach(h=>{var g;const c=x(h.id),m=((g=e.player.inventory.allItems.find(y=>y.id===h.id))==null?void 0:g.quantity)||0;d+=`<div class="text-[9px] ${m>=h.quantity?"text-gray-400":"text-red-500"}">${(c==null?void 0:c.name)||h.id} x${h.quantity} (${m})</div>`});const p=e.player.corpseLevel<a.level,u=Math.floor((.7-a.level*.1+e.player.corpseLevel*.05)*100);r.innerHTML=`
                <div class="flex justify-between items-start">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-red-950/20 rounded-2xl flex items-center justify-center overflow-hidden border border-red-900/20 flex-shrink-0 animate-pulse-subtle">
                            ${o?`<img src="${o}" class="w-full h-full object-cover">`:'<span class="text-3xl">🧟</span>'}
                        </div>
                        <div>
                            <h4 class="font-ancient text-lg text-red-500">${a.name}</h4>
                            <p class="text-[9px] text-gray-500 mt-1">${a.description}</p>
                        </div>
                    </div>
                    ${p?`<span class="text-[8px] text-red-500 uppercase font-bold">Cần Cấp ${a.level}</span>`:`<button class="px-4 py-2 bg-red-900/20 text-red-400 text-[10px] font-bold rounded-xl border border-red-900/30" onclick="window.game.refineCorpse('${a.id}')">LUYỆN CHẾ</button>`}
                </div>
                <div class="grid grid-cols-2 gap-2">${d}</div>
                <div class="flex justify-between items-center text-[8px] text-gray-500 italic">
                    <span>Tỷ lệ thành công: ${u}%</span>
                    <span>Phản phệ: ${100-u}%</span>
                </div>
            `,n.appendChild(r)})}renderTechniques(n="cultivation"){if(e.player){if(e.activeTechTab=n,this.btnTechTabCultivation&&this.btnTechTabSecret&&this.btnTechTabCustom&&(this.btnTechTabCultivation.className="flex-grow py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all",this.btnTechTabSecret.className="flex-grow py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all",this.btnTechTabCustom.className="flex-grow py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all",n==="cultivation"?this.btnTechTabCultivation.className="flex-grow py-2 bg-qi-blue/20 text-qi-blue border border-qi-blue/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all":n==="secret"?this.btnTechTabSecret.className="flex-grow py-2 bg-qi-purple/20 text-qi-purple border border-qi-purple/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all":n==="custom"&&(this.btnTechTabCustom.className="flex-grow py-2 bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all")),this.elTechListView){if(this.elTechListView.innerHTML="",this.elTechListView.classList.remove("hidden"),this.elTechDetailView&&this.elTechDetailView.classList.add("hidden"),n==="custom"){this.elTechListView.innerHTML=`
                    <div class="bg-black/40 p-5 rounded-3xl border border-white/5 space-y-6">
                        <div>
                            <h3 class="font-ancient text-cultivation-gold text-lg">Khai Tông Sáng Lập</h3>
                            <p class="text-[9px] text-gray-500 mt-1 uppercase tracking-widest">Tự Sáng Tạo Công Pháp Chí Cao</p>
                        </div>

                        <!-- Cost Alert -->
                        <div class="bg-white/[0.02] p-4 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                            <div class="space-y-1 w-full">
                                <div class="text-[9px] text-gray-500 uppercase tracking-wider mb-2">Tiêu hao sáng lập:</div>
                                <div class="flex justify-between items-center">
                                    <span class="font-mono ${e.player.tuVi>=5e4?"text-qi-jade":"text-red-500"}">50,000 Tu Vi (${Math.floor(e.player.tuVi).toLocaleString()})</span>
                                    <span class="font-mono ${e.player.techniquePoints>=100?"text-qi-jade":"text-red-500"}">100 Điểm Công Pháp (${e.player.techniquePoints})</span>
                                </div>
                            </div>
                        </div>

                        <!-- Name Input -->
                        <div class="space-y-2">
                            <label class="text-[9px] text-gray-500 uppercase tracking-widest">Tên Công Pháp</label>
                            <input id="custom-tech-name" type="text" placeholder="Ví dụ: Cửu Thiên Đạo Quyết" 
                                class="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cultivation-gold transition-colors">
                        </div>

                        <!-- Element Select -->
                        <div class="space-y-2">
                            <label class="text-[9px] text-gray-500 uppercase tracking-widest">Thuộc Tính Ngũ Hành</label>
                            <select id="custom-tech-element" 
                                class="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cultivation-gold transition-colors">
                                <option value="Neutral">Hỗn Độn (Vô thuộc tính)</option>
                                <option value="Kim">Kim (Canh Kim Kiếm Khí)</option>
                                <option value="Mộc">Mộc (Trường Xuân Trường Sinh)</option>
                                <option value="Thủy">Thủy (Huyền Âm Chân Thủy)</option>
                                <option value="Hỏa">Hỏa (Tam Muội Chân Hỏa)</option>
                                <option value="Thổ">Thổ (Hậu Thổ Minh Vương)</option>
                                <option value="Phong">Phong (Cực Tốc Thần Phong)</option>
                                <option value="Lôi">Lôi (Ngũ Lôi Oanh Đỉnh)</option>
                                <option value="Băng">Băng (Cực Hàn Băng Sương)</option>
                                <option value="Âm">Âm (U Minh Ma Đạo)</option>
                                <option value="Dương">Dương (Thuần Dương Đạo Pháp)</option>
                            </select>
                        </div>

                        <!-- Stat Boost -->
                        <div class="space-y-2">
                            <label class="text-[9px] text-gray-500 uppercase tracking-widest">Thiên Hướng Cộng Thuộc Tính</label>
                            <select id="custom-tech-stat" 
                                class="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cultivation-gold transition-colors">
                                <option value="atk">Tăng Cường Công Kích (+180 Công Kích)</option>
                                <option value="hp">Hồi Linh Khí Huyết (+600 Sinh Mệnh)</option>
                                <option value="spd">Phi Thăng Tốc Độ (+15 Thân Pháp)</option>
                            </select>
                        </div>

                        <!-- Special Effect -->
                        <div class="space-y-2">
                            <label class="text-[9px] text-gray-500 uppercase tracking-widest">Hiệu Ứng Bẩm Sinh</label>
                            <select id="custom-tech-effect" 
                                class="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cultivation-gold transition-colors">
                                <option value="swordDmg">Kiếm Ý Thông Thiên (+15% Sát thương Kiếm)</option>
                                <option value="tvps">Linh Lực Tinh Thuần (+3.0 Tu Vi/s)</option>
                                <option value="lifeSteal">Huyết Ma Nghịch Thiên (+12% Hút Máu)</option>
                            </select>
                        </div>

                        <!-- Submit Button -->
                        <button id="custom-tech-submit"
                            class="w-full py-4 bg-cultivation-gold text-black text-xs font-bold rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all">
                            ⚡ KHAI TÔNG LẬP PHÁP
                        </button>
                    </div>
                `;const s=document.getElementById("custom-tech-submit");s&&(s.onclick=()=>{const t=document.getElementById("custom-tech-name").value,l=document.getElementById("custom-tech-element").value,a=document.getElementById("custom-tech-stat").value,o=document.getElementById("custom-tech-effect").value;if(!t||t.trim()===""){e.ui.toast("Tên công pháp không được để trống!","error");return}const r={};a==="atk"?r.atk=180:a==="hp"?r.hp=600:a==="spd"&&(r.spd=15);const d={};o==="swordDmg"?d.swordDmg=1.15:o==="tvps"?d.tvps=3:o==="lifeSteal"&&(d.lifeSteal=.12),window.game.createCustomTechnique(t,l,r,d)}),this.elTechPoints&&(this.elTechPoints.textContent=e.player.techniquePoints||0);return}const i=n==="cultivation"?e.player.learnedTechniques:e.player.learnedSecretTechniques;i.length===0?this.elTechListView.innerHTML=`<div class="text-center py-20 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ ${n==="cultivation"?"công pháp":"bí pháp"} nào...</div>`:i.forEach(s=>{const t=n==="cultivation"?H(s.id)||(e.player.customTechniques||[]).find(d=>d.id===s.id):N(s.id);if(!t)return;const l=L.find(d=>d.id===(s.masteryLevel||1)),a=t.stageLabel||"Tầng",o=t.stageNames&&t.stageNames[s.stage-1]?t.stageNames[s.stage-1]:`${a} ${s.stage||1}`,r=document.createElement("div");r.className=`p-4 border ${n==="cultivation"?"border-qi-blue/10 bg-qi-blue/5":"border-qi-purple/10 bg-qi-purple/5"} rounded-2xl flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all mb-3`,r.innerHTML=`
                        <div class="flex items-center space-x-4">
                            <div class="text-2xl">${t.icon||(n==="cultivation"?"📜":"✨")}</div>
                            <div>
                                <h4 class="text-sm font-bold text-white">${t.name}</h4>
                                <div class="flex items-center space-x-2 mt-1">
                                    <span class="text-[8px] px-1.5 py-0.5 bg-black/40 rounded border border-white/5 text-gray-400 font-mono">${o}</span>
                                    <span class="text-[8px] text-cultivation-gold font-bold">${(l==null?void 0:l.name)||"Nhập Môn"}</span>
                                </div>
                            </div>
                        </div>
                        <i class="ph ph-caret-right text-gray-600"></i>
                    `,r.onclick=()=>this.renderTechniqueDetail(s.id,n==="secret"),this.elTechListView.appendChild(r)})}this.elTechPoints&&(this.elTechPoints.textContent=e.player.techniquePoints||0)}}renderTechniqueDetail(n,i){if(!this.elTechDetailContent)return;const s=i?e.player.learnedSecretTechniques.find(c=>c.id===n):e.player.learnedTechniques.find(c=>c.id===n),t=i?N(n):H(n)||(e.player.customTechniques||[]).find(c=>c.id===n);if(!s||!t)return;this.elTechListView.classList.add("hidden"),this.elTechDetailView.classList.remove("hidden");const l=L.findIndex(c=>c.id===(s.masteryLevel||1)),a=L[l],o=L[l+1],r=t.stageLabel||"Tầng",d=t.stageNames&&t.stageNames[s.stage-1]?t.stageNames[s.stage-1]:`${r} ${s.stage||1}`,p=s.masteryLevel>=4&&s.stage<(t.maxStage||10),u=!i&&(e.player.mainTechniqueId===n||e.player.mainBodyTechniqueId===n||e.player.mainSoulTechniqueId===n);let h="";i||(u?h=`
                    <button class="w-full py-4 bg-cultivation-gold/15 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-2xl cursor-default opacity-80" disabled>
                        <i class="ph ph-check-circle mr-1"></i> ĐANG CHỦ TU
                    </button>
                `:h=`
                    <button class="w-full py-4 bg-cultivation-gold text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" onclick="window.game.setMainTechnique('${n}')">
                        <i class="ph ph-shield-star mr-1"></i> THIẾT LẬP CHỦ TU
                    </button>
                `),this.elTechDetailContent.innerHTML=`
            <div class="flex flex-col items-center text-center space-y-4">
                <div class="text-6xl p-6 bg-white/5 rounded-full border border-white/10">${t.icon||"📜"}</div>
                <div>
                    <h3 class="text-2xl font-ancient text-white">${t.name}</h3>
                    <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">${t.quality||"Phàm Khí"}${(t.quality||"Phàm Khí").toLowerCase().includes("khí")||(t.quality||"Phàm Khí").toLowerCase().includes("bảo")||(t.quality||"Phàm Khí").toLowerCase().includes("phẩm")||(t.quality||"Phàm Khí").toLowerCase().includes("giai")||(t.quality||"Phàm Khí").toLowerCase().includes("hỏa")||(t.quality||"Phàm Khí").toLowerCase().includes("lôi")||["Hoàn Mỹ","Tiên Khí","Linh Bảo","Danh Khí"].includes(t.quality||"Phàm Khí")?"":" Phẩm"} | ${d}</p>
                </div>
            </div>

            <div class="bg-black/40 p-5 rounded-3xl border border-white/5 space-y-4">
                <div class="flex justify-between items-end mb-1">
                    <span class="text-[9px] text-gray-500 uppercase tracking-widest">Độ Thuần Thục: ${(a==null?void 0:a.name)||"Nhập Môn"}</span>
                    <span class="text-[10px] font-mono text-white">${s.mastery} / ${(o==null?void 0:o.threshold)||"MAX"}</span>
                </div>
                <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-cultivation-gold" style="width: ${s.masteryLevel>=4?100:s.mastery/((o==null?void 0:o.threshold)||1)*100}%"></div>
                </div>
                
                <div class="grid grid-cols-2 gap-3 mt-6">
                    <button class="py-4 bg-qi-blue text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" onclick="window.game.cultivateTechnique('${n}', ${i})">TU LUYỆN</button>
                    <button class="py-4 ${p?"bg-cultivation-gold":"bg-gray-800 opacity-50"} text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" 
                        onclick="window.game.breakthroughTechnique('${n}', ${i})">ĐỘT PHÁ TẦNG</button>
                </div>
                ${h?`<div class="mt-3">${h}</div>`:""}
            </div>

            <div class="space-y-4">
                <h4 class="text-xs font-ancient text-gray-500 uppercase tracking-widest border-l-2 border-gray-500 pl-3">Mô tả & Hiệu ứng</h4>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs text-gray-400 leading-relaxed">
                    ${t.description||"Không có mô tả."}
                </div>
            </div>
        `}}export{ae as SystemsScreen};
