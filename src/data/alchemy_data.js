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
        description: 'Lò luyện đan phổ thông của các học đồ.'
    },
    'huyen_lu': {
        id: 'huyen_lu',
        name: 'Huyền Thiết Trọng Lư',
        quality: 'Huyền',
        successBonus: 0.05,
        qualityBonus: 0.1,
        stability: 0.7,
        description: 'Được đúc từ huyền thiết, có độ ổn định khá cao.'
    },
    'dia_lu': {
        id: 'dia_lu',
        name: 'Địa Long Phần Thiên Lư',
        quality: 'Địa',
        successBonus: 0.15,
        qualityBonus: 0.2,
        stability: 0.85,
        description: 'Chứa đựng tinh hoa chi lực của địa long.'
    },
    'thien_lu': {
        id: 'thien_lu',
        name: 'Thiên Cực Thái Hư Lư',
        quality: 'Thiên',
        successBonus: 0.3,
        qualityBonus: 0.4,
        stability: 0.95,
        description: 'Pháp bảo cấp Thiên, có khả năng tự điều hòa hỏa lực.'
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
        time: 5, // seconds
        description: 'Dùng để tăng tốc độ tích lũy linh khí cho Luyện Khí cảnh.'
    },
    {
        id: 'truc_co_dan',
        name: 'Trúc Cơ Đan',
        resultId: 'truc_co_dan',
        level: 2,
        materials: [
            { id: 'linh_thao_thap', quantity: 10 },
            { id: 'thuy_tinh', quantity: 2 }
        ],
        baseSuccessRate: 0.5,
        time: 30,
        description: 'Đan dược trọng yếu để đột phá lên Trúc Cơ Cảnh.'
    },
    {
        id: 'bo_nguyen_dan',
        name: 'Bổ Nguyên Đan',
        resultId: 'bo_nguyen_dan',
        level: 3,
        materials: [
            { id: 'linh_thao_trung', quantity: 5 },
            { id: 'ma_thach', quantity: 1 }
        ],
        baseSuccessRate: 0.6,
        time: 60,
        description: 'Hồi phục lượng lớn Khí Huyết và Linh Lực.'
    }
];

export const getRecipeById = (id) => ALCHEMY_RECIPES.find(r => r.id === id);
export const getCauldronById = (id) => CAULDRONS[id];
export const getFlameById = (id) => FLAMES[id];
export const getAlchemyLevelInfo = (level) => ALCHEMY_LEVELS.find(l => l.level === level) || ALCHEMY_LEVELS[0];
