import { CORPSE_TYPES, getCorpseLevelInfo } from '../configs/corpse-data.js';
import { getItemById } from '../configs/item-data.js';
import { CRAFTING_QUALITIES } from '../configs/game-enums.js';

export class CorpseSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
    }

    refine(typeId) {
        const type = CORPSE_TYPES[typeId];
        if (!type) return { success: false, msg: "Loại thi hài không tồn tại!" };

        if (this.player.corpseLevel < type.level) {
            return { success: false, msg: `Cần Luyện Thi Thuật cấp ${type.level}!` };
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
            return { success: false, msg: "Không đủ trạng thái để luyện thi!" };
        }

        // Consume
        for (const mat of type.materials) {
            this.player.inventory.removeItem(mat.id, mat.quantity);
        }
        this.player.stamina -= 30;
        this.player.mana -= 50;

        // Success calculation
        let successRate = 0.7 - (type.level * 0.1) + (this.player.corpseLevel * 0.05);
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
                id: typeId,
                name: type.name,
                quality,
                stats: { ...type.stats },
                level: 1,
                exp: 0,
                nextLevelExp: 100
            };

            this.player.refinedCorpses.push(corpse);
            
            if (this.player.addCorpseExp(type.level * 100)) {
                const info = getCorpseLevelInfo(this.player.corpseLevel);
                this.ui.toast(`Đẳng cấp Luyện Thi Sư tăng lên ${info.name}!`, "success");
            }

            return { success: true, msg: `Luyện chế thành công [${quality}] ${type.name}!` };
        } else {
            // Failure
            if (Math.random() < 0.2) {
                const damage = 150 * type.level;
                this.player.hp -= damage;
                return { success: false, msg: `THI BIẾN! Thi hài mất kiểm soát tấn công ngươi gây ${damage} sát thương!` };
            }
            return { success: false, msg: 'Luyện chế thất bại! Thi hài tan rã thành tro bụi.' };
        }
    }
}
