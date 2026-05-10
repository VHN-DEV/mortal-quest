/**
 * DỮ LIỆU THẬP VẠN ĐẠI SƠN (100,000 GREAT MOUNTAINS)
 */

export const MOUNTAIN_LAYERS = [
    {
        id: 'ngoai_vi',
        name: 'Ngoại Vi Đại Sơn',
        minRealm: 1,
        difficulty: 1.0,
        survivalFactor: 0.1, // Multiplier for resource consumption
        description: 'Vùng ngoài cùng, nơi tập trung nhiều thảo dược bậc thấp và yêu thú sơ khai.'
    },
    {
        id: 'trung_tang',
        name: 'Trung Tầng Đại Sơn',
        minRealm: 20,
        difficulty: 2.5,
        survivalFactor: 0.4,
        description: 'Vùng sâu hơn, yêu thú bắt đầu hóa hình, đầy rẫy các động phủ cổ đại.'
    },
    {
        id: 'noi_vuc',
        name: 'Nội Vực Đại Sơn',
        minRealm: 50,
        difficulty: 5.0,
        survivalFactor: 1.0,
        description: 'Vùng cấm địa, nơi chôn giấu long mạch và các hung thú viễn cổ.'
    }
];

export const MOUNTAIN_BEASTS = [
    {
        id: 'y_lang',
        name: 'Thanh Phong Yêu Lang',
        layer: 'ngoai_vi',
        level: 5,
        icon: '🐺',
        description: 'Tốc độ cực nhanh, thường đi theo đàn.'
    },
    {
        id: 'hac_viem_ho',
        name: 'Hắc Viêm Hổ',
        layer: 'trung_tang',
        level: 35,
        icon: '🐅',
        description: 'Hổ lửa đen, có khả năng phun ra ma diễm.'
    },
    {
        id: 'thien_loi_giao',
        name: 'Thiên Lôi Giao',
        layer: 'noi_vuc',
        level: 80,
        icon: '🐉',
        description: 'Sắp hóa rồng, khống chế lôi điện chi lực.'
    }
];

export const MOUNTAIN_EVENTS = [
    {
        id: 'bi_canh_mo',
        name: 'Bí Cảnh Thượng Cổ Mở Ra',
        type: 'treasure',
        layer: 'any',
        chance: 0.05
    },
    {
        id: 'suong_doc',
        name: 'Sương Độc Bao Phủ',
        type: 'hazard',
        layer: 'trung_tang',
        chance: 0.1
    },
    {
        id: 'huyet_nguyet',
        name: 'Huyết Nguyệt Giáng Lâm',
        type: 'weather',
        layer: 'noi_vuc',
        chance: 0.02
    }
];
