import { REPUTATION_TIERS, MORALITY_SCALES, TITLES, ACTION_IMPACTS } from '../configs/fate-data.js';

export class FateSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
    }

    /**
     * Xử lý một hành động có ảnh hưởng đến nhân quả/danh tiếng
     * @param {string} actionId ID của hành động từ ACTION_IMPACTS
     * @param {object} context Thông tin bổ sung (npcId, v.v.)
     */
    processAction(actionId, context = {}) {
        const impact = typeof ACTION_IMPACTS[actionId] === 'function' 
            ? ACTION_IMPACTS[actionId](context.realmId || 1) 
            : ACTION_IMPACTS[actionId];

        if (!impact) return;

        if (impact.rep) {
            this.player.addReputation(impact.rep);
            if (impact.rep > 0) this.ui.toast(`Danh tiếng tăng lên! (+${impact.rep})`, 'info');
        }

        if (impact.morality) {
            this.player.addMorality(impact.morality);
            const color = impact.morality > 0 ? 'text-qi-jade' : 'text-red-500';
            this.ui.toast(`Đạo tâm biến hóa: <span class="${color}">${impact.morality > 0 ? '+' : ''}${impact.morality} Thiện Ác</span>`, 'warning');
        }

        if (impact.karma) {
            if (impact.karma > 0) this.player.addKarma(0, impact.karma);
            else this.player.addKarma(Math.abs(impact.karma), 0);
        }

        // Kiểm tra danh hiệu mới
        this.checkTitleUnlocks();
    }

    checkTitleUnlocks() {
        const p = this.player;
        TITLES.forEach(title => {
            if (p.fate.titles.includes(title.id)) return;

            let eligible = true;
            if (title.repMin && p.fate.reputation < title.repMin) eligible = false;
            if (title.moralityMin && p.fate.morality < title.moralityMin) eligible = false;
            if (title.moralityMax && p.fate.morality > title.moralityMax) eligible = false;

            if (eligible) {
                if (p.unlockTitle(title.id)) {
                    this.ui.alert(`Ngươi đã đạt được danh hiệu mới: [${title.name}]`, 'Danh Chấn Thiên Hạ');
                }
            }
        });
    }

    getReputationTier() {
        const rep = this.player.fate.reputation;
        return REPUTATION_TIERS.find(t => rep >= t.min && rep <= t.max) || REPUTATION_TIERS[0];
    }

    getMoralityScale() {
        const mor = this.player.fate.morality;
        return MORALITY_SCALES.find(s => mor >= s.min && mor <= s.max) || MORALITY_SCALES[2];
    }

    getKarmaDebt() {
        // Nghiệp lực (Sin) - Công đức (Merit)
        return Math.max(0, this.player.fate.sin - this.player.fate.merit);
    }

    /**
     * Tính toán ảnh hưởng của Nghiệp Lực lên tỉ lệ đột phá
     * Trả về hệ số (0.5 to 1.0)
     */
    getBreakthroughPenalty() {
        const debt = this.getKarmaDebt();
        if (debt <= 0) return 1.0;
        
        // Cứ 1000 nghiệp lực giảm 10% tỉ lệ thành công, tối đa giảm 50%
        const penalty = Math.min(0.5, debt / 10000);
        return 1.0 - penalty;
    }

    /**
     * Ảnh hưởng của Danh tiếng lên giá giao dịch
     */
    getTradingMultiplier() {
        const tier = this.getReputationTier();
        return tier.bonus.trading || 1.0;
    }

    /**
     * Kiểm tra và kích hoạt Thiên Kiếp nếu nghiệp lực quá cao.
     * Thường gọi trong vòng lặp game hoặc sau các hành động ác.
     */
    checkTribulation() {
        const debt = this.getKarmaDebt();
        // Cần ít nhất 1000 nghiệp lực để dẫn động thiên kiếp
        if (debt < 1000) return false;

        // Xác suất xảy ra Thiên Kiếp ngẫu nhiên (tăng dần theo nghiệp lực)
        const chance = Math.min(0.02, debt / 500000); 
        if (Math.random() < chance) {
            this.ui.alert("Thiên địa biến sắc, mây đen vây kín! Nghiệp lực quấn thân của ngươi đã dẫn động Thiên Đạo trừng phạt!", "THIÊN KIẾP GIÁNG LÂM");
            
            // Nếu game có hệ thống combat đặc biệt, gọi nó ở đây
            if (window.game && typeof window.game.startSpecialCombat === 'function') {
                window.game.startSpecialCombat('heavenly_lightning', debt);
            } else {
                // Dự phòng: Trừ HP trực tiếp nếu chưa có combat đặc biệt
                const damage = Math.floor(this.player.maxHp * 0.4);
                this.player.hp -= damage;
                this.ui.toast(`Ngươi bị sét đánh trúng, mất ${damage} sinh lực!`, 'error');
            }
            return true;
        }
        return false;
    }
}
