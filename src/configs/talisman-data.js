import { TALISMAN_LEVELS } from './game-enums.js';

export const TALISMAN_RECIPES = {
    'hoa_cau_phu': {
        id: 'hoa_cau_phu',
        name: 'Hỏa Cầu Phù',
        level: 1,
        materials: [
            { id: 'hoang_chi_phu', quantity: 1 },
            { id: 'chu_sa_linh_muc', quantity: 1 }
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
            { id: 'linh_moc_phu_chi', quantity: 1 },
            { id: 'chu_sa_linh_muc', quantity: 1 }
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
            { id: 'linh_moc_phu_chi', quantity: 1 },
            { id: 'chu_sa_linh_muc', quantity: 1 }
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
    'loi_kich_phu': {
        id: 'loi_kich_phu',
        name: 'Lôi Kích Phù',
        level: 1,
        materials: [
            { id: 'hoang_chi_phu', quantity: 1 },
            { id: 'chu_sa_linh_muc', quantity: 1 }
        ],
        baseSuccessRate: 0.75,
        staminaCost: 6,
        manaCost: 15,
        expGain: 25
    },
    'bang_tien_phu': {
        id: 'bang_tien_phu',
        name: 'Băng Tiễn Phù',
        level: 2,
        materials: [
            { id: 'linh_moc_phu_chi', quantity: 1 },
            { id: 'chu_sa_linh_muc', quantity: 1 }
        ],
        baseSuccessRate: 0.68,
        staminaCost: 9,
        manaCost: 25,
        expGain: 45
    },
    'huyen_quy_thuan_phu': {
        id: 'huyen_quy_thuan_phu',
        name: 'Huyền Quy Thuẫn Phù',
        level: 3,
        materials: [
            { id: 'yeu_thu_da_phu', quantity: 1 },
            { id: 'yeu_huyet_muc', quantity: 1 }
        ],
        baseSuccessRate: 0.55,
        staminaCost: 12,
        manaCost: 60,
        expGain: 100
    },
    'dinh_than_phu': {
        id: 'dinh_than_phu',
        name: 'Định Thân Phù',
        level: 3,
        materials: [
            { id: 'yeu_thu_da_phu', quantity: 1 },
            { id: 'yeu_huyet_muc', quantity: 1 }
        ],
        baseSuccessRate: 0.5,
        staminaCost: 15,
        manaCost: 80,
        expGain: 120
    },
    'tran_hon_phu': {
        id: 'tran_hon_phu',
        name: 'Trấn Hồn Phù',
        level: 4,
        materials: [
            { id: 'yeu_thu_da_phu', quantity: 1 },
            { id: 'yeu_huyet_muc', quantity: 2 }
        ],
        baseSuccessRate: 0.45,
        staminaCost: 20,
        manaCost: 150,
        expGain: 250
    },
    'loi_hoa_phu': {
        id: 'loi_hoa_phu',
        name: 'Lôi Hỏa Phù',
        level: 4,
        materials: [
            { id: 'yeu_thu_da_phu', quantity: 2 },
            { id: 'yeu_huyet_muc', quantity: 2 }
        ],
        baseSuccessRate: 0.4,
        staminaCost: 25,
        manaCost: 200,
        expGain: 300
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
    const values = Object.values(TALISMAN_LEVELS);
    const levelKey = Math.min(Math.max(0, level), values.length - 1);
    const q = values[levelKey];
    return {
        name: q ? q.name : `Cấp ${level} Phù Sư`
    };
};
