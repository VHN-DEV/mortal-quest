import { state } from '../../state.js';
import { getWorlds, getLocationById } from '../../configs/map-data.js';
import { getRealmById } from '../../configs/realm-data.js';
import { ASSETS } from '../../configs/asset-data.js';
import { getRandomEvent } from '../../configs/event-data.js';
import { SECTS } from '../../configs/sect-data.js';

/**
 * Quản lý giao diện và logic của màn hình Khám phá / Bản đồ.
 */
export class MapScreen {
    constructor() {
        this.initElements();
        this.initEvents();
    }

    initElements() {
        // Map Views
        this.viewWorlds = document.getElementById('map-world-view');
        this.viewLocations = document.getElementById('map-location-view');
        this.viewExplore = document.getElementById('map-explore-view');
        
        // Lists & Containers
        this.elWorldList = document.getElementById('world-list');
        this.elLocList = document.getElementById('location-list');
        this.elLocSpecialActions = document.getElementById('loc-special-actions');
        
        // Info Displays
        this.elCurrentWorldName = document.getElementById('current-world-name');
        this.elCurrentLocName = document.getElementById('current-location-name');
        this.elCurrentWorldNameSub = document.getElementById('current-world-name-sub');
        this.elEventText = document.getElementById('event-text');
        this.elExploreEvent = document.getElementById('explore-event-display');
        this.elExploreBg = document.getElementById('explore-bg');
        
        // Progress Bars
        this.elExploreBar = document.getElementById('explore-bar');
        this.elExploreProgress = document.getElementById('explore-progress');
        
        // Buttons
        this.btnMove = document.getElementById('btn-move');
        this.btnBackToLocs = document.getElementById('back-to-locations');
        this.btnBackToWorlds = document.getElementById('back-to-worlds');
        this.btnLeaveLoc = document.getElementById('btn-leave-loc');
    }

    initEvents() {
        if (this.btnMove) {
            this.btnMove.onclick = () => this.handleMove();
        }
        
        if (this.btnBackToLocs) {
            this.btnBackToLocs.onclick = () => {
                state.ui.toggleOverlay(this.viewExplore, false);
                state.ui.toggleOverlay(this.viewLocations, true);
                if (state.systems.time) state.systems.time.timeMultiplier = 1.0;
            };
        }

        if (this.btnBackToWorlds) {
            this.btnBackToWorlds.onclick = () => {
                state.ui.toggleOverlay(this.viewLocations, false);
                state.ui.toggleOverlay(this.viewWorlds, true);
            };
        }

        if (this.btnLeaveLoc) {
            this.btnLeaveLoc.onclick = () => {
                state.ui.toggleOverlay(this.viewExplore, false);
                state.ui.toggleOverlay(this.viewLocations, true);
                if (state.systems.time) state.systems.time.timeMultiplier = 1.0;
            };
        }
    }

    renderWorldList() {
        if (!state.player) return;
        const worlds = getWorlds();
        this.elWorldList.innerHTML = '';
        
        Object.keys(worlds).forEach(id => {
            const w = worlds[id];
            const locked = state.player.realmId < w.minRealm;
            const el = document.createElement('div');
            el.className = `group relative overflow-hidden p-6 rounded-[2rem] border transition-all duration-500 active:scale-[0.98] ${locked ? 'bg-black/20 border-white/5 opacity-60' : 'bg-qi-ink/40 border-white/10 hover:border-qi-blue/50 hover:bg-black/60 shadow-xl'}`;
            
            el.innerHTML = `
                <div class="absolute -top-10 -right-10 w-24 h-24 bg-qi-blue/5 rounded-full blur-2xl group-hover:bg-qi-blue/20 transition-all"></div>
                <div class="relative z-10 flex flex-col space-y-3">
                    <div class="flex justify-between items-start">
                        <div class="space-y-1">
                            <span class="text-2xl font-charm text-white group-hover:text-qi-blue transition-colors">${w.name}</span>
                            <div class="text-[9px] text-gray-500 font-ancient tracking-[0.2em] uppercase opacity-60">Cõi Giới</div>
                        </div>
                        <span class="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${locked ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-qi-blue/10 text-qi-blue border border-qi-blue/20'}">
                            ${locked ? '<i class="ph ph-lock mr-1"></i> ' + getRealmById(w.minRealm).name : '<i class="ph ph-check-circle mr-1"></i> Đã mở'}
                        </span>
                    </div>
                    <p class="text-xs text-gray-400 font-ancient leading-relaxed opacity-80">${w.description}</p>
                    <div class="flex items-center space-x-2 pt-2 text-[9px] text-gray-600 font-ancient uppercase tracking-widest">
                        <i class="ph ph-map-trifold"></i>
                        <span>${w.locations ? w.locations.length : 0} Địa điểm khám phá</span>
                    </div>
                </div>
            `;
            if (!locked) el.onclick = () => this.selectWorld(id);
            this.elWorldList.appendChild(el);
        });
    }

