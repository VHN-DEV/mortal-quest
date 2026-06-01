import { getItemById } from '../configs/item-data.js';
import { state } from '../state.js';

export class Inventory {
    constructor(player) {
        this.player = player;
        this.bags = [
            {
                id: 'basic_bag',
                name: 'Túi Vải',
                slots: 20,
                items: [],
                type: 'basic'
            }
        ];
        this.currentBagIndex = 0;
        this.currentPage = 0;
        this.itemsPerPage = 20;
    }

    get currentBag() {
        return this.bags[this.currentBagIndex];
    }

    get allItems() {
        return this.bags.flatMap(bag => bag.items);
    }

    get totalSlots() {
        return this.bags.reduce((total, bag) => total + bag.slots, 0);
    }

    get isFull() {
        return this.bags.every(bag => bag.items.length >= bag.slots);
    }

    addItem(itemId, quantity = 1, metadata = {}) {
        // 1. Tìm xem có stack cũ không (trong tất cả các túi)
        for (const bag of this.bags) {
            const existing = bag.items.find(i => i.id === itemId && this.compareMetadata(i.metadata, metadata));
            if (existing) {
                existing.quantity += quantity;
                return true;
            }
        }

        // 2. Nếu không có stack, tìm túi còn chỗ trống
        for (const bag of this.bags) {
            if (bag.items.length < bag.slots) {
                bag.items.push({ id: itemId, quantity, metadata });
                return true;
            }
        }

        return false; // Hết chỗ chứa trong tất cả các túi
    }

    compareMetadata(m1, m2) {
        if (!m1 && !m2) return true;
        if (!m1 || !m2) return false;
        return JSON.stringify(m1) === JSON.stringify(m2);
    }

    removeItem(itemId, quantity = 1) {
        for (const bag of this.bags) {
            const index = bag.items.findIndex(i => i.id === itemId);
            if (index > -1) {
                bag.items[index].quantity -= quantity;
                if (bag.items[index].quantity <= 0) {
                    bag.items.splice(index, 1);
                }
                return true;
            }
        }
        return false;
    }

    hasItem(itemId, quantity = 1) {
        const item = this.allItems.find(i => i.id === itemId);
        return item && item.quantity >= quantity;
    }

    getItemQuantity(itemId) {
        const item = this.allItems.find(i => i.id === itemId);
        return item ? item.quantity : 0;
    }

