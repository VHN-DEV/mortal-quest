import{s as e,u as q,v as A,w as E,i as K,e as b,d as T,F as I,x as M,h as j,y as B,z as V,G as F,C as D,H as G,J as R,o as Q,A as f,S as O,b as U,E as Y,a as Z,K as _,j as W,P as X,L as z,N as H,T as J,B as N,O as w,Q as P,U as ee,V as te,W as ne,m as k,k as S,t as L}from"./index-D0aR9NoT.js";import"./vendor-capacitor-DNzPfH2b.js";import"./vendor-gsap-CzGW6FVa.js";const ie=[{floor:1,name:"Ngoại Tháp - Tầng 1",description:"Nơi tập trung các luyện dược sư trẻ tuổi tài năng.",minAlchemyLevel:3,rewards:{expMult:1.2}},{floor:2,name:"Nội Tháp - Tầng 2",description:"Chỉ dành cho những người có thần thức mạnh mẽ.",minAlchemyLevel:5,rewards:{expMult:1.5,qualityBonus:.1}},{floor:3,name:"Thánh Đan Điện",description:"Nơi cư ngụ của các bậc Đan Thánh.",minAlchemyLevel:7,rewards:{expMult:2,qualityBonus:.25}}];class re{constructor(){this.shopSubFilter="all",this.shopQualityFilter="all",this.shopSearchQuery="",this.shopSortMode="default",this.activeSectZone=null,this.initElements(),this.initEvents()}initElements(){this.btnAlchemyTabRecipes=document.getElementById("alchemy-tab-recipes"),this.btnAlchemyTabGarden=document.getElementById("alchemy-tab-garden"),this.viewAlchemyRecipes=document.getElementById("alchemy-recipes-view"),this.viewAlchemyGarden=document.getElementById("alchemy-garden-view"),this.elAlchemyLvlText=document.getElementById("alchemy-level-text"),this.elAlchemyExpBar=document.getElementById("alchemy-exp-bar"),this.elGardenPlots=document.getElementById("garden-plots"),this.elShopLingShi=document.getElementById("shop-ling-shi"),this.elShopBuyView=document.getElementById("shop-buy-view"),this.elShopSellView=document.getElementById("shop-sell-view"),this.elShopSellGrid=document.getElementById("shop-sell-grid"),this.elShopSectionNav=document.getElementById("shop-section-nav"),this.elShopSubFilterNav=document.getElementById("shop-subfilter-nav"),this.elShopQualityFilterNav=document.getElementById("shop-quality-filter-nav"),this.elShopFiltersWrap=document.getElementById("shop-filters-wrap"),this.btnShopTabBuy=document.getElementById("shop-tab-buy"),this.btnShopTabSell=document.getElementById("shop-tab-sell"),this.elShopSearchInput=document.getElementById("shop-search-input"),this.elShopSortSelect=document.getElementById("shop-sort-select"),this.elGuildCerts=document.getElementById("guild-cert-list"),this.elTechListView=document.getElementById("tech-list-view"),this.elTechDetailView=document.getElementById("tech-detail-view"),this.elTechDetailContent=document.getElementById("tech-detail-content"),this.elTechPoints=document.getElementById("tech-points"),this.btnTechTabCultivation=document.getElementById("tech-tab-cultivation"),this.btnTechTabSecret=document.getElementById("tech-tab-secret"),this.btnTechTabCustom=document.getElementById("tech-tab-custom"),this.btnTechBack=document.getElementById("tech-back-btn"),this.elGuildMissions=document.getElementById("guild-mission-list"),this.elGuildRooms=document.getElementById("guild-room-list"),this.elTowerFloors=document.getElementById("tower-floor-list"),this.elSectsView=document.getElementById("sects-view")}initEvents(){this.btnAlchemyTabRecipes&&(this.btnAlchemyTabRecipes.onclick=()=>{e.views.alchemy="recipes",this.renderAlchemy()}),this.btnAlchemyTabGarden&&(this.btnAlchemyTabGarden.onclick=()=>{e.views.alchemy="garden",this.renderAlchemy()}),this.btnShopTabBuy&&(this.btnShopTabBuy.onclick=()=>{e.views.shop="buy",this.renderShop()}),this.btnShopTabSell&&(this.btnShopTabSell.onclick=()=>{e.views.shop="sell",this.renderShop()}),this.elShopSearchInput&&(this.elShopSearchInput.oninput=i=>{this.shopSearchQuery=i.target.value.toLowerCase().trim(),this.renderShop()}),this.elShopSortSelect&&(this.elShopSortSelect.onchange=i=>{this.shopSortMode=i.target.value,this.renderShop()}),this.btnTechTabCultivation&&(this.btnTechTabCultivation.onclick=()=>this.renderTechniques("cultivation")),this.btnTechTabSecret&&(this.btnTechTabSecret.onclick=()=>this.renderTechniques("secret")),this.btnTechTabCustom&&(this.btnTechTabCustom.onclick=()=>this.renderTechniques("custom")),this.btnTechBack&&(this.btnTechBack.onclick=()=>{this.elTechListView.classList.remove("hidden"),this.elTechDetailView.classList.add("hidden")})}renderAlchemy(){if(!e.player)return;const i=document.getElementById("alchemy-tools-container");e.views.alchemy==="recipes"?(this.viewAlchemyRecipes.classList.remove("hidden"),this.viewAlchemyGarden.classList.add("hidden"),i&&i.classList.remove("hidden"),this.btnAlchemyTabRecipes&&(this.btnAlchemyTabRecipes.className="flex-grow py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all"),this.btnAlchemyTabGarden&&(this.btnAlchemyTabGarden.className="flex-grow py-3 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all")):(this.viewAlchemyRecipes.classList.add("hidden"),this.viewAlchemyGarden.classList.remove("hidden"),i&&i.classList.add("hidden"),this.btnAlchemyTabRecipes&&(this.btnAlchemyTabRecipes.className="flex-grow py-3 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all"),this.btnAlchemyTabGarden&&(this.btnAlchemyTabGarden.className="flex-grow py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all"));const a=q(e.player.alchemyLevel);this.elAlchemyLvlText.textContent=a.name;const l=Math.max(1,e.player.alchemyLevel*100*Math.pow(1.5,e.player.alchemyLevel-1));this.elAlchemyExpBar.style.width=`${Math.min(100,e.player.alchemyExp/l*100)}%`,e.views.alchemy==="recipes"?this.renderRecipes():this.renderGarden();const t=document.getElementById("alchemy-cauldron-name"),n=document.getElementById("alchemy-flame-name");if(t){const s=A(e.player.currentCauldron);s?t.innerHTML=`<span class="text-white">${s.name}</span>`:t.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`}if(n){const s=E(e.player.currentFlame);s?n.innerHTML=`<span class="text-white">${s.name}</span>`:n.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`}}renderRecipes(){this.viewAlchemyRecipes.innerHTML="";const i=K.filter(a=>e.player.knownRecipes.includes(a.id));if(i.length===0){this.viewAlchemyRecipes.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được đan phương nào...</div>';return}i.forEach(a=>{const l=b(a.resultId);if(!l)return;const t=this.getQualityClass(l.quality),n=document.createElement("div");n.className="p-4 border border-gray-800 rounded-2xl bg-white/5 space-y-3";let s="";a.materials.forEach(r=>{const h=b(r.id);if(!h)return;const c=e.player.inventory.allItems.find(d=>d.id===r.id),u=c?c.quantity:0,p=u>=r.quantity;s+=`<div class="text-[10px] ${p?"text-gray-400":"text-red-500"}">${h.name}: ${u}/${r.quantity}</div>`});const o=e.player.alchemyLevel<a.level;n.innerHTML=`
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <span class="text-xl mr-2">${l.image?`<img src="${T(l.image)}" class="w-6 h-6 object-contain inline-block">`:l.icon||""}</span>
                        <span class="font-bold quality-${t} font-ancient">${l.name}</span>
                    </div>
                    ${o?`<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${a.level}</span>`:`<button class="px-3 py-1.5 btn-gold text-[10px] font-bold rounded-lg whitespace-nowrap" onclick="window.game.craft('${a.id}')">LUYỆN CHẾ</button>`}
                </div>
                <div class="grid grid-cols-2 gap-1">${s}</div>
                <div class="text-[9px] text-gray-500 italic">${a.description}</div>
            `,this.viewAlchemyRecipes.appendChild(n)})}renderGarden(){this.elGardenPlots.innerHTML="",e.player.gardenPlots.forEach((i,a)=>{const l=document.createElement("div"),t=I[i.grade]||I.PHAM,n=M[i.attribute]||M.NORMAL;l.className="p-4 border rounded-3xl bg-white/5 flex flex-col space-y-4 transition-all hover:border-qi-jade/30 border-white/5 relative overflow-hidden";const s=document.createElement("div");s.className="absolute -right-2 -bottom-2 text-4xl opacity-5 pointer-events-none",s.textContent=n.icon,l.appendChild(s);let o=`
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center space-x-2">
                            <span class="text-[9px] px-2 py-0.5 rounded-full border bg-white/5 text-gray-400 border-white/10 uppercase font-bold">${t.name}</span>
                            <span class="text-[9px] px-2 py-0.5 rounded-full border bg-white/5 text-[${n.color}] border-white/10 uppercase font-bold" style="color: ${n.color}">${n.icon} ${n.name}</span>
                        </div>
                    </div>
                    <button class="p-1.5 hover:bg-white/10 rounded-full transition-colors" onclick="window.game.showFieldMenu(${a})">
                        <i class="ph ph-gear text-gray-500 text-xs"></i>
                    </button>
                </div>
            `;if(i.seedId){const r=j.find(c=>c.id===i.seedId),h=b(r.herbId);o+=`
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/10">
                            ${(h==null?void 0:h.icon)||"🌱"}
                        </div>
                        <div class="flex-grow">
                            <h4 class="text-xs font-ancient text-white">${r.name}</h4>
                            <div class="flex items-center space-x-2 mt-1">
                                <span class="text-[10px] text-qi-jade font-bold">${i.stage}</span>
                                <span class="text-[9px] text-gray-500">(${Math.floor(i.age)} năm)</span>
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
                `;l.innerHTML+=o,this.elGardenPlots.appendChild(l)})}renderShop(){if(!e.player)return;this.elShopLingShi.innerHTML=e.player.getFormattedLingShi();const i=document.getElementById("shop-vip-level");i&&(i.textContent=`VIP ${e.player.vipLevel}`,i.className=`px-2 py-0.5 rounded bg-gray-800 text-[8px] font-bold text-gray-400 border border-white/5 bg-vip-${e.player.vipLevel}`);const a=document.getElementById("shop-overlay-title");if(a&&e.systems.shop){const l=B[e.systems.shop.currentShopId];l&&(a.textContent=l.name.split(" - ")[0])}this.renderShopSections(),this.renderShopSubFilters(),this.btnShopTabBuy&&this.btnShopTabSell&&(e.views.shop==="buy"?(this.btnShopTabBuy.className="flex-grow py-3 text-cultivation-gold border-b-2 border-cultivation-gold text-xs",this.btnShopTabSell.className="flex-grow py-3 text-gray-500 border-b-2 border-transparent text-xs"):(this.btnShopTabBuy.className="flex-grow py-3 text-gray-500 border-b-2 border-transparent text-xs",this.btnShopTabSell.className="flex-grow py-3 text-cultivation-gold border-b-2 border-cultivation-gold text-xs")),e.views.shop==="buy"?(this.elShopBuyView.classList.remove("hidden"),this.elShopSellView.classList.add("hidden"),this.renderShopBuy()):(this.elShopBuyView.classList.add("hidden"),this.elShopSellView.classList.remove("hidden"),this.renderShopSell())}renderShopSections(){if(!this.elShopSectionNav)return;const i=e.systems.shop,a=[{id:"dan_duoc",name:"Đan Dược",icon:"💊"},{id:"phap_bao",name:"Trang Bị",icon:"⚔️"},{id:"cong_phap",name:"Bí Tịch",icon:"📜"},{id:"bach_nghe",name:"Bách Nghệ",icon:"⚒️"},{id:"ky_vat",name:"Kỳ Vật",icon:"💎"}];this.elShopSectionNav.querySelectorAll("button").length!==a.length&&(this.elShopSectionNav.innerHTML="",this.elShopSectionNav.dataset.shopId=i.currentShopId,a.forEach(t=>{const n=document.createElement("button");n.dataset.category=t.id,n.onclick=()=>{e.systems.shop&&(e.systems.shop.currentSection=t.id,this.shopSubFilter="all",this.shopQualityFilter="all",this.renderShop())},this.elShopSectionNav.appendChild(n)})),this.elShopSectionNav.querySelectorAll("button").forEach(t=>{const n=t.dataset.category,s=a.find(r=>r.id===n),o=i.currentSection===n;t.className=`px-4 py-2.5 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all whitespace-nowrap shrink-0 flex items-center space-x-2 ${o?"bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]":"text-gray-500 border border-white/5 hover:border-white/10 bg-white/[0.02]"}`,t.innerHTML=`<span>${s.icon}</span> <span>${s.name}</span>`})}renderShopSubFilters(){var n;if(!this.elShopSubFilterNav)return;const i=e.systems.shop;if(!i)return;this.renderShopQualityFilters();const a=i.currentSection;let l=[];if(a==="phap_bao"?l=[{id:"all",name:"--- Lọc Loại Trang Bị ---"},{id:"weapon",name:"Linh Khí (Vũ Khí)"},{id:"armor",name:"Pháp Y (Giáp)"},{id:"accessory",name:"Trang Sức"},{id:"attackArtifact",name:"Pháp Bảo: Chủ Chiến"},{id:"defenseArtifact",name:"Pháp Bảo: Hộ Thân"},{id:"flightArtifact",name:"Pháp Bảo: Phi Hành"},{id:"spaceArtifact",name:"Pháp Bảo: Càn Khôn"},{id:"formationArtifact",name:"Pháp Bảo: Trận Đạo"},{id:"supportArtifact",name:"Pháp Bảo: Phụ Trợ"},{id:"soulArtifact",name:"Pháp Bảo: Hồn Đạo"}]:a==="cong_phap"?l=[{id:"all",name:"--- Lọc Loại Bí Tịch ---"},{id:"cultivation",name:"Công Pháp Tu Luyện"},{id:"manual",name:"Bí Tịch Kỹ Năng"}]:a==="bach_nghe"?l=[{id:"all",name:"--- Lọc Loại Bách Nghệ ---"},{id:"nguyen_lieu",name:"Nguyên Liệu"},{id:"phu_luc",name:"Phù Lục"},{id:"tran_phap",name:"Trận Pháp"},{id:"luyen_khi",name:"Luyện Khí"},{id:"linh_dien",name:"Linh Điền"}]:a==="ky_vat"&&(l=[{id:"all",name:"--- Lọc Loại Kỳ Vật ---"},{id:"tui_tru_vat",name:"Túi Trữ Vật"},{id:"ky_trung",name:"Kỳ Trùng"},{id:"linh_thu",name:"Linh Thú"}]),(n=this.elShopFiltersWrap)==null||n.classList.remove("hidden"),l.length===0){this.elShopSubFilterNav.innerHTML="",this.elShopSubFilterNav.classList.add("hidden");return}this.elShopSubFilterNav.classList.remove("hidden"),this.elShopSubFilterNav.className="p-2",this.elShopSubFilterNav.innerHTML=`
            <select id="shop-subfilter-select" class="w-full bg-black/40 text-qi-blue border border-qi-blue/20 rounded-lg px-2 py-1.5 text-[9px] font-ancient uppercase tracking-widest outline-none transition-all focus:border-qi-blue/50">
                ${l.map(s=>`<option value="${s.id}" ${this.shopSubFilter===s.id?"selected":""}>${s.name}</option>`).join("")}
            </select>
        `;const t=this.elShopSubFilterNav.querySelector("#shop-subfilter-select");t.onchange=s=>{this.shopSubFilter=s.target.value,this.renderShop()}}renderShopQualityFilters(){if(!this.elShopQualityFilterNav)return;const i=e.systems.shop;if(!i)return;const a=i.currentSection;if(!["phap_bao","dan_duoc","cong_phap","bach_nghe"].includes(a)){this.elShopQualityFilterNav.classList.add("hidden"),this.elShopSubFilterNav.classList.remove("border-r","border-white/5"),this.elShopQualityFilterNav.innerHTML="";return}this.elShopSubFilterNav.classList.add("border-r","border-white/5");const t=[{id:"all",name:"Tất cả phẩm"},{id:"Phàm Khí",name:"Phàm Khí"},{id:"Pháp Khí",name:"Pháp Khí"},{id:"Linh Khí",name:"Linh Khí"},{id:"Pháp Bảo",name:"Pháp Bảo"},{id:"Cổ Bảo",name:"Cổ Bảo"},{id:"Linh Bảo",name:"Linh Bảo"},{id:"Thông Thiên Linh Bảo",name:"Thông Thiên Linh Bảo"},{id:"Tiên Khí",name:"Tiên Khí"},{id:"Danh Khí",name:"Danh Khí"}];this.elShopQualityFilterNav.classList.remove("hidden"),this.elShopQualityFilterNav.className="p-2 flex-1 border-white/5",this.elShopQualityFilterNav.innerHTML=`
            <select id="shop-quality-select" class="w-full bg-black/40 text-cultivation-gold border border-cultivation-gold/20 rounded-lg px-2 py-1.5 text-[9px] font-ancient uppercase tracking-widest outline-none transition-all focus:border-cultivation-gold/50">
                ${t.map(s=>`<option value="${s.id}" ${this.shopQualityFilter===s.id?"selected":""}>${s.name}</option>`).join("")}
            </select>
        `;const n=this.elShopQualityFilterNav.querySelector("#shop-quality-select");n.onchange=s=>{this.shopQualityFilter=s.target.value,this.renderShop()}}renderShopBuy(){const i=e.systems.shop;let a=i.getShopInventory();if(this.elShopBuyView.innerHTML="",this.shopSearchQuery&&(a=a.filter(l=>{const t=b(l.id);return t&&t.name.toLowerCase().includes(this.shopSearchQuery)})),this.shopSubFilter!=="all"&&(a=a.filter(l=>{var n;const t=b(l.id);if(!t)return!1;if(i.currentSection==="phap_bao")return t.type===this.shopSubFilter;if(i.currentSection==="cong_phap"){const s=t.action&&(t.action.startsWith("open_")||t.action.includes("linh_the_luc")||((n=t.effect)==null?void 0:n.type)==="unlock_profession"),o=(t.type==="book"||t.type==="technique")&&!s,r=t.type==="recipe"||t.type==="talisman_recipe"||s;if(this.shopSubFilter==="cultivation")return o;if(this.shopSubFilter==="manual")return r}else if(["bach_nghe","ky_vat"].includes(i.currentSection))return(B[i.currentShopId].sections[this.shopSubFilter]||[]).some(r=>r.id===l.id);return!0})),this.shopQualityFilter!=="all"&&(a=a.filter(l=>{const t=b(l.id);return t&&t.quality===this.shopQualityFilter})),this.shopSortMode!=="default"&&a.sort((l,t)=>{const n=b(l.id),s=b(t.id);if(!n||!s)return 0;if(this.shopSortMode==="price-asc")return n.price-s.price;if(this.shopSortMode==="price-desc")return s.price-n.price;if(this.shopSortMode==="quality"){const o=["Phàm Khí","Pháp Khí","Linh Khí","Pháp Bảo","Cổ Bảo","Linh Bảo","Thông Thiên Linh Bảo","Tiên Khí","Danh Khí","Hạ phẩm","Trung phẩm","Thượng phẩm","Cực phẩm","Hoàn Mỹ"];return o.indexOf(s.quality)-o.indexOf(n.quality)}return 0}),a.length===0){this.elShopBuyView.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Không tìm thấy bảo vật phù hợp...</div>';return}a.forEach(l=>{const t=b(l.id);if(!t)return;const n=this.getQualityClass(t.quality),s=document.createElement("div");s.className=`flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-xl hover:border-${n} cursor-pointer transition-colors duration-200`,s.onclick=()=>{window.game.screens.inventory&&window.game.screens.inventory.selectItem(l.id,!0)};const o=document.createElement("div");o.className="flex items-center space-x-3",o.innerHTML=`
                <div class="text-2xl bg-black/60 p-2 rounded-lg border border-${n}/30">${t.image?`<img src="${T(t.image)}" class="w-8 h-8 object-contain">`:t.icon||""}</div>
                <div>
                    <div class="text-sm font-bold text-white">${t.name}</div>
                    <div class="text-[9px] font-bold quality-${n}">${t.quality}${t.quality.toLowerCase().includes("khí")||t.quality.toLowerCase().includes("bảo")||t.quality.toLowerCase().includes("phẩm")||t.quality.toLowerCase().includes("giai")||t.quality.toLowerCase().includes("hỏa")||t.quality.toLowerCase().includes("lôi")||["Hoàn Mỹ","Tiên Khí","Linh Bảo","Danh Khí"].includes(t.quality)?"":" phẩm"} | Kho: ${l.stock}</div>
                </div>
            `;const r=Math.floor(t.price*(1-Math.min(.25,e.player.vipLevel*.05))),h=l.minVip&&e.player.vipLevel<l.minVip,c=document.createElement("div");c.className="flex items-center space-x-3",c.innerHTML=`
                <div class="text-right">
                    <div class="text-[8px] text-gray-500 line-through">${t.price} LT</div>
                    <div class="text-xs font-mono text-cultivation-gold whitespace-nowrap">${r} LT</div>
                    ${h?`<div class="text-[7px] text-red-500 font-bold uppercase animate-pulse">Yêu cầu VIP ${l.minVip}</div>`:""}
                </div>
            `;const u=document.createElement("button"),p=l.stock<=0;u.className=`px-3 py-1.5 btn-gold text-[10px] font-bold rounded-lg whitespace-nowrap ${p||h?"opacity-50 grayscale pointer-events-none":""}`,u.innerHTML='<i class="ph ph-shopping-cart-simple mr-1"></i>TRAO ĐỔI',u.onclick=d=>{d.stopPropagation(),window.game.buyItem(l.id)},c.appendChild(u),s.appendChild(o),s.appendChild(c),this.elShopBuyView.appendChild(s)})}renderShopSell(){if(this.elShopSellGrid.innerHTML="",!e.player||!e.player.inventory)return;const i=e.systems.shop.currentSection,a=this.shopSubFilter;let l=[...e.player.inventory.allItems];if(this.shopSearchQuery&&(l=l.filter(t=>{const n=b(t.id);return n&&n.name.toLowerCase().includes(this.shopSearchQuery)})),l=l.filter(t=>{var c;const n=b(t.id);if(!n)return!1;const s={dan_duoc:["consumable"],phap_bao:["weapon","armor","accessory","treasure","head","necklace","shoes","attackArtifact","defenseArtifact","flightArtifact","spaceArtifact","formationArtifact","supportArtifact","soulArtifact"],nguyen_lieu:["material","herb","ore","wood"],cong_phap:["book","technique","recipe","talisman_recipe","consumable"],tran_phap:["formation"],phu_luc:["talisman"],luyen_khi:["material","smithing_tool"],tui_tru_vat:["consumable"],ky_trung:["consumable"],linh_thu:["supportArtifact"]},h=({dan_duoc:["dan_duoc"],phap_bao:["phap_bao"],cong_phap:["cong_phap"],bach_nghe:["nguyen_lieu","phu_luc","tran_phap","luyen_khi","linh_dien"],ky_vat:["tui_tru_vat","ky_trung","linh_thu"]}[i]||[i]).flatMap(u=>s[u]||[]);if(h.length>0&&!h.includes(n.type))return!1;if(i==="cong_phap"){const u=n.action&&(n.action.startsWith("open_")||n.action.includes("linh_the_luc")),p=(n.type==="book"||n.type==="technique")&&!u,d=n.type==="recipe"||n.type==="talisman_recipe"||n.type==="consumable"&&((c=n.effect)==null?void 0:c.type)==="unlock_profession"||u;if(a==="cultivation"&&!p||a==="manual"&&p||a==="manual"&&!d&&!p||a==="all"&&!p&&!d)return!1}return!(["bach_nghe","ky_vat"].includes(i)&&a!=="all"&&(!s[a]||!s[a].includes(n.type))||i==="phap_bao"&&a!=="all"&&n.type!==a||a==="tui_tru_vat"&&n.action!=="expand_inventory"||this.shopQualityFilter!=="all"&&n.quality!==this.shopQualityFilter)}),this.shopSortMode!=="default"&&l.sort((t,n)=>{const s=b(t.id),o=b(n.id);if(!s||!o)return 0;if(this.shopSortMode==="price-asc")return s.price-o.price;if(this.shopSortMode==="price-desc")return o.price-s.price;if(this.shopSortMode==="quality"){const r=["Phàm Khí","Pháp Khí","Linh Khí","Pháp Bảo","Cổ Bảo","Linh Bảo","Thông Thiên Linh Bảo","Tiên Khí","Danh Khí","Hạ phẩm","Trung phẩm","Thượng phẩm","Cực phẩm","Hoàn Mỹ"];return r.indexOf(o.quality)-r.indexOf(s.quality)}return 0}),l.length===0){this.elShopSellGrid.innerHTML='<div class="col-span-4 text-center py-10 text-gray-600 italic text-xs">Không có bảo vật nào để giao dịch...</div>';return}l.forEach(t=>{const n=b(t.id);if(!n)return;const s=this.getQualityClass(n.quality);let o=.5;["material","herb","ore","wood"].includes(n.type)&&(o=.3);const r=document.createElement("div");r.className=`p-2 border border-gray-800 rounded-lg bg-black/20 flex flex-col items-center cursor-pointer hover:border-${s} transition-colors duration-200 active:scale-95`,r.innerHTML=`
                <div class="text-2xl mb-1">${n.image?`<img src="${T(n.image)}" class="w-8 h-8 object-contain">`:n.icon||""}</div>
                <div class="text-[9px] text-gray-400">x${t.quantity}</div>
                <div class="text-[8px] text-cultivation-gold mt-1">${Math.floor(n.price*o)} LT</div>
            `,r.onclick=()=>{window.game.screens.inventory&&window.game.screens.inventory.selectItem(t.id,!1,!0)},this.elShopSellGrid.appendChild(r)})}renderGuild(){e.player&&(this.elGuildCerts.innerHTML="",this.elGuildMissions=document.getElementById("guild-mission-list"),this.elGuildRooms=document.getElementById("guild-room-list"),V.forEach(i=>{var t;const a=e.player.alchemyLevel<i.requirements.alchemyLevel,l=document.createElement("div");l.className="p-4 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center",l.innerHTML=`
                <div>
                    <h4 class="text-sm font-ancient text-white">${i.name}</h4>
                    <p class="text-[10px] text-gray-500">Phí: ${i.requirements.fee} LT | Cần luyện: ${i.task.quantity} ${((t=b(i.task.targetId))==null?void 0:t.name)||"đan dược"}</p>
                </div>
                <button class="px-3 py-1.5 bg-qi-blue text-black text-[10px] font-bold rounded-lg ${a?"opacity-50":""}" 
                    onclick="window.game.guildCertify(${i.level})">KHẢO HẠCH</button>
            `,this.elGuildCerts.appendChild(l)}),this.elGuildMissions&&(this.elGuildMissions.innerHTML="",F.forEach(i=>{const a=document.createElement("div");a.className="p-4 border border-white/5 rounded-xl bg-white/5 space-y-2",a.innerHTML=`
                    <div class="flex justify-between items-center">
                        <h4 class="text-sm font-ancient text-white">${i.name}</h4>
                        <button class="px-3 py-1 bg-qi-purple text-white text-[10px] font-bold rounded-lg" 
                            onclick="window.game.guildMission('${i.id}')">GIAO NỘP</button>
                    </div>
                    <p class="text-[10px] text-gray-400 italic">${i.description}</p>
                    <p class="text-[9px] text-cultivation-gold">Thưởng: ${i.rewards.lingShi} LT | Danh vọng: ${i.rewards.reputation}</p>
                `,this.elGuildMissions.appendChild(a)})),this.elGuildRooms&&(this.elGuildRooms.innerHTML="",D.forEach(i=>{const a=e.player.currentAlchemyRoom===i.id,l=document.createElement("div");l.className=`p-4 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center ${a?"border-cultivation-gold":""}`,l.innerHTML=`
                    <div>
                        <h4 class="text-sm font-ancient text-white">${i.name} ${a?"⭐":""}</h4>
                        <p class="text-[10px] text-gray-500">Phí thuê: ${i.fee} LT | Tăng ${i.successBonus*100}% thành công</p>
                    </div>
                    <button class="px-3 py-1.5 ${a?"bg-gray-800":"bg-cultivation-gold"} text-black text-[10px] font-bold rounded-lg" 
                        onclick="window.game.guildRent('${i.id}')">${a?"ĐANG THUÊ":"THUÊ"}</button>
                `,this.elGuildRooms.appendChild(l)})))}renderTower(){const i=document.getElementById("tower-floor-list");i&&(i.innerHTML="",ie.forEach(a=>{const l=e.player.alchemyLevel<a.minAlchemyLevel,t=document.createElement("div");t.className=`p-6 border border-white/5 rounded-2xl bg-white/5 space-y-3 ${l?"opacity-40":"hover:border-cultivation-gold/50 cursor-pointer"}`,t.innerHTML=`
                <div class="flex justify-between items-center">
                    <h4 class="text-lg font-ancient text-cultivation-gold">${a.name}</h4>
                    ${l?`<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${a.minAlchemyLevel}</span>`:'<i class="ph ph-caret-right text-gray-500"></i>'}
                </div>
                <p class="text-xs text-gray-400">${a.description}</p>
            `,l||(t.onclick=()=>e.ui.toast(`Đang tiến vào ${a.name}...`,"success")),i.appendChild(t)}))}renderMountain(){const i=document.getElementById("mountain-layer-name"),a=document.getElementById("mountain-layer-desc"),l=document.getElementById("mountain-layer-progress-text"),t=document.getElementById("mountain-layer-progress-bar"),n=document.getElementById("mountain-oxygen-text"),s=document.getElementById("mountain-oxygen-bar"),o=document.getElementById("mountain-toxicity-text"),r=document.getElementById("mountain-toxicity-bar");if(document.getElementById("mountain-event-log"),!e.player.mountainSurvival)return;const h=e.systems.mountain,c=G.find(m=>m.id===h.currentLayer),u=R.find(m=>m.id===c.tier);if(i){const m={ngoai_son:"text-green-400",trung_son:"text-blue-400",noi_son:"text-purple-400",cam_khu:"text-red-500"}[c.tier]||"text-red-400";i.innerHTML=`<span class="text-[10px] block opacity-60 uppercase tracking-tighter">${u.name}</span>${c.name}`,i.className=`text-2xl font-ancient ${m} mb-1`}a&&(a.textContent=c.description);const p=h.discovery[h.currentLayer]||0;l&&(l.textContent=`${Math.floor(h.layerProgress)}% (Khám phá: ${Math.floor(p)}%)`),t&&(t.style.width=`${h.layerProgress}%`),n&&(n.textContent=`${Math.ceil(e.player.mountainSurvival.oxygen)}%`),s&&(s.style.width=`${e.player.mountainSurvival.oxygen}%`),o&&(o.textContent=`${Math.ceil(e.player.mountainSurvival.toxicity)}%`),r&&(r.style.width=`${e.player.mountainSurvival.toxicity}%`);const d=document.getElementById("btn-mountain-deeper");if(d){const m=h.bossDefeated[c.tier];h.layerProgress>=100&&!m?d.innerHTML='<span class="relative z-10 text-xs font-bold text-red-500 uppercase tracking-[0.2em] animate-pulse">KHIÊU CHIẾN THỦ LĨNH</span>':d.innerHTML='<span class="relative z-10 text-xs font-bold text-red-400 uppercase tracking-[0.2em]">TẦNG KẾ TIẾP</span>'}e.player.hp<=0&&(e.systems.mountain.stop(),e.ui.toggleOverlay(document.getElementById("mountain-overlay"),!1))}renderSects(){const i=document.getElementById("sects-view");if(i)if(i.innerHTML="",e.player.sectId){const a=Q(e.player.sectId);if(this.activeSectZone){this.renderSectZoneDetail(a,this.activeSectZone);return}const l=[{id:"son_mon",name:"Sơn Môn",icon:"⛩️",desc:"Hộ tông đại trận, đệ tử canh phòng."},{id:"quang_truong",name:"Quảng Trường Tông Môn",icon:"🏟️",desc:"Nhiệm vụ, luận đạo học hỏi."},{id:"dai_dien",name:"Đại Điện / Chủ Điện",icon:"🏛️",desc:"Bái kiến Tông chủ & hội nghị trưởng lão."},{id:"tang_kinh_cac",name:"Tàng Kinh Các",icon:"📚",desc:"Nhiơi học công pháp & bí tịch truyền thừa."},{id:"luyen_dan",name:"Luyện Đan Phòng",icon:"🧪",desc:"Địa hỏa linh thất đan dược (+10% thành công)."},{id:"luyen_khi",name:"Luyện Khí Các",icon:"⚒️",desc:"Đúc đập thần binh pháp bảo."},{id:"linh_thu",name:"Linh Thú Viên",icon:"🦁",desc:"Thuần thú ngự trùng dưỡng kỳ lân."},{id:"duoc_vien",name:"Dược Viên / Linh Điền",icon:"🌿",desc:"Tiên dược quý hiếm trồng trọt."},{id:"dong_phu",name:"Động Phủ Đệ Tử",icon:"🛕",desc:"Động phủ tu luyện cá nhân tĩnh cơ."},{id:"bi_canh",name:"Bí Cảnh Thí Luyện",icon:"🗼",desc:"Thí Luyện Tháp, vượt ải ảo ảnh."}];i.innerHTML=`
                <div class="bg-white/5 rounded-2xl border border-qi-blue/30 overflow-hidden mb-4 animate-fade-in">
                    <div class="h-32 relative">
                        <img src="${a.portrait||f.backgrounds.sect}" class="w-full h-full object-cover opacity-40">
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
                    ${l.map(t=>`
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
            `}else{const a=e.currentLocId,l=O[a];if(l){const t=e.player.realmId>=l.minRealm,n=e.systems.time,s=n?n.getYear()%2===0:!0,o=n?n.getMonth()===1||n.getMonth()===2:!0,r=s&&o,h=document.createElement("div");h.className=`p-4 border rounded-xl bg-black/40 space-y-3 ${t?"border-gray-800":"opacity-50 grayscale"}`;let c="";r?c=`
                        <button class="w-full py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-xl flex items-center justify-center ${t?"":"hidden"}" onclick="window.game.startRecruitmentExam('${l.id}')">
                            <i class="ph ph-identification-badge mr-2"></i>THAM GIA KHẢO HẠCH
                        </button>
                    `:c=`
                        <div class="p-3 bg-white/5 border border-white/10 rounded-xl text-center space-y-1">
                            <span class="text-gray-400 text-[10px] font-bold uppercase tracking-wider">CHIÊU MỘ CHƯA MỞ</span>
                            <span class="text-[9px] text-gray-500">Mở lại: Tháng 1-2 năm chẵn</span>
                            <button disabled class="w-full mt-2 py-2 bg-gray-500/10 border border-gray-500/20 text-gray-500 text-[9px] font-bold rounded-lg uppercase tracking-wider flex items-center justify-center space-x-1">
                                <i class="ph ph-clock"></i><span>KHÔNG PHẢI MÙA TUYỂN</span>
                            </button>
                        </div>
                    `,h.innerHTML=`
                    <div class="flex justify-between items-center">
                        <h3 class="text-xl font-ancient text-white">${l.name}</h3>
                        <span class="text-[10px] ${t?"text-qi-blue":"text-red-500"}">${t?"Có thể bái nhập":"Cần: "+U(l.minRealm).name}</span>
                    </div>
                    <p class="text-xs text-gray-500">${l.description}</p>
                    ${c}
                `,i.appendChild(h)}else i.innerHTML=`
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
                `}}renderSectZoneDetail(i,a){const l=document.getElementById("sects-view");if(!l)return;let t="";switch(a){case"son_mon":t=`
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
                                ${i.missions.map(s=>`
                                    <div class="p-3 bg-black/40 rounded-lg border border-white/5 flex justify-between items-center">
                                        <div>
                                            <div class="text-xs font-bold text-white">${s.name}</div>
                                            <div class="text-[8px] text-gray-500">${s.desc}</div>
                                        </div>
                                        <button class="px-3 py-1 bg-qi-purple/10 text-qi-purple text-[9px] font-bold rounded border border-qi-purple/20 flex items-center" onclick="window.game.doMission('${s.id}')">
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
                `;break;case"tang_kinh_cac":{const s=`item_${i.id}_t`,o=`item_${i.id}_s`,r=b(s),h=b(o),c=r&&e.player.learnedTechniques.some(d=>d.id===r.techniqueId),u=h&&e.player.learnedSecretTechniques.some(d=>d.id===h.secretId);let p="";if(r){const d=c?'<span class="text-[8px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">ĐÃ LĨNH HỘI</span>':`<button class="px-2 py-1 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold text-[9px] font-bold rounded border border-cultivation-gold/30 flex items-center transition-all" onclick="window.game.buySectScroll('${s}', 200)">
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
                        `}if(h){const d=u?'<span class="text-[8px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">ĐÃ LĨNH HỘI</span>':`<button class="px-2 py-1 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue text-[9px] font-bold rounded border border-qi-blue/30 flex items-center transition-all" onclick="window.game.buySectScroll('${o}', 400)">
                                <i class="ph ph-shopping-cart-simple mr-0.5"></i>400 Cống Hiến
                               </button>`;p+=`
                            <div class="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between items-center space-x-2">
                                <div class="flex-1">
                                    <div class="text-[11px] font-bold text-white flex items-center"><span class="text-sm mr-1">${h.icon}</span>${h.name}</div>
                                    <div class="text-[9px] text-gray-400 mt-0.5">${h.description}</div>
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
                `;break}const n=[{id:"son_mon",name:"Sơn Môn",icon:"⛩️"},{id:"quang_truong",name:"Quảng Trường",icon:"🏟️"},{id:"dai_dien",name:"Đại Điện",icon:"🏛️"},{id:"tang_kinh_cac",name:"Tàng Kinh Các",icon:"📚"},{id:"luyen_dan",name:"Luyện Đan Phòng",icon:"🧪"},{id:"luyen_khi",name:"Luyện Khí Các",icon:"⚒️"},{id:"linh_thu",name:"Linh Thú Viên",icon:"🦁"},{id:"duoc_vien",name:"Dược Viên / Linh Điền",icon:"🌿"},{id:"dong_phu",name:"Động Phủ Đệ Tử",icon:"🛕"},{id:"bi_canh",name:"Bí Cảnh Thí Luyện",icon:"🗼"}].find(s=>s.id===a);l.innerHTML=`
            <button class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center text-xs font-bold transition-all mb-4" 
                    onclick="window.game.screens.systems.activeSectZone = null; window.game.screens.systems.renderSects();">
                <i class="ph ph-arrow-left mr-1"></i> Quay Lại Tông Môn
            </button>

            <div class="bg-white/5 rounded-2xl border border-qi-blue/30 overflow-hidden mb-4 animate-fade-in">
                <div class="h-24 relative">
                    <img src="${i.portrait||f.backgrounds.sect}" class="w-full h-full object-cover opacity-30">
                    <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div class="absolute bottom-3 left-4 flex items-center space-x-2">
                        <span class="text-3xl">${n.icon}</span>
                        <div>
                            <h3 class="text-lg font-ancient text-white">${n.name}</h3>
                            <p class="text-[8px] text-qi-blue uppercase tracking-widest">${i.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pb-12 custom-scroll overflow-y-auto animate-fade-in">
                ${t}
            </div>
        `}handleSectZoneAction(i,a){var t;const l=e.systems.time?e.systems.time.totalDays:0;switch(a){case"vow_rules":if(e.player.lastSectVowDay===l){e.ui.toast("Hôm nay ngươi đã tuyên thệ rồi, không nên quá thường xuyên bái bản tông!","warning");return}e.player.lastSectVowDay=l,e.player.tuVi=(e.player.tuVi||0)+15,e.ui.toast("Ngươi chắp tay tuyên thệ tuân thủ Tông quy nghiêm nghị. Đạo tâm tu sĩ chấn chỉnh vững chắc! (+15 Tu vi)","success");break;case"reinforce_array":if(e.player.mana<50){e.ui.toast("Linh lực bất túc, không đủ 50 Linh Lực truyền pháp gia cố trận pháp!","error");return}e.player.mana-=50,e.player.sectContribution=(e.player.sectContribution||0)+5,e.ui.toast("Ngươi dẫn tinh linh khí gia cố kết giới mạch trận thành công! Tông môn thưởng +5 Cống hiến!","success");break;case"talk_guard":{const n=["Thủ môn đệ tử: Tu luyện không thèm chểnh mảng, kiên trì nhất định thành tựu thiên kiếp sơ kỳ!","Thủ môn đệ tử: Ngoại sơn môn phong quang vô cùng, có yêu điểu rình rập, đi đứng xin nhớ mang theo phi kiếm.","Thủ môn đệ tử: Cổ truyền tông đại trận vô cùng chắc chắn, tà ma ngoại đạo bất khả xâm phạm!"];e.ui.toast(n[Math.floor(Math.random()*n.length)],"info")}break;case"debate_dao":if(e.player.mana<20){e.ui.toast("Linh lực cạn kiệt, tinh thần mệt mỏi!","error");return}e.player.mana-=20;{const n=((t=e.player.advancedStats)==null?void 0:t.comprehension)||10,s=Math.random()*40;n>=s?(e.player.tuVi=(e.player.tuVi||0)+30,e.player.sectContribution=(e.player.sectContribution||0)+8,e.ui.toast("Biện luận xuất chúng! Lời nói chứa linh cơ đốn ngộ! Nhận +30 Tu vi, +8 Cống hiến!","success")):(e.player.tuVi=(e.player.tuVi||0)+10,e.ui.toast("Tranh luận đạo tâm rơi vào thế bí, tuy nhiên vẫn thu hoạch được chút ngộ đạo. Nhận +10 Tu vi!","info"))}break;case"bow_master":if(e.player.lastSectBowDay===l){e.ui.toast("Hôm nay sư phụ bế quan bận rộn hội họp, ngày mai hãy tới thỉnh an!","warning");return}e.player.lastSectBowDay=l,e.player.sectContribution=(e.player.sectContribution||0)+15,e.ui.toast("Ngươi khấu đầu cung kính thỉnh an Tông Chủ tối cao. Nhận thưởng +15 Điểm Cống hiến!","success");break;case"listen_lecture":if(e.player.lastSectLectureDay===l){e.ui.toast("Trưởng lão hôm nay đã truyền pháp xong rồi, hãy quay lại vào ngày mai!","warning");return}if(e.player.gold<100){e.ui.toast("Ngươi không đủ 100 Linh Thạch dâng kính trà lễ!","error");return}e.player.gold-=100,e.player.lastSectLectureDay=l,e.player.tuVi=(e.player.tuVi||0)+150,e.ui.toast("Bái nghe Trưởng lão giảng giải đạo lý ngưng cốt. Thần khí sảng khoái đốn ngộ vô cùng! Nhận +150 Tu vi!","success");break;case"donate_herbs":{if(e.player.inventory.getItemQuantity("item_linh_thao")<5){e.ui.toast("Ngươi bất túc 5 cọng Linh Thảo để đóng góp!","error");return}e.player.inventory.removeItem("item_linh_thao",5),e.player.sectContribution=(e.player.sectContribution||0)+20,e.ui.toast("Hiến quyên thành công 5 Linh Thảo cấp thấp làm linh dược thô. Nhận +20 Cống hiến!","success")}break;case"donate_scrap":if(e.player.gold<200){e.ui.toast("Không đủ 200 Linh Thạch đóng góp khoáng vật chế khí!","error");return}e.player.gold-=200,e.player.sectContribution=(e.player.sectContribution||0)+10,e.ui.toast("Đóng góp 200 Linh Thạch chế tạo linh tài. Thủ Các Trưởng lão ghi nhận: +10 Cống hiến!","success");break;case"play_beasts":if(e.player.mana<20){e.ui.toast("Linh lực mệt mỏi bất khả!","error");return}e.player.mana-=20,e.ui.toast("Ngươi ân cần tiếp xúc cho linh thú ăn linh thảo trong vườn. Linh thú tâm tình vui vẻ vô cùng!","success");break;case"catch_insect":if(e.player.lastSectCatchDay===l){e.ui.toast("Hôm nay ngươi đã bắt sâu ở ngự thú viên rồi, hãy đợi ngày mai linh trùng bò ra!","warning");return}if(e.player.mana<30){e.ui.toast("Linh lực cạn kiệt không đủ ngự khí giăng lưới!","error");return}e.player.mana-=30,e.player.lastSectCatchDay=l,Math.random()<.25?(e.player.inventory.addItem("item_phe_kim_trung",1),e.ui.toast("💥 Thành công bắt được 1 con Phệ Kim Trùng hoang dã bò trên linh thạch!","success")):e.ui.toast("Hụt mất! Linh trùng bò rất nhanh đã lẩn trốn vào kẽ đá cấm địa.","info");break;case"water_garden":if(e.player.lastSectWaterDay===l){e.ui.toast("Linh điền đã nhận đủ linh lộ tưới tiêu hôm nay rồi!","warning");return}if(e.player.mana<30){e.ui.toast("Linh lực cạn kiệt bất khả xách sương dẫn thủy!","error");return}e.player.mana-=30,e.player.lastSectWaterDay=l;{const n=["linh_chi_seed","nhan_sam_seed","tuyet_lien_seed"],s=n[Math.floor(Math.random()*n.length)];e.player.inventory.addItem(s,1),e.player.sectContribution=(e.player.sectContribution||0)+15,e.ui.toast("Tưới sương bắt sâu thảo điền chu đáo! Nhận +15 Cống hiến và 1 Hạt giống linh thảo ngẫu nhiên!","success")}break;case"circulate_qi":if(e.player.lastSectQiDay===l){e.ui.toast("Kinh mạch chấn động bão hòa linh lực, bế quan tu luyện thêm sẽ đứt vỡ!","warning");return}if(e.player.mana<100){e.ui.toast("Linh khí bất túc đại chu thiên tuần hoàn (Cần 100 Linh Lực)!","error");return}e.player.mana-=100,e.player.lastSectQiDay=l;{const n=Math.floor(e.player.atk*15+e.player.level*50);e.player.tuVi=(e.player.tuVi||0)+n,e.ui.toast(`Xếp bằng đại chu thiên vận chuyển đạo pháp ngưng khí 36 vòng! Hấp thu vô vàn linh cơ: +${n} Tu vi!`,"success")}break;case"upgrade_array":if(e.player.gold<500){e.ui.toast("Ngươi thiếu hụt 500 Linh Thạch cải tiến pháp trận động phủ!","error");return}e.player.gold-=500,e.player.tuVi=(e.player.tuVi||0)+300,e.ui.toast("Nâng cấp pháp trận tụ linh động phủ thành công! Nâng cao căn cơ tĩnh tâm hành thiền. Nhận +300 Tu vi!","success");break;case"trial_fight":if(e.player.hp<e.player.maxHp*.2){e.ui.toast("Trạng thái suy nhược cực độ khí huyết quá thấp bất khả thí luyện!","error");return}{const n=Y.generate(e.player.realmId);n.name=`Ảo Ảnh Thí Luyện (${n.realmName})`,n.inventory=[],e.ui.toast("Kích hoạt Ảo Ảnh Pháp Trận, trận chiến mở màn!","info"),setTimeout(()=>{e.ui.toggleOverlay(document.getElementById("sects-overlay"),!1),window.game.startBattle(n,null,s=>{s?(e.player.sectContribution=(e.player.sectContribution||0)+50,e.ui.toast("🏆 Thách đấu thành công ảo cảnh! Tông môn thưởng +50 Điểm Cống hiến!","success")):e.ui.toast("Khiêu chiến thất bại! Cố gắng ngộ đạo thêm hãy quay lại.","error"),setTimeout(()=>{e.ui.toggleOverlay(document.getElementById("sects-overlay"),!0),window.game.screens.systems.renderSects()},1200)})},800)}break}window.game.saveState(),window.game.refreshUI(),this.renderSects()}renderEnergy(){if(!e.player)return;const i=document.getElementById("env-energy-list"),a=document.getElementById("env-purity-tag");if(i&&e.currentLocId){const t=Z(e.currentWorldId,e.currentLocId);if(t&&t.energies){if(a&&t.energies.length>0){const n=t.energies[0].purity||"TINH_THUAN",s=e.systems.energy.getPurity(n);a.textContent=s.name}i.innerHTML=t.energies.map(n=>{const s=e.systems.energy.getEnergyType(n.type);return`
                        <div class="flex flex-col items-center space-y-1">
                            <span class="text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">${s.icon}</span>
                            <div class="flex flex-col items-center">
                                <span class="text-[9px] text-white font-mono font-bold">${n.concentration}%</span>
                                <span class="text-[7px] text-gray-500 font-ancient uppercase tracking-widest">${s.name}</span>
                            </div>
                        </div>
                    `}).join("")}else i.innerHTML=""}const l=document.getElementById("char-energy-list");if(l){const t=Object.entries(e.player.qiAccumulated).filter(([n,s])=>s.amount>0);t.length===0?l.innerHTML='<div class="text-[9px] text-gray-600 italic">Chưa có khí tức tích lũy</div>':l.innerHTML=t.map(([n,s])=>{const o=e.systems.energy.getEnergyType(n),r=e.systems.energy.getPurity(s.purity),h=Math.log10(s.amount+1);return`
                        <div class="p-2 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <span class="text-sm">${o.icon}</span>
                                <div>
                                    <div class="text-[9px] font-bold text-white font-ancient">${o.name}</div>
                                    <div class="text-[7px] text-qi-blue uppercase">${r.name}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-[8px] font-mono text-gray-400">${Math.floor(s.amount).toLocaleString()} Qi</div>
                                <div class="text-[7px] text-cultivation-gold">+${(h*10).toFixed(1)} Bonus</div>
                            </div>
                        </div>
                    `}).join("")}}getQualityClass(i){return{"Phàm Khí":"pham-khi","Pháp Khí":"phap-khi","Linh Khí":"linh-khi","Pháp Bảo":"phap-bao","Cổ Bảo":"co-bao","Linh Bảo":"linh-bao","Thông Thiên Linh Bảo":"thong-thien","Tiên Khí":"tien-khi","Danh Khí":"danh-khi","Hạ phẩm":"pham","Trung phẩm":"hoang","Thượng phẩm":"huyen","Cực phẩm":"dia","Hoàn Mỹ":"thien"}[i]||"pham"}renderSmithing(){const i=document.getElementById("smithing-recipes");if(!i)return;i.innerHTML="";const a=document.getElementById("smithing-tool-name"),l=document.getElementById("smithing-flame-name");if(a){const o=e.player.smithingTool?b(e.player.smithingTool):null;o?a.innerHTML=`<span class="text-white">${o.name}</span>`:a.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'luyen_khi')" class="ml-2 text-[8px] text-red-400 underline hover:text-white transition-colors">MUA NGAY</button>`}if(l){const o=E(e.player.currentFlame);o?l.innerHTML=`<span class="text-white">${o.name}</span>`:l.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-red-400 underline hover:text-white transition-colors">MUA NGAY</button>`}const t=_(e.player.smithingLevel),n=document.getElementById("smithing-level-text");n&&(n.textContent=t.name);const s=Object.values(W).filter(o=>e.player.knownSmithingRecipes.includes(o.id));if(s.length===0){i.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được bản vẽ nào...</div>';return}s.forEach(o=>{const r=b(o.id);if(!r)return;const h=this.getQualityClass(r.quality),c=document.createElement("div");c.className="p-4 border border-gray-800 rounded-2xl bg-white/5 space-y-3";let u="";o.materials.forEach(d=>{var g;const m=b(d.id),x=((g=e.player.inventory.allItems.find(y=>y.id===d.id))==null?void 0:g.quantity)||0,v=x>=d.quantity;u+=`<div class="text-[10px] ${v?"text-gray-400":"text-red-500"}">${(m==null?void 0:m.name)||d.id}: ${x}/${d.quantity}</div>`});const p=e.player.smithingLevel<o.level;c.innerHTML=`
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <span class="text-xl mr-2">${r.image?`<img src="${T(r.image)}" class="w-6 h-6 object-contain inline-block">`:r.icon||""}</span>
                        <span class="font-bold quality-${h} font-ancient">${r.name}</span>
                    </div>
                    ${p?`<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${o.level}</span>`:`<button class="px-4 py-2 btn-gold text-[10px] font-bold rounded-lg whitespace-nowrap" onclick="window.game.forge('${o.id}')">${o.type==="bag_upgrade"?"NÂNG CẤP":"RÈN ĐÚC"}</button>`}
                </div>
                <div class="grid grid-cols-2 gap-1">${u}</div>
                <div class="text-[9px] text-gray-500 italic">Thể lực: ${o.staminaCost} | Linh lực: ${o.manaCost}</div>
            `,i.appendChild(c)})}openCrafting(i){if(!e.player)return;if(!e.player.unlockedProfessions.includes(i)){e.ui.toast("Ngươi chưa nắm vững bí pháp của nghề này!","error");return}const t={alchemy:"screen-alchemy",smithing:"screen-smithing",talisman:"screen-talisman",formation:"screen-formation",beast:"screen-beast",puppet:"screen-puppet",corpse:"screen-corpse"}[i];t&&(e.ui.switchScreen(t),i==="alchemy"&&this.renderAlchemy(),i==="smithing"&&this.renderSmithing(),i==="talisman"&&this.renderTalisman(),i==="formation"&&this.renderFormation(),i==="beast"&&this.renderBeast(),i==="puppet"&&this.renderPuppet(),i==="corpse"&&this.renderCorpse())}openCraftingHub(){["screen-alchemy","screen-talisman","screen-smithing","screen-formation","screen-corpse","screen-beast","screen-puppet"].forEach(l=>{const t=document.getElementById(l);t&&(t.classList.add("hidden"),t.classList.remove("flex"))});const a=document.getElementById("screen-crafting-hub");a&&(a.classList.remove("hidden"),a.classList.add("flex"))}renderPuppet(){if(!e.player)return;const i=document.getElementById("puppet-level-text"),a=document.getElementById("puppet-exp-bar"),l=document.getElementById("puppet-list");if(i&&(i.textContent=`Khôi Lỗi Sư - Cấp ${e.player.puppetLevel}`),a){const t=Math.max(1,e.player.puppetLevel*100*Math.pow(1.5,e.player.puppetLevel-1));a.style.width=`${Math.min(100,e.player.puppetExp/t*100)}%`}if(l){l.innerHTML="";const t=X.filter(n=>e.player.knownPuppetRecipes.includes(n.id));if(t.length===0){l.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa có bản thiết kế khôi lỗi nào...</div>';return}t.forEach(n=>{const s=document.createElement("div");s.className="p-5 border border-white/5 rounded-3xl bg-white/[0.02] space-y-4 group hover:border-qi-blue/30 transition-all";let o="";n.materials.forEach(c=>{var m;const u=b(c.id),p=((m=e.player.inventory.allItems.find(x=>x.id===c.id))==null?void 0:m.quantity)||0,d=p>=c.quantity;o+=`
                        <div class="flex justify-between items-center bg-black/20 p-2 rounded-xl border ${d?"border-white/5":"border-red-500/20"}">
                            <span class="text-[10px] text-gray-400">${(u==null?void 0:u.name)||c.id}</span>
                            <span class="text-[10px] font-mono ${d?"text-qi-jade":"text-red-500"}">${p}/${c.quantity}</span>
                        </div>
                    `});const r=e.player.puppetLevel<n.skillLevel,h=f.puppets[n.id];s.innerHTML=`
                    <div class="flex justify-between items-start">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 group-hover:scale-110 transition-transform">
                                ${h?`<img src="${h}" class="w-full h-full object-cover">`:"🤖"}
                            </div>
                            <div>
                                <h4 class="font-ancient text-white text-lg">${n.name}</h4>
                                <div class="flex space-x-2 mt-1">
                                    <span class="text-[8px] px-2 py-0.5 bg-qi-blue/10 text-qi-blue rounded-full border border-qi-blue/20 uppercase font-bold">${z[n.grade].name}</span>
                                    <span class="text-[8px] px-2 py-0.5 bg-white/5 text-gray-500 rounded-full border border-white/10 uppercase font-bold">${n.type}</span>
                                </div>
                            </div>
                        </div>
                        ${r?`<div class="text-[9px] text-red-500 font-bold uppercase py-2">Cần Cấp ${n.skillLevel}</div>`:`<button class="px-5 py-2.5 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue text-[10px] font-bold rounded-xl border border-qi-blue/20 active:scale-95 transition-all" onclick="window.game.craftPuppet('${n.id}')">LUYỆN CHẾ</button>`}
                    </div>
                    <p class="text-[10px] text-gray-500 italic leading-relaxed">${n.description}</p>
                    <div class="grid grid-cols-2 gap-2">${o}</div>
                `,l.appendChild(s)})}}renderTalisman(){if(!e.player)return;const i=H(e.player.talismanLevel),a=document.getElementById("talisman-level-text"),l=document.getElementById("talisman-exp-bar"),t=document.getElementById("talisman-recipes");if(a&&(a.textContent=i.name),l){const s=Math.max(1,e.player.talismanLevel*100*Math.pow(1.5,e.player.talismanLevel-1));l.style.width=`${Math.min(100,e.player.talismanExp/s*100)}%`}const n=document.getElementById("current-pen-name");if(n){const s=e.player.currentTalismanPen?b(e.player.currentTalismanPen):null;s?n.innerHTML=`<span class="text-white">${s.name}</span>`:n.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phu_luc')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`}if(t){t.innerHTML="";const s=Object.values(J).filter(o=>e.player.knownTalismanRecipes.includes(o.id));if(s.length===0){t.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được phù văn nào...</div>';return}s.forEach(o=>{const r=document.createElement("div");r.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3";let h="";o.materials.forEach(u=>{var m;const p=b(u.id),d=((m=e.player.inventory.allItems.find(x=>x.id===u.id))==null?void 0:m.quantity)||0;h+=`<div class="text-[9px] ${d>=u.quantity?"text-gray-400":"text-red-500"}">${p.name} x${u.quantity} (${d})</div>`});const c=e.player.talismanLevel<o.level;r.innerHTML=`
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-bold text-qi-blue">${o.name}</h4>
                        ${c?`<span class="text-[8px] text-red-500 uppercase">Cần Cấp ${o.level}</span>`:`<button class="px-3 py-1 bg-qi-blue/10 text-qi-blue text-[10px] rounded border border-qi-blue/20" onclick="window.game.drawTalisman('${o.id}')">VẼ PHÙ</button>`}
                    </div>
                    <div class="grid grid-cols-2 gap-1 mb-2">${h}</div>
                    <div class="text-[8px] text-gray-500 italic">Mana: ${o.manaCost} | Stamina: ${o.staminaCost}</div>
                `,t.appendChild(r)})}}renderBeast(){if(!e.player)return;const i=document.getElementById("beast-list-view"),a=document.getElementById("beast-hatch-view"),l=document.getElementById("beast-tab-beast"),t=document.getElementById("beast-tab-insect"),n=document.getElementById("beast-tab-hatch");e.views.beast||(e.views.beast="beast"),e.views.beast==="hatch"?(i&&i.classList.add("hidden"),a&&a.classList.remove("hidden")):(i&&i.classList.remove("hidden"),a&&a.classList.add("hidden"));const s=["bg-qi-jade/10","text-qi-jade","border-qi-jade/20"],o=["bg-transparent","text-gray-500","border-transparent"];[l,t,n].forEach(p=>{if(p){p.classList.remove(...s,...o);const d=p===l&&e.views.beast==="beast"||p===t&&e.views.beast==="insect"||p===n&&e.views.beast==="hatch";p.classList.add(...d?s:o)}});const r=document.getElementById("beast-level-text"),h=document.getElementById("beast-exp-bar"),c=e.views.beast==="insect"?e.player.insectLevel:e.player.beastLevel,u=e.views.beast==="insect"?e.player.insectExp:e.player.beastExp;if(r&&(r.textContent=`Cấp ${c}`),h){const p=Math.max(1,c*100*Math.pow(1.5,c-1));h.style.width=`${Math.min(100,u/p*100)}%`}if(i&&e.views.beast!=="hatch"){i.innerHTML="";const p=e.player.beasts.filter(d=>{const m=N[d.id];return m?e.views.beast==="beast"?[w.LINH_THU,w.DI_THU,w.THAN_THU].includes(m.type):e.views.beast==="insect"?[w.LINH_TRUNG,w.KY_TRUNG].includes(m.type):!0:!1});if(p.length===0){const d=e.views.beast==="beast"?"linh thú":"kỳ trùng";i.innerHTML=`<div class="text-center py-10 text-gray-600 italic">Ngươi chưa có ${d} nào...</div>`}else p.forEach(d=>{const m=N[d.id],x=P(d.level),v=ee[d.bloodline],g=f.beasts[d.id],y=document.createElement("div");y.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] flex items-center space-x-4",y.innerHTML=`
                        <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0">
                            ${g?`<img src="${g}" class="w-full h-full object-cover">`:`<span class="text-3xl">${(m==null?void 0:m.icon)||"🐾"}</span>`}
                        </div>
                        <div class="flex-grow">
                            <div class="flex justify-between items-center">
                                <h4 class="font-bold text-white">${d.name}</h4>
                                <span class="text-[9px] font-bold" style="color: ${v.color}">${v.name}</span>
                            </div>
                            <div class="text-[9px] text-gray-500 mt-0.5">Cấp ${d.level} (${x.name})</div>
                            <div class="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                                <div class="h-full bg-qi-jade" style="width: ${d.exp/x.expRequired*100}%"></div>
                            </div>
                        </div>
                    `,i.appendChild(y)})}if(a&&e.views.beast==="hatch"){a.innerHTML="";const p=e.player.inventory.allItems.filter(d=>b(d.id).type==="beast_egg");p.length===0?a.innerHTML='<div class="text-center py-10 text-gray-600 italic">Ngươi không có trứng linh thú nào...</div>':p.forEach(d=>{const m=b(d.id),x=document.createElement("div");x.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] flex justify-between items-center",x.innerHTML=`
                        <div class="flex items-center space-x-3">
                            <div class="text-2xl">${m.icon}</div>
                            <div>
                                <h4 class="text-sm font-bold text-white">${m.name}</h4>
                                <p class="text-[9px] text-gray-500">Số lượng: ${d.quantity}</p>
                            </div>
                        </div>
                        <button class="px-4 py-2 bg-qi-jade/10 text-qi-jade text-[10px] rounded-xl border border-qi-jade/20" onclick="window.game.hatchBeast('${d.id}')">ẤP NỞ</button>
                    `,a.appendChild(x)})}l&&(l.onclick=()=>{e.views.beast="beast",this.renderBeast()}),t&&(t.onclick=()=>{e.views.beast="insect",this.renderBeast()}),n&&(n.onclick=()=>{e.views.beast="hatch",this.renderBeast()})}renderCraftingHub(){if(!e.player)return;[{id:"alchemy",key:"alchemy",name:"Luyện Dược Sư",level:e.player.alchemyLevel,exp:e.player.alchemyExp,getLevelInfo:q},{id:"talisman",key:"talisman",name:"Phù Sư",level:e.player.talismanLevel,exp:e.player.talismanExp,getLevelInfo:H},{id:"smithing",key:"smithing",name:"Luyện Khí Sư",level:e.player.smithingLevel,exp:e.player.smithingExp,getLevelInfo:_},{id:"formation",key:"formation",name:"Trận Pháp Sư",level:e.player.formationLevel,exp:e.player.formationExp,getLevelInfo:a=>({name:`Cấp ${a}`})},{id:"puppet",key:"puppet",name:"Khôi Lỗi Sư",level:e.player.puppetLevel,exp:e.player.puppetExp,getLevelInfo:a=>({name:`Cấp ${a}`})},{id:"corpse",key:"corpse",name:"Luyện Thi Sư",level:e.player.corpseLevel,exp:e.player.corpseExp,getLevelInfo:a=>({name:`Cấp ${a}`})},{id:"beast",key:"beast",name:"Ngự Thú Sư",level:e.player.beastLevel,exp:e.player.beastExp,getLevelInfo:P},{id:"insect",key:"insect",name:"Khu Trùng Sư",level:e.player.insectLevel,exp:e.player.insectExp,getLevelInfo:a=>({name:`Cấp ${a}`})}].forEach(a=>{const l=document.getElementById(`hub-${a.id}-level`),t=l==null?void 0:l.closest(".hub-card");if(!l||!t)return;const n=e.player.unlockedProfessions.includes(a.id);t.onclick=()=>window.game.openCrafting(a.id);const s={alchemy:"Đan Đạo Chân Giải",talisman:"Thái Thượng Phù Kinh",smithing:"Luyện Khí Tổng Cương",formation:"Trận Đạo Thiên Thư",puppet:"Cơ Quan Linh Kỹ",corpse:"Cửu U Luyện Thi Thuật",beast:"Vạn Thú Ngự Pháp",insect:"Thiên Trùng Bí Lục"};if(n){const o=a.getLevelInfo?a.getLevelInfo(a.level):{name:`Cấp ${a.level}`},r=a.level*100*Math.pow(1.5,a.level-1),h=Math.floor(a.exp/r*100);l.innerHTML=`${a.name} - ${o.name} <span class="text-white/30 ml-2">(${h}%)</span>`,t.classList.remove("opacity-40","grayscale"),t.classList.add("cursor-pointer")}else l.innerHTML=`
                    <div class="flex flex-col">
                        <span class="text-red-500/60 flex items-center"><i class="ph ph-lock-key mr-1"></i> Chưa mở khóa</span>
                        <span class="text-[7px] text-gray-600 italic mt-0.5">Cần: « ${s[a.id]} »</span>
                    </div>
                `,t.classList.add("opacity-40","grayscale"),t.classList.remove("cursor-pointer")})}renderFormation(){if(!e.player)return;const i=document.getElementById("formation-list");if(!i)return;if(i.innerHTML="",e.player.activeFormations.length>0){const t=document.createElement("h3");t.className="text-[10px] text-gray-500 uppercase tracking-widest mb-2",t.textContent="Trận Pháp Đang Hoạt Động",i.appendChild(t),e.player.activeFormations.forEach(n=>{const s=document.createElement("div");s.className="p-4 border border-qi-purple/30 rounded-2xl bg-qi-purple/5 mb-4 flex justify-between items-center",s.innerHTML=`
                    <div>
                        <h4 class="font-bold text-qi-purple">${n.name}</h4>
                        <p class="text-[9px] text-gray-500 mt-1">Đang kích hoạt...</p>
                    </div>
                    <button class="px-4 py-2 bg-red-500/10 text-red-500 text-[10px] rounded-xl border border-red-500/20" onclick="window.game.deactivateFormation('${n.id}')">THU HỒI</button>
                `,i.appendChild(s)})}const a=e.player.knownFormations||[],l=document.createElement("h3");if(l.className="text-[10px] text-gray-500 uppercase tracking-widest mt-6 mb-2",l.textContent="Trận Đồ Đã Lĩnh Ngộ",i.appendChild(l),a.length===0){const t=document.createElement("div");t.className="text-center py-6 text-gray-700 italic text-xs",t.textContent="Trống rỗng...",i.appendChild(t)}else a.forEach(t=>{const n=b(t);if(!n)return;const s=e.player.activeFormations.some(r=>r.id===t),o=document.createElement("div");o.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3 flex justify-between items-center",o.innerHTML=`
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">${n.icon||"📜"}</div>
                        <div>
                            <h4 class="text-sm font-bold text-white">${n.name}</h4>
                            <p class="text-[9px] text-gray-500">${n.description||""}</p>
                        </div>
                    </div>
                    ${s?'<span class="text-[9px] text-qi-purple font-bold">ĐÃ KÍCH HOẠT</span>':`<button class="px-4 py-2 bg-qi-purple/10 text-qi-purple text-[10px] rounded-xl border border-qi-purple/20" onclick="window.game.activateFormation('${t}')">KÍCH HOẠT</button>`}
                `,i.appendChild(o)})}renderCorpse(){if(!e.player)return;const i=document.getElementById("corpse-list"),a=document.getElementById("corpse-level-text"),l=document.getElementById("corpse-exp-bar");if(a&&(a.textContent=te(e.player.corpseLevel).name),l){const s=e.player.corpseLevel*100*Math.pow(1.5,e.player.corpseLevel-1);l.style.width=`${e.player.corpseExp/s*100}%`}if(!i)return;if(i.innerHTML="",e.player.refinedCorpses.length>0){const s=document.createElement("h3");s.className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-1",s.textContent="Thi Hài Đang Khống Chế",i.appendChild(s),e.player.refinedCorpses.forEach((o,r)=>{const h=f.corpses[o.id],c=document.createElement("div");c.className="p-4 border border-red-900/30 rounded-2xl bg-red-900/5 mb-4 flex items-center space-x-4",c.innerHTML=`
                    <div class="w-12 h-12 bg-red-950/20 rounded-2xl flex items-center justify-center overflow-hidden border border-red-900/20 flex-shrink-0">
                        ${h?`<img src="${h}" class="w-full h-full object-cover">`:'<span class="text-3xl">🧟</span>'}
                    </div>
                    <div class="flex-grow">
                        <div class="flex justify-between items-center">
                            <h4 class="font-bold text-red-400">${o.name}</h4>
                            <span class="text-[9px] px-2 py-0.5 bg-red-500/10 text-red-500 rounded border border-red-500/20 font-bold uppercase">${o.quality}</span>
                        </div>
                        <div class="text-[9px] text-gray-500 mt-1">Cấp ${o.level} | ATK: ${o.stats.atk} | HP: ${o.stats.hp}</div>
                    </div>
                `,i.appendChild(c)})}const t=document.createElement("h3");t.className="text-[10px] text-gray-500 uppercase tracking-widest mt-6 mb-3 border-b border-white/5 pb-1",t.textContent="Bản Vẽ Luyện Thi",i.appendChild(t);const n=Object.values(ne).filter(s=>e.player.knownCorpseRecipes.includes(s.id));if(n.length===0){const s=document.createElement("div");s.className="text-center py-6 text-gray-700 italic text-xs",s.textContent="Ngươi chưa có bí phương luyện thi nào...",i.appendChild(s)}else n.forEach(s=>{const o=f.corpses[s.id],r=document.createElement("div");r.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3 space-y-3";let h="";s.materials.forEach(p=>{var x;const d=b(p.id),m=((x=e.player.inventory.allItems.find(v=>v.id===p.id))==null?void 0:x.quantity)||0;h+=`<div class="text-[9px] ${m>=p.quantity?"text-gray-400":"text-red-500"}">${(d==null?void 0:d.name)||p.id} x${p.quantity} (${m})</div>`});const c=e.player.corpseLevel<s.level,u=Math.floor((.7-s.level*.1+e.player.corpseLevel*.05)*100);r.innerHTML=`
                <div class="flex justify-between items-start">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-red-950/20 rounded-2xl flex items-center justify-center overflow-hidden border border-red-900/20 flex-shrink-0 animate-pulse-subtle">
                            ${o?`<img src="${o}" class="w-full h-full object-cover">`:'<span class="text-3xl">🧟</span>'}
                        </div>
                        <div>
                            <h4 class="font-ancient text-lg text-red-500">${s.name}</h4>
                            <p class="text-[9px] text-gray-500 mt-1">${s.description}</p>
                        </div>
                    </div>
                    ${c?`<span class="text-[8px] text-red-500 uppercase font-bold">Cần Cấp ${s.level}</span>`:`<button class="px-4 py-2 bg-red-900/20 text-red-400 text-[10px] font-bold rounded-xl border border-red-900/30" onclick="window.game.refineCorpse('${s.id}')">LUYỆN CHẾ</button>`}
                </div>
                <div class="grid grid-cols-2 gap-2">${h}</div>
                <div class="flex justify-between items-center text-[8px] text-gray-500 italic">
                    <span>Tỷ lệ thành công: ${u}%</span>
                    <span>Phản phệ: ${100-u}%</span>
                </div>
            `,i.appendChild(r)})}renderTechniques(i="cultivation"){if(e.player){if(e.activeTechTab=i,this.btnTechTabCultivation&&this.btnTechTabSecret&&this.btnTechTabCustom&&(this.btnTechTabCultivation.className="flex-grow py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all",this.btnTechTabSecret.className="flex-grow py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all",this.btnTechTabCustom.className="flex-grow py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all",i==="cultivation"?this.btnTechTabCultivation.className="flex-grow py-2 bg-qi-blue/20 text-qi-blue border border-qi-blue/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all":i==="secret"?this.btnTechTabSecret.className="flex-grow py-2 bg-qi-purple/20 text-qi-purple border border-qi-purple/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all":i==="custom"&&(this.btnTechTabCustom.className="flex-grow py-2 bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all")),this.elTechListView){if(this.elTechListView.innerHTML="",this.elTechListView.classList.remove("hidden"),this.elTechDetailView&&this.elTechDetailView.classList.add("hidden"),i==="custom"){this.elTechListView.innerHTML=`
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
                `;const n=document.getElementById("custom-tech-submit");n&&(n.onclick=()=>{const s=document.getElementById("custom-tech-name").value,o=document.getElementById("custom-tech-element").value,r=document.getElementById("custom-tech-stat").value,h=document.getElementById("custom-tech-effect").value;if(!s||s.trim()===""){e.ui.toast("Tên công pháp không được để trống!","error");return}const c={};r==="atk"?c.atk=180:r==="hp"?c.hp=600:r==="spd"&&(c.spd=15);const u={};h==="swordDmg"?u.swordDmg=1.15:h==="tvps"?u.tvps=3:h==="lifeSteal"&&(u.lifeSteal=.12),window.game.createCustomTechnique(s,o,c,u)}),this.elTechPoints&&(this.elTechPoints.textContent=e.player.techniquePoints||0);return}const a=i==="secret",l=(e.player.comprehendingTechniques||[]).filter(n=>n.isSecret===a),t=a?e.player.learnedSecretTechniques:e.player.learnedTechniques;if(l.length>0){const n=document.createElement("div");n.className="mb-4 border-b border-white/5 pb-2 mt-2",n.innerHTML=`
                    <div class="flex justify-between items-center">
                        <h3 class="text-[10px] font-ancient text-cultivation-gold uppercase tracking-[0.2em] flex items-center">
                            <i class="ph ph-brain mr-1.5 animate-pulse text-xs"></i>
                            Đang Tham Ngộ Bí Tịch
                        </h3>
                        <span class="text-[8px] bg-cultivation-gold/10 text-cultivation-gold px-1.5 py-0.5 rounded border border-cultivation-gold/20 font-bold uppercase">${l.length} Đang Đọc</span>
                    </div>
                `,this.elTechListView.appendChild(n),l.forEach((s,o)=>{const r=s.isSecret?k(s.id):S(s.id)||(e.player.customTechniques||[]).find(g=>g.id===s.id);if(!r)return;const h=e.player.getTechniqueComprehensionInfo(s.id),c=Math.max(0,s.durationLeft);let u="";if(c>3600){const g=Math.floor(c/3600),y=Math.floor(c%3600/60);u=`${g}h ${y}m`}else if(c>60){const g=Math.floor(c/60),y=Math.floor(c%60);u=`${g}m ${y}s`}else u=`${Math.ceil(c)}s`;const p=o===0,d=a?"bg-qi-purple":"bg-qi-blue",m=p?'<span class="text-[7px] px-1.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/25 rounded font-bold uppercase tracking-wider animate-pulse whitespace-nowrap">Đang Đọc</span>':'<span class="text-[7px] px-1.5 py-0.5 bg-gray-500/10 text-gray-400 border border-gray-500/25 rounded font-bold uppercase tracking-wider whitespace-nowrap">Đang Đợi</span>';let x="";if(p&&s.speedBreakdown){const g=s.speedBreakdown;let y="";g.physique&&g.physique!==1&&(y=`
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">🦴</span> Thể Chất:</span>
                                    <span class="text-green-400 font-mono font-bold">${g.physiqueText||"Phù Hợp"} (${g.physique.toFixed(2)}x)</span>
                                </div>
                            `);let $="";g.meridian&&g.meridian!==1&&($=`
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">🕸️</span> Kinh Mạch:</span>
                                    <span class="${g.meridian<1?"text-red-400":"text-green-400"} font-mono font-bold">${g.meridianText||"Khơi Thông"} (${g.meridian.toFixed(2)}x)</span>
                                </div>
                            `);let C="";g.bloodline&&g.bloodline!==1&&(C=`
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">🩸</span> Huyết Mạch:</span>
                                    <span class="text-green-400 font-mono font-bold">${g.bloodlineText||"Huyết Trạch"} (${g.bloodline.toFixed(2)}x)</span>
                                </div>
                            `),x=`
                            <div class="mt-2 p-2 bg-black/20 border border-white/5 rounded-xl space-y-1 text-[8px] text-gray-400">
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">🧠</span> Ngộ Tính:</span>
                                    <span class="text-white font-mono font-bold">${g.savvy.toFixed(2)}x</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">💧</span> Linh Căn:</span>
                                    <span class="${g.root<1?"text-red-400":"text-green-400"} font-mono font-bold">${g.rootText||"Bình thường"} (${g.root.toFixed(2)}x)</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">👁️</span> Thần Thức:</span>
                                    <span class="text-white font-mono font-bold">${g.soul.toFixed(2)}x</span>
                                </div>
                                ${y}
                                ${$}
                                ${C}
                            </div>
                        `}const v=document.createElement("div");v.className=`p-4 border ${p?"border-cultivation-gold/30 bg-cultivation-gold/[0.02]":"border-white/5 bg-white/[0.01] opacity-70"} rounded-2xl mb-4 space-y-3 relative overflow-hidden`,p&&v.classList.add("shadow-[0_0_15px_rgba(217,119,6,0.05)]"),v.innerHTML=`
                        <div class="flex justify-between items-start">
                            <div class="flex items-center space-x-3">
                                <div class="text-2xl">${r.icon||(a?"✨":"📜")}</div>
                                <div>
                                    <h4 class="text-sm font-bold text-white font-ancient flex items-center">
                                        ${r.name}
                                        <span class="ml-2 text-[7px] px-1.5 py-0.2 bg-white/5 rounded text-gray-400 font-mono font-normal">${r.quality||"Hoàng Giai"}</span>
                                    </h4>
                                    <p class="text-[8px] text-gray-500 mt-0.5">Độ khó: <span class="font-bold text-cultivation-gold">${h.difficultyName}</span> | Còn lại: <span class="font-mono text-white">${u}</span></p>
                                </div>
                            </div>
                            ${m}
                        </div>
                        <div class="space-y-1">
                            <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                                <div class="h-full ${d} transition-all duration-300" style="width: ${s.progress}%"></div>
                            </div>
                            <div class="flex justify-between items-center text-[8px] text-gray-500">
                                <span>Tiến độ: ${s.progress}%</span>
                                ${p?`<span class="italic text-qi-blue font-bold">Tốc độ: ${(s.speedMult||1).toFixed(2)}x</span>`:""}
                            </div>
                            ${x}
                        </div>
                    `,this.elTechListView.appendChild(v)})}if(t.length===0)l.length===0&&(this.elTechListView.innerHTML=`<div class="text-center py-20 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ ${i==="cultivation"?"công pháp":"bí pháp"} nào...</div>`);else{if(l.length>0){const n=document.createElement("div");n.className="mb-4 border-b border-white/5 pb-2 mt-6",n.innerHTML=`
                        <h3 class="text-[10px] font-ancient text-gray-500 uppercase tracking-[0.2em] flex items-center">
                            <i class="ph ph-scroll mr-1.5 text-xs"></i>
                            Công Pháp Đã Lĩnh Ngộ
                        </h3>
                    `,this.elTechListView.appendChild(n)}t.forEach(n=>{const s=i==="cultivation"?S(n.id)||(e.player.customTechniques||[]).find(u=>u.id===n.id):k(n.id);if(!s)return;const o=L.find(u=>u.id===(n.masteryLevel||1)),r=s.stageLabel||"Tầng",h=s.stageNames&&s.stageNames[n.stage-1]?s.stageNames[n.stage-1]:`${r} ${n.stage||1}`,c=document.createElement("div");c.className=`p-4 border ${i==="cultivation"?"border-qi-blue/10 bg-qi-blue/5":"border-qi-purple/10 bg-qi-purple/5"} rounded-2xl flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all mb-3`,c.innerHTML=`
                        <div class="flex items-center space-x-4">
                            <div class="text-2xl">${s.icon||(i==="cultivation"?"📜":"✨")}</div>
                            <div>
                                <h4 class="text-sm font-bold text-white">${s.name}</h4>
                                <div class="flex items-center space-x-2 mt-1">
                                    <span class="text-[8px] px-1.5 py-0.5 bg-black/40 rounded border border-white/5 text-gray-400 font-mono">${h}</span>
                                    <span class="text-[8px] text-cultivation-gold font-bold">${(o==null?void 0:o.name)||"Nhập Môn"}</span>
                                </div>
                            </div>
                        </div>
                        <i class="ph ph-caret-right text-gray-600"></i>
                    `,c.onclick=()=>this.renderTechniqueDetail(n.id,i==="secret"),this.elTechListView.appendChild(c)})}}this.elTechPoints&&(this.elTechPoints.textContent=e.player.techniquePoints||0)}}renderTechniqueDetail(i,a){if(!this.elTechDetailContent)return;const l=a?e.player.learnedSecretTechniques.find(d=>d.id===i):e.player.learnedTechniques.find(d=>d.id===i),t=a?k(i):S(i)||(e.player.customTechniques||[]).find(d=>d.id===i);if(!l||!t)return;this.elTechListView.classList.add("hidden"),this.elTechDetailView.classList.remove("hidden");const n=L.findIndex(d=>d.id===(l.masteryLevel||1)),s=L[n],o=L[n+1],r=t.stageLabel||"Tầng",h=t.stageNames&&t.stageNames[l.stage-1]?t.stageNames[l.stage-1]:`${r} ${l.stage||1}`,c=l.masteryLevel>=4&&l.stage<(t.maxStage||10),u=!a&&(e.player.mainTechniqueId===i||e.player.mainBodyTechniqueId===i||e.player.mainSoulTechniqueId===i);let p="";a||(u?p=`
                    <button class="w-full py-4 bg-cultivation-gold/15 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-2xl cursor-default opacity-80" disabled>
                        <i class="ph ph-check-circle mr-1"></i> ĐANG CHỦ TU
                    </button>
                `:p=`
                    <button class="w-full py-4 bg-cultivation-gold text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" onclick="window.game.setMainTechnique('${i}')">
                        <i class="ph ph-shield-star mr-1"></i> THIẾT LẬP CHỦ TU
                    </button>
                `),this.elTechDetailContent.innerHTML=`
            <div class="flex flex-col items-center text-center space-y-4">
                <div class="text-6xl p-6 bg-white/5 rounded-full border border-white/10">${t.icon||"📜"}</div>
                <div>
                    <h3 class="text-2xl font-ancient text-white">${t.name}</h3>
                    <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">${t.quality||"Phàm Khí"}${(t.quality||"Phàm Khí").toLowerCase().includes("khí")||(t.quality||"Phàm Khí").toLowerCase().includes("bảo")||(t.quality||"Phàm Khí").toLowerCase().includes("phẩm")||(t.quality||"Phàm Khí").toLowerCase().includes("giai")||(t.quality||"Phàm Khí").toLowerCase().includes("hỏa")||(t.quality||"Phàm Khí").toLowerCase().includes("lôi")||["Hoàn Mỹ","Tiên Khí","Linh Bảo","Danh Khí"].includes(t.quality||"Phàm Khí")?"":" Phẩm"} | ${h}</p>
                </div>
            </div>

            <div class="bg-black/40 p-5 rounded-3xl border border-white/5 space-y-4">
                <div class="flex justify-between items-end mb-1">
                    <span class="text-[9px] text-gray-500 uppercase tracking-widest">Độ Thuần Thục: ${(s==null?void 0:s.name)||"Nhập Môn"}</span>
                    <span class="text-[10px] font-mono text-white">${l.mastery} / ${(o==null?void 0:o.threshold)||"MAX"}</span>
                </div>
                <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-cultivation-gold" style="width: ${l.masteryLevel>=4?100:l.mastery/((o==null?void 0:o.threshold)||1)*100}%"></div>
                </div>
                
                <div class="grid grid-cols-2 gap-3 mt-6">
                    <button class="py-4 bg-qi-blue text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" onclick="window.game.cultivateTechnique('${i}', ${a})">TU LUYỆN</button>
                    <button class="py-4 ${c?"bg-cultivation-gold":"bg-gray-800 opacity-50"} text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" 
                        onclick="window.game.breakthroughTechnique('${i}', ${a})">ĐỘT PHÁ TẦNG</button>
                </div>
                ${p?`<div class="mt-3">${p}</div>`:""}
            </div>

            <div class="space-y-4">
                <h4 class="text-xs font-ancient text-gray-500 uppercase tracking-widest border-l-2 border-gray-500 pl-3">Mô tả & Hiệu ứng</h4>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs text-gray-400 leading-relaxed">
                    ${t.description||"Không có mô tả."}
                </div>
            </div>
        `}}export{re as SystemsScreen};
