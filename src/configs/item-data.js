// --- Hệ Thống Phẩm Cấp Pháp Bảo ---
// 1. Phàm Phẩm
// 2. Hoàng Phẩm
// 3. Huyền Phẩm
// 4. Địa Phẩm
// 5. Thiên Phẩm
// 6. Linh Bảo
// 7. Thông Thiên Linh Bảo
// 8. Tiên Khí
// 9. Thánh Khí
// 10. Đạo Khí

export const ITEMS = {
    // Tiêu hao
    'ngung_khi_dan': {
        id: 'ngung_khi_dan',
        name: 'Ngưng Khí Đan',
        type: 'consumable',
        icon: '💊',
        quality: 'Hoàng',
        price: 150,
        description: 'Tăng 500 linh khí ngay lập tức.',
        effect: { type: 'tu_vi', value: 500 }
    },
    'linh_thao_thap': {
        id: 'linh_thao_thap',
        name: 'Linh Thảo Hạ Phẩm',
        type: 'material',
        icon: '🌿',
        quality: 'Phàm',
        price: 20,
        description: 'Linh thảo chứa ít linh khí, thường thấy ở các bìa rừng.'
    },
    'linh_thao_trung': {
        id: 'linh_thao_trung',
        name: 'Linh Thảo Trung Phẩm',
        type: 'material',
        icon: '🍃',
        quality: 'Huyền',
        price: 100,
        description: 'Linh thảo có dược tính ổn định, thích hợp luyện đan bậc trung.'
    },
    'truc_co_dan': {
        id: 'truc_co_dan',
        name: 'Trúc Cơ Đan',
        type: 'consumable',
        quality: 'Huyền',
        icon: '💎',
        description: 'Đan dược chí bảo giúp phàm nhân đúc thành đạo cơ.',
        price: 5000,
        stats: { breakthroughRate: 0.3 }
    },
    'bo_nguyen_dan': {
        id: 'bo_nguyen_dan',
        name: 'Bổ Nguyên Đan',
        type: 'consumable',
        quality: 'Huyền',
        icon: '🍶',
        price: 450,
        description: 'Đan dược bồi bổ nguyên khí, hồi phục 100 Khí Huyết và 50 Linh Lực.',
        effect: { type: 'restore', hp: 100, mana: 50 }
    },
    'thuy_tinh': {
        id: 'thuy_tinh',
        name: 'Thủy Tinh Linh Khoáng',
        type: 'material',
        icon: '💠',
        quality: 'Hoàng',
        price: 200,
        description: 'Một loại khoáng thạch chứa thủy tính linh lực.'
    },
    'ma_thach': {
        id: 'ma_thach',
        name: 'Ma Thạch Hạ Phẩm',
        type: 'material',
        icon: '🌑',
        quality: 'Huyền',
        price: 350,
        description: 'Đá chứa ma khí loãng, dùng cho các loại đan dược đặc thù.'
    },
    'thanh_hong_kiem': {
        id: 'thanh_hong_kiem',
        name: 'Thanh Hồng Kiếm',
        type: 'weapon',
        quality: 'Huyền',
        icon: '⚔️',
        description: 'Thanh kiếm tỏa ra ánh sáng xanh lục, sắc bén vô cùng.',
        price: 1500,
        stats: { atk: 50, spd: 5 }
    },
    'thanh_tam_dan': {
        id: 'thanh_tam_dan',
        name: 'Thanh Tâm Đan',
        type: 'consumable',
        icon: '🧊',
        quality: 'Huyền',
        price: 200,
        description: 'Hồi phục 50% HP ngay lập tức.',
        effect: { type: 'heal', value: 0.5 }
    },

    // Trang bị
    'phi_kiem_go': {
        id: 'phi_kiem_go',
        name: 'Phi Kiếm Gỗ',
        type: 'weapon',
        quality: 'Phàm',
        icon: '🗡️',
        description: 'Kiếm gỗ dành cho đệ tử nhập môn, sát thương không đáng kể.',
        price: 50,
        stats: { atk: 5 }
    },
    'ao_bo_so_cap': {
        id: 'ao_bo_so_cap',
        name: 'Áo Bố Sơ Cấp',
        type: 'armor',
        quality: 'Phàm',
        icon: '👘',
        description: 'Áo vải thô sơ, chỉ có tác dụng che thân.',
        price: 30,
        stats: { def: 2 }
    },
    'nhan_dong_nat': {
        id: 'nhan_dong_nat',
        name: 'Nhẫn Đồng Nát',
        type: 'accessory',
        quality: 'Phàm',
        icon: '💍',
        description: 'Một chiếc nhẫn bằng đồng cũ kỹ.',
        price: 80,
        stats: { spd: 1 }
    },
    'tui_tru_vat_so': {
        id: 'tui_tru_vat_so',
        name: 'Túi Trữ Vật (Sơ)',
        type: 'bag',
        icon: '🎒',
        quality: 'Hoàng',
        price: 500,
        description: 'Mở rộng thêm 10 ô chứa đồ.',
        stats: { slots: 10 }
    },
    'seed_linh_thao': {
        id: 'seed_linh_thao',
        name: 'Hạt Giống Linh Thảo',
        type: 'seed',
        icon: '🌱',
        quality: 'Phàm',
        price: 5,
        description: 'Dùng để gieo trồng trong Linh Điền.'
    },
    'seed_linh_thao_trung': {
        id: 'seed_linh_thao_trung',
        name: 'Hạt Giống Linh Thảo Trung Cấp',
        type: 'seed',
        icon: '🌿',
        quality: 'Huyền',
        price: 25,
        description: 'Hạt giống linh thảo cấp trung, cần thời gian gieo trồng lâu hơn.'
    },
    'hoi_huyet_dan': {
        id: 'hoi_huyet_dan',
        name: 'Hồi Huyết Đan',
        type: 'consumable',
        icon: '🧪',
        quality: 'Phàm',
        price: 50,
        description: 'Thuốc cầm máu cơ bản, hồi phục 20% HP.',
        effect: { type: 'heal', value: 0.2 }
    },

    // --- SPIRITUAL STONES ---
    'ling_thach_ha': {
        id: 'ling_thach_ha',
        name: 'Hạ Phẩm Linh Thạch',
        type: 'currency',
        icon: '💎',
        quality: 'Phàm',
        price: 1,
        description: 'Linh thạch phổ thông nhất, dùng cho giao dịch và tu luyện sơ cấp.'
    },
    'ling_thach_trung': {
        id: 'ling_thach_trung',
        name: 'Trung Phẩm Linh Thạch',
        type: 'currency',
        icon: '💠',
        quality: 'Huyền',
        price: 100,
        description: 'Linh khí tinh thuần, 1 viên tương đương 100 Hạ Phẩm.'
    },
    'ling_thach_thuong': {
        id: 'ling_thach_thuong',
        name: 'Thượng Phẩm Linh Thạch',
        type: 'currency',
        icon: '🔮',
        quality: 'Thiên',
        price: 10000,
        description: 'Linh lực đậm đặc, dùng trong các giao dịch đấu giá hoặc đột phá.'
    },
    'ling_thach_cuc': {
        id: 'ling_thach_cuc',
        name: 'Cực Phẩm Linh Thạch',
        type: 'currency',
        icon: '🌌',
        quality: 'Thần',
        price: 1000000,
        description: 'Cực kỳ hiếm thấy, chứa đựng linh lực hóa lỏng vô tận.'
    },

    // --- DHARMA TREASURES (PHÁP BẢO) ---
    'phi_kiem_thanh_tuyen': {
        id: 'phi_kiem_thanh_tuyen',
        name: 'Thanh Tuyền Kiếm',
        type: 'weapon',
        quality: 'Hoàng',
        icon: '🗡️',
        description: 'Phi kiếm cấp thấp, tăng nhẹ công kích và tốc độ.',
        price: 800,
        stats: { atk: 25, spd: 3 }
    },
    'bat_quai_kinh': {
        id: 'bat_quai_kinh',
        name: 'Bát Quái Kính',
        type: 'treasure',
        quality: 'Huyền',
        icon: '🪞',
        description: 'Phòng ngự pháp bảo, tạo lớp chắn linh khí giảm sát thương.',
        price: 2500,
        stats: { def: 40, resistance: 0.1 }
    },
    'u_minh_chuong': {
        id: 'u_minh_chuong',
        name: 'U Minh Chuông',
        type: 'treasure',
        quality: 'Địa',
        icon: '🔔',
        description: 'Hồn hệ pháp bảo, tăng mạnh Thần Thức và kháng ảo cảnh.',
        price: 12000,
        stats: { soul: 150, def: 20 }
    },
    'tui_tru_vat_trung': {
        id: 'tui_tru_vat_trung',
        name: 'Túi Trữ Vật (Trung)',
        type: 'bag',
        icon: '🎒',
        quality: 'Huyền',
        price: 2500,
        description: 'Mở rộng thêm 20 ô chứa đồ.',
        stats: { slots: 20 }
    },

    // --- FORMATIONS (TRẬN PHÁP) ---
    'tran_do_tu_linh': {
        id: 'tran_do_tu_linh',
        name: 'Tụ Linh Trận Đồ',
        type: 'formation',
        icon: '📜',
        quality: 'Hoàng',
        price: 1000,
        description: 'Trận đồ cơ bản dùng để tụ tập linh khí xung quanh.'
    },
    'tran_do_ao_anh': {
        id: 'tran_do_ao_anh',
        name: 'Ảo Ảnh Trận Đồ',
        type: 'formation',
        icon: '🌫️',
        quality: 'Huyền',
        price: 4500,
        description: 'Tạo huyễn cảnh che mắt đối thủ.'
    },

    // --- TALISMAN PAPERS (GIẤY PHÙ) ---
    'hoang_chi_phu': {
        id: 'hoang_chi_phu',
        name: 'Hoàng Chỉ Phù',
        type: 'talisman_paper',
        icon: '📄',
        quality: 'Phàm',
        price: 10,
        description: 'Giấy phù phổ thông, dùng cho phù lục sơ cấp.'
    },
    'linh_moc_phu': {
        id: 'linh_moc_phu',
        name: 'Linh Mộc Phù Chỉ',
        type: 'talisman_paper',
        icon: '🪵',
        quality: 'Hoàng',
        price: 50,
        description: 'Làm từ gỗ linh mộc, tăng độ ổn định khi vẽ phù.'
    },
    'yeu_thu_da_phu': {
        id: 'yeu_thu_da_phu',
        name: 'Yêu Thú Da Phù',
        type: 'talisman_paper',
        icon: '📜',
        quality: 'Huyền',
        price: 250,
        description: 'Làm từ da yêu thú, tăng uy lực cho phù công kích.'
    },

    // --- SPIRIT INKS (MỰC PHÙ) ---
    'chu_sa_muc': {
        id: 'chu_sa_muc',
        name: 'Chu Sa Linh Mực',
        type: 'talisman_ink',
        icon: '🩸',
        quality: 'Phàm',
        price: 20,
        description: 'Mực chu sa chứa linh lực loãng, dùng vẽ phù cơ bản.'
    },
    'yeu_huyet_muc': {
        id: 'yeu_huyet_muc',
        name: 'Yêu Huyết Mực',
        type: 'talisman_ink',
        icon: '🧪',
        quality: 'Huyền',
        price: 150,
        description: 'Pha trộn từ máu yêu thú, tăng sát thương cho phù lục.'
    },

    // --- TALISMAN PENS (PHÙ BÚT) ---
    'truc_phu_but': {
        id: 'truc_phu_but',
        name: 'Trúc Phù Bút',
        type: 'talisman_pen',
        icon: '🖌️',
        quality: 'Hoàng',
        price: 500,
        description: 'Bút vẽ phù làm từ linh trúc, tăng tỷ lệ thành công thêm 5%.',
        stats: { successRate: 0.05 }
    },

    // --- FINISHED TALISMANS (PHÙ LỤC THÀNH PHẨM) ---
    'hoa_cau_phu': {
        id: 'hoa_cau_phu',
        name: 'Hỏa Cầu Phù',
        type: 'talisman',
        icon: '🔥',
        quality: 'Phàm',
        price: 100,
        description: 'Triệu hồi hỏa cầu tấn công, gây sát thương Hỏa.',
        effect: { type: 'damage', value: 200, element: 'fire' }
    },
    'kim_cuong_phu': {
        id: 'kim_cuong_phu',
        name: 'Kim Cương Phù',
        type: 'talisman',
        icon: '🛡️',
        quality: 'Hoàng',
        price: 350,
        description: 'Tạo lớp bảo vệ cứng như kim cương, tăng 100 DEF trong 3 lượt.',
        effect: { type: 'buff', stat: 'def', value: 100, duration: 3 }
    },
    'than_hanh_phu': {
        id: 'than_hanh_phu',
        name: 'Thần Hành Phù',
        type: 'talisman',
        icon: '👟',
        quality: 'Hoàng',
        price: 200,
        description: 'Tăng tốc độ di chuyển cực nhanh trong thời gian ngắn.',
        effect: { type: 'utility', speedBoost: 2.0, duration: 60 } // seconds
    },
    'thun_di_phu': {
        id: 'thun_di_phu',
        name: 'Thuấn Di Phù',
        type: 'talisman',
        icon: '⚡',
        quality: 'Huyền',
        price: 2000,
        description: 'Dịch chuyển tức thời thoát khỏi nguy hiểm.',
        effect: { type: 'escape' }
    },

    // --- TALISMAN TECHNIQUES (BÍ PHÁP) ---
    'thien_loi_phu_quyen': {
        id: 'thien_loi_phu_quyen',
        name: 'Thiên Lôi Phù Quyển',
        type: 'talisman_recipe',
        icon: '⚡',
        quality: 'Thiên',
        price: 45000,
        description: 'Ghi chép cách vẽ Thiên Lôi Phù, uy lực kinh thiên động địa.'
    },

    // --- ALCHEMY MATERIALS (EXPANDED) ---
    'linh_thao_10y': {
        id: 'linh_thao_10y',
        name: 'Linh Thảo (10 năm)',
        type: 'material',
        icon: '🌿',
        quality: 'Hoàng',
        price: 80,
        description: 'Linh thảo đã có chút hỏa hầu, dược tính ổn định.'
    },
    'linh_thao_100y': {
        id: 'linh_thao_100y',
        name: 'Linh Thảo (100 năm)',
        type: 'material',
        icon: '🍃',
        quality: 'Huyền',
        price: 500,
        description: 'Linh thảo trăm năm, chứa đựng linh khí đậm đặc.'
    },
    'linh_thao_1000y': {
        id: 'linh_thao_1000y',
        name: 'Linh Thảo (1000 năm)',
        type: 'material',
        icon: '🎋',
        quality: 'Địa',
        price: 5000,
        description: 'Linh thảo ngàn năm, hiếm có khó tìm, dùng luyện cao cấp đan dược.'
    },

    // --- MONSTER MATERIALS ---
    'yeu_dan_so': {
        id: 'yeu_dan_so',
        name: 'Yêu Đan Sơ Cấp',
        type: 'material',
        icon: '🟡',
        quality: 'Hoàng',
        price: 300,
        description: 'Nội đan của yêu thú cấp thấp, chứa tinh hoa yêu lực.'
    },
    'yeu_huyet': {
        id: 'yeu_huyet',
        name: 'Yêu Thú Tinh Huyết',
        type: 'material',
        icon: '🩸',
        quality: 'Hoàng',
        price: 100,
        description: 'Máu tươi của yêu thú, dùng trong luyện thể hoặc luyện đan.'
    },

    // --- ORES & MINERALS ---
    'hoa_tinh_thach': {
        id: 'hoa_tinh_thach',
        name: 'Hỏa Tinh Thạch',
        type: 'material',
        icon: '🔥',
        quality: 'Huyền',
        price: 1200,
        description: 'Khoáng thạch chứa hỏa tính cực mạnh.'
    },
    'han_ngoc_tuy': {
        id: 'han_ngoc_tuy',
        name: 'Hàn Ngọc Tủy',
        type: 'material',
        icon: '❄️',
        quality: 'Địa',
        price: 8500,
        description: 'Tinh túy từ hàn ngọc vạn năm, lạnh thấu xương.'
    },

    // --- ALCHEMY TOOLS (AS ITEMS) ---
    'huyen_lu_item': {
        id: 'huyen_lu_item',
        name: 'Huyền Thiết Trọng Lư',
        type: 'cauldron',
        icon: '🏺',
        quality: 'Huyền',
        price: 5000,
        description: 'Đan lư đúc từ huyền thiết, giúp ổn định hỏa lực.'
    },
    'thanh_lien_hoa_seed': {
        id: 'thanh_lien_hoa_seed',
        name: 'Thanh Liên Địa Tâm Hỏa (Chủng)',
        type: 'flame',
        icon: '🔥',
        quality: 'Địa',
        price: 50000,
        description: 'Hỏa chủng của Thanh Liên Địa Tâm Hỏa, có thể luyện hóa thành linh hỏa.'
    },

    // --- TECHNIQUES (CÔNG PHÁP) ---
    'truong_sinh_quyet': {
        id: 'truong_sinh_quyet',
        name: 'Trường Sinh Quyết',
        type: 'technique',
        icon: '📖',
        quality: 'Hoàng',
        price: 500,
        description: 'Công pháp cơ bản giúp gia tăng thọ nguyên và thể chất.'
    },
    'thien_loi_kiem_quyet': {
        id: 'thien_loi_kiem_quyet',
        name: 'Thiên Lôi Kiếm Quyết',
        type: 'technique',
        icon: '⚡',
        quality: 'Thiên',
        price: 50000,
        description: 'Kiếm quyết cấp cao mượn lực thiên lôi, uy lực vô song.'
    },

    // --- SMITHING MATERIALS (LINH QUẶNG & DỊ KIM) ---
    'huyen_thiet': {
        id: 'huyen_thiet',
        name: 'Huyền Thiết',
        type: 'material',
        icon: '🧱',
        quality: 'Hoàng',
        price: 200,
        description: 'Quặng sắt nặng chứa linh khí, nguyên liệu cơ bản luyện khí.'
    },
    'tinh_kim': {
        id: 'tinh_kim',
        name: 'Tinh Kim',
        type: 'material',
        icon: '✨',
        quality: 'Huyền',
        price: 1500,
        description: 'Kim loại tinh khiết, dẫn linh lực cực tốt.'
    },
    'thai_duong_than_kim': {
        id: 'thai_duong_than_kim',
        name: 'Thái Dương Thần Kim',
        type: 'material',
        icon: '🌞',
        quality: 'Thiên',
        price: 150000,
        description: 'Vật liệu chí dương, sinh ra từ lõi mặt trời.'
    },

    // --- SPIRIT WOOD (LINH MỘC) ---
    'loi_kich_moc': {
        id: 'loi_kich_moc',
        name: 'Lôi Kích Mộc',
        type: 'material',
        icon: '🪵',
        quality: 'Địa',
        price: 12000,
        description: 'Gỗ cây linh thụ bị sét đánh mà không chết, chứa lôi đình chi lực.'
    },

    // --- SMITHING TOOLS ---
    'luyen_khi_dai': {
        id: 'luyen_khi_dai',
        name: 'Luyện Khí Đài',
        type: 'smithing_tool',
        icon: '⚒️',
        quality: 'Huyền',
        price: 3000,
        description: 'Bệ rèn linh văn chuyên dụng cho luyện khí sư.'
    },

    // --- CRAFTABLE EQUIPMENT ---
    'phi_kiem_tinh_ha': {
        id: 'phi_kiem_tinh_ha',
        name: 'Tinh Hà Phi Kiếm',
        type: 'weapon',
        icon: '🗡️',
        quality: 'Huyền',
        price: 15000,
        description: 'Kiếm mang ánh sáng tinh hà, sát thương cực lớn.',
        stats: { atk: 150, critical: 0.15 }
    },
    'long_lan_giap': {
        id: 'long_lan_giap',
        name: 'Long Lân Giáp',
        type: 'armor',
        icon: '🛡️',
        quality: 'Địa',
        price: 85000,
        description: 'Giáp làm từ vảy giao long, phòng ngự kinh người.',
        stats: { def: 450, resistance: 0.3 }
    },

    // --- BEAST & INSECT ITEMS (NEW) ---
    'trung_hac_linh': {
        id: 'trung_hac_linh',
        name: 'Trứng Thanh Vân Hạc',
        type: 'beast_egg',
        icon: '🥚',
        quality: 'Hoàng',
        price: 2000,
        description: 'Một quả trứng hạc tỏa ra linh khí thanh khiết.',
        beastId: 'thanh_van_hac',
        hatchTime: 300 // 5 minutes
    },
    'trung_xich_lang': {
        id: 'trung_xich_lang',
        name: 'Trứng Xích Diễm Lang',
        type: 'beast_egg',
        icon: '🔥',
        quality: 'Hoàng',
        price: 3500,
        description: 'Trứng sói lửa, sờ vào thấy ấm nóng.',
        beastId: 'xich_diem_lang',
        hatchTime: 600
    },
    'ken_kim_tam': {
        id: 'ken_kim_tam',
        name: 'Kén Kim Tàm',
        type: 'beast_egg',
        icon: '🧶',
        quality: 'Huyền',
        price: 5000,
        description: 'Kén của Kim Tàm, đang chờ đợi ngày phá kén.',
        beastId: 'kim_tam',
        hatchTime: 1200
    },
    'linh_thu_dan': {
        id: 'linh_thu_dan',
        name: 'Linh Thú Đan',
        type: 'beast_food',
        icon: '💊',
        quality: 'Phàm',
        price: 100,
        description: 'Đan dược bồi bổ cho linh thú, tăng kinh nghiệm và độ thân mật.',
        expGain: 100,
        loyaltyGain: 5
    },
    'yeu_nhuc_tuoi': {
        id: 'yeu_nhuc_tuoi',
        name: 'Yêu Nhục Tươi',
        type: 'beast_food',
        icon: '🥩',
        quality: 'Phàm',
        price: 50,
        description: 'Thịt yêu thú tươi sống, linh thú rất thích ăn.',
        expGain: 50,
        loyaltyGain: 2
    },
    'van_thu_lenh': {
        id: 'van_thu_lenh',
        name: 'Vạn Thú Lệnh',
        type: 'treasure',
        icon: '📜',
        quality: 'Địa',
        price: 50000,
        description: 'Lệnh bài cổ xưa giúp tăng khả năng thuần phục yêu thú.',
        stats: { tamingBonus: 0.2 }
    },
    // --- TECHNIQUE BOOKS ---
    'truong_xuan_book': {
        id: 'truong_xuan_book',
        name: 'Sách: Trường Xuân Nạp Khí Quyết',
        type: 'book',
        icon: '📘',
        quality: 'Hoàng',
        price: 300,
        techniqueId: 'truong_xuan_nap_khi_quyet',
        description: 'Bản sao chép công pháp nhập môn phổ thông được lưu truyền rộng rãi trong Nhân Giới.'
    },
    'liet_duong_book': {
        id: 'liet_duong_book',
        name: 'Sách: Liệt Dương Công',
        type: 'book',
        icon: '📙',
        quality: 'Hoàng',
        price: 800,
        techniqueId: 'liet_duong_cong',
        description: 'Ghi chép phương pháp hấp thu Hỏa linh khí.'
    },
    'han_thuy_book': {
        id: 'han_thuy_book',
        name: 'Sách: Hàn Thủy Quyết',
        type: 'book',
        icon: '📗',
        quality: 'Hoàng',
        price: 800,
        techniqueId: 'han_thuy_quyet',
        description: 'Ghi chép phương pháp hấp thu Thủy linh khí.'
    },
    'thanh_moc_book': {
        id: 'thanh_moc_book',
        name: 'Sách: Thanh Mộc Tâm Kinh',
        type: 'book',
        icon: '📒',
        quality: 'Hoàng',
        price: 800,
        techniqueId: 'thanh_moc_tam_kinh',
        description: 'Ghi chép phương pháp hấp thu Mộc linh khí.'
    },
    'canh_kim_book': {
        id: 'canh_kim_book',
        name: 'Sách: Canh Kim Quyết',
        type: 'book',
        icon: '📖',
        quality: 'Hoàng',
        price: 800,
        techniqueId: 'canh_kim_quyet',
        description: 'Ghi chép phương pháp hấp thu Kim linh khí.'
    },
    'hau_tho_book': {
        id: 'hau_tho_book',
        name: 'Sách: Hậu Thổ Công',
        type: 'book',
        icon: '📜',
        quality: 'Hoàng',
        price: 800,
        techniqueId: 'hau_tho_cong',
        description: 'Ghi chép phương pháp hấp thu Thổ linh khí.'
    },
    'man_nguu_book': {
        id: 'man_nguu_book',
        name: 'Sách: Man Ngưu Kình',
        type: 'book',
        icon: '🐂',
        quality: 'Hoàng',
        price: 1500,
        techniqueId: 'man_nguu_kinh',
        description: 'Bí pháp Luyện Thể sơ cấp, rèn luyện cơ bắp.'
    },
    'duong_than_book': {
        id: 'duong_than_book',
        name: 'Sách: Dưỡng Thần Quyết',
        type: 'book',
        icon: '🧠',
        quality: 'Hoàng',
        price: 2000,
        techniqueId: 'duong_than_quyet',
        description: 'Bí pháp Thần Thức sơ cấp, rèn luyện linh hồn.'
    },
    'cuu_chuyen_kim_than_book': {
        id: 'cuu_chuyen_kim_than_book',
        name: 'Sách: Cửu Chuyển Kim Thân',
        type: 'book',
        icon: '🔱',
        quality: 'Huyền',
        price: 12000,
        techniqueId: 'cuu_chuyen_kim_than',
        description: 'Bí pháp Luyện Thể trung cấp cực kỳ quý hiếm.'
    },
    'u_minh_book': {
        id: 'u_minh_book',
        name: 'Sách: U Minh Huy Ngạn',
        type: 'book',
        icon: '💀',
        quality: 'Huyền',
        price: 15000,
        techniqueId: 'u_minh_huy_ngan',
        description: 'Bí pháp Thần Thức trung cấp, tu luyện linh hồn.'
    }
};

export const getItemById = (id) => ITEMS[id];
