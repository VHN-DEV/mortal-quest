import { state } from '../../state.js';
import { getWorlds, getLocationById, DANGER_LEVELS, findLocationName } from '../../configs/map-data.js';
import { getRealmById } from '../../configs/realm-data.js';
import { ASSETS, getAssetUrl } from '../../configs/asset-data.js';
import { logger } from '../../utils/logger.js';
import { getRandomEvent } from '../../configs/event-data.js';
import { SECTS } from '../../configs/sect-data.js';
import { Preferences } from '@capacitor/preferences';
import { MINING_NODES } from '../../configs/mining-data.js';
import { audioManager } from '../../utils/audio-manager.js';
import { gsap } from 'gsap';
import { getItemById } from '../../configs/item-data.js';
import { EnemyGenerator } from '../../core/enemy.js';
import { BEASTS } from '../../configs/beast-data.js';

const BEAST_IMAGES = [
    'beasts/huyen-giap-dia-long',
    'beasts/thanh-van-ly-thu',
    'beasts/u-minh-mong-diep',
    'enemies/black_tiger',
    'enemies/demon_cultivator',
    'enemies/dragon_legacy',
    'enemies/fire_dragon',
    'enemies/rogue_cultivator',
    'enemies/spirit_wolf',
    'enemies/wolf_legacy',
    'enemies/zombie'
];

