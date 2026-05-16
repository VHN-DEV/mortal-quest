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
    },
    'phe_kim_trung': {
        id: 'phe_kim_trung',
        name: 'Phệ Kim Trùng',
        type: BEAST_TYPES.KY_TRUNG,
        bloodline: 'THIEN',
        image: 'aberrations/phe-kim-trung.svg',
        description: 'Loài kỳ trùng hung hãn nhất thượng cổ, có khả năng cắn nuốt cả pháp bảo.',
        baseStats: { hp: 500, atk: 150, def: 200, spd: 60 },
        abilities: ['Cắn Nuốt', 'Kim Giáp Hộ Thể'],
        evolutions: [
            { levelRequired: 50, toId: 'phe_kim_trung_vuong', newName: 'Phệ Kim Trùng Vương', statMult: 2.5, materials: [{ id: 'tinh_kim', quantity: 100 }] }
        ]
    },
    'bang_tam': {
        id: 'bang_tam',
        name: 'Băng Tàm',
        type: BEAST_TYPES.KY_TRUNG,
        bloodline: 'DIA',
        image: 'aberrations/bang-tam.svg',
        description: 'Tằm băng nghìn năm, nhả ra băng ti có thể đóng băng linh lực.',
        baseStats: { hp: 800, atk: 80, def: 150, spd: 30 },
        abilities: ['Băng Ti Phun Trào', 'Hàn Khí Chướng'],
    },
    'huyet_ngoc_tri_chu': {
        id: 'huyet_ngoc_tri_chu',
        name: 'Huyết Ngọc Tri Chu',
        type: BEAST_TYPES.KY_TRUNG,
        bloodline: 'LINH',
        image: 'aberrations/huyet-ngoc-tri-chu.svg',
        description: 'Nhện ngọc máu, chuyên sống trong các cổ mộ, tơ nhện cực kỳ dẻo dai và có độc.',
        baseStats: { hp: 600, atk: 120, def: 100, spd: 80 },
        abilities: ['Huyết Ma Võng', 'Kịch Độc'],
    },
    'thanh_van_ly': {
        id: 'thanh_van_ly',
        name: 'Thanh Vân Ly Thú',
        type: BEAST_TYPES.LINH_THU,
        bloodline: 'LINH',
        image: 'beasts/thanh-van-ly-thu.webp',
        description: 'Linh thú mang hơi thở của mây trời, tốc độ cực nhanh và linh hoạt.',
        baseStats: { hp: 400, atk: 55, def: 25, spd: 60 },
        abilities: ['Vân Độn', 'Ly Trảo'],
    },
    'huyen_giap_dia_long': {
        id: 'huyen_giap_dia_long',
        name: 'Huyền Giáp Địa Long',
        type: BEAST_TYPES.DI_THU,
        bloodline: 'DIA',
        image: 'beasts/huyen-giap-dia-long.webp',
        description: 'Loài rồng đất có lớp vảy cứng như sắt đen, phòng ngự cực kỳ kiên cố.',
        baseStats: { hp: 1200, atk: 80, def: 150, spd: 20 },
        abilities: ['Huyền Giáp Hộ Thể', 'Địa Chấn'],
    },
    'u_minh_mong_diep': {
        id: 'u_minh_mong_diep',
        name: 'U Minh Mộng Điệp',
        type: BEAST_TYPES.LINH_THU,
        bloodline: 'LINH',
        image: 'beasts/u-minh-mong-diep.webp',
        description: 'Bướm mộng đến từ u minh, có khả năng gây ra ảo giác cho kẻ địch.',
        baseStats: { hp: 300, atk: 40, def: 15, spd: 70 },
        abilities: ['Mộng Cảnh', 'U Minh Phấn'],
    }
};

export const getBeastLevelInfo = (level) => {
    const names = ["Ấu Thể", "Nhất Giai", "Nhị Giai", "Tam Giai", "Tứ Giai", "Ngũ Giai", "Lục Giai", "Thất Giai", "Bát Giai", "Cửu Giai", "Tiên Giai", "Thần Giai"];
    return {
        name: names[Math.min(Math.floor(level / 10), names.length - 1)] || `Cấp ${level}`,
        expRequired: Math.floor(100 * Math.pow(1.5, level - 1))
    };
};
