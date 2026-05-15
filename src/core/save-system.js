import { Preferences } from '@capacitor/preferences';
import { logger } from '../utils/logger.js';

const SAVE_PREFIX = 'mortal_quest_save_';
const METADATA_KEY = 'mortal_quest_metadata';
const LAST_SLOT_KEY = 'mortal_quest_last_slot';

/**
 * Hệ thống quản lý lưu trữ (Save System)
 * Hỗ trợ nhiều slot, metadata và tự động sao lưu.
 * Đã nâng cấp để sử dụng Capacitor Preferences trên thiết bị di động.
 */
export const SaveSystem = {
    currentSlot: 1,

    /**
     * Lưu slot cuối cùng được sử dụng
     */
    setLastSlot: async (slot) => {
        try {
            await Preferences.set({
                key: LAST_SLOT_KEY,
                value: slot === null ? 'null' : String(slot)
            });
        } catch (e) {
            console.error('Lỗi khi lưu last slot:', e);
        }
    },

    /**
     * Lấy slot cuối cùng được sử dụng
     */
    getLastSlot: async () => {
        try {
            const { value } = await Preferences.get({ key: LAST_SLOT_KEY });
            if (!value || value === 'null') return null;
            return parseInt(value, 10);
        } catch (e) {
            console.error('Lỗi khi lấy last slot:', e);
            return null;
        }
    },

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
     * Xóa sạch toàn bộ dữ liệu (Reset hoàn toàn)
     */
    clearAll: async () => {
        for (let slot of [1, 2, 3, 4, 5]) {
            await Preferences.remove({ key: `${SAVE_PREFIX}${slot}` });
        }
        await Preferences.remove({ key: METADATA_KEY });
        await Preferences.remove({ key: LAST_SLOT_KEY });
        await Preferences.remove({ key: 'mortal_quest_current_screen' });
        await Preferences.remove({ key: 'mortal_quest_map_view' });
        
        // Clear local storage too for safety
        localStorage.clear();
    }
};

