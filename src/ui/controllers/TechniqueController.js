import { state } from '../../state.js';
import { getTechniqueById, getSecretTechniqueById, MASTERY_LEVELS, TECHNIQUE_LEVELS } from '../../configs/technique-data.js';
import { getTechniqueTypeSlug, getTechniqueTypeLabel } from '../../configs/display-mappers.js';

export class TechniqueController {
    constructor(parentScreen) {
        this.parentScreen = parentScreen;
        window.game = window.game || {};
        window.game.ui = window.game.ui || {};
        window.game.ui.setTechniqueSubcategory = (subCat) => {
            state.activeSubCategory = subCat;
            this.renderTechniques(state.activeTechTab);
        };
        window.game.ui.renderTechniqueDetail = (id, isSecret) => {
            this.renderTechniqueDetail(id, isSecret);
        };
        window.game.ui.equipTechnique = async (id, isSecret) => {
            await window.game.setMainTechnique(id);
            this.renderTechniqueDetail(id, isSecret);
        };
        window.game.ui.unequipTechnique = (type, id, isSecret) => {
            state.player.unequipTechnique(type, id);
            this.renderTechniqueDetail(id, isSecret);
        };
    }

    get btnTechTabLinhLuc() { return this.parentScreen.btnTechTabLinhLuc; }
    get btnTechTabLuyenThe() { return this.parentScreen.btnTechTabLuyenThe; }
    get btnTechTabThanThuc() { return this.parentScreen.btnTechTabThanThuc; }
    get btnTechTabPhapThuat() { return this.parentScreen.btnTechTabPhapThuat; }
    get btnTechTabThanThong() { return this.parentScreen.btnTechTabThanThong; }
    get btnTechTabThanHon() { return this.parentScreen.btnTechTabThanHon; }
    get btnTechTabBiPhap() { return this.parentScreen.btnTechTabBiPhap; }
    get elTechSubcategoryContainer() { return this.parentScreen.elTechSubcategoryContainer; }
    get elTechListView() { return this.parentScreen.elTechListView; }
    get elTechDetailView() { return this.parentScreen.elTechDetailView; }
    get elTechDetailContent() { return this.parentScreen.elTechDetailContent; }
    get elTechPoints() { return this.parentScreen.elTechPoints; }

    getTechniquePassiveRate(entry, data) {
        if (!state.player || !data) return 0;

        const type = getTechniqueTypeSlug(data.type);
        if (type !== 'linh_luc' && type !== 'luyen_the' && type !== 'than_thuc' && type !== 'song_tu' && type !== 'phu_tro') return 0;

        const masteryLevel = entry.masteryLevel || 1;
        const qualityLevel = TECHNIQUE_LEVELS[data.quality];
        const qualityMult = qualityLevel ? qualityLevel.multiplier : 1.0;

        const masteryBonus = data.masteryBonuses ? data.masteryBonuses[masteryLevel] : null;
        const masteryMult = MASTERY_LEVELS.find(m => m.id === masteryLevel)?.multiplier || 1.0;

        let attributeMult = 1.0;
        if (state.player.spiritualRoot) {
            if (data.compatibility) {
                const rootType = state.player.spiritualRoot.type;
                if (data.compatibility[rootType]) {
                    attributeMult = data.compatibility[rootType];
                } else if ((state.player.spiritualRoot.quality === 'TAP' || state.player.spiritualRoot.quality === 'Tạp' || rootType.includes('Tạp')) && data.compatibility['Tạp']) {
                    attributeMult = data.compatibility['Tạp'];
                } else if (state.player.spiritualRoot.id === 'thien_linh_can') {
                    attributeMult = 1.5;
                }
            } else if (data.element) {
                const rootId = state.player.spiritualRoot.id || '';
                if (rootId === 'thien_linh_can' ||
                    (state.player.spiritualRoot.elements && state.player.spiritualRoot.elements.includes(data.element))) {
                    attributeMult = 1.5;
                }
            }
        }

        const stageMult = 1 + ((entry.stage || 1) - 1) * 0.2;
        const finalMult = masteryMult * qualityMult * attributeMult * stageMult;

        if (type === 'linh_luc' || type === 'song_tu' || type === 'phu_tro') {
            const baseTvps = masteryBonus?.tvps || data.effects?.tvps || 0;
            let finalTvps = baseTvps * finalMult;

            // Apply environmental Qi
            finalTvps *= state.player.getEnvironmentalQiMultiplier();

            // Apply active formations
            state.player.activeFormations.forEach(f => {
                if (f.id === 'tu_linh_tran') finalTvps *= 1.2;
            });

            // Apply social
            if (state.systems.social && state.systems.social.bonds.daoLu) {
                finalTvps *= 1.2;
                const daoLu = state.systems.npc.npcs.find(n => n.id === state.systems.social.bonds.daoLu);
                if (daoLu && daoLu.location === state.player.currentLocId) {
                    finalTvps *= 1.1;
                }
            }

            // Apply buffs
            if (state.player.buffs) {
                state.player.buffs.forEach(b => {
                    if (b.stat === 'tuViSpeed') finalTvps *= b.value;
                });
            }

            return finalTvps;
        } else if (type === 'luyen_the') {
            const baseBodyPs = masteryBonus?.bodyPs || data.effects?.bodyPs || 0;
            let finalBodyPs = baseBodyPs * finalMult;
            if (state.player.buffs) {
                state.player.buffs.forEach(b => {
                    if (b.stat === 'body_speed') finalBodyPs *= b.value;
                });
            }
            return finalBodyPs;
        } else if (type === 'than_thuc') {
            const baseSoulPs = masteryBonus?.soulPs || data.effects?.soulPs || 0;
            let finalSoulPs = baseSoulPs * finalMult;
            if (state.player.buffs) {
                state.player.buffs.forEach(b => {
                    if (b.stat === 'soul_speed') finalSoulPs *= b.value;
                });
            }
            return finalSoulPs;
        }

        return 0;
    }

