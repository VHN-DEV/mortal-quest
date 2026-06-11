import { BEASTS, getBeastLevelInfo, BLOODLINES, BEAST_TYPES } from '../configs/beast-data.js';
import { getItemById } from '../configs/item-data.js';

export class BeastSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
    }

    /**
     * Bắt đầu ấp trứng ở một slot cụ thể
     */
    startHatching(eggId, slotIndex) {
        if (slotIndex < 0 || slotIndex >= 3) {
            return { success: false, msg: 'Vị trí lò ấp không hợp lệ!' };
        }

        if (this.player.hatchingBeasts[slotIndex] !== null) {
            return { success: false, msg: 'Lò ấp này đã có trứng đang ấp!' };
        }

        const item = getItemById(eggId);
        if (!item || item.type !== 'trung_linh_thu') {
            return { success: false, msg: 'Đây không phải trứng linh thú!' };
        }

        if (!this.player.inventory.hasItem(eggId, 1)) {
            return { success: false, msg: 'Bạn không có trứng này trong túi đồ!' };
        }

        const beastData = BEASTS[item.beastId];
        if (!beastData) {
            return { success: false, msg: 'Dữ liệu linh thú lỗi!' };
        }

        // Remove egg from inventory
        this.player.inventory.removeItem(eggId, 1);

        // Put egg in slot (hatchTime defaults to 300 seconds if not specified)
        const hatchTime = item.hatchTime || 300;
        this.player.hatchingBeasts[slotIndex] = {
            id: eggId,
            beastId: item.beastId,
            name: item.name,
            icon: item.icon || '🥚',
            timeLeft: hatchTime,
            totalTime: hatchTime,
            status: 'hatching',
            startedAt: Date.now()
        };

        return { success: true, msg: `Đã đặt ${item.name} vào lò ấp số ${slotIndex + 1}!`, slotIndex };
    }

    /**
     * Gia tốc ấp trứng bằng Linh thạch hoặc Hàn Ngọc Tủy
     */
    speedUpHatching(slotIndex, method) {
        const slot = this.player.hatchingBeasts[slotIndex];
        if (!slot || slot.status !== 'hatching') {
            return { success: false, msg: 'Khe này không có trứng đang ấp!' };
        }

        if (method === 'spirit_stone') {
            const cost = 100;
            if (this.player.lingShi < cost) {
                return { success: false, msg: 'Không đủ Linh thạch (cần 100 LT)!' };
            }
            this.player.spendLingShi(cost);
            slot.timeLeft = Math.max(0, slot.timeLeft - 600); // Giảm 10 phút (600s)
            if (slot.timeLeft <= 0) {
                slot.timeLeft = 0;
                slot.status = 'completed';
            }
            return { success: true, msg: `Đã gia tốc ấp trứng thêm 10 phút bằng Linh thạch!` };
        } else if (method === 'spirit_dich') {
            if (!this.player.inventory.hasItem('han_ngoc_tuy', 1)) {
                return { success: false, msg: 'Không có Hàn Ngọc Tủy trong túi đồ!' };
            }
            this.player.inventory.removeItem('han_ngoc_tuy', 1);
            slot.timeLeft = 0;
            slot.status = 'completed';
            return { success: true, msg: `Hàn Ngọc Tủy chứa sinh cơ tuyệt đối đã giúp trứng lập tức hóa hình!` };
        }

        return { success: false, msg: 'Phương pháp gia tốc không hợp lệ!' };
    }

    /**
     * Nhận chủ linh thú/kỳ trùng đã hoàn thành ấp nở
     */
    claimHatchedBeast(slotIndex, contractType) {
        const slot = this.player.hatchingBeasts[slotIndex];
        if (!slot) {
            return { success: false, msg: 'Khe lò ấp trống!' };
        }
        if (slot.status !== 'completed' && slot.timeLeft > 0) {
            return { success: false, msg: 'Trứng chưa hoàn thành ấp nở!' };
        }

        const beastData = BEASTS[slot.beastId];
        if (!beastData) {
            return { success: false, msg: 'Dữ liệu linh thú lỗi!' };
        }

        if (contractType === 'blood') {
            // Huyết Khế: Khấu trừ 15% HP và giảm 5% Max HP trong 10 phút
            const hpCost = Math.floor(this.player.maxHp * 0.15);
            this.player.hp = Math.max(1, this.player.hp - hpCost);
            this.player.bloodContractDebuffUntil = Date.now() + 10 * 60 * 1000;
        } else if (contractType === 'soul') {
            // Hồn Khế: Yêu cầu tối thiểu 10 Thần Thức
            if (this.player.divineSense < 10) {
                return { success: false, msg: 'Thần thức quá yếu (cần tối thiểu 10) để ký kết Hồn Khế!' };
            }
        } else {
            return { success: false, msg: 'Loại khế ước không hợp lệ!' };
        }

        const newBeast = {
            id: beastData.id,
            uniqueId: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            name: beastData.name,
            level: 1,
            exp: 0,
            loyalty: 50,
            bloodline: beastData.bloodline,
            bornAt: Date.now(),
            stats: { ...beastData.baseStats },
            contractType: contractType,
            status: 'normal'
        };

        this.player.beasts.push(newBeast);
        this.player.hatchingBeasts[slotIndex] = null;
        this.player.calculateStats();

        // Cộng EXP nghề nghiệp tương ứng
        const isInsect = [BEAST_TYPES.LINH_TRUNG, BEAST_TYPES.KY_TRUNG].includes(beastData.type);
        if (isInsect) {
            this.player.addInsectExp(100);
        } else {
            this.player.addBeastExp(100);
        }

        return {
            success: true,
            msg: `Chúc mừng! Ngươi đã nhận chủ thành công ${newBeast.name} bằng ${contractType === 'blood' ? 'Huyết Khế' : 'Hồn Khế'}!`,
            beast: newBeast
        };
    }

    /**
     * Cho thú nuôi ăn
     */
    feed(beastUniqueId, foodId) {
        const beast = this.player.beasts.find(b => b.uniqueId === beastUniqueId);
        if (!beast) return { success: false, msg: 'Không tìm thấy linh thú!' };

        // Xử lý khi thú nuôi đang bị thương nặng do lôi kiếp
        if (beast.status === 'injured') {
            if (foodId === 'linh_thu_dan') {
                if (!this.player.inventory.hasItem('linh_thu_dan', 5)) {
                    return { success: false, msg: 'Cần 5 viên Linh Thú Đan để điều trị vết thương!' };
                }
                this.player.inventory.removeItem('linh_thu_dan', 5);
                beast.status = 'normal';
                return { success: true, msg: `Vết thương của ${beast.name} đã khép lại và nó đã tỉnh dậy!` };
            } else if (foodId === 'han_ngoc_tuy') {
                if (!this.player.inventory.hasItem('han_ngoc_tuy', 1)) {
                    return { success: false, msg: 'Cần 1 giọt Hàn Ngọc Tủy để trị thương!' };
                }
                this.player.inventory.removeItem('han_ngoc_tuy', 1);
                beast.status = 'normal';
                return { success: true, msg: `Dược tính mát mẻ của Hàn Ngọc Tủy giúp ${beast.name} hoàn toàn bình phục!` };
            } else {
                return { success: false, msg: 'Linh thú đang hôn mê trọng thương, chỉ có thể dùng Linh Thú Đan (5 viên) hoặc Hàn Ngọc Tủy (1 giọt) để trị thương!' };
            }
        }

        const item = getItemById(foodId);
        if (!item) return { success: false, msg: 'Vật phẩm không hợp lệ!' };

        let expGain = 0;
        let loyaltyGain = 0;
        const isMetal = ['huyen_thiet', 'tinh_kim'].includes(foodId);
        const isYeuDan = ['ha_pham_yeu_dan', 'trung_pham_yeu_dan'].includes(foodId);
        const isNormalFood = ['linh_thu_dan', 'yeu_nhuc_tuoi'].includes(foodId);

        const beastData = BEASTS[beast.id];
        const isInsect = beastData && [BEAST_TYPES.LINH_TRUNG, BEAST_TYPES.KY_TRUNG].includes(beastData.type);

        if (isMetal) {
            if (!isInsect) {
                return { success: false, msg: 'Linh thú thường không thể nuốt quặng sắt kim loại!' };
            }
            expGain = foodId === 'tinh_kim' ? 1500 : 300;
            loyaltyGain = foodId === 'tinh_kim' ? 10 : 2;
        } else if (isYeuDan) {
            expGain = foodId === 'trung_pham_yeu_dan' ? 2500 : 500;
            loyaltyGain = foodId === 'trung_pham_yeu_dan' ? 15 : 5;
        } else if (isNormalFood) {
            expGain = item.expGain || (foodId === 'linh_thu_dan' ? 100 : 50);
            loyaltyGain = item.loyaltyGain || (foodId === 'linh_thu_dan' ? 5 : 2);
        } else {
            return { success: false, msg: 'Đây không phải thức ăn thích hợp!' };
        }

        if (!this.player.inventory.hasItem(foodId, 1)) {
            return { success: false, msg: `Bạn không có ${item.name} trong túi đồ!` };
        }

        this.player.inventory.removeItem(foodId, 1);
        beast.exp += expGain;
        beast.loyalty = Math.min(100, beast.loyalty + loyaltyGain);

        let leveledUp = false;
        while (beast.exp >= getBeastLevelInfo(beast.level).expRequired) {
            beast.exp -= getBeastLevelInfo(beast.level).expRequired;
            beast.level++;
            leveledUp = true;
            Object.keys(beast.stats).forEach(stat => {
                beast.stats[stat] = Math.floor(beast.stats[stat] * 1.1);
            });
        }

        if (isInsect) {
            this.player.addInsectExp(Math.floor(expGain / 2));
        } else {
            this.player.addBeastExp(Math.floor(expGain / 2));
        }

        this.player.calculateStats();

        return {
            success: true,
            msg: `Đã cho ${beast.name} nuốt ${item.name}. Nhận ${expGain} EXP. ${leveledUp ? 'Nó đã đột phá lên cấp!' : ''}`,
            leveledUp
        };
    }

    /**
     * Cắn nuốt kỳ trùng đồng loại để lấy EXP và cơ hội biến dị
     */
    feedBeastWithBeast(beastUniqueId, victimUniqueId) {
        const beast = this.player.beasts.find(b => b.uniqueId === beastUniqueId);
        if (!beast) return { success: false, msg: 'Không tìm thấy kỳ trùng nhận nuôi!' };

        const victim = this.player.beasts.find(b => b.uniqueId === victimUniqueId);
        if (!victim) return { success: false, msg: 'Không tìm thấy kỳ trùng nguyên liệu!' };

        if (beastUniqueId === victimUniqueId) {
            return { success: false, msg: 'Không thể tự cắn nuốt bản thân!' };
        }

        const beastData = BEASTS[beast.id];
        if (!beastData || ![BEAST_TYPES.LINH_TRUNG, BEAST_TYPES.KY_TRUNG].includes(beastData.type)) {
            return { success: false, msg: 'Chỉ có kỳ trùng hoặc linh trùng mới có thể cắn nuốt đồng loại!' };
        }

        // Remove victim from player beasts
        this.player.beasts = this.player.beasts.filter(b => b.uniqueId !== victimUniqueId);
        if (this.player.activeBeast === victimUniqueId) this.player.activeBeast = null;
        if (this.player.activeInsect === victimUniqueId) this.player.activeInsect = null;

        // EXP calculation: 50% of the victim's total level requirement
        const victimLvlInfo = getBeastLevelInfo(victim.level);
        const victimBaseExp = victimLvlInfo ? victimLvlInfo.expRequired : 100;
        const expGain = Math.floor(victimBaseExp * 0.5) + (victim.exp || 0);

        beast.exp += expGain;
        beast.loyalty = Math.min(100, beast.loyalty + 10);

        // Roll for bloodline mutation chance (5% base + 1% per victim level)
        let mutationMsg = '';
        const mutationChance = 0.05 + (victim.level * 0.01);
        if (Math.random() < mutationChance && beast.bloodline !== 'THAN') {
            const bloodlinesOrder = ['PHAM', 'LINH', 'DIA', 'THIEN', 'THANH', 'TIEN', 'THAN'];
            const currentIdx = bloodlinesOrder.indexOf(beast.bloodline);
            if (currentIdx !== -1 && currentIdx < bloodlinesOrder.length - 1) {
                beast.bloodline = bloodlinesOrder[currentIdx + 1];
                mutationMsg = ` Đặc biệt, cắn nuốt kích hoạt HUYẾT THỐNG ĐỘT BIẾN! Huyết thống thăng cấp lên ${beast.bloodline}!`;
                // Add flat 20% to stats
                Object.keys(beast.stats).forEach(stat => {
                    beast.stats[stat] = Math.floor(beast.stats[stat] * 1.20);
                });
            }
        }

        let leveledUp = false;
        while (beast.exp >= getBeastLevelInfo(beast.level).expRequired) {
            beast.exp -= getBeastLevelInfo(beast.level).expRequired;
            beast.level++;
            leveledUp = true;
            Object.keys(beast.stats).forEach(stat => {
                beast.stats[stat] = Math.floor(beast.stats[stat] * 1.1);
            });
        }

        this.player.addInsectExp(Math.floor(expGain / 2));
        this.player.calculateStats();

        return {
            success: true,
            msg: `Cắn nuốt đồng loại thành công! ${beast.name} nuốt chửng ${victim.name} và nhận ${expGain} EXP.${leveledUp ? ' Lên cấp!' : ''}${mutationMsg}`,
            leveledUp
        };
    }

    /**
     * Cho thú nuôi xuất trận / ngưng xuất trận
     */
    equipBeast(beastUniqueId) {
        const beastObj = this.player.beasts.find(b => b.uniqueId === beastUniqueId);
        if (!beastObj) return { success: false, msg: 'Không tìm thấy linh thú!' };

        if (beastObj.status === 'injured') {
            return { success: false, msg: 'Linh thú đang bị trọng thương, không thể xuất chiến!' };
        }

        const beastData = BEASTS[beastObj.id];
        if (!beastData) return { success: false, msg: 'Dữ liệu linh thú lỗi!' };

        const isInsect = [BEAST_TYPES.LINH_TRUNG, BEAST_TYPES.KY_TRUNG].includes(beastData.type);
        if (isInsect) {
            if (this.player.activeInsect === beastUniqueId) {
                this.player.activeInsect = null;
                this.player.calculateStats();
                return { success: true, msg: `Đã tháo trang bị kỳ trùng: ${beastObj.name}` };
            }
            if (beastObj.contractType === 'soul' && this.player.divineSense < 10) {
                return { success: false, msg: 'Thần thức hiện tại không đủ mạnh (yêu cầu tối thiểu 10) để khống chế thêm kỳ trùng này!' };
            }
            this.player.activeInsect = beastUniqueId;
        } else {
            if (this.player.activeBeast === beastUniqueId) {
                this.player.activeBeast = null;
                this.player.calculateStats();
                return { success: true, msg: `Đã tháo trang bị linh thú: ${beastObj.name}` };
            }
            if (beastObj.contractType === 'soul' && this.player.divineSense < 10) {
                return { success: false, msg: 'Thần thức hiện tại không đủ mạnh (yêu cầu tối thiểu 10) để khống chế thêm linh thú này!' };
            }
            this.player.activeBeast = beastUniqueId;
        }

        this.player.calculateStats();
        return { success: true, msg: `Đã xuất chiến linh thú: ${beastObj.name}` };
    }

    /**
     * Tiến hóa linh thú (bao gồm cơ chế Thiên Kiếp / Yêu Kiếp)
     */
    evolve(beastUniqueId, options = {}) {
        const beast = this.player.beasts.find(b => b.uniqueId === beastUniqueId);
        if (!beast) return { success: false, msg: 'Không tìm thấy linh thú!' };

        if (beast.status === 'injured') {
            return { success: false, msg: 'Thú nuôi đang trọng thương, hãy chữa trị trước!' };
        }

        const beastData = BEASTS[beast.id];
        if (!beastData || !beastData.evolutions) {
            return { success: false, msg: 'Linh thú này không thể tiến hóa thêm!' };
        }

        const evolution = beastData.evolutions.find(e => beast.level >= e.levelRequired);
        if (!evolution) {
            return { success: false, msg: `Chưa đạt cấp yêu cầu để tiến hóa (cần cấp ${beastData.evolutions[0].levelRequired})!` };
        }

        // Check required materials
        if (evolution.materials) {
            for (const mat of evolution.materials) {
                if (!this.player.inventory.hasItem(mat.id, mat.quantity)) {
                    const name = getItemById(mat.id)?.name || mat.id;
                    return { success: false, msg: `Thiếu nguyên liệu tiến hóa: ${name} x${mat.quantity}!` };
                }
            }
        }

        // Consume materials
        if (evolution.materials) {
            evolution.materials.forEach(mat => this.player.inventory.removeItem(mat.id, mat.quantity));
        }

        // Check for Celestial Tribulation (if target level required is 50+)
        const isTribulation = evolution.levelRequired >= 50;
        if (isTribulation) {
            // Yêu Kiếp / Hóa hình lôi kiếp
            let successRate = 0.40; // Base 40%

            if (options.useLingshi) {
                if (this.player.lingShi < 5000) {
                    return { success: false, msg: 'Không đủ Linh thạch để lập Phản Lôi Trận (cần 5000 LT)!' };
                }
                this.player.spendLingShi(5000);
                successRate += 0.20;
            }

            if (options.useArmor) {
                const armorId = options.useArmor; // 'da_lan_giap' or 'long_lan_giap'
                if (!['da_lan_giap', 'long_lan_giap'].includes(armorId)) {
                    return { success: false, msg: 'Loại bảo y hộ kiếp không hợp lệ!' };
                }
                if (!this.player.inventory.hasItem(armorId, 1)) {
                    const armorName = getItemById(armorId)?.name || armorId;
                    return { success: false, msg: `Bạn không có ${armorName} trong túi đồ!` };
                }
                this.player.inventory.removeItem(armorId, 1);
                successRate += 0.30;
            }

            if (options.useHanNgocTuy) {
                if (!this.player.inventory.hasItem('han_ngoc_tuy', 1)) {
                    return { success: false, msg: 'Không có Hàn Ngọc Tủy trong túi đồ để giúp tịnh hóa tâm ma!' };
                }
                this.player.inventory.removeItem('han_ngoc_tuy', 1);
                successRate += 0.15;
            }

            successRate = Math.min(0.95, successRate);

            if (Math.random() > successRate) {
                // Fail state: Injured and coma
                beast.status = 'injured';
                this.player.calculateStats();
                return {
                    success: false,
                    msg: `Độ kiếp thất bại! Lôi kiếp hủy diệt đánh trúng, ${beast.name} bị trọng thương nặng và hôn mê bất tỉnh! (Hãy cho ăn Linh Thú Đan hoặc Hàn Ngọc Tủy để hồi sinh).`,
                    injured: true
                };
            }
        } else {
            // Normal evolution under lvl 50
            const successRate = 0.8 + (this.player.beastLevel * 0.01);
            if (Math.random() > successRate) {
                return { success: false, msg: 'Tiến hóa thất bại! Linh thú bị tiêu hao một ít linh tính.' };
            }
        }

        // Apply evolution
        const oldName = beast.name;
        beast.id = evolution.toId;
        const targetBeastData = BEASTS[evolution.toId];
        beast.name = evolution.newName || (targetBeastData ? targetBeastData.name : oldName);
        beast.bloodline = targetBeastData ? targetBeastData.bloodline : beast.bloodline;

        // Scale stats
        Object.keys(beast.stats).forEach(stat => {
            beast.stats[stat] = Math.floor(beast.stats[stat] * (evolution.statMult || 2.0));
        });

        // Add Exp to player profession
        const isInsect = targetBeastData && [BEAST_TYPES.LINH_TRUNG, BEAST_TYPES.KY_TRUNG].includes(targetBeastData.type);
        if (isInsect) {
            this.player.addInsectExp(500);
        } else {
            this.player.addBeastExp(500);
        }

        this.player.calculateStats();

        return {
            success: true,
            msg: isTribulation
                ? `Độ kiếp thành công! ${oldName} đã chống lại Lôi Kiếp vạn tượng, đột phá huyết mạch hóa hình thành ${beast.name}!`
                : `Tiến hóa thành công! ${oldName} đã lột xác hóa hình thành ${beast.name}!`,
            beast
        };
    }

    breed(beastId1, beastId2) {
        if (beastId1 === beastId2) return { success: false, msg: "Không thể lai tạo cùng một cá thể!" };
        
        const beast1 = this.player.beasts.find(b => b.uniqueId === beastId1);
        const beast2 = this.player.beasts.find(b => b.uniqueId === beastId2);

        if (!beast1 || !beast2) return { success: false, msg: "Không tìm thấy linh thú!" };
        if (beast1.level < 10 || beast2.level < 10) return { success: false, msg: "Linh thú cần đạt cấp 10 để lai tạo!" };

        const cost = 1000;
        if (this.player.lingShi < cost) return { success: false, msg: "Không đủ linh thạch lai tạo (yêu cầu 1000 LT)!" };

        this.player.spendLingShi(cost);

        // Lai tạo thành công, thu được trứng ngẫu nhiên
        return { success: true, msg: "Lai tạo thành công! Đã chuyển hóa linh nguyên ngưng tụ thành một quả Trứng Linh Thú trong túi đồ." };
    }

    /**
     * Huấn luyện thú nuôi
     */
    train(beastUniqueId, materialId) {
        const beast = this.player.beasts.find(b => b.uniqueId === beastUniqueId);
        if (!beast) return { success: false, msg: 'Không tìm thấy linh thú!' };

        if (beast.status === 'injured') {
            return { success: false, msg: 'Thú nuôi đang bị trọng thương, không thể huấn luyện!' };
        }

        const material = getItemById(materialId);
        if (!material) return { success: false, msg: 'Vật liệu không hợp lệ!' };

        if (!this.player.inventory.hasItem(materialId, 1)) {
            return { success: false, msg: `Bạn không có ${material.name} trong túi đồ!` };
        }

        this.player.inventory.removeItem(materialId, 1);

        let statGain = '';
        if (materialId === 'u_minh_hoa' && beast.id === 'u_minh_mong_diep') {
            beast.stats.atk += 15;
            beast.stats.spd += 10;
            statGain = 'Công kích +15, Tốc độ +10';
        } else if ((materialId === 'huyen_thiet' || materialId === 'tinh_kim') && beast.id === 'huyen_giap_dia_long') {
            const gain = materialId === 'tinh_kim' ? 25 : 8;
            beast.stats.def += gain;
            beast.stats.hp += gain * 2;
            statGain = `Phòng ngự +${gain}, Máu +${gain * 2}`;
        } else if (materialId === 'tinh_kim' || materialId === 'huyen_thiet') {
            const gain = materialId === 'tinh_kim' ? 12 : 3;
            beast.stats.atk += gain;
            beast.stats.def += Math.floor(gain / 2);
            statGain = `Công kích +${gain}, Phòng ngự +${Math.floor(gain / 2)}`;
        } else if (material.type === 'beast_food') {
            beast.stats.hp += 60;
            statGain = 'Máu +60';
        } else {
            beast.stats.atk += 2;
            statGain = 'Công kích +2';
        }

        beast.loyalty = Math.min(100, beast.loyalty + 2);
        this.player.calculateStats();
        
        return { success: true, msg: `Huấn luyện thành công! Chỉ số tăng: ${statGain}` };
    }

    /**
     * Vòng lặp đếm ngược thời gian ấp trứng
     */
    update(delta) {
        if (!this.player || !this.player.hatchingBeasts) return;
        let stateChanged = false;
        
        this.player.hatchingBeasts.forEach((slot, idx) => {
            if (slot && slot.status === 'hatching') {
                slot.timeLeft -= delta;
                if (slot.timeLeft <= 0) {
                    slot.timeLeft = 0;
                    slot.status = 'completed';
                    stateChanged = true;
                    if (this.ui && this.ui.toast) {
                        this.ui.toast(`Lò ấp số ${idx + 1}: ${slot.name} đã ấp nở thành công!`, 'success');
                    }
                }
            }
        });

        // Trigger UI update if active
        if (stateChanged && window.game && window.game.screens && window.game.screens.systems) {
            window.game.screens.systems.renderBeast();
        }
    }
}
