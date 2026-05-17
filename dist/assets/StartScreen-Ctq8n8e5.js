import{V as r,A as u,s as a}from"./index-DHlSf2r0.js";import"./vendor-capacitor-DNzPfH2b.js";import"./vendor-gsap-CzGW6FVa.js";class w{constructor(){this.container=document.getElementById("screen-start"),this.init()}init(){this.container||(this.container=document.createElement("div"),this.container.id="screen-start",this.container.className="screen flex flex-col h-full z-[200] overflow-hidden",document.querySelector("main").appendChild(this.container))}async render(){const n=await r.getAllMetadata();let e=1;Object.values(n).forEach(o=>{o.realmId>e&&(e=o.realmId)});let t="bg-start-default";e>40?t="bg-start-immortal":e>20&&(t="bg-start-expert"),this.container.innerHTML=`
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
        `,this.bindEvents()}bindEvents(){const n=document.getElementById("btn-start-new");n&&(n.onclick=async()=>{const i=await r.getAllMetadata();let l=null;for(let s=1;s<=5;s++)if(!i[s]){l=s;break}l?(r.currentSlot=l,window.game.showCreationScreen()):(a.ui.toast("Toàn bộ Mệnh Đồ Lục đã đầy. Hãy chọn một ô để ghi đè hoặc xóa bớt.","warning"),await window.game.screens.save.render(),a.ui.switchScreen("screen-save"))});const e=document.getElementById("btn-continue-game");e&&(e.onclick=async()=>{await window.game.screens.save.render(),a.ui.switchScreen("screen-save")});const t=document.getElementById("btn-start-info");t&&(t.onclick=()=>{const i=document.getElementById("guide-overlay");i&&a.ui.toggleOverlay(i,!0)});const o=document.getElementById("btn-start-settings");o&&(o.onclick=()=>{const i=window.game.audioManager.isMuted,l=[{label:i?"Bật Âm Thanh":"Tắt Âm Thanh",value:"toggle-mute",icon:i?"ph-speaker-high":"ph-speaker-slash"}];a.ui.promptOptions("Cài Đặt Hệ Thống",l,"Tùy chỉnh các thiết lập cơ bản của trò chơi.").then(async s=>{if(s==="toggle-mute"){const d=await window.game.audioManager.toggleMute();window.game.updateMuteIcon(d),a.ui.toast(d?"Đã tắt âm thanh":"Đã bật âm thanh","info")}})},window.game&&window.game.audioManager&&window.game.updateMuteIcon(window.game.audioManager.isMuted));const c=document.getElementById("btn-start-discord");c&&(c.onclick=()=>{a.ui.toast("Tính năng cộng đồng đang được phát triển.","info")}),this.generateParticles()}generateParticles(){const n=this.container.querySelector(".sword-qi-particles");if(n)for(let e=0;e<15;e++){const t=document.createElement("div");t.className="sword-qi-particle",t.style.left=`${Math.random()*100}%`,t.style.animationDelay=`${Math.random()*5}s`,t.style.animationDuration=`${3+Math.random()*4}s`,n.appendChild(t)}}}export{w as StartScreen};
