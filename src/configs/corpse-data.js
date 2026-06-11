/**
 * DỮ LIỆU HỆ THỐNG LUYỆN THI
 * Thi khôi = chiến binh bất tử được luyện chế từ xác chết
 */

import { CORPSE_LEVELS } from './game-enums.js';

// =============================================
// CÁC LOẠI THI KHÔI CÓ THỂ LUYỆN CHẾ
// =============================================
export const CORPSE_TYPES = {
    'thi_binh': {
        id: 'thi_binh',
        name: 'Thi Binh',
        icon: '🧟',
        level: 1,
        materials: [
            { id: 'yeu_thu_tinh_huyet', quantity: 5 },
            { id: 'ma_thach_ha_pham', quantity: 1 }
        ],
        stats: { atk: 50, def: 100, hp: 500 },
        gatherBonus: { type: 'herb', multiplier: 1.1 },
        description: 'Xác chết được luyện chế sơ cấp, cử động chậm chạp nhưng da dày thịt béo.'
    },
    'thi_tuong': {
        id: 'thi_tuong',
        name: 'Thi Tướng',
        icon: '🧟‍♂️',
        level: 2,
        materials: [
            { id: 'yeu_thu_tinh_huyet', quantity: 20 },
            { id: 'ma_thach_ha_pham', quantity: 5 },
            { id: 'huyen_thiet', quantity: 2 }
        ],
        stats: { atk: 150, def: 300, hp: 1500 },
        gatherBonus: { type: 'ore', multiplier: 1.15 },
        description: 'Thi tướng nắm giữ một chút chiến đấu bản năng, cực kỳ hung hãn.'
    },
    'dong_giap_thi': {
        id: 'dong_giap_thi',
        name: 'Đồng Giáp Thi',
        icon: '🥉',
        level: 3,
        materials: [
            { id: 'yeu_thu_tinh_huyet', quantity: 50 },
            { id: 'ma_thach_ha_pham', quantity: 15 },
            { id: 'huyen_thiet', quantity: 10 }
        ],
        stats: { atk: 400, def: 800, hp: 4000 },
        gatherBonus: { type: 'ore', multiplier: 1.25 },
        description: 'Thân thể cứng như đồng thiếc, đao thương bất nhập.'
    },
    'ngan_giap_thi': {
        id: 'ngan_giap_thi',
        name: 'Ngân Giáp Thi',
        icon: '🥈',
        level: 4,
        materials: [
            { id: 'yeu_thu_tinh_huyet', quantity: 150 },
            { id: 'ma_thach_trung_pham', quantity: 10 },
            { id: 'huyen_thiet', quantity: 30 },
            { id: 'tinh_ngan', quantity: 5 }
        ],
        stats: { atk: 1000, def: 2000, hp: 10000 },
        gatherBonus: { type: 'all', multiplier: 1.3 },
        description: 'Bạc ngân bao phủ toàn thân, kỹ năng chiến đấu được khắc ghi trong xác thịt.'
    },
    'kim_giap_thi': {
        id: 'kim_giap_thi',
        name: 'Kim Giáp Thi',
        icon: '🥇',
        level: 5,
        materials: [
            { id: 'yeu_thu_tinh_huyet', quantity: 500 },
            { id: 'ma_thach_thuong_pham', quantity: 10 },
            { id: 'tinh_kim', quantity: 20 },
            { id: 'am_tinh_chi', quantity: 5 }
        ],
        stats: { atk: 3000, def: 5000, hp: 30000 },
        gatherBonus: { type: 'all', multiplier: 1.5 },
        description: 'Hoàng kim bọc thân, cấp độ Boss đáng sợ không thể xuyên phá bằng vũ lực thông thường.'
    },
    'thi_vuong': {
        id: 'thi_vuong',
        name: 'Thi Vương',
        icon: '👑',
        level: 7,
        materials: [
            { id: 'nguyen_anh_thi_the', quantity: 1 },
            { id: 'am_tinh_chi', quantity: 20 },
            { id: 'ma_thach_thuong_pham', quantity: 50 },
            { id: 'tinh_kim', quantity: 50 }
        ],
        stats: { atk: 8000, def: 12000, hp: 80000 },
        gatherBonus: { type: 'rare', multiplier: 2.0 },
        description: 'Thi vương mang trí tuệ còn sót lại của một cường giả, có thể tự phán đoán chiến trường.'
    },
    'thi_hoang': {
        id: 'thi_hoang',
        name: 'Thi Hoàng',
        icon: '💀',
        level: 10,
        materials: [
            { id: 'hoa_than_thi_the', quantity: 1 },
            { id: 'am_tinh_chi', quantity: 100 },
            { id: 'thi_dan', quantity: 5 },
            { id: 'linh_tinh_thach', quantity: 10 }
        ],
        stats: { atk: 25000, def: 35000, hp: 250000 },
        gatherBonus: { type: 'rare', multiplier: 3.0 },
        description: 'Đơn vị truyền thuyết. Thi Hoàng là xác của một Hóa Thần tu sĩ bị âm khí tha hóa hoàn toàn, sức mạnh kinh thiên động địa.'
    }
};

