/**
 * DỮ LIỆU HỆ THỐNG LUYỆN ĐAN
 */

export const ALCHEMY_LEVELS = [
    { level: 1, name: "Nhất Phẩm Luyện Dược Sư", bonusRate: 0.05 },
    { level: 2, name: "Nhị Phẩm Luyện Dược Sư", bonusRate: 0.10 },
    { level: 3, name: "Tam Phẩm Luyện Dược Sư", bonusRate: 0.15 },
    { level: 4, name: "Tứ Phẩm Luyện Dược Sư", bonusRate: 0.20 },
    { level: 5, name: "Ngũ Phẩm Luyện Dược Sư", bonusRate: 0.25 },
    { level: 6, name: "Lục Phẩm Luyện Dược Sư", bonusRate: 0.30 },
    { level: 7, name: "Thất Phẩm Luyện Dược Sư", bonusRate: 0.35 },
    { level: 8, name: "Bát Phẩm Luyện Dược Sư", bonusRate: 0.40 },
    { level: 9, name: "Cửu Phẩm Luyện Dược Sư", bonusRate: 0.50 },
    { level: 10, name: "Đế Phẩm Luyện Dược Đại Tông Sư", bonusRate: 0.70 },
    { level: 11, name: "Tiên Phẩm Đan Thần", bonusRate: 1.00 }
];

export const CAULDRONS = {
    'pham_lu': {
        id: 'pham_lu',
        name: 'Phàm Cấp Đan Lư',
        quality: 'Phàm',
        successBonus: 0,
        qualityBonus: 0,
        stability: 0.5,
        heatRate: 1.0,
        outputBonus: 0,
        description: 'Lò luyện đan phổ thông của các đệ tử sơ nhập.'
    },
    'huyen_lu': {
        id: 'huyen_lu',
        name: 'Huyền Thiết Trọng Lư',
        quality: 'Huyền',
        successBonus: 0.05,
        qualityBonus: 0.1,
        stability: 0.7,
        heatRate: 1.2,
        outputBonus: 1,
        description: 'Được đúc từ huyền thiết, có độ ổn định và khả năng tụ nhiệt khá cao.'
    },
    'dia_lu': {
        id: 'dia_lu',
        name: 'Địa Long Phần Thiên Lư',
        quality: 'Địa',
        successBonus: 0.15,
        qualityBonus: 0.2,
        stability: 0.85,
        heatRate: 1.5,
        outputBonus: 2,
        description: 'Chứa đựng tinh hoa chi lực của địa long, khống hỏa cực tốt.'
    },
    'thien_lu': {
        id: 'thien_lu',
        name: 'Thiên Cực Thái Hư Lư',
        quality: 'Thiên',
        successBonus: 0.3,
        qualityBonus: 0.4,
        stability: 0.95,
        heatRate: 2.0,
        outputBonus: 5,
    }
};

export const FLAMES = {
    'linh_hoa': {
        id: 'linh_hoa',
        name: 'Linh Hỏa Cơ Bản',
        type: 'normal',
        power: 1.0,
        successBonus: 0,
        qualityBonus: 0,
        description: 'Ngọn lửa sinh ra từ linh lực của tu sĩ.'
    },
    'thanh_lien_hoa': {
        id: 'thanh_lien_hoa',
        name: 'Thanh Liên Địa Tâm Hỏa',
        type: 'di_hoa',
        power: 2.5,
        successBonus: 0.15,
        qualityBonus: 0.3,
        description: 'Sinh ra trong lòng đất, ngàn năm nở một đóa sen xanh.'
    },
    'van_lac_tam_viem': {
        id: 'van_lac_tam_viem',
        name: 'Vẫn Lạc Tâm Viêm',
        type: 'di_hoa',
        power: 3.0,
        successBonus: 0.2,
        qualityBonus: 0.4,
        description: 'Hỏa diễm tu luyện, có khả năng tôi luyện tâm thần.'
    },
    'tinh_lien_yeu_hoa': {
        id: 'tinh_lien_yeu_hoa',
        name: 'Tịnh Liên Yêu Hỏa',
        type: 'di_hoa',
        power: 5.0,
        successBonus: 0.4,
        qualityBonus: 0.7,
        description: 'Yêu hỏa thần bí, có khả năng tịnh hóa vạn vật.'
    }
};

