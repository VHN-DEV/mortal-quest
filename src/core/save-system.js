import localforage from 'localforage';
import { logger } from '../utils/logger.js';

// Configure localforage instance for Mortal Quest saves
localforage.config({
    name: 'MortalQuest',
    storeName: 'saves',
    description: 'Bản lưu game Phàm Nhân Vấn Đạo'
});

const SAVE_PREFIX = 'mortal_quest_save_';
const METADATA_KEY = 'mortal_quest_metadata';
const LAST_SLOT_KEY = 'mortal_quest_last_slot';

/**
 * Hệ thống quản lý lưu trữ (Save System) sử dụng IndexedDB qua LocalForage
 * Hỗ trợ nhiều slot, lưu metadata và hiệu năng cao.
 */
export const SaveSystem = {
    currentSlot: 1,

    /**
     * Lưu slot cuối cùng được sử dụng
     */
    setLastSlot: async (slot) => {
        try {
            await localforage.setItem(LAST_SLOT_KEY, slot === null ? 'null' : String(slot));
        } catch (e) {
            console.error('Lỗi khi lưu last slot:', e);
        }
    },

    /**
     * Lấy slot cuối cùng được sử dụng
     */
    getLastSlot: async () => {
        try {
            const value = await localforage.getItem(LAST_SLOT_KEY);
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
            // localforage tự động serialize đối tượng JSON phức tạp
            await localforage.setItem(key, data);

            if (metadata) {
                const allMeta = await SaveSystem.getAllMetadata();
                allMeta[slot] = {
                    ...metadata,
                    updatedAt: Date.now(),
                    slot: slot
                };
                await localforage.setItem(METADATA_KEY, allMeta);
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
            const value = await localforage.getItem(key);
            if (!value) return null;
            
            // localforage tự động deserialize đối tượng JSON
            return typeof value === 'string' ? JSON.parse(value) : value;
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
            const value = await localforage.getItem(METADATA_KEY);
            if (!value) return {};
            return typeof value === 'string' ? JSON.parse(value) : value;
        } catch (e) {
            console.error('Lỗi khi lấy metadata:', e);
            return {};
        }
    },

    /**
     * Xóa một slot save
     */
    deleteSave: async (slot) => {
        try {
            await localforage.removeItem(`${SAVE_PREFIX}${slot}`);
            const allMeta = await SaveSystem.getAllMetadata();
            delete allMeta[slot];
            await localforage.setItem(METADATA_KEY, allMeta);
        } catch (e) {
            console.error(`Lỗi khi xóa slot ${slot}:`, e);
        }
    },

    /**
     * Đổi tên nhân vật trong metadata (hiển thị)
     */
    renameSave: async (slot, newName) => {
        try {
            const allMeta = await SaveSystem.getAllMetadata();
            if (allMeta[slot]) {
                allMeta[slot].name = newName;
                await localforage.setItem(METADATA_KEY, allMeta);
                return true;
            }
            return false;
        } catch (e) {
            console.error(`Lỗi khi đổi tên slot ${slot}:`, e);
            return false;
        }
    },

    /**
     * Xóa sạch toàn bộ dữ liệu (Reset hoàn toàn)
     */
    clearAll: async () => {
        try {
            await localforage.clear();
            localStorage.clear();
        } catch (e) {
            console.error('Lỗi khi xóa sạch dữ liệu:', e);
        }
    }
};
