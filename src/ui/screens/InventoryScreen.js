import { state } from '../../state.js';
import { getItemById } from '../../configs/item-data.js';
import { getAssetUrl } from '../../configs/asset-data.js';

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
        this.elDetailStats = document.getElementById('detail-stats');
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
        this.btnBuyItem = document.getElementById('btn-buy-item');
        this.btnSellItem = document.getElementById('btn-sell-item');
        this.btnCrushStone = document.getElementById('btn-crush-stone');
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
                const itemData = getItemById(state.selectedItemId);
                const isManual = itemData && itemData.action && itemData.action.startsWith('open_');

                if (state.selectedItemId && state.player.inventory.useItem(state.selectedItemId, qty)) {
                    // Nếu là vật phẩm xem (manual), đóng popup chi tiết để hiện popup danh lục
                    if (isManual) {
                        state.ui.toggleOverlay(this.elItemDetail, false);
                    } else if (!state.player.inventory.items.find(i => i.id === state.selectedItemId)) {
                        state.selectedItemId = null;
                        state.ui.toggleOverlay(this.elItemDetail, false);
                    }
                    window.game.refreshUI();
                } else if (state.selectedItemId) {
                    state.ui.toast('Không thể luyện hóa/sử dụng vật phẩm này lúc này.', 'error');
                }
            };
        }

        if (this.btnCrushStone) {
            this.btnCrushStone.onclick = () => {
                if (state.selectedItemId && state.player.crushStone(state.selectedItemId, 1).success) {
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

        if (this.btnBuyItem) {
            this.btnBuyItem.onclick = () => {
                if (state.selectedItemId && state.systems.shop) {
                    const res = state.systems.shop.buyItem(state.selectedItemId, 1);
                    state.ui.toast(res.msg, res.success ? 'success' : 'error');
                    if (res.success) {
                        state.ui.toggleOverlay(this.elItemDetail, false);
                        window.game.refreshUI();
                    }
                }
            };
        }

        if (this.btnSellItem) {
            this.btnSellItem.onclick = () => {
                const qty = parseInt(this.elQtyInput.value) || 1;
                if (state.selectedItemId && state.systems.shop) {
                    const res = state.systems.shop.sellItem(state.selectedItemId, qty);
                    state.ui.toast(res.msg, res.success ? 'success' : 'error');
                    if (res.success) {
                        state.ui.toggleOverlay(this.elItemDetail, false);
                        window.game.refreshUI();
                    }
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
                <div class="text-2xl mb-1">${itemData.image ? `<img src="${getAssetUrl(itemData.image)}" class="w-8 h-8 object-contain">` : (itemData.icon || '')}</div>
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
                    slot.innerHTML = item.image ? `<img src="${getAssetUrl(item.image)}" class="w-6 h-6 object-contain">` : `<span class="text-xl">${item.icon || ''}</span>`;
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

    selectItem(id, fromShop = false, fromSell = false) {
        state.selectedItemId = id;
        const itemData = getItemById(id);
        if (!itemData) return;

        const playerItem = state.player.inventory.items.find(i => i.id === id);
        const displayQuality = (playerItem && playerItem.metadata && playerItem.metadata.quality) ? playerItem.metadata.quality : itemData.quality;
        const qClass = this.getQualityClass(displayQuality);

        if (this.elDetailIcon) {
            if (itemData.image) {
                this.elDetailIcon.innerHTML = `<img src="${getAssetUrl(itemData.image)}" class="w-16 h-16 object-contain mx-auto">`;
            } else {
                this.elDetailIcon.textContent = itemData.icon || '';
            }
        }
        if (this.elDetailName) {
            this.elDetailName.textContent = itemData.name;
            this.elDetailName.className = `text-xl font-bold text-white font-ancient mb-1 quality-${qClass}`;
        }

        const typeNames = {
            'spirit_stone': 'Linh Thạch',
            'consumable': 'Đan Dược / Linh Vật',
            'book': 'Công Pháp / Bí Tịch',
            'weapon': 'Linh Khí / Pháp Bảo',
            'armor': 'Pháp Y / Linh Giáp',
            'accessory': 'Trang Sức',
            'treasure': 'Thiên Tài Địa Bảo',
            'formation': 'Trận Pháp',
            'puppet': 'Khôi Lỗi',
            // Artifact types
            'attackArtifact': 'Pháp Bảo Chủ Chiến',
            'defenseArtifact': 'Pháp Bảo Hộ Thân',
            'flightArtifact': 'Phi Hành Pháp Bảo',
            'spaceArtifact': 'Càn Khôn Pháp Bảo',
            'formationArtifact': 'Trận Đạo Pháp Bảo',
            'supportArtifact': 'Phụ Trợ Pháp Bảo',
            'soulArtifact': 'Hồn Đạo Pháp Bảo'
        };

        this.elDetailType.textContent = `${displayQuality}${ (displayQuality.toLowerCase().includes('phẩm') || ['Hoàn Mỹ', 'Truyền Thuyết', 'Thần Thoại'].includes(displayQuality)) ? '' : ' Phẩm' } | ${typeNames[itemData.type] || itemData.type}`;

        this.elDetailDesc.textContent = itemData.description;
        if (this.elDetailStats) this.elDetailStats.innerHTML = '';
        
        // Puppet specific
        if (itemData.type === 'puppet' && playerItem && playerItem.metadata) {
            desc = `${playerItem.metadata.name}\n${desc}\nĐộ bền: ${playerItem.metadata.durability}/${playerItem.metadata.maxDurability}`;
            if (playerItem.metadata.stats) {
                const stats = playerItem.metadata.stats;
                desc += `\nHP: ${stats.hp} | ATK: ${stats.atk} | DEF: ${stats.def}`;
            }
        }
        
        // Artifact specific (only when item is in player inventory)
        const isArtifact = itemData.type.includes('Artifact');
        if (isArtifact && playerItem) {
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
        }

        // Show stats for all equippable items (works in both shop and inventory view)
        if (itemData.stats && this.elDetailStats) {
            Object.entries(itemData.stats).forEach(([key, val]) => {
                const statEl = document.createElement('div');
                statEl.className = 'flex justify-between items-center text-[10px] text-gray-400 border-b border-white/5 py-1';
                statEl.innerHTML = `<span>${this.getStatLabel(key)}</span><span class="text-qi-blue font-mono">+${val}</span>`;
                this.elDetailStats.appendChild(statEl);
            });
        }

        // Show/Hide Quantity Container
        const isStackable = ['spirit_stone', 'consumable'].includes(itemData.type);
        if (this.elQtyContainer) {
            this.elQtyContainer.classList.toggle('hidden', !isStackable || fromShop);
            if (isStackable && playerItem && !fromShop) {
                this.elQtyInput.value = 1;
                this.elQtyMaxText.textContent = `Tối đa: ${playerItem.quantity}`;
            }
        }

        if (fromShop || fromSell) {
            this.btnUseItem.classList.add('hidden');
            this.btnEquipItem.classList.add('hidden');
            if (this.btnBuyItem) this.btnBuyItem.classList.toggle('hidden', !fromShop);
            if (this.btnSellItem) this.btnSellItem.classList.toggle('hidden', !fromSell);
            
            // Re-show quantity for selling
            if (fromSell && isStackable) {
                this.elQtyContainer.classList.remove('hidden');
                if (playerItem) {
                    this.elQtyInput.value = 1;
                    this.elQtyMaxText.textContent = `Tối đa: ${playerItem.quantity}`;
                }
            }

            state.ui.toggleOverlay(this.elItemDetail, true);
            return;
        } else {
            if (this.btnBuyItem) this.btnBuyItem.classList.add('hidden');
            if (this.btnSellItem) this.btnSellItem.classList.add('hidden');
            if (this.btnCrushStone) this.btnCrushStone.classList.add('hidden');
        }

        const isSpiritStone = itemData.type === 'spirit_stone';
        const isManual = itemData.action && (itemData.action.startsWith('open_') || itemData.action.includes('linh_the_luc'));
        
        this.btnUseItem.classList.toggle('hidden', !(['consumable', 'book', 'spirit_stone'].includes(itemData.type)) || (fromShop && !isManual));
        if (this.btnCrushStone) this.btnCrushStone.classList.toggle('hidden', !isSpiritStone || fromShop || fromSell);

        if (isSpiritStone) {
            this.btnUseItem.textContent = 'LUYỆN HÓA';
        } else {
            this.btnUseItem.textContent = isManual ? 'XEM' : (itemData.type === 'book' ? 'LĨNH NGỘ' : 'SỬ DỤNG');
        }
        
        const mappedSlot = state.player.getEquipSlotForItemType
            ? state.player.getEquipSlotForItemType(itemData.type)
            : itemData.type;
        const equippable = Object.prototype.hasOwnProperty.call(state.player.equipment, mappedSlot);

        if (equippable) {
            this.btnEquipItem.textContent = itemData.type.includes('Artifact') ? 'KHỞI ĐỘNG' : 'TRANG BỊ';
            this.buildEquipPreview(itemData, mappedSlot);
        }
        this.btnEquipItem.classList.toggle('hidden', !equippable);

        state.ui.toggleOverlay(this.elItemDetail, true);
        this.render();
    }

    getStatLabel(statKey) {
        const map = {
            atk: 'Công',
            def: 'Thủ',
            spd: 'Tốc',
            maxHp: 'Sinh lực',
            maxMana: 'Pháp lực',
            mana: 'Pháp lực',
            luck: 'Khí vận',
            critChance: 'Tỉ lệ bạo kích',
            critDamage: 'Sát thương bạo kích',
            karma: 'Nhân quả',
            lifespan: 'Thọ nguyên',
            life_span: 'Thọ nguyên',
            qiAbsorb: 'Hấp thụ Linh khí',
            qi_absorb: 'Hấp thụ Linh khí',
            alchemyBonus: 'Tỉ lệ Luyện đan',
            alchemy_success: 'Tỉ lệ Luyện đan',
            smithingBonus: 'Tỉ lệ Luyện khí',
            smithing_success: 'Tỉ lệ Luyện khí',
            tu_vi_speed: 'Tốc độ Tu luyện',
            tuViSpeed: 'Tốc độ Tu luyện',
            spirit: 'Thần thức',
            slots: 'Ô chứa đồ',
            breakthroughRate: 'Tỉ lệ Đột phá',
            breakthrough_rate: 'Tỉ lệ Đột phá'
        };
        return map[statKey] || statKey;
    }

    buildEquipPreview(itemData, mappedSlot) {
        if (!itemData?.stats) return '';

        const currentEquippedId = state.player.equipment[mappedSlot];
        const currentEquipped = currentEquippedId ? getItemById(currentEquippedId) : null;
        const currentStats = currentEquipped?.stats || {};

        const statKeys = new Set([...Object.keys(itemData.stats), ...Object.keys(currentStats)]);
        if (statKeys.size === 0) return '';

        statKeys.forEach((key) => {
            const nextVal = itemData.stats[key] || 0;
            const curVal = currentStats[key] || 0;
            const diff = nextVal - curVal;
            const sign = diff >= 0 ? '+' : '';
            
            if (this.elDetailStats) {
                const statEl = document.createElement('div');
                statEl.className = 'flex justify-between items-center text-[10px] py-1 border-b border-white/5';
                const label = this.getStatLabel(key);
                const diffColor = diff > 0 ? 'text-qi-jade' : (diff < 0 ? 'text-red-500' : 'text-gray-500');
                statEl.innerHTML = `<span>${label}</span><span class="${diffColor} font-mono">${sign}${diff}</span>`;
                this.elDetailStats.appendChild(statEl);
            }
        });

        if (currentEquipped && this.elDetailStats) {
            const infoEl = document.createElement('div');
            infoEl.className = 'text-[8px] text-gray-600 italic mt-2 text-center';
            infoEl.textContent = `Đang trang bị: ${currentEquipped.name}`;
            this.elDetailStats.appendChild(infoEl);
        }
    }

    getQualityClass(quality) {
        const map = { 
            'Phàm': 'pham', 'Hoàng': 'hoang', 'Huyền': 'huyen', 'Địa': 'dia', 'Thiên': 'thien', 'Tiên': 'tien', 'Thần': 'than',
            // New qualities
            'Tàn Khuyết': 'pham', 'Thường': 'hoang', 'Tinh Phẩm': 'huyen', 'Hoàn Mỹ': 'dia', 'Cực Phẩm': 'thien', 'Truyền Thuyết': 'tien', 'Thần Thoại': 'than',
            'Danh Khí': 'than', 'Danh Bảo': 'than'
        };
        return map[quality] || 'pham';
    }
}