export const ALCHEMY_TECHNIQUES = {
    'cuu_chuyen_ngung_dan': {
        id: 'cuu_chuyen_ngung_dan',
        name: 'Cửu Chuyển Ngưng Đan Thuật',
        bonus: { quality: 0.2, success: 0.1 },
        description: 'Bí pháp cổ xưa giúp ngưng tụ linh khí, tăng tỷ lệ cực phẩm.'
    },
    'thien_hoa_khong_vien': {
        id: 'thien_hoa_khong_vien',
        name: 'Thiên Hỏa Khống Viêm Quyết',
        bonus: { stability: 0.15, time: -0.2 }, // -20% time
        description: 'Bí thuật khống hỏa đỉnh cấp, giúp ổn định hỏa lực và tăng tốc luyện chế.'
    }
};

export const ALCHEMY_RECIPES = [
    {
        id: 'ngung_khi_dan',
        name: 'Ngưng Khí Đan',
        resultId: 'ngung_khi_dan',
        level: 1,
        materials: [
            { id: 'linh_thao_thap', quantity: 3 }
        ],
        baseSuccessRate: 0.8,
        time: 5,
        description: 'Dùng để tăng tốc độ tích lũy linh khí cho Luyện Khí cảnh.'
    },
    {
        id: 'than_tam_dan',
        name: 'Thanh Tâm Đan',
        resultId: 'than_tam_dan',
        level: 2,
        materials: [
            { id: 'linh_thao_10y', quantity: 2 },
            { id: 'chu_sa_muc', quantity: 1 }
        ],
        baseSuccessRate: 0.7,
        time: 15,
        description: 'Giúp bình ổn tâm thần, hồi phục 50% Khí Huyết.'
    },
    {
        id: 'truc_co_dan',
        name: 'Trúc Cơ Đan',
        resultId: 'truc_co_dan',
        level: 3,
        materials: [
            { id: 'linh_thao_100y', quantity: 1 },
            { id: 'yeu_dan_so', quantity: 1 },
            { id: 'hoa_tinh_thach', quantity: 1 }
        ],
        baseSuccessRate: 0.45,
        time: 60,
        description: 'Đan dược trọng yếu để đột phá lên Trúc Cơ Cảnh.'
    },
    {
        id: 'bo_nguyen_dan',
        name: 'Bổ Nguyên Đan',
        resultId: 'bo_nguyen_dan',
        level: 2,
        materials: [
            { id: 'linh_thao_10y', quantity: 3 },
            { id: 'yeu_huyet', quantity: 1 }
        ],
        baseSuccessRate: 0.65,
        time: 20,
        description: 'Bồi bổ nguyên khí, hồi phục Khí Huyết và Linh Lực.'
    },
    {
        id: 'ngung_anh_dan',
        name: 'Ngưng Anh Đan',
        resultId: 'ngung_anh_dan', // Need to add this to item-data later
        level: 5,
        materials: [
            { id: 'linh_thao_1000y', quantity: 1 },
            { id: 'yeu_dan_trung', quantity: 1 }, // Need to add to item-data
            { id: 'han_ngoc_tuy', quantity: 1 }
        ],
        baseSuccessRate: 0.3,
        time: 180,
        description: 'Đan dược hỗ trợ ngưng tụ Nguyên Anh, cực kỳ quý hiếm.'
    }
];

export const getRecipeById = (id) => ALCHEMY_RECIPES.find(r => r.id === id);
export const getCauldronById = (id) => CAULDRONS[id];
export const getFlameById = (id) => FLAMES[id];
export const getAlchemyLevelInfo = (level) => ALCHEMY_LEVELS.find(l => l.level === level) || ALCHEMY_LEVELS[0];
