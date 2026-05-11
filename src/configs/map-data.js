export const WORLDS = {
    'nhan_gioi': {
        name: 'Phàm Trần Giới',
        minRealm: 1,
        description: 'Vùng đất của phàm nhân và các tu sĩ bắt đầu con đường nghịch thiên.',
        locations: [
            {
                id: 'van_thu_lam',
                name: 'Vạn Thú Chi Lâm',
                minRealm: 1,
                danger: 'Hạ Cấp',
                image: 'assets/images/locations/van_thu_lam.png',
                description: 'Nơi yêu thú sơ cấp hoành hành, đầy rẫy linh thảo thiên nhiên.',
                resources: ['Linh Thảo', 'Yêu Đan Hạ Phẩm'],
                energies: [{ type: 'linh_khi', element: 'Mộc', concentration: 15, purity: 'TINH_THUAN' }, { type: 'yeu_khi', concentration: 20, purity: 'TAP' }, { type: 'sinh_khi', concentration: 5, purity: 'TINH_THUAN' }],
                eventProbs: { combat: 0.4, loot: 0.3, npc: 0.1, empty: 0.2 }
            },
            {
                id: 'loan_tinh_hai',
                name: 'Loạn Tinh Hải',
                minRealm: 1,
                danger: 'Hạ Cấp',
                image: 'assets/images/locations/loan_tinh_hai.png',
                description: 'Vùng biển hỗn loạn với vô số đảo nhỏ và yêu thú thủy tộc.',
                resources: ['Thủy Tinh', 'Linh Thạch Hạ Phẩm'],
                energies: [{ type: 'linh_khi', element: 'Thủy', concentration: 20, purity: 'TINH_THUAN' }],
                eventProbs: { combat: 0.3, loot: 0.2, npc: 0.1, empty: 0.4 }
            },
            {
                id: 'thien_kiem_tong',
                name: 'Thiên Kiếm Thánh Tông',
                minRealm: 5,
                danger: 'An Toàn',
                image: 'assets/images/locations/thien_kiem_tong.png',
                description: 'Kiếm đạo thánh địa, nơi vạn kiếm quy tông.',
                resources: ['Kiếm Ý', 'Linh Khoáng'],
                energies: [{ type: 'kiem_khi', concentration: 60, purity: 'CUC_PHAM' }, { type: 'linh_khi', element: 'Kim', concentration: 30, purity: 'TINH_THUAN' }, { type: 'hao_nhien_chinh_khi', concentration: 10, purity: 'TINH_THUAN' }],
                eventProbs: { combat: 0.1, loot: 0.1, npc: 0.5, empty: 0.3 }
            },
            {
                id: 'huyen_am_coc',
                name: 'Huyền Âm Ma Cốc',
                minRealm: 10,
                danger: 'Trung Cấp',
                image: 'assets/images/locations/huyen_am_coc.png',
                description: 'U ám tà khí, nơi ma tu thường xuyên ẩn nấp phục kích.',
                resources: ['Âm Sát', 'Ma Thạch'],
                energies: [{ type: 'ma_khi', concentration: 80, purity: 'TINH_THUAN' }, { type: 'tu_khi', concentration: 40, purity: 'TAP' }, { type: 'hon_khi', concentration: 10, purity: 'TAP' }],
                eventProbs: { combat: 0.5, loot: 0.2, npc: 0.1, empty: 0.2 }
            },
            {
                id: 'van_bao_cac',
                name: 'Vạn Bảo Các',
                minRealm: 1,
                danger: 'An Toàn',
                image: 'assets/images/locations/van_bao_cac.png',
                description: 'Thương hội liên giới, nơi có mọi thứ mà tu sĩ cần.',
                resources: ['Đan Dược', 'Pháp Bảo'],
                eventProbs: { combat: 0.0, loot: 0.0, npc: 0.8, empty: 0.2 }
            },
            {
                id: 'cong_hoi_luyen_duoc',
                name: 'Công Hội Luyện Dược Sư',
                minRealm: 1,
                danger: 'An Toàn',
                image: 'assets/images/locations/cong_hoi_luyen_duoc.png',
                description: 'Nơi quản lý và cấp chứng nhận cho các Luyện Dược Sư.',
                resources: ['Đan Phương', 'Linh Thảo'],
                eventProbs: { combat: 0.0, loot: 0.0, npc: 0.7, empty: 0.3 },
                special: 'guild'
            },
            {
                id: 'thap_van_dai_son',
                name: 'Thập Vạn Đại Sơn',
                minRealm: 1,
                danger: 'Cực Kỳ Nguy Hiểm',
                image: 'assets/images/locations/thap_van_dai_son.png',
                description: 'Dãy núi cổ vô tận, nơi chôn giấu bí mật thời thượng cổ.',
                resources: ['Yêu Đan', 'Linh Dược Cổ'],
                energies: [{ type: 'yeu_khi', concentration: 80, purity: 'CUC_PHAM' }, { type: 'sinh_khi', concentration: 15, purity: 'TINH_THUAN' }],
                eventProbs: { combat: 0.5, loot: 0.2, npc: 0.1, empty: 0.2 },
                special: 'mountain'
            }
        ]
    },
    'linh_gioi': {
        name: 'Linh Tiên Giới',
        minRealm: 30,
        description: 'Vùng đất của linh khí tinh thuần, nơi cường giả tụ hội.',
        locations: [
            {
                id: 'linh_vuc_thanh_dia',
                name: 'Thượng Cổ Linh Vực',
                minRealm: 30,
                danger: 'Cao Cấp',
                image: 'assets/images/locations/linh_vuc_thanh_dia.png',
                description: 'Di tích cổ đại with linh khí đậm đặc gấp bội.',
                resources: ['Linh Thạch Trung Phẩm', 'Cổ Bảo'],
                energies: [{ type: 'linh_khi', concentration: 100, purity: 'CUC_PHAM' }],
                eventProbs: { combat: 0.4, loot: 0.3, npc: 0.2, empty: 0.1 }
            },
            {
                id: 'dan_thap',
                name: 'Thánh Địa Đan Tháp',
                minRealm: 30,
                danger: 'An Toàn',
                image: 'assets/images/locations/dan_thap.png',
                description: 'Nơi cao nhất của Đan Đạo, hội tụ các bậc đại sư.',
                resources: ['Tiên Đan', 'Dị Hỏa Chi Lực'],
                eventProbs: { combat: 0.0, loot: 0.0, npc: 0.9, empty: 0.1 },
                special: 'tower'
            },
            {
                id: 'thoi_khong_bi_canh',
                name: 'Thời Không Bí Cảnh',
                minRealm: 30,
                danger: 'Trung Cấp',
                image: 'assets/images/locations/thoi_khong_bi_canh.png',
                description: 'Nơi quy luật thời gian bị bẻ cong, một ngày bên trong bằng mười ngày bên ngoài.',
                resources: ['Thời Không Tinh Thạch'],
                energies: [{ type: 'khong_gian_chi_khi', concentration: 30, purity: 'CUC_PHAM' }, { type: 'thoi_gian_chi_khi', concentration: 10, purity: 'DAO' }],
                eventProbs: { combat: 0.3, loot: 0.4, npc: 0.1, empty: 0.2 },
                timeRate: 10
            }
        ]
    },
    'tien_gioi': {
        name: 'Thượng Cổ Tiên Giới',
        minRealm: 42,
        description: 'Đỉnh cao của chư thiên vạn giới.',
        locations: [
            {
                id: 'cuu_trong_thien',
                name: 'Cửu Trọng Thiên Khuyết',
                minRealm: 42,
                danger: 'Tử Địa',
                image: 'assets/images/locations/cuu_trong_thien.png',
                description: 'Nơi ở của các Tiên nhân và Đạo tổ vĩnh hằng.',
                resources: ['Tiên Khí', 'Đạo Quả'],
                energies: [{ type: 'tien_khi', concentration: 300, purity: 'DAO' }, { type: 'hong_mong_tu_khi', concentration: 5, purity: 'DAO' }, { type: 'hon_don_khi', concentration: 2, purity: 'DAO' }],
                eventProbs: { combat: 0.6, loot: 0.2, npc: 0.1, empty: 0.1 }
            }
        ]
    }
};

export const getWorlds = () => WORLDS;
export const getWorldById = (id) => WORLDS[id];
export const getLocationById = (worldId, locId) => WORLDS[worldId]?.locations.find(l => l.id === locId);
