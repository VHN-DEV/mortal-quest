import { ALCHEMY_RECIPES } from '../configs/alchemy-data.js';
import { SEEDS } from '../configs/garden-data.js';
import { SMITHING_RECIPES } from '../configs/smithing-data.js';
import { TALISMAN_RECIPES } from '../configs/talisman-data.js';
import { PUPPET_RECIPES } from '../configs/puppet-data.js';
import { ITEMS } from '../configs/item-data.js';

/**
 * Tìm các liên kết giữa các vật phẩm (Nguyên liệu -> Sản phẩm, Sản phẩm -> Nguyên liệu, Hạt giống -> Linh thảo, v.v.)
 */
export function getItemConnections(itemId) {
    const connections = {
        asMaterialIn: [], // Sản phẩm có thể luyện từ nguyên liệu này
        ingredients: [],  // Nguyên liệu cần để luyện vật phẩm này
        produces: null,   // Kết quả thu hoạch (cho hạt giống)
        harvestedFrom: null, // Hạt giống để trồng ra vật phẩm này
        recipeFor: null   // Vật phẩm mà đan phương/bản vẽ này dạy
    };

    const item = ITEMS[itemId];
    if (!item) return connections;

    // 1. Nếu là Hạt giống
    const seed = SEEDS.find(s => s.id === itemId);
    if (seed) {
        connections.produces = seed.herbId;
    }

    // 2. Nếu là Linh thảo/Vật phẩm có thể thu hoạch
    const sourceSeed = SEEDS.find(s => s.herbId === itemId);
    if (sourceSeed) {
        connections.harvestedFrom = sourceSeed.id;
    }

    // 3. Tìm trong Đan dược (Alchemy)
    // - Tìm xem item này là kết quả của công thức nào
    const alchemyRecipeAsResult = ALCHEMY_RECIPES.find(r => r.resultId === itemId);
    if (alchemyRecipeAsResult) {
        connections.ingredients.push(...alchemyRecipeAsResult.materials.map(m => ({
            id: m.id,
            quantity: m.quantity,
            type: 'alchemy'
        })));
    }

    // - Tìm xem item này là nguyên liệu trong công thức nào
    ALCHEMY_RECIPES.forEach(r => {
        if (r.materials.some(m => m.id === itemId)) {
            connections.asMaterialIn.push({
                id: r.resultId,
                name: r.name,
                type: 'alchemy'
            });
        }
    });

    // 4. Tìm trong Rèn đúc (Smithing)
    // - Tìm xem item này là kết quả của bản vẽ nào
    const smithingRecipeAsResult = SMITHING_RECIPES[itemId];
    if (smithingRecipeAsResult) {
        connections.ingredients.push(...smithingRecipeAsResult.materials.map(m => ({
            id: m.id,
            quantity: m.quantity,
            type: 'smithing'
        })));
    }

    // - Tìm xem item này là nguyên liệu trong bản vẽ nào
    Object.values(SMITHING_RECIPES).forEach(r => {
        if (r.materials.some(m => m.id === itemId)) {
            connections.asMaterialIn.push({
                id: r.id,
                name: r.name,
                type: 'smithing'
            });
        }
    });

    // 5. Tìm trong Phù lục (Talisman)
    const talismanRecipeAsResult = TALISMAN_RECIPES[itemId];
    if (talismanRecipeAsResult) {
        connections.ingredients.push(...talismanRecipeAsResult.materials.map(m => ({
            id: m.id,
            quantity: m.quantity,
            type: 'talisman'
        })));
    }

    Object.values(TALISMAN_RECIPES).forEach(r => {
        if (r.materials.some(m => m.id === itemId)) {
            connections.asMaterialIn.push({
                id: r.id,
                name: r.name,
                type: 'talisman'
            });
        }
    });

    // 6. Tìm trong Khôi lỗi (Puppet)
    const puppetRecipeAsResult = PUPPET_RECIPES.find(r => r.id === itemId);
    if (puppetRecipeAsResult) {
        connections.ingredients.push(...puppetRecipeAsResult.materials.map(m => ({
            id: m.id,
            quantity: m.quantity,
            type: 'puppet'
        })));
    }

    PUPPET_RECIPES.forEach(r => {
        if (r.materials.some(m => m.id === itemId)) {
            connections.asMaterialIn.push({
                id: r.id,
                name: r.name,
                type: 'puppet'
            });
        }
    });

    // 7. Nếu là Đan phương/Bản vẽ (Recipe Scroll)
    if (item.type === 'don_thuoc' && item.effect && item.effect.value) {
        const targetId = item.effect.value;
        // Check if it's alchemy, smithing, talisman or puppet
        if (ALCHEMY_RECIPES.some(r => r.id === targetId)) {
            connections.recipeFor = ALCHEMY_RECIPES.find(r => r.id === targetId).resultId;
        } else if (SMITHING_RECIPES[targetId]) {
            connections.recipeFor = targetId;
        } else if (TALISMAN_RECIPES[targetId]) {
            connections.recipeFor = targetId;
        } else if (PUPPET_RECIPES.some(r => r.id === targetId)) {
            connections.recipeFor = targetId;
        }
    }

    // 6. Nếu là Sách kỹ năng (Book)
    if (item.type === 'sach_cong_phap' && item.techniqueId) {
        connections.teaches = item.techniqueId;
    }

    // 7. Nếu là Trứng linh thú (Beast Egg)
    if (item.type === 'trung_linh_thu' && item.beastId) {
        connections.hatchesTo = item.beastId;
    }

    // 8. Nếu là Vật phẩm mở khóa nghề nghiệp
    if (item.effect && item.effect.type === 'unlock_profession') {
        connections.unlocksProfession = item.effect.profession;
    }

    return connections;
}
