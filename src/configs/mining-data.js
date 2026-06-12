/**
 * Cấu hình dữ liệu cho Hệ thống Khai Khoáng (Mining System)
 */

export const MINING_NODE_GRADES = {
    'HA': { id: 'HA', name: 'Hạ Cấp Linh Mạch', baseProduction: 10, items: ['ha_pham_linh_thach', 'kim_linh_thach', 'tho_linh_thach'], danger: 0.1 },
    'TRUNG': { id: 'TRUNG', name: 'Trung Cấp Linh Mạch', baseProduction: 50, items: ['trung_pham_linh_thach', 'hoa_linh_thach', 'bang_linh_thach'], danger: 0.3 },
    'CAO': { id: 'CAO', name: 'Cao Cấp Linh Mạch', baseProduction: 200, items: ['thuong_pham_linh_thach', 'loi_linh_thach', 'moc_linh_thach'], danger: 0.5 },
    'CUC': { id: 'CUC', name: 'Cực Phẩm Linh Mạch', baseProduction: 1000, items: ['cuc_pham_linh_thach', 'ma_linh_thach'], danger: 0.8 },
    'TIEN': { id: 'TIEN', name: 'Tiên Linh Mạch', baseProduction: 5000, items: ['tien_ngoc'], danger: 1.0 }
};

export const MINING_NODES = [
    {
        id: 'mo_hoang_tho',
        name: 'Mỏ Hoang Thổ',
        grade: 'HA',
        location: 'ngon_nui_vo_danh',
        description: 'Một mỏ linh thạch nhỏ nằm sâu trong lòng đất, linh khí mỏng manh.',
        maxOccupants: 5,
        requiredRealm: 1 // Luyện Khí 1
    },
    {
        id: 'linh_mach_xich_viem',
        name: 'Linh Mạch Xích Viêm',
        grade: 'TRUNG',
        location: 'nui_lua_xich_viem',
        description: 'Linh mạch rực rỡ hỏa khí, sản sinh ra nhiều Hỏa Linh Thạch.',
        maxOccupants: 3,
        requiredRealm: 11 // Trúc Cơ 1
    },
    {
        id: 'phu_tien_khoang',
        name: 'Phủ Tiên Khoáng',
        grade: 'CAO',
        location: 'tien_phu_di_tich',
        description: 'Khoáng động cổ xưa nằm trong di tích tiên phủ, chứa đựng linh thạch cực kỳ tinh thuần.',
        maxOccupants: 2,
        requiredRealm: 21 // Kết Đan 1
    },
    {
        id: 'thai_co_linh_mach',
        name: 'Thái Cổ Linh Mạch',
        grade: 'CUC',
        location: 'cam_khu_thai_co',
        description: 'Linh mạch từ thời Thái Cổ, linh khí đã hóa lỏng, sinh ra Cực Phẩm Linh Thạch.',
        maxOccupants: 1,
        requiredRealm: 31 // Nguyên Anh 1
    }
];

export const MINING_ACTIONS = {
    'MINE': { id: 'MINE', name: 'Khai Thác', staminaCost: 5, timeCost: 60, expGain: 10 },
    'OCCUPY': { id: 'OCCUPY', name: 'Chiếm Lĩnh', staminaCost: 20, timeCost: 300, expGain: 50 },
    'PROTECT': { id: 'PROTECT', name: 'Trấn Thủ', staminaCost: 10, timeCost: 600, expGain: 30 }
};
