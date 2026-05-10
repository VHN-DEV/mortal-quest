export const TECHNIQUE_QUALITIES = {
    'BINH_THUONG': { id: 1, name: 'Bình Thường', multiplier: 1.0 },
    'UU_TU': { id: 2, name: 'Ưu Tú', multiplier: 1.2 },
    'TINH_ANH': { id: 3, name: 'Tinh Anh', multiplier: 1.5 },
    'HAOLAM': { id: 4, name: 'Hào Lam', multiplier: 2.0 },
    'HUYEN_THOAI': { id: 5, name: 'Huyền Thoại', multiplier: 3.0 },
    'THAN_THOAI': { id: 6, name: 'Thần Thoại', multiplier: 5.0 }
};

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
    'truong_xuan_nap_khi_quyet': {
        id: 'truong_xuan_nap_khi_quyet',
        name: 'Trường Xuân Nạp Khí Quyết',
        type: 'Linh Lực',
        quality: 'Hoàng',
        description: 'Công pháp nhập môn phổ thông được lưu truyền rộng rãi trong Nhân Giới. Ổn định, dễ tu luyện, ít tẩu hỏa nhập ma.',
        maxStage: 7,
        stats: { mana: 20, spd: 5 },
        effects: { tvps: 1.2, manaRegen: 1.0, stability: 10 }
    },
    'liet_duong_cong': {
        id: 'liet_duong_cong',
        name: 'Liệt Dương Công',
        type: 'Linh Lực',
        quality: 'Hoàng',
        description: 'Công pháp thuộc tính Hỏa, hấp thu linh khí mang tính nóng bỏng của mặt trời.',
        maxStage: 5,
        stats: { atk: 15, mana: 10 },
        effects: { tvps: 1.3, fireDamage: 1.2 }
    },
    'han_thuy_quyet': {
        id: 'han_thuy_quyet',
        name: 'Hàn Thủy Quyết',
        type: 'Linh Lực',
        quality: 'Hoàng',
        description: 'Công pháp thuộc tính Thủy, linh lực mang tính hàn băng, giúp ổn định tâm tính.',
        maxStage: 5,
        stats: { def: 10, mana: 30 },
        effects: { tvps: 1.3, iceDamage: 1.2 }
    },
    'thanh_moc_tam_kinh': {
        id: 'thanh_moc_tam_kinh',
        name: 'Thanh Mộc Tâm Kinh',
        type: 'Linh Lực',
        quality: 'Hoàng',
        description: 'Công pháp thuộc tính Mộc, tăng cường khả năng phục hồi và thọ nguyên.',
        maxStage: 5,
        stats: { hp: 50, mana: 10 },
        effects: { tvps: 1.4, healing: 1.5 }
    },
    'canh_kim_quyet': {
        id: 'canh_kim_quyet',
        name: 'Canh Kim Quyết',
        type: 'Linh Lực',
        quality: 'Hoàng',
        description: 'Công pháp thuộc tính Kim, linh lực sắc bén như thần binh lợi khí.',
        maxStage: 5,
        stats: { atk: 25 },
        effects: { tvps: 1.2, penet: 0.1 }
    },
    'hau_tho_cong': {
        id: 'hau_tho_cong',
        name: 'Hậu Thổ Công',
        type: 'Linh Lực',
        quality: 'Hoàng',
        description: 'Công pháp thuộc tính Thổ, phòng ngự vững chãi như đại địa.',
        maxStage: 5,
        stats: { def: 20, hp: 30 },
        effects: { tvps: 1.2, defMult: 1.15 }
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
