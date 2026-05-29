import { SMITHING_RECIPES, getSmithingLevelInfo } from '../configs/smithing-data.js';
import { getItemById } from '../configs/item-data.js';
import { getFlameById } from '../configs/alchemy-data.js';

export class SmithingSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
    }

    async forge(recipeId) {
        const recipe = SMITHING_RECIPES[recipeId];
        if (!recipe) return { success: false, msg: 'Bản thiết kế không tồn tại!' };

        // Check ownership
        if (!this.player.knownSmithingRecipes.includes(recipeId)) {
            return { success: false, msg: 'Ngươi chưa có bản vẽ của vật phẩm này!' };
        }

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

        // Check tool & flame
        const tool = getItemById(this.player.smithingTool);
        const flame = getFlameById(this.player.currentFlame);
        
        if (!tool || !flame) {
            return { success: false, msg: 'Ngươi cần có Đinh Sắt và Linh Hỏa để rèn đúc!' };
        }

        // Consume
        recipe.materials.forEach(mat => this.player.inventory.removeItem(mat.id, mat.quantity));
        this.player.stamina -= recipe.staminaCost;
        this.player.mana -= recipe.manaCost;

        // Success calculation
        let successRate = recipe.baseSuccessRate;
        
        // Bonus from Smithing Tool (if any)
        if (this.player.smithingTool === 'luyen_khi_dai') successRate += 0.1;
        
        // Bonus from flame power
        if (flame && flame.type === 'di_hoa') {
            successRate += (flame.power * 0.05); // Each power level adds 5%
        }

        const roll = Math.random();
        if (roll <= successRate) {
            // Quality determination
            const qualityRoll = Math.random() + (this.player.smithingLevel * 0.05) + (this.player.soulRealmId * 0.02);
            let quality = 'Hạ Phẩm';
            let hasKhiLinh = false;

            if (qualityRoll > 2.2) { 
                quality = 'Tiên Phẩm'; 
                hasKhiLinh = Math.random() < 0.15;
            }
            else if (qualityRoll > 1.8) { quality = 'Hoàn Mỹ'; hasKhiLinh = Math.random() < 0.05; }
            else if (qualityRoll > 1.5) { quality = 'Cực Phẩm'; }
            else if (qualityRoll > 1.2) { quality = 'Thượng Phẩm'; }
            else if (qualityRoll > 0.8) { quality = 'Trung Phẩm'; }

            const metadata = { quality, hasKhiLinh };
            
            if (recipe.type === 'bag_upgrade') {
                this.player.inventory.upgradeBag(this.player.inventory.currentBagIndex, recipe.extraSlots);
                this.player.addSmithingExp(recipe.expGain);
                return { 
                    success: true, 
                    msg: `Chúc mừng! Ngươi đã nâng cấp thành công ${this.player.inventory.currentBag.name} (+${recipe.extraSlots} ô)!` 
                };
            }

            await window.game.receiveItem(recipe.id, 1, metadata);
            
            if (this.player.addSmithingExp(recipe.expGain)) {
                 const nextInfo = getSmithingLevelInfo(this.player.smithingLevel);
                 this.ui.toast(`Đẳng cấp Luyện Khí Sư tăng lên ${nextInfo.name}!`, "success");
            }
            return { 
                success: true, 
                msg: `Chúc mừng! Ngươi đã rèn thành công [${quality}] ${getItemById(recipe.id)?.name || recipe.name}!${hasKhiLinh ? ' VẬT PHẨM ĐÃ SINH RA KHÍ LINH!' : ''}` 
            };
        } else {
            // Failure
            if (Math.random() < 0.1 + (recipe.level * 0.05)) {
                this.ui.toast("Lò rèn nổ tung! Ngươi bị thương phản phệ.", "error");
                this.player.hp -= 50 * recipe.level;
            }
            return { success: false, msg: 'Rèn thất bại! Nguyên liệu đã biến thành đống sắt vụn.' };
        }
    }
}
