import { ASSETS } from './asset-data.js';

export const SECT_RANKS = {
    'ngoai_mon': { id: 'ngoai_mon', name: 'Ngoại Môn Đệ Tử', minRealm: 1, minContribution: 0, salary: 50, rankScore: 0 },
    'noi_mon': { id: 'noi_mon', name: 'Nội Môn Đệ Tử', minRealm: 5, minContribution: 500, salary: 200, rankScore: 1 },
    'chan_truyen': { id: 'chan_truyen', name: 'Chân Truyền Đệ Tử', minRealm: 14, minContribution: 2000, salary: 500, rankScore: 2 },
    'truong_lao': { id: 'truong_lao', name: 'Trưởng Lão', minRealm: 20, minContribution: 5000, salary: 1500, rankScore: 3 },
    'dai_truong_lao': { id: 'dai_truong_lao', name: 'Đại Trưởng Lão', minRealm: 30, minContribution: 10000, salary: 3000, rankScore: 4 },
    'tong_chu': { id: 'tong_chu', name: 'Tông Chủ', minRealm: 40, minContribution: 25000, salary: 5000, rankScore: 5 }
};

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
    { id: 'gm_item', weight: 20, desc: 'Thái Thượng ban thưởng Ngưng Khí Đan', effect: (p) => { p.inventory.addItem('item_ngung_khi_dan', 3); return '+3 Ngưng Khí Đan'; } },
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
        libraryItems: [
            { id: 'item_truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'tech_kiem_quyet', name: 'Kiếm Quyết Cơ Bản', price: 500, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'item_ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'tech_thuong_thien_kiem', name: 'Thượng Thiên Kiếm Khí', price: 2000, type: 'contribution', minRankScore: 1, isTech: true },
            { id: 'tech_van_kiem_quyet', name: 'Vạn Kiếm Quy Tông', price: 10000, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'item_hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 },
            { id: 'tech_thien_dao_phap', name: 'Thiên Kiếm Nhất Khí Quyết', price: 30000, type: 'contribution', minRankScore: 3, isTech: true },
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
        libraryItems: [
            { id: 'item_ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'item_truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'tech_kiem_quyet', name: 'Ngũ Hành Thuật Pháp Cơ Yếu', price: 600, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'item_ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'tech_thuong_thien_kiem', name: 'Hoàng Phong Ngũ Hành Quyết', price: 2200, type: 'contribution', minRankScore: 1, isTech: true },
            { id: 'item_nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'tech_thien_dao_phap', name: 'Thiên Địa Ngũ Hành Đại Pháp', price: 30000, type: 'contribution', minRankScore: 3, isTech: true },
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
        libraryItems: [
            { id: 'item_truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'tech_kiem_quyet', name: 'Huyền Âm Chỉ Pháp', price: 500, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'item_ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'tech_thuong_thien_kiem', name: 'U Minh Âm Sát Kinh', price: 2500, type: 'contribution', minRankScore: 1, isTech: true },
            { id: 'item_nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'tech_van_kiem_quyet', name: 'Huyền Âm Ma Công Đại Thành', price: 10000, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'item_hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 },
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
        ]
    }
};

export const getSectById = (id) => SECTS[id];
export const getSectRules = () => SECT_RULES;
export const getGrandmasterRewards = () => GRANDMASTER_REWARDS;