    useItem(itemId, quantity = 1) {
        const itemData = getItemById(itemId);
        if (!itemData) return false;

        const allItems = this.allItems;
        const itemInInv = allItems.find(i => i.id === itemId);
        if (!itemInInv || itemInInv.quantity < quantity) return false;

        if (itemData.type === 'consumable' && itemData.effect) {
            const isPill = itemId.endsWith('_dan') || (itemData.name && itemData.name.includes('Đan'));
            if (isPill) {
                // Daily Pill Absorption Limit Check
                const currentDay = state.systems?.time ? state.systems.time.totalDays : 0;
                if (!this.player.dailyPillStats || this.player.dailyPillStats.day !== currentDay) {
                    this.player.dailyPillStats = { day: currentDay, count: 0 };
                }

                const realmId = this.player.realmId || 1;
                let dailyLimit = 5;
                if (realmId <= 13) dailyLimit = 5;       // Luyện Khí
                else if (realmId <= 17) dailyLimit = 7;  // Trúc Cơ
                else if (realmId <= 21) dailyLimit = 10; // Kết Đan
                else if (realmId <= 25) dailyLimit = 12; // Nguyên Anh
                else if (realmId <= 29) dailyLimit = 15; // Hóa Thần
                else dailyLimit = 20;                     // Higher

                if (this.player.dailyPillStats.count + quantity > dailyLimit) {
                    if (typeof state !== 'undefined' && state.ui && state.ui.toast) {
                        state.ui.toast(`Kinh mạch hôm nay đã đạt giới hạn hấp thu (${this.player.dailyPillStats.count}/${dailyLimit} viên). Không thể hấp thu thêm!`, "warning");
                    }
                    return false;
                }

                // Process consumption one by one
                let totalToxicityAdded = 0;
                for (let k = 0; k < quantity; k++) {
                    const metadata = itemInInv.metadata || {};
                    const danVeins = metadata.danVeins || 0;
                    
                    // Determine base toxicity (perfect pills have 0 toxicity)
                    let pillToxicity = 0;
                    if (danVeins < 9) {
                        const basePoison = metadata.poison !== undefined ? metadata.poison : (itemData.stats?.poison || 15);
                        pillToxicity = Math.max(0, basePoison - danVeins);
                    }

                    // Count Resistance
                    if (!this.player.pillResistance) {
                        this.player.pillResistance = {};
                    }
                    const count = this.player.pillResistance[itemId] || 0;

                    // Perfect Veins Resistance Bypass:
                    // danVeins >= 12 (Tiên Phẩm) ignores 3 levels of resistance
                    // danVeins >= 9 (Hoàn Mỹ) ignores 2 levels of resistance
                    // danVeins >= 6 (Cực Phẩm) ignores 1 level of resistance
                    let bypass = 0;
                    if (danVeins >= 12) bypass = 3;
                    else if (danVeins >= 9) bypass = 2;
                    else if (danVeins >= 6) bypass = 1;

                    const effectiveCount = Math.max(0, count - bypass);

                    // Diminishing Returns Effectiveness Multiplier
                    let resistanceMult = 1.0;
                    if (effectiveCount === 0) resistanceMult = 1.0;
                    else if (effectiveCount === 1) resistanceMult = 0.7;
                    else if (effectiveCount === 2) resistanceMult = 0.3;
                    else resistanceMult = 0.1;

                    // Realm-difference Decay Penalty (50% effectiveness decay per tier difference)
                    // We can map common pill IDs to their tier levels:
                    let pillTier = 1; // Default to Tier 1 (Luyện Khí)
                    if (itemId === 'truc_co_dan' || itemId.includes('truc_co')) pillTier = 2;
                    else if (itemId === 'ket_dan_dan' || itemId.includes('ket_dan')) pillTier = 3;
                    else if (itemId === 'nguyen_anh_dan' || itemId.includes('nguyen_anh')) pillTier = 4;
                    else if (itemId === 'hoa_than_dan' || itemId.includes('hoa_than')) pillTier = 5;

                    // Player Tier calculation
                    let playerTier = 1;
                    if (realmId <= 13) playerTier = 1;       // Luyện Khí
                    else if (realmId <= 17) playerTier = 2;  // Trúc Cơ
                    else if (realmId <= 21) playerTier = 3;  // Kết Đan
                    else if (realmId <= 25) playerTier = 4;  // Nguyên Anh
                    else playerTier = 5;                     // Hóa Thần / Higher

                    let tierMult = 1.0;
                    if (playerTier > pillTier) {
                        tierMult = Math.pow(0.5, playerTier - pillTier);
                    }

                    // Combined Multiplier
                    const finalMult = resistanceMult * tierMult;

                    // Apply the effect
                    this.applyEffect(itemData.effect, finalMult);

                    // Update player toxicity, resistance history and daily count
                    this.player.danPoison = Math.min(100, (this.player.danPoison || 0) + pillToxicity);
                    this.player.pillResistance[itemId] = count + 1;
                    this.player.dailyPillStats.count += 1;
                    totalToxicityAdded += pillToxicity;
                }

                // Show detailed feedback toast
                if (typeof state !== 'undefined' && state.ui && state.ui.toast) {
                    let msg = `Đã phục dụng ${quantity} viên ${itemData.name}.`;
                    if (totalToxicityAdded > 0) {
                        msg += ` Tích tụ thêm +${totalToxicityAdded} Đan độc.`;
                    } else {
                        msg += ` Đan văn Hoàn Mỹ giúp miễn trừ toàn bộ Đan độc!`;
                    }
                    state.ui.toast(msg, "success");
                }

                this.removeItem(itemId, quantity);
                
                // Trigger stats recalculation to apply any new toxicity speeds
                this.player.calculateStats();
                return true;
            } else {
                // Not a pill: execute standard consumable effect
                for (let i = 0; i < quantity; i++) {
                    this.applyEffect(itemData.effect);
                }
                this.removeItem(itemId, quantity);
                return true;
            }
        } else if (itemData.type === 'book' && itemData.techniqueId) {
            const res = this.player.startComprehendingTechnique(itemData.techniqueId, false);
            if (res.success) {
                this.removeItem(itemId, 1);
                state.ui.toast(res.msg, 'success');
                return true;
            } else {
                state.ui.toast(res.msg, 'warning');
                return false;
            }
        } else if (itemData.type === 'book' && itemData.secretId) {
            const res = this.player.startComprehendingTechnique(itemData.secretId, true);
            if (res.success) {
                this.removeItem(itemId, 1);
                state.ui.toast(res.msg, 'success');
                return true;
            } else {
                state.ui.toast(res.msg, 'warning');
                return false;
            }
        } else if (itemData.effect && (itemData.type === 'book' || itemData.type === 'recipe' || itemData.type === 'talisman_recipe')) {
            for (let i = 0; i < quantity; i++) {
                this.applyEffect(itemData.effect);
            }
            this.removeItem(itemId, quantity);
            return true;
        } else if (itemData.type === 'spirit_stone') {
            const ss = state.systems.spiritStone;
            if (ss) {
                const res = ss.absorb(itemId, quantity);
                return res.success;
            }
        } else if (itemData.action === 'expand_inventory') {
            const slotsToAdd = itemData.stats?.slots || 10;
            this.addBag(itemData.name, slotsToAdd, itemData.id);
            this.removeItem(itemId, 1);
            state.ui.toast(`Đã thêm túi mới: ${itemData.name} (+${slotsToAdd} ô)`, "success");
            return true;
        } else if (itemData.action) {
            if (itemData.action === 'open_di_hoa_bang') {
                if (window.game && window.game.screens.diHoaBang) {
                    window.game.screens.diHoaBang.open();
                    return true;
                }
            } else if (itemData.action === 'open_di_loi_bang') {
                if (window.game && window.game.screens.diLoiBang) {
                    window.game.screens.diLoiBang.open();
                    return true;
                }
            } else if (itemData.action === 'open_linh_the_luc') {
                if (window.game && window.game.screens.linhTheLuc) {
                    window.game.screens.linhTheLuc.open();
                    return true;
                }
            } else if (itemData.action === 'open_phap_bao_luc') {
                if (window.game && window.game.screens.phapBaoLuc) {
                    window.game.screens.phapBaoLuc.open();
                    return true;
                }
            } else if (itemData.action === 'open_ky_trung_bang') {
                if (window.game && window.game.screens.kyTrungBang) {
                    window.game.screens.kyTrungBang.open();
                    return true;
                }
            } else if (itemData.action === 'open_van_toc_thong_giam') {
                if (window.game && window.game.screens.chungTocLuc) {
                    window.game.screens.chungTocLuc.open();
                    return true;
                }
            } else if (itemData.action === 'combine_ngu_cuc_son') {
                const pieces = ['nguyen_tu_cuc_son', 'bac_cuc_nguyen_quang_cuc_son', 'hao_am_han_phach_cuc_son', 'thai_at_thanh_quang_cuc_son', 'am_duong_dai_ngu_hanh_cuc_son'];
                const hasAll = pieces.every(id => this.hasItem(id, 1));
                if (hasAll) {
                    pieces.forEach(id => this.removeItem(id, 1));
                    this.addItem('nguyen_hop_ngu_cuc_son', 1);
                    state.ui.alert("Ngũ hành quy nguyên, âm dương giao thái! Ngươi đã thành công hợp nhất 5 ngọn Cực Sơn thành Nguyên Hợp Ngũ Cực Sơn!", "Hợp Nhất Thành Công");
                    return true;
                } else {
                    state.ui.toast("Cần đủ 5 ngọn núi Cực Sơn khác nhau mới có thể hợp nhất!", "error");
                    return false;
                }
            } else if (itemData.action === 'separate_ngu_cuc_son') {
                const pieces = ['nguyen_tu_cuc_son', 'bac_cuc_nguyen_quang_cuc_son', 'hao_am_han_phach_cuc_son', 'thai_at_thanh_quang_cuc_son', 'am_duong_dai_ngu_hanh_cuc_son'];
                this.removeItem('nguyen_hop_ngu_cuc_son', 1);
                pieces.forEach(id => this.addItem(id, 1));
                state.ui.toast("Đã phân tách Nguyên Hợp Ngũ Cực Sơn thành 5 ngọn núi đơn lẻ.", "success");
                return true;
            }
        } else if (itemData.type === 'beast_egg') {
            if (state.systems.beast) {
                const res = state.systems.beast.hatch(itemId);
                if (res.success) {
                    state.ui.toast(res.msg, "success");
                    return true;
                } else {
                    state.ui.toast(res.msg, "error");
                    return false;
                }
            }
        }
        return false;
    }

