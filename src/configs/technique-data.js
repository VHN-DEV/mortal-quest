export const TECHNIQUE_LEVELS = {
    'Hoàng': { id: 1, name: 'Hoàng Cấp', multiplier: 1.0 },
    'Huyền': { id: 2, name: 'Huyền Cấp', multiplier: 1.5 },
    'Địa': { id: 3, name: 'Địa Cấp', multiplier: 2.5 },
    'Thiên': { id: 4, name: 'Thiên Cấp', multiplier: 4.0 },
    'Tiên': { id: 5, name: 'Tiên Cấp', multiplier: 7.0 },
    'Đạo': { id: 6, name: 'Đạo Cấp', multiplier: 12.0 }
};

export const MASTERY_LEVELS = [
    { threshold: 0, name: 'Sơ Học Sạ Luyện', next: 100 },
    { threshold: 100, name: 'Lược Hiểu Môn Kính', next: 300 },
    { threshold: 300, name: 'Tiểu Thành', next: 800 },
    { threshold: 800, name: 'Đại Thành', next: 2000 },
    { threshold: 2000, name: 'Viên Mãn', next: 5000 },
    { threshold: 5000, name: 'Đăng Phong Tạo Cực', next: 12000 },
    { threshold: 12000, name: 'Xuất Thần Nhập Hóa', next: Infinity }
];

export const TECHNIQUES = {
    'truong_sinh_quyet': {
        id: 'truong_sinh_quyet',
        name: 'Thanh Mộc Trường Sinh Quyết',
        type: 'Linh Lực',
        quality: 'Hoàng',
        description: 'Môn công pháp cơ bản giúp tăng cường thọ nguyên và sinh mệnh.',
        maxStage: 5,
        stats: { hp: 20, mana: 10 },
        effects: { tvps: 1.1, maxHp: 20 }
    },
    'cuu_chuyen_kim_than': {
        id: 'cuu_chuyen_kim_than',
        name: 'Cửu Chuyển Kim Thân Quyết',
        type: 'Luyện Thể',
        quality: 'Địa',
        description: 'Môn công pháp luyện thể chí cao vô thượng, rèn luyện nhục thân thành kim cương bất hoại.',
        maxStage: 9,
        stats: { hp: 50, def: 10, spd: -2 },
        effects: { maxHp: 50, def: 10 }
    },
    'thai_am_chan_kinh': {
        id: 'thai_am_chan_kinh',
        name: 'Thái Âm Chân Kinh',
        type: 'Linh Lực',
        quality: 'Thiên',
        description: 'Hấp thụ tinh hoa của ánh trăng, linh lực mang tính hàn cực mạnh.',
        maxStage: 12,
        stats: { mana: 100, atk: 20 },
        effects: { mana: 100, atk: 20, tvps: 1.5 }
    }
};

export const SECRET_TECHNIQUES = {
    'huyet_don_thuat': {
        id: 'huyet_don_thuat',
        name: 'Huyết Độn Thuật',
        type: 'escape',
        quality: 'Huyền',
        icon: '🩸',
        description: 'Đốt cháy tinh huyết để thoát khỏi chiến đấu ngay lập tức.',
        costs: { hp: 20, lifespan: 1 },
        cooldown: 0,
        effects: { escape: true }
    },
    'am_sat_thu_phap': {
        id: 'am_sat_thu_phap',
        name: 'Ám Sát Thủ Pháp',
        type: 'attack',
        quality: 'Huyền',
        icon: '🗡️',
        description: 'Kỹ thuật ám sát lạnh lùng, nhắm vào điểm yếu đối phương.',
        costs: { mana: 30 },
        cooldown: 4,
        effects: { damageMult: 2.5, critChance: 0.3 }
    },
    'thien_loi_kich': {
        id: 'thien_loi_kich',
        name: 'Thiên Lôi Kích',
        type: 'attack',
        quality: 'Địa',
        icon: '⚡',
        description: 'Triệu hồi thiên lôi giáng xuống đầu kẻ thù.',
        costs: { mana: 100 },
        cooldown: 8,
        effects: { damageMult: 5.0, stun: true }
    }
};

export const getTechniqueById = (id) => TECHNIQUES[id];
export const getSecretTechniqueById = (id) => SECRET_TECHNIQUES[id];
