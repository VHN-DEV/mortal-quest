import { getItemById } from '../configs/item-data.js';

export class FormationSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        this.formations = {
            'tran_do_tu_linh': {
                name: 'Tụ Linh Trận',
                effect: { tuViMult: 1.5 },
                costPerTick: 1, // 1 Ha Linh Thach per minute
                staminaCost: 5
            },
            'tran_do_ao_anh': {
                name: 'Ảo Ảnh Trận',
                effect: { evasion: 0.2 },
                costPerTick: 5,
                staminaCost: 10
            }
        };
    }

    activateFormation(diagramId) {
        const formation = this.formations[diagramId];
        if (!formation) return { success: false, msg: 'Trận pháp không xác định!' };

        if (this.player.activeFormations.length >= this.player.formationSlots) {
            return { success: false, msg: 'Đã đạt giới hạn số lượng trận pháp kích hoạt!' };
        }

        if (!this.player.inventory.hasItem(diagramId)) {
            return { success: false, msg: 'Bạn không có trận đồ này!' };
        }

        if (this.player.stamina < formation.staminaCost) {
            return { success: false, msg: 'Không đủ thể lực để bố trí trận pháp!' };
        }

        this.player.stamina -= formation.staminaCost;
        this.player.activeFormations.push({
            id: diagramId,
            name: formation.name,
            startTime: Date.now()
        });

        return { success: true, msg: `Đã kích hoạt ${formation.name}!` };
    }

    update(minutes) {
        for (let i = this.player.activeFormations.length - 1; i >= 0; i--) {
            const active = this.player.activeFormations[i];
            const formation = this.formations[active.id];
            
            const totalCost = formation.costPerTick * minutes;
            if (this.player.lingShi >= totalCost) {
                this.player.lingShi -= totalCost;
            } else {
                this.player.activeFormations.splice(i, 1);
                if (this.ui) this.ui.toast(`${active.name} đã sụp đổ do thiếu Linh Thạch!`, 'error');
            }
        }
    }

    getBuffs() {
        let buffs = { tuViMult: 1.0, evasion: 0 };
        this.player.activeFormations.forEach(active => {
            const formation = this.formations[active.id];
            if (formation.effect.tuViMult) buffs.tuViMult *= formation.effect.tuViMult;
            if (formation.effect.evasion) buffs.evasion += formation.effect.evasion;
        });
        return buffs;
    }
}
