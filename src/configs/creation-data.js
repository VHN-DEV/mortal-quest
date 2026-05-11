export const CREATION_CONFIG = {
    BASE_POINTS: 100,
    MAX_ADVANTAGES: 5,
    MAX_DISADVANTAGES: 3
};

export const CREATION_ROOTS = {
    'thien_linh_can': { id: 'thien_linh_can', name: 'Thiên Linh Căn', cost: 100, type: 'special', desc: 'Đơn linh căn thuần khiết nhất. Tốc độ tu luyện x4.', bonus: { tvps: 4.0 } },
    'di_linh_can': { id: 'di_linh_can', name: 'Dị Linh Căn', cost: 80, type: 'special', desc: 'Lôi/Băng/Phong... Tăng tốc tu luyện x2.5 và sát thương thuộc tính.', bonus: { tvps: 2.5, atk: 50 } },
    'song_linh_can': { id: 'song_linh_can', name: 'Song Linh Căn', cost: 40, type: 'normal', desc: 'Hai loại linh căn. Tốc độ tu luyện x1.8.', bonus: { tvps: 1.8 } },
    'tam_linh_can': { id: 'tam_linh_can', name: 'Tam Linh Căn', cost: 10, type: 'normal', desc: 'Ba loại linh căn. Tốc độ tu luyện x1.2.', bonus: { tvps: 1.2 } },
    'ngu_hanh_linh_can': { id: 'ngu_hanh_linh_can', name: 'Ngũ Hành Linh Căn', cost: 0, type: 'normal', desc: 'Đầy đủ ngũ hành. Tu luyện cân bằng nhưng chậm.', bonus: { tvps: 1.0 } },
    'tap_linh_can': { id: 'tap_linh_can', name: 'Tạp Linh Căn', cost: -20, type: 'debuff', desc: 'Linh căn hỗn tạp. Tu luyện cực chậm nhưng ý chí bền bỉ.', bonus: { tvps: 0.5, maxHp: 100 } }
};

export const CREATION_PHYSIQUES = {
    'hoang_co_thanh_the': { id: 'hoang_co_thanh_the', name: 'Hoang Cổ Thánh Thể', cost: 150, desc: 'Thân thể mạnh nhất thế gian. HP và Phòng thủ cực cao.' },
    'tien_thien_dao_the': { id: 'tien_thien_dao_the', name: 'Tiên Thiên Đạo Thể', cost: 120, desc: 'Gần gũi đại đạo. Tăng mạnh tốc độ tu luyện và thần thức.' },
    'thai_duong_thanh_the': { id: 'thai_duong_thanh_the', name: 'Thái Dương Thánh Thể', cost: 100, desc: 'Mang trong mình sức mạnh của mặt trời. Phù hợp hỏa hệ.' },
    'thien_ma_the': { id: 'thien_ma_the', name: 'Thiên Ma Thể', cost: 90, desc: 'Ma khí bẩm sinh, chiến lực tăng mạnh.' },
    'thai_hu_hon_the': { id: 'thai_hu_hon_the', name: 'Thái Hư Hồn Thể', cost: 80, desc: 'Linh hồn cường đại, thần thức vô biên.' },
    'loi_linh_the': { id: 'loi_linh_the', name: 'Lôi Linh Thể', cost: 60, desc: 'Sát thương lôi cực mạnh.' },
    'kim_cuong_bao_the': { id: 'kim_cuong_bao_the', name: 'Kim Cương Bảo Thể', cost: 50, desc: 'Phòng ngự cực mạnh.' },
    'binh_thuong': { id: 'binh_thuong', name: 'Phàm Thể', cost: 0, desc: 'Cơ thể bình thường của con người.' }
};

export const CREATION_ORIGINS = {
    'tan_tu': { id: 'tan_tu', name: 'Tán Tu', cost: 0, desc: 'Tự do tự tại, không có tài nguyên khởi đầu.', resources: { lingShi: 0, items: [] }, monthlyResources: { lingShi: 0 } },
    'vo_gia_cu': { id: 'vo_gia_cu', name: 'Vô Gia Cư', cost: -10, desc: 'Không nơi nương tựa, bắt đầu với hai bàn tay trắng.', resources: { lingShi: 0, items: [] }, monthlyResources: { lingShi: 0 } },
    'no_nan': { id: 'no_nan', name: 'Nợ Nần Chồng Chất', cost: -30, desc: 'Gánh trên vai món nợ lớn của gia tộc.', resources: { lingShi: -2000, items: [] }, monthlyResources: { lingShi: 0 } },
    'gia_toc': { id: 'gia_toc', name: 'Gia Tộc Tu Tiên', cost: 30, desc: 'Sinh ra trong gia tộc, có sẵn linh thạch và công pháp. Hàng tháng nhận bổng lộc gia tộc.', resources: { lingShi: 500, items: ['truong_sinh_quyet_book'] }, monthlyResources: { lingShi: 100 } },
    'tong_mon': { id: 'tong_mon', name: 'Đệ Tử Tông Môn', cost: 50, desc: 'Được tông môn che chở, có pháp bảo phòng thân. Hàng tháng nhận bổng lộc tông môn.', resources: { lingShi: 200, items: ['phi_kiem_go', 'ao_bo_so_cap'] }, monthlyResources: { lingShi: 50 } },
    'ma_dao': { id: 'ma_dao', name: 'Hậu Nhân Ma Đạo', cost: 20, desc: 'Công pháp bá đạo nhưng bị chính đạo truy quét.', resources: { lingShi: 300, items: ['huyet_don_thuat_book'], karma: -50 }, monthlyResources: { lingShi: 0 } },
    'dai_gia_toc': { id: 'dai_gia_toc', name: 'Đại Thế Gia', cost: 80, desc: 'Con cháu thế gia danh tiếng, tài lực dồi dào. Hàng tháng nhận bổng lộc cực lớn.', resources: { lingShi: 5000, items: ['ngung_khi_dan', 'ngung_khi_dan'] }, monthlyResources: { lingShi: 1000 } }
};

