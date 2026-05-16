/**
 * DỮ LIỆU THẬP VẠN ĐẠI SƠN (100,000 GREAT MOUNTAINS)
 */

export const MOUNTAIN_TIERS = [
    { 
        id: 'ngoai_son', 
        name: 'Ngoại Sơn', 
        minRealm: 0, 
        description: 'Dành cho tu sĩ Luyện Khí và Trúc Cơ. Nơi tập trung nhiều tán tu và thương đội.',
        hazardScale: 1.0
    },
    { 
        id: 'trung_son', 
        name: 'Trung Sơn', 
        minRealm: 18, 
        description: 'Dành cho tu sĩ Kết Đan và Nguyên Anh. Có nhiều di tích cổ và bí động.',
        hazardScale: 2.5
    },
    { 
        id: 'noi_son', 
        name: 'Nội Sơn', 
        minRealm: 26, 
        description: 'Dành cho tu sĩ Hóa Thần đến Hợp Thể. Đại yêu chiếm cứ, không gian vỡ vụn.',
        hazardScale: 5.0
    },
    { 
        id: 'cam_khu', 
        name: 'Cấm Khu Thâm Xử', 
        minRealm: 38, 
        description: 'Dành cho tu sĩ Đại Thừa trở lên. Sinh vật cổ đại ngủ say, thiên đạo tàn vực.',
        hazardScale: 10.0
    }
];

export const MOUNTAIN_LAYERS = [
    // --- NGOẠI SƠN ---
    {
        id: 'chan_nui',
        tier: 'ngoai_son',
        name: 'Chân Núi (Ngoại Vi)',
        difficulty: 1.0,
        survivalFactor: 0.1,
        description: 'Vùng ngoài cùng, linh khí loãng, nơi tập trung nhiều thảo dược bậc thấp và yêu thú sơ khai.',
        resources: ['linh_thao_thap', 'ling_thach_ha', 'yeu_huyet'],
        eventProbs: { combat: 0.1, loot: 0.1, npc: 0.2, empty: 0.6 }
    },
    {
        id: 'suong_mu',
        tier: 'ngoai_son',
        name: 'Sương Mù Lâm',
        difficulty: 1.5,
        survivalFactor: 0.2,
        description: 'Rừng sương mù dày đặc, linh giác bị hạn chế, ẩn chứa nhiều loại linh quả sơ cấp.',
        resources: ['linh_thao_10y', 'seed_linh_thao', 'yeu_dan_so'],
        eventProbs: { combat: 0.15, loot: 0.15, npc: 0.1, empty: 0.6 }
    },
    {
        id: 'u_thuy_dong',
        tier: 'ngoai_son',
        name: 'U Thủy Động',
        difficulty: 2.2,
        survivalFactor: 0.35,
        description: 'Hệ thống hang động ẩm ướt, nơi cư ngụ của các loài yêu trùng và khoáng thạch hiếm.',
        resources: ['thuy_tinh', 'ma_thach', 'linh_thao_100y'],
        eventProbs: { combat: 0.2, loot: 0.2, npc: 0.05, empty: 0.55 }
    },

    // --- TRUNG SƠN ---
    {
        id: 'loi_phong',
        tier: 'trung_son',
        name: 'Lôi Phong Đỉnh',
        difficulty: 3.5,
        survivalFactor: 0.6,
        description: 'Đỉnh núi quanh năm sấm chớp và gió lốc, linh khí bắt đầu trở nên cuồng bạo.',
        resources: ['loi_linh_thach', 'yeu_dan_trung', 'linh_thao_100y'],
        eventProbs: { combat: 0.3, loot: 0.2, npc: 0.02, empty: 0.48 }
    },
    {
        id: 'co_tu_dong',
        tier: 'trung_son',
        name: 'Cổ Tu Động Phủ',
        difficulty: 4.5,
        survivalFactor: 0.8,
        description: 'Dãy hang động nơi các tu sĩ cổ đại từng cư ngụ, ẩn chứa nhiều tàn hồn và pháp bảo.',
        resources: ['ling_thach_trung', 'bp_luyen_dan', 'bp_phu_luc'],
        eventProbs: { combat: 0.25, loot: 0.4, npc: 0.05, empty: 0.3 }
    },

    // --- NỘI SƠN ---
    {
        id: 'huyet_nguyet',
        tier: 'noi_son',
        name: 'Huyết Nguyệt Cốc',
        difficulty: 6.0,
        survivalFactor: 1.2,
        description: 'Thung lũng bị nguyền rủa, linh khí mang theo sát ý cực mạnh.',
        resources: ['linh_thao_1000y', 'ma_tinh', 'yeu_dan_cao'],
        eventProbs: { combat: 0.4, loot: 0.2, npc: 0.1, empty: 0.3 }
    },
    {
        id: 'hu_khong_khe',
        tier: 'noi_son',
        name: 'Hư Không Liệt Ph縫',
        difficulty: 8.0,
        survivalFactor: 1.8,
        description: 'Nơi không gian vỡ vụn, thường xuyên xuất hiện không gian loạn lưu.',
        resources: ['hon_don_tinh_thach', 'linh_thao_van_nam', 'tien_ngoc'],
        eventProbs: { combat: 0.5, loot: 0.3, npc: 0.05, empty: 0.15 }
    },

    // --- CẤM KHU ---
    {
        id: 'long_mach_uyen',
        tier: 'cam_khu',
        name: 'Long Mạch Uyên',
        difficulty: 12.0,
        survivalFactor: 3.0,
        description: 'Vực sâu vạn trượng, nơi tụ hội của long mạch chi lực.',
        resources: ['long_huyet_tinh', 'than_thú_trung', 'tien_tinh', 'tu_tuong_bo_de_kiem', 'quan_han_linh_ngoc_bat'],
        eventProbs: { combat: 0.6, loot: 0.2, npc: 0.05, empty: 0.15 }
    },
    {
        id: 'thanh_son',
        tier: 'cam_khu',
        name: 'Thánh Sơn (Cực Thâm)',
        difficulty: 20.0,
        survivalFactor: 5.0,
        description: 'Nơi tối cao của Đại Sơn, thiên đạo tàn khuyết, áp lực khủng khiếp.',
        resources: ['hong_mong_chi_bao', 'tien_nhan_truyen_thua', 'hon_don_khi', 'thien_dao_than_thach', 'truyen_dao_thanh_gian'],
        eventProbs: { combat: 0.7, loot: 0.2, npc: 0.05, empty: 0.05 }
    }
];

