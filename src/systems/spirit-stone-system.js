import { SPIRIT_STONE_GRADES, SPIRIT_STONE_QUALITIES, SPIRIT_STONE_ATTRIBUTES, CONVERSION_RATE } from '../configs/spirit-stone-data.js';
import { getItemById } from '../configs/item-data.js';

/**
 * Hệ thống Quản lý Linh Thạch (Spirit Stone System)
 * Quản lý việc chuyển đổi, hấp thụ và sử dụng linh thạch như một nguồn tài nguyên vật lý.
 */
export class SpiritStoneSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        
        // Cấu hình mặc định nếu chưa có
        if (!this.player.spiritStoneSettings) {
            this.player.spiritStoneSettings = {
                autoUsePriority: ['HA', 'TRUNG', 'THUONG'], // Thứ tự ưu tiên tiêu thụ
                lockCucPham: true, // Không tự động dùng Cực Phẩm
                autoConvertWaste: false // Tự động chuyển phế thạch?
            };
        }
    }

    /**
     * Chuyển đổi linh thạch cấp thấp lên cấp cao (Merge)
     * @param {string} fromGradeId - Grade ID (HA, TRUNG, THUONG)
     * @param {number} count - Số lượng viên muốn ghép (bội số của CONVERSION_RATE)
     */
    merge(fromGradeId, count) {
        const fromGrade = SPIRIT_STONE_GRADES[fromGradeId];
        if (!fromGrade || !fromGrade.nextGrade) return { success: false, msg: "Không thể nâng cấp loại linh thạch này." };

        const toGradeId = fromGrade.nextGrade;
        const required = Math.floor(count / CONVERSION_RATE) * CONVERSION_RATE;
        const resultCount = required / CONVERSION_RATE;

        const fromItemId = this.getItemIdByGrade(fromGradeId);
        const toItemId = this.getItemIdByGrade(toGradeId);

        if (this.player.inventory.hasItem(fromItemId, required)) {
            this.player.inventory.removeItem(fromItemId, required);
            this.player.inventory.addItem(toItemId, resultCount);
            this.ui?.toast(`Ghép thành công ${resultCount} viên ${SPIRIT_STONE_GRADES[toGradeId].name}.`, 'success');
            return { success: true };
        }

        return { success: false, msg: "Không đủ linh thạch để ghép." };
    }

    /**
     * Tách linh thạch cấp cao xuống cấp thấp (Split)
     * @param {string} fromGradeId - Grade ID (TRUNG, THUONG, CUC)
     * @param {number} count - Số lượng viên muốn tách
     */
    split(fromGradeId, count) {
        const grades = Object.values(SPIRIT_STONE_GRADES);
        const gradeIndex = grades.findIndex(g => g.id === fromGradeId);
        if (gradeIndex <= 0) return { success: false, msg: "Không thể tách loại linh thạch này." };

        const toGradeId = grades[gradeIndex - 1].id;
        const resultCount = count * CONVERSION_RATE;

        const fromItemId = this.getItemIdByGrade(fromGradeId);
        const toItemId = this.getItemIdByGrade(toGradeId);

        if (this.player.inventory.hasItem(fromItemId, count)) {
            this.player.inventory.removeItem(fromItemId, count);
            this.player.inventory.addItem(toItemId, resultCount);
            this.ui?.toast(`Tách thành công ${count} viên ${SPIRIT_STONE_GRADES[fromGradeId].name} thành ${resultCount} viên ${SPIRIT_STONE_GRADES[toGradeId].name}.`, 'success');
            return { success: true };
        }

        return { success: false, msg: "Không đủ linh thạch để tách." };
    }

    /**
     * Hấp thụ linh thạch để tăng tu vi hoặc hồi phục
     */
    absorb(itemId, count = 1) {
        const item = getItemById(itemId);
        if (!item || item.type !== 'linh_thach') return { success: false, msg: "Vật phẩm không phải linh thạch." };

        if (!this.player.inventory.hasItem(itemId, count)) return { success: false, msg: "Không đủ linh thạch." };

        const grade = SPIRIT_STONE_GRADES[item.grade];
        const attr = SPIRIT_STONE_ATTRIBUTES[item.attribute || 'NORMAL'];
        const quality = SPIRIT_STONE_QUALITIES[item.quality_tier || 'BINH_THUONG']; 

        // Tính toán hiệu quả
        // Cấp càng cao linh lực càng tinh thuần
        const baseQi = grade.multiplier * 10; 
        
        // Bonus thuộc tính: Nếu thuộc tính linh thạch trùng với linh căn của người chơi
        let attrBonus = 1.0;
        if (item.attribute !== 'NORMAL') {
            const playerRoot = this.player.spiritRoot || []; // Giả sử player có mảng linh căn
            if (playerRoot.includes(item.attribute)) {
                attrBonus = 1.5; // Tăng 50% hiệu quả nếu đúng thuộc tính
            } else if (item.attribute === 'DEMON' && this.player.path === 'MA') {
                attrBonus = 2.0;
            }
        }

        const totalQi = baseQi * quality.multiplier * attrBonus * count;

        // Hấp thụ qua Energy System
        const es = state.systems.energy;
        if (es) {
            const qiType = this.mapAttributeToQiType(item.attribute);
            const result = es.absorbQi(qiType, totalQi, item.quality_tier || 'TINH_THUAN');
            
            if (result.success) {
                this.player.inventory.removeItem(itemId, count);
                // Tạo phế thạch (chỉ cấp thấp mới để lại phế thạch, cấp cao hóa hư không)
                if (['HA', 'TRUNG'].includes(item.grade)) {
                    this.player.inventory.addItem('phe_linh_thach', count);
                }
                
                this.ui?.toast(`Hấp thụ ${count} viên ${item.name}, nhận ${Math.floor(result.gain)} linh khí.`, 'success');
                return { success: true };
            } else {
                return { success: false, msg: result.reason || "Hấp thụ thất bại." };
            }
        }

        return { success: false, msg: "Hệ thống năng lượng chưa sẵn sàng." };
    }

    /**
     * Bóp nát linh thạch để hồi phục Linh Lực (Mana) tức thời
     * Thường dùng trong chiến đấu
     */
    crushStone(itemId, count = 1) {
        const item = getItemById(itemId);
        if (!item || item.type !== 'linh_thach') return { success: false, msg: "Không thể bóp nát vật phẩm này." };

        if (!this.player.inventory.hasItem(itemId, count)) return { success: false, msg: "Không đủ linh thạch." };

        const grade = SPIRIT_STONE_GRADES[item.grade];
        // Hồi phục Mana dựa trên phẩm cấp
        const manaGain = grade.multiplier * 5 * count;
        
        this.player.mana = Math.min(this.player.maxMana, this.player.mana + manaGain);
        this.player.inventory.removeItem(itemId, count);
        
        if (['HA', 'TRUNG'].includes(item.grade)) {
            this.player.inventory.addItem('phe_linh_thach', count);
        }

        this.ui?.toast(`Bóp nát ${count} viên ${item.name}, hồi phục ${manaGain} Linh Lực!`, 'success');
        return { success: true, gain: manaGain };
    }

    /**
     * Tự động tiêu tốn linh thạch khi bế quan hoặc dùng trận pháp
     * Trả về số lượng linh khí cung cấp
     */
    consumeAutomatic(requiredEnergy) {
        let provided = 0;
        const priority = this.player.spiritStoneSettings.autoUsePriority;

        for (const gradeId of priority) {
            if (gradeId === 'CUC' && this.player.spiritStoneSettings.lockCucPham) continue;
            if (['TIEN', 'HON_DON', 'HONG_MONG'].includes(gradeId)) continue; // Never auto-use supreme crystals

            const itemId = this.getItemIdByGrade(gradeId);
            const gradeData = SPIRIT_STONE_GRADES[gradeId];
            const energyPerStone = gradeData.multiplier * 10;

            const inventoryItem = this.player.inventory.allItems.find(i => i.id === itemId);
            if (inventoryItem && inventoryItem.quantity > 0) {
                const stonesNeeded = Math.ceil((requiredEnergy - provided) / energyPerStone);
                const stonesToUse = Math.min(inventoryItem.quantity, stonesNeeded);

                provided += stonesToUse * energyPerStone;
                this.player.inventory.removeItem(itemId, stonesToUse);
                if (['HA', 'TRUNG'].includes(gradeId)) {
                    this.player.inventory.addItem('phe_linh_thach', stonesToUse);
                }

                if (provided >= requiredEnergy) break;
            }
        }

        return provided;
    }

    getItemIdByGrade(gradeId) {
        switch (gradeId) {
            case 'HA': return 'ha_pham_linh_thach';
            case 'TRUNG': return 'trung_pham_linh_thach';
            case 'THUONG': return 'thuong_pham_linh_thach';
            case 'CUC': return 'cuc_pham_linh_thach';
            case 'TIEN': return 'tien_tinh';
            case 'HON_DON': return 'hon_don_tinh';
            case 'HONG_MONG': return 'hong_mong_linh_tinh';
            default: return 'ha_pham_linh_thach';
        }
    }

    mapAttributeToQiType(attr) {
        const mapping = {
            'NORMAL': 'linh_khi',
            'FIRE': 'viem_khi',
            'ICE': 'han_khi',
            'LIGHTNING': 'loi_khi',
            'WOOD': 'linh_khi', 
            'METAL': 'linh_khi', // Placeholder
            'EARTH': 'linh_khi', // Placeholder
            'DEMON': 'ma_khi',
            'IMMORTAL': 'tien_khi'
        };
        return mapping[attr] || 'linh_khi';
    }
}

