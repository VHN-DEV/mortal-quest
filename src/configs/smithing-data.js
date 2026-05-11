export const SMITHING_RECIPES = {
    'phi_kiem_tinh_ha': {
        id: 'phi_kiem_tinh_ha',
        name: 'Tinh Hà Phi Kiếm',
        level: 2,
        materials: [
            { id: 'tinh_kim', quantity: 10 },
            { id: 'huyen_thiet', quantity: 20 },
            { id: 'yeu_dan_so', quantity: 2 }
        ],
        baseSuccessRate: 0.6,
        staminaCost: 50,
        manaCost: 100,
        expGain: 500
    },
    'long_lan_giap': {
        id: 'long_lan_giap',
        name: 'Long Lân Giáp',
        level: 3,
        materials: [
            { id: 'huyen_thiet', quantity: 50 },
            { id: 'yeu_huyet', quantity: 10 },
            { id: 'tinh_kim', quantity: 5 }
        ],
        baseSuccessRate: 0.4,
        staminaCost: 100,
        manaCost: 200,
        expGain: 1200
    },
    'thanh_hong_kiem': {
        id: 'thanh_hong_kiem',
        name: 'Thanh Hồng Kiếm',
        level: 1,
        materials: [
            { id: 'huyen_thiet', quantity: 5 }
        ],
        baseSuccessRate: 0.8,
        staminaCost: 20,
        manaCost: 10,
        expGain: 100
    },
    'bat_quai_kinh': {
        id: 'bat_quai_kinh',
        name: 'Bát Quái Kính',
        level: 2,
        materials: [
            { id: 'tinh_kim', quantity: 5 },
            { id: 'thuy_tinh', quantity: 2 }
        ],
        baseSuccessRate: 0.65,
        staminaCost: 40,
        manaCost: 50,
        expGain: 300
    }
};

export const getSmithingLevelInfo = (level) => {
    const names = ["Nhập Môn Luyện Khí Sư", "Nhất Giai Luyện Khí Sư", "Nhị Giai Luyện Khí Sư", "Tam Giai Luyện Khí Sư", "Tứ Giai Luyện Khí Sư", "Ngũ Giai Luyện Khí Sư", "Lục Giai Luyện Khí Sư", "Thất Giai Luyện Khí Sư", "Bát Giai Luyện Khí Sư", "Cửu Giai Luyện Khí Sư", "Tiên Giai Luyện Khí Sư", "Thần Giai Luyện Khí Sư"];
    return {
        name: names[Math.min(level, names.length - 1)] || `Cấp ${level} Luyện Khí Sư`
    };
};
