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
        icon: '🐞',
        image: 'beasts/phe_linh_trung.webp',
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
        image: 'beasts/kim_tam.webp',
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
        image: 'beasts/thanh_van_hac.webp',
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
        image: 'beasts/xich_diem_lang.webp',
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
        image: 'beasts/loi_duc_su.webp',
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
        image: 'beasts/cuu_vi_thien_ho.webp',
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
        image: 'beasts/thanh_long.webp',
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
        image: 'beasts/bang_tam.webp',
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
        image: 'beasts/thanh_van_ly.webp',
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
    },
    'giao_long': {
        id: 'giao_long',
        name: 'Giao Long',
        type: BEAST_TYPES.DI_THU,
        bloodline: 'THIEN',
        icon: '🐲',
        image: 'beasts/giao_long.webp',
        description: 'Giao Long thượng cổ, mang huyết mạch chân long, có khả năng hô phong hoán vũ, khi nộ có thể dấy sóng lật trời.',
        baseStats: { hp: 2000, atk: 300, def: 200, spd: 100 },
        abilities: ['Long Quyển Phong Ba', 'Thủy Trào Thiên Phạt']
    },
    'hac_xa': {
        id: 'hac_xa',
        name: 'Hắc Xà',
        type: BEAST_TYPES.LINH_THU,
        bloodline: 'DIA',
        icon: '🐍',
        image: 'beasts/hac_xa.webp',
        description: 'Hắc Xà vạn năm, toàn thân phủ vảy đen bóng, kịch độc vô song, một khi cắn trúng thì thần tiên cũng khó cứu.',
        baseStats: { hp: 800, atk: 180, def: 80, spd: 90 },
        abilities: ['Kịch Độc Nha', 'Hắc Vụ Triền Thân']
    },
    'hoa_viem': {
        id: 'hoa_viem',
        name: 'Hỏa Viêm Thú',
        type: BEAST_TYPES.LINH_THU,
        bloodline: 'DIA',
        icon: '🔥',
        image: 'beasts/hoa_viem.webp',
        description: 'Linh thú hỏa hệ mạnh mẽ, lông mao đỏ rực như ngọn lửa, có thể phun ra hỏa diễm thiêu đốt vạn vật.',
        baseStats: { hp: 600, atk: 200, def: 50, spd: 70 },
        abilities: ['Liệt Diễm Phún Xạ', 'Hỏa Viêm Hộ Thể']
    },
    'kim_giap_hac': {
        id: 'kim_giap_hac',
        name: 'Kim Giáp Hạc',
        type: BEAST_TYPES.LINH_THU,
        bloodline: 'DIA',
        icon: '🦢',
        image: 'aberrations/kim-giap-hac.svg',
        description: 'Linh hạc có lớp lông cứng như kim loại, tốc độ bay cực nhanh và rất trung thành với chủ nhân.',
        baseStats: { hp: 500, atk: 60, def: 100, spd: 120 },
        abilities: ['Kim Dực Trảm', 'Thiên Phong Ngự']
    },
    'huyen_diem_nga': {
        id: 'huyen_diem_nga',
        name: 'Huyền Diệm Nga',
        type: BEAST_TYPES.KY_TRUNG,
        bloodline: 'LINH',
        icon: '🦋',
        image: 'aberrations/huyen-diem-nga.svg',
        description: 'Bướm đêm mang hỏa tính, cánh phủ lân phấn huyền ảo, có khả năng phun ra hỏa độc gây ảo giác.',
        baseStats: { hp: 350, atk: 100, def: 30, spd: 85 },
        abilities: ['Hỏa Độc Lân Phấn', 'Huyền Diệm Vũ']
    },
    'loi_bang': {
        id: 'loi_bang',
        name: 'Lôi Bằng',
        type: BEAST_TYPES.DI_THU,
        bloodline: 'THIEN',
        icon: '🦅',
        image: 'beasts/loi_bang.webp',
        description: 'Chim khổng lồ mang sức mạnh lôi đình, sải cánh che kín cả bầu trời, khi trưởng thành có thể bay vạn dặm.',
        baseStats: { hp: 3000, atk: 400, def: 150, spd: 180 },
        abilities: ['Lôi Đình Vạn Kích', 'Cuồng Phong Dực']
    },
    'thien_phong_ngan_uynh': {
        id: 'thien_phong_ngan_uynh',
        name: 'Thiên Phong Ngân Uynh',
        type: BEAST_TYPES.KY_TRUNG,
        bloodline: 'THANH',
        icon: '🐞',
        image: 'beasts/thien_phong_ngan_uynh.webp',
        description: 'Kỳ trùng quý hiếm bậc nhất, có khả năng xuyên thấu không gian và né tránh mọi công kích vật lý.',
        baseStats: { hp: 1000, atk: 500, def: 50, spd: 250 },
        abilities: ['Không Gian Xuyên Thấu', 'Ngân Quang Trảm']
    },
    'ac_long': {
        id: 'ac_long',
        name: 'Ác Long',
        type: BEAST_TYPES.DI_THU,
        bloodline: 'THIEN',
        icon: '🐉',
        image: 'beasts/ac_long.webp',
        description: 'Loài rồng hung ác, mang sức mạnh tà ác cổ xưa.',
        baseStats: { hp: 2500, atk: 350, def: 180, spd: 110 },
        abilities: ['Tà Long Nộ', 'Hắc Hỏa Phún Xạ']
    },
    'bang_hung': {
        id: 'bang_hung',
        name: 'Băng Hùng',
        type: BEAST_TYPES.LINH_THU,
        bloodline: 'DIA',
        icon: '🐻',
        image: 'beasts/bang_hung.webp',
        description: 'Gấu băng khổng lồ sống ở cực bắc, lực phòng ngự kinh nhân.',
        baseStats: { hp: 1800, atk: 120, def: 250, spd: 40 },
        abilities: ['Băng Thuẫn', 'Hàn Băng Chưởng']
    },
    'chu_tuoc': {
        id: 'chu_tuoc',
        name: 'Chu Tước',
        type: BEAST_TYPES.THAN_THU,
        bloodline: 'THAN',
        icon: '🦚',
        image: 'beasts/chu_tuoc.webp',
        description: 'Thần thú trấn giữ phương Nam, cai quản Nam Minh Ly Hỏa.',
        baseStats: { hp: 15000, atk: 3000, def: 1200, spd: 250 },
        abilities: ['Nam Minh Ly Hỏa', 'Phượng Hoàng Niết Bàn']
    },
    'con_bang': {
        id: 'con_bang',
        name: 'Côn Bằng',
        type: BEAST_TYPES.THAN_THU,
        bloodline: 'THAN',
        icon: '🐋',
        image: 'beasts/con_bang.webp',
        description: 'Dưới nước là Côn, trên trời là Bằng, kích thước bao trùm vạn dặm.',
        baseStats: { hp: 30000, atk: 2000, def: 2500, spd: 300 },
        abilities: ['Thôn Phệ Vạn Vật', 'Không Gian Cự Sí']
    },
    'cuu_dau': {
        id: 'cuu_dau',
        name: 'Cửu Đầu Xà',
        type: BEAST_TYPES.DI_THU,
        bloodline: 'THIEN',
        icon: '🐍',
        image: 'beasts/cuu_dau.webp',
        description: 'Rắn chín đầu độc ác thượng cổ, cực kì nguy hiểm.',
        baseStats: { hp: 2800, atk: 400, def: 200, spd: 90 },
        abilities: ['Cửu Độc Phún Xạ', 'Hồi Sinh Yêu Nhai']
    },
    'hoa_long': {
        id: 'hoa_long',
        name: 'Hỏa Long',
        type: BEAST_TYPES.DI_THU,
        bloodline: 'THIEN',
        icon: '🐉',
        image: 'beasts/hoa_long.webp',
        description: 'Rồng phun lửa, mang sức mạnh hỏa hệ hủy diệt.',
        baseStats: { hp: 2200, atk: 320, def: 190, spd: 130 },
        abilities: ['Liệt Hỏa Phần Thiên', 'Hỏa Long Gầm']
    },
    'linh_huu': {
        id: 'linh_huu',
        name: 'Linh Hươu',
        type: BEAST_TYPES.LINH_THU,
        bloodline: 'LINH',
        icon: '🦌',
        image: 'beasts/linh_huu.webp',
        description: 'Hươu sao linh tính, khả năng trị liệu tuyệt vời.',
        baseStats: { hp: 600, atk: 30, def: 60, spd: 80 },
        abilities: ['Sinh Mệnh Khôi Phục', 'Linh Cước Nhanh Nhẹn']
    },
    'ngoc_long': {
        id: 'ngoc_long',
        name: 'Ngọc Long',
        type: BEAST_TYPES.THAN_THU,
        bloodline: 'TIEN',
        icon: '🐉',
        image: 'beasts/ngoc_long.webp',
        description: 'Rồng ngọc bích quý hiếm, toát ra hàn khí tĩnh tâm tu luyện.',
        baseStats: { hp: 8000, atk: 1200, def: 1000, spd: 150 },
        abilities: ['Ngọc Cốt Băng Cơ', 'Thanh Linh Khí']
    },
    'phuong_hoang': {
        id: 'phuong_hoang',
        name: 'Phượng Hoàng',
        type: BEAST_TYPES.THAN_THU,
        bloodline: 'TIEN',
        icon: '🦚',
        image: 'beasts/phuong_hoang.webp',
        description: 'Bách điểu chi vương, mang trong mình niết bàn chi hỏa.',
        baseStats: { hp: 9000, atk: 1500, def: 800, spd: 220 },
        abilities: ['Hỏa Vũ Cửu Thiên', 'Niết Bàn Trọng Sinh']
    },
    'thanh_nguu': {
        id: 'thanh_nguu',
        name: 'Thanh Ngưu',
        type: BEAST_TYPES.LINH_THU,
        bloodline: 'DIA',
        icon: '🐂',
        image: 'beasts/thanh_nguu.webp',
        description: 'Trâu xanh mang thần lực, sức mạnh dời non lấp biển.',
        baseStats: { hp: 2000, atk: 180, def: 300, spd: 25 },
        abilities: ['Man Ngưu Trùng Kích', 'Kiên Cố Hộ Thể']
    },
    'thanh_van_ly_thu': {
        id: 'thanh_van_ly_thu',
        name: 'Thanh Vân Ly Thú (Dị)',
        type: BEAST_TYPES.DI_THU,
        bloodline: 'THIEN',
        icon: '🦊',
        image: 'beasts/thanh-van-ly-thu.webp',
        description: 'Biến dị của Thanh Vân Ly, với bộ lông chuyển màu theo thời tiết và sức mạnh phi phàm.',
        baseStats: { hp: 1200, atk: 250, def: 100, spd: 160 },
        abilities: ['Huyễn Ảnh Vân Độn', 'Thiên Lôi Cảo']
    },
    'that_thai_thien_long': {
        id: 'that_thai_thien_long',
        name: 'Thất Thái Thiên Long',
        type: BEAST_TYPES.THAN_THU,
        bloodline: 'TIEN',
        icon: '🐉',
        image: 'beasts/that_thai_thien_long.webp',
        description: 'Thiên long mang sức mạnh bảy nguyên tố, thần thông quảng đại vô song.',
        baseStats: { hp: 12000, atk: 1800, def: 1400, spd: 190 },
        abilities: ['Thất Cực Thần Quang', 'Đại Đạo Cộng Minh']
    },
    'tu_tuoc': {
        id: 'tu_tuoc',
        name: 'Tử Tước',
        type: BEAST_TYPES.LINH_THU,
        bloodline: 'DIA',
        icon: '🦅',
        image: 'beasts/tu_tuoc.webp',
        description: 'Chim chóc tím lịm, tiếng hót có thể gây mê muội tâm trí.',
        baseStats: { hp: 700, atk: 140, def: 60, spd: 150 },
        abilities: ['Ma Âm Xuyên Não', 'Tử Vũ Phi Tiêu']
    },
    'tu_van_hac': {
        id: 'tu_van_hac',
        name: 'Tử Vân Hạc',
        type: BEAST_TYPES.LINH_THU,
        bloodline: 'DIA',
        icon: '🦢',
        image: 'beasts/tu_van_hac.webp',
        description: 'Hạc bay trong mây tím, tốc độ phi hành cực nhanh và mang theo kịch độc sương mù.',
        baseStats: { hp: 900, atk: 160, def: 80, spd: 180 },
        abilities: ['Tử Vân Vụ Khí', 'Cực Tốc Phi Kích']
    }
};

export const getBeastLevelInfo = (level) => {
    const names = ["Ấu Thể", "Nhất Giai", "Nhị Giai", "Tam Giai", "Tứ Giai", "Ngũ Giai", "Lục Giai", "Thất Giai", "Bát Giai", "Cửu Giai", "Tiên Giai", "Thần Giai"];
    return {
        name: names[Math.min(Math.floor(level / 10), names.length - 1)] || `Cấp ${level}`,
        expRequired: Math.floor(100 * Math.pow(1.5, level - 1))
    };
};
