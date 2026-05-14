import { state } from '../../state.js';
import { MINING_NODES, MINING_NODE_GRADES } from '../../configs/mining-data.js';
import { getItemById } from '../../configs/item-data.js';

/**
 * Quản lý giao diện Hệ thống Khai Khoáng (Mining Screen)
 */
export class MiningScreen {
    constructor() {
        this.initElements();
        this.initEvents();
        this.currentTab = 'nodes';
    }

    initElements() {
        this.overlay = document.getElementById('mining-overlay');
        this.viewNodes = document.getElementById('mining-nodes-view');
        this.viewOccupied = document.getElementById('mining-occupied-view');
        this.btnTabNodes = document.getElementById('mining-tab-nodes');
        this.btnTabOccupied = document.getElementById('mining-tab-occupied');
        this.elLevelText = document.getElementById('mining-level-text');
        this.elExpBar = document.getElementById('mining-exp-bar');
        this.elSlotsText = document.getElementById('mining-slots-text');
        this.elStaminaText = document.getElementById('mining-stamina-text');
    }

    initEvents() {
        if (this.btnTabNodes) {
            this.btnTabNodes.onclick = () => {
                this.currentTab = 'nodes';
                this.render();
            };
        }
        if (this.btnTabOccupied) {
            this.btnTabOccupied.onclick = () => {
                this.currentTab = 'occupied';
                this.render();
            };
        }
    }

    open() {
        state.ui.toggleOverlay(this.overlay, true);
        this.render();
    }

    render() {
        if (!state.player || !state.player.miningState) return;

        const ms = state.player.miningState;
        this.elLevelText.textContent = `Cấp ${ms.miningLevel}`;
        const nextLevelExp = ms.miningLevel * 1000;
        this.elExpBar.style.width = `${(ms.miningExp / nextLevelExp) * 100}%`;
        
        const mSystem = window.game.systems.mining;
        this.elSlotsText.textContent = `${ms.occupiedNodes.length} / ${mSystem.getMaxOccupiedSlots()}`;
        this.elStaminaText.textContent = `${Math.floor(state.player.stamina)} / ${state.player.maxStamina}`;

        if (this.currentTab === 'nodes') {
            this.renderNodes();
            this.btnTabNodes.className = "flex-grow py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest";
            this.btnTabOccupied.className = "flex-grow py-3 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest";
            this.viewNodes.classList.remove('hidden');
            this.viewOccupied.classList.add('hidden');
        } else {
            this.renderOccupied();
            this.btnTabNodes.className = "flex-grow py-3 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest";
            this.btnTabOccupied.className = "flex-grow py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest";
            this.viewNodes.classList.add('hidden');
            this.viewOccupied.classList.remove('hidden');
        }
    }

    renderNodes() {
        this.viewNodes.innerHTML = '';
        const ms = state.player.miningState;

        MINING_NODES.forEach(node => {
            const isDiscovered = ms.discoveredNodes.includes(node.id);
            if (!isDiscovered) return;

            const grade = MINING_NODE_GRADES[node.grade];
            const el = document.createElement('div');
            el.className = 'p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3';
            
            const isOccupied = ms.occupiedNodes.some(on => on.nodeId === node.id);
            const canMine = state.player.realmId >= node.requiredRealm;

            el.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="text-sm font-ancient text-white">${node.name}</h4>
                        <span class="text-[9px] text-qi-blue uppercase tracking-tighter">${grade.name}</span>
                    </div>
                    <div class="text-right">
                        <span class="text-[8px] text-gray-500 block uppercase">Yêu cầu</span>
                        <span class="text-[10px] ${canMine ? 'text-qi-jade' : 'text-red-500'}">Cảnh giới ${node.requiredRealm}</span>
                    </div>
                </div>
                <p class="text-[10px] text-gray-500 italic">${node.description}</p>
                <div class="flex space-x-2">
                    <button class="flex-grow py-2 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-lg text-[10px] font-bold ${!canMine ? 'opacity-50 grayscale' : ''}" 
                        onclick="window.game.mineManual('${node.id}')">KHAI THÁC (-5 TL)</button>
                    ${isOccupied ? 
                        `<span class="px-4 py-2 text-[10px] text-qi-jade font-bold">ĐÃ CHIẾM LĨNH</span>` :
                        `<button class="flex-grow py-2 bg-cultivation-gold/10 text-cultivation-gold border border-cultivation-gold/20 rounded-lg text-[10px] font-bold ${!canMine ? 'opacity-50 grayscale' : ''}" 
                            onclick="window.game.occupyNode('${node.id}')">CHIẾM LĨNH (-20 TL)</button>`
                    }
                </div>
            `;
            this.viewNodes.appendChild(el);
        });

        if (this.viewNodes.innerHTML === '') {
            this.viewNodes.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Chưa khám phá ra linh mạch nào...</div>';
        }
    }

    renderOccupied() {
        this.viewOccupied.innerHTML = '';
        const ms = state.player.miningState;

        if (ms.occupiedNodes.length === 0) {
            this.viewOccupied.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Chưa chiếm lĩnh linh mạch nào...</div>';
            return;
        }

        ms.occupiedNodes.forEach(occupied => {
            const node = MINING_NODES.find(n => n.id === occupied.nodeId);
            const grade = MINING_NODE_GRADES[node.grade];
            const el = document.createElement('div');
            el.className = 'p-4 bg-white/5 border border-qi-blue/30 rounded-2xl space-y-4';
            
            const now = window.game?.systems.time?.totalMinutes || 0;
            const elapsed = now - occupied.lastClaimTime;
            const hours = Math.floor(elapsed / 60);

            el.innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <h4 class="text-sm font-ancient text-white">${node.name}</h4>
                        <div class="flex items-center space-x-2">
                            <div class="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div class="h-full bg-qi-jade" style="width: ${occupied.health}%"></div>
                            </div>
                            <span class="text-[8px] text-gray-500">${occupied.health}% Sức khỏe</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="text-[8px] text-gray-500 block">Sản lượng</span>
                        <span class="text-[10px] text-qi-blue font-mono">${grade.baseProduction}/Giờ</span>
                    </div>
                </div>
                
                <div class="bg-black/40 p-3 rounded-xl border border-white/5 flex justify-between items-center">
                    <div>
                        <span class="text-[8px] text-gray-500 uppercase block">Đã tích lũy</span>
                        <span class="text-xs text-white font-mono">${hours} Giờ (${hours * grade.baseProduction} Linh Thạch)</span>
                    </div>
                    <button class="px-4 py-2 bg-qi-jade/10 text-qi-jade border border-qi-jade/20 rounded-lg text-[10px] font-bold ${hours < 1 ? 'opacity-50' : ''}" 
                        onclick="window.game.claimMiningResources('${node.id}')">THU THẬP</button>
                </div>

                <button class="w-full py-2 text-red-500/60 text-[9px] font-bold uppercase tracking-widest hover:text-red-500" 
                    onclick="window.game.abandonNode('${node.id}')">TỪ BỎ CHIẾM LĨNH</button>
            `;
            this.viewOccupied.appendChild(el);
        });
    }
}
