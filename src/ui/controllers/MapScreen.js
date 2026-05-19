import { state } from '../../state.js';
import { getWorlds, getLocationById, DANGER_LEVELS, findLocationName } from '../../configs/map-data.js';
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
        this.mapNavLevel = 'regions'; // 'regions', 'subregions', 'locations'
        this.selectedRegionId = null;
        this.selectedSubRegionId = null;

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
        this.elEnvElementQiGrid = document.getElementById('env-element-qi-grid');

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
                if (this.mapNavLevel === 'locations') {
                    this.mapNavLevel = 'subregions';
                    this.selectedSubRegionId = null;
                    this.renderLocationList();
                } else if (this.mapNavLevel === 'subregions') {
                    this.mapNavLevel = 'regions';
                    this.selectedRegionId = null;
                    this.renderLocationList();
                } else {
                    // level is 'regions', go back to world list screen
                    state.ui.toggleOverlay(this.viewLocations, false);
                    state.ui.toggleOverlay(this.viewWorlds, true);
                    await Preferences.set({ key: 'mortal_quest_map_view', value: 'worlds' });
                }
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
            this.mapNavLevel = 'regions';
            this.selectedRegionId = null;
            this.selectedSubRegionId = null;
            await this.selectWorld(state.currentWorldId);
        } else if (savedView === 'explore' && state.currentWorldId && state.currentLocId) {
            // Restore location info and show explore view
            this.viewedWorldId = state.currentWorldId;
            const w = getWorlds()[state.currentWorldId];
            if (w) this.elCurrentWorldName.textContent = w.name;
            const loc = getLocationById(state.currentWorldId, state.currentLocId);
            if (loc) {
                await this.startExploration(state.currentLocId, false, true); // skipTravel when restoring
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

        this.viewedWorldId = id;

        this.mapNavLevel = 'regions';
        this.selectedRegionId = null;
        this.selectedSubRegionId = null;

        this.elCurrentWorldName.textContent = w.name;
        state.ui.toggleOverlay(this.viewWorlds, false);
        state.ui.toggleOverlay(this.viewLocations, true);
        await Preferences.set({ key: 'mortal_quest_map_view', value: 'locations' });
        this.renderLocationList();
        if (state.systems.time) state.systems.time.timeMultiplier = 1.0;
    }

    renderLocationList() {
        const w = getWorlds()[this.viewedWorldId];
        if (!w) return;
        this.elLocList.innerHTML = '';
        
        const elSub = this.elCurrentWorldNameSub || document.getElementById('current-world-name-sub');
        const elCurrentLocBadge = document.getElementById('player-current-loc-badge');
        if (elCurrentLocBadge && state.currentLocId) {
            elCurrentLocBadge.textContent = `Đang ở: ${findLocationName(state.currentLocId)}`;
        }

        if (this.mapNavLevel === 'regions') {
            this.elCurrentWorldName.textContent = w.name;
            if (elSub) elSub.textContent = 'Chọn Đại Lục / Hải Vực';

            // Find unique regions
            const regionsMap = new Map();
            w.locations.forEach(loc => {
                if (loc.regionId) {
                    regionsMap.set(loc.regionId, loc.regionName || loc.regionId);
                }
            });

            if (regionsMap.size === 0) {
                // Fallback to locations list
                this.mapNavLevel = 'locations';
                this.renderLocationList();
                return;
            }

            regionsMap.forEach((regionName, regionId) => {
                const el = document.createElement('div');
                el.className = 'location-card h-40 p-5 flex flex-col justify-end cursor-pointer';

                const previewLoc = w.locations.find(loc => loc.regionId === regionId);
                const previewImg = previewLoc?.image || ASSETS.backgrounds.cultivation;

                el.innerHTML = `
                    <img src="${previewImg}" class="location-card-image">
                    <div class="relative z-10 space-y-1">
                        <div class="flex justify-between items-center">
                            <h4 class="text-xl font-bold text-white group-hover:text-qi-blue transition-colors">${regionName}</h4>
                            <i class="ph ph-caret-right text-qi-blue text-xl"></i>
                        </div>
                        <p class="text-[10px] text-gray-300 font-serif line-clamp-1 opacity-70">Lịch luyện thám hiểm khu vực ${regionName}</p>
                    </div>
                `;

                el.onclick = () => {
                    this.selectedRegionId = regionId;
                    this.mapNavLevel = 'subregions';
                    this.renderLocationList();
                };

                this.elLocList.appendChild(el);
            });

        } else if (this.mapNavLevel === 'subregions') {
            const regionName = w.locations.find(loc => loc.regionId === this.selectedRegionId)?.regionName || this.selectedRegionId;
            this.elCurrentWorldName.textContent = regionName;
            if (elSub) elSub.textContent = 'Chọn Quốc Gia / Tông Môn / Thành Trì';

            // Find unique subregions
            const subRegionsMap = new Map();
            w.locations.forEach(loc => {
                if (loc.regionId === this.selectedRegionId && loc.subRegionId) {
                    subRegionsMap.set(loc.subRegionId, loc.subRegionName || loc.subRegionId);
                }
            });

            if (subRegionsMap.size === 0) {
                this.mapNavLevel = 'locations';
                this.renderLocationList();
                return;
            }

            subRegionsMap.forEach((subName, subId) => {
                const el = document.createElement('div');
                el.className = 'location-card h-40 p-5 flex flex-col justify-end cursor-pointer';

                const previewLoc = w.locations.find(loc => loc.subRegionId === subId);
                const previewImg = previewLoc?.image || ASSETS.backgrounds.cultivation;

                el.innerHTML = `
                    <img src="${previewImg}" class="location-card-image">
                    <div class="relative z-10 space-y-1">
                        <div class="flex justify-between items-center">
                            <h4 class="text-xl font-bold text-white group-hover:text-qi-blue transition-colors">${subName}</h4>
                            <i class="ph ph-caret-right text-qi-blue text-xl"></i>
                        </div>
                        <p class="text-[10px] text-gray-300 font-serif line-clamp-1 opacity-70">Thế lực trấn thủ, thành trì giao thương tại ${subName}</p>
                    </div>
                `;

                el.onclick = () => {
                    this.selectedSubRegionId = subId;
                    this.mapNavLevel = 'locations';
                    this.renderLocationList();
                };

                this.elLocList.appendChild(el);
            });

        } else if (this.mapNavLevel === 'locations') {
            const subName = w.locations.find(loc => loc.subRegionId === this.selectedSubRegionId)?.subRegionName || this.selectedSubRegionId;
            this.elCurrentWorldName.textContent = subName;
            if (elSub) elSub.textContent = 'Chọn Địa Điểm Lịch Luyện';

            const filteredLocs = w.locations.filter(loc => loc.subRegionId === this.selectedSubRegionId);

            filteredLocs.forEach(loc => {
                const minLocked = state.player.realmId < loc.minRealm;
                const maxLocked = loc.maxRealm !== undefined && state.player.realmId > loc.maxRealm;
                const locked = minLocked || maxLocked;
                
                const el = document.createElement('div');
                el.className = `location-card h-40 p-5 flex flex-col justify-end ${locked ? 'opacity-40 grayscale' : 'cursor-pointer'}`;

                const relDanger = this.getRelativeDanger(loc);
                const dangerInfo = DANGER_LEVELS[relDanger] || { name: relDanger };
                const dangerClass = `danger-${relDanger}`;
                const reqRealmName = getRealmById(loc.minRealm).name;

                let reqLabel = `Yêu cầu: ${reqRealmName}`;
                if (loc.maxRealm !== undefined) {
                    const maxRealmName = getRealmById(loc.maxRealm).name;
                    reqLabel = `Giới hạn: ${reqRealmName} - ${maxRealmName}`;
                }

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
                            <span class="text-[7px] text-gray-500 uppercase tracking-widest">${reqLabel}</span>
                        </div>
                    </div>
                `;

                el.onclick = () => {
                    if (minLocked) {
                        state.ui.toast(`Cảnh giới không đủ! Yêu cầu: ${reqRealmName}`, 'warning');
                        return;
                    }
                    if (maxLocked) {
                        const failMsg = loc.maxRealmMessage || `Cảnh giới của ngươi quá cao để vào cấm địa này! Sức ép không gian sẽ làm nó sụp đổ!`;
                        state.ui.toast(failMsg, 'warning');
                        return;
                    }
                    this.startExploration(loc.id);
                };

                this.elLocList.appendChild(el);
            });
        }
    }

    getRelativeDanger(loc) {
        if (!state.player) return loc.danger || 'ha_cap';
        
        const playerRealm = state.player.realmId;
        const minRealm = loc.minRealm;
        const baseDanger = loc.danger || 'ha_cap';
        
        const dangerOrder = ['an_toan', 'ha_cap', 'trung_cap', 'cao_cap', 'nguy_hiem', 'cuc_ky_nguy_hiem', 'tu_dia'];
        let baseIndex = dangerOrder.indexOf(baseDanger);
        if (baseIndex === -1) baseIndex = 1;

        // Calculate adjustment based on realm difference
        const diff = playerRealm - minRealm;
        let adjustment = 0;

        if (diff > 10) adjustment = -2; // Much stronger
        else if (diff > 5) adjustment = -1; // Stronger
        else if (diff < -5) adjustment = 2; // Much weaker
        else if (diff < 0) adjustment = 1; // Weaker (e.g. Mortal in Level 1 area)
        
        // Special logic for Mortals (Realm 0)
        if (playerRealm === 0 && minRealm === 0 && baseIndex < 4) {
            // Even if minRealm is 0, a mortal finds 'ha_cap' to be 'trung_cap'
            adjustment += 1;
        }

        let adjustedIndex = Math.max(0, Math.min(dangerOrder.length - 1, baseIndex + adjustment));
        return dangerOrder[adjustedIndex];
    }

    getDangerClass(danger) {
        return `danger-${danger}`;
    }

    async startExploration(locId, resetProgress = true, skipTravel = false) {
        if (!locId) return;
        
        const loc = getLocationById(this.viewedWorldId || state.currentWorldId, locId);
        if (!loc) {
            console.error(`Location not found: ${locId} in world ${state.currentWorldId}`);
            state.ui.toast("Không tìm thấy dữ liệu địa điểm!", "error");
            return;
        }

        // TRAVEL SYSTEM INTEGRATION
        if (!skipTravel && state.currentLocId !== locId) {
            if (state.systems.travel) {
                const started = state.systems.travel.startTravel(locId);
                if (started) {
                    // Halt here. The TravelSystem will call startExploration again with skipTravel=true when done.
                    return;
                }
            } else {
                // Fallback travel time: 1-7 days (1 day = 12 hours = 144 mins)
                const travelMins = (1 + Math.floor(Math.random() * 7)) * 144;
                if (state.systems.time) state.systems.time.skipTime(travelMins);
            }
        }

        if (this.viewedWorldId) {
            state.currentWorldId = this.viewedWorldId;
        }
        state.currentLocId = locId;
        if (state.player && typeof state.player.calculateStats === 'function') {
            state.player.calculateStats();
        }

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

        // Render 10-element Local Qi Distribution Grid
        if (this.elEnvElementQiGrid) {
            const ELEMENT_COLORS = {
                'Kim': '#fcd34d', 'Mộc': '#4ade80', 'Thủy': '#3b82f6', 'Hỏa': '#ef4444', 'Thổ': '#d97706',
                'Phong': '#94a3b8', 'Lôi': '#fbbf24', 'Băng': '#60a5fa', 'Quang': '#fffbeb', 'Ám': '#a855f7'
            };
            const ELEMENT_ICONS = {
                'Kim': '⚔️', 'Mộc': '🌿', 'Thủy': '💧', 'Hỏa': '🔥', 'Thổ': '⛰️',
                'Phong': '🌪️', 'Lôi': '⚡', 'Băng': '❄️', 'Quang': '☀️', 'Ám': '🌙'
            };

            // Get location specific elementQi or default balanced
            const defaultQi = {
                'Kim': 15, 'Mộc': 15, 'Thủy': 15, 'Hỏa': 15, 'Thổ': 15,
                'Phong': 5, 'Lôi': 5, 'Băng': 5, 'Quang': 5, 'Ám': 5
            };
            const elementQi = loc.elementQi || defaultQi;

            const elements = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ', 'Phong', 'Lôi', 'Băng', 'Quang', 'Ám'];
            this.elEnvElementQiGrid.innerHTML = elements.map(el => {
                const pct = elementQi[el] || 0;
                const color = ELEMENT_COLORS[el];
                const icon = ELEMENT_ICONS[el];
                const active = pct > 0;

                return `
                    <div class="flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all select-none
                        ${active ? 'bg-white/[0.02] border-white/10' : 'bg-black/10 border-white/[0.02] opacity-30'}"
                        style="${active ? `border-color: ${color}20 !important; box-shadow: inset 0 0 4px ${color}10 !important;` : ''}">
                        <span class="text-xs filter drop-shadow-[0_0_2px_${color}]" style="color: ${color}">${icon}</span>
                        <span class="text-[7px] font-ancient font-semibold text-gray-400 mt-0.5">${el}</span>
                        <span class="text-[8px] font-mono font-bold mt-0.5" style="color: ${active ? color : '#6b7280'}">${pct}%</span>
                    </div>
                `;
            }).join('');
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
            const desc = typeof event.description === 'function' ? event.description(state.player) : event.description;
            this.updateEventDisplay(desc, event.icon || '📜');
            
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
                    const finalDesc = typeof event.description === 'function' ? event.description(state.player) : event.description;
                    const finalOptions = typeof event.options === 'function' ? event.options(state.player) : event.options;
                    const eventKey = event.image ? event.image.replace('events/', '') : '';
                    const eventImage = eventKey ? ASSETS.events[eventKey] : '';
                    const choice = await state.ui.promptOptions(event.name, finalOptions, finalDesc, eventImage);
                    
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
            const isMember = state.player.sectId === loc.id;
            
            // Check recruitment time: months 1-2 of even-numbered years
            const timeSys = state.systems.time;
            const isEvenYear = timeSys ? (timeSys.getYear() % 2 === 0) : true;
            const isRecruitMonth = timeSys ? (timeSys.getMonth() === 1 || timeSys.getMonth() === 2) : true;
            const isRecruiting = isEvenYear && isRecruitMonth;
            
            if (isMember) {
                this.elLocSpecialActions.innerHTML = `
                    <button onclick="window.game.openSect()" class="col-span-2 py-3 bg-qi-purple/10 border border-qi-purple/30 rounded-xl text-qi-purple text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
                        <i class="ph ph-castle-turret text-lg"></i><span>VÀO TÔNG MÔN</span>
                    </button>
                `;
            } else {
                // If not a member, always show "Bái Nhập Tông Môn" (Apply to Join)
                let buttonsHTML = `
                    <button onclick="window.game.startSectApplication('${loc.id}')" class="py-3 bg-qi-blue/10 border border-qi-blue/30 rounded-xl text-qi-blue text-[10px] font-bold uppercase tracking-widest flex flex-col items-center justify-center col-span-2">
                        <i class="ph ph-user-plus text-lg mb-1"></i>BÁI NHẬP TÔNG MÔN
                    </button>
                `;

                if (isRecruiting) {
                    buttonsHTML = `
                        <button onclick="window.game.startSectApplication('${loc.id}')" class="py-3 bg-qi-blue/10 border border-qi-blue/30 rounded-xl text-qi-blue text-[10px] font-bold uppercase tracking-widest flex flex-col items-center justify-center">
                            <i class="ph ph-user-plus text-lg mb-1"></i>BÁI NHẬP
                        </button>
                        <button onclick="window.game.startRecruitmentExam('${loc.id}')" class="py-3 bg-cultivation-gold/10 border border-cultivation-gold/30 rounded-xl text-cultivation-gold text-[10px] font-bold uppercase tracking-widest flex flex-col items-center justify-center animate-pulse">
                            <i class="ph ph-scroll text-lg mb-1 animate-bounce"></i>THAM GIA KHẢO HẠCH
                        </button>
                    `;
                } else {
                    const recruitTimeStr = "Tháng 1-2 năm chẵn";
                    buttonsHTML = `
                        <button onclick="window.game.startSectApplication('${loc.id}')" class="py-3 bg-qi-blue/10 border border-qi-blue/30 rounded-xl text-qi-blue text-[10px] font-bold uppercase tracking-widest flex flex-col items-center justify-center">
                            <i class="ph ph-user-plus text-lg mb-1"></i>BÁI NHẬP TÔNG MÔN
                        </button>
                        <div class="flex flex-col items-center justify-center p-2 bg-white/5 border border-white/10 rounded-xl text-center space-y-0.5">
                            <span class="text-gray-400 text-[8px] font-bold uppercase tracking-wider">ĐẠI TUYỂN CHƯA MỞ</span>
                            <span class="text-[7px] text-gray-500">${recruitTimeStr}</span>
                        </div>
                    `;
                }
                this.elLocSpecialActions.innerHTML = buttonsHTML;
            }
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
