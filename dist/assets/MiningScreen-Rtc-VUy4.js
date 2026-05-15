import{s as t,M as r,W as p}from"./index-CSCC3EfR.js";import"./vendor-capacitor-DNzPfH2b.js";import"./vendor-gsap-CzGW6FVa.js";class g{constructor(){this.initElements(),this.initEvents(),this.currentTab="nodes"}initElements(){this.overlay=document.getElementById("mining-overlay"),this.viewNodes=document.getElementById("mining-nodes-view"),this.viewOccupied=document.getElementById("mining-occupied-view"),this.btnTabNodes=document.getElementById("mining-tab-nodes"),this.btnTabOccupied=document.getElementById("mining-tab-occupied"),this.elLevelText=document.getElementById("mining-level-text"),this.elExpBar=document.getElementById("mining-exp-bar"),this.elSlotsText=document.getElementById("mining-slots-text"),this.elStaminaText=document.getElementById("mining-stamina-text")}initEvents(){this.btnTabNodes&&(this.btnTabNodes.onclick=()=>{this.currentTab="nodes",this.render()}),this.btnTabOccupied&&(this.btnTabOccupied.onclick=()=>{this.currentTab="occupied",this.render()})}open(){t.ui.toggleOverlay(this.overlay,!0),this.render()}render(){if(!t.player||!t.player.miningState)return;const i=t.player.miningState;this.elLevelText.textContent=`Cấp ${i.miningLevel}`;const e=i.miningLevel*1e3;this.elExpBar.style.width=`${i.miningExp/e*100}%`;const n=t.systems.mining;this.elSlotsText.textContent=`${i.occupiedNodes.length} / ${n.getMaxOccupiedSlots()}`,this.elStaminaText.textContent=`${Math.floor(t.player.stamina)} / ${t.player.maxStamina}`,this.currentTab==="nodes"?(this.renderNodes(),this.btnTabNodes.className="flex-grow py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest",this.btnTabOccupied.className="flex-grow py-3 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest",this.viewNodes.classList.remove("hidden"),this.viewOccupied.classList.add("hidden")):(this.renderOccupied(),this.btnTabNodes.className="flex-grow py-3 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest",this.btnTabOccupied.className="flex-grow py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest",this.viewNodes.classList.add("hidden"),this.viewOccupied.classList.remove("hidden"))}renderNodes(){this.viewNodes.innerHTML="";const i=t.player.miningState;r.forEach(e=>{if(!i.discoveredNodes.includes(e.id))return;const c=p[e.grade],s=document.createElement("div");s.className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3";const o=i.occupiedNodes.some(a=>a.nodeId===e.id),d=t.player.realmId>=e.requiredRealm;s.innerHTML=`
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="text-sm font-ancient text-white">${e.name}</h4>
                        <span class="text-[9px] text-qi-blue uppercase tracking-tighter">${c.name}</span>
                    </div>
                    <div class="text-right">
                        <span class="text-[8px] text-gray-500 block uppercase">Yêu cầu</span>
                        <span class="text-[10px] ${d?"text-qi-jade":"text-red-500"}">Cảnh giới ${e.requiredRealm}</span>
                    </div>
                </div>
                <p class="text-[10px] text-gray-500 italic">${e.description}</p>
                <div class="flex space-x-2">
                    <button class="flex-grow py-2 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-lg text-[10px] font-bold ${d?"":"opacity-50 grayscale"}" 
                        onclick="window.game.mineManual('${e.id}')">KHAI THÁC (-5 TL)</button>
                    ${o?'<span class="px-4 py-2 text-[10px] text-qi-jade font-bold">ĐÃ CHIẾM LĨNH</span>':`<button class="flex-grow py-2 bg-cultivation-gold/10 text-cultivation-gold border border-cultivation-gold/20 rounded-lg text-[10px] font-bold ${d?"":"opacity-50 grayscale"}" 
                            onclick="window.game.occupyNode('${e.id}')">CHIẾM LĨNH (-20 TL)</button>`}
                </div>
            `,this.viewNodes.appendChild(s)}),this.viewNodes.innerHTML===""&&(this.viewNodes.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Chưa khám phá ra linh mạch nào...</div>')}renderOccupied(){this.viewOccupied.innerHTML="";const i=t.player.miningState;if(i.occupiedNodes.length===0){this.viewOccupied.innerHTML='<div class="text-center py-10 text-gray-600 italic text-xs">Chưa chiếm lĩnh linh mạch nào...</div>';return}i.occupiedNodes.forEach(e=>{var l;const n=r.find(x=>x.id===e.nodeId),c=p[n.grade],s=document.createElement("div");s.className="p-4 bg-white/5 border border-qi-blue/30 rounded-2xl space-y-4";const d=(((l=t.systems.time)==null?void 0:l.totalMinutes)||0)-e.lastClaimTime,a=Math.floor(d/60);s.innerHTML=`
                <div class="flex justify-between items-center">
                    <div>
                        <h4 class="text-sm font-ancient text-white">${n.name}</h4>
                        <div class="flex items-center space-x-2">
                            <div class="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div class="h-full bg-qi-jade" style="width: ${e.health}%"></div>
                            </div>
                            <span class="text-[8px] text-gray-500">${e.health}% Sức khỏe</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="text-[8px] text-gray-500 block">Sản lượng</span>
                        <span class="text-[10px] text-qi-blue font-mono">${c.baseProduction}/Giờ</span>
                    </div>
                </div>
                
                <div class="bg-black/40 p-3 rounded-xl border border-white/5 flex justify-between items-center">
                    <div>
                        <span class="text-[8px] text-gray-500 uppercase block">Đã tích lũy</span>
                        <span class="text-xs text-white font-mono">${a} Giờ (${a*c.baseProduction} Linh Thạch)</span>
                    </div>
                    <button class="px-4 py-2 bg-qi-jade/10 text-qi-jade border border-qi-jade/20 rounded-lg text-[10px] font-bold ${a<1?"opacity-50":""}" 
                        onclick="window.game.claimMiningResources('${n.id}')">THU THẬP</button>
                </div>

                <button class="w-full py-2 text-red-500/60 text-[9px] font-bold uppercase tracking-widest hover:text-red-500" 
                    onclick="window.game.abandonNode('${n.id}')">TỪ BỎ CHIẾM LĨNH</button>
            `,this.viewOccupied.appendChild(s)})}}export{g as MiningScreen};
