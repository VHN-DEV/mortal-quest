import { getItemById } from '../configs/item-data.js';
import { ARTIFACT_TIERS, ARTIFACT_QUALITIES, ARTIFACT_STATS, NATAL_TREASURE_CONFIGS } from '../configs/artifact-data.js';
import { SMITHING_RECIPES } from '../configs/smithing-data.js';
import { getFlameById } from '../configs/alchemy-data.js';

/**
 * Hệ thống Pháp Bảo chuyên sâu.
 * Quản lý Linh Tính, Khí Linh, Bản Mệnh Pháp Bảo và Nuôi Dưỡng.
 */
export class TreasureSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
    }

    /**
     * Nhận chủ Pháp Bảo (Recognition)
     * @param {string} slot - Vị trí trang bị
     * @param {string} method - 'BLOOD' (Tinh huyết) hoặc 'SOUL' (Thần thức)
     */
    recognize(slot, method = 'BLOOD') {
        const itemId = this.player.equipment[slot];
        if (!itemId) return { success: false, msg: 'Không có pháp bảo ở vị trí này.' };

        const item = getItemById(itemId);
        if (!item) return { success: false, msg: 'Dữ liệu vật phẩm lỗi.' };

        // Kiểm tra xem đã nhận chủ chưa (lưu trong player.recognizedItems)
        if (!this.player.recognizedItems) this.player.recognizedItems = [];
        if (this.player.recognizedItems.includes(itemId)) {
            return { success: false, msg: 'Pháp bảo này đã được nhận chủ rồi.' };
        }

        if (method === 'BLOOD') {
            const hpCost = this.player.maxHp * 0.4;
            if (this.player.hp <= hpCost) return { success: false, msg: 'Khí huyết quá yếu, không thể hiến tế tinh huyết!' };
            this.player.hp -= hpCost;
            this.player.recognizedItems.push(itemId);
            this.player.calculateStats();
            return { success: true, msg: `Đã dùng tinh huyết nhận chủ ${item.name}! Uy lực pháp bảo đã được giải phóng hoàn toàn.` };
        } else {
            const soulCost = 500; // Tạm thời dùng giá trị cố định
            if (this.player.mana < soulCost) return { success: false, msg: 'Linh lực không đủ để khắc họa thần thức ấn ký!' };
            this.player.mana -= soulCost;
            this.player.recognizedItems.push(itemId);
            this.player.calculateStats();
            return { success: true, msg: `Đã dùng thần thức nhận chủ ${item.name}!` };
        }
    }

    /**
     * Nuôi dưỡng Pháp Bảo (Nourish)
     * Tăng Linh Tính (Spirit Points) để thăng cấp hoặc sinh Khí Linh
     */
    nourish(slot, materialId, quantity = 1) {
        const itemId = this.player.equipment[slot];
        if (!itemId) return { success: false, msg: 'Không có pháp bảo để nuôi dưỡng.' };

        if (!this.player.inventory.hasItem(materialId, quantity)) {
            return { success: false, msg: 'Không đủ vật liệu để nuôi dưỡng.' };
        }

        const material = getItemById(materialId);
        // Giả sử vật liệu tăng linh tính dựa trên phẩm cấp
        const spiritGain = (material.price / 10) * quantity; 

        this.player.inventory.removeItem(materialId, quantity);
        
        // Cần lưu metadata cho trang bị. 
        // Hiện tại equipment chỉ lưu ID, ta cần một map để lưu metadata trang bị
        if (!this.player.equipmentMetadata) this.player.equipmentMetadata = {};
        if (!this.player.equipmentMetadata[slot]) {
            this.player.equipmentMetadata[slot] = { spirit: 0, level: 1, durability: 100 };
        }

        const meta = this.player.equipmentMetadata[slot];
        meta.spirit += spiritGain;

        // Thăng cấp nếu đủ linh tính
        const nextLevelSpirit = meta.level * 500;
        let leveledUp = false;
        if (meta.spirit >= nextLevelSpirit) {
            meta.spirit -= nextLevelSpirit;
            meta.level++;
            leveledUp = true;
        }

        this.player.calculateStats();
        return { 
            success: true, 
            msg: `Nuôi dưỡng thành công! ${leveledUp ? 'Pháp bảo đã thăng cấp!' : ''} Linh tính +${spiritGain.toFixed(1)}`,
            leveledUp
        };
    }

    /**
     * Sửa chữa Pháp Bảo (Repair)
     */
    /**
     * Sửa chữa Pháp Bảo (Repair)
     * @param {string} slot - Vị trí trang bị
     * @param {string} method - 'dan_fire' | 'forge' | 'hire'
     * @param {string|null} materialId - Vật liệu dùng để thối hỏa sửa chữa
     */
    repair(slot, method = 'hire', materialId = null) {
        const itemId = this.player.equipment[slot];
        if (!itemId) return { success: false, msg: 'Không có pháp bảo để sửa chữa.' };

        if (!this.player.equipmentMetadata || !this.player.equipmentMetadata[slot]) {
            return { success: false, msg: 'Pháp bảo vẫn còn hoàn hảo.' };
        }

        const meta = this.player.equipmentMetadata[slot];
        if (meta.durability >= 100) return { success: false, msg: 'Độ bền đã ở mức tối đa.' };

        // Xác định nguyên liệu tương thích
        let compatibleMatIds = [];
        const recipe = SMITHING_RECIPES[itemId];
        if (recipe) {
            compatibleMatIds = recipe.materials.map(m => m.id);
        } else {
            const natalConfig = NATAL_TREASURE_CONFIGS[itemId];
            if (natalConfig && natalConfig.costs && natalConfig.costs.materials) {
                compatibleMatIds = Object.keys(natalConfig.costs.materials);
            } else {
                compatibleMatIds = ['huyen_thiet', 'tinh_kim'];
            }
        }

        // Loại bỏ Linh Thạch khỏi danh sách nguyên liệu
        compatibleMatIds = compatibleMatIds.filter(id => !id.includes('linh_thach'));

        // Nếu không truyền materialId và không phải dan_fire, tự động tìm nguyên liệu có sẵn
        if (!materialId && method !== 'dan_fire') {
            materialId = compatibleMatIds.find(id => this.player.inventory.hasItem(id, 1));
            if (!materialId) {
                const matNames = compatibleMatIds.map(id => getItemById(id)?.name || id).join(', ');
                return { success: false, msg: `Thiếu nguyên liệu sửa chữa! Cần 1x nguyên liệu tương thích (${matNames}).` };
            }
        }

        const pointsNeeded = 100 - meta.durability;

        if (method === 'dan_fire') {
            if (this.player.realmId < 18) {
                return { success: false, msg: 'Cảnh giới chưa đạt Kết Đan Kỳ, chưa thể ngưng tụ Đan Hỏa để tự ôn dưỡng pháp bảo!' };
            }
            if (meta.durability < 80) {
                return { success: false, msg: 'Pháp bảo bị hư hại quá nặng (dưới 80%), Đan Hỏa không thể tự khôi phục, cần phải rèn sửa!' };
            }
            const staminaCost = pointsNeeded * 5;
            const manaCost = pointsNeeded * 20;
            if (this.player.stamina < staminaCost || this.player.mana < manaCost) {
                return { success: false, msg: `Không đủ trạng thái để ôn dưỡng (Cần ${staminaCost} Thể lực, ${manaCost} Linh lực)!` };
            }
            this.player.stamina -= staminaCost;
            this.player.mana -= manaCost;
            meta.durability = 100;
            this.player.calculateStats();
            return { success: true, msg: `Dùng Đan Hỏa ôn dưỡng thành công! Độ bền khôi phục lên 100% (Tiêu hao ${staminaCost} Thể lực, ${manaCost} Linh lực).` };
        }

        if (method === 'forge') {
            const flame = getFlameById(this.player.currentFlame);
            const tool = getItemById(this.player.smithingTool);
            if (!flame || !tool) {
                return { success: false, msg: 'Ngươi cần có Linh Hỏa và Dụng Cụ Rèn được trang bị để tự rèn sửa pháp bảo!' };
            }
            const requiredLevel = recipe ? recipe.level : 1;
            if (this.player.smithingLevel < requiredLevel) {
                return { success: false, msg: `Cấp Luyện Khí Sư chưa đủ để tự rèn sửa pháp khí/pháp bảo này (Yêu cầu cấp ${requiredLevel})!` };
            }
            if (!this.player.inventory.hasItem(materialId, 1)) {
                return { success: false, msg: `Không đủ nguyên liệu sửa chữa trong túi: 1x ${getItemById(materialId)?.name || materialId}!` };
            }
            const cost = pointsNeeded * 2;
            if (this.player.lingShi < cost) {
                return { success: false, msg: `Cần ${cost} Linh Thạch để mua dung môi rèn sửa!` };
            }

            this.player.inventory.removeItem(materialId, 1);
            this.player.spendLingShi(cost);
            meta.durability = 100;
            this.player.calculateStats();
            return { success: true, msg: `Tự rèn sửa pháp bảo thành công! Tiêu hao 1x ${getItemById(materialId).name} và ${cost} Linh Thạch.` };
        }

        if (method === 'hire') {
            if (!this.player.inventory.hasItem(materialId, 1)) {
                return { success: false, msg: `Không đủ nguyên liệu sửa chữa trong túi: 1x ${getItemById(materialId)?.name || materialId}!` };
            }
            const cost = pointsNeeded * 15;
            if (this.player.lingShi < cost) {
                return { success: false, msg: `Không đủ Linh Thạch để thuê sửa chữa (Cần ${cost} Linh Thạch)!` };
            }

            this.player.inventory.removeItem(materialId, 1);
            this.player.spendLingShi(cost);
            meta.durability = 100;
            this.player.calculateStats();
            return { success: true, msg: `Thuê Luyện Khí Sư sửa chữa thành công! Tiêu hao 1x ${getItemById(materialId).name} và ${cost} Linh Thạch.` };
        }

        return { success: false, msg: 'Phương thức sửa chữa không hợp lệ.' };
    }

    /**
     * Tẩy luyện (Refine) - Reroll thuộc tính ẩn
     */
    refine(slot) {
        const itemId = this.player.equipment[slot];
        if (!itemId) return { success: false, msg: 'Không có pháp bảo để tẩy luyện.' };

        const cost = 1000; // Phí tẩy luyện
        if (this.player.spendLingShi(cost)) {
            if (!this.player.equipmentMetadata) this.player.equipmentMetadata = {};
            if (!this.player.equipmentMetadata[slot]) this.player.equipmentMetadata[slot] = {};
            
            const meta = this.player.equipmentMetadata[slot];
            // Random một thuộc tính nâng cao
            const advancedStats = ['pierce', 'soulPierce', 'critRate', 'critDmg', 'lifeSteal'];
            const randomStat = advancedStats[Math.floor(Math.random() * advancedStats.length)];
            const randomValue = (Math.random() * 0.1).toFixed(3); // 0-10%

            meta.extraStat = { type: randomStat, value: parseFloat(randomValue) };
            
            this.player.calculateStats();
            return { success: true, msg: `Tẩy luyện thành công! Nhận thêm: ${randomStat} +${(randomValue * 100).toFixed(1)}%` };
        }
        return { success: false, msg: 'Không đủ Linh Thạch để tẩy luyện.' };
    }

    /**
     * Cập nhật logic theo thời gian (VD: Chưởng Thiên Bình sinh linh dịch)
     */
    update(delta) {
        // Kiểm tra xem có trang bị Chưởng Thiên Bình không
        const equippedArtifacts = Object.values(this.player.equipment || {});
        if (equippedArtifacts.includes('chuong_thien_binh')) {
            if (!this.player.artifactData) this.player.artifactData = {};
            if (!this.player.artifactData.chuong_thien_binh) {
                this.player.artifactData.chuong_thien_binh = { progress: 0 };
            }

            const data = this.player.artifactData.chuong_thien_binh;
            // Mỗi 10 phút game sinh 1 giọt linh dịch (tỉ lệ 1/600 progress mỗi giây delta)
            // Giả sử 1 giây thực = 1 phút game? Tùy TimeSystem.
            // Ở đây dùng một hằng số tạm thời: 1 giọt mỗi 5 phút thực (300s)
            data.progress += delta;
            if (data.progress >= 300) {
                data.progress -= 300;
                this.player.inventory.addItem('linh_dich_chuong_thien_binh', 1);
                if (this.ui) this.ui.toast("Chưởng Thiên Bình đã ngưng tụ được 1 giọt Linh Dịch!", "success");
            }
        }
    }

    /**
     * Kết hợp các ngọn Cực Sơn thành Nguyên Hợp Ngũ Cực Sơn
     */
    combineMountains() {
        const requiredMountains = ['nguyen_tu_cuc_son', 'bac_cuc_cuc_son']; // Có thể thêm nhiều hơn sau này
        for (const mountainId of requiredMountains) {
            if (!this.player.inventory.hasItem(mountainId)) {
                return { success: false, msg: `Thiếu ngọn núi: ${getItemById(mountainId).name}!` };
            }
        }

        // Tiêu tốn linh thạch khổng lồ
        const cost = 1000000;
        if (this.player.lingShi < cost) return { success: false, msg: "Cần 1.000.000 Linh Thạch để dung hợp Cực Sơn!" };

        this.player.spendLingShi(cost);
        requiredMountains.forEach(id => this.player.inventory.removeItem(id, 1));
        
        this.player.inventory.addItem('nguyen_hop_ngu_cuc_son', 1);
        return { success: true, msg: "Chúc mừng! Ngươi đã dung hợp thành công Nguyên Hợp Ngũ Cực Sơn!" };
    }
}
