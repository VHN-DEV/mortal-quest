import{W as h,A as u,s as d,g as m}from"./index-CiCZnKYM.js";import"./vendor-capacitor-DNzPfH2b.js";import"./vendor-gsap-CzGW6FVa.js";class w{constructor(){this.container=document.getElementById("screen-start"),this.init()}init(){this.container||(this.container=document.createElement("div"),this.container.id="screen-start",this.container.className="screen flex flex-col h-full z-[200] overflow-hidden",document.querySelector("main").appendChild(this.container))}async render(){const a=await h.getAllMetadata();let i=1;Object.values(a).forEach(l=>{l.realmId>i&&(i=l.realmId)});let e="bg-start-default";i>40?e="bg-start-immortal":i>20&&(e="bg-start-expert"),this.container.innerHTML=`
            <div class="absolute inset-0 z-0 transition-all duration-1000 ${e}">
                <!-- Dynamic Elements like Fog, Sword Qi, etc. -->
                <div class="spiritual-fog absolute inset-0 opacity-40"></div>
                <div class="sword-qi-particles absolute inset-0 pointer-events-none"></div>
            </div>

            <div class="relative z-10 flex flex-col h-full items-center justify-between p-8 py-20">
                <!-- Logo Section -->
                <div class="flex flex-col items-center space-y-4 animate-fade-in py-4">
                    <div class="w-32 h-32 md:w-48 md:h-48 relative">
                        <div class="absolute inset-0 bg-cultivation-gold/20 blur-3xl rounded-full animate-pulse"></div>
                        <img src="${u.logos.main}" class="w-full h-full rounded-2xl object-contain relative z-10 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                    </div>
                    <h1 class="text-4xl md:text-6xl font-charm text-white tracking-tighter text-glow text-center">
                        PHÀM NHÂN <span class="text-cultivation-gold">VẤN ĐẠO</span>
                    </h1>
                </div>

                <!-- Main Menu Section -->
                <div class="w-full max-w-xs space-y-4 animate-fade-in" style="animation-delay: 0.3s">
                    <button id="btn-start-new" 
                        class="w-full py-4 btn-gold rounded-2xl text-xs font-bold uppercase tracking-[0.2em] shadow-2xl">
                        KHỞI ĐẦU TIÊN DUYÊN
                    </button>
                    
                    <button id="btn-continue-game" 
                        class="w-full py-4 bg-black/40 hover:bg-black/60 border border-white/20 rounded-2xl text-white text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md transition-all shadow-xl">
                        TIẾP TỤC HÀNH TRÌNH
                    </button>
                    
                    <div class="flex justify-center space-x-8 pt-4 text-gray-400 text-sm">
                        <i id="btn-start-settings" class="ph ph-gear-six hover:text-cultivation-gold cursor-pointer transition-all hover:scale-125 drop-shadow-md" title="Cài đặt"></i>
                        <i id="btn-start-info" class="ph ph-info hover:text-cultivation-gold cursor-pointer transition-all hover:scale-125 drop-shadow-md" title="Hướng dẫn"></i>
                        <i id="btn-start-discord" class="ph ph-discord-logo hover:text-cultivation-gold cursor-pointer transition-all hover:scale-125 drop-shadow-md" title="Cộng đồng"></i>
                    </div>
                </div>

                <!-- Version Info -->
                <div class="text-[9px] text-gray-600 font-mono uppercase tracking-widest opacity-50">
                    Version 1.2.5 - Beta
                </div>
            </div>
        `,this.bindEvents()}bindEvents(){const a=document.getElementById("btn-start-new");a&&(a.onclick=async()=>{const s=await h.getAllMetadata();let n=null;for(let t=1;t<=5;t++)if(!s[t]){n=t;break}n?(h.currentSlot=n,window.game.showCreationScreen()):(d.ui.toast("Toàn bộ Mệnh Đồ Lục đã đầy. Hãy chọn một ô để ghi đè hoặc xóa bớt.","warning"),await window.game.screens.save.render(),d.ui.switchScreen("screen-save"))});const i=document.getElementById("btn-continue-game");i&&(i.onclick=async()=>{await window.game.screens.save.render(),d.ui.switchScreen("screen-save")});const e=document.getElementById("btn-start-info");e&&(e.onclick=()=>{const s=document.getElementById("guide-overlay");s&&(d.ui.toggleOverlay(s,!0),this.renderWorldTree())});const l=document.getElementById("btn-start-settings");l&&(l.onclick=()=>{const s=window.game.audioManager.isMuted,n=[{label:s?"Bật Âm Thanh":"Tắt Âm Thanh",value:"toggle-mute",icon:s?"ph-speaker-high":"ph-speaker-slash"}];d.ui.promptOptions("Cài Đặt Hệ Thống",n,"Tùy chỉnh các thiết lập cơ bản của trò chơi.").then(async t=>{if(t==="toggle-mute"){const r=await window.game.audioManager.toggleMute();window.game.updateMuteIcon(r),d.ui.toast(r?"Đã tắt âm thanh":"Đã bật âm thanh","info")}})},window.game&&window.game.audioManager&&window.game.updateMuteIcon(window.game.audioManager.isMuted));const o=document.getElementById("btn-start-discord");o&&(o.onclick=()=>{d.ui.toast("Tính năng cộng đồng đang được phát triển.","info")}),this.generateParticles()}generateParticles(){const a=this.container.querySelector(".sword-qi-particles");if(a)for(let i=0;i<15;i++){const e=document.createElement("div");e.className="sword-qi-particle",e.style.left=`${Math.random()*100}%`,e.style.animationDelay=`${Math.random()*5}s`,e.style.animationDuration=`${3+Math.random()*4}s`,a.appendChild(e)}}renderWorldTree(){const a=document.getElementById("guide-world-tree");if(a)try{const i=m();let e="";for(const[l,o]of Object.entries(i)){e+='<div class="world-node space-y-1.5 border-b border-white/5 pb-2 last:border-b-0 last:pb-0">',e+=`
                    <div class="world-title flex items-center space-x-2 font-ancient text-cultivation-gold cursor-pointer hover:text-white transition-all py-1 select-none">
                        <i class="ph ph-caret-down text-xs transition-transform duration-300"></i>
                        <span class="tracking-wider uppercase font-bold text-[12px]">${o.name}</span>
                    </div>
                `,e+='<div class="world-children pl-4 border-l border-white/5 space-y-2.5 mt-0.5">';const s={};o.locations.forEach(n=>{const t=n.regionName||"Bí Cảnh Khác",r=n.subRegionName||"Phân Khu Khác";s[t]||(s[t]={}),s[t][r]||(s[t][r]=[]),s[t][r].push(n)});for(const[n,t]of Object.entries(s)){e+='<div class="region-node space-y-1">',e+=`
                        <div class="region-title flex items-center space-x-2 text-white font-semibold cursor-pointer hover:text-cultivation-gold transition-all py-0.5 select-none text-[11px]">
                            <i class="ph ph-caret-down text-[10px] text-gray-500 transition-transform duration-300"></i>
                            <span>${n}</span>
                        </div>
                    `,e+='<div class="region-children pl-4 border-l border-white/5 space-y-2 mt-0.5">';for(const[r,g]of Object.entries(t)){const p=r!=="Phân Khu Khác"&&r!==n;p&&(e+='<div class="subregion-node space-y-1">',e+=`
                                <div class="subregion-title flex items-center space-x-2 text-qi-blue font-medium cursor-pointer hover:text-white transition-all py-0.5 select-none text-[10px]">
                                    <i class="ph ph-caret-down text-[8px] text-gray-500 transition-transform duration-300"></i>
                                    <span>${r}</span>
                                </div>
                            `,e+='<div class="subregion-children pl-4 border-l border-white/5 space-y-1 mt-0.5">'),g.forEach(c=>{e+=`
                                <div class="loc-node flex items-center space-x-2 py-0.5 text-gray-400 hover:text-white transition-all text-[10px]">
                                    <span class="w-1 h-1 bg-qi-blue/50 rounded-full"></span>
                                    <span>${c.name}</span>
                                    ${c.danger==="nguy_hiem"?'<span class="text-[8px] px-1 bg-red-950/50 border border-red-500/20 text-red-400 rounded-sm font-sans scale-90">Nguy Hiểm</span>':""}
                                    ${c.danger==="an_toan"?'<span class="text-[8px] px-1 bg-green-950/50 border border-green-500/20 text-green-400 rounded-sm font-sans scale-90">An Toàn</span>':""}
                                </div>
                            `}),p&&(e+="</div></div>")}e+="</div></div>"}e+="</div></div>"}a.innerHTML=e,a.onclick=l=>{const o=l.target.closest(".world-title, .region-title, .subregion-title");if(o){const n=o.parentElement.querySelector(".world-children, .region-children, .subregion-children"),t=o.querySelector(".ph-caret-down");n&&(n.classList.contains("hidden")?(n.classList.remove("hidden"),t&&(t.style.transform="rotate(0deg)")):(n.classList.add("hidden"),t&&(t.style.transform="rotate(-90deg)")))}}}catch(i){console.error("Failed to render world tree:",i),a.innerHTML=`<div class="text-red-400 text-center py-4">Cảm ứng thất bại: ${i.message}</div>`}}}export{w as StartScreen};
