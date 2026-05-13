const SAVE_PREFIX = 'mortal_quest_save_';
const METADATA_KEY = 'mortal_quest_metadata';
const LEGACY_SAVE_KEY = 'mortal_quest_save';

/**
 * Hệ thống quản lý lưu trữ (Save System)
 * Hỗ trợ nhiều slot, metadata và tự động sao lưu.
 */
export const SaveSystem = {
    currentSlot: 1,

    /**
     * Lưu dữ liệu vào một slot cụ thể
     * @param {number} slot - Số thứ tự slot (1-3)
     * @param {Object} data - Dữ liệu game
     * @param {Object} metadata - Thông tin hiển thị ngoài màn hình chọn save
     */
    save: (slot, data, metadata = null) => {
        try {
            const key = `${SAVE_PREFIX}${slot}`;
            localStorage.setItem(key, JSON.stringify(data));

            if (metadata) {
                const allMeta = SaveSystem.getAllMetadata();
                allMeta[slot] = {
                    ...metadata,
                    updatedAt: Date.now(),
                    slot: slot
                };
                localStorage.setItem(METADATA_KEY, JSON.stringify(allMeta));
            }
            return true;
        } catch (e) {
            console.error('Lỗi khi lưu dữ liệu:', e);
            return false;
        }
    },

    /**
     * Tải dữ liệu từ một slot
     */
    load: (slot) => {
        try {
            const key = `${SAVE_PREFIX}${slot}`;
            const saved = localStorage.getItem(key);
            if (!saved) return null;
            return JSON.parse(saved);
        } catch (e) {
            console.error(`Lỗi khi tải dữ liệu slot ${slot}:`, e);
            return null;
        }
    },

    /**
     * Lấy toàn bộ metadata của các slot
     */
    getAllMetadata: () => {
        try {
            const meta = localStorage.getItem(METADATA_KEY);
            return meta ? JSON.parse(meta) : {};
        } catch (e) {
            return {};
        }
    },

    /**
     * Xóa một slot save
     */
    deleteSave: (slot) => {
        localStorage.removeItem(`${SAVE_PREFIX}${slot}`);
        const allMeta = SaveSystem.getAllMetadata();
        delete allMeta[slot];
        localStorage.setItem(METADATA_KEY, JSON.stringify(allMeta));
    },

    /**
     * Đổi tên nhân vật trong metadata (hiển thị)
     */
    renameSave: (slot, newName) => {
        const allMeta = SaveSystem.getAllMetadata();
        if (allMeta[slot]) {
            allMeta[slot].name = newName;
            localStorage.setItem(METADATA_KEY, JSON.stringify(allMeta));
            return true;
        }
        return false;
    },

    /**
     * Di cư dữ liệu cũ (Legacy) sang Slot 1 nếu có
     */
    migrateLegacySave: () => {
        const legacyData = localStorage.getItem(LEGACY_SAVE_KEY);
        if (legacyData) {
            try {
                const data = JSON.parse(legacyData);
                // Tạo metadata cơ bản cho legacy save
                const metadata = {
                    name: data.name || 'Vô Danh',
                    realm: data.realmName || 'Phàm Nhân',
                    age: data.age || 18,
                    area: data.currentLocId || 'Thanh Vân Trấn',
                    playTime: data.playTime || 0,
                    avatar: data.avatar || 'player_male'
                };
                SaveSystem.save(1, data, metadata);
                // Xóa dữ liệu cũ sau khi migrate thành công
                localStorage.removeItem(LEGACY_SAVE_KEY);
                console.log('Đã di cư dữ liệu cũ sang Slot 1 thành công.');
            } catch (e) {
                console.error('Lỗi khi di cư dữ liệu cũ:', e);
            }
        }
    },

    /**
     * Xóa sạch toàn bộ dữ liệu (Reset hoàn toàn)
     */
    clearAll: () => {
        [1, 2, 3].forEach(slot => {
            localStorage.removeItem(`${SAVE_PREFIX}${slot}`);
        });
        localStorage.removeItem(METADATA_KEY);
        localStorage.removeItem('mortal_quest_current_screen');
        localStorage.removeItem('mortal_quest_map_view');
    }
};
