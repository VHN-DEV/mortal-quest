import { state } from '../../state.js';
import { getItemById } from '../../configs/item-data.js';

/**
 * Quản lý giao diện túi đồ và trang bị.
 */
export class InventoryScreen {
    constructor() {
        this.initElements();
        this.initEvents();
    }

    initElements() {
        this.elInventoryGrid = document.getElementById('inventory-grid');
        this.elInventoryCapacity = document.getElementById('inventory-capacity');
        this.btnInventorySort = document.getElementById('btn-inventory-sort');
        this.elItemDetail = document.getElementById('item-detail');
        this.elDetailIcon = document.getElementById('detail-icon');
        this.elDetailName = document.getElementById('detail-name');
        this.elDetailType = document.getElementById('detail-type');
        this.elDetailDesc = document.getElementById('detail-desc');
        this.btnUseItem = document.getElementById('btn-use-item');
        this.btnEquipItem = document.getElementById('btn-equip-item');
        this.equipmentSlots = document.querySelectorAll('.equipment-slot');
    }

    initEvents() {
        if (this.btnInventorySort) {
            this.btnInventorySort.onclick = () => {
                state.player.inventory.sortItems();
                this.render();
            };
        }

        if (this.btnUseItem) {
            this.btnUseItem.onclick = () => {
                if (state.selectedItemId && state.player.inventory.useItem(state.selectedItemId)) {
                    if (!state.player.inventory.items.find(i => i.id === state.selectedItemId)) {
                        state.selectedItemId = null;
                        state.ui.toggleOverlay(this.elItemDetail, false);
                    }
                    window.game.refreshUI();
                }
            };
        }

        if (this.btnEquipItem) {
            this.btnEquipItem.onclick = () => {
                if (!state.selectedItemId) return;
                const itemData = getItemById(state.selectedItemId);
                
                if (itemData.type === 'formation') {
                    const res = state.systems.formation.activateFormation(state.selectedItemId);
                    state.ui.toast(res.msg, res.success ? 'success' : 'error');
                    if (res.success) {
                        state.ui.toggleOverlay(this.elItemDetail, false);
                        window.game.refreshUI();
                    }
                } else if (state.player.equip(state.selectedItemId)) {
                    state.selectedItemId = null;
                    state.ui.toggleOverlay(this.elItemDetail, false);
                    this.render();
                }
            };
        }
    }

    render() {
        if (!state.player) return;
        
        if (this.elInventoryGrid) this.elInventoryGrid.innerHTML = '';
        if (this.elInventoryCapacity) {
            this.elInventoryCapacity.textContent = `${state.player.inventory.items.length}/${state.player.inventory.maxSlots}`;
        }

        state.player.inventory.items.forEach(item => {
            const itemData = getItemById(item.id);
            if (!itemData) return;
            
            const displayQuality = (item.metadata && item.metadata.quality) ? item.metadata.quality : itemData.quality;
            const qClass = this.getQualityClass(displayQuality);
            
            const el = document.createElement('div');
            el.className = `p-2 border rounded-lg bg-black/20 flex flex-col items-center cursor-pointer transition-all border-${qClass}/30 ${state.selectedItemId === item.id ? 'bg-qi-blue/10 border-qi-blue' : 'hover:border-white/30'}`;
            el.innerHTML = `
                <div class="text-2xl mb-1">${itemData.icon}</div>
                <div class="text-[10px] text-gray-400">x${item.quantity}</div>
            `;
            el.onclick = () => this.selectItem(item.id);
            this.elInventoryGrid.appendChild(el);
        });

        this.renderEquipmentSlots();
    }

    renderEquipmentSlots() {
        this.equipmentSlots.forEach(slot => {
            const type = slot.dataset.slot;
            const itemId = state.player.equipment[type];
            slot.innerHTML = '';
            
            const classesToRemove = Array.from(slot.classList).filter(c => c.startsWith('border-') && c !== 'border-white/20');
            slot.classList.remove(...classesToRemove);

            if (itemId) {
                const item = getItemById(itemId);
                if (item) {
                    const qClass = this.getQualityClass(item.quality);
                    slot.classList.remove('border-white/20');
                    slot.classList.add(`border-${qClass}/50`);
                    slot.innerHTML = `<span class="text-xl">${item.icon}</span>`;
                    slot.onclick = () => {
                        if (state.player.unequip(type)) window.game.refreshUI();
                    };
                }
            } else {
                slot.classList.add('border-white/20');
                const icons = { head: 'ph-crown', shoes: 'ph-sneaker', necklace: 'ph-diamond', artifact: 'ph-magic-wand', weapon: 'ph-sword', armor: 'ph-coat-hanger', accessory: 'ph-ring', treasure: 'ph-sparkle' };
                slot.innerHTML = `<i class="ph ${icons[type] || 'ph-question'} text-gray-400"></i>`;
                slot.onclick = null;
            }
        });
    }

    selectItem(id) {
        state.selectedItemId = id;
        const itemData = getItemById(id);
        if (!itemData) return;
        
        const playerItem = state.player.inventory.items.find(i => i.id === id);
        const displayQuality = (playerItem && playerItem.metadata && playerItem.metadata.quality) ? playerItem.metadata.quality : itemData.quality;
        const qClass = this.getQualityClass(displayQuality);
        
        if (this.elDetailIcon) this.elDetailIcon.textContent = itemData.icon;
        if (this.elDetailName) {
            this.elDetailName.textContent = itemData.name;
            this.elDetailName.className = `text-xl font-bold text-white font-ancient mb-1 quality-${qClass}`;
        }
        
        this.elDetailType.textContent = `${displayQuality} phẩm | ${itemData.type}`;
        this.elDetailDesc.textContent = itemData.description;

        this.btnUseItem.style.display = (itemData.type === 'consumable' || itemData.type === 'book') ? 'block' : 'none';
        const equippable = ['weapon', 'armor', 'accessory', 'treasure'].includes(itemData.type);
        this.btnEquipItem.style.display = equippable ? 'block' : 'none';

        state.ui.toggleOverlay(this.elItemDetail, true);
        this.render();
    }

    getQualityClass(quality) {
        const map = { 'Phàm': 'pham', 'Hoàng': 'hoang', 'Huyền': 'huyen', 'Địa': 'dia', 'Thiên': 'thien', 'Tiên': 'tien', 'Thần': 'than' };
        return map[quality] || 'pham';
    }
}
