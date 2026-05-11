/**
 * DỮ LIỆU HỆ THỐNG LUYỆN THI
 */

export const CORPSE_TYPES = {
    'thi_binh': {
        id: 'thi_binh',
        name: 'Thi Binh',
        level: 1,
        materials: [
            { id: 'yeu_huyet', quantity: 5 },
            { id: 'ma_thach', quantity: 1 }
        ],
        stats: { atk: 50, def: 100, hp: 500 },
        description: 'Xác chết được luyện chế sơ cấp, cử động chậm chạp nhưng da dày thịt béo.'
    },
    'thi_tuong': {
        id: 'thi_tuong',
        name: 'Thi Tướng',
        level: 2,
        materials: [
            { id: 'yeu_huyet', quantity: 20 },
            { id: 'ma_thach', quantity: 5 },
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
            { id: 'yeu_huyet', quantity: 50 },
            { id: 'ma_thach', quantity: 15 },
            { id: 'huyen_thiet', quantity: 10 }
        ],
        stats: { atk: 400, def: 800, hp: 4000 },
        description: 'Thân thể cứng như đồng thiếc, đao thương bất nhập.'
    }
};

export const getCorpseLevelInfo = (level) => {
    const names = ["Nhập Môn Thi Sư", "Nhất Giai Thi Sư", "Nhị Giai Thi Sư", "Tam Giai Thi Sư", "Tứ Giai Thi Sư", "Ngũ Giai Thi Sư", "Lục Giai Thi Sư", "Thất Giai Thi Sư", "Bát Giai Thi Sư", "Cửu Giai Thi Sư", "Tiên Giai Thi Sư", "Thần Giai Thi Sư"];
    return {
        name: names[Math.min(level, names.length - 1)] || `Cấp ${level} Thi Sư`
    };
};