const NPC_IMAGES = [
    'portraits/bach_minh_anh',
    'portraits/bach_tu_linh',
    'portraits/bang_nguyet',
    'portraits/cultivator_legacy',
    'portraits/demon',
    'portraits/du_nhuoc_nhan',
    'portraits/han_lap',
    'portraits/han_phi_vu',
    'portraits/han_vien',
    'portraits/kiem_vo_tam',
    'portraits/lan_anh',
    'portraits/merchant',
    'portraits/minh_nguyet',
    'portraits/phuong_ca',
    'portraits/phuong_vu',
    'portraits/sect_elder',
    'portraits/thanh_lien',
    'portraits/thanh_nhi',
    'portraits/tran_tu_huyen',
    'portraits/tu_linh',
    'portraits/vo_danh',
    'portraits/xich_nguyet'
];


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
        this.elExploreContentScroll = document.getElementById('explore-content-scroll');

        // Lists & Containers
        this.elWorldList = document.getElementById('world-list');
        this.elLocList = document.getElementById('location-list');
        this.elLocSpecialActions = document.getElementById('loc-special-actions');

        // Bagua Grid Map Panel
        this.elExploreGridContainer = document.getElementById('explore-grid-container');
        this.elExploreGridBoard = document.getElementById('explore-grid-board');
        this.elExploreGridScrollArea = document.getElementById('explore-grid-scroll-area');

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
                await this.saveNavState();
                if (state.systems.time) state.systems.time.timeMultiplier = 1.0;
            };
        }

        if (this.btnBackToWorlds) {
            this.btnBackToWorlds.onclick = async () => {
                if (this.mapNavLevel === 'locations') {
                    this.mapNavLevel = 'subregions';
                    this.selectedSubRegionId = null;
                    await this.saveNavState();
                    this.renderLocationList();
                } else if (this.mapNavLevel === 'subregions') {
                    this.mapNavLevel = 'regions';
                    this.selectedRegionId = null;
                    await this.saveNavState();
                    this.renderLocationList();
                } else {
                    // level is 'regions', go back to world list screen
                    state.ui.toggleOverlay(this.viewLocations, false);
                    state.ui.toggleOverlay(this.viewWorlds, true);
                    await Preferences.set({ key: 'mortal_quest_map_view', value: 'worlds' });
                    await this.saveNavState();
                }
            };
        }

        if (this.btnLeaveLoc) {
            this.btnLeaveLoc.onclick = async () => {
                state.ui.toggleOverlay(this.viewExplore, false);
                state.ui.toggleOverlay(this.viewLocations, true);
                await Preferences.set({ key: 'mortal_quest_map_view', value: 'locations' });
                await this.saveNavState();
                if (state.systems.time) state.systems.time.timeMultiplier = 1.0;
            };
        }

        if (this.elExploreGridScrollArea) {
            let isDown = false;
            let startX;
            let startY;
            let scrollLeft;
            let scrollTop;

            this.elExploreGridScrollArea.addEventListener('mousedown', (e) => {
                isDown = true;
                this.elExploreGridScrollArea.classList.add('cursor-grabbing');
                this.elExploreGridScrollArea.classList.remove('cursor-grab');
                startX = e.pageX - this.elExploreGridScrollArea.offsetLeft;
                startY = e.pageY - this.elExploreGridScrollArea.offsetTop;
                scrollLeft = this.elExploreGridScrollArea.scrollLeft;
                scrollTop = this.elExploreGridScrollArea.scrollTop;
            });

            this.elExploreGridScrollArea.addEventListener('mouseleave', () => {
                isDown = false;
                this.elExploreGridScrollArea.classList.add('cursor-grab');
                this.elExploreGridScrollArea.classList.remove('cursor-grabbing');
            });

            this.elExploreGridScrollArea.addEventListener('mouseup', () => {
                isDown = false;
                this.elExploreGridScrollArea.classList.add('cursor-grab');
                this.elExploreGridScrollArea.classList.remove('cursor-grabbing');
            });

            this.elExploreGridScrollArea.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - this.elExploreGridScrollArea.offsetLeft;
                const y = e.pageY - this.elExploreGridScrollArea.offsetTop;
                const walkX = (x - startX) * 1.5; 
                const walkY = (y - startY) * 1.5; 
                this.elExploreGridScrollArea.scrollLeft = scrollLeft - walkX;
                this.elExploreGridScrollArea.scrollTop = scrollTop - walkY;
            });
        }
    }

    /**
     * Lưu trạng thái điều hướng bản đồ
     */
    async saveNavState() {
        await Preferences.set({ key: 'mortal_quest_map_nav_level', value: this.mapNavLevel || 'regions' });
        await Preferences.set({ key: 'mortal_quest_map_region_id', value: this.selectedRegionId || '' });
        await Preferences.set({ key: 'mortal_quest_map_subregion_id', value: this.selectedSubRegionId || '' });
        await Preferences.set({ key: 'mortal_quest_map_viewed_world_id', value: this.viewedWorldId || state.currentWorldId || '' });
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
        if (savedView === 'locations') {
            const { value: savedWorldId } = await Preferences.get({ key: 'mortal_quest_map_viewed_world_id' });
            const worldId = savedWorldId || state.currentWorldId || 'nhan_gioi';

            const { value: savedNavLevel } = await Preferences.get({ key: 'mortal_quest_map_nav_level' });
            const { value: savedRegionId } = await Preferences.get({ key: 'mortal_quest_map_region_id' });
            const { value: savedSubRegionId } = await Preferences.get({ key: 'mortal_quest_map_subregion_id' });

            this.mapNavLevel = savedNavLevel || 'regions';
            this.selectedRegionId = savedRegionId || null;
            this.selectedSubRegionId = savedSubRegionId || null;

            await this.selectWorld(worldId, true);
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

    async selectWorld(id, keepState = false) {
        if (!id) return;
        
        const w = getWorlds()[id];
        if (!w) {
            state.ui.toast("Không tìm thấy dữ liệu thế giới!", "error");
            return;
        }

        this.viewedWorldId = id;

        if (!keepState) {
            this.mapNavLevel = 'regions';
            this.selectedRegionId = null;
            this.selectedSubRegionId = null;
        }

        this.elCurrentWorldName.textContent = w.name;
        state.ui.toggleOverlay(this.viewWorlds, false);
        state.ui.toggleOverlay(this.viewLocations, true);
        await Preferences.set({ key: 'mortal_quest_map_view', value: 'locations' });
        await this.saveNavState();
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
                let isLocked = false;
                let lockReason = '';

                if (this.viewedWorldId === 'nhan_gioi' && regionId === 'loan_tinh_hai') {
                    const currentLoc = getLocationById(state.currentWorldId, state.currentLocId);
                    const isAlreadyThere = currentLoc && currentLoc.regionId === 'loan_tinh_hai';
                    if (!isAlreadyThere) {
                        const atTeleport = state.currentLocId === 'thuong_co_truyen_tong_tran';
                        const hasTalisman = state.player.inventory && (
                            state.player.inventory.hasItem('pha_khong_phu') || 
                            state.player.inventory.hasItem('thun_di_phu') || 
                            state.player.inventory.hasItem('truyen_tong_lenh')
                        );
                        const hasBoat = state.player.inventory && (
                            state.player.inventory.hasItem('ngu_phong_phi_chu') || 
                            state.player.inventory.hasItem('linh_thuyen_so')
                        );

                        if (!atTeleport && !hasTalisman && !hasBoat) {
                            isLocked = true;
                            lockReason = 'Cần Truyền Tống Trận, Phi Chu hoặc Truyền Tống Phù';
                        }
                    }
                }

                const el = document.createElement('div');
                if (isLocked) {
                    el.className = 'location-card h-40 p-5 flex flex-col justify-end opacity-65 grayscale';
                } else {
                    el.className = 'location-card h-40 p-5 flex flex-col justify-end cursor-pointer';
                }

                const previewLoc = w.locations.find(loc => loc.regionId === regionId);
                const previewImg = previewLoc?.image || ASSETS.backgrounds.cultivation;

                el.innerHTML = `
                    <img src="${previewImg}" class="location-card-image">
                    <div class="relative z-10 space-y-1">
                        <div class="flex justify-between items-center">
                            <h4 class="text-xl font-charm text-white group-hover:text-qi-blue transition-colors">
                                ${regionName} ${isLocked ? '🔒' : ''}
                            </h4>
                            ${isLocked ? '<i class="ph ph-lock text-red-500 text-lg"></i>' : '<i class="ph ph-caret-right text-qi-blue text-xl"></i>'}
                        </div>
                        <p class="text-[10px] text-gray-300 font-serif line-clamp-1 opacity-70">
                            ${isLocked ? lockReason : `Lịch luyện thám hiểm khu vực ${regionName}`}
                        </p>
                    </div>
                `;

                el.onclick = async () => {
                    if (isLocked) {
                        state.ui.toast("Để đến Loạn Tinh Hải, đạo hữu cần ở Thượng Cổ Truyền Tống Trận, hoặc có Phi Chu (Linh Thuyền, Phi Chu), hoặc có Truyền Tống Phù (Thuấn Di Phù, Phá Không Phù).", "warning");
                        return;
                    }
                    this.selectedRegionId = regionId;
                    this.mapNavLevel = 'subregions';
                    await this.saveNavState();
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
                            <h4 class="text-xl font-charm text-white group-hover:text-qi-blue transition-colors">${subName}</h4>
                            <i class="ph ph-caret-right text-qi-blue text-xl"></i>
                        </div>
                        <p class="text-[10px] text-gray-300 font-serif line-clamp-1 opacity-70">Thế lực trấn thủ, thành trì giao thương tại ${subName}</p>
                    </div>
                `;

                el.onclick = async () => {
                    this.selectedSubRegionId = subId;
                    this.mapNavLevel = 'locations';
                    await this.saveNavState();
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
                
                let isTimeLocked = false;
                let timeMessage = '';
                if (loc.openingRules && state.systems.time) {
                    const timeSys = state.systems.time;
                    const { cycleYears, months, message } = loc.openingRules;
                    const yearMatches = (timeSys.getYear() % cycleYears) === 0;
                    const monthMatches = months.includes(timeSys.getMonth());
                    if (!yearMatches || !monthMatches) {
                        isTimeLocked = true;
                        timeMessage = message || `Chỉ mở vào Tháng ${months.join(', ')} mỗi ${cycleYears} năm.`;
                    }
                }

                const locked = minLocked || maxLocked || isTimeLocked;
                
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
                if (loc.openingRules) {
                    const statusStr = isTimeLocked ? `[Đóng - Hẹn ${timeMessage}]` : `[Đang Mở Cửa!]`;
                    reqLabel += ` | ${statusStr}`;
                }

                el.innerHTML = `
                    <img src="${loc.image || ASSETS.backgrounds.cultivation}" class="location-card-image">
                    <div class="relative z-10 space-y-1">
                        <div class="flex justify-between items-center">
                            <h4 class="text-xl font-charm text-white group-hover:text-qi-blue transition-colors">${loc.name}</h4>
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
                    if (isTimeLocked) {
                        state.ui.toast(`Bí cảnh chưa mở! ${timeMessage}`, 'warning');
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

        // --- WORLD BOSS CHECK ---
        if (state.worldEvents && state.worldEvents.activeBosses) {
            const bossEventIdx = state.worldEvents.activeBosses.findIndex(b => b.locId === locId);
            if (bossEventIdx !== -1) {
                const bossEvent = state.worldEvents.activeBosses[bossEventIdx];
                const bossData = BEASTS[bossEvent.bossId];
                
                if (bossData) {
                    const choice = await state.ui.promptOptions(
                        `ĐẠI YÊU THÚ GIÁNG LÂM`,
                        [
                            { id: 'fight', text: "Quyết chiến đoạt bảo!" },
                            { id: 'flee', text: "Lui lại tránh mũi nhọn" }
                        ],
                        `Một con [${bossData.name}] đang chiếm giữ ${loc.name}! Sát khí của nó bao trùm toàn bộ không gian, ngươi không thể thám hiểm bình thường nếu không tiêu diệt nó.`,
                        getAssetUrl(bossData.image) || null
                    );
                    
                    if (choice === 'fight') {
                        // Trigger combat with Boss
                        setTimeout(() => {
                            window.game.handleCombatEncounter(bossEvent.worldId, bossEvent.locId, (win) => {
                                if (win) {
                                    // Remove boss event
                                    state.worldEvents.activeBosses.splice(bossEventIdx, 1);
                                    if (state.systems.npc) {
                                        state.systems.npc.addNews(`[Trừ Yêu] Thật chấn động! Tu sĩ ${state.player.name} đã anh dũng tiêu diệt Đại Yêu Thú [${bossData.name}] tại ${loc.name}!`);
                                    }
                                    state.ui.toast("Đã tiêu diệt Đại Yêu Thú! Có thể thám hiểm bình thường.", "success");
                                    // Resume exploration
                                    this.startExploration(locId, resetProgress, true);
                                } else {
                                    state.ui.toast("Ngươi đã bị Đại Yêu Thú đánh bại, phải lui về dưỡng thương!", "error");
                                    // Player stays outside or whatever handleCombatEncounter defaults to
                                }
                            }, getAssetUrl(bossData.image));
                        }, 500);
                        return; // Halt exploration until combat resolves
                    } else {
                        // Go back
                        return;
                    }
                }
            }
        }
        // --- END WORLD BOSS CHECK ---

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

        this.elCurrentLocName.textContent = loc.name;

        // Sinh mới hoặc nạp lại ma trận Bát Quái Lịch Luyện
        if (!state.player.gridExplorationState || state.player.gridExplorationState.locationId !== locId) {
            this.generateGridMap(locId);
        }

        // Ẩn nút "TIẾN BƯỚC" phẳng truyền thống
        if (this.btnMove) this.btnMove.style.display = 'none';

        state.ui.toggleOverlay(this.viewExplore, true);
        
        gsap.fromTo(this.viewExplore, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
        
        await Preferences.set({ key: 'mortal_quest_map_view', value: 'explore' });

        // Đồng bộ tiến độ từ ma trận ô cờ đã giải quyết
        this.syncExplorationProgress();
        this.updateExplorationUI();
        this.renderGridMap();
        this.updateEventDisplay('Thần thức dung hợp, trận đồ hiển lộ, tu sĩ tiến bước...', '🚶');

        if (state.systems.time) {
            state.systems.time.timeMultiplier = loc.timeRate || 1.0;
            if (state.systems.time.timeMultiplier !== 1.0) {
                state.ui.toast(`Dòng chảy thời gian tại đây dường như khác biệt... (x${state.systems.time.timeMultiplier})`, 'warning');
            }
        }

        this.renderSpecialActions(loc);
        if (this.elExploreContentScroll) {
            this.elExploreContentScroll.scrollTop = 0;
        } else {
            this.viewExplore.scrollTop = 0;
        }
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
                    if (window.game && typeof window.game.saveGame === 'function') window.game.saveGame();
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
                    if (window.game && typeof window.game.saveGame === 'function') window.game.saveGame();
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

        // Cơ chế bảo vệ Sơn Môn & Công Hội: Phải tới ô Sơn Môn (🏠) mới mở thao tác tông môn
        const isSectOrGuild = SECTS[loc.id] || loc.special === 'guild';
        if (isSectOrGuild) {
            const gridState = state.player.gridExplorationState;
            const isAtGate = gridState && gridState.playerPos && gridState.playerPos.x === 7 && gridState.playerPos.y === 0;
            
            if (!isAtGate) {
                this.elLocSpecialActions.innerHTML = `
                    <div class="col-span-2 text-center p-3.5 text-[10px] text-gray-400 font-bold bg-black/40 border border-white/5 rounded-2xl space-y-1.5 shadow-lg">
                        <span class="text-cultivation-gold flex items-center justify-center space-x-1"><span>🏰</span> <span>SƠN MÔN TRẬN PHÁP PHONG TỎA</span></span>
                        <span class="block text-[8px] text-gray-500 font-normal leading-normal">Đạo hữu cần di chuyển Thần Thức đến ô Sơn Môn (🏠) ở góc trên-phải bản đồ để có thể bái kiến hoặc tiến vào!</span>
                    </div>
                `;
                state.ui.toggleOverlay(this.elLocSpecialActions, true);
                return;
            }
        }

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

    getLocMaxFloors(loc) {
        if (!loc) return 1;
        if (loc.id === 'thap_van_dai_son') return 5;
        const danger = loc.danger || 'ha_cap';
        if (danger === 'an_toan') return 1;
        if (danger === 'ha_cap') return 2;
        if (danger === 'trung_cap') return 3;
        if (danger === 'cao_cap') return 4;
        return 5;
    }

    generateFloorGrid(locId, floor, maxFloors) {
        const grid = [];
        const size = 8;
        const loc = getLocationById(this.viewedWorldId || state.currentWorldId, locId);
        const isSectOrGuild = SECTS[locId] || (loc && loc.special === 'guild');

        // Phân phối ngẫu nhiên các loại sự kiện cho 62 ô trung gian (trừ Start và Exit)
        let types = [];
        if (isSectOrGuild) {
            // Sơn Môn/Công Hội yên bình, trang nghiêm
            types = [
                'rock', 'rock', 'rock', 'rock',                 // 4 Đá cảnh / Tượng cổ sơn môn
                'river', 'river',                               // 2 Linh thủy đình hồ sen
                'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
                'grass', 'grass', 'grass', 'grass',             // 10 Vườn dược thảo dược linh tông môn
                'qi', 'qi', 'qi', 'qi', 'qi', 'qi', 
                'qi', 'qi', 'qi', 'qi',                         // 10 Mắt Linh Khí tu luyện tĩnh tọa
                'event', 'event', 'event', 'event', 'event', 'event',
                'event', 'event', 'event', 'event', 'event', 'event',
                'event', 'event',                               // 14 Kỳ ngộ đối thoại đệ tử/ghi chép thư viện
                'npc_event', 'npc_event', 'npc_event', 'npc_event',
                'npc_event', 'npc_event', 'npc_event', 'npc_event',
                'npc_event', 'npc_event', 'npc_event', 'npc_event', // 12 Đệ tử / Chấp sự / Tông môn trưởng lão
                'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty' // 10 Hành lang đá cổ thanh tịnh
            ];
        } else {
            // Mật cảnh/Dungeons hiểm nguy
            types = [
                'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', // 8 Đá chặn đường
                'river', 'river', 'river', 'river', 'river', 'river',          // 6 Dòng sông Linh Giang dữ dội
                'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 
                'grass', 'grass', 'grass', 'grass', 'grass', 'grass',          // 12 Bụi cỏ hoang
                'empty', 'empty', 'empty', 'empty', 'empty', 'empty',          // 6 Ô trống bù đắp
                'guard', 'guard', 'guard', 'guard', 'guard', 'guard',          // 6 Yêu thú hoành hành chắn đường (giảm từ 12)
                'qi', 'qi', 'qi', 'qi', 'qi', 'qi',                            // 6 Mắt trận khí địa linh
                'event', 'event', 'event', 'event', 'event', 'event',          // 6 Kỳ ngộ bí kính hoang cổ
                'npc_event', 'npc_event', 'npc_event', 'npc_event',            // 4 Cổ nhân di tích / Tu sĩ lạc lối
                'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty' // 8 Ô trống đường mòn hoang vắng
            ];
        }

        // Shuffle thuật toán Fisher-Yates để phân bố tự nhiên
        for (let i = types.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [types[i], types[j]] = [types[j], types[i]];
        }

        // Tạo danh sách NPC/Thú duy nhất cho tầng này
        const floorNpcs = [...NPC_IMAGES].sort(() => Math.random() - 0.5);
        const floorBeasts = [...BEAST_IMAGES].sort(() => Math.random() - 0.5);
        let npcCounter = 0;
        let beastCounter = 0;

        const npcNamesMap = {
            'portraits/bach_minh_anh': 'Bạch Minh Anh',
            'portraits/bach_tu_linh': 'Bạch Tử Linh',
            'portraits/bang_nguyet': 'Băng Nguyệt Tiên Tử',
            'portraits/demon': 'Hắc Sát Ma Đầu',
            'portraits/du_nhuoc_nhan': 'Dụ Nhược Nhan',
            'portraits/han_lap': 'Hàn Lập',
            'portraits/han_phi_vu': 'Hàn Phi Vũ',
            'portraits/han_vien': 'Hàn Viên',
            'portraits/kiem_vo_tam': 'Kiếm Vô Tâm',
            'portraits/lan_anh': 'Lan Anh',
            'portraits/merchant': 'Hắc Tâm Thương Nhân',
            'portraits/minh_nguyet': 'Minh Nguyệt',
            'portraits/phuong_ca': 'Phượng Ca',
            'portraits/phuong_vu': 'Phượng Vũ',
            'portraits/sect_elder': 'Tông Môn Trưởng Lão',
            'portraits/thanh_lien': 'Thanh Liên',
            'portraits/thanh_nhi': 'Thanh Nhi',
            'portraits/tran_tu_huyen': 'Trần Tử Huyên',
            'portraits/tu_linh': 'Tử Linh',
            'portraits/vo_danh': 'Vô Danh Lão Giả',
            'portraits/xich_nguyet': 'Xích Nguyệt'
        };

        const randomNames = ['Lâm Phong', 'Diệp Vô Đạo', 'Tiêu Cửu', 'Vương Đằng', 'Lý Tầm', 'Mặc Lão'];

        let typeIdx = 0;

        for (let y = 0; y < size; y++) {
            grid[y] = [];
            for (let x = 0; x < size; x++) {
                // Điểm xuất phát ở góc giữa bản đồ (3, 3)
                if (x === 3 && y === 3) {
                    if (floor === 1) {
                        grid[y][x] = {
                            x, y,
                            type: 'dungeon_entrance',
                            status: 'visited',
                            resolved: true,
                            icon: isSectOrGuild ? '🚪' : '🕳️'
                        };
                    } else {
                        grid[y][x] = {
                            x, y,
                            type: 'stairs_up',
                            status: 'visited',
                            resolved: true,
                            icon: '⬆️'
                        };
                    }
                }
                // Điểm Exit ở góc đối diện trên-phải (7, 0)
                else if (x === 7 && y === 0) {
                    if (isSectOrGuild) {
                        grid[y][x] = {
                            x, y,
                            type: 'sect_entrance',
                            status: 'locked',
                            resolved: false,
                            icon: '🏠'
                        };
                    } else if (floor === maxFloors) {
                        grid[y][x] = {
                            x, y,
                            type: 'boss',
                            status: 'locked',
                            resolved: false,
                            icon: '🏛️'
                        };
                    } else {
                        grid[y][x] = {
                            x, y,
                            type: 'stairs_down',
                            status: 'locked',
                            resolved: false,
                            icon: '⬇️'
                        };
                    }
                }
                else {
                    const type = types[typeIdx++];
                    const iconMap = {
                        'rock': '🪨',
                        'river': '🌊',
                        'grass': '🌾',
                        'guard': '💀',
                        'qi': '🌀',
                        'event': '❓',
                        'npc_event': '👤',
                        'empty': '⬜'
                    };
                    
                    const cellData = {
                        x, y,
                        type,
                        status: 'locked',
                        resolved: false,
                        icon: iconMap[type]
                    };

                    // Gán chỉ số duy nhất để ảnh/npc không trùng lặp trên cùng 1 map
                    if (type === 'npc_event') {
                        const imgPath = floorNpcs[npcCounter % floorNpcs.length];
                        cellData.npcIdx = NPC_IMAGES.indexOf(imgPath);
                        cellData.npcName = npcNamesMap[imgPath] || randomNames[npcCounter % randomNames.length];
                        npcCounter++;
                    } else if (type === 'guard') {
                        cellData.beastIdx = BEAST_IMAGES.indexOf(floorBeasts[beastCounter % floorBeasts.length]);
                        beastCounter++;
                    }

                    grid[y][x] = cellData;
                }
            }
        }

        return grid;
    }

    generateGridMap(locId) {
        const loc = getLocationById(this.viewedWorldId || state.currentWorldId, locId);
        const maxFloors = this.getLocMaxFloors(loc);

        state.player.gridExplorationState = {
            locationId: locId,
            currentFloor: 1,
            maxFloors: maxFloors,
            floors: {},
            playerPos: { x: 3, y: 3 }
        };

        state.player.gridExplorationState.floors[1] = this.generateFloorGrid(locId, 1, maxFloors);
        state.player.gridExplorationState.grid = state.player.gridExplorationState.floors[1];

        // Mở sương mù dựa theo tầm quét Thần Thức ban đầu ở tầng 1
        const rId = state.player.realmId || 0;
        const range = rId >= 4 ? 3 : (rId >= 2 ? 2 : 1);
        const gridState = state.player.gridExplorationState;

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const dist = Math.abs(x - 3) + Math.abs(y - 3);
                if (dist <= range) {
                    const cell = gridState.grid[y][x];
                    if (cell && cell.status === 'locked') cell.status = 'unlocked';
                }
            }
        }

        state.explorationProgress = 0;
    }

    syncExplorationProgress() {
        const gridState = state.player.gridExplorationState;
        if (!gridState || !gridState.grid || !gridState.floors) return;

        let visitedCount = 0;
        let totalCount = 64 * gridState.maxFloors;

        for (let f = 1; f <= gridState.maxFloors; f++) {
            const floorGrid = gridState.floors[f];
            if (floorGrid) {
                for (let y = 0; y < 8; y++) {
                    for (let x = 0; x < 8; x++) {
                        if (floorGrid[y] && floorGrid[y][x] && floorGrid[y][x].status === 'visited') {
                            visitedCount++;
                        }
                    }
                }
            }
        }

        // Cập nhật tiến độ thám hiểm mật cảnh
        const lastFloorGrid = gridState.floors[gridState.maxFloors];
        const bossCell = lastFloorGrid ? lastFloorGrid[0][7] : null;
        
        if (bossCell && bossCell.status === 'visited') {
            state.explorationProgress = 100;
        } else {
            state.explorationProgress = Math.min(95, Math.floor((visitedCount / totalCount) * 100));
        }

        if (state.player) state.player.explorationProgress = state.explorationProgress;
    }

    renderGridMap() {
        if (!this.elExploreGridBoard) return;

        const gridState = state.player.gridExplorationState;
        if (!gridState || !gridState.grid) return;

        this.elExploreGridBoard.innerHTML = '';
        const playerPos = gridState.playerPos;

        // Cập nhật tiêu đề hiển thị tên mật cảnh / tông môn kèm tầng số
        const elTitle = document.getElementById('explore-grid-title');
        const loc = getLocationById(this.viewedWorldId || state.currentWorldId, gridState.locationId);
        if (elTitle && loc) {
            const isSectOrGuild = SECTS[gridState.locationId] || loc.special === 'guild';
            if (isSectOrGuild) {
                elTitle.textContent = `Sơn Môn - ${loc.name}`;
            } else if (gridState.maxFloors > 1) {
                elTitle.textContent = `${loc.name} - Tầng ${gridState.currentFloor}/${gridState.maxFloors}`;
            } else {
                elTitle.textContent = `Mật Cảnh - ${loc.name}`;
            }
        }

        // Cập nhật thông số Thần Thức hiển thị trên giao diện
        const elCoords = document.getElementById('grid-coordinates');
        const rId = state.player.realmId || 0;
        const range = rId >= 4 ? 3 : (rId >= 2 ? 2 : 1);
        if (elCoords) elCoords.textContent = `Thần Thức: Quét ${range} Ô`;

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const cell = gridState.grid[y][x];
                const isPlayer = playerPos.x === x && playerPos.y === y;

                const el = document.createElement('div');
                el.className = 'grid-cell-mystic';

                // Trạng thái đồ họa của ô lưới
                if (isPlayer) {
                    el.classList.add('grid-cell-player');
                    
                    const player = state.player;
                    const portraitKey = player.avatar || (['female', 'Nữ'].includes(player.gender) ? 'player_female' : 'player_male');
                    const portraitUrl = ASSETS.portraits[portraitKey] || './src/assets/images/players/player_male.webp';

                    el.innerHTML = `
                        <div class="w-[85%] h-[85%] rounded-full overflow-hidden border border-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.8)] flex items-center justify-center">
                            <img src="${portraitUrl}" class="w-full h-full object-cover">
                        </div>
                    `;
                } else if (cell.status === 'locked') {
                    el.classList.add('grid-cell-foggy');
                    const trigrams = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];
                    const trigram = trigrams[(x + y) % 8];
                    el.innerHTML = `<span class="text-sm font-bold opacity-30 select-none">${trigram}</span>`;
                } else if (cell.type === 'corpse') {
                    el.classList.add('grid-cell-corpse');
                    el.innerHTML = `
                        <div class="w-[85%] h-[85%] rounded-xl border border-qi-purple shadow-[0_0_10px_rgba(168,85,247,0.7)] flex items-center justify-center bg-purple-950/40 animate-pulse" title="${cell.corpseName || 'Thi Thể'}">
                            <span class="text-lg select-none">${cell.icon || '📦'}</span>
                        </div>
                    `;
                } else if (cell.status === 'unlocked') {
                    el.classList.add('grid-cell-unlocked');

                    // Gán các class địa hình tiên hiệp đặc hữu
                    if (cell.type === 'rock') el.classList.add('grid-cell-rock');
                    else if (cell.type === 'river') el.classList.add('grid-cell-river');
                    else if (cell.type === 'grass') el.classList.add('grid-cell-grass');
                    else if (cell.type === 'guard') el.classList.add('grid-cell-guard');
                    else if (cell.type === 'npc_event') el.classList.add('grid-cell-npc');
                    else if (cell.type === 'stairs_up') el.classList.add('grid-cell-stairs-up');
                    else if (cell.type === 'stairs_down') el.classList.add('grid-cell-stairs-down');
                    else if (cell.type === 'sect_entrance') el.classList.add('grid-cell-sect-gate');
                    else if (cell.type === 'dungeon_entrance') el.classList.add('grid-cell-stairs-up');

                    if (cell.type === 'guard' || cell.type === 'boss') {
                        const beastIdx = cell.beastIdx !== undefined ? cell.beastIdx : ((x * 7 + y * 13) % BEAST_IMAGES.length);
                        const imgUrl = getAssetUrl(BEAST_IMAGES[beastIdx]);
                        el.innerHTML = `
                            <div class="w-[85%] h-[85%] rounded-full overflow-hidden border ${cell.type === 'boss' ? 'border-red-600 shadow-[0_0_12px_rgba(239,68,68,0.8)]' : 'border-red-400 shadow-[0_0_6px_rgba(239,68,68,0.5)]'} flex items-center justify-center">
                                <img src="${imgUrl}" class="w-full h-full object-cover">
                            </div>
                        `;
                    } else if (cell.type === 'npc_event') {
                        const npcIdx = cell.npcIdx !== undefined ? cell.npcIdx : ((x * 5 + y * 11) % NPC_IMAGES.length);
                        const imgUrl = getAssetUrl(NPC_IMAGES[npcIdx]);
                        el.innerHTML = `
                            <div class="w-[85%] h-[85%] rounded-full overflow-hidden border border-qi-blue shadow-[0_0_8px_rgba(59,130,246,0.6)] flex items-center justify-center">
                                <img src="${imgUrl}" class="w-full h-full object-cover">
                            </div>
                        `;
                    } else {
                        el.innerHTML = `<span class="text-lg md:text-xl select-none">${cell.icon}</span>`;
                    }
                } else if (cell.status === 'visited') {
                    el.classList.add('grid-cell-visited');
                    if (cell.type === 'river') el.classList.add('grid-cell-river');
                    else if (cell.type === 'stairs_up') el.classList.add('grid-cell-stairs-up');
                    else if (cell.type === 'stairs_down') el.classList.add('grid-cell-stairs-down');
                    else if (cell.type === 'sect_entrance') el.classList.add('grid-cell-sect-gate');
                    else if (cell.type === 'dungeon_entrance') el.classList.add('grid-cell-stairs-up');
                    
                    el.innerHTML = `<span class="text-base opacity-25 select-none">${cell.icon}</span>`;
                }

                // Nếu là ô Boss, rực đỏ cảnh báo hiểm họa
                if (cell.type === 'boss' && cell.status !== 'visited' && cell.status === 'unlocked') {
                    el.classList.remove('grid-cell-unlocked');
                    el.classList.add('grid-cell-boss');
                }

                // Gắn sự kiện click
                el.onclick = () => this.handleGridCellClick(x, y);

                this.elExploreGridBoard.appendChild(el);
            }
        }

        // Cập nhật lại các thao tác đặc biệt để đồng bộ trạng thái khi di chuyển tới Sơn Môn (🏠)
        if (loc) {
            this.renderSpecialActions(loc);
        }
    }

    async handleGridCellClick(x, y) {
        const gridState = state.player.gridExplorationState;
        if (!gridState || !gridState.grid) return;

        const cell = gridState.grid[y][x];
        const playerPos = gridState.playerPos;

        // Tránh click ô bị khóa sương mù
        if (cell.status === 'locked') {
            state.ui.toast('Cổ trận sương mù phong ấn lối đi, thần thức không thể định vị!', 'error');
            return;
        }

        // Tảng đá kiên cố hoàn toàn chặn đường, không thể di chuyển vào
        if (cell.type === 'rock') {
            state.ui.toast('Cổ thạch nghìn năm kiên cố chặn đường, không thể vượt qua!', 'warning');
            return;
        }

        // Kiểm tra tính kề cạnh (chỉ đi lên, xuống, trái, phải)
        const distance = Math.abs(playerPos.x - x) + Math.abs(playerPos.y - y);
        if (distance !== 1 && distance !== 0) {
            state.ui.toast('Vị trí này cách quá xa vùng thần thức hiện tại!', 'warning');
            return;
        }

        if (distance === 0) {
            if (cell.type === 'corpse') {
                window.game.screens.loot.open(null, cell);
            }
            return;
        }

        // Tính toán chi phí Stamina (Linh giang tốn 10, ô khác tốn 5; nếu đã đi qua thì Linh giang tốn 5, ô khác 0)
        const isVisited = cell.status === 'visited';
        const isRiver = cell.type === 'river';
        const staminaCost = isRiver ? (isVisited ? 5 : 10) : (isVisited ? 0 : 5);

        if (state.player.stamina < staminaCost) {
            state.ui.toast(`Thể lực khô cạn! Cần ${staminaCost} thể lực để vượt địa hình này.`, 'error');
            return;
        }

        // Khấu trừ tài nguyên
        state.player.stamina -= staminaCost;

        // Tiến trình thời gian tu tiên
        if (state.systems.time) state.systems.time.advanceTime(1);
        audioManager.playSfx('move');

        // Cập nhật vị trí tu sĩ
        gridState.playerPos = { x, y };
        cell.status = 'visited';

        // Quét thần thức lật mở sương mù dựa theo cảnh giới
        const rId = state.player.realmId || 0;
        const range = rId >= 4 ? 3 : (rId >= 2 ? 2 : 1);
        const size = 8;

        for (let ny = 0; ny < size; ny++) {
            for (let nx = 0; nx < size; nx++) {
                const dist = Math.abs(nx - x) + Math.abs(ny - y);
                if (dist <= range) {
                    const neighbor = gridState.grid[ny][nx];
                    if (neighbor && neighbor.status === 'locked') {
                        neighbor.status = 'unlocked';
                    }
                }
            }
        }

        // Đồng bộ và render UI lập tức để tạo phản hồi nhanh nhạy
        this.syncExplorationProgress();
        this.updateExplorationUI();
        this.renderGridMap();

        if (window.game && window.game.saveGame) window.game.saveGame();

        // Xử lý ô xác chết / hòm loot đồ
        if (cell.type === 'corpse') {
            window.game.screens.loot.open(null, cell);
            return;
        }

        // Xử lý sự kiện nếu ô cờ chưa giải quyết
        if (!cell.resolved) {
            cell.resolved = true;

            const loc = getLocationById(this.viewedWorldId || state.currentWorldId, state.currentLocId);

            switch (cell.type) {
                case 'dungeon_entrance': {
                    const choice = await state.ui.promptOptions(
                        "Lối Ra Mật Cảnh",
                        [
                            { id: 'exit', text: "Rời khỏi Mật Cảnh (Về bản đồ chính)" },
                            { id: 'stay', text: "Tiếp tục thám hiểm" }
                        ],
                        "Trước mặt đạo hữu chính là hang động linh môn mở ra thông đạo rời khỏi Mật cảnh. Đạo hữu muốn ra ngoài?"
                    );
                    if (choice === 'exit') {
                        state.player.gridExplorationState = null;
                        audioManager.playSfx('menu_click');
                        state.ui.toggleOverlay(this.viewExplore, false);
                        if (window.game && window.game.saveGame) window.game.saveGame();
                        return;
                    }
                    cell.resolved = false; // Có thể tương tác lại lần sau
                    break;
                }
                case 'stairs_down': {
                    const choice = await state.ui.promptOptions(
                        "Lối Xuống Tầng Cổ Kính",
                        [
                            { id: 'down', text: "Đi xuống Tầng tiếp theo" },
                            { id: 'stay', text: "Ở lại tầng hiện tại" }
                        ],
                        `Một lối cầu thang cổ xưa bằng đá rêu phong mở ra, dẫn xuống tầng thứ ${gridState.currentFloor + 1} của Bí cảnh. Đạo hữu muốn bước tiếp?`
                    );
                    if (choice === 'down') {
                        gridState.currentFloor += 1;
                        if (!gridState.floors[gridState.currentFloor]) {
                            gridState.floors[gridState.currentFloor] = this.generateFloorGrid(gridState.locationId, gridState.currentFloor, gridState.maxFloors);
                        }
                        gridState.grid = gridState.floors[gridState.currentFloor];
                        gridState.playerPos = { x: 3, y: 3 }; // Đi vào ở ô xuất phát góc giữa bản đồ
                        
                        // Quét Thần thức ban đầu xung quanh ô mới bước vào
                        for (let ny = 0; ny < size; ny++) {
                            for (let nx = 0; nx < size; nx++) {
                                const dist = Math.abs(nx - 3) + Math.abs(ny - 3);
                                if (dist <= range) {
                                    const cell = gridState.grid[ny][nx];
                                    if (cell && cell.status === 'locked') cell.status = 'unlocked';
                                }
                            }
                        }
                        state.ui.toast(`Xuống Tầng ${gridState.currentFloor}!`, 'success');
                        this.updateEventDisplay(`🪜 Đạo hữu đã đi xuống Tầng ${gridState.currentFloor} của Bí cảnh.`);
                        this.syncExplorationProgress();
                        this.updateExplorationUI();
                        this.renderGridMap();
                    } else {
                        cell.resolved = false;
                    }
                    break;
                }
                case 'stairs_up': {
                    const choice = await state.ui.promptOptions(
                        "Lối Lên Tầng Trên",
                        [
                            { id: 'up', text: "Leo lên tầng trước đó" },
                            { id: 'stay', text: "Ở lại thám hiểm tiếp" }
                        ],
                        `Một lối cầu thang dẫn ngược lên tầng thứ ${gridState.currentFloor - 1} của Bí cảnh. Đạo hữu muốn quay lại tầng trước?`
                    );
                    if (choice === 'up') {
                        gridState.currentFloor -= 1;
                        gridState.grid = gridState.floors[gridState.currentFloor];
                        gridState.playerPos = { x: 7, y: 0 }; // Xuất hiện tại đúng ô Cầu thang xuống (7, 0)
                        
                        // Quét Thần thức ban đầu xung quanh ô mới bước vào
                        for (let ny = 0; ny < size; ny++) {
                            for (let nx = 0; nx < size; nx++) {
                                const dist = Math.abs(nx - 7) + Math.abs(ny - 0);
                                if (dist <= range) {
                                    const cell = gridState.grid[ny][nx];
                                    if (cell && cell.status === 'locked') cell.status = 'unlocked';
                                }
                            }
                        }
                        state.ui.toast(`Quay lại Tầng ${gridState.currentFloor}!`, 'success');
                        this.updateEventDisplay(`🪜 Đạo hữu đã leo lên Tầng ${gridState.currentFloor} của Bí cảnh.`);
                        this.syncExplorationProgress();
                        this.updateExplorationUI();
                        this.renderGridMap();
                    } else {
                        cell.resolved = false;
                    }
                    break;
                }
                case 'sect_entrance': {
                    this.updateEventDisplay(`🏠 [SƠN MÔN TÔNG MÔN] Đã tới Sơn Môn / Điện Đường oai nghiêm bậc nhất! Hãy sử dụng bảng thao tác tông môn phía dưới để bái kiến Tông Môn.`);
                    break;
                }
                case 'empty': {
                    const emptyMsgs = [
                        'Ngươi tiến vào vùng cổ lộ yên tĩnh, thanh âm xào xạc hòa quyện.',
                        'Nơi đây chỉ có sỏi đá phong trần, không gặp bất cứ chướng ngại nào.',
                        'Dừng chân tĩnh tọa, cảm nhận thiên địa an lành.',
                        'Đường đi rộng mở, thần thức thoải mái sảng khoái.'
                    ];
                    this.updateEventDisplay(emptyMsgs[Math.floor(Math.random() * emptyMsgs.length)]);
                    break;
                }
                case 'river': {
                    this.updateEventDisplay(`🌊 [LINH GIANG RỘNG LỚN] Băng qua dòng sông linh khí cuộn trào cuồng bạo, hao tổn 10 Thể Lực!`);
                    break;
                }
                case 'grass':
                case 'herbs': {
                    const herbDrops = loc && loc.resources ? loc.resources.filter(r => r.type === 'herb' || r.type === 'ore') : [];
                    let rewardId = 'linh_thao_thuong';
                    if (herbDrops.length > 0) {
                        rewardId = herbDrops[Math.floor(Math.random() * herbDrops.length)].id;
                    }
                    
                    const qty = 1 + Math.floor(Math.random() * 2);
                    const droppedShi = Math.floor(Math.random() * 12 * state.player.realmId) + 5;

                    await window.game.receiveItem(rewardId, qty);
                    state.player.addLingShi(droppedShi);

                    this.updateEventDisplay(`🌾 [BỤI CỎ TÌM KIẾM] Thu thập thành công [${qty}x Thảo dược] và [💎 ${droppedShi}x Linh thạch] ẩn giấu dưới lớp cỏ rậm!`);
                    break;
                }
                case 'qi': {
                    const tuViGain = state.player.realmId * 180 + 120;
                    state.player.addTuVi(tuViGain);
                    state.player.stamina = Math.min(state.player.maxStamina, state.player.stamina + 15);

                    this.updateEventDisplay(`🌀 [LINH KHÍ NHÃN] Ngươi tìm thấy một mắt trận sinh cơ phồn thịnh! Tụ nạp linh khí giúp tu vi tăng vọt và hồi phục 15 Thể lực! (+${tuViGain} Tu Vi)`);
                    break;
                }
                case 'guard':
                case 'combat': {
                    const beastIdx = cell.beastIdx !== undefined ? cell.beastIdx : ((x * 7 + y * 13) % BEAST_IMAGES.length);
                    const overrideImage = getAssetUrl(BEAST_IMAGES[beastIdx]);

                    this.updateEventDisplay(`👹 [YÊU THÚ TRẤN ẢI] Một đầu cự yêu hung ác từ sương mù gầm rú chặn đứng cổ lộ! Chiến đấu nổ ra!`);
                    setTimeout(() => {
                        window.game.handleCombatEncounter(state.currentWorldId, state.currentLocId, null, overrideImage);
                    }, 1000);
                    break;
                }
                case 'npc_event': {
                    const npcName = cell.npcName || "Cổ nhân di tích";
                    this.updateEventDisplay(`👤 [KỲ NGỘ] Ngươi gặp tu sĩ ${npcName} đang tĩnh tọa...`);
                    setTimeout(async () => {
                        const choice = await state.ui.promptOptions(
                            `Bất Ngờ Gặp ${npcName}`,
                            [
                                { id: 'talk', text: "Đàm đạo và bồi lễ (-50 Linh thạch, +Tu vi)" },
                                { id: 'trade', text: "Giao dịch bí bảo mua Linh Thảo" },
                                { id: 'leave', text: "Chắp tay rời đi" }
                            ],
                            `${npcName} thần sắc thâm trầm, thở ra khí xám chắp tay: 'Đạo hữu hữu duyên dừng bước, cùng nhau đàm đạo trao đổi đan dược chứ?'`
                        );
                        if (choice === 'talk') {
                            if (state.player.inventory.hasItem('linh_thach', 50) || state.player.lingShi >= 50) {
                                state.player.addLingShi(-50);
                                const bonusTuVi = state.player.realmId * 500 + 300;
                                state.player.addTuVi(bonusTuVi);
                                this.updateEventDisplay(`👤 Đàm đạo vô cùng thống khoái! ${npcName} tặng ngươi chỉ dẫn ngộ đạo, tăng thêm ${bonusTuVi} Tu vi.`);
                            } else {
                                state.ui.toast("Không đủ Linh thạch để bồi lễ!", "warning");
                                this.updateEventDisplay(`👤 ${npcName} phất tay áo chán ghét rời đi vì ngươi quá nghèo túng.`);
                            }
                        } else if (choice === 'trade') {
                            await window.game.receiveItem('linh_thao_cuc_pham', 1);
                            this.updateEventDisplay(`👤 Giao dịch hoàn tất! Ngươi nhận được 1x [Linh Thảo Cực Phẩm] tuyệt diệu từ ${npcName}.`);
                        } else {
                            this.updateEventDisplay(`👤 Ngươi chắp tay cáo từ ${npcName}, an toàn tiếp tục hành trình.`);
                        }
                        this.renderGridMap();
                    }, 1000);
                    break;
                }
                case 'event': {
                    this.updateEventDisplay(`📜 PHÁT HIỆN KỲ NGỘ CỔ KÍNH...`);
                    setTimeout(async () => {
                        const probs = { npc: 0.3, interactive: 0.7, combat: 0.0 };
                        const event = getRandomEvent(probs);
                        if (event) {
                            const finalDesc = typeof event.description === 'function' ? event.description(state.player) : event.description;
                            const finalOptions = typeof event.options === 'function' ? event.options(state.player) : event.options;
                            const eventKey = event.image ? event.image.replace('events/', '') : '';
                            const eventImage = eventKey ? ASSETS.events[eventKey] : '';
                            const choice = await state.ui.promptOptions(event.name, finalOptions, finalDesc, eventImage);
                            
                            if (choice && event.resolve) {
                                const result = await event.resolve(choice, state.player, window.game);
                                if (result) {
                                    if (result.msg) this.updateEventDisplay(result.msg);
                                    if (result.type === 'combat_then_loot') {
                                        window.game.handleCombatEncounter(state.currentWorldId, state.currentLocId, (win) => {
                                            if (win && result.loot) {
                                                window.game.receiveItem(result.loot, 1);
                                            }
                                        });
                                    }
                                }
                            }
                        } else {
                            this.updateEventDisplay("Chỉ là tàn thư phong hóa lâu năm, ghi chép đã phai mờ.");
                        }
                        if (window.game && typeof window.game.saveGame === 'function') window.game.saveGame();
                        this.renderGridMap();
                    }, 1000);
                    break;
                }
                case 'boss': {
                    this.updateEventDisplay(`🏛️ [CẤM ĐIỆN BOSS] Trấn thủ Mật cảnh Mộc Nhân Vương / Cổ Thần Thú xuất thế! Sát khí đè nặng linh thức!`);
                    setTimeout(() => {
                        const loc = getLocationById(this.viewedWorldId || state.currentWorldId, state.currentLocId);
                        const dangerLvl = Math.min(10, (loc.dangerLevel || 1) + 2);
                        const bossEnemy = EnemyGenerator.generate(dangerLvl);
                        
                        bossEnemy.name = `👑 THỦ LĨNH: ` + bossEnemy.name;
                        bossEnemy.hp = Math.floor(bossEnemy.hp * 1.8);
                        bossEnemy.maxHp = bossEnemy.hp;
                        bossEnemy.atk = Math.floor(bossEnemy.atk * 1.3);

                        const beastIdx = cell.beastIdx !== undefined ? cell.beastIdx : ((x * 7 + y * 13) % BEAST_IMAGES.length);
                        bossEnemy.image = getAssetUrl(BEAST_IMAGES[beastIdx]);

                        window.game.startBattle(bossEnemy, null, async (win) => {
                            if (win) {
                                cell.status = 'visited';
                                this.syncExplorationProgress();
                                this.updateExplorationUI();
                                this.renderGridMap();

                                const bossTuVi = dangerLvl * 600;
                                state.player.addTuVi(bossTuVi);

                                const rewards = ['dan_kinh_mach', 'dan_linh_nguyen', 'chan_vu_nho_quan_ta', 'chan_vu_nho_quan_huu', 'linh_thao_cuc_pham'];
                                const itemReward = rewards[Math.floor(Math.random() * rewards.length)];
                                await window.game.receiveItem(itemReward, 1);

                                state.ui.toast(`🎉 Chúc mừng! Hạ gục Boss thành công và thanh lọc toàn bộ mật cảnh!`, 'success');
                                this.updateEventDisplay(`🎉 MẬT CẢNH KHAI PHÁ VIÊN MÃN!\n\nĐạo hữu đã dẹp yên Cổ Cấm Điện! Nhận thưởng [💎 ${bossTuVi}x Tu vi] và di vật cổ bảo [🎁 1x ${getItemById(itemReward)?.name || 'Cổ Bảo'}].`);
                                
                                // Giải phóng ma trận cũ để người chơi tạo ma trận mới tiếp tục thám hiểm
                                state.player.gridExplorationState = null;
                                if (window.game && window.game.saveGame) window.game.saveGame();
                            } else {
                                this.updateEventDisplay(`☠️ Phản phệ thảm hại! Ngươi bị Boss Mật cảnh trọng thương tàn tạ!`);
                            }
                        });
                    }, 1000);
                    break;
                }
            }
        }

        this.renderGridMap();
        if (window.game && window.game.saveGame) window.game.saveGame();
    }
}
