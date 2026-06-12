import { PUPPET_RECIPES, PUPPET_GRADES } from '../configs/puppet-data.js';
import { getItemById } from '../configs/item-data.js';
import { CRAFTING_QUALITIES } from '../configs/game-enums.js';

// Max simultaneous deployed puppets
const MAX_DEPLOYED = 3;

// Resource items gathered per tick by SCOUT/SUPPORT puppets (roughly one gather per minute at normal speed)
const GATHER_TABLE = [
    { id: 'ha_pham_linh_thach', weight: 40 },
    { id: 'huyen_thiet',        weight: 20 },
    { id: 'tinh_kim',           weight: 10 },
    { id: 'linh_thao',          weight: 15 },
    { id: 'yeu_nhuc_tuoi',      weight: 10 },
    { id: 'bach_nien_thiet_moc', weight: 5 },
];

function weightedRandom(table) {
    const total = table.reduce((s, t) => s + t.weight, 0);
    let r = Math.random() * total;
    for (const entry of table) {
        r -= entry.weight;
        if (r <= 0) return entry.id;
    }
    return table[0].id;
}

export class PuppetSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        // Accumulator for resource ticks (seconds)
        this._gatherAcc = 0;
    }

    // ─── CRAFT ────────────────────────────────────────────────────────────────

    craft(recipeId) {
        const recipe = PUPPET_RECIPES.find(r => r.id === recipeId);
        if (!recipe) return { success: false, msg: 'Bản vẽ không tồn tại!' };

        if (this.player.realmId < 1) {
            return { success: false, msg: 'Cảnh giới phàm nhân chưa có linh lực, không thể chế tạo khôi lỗi!' };
        }
 
        if (!this.player.knownPuppetRecipes.includes(recipeId)) {
            return { success: false, msg: 'Ngươi chưa có bản thiết kế của khôi lỗi này!' };
        }

        if (this.player.puppetLevel < recipe.skillLevel) {
            return { success: false, msg: `Cần Khôi Lỗi Thuật cấp ${recipe.skillLevel}!` };
        }

        // Check & consume materials
        for (const mat of recipe.materials) {
            if (!this.player.inventory.hasItem(mat.id, mat.quantity)) {
                const item = getItemById(mat.id);
                return { success: false, msg: `Thiếu nguyên liệu: ${item ? item.name : mat.id}!` };
            }
        }
        for (const mat of recipe.materials) {
            this.player.inventory.removeItem(mat.id, mat.quantity);
        }

        // Success roll
        const bonusBonus = (this.player.advancedStats?.puppetBonus || 0);
        let successRate = 0.8 - (recipe.skillLevel * 0.05) + (this.player.puppetLevel * 0.05) + bonusBonus;
        successRate = Math.max(0.1, Math.min(0.95, successRate));

        if (Math.random() <= successRate) {
            // Quality
            const qualityRoll = Math.random() + (this.player.puppetLevel * 0.05) + (this.player.soulRealmId || 0) * 0.03;
            let quality = CRAFTING_QUALITIES.HA_PHAM.name;
            let hasIntelligence = false;

            if      (qualityRoll > 2.3) { quality = CRAFTING_QUALITIES.TIEN_PHAM?.name || 'Tiên Phẩm'; hasIntelligence = Math.random() < 0.2; }
            else if (qualityRoll > 1.9) { quality = CRAFTING_QUALITIES.HOAN_MY?.name  || 'Hoàn Mỹ';   hasIntelligence = Math.random() < 0.1; }
            else if (qualityRoll > 1.5) { quality = CRAFTING_QUALITIES.CUC_PHAM?.name || 'Cực Phẩm'; }
            else if (qualityRoll > 1.1) { quality = CRAFTING_QUALITIES.THUONG_PHAM?.name || 'Thượng Phẩm'; }
            else if (qualityRoll > 0.7) { quality = CRAFTING_QUALITIES.TRUNG_PHAM?.name || 'Trung Phẩm'; }

            const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

            // Store puppet as structured object in inventory metadata
            this.player.inventory.addItem('khoi_loi', 1, {
                uniqueId,
                puppetId: recipe.id,
                name: recipe.name,
                quality,
                hasIntelligence,
                stats: { ...recipe.stats },
                mode: 'COMBAT',          // 'COMBAT' | 'SCOUT' | 'GUARD' | 'GATHER'
                durability: 100,
                maxDurability: 100,
                deployed: false
            });

            this.player.addPuppetExp(recipe.grade === 'PHAM' ? 50 : 200);

            return {
                success: true,
                msg: `Luyện chế thành công: [${quality}] ${recipe.name}!${hasIntelligence ? ' ⚡ KHÔI LỖI ĐÃ SINH RA LINH TRÍ!' : ''}`
            };
        } else {
            if (Math.random() < 0.15) {
                const damage = 100 * recipe.skillLevel;
                this.player.hp = Math.max(1, this.player.hp - damage);
                return { success: false, msg: `KHÔI LỖI PHÁT NỔ! Ngươi bị phản phệ gây ${damage} sát thương!` };
            }
            return { success: false, msg: 'Luyện chế thất bại! Linh cấu sụp đổ, nguyên liệu bị phá hủy.' };
        }
    }

    // ─── DEPLOY / UNDEPLOY ────────────────────────────────────────────────────

    /**
     * Toggle a puppet in/out of the deployed roster.
     * @param {string} uniqueId – the puppet's uniqueId stored in inventory metadata
     */
    deploy(uniqueId) {
        const puppets = this._getAllPuppets();
        const puppet = puppets.find(p => p.metadata?.uniqueId === uniqueId);
        if (!puppet) return { success: false, msg: 'Không tìm thấy khôi lỗi!' };

        if (puppet.metadata.durability <= 0) {
            return { success: false, msg: 'Khôi lỗi này đã hư hỏng hoàn toàn, hãy sửa chữa trước!' };
        }

        const deployed = puppets.filter(p => p.metadata?.deployed);

        if (puppet.metadata.deployed) {
            // Undeploy
            puppet.metadata.deployed = false;
            this.player.calculateStats();
            return { success: true, msg: `Đã thu hồi khôi lỗi: ${puppet.metadata.name}` };
        } else {
            if (deployed.length >= MAX_DEPLOYED) {
                return { success: false, msg: `Chỉ có thể điều khiển tối đa ${MAX_DEPLOYED} khôi lỗi cùng lúc!` };
            }
            puppet.metadata.deployed = true;
            this.player.calculateStats();
            return { success: true, msg: `Đã triệu hoán khôi lỗi: ${puppet.metadata.name}!` };
        }
    }

    /**
     * Set operating mode for a deployed puppet.
     * @param {string} uniqueId
     * @param {'COMBAT'|'SCOUT'|'GATHER'|'GUARD'} mode
     */
    setMode(uniqueId, mode) {
        const VALID_MODES = ['COMBAT', 'SCOUT', 'GATHER', 'GUARD'];
        if (!VALID_MODES.includes(mode)) return { success: false, msg: 'Chế độ không hợp lệ!' };

        const puppet = this._getAllPuppets().find(p => p.metadata?.uniqueId === uniqueId);
        if (!puppet) return { success: false, msg: 'Không tìm thấy khôi lỗi!' };
        if (!puppet.metadata.deployed) return { success: false, msg: 'Khôi lỗi chưa được triệu hoán!' };

        puppet.metadata.mode = mode;
        const modeNames = { COMBAT: 'Chiến Đấu', SCOUT: 'Trinh Thám', GATHER: 'Thu Thập', GUARD: 'Hộ Vệ' };
        return { success: true, msg: `Khôi lỗi ${puppet.metadata.name} chuyển sang chế độ [${modeNames[mode]}]!` };
    }

    // ─── REPAIR ───────────────────────────────────────────────────────────────

    /**
     * Repair by spending LingShi. Cost scales with puppet stats.
     */
    repair(uniqueId) {
        const puppet = this._getAllPuppets().find(p => p.metadata?.uniqueId === uniqueId);
        if (!puppet) return { success: false, msg: 'Không tìm thấy khôi lỗi!' };

        const meta = puppet.metadata;
        if (meta.durability >= meta.maxDurability) return { success: false, msg: 'Khôi lỗi đang ở trạng thái hoàn hảo!' };

        const missingDur = meta.maxDurability - meta.durability;
        const cost = Math.max(100, Math.floor(missingDur * 20 * (this.player.puppetLevel || 1)));

        if (this.player.lingShi < cost) {
            return { success: false, msg: `Cần ${cost.toLocaleString()} Linh Thạch để sửa chữa!` };
        }

        this.player.spendLingShi(cost);
        meta.durability = meta.maxDurability;
        return { success: true, msg: `Đã sửa chữa [${meta.name}] — tốn ${cost.toLocaleString()} Linh Thạch!` };
    }

    // ─── AUTO GAME LOOP TICK ──────────────────────────────────────────────────

    /**
     * Called from the main game loop with delta seconds.
     * Handles resource gathering for SCOUT/GATHER puppets.
     */
    update(delta) {
        const deployedPuppets = this._getAllPuppets().filter(p => p.metadata?.deployed && p.metadata.durability > 0);
        if (deployedPuppets.length === 0) return;

        this._gatherAcc += delta;

        // Resource tick every 60 seconds of real-time
        const GATHER_INTERVAL = 60;
        if (this._gatherAcc >= GATHER_INTERVAL) {
            this._gatherAcc -= GATHER_INTERVAL;

            const notifications = [];

            deployedPuppets.forEach(puppet => {
                const meta = puppet.metadata;
                const mode = meta.mode || 'COMBAT';

                if (mode === 'GATHER' || mode === 'SCOUT') {
                    // Gather 1-3 items per puppet per tick based on level
                    const gatherCount = 1 + Math.floor(this.player.puppetLevel / 3);
                    for (let i = 0; i < gatherCount; i++) {
                        const itemId = weightedRandom(GATHER_TABLE);
                        this.player.inventory.addItem(itemId, 1);
                    }
                    const itemName = getItemById(weightedRandom(GATHER_TABLE))?.name || 'tài nguyên';
                    notifications.push(`🤖 [${meta.name}] thu thập được ${gatherCount} tài nguyên!`);

                    // Minor durability drain
                    meta.durability = Math.max(0, meta.durability - 0.5);
                } else if (mode === 'GUARD') {
                    // Guard mode: passively regenerate player HP slightly
                    const regenAmount = Math.floor((meta.stats?.def || 10) * 0.02);
                    this.player.hp = Math.min(this.player.maxHp, this.player.hp + regenAmount);
                } else if (mode === 'COMBAT') {
                    // Combat mode doesn't do anything outside combat (combat handled in CombatEngine)
                    // But ticks durability very slowly
                    meta.durability = Math.max(0, meta.durability - 0.1);
                }

                // Warn on low durability
                if (meta.durability <= 20 && meta.durability > 0 && this.ui?.toast) {
                    this.ui.toast(`⚠️ Khôi lỗi [${meta.name}] độ bền thấp (${Math.floor(meta.durability)}%)!`, 'warning');
                }
                if (meta.durability <= 0) {
                    meta.deployed = false;
                    if (this.ui?.toast) {
                        this.ui.toast(`❌ Khôi lỗi [${meta.name}] đã hư hỏng và bị thu hồi!`, 'error');
                    }
                }
            });

            // Show one consolidated notification if anything gathered
            if (notifications.length > 0 && this.ui?.toast) {
                this.ui.toast(notifications[0], 'info');
            }
        }
    }

    // ─── HELPERS ──────────────────────────────────────────────────────────────

    /**
     * Returns all khoi_loi items in the player's inventory (with metadata).
     */
    _getAllPuppets() {
        return this.player.inventory.allItems.filter(i => i.id === 'khoi_loi' && i.metadata?.uniqueId);
    }

    /**
     * Returns all currently deployed puppets.
     */
    getDeployedPuppets() {
        return this._getAllPuppets().filter(p => p.metadata?.deployed);
    }
}
