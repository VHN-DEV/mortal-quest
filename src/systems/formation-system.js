import { getItemById } from '../configs/item-data.js';

export class FormationSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        this.formations = {
            'tran_do_tu_linh_tran': {
                name: 'Tụ Linh Trận',
                level: 1,
                effect: { tuViMult: 1.5 },
                costPerTick: 1, // 1 Ha Linh Thach per minute
                staminaCost: 5,
                manaCost: 20,
                baseSuccessRate: 0.9
            },
            'tran_do_ao_anh_tran': {
                name: 'Ảo Ảnh Trận',
                level: 2,
                effect: { evasion: 0.2 },
                costPerTick: 5,
                staminaCost: 15,
                manaCost: 50,
                baseSuccessRate: 0.75
            },
            'tran_do_sat_kiem_tran': {
                name: 'Sát Kiếm Trận',
                level: 3,
                effect: { atkBonus: 100 },
                costPerTick: 20,
                staminaCost: 30,
                manaCost: 100,
                baseSuccessRate: 0.6
            },
            'tran_do_ho_tong_dai_tran': {
                name: 'Hộ Tông Đại Trận',
                level: 5,
                effect: { defMult: 2.0 },
                costPerTick: 100,
                staminaCost: 100,
                manaCost: 500,
                baseSuccessRate: 0.4
            },
            'dien_dao_ngu_hanh_tran_ky': {
                name: 'Điên Đảo Ngũ Hành Trận',
                level: 4,
                effect: { defMult: 1.5, evasion: 0.15 },
                costPerTick: 50,
                staminaCost: 50,
                manaCost: 200,
                baseSuccessRate: 0.5
            }
        };
    }

    _normalizeId(diagramId) {
        if (!diagramId) return '';
        if (diagramId === 'tran_do_tu_linh' || diagramId === 'tran_do_tu_linh_tran') return 'tran_do_tu_linh_tran';
        if (diagramId === 'tran_do_ao_anh' || diagramId === 'tran_do_ao_anh_tran') return 'tran_do_ao_anh_tran';
        if (diagramId === 'tran_do_sat_kiem' || diagramId === 'tran_do_sat_kiem_tran') return 'tran_do_sat_kiem_tran';
        if (diagramId === 'ho_tong_dai_tran' || diagramId === 'tran_do_ho_tong_dai_tran') return 'tran_do_ho_tong_dai_tran';
        if (diagramId === 'dien_dao_ngu_hanh' || diagramId === 'dien_dao_ngu_hanh_tran_ky') return 'dien_dao_ngu_hanh_tran_ky';
        return diagramId;
    }

    activate(id) {
        return this.activateFormation(id);
    }

    deactivate(id) {
        return this.deactivateFormation(id);
    }

    activateFormation(diagramId) {
        const normId = this._normalizeId(diagramId);
        const formation = this.formations[normId];
        if (!formation) return { success: false, msg: 'Trận pháp không xác định!' };

        if (this.player.activeFormations.some(af => this._normalizeId(af.id) === normId)) {
            return { success: false, msg: 'Trận pháp này đã được kích hoạt!' };
        }

        if (this.player.activeFormations.length >= this.player.formationSlots) {
            return { success: false, msg: 'Đã đạt giới hạn số lượng trận pháp kích hoạt!' };
        }

        // Deployment: check if diagram is known
        const hasLearned = this.player.knownFormations.some(kf => this._normalizeId(kf) === normId);
        if (!hasLearned) {
            return { success: false, msg: 'Bạn chưa lĩnh ngộ được trận đồ này!' };
        }

        if (this.player.stamina < formation.staminaCost || this.player.mana < formation.manaCost) {
            return { success: false, msg: 'Không đủ trạng thái để bố trí trận pháp!' };
        }

        this.player.stamina -= formation.staminaCost;
        this.player.mana -= formation.manaCost;

        // Success check
        let successRate = formation.baseSuccessRate + (this.player.formationLevel * 0.05) + (this.player.soulRealmId * 0.02);
        if (Math.random() > successRate) {
            const damage = 100 * formation.level;
            this.player.hp -= damage;
            if (this.player.calculateStats) this.player.calculateStats();
            return { success: false, msg: `BỐ TRÍ THẤT BẠI! Trận văn phản phệ gây ${damage} sát thương!` };
        }

        this.player.activeFormations.push({
            id: normId,
            name: formation.name,
            startTime: Date.now(),
            setupTimeRemaining: 10 // 10 minutes preparation time
        });

        this.player.addFormationExp(formation.level * 100);
        if (this.player.calculateStats) this.player.calculateStats();

        return { success: true, msg: `Đã kích hoạt ${formation.name}! Bắt đầu quá trình bố trí (10 phút)...` };
    }

    deactivateFormation(diagramId) {
        const normId = this._normalizeId(diagramId);
        const index = this.player.activeFormations.findIndex(af => this._normalizeId(af.id) === normId);
        if (index === -1) return { success: false, msg: 'Trận pháp chưa được kích hoạt!' };

        const name = this.player.activeFormations[index].name;
        this.player.activeFormations.splice(index, 1);
        if (this.player.calculateStats) this.player.calculateStats();
        return { success: true, msg: `Đã thu hồi ${name}!` };
    }

    update(minutes) {
        let isStatsDirty = false;
        for (let i = this.player.activeFormations.length - 1; i >= 0; i--) {
            const active = this.player.activeFormations[i];
            const normId = this._normalizeId(active.id);
            const formation = this.formations[normId];
            if (!formation) continue;

            // Update setup countdown if still preparing
            if (active.setupTimeRemaining > 0) {
                active.setupTimeRemaining = Math.max(0, active.setupTimeRemaining - minutes);
                if (active.setupTimeRemaining === 0) {
                    if (this.ui) this.ui.toast(`Trận pháp [${active.name}] đã bố trí hoàn tất và bắt đầu phát huy tác dụng!`, 'success');
                    isStatsDirty = true;
                }
            }

            const totalCost = Math.ceil(formation.costPerTick * minutes);
            if (!this.player.spendLingShi(totalCost)) {
                this.player.activeFormations.splice(i, 1);
                isStatsDirty = true;
                if (this.ui) this.ui.toast(`${active.name} đã sụp đổ do thiếu Linh Thạch!`, 'error');
            }
        }
        if (isStatsDirty && this.player.calculateStats) {
            this.player.calculateStats();
        }
    }

    getBuffs() {
        let buffs = { tuViMult: 1.0, evasion: 0 };
        this.player.activeFormations.forEach(active => {
            if (active.setupTimeRemaining > 0) return; // Skip if still preparing
            const normId = this._normalizeId(active.id);
            const formation = this.formations[normId];
            if (!formation) return;
            if (formation.effect.tuViMult) buffs.tuViMult *= formation.effect.tuViMult;
            if (formation.effect.evasion) buffs.evasion += formation.effect.evasion;
        });
        return buffs;
    }
}

