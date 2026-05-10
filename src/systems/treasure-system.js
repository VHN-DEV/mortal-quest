import { getItemById } from '../configs/item-data.js';

/**
 * Hệ thống Pháp Bảo chuyên sâu.
 * Quản lý Linh Tính, Khí Linh, Bản Mệnh Pháp Bảo và Nuôi Dưỡng.
 */
export class TreasureSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
    }

    /**
     * Nhận chủ Pháp Bảo
     */
    bindTreasure(itemId) {
        const item = getItemById(itemId);
        if (!item) return { success: false, msg: 'Vật phẩm không tồn tại.' };

        // Kiểm tra yêu cầu (ví dụ: Thần Thức hoặc Tu Vi)
        if (item.minSoul && this.player.soulRealmId < item.minSoul) {
            return { success: false, msg: 'Thần thức không đủ để nhận chủ pháp bảo này!' };
        }

        // Đánh dấu đã nhận chủ (trong inventory metadata)
        const playerItem = this.player.inventory.items.find(i => i.id === itemId);
        if (playerItem) {
            playerItem.isBound = true;
            playerItem.spiritPoints = 0; // Linh tính khởi đầu
            return { success: true, msg: `Đã nhận chủ thành công ${item.name}!` };
        }
        return { success: false, msg: 'Không tìm thấy vật phẩm trong túi đồ.' };
    }

    /**
     * Nuôi dưỡng Pháp Bảo (Nourish)
     * Tiêu tốn Linh Thạch hoặc Linh Lực để tăng Linh Tính
     */
    nourish(itemId, amount) {
        const playerItem = this.player.inventory.items.find(i => i.id === itemId);
        if (!playerItem || !playerItem.isBound) {
            return { success: false, msg: 'Cần nhận chủ pháp bảo trước khi nuôi dưỡng.' };
        }

        const cost = amount * 10; // 10 Linh thạch mỗi điểm linh tính
        if (this.player.lingShi < cost) {
            return { success: false, msg: 'Không đủ Linh Thạch để nuôi dưỡng.' };
        }

        this.player.lingShi -= cost;
        playerItem.spiritPoints = (playerItem.spiritPoints || 0) + amount;

        // Kiểm tra sinh Khí Linh
        if (playerItem.spiritPoints >= 1000 && !playerItem.hasSpirit) {
            playerItem.hasSpirit = true;
            return { success: true, msg: `Pháp bảo ${getItemById(itemId).name} đã sinh ra Khí Linh sơ cấp!` };
        }

        return { success: true, msg: `Nuôi dưỡng thành công! Linh tính hiện tại: ${playerItem.spiritPoints}` };
    }

    /**
     * Thiết lập Pháp Bảo Bản Mệnh (Vital Treasure)
     */
    setVitalTreasure(itemId) {
        const playerItem = this.player.inventory.items.find(i => i.id === itemId);
        if (!playerItem || !playerItem.isBound) {
            return { success: false, msg: 'Cần nhận chủ pháp bảo trước khi luyện thành bản mệnh.' };
        }

        if (this.player.vitalTreasureId) {
            return { success: false, msg: 'Bạn đã có một Pháp Bảo Bản Mệnh rồi!' };
        }

        // Tiêu tốn Tinh Huyết (giảm HP tạm thời)
        this.player.hp -= 50;
        this.player.vitalTreasureId = itemId;
        
        return { success: true, msg: `Đã luyện hóa thành công ${getItemById(itemId).name} thành Pháp Bảo Bản Mệnh!` };
    }
}
