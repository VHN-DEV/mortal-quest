export const BEAST_TYPES = {
    LINH_TRUNG: 'Linh Trùng',
    KY_TRUNG: 'Kỳ Trùng',
    LINH_THU: 'Linh Thú',
    DI_THU: 'Dị Thú',
    THAN_THU: 'Thần Thú'
};

export const BLOODLINES = {
    PHAM: { name: 'Phàm Huyết', color: '#9ca3af', multiplier: 1.0 },
    LINH: { name: 'Linh Cấp', color: '#4fd1c5', multiplier: 1.5 },
    DIA: { name: 'Địa Cấp', color: '#a855f7', multiplier: 2.5 },
    THIEN: { name: 'Thiên Cấp', color: '#f59e0b', multiplier: 5.0 },
    THANH: { name: 'Thánh Huyết', color: '#ec4899', multiplier: 10.0 },
    TIEN: { name: 'Tiên Huyết', color: '#3b82f6', multiplier: 25.0 },
    THAN: { name: 'Thần Huyết', color: '#facc15', multiplier: 100.0 }
};

export const BEASTS = {
    'phe_linh_trung': {
        id: 'phe_linh_trung',
        name: 'Phệ Linh Trùng',
        type: BEAST_TYPES.LINH_TRUNG,
        bloodline: 'LINH',
        icon: '🦗',
        description: 'Loại linh trùng nhỏ bé có khả năng cắn nuốt linh lực.',
        baseStats: { hp: 50, atk: 5, def: 2, spd: 15 },
        abilities: ['Thôn Linh']
    },
    'kim_tam': {
        id: 'kim_tam',
        name: 'Kim Tàm',
        type: BEAST_TYPES.LINH_TRUNG,
        bloodline: 'DIA',
        icon: '🐛',
        description: 'Tằm vàng quý hiếm, tơ của nó là vật liệu luyện khí cực tốt.',
        baseStats: { hp: 120, atk: 10, def: 20, spd: 5 },
        abilities: ['Kim Ti']
    },
    'thanh_van_hac': {
        id: 'thanh_van_hac',
        name: 'Thanh Vân Hạc',
        type: BEAST_TYPES.LINH_THU,
        bloodline: 'LINH',
        icon: '🦢',
        description: 'Linh hạc cưỡi mây, thường được các tu sĩ dùng làm tọa kỵ.',
        baseStats: { hp: 200, atk: 15, def: 10, spd: 40 },
        abilities: ['Ngự Phong']
    },
    'xich_diem_lang': {
        id: 'xich_diem_lang',
        name: 'Xích Diễm Lang',
        type: BEAST_TYPES.LINH_THU,
        bloodline: 'LINH',
        icon: '🐺',
        description: 'Sói lửa vùng hỏa núi, tính tình hung dữ.',
        baseStats: { hp: 350, atk: 45, def: 15, spd: 30 },
        abilities: ['Hỏa Trảo']
    },
    'loi_duc_su': {
        id: 'loi_duc_su',
        name: 'Lôi Dực Sư',
        type: BEAST_TYPES.DI_THU,
        bloodline: 'THIEN',
        icon: '🦁',
        description: 'Sư tử có cánh mang theo sức mạnh của sấm sét.',
        baseStats: { hp: 1500, atk: 250, def: 100, spd: 80 },
        abilities: ['Thiên Lôi Hống']
    },
    'cuu_vi_thien_ho': {
        id: 'cuu_vi_thien_ho',
        name: 'Cửu Vĩ Thiên Hồ',
        type: BEAST_TYPES.THAN_THU,
        bloodline: 'THANH',
        icon: '🦊',
        description: 'Hồ ly chín đuôi trong truyền thuyết, có khả năng mê hoặc chúng sinh.',
        baseStats: { hp: 5000, atk: 800, def: 300, spd: 120 },
        abilities: ['Mê Hồn Huyễn Cảnh']
    },
    'thanh_long': {
        id: 'thanh_long',
        name: 'Thanh Long',
        type: BEAST_TYPES.THAN_THU,
        bloodline: 'THAN',
        icon: '🐉',
        description: 'Thần thú trấn giữ phương Đông, đứng đầu tứ linh.',
        baseStats: { hp: 20000, atk: 2500, def: 1500, spd: 200 },
        abilities: ['Long Uy Trấn Áp', 'Thiên Phạt']
    }
};

export const getBeastLevelInfo = (level) => {
    return {
        name: level < 10 ? 'Ấu Thể' : level < 30 ? 'Trưởng Thành' : level < 60 ? 'Biến Dị' : 'Thần Hình',
        expRequired: Math.floor(100 * Math.pow(1.2, level - 1))
    };
};
