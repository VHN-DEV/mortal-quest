import { state } from '../../state.js';
import { getRealmById } from '../../configs/realm-data.js';
import { NPC_PERSONALITIES, NPC_GOALS } from '../../configs/npc-data.js';
import { CREATION_ROOTS, CREATION_PHYSIQUES } from '../../configs/creation-data.js';

export class NPCScreen {
    constructor() {
        this.containerId = 'screen-npc';
        this.selectedNpcId = null;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const knownNpcs = state.systems.npc.npcs;

        container.innerHTML = `
            <div class="flex flex-col h-full bg-[#0a0a0a] text-gray-300 font-serif overflow-hidden">
                <!-- Header -->
                <div class="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-black to-white/5">
                    <div>
                        <h2 class="text-xl font-bold text-white tracking-widest uppercase">Nhân Thế Lục</h2>
                        <p class="text-[10px] text-gray-500 uppercase tracking-tighter mt-1">Danh sách các đạo hữu đã tương ngộ</p>
                    </div>
                    <div class="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold text-white uppercase">
                        ${knownNpcs.length} Vị Đạo Hữu
                    </div>
                </div>

                <div class="flex-1 flex overflow-hidden">
                    <!-- NPC List -->
                    <div class="w-1/3 border-r border-white/5 overflow-y-auto custom-scrollbar p-4 space-y-6">
                        <div>
                            <h4 class="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Đạo Hữu</h4>
                            <div class="space-y-3">
                                ${knownNpcs.length === 0 ? `
                                    <div class="text-center py-10 text-gray-600 italic text-[10px]">Chưa gặp đạo hữu nào...</div>
                                ` : knownNpcs.map(npc => this.renderNpcListItem(npc)).join('')}
                            </div>
                        </div>

                        ${state.systems.social.bonds.family.length > 0 ? `
                            <div>
                                <h4 class="text-[9px] font-bold text-qi-purple uppercase tracking-widest mb-4 px-2">Hậu Đại (Gia Tộc)</h4>
                                <div class="space-y-3">
                                    ${state.systems.social.bonds.family.map(child => `
                                        <div class="p-4 bg-qi-purple/5 border border-qi-purple/10 rounded-2xl">
                                            <div class="flex items-center space-x-3">
                                                <div class="w-10 h-10 rounded-xl bg-qi-purple/20 flex items-center justify-center text-qi-purple">
                                                    <i class="ph-baby text-xl"></i>
                                                </div>
                                                <div class="flex-1">
                                                    <div class="text-xs font-bold text-white">${child.name}</div>
                                                    <div class="text-[8px] text-qi-purple/60 uppercase">Tư chất: ${Math.floor(child.talent)} | 0 Tuổi</div>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <!-- NPC Detail -->
                    <div class="w-2/3 overflow-y-auto custom-scrollbar bg-black/40 relative">
                        ${this.selectedNpcId ? this.renderNpcDetail(knownNpcs.find(n => n.id === this.selectedNpcId)) : `
                            <div class="absolute inset-0 flex items-center justify-center text-gray-600 uppercase tracking-widest text-[10px] italic">
                                Hãy chọn một vị đạo hữu để xem chi tiết
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    renderNpcListItem(npc) {
        const isSelected = npc.id === this.selectedNpcId;
        const status = npc.getRelationshipStatus();
        const realm = getRealmById(npc.realmId);

        return `
            <div class="p-4 rounded-2xl border transition-all cursor-pointer ${isSelected ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}"
                 onclick="window.npcScreen.selectNpc('${npc.id}')">
                <div class="flex items-center space-x-3">
                    <img src="${npc.portrait}" class="w-10 h-10 rounded-xl object-cover border border-white/10" alt="${npc.name}">
                    <div class="flex-1 min-w-0">
                        <div class="text-xs font-bold text-white truncate">${npc.name}</div>
                        <div class="text-[9px] text-gray-500 truncate mt-0.5">${realm.name}</div>
                    </div>
                    <div class="text-[9px] font-bold px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white uppercase whitespace-nowrap">
                        ${status}
                    </div>
                </div>
            </div>
        `;
    }

    renderNpcDetail(npc) {
        if (!npc) return '';

        const realm = getRealmById(npc.realmId);
        const personality = npc.personalityIds.map(id => NPC_PERSONALITIES[id]?.name).join(', ');
        const goal = NPC_GOALS[npc.goalId]?.name || 'Unknown';
        const root = CREATION_ROOTS[npc.rootId]?.name || 'Unknown';
        const physique = CREATION_PHYSIQUES[npc.physiqueId]?.name || 'Phàm Thể';

        return `
            <div class="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <!-- Top Section -->
                <div class="flex items-start space-x-8">
                    <div class="relative">
                        <img src="${npc.portrait}" class="w-48 h-48 rounded-3xl object-cover border-2 border-white/10 shadow-2xl" alt="${npc.name}">
                        <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-black border border-white/20 rounded-2xl text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap shadow-xl">
                            ${npc.title}
                        </div>
                    </div>
                    <div class="flex-1 space-y-4 pt-2">
                        <div>
                            <h3 class="text-4xl font-bold text-white tracking-tight">${npc.name}</h3>
                            <div class="flex items-center space-x-3 mt-2">
                                <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    ${npc.gender} | ${npc.age} Tuổi
                                </span>
                                <span class="px-3 py-1 bg-qi-jade/20 border border-qi-jade/20 rounded-lg text-[10px] text-qi-jade font-bold uppercase tracking-widest">
                                    ${realm.name}
                                </span>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div class="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                <div class="text-[8px] text-gray-500 uppercase tracking-widest mb-1">Căn Cốt</div>
                                <div class="text-xs font-bold text-white">${root}</div>
                            </div>
                            <div class="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                <div class="text-[8px] text-gray-500 uppercase tracking-widest mb-1">Thể Chất</div>
                                <div class="text-xs font-bold text-white">${physique}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Relationship Status -->
                <div class="p-6 bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-3xl">
                    <div class="flex justify-between items-center mb-4">
                        <div class="text-xs font-bold text-white uppercase tracking-widest">Mối Quan Hệ: ${npc.getRelationshipStatus()}</div>
                        <div class="text-[10px] text-gray-500 font-mono">${npc.relationship} / 100</div>
                    </div>
                    <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-red-500 via-gray-400 to-green-500" style="width: 100%; opacity: 0.2"></div>
                        <div class="h-full bg-white absolute top-0 left-0 transition-all duration-500" style="width: ${npc.relationship + 100 / 2}%"></div>
                    </div>
                    <div class="mt-4 flex flex-wrap gap-2">
                        ${npc.memory.length === 0 ? `
                            <div class="text-[9px] text-gray-600 italic">Chưa có ký ức đặc biệt nào...</div>
                        ` : npc.memory.map(m => `
                            <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] text-gray-400 italic">
                                ${this.getMemoryText(m.type)}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <!-- Deep Info -->
                <div class="grid grid-cols-2 gap-8">
                    <div class="space-y-4">
                        <h4 class="text-[10px] font-bold text-white uppercase tracking-widest border-l-2 border-qi-jade pl-3">Thông tin chi tiết</h4>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center text-xs">
                                <span class="text-gray-500">Tính cách:</span>
                                <span class="text-white">${personality}</span>
                            </div>
                            <div class="flex justify-between items-center text-xs">
                                <span class="text-gray-500">Mục tiêu:</span>
                                <span class="text-white font-bold text-qi-jade">${goal}</span>
                            </div>
                            <div class="flex justify-between items-center text-xs">
                                <span class="text-gray-500">Đạo tâm:</span>
                                <span class="text-white">${npc.daoHeart}</span>
                            </div>
                            <div class="flex justify-between items-center text-xs">
                                <span class="text-gray-500">Khí vận:</span>
                                <span class="text-white">${npc.luck}</span>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <h4 class="text-[10px] font-bold text-white uppercase tracking-widest border-l-2 border-qi-jade pl-3">Hành tung hiện tại</h4>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center text-xs">
                                <span class="text-gray-500">Địa điểm:</span>
                                <span class="text-white">${npc.location}</span>
                            </div>
                            <div class="flex justify-between items-center text-xs">
                                <span class="text-gray-500">Trạng thái:</span>
                                <span class="text-white italic">${npc.mood}</span>
                            </div>
                            <div class="flex justify-between items-center text-xs">
                                <span class="text-gray-500">Hành động:</span>
                                <span class="px-3 py-1 bg-white/5 rounded-lg text-white font-bold">${npc.activity}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="pt-8 border-t border-white/5 space-y-4">
                    <div class="grid grid-cols-3 gap-4">
                        <button class="py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-bold text-white uppercase tracking-widest transition-all" onclick="window.game.openNPCDialogue('${npc.id}')">Trò Chuyện</button>
                        <button class="py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-bold text-white uppercase tracking-widest transition-all" onclick="window.game.openNPCGift('${npc.id}')">Tặng Quà</button>
                        <button class="py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-bold text-white uppercase tracking-widest transition-all" onclick="window.game.openNPCTrade('${npc.id}')">Giao Dịch</button>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <button class="py-4 bg-qi-purple/10 hover:bg-qi-purple/20 border border-qi-purple/30 rounded-2xl text-[10px] font-bold text-qi-purple uppercase tracking-widest transition-all" onclick="window.game.socialAction('${npc.id}', 'dao_lu')">Kết Đạo Lữ</button>
                        <button class="py-4 bg-qi-blue/10 hover:bg-qi-blue/20 border border-qi-blue/30 rounded-2xl text-[10px] font-bold text-qi-blue uppercase tracking-widest transition-all" onclick="window.game.socialAction('${npc.id}', 'su_do')">Bái Sư</button>
                    </div>
                    ${npc.specialRelation === 'dao_lu' ? `
                        <button class="w-full py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-2xl text-[10px] font-bold text-red-400 uppercase tracking-widest transition-all animate-pulse" onclick="window.game.socialAction('${npc.id}', 'double_cultivate')">Song Tu Cùng Nhau</button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    getMemoryText(type) {
        const texts = {
            'saved_life': 'Đã cứu mạng',
            'gift_low': 'Nhận quà mọn',
            'gift_high': 'Nhận trọng lễ',
            'betrayed': 'Đã phản bội',
            'stole_treasure': 'Cướp bảo vật',
            'attacked': 'Đã tấn công'
        };
        return texts[type] || type;
    }

    selectNpc(id) {
        this.selectedNpcId = id;
        this.render();
    }
}
