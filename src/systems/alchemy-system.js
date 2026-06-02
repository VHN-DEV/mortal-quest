import { getRecipeById, getCauldronById, getFlameById, ALCHEMY_TECHNIQUES, getAlchemyLevelInfo } from '../configs/alchemy-data.js';
import { getItemById } from '../configs/item-data.js';
import { QUALITY_TYPES } from '../configs/item-classification.js';


export class AlchemySystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        this.isCrafting = false;
    }

    calculateResult(recipeId, cauldronId, flameId) {
        const recipe = getRecipeById(recipeId);
        const cauldron = getCauldronById(cauldronId);
        const flame = getFlameById(flameId);

        // Success rate calculation
        let successRate = recipe.successRate || 0.7;
        
        // Cauldron and flame influence
        if (cauldron && cauldron.successBonus) successRate += cauldron.successBonus;
        if (flame && flame.successBonus) successRate += flame.successBonus;

        // Player level bonus
        const levelDiff = this.player.alchemyLevel - recipe.level;
        successRate += (levelDiff * 0.05);

        // Technique bonuses
        Object.keys(this.player.knownAlchemyTechniques || {}).forEach(tid => {
            const tech = ALCHEMY_TECHNIQUES[tid];
            if (tech && tech.bonus.success) successRate += tech.bonus.success;
        });

        successRate = Math.max(0.1, Math.min(0.95, successRate));

        if (Math.random() > successRate) {
            return { success: false, msg: 'Luyện đan thất bại, dược liệu hóa thành tro bụi.' };
        }

        // Quality calculation
        let qualityScore = 1.0;
        if (cauldron && cauldron.qualityBonus) qualityScore += cauldron.qualityBonus;
        if (flame && flame.qualityBonus) qualityScore += flame.qualityBonus;
        
        // Add some randomness
        qualityScore += (Math.random() * 0.4 - 0.2);

        let quality = QUALITY_TYPES.PHAM_PHAM;
        let danVeins = 0;
        let poisonValue = 10;
        let isDanLinh = false;

        if (qualityScore > 2.5) { 
            quality = QUALITY_TYPES.TIEN_PHAM; 
            danVeins = 12; 
            poisonValue = 0; 
            isDanLinh = Math.random() < 0.1; // 10% chance for Dan Linh if score is very high
        }
        else if (qualityScore > 2.0) { quality = QUALITY_TYPES.HOAN_MY; danVeins = 9; poisonValue = 0; }
        else if (qualityScore > 1.6) { quality = QUALITY_TYPES.CUC_PHAM; danVeins = 6; poisonValue = 2; }
        else if (qualityScore > 1.2) { quality = QUALITY_TYPES.THUONG_PHAM; danVeins = 3; poisonValue = 5; }
        else if (qualityScore > 0.8) { quality = QUALITY_TYPES.TRUNG_PHAM; danVeins = 1; poisonValue = 8; }

        // Dan Tribulation (for level 5+ dan or High quality)
        let hasTribulation = false;
        if (recipe.level >= 5 || quality === QUALITY_TYPES.HOAN_MY || quality === QUALITY_TYPES.TIEN_PHAM) {
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
            const playerMat = this.player.inventory.allItems.find(i => i.id === mat.id);
            if (!playerMat || playerMat.quantity < mat.quantity) {
                return { success: false, msg: `Thiếu ${matItem.name}!` };
            }
        }

        const cauldron = getCauldronById(this.player.currentCauldron);
        const flame = getFlameById(this.player.currentFlame);

        if (!cauldron || !flame) {
            return { success: false, msg: 'Ngươi cần có Đan Lư và Linh Hỏa để luyện đan!' };
        }
        
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

        try {
            // Simulate time
            await new Promise(resolve => setTimeout(resolve, Math.max(1000, craftTime * 1000)));

            // Consume materials
            recipe.materials.forEach(mat => {
                this.player.inventory.removeItem(mat.id, mat.quantity);
            });

            const result = this.calculateResult(recipeId, this.player.currentCauldron, this.player.currentFlame);
            
            if (result.success) {
                // Dan Tribulation logic
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
                let quantity = recipe.yield || 1;
                if (cauldron && cauldron.outputBonus) quantity += cauldron.outputBonus;

                // Create item with metadata
                const itemMetadata = {
                    id: result.resultId,
                    quality: result.quality,
                    danVeins: result.danVeins,
                    poison: result.poisonValue
                };
                
                await window.game.receiveItem(result.resultId, quantity, itemMetadata);
                if (this.player.addAlchemyExp(recipe.level * 10)) {
                    const levelInfo = getAlchemyLevelInfo(this.player.alchemyLevel);
                    this.ui.toast(`Đẳng cấp Luyện Dược Sư tăng lên ${levelInfo.name}!`, "success");
                }
                
                if (quantity > 1) {
                    result.msg += ` (Số lượng: ${quantity} viên)`;
                }
            }

            this.ui.showLoading(false);
            this.isCrafting = false;
            return result;

        } catch (error) {
            console.error('Alchemy Craft Error:', error);
            this.ui.showLoading(false);
            this.isCrafting = false;
            return { success: false, msg: 'Quá trình luyện đan bị gián đoạn bởi ngoại lực!' };
        }
    }
}