// =============================================
// THỨC ĂN NUÔI DƯỠNG THI KHÔI
// =============================================
export const CORPSE_FOODS = {
    'am_khi': {
        id: 'am_khi',
        name: 'Âm Khí Tinh Tụ',
        itemId: 'am_khi_tinh_tu',
        stat: 'hp',
        bonus: 50,
        expGain: 20,
        description: 'Bổ sung âm khí nâng cao sinh lực thi hài'
    },
    'thi_chau': {
        id: 'thi_chau',
        name: 'Thi Châu',
        itemId: 'thi_chau',
        stat: 'def',
        bonus: 30,
        expGain: 30,
        description: 'Ngọc thi châu tăng cường phòng ngự'
    },
    'huyet_tinh': {
        id: 'huyet_tinh',
        name: 'Huyết Tinh',
        itemId: 'yeu_thu_tinh_huyet',
        stat: 'atk',
        bonus: 40,
        expGain: 25,
        description: 'Tinh huyết của yêu thú tăng cường sức tấn công'
    },
    'ma_thach': {
        id: 'ma_thach',
        name: 'Ma Thạch',
        itemId: 'ma_thach_ha_pham',
        stat: 'all',
        bonus: 10,
        expGain: 15,
        description: 'Ma thạch cơ bản, tăng toàn diện nhẹ'
    }
};

// =============================================
// TIẾN HÓA THI KHÔI
// =============================================
export const CORPSE_EVOLUTIONS = {
    'thi_binh_to_thi_tuong': {
        fromId: 'thi_binh',
        toId: 'thi_tuong',
        levelRequired: 5,
        materials: [
            { id: 'ma_thach_ha_pham', quantity: 10 },
            { id: 'yeu_thu_tinh_huyet', quantity: 30 }
        ],
        description: 'Thi Binh → Thi Tướng'
    },
    'thi_tuong_to_dong_giap': {
        fromId: 'thi_tuong',
        toId: 'dong_giap_thi',
        levelRequired: 8,
        materials: [
            { id: 'ma_thach_trung_pham', quantity: 5 },
            { id: 'huyen_thiet', quantity: 20 }
        ],
        description: 'Thi Tướng → Đồng Giáp Thi'
    },
    'dong_giap_to_ngan_giap': {
        fromId: 'dong_giap_thi',
        toId: 'ngan_giap_thi',
        levelRequired: 12,
        corpseSkillLevelRequired: 4,
        materials: [
            { id: 'ma_thach_trung_pham', quantity: 15 },
            { id: 'tinh_ngan', quantity: 5 },
            { id: 'thi_dan', quantity: 1 }
        ],
        description: 'Đồng Giáp Thi → Ngân Giáp Thi'
    },
    'ngan_giap_to_kim_giap': {
        fromId: 'ngan_giap_thi',
        toId: 'kim_giap_thi',
        levelRequired: 18,
        corpseSkillLevelRequired: 5,
        materials: [
            { id: 'ma_thach_thuong_pham', quantity: 10 },
            { id: 'tinh_kim', quantity: 10 },
            { id: 'am_tinh_chi', quantity: 3 },
            { id: 'thi_dan', quantity: 2 }
        ],
        description: 'Ngân Giáp Thi → Kim Giáp Thi'
    }
};

// =============================================
// CHẾ ĐỘ HOẠT ĐỘNG
// =============================================
export const CORPSE_MODES = {
    COMBAT: { id: 'COMBAT', name: 'Chiến Đấu', icon: '⚔️', desc: 'Thi khôi tham chiến cùng ngươi mỗi lượt đánh' },
    GATHER: { id: 'GATHER', name: 'Thu Thập', icon: '🌿', desc: 'Tự động thu thập tài nguyên theo thời gian' },
    GUARD: { id: 'GUARD', name: 'Hộ Vệ', icon: '🛡️', desc: 'Hấp thụ một phần sát thương nhận vào' },
    PATROL: { id: 'PATROL', name: 'Tuần Tra', icon: '👁️', desc: 'Phát hiện địch và cảnh báo phục kích' }
};

// =============================================
// CẤP ĐỘ LUYỆN THI SƯ
// =============================================
export const getCorpseLevelInfo = (level) => {
    const values = Object.values(CORPSE_LEVELS);
    const levelKey = Math.min(Math.max(0, level - 1), values.length - 1);
    const q = values[levelKey];
    return {
        name: q ? q.name : `Cấp ${level} Thi Sư`
    };
};

// =============================================
// THU THẬP TÀI NGUYÊN (Thu thập theo chế độ GATHER)
// =============================================
export const CORPSE_GATHER_REWARDS = {
    herb: [
        { id: 'thanh_la_linh_thao', chance: 0.30, qty: [1, 3] },
        { id: 'bach_truoc_thao', chance: 0.25, qty: [1, 2] },
        { id: 'linh_chi', chance: 0.15, qty: [1, 2] },
        { id: 'ngu_linh_thao', chance: 0.10, qty: [1, 1] }
    ],
    ore: [
        { id: 'huyen_thiet', chance: 0.40, qty: [1, 3] },
        { id: 'tinh_ngan', chance: 0.20, qty: [1, 2] },
        { id: 'tinh_kim', chance: 0.10, qty: [1, 2] },
        { id: 'ma_thach_ha_pham', chance: 0.50, qty: [2, 5] }
    ],
    rare: [
        { id: 'am_tinh_chi', chance: 0.15, qty: [1, 1] },
        { id: 'thi_chau', chance: 0.20, qty: [1, 2] },
        { id: 'ma_thach_trung_pham', chance: 0.25, qty: [1, 2] },
        { id: 'yeu_thu_tinh_huyet', chance: 0.35, qty: [3, 8] }
    ],
    all: [
        { id: 'huyen_thiet', chance: 0.35, qty: [1, 3] },
        { id: 'thanh_la_linh_thao', chance: 0.25, qty: [1, 2] },
        { id: 'yeu_thu_tinh_huyet', chance: 0.30, qty: [2, 5] },
        { id: 'ma_thach_ha_pham', chance: 0.40, qty: [1, 4] }
    ]
};
