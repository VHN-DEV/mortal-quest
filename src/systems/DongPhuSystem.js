import { getLocationById, findWorldIdByLocId } from '../configs/map-data.js';
import { state } from '../state.js';

export class DongPhuSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
    }

    /**
     * Check if a location supports building a Cave Abode.
     * Safe zones and towns generally do not allow it.
     */
    canBuildAbodeAt(locationId) {
        const worldId = findWorldIdByLocId(locationId) || state.currentWorldId || 'nhan_gioi';
        const loc = getLocationById(worldId, locationId);
        if (!loc) return false;
        // Wilderness/exploration zones have danger !== 'an_toan'
        return loc.danger && loc.danger !== 'an_toan';
    }

    /**
     * Build a Cave Abode at a specific location
     */
    createAbode(locationId) {
        if (!this.canBuildAbodeAt(locationId)) {
            return { success: false, msg: 'Địa điểm này an toàn hoặc không thích hợp để xây dựng Động Phủ!' };
        }

        // Check level requirement (Trúc Cơ realm: realmId >= 14)
        if (this.player.realmId < 14) {
            return { success: false, msg: 'Cảnh giới chưa đủ! Cần đạt đến Trúc Cơ Kỳ mới có thể mở khai thác Động Phủ!' };
        }

        // Check if player already has an abode here
        const existing = this.player.abodes.find(a => a.locationId === locationId);
        if (existing) {
            return { success: false, msg: 'Đạo hữu đã xây dựng Động Phủ ở địa điểm này rồi!' };
        }

        const cost = 5000;
        if (this.player.lingShi < cost) {
            return { success: false, msg: `Cần ${cost.toLocaleString()} Linh Thạch để khai hoang Động Phủ!` };
        }

        // Deduct cost
        const success = this.player.spendLingShi(cost);
        if (!success) {
            return { success: false, msg: 'Không thể khấu trừ Linh Thạch!' };
        }

        const worldId = findWorldIdByLocId(locationId) || state.currentWorldId || 'nhan_gioi';
        const loc = getLocationById(worldId, locationId);
        const newAbode = {
            id: 'abode_' + locationId + '_' + Date.now(),
            locationId: locationId,
            name: 'Động Phủ ' + (loc?.name || 'Vô Danh'),
            gardenPlots: [
                { grade: 'PHAM', attribute: 'NORMAL', seedId: null, age: 0, status: 'empty' },
                { grade: 'PHAM', attribute: 'NORMAL', seedId: null, age: 0, status: 'empty' },
                { grade: 'PHAM', attribute: 'NORMAL', seedId: null, age: 0, status: 'empty' }
            ],
            defensiveFormation: null,
            puppets: []
        };

        this.player.abodes.push(newAbode);
        
        if (this.ui?.toast) {
            this.ui.toast(`Chúc mừng đạo hữu khai mở thành công [${newAbode.name}]!`, 'success');
        }

        return { success: true, abode: newAbode };
    }

    /**
     * Deploy a formation diagram to an Abode
     */
    deployFormation(locationId, item) {
        const abode = this.player.abodes.find(a => a.locationId === locationId);
        if (!abode) return { success: false, msg: 'Không tìm thấy Động Phủ tại đây!' };

        // Remove from inventory
        if (!this.player.inventory.hasItem(item.id, 1)) {
            return { success: false, msg: 'Không có trận đồ này trong túi đồ!' };
        }
        this.player.inventory.removeItem(item.id, 1);

        // If another formation is already deployed, return it to player inventory
        if (abode.defensiveFormation) {
            this.player.inventory.addItem(abode.defensiveFormation.id, 1);
        }

        abode.defensiveFormation = {
            id: item.id,
            name: item.name,
            stats: {
                formationPower: this._getFormationPower(item.id)
            }
        };

        return { success: true, msg: `Đã kích hoạt trận pháp [${item.name}] bảo hộ Động Phủ!` };
    }

    /**
     * Undeploy formation from an Abode
     */
    undeployFormation(locationId) {
        const abode = this.player.abodes.find(a => a.locationId === locationId);
        if (!abode || !abode.defensiveFormation) return { success: false, msg: 'Không có trận pháp nào đang triển khai!' };

        const form = abode.defensiveFormation;
        this.player.inventory.addItem(form.id, 1);
        abode.defensiveFormation = null;

        return { success: true, msg: `Đã thu hồi trận đồ [${form.name}] về túi đồ.` };
    }

    /**
     * Deploy a puppet to an Abode
     */
    deployPuppet(locationId, puppetUniqueId) {
        const abode = this.player.abodes.find(a => a.locationId === locationId);
        if (!abode) return { success: false, msg: 'Không tìm thấy Động Phủ tại đây!' };

        if (abode.puppets.length >= 3) {
            return { success: false, msg: 'Động Phủ chỉ có thể chứa tối đa 3 khôi lỗi bảo vệ!' };
        }

        // Find the puppet in player inventory
        const invItem = this.player.inventory.allItems.find(i => i.id === 'khoi_loi' && i.metadata?.uniqueId === puppetUniqueId);
        if (!invItem) return { success: false, msg: 'Không tìm thấy khôi lỗi này trong túi đồ!' };

        // Remove from player inventory
        const puppetMeta = JSON.parse(JSON.stringify(invItem.metadata));
        // Ensure it's not marked as player-deployed
        puppetMeta.deployed = false;
        this.player.inventory.removeItem(invItem.id, 1, invItem.metadata);

        // Add to Abode
        abode.puppets.push({
            id: invItem.id,
            metadata: puppetMeta
        });

        return { success: true, msg: `Đã bố trí khôi lỗi [${puppetMeta.name}] trấn thủ Động Phủ!` };
    }

    /**
     * Undeploy puppet from an Abode back to player inventory
     */
    undeployPuppet(locationId, puppetUniqueId) {
        const abode = this.player.abodes.find(a => a.locationId === locationId);
        if (!abode) return { success: false, msg: 'Không tìm thấy Động Phủ tại đây!' };

        const puppetIdx = abode.puppets.findIndex(p => p.metadata.uniqueId === puppetUniqueId);
        if (puppetIdx === -1) return { success: false, msg: 'Không tìm thấy khôi lỗi này trong Động Phủ!' };

        const puppet = abode.puppets[puppetIdx];
        abode.puppets.splice(puppetIdx, 1);

        // Put back in player inventory
        this.player.inventory.addItem(puppet.id, 1, puppet.metadata);

        return { success: true, msg: `Đã thu hồi khôi lỗi [${puppet.metadata.name}] về túi đồ.` };
    }

    /**
     * Helper to get defensive power value of a formation
     */
    _getFormationPower(id) {
        const formationPowerMap = {
            'tran_do_tu_linh_tran': 250,
            'tran_do_ao_anh_tran': 550,
            'tran_do_sat_kiem_tran': 1300,
            'tran_do_ho_tong_dai_tran': 3600,
            'thai_cuc_huyen_tran_do': 1600
        };
        return formationPowerMap[id] || 200;
    }

    /**
     * Calculate defense rating of a Cave Abode
     */
    getAbodeDefensePower(abode) {
        let power = 0;
        if (abode.defensiveFormation) {
            power += abode.defensiveFormation.stats?.formationPower || 200;
        }
        if (abode.puppets && Array.isArray(abode.puppets)) {
            abode.puppets.forEach(p => {
                if (p.metadata && p.metadata.durability > 0) {
                    const atk = p.metadata.stats?.atk || 0;
                    const def = p.metadata.stats?.def || 0;
                    const durabilityFactor = p.metadata.durability / p.metadata.maxDurability;
                    power += (atk + def) * durabilityFactor;
                }
            });
        }
        return Math.floor(power);
    }

    /**
     * Get numeric weight for a danger category
     */
    _getDangerWeight(danger) {
        switch (danger) {
            case 'thap': return 1;
            case 'trung_cap': return 2;
            case 'nguy_hiem': return 3.5;
            default: return 0.5;
        }
    }

    /**
     * Resolve random attack event on player's abodes
     */
    triggerAttackEvent() {
        if (!this.player.abodes || this.player.abodes.length === 0) return;

        // Choose a random abode to target
        const index = Math.floor(Math.random() * this.player.abodes.length);
        const abode = this.player.abodes[index];
        const worldId = findWorldIdByLocId(abode.locationId) || state.currentWorldId || 'nhan_gioi';
        const loc = getLocationById(worldId, abode.locationId);
        const locName = loc?.name || 'Vô Danh';
        
        const dangerWeight = this._getDangerWeight(loc?.danger || 'thap');
        const enemyStrength = Math.floor((dangerWeight * 600) * (0.8 + Math.random() * 0.4));
        const defensePower = this.getAbodeDefensePower(abode);

        if (defensePower >= enemyStrength) {
            // Repelled successfully!
            // Wear durability on puppets
            let puppetWearMsg = '';
            if (abode.puppets && abode.puppets.length > 0) {
                abode.puppets.forEach(p => {
                    p.metadata.durability = Math.max(0, p.metadata.durability - (5 + Math.floor(Math.random() * 6)));
                });
                puppetWearMsg = ' Các khôi lỗi phòng vệ chịu hao mòn nhẹ độ bền.';
            }

            // Consume small spirit stones from inventory if formation is active
            let energyMsg = '';
            if (abode.defensiveFormation) {
                const cost = 100;
                if (this.player.lingShi >= cost) {
                    this.player.spendLingShi(cost);
                    energyMsg = ` Hào quang trận pháp tiêu hao ${cost} Linh Thạch.`;
                } else {
                    energyMsg = ` Do thiếu Linh Thạch cung cấp, linh năng trận pháp bị suy giảm!`;
                }
            }

            const message = `⚔️ [Động Phủ Bị Tập Kích] Một toán quái thú hoặc tu sĩ đối địch đã tấn công Động Phủ của ngươi tại [${locName}]. Nhờ có hệ thống phòng thủ vững chắc (Phòng Ngự: ${defensePower} vs Địch: ${enemyStrength}), ngươi đã đẩy lui kẻ địch thành công!${puppetWearMsg}${energyMsg}`;
            if (window.game && window.game.ui && window.game.ui.alert) {
                window.game.ui.alert(message, 'Đại Môn Hộ Vệ Thành Công');
            } else {
                console.log(message);
            }
        } else {
            // Defense breached! Pillage!
            // 1. Destroy 1-2 crops in garden
            let destroyedCrops = [];
            const growingPlots = abode.gardenPlots.filter(p => p.status === 'growing');
            const destroyCount = Math.min(growingPlots.length, 1 + Math.floor(Math.random() * 2));
            for (let i = 0; i < destroyCount; i++) {
                const plot = growingPlots[i];
                if (plot) {
                    plot.seedId = null;
                    plot.status = 'empty';
                    plot.age = 0;
                    plot.stage = 'Mầm';
                    destroyedCrops.push(plot.seedId || 'Linh Thảo');
                }
            }

            // 2. Wear puppets durability heavily
            if (abode.puppets && abode.puppets.length > 0) {
                abode.puppets.forEach(p => {
                    p.metadata.durability = Math.max(0, p.metadata.durability - (25 + Math.floor(Math.random() * 20)));
                });
            }

            // 3. Pillage spirit stones
            const stolenStones = Math.min(this.player.lingShi, 400 + Math.floor(Math.random() * 500));
            if (stolenStones > 0) {
                this.player.spendLingShi(stolenStones);
            }

            let cropLossMsg = destroyedCrops.length > 0 
                ? ` Linh điền bị cướp phá, tiêu hủy ${destroyedCrops.length} ô linh thảo đang trồng!` 
                : ' May mắn linh thảo trong linh điền không bị ảnh hưởng nhiều.';

            const message = `🚨 [Động Phủ Thất Thủ] Cảnh báo! Động Phủ của ngươi tại [${locName}] bị kẻ địch đột kích và chọc thủng phòng ngự (Phòng Ngự: ${defensePower} vs Địch: ${enemyStrength})! Kẻ địch xâm nhập cướp bóc mất ${stolenStones.toLocaleString()} Linh Thạch. Khôi lỗi phòng ngự bị chấn thương nặng.${cropLossMsg}`;
            if (window.game && window.game.ui && window.game.ui.alert) {
                window.game.ui.alert(message, 'Động Phủ Bị Cướp Phá');
            } else {
                console.log(message);
            }
        }
    }
}