export const CREATION_TRAITS = {
    // Advantages
    'dai_khi_van': { id: 'dai_khi_van', name: 'Đại Khí Vận', cost: 60, type: 'advantage', desc: 'Vận khí cực tốt, dễ gặp kỳ ngộ.', bonus: { luck: 100 } },
    'kiem_dao_ky_tai': { id: 'kiem_dao_ky_tai', name: 'Kiếm Đạo Kỳ Tài', cost: 40, type: 'advantage', desc: 'Lĩnh ngộ kiếm pháp cực nhanh.', bonus: { atk: 40 } },
    'di_hoa_tan_diem': { id: 'di_hoa_tan_diem', name: 'Dị Hỏa Tàn Diễm', cost: 50, type: 'advantage', desc: 'Mang theo ngọn lửa thần bí, hỗ trợ luyện đan.', bonus: { alchemySuccess: 0.3 } },
    'thong_minh': { id: 'thong_minh', name: 'Thất Khiếu Linh Lung', cost: 30, type: 'advantage', desc: 'Thông minh bẩm sinh, tăng tốc độ học tập.', bonus: { tvps: 1.2 } },
    
    // Disadvantages
    'kinh_mach_tan_khuyet': { id: 'kinh_mach_tan_khuyet', name: 'Kinh Mạch Tàn Khuyết', cost: -50, type: 'disadvantage', desc: 'Kinh mạch bị tổn thương, tu luyện chậm.', bonus: { tvps: 0.7 } },
    'thien_sat_co_tinh': { id: 'thien_sat_co_tinh', name: 'Thiên Sát Cô Tinh', cost: -40, type: 'disadvantage', desc: 'Khắc người thân, dễ gây thù hận.', bonus: { luck: 30, karma: -100 } },
    'han_doc_nhap_the': { id: 'han_doc_nhap_the', name: 'Hàn Độc Nhập Thể', cost: -60, type: 'disadvantage', desc: 'Trúng độc từ nhỏ, HP giảm nhẹ mỗi giây.', bonus: { maxHp: -50, spd: -10 } },
    'bi_truy_sat': { id: 'bi_truy_sat', name: 'Bị Truy Sát', cost: -30, type: 'disadvantage', desc: 'Có cừu gia mạnh mẽ từ khi bắt đầu.', bonus: { stats: { atk: 10 } } }
};

export const CREATION_SCENARIOS = {
    'pham_nhan_luu': {
        id: 'pham_nhan_luu',
        name: 'Phàm Nhân Lưu',
        desc: 'Không thiên phú, không tài nguyên, bắt đầu từ con số 0.',
        setup: { root: 'tap_linh_can', physique: 'binh_thuong', origin: 'tan_tu', traits: [] }
    },
    'thien_kieu_luu': {
        id: 'thien_kieu_luu',
        name: 'Thiên Kiêu Lưu',
        desc: 'Thiên phú nghịch thiên, là niềm hy vọng của tông môn.',
        setup: { root: 'thien_linh_can', physique: 'tien_thien_dao_the', origin: 'tong_mon', traits: ['dai_khi_van'] }
    },
    'trong_sinh_luu': {
        id: 'trong_sinh_luu',
        name: 'Trọng Sinh Lưu',
        desc: 'Đại năng trọng sinh, mang theo ký ức tiền kiếp.',
        setup: { root: 'song_linh_can', physique: 'binh_thuong', origin: 'tan_tu', traits: ['thong_minh', 'dai_khi_van'] }
    },
    'xuyen_khong_luu': {
        id: 'xuyen_khong_luu',
        name: 'Xuyên Không Lưu',
        desc: 'Linh hồn từ thế giới khác, mang theo tri thức kỳ lạ.',
        setup: { root: 'di_linh_can', physique: 'binh_thuong', origin: 'tan_tu', traits: ['thong_minh'] }
    }
};
