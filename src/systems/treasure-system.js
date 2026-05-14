import { getItemById } from '../configs/item-data.js';
import { ARTIFACT_TIERS, ARTIFACT_QUALITIES, ARTIFACT_STATS } from '../configs/artifact-data.js';

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
    repair(slot) {
        const itemId = this.player.equipment[slot];
        if (!itemId) return { success: false, msg: 'Không có pháp bảo để sửa chữa.' };

        if (!this.player.equipmentMetadata || !this.player.equipmentMetadata[slot]) {
            return { success: false, msg: 'Pháp bảo vẫn còn hoàn hảo.' };
        }

        const meta = this.player.equipmentMetadata[slot];
        if (meta.durability >= 100) return { success: false, msg: 'Độ bền đã ở mức tối đa.' };

        const cost = (100 - meta.durability) * 5; // 5 linh thạch mỗi điểm độ bền
        if (this.player.spendLingShi(cost)) {
            meta.durability = 100;
            return { success: true, msg: `Sửa chữa thành công! Tiêu tốn ${cost} Linh Thạch.` };
        }
        return { success: false, msg: 'Không đủ Linh Thạch để sửa chữa.' };
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
                this.player.inventory.addItem('linh_dich', 1);
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
