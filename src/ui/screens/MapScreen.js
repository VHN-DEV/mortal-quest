import { state } from '../../state.js';
import { getWorlds, getLocationById, DANGER_LEVELS } from '../../configs/map-data.js';
import { getRealmById } from '../../configs/realm-data.js';
import { ASSETS } from '../../configs/asset-data.js';
import { logger } from '../../utils/logger.js';
import { getRandomEvent } from '../../configs/event-data.js';
import { SECTS } from '../../configs/sect-data.js';
import { Preferences } from '@capacitor/preferences';
import { MINING_NODES } from '../../configs/mining-data.js';
import { audioManager } from '../../utils/audio-manager.js';
import { gsap } from 'gsap';

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
        this.elExploreBg = document.getElementById('explore-bg');
        this.elExploreNpcList = document.getElementById('explore-npc-list');

        // Progress Bars
        this.elExploreBar = document.getElementById('explore-bar');
        this.elExploreProgress = document.getElementById('explore-progress');

        // Dashboard Stats
        this.elEnvConcentration = document.getElementById('env-concentration');
        this.elEnvTimeRate = document.getElementById('env-timerate');
        this.elEnvPurityTag = document.getElementById('env-purity-tag');

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
            this.btnBackToLocs.onclick = async () => {
                state.ui.toggleOverlay(this.viewExplore, false);
                state.ui.toggleOverlay(this.viewLocations, true);
                await Preferences.set({ key: 'mortal_quest_map_view', value: 'locations' });
                if (state.systems.time) state.systems.time.timeMultiplier = 1.0;
            };
        }

        if (this.btnBackToWorlds) {
            this.btnBackToWorlds.onclick = async () => {
                state.ui.toggleOverlay(this.viewLocations, false);
                state.ui.toggleOverlay(this.viewWorlds, true);
                await Preferences.set({ key: 'mortal_quest_map_view', value: 'worlds' });
            };
        }

        if (this.btnLeaveLoc) {
            this.btnLeaveLoc.onclick = async () => {
                state.ui.toggleOverlay(this.viewExplore, false);
                state.ui.toggleOverlay(this.viewLocations, true);
                await Preferences.set({ key: 'mortal_quest_map_view', value: 'locations' });
                if (state.systems.time) state.systems.time.timeMultiplier = 1.0;
            };
        }
    }

    /**
     * Khôi phục chế độ xem từ trạng thái đã lưu
     */
    async restoreView() {
        if (!state.player) {
            logger.warn('game', 'MapScreen: No player found during restoreView');
            return;
        }

        const { value: savedView } = await Preferences.get({ key: 'mortal_quest_map_view' });
        if (savedView === 'locations' && state.currentWorldId) {
            await this.selectWorld(state.currentWorldId);
        } else if (savedView === 'explore' && state.currentWorldId && state.currentLocId) {
            // Restore location info and show explore view
            const w = getWorlds()[state.currentWorldId];
            if (w) this.elCurrentWorldName.textContent = w.name;
            const loc = getLocationById(state.currentWorldId, state.currentLocId);
            if (loc) {
                await this.startExploration(state.currentLocId, false);
            } else {
                logger.warn('game', 'MapScreen: Location not found, falling back to world list');
                this.renderWorldList();
                state.ui.toggleOverlay(this.viewWorlds, true);
                state.ui.toggleOverlay(this.viewLocations, false);
                state.ui.toggleOverlay(this.viewExplore, false);
            }
        } else {
            // Default to world list
            this.renderWorldList();
            state.ui.toggleOverlay(this.viewWorlds, true);
            state.ui.toggleOverlay(this.viewLocations, false);
            state.ui.toggleOverlay(this.viewExplore, false);
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
            el.className = `group relative overflow-hidden p-5 rounded-[2rem] border transition-all duration-500 active:scale-[0.98] ${locked ? 'bg-black/20 border-white/5 opacity-60' : 'bg-qi-ink/40 border-white/10 hover:border-qi-blue/50 hover:bg-black/60 shadow-xl'}`;

            const reqRealmName = getRealmById(w.minRealm).name;

            el.innerHTML = `
                <div class="absolute -top-10 -right-10 w-24 h-24 bg-qi-blue/5 rounded-full blur-2xl group-hover:bg-qi-blue/20 transition-all"></div>
                <div class="relative z-10 flex flex-col space-y-3">
                    <div class="flex justify-between items-start">
                        <div class="space-y-1">
                            <span class="text-2xl font-charm text-white group-hover:text-qi-blue transition-colors">${w.name}</span>
                            <div class="text-[9px] text-gray-500 font-ancient tracking-[0.2em] uppercase opacity-60">Cõi Giới</div>
                        </div>
                        <span class="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${locked ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-qi-blue/10 text-qi-blue border border-qi-blue/20'}">
                            ${locked ? '<i class="ph ph-lock mr-1"></i> ' + reqRealmName : '<i class="ph ph-check-circle mr-1"></i> Đã mở'}
                        </span>
                    </div>
                    <p class="text-xs text-gray-400 font-ancient leading-relaxed opacity-80">${w.description}</p>
                    <div class="flex items-center space-x-2 pt-2 text-[9px] text-gray-600 font-ancient uppercase tracking-widest">
                        <i class="ph ph-map-trifold"></i>
                        <span>${w.locations ? w.locations.length : 0} Địa điểm khám phá</span>
                    </div>
                </div>
            `;

            el.onclick = () => {
                if (locked) {
                    state.ui.toast(`Cảnh giới không đủ! Yêu cầu: ${reqRealmName}`, 'warning');
                    return;
                }
                this.selectWorld(id);
            };

            this.elWorldList.appendChild(el);
        });
    }

    async selectWorld(id) {
        if (!id) return;
        const w = getWorlds()[id];
        if (!w) {
            state.ui.toast("Không tìm thấy dữ liệu thế giới!", "error");
            return;
        }

        state.currentWorldId = id;
        this.elCurrentWorldName.textContent = w.name;
        state.ui.toggleOverlay(this.viewWorlds, false);
        state.ui.toggleOverlay(this.viewLocations, true);
        await Preferences.set({ key: 'mortal_quest_map_view', value: 'locations' });
        this.renderLocationList();
        if (state.systems.time) state.systems.time.timeMultiplier = 1.0;
    }

    renderLocationList() {
        const w = getWorlds()[state.currentWorldId];
        if (!w) return;
        this.elLocList.innerHTML = '';
        
        w.locations.forEach(loc => {
            const playerRealm = state.player.getRealmById ? state.player.getRealmById(state.player.realmId) : getRealmById(state.player.realmId);
            const locked = state.player.realmId < loc.minRealm;
            const el = document.createElement('div');
            el.className = `location-card h-40 p-5 flex flex-col justify-end ${locked ? 'opacity-40 grayscale' : 'cursor-pointer'}`;

            const dangerInfo = DANGER_LEVELS[loc.danger] || { name: loc.danger };
            const dangerClass = `danger-${loc.danger}`;
            const reqRealmName = getRealmById(loc.minRealm).name;

            el.innerHTML = `
                <img src="${loc.image || ASSETS.backgrounds.cultivation}" class="location-card-image">
                <div class="relative z-10 space-y-1">
                    <div class="flex justify-between items-center">
                        <h4 class="text-xl font-bold text-white group-hover:text-qi-blue transition-colors">${loc.name}</h4>
                        ${locked ? '<i class="ph ph-lock text-red-500"></i>' : ''}
                    </div>
                    <p class="text-[10px] text-gray-300 font-serif line-clamp-1 opacity-70">${loc.description}</p>
                    <div class="flex items-center space-x-2 pt-1">
                        <span class="px-2 py-0.5 rounded border text-[7px] uppercase font-bold tracking-widest ${dangerClass}">${dangerInfo.name}</span>
                        <span class="text-[7px] text-gray-500 uppercase tracking-widest">Yêu cầu: ${reqRealmName}</span>
                    </div>
                </div>
            `;

            el.onclick = () => {
                if (locked) {
                    state.ui.toast(`Cảnh giới không đủ! Yêu cầu: ${reqRealmName}`, 'warning');
                    return;
                }
                this.startExploration(loc.id);
            };

            this.elLocList.appendChild(el);
        });
    }

    getDangerClass(danger) {
        return `danger-${danger}`;
    }

    async startExploration(locId, resetProgress = true) {
        if (!locId) return;
        
        const loc = getLocationById(state.currentWorldId, locId);
        if (!loc) {
            console.error(`Location not found: ${locId} in world ${state.currentWorldId}`);
            state.ui.toast("Không tìm thấy dữ liệu địa điểm!", "error");
            return;
        }

        state.currentLocId = locId;

        // LOGIC: If it's a direct-entry special location, skip the dashboard
        if (loc.special === 'mountain') {
            if (window.game.openMountain) window.game.openMountain();
            return;
        }
        if (loc.id === 'van_bao_cac' || loc.id === 'linh_bao_lau') {
            if (window.game.openShop) window.game.openShop(null, loc.id);
            return;
        }
        if (loc.special === 'tower') {
            if (window.game.openTower) window.game.openTower();
            return;
        }
        if (loc.special === 'guild') {
            if (window.game.openGuild) window.game.openGuild();
            return;
        }
        if (SECTS[loc.id]) {
            if (window.game.openSect) window.game.openSect();
            return;
        }

        this.elCurrentLocName.textContent = loc.name;
        if (resetProgress) state.explorationProgress = 0;

        state.ui.toggleOverlay(this.viewExplore, true);
        
        gsap.fromTo(this.viewExplore, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
        
        await Preferences.set({ key: 'mortal_quest_map_view', value: 'explore' });

        this.updateExplorationUI();
        this.updateEventDisplay('Ngươi đã tới địa điểm.', '🚶');

        if (state.systems.time) {
            state.systems.time.timeMultiplier = loc.timeRate || 1.0;
            if (state.systems.time.timeMultiplier !== 1.0) {
                state.ui.toast(`Dòng chảy thời gian tại đây dường như khác biệt... (x${state.systems.time.timeMultiplier})`, 'warning');
            }
        }

        this.renderSpecialActions(loc);
        this.viewExplore.scrollTop = 0;
        this.renderExplore();
        this.renderNPCs();
        this.updateDashboardStats(loc);
        if (window.game && window.game.saveGame) window.game.saveGame();
    }

    updateDashboardStats(loc) {
        if (this.elEnvConcentration && loc.energies && loc.energies.length > 0) {
            const mainEnergy = loc.energies[0];
            this.elEnvConcentration.textContent = `${mainEnergy.concentration}%`;
            this.elEnvConcentration.className = `dashboard-stat-value env-glow-${mainEnergy.type.replace(/_/g, '-')}`;

            if (this.elEnvPurityTag) {
                const purityMap = {
                    'TINH_THUAN': 'Tinh Thuần',
                    'CUC_PHAM': 'Cực Phẩm',
                    'TAP': 'Tạp Chất',
                    'DAO': 'Đạo Vận'
                };
                this.elEnvPurityTag.textContent = `${mainEnergy.type.replace(/_/g, ' ').toUpperCase()} - ${purityMap[mainEnergy.purity] || 'Thường'}`;
            }
        }
        if (this.elEnvTimeRate) {
            this.elEnvTimeRate.textContent = `${(loc.timeRate || 1.0).toFixed(1)}x`;
        }
    }

    handleMove() {
        if (state.player.stamina < 5) {
            state.ui.toast('Thể lực khô cạn!', 'error');
            return;
        }

        state.player.stamina -= 5;

        if (state.systems.time) state.systems.time.advanceTime(1);
        audioManager.playSfx('move');

        state.explorationProgress += 5 + Math.random() * 5;
        if (state.explorationProgress >= 100) state.explorationProgress = 100;
        this.updateExplorationUI();

        const loc = getLocationById(state.currentWorldId, state.currentLocId);
        const probs = loc.eventProbs || { combat: 0.1, loot: 0.1, npc: 0.05, empty: 0.75 };

        const event = getRandomEvent(probs);

        if (event) {
            this.updateEventDisplay(event.description, event.icon || '📜');
            if (event.type === 'loot') {
                const resultMsg = event.result(state.player);
                const droppedShi = Math.floor(Math.random() * 10 * state.player.realmId);
                state.player.addLingShi(droppedShi);
                setTimeout(() => {
                    this.updateEventDisplay(resultMsg + ` (+${droppedShi} LT)`, '🎁');
                    if (window.game) window.game.saveGame();
                }, 1000);
            } else if (event.type === 'npc') {
                setTimeout(() => {
                    // Decide which NPC to open based on context or just generic
                    window.game.openNPC();
                }, 1000);
            } else if (event.type === 'shop') {
                window.game.openShop();
            } else if (event.type === 'combat') {
                setTimeout(() => { window.game.handleCombatEncounter(state.currentWorldId, state.currentLocId); }, 1000);
            } else if (event.type === 'interactive') {
                setTimeout(async () => {
                    const choice = await state.ui.promptOptions(event.name, event.options, event.description);
                    if (choice && event.resolve) {
                        const result = await event.resolve(choice, state.player, window.game);
                        if (result) {
                            if (result.msg) this.updateEventDisplay(result.msg, '📜');
                            if (result.type === 'combat_then_loot') {
                                window.game.handleCombatEncounter(state.currentWorldId, state.currentLocId, (win) => {
                                    if (win && result.loot) {
                                        window.game.receiveItem(result.loot, 1);
                                    }
                                });
                            }
                        }
                    }
                    if (window.game) window.game.saveGame();
                }, 1000);
            }
        } else {
            const emptyMsgs = [
                'Một chặng đường yên tĩnh.',
                'Gió thổi xào xạc qua kẽ lá, không một bóng người.',
                'Ngươi lẳng lặng tiến bước, tâm thần hòa vào thiên địa.',
                'Tiếng chim kêu xa xăm, cảnh vật thanh bình.',
                'Mọi thứ dường như tĩnh lặng đến lạ thường.',
                'Cảnh sắc xung quanh tuy đẹp nhưng không có gì bất ngờ xảy ra.'
            ];
            this.updateEventDisplay(emptyMsgs[Math.floor(Math.random() * emptyMsgs.length)], '🚶');
        }

        if (state.explorationProgress >= 100) {
            setTimeout(() => {
                state.ui.toast(`Ngươi đã hoàn thành lịch luyện tại ${loc.name}!`, 'success');
                state.explorationProgress = 0;
                this.updateExplorationUI();
            }, 1500);
        }

        this.renderNPCs();
    }

    renderSpecialActions(loc) {
        if (!this.elLocSpecialActions) return;
        this.elLocSpecialActions.innerHTML = '';
        let hasSpecial = false;

        // Special actions mapped to window.game functions
        if (loc.id === 'van_bao_cac' || loc.id === 'linh_bao_lau') {
            hasSpecial = true;
            this.elLocSpecialActions.innerHTML = `
                <button onclick="window.game.openShop('buy', '${loc.id}')" class="py-3 bg-cultivation-gold/10 border border-cultivation-gold/30 rounded-xl text-cultivation-gold text-[10px] font-bold uppercase tracking-widest flex flex-col items-center justify-center">
                    <i class="ph ph-shopping-cart text-lg mb-1"></i>TRAO ĐỔI
                </button>
                <button onclick="window.game.openShop('sell', '${loc.id}')" class="py-3 bg-qi-blue/10 border border-qi-blue/30 rounded-xl text-qi-blue text-[10px] font-bold uppercase tracking-widest flex flex-col items-center justify-center">
                    <i class="ph ph-currency-circle-dollar text-lg mb-1"></i>GIAO DỊCH
                </button>
                ${loc.id === 'van_bao_cac' ? `
                <button onclick="window.game.openAuction()" class="col-span-2 py-3 bg-qi-purple/10 border border-qi-purple/30 rounded-xl text-qi-purple text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
                    <i class="ph ph-hammer text-lg"></i><span>ĐẤU GIÁ</span>
                </button>
                ` : ''}
            `;
        } else if (SECTS[loc.id]) {
            hasSpecial = true;
            this.elLocSpecialActions.innerHTML = `
                <button onclick="window.game.openSect()" class="col-span-2 py-3 bg-qi-purple/10 border border-qi-purple/30 rounded-xl text-qi-purple text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
                    <i class="ph ph-castle-turret text-lg"></i><span>VÀO TÔNG MÔN</span>
                </button>
            `;
        } else if (loc.special === 'guild') {
            hasSpecial = true;
            this.elLocSpecialActions.innerHTML = `
                <button onclick="window.game.openGuild()" class="col-span-2 py-3 bg-qi-blue/10 border border-qi-blue/30 rounded-xl text-qi-blue text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
                    <i class="ph ph-users text-lg"></i><span>VÀO CÔNG HỘI</span>
                </button>
            `;
        } else if (loc.special === 'tower') {
            hasSpecial = true;
            this.elLocSpecialActions.innerHTML = `
                <button onclick="window.game.openTower()" class="col-span-2 py-3 bg-cultivation-gold/10 border border-cultivation-gold/30 rounded-xl text-cultivation-gold text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
                    <i class="ph ph-tower text-lg"></i><span>VÀO ĐAN THÁP</span>
                </button>
            `;
        } else if (loc.special === 'mountain') {
            hasSpecial = true;
            this.elLocSpecialActions.innerHTML = `
                <button onclick="window.game.openMountain()" class="col-span-2 py-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
                    <i class="ph ph-mountains text-lg"></i><span>VÀO ĐẠI SƠN</span>
                </button>
            `;
        }

        // Add Mining button if there are mining nodes here
        const hasNodes = MINING_NODES.some(n => n.locationId === loc.id);
        if (hasNodes) {
            hasSpecial = true;
            const btnMining = document.createElement('button');
            btnMining.className = "col-span-2 py-3 bg-qi-blue/10 border border-qi-blue/30 rounded-xl text-qi-blue text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2 mt-2";
            btnMining.innerHTML = '<i class="ph ph-pickaxe text-lg"></i><span>KHAI KHOÁNG</span>';
            btnMining.onclick = () => window.game.openMining();
            this.elLocSpecialActions.appendChild(btnMining);
        }

        state.ui.toggleOverlay(this.elLocSpecialActions, hasSpecial);
    }

    updateEventDisplay(text) {
        if (this.elEventText) this.elEventText.textContent = text;
    }

    updateExplorationUI() {
        if (this.elExploreProgress) this.elExploreProgress.textContent = `${ Math.floor(state.explorationProgress) }% `;
        if (this.elExploreBar) this.elExploreBar.style.width = `${ state.explorationProgress }% `;
    }

    renderExplore() {
        const loc = getLocationById(state.currentWorldId, state.currentLocId);
        if (!loc) return;

        const defaultBg = ASSETS.backgrounds.cultivation;
        const bgUrl = loc.image || ASSETS.backgrounds[loc.id] || defaultBg;
        
        if (this.elExploreBg) {
            this.elExploreBg.style.backgroundImage = `url('${bgUrl}')`;
        }

        if (this.elCurrentWorldNameSub) {
            const world = getWorlds()[state.currentWorldId];
            this.elCurrentWorldNameSub.textContent = world ? world.name : 'Vô Danh Giới';
        }
    }

    renderNPCs() {
        if (!this.elExploreNpcList) return;
        
        const npcs = state.systems.npc.npcs.filter(n => n.location === state.currentLocId);
        
        if (npcs.length === 0) {
            this.elExploreNpcList.innerHTML = '';
            return;
        }

        this.elExploreNpcList.innerHTML = `
            <div class="flex items-center space-x-2 px-2 mb-2">
                <div class="w-1.5 h-1.5 rounded-full bg-qi-blue animate-pulse"></div>
                <span class="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Cường Giả Hiện Diện (${npcs.length})</span>
            </div>
            <div class="flex flex-col space-y-2">
                    ${npcs.map(npc => `
                    <div class="flex items-center justify-between p-3 bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl group hover:border-qi-blue/30 transition-all cursor-pointer"
                         onclick="window.game.openNPCDialogue('${npc.id}')">
                        <div class="flex items-center space-x-3">
                            <div class="relative">
                                <img src="${npc.portrait}" class="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-lg">
                                <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-qi-jade rounded-full border-2 border-black shadow-sm"></div>
                            </div>
                            <div>
                                <div class="text-[10px] font-bold text-white group-hover:text-qi-blue transition-colors">${npc.name}</div>
                                <div class="text-[8px] text-gray-500 uppercase tracking-tighter">${getRealmById(npc.realmId).name}</div>
                            </div>
                        </div>
                        <i class="ph ph-chat-circle-dots text-qi-blue opacity-40 group-hover:opacity-100 transition-opacity"></i>
                    </div>
                `).join('')}
                </div>
            `;
    }
}
