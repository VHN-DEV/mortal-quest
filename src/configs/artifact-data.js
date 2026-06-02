import { PHAP_BAO_QUALITIES } from './game-enums.js';

export const ARTIFACT_TIERS = {
    PHAM_KHI: { ...PHAP_BAO_QUALITIES.PHAM_KHI, requirement: 'Phàm Nhân' },
    PHAP_KHI: { ...PHAP_BAO_QUALITIES.PHAP_KHI, requirement: 'Luyện Khí' },
    LINH_KHI: { ...PHAP_BAO_QUALITIES.LINH_KHI, requirement: 'Trúc Cơ' },
    PHAP_BAO: { ...PHAP_BAO_QUALITIES.PHAP_BAO, requirement: 'Kết Đan' },
    CO_BAO: { ...PHAP_BAO_QUALITIES.CO_BAO, requirement: 'Nguyên Anh' },
    LINH_BAO: { ...PHAP_BAO_QUALITIES.LINH_BAO, requirement: 'Hóa Thần' },
    THONG_THIEN: { ...PHAP_BAO_QUALITIES.THONG_THIEN_LINH_BAO, requirement: 'Luyện Hư' },
    TIEN_KHI: { ...PHAP_BAO_QUALITIES.TIEN_KHI, requirement: 'Đại Thừa' },
    DANH_KHI: { ...PHAP_BAO_QUALITIES.DANH_KHI, requirement: 'Chân Tiên' }
};

export const ARTIFACT_QUALITIES = {
    HA_PHAM: { id: 1, name: 'Hạ phẩm', multiplier: 1.0, color: '#cbd5e0' },
    TRUNG_PHAM: { id: 2, name: 'Trung phẩm', multiplier: 1.5, color: '#48bb78' },
    THUONG_PHAM: { id: 3, name: 'Thượng phẩm', multiplier: 2.0, color: '#4299e1' },
    CUC_PHAM: { id: 4, name: 'Cực phẩm', multiplier: 3.0, color: '#ed64a6' },
    HOAN_MY: { id: 5, name: 'Hoàn Mỹ', multiplier: 5.0, color: '#f6ad55' }
};

export const ARTIFACT_TYPES = {
    ATTACK: 'phap_bao_cong',   // Pháp bảo chủ chiến
    DEFENSE: 'phap_bao_thu', // Pháp bảo hộ thân
    FLIGHT: 'phap_bao_phi_hanh',   // Phi hành pháp bảo
    SPACE: 'phap_bao_khong_gian',     // Không gian pháp bảo
    FORMATION: 'phap_bao_tran', // Trận đạo pháp bảo
    SUPPORT: 'phap_bao_phu_tro', // Phụ trợ pháp bảo
    SOUL: 'phap_bao_hon'        // Hồn đạo pháp bảo
};

// Các chỉ số của Pháp Bảo
export const ARTIFACT_STATS = {
    // Chỉ số cơ bản
    ATK: 'atk',                // Công kích
    DEF: 'def',                // Phòng ngự
    MAX_HP: 'hp',              // Tăng máu
    MAX_MANA: 'mana',          // Tăng linh lực
    SPD: 'spd',                // Thân pháp
    DURABILITY: 'durability',  // Độ bền
    SPIRITUALITY: 'spirit',    // Linh tính
    COMPATIBILITY: 'compat',   // Độ tương thích
    COST_MANA: 'costMana',     // Tiêu hao linh lực mỗi lần dùng
    COST_SOUL: 'costSoul',     // Tiêu hao thần thức mỗi lần dùng

    // Chỉ số nâng cao
    PIERCE: 'pierce',          // Xuyên giáp
    SOUL_PIERCE: 'soulPierce', // Xuyên thần thức
    CRIT_RATE: 'critRate',     // Tỷ lệ bạo kích
    CRIT_DMG: 'critDmg',       // Sát thương bạo kích
    FIRE_DMG: 'fireDmg',       // Tăng hỏa hệ sát thương
    QI_ABSORB: 'qiAbsorb',     // Hấp thu linh khí
    LIFE_STEAL: 'lifeSteal',   // Hút sinh mệnh
    SOUL_REPRESS: 'soulRepress', // Trấn áp thần hồn
    CULTIVATE_SPEED: 'cultSpeed', // Tăng tốc độ tu luyện

    // Chỉ số đặc biệt
    DAO_VUN: 'daoVun',         // Đạo vận (tăng ngộ tính pháp tắc)
    LUCK: 'luck',              // Khí vận (may mắn)
    MURDEROUS_QI: 'murderQi',  // Hung sát chi khí (tăng sát thương nhưng dễ tâm ma)
};

// Hệ thống bộ trang bị (Sets)
export const ARTIFACT_SETS = {
    THIEN_CUONG_KIEM_TRAN: {
        name: 'Thiên Cương Kiếm Trận',
        items: ['thien_cuong_kiem_1', 'thien_cuong_kiem_2', 'thien_cuong_kiem_3'], // Ví dụ
        bonuses: [
            { count: 3, stats: { atk: 0.2 }, effects: ['Kích hoạt Kiếm Trận sơ cấp'] },
            { count: 12, stats: { atk: 1.0, pierce: 0.5 }, effects: ['Triệu hồi Thiên Cương Kiếm Trận'] }
        ]
    },
    CHAN_VU_NHO_QUAN_SET: {
        name: 'Chân Vũ Nho Quán',
        items: ['chan_vu_nho_quan_ta', 'chan_vu_nho_quan_huu'],
        bonuses: [
            { count: 2, stats: { def: 1.5, hp: 1.5 }, effects: ['Kích hoạt Chân Vũ Thánh Thể'] }
        ]
    }
};
