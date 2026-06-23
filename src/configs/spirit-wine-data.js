/**
 * LINH TỬU SƯ DATA
 * 
 * Linh Tửu không phải rượu thường. Đây là quá trình chiết xuất → chuyển hóa → bảo tồn
 * linh khí của thiên tài địa bảo bằng phương pháp lên men hoặc ủ luyện.
 *
 * Phân loại:
 * - Linh Tửu:  Buff ngắn hạn (< 30 phút)
 * - Đạo Tửu:  Buff dài hạn (giờ / ngày)
 * - Tiên Tửu: Hiệu quả vĩnh viễn hoặc đột phá bình cảnh
 */

export const WINE_TIERS = {
    LINH_TUU: { id: 'LINH_TUU', name: 'Linh Tửu', color: '#f59e0b' },
    DAO_TUU: { id: 'DAO_TUU', name: 'Đạo Tửu', color: '#8b5cf6' },
    TIEN_TUU: { id: 'TIEN_TUU', name: 'Tiên Tửu', color: '#06b6d4' }
};

export const SPIRIT_WINE_RECIPES = {
    // --- Linh Tửu (buff ngắn hạn) ---
    'bach_hoa_linh_tuu': {
        id: 'bach_hoa_linh_tuu',
        name: 'Bách Hoa Linh Tửu',
        tier: 'LINH_TUU',
        level: 1,
        materials: [
            { id: 'tu_lam_hoa', quantity: 3 },
            { id: 'ngoc_de_hoa', quantity: 2 }
        ],
        agingTime: 0,          // không cần ủ, chưng cất ngay
        manaCost: 20,
        staminaCost: 15,
        baseSuccessRate: 0.92,
        expGain: 20,
        description: 'Linh tửu cơ bản từ bách hoa, hồi phục 80 Pháp lực ngay lập tức.'
    },
    'hoa_duong_co_tuu': {
        id: 'hoa_duong_co_tuu',
        name: 'Hỏa Dương Cổ Tửu',
        tier: 'LINH_TUU',
        level: 3,
        materials: [
            { id: 'hoa_duong_chi', quantity: 2 },
            { id: 'hoa_diem_thao', quantity: 3 }
        ],
        agingTime: 0,
        manaCost: 40,
        staminaCost: 20,
        baseSuccessRate: 0.82,
        expGain: 45,
        description: 'Ủ từ linh thảo hỏa thuộc tính, tăng +20% Công kích trong 15 phút.'
    },
    'han_anh_tuu': {
        id: 'han_anh_tuu',
        name: 'Hàn Anh Tửu',
        tier: 'LINH_TUU',
        level: 5,
        materials: [
            { id: 'han_tuy_hoa', quantity: 3 },
            { id: 'tuyet_oanh_thao', quantity: 2 }
        ],
        agingTime: 0,
        manaCost: 60,
        staminaCost: 25,
        baseSuccessRate: 0.75,
        expGain: 80,
        description: 'Linh tửu cực hàn, tăng +25% Phòng ngự và kháng băng trong 15 phút.'
    },

    // --- Đạo Tửu (buff dài hạn) ---
    'thanh_linh_dao_tuu': {
        id: 'thanh_linh_dao_tuu',
        name: 'Thanh Linh Đạo Tửu',
        tier: 'DAO_TUU',
        level: 4,
        materials: [
            { id: 'thanh_long_sam', quantity: 2 },
            { id: 'tu_lam_hoa', quantity: 5 }
        ],
        agingTime: 600,        // 10 phút ủ sau khi chưng cất
        manaCost: 80,
        staminaCost: 30,
        baseSuccessRate: 0.70,
        expGain: 100,
        description: 'Đạo tửu ủ từ Thanh Long Sâm, tăng +5% tốc độ tu luyện trong 6 giờ.'
    },
    'ho_cot_tuu': {
        id: 'ho_cot_tuu',
        name: 'Hổ Cốt Luyện Thể Tửu',
        tier: 'DAO_TUU',
        level: 6,
        materials: [
            { id: 'yeu_dan_so_cap', quantity: 2 },
            { id: 'hoa_duong_chi', quantity: 3 }
        ],
        agingTime: 1800,       // 30 phút ủ
        manaCost: 100,
        staminaCost: 40,
        baseSuccessRate: 0.65,
        expGain: 150,
        description: 'Luyện thể đạo tửu từ yêu đan hổ cốt, tăng +15% HP tối đa trong 12 giờ.'
    },

    // --- Tiên Tửu (hiệu quả mạnh / lâu dài) ---
    'van_nien_kim_loi_tuu': {
        id: 'van_nien_kim_loi_tuu',
        name: 'Vạn Niên Kim Lôi Tửu',
        tier: 'TIEN_TUU',
        level: 7,
        materials: [
            { id: 'loi_tam_moc', quantity: 1 },
            { id: 'linh_moc_cu_loi', quantity: 1 }
        ],
        agingTime: 7200,       // 2 giờ ủ
        manaCost: 150,
        staminaCost: 50,
        baseSuccessRate: 0.55,
        expGain: 250,
        description: 'Tiên tửu cực phẩm ủ từ Lôi Tam Mộc vạn năm. Uống vào tăng vĩnh viễn +50 Tốc độ và kháng lôi 20%.'
    }
};

const SPIRIT_WINE_LEVELS = [
    { level: 1, name: 'Tửu Sư Sơ Cấp' },
    { level: 2, name: 'Tửu Sư Trung Cấp' },
    { level: 3, name: 'Tửu Sư Cao Cấp' },
    { level: 4, name: 'Tửu Đại Sư' },
    { level: 5, name: 'Tửu Tông Sư' },
    { level: 6, name: 'Tửu Thánh' },
    { level: 7, name: 'Tửu Thần' }
];

export const getSpiritWineLevelInfo = (level) => {
    return SPIRIT_WINE_LEVELS.find(l => l.level === level) || { level, name: 'Tửu Sư Vô Danh' };
};
