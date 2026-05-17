/**
 * Cấu hình dữ liệu cho Hệ thống Linh Thạch
 */

export const CONVERSION_RATE = 100; // Tỷ lệ quy đổi giữa các cấp

export const SPIRIT_STONE_GRADES = {
    'HA': {
        id: 'HA',
        name: 'Hạ Phẩm Linh Thạch',
        shortName: 'Hạ',
        icon: 'items/ha_pham_linh_thach',
        value: 1,
        multiplier: 1,
        nextGrade: 'TRUNG',
        color: '#4fd1c5',
        cssClass: 'text-qi-blue'
    },
    'TRUNG': {
        id: 'TRUNG',
        name: 'Trung Phẩm Linh Thạch',
        shortName: 'Trung',
        icon: 'items/trung_pham_linh_thach',
        value: 100,
        multiplier: 100,
        nextGrade: 'THUONG',
        color: '#a855f7',
        cssClass: 'text-qi-purple'
    },
    'THUONG': {
        id: 'THUONG',
        name: 'Thượng Phẩm Linh Thạch',
        shortName: 'Thượng',
        icon: 'items/thuong_pham_linh_thach',
        value: 10000,
        multiplier: 10000,
        nextGrade: 'CUC',
        color: '#f6ad55',
        cssClass: 'text-cultivation-gold'
    },
    'CUC': {
        id: 'CUC',
        name: 'Cực Phẩm Linh Thạch',
        shortName: 'Cực',
        icon: 'items/cuc_pham_linh_thach',
        value: 1000000,
        multiplier: 1000000,
        nextGrade: 'TIEN',
        color: '#f472b6',
        cssClass: 'text-pink-400'
    },
    'TIEN': {
        id: 'TIEN',
        name: 'Tiên Tinh',
        shortName: 'Tiên',
        value: 100000000,
        multiplier: 100000000,
        nextGrade: 'HON_DON',
        color: '#10b981',
        cssClass: 'text-emerald-400'
    },
    'HON_DON': {
        id: 'HON_DON',
        name: 'Hỗn Độn Tinh',
        shortName: 'Hỗn',
        value: 10000000000,
        multiplier: 10000000000,
        nextGrade: 'HONG_MONG',
        color: '#6366f1',
        cssClass: 'text-indigo-400'
    },
    'HONG_MONG': {
        id: 'HONG_MONG',
        name: 'Hồng Mông Linh Tinh',
        shortName: 'Hồng',
        value: 1000000000000,
        multiplier: 1000000000000,
        nextGrade: null,
        color: '#a855f7',
        cssClass: 'text-purple-500'
    }
};

export const SPIRIT_STONE_QUALITIES = {
    'TAP': { id: 'TAP', name: 'Tạp Chất', multiplier: 0.5, color: '#9ca3af' },
    'BINH_THUONG': { id: 'BINH_THUONG', name: 'Bình Thường', multiplier: 1.0, color: '#ffffff' },
    'TINH_THUAN': { id: 'TINH_THUAN', name: 'Tinh Thuần', multiplier: 2.0, color: '#60a5fa' },
    'HOAN_MY': { id: 'HOAN_MY', name: 'Hoàn Mỹ', multiplier: 5.0, color: '#fbbf24' }
};

export const SPIRIT_STONE_ATTRIBUTES = {
    'NORMAL': { id: 'NORMAL', name: 'Vô Thuộc Tính', bonus: 1.0 },
    'FIRE': { id: 'FIRE', name: 'Hỏa', bonus: 1.2 },
    'ICE': { id: 'ICE', name: 'Băng', bonus: 1.2 },
    'WOOD': { id: 'WOOD', name: 'Mộc', bonus: 1.2 },
    'METAL': { id: 'METAL', name: 'Kim', bonus: 1.2 },
    'EARTH': { id: 'EARTH', name: 'Thổ', bonus: 1.2 },
    'LIGHTNING': { id: 'LIGHTNING', name: 'Lôi', bonus: 1.5 },
    'DEMON': { id: 'DEMON', name: 'Ma Khí', bonus: 1.5 },
    'IMMORTAL': { id: 'IMMORTAL', name: 'Tiên Khí', bonus: 2.0 }
};
