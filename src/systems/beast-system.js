import { BEASTS, getBeastLevelInfo, BLOODLINES } from '../configs/beast-data.js';
import { getItemById } from '../configs/item-data.js';

export class BeastSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
    }

    hatch(eggId) {
        const item = getItemById(eggId);
        if (!item || item.type !== 'beast_egg') return { success: false, msg: 'Đây không phải trứng linh thú!' };

        if (!this.player.inventory.hasItem(eggId)) return { success: false, msg: 'Bạn không có trứng này!' };

        const beastData = BEASTS[item.beastId];
        if (!beastData) return { success: false, msg: 'Dữ liệu linh thú lỗi!' };

        this.player.inventory.removeItem(eggId, 1);
        
        const newBeast = {
            id: beastData.id,
            uniqueId: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            name: beastData.name,
            level: 1,
            exp: 0,
            loyalty: 50,
            bloodline: beastData.bloodline,
            bornAt: Date.now(),
            stats: { ...beastData.baseStats }
        };

        this.player.beasts.push(newBeast);
        this.player.addBeastExp(100); // Hatching gives player exp
        return { success: true, msg: `Chúc mừng! Bạn đã ấp nở thành công ${beastData.name}!`, beast: newBeast };
    }

    feed(beastUniqueId, foodId) {
        const beast = this.player.beasts.find(b => b.uniqueId === beastUniqueId);
        if (!beast) return { success: false, msg: 'Không tìm thấy linh thú!' };

        const food = getItemById(foodId);
        if (!food || food.type !== 'beast_food') return { success: false, msg: 'Đây không phải thức ăn linh thú!' };

        if (!this.player.inventory.hasItem(foodId)) return { success: false, msg: 'Hết thức ăn rồi!' };

        this.player.inventory.removeItem(foodId, 1);
        
        beast.exp += food.expGain || 0;
        beast.loyalty = Math.min(100, beast.loyalty + (food.loyaltyGain || 0));

        let leveledUp = false;
        while (beast.exp >= getBeastLevelInfo(beast.level).expRequired) {
            beast.exp -= getBeastLevelInfo(beast.level).expRequired;
            beast.level++;
            leveledUp = true;
            // Increase beast stats on level up
            Object.keys(beast.stats).forEach(stat => {
                beast.stats[stat] = Math.floor(beast.stats[stat] * 1.1);
            });
        }

        this.player.addBeastExp(Math.floor(food.expGain / 2));
        return { 
            success: true, 
            msg: `Đã cho ${beast.name} ăn. ${leveledUp ? 'Nó đã lên cấp!' : ''}`,
            leveledUp
        };
    }

    update(delta) {
        // Future: Handle hatching timers if we add them
    }
}
