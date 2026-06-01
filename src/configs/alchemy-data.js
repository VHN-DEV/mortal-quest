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
        quality: 'Phàm Khí',
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
        quality: 'Linh Khí',
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
        quality: 'Cổ Bảo',
        successBonus: 0.15,
        qualityBonus: 0.2,
        stability: 0.85,
        heatRate: 1.5,
        outputBonus: 2,
        description: 'Chứa đựng tinh hoa chi lực của địa long, khống hỏa cực tốt.'
    },
    'phuong_hoa_lu': {
        id: 'phuong_hoa_lu',
        name: 'Phượng Hỏa Lư',
        quality: 'Pháp Bảo',
        successBonus: 0.25,
        qualityBonus: 0.3,
        stability: 0.9,
        heatRate: 1.8,
        outputBonus: 3,
        description: 'Lò luyện cổ xưa khắc họa phượng hoàng thần điểu, lửa phượng giúp tăng nhanh tốc độ luyện đan và sản lượng đan dược cực tốt.'
    },
    'thien_lu': {
        id: 'thien_lu',
        name: 'Thiên Cực Thái Hư Lư',
        quality: 'Linh Bảo',
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
        id: 'tich_coc_dan',
        name: 'Tịch Cốc Đan',
        resultId: 'tich_coc_dan',
        level: 1,
        materials: [
            { id: 'tich_coc_thao', quantity: 2 },
            { id: 'linh_coc', quantity: 3 }
        ],
        baseSuccessRate: 0.9,
        time: 2,
        yield: 10,
        description: 'Đan dược cơ bản chế luyện từ Trân Châu Linh Cốc giúp tu sĩ bế quan không cần ăn uống, mỗi viên duy trì 1 ngày. Mỗi lần luyện chế thu được 10 viên.'
    },
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
        description: 'Chế luyện từ Thanh Phục Thảo sơ cấp giúp tu sĩ gia tăng tích lũy tu vi ở Luyện Khí cảnh.'
    },
    {
        id: 'hoi_linh_dan',
        name: 'Hồi Linh Đan',
        resultId: 'hoi_linh_dan',
        level: 1,
        materials: [
            { id: 'thanh_long_tham', quantity: 1 },
            { id: 'linh_thao_thap', quantity: 1 }
        ],
        baseSuccessRate: 0.85,
        time: 6,
        description: 'Hồi Linh Đan chế luyện từ Thanh Long Sâm dồi dào Mộc sinh cơ và Thanh Phục Thảo, giúp lập tức phục hồi 80 Linh Lực.'
    },
    {
        id: 'ngoc_de_dan',
        name: 'Ngọc Đề Đan',
        resultId: 'ngoc_de_dan',
        level: 2,
        materials: [
            { id: 'ngoc_de_hoa', quantity: 2 },
            { id: 'linh_thao_10y', quantity: 1 }
        ],
        baseSuccessRate: 0.75,
        time: 12,
        description: 'Ngọc Đề Đan ôn hòa điều hỏa dược tính, uống vào trước khi đột phá Luyện Khí cảnh giúp gia tăng 5% tỷ lệ thành công.'
    },
    {
        id: 'thanh_tam_dan',
        name: 'Thanh Tâm Đan',
        resultId: 'thanh_tam_dan',
        level: 2,
        materials: [
            { id: 'linh_thao_10y', quantity: 2 },
            { id: 'chu_sa_muc', quantity: 1 }
        ],
        baseSuccessRate: 0.7,
        time: 15,
        description: 'Dùng Hoàng Tinh Thảo (10 năm) bồi dưỡng tinh thần, giúp bình ổn tâm lực, hồi phục 50% Khí Huyết.'
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
        description: 'Sử dụng Hoàng Tinh Thảo (10 năm) bồi bổ nguyên khí, nhanh chóng hồi phục Khí Huyết và Linh Lực.'
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
        description: 'Chế từ Uần Cổ Thảo (100 năm) quý hiếm, linh dược phụ trợ tối trọng yếu để tu sĩ tu luyện đột phá lên Trúc Cơ Cảnh.'
    },
    {
        id: 'hoa_duong_dan',
        name: 'Hỏa Dương Đan',
        resultId: 'hoa_duong_dan',
        level: 3,
        materials: [
            { id: 'hoa_duong_chi', quantity: 1 },
            { id: 'yeu_dan_so', quantity: 1 }
        ],
        baseSuccessRate: 0.55,
        time: 30,
        description: 'Luyện chế từ Hỏa Dương Chi nóng ấm, sử dụng giúp tăng mạnh 15% hỏa thuộc tính sát thương trong 3 trận tiếp theo.'
    },
    {
        id: 'ngung_anh_dan',
        name: 'Ngưng Anh Đan',
        resultId: 'ngung_anh_dan',
        level: 5,
        materials: [
            { id: 'linh_thao_1000y', quantity: 1 },
            { id: 'yeu_dan_trung', quantity: 1 },
            { id: 'han_ngoc_tuy', quantity: 1 }
        ],
        baseSuccessRate: 0.3,
        time: 180,
        description: 'Sử dụng Cửu Khúc Linh Sâm (1000 năm) thông linh làm chủ dược, giúp hỗ trợ tu sĩ phá phôi hóa anh ngưng tụ Nguyên Anh cực kỳ nghịch thiên.'
    }
];

export const getRecipeById = (id) => ALCHEMY_RECIPES.find(r => r.id === id);
export const getCauldronById = (id) => {
    if (!id) return null;
    const cleanId = id.endsWith('_item') ? id.slice(0, -5) : id;
    return CAULDRONS[cleanId];
};
export const getFlameById = (id) => {
    if (!id) return null;
    const cleanId = id.endsWith('_seed') ? id.slice(0, -5) : id;
    return FLAMES[cleanId];
};
export const getAlchemyLevelInfo = (level) => ALCHEMY_LEVELS.find(l => l.level === level) || ALCHEMY_LEVELS[0];