    addBag(name, slots, id = 'new_bag') {
        this.bags.push({
            id,
            name,
            slots,
            items: [],
            type: 'expand'
        });
    }

    upgradeBag(index, extraSlots) {
        if (this.bags[index]) {
            this.bags[index].slots += extraSlots;
            return true;
        }
        return false;
    }

    transferItem(fromBagIndex, itemIndex, toBagIndex) {
        const fromBag = this.bags[fromBagIndex];
        const toBag = this.bags[toBagIndex];

        if (!fromBag || !toBag || fromBagIndex === toBagIndex) return { success: false, msg: "Không thể chuyển vào cùng một túi!" };
        
        const item = fromBag.items[itemIndex];
        if (!item) return { success: false, msg: "Vật phẩm không tồn tại!" };

        // Check if stackable in target bag
        const existing = toBag.items.find(i => i.id === item.id && this.compareMetadata(i.metadata, item.metadata));
        if (existing) {
            existing.quantity += item.quantity;
            fromBag.items.splice(itemIndex, 1);
            return { success: true, msg: "Đã chuyển và gộp vật phẩm!" };
        }

        // If not stackable, check if target bag has space
        if (toBag.items.length < toBag.slots) {
            toBag.items.push(item);
            fromBag.items.splice(itemIndex, 1);
            return { success: true, msg: "Đã chuyển vật phẩm!" };
        }

        return { success: false, msg: "Túi mục tiêu đã đầy!" };
    }

