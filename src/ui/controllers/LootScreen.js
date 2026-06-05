import { state } from '../../state.js';
import { getItemById } from '../../configs/item-data.js';
import { getQualityObject } from '../../configs/game-enums.js';
import { getAssetUrl } from '../../configs/asset-data.js';

/**
 * Màn hình Loot đồ (PUBG style)
 * Hiển thị 2 danh sách vật phẩm: của đối thủ (trên) và của người chơi (dưới).
 */
export class LootScreen {
    constructor() {
        this.overlay = document.getElementById('loot-screen-overlay');
        this.targetName = document.getElementById('loot-target-name');
        this.victimList = document.getElementById('victim-loot-list');
        this.playerList = document.getElementById('player-loot-list');
        
        this.btnTakeAll = document.getElementById('btn-loot-take-all');
        this.btnConfirm = document.getElementById('btn-loot-confirm');

        this.enemy = null;
        this.victimItems = []; // { id, quantity, metadata }
        this.initEvents();
    }

    initEvents() {
        if (this.btnTakeAll) {
            this.btnTakeAll.onclick = () => this.takeAll();
        }
        if (this.btnConfirm) {
            this.btnConfirm.onclick = () => this.close();
        }
    }

    /**
     * Mở màn hình loot
     * @param {Object} enemy Đối thủ bị tiêu diệt
     * @param {Object} corpseCell Ô bản đồ chứa thi thể (nếu mở lại)
     */
    open(enemy, corpseCell = null) {
        this.enemy = enemy;
        this.corpseCell = corpseCell;

        if (enemy && state.currentCombat) {
            state.currentCombat.lootScreenOpened = true;
        }
        
        if (corpseCell) {
            this.targetName.textContent = corpseCell.corpseName || 'Thi Thể Đối Thủ';
            this.victimItems = corpseCell.corpseItems || [];
        } else {
            this.targetName.textContent = enemy.name || 'Thi Thể Đối Thủ';
            
            // Chuẩn bị danh sách vật phẩm từ enemy
            this.victimItems = [];
            
            // 1. Items từ inventory
            if (enemy.inventory) {
                enemy.inventory.forEach(item => {
                    if (item.quantity > 0) {
                        this.victimItems.push({ ...item });
                    }
                });
            }
            
            // 2. Trang bị (80% cơ hội rơi)
            if (enemy.equipment) {
                Object.values(enemy.equipment).forEach(item => {
                    if (item && Math.random() < 0.8) {
                        this.victimItems.push({ id: item.id, quantity: 1, metadata: item.metadata || {} });
                    }
                });
            }
        }

        state.ui.toggleOverlay(this.overlay, true);
        this.render();
    }

    render() {
        if (state.ui && typeof state.ui.hideTooltip === 'function') {
            state.ui.hideTooltip();
        }
        this.renderVictimItems();
        this.renderPlayerItems();
    }

    renderVictimItems() {
        this.victimList.innerHTML = '';
        if (this.victimItems.length === 0) {
            this.victimList.innerHTML = '<div class="col-span-full py-8 text-center text-gray-600 text-[10px] italic uppercase tracking-widest">Trống rỗng</div>';
            return;
        }

        this.victimItems.forEach((item, index) => {
            const el = this.createItemElement(item, true, index);
            this.victimList.appendChild(el);
        });
    }

    renderPlayerItems() {
        this.playerList.innerHTML = '';
        const playerItems = state.player.inventory.allItems;
        
        if (playerItems.length === 0) {
            this.playerList.innerHTML = '<div class="col-span-full py-8 text-center text-gray-600 text-[10px] italic uppercase tracking-widest">Túi trống</div>';
            return;
        }

        playerItems.forEach((item, index) => {
            const el = this.createItemElement(item, false, index);
            this.playerList.appendChild(el);
        });
    }

