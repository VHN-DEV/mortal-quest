import { state } from '../../state.js';
import { getItemById } from '../../configs/item-data.js';
import { SMITHING_RECIPES } from '../../configs/smithing-data.js';
import { getAssetUrl } from '../../configs/asset-data.js';

export class VanKhiLauScreen {
    constructor() {
        this.currentTab = 'shop'; // 'shop', 'forge', 'repair', 'upgrade'
        this.initElements();
    }

    initElements() {
        this.elScreen = document.getElementById('van-khi-lau-overlay');
        this.elContent = document.getElementById('van-khi-lau-content');
        this.elLingShi = document.getElementById('van-khi-lau-lingshi-text');
    }

    open() {
        if (!state.player) return;
        this.currentTab = 'shop';
        this.render();
        state.ui.toggleOverlay(this.elScreen, true);
    }

    setTab(tab) {
        this.currentTab = tab;
        this.render();
    }

    updateTabUI() {
        const tabs = ['shop', 'forge', 'repair', 'upgrade'];
        tabs.forEach(t => {
            const btn = document.getElementById(`van-khi-lau-tab-${t}`);
            if (btn) {
                if (t === this.currentTab) {
                    btn.className = "flex-1 py-2.5 bg-cultivation-gold/10 text-cultivation-gold border border-cultivation-gold/20 rounded-xl text-[9px] font-ancient uppercase tracking-wider font-bold transition-all";
                } else {
                    btn.className = "flex-1 py-2.5 text-gray-500 rounded-xl text-[9px] font-ancient uppercase tracking-wider font-bold transition-all";
                }
            }
        });
    }

    render() {
        if (!state.player) return;
        
        // Update Linh Thạch count
        if (this.elLingShi) {
            this.elLingShi.textContent = state.player.lingShi.toLocaleString();
        }

        this.updateTabUI();

        // Show/hide views
        const views = {
            shop: document.getElementById('van-khi-lau-shop-view'),
            forge: document.getElementById('van-khi-lau-forge-view'),
            repair: document.getElementById('van-khi-lau-repair-view'),
            upgrade: document.getElementById('van-khi-lau-upgrade-view')
        };

        Object.entries(views).forEach(([k, v]) => {
            if (v) {
                if (k === this.currentTab) {
                    v.classList.remove('hidden');
                } else {
                    v.classList.add('hidden');
                }
            }
        });

        // Delegate rendering
        if (this.currentTab === 'forge') {
            this.renderForge();
        } else if (this.currentTab === 'repair') {
            this.renderRepair();
        } else if (this.currentTab === 'upgrade') {
            this.renderUpgrade();
        }
    }

