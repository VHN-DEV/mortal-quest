import { PUPPET_RECIPES, PUPPET_GRADES } from '../configs/puppet-data.js';
import { getItemById } from '../configs/item-data.js';

export class PuppetSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
    }

    craft(recipeId) {
        const recipe = PUPPET_RECIPES.find(r => r.id === recipeId);
        if (!recipe) return { success: false, msg: "Bản vẽ không tồn tại!" };

        if (!this.player.knownPuppetRecipes.includes(recipeId)) {
            return { success: false, msg: "Ngươi chưa có bản thiết kế của khôi lỗi này!" };
        }

        if (this.player.puppetLevel < recipe.skillLevel) {
            return { success: false, msg: `Cần Khôi Lỗi Thuật cấp ${recipe.skillLevel}!` };
        }

        // Check materials
        for (const mat of recipe.materials) {
            if (!this.player.inventory.hasItem(mat.id, mat.quantity)) {
                const item = getItemById(mat.id);
                return { success: false, msg: `Thiếu nguyên liệu: ${item ? item.name : mat.id}!` };
            }
        }

        // Consume materials
        for (const mat of recipe.materials) {
            this.player.inventory.removeItem(mat.id, mat.quantity);
        }

        // Success check
        let successRate = 0.8 - (recipe.skillLevel * 0.05) + (this.player.puppetLevel * 0.05);
        const roll = Math.random();
        
        if (roll <= successRate) {
            // Quality determination
            const qualityRoll = Math.random() + (this.player.puppetLevel * 0.05) + (this.player.soulRealmId * 0.03);
            let quality = 'Hạ Phẩm';
            let hasIntelligence = false;

            if (qualityRoll > 2.3) { 
                quality = 'Tiên Phẩm'; 
                hasIntelligence = Math.random() < 0.2;
            }
            else if (qualityRoll > 1.9) { quality = 'Hoàn Mỹ'; hasIntelligence = Math.random() < 0.1; }
            else if (qualityRoll > 1.5) { quality = 'Cực Phẩm'; }
            else if (qualityRoll > 1.1) { quality = 'Thượng Phẩm'; }
            else if (qualityRoll > 0.7) { quality = 'Trung Phẩm'; }

            // Add Puppet item
            this.player.inventory.addItem('khoi_loi_item', 1, {
                puppetId: recipe.id,
                name: recipe.name,
                quality,
                hasIntelligence,
                stats: { ...recipe.stats },
                durability: 100,
                maxDurability: 100
            });

            this.player.addPuppetExp(recipe.grade === 'PHAM' ? 50 : 200);

            return { 
                success: true, 
                msg: `Luyện chế thành công: [${quality}] ${recipe.name}!${hasIntelligence ? ' KHÔI LỖI ĐÃ SINH RA LINH TRÍ!' : ''}` 
            };
        } else {
            // Failure
            if (Math.random() < 0.15) {
                const damage = 100 * recipe.skillLevel;
                this.player.hp -= damage;
                return { success: false, msg: `KHÔI LỖI PHÁT NỔ! Ngươi bị phản phệ gây ${damage} sát thương!` };
            }
            return { success: false, msg: 'Luyện chế thất bại! Linh cấu sụp đổ, nguyên liệu bị phá hủy.' };
        }
    }

    repair(inventoryIndex) {
        const item = this.player.inventory.items[inventoryIndex];
        if (!item || item.id !== 'khoi_loi_item') return { success: false, msg: "Không phải khôi lỗi!" };

        const cost = 100; // Placeholder cost
        if (this.player.lingShi < cost) return { success: false, msg: "Không đủ linh thạch sửa chữa!" };

        if (this.player.spendLingShi(cost)) {
            item.metadata.durability = item.metadata.maxDurability;
            return { success: true, msg: "Sửa chữa khôi lỗi hoàn tất!" };
        }

        return { success: false, msg: "Sửa chữa thất bại!" };
    }
}
