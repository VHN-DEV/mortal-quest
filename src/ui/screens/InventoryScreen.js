import { state } from '../../state.js';
import { getItemById, ITEMS } from '../../configs/item-data.js';
import { getAssetUrl } from '../../configs/asset-data.js';
import { getItemConnections } from '../../utils/item-connections.js';
import { getTechniqueById, getSecretTechniqueById } from '../../configs/technique-data.js';
import { BEASTS } from '../../configs/beast-data.js';

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
        this.btnToggleEquip = document.getElementById('btn-toggle-equipment');
        this.elEquipmentContainer = document.getElementById('inventory-equipment-slots');
        this.equipmentSlots = document.querySelectorAll('.equipment-slot');

        // New Elements
        this.elBagTabs = document.getElementById('inventory-bag-tabs');
        this.btnPrev = document.getElementById('btn-inventory-prev');
        this.btnNext = document.getElementById('btn-inventory-next');
        this.elPageText = document.getElementById('inventory-page-text');

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

        // Connections
        this.elDetailConnections = document.getElementById('detail-connections');
        this.elConnectionsList = document.getElementById('connections-list');

        // Bag Transfer Elements
        this.elTransferContainer = document.getElementById('detail-transfer-container');
        this.elTransferBags = document.getElementById('detail-transfer-bags');
    }

    initEvents() {
        if (this.btnInventorySort) {
            this.btnInventorySort.onclick = () => {
                state.player.inventory.sortItems();
                this.render();
            };
        }

        if (this.btnPrev) {
            this.btnPrev.onclick = () => {
                if (state.player.inventory.currentPage > 0) {
                    state.player.inventory.currentPage--;
                    this.render();
                }
            };
        }

        if (this.btnNext) {
            this.btnNext.onclick = () => {
                const bag = state.player.inventory.currentBag;
                const maxPage = Math.ceil(bag.items.length / state.player.inventory.itemsPerPage) - 1;
                if (state.player.inventory.currentPage < maxPage) {
                    state.player.inventory.currentPage++;
                    this.render();
                }
            };
        }

        if (this.btnUseItem) {
            this.btnUseItem.onclick = () => {
                const qty = parseInt(this.elQtyInput.value) || 1;
                const itemData = getItemById(state.selectedItemId);
                const isManual = itemData && itemData.action && itemData.action.startsWith('open_');

                if (state.selectedItemId && state.player.inventory.useItem(state.selectedItemId, qty)) {
                    if (isManual) {
                        state.ui.toggleOverlay(this.elItemDetail, false);
                    } else if (!state.player.inventory.allItems.find(i => i.id === state.selectedItemId)) {
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
                    if (!state.player.inventory.allItems.find(i => i.id === state.selectedItemId)) {
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
                const item = state.player.inventory.allItems.find(i => i.id === state.selectedItemId);
                if (!item) return;
                const val = Math.min(item.quantity, (parseInt(this.elQtyInput.value) || 1) + 1);
                this.elQtyInput.value = val;
            };
        }

        if (this.btnQtyMax) {
            this.btnQtyMax.onclick = () => {
                const item = state.player.inventory.allItems.find(i => i.id === state.selectedItemId);
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

        if (this.btnToggleEquip) {
            this.btnToggleEquip.onclick = () => {
                if (this.elEquipmentContainer) {
                    this.elEquipmentContainer.classList.toggle('hidden');
                }
            };
        }
    }

    render() {
        if (!state.player) return;

        this.renderBagTabs();
        this.renderGrid();
        this.renderEquipmentSlots();
        this.updateDetailQuantity();
    }

    updateDetailQuantity() {
        if (!state.selectedItemId || !this.elItemDetail || this.elItemDetail.classList.contains('hidden')) return;

        const item = state.player.inventory.allItems.find(i => i.id === state.selectedItemId);
        if (item && this.elQtyMaxText) {
            this.elQtyMaxText.textContent = `Tối đa: ${item.quantity}`;
            
            // Ensure input doesn't exceed current quantity
            const currentVal = parseInt(this.elQtyInput.value) || 1;
            if (currentVal > item.quantity) {
                this.elQtyInput.value = Math.max(1, item.quantity);
            }
        }
    }

    renderBagTabs() {
        if (!this.elBagTabs) return;
        this.elBagTabs.innerHTML = '';

        state.player.inventory.bags.forEach((bag, index) => {
            const isActive = state.player.inventory.currentBagIndex === index;
            const container = document.createElement('div');
            container.className = 'relative flex-shrink-0';

            const btn = document.createElement('button');
            btn.className = `px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all whitespace-nowrap ${isActive ? 'bg-qi-blue/10 text-qi-blue border-qi-blue/40 shadow-[0_0_15px_rgba(0,186,255,0.1)]' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'}`;
            btn.innerHTML = `<i class="ph ph-bag mr-1"></i> ${bag.name}`;
            btn.onclick = () => {
                state.player.inventory.currentBagIndex = index;
                state.player.inventory.currentPage = 0;
                this.render();
            };

            // Add rename button for active bag
            if (isActive) {
                const renameBtn = document.createElement('button');
                renameBtn.className = 'absolute -top-1.5 -right-1 w-3.5 h-3.5 bg-cultivation-gold text-black rounded-full flex items-center justify-center text-[7px] border border-black shadow-lg z-10';
                renameBtn.innerHTML = '<i class="ph ph-pencil-simple"></i>';
                renameBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.promptRenameBag(index);
                };
                container.appendChild(renameBtn);
            }

            container.appendChild(btn);
            this.elBagTabs.appendChild(container);
        });
    }

    promptRenameBag(index) {
        const bag = state.player.inventory.bags[index];
        if (!bag) return;

        state.ui.prompt(
            `Đổi tên cho ${bag.name}:`,
            (newName) => {
                if (newName && newName.trim()) {
                    state.player.inventory.renameBag(index, newName);
                    state.ui.toast("Đã đổi tên túi!", "success");
                    this.render();
                }
            },
            bag.name
        );
    }

    renderGrid() {
        if (!this.elInventoryGrid) return;
        this.elInventoryGrid.innerHTML = '';

        const bag = state.player.inventory.currentBag;
        const itemsPerPage = state.player.inventory.itemsPerPage;
        const currentPage = state.player.inventory.currentPage;

        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = bag.items.slice(start, end);

        if (this.elInventoryCapacity) {
            const weight = state.player.inventory.getTotalWeight().toFixed(2);
            this.elInventoryCapacity.textContent = `${bag.items.length}/${bag.slots} | ${weight}kg`;
        }

        paginatedItems.forEach(item => {
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

        // Fill empty slots if needed
        const currentItemsCount = paginatedItems.length;
        if (currentItemsCount < itemsPerPage) {
            for (let i = 0; i < itemsPerPage - currentItemsCount; i++) {
                const el = document.createElement('div');
                el.className = 'p-2 border border-white/5 rounded-lg bg-black/10 flex items-center justify-center opacity-20';
                el.innerHTML = '<div class="w-8 h-8"></div>';
                this.elInventoryGrid.appendChild(el);
            }
        }

        // Pagination UI
        if (this.elPageText) {
            const maxPage = Math.max(1, Math.ceil(bag.items.length / itemsPerPage));
            this.elPageText.textContent = `${currentPage + 1} / ${maxPage}`;
            if (this.btnPrev) this.btnPrev.disabled = currentPage === 0;
            if (this.btnNext) this.btnNext.disabled = currentPage >= maxPage - 1;
        }
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

        const playerItem = state.player.inventory.allItems.find(i => i.id === id);
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
            'consumable': 'Linh Đan / Thánh Quả',
            'book': 'Công Pháp / Thần Thông',
            'weapon': 'Pháp Bảo / Thần Binh',
            'armor': 'Pháp Y / Bảo Giáp',
            'accessory': 'Linh Sức / Trang Sức',
            'treasure': 'Thiên Tài Địa Bảo',
            'formation': 'Trận Đồ',
            'puppet': 'Cơ Quan / Khôi Lỗi',
            'attackArtifact': 'Pháp Bảo Chủ Chiến',
            'defenseArtifact': 'Pháp Bảo Hộ Thân',
            'flightArtifact': 'Phi Hành Pháp Bảo',
            'spaceArtifact': 'Càn Khôn Pháp Bảo',
            'formationArtifact': 'Trận Đạo Pháp Bảo',
            'supportArtifact': 'Phụ Trợ Pháp Bảo',
            'soulArtifact': 'Hồn Đạo Pháp Bảo',
            'material': 'Linh Vật / Tài Nguyên',
            'seed': 'Linh Chủng'
        };

        const qualitySuffix = (displayQuality.toLowerCase().includes('khí') || displayQuality.toLowerCase().includes('bảo') || displayQuality.toLowerCase().includes('phẩm') || ['Hoàn Mỹ', 'Tiên Khí', 'Linh Bảo', 'Danh Khí'].includes(displayQuality)) ? '' : ' Phẩm';
        this.elDetailType.textContent = `${displayQuality}${qualitySuffix} | ${typeNames[itemData.type] || itemData.type}`;

        // Bag Transfer UI
        if (this.elTransferContainer && this.elTransferBags) {
            const isFromInventory = !fromShop && !fromSell;
            this.elTransferContainer.classList.toggle('hidden', !isFromInventory || state.player.inventory.bags.length <= 1);

            if (isFromInventory && state.player.inventory.bags.length > 1) {
                this.elTransferBags.innerHTML = '';
                const currentBagIndex = state.player.inventory.currentBagIndex;
                const itemIndexInBag = state.player.inventory.bags[currentBagIndex].items.findIndex(i => i.id === id);

                state.player.inventory.bags.forEach((bag, idx) => {
                    if (idx === currentBagIndex) return;

                    const btn = document.createElement('button');
                    btn.className = 'px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] text-gray-400 hover:bg-qi-blue/10 hover:text-qi-blue transition-all active:scale-95';
                    btn.textContent = `Tới: ${bag.name}`;
                    btn.onclick = () => {
                        const res = state.player.inventory.transferItem(currentBagIndex, itemIndexInBag, idx);
                        state.ui.toast(res.msg, res.success ? 'success' : 'error');
                        if (res.success) {
                            state.ui.toggleOverlay(this.elItemDetail, false);
                            this.render();
                        }
                    };
                    this.elTransferBags.appendChild(btn);
                });
            }
        }

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
        if (isArtifact && playerItem) {
            const meta = playerItem.metadata || {};
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

        this.elDetailDesc.innerHTML = this.linkifyDescription(desc, id);
        if (this.elDetailStats) this.elDetailStats.innerHTML = '';

        // Show stats for all equippable items
        if (itemData.stats && this.elDetailStats) {
            Object.entries(itemData.stats).forEach(([key, val]) => {
                const statEl = document.createElement('div');
                statEl.className = 'flex justify-between items-center text-[10px] text-gray-400 border-b border-white/5 py-1';
                statEl.innerHTML = `<span>${this.getStatLabel(key)}</span><span class="text-qi-blue font-mono">+${val}</span>`;
                this.elDetailStats.appendChild(statEl);
            });
        }

        // Show/Hide Quantity Container
        const isStackable = ['spirit_stone', 'consumable', 'material', 'seed'].includes(itemData.type);
        if (this.elQtyContainer) {
            this.elQtyContainer.classList.toggle('hidden', !isStackable || fromShop);
            if (isStackable && playerItem && !fromShop) {
                this.elQtyInput.value = 1;
                this.updateDetailQuantity();
            }
        }

        if (fromShop || fromSell) {
            this.btnUseItem.classList.add('hidden');
            this.btnEquipItem.classList.add('hidden');
            if (this.btnBuyItem) this.btnBuyItem.classList.toggle('hidden', !fromShop);
            if (this.btnSellItem) this.btnSellItem.classList.toggle('hidden', !fromSell);

            if (fromSell && isStackable) {
                this.elQtyContainer.classList.remove('hidden');
                if (playerItem) {
                    this.elQtyInput.value = 1;
                    this.updateDetailQuantity();
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

        this.btnUseItem.classList.toggle('hidden', !(['consumable', 'book', 'spirit_stone', 'beast_egg'].includes(itemData.type)) || (fromShop && !isManual));
        if (this.btnCrushStone) this.btnCrushStone.classList.toggle('hidden', !isSpiritStone || fromShop || fromSell);

        if (isSpiritStone) {
            this.btnUseItem.textContent = 'LUYỆN HÓA';
        } else {
            this.btnUseItem.textContent = isManual ? 'XEM' : (itemData.type === 'book' ? 'LĨNH NGỘ' : (itemData.type === 'beast_egg' ? 'ẤP TRỨNG' : 'SỬ DỤNG'));
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
        this.renderConnections(id);
        this.render();
    }

    renderConnections(itemId) {
        if (!this.elDetailConnections || !this.elConnectionsList) return;

        const connections = getItemConnections(itemId);
        this.elConnectionsList.innerHTML = '';

        const allConnections = [];

        if (connections.produces) allConnections.push({ id: connections.produces, label: 'Thu hoạch ra', icon: '🌿' });
        if (connections.harvestedFrom) allConnections.push({ id: connections.harvestedFrom, label: 'Gieo trồng từ', icon: '🌱' });
        if (connections.recipeFor) allConnections.push({ id: connections.recipeFor, label: 'Luyện chế ra', icon: '📜' });

        connections.ingredients.forEach(ing => {
            allConnections.push({ id: ing.id, label: `Nguyên Liệu x${ing.quantity}`, icon: '🧪' });
        });

        connections.asMaterialIn.forEach(prod => {
            allConnections.push({ id: prod.id, name: prod.name, label: 'Luyện Chế', icon: '⚗️' });
        });

        if (connections.unlocksProfession) {
            const professionNames = {
                alchemy: 'Luyện Dược Sư',
                smithing: 'Luyện Khí Sư',
                talisman: 'Phù Sư',
                formation: 'Trận Pháp Sư',
                puppet: 'Khôi Lỗi Sư',
                corpse: 'Luyện Thi Sư',
                beast: 'Ngự Thú Sư',
                insect: 'Khu Trùng Sư'
            };
            const profName = professionNames[connections.unlocksProfession] || connections.unlocksProfession.toUpperCase();
            allConnections.push({ label: 'Truyền Thừa Đạo Nghiệp', icon: '📜', info: profName });
        }

        if (connections.teaches) {
            const tech = getTechniqueById(connections.teaches) || getSecretTechniqueById(connections.teaches);
            const techName = tech ? tech.name : connections.teaches;
            allConnections.push({ label: 'Lĩnh Ngộ Thần Thông', icon: '📖', info: techName });
        }

        if (connections.hatchesTo) {
            const beast = BEASTS[connections.hatchesTo];
            const beastName = beast ? beast.name : connections.hatchesTo;
            allConnections.push({ label: 'Ấp Nở Ra', icon: '🥚', info: beastName });
        }

        if (allConnections.length > 0) {
            this.elDetailConnections.classList.remove('hidden');
            allConnections.forEach(conn => {
                const connItem = conn.id ? getItemById(conn.id) : null;
                const btn = document.createElement('button');
                const qClass = connItem ? this.getQualityClass(connItem.quality) : 'gray-500';
                btn.className = `flex items-center space-x-2 p-1.5 bg-white/5 border border-white/10 rounded-xl hover:bg-qi-blue/10 transition-all active:scale-95 group border-b-2 border-b-${qClass}/30`;

                const name = connItem ? connItem.name : (conn.name || conn.info);
                const iconHtml = connItem ? (connItem.image ? `<img src="${getAssetUrl(connItem.image)}" class="w-4 h-4 object-contain">` : (connItem.icon || conn.icon)) : conn.icon;

                btn.innerHTML = `
                    <div class="text-sm">${iconHtml}</div>
                    <div class="flex flex-col items-start">
                        <span class="text-[7px] text-gray-500 uppercase tracking-tighter">${conn.label}</span>
                        <span class="text-[9px] font-bold text-white group-hover:text-qi-blue transition-colors">${name}</span>
                    </div>
                `;

                if (connItem) {
                    btn.onclick = (e) => {
                        e.stopPropagation();
                        this.selectItem(conn.id, false, false);
                    };
                } else {
                    btn.classList.add('cursor-default');
                }
                this.elConnectionsList.appendChild(btn);
            });
        } else {
            this.elDetailConnections.classList.add('hidden');
        }
    }

    getStatLabel(statKey) {
        const map = {
            atk: 'Công', def: 'Thủ', spd: 'Tốc', maxHp: 'Sinh lực', maxMana: 'Pháp lực', mana: 'Pháp lực',
            luck: 'Khí vận', critChance: 'Tỉ lệ bạo kích', critDamage: 'Sát thương bạo kích', karma: 'Nhân quả',
            lifespan: 'Thọ nguyên', life_span: 'Thọ nguyên', qiAbsorb: 'Hấp thụ Linh khí', qi_absorb: 'Hấp thụ Linh khí',
            alchemyBonus: 'Tỉ lệ Luyện đan', alchemy_success: 'Tỉ lệ Luyện đan', smithingBonus: 'Tỉ lệ Luyện khí',
            smithing_success: 'Tỉ lệ Luyện khí', tu_vi_speed: 'Tốc độ Tu luyện', tuViSpeed: 'Tốc độ Tu luyện',
            spirit: 'Thần thức', slots: 'Ô chứa đồ', breakthroughRate: 'Tỉ lệ Đột phá', breakthrough_rate: 'Tỉ lệ Đột phá'
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
    }

    getQualityClass(quality) {
        const map = {
            'Phàm Khí': 'pham-khi', 'Pháp Khí': 'phap-khi', 'Linh Khí': 'linh-khi', 'Pháp Bảo': 'phap-bao',
            'Cổ Bảo': 'co-bao', 'Linh Bảo': 'linh-bao', 'Thông Thiên Linh Bảo': 'thong-thien', 'Tiên Khí': 'tien-khi', 'Danh Khí': 'danh-khi',
            'Hạ phẩm': 'pham', 'Trung phẩm': 'hoang', 'Thượng phẩm': 'huyen', 'Cực phẩm': 'dia', 'Hoàn Mỹ': 'thien'
        };
        return map[quality] || 'pham';
    }

    linkifyDescription(text, currentItemId) {
        if (!text) return '';
        let result = text;
        const replacements = [];
        const manualLinkRegex = /\[\[(.*?)(?:\|(.*?))?\]\]/g;
        result = result.replace(manualLinkRegex, (match, id, name) => {
            const item = ITEMS[id];
            if (!item) return name || id;
            const placeholder = `[[MANUAL_LINK_${replacements.length}]]`;
            replacements.push({ placeholder, item, displayName: name || item.name });
            return placeholder;
        });

        const allItems = Object.values(ITEMS).filter(item => item.name && item.name.length > 2).sort((a, b) => b.name.length - a.name.length);
        allItems.forEach((item, index) => {
            if (item.id === currentItemId) return;
            const name = item.name;
            if (result.includes(name)) {
                const placeholder = `[[AUTO_LINK_${index}]]`;
                const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escapedName, 'g');
                let replaced = false;
                result = result.replace(regex, (match) => { replaced = true; return placeholder; });
                if (replaced) replacements.push({ placeholder, item, displayName: name });
            }
        });

        replacements.forEach(rep => {
            const qClass = this.getQualityClass(rep.item.quality);
            const linkHtml = `<span class="item-link quality-${qClass} text-[10px] px-1.5 py-0.5 bg-white/5 rounded border border-white/10 cursor-pointer hover:text-qi-blue hover:border-qi-blue transition-all inline-block align-middle mx-0.5 mb-1" onclick="game.screens.inventory.selectItem('${rep.item.id}', true)">${rep.displayName}</span>`;
            result = result.split(rep.placeholder).join(linkHtml);
        });
        return result;
    }
}
