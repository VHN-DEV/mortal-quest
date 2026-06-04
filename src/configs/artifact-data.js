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

export function getItemRequirements(item) {
    const req = { mana: 0, divineSense: 0, law: 0, tienKhieu: 0 };
    if (!item) return req;

    // Explicit overrides
    if (item.requireMana !== undefined) req.mana = item.requireMana;
    if (item.requireDivineSense !== undefined) req.divineSense = item.requireDivineSense;
    if (item.requireLaw !== undefined) req.law = item.requireLaw;
    if (item.requireTienKhieu !== undefined) req.tienKhieu = item.requireTienKhieu;

    // Fall back to tier/quality-based defaults if not explicitly set
    const tier = item.tier || (item.quality && item.quality.id ? item.quality.id : item.quality);
    const t = typeof tier === 'string' ? tier.toUpperCase() : '';

    if (t === 'PHAM_KHI') {
        req.mana = 10;
    } else if (t === 'PHAP_KHI') {
        req.mana = 50;
        req.divineSense = 10;
    } else if (t === 'LINH_KHI') {
        req.mana = 150;
        req.divineSense = 40;
    } else if (t === 'PHAP_BAO') {
        req.mana = 500;
        req.divineSense = 150;
    } else if (t === 'CO_BAO') {
        req.divineSense = 250;
    } else if (t === 'LINH_BAO') {
        req.mana = 1500;
        req.divineSense = 500;
        req.law = 5;
    } else if (t === 'THONG_THIEN') {
        req.mana = 4000;
        req.divineSense = 1200;
        req.law = 20;
    } else if (t === 'HUYEN_THIEN' || t === 'HUYEN_THIEN_CHI_BAO') {
        req.mana = 15000;
        req.divineSense = 3000;
        req.law = 50;
    } else if (t === 'TIEN_KHI') {
        req.mana = 50000;
        req.divineSense = 8000;
        req.tienKhieu = 12;
    }

    return req;
}

export const NATAL_TREASURE_CONFIGS = {
    'thanh_truc_phong_van_kiem': {
        id: 'thanh_truc_phong_van_kiem',
        name: 'Thanh Trúc Phong Vân Kiếm',
        description: 'Bản mệnh phi kiếm do Hàn Lập luyện chế từ Vạn Niên Thiết Mộc. Ẩn chứa thần thông Phách Lôi và biến hóa khôn lường.',
        icon: '🗡️',
        stats: { atk: 250, spd: 30, thunderDmg: 0.15 },
        costs: {
            spiritStones: 200000,
            materials: {
                'van_nien_thiet_moc': 1,
                'tinh_kim': 5
            }
        }
    },
    'vo_hinh_cham': {
        id: 'vo_hinh_cham',
        name: 'Vô Hinh Châm',
        description: 'Pháp bảo bản mệnh vô ảnh vô hình, thích hợp ám sát và xuất kỳ bất ý.',
        icon: '🪡',
        stats: { atk: 180, pierce: 50, critRate: 0.1 },
        costs: {
            spiritStones: 150000,
            materials: {
                'tinh_kim': 10
            }
        }
    },
    'ngu_hanh_huyet_ngung_phach': {
        id: 'ngu_hanh_huyet_ngung_phach',
        name: 'Ngũ Hành Huyết Ngưng Phách',
        description: 'Bản mệnh pháp bảo kỳ dị luyện từ huyết anh chân tinh, dung hợp ngũ hành pháp tắc.',
        icon: '🔮',
        stats: { hp: 1500, def: 80, qiAbsorb: 0.1 },
        costs: {
            spiritStones: 250000,
            materials: {
                'van_nien_linh_nhu': 1,
                'van_nien_huyet_linh_chi': 1
            }
        }
    },
    'van_bao_phien': {
        id: 'van_bao_phien',
        name: 'Vạn Bảo Phiến',
        description: 'Quạt bản mệnh dung hợp vô số tài liệu quý hiếm, lay động có thể phát ra ngũ sắc quang mang công thủ vẹn toàn.',
        icon: '🪭',
        stats: { atk: 200, def: 50, mana: 500 },
        costs: {
            spiritStones: 300000,
            materials: {
                'van_nien_thiet_moc': 1,
                'van_nien_linh_nhu': 1
            }
        }
    }
};


