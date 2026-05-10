import { SMITHING_RECIPES, getSmithingLevelInfo } from '../configs/smithing-data.js';
import { getItemById } from '../configs/item-data.js';

export class SmithingSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
    }

    forge(recipeId) {
        const recipe = SMITHING_RECIPES[recipeId];
        if (!recipe) return { success: false, msg: 'Bản thiết kế không tồn tại!' };

        if (this.player.smithingLevel < recipe.level) {
            return { success: false, msg: `Cần cấp Luyện Khí Sư ${recipe.level} để rèn vật phẩm này!` };
        }

        // Check materials
        for (const mat of recipe.materials) {
            if (!this.player.inventory.hasItem(mat.id, mat.quantity)) {
                return { success: false, msg: `Không đủ nguyên liệu: ${getItemById(mat.id).name}` };
            }
        }

        if (this.player.stamina < recipe.staminaCost || this.player.mana < recipe.manaCost) {
            return { success: false, msg: 'Không đủ trạng thái để bắt đầu rèn!' };
        }

        // Consume
        recipe.materials.forEach(mat => this.player.inventory.removeItem(mat.id, mat.quantity));
        this.player.stamina -= recipe.staminaCost;
        this.player.mana -= recipe.manaCost;

        // Success calculation
        let successRate = recipe.baseSuccessRate;
        
        // Bonus from Smithing Tool (if any)
        if (this.player.smithingTool === 'luyen_khi_dai') successRate += 0.1;
        
        // Bonus from fire power (if using a better flame)
        if (this.player.currentFlame === 'thanh_lien_hoa') successRate += 0.05;

        const roll = Math.random();
        if (roll <= successRate) {
            // Success
            this.player.inventory.addItem(recipe.id, 1);
            if (this.player.addSmithingExp(recipe.expGain)) {
                 const nextInfo = getSmithingLevelInfo(this.player.smithingLevel);
                 this.ui.alert(`Đẳng cấp Luyện Khí Sư tăng lên ${nextInfo.name}!`, "Rèn Thần Kỹ");
            }
            return { success: true, msg: `Chúc mừng! Bạn đã rèn thành công [${getItemById(recipe.id).name}]!` };
        } else {
            // Failure
            if (Math.random() < 0.1) {
                this.ui.toast("Lò rèn nổ tung! Bạn bị thương nhẹ.", "error");
                this.player.hp -= 30;
            }
            return { success: false, msg: 'Rèn thất bại! Nguyên liệu đã biến thành đống sắt vụn.' };
        }
    }
}