    createItemElement(item, isFromVictim, index) {
        const itemData = getItemById(item.id);
        const div = document.createElement('div');
        
        const qObj = getQualityObject(itemData?.quality);
        const qClass = qObj?.cssClass || 'pham';
        
        // Add quality class for specific glows
        const qualityClass = this.getQualityClass(itemData?.quality);
        div.className = `loot-item-slot group ${qualityClass} border-2 border-${qClass} relative flex flex-col justify-between p-1`;
        
        const imageUrl = itemData?.image ? getAssetUrl(itemData.image) : (itemData?.img || '');
        const imageHtml = imageUrl 
            ? `<img src="${imageUrl}" class="w-9 h-9 object-contain opacity-90 group-hover:opacity-100 transition-all group-hover:scale-105 duration-300 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">`
            : `<span class="text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">${itemData?.icon || ''}</span>`;

        const quantityBadgeHtml = item.quantity > 1
            ? `<span class="absolute top-1.5 right-1.5 text-[8px] text-cultivation-gold font-mono font-bold leading-none bg-black/70 px-1.5 py-0.5 rounded border border-white/5 z-10">x${item.quantity}</span>`
            : '';

        div.innerHTML = `
            ${quantityBadgeHtml}
            <div class="absolute inset-0 pb-[22px] flex items-center justify-center z-10">
                ${imageHtml}
            </div>
            <div class="absolute bottom-0 left-0 right-0 h-[22px] bg-black/70 border-t border-white/5 rounded-b-[14px] backdrop-blur-[2px] flex items-center justify-center z-10">
                <span class="text-[7.5px] font-sans font-bold quality-${qClass} truncate px-1 text-center w-full leading-none">${itemData.name}</span>
            </div>
        `;

        // Click to transfer
        div.onclick = () => {
            if (isFromVictim) {
                this.transferToPlayer(index);
            } else {
                this.transferToVictim(index);
            }
        };

        // Tooltip
        div.onmouseenter = (e) => state.ui.showTooltip(item.id, e, item.metadata);
        div.onmouseleave = () => state.ui.hideTooltip();

        return div;
    }

    transferToPlayer(index) {
        const item = this.victimItems[index];
        if (!item) return;

        // Try add to player actual inventory
        const success = state.player.inventory.addItem(item.id, item.quantity, item.metadata);
        if (success) {
            this.victimItems.splice(index, 1);
            state.ui.toast(`Đã nhặt: ${getItemById(item.id)?.name || item.id}`, "success");
            this.render();
            if (window.refreshUI) window.refreshUI();
        } else {
            state.ui.toast("Túi đồ đã đầy!", "error");
        }
    }

    transferToVictim(index) {
        const playerItems = state.player.inventory.allItems;
        const item = playerItems[index];
        if (!item) return;

        // Add to victim temporary list
        this.victimItems.push({ ...item });
        // Remove from player actual inventory
        state.player.inventory.removeItem(item.id, item.quantity);
        
        state.ui.toast(`Đã bỏ lại: ${getItemById(item.id)?.name || item.id}`, "info");
        this.render();
        if (window.refreshUI) window.refreshUI();
    }

    takeAll() {
        if (this.victimItems.length === 0) return;
        
        let count = 0;
        const itemsToTake = [...this.victimItems];
        
        for (const item of itemsToTake) {
            if (state.player.inventory.addItem(item.id, item.quantity, item.metadata)) {
                const idx = this.victimItems.indexOf(item);
                if (idx > -1) this.victimItems.splice(idx, 1);
                count++;
            } else {
                state.ui.toast("Túi đồ đã đầy, không thể nhặt thêm!", "warning");
                break;
            }
        }

        if (count > 0) {
            state.ui.toast(`Đã nhặt tất cả ${count} loại vật phẩm`, "success");
            this.render();
            if (window.refreshUI) window.refreshUI();
        }
    }

    getQualityColor(quality) {
        const qObj = getQualityObject(quality);
        return qObj?.bgClass || 'bg-white/10';
    }

    getQualityClass(quality) {
        const qObj = getQualityObject(quality);
        return qObj?.glowClass || '';
    }

    close() {
        if (state.ui && typeof state.ui.hideTooltip === 'function') {
            state.ui.hideTooltip();
        }
        state.ui.toggleOverlay(this.overlay, false);

        const hasCombatActive = !!state.currentCombat;

        if (this.corpseCell) {
            // Nếu đã nhặt sạch đồ trong xác, xóa ô xác trên bản đồ
            if (this.victimItems.length === 0) {
                this.corpseCell.type = 'empty';
                this.corpseCell.icon = '⬜';
                delete this.corpseCell.corpseName;
                delete this.corpseCell.corpseItems;
            }
            if (window.game.screens.map && typeof window.game.screens.map.renderGridMap === 'function') {
                window.game.screens.map.renderGridMap();
            }
        } else if (this.enemy) {
            // Nếu là sau trận chiến, và còn vật phẩm chưa loot hết
            const gridState = state.player?.gridExplorationState;
            if (gridState && gridState.grid && gridState.playerPos && this.victimItems.length > 0) {
                const cell = gridState.grid[gridState.playerPos.y][gridState.playerPos.x];
                if (cell) {
                    cell.type = 'corpse';
                    cell.icon = '📦';
                    cell.corpseName = this.enemy.name || 'Thi Thể Đối Thủ';
                    cell.corpseItems = [...this.victimItems];
                    state.ui.toast("Thi thể đối thủ vẫn còn ở ô này, có thể quay lại nhặt sau.", "info");
                }
            }
        }

        this.enemy = null;
        this.corpseCell = null;
        this.victimItems = [];

        if (hasCombatActive) {
            state.currentCombat?.onEnd('win');
        }
    }
}
