export const WORLDS = {
    'nhan_gioi': {
        name: 'Nhân Giới',
        minRealm: 1,
        description: 'Vùng đất của phàm nhân và các tu sĩ sơ cấp.',
        locations: [
            {
                id: 'van_thu_lam',
                name: 'Vạn Thú Lâm',
                minRealm: 1,
                danger: 'Thấp',
                description: 'Nơi quái thú hoành hành, đầy rẫy hiểm nguy và linh thảo.',
                resources: ['Linh Thảo (Thấp)', 'Linh Thạch (Hạ)'],
                eventProbs: { combat: 0.4, loot: 0.3, npc: 0.1, empty: 0.2 }
            },
            {
                id: 'loan_tinh_hai',
                name: 'Loạn Tinh Hải',
                minRealm: 1,
                danger: 'Thấp',
                description: 'Vùng biển đầy rẫy đảo nhỏ và yêu thú cấp thấp.',
                resources: ['Linh Thảo (Thấp)', 'Linh Thạch (Hạ)'],
                eventProbs: { combat: 0.3, loot: 0.2, npc: 0.1, empty: 0.4 }
            },
            {
                id: 'thien_kiem_tong',
                name: 'Thiên Kiếm Tông',
                minRealm: 5,
                danger: 'Thấp',
                description: 'Một trong những tông môn kiếm đạo lớn nhất Nhân Giới.',
                resources: ['Kiếm Ý', 'Linh Khoáng'],
                eventProbs: { combat: 0.1, loot: 0.1, npc: 0.5, empty: 0.3 }
            },
            {
                id: 'huyen_am_coc',
                name: 'Huyền Âm Cốc',
                minRealm: 10,
                danger: 'Trung bình',
                description: 'Nơi u ám, chứa đầy âm khí và ma tu phục kích.',
                resources: ['Âm Sát Khí', 'Linh Thảo Quý'],
                eventProbs: { combat: 0.5, loot: 0.2, npc: 0.1, empty: 0.2 }
            },
            {
                id: 'van_bao_cac',
                name: 'Vạn Bảo Các',
                minRealm: 1,
                danger: 'An toàn',
                description: 'Nơi giao thương sầm uất nhất của giới tu tiên.',
                resources: ['Trang bị', 'Đan dược'],
                eventProbs: { combat: 0.0, loot: 0.0, npc: 0.8, empty: 0.2 }
            }
        ]
    },
    'linh_gioi': {
        name: 'Linh Giới',
        minRealm: 30, // Luyện Hư sơ kỳ
        description: 'Thế giới của những cường giả thực sự.',
        locations: [
            {
                id: 'linh_vuc_thanh_dia',
                name: 'Linh Vực Thánh Địa',
                minRealm: 30,
                danger: 'Cao',
                description: 'Nơi linh khí đậm đặc gấp trăm lần Nhân Giới.',
                resources: ['Linh Thạch (Trung)', 'Cổ Bảo'],
                eventProbs: { combat: 0.4, loot: 0.3, npc: 0.2, empty: 0.1 }
            }
        ]
    },
    'tien_gioi': {
        name: 'Tiên Giới',
        minRealm: 42, // Chân Tiên sơ kỳ
        description: 'Đỉnh cao của con đường tu hành.',
        locations: [
            {
                id: 'cuu_trong_thien',
                name: 'Cửu Trọng Thiên',
                minRealm: 42,
                danger: 'Tử địa',
                description: 'Nơi ở của các Tiên nhân và Đạo tổ.',
                resources: ['Tiên Khí', 'Đạo Quả'],
                eventProbs: { combat: 0.6, loot: 0.2, npc: 0.1, empty: 0.1 }
            }
        ]
    }
};

export const getWorlds = () => WORLDS;
export const getLocationById = (worldId, locId) => WORLDS[worldId]?.locations.find(l => l.id === locId);
