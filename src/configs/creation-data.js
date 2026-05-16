export const CREATION_CONFIG = {
    BASE_POINTS: 150,
    MAX_ADVANTAGES: 5,
    MAX_DISADVANTAGES: 3
};

export const BLOODLINES = {
    'PHAM': { id: 'PHAM', name: 'Phàm Huyết', multiplier: 1.0 },
    'LINH': { id: 'LINH', name: 'Linh Huyết', multiplier: 1.5 },
    'DIA': { id: 'DIA', name: 'Địa Huyết', multiplier: 2.5 },
    'THIEN': { id: 'THIEN', name: 'Thiên Huyết', multiplier: 4.0 },
    'VUONG': { id: 'VUONG', name: 'Vương Huyết', multiplier: 6.5 },
    'HOANG': { id: 'HOANG', name: 'Hoàng Huyết', multiplier: 10.0 },
    'THANH': { id: 'THANH', name: 'Thánh Huyết', multiplier: 18.0 },
    'DE': { id: 'DE', name: 'Đế Huyết', multiplier: 35.0 },
    'TIEN_LINH': { id: 'TIEN_LINH', name: 'Tiên Linh Huyết', multiplier: 70.0 },
    'THAI_CO': { id: 'THAI_CO', name: 'Thái Cổ Huyết', multiplier: 150.0 }
};

export const TRANSFORMATION_STAGES = [
    'Chưa Khai Trí',
    'Khai Linh Trí',
    'Bán Hóa Hình',
    'Hoàn Toàn Hóa Hình',
    'Tiên Thiên Đạo Thể'
];

export const AWAKENING_STAGES = [
    'Chưa Thức Tỉnh',
    'Sơ Bộ Thức Tỉnh',
    'Tiểu Thành',
    'Đại Thành',
    'Phản Tổ',
    'Chân Linh Hóa'
];

export const DEMON_BLOODLINES = {
    'PHAM': { id: 'PHAM', name: 'Phàm Ma Huyết', multiplier: 1.0 },
    'CHAN': { id: 'CHAN', name: 'Chân Ma Huyết', multiplier: 1.8 },
    'THIEN': { id: 'THIEN', name: 'Thiên Ma Huyết', multiplier: 3.5 },
    'CO': { id: 'CO', name: 'Cổ Ma Huyết', multiplier: 7.0 },
    'THANH': { id: 'THANH', name: 'Thánh Ma Huyết', multiplier: 15.0 },
    'THAN': { id: 'THAN', name: 'Ma Thần Huyết', multiplier: 40.0 },
    'NGUYEN_SO': { id: 'NGUYEN_SO', name: 'Nguyên Sơ Ma Huyết', multiplier: 100.0 }
};

export const DEMON_FACTIONS = {
    'HUYET': { id: 'HUYET', name: 'Huyết Ma', focus: 'Hút máu & Hồi phục', bonus: { lifesteal: 0.15, hpRegen: 1.5 } },
    'THIEN': { id: 'THIEN', name: 'Thiên Ma', focus: 'Tâm ma & Thần hồn', bonus: { soulAtk: 0.2, innerDemonRes: -0.2 } },
    'COT': { id: 'COT', name: 'Cốt Ma', focus: 'Luyện xương & Bất tử', bonus: { def: 100, deathRes: 0.1 } },
    'ANH': { id: 'ANH', name: 'Ảnh Ma', focus: 'Ám sát & Không gian', bonus: { critDmg: 0.5, dodge: 0.1 } },
    'VIEM': { id: 'VIEM', name: 'Viêm Ma', focus: 'Ma hỏa & Hủy diệt', bonus: { fireDmg: 0.3, atk: 50 } }
};

export const DEMON_TRANSFORMATION = [
    'Bán Ma',
    'Ma Hóa',
    'Chân Ma Hóa',
    'Cổ Ma Chân Thân',
    'Ma Thần Thể'
];

export const DEMON_KARMA = [
    'Vô Nghiệp',
    'Tiểu Sát Nghiệp',
    'Huyết Sát',
    'Tu La Sát',
    'Diệt Thế Sát'
];

