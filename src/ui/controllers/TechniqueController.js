import { state } from '../../state.js';
import { getTechniqueById, getSecretTechniqueById, MASTERY_LEVELS } from '../../configs/technique-data.js';

export class TechniqueController {
    constructor(parentScreen) {
        this.parentScreen = parentScreen;
    }

    get btnTechTabLinhLuc() { return this.parentScreen.btnTechTabLinhLuc; }
    get btnTechTabLuyenThe() { return this.parentScreen.btnTechTabLuyenThe; }
    get btnTechTabThanThuc() { return this.parentScreen.btnTechTabThanThuc; }
    get btnTechTabPhuTro() { return this.parentScreen.btnTechTabPhuTro; }
    get btnTechTabSecret() { return this.parentScreen.btnTechTabSecret; }
    get elTechListView() { return this.parentScreen.elTechListView; }
    get elTechDetailView() { return this.parentScreen.elTechDetailView; }
    get elTechDetailContent() { return this.parentScreen.elTechDetailContent; }
    get elTechPoints() { return this.parentScreen.elTechPoints; }

    renderTechniques(tab = 'linh_luc') {
        if (!state.player) return;

        state.activeTechTab = tab;

        // Update tab styles
        const allTabBtns = [this.btnTechTabLinhLuc, this.btnTechTabLuyenThe, this.btnTechTabThanThuc, this.btnTechTabPhuTro, this.btnTechTabSecret].filter(Boolean);
        if (allTabBtns.length) {
            const defaultClass = 'whitespace-nowrap px-4 py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            allTabBtns.forEach(btn => btn.className = defaultClass);

            const activeMap = {
                'linh_luc':  { btn: this.btnTechTabLinhLuc,  cls: 'bg-qi-blue/20 text-qi-blue border border-qi-blue/30' },
                'luyen_the': { btn: this.btnTechTabLuyenThe, cls: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
                'than_thuc': { btn: this.btnTechTabThanThuc, cls: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
                'phu_tro':   { btn: this.btnTechTabPhuTro,  cls: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
                'secret':    { btn: this.btnTechTabSecret,  cls: 'bg-qi-purple/20 text-qi-purple border border-qi-purple/30' },
            };
            const active = activeMap[tab];
            if (active && active.btn) {
                active.btn.className = `whitespace-nowrap px-4 py-2 ${active.cls} rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all`;
            }
        }

        if (this.elTechListView) {
            this.elTechListView.innerHTML = '';
            this.elTechListView.classList.remove('hidden');
            if (this.elTechDetailView) this.elTechDetailView.classList.add('hidden');

            if (tab === 'phu_tro') {
                this._renderPhuTroTab();
                if (this.elTechPoints) this.elTechPoints.textContent = state.player.techniquePoints || 0;
                return;
            }



            const isSecretTab = tab === 'secret';
            const compList = (state.player.comprehendingTechniques || []).filter(c => c.isSecret === isSecretTab);
            let list = isSecretTab ? state.player.learnedSecretTechniques : state.player.learnedTechniques;

            // Filter standard techniques by category
            if (!isSecretTab) {
                list = list.filter(entry => {
                    const data = getTechniqueById(entry.id) || (state.player.customTechniques || []).find(t => t.id === entry.id);
                    if (!data) return false;
                    if (tab === 'linh_luc') return data.type === 'Linh Lực';
                    if (tab === 'luyen_the') return data.type === 'Luyện Thể';
                    if (tab === 'than_thuc') return data.type === 'Thần Thức';
                    return false;
                });
            }
            
            // 1. Render active/waiting comprehension progress bars
            if (compList.length > 0) {
                const header = document.createElement('div');
                header.className = 'mb-4 border-b border-white/5 pb-2 mt-2';
                header.innerHTML = `
                    <div class="flex justify-between items-center">
                        <h3 class="text-[10px] font-ancient text-cultivation-gold uppercase tracking-[0.2em] flex items-center">
                            <i class="ph ph-brain mr-1.5 animate-pulse text-xs"></i>
                            Đang Tham Ngộ Bí Tịch
                        </h3>
                        <span class="text-[8px] bg-cultivation-gold/10 text-cultivation-gold px-1.5 py-0.5 rounded border border-cultivation-gold/20 font-bold uppercase">${compList.length} Đang Đọc</span>
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
                    const barColorClass = isSecretTab ? 'bg-qi-purple' : 'bg-qi-blue';
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
                                <div class="text-2xl">${techData.icon || (isSecretTab ? '✨' : '📜')}</div>
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

            // 2. Render learned techniques list below
            if (list.length === 0) {
                if (compList.length === 0) {
                    let typeName = 'công pháp';
                    if (tab === 'linh_luc') typeName = 'công pháp linh lực';
                    else if (tab === 'luyen_the') typeName = 'công pháp luyện thể';
                    else if (tab === 'than_thuc') typeName = 'thần thức chi pháp';
                    else if (tab === 'secret') typeName = 'bí pháp';
                    this.elTechListView.innerHTML = `<div class="text-center py-20 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ ${typeName} nào...</div>`;
                }
            } else {
                if (isSecretTab) {
                    // Group the list by category
                    const groups = {
                        'Pháp Thuật': [],
                        'Bí Thuật': [],
                        'Thần Thông': []
                    };
                    list.forEach(entry => {
                        const data = getSecretTechniqueById(entry.id);
                        if (data) {
                            const cat = data.category || 'Bí Thuật';
                            if (!groups[cat]) groups[cat] = [];
                            groups[cat].push({ entry, data });
                        }
                    });

                    // Add a nice header
                    if (compList.length > 0) {
                        const separator = document.createElement('div');
                        separator.className = 'mb-4 border-b border-white/5 pb-2 mt-6';
                        separator.innerHTML = `
                            <h3 class="text-[10px] font-ancient text-gray-500 uppercase tracking-[0.2em] flex items-center">
                                <i class="ph ph-scroll mr-1.5 text-xs"></i>
                                Bí Pháp Đã Lĩnh Ngộ
                            </h3>
                        `;
                        this.elTechListView.appendChild(separator);
                    }

                    // Render each group
                    const categories = ['Pháp Thuật', 'Bí Thuật', 'Thần Thông'];
                    const groupStyles = {
                        'Pháp Thuật': {
                            title: 'Spells • Pháp Thuật',
                            color: 'text-teal-400',
                            bg: 'bg-teal-500/5 border-teal-500/10 hover:bg-teal-500/10 hover:border-teal-500/30',
                            badge: 'bg-teal-500/15 text-teal-300 border-teal-500/30 shadow-[0_0_8px_rgba(20,184,166,0.2)]'
                        },
                        'Bí Thuật': {
                            title: 'Secrets • Bí Thuật',
                            color: 'text-red-400',
                            bg: 'bg-red-500/5 border-red-500/10 hover:bg-red-500/10 hover:border-red-500/30',
                            badge: 'bg-red-500/15 text-red-400 border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                        },
                        'Thần Thông': {
                            title: 'Divine Abilities • Thần Thông',
                            color: 'text-yellow-400 font-ancient tracking-wider',
                            bg: 'bg-yellow-500/5 border-yellow-500/10 hover:bg-yellow-500/10 hover:border-yellow-500/30 shadow-[inset_0_0_12px_rgba(234,179,8,0.05)]',
                            badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30 shadow-[0_0_12px_rgba(234,179,8,0.3)] animate-pulse'
                        }
                    };

                    categories.forEach(cat => {
                        const items = groups[cat] || [];
                        if (items.length === 0) return;

                        const catHeader = document.createElement('div');
                        catHeader.className = 'mt-5 mb-3 flex items-center justify-between';
                        catHeader.innerHTML = `
                            <h4 class="text-[10px] font-ancient uppercase tracking-[0.25em] ${groupStyles[cat].color} flex items-center">
                                <span class="inline-block w-1.5 h-1.5 rounded-full bg-current mr-2"></span>
                                ${groupStyles[cat].title} (${items.length})
                            </h4>
                        `;
                        this.elTechListView.appendChild(catHeader);

                        items.forEach(({ entry, data }) => {
                            const mastery = MASTERY_LEVELS.find(m => m.id === (entry.masteryLevel || 1));
                            const stageLabel = data.stageLabel || 'Tầng';
                            const stageName = (data.stageNames && data.stageNames[entry.stage - 1]) ? data.stageNames[entry.stage - 1] : `${stageLabel} ${entry.stage || 1}`;

                            const el = document.createElement('div');
                            el.className = `p-4 border ${groupStyles[cat].bg} rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-300 hover:-translate-y-0.5 mb-3`;
                            
                            // Realm requirement check lock indicator
                            let realmLockedText = '';
                            if (cat === 'Thần Thông' && data.requiredRealmId && state.player.realmId < data.requiredRealmId) {
                                realmLockedText = `<span class="text-[7px] ml-1.5 px-1 py-0.5 bg-red-500/20 border border-red-500/40 rounded text-red-300 font-bold uppercase">Yêu cầu Trúc Cơ Kỳ</span>`;
                            }

                            el.innerHTML = `
                                <div class="flex items-center space-x-4">
                                    <div class="text-2xl">${data.icon || '✨'}</div>
                                    <div>
                                        <h4 class="text-sm font-bold text-white flex items-center">${data.name} ${realmLockedText}</h4>
                                        <div class="flex items-center space-x-2 mt-1">
                                            <span class="text-[8px] px-1.5 py-0.5 bg-black/40 rounded border border-white/5 text-gray-400 font-mono">${stageName}</span>
                                            <span class="text-[8px] text-cultivation-gold font-bold">${mastery?.name || 'Nhập Môn'}</span>
                                            <span class="text-[7px] px-1.5 py-0.5 rounded border ${groupStyles[cat].badge} font-bold uppercase tracking-wider">${cat}</span>
                                        </div>
                                    </div>
                                </div>
                                <i class="ph ph-caret-right text-gray-600"></i>
                            `;
                            el.onclick = () => this.renderTechniqueDetail(entry.id, true);
                            this.elTechListView.appendChild(el);
                        });
                    });
                } else {
                    if (compList.length > 0) {
                        const separator = document.createElement('div');
                        separator.className = 'mb-4 border-b border-white/5 pb-2 mt-6';
                        separator.innerHTML = `
                            <h3 class="text-[10px] font-ancient text-gray-500 uppercase tracking-[0.2em] flex items-center">
                                <i class="ph ph-scroll mr-1.5 text-xs"></i>
                                Công Pháp Đã Lĩnh Ngộ
                            </h3>
                        `;
                        this.elTechListView.appendChild(separator);
                    }

                    list.forEach(entry => {
                        const data = getTechniqueById(entry.id) || (state.player.customTechniques || []).find(t => t.id === entry.id);
                        if (!data) return;

                        const mastery = MASTERY_LEVELS.find(m => m.id === (entry.masteryLevel || 1));
                        const stageLabel = data.stageLabel || 'Tầng';
                        const stageName = (data.stageNames && data.stageNames[entry.stage - 1]) ? data.stageNames[entry.stage - 1] : `${stageLabel} ${entry.stage || 1}`;

                        let borderColor = 'border-qi-blue/10 bg-qi-blue/5';
                        if (tab === 'luyen_the') borderColor = 'border-orange-500/10 bg-orange-500/5';
                        else if (tab === 'than_thuc') borderColor = 'border-cyan-500/10 bg-cyan-500/5';

                        const el = document.createElement('div');
                        el.className = `p-4 border ${borderColor} rounded-2xl flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all mb-3`;
                        el.innerHTML = `
                            <div class="flex items-center space-x-4">
                                <div class="text-2xl">${data.icon || '📜'}</div>
                                <div>
                                    <h4 class="text-sm font-bold text-white">${data.name}</h4>
                                    <div class="flex items-center space-x-2 mt-1">
                                        <span class="text-[8px] px-1.5 py-0.5 bg-black/40 rounded border border-white/5 text-gray-400 font-mono">${stageName}</span>
                                        <span class="text-[8px] text-cultivation-gold font-bold">${mastery?.name || 'Nhập Môn'}</span>
                                    </div>
                                </div>
                            </div>
                            <i class="ph ph-caret-right text-gray-600"></i>
                        `;
                        el.onclick = () => this.renderTechniqueDetail(entry.id, false);
                        this.elTechListView.appendChild(el);
                    });
                }
            }
        }

        if (this.elTechPoints) this.elTechPoints.textContent = state.player.techniquePoints || 0;
    }

    renderTechniqueDetail(id, isSecret) {
        if (!this.elTechDetailContent) return;

        const entry = isSecret ? state.player.learnedSecretTechniques.find(s => s.id === id) : state.player.learnedTechniques.find(t => t.id === id);
        const data = isSecret 
            ? getSecretTechniqueById(id) 
            : (getTechniqueById(id) || (state.player.customTechniques || []).find(t => t.id === id));
        if (!entry || !data) return;

        if (this.elTechListView) this.elTechListView.classList.add('hidden');
        if (this.elTechDetailView) this.elTechDetailView.classList.remove('hidden');

        const currentMasteryIdx = MASTERY_LEVELS.findIndex(m => m.id === (entry.masteryLevel || 1));
        const mastery = MASTERY_LEVELS[currentMasteryIdx];
        const nextMastery = MASTERY_LEVELS[currentMasteryIdx + 1];

        const stageLabel = data.stageLabel || 'Tầng';
        const stageName = (data.stageNames && data.stageNames[entry.stage - 1]) ? data.stageNames[entry.stage - 1] : `${stageLabel} ${entry.stage || 1}`;

        const canBreakthrough = entry.masteryLevel >= 4 && (entry.stage < (data.maxStage || 10));

        let isMain = false;
        let equipLabel = 'THIẾT LẬP CHỦ TU';
        let equippedLabel = 'ĐANG CHỦ TU';
        let unequipBtnHTML = '';

        if (!isSecret) {
            if (data.type === 'Linh Lực') { isMain = state.player.mainTechniqueId === id; }
            else if (data.type === 'Luyện Thể') { isMain = state.player.mainBodyTechniqueId === id; }
            else if (data.type === 'Thần Thức') { isMain = state.player.mainSoulTechniqueId === id; }
            else if (data.type === 'Độn Thuật') {
                isMain = state.player.mainEscapeId === id;
                equipLabel = 'TRANG BỊ ĐỘN THUẬT';
                equippedLabel = '⚡ ĐANG TRANG BỊ';
                if (isMain) {
                    unequipBtnHTML = `<button class="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold rounded-2xl mt-2 active:scale-95 transition-all" onclick="window.game.player.unequipTechnique('Độn Thuật'); window.game.ui.renderTechniques('phu_tro');">🗑️ THÁO GỠ ĐỘN THUẬT</button>`;
                }
            }
            else if (data.type === 'Song Tu') {
                isMain = state.player.mainDualId === id;
                equipLabel = 'TRANG BỊ SONG TU';
                equippedLabel = '☯️ ĐANG SONG TU';
                if (isMain) {
                    unequipBtnHTML = `<button class="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold rounded-2xl mt-2 active:scale-95 transition-all" onclick="window.game.player.unequipTechnique('Song Tu'); window.game.ui.renderTechniques('phu_tro');">🗑️ THÁO GỠ SONG TU</button>`;
                }
            }
            else if (data.type === 'Phụ Trợ') {
                isMain = (state.player.equippedAuxiliaryIds || []).includes(id);
                equipLabel = 'TRANG BỊ PHỤ TRỢ';
                equippedLabel = '🌀 ĐANG PHỤ TU';
                if (isMain) {
                    unequipBtnHTML = `<button class="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold rounded-2xl mt-2 active:scale-95 transition-all" onclick="window.game.player.unequipTechnique('Phụ Trợ', '${id}'); window.game.ui.renderTechniques('phu_tro');">🗑️ THÁO GỠ PHỤ TRỢ</button>`;
                }
            }
        }

        let equipBtnHTML = '';
        if (!isSecret) {
            if (isMain) {
                equipBtnHTML = `
                    <button class="w-full py-4 bg-cultivation-gold/15 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-2xl cursor-default opacity-80" disabled>
                        <i class="ph ph-check-circle mr-1"></i> ${equippedLabel}
                    </button>
                    ${unequipBtnHTML}
                `;
            } else {
                equipBtnHTML = `
                    <button class="w-full py-4 bg-cultivation-gold text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" onclick="window.game.setMainTechnique('${id}')">
                        <i class="ph ph-shield-star mr-1"></i> ${equipLabel}
                    </button>
                `;
            }
        }

        this.elTechDetailContent.innerHTML = `
            <div class="flex flex-col items-center text-center space-y-4">
                <div class="text-6xl p-6 bg-white/5 rounded-full border border-white/10">${data.icon || '📜'}</div>
                <div>
                    <h3 class="text-2xl font-ancient text-white">${data.name}</h3>
                    <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">${data.quality || 'Phàm Khí'}${((data.quality || 'Phàm Khí').toLowerCase().includes('khí') || (data.quality || 'Phàm Khí').toLowerCase().includes('bảo') || (data.quality || 'Phàm Khí').toLowerCase().includes('phẩm') || (data.quality || 'Phàm Khí').toLowerCase().includes('giai') || (data.quality || 'Phàm Khí').toLowerCase().includes('hỏa') || (data.quality || 'Phàm Khí').toLowerCase().includes('lôi') || ['Hoàn Mỹ', 'Tiên Khí', 'Linh Bảo', 'Danh Khí'].includes(data.quality || 'Phàm Khí')) ? '' : ' Phẩm'} | ${stageName}</p>
                </div>
            </div>

            <div class="bg-black/40 p-5 rounded-3xl border border-white/5 space-y-4">
                <div class="flex justify-between items-end mb-1">
                    <span class="text-[9px] text-gray-500 uppercase tracking-widest">Độ Thuần Thục: ${mastery?.name || 'Nhập Môn'}</span>
                    <span class="text-[10px] font-mono text-white">${entry.mastery} / ${nextMastery?.threshold || 'MAX'}</span>
                </div>
                <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-cultivation-gold" style="width: ${entry.masteryLevel >= 4 ? 100 : (entry.mastery / (nextMastery?.threshold || 1)) * 100}%"></div>
                </div>
                
                <div class="grid grid-cols-2 gap-3 mt-6">
                    <button class="py-4 bg-qi-blue text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" onclick="window.game.cultivateTechnique('${id}', ${isSecret})">TU LUYỆN</button>
                    <button class="py-4 ${canBreakthrough ? 'bg-cultivation-gold' : 'bg-gray-800 opacity-50'} text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" 
                        onclick="window.game.breakthroughTechnique('${id}', ${isSecret})">ĐỘT PHÁ TẦNG</button>
                </div>
                ${equipBtnHTML ? `<div class="mt-3">${equipBtnHTML}</div>` : ''}
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
            auxSlots += _slotCard(`Khe Phụ Tu ${i + 1}`, 'border-emerald-500/20 bg-emerald-500/[0.03]', '🌀', auxTech, auxLearned, 'Chưa trang bị', 'Phụ Trợ', auxId);
        }

        // Escape slot
        const escapeTech = _getTech(p.mainEscapeId);
        const escapeLearned = _getLearned(p.mainEscapeId);
        const escapeSlot = _slotCard('⚡ Độn Thuật', 'border-yellow-500/20 bg-yellow-500/[0.03] shadow-[0_0_15px_rgba(234,179,8,0.03)]', '⚡', escapeTech, escapeLearned, 'Chưa trang bị', 'Độn Thuật');

        // Dual cultivation slot
        const dualTech = _getTech(p.mainDualId);
        const dualLearned = _getLearned(p.mainDualId);
        const dualSlot = _slotCard('☯️ Song Tu', 'border-pink-500/20 bg-pink-500/[0.03] shadow-[0_0_15px_rgba(236,72,153,0.03)]', '☯️', dualTech, dualLearned, 'Chưa trang bị', 'Song Tu');

        // Learned but unequipped techniques of these types
        const learnableTabs = ['Độn Thuật', 'Song Tu', 'Phụ Trợ'];
        const unequipped = p.learnedTechniques.filter(t => {
            const d = getTechniqueById(t.id);
            if (!d || !learnableTabs.includes(d.type)) return false;
            if (d.type === 'Độn Thuật') return p.mainEscapeId !== t.id;
            if (d.type === 'Song Tu') return p.mainDualId !== t.id;
            if (d.type === 'Phụ Trợ') return !(p.equippedAuxiliaryIds || []).includes(t.id);
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
                            const catColor = {
                                'Độn Thuật': 'text-yellow-300 border-yellow-500/20 bg-yellow-500/5',
                                'Song Tu': 'text-pink-300 border-pink-500/20 bg-pink-500/5',
                                'Phụ Trợ': 'text-emerald-300 border-emerald-500/20 bg-emerald-500/5'
                            }[d.type] || 'text-gray-400 border-white/5';
                            return `
                                <div class="p-3 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/5 hover:border-white/10 cursor-pointer transition-all duration-300"
                                    onclick="window.game.ui.renderTechniqueDetail('${t.id}', false)">
                                    <div class="flex items-center space-x-3">
                                        <span class="text-xl">${d.icon || '📜'}</span>
                                        <div>
                                            <p class="text-xs font-bold text-white">${d.name}</p>
                                            <span class="text-[7px] px-1.5 py-0.5 rounded border ${catColor} font-bold uppercase tracking-wider">${d.type}</span>
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
