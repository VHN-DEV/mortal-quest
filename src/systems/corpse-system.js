import { CORPSE_TYPES, CORPSE_FOODS, CORPSE_EVOLUTIONS, CORPSE_MODES, CORPSE_GATHER_REWARDS, getCorpseLevelInfo } from '../configs/corpse-data.js';
import { getItemById } from '../configs/item-data.js';
import { CRAFTING_QUALITIES } from '../configs/game-enums.js';

export class CorpseSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        this._gatherTimer = 0;
        this._gatherIntervalSeconds = 120; // Thu thập mỗi 2 phút game thực
    }

    // =============================================
    // LUYỆN CHẾ THI KHÔI
    // =============================================
    refine(typeId) {
        if (this.player.realmId < 1) {
            return { success: false, msg: "Cảnh giới phàm nhân chưa có linh lực, không thể luyện thi!" };
        }

        const type = CORPSE_TYPES[typeId];
        if (!type) return { success: false, msg: "Loại thi hài không tồn tại!" };

        if (this.player.corpseLevel < type.level) {
            return { success: false, msg: `Cần Luyện Thi Thuật cấp ${type.level}!` };
        }

        if (!this.player.unlockedProfessions.includes('corpse')) {
            return { success: false, msg: "Ngươi chưa học được bí pháp Luyện Thi Thuật!" };
        }

        // Check materials
        for (const mat of type.materials) {
            if (!this.player.inventory.hasItem(mat.id, mat.quantity)) {
                const item = getItemById(mat.id);
                return { success: false, msg: `Thiếu nguyên liệu: ${item ? item.name : mat.id}!` };
            }
        }

        // Check stamina/mana
        if (this.player.stamina < 30 || this.player.mana < 50) {
            return { success: false, msg: "Không đủ trạng thái để luyện thi! Cần 30 Thể Lực và 50 Linh Lực." };
        }

        // Số thi khôi tối đa = corpseLevel / 2 + 1
        const maxCorpses = Math.floor(this.player.corpseLevel / 2) + 1;
        if (this.player.refinedCorpses.length >= maxCorpses) {
            return { success: false, msg: `Ngươi chỉ có thể khống chế tối đa ${maxCorpses} thi khôi (Cần nâng Luyện Thi Sư)!` };
        }

        // Consume materials
        for (const mat of type.materials) {
            this.player.inventory.removeItem(mat.id, mat.quantity);
        }
        this.player.stamina -= 30;
        this.player.mana -= 50;

        // Success calculation
        let successRate = 0.7 - (type.level * 0.08) + (this.player.corpseLevel * 0.05);
        successRate = Math.max(0.1, Math.min(0.95, successRate));
        const roll = Math.random();

        if (roll <= successRate) {
            // Quality
            const qualityRoll = Math.random() + (this.player.corpseLevel * 0.05);
            let quality = CRAFTING_QUALITIES.HA_PHAM.name;
            if (qualityRoll > 1.8) quality = CRAFTING_QUALITIES.TIEN_PHAM.name;
            else if (qualityRoll > 1.5) quality = CRAFTING_QUALITIES.HOAN_MY.name;
            else if (qualityRoll > 1.2) quality = CRAFTING_QUALITIES.THUONG_PHAM.name;
            else if (qualityRoll > 0.8) quality = CRAFTING_QUALITIES.TRUNG_PHAM.name;

            const corpse = {
                uniqueId: `corpse_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                id: typeId,
                name: type.name,
                icon: type.icon || '🧟',
                quality,
                stats: {
                    atk: type.stats.atk,
                    def: type.stats.def,
                    hp: type.stats.hp
                },
                level: 1,
                exp: 0,
                nextLevelExp: 100,
                deployed: false,
                mode: 'COMBAT',
                gatherBonus: type.gatherBonus || { type: 'all', multiplier: 1.0 },
                gatherCooldown: 0
            };

            this.player.refinedCorpses.push(corpse);

            if (this.player.addCorpseExp(type.level * 100)) {
                const info = getCorpseLevelInfo(this.player.corpseLevel);
                this.ui.toast(`Đẳng cấp Luyện Thi Sư tăng lên ${info.name}!`, "success");
            }

            return { success: true, msg: `Luyện chế thành công [${quality}] ${type.name}!`, corpse };
        } else {
            // Failure
            if (Math.random() < 0.2) {
                const damage = 150 * type.level;
                this.player.hp = Math.max(1, this.player.hp - damage);
                return { success: false, msg: `THI BIẾN! Thi hài mất kiểm soát tấn công ngươi gây ${damage} sát thương!` };
            }
            return { success: false, msg: 'Luyện chế thất bại! Thi hài tan rã thành tro bụi.' };
        }
    }

    // =============================================
    // XUẤT CHIẾN / THU HỒI
    // =============================================
    deploy(uniqueId) {
        const corpse = this.player.refinedCorpses.find(c => c.uniqueId === uniqueId);
        if (!corpse) return { success: false, msg: "Không tìm thấy thi khôi!" };

        if (corpse.deployed) {
            // Thu hồi
            corpse.deployed = false;
            return { success: true, msg: `${corpse.name} đã được thu hồi về trạng thái đứng chờ.`, action: 'recall' };
        } else {
            // Đếm số thi khôi đang xuất chiến
            const deployedCount = this.player.refinedCorpses.filter(c => c.deployed).length;
            const maxDeployed = Math.floor(this.player.corpseLevel / 2) + 1;
            if (deployedCount >= maxDeployed) {
                return { success: false, msg: `Ngươi chỉ có thể xuất chiến tối đa ${maxDeployed} thi khôi cùng lúc!` };
            }
            corpse.deployed = true;
            return { success: true, msg: `${corpse.name} xuất chiến! Chế độ: ${CORPSE_MODES[corpse.mode]?.name || 'Chiến Đấu'}`, action: 'deploy' };
        }
    }

    // =============================================
    // ĐẶT CHẾ ĐỘ
    // =============================================
    setMode(uniqueId, mode) {
        const corpse = this.player.refinedCorpses.find(c => c.uniqueId === uniqueId);
        if (!corpse) return { success: false, msg: "Không tìm thấy thi khôi!" };
        if (!CORPSE_MODES[mode]) return { success: false, msg: "Chế độ không hợp lệ!" };

        corpse.mode = mode;
        return { success: true, msg: `${corpse.name} chuyển sang chế độ [${CORPSE_MODES[mode].name}]!` };
    }

    // =============================================
    // NUÔI DƯỠNG
    // =============================================
    feed(uniqueId, foodItemId) {
        const corpse = this.player.refinedCorpses.find(c => c.uniqueId === uniqueId);
        if (!corpse) return { success: false, msg: "Không tìm thấy thi khôi!" };

        // Xác định loại thức ăn
        const foodConfig = Object.values(CORPSE_FOODS).find(f => f.itemId === foodItemId);
        if (!foodConfig) return { success: false, msg: "Thức ăn này không phù hợp cho thi khôi!" };

        if (!this.player.inventory.hasItem(foodItemId, 1)) {
            return { success: false, msg: `Không đủ ${getItemById(foodItemId)?.name || foodItemId}!` };
        }

        this.player.inventory.removeItem(foodItemId, 1);

        // Áp dụng bonus
        if (foodConfig.stat === 'all') {
            corpse.stats.atk += foodConfig.bonus;
            corpse.stats.def += foodConfig.bonus;
            corpse.stats.hp += foodConfig.bonus * 3;
        } else if (foodConfig.stat === 'hp') {
            corpse.stats.hp += foodConfig.bonus;
        } else if (foodConfig.stat === 'atk') {
            corpse.stats.atk += foodConfig.bonus;
        } else if (foodConfig.stat === 'def') {
            corpse.stats.def += foodConfig.bonus;
        }

        // Tăng EXP thi khôi
        corpse.exp = (corpse.exp || 0) + foodConfig.expGain;
        const leveledUp = this._checkCorpseLevelUp(corpse);

        // Tăng EXP luyện thi sư
        this.player.addCorpseExp(10);

        const msg = leveledUp
            ? `${corpse.name} tiến hóa lên Cấp ${corpse.level}! Sức mạnh đại tăng!`
            : `Đã cho ${corpse.name} ăn ${foodConfig.name}. ${this._statBonus(foodConfig)}`;

        return { success: true, msg };
    }

    _statBonus(foodConfig) {
        if (foodConfig.stat === 'all') return `ATK/DEF/HP tăng nhẹ.`;
        if (foodConfig.stat === 'atk') return `ATK +${foodConfig.bonus}`;
        if (foodConfig.stat === 'def') return `DEF +${foodConfig.bonus}`;
        if (foodConfig.stat === 'hp') return `HP +${foodConfig.bonus}`;
        return '';
    }

    _checkCorpseLevelUp(corpse) {
        if (!corpse.nextLevelExp) corpse.nextLevelExp = 100;
        if (corpse.exp >= corpse.nextLevelExp) {
            corpse.exp -= corpse.nextLevelExp;
            corpse.level = (corpse.level || 1) + 1;
            corpse.nextLevelExp = Math.floor(corpse.nextLevelExp * 1.5);

            // Stat increase on level up
            corpse.stats.atk = Math.floor(corpse.stats.atk * 1.12);
            corpse.stats.def = Math.floor(corpse.stats.def * 1.12);
            corpse.stats.hp = Math.floor(corpse.stats.hp * 1.15);
            return true;
        }
        return false;
    }

    // =============================================
    // TIẾN HÓA THI KHÔI
    // =============================================
    evolve(uniqueId) {
        const corpse = this.player.refinedCorpses.find(c => c.uniqueId === uniqueId);
        if (!corpse) return { success: false, msg: "Không tìm thấy thi khôi!" };

        // Tìm công thức tiến hóa phù hợp
        const evoKey = Object.keys(CORPSE_EVOLUTIONS).find(k => CORPSE_EVOLUTIONS[k].fromId === corpse.id);
        if (!evoKey) return { success: false, msg: `${corpse.name} không có con đường tiến hóa tiếp theo!` };

        const evo = CORPSE_EVOLUTIONS[evoKey];

        if (corpse.level < evo.levelRequired) {
            return { success: false, msg: `Cần thi khôi đạt Cấp ${evo.levelRequired} mới có thể tiến hóa!` };
        }

        if (evo.corpseSkillLevelRequired && this.player.corpseLevel < evo.corpseSkillLevelRequired) {
            return { success: false, msg: `Cần Luyện Thi Sư Cấp ${evo.corpseSkillLevelRequired} mới có thể tiến hóa lên cấp này!` };
        }

        // Kiểm tra nguyên liệu
        for (const mat of evo.materials) {
            if (!this.player.inventory.hasItem(mat.id, mat.quantity)) {
                const item = getItemById(mat.id);
                return { success: false, msg: `Thiếu nguyên liệu: ${item?.name || mat.id} x${mat.quantity}!` };
            }
        }

        // Tiêu hao nguyên liệu
        for (const mat of evo.materials) {
            this.player.inventory.removeItem(mat.id, mat.quantity);
        }

        const newType = CORPSE_TYPES[evo.toId];
        const oldName = corpse.name;

        // Áp dụng hình dạng mới, giữ lại exp, level và bonus stats
        const statScale = newType.stats;
        corpse.id = evo.toId;
        corpse.name = newType.name;
        corpse.icon = newType.icon;
        corpse.stats = {
            atk: Math.max(statScale.atk, corpse.stats.atk + statScale.atk * 0.3),
            def: Math.max(statScale.def, corpse.stats.def + statScale.def * 0.3),
            hp: Math.max(statScale.hp, corpse.stats.hp + statScale.hp * 0.3)
        };
        corpse.gatherBonus = newType.gatherBonus || corpse.gatherBonus;

        // Tăng EXP luyện thi sư
        this.player.addCorpseExp(500 * (evo.corpseSkillLevelRequired || 1));

        return { success: true, msg: `✨ Tiến hóa thành công! ${oldName} → ${newType.name}! Sức mạnh kinh thiên!` };
    }

    // =============================================
    // THU THẬP TÀI NGUYÊN (Chế độ GATHER)
    // =============================================
    tickGather(deltaSeconds) {
        this._gatherTimer = (this._gatherTimer || 0) + deltaSeconds;
        if (this._gatherTimer < this._gatherIntervalSeconds) return null;

        this._gatherTimer = 0;
        const results = [];

        const gatherCorpses = this.player.refinedCorpses.filter(c => c.deployed && c.mode === 'GATHER');
        if (gatherCorpses.length === 0) return null;

        for (const corpse of gatherCorpses) {
            const bonusType = corpse.gatherBonus?.type || 'all';
            const bonusMult = corpse.gatherBonus?.multiplier || 1.0;
            const pool = CORPSE_GATHER_REWARDS[bonusType] || CORPSE_GATHER_REWARDS.all;

            for (const reward of pool) {
                const roll = Math.random();
                if (roll < reward.chance * bonusMult) {
                    const qty = reward.qty[0] + Math.floor(Math.random() * (reward.qty[1] - reward.qty[0] + 1));
                    this.player.inventory.addItem(reward.id, qty);
                    const item = getItemById(reward.id);
                    results.push(`${item?.name || reward.id} x${qty}`);
                }
            }

            // Thi khôi cũng tăng EXP khi thu thập
            corpse.exp = (corpse.exp || 0) + 5;
            this._checkCorpseLevelUp(corpse);
        }

        if (results.length > 0) {
            return `🧟 Thi khôi thu thập về: ${results.join(', ')}`;
        }
        return null;
    }

    // =============================================
    // TÁN DIỆT THI KHÔI
    // =============================================
    dismantle(uniqueId) {
        const idx = this.player.refinedCorpses.findIndex(c => c.uniqueId === uniqueId);
        if (idx === -1) return { success: false, msg: "Không tìm thấy thi khôi!" };

        const corpse = this.player.refinedCorpses[idx];
        const type = CORPSE_TYPES[corpse.id];

        // Trả lại một phần nguyên liệu
        const refundMaterials = [];
        if (type) {
            for (const mat of type.materials) {
                const refundQty = Math.max(1, Math.floor(mat.quantity * 0.3));
                this.player.inventory.addItem(mat.id, refundQty);
                const item = getItemById(mat.id);
                refundMaterials.push(`${item?.name || mat.id} x${refundQty}`);
            }
        }

        this.player.refinedCorpses.splice(idx, 1);
        const msg = refundMaterials.length > 0
            ? `${corpse.name} đã bị tán diệt. Thu hồi: ${refundMaterials.join(', ')}`
            : `${corpse.name} đã bị tán diệt.`;

        return { success: true, msg };
    }

    // =============================================
    // COMBAT STATS GÓP VÀO
    // =============================================
    getDeployedCombatCorpses() {
        return this.player.refinedCorpses.filter(c => c.deployed && c.mode === 'COMBAT');
    }

    getDeployedGuardCorpses() {
        return this.player.refinedCorpses.filter(c => c.deployed && c.mode === 'GUARD');
    }
}
