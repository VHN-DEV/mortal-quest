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
    },
    {
        id: 'thanh_vien_khoi_loi',
        name: 'Thanh Viên Khôi Lỗi',
        type: 'COMBAT',
        grade: 'LINH',
        description: 'Khôi lỗi tinh xảo hình vượn xanh, là khôi lỗi Trúc Cơ mà Hàn Lập sử dụng nhiều nhất.',
        materials: [
            { id: 'thiet_moc_bach_nien', quantity: 10 },
            { id: 'ling_thach_trung', quantity: 5 }
        ],
        stats: { hp: 1500, def: 120, atk: 220, spd: 80 },
        skillLevel: 5
    },
    {
        id: 'cu_ho_khoi_loi',
        name: 'Cự Hổ Khôi Lỗi',
        type: 'WAR',
        grade: 'HUYEN',
        description: 'Con hổ khôi lỗi khổng lồ cao năm sáu trượng, há miệng bắn ra cột sáng trắng khổng lồ tiêu hao Hỏa Linh Thạch.',
        materials: [
            { id: 'thiet_moc_bach_nien', quantity: 30 },
            { id: 'huyen_thiet', quantity: 20 },
            { id: 'hoa_linh_thach_trung', quantity: 5 }
        ],
        stats: { hp: 5000, def: 400, atk: 1200, spd: 15 },
        skillLevel: 8
    }
];
export const getPuppetLevelInfo = (level) => {
    const names = ["Nhập Môn Khôi Lỗi Sư", "Nhất Giai Khôi Lỗi Sư", "Nhị Giai Khôi Lỗi Sư", "Tam Giai Khôi Lỗi Sư", "Tứ Giai Khôi Lỗi Sư", "Ngũ Giai Khôi Lỗi Sư", "Lục Giai Khôi Lỗi Sư", "Thất Giai Khôi Lỗi Sư", "Bát Giai Khôi Lỗi Sư", "Cửu Giai Khôi Lỗi Sư", "Tiên Giai Khôi Lỗi Sư", "Thần Giai Khôi Lỗi Sư"];
    return {
        name: names[Math.min(level, names.length - 1)] || `Cấp ${level} Khôi Lỗi Sư`
    };
};
