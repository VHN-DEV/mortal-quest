/**
 * DỮ LIỆU LINH ĐIỀN & TRỒNG TRỌT (SPIRITUAL FIELD & CULTIVATION)
 */

export const FIELD_GRADES = {
    'PHAM': { id: 'PHAM', name: 'Phàm Điền', speedMult: 1.0, qualityBonus: 0, cost: 0 },
    'LINH': { id: 'LINH', name: 'Linh Điền', speedMult: 1.5, qualityBonus: 0.1, cost: 1000 },
    'HUYEN': { id: 'HUYEN', name: 'Huyền Điền', speedMult: 2.5, qualityBonus: 0.2, cost: 5000 },
    'DIA': { id: 'DIA', name: 'Địa Điền', speedMult: 5.0, qualityBonus: 0.4, cost: 20000 },
    'THIEN': { id: 'THIEN', name: 'Thiên Điền', speedMult: 10.0, qualityBonus: 0.7, cost: 100000 },
    'TIEN': { id: 'TIEN', name: 'Tiên Điền', speedMult: 25.0, qualityBonus: 1.5, cost: 1000000 }
};

export const FIELD_ATTRIBUTES = {
    'NORMAL': { id: 'NORMAL', name: 'Thường', icon: '🌱', color: '#a8a29e' },
    'HOA': { id: 'HOA', name: 'Hỏa', icon: '🔥', color: '#ef4444' },
    'BANG': { id: 'BANG', name: 'Hàn Băng', icon: '❄️', color: '#3b82f6' },
    'LOI': { id: 'LOI', name: 'Lôi', icon: '⚡', color: '#eab308' },
    'MOC': { id: 'MOC', name: 'Mộc', icon: '🌳', color: '#22c55e' },
    'AM_MINH': { id: 'AM_MINH', name: 'Âm Minh', icon: '💀', color: '#7e22ce' }
};

export const HERB_AGE_MILESTONES = [
    { years: 10, name: '10 năm', bonus: 1.0 },
    { years: 100, name: '100 năm', bonus: 2.5 },
    { years: 500, name: '500 năm', bonus: 6.0 },
    { years: 1000, name: '1000 năm', bonus: 15.0 },
    { years: 10000, name: 'Vạn năm', bonus: 50.0 },
    { years: 100000, name: 'Thập Vạn năm', bonus: 200.0 }
];

export const SEEDS = [
    {
        id: 'hat_giong_thanh_phuc_thao',
        name: 'Linh Chủng Thanh Phục Thảo',
        herbId: 'linh_thao_thap',
        grade: 'PHAM',
        baseGrowthTime: 300, // 5 min for 10-year stage
        attributeReq: 'NORMAL',
        description: 'Linh thảo sơ cấp Thanh Phục Thảo, cực kỳ dễ trồng.'
    },
    {
        id: 'hat_giong_linh_thao_trung',
        name: 'Linh Chủng Tử Lam Hoa',
        herbId: 'linh_thao_trung',
        grade: 'LINH',
        baseGrowthTime: 900, // 15 min
        attributeReq: 'NORMAL',
        description: 'Linh hoa trung cấp Tử Lam Hoa màu tím nhạt, phát triển ổn định.'
    },
    {
        id: 'hat_giong_ngoc_de_hoa',
        name: 'Linh Chủng Ngọc Đề Hoa',
        herbId: 'ngoc_de_hoa',
        grade: 'PHAM',
        baseGrowthTime: 450, // 7.5 min
        attributeReq: 'NORMAL',
        description: 'Ngọc Đề Hoa có tính ôn hòa, dễ trồng nơi phàm điền.'
    },
    {
        id: 'hat_giong_thanh_long_sam',
        name: 'Linh Chủng Thanh Long Sâm',
        herbId: 'thanh_long_sam',
        grade: 'LINH',
        baseGrowthTime: 1500, // 25 min
        attributeReq: 'MOC',
        description: 'Thanh Long Sâm đòi hỏi mộc thuộc tính linh khí tràn trề.'
    },
    {
        id: 'hat_giong_hoa_diem_thao',
        name: 'Linh Chủng Hỏa Diễm Thảo',
        herbId: 'hoa_diem_thao',
        grade: 'LINH',
        baseGrowthTime: 1200, // 20 min
        attributeReq: 'HOA',
        description: 'Linh thảo thuộc tính hỏa, cần linh điền rực cháy.'
    },
    {
        id: 'hat_giong_hoa_duong_chi',
        name: 'Linh Chủng Hỏa Dương Chi',
        herbId: 'hoa_duong_chi',
        grade: 'LINH',
        baseGrowthTime: 1800, // 30 min
        attributeReq: 'HOA',
        description: 'Nấm hỏa thuộc tính cực mạnh, cần linh điền hỏa thuộc tính cao nhiệt.'
    },
    {
        id: 'hat_giong_han_tuy_hoa',
        name: 'Linh Chủng Hàn Tủy Hoa',
        herbId: 'han_tuy_hoa',
        grade: 'LINH',
        baseGrowthTime: 1200,
        attributeReq: 'BANG',
        description: 'Linh hoa sinh trưởng nơi cực hàn.'
    },
    {
        id: 'hat_giong_tuyet_oanh_thao',
        name: 'Linh Chủng Tuyết Oánh Thảo',
        herbId: 'tuyet_oanh_thao',
        grade: 'LINH',
        baseGrowthTime: 1600, // 26.6 min
        attributeReq: 'BANG',
        description: 'Linh thảo tuyết trắng tinh khiết, sinh trưởng ở nơi giá buốt cực độ.'
    },
    {
        id: 'hat_giong_u_minh_hoa',
        name: 'Linh Chủng U Minh Hoa',
        herbId: 'u_minh_hoa',
        grade: 'HUYEN',
        baseGrowthTime: 3600, // 1h
        attributeReq: 'AM_MINH',
        description: 'Hấp thụ tử khí để sinh trưởng.'
    },
    {
        id: 'hat_giong_cuu_tich_chi',
        name: 'Linh Chủng Cửu Tịch Chi',
        herbId: 'cuu_tich_chi',
        grade: 'HUYEN',
        baseGrowthTime: 4200, // 70 min
        attributeReq: 'AM_MINH',
        description: 'Linh chi u tối, mút lấy u minh chi khí nơi đáy động sâu để nảy mầm.'
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
