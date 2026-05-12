import { state } from '../state.js';
import { NPC_SPECIAL_RELATIONS } from '../configs/npc-data.js';

/**
 * Quản lý các mối quan hệ đặc biệt giữa Người chơi và NPC.
 * Bao gồm Đạo Lữ (Song Tu), Sư Đồ (Truyền Thừa), và Hậu Đại.
 */
export class SocialSystem {
    constructor() {
        this.bonds = {
            daoLu: null,    // ID của NPC là đạo lữ
            mentor: null,   // ID của NPC là sư phụ
            disciples: [],  // Danh sách ID của các đệ tử
            family: []      // Danh sách ID người thân
        };
    }

    /**
     * Thiết lập quan hệ Đạo Lữ (Song Tu)
     */
    proposeDaoLu(npc) {
        if (this.bonds.daoLu) {
            state.ui.toast("Ngươi đã có đạo lữ rồi, không thể tham lam vô độ!", "warning");
            return false;
        }

        if (npc.relationship < 80) {
            state.ui.toast(`${npc.name} cảm thấy quan hệ giữa hai người chưa đủ sâu đậm để kết thành đạo lữ.`, "info");
            return false;
        }

        // Check personality/goal factors
        if (npc.personalityIds.includes('lanh_lung') && npc.relationship < 95) {
            state.ui.toast(`${npc.name} là người lạnh lùng, cần sự chân thành tuyệt đối mới có thể lay động.`, "info");
            return false;
        }

        this.bonds.daoLu = npc.id;
        npc.specialRelation = 'dao_lu';
        npc.addMemory('become_dao_lu');
        
        state.ui.alert(`Chúc mừng! Ngươi và ${npc.name} đã kết thành Đạo Lữ. Từ nay đồng tâm hiệp lực, cùng nhau trường sinh.`, "Thiên Duyên Định Kết");
        this.applyDaoLuBenefits();
        return true;
    }

    /**
     * Nhận Sư Phụ
     */
    requestMentorship(npc) {
        if (this.bonds.mentor) {
            state.ui.toast("Ngươi đã có sư phụ chỉ điểm rồi.", "warning");
            return false;
        }

        if (npc.realmId <= state.player.realmId) {
            state.ui.toast(`${npc.name} cảm thấy tu vi của mình chưa đủ để chỉ dạy ngươi.`, "info");
            return false;
        }

        if (npc.relationship < 60) {
            state.ui.toast(`${npc.name} chưa đủ tin tưởng để nhận ngươi làm đồ đệ.`, "info");
            return false;
        }

        this.bonds.mentor = npc.id;
        npc.specialRelation = 'su_do';
        npc.addMemory('become_disciple');
        
        state.ui.alert(`Ngươi đã bái ${npc.name} làm thầy. Được cao nhân chỉ điểm, con đường tu tiên sẽ bớt phần gian nan.`, "Bái Sư Thành Công");
        this.applyMentorBenefits();
        return true;
    }

    /**
     * Lợi ích khi có Đạo Lữ
     */
    applyDaoLuBenefits() {
        if (!this.bonds.daoLu) return;
        
        // Tăng tốc độ tu luyện cơ bản
        // Trong thực tế, chúng ta sẽ hook vào Player.calculateStats hoặc tương tự
        state.ui.toast("Tốc độ tu luyện tăng 20% nhờ khí tức Đạo Lữ tương trợ.", "success");
    }

    /**
     * Lợi ích khi có Sư Phụ
     */
    applyMentorBenefits() {
        if (!this.bonds.mentor) return;
        
        // Tăng tốc độ lĩnh ngộ công pháp
        state.ui.toast("Tốc độ lĩnh ngộ công pháp tăng 15% nhờ Sư Phụ chỉ điểm.", "success");
    }

    /**
     * Kiểm tra và cập nhật các hiệu ứng xã hội hàng giây/phút
     */
    update(delta) {
        // Ví dụ: Nếu Đạo Lữ ở cùng vị trí, tăng thêm hiệu quả Song Tu
        if (this.bonds.daoLu) {
            const daoLu = state.systems.npc.npcs.find(n => n.id === this.bonds.daoLu);
            if (daoLu && daoLu.location === state.currentLocId) {
                // Thêm buff đặc biệt khi ở gần nhau
            }
        }
    }

    /**
     * Thực hiện Song Tu với Đạo Lữ
     */
    performDoubleCultivation() {
        if (!this.bonds.daoLu) {
            state.ui.toast("Ngươi chưa có đạo lữ để song tu.", "error");
            return;
        }

        const daoLu = state.systems.npc.npcs.find(n => n.id === this.bonds.daoLu);
        if (daoLu.location !== state.currentLocId) {
            state.ui.toast(`Đạo lữ ${daoLu.name} đang ở ${daoLu.location}, không thể song tu.`, "warning");
            return;
        }

        if (state.player.stamina < 30) {
            state.ui.toast("Thể lực không đủ để song tu.", "error");
            return;
        }

        state.player.stamina -= 30;
        
        // Tăng tu vi cho cả hai
        const gain = state.player.tuViPerSecond * 3600 * 0.1; // Tương đương 6 phút tu luyện
        state.player.tuVi += gain;
        daoLu.tuVi += gain;
        
        state.ui.toast(`Cùng đạo lữ ${daoLu.name} song tu, cảm ngộ thiên địa, tu vi tinh tiến!`, "success");

        // Xác suất có con (Hậu đại)
        if (Math.random() < 0.05) {
            this.generateChild(daoLu);
        }
    }

    /**
     * Sinh hậu đại
     */
    generateChild(partner) {
        const childId = Math.random().toString(36).substr(2, 9);
        const pParts = partner.name.split(' ');
        const childName = `${state.player.name.split(' ')[0]} ${pParts[pParts.length - 1]}`; 
        
        const child = {
            id: childId,
            name: childName,
            age: 0,
            talent: Math.max(state.player.luck || 50, partner.luck || 50) * 0.8,
            realm: "Phàm Nhân"
        };

        this.bonds.family.push(child);
        state.ui.alert(`Thiên hạ hỉ sự! Ngươi và ${partner.name} đã có một đứa con. Đặt tên là ${childName}.`, "Hậu Đại Chi Hỉ");
    }

    /**
     * Lấy danh sách quan hệ để lưu trữ
     */
    getData() {
        return { ...this.bonds };
    }

    /**
     * Khôi phục dữ liệu
     */
    loadData(data) {
        if (data) {
            this.bonds = { ...this.bonds, ...data };
            // Cập nhật lại specialRelation cho NPC
            if (this.bonds.daoLu) {
                const npc = state.systems.npc.npcs.find(n => n.id === this.bonds.daoLu);
                if (npc) npc.specialRelation = 'dao_lu';
            }
            if (this.bonds.mentor) {
                const npc = state.systems.npc.npcs.find(n => n.id === this.bonds.mentor);
                if (npc) npc.specialRelation = 'su_do';
            }
        }
    }
}
