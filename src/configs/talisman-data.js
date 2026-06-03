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
    },
    'thuan_di_phu': {
        id: 'thuan_di_phu',
        name: 'Thuấn Di Phù',
        level: 3,
        materials: [
            { id: 'yeu_thu_da_phu', quantity: 1 },
            { id: 'yeu_huyet_muc', quantity: 1 }
        ],
        baseSuccessRate: 0.5,
        staminaCost: 15,
        manaCost: 100,
        expGain: 150
    },
    'thien_loi_phu': {
        id: 'thien_loi_phu',
        name: 'Thiên Lôi Phù',
        level: 5,
        materials: [
            { id: 'yeu_thu_da_phu', quantity: 2 },
            { id: 'yeu_huyet_muc', quantity: 2 },
            { id: 'loi_linh_thach', quantity: 1 }
        ],
        baseSuccessRate: 0.35,
        staminaCost: 30,
        manaCost: 300,
        expGain: 500
    }
};

export const getTalismanLevelInfo = (level) => {
    const names = ["Nhập Môn Phù Sư", "Nhất Giai Phù Sư", "Nhị Giai Phù Sư", "Tam Giai Phù Sư", "Tứ Giai Phù Sư", "Ngũ Giai Phù Sư", "Lục Giai Phù Sư", "Thất Giai Phù Sư", "Bát Giai Phù Sư", "Cửu Giai Phù Sư", "Tiên Giai Phù Sư", "Thần Giai Phù Sư"];
    return {
        name: names[Math.min(level, names.length - 1)] || `Cấp ${level} Phù Sư`
    };
};