export const MOUNTAIN_BOSSES = [
    {
        id: 'boss_ngoai_son',
        name: 'Thiên Độc Lang Vương',
        tier: 'ngoai_son',
        level: 25,
        hp: 50000,
        atk: 800,
        def: 500,
        icon: '🐺',
        description: 'Chúa tể vùng Ngoại Sơn, nọc độc có thể ăn mòn linh lực.',
        rewards: ['yeu_dan_trung', 'linh_thao_100y']
    },
    {
        id: 'boss_trung_son',
        name: 'Cổ Tu Tàn Hồn',
        tier: 'trung_son',
        level: 50,
        hp: 250000,
        atk: 3500,
        def: 2000,
        icon: '👻',
        description: 'Một vị đại năng thời thượng cổ còn sót lại ý chí, canh giữ di tích.',
        rewards: ['bp_tran_phap', 'ling_thach_thuong']
    },
    {
        id: 'boss_noi_son',
        name: 'Huyết Nguyệt Yêu Đế',
        tier: 'noi_son',
        level: 80,
        hp: 1200000,
        atk: 15000,
        def: 8000,
        icon: '🐲',
        description: 'Hóa hình đại yêu, thống lĩnh vạn thú vùng Nội Sơn.',
        rewards: ['tien_ngoc', 'linh_thao_van_nam']
    },
    {
        id: 'boss_cam_khu',
        name: 'Hỗn Độn Thần Thú',
        tier: 'cam_khu',
        level: 120,
        hp: 10000000,
        atk: 100000,
        def: 50000,
        icon: '🌌',
        description: 'Sinh vật sinh ra từ hỗn độn, canh giữ ranh giới thiên đạo.',
        rewards: ['hong_mong_chi_bao', 'tien_tinh', 'thien_dao_than_thach', 'ban_thach_dinh_nguyen_kiem', 'luc_duong_loi_hoa_kiem']
    }
];

export const MOUNTAIN_BEASTS = [
    {
        id: 'y_lang',
        name: 'Thanh Phong Yêu Lang',
        layer: 'chan_nui',
        level: 5,
        icon: '🐺',
        description: 'Tốc độ cực nhanh, thường đi theo đàn.'
    },
    {
        id: 'doc_xa',
        name: 'Cự Độc Xà',
        layer: 'suong_mu',
        level: 15,
        icon: '🐍',
        description: 'Nọc độc có thể khiến tu sĩ tê liệt trong chớp mắt.'
    },
    {
        id: 'u_minh_nhen',
        name: 'U Minh Nhện',
        layer: 'u_thuy_dong',
        level: 30,
        icon: '🕷️',
        description: 'Phát ra tơ nhện mang theo âm khí, cực kỳ khó chịu.'
    },
    {
        id: 'loi_thu',
        name: 'Lôi Bạo Thú',
        layer: 'loi_phong',
        level: 45,
        icon: '🐗',
        description: 'Hấp thụ lôi điện để cường hóa cơ thể.'
    },
    {
        id: 'thanh_van_ly',
        name: 'Thanh Vân Ly Thú',
        layer: 'suong_mu',
        level: 12,
        icon: '🦁',
        image: 'beasts/thanh-van-ly-thu.webp',
        description: 'Linh thú cưỡi mây, tốc độ vô ảnh vô hình.'
    },
    {
        id: 'huyen_giap_dia_long',
        name: 'Huyền Giáp Địa Long',
        layer: 'u_thuy_dong',
        level: 28,
        icon: '🐲',
        image: 'beasts/huyen-giap-dia-long.webp',
        description: 'Rồng đất bọc thép, phòng thủ kiên cố.'
    },
    {
        id: 'u_minh_mong_diep',
        name: 'U Minh Mộng Điệp',
        layer: 'huyet_nguyet',
        level: 60,
        icon: '🦋',
        image: 'beasts/u-minh-mong-diep.webp',
        description: 'Bướm ảo ảnh, dẫn dắt con người vào mộng cảnh không lối thoát.'
    }
];

