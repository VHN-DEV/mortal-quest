export const ITEMS = {
    // Tiêu hao
    'tu_vi_dan_so': {
        id: 'tu_vi_dan_so',
        name: 'Tu Vi Đan (Sơ)',
        type: 'consumable',
        icon: '💊',
        quality: 'Hoàng',
        price: 50,
        description: 'Đan dược giúp tăng nhẹ tu vi cho tu sĩ Luyện Khí.',
        effect: { type: 'tu_vi', value: 100 }
    },
    'linh_thao_thap': {
        id: 'linh_thao_thap',
        name: 'Linh Thảo (Thấp)',
        type: 'material',
        icon: '🌿',
        quality: 'Phàm',
        price: 10,
        description: 'Nguyên liệu cơ bản để luyện chế các loại đan dược.'
    },
    'truc_co_dan': {
        id: 'truc_co_dan',
        name: 'Trúc Cơ Đan',
        type: 'consumable',
        quality: 'Huyền',
        icon: '💎',
        description: 'Đan dược cần thiết để đột phá Trúc Cơ Kỳ.',
        price: 5000,
        stats: { breakthroughRate: 0.2 }
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

    // Trang bị (Mới)
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
    }
};

export const getItemById = (id) => ITEMS[id];
