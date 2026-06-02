import { getItemById } from '../configs/item-data.js';

export const CRAFTING_RECIPES = [
    {
        id: 'craft_thanh_hong_kiem',
        name: 'Thanh Hồng Kiếm',
        type: 'phap_bao_cong',
        resultId: 'thanh_hong_kiem',
        materials: [
            { id: 'linh_thao_thap', quantity: 10 },
            { id: 'phi_kiem_go', quantity: 1 }
        ],
        successRate: 0.7,
        minRealm: 5
    }
];

export class CraftingSystem {
    constructor(player) {
        this.player = player;
    }

    canCraft(recipe) {
        if (this.player.realmId < recipe.minRealm) return { can: false, msg: 'Cảnh giới chưa đủ!' };
        
        for (const mat of recipe.materials) {
            const playerMat = this.player.inventory.allItems.find(i => i.id === mat.id);
            if (!playerMat || playerMat.quantity < mat.quantity) {
                return { can: false, msg: `Thiếu ${getItemById(mat.id).name}!` };
            }
        }
        return { can: true };
    }

    craft(recipeId) {
        const recipe = CRAFTING_RECIPES.find(r => r.id === recipeId);
        if (!recipe) return { success: false, msg: 'Công thức không tồn tại!' };

        const check = this.canCraft(recipe);
        if (!check.can) return { success: false, msg: check.msg };

        // Consume materials
        recipe.materials.forEach(mat => {
            this.player.inventory.removeItem(mat.id, mat.quantity);
        });

        // Roll for success
        if (Math.random() <= recipe.successRate) {
            this.player.inventory.addItem(recipe.resultId, 1);
            return { success: true, msg: `Luyện chế thành công: ${getItemById(recipe.resultId).name}!` };
        } else {
            return { success: false, msg: 'Luyện chế thất bại! Nguyên liệu đã bị phá hủy.' };
        }
    }
}
