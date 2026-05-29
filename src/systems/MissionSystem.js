import { state } from '../state.js';
import { getItemById } from '../configs/item-data.js';

/**
 * Hệ thống Nhiệm vụ Tông môn
 */
export class MissionSystem {
    constructor() {
        this.missions = [];
        this.completedCount = 0;
        this.lastRefresh = 0;
        this.refreshInterval = 300000; // 5 phút làm mới nhiệm vụ một lần
    }

    init() {
        this.refreshMissions();
    }

    update() {
        const now = Date.now();
        if (now - this.lastRefresh > this.refreshInterval) {
            this.refreshMissions();
        }
    }

    refreshMissions() {
        if (!state.player) return;
        
        // Giữ lại các nhiệm vụ đang thực hiện, tạo mới các nhiệm vụ còn lại
        const activeMissions = this.missions.filter(m => m.status === 'active');
        const newMissions = [];
        
        const count = 5 - activeMissions.length;
        for (let i = 0; i < count; i++) {
            newMissions.push(this.generateRandomMission());
        }
        
        this.missions = [...activeMissions, ...newMissions];
        this.lastRefresh = Date.now();
    }

    generateRandomMission() {
        const playerLevel = state.player.realmId || 1;
        const types = ['kill', 'collect', 'cultivate'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let mission = {
            id: 'm_' + Math.random().toString(36).substr(2, 9),
            type: type,
            status: 'available',
            progress: 0,
            target: 0,
            reward: 0
        };

        switch (type) {
            case 'kill':
                mission.title = "Trấn Áp Yêu Thú";
                mission.description = "Yêu thú quấy nhiễu biên giới tông môn, hãy đi tiêu diệt chúng.";
                mission.target = 5 + Math.floor(playerLevel * 1.5);
                mission.reward = 5000 * playerLevel;
                break;
            case 'collect':
                mission.title = "Thu Thập Linh Thảo";
                mission.description = "Dược đường đang thiếu hụt linh dược, cần thu thập gấp.";
                mission.target = 3 + Math.floor(playerLevel * 0.5);
                mission.reward = 8000 * playerLevel;
                break;
            case 'cultivate':
                mission.title = "Tông Môn Tuần Tra";
                mission.description = "Thực hiện tuần tra xung quanh linh địa tông môn.";
                mission.target = 60; // 60 giây
                mission.reward = 3000 * playerLevel;
                break;
        }

        return mission;
    }

    acceptMission(missionId) {
        const mission = this.missions.find(m => m.id === missionId);
        if (mission && mission.status === 'available') {
            mission.status = 'active';
            state.ui.toast("Đã nhận nhiệm vụ: " + mission.title, "success");
            return true;
        }
        return false;
    }

    completeMission(missionId) {
        const index = this.missions.findIndex(m => m.id === missionId);
        if (index !== -1) {
            const mission = this.missions[index];
            if (mission.status === 'active' && mission.progress >= mission.target) {
                // Phát thưởng
                state.player.addLingShi(mission.reward);
                state.ui.toast(`Nhiệm vụ hoàn thành! Nhận được ${mission.reward.toLocaleString()} Linh Thạch.`, "success");
                
                // Xóa nhiệm vụ và cập nhật thống kê
                this.missions.splice(index, 1);
                this.completedCount++;
                
                // Làm mới ngay lập tức một nhiệm vụ mới
                this.missions.push(this.generateRandomMission());
                return true;
            }
        }
        return false;
    }

    // Hook để các hệ thống khác gọi khi có tiến triển
    onAction(type, amount = 1) {
        this.missions.forEach(m => {
            if (m.status === 'active' && m.type === type) {
                m.progress = Math.min(m.target, m.progress + amount);
            }
        });
    }
}