    renameBag(index, newName) {
        if (this.bags[index] && newName.trim()) {
            this.bags[index].name = newName.trim();
            return true;
        }
        return false;
    }

    getTotalWeight() {
        let total = 0;
        this.allItems.forEach(i => {
            const data = getItemById(i.id);
            if (data && data.weight) {
                total += data.weight * i.quantity;
            }
        });
        return total;
    }

    applyEffect(effect, multiplier = 1.0) {
        if (effect.type === 'tu_vi') {
            this.player.tuVi += Math.round(effect.value * multiplier);
        } else if (effect.type === 'heal') {
            const healAmount = Math.floor(this.player.maxHp * effect.value * multiplier);
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
        } else if (effect.type === 'lifespan' || effect.type === 'max_age') {
            const addedVal = Math.round(effect.value * multiplier);
            this.player.permanentLifespanBonus = (this.player.permanentLifespanBonus || 0) + addedVal;
            this.player.calculateStats();
            state.ui.toast(`Thọ nguyên tăng thêm ${addedVal} năm!`, "success");
        } else if (effect.type === 'mana') {
            const manaAmount = Math.floor(this.player.maxMana * effect.value * multiplier);
            this.player.mana = Math.min(this.player.maxMana, this.player.mana + manaAmount);
        } else if (effect.type === 'learn_technique') {
            this.player.learnTechnique(effect.value);
        } else if (effect.type === 'learn_secret') {
            this.player.learnSecretTechnique(effect.value);
        } else if (effect.type === 'qi_absorb') {
            const es = window.energySystem || (this.player.energySystem);
            if (es) {
                es.absorbQi(effect.qiType, effect.amount * multiplier, effect.purity || 'TINH_THUAN');
            }
        } else if (effect.type === 'restore') {
            if (effect.hp) {
                this.player.hp = Math.min(this.player.maxHp, this.player.hp + Math.round(effect.hp * multiplier));
            }
            if (effect.mana) {
                this.player.mana = Math.min(this.player.maxMana, this.player.mana + Math.round(effect.mana * multiplier));
            }
            if (effect.stamina) {
                this.player.stamina = Math.min(this.player.maxStamina, this.player.stamina + Math.round(effect.stamina * multiplier));
            }
        } else if (effect.type === 'learn_recipe') {
            if (!this.player.knownRecipes.includes(effect.value)) {
                this.player.knownRecipes.push(effect.value);
            }
        } else if (effect.type === 'learn_smithing_recipe') {
            if (!this.player.knownSmithingRecipes.includes(effect.value)) {
                this.player.knownSmithingRecipes.push(effect.value);
            }
        } else if (effect.type === 'learn_talisman_recipe') {
            if (!this.player.knownTalismanRecipes.includes(effect.value)) {
                this.player.knownTalismanRecipes.push(effect.value);
            }
        } else if (effect.type === 'learn_puppet_recipe') {
            if (!this.player.knownPuppetRecipes.includes(effect.value)) {
                this.player.knownPuppetRecipes.push(effect.value);
            }
        } else if (effect.type === 'learn_corpse_recipe') {
            if (!this.player.knownCorpseRecipes.includes(effect.value)) {
                this.player.knownCorpseRecipes.push(effect.value);
            }
        } else if (effect.type === 'learn_formation') {
            if (!this.player.knownFormations.includes(effect.value)) {
                this.player.knownFormations.push(effect.value);
            }
        } else if (effect.type === 'learn_multiple_recipes') {
            if (Array.isArray(effect.value)) {
                effect.value.forEach(subEffect => this.applyEffect(subEffect, multiplier));
            }
        } else if (effect.type === 'refine_flame') {
            if (!this.player.ownedFlames.includes(effect.value)) {
                this.player.ownedFlames.push(effect.value);
                this.player.currentFlame = effect.value;
            }
        } else if (effect.type === 'equip_cauldron') {
            if (!this.player.ownedCauldrons.includes(effect.value)) {
                this.player.ownedCauldrons.push(effect.value);
                this.player.currentCauldron = effect.value;
            }
        } else if (effect.type === 'buff') {
            this.player.addBuff({
                id: effect.id || 'temp_buff',
                stat: effect.stat,
                value: effect.value * multiplier,
                duration: (effect.duration || 3600) * 1000
            });
        } else if (effect.type === 'unlock_profession') {
            if (this.player.unlockProfession(effect.profession)) {
                state.ui.toast(`Chúc mừng! Ngươi đã lĩnh hội bí pháp và mở khóa nghề ${effect.profession === 'alchemy' ? 'Luyện Đan' :
                    effect.profession === 'talisman' ? 'Phù Lục' :
                        effect.profession === 'smithing' ? 'Luyện Khí' :
                            effect.profession === 'formation' ? 'Trận Pháp' :
                                effect.profession === 'puppet' ? 'Khôi Lỗi' :
                                    effect.profession === 'corpse' ? 'Luyện Thi' :
                                        effect.profession === 'beast' ? 'Ngự Thú' :
                                            effect.profession === 'insect' ? 'Khu Trùng' : effect.profession}!`, "success");
            } else {
                state.ui.toast("Ngươi đã lĩnh hội bí pháp này từ trước rồi.", "info");
            }
        }
    }

