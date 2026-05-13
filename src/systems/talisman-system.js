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

        // Check tool
        const pen = getItemById(this.player.currentTalismanPen);
        if (!pen) {
            return { success: false, msg: 'Ngươi cần có Phù Bút để vẽ phù!' };
        }

        // Consume resources
        recipe.materials.forEach(mat => this.player.inventory.removeItem(mat.id, mat.quantity));
        this.player.stamina -= recipe.staminaCost;
        this.player.mana -= recipe.manaCost;

        // Calculate success rate
        let successRate = recipe.baseSuccessRate;
        
        // Add bonus from Talisman Pen
        if (pen && pen.stats && pen.stats.successRate) {
            successRate += pen.stats.successRate;
        }

        // Add bonus from Soul strength (Thần thức)
        const soulBonus = (this.player.soulRealmId - 1) * 0.05;
        successRate += soulBonus;

        const roll = Math.random();
        if (roll <= successRate) {
            // Quality determination
            const qualityRoll = Math.random() + (this.player.talismanLevel * 0.05) + soulBonus;
            let quality = 'Hạ Phẩm';
            if (qualityRoll > 1.8) quality = 'Tiên Phẩm';
            else if (qualityRoll > 1.5) quality = 'Cực Phẩm';
            else if (qualityRoll > 1.2) quality = 'Thượng Phẩm';
            else if (qualityRoll > 0.8) quality = 'Trung Phẩm';

            const metadata = { quality };
            this.player.inventory.addItem(recipe.id, 1, metadata);
            
            if (this.player.addTalismanExp(recipe.expGain)) {
                 const nextLevelInfo = getTalismanLevelInfo(this.player.talismanLevel);
                 this.ui.alert(`Chúc mừng! Ngươi đã đột phá lên ${nextLevelInfo.name}!`, "Phù Đạo Tấn Thăng");
            }
            return { success: true, msg: `Ngươi đã vẽ thành công một tấm [${quality}] ${recipe.name}!` };
        } else {
            // Failure
            // 20% chance of explosion (backlash)
            if (Math.random() < 0.2 + (recipe.level * 0.05)) {
                const damage = 50 * recipe.level;
                this.player.hp -= damage;
                return { success: false, msg: `PHÙ NỔ! Phù văn sụp đổ gây ${damage} sát thương phản phệ!` };
            }
            return { success: false, msg: 'Vẽ phù thất bại! Phù văn bị nhòe và mất đi linh tính.' };
        }
    }
}
