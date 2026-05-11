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

        // Quantity Selector Elements
        this.elQtyContainer = document.getElementById('detail-quantity-container');
        this.elQtyInput = document.getElementById('detail-quantity-input');
        this.elQtyMaxText = document.getElementById('detail-max-quantity');
        this.btnQtyMinus = document.getElementById('detail-qty-minus');
        this.btnQtyPlus = document.getElementById('detail-qty-plus');
        this.btnQtyMax = document.getElementById('detail-qty-max');
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
                const qty = parseInt(this.elQtyInput.value) || 1;
                if (state.selectedItemId && state.player.inventory.useItem(state.selectedItemId, qty)) {
                    if (!state.player.inventory.items.find(i => i.id === state.selectedItemId)) {
                        state.selectedItemId = null;
                        state.ui.toggleOverlay(this.elItemDetail, false);
                    }
                    window.game.refreshUI();
                }
            };
        }

        if (this.btnQtyMinus) {
            this.btnQtyMinus.onclick = () => {
                const val = Math.max(1, (parseInt(this.elQtyInput.value) || 1) - 1);
                this.elQtyInput.value = val;
            };
        }

        if (this.btnQtyPlus) {
            this.btnQtyPlus.onclick = () => {
                const item = state.player.inventory.items.find(i => i.id === state.selectedItemId);
                if (!item) return;
                const val = Math.min(item.quantity, (parseInt(this.elQtyInput.value) || 1) + 1);
                this.elQtyInput.value = val;
            };
        }

        if (this.btnQtyMax) {
            this.btnQtyMax.onclick = () => {
                const item = state.player.inventory.items.find(i => i.id === state.selectedItemId);
                if (item) this.elQtyInput.value = item.quantity;
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
            const weight = state.player.inventory.getTotalWeight().toFixed(2);
            this.elInventoryCapacity.textContent = `${state.player.inventory.items.length}/${state.player.inventory.maxSlots} | ${weight}kg`;
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
                    slot.onclick = (e) => {
                        e.stopPropagation();
                        const isArtifact = type.includes('Artifact');
                        if (isArtifact) {
                            if (window.game.screens.treasure) {
                                window.game.screens.treasure.open(type);
                            }
                        } else {
                            if (state.player.unequip(type)) window.game.refreshUI();
                        }
                    };
                }
            } else {
                slot.classList.add('border-white/20');
                const icons = { 
                    head: 'ph-crown', 
                    shoes: 'ph-sneaker', 
                    necklace: 'ph-diamond', 
                    attackArtifact: 'ph-sword', 
                    defenseArtifact: 'ph-shield', 
                    flightArtifact: 'ph-wind', 
                    spaceArtifact: 'ph-backpack', 
                    formationArtifact: 'ph-circles-three', 
                    supportArtifact: 'ph-sparkle', 
                    soulArtifact: 'ph-ghost' 
                };
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

        const typeNames = {
            'spirit_stone': 'Linh Thạch',
            'consumable': 'Vật Phẩm Tiêu Hao',
            'book': 'Bí Tịch / Công Pháp',
            'weapon': 'Pháp Bảo / Vũ Khí',
            'armor': 'Pháp Y / Giáp',
            'accessory': 'Trang Sức',
            'treasure': 'Thiên Tài Địa Bảo',
            'formation': 'Trận Pháp',
            'puppet': 'Khôi Lỗi',
            // Artifact types
            'attackArtifact': 'Pháp Bảo Chủ Chiến',
            'defenseArtifact': 'Pháp Bảo Hộ Thân',
            'flightArtifact': 'Phi Hành Pháp Bảo',
            'spaceArtifact': 'Không Gian Pháp Bảo',
            'formationArtifact': 'Trận Đạo Pháp Bảo',
            'supportArtifact': 'Phụ Trợ Pháp Bảo',
            'soulArtifact': 'Hồn Đạo Pháp Bảo'
        };

        this.elDetailType.textContent = `${displayQuality} Phẩm | ${typeNames[itemData.type] || itemData.type}`;

        let desc = itemData.description;
        
        // Puppet specific
        if (itemData.type === 'puppet' && playerItem && playerItem.metadata) {
            desc = `${playerItem.metadata.name}\n${desc}\nĐộ bền: ${playerItem.metadata.durability}/${playerItem.metadata.maxDurability}`;
            if (playerItem.metadata.stats) {
                const stats = playerItem.metadata.stats;
                desc += `\nHP: ${stats.hp} | ATK: ${stats.atk} | DEF: ${stats.def}`;
            }
        }
        
        // Artifact specific
        const isArtifact = itemData.type.includes('Artifact');
        if (isArtifact) {
            const meta = playerItem.metadata || {};
            const tier = itemData.tier || 'PHAM_KHI';
            const level = meta.level || 1;
            const spirit = meta.spirit || 0;
            const durability = meta.durability || 100;
            const isBound = meta.isBound || state.player.recognizedItems?.includes(id);

            desc += `\n\n--- THÔNG TIN PHÁP BẢO ---`;
            desc += `\nCấp bậc: ${level}`;
            desc += `\nLinh tính: ${spirit.toFixed(1)} / ${level * 500}`;
            desc += `\nĐộ bền: ${durability}%`;
            desc += `\nNhận chủ: ${isBound ? 'ĐÃ NHẬN CHỦ' : 'CHƯA NHẬN CHỦ'}`;
            
            if (itemData.stats) {
                desc += `\n\n[CHỈ SỐ]`;
                Object.entries(itemData.stats).forEach(([key, val]) => {
                    desc += `\n- ${key}: +${val}`;
                });
            }
        }

        this.elDetailDesc.textContent = desc;

        // Show/Hide Quantity Container
        const isStackable = ['spirit_stone', 'consumable'].includes(itemData.type);
        if (this.elQtyContainer) {
            this.elQtyContainer.classList.toggle('hidden', !isStackable);
            if (isStackable && playerItem) {
                this.elQtyInput.value = 1;
                this.elQtyMaxText.textContent = `Tối đa: ${playerItem.quantity}`;
            }
        }

        this.btnUseItem.style.display = (['consumable', 'book', 'spirit_stone'].includes(itemData.type)) ? 'block' : 'none';
        if (itemData.type === 'spirit_stone') {
            this.btnUseItem.textContent = 'LUYỆN HÓA';
        } else {
            this.btnUseItem.textContent = (itemData.type === 'book') ? 'LĨNH NGỘ' : 'SỬ DỤNG';
        }

        const equippable = ['weapon', 'armor', 'accessory', 'treasure', 
                            'attackArtifact', 'defenseArtifact', 'flightArtifact', 
                            'spaceArtifact', 'formationArtifact', 'supportArtifact', 'soulArtifact'
                           ].includes(itemData.type);
        this.btnEquipItem.style.display = equippable ? 'block' : 'none';

        state.ui.toggleOverlay(this.elItemDetail, true);
        this.render();
    }

    getQualityClass(quality) {
        const map = { 
            'Phàm': 'pham', 'Hoàng': 'hoang', 'Huyền': 'huyen', 'Địa': 'dia', 'Thiên': 'thien', 'Tiên': 'tien', 'Thần': 'than',
            // New qualities
            'Tàn Khuyết': 'pham', 'Thường': 'hoang', 'Tinh Phẩm': 'huyen', 'Hoàn Mỹ': 'dia', 'Cực Phẩm': 'thien', 'Truyền Thuyết': 'tien', 'Thần Thoại': 'than'
        };
        return map[quality] || 'pham';
    }
}
