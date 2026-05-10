import { getRecipeById, getCauldronById, getFlameById, getAlchemyLevelInfo } from '../configs/alchemy_data.js';
import { ALCHEMY_ROOMS } from '../configs/guild_data.js';
import { getItemById } from '../configs/items.js';

export class AlchemySystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        this.isCrafting = false;
    }

    /**
     * Calculate success probability and quality
     */
    calculateResult(recipeId, cauldronId, flameId) {
        const recipe = getRecipeById(recipeId);
        const cauldron = getCauldronById(cauldronId || 'pham_lu');
        const flame = getFlameById(flameId || 'linh_hoa');
        const levelInfo = getAlchemyLevelInfo(this.player.alchemyLevel || 1);
        const room = ALCHEMY_ROOMS.find(r => r.id === this.player.currentAlchemyRoom);

        // Success Probability
        let successRate = recipe.baseSuccessRate;
        successRate += levelInfo.bonusRate;
        successRate += cauldron.successBonus;
        successRate += flame.successBonus;
        if (room) successRate += room.successBonus;
        
        // Stability check (risk of explosion)
        let stability = cauldron.stability;
        if (room) stability += room.stabilityBonus;
        
        const rollSuccess = Math.random() < successRate;
        const rollExplosion = Math.random() > stability;

        if (!rollSuccess) {
            return { 
                success: false, 
                exploded: rollExplosion, 
                msg: rollExplosion ? 'NỔ LÒ! Nguyên liệu tan tành, lò luyện bị tổn hại!' : 'Luyện chế thất bại, dược tính tiêu tan.'
            };
        }

        // Quality determination
        let qualityScore = Math.random();
        qualityScore += levelInfo.bonusRate;
        qualityScore += cauldron.qualityBonus;
        qualityScore += flame.qualityBonus;
        if (room && room.qualityBonus) qualityScore += room.qualityBonus;

        let quality = 'Hạ Phẩm';
        let danVeins = 0;
        let poisonValue = 10;

        if (qualityScore > 1.8) { quality = 'Hoàn Mỹ'; danVeins = 9; poisonValue = 0; }
        else if (qualityScore > 1.5) { quality = 'Cực Phẩm'; danVeins = 6; poisonValue = 2; }
        else if (qualityScore > 1.2) { quality = 'Thượng Phẩm'; danVeins = 3; poisonValue = 5; }
        else if (qualityScore > 0.8) { quality = 'Trung Phẩm'; danVeins = 1; poisonValue = 8; }

        // Dan Tribulation (for level 5+ dan or High quality)
        let hasTribulation = false;
        if (recipe.level >= 5 || quality === 'Hoàn Mỹ') {
            hasTribulation = Math.random() < 0.2; // 20% chance
        }

        return {
            success: true,
            quality,
            danVeins,
            poisonValue,
            hasTribulation,
            resultId: recipe.resultId,
            msg: `Luyện đan thành công! Thu được [${quality}] ${getItemById(recipe.resultId).name}.`
        };
    }

    async craft(recipeId) {
        if (this.isCrafting) return;
        
        const recipe = getRecipeById(recipeId);
        if (!recipe) return { success: false, msg: 'Đan phương không tồn tại!' };

        // Check level
        if (this.player.alchemyLevel < recipe.level) {
            return { success: false, msg: 'Cấp bậc luyện dược sư chưa đủ!' };
        }

        // Check materials
        for (const mat of recipe.materials) {
            const playerMat = this.player.inventory.items.find(i => i.id === mat.id);
            if (!playerMat || playerMat.quantity < mat.quantity) {
                return { success: false, msg: `Thiếu ${getItemById(mat.id).name}!` };
            }
        }

        this.isCrafting = true;
        this.ui.showLoading(true, `Đang tinh luyện ${recipe.name}...`);

        // Simulate time
        await new Promise(resolve => setTimeout(resolve, recipe.time * 1000));

        // Consume materials
        recipe.materials.forEach(mat => {
            this.player.inventory.removeItem(mat.id, mat.quantity);
        });

        const result = this.calculateResult(recipeId, this.player.currentCauldron, this.player.currentFlame);
        
        this.ui.showLoading(false);
        this.isCrafting = false;

        if (result.success) {
            if (result.hasTribulation) {
                const survived = await this.ui.confirm(
                    `Linh đan xuất thế dẫn động Đan Kiếp! Bạn có muốn dùng linh lực che chắn lò luyện? (Rủi ro: Nổ lò)`, 
                    'ĐAN KIẾP GIÁNG LÂM'
                );
                
                if (survived) {
                    if (Math.random() < 0.7) {
                        this.ui.toast("Vượt qua Đan Kiếp! Linh đan thăng hoa!", "success");
                        result.danVeins += 1;
                    } else {
                        result.success = false;
                        result.msg = "Đan Kiếp quá mạnh, linh đan và lò luyện đều hóa thành tro bụi!";
                    }
                } else {
                    result.success = false;
                    result.msg = "Đan Kiếp đánh xuống, luyện đan thất bại!";
                }
            }
        }

        if (result.success) {
            // Create item with metadata
            const item = {
                id: result.resultId,
                quality: result.quality,
                danVeins: result.danVeins,
                poison: result.poisonValue
            };
            this.player.inventory.addItem(result.resultId, 1, item);
            this.player.addAlchemyExp(recipe.level * 10);
            return result;
        } else {
            if (result.exploded) {
                this.player.hp -= 20; // Take damage
                this.ui.toast("Bạn bị phản phệ từ vụ nổ lò!", "error");
            }
            return result;
        }
    }
}
