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
                description: 'Nơi yêu thú sơ cấp hoành hành, đầy rẫy linh thảo thiên nhiên.',
                resources: ['Linh Thảo', 'Linh Thạch Hạ Phẩm'],
                eventProbs: { combat: 0.4, loot: 0.3, npc: 0.1, empty: 0.2 }
            },
            {
                id: 'loan_tinh_hai',
                name: 'Loạn Tinh Đại Hải',
                minRealm: 1,
                danger: 'Hạ Cấp',
                description: 'Vùng biển hỗn loạn với vô số đảo nhỏ và yêu thú thủy tộc.',
                resources: ['Thủy Tinh', 'Linh Thạch Hạ Phẩm'],
                eventProbs: { combat: 0.3, loot: 0.2, npc: 0.1, empty: 0.4 }
            },
            {
                id: 'thien_kiem_tong',
                name: 'Thiên Kiếm Thánh Tông',
                minRealm: 5,
                danger: 'An Toàn',
                description: 'Kiếm đạo thánh địa, nơi vạn kiếm quy tông.',
                resources: ['Kiếm Ý', 'Linh Khoáng'],
                eventProbs: { combat: 0.1, loot: 0.1, npc: 0.5, empty: 0.3 }
            },
            {
                id: 'huyen_am_coc',
                name: 'Huyền Âm Ma Cốc',
                minRealm: 10,
                danger: 'Trung Cấp',
                description: 'U ám tà khí, nơi ma tu thường xuyên ẩn nấp phục kích.',
                resources: ['Âm Sát', 'Ma Thạch'],
                eventProbs: { combat: 0.5, loot: 0.2, npc: 0.1, empty: 0.2 }
            },
            {
                id: 'van_bao_cac',
                name: 'Vạn Bảo Thiên Các',
                minRealm: 1,
                danger: 'Tuyệt Đối An Toàn',
                description: 'Thương hội liên giới, nơi có mọi thứ mà tu sĩ cần.',
                resources: ['Đan Dược', 'Pháp Bảo'],
                eventProbs: { combat: 0.0, loot: 0.0, npc: 0.8, empty: 0.2 }
            },
            {
                id: 'cong_hoi_luyen_duoc',
                name: 'Công Hội Luyện Dược Sư',
                minRealm: 1,
                danger: 'An Toàn',
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
                description: 'Dãy núi cổ vô tận, nơi chôn giấu bí mật thời thượng cổ.',
                resources: ['Yêu Đan', 'Linh Dược Cổ'],
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
                description: 'Di tích cổ đại với linh khí đậm đặc gấp bội.',
                resources: ['Linh Thạch Trung Phẩm', 'Cổ Bảo'],
                eventProbs: { combat: 0.4, loot: 0.3, npc: 0.2, empty: 0.1 }
            },
            {
                id: 'dan_thap',
                name: 'Thánh Địa Đan Tháp',
                minRealm: 30,
                danger: 'An Toàn',
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
                description: 'Nơi quy luật thời gian bị bẻ cong, một ngày bên trong bằng mười ngày bên ngoài.',
                resources: ['Thời Không Tinh Thạch'],
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
                description: 'Nơi ở của các Tiên nhân và Đạo tổ vĩnh hằng.',
                resources: ['Tiên Khí', 'Đạo Quả'],
                eventProbs: { combat: 0.6, loot: 0.2, npc: 0.1, empty: 0.1 }
            }
        ]
    }
};

export const getWorlds = () => WORLDS;
export const getLocationById = (worldId, locId) => WORLDS[worldId]?.locations.find(l => l.id === locId);