    getTechniqueActiveStats(entry, data) {
        if (!state.player || !data) return {};

        const masteryLevel = entry.masteryLevel || 1;
        const qualityLevel = TECHNIQUE_LEVELS[data.quality];
        const qualityMult = qualityLevel ? qualityLevel.multiplier : 1.0;

        const masteryMult = MASTERY_LEVELS.find(m => m.id === masteryLevel)?.multiplier || 1.0;

        let attributeMult = 1.0;
        if (state.player.spiritualRoot) {
            if (data.compatibility) {
                const rootType = state.player.spiritualRoot.type;
                if (data.compatibility[rootType]) {
                    attributeMult = data.compatibility[rootType];
                } else if ((state.player.spiritualRoot.quality === 'TAP' || state.player.spiritualRoot.quality === 'Tạp' || rootType.includes('Tạp')) && data.compatibility['Tạp']) {
                    attributeMult = data.compatibility['Tạp'];
                } else if (state.player.spiritualRoot.id === 'thien_linh_can') {
                    attributeMult = 1.5;
                }
            } else if (data.element) {
                const rootId = state.player.spiritualRoot.id || '';
                if (rootId === 'thien_linh_can' ||
                    (state.player.spiritualRoot.elements && state.player.spiritualRoot.elements.includes(data.element))) {
                    attributeMult = 1.5;
                }
            }
        }

        const stageMult = 1 + ((entry.stage || 1) - 1) * 0.2;
        const finalMult = masteryMult * qualityMult * attributeMult * stageMult;

        const results = {};
        if (data.stats) {
            if (data.stats.atk) results.atk = data.stats.atk * finalMult;
            if (data.stats.def) results.def = data.stats.def * finalMult;
            if (data.stats.hp) results.hp = data.stats.hp * finalMult;
            if (data.stats.mana) results.mana = data.stats.mana * finalMult;
            if (data.stats.spd) results.spd = data.stats.spd * finalMult;
        }
        return results;
    }

    _renderEquippedArray() {
        if (!state.player) return '';
        const p = state.player;
        const _getTech = (id) => getTechniqueById(id) || getSecretTechniqueById(id) || (state.player.customTechniques || []).find(t => t.id === id);
        
        const activeIds = p.equippedSecretTechniqueIds || [];
        const auxIds = p.equippedAuxiliaryIds || [];
        
        const escapeTech = _getTech(p.mainEscapeId);
        const dualTech = _getTech(p.mainDualId);

        const renderSlot = (title, icon, tech, isSecretTech, emptyLabel = 'Trống') => {
            if (tech) {
                return `
                    <div class="p-2 rounded-xl border border-white/10 bg-white/[0.02] flex items-center space-x-2 cursor-pointer hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                        onclick="window.game.ui.renderTechniqueDetail('${tech.id}', ${isSecretTech})">
                        <span class="text-lg">${tech.icon || icon}</span>
                        <div class="min-w-0 flex-1">
                            <p class="text-[7px] text-gray-500 uppercase tracking-widest font-bold truncate">${title}</p>
                            <p class="text-[9px] font-bold text-white truncate">${tech.name}</p>
                        </div>
                    </div>
                `;
            }
            return `
                <div class="p-2 rounded-xl border border-white/5 bg-white/[0.005] opacity-50 border-dashed flex items-center space-x-2">
                    <span class="text-lg grayscale">${icon}</span>
                    <div class="min-w-0 flex-1">
                        <p class="text-[7px] text-gray-600 uppercase tracking-widest font-bold truncate">${title}</p>
                        <p class="text-[9px] text-gray-600 italic truncate">${emptyLabel}</p>
                    </div>
                </div>
            `;
        };

        // 3 active slots
        let activeSlotsHtml = '';
        for (let i = 0; i < 3; i++) {
            const activeId = activeIds[i] || null;
            const activeTech = _getTech(activeId);
            activeSlotsHtml += renderSlot(`Kỹ Năng ${i + 1}`, '✨', activeTech, true, 'Chưa Trang Bị');
        }

        // Độn Thuật
        const escapeHtml = renderSlot('⚡ Độn Thuật', '⚡', escapeTech, false, 'Chưa Trang Bị');
        // Song Tu
        const dualHtml = renderSlot('☯ Song Tu', '☯', dualTech, false, 'Chưa Trang Bị');

        // 3 auxiliary slots
        let auxSlotsHtml = '';
        for (let i = 0; i < 3; i++) {
            const auxId = auxIds[i] || null;
            const auxTech = _getTech(auxId);
            auxSlotsHtml += renderSlot(`Phụ Trợ ${i + 1}`, '🌀', auxTech, false, 'Chưa Trang Bị');
        }

        return `
            <div class="mb-5 p-3.5 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                <h3 class="text-[8px] font-ancient text-cultivation-gold uppercase tracking-[0.2em] mb-2.5 flex items-center">
                    <i class="ph ph-shield-chevron mr-1.5 text-xs text-cultivation-gold"></i>
                    Trang Bị Khí Hải (Pháp Trận)
                </h3>
                <!-- Grid for slots -->
                <div class="grid grid-cols-2 gap-2 mb-2">
                    ${escapeHtml}
                    ${dualHtml}
                </div>
                <div class="grid grid-cols-3 gap-2 mb-2">
                    ${activeSlotsHtml}
                </div>
                <div class="grid grid-cols-3 gap-2">
                    ${auxSlotsHtml}
                </div>
            </div>
        `;
    }

    renderSubCategoryFilters(tab) {
        if (!this.elTechSubcategoryContainer) return;
        
        const subCatsMap = {
            'phap_thuat': ['Tất Cả', 'Công Kích', 'Phòng Ngự', 'Khống Chế', 'Độn Thuật', 'Phụ Trợ'],
            'than_thong': ['Tất Cả', 'Bản Mệnh', 'Huyết Mạch', 'Nguyên Anh', 'Pháp Tắc', 'Đại Thần Thông'],
            'than_hon':   ['Tất Cả', 'Thần Thức Công Kích', 'Huyễn Thuật', 'Sưu Hồn', 'Hồn Ấn', 'Đoạt Xá'],
            'bi_phap':    ['Tất Cả', 'Bộc Phát', 'Cấm Thuật', 'Hiến Tế', 'Tổn Mệnh', 'Phụ Trợ']
        };

        const subCats = subCatsMap[tab] || [];
        if (subCats.length === 0) {
            this.elTechSubcategoryContainer.classList.add('hidden');
            return;
        }

        this.elTechSubcategoryContainer.classList.remove('hidden');
        state.activeSubCategory = state.activeSubCategory || 'Tất Cả';

        // Check if current activeSubCategory is in the current subCats, if not, reset to 'Tất Cả'
        if (!subCats.includes(state.activeSubCategory)) {
            state.activeSubCategory = 'Tất Cả';
        }

        this.elTechSubcategoryContainer.innerHTML = subCats.map(subCat => {
            const isActive = state.activeSubCategory === subCat;
            const activeClass = isActive
                ? 'bg-cultivation-gold/15 text-cultivation-gold border-cultivation-gold/30 font-bold'
                : 'text-gray-500 border-white/5 hover:text-gray-300 hover:bg-white/[0.02]';
            return `
                <button class="whitespace-nowrap px-3 py-1.5 border rounded-xl text-[8px] font-ancient uppercase tracking-wider transition-all ${activeClass}"
                    onclick="window.game.ui.setTechniqueSubcategory('${subCat}')">
                    ${subCat}
                </button>
            `;
        }).join('');
    }

