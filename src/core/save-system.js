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
    },

    /**
     * Xuất toàn bộ dữ liệu lưu trữ thành object JSON
     */
    exportAllSaves: async () => {
        try {
            const allMeta = await SaveSystem.getAllMetadata();
            const lastSlot = await SaveSystem.getLastSlot();
            const saves = {};
            
            for (let slot = 1; slot <= 5; slot++) {
                const data = await SaveSystem.load(slot);
                if (data) {
                    saves[slot] = data;
                }
            }
            
            return {
                type: 'mortal_quest_save_export',
                version: 1,
                exportedAt: Date.now(),
                saves,
                metadata: allMeta,
                lastSlot
            };
        } catch (e) {
            console.error('Lỗi khi xuất dữ liệu lưu trữ:', e);
            throw e;
        }
    },

    /**
     * Nhập toàn bộ dữ liệu lưu trữ từ object JSON
     */
    importAllSaves: async (exportData) => {
        try {
            if (!exportData || exportData.type !== 'mortal_quest_save_export') {
                throw new Error('Định dạng dữ liệu không hợp lệ');
            }
            
            // Xóa sạch dữ liệu cũ
            await SaveSystem.clearAll();
            
            // Khôi phục last slot
            if (exportData.lastSlot) {
                await SaveSystem.setLastSlot(exportData.lastSlot === 'null' || exportData.lastSlot === null ? null : parseInt(exportData.lastSlot, 10));
            }
            
            // Khôi phục metadata
            if (exportData.metadata) {
                await localforage.setItem(METADATA_KEY, exportData.metadata);
            }
            
            // Khôi phục dữ liệu các slot
            if (exportData.saves) {
                for (const [slot, data] of Object.entries(exportData.saves)) {
                    const key = `${SAVE_PREFIX}${slot}`;
                    await localforage.setItem(key, data);
                }
            }
            return true;
        } catch (e) {
            console.error('Lỗi khi nhập dữ liệu lưu trữ:', e);
            throw e;
        }
    },

    /**
     * Xuất một ô lưu trữ đơn lẻ thành object JSON
     */
    exportSlotSave: async (slot) => {
        try {
            const allMeta = await SaveSystem.getAllMetadata();
            const slotMeta = allMeta[slot];
            const slotData = await SaveSystem.load(slot);
            
            if (!slotData) {
                throw new Error(`Không tìm thấy dữ liệu lưu trữ tại ô số ${slot}`);
            }
            
            return {
                type: 'mortal_quest_slot_export',
                version: 1,
                exportedAt: Date.now(),
                slot,
                save: slotData,
                metadata: slotMeta
            };
        } catch (e) {
            console.error(`Lỗi khi xuất ô lưu trữ số ${slot}:`, e);
            throw e;
        }
    },

    /**
     * Nhập một ô lưu trữ đơn lẻ từ object JSON vào một ô được chỉ định
     */
    importSlotSave: async (slot, slotData) => {
        try {
            if (!slotData || slotData.type !== 'mortal_quest_slot_export') {
                throw new Error('Định dạng dữ liệu ô lưu trữ không hợp lệ');
            }
            
            // Cập nhật dữ liệu slot
            const key = `${SAVE_PREFIX}${slot}`;
            await localforage.setItem(key, slotData.save);
            
            // Cập nhật metadata cho slot đó
            const allMeta = await SaveSystem.getAllMetadata() || {};
            allMeta[slot] = slotData.metadata;
            await localforage.setItem(METADATA_KEY, allMeta);
            
            // Cập nhật last slot
            await SaveSystem.setLastSlot(slot);
            
            return true;
        } catch (e) {
            console.error(`Lỗi khi nhập ô lưu trữ số ${slot}:`, e);
            throw e;
        }
    }
};

// Unicode safe hex encoding/decoding helper functions (uppercase for codes)
export function utf8_to_hex(str) {
    const utf8Bytes = new TextEncoder().encode(str);
    return Array.from(utf8Bytes, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function hex_to_utf8(hex) {
    const cleanHex = hex.trim().replace(/[^0-9A-Fa-f]/g, '');
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
    }
    return new TextDecoder().decode(bytes);
}