export const MOUNTAIN_EVENTS = [
    {
        id: 'bi_canh_mo',
        name: 'Bí Cảnh Thượng Cổ Mở Ra',
        type: 'treasure',
        layer: 'any',
        chance: 0.05,
        description: 'Một vết nứt không gian mở ra dẫn đến một bí cảnh nhỏ.'
    },
    {
        id: 'suong_doc',
        name: 'Sương Độc Bao Phủ',
        type: 'hazard',
        layer: 'suong_mu',
        chance: 0.12,
        description: 'Chướng khí độc hại bất ngờ bùng phát.'
    },
    {
        id: 'ky_ngo_tan_tu',
        name: 'Gặp Gỡ Tán Tu',
        type: 'encounter',
        layer: 'any',
        description: (player) => {
            if (player.realmId >= 22) return 'Một vị tán tu đơn độc đang hành tẩu, khi thấy ngươi, hắn vội vàng cúi đầu, ánh mắt đầy vẻ kính sợ và né tránh.';
            return 'Ngươi tình cờ bắt gặp một vị tán tu đang đơn độc hành tẩu. Ánh mắt người này lộ vẻ cảnh giác nhưng cũng đầy mệt mỏi.';
        },
        options: (player) => {
            const opts = [
                { label: 'Trao đổi vật phẩm', value: 'trade', icon: 'ph-arrows-left-right' },
                { label: 'Rời đi lặng lẽ', value: 'leave', icon: 'ph-ghost' }
            ];
            if (player.realmId >= 22 || player.karma < 0) {
                opts.splice(1, 0, { label: 'Ra tay cướp bóc', value: 'rob', icon: 'ph-knife' });
            }
            return opts;
        }
    },
    {
        id: 'thuong_nhan_dai_son',
        name: 'Thương Đội Đại Sơn',
        type: 'encounter',
        layer: 'chan_nui',
        description: (player) => {
            if (player.realmId >= 18) return 'Một đoàn thương nhân đang nghỉ chân, thấy cao nhân đi tới, trưởng đoàn vội vàng ra chào mời các loại kỳ trân dị bảo.';
            return 'Một đoàn thương nhân đang nghỉ chân bên đường, có vẻ họ đang vận chuyển linh thảo quý.';
        },
        options: (player) => {
            const opts = [
                { label: 'Giao dịch', value: 'trade', icon: 'ph-shopping-cart' },
                { label: 'Đi tiếp', value: 'leave', icon: 'ph-arrow-right' }
            ];
            if (player.realmId >= 18) opts.splice(1, 0, { label: 'Hỏi thăm tin tức', value: 'info', icon: 'ph-info' });
            return opts;
        }
    },
    {
        id: 'ma_tu_phuc_kich',
        name: 'Ma Tu Xuất Hiện',
        type: 'encounter',
        layer: 'huyet_nguyet',
        description: 'Một luồng ma khí nồng nặc bốc lên, một tên Ma tu với gương mặt hung tợn chặn đường ngươi.',
        options: [
            { label: 'Chiến đấu', value: 'rob', icon: 'ph-sword' },
            { label: 'Bỏ chạy', value: 'leave', icon: 'ph-run' }
        ]
    },
    {
        id: 'de_tu_bi_thuong',
        name: 'Đệ Tử Bị Thương',
        type: 'encounter',
        layer: 'any',
        description: 'Một vị đệ tử tông môn đang ngồi tựa vào gốc cây, hơi thở yếu ớt, trên người đầy vết thương.',
        options: [
            { label: 'Cứu giúp (Tốn Đan Dược)', value: 'help', icon: 'ph-heart' },
            { label: 'Hôi của', value: 'rob', icon: 'ph-hand-grabbing' },
            { label: 'Mặc kệ', value: 'leave', icon: 'ph-prohibit' }
        ]
    },
    {
        id: 'linh_duoc_bao_ho',
        name: 'Linh Dược Quý',
        type: 'encounter',
        layer: 'any',
        description: (player) => {
            if (player.realmId >= 26) return 'Một gốc Cửu Diệp Linh Thảo đang tỏa quang. Yêu thú bảo hộ cảm nhận được uy áp Hóa Thần của ngươi, đang run rẩy không dám lộ diện.';
            return 'Một gốc Cửu Diệp Linh Thảo đang tỏa ra linh quang lấp lánh, nhưng có vẻ có một luồng sát khí đang ẩn nấp gần đó.';
        },
        options: [
            { label: 'Hái linh dược', value: 'pick', icon: 'ph-leaf' },
            { label: 'Rời đi', value: 'leave', icon: 'ph-arrow-u-up-left' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'pick') {
                const dangerChance = player.realmId >= 26 ? 0.1 : 0.6;
                if (Math.random() < dangerChance) {
                    // Ngẫu nhiên chọn 1 trong 3 đại yêu bảo hộ
                    const guardians = ['thanh_van_ly', 'huyen_giap_dia_long', 'u_minh_mong_diep'];
                    const guardianId = guardians[Math.floor(Math.random() * guardians.length)];
                    
                    return { 
                        msg: `Yêu thú bảo hộ ${guardianId.replace(/_/g, ' ')} xuất hiện! Ngươi phải chiến đấu để giành lấy linh thảo!`, 
                        type: 'combat_then_loot', 
                        enemyId: guardianId,
                        loot: 'linh_thao_cao' 
                    };
                } else {
                    player.inventory.addItem('linh_thao_cao', 1);
                    return { msg: player.realmId >= 26 ? 'Ngươi thản nhiên hái linh thảo, yêu thú bảo hộ sợ hãi bỏ chạy.' : 'Ngươi đã hái được linh dược thành công mà không đánh động yêu thú.' };
                }
            }
            return { msg: 'Ngươi quyết định không mạo hiểm.' };
        }
    },
    {
        id: 'o_yeu_thu',
        name: 'Ổ Yêu Thú Hiếm',
        type: 'encounter',
        layer: 'any',
        description: 'Ngươi phát hiện một hang động nhỏ tỏa ra linh khí lạ thường, có vẻ là nơi cư ngụ của một loài yêu thú quý hiếm.',
        options: [
            { label: 'Tiến vào khám phá', value: 'enter', icon: 'ph-door' },
            { label: 'Rời đi', value: 'leave', icon: 'ph-arrow-left' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'enter') {
                const rand = Math.random();
                if (rand < 0.3) {
                    const eggs = ['trung_thanh_van_ly', 'trung_huyen_giap_dia_long', 'trung_u_minh_mong_diep'];
                    const eggId = eggs[Math.floor(Math.random() * eggs.length)];
                    player.inventory.addItem(eggId, 1);
                    return { msg: `Vận khí cực tốt! Ngươi đã tìm thấy một quả ${game.configs.items[eggId].name} bị bỏ lại!` };
                } else if (rand < 0.7) {
                    const guardians = ['thanh_van_ly', 'huyen_giap_dia_long', 'u_minh_mong_diep'];
                    const guardianId = guardians[Math.floor(Math.random() * guardians.length)];
                    return { 
                        msg: 'Ngươi đã đánh động yêu thú đang ngủ say! Nó đang lao tới!', 
                        type: 'combat', 
                        enemyId: guardianId 
                    };
                } else {
                    return { msg: 'Hang động trống rỗng, chỉ còn lại vài mẩu xương tàn.' };
                }
            }
            return null;
        }
    },
    {
        id: 'cam_che_dong_phu',
        name: 'Động Phủ Cấm Chế',
        type: 'encounter',
        layer: 'any',
        description: (player) => {
            if (player.realmId >= 22) return 'Trước mặt là một hang động bị cấm chế cổ đại bao phủ. Với tu vi Nguyên Anh, ngươi có thể cảm nhận rõ ràng các luồng linh lực đang vận hành.';
            return 'Một hang động bí mật bị bao phủ bởi một tầng cấm chế cổ đại mang theo áp lực linh khí cực mạnh.';
        },
        options: [
            { label: 'Cường hành phá giải', value: 'break', icon: 'ph-lightning' },
            { label: 'Bỏ qua', value: 'leave', icon: 'ph-x' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'break') {
                const threshold = player.realmId >= 22 ? 8000 : 15000;
                if (player.stats.atk > threshold) {
                    player.addLingShi(10000);
                    return { msg: 'Ngươi dùng đại lực phá tan cấm chế! Bên trong là kho chứa linh thạch của một vị cổ tu.' };
                } else {
                    player.hp -= 2000;
                    return { msg: 'Cấm chế phản chấn! Ngươi bị thương nặng và bị hất văng ra khỏi hang động.' };
                }
            }
            return null;
        }
    },
];