export const CREATION_RACES = {
    'HUMAN': { 
        id: 'HUMAN', name: 'Nhân Tộc', cost: 0, 
        desc: 'Linh hồn hoàn chỉnh nhất, thích hợp tu luyện mọi loại công pháp. Tốc độ lĩnh ngộ ổn định.', 
        bonus: { tvps: 1.0, soulExpSpeed: 1.1 } 
    },
    'YAO': { 
        id: 'YAO', name: 'Yêu Tộc', cost: 40, 
        desc: 'Hóa hình từ yêu thú, thân thể cực mạnh, thọ nguyên dài. Có khả năng thức tỉnh huyết mạch thần thú.', 
        bloodline: 'LINH',
        bonus: { maxHp: 500, def: 50, maxAge: 1000, tvps: 0.9 } 
    },
    'DEMON': { 
        id: 'DEMON', name: 'Ma Tộc', cost: 60, 
        desc: 'Chủng tộc của bản năng và sức mạnh hủy diệt. Tốc độ thăng tiến cực nhanh nhưng dễ bị tâm ma quấy phá.', 
        bloodline: 'CHAN',
        bonus: { atk: 150, tvps: 1.3, karma: -200, maxAge: 500 } 
    }
};

export const ROOT_RARITY = {
    'PHAM': { id: 'PHAM', name: 'Phàm', color: '#9ca3af', chance: 0.45, multiplier: 1.0 },
    'LINH': { id: 'LINH', name: 'Linh', color: '#4ade80', chance: 0.30, multiplier: 1.5 },
    'DIA': { id: 'DIA', name: 'Địa', color: '#3b82f6', chance: 0.15, multiplier: 2.2 },
    'THIEN': { id: 'THIEN', name: 'Thiên', color: '#ec4899', chance: 0.07, multiplier: 3.5 },
    'THANH': { id: 'THANH', name: 'Thánh', color: '#f59e0b', chance: 0.025, multiplier: 6.0 },
    'TIEN': { id: 'TIEN', name: 'Tiên', color: '#ffffff', chance: 0.005, multiplier: 12.0 }
};

export const CREATION_ROOTS = {
    'thien_linh_can': { 
        id: 'thien_linh_can', name: 'Thiên Linh Căn', cost: 100, type: 'special', quantity: 1,
        desc: 'Linh căn hoàn mỹ, chỉ một thuộc tính tinh thuần. Hấp thu linh khí gần như không hao tổn.', 
        bonus: { qiAbsorb: 2.0, breakthroughChance: 0.2, techniqueMastery: 1.5 } 
    },
    'di_linh_can': { 
        id: 'di_linh_can', name: 'Dị Linh Căn', cost: 70, type: 'special', quantity: 1,
        desc: 'Linh căn biến dị hiếm gặp (Lôi/Băng/Phong/Độc). Sức mạnh bộc phát cực mạnh.', 
        bonus: { qiAbsorb: 1.4, atk: 25, techniqueMastery: 1.3 } 
    },
    'don_linh_can': { 
        id: 'don_linh_can', name: 'Đơn Linh Căn', cost: 40, type: 'basic', quantity: 1,
        desc: 'Chỉ một thuộc tính tinh thuần. Tốc độ tu luyện vượt trội.', 
        bonus: { qiAbsorb: 1.2, techniqueMastery: 1.2 } 
    },
    'song_linh_can': { 
        id: 'song_linh_can', name: 'Song Linh Căn', cost: 30, type: 'basic', quantity: 2,
        desc: 'Hai thuộc tính chính. Linh hoạt trong việc chọn lựa công pháp.', 
        bonus: { qiAbsorb: 1.0, techniqueMastery: 1.1 } 
    },
    'tam_linh_can': { 
        id: 'tam_linh_can', name: 'Tam Linh Căn', cost: 10, type: 'basic', quantity: 3,
        desc: 'Ba loại linh căn. Tốc độ tu luyện trung bình nhưng đa dạng.', 
        bonus: { qiAbsorb: 0.8, techniqueMastery: 1.0 } 
    },
    'ngu_hanh_linh_can': { 
        id: 'ngu_hanh_linh_can', name: 'Ngũ Hành Linh Căn', cost: 0, type: 'basic', quantity: 5,
        desc: 'Đầy đủ ngũ hành. Chậm chạp ở giai đoạn đầu nhưng tiềm năng về sau vô hạn.', 
        bonus: { qiAbsorb: 0.6, techniqueMastery: 1.5, allRes: 0.1 } 
    },
    'tap_linh_can': { 
        id: 'tap_linh_can', name: 'Tạp Linh Căn', cost: -30, type: 'basic', quantity: 4,
        desc: 'Nhiều thuộc tính pha tạp, tu luyện gian nan, khó lòng tiến xa.', 
        bonus: { qiAbsorb: 0.4, breakthroughChance: -0.1, techniqueMastery: 0.7 } 
    }
};

