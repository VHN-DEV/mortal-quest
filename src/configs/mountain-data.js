/**
 * DỮ LIỆU THẬP VẠN ĐẠI SƠN (100,000 GREAT MOUNTAINS)
 */

export const MOUNTAIN_LAYERS = [
    {
        id: 'chan_nui',
        name: 'Chân Núi (Ngoại Vi)',
        minRealm: 1,
        difficulty: 1.0,
        survivalFactor: 0.1,
        description: 'Vùng ngoài cùng, linh khí loãng, nơi tập trung nhiều thảo dược bậc thấp và yêu thú sơ khai.'
    },
    {
        id: 'suong_mu',
        name: 'Sương Mù Lâm (Trung Tầng 1)',
        minRealm: 10,
        difficulty: 1.5,
        survivalFactor: 0.2,
        description: 'Rừng sương mù dày đặc, linh giác bị hạn chế, ẩn chứa nhiều loại linh quả sơ cấp.'
    },
    {
        id: 'thuy_dong',
        name: 'U Thủy Động (Trung Tầng 2)',
        minRealm: 20,
        difficulty: 2.2,
        survivalFactor: 0.35,
        description: 'Hệ thống hang động ẩm ướt, nơi cư ngụ của các loài yêu trùng và khoáng thạch hiếm.'
    },
    {
        id: 'loi_phong',
        name: 'Lôi Phong Đỉnh (Nội Vực 1)',
        minRealm: 35,
        difficulty: 3.5,
        survivalFactor: 0.5,
        description: 'Đỉnh núi quanh năm sấm chớp và gió lốc, linh khí bắt đầu trở nên cuồng bạo.'
    },
    {
        id: 'huyet_nguyet',
        name: 'Huyết Nguyệt Cốc (Nội Vực 2)',
        minRealm: 50,
        difficulty: 5.0,
        survivalFactor: 0.75,
        description: 'Thung lũng bị nguyền rủa, nơi chôn cất các tu sĩ thượng cổ, linh khí mang theo sát ý.'
    },
    {
        id: 'long_mach',
        name: 'Long Mạch Uyên (Thâm Vực)',
        minRealm: 70,
        difficulty: 7.5,
        survivalFactor: 1.2,
        description: 'Vực sâu vạn trượng, nơi tụ hội của long mạch chi lực, đầy rẫy các cấm chế cổ đại.'
    },
    {
        id: 'thanh_son',
        name: 'Thánh Sơn (Cấm Địa)',
        minRealm: 90,
        difficulty: 10.0,
        survivalFactor: 2.0,
        description: 'Nơi tối cao của Đại Sơn, chỉ những bậc đại năng mới có thể đặt chân đến.'
    }
];

export const MOUNTAIN_BEASTS = [
    {
        id: 'y_lang',
        name: 'Thanh Phong Yêu Lang',
        layer: 'chan_nui',
        level: 5,
        icon: '🐺',
        description: 'Tốc độ cực nhanh, thường đi theo đàn.'
    },
    {
        id: 'doc_xa',
        name: 'Cự Độc Xà',
        layer: 'suong_mu',
        level: 15,
        icon: '🐍',
        description: 'Nọc độc có thể khiến tu sĩ tê liệt trong chớp mắt.'
    },
    {
        id: 'u_minh_nhen',
        name: 'U Minh Nhện',
        layer: 'thuy_dong',
        level: 30,
        icon: '🕷️',
        description: 'Phát ra tơ nhện mang theo âm khí, cực kỳ khó chịu.'
    },
    {
        id: 'loi_thu',
        name: 'Lôi Bạo Thú',
        layer: 'loi_phong',
        level: 45,
        icon: '🐗',
        description: 'Hấp thụ lôi điện để cường hóa cơ thể.'
    },
    {
        id: 'huyet_nghiet',
        name: 'Huyết Nghiệt Oán Linh',
        layer: 'huyet_nguyet',
        level: 60,
        icon: '👻',
        description: 'Oán khí ngưng kết thành hình, chuyên tấn công thần hồn.'
    },
    {
        id: 'long_ve',
        name: 'Long Mạch Thủ Vệ',
        layer: 'long_mach',
        level: 80,
        icon: '🗿',
        description: 'Khối thạch linh được long mạch nuôi dưỡng, phòng ngự tuyệt đối.'
    },
    {
        id: 'thanh_hac',
        name: 'Thần Sơn Thanh Hạc',
        layer: 'thanh_son',
        level: 100,
        icon: '🦢',
        description: 'Linh vật canh giữ Thánh Sơn, mang theo uy áp thượng cổ.'
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
        layer: 'suong_mu',
        chance: 0.12
    },
    {
        id: 'loi_kiep',
        name: 'Thiên Lôi Giáng Lâm',
        type: 'hazard',
        layer: 'loi_phong',
        chance: 0.15
    },
    {
        id: 'huyet_nguyet',
        name: 'Huyết Nguyệt Giáng Lâm',
        type: 'weather',
        layer: 'huyet_nguyet',
        chance: 0.08
    }
];
