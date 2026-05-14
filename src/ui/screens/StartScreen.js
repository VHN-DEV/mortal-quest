import { state } from '../../state.js';
import { SaveSystem } from '../../core/save-system.js';
import { ASSETS } from '../../configs/asset-data.js';

export class StartScreen {
    constructor() {
        this.container = document.getElementById('screen-start');
        this.init();
    }

    init() {
        if (!this.container) {
            // Create container if it doesn't exist in HTML
            this.container = document.createElement('div');
            this.container.id = 'screen-start';
            this.container.className = 'screen flex flex-col h-full z-[200] overflow-hidden';
            document.querySelector('main').appendChild(this.container);
        }
    }

    async render() {
        // Highest realm logic for dynamic background
        const metadata = await SaveSystem.getAllMetadata();
        let highestRealmId = 1;
        Object.values(metadata).forEach(meta => {
            if (meta.realmId > highestRealmId) highestRealmId = meta.realmId;
        });

        // Background based on highest realm
        let bgClass = 'bg-start-default';
        if (highestRealmId > 40) bgClass = 'bg-start-immortal';
        else if (highestRealmId > 20) bgClass = 'bg-start-expert';

        this.container.innerHTML = `
            <div class="absolute inset-0 z-0 transition-all duration-1000 ${bgClass}">
                <!-- Dynamic Elements like Fog, Sword Qi, etc. -->
                <div class="spiritual-fog absolute inset-0 opacity-40"></div>
                <div class="sword-qi-particles absolute inset-0 pointer-events-none"></div>
            </div>

            <div class="relative z-10 flex flex-col h-full items-center justify-between p-8 py-20">
                <!-- Logo Section -->
                <div class="flex flex-col items-center space-y-4 animate-fade-in">
                    <div class="w-32 h-32 md:w-48 md:h-48 relative">
                        <div class="absolute inset-0 bg-cultivation-gold/20 blur-3xl rounded-full animate-pulse"></div>
                        <img src="${ASSETS.logos.main}" class="w-full h-full rounded-2xl object-contain relative z-10 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                    </div>
                    <h1 class="text-4xl md:text-6xl font-charm text-white tracking-tighter text-glow text-center">
                        PHÀM NHÂN <span class="text-cultivation-gold">VẤN ĐẠO</span>
                    </h1>
                    <p class="text-[10px] md:text-xs font-ancient text-gray-400 uppercase tracking-[0.5em]">
                        Mortal Quest: Path to Immortality
                    </p>
                </div>

                <!-- Main Menu Section -->
                <div class="w-full max-w-xs space-y-4 animate-fade-in" style="animation-delay: 0.3s">
                    <button id="btn-start-new" 
                        class="w-full py-4 btn-gold rounded-2xl text-xs font-bold uppercase tracking-[0.2em] shadow-2xl">
                        KHỞI ĐẦU TIÊN DUYÊN
                    </button>
                    
                    <button id="btn-continue-game" 
                        class="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white text-xs font-bold uppercase tracking-[0.2em] transition-all">
                        TIẾP TỤC HÀNH TRÌNH
                    </button>
                    
                    <div class="flex justify-center space-x-6 pt-4 text-gray-500 text-sm">
                        <i id="btn-start-settings" class="ph ph-gear-six hover:text-white cursor-pointer transition-colors" title="Cài đặt"></i>
                        <i id="btn-start-info" class="ph ph-info hover:text-white cursor-pointer transition-colors" title="Hướng dẫn"></i>
                        <i id="btn-start-discord" class="ph ph-discord-logo hover:text-white cursor-pointer transition-colors" title="Cộng đồng"></i>
                    </div>
                </div>

                <!-- Version Info -->
                <div class="text-[9px] text-gray-600 font-mono uppercase tracking-widest opacity-50">
                    Version 1.2.5 - Beta
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const btnStart = document.getElementById('btn-start-new');
        if (btnStart) {
            btnStart.onclick = async () => {
                const metadata = await SaveSystem.getAllMetadata();
                let targetSlot = null;
                for (let i = 1; i <= 5; i++) {
                    if (!metadata[i]) {
                        targetSlot = i;
                        break;
                    }
                }

                if (targetSlot) {
                    SaveSystem.currentSlot = targetSlot;
                    window.game.showCreationScreen();
                } else {
                    // All slots full
                    state.ui.toast('Toàn bộ Mệnh Đồ Lục đã đầy. Hãy chọn một ô để ghi đè hoặc xóa bớt.', 'warning');
                    await window.game.screens.save.render();
                    state.ui.switchScreen('screen-save');
                }
            };
        }

        const btnContinue = document.getElementById('btn-continue-game');
        if (btnContinue) {
            btnContinue.onclick = async () => {
                await window.game.screens.save.render();
                state.ui.switchScreen('screen-save');
            };
        }

        // Info Button -> Guide Overlay
        const btnInfo = document.getElementById('btn-start-info');
        if (btnInfo) {
            btnInfo.onclick = () => {
                const guide = document.getElementById('guide-overlay');
                if (guide) state.ui.toggleOverlay(guide, true);
            };
        }

        // Settings Button -> Prompt Options (Sound Toggle)
        const btnSettings = document.getElementById('btn-start-settings');
        if (btnSettings) {
            btnSettings.onclick = () => {
                const isMuted = state.settings?.isMuted || false;
                const options = [
                    { 
                        label: isMuted ? 'Bật Âm Thanh' : 'Tắt Âm Thanh', 
                        value: 'toggle-mute', 
                        icon: isMuted ? 'ph-speaker-high' : 'ph-speaker-slash' 
                    }
                ];
                state.ui.promptOptions('Cài Đặt Hệ Thống', options, 'Tùy chỉnh các thiết lập cơ bản của trò chơi.')
                    .then(action => {
                        if (action === 'toggle-mute') {
                            if (!state.settings) state.settings = {};
                            state.settings.isMuted = !state.settings.isMuted;
                            state.ui.toast(state.settings.isMuted ? 'Đã tắt âm thanh' : 'Đã bật âm thanh', 'info');
                        }
                    });
            };
        }

        const btnDiscord = document.getElementById('btn-start-discord');
        if (btnDiscord) {
            btnDiscord.onclick = () => {
                state.ui.toast('Tính năng cộng đồng đang được phát triển.', 'info');
            };
        }

        this.generateParticles();
    }

    generateParticles() {
        const container = this.container.querySelector('.sword-qi-particles');
        if (!container) return;

        for (let i = 0; i < 15; i++) {
            const p = document.createElement('div');
            p.className = 'sword-qi-particle';
            p.style.left = `${Math.random() * 100}%`;
            p.style.animationDelay = `${Math.random() * 5}s`;
            p.style.animationDuration = `${3 + Math.random() * 4}s`;
            container.appendChild(p);
        }
    }
}