    selectWorld(id) {
        state.currentWorldId = id;
        const w = getWorlds()[id];
        this.elCurrentWorldName.textContent = w.name;
        state.ui.toggleOverlay(this.viewWorlds, false);
        state.ui.toggleOverlay(this.viewLocations, true);
        this.renderLocationList();
        if (state.systems.time) state.systems.time.timeMultiplier = 1.0;
    }

    renderLocationList() {
        const w = getWorlds()[state.currentWorldId];
        this.elLocList.innerHTML = '';
        w.locations.forEach(loc => {
            const locked = state.player.realmId < loc.minRealm;
            const el = document.createElement('div');
            el.className = `group relative overflow-hidden p-5 rounded-2xl border transition-all active:scale-[0.98] ${locked ? 'bg-black/20 border-white/5 opacity-60 grayscale' : 'bg-white/[0.02] border-white/5 hover:border-qi-blue/30 hover:bg-white/[0.05]'}`;
            
            el.innerHTML = `
                <div class="relative z-10 flex justify-between items-center">
                    <div class="space-y-1">
                        <div class="flex items-center space-x-2">
                            <span class="text-lg font-bold text-white group-hover:text-qi-blue transition-colors">${loc.name}</span>
                            <span class="text-[8px] px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-gray-500 uppercase tracking-widest">${loc.danger}</span>
                        </div>
                        <p class="text-[11px] text-gray-500 font-ancient leading-tight max-w-xs">${loc.description}</p>
                    </div>
                    <div class="flex flex-col items-end">
                        ${locked ? 
                            `<span class="text-[8px] text-red-500 uppercase font-bold tracking-widest">Khóa</span>` : 
                            `<i class="ph ph-caret-right text-qi-blue opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0"></i>`
                        }
                    </div>
                </div>
            `;
            if (!locked) el.onclick = () => this.startExploration(loc.id);
            this.elLocList.appendChild(el);
        });
    }

    startExploration(locId) {
        state.currentLocId = locId;
        const loc = getLocationById(state.currentWorldId, locId);
        this.elCurrentLocName.textContent = loc.name;
        state.explorationProgress = 0;
        
        state.ui.toggleOverlay(this.viewWorlds, false);
        state.ui.toggleOverlay(this.viewLocations, false);
        state.ui.toggleOverlay(this.viewExplore, true);
        
        this.updateExplorationUI();
        this.updateEventDisplay('Bạn đã tới địa điểm.', '🚶');

        if (state.systems.time) {
            state.systems.time.timeMultiplier = loc.timeRate || 1.0;
            if (state.systems.time.timeMultiplier !== 1.0) {
                state.ui.toast(`Dòng chảy thời gian tại đây dường như khác biệt... (x${state.systems.time.timeMultiplier})`, 'warning');
            }
        }

        this.renderSpecialActions(loc);
        this.viewExplore.scrollTop = 0;
        this.renderExplore();
    }

    handleMove() {
        if (state.player.stamina < 5) { 
            state.ui.toast('Không đủ thể lực!', 'error'); 
            return; 
        }
        
        state.player.stamina -= 5;

        if (state.systems.time) state.systems.time.advanceTime(1);

        state.explorationProgress += 5 + Math.random() * 5;
        if (state.explorationProgress >= 100) state.explorationProgress = 100;
        this.updateExplorationUI();

        const loc = getLocationById(state.currentWorldId, state.currentLocId);

        let probs = { ...loc.eventProbs };
        if (state.systems.time && state.systems.time.isNight()) {
            probs.combat = (probs.combat || 0) * 1.5;
            probs.loot = (probs.loot || 0) * 1.2;
        }

        const event = getRandomEvent(probs);

        if (event) {
            this.updateEventDisplay(event.description, event.icon || '📜');
            if (event.type === 'loot') {
                const resultMsg = event.result(state.player);
                const droppedShi = Math.floor(Math.random() * 10 * state.player.realmId);
                state.player.lingShi += droppedShi;
                setTimeout(() => { this.updateEventDisplay(resultMsg + ` (+${droppedShi} LT)`, '🎁'); }, 1000);
            } else if (event.type === 'npc') {
                setTimeout(() => { 
                    window.game.openNPC();
                }, 1000);
            } else if (event.type === 'shop') {
                window.game.openShop();
            } else if (event.type === 'combat') {
                setTimeout(() => { window.game.startBattle(state.currentWorldId, state.currentLocId); }, 1000);
            }
        } else {
            this.updateEventDisplay('Một chặng đường yên tĩnh.', '🚶');
        }

        if (state.explorationProgress >= 100) {
            setTimeout(() => {
                state.ui.toast(`Bạn đã hoàn thành khám phá ${loc.name}!`, 'success');
                state.explorationProgress = 0;
                this.updateExplorationUI();
            }, 1500);
        }
    }

