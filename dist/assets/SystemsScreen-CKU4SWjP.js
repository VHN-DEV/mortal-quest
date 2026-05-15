import{s as e,m as L,n as q,o as $,p as A,d as x,e as f,F as E,q as S,r as _,t as T,u as P,G as j,v as R,w as G,x as F,f as U,A as D,S as O,b as V,a as K,y as I,z as Y,B as Q,C as W,E as C,T as z,H as k,I as g,J as M,K as J,L as X,N as Z,k as H,O as B,j as w}from"./index-CSCC3EfR.js";import"./vendor-capacitor-DNzPfH2b.js";import"./vendor-gsap-CzGW6FVa.js";const ee=[{floor:1,name:"Ngoại Tháp - Tầng 1",description:"Nơi tập trung các luyện dược sư trẻ tuổi tài năng.",minAlchemyLevel:3,rewards:{expMult:1.2}},{floor:2,name:"Nội Tháp - Tầng 2",description:"Chỉ dành cho những người có thần thức mạnh mẽ.",minAlchemyLevel:5,rewards:{expMult:1.5,qualityBonus:.1}},{floor:3,name:"Thánh Đan Điện",description:"Nơi cư ngụ của các bậc Đan Thánh.",minAlchemyLevel:7,rewards:{expMult:2,qualityBonus:.25}}];class ae{constructor(){this.shopSubFilter="all",this.initElements(),this.initEvents()}initElements(){this.btnAlchemyTabRecipes=document.getElementById("alchemy-tab-recipes"),this.btnAlchemyTabGarden=document.getElementById("alchemy-tab-garden"),this.viewAlchemyRecipes=document.getElementById("alchemy-recipes-view"),this.viewAlchemyGarden=document.getElementById("alchemy-garden-view"),this.elAlchemyLvlText=document.getElementById("alchemy-level-text"),this.elAlchemyExpBar=document.getElementById("alchemy-exp-bar"),this.elGardenPlots=document.getElementById("garden-plots"),this.elShopLingShi=document.getElementById("shop-ling-shi"),this.elShopBuyView=document.getElementById("shop-buy-view"),this.elShopSellView=document.getElementById("shop-sell-view"),this.elShopSellGrid=document.getElementById("shop-sell-grid"),this.elShopSectionNav=document.getElementById("shop-section-nav"),this.elShopSubFilterNav=document.getElementById("shop-subfilter-nav"),this.btnShopTabBuy=document.getElementById("shop-tab-buy"),this.btnShopTabSell=document.getElementById("shop-tab-sell"),this.elGuildCerts=document.getElementById("guild-cert-list"),this.elTechListView=document.getElementById("tech-list-view"),this.elTechDetailView=document.getElementById("tech-detail-view"),this.elTechDetailContent=document.getElementById("tech-detail-content"),this.elTechPoints=document.getElementById("tech-points"),this.btnTechTabCultivation=document.getElementById("tech-tab-cultivation"),this.btnTechTabSecret=document.getElementById("tech-tab-secret"),this.btnTechBack=document.getElementById("tech-back-btn"),this.elGuildMissions=document.getElementById("guild-mission-list"),this.elGuildRooms=document.getElementById("guild-room-list"),this.elTowerFloors=document.getElementById("tower-floor-list"),this.elSectsView=document.getElementById("sects-view")}initEvents(){this.btnAlchemyTabRecipes&&(this.btnAlchemyTabRecipes.onclick=()=>{e.views.alchemy="recipes",this.renderAlchemy()}),this.btnAlchemyTabGarden&&(this.btnAlchemyTabGarden.onclick=()=>{e.views.alchemy="garden",this.renderAlchemy()}),this.btnShopTabBuy&&(this.btnShopTabBuy.onclick=()=>{e.views.shop="buy",this.renderShop()}),this.btnShopTabSell&&(this.btnShopTabSell.onclick=()=>{e.views.shop="sell",this.renderShop()}),this.btnTechTabCultivation&&(this.btnTechTabCultivation.onclick=()=>this.renderTechniques("cultivation")),this.btnTechTabSecret&&(this.btnTechTabSecret.onclick=()=>this.renderTechniques("secret")),this.btnTechBack&&(this.btnTechBack.onclick=()=>{this.elTechListView.classList.remove("hidden"),this.elTechDetailView.classList.add("hidden")})}renderAlchemy(){if(!e.player)return;const n=document.getElementById("alchemy-tools-container");e.views.alchemy==="recipes"?(this.viewAlchemyRecipes.classList.remove("hidden"),this.viewAlchemyGarden.classList.add("hidden"),n&&n.classList.remove("hidden"),this.btnAlchemyTabRecipes&&(this.btnAlchemyTabRecipes.className="flex-grow py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all"),this.btnAlchemyTabGarden&&(this.btnAlchemyTabGarden.className="flex-grow py-3 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all")):(this.viewAlchemyRecipes.classList.add("hidden"),this.viewAlchemyGarden.classList.remove("hidden"),n&&n.classList.add("hidden"),this.btnAlchemyTabRecipes&&(this.btnAlchemyTabRecipes.className="flex-grow py-3 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all"),this.btnAlchemyTabGarden&&(this.btnAlchemyTabGarden.className="flex-grow py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all"));const i=L(e.player.alchemyLevel);this.elAlchemyLvlText.textContent=i.name;const s=e.player.alchemyLevel*100*Math.pow(1.5,e.player.alchemyLevel-1);this.elAlchemyExpBar.style.width=`${e.player.alchemyExp/s*100}%`,e.views.alchemy==="recipes"?this.renderRecipes():this.renderGarden();const t=document.getElementById("alchemy-cauldron-name"),r=document.getElementById("alchemy-flame-name");if(t){const a=q(e.player.currentCauldron);a?t.innerHTML=`<span class="text-white">${a.name}</span>`:t.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`}if(r){const a=$(e.player.currentFlame);a?r.innerHTML=`<span class="text-white">${a.name}</span>`:r.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`}}renderRecipes(){this.viewAlchemyRecipes.innerHTML="";const n=A.filter(i=>e.player.knownRecipes.includes(i.id));if(n.length===0){this.viewAlchemyRecipes.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được đan phương nào...</div>';return}n.forEach(i=>{const s=x(i.resultId);if(!s)return;const t=this.getQualityClass(s.quality),r=document.createElement("div");r.className="p-4 border border-gray-800 rounded-2xl bg-white/5 space-y-3";let a="";i.materials.forEach(o=>{const c=x(o.id);if(!c)return;const h=e.player.inventory.items.find(d=>d.id===o.id),p=h?h.quantity:0,u=p>=o.quantity;a+=`<div class="text-[10px] ${u?"text-gray-400":"text-red-500"}">${c.name}: ${p}/${o.quantity}</div>`});const l=e.player.alchemyLevel<i.level;r.innerHTML=`
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <span class="text-xl mr-2">${s.image?`<img src="${f(s.image)}" class="w-6 h-6 object-contain inline-block">`:s.icon||""}</span>
                        <span class="font-bold quality-${t} font-ancient">${s.name}</span>
                    </div>
                    ${l?`<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${i.level}</span>`:`<button class="px-4 py-2 btn-gold text-[10px] font-bold rounded-lg" onclick="window.game.craft('${i.id}')">LUYỆN CHẾ</button>`}
                </div>
                <div class="grid grid-cols-2 gap-1">${a}</div>
                <div class="text-[9px] text-gray-500 italic">${i.description}</div>
            `,this.viewAlchemyRecipes.appendChild(r)})}renderGarden(){this.elGardenPlots.innerHTML="",e.player.gardenPlots.forEach((n,i)=>{const s=document.createElement("div"),t=E[n.grade]||E.PHAM,r=S[n.attribute]||S.NORMAL;s.className="p-4 border rounded-3xl bg-white/5 flex flex-col space-y-4 transition-all hover:border-qi-jade/30 border-white/5 relative overflow-hidden";const a=document.createElement("div");a.className="absolute -right-2 -bottom-2 text-4xl opacity-5 pointer-events-none",a.textContent=r.icon,s.appendChild(a);let l=`
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center space-x-2">
                            <span class="text-[9px] px-2 py-0.5 rounded-full border bg-white/5 text-gray-400 border-white/10 uppercase font-bold">${t.name}</span>
                            <span class="text-[9px] px-2 py-0.5 rounded-full border bg-white/5 text-[${r.color}] border-white/10 uppercase font-bold" style="color: ${r.color}">${r.icon} ${r.name}</span>
                        </div>
                    </div>
                    <button class="p-1.5 hover:bg-white/10 rounded-full transition-colors" onclick="window.game.showFieldMenu(${i})">
                        <i class="ph ph-gear text-gray-500 text-xs"></i>
                    </button>
                </div>
            `;if(n.seedId){const o=_.find(h=>h.id===n.seedId),c=x(o.herbId);l+=`
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/10">
                            ${(c==null?void 0:c.icon)||"🌱"}
                        </div>
                        <div class="flex-grow">
                            <h4 class="text-xs font-ancient text-white">${o.name}</h4>
                            <div class="flex items-center space-x-2 mt-1">
                                <span class="text-[10px] text-qi-jade font-bold">${n.stage}</span>
                                <span class="text-[9px] text-gray-500">(${Math.floor(n.age)} năm)</span>
                            </div>
                        </div>
                        <button class="px-4 py-2 bg-qi-jade/10 text-qi-jade text-[10px] font-bold rounded-xl border border-qi-jade/20 active:scale-95 transition-all" onclick="window.game.harvest(${i})">THU HOẠCH</button>
                    </div>
                `}else l+=`
                    <div class="flex flex-col items-center justify-center py-4 space-y-3">
                        <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                            <i class="ph ph-plus text-gray-600"></i>
                        </div>
                        <button class="px-6 py-2 bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] font-bold rounded-xl border border-white/10 transition-all" onclick="window.game.showPlantMenu(${i})">GIEO HẠT</button>
                    </div>
                `;s.innerHTML+=l,this.elGardenPlots.appendChild(s)})}renderShop(){if(!e.player)return;this.elShopLingShi.innerHTML=e.player.getFormattedLingShi();const n=document.getElementById("shop-vip-level");n&&(n.textContent=`VIP ${e.player.vipLevel}`,n.className=`px-2 py-0.5 rounded bg-gray-800 text-[8px] font-bold text-gray-400 border border-white/5 bg-vip-${e.player.vipLevel}`);const i=document.getElementById("shop-overlay-title");if(i&&e.systems.shop){const s=T[e.systems.shop.currentShopId];s&&(i.textContent=s.name.split(" - ")[0])}this.renderShopSections(),this.renderShopSubFilters(),this.btnShopTabBuy&&this.btnShopTabSell&&(e.views.shop==="buy"?(this.btnShopTabBuy.className="flex-grow py-3 text-cultivation-gold border-b-2 border-cultivation-gold text-xs",this.btnShopTabSell.className="flex-grow py-3 text-gray-500 border-b-2 border-transparent text-xs"):(this.btnShopTabBuy.className="flex-grow py-3 text-gray-500 border-b-2 border-transparent text-xs",this.btnShopTabSell.className="flex-grow py-3 text-cultivation-gold border-b-2 border-cultivation-gold text-xs")),e.views.shop==="buy"?(this.elShopBuyView.classList.remove("hidden"),this.elShopSellView.classList.add("hidden"),this.renderShopBuy()):(this.elShopBuyView.classList.add("hidden"),this.elShopSellView.classList.remove("hidden"),this.renderShopSell())}renderShopSections(){if(!this.elShopSectionNav)return;const n=e.systems.shop,i=T[n.currentShopId],s=Object.keys(i.sections),t=this.elShopSectionNav.querySelectorAll("button"),r={dan_duoc:"Đan Dược",phap_bao:"Pháp Bảo",nguyen_lieu:"Nguyên Liệu",cong_phap:"Bí Tịch",tran_phap:"Trận Pháp",phu_luc:"Phù Lục",luyen_khi:"Luyện Khí",linh_dien:"Linh Điền",ky_trung:"Kỳ Trùng"};(t.length!==s.length||this.elShopSectionNav.dataset.shopId!==n.currentShopId)&&(this.elShopSectionNav.innerHTML="",this.elShopSectionNav.dataset.shopId=n.currentShopId,s.filter(a=>a!=="bi_tich").forEach(a=>{const l=document.createElement("button");l.dataset.section=a,l.onclick=()=>{e.systems.shop&&(e.systems.shop.currentSection=a,this.shopSubFilter="all",this.renderShop())},this.elShopSectionNav.appendChild(l)})),this.elShopSectionNav.querySelectorAll("button").forEach(a=>{const l=a.dataset.section,o=n.currentSection===l;a.className=`px-4 py-2 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${o?"bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/30":"text-gray-500 border border-transparent"}`,a.textContent=r[l]||l})}renderShopSubFilters(){if(!this.elShopSubFilterNav)return;const n=e.systems.shop;if(!n)return;const i=n.currentSection;let s=[];if(i==="phap_bao"?s=[{id:"all",name:"Tất Cả"},{id:"weapon",name:"Linh Khí"},{id:"armor",name:"Pháp Y"},{id:"accessory",name:"Trang Sức"},{id:"attackArtifact",name:"Chủ Chiến"},{id:"defenseArtifact",name:"Hộ Thân"},{id:"flightArtifact",name:"Phi Hành"},{id:"spaceArtifact",name:"Càn Khôn"},{id:"formationArtifact",name:"Trận Đạo"},{id:"supportArtifact",name:"Phụ Trợ"},{id:"soulArtifact",name:"Hồn Đạo"}]:i==="cong_phap"&&(s=[{id:"all",name:"Tất Cả"},{id:"cultivation",name:"Công Pháp"},{id:"manual",name:"Bí Tịch"}]),s.length===0){this.elShopSubFilterNav.classList.add("hidden"),this.elShopSubFilterNav.innerHTML="";return}this.elShopSubFilterNav.classList.remove("hidden"),this.elShopSubFilterNav.innerHTML="",s.forEach(t=>{const r=document.createElement("button"),a=this.shopSubFilter===t.id;r.className=`px-3 py-1.5 rounded-lg text-[9px] font-ancient uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${a?"bg-qi-blue/20 text-qi-blue border border-qi-blue/30":"text-gray-500 border border-transparent"}`,r.textContent=t.name,r.onclick=()=>{this.shopSubFilter=t.id,this.renderShop()},this.elShopSubFilterNav.appendChild(r)})}renderShopBuy(){const n=e.systems.shop;let i=n.getShopInventory();if(n.currentSection==="cong_phap"){const s=T[n.currentShopId];s.sections.bi_tich&&(i=[...i,...s.sections.bi_tich])}this.elShopBuyView.innerHTML="",i.forEach(s=>{var p;const t=x(s.id);if(!t)return;if(this.shopSubFilter!=="all"){if(n.currentSection==="phap_bao"){if(t.type!==this.shopSubFilter)return}else if(n.currentSection==="cong_phap"){const u=t.action&&(t.action.startsWith("open_")||t.action.includes("linh_the_luc")||((p=t.effect)==null?void 0:p.type)==="unlock_profession"),d=(t.type==="book"||t.type==="technique")&&!u,m=t.type==="recipe"||t.type==="talisman_recipe"||u;if(this.shopSubFilter==="cultivation"&&!d||this.shopSubFilter==="manual"&&!m)return}}const r=this.getQualityClass(t.quality),a=document.createElement("div");a.className=`flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-xl hover:border-${r} cursor-pointer transition-all`,a.onclick=()=>{window.game.screens.inventory&&window.game.screens.inventory.selectItem(s.id,!0)};const l=document.createElement("div");l.className="flex items-center space-x-3",l.innerHTML=`
                <div class="text-2xl bg-black/60 p-2 rounded-lg border border-${r}/30">${t.image?`<img src="${f(t.image)}" class="w-8 h-8 object-contain">`:t.icon||""}</div>
                <div>
                    <div class="text-sm font-bold text-white">${t.name}</div>
                    <div class="text-[9px] font-bold quality-${r}">${t.quality}${t.quality.toLowerCase().includes("phẩm")||["Hoàn Mỹ","Truyền Thuyết","Thần Thoại"].includes(t.quality)?"":" phẩm"} | Kho: ${s.stock}</div>
                </div>
            `;const o=Math.floor(t.price*(1-Math.min(.25,e.player.vipLevel*.05))),c=document.createElement("div");c.className="flex items-center space-x-3",c.innerHTML=`
                <div class="text-right">
                    <div class="text-[8px] text-gray-500 line-through">${t.price} LT</div>
                    <div class="text-xs font-mono text-cultivation-gold">${o} LT</div>
                </div>
            `;const h=document.createElement("button");h.className=`px-4 py-2 btn-gold text-[10px] font-bold rounded-lg ${s.stock<=0?"opacity-50 grayscale pointer-events-none":""}`,h.innerHTML='<i class="ph ph-shopping-cart-simple mr-1"></i>TRAO ĐỔI',h.onclick=u=>{u.stopPropagation(),window.game.buyItem(s.id)},c.appendChild(h),a.appendChild(l),a.appendChild(c),this.elShopBuyView.appendChild(a)})}renderShopSell(){if(this.elShopSellGrid.innerHTML="",!e.player||!e.player.inventory)return;const n=e.systems.shop.currentSection,i=this.shopSubFilter;e.player.inventory.items.forEach(s=>{var c;const t=x(s.id);if(!t)return;const r={dan_duoc:["consumable"],phap_bao:["weapon","armor","accessory","treasure","head","necklace","shoes","attackArtifact","defenseArtifact","flightArtifact","spaceArtifact","formationArtifact","supportArtifact","soulArtifact"],nguyen_lieu:["material","herb","ore","wood"],cong_phap:["book","technique","recipe","talisman_recipe","consumable"],tran_phap:["formation"],phu_luc:["talisman"],luyen_khi:["material","smithing_tool"]};if(n&&r[n]){if(!r[n].includes(t.type))return;if(n==="cong_phap"){const h=t.action&&(t.action.startsWith("open_")||t.action.includes("linh_the_luc")),p=(t.type==="book"||t.type==="technique")&&!h,u=t.type==="recipe"||t.type==="talisman_recipe"||t.type==="consumable"&&((c=t.effect)==null?void 0:c.type)==="unlock_profession"||h;if(i==="cultivation"&&!p||i==="manual"&&p||i==="manual"&&!u&&!p||i==="all"&&!p&&!u)return}if(n==="phap_bao"&&i!=="all"&&t.type!==i)return}const a=this.getQualityClass(t.quality);let l=.5;["material","herb","ore","wood"].includes(t.type)&&(l=.3);const o=document.createElement("div");o.className=`p-2 border border-gray-800 rounded-lg bg-black/20 flex flex-col items-center cursor-pointer hover:border-${a} transition-all active:scale-95`,o.innerHTML=`
                <div class="text-2xl mb-1">${t.image?`<img src="${f(t.image)}" class="w-8 h-8 object-contain">`:t.icon||""}</div>
                <div class="text-[9px] text-gray-400">x${s.quantity}</div>
                <div class="text-[8px] text-cultivation-gold mt-1">${Math.floor(t.price*l)} LT</div>
            `,o.onclick=()=>{window.game.screens.inventory&&window.game.screens.inventory.selectItem(s.id,!1,!0)},this.elShopSellGrid.appendChild(o)})}renderGuild(){e.player&&(this.elGuildCerts.innerHTML="",this.elGuildMissions=document.getElementById("guild-mission-list"),this.elGuildRooms=document.getElementById("guild-room-list"),P.forEach(n=>{var t;const i=e.player.alchemyLevel<n.requirements.alchemyLevel,s=document.createElement("div");s.className="p-4 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center",s.innerHTML=`
                <div>
                    <h4 class="text-sm font-ancient text-white">${n.name}</h4>
                    <p class="text-[10px] text-gray-500">Phí: ${n.requirements.fee} LT | Cần luyện: ${n.task.quantity} ${((t=x(n.task.targetId))==null?void 0:t.name)||"đan dược"}</p>
                </div>
                <button class="px-4 py-2 bg-qi-blue text-black text-[10px] font-bold rounded-lg ${i?"opacity-50":""}" 
                    onclick="window.game.guildCertify(${n.level})">KHẢO HẠCH</button>
            `,this.elGuildCerts.appendChild(s)}),this.elGuildMissions&&(this.elGuildMissions.innerHTML="",j.forEach(n=>{const i=document.createElement("div");i.className="p-4 border border-white/5 rounded-xl bg-white/5 space-y-2",i.innerHTML=`
                    <div class="flex justify-between items-center">
                        <h4 class="text-sm font-ancient text-white">${n.name}</h4>
                        <button class="px-3 py-1 bg-qi-purple text-white text-[10px] font-bold rounded-lg" 
                            onclick="window.game.guildMission('${n.id}')">GIAO NỘP</button>
                    </div>
                    <p class="text-[10px] text-gray-400 italic">${n.description}</p>
                    <p class="text-[9px] text-cultivation-gold">Thưởng: ${n.rewards.lingShi} LT | Danh vọng: ${n.rewards.reputation}</p>
                `,this.elGuildMissions.appendChild(i)})),this.elGuildRooms&&(this.elGuildRooms.innerHTML="",R.forEach(n=>{const i=e.player.currentAlchemyRoom===n.id,s=document.createElement("div");s.className=`p-4 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center ${i?"border-cultivation-gold":""}`,s.innerHTML=`
                    <div>
                        <h4 class="text-sm font-ancient text-white">${n.name} ${i?"⭐":""}</h4>
                        <p class="text-[10px] text-gray-500">Phí thuê: ${n.fee} LT | Tăng ${n.successBonus*100}% thành công</p>
                    </div>
                    <button class="px-4 py-2 ${i?"bg-gray-800":"bg-cultivation-gold"} text-black text-[10px] font-bold rounded-lg" 
                        onclick="window.game.guildRent('${n.id}')">${i?"ĐANG THUÊ":"THUÊ"}</button>
                `,this.elGuildRooms.appendChild(s)})))}renderTower(){const n=document.getElementById("tower-floor-list");n&&(n.innerHTML="",ee.forEach(i=>{const s=e.player.alchemyLevel<i.minAlchemyLevel,t=document.createElement("div");t.className=`p-6 border border-white/5 rounded-2xl bg-white/5 space-y-3 ${s?"opacity-40":"hover:border-cultivation-gold/50 cursor-pointer"}`,t.innerHTML=`
                <div class="flex justify-between items-center">
                    <h4 class="text-lg font-ancient text-cultivation-gold">${i.name}</h4>
                    ${s?`<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${i.minAlchemyLevel}</span>`:'<i class="ph ph-caret-right text-gray-500"></i>'}
                </div>
                <p class="text-xs text-gray-400">${i.description}</p>
            `,s||(t.onclick=()=>e.ui.toast(`Đang tiến vào ${i.name}...`,"success")),n.appendChild(t)}))}renderMountain(){const n=document.getElementById("mountain-layer-name"),i=document.getElementById("mountain-layer-desc"),s=document.getElementById("mountain-layer-progress-text"),t=document.getElementById("mountain-layer-progress-bar"),r=document.getElementById("mountain-oxygen-text"),a=document.getElementById("mountain-oxygen-bar"),l=document.getElementById("mountain-toxicity-text"),o=document.getElementById("mountain-toxicity-bar");if(document.getElementById("mountain-event-log"),!e.player.mountainSurvival)return;const c=e.systems.mountain,h=G.find(m=>m.id===c.currentLayer),p=F.find(m=>m.id===h.tier);if(n){const m={ngoai_son:"text-green-400",trung_son:"text-blue-400",noi_son:"text-purple-400",cam_khu:"text-red-500"}[h.tier]||"text-red-400";n.innerHTML=`<span class="text-[10px] block opacity-60 uppercase tracking-tighter">${p.name}</span>${h.name}`,n.className=`text-2xl font-ancient ${m} mb-1`}i&&(i.textContent=h.description);const u=c.discovery[c.currentLayer]||0;s&&(s.textContent=`${Math.floor(c.layerProgress)}% (Khám phá: ${Math.floor(u)}%)`),t&&(t.style.width=`${c.layerProgress}%`),r&&(r.textContent=`${Math.ceil(e.player.mountainSurvival.oxygen)}%`),a&&(a.style.width=`${e.player.mountainSurvival.oxygen}%`),l&&(l.textContent=`${Math.ceil(e.player.mountainSurvival.toxicity)}%`),o&&(o.style.width=`${e.player.mountainSurvival.toxicity}%`);const d=document.getElementById("btn-mountain-deeper");if(d){const m=c.bossDefeated[h.tier];c.layerProgress>=100&&!m?d.innerHTML='<span class="relative z-10 text-xs font-bold text-red-500 uppercase tracking-[0.2em] animate-pulse">KHIÊU CHIẾN THỦ LĨNH</span>':d.innerHTML='<span class="relative z-10 text-xs font-bold text-red-400 uppercase tracking-[0.2em]">TẦNG KẾ TIẾP</span>'}e.player.hp<=0&&(e.systems.mountain.stop(),e.ui.toggleOverlay(document.getElementById("mountain-overlay"),!1))}renderSects(){const n=document.getElementById("sects-view");if(n)if(n.innerHTML="",e.player.sectId){const i=U(e.player.sectId);n.innerHTML=`
                <div class="bg-white/5 rounded-2xl border border-qi-blue/30 overflow-hidden">
                    <div class="h-32 relative">
                        <img src="${i.portrait||D.backgrounds.sect}" class="w-full h-full object-cover opacity-40">
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
            `}else Object.values(O).forEach(i=>{const s=e.player.realmId>=i.minRealm,t=document.createElement("div");t.className=`p-4 border rounded-xl bg-black/40 space-y-3 ${s?"border-gray-800":"opacity-50 grayscale"}`,t.innerHTML=`
                    <div class="flex justify-between items-center">
                        <h3 class="text-xl font-ancient text-white">${i.name}</h3>
                        <span class="text-[10px] ${s?"text-qi-blue":"text-red-500"}">${s?"Có thể bái nhập":"Cần: "+V(i.minRealm).name}</span>
                    </div>
                    <p class="text-xs text-gray-500">${i.description}</p>
                    <button class="w-full py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-xl flex items-center justify-center ${s?"":"hidden"}" onclick="window.game.joinSect('${i.id}')">
                        <i class="ph ph-identification-badge mr-2"></i>BÁI NHẬP TÔNG MÔN
                    </button>
                `,n.appendChild(t)})}renderEnergy(){if(!e.player)return;const n=document.getElementById("env-energy-list"),i=document.getElementById("env-purity-tag");if(n&&e.currentLocId){const t=K(e.currentWorldId,e.currentLocId);if(t&&t.energies){if(i&&t.energies.length>0){const r=t.energies[0].purity||"TINH_THUAN",a=e.systems.energy.getPurity(r);i.textContent=a.name}n.innerHTML=t.energies.map(r=>{const a=e.systems.energy.getEnergyType(r.type);return`
                        <div class="flex flex-col items-center space-y-1">
                            <span class="text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">${a.icon}</span>
                            <div class="flex flex-col items-center">
                                <span class="text-[9px] text-white font-mono font-bold">${r.concentration}%</span>
                                <span class="text-[7px] text-gray-500 font-ancient uppercase tracking-widest">${a.name}</span>
                            </div>
                        </div>
                    `}).join("")}else n.innerHTML=""}const s=document.getElementById("char-energy-list");if(s){const t=Object.entries(e.player.qiAccumulated).filter(([r,a])=>a.amount>0);t.length===0?s.innerHTML='<div class="text-[9px] text-gray-600 italic">Chưa có khí tức tích lũy</div>':s.innerHTML=t.map(([r,a])=>{const l=e.systems.energy.getEnergyType(r),o=e.systems.energy.getPurity(a.purity),c=Math.log10(a.amount+1);return`
                        <div class="p-2 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <span class="text-sm">${l.icon}</span>
                                <div>
                                    <div class="text-[9px] font-bold text-white font-ancient">${l.name}</div>
                                    <div class="text-[7px] text-qi-blue uppercase">${o.name}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-[8px] font-mono text-gray-400">${Math.floor(a.amount).toLocaleString()} Qi</div>
                                <div class="text-[7px] text-cultivation-gold">+${(c*10).toFixed(1)} Bonus</div>
                            </div>
                        </div>
                    `}).join("")}}getQualityClass(n){return{Phàm:"pham",Hoàng:"hoang",Huyền:"huyen",Địa:"dia",Thiên:"thien",Tiên:"tien",Thần:"than","Tàn Khuyết":"pham",Thường:"hoang","Tinh Phẩm":"huyen","Hoàn Mỹ":"dia","Cực Phẩm":"thien","Truyền Thuyết":"tien","Thần Thoại":"than"}[n]||"pham"}renderSmithing(){const n=document.getElementById("smithing-recipes");if(!n)return;n.innerHTML="";const i=document.getElementById("smithing-tool-name"),s=document.getElementById("smithing-flame-name");if(i){const l=e.player.smithingTool?x(e.player.smithingTool):null;l?i.innerHTML=`<span class="text-white">${l.name}</span>`:i.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'luyen_khi')" class="ml-2 text-[8px] text-red-400 underline hover:text-white transition-colors">MUA NGAY</button>`}if(s){const l=$(e.player.currentFlame);l?s.innerHTML=`<span class="text-white">${l.name}</span>`:s.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-red-400 underline hover:text-white transition-colors">MUA NGAY</button>`}const t=I(e.player.smithingLevel),r=document.getElementById("smithing-level-text");r&&(r.textContent=t.name);const a=Object.values(Y).filter(l=>e.player.knownSmithingRecipes.includes(l.id));if(a.length===0){n.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được bản vẽ nào...</div>';return}a.forEach(l=>{const o=x(l.id);if(!o)return;const c=this.getQualityClass(o.quality),h=document.createElement("div");h.className="p-4 border border-gray-800 rounded-2xl bg-white/5 space-y-3";let p="";l.materials.forEach(d=>{var b;const m=x(d.id),y=((b=e.player.inventory.items.find(N=>N.id===d.id))==null?void 0:b.quantity)||0,v=y>=d.quantity;p+=`<div class="text-[10px] ${v?"text-gray-400":"text-red-500"}">${(m==null?void 0:m.name)||d.id}: ${y}/${d.quantity}</div>`});const u=e.player.smithingLevel<l.level;h.innerHTML=`
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <span class="text-xl mr-2">${o.image?`<img src="${f(o.image)}" class="w-6 h-6 object-contain inline-block">`:o.icon||""}</span>
                        <span class="font-bold quality-${c} font-ancient">${o.name}</span>
                    </div>
                    ${u?`<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${l.level}</span>`:`<button class="px-4 py-2 btn-gold text-[10px] font-bold rounded-lg" onclick="window.game.forge('${l.id}')">RÈN ĐÚC</button>`}
                </div>
                <div class="grid grid-cols-2 gap-1">${p}</div>
                <div class="text-[9px] text-gray-500 italic">Thể lực: ${l.staminaCost} | Linh lực: ${l.manaCost}</div>
            `,n.appendChild(h)})}openCrafting(n){if(!e.player)return;if(!e.player.unlockedProfessions.includes(n)){e.ui.toast("Ngươi chưa nắm vững bí pháp của nghề này!","error");return}const t={alchemy:"screen-alchemy",smithing:"screen-smithing",talisman:"screen-talisman",formation:"screen-formation",beast:"screen-beast",puppet:"screen-puppet",corpse:"screen-corpse"}[n];t&&(e.ui.switchScreen(t),n==="alchemy"&&this.renderAlchemy(),n==="smithing"&&this.renderSmithing(),n==="talisman"&&this.renderTalisman(),n==="formation"&&this.renderFormation(),n==="beast"&&this.renderBeast(),n==="puppet"&&this.renderPuppet(),n==="corpse"&&this.renderCorpse())}openCraftingHub(){["screen-alchemy","screen-talisman","screen-smithing","screen-formation","screen-corpse","screen-beast","screen-puppet"].forEach(s=>{const t=document.getElementById(s);t&&(t.classList.add("hidden"),t.classList.remove("flex"))});const i=document.getElementById("screen-crafting-hub");i&&(i.classList.remove("hidden"),i.classList.add("flex"))}renderPuppet(){if(!e.player)return;const n=document.getElementById("puppet-level-text"),i=document.getElementById("puppet-exp-bar"),s=document.getElementById("puppet-list");if(n&&(n.textContent=`Khôi Lỗi Sư - Cấp ${e.player.puppetLevel}`),i){const t=e.player.puppetLevel*100*Math.pow(1.5,e.player.puppetLevel-1);i.style.width=`${e.player.puppetExp/t*100}%`}if(s){s.innerHTML="";const t=Q.filter(r=>e.player.knownPuppetRecipes.includes(r.id));if(t.length===0){s.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa có bản thiết kế khôi lỗi nào...</div>';return}t.forEach(r=>{const a=document.createElement("div");a.className="p-5 border border-white/5 rounded-3xl bg-white/[0.02] space-y-4 group hover:border-qi-blue/30 transition-all";let l="";r.materials.forEach(c=>{var d;const h=x(c.id),p=((d=e.player.inventory.items.find(m=>m.id===c.id))==null?void 0:d.quantity)||0,u=p>=c.quantity;l+=`
                        <div class="flex justify-between items-center bg-black/20 p-2 rounded-xl border ${u?"border-white/5":"border-red-500/20"}">
                            <span class="text-[10px] text-gray-400">${(h==null?void 0:h.name)||c.id}</span>
                            <span class="text-[10px] font-mono ${u?"text-qi-jade":"text-red-500"}">${p}/${c.quantity}</span>
                        </div>
                    `});const o=e.player.puppetLevel<r.skillLevel;a.innerHTML=`
                    <div class="flex justify-between items-start">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/10 group-hover:scale-110 transition-transform">🤖</div>
                            <div>
                                <h4 class="font-ancient text-white text-lg">${r.name}</h4>
                                <div class="flex space-x-2 mt-1">
                                    <span class="text-[8px] px-2 py-0.5 bg-qi-blue/10 text-qi-blue rounded-full border border-qi-blue/20 uppercase font-bold">${W[r.grade].name}</span>
                                    <span class="text-[8px] px-2 py-0.5 bg-white/5 text-gray-500 rounded-full border border-white/10 uppercase font-bold">${r.type}</span>
                                </div>
                            </div>
                        </div>
                        ${o?`<div class="text-[9px] text-red-500 font-bold uppercase py-2">Cần Cấp ${r.skillLevel}</div>`:`<button class="px-5 py-2.5 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue text-[10px] font-bold rounded-xl border border-qi-blue/20 active:scale-95 transition-all" onclick="window.game.craftPuppet('${r.id}')">LUYỆN CHẾ</button>`}
                    </div>
                    <p class="text-[10px] text-gray-500 italic leading-relaxed">${r.description}</p>
                    <div class="grid grid-cols-2 gap-2">${l}</div>
                `,s.appendChild(a)})}}renderTalisman(){if(!e.player)return;const n=C(e.player.talismanLevel),i=document.getElementById("talisman-level-text"),s=document.getElementById("talisman-exp-bar"),t=document.getElementById("talisman-recipes");if(i&&(i.textContent=n.name),s){const a=e.player.talismanLevel*100*Math.pow(1.5,e.player.talismanLevel-1);s.style.width=`${e.player.talismanExp/a*100}%`}const r=document.getElementById("current-pen-name");if(r){const a=e.player.currentTalismanPen?x(e.player.currentTalismanPen):null;a?r.innerHTML=`<span class="text-white">${a.name}</span>`:r.innerHTML=`<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phu_luc')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`}if(t){t.innerHTML="";const a=Object.values(z).filter(l=>e.player.knownTalismanRecipes.includes(l.id));if(a.length===0){t.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được phù văn nào...</div>';return}a.forEach(l=>{const o=document.createElement("div");o.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3";let c="";l.materials.forEach(p=>{const u=x(p.id),d=e.player.inventory.hasItem(p.id)?e.player.inventory.items.find(m=>m.id===p.id).quantity:0;c+=`<div class="text-[9px] ${d>=p.quantity?"text-gray-400":"text-red-500"}">${u.name} x${p.quantity} (${d})</div>`});const h=e.player.talismanLevel<l.level;o.innerHTML=`
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-bold text-qi-blue">${l.name}</h4>
                        ${h?`<span class="text-[8px] text-red-500 uppercase">Cần Cấp ${l.level}</span>`:`<button class="px-3 py-1 bg-qi-blue/10 text-qi-blue text-[10px] rounded border border-qi-blue/20" onclick="window.game.drawTalisman('${l.id}')">VẼ PHÙ</button>`}
                    </div>
                    <div class="grid grid-cols-2 gap-1 mb-2">${c}</div>
                    <div class="text-[8px] text-gray-500 italic">Mana: ${l.manaCost} | Stamina: ${l.staminaCost}</div>
                `,t.appendChild(o)})}}renderBeast(){if(!e.player)return;const n=document.getElementById("beast-list-view"),i=document.getElementById("beast-hatch-view"),s=document.getElementById("beast-tab-beast"),t=document.getElementById("beast-tab-insect"),r=document.getElementById("beast-tab-hatch");e.views.beast||(e.views.beast="beast"),e.views.beast==="hatch"?(n&&n.classList.add("hidden"),i&&i.classList.remove("hidden")):(n&&n.classList.remove("hidden"),i&&i.classList.add("hidden"));const a=["bg-qi-jade/10","text-qi-jade","border-qi-jade/20"],l=["bg-transparent","text-gray-500","border-transparent"];[s,t,r].forEach(u=>{if(u){u.classList.remove(...a,...l);const d=u===s&&e.views.beast==="beast"||u===t&&e.views.beast==="insect"||u===r&&e.views.beast==="hatch";u.classList.add(...d?a:l)}});const o=document.getElementById("beast-level-text"),c=document.getElementById("beast-exp-bar"),h=e.views.beast==="insect"?e.player.insectLevel:e.player.beastLevel,p=e.views.beast==="insect"?e.player.insectExp:e.player.beastExp;if(o&&(o.textContent=`Cấp ${h}`),c){const u=h*100*Math.pow(1.5,h-1);c.style.width=`${p/u*100}%`}if(n&&e.views.beast!=="hatch"){n.innerHTML="";const u=e.player.beasts.filter(d=>{const m=k[d.id];return m?e.views.beast==="beast"?[g.LINH_THU,g.DI_THU,g.THAN_THU].includes(m.type):e.views.beast==="insect"?[g.LINH_TRUNG,g.KY_TRUNG].includes(m.type):!0:!1});if(u.length===0){const d=e.views.beast==="beast"?"linh thú":"kỳ trùng";n.innerHTML=`<div class="text-center py-10 text-gray-600 italic">Ngươi chưa có ${d} nào...</div>`}else u.forEach(d=>{const m=k[d.id],y=M(d.level),v=J[d.bloodline],b=document.createElement("div");b.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] flex items-center space-x-4",b.innerHTML=`
                        <div class="text-4xl">${(m==null?void 0:m.icon)||"🐾"}</div>
                        <div class="flex-grow">
                            <div class="flex justify-between items-center">
                                <h4 class="font-bold text-white">${d.name}</h4>
                                <span class="text-[9px] font-bold" style="color: ${v.color}">${v.name}</span>
                            </div>
                            <div class="text-[9px] text-gray-500 mt-0.5">Cấp ${d.level} (${y.name})</div>
                            <div class="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                                <div class="h-full bg-qi-jade" style="width: ${d.exp/y.expRequired*100}%"></div>
                            </div>
                        </div>
                    `,n.appendChild(b)})}if(i&&e.views.beast==="hatch"){i.innerHTML="";const u=e.player.inventory.items.filter(d=>x(d.id).type==="beast_egg");u.length===0?i.innerHTML='<div class="text-center py-10 text-gray-600 italic">Ngươi không có trứng linh thú nào...</div>':u.forEach(d=>{const m=x(d.id),y=document.createElement("div");y.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] flex justify-between items-center",y.innerHTML=`
                        <div class="flex items-center space-x-3">
                            <div class="text-2xl">${m.icon}</div>
                            <div>
                                <h4 class="text-sm font-bold text-white">${m.name}</h4>
                                <p class="text-[9px] text-gray-500">Số lượng: ${d.quantity}</p>
                            </div>
                        </div>
                        <button class="px-4 py-2 bg-qi-jade/10 text-qi-jade text-[10px] rounded-xl border border-qi-jade/20" onclick="window.game.hatchBeast('${d.id}')">ẤP NỞ</button>
                    `,i.appendChild(y)})}s&&(s.onclick=()=>{e.views.beast="beast",this.renderBeast()}),t&&(t.onclick=()=>{e.views.beast="insect",this.renderBeast()}),r&&(r.onclick=()=>{e.views.beast="hatch",this.renderBeast()})}renderCraftingHub(){if(!e.player)return;[{id:"alchemy",key:"alchemy",name:"Luyện Dược Sư",level:e.player.alchemyLevel,exp:e.player.alchemyExp,getLevelInfo:L},{id:"talisman",key:"talisman",name:"Phù Sư",level:e.player.talismanLevel,exp:e.player.talismanExp,getLevelInfo:C},{id:"smithing",key:"smithing",name:"Luyện Khí Sư",level:e.player.smithingLevel,exp:e.player.smithingExp,getLevelInfo:I},{id:"formation",key:"formation",name:"Trận Pháp Sư",level:e.player.formationLevel,exp:e.player.formationExp,getLevelInfo:i=>({name:`Cấp ${i}`})},{id:"puppet",key:"puppet",name:"Khôi Lỗi Sư",level:e.player.puppetLevel,exp:e.player.puppetExp,getLevelInfo:i=>({name:`Cấp ${i}`})},{id:"corpse",key:"corpse",name:"Luyện Thi Sư",level:e.player.corpseLevel,exp:e.player.corpseExp,getLevelInfo:i=>({name:`Cấp ${i}`})},{id:"beast",key:"beast",name:"Ngự Thú Sư",level:e.player.beastLevel,exp:e.player.beastExp,getLevelInfo:M},{id:"insect",key:"insect",name:"Khu Trùng Sư",level:e.player.insectLevel,exp:e.player.insectExp,getLevelInfo:i=>({name:`Cấp ${i}`})}].forEach(i=>{const s=document.getElementById(`hub-${i.id}-level`),t=s==null?void 0:s.closest(".hub-card");if(!s||!t)return;const r=e.player.unlockedProfessions.includes(i.id);t.onclick=()=>window.game.openCrafting(i.id);const a={alchemy:"Đan Đạo Chân Giải",talisman:"Thái Thượng Phù Kinh",smithing:"Luyện Khí Tổng Cương",formation:"Trận Đạo Thiên Thư",puppet:"Cơ Quan Linh Kỹ",corpse:"Cửu U Luyện Thi Thuật",beast:"Vạn Thú Ngự Pháp",insect:"Thiên Trùng Bí Lục"};if(r){const l=i.getLevelInfo?i.getLevelInfo(i.level):{name:`Cấp ${i.level}`},o=i.level*100*Math.pow(1.5,i.level-1),c=Math.floor(i.exp/o*100);s.innerHTML=`${i.name} - ${l.name} <span class="text-white/30 ml-2">(${c}%)</span>`,t.classList.remove("opacity-40","grayscale"),t.classList.add("cursor-pointer")}else s.innerHTML=`
                    <div class="flex flex-col">
                        <span class="text-red-500/60 flex items-center"><i class="ph ph-lock-key mr-1"></i> Chưa mở khóa</span>
                        <span class="text-[7px] text-gray-600 italic mt-0.5">Cần: « ${a[i.id]} »</span>
                    </div>
                `,t.classList.add("opacity-40","grayscale"),t.classList.remove("cursor-pointer")})}renderFormation(){if(!e.player)return;const n=document.getElementById("formation-list");if(!n)return;if(n.innerHTML="",e.player.activeFormations.length>0){const t=document.createElement("h3");t.className="text-[10px] text-gray-500 uppercase tracking-widest mb-2",t.textContent="Trận Pháp Đang Hoạt Động",n.appendChild(t),e.player.activeFormations.forEach(r=>{const a=document.createElement("div");a.className="p-4 border border-qi-purple/30 rounded-2xl bg-qi-purple/5 mb-4 flex justify-between items-center",a.innerHTML=`
                    <div>
                        <h4 class="font-bold text-qi-purple">${r.name}</h4>
                        <p class="text-[9px] text-gray-500 mt-1">Đang kích hoạt...</p>
                    </div>
                    <button class="px-4 py-2 bg-red-500/10 text-red-500 text-[10px] rounded-xl border border-red-500/20" onclick="window.game.deactivateFormation('${r.id}')">THU HỒI</button>
                `,n.appendChild(a)})}const i=e.player.knownFormations||[],s=document.createElement("h3");if(s.className="text-[10px] text-gray-500 uppercase tracking-widest mt-6 mb-2",s.textContent="Trận Đồ Đã Lĩnh Ngộ",n.appendChild(s),i.length===0){const t=document.createElement("div");t.className="text-center py-6 text-gray-700 italic text-xs",t.textContent="Trống rỗng...",n.appendChild(t)}else i.forEach(t=>{const r=x(t);if(!r)return;const a=e.player.activeFormations.some(o=>o.id===t),l=document.createElement("div");l.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3 flex justify-between items-center",l.innerHTML=`
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">${r.icon||"📜"}</div>
                        <div>
                            <h4 class="text-sm font-bold text-white">${r.name}</h4>
                            <p class="text-[9px] text-gray-500">${r.description||""}</p>
                        </div>
                    </div>
                    ${a?'<span class="text-[9px] text-qi-purple font-bold">ĐÃ KÍCH HOẠT</span>':`<button class="px-4 py-2 bg-qi-purple/10 text-qi-purple text-[10px] rounded-xl border border-qi-purple/20" onclick="window.game.activateFormation('${t}')">KÍCH HOẠT</button>`}
                `,n.appendChild(l)})}renderCorpse(){if(!e.player)return;const n=document.getElementById("corpse-list"),i=document.getElementById("corpse-level-text"),s=document.getElementById("corpse-exp-bar");if(i&&(i.textContent=X(e.player.corpseLevel).name),s){const a=e.player.corpseLevel*100*Math.pow(1.5,e.player.corpseLevel-1);s.style.width=`${e.player.corpseExp/a*100}%`}if(!n)return;if(n.innerHTML="",e.player.refinedCorpses.length>0){const a=document.createElement("h3");a.className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-1",a.textContent="Thi Hài Đang Khống Chế",n.appendChild(a),e.player.refinedCorpses.forEach((l,o)=>{const c=document.createElement("div");c.className="p-4 border border-red-900/30 rounded-2xl bg-red-900/5 mb-4 flex items-center space-x-4",c.innerHTML=`
                    <div class="text-4xl opacity-80">🧟</div>
                    <div class="flex-grow">
                        <div class="flex justify-between items-center">
                            <h4 class="font-bold text-red-400">${l.name}</h4>
                            <span class="text-[9px] px-2 py-0.5 bg-red-500/10 text-red-500 rounded border border-red-500/20 font-bold uppercase">${l.quality}</span>
                        </div>
                        <div class="text-[9px] text-gray-500 mt-1">Cấp ${l.level} | ATK: ${l.stats.atk} | HP: ${l.stats.hp}</div>
                    </div>
                `,n.appendChild(c)})}const t=document.createElement("h3");t.className="text-[10px] text-gray-500 uppercase tracking-widest mt-6 mb-3 border-b border-white/5 pb-1",t.textContent="Bản Vẽ Luyện Thi",n.appendChild(t);const r=Object.values(Z).filter(a=>e.player.knownCorpseRecipes.includes(a.id));if(r.length===0){const a=document.createElement("div");a.className="text-center py-6 text-gray-700 italic text-xs",a.textContent="Ngươi chưa có bí phương luyện thi nào...",n.appendChild(a)}else r.forEach(a=>{const l=document.createElement("div");l.className="p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3 space-y-3";let o="";a.materials.forEach(p=>{const u=x(p.id),d=e.player.inventory.hasItem(p.id)?e.player.inventory.items.find(m=>m.id===p.id).quantity:0;o+=`<div class="text-[9px] ${d>=p.quantity?"text-gray-400":"text-red-500"}">${(u==null?void 0:u.name)||p.id} x${p.quantity} (${d})</div>`});const c=e.player.corpseLevel<a.level,h=Math.floor((.7-a.level*.1+e.player.corpseLevel*.05)*100);l.innerHTML=`
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-ancient text-lg text-red-500">${a.name}</h4>
                        <p class="text-[9px] text-gray-500 mt-1">${a.description}</p>
                    </div>
                    ${c?`<span class="text-[8px] text-red-500 uppercase font-bold">Cần Cấp ${a.level}</span>`:`<button class="px-4 py-2 bg-red-900/20 text-red-400 text-[10px] font-bold rounded-xl border border-red-900/30" onclick="window.game.refineCorpse('${a.id}')">LUYỆN CHẾ</button>`}
                </div>
                <div class="grid grid-cols-2 gap-2">${o}</div>
                <div class="flex justify-between items-center text-[8px] text-gray-500 italic">
                    <span>Tỷ lệ thành công: ${h}%</span>
                    <span>Phản phệ: ${100-h}%</span>
                </div>
            `,n.appendChild(l)})}renderTechniques(n="cultivation"){if(e.player){if(e.activeTechTab=n,this.btnTechTabCultivation&&this.btnTechTabSecret&&(n==="cultivation"?(this.btnTechTabCultivation.className="flex-grow py-2 bg-qi-blue/20 text-qi-blue border border-qi-blue/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all",this.btnTechTabSecret.className="flex-grow py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all"):(this.btnTechTabCultivation.className="flex-grow py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all",this.btnTechTabSecret.className="flex-grow py-2 bg-qi-purple/20 text-qi-purple border border-qi-purple/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all")),this.elTechListView){this.elTechListView.innerHTML="",this.elTechListView.classList.remove("hidden"),this.elTechDetailView&&this.elTechDetailView.classList.add("hidden");const i=n==="cultivation"?e.player.learnedTechniques:e.player.learnedSecretTechniques;i.length===0?this.elTechListView.innerHTML=`<div class="text-center py-20 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ ${n==="cultivation"?"công pháp":"bí pháp"} nào...</div>`:i.forEach(s=>{const t=n==="cultivation"?H(s.id):B(s.id);if(!t)return;const r=w.find(c=>c.id===(s.masteryLevel||1)),a=t.stageLabel||"Tầng",l=t.stageNames&&t.stageNames[s.stage-1]?t.stageNames[s.stage-1]:`${a} ${s.stage||1}`,o=document.createElement("div");o.className=`p-4 border ${n==="cultivation"?"border-qi-blue/10 bg-qi-blue/5":"border-qi-purple/10 bg-qi-purple/5"} rounded-2xl flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all mb-3`,o.innerHTML=`
                        <div class="flex items-center space-x-4">
                            <div class="text-2xl">${t.icon||(n==="cultivation"?"📜":"✨")}</div>
                            <div>
                                <h4 class="text-sm font-bold text-white">${t.name}</h4>
                                <div class="flex items-center space-x-2 mt-1">
                                    <span class="text-[8px] px-1.5 py-0.5 bg-black/40 rounded border border-white/5 text-gray-400 font-mono">${l}</span>
                                    <span class="text-[8px] text-cultivation-gold font-bold">${(r==null?void 0:r.name)||"Nhập Môn"}</span>
                                </div>
                            </div>
                        </div>
                        <i class="ph ph-caret-right text-gray-600"></i>
                    `,o.onclick=()=>this.renderTechniqueDetail(s.id,n==="secret"),this.elTechListView.appendChild(o)})}this.elTechPoints&&(this.elTechPoints.textContent=e.player.techniquePoints||0)}}renderTechniqueDetail(n,i){if(!this.elTechDetailContent)return;const s=i?e.player.learnedSecretTechniques.find(p=>p.id===n):e.player.learnedTechniques.find(p=>p.id===n),t=i?B(n):H(n);if(!s||!t)return;this.elTechListView.classList.add("hidden"),this.elTechDetailView.classList.remove("hidden");const r=w.findIndex(p=>p.id===(s.masteryLevel||1)),a=w[r],l=w[r+1],o=t.stageLabel||"Tầng",c=t.stageNames&&t.stageNames[s.stage-1]?t.stageNames[s.stage-1]:`${o} ${s.stage||1}`,h=s.masteryLevel>=4&&s.stage<(t.maxStage||10);this.elTechDetailContent.innerHTML=`
            <div class="flex flex-col items-center text-center space-y-4">
                <div class="text-6xl p-6 bg-white/5 rounded-full border border-white/10">${t.icon||"📜"}</div>
                <div>
                    <h3 class="text-2xl font-ancient text-white">${t.name}</h3>
                    <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">${t.quality||"Phàm"}${(t.quality||"Phàm").toLowerCase().includes("phẩm")||["Hoàn Mỹ","Truyền Thuyết","Thần Thoại"].includes(t.quality||"Phàm")?"":" Phẩm"} | ${c}</p>
                </div>
            </div>

            <div class="bg-black/40 p-5 rounded-3xl border border-white/5 space-y-4">
                <div class="flex justify-between items-end mb-1">
                    <span class="text-[9px] text-gray-500 uppercase tracking-widest">Độ Thuần Thục: ${(a==null?void 0:a.name)||"Nhập Môn"}</span>
                    <span class="text-[10px] font-mono text-white">${s.mastery} / ${(l==null?void 0:l.threshold)||"MAX"}</span>
                </div>
                <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-cultivation-gold" style="width: ${s.masteryLevel>=4?100:s.mastery/((l==null?void 0:l.threshold)||1)*100}%"></div>
                </div>
                
                <div class="grid grid-cols-2 gap-3 mt-6">
                    <button class="py-4 bg-qi-blue text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" onclick="window.game.cultivateTechnique('${n}', ${i})">TU LUYỆN</button>
                    <button class="py-4 ${h?"bg-cultivation-gold":"bg-gray-800 opacity-50"} text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" 
                        onclick="window.game.breakthroughTechnique('${n}', ${i})">ĐỘT PHÁ TẦNG</button>
                </div>
            </div>

            <div class="space-y-4">
                <h4 class="text-xs font-ancient text-gray-500 uppercase tracking-widest border-l-2 border-gray-500 pl-3">Mô tả & Hiệu ứng</h4>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs text-gray-400 leading-relaxed">
                    ${t.description||"Không có mô tả."}
                </div>
            </div>
        `}}export{ae as SystemsScreen};
