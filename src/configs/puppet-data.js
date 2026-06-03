import { PUPPET_GRADES, PUPPET_TYPES, PUPPET_MAKING_LEVELS } from './game-enums.js';

export { PUPPET_GRADES, PUPPET_TYPES, PUPPET_MAKING_LEVELS };

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
            { id: 'ha_pham_linh_thach', quantity: 5 }
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
            { id: 'ha_pham_linh_thach', quantity: 10 }
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
            { id: 'bach_nien_thiet_moc', quantity: 10 },
            { id: 'trung_pham_linh_thach', quantity: 5 }
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
            { id: 'bach_nien_thiet_moc', quantity: 30 },
            { id: 'huyen_thiet', quantity: 20 },
            { id: 'hoa_linh_thach_trung_giai', quantity: 5 }
        ],
        stats: { hp: 5000, def: 400, atk: 1200, spd: 15 },
        skillLevel: 8
    }
];
export const getPuppetLevelInfo = (level) => {
    const levelKey = Math.min(level, Object.keys(PUPPET_MAKING_LEVELS).length - 1);
    const q = PUPPET_MAKING_LEVELS[levelKey];
    return {
        name: q ? q.name : `Cấp ${level} Khôi Lỗi Sư`
    };
};
