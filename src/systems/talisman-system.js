import { TALISMAN_RECIPES, getTalismanLevelInfo } from '../configs/talisman-data.js';
import { getItemById } from '../configs/item-data.js';

export class TalismanSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
    }

    draw(recipeId) {
        const recipe = TALISMAN_RECIPES[recipeId];
        if (!recipe) return { success: false, msg: 'Bí pháp không tồn tại!' };

        if (this.player.talismanLevel < recipe.level) {
            return { success: false, msg: `Cần cấp Phù Sư ${recipe.level} để vẽ loại phù này!` };
        }

        // Check materials
        for (const mat of recipe.materials) {
            if (!this.player.inventory.hasItem(mat.id, mat.quantity)) {
                return { success: false, msg: `Không đủ nguyên liệu: ${getItemById(mat.id).name}` };
            }
        }

        if (this.player.stamina < recipe.staminaCost || this.player.mana < recipe.manaCost) {
            return { success: false, msg: 'Trạng thái không đủ để vẽ phù!' };
        }

        // Consume resources
        recipe.materials.forEach(mat => this.player.inventory.removeItem(mat.id, mat.quantity));
        this.player.stamina -= recipe.staminaCost;
        this.player.mana -= recipe.manaCost;

        // Calculate success rate
        let successRate = recipe.baseSuccessRate;
        
        // Add bonus from Talisman Pen
        const pen = getItemById(this.player.currentTalismanPen);
        if (pen && pen.stats && pen.stats.successRate) {
            successRate += pen.stats.successRate;
        }

        // Add bonus from Soul strength (Thần thức)
        const soulBonus = (this.player.soulRealmId - 1) * 0.05;
        successRate += soulBonus;

        const roll = Math.random();
        if (roll <= successRate) {
            // Success
            this.player.inventory.addItem(recipe.id, 1);
            this.player.talismanExp += recipe.expGain;
            this.checkLevelUp();
            return { success: true, msg: `Bạn đã vẽ thành công một tấm ${recipe.name}!` };
        } else {
            // Failure
            // 20% chance of explosion (backlash)
            if (Math.random() < 0.2) {
                const damage = 50 * recipe.level;
                this.player.hp -= damage;
                return { success: false, msg: `Văn phù sụp đổ! Phù nổ tung gây ${damage} sát thương lên Thần Thức của bạn.` };
            }
            return { success: false, msg: 'Vẽ phù thất bại! Phù văn bị nhòe và mất đi linh tính.' };
        }
    }

    checkLevelUp() {
        const nextLevelInfo = getTalismanLevelInfo(this.player.talismanLevel + 1);
        if (this.player.talismanExp >= nextLevelInfo.exp && nextLevelInfo.exp > 0) {
            this.player.talismanLevel++;
            if (this.ui) this.ui.alert(`Chúc mừng! Bạn đã đột phá lên ${nextLevelInfo.name}!`, "Phù Đạo Tấn Thăng");
        }
    }
}
