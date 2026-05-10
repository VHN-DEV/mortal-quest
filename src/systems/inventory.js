import { getItemById } from '../data/items.js';

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

    useItem(itemId) {
        const itemData = getItemById(itemId);
        if (!itemData || itemData.type !== 'consumable') return false;

        const index = this.items.findIndex(i => i.id === itemId);
        if (index > -1 && this.items[index].quantity > 0) {
            this.applyEffect(itemData.effect);
            this.removeItem(itemId, 1);
            return true;
        }
        return false;
    }

    applyEffect(effect) {
        if (effect.type === 'tu_vi') {
            this.player.tuVi += effect.value;
        } else if (effect.type === 'heal') {
            const healAmount = Math.floor(this.player.maxHp * effect.value);
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
        }
    }

    sortItems() {
        this.items.sort((a, b) => {
            const itemA = getItemById(a.id);
            const itemB = getItemById(b.id);
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
