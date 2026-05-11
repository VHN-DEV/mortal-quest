export const PUPPET_GRADES = {
    'PHAM': { id: 'PHAM', name: 'Phàm Cấp', multiplier: 1 },
    'LINH': { id: 'LINH', name: 'Linh Cấp', multiplier: 2 },
    'HUYEN': { id: 'HUYEN', name: 'Huyền Cấp', multiplier: 4 },
    'DIA': { id: 'DIA', name: 'Địa Cấp', multiplier: 8 },
    'THIEN': { id: 'THIEN', name: 'Thiên Cấp', multiplier: 15 },
    'THANH': { id: 'THANH', name: 'Thánh Cấp', multiplier: 30 },
    'TIEN': { id: 'TIEN', name: 'Tiên Cấp', multiplier: 100 }
};

export const PUPPET_TYPES = {
    'COMBAT': { id: 'COMBAT', name: 'Chiến Đấu', icon: '⚔️' },
    'GUARD': { id: 'GUARD', name: 'Hộ Vệ', icon: '🛡️' },
    'ALCHEMY': { id: 'ALCHEMY', name: 'Luyện Đan', icon: '🧪' },
    'MINING': { id: 'MINING', name: 'Khai Khoáng', icon: '⛏️' },
    'SCOUT': { id: 'SCOUT', name: 'Trinh Sát', icon: '👁️' },
    'SMITHING': { id: 'SMITHING', name: 'Luyện Khí', icon: '⚒️' },
    'FLIGHT': { id: 'FLIGHT', name: 'Phi Hành', icon: '🦅' },
    'WAR': { id: 'WAR', name: 'Chiến Tranh', icon: '🏯' }
};

export const PUPPET_CORE_TYPES = {
    'SPIRIT_STONE': { id: 'SPIRIT_STONE', name: 'Linh Thạch Lõi', efficiency: 1.0 },
    'BEAST_DAN': { id: 'BEAST_DAN', name: 'Yêu Đan Lõi', efficiency: 1.5 },
    'SOUL_ESSENCE': { id: 'SOUL_ESSENCE', name: 'Hồn Tinh Lõi', efficiency: 2.0 },
    'FLAME_CORE': { id: 'FLAME_CORE', name: 'Dị Hỏa Lõi', efficiency: 2.5 }
};

export const PUPPET_RECIPES = [
    {
        id: 'thiet_giap_khoi_loi',
        name: 'Thiết Giáp Khôi Lỗi',
        type: 'COMBAT',
        grade: 'PHAM',
        description: 'Khôi lỗi chống chịu cơ bản, đúc từ huyền thiết.',
        materials: [
            { id: 'huyen_thiet', quantity: 10 },
            { id: 'ling_thach_ha', quantity: 5 }
        ],
        stats: { hp: 500, def: 50, atk: 20 },
        skillLevel: 1
    },
    {
        id: 'kiem_khoi',
        name: 'Kiếm Khôi',
        type: 'COMBAT',
        grade: 'PHAM',
        description: 'Khôi lỗi cận chiến tốc độ cao.',
        materials: [
            { id: 'tinh_kim', quantity: 5 },
            { id: 'huyen_thiet', quantity: 5 },
            { id: 'ling_thach_ha', quantity: 10 }
        ],
        stats: { hp: 300, def: 20, atk: 60, spd: 30 },
        skillLevel: 3
    }
];
