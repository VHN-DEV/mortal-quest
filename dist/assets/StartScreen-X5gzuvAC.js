import{X as u,A as p,s as d,g as m}from"./index-B6eMPeTj.js";import"./vendor-capacitor-DNzPfH2b.js";import"./vendor-gsap-CzGW6FVa.js";class w{constructor(){this.container=document.getElementById("screen-start"),this.init()}init(){this.container||(this.container=document.createElement("div"),this.container.id="screen-start",this.container.className="screen flex flex-col h-full z-[200] overflow-hidden",document.querySelector("main").appendChild(this.container))}async render(){const i=await u.getAllMetadata();let a=1;Object.values(i).forEach(r=>{r.realmId>a&&(a=r.realmId)});let t="bg-start-default";a>40?t="bg-start-immortal":a>20&&(t="bg-start-expert"),this.container.innerHTML=`
            <div class="absolute inset-0 z-0 transition-all duration-1000 ${t}">
                <!-- Dynamic Elements like Fog, Sword Qi, etc. -->
                <div class="spiritual-fog absolute inset-0 opacity-40"></div>
                <div class="sword-qi-particles absolute inset-0 pointer-events-none"></div>
            </div>

            <div class="relative z-10 flex flex-col h-full items-center justify-between p-8 py-20">
                <!-- Logo Section -->
                <div class="flex flex-col items-center space-y-4 animate-fade-in py-4">
                    <div class="w-32 h-32 md:w-48 md:h-48 relative">
                        <div class="absolute inset-0 bg-cultivation-gold/20 blur-3xl rounded-full animate-pulse"></div>
                        <img src="${p.logos.main}" class="w-full h-full rounded-2xl object-contain relative z-10 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
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
        `,this.bindEvents()}bindEvents(){const i=document.getElementById("btn-start-new");i&&(i.onclick=async()=>{const s=await u.getAllMetadata();let n=null;for(let e=1;e<=5;e++)if(!s[e]){n=e;break}n?(u.currentSlot=n,window.game.showCreationScreen()):(d.ui.toast("Toàn bộ Mệnh Đồ Lục đã đầy. Hãy chọn một ô để ghi đè hoặc xóa bớt.","warning"),await window.game.screens.save.render(),d.ui.switchScreen("screen-save"))});const a=document.getElementById("btn-continue-game");a&&(a.onclick=async()=>{await window.game.screens.save.render(),d.ui.switchScreen("screen-save")});const t=document.getElementById("btn-start-info");t&&(t.onclick=()=>{const s=document.getElementById("guide-overlay");s&&(d.ui.toggleOverlay(s,!0),this.initGuideTabs(),this.renderWorldTree())});const r=document.getElementById("btn-start-settings");r&&(r.onclick=()=>{const s=window.game.audioManager.isMuted,n=[{label:s?"Bật Âm Thanh":"Tắt Âm Thanh",value:"toggle-mute",icon:s?"ph-speaker-high":"ph-speaker-slash"}];d.ui.promptOptions("Cài Đặt Hệ Thống",n,"Tùy chỉnh các thiết lập cơ bản của trò chơi.").then(async e=>{if(e==="toggle-mute"){const l=await window.game.audioManager.toggleMute();window.game.updateMuteIcon(l),d.ui.toast(l?"Đã tắt âm thanh":"Đã bật âm thanh","info")}})},window.game&&window.game.audioManager&&window.game.updateMuteIcon(window.game.audioManager.isMuted));const o=document.getElementById("btn-start-discord");o&&(o.onclick=()=>{d.ui.toast("Tính năng cộng đồng đang được phát triển.","info")}),this.generateParticles()}generateParticles(){const i=this.container.querySelector(".sword-qi-particles");if(i)for(let a=0;a<15;a++){const t=document.createElement("div");t.className="sword-qi-particle",t.style.left=`${Math.random()*100}%`,t.style.animationDelay=`${Math.random()*5}s`,t.style.animationDuration=`${3+Math.random()*4}s`,i.appendChild(t)}}renderWorldTree(){const i=document.getElementById("guide-world-tree");if(i)try{const a=m();let t="";for(const[r,o]of Object.entries(a)){t+='<div class="world-node space-y-1.5 border-b border-white/5 pb-2 last:border-b-0 last:pb-0">',t+=`
                    <div class="world-title flex items-center space-x-2 font-ancient text-cultivation-gold cursor-pointer hover:text-white transition-all py-1 select-none">
                        <i class="ph ph-caret-down text-xs transition-transform duration-300"></i>
                        <span class="tracking-wider uppercase font-bold text-[12px]">${o.name}</span>
                    </div>
                `,t+='<div class="world-children pl-4 border-l border-white/5 space-y-2.5 mt-0.5">';const s={};o.locations.forEach(n=>{const e=n.regionName||"Bí Cảnh Khác",l=n.subRegionName||"Phân Khu Khác";s[e]||(s[e]={}),s[e][l]||(s[e][l]=[]),s[e][l].push(n)});for(const[n,e]of Object.entries(s)){t+='<div class="region-node space-y-1">',t+=`
                        <div class="region-title flex items-center space-x-2 text-white font-semibold cursor-pointer hover:text-cultivation-gold transition-all py-0.5 select-none text-[11px]">
                            <i class="ph ph-caret-down text-[10px] text-gray-500 transition-transform duration-300"></i>
                            <span>${n}</span>
                        </div>
                    `,t+='<div class="region-children pl-4 border-l border-white/5 space-y-2 mt-0.5">';for(const[l,h]of Object.entries(e)){const g=l!=="Phân Khu Khác"&&l!==n;g&&(t+='<div class="subregion-node space-y-1">',t+=`
                                <div class="subregion-title flex items-center space-x-2 text-qi-blue font-medium cursor-pointer hover:text-white transition-all py-0.5 select-none text-[10px]">
                                    <i class="ph ph-caret-down text-[8px] text-gray-500 transition-transform duration-300"></i>
                                    <span>${l}</span>
                                </div>
                            `,t+='<div class="subregion-children pl-4 border-l border-white/5 space-y-1 mt-0.5">'),h.forEach(c=>{t+=`
                                <div class="loc-node flex items-center space-x-2 py-0.5 text-gray-400 hover:text-white transition-all text-[10px]">
                                    <span class="w-1 h-1 bg-qi-blue/50 rounded-full"></span>
                                    <span>${c.name}</span>
                                    ${c.danger==="nguy_hiem"?'<span class="text-[8px] px-1 bg-red-950/50 border border-red-500/20 text-red-400 rounded-sm font-sans scale-90">Nguy Hiểm</span>':""}
                                    ${c.danger==="an_toan"?'<span class="text-[8px] px-1 bg-green-950/50 border border-green-500/20 text-green-400 rounded-sm font-sans scale-90">An Toàn</span>':""}
                                </div>
                            `}),g&&(t+="</div></div>")}t+="</div></div>"}t+="</div></div>"}i.innerHTML=t,i.onclick=r=>{const o=r.target.closest(".world-title, .region-title, .subregion-title");if(o){const n=o.parentElement.querySelector(".world-children, .region-children, .subregion-children"),e=o.querySelector(".ph-caret-down");n&&(n.classList.contains("hidden")?(n.classList.remove("hidden"),e&&(e.style.transform="rotate(0deg)")):(n.classList.add("hidden"),e&&(e.style.transform="rotate(-90deg)")))}}}catch(a){console.error("Failed to render world tree:",a),i.innerHTML=`<div class="text-red-400 text-center py-4">Cảm ứng thất bại: ${a.message}</div>`}}initGuideTabs(){const i=document.getElementById("guide-overlay");if(!i)return;const a=i.querySelectorAll(".guide-tab-btn"),t=i.querySelectorAll(".guide-tab-pane");a.forEach(o=>{o.onclick=()=>{a.forEach(e=>{e.classList.remove("active","border-cultivation-gold/45","text-cultivation-gold","bg-cultivation-gold/10"),e.classList.add("border-white/5","text-gray-400")}),o.classList.add("active","border-cultivation-gold/45","text-cultivation-gold","bg-cultivation-gold/10"),o.classList.remove("border-white/5","text-gray-400"),t.forEach(e=>e.classList.add("hidden"));const s=o.getAttribute("data-tab"),n=i.querySelector(`#${s}`);n&&n.classList.remove("hidden")}});const r=i.querySelector('.guide-tab-btn[data-tab="tab-intro"]');r&&r.click()}}export{w as StartScreen};
