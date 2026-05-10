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
    }
};

export const getSmithingLevelInfo = (level) => {
    const levels = [
        { name: 'Luyện Khí Sư Nhất Giai', exp: 0 },
        { name: 'Luyện Khí Sư Nhị Giai', exp: 1000 },
        { name: 'Luyện Khí Sư Tam Giai', exp: 5000 },
        { name: 'Luyện Khí Sư Tứ Giai', exp: 15000 },
        { name: 'Đại Luyện Khí Sư', exp: 50000 }
    ];
    return levels[level - 1] || { name: 'Thần Khí Sư', exp: 999999 };
};
