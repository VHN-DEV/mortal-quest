/**
 * CẤM CHẾ SƯ DATA
 * 
 * Cấm Chế KHÁC Trận Pháp:
 * - Trận Pháp = hệ thống vận hành (chương trình)
 * - Cấm Chế   = khóa / ấn / tường lửa (mật khẩu + bảo vệ)
 *
 * Chức năng của Cấm Chế:
 * 1. PHONG ẤN - Khóa bảo vật, linh mạch, linh thú (ngăn truy cập trái phép)
 * 2. BẢO VỆ   - Bẫy tự kích hoạt khi bị phá sai cách (nổ, độc, tù túc)
 * 3. ẨN GIẤU  - Che giấu động phủ, kho đồ, bí cảnh khỏi thần thức ngoại lai
 * 4. TRUYỀN THỪA - Cấm chế của cổ tu sĩ để lại, chứa bí kíp hoặc thử thách
 *
 * Cấp độ cấm chế:
 * - Đơn Cấm: 1 lớp bảo vệ đơn giản
 * - Liên Hoàn Cấm: nhiều lớp chồng chéo
 * - Cổ Cấm: thượng cổ tu sĩ bố trí, khó phá vô cùng
 * - Tiên Cấm: tiên giới, hầu như bất phá
 */

export const CAM_CHE_TYPES = {
    PHONG_AN: { id: 'PHONG_AN', name: 'Phong Ấn', icon: '🔒', color: '#f59e0b', desc: 'Khóa túi đồ / kho báu / linh thú' },
    BAO_VE: { id: 'BAO_VE', name: 'Bảo Vệ', icon: '💥', color: '#ef4444', desc: 'Bẫy kích nổ khi bị phá sai cách' },
    AN_GIAU: { id: 'AN_GIAU', name: 'Ẩn Giấu', icon: '🌫️', color: '#8b5cf6', desc: 'Che giấu động phủ khỏi thần thức' }
};

export const CAM_CHE_RECIPES = {
    // --- Đơn Cấm (Cấp 1-2) ---
    'don_cam_phong_vat': {
        id: 'don_cam_phong_vat',
        name: 'Đơn Cấm Phong Vật',
        type: 'PHONG_AN',
        level: 1,
        materials: [
            { id: 'khoang_thach_dong', quantity: 3 },
            { id: 'linh_thach', quantity: 100 }
        ],
        manaCost: 30,
        staminaCost: 15,
        baseSuccessRate: 0.90,
        expGain: 25,
        camCheStrength: 100,
        description: 'Cấm chế sơ cấp khóa 1 túi trữ vật hoặc 1 bảo vật, ngăn người khác truy cập.'
    },
    'don_cam_an_giau': {
        id: 'don_cam_an_giau',
        name: 'Đơn Cấm Ẩn Giấu',
        type: 'AN_GIAU',
        level: 2,
        materials: [
            { id: 'khoang_thach_sat', quantity: 3 },
            { id: 'linh_thach', quantity: 200 }
        ],
        manaCost: 45,
        staminaCost: 20,
        baseSuccessRate: 0.85,
        expGain: 40,
        camCheStrength: 150,
        description: 'Cấm chế ẩn giấu che phủ một khu vực nhỏ, giảm 30% khả năng thần thức dò tìm động phủ.'
    },

    // --- Liên Hoàn Cấm (Cấp 3-5) ---
    'lien_hoan_bao_ve_cam': {
        id: 'lien_hoan_bao_ve_cam',
        name: 'Liên Hoàn Bảo Vệ Cấm',
        type: 'BAO_VE',
        level: 3,
        materials: [
            { id: 'khoang_thach_dong', quantity: 5 },
            { id: 'hoa_diem_thao', quantity: 2 }
        ],
        manaCost: 70,
        staminaCost: 30,
        baseSuccessRate: 0.78,
        expGain: 70,
        camCheStrength: 350,
        description: 'Cấm chế nhiều lớp. Kẻ phá ấn sai cách sẽ chịu phản kích hỏa thuộc tính.'
    },
    'lien_hoan_phong_an_dong_phu': {
        id: 'lien_hoan_phong_an_dong_phu',
        name: 'Liên Hoàn Phong Ấn Động Phủ',
        type: 'PHONG_AN',
        level: 4,
        materials: [
            { id: 'khoang_thach_sat', quantity: 5 },
            { id: 'tinh_thach_am_hon', quantity: 2 }
        ],
        manaCost: 90,
        staminaCost: 35,
        baseSuccessRate: 0.72,
        expGain: 100,
        camCheStrength: 600,
        description: 'Phong ấn nhiều lớp toàn bộ động phủ, tăng đáng kể độ bảo mật và phòng thủ tổng hợp.'
    },
    'me_suong_an_giau_cam': {
        id: 'me_suong_an_giau_cam',
        name: 'Mê Sương Ẩn Giấu Cấm',
        type: 'AN_GIAU',
        level: 5,
        materials: [
            { id: 'tinh_thach_am_hon', quantity: 3 },
            { id: 'huyen_thach', quantity: 2 }
        ],
        manaCost: 110,
        staminaCost: 40,
        baseSuccessRate: 0.65,
        expGain: 140,
        camCheStrength: 1000,
        description: 'Cấm chế huyễn hóa sương mù hắc ám dày đặc, ẩn giấu hoàn toàn động phủ khỏi thần thức cấp thấp.'
    },

    // --- Cổ Cấm (Cấp 6-7) ---
    'co_cam_bao_tri_tuyet_ky': {
        id: 'co_cam_bao_tri_tuyet_ky',
        name: 'Cổ Cấm Bảo Trì Tuyệt Kỹ',
        type: 'PHONG_AN',
        level: 6,
        materials: [
            { id: 'tien_nguyen_thach', quantity: 1 },
            { id: 'khoang_thach_dong', quantity: 10 }
        ],
        manaCost: 180,
        staminaCost: 60,
        baseSuccessRate: 0.55,
        expGain: 250,
        camCheStrength: 2500,
        description: 'Cổ cấm của thượng cổ tu sĩ, bảo tồn vĩnh cửu vật phẩm bên trong và chỉ chủ nhân có thể mở.'
    }
};

const CAM_CHE_LEVELS = [
    { level: 1, name: 'Cấm Chế Sư Sơ Cấp' },
    { level: 2, name: 'Cấm Chế Sư Trung Cấp' },
    { level: 3, name: 'Cấm Chế Sư Cao Cấp' },
    { level: 4, name: 'Cấm Chế Đại Sư' },
    { level: 5, name: 'Cấm Chế Tông Sư' },
    { level: 6, name: 'Cấm Chế Tôn Giả' },
    { level: 7, name: 'Cấm Chế Thiên Tôn' }
];

export const getCamCheLevelInfo = (level) => {
    return CAM_CHE_LEVELS.find(l => l.level === level) || { level, name: 'Cấm Chế Sư Vô Danh' };
};
