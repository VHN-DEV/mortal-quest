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
    // Hạt giống
    'seed_linh_thao': { id: 'seed_linh_thao', name: 'Linh Chủng Linh Thảo', type: 'seed', icon: '🌱', quality: 'Phàm', price: 10, description: 'Linh chủng linh thảo sơ cấp.' },
    'seed_hoa_diem_thao': { id: 'seed_hoa_diem_thao', name: 'Linh Chủng Hỏa Diễm Thảo', type: 'consumable', icon: '🔥', quality: 'Linh', price: 150, description: 'Linh chủng linh thảo hỏa hệ.' },
    'seed_han_tuy_hoa': { id: 'seed_han_tuy_hoa', name: 'Linh Chủng Hàn Tủy Hoa', type: 'consumable', icon: '❄️', quality: 'Linh', price: 150, description: 'Linh chủng linh thảo băng hệ.' },
    'seed_u_minh_hoa': { id: 'seed_u_minh_hoa', name: 'Linh Chủng U Minh Hoa', type: 'consumable', icon: '💀', quality: 'Huyền', price: 300, description: 'Linh chủng linh thảo âm hệ.' },

    // Vật phẩm đặc biệt
    'di_hoa_bang': {
        id: 'di_hoa_bang',
        name: 'Dị Hỏa Bảng',
        type: 'book',
        icon: '📜',
        quality: 'Huyền',
        price: 1700,
        description: 'Bản danh sách ghi chép về 23 loại Dị Hỏa kỳ dị nhất trong thiên địa. Bấm vào để xem chi tiết.',
        action: 'open_di_hoa_bang'
    },
    'di_loi_bang': {
        id: 'di_loi_bang',
        name: 'Dị Lôi Bảng',
        type: 'book',
        icon: '📜',
        quality: 'Huyền',
        price: 1500,
        description: 'Bản danh sách ghi chép về 10 loại Dị Lôi cường hãn nhất trong thiên địa. Bấm vào để xem chi tiết.',
        action: 'open_di_loi_bang'
    },
    'linh_the_luc': {
        id: 'linh_the_luc',
        name: 'Chư Thiên Linh Thể Lục',
        type: 'book',
        icon: '📜',
        quality: 'Huyền',
        price: 2000,
        description: 'Bản danh sách ghi chép về 15 loại Linh Thể mạnh mẽ nhất chư thiên. Bấm vào để xem chi tiết.',
        action: 'open_linh_the_luc'
    },

    // --- PROFESSION MANUALS ---
    'dan_dao_chan_giai': {
        id: 'dan_dao_chan_giai',
        name: 'Đan Đạo Chân Giải',
        type: 'book',
        icon: '📔',
        quality: 'Hoàng',
        price: 1000,
        description: 'Sách nhập môn về Luyện Đan, giúp mở khóa nghề Luyện Dược Sư.',
        effect: { type: 'unlock_profession', profession: 'alchemy' }
    },
    'luyen_khi_tong_cuong': {
        id: 'luyen_khi_tong_cuong',
        name: 'Luyện Khí Tổng Cương',
        type: 'book',
        icon: '📔',
        quality: 'Hoàng',
        price: 1200,
        description: 'Nguyên lý cơ bản về rèn đúc pháp bảo, mở khóa nghề Luyện Khí Sư.',
        effect: { type: 'unlock_profession', profession: 'smithing' }
    },
    'thai_thuong_phu_kinh': {
        id: 'thai_thuong_phu_kinh',
        name: 'Thái Thượng Phù Kinh',
        type: 'book',
        icon: '📜',
        quality: 'Hoàng',
        price: 800,
        description: 'Ghi chép về cách dẫn linh hồn vào phù giấy, mở khóa nghề Phù Sư.',
        effect: { type: 'unlock_profession', profession: 'talisman' }
    },
    'tran_dao_thien_thu': {
        id: 'tran_dao_thien_thu',
        name: 'Trận Đạo Thiên Thư',
        type: 'book',
        icon: '📜',
        quality: 'Huyền',
        price: 2500,
        description: 'Thiên thư ghi chép về các loại trận pháp, mở khóa nghề Trận Pháp Sư.',
        effect: { type: 'unlock_profession', profession: 'formation' }
    },
    'co_quan_linh_ky': {
        id: 'co_quan_linh_ky',
        name: 'Cơ Quan Linh Kỹ',
        type: 'book',
        icon: '📔',
        quality: 'Huyền',
        price: 3000,
        description: 'Bí tịch về cách chế tạo khôi lỗi, mở khóa nghề Khôi Lỗi Sư.',
        effect: { type: 'unlock_profession', profession: 'puppet' }
    },
    'cuu_u_luyen_thi_thuat': {
        id: 'cuu_u_luyen_thi_thuat',
        name: 'Cửu U Luyện Thi Thuật',
        type: 'book',
        icon: '💀',
        quality: 'Huyền',
        price: 1500,
        description: 'Tà thuật luyện chế xác chết, mở khóa nghề Luyện Thi Sư.',
        effect: { type: 'unlock_profession', profession: 'corpse' }
    },

    // --- ALCHEMY RECIPE SCROLLS ---
    'dp_ngung_khi_dan': {
        id: 'dp_ngung_khi_dan',
        name: 'Đan Phương: Ngưng Khí Đan',
        type: 'recipe',
        icon: '📜',
        quality: 'Hoàng',
        price: 300,
        description: 'Ghi chép cách luyện chế Ngưng Khí Đan.',
        effect: { type: 'learn_recipe', value: 'ngung_khi_dan' }
    },
    'dp_than_tam_dan': {
        id: 'dp_than_tam_dan',
        name: 'Đan Phương: Thanh Tâm Đan',
        type: 'recipe',
        icon: '📜',
        quality: 'Hoàng',
        price: 500,
        description: 'Ghi chép cách luyện chế Thanh Tâm Đan.',
        effect: { type: 'learn_recipe', value: 'than_tam_dan' }
    },
    'dp_truc_co_dan': {
        id: 'dp_truc_co_dan',
        name: 'Đan Phương: Trúc Cơ Đan',
        type: 'recipe',
        icon: '📜',
        quality: 'Huyền',
        price: 2000,
        description: 'Ghi chép cách luyện chế Trúc Cơ Đan cực kỳ quan trọng.',
        effect: { type: 'learn_recipe', value: 'truc_co_dan' }
    },
    'dp_bo_nguyen_dan': {
        id: 'dp_bo_nguyen_dan',
        name: 'Đan Phương: Bổ Nguyên Đan',
        type: 'recipe',
        icon: '📜',
        quality: 'Hoàng',
        price: 600,
        description: 'Ghi chép cách luyện chế Bổ Nguyên Đan.',
        effect: { type: 'learn_recipe', value: 'bo_nguyen_dan' }
    },
    'dp_ngung_anh_dan': {
        id: 'dp_ngung_anh_dan',
        name: 'Đan Phương: Ngưng Anh Đan',
        type: 'recipe',
        icon: '📜',
        quality: 'Địa',
        price: 10000,
        description: 'Đan phương quý hiếm dùng để đột phá Nguyên Anh.',
        effect: { type: 'learn_recipe', value: 'ngung_anh_dan' }
    },

    // --- SMITHING BLUEPRINTS ---
    'bv_thanh_hong_kiem': {
        id: 'bv_thanh_hong_kiem',
        name: 'Bản Vẽ: Thanh Hồng Kiếm',
        type: 'recipe',
        icon: '📜',
        quality: 'Hoàng',
        price: 400,
        description: 'Bản vẽ rèn đúc Thanh Hồng Kiếm.',
        effect: { type: 'learn_smithing_recipe', value: 'thanh_hong_kiem' }
    },
    'bv_phi_kiem_tinh_ha': {
        id: 'bv_phi_kiem_tinh_ha',
        name: 'Bản Vẽ: Tinh Hà Phi Kiếm',
        type: 'recipe',
        icon: '📜',
        quality: 'Huyền',
        price: 1500,
        description: 'Bản vẽ rèn đúc Tinh Hà Phi Kiếm.',
        effect: { type: 'learn_smithing_recipe', value: 'phi_kiem_tinh_ha' }
    },
    'bv_long_lan_giap': {
        id: 'bv_long_lan_giap',
        name: 'Bản Vẽ: Long Lân Giáp',
        type: 'recipe',
        icon: '📜',
        quality: 'Huyền',
        price: 2500,
        description: 'Bản vẽ rèn đúc Long Lân Giáp.',
        effect: { type: 'learn_smithing_recipe', value: 'long_lan_giap' }
    },
    'bv_bat_quai_kinh': {
        id: 'bv_bat_quai_kinh',
        name: 'Bản Vẽ: Bát Quái Kính',
        type: 'recipe',
        icon: '📜',
        quality: 'Hoàng',
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
        quality: 'Hoàng',
        price: 200,
        description: 'Phù văn cơ bản của hỏa hệ.',
        effect: { type: 'learn_talisman_recipe', value: 'hoa_cau_phu' }
    },
    'pv_kim_cuong_phu': {
        id: 'pv_kim_cuong_phu',
        name: 'Phù Văn: Kim Cương Phù',
        type: 'talisman_recipe',
        icon: '📜',
        quality: 'Hoàng',
        price: 500,
        description: 'Phù văn tăng phòng ngự.',
        effect: { type: 'learn_talisman_recipe', value: 'kim_cuong_phu' }
    },
    'pv_than_hanh_phu': {
        id: 'pv_than_hanh_phu',
        name: 'Phù Văn: Thần Hành Phù',
        type: 'talisman_recipe',
        icon: '📜',
        quality: 'Hoàng',
        price: 400,
        description: 'Phù văn tăng tốc độ di chuyển.',
        effect: { type: 'learn_talisman_recipe', value: 'than_hanh_phu' }
    },
    'pv_thun_di_phu': {
        id: 'pv_thun_di_phu',
        name: 'Phù Văn: Thuấn Di Phù',
        type: 'talisman_recipe',
        icon: '📜',
        quality: 'Huyền',
        price: 1500,
        description: 'Phù văn dịch chuyển tức thời.',
        effect: { type: 'learn_talisman_recipe', value: 'thun_di_phu' }
    },
    'pv_thien_loi_phu': {
        id: 'pv_thien_loi_phu',
        name: 'Phù Văn: Thiên Lôi Phù',
        type: 'talisman_recipe',
        icon: '📜',
        quality: 'Địa',
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
        quality: 'Hoàng',
        price: 1000,
        description: 'Học cách bố trí Tụ Linh Trận.',
        effect: { type: 'learn_formation', value: 'tran_do_tu_linh' }
    },
    'td_ao_anh_tran': {
        id: 'td_ao_anh_tran',
        name: 'Trận Đồ: Ảo Ảnh Trận',
        type: 'recipe',
        icon: '📜',
        quality: 'Hoàng',
        price: 1500,
        description: 'Học cách bố trí Ảo Ảnh Trận.',
        effect: { type: 'learn_formation', value: 'tran_do_ao_anh' }
    },
    'td_sat_kiem_tran': {
        id: 'td_sat_kiem_tran',
        name: 'Trận Đồ: Sát Kiếm Trận',
        type: 'recipe',
        icon: '📜',
        quality: 'Huyền',
        price: 5000,
        description: 'Học cách bố trí Sát Kiếm Trận.',
        effect: { type: 'learn_formation', value: 'tran_do_sat_kiem' }
    },
    'td_ho_tong_dai_tran': {
        id: 'td_ho_tong_dai_tran',
        name: 'Trận Đồ: Hộ Tông Đại Trận',
        type: 'recipe',
        icon: '📜',
        quality: 'Địa',
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
        quality: 'Hoàng',
        price: 1000,
        description: 'Hướng dẫn chế tạo Thiết Giáp Khôi Lỗi.',
        effect: { type: 'learn_puppet_recipe', value: 'thiet_giap_khoi_loi' }
    },
    'bv_kiem_khoi': {
        id: 'bv_kiem_khoi',
        name: 'Bản Vẽ: Kiếm Khôi',
        type: 'recipe',
        icon: '📜',
        quality: 'Huyền',
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
        quality: 'Hoàng',
        price: 500,
        description: 'Ghi chép cách luyện chế Thi Binh cơ bản.',
        effect: { type: 'learn_corpse_recipe', value: 'thi_binh' }
    },
    'bp_thi_tuong': {
        id: 'bp_thi_tuong',
        name: 'Bí Phương: Luyện Chế Thi Tướng',
        type: 'recipe',
        icon: '📜',
        quality: 'Huyền',
        price: 2000,
        description: 'Ghi chép cách luyện chế Thi Tướng hung hãn.',
        effect: { type: 'learn_corpse_recipe', value: 'thi_tuong' }
    },
    'bp_dong_giap_thi': {
        id: 'bp_dong_giap_thi',
        name: 'Bí Phương: Luyện Chế Đồng Giáp Thi',
        type: 'recipe',
        icon: '📜',
        quality: 'Huyền',
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
        quality: 'Phàm',
        price: 30,
        description: 'Đan dược giúp tu sĩ không cần ăn uống, tập trung bế quan. Tăng nhẹ tốc độ tu luyện trong 1 giờ.',
        effect: { type: 'buff', stat: 'tu_vi_speed', value: 1.1, duration: 3600 }
    },
    'ngung_khi_dan': {
        id: 'ngung_khi_dan',
        name: 'Ngưng Khí Đan',
        type: 'consumable',
        icon: '💊',
        quality: 'Hoàng',
        price: 150,
        description: 'Gia tăng 500 linh khí ngay lập tức.',
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
    'hoa_diem_thao': {
        id: 'hoa_diem_thao',
        name: 'Hỏa Diễm Thảo',
        type: 'material',
        icon: '🔥',
        quality: 'Linh',
        price: 250,
        description: 'Thảo dược nóng rực, sinh trưởng ở nơi có hỏa khí nồng đậm.'
    },
    'han_tuy_hoa': {
        id: 'han_tuy_hoa',
        name: 'Hàn Tủy Hoa',
        type: 'material',
        icon: '❄️',
        quality: 'Linh',
        price: 250,
        description: 'Hoa trắng như tuyết, mang theo hàn khí thấu xương.'
    },
    'u_minh_hoa': {
        id: 'u_minh_hoa',
        name: 'U Minh Hoa',
        type: 'material',
        icon: '💀',
        quality: 'Huyền',
        price: 500,
        description: 'Hoa mọc nơi âm khí nồng đậm, u tối.'
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
        type: 'spaceArtifact',
        icon: '🎒',
        quality: 'Thường',
        tier: 'PHAP_KHI',
        price: 500,
        description: 'Mở rộng thêm 10 ô chứa đồ.',
        stats: { slots: 10 }
    },
    'ho_tam_kinh': {
        id: 'ho_tam_kinh',
        name: 'Hộ Tâm Kính',
        type: 'defenseArtifact',
        quality: 'Hoàn Mỹ',
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
        quality: 'Thường',
        tier: 'PHAP_KHI',
        icon: '🛶',
        description: 'Thuyền nhỏ bay trên không trung bằng linh thạch.',
        price: 3000,
        stats: { spd: 20 },
        durability: 80,
        maxDurability: 80
    },
    'tu_linh_chau': {
        id: 'tu_linh_chau',
        name: 'Tụ Linh Châu',
        type: 'supportArtifact',
        quality: 'Cực Phẩm',
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
        quality: 'Thường',
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
        quality: 'Truyền Thuyết',
        tier: 'CHAN_BAO',
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
        quality: 'Cực Phẩm',
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
        type: 'spirit_stone',
        grade: 'HA',
        attribute: 'NORMAL',
        icon: '💎',
        quality: 'Phàm',
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
        icon: '💠',
        quality: 'Huyền',
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
        icon: '🔮',
        quality: 'Thiên',
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
        icon: '🌌',
        quality: 'Thần',
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
        quality: 'Phàm',
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
        quality: 'Phàm',
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
        quality: 'Phàm',
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
        quality: 'Phàm',
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
        quality: 'Phàm',
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
        quality: 'Phàm',
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
        quality: 'Phàm',
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
        quality: 'Tiên',
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
        quality: 'Thần',
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
        quality: 'Thần',
        price: 2000000000,
        weight: 1.0,
        description: 'Chí bảo từ thời Hồng Mông, chứa đựng quy tắc của đại đạo.'
    },
    'phe_thach': {
        id: 'phe_thach',
        name: 'Phế Linh Thạch',
        type: 'material',
        icon: '🪨',
        quality: 'Phàm',
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
        quality: 'Huyền',
        price: 1000,
        description: 'Tinh thể ngưng tụ từ ma khí đậm đặc, dùng để tăng Ma Khí.',
        effect: { type: 'qi_absorb', qiType: 'ma_khi', amount: 500, purity: 'TINH_THUAN' }
    },
    'tien_ngoc': {
        id: 'tien_ngoc',
        name: 'Tiên Ngọc',
        type: 'consumable',
        icon: '💎',
        quality: 'Thiên',
        price: 50000,
        description: 'Ngọc thạch từ Tiên Giới, chứa đựng Tiên Khí tinh thuần.',
        effect: { type: 'qi_absorb', qiType: 'tien_khi', amount: 1000, purity: 'CUC_PHAM' }
    },
    'hon_don_tinh_thach': {
        id: 'hon_don_tinh_thach',
        name: 'Hỗn Độn Tinh Thạch',
        type: 'consumable',
        icon: '🌌',
        quality: 'Thần',
        price: 500000,
        description: 'Mảnh vỡ từ thuở khai thiên lập địa, chứa Hỗn Độn Khí cực kỳ nguy hiểm.',
        effect: { type: 'qi_absorb', qiType: 'hon_don_khi', amount: 200, purity: 'DAO' }
    },
    'sinh_menh_thach': {
        id: 'sinh_menh_thach',
        name: 'Sinh Mệnh Thạch',
        type: 'consumable',
        icon: '🌱',
        quality: 'Địa',
        price: 15000,
        description: 'Đá quý chứa đựng sinh cơ dồi dào, giúp tăng Sinh Khí.',
        effect: { type: 'qi_absorb', qiType: 'sinh_khi', amount: 800, purity: 'TINH_THUAN' }
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
    'chuong_thien_binh': {
        id: 'chuong_thien_binh',
        name: 'Chưởng Thiên Bình',
        type: 'supportArtifact',
        quality: 'Thần Thoại',
        tier: 'HONG_MONG',
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
        quality: 'Cực Phẩm',
        tier: 'THONG_THIEN',
        image: 'artifacts/hu-thien-dinh.svg',
        description: 'Đỉnh quý chứa đựng không gian quy tắc, hỗ trợ luyện đan và trấn áp.',
        price: 500000,
        stats: { alchemySuccess: 0.2, soulRepress: 30 }
    },
    'bat_linh_xich': {
        id: 'bat_linh_xich',
        name: 'Bát Linh Xích',
        type: 'attackArtifact',
        quality: 'Hoàn Mỹ',
        tier: 'HUYEN_THIEN',
        image: 'artifacts/bat-linh-xich.svg',
        description: 'Pháp bảo hình thước, có khả năng phong ấn linh lực đối phương.',
        price: 300000,
        stats: { atk: 500, soulRepress: 20 }
    },
    'binh_son_an': {
        id: 'binh_son_an',
        name: 'Bình Sơn Ấn',
        type: 'attackArtifact',
        quality: 'Tinh Phẩm',
        tier: 'HUYEN_THIEN',
        image: 'artifacts/binh-son-an.svg',
        description: 'Pháp bảo dạng ấn ký, mang theo sức mạnh của vạn quân sơn nhạc.',
        price: 250000,
        stats: { atk: 800, spd: -10 }
    },
    'phong_loi_si': {
        id: 'phong_loi_si',
        name: 'Phong Lôi Sí',
        type: 'flightArtifact',
        quality: 'Hoàn Mỹ',
        tier: 'HUYEN_THIEN',
        image: 'artifacts/phong-loi-si.svg',
        description: 'Quạt lông vũ mang theo sức mạnh phong lôi, tăng mạnh tốc độ độn tẩu.',
        price: 400000,
        stats: { spd: 150, atk: 200 }
    },
    'huyet_sac_phi_phong': {
        id: 'huyet_sac_phi_phong',
        name: 'Huyết Sắc Phi Phong',
        type: 'defenseArtifact',
        quality: 'Tinh Phẩm',
        tier: 'HUYEN_THIEN',
        image: 'artifacts/huyet-sac-phi-phong.svg',
        description: 'Áo choàng máu, tăng khả năng né tránh và phòng ngự.',
        price: 200000,
        stats: { def: 300, spd: 50 }
    },
    'nguyen_tu_cuc_son': {
        id: 'nguyen_tu_cuc_son',
        name: 'Nguyên Từ Cực Sơn',
        type: 'attackArtifact',
        quality: 'Hoàn Mỹ',
        tier: 'HUYEN_THIEN',
        image: 'artifacts/nguyen-tu-cuc-son.svg',
        description: 'Ngọn núi chứa đựng nguyên từ thần quang, khắc chế ngũ hành pháp bảo.',
        price: 600000,
        stats: { atk: 1200, def: 500, pierce: 0.3 }
    },
    'bac_cuc_cuc_son': {
        id: 'bac_cuc_cuc_son',
        name: 'Bắc Cực Cực Sơn',
        type: 'attackArtifact',
        quality: 'Hoàn Mỹ',
        tier: 'HUYEN_THIEN',
        image: 'artifacts/bac-cuc-nguyen-quang-cuc-son.png',
        description: 'Ngọn núi chứa đựng Bắc Cực Nguyên Quang, đóng băng vạn vật.',
        price: 600000,
        stats: { atk: 1100, def: 600, iceDmg: 200 }
    },
    'nguyen_hop_ngu_cuc_son': {
        id: 'nguyen_hop_ngu_cuc_son',
        name: 'Nguyên Hợp Ngũ Cực Sơn',
        type: 'attackArtifact',
        quality: 'Truyền Thuyết',
        tier: 'THONG_THIEN',
        image: 'artifacts/nguyen-hop-ngu-cuc-son.svg',
        description: 'Sự kết hợp của năm ngọn cực sơn, uy lực chấn động thiên địa.',
        price: 5000000,
        stats: { atk: 5000, def: 2500, pierce: 0.5, daoVun: 10 }
    },
    'linh_dich': {
        id: 'linh_dich',
        name: 'Linh Dịch (Chưởng Thiên Bình)',
        type: 'consumable',
        quality: 'Thần Thoại',
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
        quality: 'Truyền Thuyết',
        image: 'aberrations/phe-kim-trung.svg',
        description: 'Trứng của loài hung trùng thượng cổ, có thể cắn nuốt vạn vật.',
        price: 50000
    },
    'egg_bang_tam': {
        id: 'egg_bang_tam',
        name: 'Trứng Băng Tàm',
        type: 'beast_egg',
        beastId: 'bang_tam',
        quality: 'Cực Phẩm',
        image: 'aberrations/bang-tam.svg',
        description: 'Trứng của loài tằm băng vùng cực hàn, nhả tơ chứa hàn khí thấu xương.',
        price: 20000
    },
    'egg_huyet_ngoc_tri_chu': {
        id: 'egg_huyet_ngoc_tri_chu',
        name: 'Trứng Huyết Ngọc Tri Chu',
        type: 'beast_egg',
        beastId: 'huyet_ngoc_tri_chu',
        quality: 'Tinh Phẩm',
        image: 'aberrations/huyet-ngoc-tri-chu.svg',
        description: 'Trứng nhện ngọc máu, có khả năng phun tơ dính và độc tố cực mạnh.',
        price: 15000
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
    'hoang_chi_phu': { id: 'hoang_chi_phu', name: 'Hoàng Chỉ Phù', type: 'material', icon: '📜', quality: 'Phàm', price: 10, description: 'Giấy phù vàng cơ bản.' },
    'chu_sa_muc': { id: 'chu_sa_muc', name: 'Chu Sa Mực', type: 'material', icon: '🩸', quality: 'Phàm', price: 20, description: 'Mực chu sa dùng để vẽ phù.' },

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

    // --- PROFESSION SECRETS (BÍ PHÁP MỞ KHÓA NGHỀ NGHIỆP) ---
    'bp_luyen_dan': {
        id: 'bp_luyen_dan',
        name: 'Đan Đạo Chân Giải',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
        price: 1000,
        effect: { type: 'unlock_profession', profession: 'alchemy', secretId: 'bp_luyen_dan' },
        description: 'Gia tăng vĩnh viễn tỉ lệ luyện đan thành công.'
    },
    'truong_sinh_quyet_book': {
        id: 'truong_sinh_quyet_book',
        name: 'Trường Sinh Quyết',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
        price: 1000,
        description: 'Bí tịch dưỡng sinh cổ xưa, tăng mạnh Thọ Nguyên.'
    },
    'huyet_don_thuat_book': {
        id: 'huyet_don_thuat_book',
        name: 'Huyết Độn Thuật',
        type: 'consumable',
        icon: '🩸',
        quality: 'Huyền',
        price: 1500,
        description: 'Ma đạo bí pháp, dùng tinh huyết để độn tẩu cực nhanh.'
    },
    'bp_luyen_khi': {
        id: 'bp_luyen_khi',
        name: 'Luyện Khí Tổng Cương',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
        price: 1500,
        effect: { type: 'unlock_profession', profession: 'smithing', secretId: 'bp_luyen_khi' },
        description: 'Chứa đựng bí quyết tôi luyện kim thạch, rèn đúc thần binh pháp bảo.'
    },
    'bp_phu_luc': {
        id: 'bp_phu_luc',
        name: 'Thái Thượng Phù Kinh',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
        price: 1000,
        effect: { type: 'unlock_profession', profession: 'talisman', secretId: 'bp_phu_luc' },
        description: 'Hướng dẫn cách câu thông thiên địa linh lực vào phù văn để tạo ra phù lục.'
    },
    'bp_tran_phap': {
        id: 'bp_tran_phap',
        name: 'Trận Đạo Thiên Thư',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
        price: 2000,
        effect: { type: 'unlock_profession', profession: 'formation', secretId: 'bp_tran_phap' },
        description: 'Kiến thức về trận đồ, mắt trận và cách bố trí linh thạch để trấn giữ hoặc công kích.'
    },
    'bp_ngu_thu': {
        id: 'bp_ngu_thu',
        name: 'Vạn Thú Ngự Pháp',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
        price: 1200,
        effect: { type: 'unlock_profession', profession: 'beast', secretId: 'bp_ngu_thu' },
        description: 'Bí quyết giao tiếp và ký kết khế ước với các loài linh thú.'
    },
    'bp_ngu_trung': {
        id: 'bp_ngu_trung',
        name: 'Thiên Trùng Bí Lục',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
        price: 1200,
        effect: { type: 'unlock_profession', profession: 'insect', secretId: 'bp_ngu_trung' },
        description: 'Cách nuôi dưỡng và điều khiển bầy trùng mang theo kịch độc hoặc năng lực đặc thù.'
    },
    'bp_khoi_loi': {
        id: 'bp_khoi_loi',
        name: 'Cơ Quan Linh Kỹ',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
        price: 2500,
        effect: { type: 'unlock_profession', profession: 'puppet', secretId: 'bp_khoi_loi' },
        description: 'Kỹ thuật chế tác cơ quan và truyền linh hồn vào các vật vô tri để tạo ra khôi lỗi.'
    },
    'bp_luyen_thi': {
        id: 'bp_luyen_thi',
        name: 'Cửu U Luyện Thi Thuật',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
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
    'yeu_dan_trung': {
        id: 'yeu_dan_trung',
        name: 'Yêu Đan Trung Cấp',
        type: 'material',
        icon: '🟠',
        quality: 'Huyền',
        price: 1500,
        description: 'Nội đan của yêu thú trung cấp, chứa linh lực dồi dào.'
    },
    'ngung_anh_dan': {
        id: 'ngung_anh_dan',
        name: 'Ngưng Anh Đan',
        type: 'consumable',
        icon: '💎',
        quality: 'Địa',
        price: 50000,
        description: 'Đan dược hỗ trợ ngưng tụ Nguyên Anh, cực kỳ quý hiếm.',
        stats: { breakthroughRate: 0.25 }
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
    'linh_thao_van_nam': {
        id: 'linh_thao_van_nam',
        name: 'Linh Thảo (Vạn năm)',
        type: 'material',
        icon: '🌺',
        quality: 'Thiên',
        price: 50000,
        description: 'Linh thảo sinh trưởng vạn năm, đã thông linh tính, có thể luyện chế Tiên đan.'
    },
    'huyen_thiet': {
        id: 'huyen_thiet',
        name: 'Huyền Thiết',
        type: 'material',
        icon: '⬛',
        quality: 'Huyền',
        price: 800,
        description: 'Sắt đen cực nặng và cứng, dùng để rèn vũ khí hạng nặng.'
    },
    'tinh_kim': {
        id: 'tinh_kim',
        name: 'Tinh Kim',
        type: 'material',
        icon: '✨',
        quality: 'Địa',
        price: 3000,
        description: 'Vàng tinh khiết chứa linh lực, dẫn linh cực tốt.'
    },
    'vân_thiết': {
        id: 'vân_thiết',
        name: 'Thiên Ngoại Vẫn Thiết',
        type: 'material',
        icon: '☄️',
        quality: 'Thiên',
        price: 25000,
        description: 'Mảnh vỡ thiên thạch từ ngoài không gian, chứa sức mạnh tinh thần.'
    },
    'yeu_cot': {
        id: 'yeu_cot',
        name: 'Yêu Thú Cốt',
        type: 'material',
        icon: '🦴',
        quality: 'Hoàng',
        price: 150,
        description: 'Xương của yêu thú, dùng làm nguyên liệu chế tác hoặc luyện thi.'
    },
    'da_lan_giap': {
        id: 'da_lan_giap',
        name: 'Da Lân Giáp',
        type: 'material',
        icon: '🛡️',
        quality: 'Huyền',
        price: 1200,
        description: 'Lớp da hoặc vảy của yêu thú phòng ngự cao.'
    },
    'long_huyet_tinh': {
        id: 'long_huyet_tinh',
        name: 'Long Huyết Tinh',
        type: 'material',
        icon: '🩸',
        quality: 'Địa',
        price: 10000,
        description: 'Tinh hoa máu rồng ngưng kết, chứa sức mạnh huyết mạch kinh người.'
    },
    'tien_tinh': {
        id: 'tien_tinh',
        name: 'Tiên Tinh',
        type: 'material',
        icon: '💎',
        quality: 'Thiên',
        price: 100000,
        description: 'Tinh thể kết tinh từ Tiên khí, chỉ có ở những nơi tiên phàm giao giới.'
    },
    'trung_than_thu': {
        id: 'trung_than_thu',
        name: 'Trứng Thần Thú',
        type: 'consumable',
        icon: '🥚',
        quality: 'Thần',
        price: 1000000,
        description: 'Trứng của sinh vật cổ đại, có thể ấp nở thành linh thú hộ mệnh.',
        effect: { type: 'hatch' }
    },
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
    'pham_lu_item': {
        id: 'pham_lu_item',
        name: 'Phàm Lư',
        type: 'consumable',
        icon: '🏺',
        quality: 'Phàm',
        price: 100,
        description: 'Đan lư cơ bản cho người mới học luyện đan.',
        effect: { type: 'equip_cauldron', value: 'pham_lu' }
    },
    'linh_hoa_item': {
        id: 'linh_hoa_item',
        name: 'Mồi Lửa: Linh Hỏa',
        type: 'consumable',
        icon: '🔥',
        quality: 'Phàm',
        price: 50,
        description: 'Linh hỏa cấp thấp, đủ để luyện chế đan dược phàm phẩm.',
        effect: { type: 'refine_flame', value: 'linh_hoa' }
    },
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
    'de_khi_dai': {
        id: 'de_khi_dai',
        name: 'Đế Khí Đài',
        type: 'smithing_tool',
        icon: '⚒️',
        quality: 'Phàm',
        price: 200,
        description: 'Bệ rèn thô sơ cho người mới học luyện khí.'
    },
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

    // --- BÍ PHÁP NGHỀ NGHIỆP (UNLOCKS) ---
    'bi_phap_alchemy': {
        id: 'bi_phap_alchemy',
        name: '« Đan Đạo Chân Giải »',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
        price: 5000,
        description: 'Ghi chép tinh túy của đan đạo, dùng để mở khóa nghề Luyện Đan.',
        effect: { type: 'unlock_profession', profession: 'alchemy' }
    },
    'bi_phap_talisman': {
        id: 'bi_phap_talisman',
        name: '« Thiên Phù Bí Lục »',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
        price: 5000,
        description: 'Chứa đựng bí mật của phù văn, dùng để mở khóa nghề Phù Lục.',
        effect: { type: 'unlock_profession', profession: 'talisman' }
    },
    'bi_phap_smithing': {
        id: 'bi_phap_smithing',
        name: '« Luyện Khí Tổng Cương »',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
        price: 5000,
        description: 'Bí tịch rèn đúc pháp bảo, dùng để mở khóa nghề Luyện Khí.',
        effect: { type: 'unlock_profession', profession: 'smithing' }
    },
    'bi_phap_formation': {
        id: 'bi_phap_formation',
        name: '« Trận Đạo Diễn Nghĩa »',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
        price: 5000,
        description: 'Giải mã các trận pháp cổ đại, dùng để mở khóa nghề Trận Pháp.',
        effect: { type: 'unlock_profession', profession: 'formation' }
    },
    'bi_phap_puppet': {
        id: 'bi_phap_puppet',
        name: '« Khôi Lỗi Chân Kinh »',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
        price: 5000,
        description: 'Bí thuật điều khiển rối, dùng để mở khóa nghề Khôi Lỗi.',
        effect: { type: 'unlock_profession', profession: 'puppet' }
    },
    'bi_phap_corpse': {
        id: 'bi_phap_corpse',
        name: '« Thi Đạo Quyển Thứ »',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
        price: 5000,
        description: 'Tà thuật luyện chế xác chết, dùng để mở khóa nghề Luyện Thi.',
        effect: { type: 'unlock_profession', profession: 'corpse' }
    },
    'bi_phap_beast': {
        id: 'bi_phap_beast',
        name: '« Ngự Thú Tâm Pháp »',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
        price: 5000,
        description: 'Tâm pháp dẫn dắt linh thú, dùng để mở khóa nghề Ngự Thú.',
        effect: { type: 'unlock_profession', profession: 'beast' }
    },
    'bi_phap_insect': {
        id: 'bi_phap_insect',
        name: '« Vạn Trùng Bí Truyền »',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
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
    },
    'recipe_than_tam': {
        id: 'recipe_than_tam',
        name: 'Đan Phương: Thanh Tâm Đan',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
        price: 2500,
        description: 'Ghi chép cách luyện chế Thanh Tâm Đan.',
        effect: { type: 'learn_recipe', value: 'than_tam_dan' }
    },
    'recipe_truc_co': {
        id: 'recipe_truc_co',
        name: 'Đan Phương: Trúc Cơ Đan',
        type: 'consumable',
        icon: '📜',
        quality: 'Địa',
        price: 15000,
        description: 'Ghi chép cách luyện chế Trúc Cơ Đan cực kỳ quý giá.',
        effect: { type: 'learn_recipe', value: 'truc_co_dan' }
    },
    'bp_tinh_ha': {
        id: 'bp_tinh_ha',
        name: 'Bản Vẽ: Tinh Hà Phi Kiếm',
        type: 'consumable',
        icon: '📜',
        quality: 'Huyền',
        price: 8000,
        description: 'Ghi chép phương pháp rèn Tinh Hà Phi Kiếm.',
        effect: { type: 'learn_smithing_recipe', value: 'phi_kiem_tinh_ha' }
    },
    'bp_long_lan': {
        id: 'bp_long_lan',
        name: 'Bản Vẽ: Long Lân Giáp',
        type: 'consumable',
        icon: '📜',
        quality: 'Địa',
        price: 25000,
        description: 'Bản vẽ rèn Long Lân Giáp phòng ngự kinh người.',
        effect: { type: 'learn_smithing_recipe', value: 'long_lan_giap' }
    },
    'huyen_lu_item': {
        id: 'huyen_lu_item',
        name: 'Huyền Thiết Lư',
        type: 'cauldron',
        icon: '🏺',
        quality: 'Hoàng',
        price: 5000,
        description: 'Đan lư rèn từ huyền thiết, dẫn hỏa ổn định.',
        stats: { alchemyBonus: 0.1 }
    },
    'dia_lu_item': {
        id: 'dia_lu_item',
        name: 'Địa Long Phần Thiên Lư',
        type: 'cauldron',
        icon: '🏺',
        quality: 'Địa',
        price: 35000,
        description: 'Chứa đựng tinh hoa chi lực của địa long, khống hỏa cực tốt.'
    },
    'thien_lu_item': {
        id: 'thien_lu_item',
        name: 'Thiên Cực Thái Hư Lư',
        type: 'cauldron',
        icon: '🏺',
        quality: 'Thiên',
        price: 150000,
        description: 'Lò luyện đỉnh cấp, ổn định hỏa lực đến mức hoàn mỹ.'
    },
    'van_lac_tam_viem_seed': {
        id: 'van_lac_tam_viem_seed',
        name: 'Vẫn Lạc Tâm Viêm (Chủng)',
        type: 'consumable',
        icon: '🔥',
        quality: 'Địa',
        price: 120000,
        description: 'Hỏa chủng của Vẫn Lạc Tâm Viêm, tăng mạnh hiệu suất luyện đan.',
        effect: { type: 'refine_flame', value: 'van_lac_tam_viem' }
    },
    'tinh_lien_yeu_hoa_seed': {
        id: 'tinh_lien_yeu_hoa_seed',
        name: 'Tịnh Liên Yêu Hỏa (Chủng)',
        type: 'consumable',
        icon: '🔥',
        quality: 'Thiên',
        price: 800000,
        description: 'Yêu hỏa thần bí có khả năng tịnh hóa vạn vật.',
        effect: { type: 'refine_flame', value: 'tinh_lien_yeu_hoa' }
    },
    // --- RECIPES ---
    'recipe_ngung_khi': {
        id: 'recipe_ngung_khi',
        name: 'Đan Phương Ngưng Khí Đan',
        type: 'recipe',
        quality: 'Phàm',
        icon: '📜',
        description: 'Ghi chép cách luyện chế Ngưng Khí Đan.',
        price: 200,
        recipeId: 'ngung_khi_dan'
    },
    'recipe_than_tam': {
        id: 'recipe_than_tam',
        name: 'Đan Phương Thanh Tâm Đan',
        type: 'recipe',
        quality: 'Hoàng',
        icon: '📜',
        description: 'Ghi chép cách luyện chế Thanh Tâm Đan.',
        price: 500,
        recipeId: 'thanh_tam_dan'
    },
    'recipe_truc_co': {
        id: 'recipe_truc_co',
        name: 'Đan Phương Trúc Cơ Đan',
        type: 'recipe',
        quality: 'Huyền',
        icon: '📜',
        description: 'Ghi chép cách luyện chế Trúc Cơ Đan cực kỳ quý giá.',
        price: 2000,
        recipeId: 'truc_co_dan'
    },
    'recipe_phi_kiem_tinh_ha': {
        id: 'recipe_phi_kiem_tinh_ha',
        name: 'Bản Vẽ Tinh Hà Phi Kiếm',
        type: 'recipe',
        quality: 'Hoàng',
        icon: '⚒️',
        description: 'Bản vẽ rèn đúc Tinh Hà Phi Kiếm.',
        price: 800,
        recipeId: 'phi_kiem_tinh_ha'
    },
    'recipe_long_lan_giap': {
        id: 'recipe_long_lan_giap',
        name: 'Bản Vẽ Long Lân Giáp',
        type: 'recipe',
        quality: 'Huyền',
        icon: '⚒️',
        description: 'Bản vẽ rèn đúc Long Lân Giáp.',
        price: 2500,
        recipeId: 'long_lan_giap'
    },

    // --- PROFESSION MANUALS (BÍ PHÁP) ---
};

export const getItemById = (id) => ITEMS[id];
