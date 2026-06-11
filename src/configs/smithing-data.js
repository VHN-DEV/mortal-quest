import { SMITHING_LEVELS } from './game-enums.js';

export const SMITHING_RECIPES = {
    'tinh_ha_phi_kiem': {
        id: 'tinh_ha_phi_kiem',
        name: 'Tinh Hà Phi Kiếm',
        level: 2,
        materials: [
            { id: 'tinh_kim', quantity: 10 },
            { id: 'huyen_thiet', quantity: 20 },
            { id: 'ha_pham_yeu_dan', quantity: 2 }
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
            { id: 'yeu_thu_tinh_huyet', quantity: 10 },
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
            { id: 'thuy_tinh_linh_khoang', quantity: 2 }
        ],
        baseSuccessRate: 0.65,
        staminaCost: 40,
        manaCost: 50,
        expGain: 300
    },
    'luyen_che_linh_hu_tui': {
        id: 'luyen_che_linh_hu_tui',
        name: 'Luyện Chế Linh Hư Túi',
        level: 1,
        materials: [
            { id: 'huyen_thiet', quantity: 10 },
            { id: 'yeu_thu_tinh_huyet', quantity: 2 }
        ],
        baseSuccessRate: 0.8,
        staminaCost: 30,
        manaCost: 20,
        expGain: 200,
        type: 'bag_upgrade',
        extraSlots: 5,
        icon: '🎒'
    },
    'luyen_che_can_khon_tui': {
        id: 'luyen_che_can_khon_tui',
        name: 'Luyện Chế Càn Khôn Túi',
        level: 3,
        materials: [
            { id: 'tinh_kim', quantity: 5 },
            { id: 'thuy_tinh_linh_khoang', quantity: 10 }
        ],
        baseSuccessRate: 0.5,
        staminaCost: 80,
        manaCost: 150,
        expGain: 800,
        type: 'bag_upgrade',
        extraSlots: 10,
        icon: '🎒'
    },
    'thanh_truc_phong_van_kiem': {
        id: 'thanh_truc_phong_van_kiem',
        name: 'Thanh Trúc Phong Vân Kiếm',
        level: 4,
        materials: [
            { id: 'kim_loi_truc', quantity: 1 }
        ],
        baseSuccessRate: 0.35,
        staminaCost: 150,
        manaCost: 300,
        expGain: 2500
    }
};

export const getSmithingLevelInfo = (level) => {
    const values = Object.values(SMITHING_LEVELS);
    const lvlKey = Math.min(Math.max(0, level), values.length - 1);
    const lvlInfo = values[lvlKey];
    return {
        name: lvlInfo ? lvlInfo.name : `Cấp ${level} Luyện Khí Sư`,
        bonusRate: lvlInfo ? lvlInfo.bonusRate : 0
    };
};
