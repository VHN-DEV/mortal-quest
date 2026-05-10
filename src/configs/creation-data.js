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
    'hoang_co_thanh_the': { id: 'hoang_co_thanh_the', name: 'Hoang Cổ Thánh Thể', cost: 150, desc: 'Thân thể mạnh nhất thế gian. HP và Phòng thủ cực cao.', bonus: { maxHp: 1000, def: 50, atk: 20 } },
    'tien_thien_dao_the': { id: 'tien_thien_dao_the', name: 'Tiên Thiên Đạo Thể', cost: 120, desc: 'Gần gũi đại đạo. Tăng mạnh tốc độ tu luyện và thần thức.', bonus: { tvps: 3.0, mana: 200 } },
    'thai_am_chi_the': { id: 'thai_am_chi_the', name: 'Thái Âm Chi Thể', cost: 80, desc: 'Hàn khí bẩm sinh. Phù hợp công pháp băng hệ.', bonus: { mana: 150, spd: 15 } },
    'phe_linh_ma_the': { id: 'phe_linh_ma_the', name: 'Phệ Linh Ma Thể', cost: 100, desc: 'Thôn phệ linh lực vạn vật. Tốc độ tu luyện nhanh nhưng dễ tẩu hỏa.', bonus: { tvps: 3.5, hp: -20 } },
    'long_huyet_chi_the': { id: 'long_huyet_chi_the', name: 'Long Huyết Chi Thể', cost: 90, desc: 'Mang trong mình dòng máu chân long.', bonus: { atk: 60, maxHp: 300 } },
    'binh_thuong': { id: 'binh_thuong', name: 'Phàm Thể', cost: 0, desc: 'Cơ thể bình thường của con người.', bonus: {} }
};

export const CREATION_ORIGINS = {
    'tan_tu': { id: 'tan_tu', name: 'Tán Tu', cost: 0, desc: 'Tự do tự tại, không có tài nguyên khởi đầu.', resources: { lingShi: 0, items: [] } },
    'gia_toc': { id: 'gia_toc', name: 'Gia Tộc Tu Tiên', cost: 30, desc: 'Sinh ra trong gia tộc, có sẵn linh thạch và công pháp.', resources: { lingShi: 500, items: ['truong_sinh_quyet_book'] } },
    'tong_mon': { id: 'tong_mon', name: 'Đệ Tử Tông Môn', cost: 50, desc: 'Được tông môn che chở, có pháp bảo phòng thân.', resources: { lingShi: 200, items: ['phi_kiem_go', 'ao_bo_so_cap'] } },
    'ma_dao': { id: 'ma_dao', name: 'Hậu Nhân Ma Đạo', cost: 20, desc: 'Công pháp bá đạo nhưng bị chính đạo truy quét.', resources: { lingShi: 300, items: ['huyet_don_thuat_book'], karma: -50 } },
    'dai_gia_toc': { id: 'dai_gia_toc', name: 'Đại Thế Gia', cost: 80, desc: 'Con cháu thế gia danh tiếng, tài lực dồi dào.', resources: { lingShi: 5000, items: ['ngung_khi_dan', 'ngung_khi_dan'] } }
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
