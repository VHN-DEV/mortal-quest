// --- Hệ Thống Phẩm Cấp Pháp Bảo ---
// 1. Phàm Khí
// 2. Pháp Khí
// 3. Linh Khí
// 4. Pháp Bảo
// 5. Cổ Bảo
// 6. Linh Bảo
// 7. Thông Thiên Linh Bảo
// 8. Tiên Khí

export const ITEMS = {
    // Hạt giống
    'seed_linh_thao': { id: 'seed_linh_thao', name: 'Linh Chủng Thanh Phục Thảo', type: 'seed', icon: '🌱', quality: 'Phàm Khí', price: 10, description: 'Hạt giống Thanh Phục Thảo, loại linh thảo sơ cấp phổ biến nhất ở Nhân giới.' },
    'seed_hoa_diem_thao': { id: 'seed_hoa_diem_thao', name: 'Linh Chủng Hỏa Diễm Thảo', type: 'consumable', icon: '🔥', quality: 'Linh Khí', price: 150, description: 'Linh chủng của Hỏa Diễm Thảo.' },
    'seed_han_tuy_hoa': { id: 'seed_han_tuy_hoa', name: 'Linh Chủng Hàn Tủy Hoa', type: 'consumable', icon: '❄️', quality: 'Linh Khí', price: 150, description: 'Linh chủng của Hàn Tủy Hoa.' },
    'seed_u_minh_hoa': { id: 'seed_u_minh_hoa', name: 'Linh Chủng U Minh Hoa', type: 'consumable', icon: '💀', quality: 'Linh Khí', price: 300, description: 'Linh chủng của U Minh Hoa.' },

    // Trứng Linh Thú
    'trung_thanh_van_ly': {
        id: 'trung_thanh_van_ly',
        name: 'Trứng Thanh Vân Ly Thú',
        type: 'beast_egg',
        beastId: 'thanh_van_ly',
        icon: '🥚',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Trứng của Thanh Vân Ly Thú, tỏa ra linh khí thanh khiết của mây trời.'
    },
    'trung_huyen_giap_dia_long': {
        id: 'trung_huyen_giap_dia_long',
        name: 'Trứng Huyền Giáp Địa Long',
        type: 'beast_egg',
        beastId: 'huyen_giap_dia_long',
        icon: '🥚',
        quality: 'Địa Cấp',
        price: 15000,
        description: 'Trứng của Huyền Giáp Địa Long, nặng trịch như đá và bao phủ bởi lớp vỏ đen nhánh cứng cáp.'
    },
    'trung_u_minh_mong_diep': {
        id: 'trung_u_minh_mong_diep',
        name: 'Trứng U Minh Mộng Điệp',
        type: 'beast_egg',
        beastId: 'u_minh_mong_diep',
        icon: '🥚',
        quality: 'Linh Khí',
        price: 8000,
        description: 'Kén của U Minh Mộng Điệp, tỏa ra làn khói ảo ảnh mờ ảo.'
    },

    // Vật phẩm đặc biệt
    'di_hoa_bang': {
        id: 'di_hoa_bang',
        name: 'Dị Hỏa Bảng',
        type: 'book',
        icon: '📜',
        quality: 'Linh Khí',
        price: 1700,
        description: 'Bản danh sách ghi chép về 23 loại Dị Hỏa kỳ dị nhất trong thiên địa. Bấm vào để xem chi tiết.',
        action: 'open_di_hoa_bang'
    },
    'di_loi_bang': {
        id: 'di_loi_bang',
        name: 'Dị Lôi Bảng',
        type: 'book',
        icon: '📜',
        quality: 'Linh Khí',
        price: 1500,
        description: 'Bản danh sách ghi chép về 10 loại Dị Lôi cường hãn nhất trong thiên địa. Bấm vào để xem chi tiết.',
        action: 'open_di_loi_bang'
    },
    'linh_the_luc': {
        id: 'linh_the_luc',
        name: 'Chư Thiên Linh Thể Lục',
        type: 'book',
        icon: '📜',
        quality: 'Linh Khí',
        price: 2000,
        description: 'Bản danh sách ghi chép về 15 loại Linh Thể mạnh mẽ nhất chư thiên. Bấm vào để xem chi tiết.',
        action: 'open_linh_the_luc'
    },
    'phap_bao_luc': {
        id: 'phap_bao_luc',
        name: 'Vạn Bảo Lục',
        type: 'book',
        icon: '📜',
        quality: 'Linh Khí',
        price: 3000,
        description: 'Bản danh sách ghi chép về các loại pháp bảo, thần khí trong thiên địa, phân loại theo phẩm cấp và công dụng. Bấm vào để xem chi tiết.',
        action: 'open_phap_bao_luc'
    },
    'van_toc_thong_giam': {
        id: 'van_toc_thong_giam',
        name: 'Vạn Tộc Thông Giám',
        type: 'book',
        icon: '📜',
        quality: 'Linh Khí',
        price: 1500,
        description: 'Cuốn điển tịch cổ ghi chép tường tận về nguồn gốc và đặc điểm của vạn tộc trong thiên địa. Bấm vào để xem chi tiết.',
        action: 'open_van_toc_thong_giam'
    },

    // --- PROFESSION MANUALS ---
    'dan_dao_chan_giai': {
        id: 'dan_dao_chan_giai',
        name: 'Đan Đạo Chân Giải',
        type: 'book',
        icon: '📔',
        quality: 'Pháp Khí',
        price: 1000,
        description: 'Sách nhập môn về Luyện Đan, giúp mở khóa nghề Luyện Dược Sư.',
        effect: { type: 'unlock_profession', profession: 'alchemy' }
    },
    'luyen_khi_tong_cuong': {
        id: 'luyen_khi_tong_cuong',
        name: 'Luyện Khí Tổng Cương',
        type: 'book',
        icon: '📔',
        quality: 'Pháp Khí',
        price: 1200,
        description: 'Nguyên lý cơ bản về rèn đúc pháp bảo, mở khóa nghề Luyện Khí Sư.',
        effect: { type: 'unlock_profession', profession: 'smithing' }
    },
    'thai_thuong_phu_kinh': {
        id: 'thai_thuong_phu_kinh',
        name: 'Thái Thượng Phù Kinh',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Khí',
        price: 800,
        description: 'Ghi chép về cách dẫn linh hồn vào phù giấy, mở khóa nghề Phù Sư.',
        effect: { type: 'unlock_profession', profession: 'talisman' }
    },
    'tran_dao_thien_thu': {
        id: 'tran_dao_thien_thu',
        name: 'Trận Đạo Thiên Thư',
        type: 'book',
        icon: '📜',
        quality: 'Linh Khí',
        price: 2500,
        description: 'Thiên thư ghi chép về các loại trận pháp, mở khóa nghề Trận Pháp Sư.',
        effect: { type: 'unlock_profession', profession: 'formation' }
    },
    'co_quan_linh_ky': {
        id: 'co_quan_linh_ky',
        name: 'Cơ Quan Linh Kỹ',
        type: 'book',
        icon: '📔',
        quality: 'Linh Khí',
        price: 3000,
        description: 'Bí tịch về cách chế tạo khôi lỗi, mở khóa nghề Khôi Lỗi Sư.',
        effect: { type: 'unlock_profession', profession: 'puppet' }
    },
    'cuu_u_luyen_thi_thuat': {
        id: 'cuu_u_luyen_thi_thuat',
        name: 'Cửu U Luyện Thi Thuật',
        type: 'book',
        icon: '💀',
        quality: 'Linh Khí',
        price: 1500,
        description: 'Tà thuật luyện chế xác chết, mở khóa nghề Luyện Thi Sư.',
        effect: { type: 'unlock_profession', profession: 'corpse' }
    },
    'ngu_thu_quyet': {
        id: 'ngu_thu_quyet',
        name: 'Ngự Thú Quyết',
        type: 'book',
        icon: '📔',
        quality: 'Pháp Khí',
        price: 1500,
        description: 'Bí tịch ghi chép cách thuần phục và điều khiển linh thú, mở khóa nghề Ngự Thú Sư.',
        effect: { type: 'unlock_profession', profession: 'beast' }
    },
    'token_merchant': {
        id: 'token_merchant',
        name: 'Thương Nhân Lệnh',
        type: 'material',
        icon: '🏷️',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Lệnh bài của một thương hội lớn, giúp nhận được sự tin tưởng và ưu đãi từ các thương nhân.'
    },
    'dan_giai_doc': {
        id: 'dan_giai_doc',
        name: 'Đan Giải Độc',
        type: 'consumable',
        icon: '💊',
        quality: 'Pháp Khí',
        price: 200,
        description: 'Đan dược giúp hóa giải các loại độc tố cơ bản và chướng khí.'
    },
    'hoa_nguyen_dan': {
        id: 'hoa_nguyen_dan',
        name: 'Hóa Nguyên Đan',
        type: 'consumable',
        icon: '💠',
        quality: 'Pháp Bảo',
        price: 8000,
        description: 'Thần đan trân quý có khả năng trung hòa pháp lực xung đột khi thay đổi công pháp chủ tu, bảo toàn toàn bộ tu vi và đạo cơ. Cực kỳ hiếm thấy, chỉ các Luyện Dược Đại Sư mới có thể chế tác.',
    },
    'bp_tran_phap': {
        id: 'bp_tran_phap',
        name: 'Trận Pháp Bí Tịch',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Khí',
        price: 1000,
        description: 'Ghi chép về các trận pháp cơ bản, giúp hiểu rõ hơn về cấm chế và trận pháp bảo vệ.'
    },

    // --- ALCHEMY RECIPE SCROLLS ---
    'dp_ngung_khi_dan': {
        id: 'dp_ngung_khi_dan',
        name: 'Đan Phương: Ngưng Khí Đan',
        type: 'recipe',
        icon: '📜',
        quality: 'Pháp Khí',
        price: 300,
        description: 'Ghi chép cách luyện chế [[ngung_khi_dan|Ngưng Khí Đan]] từ [[linh_thao_thap|Linh Thảo Thấp Phẩm]].',
        effect: { type: 'learn_recipe', value: 'ngung_khi_dan' }
    },
    'dp_than_tam_dan': {
        id: 'dp_than_tam_dan',
        name: 'Đan Phương: Thanh Tâm Đan',
        type: 'recipe',
        icon: '📜',
        quality: 'Pháp Khí',
        price: 500,
        description: 'Ghi chép cách luyện chế [[thanh_tam_dan|Thanh Tâm Đan]] từ [[linh_thao_10y|Linh Thảo (10 năm)]] và [[chu_sa_muc|Chu Sa Linh Mực]].',
        effect: { type: 'learn_recipe', value: 'thanh_tam_dan' }
    },
    'dp_truc_co_dan': {
        id: 'dp_truc_co_dan',
        name: 'Đan Phương: Trúc Cơ Đan',
        type: 'recipe',
        icon: '📜',
        quality: 'Linh Khí',
        price: 2000,
        description: 'Ghi chép cách luyện chế [[truc_co_dan|Trúc Cơ Đan]] từ [[linh_thao_100y|Linh Thảo (100 năm)]], [[yeu_dan_so|Yêu Đan Sơ Cấp]] và [[hoa_tinh_thach|Hỏa Tinh Thạch]].',
        effect: { type: 'learn_recipe', value: 'truc_co_dan' }
    },
    'dp_bo_nguyen_dan': {
        id: 'dp_bo_nguyen_dan',
        name: 'Đan Phương: Bổ Nguyên Đan',
        type: 'recipe',
        icon: '📜',
        quality: 'Pháp Khí',
        price: 600,
        description: 'Ghi chép cách luyện chế [[bo_nguyen_dan|Bổ Nguyên Đan]] từ [[linh_thao_10y|Linh Thảo (10 năm)]] và [[yeu_huyet|Yêu Thú Tinh Huyết]].',
        effect: { type: 'learn_recipe', value: 'bo_nguyen_dan' }
    },
    'dp_ngung_anh_dan': {
        id: 'dp_ngung_anh_dan',
        name: 'Đan Phương: Ngưng Anh Đan',
        type: 'recipe',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 10000,
        description: 'Đan phương luyện chế [[ngung_anh_dan|Ngưng Anh Đan]] từ [[linh_thao_1000y|Linh Thảo (1000 năm)]], [[yeu_dan_trung|Yêu Đan Trung Cấp]] và [[han_ngoc_tuy|Hàn Ngọc Tủy]].',
        effect: { type: 'learn_recipe', value: 'ngung_anh_dan' }
    },

    // --- SMITHING BLUEPRINTS ---
    'bv_thanh_hong_kiem': {
        id: 'bv_thanh_hong_kiem',
        name: 'Bản Vẽ: Thanh Hồng Kiếm',
        type: 'recipe',
        icon: '📜',
        quality: 'Pháp Khí',
        price: 400,
        description: 'Bản vẽ rèn đúc [[thanh_hong_kiem|Thanh Hồng Kiếm]] từ [[huyen_thiet|Huyền Thiết]].',
        effect: { type: 'learn_smithing_recipe', value: 'thanh_hong_kiem' }
    },
    'bv_phi_kiem_tinh_ha': {
        id: 'bv_phi_kiem_tinh_ha',
        name: 'Bản Vẽ: Tinh Hà Phi Kiếm',
        type: 'recipe',
        icon: '📜',
        quality: 'Linh Khí',
        price: 1500,
        description: 'Bản vẽ rèn đúc [[phi_kiem_tinh_ha|Tinh Hà Phi Kiếm]] từ [[tinh_kim|Tinh Kim]] và [[huyen_thiet|Huyền Thiết]].',
        effect: { type: 'learn_smithing_recipe', value: 'phi_kiem_tinh_ha' }
    },
    'bv_long_lan_giap': {
        id: 'bv_long_lan_giap',
        name: 'Bản Vẽ: Long Lân Giáp',
        type: 'recipe',
        icon: '📜',
        quality: 'Linh Khí',
        price: 2500,
        description: 'Bản vẽ rèn đúc Long Lân Giáp.',
        effect: { type: 'learn_smithing_recipe', value: 'long_lan_giap' }
    },
    'bv_bat_quai_kinh': {
        id: 'bv_bat_quai_kinh',
        name: 'Bản Vẽ: Bát Quái Kính',
        type: 'recipe',
        icon: '📜',
        quality: 'Pháp Khí',
        price: 800,
        description: 'Bản vẽ rèn đúc Bát Quái Kính.',
        effect: { type: 'learn_smithing_recipe', value: 'bat_quai_kinh' }
    },

    // --- TALISMAN PATTERNS ---
    'pv_hoa_cau_phu': {
        id: 'pv_hoa_cau_phu',
        name: 'Phù Văn: Hỏa Cầu Phù',
        type: 'talisman_recipe',
        icon: '📜',
        quality: 'Pháp Khí',
        price: 200,
        description: 'Phù văn cơ bản của hỏa hệ.',
        effect: { type: 'learn_talisman_recipe', value: 'hoa_cau_phu' }
    },
    'pv_kim_cuong_phu': {
        id: 'pv_kim_cuong_phu',
        name: 'Phù Văn: Kim Cương Phù',
        type: 'talisman_recipe',
        icon: '📜',
        quality: 'Pháp Khí',
        price: 500,
        description: 'Phù văn tăng phòng ngự.',
        effect: { type: 'learn_talisman_recipe', value: 'kim_cuong_phu' }
    },
    'pv_than_hanh_phu': {
        id: 'pv_than_hanh_phu',
        name: 'Phù Văn: Thần Hành Phù',
        type: 'talisman_recipe',
        icon: '📜',
        quality: 'Pháp Khí',
        price: 400,
        description: 'Phù văn tăng tốc độ di chuyển.',
        effect: { type: 'learn_talisman_recipe', value: 'than_hanh_phu' }
    },
    'pv_thun_di_phu': {
        id: 'pv_thun_di_phu',
        name: 'Phù Văn: Thuấn Di Phù',
        type: 'talisman_recipe',
        icon: '📜',
        quality: 'Linh Khí',
        price: 1500,
        description: 'Phù văn dịch chuyển tức thời.',
        effect: { type: 'learn_talisman_recipe', value: 'thun_di_phu' }
    },
    'pv_thien_loi_phu': {
        id: 'pv_thien_loi_phu',
        name: 'Phù Văn: Thiên Lôi Phù',
        type: 'talisman_recipe',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 5000,
        description: 'Phù văn dẫn lôi đình chi lực.',
        effect: { type: 'learn_talisman_recipe', value: 'thien_loi_phu' }
    },

    // --- FORMATION DIAGRAMS ---
    'td_tu_linh_tran': {
        id: 'td_tu_linh_tran',
        name: 'Trận Đồ: Tụ Linh Trận',
        type: 'recipe',
        icon: '📜',
        quality: 'Pháp Khí',
        price: 1000,
        description: 'Học cách bố trí Tụ Linh Trận.',
        effect: { type: 'learn_formation', value: 'tran_do_tu_linh' }
    },
    'td_ao_anh_tran': {
        id: 'td_ao_anh_tran',
        name: 'Trận Đồ: Ảo Ảnh Trận',
        type: 'recipe',
        icon: '📜',
        quality: 'Pháp Khí',
        price: 1500,
        description: 'Học cách bố trí Ảo Ảnh Trận.',
        effect: { type: 'learn_formation', value: 'tran_do_ao_anh' }
    },
    'td_sat_kiem_tran': {
        id: 'td_sat_kiem_tran',
        name: 'Trận Đồ: Sát Kiếm Trận',
        type: 'recipe',
        icon: '📜',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Học cách bố trí Sát Kiếm Trận.',
        effect: { type: 'learn_formation', value: 'tran_do_sat_kiem' }
    },
    'td_ho_tong_dai_tran': {
        id: 'td_ho_tong_dai_tran',
        name: 'Trận Đồ: Hộ Tông Đại Trận',
        type: 'recipe',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 20000,
        description: 'Học cách bố trí Hộ Tông Đại Trận.',
        effect: { type: 'learn_formation', value: 'ho_tong_dai_tran' }
    },

    // --- PUPPET BLUEPRINTS ---
    'bv_thiet_giap_khoi_loi': {
        id: 'bv_thiet_giap_khoi_loi',
        name: 'Bản Vẽ: Thiết Giáp Khôi Lỗi',
        type: 'recipe',
        icon: '📜',
        quality: 'Pháp Khí',
        price: 1000,
        description: 'Hướng dẫn chế tạo Thiết Giáp Khôi Lỗi.',
        effect: { type: 'learn_puppet_recipe', value: 'thiet_giap_khoi_loi' }
    },
    'bv_kiem_khoi': {
        id: 'bv_kiem_khoi',
        name: 'Bản Vẽ: Kiếm Khôi',
        type: 'recipe',
        icon: '📜',
        quality: 'Linh Khí',
        price: 3000,
        description: 'Hướng dẫn chế tạo Kiếm Khôi.',
        effect: { type: 'learn_puppet_recipe', value: 'kiem_khoi' }
    },

    // --- CORPSE REFINING RECIPES ---
    'bp_thi_binh': {
        id: 'bp_thi_binh',
        name: 'Bí Phương: Luyện Chế Thi Binh',
        type: 'recipe',
        icon: '📜',
        quality: 'Pháp Khí',
        price: 500,
        description: 'Ghi chép cách luyện chế Thi Binh cơ bản.',
        effect: { type: 'learn_corpse_recipe', value: 'thi_binh' }
    },
    'bp_thi_tuong': {
        id: 'bp_thi_tuong',
        name: 'Bí Phương: Luyện Chế Thi Tướng',
        type: 'recipe',
        icon: '📜',
        quality: 'Linh Khí',
        price: 2000,
        description: 'Ghi chép cách luyện chế Thi Tướng hung hãn.',
        effect: { type: 'learn_corpse_recipe', value: 'thi_tuong' }
    },
    'bp_dong_giap_thi': {
        id: 'bp_dong_giap_thi',
        name: 'Bí Phương: Luyện Chế Đồng Giáp Thi',
        type: 'recipe',
        icon: '📜',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Ghi chép cách luyện chế Đồng Giáp Thi đao thương bất nhập.',
        effect: { type: 'learn_corpse_recipe', value: 'dong_giap_thi' }
    },

    // Tiêu hao
    'tich_coc_dan': {
        id: 'tich_coc_dan',
        name: 'Tịch Cốc Đan',
        type: 'consumable',
        icon: '💊',
        quality: 'Phàm Khí',
        price: 1,
        description: 'Đan dược giúp tu sĩ không cần ăn uống, duy trì sinh mệnh khi bế quan (mỗi ngày bế quan tiêu hao 1 viên). Sử dụng riêng lẻ giúp tăng nhẹ tốc độ tu luyện trong 1 giờ.',
        effect: { type: 'buff', stat: 'tu_vi_speed', value: 1.1, duration: 3600 }
    },
    'ngo_dao_tra': {
        id: 'ngo_dao_tra',
        name: 'Ngộ Đạo Trà',
        type: 'consumable',
        icon: '🍵',
        quality: 'Linh Khí',
        price: 800,
        description: 'Loại trà đặc chế từ linh thảo trăm năm và suối ngộ đạo. Uống vào tâm trí thêm minh mẫn, tốc độ lĩnh ngộ công pháp tăng gấp đôi trong 2 giờ.',
        effect: { type: 'technique_mastery_buff', value: 2.0, duration: 7200 }
    },
    'ngo_dao_dan': {
        id: 'ngo_dao_dan',
        name: 'Ngộ Đạo Đan',
        type: 'consumable',
        icon: '💠',
        quality: 'Pháp Bảo',
        price: 5000,
        description: 'Viên đan chắt lọc từ tinh hoa ngộ tính nghìn năm. Uống vào ngay lập tức lĩnh ngộ được đại đạo thiên địa, tức thì tăng 500 điểm thuần thục cho toàn bộ công pháp đang trang bị.',
        effect: { type: 'technique_mastery', value: 500 }
    },
    'bach_hoa_linh_tuu': {
        id: 'bach_hoa_linh_tuu',
        name: 'Bách Hoa Linh Tửu',
        type: 'consumable',
        quality: 'Linh Khí',
        icon: '🍶',
        price: 300,
        description: 'Linh tửu trứ danh chắt lọc từ tinh hoa trăm loài hoa chứa linh khí. Uống vào giúp nâng cao sảng khoái tinh thần, hồi phục ngay lập tức 50 Thể lực.',
        effect: { type: 'restore', stamina: 50 }
    },
    'tich_coc_thao': {
        id: 'tich_coc_thao',
        name: 'Tịch Cốc Thảo',
        type: 'material',
        icon: '🌿',
        quality: 'Phàm Khí',
        price: 10,
        description: 'Loại thảo dược đặc biệt chứa chất dinh dưỡng cực kỳ cô đọng, là nguyên liệu chính luyện chế Tịch Cốc Đan.'
    },
    'linh_coc': {
        id: 'linh_coc',
        name: 'Trân Châu Linh Cốc',
        type: 'material',
        icon: '🌾',
        quality: 'Phàm Khí',
        price: 5,
        description: 'Loại linh cốc thường thấy ở Nhân giới, hạt lúa lấp lánh như trân châu tỏa ra linh khí loãng, dùng để bổ sung sinh cơ cho tu sĩ cấp thấp.'
    },
    'dp_tich_coc_dan': {
        id: 'dp_tich_coc_dan',
        name: 'Đan Phương: Tịch Cốc Đan',
        type: 'recipe',
        icon: '📜',
        quality: 'Phàm Khí',
        price: 100,
        description: 'Ghi chép cách luyện chế [[tich_coc_dan|Tịch Cốc Đan]] từ [[tich_coc_thao|Tịch Cốc Thảo]] và [[linh_coc|Phàm Cấp Linh Cốc]].',
        effect: { type: 'learn_recipe', value: 'tich_coc_dan' }
    },
    'ngung_khi_dan': {
        id: 'ngung_khi_dan',
        name: 'Ngưng Khí Đan',
        type: 'consumable',
        icon: '💊',
        quality: 'Pháp Khí',
        price: 150,
        description: 'Gia tăng 500 linh khí ngay lập tức.',
        effect: { type: 'tu_vi', value: 500 }
    },
    'linh_thao_thap': {
        id: 'linh_thao_thap',
        name: 'Thanh Phục Thảo',
        type: 'material',
        icon: '🌿',
        quality: 'Phàm Khí',
        price: 20,
        description: 'Loại linh thảo sơ cấp cực kỳ phổ biến trong Phàm Nhân Tu Tiên. Hàn Lập từng dùng Thanh Phục Thảo để chế luyện lượng lớn Ngưng Khí Đan.'
    },
    'linh_thao_trung': {
        id: 'linh_thao_trung',
        name: 'Tử Lam Hoa',
        type: 'material',
        icon: '🍃',
        quality: 'Linh Khí',
        price: 100,
        description: 'Linh thảo trung phẩm có màu tím lam nhạt đặc trưng của phái Lạc Vân Tông, chứa linh lực vững vàng, thích hợp luyện chế đan dược Trúc Cơ.'
    },
    'hoa_diem_thao': {
        id: 'hoa_diem_thao',
        name: 'Hỏa Diễm Thảo',
        type: 'material',
        icon: '🔥',
        quality: 'Linh Khí',
        price: 250,
        description: 'Thảo dược nóng rực, sinh trưởng ở nơi có hỏa khí nồng đậm.'
    },
    'han_tuy_hoa': {
        id: 'han_tuy_hoa',
        name: 'Hàn Tủy Hoa',
        type: 'material',
        icon: '❄️',
        quality: 'Linh Khí',
        price: 250,
        description: 'Hoa trắng như tuyết, mang theo hàn khí thấu xương.'
    },
    'u_minh_hoa': {
        id: 'u_minh_hoa',
        name: 'U Minh Hoa',
        type: 'material',
        icon: '💀',
        quality: 'Linh Khí',
        price: 500,
        description: 'Hoa mọc nơi âm khí nồng đậm, u tối.'
    },
    'truc_co_dan': {
        id: 'truc_co_dan',
        name: 'Trúc Cơ Đan',
        type: 'consumable',
        quality: 'Linh Khí',
        icon: '💎',
        description: 'Đan dược chí bảo giúp phàm nhân đúc thành đạo cơ. Luyện chế từ Linh Thảo (100 năm), Yêu Đan Sơ Cấp và Hỏa Tinh Thạch.',
        price: 5000,
        stats: { breakthroughRate: 0.3 }
    },
    'ket_dan_dan': {
        id: 'ket_dan_dan',
        name: 'Kết Đan Đan',
        type: 'consumable',
        quality: 'Linh Bảo',
        icon: '💊',
        price: 15000,
        description: 'Đan dược quý hiếm giúp tu sĩ ngưng tụ Kim Đan chí thuần, tăng 20% tỷ lệ đột phá Kết Đan.',
        stats: { breakthroughRate: 0.20 }
    },
    'nguyen_anh_dan': {
        id: 'nguyen_anh_dan',
        name: 'Nguyên Anh Đan',
        type: 'consumable',
        icon: '🟣',
        quality: 'Linh Bảo',
        price: 85000,
        description: 'Luyện chế từ tà đan cấp cao, đan dược phụ trợ tối thượng giúp ngưng kết Nguyên Anh, tăng mạnh thần thức và tỉ lệ đột phá Nguyên Anh.',
        effect: { breakthroughRate: 0.15, spirit: 500 }
    },
    'hoa_than_dan': {
        id: 'hoa_than_dan',
        name: 'Hóa Thần Đan',
        type: 'consumable',
        quality: 'Tiên Khí',
        icon: '💊',
        price: 150000,
        description: 'Chí tôn đan dược hỗ trợ thần thức thăng hoa, câu thông thiên địa đột phá Hóa Thần cảnh, tăng 10% tỷ lệ đột phá Hóa Thần.',
        stats: { breakthroughRate: 0.10 }
    },
    'bo_nguyen_dan': {
        id: 'bo_nguyen_dan',
        name: 'Bổ Nguyên Đan',
        type: 'consumable',
        quality: 'Linh Khí',
        icon: '🍶',
        price: 450,
        description: 'Đan dược bồi bổ nguyên khí, hồi phục 100 Khí Huyết, 50 Linh Lực và 30 Thể Lực. Kết hợp từ Linh Thảo (10 năm) và Yêu Thú Tinh Huyết.',
        effect: { type: 'restore', hp: 100, mana: 50, stamina: 30 }
    },
    'thuy_tinh': {
        id: 'thuy_tinh',
        name: 'Thủy Tinh Linh Khoáng',
        type: 'material',
        icon: '💠',
        quality: 'Pháp Khí',
        price: 200,
        description: 'Một loại khoáng thạch chứa thủy tính linh lực.'
    },
    'ma_thach': {
        id: 'ma_thach',
        name: 'Ma Thạch Hạ Phẩm',
        type: 'material',
        icon: '🌑',
        quality: 'Linh Khí',
        price: 350,
        description: 'Đá chứa ma khí loãng, dùng cho các loại đan dược đặc thù.'
    },

    // =====================================================================
    // --- VẬT PHẨM ĐẶC TRƯNG TÔNG MÔN ---
    // =====================================================================

    // --- Nguyên liệu kim loại (Thiên Kiếm Tông / Cự Kiếm Môn) ---
    'huyen_thiet': {
        id: 'huyen_thiet',
        name: 'Huyền Thiết',
        type: 'material',
        icon: '🪨',
        quality: 'Linh Khí',
        price: 200,
        description: 'Loại sắt đen hấp thu linh khí thiên nhiên, cứng chắc hơn sắt thường nhiều lần. Nguyên liệu cơ bản để rèn đúc pháp khí kiếm đạo.'
    },
    'tinh_kim': {
        id: 'tinh_kim',
        name: 'Tinh Kim',
        type: 'material',
        icon: '✨',
        quality: 'Pháp Bảo',
        price: 800,
        description: 'Kim loại quý hiếm tinh luyện từ thiên thạch rơi xuống, chứa đựng thiên địa linh khí cực kỳ dồi dào. Nguyên liệu bậc cao để rèn kiếm pháp bảo hạng nhất.'
    },

    // --- Thiên Kiếm Tông: kiếm tinh thạch + bản vẽ phi kiếm ---
    'thanh_kiem_linh_tinh': {
        id: 'thanh_kiem_linh_tinh',
        name: 'Thanh Kiếm Linh Tinh',
        type: 'consumable',
        icon: '⚔️',
        quality: 'Linh Khí',
        price: 500,
        description: 'Viên tinh thạch được Thiên Kiếm Tông kết tinh từ kiếm ý thuần khiết. Sử dụng để tăng ngay 1000 Tu Vi và giúp lĩnh ngộ kiếm đạo thêm sâu sắc.',
        effect: { type: 'tu_vi', value: 1000 }
    },
    'phi_kiem_tinh_ha': {
        id: 'phi_kiem_tinh_ha',
        name: 'Tinh Hà Phi Kiếm',
        type: 'attackArtifact',
        quality: 'Pháp Bảo',
        icon: '⚔️',
        description: 'Phi kiếm rèn từ Tinh Kim thuần chính, tỏa ra ánh sáng huy hoàng như dải ngân hà, phù hợp với tu sĩ kiếm đạo cấp cao.',
        price: 8000,
        stats: { atk: 150, spd: 20, pierce: 0.1 }
    },
    'bv_phi_kiem_tinh_ha': {
        id: 'bv_phi_kiem_tinh_ha',
        name: 'Bản Vẽ: Tinh Hà Phi Kiếm',
        type: 'recipe',
        icon: '📜',
        quality: 'Linh Khí',
        price: 1500,
        description: 'Bản vẽ rèn đúc [[phi_kiem_tinh_ha|Tinh Hà Phi Kiếm]] từ [[tinh_kim|Tinh Kim]] và [[huyen_thiet|Huyền Thiết]].',
        effect: { type: 'learn_smithing_recipe', value: 'phi_kiem_tinh_ha' }
    },

    // --- Hoàng Phong Cốc: thần sa đặc trưng ---
    'hoang_phong_sa_tui': {
        id: 'hoang_phong_sa_tui',
        name: 'Hoàng Phong Thần Sa Túi',
        type: 'consumable',
        icon: '💛',
        quality: 'Linh Khí',
        price: 400,
        description: 'Túi thần sa đặc chế của Hoàng Phong Cốc, chứa đựng phong hệ linh khí cực đậm đặc. Sử dụng trước trận để tạo lớp phòng ngự cát, giảm 20% sát thương nhận vào trong 1 trận.',
        effect: { type: 'buff', stat: 'def_pct', value: 0.2, duration: 999 }
    },

    // --- Cự Kiếm Môn: giáp trọng cương kiện ---
    'cu_kiem_trong_giap': {
        id: 'cu_kiem_trong_giap',
        name: 'Cự Kiếm Trọng Giáp',
        type: 'defenseArtifact',
        quality: 'Linh Khí',
        icon: '🛡️',
        description: 'Bộ giáp nặng rèn từ Huyền Thiết, dày dặn như tường thành, đặc trưng của đệ tử Cự Kiếm Môn. Tốc độ giảm nhưng phòng ngự cực kỳ vững chắc.',
        price: 3500,
        stats: { def: 120, maxHp: 200, spd: -10 }
    },

    // --- Thiên Khuyết Bảo: đá luyện cương giáp ---
    'kim_luyen_thach': {
        id: 'kim_luyen_thach',
        name: 'Kim Luyện Thạch',
        type: 'material',
        icon: '🪨',
        quality: 'Pháp Khí',
        price: 350,
        description: 'Đá khoáng cứng như sắt thép, hấp thụ kim hệ linh khí dày đặc. Thiên Khuyết Bảo dùng để gia cố và luyện chế hộ thể cương giáp bậc cao.'
    },

    // --- Hóa Đao Ổ: linh sa mài đao ---
    'hoa_dao_linh_sa': {
        id: 'hoa_dao_linh_sa',
        name: 'Hóa Đao Linh Sa',
        type: 'consumable',
        icon: '🔪',
        quality: 'Linh Khí',
        price: 450,
        description: 'Linh sa đặc chế của Hóa Đao Ổ, chứa đựng đao kình ngưng tụ nhiều năm. Mài lên vũ khí trước trận chiến, tăng 20% ATK trong toàn bộ 1 trận.',
        effect: { type: 'buff', stat: 'atk_pct', value: 0.2, duration: 999 }
    },

    // --- Thanh Hư Môn: ngọc lộ dưỡng khí ---
    'thanh_hu_linh_no': {
        id: 'thanh_hu_linh_no',
        name: 'Thanh Hư Ngọc Lộ',
        type: 'consumable',
        icon: '💧',
        quality: 'Linh Khí',
        price: 600,
        description: 'Giọt ngọc lộ tinh khiết thu hoạch từ đỉnh núi Thanh Hư vào lúc bình minh, thanh lọc linh mạch. Hồi phục 30% Khí Huyết, 30% Pháp Lực và 50 Thể Lực ngay lập tức.',
        effect: { type: 'restore', hp: 0.3, mana: 0.3, stamina: 50 }
    },

    // --- Yểm Nguyệt Tông: đan dược song tu ---
    'song_tu_dieu_dan': {
        id: 'song_tu_dieu_dan',
        name: 'Song Tu Diệu Đan',
        type: 'consumable',
        icon: '💞',
        quality: 'Pháp Bảo',
        price: 2000,
        description: 'Đan dược bí truyền của Yểm Nguyệt Tông, điều hòa âm dương linh khí trong kinh mạch. Sử dụng tăng tốc độ tu luyện x1.5 trong 6 giờ và giảm 30% rủi ro tẩu hỏa.',
        effect: { type: 'buff', stat: 'tuViSpeed', value: 1.5, duration: 21600000 }
    },

    // --- Hợp Hoan Tông: mị hương ---
    'mi_duoc_thi_huong': {
        id: 'mi_duoc_thi_huong',
        name: 'Mị Dược Thi Hương',
        type: 'consumable',
        icon: '🌸',
        quality: 'Linh Khí',
        price: 800,
        description: 'Mị hương dạng lỏng tuyệt mật của Hợp Hoan Tông, tỏa ra ảo khí làm rối loạn tinh thần địch. Dùng trong trận giảm 35% tốc độ tấn công của địch trong 2 lượt.',
        effect: { type: 'debuff', stat: 'enemy_spd', value: 0.35, duration: 2 }
    },

    // --- Ma Diễm Môn: đá chứa ma hỏa ---
    'hoa_diem_thach': {
        id: 'hoa_diem_thach',
        name: 'Hỏa Diễm Thạch',
        type: 'material',
        icon: '🔥',
        quality: 'Linh Khí',
        price: 500,
        description: 'Đá khoáng hình thành ở vùng nham thạch sôi sục, chứa đựng ma hỏa tinh chất cực kỳ nóng cháy. Ma Diễm Môn dùng làm nguyên liệu luyện đan ma đạo và nâng cấp pháp bảo hỏa hệ.'
    },

    // --- Thiên Sát Tông: linh phiên sát khí ---
    'sat_khi_linh_phien': {
        id: 'sat_khi_linh_phien',
        name: 'Sát Khí Linh Phiên',
        type: 'consumable',
        icon: '🩸',
        quality: 'Linh Khí',
        price: 700,
        description: 'Thẻ phiên khắc bằng xương người, ngâm trong sát khí ngàn chiến nhiều năm — đặc sản Thiên Sát Tông. Kích hoạt trước trận chiến tăng 25% ATK và 10% Crit Rate trong toàn trận.',
        effect: { type: 'buff', stat: 'atk_pct', value: 0.25, duration: 999 }
    },

    // --- Linh Thú Sơn: ấn linh thú ---
    'linh_thu_ung_hieu': {
        id: 'linh_thu_ung_hieu',
        name: 'Linh Thú Ứng Hiệu Ấn',
        type: 'consumable',
        icon: '🐾',
        quality: 'Linh Khí',
        price: 1200,
        description: 'Ấn tín linh thú bí truyền của Linh Thú Sơn, chứa đựng thú ý khiến mọi linh thú bản năng thần phục. Sử dụng tăng 30% tỷ lệ thành công khi thu phục linh thú trong 24 giờ.',
        effect: { type: 'buff', stat: 'beastSuccess', value: 0.3, duration: 86400000 }
    },

    // --- Huyền Âm Cốc: hàn khí & pháp bảo oan hồn ---
    'huyen_am_han_tuy': {
        id: 'huyen_am_han_tuy',
        name: 'Huyền Âm Hàn Tủy',
        type: 'consumable',
        icon: '🧊',
        quality: 'Linh Khí',
        price: 800,
        description: 'Tinh hoa hàn khí thấu xương từ sâu đáy Huyền Âm Cốc, ngưng kết thành giọt băng tinh khiết. Sử dụng giúp tăng 1.5x Tốc độ tu luyện thần thức trong 12 giờ, nhưng người dùng sẽ chịu hàn khí xâm thực (Giảm tạm thời 10% Khí Huyết tối đa).',
        effect: { type: 'buff', stat: 'soulPs', value: 1.5, duration: 43200000, sideEffect: { stat: 'maxHp_pct', value: -0.1 } }
    },
    'am_hon_phien': {
        id: 'am_hon_phien',
        name: 'Âm Hồn Phiên',
        type: 'attackArtifact',
        quality: 'Linh Khí',
        icon: '🏴',
        description: 'Pháp bảo ma đạo Huyền Âm Cốc, bên trong giam cầm vô số oan hồn tàn ác. Công kích cuồng bạo nhưng ma khí từ oan hồn ăn mòn cơ thể người dùng.',
        price: 3000,
        stats: { atk: 180, maxHp: -100, spd: 15 }
    },

    // --- Lạc Vân Tông: dược thảo & tiên đan bí truyền ---
    'lac_van_thao': {
        id: 'lac_van_thao',
        name: 'Lạc Vân Thảo',
        type: 'material',
        icon: '🌱',
        quality: 'Linh Khí',
        price: 350,
        description: 'Linh thảo đặc thù chỉ mọc ở sườn núi Lạc Vân quanh năm mây phủ, ngậm sương trời tinh khiết. Là nguyên liệu không thể thiếu trong các loại đan dược thượng phẩm của Lạc Vân Tông.'
    },
    'lac_van_tien_dan': {
        id: 'lac_van_tien_dan',
        name: 'Lạc Vân Tiên Đan',
        type: 'consumable',
        icon: '💮',
        quality: 'Pháp Bảo',
        price: 5000,
        description: 'Đan dược bí truyền danh tiếng của Lạc Vân Tông, kết hợp từ vạn loại linh thảo thượng phẩm. Khi dùng lập tức hồi phục 100% Khí Huyết và Pháp Lực, đồng thời tăng 10% Tỷ lệ đột phá cảnh giới trong 24 giờ.',
        effect: { type: 'restore', hp: 1.0, mana: 1.0, breakthroughBuff: 0.1, duration: 86400000 }
    },

    // --- Thiên Tinh Tông: tinh thạch & trận bàn tinh tú ---
    'tinh_than_thach': {
        id: 'tinh_than_thach',
        name: 'Tinh Thần Thạch',
        type: 'material',
        icon: '☄️',
        quality: 'Linh Khí',
        price: 450,
        description: 'Khoáng thạch đặc biệt hấp thụ linh quang của ngàn vì tinh tú, tỏa ra ánh sáng lấp lánh lạnh lẽo. Nguyên liệu cốt lõi để Thiên Tinh Tông khắc họa trận bàn tinh tú thượng phẩm.'
    },
    'tinh_quang_tran_ban': {
        id: 'tinh_quang_tran_ban',
        name: 'Tinh Quang Trận Bàn',
        type: 'consumable',
        icon: '🥏',
        quality: 'Linh Khí',
        price: 1500,
        description: 'Trận bàn chế tác sẵn mang đặc trưng tinh tú của Thiên Tinh Tông. Kích hoạt trước trận đấu để triển khai một trận pháp tinh quang, tăng 25% Né tránh và 15% Thủ trong toàn bộ trận đấu.',
        effect: { type: 'buff', stats: { dodge: 0.25, def_pct: 0.15 }, duration: 999 }
    },

    // --- Quỷ Linh Môn: cốt liệu & độc đan bá đạo ---
    'van_hon_cot': {
        id: 'van_hon_cot',
        name: 'Vạn Hồn Cốt',
        type: 'material',
        icon: '🦴',
        quality: 'Linh Khí',
        price: 400,
        description: 'Xương cốt của tà tu đã trải qua vạn oán hồn quán chú, mang theo quỷ khí đậm đặc thấu tủy. Nguyên liệu ma đạo cốt lõi để Quỷ Linh Môn luyện chế độc đan và quỷ khí trấn môn.'
    },
    'tuyet_huyet_hac_dan': {
        id: 'tuyet_huyet_hac_dan',
        name: 'Tuyệt Huyết Hắc Đan',
        type: 'consumable',
        icon: '⚫',
        quality: 'Pháp Khí',
        price: 1000,
        description: 'Độc đan bá đạo của Quỷ Linh Môn, luyện từ Vạn Hồn Cốt và huyết khí cực âm. Sử dụng trong trận đấu bộc phát 40% Công Kích tức thì, nhưng độc tính khiến người dùng tự mất 5% Khí Huyết mỗi lượt.',
        effect: { type: 'buff', stat: 'atk_pct', value: 0.4, sideEffect: { type: 'dot', stat: 'hp_pct', value: -0.05 }, duration: 999 }
    },

    // --- Ngự Linh Tông: trùng noãn & hấp huyết trùng ---
    'ngoc_cai_trung_noan': {
        id: 'ngoc_cai_trung_noan',
        name: 'Ngọc Cái Trùng Noãn',
        type: 'material',
        icon: '🥚',
        quality: 'Linh Khí',
        price: 600,
        description: 'Trứng của một loài kỳ trùng thượng cổ cực hiếm. Lớp vỏ lấp lánh như ngọc bảo, bên trong ẩn chứa kịch độc và linh khí ngự thú dồi dào.'
    },
    'tui_hap_huyet_trung': {
        id: 'tui_hap_huyet_trung',
        name: 'Túi Hấp Huyết Trùng',
        type: 'consumable',
        icon: '🪲',
        quality: 'Linh Khí',
        price: 850,
        description: 'Túi da bí truyền Ngự Linh Tông tàng trữ hàng ngàn con Hấp Huyết Trùng hung hãn. Ném vào đối thủ để chúng cắn xé liên tục, mỗi lượt hút 10% Khí Huyết của địch hồi cho bản thân trong 3 lượt.',
        effect: { type: 'debuff', stat: 'lifesteal_dot', value: 0.1, duration: 3 }
    },

    // --- Khôi Âm Tông: u thiết mộc & cốt ấn cường hóa ---
    'u_thiet_linh_moc': {
        id: 'u_thiet_linh_moc',
        name: 'U Thiết Linh Mộc',
        type: 'material',
        icon: '🪵',
        quality: 'Linh Khí',
        price: 450,
        description: 'Gỗ cổ thụ vạn năm ngâm trong U Minh tuyền thủy tối tăm, cứng hơn cả sắt thép nhưng lại nhẹ tựa lông hồng. Nguyên liệu hoàn hảo để chế tạo thân vỏ khôi lỗi cấp cao.'
    },
    'khoi_loi_cot_an': {
        id: 'khoi_loi_cot_an',
        name: 'Khôi Lỗi Cốt Ấn',
        type: 'consumable',
        icon: '🔰',
        quality: 'Linh Khí',
        price: 900,
        description: 'Bùa ấn Khôi Âm Tông luyện từ xác chết của cường giả, khắc vào huyệt đạo trước trận đấu để cường hóa thân thể tựa khôi lỗi. Giảm 30% sát thương vật lý nhận vào nhưng giảm 20% Tốc độ đánh.',
        effect: { type: 'buff', stats: { physRes: 0.3, spd_pct: -0.2 }, duration: 999 }
    },

    'thanh_hong_kiem': {
        id: 'thanh_hong_kiem',
        name: 'Thanh Hồng Kiếm',
        type: 'attackArtifact',
        quality: 'Linh Khí',
        image: 'artifacts/thanh_hong_kiem.webp',
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
        quality: 'Linh Khí',
        price: 200,
        description: 'Hồi phục 50% Khí Huyết ngay lập tức. Luyện chế từ Linh Thảo (10 năm) và Chu Sa Linh Mực.',
        effect: { type: 'heal', value: 0.5 }
    },

    // Trang bị
    'phi_kiem_go': {
        id: 'phi_kiem_go',
        name: 'Phi Kiếm Gỗ',
        type: 'attackArtifact',
        quality: 'Phàm Khí',
        icon: '🗡️',
        description: 'Kiếm gỗ dành cho đệ tử nhập môn, sát thương không đáng kể.',
        price: 50,
        stats: { atk: 5 }
    },
    'ao_bo_so_cap': {
        id: 'ao_bo_so_cap',
        name: 'Áo Bố Sơ Cấp',
        type: 'defenseArtifact',
        quality: 'Phàm Khí',
        icon: '👘',
        description: 'Áo vải thô sơ, chỉ có tác dụng che thân.',
        price: 30,
        stats: { def: 2 }
    },
    'nhan_dong_nat': {
        id: 'nhan_dong_nat',
        name: 'Nhẫn Đồng Nát',
        type: 'soulArtifact',
        quality: 'Phàm Khí',
        icon: '💍',
        description: 'Một chiếc nhẫn bằng đồng cũ kỹ.',
        price: 80,
        stats: { spd: 1 }
    },
    'tui_tru_vat_so': {
        id: 'tui_tru_vat_so',
        name: 'Túi Trữ Vật (Sơ)',
        type: 'consumable',
        icon: '🎒',
        quality: 'Pháp Khí',
        tier: 'PHAP_KHI',
        price: 500,
        description: 'Sử dụng để mở rộng thêm một túi trữ vật mới với 10 ô chứa đồ.',
        action: 'expand_inventory',
        stats: { slots: 10 }
    },
    'tui_tru_vat_trung': {
        id: 'tui_tru_vat_trung',
        name: 'Túi Trữ Vật (Trung)',
        type: 'consumable',
        icon: '🎒',
        quality: 'Linh Khí',
        tier: 'LINH_KHI',
        price: 5000,
        description: 'Sử dụng để mở rộng thêm một túi trữ vật mới với 30 ô chứa đồ.',
        action: 'expand_inventory',
        stats: { slots: 30 }
    },
    'tui_tru_vat_cao': {
        id: 'tui_tru_vat_cao',
        name: 'Túi Trữ Vật (Cao)',
        type: 'consumable',
        icon: '🎒',
        quality: 'Pháp Bảo',
        tier: 'PHAP_BAO',
        price: 25000,
        description: 'Sử dụng để mở rộng thêm một túi trữ vật mới với 50 ô chứa đồ.',
        action: 'expand_inventory',
        stats: { slots: 50 }
    },
    'ho_tam_kinh': {
        id: 'ho_tam_kinh',
        name: 'Hộ Tâm Kính',
        type: 'defenseArtifact',
        quality: 'Cổ Bảo',
        tier: 'LINH_KHI',
        icon: '🛡️',
        description: 'Một mảnh gương bảo vệ tâm mạch, giảm sát thương nhận vào.',
        price: 2000,
        stats: { def: 30, hp: 100, costMana: 5 },
        durability: 120,
        maxDurability: 120
    },
    'linh_thuyen_so': {
        id: 'linh_thuyen_so',
        name: 'Linh Thuyền Sơ Cấp',
        type: 'flightArtifact',
        quality: 'Pháp Khí',
        tier: 'PHAP_KHI',
        icon: '🛶',
        description: 'Thuyền nhỏ bay trên không trung bằng linh thạch.',
        price: 3000,
        stats: { spd: 20 },
        durability: 80,
        maxDurability: 80
    },
    'ngu_phong_phi_chu': {
        id: 'ngu_phong_phi_chu',
        name: 'Ngự Phong Phi Chu',
        type: 'flightArtifact',
        quality: 'Pháp Bảo',
        tier: 'PHAP_BAO',
        icon: '🚢',
        description: 'Phi chu bằng linh mộc ngàn năm, khắc họa Ngự Phong Trận Pháp pháp trận, ngự phong nhi hành tốc độ cực nhanh, lướt sóng vượt biển nhàn nhã.',
        price: 150000,
        stats: { spd: 80 },
        durability: 200,
        maxDurability: 200
    },
    'truyen_tong_lenh': {
        id: 'truyen_tong_lenh',
        name: 'Thượng Cổ Truyền Tống Lệnh',
        type: 'supportArtifact',
        quality: 'Cổ Bảo',
        tier: 'CO_BAO',
        icon: '🏅',
        description: 'Tấm lệnh bài làm từ linh thạch cổ xưa phát ra hào quang xám nhạt, che chở tu sĩ trước áp lực xé rách của không gian khi đi qua Truyền Tống Trận.',
        price: 300000,
        stats: { luck: 15 }
    },
    'pha_khong_phu': {
        id: 'pha_khong_phu',
        name: 'Phá Không Phù',
        type: 'consumable',
        quality: 'Pháp Bảo',
        tier: 'PHAP_BAO',
        icon: '📜',
        description: 'Linh phù quý hiếm dùng để phá vỡ chướng ngại không gian, bảo vệ nhục thân khi thăng hoa giới diện hoặc cưỡng ép dịch chuyển xuyên vách ngăn hư không (tiêu hao khi dùng).',
        price: 50000
    },
    'tu_linh_chau': {
        id: 'tu_linh_chau',
        name: 'Tụ Linh Châu',
        type: 'supportArtifact',
        quality: 'Tiên Khí',
        tier: 'LINH_KHI',
        icon: '🔮',
        description: 'Viên châu thu hút linh khí xung quanh, tăng tốc độ tu luyện.',
        price: 5000,
        stats: { tuViSpeed: 1.2 },
        durability: 200,
        maxDurability: 200
    },
    'tran_ban_so': {
        id: 'tran_ban_so',
        name: 'Trận Bàn Sơ Cấp',
        type: 'formationArtifact',
        quality: 'Pháp Khí',
        tier: 'PHAP_KHI',
        icon: '🌀',
        description: 'Bàn xoay dùng để bố trí các trận pháp cơ bản.',
        price: 1200,
        stats: { formationPower: 1.1 },
        durability: 100,
        maxDurability: 100
    },
    'hon_dang_co': {
        id: 'hon_dang_co',
        name: 'Hồn Đăng Cổ',
        type: 'soulArtifact',
        quality: 'Cổ Bảo',
        tier: 'CO_BAO',
        icon: '🪔',
        description: 'Ngọn đèn cổ bảo vệ thần hồn, kháng các loại ma chướng.',
        price: 25000,
        stats: { soulExpSpeed: 1.5, def: 50, soulRepress: 20 },
        durability: 500,
        maxDurability: 500,
        isRecognized: false
    },
    'ban_menh_phi_kiem': {
        id: 'ban_menh_phi_kiem',
        name: 'Bản Mệnh Phi Kiếm',
        type: 'attackArtifact',
        quality: 'Tiên Khí',
        tier: 'LINH_KHI',
        icon: '🗡️',
        description: 'Thanh phi kiếm được luyện hóa từ tinh huyết, liên kết chặt chẽ với linh hồn.',
        price: 0,
        stats: { atk: 100, spd: 15, pierce: 0.2, critRate: 0.1 },
        durability: 1000,
        maxDurability: 1000,
        isLifeBound: true,
        spirit: 0,
        level: 1
    },
    'seed_linh_thao_trung': {
        id: 'seed_linh_thao_trung',
        name: 'Linh Chủng Tử Lam Hoa',
        type: 'seed',
        icon: '🌿',
        quality: 'Linh Khí',
        price: 25,
        description: 'Hạt giống Tử Lam Hoa, linh thảo trung phẩm có màu tím lam dịu mắt, sinh trưởng tương đối lâu.'
    },
    'hoi_huyet_dan': {
        id: 'hoi_huyet_dan',
        name: 'Hồi Huyết Đan',
        type: 'consumable',
        icon: '🧪',
        quality: 'Phàm Khí',
        price: 50,
        description: 'Thuốc cầm máu cơ bản, hồi phục 20% Khí Huyết.',
        effect: { type: 'heal', value: 0.2 }
    },

    // --- SPIRITUAL STONES ---
    'ling_thach_ha': {
        id: 'ling_thach_ha',
        name: 'Hạ Phẩm Linh Thạch',
        type: 'spirit_stone',
        grade: 'HA',
        attribute: 'NORMAL',
        image: 'items/ha_pham_linh_thach',
        icon: '💎',
        quality: 'Phàm Khí',
        price: 1,
        weight: 0.01,
        description: 'Linh thạch phổ thông nhất, dùng cho giao dịch và tu luyện sơ cấp.'
    },
    'ling_thach_trung': {
        id: 'ling_thach_trung',
        name: 'Trung Phẩm Linh Thạch',
        type: 'spirit_stone',
        grade: 'TRUNG',
        attribute: 'NORMAL',
        image: 'items/trung_pham_linh_thach',
        icon: '💠',
        quality: 'Linh Khí',
        price: 100,
        weight: 0.02,
        description: 'Linh khí tinh thuần, 1 viên tương đương 100 Hạ Phẩm.'
    },
    'ling_thach_thuong': {
        id: 'ling_thach_thuong',
        name: 'Thượng Phẩm Linh Thạch',
        type: 'spirit_stone',
        grade: 'THUONG',
        attribute: 'NORMAL',
        image: 'items/thuong_pham_linh_thach',
        icon: '🔮',
        quality: 'Cổ Bảo',
        price: 10000,
        weight: 0.05,
        description: 'Linh lực đậm đặc, dùng trong các giao dịch đấu giá hoặc đột phá.'
    },
    'ling_thach_cuc': {
        id: 'ling_thach_cuc',
        name: 'Cực Phẩm Linh Thạch',
        type: 'spirit_stone',
        grade: 'CUC',
        attribute: 'NORMAL',
        image: 'items/cuc_pham_linh_thach',
        icon: '🌌',
        quality: 'Linh Bảo',
        price: 1000000,
        weight: 0.1,
        description: 'Cực kỳ hiếm thấy, chứa đựng linh lực hóa lỏng vô tận.'
    },
    'hoa_linh_thach': {
        id: 'hoa_linh_thach',
        name: 'Hỏa Linh Thạch',
        type: 'spirit_stone',
        grade: 'HA', // Default to HA, can be changed via metadata
        attribute: 'FIRE',
        icon: '🔥',
        quality: 'Phàm Khí',
        price: 5,
        weight: 0.01,
        description: 'Chứa hỏa linh khí, phù hợp cho hỏa tu và luyện đan.'
    },
    'bang_linh_thach': {
        id: 'bang_linh_thach',
        name: 'Băng Linh Thạch',
        type: 'spirit_stone',
        grade: 'HA',
        attribute: 'ICE',
        icon: '❄️',
        quality: 'Phàm Khí',
        price: 5,
        weight: 0.01,
        description: 'Tỏa ra hàn khí lạnh thấu xương, phù hợp cho băng tu.'
    },
    'loi_linh_thach': {
        id: 'loi_linh_thach',
        name: 'Lôi Linh Thạch',
        type: 'spirit_stone',
        grade: 'HA',
        attribute: 'LIGHTNING',
        icon: '⚡',
        quality: 'Phàm Khí',
        price: 8,
        weight: 0.01,
        description: 'Chứa lôi điện chi lực, cực kỳ bạo liệt.'
    },
    'moc_linh_thach': {
        id: 'moc_linh_thach',
        name: 'Mộc Linh Thạch',
        type: 'spirit_stone',
        grade: 'HA',
        attribute: 'WOOD',
        icon: '🌿',
        quality: 'Phàm Khí',
        price: 5,
        weight: 0.01,
        description: 'Chứa sinh mệnh tinh hoa, hỗ trợ hồi phục và trồng trọt.'
    },
    'ma_linh_thach': {
        id: 'ma_linh_thach',
        name: 'Ma Linh Thạch',
        type: 'spirit_stone',
        grade: 'HA',
        attribute: 'DEMON',
        icon: '🌑',
        quality: 'Phàm Khí',
        price: 10,
        weight: 0.01,
        description: 'Chứa ma khí loãng, dùng cho ma tu hoặc các tà thuật.'
    },
    'kim_linh_thach': {
        id: 'kim_linh_thach',
        name: 'Kim Linh Thạch',
        type: 'spirit_stone',
        grade: 'HA',
        attribute: 'METAL',
        icon: '📀',
        quality: 'Phàm Khí',
        price: 5,
        weight: 0.01,
        description: 'Chứa kim hệ linh khí, vô cùng sắc bén và kiên cố.'
    },
    'tho_linh_thach': {
        id: 'tho_linh_thach',
        name: 'Thổ Linh Thạch',
        type: 'spirit_stone',
        grade: 'HA',
        attribute: 'EARTH',
        icon: '🟤',
        quality: 'Phàm Khí',
        price: 5,
        weight: 0.01,
        description: 'Chứa thổ hệ linh khí, trầm ổn và dày nặng.'
    },
    'tien_tinh': {
        id: 'tien_tinh',
        name: 'Tiên Tinh',
        type: 'spirit_stone',
        grade: 'TIEN',
        attribute: 'IMMORTAL',
        icon: '✨',
        quality: 'Tiên Khí',
        price: 100000000,
        weight: 0.2,
        description: 'Tinh thể ngưng tụ từ Tiên Khí, tài nguyên chiến lược của Tiên Giới.'
    },
    'hon_don_tinh': {
        id: 'hon_don_tinh',
        name: 'Hỗn Độn Tinh',
        type: 'spirit_stone',
        grade: 'HON_DON',
        attribute: 'NORMAL',
        icon: '🌌',
        quality: 'Linh Bảo',
        price: 500000000,
        weight: 0.5,
        description: 'Chứa đựng Hỗn Độn Khí thuở sơ khai, vô cùng quý giá.'
    },
    'hong_mong_tinh': {
        id: 'hong_mong_tinh',
        name: 'Hồng Mông Linh Tinh',
        type: 'spirit_stone',
        grade: 'HONG_MONG',
        attribute: 'IMMORTAL',
        icon: '💜',
        quality: 'Linh Bảo',
        price: 2000000000,
        weight: 1.0,
        description: 'Chí bảo từ thời Hồng Mông, chứa đựng quy tắc của đại đạo.'
    },
    'phe_thach': {
        id: 'phe_thach',
        name: 'Phế Linh Thạch',
        type: 'material',
        icon: '🪨',
        quality: 'Phàm Khí',
        price: 0.1,
        weight: 0.01,
        description: 'Linh thạch đã bị hút cạn linh khí, chỉ còn là đá vụn.'
    },

    // --- SPECIAL ENERGY SOURCES ---
    'ma_tinh': {
        id: 'ma_tinh',
        name: 'Ma Tinh',
        type: 'consumable',
        icon: '🌑',
        quality: 'Linh Khí',
        price: 1000,
        description: 'Tinh thể ngưng tụ từ ma khí đậm đặc, dùng để tăng Ma Khí.',
        effect: { type: 'qi_absorb', qiType: 'ma_khi', amount: 500, purity: 'TINH_THUAN' }
    },
    'tien_ngoc': {
        id: 'tien_ngoc',
        name: 'Tiên Ngọc',
        type: 'consumable',
        icon: '💎',
        quality: 'Cổ Bảo',
        price: 50000,
        description: 'Ngọc thạch từ Tiên Giới, chứa đựng Tiên Khí tinh thuần.',
        effect: { type: 'qi_absorb', qiType: 'tien_khi', amount: 1000, purity: 'CUC_PHAM' }
    },
    'hon_don_tinh_thach': {
        id: 'hon_don_tinh_thach',
        name: 'Hỗn Độn Tinh Thạch',
        type: 'consumable',
        icon: '🌌',
        quality: 'Linh Bảo',
        price: 500000,
        description: 'Mảnh vỡ từ thuở khai thiên lập địa, chứa Hỗn Độn Khí cực kỳ nguy hiểm.',
        effect: { type: 'qi_absorb', qiType: 'hon_don_khi', amount: 200, purity: 'DAO' }
    },
    'sinh_menh_thach': {
        id: 'sinh_menh_thach',
        name: 'Sinh Mệnh Thạch',
        type: 'consumable',
        icon: '🌱',
        quality: 'Pháp Bảo',
        price: 15000,
        description: 'Đá quý chứa đựng sinh cơ dồi dào, giúp tăng Sinh Khí.',
        effect: { type: 'qi_absorb', qiType: 'sinh_khi', amount: 800, purity: 'TINH_THUAN' }
    },

    // --- DHARMA TREASURES (PHÁP BẢO) ---
    'phi_kiem_thanh_tuyen': {
        id: 'phi_kiem_thanh_tuyen',
        name: 'Thanh Tuyền Kiếm',
        type: 'attackArtifact',
        quality: 'Pháp Khí',
        image: 'artifacts/phi_kiem_thanh_tuyen.webp',
        icon: '🗡️',
        description: 'Phi kiếm cấp thấp, tăng nhẹ công kích và tốc độ.',
        price: 800,
        stats: { atk: 25, spd: 3 }
    },
    'bat_quai_kinh': {
        id: 'bat_quai_kinh',
        name: 'Bát Quái Kính',
        type: 'supportArtifact',
        quality: 'Linh Khí',
        image: 'artifacts/bat_quai_kinh.webp',
        icon: '🪞',
        description: 'Phòng ngự pháp bảo, tạo lớp chắn linh khí giảm sát thương.',
        price: 2500,
        stats: { def: 40, resistance: 0.1 }
    },
    'u_minh_chuong': {
        id: 'u_minh_chuong',
        name: 'U Minh Chuông',
        type: 'supportArtifact',
        quality: 'Pháp Bảo',
        image: 'artifacts/u_minh_chuong.webp',
        icon: '🔔',
        description: 'Hồn hệ pháp bảo, tăng mạnh Thần Thức và kháng ảo cảnh.',
        price: 12000,
        stats: { soul: 150, def: 20 }
    },
    'chuong_thien_binh': {
        id: 'chuong_thien_binh',
        name: 'Chưởng Thiên Bình',
        type: 'supportArtifact',
        quality: 'Tiên Khí',
        tier: 'TIEN_KHI',
        image: 'artifacts/chuong-thien-binh.svg',
        description: 'Chí bảo đệ nhất Tiên giới, có khả năng ngưng tụ linh dịch thiên địa.',
        price: 9999999,
        stats: { tuViSpeed: 2.0, luck: 50 },
        specialEffect: 'generate_spiritual_liquid'
    },
    'hu_thien_dinh': {
        id: 'hu_thien_dinh',
        name: 'Hư Thiên Đỉnh',
        type: 'supportArtifact',
        icon: '🏺',
        quality: 'Thông Thiên Linh Bảo',
        price: 400000,
        image: 'items/hu_thien_dinh.webp',
        description: 'Chí tôn cổ đỉnh ngưng tụ càn khôn bát quái khí, mang lại phòng ngự tuyệt đối cùng khả năng thu nạp linh khí tinh thuần không giới hạn.',
        stats: { spirit: 3000, def: 10000, qiAbsorb: 1200 },
        poem: ['Hư Thiên Bát Quái Tàng Càn Khôn', 'Cổ Đỉnh Trấn Áp Vạn Sơn Hà']
    },
    'bat_linh_xich': {
        id: 'bat_linh_xich',
        name: 'Bát Linh Xích',
        type: 'attackArtifact',
        quality: 'Cổ Bảo',
        tier: 'CO_BAO',
        image: 'artifacts/bat-linh-xich.svg',
        description: 'Pháp bảo hình thước, có khả năng phong ấn linh lực đối phương.',
        price: 300000,
        stats: { atk: 500, soulRepress: 20 }
    },
    'binh_son_an': {
        id: 'binh_son_an',
        name: 'Bình Sơn Ấn',
        type: 'attackArtifact',
        quality: 'Pháp Khí',
        tier: 'PHAP_KHI',
        image: 'artifacts/binh-son-an.svg',
        description: 'Pháp bảo dạng ấn ký, mang theo sức mạnh của vạn quân sơn nhạc.',
        price: 250000,
        stats: { atk: 800, spd: -10 }
    },
    'phong_loi_si': {
        id: 'phong_loi_si',
        name: 'Phong Lôi Sí',
        type: 'flightArtifact',
        quality: 'Cổ Bảo',
        tier: 'CO_BAO',
        image: 'artifacts/phong-loi-si.svg',
        description: 'Quạt lông vũ mang theo sức mạnh phong lôi, tăng mạnh tốc độ độn tẩu.',
        price: 400000,
        stats: { spd: 150, atk: 200 }
    },
    'huyet_sac_phi_phong': {
        id: 'huyet_sac_phi_phong',
        name: 'Huyết Sắc Phi Phong',
        type: 'defenseArtifact',
        quality: 'Pháp Khí',
        tier: 'PHAP_KHI',
        image: 'artifacts/huyet-sac-phi-phong.svg',
        description: 'Áo choàng máu, tăng khả năng né tránh và phòng ngự.',
        price: 200000,
        stats: { def: 300, spd: 50 }
    },
    'nguyen_tu_cuc_son': {
        id: 'nguyen_tu_cuc_son',
        name: 'Nguyên Từ Cực Sơn',
        type: 'attackArtifact',
        quality: 'Cổ Bảo',
        tier: 'CO_BAO',
        image: 'artifacts/nguyen-tu-cuc-son.svg',
        description: 'Ngọn núi chứa đựng nguyên từ thần quang, khắc chế ngũ hành pháp bảo.',
        price: 600000,
        stats: { atk: 1200, def: 500, pierce: 0.3 }
    },
    'bac_cuc_cuc_son': {
        id: 'bac_cuc_cuc_son',
        name: 'Bắc Cực Cực Sơn',
        type: 'attackArtifact',
        quality: 'Cổ Bảo',
        tier: 'CO_BAO',
        image: 'artifacts/bac-cuc-nguyen-quang-cuc-son.webp',
        description: 'Ngọn núi chứa đựng Bắc Cực Nguyên Quang, đóng băng vạn vật.',
        price: 600000,
        stats: { atk: 1100, def: 600, iceDmg: 200 }
    },
    'nguyen_hop_ngu_cuc_son': {
        id: 'nguyen_hop_ngu_cuc_son',
        name: 'Nguyên Hợp Ngũ Cực Sơn',
        type: 'attackArtifact',
        quality: 'Thông Thiên Linh Bảo',
        tier: 'THONG_THIEN',
        image: 'artifacts/nguyen-hop-ngu-cuc-son.svg',
        description: 'Sự kết hợp của năm ngọn cực sơn, uy lực chấn động thiên địa.',
        price: 5000000,
        stats: { atk: 5000, def: 2500, pierce: 0.5, daoVun: 10 }
    },
    'ban_thach_dinh_nguyen_kiem': {
        id: 'ban_thach_dinh_nguyen_kiem',
        name: 'Bàn Thạch Định Nguyên Kiếm',
        type: 'attackArtifact',
        quality: 'Tiên Khí',
        tier: 'TIEN_KHI',
        image: 'artifacts/ban_thach_dinh_nguyen_kiem.webp',
        description: 'Thanh kiếm đúc từ tiên thạch vạn năm, mang theo sức mạnh trấn áp bát phương, định ra nguyên khí thiên địa.',
        price: 5000000,
        stats: { atk: 6000, def: 2000, earthDmg: 500 },
        poem: ['Bàn Thạch Bất Động Định Càn Khôn', 'Định Nguyên Nhất Kiếm Trấn Bát Phương']
    },
    'luc_duong_loi_hoa_kiem': {
        id: 'luc_duong_loi_hoa_kiem',
        name: 'Lục Dương Lôi Hỏa Kiếm',
        type: 'attackArtifact',
        quality: 'Tiên Khí',
        tier: 'TIEN_KHI',
        image: 'artifacts/luc_duong_loi_hoa_kiem.webp',
        description: 'Thanh kiếm chứa đựng sức mạnh của sáu vầng thái dương, kết hợp cùng lôi đình chi lực bạo liệt.',
        price: 5500000,
        stats: { atk: 6500, fireDmg: 800, lightningDmg: 800 },
        poem: ['Lục Dương Thần Hỏa Phần Thiên Địa', 'Lôi Đình Vạn Quân Phá Hư Không']
    },
    'tu_tuong_bo_de_kiem': {
        id: 'tu_tuong_bo_de_kiem',
        name: 'Tứ Tượng Bồ Đề Kiếm',
        type: 'attackArtifact',
        quality: 'Tiên Khí',
        tier: 'TIEN_KHI',
        image: 'artifacts/tu_tuong_bo_de_kiem.webp',
        description: 'Thanh kiếm giác ngộ dưới gốc cây Bồ Đề, hội tụ sức mạnh của Tứ Tượng linh thú.',
        price: 6000000,
        stats: { atk: 7000, critChance: 0.2, critDamage: 0.5 },
        poem: ['Tứ Tượng Quy Linh Bồ Đề Tọa', 'Kiếm Khí Tung Hoành Ngộ Đạo Chân']
    },
    'tao_hoa_tien_dinh': {
        id: 'tao_hoa_tien_dinh',
        name: 'Tạo Hóa Tiên Đỉnh',
        type: 'supportArtifact',
        quality: 'Tiên Khí',
        tier: 'TIEN_KHI',
        image: 'artifacts/tao_hoa_tien_dinh.webp',
        description: 'Đỉnh quý chứa đựng huyền năng của tạo hóa, có thể luyện chế tiên đan và nghịch chuyển nhân quả.',
        price: 8000000,
        stats: { alchemyBonus: 0.5, luck: 20, qiAbsorb: 2.0 },
        poem: ['Tạo Hóa Vô Cùng Trong Một Đỉnh', 'Nghịch Chuyển Càn Khôn Hóa Tiên Đan']
    },
    'thien_dao_than_thach': {
        id: 'thien_dao_than_thach',
        name: 'Thiên Đạo Thần Thạch',
        type: 'material',
        quality: 'Tiên Khí',
        tier: 'TIEN_KHI',
        image: 'artifacts/thien_dao_than_thach.webp',
        description: 'Mảnh vỡ từ Thiên Đạo, chứa đựng quy tắc tối cao của vũ trụ.',
        price: 10000000,
        stats: { breakthroughRate: 0.5, luck: 100 },
        poem: ['Thiên Đạo Vô Thường Thần Thạch Ấn', 'Quy Tắc Vạn Vật Tại Nhân Tâm']
    },
    'truyen_dao_thanh_gian': {
        id: 'truyen_dao_thanh_gian',
        name: 'Truyền Đạo Thánh Giản',
        type: 'book',
        quality: 'Tiên Khí',
        tier: 'TIEN_KHI',
        image: 'artifacts/truye_dao_thanh_gian.webp',
        description: 'Thánh giản ghi chép truyền thừa của vị tiên nhân thượng cổ, chứa đựng vô số bí pháp.',
        price: 7000000,
        action: 'open_immortal_transmission',
        poem: ['Thánh Giản Truyền Đạo Khai Thần Thức', 'Vạn Cổ Bí Pháp Hiện Chân Thân']
    },
    'quan_han_linh_ngoc_bat': {
        id: 'quan_han_linh_ngoc_bat',
        name: 'Quảng Hàn Linh Ngọc Bát',
        type: 'supportArtifact',
        quality: 'Tiên Khí',
        tier: 'TIEN_KHI',
        image: 'artifacts/quan_han_linh_ngoc_bat.webp',
        description: 'Bát ngọc từ Quảng Hàn cung, chứa đựng hàn khí tinh khiết của mặt trăng.',
        price: 4500000,
        stats: { maxHp: 5000, iceDmg: 400, def: 1000 },
        poem: ['Quảng Hàn Nguyệt Ảnh Ngọc Bát Linh', 'Thanh Lạnh Sương Mai Hóa Vạn Kiếp']
    },
    'that_tinh_ban_nguyet_thinh': {
        id: 'that_tinh_ban_nguyet_thinh',
        name: 'Thất Tinh Bạn Nguyệt Thính',
        type: 'defenseArtifact',
        quality: 'Tiên Khí',
        tier: 'TIEN_KHI',
        image: 'artifacts/that_tinh_ban_nguyet_thinh.webp',
        description: 'Bình phong Thất Tinh vây quanh ánh trăng, tạo ra lớp bảo vệ tuyệt đối.',
        price: 5200000,
        stats: { def: 5000, spd: 50, resistance: 0.3 },
        poem: ['Thất Tinh Vây Nguyệt Trấn Thần Hồn', 'Bạn Nguyệt Thính Trung Ảnh Vô Song']
    },
    'to_nga_suong_nguyet_luan': {
        id: 'to_nga_suong_nguyet_luan',
        name: 'Tố Nga Sương Nguyệt Luân',
        type: 'attackArtifact',
        quality: 'Tiên Khí',
        tier: 'TIEN_KHI',
        image: 'artifacts/to_nga_suong_nguyet_luan.webp',
        description: 'Vòng nguyệt luân của Tố Nga tiên tử, mang theo sương giá lạnh lẽo và ánh trăng sắc lẹm.',
        price: 5800000,
        stats: { atk: 6200, spd: 100, iceDmg: 600 },
        poem: ['Tố Nga Nhất Vũ Nguyệt Luân Khởi', 'Sương Lạnh Thấu Xương Diệt Ma Tâm']
    },
    'linh_dich': {
        id: 'linh_dich',
        name: 'Linh Dịch (Chưởng Thiên Bình)',
        type: 'consumable',
        quality: 'Tiên Khí',
        icon: '🧪',
        description: 'Linh dịch ngưng tụ từ Chưởng Thiên Bình, có khả năng kích phát linh thảo trưởng thành cực nhanh.',
        price: 0,
        effect: { type: 'garden_boost', value: 1000 } // Rút ngắn 1000 giây hoặc 100%?
    },
    'egg_phe_kim_trung': {
        id: 'egg_phe_kim_trung',
        name: 'Trứng Phệ Kim Trùng',
        type: 'beast_egg',
        beastId: 'phe_kim_trung',
        quality: 'Thông Thiên Linh Bảo',
        image: 'aberrations/phe-kim-trung.svg',
        description: 'Trứng của loài hung trùng thượng cổ, có thể cắn nuốt vạn vật.',
        price: 50000
    },
    'egg_bang_tam': {
        id: 'egg_bang_tam',
        name: 'Trứng Băng Tàm',
        type: 'beast_egg',
        beastId: 'bang_tam',
        quality: 'Tiên Khí',
        image: 'aberrations/bang-tam.svg',
        description: 'Trứng của loài tằm băng vùng cực hàn, nhả tơ chứa hàn khí thấu xương.',
        price: 20000
    },
    'egg_huyet_ngoc_tri_chu': {
        id: 'egg_huyet_ngoc_tri_chu',
        name: 'Trứng Huyết Ngọc Tri Chu',
        type: 'beast_egg',
        beastId: 'huyet_ngoc_tri_chu',
        quality: 'Pháp Khí',
        image: 'aberrations/huyet-ngoc-tri-chu.svg',
        description: 'Trứng nhện ngọc máu, có khả năng phun tơ dính và độc tố cực mạnh.',
        price: 15000
    },
    'tui_tru_vat_trung': {
        id: 'tui_tru_vat_trung',
        name: 'Túi Trữ Vật (Trung)',
        type: 'bag',
        icon: '🎒',
        quality: 'Linh Khí',
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
        quality: 'Pháp Khí',
        price: 1000,
        description: 'Trận đồ cơ bản dùng để tụ tập linh khí xung quanh.'
    },
    'tran_do_ao_anh': {
        id: 'tran_do_ao_anh',
        name: 'Ảo Ảnh Trận Đồ',
        type: 'formation',
        icon: '🌫️',
        quality: 'Linh Khí',
        price: 4500,
        description: 'Tạo huyễn cảnh che mắt đối thủ.'
    },

    // --- TALISMAN PAPERS (GIẤY PHÙ) ---
    'hoang_chi_phu': { id: 'hoang_chi_phu', name: 'Hoàng Chỉ Phù', type: 'material', icon: '📜', quality: 'Phàm Khí', price: 10, description: 'Giấy phù vàng cơ bản.' },
    'chu_sa_muc': { id: 'chu_sa_muc', name: 'Chu Sa Mực', type: 'material', icon: '🩸', quality: 'Phàm Khí', price: 20, description: 'Mực chu sa dùng để vẽ phù.' },

    // Khôi Lỗi
    'khoi_loi_item': {
        id: 'khoi_loi_item',
        name: 'Khôi Lỗi',
        type: 'puppet',
        icon: '🤖',
        price: 1000,
        description: 'Một con khôi lỗi cơ quan thuật.'
    },
    'linh_moc_phu': {
        id: 'linh_moc_phu',
        name: 'Linh Mộc Phù Chỉ',
        type: 'talisman_paper',
        icon: '🪵',
        quality: 'Pháp Khí',
        price: 50,
        description: 'Làm từ gỗ linh mộc, tăng độ ổn định khi vẽ phù.'
    },
    'yeu_thu_da_phu': {
        id: 'yeu_thu_da_phu',
        name: 'Yêu Thú Da Phù',
        type: 'talisman_paper',
        icon: '📜',
        quality: 'Linh Khí',
        price: 250,
        description: 'Làm từ da yêu thú, tăng uy lực cho phù công kích.'
    },

    // --- SPIRIT INKS (MỰC PHÙ) ---
    'chu_sa_muc': {
        id: 'chu_sa_muc',
        name: 'Chu Sa Linh Mực',
        type: 'talisman_ink',
        icon: '🩸',
        quality: 'Phàm Khí',
        price: 20,
        description: 'Mực chu sa chứa linh lực loãng, dùng vẽ phù cơ bản.'
    },
    'yeu_huyet_muc': {
        id: 'yeu_huyet_muc',
        name: 'Yêu Huyết Mực',
        type: 'talisman_ink',
        icon: '🧪',
        quality: 'Linh Khí',
        price: 150,
        description: 'Pha trộn từ máu yêu thú, tăng sát thương cho phù lục.'
    },

    // --- TALISMAN PENS (PHÙ BÚT) ---
    'truc_phu_but': {
        id: 'truc_phu_but',
        name: 'Trúc Phù Bút',
        type: 'talisman_pen',
        icon: '🖌️',
        quality: 'Pháp Khí',
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
        quality: 'Phàm Khí',
        price: 100,
        description: 'Triệu hồi hỏa cầu tấn công, gây sát thương Hỏa.',
        effect: { type: 'damage', value: 200, element: 'fire' }
    },
    'kim_cuong_phu': {
        id: 'kim_cuong_phu',
        name: 'Kim Cương Phù',
        type: 'talisman',
        icon: '🛡️',
        quality: 'Pháp Khí',
        price: 350,
        description: 'Tạo lớp bảo vệ cứng như kim cương, tăng 100 DEF trong 3 lượt.',
        effect: { type: 'buff', stat: 'def', value: 100, duration: 3 }
    },
    'than_hanh_phu': {
        id: 'than_hanh_phu',
        name: 'Thần Hành Phù',
        type: 'talisman',
        icon: '👟',
        quality: 'Pháp Khí',
        price: 200,
        description: 'Tăng tốc độ di chuyển cực nhanh trong thời gian ngắn.',
        effect: { type: 'utility', speedBoost: 2.0, duration: 60 } // seconds
    },
    'thun_di_phu': {
        id: 'thun_di_phu',
        name: 'Thuấn Di Phù',
        type: 'talisman',
        icon: '⚡',
        quality: 'Linh Khí',
        price: 2000,
        description: 'Dịch chuyển tức thời thoát khỏi nguy hiểm.',
        effect: { type: 'escape' }
    },

    // --- PROFESSION SECRETS (BÍ PHÁP MỞ KHÓA NGHỀ NGHIỆP) ---
    'bp_luyen_dan': {
        id: 'bp_luyen_dan',
        name: 'Đan Đạo Chân Giải',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 1000,
        effect: { type: 'unlock_profession', profession: 'alchemy', secretId: 'bp_luyen_dan' },
        description: 'Gia tăng vĩnh viễn tỉ lệ luyện đan thành công.'
    },
    'truong_sinh_quyet_book': {
        id: 'truong_sinh_quyet_book',
        name: 'Trường Sinh Quyết',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 1000,
        description: 'Bí tịch dưỡng sinh cổ xưa, tăng mạnh Thọ Nguyên.',
        effect: { type: 'lifespan', value: 20 }
    },
    'huyet_don_thuat_book': {
        id: 'huyet_don_thuat_book',
        name: 'Huyết Độn Thuật',
        type: 'consumable',
        icon: '🩸',
        quality: 'Linh Khí',
        price: 1500,
        description: 'Ma đạo bí pháp, dùng tinh huyết để độn tẩu cực nhanh.',
        effect: { type: 'learn_secret', value: 'huyet_don_thuat' }
    },
    'bp_luyen_khi': {
        id: 'bp_luyen_khi',
        name: 'Luyện Khí Tổng Cương',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 1500,
        effect: { type: 'unlock_profession', profession: 'smithing', secretId: 'bp_luyen_khi' },
        description: 'Chứa đựng bí quyết tôi luyện kim thạch, rèn đúc thần binh pháp bảo.'
    },
    'bp_phu_luc': {
        id: 'bp_phu_luc',
        name: 'Thái Thượng Phù Kinh',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 1000,
        effect: { type: 'unlock_profession', profession: 'talisman', secretId: 'bp_phu_luc' },
        description: 'Hướng dẫn cách câu thông thiên địa linh lực vào phù văn để tạo ra phù lục.'
    },
    'bp_tran_phap': {
        id: 'bp_tran_phap',
        name: 'Trận Đạo Thiên Thư',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 2000,
        effect: { type: 'unlock_profession', profession: 'formation', secretId: 'bp_tran_phap' },
        description: 'Kiến thức về trận đồ, mắt trận và cách bố trí linh thạch để trấn giữ hoặc công kích.'
    },
    'bp_ngu_thu': {
        id: 'bp_ngu_thu',
        name: 'Vạn Thú Ngự Pháp',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 1200,
        effect: { type: 'unlock_profession', profession: 'beast', secretId: 'bp_ngu_thu' },
        description: 'Bí quyết giao tiếp và ký kết khế ước với các loài linh thú.'
    },
    'bp_ngu_trung': {
        id: 'bp_ngu_trung',
        name: 'Thiên Trùng Bí Lục',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 1200,
        effect: { type: 'unlock_profession', profession: 'insect', secretId: 'bp_ngu_trung' },
        description: 'Cách nuôi dưỡng và điều khiển bầy trùng mang theo kịch độc hoặc năng lực đặc thù.'
    },
    'bp_khoi_loi': {
        id: 'bp_khoi_loi',
        name: 'Cơ Quan Linh Kỹ',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 2500,
        effect: { type: 'unlock_profession', profession: 'puppet', secretId: 'bp_khoi_loi' },
        description: 'Kỹ thuật chế tác cơ quan và truyền linh hồn vào các vật vô tri để tạo ra khôi lỗi.'
    },
    'bp_luyen_thi': {
        id: 'bp_luyen_thi',
        name: 'Cửu U Luyện Thi Thuật',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 3000,
        effect: { type: 'unlock_profession', profession: 'corpse', secretId: 'bp_luyen_thi' },
        description: 'Tà thuật luyện chế xác chết thành thi khôi, đao thương bất nhập.'
    },

    // --- TALISMAN TECHNIQUES (BÍ PHÁP) ---
    'thien_loi_phu_quyen': {
        id: 'thien_loi_phu_quyen',
        name: 'Thiên Lôi Phù Quyển',
        type: 'talisman_recipe',
        icon: '⚡',
        quality: 'Cổ Bảo',
        price: 45000,
        description: 'Ghi chép cách vẽ Thiên Lôi Phù, uy lực kinh thiên động địa.'
    },

    // --- ALCHEMY MATERIALS (EXPANDED) ---
    'linh_thao_10y': {
        id: 'linh_thao_10y',
        name: 'Hoàng Tinh Thảo (10 năm)',
        type: 'material',
        icon: '🌿',
        quality: 'Pháp Khí',
        price: 80,
        description: 'Thảo dược có thân màu vàng kim nhạt, sau 10 năm đã tích tụ chút linh khí, là nguyên liệu phụ trợ phổ biến.'
    },
    'linh_thao_100y': {
        id: 'linh_thao_100y',
        name: 'Uẩn Cổ Thảo (100 năm)',
        type: 'material',
        icon: '🍃',
        quality: 'Linh Khí',
        price: 500,
        description: 'Linh dược trăm năm trân quý, một trong ba chủ dược chính để luyện chế Trúc Cơ Đan trong Phàm Nhân Tu Tiên.'
    },
    'linh_thao_1000y': {
        id: 'linh_thao_1000y',
        name: 'Cửu Khúc Linh Sâm (1000 năm)',
        type: 'material',
        icon: '🎋',
        quality: 'Pháp Bảo',
        price: 5000,
        description: 'Linh dược ngàn năm cực kỳ hiếm có, đã bắt đầu thông linh tính, thường dùng để luyện chế đan dược phụ trợ Nguyên Anh đột phá.'
    },

    // --- MONSTER MATERIALS ---
    'yeu_dan_so': {
        id: 'yeu_dan_so',
        name: 'Yêu Đan Sơ Cấp',
        type: 'material',
        icon: '🟡',
        quality: 'Pháp Khí',
        price: 300,
        description: 'Nội đan của yêu thú cấp thấp, chứa tinh hoa yêu lực.'
    },
    'yeu_dan_trung': {
        id: 'yeu_dan_trung',
        name: 'Yêu Đan Trung Cấp',
        type: 'material',
        icon: '🟠',
        quality: 'Linh Khí',
        price: 1500,
        description: 'Nội đan của yêu thú trung cấp, chứa linh lực dồi dào.'
    },
    'ngung_anh_dan': {
        id: 'ngung_anh_dan',
        name: 'Ngưng Anh Đan',
        type: 'consumable',
        icon: '💎',
        quality: 'Pháp Bảo',
        price: 50000,
        description: 'Đan dược hỗ trợ ngưng tụ Nguyên Anh, cực kỳ quý hiếm.',
        stats: { breakthroughRate: 0.25 }
    },
    'yeu_huyet': {
        id: 'yeu_huyet',
        name: 'Yêu Thú Tinh Huyết',
        type: 'material',
        icon: '🩸',
        quality: 'Pháp Khí',
        price: 100,
        description: 'Máu tươi của yêu thú, dùng trong luyện thể hoặc luyện đan.'
    },
    'xac_yeu_thu': {
        id: 'xac_yeu_thu',
        name: 'Xác Yêu Thú',
        type: 'material',
        icon: '🧟',
        quality: 'Pháp Khí',
        price: 500,
        description: 'Thân xác hoàn chỉnh của yêu thú, có thể dùng để luyện thi hoặc bán.'
    },
    'xac_tu_si': {
        id: 'xac_tu_si',
        name: 'Xác Tu Sĩ',
        type: 'material',
        icon: '💀',
        quality: 'Linh Khí',
        price: 1000,
        description: 'Thân xác của tu sĩ đã vẫn lạc, chứa đựng linh tính, là vật liệu thượng hạng để luyện thi.'
    },

    // --- ORES & MINERALS ---
    'linh_thao_van_nam': {
        id: 'linh_thao_van_nam',
        name: 'Vạn Niên Huyết Linh Chi',
        type: 'material',
        icon: '🌺',
        quality: 'Cổ Bảo',
        price: 50000,
        description: 'Linh dược vạn năm cực kỳ hiếm thấy ở Nhân giới, tích lũy thiên địa tinh hoa vạn năm, dùng để chế luyện các loại đan dược nghịch thiên độ kiếp.'
    },
    'huyen_thiet': {
        id: 'huyen_thiet',
        name: 'Huyền Thiết',
        type: 'material',
        icon: '⬛',
        quality: 'Linh Khí',
        price: 800,
        description: 'Sắt đen cực nặng và cứng, dùng để rèn vũ khí hạng nặng.'
    },
    'tinh_kim': {
        id: 'tinh_kim',
        name: 'Tinh Kim',
        type: 'material',
        icon: '✨',
        quality: 'Pháp Bảo',
        price: 3000,
        description: 'Vàng tinh khiết chứa linh lực, dẫn linh cực tốt.'
    },
    'vân_thiết': {
        id: 'vân_thiết',
        name: 'Thiên Ngoại Vẫn Thiết',
        type: 'material',
        icon: '☄️',
        quality: 'Cổ Bảo',
        price: 25000,
        description: 'Mảnh vỡ thiên thạch từ ngoài không gian, chứa sức mạnh tinh thần.'
    },
    'yeu_cot': {
        id: 'yeu_cot',
        name: 'Yêu Thú Cốt',
        type: 'material',
        icon: '🦴',
        quality: 'Pháp Khí',
        price: 150,
        description: 'Xương của yêu thú, dùng làm nguyên liệu chế tác hoặc luyện thi.'
    },
    'da_lan_giap': {
        id: 'da_lan_giap',
        name: 'Da Lân Giáp',
        type: 'material',
        icon: '🛡️',
        quality: 'Linh Khí',
        price: 1200,
        description: 'Lớp da hoặc vảy của yêu thú phòng ngự cao.'
    },
    'long_huyet_tinh': {
        id: 'long_huyet_tinh',
        name: 'Long Huyết Tinh',
        type: 'material',
        icon: '🩸',
        quality: 'Pháp Bảo',
        price: 10000,
        description: 'Tinh hoa máu rồng ngưng kết, chứa sức mạnh huyết mạch kinh người.'
    },
    'tien_tinh': {
        id: 'tien_tinh',
        name: 'Tiên Tinh',
        type: 'material',
        icon: '💎',
        quality: 'Cổ Bảo',
        price: 100000,
        description: 'Tinh thể kết tinh từ Tiên khí, chỉ có ở những nơi tiên phàm giao giới.'
    },
    'trung_than_thu': {
        id: 'trung_than_thu',
        name: 'Trứng Thần Thú',
        type: 'consumable',
        icon: '🥚',
        quality: 'Linh Bảo',
        price: 1000000,
        description: 'Trứng của sinh vật cổ đại, có thể ấp nở thành linh thú hộ mệnh.',
        effect: { type: 'hatch' }
    },
    'hoa_tinh_thach': {
        id: 'hoa_tinh_thach',
        name: 'Hỏa Tinh Thạch',
        type: 'material',
        icon: '🔥',
        quality: 'Linh Khí',
        price: 1200,
        description: 'Khoáng thạch chứa hỏa tính cực mạnh.'
    },
    'han_ngoc_tuy': {
        id: 'han_ngoc_tuy',
        name: 'Hàn Ngọc Tủy',
        type: 'material',
        icon: '❄️',
        quality: 'Pháp Bảo',
        price: 8500,
        description: 'Tinh túy từ hàn ngọc vạn năm, lạnh thấu xương.'
    },

    // --- ALCHEMY TOOLS (AS ITEMS) ---
    'pham_lu_item': {
        id: 'pham_lu_item',
        name: 'Phàm Lư',
        type: 'consumable',
        icon: '🏺',
        quality: 'Phàm Khí',
        price: 100,
        description: 'Đan lư cơ bản cho người mới học luyện đan.',
        effect: { type: 'equip_cauldron', value: 'pham_lu' }
    },
    'linh_hoa_item': {
        id: 'linh_hoa_item',
        name: 'Mồi Lửa: Linh Hỏa',
        type: 'consumable',
        icon: '🔥',
        quality: 'Phàm Khí',
        price: 50,
        description: 'Linh hỏa cấp thấp, đủ để luyện chế đan dược phàm phẩm.',
        effect: { type: 'refine_flame', value: 'linh_hoa' }
    },
    'huyen_lu_item': {
        id: 'huyen_lu_item',
        name: 'Huyền Thiết Trọng Lư',
        type: 'cauldron',
        icon: '🏺',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Đan lư đúc từ huyền thiết, giúp ổn định hỏa lực.'
    },
    'thanh_lien_hoa_seed': {
        id: 'thanh_lien_hoa_seed',
        name: 'Thanh Liên Địa Tâm Hỏa (Chủng)',
        type: 'flame',
        icon: '🔥',
        quality: 'Pháp Bảo',
        price: 50000,
        description: 'Hỏa chủng của Thanh Liên Địa Tâm Hỏa, có thể luyện hóa thành linh hỏa.'
    },

    // --- TECHNIQUES (CÔNG PHÁP) ---
    'truong_sinh_quyet': {
        id: 'truong_sinh_quyet',
        name: 'Trường Sinh Quyết (Bí Tịch)',
        type: 'book',
        icon: '📖',
        quality: 'Pháp Khí',
        price: 500,
        description: 'Công pháp cơ bản giúp gia tăng thọ nguyên và thể chất.',
        techniqueId: 'truong_sinh_quyet'
    },
    'thien_loi_kiem_quyet': {
        id: 'thien_loi_kiem_quyet',
        name: 'Thiên Lôi Kiếm Quyết',
        type: 'technique',
        icon: '⚡',
        quality: 'Cổ Bảo',
        price: 50000,
        description: 'Kiếm quyết cấp cao mượn lực thiên lôi, uy lực vô song.'
    },

    // --- SMITHING MATERIALS (LINH QUẶNG & DỊ KIM) ---
    'huyen_thiet': {
        id: 'huyen_thiet',
        name: 'Huyền Thiết',
        type: 'material',
        icon: '🧱',
        quality: 'Pháp Khí',
        price: 200,
        description: 'Quặng sắt nặng chứa linh khí, nguyên liệu cơ bản luyện khí.'
    },
    'tinh_kim': {
        id: 'tinh_kim',
        name: 'Tinh Kim',
        type: 'material',
        icon: '✨',
        quality: 'Linh Khí',
        price: 1500,
        description: 'Kim loại tinh khiết, dẫn linh lực cực tốt.'
    },
    'thai_duong_than_kim': {
        id: 'thai_duong_than_kim',
        name: 'Thái Dương Thần Kim',
        type: 'material',
        icon: '🌞',
        quality: 'Cổ Bảo',
        price: 150000,
        description: 'Vật liệu chí dương, sinh ra từ lõi mặt trời.'
    },

    // --- SPIRIT WOOD (LINH MỘC) ---
    'loi_kich_moc': {
        id: 'loi_kich_moc',
        name: 'Lôi Kích Mộc',
        type: 'material',
        icon: '🪵',
        quality: 'Pháp Bảo',
        price: 12000,
        description: 'Gỗ cây linh thụ bị sét đánh mà không chết, chứa lôi đình chi lực.'
    },

    // --- SMITHING TOOLS ---
    'de_khi_dai': {
        id: 'de_khi_dai',
        name: 'Đế Khí Đài',
        type: 'smithing_tool',
        icon: '⚒️',
        quality: 'Phàm Khí',
        price: 200,
        description: 'Bệ rèn thô sơ cho người mới học luyện khí.'
    },
    'luyen_khi_dai': {
        id: 'luyen_khi_dai',
        name: 'Luyện Khí Đài',
        type: 'smithing_tool',
        icon: '⚒️',
        quality: 'Linh Khí',
        price: 3000,
        description: 'Bệ rèn linh văn chuyên dụng cho luyện khí sư.'
    },

    // --- CRAFTABLE EQUIPMENT ---
    'phi_kiem_tinh_ha': {
        id: 'phi_kiem_tinh_ha',
        name: 'Tinh Hà Phi Kiếm',
        type: 'attackArtifact',
        icon: '🗡️',
        quality: 'Linh Khí',
        price: 15000,
        description: 'Kiếm mang ánh sáng tinh hà, sát thương cực lớn. Rèn từ Tinh Kim và Huyền Thiết.',
        stats: { atk: 150, critical: 0.15 }
    },
    'long_lan_giap': {
        id: 'long_lan_giap',
        name: 'Long Lân Giáp',
        type: 'defenseArtifact',
        icon: '🛡️',
        quality: 'Pháp Bảo',
        price: 85000,
        description: 'Giáp làm từ vảy giao long, phòng ngự kinh người. Đúc từ Da Lân Giáp và Yêu Thú Tinh Huyết.',
        stats: { def: 450, resistance: 0.3 }
    },

    // --- BEAST & INSECT ITEMS (NEW) ---
    'trung_hac_linh': {
        id: 'trung_hac_linh',
        name: 'Trứng Thanh Vân Hạc',
        type: 'beast_egg',
        icon: '🥚',
        quality: 'Pháp Khí',
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
        quality: 'Pháp Khí',
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
        quality: 'Linh Khí',
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
        quality: 'Phàm Khí',
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
        quality: 'Phàm Khí',
        price: 50,
        description: 'Thịt yêu thú tươi sống, linh thú rất thích ăn.',
        expGain: 50,
        loyaltyGain: 2
    },
    'van_thu_lenh': {
        id: 'van_thu_lenh',
        name: 'Vạn Thú Lệnh',
        type: 'supportArtifact',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 50000,
        description: 'Lệnh bài cổ xưa giúp tăng khả năng thuần phục yêu thú.',
        stats: { tamingBonus: 0.2 }
    },

    // --- BÍ PHÁP NGHỀ NGHIỆP (UNLOCKS) ---
    'bi_phap_alchemy': {
        id: 'bi_phap_alchemy',
        name: '« Đan Đạo Chân Giải »',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Ghi chép tinh túy của đan đạo, dùng để mở khóa nghề Luyện Đan.',
        effect: { type: 'unlock_profession', profession: 'alchemy' }
    },
    'bi_phap_talisman': {
        id: 'bi_phap_talisman',
        name: '« Thiên Phù Bí Lục »',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Chứa đựng bí mật của phù văn, dùng để mở khóa nghề Phù Lục.',
        effect: { type: 'unlock_profession', profession: 'talisman' }
    },
    'bi_phap_smithing': {
        id: 'bi_phap_smithing',
        name: '« Luyện Khí Tổng Cương »',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Bí tịch rèn đúc pháp bảo, dùng để mở khóa nghề Luyện Khí.',
        effect: { type: 'unlock_profession', profession: 'smithing' }
    },
    'bi_phap_formation': {
        id: 'bi_phap_formation',
        name: '« Trận Đạo Diễn Nghĩa »',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Giải mã các trận pháp cổ đại, dùng để mở khóa nghề Trận Pháp.',
        effect: { type: 'unlock_profession', profession: 'formation' }
    },
    'bi_phap_puppet': {
        id: 'bi_phap_puppet',
        name: '« Khôi Lỗi Chân Kinh »',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Bí thuật điều khiển rối, dùng để mở khóa nghề Khôi Lỗi.',
        effect: { type: 'unlock_profession', profession: 'puppet' }
    },
    'bi_phap_corpse': {
        id: 'bi_phap_corpse',
        name: '« Thi Đạo Quyển Thứ »',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Tà thuật luyện chế xác chết, dùng để mở khóa nghề Luyện Thi.',
        effect: { type: 'unlock_profession', profession: 'corpse' }
    },
    'bi_phap_beast': {
        id: 'bi_phap_beast',
        name: '« Ngự Thú Tâm Pháp »',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Tâm pháp dẫn dắt linh thú, dùng để mở khóa nghề Ngự Thú.',
        effect: { type: 'unlock_profession', profession: 'beast' }
    },
    'bi_phap_insect': {
        id: 'bi_phap_insect',
        name: '« Vạn Trùng Bí Truyền »',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Kỹ thuật nuôi dưỡng kỳ trùng, dùng để mở khóa nghề Khu Trùng.',
        effect: { type: 'unlock_profession', profession: 'insect' }
    },
    // --- TECHNIQUE BOOKS ---
    'truong_xuan_book': {
        id: 'truong_xuan_book',
        name: 'Sách: Trường Xuân Nạp Khí Quyết',
        type: 'book',
        icon: '📘',
        quality: 'Pháp Khí',
        price: 300,
        techniqueId: 'truong_xuan_nap_khi_quyet',
        description: 'Bản sao chép công pháp nhập môn phổ thông được lưu truyền rộng rãi trong Nhân Giới.'
    },
    'liet_duong_book': {
        id: 'liet_duong_book',
        name: 'Sách: Liệt Dương Công',
        type: 'book',
        icon: '📙',
        quality: 'Pháp Khí',
        price: 800,
        techniqueId: 'liet_duong_cong',
        description: 'Ghi chép phương pháp hấp thu Hỏa linh khí.'
    },
    'han_thuy_book': {
        id: 'han_thuy_book',
        name: 'Sách: Hàn Thủy Quyết',
        type: 'book',
        icon: '📗',
        quality: 'Pháp Khí',
        price: 800,
        techniqueId: 'han_thuy_quyet',
        description: 'Ghi chép phương pháp hấp thu Thủy linh khí.'
    },
    'thanh_moc_book': {
        id: 'thanh_moc_book',
        name: 'Sách: Thanh Mộc Tâm Kinh',
        type: 'book',
        icon: '📒',
        quality: 'Pháp Khí',
        price: 800,
        techniqueId: 'thanh_moc_tam_kinh',
        description: 'Ghi chép phương pháp hấp thu Mộc linh khí.'
    },
    'canh_kim_book': {
        id: 'canh_kim_book',
        name: 'Sách: Canh Kim Quyết',
        type: 'book',
        icon: '📖',
        quality: 'Pháp Khí',
        price: 800,
        techniqueId: 'canh_kim_quyet',
        description: 'Ghi chép phương pháp hấp thu Kim linh khí.'
    },
    'hau_tho_book': {
        id: 'hau_tho_book',
        name: 'Sách: Hậu Thổ Công',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Khí',
        price: 800,
        techniqueId: 'hau_tho_cong',
        description: 'Ghi chép phương pháp hấp thu Thổ linh khí.'
    },
    'man_nguu_book': {
        id: 'man_nguu_book',
        name: 'Sách: Man Ngưu Kình',
        type: 'book',
        icon: '🐂',
        quality: 'Pháp Khí',
        price: 1500,
        techniqueId: 'man_nguu_kinh',
        description: 'Bí pháp Luyện Thể sơ cấp, rèn luyện cơ bắp.'
    },
    'duong_than_book': {
        id: 'duong_than_book',
        name: 'Sách: Dưỡng Thần Quyết',
        type: 'book',
        icon: '🧠',
        quality: 'Pháp Khí',
        price: 2000,
        techniqueId: 'duong_than_quyet',
        description: 'Bí pháp Thần Thức sơ cấp, rèn luyện linh hồn.'
    },
    'cuu_chuyen_kim_than_book': {
        id: 'cuu_chuyen_kim_than_book',
        name: 'Sách: Cửu Chuyển Kim Thân',
        type: 'book',
        icon: '🔱',
        quality: 'Linh Khí',
        price: 12000,
        techniqueId: 'cuu_chuyen_kim_than',
        description: 'Bí pháp Luyện Thể trung cấp cực kỳ quý hiếm.'
    },
    'u_minh_book': {
        id: 'u_minh_book',
        name: 'Sách: U Minh Huy Ngạn',
        type: 'book',
        icon: '💀',
        quality: 'Linh Khí',
        price: 15000,
        techniqueId: 'u_minh_huy_ngan',
        description: 'Bí pháp Thần Thức trung cấp, tu luyện linh hồn.'
    },
    'recipe_than_tam': {
        id: 'recipe_than_tam',
        name: 'Đan Phương: Thanh Tâm Đan',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 2500,
        description: 'Ghi chép cách luyện chế Thanh Tâm Đan.',
        effect: { type: 'learn_recipe', value: 'thanh_tam_dan' }
    },
    'recipe_truc_co': {
        id: 'recipe_truc_co',
        name: 'Đan Phương: Trúc Cơ Đan',
        type: 'consumable',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        description: 'Ghi chép cách luyện chế Trúc Cơ Đan cực kỳ quý giá.',
        effect: { type: 'learn_recipe', value: 'truc_co_dan' }
    },
    'bp_tinh_ha': {
        id: 'bp_tinh_ha',
        name: 'Bản Vẽ: Tinh Hà Phi Kiếm',
        type: 'consumable',
        icon: '📜',
        quality: 'Linh Khí',
        price: 8000,
        description: 'Ghi chép phương pháp rèn Tinh Hà Phi Kiếm.',
        effect: { type: 'learn_smithing_recipe', value: 'phi_kiem_tinh_ha' }
    },
    'bp_long_lan': {
        id: 'bp_long_lan',
        name: 'Bản Vẽ: Long Lân Giáp',
        type: 'consumable',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 25000,
        description: 'Bản vẽ rèn Long Lân Giáp phòng ngự kinh người.',
        effect: { type: 'learn_smithing_recipe', value: 'long_lan_giap' }
    },
    'huyen_lu_item': {
        id: 'huyen_lu_item',
        name: 'Huyền Thiết Lư',
        type: 'cauldron',
        icon: '🏺',
        quality: 'Pháp Khí',
        price: 5000,
        description: 'Đan lư rèn từ huyền thiết, dẫn hỏa ổn định.',
        stats: { alchemyBonus: 0.1 }
    },
    'dia_lu_item': {
        id: 'dia_lu_item',
        name: 'Địa Long Phần Thiên Lư',
        type: 'cauldron',
        icon: '🏺',
        quality: 'Pháp Bảo',
        price: 35000,
        description: 'Chứa đựng tinh hoa chi lực của địa long, khống hỏa cực tốt.'
    },
    'thien_lu_item': {
        id: 'thien_lu_item',
        name: 'Thiên Cực Thái Hư Lư',
        type: 'cauldron',
        icon: '🏺',
        quality: 'Cổ Bảo',
        price: 150000,
        description: 'Lò luyện đỉnh cấp, ổn định hỏa lực đến mức hoàn mỹ.'
    },
    'van_lac_tam_viem_seed': {
        id: 'van_lac_tam_viem_seed',
        name: 'Vẫn Lạc Tâm Viêm (Chủng)',
        type: 'consumable',
        icon: '🔥',
        quality: 'Pháp Bảo',
        price: 120000,
        description: 'Hỏa chủng của Vẫn Lạc Tâm Viêm, tăng mạnh hiệu suất luyện đan.',
        effect: { type: 'refine_flame', value: 'van_lac_tam_viem' }
    },
    'tinh_lien_yeu_hoa_seed': {
        id: 'tinh_lien_yeu_hoa_seed',
        name: 'Tịnh Liên Yêu Hỏa (Chủng)',
        type: 'consumable',
        icon: '🔥',
        quality: 'Cổ Bảo',
        price: 800000,
        description: 'Yêu hỏa thần bí có khả năng tịnh hóa vạn vật.',
        effect: { type: 'refine_flame', value: 'tinh_lien_yeu_hoa' }
    },
    // --- RECIPES ---
    'recipe_ngung_khi': {
        id: 'recipe_ngung_khi',
        name: 'Đan Phương Ngưng Khí Đan',
        type: 'recipe',
        quality: 'Phàm Khí',
        icon: '📜',
        description: 'Ghi chép cách luyện chế Ngưng Khí Đan.',
        price: 200,
        recipeId: 'ngung_khi_dan'
    },
    'recipe_than_tam': {
        id: 'recipe_than_tam',
        name: 'Đan Phương Thanh Tâm Đan',
        type: 'recipe',
        quality: 'Pháp Khí',
        icon: '📜',
        description: 'Ghi chép cách luyện chế Thanh Tâm Đan.',
        price: 500,
        recipeId: 'thanh_tam_dan'
    },
    'recipe_truc_co': {
        id: 'recipe_truc_co',
        name: 'Đan Phương Trúc Cơ Đan',
        type: 'recipe',
        quality: 'Linh Khí',
        icon: '📜',
        description: 'Ghi chép cách luyện chế Trúc Cơ Đan cực kỳ quý giá.',
        price: 2000,
        recipeId: 'truc_co_dan'
    },
    'recipe_phi_kiem_tinh_ha': {
        id: 'recipe_phi_kiem_tinh_ha',
        name: 'Bản Vẽ Tinh Hà Phi Kiếm',
        type: 'recipe',
        quality: 'Pháp Khí',
        icon: '⚒️',
        description: 'Bản vẽ rèn đúc Tinh Hà Phi Kiếm.',
        price: 800,
        recipeId: 'phi_kiem_tinh_ha'
    },
    'recipe_long_lan_giap': {
        id: 'recipe_long_lan_giap',
        name: 'Bản Vẽ Long Lân Giáp',
        type: 'recipe',
        quality: 'Linh Khí',
        icon: '⚒️',
        description: 'Bản vẽ rèn đúc Long Lân Giáp.',
        price: 2500,
        recipeId: 'long_lan_giap'
    },

    // --- DANH KHÍ / TIÊN KHÍ / THÔNG THIÊN LINH BẢO (POEM ARTIFACTS) ---
    'vo_dinh_tieu_dao_cam': {
        id: 'vo_dinh_tieu_dao_cam',
        name: 'Vô Định Tiêu Dao Cầm',
        type: 'soulArtifact',
        quality: 'Danh Khí',
        image: 'artifacts/vo_dinh_tieu_dao_cam.png',
        description: 'Cây cầm thần bí, tiếng đàn có thể tàng hình sơn hà, tiêu diêu tự tại giữa trời đất.',
        price: 1000000,
        stats: { soulRepress: 100, soulExpSpeed: 2.5, spd: 50 },
        poem: ['Trần Thế Vô Nhiễm Ẩn Sơn Hà', 'Nhất Khúc Tiêu Giao Thiên Địa Gian']
    },
    'van_tinh_nho_quan': {
        id: 'van_tinh_nho_quan',
        name: 'Văn Tinh Nho Quán',
        type: 'defenseArtifact',
        quality: 'Danh Khí',
        image: 'artifacts/van_tinh_nho_quan.png',
        description: 'Mũ nho sĩ chứa đựng tinh túy của văn chương, hạo nhiên chính khí trấn áp tà ma.',
        price: 800000,
        stats: { def: 200, comprehension: 20, luck: 15 },
        poem: ['Nho Quán Nhất Tinh Diệu Thiên Địa', 'Hạo Nhiên Chính Khí Đãng Càn Khôn']
    },
    'that_thai_huyen_nghien': {
        id: 'that_thai_huyen_nghien',
        name: 'Thất Thái Huyền Nghiên',
        type: 'supportArtifact',
        quality: 'Danh Khí',
        image: 'artifacts/that_thai_huyen_nghien.png',
        description: 'Nghiên mực bảy màu, một điểm có thể định hình sơn hà, ghi chép thiên đạo.',
        price: 1500000,
        stats: { tuViSpeed: 3.0, daoVun: 50, luck: 30 },
        poem: ['Thất Thái Lưu Quang Thư Thiên Đạo', 'Huyền Nghiên Nhất Điểm Định Sơn Hà']
    },
    'te_hon_toa': {
        id: 'te_hon_toa',
        name: 'Tế Hồn Tỏa',
        type: 'attackArtifact',
        quality: 'Danh Khí',
        image: 'artifacts/te_hon_toa.png',
        description: 'Xiềng xích tế hồn, nhiếp lấy phách của vạn vật, khóa chặt u minh.',
        price: 1200000,
        stats: { atk: 300, soulPierce: 0.5, lifeSteal: 0.2 },
        poem: ['Tuế Hồn Nhiếp Phách Tỏa U Minh', 'Dị Kỷ Thương Địch Xá Kỳ Thủy']
    },
    'luyen_phong_thach': {
        id: 'luyen_phong_thach',
        name: 'Luyện Phong Thạch',
        type: 'attackArtifact',
        quality: 'Danh Khí',
        image: 'artifacts/luyen_phong_thach.png',
        description: 'Viên đá luyện từ cuồng phong, bách luyện thành binh, trảm phá càn khôn.',
        price: 900000,
        stats: { atk: 250, pierce: 0.4, spd: 80 },
        poem: ['Thiên Ma Bách Lệ Xuất Thần Binh', 'Càn Khôn Nhất Trảm Thùy Khả Đáng']
    },
    'kim_than_xa_loi': {
        id: 'kim_than_xa_loi',
        name: 'Kim Thân Xá Lợi',
        type: 'defenseArtifact',
        quality: 'Danh Khí',
        image: 'artifacts/kim_than_xa_loi.png',
        description: 'Hạt xá lợi kim thân, vạn pháp bất xâm, trấn giữ tâm ma.',
        price: 2000000,
        stats: { def: 500, hp: 2000, stability: 50 },
        poem: ['Kim Thân Hộ Thể Trấn Yêu Tà', 'Vạn Pháp Bất Xâm Xá Lợi Tâm']
    },
    'duong_kiem_ho': {
        id: 'duong_kiem_ho',
        name: 'Dưỡng Kiếm Hồ',
        type: 'supportArtifact',
        quality: 'Danh Khí',
        image: 'artifacts/duong_kiem_ho.png',
        description: 'Bầu rượu dưỡng kiếm, tàng chứa kiếm tiên, phong mang thấu càn khôn.',
        price: 1300000,
        stats: { atk: 150, critRate: 0.2, critDmg: 0.5 },
        poem: ['Phong Mang Nhất Hiện Hàn Cửu Châu', 'Càn Khôn Hồ Trung Tàn Kiếm Tiên']
    },
    'cuu_mach_linh_cham': {
        id: 'cuu_mach_linh_cham',
        name: 'Cửu Mạch Linh Châm',
        type: 'attackArtifact',
        quality: 'Danh Khí',
        image: 'artifacts/cuu_mach_linh_cham.png',
        description: 'Châm thần chín mạch, nghịch chuyển âm dương, hồi thiên tục mệnh.',
        price: 1100000,
        stats: { atk: 120, lifeSteal: 0.5, hp: 500 },
        poem: ['Linh Châm Cửu Chuyển Hoán Âm Dương', 'Nhất Niệm Hồi Thiên Tục Mệnh Nguyên']
    },
    'co_luyen_lung': {
        id: 'co_luyen_lung',
        name: 'Cổ Luyện Lũng',
        type: 'supportArtifact',
        quality: 'Danh Khí',
        image: 'artifacts/co_luyen_lung.png',
        description: 'Lồng nuôi cổ trùng cổ xưa, thực nhật nguyệt, chứa vạn độc thiên trùng.',
        price: 950000,
        stats: { atk: 100, murderQi: 30, poisonRes: 0.8 },
        poem: ['Cổ Luyện Nhất Thành Thực Nhật Nguyệt', 'Vạn Độc Thiên Trùng Dưỡng Lung Trung']
    },
    'chan_vu_nho_quan_ta': {
        id: 'chan_vu_nho_quan_ta',
        name: 'Chân Vũ Nho Quán (Tả)',
        type: 'defenseArtifact',
        quality: 'Linh Bảo',
        image: 'artifacts/chan_vu_nho_quan_ta.webp',
        description: 'Mũ Chân Vũ phía bên trái, chứa đựng một phần thần uy của Chân Vũ Đại Đế.',
        price: 425000,
        stats: { def: 100, hp: 300 }
    },
    'chan_vu_nho_quan_huu': {
        id: 'chan_vu_nho_quan_huu',
        name: 'Chân Vũ Nho Quán (Hữu)',
        type: 'defenseArtifact',
        quality: 'Linh Bảo',
        image: 'artifacts/chan_vu_nho_quan_huu.webp',
        description: 'Mũ Chân Vũ phía bên phải, chứa đựng một phần thần uy của Chân Vũ Đại Đế.',
        price: 425000,
        stats: { def: 100, hp: 300 }
    },
    'chan_vu_nho_quan': {
        id: 'chan_vu_nho_quan',
        name: 'Chân Vũ Nho Quán (Hoàn Thiện)',
        type: 'defenseArtifact',
        quality: 'Danh Khí',
        image: 'artifacts/chan_vu_nho_quan_full.webp', // Using right hand as representative
        description: 'Bản hoàn thiện của Chân Vũ Nho Quán, thập diện mai phục cũng bất cụ, chiến bát hoang.',
        price: 1700000,
        stats: { def: 500, hp: 2000, stability: 40 },
        poem: ['Thập Diện Mai Phục Hồn Bất Cụ', 'Chân Vũ Tại Thân Chiến Bát Hoang']
    },
    'bo_thien_lang': {
        id: 'bo_thien_lang',
        name: 'Bộ Thiên Lăng',
        type: 'flightArtifact',
        quality: 'Danh Khí',
        image: 'artifacts/bo_thien_lang.png',
        description: 'Dải lụa bước lên trời, tùy phong khởi vũ, đạp vân tiêu. Cùng cấp với [[phong_loi_si|Phong Lôi Sí]].',
        price: 1800000,
        stats: { spd: 150, luck: 20, tuViSpeed: 1.5 },
        poem: ['Lăng Vũ Cửu Thiên Tùy Phong Khởi', 'Cước Đạp Vân Tiêu Lộng Thái Hà']
    },
    'phong_loi_si': {
        id: 'phong_loi_si',
        name: 'Phong Lôi Sí',
        type: 'flightArtifact',
        quality: 'Danh Khí',
        image: 'artifacts/phong-loi-si.svg',
        description: 'Đôi cánh được luyện từ lông vũ của yêu thú lôi hệ và phong hệ cực hiếm. Tốc độ độn thuật vô song, nhưng yêu cầu người sử dụng phải lĩnh ngộ [[phong_loi_quyet_book|Phong Lôi Quyết]] hoặc các Lôi Pháp để làm nguồn năng lượng kích hoạt.',
        price: 2500000,
        stats: { spd: 500, avoidRate: 0.2 },
        requireThunder: true,
        poem: ['Phong Lôi Nhất Động Thiên Địa Biến', 'Sí Vũ Khinh Huy Diệu Cửu Tiêu']
    },
    'phong_loi_quyet_book': {
        id: 'phong_loi_quyet_book',
        name: 'Sách: Phong Lôi Quyết',
        type: 'book',
        quality: 'Linh Khí',
        icon: '📜',
        description: 'Bí tịch ghi chép lại tâm pháp Phong Lôi Quyết hiếm gặp, giúp tu sĩ sở hữu linh lực cuồng bạo của Lôi và tốc độ của Phong.',
        price: 500000,
        techniqueId: 'phong_loi_quyet'
    },
    'trung_thien_phong_ngan_uynh': {
        id: 'trung_thien_phong_ngan_uynh',
        name: 'Trứng Thiên Phong Ngân Uynh',
        type: 'consumable',
        icon: '🐞',
        quality: 'Pháp Bảo',
        price: 25000,
        description: 'Trứng của Thiên Phong Ngân Uynh, loại kỳ trùng quý hiếm bậc nhất, có khả năng xuyên thấu không gian và né tránh mọi công kích vật lý.'
    },
    'linh_thu_dai_so': {
        id: 'linh_thu_dai_so',
        name: 'Linh Thú Đại (Sơ)',
        type: 'artifact',
        icon: '👜',
        quality: 'Pháp Khí',
        price: 500,
        description: 'Túi chuyên dụng để chứa linh thú và kỳ trùng sơ cấp. Có thể chứa tối đa 3 con.'
    },
    'linh_thu_dai_trung': {
        id: 'linh_thu_dai_trung',
        name: 'Linh Thú Đại (Trung)',
        type: 'artifact',
        icon: '👜',
        quality: 'Linh Khí',
        price: 2500,
        description: 'Túi chứa linh thú trung cấp, được gia trì không gian trận pháp. Có thể chứa tối đa 10 con.'
    },
    'linh_thu_dai_cao': {
        id: 'linh_thu_dai_cao',
        name: 'Linh Thú Đại (Cao)',
        type: 'artifact',
        icon: '👜',
        quality: 'Pháp Bảo',
        price: 15000,
        description: 'Túi chứa linh thú cao cấp, bên trong có linh khí nồng đậm giúp linh thú phát triển. Có thể chứa tối đa 50 con.'
    },
    'trung_phe_kim_trung': {
        id: 'trung_phe_kim_trung',
        name: 'Trứng Phệ Kim Trùng',
        type: 'consumable',
        icon: '🥚',
        quality: 'Linh Bảo',
        price: 100000,
        description: 'Trứng của loài kỳ trùng đứng đầu bảng xếp hạng. Cực kỳ hiếm thấy và khó ấp nở.'
    },
    'trung_huyet_ngoc_tri_chu': {
        id: 'trung_huyet_ngoc_tri_chu',
        name: 'Trứng Huyết Ngọc Tri Chu',
        type: 'consumable',
        icon: '🥚',
        quality: 'Pháp Bảo',
        price: 15000,
        description: 'Trứng của loài nhện quý hiếm có tơ cực kỳ dẻo dai.'
    },
    'trung_bang_tam': {
        id: 'trung_bang_tam',
        name: 'Trứng Băng Tằm Thiên Niên',
        type: 'consumable',
        icon: '🥚',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Trứng của loài tằm sinh trưởng trong cực hàn chi địa.'
    },
    'nguyen_tu_cuc_son': {
        id: 'nguyen_tu_cuc_son',
        name: 'Nguyên Từ Cực Sơn',
        type: 'defenseArtifact',
        quality: 'Tiên Khí',
        image: 'artifacts/nguyen-tu-cuc-son.svg',
        description: 'Ngọn núi xám đen chứa đựng lực lượng Nguyên Từ, có thể khắc chế vạn pháp ngũ hành, trấn áp trọng lực. Là một trong 5 thành phần để luyện chế [[nguyen_hop_ngu_cuc_son|Nguyên Hợp Ngũ Cực Sơn]].',
        price: 1500000,
        stats: { def: 600, hp: 1500, gravityRes: 0.5 },
        action: 'combine_ngu_cuc_son'
    },
    'bac_cuc_nguyen_quang_cuc_son': {
        id: 'bac_cuc_nguyen_quang_cuc_son',
        name: 'Bắc Cực Nguyên Quang Cực Sơn',
        type: 'attackArtifact',
        quality: 'Tiên Khí',
        image: 'artifacts/bac-cuc-nguyen-quang-cuc-son.webp',
        description: 'Ngọn núi kết tinh từ Bắc Cực Nguyên Quang, ánh sáng xuyên thấu vạn vật. Là một trong 5 thành phần để luyện chế [[nguyen_hop_ngu_cuc_son|Nguyên Hợp Ngũ Cực Sơn]].',
        price: 1500000,
        stats: { atk: 600, pierce: 0.5 },
        action: 'combine_ngu_cuc_son'
    },
    'hao_am_han_phach_cuc_son': {
        id: 'hao_am_han_phach_cuc_son',
        name: 'Hạo Âm Hàn Phách Cực Sơn',
        type: 'defenseArtifact',
        quality: 'Tiên Khí',
        image: 'artifacts/hao-am-han-phach-cuc-son.svg',
        description: 'Ngọn núi chứa đựng cực hạn hàn khí, đông cứng thần hồn. Là một trong 5 thành phần để luyện chế [[nguyen_hop_ngu_cuc_son|Nguyên Hợp Ngũ Cực Sơn]].',
        price: 1500000,
        stats: { def: 400, iceDmg: 200, soulRepress: 0.3 },
        action: 'combine_ngu_cuc_son'
    },
    'thai_at_thanh_quang_cuc_son': {
        id: 'thai_at_thanh_quang_cuc_son',
        name: 'Thái Ất Thanh Quang Cực Sơn',
        type: 'attackArtifact',
        quality: 'Tiên Khí',
        image: 'artifacts/thai-at-thanh-quang-cuc-son.svg',
        description: 'Ngọn núi tỏa ra Thái Ất Thanh Quang, vô cùng sắc bén. Là một trong 5 thành phần để luyện chế [[nguyen_hop_ngu_cuc_son|Nguyên Hợp Ngũ Cực Sơn]].',
        price: 1500000,
        stats: { atk: 500, spd: 100 },
        action: 'combine_ngu_cuc_son'
    },
    'am_duong_dai_ngu_hanh_cuc_son': {
        id: 'am_duong_dai_ngu_hanh_cuc_son',
        name: 'Âm Dương Đại Ngũ Hành Cực Sơn',
        type: 'supportArtifact',
        quality: 'Tiên Khí',
        image: 'artifacts/am-duong-dai-ngu-hanh-cuc-son.svg',
        description: 'Ngọn núi dung hợp Âm Dương và Ngũ Hành, cân bằng linh khí. Là một trong 5 thành phần để luyện chế [[nguyen_hop_ngu_cuc_son|Nguyên Hợp Ngũ Cực Sơn]].',
        price: 1500000,
        stats: { allRes: 0.2, tuViSpeed: 2.0 },
        action: 'combine_ngu_cuc_son'
    },
    'nguyen_hop_ngu_cuc_son': {
        id: 'nguyen_hop_ngu_cuc_son',
        name: 'Nguyên Hợp Ngũ Cực Sơn',
        type: 'attackArtifact',
        quality: 'Danh Khí',
        image: 'artifacts/nguyen-hop-ngu-cuc-son.svg',
        description: 'Bảo vật trấn phái được hợp nhất từ: [[nguyen_tu_cuc_son|Nguyên Từ]], [[bac_cuc_nguyen_quang_cuc_son|Bắc Cực]], [[hao_am_han_phach_cuc_son|Hạo Âm]], [[thai_at_thanh_quang_cuc_son|Thái Ất]] và [[am_duong_dai_ngu_hanh_cuc_son|Âm Dương]]. Uy lực trấn áp càn khôn.',
        price: 10000000,
        stats: { atk: 3000, def: 2000, hp: 5000, pierce: 0.8, allRes: 0.5 },
        action: 'separate_ngu_cuc_son',
        poem: ['Ngũ Sơn Hợp Nhất Trấn Càn Khôn', 'Vạn Pháp Quy Nguyên Hóa Hư Không']
    },
    'linh_thu_dai_so': {
        id: 'linh_thu_dai_so',
        name: 'Linh Thú Đại (Sơ)',
        type: 'supportArtifact',
        icon: '👜',
        quality: 'Pháp Khí',
        price: 1000,
        description: 'Túi chuyên dụng dùng để chứa và nuôi dưỡng linh thú, kỳ trùng cấp thấp. Không gian bên trong ổn định, giúp linh thú nghỉ ngơi hồi phục.'
    },
    'linh_thu_dai_trung': {
        id: 'linh_thu_dai_trung',
        name: 'Linh Thú Đại (Trung)',
        type: 'supportArtifact',
        icon: '👜',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Túi linh thú cấp trung, có thể chứa được các loại linh thú có linh tính cao hơn. Linh khí bên trong dồi dào, hỗ trợ linh thú thăng cấp.'
    },
    'linh_thu_dai_cao': {
        id: 'linh_thu_dai_cao',
        name: 'Linh Thú Đại (Cao)',
        type: 'supportArtifact',
        icon: '👜',
        quality: 'Pháp Bảo',
        price: 20000,
        description: 'Túi linh thú cao cấp, có thể chứa được các loại thần thú hoặc kỳ trùng vương cấp. Có tác dụng bảo hộ linh tính và ngăn chặn phản phệ.'
    },
    'egg_phe_kim_trung': {
        id: 'egg_phe_kim_trung',
        name: 'Trứng Phệ Kim Trùng',
        type: 'beast_egg',
        beastId: 'phe_kim_trung',
        image: 'aberrations/phe-kim-trung.svg',
        icon: '🥚',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Trứng của Phệ Kim Trùng, một loại kỳ trùng nổi tiếng với khả năng thôn phệ vạn vật, ngay cả pháp bảo cũng khó thoát khỏi hàm răng của chúng.'
    },
    'egg_bang_tam': {
        id: 'egg_bang_tam',
        name: 'Trứng Băng Tằm',
        type: 'beast_egg',
        beastId: 'bang_tam',
        image: 'aberrations/bang-tam.svg',
        icon: '🥚',
        quality: 'Pháp Khí',
        price: 1500,
        description: 'Trứng của Băng Tằm, sinh vật sống ở vùng cực hàn. Tơ của chúng là nguyên liệu quý để dệt nên các loại pháp y phòng ngự cực cao.'
    },
    'egg_huyet_ngoc_tri_chu': {
        id: 'egg_huyet_ngoc_tri_chu',
        name: 'Trứng Huyết Ngọc Tri Chu',
        type: 'beast_egg',
        beastId: 'huyet_ngoc_tri_chu',
        image: 'aberrations/huyet-ngoc-tri-chu.svg',
        icon: '🥚',
        quality: 'Pháp Khí',
        price: 2000,
        description: 'Trứng của Huyết Ngọc Tri Chu, loại nhện mang huyết mạch cổ xưa, nọc độc vô cùng bạo liệt và tơ nhện dẻo dai khó đứt.'
    },
    'egg_kim_giap_hac': {
        id: 'egg_kim_giap_hac',
        name: 'Trứng Kim Giáp Hạc',
        type: 'beast_egg',
        beastId: 'kim_giap_hac',
        image: 'aberrations/kim-giap-hac.svg',
        icon: '🥚',
        quality: 'Pháp Khí',
        price: 3000,
        description: 'Trứng của Kim Giáp Hạc, loài linh hạc có lớp lông cứng như kim loại, tốc độ bay cực nhanh và rất trung thành.'
    },
    'egg_huyen_diem_nga': {
        id: 'egg_huyen_diem_nga',
        name: 'Trứng Huyền Diệm Nga',
        type: 'beast_egg',
        beastId: 'huyen_diem_nga',
        image: 'aberrations/huyen-diem-nga.svg',
        icon: '🥚',
        quality: 'Pháp Khí',
        price: 1500,
        description: 'Trứng của Huyền Diệm Nga, loài bướm đêm mang hỏa tính, có khả năng phun ra hỏa độc gây ảo giác.'
    },
    'egg_loi_bang': {
        id: 'egg_loi_bang',
        name: 'Trứng Lôi Bằng',
        type: 'beast_egg',
        beastId: 'loi_bang',
        image: 'aberrations/loi-bang.svg',
        icon: '🥚',
        quality: 'Linh Khí',
        price: 8000,
        description: 'Trứng của Lôi Bằng, loài chim khổng lồ mang theo sức mạnh lôi đình, khi trưởng thành có thể sải cánh vạn dặm.'
    },
    'egg_thien_phong_ngan_uynh': {
        id: 'egg_thien_phong_ngan_uynh',
        name: 'Trứng Thiên Phong Ngân Uynh',
        type: 'beast_egg',
        beastId: 'thien_phong_ngan_uynh',
        icon: '🥚',
        quality: 'Pháp Bảo',
        price: 25000,
        description: 'Trứng của Thiên Phong Ngân Uynh, loại kỳ trùng quý hiếm bậc nhất, có khả năng xuyên thấu không gian và né tránh mọi công kích vật lý.'
    },
    'item_thien_kiem_tong_t': {
        id: 'item_thien_kiem_tong_t',
        name: '« Cổ Tịch: Thiên Kiếm Quyết »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Khí',
        price: 10000,
        techniqueId: 'thien_kiem_tong_cong_phap',
        description: 'Bản sách cổ ghi chép công pháp tối cao của Thiên Kiếm Tông. Lực công kích và tốc độ bộc phát sắc bén.'
    },
    'item_thien_kiem_tong_s': {
        id: 'item_thien_kiem_tong_s',
        name: '« Bí Tịch: Vạn Kiếm Quy Tông »',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        secretId: 'thien_kiem_tong_bi_tich',
        description: 'Mật cuộn khắc ghi bí pháp kiếm đạo tối cao của Thiên Kiếm Tông, triệu gọi cự đại kiếm trận càn quét quần hùng.'
    },
    'item_hoang_phong_coc_t': {
        id: 'item_hoang_phong_coc_t',
        name: '« Sách Cổ: Hoàng Phong Thần Sa Quyết »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Khí',
        price: 10000,
        techniqueId: 'hoang_phong_coc_cong_phap',
        description: 'Bản cổ thư ghi chép Hoàng Phong Thần Sa Quyết độc quyền của Hoàng Phong Cốc, điều khiển cuồng sa bảo vệ bản tôn.'
    },
    'item_hoang_phong_coc_s': {
        id: 'item_hoang_phong_coc_s',
        name: '« Bí Tịch: Hoàng Phong Thần Sa »',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        secretId: 'hoang_phong_coc_bi_tich',
        description: 'Cuộn bí kíp ghi chép pháp thuật cát bụi Hoàng Phong Thần Sa quấn nhiễu phong tỏa linh hồn và làm choáng đối thủ.'
    },
    'item_huyen_am_coc_t': {
        id: 'item_huyen_am_coc_t',
        name: '« Cổ Tịch: Huyền Âm Chân Kinh »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Khí',
        price: 10000,
        techniqueId: 'huyen_am_coc_cong_phap',
        description: 'U minh tà thư Huyền Âm Cốc, tu luyện tích lũy u minh khí cực thịnh bồi bổ sinh lực.'
    },
    'item_huyen_am_coc_s': {
        id: 'item_huyen_am_coc_s',
        name: '« Bí Tịch: Huyền Âm Quỷ Trảo »',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        secretId: 'huyen_am_coc_bi_tich',
        description: 'Bí kíp âm sát quỷ trảo truyền kỳ của Huyền Âm Cốc, hấp thụ huyết tinh sinh mệnh kẻ địch để hồi phục Khí Huyết.'
    },
    'item_yem_nguyet_tong_t': {
        id: 'item_yem_nguyet_tong_t',
        name: '« Sách Cổ: Yểm Nguyệt Song Tu Quyết »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Khí',
        price: 10000,
        techniqueId: 'yem_nguyet_tong_cong_phap',
        description: 'Kỳ thư điều hòa âm dương nổi danh đệ nhất của Yểm Nguyệt Tông, tăng tốc tu vi vùn vụt.'
    },
    'item_yem_nguyet_tong_s': {
        id: 'item_yem_nguyet_tong_s',
        name: '« Bí Tịch: Mị Ảnh Hoặc Thần »',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        secretId: 'yem_nguyet_tong_bi_tich',
        description: 'Bản mật tịch chứa đựng ảo thuật Nguyệt Minh phong bế thức thần đối phương trong 1 lượt.'
    },
    'item_lac_van_tong_t': {
        id: 'item_lac_van_tong_t',
        name: '« Cổ Tịch: Lạc Vân Kiếm Trận Biện »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Khí',
        price: 10000,
        techniqueId: 'lac_van_tong_cong_phap',
        description: 'Phương pháp ngự kiếm kết trận Lạc Vân Tông, mộc linh hộ thể dồi dào sinh cơ.'
    },
    'item_lac_van_tong_s': {
        id: 'item_lac_van_tong_s',
        name: '« Bí Tịch: Tử Cực Thần Quang »',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        secretId: 'lac_van_tong_bi_tich',
        description: 'Tuyệt diệu quang sát pháp nhắm thẳng vào linh thể kẻ thù, phá sạch phòng ngự giáp sắt.'
    },
    'item_thien_tinh_tong_t': {
        id: 'item_thien_tinh_tong_t',
        name: '« Cổ Tịch: Thiên Tinh Trận Pháp Quyết »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Khí',
        price: 10000,
        techniqueId: 'thien_tinh_tong_cong_phap',
        description: 'Tuyệt kỹ trận pháp bảo vệ sơn môn danh bất hư truyền của Thiên Tinh Tông, tăng mạnh phòng thủ trận đạo.'
    },
    'item_thien_tinh_tong_s': {
        id: 'item_thien_tinh_tong_s',
        name: '« Bí Tịch: Ngũ Hành Huyền Thuẫn »',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        secretId: 'thien_tinh_tong_bi_tich',
        description: 'Phương pháp bố trận kết thuẫn hấp thụ toàn bộ oanh kích bằng 35% máu tối đa.'
    },
    'item_linh_thu_son_t': {
        id: 'item_linh_thu_son_t',
        name: '« Sách Cổ: Linh Thú Vạn Thú Quyết »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Khí',
        price: 10000,
        techniqueId: 'linh_thu_son_cong_phap',
        description: 'Tâm pháp cộng sinh cùng linh thú hoang dã Linh Thú Sơn, cường tráng khí huyết.'
    },
    'item_linh_thu_son_s': {
        id: 'item_linh_thu_son_s',
        name: '« Bí Tịch: Thú Huyết Cuồng Bạo »',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        secretId: 'linh_thu_son_bi_tich',
        description: 'Bí thuật kích hoạt ma thú linh huyết, tăng vọt công lực vật lý và hồi huyết tức thời.'
    },
    'item_thanh_hu_mon_t': {
        id: 'item_thanh_hu_mon_t',
        name: '« Cổ Tịch: Thanh Hư Đạo Nguyên Kinh »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Khí',
        price: 10000,
        techniqueId: 'thanh_hu_mon_cong_phap',
        description: 'Mật điên tiên đạo dưỡng thần của Thanh Hư Môn, khí tức thanh khiết dồi dào mana.'
    },
    'item_thanh_hu_mon_s': {
        id: 'item_thanh_hu_mon_s',
        name: '« Bí Tịch: Thanh Hư Ngọc Lộ »',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        secretId: 'thanh_hu_mon_bi_tich',
        description: 'Thuật pháp hồi linh đỉnh cấp, bổ sung 25% tối đa máu lẫn linh lực cho bản tôn.'
    },
    'item_cu_kiem_mon_t': {
        id: 'item_cu_kiem_mon_t',
        name: '« Sách Cổ: Cự Kiếm Cương Thiết Thể »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Khí',
        price: 10000,
        techniqueId: 'cu_kiem_mon_cong_phap',
        description: 'Rèn luyện cơ bắp tráng nhục thể Cự Kiếm Môn, gia tăng cực thịnh công kích và giáp cốt.'
    },
    'item_cu_kiem_mon_s': {
        id: 'item_cu_kiem_mon_s',
        name: '« Bí Tịch: Cự Kiếm Trảm Thiên »',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        secretId: 'cu_kiem_mon_bi_tich',
        description: 'Cuộn trọng kiếm thiên pháp, chém xuống sát thương cực đại và cơ hội bạo kích chí mạng cực cao.'
    },
    'item_hoa_dao_o_t': {
        id: 'item_hoa_dao_o_t',
        name: '« Cổ Tịch: Hóa Đao Thần Công »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Khí',
        price: 10000,
        techniqueId: 'hoa_dao_o_cong_phap',
        description: 'Bộ đao pháp tối cao Hóa Đao Ổ, đao thế cuồng phong chém rách linh lực địch thủ.'
    },
    'item_hoa_dao_o_s': {
        id: 'item_hoa_dao_o_s',
        name: '« Bí Tịch: Đao Kình Thương Không »',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        secretId: 'hoa_dao_o_bi_tich',
        description: 'Bí điển vung đao xé gió Hóa Đao Ổ, gây sát thương khổng lồ kèm vết rách chảy máu kinh mạch đối phương.'
    },
    'item_thien_khuyet_bao_t': {
        id: 'item_thien_khuyet_bao_t',
        name: '« Cổ Tịch: Thiên Khuyết Hộ Thể Thuẫn »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Khí',
        price: 10000,
        techniqueId: 'thien_khuyet_bao_cong_phap',
        description: 'Tuyệt đỉnh hộ thể cương khí Thiên Khuyết Bảo, tạo thành lũy phòng ngự bất khả xâm phạm.'
    },
    'item_thien_khuyet_bao_s': {
        id: 'item_thien_khuyet_bao_s',
        name: '« Bí Tịch: Thiên Khuyết Kim Giáp »',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        secretId: 'thien_khuyet_bao_bi_tich',
        description: 'Cuộn bí thuật hóa giáp vàng kiên cố bao bọc cơ thể, tăng mạnh 50% phòng ngự toàn diện.'
    },
    'item_quy_linh_mon_t': {
        id: 'item_quy_linh_mon_t',
        name: '« Sách Cổ: Quỷ Âm Huyền Pháp »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Khí',
        price: 10000,
        techniqueId: 'quy_linh_mon_cong_phap',
        description: 'Bản sao tà học Quỷ Linh Môn, tăng oai lực công kích ma thuật cùng độc đạo thăng cấp nhanh.'
    },
    'item_quy_linh_mon_s': {
        id: 'item_quy_linh_mon_s',
        name: '« Bí Tịch: Vạn Quỷ Cắn Xé »',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        secretId: 'quy_linh_mon_bi_tich',
        description: 'Sai khiến vạn linh âm quỷ cắn xé kinh mạch kẻ thù, rút máu và găm sâu độc tố ăn mòn.'
    },
    'item_hop_hoan_tong_t': {
        id: 'item_hop_hoan_tong_t',
        name: '« Sách Cổ: Âm Dương Hoan Lạc Quyết »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Khí',
        price: 10000,
        techniqueId: 'hop_hoan_tong_cong_phap',
        description: 'Kỳ thư đoạt tinh phách điên cuồng bậc nhất của Hợp Hoan Tông, đúc tinh nguyên và tốc độ.'
    },
    'item_hop_hoan_tong_s': {
        id: 'item_hop_hoan_tong_s',
        name: '« Bí Tịch: Mị Hoặc Chúng Sinh »',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        secretId: 'hop_hoan_tong_bi_tich',
        description: 'Hương mị mê hoặc tinh thần chúng sinh, suy giảm nặng nề tốc độ đối phương.'
    },
    'item_ma_diem_mon_t': {
        id: 'item_ma_diem_mon_t',
        name: '« Cổ Tịch: Thanh Dương Ma Hỏa Kinh »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Khí',
        price: 10000,
        techniqueId: 'ma_diem_mon_cong_phap',
        description: 'Hỏa ma bí pháp thiêu rụi kinh mạch Ma Diễm Môn, công kích cực đoan vô song.'
    },
    'item_ma_diem_mon_s': {
        id: 'item_ma_diem_mon_s',
        name: '« Bí Tịch: U Minh Địa Hỏa »',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        secretId: 'ma_diem_mon_bi_tich',
        description: 'Triệu hồi dung nham u minh nóng cháy, bộc phá sát thương thiêu đốt rực rỡ.'
    },
    'item_thien_sat_tong_t': {
        id: 'item_thien_sat_tong_t',
        name: '« Sách Cổ: Thiên Sát Ma Quyết »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Khí',
        price: 10000,
        techniqueId: 'thien_sat_tong_cong_phap',
        description: 'Huyết ma bá công Thiên Sát Tông, lấy huyết hóa ma sát tăng vọt sức mạnh cuồng bạo.'
    },
    'item_thien_sat_tong_s': {
        id: 'item_thien_sat_tong_s',
        name: '« Bí Tịch: Sát Khí Xung Thiên »',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        secretId: 'thien_sat_tong_bi_tich',
        description: 'Cuộn bí kíp bọc nhiếp ma sát cuồng nộ, gia tăng mạnh mẽ 30% công kích vật lý.'
    },
    'item_ngu_linh_tong_t': {
        id: 'item_ngu_linh_tong_t',
        name: '« Sách Cổ: Vạn Côn Ngự Trùng Thuật »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Khí',
        price: 10000,
        techniqueId: 'ngu_linh_tong_cong_phap',
        description: 'Bí thuật ngự trùng dưỡng độc côn độc môn Ngự Linh Tông, gia tăng máu sinh dồi dào.'
    },
    'item_ngu_linh_tong_s': {
        id: 'item_ngu_linh_tong_s',
        name: '« Bí Tịch: Phệ Linh Ma Trùng »',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        secretId: 'ngu_linh_tong_bi_tich',
        description: 'Thả bầy trùng độc phệ linh cắn nuốt oanh tạc giáp phòng ngự đối phương.'
    },
    'item_khoi_am_tong_t': {
        id: 'item_khoi_am_tong_t',
        name: '« Sách Cổ: Khôi Lỗi U Minh Kinh »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Khí',
        price: 10000,
        techniqueId: 'khoi_am_tong_cong_phap',
        description: 'U Linh khôi lỗi thuật pháp Khôi Âm Tông, tích lũy u minh âm khí luyện xác vững chắc.'
    },
    'item_khoi_am_tong_s': {
        id: 'item_khoi_am_tong_s',
        name: '« Bí Tịch: Bộc Phá Thi Khôi »',
        type: 'book',
        icon: '📜',
        quality: 'Pháp Bảo',
        price: 15000,
        secretId: 'khoi_am_tong_bi_tich',
        description: 'Tuyệt kỹ sai sử khôi lỗi tự bộc sát thương cực đoan xé tan giáp cốt địch thủ và gây choáng.'
    },
    'ban_long_bang_ngoc_nghien': {
        id: 'ban_long_bang_ngoc_nghien',
        name: 'Bàn Long Băng Ngọc Nghiễn',
        type: 'soulArtifact',
        image: 'artifacts/ban_long_bang_ngoc_nghien.webp',
        quality: 'Linh Bảo',
        price: 80000,
        description: 'Nghiễn mực cổ được chạm khắc hình rồng cuộn, bên trong ngưng tụ băng ngọc vạn năm. Khi mài mực, hàn khí tỏa ra có thể đóng băng thần thức kẻ địch.',
        stats: { spirit: 800, def: 200, maxMana: 500 },
        poem: ['Bàn Long Ngọc Nghiễn Hàn Sương Mặc', 'Nhất Bút Phong Ba Định Càn Khôn']
    },
    'giac_tien_bich_ngoc_cam': {
        id: 'giac_tien_bich_ngoc_cam',
        name: 'Giác Tiên Bích Ngọc Cầm',
        type: 'supportArtifact',
        image: 'artifacts/giac_tien_bich_ngoc_cam.webp',
        quality: 'Linh Bảo',
        price: 120000,
        description: 'Cây đàn cổ bằng bích ngọc, tương truyền do tiên nhân để lại. Âm thanh phát ra có thể an định tâm thần, tăng tốc tu luyện và mê hoặc yêu thú.',
        stats: { spirit: 600, tuViSpeed: 0.15, qiAbsorb: 200 },
        poem: ['Bích Ngọc Cầm Thanh Nhập Cửu Tiêu', 'Giác Tiên Nhất Khúc Vạn Ma Tiêu']
    },
    'huyen_kim_long_tu_kiem': {
        id: 'huyen_kim_long_tu_kiem',
        name: 'Huyền Kim Long Tử Kiếm',
        type: 'attackArtifact',
        image: 'artifacts/huyen_kim_long_tu_kiem.webp',
        quality: 'Thông Thiên Linh Bảo',
        price: 200000,
        description: 'Kiếm cổ được rèn từ huyền kim, thân kiếm khắc long văn phát sáng tử quang. Một khi rút kiếm, long khí cuồn cuộn, kiếm khí xuyên phá vạn pháp.',
        stats: { atk: 5000, spd: 300, critChance: 0.15, critDamage: 0.5 },
        poem: ['Huyền Kim Tử Khí Xung Tiêu Hán', 'Long Tử Nhất Kiếm Phá Thiên Hà']
    },
    'kim_o_ly_hoa_phien': {
        id: 'kim_o_ly_hoa_phien',
        name: 'Kim Ô Ly Hỏa Phiến',
        type: 'attackArtifact',
        image: 'artifacts/kim_o_ly_hoa_phien.webp',
        quality: 'Cổ Bảo',
        price: 90000,
        description: 'Quạt phiến cổ được đúc từ lông vũ Kim Ô (quạ vàng thần thoại). Phất một cái có thể triệu hồi ly hỏa thiêu đốt vạn vật trong phạm vi rộng.',
        stats: { atk: 3500, maxMana: 300 },
        poem: ['Kim Ô Phiến Động Ly Hỏa Sinh', 'Thiên Địa Hồng Lô Luyện Quần Ma']
    },
    'ly_ho_hieu_tien_lenh': {
        id: 'ly_ho_hieu_tien_lenh',
        name: 'Ly Hồ Hiệu Tiên Lệnh',
        type: 'formationArtifact',
        image: 'artifacts/ly_ho_hieu_tien_lenh.webp',
        quality: 'Linh Bảo',
        price: 100000,
        description: 'Lệnh bài cổ có hình ly hồ (cáo lửa), có thể triệu hoán ảo ảnh ly hồ hỗ trợ tác chiến và bày binh bố trận cực kỳ linh hoạt.',
        stats: { spirit: 500, atk: 1500, spd: 200 },
        poem: ['Ly Hồ Hiệu Lệnh Triệu Ảo Binh', 'Tiên Đạo Trận Pháp Trấn Quần Yêu']
    },
    'moc_long_phap_bao': {
        id: 'moc_long_phap_bao',
        name: 'Mộc Long',
        type: 'defenseArtifact',
        image: 'artifacts/moc_long.webp',
        quality: 'Cổ Bảo',
        price: 85000,
        description: 'Tượng mộc long cổ xưa, được chạm khắc từ thân cây thần mộc vạn năm. Có thể triệu hoán mộc long hộ thể, tăng cường phòng ngự và hồi phục sinh lực.',
        stats: { def: 2000, maxHp: 3000, lifespan: 100 },
        poem: ['Thần Mộc Hóa Long Trấn Bát Phương', 'Vạn Niên Cổ Thụ Hộ Thương Sinh']
    },
    'ngoc_long_tuyen': {
        id: 'ngoc_long_tuyen',
        name: 'Ngọc Long Tuyền',
        type: 'spaceArtifact',
        image: 'artifacts/ngoc_long_tuyen.webp',
        quality: 'Linh Bảo',
        price: 150000,
        description: 'Suối rồng ngọc thu nhỏ trong không gian riêng, có thể mở ra một tiểu thế giới chứa đầy linh khí thuần khiết, hỗ trợ tu luyện và bảo quản linh vật.',
        stats: { qiAbsorb: 500, tuViSpeed: 0.2, slots: 30 },
        poem: ['Ngọc Long Tuyền Dũng Linh Khí Sinh', 'Nhất Phương Tiểu Thế Giới Tàng Thiên']
    },
    'thien_dao_bi': {
        id: 'thien_dao_bi',
        name: 'Thiên Đạo Bi',
        type: 'soulArtifact',
        image: 'artifacts/thien_dao_bi.webp',
        quality: 'Thông Thiên Linh Bảo',
        price: 250000,
        description: 'Bia đá cổ khắc thiên đạo chân lý, chứa đựng ngộ tính của tiền bối đại năng. Ai đọc được sẽ ngộ ra thiên đạo, thần thức tăng vọt.',
        stats: { spirit: 2000, breakthroughRate: 0.1, tuViSpeed: 0.25 },
        poem: ['Thiên Đạo Bi Văn Hàm Chân Lý', 'Đại Đạo Vô Hình Khả Ngộ Tâm']
    },
    'tinh_hoa_nguyet_dai': {
        id: 'tinh_hoa_nguyet_dai',
        name: 'Tinh Hoa Nguyệt Đài',
        type: 'flightArtifact',
        image: 'artifacts/tinh_hoa_nguyet_dai.webp',
        quality: 'Cổ Bảo',
        price: 95000,
        description: 'Đài nguyệt cổ ngưng tụ tinh hoa nhật nguyệt, có thể bay lượn tự do trên không trung. Ánh sáng tinh hoa bao phủ giúp tăng tốc phi hành.',
        stats: { spd: 500, def: 500, luck: 50 },
        poem: ['Tinh Hoa Nguyệt Đài Phiêu Diêu Du', 'Nhật Nguyệt Tinh Quang Chiếu Cửu Châu']
    },
    'van_thuy_luu_ly_binh': {
        id: 'van_thuy_luu_ly_binh',
        name: 'Vạn Thủy Lưu Ly Bình',
        type: 'defenseArtifact',
        image: 'artifacts/van_thuy_luu_ly_binh.webp',
        quality: 'Linh Bảo',
        price: 130000,
        description: 'Bình lưu ly chứa vạn thủy, có thể hấp thu mọi công kích thủy hệ và phản hồi lại kẻ địch. Nước trong bình có tác dụng tịnh hóa tà khí.',
        stats: { def: 3000, maxHp: 2000, maxMana: 800 },
        poem: ['Vạn Thủy Lưu Ly Tịnh Thiên Địa', 'Nhất Bình Thu Tận Vạn Hà Triều']
    },
    'egg_giao_long': {
        id: 'egg_giao_long',
        name: 'Trứng Giao Long',
        type: 'beast_egg',
        beastId: 'giao_long',
        icon: '🥚',
        quality: 'Thông Thiên Linh Bảo',
        price: 50000,
        description: 'Trứng của Giao Long thượng cổ, vỏ trứng phủ vảy rồng phát ra thủy khí cuồn cuộn, vô cùng quý hiếm.'
    },
    'egg_hac_xa': {
        id: 'egg_hac_xa',
        name: 'Trứng Hắc Xà',
        type: 'beast_egg',
        beastId: 'hac_xa',
        icon: '🥚',
        quality: 'Linh Khí',
        price: 15000,
        description: 'Trứng của Hắc Xà vạn năm, vỏ trứng đen bóng như hắc ngọc, tỏa ra kịch độc nhẹ.'
    },
    'egg_hoa_viem': {
        id: 'egg_hoa_viem',
        name: 'Trứng Hỏa Viêm Thú',
        type: 'beast_egg',
        beastId: 'hoa_viem',
        icon: '🔥',
        quality: 'Linh Khí',
        price: 12000,
        description: 'Trứng của Hỏa Viêm Thú, ấm nóng như hòn than, liên tục tỏa ra hỏa diễm nhỏ.'
    },
    'co_dai': {
        id: 'co_dai',
        name: 'Cỏ Dại',
        type: 'material',
        icon: '🌱',
        quality: 'Phàm Khí',
        price: 1,
        description: 'Cỏ dại mọc ven đường, không có linh khí.'
    },
    'linh_chi_tien_cao': {
        id: 'linh_chi_tien_cao',
        name: 'Linh Chi Tiên Thảo',
        type: 'consumable',
        icon: '🍄',
        quality: 'Linh Khí',
        price: 3000,
        description: 'Linh chi ngàn năm mọc trên vách núi hiểm trở, hàm chứa tinh khí đất trời, uống vào thần thức thanh minh.',
        effect: { spirit: 50, maxMana: 200 }
    },
    'thien_sam': {
        id: 'thien_sam',
        name: 'Thiên Sâm Vạn Năm',
        type: 'consumable',
        icon: '🌿',
        quality: 'Pháp Bảo',
        price: 50000,
        description: 'Nhân sâm trời đất tích tụ linh khí vạn năm, hình người hoàn chỉnh, uống vào cải tạo cân cốt.',
        effect: { maxHp: 2000, maxMana: 1000, spirit: 200 }
    },
    'han_ngoc_thach': {
        id: 'han_ngoc_thach',
        name: 'Hàn Ngọc Thạch',
        type: 'material',
        icon: '💎',
        quality: 'Linh Khí',
        price: 8000,
        description: 'Đá ngọc hàn băng kết tinh từ đỉnh tuyết sơn, linh khí băng hệ cực thuần, nguyên liệu luyện đan thượng hạng.'
    },
    'hoa_am_quan': {
        id: 'hoa_am_quan',
        name: 'Hỏa Âm Quán',
        type: 'consumable',
        icon: '🌺',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Loài hoa hiếm gặp chỉ nở vào đêm hỏa diễm, cánh hoa phát nhiệt, ăn vào tăng cường hỏa linh căn.',
        effect: { atk: 100, fireRes: 0.05 }
    },
    'long_huyet_thao': {
        id: 'long_huyet_thao',
        name: 'Long Huyết Thảo',
        type: 'material',
        icon: '🌱',
        quality: 'Linh Khí',
        price: 6000,
        description: 'Cỏ đỏ thẫm mọc nơi long mạch, trong thân cỏ chứa long huyết ngưng kết, nguyên liệu luyện đan bổ huyết.'
    },
    'thien_tuyet_lien': {
        id: 'thien_tuyet_lien',
        name: 'Thiên Tuyết Liên',
        type: 'consumable',
        icon: '❄️',
        quality: 'Pháp Bảo',
        price: 30000,
        description: 'Hoa sen tuyết trắng mọc giữa băng hồ, lạnh buốt xương tủy, thanh lọc kinh mạch cực hiệu.',
        effect: { maxMana: 800, spirit: 100, poisonRes: 0.1 }
    },
    'ngu_sac_linh_thach': {
        id: 'ngu_sac_linh_thach',
        name: 'Ngũ Sắc Linh Thạch',
        type: 'material',
        icon: '🪨',
        quality: 'Pháp Bảo',
        price: 40000,
        description: 'Đá linh phát ra năm sắc quang, hội tụ ngũ hành tinh khí, nguyên liệu quan trọng để luyện pháp bảo ngũ hành.'
    },
    'kim_tinh_thach': {
        id: 'kim_tinh_thach',
        name: 'Kim Tinh Thạch',
        type: 'material',
        icon: '✨',
        quality: 'Linh Khí',
        price: 10000,
        description: 'Thiên thạch rơi xuống trần gian, cứng như thép vạn năm, kim khí vô cùng thuần chính, thích hợp luyện kiếm pháp bảo.'
    },
    'phi_thiên_vân_thi': {
        id: 'phi_thiên_vân_thi',
        name: 'Phi Thiên Vân Chi',
        type: 'material',
        icon: '☁️',
        quality: 'Linh Khí',
        price: 4500,
        description: 'Cành cây mộc hệ mọc trên đỉnh mây, nhẹ như vân khí, nguyên liệu chế tạo phi hành pháp bảo.'
    },
    'thien_long_nha': {
        id: 'thien_long_nha',
        name: 'Thiên Long Nha',
        type: 'material',
        icon: '🦷',
        quality: 'Linh Bảo',
        price: 80000,
        description: 'Nanh rồng trời đổ xuống, kiên cứng vô song, chứa đựng long uy, nguyên liệu luyện vũ khí thần cấp.'
    },
    'bich_hue_linh_can': {
        id: 'bich_hue_linh_can',
        name: 'Bích Huệ Linh Căn',
        type: 'consumable',
        icon: '💐',
        quality: 'Linh Bảo',
        price: 60000,
        description: 'Củ hoa huệ bích ngọc tàng chứa linh căn, ăn vào có cơ hội thức tỉnh Linh Căn ẩn tàng.',
        effect: { spiritRoot: 1, spirit: 500 }
    },
    'tuyet_sam_linh_nhi': {
        id: 'tuyet_sam_linh_nhi',
        name: 'Tuyết Sâm Linh Nhi',
        type: 'consumable',
        icon: '❄️',
        quality: 'Pháp Bảo',
        price: 35000,
        description: 'Nhân sâm tuyết có đôi mắt linh quang, đã khai mở ý thức sơ khai, tăng mạnh thần thức người dùng.',
        effect: { spirit: 300, breakthroughRate: 0.05 }
    },
    'tu_vi_dan': {
        id: 'tu_vi_dan',
        name: 'Tu Vi Đan',
        type: 'consumable',
        icon: '💊',
        quality: 'Phàm Khí',
        price: 500,
        description: 'Đan dược sơ cấp giúp tăng tốc tu luyện, được bán rộng rãi ở các phường thị tu tiên.',
        effect: { tuViSpeed: 0.05 }
    },
    'chu_ki_dan': {
        id: 'chu_ki_dan',
        name: 'Trú Cơ Đan',
        type: 'consumable',
        icon: '🔴',
        quality: 'Linh Khí',
        price: 2000,
        description: 'Đan dược giúp tu sĩ ổn định căn cơ, cải thiện tỉ lệ đột phá khi đạt tới nút thắt cảnh giới.',
        effect: { breakthroughRate: 0.03, spirit: 30 }
    },
    'hoi_linh_dan': {
        id: 'hoi_linh_dan',
        name: 'Hồi Linh Đan',
        type: 'consumable',
        icon: '💙',
        quality: 'Linh Khí',
        price: 1500,
        description: 'Đan dược phục hồi linh lực nhanh chóng, hương thơm dịu nhẹ, phổ biến trong giới tu sĩ.',
        effect: { mana: 500 }
    },
    'hoi_huyet_dan': {
        id: 'hoi_huyet_dan',
        name: 'Hồi Huyết Đan',
        type: 'consumable',
        icon: '❤️',
        quality: 'Linh Khí',
        price: 1500,
        description: 'Đan dược phục hồi khí huyết, nguyên liệu từ long huyết thảo và linh chi, hiệu quả tức thì.',
        effect: { hp: 1000 }
    },
    'tuong_am_dan': {
        id: 'tuong_am_dan',
        name: 'Tướng Âm Đan',
        type: 'consumable',
        icon: '🟣',
        quality: 'Pháp Bảo',
        price: 10000,
        description: 'Đan dược cấp trung tăng cường thần thức, giúp tu sĩ cảm nhận linh khí rõ ràng hơn.',
        effect: { spirit: 200, maxMana: 500 }
    },
    'bach_nien_dan': {
        id: 'bach_nien_dan',
        name: 'Bách Niên Đan',
        type: 'consumable',
        icon: '⚪',
        quality: 'Pháp Bảo',
        price: 15000,
        description: 'Đan dược luyện từ bách thảo trăm năm, dùng một viên kéo dài thọ mạng trăm năm.',
        effect: { lifespan: 100 }
    },
    'phan_hon_dan': {
        id: 'phan_hon_dan',
        name: 'Phán Hồn Đan',
        type: 'consumable',
        icon: '💛',
        quality: 'Linh Bảo',
        price: 50000,
        description: 'Đan dược hiếm có thể cứu sống người hấp hối, khí tức mãnh liệt hồi phục toàn bộ sinh lực.',
        effect: { hp: 9999, mana: 9999 }
    },
    'ngoc_thanh_dan': {
        id: 'ngoc_thanh_dan',
        name: 'Ngọc Thanh Đan',
        type: 'consumable',
        icon: '💚',
        quality: 'Linh Bảo',
        price: 45000,
        description: 'Đan dược cấp cao thanh lọc kinh mạch, phá tan tà độc, tăng vĩnh viễn linh lực căn bản.',
        effect: { maxMana: 2000, spirit: 300 }
    },
    'cap_lieu_dan': {
        id: 'cap_lieu_dan',
        name: 'Cấp Liệu Đan',
        type: 'consumable',
        icon: '🟢',
        quality: 'Pháp Bảo',
        price: 8000,
        description: 'Đan dược chữa thương tức thì, dùng trong chiến đấu phục hồi lượng lớn khí huyết.',
        effect: { hp: 3000 }
    },
    'luyen_the_dan': {
        id: 'luyen_the_dan',
        name: 'Luyện Thể Đan',
        type: 'consumable',
        icon: '🔶',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Đan dược rèn luyện thể phách, uống vào cảm thấy toàn thân nóng rực, cơ bắp cứng chắc hơn.',
        effect: { maxHp: 1000, def: 50 }
    },
    'cat_tuong_dan': {
        id: 'cat_tuong_dan',
        name: 'Cát Tường Đan',
        type: 'consumable',
        icon: '🟠',
        quality: 'Linh Khí',
        price: 3000,
        description: 'Đan dược khai vận may mắn, dùng trước khi lên đường mạo hiểm giúp tăng vận khí.',
        effect: { luck: 20 }
    },
    'bao_luc_dan': {
        id: 'bao_luc_dan',
        name: 'Bạo Lực Đan',
        type: 'consumable',
        icon: '🔴',
        quality: 'Linh Khí',
        price: 4000,
        description: 'Đan dược tạm thời kích thích thể phách, tăng mạnh công lực trong thời gian ngắn nhưng sau đó suy yếu.',
        effect: { atk: 200 }
    },
    'thanh_linh_dan': {
        id: 'thanh_linh_dan',
        name: 'Thanh Linh Đan',
        type: 'consumable',
        icon: '🔵',
        quality: 'Linh Bảo',
        price: 25000,
        description: 'Đan dược thuần hóa linh căn, tăng vĩnh viễn tốc độ hấp thụ linh khí của tu sĩ.',
        effect: { tuViSpeed: 0.2, qiAbsorb: 300 }
    },
    'tieu_hoan_dan': {
        id: 'tieu_hoan_dan',
        name: 'Tiểu Hoàn Đan',
        type: 'consumable',
        icon: '⭕',
        quality: 'Pháp Bảo',
        price: 20000,
        description: 'Đan dược đẳng cấp, có thể hồi phục đồng thời khí huyết và linh lực, dành cho tu sĩ Trúc Cơ trở lên.',
        effect: { hp: 2000, mana: 2000, spirit: 100 }
    },
    'dai_huan_dan': {
        id: 'dai_huan_dan',
        name: 'Đại Hoàn Đan',
        type: 'consumable',
        icon: '🌀',
        quality: 'Linh Bảo',
        price: 80000,
        description: 'Đan dược huyền thoại, tương truyền có thể phục hồi tử mạng. Hồi phục toàn bộ trạng thái.',
        effect: { hp: 5000, mana: 5000, spirit: 500 }
    },
    'nhat_duong_chi_thu': {
        id: 'nhat_duong_chi_thu',
        name: '« Cổ Tịch: Nhật Dương Chi Thư »',
        type: 'book',
        icon: '📘',
        quality: 'Linh Bảo',
        price: 80000,
        techniqueId: 'nhat_duong_cong_phap',
        description: 'Thiên thư tu luyện theo nhật tinh, mỗi bình minh hấp thu dương khí, uy lực hỏa hệ tăng vọt.'
    },
    'am_linh_bi_kinh': {
        id: 'am_linh_bi_kinh',
        name: '« Bí Kinh: Âm Linh Diệt Thần »',
        type: 'book',
        icon: '📒',
        quality: 'Linh Bảo',
        price: 90000,
        techniqueId: 'am_linh_cong_phap',
        description: 'Âm hệ bí pháp tối thượng, luyện âm khí hóa kiếm diệt thần hồn kẻ địch.'
    },
    'hoa_van_thu': {
        id: 'hoa_van_thu',
        name: '« Cổ Tịch: Hóa Vân Quyết »',
        type: 'book',
        icon: '📘',
        quality: 'Pháp Bảo',
        price: 20000,
        techniqueId: 'hoa_van_cong_phap',
        description: 'Pháp quyết hóa vân độn thuật, lướt mây phi thiên cực nhanh, tốc độ độn thân phi thường.'
    },
    'luc_hop_bi_dien': {
        id: 'luc_hop_bi_dien',
        name: '« Bí Điển: Lục Hợp Vô Song »',
        type: 'book',
        icon: '📜',
        quality: 'Linh Bảo',
        price: 100000,
        secretId: 'luc_hop_bi_tich',
        description: 'Bí điển hợp nhất lục hợp chi lực, một chiêu bao trùm thiên địa bát phương, vạn địch nan đương.'
    },
    'van_kiem_bi_thu': {
        id: 'van_kiem_bi_thu',
        name: '« Bí Thư: Vạn Kiếm Thần Thiên »',
        type: 'book',
        icon: '📜',
        quality: 'Cổ Bảo',
        price: 200000,
        secretId: 'van_kiem_bi_tich',
        description: 'Cuộn bí thư kiếm đạo đỉnh cao, triệu hoán vạn kiếm cùng lúc, tạo thành kiếm trận khóa chết đối phương.'
    },
    'bat_quai_chan_kinh': {
        id: 'bat_quai_chan_kinh',
        name: '« Chân Kinh: Bát Quái Huyền Công »',
        type: 'book',
        icon: '📙',
        quality: 'Linh Bảo',
        price: 75000,
        techniqueId: 'bat_quai_cong_phap',
        description: 'Kinh sách tu luyện theo bát quái, dung hợp âm dương lưỡng nghi, phòng thủ và công kích toàn diện.'
    },
    'tam_muoi_chan_hoa': {
        id: 'tam_muoi_chan_hoa',
        name: '« Bí Tịch: Tam Muội Chân Hỏa »',
        type: 'book',
        icon: '📜',
        quality: 'Linh Bảo',
        price: 85000,
        secretId: 'tam_muoi_bi_tich',
        description: 'Bí tịch luyện Tam Muội Chân Hỏa thiêu vạn vật, thậm chí có thể đốt cháy cả linh hồn đối thủ.'
    },
    'truong_sinh_quyet': {
        id: 'truong_sinh_quyet',
        name: '« Cổ Tịch: Trường Sinh Quyết »',
        type: 'book',
        icon: '📗',
        quality: 'Cổ Bảo',
        price: 150000,
        techniqueId: 'truong_sinh_cong_phap',
        description: 'Bí quyết trường sinh bất lão được truyền lại từ cổ đại tiên nhân, luyện thành có thể kéo dài thọ nguyên.'
    },
    'than_thong_bi_dien': {
        id: 'than_thong_bi_dien',
        name: '« Bí Điển: Thần Thông Biến Hóa »',
        type: 'book',
        icon: '📜',
        quality: 'Thông Thiên Linh Bảo',
        price: 500000,
        secretId: 'than_thong_bi_tich',
        description: 'Tuyệt thế bí điển chứa ba mươi sáu phép thần thông biến hóa, ngộ được một phép đã vô địch cõi trần.'
    },
    'cu_que_linh_cam': {
        id: 'cu_que_linh_cam',
        name: 'Cự Quế Linh Cầm',
        type: 'supportArtifact',
        icon: '🎵',
        quality: 'Linh Bảo',
        price: 70000,
        description: 'Đàn lớn bằng gỗ quế thần, âm thanh vang xa ngàn dặm, mỗi nốt nhạc chứa linh khí có thể trị thương và tấn công.',
        stats: { spirit: 800, atk: 500, tuViSpeed: 0.1 }
    },
    'nhi_nghi_linh_nguyen': {
        id: 'nhi_nghi_linh_nguyen',
        name: 'Nhị Nghi Linh Nguyên Đài',
        type: 'supportArtifact',
        icon: '☯️',
        quality: 'Linh Bảo',
        price: 110000,
        description: 'Đài âm dương lưỡng nghi, cân bằng âm dương khí trong cơ thể, gia tăng toàn diện sức chiến đấu.',
        stats: { atk: 800, def: 800, spirit: 400, maxHp: 1500 }
    },
    'luyen_ma_kinh_tram': {
        id: 'luyen_ma_kinh_tram',
        name: 'Luyện Ma Kinh Trầm',
        type: 'attackArtifact',
        icon: '🪬',
        quality: 'Pháp Bảo',
        price: 40000,
        description: 'Trầm hương đặc biệt luyện từ ma khí và hương mộc, đốt lên khói trầm có thể ngộ độc và làm mê hoặc kẻ địch.',
        stats: { atk: 2000, poisonAtk: 300, spirit: 200 }
    },
    'that_tinh_bao_giam': {
        id: 'that_tinh_bao_giam',
        name: 'Thất Tinh Bảo Giám',
        type: 'defenseArtifact',
        icon: '🪞',
        quality: 'Linh Bảo',
        price: 120000,
        description: 'Gương thần bảy sao có thể phản chiếu công kích của địch, đồng thời chiếu rõ ảo thuật và tàng hình.',
        stats: { def: 3000, spirit: 600, reflect: 0.2 }
    },
    'thien_nham_linh_tho': {
        id: 'thien_nham_linh_tho',
        name: 'Thiên Nham Linh Thổ Ấn',
        type: 'formationArtifact',
        icon: '🔏',
        quality: 'Pháp Bảo',
        price: 55000,
        description: 'Ấn pháp bảo rèn từ đất linh thiêng đỉnh Thiên Nham, đóng ấn trận pháp cực hiệu, ổn định kết giới.',
        stats: { def: 1500, spirit: 700, stability: 50 }
    },
    'bach_linh_hoa_lo': {
        id: 'bach_linh_hoa_lo',
        name: 'Bách Linh Hóa Lò',
        type: 'craftingArtifact',
        icon: '🏮',
        quality: 'Pháp Bảo',
        price: 65000,
        description: 'Lò luyện đan pháp bảo đúc từ bách kim linh thổ, nhiệt độ đạt đến mức luyện hóa mọi loại linh thảo.',
        stats: { craftingBonus: 0.2, alchemy: 50 }
    },
    'van_linh_phu_bai': {
        id: 'van_linh_phu_bai',
        name: 'Vạn Linh Phù Bài',
        type: 'supportArtifact',
        icon: '🀄',
        quality: 'Cổ Bảo',
        price: 180000,
        description: 'Bộ bài phù lệnh ghi chép vạn loại linh phù, mỗi lá bài triển khai một loại pháp thuật khác nhau.',
        stats: { spirit: 1500, atk: 2000, luck: 80 }
    },
    'huyen_thien_kinh_lun': {
        id: 'huyen_thien_kinh_lun',
        name: 'Huyền Thiên Kinh Luân',
        type: 'spaceArtifact',
        icon: '🌀',
        quality: 'Thông Thiên Linh Bảo',
        price: 350000,
        description: 'Pháp bảo không gian cực phẩm, bên trong chứa một tiểu thiên địa hoàn chỉnh với linh mạch và linh khí dồi dào.',
        stats: { slots: 100, tuViSpeed: 0.3, qiAbsorb: 800 }
    },
    'tinh_van_linh_the': {
        id: 'tinh_van_linh_the',
        name: 'Tinh Vân Linh Thể Khôi',
        type: 'defenseArtifact',
        icon: '🛡️',
        quality: 'Linh Bảo',
        price: 160000,
        description: 'Khôi giáp đúc từ tinh vân thạch, nhẹ nhàng như mây nhưng cứng chắc hơn mọi loại kim loại, bảo vệ toàn diện.',
        stats: { def: 5000, maxHp: 4000, spd: 100 }
    },
    'song_long_bao_ta': {
        id: 'song_long_bao_ta',
        name: 'Song Long Bảo Tháp',
        type: 'attackArtifact',
        icon: '🗼',
        quality: 'Cổ Bảo',
        price: 220000,
        description: 'Tháp pháp bảo hình đôi rồng quấn quanh, phóng ra song long hỏa lôi kép, sát thương kinh thiên động địa.',
        stats: { atk: 6000, critChance: 0.2, critDamage: 0.8 },
        poem: ['Song Long Quán Nhật Phá Thiên Thương', 'Nhất Tháp Phi Lôi Vạn Ma Hoàng']
    },
    'van_nien_linh_nhu': {
        id: 'van_nien_linh_nhu',
        name: 'Vạn Niên Linh Nhũ',
        type: 'consumable',
        icon: '🥛',
        quality: 'Cổ Bảo',
        price: 60000,
        description: 'Linh dịch ngàn năm tích tụ trong khe đá vạn thạch, ẩn chứa linh khí tinh thuần chí cực, uống vào lập tức khôi phục toàn bộ pháp lực.',
        effect: { mana: 99999 }
    },
    'cuu_diep_chi': {
        id: 'cuu_diep_chi',
        name: 'Cửu Diệp Chi Thảo',
        type: 'consumable',
        icon: '🌿',
        quality: 'Pháp Bảo',
        price: 40000,
        description: 'Linh chi chín lá hấp thu tinh hoa nhật nguyệt cực kỳ quý hiếm, ăn vào gia tăng vĩnh viễn tốc độ tu luyện và thần thức.',
        effect: { tuViSpeed: 0.1, spirit: 100 }
    },
    'bang_tuy_chi': {
        id: 'bang_tuy_chi',
        name: 'Băng Tủy Chi',
        type: 'consumable',
        icon: '❄️',
        quality: 'Linh Bảo',
        price: 75000,
        description: 'Linh chi sinh trưởng nơi vạn năm băng tuyền, hàn khí thấu cốt, dùng để tăng vọt thần thức và băng hệ kháng tính.',
        effect: { spirit: 250, coldRes: 0.08 }
    },
    'khay_loi_moc': {
        id: 'khay_loi_moc',
        name: 'Kháng Lôi Mộc',
        type: 'consumable',
        icon: '🪵',
        quality: 'Pháp Bảo',
        price: 45000,
        description: 'Thần mộc hấp thu thiên lôi vạn năm không hủy, dùng để tẩy tủy ngọc cốt, nâng cao vĩnh viễn lôi kháng và phòng ngự.',
        effect: { def: 150, thunderRes: 0.1 }
    },
    'thien_linh_qua': {
        id: 'thien_linh_qua',
        name: 'Thiên Linh Quả',
        type: 'consumable',
        icon: '🍑',
        quality: 'Linh Bảo',
        price: 80000,
        description: 'Thánh quả ngàn năm mới chín một lần, tụ hợp thiên địa linh khí tinh túy nhất, dùng để tăng vĩnh viễn linh lực hấp thu và khí vận.',
        effect: { qiAbsorb: 500, luck: 15 }
    },
    'ngung_oanh_dan': {
        id: 'ngung_oanh_dan',
        name: 'Ngưng Oánh Đan',
        type: 'consumable',
        icon: '💊',
        quality: 'Pháp Khí',
        price: 1200,
        description: 'Thượng phẩm đan dược của tu sĩ Luyện Khí Kỳ, hỗ trợ đột phá cảnh giới nhỏ và gia tăng nhẹ tốc độ tu luyện.',
        effect: { tuViSpeed: 0.08 }
    },
    'hang_tran_dan': {
        id: 'hang_tran_dan',
        name: 'Hàng Trần Đan',
        type: 'consumable',
        icon: '🟡',
        quality: 'Pháp Bảo',
        price: 15000,
        description: 'Bảo đan tuyệt tích giúp tu sĩ Trúc Cơ ngưng tụ linh khí hóa thành kim đan, tăng vọt thần thức và tỉ lệ đột phá Kết Đan.',
        effect: { breakthroughRate: 0.10, spirit: 100 }
    },
    'ti_ta_dan': {
        id: 'ti_ta_dan',
        name: 'Tị Tà Đan',
        type: 'consumable',
        icon: '🟢',
        quality: 'Pháp Bảo',
        price: 18000,
        description: 'Đan dược trừ tà tịch ma, bảo vệ tâm mạch, tăng cường thần thức và suy giảm tâm ma cực mạnh.',
        effect: { spirit: 150, heartDemon: -30 }
    },
    'dinh_than_dan': {
        id: 'dinh_than_dan',
        name: 'Định Thần Đan',
        type: 'consumable',
        icon: '🔵',
        quality: 'Pháp Bảo',
        price: 22000,
        description: 'An định thần hồn, gia tăng vĩnh viễn thần thức cùng với độ ổn định kinh mạch khi tu luyện.',
        effect: { spirit: 350, stability: 30 }
    },
    'thanh_truc_phong_van_kiem': {
        id: 'thanh_truc_phong_van_kiem',
        name: 'Thanh Trúc Phong Vân Kiếm',
        type: 'attackArtifact',
        icon: '🎋',
        quality: 'Thông Thiên Linh Bảo',
        price: 300000,
        image: 'items/thanh_truc_phong_van_kiem.webp',
        description: 'Thanh kiếm chí bảo rèn từ Thiên Tinh Thần Tre cùng linh tơ ong vàng, uy lực kiếm khí cuồng bạo xé rách vạn pháp.',
        stats: { atk: 12000, spd: 500, critChance: 0.25, swordDmg: 1.35 },
        poem: ['Thanh Trúc Thần Phong Đan Tiêu Nhạc', 'Vạn Kiếm Quy Tông Luyện Vạn Ma']
    },
    'phong_loi_phien': {
        id: 'phong_loi_phien',
        name: 'Phong Lôi Phiến',
        type: 'attackArtifact',
        icon: '🪭',
        quality: 'Cổ Bảo',
        price: 160000,
        description: 'Chiếc quạt cổ đúc từ cánh thần điểu, một lần vung quạt dẫn động phong lôi tàn phá vạn dặm.',
        stats: { atk: 8000, spd: 300, thunderDmg: 1.25 },
        poem: ['Phong Lôi Nhất Phất Thiên Địa Động', 'Vạn Kiếp Cuồng Lôi Thiêu Cực Ma']
    },
    'than_hoang_giap': {
        id: 'than_hoang_giap',
        name: 'Thần Hoàng Giáp',
        type: 'defenseArtifact',
        icon: '🥋',
        quality: 'Thông Thiên Linh Bảo',
        price: 350000,
        description: 'Hộ thân giáp y đúc từ kim hỏa thần tủy cực kỳ kiên cố, đem lại sinh lực dồi dào cùng phòng ngự bất phàm.',
        stats: { def: 12000, maxHp: 15000, damageReduction: 0.25 },
        poem: ['Thần Hoàng Chiến Giáp Hộ Nguyên Thần', 'Linh Quang Vạn Trượng Kính Thiên Binh']
    },
    'thiet_moc_bach_nien': {
        id: 'thiet_moc_bach_nien',
        name: 'Thiết Mộc Trăm Năm',
        type: 'material',
        icon: '🪵',
        quality: 'Linh Khí',
        price: 1000,
        description: 'Thân gỗ của Thiết Mộc thụ thọ mệnh vài trăm năm, cứng chắc như sắt thép. Vật liệu chính để luyện khôi lỗi thời kỳ Trúc Cơ của Hàn Lập.'
    },
    'thiet_moc_van_nam': {
        id: 'thiet_moc_van_nam',
        name: 'Thiết Mộc Vạn Năm',
        type: 'material',
        icon: '🪵',
        quality: 'Cổ Bảo',
        price: 8000,
        description: 'Thiết Mộc linh thụ tích lũy linh lực vạn năm cực kỳ trân quý, dẻo dai và dẫn linh tính tuyệt hảo. Vật liệu để luyện khôi lỗi Nguyên Anh kỳ.'
    },
    'hoa_linh_thach_trung': {
        id: 'hoa_linh_thach_trung',
        name: 'Hỏa Linh Thạch Trung Giai',
        type: 'spirit_stone',
        grade: 'TRUNG',
        attribute: 'FIRE',
        icon: '🔥',
        quality: 'Linh Khí',
        price: 500,
        weight: 0.02,
        description: 'Linh thạch trung giai thuộc tính Hỏa tinh thuần, chứa hỏa nguyên lực dồi dào. Dùng làm lõi năng lượng cho Cự Hổ Khôi Lỗi.'
    },
    'dai_dien_quyet': {
        id: 'dai_dien_quyet',
        name: 'Sách: Đại Diễn Quyết',
        type: 'book',
        icon: '📔',
        quality: 'Linh Khí',
        price: 8000,
        techniqueId: 'dai_dien_quyet',
        description: 'Bí thuật do tổ sư khai phái của Thiên Trúc Giáo Đại Diễn Thần Quân tự sáng tạo, chuyên dùng để tăng cường thần thức và tu luyện phân thần thuật. Là công pháp bắt buộc để điều khiển nhiều khôi lỗi.'
    },
    'khoi_loi_chan_giai': {
        id: 'khoi_loi_chan_giai',
        name: 'Bí Tịch: Khôi Lỗi Chân Giải',
        type: 'book',
        icon: '📖',
        quality: 'Cổ Bảo',
        price: 15000,
        description: 'Bộ bách khoa toàn thư cực kỳ chi tiết về chế tạo khôi lỗi của Thiên Trúc Giáo, dạy cách luyện chế các cấp khôi lỗi thú và khôi lỗi nhân.',
        effect: {
            type: 'learn_multiple_recipes',
            value: [
                { type: 'unlock_profession', profession: 'puppet' },
                { type: 'learn_puppet_recipe', value: 'thanh_vien_khoi_loi' },
                { type: 'learn_puppet_recipe', value: 'cu_ho_khoi_loi' }
            ]
        }
    },
    'bv_thanh_vien_khoi_loi': {
        id: 'bv_thanh_vien_khoi_loi',
        name: 'Bản Vẽ: Thanh Viên Khôi Lỗi',
        type: 'recipe',
        icon: '📜',
        quality: 'Linh Khí',
        price: 5000,
        description: 'Hướng dẫn chế tạo Thanh Viên Khôi Lỗi Trúc Cơ cấp từ Thiết Mộc Trăm Năm.',
        effect: { type: 'learn_puppet_recipe', value: 'thanh_vien_khoi_loi' }
    },
    'bv_cu_ho_khoi_loi': {
        id: 'bv_cu_ho_khoi_loi',
        name: 'Bản Vẽ: Cự Hổ Khôi Lỗi',
        type: 'recipe',
        icon: '📜',
        quality: 'Cổ Bảo',
        price: 15000,
        description: 'Hướng dẫn chế tạo Cự Hổ Khôi Lỗi khổng lồ bắn ra cột sáng cực mạnh.',
        effect: { type: 'learn_puppet_recipe', value: 'cu_ho_khoi_loi' }
    },
    'hu_tien_lenh': {
        id: 'hu_tien_lenh',
        name: 'Hư Tiên Lệnh',
        type: 'material',
        icon: '🔑',
        quality: 'Linh Bảo',
        price: 80000,
        image: 'items/hu_tien_lenh.webp',
        description: 'Tấm lệnh bài cổ xưa tỏa ra dao động không gian huyền ảo, là chìa khóa mở lối vào Hư Thiên Điện chứa Hư Thiên Đỉnh.'
    },
    'truyen_tin_hac': {
        id: 'truyen_tin_hac',
        name: 'Truyền Tin Hạc',
        type: 'consumable',
        icon: '🕊️',
        quality: 'Pháp Khí',
        price: 150,
        image: 'items/truyen_tin_hac.webp',
        description: 'Linh hạc gấp từ phù giấy chứa một luồng ý niệm, chuyên dùng để truyền tin tức giữa các tu sĩ cách xa vạn dặm. Sử dụng hồi phục ngay lập tức 10 Thể lực.',
        effect: { type: 'restore', stamina: 10 }
    },
    'phuong_hoa_lu_item': {
        id: 'phuong_hoa_lu_item',
        name: 'Phượng Hoa Lư',
        type: 'cauldron',
        icon: '🏺',
        quality: 'Pháp Bảo',
        price: 75000,
        image: 'items/phuong_hoa_lu.webp',
        description: 'Lò luyện đan thượng cấp khắc hình phượng hoàng lửa sinh động như thật, có thể bảo toàn dược tính của linh thảo tuyệt đối.'
    },
    'o_minh_si': {
        id: 'o_minh_si',
        name: 'Ô Minh Ty',
        type: 'material',
        icon: '🕸️',
        quality: 'Linh Khí',
        price: 1500,
        image: 'items/o_minh_si.webp',
        description: 'Sợi tơ đen nhánh dẻo dai sinh ra từ tằm ô minh sống nơi u tối, là vật liệu thượng hạng để luyện chế khôi lỗi cao cấp hoặc dệt hộ giáp.'
    },
    'trung_hac_thiet_loi_thu': {
        id: 'trung_hac_thiet_loi_thu',
        name: 'Trứng Hắc Thiết Lôi Thú',
        type: 'beast_egg',
        beastId: 'hac_thiet_loi_thu',
        icon: '🥚',
        quality: 'Thiên Cấp',
        price: 25000,
        description: 'Trứng của Hắc Thiết Lôi Thú thượng cổ, bao quanh bởi những tia lôi điện đen kịt lách tách kêu gào.'
    },

    // --- BỔ SUNG CÁC LINH THẢO & LINH DƯỢC & HẠT GIỐNG MỚI (PHÀM NHÂN TU TIÊN LORE) ---
    'linh_thao_cao': {
        id: 'linh_thao_cao',
        name: 'Tử Nguyệt Thảo',
        type: 'material',
        icon: '🌙',
        quality: 'Pháp Bảo',
        price: 1500,
        description: 'Tử Nguyệt Thảo, một loại linh thảo cao cấp hiếm gặp ở Nhân giới, hình dáng giống như vầng trăng khuyết màu tím phát ra ánh sáng lung linh.'
    },
    'seed_ngoc_de_hoa': {
        id: 'seed_ngoc_de_hoa',
        name: 'Linh Chủng Ngọc Đề Hoa',
        type: 'seed',
        icon: '🌱',
        quality: 'Pháp Khí',
        price: 30,
        description: 'Hạt giống của Ngọc Đề Hoa, loại thảo dược cấp thấp có dược tính cực kỳ ôn hòa, dễ trồng.'
    },
    'ngoc_de_hoa': {
        id: 'ngoc_de_hoa',
        name: 'Ngọc Đề Hoa',
        type: 'material',
        icon: '🌸',
        quality: 'Pháp Khí',
        price: 100,
        description: 'Ngọc Đề Hoa, đóa hoa trắng ngần như ngọc, có tác dụng điều hòa tính nhiệt trong lò luyện đan, ổn định hỏa hầu.'
    },
    'seed_thanh_long_tham': {
        id: 'seed_thanh_long_tham',
        name: 'Linh Chủng Thanh Long Sâm',
        type: 'seed',
        icon: '🌱',
        quality: 'Linh Khí',
        price: 120,
        description: 'Linh chủng của Thanh Long Sâm, đòi hỏi linh điền dồi dào sinh cơ (Mộc thuộc tính).'
    },
    'thanh_long_tham': {
        id: 'thanh_long_tham',
        name: 'Thanh Long Sâm',
        type: 'material',
        icon: '🐉',
        quality: 'Linh Khí',
        price: 450,
        description: 'Thanh Long Sâm, củ nhân sâm có hình thù giống như rồng xanh uốn lượn, chứa mộc thuộc tính linh khí vô cùng tinh thuần.'
    },
    'seed_tuyet_oanh_thao': {
        id: 'seed_tuyet_oanh_thao',
        name: 'Linh Chủng Tuyết Oánh Thảo',
        type: 'seed',
        icon: '❄️',
        quality: 'Linh Khí',
        price: 150,
        description: 'Linh chủng của Tuyết Oánh Thảo, chỉ có thể nảy mầm và sinh trưởng nơi linh điền cực hàn (Băng thuộc tính).'
    },
    'tuyet_oanh_thao': {
        id: 'tuyet_oanh_thao',
        name: 'Tuyết Oánh Thảo',
        type: 'material',
        icon: '❄️',
        quality: 'Linh Khí',
        price: 500,
        description: 'Tuyết Oánh Thảo, loài linh cỏ mọc trên vách núi tuyết vạn năm, lấp lánh như sương tuyết, có tác dụng thanh tẩy kinh mạch, xua tan đan độc.'
    },
    'seed_hoa_duong_chi': {
        id: 'seed_hoa_duong_chi',
        name: 'Linh Chủng Hỏa Dương Chi',
        type: 'seed',
        icon: '🔥',
        quality: 'Linh Khí',
        price: 180,
        description: 'Linh chủng của Hỏa Dương Chi, cần gieo trồng ở linh điền nóng bỏng hỏa khí (Hỏa thuộc tính).'
    },
    'hoa_duong_chi': {
        id: 'hoa_duong_chi',
        name: 'Hỏa Dương Chi',
        type: 'material',
        icon: '🍄',
        quality: 'Linh Khí',
        price: 600,
        description: 'Hỏa Dương Chi, loại nấm linh chi rực đỏ như than hồng, chứa đựng lượng lớn nhiệt năng và hỏa linh lực dồi dào.'
    },
    'seed_cuu_tich_chi': {
        id: 'seed_cuu_tich_chi',
        name: 'Linh Chủng Cửu Tịch Chi',
        type: 'seed',
        icon: '💀',
        quality: 'Linh Khí',
        price: 250,
        description: 'Linh chủng của Cửu Tịch Chi, chỉ nảy mầm trong âm khí dày đặc (Âm Minh thuộc tính).'
    },
    'cuu_tich_chi': {
        id: 'cuu_tich_chi',
        name: 'Cửu Tịch Chi',
        type: 'material',
        icon: '🪨',
        quality: 'Linh Khí',
        price: 800,
        description: 'Cửu Tịch Chi, nấm linh chi đen mọc trong những hang động âm u sâu dưới lòng đất, tích lũy dồi dào u minh âm khí.'
    },
    'tieu_dao_qua': {
        id: 'tieu_dao_qua',
        name: 'Tiêu Dao Quả',
        type: 'consumable',
        icon: '🍑',
        quality: 'Linh Khí',
        price: 350,
        description: 'Tiêu Dao Quả, quả linh ngọt lành ngậm đầy thiên địa tinh hoa. Khi ăn giúp tu sĩ lập tức phục hồi 40 điểm Thể Lực và gia tăng nhẹ tốc độ tu luyện trong 1 giờ.',
        effect: { type: 'restore', stamina: 40, buff: { stat: 'tu_vi_speed', value: 1.15, duration: 3600 } }
    },
    'huyet_lien_hoa': {
        id: 'huyet_lien_hoa',
        name: 'Huyết Liên Hoa',
        type: 'material',
        icon: '🪷',
        quality: 'Pháp Bảo',
        price: 2000,
        description: 'Huyết Liên Hoa, đóa sen đỏ thẫm sinh trưởng nơi đầm lầy đẫm huyết khí của đại yêu thú, chứa sinh cơ lực lượng vô cùng cuồng bạo.'
    },
    'that_tinh_thao': {
        id: 'that_tinh_thao',
        name: 'Thất Tinh Thảo',
        type: 'material',
        icon: '🌿',
        quality: 'Pháp Bảo',
        price: 2200,
        description: 'Thất Tinh Thảo, loại cỏ linh thảo có bảy chiếc lá sắp xếp tựa như chòm sao Bắc Đẩu, chuyên hấp thụ tinh quang tinh hoa ban đêm để nuôi dưỡng thần thức.'
    },
    'ngoc_de_dan': {
        id: 'ngoc_de_dan',
        name: 'Ngọc Đề Đan',
        type: 'consumable',
        icon: '💊',
        quality: 'Pháp Khí',
        price: 450,
        description: 'Ngọc Đề Đan, viên linh đan sơ cấp dược tính vô cùng ôn hòa. Khi sử dụng trước khi đột phá, giúp gia tăng 5% tỷ lệ đột phá thành công ở Luyện Khí cảnh.',
        stats: { breakthroughRate: 0.05 }
    },
    'hoa_duong_dan': {
        id: 'hoa_duong_dan',
        name: 'Hỏa Dương Đan',
        type: 'consumable',
        icon: '🔥',
        quality: 'Linh Khí',
        price: 1800,
        description: 'Hỏa Dương Đan, viên linh đan rực lửa giúp tu sĩ kích phát kinh mạch hỏa hệ. Sử dụng gia tăng 15% hỏa thuộc tính sát thương trong 3 trận đấu tiếp theo.',
        effect: { type: 'buff', stat: 'fire_dmg_pct', value: 0.15, duration: 3 }
    },
    'hoi_linh_dan': {
        id: 'hoi_linh_dan',
        name: 'Hồi Linh Đan',
        type: 'consumable',
        icon: '🧪',
        quality: 'Pháp Khí',
        price: 300,
        description: 'Hồi Linh Đan, đan dược phổ thông giúp hồi phục nhanh chóng 80 điểm Linh Lực ngay lập tức.',
        effect: { type: 'restore', mana: 80 }
    }
};

export const getItemById = (id) => ITEMS[id];

