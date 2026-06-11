import { ASSETS } from './asset-data.js';

// Cấp Bậc Gia Tộc (Clan Ranks)
export const CLAN_RANKS = Object.freeze({
    ngoai_chi: {
        id: 'ngoai_chi',
        name: 'Tộc Nhân Ngoại Chi',
        color: '#9ca3af',
        sortOrder: 0,
        minRealm: 1,
        minContribution: 0,
        salary: 60,
        rankScore: 0
    },
    noi_chi: {
        id: 'noi_chi',
        name: 'Tộc Nhân Nội Chi',
        color: '#4ade80',
        sortOrder: 1,
        minRealm: 5,
        minContribution: 500,
        salary: 250,
        rankScore: 1
    },
    tinh_anh: {
        id: 'tinh_anh',
        name: 'Tinh Anh Tộc Nhân',
        color: '#3b82f6',
        sortOrder: 2,
        minRealm: 14,
        minContribution: 2000,
        salary: 600,
        rankScore: 2
    },
    truong_lao: {
        id: 'truong_lao',
        name: 'Gia Tộc Trưởng Lão',
        color: '#a855f7',
        sortOrder: 3,
        minRealm: 20,
        minContribution: 5000,
        salary: 1800,
        rankScore: 3
    },
    lao_to: {
        id: 'lao_to',
        name: 'Thái Thượng Tộc Lão',
        color: '#ef4444',
        sortOrder: 4,
        minRealm: 30,
        minContribution: 15000,
        salary: 4000,
        rankScore: 4
    }
});

