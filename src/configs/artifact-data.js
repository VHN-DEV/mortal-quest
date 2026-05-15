/**
 * Hệ thống phẩm cấp và phẩm chất của Pháp Bảo
 */

export const ARTIFACT_TIERS = {
    PHAM_KHI: { id: 1, name: 'Phàm Khí', requirement: 'Phàm Nhân', color: '#94a3b8' },
    PHAP_KHI: { id: 2, name: 'Pháp Khí', requirement: 'Luyện Khí', color: '#4fd1c5' },
    LINH_KHI: { id: 3, name: 'Linh Khí', requirement: 'Trúc Cơ', color: '#3182ce' },
    CHAN_BAO: { id: 4, name: 'Chân Bảo', requirement: 'Nguyên Anh', color: '#805ad5' },
    HUYEN_THIEN: { id: 5, name: 'Huyền Thiên Linh Bảo', requirement: 'Hóa Thần', color: '#d53f8c' },
    THONG_THIEN: { id: 6, name: 'Thông Thiên Linh Bảo', requirement: 'Luyện Hư', color: '#ecc94b' },
    TIEN_KHI: { id: 7, name: 'Tiên Khí', requirement: 'Đại Thừa', color: '#f56565' },
    DAO_KHI: { id: 8, name: 'Đạo Khí', requirement: 'Độ Kiếp', color: '#ffffff' },
    HONG_MONG: { id: 9, name: 'Hồng Mông Chí Bảo', requirement: 'Tiên Nhân', color: '#000000' }
};

export const ARTIFACT_QUALITIES = {
    TAN_KHUYET: { id: 1, name: 'Tàn Khuyết', multiplier: 0.5, color: '#4a5568' },
    THUONG: { id: 2, name: 'Thường', multiplier: 1.0, color: '#cbd5e0' },
    TINH_PHAM: { id: 3, name: 'Tinh Phẩm', multiplier: 1.5, color: '#48bb78' },
    HOAN_MY: { id: 4, name: 'Hoàn Mỹ', multiplier: 2.0, color: '#4299e1' },
    CUC_PHAM: { id: 5, name: 'Cực Phẩm', multiplier: 3.0, color: '#ed64a6' },
    TRUYEN_THUYET: { id: 6, name: 'Truyền Thuyết', multiplier: 5.0, color: '#f6ad55' },
    THAN_THOAI: { id: 7, name: 'Thần Thoại', multiplier: 10.0, color: '#f56565' },
    DANH_KHI: { id: 8, name: 'Danh Khí', multiplier: 25.0, color: '#FFD700' },
    DANH_BAO: { id: 9, name: 'Danh Bảo', multiplier: 60.0, color: '#FF4500' }
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
    }
};
