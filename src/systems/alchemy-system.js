import { getRecipeById, getCauldronById, getFlameById, getAlchemyLevelInfo, ALCHEMY_TECHNIQUES } from '../configs/alchemy-data.js';
import { ALCHEMY_ROOMS } from '../configs/guild-data.js';
import { getItemById } from '../configs/item-data.js';

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
        if (!recipe) return { success: false, msg: 'Phương thuốc không tồn tại!' };
        const cauldron = getCauldronById(cauldronId || 'pham_lu');
        if (!cauldron) return { success: false, msg: 'Lò luyện không hợp lệ!' };
        const flame = getFlameById(flameId || 'linh_hoa');
        if (!flame) return { success: false, msg: 'Linh hỏa không hợp lệ!' };
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
        let isDanLinh = false;

        if (qualityScore > 2.5) { 
            quality = 'Tiên Phẩm'; 
            danVeins = 12; 
            poisonValue = 0; 
            isDanLinh = Math.random() < 0.1; // 10% chance for Dan Linh if score is very high
        }
        else if (qualityScore > 2.0) { quality = 'Hoàn Mỹ'; danVeins = 9; poisonValue = 0; }
        else if (qualityScore > 1.6) { quality = 'Cực Phẩm'; danVeins = 6; poisonValue = 2; }
        else if (qualityScore > 1.2) { quality = 'Thượng Phẩm'; danVeins = 3; poisonValue = 5; }
        else if (qualityScore > 0.8) { quality = 'Trung Phẩm'; danVeins = 1; poisonValue = 8; }

        // Dan Tribulation (for level 5+ dan or High quality)
        let hasTribulation = false;
        if (recipe.level >= 5 || quality === 'Hoàn Mỹ' || quality === 'Tiên Phẩm') {
            hasTribulation = Math.random() < 0.3; // Increased chance
        }

        return {
            success: true,
            quality,
            danVeins,
            poisonValue,
            isDanLinh,
            hasTribulation,
            resultId: recipe.resultId,
            msg: `Luyện đan thành công! Thu được [${quality}] ${getItemById(recipe.resultId)?.name || 'Đan dược'}.${isDanLinh ? ' KHỞI SINH ĐAN LINH!' : ''}`
        };
    }

    async craft(recipeId) {
        if (this.isCrafting) return;
        
        const recipe = getRecipeById(recipeId);
        if (!recipe) return { success: false, msg: 'Đan phương không tồn tại!' };

        // Check if player knows the recipe
        if (!this.player.knownRecipes.includes(recipeId)) {
            return { success: false, msg: 'Ngươi chưa có đan phương của loại đan dược này!' };
        }

        // Check level
        if (this.player.alchemyLevel < recipe.level) {
            return { success: false, msg: 'Cấp bậc luyện dược sư chưa đủ!' };
        }

        // Check materials
        for (const mat of recipe.materials) {
            const matItem = getItemById(mat.id);
            if (!matItem) continue;
            const playerMat = this.player.inventory.items.find(i => i.id === mat.id);
            if (!playerMat || playerMat.quantity < mat.quantity) {
                return { success: false, msg: `Thiếu ${matItem.name}!` };
            }
        }

        const cauldron = getCauldronById(this.player.currentCauldron || 'pham_lu');
        const flame = getFlameById(this.player.currentFlame || 'linh_hoa');
        
        let craftTime = recipe.time;
        if (cauldron && cauldron.heatRate) craftTime /= cauldron.heatRate;
        if (flame && flame.power) craftTime /= (flame.power * 0.5);

        // Apply technique time bonus
        Object.keys(this.player.knownAlchemyTechniques || {}).forEach(tid => {
            const tech = ALCHEMY_TECHNIQUES[tid];
            if (tech && tech.bonus.time) craftTime *= (1 + tech.bonus.time);
        });

        this.isCrafting = true;
        this.ui.showLoading(true, `Đang tinh luyện ${recipe.name}...`);

        // Simulate time
        await new Promise(resolve => setTimeout(resolve, Math.max(1000, craftTime * 1000)));

        // Consume materials
        recipe.materials.forEach(mat => {
            this.player.inventory.removeItem(mat.id, mat.quantity);
        });

        const result = this.calculateResult(recipeId, this.player.currentCauldron, this.player.currentFlame);
        
        this.ui.showLoading(false);
        this.isCrafting = false;

        if (result.success) {
            // ... (Dan Tribulation logic remains)
            if (result.hasTribulation) {
                const survived = await this.ui.confirm(
                    `Linh đan xuất thế dẫn động Đan Kiếp! Ngươi có muốn dùng linh lực che chắn lò luyện? (Rủi ro: Nổ lò)`, 
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
            // Output quantity
            let quantity = 1;
            if (cauldron && cauldron.outputBonus) quantity += cauldron.outputBonus;

            // Create item with metadata
            const itemMetadata = {
                id: result.resultId,
                quality: result.quality,
                danVeins: result.danVeins,
                poison: result.poisonValue
            };
            
            this.player.inventory.addItem(result.resultId, quantity, itemMetadata);
            if (this.player.addAlchemyExp(recipe.level * 10)) {
                const levelInfo = getAlchemyLevelInfo(this.player.alchemyLevel);
                this.ui.alert(`Đẳng cấp Luyện Dược Sư tăng lên ${levelInfo.name}!`, "Đan Đạo Tấn Thăng");
            }
            
            if (quantity > 1) {
                result.msg += ` (Số lượng: ${quantity} viên)`;
            }
            return result;
        } else {
            if (result.exploded) {
                this.player.hp -= 20; // Take damage
                this.ui.toast("Ngươi bị phản phệ từ vụ nổ lò!", "error");
            }
            return result;
        }
    }
}
