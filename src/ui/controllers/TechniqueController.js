import { state } from '../../state.js';
import { getTechniqueById, getSecretTechniqueById, MASTERY_LEVELS } from '../../configs/technique-data.js';

export class TechniqueController {
    constructor(parentScreen) {
        this.parentScreen = parentScreen;
    }

    get btnTechTabLinhLuc() { return this.parentScreen.btnTechTabLinhLuc; }
    get btnTechTabLuyenThe() { return this.parentScreen.btnTechTabLuyenThe; }
    get btnTechTabThanThuc() { return this.parentScreen.btnTechTabThanThuc; }
    get btnTechTabSecret() { return this.parentScreen.btnTechTabSecret; }
    get btnTechTabCustom() { return this.parentScreen.btnTechTabCustom; }
    get elTechListView() { return this.parentScreen.elTechListView; }
    get elTechDetailView() { return this.parentScreen.elTechDetailView; }
    get elTechDetailContent() { return this.parentScreen.elTechDetailContent; }
    get elTechPoints() { return this.parentScreen.elTechPoints; }

    renderTechniques(tab = 'linh_luc') {
        if (!state.player) return;

        state.activeTechTab = tab;

        // Update tab styles
        if (this.btnTechTabLinhLuc && this.btnTechTabLuyenThe && this.btnTechTabThanThuc && this.btnTechTabSecret && this.btnTechTabCustom) {
            const defaultClass = 'whitespace-nowrap px-4 py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            
            this.btnTechTabLinhLuc.className = defaultClass;
            this.btnTechTabLuyenThe.className = defaultClass;
            this.btnTechTabThanThuc.className = defaultClass;
            this.btnTechTabSecret.className = defaultClass;
            this.btnTechTabCustom.className = defaultClass;
            
            if (tab === 'linh_luc') {
                this.btnTechTabLinhLuc.className = 'whitespace-nowrap px-4 py-2 bg-qi-blue/20 text-qi-blue border border-qi-blue/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            } else if (tab === 'luyen_the') {
                this.btnTechTabLuyenThe.className = 'whitespace-nowrap px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            } else if (tab === 'than_thuc') {
                this.btnTechTabThanThuc.className = 'whitespace-nowrap px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            } else if (tab === 'secret') {
                this.btnTechTabSecret.className = 'whitespace-nowrap px-4 py-2 bg-qi-purple/20 text-qi-purple border border-qi-purple/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            } else if (tab === 'custom') {
                this.btnTechTabCustom.className = 'whitespace-nowrap px-4 py-2 bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            }
        }

        if (this.elTechListView) {
            this.elTechListView.innerHTML = '';
            this.elTechListView.classList.remove('hidden');
            if (this.elTechDetailView) this.elTechDetailView.classList.add('hidden');

            if (tab === 'custom') {
                this.elTechListView.innerHTML = `
                    <div class="bg-black/40 p-5 rounded-3xl border border-white/5 space-y-6">
                        <div>
                            <h3 class="font-ancient text-cultivation-gold text-lg">Khai Tông Sáng Lập</h3>
                            <p class="text-[9px] text-gray-500 mt-1 uppercase tracking-widest">Tự Sáng Tạo Công Pháp Chí Cao</p>
                        </div>

                        <!-- Cost Alert -->
                        <div class="bg-white/[0.02] p-4 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                            <div class="space-y-1 w-full">
                                <div class="text-[9px] text-gray-500 uppercase tracking-wider mb-2">Tiêu hao sáng lập:</div>
                                <div class="flex justify-between items-center">
                                    <span class="font-mono ${state.player.tuVi >= 50000 ? 'text-qi-jade' : 'text-red-500'}">50,000 Tu Vi (${Math.floor(state.player.tuVi).toLocaleString()})</span>
                                    <span class="font-mono ${state.player.techniquePoints >= 100 ? 'text-qi-jade' : 'text-red-500'}">100 Điểm Công Pháp (${state.player.techniquePoints})</span>
                                </div>
                            </div>
                        </div>

                        <!-- Name Input -->
                        <div class="space-y-2">
                            <label class="text-[9px] text-gray-500 uppercase tracking-widest">Tên Công Pháp</label>
                            <input id="custom-tech-name" type="text" placeholder="Ví dụ: Cửu Thiên Đạo Quyết" 
                                class="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cultivation-gold transition-colors">
                        </div>

                        <!-- Element Select -->
                        <div class="space-y-2">
                            <label class="text-[9px] text-gray-500 uppercase tracking-widest">Thuộc Tính Ngũ Hành</label>
                            <select id="custom-tech-element" 
                                class="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cultivation-gold transition-colors">
                                <option value="Neutral">Hỗn Độn (Vô thuộc tính)</option>
                                <option value="Kim">Kim (Canh Kim Kiếm Khí)</option>
                                <option value="Mộc">Mộc (Trường Xuân Trường Sinh)</option>
                                <option value="Thủy">Thủy (Huyền Âm Chân Thủy)</option>
                                <option value="Hỏa">Hỏa (Tam Muội Chân Hỏa)</option>
                                <option value="Thổ">Thổ (Hậu Thổ Minh Vương)</option>
                                <option value="Phong">Phong (Cực Tốc Thần Phong)</option>
                                <option value="Lôi">Lôi (Ngũ Lôi Oanh Đỉnh)</option>
                                <option value="Băng">Băng (Cực Hàn Băng Sương)</option>
                                <option value="Âm">Âm (U Minh Ma Đạo)</option>
                                <option value="Dương">Dương (Thuần Dương Đạo Pháp)</option>
                            </select>
                        </div>

                        <!-- Stat Boost -->
                        <div class="space-y-2">
                            <label class="text-[9px] text-gray-500 uppercase tracking-widest">Thiên Hướng Cộng Thuộc Tính</label>
                            <select id="custom-tech-stat" 
                                class="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cultivation-gold transition-colors">
                                <option value="atk">Tăng Cường Công Kích (+180 Công Kích)</option>
                                <option value="hp">Hồi Linh Khí Huyết (+600 Sinh Mệnh)</option>
                                <option value="spd">Phi Thăng Tốc Độ (+15 Thân Pháp)</option>
                            </select>
                        </div>

                        <!-- Special Effect -->
                        <div class="space-y-2">
                            <label class="text-[9px] text-gray-500 uppercase tracking-widest">Hiệu Ứng Bẩm Sinh</label>
                            <select id="custom-tech-effect" 
                                class="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cultivation-gold transition-colors">
                                <option value="swordDmg">Kiếm Ý Thông Thiên (+15% Sát thương Kiếm)</option>
                                <option value="tvps">Linh Lực Tinh Thuần (+3.0 Tu Vi/s)</option>
                                <option value="lifeSteal">Huyết Ma Nghịch Thiên (+12% Hút Máu)</option>
                            </select>
                        </div>

                        <!-- Submit Button -->
                        <button id="custom-tech-submit"
                            class="w-full py-4 bg-cultivation-gold text-black text-xs font-bold rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all">
                            ⚡ KHAI TÔNG LẬP PHÁP
                        </button>
                    </div>
                `;

                // Wire Submit
                const btnSubmit = document.getElementById('custom-tech-submit');
                if (btnSubmit) {
                    btnSubmit.onclick = () => {
                        const name = document.getElementById('custom-tech-name').value;
                        const element = document.getElementById('custom-tech-element').value;
                        const statVal = document.getElementById('custom-tech-stat').value;
                        const effectVal = document.getElementById('custom-tech-effect').value;

                        if (!name || name.trim() === '') {
                            state.ui.toast("Tên công pháp không được để trống!", "error");
                            return;
                        }

                        // Map choice into stats/effects payload
                        const chosenStats = {};
                        if (statVal === 'atk') chosenStats.atk = 180;
                        else if (statVal === 'hp') chosenStats.hp = 600;
                        else if (statVal === 'spd') chosenStats.spd = 15;

                        const chosenEffects = {};
                        if (effectVal === 'swordDmg') chosenEffects.swordDmg = 1.15;
                        else if (effectVal === 'tvps') chosenEffects.tvps = 3.0;
                        else if (effectVal === 'lifeSteal') chosenEffects.lifeSteal = 0.12;

                        window.game.createCustomTechnique(name, element, chosenStats, chosenEffects);
                    };
                }
                
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
                    const data = !isSecretTab
                        ? (getTechniqueById(entry.id) || (state.player.customTechniques || []).find(t => t.id === entry.id))
                        : getSecretTechniqueById(entry.id);
                    if (!data) return;

                    const mastery = MASTERY_LEVELS.find(m => m.id === (entry.masteryLevel || 1));
                    const stageLabel = data.stageLabel || 'Tầng';
                    const stageName = (data.stageNames && data.stageNames[entry.stage - 1]) ? data.stageNames[entry.stage - 1] : `${stageLabel} ${entry.stage || 1}`;

                    let borderColor = 'border-qi-blue/10 bg-qi-blue/5';
                    if (tab === 'luyen_the') borderColor = 'border-orange-500/10 bg-orange-500/5';
                    else if (tab === 'than_thuc') borderColor = 'border-cyan-500/10 bg-cyan-500/5';
                    else if (tab === 'secret') borderColor = 'border-qi-purple/10 bg-qi-purple/5';

                    const el = document.createElement('div');
                    el.className = `p-4 border ${borderColor} rounded-2xl flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all mb-3`;
                    el.innerHTML = `
                        <div class="flex items-center space-x-4">
                            <div class="text-2xl">${data.icon || (isSecretTab ? '✨' : '📜')}</div>
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
                    el.onclick = () => this.renderTechniqueDetail(entry.id, tab === 'secret');
                    this.elTechListView.appendChild(el);
                });
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
        if (!isSecret) {
            if (data.type === 'Linh Lực') isMain = state.player.mainTechniqueId === id;
            else if (data.type === 'Luyện Thể') isMain = state.player.mainBodyTechniqueId === id;
            else if (data.type === 'Thần Thức') isMain = state.player.mainSoulTechniqueId === id;
        }

        let equipBtnHTML = '';
        if (!isSecret) {
            if (isMain) {
                equipBtnHTML = `
                    <button class="w-full py-4 bg-cultivation-gold/15 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-2xl cursor-default opacity-80" disabled>
                        <i class="ph ph-check-circle mr-1"></i> ĐANG CHỦ TU
                    </button>
                `;
            } else {
                equipBtnHTML = `
                    <button class="w-full py-4 bg-cultivation-gold text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" onclick="window.game.setMainTechnique('${id}')">
                        <i class="ph ph-shield-star mr-1"></i> THIẾT LẬP CHỦ TU
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
}
