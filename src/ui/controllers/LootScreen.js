import { state } from '../../state.js';
import { getItemById } from '../../configs/item-data.js';

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
     */
    open(enemy) {
        this.enemy = enemy;
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

        state.ui.toggleOverlay(this.overlay, true);
        this.render();
    }

    render() {
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
        
        // Add quality class for specific glows
        const qualityClass = this.getQualityClass(itemData?.quality);
        div.className = `loot-item-slot group ${qualityClass}`;
        
        const qualityColor = this.getQualityColor(itemData?.quality);
        
        div.innerHTML = `
            ${itemData?.icon ? `<div class="text-3xl opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-md">${itemData.icon}</div>` : 
              (itemData?.img ? `<img src="${itemData.img}" class="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-all group-hover:scale-105">` : 
              `<div class="w-full h-full flex items-center justify-center text-[10px] text-gray-500 font-ancient text-center p-1">${itemData?.name || 'Vô danh'}</div>`)}
            
            <div class="loot-item-quantity">${item.quantity}</div>
            <div class="loot-quality-bar ${qualityColor}"></div>
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
        const colors = {
            'Phàm Khí': 'bg-gray-400',
            'Pháp Khí': 'bg-green-500',
            'Linh Khí': 'bg-blue-500',
            'Pháp Bảo': 'bg-purple-500',
            'Cổ Bảo': 'bg-orange-500',
            'Linh Bảo': 'bg-red-500',
            'Thông Thiên Linh Bảo': 'bg-cultivation-gold',
            'Tiên Khí': 'bg-cyan-400'
        };
        return colors[quality] || 'bg-white/10';
    }

    getQualityClass(quality) {
        const classes = {
            'Pháp Bảo': 'quality-purple-500',
            'Cổ Bảo': 'quality-orange-500',
            'Linh Bảo': 'quality-red-500',
            'Thông Thiên Linh Bảo': 'quality-cultivation-gold',
            'Tiên Khí': 'quality-cyan-400'
        };
        return classes[quality] || '';
    }

    close() {
        state.ui.toggleOverlay(this.overlay, false);
        this.enemy = null;
        this.victimItems = [];
    }
}
