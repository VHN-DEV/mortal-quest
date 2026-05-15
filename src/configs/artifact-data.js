/**
 * Hệ thống phẩm cấp và phẩm chất của Pháp Bảo
 */

export const ARTIFACT_TIERS = {
    PHAM_KHI: { id: 'Phàm Khí', name: 'Phàm Khí', requirement: 'Phàm Nhân', color: '#ffffff' },
    PHAP_KHI: { id: 'Pháp Khí', name: 'Pháp Khí', requirement: 'Luyện Khí', color: '#10b981' },
    LINH_KHI: { id: 'Linh Khí', name: 'Linh Khí', requirement: 'Trúc Cơ', color: '#3b82f6' },
    PHAP_BAO: { id: 'Pháp Bảo', name: 'Pháp Bảo', requirement: 'Kết Đan', color: '#8b5cf6' },
    CO_BAO: { id: 'Cổ Bảo', name: 'Cổ Bảo', requirement: 'Nguyên Anh', color: '#f59e0b' },
    LINH_BAO: { id: 'Linh Bảo', name: 'Linh Bảo', requirement: 'Hóa Thần', color: '#ef4444' },
    THONG_THIEN: { id: 'Thông Thiên Linh Bảo', name: 'Thông Thiên Linh Bảo', requirement: 'Luyện Hư', color: '#d4af37' },
    TIEN_KHI: { id: 'Tiên Khí', name: 'Tiên Khí', requirement: 'Đại Thừa', color: 'rainbow' },
    DANH_KHI: { id: 'Danh Khí', name: 'Danh Khí', requirement: 'Chân Tiên', color: '#f87171' }
};

export const ARTIFACT_QUALITIES = {
    HA_PHAM: { id: 1, name: 'Hạ phẩm', multiplier: 1.0, color: '#cbd5e0' },
    TRUNG_PHAM: { id: 2, name: 'Trung phẩm', multiplier: 1.5, color: '#48bb78' },
    THUONG_PHAM: { id: 3, name: 'Thượng phẩm', multiplier: 2.0, color: '#4299e1' },
    CUC_PHAM: { id: 4, name: 'Cực phẩm', multiplier: 3.0, color: '#ed64a6' },
    HOAN_MY: { id: 5, name: 'Hoàn Mỹ', multiplier: 5.0, color: '#f6ad55' }
};

export const ARTIFACT_TYPES = {
    ATTACK: 'attackArtifact',   // Pháp bảo chủ chiến
    DEFENSE: 'defenseArtifact', // Pháp bảo hộ thân
    FLIGHT: 'flightArtifact',   // Phi hành pháp bảo
    SPACE: 'spaceArtifact',     // Không gian pháp bảo
    FORMATION: 'formationArtifact', // Trận đạo pháp bảo
    SUPPORT: 'supportArtifact', // Phụ trợ pháp bảo
    SOUL: 'soulArtifact'        // Hồn đạo pháp bảo
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