    renderTechniques(tab = 'linh_luc') {
        if (!state.player) return;

        const backBtn = document.getElementById('tech-back-btn');
        if (backBtn) backBtn.classList.add('hidden');

        this.activeDetailId = null;
        this.activeDetailIsSecret = null;
        state.activeTechTab = tab;

        // Reset subcategory if tab type changes
        const isMainSecretTab = ['phap_thuat', 'than_thong', 'than_hon', 'bi_phap'].includes(tab);
        
        // Sync main tab toggle state just in case
        if (isMainSecretTab) {
            state.activeMainTab = 'ky_nang';
            if (this.parentScreen.btnTechMainTabCongPhap) this.parentScreen.btnTechMainTabCongPhap.className = 'flex-1 text-center py-2.5 rounded-xl text-xs font-ancient uppercase tracking-widest transition-all font-bold text-gray-500 hover:text-gray-300';
            if (this.parentScreen.btnTechMainTabKyNang) this.parentScreen.btnTechMainTabKyNang.className = 'flex-1 text-center py-2.5 rounded-xl text-xs font-ancient uppercase tracking-widest transition-all font-bold bg-qi-blue/15 text-qi-blue border border-qi-blue/20';
            
            if (this.parentScreen.elTechSubTabsCongPhap) this.parentScreen.elTechSubTabsCongPhap.classList.add('hidden');
            if (this.parentScreen.elTechSubTabsKyNang) this.parentScreen.elTechSubTabsKyNang.classList.remove('hidden');
            if (this.parentScreen.elTechSubcategoryContainer) this.parentScreen.elTechSubcategoryContainer.classList.remove('hidden');
        } else {
            state.activeMainTab = 'cong_phap';
            if (this.parentScreen.btnTechMainTabCongPhap) this.parentScreen.btnTechMainTabCongPhap.className = 'flex-1 text-center py-2.5 rounded-xl text-xs font-ancient uppercase tracking-widest transition-all font-bold bg-qi-blue/15 text-qi-blue border border-qi-blue/20';
            if (this.parentScreen.btnTechMainTabKyNang) this.parentScreen.btnTechMainTabKyNang.className = 'flex-1 text-center py-2.5 rounded-xl text-xs font-ancient uppercase tracking-widest transition-all font-bold text-gray-500 hover:text-gray-300';
            
            if (this.parentScreen.elTechSubTabsCongPhap) this.parentScreen.elTechSubTabsCongPhap.classList.remove('hidden');
            if (this.parentScreen.elTechSubTabsKyNang) this.parentScreen.elTechSubTabsKyNang.classList.add('hidden');
            if (this.parentScreen.elTechSubcategoryContainer) this.parentScreen.elTechSubcategoryContainer.classList.add('hidden');
        }

        // Update tab styling highlighting
        const allTabBtns = [
            this.btnTechTabLinhLuc, this.btnTechTabLuyenThe, this.btnTechTabThanThuc, 
            this.btnTechTabPhapThuat, this.btnTechTabThanThong, this.btnTechTabThanHon, 
            this.btnTechTabBiPhap
        ].filter(Boolean);
        
        if (allTabBtns.length) {
            const defaultClass = 'flex-1 text-center whitespace-nowrap px-4 py-2 text-gray-500 rounded-lg text-[9px] font-ancient uppercase tracking-widest transition-all';
            allTabBtns.forEach(btn => btn.className = defaultClass);

            const activeMap = {
                'linh_luc':   { btn: this.btnTechTabLinhLuc,   cls: 'bg-qi-blue/15 text-qi-blue border border-qi-blue/20' },
                'luyen_the':  { btn: this.btnTechTabLuyenThe,  cls: 'bg-orange-500/15 text-orange-400 border border-orange-500/20' },
                'than_thuc':  { btn: this.btnTechTabThanThuc,  cls: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20' },
                'phap_thuat': { btn: this.btnTechTabPhapThuat, cls: 'bg-teal-500/15 text-teal-400 border border-teal-500/20' },
                'than_thong': { btn: this.btnTechTabThanThong, cls: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' },
                'than_hon':   { btn: this.btnTechTabThanHon,   cls: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' },
                'bi_phap':    { btn: this.btnTechTabBiPhap,    cls: 'bg-red-500/15 text-red-400 border border-red-500/20' }
            };
            const active = activeMap[tab];
            if (active && active.btn) {
                active.btn.className = `flex-1 text-center whitespace-nowrap px-4 py-2 ${active.cls} rounded-lg text-[9px] font-ancient uppercase tracking-widest transition-all font-bold`;
            }
        }

        // Render subcategory headers if Kỹ Năng
        if (isMainSecretTab) {
            this.renderSubCategoryFilters(tab);
        }

        if (this.elTechListView) {
            this.elTechListView.innerHTML = '';
            this.elTechListView.classList.remove('hidden');
            if (this.elTechDetailView) this.elTechDetailView.classList.add('hidden');

            // Draw premium Khí Hải slot view at the top of Kỹ Năng screen
            if (isMainSecretTab) {
                const arrayDiv = document.createElement('div');
                arrayDiv.innerHTML = this._renderEquippedArray();
                this.elTechListView.appendChild(arrayDiv);
            }

            // Filter comprehension list
            const compList = (state.player.comprehendingTechniques || []).filter(c => {
                if (isMainSecretTab) {
                    let cat = '';
                    let subCat = '';
                    if (c.isSecret) {
                        const d = getSecretTechniqueById(c.id);
                        if (!d) return false;
                        cat = d.category;
                        subCat = d.subCategory;
                    } else {
                        const d = getTechniqueById(c.id) || (state.player.customTechniques || []).find(t => t.id === c.id);
                        if (!d) return false;
                        const dType = getTechniqueTypeSlug(d.type);
                        if (dType === 'don_thuat') { cat = 'Pháp Thuật'; subCat = 'Độn Thuật'; }
                        else if (dType === 'phu_tro') { cat = 'Pháp Thuật'; subCat = 'Phụ Trợ'; }
                        else if (dType === 'song_tu') { cat = 'Bí Pháp'; subCat = 'Phụ Trợ'; }
                        else return false;
                    }

                    let matchMain = false;
                    if (tab === 'phap_thuat') matchMain = cat === 'Pháp Thuật';
                    else if (tab === 'than_thong') matchMain = cat === 'Thần Thông';
                    else if (tab === 'than_hon') matchMain = cat === 'Thần Hồn Thuật';
                    else if (tab === 'bi_phap') matchMain = cat === 'Bí Pháp';

                    if (!matchMain) return false;
                    if (state.activeSubCategory && state.activeSubCategory !== 'Tất Cả') {
                        return subCat === state.activeSubCategory;
                    }
                    return true;
                } else {
                    if (c.isSecret) return false;
                    const d = getTechniqueById(c.id) || (state.player.customTechniques || []).find(t => t.id === c.id);
                    if (!d) return false;
                    const dType = getTechniqueTypeSlug(d.type);
                    if (tab === 'linh_luc') return dType === 'linh_luc';
                    if (tab === 'luyen_the') return dType === 'luyen_the';
                    if (tab === 'than_thuc') return dType === 'than_thuc';
                    return false;
                }
            });

            // Draw comprehension progress bars
            if (compList.length > 0) {
                const header = document.createElement('div');
                header.className = 'mb-4 border-b border-white/5 pb-2 mt-2';
                header.innerHTML = `
                    <div class="flex justify-between items-center">
                        <h3 class="text-[9px] font-ancient text-cultivation-gold uppercase tracking-[0.2em] flex items-center">
                            <i class="ph ph-brain mr-1.5 animate-pulse text-xs"></i>
                            Đang Tham Ngộ Bí Điển
                        </h3>
                        <span class="text-[7px] bg-cultivation-gold/10 text-cultivation-gold px-1.5 py-0.5 rounded border border-cultivation-gold/20 font-bold uppercase">${compList.length} Đang Đọc</span>
                    </div>
                `;
                this.elTechListView.appendChild(header);

                compList.forEach((current, idx) => {
                    const techData = current.isSecret
                        ? getSecretTechniqueById(current.id)
                        : (getTechniqueById(current.id) || (state.player.customTechniques || []).find(t => t.id === current.id));

                    if (!techData) return;

                    const info = state.player.getTechniqueComprehensionInfo(current.id);
                    const timeRemaining = Math.max(0, current.durationLeft);

                    let timeStr = '';
                    if (timeRemaining > 3600) {
                        const h = Math.floor(timeRemaining / 3600);
                        const m = Math.floor((timeRemaining % 3600) / 60);
                        timeStr = `${h}h ${m}m`;
                    } else if (timeRemaining > 60) {
                        const m = Math.floor(timeRemaining / 60);
                        const s = Math.floor(timeRemaining % 60);
                        timeStr = `${m}m ${s}s`;
                    } else {
                        timeStr = `${Math.ceil(timeRemaining)}s`;
                    }

                    const isActive = idx === 0;
                    const barColorClass = current.isSecret ? 'bg-qi-purple' : 'bg-qi-blue';
                    const activePill = isActive
                        ? `<span class="text-[7px] px-1.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/25 rounded font-bold uppercase tracking-wider animate-pulse whitespace-nowrap">Đang Đọc</span>`
                        : `<span class="text-[7px] px-1.5 py-0.5 bg-gray-500/10 text-gray-400 border border-gray-500/25 rounded font-bold uppercase tracking-wider whitespace-nowrap">Đang Đợi</span>`;

                    let breakdownHtml = '';
                    if (isActive && current.speedBreakdown) {
                        const sb = current.speedBreakdown;
                        let physiqueRow = '';
                        if (sb.physique && sb.physique !== 1.0) {
                            physiqueRow = `
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">🦴</span> Thể Chất:</span>
                                    <span class="text-green-400 font-mono font-bold">${sb.physiqueText || 'Phù Hợp'} (${sb.physique.toFixed(2)}x)</span>
                                </div>
                            `;
                        }
                        let meridianRow = '';
                        if (sb.meridian && sb.meridian !== 1.0) {
                            meridianRow = `
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">🕸️</span> Kinh Mạch:</span>
                                    <span class="${sb.meridian < 1.0 ? 'text-red-400' : 'text-green-400'} font-mono font-bold">${sb.meridianText || 'Khơi Thông'} (${sb.meridian.toFixed(2)}x)</span>
                                </div>
                            `;
                        }
                        let bloodlineRow = '';
                        if (sb.bloodline && sb.bloodline !== 1.0) {
                            bloodlineRow = `
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">🩸</span> Huyết Mạch:</span>
                                    <span class="text-green-400 font-mono font-bold">${sb.bloodlineText || 'Huyết Trạch'} (${sb.bloodline.toFixed(2)}x)</span>
                                </div>
                            `;
                        }

                        breakdownHtml = `
                            <div class="mt-2 p-2 bg-black/20 border border-white/5 rounded-xl space-y-1 text-[8px] text-gray-400">
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">🧠</span> Ngộ Tính:</span>
                                    <span class="text-white font-mono font-bold">${sb.savvy.toFixed(2)}x</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">💧</span> Linh Căn:</span>
                                    <span class="${sb.root < 1.0 ? 'text-red-400' : 'text-green-400'} font-mono font-bold">${sb.rootText || 'Bình thường'} (${sb.root.toFixed(2)}x)</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">👁️</span> Thần Thức:</span>
                                    <span class="text-white font-mono font-bold">${sb.soul.toFixed(2)}x</span>
                                </div>
                                ${physiqueRow}
                                ${meridianRow}
                                ${bloodlineRow}
                            </div>
                        `;
                    }

                    const el = document.createElement('div');
                    el.className = `p-4 border ${isActive ? 'border-cultivation-gold/30 bg-cultivation-gold/[0.02]' : 'border-white/5 bg-white/[0.01] opacity-70'} rounded-2xl mb-4 space-y-3 relative overflow-hidden`;

                    if (isActive) {
                        el.classList.add('shadow-[0_0_15px_rgba(217,119,6,0.05)]');
                    }

                    el.innerHTML = `
                        <div class="flex justify-between items-start">
                            <div class="flex items-center space-x-3">
                                <div class="text-2xl">${techData.icon || (current.isSecret ? '✨' : '📜')}</div>
                                <div>
                                    <h4 class="text-sm font-bold text-white font-ancient flex items-center">
                                        ${techData.name}
                                        <span class="ml-2 text-[7px] px-1.5 py-0.2 bg-white/5 rounded text-gray-400 font-mono font-normal">${techData.quality || 'Hoàng Giai'}</span>
                                    </h4>
                                    <p class="text-[8px] text-gray-500 mt-0.5">Độ khó: <span class="font-bold text-cultivation-gold">${info.difficultyName}</span> | Còn lại: <span class="font-mono text-white">${timeStr}</span></p>
                                </div>
                            </div>
                            ${activePill}
                        </div>
                        <div class="space-y-1">
                            <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                                <div class="h-full ${barColorClass} transition-all duration-300" style="width: ${current.progress}%"></div>
                            </div>
                            <div class="flex justify-between items-center text-[8px] text-gray-500">
                                <span>Tiến độ: ${current.progress}%</span>
                                ${isActive ? `<span class="italic text-qi-blue font-bold">Tốc độ: ${(current.speedMult || 1.0).toFixed(2)}x</span>` : ''}
                            </div>
                            ${breakdownHtml}
                        </div>
                    `;
                    this.elTechListView.appendChild(el);
                });
            }

            // Unified filter for learned lists based on current selected tab
            let list = [];
            if (isMainSecretTab) {
                // Add matching standard auxiliary techniques
                state.player.learnedTechniques.forEach(entry => {
                    const data = getTechniqueById(entry.id) || (state.player.customTechniques || []).find(t => t.id === entry.id);
                    if (!data) return;
                    
                    let cat = '';
                    let subCat = '';
                    const dType = getTechniqueTypeSlug(data.type);
                    if (dType === 'don_thuat') { cat = 'Pháp Thuật'; subCat = 'Độn Thuật'; }
                    else if (dType === 'phu_tro') { cat = 'Pháp Thuật'; subCat = 'Phụ Trợ'; }
                    else if (dType === 'song_tu') { cat = 'Bí Pháp'; subCat = 'Phụ Trợ'; }
                    else return;

                    let matchMain = false;
                    if (tab === 'phap_thuat') matchMain = cat === 'Pháp Thuật';
                    else if (tab === 'than_thong') matchMain = cat === 'Thần Thông';
                    else if (tab === 'than_hon') matchMain = cat === 'Thần Hồn Thuật';
                    else if (tab === 'bi_phap') matchMain = cat === 'Bí Pháp';

                    if (!matchMain) return;
                    if (state.activeSubCategory && state.activeSubCategory !== 'Tất Cả') {
                        if (subCat !== state.activeSubCategory) return;
                    }

                    list.push({ entry, data, isSecret: false, subCat });
                });

                // Add matching active secret techniques
                state.player.learnedSecretTechniques.forEach(entry => {
                    const data = getSecretTechniqueById(entry.id);
                    if (!data) return;

                    const cat = data.category;
                    const subCat = data.subCategory;

                    let matchMain = false;
                    if (tab === 'phap_thuat') matchMain = cat === 'Pháp Thuật';
                    else if (tab === 'than_thong') matchMain = cat === 'Thần Thông';
                    else if (tab === 'than_hon') matchMain = cat === 'Thần Hồn Thuật';
                    else if (tab === 'bi_phap') matchMain = cat === 'Bí Pháp';

                    if (!matchMain) return;
                    if (state.activeSubCategory && state.activeSubCategory !== 'Tất Cả') {
                        if (subCat !== state.activeSubCategory) return;
                    }

                    list.push({ entry, data, isSecret: true, subCat });
                });
            } else {
                // Công Pháp list
                state.player.learnedTechniques.forEach(entry => {
                    const data = getTechniqueById(entry.id) || (state.player.customTechniques || []).find(t => t.id === entry.id);
                    if (!data) return;
                    const dType = getTechniqueTypeSlug(data.type);
                    if (tab === 'linh_luc' && dType !== 'linh_luc') return;
                    if (tab === 'luyen_the' && dType !== 'luyen_the') return;
                    if (tab === 'than_thuc' && dType !== 'than_thuc') return;

                    list.push({ entry, data, isSecret: false, subCat: getTechniqueTypeLabel(data.type) });
                });
            }

            // Draw techniques list
            if (list.length === 0) {
                if (compList.length === 0) {
                    let typeName = 'kỹ năng';
                    if (tab === 'linh_luc') typeName = 'công pháp linh lực';
                    else if (tab === 'luyen_the') typeName = 'công pháp luyện thể';
                    else if (tab === 'than_thuc') typeName = 'công pháp luyện hồn';
                    else if (tab === 'phap_thuat') typeName = 'pháp thuật';
                    else if (tab === 'than_thong') typeName = 'thần thông';
                    else if (tab === 'than_hon') typeName = 'thần hồn thuật';
                    else if (tab === 'bi_phap') typeName = 'bí pháp';
                    this.elTechListView.appendChild(Object.assign(document.createElement('div'), {
                        className: 'text-center py-20 text-gray-600 italic text-xs',
                        textContent: `Ngươi chưa lĩnh ngộ ${typeName} nào phù hợp...`
                    }));
                }
            } else {
                const listHeader = document.createElement('div');
                listHeader.className = 'mb-4 border-b border-white/5 pb-2 mt-6';
                listHeader.innerHTML = `
                    <h3 class="text-[9px] font-ancient text-gray-500 uppercase tracking-[0.2em] flex items-center">
                        <i class="ph ph-scroll mr-1.5 text-xs text-cultivation-gold"></i>
                        ${isMainSecretTab ? 'Kỹ Năng Kích Hoạt Đã Ngộ' : 'Bản Thể Công Pháp Đã Lập'}
                    </h3>
                `;
                this.elTechListView.appendChild(listHeader);

                list.forEach(({ entry, data, isSecret, subCat }) => {
                    const mastery = MASTERY_LEVELS.find(m => m.id === (entry.masteryLevel || 1));
                    const stageLabel = data.stageLabel || 'Tầng';
                    const stageName = (data.stageNames && data.stageNames[entry.stage - 1]) ? data.stageNames[entry.stage - 1] : `${stageLabel} ${entry.stage || 1}`;

                    // Check equipped state
                    let isEquipped = false;
                    if (isSecret) {
                        isEquipped = (state.player.equippedSecretTechniqueIds || []).includes(entry.id);
                    } else {
                        const dType = getTechniqueTypeSlug(data.type);
                        if (dType === 'linh_luc') isEquipped = state.player.mainTechniqueId === entry.id;
                        else if (dType === 'luyen_the') isEquipped = state.player.mainBodyTechniqueId === entry.id;
                        else if (dType === 'than_thuc') isEquipped = state.player.mainSoulTechniqueId === entry.id;
                        else if (dType === 'don_thuat') isEquipped = state.player.mainEscapeId === entry.id;
                        else if (dType === 'song_tu') isEquipped = state.player.mainDualId === entry.id;
                        else if (dType === 'phu_tro') isEquipped = (state.player.equippedAuxiliaryIds || []).includes(entry.id);
                    }

                    // Passive rate display
                    let rateText = '';
                    if (!isSecret) {
                        const rate = this.getTechniquePassiveRate(entry, data);
                        const dType = getTechniqueTypeSlug(data.type);
                        if (dType === 'linh_luc' || dType === 'song_tu' || dType === 'phu_tro') rateText = `+${rate.toFixed(1)} Tu Vi/s`;
                        else if (dType === 'luyen_the') rateText = `+${rate.toFixed(1)} Thể Exp/s`;
                        else if (dType === 'than_thuc') rateText = `+${rate.toFixed(1)} Thần Exp/s`;
                    }

                    // Active stat bonuses comparison display
                    const activeStats = this.getTechniqueActiveStats(entry, data);
                    const statsParts = [];
                    if (activeStats.hp) statsParts.push(`Khí huyết +${Math.round(activeStats.hp)}`);
                    if (activeStats.mana) statsParts.push(`Pháp lực +${Math.round(activeStats.mana)}`);
                    if (activeStats.atk) statsParts.push(`Công +${Math.round(activeStats.atk)}`);
                    if (activeStats.def) statsParts.push(`Thủ +${Math.round(activeStats.def)}`);
                    if (activeStats.spd) statsParts.push(`Thân pháp +${Math.round(activeStats.spd)}`);
                    const statsText = statsParts.length > 0 ? `| ${statsParts.join(' | ')}` : '';

                    let borderColor = 'border-white/5 bg-white/[0.01]';
                    let badgeClass = 'bg-gray-500/10 text-gray-400 border-white/5';
                    if (isEquipped) {
                        borderColor = 'border-cultivation-gold/30 bg-cultivation-gold/[0.03] shadow-[0_0_15px_rgba(217,119,6,0.03)]';
                        badgeClass = 'bg-cultivation-gold/20 text-cultivation-gold border-cultivation-gold/30 font-bold';
                    }

                    let realmLockedText = '';
                    if (isSecret && data.category === 'Thần Thông' && data.requiredRealmId && state.player.realmId < data.requiredRealmId) {
                        realmLockedText = `<span class="text-[7px] ml-1.5 px-1 py-0.5 bg-red-500/20 border border-red-500/40 rounded text-red-300 font-bold uppercase">Yêu cầu Trúc Cơ Kỳ</span>`;
                    }

                    const el = document.createElement('div');
                    el.className = `p-4 border ${borderColor} rounded-2xl flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all mb-3`;
                    el.innerHTML = `
                        <div class="flex items-center space-x-4">
                            <div class="text-2xl">${data.icon || (isSecret ? '✨' : '📜')}</div>
                            <div>
                                <h4 class="text-sm font-bold text-white flex items-center flex-wrap gap-1.5">
                                    ${data.name} ${realmLockedText}
                                    ${isEquipped ? `<span class="text-[7px] px-1.5 py-0.5 bg-green-500/20 text-green-300 border border-green-500/30 rounded font-bold uppercase tracking-wider animate-pulse flex items-center gap-0.5">☯ ĐANG TRANG BỊ</span>` : ''}
                                </h4>
                                <div class="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1 text-[8px] text-gray-500">
                                    <span class="text-[8px] px-1.5 py-0.5 bg-black/40 rounded border border-white/5 text-gray-400 font-mono">${stageName}</span>
                                    <span class="text-[8px] text-cultivation-gold font-bold">${mastery?.name || 'Nhập Môn'}</span>
                                    ${isMainSecretTab ? `<span class="text-[8px] px-1.5 py-0.5 rounded border ${badgeClass} uppercase tracking-wider font-bold">${subCat}</span>` : ''}
                                    ${rateText ? `<span class="text-[8px] text-qi-blue font-semibold">${rateText}</span>` : ''}
                                    <span class="text-[8px] text-gray-400 font-mono">${statsText}</span>
                                </div>
                            </div>
                        </div>
                        <i class="ph ph-caret-right text-gray-600"></i>
                    `;
                    el.onclick = () => this.renderTechniqueDetail(entry.id, isSecret);
                    this.elTechListView.appendChild(el);
                });
            }
        }

        if (this.elTechPoints) this.elTechPoints.textContent = state.player.techniquePoints || 0;
    }

    renderTechniqueDetail(id, isSecret) {
        if (!this.elTechDetailContent) return;

        this.activeDetailId = id;
        this.activeDetailIsSecret = isSecret;

        const entry = isSecret ? state.player.learnedSecretTechniques.find(s => s.id === id) : state.player.learnedTechniques.find(t => t.id === id);
        const data = isSecret
            ? getSecretTechniqueById(id)
            : (getTechniqueById(id) || (state.player.customTechniques || []).find(t => t.id === id));
        if (!entry || !data) return;

        if (this.elTechListView) this.elTechListView.classList.add('hidden');
        if (this.elTechDetailView) this.elTechDetailView.classList.remove('hidden');

        const backBtn = document.getElementById('tech-back-btn');
        if (backBtn) backBtn.classList.remove('hidden');

        const currentMasteryIdx = MASTERY_LEVELS.findIndex(m => m.id === (entry.masteryLevel || 1));
        const mastery = MASTERY_LEVELS[currentMasteryIdx];
        const nextMastery = MASTERY_LEVELS[currentMasteryIdx + 1];

        const stageLabel = data.stageLabel || 'Tầng';
        const stageName = (data.stageNames && data.stageNames[entry.stage - 1]) ? data.stageNames[entry.stage - 1] : `${stageLabel} ${entry.stage || 1}`;

        const isFullyMastered = isSecret
            ? (entry.masteryLevel >= 5)
            : (entry.stage >= (data.maxStage || 10) && entry.masteryLevel >= 5);

        let isEquipped = false;
        let unequipType = '';

        if (isSecret) {
            isEquipped = (state.player.equippedSecretTechniqueIds || []).includes(id);
            unequipType = 'bi_phap';
        } else {
            const dType = getTechniqueTypeSlug(data.type);
            if (dType === 'linh_luc') { isEquipped = state.player.mainTechniqueId === id; }
            else if (dType === 'luyen_the') { isEquipped = state.player.mainBodyTechniqueId === id; }
            else if (dType === 'than_thuc') { isEquipped = state.player.mainSoulTechniqueId === id; }
            else if (dType === 'don_thuat') { isEquipped = state.player.mainEscapeId === id; unequipType = 'don_thuat'; }
            else if (dType === 'song_tu') { isEquipped = state.player.mainDualId === id; unequipType = 'song_tu'; }
            else if (dType === 'phu_tro') { isEquipped = (state.player.equippedAuxiliaryIds || []).includes(id); unequipType = 'phu_tro'; }
        }

        // Calculate passive rate text and stat bonuses
        let rateText = '';
        let statsText = '';
        if (!isSecret) {
            const rate = this.getTechniquePassiveRate(entry, data);
            const dType = getTechniqueTypeSlug(data.type);
            if (dType === 'linh_luc' || dType === 'song_tu' || dType === 'phu_tro') rateText = `+${rate.toFixed(1)} Tu Vi/s`;
            else if (dType === 'luyen_the') rateText = `+${rate.toFixed(1)} Thể Exp/s`;
            else if (dType === 'than_thuc') rateText = `+${rate.toFixed(1)} Thần Exp/s`;

            const activeStats = this.getTechniqueActiveStats(entry, data);
            const statsParts = [];
            if (activeStats.hp) statsParts.push(`Khí huyết +${Math.round(activeStats.hp)}`);
            if (activeStats.mana) statsParts.push(`Pháp lực +${Math.round(activeStats.mana)}`);
            if (activeStats.atk) statsParts.push(`Công +${Math.round(activeStats.atk)}`);
            if (activeStats.def) statsParts.push(`Thủ +${Math.round(activeStats.def)}`);
            if (activeStats.spd) statsParts.push(`Thân pháp +${Math.round(activeStats.spd)}`);
            statsText = statsParts.join(' | ');
        }

        // Elegant side-by-side grouped button row
        let buttonsHtml = '';
        let leftBtn = '';
        if (isFullyMastered) {
            leftBtn = `<button class="flex-grow py-3 bg-gray-800 text-gray-500 opacity-50 cursor-not-allowed text-[10px] font-bold rounded-xl font-ancient uppercase tracking-wider">ĐÃ VIÊN MÃN</button>`;
        } else {
            leftBtn = `<button class="flex-grow py-3 ${(state.player.techniquePoints || 0) >= 1 ? 'bg-qi-blue text-black active:scale-95' : 'bg-gray-800 text-gray-500 opacity-50 cursor-not-allowed'} text-[10px] font-bold rounded-xl transition-all font-ancient uppercase tracking-wider" 
                ${(state.player.techniquePoints || 0) >= 1 ? `onclick="window.game.cultivateTechnique('${id}', ${isSecret})"` : ''}>THAM NGỘ</button>`;
        }

        let rightBtn = '';
        if (isEquipped) {
            if (unequipType) {
                // Working unequip button for auxiliary or secret skills
                rightBtn = `
                    <button class="flex-grow py-3 bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold rounded-xl active:scale-95 transition-all font-ancient uppercase tracking-wider"
                        onclick="window.game.ui.unequipTechnique('${unequipType}', '${id}', ${isSecret})">
                        <i class="ph ph-trash-simple mr-0.5"></i> THÁO GỠ
                    </button>
                `;
            } else {
                // Core cultivation method can't be unequipped
                rightBtn = `
                    <button class="flex-grow py-3 bg-cultivation-gold/15 text-cultivation-gold border border-cultivation-gold/20 text-[10px] font-bold rounded-xl cursor-default opacity-85 font-ancient uppercase tracking-wider" disabled>
                        <i class="ph ph-check-circle mr-0.5"></i> ĐANG TRANG BỊ
                    </button>
                `;
            }
        } else {
            // Equip button
            rightBtn = `
                <button class="flex-grow py-3 bg-cultivation-gold text-black text-[10px] font-bold rounded-xl active:scale-95 transition-all font-ancient uppercase tracking-wider"
                    onclick="window.game.ui.equipTechnique('${id}', ${isSecret})">
                    <i class="ph ph-shield-star mr-0.5"></i> TRANG BỊ
                </button>
            `;
        }

        buttonsHtml = `
            <div class="flex space-x-2.5 mt-2">
                ${leftBtn}
                ${rightBtn}
            </div>
        `;

        this.elTechDetailContent.innerHTML = `
            <div class="flex flex-col items-center text-center space-y-4">
                <div class="text-6xl p-6 bg-white/5 rounded-full border border-white/10">${data.icon || (isSecret ? '✨' : '📜')}</div>
                <div>
                    <h3 class="text-2xl font-ancient text-white">${data.name}</h3>
                    <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">${data.quality || 'Phàm Khí'} | ${stageName}</p>
                </div>
            </div>

            <div class="bg-black/40 p-5 rounded-3xl border border-white/5 space-y-4">
                <div class="flex justify-between items-end mb-1">
                    <span class="text-[9px] text-gray-500 uppercase tracking-widest font-ancient">Độ Thuần Thục: ${mastery?.name || 'Nhập Môn'}</span>
                    <span class="text-[10px] font-mono text-white">${Number(entry.mastery.toFixed(2))} / ${nextMastery?.threshold || 'MAX'}</span>
                </div>
                <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-cultivation-gold" style="width: ${entry.masteryLevel >= 5 ? 100 : (entry.mastery / (nextMastery?.threshold || 1)) * 100}%"></div>
                </div>
                
                ${rateText || statsText ? `
                    <div class="pt-3 border-t border-white/5 flex flex-col space-y-1.5 text-center">
                        ${rateText ? `<p class="text-[10px] text-qi-blue font-bold flex items-center justify-center gap-1 font-ancient uppercase tracking-wider"><i class="ph ph-lightning"></i> Tốc độ hấp thu: ${rateText}</p>` : ''}
                        ${statsText ? `<p class="text-[9px] text-gray-400 font-mono flex items-center justify-center gap-1"><i class="ph ph-shield"></i> Thuộc tính: ${statsText}</p>` : ''}
                    </div>
                ` : ''}
                
                ${buttonsHtml}
            </div>

            <div class="space-y-4">
                <h4 class="text-xs font-ancient text-gray-500 uppercase tracking-widest border-l-2 border-gray-500 pl-3">Mô tả & Hiệu ứng</h4>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs text-gray-400 leading-relaxed">
                    ${data.description || 'Không có mô tả.'}
                </div>
            </div>
        `;
    }

    _renderPhuTroTab() {
        if (!this.elTechListView) return;
        const p = state.player;

        const _getTech = (id) => id ? getTechniqueById(id) : null;
        const _getLearned = (id) => id ? p.learnedTechniques.find(t => t.id === id) : null;

        const _slotCard = (label, color, icon, tech, learnedEntry, emptyMsg, type, extraIndex = null) => {
            if (tech && learnedEntry) {
                const mastery = MASTERY_LEVELS.find(m => m.id === (learnedEntry.masteryLevel || 1));
                const stageName = tech.stageNames?.[learnedEntry.stage - 1] || `${tech.stageLabel || 'Tầng'} ${learnedEntry.stage || 1}`;
                return `
                    <div class="p-4 rounded-2xl border ${color} bg-black/40 shadow-lg relative group transition-all duration-300 hover:border-white/20">
                        <div class="text-[8px] text-gray-500 uppercase tracking-widest mb-2 font-bold">${label}</div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="text-2xl">${icon}</span>
                                <div>
                                    <p class="text-xs font-bold text-white font-ancient">${tech.name}</p>
                                    <div class="flex items-center space-x-2 mt-0.5">
                                        <span class="text-[8px] text-gray-400 font-mono">${stageName}</span>
                                        <span class="text-[8px] text-cultivation-gold font-bold">${mastery?.name || 'Nhập Môn'}</span>
                                    </div>
                                </div>
                            </div>
                            <button class="text-[8px] px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl active:scale-95 transition-all hover:bg-red-500/25 hover:text-red-300"
                                onclick="window.game.player.unequipTechnique('${type}', '${learnedEntry.id}'); window.game.ui.renderTechniques('phu_tro');">Tháo</button>
                        </div>
                    </div>
                `;
            }
            // Empty slot style
            return `
                <div class="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-center items-center text-center py-6 opacity-60 border-dashed hover:opacity-90 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300">
                    <span class="text-2xl mb-1">${icon}</span>
                    <p class="text-[8px] text-gray-500 uppercase tracking-widest font-bold">${label}</p>
                    <p class="text-[10px] text-gray-600 italic mt-0.5">${emptyMsg}</p>
                </div>
            `;
        };

        // Auxiliary slots (up to 3)
        const auxIds = p.equippedAuxiliaryIds || [];
        let auxSlots = '';
        for (let i = 0; i < 3; i++) {
            const auxId = auxIds[i] || null;
            const auxTech = _getTech(auxId);
            const auxLearned = _getLearned(auxId);
            auxSlots += _slotCard(`Khe Phụ Tu ${i + 1}`, 'border-emerald-500/20 bg-emerald-500/[0.03]', '🌀', auxTech, auxLearned, 'Chưa trang bị', 'phu_tro', auxId);
        }

        // Escape slot
        const escapeTech = _getTech(p.mainEscapeId);
        const escapeLearned = _getLearned(p.mainEscapeId);
        const escapeSlot = _slotCard('⚡ Độn Thuật', 'border-yellow-500/20 bg-yellow-500/[0.03] shadow-[0_0_15px_rgba(234,179,8,0.03)]', '⚡', escapeTech, escapeLearned, 'Chưa trang bị', 'don_thuat');

        // Dual cultivation slot
        const dualTech = _getTech(p.mainDualId);
        const dualLearned = _getLearned(p.mainDualId);
        const dualSlot = _slotCard('☯️ Song Tu', 'border-pink-500/20 bg-pink-500/[0.03] shadow-[0_0_15px_rgba(236,72,153,0.03)]', '☯️', dualTech, dualLearned, 'Chưa trang bị', 'song_tu');

        // Learned but unequipped techniques of these types
        const learnableSlugs = ['don_thuat', 'song_tu', 'phu_tro'];
        const unequipped = p.learnedTechniques.filter(t => {
            const d = getTechniqueById(t.id);
            if (!d) return false;
            const dType = getTechniqueTypeSlug(d.type);
            if (!learnableSlugs.includes(dType)) return false;
            if (dType === 'don_thuat') return p.mainEscapeId !== t.id;
            if (dType === 'song_tu') return p.mainDualId !== t.id;
            if (dType === 'phu_tro') return !(p.equippedAuxiliaryIds || []).includes(t.id);
            return false;
        });

        let unequippedHtml = '';
        if (unequipped.length > 0) {
            unequippedHtml = `
                <div class="mt-8 border-t border-white/5 pt-6">
                    <h3 class="text-[9px] font-ancient text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center">
                        <i class="ph ph-books mr-1.5 text-xs text-cultivation-gold"></i>
                        Danh Sách Pháp Điển Dự Phòng
                    </h3>
                    <div class="grid grid-cols-1 gap-2">
                        ${unequipped.map(t => {
                const d = getTechniqueById(t.id);
                if (!d) return '';
                const dType = getTechniqueTypeSlug(d.type);
                const catColor = {
                    'don_thuat': 'text-yellow-300 border-yellow-500/20 bg-yellow-500/5',
                    'song_tu': 'text-pink-300 border-pink-500/20 bg-pink-500/5',
                    'phu_tro': 'text-emerald-300 border-emerald-500/20 bg-emerald-500/5',
                    'Độn Thuật': 'text-yellow-300 border-yellow-500/20 bg-yellow-500/5',
                    'Song Tu': 'text-pink-300 border-pink-500/20 bg-pink-500/5',
                    'Phụ Trợ': 'text-emerald-300 border-emerald-500/20 bg-emerald-500/5'
                }[dType] || 'text-gray-400 border-white/5';

                const rate = this.getTechniquePassiveRate(t, d);
                const rateText = rate > 0 ? `<span class="text-[7px] px-1.5 py-0.5 bg-black/40 border border-white/5 rounded text-gray-400 font-mono">+${rate.toFixed(1)} Tu Vi/s</span>` : '';

                const activeStats = this.getTechniqueActiveStats(t, d);
                const statsParts = [];
                if (activeStats.hp) statsParts.push(`Khí huyết +${Math.round(activeStats.hp)}`);
                if (activeStats.mana) statsParts.push(`Pháp lực +${Math.round(activeStats.mana)}`);
                if (activeStats.atk) statsParts.push(`Công +${Math.round(activeStats.atk)}`);
                if (activeStats.def) statsParts.push(`Thủ +${Math.round(activeStats.def)}`);
                if (activeStats.spd) statsParts.push(`Thân pháp +${Math.round(activeStats.spd)}`);
                const statsText = statsParts.length > 0 ? `<span class="text-[7px] text-gray-500 font-mono">(${statsParts.join(', ')})</span>` : '';

                return `
                                <div class="p-3 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/5 hover:border-white/10 cursor-pointer transition-all duration-300"
                                    onclick="window.game.ui.renderTechniqueDetail('${t.id}', false)">
                                    <div class="flex items-center space-x-3">
                                        <span class="text-xl">${d.icon || '📜'}</span>
                                        <div>
                                            <p class="text-xs font-bold text-white">${d.name}</p>
                                            <div class="flex items-center space-x-1.5 mt-0.5 flex-wrap gap-y-1">
                                                <span class="text-[7px] px-1.5 py-0.5 rounded border ${catColor} font-bold uppercase tracking-wider">${d.type}</span>
                                                ${rateText}
                                                ${statsText}
                                            </div>
                                        </div>
                                    </div>
                                    <button class="text-[8px] px-2 py-1 bg-cultivation-gold text-black font-bold rounded-xl active:scale-95 transition-all hover:bg-white"
                                        onclick="event.stopPropagation(); window.game.setMainTechnique('${t.id}'); window.game.ui.renderTechniques('phu_tro');">Trang Bị</button>
                                </div>
                            `;
            }).join('')}
                    </div>
                </div>
            `;
        }

        this.elTechListView.innerHTML = `
            <div class="space-y-4">
                <div class="mb-4">
                    <h3 class="font-ancient text-emerald-400 text-lg">Tu Luyện Pháp Trận</h3>
                    <p class="text-[8px] text-gray-500 uppercase tracking-widest mt-1">Trang bị để kích hoạt thần thông bị động, gia trì thân pháp và hộ vệ đạo tâm</p>
                </div>
                
                <!-- Celestial Core Array Layout -->
                <div class="grid grid-cols-2 gap-3 mb-3">
                    ${escapeSlot}
                    ${dualSlot}
                </div>
                
                <!-- Auxiliary Slots Layout -->
                <div class="grid grid-cols-3 gap-2">
                    ${auxSlots}
                </div>

                ${unequippedHtml}
            </div>
        `;
    }
}
