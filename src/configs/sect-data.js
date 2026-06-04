import { ASSETS } from './asset-data.js';
import { SECT_RANKS_ENUM } from './game-enums.js';
export { SECT_RANKS_ENUM };

// Backward-compatible lookup: SECT_RANKS['ngoai_mon'] → enum object
export const SECT_RANKS = Object.freeze(
    Object.values(SECT_RANKS_ENUM).reduce((acc, q) => {
        acc[q.id] = q;
        return acc;
    }, {})
);

// Môn Quy — Luật lệ tông môn (hiển thị và có hiệu lực thực)
export const SECT_RULES = [
    { id: 'rule_1', icon: '⚔️', title: 'Cấm Đồ Sát Đồng Môn', desc: 'Giết đồng môn bị trục xuất và dính Lệnh Truy Sát 60 ngày.', penalty: 'expel' },
    { id: 'rule_2', icon: '📚', title: 'Cấm Đánh Cắp Tàng Kinh Các', desc: 'Ăn trộm bí tịch bị phế tu vi và tịch thu toàn bộ Cống Hiến.', penalty: 'purge_contribution' },
    { id: 'rule_3', icon: '🏃', title: 'Phản Tông Xuất Môn', desc: 'Tự rời môn phái bị ghi vào sổ Phản Đồ, dính Lệnh Truy Sát 30 ngày.', penalty: 'wanted_30' },
    { id: 'rule_4', icon: '💰', title: 'Nộp Cống Định Kỳ', desc: 'Không nộp Cống Hiến quá 90 ngày bị hạ xuống Ngoại Môn.', penalty: 'demote' },
    { id: 'rule_5', icon: '🤐', title: 'Bảo Mật Tông Bí', desc: 'Tiết lộ tông bí cho ngoại nhân bị phế toàn bộ cấp bậc và trục xuất.', penalty: 'expel' },
    { id: 'rule_6', icon: '🙇', title: 'Tôn Trọng Thứ Bậc', desc: 'Thái Thượng Bế Quan không được quấy nhiễu — chỉ được yết kiến khi ra quan hoặc tốn Cống Hiến.', penalty: 'warning' },
];

// Phần thưởng yết kiến Thái Thượng
export const GRANDMASTER_REWARDS = [
    { id: 'gm_tuvi', weight: 40, desc: 'Thái Thượng truyền thụ khẩu quyết vận khí', effect: (p) => { p.tuVi += 5000; return '+5,000 Tu Vi'; } },
    { id: 'gm_buff', weight: 30, desc: 'Thái Thượng hộ đạo gia trì 3 ngày tu luyện gấp đôi', effect: (p) => { p.addBuff({ id: 'gm_blessing', stat: 'tuViSpeed', value: 2.0, duration: 3 * 86400000 }); return 'Buff tu luyện x2 trong 3 ngày'; } },
    { id: 'gm_item', weight: 20, desc: 'Thái Thượng ban thưởng Ngưng Khí Đan', effect: (p) => { p.inventory.addItem('ngung_khi_dan', 3); return '+3 Ngưng Khí Đan'; } },
    { id: 'gm_insight', weight: 10, desc: 'Thái Thượng chỉ điểm đạo lý, Ngộ tính đột phá', effect: (p) => { p.comprehension = Math.min(100, (p.comprehension || 10) + 5); return '+5 Ngộ Tính'; } },
];