export const SECONDARY_TALENTS = {
    'comprehension': { id: 'comprehension', name: 'Ngộ Tính', desc: 'Ảnh hưởng tốc độ lĩnh ngộ công pháp và hiệu quả tu luyện.' },
    'luck': { id: 'luck', name: 'Khí Vận', desc: 'Ảnh hưởng tỷ lệ gặp kỳ ngộ hiếm và may mắn trong chiến đấu.' },
    'daoTam': { id: 'daoTam', name: 'Đạo Tâm', desc: 'Kháng tâm ma, ổn định linh lực khi đột phá.' },
    'divineSense': { id: 'divineSense', name: 'Thần Thức', desc: 'Khả năng khống chế pháp bảo và thám sai bí cảnh.' },
    'physique': { id: 'physique', name: 'Căn Cốt', desc: 'Ảnh hưởng HP, thể lực và sức chống chịu nhục thân.' }
};

export const ROOT_ELEMENTS = {
    'Kim': { 
        id: 'Kim', name: 'Kim', color: '#ffd700', icon: '⚔️',
        orientation: 'Công kích, Sắc bén',
        bonus: { atk: 50, critRate: 0.05, armorPen: 0.1 } 
    },
    'Mộc': { 
        id: 'Mộc', name: 'Mộc', color: '#4ade80', icon: '🌿',
        orientation: 'Sinh mệnh, Hồi phục',
        bonus: { maxHp: 200, hpRegen: 10, poisonRes: 0.2 } 
    },
    'Thủy': { 
        id: 'Thủy', name: 'Thủy', color: '#3b82f6', icon: '💧',
        orientation: 'Mềm dẻo, Khống chế',
        bonus: { maxMana: 300, avoidRate: 0.05, crowdControl: 0.1 } 
    },
    'Hỏa': { 
        id: 'Hỏa', name: 'Hỏa', color: '#f87171', icon: '🔥',
        orientation: 'Bộc phát, Hủy diệt',
        bonus: { skillDmg: 0.15, fireDmg: 1.5, spd: 20 } 
    },
    'Thổ': { 
        id: 'Thổ', name: 'Thổ', color: '#a855f7', icon: '⛰️',
        orientation: 'Phòng ngự, Ổn định',
        bonus: { def: 40, maxHp: 300, statusRes: 0.15 } 
    }
};

export const SPECIAL_ELEMENTS = {
    'Lôi': { 
        id: 'Lôi', name: 'Lôi', color: '#fbbf24', icon: '⚡',
        orientation: 'Tốc độ, Bạo phát',
        bonus: { spd: 50, critRate: 0.1, thunderDmg: 2.5 } 
    },
    'Băng': { 
        id: 'Băng', name: 'Băng', color: '#60a5fa', icon: '❄️',
        orientation: 'Đóng băng, Khống chế',
        bonus: { def: 60, waterDmg: 2.0, iceControl: 0.2 } 
    },
    'Phong': { 
        id: 'Phong', name: 'Phong', color: '#94a3b8', icon: '🌪️',
        orientation: 'Né tránh, Ám sát',
        bonus: { avoidRate: 0.15, spd: 80, critDmg: 0.3 } 
    },
    'Độc': { 
        id: 'Độc', name: 'Độc', color: '#c084fc', icon: '☠️',
        orientation: 'Nguyền rủa, Hấp thụ',
        bonus: { poisonDmg: 2.0, lifesteal: 0.1, dotDmg: 0.2 } 
    }
};