    renderForge() {
        const view = document.getElementById('van-khi-lau-forge-view');
        if (!view) return;
        view.innerHTML = '';

        const title = document.createElement('h3');
        title.className = "text-xs font-ancient text-cultivation-gold uppercase tracking-widest pl-1 mb-2";
        title.textContent = "Đặt Luyện Pháp Bảo Theo Yêu Cầu";
        view.appendChild(title);

        const recipes = Object.values(SMITHING_RECIPES);
        recipes.forEach(recipe => {
            const item = getItemById(recipe.id);
            if (!item) return;

            const el = document.createElement('div');
            el.className = 'p-4 border border-gray-800 rounded-2xl bg-white/5 space-y-3';

            // Calculate material cost
            let materialsHTML = '';
            let missingMatCost = 0;
            let hasAllMaterials = true;

            recipe.materials.forEach(mat => {
                const matItem = getItemById(mat.id);
                if (!matItem) return;
                const count = state.player.inventory.allItems.find(i => i.id === mat.id)?.quantity || 0;
                const needed = mat.quantity;
                const enough = count >= needed;
                
                if (!enough) {
                    hasAllMaterials = false;
                    const price = matItem.price || 100;
                    missingMatCost += (needed - count) * price;
                }

                materialsHTML += `
                    <div class="text-[10px] flex justify-between ${enough ? 'text-gray-400' : 'text-red-400'}">
                        <span>${matItem.name}:</span>
                        <span>${count}/${needed}</span>
                    </div>
                `;
            });

            const serviceFee = 1000;
            const quickCost = serviceFee + missingMatCost;

            el.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex items-center space-x-2">
                        <span class="text-2xl">${item.icon || '⚔️'}</span>
                        <div>
                            <h4 class="font-bold text-white text-xs font-ancient">${item.name}</h4>
                            <p class="text-[8px] text-gray-500 italic">Thành phẩm: Phẩm chất ${item.quality || 'Pháp khí'}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-black/30 p-2 rounded-lg space-y-1">
                    <div class="text-[8px] text-gray-500 uppercase font-bold tracking-wider mb-1">Nguyên Liệu Cần Thiết:</div>
                    <div class="grid grid-cols-2 gap-x-3 gap-y-1">${materialsHTML}</div>
                </div>
                <div class="flex gap-2">
                    <button class="flex-1 py-2 rounded-xl text-[9px] font-bold uppercase transition-all ${
                        hasAllMaterials && state.player.lingShi >= serviceFee 
                        ? 'bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/40 hover:bg-cultivation-gold/30'
                        : 'bg-gray-800/40 text-gray-600 border border-gray-800 pointer-events-none'
                    }" onclick="window.game.vanKhiLauForge('${recipe.id}', true)">
                        Có NL: ${serviceFee} LT
                    </button>
                    <button class="flex-1 py-2 rounded-xl text-[9px] font-bold uppercase transition-all ${
                        state.player.lingShi >= quickCost
                        ? 'bg-qi-blue/20 text-qi-blue border border-qi-blue/40 hover:bg-qi-blue/30'
                        : 'bg-gray-800/40 text-gray-600 border border-gray-800 pointer-events-none'
                    }" onclick="window.game.vanKhiLauForge('${recipe.id}', false)">
                        Luyện Nhanh: ${quickCost} LT
                    </button>
                </div>
            `;
            view.appendChild(el);
        });
    }

    renderRepair() {
        const view = document.getElementById('van-khi-lau-repair-view');
        if (!view) return;
        view.innerHTML = '';

        const title = document.createElement('h3');
        title.className = "text-xs font-ancient text-cultivation-gold uppercase tracking-widest pl-1 mb-2";
        title.textContent = "Bảo Dưỡng & Khôi Phục Linh Tính";
        view.appendChild(title);

        const equippedSlots = Object.entries(state.player.equipment).filter(([_, itemId]) => itemId !== null);

        let countDamaged = 0;

        equippedSlots.forEach(([slot, itemId]) => {
            const item = getItemById(itemId);
            if (!item) return;

            if (!state.player.equipmentMetadata) state.player.equipmentMetadata = {};
            if (!state.player.equipmentMetadata[slot]) {
                state.player.equipmentMetadata[slot] = { spirit: 0, level: 1, durability: 100 };
            }

            const meta = state.player.equipmentMetadata[slot];
            if (meta.durability >= 100) return;

            countDamaged++;
            const pointsNeeded = 100 - meta.durability;
            const normalCost = pointsNeeded * 30; // 30 LS/point
            const materialCost = pointsNeeded * 5;  // 5 LS/point with material

            // Find if player has Huyền Thiết or Tinh Kim
            const hasHuyenThiet = state.player.inventory.hasItem('huyen_thiet', 1);
            const hasTinhKim = state.player.inventory.hasItem('tinh_kim', 1);
            const canMatRepair = (hasHuyenThiet || hasTinhKim) && state.player.lingShi >= materialCost;

            const el = document.createElement('div');
            el.className = 'p-4 border border-gray-800 rounded-2xl bg-white/5 space-y-3';

            el.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-2">
                        <span class="text-2xl">${item.icon || '⚔️'}</span>
                        <div>
                            <h4 class="font-bold text-white text-xs font-ancient">${item.name}</h4>
                            <p class="text-[8px] text-gray-500 uppercase">${slot.toUpperCase()}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="text-[10px] font-mono text-amber-500 font-bold">${meta.durability}%</span>
                    </div>
                </div>
                <!-- Durability Bar -->
                <div class="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                    <div class="bg-amber-500 h-1.5 transition-all" style="width: ${meta.durability}%"></div>
                </div>
                <div class="flex gap-2">
                    <button class="flex-1 py-2 rounded-xl text-[9px] font-bold uppercase transition-all ${
                        state.player.lingShi >= normalCost
                        ? 'bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/40 hover:bg-cultivation-gold/30'
                        : 'bg-gray-800/40 text-gray-600 border border-gray-800 pointer-events-none'
                    }" onclick="window.game.vanKhiLauRepair('${slot}', false)">
                        Sửa thường: ${normalCost} LT
                    </button>
                    <button class="flex-1 py-2 rounded-xl text-[9px] font-bold uppercase transition-all ${
                        canMatRepair
                        ? 'bg-qi-blue/20 text-qi-blue border border-qi-blue/40 hover:bg-qi-blue/30'
                        : 'bg-gray-800/40 text-gray-600 border border-gray-800 pointer-events-none'
                    }" onclick="window.game.vanKhiLauRepair('${slot}', true)">
                        Thêm Quặng: ${materialCost} LT + 1 Quặng
                    </button>
                </div>
            `;
            view.appendChild(el);
        });

        if (countDamaged === 0) {
            view.innerHTML += `
                <div class="p-8 border border-white/5 rounded-3xl bg-white/5 text-center text-gray-500 italic text-xs">
                    Tất cả trang bị hiện tại đều hoàn hảo, không cần bảo dưỡng thêm.
                </div>
            `;
        }
    }

    renderUpgrade() {
        const view = document.getElementById('van-khi-lau-upgrade-view');
        if (!view) return;
        view.innerHTML = '';

        const title = document.createElement('h3');
        title.className = "text-xs font-ancient text-cultivation-gold uppercase tracking-widest pl-1 mb-2";
        title.textContent = "Thăng Cấp Uy Lực Pháp Bảo (+10% Stats/Lvl)";
        view.appendChild(title);

        const equippedSlots = Object.entries(state.player.equipment).filter(([_, itemId]) => itemId !== null);

        let countUpgradable = 0;

        equippedSlots.forEach(([slot, itemId]) => {
            const item = getItemById(itemId);
            if (!item) return;

            // Only allow upgrading weapons, armor, shields/accessories or generic artifacts
            if (slot === 'necklace' || slot === 'shoes') return; // Simple gear, let's limit upgrades to weapons, armor, accessories and artifacts
            
            countUpgradable++;

            if (!state.player.equipmentMetadata) state.player.equipmentMetadata = {};
            if (!state.player.equipmentMetadata[slot]) {
                state.player.equipmentMetadata[slot] = { spirit: 0, level: 1, durability: 100 };
            }

            const meta = state.player.equipmentMetadata[slot];
            const currentLevel = meta.level || 1;

            // Max level 10
            const isMax = currentLevel >= 10;

            // Costs
            const goldCost = currentLevel * 2000;
            
            // Material requirement: level <= 3 -> 1x Huyền Thiết, 4 <= level <= 7 -> 2x Huyền Thiết, level >= 8 -> 1x Tinh Kim
            let reqMatId = 'huyen_thiet';
            let reqQty = 1;
            if (currentLevel >= 4 && currentLevel <= 7) {
                reqMatId = 'huyen_thiet';
                reqQty = 2;
            } else if (currentLevel >= 8) {
                reqMatId = 'tinh_kim';
                reqQty = 1;
            }

            const reqMat = getItemById(reqMatId);
            const currentMatQty = state.player.inventory.allItems.find(i => i.id === reqMatId)?.quantity || 0;
            const hasMat = currentMatQty >= reqQty;
            const canUpgrade = !isMax && hasMat && state.player.lingShi >= goldCost;

            const el = document.createElement('div');
            el.className = 'p-4 border border-gray-800 rounded-2xl bg-white/5 space-y-3';

            let statsPreviewHTML = '';
            if (item.stats) {
                Object.entries(item.stats).forEach(([k, v]) => {
                    const currentVal = v * (1 + (currentLevel - 1) * 0.1);
                    const nextVal = v * (1 + currentLevel * 0.1);
                    statsPreviewHTML += `
                        <div class="text-[9px] flex justify-between text-gray-400">
                            <span class="uppercase">${k}:</span>
                            <span>+${currentVal.toFixed(1)} <i class="ph ph-arrow-right text-[8px] mx-1 text-gray-600"></i> <span class="text-cultivation-gold font-bold">+${nextVal.toFixed(1)}</span></span>
                        </div>
                    `;
                });
            }

            el.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-2">
                        <span class="text-2xl">${item.icon || '⚔️'}</span>
                        <div>
                            <h4 class="font-bold text-white text-xs font-ancient">${item.name}</h4>
                            <p class="text-[8px] text-gray-500 uppercase">${slot.toUpperCase()} | CẤP ${currentLevel}</p>
                        </div>
                    </div>
                    ${isMax ? '<span class="text-[8px] text-qi-jade font-bold border border-qi-jade/20 bg-qi-jade/10 px-2 py-0.5 rounded-lg">CỰC ĐẠI</span>' : ''}
                </div>
                ${!isMax ? `
                <div class="bg-black/30 p-2.5 rounded-xl space-y-1.5">
                    <div class="text-[8px] text-gray-500 uppercase font-bold tracking-wider">Chỉ Số Thay Đổi:</div>
                    <div class="space-y-0.5">${statsPreviewHTML}</div>
                </div>
                <div class="flex justify-between items-center">
                    <div class="text-[8px] ${hasMat ? 'text-gray-400' : 'text-red-400'} flex items-center space-x-1">
                        <span>Yêu cầu:</span>
                        <span class="font-bold">${reqMat.name} (${currentMatQty}/${reqQty})</span>
                    </div>
                    <button class="px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase transition-all ${
                        canUpgrade 
                        ? 'bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/40 hover:bg-cultivation-gold/30'
                        : 'bg-gray-800/40 text-gray-600 border border-gray-800 pointer-events-none'
                    }" onclick="window.game.vanKhiLauUpgrade('${slot}')">
                        Nâng Cấp: ${goldCost} LT
                    </button>
                </div>
                ` : ''}
            `;
            view.appendChild(el);
        });

        if (countUpgradable === 0) {
            view.innerHTML += `
                <div class="p-8 border border-white/5 rounded-3xl bg-white/5 text-center text-gray-500 italic text-xs">
                    Không có pháp bảo thích hợp để nâng cấp.
                </div>
            `;
        }
    }
}
