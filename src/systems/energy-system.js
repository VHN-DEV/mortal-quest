import { ENERGY_TYPES, QI_PURITY, QI_CONFLICTS, getEnergyTypeById } from '../configs/energy-data.js';
import { getLocationById } from '../configs/map-data.js';
import { getRealmById } from '../configs/realm-data.js';

/**
 * Hệ thống Quản lý Khí (Energy System)
 * Phụ trách: Hấp thụ, Phản phệ, Xung đột và Bonus thuộc tính từ 16 loại khí.
 */
export class EnergySystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        
        // Đảm bảo player có các trường cần thiết
        if (!this.player.qiAccumulated) this.player.qiAccumulated = {};
        if (!this.player.currentEnvironmentalQi) this.player.currentEnvironmentalQi = null;
    }

    /**
     * Cập nhật linh khí môi trường mỗi tick
     */
    updateEnvironmental(location) {
        if (!location) return;

        if (location.energies) {
            this.player.currentEnvironmentalQi = location.energies;
            
            // Tự động hấp thụ một lượng nhỏ khí từ môi trường
            location.energies.forEach(e => {
                const absorbAmount = (e.concentration / 100) * 0.1; // 0.1 Qi per concentration unit per tick
                this.absorbQi(e.type, absorbAmount, e.purity || 'TAP');
            });
        } else {
            // Môi trường mặc định
            this.absorbQi('linh_khi', 0.05, 'TAP');
        }
    }

    /**
     * Hấp thụ khí (từ môi trường, vật phẩm hoặc kỳ ngộ)
     */
    absorbQi(typeId, amount, purityId = 'TINH_THUAN') {
        const type = ENERGY_TYPES[typeId];
        const purity = QI_PURITY[purityId] || QI_PURITY.TINH_THUAN;

        if (!type) return { success: false, msg: "Khí tức không xác định" };

        // 1. Kiểm tra yêu cầu (Realm/Physique)
        const reqCheck = this.checkRequirements(typeId);
        if (!reqCheck.success) {
            // Nếu độ tinh khiết cao (Tiên khí/Đạo khí) có thể bỏ qua yêu cầu một phần
            if (purity.multiplier < 5.0) {
                if (amount > 1) { // Chỉ toast nếu lượng hấp thụ lớn (vật phẩm)
                    this.ui?.toast(reqCheck.reason, 'error');
                }
                // Gây sát thương nếu cố tình hấp thụ khí quá mạnh
                this.player.hp -= amount * 2;
                return { success: false, reason: reqCheck.reason };
            }
        }

        // 2. Kiểm tra xung đột (Qi Conflict)
        const conflict = this.checkConflicts(typeId);
        if (conflict) {
            const damage = amount * conflict.severity * 5;
            this.player.hp -= damage;
            if (amount > 10) {
                this.ui?.toast(`Xung đột khí tức: ${type.name} vs ${ENERGY_TYPES[conflict.type2 || conflict.type1].name}!`, 'warning');
            }
        }

        // 3. Nguy cơ tẩu hỏa nhập ma (Backlash)
        const backlashChance = (type.danger * 0.4) + (1 - type.stability) * 0.3;
        if (Math.random() < backlashChance && amount > 50) {
            const loss = this.player.tuVi * 0.03 * (1 + type.danger);
            this.player.tuVi = Math.max(0, this.player.tuVi - loss);
            this.player.hp -= amount * 2;
            this.ui?.toast(`Tẩu hỏa nhập ma khi hấp thụ ${type.name}!`, 'error');
            return { success: false, msg: "Backlash" };
        }

        // 4. Thực hiện hấp thụ
        const actualGain = amount * purity.multiplier;
        
        if (!this.player.qiAccumulated[typeId]) {
            this.player.qiAccumulated[typeId] = { amount: 0, purity: purityId };
        } else {
            // Cập nhật độ tinh khiết cao nhất từng đạt được
            if (purity.multiplier > (QI_PURITY[this.player.qiAccumulated[typeId].purity]?.multiplier || 0)) {
                this.player.qiAccumulated[typeId].purity = purityId;
            }
        }

        this.player.qiAccumulated[typeId].amount += actualGain;

        // 5. Thăng tiến Tu Vi (Chỉ khi có công pháp để luyện hóa khí môi trường)
        const cultivationMult = this.getCultivationMultiplier(typeId);
        if (cultivationMult > 0 && this.player.mainTechniqueId) {
            this.player.tuVi += actualGain * cultivationMult;
        }

        return { success: true, gain: actualGain };
    }

    /**
     * Kiểm tra yêu cầu kỹ thuật để hấp thụ
     */
    checkRequirements(typeId) {
        const type = ENERGY_TYPES[typeId];
        if (!type || !type.requirement) return { success: true };

        const reqs = type.requirement;
        
        // Realm requirement
        if (reqs.realm && this.player.realmId < reqs.realm) {
            const realm = getRealmById(reqs.realm);
            return { success: false, reason: `Cảnh giới quá thấp để dung nạp ${type.name} (Yêu cầu: ${realm ? realm.name : 'Cảnh giới ' + reqs.realm}).` };
        }
        
        // Physique requirement
        if (reqs.physique && (!this.player.physique || !this.player.physique.includes(reqs.physique))) {
            return { success: false, reason: `Yêu cầu thể chất ${reqs.physique} để dung nạp ${type.name}.` };
        }

        return { success: true };
    }

    /**
     * Kiểm tra xung đột với khí tức hiện có
     */
    checkConflicts(typeId) {
        for (const conflict of QI_CONFLICTS) {
            if (conflict.type1 === typeId && (this.player.qiAccumulated[conflict.type2]?.amount || 0) > 100) {
                return conflict;
            }
            if (conflict.type2 === typeId && (this.player.qiAccumulated[conflict.type1]?.amount || 0) > 100) {
                return conflict;
            }
        }
        return null;
    }

    /**
     * Lấy hệ số tăng trưởng tu vi từ loại khí
     */
    getCultivationMultiplier(typeId) {
        const mapping = {
            'linh_khi': 1.0,
            'ma_khi': 1.5, // Ma đạo tiến triển nhanh
            'tien_khi': 3.0,
            'hon_don_khi': 10.0,
            'hao_nhien_chinh_khi': 1.2,
            'tu_khi': 0.8, // Khó tu luyện thành tu vi
            'yeu_khi': 0.5
        };
        return mapping[typeId] || 0;
    }

    /**
     * Tính toán tổng bonus thuộc tính từ khí tích lũy
     */
    getStatBonuses() {
        const bonuses = { atk: 0, def: 0, spd: 0, hp: 0, mana: 0, soul: 0, luck: 0 };
        
        Object.entries(this.player.qiAccumulated).forEach(([typeId, data]) => {
            const amount = data.amount;
            if (amount <= 0) return;

            const logAmount = Math.log10(amount + 1);
            const scale = 20; // Base scale factor

            switch (typeId) {
                case 'linh_khi':
                    bonuses.mana += logAmount * scale * 5;
                    break;
                case 'ma_khi':
                    bonuses.atk += logAmount * scale * 4;
                    bonuses.hp -= logAmount * scale * 2;
                    break;
                case 'yeu_khi':
                    bonuses.hp += logAmount * scale * 8;
                    bonuses.atk += logAmount * scale * 2;
                    break;
                case 'han_khi':
                    bonuses.def += logAmount * scale * 3;
                    bonuses.spd -= logAmount * scale;
                    break;
                case 'viem_khi':
                    bonuses.atk += logAmount * scale * 5;
                    break;
                case 'loi_khi':
                    bonuses.atk += logAmount * scale * 6;
                    bonuses.spd += logAmount * scale * 3;
                    break;
                case 'kiem_khi':
                    bonuses.atk += logAmount * scale * 10;
                    break;
                case 'hon_khi':
                    bonuses.soul += logAmount * scale * 10;
                    break;
                case 'tu_khi':
                    bonuses.atk += logAmount * scale * 3;
                    bonuses.hp -= logAmount * scale * 5;
                    break;
                case 'sinh_khi':
                    bonuses.hp += logAmount * scale * 20;
                    break;
                case 'khong_gian_chi_khi':
                    bonuses.spd += logAmount * scale * 15;
                    break;
                case 'thoi_gian_chi_khi':
                    bonuses.spd += logAmount * scale * 50;
                    break;
                case 'hon_don_khi':
                    bonuses.atk += logAmount * scale * 20;
                    bonuses.def += logAmount * scale * 20;
                    bonuses.hp += logAmount * scale * 50;
                    break;
                case 'tien_khi':
                    bonuses.atk += logAmount * scale * 30;
                    bonuses.def += logAmount * scale * 30;
                    break;
                case 'hong_mong_tu_khi':
                    bonuses.luck += logAmount * scale * 0.5;
                    bonuses.atk += logAmount * scale * 50;
                    break;
                case 'hao_nhien_chinh_khi':
                    bonuses.def += logAmount * scale * 10;
                    bonuses.luck += logAmount * scale * 0.1;
                    break;
            }
        });

        return bonuses;
    }

    getEnergyType(id) {
        return ENERGY_TYPES[id] || { name: 'Unknown', icon: '❓' };
    }

    getPurity(id) {
        return QI_PURITY[id] || { name: 'Bình thường' };
    }
}