export const CREATION_PHYSIQUES = {
    'hoang_co_thanh_the': { id: 'hoang_co_thanh_the', name: 'Hoang Cổ Thánh Thể', cost: 120, desc: 'Thân thể mạnh nhất thế gian. HP, Phòng thủ cực cao và thọ nguyên vô biên.', bonus: { maxHp: 500, def: 50, maxAge: 500, qiAbsorb: 0.8 } },
    'tien_thien_dao_the': { id: 'tien_thien_dao_the', name: 'Tiên Thiên Đạo Thể', cost: 100, desc: 'Gần gũi đại đạo. Tăng mạnh tốc độ tu luyện, hấp thu linh khí và thần thức.', bonus: { tvps: 2.0, qiAbsorb: 2.0, luck: 20 } },
    'thai_duong_thanh_the': { id: 'thai_duong_thanh_the', name: 'Thái Dương Thánh Thể', cost: 90, desc: 'Mang trong mình sức mạnh của mặt trời. Tăng mạnh sát thương Hỏa.', bonus: { fireDmg: 2.0, atk: 50 } },
    'thien_ma_the': { id: 'thien_ma_the', name: 'Thiên Ma Thể', cost: 80, desc: 'Ma khí bẩm sinh, chiến lực tăng mạnh nhưng nghiệp lực sâu nặng.', bonus: { atk: 100, karma: -200, murderQi: 50 } },
    'thai_hu_hon_the': { id: 'thai_hu_hon_the', name: 'Thái Hư Hồn Thể', cost: 70, desc: 'Linh hồn cường đại, thần thức vô biên.', bonus: { soulExpSpeed: 2.0, critRate: 0.1 } },
    'loi_linh_the': { id: 'loi_linh_the', name: 'Lôi Linh Thể', cost: 50, desc: 'Sát thương lôi cực mạnh.', bonus: { thunderDmg: 2.0, spd: 20 } },
    'kim_cuong_bao_the': { id: 'kim_cuong_bao_the', name: 'Kim Cương Bảo Thể', cost: 40, desc: 'Phòng ngự cực mạnh.', bonus: { def: 100, maxHp: 200 } },
    'hon_don_the': { id: 'hon_don_the', name: 'Hỗn Độn Thể', cost: 300, desc: 'Thể chất mạnh nhất, dung hợp vạn pháp.', bonus: { tvps: 15.0, atk: 1000 } },
    'tien_thien_thanh_the_dao_thai': { id: 'tien_thien_thanh_the_dao_thai', name: 'Thánh Thể Đạo Thai', cost: 400, desc: 'Thiên sinh cận Đạo, tu luyện cực tốc.', bonus: { tvps: 12.0, qiAbsorb: 8.0 } },
    'vinh_hang_tien_the': { id: 'vinh_hang_tien_the', name: 'Vĩnh Hằng Tiên Thể', cost: 350, desc: 'Bất tử bất diệt, thọ nguyên vô hạn.', bonus: { maxAge: 10000, maxHp: 20000 } },
    'hong_mong_dao_the': { id: 'hong_mong_dao_the', name: 'Hồng Mông Đạo Thể', cost: 300, desc: 'Khí Hồng Mông hộ thể, vạn tà bất xâm.', bonus: { allRes: 0.5, luck: 100 } },
    'than_vuong_the': { id: 'than_vuong_the', name: 'Thần Vương Thể', cost: 200, desc: 'Vương giả thiên sinh, trấn áp vạn vạn vật.', bonus: { atk: 500, spd: 100 } },
    'thuong_thien_phach_the': { id: 'thuong_thien_phach_the', name: 'Thương Thiên Phách Thể', cost: 200, desc: 'Bá đạo vô song, chiến ý ngợp trời.', bonus: { atk: 800, critDmg: 1.5 } },
    'luan_hoi_the': { id: 'luan_hoi_the', name: 'Luân Hồi Thể', cost: 250, desc: 'Chấp chưởng sinh tử, luân hồi bất diệt.', bonus: { soulExpSpeed: 4.0, karma: 500 } },
    'van_menh_hu_vo': { id: 'van_menh_hu_vo', name: 'Vận Mệnh Hư Vô Giả', cost: 300, desc: 'Biến số thiên địa, nhân quả bất dính.', bonus: { luck: 500, spd: 200 } },
    'thon_thien_the': { id: 'thon_thien_the', name: 'Thôn Thiên Thể', cost: 180, desc: 'Thôn phệ vạn vật để cường hóa bản thân.', bonus: { qiAbsorb: 15.0, tvps: 5.0 } },
    'tu_la_huyet_the': { id: 'tu_la_huyet_the', name: 'Tu La Huyết Thể', cost: 180, desc: 'Sát lục thành đạo, chiến lực cực cao.', bonus: { atk: 1000, murderQi: 500 } },
    'thai_am_tien_the': { id: 'thai_am_tien_the', name: 'Thái Âm Tiên Thể', cost: 150, desc: 'Cực âm chi chủ, đông cứng vạn pháp.', bonus: { waterDmg: 3.0, spd: 150 } },
    'hu_khong_the': { id: 'hu_khong_the', name: 'Hư Không Thể', cost: 120, desc: 'Hành giả không gian, vạn pháp bất khả chạm.', bonus: { spd: 300, avoidRate: 0.3 } },
    'thien_loi_the': { id: 'thien_loi_the', name: 'Thiên Lôi Chi Thể', cost: 100, desc: 'Lôi phạt hóa thân, điều khiển thiên kiếp.', bonus: { thunderDmg: 2.5, tvps: 3.0 } },
    'hoa_linh_the': { id: 'hoa_linh_the', name: 'Hỏa Linh Thể', cost: 30, desc: 'Tăng mạnh hấp thu linh khí hỏa hệ.', bonus: { fireDmg: 1.2 } },
    'thuy_linh_the': { id: 'thuy_linh_the', name: 'Thủy Linh Thể', cost: 30, desc: 'Tăng mạnh hấp thu linh khí thủy hệ.', bonus: { waterDmg: 1.2 } },
    'ba_vuong_chien_the': { id: 'ba_vuong_chien_the', name: 'Bá Vương Chiến Thể', cost: 100, desc: 'Chiến đấu thiên bẩm, càng đánh càng mạnh.', bonus: { atk: 100, critRate: 0.1 } },
    'truong_sinh_the': { id: 'truong_sinh_the', name: 'Trường Sinh Thể', cost: 60, desc: 'Sinh mệnh lực dồi dào, thọ nguyên cực dài.', bonus: { maxAge: 500, maxHp: 500 } },
    'dau_chien_thanh_the': { id: 'dau_chien_thanh_the', name: 'Đấu Chiến Thánh Thể', cost: 150, desc: 'Uy áp thiên hạ, chiến thần bất bại.', bonus: { atk: 300, spd: 50 } },
    'chan_long_the': { id: 'chan_long_the', name: 'Chân Long Thể', cost: 300, desc: 'Huyết mạch Chân Long, thân thể cường hãn.', bonus: { maxHp: 10000, atk: 1000 } },
    'tuyet_mach_phe_the': { id: 'tuyet_mach_phe_the', name: 'Tuyệt Mạch Phế Thể', cost: -50, desc: 'Kinh mạch bế tắc, tu luyện gian nan nhưng ẩn chứa bí mật.', bonus: { tvps: 0.1, luck: 300, comprehension: 5 } },
    'binh_thuong': { id: 'binh_thuong', name: 'Phàm Thể', cost: 0, desc: 'Cơ thể bình thường của con người.', bonus: {} }
};

