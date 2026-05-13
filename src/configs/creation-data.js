export const CREATION_CONFIG = {
    BASE_POINTS: 100,
    MAX_ADVANTAGES: 5,
    MAX_DISADVANTAGES: 3
};

export const CREATION_ROOTS = {
    'thien_linh_can': { id: 'thien_linh_can', name: 'Thiên Linh Căn', cost: 100, type: 'special', desc: 'Đơn linh căn thuần khiết nhất. Tốc độ tu luyện x4, tăng mạnh khả năng hấp thu.', bonus: { tvps: 4.0, qiAbsorb: 1.5, luck: 10 } },
    'di_linh_can': { id: 'di_linh_can', name: 'Dị Linh Căn', cost: 70, type: 'special', desc: 'Lôi/Băng/Phong... Tăng mạnh sát thương và tốc độ tu luyện x2.5.', bonus: { tvps: 2.5, atk: 25, qiAbsorb: 1.2 } },
    'song_linh_can': { id: 'song_linh_can', name: 'Song Linh Căn', cost: 30, type: 'normal', desc: 'Hai loại linh căn. Tốc độ tu luyện x1.8.', bonus: { tvps: 1.8 } },
    'tam_linh_can': { id: 'tam_linh_can', name: 'Tam Linh Căn', cost: 10, type: 'normal', desc: 'Ba loại linh căn. Tốc độ tu luyện x1.2.', bonus: { tvps: 1.2 } },
    'ngu_hanh_linh_can': { id: 'ngu_hanh_linh_can', name: 'Ngũ Hành Linh Căn', cost: 0, type: 'normal', desc: 'Đầy đủ ngũ hành. Tu luyện cân bằng nhưng chậm.', bonus: { tvps: 1.0, qiAbsorb: 1.1 } },
    'tap_linh_can': { id: 'tap_linh_can', name: 'Tạp Linh Căn', cost: -40, type: 'debuff', desc: 'Linh căn hỗn tạp. Tu luyện cực chậm nhưng ý chí bền bỉ, thọ nguyên dài.', bonus: { tvps: 0.5, maxHp: 80, maxAge: 50 } }
};

export const CREATION_PHYSIQUES = {
    'hoang_co_thanh_the': { id: 'hoang_co_thanh_the', name: 'Hoang Cổ Thánh Thể', cost: 150, desc: 'Thân thể mạnh nhất thế gian. HP, Phòng thủ cực cao và thọ nguyên vô biên.', bonus: { maxHp: 500, def: 50, maxAge: 500, qiAbsorb: 0.8 } },
    'tien_thien_dao_the': { id: 'tien_thien_dao_the', name: 'Tiên Thiên Đạo Thể', cost: 120, desc: 'Gần gũi đại đạo. Tăng mạnh tốc độ tu luyện, hấp thu linh khí và thần thức.', bonus: { tvps: 2.0, qiAbsorb: 2.0, luck: 20 } },
    'thai_duong_thanh_the': { id: 'thai_duong_thanh_the', name: 'Thái Dương Thánh Thể', cost: 90, desc: 'Mang trong mình sức mạnh của mặt trời. Tăng mạnh sát thương Hỏa.', bonus: { fireDmg: 2.0, atk: 50 } },
    'thien_ma_the': { id: 'thien_ma_the', name: 'Thiên Ma Thể', cost: 80, desc: 'Ma khí bẩm sinh, chiến lực tăng mạnh nhưng nghiệp lực sâu nặng.', bonus: { atk: 100, karma: -200, murderQi: 50 } },
    'thai_hu_hon_the': { id: 'thai_hu_hon_the', name: 'Thái Hư Hồn Thể', cost: 70, desc: 'Linh hồn cường đại, thần thức vô biên.', bonus: { soulExpSpeed: 2.0, critRate: 0.1 } },
    'loi_linh_the': { id: 'loi_linh_the', name: 'Lôi Linh Thể', cost: 50, desc: 'Sát thương lôi cực mạnh.', bonus: { thunderDmg: 2.0, spd: 20 } },
    'kim_cuong_bao_the': { id: 'kim_cuong_bao_the', name: 'Kim Cương Bảo Thể', cost: 40, desc: 'Phòng ngự cực mạnh.', bonus: { def: 100, maxHp: 200 } },
    'binh_thuong': { id: 'binh_thuong', name: 'Phàm Thể', cost: 0, desc: 'Cơ thể bình thường của con người.', bonus: {} }
};

