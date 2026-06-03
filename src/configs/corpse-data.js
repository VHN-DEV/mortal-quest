/**
 * DỮ LIỆU HỆ THỐNG LUYỆN THI
 */

import { CORPSE_LEVELS } from './game-enums.js';

export const CORPSE_TYPES = {
    'thi_binh': {
        id: 'thi_binh',
        name: 'Thi Binh',
        level: 1,
        materials: [
            { id: 'yeu_thu_tinh_huyet', quantity: 5 },
            { id: 'ma_thach_ha_pham', quantity: 1 }
        ],
        stats: { atk: 50, def: 100, hp: 500 },
        description: 'Xác chết được luyện chế sơ cấp, cử động chậm chạp nhưng da dày thịt béo.'
    },
    'thi_tuong': {
        id: 'thi_tuong',
        name: 'Thi Tướng',
        level: 2,
        materials: [
            { id: 'yeu_thu_tinh_huyet', quantity: 20 },
            { id: 'ma_thach_ha_pham', quantity: 5 },
            { id: 'huyen_thiet', quantity: 2 }
        ],
        stats: { atk: 150, def: 300, hp: 1500 },
        description: 'Thi tướng nắm giữ một chút chiến đấu bản năng, cực kỳ hung hãn.'
    },
    'dong_giap_thi': {
        id: 'dong_giap_thi',
        name: 'Đồng Giáp Thi',
        level: 3,
        materials: [
            { id: 'yeu_thu_tinh_huyet', quantity: 50 },
            { id: 'ma_thach_ha_pham', quantity: 15 },
            { id: 'huyen_thiet', quantity: 10 }
        ],
        stats: { atk: 400, def: 800, hp: 4000 },
        description: 'Thân thể cứng như đồng thiếc, đao thương bất nhập.'
    }
};

export const getCorpseLevelInfo = (level) => {
    const values = Object.values(CORPSE_LEVELS);
    const levelKey = Math.min(Math.max(0, level), values.length - 1);
    const q = values[levelKey];
    return {
        name: q ? q.name : `Cấp ${level} Thi Sư`
    };
};