export const SECTS = {
    // --- Original 3 Sects ---
    'thien_kiem_tong': {
        id: 'thien_kiem_tong',
        name: 'Thiên Kiếm Tông',
        description: 'Tông môn kiếm đạo đứng đầu Nhân Giới, chú trọng công kích và tốc độ.',
        minRealm: 5,
        bonus: { atk: 10, spd: 5 },
        portrait: ASSETS.backgrounds.sect,
        missions: [
            { id: 'tk_1', name: 'Tuần tra ngoại môn', desc: 'Đuổi khéo bọn yêu thú quấy phá ruộng linh thảo.', reward: { contribution: 10, lingShi: 50 }, stamina: 20 },
            { id: 'tk_2', name: 'Rèn luyện kiếm ý', desc: 'Đứng dưới thác nước luyện kiếm 4 canh giờ.', reward: { contribution: 20, tuVi: 500 }, stamina: 40 }
        ],
        enemySects: ['cu_kiem_mon', 'hoa_dao_o'],
        zoneOverrides: {
            'son_mon': { name: 'Kiếm Quan Sơn Môn', desc: 'Trận pháp phong duệ như kiếm bảo vệ lối vào.' },
            'tang_kinh_cac': { name: 'Kiếm Các', icon: '📖', badge: 'Kiếm Pháp' },
            'tang_bao_cac': { name: 'Kiếm Bảo Khố', icon: '💎', desc: 'Nơi cất giữ phi kiếm vạn năm và tài nguyên trân quý.' },
            'noi_mon_vien': { name: 'Kiếm Tu Điện', desc: 'Điện xá đệ tử nội môn, nơi thường xuyên diễn ra luận kiếm.' },
            'luyen_khi': { name: 'Đúc Kiếm Cốc', desc: 'Lò rèn địa hỏa chuyên đúc kiếm phôi và tế luyện phi kiếm.' },
            'bi_canh': { name: 'Kiếm Mộ Bí Cảnh', desc: 'Khám phá kiếm mộ viễn cổ, thu thập kiếm ý tiền nhân.' },
            'dong_phu': { name: 'Kiếm Tâm Nhai', desc: 'Bờ vực tĩnh tâm, ngồi ngộ kiếm đạo và đột phá cảnh giới.' }
        },
        libraryItems: [
            { id: 'ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'huyen_thiet', price: 100, type: 'contribution', minRankScore: 0 },
            { id: 'thanh_kiem_linh_tinh', price: 300, type: 'contribution', minRankScore: 0 },
            { id: 'thien_kiem_tong_cong_phap', name: 'Thiên Kiếm Quyết', price: 600, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'tinh_kim', price: 400, type: 'contribution', minRankScore: 1 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'ban_ve_tinh_ha_phi_kiem', price: 1200, type: 'contribution', minRankScore: 1 },
            { id: 'thien_kiem_tong_bi_tich', name: 'Kiếm Thuật: Vạn Kiếm Quy Tông', price: 8000, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 }
        ]
    },
    'hoang_phong_coc': {
        id: 'hoang_phong_coc',
        name: 'Hoàng Phong Cốc',
        description: 'Một trong Lục Đại Tông Môn của Việt Quốc, linh khí dồi dào phù hợp tu luyện, nổi tiếng với ngũ hành thuật pháp.',
        minRealm: 0,
        bonus: { def: 5, maxHp: 30 },
        portrait: ASSETS.backgrounds.sect,
        missions: [
            { id: 'hp_1', name: 'Trồng Linh Dược', desc: 'Chăm sóc và thu hoạch linh dược tại dược viên.', reward: { contribution: 10, lingShi: 30 }, stamina: 20 },
            { id: 'hp_2', name: 'Tuần tra cốc khẩu', desc: 'Canh gác lối vào tông môn, phòng ngừa tán tu quấy phá.', reward: { contribution: 15, tuVi: 300 }, stamina: 30 }
        ],
        enemySects: ['huyen_am_coc', 'quy_linh_mon'],
        zoneOverrides: {
            'son_mon': { name: 'Hoàng Phong Trận', desc: 'Bão cát mịt mù quanh năm bảo vệ sơn môn.' },
            'tang_kinh_cac': { name: 'Ngũ Hành Điện', badge: 'Pháp Thuật' },
            'tang_bao_cac': { name: 'Hoàng Sa Bảo Các', desc: 'Lưu trữ ngũ hành dị bảo và bùa chú trân quý.' },
            'duoc_vien': { name: 'Bách Thảo Dược Viên', desc: 'Nơi có linh khí ngũ hành ôn hòa, thích hợp trồng linh dược.' }
        },
        libraryItems: [
            { id: 'ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'hoang_phong_than_sa_tui', price: 250, type: 'contribution', minRankScore: 0 },
            { id: 'hoang_phong_coc_cong_phap', name: 'Hoàng Phong Thần Sa Quyết', price: 600, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'phu_van_kim_cuong_phu', price: 300, type: 'contribution', minRankScore: 0 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'hoang_phong_coc_bi_tich', name: 'Thuật Pháp: Hoàng Phong Thần Sa', price: 6000, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 }
        ]
    },
    'huyen_am_coc': {
        id: 'huyen_am_coc',
        name: 'Huyền Âm Cốc',
        description: 'Nơi tập hợp các tu sĩ ma đạo, quỷ quyệt và khó lường.',
        minRealm: 5,
        bonus: { def: 10, maxHp: 50 },
        portrait: ASSETS.backgrounds.cave,
        missions: [
            { id: 'ha_1', name: 'Thu thập âm khí', desc: 'Vào sâu trong cốc thu thập u minh chi khí.', reward: { contribution: 15, lingShi: 70 }, stamina: 25 },
            { id: 'ha_2', name: 'Luyện chế thi khôi', desc: 'Hỗ trợ trưởng lão luyện chế khôi lỗi.', reward: { contribution: 25, tuVi: 600 }, stamina: 45 }
        ],
        enemySects: ['thien_kiem_tong', 'lac_van_tong'],
        zoneOverrides: {
            'son_mon': { name: 'U Âm Quan', desc: 'Cổng vào âm u, tử khí lượn lờ cấm người sống lại gần.' },
            'tang_kinh_cac': { name: 'Vạn Hồn Điện', icon: '💀', badge: 'Ma Kinh' },
            'tang_bao_cac': { name: 'U Âm Bảo Khố', desc: 'Tích trữ ma thạch, xương cốt và tà vật hắc ám.' },
            'luyen_dan': { name: 'Huyết Đan Thất', desc: 'Nơi luyện đan tỏa ra mùi máu tanh tưởi, luyện chế thi đan.' },
            'bi_canh': { name: 'U Âm Động', desc: 'Động huyệt chứa đầy lệ quỷ, nơi rèn luyện của ma tu.' },
            'dong_phu': { name: 'Hàn Đàm', icon: '🧊', desc: 'Băng đàm lạnh lẽo thấu xương, tu luyện ma công tiến triển cực nhanh.' }
        },
        libraryItems: [
            { id: 'ma_thach_ha_pham', price: 100, type: 'contribution', minRankScore: 0 },
            { id: 'ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'huyen_am_han_tuy', price: 400, type: 'contribution', minRankScore: 0 },
            { id: 'huyen_am_coc_cong_phap', name: 'Huyền Âm Chân Kinh', price: 800, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'cuu_u_luyen_thi_thuat', price: 400, type: 'contribution', minRankScore: 0 },
            { id: 'u_minh_hoa', price: 300, type: 'contribution', minRankScore: 1 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'bi_phuong_luyen_che_dong_giap_thi', price: 1800, type: 'contribution', minRankScore: 1 },
            { id: 'am_hon_phien', price: 2500, type: 'contribution', minRankScore: 1 },
            { id: 'huyen_am_coc_bi_tich', name: 'Bí Thuật: Huyền Âm Quỷ Trảo', price: 8000, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'thien_dao_than_thach', price: 4500, type: 'contribution', minRankScore: 2 },
            { id: 'hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 }
        ]
    },

    // --- Righteous & Neutral Sects (Yue State & neighbors) ---
    'yem_nguyet_tong': {
        id: 'yem_nguyet_tong',
        name: 'Yểm Nguyệt Tông',
        description: 'Đứng đầu thất đại tông môn Việt Quốc, nổi danh với bí thuật song tu đỉnh cấp và ảo thuật nguyệt minh.',
        minRealm: 5,
        bonus: { atk: 5, maxHp: 20, spd: 5 },
        portrait: ASSETS.backgrounds.sect,
        missions: [
            { id: 'yn_1', name: 'Hộ Pháp Dược Viên', desc: 'Canh gác động phủ dược viên của các sư tỷ ngoại môn.', reward: { contribution: 10, lingShi: 40 }, stamina: 20 },
            { id: 'yn_2', name: 'Luyện Song Tu Quyết', desc: 'Cùng đồng môn cảm ngộ âm dương giao hòa chi đạo.', reward: { contribution: 25, tuVi: 600 }, stamina: 40 }
        ],
        zoneOverrides: {
            'son_mon': { name: 'Mị Hương Quan', desc: 'Sương mù mờ ảo, hương thơm quyến rũ người lạc lối.' },
            'tang_kinh_cac': { name: 'Nguyệt Ảnh Các', badge: 'Mị Thuật' },
            'tang_bao_cac': { name: 'Ảo Nguyệt Bảo Các', desc: 'Lưu giữ mị dược, trân bảo và các vật phẩm tế luyện.' },
            'luyen_dan': { name: 'Mị Dược Phòng', desc: 'Bào chế các loại hương phấn và đan dược đặc thù.' },
            'dong_phu': { name: 'Ảo Mộng Cốc', desc: 'Thung lũng ảo cảnh tuyệt mỹ để tu luyện song tu.' }
        },
        libraryItems: [
            { id: 'ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'thanh_tam_dan', price: 100, type: 'contribution', minRankScore: 0 },
            { id: 'song_tu_dieu_dan', price: 800, type: 'contribution', minRankScore: 0 },
            { id: 'yem_nguyet_tong_cong_phap', name: 'Yểm Nguyệt Song Tu Quyết', price: 800, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'yem_nguyet_tong_bi_tich', name: 'Bí Thuật: Mị Ảnh Hoặc Thần', price: 8000, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 }
        ]
    },
    'lac_van_tong': {
        id: 'lac_van_tong',
        name: 'Lạc Vân Tông',
        description: 'Tông môn thanh tú thuộc Thiên Đạo Minh, chuyên luyện linh đan dược thảo thượng phẩm và nổi tiếng với Lạc Vân kiếm trận.',
        minRealm: 14,
        bonus: { def: 8, maxHp: 40 },
        portrait: ASSETS.backgrounds.sect,
        missions: [
            { id: 'lv_1', name: 'Hái Lạc Vân Thảo', desc: 'Thu hái các ngọn cỏ lạc vân quý giá trên sườn Bách Nhạc Phong.', reward: { contribution: 15, lingShi: 50 }, stamina: 20 },
            { id: 'lv_2', name: 'Tĩnh tọa luyện đan', desc: 'Ngồi thiền thanh lọc khí dược bên động phủ cổ kính của tổ sư.', reward: { contribution: 30, tuVi: 800 }, stamina: 45 }
        ],
        zoneOverrides: {
            'son_mon': { name: 'Lạc Vân Linh Cổng', desc: 'Cổng mây vờn quanh, đan hương phiêu tán khắp nơi.' },
            'tang_kinh_cac': { name: 'Đan Kinh Lâu', icon: '📜', badge: 'Đan Đạo' },
            'tang_bao_cac': { name: 'Đan Dược Bảo Khố', desc: 'Kho báu tràn ngập linh đan tuyệt phẩm và kỳ hoa dị thảo.' },
            'luyen_dan': { name: 'Vạn Dược Đan Lô', desc: 'Đại sảnh luyện đan khổng lồ với ngàn hỏa nhãn lấy từ địa mạch.' },
            'noi_mon_vien': { name: 'Linh Đan Viện', desc: 'Viện tu luyện của nội môn, nồng nặc linh khí dược thảo.' },
            'duoc_vien': { name: 'Bách Thảo Bí Cảnh', desc: 'Không gian riêng để bồi dưỡng kỳ hoa dị thảo vạn năm.' }
        },
        libraryItems: [
            { id: 'ngung_khi_dan', price: 30, type: 'contribution', minRankScore: 0 },
            { id: 'lac_van_thao', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'dan_phuong_hoi_linh_dan', price: 150, type: 'contribution', minRankScore: 0 },
            { id: 'dan_phuong_ngoc_de_dan', price: 250, type: 'contribution', minRankScore: 0 },
            { id: 'lac_van_tong_cong_phap', name: 'Lạc Vân Kiếm Trận Biện', price: 800, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 150, type: 'contribution', minRankScore: 0 },
            { id: 'dan_phuong_thanh_tam_dan', price: 350, type: 'contribution', minRankScore: 0 },
            { id: 'thanh_tam_dan', price: 100, type: 'contribution', minRankScore: 0 },
            { id: 'dan_dao_chan_giai', name: 'Đan Đạo Chân Giải', price: 1000, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'dan_phuong_truc_co_dan', price: 1000, type: 'contribution', minRankScore: 1 },
            { id: 'ket_dan_dan', price: 1200, type: 'contribution', minRankScore: 1 },
            { id: 'dan_phuong_bo_nguyen_dan', price: 500, type: 'contribution', minRankScore: 1 },
            { id: 'lac_van_tien_dan', price: 3500, type: 'contribution', minRankScore: 1 },
            { id: 'lac_van_tong_bi_tich', name: 'Thuật Pháp: Tử Cực Thần Quang', price: 9000, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'dan_phuong_ngung_anh_dan', price: 6000, type: 'contribution', minRankScore: 2 },
            { id: 'nguyen_anh_dan', price: 6500, type: 'contribution', minRankScore: 2 },
            { id: 'hoa_than_dan', price: 20000, type: 'contribution', minRankScore: 3 }
        ]
    },
    'thien_tinh_tong': {
        id: 'thien_tinh_tong',
        name: 'Thiên Tinh Tông',
        description: 'Tông môn Nguyên Vũ Quốc nổi tiếng với kỹ năng Trận Pháp tinh diệu bậc nhất thiên hạ.',
        minRealm: 5,
        bonus: { def: 8, spd: 4 },
        portrait: ASSETS.backgrounds.sect,
        missions: [
            { id: 'tt_1', name: 'Duy Tu Cấm Chế', desc: 'Khắc họa cấm chế trận pháp bảo vệ sơn môn khỏi tà tu sâm lấn.', reward: { contribution: 12, lingShi: 45 }, stamina: 25 },
            { id: 'tt_2', name: 'Diễn Luyện Trận Pháp', desc: 'Thí nghiệm diễn luyện biến hóa của Cửu Cung Trận pháp.', reward: { contribution: 25, tuVi: 550 }, stamina: 40 }
        ],
        zoneOverrides: {
            'son_mon': { name: 'Tinh Trận Quan', desc: 'Hàng ngàn ánh tinh quang lưu chuyển, cấm chế đan xen vô số.' },
            'tang_kinh_cac': { name: 'Trận Pháp Điện', badge: 'Trận Đạo' },
            'tang_bao_cac': { name: 'Tinh Thần Bảo Khố', desc: 'Lưu giữ trận bàn viễn cổ và tài nguyên tinh thạch quý giá.' },
            'noi_mon_vien': { name: 'Tinh Tú Viện', desc: 'Nơi đệ tử nội môn ngộ đạo theo sự vận hành của tinh tú.' },
            'luyen_khi': { name: 'Thiên Công Trận Đài', desc: 'Khu vực chuyên khắc họa trận bàn và luyện chế trận kỳ.' },
            'bi_canh': { name: 'Cửu Cung Thử Trận', desc: 'Mê cung trận pháp ảo ảnh để rèn luyện ý chí và trận đạo.' },
            'dong_phu': { name: 'Tinh Đồ Bế Quan', desc: 'Bế quan trong tinh đồ hư ảo, dẫn tinh lực thối thể.' }
        },
        libraryItems: [
            { id: 'ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'tinh_than_thach', price: 300, type: 'contribution', minRankScore: 0 },
            { id: 'khoi_linh_tran_ban', price: 300, type: 'contribution', minRankScore: 0 },
            { id: 'thien_tinh_tong_cong_phap', name: 'Thiên Tinh Trận Pháp Quyết', price: 600, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'tran_do_tu_linh_tran', price: 500, type: 'contribution', minRankScore: 0 },
            { id: 'truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'tinh_quang_tran_ban', price: 900, type: 'contribution', minRankScore: 1 },
            { id: 'tran_do_ao_anh_tran', price: 800, type: 'contribution', minRankScore: 1 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'thien_tinh_tong_bi_tich', name: 'Trận Pháp: Ngũ Hành Huyền Thuẫn', price: 7000, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'tran_do_sat_kiem_tran', price: 3500, type: 'contribution', minRankScore: 2 },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'tran_do_ho_tong_dai_tran', price: 15000, type: 'contribution', minRankScore: 3 },
            { id: 'hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 }
        ]
    },
    'linh_thu_son': {
        id: 'linh_thu_son',
        name: 'Linh Thú Sơn',
        description: 'Tông môn chuyên thu phục, thuần hóa và ngự trị yêu thú hoang dã.',
        minRealm: 5,
        bonus: { atk: 5, maxHp: 30 },
        portrait: ASSETS.backgrounds.sect,
        missions: [
            { id: 'lt_1', name: 'Chăm sóc yêu thú', desc: 'Cho ăn và tắm rửa các đầu ấu thú yếu ớt tại thú viên.', reward: { contribution: 10, lingShi: 35 }, stamina: 20 },
            { id: 'lt_2', name: 'Săn bắt hoang thú', desc: 'Đi rừng sâu dùng ngự thú linh phù bắt giữ một đầu yêu thú sơ cấp.', reward: { contribution: 20, tuVi: 500 }, stamina: 35 }
        ],
        zoneOverrides: {
            'son_mon': { name: 'Vạn Thú Sơn Quan', desc: 'Sơn môn khổng lồ có vạn thú thủ vệ, tiếng gầm thét vang dội.' },
            'tang_kinh_cac': { name: 'Thú Hồn Điện', icon: '🐾', badge: 'Ngự Thú' },
            'tang_bao_cac': { name: 'Vạn Thú Bảo Khố', desc: 'Bảo các tàng trữ vô số yêu đan và trứng yêu thú hiếm.' },
            'linh_thu': { name: 'Hóa Long Trì', desc: 'Ao linh tuyền thần bí giúp linh thú tiến hóa và lột xác.' },
            'noi_mon_vien': { name: 'Linh Thú Viên Nội Các', desc: 'Khu vực bồi dưỡng linh thú cao cấp của đệ tử nội môn.' },
            'bi_canh': { name: 'Yêu Hồn Tháp', desc: 'Tòa tháp nhốt vô số yêu hồn tàn bạo để đệ tử vào thu phục.' }
        },
        libraryItems: [
            { id: 'ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'ngu_thu_quyet', price: 400, type: 'contribution', minRankScore: 0 },
            { id: 'linh_thu_ung_hieu_an', price: 700, type: 'contribution', minRankScore: 0 },
            { id: 'linh_thu_son_cong_phap', name: 'Linh Thú Vạn Thú Quyết', price: 600, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'thanh_van_ly_thu_linh_noan', price: 3000, type: 'contribution', minRankScore: 1 },
            { id: 'huyen_giap_dia_long_linh_noan', price: 5000, type: 'contribution', minRankScore: 1 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'linh_thu_son_bi_tich', name: 'Bí Thuật: Thú Huyết Cuồng Bạo', price: 7500, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 }
        ]
    },
    'thanh_hu_mon': {
        id: 'thanh_hu_mon',
        name: 'Thanh Hư Môn',
        description: 'Một trong các đại môn phái Việt Quốc, nổi danh nhờ truyền thừa luyện linh dược dưỡng khí bí ẩn.',
        minRealm: 5,
        bonus: { def: 6, maxHp: 25 },
        portrait: ASSETS.backgrounds.sect,
        missions: [
            { id: 'th_1', name: 'Luyện Chế Khí Đan', desc: 'Tiếp linh hỏa trợ giúp nhóm trưởng lão ngoại môn thối luyện dược trấp.', reward: { contribution: 12, lingShi: 40 }, stamina: 20 },
            { id: 'th_2', name: 'Phân Loại Đan Phương', desc: 'Chỉnh lý cổ tự đan thư bị hư hao theo thời gian.', reward: { contribution: 20, tuVi: 550 }, stamina: 40 }
        ],
        zoneOverrides: {
            'son_mon': { name: 'Thanh Hư Sơn Môn', desc: 'Sơn môn phủ sương khói thanh khiết, đạo giáo uy nghiêm.' },
            'tang_kinh_cac': { name: 'Đạo Nguyên Điện', icon: '☯️', badge: 'Đạo Pháp' },
            'tang_bao_cac': { name: 'Đạo Tạng Bảo Các', desc: 'Bảo khố thanh tịnh, lưu giữ linh vật Đạo gia.' },
            'luyen_dan': { name: 'Thanh Hư Đan Thất', desc: 'Đan thất ngập tràn mùi tiên dược, an tĩnh luyện đan.' },
            'duoc_vien': { name: 'Linh Lộ Dược Sơn', desc: 'Nuôi trồng linh dược bằng linh lộ tinh khiết nhất.' },
            'noi_mon_vien': { name: 'Dưỡng Khí Các', desc: 'Khu vực tu luyện hấp thụ thiên địa linh khí của nội môn.' },
            'bi_canh': { name: 'Thanh Hư Tĩnh Địa', desc: 'Bí cảnh đạo môn dùng để vượt ải tâm ma.' }
        },
        libraryItems: [
            { id: 'ngung_khi_dan', price: 40, type: 'contribution', minRankScore: 0 },
            { id: 'thanh_hu_ngoc_lo', price: 350, type: 'contribution', minRankScore: 0 },
            { id: 'thanh_hu_mon_cong_phap', name: 'Thanh Hư Đạo Nguyên Kinh', price: 600, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 180, type: 'contribution', minRankScore: 0 },
            { id: 'dan_dao_chan_giai', name: 'Đan Đạo Chân Giải', price: 1000, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'dan_phuong_ngung_khi_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'dan_phuong_truc_co_dan', price: 1000, type: 'contribution', minRankScore: 1 },
            { id: 'ket_dan_dan', price: 1400, type: 'contribution', minRankScore: 1 },
            { id: 'thanh_hu_mon_bi_tich', name: 'Bí Pháp: Thanh Hư Ngọc Lộ', price: 7000, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'nguyen_anh_dan', price: 7500, type: 'contribution', minRankScore: 2 },
            { id: 'hoa_than_dan', price: 23000, type: 'contribution', minRankScore: 3 }
        ]
    },
    'cu_kiem_mon': {
        id: 'cu_kiem_mon',
        name: 'Cự Kiếm Môn',
        description: 'Tông môn rèn luyện phong thái trọng kiếm kiên cường dũng mãnh, lấy lực phá xảo.',
        minRealm: 5,
        bonus: { atk: 12 },
        portrait: ASSETS.backgrounds.sect,
        missions: [
            { id: 'ck_1', name: 'Rèn Đúc Trọng Thiết', desc: 'Dùng cự búa rèn cốt phôi kiếm khổng lồ nặng ngàn cân.', reward: { contribution: 10, lingShi: 50 }, stamina: 25 },
            { id: 'ck_2', name: 'Vung Kiếm Khổ Luyện', desc: 'Đứng vững vung đại trọng kiếm vạn lần để rèn tráng nhục thân.', reward: { contribution: 25, tuVi: 600 }, stamina: 45 }
        ],
        zoneOverrides: {
            'son_mon': { name: 'Thiết Sơn Quan', desc: 'Cổng môn được rèn từ hắc thiết ngàn năm, vững chãi vô địch.' },
            'tang_kinh_cac': { name: 'Thiết Điển Đường', badge: 'Lực Đạo' },
            'tang_bao_cac': { name: 'Trọng Thiết Bảo Khố', desc: 'Kho tàng khổng lồ chứa khoáng thạch vạn năm và trọng giáp.' },
            'noi_mon_vien': { name: 'Trọng Lực Điện', desc: 'Không gian nhân đôi trọng lực để luyện nhục thân cường hãn.' },
            'luyen_khi': { name: 'Thiết Luyện Cốc', desc: 'Khe núi chuyên dùng để quai búa rèn linh khí và trọng kiếm.' },
            'bi_canh': { name: 'Thiết Sơn Thử Luyện', desc: 'Khám phá quặng mỏ viễn cổ, vượt ải bằng nhục thân.' },
            'dong_phu': { name: 'Kim Cương Trì', desc: 'Ngâm mình trong linh trì đặc quánh linh khí để rèn thể.' }
        },
        libraryItems: [
            { id: 'ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'huyen_thiet', price: 80, type: 'contribution', minRankScore: 0 },
            { id: 'cu_kiem_mon_cong_phap', name: 'Cự Kiếm Cương Thiết Thể', price: 600, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'tinh_kim', price: 350, type: 'contribution', minRankScore: 1 },
            { id: 'cu_kiem_trong_giap', price: 1800, type: 'contribution', minRankScore: 1 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'cu_kiem_mon_bi_tich', name: 'Kiếm Thuật: Cự Kiếm Trảm Thiên', price: 7500, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 }
        ]
    },
    'hoa_dao_o': {
        id: 'hoa_dao_o',
        name: 'Hóa Đao Ổ',
        description: 'Tông môn tu luyện đao pháp tuyệt đỉnh vô song, đao kình ngập trời sát phạt quả quyết.',
        minRealm: 5,
        bonus: { atk: 8, spd: 4 },
        portrait: ASSETS.backgrounds.sect,
        missions: [
            { id: 'hd_1', name: 'Mài Giũa Đao Kình', desc: 'Ngồi xếp bằng trước đao phong bia đá cảm thụ đao kình.', reward: { contribution: 12, lingShi: 40 }, stamina: 20 },
            { id: 'hd_2', name: 'Luyện Đao Tự Vệ', desc: 'Thực hành các thế đao dũng mãnh để chém yêu thú xâm nhập.', reward: { contribution: 20, tuVi: 500 }, stamina: 35 }
        ],
        zoneOverrides: {
            'son_mon': { name: 'Đao Phong Quan', desc: 'Cổng môn sắc lẹm, ngập tràn sát khí đao phong bức người.' },
            'tang_kinh_cac': { name: 'Đao Kinh Lâu', icon: '🗡️', badge: 'Đao Pháp' },
            'tang_bao_cac': { name: 'Đao Phong Bảo Các', desc: 'Nơi cất giữ tuyệt thế đao khí và đao phôi.' },
            'noi_mon_vien': { name: 'Đao Ý Đường', desc: 'Nơi diễn ra các trận quyết đấu sống còn của đệ tử nội môn.' },
            'luyen_khi': { name: 'Mài Đao Đường', desc: 'Khu vực chế tác và mài giũa đao khí sắc bén hơn bao giờ hết.' },
            'bi_canh': { name: 'Đao Kình Thử Trường', desc: 'Bí cảnh thử thách đao ý, đi qua ngàn đao trảm.' },
            'dong_phu': { name: 'Đao Ý Động', desc: 'Động phủ đầy vết đao của tiền nhân, ngồi thiền ngộ đao kình.' }
        },
        libraryItems: [
            { id: 'ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'hoa_dao_linh_sa', price: 280, type: 'contribution', minRankScore: 0 },
            { id: 'hoa_dao_o_cong_phap', name: 'Hóa Đao Thần Công', price: 600, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'hoa_dao_o_bi_tich', name: 'Kiếm Thuật: Đao Kình Thương Không', price: 7500, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 }
        ]
    },
    'thien_khuyet_bao': {
        id: 'thien_khuyet_bao',
        name: 'Thiên Khuyết Bảo',
        description: 'Pháo đài kiên cố phòng thủ vững chãi, đệ tử đều tinh thông hộ thể cương khí vững như bàn thạch.',
        minRealm: 5,
        bonus: { def: 12 },
        portrait: ASSETS.backgrounds.sect,
        missions: [
            { id: 'kb_1', name: 'Rèn Luyện Cương Khí', desc: 'Gánh chịu oanh kích gió độc ngoại sơn để gia cố thuẫn khí.', reward: { contribution: 10, lingShi: 45 }, stamina: 20 },
            { id: 'kb_2', name: 'Vận Linh Hộ Thành', desc: 'Đổ đầy linh thạch nạp năng lượng vào kết giới thạch thành.', reward: { contribution: 22, tuVi: 500 }, stamina: 40 }
        ],
        zoneOverrides: {
            'son_mon': { name: 'Thạch Môn Kiên Cố', desc: 'Bức tường thành đá vạn trượng không thể phá vỡ.' },
            'tang_kinh_cac': { name: 'Phòng Ngự Các', badge: 'Hộ Thể' },
            'tang_bao_cac': { name: 'Kim Cang Bảo Khố', desc: 'Bảo các kiên cố lưu giữ thuẫn giáp và kim luyện thạch.' },
            'luyen_khi': { name: 'Giáp Luyện Thất', desc: 'Chuyên rèn luyện các loại thuẫn giáp và kim cương bảo y.' }
        },
        libraryItems: [
            { id: 'ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'phu_van_kim_cuong_phu', price: 300, type: 'contribution', minRankScore: 0 },
            { id: 'kim_luyen_thach', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'thien_khuyet_bao_cong_phap', name: 'Thiên Khuyết Hộ Thể Thuẫn', price: 600, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'cu_kiem_trong_giap', price: 1800, type: 'contribution', minRankScore: 1 },
            { id: 'thien_khuyet_bao_bi_tich', name: 'Bí Pháp: Thiên Khuyết Kim Giáp', price: 7000, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 }
        ]
    },

    // --- Demonic Sects (Ma Đạo Lục Tông) ---
    'quy_linh_mon': {
        id: 'quy_linh_mon',
        name: 'Quỷ Linh Môn',
        description: 'Lực lượng ma đạo hiểm ác tột cùng, chuyên ngự quỷ luyện hồn và dùng độc đan dược thăng cấp.',
        minRealm: 14,
        isDemonic: true,
        bonus: { atk: 8, spd: 4 },
        portrait: ASSETS.backgrounds.cave,
        missions: [
            { id: 'ql_1', name: 'Luyện Hồn Linh Kỳ', desc: 'Hút tàn linh để tế luyện vạn hồn phách ma kỳ.', reward: { contribution: 15, lingShi: 60 }, stamina: 25 },
            { id: 'ql_2', name: 'Tế Luyện Huyết Cốt', desc: 'Nghiền nát linh thảo độc cùng cốt quỷ luyện đan thăng vi.', reward: { contribution: 25, tuVi: 700 }, stamina: 45 }
        ],
        zoneOverrides: {
            'son_mon': { name: 'Vạn Hồn Quan', desc: 'Trận đồ vạn oan hồn gào thét ngăn cản mọi sinh linh.' },
            'tang_kinh_cac': { name: 'Quỷ Kinh Điện', icon: '👻', badge: 'Quỷ Đạo' },
            'tang_bao_cac': { name: 'Huyết Cốt Bảo Khố', desc: 'Kho tàng tà ác chứa huyết ngọc, cốt tủy và dị bảo.' },
            'luyen_dan': { name: 'Độc Đan Lô', desc: 'Hỏa diễm đen ngòm chuyên luyện chế thi đan và độc dược.' },
            'bi_canh': { name: 'Huyết Hải Thử Địa', desc: 'Bể máu sôi sục là nơi đệ tử rèn luyện ý chí sinh tồn.' },
            'dong_phu': { name: 'Vạn Hồn Phiên', desc: 'Bế quan trong không gian của cự đại quỷ phiên, thu thập lệ khí.' }
        },
        libraryItems: [
            { id: 'ma_thach_ha_pham', price: 80, type: 'contribution', minRankScore: 0 },
            { id: 'ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'van_hon_cot', price: 300, type: 'contribution', minRankScore: 0 },
            { id: 'quy_linh_mon_cong_phap', name: 'Quỷ Âm Huyền Pháp', price: 800, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'cuu_u_luyen_thi_thuat', price: 400, type: 'contribution', minRankScore: 0 },
            { id: 'tuyet_huyet_hac_dan', price: 700, type: 'contribution', minRankScore: 1 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'bi_phuong_luyen_che_dong_giap_thi', price: 1800, type: 'contribution', minRankScore: 1 },
            { id: 'quy_linh_mon_bi_tich', name: 'Bí Thuật: Vạn Quỷ Cắn Xé', price: 8000, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'thien_dao_than_thach', price: 4500, type: 'contribution', minRankScore: 2 },
            { id: 'hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 }
        ]
    },
    'hop_hoan_tong': {
        id: 'hop_hoan_tong',
        name: 'Hợp Hoan Tông',
        description: 'Đứng đầu Ma Đạo Lục Tông, mị thuật ảo trận tàn hại thần hồn và tu luyện nghịch thiên.',
        minRealm: 18,
        isDemonic: true,
        bonus: { atk: 8, def: 5, spd: 5 },
        portrait: ASSETS.backgrounds.cave,
        missions: [
            { id: 'hh_1', name: 'Dựng Mị Ảo Trận', desc: 'Bố trí mị hương ảo cảnh dụ địch nhân lạc lối ở ngoại biên.', reward: { contribution: 20, lingShi: 80 }, stamina: 30 },
            { id: 'hh_2', name: 'Luyện Tâm Ma Kiếp', desc: 'Vào u âm điện đối mặt tàn ảnh ảo thức vượt qua tâm ma oanh kích.', reward: { contribution: 35, tuVi: 900 }, stamina: 45 }
        ],
        zoneOverrides: {
            'son_mon': { name: 'Mị Hương Quan', desc: 'Sương mù phấn hồng bao phủ, người thường ngửi thấy liền điên loạn.' },
            'tang_kinh_cac': { name: 'Mị Thuật Lâu', badge: 'Mị Thuật' },
            'tang_bao_cac': { name: 'Hoan Lạc Bảo Các', desc: 'Bảo khố hoa lệ tàng trữ kỳ trân dị bảo và âm dương mị dược.' },
            'luyen_dan': { name: 'Mị Dược Phòng', desc: 'Chuyên chế tác xuân dược, độc dược khống chế tâm trí.' },
            'bi_canh': { name: 'Ảo Cảnh Trận', desc: 'Trận pháp mị hoặc tối cao, kiểm tra đạo tâm đệ tử.' },
            'dong_phu': { name: 'Ảo Mộng Cốc', desc: 'Nơi mây mưa hoan lạc hoặc tàn sát vô hình trong mộng cảnh.' }
        },
        libraryItems: [
            { id: 'ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'thanh_tam_dan', price: 120, type: 'contribution', minRankScore: 0 },
            { id: 'mi_duoc_thi_huong', price: 500, type: 'contribution', minRankScore: 0 },
            { id: 'hop_hoan_tong_cong_phap', name: 'Âm Dương Hoan Lạc Quyết', price: 900, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'hop_hoan_tong_bi_tich', name: 'Mị Thuật: Mị Hoặc Chúng Sinh', price: 9000, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 }
        ]
    },
    'ma_diem_mon': {
        id: 'ma_diem_mon',
        name: 'Ma Diễm Môn',
        description: 'Tông môn ma đạo điều khiển Thanh Dương Ma Hỏa và hỏa độc nóng cháy phá tan vạn vật phong kiến.',
        minRealm: 14,
        isDemonic: true,
        bonus: { atk: 10, maxHp: 20 },
        portrait: ASSETS.backgrounds.cave,
        missions: [
            { id: 'md_1', name: 'Đoạt Hỏa Ma Thạch', desc: 'Vượt nham thạch nóng cháy khai quặng ma hỏa độc thạch tinh.', reward: { contribution: 15, lingShi: 50 }, stamina: 25 },
            { id: 'md_2', name: 'Thanh Dương Hỏa Thể', desc: 'Thắp hỏa diễm thâm nhập kinh mạch tăng tính cực đoan công lực.', reward: { contribution: 25, tuVi: 650 }, stamina: 45 }
        ],
        zoneOverrides: {
            'son_mon': { name: 'Viêm Hỏa Quan', desc: 'Cổng môn được luyện từ hắc diệm vô tận nóng rực.' },
            'tang_kinh_cac': { name: 'Hỏa Kinh Đường', badge: 'Ma Hỏa' },
            'tang_bao_cac': { name: 'Hỏa Diễm Bảo Khố', desc: 'Kho tàng nóng rực chứa hỏa tinh thạch và ma khí.' },
            'luyen_dan': { name: 'Ma Hỏa Đan Lò', desc: 'Dùng ma hỏa Thanh Dương luyện chế các loại bạo đan tà ác.' },
            'bi_canh': { name: 'Viêm Sơn Thử Địa', desc: 'Núi lửa phun trào liên tục, rèn luyện thân thể với ma hỏa.' },
            'dong_phu': { name: 'Địa Hỏa Trì', desc: 'Ngâm mình trong nham thạch rực lửa để dung hợp hỏa linh lực.' }
        },
        libraryItems: [
            { id: 'ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'hat_giong_hoa_diem_thao', price: 120, type: 'contribution', minRankScore: 0 },
            { id: 'hoa_diem_thach', price: 300, type: 'contribution', minRankScore: 0 },
            { id: 'ma_diem_mon_cong_phap', name: 'Thanh Dương Ma Hỏa Kinh', price: 800, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'ma_diem_mon_bi_tich', name: 'Bí Pháp: U Minh Địa Hỏa', price: 8000, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 }
        ]
    },
    'thien_sat_tong': {
        id: 'thien_sat_tong',
        name: 'Thiên Sát Tông',
        description: 'Tông ma cuồng bạo hung tàn chuộng huyết chiến dũng cảm, ma đầu khát máu luyện sát vi tiên.',
        minRealm: 14,
        isDemonic: true,
        bonus: { atk: 8, def: 8 },
        portrait: ASSETS.backgrounds.cave,
        missions: [
            { id: 'ts_1', name: 'Luyện Ma Sát Cốt', desc: 'Chịu oai hạch sát oai trên đài gió quạt rèn luyện ma sát gân cốt.', reward: { contribution: 15, lingShi: 55 }, stamina: 25 },
            { id: 'ts_2', name: 'Thôn Phệ Sát Khí', desc: 'Gom sát ý tử vong cổ trận luyện pháp bảo u phong.', reward: { contribution: 25, tuVi: 700 }, stamina: 40 }
        ],
        zoneOverrides: {
            'son_mon': { name: 'Sát Khí Quan', desc: 'Oán khí ngập trời, sát khí ngưng tụ thành thực thể cảnh cáo kẻ lạ.' },
            'tang_kinh_cac': { name: 'Sát Điển Đường', badge: 'Sát Đạo' },
            'tang_bao_cac': { name: 'Sát Khí Bảo Các', desc: 'Bảo khố tăm tối cất giữ hung khí đẫm máu.' },
            'luyen_dan': { name: 'Huyết Sát Đường', desc: 'Luyện đan bằng tinh huyết và oán niệm để cưỡng ép thăng cấp.' },
            'bi_canh': { name: 'Huyết Chiến Trường', desc: 'Đấu trường sinh tử đẫm máu để mài giũa sát khí.' },
            'dong_phu': { name: 'Sát Tâm Quan', desc: 'Bế quan trong oán khí ngập trời, tìm sự tĩnh lặng trong cuồng bạo.' }
        },
        libraryItems: [
            { id: 'ma_thach_ha_pham', price: 100, type: 'contribution', minRankScore: 0 },
            { id: 'ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'sat_khi_linh_phien', price: 400, type: 'contribution', minRankScore: 0 },
            { id: 'thien_sat_tong_cong_phap', name: 'Thiên Sát Ma Quyết', price: 800, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'thien_sat_tong_bi_tich', name: 'Bí Pháp: Sát Khí Xung Thiên', price: 8000, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 }
        ]
    },
    'ngu_linh_tong': {
        id: 'ngu_linh_tong',
        name: 'Ngự Linh Tông',
        description: 'Giới tông nổi bật với mật thuật chăn nuôi ngự phục vạn cổ thú trùng tàn ác bạo ngược.',
        minRealm: 14,
        isDemonic: true,
        bonus: { maxHp: 50, spd: 4 },
        portrait: ASSETS.backgrounds.cave,
        missions: [
            { id: 'nl_1', name: 'Chăn Nuôi Kỳ Trùng', desc: 'Cho Hấp Huyết Trùng ăn huyết linh dịch thối mục.', reward: { contribution: 15, lingShi: 45 }, stamina: 20 },
            { id: 'nl_2', name: 'Bắt Kỳ Trùng Noãn', desc: 'Vào đầm lầy săn kiếm và thuần phục ngọc côn trùng noãn khí.', reward: { contribution: 25, tuVi: 650 }, stamina: 40 }
        ],
        zoneOverrides: {
            'son_mon': { name: 'Trùng Cốc Quan', desc: 'Trùng vụ bao phủ lối vào, chỉ cần hít một ngụm là bạo tễ.' },
            'tang_kinh_cac': { name: 'Vạn Trùng Điển', badge: 'Ngự Trùng' },
            'tang_bao_cac': { name: 'Vạn Trùng Bảo Khố', desc: 'Nơi tối tăm ẩm thấp, lưu trữ linh trùng hiếm và cổ vật.' },
            'linh_thu': { name: 'Kỳ Trùng Noãn Trì', desc: 'Ao ấp trứng các loài kỳ trùng dị thú tà ác bậc nhất.' },
            'noi_mon_vien': { name: 'Trùng Cốc Nội Phủ', desc: 'Nơi đệ tử nội môn sống chung cùng độc trùng.' },
            'bi_canh': { name: 'U Trùng Bí Địa', desc: 'Rừng độc trùng nguyên sinh, săn bắt cổ trùng hiếm.' }
        },
        libraryItems: [
            { id: 'ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'ngu_thu_quyet', price: 400, type: 'contribution', minRankScore: 0 },
            { id: 'ngoc_cai_trung_noan', price: 450, type: 'contribution', minRankScore: 0 },
            { id: 'ngu_linh_tong_cong_phap', name: 'Vạn Côn Ngự Trùng Thuật', price: 800, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'tui_hap_huyet_trung', price: 600, type: 'contribution', minRankScore: 1 },
            { id: 'u_minh_mong_diep_linh_noan', price: 6000, type: 'contribution', minRankScore: 1 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'ngu_linh_tong_bi_tich', name: 'Bí Thuật: Phệ Linh Ma Trùng', price: 8000, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 }
        ]
    },
    'khoi_am_tong': {
        id: 'khoi_am_tong',
        name: 'Khôi Âm Tông',
        description: 'Danh môn tà giới chuyên chú ngự trị thi khôi lỗi quật khởi, luyện tráng âm sát.',
        minRealm: 14,
        isDemonic: true,
        bonus: { def: 10, maxHp: 30 },
        portrait: ASSETS.backgrounds.cave,
        missions: [
            { id: 'ka_1', name: 'Khôi Lỗi Nhiếp Hồn', desc: 'Gom hồn thể yếu ớt để rót tu linh thức cho thiết khôi lỗi.', reward: { contribution: 15, lingShi: 50 }, stamina: 25 },
            { id: 'ka_2', name: 'Ngâm Thi Trì Luyện', desc: 'Ngâm thiết xác thi vào U Âm sát tuyền để khôi lỗi đồng sắt tráng vĩnh viễn.', reward: { contribution: 25, tuVi: 650 }, stamina: 45 }
        ],
        zoneOverrides: {
            'son_mon': { name: 'Thi Cốc Quan', desc: 'Hàng ngàn thi khôi lỗi đứng bất động gác cổng vô hồn.' },
            'tang_kinh_cac': { name: 'U Minh Điển', badge: 'Khôi Thuật' },
            'tang_bao_cac': { name: 'Khôi Lỗi Bảo Các', desc: 'Bảo khố lạnh lẽo tàng trữ linh thạch và thiết giáp thi binh.' },
            'luyen_dan': { name: 'U Linh Luyện Thất', desc: 'Bào chế linh dịch ngâm xác chết để chế tạo khôi lỗi.' },
            'bi_canh': { name: 'Thi Cốc Bí Địa', desc: 'Thung lũng nhốt khôi lỗi mất kiểm soát để đệ tử vào thu dọn.' },
            'dong_phu': { name: 'U Minh Động Phủ', desc: 'Bế quan cùng khôi lỗi trong không gian tối tăm lạnh lẽo.' }
        },
        libraryItems: [
            { id: 'ma_thach_ha_pham', price: 100, type: 'contribution', minRankScore: 0 },
            { id: 'ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'u_thiet_linh_moc', price: 350, type: 'contribution', minRankScore: 0 },
            { id: 'khoi_am_tong_cong_phap', name: 'Khôi Lỗi U Minh Kinh', price: 800, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'luyen_khi_tong_cuong', name: 'Luyện Khí Tổng Cương', price: 1000, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'ban_ve_thiet_giap_khoi_loi', price: 800, type: 'contribution', minRankScore: 0 },
            { id: 'khoi_loi_cot_an', price: 700, type: 'contribution', minRankScore: 1 },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'ban_ve_kiem_khoi', price: 2500, type: 'contribution', minRankScore: 1 },
            { id: 'khoi_am_tong_bi_tich', name: 'Bí Thuật: Bộc Phá Thi Khôi', price: 8500, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 }
        ]
    }
};

export const getSectById = (id) => SECTS[id];
export const getSectRules = () => SECT_RULES;
export const getGrandmasterRewards = () => GRANDMASTER_REWARDS;
