import{s as e,t as k,u as N,v as S,e as P,h as g,i as T,F as $,w as C,d as A,x as I,y as K,G as j,z as V,C as D,E as F,n as G,A as y,S as R,b as Q,H as O,a as U,J as E,f as Y,P as Z,K as W,L as q,T as X,B,N as w,O as _,Q as z,U as J,V as ee,j as M,k as H,r as L}from"./index-CQP7GDKh.js";import"./vendor-capacitor-DNzPfH2b.js";import"./vendor-gsap-CzGW6FVa.js";const te=[{floor:1,name:"Ngoại Tháp - Tầng 1",description:"Nơi tập trung các luyện dược sư trẻ tuổi tài năng.",minAlchemyLevel:3,rewards:{expMult:1.2}},{floor:2,name:"Nội Tháp - Tầng 2",description:"Chỉ dành cho những người có thần thức mạnh mẽ.",minAlchemyLevel:5,rewards:{expMult:1.5,qualityBonus:.1}},{floor:3,name:"Thánh Đan Điện",description:"Nơi cư ngụ của các bậc Đan Thánh.",minAlchemyLevel:7,rewards:{expMult:2,qualityBonus:.25}}];class le{constructor(){this.shopSubFilter="all",this.shopQualityFilter="all",this.shopSearchQuery="",this.shopSortMode="default",this.activeSectZone=null,this.initElements(),this.initEvents()}initElements(){this.btnAlchemyTabRecipes=document.getElementById("alchemy-tab-recipes"),this.btnAlchemyTabGarden=document.getElementById("alchemy-tab-garden"),this.viewAlchemyRecipes=document.getElementById("alchemy-recipes-view"),this.viewAlchemyGarden=document.getElementById("alchemy-garden-view"),this.elAlchemyLvlText=document.getElementById("alchemy-level-text"),this.elAlchemyExpBar=document.getElementById("alchemy-exp-bar"),this.elGardenPlots=document.getElementById("garden-plots"),this.elShopLingShi=document.getElementById("shop-ling-shi"),this.elShopBuyView=document.getElementById("shop-buy-view"),this.elShopSellView=document.getElementById("shop-sell-view"),this.elShopSellGrid=document.getElementById("shop-sell-grid"),this.elShopSectionNav=document.getElementById("shop-section-nav"),this.elShopSubFilterNav=document.getElementById("shop-subfilter-nav"),this.elShopQualityFilterNav=document.getElementById("shop-quality-filter-nav"),this.elShopFiltersWrap=document.getElementById("shop-filters-wrap"),this.btnShopTabBuy=document.getElementById("shop-tab-buy"),this.btnShopTabSell=document.getElementById("shop-tab-sell"),this.elShopSearchInput=document.getElementById("shop-search-input"),this.elShopSortSelect=document.getElementById("shop-sort-select"),this.elGuildCerts=document.getElementById("guild-cert-list"),this.elTechListView=document.getElementById("tech-list-view"),this.elTechDetailView=document.getElementById("tech-detail-view"),this.elTechDetailContent=document.getElementById("tech-detail-content"),this.elTechPoints=document.getElementById("tech-points"),this.btnTechTabCultivation=document.getElementById("tech-tab-cultivation"),this.btnTechTabSecret=document.getElementById("tech-tab-secret"),this.btnTechTabCustom=document.getElementById("tech-tab-custom"),this.btnTechBack=document.getElementById("tech-back-btn"),this.elGuildMissions=document.getElementById("guild-mission-list"),this.elGuildRooms=document.getElementById("guild-room-list"),this.elTowerFloors=document.getElementById("tower-floor-list"),this.elSectsView=document.getElementById("sects-view")}initEvents(){this.btnAlchemyTabRecipes&&(this.btnAlchemyTabRecipes.onclick=()=>{e.views.alchemy="recipes",this.renderAlchemy()}),this.btnAlchemyTabGarden&&(this.btnAlchemyTabGarden.onclick=()=>{e.views.alchemy="garden",this.renderAlchemy()}),this.btnShopTabBuy&&(this.btnShopTabBuy.onclick=()=>{e.views.shop="buy",this.renderShop()}),this.btnShopTabSell&&(this.btnShopTabSell.onclick=()=>{e.views.shop="sell",this.renderShop()}),this.elShopSearchInput&&(this.elShopSearchInput.oninput=n=>{this.shopSearchQuery=n.target.value.toLowerCase().trim(),this.renderShop()}),this.elShopSortSelect&&(this.elShopSortSelect.onchange=n=>{this.shopSortMode=n.target.value,this.renderShop()}),this.btnTechTabCultivation&&(this.btnTechTabCultivation.onclick=()=>this.renderTechniques("cultivation")),this.btnTechTabSecret&&(this.btnTechTabSecret.onclick=()=>this.renderTechniques("secret")),this.btnTechTabCustom&&(this.btnTechTabCustom.onclick=()=>this.renderTechniques("custom")),this.btnTechBack&&(this.btnTechBack.onclick=()=>{this.elTechListView.classList.remove("hidden"),this.elTechDetailView.classList.add("hidden")})}renderAlchemy(){if(!e.player)return;const n=document.getElementById("alchemy-tools-container");e.views.alchemy==="recipes"?(this.viewAlchemyRecipes.classList.remove("hidden"),this.viewAlchemyGarden.classList.add("hidden"),n&&n.classList.remove("hidden"),this.btnAlchemyTabRecipes&&(this.btnAlchemyTabRecipes.className="flex-grow py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all"),this.btnAlchemyTabGarden&&(this.btnAlchemyTabGarden.className="flex-grow py-3 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all")):(this.viewAlchemyRecipes.classList.add("hidden"),this.viewAlchemyGarden.classList.remove("hidden"),n&&n.classList.add("hidden"),this.btnAlchemyTabRecipes&&(this.btnAlchemyTabRecipes.className="flex-grow py-3 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all"),this.btnAlchemyTabGarden&&(this.btnAlchemyTabGarden.className="flex-grow py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all"));const a=k(e.player.alchemyLevel);this.elAlchemyLvlText.textContent=a.name;const i=Math.max(1,e.player.alchemyLevel*100*Math.pow(1.5,e.player.alchemyLevel-1));this.elAlchemyExpBar.style.width=`${Math.min(100,e.player.alchemyExp/i*100)}%`,e.views.alchemy==="recipes"?this.renderRecipes():this.renderGarden();const t=document.getElementById("alchemy-cauldron-name"),s=document.getElementById("alchemy-flame-name");if(t){const l=N(e.player.currentCauldron);l?t.innerHTML=`<span class="text-white">${l.name}</span>`:t.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`}if(s){const l=S(e.player.currentFlame);l?s.innerHTML=`<span class="text-white">${l.name}</span>`:s.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`}}renderRecipes(){this.viewAlchemyRecipes.innerHTML="";const n=P.filter(a=>e.player.knownRecipes.includes(a.id));if(n.length===0){this.viewAlchemyRecipes.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được đan phương nào...</div>';return}n.forEach(a=>{const i=g(a.resultId);if(!i)return;const t=this.getQualityClass(i.quality),s=document.createElement("div");s.className="p-4 border border-gray-800 rounded-2xl bg-white/5 space-y-3";let l="";a.materials.forEach(r=>{const c=g(r.id);if(!c)return;const h=e.player.inventory.allItems.find(d=>d.id===r.id),u=h?h.quantity:0,p=u>=r.quantity;l+=`<div class="text-[10px] ${p?"text-gray-400":"text-red-500"}">${c.name}: ${u}/${r.quantity}</div>`});const o=e.player.alchemyLevel<a.level;s.innerHTML=`
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <span class="text-xl mr-2">${i.image?`<img src="${T(i.image)}" class="w-6 h-6 object-contain inline-block">`:i.icon||""}</span>
                        <span class="font-bold quality-${t} font-ancient">${i.name}</span>
                    </div>
                    ${o?`<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${a.level}</span>`:`<button class="px-3 py-1.5 btn-gold text-[10px] font-bold rounded-lg whitespace-nowrap" onclick="window.game.craft('${a.id}')">LUYỆN CHẾ</button>`}
                </div>
                <div class="grid grid-cols-2 gap-1">${l}</div>
                <div class="text-[9px] text-gray-500 italic">${a.description}</div>
            `,this.viewAlchemyRecipes.appendChild(s)})}renderGarden(){this.elGardenPlots.innerHTML="",e.player.gardenPlots.forEach((n,a)=>{const i=document.createElement("div"),t=$[n.grade]||$.PHAM,s=C[n.attribute]||C.NORMAL;i.className="p-4 border rounded-3xl bg-white/5 flex flex-col space-y-4 transition-all hover:border-qi-jade/30 border-white/5 relative overflow-hidden";const l=document.createElement("div");l.className="absolute -right-2 -bottom-2 text-4xl opacity-5 pointer-events-none",l.textContent=s.icon,i.appendChild(l);let o=`
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center space-x-2">
                            <span class="text-[9px] px-2 py-0.5 rounded-full border bg-white/5 text-gray-400 border-white/10 uppercase font-bold">${t.name}</span>
                            <span class="text-[9px] px-2 py-0.5 rounded-full border bg-white/5 text-[${s.color}] border-white/10 uppercase font-bold" style="color: ${s.color}">${s.icon} ${s.name}</span>
                        </div>
                    </div>
                    <button class="p-1.5 hover:bg-white/10 rounded-full transition-colors" onclick="window.game.showFieldMenu(${a})">
                        <i class="ph ph-gear text-gray-500 text-xs"></i>
                    </button>
                </div>
            `;if(n.seedId){const r=A.find(h=>h.id===n.seedId),c=g(r.herbId);o+=`
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/10">
                            ${(c==null?void 0:c.icon)||"🌱"}
                        </div>
                        <div class="flex-grow">
                            <h4 class="text-xs font-ancient text-white">${r.name}</h4>
                            <div class="flex items-center space-x-2 mt-1">
                                <span class="text-[10px] text-qi-jade font-bold">${n.stage}</span>
                                <span class="text-[9px] text-gray-500">(${Math.floor(n.age)} năm)</span>
                            </div>
                        </div>
                        <button class="px-3 py-1.5 bg-qi-jade/10 text-qi-jade text-[10px] font-bold rounded-xl border border-qi-jade/20 active:scale-95 transition-all" onclick="window.game.harvest(${a})">THU HOẠCH</button>
                    </div>
                `}else o+=`
                    <div class="flex flex-col items-center justify-center py-4 space-y-3">
                        <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                            <i class="ph ph-plus text-gray-600"></i>
                        </div>
                        <button class="px-6 py-2 bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] font-bold rounded-xl border border-white/10 transition-all" onclick="window.game.showPlantMenu(${a})">GIEO HẠT</button>
                    </div>
                `;i.innerHTML+=o,this.elGardenPlots.appendChild(i)})}renderShop(){if(!e.player)return;this.elShopLingShi.innerHTML=e.player.getFormattedLingShi();const n=document.getElementById("shop-vip-level");n&&(n.textContent=`VIP ${e.player.vipLevel}`,n.className=`px-2 py-0.5 rounded bg-gray-800 text-[8px] font-bold text-gray-400 border border-white/5 bg-vip-${e.player.vipLevel}`);const a=document.getElementById("shop-overlay-title");if(a&&e.systems.shop){const i=I[e.systems.shop.currentShopId];i&&(a.textContent=i.name.split(" - ")[0])}this.renderShopSections(),this.renderShopSubFilters(),this.btnShopTabBuy&&this.btnShopTabSell&&(e.views.shop==="buy"?(this.btnShopTabBuy.className="flex-grow py-3 text-cultivation-gold border-b-2 border-cultivation-gold text-xs",this.btnShopTabSell.className="flex-grow py-3 text-gray-500 border-b-2 border-transparent text-xs"):(this.btnShopTabBuy.className="flex-grow py-3 text-gray-500 border-b-2 border-transparent text-xs",this.btnShopTabSell.className="flex-grow py-3 text-cultivation-gold border-b-2 border-cultivation-gold text-xs")),e.views.shop==="buy"?(this.elShopBuyView.classList.remove("hidden"),this.elShopSellView.classList.add("hidden"),this.renderShopBuy()):(this.elShopBuyView.classList.add("hidden"),this.elShopSellView.classList.remove("hidden"),this.renderShopSell())}renderShopSections(){if(!this.elShopSectionNav)return;const n=e.systems.shop,a=[{id:"dan_duoc",name:"Đan Dược",icon:"💊"},{id:"phap_bao",name:"Trang Bị",icon:"⚔️"},{id:"cong_phap",name:"Bí Tịch",icon:"📜"},{id:"bach_nghe",name:"Bách Nghệ",icon:"⚒️"},{id:"ky_vat",name:"Kỳ Vật",icon:"💎"}];this.elShopSectionNav.querySelectorAll("button").length!==a.length&&(this.elShopSectionNav.innerHTML="",this.elShopSectionNav.dataset.shopId=n.currentShopId,a.forEach(t=>{const s=document.createElement("button");s.dataset.category=t.id,s.onclick=()=>{e.systems.shop&&(e.systems.shop.currentSection=t.id,this.shopSubFilter="all",this.shopQualityFilter="all",this.renderShop())},this.elShopSectionNav.appendChild(s)})),this.elShopSectionNav.querySelectorAll("button").forEach(t=>{const s=t.dataset.category,l=a.find(r=>r.id===s),o=n.currentSection===s;t.className=`px-4 py-2.5 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all whitespace-nowrap shrink-0 flex items-center space-x-2 ${o?"bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]":"text-gray-500 border border-white/5 hover:border-white/10 bg-white/[0.02]"}`,t.innerHTML=`<span>${l.icon}</span> <span>${l.name}</span>`})}renderShopSubFilters(){var s;if(!this.elShopSubFilterNav)return;const n=e.systems.shop;if(!n)return;this.renderShopQualityFilters();const a=n.currentSection;let i=[];if(a==="phap_bao"?i=[{id:"all",name:"--- Lọc Loại Trang Bị ---"},{id:"weapon",name:"Linh Khí (Vũ Khí)"},{id:"armor",name:"Pháp Y (Giáp)"},{id:"accessory",name:"Trang Sức"},{id:"attackArtifact",name:"Pháp Bảo: Chủ Chiến"},{id:"defenseArtifact",name:"Pháp Bảo: Hộ Thân"},{id:"flightArtifact",name:"Pháp Bảo: Phi Hành"},{id:"spaceArtifact",name:"Pháp Bảo: Càn Khôn"},{id:"formationArtifact",name:"Pháp Bảo: Trận Đạo"},{id:"supportArtifact",name:"Pháp Bảo: Phụ Trợ"},{id:"soulArtifact",name:"Pháp Bảo: Hồn Đạo"}]:a==="cong_phap"?i=[{id:"all",name:"--- Lọc Loại Bí Tịch ---"},{id:"cultivation",name:"Công Pháp Tu Luyện"},{id:"manual",name:"Bí Tịch Kỹ Năng"}]:a==="bach_nghe"?i=[{id:"all",name:"--- Lọc Loại Bách Nghệ ---"},{id:"nguyen_lieu",name:"Nguyên Liệu"},{id:"phu_luc",name:"Phù Lục"},{id:"tran_phap",name:"Trận Pháp"},{id:"luyen_khi",name:"Luyện Khí"},{id:"linh_dien",name:"Linh Điền"}]:a==="ky_vat"&&(i=[{id:"all",name:"--- Lọc Loại Kỳ Vật ---"},{id:"tui_tru_vat",name:"Túi Trữ Vật"},{id:"ky_trung",name:"Kỳ Trùng"},{id:"linh_thu",name:"Linh Thú"}]),(s=this.elShopFiltersWrap)==null||s.classList.remove("hidden"),i.length===0){this.elShopSubFilterNav.innerHTML="",this.elShopSubFilterNav.classList.add("hidden");return}this.elShopSubFilterNav.classList.remove("hidden"),this.elShopSubFilterNav.className="p-2",this.elShopSubFilterNav.innerHTML=`
            <select id="shop-subfilter-select" class="w-full bg-black/40 text-qi-blue border border-qi-blue/20 rounded-lg px-2 py-1.5 text-[9px] font-ancient uppercase tracking-widest outline-none transition-all focus:border-qi-blue/50">
                ${i.map(l=>`<option value="${l.id}" ${this.shopSubFilter===l.id?"selected":""}>${l.name}</option>`).join("")}
            </select>
        `;const t=this.elShopSubFilterNav.querySelector("#shop-subfilter-select");t.onchange=l=>{this.shopSubFilter=l.target.value,this.renderShop()}}renderShopQualityFilters(){if(!this.elShopQualityFilterNav)return;const n=e.systems.shop;if(!n)return;const a=n.currentSection;if(!["phap_bao","dan_duoc","cong_phap","bach_nghe"].includes(a)){this.elShopQualityFilterNav.classList.add("hidden"),this.elShopSubFilterNav.classList.remove("border-r","border-white/5"),this.elShopQualityFilterNav.innerHTML="";return}this.elShopSubFilterNav.classList.add("border-r","border-white/5");const t=[{id:"all",name:"Tất cả phẩm"},{id:"Phàm Khí",name:"Phàm Khí"},{id:"Pháp Khí",name:"Pháp Khí"},{id:"Linh Khí",name:"Linh Khí"},{id:"Pháp Bảo",name:"Pháp Bảo"},{id:"Cổ Bảo",name:"Cổ Bảo"},{id:"Linh Bảo",name:"Linh Bảo"},{id:"Thông Thiên Linh Bảo",name:"Thông Thiên Linh Bảo"},{id:"Tiên Khí",name:"Tiên Khí"},{id:"Danh Khí",name:"Danh Khí"}];this.elShopQualityFilterNav.classList.remove("hidden"),this.elShopQualityFilterNav.className="p-2 flex-1 border-white/5",this.elShopQualityFilterNav.innerHTML=`
            <select id="shop-quality-select" class="w-full bg-black/40 text-cultivation-gold border border-cultivation-gold/20 rounded-lg px-2 py-1.5 text-[9px] font-ancient uppercase tracking-widest outline-none transition-all focus:border-cultivation-gold/50">
                ${t.map(l=>`<option value="${l.id}" ${this.shopQualityFilter===l.id?"selected":""}>${l.name}</option>`).join("")}
            </select>
        `;const s=this.elShopQualityFilterNav.querySelector("#shop-quality-select");s.onchange=l=>{this.shopQualityFilter=l.target.value,this.renderShop()}}renderShopBuy(){const n=e.systems.shop;let a=n.getShopInventory();if(this.elShopBuyView.innerHTML="",this.shopSearchQuery&&(a=a.filter(i=>{const t=g(i.id);return t&&t.name.toLowerCase().includes(this.shopSearchQuery)})),this.shopSubFilter!=="all"&&(a=a.filter(i=>{var s;const t=g(i.id);if(!t)return!1;if(n.currentSection==="phap_bao")return t.type===this.shopSubFilter;if(n.currentSection==="cong_phap"){const l=t.action&&(t.action.startsWith("open_")||t.action.includes("linh_the_luc")||((s=t.effect)==null?void 0:s.type)==="unlock_profession"),o=(t.type==="book"||t.type==="technique")&&!l,r=t.type==="recipe"||t.type==="talisman_recipe"||l;if(this.shopSubFilter==="cultivation")return o;if(this.shopSubFilter==="manual")return r}else if(["bach_nghe","ky_vat"].includes(n.currentSection))return(I[n.currentShopId].sections[this.shopSubFilter]||[]).some(r=>r.id===i.id);return!0})),this.shopQualityFilter!=="all"&&(a=a.filter(i=>{const t=g(i.id);return t&&t.quality===this.shopQualityFilter})),this.shopSortMode!=="default"&&a.sort((i,t)=>{const s=g(i.id),l=g(t.id);if(!s||!l)return 0;if(this.shopSortMode==="price-asc")return s.price-l.price;if(this.shopSortMode==="price-desc")return l.price-s.price;if(this.shopSortMode==="quality"){const o=["Phàm Khí","Pháp Khí","Linh Khí","Pháp Bảo","Cổ Bảo","Linh Bảo","Thông Thiên Linh Bảo","Tiên Khí","Danh Khí","Hạ phẩm","Trung phẩm","Thượng phẩm","Cực phẩm","Hoàn Mỹ"];return o.indexOf(l.quality)-o.indexOf(s.quality)}return 0}),a.length===0){this.elShopBuyView.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Không tìm thấy bảo vật phù hợp...</div>';return}a.forEach(i=>{const t=g(i.id);if(!t)return;const s=this.getQualityClass(t.quality),l=document.createElement("div");l.className=`flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-xl hover:border-${s} cursor-pointer transition-colors duration-200`,l.onclick=()=>{window.game.screens.inventory&&window.game.screens.inventory.selectItem(i.id,!0)};const o=document.createElement("div");o.className="flex items-center space-x-3",o.innerHTML=`
                <div class="text-2xl bg-black/60 p-2 rounded-lg border border-${s}/30">${t.image?`<img src="${T(t.image)}" class="w-8 h-8 object-contain">`:t.icon||""}</div>
                <div>
                    <div class="text-sm font-bold text-white">${t.name}</div>
                    <div class="text-[9px] font-bold quality-${s}">${t.quality}${t.quality.toLowerCase().includes("khí")||t.quality.toLowerCase().includes("bảo")||t.quality.toLowerCase().includes("phẩm")||t.quality.toLowerCase().includes("giai")||t.quality.toLowerCase().includes("hỏa")||t.quality.toLowerCase().includes("lôi")||["Hoàn Mỹ","Tiên Khí","Linh Bảo","Danh Khí"].includes(t.quality)?"":" phẩm"} | Kho: ${i.stock}</div>
                </div>
            `;const r=Math.floor(t.price*(1-Math.min(.25,e.player.vipLevel*.05))),c=i.minVip&&e.player.vipLevel<i.minVip,h=document.createElement("div");h.className="flex items-center space-x-3",h.innerHTML=`
                <div class="text-right">
                    <div class="text-[8px] text-gray-500 line-through">${t.price} LT</div>
                    <div class="text-xs font-mono text-cultivation-gold whitespace-nowrap">${r} LT</div>
                    ${c?`<div class="text-[7px] text-red-500 font-bold uppercase animate-pulse">Yêu cầu VIP ${i.minVip}</div>`:""}
                </div>
            `;const u=document.createElement("button"),p=i.stock<=0;u.className=`px-3 py-1.5 btn-gold text-[10px] font-bold rounded-lg whitespace-nowrap ${p||c?"opacity-50 grayscale pointer-events-none":""}`,u.innerHTML='<i class="ph ph-shopping-cart-simple mr-1"></i>TRAO ĐỔI',u.onclick=d=>{d.stopPropagation(),window.game.buyItem(i.id)},h.appendChild(u),l.appendChild(o),l.appendChild(h),this.elShopBuyView.appendChild(l)})}renderShopSell(){if(this.elShopSellGrid.innerHTML="",!e.player||!e.player.inventory)return;const n=e.systems.shop.currentSection,a=this.shopSubFilter;let i=[...e.player.inventory.allItems];if(this.shopSearchQuery&&(i=i.filter(t=>{const s=g(t.id);return s&&s.name.toLowerCase().includes(this.shopSearchQuery)})),i=i.filter(t=>{var h;const s=g(t.id);if(!s)return!1;const l={dan_duoc:["consumable"],phap_bao:["weapon","armor","accessory","treasure","head","necklace","shoes","attackArtifact","defenseArtifact","flightArtifact","spaceArtifact","formationArtifact","supportArtifact","soulArtifact"],nguyen_lieu:["material","herb","ore","wood"],cong_phap:["book","technique","recipe","talisman_recipe","consumable"],tran_phap:["formation"],phu_luc:["talisman"],luyen_khi:["material","smithing_tool"],tui_tru_vat:["consumable"],ky_trung:["consumable"],linh_thu:["supportArtifact"]},c=({dan_duoc:["dan_duoc"],phap_bao:["phap_bao"],cong_phap:["cong_phap"],bach_nghe:["nguyen_lieu","phu_luc","tran_phap","luyen_khi","linh_dien"],ky_vat:["tui_tru_vat","ky_trung","linh_thu"]}[n]||[n]).flatMap(u=>l[u]||[]);if(c.length>0&&!c.includes(s.type))return!1;if(n==="cong_phap"){const u=s.action&&(s.action.startsWith("open_")||s.action.includes("linh_the_luc")),p=(s.type==="book"||s.type==="technique")&&!u,d=s.type==="recipe"||s.type==="talisman_recipe"||s.type==="consumable"&&((h=s.effect)==null?void 0:h.type)==="unlock_profession"||u;if(a==="cultivation"&&!p||a==="manual"&&p||a==="manual"&&!d&&!p||a==="all"&&!p&&!d)return!1}return!(["bach_nghe","ky_vat"].includes(n)&&a!=="all"&&(!l[a]||!l[a].includes(s.type))||n==="phap_bao"&&a!=="all"&&s.type!==a||a==="tui_tru_vat"&&s.action!=="expand_inventory"||this.shopQualityFilter!=="all"&&s.quality!==this.shopQualityFilter)}),this.shopSortMode!=="default"&&i.sort((t,s)=>{const l=g(t.id),o=g(s.id);if(!l||!o)return 0;if(this.shopSortMode==="price-asc")return l.price-o.price;if(this.shopSortMode==="price-desc")return o.price-l.price;if(this.shopSortMode==="quality"){const r=["Phàm Khí","Pháp Khí","Linh Khí","Pháp Bảo","Cổ Bảo","Linh Bảo","Thông Thiên Linh Bảo","Tiên Khí","Danh Khí","Hạ phẩm","Trung phẩm","Thượng phẩm","Cực phẩm","Hoàn Mỹ"];return r.indexOf(o.quality)-r.indexOf(l.quality)}return 0}),i.length===0){this.elShopSellGrid.innerHTML='<div class="col-span-4 text-center py-10 text-gray-600 italic text-xs">Không có bảo vật nào để giao dịch...</div>';return}i.forEach(t=>{const s=g(t.id);if(!s)return;const l=this.getQualityClass(s.quality);let o=.5;["material","herb","ore","wood"].includes(s.type)&&(o=.3);const r=document.createElement("div");r.className=`p-2 border border-gray-800 rounded-lg bg-black/20 flex flex-col items-center cursor-pointer hover:border-${l} transition-colors duration-200 active:scale-95`,r.innerHTML=`
                <div class="text-2xl mb-1">${s.image?`<img src="${T(s.image)}" class="w-8 h-8 object-contain">`:s.icon||""}</div>
                <div class="text-[9px] text-gray-400">x${t.quantity}</div>
                <div class="text-[8px] text-cultivation-gold mt-1">${Math.floor(s.price*o)} LT</div>
            `,r.onclick=()=>{window.game.screens.inventory&&window.game.screens.inventory.selectItem(t.id,!1,!0)},this.elShopSellGrid.appendChild(r)})}renderGuild(){e.player&&(this.elGuildCerts.innerHTML="",this.elGuildMissions=document.getElementById("guild-mission-list"),this.elGuildRooms=document.getElementById("guild-room-list"),K.forEach(n=>{var t;const a=e.player.alchemyLevel<n.requirements.alchemyLevel,i=document.createElement("div");i.className="p-4 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center",i.innerHTML=`
                <div>
                    <h4 class="text-sm font-ancient text-white">${n.name}</h4>
                    <p class="text-[10px] text-gray-500">Phí: ${n.requirements.fee} LT | Cần luyện: ${n.task.quantity} ${((t=g(n.task.targetId))==null?void 0:t.name)||"đan dược"}</p>
                </div>
                <button class="px-3 py-1.5 bg-qi-blue text-black text-[10px] font-bold rounded-lg ${a?"opacity-50":""}" 
                    onclick="window.game.guildCertify(${n.level})">KHẢO HẠCH</button>
            `,this.elGuildCerts.appendChild(i)}),this.elGuildMissions&&(this.elGuildMissions.innerHTML="",j.forEach(n=>{const a=document.createElement("div");a.className="p-4 border border-white/5 rounded-xl bg-white/5 space-y-2",a.innerHTML=`
                    <div class="flex justify-between items-center">
                        <h4 class="text-sm font-ancient text-white">${n.name}</h4>
                        <button class="px-3 py-1 bg-qi-purple text-white text-[10px] font-bold rounded-lg" 
                            onclick="window.game.guildMission('${n.id}')">GIAO NỘP</button>
                    </div>
                    <p class="text-[10px] text-gray-400 italic">${n.description}</p>
                    <p class="text-[9px] text-cultivation-gold">Thưởng: ${n.rewards.lingShi} LT | Danh vọng: ${n.rewards.reputation}</p>
                `,this.elGuildMissions.appendChild(a)})),this.elGuildRooms&&(this.elGuildRooms.innerHTML="",V.forEach(n=>{const a=e.player.currentAlchemyRoom===n.id,i=document.createElement("div");i.className=`p-4 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center ${a?"border-cultivation-gold":""}`,i.innerHTML=`
                    <div>
                        <h4 class="text-sm font-ancient text-white">${n.name} ${a?"⭐":""}</h4>
                        <p class="text-[10px] text-gray-500">Phí thuê: ${n.fee} LT | Tăng ${n.successBonus*100}% thành công</p>
                    </div>
                    <button class="px-3 py-1.5 ${a?"bg-gray-800":"bg-cultivation-gold"} text-black text-[10px] font-bold rounded-lg" 
                        onclick="window.game.guildRent('${n.id}')">${a?"ĐANG THUÊ":"THUÊ"}</button>
                `,this.elGuildRooms.appendChild(i)})))}renderTower(){const n=document.getElementById("tower-floor-list");n&&(n.innerHTML="",te.forEach(a=>{const i=e.player.alchemyLevel<a.minAlchemyLevel,t=document.createElement("div");t.className=`p-6 border border-white/5 rounded-2xl bg-white/5 space-y-3 ${i?"opacity-40":"hover:border-cultivation-gold/50 cursor-pointer"}`,t.innerHTML=`
                <div class="flex justify-between items-center">
                    <h4 class="text-lg font-ancient text-cultivation-gold">${a.name}</h4>
                    ${i?`<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${a.minAlchemyLevel}</span>`:'<i class="ph ph-caret-right text-gray-500"></i>'}
                </div>
                <p class="text-xs text-gray-400">${a.description}</p>
            `,i||(t.onclick=()=>e.ui.toast(`Đang tiến vào ${a.name}...`,"success")),n.appendChild(t)}))}renderMountain(){const n=document.getElementById("mountain-layer-name"),a=document.getElementById("mountain-layer-desc"),i=document.getElementById("mountain-layer-progress-text"),t=document.getElementById("mountain-layer-progress-bar"),s=document.getElementById("mountain-oxygen-text"),l=document.getElementById("mountain-oxygen-bar"),o=document.getElementById("mountain-toxicity-text"),r=document.getElementById("mountain-toxicity-bar");if(document.getElementById("mountain-event-log"),!e.player.mountainSurvival)return;const c=e.systems.mountain,h=D.find(m=>m.id===c.currentLayer),u=F.find(m=>m.id===h.tier);if(n){const m={ngoai_son:"text-green-400",trung_son:"text-blue-400",noi_son:"text-purple-400",cam_khu:"text-red-500"}[h.tier]||"text-red-400";n.innerHTML=`<span class="text-[10px] block opacity-60 uppercase tracking-tighter">${u.name}</span>${h.name}`,n.className=`text-2xl font-ancient ${m} mb-1`}a&&(a.textContent=h.description);const p=c.discovery[c.currentLayer]||0;i&&(i.textContent=`${Math.floor(c.layerProgress)}% (Khám phá: ${Math.floor(p)}%)`),t&&(t.style.width=`${c.layerProgress}%`),s&&(s.textContent=`${Math.ceil(e.player.mountainSurvival.oxygen)}%`),l&&(l.style.width=`${e.player.mountainSurvival.oxygen}%`),o&&(o.textContent=`${Math.ceil(e.player.mountainSurvival.toxicity)}%`),r&&(r.style.width=`${e.player.mountainSurvival.toxicity}%`);const d=document.getElementById("btn-mountain-deeper");if(d){const m=c.bossDefeated[h.tier];c.layerProgress>=100&&!m?d.innerHTML='<span class="relative z-10 text-xs font-bold text-red-500 uppercase tracking-[0.2em] animate-pulse">KHIÊU CHIẾN THỦ LĨNH</span>':d.innerHTML='<span class="relative z-10 text-xs font-bold text-red-400 uppercase tracking-[0.2em]">TẦNG KẾ TIẾP</span>'}e.player.hp<=0&&(e.systems.mountain.stop(),e.ui.toggleOverlay(document.getElementById("mountain-overlay"),!1))}renderSects(){const n=document.getElementById("sects-view");if(n)if(n.innerHTML="",e.player.sectId){const a=G(e.player.sectId);if(this.activeSectZone){this.renderSectZoneDetail(a,this.activeSectZone);return}const i=[{id:"son_mon",name:"Sơn Môn",icon:"⛩️",desc:"Hộ tông đại trận, đệ tử canh phòng."},{id:"quang_truong",name:"Quảng Trường Tông Môn",icon:"🏟️",desc:"Nhiệm vụ, luận đạo học hỏi."},{id:"dai_dien",name:"Đại Điện / Chủ Điện",icon:"🏛️",desc:"Bái kiến Tông chủ & hội nghị trưởng lão."},{id:"tang_kinh_cac",name:"Tàng Kinh Các",icon:"📚",desc:"Nhiơi học công pháp & bí tịch truyền thừa."},{id:"luyen_dan",name:"Luyện Đan Phòng",icon:"🧪",desc:"Địa hỏa linh thất đan dược (+10% thành công)."},{id:"luyen_khi",name:"Luyện Khí Các",icon:"⚒️",desc:"Đúc đập thần binh pháp bảo."},{id:"linh_thu",name:"Linh Thú Viên",icon:"🦁",desc:"Thuần thú ngự trùng dưỡng kỳ lân."},{id:"duoc_vien",name:"Dược Viên / Linh Điền",icon:"🌿",desc:"Tiên dược quý hiếm trồng trọt."},{id:"dong_phu",name:"Động Phủ Đệ Tử",icon:"🛕",desc:"Động phủ tu luyện cá nhân tĩnh cơ."},{id:"bi_canh",name:"Bí Cảnh Thí Luyện",icon:"🗼",desc:"Thí Luyện Tháp, vượt ải ảo ảnh."}];n.innerHTML=`
                <div class="bg-white/5 rounded-2xl border border-qi-blue/30 overflow-hidden mb-4 animate-fade-in">
                    <div class="h-32 relative">
                        <img src="${a.portrait||y.backgrounds.sect}" class="w-full h-full object-cover opacity-40">
                        <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                        <div class="absolute bottom-4 left-4">
                            <h3 class="text-2xl font-ancient text-white">${a.name}</h3>
                            <p class="text-[10px] text-qi-blue uppercase font-bold tracking-widest">${e.player.realmId>=30?"Trưởng lão tông môn":e.player.realmId>=15?"Đệ tử Nội môn":"Đệ tử Ngoại môn"}</p>
                        </div>
                    </div>
                    <div class="p-4 flex justify-between items-center text-xs">
                        <span class="text-gray-400">Điểm cống hiến:</span>
                        <span class="text-cultivation-gold font-mono font-bold text-sm">${e.player.sectContribution||0}</span>
                    </div>
                </div>

                <h4 class="text-xs font-ancient text-gray-300 uppercase tracking-widest border-b border-white/10 pb-2 mb-3">Khu Vực Tông Môn</h4>
                
                <div class="grid grid-cols-2 gap-3 pb-8">
                    ${i.map(t=>`
                        <div class="p-3 bg-black/40 hover:bg-black/60 rounded-xl border border-white/5 hover:border-qi-blue/30 cursor-pointer flex flex-col justify-between space-y-2 transition-all animate-fade-in" 
                             onclick="window.game.screens.systems.activeSectZone = '${t.id}'; window.game.screens.systems.renderSects();">
                            <div class="flex items-center space-x-2">
                                <span class="text-2xl">${t.icon}</span>
                                <div class="font-bold text-xs text-white">${t.name}</div>
                            </div>
                            <div class="text-[9px] text-gray-400 leading-tight">${t.desc}</div>
                            <div class="text-[8px] text-qi-blue font-bold flex items-center justify-end uppercase tracking-wider">
                                Đi tới <i class="ph ph-caret-right ml-0.5"></i>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `}else{const a=e.currentLocId,i=R[a];if(i){const t=e.player.realmId>=i.minRealm,s=e.systems.time,l=s?s.getYear()%2===0:!0,o=s?s.getMonth()===1||s.getMonth()===2:!0,r=l&&o,c=document.createElement("div");c.className=`p-4 border rounded-xl bg-black/40 space-y-3 ${t?"border-gray-800":"opacity-50 grayscale"}`;let h="";r?h=`
                        <button class="w-full py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-xl flex items-center justify-center ${t?"":"hidden"}" onclick="window.game.startRecruitmentExam('${i.id}')">
                            <i class="ph ph-identification-badge mr-2"></i>THAM GIA KHẢO HẠCH
                        </button>
                    `:h=`
                        <div class="p-3 bg-white/5 border border-white/10 rounded-xl text-center space-y-1">
                            <span class="text-gray-400 text-[10px] font-bold uppercase tracking-wider">CHIÊU MỘ CHƯA MỞ</span>
                            <span class="text-[9px] text-gray-500">Mở lại: Tháng 1-2 năm chẵn</span>
                            <button disabled class="w-full mt-2 py-2 bg-gray-500/10 border border-gray-500/20 text-gray-500 text-[9px] font-bold rounded-lg uppercase tracking-wider flex items-center justify-center space-x-1">
                                <i class="ph ph-clock"></i><span>KHÔNG PHẢI MÙA TUYỂN</span>
                            </button>
                        </div>
                    `,c.innerHTML=`
                    <div class="flex justify-between items-center">
                        <h3 class="text-xl font-ancient text-white">${i.name}</h3>
                        <span class="text-[10px] ${t?"text-qi-blue":"text-red-500"}">${t?"Có thể bái nhập":"Cần: "+Q(i.minRealm).name}</span>
                    </div>
                    <p class="text-xs text-gray-500">${i.description}</p>
                    ${h}
                `,n.appendChild(c)}else n.innerHTML=`
                    <div class="flex flex-col items-center justify-center text-center p-8 bg-black/40 border border-white/5 rounded-2xl space-y-4 animate-fade-in">
                        <i class="ph ph-castle-turret text-4xl text-gray-600 animate-pulse"></i>
                        <div>
                            <h3 class="text-base font-ancient text-white mb-1">Vô Môn Vô Phái</h3>
                            <p class="text-xs text-gray-500 max-w-[280px]">Ngươi chưa gia nhập bất kỳ tông môn nào. Hãy di chuyển đến một sơn môn trên Bản Đồ Lịch Luyện để tham gia khảo hạch bái nhập.</p>
                        </div>
                        <button onclick="state.ui.switchScreen('screen-adventure'); state.ui.toggleOverlay(document.getElementById('sects-overlay'), false);" class="px-6 py-2 bg-qi-blue/20 hover:bg-qi-blue/30 border border-qi-blue/30 text-qi-blue text-xs font-bold rounded-xl transition-all">
                            DI CHUYỂN ĐẾN BẢN ĐỒ
                        </button>
                    </div>
                `}}renderSectZoneDetail(n,a){const i=document.getElementById("sects-view");if(!i)return;let t="";switch(a){case"son_mon":t=`
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🛡️ Hộ Sơn Đại Trận</div>
                            <p class="text-[10px] text-gray-400 mb-3">Trận pháp bảo vệ cổng sơn môn hùng vĩ. Khi linh khí đầy đủ, đệ tử ngoại môn cùng ngự quân bất khả xâm phạm.</p>
                            <div class="flex justify-between text-xs mb-2">
                                <span class="text-gray-500">Trạng thái đại trận:</span>
                                <span class="text-green-400 font-bold">Hoạt động ổn định (100%)</span>
                            </div>
                            <button class="w-full py-2 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('son_mon', 'reinforce_array')">
                                <i class="ph ph-lightning mr-1"></i> Truyền Linh Khí Gia Cố (-50 Linh Lực)
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">📜 Bia Đá Tông Quy</div>
                            <p class="text-[10px] text-gray-400 mb-3">Nơi ghi khắc 10 điều luật sắt của tông môn. Đọc và khắc ghi quy tắc củng cố tinh thần tu sĩ đạo tâm.</p>
                            <button class="w-full py-2 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('son_mon', 'vow_rules')">
                                <i class="ph ph-scroll mr-1"></i> Tuyên Thệ Tuân Thủ Tông Quy (Hàng Ngày)
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">💂 Sentinel Guard</div>
                            <p class="text-[10px] text-gray-400 mb-3">Thủ môn đệ tử chăm chỉ tuần tra an ninh tông môn.</p>
                            <button class="w-full py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('son_mon', 'talk_guard')">
                                <i class="ph ph-chat-centered-text mr-1"></i> Trò Chuyện Tuần Tra
                            </button>
                        </div>
                    </div>
                `;break;case"quang_truong":t=`
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">💬 Luận Đạo Hội</div>
                            <p class="text-[10px] text-gray-400 mb-3">Tham gia đối chất linh thức luận đạo cùng đồng môn, so kè ngộ tính để đốn ngộ chân pháp.</p>
                            <button class="w-full py-2 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('quang_truong', 'debate_dao')">
                                <i class="ph ph-brain mr-1"></i> Bắt Đầu Luận Đạo (-20 Linh Lực)
                            </button>
                        </div>

                        <!-- SECT MISSIONS (INLINE MISSION BOARD) -->
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">📋 Bảng Ủy Thác Nhiệm Vụ</div>
                            <p class="text-[10px] text-gray-400 mb-3">Nhận và thực hiện các nhiệm vụ tông môn phân phó để tích lũy uy tín và điểm cống hiến.</p>
                            <div class="space-y-3 mt-2">
                                ${n.missions.map(l=>`
                                    <div class="p-3 bg-black/40 rounded-lg border border-white/5 flex justify-between items-center">
                                        <div>
                                            <div class="text-xs font-bold text-white">${l.name}</div>
                                            <div class="text-[8px] text-gray-500">${l.desc}</div>
                                        </div>
                                        <button class="px-3 py-1 bg-qi-purple/10 text-qi-purple text-[9px] font-bold rounded border border-qi-purple/20 flex items-center" onclick="window.game.doMission('${l.id}')">
                                            <i class="ph ph-scroll mr-0.5"></i>LÀM
                                        </button>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                `;break;case"dai_dien":t=`
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🙇 Thỉnh An Tông Chủ</div>
                            <p class="text-[10px] text-gray-400 mb-3">Cúi chào kính cẩn Tông Chủ tối cao, dâng cống hiến lòng trung thành nhận ân huệ hàng ngày.</p>
                            <button class="w-full py-2 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('dai_dien', 'bow_master')">
                                <i class="ph ph-crown mr-1"></i> Cúi chào Tông Chủ (Hàng Ngày)
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🧘 Giảng Kinh Phục Pháp</div>
                            <p class="text-[10px] text-gray-400 mb-3">Nghe giảng pháp giải đáp từ Truyền công Trưởng lão. Chi phí: 100 Linh Thạch dâng trà.</p>
                            <button class="w-full py-2 bg-qi-purple/10 hover:bg-qi-purple/20 text-qi-purple border border-qi-purple/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('dai_dien', 'listen_lecture')">
                                <i class="ph ph-student mr-1"></i> Bái nghe Thuyết Pháp (-100 Linh Thạch)
                            </button>
                        </div>
                    </div>
                `;break;case"tang_kinh_cac":{const l=`item_${n.id}_t`,o=`item_${n.id}_s`,r=g(l),c=g(o),h=r&&e.player.learnedTechniques.some(d=>d.id===r.techniqueId),u=c&&e.player.learnedSecretTechniques.some(d=>d.id===c.secretId);let p="";if(r){const d=h?'<span class="text-[8px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">ĐÃ LĨNH HỘI</span>':`<button class="px-2 py-1 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold text-[9px] font-bold rounded border border-cultivation-gold/30 flex items-center transition-all" onclick="window.game.buySectScroll('${l}', 200)">
                                <i class="ph ph-shopping-cart-simple mr-0.5"></i>200 Cống Hiến
                               </button>`;p+=`
                            <div class="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between items-center space-x-2">
                                <div class="flex-1">
                                    <div class="text-[11px] font-bold text-white flex items-center"><span class="text-sm mr-1">${r.icon}</span>${r.name}</div>
                                    <div class="text-[9px] text-gray-400 mt-0.5">${r.description}</div>
                                </div>
                                <div class="flex-shrink-0 text-right">
                                    ${d}
                                </div>
                            </div>
                        `}if(c){const d=u?'<span class="text-[8px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">ĐÃ LĨNH HỘI</span>':`<button class="px-2 py-1 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue text-[9px] font-bold rounded border border-qi-blue/30 flex items-center transition-all" onclick="window.game.buySectScroll('${o}', 400)">
                                <i class="ph ph-shopping-cart-simple mr-0.5"></i>400 Cống Hiến
                               </button>`;p+=`
                            <div class="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between items-center space-x-2">
                                <div class="flex-1">
                                    <div class="text-[11px] font-bold text-white flex items-center"><span class="text-sm mr-1">${c.icon}</span>${c.name}</div>
                                    <div class="text-[9px] text-gray-400 mt-0.5">${c.description}</div>
                                </div>
                                <div class="flex-shrink-0 text-right">
                                    ${d}
                                </div>
                            </div>
                        `}t=`
                        <div class="space-y-4">
                            <p class="text-[10px] text-gray-400">Các công pháp và bí thuật thượng thừa của tông môn hoàn toàn bảo mật tuyệt đối, đệ tử tích cực lập công đức đổi cống hiến linh tinh trao học.</p>
                            <div class="grid grid-cols-1 gap-3">
                                ${p}
                            </div>
                        </div>
                    `}break;case"luyen_dan":t=`
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🔥 Địa Hỏa Thất (Đan Điện)</div>
                            <p class="text-[10px] text-gray-400 mb-3">Mượn đan lò hỏa mạch cực thịnh của tông môn, nâng cao tỷ lệ thành công chế luyện dược phẩm lên +10%!</p>
                            <button class="w-full py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="state.ui.toggleOverlay(document.getElementById('sects-overlay'), false); window.game.screens.systems.openCrafting('alchemy');">
                                <i class="ph ph-flame mr-1"></i> Vào Lò Luyện Đan (+10% Thành Công)
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🌿 Hiến Tặng Linh Thảo Dược</div>
                            <p class="text-[10px] text-gray-400 mb-3">Quyên góp 5 cọng Linh Thảo cấp thấp của bản thân đóng góp làm dược thô cho đan điện.</p>
                            <div class="flex justify-between text-[10px] text-gray-500 mb-2">
                                <span>Linh Thảo hiện có:</span>
                                <span class="font-bold text-white">${e.player.inventory.getItemQuantity("item_linh_thao")} / 5</span>
                            </div>
                            <button class="w-full py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('luyen_dan', 'donate_herbs')">
                                <i class="ph ph-hand-heart mr-1"></i> Quyên Hiến 5 Linh Thảo
                            </button>
                        </div>
                    </div>
                `;break;case"luyen_khi":t=`
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">⚒️ Thiết Khí Các</div>
                            <p class="text-[10px] text-gray-400 mb-3">Nơi luyện pháp bảo khôi lỗi, cường hóa trang bị thần binh.</p>
                            <button class="w-full py-2 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="state.ui.toggleOverlay(document.getElementById('sects-overlay'), false); window.game.screens.systems.openCrafting('smithing');">
                                <i class="ph ph-hammer mr-1"></i> Bắt Đầu Chế Tạo Pháp Bảo
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">💎 Đóng Góp Linh Quặng</div>
                            <p class="text-[10px] text-gray-400 mb-3">Hiến hiếu linh thạch vụn nâng trợ kinh phí luyện đúc cơ khí cho các đệ tử rèn kiếm.</p>
                            <button class="w-full py-2 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('luyen_khi', 'donate_scrap')">
                                <i class="ph ph-coins mr-1"></i> Quyên Góp 200 Linh Thạch
                            </button>
                        </div>
                    </div>
                `;break;case"linh_thu":t=`
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🦁 Vui Đùa Linh Thú</div>
                            <p class="text-[10px] text-gray-400 mb-3">Thân cận vui vẻ chải lông chăm nuôi cùng linh thú ngự thú vườn.</p>
                            <button class="w-full py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('linh_thu', 'play_beasts')">
                                <i class="ph ph-paw-print mr-1"></i> Tương Tác Linh Thú (-20 Linh Lực)
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🕸️ Bẫy Linh Trùng Hoang Dã</div>
                            <p class="text-[10px] text-gray-400 mb-3">Sử dụng thần thức sương bẫy săn tìm linh trùng hoang dã nấp ở linh viên. Có cơ hội bắt được Phệ Kim Trùng quý hiếm!</p>
                            <button class="w-full py-2 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('linh_thu', 'catch_insect')">
                                <i class="ph ph-bug mr-1"></i> Bẫy Kỳ Trùng (-30 Linh Lực)
                            </button>
                        </div>
                    </div>
                `;break;case"duoc_vien":t=`
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🌿 Linh Điền Tông Môn</div>
                            <p class="text-[10px] text-gray-400 mb-3">Vào linh điền của tông môn phì nhiêu tụ tinh khí trồng trọt linh thảo tiên dược.</p>
                            <button class="w-full py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="state.ui.toggleOverlay(document.getElementById('sects-overlay'), false); window.game.screens.systems.openCrafting('alchemy');">
                                <i class="ph ph-plant mr-1"></i> Mở Linh Thảo Viên Trồng Trọt
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">💧 Chăm Sóc Tưới Linh Thảo</div>
                            <p class="text-[10px] text-gray-400 mb-3">Được phó thác tưới nước sương bổ linh căn cho các tiên mầm, thưởng hạt giống linh chi.</p>
                            <button class="w-full py-2 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('duoc_vien', 'water_garden')">
                                <i class="ph ph-drop mr-1"></i> Tưới Tắm Linh Thảo (-30 Linh Lực)
                            </button>
                        </div>
                    </div>
                `;break;case"dong_phu":t=`
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🌀 Vận Công Đại Chu Thiên</div>
                            <p class="text-[10px] text-gray-400 mb-3">Động phủ tu luyện cá nhân linh khí dồi dào, xếp bằng chu thiên điều hòa chân khí chuyển hóa thọ tinh thành tu vi.</p>
                            <button class="w-full py-2 bg-qi-purple/10 hover:bg-qi-purple/20 text-qi-purple border border-qi-purple/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('dong_phu', 'circulate_qi')">
                                <i class="ph ph-infinity mr-1"></i> Vận Công Khai Huyệt (-100 Linh Lực)
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">💎 Thiết Lập Tụ Linh Trận</div>
                            <p class="text-[10px] text-gray-400 mb-3">Đầu tư linh thạch gia cố cường hóa pháp trận tụ nồng độ linh khí, mở mang ngộ đạo căn bản.</p>
                            <button class="w-full py-2 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('dong_phu', 'upgrade_array')">
                                <i class="ph ph-diamonds mr-1"></i> Gia Cố Pháp Trận (-500 Linh Thạch)
                            </button>
                        </div>
                    </div>
                `;break;case"bi_canh":t=`
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">⚔️ Thí Luyện Ảo Ảnh</div>
                            <p class="text-[10px] text-gray-400 mb-3">Ảo ảnh ma đạo pháp trận do tổ sư thiết lập để mài giũa bản lĩnh chiến đấu cho đệ tử. Đánh thắng nhận Contribution tích lũy.</p>
                            <button class="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-xl transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('bi_canh', 'trial_fight')">
                                <i class="ph ph-sword mr-1"></i> Khiêu Chiến Ảo Ảnh Đệ Tử
                            </button>
                        </div>
                    </div>
                `;break}const s=[{id:"son_mon",name:"Sơn Môn",icon:"⛩️"},{id:"quang_truong",name:"Quảng Trường",icon:"🏟️"},{id:"dai_dien",name:"Đại Điện",icon:"🏛️"},{id:"tang_kinh_cac",name:"Tàng Kinh Các",icon:"📚"},{id:"luyen_dan",name:"Luyện Đan Phòng",icon:"🧪"},{id:"luyen_khi",name:"Luyện Khí Các",icon:"⚒️"},{id:"linh_thu",name:"Linh Thú Viên",icon:"🦁"},{id:"duoc_vien",name:"Dược Viên / Linh Điền",icon:"🌿"},{id:"dong_phu",name:"Động Phủ Đệ Tử",icon:"🛕"},{id:"bi_canh",name:"Bí Cảnh Thí Luyện",icon:"🗼"}].find(l=>l.id===a);i.innerHTML=`
            <button class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center text-xs font-bold transition-all mb-4" 
                    onclick="window.game.screens.systems.activeSectZone = null; window.game.screens.systems.renderSects();">
                <i class="ph ph-arrow-left mr-1"></i> Quay Lại Tông Môn
            </button>

            <div class="bg-white/5 rounded-2xl border border-qi-blue/30 overflow-hidden mb-4 animate-fade-in">
                <div class="h-24 relative">
                    <img src="${n.portrait||y.backgrounds.sect}" class="w-full h-full object-cover opacity-30">
                    <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div class="absolute bottom-3 left-4 flex items-center space-x-2">
                        <span class="text-3xl">${s.icon}</span>
                        <div>
                            <h3 class="text-lg font-ancient text-white">${s.name}</h3>
                            <p class="text-[8px] text-qi-blue uppercase tracking-widest">${n.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pb-12 custom-scroll overflow-y-auto animate-fade-in">
                ${t}
            </div>
        `}handleSectZoneAction(n,a){var t;const i=e.systems.time?e.systems.time.totalDays:0;switch(a){case"vow_rules":if(e.player.lastSectVowDay===i){e.ui.toast("Hôm nay ngươi đã tuyên thệ rồi, không nên quá thường xuyên bái bản tông!","warning");return}e.player.lastSectVowDay=i,e.player.tuVi=(e.player.tuVi||0)+15,e.ui.toast("Ngươi chắp tay tuyên thệ tuân thủ Tông quy nghiêm nghị. Đạo tâm tu sĩ chấn chỉnh vững chắc! (+15 Tu vi)","success");break;case"reinforce_array":if(e.player.mana<50){e.ui.toast("Linh lực bất túc, không đủ 50 Linh Lực truyền pháp gia cố trận pháp!","error");return}e.player.mana-=50,e.player.sectContribution=(e.player.sectContribution||0)+5,e.ui.toast("Ngươi dẫn tinh linh khí gia cố kết giới mạch trận thành công! Tông môn thưởng +5 Cống hiến!","success");break;case"talk_guard":{const s=["Thủ môn đệ tử: Tu luyện không thèm chểnh mảng, kiên trì nhất định thành tựu thiên kiếp sơ kỳ!","Thủ môn đệ tử: Ngoại sơn môn phong quang vô cùng, có yêu điểu rình rập, đi đứng xin nhớ mang theo phi kiếm.","Thủ môn đệ tử: Cổ truyền tông đại trận vô cùng chắc chắn, tà ma ngoại đạo bất khả xâm phạm!"];e.ui.toast(s[Math.floor(Math.random()*s.length)],"info")}break;case"debate_dao":if(e.player.mana<20){e.ui.toast("Linh lực cạn kiệt, tinh thần mệt mỏi!","error");return}e.player.mana-=20;{const s=((t=e.player.advancedStats)==null?void 0:t.comprehension)||10,l=Math.random()*40;s>=l?(e.player.tuVi=(e.player.tuVi||0)+30,e.player.sectContribution=(e.player.sectContribution||0)+8,e.ui.toast("Biện luận xuất chúng! Lời nói chứa linh cơ đốn ngộ! Nhận +30 Tu vi, +8 Cống hiến!","success")):(e.player.tuVi=(e.player.tuVi||0)+10,e.ui.toast("Tranh luận đạo tâm rơi vào thế bí, tuy nhiên vẫn thu hoạch được chút ngộ đạo. Nhận +10 Tu vi!","info"))}break;case"bow_master":if(e.player.lastSectBowDay===i){e.ui.toast("Hôm nay sư phụ bế quan bận rộn hội họp, ngày mai hãy tới thỉnh an!","warning");return}e.player.lastSectBowDay=i,e.player.sectContribution=(e.player.sectContribution||0)+15,e.ui.toast("Ngươi khấu đầu cung kính thỉnh an Tông Chủ tối cao. Nhận thưởng +15 Điểm Cống hiến!","success");break;case"listen_lecture":if(e.player.lastSectLectureDay===i){e.ui.toast("Trưởng lão hôm nay đã truyền pháp xong rồi, hãy quay lại vào ngày mai!","warning");return}if(e.player.gold<100){e.ui.toast("Ngươi không đủ 100 Linh Thạch dâng kính trà lễ!","error");return}e.player.gold-=100,e.player.lastSectLectureDay=i,e.player.tuVi=(e.player.tuVi||0)+150,e.ui.toast("Bái nghe Trưởng lão giảng giải đạo lý ngưng cốt. Thần khí sảng khoái đốn ngộ vô cùng! Nhận +150 Tu vi!","success");break;case"donate_herbs":{if(e.player.inventory.getItemQuantity("item_linh_thao")<5){e.ui.toast("Ngươi bất túc 5 cọng Linh Thảo để đóng góp!","error");return}e.player.inventory.removeItem("item_linh_thao",5),e.player.sectContribution=(e.player.sectContribution||0)+20,e.ui.toast("Hiến quyên thành công 5 Linh Thảo cấp thấp làm linh dược thô. Nhận +20 Cống hiến!","success")}break;case"donate_scrap":if(e.player.gold<200){e.ui.toast("Không đủ 200 Linh Thạch đóng góp khoáng vật chế khí!","error");return}e.player.gold-=200,e.player.sectContribution=(e.player.sectContribution||0)+10,e.ui.toast("Đóng góp 200 Linh Thạch chế tạo linh tài. Thủ Các Trưởng lão ghi nhận: +10 Cống hiến!","success");break;case"play_beasts":if(e.player.mana<20){e.ui.toast("Linh lực mệt mỏi bất khả!","error");return}e.player.mana-=20,e.ui.toast("Ngươi ân cần tiếp xúc cho linh thú ăn linh thảo trong vườn. Linh thú tâm tình vui vẻ vô cùng!","success");break;case"catch_insect":if(e.player.lastSectCatchDay===i){e.ui.toast("Hôm nay ngươi đã bắt sâu ở ngự thú viên rồi, hãy đợi ngày mai linh trùng bò ra!","warning");return}if(e.player.mana<30){e.ui.toast("Linh lực cạn kiệt không đủ ngự khí giăng lưới!","error");return}e.player.mana-=30,e.player.lastSectCatchDay=i,Math.random()<.25?(e.player.inventory.addItem("item_phe_kim_trung",1),e.ui.toast("💥 Thành công bắt được 1 con Phệ Kim Trùng hoang dã bò trên linh thạch!","success")):e.ui.toast("Hụt mất! Linh trùng bò rất nhanh đã lẩn trốn vào kẽ đá cấm địa.","info");break;case"water_garden":if(e.player.lastSectWaterDay===i){e.ui.toast("Linh điền đã nhận đủ linh lộ tưới tiêu hôm nay rồi!","warning");return}if(e.player.mana<30){e.ui.toast("Linh lực cạn kiệt bất khả xách sương dẫn thủy!","error");return}e.player.mana-=30,e.player.lastSectWaterDay=i;{const s=["linh_chi_seed","nhan_sam_seed","tuyet_lien_seed"],l=s[Math.floor(Math.random()*s.length)];e.player.inventory.addItem(l,1),e.player.sectContribution=(e.player.sectContribution||0)+15,e.ui.toast("Tưới sương bắt sâu thảo điền chu đáo! Nhận +15 Cống hiến và 1 Hạt giống linh thảo ngẫu nhiên!","success")}break;case"circulate_qi":if(e.player.lastSectQiDay===i){e.ui.toast("Kinh mạch chấn động bão hòa linh lực, bế quan tu luyện thêm sẽ đứt vỡ!","warning");return}if(e.player.mana<100){e.ui.toast("Linh khí bất túc đại chu thiên tuần hoàn (Cần 100 Linh Lực)!","error");return}e.player.mana-=100,e.player.lastSectQiDay=i;{const s=Math.floor(e.player.atk*15+e.player.level*50);e.player.tuVi=(e.player.tuVi||0)+s,e.ui.toast(`Xếp bằng đại chu thiên vận chuyển đạo pháp ngưng khí 36 vòng! Hấp thu vô vàn linh cơ: +${s} Tu vi!`,"success")}break;case"upgrade_array":if(e.player.gold<500){e.ui.toast("Ngươi thiếu hụt 500 Linh Thạch cải tiến pháp trận động phủ!","error");return}e.player.gold-=500,e.player.tuVi=(e.player.tuVi||0)+300,e.ui.toast("Nâng cấp pháp trận tụ linh động phủ thành công! Nâng cao căn cơ tĩnh tâm hành thiền. Nhận +300 Tu vi!","success");break;case"trial_fight":if(e.player.hp<e.player.maxHp*.2){e.ui.toast("Trạng thái suy nhược cực độ khí huyết quá thấp bất khả thí luyện!","error");return}{const s=O.generate(e.player.realmId);s.name=`Ảo Ảnh Thí Luyện (${s.realmName})`,s.inventory=[],e.ui.toast("Kích hoạt Ảo Ảnh Pháp Trận, trận chiến mở màn!","info"),setTimeout(()=>{e.ui.toggleOverlay(document.getElementById("sects-overlay"),!1),window.game.startBattle(s,null,l=>{l?(e.player.sectContribution=(e.player.sectContribution||0)+50,e.ui.toast("🏆 Thách đấu thành công ảo cảnh! Tông môn thưởng +50 Điểm Cống hiến!","success")):e.ui.toast("Khiêu chiến thất bại! Cố gắng ngộ đạo thêm hãy quay lại.","error"),setTimeout(()=>{e.ui.toggleOverlay(document.getElementById("sects-overlay"),!0),window.game.screens.systems.renderSects()},1200)})},800)}break}window.game.saveState(),window.game.refreshUI(),this.renderSects()}renderEnergy(){if(!e.player)return;const n=document.getElementById("env-energy-list"),a=document.getElementById("env-purity-tag");if(n&&e.currentLocId){const t=U(e.currentWorldId,e.currentLocId);if(t&&t.energies){if(a&&t.energies.length>0){const s=t.energies[0].purity||"TINH_THUAN",l=e.systems.energy.getPurity(s);a.textContent=l.name}n.innerHTML=t.energies.map(s=>{const l=e.systems.energy.getEnergyType(s.type);return`
                        <div class="flex flex-col items-center space-y-1">
                            <span class="text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">${l.icon}</span>
                            <div class="flex flex-col items-center">
                                <span class="text-[9px] text-white font-mono font-bold">${s.concentration}%</span>
                                <span class="text-[7px] text-gray-500 font-ancient uppercase tracking-widest">${l.name}</span>
                            </div>
                        </div>
                    `}).join("")}else n.innerHTML=""}const i=document.getElementById("char-energy-list");if(i){const t=Object.entries(e.player.qiAccumulated).filter(([s,l])=>l.amount>0);t.length===0?i.innerHTML='<div class="text-[9px] text-gray-600 italic">Chưa có khí tức tích lũy</div>':i.innerHTML=t.map(([s,l])=>{const o=e.systems.energy.getEnergyType(s),r=e.systems.energy.getPurity(l.purity),c=Math.log10(l.amount+1);return`
                        <div class="p-2 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <span class="text-sm">${o.icon}</span>
                                <div>
                                    <div class="text-[9px] font-bold text-white font-ancient">${o.name}</div>
                                    <div class="text-[7px] text-qi-blue uppercase">${r.name}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-[8px] font-mono text-gray-400">${Math.floor(l.amount).toLocaleString()} Qi</div>
                                <div class="text-[7px] text-cultivation-gold">+${(c*10).toFixed(1)} Bonus</div>
                            </div>
                        </div>
                    `}).join("")}}getQualityClass(n){return{"Phàm Khí":"pham-khi","Pháp Khí":"phap-khi","Linh Khí":"linh-khi","Pháp Bảo":"phap-bao","Cổ Bảo":"co-bao","Linh Bảo":"linh-bao","Thông Thiên Linh Bảo":"thong-thien","Tiên Khí":"tien-khi","Danh Khí":"danh-khi","Hạ phẩm":"pham","Trung phẩm":"hoang","Thượng phẩm":"huyen","Cực phẩm":"dia","Hoàn Mỹ":"thien"}[n]||"pham"}renderSmithing(){const n=document.getElementById("smithing-recipes");if(!n)return;n.innerHTML="";const a=document.getElementById("smithing-tool-name"),i=document.getElementById("smithing-flame-name");if(a){const o=e.player.smithingTool?g(e.player.smithingTool):null;o?a.innerHTML=`<span class="text-white">${o.name}</span>`:a.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'luyen_khi')" class="ml-2 text-[8px] text-red-400 underline hover:text-white transition-colors">MUA NGAY</button>`}if(i){const o=S(e.player.currentFlame);o?i.innerHTML=`<span class="text-white">${o.name}</span>`:i.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-red-400 underline hover:text-white transition-colors">MUA NGAY</button>`}const t=E(e.player.smithingLevel),s=document.getElementById("smithing-level-text");s&&(s.textContent=t.name);const l=Object.values(Y).filter(o=>e.player.knownSmithingRecipes.includes(o.id));if(l.length===0){n.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được bản vẽ nào...</div>';return}l.forEach(o=>{const r=g(o.id);if(!r)return;const c=this.getQualityClass(r.quality),h=document.createElement("div");h.className="p-4 border border-gray-800 rounded-2xl bg-white/5 space-y-3";let u="";o.materials.forEach(d=>{var v;const m=g(d.id),b=((v=e.player.inventory.allItems.find(f=>f.id===d.id))==null?void 0:v.quantity)||0,x=b>=d.quantity;u+=`<div class="text-[10px] ${x?"text-gray-400":"text-red-500"}">${(m==null?void 0:m.name)||d.id}: ${b}/${d.quantity}</div>`});const p=e.player.smithingLevel<o.level;h.innerHTML=`
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <span class="text-xl mr-2">${r.image?`<img src="${T(r.image)}" class="w-6 h-6 object-contain inline-block">`:r.icon||""}</span>
                        <span class="font-bold quality-${c} font-ancient">${r.name}</span>
                    </div>
                    ${p?`<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${o.level}</span>`:`<button class="px-4 py-2 btn-gold text-[10px] font-bold rounded-lg whitespace-nowrap" onclick="window.game.forge('${o.id}')">${o.type==="bag_upgrade"?"NÂNG CẤP":"RÈN ĐÚC"}</button>`}
                </div>
                <div class="grid grid-cols-2 gap-1">${u}</div>
                <div class="text-[9px] text-gray-500 italic">Thể lực: ${o.staminaCost} | Linh lực: ${o.manaCost}</div>
            `,n.appendChild(h)})}openCrafting(n){if(!e.player)return;if(!e.player.unlockedProfessions.includes(n)){e.ui.toast("Ngươi chưa nắm vững bí pháp của nghề này!","error");return}const t={alchemy:"screen-alchemy",smithing:"screen-smithing",talisman:"screen-talisman",formation:"screen-formation",beast:"screen-beast",puppet:"screen-puppet",corpse:"screen-corpse"}[n];t&&(e.ui.switchScreen(t),n==="alchemy"&&this.renderAlchemy(),n==="smithing"&&this.renderSmithing(),n==="talisman"&&this.renderTalisman(),n==="formation"&&this.renderFormation(),n==="beast"&&this.renderBeast(),n==="puppet"&&this.renderPuppet(),n==="corpse"&&this.renderCorpse())}openCraftingHub(){["screen-alchemy","screen-talisman","screen-smithing","screen-formation","screen-corpse","screen-beast","screen-puppet"].forEach(i=>{const t=document.getElementById(i);t&&(t.classList.add("hidden"),t.classList.remove("flex"))});const a=document.getElementById("screen-crafting-hub");a&&(a.classList.remove("hidden"),a.classList.add("flex"))}renderPuppet(){if(!e.player)return;const n=document.getElementById("puppet-level-text"),a=document.getElementById("puppet-exp-bar"),i=document.getElementById("puppet-list");if(n&&(n.textContent=`Khôi Lỗi Sư - Cấp ${e.player.puppetLevel}`),a){const t=Math.max(1,e.player.puppetLevel*100*Math.pow(1.5,e.player.puppetLevel-1));a.style.width=`${Math.min(100,e.player.puppetExp/t*100)}%`}if(i){i.innerHTML="";const t=Z.filter(s=>e.player.knownPuppetRecipes.includes(s.id));if(t.length===0){i.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa có bản thiết kế khôi lỗi nào...</div>';return}t.forEach(s=>{const l=document.createElement("div");l.className="p-5 border border-white/5 rounded-3xl bg-white/[0.02] space-y-4 group hover:border-qi-blue/30 transition-all";let o="";s.materials.forEach(h=>{var m;const u=g(h.id),p=((m=e.player.inventory.allItems.find(b=>b.id===h.id))==null?void 0:m.quantity)||0,d=p>=h.quantity;o+=`
                        <div class="flex justify-between items-center bg-black/20 p-2 rounded-xl border ${d?"border-white/5":"border-red-500/20"}">
                            <span class="text-[10px] text-gray-400">${(u==null?void 0:u.name)||h.id}</span>
                            <span class="text-[10px] font-mono ${d?"text-qi-jade":"text-red-500"}">${p}/${h.quantity}</span>
                        </div>
                    `});const r=e.player.puppetLevel<s.skillLevel,c=y.puppets[s.id];l.innerHTML=`
                    <div class="flex justify-between items-start">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 group-hover:scale-110 transition-transform">
                                ${c?`<img src="${c}" class="w-full h-full object-cover">`:"🤖"}
                            </div>
                            <div>
                                <h4 class="font-ancient text-white text-lg">${s.name}</h4>
                                <div class="flex space-x-2 mt-1">
                                    <span class="text-[8px] px-2 py-0.5 bg-qi-blue/10 text-qi-blue rounded-full border border-qi-blue/20 uppercase font-bold">${W[s.grade].name}</span>
                                    <span class="text-[8px] px-2 py-0.5 bg-white/5 text-gray-500 rounded-full border border-white/10 uppercase font-bold">${s.type}</span>
                                </div>
                            </div>
                        </div>
                        ${r?`<div class="text-[9px] text-red-500 font-bold uppercase py-2">Cần Cấp ${s.skillLevel}</div>`:`<button class="px-5 py-2.5 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue text-[10px] font-bold rounded-xl border border-qi-blue/20 active:scale-95 transition-all" onclick="window.game.craftPuppet('${s.id}')">LUYỆN CHẾ</button>`}
                    </div>
                    <p class="text-[10px] text-gray-500 italic leading-relaxed">${s.description}</p>
                    <div class="grid grid-cols-2 gap-2">${o}</div>
                `,i.appendChild(l)})}}renderTalisman(){if(!e.player)return;const n=q(e.player.talismanLevel),a=document.getElementById("talisman-level-text"),i=document.getElementById("talisman-exp-bar"),t=document.getElementById("talisman-recipes");if(a&&(a.textContent=n.name),i){const l=Math.max(1,e.player.talismanLevel*100*Math.pow(1.5,e.player.talismanLevel-1));i.style.width=`${Math.min(100,e.player.talismanExp/l*100)}%`}const s=document.getElementById("current-pen-name");if(s){const l=e.player.currentTalismanPen?g(e.player.currentTalismanPen):null;l?s.innerHTML=`<span class="text-white">${l.name}</span>`:s.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phu_luc')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`}if(t){t.innerHTML="";const l=Object.values(X).filter(o=>e.player.knownTalismanRecipes.includes(o.id));if(l.length===0){t.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được phù văn nào...</div>';return}l.forEach(o=>{const r=document.createElement("div");r.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3";let c="";o.materials.forEach(u=>{var m;const p=g(u.id),d=((m=e.player.inventory.allItems.find(b=>b.id===u.id))==null?void 0:m.quantity)||0;c+=`<div class="text-[9px] ${d>=u.quantity?"text-gray-400":"text-red-500"}">${p.name} x${u.quantity} (${d})</div>`});const h=e.player.talismanLevel<o.level;r.innerHTML=`
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-bold text-qi-blue">${o.name}</h4>
                        ${h?`<span class="text-[8px] text-red-500 uppercase">Cần Cấp ${o.level}</span>`:`<button class="px-3 py-1 bg-qi-blue/10 text-qi-blue text-[10px] rounded border border-qi-blue/20" onclick="window.game.drawTalisman('${o.id}')">VẼ PHÙ</button>`}
                    </div>
                    <div class="grid grid-cols-2 gap-1 mb-2">${c}</div>
                    <div class="text-[8px] text-gray-500 italic">Mana: ${o.manaCost} | Stamina: ${o.staminaCost}</div>
                `,t.appendChild(r)})}}renderBeast(){if(!e.player)return;const n=document.getElementById("beast-list-view"),a=document.getElementById("beast-hatch-view"),i=document.getElementById("beast-tab-beast"),t=document.getElementById("beast-tab-insect"),s=document.getElementById("beast-tab-hatch");e.views.beast||(e.views.beast="beast"),e.views.beast==="hatch"?(n&&n.classList.add("hidden"),a&&a.classList.remove("hidden")):(n&&n.classList.remove("hidden"),a&&a.classList.add("hidden"));const l=["bg-qi-jade/10","text-qi-jade","border-qi-jade/20"],o=["bg-transparent","text-gray-500","border-transparent"];[i,t,s].forEach(p=>{if(p){p.classList.remove(...l,...o);const d=p===i&&e.views.beast==="beast"||p===t&&e.views.beast==="insect"||p===s&&e.views.beast==="hatch";p.classList.add(...d?l:o)}});const r=document.getElementById("beast-level-text"),c=document.getElementById("beast-exp-bar"),h=e.views.beast==="insect"?e.player.insectLevel:e.player.beastLevel,u=e.views.beast==="insect"?e.player.insectExp:e.player.beastExp;if(r&&(r.textContent=`Cấp ${h}`),c){const p=Math.max(1,h*100*Math.pow(1.5,h-1));c.style.width=`${Math.min(100,u/p*100)}%`}if(n&&e.views.beast!=="hatch"){n.innerHTML="";const p=e.player.beasts.filter(d=>{const m=B[d.id];return m?e.views.beast==="beast"?[w.LINH_THU,w.DI_THU,w.THAN_THU].includes(m.type):e.views.beast==="insect"?[w.LINH_TRUNG,w.KY_TRUNG].includes(m.type):!0:!1});if(p.length===0){const d=e.views.beast==="beast"?"linh thú":"kỳ trùng";n.innerHTML=`<div class="text-center py-10 text-gray-600 italic">Ngươi chưa có ${d} nào...</div>`}else p.forEach(d=>{const m=B[d.id],b=_(d.level),x=z[d.bloodline],v=y.beasts[d.id],f=document.createElement("div");f.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] flex items-center space-x-4",f.innerHTML=`
                        <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0">
                            ${v?`<img src="${v}" class="w-full h-full object-cover">`:`<span class="text-3xl">${(m==null?void 0:m.icon)||"🐾"}</span>`}
                        </div>
                        <div class="flex-grow">
                            <div class="flex justify-between items-center">
                                <h4 class="font-bold text-white">${d.name}</h4>
                                <span class="text-[9px] font-bold" style="color: ${x.color}">${x.name}</span>
                            </div>
                            <div class="text-[9px] text-gray-500 mt-0.5">Cấp ${d.level} (${b.name})</div>
                            <div class="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                                <div class="h-full bg-qi-jade" style="width: ${d.exp/b.expRequired*100}%"></div>
                            </div>
                        </div>
                    `,n.appendChild(f)})}if(a&&e.views.beast==="hatch"){a.innerHTML="";const p=e.player.inventory.allItems.filter(d=>g(d.id).type==="beast_egg");p.length===0?a.innerHTML='<div class="text-center py-10 text-gray-600 italic">Ngươi không có trứng linh thú nào...</div>':p.forEach(d=>{const m=g(d.id),b=document.createElement("div");b.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] flex justify-between items-center",b.innerHTML=`
                        <div class="flex items-center space-x-3">
                            <div class="text-2xl">${m.icon}</div>
                            <div>
                                <h4 class="text-sm font-bold text-white">${m.name}</h4>
                                <p class="text-[9px] text-gray-500">Số lượng: ${d.quantity}</p>
                            </div>
                        </div>
                        <button class="px-4 py-2 bg-qi-jade/10 text-qi-jade text-[10px] rounded-xl border border-qi-jade/20" onclick="window.game.hatchBeast('${d.id}')">ẤP NỞ</button>
                    `,a.appendChild(b)})}i&&(i.onclick=()=>{e.views.beast="beast",this.renderBeast()}),t&&(t.onclick=()=>{e.views.beast="insect",this.renderBeast()}),s&&(s.onclick=()=>{e.views.beast="hatch",this.renderBeast()})}renderCraftingHub(){if(!e.player)return;[{id:"alchemy",key:"alchemy",name:"Luyện Dược Sư",level:e.player.alchemyLevel,exp:e.player.alchemyExp,getLevelInfo:k},{id:"talisman",key:"talisman",name:"Phù Sư",level:e.player.talismanLevel,exp:e.player.talismanExp,getLevelInfo:q},{id:"smithing",key:"smithing",name:"Luyện Khí Sư",level:e.player.smithingLevel,exp:e.player.smithingExp,getLevelInfo:E},{id:"formation",key:"formation",name:"Trận Pháp Sư",level:e.player.formationLevel,exp:e.player.formationExp,getLevelInfo:a=>({name:`Cấp ${a}`})},{id:"puppet",key:"puppet",name:"Khôi Lỗi Sư",level:e.player.puppetLevel,exp:e.player.puppetExp,getLevelInfo:a=>({name:`Cấp ${a}`})},{id:"corpse",key:"corpse",name:"Luyện Thi Sư",level:e.player.corpseLevel,exp:e.player.corpseExp,getLevelInfo:a=>({name:`Cấp ${a}`})},{id:"beast",key:"beast",name:"Ngự Thú Sư",level:e.player.beastLevel,exp:e.player.beastExp,getLevelInfo:_},{id:"insect",key:"insect",name:"Khu Trùng Sư",level:e.player.insectLevel,exp:e.player.insectExp,getLevelInfo:a=>({name:`Cấp ${a}`})}].forEach(a=>{const i=document.getElementById(`hub-${a.id}-level`),t=i==null?void 0:i.closest(".hub-card");if(!i||!t)return;const s=e.player.unlockedProfessions.includes(a.id);t.onclick=()=>window.game.openCrafting(a.id);const l={alchemy:"Đan Đạo Chân Giải",talisman:"Thái Thượng Phù Kinh",smithing:"Luyện Khí Tổng Cương",formation:"Trận Đạo Thiên Thư",puppet:"Cơ Quan Linh Kỹ",corpse:"Cửu U Luyện Thi Thuật",beast:"Vạn Thú Ngự Pháp",insect:"Thiên Trùng Bí Lục"};if(s){const o=a.getLevelInfo?a.getLevelInfo(a.level):{name:`Cấp ${a.level}`},r=a.level*100*Math.pow(1.5,a.level-1),c=Math.floor(a.exp/r*100);i.innerHTML=`${a.name} - ${o.name} <span class="text-white/30 ml-2">(${c}%)</span>`,t.classList.remove("opacity-40","grayscale"),t.classList.add("cursor-pointer")}else i.innerHTML=`
                    <div class="flex flex-col">
                        <span class="text-red-500/60 flex items-center"><i class="ph ph-lock-key mr-1"></i> Chưa mở khóa</span>
                        <span class="text-[7px] text-gray-600 italic mt-0.5">Cần: « ${l[a.id]} »</span>
                    </div>
                `,t.classList.add("opacity-40","grayscale"),t.classList.remove("cursor-pointer")})}renderFormation(){if(!e.player)return;const n=document.getElementById("formation-list");if(!n)return;if(n.innerHTML="",e.player.activeFormations.length>0){const t=document.createElement("h3");t.className="text-[10px] text-gray-500 uppercase tracking-widest mb-2",t.textContent="Trận Pháp Đang Hoạt Động",n.appendChild(t),e.player.activeFormations.forEach(s=>{const l=document.createElement("div");l.className="p-4 border border-qi-purple/30 rounded-2xl bg-qi-purple/5 mb-4 flex justify-between items-center",l.innerHTML=`
                    <div>
                        <h4 class="font-bold text-qi-purple">${s.name}</h4>
                        <p class="text-[9px] text-gray-500 mt-1">Đang kích hoạt...</p>
                    </div>
                    <button class="px-4 py-2 bg-red-500/10 text-red-500 text-[10px] rounded-xl border border-red-500/20" onclick="window.game.deactivateFormation('${s.id}')">THU HỒI</button>
                `,n.appendChild(l)})}const a=e.player.knownFormations||[],i=document.createElement("h3");if(i.className="text-[10px] text-gray-500 uppercase tracking-widest mt-6 mb-2",i.textContent="Trận Đồ Đã Lĩnh Ngộ",n.appendChild(i),a.length===0){const t=document.createElement("div");t.className="text-center py-6 text-gray-700 italic text-xs",t.textContent="Trống rỗng...",n.appendChild(t)}else a.forEach(t=>{const s=g(t);if(!s)return;const l=e.player.activeFormations.some(r=>r.id===t),o=document.createElement("div");o.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3 flex justify-between items-center",o.innerHTML=`
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">${s.icon||"📜"}</div>
                        <div>
                            <h4 class="text-sm font-bold text-white">${s.name}</h4>
                            <p class="text-[9px] text-gray-500">${s.description||""}</p>
                        </div>
                    </div>
                    ${l?'<span class="text-[9px] text-qi-purple font-bold">ĐÃ KÍCH HOẠT</span>':`<button class="px-4 py-2 bg-qi-purple/10 text-qi-purple text-[10px] rounded-xl border border-qi-purple/20" onclick="window.game.activateFormation('${t}')">KÍCH HOẠT</button>`}
                `,n.appendChild(o)})}renderCorpse(){if(!e.player)return;const n=document.getElementById("corpse-list"),a=document.getElementById("corpse-level-text"),i=document.getElementById("corpse-exp-bar");if(a&&(a.textContent=J(e.player.corpseLevel).name),i){const l=e.player.corpseLevel*100*Math.pow(1.5,e.player.corpseLevel-1);i.style.width=`${e.player.corpseExp/l*100}%`}if(!n)return;if(n.innerHTML="",e.player.refinedCorpses.length>0){const l=document.createElement("h3");l.className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-1",l.textContent="Thi Hài Đang Khống Chế",n.appendChild(l),e.player.refinedCorpses.forEach((o,r)=>{const c=y.corpses[o.id],h=document.createElement("div");h.className="p-4 border border-red-900/30 rounded-2xl bg-red-900/5 mb-4 flex items-center space-x-4",h.innerHTML=`
                    <div class="w-12 h-12 bg-red-950/20 rounded-2xl flex items-center justify-center overflow-hidden border border-red-900/20 flex-shrink-0">
                        ${c?`<img src="${c}" class="w-full h-full object-cover">`:'<span class="text-3xl">🧟</span>'}
                    </div>
                    <div class="flex-grow">
                        <div class="flex justify-between items-center">
                            <h4 class="font-bold text-red-400">${o.name}</h4>
                            <span class="text-[9px] px-2 py-0.5 bg-red-500/10 text-red-500 rounded border border-red-500/20 font-bold uppercase">${o.quality}</span>
                        </div>
                        <div class="text-[9px] text-gray-500 mt-1">Cấp ${o.level} | ATK: ${o.stats.atk} | HP: ${o.stats.hp}</div>
                    </div>
                `,n.appendChild(h)})}const t=document.createElement("h3");t.className="text-[10px] text-gray-500 uppercase tracking-widest mt-6 mb-3 border-b border-white/5 pb-1",t.textContent="Bản Vẽ Luyện Thi",n.appendChild(t);const s=Object.values(ee).filter(l=>e.player.knownCorpseRecipes.includes(l.id));if(s.length===0){const l=document.createElement("div");l.className="text-center py-6 text-gray-700 italic text-xs",l.textContent="Ngươi chưa có bí phương luyện thi nào...",n.appendChild(l)}else s.forEach(l=>{const o=y.corpses[l.id],r=document.createElement("div");r.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3 space-y-3";let c="";l.materials.forEach(p=>{var b;const d=g(p.id),m=((b=e.player.inventory.allItems.find(x=>x.id===p.id))==null?void 0:b.quantity)||0;c+=`<div class="text-[9px] ${m>=p.quantity?"text-gray-400":"text-red-500"}">${(d==null?void 0:d.name)||p.id} x${p.quantity} (${m})</div>`});const h=e.player.corpseLevel<l.level,u=Math.floor((.7-l.level*.1+e.player.corpseLevel*.05)*100);r.innerHTML=`
                <div class="flex justify-between items-start">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-red-950/20 rounded-2xl flex items-center justify-center overflow-hidden border border-red-900/20 flex-shrink-0 animate-pulse-subtle">
                            ${o?`<img src="${o}" class="w-full h-full object-cover">`:'<span class="text-3xl">🧟</span>'}
                        </div>
                        <div>
                            <h4 class="font-ancient text-lg text-red-500">${l.name}</h4>
                            <p class="text-[9px] text-gray-500 mt-1">${l.description}</p>
                        </div>
                    </div>
                    ${h?`<span class="text-[8px] text-red-500 uppercase font-bold">Cần Cấp ${l.level}</span>`:`<button class="px-4 py-2 bg-red-900/20 text-red-400 text-[10px] font-bold rounded-xl border border-red-900/30" onclick="window.game.refineCorpse('${l.id}')">LUYỆN CHẾ</button>`}
                </div>
                <div class="grid grid-cols-2 gap-2">${c}</div>
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
                `;const i=document.getElementById("custom-tech-submit");i&&(i.onclick=()=>{const t=document.getElementById("custom-tech-name").value,s=document.getElementById("custom-tech-element").value,l=document.getElementById("custom-tech-stat").value,o=document.getElementById("custom-tech-effect").value;if(!t||t.trim()===""){e.ui.toast("Tên công pháp không được để trống!","error");return}const r={};l==="atk"?r.atk=180:l==="hp"?r.hp=600:l==="spd"&&(r.spd=15);const c={};o==="swordDmg"?c.swordDmg=1.15:o==="tvps"?c.tvps=3:o==="lifeSteal"&&(c.lifeSteal=.12),window.game.createCustomTechnique(t,s,r,c)}),this.elTechPoints&&(this.elTechPoints.textContent=e.player.techniquePoints||0);return}const a=n==="cultivation"?e.player.learnedTechniques:e.player.learnedSecretTechniques;a.length===0?this.elTechListView.innerHTML=`<div class="text-center py-20 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ ${n==="cultivation"?"công pháp":"bí pháp"} nào...</div>`:a.forEach(i=>{const t=n==="cultivation"?M(i.id)||(e.player.customTechniques||[]).find(c=>c.id===i.id):H(i.id);if(!t)return;const s=L.find(c=>c.id===(i.masteryLevel||1)),l=t.stageLabel||"Tầng",o=t.stageNames&&t.stageNames[i.stage-1]?t.stageNames[i.stage-1]:`${l} ${i.stage||1}`,r=document.createElement("div");r.className=`p-4 border ${n==="cultivation"?"border-qi-blue/10 bg-qi-blue/5":"border-qi-purple/10 bg-qi-purple/5"} rounded-2xl flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all mb-3`,r.innerHTML=`
                        <div class="flex items-center space-x-4">
                            <div class="text-2xl">${t.icon||(n==="cultivation"?"📜":"✨")}</div>
                            <div>
                                <h4 class="text-sm font-bold text-white">${t.name}</h4>
                                <div class="flex items-center space-x-2 mt-1">
                                    <span class="text-[8px] px-1.5 py-0.5 bg-black/40 rounded border border-white/5 text-gray-400 font-mono">${o}</span>
                                    <span class="text-[8px] text-cultivation-gold font-bold">${(s==null?void 0:s.name)||"Nhập Môn"}</span>
                                </div>
                            </div>
                        </div>
                        <i class="ph ph-caret-right text-gray-600"></i>
                    `,r.onclick=()=>this.renderTechniqueDetail(i.id,n==="secret"),this.elTechListView.appendChild(r)})}this.elTechPoints&&(this.elTechPoints.textContent=e.player.techniquePoints||0)}}renderTechniqueDetail(n,a){if(!this.elTechDetailContent)return;const i=a?e.player.learnedSecretTechniques.find(d=>d.id===n):e.player.learnedTechniques.find(d=>d.id===n),t=a?H(n):M(n)||(e.player.customTechniques||[]).find(d=>d.id===n);if(!i||!t)return;this.elTechListView.classList.add("hidden"),this.elTechDetailView.classList.remove("hidden");const s=L.findIndex(d=>d.id===(i.masteryLevel||1)),l=L[s],o=L[s+1],r=t.stageLabel||"Tầng",c=t.stageNames&&t.stageNames[i.stage-1]?t.stageNames[i.stage-1]:`${r} ${i.stage||1}`,h=i.masteryLevel>=4&&i.stage<(t.maxStage||10),u=!a&&(e.player.mainTechniqueId===n||e.player.mainBodyTechniqueId===n||e.player.mainSoulTechniqueId===n);let p="";a||(u?p=`
                    <button class="w-full py-4 bg-cultivation-gold/15 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-2xl cursor-default opacity-80" disabled>
                        <i class="ph ph-check-circle mr-1"></i> ĐANG CHỦ TU
                    </button>
                `:p=`
                    <button class="w-full py-4 bg-cultivation-gold text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" onclick="window.game.setMainTechnique('${n}')">
                        <i class="ph ph-shield-star mr-1"></i> THIẾT LẬP CHỦ TU
                    </button>
                `),this.elTechDetailContent.innerHTML=`
            <div class="flex flex-col items-center text-center space-y-4">
                <div class="text-6xl p-6 bg-white/5 rounded-full border border-white/10">${t.icon||"📜"}</div>
                <div>
                    <h3 class="text-2xl font-ancient text-white">${t.name}</h3>
                    <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">${t.quality||"Phàm Khí"}${(t.quality||"Phàm Khí").toLowerCase().includes("khí")||(t.quality||"Phàm Khí").toLowerCase().includes("bảo")||(t.quality||"Phàm Khí").toLowerCase().includes("phẩm")||(t.quality||"Phàm Khí").toLowerCase().includes("giai")||(t.quality||"Phàm Khí").toLowerCase().includes("hỏa")||(t.quality||"Phàm Khí").toLowerCase().includes("lôi")||["Hoàn Mỹ","Tiên Khí","Linh Bảo","Danh Khí"].includes(t.quality||"Phàm Khí")?"":" Phẩm"} | ${c}</p>
                </div>
            </div>

            <div class="bg-black/40 p-5 rounded-3xl border border-white/5 space-y-4">
                <div class="flex justify-between items-end mb-1">
                    <span class="text-[9px] text-gray-500 uppercase tracking-widest">Độ Thuần Thục: ${(l==null?void 0:l.name)||"Nhập Môn"}</span>
                    <span class="text-[10px] font-mono text-white">${i.mastery} / ${(o==null?void 0:o.threshold)||"MAX"}</span>
                </div>
                <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-cultivation-gold" style="width: ${i.masteryLevel>=4?100:i.mastery/((o==null?void 0:o.threshold)||1)*100}%"></div>
                </div>
                
                <div class="grid grid-cols-2 gap-3 mt-6">
                    <button class="py-4 bg-qi-blue text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" onclick="window.game.cultivateTechnique('${n}', ${a})">TU LUYỆN</button>
                    <button class="py-4 ${h?"bg-cultivation-gold":"bg-gray-800 opacity-50"} text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" 
                        onclick="window.game.breakthroughTechnique('${n}', ${a})">ĐỘT PHÁ TẦNG</button>
                </div>
                ${p?`<div class="mt-3">${p}</div>`:""}
            </div>

            <div class="space-y-4">
                <h4 class="text-xs font-ancient text-gray-500 uppercase tracking-widest border-l-2 border-gray-500 pl-3">Mô tả & Hiệu ứng</h4>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs text-gray-400 leading-relaxed">
                    ${t.description||"Không có mô tả."}
                </div>
            </div>
        `}}export{le as SystemsScreen};
