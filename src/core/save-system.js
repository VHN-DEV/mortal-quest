import { Preferences } from '@capacitor/preferences';

const SAVE_PREFIX = 'mortal_quest_save_';
const METADATA_KEY = 'mortal_quest_metadata';
const LEGACY_SAVE_KEY = 'mortal_quest_save';

/**
 * Hệ thống quản lý lưu trữ (Save System)
 * Hỗ trợ nhiều slot, metadata và tự động sao lưu.
 * Đã nâng cấp để sử dụng Capacitor Preferences trên thiết bị di động.
 */
export const SaveSystem = {
    currentSlot: 1,

    /**
     * Lưu dữ liệu vào một slot cụ thể
     */
    save: async (slot, data, metadata = null) => {
        try {
            const key = `${SAVE_PREFIX}${slot}`;
            const value = JSON.stringify(data);
            
            await Preferences.set({
                key: key,
                value: value
            });

            if (metadata) {
                const allMeta = await SaveSystem.getAllMetadata();
                allMeta[slot] = {
                    ...metadata,
                    updatedAt: Date.now(),
                    slot: slot
                };
                await Preferences.set({
                    key: METADATA_KEY,
                    value: JSON.stringify(allMeta)
                });
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
    load: async (slot) => {
        try {
            const key = `${SAVE_PREFIX}${slot}`;
            const { value } = await Preferences.get({ key: key });
            if (!value) return null;
            return JSON.parse(value);
        } catch (e) {
            console.error(`Lỗi khi tải dữ liệu slot ${slot}:`, e);
            return null;
        }
    },

    /**
     * Lấy toàn bộ metadata của các slot
     */
    getAllMetadata: async () => {
        try {
            const { value } = await Preferences.get({ key: METADATA_KEY });
            return value ? JSON.parse(value) : {};
        } catch (e) {
            console.error('Lỗi khi lấy metadata:', e);
            return {};
        }
    },

    /**
     * Xóa một slot save
     */
    deleteSave: async (slot) => {
        await Preferences.remove({ key: `${SAVE_PREFIX}${slot}` });
        const allMeta = await SaveSystem.getAllMetadata();
        delete allMeta[slot];
        await Preferences.set({
            key: METADATA_KEY,
            value: JSON.stringify(allMeta)
        });
    },

    /**
     * Đổi tên nhân vật trong metadata (hiển thị)
     */
    renameSave: async (slot, newName) => {
        const allMeta = await SaveSystem.getAllMetadata();
        if (allMeta[slot]) {
            allMeta[slot].name = newName;
            await Preferences.set({
                key: METADATA_KEY,
                value: JSON.stringify(allMeta)
            });
            return true;
        }
        return false;
    },

    /**
     * Di cư dữ liệu cũ (Legacy) sang Slot 1 nếu có
     */
    migrateLegacySave: async () => {
        // Kiểm tra cả localStorage (cho web cũ) và Preferences
        let legacyData = localStorage.getItem(LEGACY_SAVE_KEY);
        
        if (!legacyData) {
            const { value } = await Preferences.get({ key: LEGACY_SAVE_KEY });
            legacyData = value;
        }

        if (legacyData) {
            try {
                const data = JSON.parse(legacyData);
                const metadata = {
                    name: data.name || 'Vô Danh',
                    realm: data.realmName || 'Phàm Nhân',
                    age: data.age || 18,
                    area: data.currentLocId || 'Thanh Vân Trấn',
                    playTime: data.playTime || 0,
                    avatar: data.avatar || 'player_male'
                };
                await SaveSystem.save(1, data, metadata);
                
                // Xóa dữ liệu cũ
                localStorage.removeItem(LEGACY_SAVE_KEY);
                await Preferences.remove({ key: LEGACY_SAVE_KEY });
                
                console.log('Đã di cư dữ liệu cũ sang Slot 1 thành công.');
            } catch (e) {
                console.error('Lỗi khi di cư dữ liệu cũ:', e);
            }
        }
    },

    /**
     * Xóa sạch toàn bộ dữ liệu (Reset hoàn toàn)
     */
    clearAll: async () => {
        for (let slot of [1, 2, 3]) {
            await Preferences.remove({ key: `${SAVE_PREFIX}${slot}` });
        }
        await Preferences.remove({ key: METADATA_KEY });
        await Preferences.remove({ key: 'mortal_quest_current_screen' });
        await Preferences.remove({ key: 'mortal_quest_map_view' });
        
        // Clear local storage too for safety
        localStorage.clear();
    }
};

