/**
 * DỮ LIỆU DƯỢC ĐIỀN (HERBAL GARDEN)
 */

export const SEEDS = [
    {
        id: 'seed_linh_thao',
        name: 'Hạt Giống Linh Thảo',
        resultId: 'linh_thao_thap',
        growthTime: 300, // 5 minutes base
        exp: 10
    },
    {
        id: 'seed_linh_thao_trung',
        name: 'Hạt Giống Linh Thảo Trung Cấp',
        resultId: 'linh_thao_trung',
        growthTime: 1200, // 20 minutes
        exp: 50
    }
];

export const SOILS = {
    'linh_tho_pham': {
        name: 'Linh Thổ Phổ Thông',
        speedMult: 1.0,
        qualityBonus: 0
    },
    'ngu_sac_tho': {
        name: 'Ngũ Sắc Linh Thổ',
        speedMult: 2.0,
        qualityBonus: 0.2
    }
};
