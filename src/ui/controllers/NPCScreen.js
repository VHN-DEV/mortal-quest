import { state } from '../../state.js';
import { getRealmById } from '../../configs/realm-data.js';
import { NPC_PERSONALITIES, NPC_GOALS } from '../../configs/npc-data.js';
import { CREATION_ROOTS, CREATION_PHYSIQUES } from '../../configs/creation-data.js';

export class NPCScreen {
    constructor() {
        this.containerId = 'screen-npc';
        this.selectedNpcId = null;
        this.activeTab = 'npcs'; // 'npcs' or 'fate'
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="flex flex-col h-full overflow-hidden" style="background: #070a0f;">

                <!-- Header -->
                <div class="flex-none px-5 pt-5 pb-3" style="background: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent);">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h2 class="text-2xl font-charm text-white tracking-wide">Nhân Thế Lục</h2>
                            <p class="text-[9px] text-gray-500 uppercase tracking-[0.3em] mt-0.5">Giao Tế · Vận Mệnh · Nhân Quả</p>
                        </div>
                        ${this.activeTab === 'npcs' ? `
                            <div class="flex flex-col items-end">
                                <div class="text-2xl font-bold text-cultivation-gold">${state.systems.npc.npcs.length}</div>
                                <div class="text-[8px] text-gray-500 uppercase tracking-widest">Đạo Hữu</div>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Tab Pills -->
                    <div class="flex gap-2">
                        <button onclick="window.npcScreen.setTab('npcs')"
                            class="flex-1 py-2.5 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all ${this.activeTab === 'npcs'
                                ? 'bg-qi-blue/20 text-qi-blue border border-qi-blue/40 shadow-[0_0_12px_rgba(79,158,255,0.15)]'
                                : 'bg-white/5 text-gray-500 border border-white/10 hover:text-gray-300'}">
                            <i class="ph ph-users mr-1"></i>Đạo Hữu
                        </button>
                        <button onclick="window.npcScreen.setTab('fate')"
                            class="flex-1 py-2.5 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all ${this.activeTab === 'fate'
                                ? 'bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/40 shadow-[0_0_12px_rgba(212,175,55,0.15)]'
                                : 'bg-white/5 text-gray-500 border border-white/10 hover:text-gray-300'}">
                            <i class="ph ph-star mr-1"></i>Nhân Quả
                        </button>
                    </div>
                </div>

                <!-- Content -->
                <div id="npc-screen-content" class="flex-1 overflow-hidden relative">
                    ${this.activeTab === 'npcs' ? this.renderNpcsView() : this.renderFateView()}
                </div>

                <!-- NPC Detail Overlay (bottom sheet) -->
                <div id="npc-detail-overlay" class="absolute inset-0 z-50 hidden flex-col justify-end"
                    style="background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);">
                    <div id="npc-detail-sheet" class="rounded-t-3xl overflow-hidden flex flex-col"
                        style="background: linear-gradient(to bottom, #0d1117, #070a0f); border-top: 1px solid rgba(255,255,255,0.08); max-height: 85vh;">
                        <!-- Sheet handle -->
                        <div class="flex-none flex flex-col items-center pt-3 pb-2">
                            <div class="w-10 h-1 rounded-full bg-white/20"></div>
                        </div>
                        <div id="npc-detail-content" class="flex-1 overflow-y-auto custom-scroll pb-8"></div>
                    </div>
                </div>
            </div>
        `;

        if (this.activeTab === 'fate') {
            const fateContainer = document.getElementById('fate-tab-container');
            if (fateContainer && window.game && window.game.screens.fate) {
                window.game.screens.fate.render(fateContainer);
            }
        }

        // Re-open detail if was selected
        if (this.selectedNpcId && this.activeTab === 'npcs') {
            const npc = state.systems.npc.npcs.find(n => n.id === this.selectedNpcId);
            if (npc) this._showDetail(npc);
        }
    }

    setTab(tab) {
        this.activeTab = tab;
        this.render();
    }

    renderNpcsView() {
        const knownNpcs = state.systems.npc.npcs;

        if (knownNpcs.length === 0) {
            return `
                <div class="flex flex-col items-center justify-center h-full space-y-4 p-8 text-center">
                    <div class="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <i class="ph ph-users text-4xl text-gray-600"></i>
                    </div>
                    <div>
                        <p class="text-gray-500 text-sm font-ancient">Giang hồ rộng lớn</p>
                        <p class="text-gray-600 text-[10px] mt-1 italic">Ngươi chưa gặp đạo hữu nào trong hành trình tu tiên...</p>
                    </div>
                </div>
            `;
        }

        // Group by relationship tier
        const allies = knownNpcs.filter(n => n.relationship >= 60);
        const neutrals = knownNpcs.filter(n => n.relationship >= 0 && n.relationship < 60);
        const enemies = knownNpcs.filter(n => n.relationship < 0);

        const renderGroup = (title, color, icon, npcs) => {
            if (npcs.length === 0) return '';
            return `
                <div class="mb-5">
                    <div class="flex items-center gap-2 mb-3 px-1">
                        <i class="ph ${icon} text-sm" style="color: ${color}"></i>
                        <span class="text-[9px] font-bold uppercase tracking-widest" style="color: ${color}">${title}</span>
                        <div class="flex-1 h-px" style="background: ${color}30"></div>
                        <span class="text-[9px] font-mono" style="color: ${color}80">${npcs.length}</span>
                    </div>
                    <div class="space-y-2">
                        ${npcs.map(npc => this.renderNpcCard(npc)).join('')}
                    </div>
                </div>
            `;
        };

        return `
            <div class="h-full overflow-y-auto custom-scroll px-5 pt-2 pb-6">
                ${renderGroup('Đồng Đạo', '#4fd1c5', 'ph-handshake', allies)}
                ${renderGroup('Quen Biết', '#9ca3af', 'ph-user', neutrals)}
                ${enemies.length > 0 ? renderGroup('Thù Địch', '#f87171', 'ph-sword', enemies) : ''}

                <!-- Family bonds -->
                ${state.systems.social.bonds.family.length > 0 ? `
                    <div class="mb-5">
                        <div class="flex items-center gap-2 mb-3 px-1">
                            <i class="ph ph-baby text-sm text-qi-purple"></i>
                            <span class="text-[9px] font-bold text-qi-purple uppercase tracking-widest">Hậu Đại</span>
                            <div class="flex-1 h-px bg-qi-purple/20"></div>
                        </div>
                        <div class="space-y-2">
                            ${state.systems.social.bonds.family.map(child => `
                                <div class="p-4 rounded-2xl border border-qi-purple/20 flex items-center gap-3"
                                    style="background: rgba(168,85,247,0.06);">
                                    <div class="w-12 h-12 rounded-2xl bg-qi-purple/20 border border-qi-purple/30 flex items-center justify-center flex-none">
                                        <i class="ph ph-baby text-xl text-qi-purple"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="text-sm font-bold text-white">${child.name}</div>
                                        <div class="text-[9px] text-qi-purple/70 mt-0.5">Tư chất: ${Math.floor(child.talent)} · 0 Tuổi</div>
                                    </div>
                                    <i class="ph ph-caret-right text-gray-600"></i>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderNpcCard(npc) {
        const realm = getRealmById(npc.realmId);
        const status = npc.getRelationshipStatus();
        const rel = npc.relationship;

        // Color mapping
        const relColor = rel >= 80 ? '#4fd1c5' : rel >= 40 ? '#60a5fa' : rel >= 0 ? '#9ca3af' : '#f87171';
        const barWidth = Math.round(((rel + 100) / 200) * 100);
        const isSelected = npc.id === this.selectedNpcId;

        return `
            <div onclick="window.npcScreen.selectNpc('${npc.id}')"
                class="p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.98]"
                style="background: ${isSelected ? 'rgba(79,158,255,0.08)' : 'rgba(255,255,255,0.03)'};
                       border-color: ${isSelected ? 'rgba(79,158,255,0.3)' : 'rgba(255,255,255,0.06)'};
                       box-shadow: ${isSelected ? '0 0 16px rgba(79,158,255,0.08)' : 'none'};">
                <div class="flex items-center gap-3">
                    <!-- Avatar -->
                    <div class="relative flex-none">
                        <img src="${npc.portrait}" class="w-14 h-14 rounded-2xl object-cover border border-white/10" alt="${npc.name}">
                        <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#070a0f]"
                            style="background: ${relColor};"></div>
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-bold text-white truncate">${npc.name}</span>
                            ${npc.specialRelation ? `<i class="ph ph-heart-straight text-red-400 text-xs flex-none"></i>` : ''}
                        </div>
                        <div class="text-[10px] text-gray-500 mt-0.5">${realm.name}</div>
                        <!-- Mini relationship bar -->
                        <div class="mt-2 h-1 rounded-full overflow-hidden bg-white/5">
                            <div class="h-full rounded-full transition-all duration-500"
                                style="width: ${barWidth}%; background: linear-gradient(to right, #f87171, ${relColor});"></div>
                        </div>
                    </div>

                    <!-- Status badge -->
                    <div class="flex-none text-right">
                        <div class="text-[8px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide"
                            style="color: ${relColor}; background: ${relColor}15; border: 1px solid ${relColor}30;">
                            ${status}
                        </div>
                        <i class="ph ph-caret-right text-gray-600 text-xs mt-2 block"></i>
                    </div>
                </div>
            </div>
        `;
    }

    renderFateView() {
        return `
            <div id="fate-tab-container" class="w-full h-full overflow-y-auto custom-scroll p-5">
                <!-- Fate content will be injected here -->
            </div>
        `;
    }

    selectNpc(id) {
        this.selectedNpcId = id;
        const npc = state.systems.npc.npcs.find(n => n.id === id);
        if (!npc) return;

        // Re-render list to show selection highlight without full re-render
        const listItems = document.querySelectorAll('#npc-screen-content [onclick]');
        listItems.forEach(el => {
            const elId = el.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            const isThis = elId === id;
            el.style.background = isThis ? 'rgba(79,158,255,0.08)' : 'rgba(255,255,255,0.03)';
            el.style.borderColor = isThis ? 'rgba(79,158,255,0.3)' : 'rgba(255,255,255,0.06)';
        });

        this._showDetail(npc);
    }

    _showDetail(npc) {
        const overlay = document.getElementById('npc-detail-overlay');
        const content = document.getElementById('npc-detail-content');
        if (!overlay || !content) return;

        content.innerHTML = this.renderNpcDetail(npc);
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');

        // Close on backdrop click
        overlay.onclick = (e) => {
            if (e.target === overlay) this.closeDetail();
        };
    }

    closeDetail() {
        const overlay = document.getElementById('npc-detail-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
        }
        this.selectedNpcId = null;
    }

    renderNpcDetail(npc) {
        if (!npc) return '';

        const realm = getRealmById(npc.realmId);
        const personality = npc.personalityIds.map(id => NPC_PERSONALITIES[id]?.name).join(' · ');
        const goal = NPC_GOALS[npc.goalId]?.name || 'Ẩn';
        const root = CREATION_ROOTS[npc.rootId]?.name || 'Phàm Căn';
        const physique = CREATION_PHYSIQUES[npc.physiqueId]?.name || 'Phàm Thể';
        const rel = npc.relationship;
        const relColor = rel >= 80 ? '#4fd1c5' : rel >= 40 ? '#60a5fa' : rel >= 0 ? '#9ca3af' : '#f87171';
        const barWidth = Math.round(((rel + 100) / 200) * 100);

        return `
            <div class="px-5 space-y-5">
                <!-- Profile Header -->
                <div class="flex items-start gap-4 pt-2">
                    <div class="relative flex-none">
                        <img src="${npc.portrait}" class="w-20 h-20 rounded-2xl object-cover border border-white/15 shadow-xl" alt="${npc.name}">
                        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest whitespace-nowrap"
                            style="background: rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.15); color: #d4af37;">
                            ${npc.title || 'Vô Danh'}
                        </div>
                    </div>
                    <div class="flex-1 min-w-0 pt-1">
                        <div class="flex items-center gap-2 flex-wrap">
                            <h3 class="text-xl font-bold text-white">${npc.name}</h3>
                            ${npc.specialRelation === 'dao_lu' ? '<i class="ph ph-heart-straight text-red-400"></i>' : ''}
                        </div>
                        <div class="flex flex-wrap gap-1.5 mt-2">
                            <span class="px-2 py-0.5 rounded-md text-[8px] font-bold uppercase"
                                style="background: rgba(79,209,197,0.1); border: 1px solid rgba(79,209,197,0.2); color: #4fd1c5;">
                                ${realm.name}
                            </span>
                            <span class="px-2 py-0.5 rounded-md text-[8px] font-bold uppercase bg-white/5 border border-white/10 text-gray-400">
                                ${npc.gender} · ${npc.age} Tuổi
                            </span>
                        </div>
                    </div>
                    <!-- Close Button -->
                    <button onclick="window.npcScreen.closeDetail()"
                        class="flex-none w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                        <i class="ph ph-x text-sm"></i>
                    </button>
                </div>

                <!-- Relationship Bar -->
                <div class="p-4 rounded-2xl border border-white/8" style="background: rgba(255,255,255,0.03);">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-[9px] font-bold uppercase tracking-widest text-gray-400">Quan Hệ</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-bold" style="color: ${relColor};">${npc.getRelationshipStatus()}</span>
                            <span class="text-[9px] font-mono text-gray-600">${rel}/100</span>
                        </div>
                    </div>
                    <div class="h-2 rounded-full overflow-hidden bg-white/5">
                        <div class="h-full rounded-full transition-all duration-700"
                            style="width: ${barWidth}%; background: linear-gradient(to right, #f87171 0%, ${relColor} 100%);
                                   box-shadow: 0 0 8px ${relColor}60;"></div>
                    </div>
                    ${npc.memory.length > 0 ? `
                        <div class="flex flex-wrap gap-1.5 mt-3">
                            ${npc.memory.slice(0, 4).map(m => `
                                <span class="px-2 py-0.5 rounded-md text-[8px] italic text-gray-500 border border-white/8 bg-white/3">
                                    ${this.getMemoryText(m.type)}
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-2 gap-2">
                    ${[
                        { label: 'Căn Cốt', value: root, icon: 'ph-lightning' },
                        { label: 'Thể Chất', value: physique, icon: 'ph-person' },
                        { label: 'Tính Cách', value: personality || 'Bí ẩn', icon: 'ph-mask-happy' },
                        { label: 'Mục Tiêu', value: goal, icon: 'ph-target' },
                        { label: 'Địa Điểm', value: npc.location, icon: 'ph-map-pin' },
                        { label: 'Hành Động', value: npc.activity, icon: 'ph-activity' },
                    ].map(item => `
                        <div class="p-3 rounded-xl border border-white/6" style="background: rgba(255,255,255,0.02);">
                            <div class="flex items-center gap-1.5 mb-1">
                                <i class="ph ${item.icon} text-xs text-gray-600"></i>
                                <span class="text-[7px] text-gray-500 uppercase tracking-widest">${item.label}</span>
                            </div>
                            <div class="text-[10px] font-bold text-white truncate">${item.value}</div>
                        </div>
                    `).join('')}
                </div>

                <!-- Action Buttons -->
                <div class="space-y-2 pt-1">
                    <div class="grid grid-cols-3 gap-2">
                        <button onclick="window.game.openNPCDialogue('${npc.id}')"
                            class="py-3 rounded-xl text-[9px] font-bold uppercase tracking-wider text-white border border-white/10 transition-all active:scale-95"
                            style="background: rgba(255,255,255,0.04);">
                            <i class="ph ph-chat-circle block text-lg mb-0.5 mx-auto"></i>
                            Trò Chuyện
                        </button>
                        <button onclick="window.game.openNPCGift('${npc.id}')"
                            class="py-3 rounded-xl text-[9px] font-bold uppercase tracking-wider text-white border border-white/10 transition-all active:scale-95"
                            style="background: rgba(255,255,255,0.04);">
                            <i class="ph ph-gift block text-lg mb-0.5 mx-auto"></i>
                            Tặng Quà
                        </button>
                        <button onclick="window.game.openNPCTrade('${npc.id}')"
                            class="py-3 rounded-xl text-[9px] font-bold uppercase tracking-wider text-white border border-white/10 transition-all active:scale-95"
                            style="background: rgba(255,255,255,0.04);">
                            <i class="ph ph-arrows-left-right block text-lg mb-0.5 mx-auto"></i>
                            Giao Dịch
                        </button>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="window.game.socialAction('${npc.id}', 'dao_lu')"
                            class="py-3 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all active:scale-95"
                            style="background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.25); color: #a855f7;">
                            <i class="ph ph-heart-straight mr-1"></i>Kết Đạo Lữ
                        </button>
                        <button onclick="window.game.socialAction('${npc.id}', 'su_do')"
                            class="py-3 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all active:scale-95"
                            style="background: rgba(79,158,255,0.1); border: 1px solid rgba(79,158,255,0.25); color: #60a5fa;">
                            <i class="ph ph-graduation-cap mr-1"></i>Bái Sư
                        </button>
                    </div>
                    ${npc.specialRelation === 'dao_lu' ? `
                        <button onclick="window.game.socialAction('${npc.id}', 'double_cultivate')"
                            class="w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95"
                            style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #f87171;
                                   animation: pulse 2s infinite;">
                            <i class="ph ph-fire mr-1.5"></i>Song Tu Cùng Nhau
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    getMemoryText(type) {
        const texts = {
            'saved_life': '⚡ Đã cứu mạng',
            'gift_low': '🎁 Nhận quà mọn',
            'gift_high': '💎 Nhận trọng lễ',
            'betrayed': '🗡 Đã phản bội',
            'stole_treasure': '💀 Cướp bảo vật',
            'attacked': '⚔ Đã tấn công'
        };
        return texts[type] || type;
    }
}
