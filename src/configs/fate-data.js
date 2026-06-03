import { MORALITY_SCALES as MORALITY_SCALES_OBJ, KARMA_TYPES } from './game-enums.js';
export { KARMA_TYPES };
export const MORALITY_SCALES = Object.values(MORALITY_SCALES_OBJ);

/**
 * DỮ LIỆU HỆ THỐNG DANH TIẾNG - NHÂN QUẢ - THIỆN ÁC
 */

export const REPUTATION_TIERS = [
    { id: 'vo_danh', name: 'Vô Danh Tiểu Tốt', min: 0, max: 100, bonus: { trading: 1.0 } },
    { id: 'co_chut', name: 'Có Chút Danh Tiếng', min: 100, max: 1000, bonus: { trading: 0.98 } },
    { id: 'danh_dong', name: 'Danh Động Một Phương', min: 1000, max: 10000, bonus: { trading: 0.95, sectInvite: 0.1 } },
    { id: 'uy_chan', name: 'Uy Chấn Nhân Giới', min: 10000, max: 100000, bonus: { trading: 0.9, sectInvite: 0.3, encounterLuck: 0.1 } },
    { id: 'chan_dong', name: 'Chấn Động Vạn Giới', min: 100000, max: 1000000, bonus: { trading: 0.85, sectInvite: 0.6, encounterLuck: 0.25 } },
    { id: 'cong_chu', name: 'Thiên Hạ Cộng Chủ', min: 1000000, max: Infinity, bonus: { trading: 0.8, sectInvite: 1.0, encounterLuck: 0.5 } }
];





export const TITLES = [
    // Chính Đạo
    { id: 'thanh_van', name: 'Thanh Vân Chân Nhân', moralityMin: 500, repMin: 5000, bonus: { def: 1.1, luck: 5 } },
    { id: 'ho_dao', name: 'Hộ Đạo Giả', moralityMin: 300, repMin: 1000, bonus: { maxHp: 1.1, staminaRegen: 1.2 } },
    { id: 'thien_kieu_chinh', name: 'Thiên Kiêu Chính Đạo', moralityMin: 400, repMin: 10000, bonus: { tuViSpeed: 1.2 } },
    
    // Ma Đạo
    { id: 'huyet_hai', name: 'Huyết Hải Ma Tôn', moralityMax: -500, repMin: 5000, bonus: { atk: 1.1, lifeSteal: 0.05 } },
    { id: 'bach_cot', name: 'Bạch Cốt Lão Ma', moralityMax: -300, repMin: 1000, bonus: { def: 1.15, soulPierce: 0.1 } },
    { id: 'van_hon', name: 'Vạn Hồn Ma Quân', moralityMax: -400, repMin: 10000, bonus: { soulExpSpeed: 1.2, soulPierce: 0.15 } },

    // Trung Lập
    { id: 'tan_tu_vuong', name: 'Tán Tu Chi Vương', repMin: 20000, bonus: { luck: 15, expGain: 1.1 } },
    { id: 'thuong_dao_cu', name: 'Thương Đạo Cự Phách', repMin: 50000, bonus: { trading: 0.8, lingshiGain: 1.2 } },

    // Đặc Biệt / Truyền Thuyết
    { id: 'thu_nguyen_du_hanh_gia', name: 'Thứ Nguyên Du Hành Giả', repMin: 100000, bonus: { spd: 1.25, dodge: 0.1, luck: 30 } },
    { id: 'hoi_quy_gia', name: 'Hồi Quy Giả', repMin: 80000, bonus: { tuViSpeed: 1.2, luck: 40, critRate: 0.05 } },
    { id: 'chuyen_sinh_gia', name: 'Chuyển Sinh Giả', repMin: 50000, bonus: { soulExpSpeed: 1.25, techniqueMastery: 1.2, luck: 25 } }
];

export const ACTION_IMPACTS = {
    KILL_INNOCENT: { morality: -20, karma: -10, rep: 5 },
    KILL_MONSTER: { rep: 2 },
    KILL_EVIL_CULTIVATOR: { morality: 15, rep: 10, karma: 5 },
    SAVE_NPC: { morality: 50, rep: 20, karma: 30 },
    DONATE_SECT: { rep: 50, morality: 10 },
    BETRAY_SECT: { rep: -500, morality: -100, karma: -200 },
    ROB_NPC: { morality: -30, karma: -20, rep: 10 },
    GIFT_NPC: { morality: 5, karma: 10 },
    BREAKTHROUGH: (realmId) => ({ rep: Math.pow(realmId, 2) * 10 })
};