    renderSpecialActions(loc) {
        if (!this.elLocSpecialActions) return;
        this.elLocSpecialActions.innerHTML = '';
        let hasSpecial = false;

        // Special actions mapped to window.game functions
        if (loc.id === 'van_bao_cac') {
            hasSpecial = true;
            this.elLocSpecialActions.innerHTML = `
                <button onclick="window.game.openShop('buy')" class="py-3 bg-cultivation-gold/10 border border-cultivation-gold/30 rounded-xl text-cultivation-gold text-[10px] font-bold uppercase tracking-widest flex flex-col items-center justify-center">
                    <i class="ph ph-shopping-cart text-lg mb-1"></i>MUA ĐỒ
                </button>
                <button onclick="window.game.openShop('sell')" class="py-3 bg-qi-blue/10 border border-qi-blue/30 rounded-xl text-qi-blue text-[10px] font-bold uppercase tracking-widest flex flex-col items-center justify-center">
                    <i class="ph ph-currency-circle-dollar text-lg mb-1"></i>BÁN ĐỒ
                </button>
                <button onclick="window.game.openAuction()" class="col-span-2 py-3 bg-qi-purple/10 border border-qi-purple/30 rounded-xl text-qi-purple text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
                    <i class="ph ph-hammer text-lg"></i><span>ĐẤU GIÁ</span>
                </button>
            `;
        } else if (SECTS[loc.id]) {
            hasSpecial = true;
            this.elLocSpecialActions.innerHTML = `
                <button onclick="window.game.openSect()" class="col-span-2 py-4 bg-qi-purple/10 border border-qi-purple/30 rounded-xl text-qi-purple text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
                    <i class="ph ph-castle-turret text-lg"></i><span>VÀO TÔNG MÔN</span>
                </button>
            `;
        } else if (loc.special === 'guild') {
            hasSpecial = true;
            this.elLocSpecialActions.innerHTML = `
                <button onclick="window.game.openGuild()" class="col-span-2 py-4 bg-qi-blue/10 border border-qi-blue/30 rounded-xl text-qi-blue text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
                    <i class="ph ph-users text-lg"></i><span>VÀO CÔNG HỘI</span>
                </button>
            `;
        } else if (loc.special === 'tower') {
            hasSpecial = true;
            this.elLocSpecialActions.innerHTML = `
                <button onclick="window.game.openTower()" class="col-span-2 py-4 bg-cultivation-gold/10 border border-cultivation-gold/30 rounded-xl text-cultivation-gold text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
                    <i class="ph ph-tower text-lg"></i><span>VÀO ĐAN THÁP</span>
                </button>
            `;
        } else if (loc.special === 'mountain') {
            hasSpecial = true;
            this.elLocSpecialActions.innerHTML = `
                <button onclick="window.game.openMountain()" class="col-span-2 py-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
                    <i class="ph ph-mountains text-lg"></i><span>VÀO ĐẠI SƠN</span>
                </button>
            `;
        }

        state.ui.toggleOverlay(this.elLocSpecialActions, hasSpecial);
    }

    updateEventDisplay(text) {
        if (this.elEventText) this.elEventText.textContent = text;
        if (this.elExploreEvent) {
            this.elExploreEvent.classList.remove('animate-fade-in');
            void this.elExploreEvent.offsetWidth;
            this.elExploreEvent.classList.add('animate-fade-in');
        }
    }

    updateExplorationUI() {
        this.elExploreProgress.textContent = `Tiến độ: ${Math.floor(state.explorationProgress)}%`;
        this.elExploreBar.style.width = `${state.explorationProgress}%`;
    }

    renderExplore() {
        const loc = getLocationById(state.currentWorldId, state.currentLocId);
        if (!loc) return;

        const defaultBg = ASSETS.backgrounds.cultivation;
        const bgUrl = loc.image || ASSETS.backgrounds[loc.id] || defaultBg;
        
        const setBg = (url) => {
            if (this.elExploreBg) {
                this.elExploreBg.style.backgroundImage = `url('${url}')`;
            } else {
                this.viewExplore.style.backgroundImage = `url('${url}')`;
                this.viewExplore.style.backgroundSize = 'cover';
                this.viewExplore.style.backgroundPosition = 'center';
            }
        };

        const img = new Image();
        img.onload = () => setBg(bgUrl);
        img.onerror = () => setBg(defaultBg);
        img.src = bgUrl;

        if (this.elCurrentWorldNameSub) {
            const world = getWorlds()[state.currentWorldId];
            this.elCurrentWorldNameSub.textContent = world ? world.name : 'Vô Danh Giới';
        }

        // renderEnergy is still in main.js or should be moved to EnergySystem
        if (typeof window.game.renderEnergy === 'function') window.game.renderEnergy();
    }
}