export const CREATION_ORIGINS = {
    'tan_tu': { id: 'tan_tu', name: 'Tán Tu', cost: 0, desc: 'Tự do tự tại, không có tài nguyên khởi đầu.', resources: { lingShi: 100, items: [] }, monthlyResources: { lingShi: 0 } },
    'vo_gia_cu': { id: 'vo_gia_cu', name: 'Vô Gia Cư', cost: -20, desc: 'Không nơi nương tựa, bắt đầu với hai bàn tay trắng.', resources: { lingShi: 0, items: [] }, monthlyResources: { lingShi: 0 } },
    'no_nan': { id: 'no_nan', name: 'Nợ Nần Chồng Chất', cost: -50, desc: 'Gánh trên vai món nợ lớn của gia tộc.', resources: { lingShi: -500, items: [] }, monthlyResources: { lingShi: 0 } },
    'gia_toc': { id: 'gia_toc', name: 'Gia Tộc Tu Tiên', cost: 40, desc: 'Sinh ra trong gia tộc, có sẵn linh thạch và công pháp.', resources: { lingShi: 1000, items: ['truong_sinh_quyet_book', 'di_hoa_bang', 'di_loi_bang', 'linh_the_luc'] }, monthlyResources: { lingShi: 100 } },
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
    'kinh_mach_tan_khuyet': { id: 'kinh_mach_tan_khuyet', name: 'Kinh Mạch Tàn Khuyết', cost: -100, type: 'disadvantage', desc: 'Kinh mạch bị tổn thương, tu luyện chậm.', bonus: { tvps: 0.5, qiAbsorb: 0.5 } },
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

export const CREATION_ARTIFACTS = {
    'chuong_thien_binh': {
        id: 'chuong_thien_binh', name: 'Chưởng Thiên Bình', cost: 150,
        desc: 'Bình thần hấp thụ tinh hoa nhật nguyệt, sinh linh dịch thúc đẩy linh thảo trưởng thành nhanh chóng.',
        rarity: 'Danh Khí'
    },
    'hu_thien_dinh': {
        id: 'hu_thien_dinh', name: 'Hư Thiên Đỉnh', cost: 150,
        desc: 'Bên trong chứa không gian bí ẩn, có thể trấn áp vạn pháp, luyện hóa vạn vật.',
        rarity: 'Danh Khí'
    },
    'vo_dinh_tieu_dao_cam': {
        id: 'vo_dinh_tieu_dao_cam', name: 'Vô Định Tiêu Dao Cầm', cost: 150,
        desc: 'Tiếng đàn có thể tàng hình sơn hà, giúp đạo hữu tiêu diêu tự tại giữa trời đất.',
        rarity: 'Danh Khí'
    },
    'van_tinh_nho_quan': {
        id: 'van_tinh_nho_quan', name: 'Văn Tinh Nho Quán', cost: 150,
        desc: 'Mũ nho sĩ chứa hạo nhiên chính khí, giúp tăng ngộ tính và trấn áp tà ma.',
        rarity: 'Danh Khí'
    },
    'that_thai_huyen_nghien': {
        id: 'that_thai_huyen_nghien', name: 'Thất Thái Huyền Nghiên', cost: 150,
        desc: 'Nghiên mực bảy màu, giúp tăng tốc độ tu luyện và lĩnh ngộ thiên đạo.',
        rarity: 'Danh Khí'
    },
    'te_hon_toa': {
        id: 'te_hon_toa', name: 'Tế Hồn Tỏa', cost: 150,
        desc: 'Xiềng xích tế hồn, tăng mạnh khả năng xuyên thấu linh hồn và hút máu.',
        rarity: 'Danh Khí'
    },
    'luyen_phong_thach': {
        id: 'luyen_phong_thach', name: 'Luyện Phong Thạch', cost: 150,
        desc: 'Viên đá luyện từ cuồng phong, tăng mạnh công kích và tốc độ độn thuật.',
        rarity: 'Danh Khí'
    },
    'kim_than_xa_loi': {
        id: 'kim_than_xa_loi', name: 'Kim Thân Xá Lợi', cost: 150,
        desc: 'Hạt xá lợi vạn pháp bất xâm, tăng mạnh phòng thủ và sinh mệnh.',
        rarity: 'Danh Khí'
    },
    'duong_kiem_ho': {
        id: 'duong_kiem_ho', name: 'Dưỡng Kiếm Hồ', cost: 150,
        desc: 'Bầu rượu dưỡng kiếm, tăng mạnh tỉ lệ bạo kích và sát thương bạo kích.',
        rarity: 'Danh Khí'
    },
    'cuu_mach_linh_cham': {
        id: 'cuu_mach_linh_cham', name: 'Cửu Mạch Linh Châm', cost: 150,
        desc: 'Châm thần nghịch chuyển âm dương, có khả năng hồi thiên tục mệnh.',
        rarity: 'Danh Khí'
    },
    'co_luyen_lung': {
        id: 'co_luyen_lung', name: 'Cổ Luyện Lũng', cost: 150,
        desc: 'Lồng nuôi cổ trùng, tăng mạnh sát khí và kháng độc tố.',
        rarity: 'Danh Khí'
    },
    'chan_vu_nho_quan': {
        id: 'chan_vu_nho_quan', name: 'Chân Vũ Nho Quán', cost: 150,
        desc: 'Bản hoàn thiện của Chân Vũ Nho Quán, cung cấp phòng ngự tuyệt đối.',
        rarity: 'Danh Khí'
    },
    'bo_thien_lang': {
        id: 'bo_thien_lang', name: 'Bộ Thiên Lăng', cost: 150,
        desc: 'Dải lụa bước lên trời, tăng mạnh tốc độ và vận khí.',
        rarity: 'Danh Khí'
    },
    'phong_loi_si': {
        id: 'phong_loi_si', name: 'Phong Lôi Sí', cost: 150,
        desc: 'Đôi cánh Phong Lôi, mang lại tốc độ độn thuật vô song.',
        rarity: 'Danh Khí'
    }
};
