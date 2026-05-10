import { ALCHEMY_CERTIFICATIONS, GUILD_MISSIONS, ALCHEMY_ROOMS } from '../data/guild_data.js';
import { getItemById } from '../data/items.js';

export class GuildSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
    }

    /**
     * Start a certification exam
     */
    async certify(level) {
        const cert = ALCHEMY_CERTIFICATIONS.find(c => c.level === level);
        if (!cert) return;

        if (this.player.alchemyLevel < cert.requirements.alchemyLevel) {
            this.ui.toast("Cấp bậc luyện đan chưa đạt yêu cầu khảo hạch!", "error");
            return;
        }

        if (this.player.lingShi < cert.requirements.fee) {
            this.ui.toast("Không đủ Linh Thạch nộp lệ phí khảo hạch!", "error");
            return;
        }

        const confirm = await this.ui.confirm(
            `${cert.name}: Phí ${cert.requirements.fee} LT. Bạn cần nộp ${cert.task.quantity} viên ${getItemById(cert.task.targetId).name} đạt phẩm chất ${cert.task.minQuality}. Bắt đầu?`,
            "KHẢO HẠCH CÔNG HỘI"
        );

        if (confirm) {
            this.player.lingShi -= cert.requirements.fee;
            
            // Check inventory for task items
            const items = this.player.inventory.items.filter(i => i.id === cert.task.targetId);
            const validItems = items.filter(i => {
                const qMap = { 'Hạ Phẩm': 0, 'Trung Phẩm': 1, 'Thượng Phẩm': 2, 'Cực Phẩm': 3, 'Hoàn Mỹ': 4 };
                return qMap[i.quality || 'Hạ Phẩm'] >= qMap[cert.task.minQuality];
            });

            if (validItems.length >= cert.task.quantity) {
                // Success!
                for (let i = 0; i < cert.task.quantity; i++) {
                    this.player.inventory.removeItem(cert.task.targetId, 1);
                }
                this.player.alchemyReputation += cert.reward.reputation;
                this.player.lingShi += cert.reward.lingShi;
                this.ui.alert(`Chúc mừng! Bạn đã nhận được danh hiệu: ${cert.reward.title}`, "KHẢO HẠCH THÀNH CÔNG");
                return true;
            } else {
                this.ui.alert("Sản phẩm không đạt yêu cầu hoặc không đủ số lượng. Khảo hạch thất bại!", "KHẢO HẠCH THẤT BẠI");
                return false;
            }
        }
    }

    /**
     * Accept and complete guild missions
     */
    completeMission(missionId) {
        const mission = GUILD_MISSIONS.find(m => m.id === missionId);
        if (!mission) return;

        const items = this.player.inventory.items.filter(i => i.id === mission.targetId);
        const validItems = items.filter(i => {
            if (!mission.minQuality) return true;
            const qMap = { 'Hạ Phẩm': 0, 'Trung Phẩm': 1, 'Thượng Phẩm': 2, 'Cực Phẩm': 3, 'Hoàn Mỹ': 4 };
            return qMap[i.quality || 'Hạ Phẩm'] >= qMap[mission.minQuality];
        });

        if (validItems.length >= mission.quantity) {
            for (let i = 0; i < mission.quantity; i++) {
                this.player.inventory.removeItem(mission.targetId, 1);
            }
            this.player.lingShi += mission.rewards.lingShi;
            this.player.alchemyReputation += mission.rewards.reputation;
            if (mission.rewards.items) {
                mission.rewards.items.forEach(id => this.player.inventory.addItem(id, 1));
            }
            this.ui.toast(`Hoàn thành nhiệm vụ: ${mission.name}!`, "success");
            return true;
        } else {
            this.ui.toast("Không đủ đan dược yêu cầu!", "error");
            return false;
        }
    }

    /**
     * Rent a special alchemy room
     */
    rentRoom(roomId) {
        const room = ALCHEMY_ROOMS.find(r => r.id === roomId);
        if (this.player.lingShi >= room.fee) {
            this.player.lingShi -= room.fee;
            this.player.currentAlchemyRoom = room.id;
            this.ui.toast(`Đã thuê ${room.name}!`, "success");
            return true;
        }
        this.ui.toast("Không đủ Linh Thạch!", "error");
        return false;
    }
}
