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

    evolve(beastUniqueId) {
        const beast = this.player.beasts.find(b => b.uniqueId === beastUniqueId);
        if (!beast) return { success: false, msg: 'Không tìm thấy linh thú!' };

        const beastData = BEASTS[beast.id];
        if (!beastData || !beastData.evolutions) return { success: false, msg: 'Linh thú này không thể tiến hóa thêm!' };

        const evolution = beastData.evolutions.find(e => beast.level >= e.levelRequired);
        if (!evolution) return { success: false, msg: 'Chưa đủ điều kiện tiến hóa!' };

        // Check materials
        for (const mat of evolution.materials) {
            if (!this.player.inventory.hasItem(mat.id, mat.quantity)) {
                return { success: false, msg: `Thiếu nguyên liệu tiến hóa: ${getItemById(mat.id).name}!` };
            }
        }

        // Consume
        evolution.materials.forEach(mat => this.player.inventory.removeItem(mat.id, mat.quantity));

        // Evolution Success
        const successRate = evolution.baseSuccessRate + (this.player.beastLevel * 0.02);
        if (Math.random() > successRate) {
            return { success: false, msg: 'Tiến hóa thất bại! Linh thú bị tổn thương nhẹ.' };
        }

        // Apply evolution
        beast.id = evolution.toId;
        beast.name = evolution.newName || BEASTS[evolution.toId].name;
        // Boost stats
        Object.keys(beast.stats).forEach(stat => {
            beast.stats[stat] = Math.floor(beast.stats[stat] * evolution.statMult);
        });

        this.player.addBeastExp(1000);
        return { success: true, msg: `Chúc mừng! ${beast.name} đã tiến hóa thành công!`, beast };
    }

    breed(beastId1, beastId2) {
        // Simple breeding logic
        if (beastId1 === beastId2) return { success: false, msg: "Không thể lai tạo cùng một cá thể!" };
        
        const beast1 = this.player.beasts.find(b => b.uniqueId === beastId1);
        const beast2 = this.player.beasts.find(b => b.uniqueId === beastId2);

        if (!beast1 || !beast2) return { success: false, msg: "Không tìm thấy linh thú!" };
        if (beast1.level < 10 || beast2.level < 10) return { success: false, msg: "Linh thú cần đạt cấp 10 để lai tạo!" };

        const cost = 1000;
        if (this.player.lingShi < cost) return { success: false, msg: "Không đủ linh thạch lai tạo!" };

        this.player.spendLingShi(cost);

        // 30% chance for mutation
        const isMutation = Math.random() < 0.3;
        // ... (Breeding logic to create a new egg/beast)

        return { success: true, msg: "Lai tạo thành công! Thu được một quả trứng biến dị." };
    }

    /**
     * Huấn luyện Kỳ trùng/Linh thú
     * Tiêu tốn tài nguyên đặc thù để cường hóa chỉ số
     */
    train(beastUniqueId, materialId) {
        const beast = this.player.beasts.find(b => b.uniqueId === beastUniqueId);
        if (!beast) return { success: false, msg: 'Không tìm thấy linh thú!' };

        const material = getItemById(materialId);
        if (!material) return { success: false, msg: 'Vật liệu không hợp lệ!' };

        if (!this.player.inventory.hasItem(materialId, 1)) {
            return { success: false, msg: 'Hết vật liệu huấn luyện rồi!' };
        }

        this.player.inventory.removeItem(materialId, 1);

        // Logic tăng chỉ số dựa trên loại vật liệu
        // Phệ Kim Trùng thích ăn kim thạch (huyen_thiet, tinh_kim)
        let statGain = '';
        if (materialId === 'huyen_thiet' || materialId === 'tinh_kim') {
            const gain = materialId === 'tinh_kim' ? 10 : 2;
            beast.stats.atk += gain;
            beast.stats.def += Math.floor(gain / 2);
            statGain = `Công kích +${gain}, Phòng ngự +${Math.floor(gain / 2)}`;
        } else if (material.type === 'beast_food') {
            beast.stats.hp += 50;
            statGain = 'Máu +50';
        } else {
            // Mặc định tăng nhẹ ngẫu nhiên
            beast.stats.atk += 1;
            statGain = 'Công kích +1';
        }

        beast.loyalty = Math.min(100, beast.loyalty + 1);
        
        return { success: true, msg: `Huấn luyện thành công! ${statGain}` };
    }

    update(delta) {
        // Handle hatching timers
    }
}
