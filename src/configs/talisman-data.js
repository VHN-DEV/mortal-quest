export const TALISMAN_RECIPES = {
    'hoa_cau_phu': {
        id: 'hoa_cau_phu',
        name: 'Hỏa Cầu Phù',
        level: 1,
        materials: [
            { id: 'hoang_chi_phu', quantity: 1 },
            { id: 'chu_sa_muc', quantity: 1 }
        ],
        baseSuccessRate: 0.8,
        staminaCost: 5,
        manaCost: 10,
        expGain: 20
    },
    'kim_cuong_phu': {
        id: 'kim_cuong_phu',
        name: 'Kim Cương Phù',
        level: 2,
        materials: [
            { id: 'linh_moc_phu', quantity: 1 },
            { id: 'chu_sa_muc', quantity: 1 }
        ],
        baseSuccessRate: 0.65,
        staminaCost: 10,
        manaCost: 30,
        expGain: 50
    },
    'than_hanh_phu': {
        id: 'than_hanh_phu',
        name: 'Thần Hành Phù',
        level: 2,
        materials: [
            { id: 'linh_moc_phu', quantity: 1 },
            { id: 'chu_sa_muc', quantity: 1 }
        ],
        baseSuccessRate: 0.7,
        staminaCost: 8,
        manaCost: 20,
        expGain: 40
    }
};

export const getTalismanLevelInfo = (level) => {
    const levels = [
        { name: 'Phù Sư Nhất Giai', exp: 0 },
        { name: 'Phù Sư Nhị Giai', exp: 500 },
        { name: 'Phù Sư Tam Giai', exp: 1500 },
        { name: 'Phù Sư Tứ Giai', exp: 4000 },
        { name: 'Phù Sư Ngũ Giai', exp: 10000 }
    ];
    return levels[level - 1] || { name: 'Đại Phù Sư', exp: 999999 };
};
