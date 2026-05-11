import { getItemById } from '../configs/item-data.js';
import { state } from '../state.js';

export class Inventory {
    constructor(player) {
        this.player = player;
        this.items = []; // Array of { id, quantity }
        this.maxSlots = 20;
    }

    addItem(itemId, quantity = 1, metadata = {}) {
        const existing = this.items.find(i => i.id === itemId && this.compareMetadata(i.metadata, metadata));
        if (existing) {
            existing.quantity += quantity;
            return true;
        } else {
            if (this.items.length >= this.maxSlots) {
                return false; // Inventory full
            }
            this.items.push({ id: itemId, quantity, metadata });
            return true;
        }
    }

    compareMetadata(m1, m2) {
        if (!m1 && !m2) return true;
        if (!m1 || !m2) return false;
        return JSON.stringify(m1) === JSON.stringify(m2);
    }

    removeItem(itemId, quantity = 1) {
        const index = this.items.findIndex(i => i.id === itemId);
        if (index > -1) {
            this.items[index].quantity -= quantity;
            if (this.items[index].quantity <= 0) {
                this.items.splice(index, 1);
            }
            return true;
        }
        return false;
    }

    hasItem(itemId, quantity = 1) {
        const item = this.items.find(i => i.id === itemId);
        return item && item.quantity >= quantity;
    }

    useItem(itemId, quantity = 1) {
        const itemData = getItemById(itemId);
        if (!itemData) return false;

        const index = this.items.findIndex(i => i.id === itemId);
        if (index === -1 || this.items[index].quantity < quantity) return false;

        if (itemData.type === 'consumable' && itemData.effect) {
            for (let i = 0; i < quantity; i++) {
                this.applyEffect(itemData.effect);
            }
            this.removeItem(itemId, quantity);
            return true;
        } else if (itemData.type === 'book' && itemData.techniqueId) {
            // Sách thì thường dùng từng cuốn một
            if (this.player.learnTechnique(itemData.techniqueId)) {
                this.removeItem(itemId, 1);
                return true;
            }
        } else if (itemData.type === 'spirit_stone') {
            const ss = state.systems.spiritStone;
            if (ss) {
                const res = ss.absorb(itemId, quantity);
                return res.success;
            }
        }
        return false;
    }

    getTotalWeight() {
        let total = 0;
        this.items.forEach(i => {
            const data = getItemById(i.id);
            if (data && data.weight) {
                total += data.weight * i.quantity;
            }
        });
        return total;
    }

    applyEffect(effect) {
        if (effect.type === 'tu_vi') {
            this.player.tuVi += effect.value;
        } else if (effect.type === 'heal') {
            const healAmount = Math.floor(this.player.maxHp * effect.value);
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
        } else if (effect.type === 'mana') {
            const manaAmount = Math.floor(this.player.maxMana * effect.value);
            this.player.mana = Math.min(this.player.maxMana, this.player.mana + manaAmount);
        } else if (effect.type === 'learn_technique') {
            this.player.learnTechnique(effect.value);
        } else if (effect.type === 'learn_secret') {
            this.player.learnSecretTechnique(effect.value);
        } else if (effect.type === 'qi_absorb') {
            // Check if energySystem exists (it should be global or accessible via player)
            const es = window.energySystem || (this.player.energySystem);
            if (es) {
                es.absorbQi(effect.qiType, effect.amount, effect.purity || 'TINH_THUAN');
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
        } else if (effect.type === 'refine_flame') {
            if (!this.player.ownedFlames.includes(effect.value)) {
                this.player.ownedFlames.push(effect.value);
                this.player.currentFlame = effect.value; // Auto switch to better flame
            }
        } else if (effect.type === 'buff') {
            this.player.addBuff({
                id: effect.id || 'temp_buff',
                stat: effect.stat,
                value: effect.value,
                duration: (effect.duration || 3600) * 1000 // duration is in seconds in item-data
            });
        } else if (effect.type === 'unlock_profession') {
            if (this.player.unlockProfession(effect.profession)) {
                state.ui.alert(`Chúc mừng! Ngươi đã lĩnh hội bí pháp và mở khóa nghề ${effect.profession === 'alchemy' ? 'Luyện Đan' : 
                                effect.profession === 'talisman' ? 'Phù Lục' : 
                                effect.profession === 'smithing' ? 'Luyện Khí' : 
                                effect.profession === 'formation' ? 'Trận Pháp' : 
                                effect.profession === 'puppet' ? 'Khôi Lỗi' : 
                                effect.profession === 'corpse' ? 'Luyện Thi' : 
                                effect.profession === 'beast' ? 'Ngự Thú' : 
                                effect.profession === 'insect' ? 'Ngự Trùng' : effect.profession}!`, "Mở Khóa Nghề Nghiệp");
            } else {
                state.ui.toast("Ngươi đã lĩnh hội bí pháp này từ trước rồi.", "info");
            }
        }
    }

    sortItems() {
        this.items.sort((a, b) => {
            const itemA = getItemById(a.id);
            const itemB = getItemById(b.id);
            if (!itemA || !itemB) return 0;
            if (itemA.type !== itemB.type) return itemA.type.localeCompare(itemB.type);
            return itemA.name.localeCompare(itemB.name);
        });
    }

    load(data) {
        if (Array.isArray(data)) {
            this.items = data;
            this.maxSlots = 20;
        } else if (data) {
            this.items = data.items || [];
            this.maxSlots = data.maxSlots || 20;
        }
    }

    save() {
        return {
            items: this.items,
            maxSlots: this.maxSlots
        };
    }
}