export const CREATION_ORIGINS = {
    'tan_tu': { id: 'tan_tu', name: 'Tán Tu', cost: 0, desc: 'Tự do tự tại, không có tài nguyên khởi đầu.', resources: { lingShi: 100, items: [] }, monthlyResources: { lingShi: 0 } },
    'vo_gia_cu': { id: 'vo_gia_cu', name: 'Vô Gia Cư', cost: -20, desc: 'Không nơi nương tựa, bắt đầu với hai bàn tay trắng.', resources: { lingShi: 0, items: [] }, monthlyResources: { lingShi: 0 } },
    'no_nan': { id: 'no_nan', name: 'Nợ Nần Chồng Chất', cost: -50, desc: 'Gánh trên vai món nợ lớn của gia tộc.', resources: { lingShi: -500, items: [] }, monthlyResources: { lingShi: 0 } },
    'gia_toc': { id: 'gia_toc', name: 'Gia Tộc Tu Tiên', cost: 40, desc: 'Sinh ra trong gia tộc, có sẵn linh thạch và công pháp.', resources: { lingShi: 1000, items: ['truong_sinh_quyet_book'] }, monthlyResources: { lingShi: 100 } },
    'tong_mon': { id: 'tong_mon', name: 'Đệ Tử Tông Môn', cost: 60, desc: 'Được tông môn che chở, có pháp bảo phòng thân.', resources: { lingShi: 500, items: ['phi_kiem_go', 'ao_bo_so_cap'] }, monthlyResources: { lingShi: 50 } },
    'ma_dao': { id: 'ma_dao', name: 'Hậu Nhân Ma Đạo', cost: 30, desc: 'Công pháp bá đạo nhưng bị chính đạo truy quét.', resources: { lingShi: 500, items: ['huyet_don_thuat_book'], karma: -50 }, monthlyResources: { lingShi: 0 } },
    'dai_gia_toc': { id: 'dai_gia_toc', name: 'Đại Thế Gia', cost: 100, desc: 'Con cháu thế gia danh tiếng, tài lực dồi dào.', resources: { lingShi: 10000, items: ['ngung_khi_dan', 'ngung_khi_dan'] }, monthlyResources: { lingShi: 1000 } }
};

export const CREATION_TRAITS = {
    // Advantages
    'dai_khi_van': { id: 'dai_khi_van', name: 'Đại Khí Vận', cost: 60, type: 'advantage', desc: 'Vận khí cực tốt, dễ gặp kỳ ngộ.', bonus: { luck: 80, karma: 50 } },
    'kiem_dao_ky_tai': { id: 'kiem_dao_ky_tai', name: 'Kiếm Đạo Kỳ Tài', cost: 40, type: 'advantage', desc: 'Lĩnh ngộ kiếm pháp cực nhanh, tăng tỉ lệ bạo kích.', bonus: { atk: 20, critRate: 0.1, critDmg: 0.5 } },
    'di_hoa_tan_diem': { id: 'di_hoa_tan_diem', name: 'Dị Hỏa Tàn Diễm', cost: 40, type: 'advantage', desc: 'Mang theo ngọn lửa thần bí, hỗ trợ luyện đan.', bonus: { alchemySuccess: 0.25, fireDmg: 1.2 } },
    'thong_minh': { id: 'thong_minh', name: 'Thất Khiếu Linh Lung', cost: 30, type: 'advantage', desc: 'Thông minh bẩm sinh, tăng tốc độ học tập và thọ nguyên.', bonus: { tvps: 1.3, maxAge: 20 } },
    
    // Disadvantages
    'kinh_mach_tan_khuyet': { id: 'kinh_mach_tan_khuyet', name: 'Kinh Mạch Tàn Khuyết', cost: -80, type: 'disadvantage', desc: 'Kinh mạch bị tổn thương, tu luyện chậm.', bonus: { tvps: 0.5, qiAbsorb: 0.5 } },
    'thien_sat_co_tinh': { id: 'thien_sat_co_tinh', name: 'Thiên Sát Cô Tinh', cost: -70, type: 'disadvantage', desc: 'Khắc người thân, dễ gây thù hận, nghiệp lực sâu dày.', bonus: { luck: -70, karma: -200, murderQi: 100 } },
    'han_doc_nhap_the': { id: 'han_doc_nhap_the', name: 'Hàn Độc Nhập Thể', cost: -90, type: 'disadvantage', desc: 'Trúng độc từ nhỏ, HP và thọ nguyên bị ảnh hưởng.', bonus: { maxHp: -50, maxAge: -30, spd: -10 } },
    'bi_truy_sat': { id: 'bi_truy_sat', name: 'Bị Truy Sát', cost: -50, type: 'disadvantage', desc: 'Có cừu gia mạnh mẽ từ khi bắt đầu.', bonus: { atk: 10, karma: -50 } }
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