    sortItems() {
        const qualityMap = {
            'Phàm Khí': 1, 'Pháp Khí': 2, 'Linh Khí': 3, 'Pháp Bảo': 4, 'Cổ Bảo': 5, 'Linh Bảo': 6, 'Thông Thiên Linh Bảo': 7, 'Tiên Khí': 8, 'Danh Khí': 9
        };

        this.bags.forEach(bag => {
            bag.items.sort((a, b) => {
                const itemA = getItemById(a.id);
                const itemB = getItemById(b.id);
                if (!itemA || !itemB) return 0;
                if (itemA.type !== itemB.type) return itemA.type.localeCompare(itemB.type);
                const qA = qualityMap[itemA.quality] || 0;
                const qB = qualityMap[itemB.quality] || 0;
                if (qA !== qB) return qB - qA;
                return itemA.name.localeCompare(itemB.name);
            });
        });
    }

    load(data) {
        if (Array.isArray(data)) {
            this.bags[0].items = data;
        } else if (data && data.bags) {
            this.bags = data.bags;
            this.currentBagIndex = data.currentBagIndex || 0;
        } else if (data && data.items) {
            this.bags[0].items = data.items;
            this.bags[0].slots = data.maxSlots || 20;
        }
    }

    save() {
        return {
            bags: this.bags,
            currentBagIndex: this.currentBagIndex
        };
    }
}