export const CLANS = {
    'yen_gia_bao': {
        id: 'yen_gia_bao',
        name: 'Yến Gia Bảo',
        description: 'Đệ nhất tu tiên thế gia của Việt Quốc, đóng đô tại Yến Gia Lâu sơn mạch hiểm trở. Thực lực hùng hậu bậc nhất, tiếng tăm vang dội khắp cõi chính tà.',
        minRealm: 0,
        bonus: { atk: 12, maxHp: 20 },
        portrait: ASSETS.backgrounds.sect,
        missions: [
            { id: 'ygb_1', name: 'Tuần phòng sơn trang', desc: 'Tuần tra sơn trang, đề phòng tán tu gián điệp trà trộn.', reward: { contribution: 10, lingShi: 40 }, stamina: 20 },
            { id: 'ygb_2', name: 'Hộ tống thương đội', desc: 'Bảo vệ thương đội của gia tộc vận chuyển linh khoáng tới phường thị.', reward: { contribution: 20, tuVi: 450 }, stamina: 35 }
        ],
        enemyClans: ['tan_gia'],
        zoneOverrides: {
            'son_mon': { name: 'Thượng Linh Sơn Môn', desc: 'Lối vào Yến Gia Bảo được phòng ngự bằng đao trận sắc bén.' },
            'tang_kinh_cac': { name: 'Vạn Bảo Tàng Các', desc: 'Nơi cất giữ công pháp và tàng thư võ học của đệ nhất thế gia.' },
            'dong_phu': { name: 'Linh Khí Lâu Động Phủ', desc: 'Động phủ tu luyện cao cấp dành riêng cho tộc nhân.' }
        },
        libraryItems: [
            { id: 'ngung_khi_dan', price: 40, type: 'contribution', minRankScore: 0 },
            { id: 'canh_kim_quyet', name: 'Canh Kim Quyết', price: 500, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 180, type: 'contribution', minRankScore: 0 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 }
        ]
    },
    'tan_gia': {
        id: 'tan_gia',
        name: 'Tần Gia',
        description: 'Tu tiên gia tộc hiển hách trú đóng tại Tương Châu. Sở hữu cơ nghiệp trăm năm và linh trạch dồi dào, nổi danh với tuyệt kỹ ngũ hành kiếm trận.',
        minRealm: 0,
        bonus: { def: 10, comprehension: 2 },
        portrait: ASSETS.backgrounds.sect,
        missions: [
            { id: 'tg_1', name: 'Canh gác linh điền', desc: 'Trông coi ruộng linh điền tránh yêu trùng phá hoại thảo dược.', reward: { contribution: 10, lingShi: 35 }, stamina: 20 },
            { id: 'tg_2', name: 'Khai quật linh thạch', desc: 'Giám sát và phụ giúp khai thác tại linh thạch khoáng mạch.', reward: { contribution: 15, tuVi: 350 }, stamina: 30 }
        ],
        enemyClans: ['yen_gia_bao'],
        zoneOverrides: {
            'son_mon': { name: 'Tần Phủ Đại Môn', desc: 'Cổng phủ uy nghi được hộ vệ bởi tầng tầng trận pháp phòng thủ.' },
            'tang_kinh_cac': { name: 'Tần Gia Tàng Thư Các', desc: 'Thư viện lưu trữ các công pháp bí truyền hệ Thổ và Kim của Tần gia.' }
        },
        libraryItems: [
            { id: 'ngung_khi_dan', price: 40, type: 'contribution', minRankScore: 0 },
            { id: 'hau_tho_cong', name: 'Hậu Thổ Công', price: 500, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 180, type: 'contribution', minRankScore: 0 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 }
        ]
    },
    'bach_gia_trang': {
        id: 'bach_gia_trang',
        name: 'Bạch Gia Trang',
        description: 'Thế gia tu tiên tọa lạc tại ngoại ô Việt Quốc. Đời đời tinh thông chế tạo phù lục và gieo trồng các loại linh dược hiếm có.',
        minRealm: 0,
        bonus: { luck: 5, vit: 5 },
        portrait: ASSETS.backgrounds.sect,
        missions: [
            { id: 'bgt_1', name: 'Tưới nước linh điền', desc: 'Vận chuyển linh tuyền tưới tiêu linh thảo quý giá.', reward: { contribution: 12, lingShi: 30 }, stamina: 15 },
            { id: 'bgt_2', name: 'Hỗ trợ luyện đan', desc: 'Chăm nom hỏa hầu phụ giúp đan sư gia tộc chưng cất đan dược.', reward: { contribution: 18, tuVi: 400 }, stamina: 30 }
        ],
        enemyClans: [],
        zoneOverrides: {
            'son_mon': { name: 'Trang Viên Lối Vào', desc: 'Hàng rào tre xanh mát che giấu mê hồn huyễn trận bên trong.' },
            'tang_kinh_cac': { name: 'Bạch Gia Phù Các', desc: 'Nơi cất giữ kỹ nghệ chế phù và các công pháp mộc hệ.' }
        },
        libraryItems: [
            { id: 'ngung_khi_dan', price: 35, type: 'contribution', minRankScore: 0 },
            { id: 'truong_xuan_nap_khi_quyet', name: 'Trường Xuân Nạp Khí Quyết', price: 500, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 170, type: 'contribution', minRankScore: 0 },
            { id: 'ket_dan_dan', price: 1400, type: 'contribution', minRankScore: 1 },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 }
        ]
    },
    'khong_gia_trang': {
        id: 'khong_gia_trang',
        name: 'Khổng Gia Trang',
        description: 'Thế gia tu tiên cổ xưa định cư gần Thái Nam Cốc. Thừa hưởng huyết mạch dị tộc với năng lực ngự thú và ẩn nấp cực kỳ xuất sắc.',
        minRealm: 0,
        bonus: { spd: 8, divineSense: 5 },
        portrait: ASSETS.backgrounds.sect,
        missions: [
            { id: 'kgt_1', name: 'Cho thú ăn', desc: 'Nuôi nấng các linh thú ấu sinh trong Linh Thú Viên gia tộc.', reward: { contribution: 10, lingShi: 35 }, stamina: 20 },
            { id: 'kgt_2', name: 'Thu thập mật dịch', desc: 'Vào rừng tìm kiếm linh dịch ngọt từ tổ linh trùng cổ.', reward: { contribution: 22, tuVi: 420 }, stamina: 35 }
        ],
        enemyClans: [],
        zoneOverrides: {
            'son_mon': { name: 'Khổng Phủ Thạch Đình', desc: 'Cột đá cổ khắc đầy cấm chế trận pháp trấn áp yêu tà.' },
            'tang_kinh_cac': { name: 'Vạn Trùng Các', desc: 'Lưu trữ bí tịch khống chế trùng thú và pháp thuật hệ thủy.' }
        },
        libraryItems: [
            { id: 'ngung_khi_dan', price: 40, type: 'contribution', minRankScore: 0 },
            { id: 'han_thuy_quyet', name: 'Hàn Thủy Quyết', price: 500, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 180, type: 'contribution', minRankScore: 0 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 }
        ]
    }
};

export const getClanById = (id) => {
    return CLANS[id] || null;
};
