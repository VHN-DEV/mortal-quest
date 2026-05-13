import { MORALITY_SCALES, TITLES, REPUTATION_TIERS } from '../../configs/fate-data.js';

export class FateScreen {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        this.container = document.getElementById('fate-screen-content');
    }

    render() {
        if (!this.container) return;

        const fate = this.player.fate;
        const moralityScale = window.game.systems.fate.getMoralityScale();
        const reputationTier = window.game.systems.fate.getReputationTier();
        const debt = window.game.systems.fate.getKarmaDebt();

        this.container.innerHTML = `
            <div class="space-y-6 animate-fade-in">
                <!-- Reputation & Morality Overview -->
                <div class="grid grid-cols-2 gap-4">
                    <!-- Morality Card -->
                    <div class="bg-cultivation-dark/50 border border-white/10 rounded-2xl p-4 relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                        <div class="relative z-10">
                            <span class="text-[10px] text-white/40 uppercase tracking-widest font-bold">Đạo Tâm Thiện Ác</span>
                            <div class="flex items-center space-x-2 mt-1">
                                <h3 class="text-xl font-ancient font-bold" style="color: ${moralityScale.color}">${moralityScale.name}</h3>
                                <span class="text-xs text-white/60">(${fate.morality})</span>
                            </div>
                            <p class="text-[10px] text-white/50 mt-2 italic">${moralityScale.description}</p>
                            
                            <!-- Morality Meter -->
                            <div class="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                                <div class="absolute inset-y-0 left-1/2 w-0.5 bg-white/20 z-10"></div>
                                <div class="h-full transition-all duration-1000" 
                                     style="width: ${Math.abs(fate.morality) / 10}%; 
                                            background-color: ${moralityScale.color};
                                            margin-left: ${fate.morality >= 0 ? '50%' : `${50 - Math.abs(fate.morality) / 10}%`}">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Reputation Card -->
                    <div class="bg-cultivation-dark/50 border border-white/10 rounded-2xl p-4 relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cultivation-gold/5 to-transparent rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                        <div class="relative z-10">
                            <span class="text-[10px] text-white/40 uppercase tracking-widest font-bold">Danh Vọng Thiên Hạ</span>
                            <div class="flex items-center space-x-2 mt-1">
                                <h3 class="text-xl font-ancient font-bold text-cultivation-gold">${reputationTier.name}</h3>
                                <span class="text-xs text-white/60">(${fate.reputation.toLocaleString()})</span>
                            </div>
                            <div class="flex items-center space-x-2 mt-2">
                                <i class="ph ph-trend-up text-qi-jade text-xs"></i>
                                <span class="text-[10px] text-white/60 italic">Ưu đãi giao dịch: -${Math.round((1 - reputationTier.bonus.trading) * 100)}%</span>
                            </div>

                            <!-- Reputation Progress -->
                            <div class="mt-4 space-y-1">
                                <div class="flex justify-between text-[8px] text-white/30 uppercase font-bold tracking-tighter">
                                    <span>${reputationTier.name}</span>
                                    <span>Tiến độ: ${Math.round((fate.reputation / (reputationTier.max || fate.reputation)) * 100)}%</span>
                                </div>
                                <div class="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div class="h-full bg-cultivation-gold transition-all duration-1000" 
                                         style="width: ${(fate.reputation / (reputationTier.max || fate.reputation)) * 100}%">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Karma Section -->
                <div class="bg-cultivation-dark/50 border border-white/10 rounded-2xl p-5">
                    <h4 class="text-xs font-ancient font-bold text-white/80 border-b border-white/5 pb-2 mb-4 flex items-center">
                        <i class="ph ph-infinite-light mr-2 text-qi-purple"></i> Nhân Quả Luân Hồi
                    </h4>
                    
                    <div class="grid grid-cols-2 gap-8 items-center">
                        <div class="space-y-4">
                            <div class="flex justify-between items-end">
                                <div>
                                    <span class="text-[10px] text-qi-jade/60 uppercase font-bold tracking-widest block mb-1">Công Đức</span>
                                    <span class="text-2xl font-ancient text-qi-jade font-bold">${fate.merit.toLocaleString()}</span>
                                </div>
                                <div class="text-right">
                                    <span class="text-[10px] text-red-400/60 uppercase font-bold tracking-widest block mb-1">Nghiệp Lực</span>
                                    <span class="text-2xl font-ancient text-red-500 font-bold">${fate.sin.toLocaleString()}</span>
                                </div>
                            </div>

                            <div class="relative h-2 bg-white/5 rounded-full overflow-hidden flex">
                                <div class="h-full bg-qi-jade transition-all duration-1000" style="width: ${(fate.merit / (fate.merit + fate.sin + 1)) * 100}%"></div>
                                <div class="h-full bg-red-500 transition-all duration-1000" style="width: ${(fate.sin / (fate.merit + fate.sin + 1)) * 100}%"></div>
                            </div>

                            <p class="text-[10px] text-white/40 italic leading-relaxed">
                                ${debt > 0 ? 
                                    `<span class="text-red-400 font-bold">Cảnh báo:</span> Nghiệp lực quấn thân sẽ khiến Thiên Kiếp trở nên cuồng bạo hơn, tỉ lệ đột phá giảm <span class="text-red-400">${Math.round((1 - window.game.systems.fate.getBreakthroughPenalty()) * 100)}%</span>.` : 
                                    `<span class="text-qi-jade font-bold">Thanh thản:</span> Ngươi không có nghiệp lực, tâm ma khó xâm, đột phá thuận lợi.`
                                }
                            </p>
                        </div>

                        <div class="bg-white/5 rounded-xl p-3 border border-white/5">
                            <span class="text-[9px] text-white/30 uppercase font-bold block mb-2 tracking-widest">Duyên Phận Nhân Quả</span>
                            <div class="space-y-2 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                                ${fate.karmaLinks.length > 0 ? fate.karmaLinks.map(link => `
                                    <div class="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
                                        <span class="text-[10px] text-white/80">${link.description}</span>
                                        <span class="text-[8px] px-1.5 py-0.5 rounded bg-white/10 text-white/40 uppercase">${link.type}</span>
                                    </div>
                                `).join('') : `
                                    <div class="text-[10px] text-white/20 italic text-center py-4">Chưa kết nhân quả với ai...</div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Titles Section -->
                <div class="bg-cultivation-dark/50 border border-white/10 rounded-2xl p-5">
                    <h4 class="text-xs font-ancient font-bold text-white/80 border-b border-white/5 pb-2 mb-4 flex items-center">
                        <i class="ph ph-crown-simple-light mr-2 text-cultivation-gold"></i> Danh Hiệu Đã Đạt
                    </h4>

                    <div class="grid grid-cols-2 gap-3">
                        ${TITLES.map(title => {
                            const isUnlocked = fate.titles.includes(title.id);
                            const isActive = fate.activeTitleId === title.id;
                            
                            return `
                                <div class="p-3 rounded-xl border ${isUnlocked ? (isActive ? 'border-cultivation-gold bg-cultivation-gold/10' : 'border-white/20 bg-white/5') : 'border-white/5 bg-white/2 opacity-40'} transition-all relative group cursor-pointer"
                                     onclick="${isUnlocked ? `window.game.screens.fate.toggleTitle('${title.id}')` : ''}">
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs font-bold ${isUnlocked ? 'text-white' : 'text-white/40'}">${title.name}</span>
                                        ${isActive ? '<i class="ph ph-seal-check-fill text-cultivation-gold"></i>' : ''}
                                    </div>
                                    <div class="mt-2 flex flex-wrap gap-1">
                                        ${Object.entries(title.bonus).map(([key, val]) => `
                                            <span class="text-[8px] px-1 bg-white/10 rounded text-white/50">${key}: ${val > 1 ? '+' + Math.round((val-1)*100) + '%' : val}</span>
                                        `).join('')}
                                    </div>
                                    ${!isUnlocked ? `
                                        <div class="mt-2 text-[8px] text-red-400/60 uppercase font-bold tracking-tighter">
                                            Yêu cầu: ${title.repMin ? `Rep ${title.repMin.toLocaleString()} ` : ''}${title.moralityMin ? `Thiện > ${title.moralityMin} ` : ''}${title.moralityMax ? `Ác < ${title.moralityMax} ` : ''}
                                        </div>
                                    ` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    toggleTitle(titleId) {
        if (this.player.fate.activeTitleId === titleId) {
            this.player.equipTitle(null);
            this.ui.toast("Đã tháo gỡ danh hiệu.", "info");
        } else {
            this.player.equipTitle(titleId);
            const title = TITLES.find(t => t.id === titleId);
            this.ui.toast(`Đã đeo danh hiệu: [${title.name}]`, "success");
        }
        this.render();
    }
}
