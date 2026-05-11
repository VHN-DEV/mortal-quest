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

        // Add Puppet item or register to active puppets
        // For now, we'll add it as a specialized item in inventory
        this.player.inventory.addItem('khoi_loi_item', 1, {
            puppetId: recipe.id,
            name: recipe.name,
            stats: { ...recipe.stats },
            durability: 100,
            maxDurability: 100
        });

        this.player.addPuppetExp(recipe.grade === 'PHAM' ? 50 : 150);

        return { success: true, msg: `Luyện chế thành công: ${recipe.name}!` };
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
