import { state } from '../../state.js';
import { SaveSystem } from '../../core/save-system.js';
import { ASSETS } from '../../configs/asset-data.js';
import { getWorlds } from '../../configs/map-data.js';

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
                <div class="flex flex-col items-center space-y-4 animate-fade-in py-4">
                    <div class="w-32 h-32 md:w-48 md:h-48 relative">
                        <div class="absolute inset-0 bg-cultivation-gold/20 blur-3xl rounded-full animate-pulse"></div>
                        <img src="${ASSETS.logos.main}" class="w-full h-full rounded-2xl object-contain relative z-10 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
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
                if (guide) {
                    state.ui.toggleOverlay(guide, true);
                    this.initGuideTabs();
                    this.renderWorldTree();
                }
            };
        }

        // Settings Button -> Prompt Options (Sound Toggle)
        const btnSettings = document.getElementById('btn-start-settings');
        if (btnSettings) {
            btnSettings.onclick = () => {
                const isMuted = window.game.audioManager.isMuted;
                const options = [
                    {
                        label: isMuted ? 'Bật Âm Thanh' : 'Tắt Âm Thanh',
                        value: 'toggle-mute',
                        icon: isMuted ? 'ph-speaker-high' : 'ph-speaker-slash'
                    }
                ];
                state.ui.promptOptions('Cài Đặt Hệ Thống', options, 'Tùy chỉnh các thiết lập cơ bản của trò chơi.')
                    .then(async action => {
                        if (action === 'toggle-mute') {
                            const muted = await window.game.audioManager.toggleMute();
                            window.game.updateMuteIcon(muted);
                            state.ui.toast(muted ? 'Đã tắt âm thanh' : 'Đã bật âm thanh', 'info');
                        }
                    });
            };
            
            // Initial icon state on render
            if (window.game && window.game.audioManager) {
                window.game.updateMuteIcon(window.game.audioManager.isMuted);
            }
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

    renderWorldTree() {
        const treeContainer = document.getElementById('guide-world-tree');
        if (!treeContainer) return;

        try {
            const worlds = getWorlds();
            let html = '';

            for (const [worldId, world] of Object.entries(worlds)) {
                html += `<div class="world-node space-y-1.5 border-b border-white/5 pb-2 last:border-b-0 last:pb-0">`;
                html += `
                    <div class="world-title flex items-center space-x-2 font-ancient text-cultivation-gold cursor-pointer hover:text-white transition-all py-1 select-none">
                        <i class="ph ph-caret-down text-xs transition-transform duration-300"></i>
                        <span class="tracking-wider uppercase font-bold text-[12px]">${world.name}</span>
                    </div>
                `;
                html += `<div class="world-children pl-4 border-l border-white/5 space-y-2.5 mt-0.5">`;

                // Group by regionName
                const regions = {};
                world.locations.forEach(loc => {
                    const rName = loc.regionName || 'Bí Cảnh Khác';
                    const sName = loc.subRegionName || 'Phân Khu Khác';
                    if (!regions[rName]) regions[rName] = {};
                    if (!regions[rName][sName]) regions[rName][sName] = [];
                    regions[rName][sName].push(loc);
                });

                for (const [rName, subregions] of Object.entries(regions)) {
                    html += `<div class="region-node space-y-1">`;
                    html += `
                        <div class="region-title flex items-center space-x-2 text-white font-semibold cursor-pointer hover:text-cultivation-gold transition-all py-0.5 select-none text-[11px]">
                            <i class="ph ph-caret-down text-[10px] text-gray-500 transition-transform duration-300"></i>
                            <span>${rName}</span>
                        </div>
                    `;
                    html += `<div class="region-children pl-4 border-l border-white/5 space-y-2 mt-0.5">`;

                    for (const [sName, locs] of Object.entries(subregions)) {
                        const hasSubregion = sName !== 'Phân Khu Khác' && sName !== rName;
                        if (hasSubregion) {
                            html += `<div class="subregion-node space-y-1">`;
                            html += `
                                <div class="subregion-title flex items-center space-x-2 text-qi-blue font-medium cursor-pointer hover:text-white transition-all py-0.5 select-none text-[10px]">
                                    <i class="ph ph-caret-down text-[8px] text-gray-500 transition-transform duration-300"></i>
                                    <span>${sName}</span>
                                </div>
                            `;
                            html += `<div class="subregion-children pl-4 border-l border-white/5 space-y-1 mt-0.5">`;
                        }

                        locs.forEach(loc => {
                            html += `
                                <div class="loc-node flex items-center space-x-2 py-0.5 text-gray-400 hover:text-white transition-all text-[10px]">
                                    <span class="w-1 h-1 bg-qi-blue/50 rounded-full"></span>
                                    <span>${loc.name}</span>
                                    ${loc.danger === 'nguy_hiem' ? '<span class="text-[8px] px-1 bg-red-950/50 border border-red-500/20 text-red-400 rounded-sm font-sans scale-90">Nguy Hiểm</span>' : ''}
                                    ${loc.danger === 'an_toan' ? '<span class="text-[8px] px-1 bg-green-950/50 border border-green-500/20 text-green-400 rounded-sm font-sans scale-90">An Toàn</span>' : ''}
                                </div>
                            `;
                        });

                        if (hasSubregion) {
                            html += `</div></div>`; // close subregion children, subregion node
                        }
                    }

                    html += `</div></div>`; // close region children, region node
                }

                html += `</div></div>`; // close world children, world node
            }

            treeContainer.innerHTML = html;

            // Bind click collapse-expand logic using event delegation
            treeContainer.onclick = (e) => {
                const header = e.target.closest('.world-title, .region-title, .subregion-title');
                if (header) {
                    const parent = header.parentElement;
                    const children = parent.querySelector('.world-children, .region-children, .subregion-children');
                    const caret = header.querySelector('.ph-caret-down');
                    if (children) {
                        const isHidden = children.classList.contains('hidden');
                        if (isHidden) {
                            children.classList.remove('hidden');
                            if (caret) caret.style.transform = 'rotate(0deg)';
                        } else {
                            children.classList.add('hidden');
                            if (caret) caret.style.transform = 'rotate(-90deg)';
                        }
                    }
                }
            };

        } catch (err) {
            console.error('Failed to render world tree:', err);
            treeContainer.innerHTML = `<div class="text-red-400 text-center py-4">Cảm ứng thất bại: ${err.message}</div>`;
        }
    }

    initGuideTabs() {
        const overlay = document.getElementById('guide-overlay');
        if (!overlay) return;

        const tabBtns = overlay.querySelectorAll('.guide-tab-btn');
        const panes = overlay.querySelectorAll('.guide-tab-pane');

        tabBtns.forEach(btn => {
            btn.onclick = () => {
                // Remove active classes from all buttons
                tabBtns.forEach(b => {
                    b.classList.remove('active', 'border-cultivation-gold/45', 'text-cultivation-gold', 'bg-cultivation-gold/10');
                    b.classList.add('border-white/5', 'text-gray-400');
                });

                // Add active classes to clicked button
                btn.classList.add('active', 'border-cultivation-gold/45', 'text-cultivation-gold', 'bg-cultivation-gold/10');
                btn.classList.remove('border-white/5', 'text-gray-400');

                // Hide all panes
                panes.forEach(p => p.classList.add('hidden'));

                // Show targeted pane
                const tabId = btn.getAttribute('data-tab');
                const targetPane = overlay.querySelector(`#${tabId}`);
                if (targetPane) {
                    targetPane.classList.remove('hidden');
                }
            };
        });

        // Auto reset to default tab (Tân Thủ) when opened
        const defaultBtn = overlay.querySelector('.guide-tab-btn[data-tab="tab-intro"]');
        if (defaultBtn) {
            defaultBtn.click();
        }
    }
}
