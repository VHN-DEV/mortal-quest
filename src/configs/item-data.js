import { ITEM_TYPES, ITEM_CATEGORIES_ENUM, EFFECT_TYPES, PHAP_BAO_QUALITIES, DAN_DUOC_QUALITIES, CONG_PHAP_QUALITIES, DI_HOA_QUALITIES, DI_LOI_QUALITIES, LINH_THU_QUALITIES } from './item-classification.js';

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
    'linh_chung_thanh_phuc_thao': {
        id: 'linh_chung_thanh_phuc_thao', name: 'Linh Chủng Thanh Phục Thảo', type: ITEM_TYPES.LINH_CHUNG, icon: '🌱', quality: PHAP_BAO_QUALITIES.PHAM_KHI, price: 10, description: 'Hạt giống Thanh Phục Thảo, loại linh thảo sơ cấp phổ biến nhất ở Nhân giới.', categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_DUOC, subSubcategory: 'duoi_100_nam' }
        ]
    },
    'linh_chung_hoa_diem_thao': {
        id: 'linh_chung_hoa_diem_thao', name: 'Linh Chủng Hỏa Diễm Thảo', type: ITEM_TYPES.LINH_CHUNG, icon: '🔥', quality: PHAP_BAO_QUALITIES.LINH_KHI, price: 150, description: 'Linh chủng của Hỏa Diễm Thảo.', categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_DUOC, subSubcategory: '100_nam' }
        ]
    },
    'linh_chung_han_tuy_hoa': {
        id: 'linh_chung_han_tuy_hoa', name: 'Linh Chủng Hàn Tủy Hoa', type: ITEM_TYPES.LINH_CHUNG, icon: '❄️', quality: PHAP_BAO_QUALITIES.LINH_KHI, price: 150, description: 'Linh chủng của Hàn Tủy Hoa.', categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_DUOC, subSubcategory: '100_nam' }
        ]
    },
    'linh_chung_u_minh_hoa': {
        id: 'linh_chung_u_minh_hoa', name: 'Linh Chủng U Minh Hoa', type: ITEM_TYPES.LINH_CHUNG, icon: '💀', quality: PHAP_BAO_QUALITIES.LINH_KHI, price: 300, description: 'Linh chủng của U Minh Hoa.', categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_DUOC, subSubcategory: '100_nam' }
        ]
    },

    // Trứng Linh Thú
    'trung_thanh_van_ly': {
        id: 'trung_thanh_van_ly',
        name: 'Trứng Thanh Vân Ly Thú',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        beastId: 'thanh_van_ly',
        icon: '🥚',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Trứng của Thanh Vân Ly Thú, tỏa ra linh khí thanh khiết của mây trời.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_LINH_THU }
        ]
    },
    'trung_huyen_giap_dia_long': {
        id: 'trung_huyen_giap_dia_long',
        name: 'Trứng Huyền Giáp Địa Long',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        beastId: 'huyen_giap_dia_long',
        icon: '🥚',
        quality: LINH_THU_QUALITIES.DIA_CAP,
        price: 15000,
        description: 'Trứng của Huyền Giáp Địa Long, nặng trịch như đá và bao phủ bởi lớp vỏ đen nhánh cứng cáp.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_LINH_THU }
        ]
    },
    'trung_u_minh_mong_diep': {
        id: 'trung_u_minh_mong_diep',
        name: 'Trứng U Minh Mộng Điệp',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        beastId: 'u_minh_mong_diep',
        icon: '🥚',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 8000,
        description: 'Kén của U Minh Mộng Điệp, tỏa ra làn khói ảo ảnh mờ ảo.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_LINH_THU }
        ]
    },

    // Vật phẩm đặc biệt
    'di_hoa_bang': {
        id: 'di_hoa_bang',
        name: 'Dị Hỏa Bảng',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1700,
        description: 'Bản danh sách ghi chép về 23 loại Dị Hỏa kỳ dị nhất trong thiên địa. Bấm vào để xem chi tiết.',
        action: 'open_di_hoa_bang',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.SUBCATEGORIES.NGOC_GIAN }
        ]
    },
    'di_loi_bang': {
        id: 'di_loi_bang',
        name: 'Dị Lôi Bảng',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1500,
        description: 'Bản danh sách ghi chép về 10 loại Dị Lôi cường hãn nhất trong thiên địa. Bấm vào để xem chi tiết.',
        action: 'open_di_loi_bang',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.SUBCATEGORIES.NGOC_GIAN }
        ]
    },
    'linh_the_luc': {
        id: 'linh_the_luc',
        name: 'Chư Thiên Linh Thể Lục',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 2000,
        description: 'Bản danh sách ghi chép về 15 loại Linh Thể mạnh mẽ nhất chư thiên. Bấm vào để xem chi tiết.',
        action: 'open_linh_the_luc',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.SUBCATEGORIES.NGOC_GIAN }
        ]
    },
    'phap_bao_luc': {
        id: 'phap_bao_luc',
        name: 'Vạn Bảo Lục',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 3000,
        description: 'Bản danh sách ghi chép về các loại pháp bảo, thần khí trong thiên địa, phân loại theo phẩm cấp và công dụng. Bấm vào để xem chi tiết.',
        action: 'open_phap_bao_luc',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.SUBCATEGORIES.NGOC_GIAN }
        ]
    },
    'van_toc_thong_giam': {
        id: 'van_toc_thong_giam',
        name: 'Vạn Tộc Thông Giám',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1500,
        description: 'Cuốn điển tịch cổ ghi chép tường tận về nguồn gốc và đặc điểm của vạn tộc trong thiên địa. Bấm vào để xem chi tiết.',
        action: 'open_van_toc_thong_giam',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.SUBCATEGORIES.NGOC_GIAN }
        ]
    },

    // --- PROFESSION MANUALS ---
    'dan_dao_chan_giai': {
        id: 'dan_dao_chan_giai',
        name: 'Đan Đạo Chân Giải',
        image: 'items/dan_dao_chan_giai',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📔',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 1000,
        description: 'Sách nhập môn về Luyện Đan, giúp mở khóa nghề Luyện Dược Sư và truyền thụ cách luyện chế Tịch Cốc Đan, Ngưng Khí Đan.',
        effect: {
            type: EFFECT_TYPES.HOC_NHIEU_CONG_THUC,
            value: [
                { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'alchemy', secretId: 'dan_dao_chan_giai' },
                { type: EFFECT_TYPES.HOC_CONG_THUC_DAN, value: 'tich_coc_dan' },
                { type: EFFECT_TYPES.HOC_CONG_THUC_DAN, value: 'ngung_khi_dan' }
            ]
        },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    'luyen_khi_tong_cuong': {
        id: 'luyen_khi_tong_cuong',
        name: 'Luyện Khí Tổng Cương',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📔',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 1200,
        description: 'Nguyên lý cơ bản về rèn đúc pháp bảo, mở khóa nghề Luyện Khí Sư.',
        effect: { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'smithing' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    'thai_thuong_phu_kinh': {
        id: 'thai_thuong_phu_kinh',
        name: 'Thái Thượng Phù Kinh',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 800,
        description: 'Ghi chép về cách dẫn linh hồn vào phù giấy, mở khóa nghề Phù Sư.',
        effect: { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'talisman' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    'tran_dao_thien_thu': {
        id: 'tran_dao_thien_thu',
        name: 'Trận Đạo Thiên Thư',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 2500,
        description: 'Thiên thư ghi chép về các loại trận pháp, mở khóa nghề Trận Pháp Sư.',
        effect: { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'formation' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    'co_quan_linh_ky': {
        id: 'co_quan_linh_ky',
        name: 'Cơ Quan Linh Kỹ',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📔',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 3000,
        description: 'Bí tịch về cách chế tạo khôi lỗi, mở khóa nghề Khôi Lỗi Sư và truyền thụ bản vẽ Thiết Giáp Khôi Lỗi.',
        effect: {
            type: EFFECT_TYPES.HOC_NHIEU_CONG_THUC,
            value: [
                { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'puppet', secretId: 'co_quan_linh_ky' },
                { type: EFFECT_TYPES.HOC_CONG_THUC_KHOI_LOI, value: 'thiet_giap_khoi_loi' }
            ]
        },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    'cuu_u_luyen_thi_thuat': {
        id: 'cuu_u_luyen_thi_thuat',
        name: 'Cửu U Luyện Thi Thuật',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '💀',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1500,
        description: 'Tà thuật luyện chế xác chết, mở khóa nghề Luyện Thi Sư và truyền thụ cách luyện chế Thi Binh, Thi Tướng.',
        effect: {
            type: EFFECT_TYPES.HOC_NHIEU_CONG_THUC,
            value: [
                { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'corpse', secretId: 'cuu_u_luyen_thi_thuat' },
                { type: EFFECT_TYPES.HOC_CONG_THUC_THI, value: 'thi_binh' },
                { type: EFFECT_TYPES.HOC_CONG_THUC_THI, value: 'thi_tuong' }
            ]
        },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    'ngu_thu_quyet': {
        id: 'ngu_thu_quyet',
        name: 'Ngự Thú Quyết',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📔',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 1500,
        description: 'Bí tịch ghi chép cách thuần phục và điều khiển linh thú, mở khóa nghề Ngự Thú Sư.',
        effect: { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'beast' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    'token_merchant': {
        id: 'token_merchant',
        name: 'Thương Nhân Lệnh',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🏷️',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Lệnh bài của một thương hội lớn, giúp nhận được sự tin tưởng và ưu đãi từ các thương nhân.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'dan_giai_doc': {
        id: 'dan_giai_doc',
        name: 'Đan Giải Độc',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💊',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 200,
        description: 'Đan dược giúp hóa giải các loại độc tố cơ bản và chướng khí.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.GIAI_DOC }
        ]
    },
    'hoa_nguyen_dan': {
        id: 'hoa_nguyen_dan',
        name: 'Hóa Nguyên Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💠',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 8000,
        description: 'Thần đan trân quý có khả năng trung hòa pháp lực xung đột khi thay đổi công pháp chủ tu, bảo toàn toàn bộ tu vi và đạo cơ. Cực kỳ hiếm thấy, chỉ các Luyện Dược Đại Sư mới có thể chế tác.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'tran_phap_bi_tich': {
        id: 'tran_phap_bi_tich',
        name: 'Trận Pháp Bí Tịch',
        image: 'items/tran_phap_bi_tich',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 1000,
        description: 'Ghi chép về các trận pháp cơ bản, giúp hiểu rõ hơn về cấm chế và trận pháp bảo vệ.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KHOI_LOI.KEY, subcategory: ITEM_CATEGORIES_ENUM.KHOI_LOI.SUBCATEGORIES.LINH_KHOI }
        ]
    },

    // --- ALCHEMY RECIPE SCROLLS ---
    'dan_phuong_ngung_khi_dan': {
        id: 'dan_phuong_ngung_khi_dan',
        name: 'Đan Phương Ngưng Khí Đan',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 300,
        description: 'Ghi chép cách luyện chế [[ngung_khi_dan|Ngưng Khí Đan]] từ [[linh_thao_thap|Linh Thảo Thấp Phẩm]].',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_DAN, value: 'ngung_khi_dan' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_DAN.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_DAN.SUBCATEGORIES.DAN_PHUONG }
        ]
    },
    'dan_phuong_hoi_linh_dan': {
        id: 'dan_phuong_hoi_linh_dan',
        name: 'Đan Phương Hồi Linh Đan',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 300,
        description: 'Ghi chép cách luyện chế [[hoi_linh_dan|Hồi Linh Đan]] từ [[thanh_long_tham|Thanh Long Sâm]] và [[linh_thao_thap|Linh Thảo Thấp Phẩm]].',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_DAN, value: 'hoi_linh_dan' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_DAN.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_DAN.SUBCATEGORIES.DAN_PHUONG }
        ]
    },
    'dan_phuong_ngoc_de_dan': {
        id: 'dan_phuong_ngoc_de_dan',
        name: 'Đan Phương Ngọc Đề Đan',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 450,
        description: 'Ghi chép cách luyện chế [[ngoc_de_dan|Ngọc Đề Đan]] từ [[ngoc_de_hoa|Ngọc Đề Hoa]] và [[linh_thao_10y|Linh Thảo (10 năm)]].',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_DAN, value: 'ngoc_de_dan' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_DAN.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_DAN.SUBCATEGORIES.DAN_PHUONG }
        ]
    },
    'dan_phuong_than_tam_dan': {
        id: 'dan_phuong_than_tam_dan',
        name: 'Đan Phương Thanh Tâm Đan',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 500,
        description: 'Ghi chép cách luyện chế [[thanh_tam_dan|Thanh Tâm Đan]] từ [[linh_thao_10y|Linh Thảo (10 năm)]] và [[chu_sa_muc|Chu Sa Linh Mực]].',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_DAN, value: 'thanh_tam_dan' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_DAN.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_DAN.SUBCATEGORIES.DAN_PHUONG }
        ]
    },
    'dan_phuong_truc_co_dan': {
        id: 'dan_phuong_truc_co_dan',
        name: 'Đan Phương Trúc Cơ Đan',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 2000,
        description: 'Ghi chép cách luyện chế [[truc_co_dan|Trúc Cơ Đan]] từ [[linh_thao_100y|Linh Thảo (100 năm)]], [[yeu_dan_so|Yêu Đan Sơ Cấp]] và [[hoa_tinh_thach|Hỏa Tinh Thạch]].',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_DAN, value: 'truc_co_dan' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_DAN.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_DAN.SUBCATEGORIES.DAN_PHUONG }
        ]
    },
    'dan_phuong_bo_nguyen_dan': {
        id: 'dan_phuong_bo_nguyen_dan',
        name: 'Đan Phương Bổ Nguyên Đan',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 600,
        description: 'Ghi chép cách luyện chế [[bo_nguyen_dan|Bổ Nguyên Đan]] từ [[linh_thao_10y|Linh Thảo (10 năm)]] và [[yeu_huyet|Yêu Thú Tinh Huyết]].',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_DAN, value: 'bo_nguyen_dan' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_DAN.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_DAN.SUBCATEGORIES.DAN_PHUONG }
        ]
    },
    'dan_phuong_ngung_anh_dan': {
        id: 'dan_phuong_ngung_anh_dan',
        name: 'Đan Phương Ngưng Anh Đan',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 10000,
        description: 'Đan phương luyện chế [[ngung_anh_dan|Ngưng Anh Đan]] từ [[linh_thao_1000y|Linh Thảo (1000 năm)]], [[yeu_dan_trung|Yêu Đan Trung Cấp]] và [[han_ngoc_tuy|Hàn Ngọc Tủy]].',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_DAN, value: 'ngung_anh_dan' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_DAN.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_DAN.SUBCATEGORIES.DAN_PHUONG }
        ]
    },

    // --- SMITHING BLUEPRINTS ---
    'ban_ve_thanh_hong_kiem': {
        id: 'ban_ve_thanh_hong_kiem',
        name: 'Bản Vẽ Thanh Hồng Kiếm',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 400,
        description: 'Bản vẽ rèn đúc [[thanh_hong_kiem|Thanh Hồng Kiếm]] từ [[huyen_thiet|Huyền Thiết]].',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_REN, value: 'thanh_hong_kiem' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_KHI.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_KHI.SUBCATEGORIES.BAN_VE }
        ]
    },
    'ban_ve_phi_kiem_tinh_ha': {
        id: 'ban_ve_phi_kiem_tinh_ha',
        name: 'Bản Vẽ Tinh Hà Phi Kiếm',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1500,
        description: 'Bản vẽ rèn đúc [[phi_kiem_tinh_ha|Tinh Hà Phi Kiếm]] từ [[tinh_kim|Tinh Kim]] và [[huyen_thiet|Huyền Thiết]].',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_REN, value: 'phi_kiem_tinh_ha' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_KHI.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_KHI.SUBCATEGORIES.BAN_VE }
        ]
    },
    'ban_ve_long_lan_giap': {
        id: 'ban_ve_long_lan_giap',
        name: 'Bản Vẽ Long Lân Giáp',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 2500,
        description: 'Bản vẽ rèn đúc Long Lân Giáp.',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_REN, value: 'long_lan_giap' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_KHI.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_KHI.SUBCATEGORIES.BAN_VE }
        ]
    },
    'ban_ve_bat_quai_kinh': {
        id: 'ban_ve_bat_quai_kinh',
        name: 'Bản Vẽ Bát Quái Kính',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 800,
        description: 'Bản vẽ rèn đúc Bát Quái Kính.',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_REN, value: 'bat_quai_kinh' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_KHI.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_KHI.SUBCATEGORIES.BAN_VE }
        ]
    },

    // --- TALISMAN PATTERNS ---
    'phu_van_hoa_cau_phu': {
        id: 'phu_van_hoa_cau_phu',
        name: 'Phù Văn Hỏa Cầu Phù',
        type: ITEM_TYPES.DON_PHU,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 200,
        description: 'Phù văn cơ bản của hỏa hệ.',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_PHU, value: 'hoa_cau_phu' },
        categories: [
            {
                category: ITEM_CATEGORIES_ENUM.PHU_LUC.KEY,
                subcategory: ITEM_CATEGORIES_ENUM.PHU_LUC.SUBCATEGORIES.CONG_KICH
            }
        ]
    },
    'phu_van_kim_cuong_phu': {
        id: 'phu_van_kim_cuong_phu',
        name: 'Phù Văn Kim Cương Phù',
        type: ITEM_TYPES.DON_PHU,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 500,
        description: 'Phù văn tăng phòng ngự.',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_PHU, value: 'kim_cuong_phu' },
        categories: [
            {
                category: ITEM_CATEGORIES_ENUM.PHU_LUC.KEY,
                subcategory: ITEM_CATEGORIES_ENUM.PHU_LUC.SUBCATEGORIES.PHONG_NGU
            }
        ]
    },
    'phu_van_than_hanh_phu': {
        id: 'phu_van_than_hanh_phu',
        name: 'Phù Văn Thần Hành Phù',
        type: ITEM_TYPES.DON_PHU,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 400,
        description: 'Phù văn tăng tốc độ di chuyển.',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_PHU, value: 'than_hanh_phu' },
        categories: [
            {
                category: ITEM_CATEGORIES_ENUM.PHU_LUC.KEY,
                subcategory: ITEM_CATEGORIES_ENUM.PHU_LUC.SUBCATEGORIES.DON_THUAT
            }
        ]
    },
    'phu_van_thuan_di_phu': {
        id: 'phu_van_thuan_di_phu',
        name: 'Phù Văn Thuấn Di Phù',
        type: ITEM_TYPES.DON_PHU,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1500,
        description: 'Phù văn dịch chuyển tức thời.',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_PHU, value: 'thuan_di_phu' },
        categories: [
            {
                category: ITEM_CATEGORIES_ENUM.PHU_LUC.KEY,
                subcategory: ITEM_CATEGORIES_ENUM.PHU_LUC.SUBCATEGORIES.DON_THUAT
            }
        ]
    },
    'phu_van_thien_loi_phu': {
        id: 'phu_van_thien_loi_phu',
        name: 'Phù Văn Thiên Lôi Phù',
        type: ITEM_TYPES.DON_PHU,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 5000,
        description: 'Phù văn dẫn lôi đình chi lực.',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_PHU, value: 'thien_loi_phu' },
        categories: [
            {
                category: ITEM_CATEGORIES_ENUM.PHU_LUC.KEY,
                subcategory: ITEM_CATEGORIES_ENUM.PHU_LUC.SUBCATEGORIES.CONG_KICH
            }
        ]
    },

    // --- FORMATION DIAGRAMS ---
    'tran_do_tu_linh_tran': {
        id: 'tran_do_tu_linh_tran',
        name: 'Trận Đồ Tụ Linh Trận',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 1000,
        description: 'Học cách bố trí Tụ Linh Trận.',
        effect: { type: EFFECT_TYPES.HOC_TRAN_PHAP, value: 'tran_do_tu_linh' },
        categories: [
            {
                category: ITEM_CATEGORIES_ENUM.TRAN_PHAP.KEY,
                subcategory: ITEM_CATEGORIES_ENUM.TRAN_PHAP.SUBCATEGORIES.TU_LINH_TRAN
            }
        ]
    },
    'tran_do_ao_anh_tran': {
        id: 'tran_do_ao_anh_tran',
        name: 'Trận Đồ Ảo Ảnh Trận',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 1500,
        description: 'Học cách bố trí Ảo Ảnh Trận.',
        effect: { type: EFFECT_TYPES.HOC_TRAN_PHAP, value: 'tran_do_ao_anh' },
        categories: [
            {
                category: ITEM_CATEGORIES_ENUM.TRAN_PHAP.KEY,
                subcategory: ITEM_CATEGORIES_ENUM.TRAN_PHAP.SUBCATEGORIES.HUYEN_TRAN
            }
        ]
    },
    'tran_do_sat_kiem_tran': {
        id: 'tran_do_sat_kiem_tran',
        name: 'Trận Đồ Sát Kiếm Trận',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Học cách bố trí Sát Kiếm Trận.',
        effect: { type: EFFECT_TYPES.HOC_TRAN_PHAP, value: 'tran_do_sat_kiem' },
        categories: [
            {
                category: ITEM_CATEGORIES_ENUM.TRAN_PHAP.KEY,
                subcategory: ITEM_CATEGORIES_ENUM.TRAN_PHAP.SUBCATEGORIES.CONG_KICH_TRAN
            }
        ]
    },
    'tran_do_ho_tong_dai_tran': {
        id: 'tran_do_ho_tong_dai_tran',
        name: 'Trận Đồ Hộ Tông Đại Trận',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 20000,
        description: 'Học cách bố trí Hộ Tông Đại Trận.',
        effect: { type: EFFECT_TYPES.HOC_TRAN_PHAP, value: 'ho_tong_dai_tran' },
        categories: [
            {
                category: ITEM_CATEGORIES_ENUM.TRAN_PHAP.KEY,
                subcategory: ITEM_CATEGORIES_ENUM.TRAN_PHAP.SUBCATEGORIES.PHONG_NGU_TRAN
            }
        ]
    },

    // --- PUPPET BLUEPRINTS ---
    'ban_ve_thiet_giap_khoi_loi': {
        id: 'ban_ve_thiet_giap_khoi_loi',
        name: 'Bản Vẽ Thiết Giáp Khôi Lỗi',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 1000,
        description: 'Hướng dẫn chế tạo Thiết Giáp Khôi Lỗi.',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_KHOI_LOI, value: 'thiet_giap_khoi_loi' },
        categories: [
            {
                category: ITEM_CATEGORIES_ENUM.LUYEN_KHI.KEY,
                subcategory: ITEM_CATEGORIES_ENUM.LUYEN_KHI.SUBCATEGORIES.BAN_VE
            }
        ]
    },
    'ban_ve_kiem_khoi': {
        id: 'ban_ve_kiem_khoi',
        name: 'Bản Vẽ Kiếm Khôi',
        image: 'items/ban_ve_kiem_khoi',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 3000,
        description: 'Hướng dẫn chế tạo Kiếm Khôi.',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_KHOI_LOI, value: 'kiem_khoi' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_KHI.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_KHI.SUBCATEGORIES.BAN_VE }
        ]
    },

    // --- CORPSE REFINING RECIPES ---
    'bi_phuong_thi_binh': {
        id: 'bi_phuong_thi_binh',
        name: 'Bí Phương Luyện Chế Thi Binh',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 500,
        description: 'Ghi chép cách luyện chế Thi Binh cơ bản.',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_THI, value: 'thi_binh' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KHOI_LOI.KEY, subcategory: ITEM_CATEGORIES_ENUM.KHOI_LOI.SUBCATEGORIES.THI_KHOI }
        ]
    },
    'bi_phuong_thi_tuong': {
        id: 'bi_phuong_thi_tuong',
        name: 'Bí Phương Luyện Chế Thi Tướng',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 2000,
        description: 'Ghi chép cách luyện chế Thi Tướng hung hãn.',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_THI, value: 'thi_tuong' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KHOI_LOI.KEY, subcategory: ITEM_CATEGORIES_ENUM.KHOI_LOI.SUBCATEGORIES.THI_KHOI }
        ]
    },
    'bi_phuong_dong_giap_thi': {
        id: 'bi_phuong_dong_giap_thi',
        name: 'Bí Phương Luyện Chế Đồng Giáp Thi',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Ghi chép cách luyện chế Đồng Giáp Thi đao thương bất nhập.',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_THI, value: 'dong_giap_thi' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KHOI_LOI.KEY, subcategory: ITEM_CATEGORIES_ENUM.KHOI_LOI.SUBCATEGORIES.THI_KHOI }
        ]
    },

    // Tiêu hao
    'tich_coc_dan': {
        id: 'tich_coc_dan',
        name: 'Tịch Cốc Đan',
        image: 'items/tich_coc_dan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💊',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 1,
        description: 'Đan dược giúp tu sĩ không cần ăn uống, duy trì sinh mệnh khi bế quan (mỗi ngày bế quan tiêu hao 1 viên). Sử dụng riêng lẻ giúp tăng nhẹ tốc độ tu luyện trong 1 giờ.',
        effect: { type: EFFECT_TYPES.BUFF_TAM_THOI, stat: 'tuViSpeed', value: 1.1, duration: 3600 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'ngo_dao_tra': {
        id: 'ngo_dao_tra',
        name: 'Ngộ Đạo Trà',
        image: 'items/ngo_dao_tra',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🍵',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 800,
        description: 'Loại trà đặc chế từ linh thảo trăm năm và suối ngộ đạo. Uống vào tâm trí thêm minh mẫn, tốc độ lĩnh ngộ công pháp tăng gấp đôi trong 2 giờ.',
        effect: { type: EFFECT_TYPES.THUAN_THUC_CONG_PHAP, value: 2.0, duration: 7200 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'ngo_dao_dan': {
        id: 'ngo_dao_dan',
        name: 'Ngộ Đạo Đan',
        image: 'items/ngo_dao_dan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💠',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 5000,
        description: 'Viên đan chắt lọc từ tinh hoa ngộ tính nghìn năm. Uống vào ngay lập tức lĩnh ngộ được đại đạo thiên địa, tức thì tăng 500 điểm thuần thục cho toàn bộ công pháp đang trang bị.',
        effect: { type: EFFECT_TYPES.THUAN_THUC_CONG_PHAP, value: 500 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'bach_hoa_linh_tuu': {
        id: 'bach_hoa_linh_tuu',
        name: 'Bách Hoa Linh Tửu',
        image: 'items/bach_hoa_linh_tuu',
        type: ITEM_TYPES.DAN_DUOC,
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        icon: '🍶',
        price: 300,
        description: 'Linh tửu trứ danh chắt lọc từ tinh hoa trăm loài hoa chứa linh khí. Uống vào giúp nâng cao sảng khoái tinh thần, hồi phục ngay lập tức 50 Thể lực.',
        effect: { type: EFFECT_TYPES.HOI_PHUC, stamina: 50 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'tich_coc_thao': {
        id: 'tich_coc_thao',
        name: 'Tịch Cốc Thảo',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🌿',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 10,
        description: 'Loại thảo dược đặc biệt chứa chất dinh dưỡng cực kỳ cô đọng, là nguyên liệu chính luyện chế Tịch Cốc Đan.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'linh_coc': {
        id: 'linh_coc',
        name: 'Trân Châu Linh Cốc',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🌾',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 5,
        description: 'Loại linh cốc thường thấy ở Nhân giới, hạt lúa lấp lánh như trân châu tỏa ra linh khí loãng, dùng để bổ sung sinh cơ cho tu sĩ cấp thấp.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'dan_phuong_tich_coc_dan': {
        id: 'dan_phuong_tich_coc_dan',
        name: 'Đan Phương Tịch Cốc Đan',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 100,
        description: 'Ghi chép cách luyện chế [[tich_coc_dan|Tịch Cốc Đan]] từ [[tich_coc_thao|Tịch Cốc Thảo]] và [[linh_coc|Phàm Cấp Linh Cốc]].',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_DAN, value: 'tich_coc_dan' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_DAN.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_DAN.SUBCATEGORIES.DAN_PHUONG }
        ]
    },
    'ngung_khi_dan': {
        id: 'ngung_khi_dan',
        name: 'Ngưng Khí Đan',
        image: 'items/ngung_khi_dan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💊',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 150,
        description: 'Gia tăng 500 linh khí ngay lập tức.',
        effect: { type: EFFECT_TYPES.TANG_TU_VI, value: 500 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'linh_thao_thap': {
        id: 'linh_thao_thap',
        name: 'Thanh Phục Thảo',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🌿',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 20,
        description: 'Loại linh thảo sơ cấp cực kỳ phổ biến trong Phàm Nhân Tu Tiên. Hàn Lập từng dùng Thanh Phục Thảo để chế luyện lượng lớn Ngưng Khí Đan.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'linh_thao_trung': {
        id: 'linh_thao_trung',
        name: 'Tử Lam Hoa',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🍃',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 100,
        description: 'Linh thảo trung phẩm có màu tím lam nhạt đặc trưng của phái Lạc Vân Tông, chứa linh lực vững vàng, thích hợp luyện chế đan dược Trúc Cơ.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'hoa_diem_thao': {
        id: 'hoa_diem_thao',
        name: 'Hỏa Diễm Thảo',
        image: 'items/hoa_diem_thao',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🔥',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 250,
        description: 'Thảo dược nóng rực, sinh trưởng ở nơi có hỏa khí nồng đậm.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'han_tuy_hoa': {
        id: 'han_tuy_hoa',
        name: 'Hàn Tủy Hoa',
        image: 'items/han_tuy_hoa',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '❄️',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 250,
        description: 'Hoa trắng như tuyết, mang theo hàn khí thấu xương.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_DICH, subSubcategory: 'thien_dia' }
        ]
    },
    'u_minh_hoa': {
        id: 'u_minh_hoa',
        name: 'U Minh Hoa',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '💀',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 500,
        description: 'Hoa mọc nơi âm khí nồng đậm, u tối.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'truc_co_dan': {
        id: 'truc_co_dan',
        name: 'Trúc Cơ Đan',
        image: 'items/truc_co_dan',
        type: ITEM_TYPES.DAN_DUOC,
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        icon: '💎',
        description: 'Đan dược chí bảo giúp phàm nhân đúc thành đạo cơ. Luyện chế từ Linh Thảo (100 năm), Yêu Đan Sơ Cấp và Hỏa Tinh Thạch.',
        price: 5000,
        stats: { breakthroughChance: 0.3 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.DOT_PHA }
        ]
    },
    'ket_dan_dan': {
        id: 'ket_dan_dan',
        name: 'Kết Đan Đan',
        type: ITEM_TYPES.DAN_DUOC,
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        icon: '💊',
        price: 15000,
        description: 'Đan dược quý hiếm giúp tu sĩ ngưng tụ Kim Đan chí thuần, tăng 20% tỷ lệ đột phá Kết Đan.',
        stats: { breakthroughChance: 0.20 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.DOT_PHA }
        ]
    },
    'nguyen_anh_dan': {
        id: 'nguyen_anh_dan',
        name: 'Nguyên Anh Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🟣',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 85000,
        description: 'Luyện chế từ tà đan cấp cao, đan dược phụ trợ tối thượng giúp ngưng kết Nguyên Anh, tăng mạnh thần thức và tỉ lệ đột phá Nguyên Anh.',
        effect: { breakthroughChance: 0.15, spirit: 500 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.DOT_PHA }
        ]
    },
    'hoa_than_dan': {
        id: 'hoa_than_dan',
        name: 'Hóa Thần Đan',
        type: ITEM_TYPES.DAN_DUOC,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        icon: '💊',
        price: 150000,
        description: 'Chí tôn đan dược hỗ trợ thần thức thăng hoa, câu thông thiên địa đột phá Hóa Thần cảnh, tăng 10% tỷ lệ đột phá Hóa Thần.',
        stats: { breakthroughChance: 0.10 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.DOT_PHA }
        ]
    },
    'bo_nguyen_dan': {
        id: 'bo_nguyen_dan',
        name: 'Bổ Nguyên Đan',
        type: ITEM_TYPES.DAN_DUOC,
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        icon: '🍶',
        price: 450,
        description: 'Đan dược bồi bổ nguyên khí, hồi phục 100 Khí Huyết, 50 Linh Lực và 30 Thể Lực. Kết hợp từ Linh Thảo (10 năm) và Yêu Thú Tinh Huyết.',
        effect: { type: EFFECT_TYPES.HOI_PHUC, hp: 100, mana: 50, stamina: 30 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.HOI_PHUC }
        ]
    },
    'thuy_tinh': {
        id: 'thuy_tinh',
        name: 'Thủy Tinh Linh Khoáng',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '💠',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 200,
        description: 'Một loại khoáng thạch chứa thủy tính linh lực.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'ma_thach': {
        id: 'ma_thach',
        name: 'Ma Thạch Hạ Phẩm',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🌑',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 350,
        description: 'Đá chứa ma khí loãng, dùng cho các loại đan dược đặc thù.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },

    // =====================================================================
    // --- VẬT PHẨM ĐẶC TRƯNG TÔNG MÔN ---
    // =====================================================================

    // --- Nguyên liệu kim loại (Thiên Kiếm Tông / Cự Kiếm Môn) ---
    'huyen_thiet': {
        id: 'huyen_thiet',
        name: 'Huyền Thiết',
        image: 'items/huyen_thiet',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '⬛',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 200,
        description: 'Loại sắt đen hấp thu linh khí thiên nhiên, cứng chắc hơn sắt thường nhiều lần. Nguyên liệu cơ bản để rèn đúc pháp khí kiếm đạo.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'tinh_kim': {
        id: 'tinh_kim',
        name: 'Tinh Kim',
        image: 'items/tinh_kim',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '✨',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 800,
        description: 'Kim loại quý hiếm tinh luyện từ thiên thạch rơi xuống, chứa đựng thiên địa linh khí cực kỳ dồi dào. Nguyên liệu bậc cao để rèn kiếm pháp bảo hạng nhất.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },

    // --- Thiên Kiếm Tông: kiếm tinh thạch + bản vẽ phi kiếm ---
    'thanh_kiem_linh_tinh': {
        id: 'thanh_kiem_linh_tinh',
        name: 'Thanh Kiếm Linh Tinh',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '⚔️',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 500,
        description: 'Viên tinh thạch được Thiên Kiếm Tông kết tinh từ kiếm ý thuần khiết. Sử dụng để tăng ngay 1000 Tu Vi và giúp lĩnh ngộ kiếm đạo thêm sâu sắc.',
        effect: { type: EFFECT_TYPES.TANG_TU_VI, value: 1000 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'phi_kiem_tinh_ha': {
        id: 'phi_kiem_tinh_ha',
        name: 'Tinh Hà Phi Kiếm',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        icon: '⚔️',
        description: 'Phi kiếm rèn từ Tinh Kim thuần chính, tỏa ra ánh sáng huy hoàng như dải ngân hà, phù hợp với tu sĩ kiếm đạo cấp cao.',
        price: 8000,
        stats: { atk: 150, spd: 20, pierce: 0.1 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.DINH_GIAI }
        ]
    },
    'ban_ve_phi_kiem_tinh_ha': {
        id: 'ban_ve_phi_kiem_tinh_ha',
        name: 'Bản Vẽ Tinh Hà Phi Kiếm',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1500,
        description: 'Bản vẽ rèn đúc [[phi_kiem_tinh_ha|Tinh Hà Phi Kiếm]] từ [[tinh_kim|Tinh Kim]] và [[huyen_thiet|Huyền Thiết]].',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_REN, value: 'phi_kiem_tinh_ha' }
    },

    // --- Hoàng Phong Cốc: thần sa đặc trưng ---
    'hoang_phong_sa_tui': {
        id: 'hoang_phong_sa_tui',
        name: 'Hoàng Phong Thần Sa Túi',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💛',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 400,
        description: 'Túi thần sa đặc chế của Hoàng Phong Cốc, chứa đựng phong hệ linh khí cực đậm đặc. Sử dụng trước trận để tạo lớp phòng ngự cát, giảm 20% sát thương nhận vào trong 1 trận.',
        effect: { type: EFFECT_TYPES.BUFF_TAM_THOI, stat: 'def_pct', value: 0.2, duration: 999 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },

    // --- Cự Kiếm Môn: giáp trọng cương kiện ---
    'cu_kiem_trong_giap': {
        id: 'cu_kiem_trong_giap',
        name: 'Cự Kiếm Trọng Giáp',
        type: ITEM_TYPES.PHAP_BAO_THU,
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        icon: '🛡️',
        description: 'Bộ giáp nặng rèn từ Huyền Thiết, dày dặn như tường thành, đặc trưng của đệ tử Cự Kiếm Môn. Tốc độ giảm nhưng phòng ngự cực kỳ vững chắc.',
        price: 3500,
        stats: { def: 120, maxHp: 200, spd: -10 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.DINH_GIAI }
        ]
    },

    // --- Thiên Khuyết Bảo: đá luyện cương giáp ---
    'kim_luyen_thach': {
        id: 'kim_luyen_thach',
        name: 'Kim Luyện Thạch',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🪨',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 350,
        description: 'Đá khoáng cứng như sắt thép, hấp thụ kim hệ linh khí dày đặc. Thiên Khuyết Bảo dùng để gia cố và luyện chế hộ thể cương giáp bậc cao.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },

    // --- Hóa Đao Ổ: linh sa mài đao ---
    'hoa_dao_linh_sa': {
        id: 'hoa_dao_linh_sa',
        name: 'Hóa Đao Linh Sa',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🔪',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 450,
        description: 'Linh sa đặc chế của Hóa Đao Ổ, chứa đựng đao kình ngưng tụ nhiều năm. Mài lên vũ khí trước trận chiến, tăng 20% ATK trong toàn bộ 1 trận.',
        effect: { type: EFFECT_TYPES.BUFF_TAM_THOI, stat: 'atk_pct', value: 0.2, duration: 999 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },

    // --- Thanh Hư Môn: ngọc lộ dưỡng khí ---
    'thanh_hu_linh_no': {
        id: 'thanh_hu_linh_no',
        name: 'Thanh Hư Ngọc Lộ',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💧',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 600,
        description: 'Giọt ngọc lộ tinh khiết thu hoạch từ đỉnh núi Thanh Hư vào lúc bình minh, thanh lọc linh mạch. Hồi phục 30% Khí Huyết, 30% Pháp Lực và 50 Thể Lực ngay lập tức.',
        effect: { type: EFFECT_TYPES.HOI_PHUC, hp: 0.3, mana: 0.3, stamina: 50 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.HOI_PHUC }
        ]
    },

    // --- Yểm Nguyệt Tông: đan dược song tu ---
    'song_tu_dieu_dan': {
        id: 'song_tu_dieu_dan',
        name: 'Song Tu Diệu Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💞',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 2000,
        description: 'Đan dược bí truyền của Yểm Nguyệt Tông, điều hòa âm dương linh khí trong kinh mạch. Sử dụng tăng tốc độ tu luyện x1.5 trong 6 giờ và giảm 30% rủi ro tẩu hỏa.',
        effect: { type: EFFECT_TYPES.BUFF_TAM_THOI, stat: 'tuViSpeed', value: 1.5, duration: 21600000 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.TU_LUYEN }
        ]
    },

    // --- Hợp Hoan Tông: mị hương ---
    'mi_duoc_thi_huong': {
        id: 'mi_duoc_thi_huong',
        name: 'Mị Dược Thi Hương',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🌸',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 800,
        description: 'Mị hương dạng lỏng tuyệt mật của Hợp Hoan Tông, tỏa ra ảo khí làm rối loạn tinh thần địch. Dùng trong trận giảm 35% tốc độ tấn công của địch trong 2 lượt.',
        effect: { type: 'debuff', stat: 'enemy_spd', value: 0.35, duration: 2 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },

    // --- Ma Diễm Môn: đá chứa ma hỏa ---
    'hoa_diem_thach': {
        id: 'hoa_diem_thach',
        name: 'Hỏa Diễm Thạch',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🔥',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 500,
        description: 'Đá khoáng hình thành ở vùng nham thạch sôi sục, chứa đựng ma hỏa tinh chất cực kỳ nóng cháy. Ma Diễm Môn dùng làm nguyên liệu luyện đan ma đạo và nâng cấp pháp bảo hỏa hệ.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },

    // --- Thiên Sát Tông: linh phiên sát khí ---
    'sat_khi_linh_phien': {
        id: 'sat_khi_linh_phien',
        name: 'Sát Khí Linh Phiên',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🩸',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 700,
        description: 'Thẻ phiên khắc bằng xương người, ngâm trong sát khí ngàn chiến nhiều năm — đặc sản Thiên Sát Tông. Kích hoạt trước trận chiến tăng 25% ATK và 10% Crit Rate trong toàn trận.',
        effect: { type: EFFECT_TYPES.BUFF_TAM_THOI, stat: 'atk_pct', value: 0.25, duration: 999 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },

    // --- Linh Thú Sơn: ấn linh thú ---
    'linh_thu_ung_hieu': {
        id: 'linh_thu_ung_hieu',
        name: 'Linh Thú Ứng Hiệu Ấn',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🐾',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1200,
        description: 'Ấn tín linh thú bí truyền của Linh Thú Sơn, chứa đựng thú ý khiến mọi linh thú bản năng thần phục. Sử dụng tăng 30% tỷ lệ thành công khi thu phục linh thú trong 24 giờ.',
        effect: { type: EFFECT_TYPES.BUFF_TAM_THOI, stat: 'beastSuccess', value: 0.3, duration: 86400000 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },

    // --- Huyền Âm Cốc: hàn khí & pháp bảo oan hồn ---
    'huyen_am_han_tuy': {
        id: 'huyen_am_han_tuy',
        name: 'Huyền Âm Hàn Tủy',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🧊',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 800,
        description: 'Tinh hoa hàn khí thấu xương từ sâu đáy Huyền Âm Cốc, ngưng kết thành giọt băng tinh khiết. Sử dụng giúp tăng 1.5x Tốc độ tu luyện thần thức trong 12 giờ, nhưng người dùng sẽ chịu hàn khí xâm thực (Giảm tạm thời 10% Khí Huyết tối đa).',
        effect: { type: EFFECT_TYPES.BUFF_TAM_THOI, stat: 'soulPs', value: 1.5, duration: 43200000, sideEffect: { stat: 'maxHp_pct', value: -0.1 } },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'am_hon_phien': {
        id: 'am_hon_phien',
        name: 'Âm Hồn Phiên',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        icon: '🏴',
        description: 'Pháp bảo ma đạo Huyền Âm Cốc, bên trong giam cầm vô số oan hồn tàn ác. Công kích cuồng bạo nhưng ma khí từ oan hồn ăn mòn cơ thể người dùng.',
        price: 3000,
        stats: { atk: 180, maxHp: -100, spd: 15 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.DINH_GIAI }
        ]
    },

    // --- Lạc Vân Tông: dược thảo & tiên đan bí truyền ---
    'lac_van_thao': {
        id: 'lac_van_thao',
        name: 'Lạc Vân Thảo',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🌱',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 350,
        description: 'Linh thảo đặc thù chỉ mọc ở sườn núi Lạc Vân quanh năm mây phủ, ngậm sương trời tinh khiết. Là nguyên liệu không thể thiếu trong các loại đan dược thượng phẩm của Lạc Vân Tông.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'lac_van_tien_dan': {
        id: 'lac_van_tien_dan',
        name: 'Lạc Vân Tiên Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💮',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 5000,
        description: 'Đan dược bí truyền danh tiếng của Lạc Vân Tông, kết hợp từ vạn loại linh thảo thượng phẩm. Khi dùng lập tức hồi phục 100% Khí Huyết và Pháp Lực, đồng thời tăng 10% Tỷ lệ đột phá cảnh giới trong 24 giờ.',
        effect: { type: EFFECT_TYPES.HOI_PHUC, hp: 1.0, mana: 1.0, breakthroughBuff: 0.1, duration: 86400000 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },

    // --- Thiên Tinh Tông: tinh thạch & trận bàn tinh tú ---
    'tinh_than_thach': {
        id: 'tinh_than_thach',
        name: 'Tinh Thần Thạch',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '☄️',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 450,
        description: 'Khoáng thạch đặc biệt hấp thụ linh quang của ngàn vì tinh tú, tỏa ra ánh sáng lấp lánh lạnh lẽo. Nguyên liệu cốt lõi để Thiên Tinh Tông khắc họa trận bàn tinh tú thượng phẩm.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'tinh_quang_tran_ban': {
        id: 'tinh_quang_tran_ban',
        name: 'Tinh Quang Trận Bàn',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🥏',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1500,
        description: 'Trận bàn chế tác sẵn mang đặc trưng tinh tú của Thiên Tinh Tông. Kích hoạt trước trận đấu để triển khai một trận pháp tinh quang, tăng 25% Né tránh và 15% Thủ trong toàn bộ trận đấu.',
        effect: { type: EFFECT_TYPES.BUFF_TAM_THOI, stats: { dodge: 0.25, def_pct: 0.15 }, duration: 999 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },

    // --- Quỷ Linh Môn: cốt liệu & độc đan bá đạo ---
    'van_hon_cot': {
        id: 'van_hon_cot',
        name: 'Vạn Hồn Cốt',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🦴',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 400,
        description: 'Xương cốt của tà tu đã trải qua vạn oán hồn quán chú, mang theo quỷ khí đậm đặc thấu tủy. Nguyên liệu ma đạo cốt lõi để Quỷ Linh Môn luyện chế độc đan và quỷ khí trấn môn.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'tuyet_huyet_hac_dan': {
        id: 'tuyet_huyet_hac_dan',
        name: 'Tuyệt Huyết Hắc Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '⚫',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 1000,
        description: 'Độc đan bá đạo của Quỷ Linh Môn, luyện từ Vạn Hồn Cốt và huyết khí cực âm. Sử dụng trong trận đấu bộc phát 40% Công Kích tức thì, nhưng độc tính khiến người dùng tự mất 5% Khí Huyết mỗi lượt.',
        effect: { type: EFFECT_TYPES.BUFF_TAM_THOI, stat: 'atk_pct', value: 0.4, sideEffect: { type: 'dot', stat: 'hp_pct', value: -0.05 }, duration: 999 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },

    // --- Ngự Linh Tông: trùng noãn & hấp huyết trùng ---
    'ngoc_cai_trung_noan': {
        id: 'ngoc_cai_trung_noan',
        name: 'Ngọc Cái Trùng Noãn',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🥚',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 600,
        description: 'Trứng của một loài kỳ trùng thượng cổ cực hiếm. Lớp vỏ lấp lánh như ngọc bảo, bên trong ẩn chứa kịch độc và linh khí ngự thú dồi dào.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'tui_hap_huyet_trung': {
        id: 'tui_hap_huyet_trung',
        name: 'Túi Hấp Huyết Trùng',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🪲',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 850,
        description: 'Túi da bí truyền Ngự Linh Tông tàng trữ hàng ngàn con Hấp Huyết Trùng hung hãn. Ném vào đối thủ để chúng cắn xé liên tục, mỗi lượt hút 10% Khí Huyết của địch hồi cho bản thân trong 3 lượt.',
        effect: { type: 'debuff', stat: 'lifesteal_dot', value: 0.1, duration: 3 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },

    // --- Khôi Âm Tông: u thiết mộc & cốt ấn cường hóa ---
    'u_thiet_linh_moc': {
        id: 'u_thiet_linh_moc',
        name: 'U Thiết Linh Mộc',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🪵',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 450,
        description: 'Gỗ cổ thụ vạn năm ngâm trong U Minh tuyền thủy tối tăm, cứng hơn cả sắt thép nhưng lại nhẹ tựa lông hồng. Nguyên liệu hoàn hảo để chế tạo thân vỏ khôi lỗi cấp cao.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'khoi_loi_cot_an': {
        id: 'khoi_loi_cot_an',
        name: 'Khôi Lỗi Cốt Ấn',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🔰',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 900,
        description: 'Bùa ấn Khôi Âm Tông luyện từ xác chết của cường giả, khắc vào huyệt đạo trước trận đấu để cường hóa thân thể tựa khôi lỗi. Giảm 30% sát thương vật lý nhận vào nhưng giảm 20% Tốc độ đánh.',
        effect: { type: EFFECT_TYPES.BUFF_TAM_THOI, stats: { physRes: 0.3, spd_pct: -0.2 }, duration: 999 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },

    'thanh_hong_kiem': {
        id: 'thanh_hong_kiem',
        name: 'Thanh Hồng Kiếm',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        image: 'artifacts/thanh_hong_kiem.webp',
        icon: '⚔️',
        description: 'Thanh kiếm tỏa ra ánh sáng xanh lục, sắc bén vô cùng.',
        price: 1500,
        stats: { atk: 50, spd: 5 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.DINH_GIAI }
        ]
    },
    'thanh_tam_dan': {
        id: 'thanh_tam_dan',
        name: 'Thanh Tâm Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🧊',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 200,
        description: 'Hồi phục 50% Khí Huyết ngay lập tức. Luyện chế từ Linh Thảo (10 năm) và Chu Sa Linh Mực.',
        effect: { type: EFFECT_TYPES.HOI_MAU, value: 0.5 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },

    // Trang bị
    'phi_kiem_go': {
        id: 'phi_kiem_go',
        name: 'Phi Kiếm Gỗ',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        icon: '🗡️',
        description: 'Kiếm gỗ dành cho đệ tử nhập môn, sát thương không đáng kể.',
        price: 50,
        stats: { atk: 5 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'ao_bo_so_cap': {
        id: 'ao_bo_so_cap',
        name: 'Áo Bố Sơ Cấp',
        type: ITEM_TYPES.PHAP_BAO_THU,
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        icon: '👘',
        description: 'Áo vải thô sơ, chỉ có tác dụng che thân.',
        price: 30,
        stats: { def: 2 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'nhan_dong_nat': {
        id: 'nhan_dong_nat',
        name: 'Nhẫn Đồng Nát',
        type: ITEM_TYPES.PHAP_BAO_HON,
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        icon: '💍',
        description: 'Một chiếc nhẫn bằng đồng cũ kỹ.',
        price: 80,
        stats: { spd: 1 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'linh_hu_tui': {
        id: 'linh_hu_tui',
        name: 'Linh Hư Túi',
        type: ITEM_TYPES.TUI_TRU_VAT,
        icon: '🎒',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 500,
        description: 'Sử dụng để mở rộng thêm một linh không trữ vật mới với 10 ô chứa đồ. Bện từ tơ lụa linh mộc sơ cấp.',
        action: 'expand_inventory',
        stats: { slots: 10 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.SUBCATEGORIES.TUI_TRU_VAT }
        ]
    },
    'can_khon_tui': {
        id: 'can_khon_tui',
        name: 'Càn Khôn Túi',
        type: ITEM_TYPES.TUI_TRU_VAT,
        icon: '🎒',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Sử dụng để mở rộng thêm một càn khôn không gian mới với 30 ô chứa đồ. Chế tác từ da thú yêu thú trung cấp.',
        action: 'expand_inventory',
        stats: { slots: 30 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.SUBCATEGORIES.TUI_TRU_VAT }
        ]
    },
    'thao_thiet_can_khon_dai': {
        id: 'thao_thiet_can_khon_dai',
        name: 'Thao Thiết Càn Khôn Đại',
        type: ITEM_TYPES.TUI_TRU_VAT,
        icon: '🎒',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 25000,
        description: 'Sử dụng để mở rộng thêm một dị bảo không gian cực đại với 50 ô chứa đồ. Ẩn chứa da của thần thú Thao Thiết thượng cổ.',
        action: 'expand_inventory',
        stats: { slots: 50 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.SUBCATEGORIES.TUI_TRU_VAT }
        ]
    },
    'ho_tam_kinh': {
        id: 'ho_tam_kinh',
        name: 'Hộ Tâm Kính',
        type: ITEM_TYPES.PHAP_BAO_THU,
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        tier: 'LINH_KHI',
        icon: '🛡️',
        description: 'Một mảnh gương bảo vệ tâm mạch, giảm sát thương nhận vào.',
        price: 2000,
        stats: { def: 30, hp: 100, costMana: 5 },
        durability: 120,
        maxDurability: 120,
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.CO_BAO }
        ]
    },
    'linh_thuyen_so': {
        id: 'linh_thuyen_so',
        name: 'Linh Thuyền Sơ Cấp',
        type: ITEM_TYPES.PHAP_BAO_PHI_HANH,
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        tier: 'PHAP_KHI',
        icon: '🛶',
        description: 'Thuyền nhỏ bay trên không trung bằng linh thạch.',
        price: 3000,
        stats: { spd: 20 },
        durability: 80,
        maxDurability: 80,
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'ngu_phong_phi_chu': {
        id: 'ngu_phong_phi_chu',
        name: 'Ngự Phong Phi Chu',
        type: ITEM_TYPES.PHAP_BAO_PHI_HANH,
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        tier: 'PHAP_BAO',
        icon: '🚢',
        description: 'Phi chu bằng linh mộc ngàn năm, khắc họa Ngự Phong Trận Pháp pháp trận, ngự phong nhi hành tốc độ cực nhanh, lướt sóng vượt biển nhàn nhã.',
        price: 150000,
        stats: { spd: 80 },
        durability: 200,
        maxDurability: 200,
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_BAO_SUB }
        ]
    },
    'truyen_tong_lenh': {
        id: 'truyen_tong_lenh',
        name: 'Thượng Cổ Truyền Tống Lệnh',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        tier: 'CO_BAO',
        icon: '🏅',
        description: 'Tấm lệnh bài làm từ linh thạch cổ xưa phát ra hào quang xám nhạt, che chở tu sĩ trước áp lực xé rách của không gian khi đi qua Truyền Tống Trận.',
        price: 300000,
        stats: { luck: 15 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.CO_BAO }
        ]
    },
    'pha_khong_phu': {
        id: 'pha_khong_phu',
        name: 'Phá Không Phù',
        type: ITEM_TYPES.DAN_DUOC,
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        tier: 'PHAP_BAO',
        icon: '📜',
        description: 'Linh phù quý hiếm dùng để phá vỡ chướng ngại không gian, bảo vệ nhục thân khi thăng hoa giới diện hoặc cưỡng ép dịch chuyển xuyên vách ngăn hư không (tiêu hao khi dùng).',
        price: 50000,
        categories: [
            {
                category: ITEM_CATEGORIES_ENUM.PHU_LUC.KEY,
                subcategory: ITEM_CATEGORIES_ENUM.PHU_LUC.SUBCATEGORIES.DON_THUAT
            }
        ]
    },
    'tu_linh_chau': {
        id: 'tu_linh_chau',
        name: 'Tụ Linh Châu',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        tier: 'LINH_KHI',
        icon: '🔮',
        description: 'Viên châu thu hút linh khí xung quanh, tăng tốc độ tu luyện.',
        price: 5000,
        stats: { tuViSpeed: 1.2 },
        durability: 200,
        maxDurability: 200,
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.TIEN_KHI }
        ]
    },
    'tran_ban_so': {
        id: 'tran_ban_so',
        name: 'Trận Bàn Sơ Cấp',
        type: ITEM_TYPES.PHAP_BAO_TRAN,
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        tier: 'PHAP_KHI',
        icon: '🌀',
        description: 'Bàn xoay dùng để bố trí các trận pháp cơ bản.',
        price: 1200,
        stats: { formationPower: 1.1 },
        durability: 100,
        maxDurability: 100,
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'hon_dang_co': {
        id: 'hon_dang_co',
        name: 'Hồn Đăng Cổ',
        type: ITEM_TYPES.PHAP_BAO_HON,
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        tier: 'CO_BAO',
        icon: '🪔',
        description: 'Ngọn đèn cổ bảo vệ thần hồn, kháng các loại ma chướng.',
        price: 25000,
        stats: { soulExpSpeed: 1.5, def: 50, soulRepress: 20 },
        durability: 500,
        maxDurability: 500,
        isRecognized: false,
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.CO_BAO }
        ]
    },
    'ban_menh_phi_kiem': {
        id: 'ban_menh_phi_kiem',
        name: 'Bản Mệnh Phi Kiếm',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        tier: 'LINH_KHI',
        icon: '🗡️',
        description: 'Thanh phi kiếm được luyện hóa từ tinh huyết, liên kết chặt chẽ với linh hồn.',
        price: 0,
        stats: { atk: 100, spd: 15, pierce: 0.2, critRate: 0.1 },
        durability: 1000,
        maxDurability: 1000,
        isLifeBound: true,
        spirit: 0,
        level: 1,
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.TIEN_KHI }
        ]
    },
    'linh_chung_tu_lam_hoa': {
        id: 'linh_chung_tu_lam_hoa',
        name: 'Linh Chủng Tử Lam Hoa',
        type: ITEM_TYPES.LINH_CHUNG,
        icon: '🌿',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 25,
        description: 'Hạt giống Tử Lam Hoa, linh thảo trung phẩm có màu tím lam dịu mắt, sinh trưởng tương đối lâu.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_DUOC, subSubcategory: 'duoi_100_nam' }
        ]
    },

    // --- SPIRITUAL STONES ---
    'ling_thach_ha': {
        id: 'ling_thach_ha',
        name: 'Hạ Phẩm Linh Thạch',
        type: ITEM_TYPES.LINH_THACH,
        grade: 'HA',
        attribute: 'NORMAL',
        image: 'items/ha_pham_linh_thach',
        icon: '💎',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 1,
        weight: 0.01,
        description: 'Linh thạch phổ thông nhất, dùng cho giao dịch và tu luyện sơ cấp.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_KHOANG, subSubcategory: 'tinh_thach' }
        ]
    },
    'ling_thach_trung': {
        id: 'ling_thach_trung',
        name: 'Trung Phẩm Linh Thạch',
        type: ITEM_TYPES.LINH_THACH,
        grade: 'TRUNG',
        attribute: 'NORMAL',
        image: 'items/trung_pham_linh_thach',
        icon: '💠',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 100,
        weight: 0.02,
        description: 'Linh khí tinh thuần, 1 viên tương đương 100 Hạ Phẩm.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_KHOANG, subSubcategory: 'tinh_thach' }
        ]
    },
    'ling_thach_thuong': {
        id: 'ling_thach_thuong',
        name: 'Thượng Phẩm Linh Thạch',
        type: ITEM_TYPES.LINH_THACH,
        grade: 'THUONG',
        attribute: 'NORMAL',
        image: 'items/thuong_pham_linh_thach',
        icon: '🔮',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 10000,
        weight: 0.05,
        description: 'Linh lực đậm đặc, dùng trong các giao dịch đấu giá hoặc đột phá.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_KHOANG, subSubcategory: 'tinh_thach' }
        ]
    },
    'ling_thach_cuc': {
        id: 'ling_thach_cuc',
        name: 'Cực Phẩm Linh Thạch',
        type: ITEM_TYPES.LINH_THACH,
        grade: 'CUC',
        attribute: 'NORMAL',
        image: 'items/cuc_pham_linh_thach',
        icon: '🌌',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 1000000,
        weight: 0.1,
        description: 'Cực kỳ hiếm thấy, chứa đựng linh lực hóa lỏng vô tận.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_KHOANG, subSubcategory: 'tinh_thach' }
        ]
    },
    'hoa_linh_thach': {
        id: 'hoa_linh_thach',
        name: 'Hỏa Linh Thạch',
        image: 'items/hoa_linh_thach',
        type: ITEM_TYPES.LINH_THACH,
        grade: 'HA', // Default to HA, can be changed via metadata
        attribute: 'FIRE',
        icon: '🔥',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 5,
        weight: 0.01,
        description: 'Chứa hỏa linh khí, phù hợp cho hỏa tu và luyện đan.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_KHOANG, subSubcategory: 'tinh_thach' }
        ]
    },
    'bang_linh_thach': {
        id: 'bang_linh_thach',
        name: 'Băng Linh Thạch',
        image: 'items/bang_linh_thach',
        type: ITEM_TYPES.LINH_THACH,
        grade: 'HA',
        attribute: 'ICE',
        icon: '❄️',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 5,
        weight: 0.01,
        description: 'Tỏa ra hàn khí lạnh thấu xương, phù hợp cho băng tu.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_KHOANG, subSubcategory: 'tinh_thach' }
        ]
    },
    'loi_linh_thach': {
        id: 'loi_linh_thach',
        name: 'Lôi Linh Thạch',
        image: 'items/loi_linh_thach',
        type: ITEM_TYPES.LINH_THACH,
        grade: 'HA',
        attribute: 'LIGHTNING',
        icon: '⚡',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 8,
        weight: 0.01,
        description: 'Chứa lôi điện chi lực, cực kỳ bạo liệt.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_KHOANG, subSubcategory: 'tinh_thach' }
        ]
    },
    'moc_linh_thach': {
        id: 'moc_linh_thach',
        name: 'Mộc Linh Thạch',
        image: 'items/moc_linh_thach',
        type: ITEM_TYPES.LINH_THACH,
        grade: 'HA',
        attribute: 'WOOD',
        icon: '🌿',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 5,
        weight: 0.01,
        description: 'Chứa sinh mệnh tinh hoa, hỗ trợ hồi phục và trồng trọt.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_KHOANG, subSubcategory: 'tinh_thach' }
        ]
    },
    'ma_linh_thach': {
        id: 'ma_linh_thach',
        name: 'Ma Linh Thạch',
        image: 'items/ma_linh_thach',
        type: ITEM_TYPES.LINH_THACH,
        grade: 'HA',
        attribute: 'DEMON',
        icon: '🌑',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 10,
        weight: 0.01,
        description: 'Chứa ma khí loãng, dùng cho ma tu hoặc các tà thuật.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_KHOANG, subSubcategory: 'tinh_thach' }
        ]
    },
    'kim_linh_thach': {
        id: 'kim_linh_thach',
        name: 'Kim Linh Thạch',
        type: ITEM_TYPES.LINH_THACH,
        grade: 'HA',
        attribute: 'METAL',
        icon: '📀',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 5,
        weight: 0.01,
        description: 'Chứa kim hệ linh khí, vô cùng sắc bén và kiên cố.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_KHOANG, subSubcategory: 'tinh_thach' }
        ]
    },
    'tho_linh_thach': {
        id: 'tho_linh_thach',
        name: 'Thổ Linh Thạch',
        type: ITEM_TYPES.LINH_THACH,
        grade: 'HA',
        attribute: 'EARTH',
        icon: '🟤',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 5,
        weight: 0.01,
        description: 'Chứa thổ hệ linh khí, trầm ổn và dày nặng.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_KHOANG, subSubcategory: 'tinh_thach' }
        ]
    },
    'tien_tinh': {
        id: 'tien_tinh',
        name: 'Tiên Tinh',
        type: ITEM_TYPES.LINH_THACH,
        grade: 'TIEN',
        attribute: 'IMMORTAL',
        icon: '✨',
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        price: 100000000,
        weight: 0.2,
        description: 'Tinh thể ngưng tụ từ Tiên Khí, tài nguyên chiến lược của Tiên Giới.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'hon_don_tinh': {
        id: 'hon_don_tinh',
        name: 'Hỗn Độn Tinh',
        type: ITEM_TYPES.LINH_THACH,
        grade: 'HON_DON',
        attribute: 'NORMAL',
        icon: '🌌',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 500000000,
        weight: 0.5,
        description: 'Chứa đựng Hỗn Độn Khí thuở sơ khai, vô cùng quý giá.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_KHOANG, subSubcategory: 'tinh_thach' }
        ]
    },
    'hong_mong_tinh': {
        id: 'hong_mong_tinh',
        name: 'Hồng Mông Linh Tinh',
        type: ITEM_TYPES.LINH_THACH,
        grade: 'HONG_MONG',
        attribute: 'IMMORTAL',
        icon: '💜',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 2000000000,
        weight: 1.0,
        description: 'Chí bảo từ thời Hồng Mông, chứa đựng quy tắc của đại đạo.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_KHOANG, subSubcategory: 'tinh_thach' }
        ]
    },
    'phe_thach': {
        id: 'phe_thach',
        name: 'Phế Linh Thạch',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🪨',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 0.1,
        weight: 0.01,
        description: 'Linh thạch đã bị hút cạn linh khí, chỉ còn là đá vụn.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },

    // --- SPECIAL ENERGY SOURCES ---
    'ma_tinh': {
        id: 'ma_tinh',
        name: 'Ma Tinh',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🌑',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1000,
        description: 'Tinh thể ngưng tụ từ ma khí đậm đặc, dùng để tăng Ma Khí.',
        effect: { type: EFFECT_TYPES.HAP_THU_LINH_KHI, qiType: 'ma_khi', amount: 500, purity: 'TINH_THUAN' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'tien_ngoc': {
        id: 'tien_ngoc',
        name: 'Tiên Ngọc',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💎',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 50000,
        description: 'Ngọc thạch từ Tiên Giới, chứa đựng Tiên Khí tinh thuần.',
        effect: { type: EFFECT_TYPES.HAP_THU_LINH_KHI, qiType: 'tien_khi', amount: 1000, purity: 'CUC_PHAM' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'hon_don_tinh_thach': {
        id: 'hon_don_tinh_thach',
        name: 'Hỗn Độn Tinh Thạch',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🌌',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 500000,
        description: 'Mảnh vỡ từ thuở khai thiên lập địa, chứa Hỗn Độn Khí cực kỳ nguy hiểm.',
        effect: { type: EFFECT_TYPES.HAP_THU_LINH_KHI, qiType: 'hon_don_khi', amount: 200, purity: 'DAO' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'sinh_menh_thach': {
        id: 'sinh_menh_thach',
        name: 'Sinh Mệnh Thạch',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🌱',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        description: 'Đá quý chứa đựng sinh cơ dồi dào, giúp tăng Sinh Khí.',
        effect: { type: EFFECT_TYPES.HAP_THU_LINH_KHI, qiType: 'sinh_khi', amount: 800, purity: 'TINH_THUAN' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },

    // --- DHARMA TREASURES (PHÁP BẢO) ---
    'phi_kiem_thanh_tuyen': {
        id: 'phi_kiem_thanh_tuyen',
        name: 'Thanh Tuyền Kiếm',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        image: 'artifacts/phi_kiem_thanh_tuyen.webp',
        icon: '🗡️',
        description: 'Phi kiếm cấp thấp, tăng nhẹ công kích và tốc độ.',
        price: 800,
        stats: { atk: 25, spd: 3 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'bat_quai_kinh': {
        id: 'bat_quai_kinh',
        name: 'Bát Quái Kính',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        image: 'artifacts/bat_quai_kinh.webp',
        icon: '🪞',
        description: 'Phòng ngự pháp bảo, tạo lớp chắn linh khí giảm sát thương.',
        price: 2500,
        stats: { def: 40, resistance: 0.1 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.DINH_GIAI }
        ]
    },
    'u_minh_chuong': {
        id: 'u_minh_chuong',
        name: 'U Minh Chuông',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        image: 'artifacts/u_minh_chuong.webp',
        icon: '🔔',
        description: 'Hồn hệ pháp bảo, tăng mạnh Thần Thức và kháng ảo cảnh.',
        price: 12000,
        stats: { soul: 150, def: 20 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_BAO_SUB }
        ]
    },
    'chuong_thien_binh': {
        id: 'chuong_thien_binh',
        name: 'Chưởng Thiên Bình',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        tier: 'TIEN_KHI',
        image: 'artifacts/chuong-thien-binh.svg',
        description: 'Chí bảo đệ nhất Tiên giới, có khả năng ngưng tụ linh dịch thiên địa.',
        price: 9999999,
        stats: { tuViSpeed: 2.0, luck: 50 },
        specialEffect: 'generate_spiritual_liquid',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.TIEN_KHI }
        ]
    },
    'hu_thien_dinh': {
        id: 'hu_thien_dinh',
        name: 'Hư Thiên Đỉnh',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        quality: PHAP_BAO_QUALITIES.THONG_THIEN_LINH_BAO,
        price: 400000,
        image: 'artifacts/hu_thien_dinh.webp',
        description: 'Chí tôn cổ đỉnh ngưng tụ càn khôn bát quái khí, mang lại phòng ngự tuyệt đối cùng khả năng thu nạp linh khí tinh thuần không giới hạn.',
        stats: { spirit: 3000, def: 10000, qiAbsorb: 1200 },
        poem: ['Hư Thiên Bát Quái Tàng Càn Khôn', 'Cổ Đỉnh Trấn Áp Vạn Sơn Hà'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.THONG_THIEN }
        ]
    },
    'bat_linh_xich': {
        id: 'bat_linh_xich',
        name: 'Bát Linh Xích',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        tier: 'CO_BAO',
        image: 'artifacts/bat-linh-xich.svg',
        description: 'Pháp bảo hình thước, có khả năng phong ấn linh lực đối phương.',
        price: 300000,
        stats: { atk: 500, soulRepress: 20 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.CO_BAO }
        ]
    },
    'binh_son_an': {
        id: 'binh_son_an',
        name: 'Bình Sơn Ấn',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        tier: 'PHAP_KHI',
        image: 'artifacts/binh-son-an.svg',
        description: 'Pháp bảo dạng ấn ký, mang theo sức mạnh của vạn quân sơn nhạc.',
        price: 250000,
        stats: { atk: 800, spd: -10 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'phong_loi_si': {
        id: 'phong_loi_si',
        name: 'Phong Lôi Sí',
        type: ITEM_TYPES.PHAP_BAO_PHI_HANH,
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        tier: 'CO_BAO',
        image: 'artifacts/phong-loi-si.svg',
        description: 'Quạt lông vũ mang theo sức mạnh phong lôi, tăng mạnh tốc độ độn tẩu.',
        price: 400000,
        stats: { spd: 150, atk: 200 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'huyet_sac_phi_phong': {
        id: 'huyet_sac_phi_phong',
        name: 'Huyết Sắc Phi Phong',
        type: ITEM_TYPES.PHAP_BAO_THU,
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        tier: 'PHAP_KHI',
        image: 'artifacts/huyet-sac-phi-phong.svg',
        description: 'Áo choàng máu, tăng khả năng né tránh và phòng ngự.',
        price: 200000,
        stats: { def: 300, spd: 50 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'nguyen_tu_cuc_son': {
        id: 'nguyen_tu_cuc_son',
        name: 'Nguyên Từ Cực Sơn',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        tier: 'CO_BAO',
        image: 'artifacts/nguyen-tu-cuc-son.svg',
        description: 'Ngọn núi chứa đựng nguyên từ thần quang, khắc chế ngũ hành pháp bảo.',
        price: 600000,
        stats: { atk: 1200, def: 500, pierce: 0.3 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.TIEN_KHI }
        ]
    },
    'bac_cuc_cuc_son': {
        id: 'bac_cuc_cuc_son',
        name: 'Bắc Cực Cực Sơn',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        tier: 'CO_BAO',
        image: 'artifacts/bac-cuc-nguyen-quang-cuc-son.webp',
        description: 'Ngọn núi chứa đựng Bắc Cực Nguyên Quang, đóng băng vạn vật.',
        price: 600000,
        stats: { atk: 1100, def: 600, iceDmg: 200 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.CO_BAO }
        ]
    },
    'nguyen_hop_ngu_cuc_son': {
        id: 'nguyen_hop_ngu_cuc_son',
        name: 'Nguyên Hợp Ngũ Cực Sơn',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.THONG_THIEN_LINH_BAO,
        tier: 'THONG_THIEN',
        image: 'artifacts/nguyen-hop-ngu-cuc-son.svg',
        description: 'Sự kết hợp của năm ngọn cực sơn, uy lực chấn động thiên địa.',
        price: 5000000,
        stats: { atk: 5000, def: 2500, pierce: 0.5, daoVun: 10 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'ban_thach_dinh_nguyen_kiem': {
        id: 'ban_thach_dinh_nguyen_kiem',
        name: 'Bàn Thạch Định Nguyên Kiếm',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        tier: 'TIEN_KHI',
        image: 'artifacts/ban_thach_dinh_nguyen_kiem.webp',
        description: 'Thanh kiếm đúc từ tiên thạch vạn năm, mang theo sức mạnh trấn áp bát phương, định ra nguyên khí thiên địa.',
        price: 5000000,
        stats: { atk: 6000, def: 2000, earthDmg: 500 },
        poem: ['Bàn Thạch Bất Động Định Càn Khôn', 'Định Nguyên Nhất Kiếm Trấn Bát Phương'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.TIEN_KHI }
        ]
    },
    'luc_duong_loi_hoa_kiem': {
        id: 'luc_duong_loi_hoa_kiem',
        name: 'Lục Dương Lôi Hỏa Kiếm',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        tier: 'TIEN_KHI',
        image: 'artifacts/luc_duong_loi_hoa_kiem.webp',
        description: 'Thanh kiếm chứa đựng sức mạnh của sáu vầng thái dương, kết hợp cùng lôi đình chi lực bạo liệt.',
        price: 5500000,
        stats: { atk: 6500, fireDmg: 800, lightningDmg: 800 },
        poem: ['Lục Dương Thần Hỏa Phần Thiên Địa', 'Lôi Đình Vạn Quân Phá Hư Không'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.TIEN_KHI }
        ]
    },
    'tu_tuong_bo_de_kiem': {
        id: 'tu_tuong_bo_de_kiem',
        name: 'Tứ Tượng Bồ Đề Kiếm',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        tier: 'TIEN_KHI',
        image: 'artifacts/tu_tuong_bo_de_kiem.webp',
        description: 'Thanh kiếm giác ngộ dưới gốc cây Bồ Đề, hội tụ sức mạnh của Tứ Tượng linh thú.',
        price: 6000000,
        stats: { atk: 7000, critRate: 0.2, critDmg: 0.5 },
        poem: ['Tứ Tượng Quy Linh Bồ Đề Tọa', 'Kiếm Khí Tung Hoành Ngộ Đạo Chân'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.TIEN_KHI }
        ]
    },
    'tao_hoa_tien_dinh': {
        id: 'tao_hoa_tien_dinh',
        name: 'Tạo Hóa Tiên Đỉnh',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        tier: 'TIEN_KHI',
        image: 'artifacts/tao_hoa_tien_dinh.webp',
        description: 'Đỉnh quý chứa đựng huyền năng của tạo hóa, có thể luyện chế tiên đan và nghịch chuyển nhân quả.',
        price: 8000000,
        stats: { alchemyBonus: 0.5, luck: 20, qiAbsorb: 2.0 },
        poem: ['Tạo Hóa Vô Cùng Trong Một Đỉnh', 'Nghịch Chuyển Càn Khôn Hóa Tiên Đan'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.TIEN_KHI }
        ]
    },
    'thien_dao_than_thach': {
        id: 'thien_dao_than_thach',
        name: 'Thiên Đạo Thần Thạch',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        tier: 'TIEN_KHI',
        image: 'artifacts/thien_dao_than_thach.webp',
        description: 'Mảnh vỡ từ Thiên Đạo, chứa đựng quy tắc tối cao của vũ trụ.',
        price: 10000000,
        stats: { breakthroughChance: 0.01, luck: 10 },
        poem: ['Thiên Đạo Vô Thường Thần Thạch Ấn', 'Quy Tắc Vạn Vật Tại Nhân Tâm'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.TIEN_KHI }
        ]
    },
    'truyen_dao_thanh_gian': {
        id: 'truyen_dao_thanh_gian',
        name: 'Truyền Đạo Thánh Giản',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        tier: 'TIEN_KHI',
        image: 'artifacts/truye_dao_thanh_gian.webp',
        description: 'Thánh giản ghi chép truyền thừa của vị tiên nhân thượng cổ, chứa đựng vô số bí pháp.',
        price: 7000000,
        stats: { breakthroughChance: 0.01, luck: 10 },
        poem: ['Thánh Giản Truyền Đạo Khai Thần Thức', 'Vạn Cổ Bí Pháp Hiện Chân Thân'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.TIEN_KHI }
        ]
    },
    'quan_han_linh_ngoc_bat': {
        id: 'quan_han_linh_ngoc_bat',
        name: 'Quảng Hàn Linh Ngọc Bát',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        tier: 'TIEN_KHI',
        image: 'artifacts/quan_han_linh_ngoc_bat.webp',
        description: 'Bát ngọc từ Quảng Hàn cung, chứa đựng hàn khí tinh khiết của mặt trăng.',
        price: 4500000,
        stats: { maxHp: 5000, iceDmg: 400, def: 1000 },
        poem: ['Quảng Hàn Nguyệt Ảnh Ngọc Bát Linh', 'Thanh Lạnh Sương Mai Hóa Vạn Kiếp'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.TIEN_KHI }
        ]
    },
    'that_tinh_ban_nguyet_thinh': {
        id: 'that_tinh_ban_nguyet_thinh',
        name: 'Thất Tinh Bạn Nguyệt Thính',
        type: ITEM_TYPES.PHAP_BAO_THU,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        tier: 'TIEN_KHI',
        image: 'artifacts/that_tinh_ban_nguyet_thinh.webp',
        description: 'Bình phong Thất Tinh vây quanh ánh trăng, tạo ra lớp bảo vệ tuyệt đối.',
        price: 5200000,
        stats: { def: 5000, spd: 50, resistance: 0.3 },
        poem: ['Thất Tinh Vây Nguyệt Trấn Thần Hồn', 'Bạn Nguyệt Thính Trung Ảnh Vô Song'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.TIEN_KHI }
        ]
    },
    'to_nga_suong_nguyet_luan': {
        id: 'to_nga_suong_nguyet_luan',
        name: 'Tố Nga Sương Nguyệt Luân',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        tier: 'TIEN_KHI',
        image: 'artifacts/to_nga_suong_nguyet_luan.webp',
        description: 'Vòng nguyệt luân của Tố Nga tiên tử, mang theo sương giá lạnh lẽo và ánh trăng sắc lẹm.',
        price: 5800000,
        stats: { atk: 6200, spd: 100, iceDmg: 600 },
        poem: ['Tố Nga Nhất Vũ Nguyệt Luân Khởi', 'Sương Lạnh Thấu Xương Diệt Ma Tâm'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.TIEN_KHI }
        ]
    },
    'linh_dich': {
        id: 'linh_dich',
        name: 'Linh Dịch (Chưởng Thiên Bình)',
        type: ITEM_TYPES.DAN_DUOC,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        icon: '🧪',
        description: 'Linh dịch ngưng tụ từ Chưởng Thiên Bình, có khả năng kích phát linh thảo trưởng thành cực nhanh.',
        price: 0,
        effect: { type: 'garden_boost', value: 1000 }, // Rút ngắn 1000 giây hoặc 100%?
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'trung_phe_kim_trung': {
        id: 'trung_phe_kim_trung',
        name: 'Trứng Phệ Kim Trùng',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        beastId: 'phe_kim_trung',
        quality: PHAP_BAO_QUALITIES.THONG_THIEN_LINH_BAO,
        image: 'aberrations/phe-kim-trung.svg',
        description: 'Trứng của loài hung trùng thượng cổ, có thể cắn nuốt vạn vật.',
        price: 50000,
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_KY_TRUNG }
        ]
    },
    'trung_bang_tam': {
        id: 'trung_bang_tam',
        name: 'Trứng Băng Tàm',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        beastId: 'bang_tam',
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        image: 'aberrations/bang-tam.svg',
        description: 'Trứng của loài tằm băng vùng cực hàn, nhả tơ chứa hàn khí thấu xương.',
        price: 20000,
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_KY_TRUNG }
        ]
    },
    'trung_huyet_ngoc_tri_chu': {
        id: 'trung_huyet_ngoc_tri_chu',
        name: 'Trứng Huyết Ngọc Tri Chu',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        beastId: 'huyet_ngoc_tri_chu',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        image: 'aberrations/huyet-ngoc-tri-chu.svg',
        description: 'Trứng nhện ngọc máu, có khả năng phun tơ dính và độc tố cực mạnh.',
        price: 15000,
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_KY_TRUNG }
        ]
    },

    // --- TALISMAN PAPERS (GIẤY PHÙ) ---
    'hoang_chi_phu': {
        id: 'hoang_chi_phu', name: 'Hoàng Chỉ Phù', type: ITEM_TYPES.NGUYEN_LIEU, icon: '📜', quality: PHAP_BAO_QUALITIES.PHAM_KHI, price: 10, description: 'Giấy phù vàng cơ bản.', categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'chu_sa_muc': {
        id: 'chu_sa_muc', name: 'Chu Sa Mực', type: ITEM_TYPES.NGUYEN_LIEU, icon: '🩸', quality: PHAP_BAO_QUALITIES.PHAM_KHI, price: 20, description: 'Mực chu sa dùng để vẽ phù.', categories: [
            { category: ITEM_CATEGORIES_ENUM.PHU_LUC.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHU_LUC.SUBCATEGORIES.PHU_CU }
        ]
    },

    // Khôi Lỗi
    'khoi_loi': {
        id: 'khoi_loi',
        name: 'Khôi Lỗi',
        type: ITEM_TYPES.KHOI_LOI,
        icon: '🤖',
        price: 1000,
        description: 'Một con khôi lỗi cơ quan thuật.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KHOI_LOI.KEY, subcategory: ITEM_CATEGORIES_ENUM.KHOI_LOI.SUBCATEGORIES.LINH_KHOI }
        ]
    },
    'linh_moc_phu': {
        id: 'linh_moc_phu',
        name: 'Linh Mộc Phù Chỉ',
        type: ITEM_TYPES.GIAY_VE_PHU,
        icon: '🪵',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 50,
        description: 'Làm từ gỗ linh mộc, tăng độ ổn định khi vẽ phù.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHU_LUC.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHU_LUC.SUBCATEGORIES.PHU_CU }
        ]
    },
    'yeu_thu_da_phu': {
        id: 'yeu_thu_da_phu',
        name: 'Yêu Thú Da Phù',
        type: ITEM_TYPES.GIAY_VE_PHU,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 250,
        description: 'Làm từ da yêu thú, tăng uy lực cho phù công kích.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHU_LUC.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHU_LUC.SUBCATEGORIES.PHU_CU }
        ]
    },

    // --- SPIRIT INKS (MỰC PHÙ) ---
    'chu_sa_muc': {
        id: 'chu_sa_muc',
        name: 'Chu Sa Linh Mực',
        type: ITEM_TYPES.MUC_VE_PHU,
        icon: '🩸',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 20,
        description: 'Mực chu sa chứa linh lực loãng, dùng vẽ phù cơ bản.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHU_LUC.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHU_LUC.SUBCATEGORIES.PHU_CU }
        ]
    },
    'yeu_huyet_muc': {
        id: 'yeu_huyet_muc',
        name: 'Yêu Huyết Mực',
        type: ITEM_TYPES.MUC_VE_PHU,
        icon: '🧪',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 150,
        description: 'Pha trộn từ máu yêu thú, tăng sát thương cho phù lục.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHU_LUC.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHU_LUC.SUBCATEGORIES.PHU_CU }
        ]
    },

    // --- TALISMAN PENS (PHÙ BÚT) ---
    'truc_phu_but': {
        id: 'truc_phu_but',
        name: 'Trúc Phù Bút',
        type: ITEM_TYPES.BUT_VE_PHU,
        icon: '🖌️',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 500,
        description: 'Bút vẽ phù làm từ linh trúc, tăng tỷ lệ thành công thêm 5%.',
        stats: { successRate: 0.05 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHU_LUC.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHU_LUC.SUBCATEGORIES.PHU_CU }
        ]
    },

    // --- FINISHED TALISMANS (PHÙ LỤC THÀNH PHẨM) ---
    'hoa_cau_phu': {
        id: 'hoa_cau_phu',
        name: 'Hỏa Cầu Phù',
        image: 'items/hoa_cau_phu',
        type: ITEM_TYPES.PHU_LUC,
        icon: '🔥',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 100,
        description: 'Triệu hồi hỏa cầu tấn công, gây sát thương Hỏa.',
        effect: { type: 'damage', value: 200, element: 'fire' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHU_LUC.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHU_LUC.SUBCATEGORIES.CONG_KICH }
        ]
    },
    'kim_cuong_phu': {
        id: 'kim_cuong_phu',
        name: 'Kim Cương Phù',
        image: 'items/kim_cuong_phu',
        type: ITEM_TYPES.PHU_LUC,
        icon: '🛡️',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 350,
        description: 'Tạo lớp bảo vệ cứng như kim cương, tăng 100 DEF trong 3 lượt.',
        effect: { type: EFFECT_TYPES.BUFF_TAM_THOI, stat: 'def', value: 100, duration: 3 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHU_LUC.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHU_LUC.SUBCATEGORIES.PHONG_NGU }
        ]
    },
    'than_hanh_phu': {
        id: 'than_hanh_phu',
        name: 'Thần Hành Phù',
        image: 'items/than_hanh_phu',
        type: ITEM_TYPES.PHU_LUC,
        icon: '👟',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 200,
        description: 'Tăng tốc độ di chuyển cực nhanh trong thời gian ngắn.',
        effect: { type: 'utility', speedBoost: 2.0, duration: 60 }, // seconds
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHU_LUC.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHU_LUC.SUBCATEGORIES.DON_THUAT }
        ]
    },
    'thuan_di_phu': {
        id: 'thuan_di_phu',
        name: 'Thuấn Di Phù',
        image: 'items/thuan_di_phu',
        type: ITEM_TYPES.PHU_LUC,
        icon: '⚡',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 2000,
        description: 'Dịch chuyển tức thời thoát khỏi nguy hiểm.',
        effect: { type: 'escape' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHU_LUC.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHU_LUC.SUBCATEGORIES.DON_THUAT }
        ]
    },

    // --- PROFESSION SECRETS (BÍ PHÁP MỞ KHÓA NGHỀ NGHIỆP) ---
    'dan_dao_chan_giai': {
        id: 'dan_dao_chan_giai',
        name: 'Đan Đạo Chân Giải',
        image: 'items/dan_dao_chan_giai',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1000,
        description: 'Bí tịch truyền thừa Luyện Đan, giúp mở khóa nghề Luyện Dược Sư và truyền thụ cách luyện chế Tịch Cốc Đan, Ngưng Khí Đan.',
        effect: {
            type: EFFECT_TYPES.HOC_NHIEU_CONG_THUC,
            value: [
                { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'alchemy', secretId: 'dan_dao_chan_giai' },
                { type: EFFECT_TYPES.HOC_CONG_THUC_DAN, value: 'tich_coc_dan' },
                { type: EFFECT_TYPES.HOC_CONG_THUC_DAN, value: 'ngung_khi_dan' }
            ]
        },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KHOI_LOI.KEY, subcategory: ITEM_CATEGORIES_ENUM.KHOI_LOI.SUBCATEGORIES.LINH_KHOI }
        ]
    },
    'truong_sinh_dan': {
        id: 'truong_sinh_dan',
        name: 'Trường Sinh Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1000,
        description: 'Đan dược dưỡng sinh cổ xưa, tăng mạnh Thọ Nguyên.',
        effect: { type: EFFECT_TYPES.TANG_THO_NGUYEN, value: 20 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'huyet_don_thuat': {
        id: 'huyet_don_thuat',
        name: 'Huyết Độn Thuật',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🩸',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1500,
        description: 'Ma đạo bí pháp, dùng tinh huyết để độn tẩu cực nhanh.',
        effect: { type: EFFECT_TYPES.HOC_BI_THUAT, value: 'huyet_don_thuat' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.DON_THUAT }
        ]
    },
    'luyen_khi_tong_cuong': {
        id: 'luyen_khi_tong_cuong',
        name: 'Luyện Khí Tổng Cương',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1500,
        description: 'Chứa đựng bí quyết tôi luyện kim thạch, rèn đúc thần binh pháp bảo. Mở khóa nghề Luyện Khí Sư và truyền thụ bản vẽ Thanh Hồng Kiếm, Luyện Chế Linh Hư Túi.',
        effect: {
            type: EFFECT_TYPES.HOC_NHIEU_CONG_THUC,
            value: [
                { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'smithing', secretId: 'luyen_khi_tong_cuong' },
                { type: EFFECT_TYPES.HOC_CONG_THUC_REN, value: 'thanh_hong_kiem' },
                { type: EFFECT_TYPES.HOC_CONG_THUC_REN, value: 'luyen_che_linh_hu_tui' }
            ]
        },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KHOI_LOI.KEY, subcategory: ITEM_CATEGORIES_ENUM.KHOI_LOI.SUBCATEGORIES.LINH_KHOI }
        ]
    },
    'thai_thuong_phu_kinh': {
        id: 'thai_thuong_phu_kinh',
        name: 'Thái Thượng Phù Kinh',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1000,
        description: 'Hướng dẫn cách câu thông thiên địa linh lực vào phù văn để tạo ra phù lục. Mở khóa nghề Phù Sư và truyền thụ cách vẽ Hỏa Cầu Phù.',
        effect: {
            type: EFFECT_TYPES.HOC_NHIEU_CONG_THUC,
            value: [
                { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'talisman', secretId: 'thai_thuong_phu_kinh' },
                { type: EFFECT_TYPES.HOC_CONG_THUC_PHU, value: 'hoa_cau_phu' }
            ]
        },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KHOI_LOI.KEY, subcategory: ITEM_CATEGORIES_ENUM.KHOI_LOI.SUBCATEGORIES.LINH_KHOI }
        ]
    },
    'tran_dao_thien_thu': {
        id: 'tran_dao_thien_thu',
        name: 'Trận Đạo Thiên Thư',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 2000,
        description: 'Kiến thức về trận đồ, mắt trận và cách bố trí linh thạch để trấn giữ hoặc công kích. Mở khóa nghề Trận Pháp Sư và truyền thụ cách bố trí Tụ Linh Trận.',
        effect: {
            type: EFFECT_TYPES.HOC_NHIEU_CONG_THUC,
            value: [
                { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'formation', secretId: 'tran_dao_thien_thu' },
                { type: EFFECT_TYPES.HOC_TRAN_PHAP, value: 'tran_do_tu_linh' }
            ]
        },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    'van_thu_ngu_phap': {
        id: 'van_thu_ngu_phap',
        name: 'Vạn Thú Ngự Pháp',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1200,
        description: 'Bí quyết giao tiếp và ký kết khế ước với các loài linh thú. Mở khóa nghề Ngự Thú Sư và truyền thụ khế ước linh thú Thanh Vân Hạc.',
        effect: {
            type: EFFECT_TYPES.HOC_NHIEU_CONG_THUC,
            value: [
                { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'beast', secretId: 'van_thu_ngu_phap' },
                { type: EFFECT_TYPES.HOC_LINH_THU, value: 'thanh_van_hac' }
            ]
        },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    'thien_trung_bi_luc': {
        id: 'thien_trung_bi_luc',
        name: 'Thiên Trùng Bí Lục',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1200,
        description: 'Cách nuôi dưỡng và điều khiển bầy trùng mang theo kịch độc hoặc năng lực đặc thù. Mở khóa nghề Khu Trùng Sư và ban thưởng kỳ trùng Phệ Linh Trùng.',
        effect: {
            type: EFFECT_TYPES.HOC_NHIEU_CONG_THUC,
            value: [
                { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'insect', secretId: 'thien_trung_bi_luc' },
                { type: EFFECT_TYPES.HOC_LINH_THU, value: 'phe_linh_trung' }
            ]
        },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    'co_quan_linh_ky': {
        id: 'co_quan_linh_ky',
        name: 'Cơ Quan Linh Kỹ',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 2500,
        description: 'Kỹ thuật chế tác cơ quan và truyền linh hồn vào các vật vô tri để tạo ra khôi lỗi. Mở khóa nghề Khôi Lỗi Sư và truyền thụ bản vẽ Thiết Giáp Khôi Lỗi.',
        effect: {
            type: EFFECT_TYPES.HOC_NHIEU_CONG_THUC,
            value: [
                { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'puppet', secretId: 'co_quan_linh_ky' },
                { type: EFFECT_TYPES.HOC_CONG_THUC_KHOI_LOI, value: 'thiet_giap_khoi_loi' }
            ]
        },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KHOI_LOI.KEY, subcategory: ITEM_CATEGORIES_ENUM.KHOI_LOI.SUBCATEGORIES.LINH_KHOI }
        ]
    },
    'cuu_u_luyen_thi_thuat': {
        id: 'cuu_u_luyen_thi_thuat',
        name: 'Cửu U Luyện Thi Thuật',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 3000,
        description: 'Tà thuật luyện chế xác chết thành thi khôi, mở khóa nghề Luyện Thi Sư và truyền thụ cách luyện chế Thi Binh, Thi Tướng.',
        effect: {
            type: EFFECT_TYPES.HOC_NHIEU_CONG_THUC,
            value: [
                { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'corpse', secretId: 'cuu_u_luyen_thi_thuat' },
                { type: EFFECT_TYPES.HOC_CONG_THUC_THI, value: 'thi_binh' },
                { type: EFFECT_TYPES.HOC_CONG_THUC_THI, value: 'thi_tuong' }
            ]
        },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KHOI_LOI.KEY, subcategory: ITEM_CATEGORIES_ENUM.KHOI_LOI.SUBCATEGORIES.LINH_KHOI }
        ]
    },

    // --- TALISMAN TECHNIQUES (BÍ PHÁP) ---
    'thien_loi_phu_quyen': {
        id: 'thien_loi_phu_quyen',
        name: 'Thiên Lôi Phù Quyển',
        type: ITEM_TYPES.DON_PHU,
        icon: '⚡',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 45000,
        description: 'Ghi chép cách vẽ Thiên Lôi Phù, uy lực kinh thiên động địa.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHU_LUC.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHU_LUC.SUBCATEGORIES.CONG_KICH }
        ]
    },

    // --- ALCHEMY MATERIALS (EXPANDED) ---
    'linh_thao_10y': {
        id: 'linh_thao_10y',
        name: 'Hoàng Tinh Thảo (10 năm)',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🌿',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 80,
        description: 'Thảo dược có thân màu vàng kim nhạt, sau 10 năm đã tích tụ chút linh khí, là nguyên liệu phụ trợ phổ biến.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'linh_thao_100y': {
        id: 'linh_thao_100y',
        name: 'Uẩn Cổ Thảo (100 năm)',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🍃',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 500,
        description: 'Linh dược trăm năm trân quý, một trong ba chủ dược chính để luyện chế Trúc Cơ Đan trong Phàm Nhân Tu Tiên.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'linh_thao_1000y': {
        id: 'linh_thao_1000y',
        name: 'Cửu Khúc Linh Sâm (1000 năm)',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🎋',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 5000,
        description: 'Linh dược ngàn năm cực kỳ hiếm có, đã bắt đầu thông linh tính, thường dùng để luyện chế đan dược phụ trợ Nguyên Anh đột phá.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },

    // --- MONSTER MATERIALS ---
    'yeu_dan_so': {
        id: 'yeu_dan_so',
        name: 'Yêu Đan Sơ Cấp',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🟡',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 300,
        description: 'Nội đan của yêu thú cấp thấp, chứa tinh hoa yêu lực.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.YEU_THU, subSubcategory: 'yeu_dan' }
        ]
    },
    'yeu_dan_trung': {
        id: 'yeu_dan_trung',
        name: 'Yêu Đan Trung Cấp',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🟠',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1500,
        description: 'Nội đan của yêu thú trung cấp, chứa linh lực dồi dào.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.YEU_THU, subSubcategory: 'yeu_dan' }
        ]
    },
    'ngung_anh_dan': {
        id: 'ngung_anh_dan',
        name: 'Ngưng Anh Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💎',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 50000,
        description: 'Đan dược hỗ trợ ngưng tụ Nguyên Anh, cực kỳ quý hiếm.',
        stats: { breakthroughChance: 0.25 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'yeu_huyet': {
        id: 'yeu_huyet',
        name: 'Yêu Thú Tinh Huyết',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🩸',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 100,
        description: 'Máu tươi của yêu thú, dùng trong luyện thể hoặc luyện đan.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.YEU_THU, subSubcategory: 'yeu_huyet' }
        ]
    },
    'xac_yeu_thu': {
        id: 'xac_yeu_thu',
        name: 'Xác Yêu Thú',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🧟',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 500,
        description: 'Thân xác hoàn chỉnh của yêu thú, có thể dùng để luyện thi hoặc bán.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.YEU_THU, subSubcategory: 'yeu_giac' }
        ]
    },
    'xac_tu_si': {
        id: 'xac_tu_si',
        name: 'Xác Tu Sĩ',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '💀',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1000,
        description: 'Thân xác của tu sĩ đã vẫn lạc, chứa đựng linh tính, là vật liệu thượng hạng để luyện thi.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },

    // --- ORES & MINERALS ---
    'linh_thao_van_nam': {
        id: 'linh_thao_van_nam',
        name: 'Vạn Niên Huyết Linh Chi',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🌺',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 50000,
        description: 'Linh dược vạn năm cực kỳ hiếm thấy ở Nhân giới, tích lũy thiên địa tinh hoa vạn năm, dùng để chế luyện các loại đan dược nghịch thiên độ kiếp.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'vân_thiết': {
        id: 'vân_thiết',
        name: 'Thiên Ngoại Vẫn Thiết',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '☄️',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 25000,
        description: 'Mảnh vỡ thiên thạch từ ngoài không gian, chứa sức mạnh tinh thần.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'yeu_cot': {
        id: 'yeu_cot',
        name: 'Yêu Thú Cốt',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🦴',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 150,
        description: 'Xương của yêu thú, dùng làm nguyên liệu chế tác hoặc luyện thi.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.YEU_THU, subSubcategory: 'yeu_cot' }
        ]
    },
    'da_lan_giap': {
        id: 'da_lan_giap',
        name: 'Da Lân Giáp',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🛡️',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1200,
        description: 'Lớp da hoặc vảy của yêu thú phòng ngự cao.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'long_huyet_tinh': {
        id: 'long_huyet_tinh',
        name: 'Long Huyết Tinh',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🩸',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 10000,
        description: 'Tinh hoa máu rồng ngưng kết, chứa sức mạnh huyết mạch kinh người.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'tien_tinh': {
        id: 'tien_tinh',
        name: 'Tiên Tinh',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '💎',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 100000,
        description: 'Tinh thể kết tinh từ Tiên khí, chỉ có ở những nơi tiên phàm giao giới.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_KHOANG, subSubcategory: 'di_khoang' }
        ]
    },
    'trung_than_thu': {
        id: 'trung_than_thu',
        name: 'Trứng Thần Thú',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        icon: '🥚',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 1000000,
        description: 'Trứng của sinh vật cổ đại, có thể ấp nở thành linh thú hộ mệnh.',
        effect: { type: EFFECT_TYPES.AP_TRUNG },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_LINH_THU }
        ]
    },
    'hoa_tinh_thach': {
        id: 'hoa_tinh_thach',
        name: 'Hỏa Tinh Thạch',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🔥',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1200,
        description: 'Khoáng thạch chứa hỏa tính cực mạnh.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'han_ngoc_tuy': {
        id: 'han_ngoc_tuy',
        name: 'Hàn Ngọc Tủy',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '❄️',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 8500,
        description: 'Tinh túy từ hàn ngọc vạn năm, lạnh thấu xương.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_DICH, subSubcategory: 'thien_dia' }
        ]
    },

    // --- ALCHEMY TOOLS (AS ITEMS) ---
    'pham_lu': {
        id: 'pham_lu',
        name: 'Phàm Lư',
        image: 'items/pham_lu',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🏺',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 100,
        description: 'Đan lư cơ bản cho người mới học luyện đan.',
        effect: { type: EFFECT_TYPES.TRANG_BI_DAN_LU, value: 'pham_lu' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_DAN.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_DAN.SUBCATEGORIES.DAN_LU }
        ]
    },
    'linh_hoa': {
        id: 'linh_hoa',
        name: 'Linh Hỏa',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🔥',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 50,
        description: 'Linh hỏa cấp thấp, đủ để luyện chế đan dược phàm phẩm.',
        effect: { type: EFFECT_TYPES.LUYEN_HOA_DI_HOA, value: 'linh_hoa' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.SUBCATEGORIES.DI_HOA }
        ]
    },
    'huyen_thiet_trong_lu': {
        id: 'huyen_thiet_trong_lu',
        name: 'Huyền Thiết Trọng Lư',
        image: 'items/huyen_thiet_trong_lu',
        type: ITEM_TYPES.DAN_LU,
        icon: '🏺',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Đan lư đúc từ huyền thiết, giúp ổn định hỏa lực.',
        effect: { type: EFFECT_TYPES.TRANG_BI_DAN_LU, value: 'huyen_thiet_trong_lu' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_DAN.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_DAN.SUBCATEGORIES.DAN_LU }
        ]
    },
    'thanh_lien_dia_tam_hoa_seed': {
        id: 'thanh_lien_dia_tam_hoa_seed',
        name: 'Thanh Liên Địa Tâm Hỏa',
        type: ITEM_TYPES.LINH_HOA,
        icon: '🔥',
        quality: DI_HOA_QUALITIES.DI_HOA,
        price: 50000,
        description: 'Hỏa chủng của Thanh Liên Địa Tâm Hỏa, có thể luyện hóa thành linh hỏa.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.SUBCATEGORIES.DI_HOA }
        ]
    },

    // --- TECHNIQUES (CÔNG PHÁP) ---
    'truong_sinh_quyet': {
        id: 'truong_sinh_quyet',
        name: 'Trường Sinh Quyết (Bí Tịch)',
        image: 'items/truong_sinh_quyet',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📖',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 500,
        description: 'Công pháp cơ bản giúp gia tăng thọ nguyên và thể chất.',
        techniqueId: 'truong_sinh_quyet',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'thien_loi_kiem_quyet': {
        id: 'thien_loi_kiem_quyet',
        name: 'Thiên Lôi Kiếm Quyết',
        type: ITEM_TYPES.TUYET_KY,
        icon: '⚡',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 50000,
        description: 'Kiếm quyết cấp cao mượn lực thiên lôi, uy lực vô song.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.KIEM_QUYET }
        ]
    },

    // --- SMITHING MATERIALS (LINH QUẶNG & DỊ KIM) ---
    'thai_duong_than_kim': {
        id: 'thai_duong_than_kim',
        name: 'Thái Dương Thần Kim',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🌞',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 150000,
        description: 'Vật liệu chí dương, sinh ra từ lõi mặt trời.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },

    // --- SPIRIT WOOD (LINH MỘC) ---
    'loi_kich_moc': {
        id: 'loi_kich_moc',
        name: 'Lôi Kích Mộc',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🪵',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 12000,
        description: 'Gỗ cây linh thụ bị sét đánh mà không chết, chứa lôi đình chi lực.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },

    // --- SMITHING TOOLS ---
    'de_khi_dai': {
        id: 'de_khi_dai',
        name: 'Đế Khí Đài',
        type: ITEM_TYPES.DE_LUYEN_KHI,
        icon: '⚒️',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 200,
        description: 'Bệ rèn thô sơ cho người mới học luyện khí.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_KHI.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_KHI.SUBCATEGORIES.DE_LUYEN_KHI }
        ]
    },
    'luyen_khi_dai': {
        id: 'luyen_khi_dai',
        name: 'Luyện Khí Đài',
        type: ITEM_TYPES.DE_LUYEN_KHI,
        icon: '⚒️',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 3000,
        description: 'Bệ rèn linh văn chuyên dụng cho luyện khí sư.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_KHI.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_KHI.SUBCATEGORIES.DE_LUYEN_KHI }
        ]
    },

    // --- CRAFTABLE EQUIPMENT ---
    'phi_kiem_tinh_ha': {
        id: 'phi_kiem_tinh_ha',
        name: 'Tinh Hà Phi Kiếm',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        icon: '🗡️',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 15000,
        description: 'Kiếm mang ánh sáng tinh hà, sát thương cực lớn. Rèn từ Tinh Kim và Huyền Thiết.',
        stats: { atk: 150, critical: 0.15 }
    },
    'long_lan_giap': {
        id: 'long_lan_giap',
        name: 'Long Lân Giáp',
        type: ITEM_TYPES.PHAP_BAO_THU,
        icon: '🛡️',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 85000,
        description: 'Giáp làm từ vảy giao long, phòng ngự kinh người. Đúc từ Da Lân Giáp và Yêu Thú Tinh Huyết.',
        stats: { def: 450, resistance: 0.3 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_BAO_SUB }
        ]
    },

    // --- BEAST & INSECT ITEMS (NEW) ---
    'trung_hac_linh': {
        id: 'trung_hac_linh',
        name: 'Trứng Thanh Vân Hạc',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        icon: '🥚',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 2000,
        description: 'Một quả trứng hạc tỏa ra linh khí thanh khiết.',
        beastId: 'thanh_van_hac',
        hatchTime: 300, // 5 minutes
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_LINH_THU }
        ]
    },
    'trung_xich_lang': {
        id: 'trung_xich_lang',
        name: 'Trứng Xích Diễm Lang',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        icon: '🔥',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 3500,
        description: 'Trứng sói lửa, sờ vào thấy ấm nóng.',
        beastId: 'xich_diem_lang',
        hatchTime: 600,
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_LINH_THU }
        ]
    },
    'ken_kim_tam': {
        id: 'ken_kim_tam',
        name: 'Kén Kim Tàm',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        icon: '🧶',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Kén của Kim Tàm, đang chờ đợi ngày phá kén.',
        beastId: 'kim_tam',
        hatchTime: 1200,
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_LINH_THU }
        ]
    },
    'linh_thu_dan': {
        id: 'linh_thu_dan',
        name: 'Linh Thú Đan',
        type: ITEM_TYPES.THUC_AN_LINH_THU,
        icon: '💊',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 100,
        description: 'Đan dược bồi bổ cho linh thú, tăng kinh nghiệm và độ thân mật.',
        expGain: 100,
        loyaltyGain: 5,
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.KEY }
        ]
    },
    'yeu_nhuc_tuoi': {
        id: 'yeu_nhuc_tuoi',
        name: 'Yêu Nhục Tươi',
        type: ITEM_TYPES.THUC_AN_LINH_THU,
        icon: '🥩',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 50,
        description: 'Thịt yêu thú tươi sống, linh thú rất thích ăn.',
        expGain: 50,
        loyaltyGain: 2,
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.KEY }
        ]
    },
    'van_thu_lenh': {
        id: 'van_thu_lenh',
        name: 'Vạn Thú Lệnh',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 50000,
        description: 'Lệnh bài cổ xưa giúp tăng khả năng thuần phục yêu thú.',
        stats: { tamingBonus: 0.2 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_BAO_SUB }
        ]
    },

    // --- BÍ PHÁP NGHỀ NGHIỆP (UNLOCKS) ---
    'bi_phap_alchemy': {
        id: 'bi_phap_alchemy',
        name: '« Đan Đạo Chân Giải »',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Ghi chép tinh túy của đan đạo, dùng để mở khóa nghề Luyện Đan.',
        effect: { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'alchemy' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    'bi_phap_talisman': {
        id: 'bi_phap_talisman',
        name: '« Thiên Phù Bí Lục »',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Chứa đựng bí mật của phù văn, dùng để mở khóa nghề Phù Lục.',
        effect: { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'talisman' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    'bi_phap_smithing': {
        id: 'bi_phap_smithing',
        name: '« Luyện Khí Tổng Cương »',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Bí tịch rèn đúc pháp bảo, dùng để mở khóa nghề Luyện Khí.',
        effect: { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'smithing' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    'bi_phap_formation': {
        id: 'bi_phap_formation',
        name: '« Trận Đạo Diễn Nghĩa »',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Giải mã các trận pháp cổ đại, dùng để mở khóa nghề Trận Pháp.',
        effect: { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'formation' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    'bi_phap_puppet': {
        id: 'bi_phap_puppet',
        name: '« Khôi Lỗi Chân Kinh »',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Bí thuật điều khiển rối, dùng để mở khóa nghề Khôi Lỗi.',
        effect: { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'puppet' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    'bi_phap_corpse': {
        id: 'bi_phap_corpse',
        name: '« Thi Đạo Quyển Thứ »',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Tà thuật luyện chế xác chết, dùng để mở khóa nghề Luyện Thi.',
        effect: { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'corpse' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    'bi_phap_beast': {
        id: 'bi_phap_beast',
        name: '« Ngự Thú Tâm Pháp »',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Tâm pháp dẫn dắt linh thú, dùng để mở khóa nghề Ngự Thú.',
        effect: { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'beast' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    'bi_phap_insect': {
        id: 'bi_phap_insect',
        name: '« Vạn Trùng Bí Truyền »',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Kỹ thuật nuôi dưỡng kỳ trùng, dùng để mở khóa nghề Khu Trùng.',
        effect: { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'insect' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.BI_THUAT }
        ]
    },
    // --- TECHNIQUE BOOKS ---
    'truong_xuan_nap_khi_quyet': {
        id: 'truong_xuan_nap_khi_quyet',
        name: 'Trường Xuân Nạp Khí Quyết',
        image: 'items/truong_xuan_nap_khi_quyet',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 300,
        techniqueId: 'truong_xuan_nap_khi_quyet',
        description: 'Bản sao chép công pháp nhập môn phổ thông được lưu truyền rộng rãi trong Nhân Giới.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'liet_duong_cong': {
        id: 'liet_duong_cong',
        name: 'Liệt Dương Công',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📙',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 800,
        techniqueId: 'liet_duong_cong',
        description: 'Ghi chép phương pháp hấp thu Hỏa linh khí.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'han_thuy_quyet': {
        id: 'han_thuy_quyet',
        name: 'Hàn Thủy Quyết',
        image: 'items/han_thuy_quyet',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📗',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 800,
        techniqueId: 'han_thuy_quyet',
        description: 'Ghi chép phương pháp hấp thu Thủy linh khí.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'thanh_moc_tam_kinh': {
        id: 'thanh_moc_tam_kinh',
        name: 'Thanh Mộc Tâm Kinh',
        image: 'items/thanh_moc_tam_kinh',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📒',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 800,
        techniqueId: 'thanh_moc_tam_kinh',
        description: 'Ghi chép phương pháp hấp thu Mộc linh khí.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'canh_kim_quyet': {
        id: 'canh_kim_quyet',
        name: 'Canh Kim Quyết',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📖',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 800,
        techniqueId: 'canh_kim_quyet',
        description: 'Ghi chép phương pháp hấp thu Kim linh khí.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'hau_tho_cong': {
        id: 'hau_tho_cong',
        name: 'Hậu Thổ Công',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 800,
        techniqueId: 'hau_tho_cong',
        description: 'Ghi chép phương pháp hấp thu Thổ linh khí.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'man_nguu_kinh': {
        id: 'man_nguu_kinh',
        name: 'Man Ngưu Kình',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '🐂',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 1500,
        techniqueId: 'man_nguu_kinh',
        description: 'Bí pháp Luyện Thể sơ cấp, rèn luyện cơ bắp.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'duong_than_quyet': {
        id: 'duong_than_quyet',
        name: 'Dưỡng Thần Quyết',
        image: 'items/duong_than_quyet',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '🧠',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 2000,
        techniqueId: 'duong_than_quyet',
        description: 'Bí pháp Thần Thức sơ cấp, rèn luyện linh hồn.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.THAN_HON }
        ]
    },
    'cuu_chuyen_kim_than': {
        id: 'cuu_chuyen_kim_than',
        name: 'Cửu Chuyển Kim Thân',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '🔱',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 12000,
        techniqueId: 'cuu_chuyen_kim_than',
        description: 'Bí pháp Luyện Thể trung cấp cực kỳ quý hiếm.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.LUYEN_THE }
        ]
    },
    'u_minh_huy_ngan': {
        id: 'u_minh_huy_ngan',
        name: 'U Minh Huy Ngạn',
        image: 'items/u_minh_huy_ngan',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '💀',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 15000,
        techniqueId: 'u_minh_huy_ngan',
        description: 'Bí pháp Thần Thức trung cấp, tu luyện linh hồn.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    // dan_phuong_than_tam_dan và dan_phuong_truc_co_dan đã được định nghĩa ở phần đầu file
    'ban_ve_phi_kiem_tinh_ha': {
        id: 'ban_ve_phi_kiem_tinh_ha',
        name: 'Bản Vẽ Tinh Hà Phi Kiếm',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 8000,
        description: 'Ghi chép phương pháp rèn Tinh Hà Phi Kiếm.',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_REN, value: 'phi_kiem_tinh_ha' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_KHI.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_KHI.SUBCATEGORIES.BAN_VE }
        ]
    },
    'ban_ve_long_lan_giap': {
        id: 'ban_ve_long_lan_giap',
        name: 'Bản Vẽ Long Lân Giáp',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 25000,
        description: 'Bản vẽ rèn Long Lân Giáp phòng ngự kinh người.',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_REN, value: 'long_lan_giap' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_KHI.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_KHI.SUBCATEGORIES.BAN_VE }
        ]
    },
    'dia_lu': {
        id: 'dia_lu',
        name: 'Địa Long Phần Thiên Lư',
        image: 'items/dia_lu',
        type: ITEM_TYPES.DAN_LU,
        icon: '🏺',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 35000,
        description: 'Chứa đựng tinh hoa chi lực của địa long, khống hỏa cực tốt.',
        effect: { type: EFFECT_TYPES.TRANG_BI_DAN_LU, value: 'dia_lu' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_DAN.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_DAN.SUBCATEGORIES.DAN_LU }
        ]
    },
    'thien_lu': {
        id: 'thien_lu',
        name: 'Thiên Cực Thái Hư Lư',
        image: 'items/thien_lu',
        type: ITEM_TYPES.DAN_LU,
        icon: '🏺',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 150000,
        description: 'Lò luyện đỉnh cấp, ổn định hỏa lực đến mức hoàn mỹ.',
        effect: { type: EFFECT_TYPES.TRANG_BI_DAN_LU, value: 'thien_lu' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_DAN.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_DAN.SUBCATEGORIES.DAN_LU }
        ]
    },
    'van_lac_tam_viem_seed': {
        id: 'van_lac_tam_viem_seed',
        name: 'Vẫn Lạc Tâm Viêm (Chủng)',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🔥',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 120000,
        description: 'Hỏa chủng của Vẫn Lạc Tâm Viêm, tăng mạnh hiệu suất luyện đan.',
        effect: { type: EFFECT_TYPES.LUYEN_HOA_DI_HOA, value: 'van_lac_tam_viem' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'tinh_lien_yeu_hoa_seed': {
        id: 'tinh_lien_yeu_hoa_seed',
        name: 'Tịnh Liên Yêu Hỏa (Chủng)',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🔥',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 800000,
        description: 'Yêu hỏa thần bí có khả năng tịnh hóa vạn vật.',
        effect: { type: EFFECT_TYPES.LUYEN_HOA_DI_HOA, value: 'tinh_lien_yeu_hoa' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    // --- RECIPES (đã chuyển về dan_phuong_* ở phần đầu file) ---
    'dan_phuong_ngung_khi_dan': {
        id: 'dan_phuong_ngung_khi_dan',
        name: 'Đan Phương Ngưng Khí Đan',
        type: ITEM_TYPES.DAN_PHUONG,
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        icon: '📜',
        description: 'Ghi chép cách luyện chế Ngưng Khí Đan.',
        price: 200,
        recipeId: 'ngung_khi_dan',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_DAN.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_DAN.SUBCATEGORIES.DAN_PHUONG }
        ]
    },
    // ban_ve_phi_kiem_tinh_ha và ban_ve_long_lan_giap đã định nghĩa ở trên

    // --- DANH KHÍ / TIÊN KHÍ / THÔNG THIÊN LINH BẢO (POEM ARTIFACTS) ---
    'vo_dinh_tieu_dao_cam': {
        id: 'vo_dinh_tieu_dao_cam',
        name: 'Vô Định Tiêu Dao Cầm',
        type: ITEM_TYPES.PHAP_BAO_HON,
        quality: PHAP_BAO_QUALITIES.DANH_KHI,
        image: 'artifacts/vo_dinh_tieu_dao_cam.png',
        description: 'Cây cầm thần bí, tiếng đàn có thể tàng hình sơn hà, tiêu diêu tự tại giữa trời đất.',
        price: 1000000,
        stats: { soulRepress: 100, soulExpSpeed: 2.5, spd: 50 },
        poem: ['Trần Thế Vô Nhiễm Ẩn Sơn Hà', 'Nhất Khúc Tiêu Giao Thiên Địa Gian'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'van_tinh_nho_quan': {
        id: 'van_tinh_nho_quan',
        name: 'Văn Tinh Nho Quán',
        type: ITEM_TYPES.PHAP_BAO_THU,
        quality: PHAP_BAO_QUALITIES.DANH_KHI,
        image: 'artifacts/van_tinh_nho_quan.png',
        description: 'Mũ nho sĩ chứa đựng tinh túy của văn chương, hạo nhiên chính khí trấn áp tà ma.',
        price: 800000,
        stats: { def: 200, comprehension: 20, luck: 15 },
        poem: ['Nho Quán Nhất Tinh Diệu Thiên Địa', 'Hạo Nhiên Chính Khí Đãng Càn Khôn'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'that_thai_huyen_nghien': {
        id: 'that_thai_huyen_nghien',
        name: 'Thất Thái Huyền Nghiên',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        quality: PHAP_BAO_QUALITIES.DANH_KHI,
        image: 'artifacts/that_thai_huyen_nghien.png',
        description: 'Nghiên mực bảy màu, một điểm có thể định hình sơn hà, ghi chép thiên đạo.',
        price: 1500000,
        stats: { tuViSpeed: 3.0, daoVun: 50, luck: 30 },
        poem: ['Thất Thái Lưu Quang Thư Thiên Đạo', 'Huyền Nghiên Nhất Điểm Định Sơn Hà'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'te_hon_toa': {
        id: 'te_hon_toa',
        name: 'Tế Hồn Tỏa',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.DANH_KHI,
        image: 'artifacts/te_hon_toa.png',
        description: 'Xiềng xích tế hồn, nhiếp lấy phách của vạn vật, khóa chặt u minh.',
        price: 1200000,
        stats: { atk: 300, soulPierce: 0.5, lifeSteal: 0.2 },
        poem: ['Tuế Hồn Nhiếp Phách Tỏa U Minh', 'Dị Kỷ Thương Địch Xá Kỳ Thủy'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'luyen_phong_thach': {
        id: 'luyen_phong_thach',
        name: 'Luyện Phong Thạch',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.DANH_KHI,
        image: 'artifacts/luyen_phong_thach.png',
        description: 'Viên đá luyện từ cuồng phong, bách luyện thành binh, trảm phá càn khôn.',
        price: 900000,
        stats: { atk: 250, pierce: 0.4, spd: 80 },
        poem: ['Thiên Ma Bách Lệ Xuất Thần Binh', 'Càn Khôn Nhất Trảm Thùy Khả Đáng'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'kim_than_xa_loi': {
        id: 'kim_than_xa_loi',
        name: 'Kim Thân Xá Lợi',
        type: ITEM_TYPES.PHAP_BAO_THU,
        quality: PHAP_BAO_QUALITIES.DANH_KHI,
        image: 'artifacts/kim_than_xa_loi.png',
        description: 'Hạt xá lợi kim thân, vạn pháp bất xâm, trấn giữ tâm ma.',
        price: 2000000,
        stats: { def: 500, hp: 2000, stability: 50 },
        poem: ['Kim Thân Hộ Thể Trấn Yêu Tà', 'Vạn Pháp Bất Xâm Xá Lợi Tâm'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'duong_kiem_ho': {
        id: 'duong_kiem_ho',
        name: 'Dưỡng Kiếm Hồ',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        quality: PHAP_BAO_QUALITIES.DANH_KHI,
        image: 'artifacts/duong_kiem_ho.png',
        description: 'Bầu rượu dưỡng kiếm, tàng chứa kiếm tiên, phong mang thấu càn khôn.',
        price: 1300000,
        stats: { atk: 150, critRate: 0.2, critDmg: 0.5 },
        poem: ['Phong Mang Nhất Hiện Hàn Cửu Châu', 'Càn Khôn Hồ Trung Tàn Kiếm Tiên'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'cuu_mach_linh_cham': {
        id: 'cuu_mach_linh_cham',
        name: 'Cửu Mạch Linh Châm',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.DANH_KHI,
        image: 'artifacts/cuu_mach_linh_cham.png',
        description: 'Châm thần chín mạch, nghịch chuyển âm dương, hồi thiên tục mệnh.',
        price: 1100000,
        stats: { atk: 120, lifeSteal: 0.5, hp: 500 },
        poem: ['Linh Châm Cửu Chuyển Hoán Âm Dương', 'Nhất Niệm Hồi Thiên Tục Mệnh Nguyên'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'co_luyen_lung': {
        id: 'co_luyen_lung',
        name: 'Cổ Luyện Lũng',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        quality: PHAP_BAO_QUALITIES.DANH_KHI,
        image: 'artifacts/co_luyen_lung.png',
        description: 'Lồng nuôi cổ trùng cổ xưa, thực nhật nguyệt, chứa vạn độc thiên trùng.',
        price: 950000,
        stats: { atk: 100, murderQi: 30, poisonRes: 0.8 },
        poem: ['Cổ Luyện Nhất Thành Thực Nhật Nguyệt', 'Vạn Độc Thiên Trùng Dưỡng Lung Trung'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'chan_vu_nho_quan_ta': {
        id: 'chan_vu_nho_quan_ta',
        name: 'Chân Vũ Nho Quán (Tả)',
        type: ITEM_TYPES.PHAP_BAO_THU,
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        image: 'artifacts/chan_vu_nho_quan_ta.webp',
        description: 'Mũ Chân Vũ phía bên trái, chứa đựng một phần thần uy của Chân Vũ Đại Đế.',
        price: 425000,
        stats: { def: 100, hp: 300 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.LINH_BAO }
        ]
    },
    'chan_vu_nho_quan_huu': {
        id: 'chan_vu_nho_quan_huu',
        name: 'Chân Vũ Nho Quán (Hữu)',
        type: ITEM_TYPES.PHAP_BAO_THU,
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        image: 'artifacts/chan_vu_nho_quan_huu.webp',
        description: 'Mũ Chân Vũ phía bên phải, chứa đựng một phần thần uy của Chân Vũ Đại Đế.',
        price: 425000,
        stats: { def: 100, hp: 300 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.LINH_BAO }
        ]
    },
    'chan_vu_nho_quan': {
        id: 'chan_vu_nho_quan',
        name: 'Chân Vũ Nho Quán (Hoàn Thiện)',
        type: ITEM_TYPES.PHAP_BAO_THU,
        quality: PHAP_BAO_QUALITIES.DANH_KHI,
        image: 'artifacts/chan_vu_nho_quan_full.webp', // Using right hand as representative
        description: 'Bản hoàn thiện của Chân Vũ Nho Quán, thập diện mai phục cũng bất cụ, chiến bát hoang.',
        price: 1700000,
        stats: { def: 500, hp: 2000, stability: 40 },
        poem: ['Thập Diện Mai Phục Hồn Bất Cụ', 'Chân Vũ Tại Thân Chiến Bát Hoang'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'bo_thien_lang': {
        id: 'bo_thien_lang',
        name: 'Bộ Thiên Lăng',
        type: ITEM_TYPES.PHAP_BAO_PHI_HANH,
        quality: PHAP_BAO_QUALITIES.DANH_KHI,
        image: 'artifacts/bo_thien_lang.png',
        description: 'Dải lụa bước lên trời, tùy phong khởi vũ, đạp vân tiêu. Cùng cấp với [[phong_loi_si|Phong Lôi Sí]].',
        price: 1800000,
        stats: { spd: 150, luck: 20, tuViSpeed: 1.5 },
        poem: ['Lăng Vũ Cửu Thiên Tùy Phong Khởi', 'Cước Đạp Vân Tiêu Lộng Thái Hà'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_KHI }
        ]
    },
    'phong_loi_quyet': {
        id: 'phong_loi_quyet',
        name: 'Phong Lôi Quyết',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        icon: '📜',
        description: 'Bí tịch ghi chép lại tâm pháp Phong Lôi Quyết hiếm gặp, giúp tu sĩ sở hữu linh lực cuồng bạo của Lôi và tốc độ của Phong.',
        price: 500000,
        techniqueId: 'phong_loi_quyet',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'ngu_thu_nang': {
        id: 'ngu_thu_nang',
        name: 'Ngự Thú Nang',
        type: ITEM_TYPES.LINH_THU_DAI,
        icon: '👜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 500,
        description: 'Túi chuyên dụng để chứa linh thú và kỳ trùng sơ cấp. Có thể chứa tối đa 3 con.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.SUBCATEGORIES.LINH_THU_DAI }
        ]
    },
    'thien_linh_nang': {
        id: 'thien_linh_nang',
        name: 'Thiên Linh Thú Đại',
        type: ITEM_TYPES.LINH_THU_DAI,
        icon: '👜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 2500,
        description: 'Túi chứa linh thú trung cấp, được gia trì không gian trận pháp. Có thể chứa tối đa 10 con.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.SUBCATEGORIES.LINH_THU_DAI }
        ]
    },
    'can_khon_thu_gioi': {
        id: 'can_khon_thu_gioi',
        name: 'Càn Khôn Thú Giới',
        type: ITEM_TYPES.LINH_THU_DAI,
        icon: '👜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 15000,
        description: 'Túi chứa linh thú cao cấp, bên trong có linh khí nồng đậm giúp linh thú phát triển. Có thể chứa tối đa 50 con.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.KY_VAT_DI_BAO.SUBCATEGORIES.LINH_THU_DAI }
        ]
    },
    'bac_cuc_nguyen_quang_cuc_son': {
        id: 'bac_cuc_nguyen_quang_cuc_son',
        name: 'Bắc Cực Nguyên Quang Cực Sơn',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        image: 'artifacts/bac-cuc-nguyen-quang-cuc-son.webp',
        description: 'Ngọn núi kết tinh từ Bắc Cực Nguyên Quang, ánh sáng xuyên thấu vạn vật. Là một trong 5 thành phần để luyện chế [[nguyen_hop_ngu_cuc_son|Nguyên Hợp Ngũ Cực Sơn]].',
        price: 1500000,
        stats: { atk: 600, pierce: 0.5 },
        action: 'combine_ngu_cuc_son',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.TIEN_KHI }
        ]
    },
    'hao_am_han_phach_cuc_son': {
        id: 'hao_am_han_phach_cuc_son',
        name: 'Hạo Âm Hàn Phách Cực Sơn',
        type: ITEM_TYPES.PHAP_BAO_THU,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        image: 'artifacts/hao-am-han-phach-cuc-son.svg',
        description: 'Ngọn núi chứa đựng cực hạn hàn khí, đông cứng thần hồn. Là một trong 5 thành phần để luyện chế [[nguyen_hop_ngu_cuc_son|Nguyên Hợp Ngũ Cực Sơn]].',
        price: 1500000,
        stats: { def: 400, iceDmg: 200, soulRepress: 0.3 },
        action: 'combine_ngu_cuc_son',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.TIEN_KHI }
        ]
    },
    'thai_at_thanh_quang_cuc_son': {
        id: 'thai_at_thanh_quang_cuc_son',
        name: 'Thái Ất Thanh Quang Cực Sơn',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        image: 'artifacts/thai-at-thanh-quang-cuc-son.svg',
        description: 'Ngọn núi tỏa ra Thái Ất Thanh Quang, vô cùng sắc bén. Là một trong 5 thành phần để luyện chế [[nguyen_hop_ngu_cuc_son|Nguyên Hợp Ngũ Cực Sơn]].',
        price: 1500000,
        stats: { atk: 500, spd: 100 },
        action: 'combine_ngu_cuc_son',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.TIEN_KHI }
        ]
    },
    'am_duong_dai_ngu_hanh_cuc_son': {
        id: 'am_duong_dai_ngu_hanh_cuc_son',
        name: 'Âm Dương Đại Ngũ Hành Cực Sơn',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        quality: PHAP_BAO_QUALITIES.TIEN_KHI,
        image: 'artifacts/am-duong-dai-ngu-hanh-cuc-son.svg',
        description: 'Ngọn núi dung hợp Âm Dương và Ngũ Hành, cân bằng linh khí. Là một trong 5 thành phần để luyện chế [[nguyen_hop_ngu_cuc_son|Nguyên Hợp Ngũ Cực Sơn]].',
        price: 1500000,
        stats: { allRes: 0.2, tuViSpeed: 2.0 },
        action: 'combine_ngu_cuc_son',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.TIEN_KHI }
        ]
    },
    'nguyen_hop_ngu_cuc_son': {
        id: 'nguyen_hop_ngu_cuc_son',
        name: 'Nguyên Hợp Ngũ Cực Sơn',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        quality: PHAP_BAO_QUALITIES.DANH_KHI,
        image: 'artifacts/nguyen-hop-ngu-cuc-son.svg',
        description: 'Bảo vật trấn phái được hợp nhất từ: [[nguyen_tu_cuc_son|Nguyên Từ]], [[bac_cuc_nguyen_quang_cuc_son|Bắc Cực]], [[hao_am_han_phach_cuc_son|Hạo Âm]], [[thai_at_thanh_quang_cuc_son|Thái Ất]] và [[am_duong_dai_ngu_hanh_cuc_son|Âm Dương]]. Uy lực trấn áp càn khôn.',
        price: 10000000,
        stats: { atk: 3000, def: 2000, hp: 5000, pierce: 0.8, allRes: 0.5 },
        action: 'separate_ngu_cuc_son',
        poem: ['Ngũ Sơn Hợp Nhất Trấn Càn Khôn', 'Vạn Pháp Quy Nguyên Hóa Hư Không']
    },
    'trung_kim_giap_hac': {
        id: 'trung_kim_giap_hac',
        name: 'Trứng Kim Giáp Hạc',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        beastId: 'kim_giap_hac',
        image: 'aberrations/kim-giap-hac.svg',
        icon: '🥚',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 3000,
        description: 'Trứng của Kim Giáp Hạc, loài linh hạc có lớp lông cứng như kim loại, tốc độ bay cực nhanh và rất trung thành.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_LINH_THU }
        ]
    },
    'trung_huyen_diem_nga': {
        id: 'trung_huyen_diem_nga',
        name: 'Trứng Huyền Diệm Nga',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        beastId: 'huyen_diem_nga',
        image: 'aberrations/huyen-diem-nga.svg',
        icon: '🥚',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 1500,
        description: 'Trứng của Huyền Diệm Nga, loài bướm đêm mang hỏa tính, có khả năng phun ra hỏa độc gây ảo giác.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_KY_TRUNG }
        ]
    },
    'trung_loi_bang': {
        id: 'trung_loi_bang',
        name: 'Trứng Lôi Bằng',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        beastId: 'loi_bang',
        image: 'aberrations/loi-bang.svg',
        icon: '🥚',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 8000,
        description: 'Trứng của Lôi Bằng, loài chim khổng lồ mang theo sức mạnh lôi đình, khi trưởng thành có thể sải cánh vạn dặm.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_LINH_THU }
        ]
    },
    'trung_thien_phong_ngan_uynh': {
        id: 'trung_thien_phong_ngan_uynh',
        name: 'Trứng Thiên Phong Ngân Uynh',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        beastId: 'thien_phong_ngan_uynh',
        icon: '🥚',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 25000,
        description: 'Trứng của Thiên Phong Ngân Uynh, loại kỳ trùng quý hiếm bậc nhất, có khả năng xuyên thấu không gian và né tránh mọi công kích vật lý.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_KY_TRUNG }
        ]
    },
    'co_tich_thien_kiem_quyet': {
        id: 'co_tich_thien_kiem_quyet',
        name: 'Cổ Tịch Thiên Kiếm Quyết',
        image: 'items/thien_kiem_quyet',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        techniqueId: 'thien_kiem_tong_cong_phap',
        description: 'Bản sách cổ ghi chép công pháp tối cao của Thiên Kiếm Tông. Lực công kích và tốc độ bộc phát sắc bén.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.KIEM_QUYET }
        ]
    },
    'bi_tich_van_kiem_quy_tong': {
        id: 'bi_tich_van_kiem_quy_tong',
        name: 'Bí Tịch Vạn Kiếm Quy Tông',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        secretId: 'thien_kiem_tong_bi_tich',
        description: 'Mật cuộn khắc ghi bí pháp kiếm đạo tối cao của Thiên Kiếm Tông, triệu gọi cự đại kiếm trận càn quét quần hùng.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.KIEM_QUYET }
        ]
    },
    'sach_co_hoang_phong_than_sa_quyet': {
        id: 'sach_co_hoang_phong_than_sa_quyet',
        name: 'Sách Cổ Hoàng Phong Thần Sa Quyết',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        techniqueId: 'hoang_phong_coc_cong_phap',
        description: 'Bản cổ thư ghi chép Hoàng Phong Thần Sa Quyết độc quyền của Hoàng Phong Cốc, điều khiển cuồng sa bảo vệ bản tôn.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'bi_tich_hoang_phong_than_sa': {
        id: 'bi_tich_hoang_phong_than_sa',
        name: 'Bí Tịch Hoàng Phong Thần Sa',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        secretId: 'hoang_phong_coc_bi_tich',
        description: 'Cuộn bí kíp ghi chép pháp thuật cát bụi Hoàng Phong Thần Sa quấn nhiễu phong tỏa linh hồn và làm choáng đối thủ.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'co_tich_huyen_am_chan_kinh': {
        id: 'co_tich_huyen_am_chan_kinh',
        name: 'Cổ Tịch Huyền Âm Chân Kinh',
        image: 'items/huyen_am_chan_kinh',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        techniqueId: 'huyen_am_coc_cong_phap',
        description: 'U minh tà thư Huyền Âm Cốc, tu luyện tích lũy u minh khí cực thịnh bồi bổ sinh lực.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'bi_tich_huyen_am_quy_trao': {
        id: 'bi_tich_huyen_am_quy_trao',
        name: 'Bí Tịch Huyền Âm Quỷ Trảo',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        secretId: 'huyen_am_coc_bi_tich',
        description: 'Bí kíp âm sát quỷ trảo truyền kỳ của Huyền Âm Cốc, hấp thụ huyết tinh sinh mệnh kẻ địch để hồi phục Khí Huyết.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'sach_co_yem_nguyet_song_tu_quyet': {
        id: 'sach_co_yem_nguyet_song_tu_quyet',
        name: 'Sách Cổ Yểm Nguyệt Song Tu Quyết',
        image: 'items/yem_nguyet_song_tu',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        techniqueId: 'yem_nguyet_tong_cong_phap',
        description: 'Kỳ thư điều hòa âm dương nổi danh đệ nhất của Yểm Nguyệt Tông, tăng tốc tu vi vùn vụt.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'bi_tich_mi_anh_hoac_than': {
        id: 'bi_tich_mi_anh_hoac_than',
        name: 'Bí Tịch Mị Ảnh Hoặc Thần',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        secretId: 'yem_nguyet_tong_bi_tich',
        description: 'Bản mật tịch chứa đựng ảo thuật Nguyệt Minh phong bế thức thần đối phương trong 1 lượt.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'co_tich_lac_van_kiem_tran_bien': {
        id: 'co_tich_lac_van_kiem_tran_bien',
        name: 'Cổ Tịch Lạc Vân Kiếm Trận Biện',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        techniqueId: 'lac_van_tong_cong_phap',
        description: 'Phương pháp ngự kiếm kết trận Lạc Vân Tông, mộc linh hộ thể dồi dào sinh cơ.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'bi_tich_tu_cuc_than_quang': {
        id: 'bi_tich_tu_cuc_than_quang',
        name: 'Bí Tịch Tử Cực Thần Quang',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        secretId: 'lac_van_tong_bi_tich',
        description: 'Tuyệt diệu quang sát pháp nhắm thẳng vào linh thể kẻ thù, phá sạch phòng ngự giáp sắt.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'co_tich_thien_tinh_tran_phap_quyet': {
        id: 'co_tich_thien_tinh_tran_phap_quyet',
        name: 'Cổ Tịch Thiên Tinh Trận Pháp Quyết',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        techniqueId: 'thien_tinh_tong_cong_phap',
        description: 'Tuyệt kỹ trận pháp bảo vệ sơn môn danh bất hư truyền của Thiên Tinh Tông, tăng mạnh phòng thủ trận đạo.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'bi_tich_ngu_hanh_huyen_thuan': {
        id: 'bi_tich_ngu_hanh_huyen_thuan',
        name: 'Bí Tịch Ngũ Hành Huyền Thuẫn',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        secretId: 'thien_tinh_tong_bi_tich',
        description: 'Phương pháp bố trận kết thuẫn hấp thụ toàn bộ oanh kích bằng 35% máu tối đa.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'sach_co_linh_thu_van_thu_quyet': {
        id: 'sach_co_linh_thu_van_thu_quyet',
        name: 'Sách Cổ Linh Thú Vạn Thú Quyết',
        image: 'items/van_thu_quyet',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        techniqueId: 'linh_thu_son_cong_phap',
        description: 'Tâm pháp cộng sinh cùng linh thú hoang dã Linh Thú Sơn, cường tráng khí huyết.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'bi_tich_thu_huyet_cuong_bao': {
        id: 'bi_tich_thu_huyet_cuong_bao',
        name: 'Bí Tịch Thú Huyết Cuồng Bạo',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        secretId: 'linh_thu_son_bi_tich',
        description: 'Bí thuật kích hoạt ma thú linh huyết, tăng vọt công lực vật lý và hồi huyết tức thời.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'co_tich_thanh_hu_dao_nguyen_kinh': {
        id: 'co_tich_thanh_hu_dao_nguyen_kinh',
        name: 'Cổ Tịch Thanh Hư Đạo Nguyên Kinh',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        techniqueId: 'thanh_hu_mon_cong_phap',
        description: 'Mật điên tiên đạo dưỡng thần của Thanh Hư Môn, khí tức thanh khiết dồi dào mana.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'bi_tich_thanh_hu_ngoc_lo': {
        id: 'bi_tich_thanh_hu_ngoc_lo',
        name: 'Bí Tịch Thanh Hư Ngọc Lộ',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        secretId: 'thanh_hu_mon_bi_tich',
        description: 'Thuật pháp hồi linh đỉnh cấp, bổ sung 25% tối đa máu lẫn linh lực cho bản tôn.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'sach_co_cu_kiem_cuong_thiet_the': {
        id: 'sach_co_cu_kiem_cuong_thiet_the',
        name: 'Sách Cổ Cự Kiếm Cương Thiết Thể',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        techniqueId: 'cu_kiem_mon_cong_phap',
        description: 'Rèn luyện cơ bắp tráng nhục thể Cự Kiếm Môn, gia tăng cực thịnh công kích và giáp cốt.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.KIEM_QUYET }
        ]
    },
    'bi_tich_cu_kiem_tran_thien': {
        id: 'bi_tich_cu_kiem_tran_thien',
        name: 'Bí Tịch Cự Kiếm Trảm Thiên',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        secretId: 'cu_kiem_mon_bi_tich',
        description: 'Cuộn trọng kiếm thiên pháp, chém xuống sát thương cực đại và cơ hội bạo kích chí mạng cực cao.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.KIEM_QUYET }
        ]
    },
    'co_tich_hoa_dao_than_cong': {
        id: 'co_tich_hoa_dao_than_cong',
        name: 'Cổ Tịch Hóa Đao Thần Công',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        techniqueId: 'hoa_dao_o_cong_phap',
        description: 'Bộ đao pháp tối cao Hóa Đao Ổ, đao thế cuồng phong chém rách linh lực địch thủ.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'bi_tich_dao_kinh_thuong_khong': {
        id: 'bi_tich_dao_kinh_thuong_khong',
        name: 'Bí Tịch Đao Kình Thương Không',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        secretId: 'hoa_dao_o_bi_tich',
        description: 'Bí điển vung đao xé gió Hóa Đao Ổ, gây sát thương khổng lồ kèm vết rách chảy máu kinh mạch đối phương.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'co_tich_thien_khuyet_ho_the_thuan': {
        id: 'co_tich_thien_khuyet_ho_the_thuan',
        name: 'Cổ Tịch Thiên Khuyết Hộ Thể Thuẫn',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        techniqueId: 'thien_khuyet_bao_cong_phap',
        description: 'Tuyệt đỉnh hộ thể cương khí Thiên Khuyết Bảo, tạo thành lũy phòng ngự bất khả xâm phạm.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'bi_tich_thien_khuyet_kim_giap': {
        id: 'bi_tich_thien_khuyet_kim_giap',
        name: 'Bí Tịch Thiên Khuyết Kim Giáp',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        secretId: 'thien_khuyet_bao_bi_tich',
        description: 'Cuộn bí thuật hóa giáp vàng kiên cố bao bọc cơ thể, tăng mạnh 50% phòng ngự toàn diện.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'sach_co_quy_an_huyen_phap': {
        id: 'sach_co_quy_an_huyen_phap',
        name: 'Sách Cổ Quỷ Âm Huyền Pháp',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        techniqueId: 'quy_linh_mon_cong_phap',
        description: 'Bản sao tà học Quỷ Linh Môn, tăng oai lực công kích ma thuật cùng độc đạo thăng cấp nhanh.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'bi_tich_van_quy_can_xe': {
        id: 'bi_tich_van_quy_can_xe',
        name: 'Bí Tịch Vạn Quỷ Cắn Xé',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        secretId: 'quy_linh_mon_bi_tich',
        description: 'Sai khiến vạn linh âm quỷ cắn xé kinh mạch kẻ thù, rút máu và găm sâu độc tố ăn mòn.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'sach_co_an_duong_hoan_lac_quyet': {
        id: 'sach_co_an_duong_hoan_lac_quyet',
        name: 'Sách Cổ Âm Dương Hoan Lạc Quyết',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        techniqueId: 'hop_hoan_tong_cong_phap',
        description: 'Kỳ thư đoạt tinh phách điên cuồng bậc nhất của Hợp Hoan Tông, đúc tinh nguyên và tốc độ.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'bi_tich_mi_hoac_chung_sinh': {
        id: 'bi_tich_mi_hoac_chung_sinh',
        name: 'Bí Tịch Mị Hoặc Chúng Sinh',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        secretId: 'hop_hoan_tong_bi_tich',
        description: 'Hương mị mê hoặc tinh thần chúng sinh, suy giảm nặng nề tốc độ đối phương.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'co_tich_thanh_duong_ma_hoa_kinh': {
        id: 'co_tich_thanh_duong_ma_hoa_kinh',
        name: 'Cổ Tịch Thanh Dương Ma Hỏa Kinh',
        image: 'items/thanh_duong_ma_hoa_kinh',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        techniqueId: 'ma_diem_mon_cong_phap',
        description: 'Hỏa ma bí pháp thiêu rụi kinh mạch Ma Diễm Môn, công kích cực đoan vô song.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'bi_tich_u_minh_dia_hoa': {
        id: 'bi_tich_u_minh_dia_hoa',
        name: 'Bí Tịch U Minh Địa Hỏa',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        secretId: 'ma_diem_mon_bi_tich',
        description: 'Triệu hồi dung nham u minh nóng cháy, bộc phá sát thương thiêu đốt rực rỡ.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'sach_co_thien_sat_ma_quyet': {
        id: 'sach_co_thien_sat_ma_quyet',
        name: 'Sách Cổ Thiên Sát Ma Quyết',
        image: 'items/thien_sat_ma_quyet',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        techniqueId: 'thien_sat_tong_cong_phap',
        description: 'Huyết ma bá công Thiên Sát Tông, lấy huyết hóa ma sát tăng vọt sức mạnh cuồng bạo.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'bi_tich_sat_khi_xung_thien': {
        id: 'bi_tich_sat_khi_xung_thien',
        name: 'Bí Tịch Sát Khí Xung Thiên',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        secretId: 'thien_sat_tong_bi_tich',
        description: 'Cuộn bí kíp bọc nhiếp ma sát cuồng nộ, gia tăng mạnh mẽ 30% công kích vật lý.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'sach_co_van_con_ngu_trung_thuat': {
        id: 'sach_co_van_con_ngu_trung_thuat',
        name: 'Sách Cổ Vạn Côn Ngự Trùng Thuật',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        techniqueId: 'ngu_linh_tong_cong_phap',
        description: 'Bí thuật ngự trùng dưỡng độc côn độc môn Ngự Linh Tông, gia tăng máu sinh dồi dào.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'bi_tich_phe_linh_ma_trung': {
        id: 'bi_tich_phe_linh_ma_trung',
        name: 'Bí Tịch Phệ Linh Ma Trùng',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        secretId: 'ngu_linh_tong_bi_tich',
        description: 'Thả bầy trùng độc phệ linh cắn nuốt oanh tạc giáp phòng ngự đối phương.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'sach_co_khoi_loi_u_minh_kinh': {
        id: 'sach_co_khoi_loi_u_minh_kinh',
        name: 'Sách Cổ Khôi Lỗi U Minh Kinh',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        techniqueId: 'khoi_am_tong_cong_phap',
        description: 'U Linh khôi lỗi thuật pháp Khôi Âm Tông, tích lũy u minh âm khí luyện xác vững chắc.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'bi_tich_boc_pha_thi_khoi': {
        id: 'bi_tich_boc_pha_thi_khoi',
        name: 'Bí Tịch Bộc Phá Thi Khôi',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        secretId: 'khoi_am_tong_bi_tich',
        description: 'Tuyệt kỹ sai sử khôi lỗi tự bộc sát thương cực đoan xé tan giáp cốt địch thủ và gây choáng.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'ban_long_bang_ngoc_nghien': {
        id: 'ban_long_bang_ngoc_nghien',
        name: 'Bàn Long Băng Ngọc Nghiễn',
        type: ITEM_TYPES.PHAP_BAO_HON,
        image: 'artifacts/ban_long_bang_ngoc_nghien.webp',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 80000,
        description: 'Nghiễn mực cổ được chạm khắc hình rồng cuộn, bên trong ngưng tụ băng ngọc vạn năm. Khi mài mực, hàn khí tỏa ra có thể đóng băng thần thức kẻ địch.',
        stats: { spirit: 800, def: 200, maxMana: 500 },
        poem: ['Bàn Long Ngọc Nghiễn Hàn Sương Mặc', 'Nhất Bút Phong Ba Định Càn Khôn'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.LINH_BAO }
        ]
    },
    'giac_tien_bich_ngoc_cam': {
        id: 'giac_tien_bich_ngoc_cam',
        name: 'Giác Tiên Bích Ngọc Cầm',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        image: 'artifacts/giac_tien_bich_ngoc_cam.webp',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 120000,
        description: 'Cây đàn cổ bằng bích ngọc, tương truyền do tiên nhân để lại. Âm thanh phát ra có thể an định tâm thần, tăng tốc tu luyện và mê hoặc yêu thú.',
        stats: { spirit: 600, tuViSpeed: 0.15, qiAbsorb: 200 },
        poem: ['Bích Ngọc Cầm Thanh Nhập Cửu Tiêu', 'Giác Tiên Nhất Khúc Vạn Ma Tiêu'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.LINH_BAO }
        ]
    },
    'huyen_kim_long_tu_kiem': {
        id: 'huyen_kim_long_tu_kiem',
        name: 'Huyền Kim Long Tử Kiếm',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        image: 'artifacts/huyen_kim_long_tu_kiem.webp',
        quality: PHAP_BAO_QUALITIES.THONG_THIEN_LINH_BAO,
        price: 200000,
        description: 'Kiếm cổ được rèn từ huyền kim, thân kiếm khắc long văn phát sáng tử quang. Một khi rút kiếm, long khí cuồn cuộn, kiếm khí xuyên phá vạn pháp.',
        stats: { atk: 5000, spd: 300, critRate: 0.15, critDmg: 0.5 },
        poem: ['Huyền Kim Tử Khí Xung Tiêu Hán', 'Long Tử Nhất Kiếm Phá Thiên Hà'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.THONG_THIEN }
        ]
    },
    'kim_o_ly_hoa_phien': {
        id: 'kim_o_ly_hoa_phien',
        name: 'Kim Ô Ly Hỏa Phiến',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        image: 'artifacts/kim_o_ly_hoa_phien.webp',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 90000,
        description: 'Quạt phiến cổ được đúc từ lông vũ Kim Ô (quạ vàng thần thoại). Phất một cái có thể triệu hồi ly hỏa thiêu đốt vạn vật trong phạm vi rộng.',
        stats: { atk: 3500, maxMana: 300 },
        poem: ['Kim Ô Phiến Động Ly Hỏa Sinh', 'Thiên Địa Hồng Lô Luyện Quần Ma'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.CO_BAO }
        ]
    },
    'ly_ho_hieu_tien_lenh': {
        id: 'ly_ho_hieu_tien_lenh',
        name: 'Ly Hồ Hiệu Tiên Lệnh',
        type: ITEM_TYPES.PHAP_BAO_TRAN,
        image: 'artifacts/ly_ho_hieu_tien_lenh.webp',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 100000,
        description: 'Lệnh bài cổ có hình ly hồ (cáo lửa), có thể triệu hoán ảo ảnh ly hồ hỗ trợ tác chiến và bày binh bố trận cực kỳ linh hoạt.',
        stats: { spirit: 500, atk: 1500, spd: 200 },
        poem: ['Ly Hồ Hiệu Lệnh Triệu Ảo Binh', 'Tiên Đạo Trận Pháp Trấn Quần Yêu'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.LINH_BAO }
        ]
    },
    'moc_long_phap_bao': {
        id: 'moc_long_phap_bao',
        name: 'Mộc Long',
        type: ITEM_TYPES.PHAP_BAO_THU,
        image: 'artifacts/moc_long.webp',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 85000,
        description: 'Tượng mộc long cổ xưa, được chạm khắc từ thân cây thần mộc vạn năm. Có thể triệu hoán mộc long hộ thể, tăng cường phòng ngự và hồi phục sinh lực.',
        stats: { def: 2000, maxHp: 3000, lifespan: 100 },
        poem: ['Thần Mộc Hóa Long Trấn Bát Phương', 'Vạn Niên Cổ Thụ Hộ Thương Sinh'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.CO_BAO }
        ]
    },
    'ngoc_long_tuyen': {
        id: 'ngoc_long_tuyen',
        name: 'Ngọc Long Tuyền',
        type: ITEM_TYPES.PHAP_BAO_KHONG_GIAN,
        image: 'artifacts/ngoc_long_tuyen.webp',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 150000,
        description: 'Suối rồng ngọc thu nhỏ trong không gian riêng, có thể mở ra một tiểu thế giới chứa đầy linh khí thuần khiết, hỗ trợ tu luyện và bảo quản linh vật.',
        stats: { qiAbsorb: 500, tuViSpeed: 0.2, slots: 30 },
        poem: ['Ngọc Long Tuyền Dũng Linh Khí Sinh', 'Nhất Phương Tiểu Thế Giới Tàng Thiên'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.LINH_BAO }
        ]
    },
    'thien_dao_bi': {
        id: 'thien_dao_bi',
        name: 'Thiên Đạo Bi',
        type: ITEM_TYPES.PHAP_BAO_HON,
        image: 'artifacts/thien_dao_bi.webp',
        quality: PHAP_BAO_QUALITIES.THONG_THIEN_LINH_BAO,
        price: 250000,
        description: 'Bia đá cổ khắc thiên đạo chân lý, chứa đựng ngộ tính của tiền bối đại năng. Ai đọc được sẽ ngộ ra thiên đạo, thần thức tăng vọt.',
        stats: { spirit: 2000, breakthroughChance: 0.1, tuViSpeed: 0.25 },
        poem: ['Thiên Đạo Bi Văn Hàm Chân Lý', 'Đại Đạo Vô Hình Khả Ngộ Tâm'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.THONG_THIEN }
        ]
    },
    'tinh_hoa_nguyet_dai': {
        id: 'tinh_hoa_nguyet_dai',
        name: 'Tinh Hoa Nguyệt Đài',
        type: ITEM_TYPES.PHAP_BAO_PHI_HANH,
        image: 'artifacts/tinh_hoa_nguyet_dai.webp',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 95000,
        description: 'Đài nguyệt cổ ngưng tụ tinh hoa nhật nguyệt, có thể bay lượn tự do trên không trung. Ánh sáng tinh hoa bao phủ giúp tăng tốc phi hành.',
        stats: { spd: 500, def: 500, luck: 50 },
        poem: ['Tinh Hoa Nguyệt Đài Phiêu Diêu Du', 'Nhật Nguyệt Tinh Quang Chiếu Cửu Châu'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.CO_BAO }
        ]
    },
    'van_thuy_luu_ly_binh': {
        id: 'van_thuy_luu_ly_binh',
        name: 'Vạn Thủy Lưu Ly Bình',
        type: ITEM_TYPES.PHAP_BAO_THU,
        image: 'artifacts/van_thuy_luu_ly_binh.webp',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 130000,
        description: 'Bình lưu ly chứa vạn thủy, có thể hấp thu mọi công kích thủy hệ và phản hồi lại kẻ địch. Nước trong bình có tác dụng tịnh hóa tà khí.',
        stats: { def: 3000, maxHp: 2000, maxMana: 800 },
        poem: ['Vạn Thủy Lưu Ly Tịnh Thiên Địa', 'Nhất Bình Thu Tận Vạn Hà Triều'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.LINH_BAO }
        ]
    },
    'trung_giao_long': {
        id: 'trung_giao_long',
        name: 'Trứng Giao Long',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        beastId: 'giao_long',
        icon: '🥚',
        quality: PHAP_BAO_QUALITIES.THONG_THIEN_LINH_BAO,
        price: 50000,
        description: 'Trứng của Giao Long thượng cổ, vỏ trứng phủ vảy rồng phát ra thủy khí cuồn cuộn, vô cùng quý hiếm.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_LINH_THU }
        ]
    },
    'trung_hac_xa': {
        id: 'trung_hac_xa',
        name: 'Trứng Hắc Xà',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        beastId: 'hac_xa',
        icon: '🥚',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 15000,
        description: 'Trứng của Hắc Xà vạn năm, vỏ trứng đen bóng như hắc ngọc, tỏa ra kịch độc nhẹ.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_KY_TRUNG }
        ]
    },
    'trung_hoa_viem': {
        id: 'trung_hoa_viem',
        name: 'Trứng Hỏa Viêm',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        beastId: 'hoa_viem',
        icon: '🔥',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 12000,
        description: 'Trứng của Hỏa Viêm Thú, ấm nóng như hòn than, liên tục tỏa ra hỏa diễm nhỏ.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_LINH_THU }
        ]
    },
    'co_dai': {
        id: 'co_dai',
        name: 'Cỏ Dại',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🌱',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 1,
        description: 'Cỏ dại mọc ven đường, không có linh khí.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'linh_chi_tien_cao': {
        id: 'linh_chi_tien_cao',
        name: 'Linh Chi Tiên Thảo',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🍄',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 3000,
        description: 'Linh chi ngàn năm mọc trên vách núi hiểm trở, hàm chứa tinh khí đất trời, uống vào thần thức thanh minh.',
        effect: { spirit: 50, maxMana: 200 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'thien_sam': {
        id: 'thien_sam',
        name: 'Thiên Sâm Vạn Năm',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🌿',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 50000,
        description: 'Nhân sâm trời đất tích tụ linh khí vạn năm, hình người hoàn chỉnh, uống vào cải tạo cân cốt.',
        effect: { maxHp: 2000, maxMana: 1000, spirit: 200 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'han_ngoc_thach': {
        id: 'han_ngoc_thach',
        name: 'Hàn Ngọc Thạch',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '💎',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 8000,
        description: 'Đá ngọc hàn băng kết tinh từ đỉnh tuyết sơn, linh khí băng hệ cực thuần, nguyên liệu luyện đan thượng hạng.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'hoa_am_quan': {
        id: 'hoa_am_quan',
        name: 'Hỏa Âm Quán',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🌺',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Loài hoa hiếm gặp chỉ nở vào đêm hỏa diễm, cánh hoa phát nhiệt, ăn vào tăng cường hỏa linh căn.',
        effect: { atk: 100, fireRes: 0.05 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'long_huyet_thao': {
        id: 'long_huyet_thao',
        name: 'Long Huyết Thảo',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🌱',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 6000,
        description: 'Cỏ đỏ thẫm mọc nơi long mạch, trong thân cỏ chứa long huyết ngưng kết, nguyên liệu luyện đan bổ huyết.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'thien_tuyet_lien': {
        id: 'thien_tuyet_lien',
        name: 'Thiên Tuyết Liên',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '❄️',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 30000,
        description: 'Hoa sen tuyết trắng mọc giữa băng hồ, lạnh buốt xương tủy, thanh lọc kinh mạch cực hiệu.',
        effect: { maxMana: 800, spirit: 100, poisonRes: 0.1 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'ngu_sac_linh_thach': {
        id: 'ngu_sac_linh_thach',
        name: 'Ngũ Sắc Linh Thạch',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🪨',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 40000,
        description: 'Đá linh phát ra năm sắc quang, hội tụ ngũ hành tinh khí, nguyên liệu quan trọng để luyện pháp bảo ngũ hành.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'kim_tinh_thach': {
        id: 'kim_tinh_thach',
        name: 'Kim Tinh Thạch',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '✨',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 10000,
        description: 'Thiên thạch rơi xuống trần gian, cứng như thép vạn năm, kim khí vô cùng thuần chính, thích hợp luyện kiếm pháp bảo.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'phi_thien_van_chi': {
        id: 'phi_thien_van_chi',
        name: 'Phi Thiên Vân Chi',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '☁️',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 4500,
        description: 'Cành cây mộc hệ mọc trên đỉnh mây, nhẹ như vân khí, nguyên liệu chế tạo phi hành pháp bảo.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'thien_long_nha': {
        id: 'thien_long_nha',
        name: 'Thiên Long Nha',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🦷',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 80000,
        description: 'Nanh rồng trời đổ xuống, kiên cứng vô song, chứa đựng long uy, nguyên liệu luyện vũ khí thần cấp.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'bich_hue_linh_can': {
        id: 'bich_hue_linh_can',
        name: 'Bích Huệ Linh Căn',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💐',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 60000,
        description: 'Củ hoa huệ bích ngọc tàng chứa linh căn, ăn vào có cơ hội thức tỉnh Linh Căn ẩn tàng.',
        effect: { spiritRoot: 1, spirit: 500 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'tuyet_sam_linh_nhi': {
        id: 'tuyet_sam_linh_nhi',
        name: 'Tuyết Sâm Linh Nhi',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '❄️',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 35000,
        description: 'Nhân sâm tuyết có đôi mắt linh quang, đã khai mở ý thức sơ khai, tăng mạnh thần thức người dùng.',
        effect: { spirit: 300, breakthroughChance: 0.05 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'tu_vi_dan': {
        id: 'tu_vi_dan',
        name: 'Tu Vi Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💊',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 500,
        description: 'Đan dược sơ cấp giúp tăng tốc tu luyện, được bán rộng rãi ở các phường thị tu tiên.',
        effect: { tuViSpeed: 0.05 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'tru_co_dan': {
        id: 'tru_co_dan',
        name: 'Trú Cơ Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🔴',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 2000,
        description: 'Đan dược giúp tu sĩ ổn định căn cơ, cải thiện tỉ lệ đột phá khi đạt tới nút thắt cảnh giới.',
        effect: { breakthroughChance: 0.03, spirit: 30 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.DOT_PHA }
        ]
    },
    'hoi_linh_dan': {
        id: 'hoi_linh_dan',
        name: 'Hồi Linh Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💙',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1500,
        description: 'Đan dược phục hồi linh lực nhanh chóng, hương thơm dịu nhẹ, phổ biến trong giới tu sĩ.',
        effect: { mana: 500 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.HOI_PHUC }
        ]
    },
    'hoi_huyet_dan': {
        id: 'hoi_huyet_dan',
        name: 'Hồi Huyết Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '❤️',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1500,
        description: 'Đan dược phục hồi khí huyết, nguyên liệu từ long huyết thảo và linh chi, hiệu quả tức thì.',
        effect: { hp: 1000 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.HOI_PHUC }
        ]
    },
    'tuong_am_dan': {
        id: 'tuong_am_dan',
        name: 'Tướng Âm Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🟣',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 10000,
        description: 'Đan dược cấp trung tăng cường thần thức, giúp tu sĩ cảm nhận linh khí rõ ràng hơn.',
        effect: { spirit: 200, maxMana: 500 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'bach_nien_dan': {
        id: 'bach_nien_dan',
        name: 'Bách Niên Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '⚪',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        description: 'Đan dược luyện từ bách thảo trăm năm, dùng một viên kéo dài thọ mạng trăm năm.',
        effect: { lifespan: 100 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'phan_hon_dan': {
        id: 'phan_hon_dan',
        name: 'Phán Hồn Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💛',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 50000,
        description: 'Đan dược hiếm có thể cứu sống người hấp hối, khí tức mãnh liệt hồi phục toàn bộ sinh lực.',
        effect: { hp: 9999, mana: 9999 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'ngoc_thanh_dan': {
        id: 'ngoc_thanh_dan',
        name: 'Ngọc Thanh Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💚',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 45000,
        description: 'Đan dược cấp cao thanh lọc kinh mạch, phá tan tà độc, tăng vĩnh viễn linh lực căn bản.',
        effect: { maxMana: 2000, spirit: 300 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'cap_lieu_dan': {
        id: 'cap_lieu_dan',
        name: 'Cấp Liệu Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🟢',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 8000,
        description: 'Đan dược chữa thương tức thì, dùng trong chiến đấu phục hồi lượng lớn khí huyết.',
        effect: { hp: 3000 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'luyen_the_dan': {
        id: 'luyen_the_dan',
        name: 'Luyện Thể Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🔶',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Đan dược rèn luyện thể phách, uống vào cảm thấy toàn thân nóng rực, cơ bắp cứng chắc hơn.',
        effect: { maxHp: 1000, def: 50 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.LUYEN_THE }
        ]
    },
    'cat_tuong_dan': {
        id: 'cat_tuong_dan',
        name: 'Cát Tường Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🟠',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 3000,
        description: 'Đan dược khai vận may mắn, dùng trước khi lên đường mạo hiểm giúp tăng vận khí.',
        effect: { luck: 20 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'bao_luc_dan': {
        id: 'bao_luc_dan',
        name: 'Bạo Lực Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🔴',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 4000,
        description: 'Đan dược tạm thời kích thích thể phách, tăng mạnh công lực trong thời gian ngắn nhưng sau đó suy yếu.',
        effect: { atk: 200 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'thanh_linh_dan': {
        id: 'thanh_linh_dan',
        name: 'Thanh Linh Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🔵',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 25000,
        description: 'Đan dược thuần hóa linh căn, tăng vĩnh viễn tốc độ hấp thụ linh khí của tu sĩ.',
        effect: { tuViSpeed: 0.2, qiAbsorb: 300 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'tieu_hoan_dan': {
        id: 'tieu_hoan_dan',
        name: 'Tiểu Hoàn Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '⭕',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 20000,
        description: 'Đan dược đẳng cấp, có thể hồi phục đồng thời khí huyết và linh lực, dành cho tu sĩ Trúc Cơ trở lên.',
        effect: { hp: 2000, mana: 2000, spirit: 100 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'dai_huan_dan': {
        id: 'dai_huan_dan',
        name: 'Đại Hoàn Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🌀',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 80000,
        description: 'Đan dược huyền thoại, tương truyền có thể phục hồi tử mạng. Hồi phục toàn bộ trạng thái.',
        effect: { hp: 5000, mana: 5000, spirit: 500 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'nhat_duong_chi_thu': {
        id: 'nhat_duong_chi_thu',
        name: 'Nhật Dương Chi Thư',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 80000,
        techniqueId: 'nhat_duong_cong_phap',
        description: 'Thiên thư tu luyện theo nhật tinh, mỗi bình minh hấp thu dương khí, uy lực hỏa hệ tăng vọt.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'am_linh_bi_kinh': {
        id: 'am_linh_bi_kinh',
        name: 'Âm Linh Diệt Thần',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📒',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 90000,
        techniqueId: 'am_linh_cong_phap',
        description: 'Âm hệ bí pháp tối thượng, luyện âm khí hóa kiếm diệt thần hồn kẻ địch.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'hoa_van_thu': {
        id: 'hoa_van_thu',
        name: 'Hóa Vân Quyết',
        image: 'items/hoa_van_thu',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📘',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 20000,
        techniqueId: 'hoa_van_cong_phap',
        description: 'Pháp quyết hóa vân độn thuật, lướm mây phi thiên cực nhanh, tốc độ độn thân phi thường.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'luc_hop_bi_dien': {
        id: 'luc_hop_bi_dien',
        name: 'Lục Hợp Vô Song',
        image: 'items/luc_hop_bi_dien',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 100000,
        secretId: 'luc_hop_bi_tich',
        description: 'Bí điển hợp nhất lục hợp chi lực, một chiêu bao trùm thiên địa bát phương, vạn địch nan đương.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'van_kiem_bi_thu': {
        id: 'van_kiem_bi_thu',
        name: 'Vạn Kiếm Thần Thiên',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 200000,
        secretId: 'van_kiem_bi_tich',
        description: 'Cuộn bí thư kiếm đạo đỉnh cao, triệu hoán vạn kiếm cùng lúc, tạo thành kiếm trận khóa chết đối phương.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.KIEM_QUYET }
        ]
    },
    'bat_quai_chan_kinh': {
        id: 'bat_quai_chan_kinh',
        name: 'Bát Quái Huyền Công',
        image: 'items/bat_quai_chan_kinh',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📙',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 75000,
        techniqueId: 'bat_quai_cong_phap',
        description: 'Kinh sách tu luyện theo bát quái, dung hợp âm dương lưỡng nghi, phòng thủ và công kích toàn diện.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'tam_muoi_chan_hoa': {
        id: 'tam_muoi_chan_hoa',
        name: 'Tam Muội Chân Hỏa',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 85000,
        secretId: 'tam_muoi_bi_tich',
        description: 'Bí tịch luyện Tam Muội Chân Hỏa thiêu vạn vật, thậm chí có thể đốt cháy cả linh hồn đối thủ.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'co_tich_truong_sinh_quyet': {
        id: 'co_tich_truong_sinh_quyet',
        name: 'Cổ Tịch Trường Sinh Quyết',
        image: 'items/co_tich_truong_sinh_quyet',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📗',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 150000,
        techniqueId: 'truong_sinh_cong_phap',
        description: 'Bí quyết trường sinh bất lão được truyền lại từ cổ đại tiên nhân, luyện thành có thể kéo dài thọ nguyên.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'than_thong_bi_dien': {
        id: 'than_thong_bi_dien',
        name: 'Thần Thông Biến Hóa',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.THONG_THIEN_LINH_BAO,
        price: 500000,
        secretId: 'than_thong_bi_tich',
        description: 'Tuyệt thế bí điển chứa ba mươi sáu phép thần thông biến hóa, ngộ được một phép đã vô địch cõi trần.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.THAN_THONG }
        ]
    },
    'cu_que_linh_cam': {
        id: 'cu_que_linh_cam',
        name: 'Cự Quế Linh Cầm',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        icon: '🎵',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 70000,
        description: 'Đàn lớn bằng gỗ quế thần, âm thanh vang xa ngàn dặm, mỗi nốt nhạc chứa linh khí có thể trị thương và tấn công.',
        stats: { spirit: 800, atk: 500, tuViSpeed: 0.1 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.LINH_BAO }
        ]
    },
    'nhi_nghi_linh_nguyen': {
        id: 'nhi_nghi_linh_nguyen',
        name: 'Nhị Nghi Linh Nguyên Đài',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        icon: '☯️',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 110000,
        description: 'Đài âm dương lưỡng nghi, cân bằng âm dương khí trong cơ thể, gia tăng toàn diện sức chiến đấu.',
        stats: { atk: 800, def: 800, spirit: 400, maxHp: 1500 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.LINH_BAO }
        ]
    },
    'luyen_ma_kinh_tram': {
        id: 'luyen_ma_kinh_tram',
        name: 'Luyện Ma Kinh Trầm',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        icon: '🪬',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 40000,
        description: 'Trầm hương đặc biệt luyện từ ma khí và hương mộc, đốt lên khói trầm có thể ngộ độc và làm mê hoặc kẻ địch.',
        stats: { atk: 2000, poisonAtk: 300, spirit: 200 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_BAO_SUB }
        ]
    },
    'that_tinh_bao_giam': {
        id: 'that_tinh_bao_giam',
        name: 'Thất Tinh Bảo Giám',
        type: ITEM_TYPES.PHAP_BAO_THU,
        icon: '🪞',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 120000,
        description: 'Gương thần bảy sao có thể phản chiếu công kích của địch, đồng thời chiếu rõ ảo thuật và tàng hình.',
        stats: { def: 3000, spirit: 600, reflect: 0.2 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.LINH_BAO }
        ]
    },
    'thien_nham_linh_tho': {
        id: 'thien_nham_linh_tho',
        name: 'Thiên Nham Linh Thổ Ấn',
        type: ITEM_TYPES.PHAP_BAO_TRAN,
        icon: '🔏',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 55000,
        description: 'Ấn pháp bảo rèn từ đất linh thiêng đỉnh Thiên Nham, đóng ấn trận pháp cực hiệu, ổn định kết giới.',
        stats: { def: 1500, spirit: 700, stability: 50 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_BAO_SUB }
        ]
    },
    'bach_linh_hoa_lo': {
        id: 'bach_linh_hoa_lo',
        name: 'Bách Linh Hóa Lò',
        type: ITEM_TYPES.KHI_BO,
        icon: '🏮',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 65000,
        description: 'Lò luyện đan pháp bảo đúc từ bách kim linh thổ, nhiệt độ đạt đến mức luyện hóa mọi loại linh thảo.',
        stats: { craftingBonus: 0.2, alchemy: 50 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.PHAP_BAO_SUB }
        ]
    },
    'van_linh_phu_bai': {
        id: 'van_linh_phu_bai',
        name: 'Vạn Linh Phù Bài',
        type: ITEM_TYPES.PHAP_BAO_PHU_TRO,
        icon: '🀄',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 180000,
        description: 'Bộ bài phù lệnh ghi chép vạn loại linh phù, mỗi lá bài triển khai một loại pháp thuật khác nhau.',
        stats: { spirit: 1500, atk: 2000, luck: 80 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.CO_BAO }
        ]
    },
    'huyen_thien_kinh_lun': {
        id: 'huyen_thien_kinh_lun',
        name: 'Huyền Thiên Kinh Luân',
        type: ITEM_TYPES.PHAP_BAO_KHONG_GIAN,
        icon: '🌀',
        quality: PHAP_BAO_QUALITIES.THONG_THIEN_LINH_BAO,
        price: 350000,
        description: 'Pháp bảo không gian cực phẩm, bên trong chứa một tiểu thiên địa hoàn chỉnh với linh mạch và linh khí dồi dào.',
        stats: { slots: 100, tuViSpeed: 0.3, qiAbsorb: 800 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.THONG_THIEN }
        ]
    },
    'tinh_van_linh_the': {
        id: 'tinh_van_linh_the',
        name: 'Tinh Vân Linh Thể Khôi',
        type: ITEM_TYPES.PHAP_BAO_THU,
        icon: '🛡️',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 160000,
        description: 'Khôi giáp đúc từ tinh vân thạch, nhẹ nhàng như mây nhưng cứng chắc hơn mọi loại kim loại, bảo vệ toàn diện.',
        stats: { def: 5000, maxHp: 4000, spd: 100 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.LINH_BAO }
        ]
    },
    'song_long_bao_ta': {
        id: 'song_long_bao_ta',
        name: 'Song Long Bảo Tháp',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        icon: '🗼',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 220000,
        description: 'Tháp pháp bảo hình đôi rồng quấn quanh, phóng ra song long hỏa lôi kép, sát thương kinh thiên động địa.',
        stats: { atk: 6000, critRate: 0.2, critDmg: 0.8 },
        poem: ['Song Long Quán Nhật Phá Thiên Thương', 'Nhất Tháp Phi Lôi Vạn Ma Hoàng'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.CO_BAO }
        ]
    },
    'van_nien_linh_nhu': {
        id: 'van_nien_linh_nhu',
        name: 'Vạn Niên Linh Nhũ',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🥛',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 60000,
        description: 'Linh dịch ngàn năm tích tụ trong khe đá vạn thạch, ẩn chứa linh khí tinh thuần chí cực, uống vào lập tức khôi phục toàn bộ pháp lực.',
        effect: { mana: 99999 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'cuu_diep_chi': {
        id: 'cuu_diep_chi',
        name: 'Cửu Diệp Chi Thảo',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🌿',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 40000,
        description: 'Linh chi chín lá hấp thu tinh hoa nhật nguyệt cực kỳ quý hiếm, ăn vào gia tăng vĩnh viễn tốc độ tu luyện và thần thức.',
        effect: { tuViSpeed: 0.1, spirit: 100 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'bang_tuy_chi': {
        id: 'bang_tuy_chi',
        name: 'Băng Tủy Chi',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '❄️',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 75000,
        description: 'Linh chi sinh trưởng nơi vạn năm băng tuyền, hàn khí thấu cốt, dùng để tăng vọt thần thức và băng hệ kháng tính.',
        effect: { spirit: 250, coldRes: 0.08 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'khay_loi_moc': {
        id: 'khay_loi_moc',
        name: 'Kháng Lôi Mộc',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🪵',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 45000,
        description: 'Thần mộc hấp thu thiên lôi vạn năm không hủy, dùng để tẩy tủy ngọc cốt, nâng cao vĩnh viễn lôi kháng và phòng ngự.',
        effect: { def: 150, thunderRes: 0.1 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'thien_linh_qua': {
        id: 'thien_linh_qua',
        name: 'Thiên Linh Quả',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🍑',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 80000,
        description: 'Thánh quả ngàn năm mới chín một lần, tụ hợp thiên địa linh khí tinh túy nhất, dùng để tăng vĩnh viễn linh lực hấp thu và khí vận.',
        effect: { qiAbsorb: 500, luck: 15 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'ngung_oanh_dan': {
        id: 'ngung_oanh_dan',
        name: 'Ngưng Oánh Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💊',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 1200,
        description: 'Thượng phẩm đan dược của tu sĩ Luyện Khí Kỳ, hỗ trợ đột phá cảnh giới nhỏ và gia tăng nhẹ tốc độ tu luyện.',
        effect: { tuViSpeed: 0.08 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'hang_tran_dan': {
        id: 'hang_tran_dan',
        name: 'Hàng Trần Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🟡',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 15000,
        description: 'Bảo đan tuyệt tích giúp tu sĩ Trúc Cơ ngưng tụ linh khí hóa thành kim đan, tăng vọt thần thức và tỉ lệ đột phá Kết Đan.',
        effect: { breakthroughChance: 0.10, spirit: 100 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'ti_ta_dan': {
        id: 'ti_ta_dan',
        name: 'Tị Tà Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🟢',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 18000,
        description: 'Đan dược trừ tà tịch ma, bảo vệ tâm mạch, tăng cường thần thức và suy giảm tâm ma cực mạnh.',
        effect: { spirit: 150, heartDemon: -30 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'dinh_than_dan': {
        id: 'dinh_than_dan',
        name: 'Định Thần Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🔵',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 22000,
        description: 'An định thần hồn, gia tăng vĩnh viễn thần thức cùng với độ ổn định kinh mạch khi tu luyện.',
        effect: { spirit: 350, stability: 30 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'thanh_truc_phong_van_kiem': {
        id: 'thanh_truc_phong_van_kiem',
        name: 'Thanh Trúc Phong Vân Kiếm',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        icon: '🎋',
        quality: PHAP_BAO_QUALITIES.THONG_THIEN_LINH_BAO,
        price: 300000,
        image: 'items/thanh_truc_phong_van_kiem.webp',
        description: 'Thanh kiếm chí bảo rèn từ Thiên Tinh Thần Tre cùng linh tơ ong vàng, uy lực kiếm khí cuồng bạo xé rách vạn pháp.',
        stats: { atk: 12000, spd: 500, critRate: 0.25, swordDmg: 1.35 },
        poem: ['Thanh Trúc Thần Phong Đan Tiêu Nhạc', 'Vạn Kiếm Quy Tông Luyện Vạn Ma'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.THONG_THIEN }
        ]
    },
    'phong_loi_phien': {
        id: 'phong_loi_phien',
        name: 'Phong Lôi Phiến',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        icon: '🪭',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 160000,
        description: 'Chiếc quạt cổ đúc từ cánh thần điểu, một lần vung quạt dẫn động phong lôi tàn phá vạn dặm.',
        stats: { atk: 8000, spd: 300, thunderDmg: 1.25 },
        poem: ['Phong Lôi Nhất Phất Thiên Địa Động', 'Vạn Kiếp Cuồng Lôi Thiêu Cực Ma'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.CO_BAO }
        ]
    },
    'than_hoang_giap': {
        id: 'than_hoang_giap',
        name: 'Thần Hoàng Giáp',
        type: ITEM_TYPES.PHAP_BAO_THU,
        icon: '🥋',
        quality: PHAP_BAO_QUALITIES.THONG_THIEN_LINH_BAO,
        price: 350000,
        description: 'Hộ thân giáp y đúc từ kim hỏa thần tủy cực kỳ kiên cố, đem lại sinh lực dồi dào cùng phòng ngự bất phàm.',
        stats: { def: 12000, maxHp: 15000, damageReduction: 0.25 },
        poem: ['Thần Hoàng Chiến Giáp Hộ Nguyên Thần', 'Linh Quang Vạn Trượng Kính Thiên Binh'],
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.THONG_THIEN }
        ]
    },
    'thiet_moc_bach_nien': {
        id: 'thiet_moc_bach_nien',
        name: 'Thiết Mộc Trăm Năm',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🪵',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1000,
        description: 'Thân gỗ của Thiết Mộc thụ thọ mệnh vài trăm năm, cứng chắc như sắt thép. Vật liệu chính để luyện khôi lỗi thời kỳ Trúc Cơ của Hàn Lập.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'thiet_moc_van_nam': {
        id: 'thiet_moc_van_nam',
        name: 'Thiết Mộc Vạn Năm',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🪵',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 8000,
        description: 'Thiết Mộc linh thụ tích lũy linh lực vạn năm cực kỳ trân quý, dẻo dai và dẫn linh tính tuyệt hảo. Vật liệu để luyện khôi lỗi Nguyên Anh kỳ.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'hoa_linh_thach_trung': {
        id: 'hoa_linh_thach_trung',
        name: 'Hỏa Linh Thạch Trung Giai',
        type: ITEM_TYPES.LINH_THACH,
        grade: 'TRUNG',
        attribute: 'FIRE',
        icon: '🔥',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 500,
        weight: 0.02,
        description: 'Linh thạch trung giai thuộc tính Hỏa tinh thuần, chứa hỏa nguyên lực dồi dào. Dùng làm lõi năng lượng cho Cự Hổ Khôi Lỗi.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_KHOANG, subSubcategory: 'tinh_thach' }
        ]
    },
    'dai_dien_quyet': {
        id: 'dai_dien_quyet',
        name: 'Đại Diễn Quyết',
        image: 'items/dai_dien_quyet',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📔',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 8000,
        techniqueId: 'dai_dien_quyet',
        description: 'Bí thuật do tổ sư khai phái của Thiên Trúc Giáo Đại Diễn Thần Quân tự sáng tạo, chuyên dùng để tăng cường thần thức và tu luyện phân thần thuật. Là công pháp bắt buộc để điều khiển nhiều khôi lỗi.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'khoi_loi_chan_giai': {
        id: 'khoi_loi_chan_giai',
        name: 'Khôi Lỗi Chân Giải',
        type: ITEM_TYPES.SACH_CONG_PHAP,
        icon: '📖',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 15000,
        description: 'Bộ bách khoa toàn thư cực kỳ chi tiết về chế tạo khôi lỗi của Thiên Trúc Giáo, dạy cách luyện chế các cấp khôi lỗi thú và khôi lỗi nhân.',
        effect: {
            type: EFFECT_TYPES.HOC_NHIEU_CONG_THUC,
            value: [
                { type: EFFECT_TYPES.MO_KHOA_NGHE, profession: 'puppet' },
                { type: EFFECT_TYPES.HOC_CONG_THUC_KHOI_LOI, value: 'thanh_vien_khoi_loi' },
                { type: EFFECT_TYPES.HOC_CONG_THUC_KHOI_LOI, value: 'cu_ho_khoi_loi' }
            ]
        },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'ban_ve_thanh_vien_khoi_loi': {
        id: 'ban_ve_thanh_vien_khoi_loi',
        name: 'Bản Vẽ Thanh Viên Khôi Lỗi',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 5000,
        description: 'Hướng dẫn chế tạo Thanh Viên Khôi Lỗi Trúc Cơ cấp từ Thiết Mộc Trăm Năm.',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_KHOI_LOI, value: 'thanh_vien_khoi_loi' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_KHI.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_KHI.SUBCATEGORIES.BAN_VE }
        ]
    },
    'ban_ve_cu_ho_khoi_loi': {
        id: 'ban_ve_cu_ho_khoi_loi',
        name: 'Bản Vẽ Cự Hổ Khôi Lỗi',
        type: ITEM_TYPES.DAN_PHUONG,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 15000,
        description: 'Hướng dẫn chế tạo Cự Hổ Khôi Lỗi khổng lồ bắn ra cột sáng cực mạnh.',
        effect: { type: EFFECT_TYPES.HOC_CONG_THUC_KHOI_LOI, value: 'cu_ho_khoi_loi' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_KHI.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_KHI.SUBCATEGORIES.BAN_VE }
        ]
    },
    'hu_tien_lenh': {
        id: 'hu_tien_lenh',
        name: 'Hư Tiên Lệnh',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🔑',
        quality: PHAP_BAO_QUALITIES.LINH_BAO,
        price: 80000,
        image: 'items/hu_tien_lenh.webp',
        description: 'Tấm lệnh bài cổ xưa tỏa ra dao động không gian huyền ảo, là chìa khóa mở lối vào Hư Thiên Điện chứa Hư Thiên Đỉnh.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'truyen_tin_hac': {
        id: 'truyen_tin_hac',
        name: 'Truyền Tin Hạc',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🕊️',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 150,
        image: 'items/truyen_tin_hac.webp',
        description: 'Linh hạc gấp từ phù giấy chứa một luồng ý niệm, chuyên dùng để truyền tin tức giữa các tu sĩ cách xa vạn dặm. Sử dụng hồi phục ngay lập tức 10 Thể lực.',
        effect: { type: EFFECT_TYPES.HOI_PHUC, stamina: 10 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'phuong_hoa_lu': {
        id: 'phuong_hoa_lu',
        name: 'Phượng Hoa Lư',
        type: ITEM_TYPES.DAN_LU,
        icon: '🏺',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 75000,
        image: 'items/phuong_hoa_lu.webp',
        description: 'Lò luyện đan thượng cấp khắc hình phượng hoàng lửa sinh động như thật, có thể bảo toàn dược tính của linh thảo tuyệt đối.',
        effect: { type: EFFECT_TYPES.TRANG_BI_DAN_LU, value: 'phuong_hoa_lu' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_DAN.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_DAN.SUBCATEGORIES.DAN_LU }
        ]
    },
    'o_minh_ty': {
        id: 'o_minh_ty',
        name: 'Ô Minh Ty',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🕸️',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1500,
        image: 'items/o_minh_ty.webp',
        description: 'Sợi tơ đen nhánh dẻo dai sinh ra từ tằm ô minh sống nơi u tối, là vật liệu thượng hạng để luyện chế khôi lỗi cao cấp hoặc dệt hộ giáp.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'trung_hac_thiet_loi_thu': {
        id: 'trung_hac_thiet_loi_thu',
        name: 'Trứng Hắc Thiết Lôi Thú',
        type: ITEM_TYPES.TRUNG_LINH_THU,
        beastId: 'hac_thiet_loi_thu',
        icon: '🥚',
        quality: LINH_THU_QUALITIES.THIEN_CAP,
        price: 25000,
        description: 'Trứng của Hắc Thiết Lôi Thú thượng cổ, bao quanh bởi những tia lôi điện đen kịt lách tách kêu gào.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LINH_THU.KEY, subcategory: ITEM_CATEGORIES_ENUM.LINH_THU.SUBCATEGORIES.TRUNG_LINH_THU }
        ]
    },

    // --- BỔ SUNG CÁC LINH THẢO & LINH DƯỢC & HẠT GIỐNG MỚI (PHÀM NHÂN TU TIÊN LORE) ---
    'linh_thao_cao': {
        id: 'linh_thao_cao',
        name: 'Tử Nguyệt Thảo',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🌙',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 1500,
        description: 'Tử Nguyệt Thảo, một loại linh thảo cao cấp hiếm gặp ở Nhân giới, hình dáng giống như vầng trăng khuyết màu tím phát ra ánh sáng lung linh.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'linh_chung_ngoc_de_hoa': {
        id: 'linh_chung_ngoc_de_hoa',
        name: 'Linh Chủng Ngọc Đề Hoa',
        type: ITEM_TYPES.LINH_CHUNG,
        icon: '🌱',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 30,
        description: 'Hạt giống của Ngọc Đề Hoa, loại thảo dược cấp thấp có dược tính cực kỳ ôn hòa, dễ trồng.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_DUOC, subSubcategory: 'duoi_100_nam' }
        ]
    },
    'ngoc_de_hoa': {
        id: 'ngoc_de_hoa',
        name: 'Ngọc Đề Hoa',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🌸',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 100,
        description: 'Ngọc Đề Hoa, đóa hoa trắng ngần như ngọc, có tác dụng điều hòa tính nhiệt trong lò luyện đan, ổn định hỏa hầu.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'linh_chung_thanh_long_sam': {
        id: 'linh_chung_thanh_long_sam',
        name: 'Linh Chủng Thanh Long Sâm',
        type: ITEM_TYPES.LINH_CHUNG,
        icon: '🌱',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 120,
        description: 'Linh chủng của Thanh Long Sâm, đòi hỏi linh điền dồi dào sinh cơ (Mộc thuộc tính).',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_DUOC, subSubcategory: 'duoi_100_nam' }
        ]
    },
    'thanh_long_sam': {
        id: 'thanh_long_sam',
        name: 'Thanh Long Sâm',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🐉',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 450,
        description: 'Thanh Long Sâm, củ nhân sâm có hình thù giống như rồng xanh uốn lượn, chứa mộc thuộc tính linh khí vô cùng tinh thuần.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'linh_chung_tuyet_oanh_thao': {
        id: 'linh_chung_tuyet_oanh_thao',
        name: 'Linh Chủng Tuyết Oánh Thảo',
        type: ITEM_TYPES.LINH_CHUNG,
        icon: '❄️',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 150,
        description: 'Linh chủng của Tuyết Oánh Thảo, chỉ có thể nảy mầm và sinh trưởng nơi linh điền cực hàn (Băng thuộc tính).',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_DUOC, subSubcategory: 'duoi_100_nam' }
        ]
    },
    'tuyet_oanh_thao': {
        id: 'tuyet_oanh_thao',
        name: 'Tuyết Oánh Thảo',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '❄️',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 500,
        description: 'Tuyết Oánh Thảo, loài linh cỏ mọc trên vách núi tuyết vạn năm, lấp lánh như sương tuyết, có tác dụng thanh tẩy kinh mạch, xua tan đan độc.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_DICH, subSubcategory: 'thien_dia' }
        ]
    },
    'linh_chung_hoa_duong_chi': {
        id: 'linh_chung_hoa_duong_chi',
        name: 'Linh Chủng Hỏa Dương Chi',
        type: ITEM_TYPES.LINH_CHUNG,
        icon: '🔥',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 180,
        description: 'Linh chủng của Hỏa Dương Chi, cần gieo trồng ở linh điền nóng bỏng hỏa khí (Hỏa thuộc tính).',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_DUOC, subSubcategory: 'duoi_100_nam' }
        ]
    },
    'hoa_duong_chi': {
        id: 'hoa_duong_chi',
        name: 'Hỏa Dương Chi',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🍄',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 600,
        description: 'Hỏa Dương Chi, loại nấm linh chi rực đỏ như than hồng, chứa đựng lượng lớn nhiệt năng và hỏa linh lực dồi dào.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'linh_chung_cuu_tich_chi': {
        id: 'linh_chung_cuu_tich_chi',
        name: 'Linh Chủng Cửu Tịch Chi',
        type: ITEM_TYPES.LINH_CHUNG,
        icon: '💀',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 250,
        description: 'Linh chủng của Cửu Tịch Chi, chỉ nảy mầm trong âm khí dày đặc (Âm Minh thuộc tính).',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_DUOC, subSubcategory: 'duoi_100_nam' }
        ]
    },
    'cuu_tich_chi': {
        id: 'cuu_tich_chi',
        name: 'Cửu Tịch Chi',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🪨',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 800,
        description: 'Cửu Tịch Chi, nấm linh chi đen mọc trong những hang động âm u sâu dưới lòng đất, tích lũy dồi dào u minh âm khí.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'tieu_dao_qua': {
        id: 'tieu_dao_qua',
        name: 'Tiêu Dao Quả',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🍑',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 350,
        description: 'Tiêu Dao Quả, quả linh ngọt lành ngậm đầy thiên địa tinh hoa. Khi ăn giúp tu sĩ lập tức phục hồi 40 điểm Thể Lực và gia tăng nhẹ tốc độ tu luyện trong 1 giờ.',
        effect: { type: EFFECT_TYPES.HOI_PHUC, stamina: 40, buff: { stat: 'tuViSpeed', value: 1.15, duration: 3600 } },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.TU_LUYEN }
        ]
    },
    'huyet_lien_hoa': {
        id: 'huyet_lien_hoa',
        name: 'Huyết Liên Hoa',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🪷',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 2000,
        description: 'Huyết Liên Hoa, đóa sen đỏ thẫm sinh trưởng nơi đầm lầy đẫm huyết khí của đại yêu thú, chứa sinh cơ lực lượng vô cùng cuồng bạo.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'that_tinh_thao': {
        id: 'that_tinh_thao',
        name: 'Thất Tinh Thảo',
        type: ITEM_TYPES.NGUYEN_LIEU,
        icon: '🌿',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 2200,
        description: 'Thất Tinh Thảo, loại cỏ linh thảo có bảy chiếc lá sắp xếp tựa như chòm sao Bắc Đẩu, chuyên hấp thụ tinh quang tinh hoa ban đêm để nuôi dưỡng thần thức.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'ngoc_de_dan': {
        id: 'ngoc_de_dan',
        name: 'Ngọc Đề Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💊',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 450,
        description: 'Ngọc Đề Đan, viên linh đan sơ cấp dược tính vô cùng ôn hòa. Khi sử dụng trước khi đột phá, giúp gia tăng 5% tỷ lệ đột phá thành công ở Luyện Khí cảnh.',
        stats: { breakthroughChance: 0.05 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.DOT_PHA }
        ]
    },
    'hoa_duong_dan': {
        id: 'hoa_duong_dan',
        name: 'Hỏa Dương Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🔥',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1800,
        description: 'Hỏa Dương Đan, viên linh đan rực lửa giúp tu sĩ kích phát kinh mạch hỏa hệ. Sử dụng gia tăng 15% hỏa thuộc tính sát thương trong 3 trận đấu tiếp theo.',
        effect: { type: EFFECT_TYPES.BUFF_TAM_THOI, stat: 'fire_dmg_pct', value: 0.15, duration: 3 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.KHAC }
        ]
    },
    'hoi_linh_dan': {
        id: 'hoi_linh_dan',
        name: 'Hồi Linh Đan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '🧪',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 300,
        description: 'Hồi Linh Đan, đan dược phổ thông giúp hồi phục nhanh chóng 80 điểm Linh Lực ngay lập tức.',
        effect: { type: EFFECT_TYPES.HOI_PHUC, mana: 80 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.HOI_PHUC }
        ]
    },

    // ===================================================================
    // --- VẬT PHẨM MỚI (THÊM TỪ ẢNH) ---
    // ===================================================================

    // --- KHOÁN THẠCH MỚI ---
    'kim_linh_thach': {
        id: 'kim_linh_thach',
        name: 'Kim Linh Thạch',
        image: 'items/kim_linh_thach',
        type: ITEM_TYPES.LINH_KHOANG,
        icon: '✨',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 500,
        weight: 0.05,
        description: 'Khoáng thạch đen huyền với ánh vàng bùng nổ như ngôi sao. Chứa đựng kim linh khí cực kỳ thuần khiết, là nguyên liệu hiếm để luyện chế pháp khí kim hệ.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_KHOANG, subSubcategory: 'di_khoang' }
        ]
    },

    // --- LINH DƯỢC MỚI ---
    'ngoc_dich': {
        id: 'ngoc_dich',
        name: 'Ngọc Dịch',
        image: 'items/ngoc_dich',
        type: ITEM_TYPES.LINH_DUOC,
        icon: '🍶',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 800,
        description: 'Tinh dịch ngọc thuần, chứa đựng linh khí tinh luyện nhiều trăm năm. Uống vào tức thì khai thông kinh mạch, hồi phục 300 điểm Linh Lực.',
        effect: { type: EFFECT_TYPES.HOI_PHUC, mana: 300 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_DICH }
        ]
    },
    'thit_yeu_thu': {
        id: 'thit_yeu_thu',
        name: 'Thịt Yêu Thú',
        image: 'items/thit_yeu_thu',
        type: ITEM_TYPES.LINH_DUOC,
        icon: '🥩',
        quality: PHAP_BAO_QUALITIES.PHAM_KHI,
        price: 30,
        description: 'Thịt tươi của yêu thú hoang dã. Tuy không phải linh vật cao cấp nhưng chứa một ít yêu khí, ăn vào hồi phục 50 HP và tăng nhẹ thể lực.',
        effect: { type: EFFECT_TYPES.HOI_PHUC, hp: 50 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.YEU_THU }
        ]
    },
    'linh_moc_bach': {
        id: 'linh_moc_bach',
        name: 'Bạch Ngân Linh Mộc',
        image: 'items/linh_moc_bach',
        type: ITEM_TYPES.LINH_MOC,
        icon: '🌿',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 600,
        weight: 0.3,
        description: 'Khúc gỗ bạch ngân đã hóa linh sau trăm năm, toát ra linh khí lạnh giá. Là nguyên liệu quý để luyện chế đan dược tăng cường mộc hệ linh căn.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_MOC }
        ]
    },
    'kim_linh_moc': {
        id: 'kim_linh_moc',
        name: 'Kim Linh Cổ Mộc',
        image: 'items/kim_linh_moc',
        type: ITEM_TYPES.LINH_MOC,
        icon: '🌳',
        quality: PHAP_BAO_QUALITIES.PHAP_BAO,
        price: 8000,
        weight: 1.0,
        description: 'Cổ thụ linh mộc ngàn năm tỏa ánh vàng rực rỡ. Rễ cây cắm sâu vào huyệt mạch linh khí địa cầu, bản thân cây đã hấp thụ vô lượng kim linh chi khí.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'dao_hoa_tien_thao': {
        id: 'dao_hoa_tien_thao',
        name: 'Đào Hoa Tiên Thảo',
        image: 'items/dao_hoa_tien_thao',
        type: ITEM_TYPES.LINH_MOC,
        icon: '🍑',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 50000,
        weight: 0.5,
        description: 'Cây đào tiên vàng kim cực phẩm, kết trái sau nghìn năm tu luyện. Quả đào chứa đựng nguyên khí thiên địa, có thể tăng tuổi thọ và khai mở thần thức.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.THIEN_TAI }
        ]
    },
    'tinh_hoa_dao': {
        id: 'tinh_hoa_dao',
        name: 'Tinh Hỏa Đào',
        image: 'items/tinh_hoa_dao',
        type: ITEM_TYPES.LINH_DUOC,
        icon: '🌺',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 1500,
        description: 'Đóa hoa kỳ lạ hội tụ hỏa linh khí và băng linh khí, cánh hoa màu xanh tím, nhụy hoa rực lửa. Là nguyên liệu chế đan dược lưỡng hệ hỏa-băng.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_DUOC }
        ]
    },
    'han_ngoc_tuy': {
        id: 'han_ngoc_tuy',
        name: 'Hàn Ngọc Tủy',
        image: 'items/han_ngoc_tuy',
        type: ITEM_TYPES.LINH_DUOC,
        icon: '🪸',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 2000,
        description: 'San hô trắng ngọc nơi đáy biển lạnh, thấm đẫm băng hàn chi khí nghìn năm. Nghiền thành bột làm nguyên liệu đan dược băng hệ thượng phẩm.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.KEY, subcategory: ITEM_CATEGORIES_ENUM.NGUYEN_LIEU.SUBCATEGORIES.LINH_DUOC }
        ]
    },

    // --- PHÁP BẢO MỚI ---
    'huyet_long_dao': {
        id: 'huyet_long_dao',
        name: 'Huyết Long Đao',
        image: 'items/huyet_long_dao',
        type: ITEM_TYPES.PHAP_BAO_CONG,
        icon: '🗡️',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 80000,
        description: 'Đao thần đúc từ xương long của Huyết Long cổ đại, thân đao khắc long vân huyền bí, dải lụa đỏ quấn quanh tỏa ra sát khí ngút trời. Mỗi nhát chém mang theo huyết long chi uy.',
        stats: { atk: 350, critChance: 0.12, critDmg: 1.8 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.CO_BAO }
        ]
    },
    'than_long_giap': {
        id: 'than_long_giap',
        name: 'Thần Long Giáp',
        image: 'items/than_long_giap',
        type: ITEM_TYPES.GIAP_BAO,
        icon: '🛡️',
        quality: PHAP_BAO_QUALITIES.CO_BAO,
        price: 75000,
        description: 'Áo giáp linh thần đúc từ vảy long, khắc đầy linh văn bảo hộ xanh lam rực sáng. Mặc vào thân tỏa ra khí tức thần long, tăng mạnh phòng ngự và kháng pháp thuật.',
        stats: { def: 400, magicRes: 0.25, hp: 2000 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.PHAP_BAO.KEY, subcategory: ITEM_CATEGORIES_ENUM.PHAP_BAO.SUBCATEGORIES.CO_BAO }
        ]
    },

    // --- ĐAN DƯỢC MỚI ---
    'linh_cuong_dan': {
        id: 'linh_cuong_dan',
        name: 'Linh Cương Đan',
        image: 'items/linh_cuong_dan',
        type: ITEM_TYPES.DAN_DUOC,
        icon: '💊',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 1200,
        description: 'Hộp đan dược hội tụ linh khí xanh ngọc, mỗi viên nhỏ như hạt ngọc. Dùng để cường hóa thể phách, tăng 200 HP tối đa trong một khoảng thời gian dài.',
        effect: { type: EFFECT_TYPES.BUFF_TAM_THOI, stat: 'maxHp', value: 200, duration: 10 },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.DAN_DUOC.KEY, subcategory: ITEM_CATEGORIES_ENUM.DAN_DUOC.SUBCATEGORIES.LUYEN_THE }
        ]
    },

    // --- ĐAN LƯ MỚI ---
    'cu_bao_lu': {
        id: 'cu_bao_lu',
        name: 'Cổ Bảo Lư',
        image: 'items/cu_bao_lu',
        type: ITEM_TYPES.DAN_LU,
        icon: '🏺',
        quality: PHAP_BAO_QUALITIES.PHAP_KHI,
        price: 2500,
        description: 'Đỉnh luyện đan cổ xưa bằng đồng vàng, tay cầm chạm khắc phượng hoàng, nắp đậy tinh xảo. Tuy kích thước nhỏ nhưng hiệu suất luyện đan ổn định, phù hợp đan sư trung cấp.',
        effect: { type: EFFECT_TYPES.TRANG_BI_DAN_LU, value: 'cu_bao_lu' },
        categories: [
            { category: ITEM_CATEGORIES_ENUM.LUYEN_DAN.KEY, subcategory: ITEM_CATEGORIES_ENUM.LUYEN_DAN.SUBCATEGORIES.DAN_LU }
        ]
    },

    // --- VẬT PHẨM NGỌC GIẢN ---
    'ngoc_gian': {
        id: 'ngoc_gian',
        name: 'Ngọc Giản',
        image: 'items/ngoc_gian',
        type: ITEM_TYPES.NGOC_GIAN,
        icon: '📜',
        quality: PHAP_BAO_QUALITIES.LINH_KHI,
        price: 3000,
        description: 'Thẻ giản khắc bằng linh mộc quý, buộc dây lụa xanh ngọc. Bên trong khắc ghi bí pháp cổ đại, có thể dùng để học tập hoặc truyền thụ tri thức tu luyện.',
        categories: [
            { category: ITEM_CATEGORIES_ENUM.CONG_PHAP.KEY, subcategory: ITEM_CATEGORIES_ENUM.CONG_PHAP.SUBCATEGORIES.TU_LUYEN }
        ]
    }
};

export const getItemById = (id) => ITEMS[id];

