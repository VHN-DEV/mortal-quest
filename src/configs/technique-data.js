export const TECHNIQUE_QUALITIES = {
    'BINH_THUONG': { id: 1, name: 'Bình Thường', multiplier: 1.0 },
    'UU_TU': { id: 2, name: 'Ưu Tú', multiplier: 1.2 },
    'TINH_ANH': { id: 3, name: 'Tinh Anh', multiplier: 1.5 },
    'HAOLAM': { id: 4, name: 'Hào Lam', multiplier: 2.0 },
    'HUYEN_THOAI': { id: 5, name: 'Huyền Thoại', multiplier: 3.0 },
    'THAN_THOAI': { id: 6, name: 'Thần Thoại', multiplier: 5.0 }
};

export const TECHNIQUE_LEVELS = {
    'Phàm Giai': { id: 1, name: 'Phàm Giai', multiplier: 1.0 },
    'Hoàng Giai': { id: 2, name: 'Hoàng Giai', multiplier: 1.5 },
    'Huyền Giai': { id: 3, name: 'Huyền Giai', multiplier: 2.5 },
    'Địa Giai': { id: 4, name: 'Địa Giai', multiplier: 4.0 },
    'Thiên Giai': { id: 5, name: 'Thiên Giai', multiplier: 6.5 },
    'Linh Giai': { id: 6, name: 'Linh Giai', multiplier: 10.0 },
    'Thánh Giai': { id: 7, name: 'Thánh Giai', multiplier: 18.0 },
    'Tiên Giai': { id: 8, name: 'Tiên Giai', multiplier: 35.0 },
    'Đế Giai': { id: 9, name: 'Đế Giai', multiplier: 70.0 },
    'Đạo Giai': { id: 10, name: 'Đạo Giai', multiplier: 150.0 }
};

export const MASTERY_LEVELS = [
    { id: 1, name: 'Nhập Môn', threshold: 0, multiplier: 1.0 },
    { id: 2, name: 'Tiểu Thành', threshold: 1000, multiplier: 1.5 },
    { id: 3, name: 'Đại Thành', threshold: 5000, multiplier: 2.5 },
    { id: 4, name: 'Viên Mãn', threshold: 15000, multiplier: 4.0 },
    { id: 5, name: 'Đại Viên Mãn', threshold: 40000, multiplier: 6.0 }
];

export const TECHNIQUES = {
    'truong_xuan_nap_khi_quyet': {
        id: 'truong_xuan_nap_khi_quyet',
        name: 'Trường Xuân Nạp Khí Quyết',
        type: 'Linh Lực',
        element: 'Neutral',
        quality: 'Hoàng Giai',
        description: 'Công pháp nhập môn phổ thông được lưu truyền rộng rãi trong Nhân Giới. Ổn định, dễ tu luyện, ít tẩu hỏa nhập ma.',
        comprehendDifficulty: { baseTime: 45, difficultyName: 'Hoàng Giai Phổ Thông' },
        maxStage: 7,
        stageLabel: 'Chu Thiên',
        stageNames: [
            'Cảm Khí', 'Dẫn Khí', 'Tụ Khí', 'Luyện Mạch',
            'Tiểu Chu Thiên', 'Đại Chu Thiên', 'Khí Hải Ổn Định'
        ],
        stats: { mana: 20, spd: 5 },
        effects: {
            tvps: 1.2,
            manaRegen: 1.0,
            stability: 15,
            manaConsumptionReduce: 0.1,
            deviationRiskReduce: 0.2
        },
        compatibility: {
            'Mộc': 1.2,
            'Thủy': 1.1,
            'Hỏa': 0.9,
            'Kim': 0.8,
            'Thổ': 1.0,
            'Lôi': 0.7,
            'Phong': 0.8,
            'Băng': 0.9,
            'Tạp': 1.1
        },
        mutations: [
            { id: 'thanh_moc_truong_sinh_quyet', chance: 0.05, condition: 'Mộc' },
            { id: 'huyen_thuy_nap_linh_quyet', chance: 0.05, condition: 'Thủy' },
            { id: 'tu_duong_chan_khi', chance: 0.03, condition: 'Hỏa' }
        ],
        evolution: {
            id: 'truong_xuan_dao_kinh',
            condition: 'Viên Mãn'
        },
        masteryBonuses: {
            1: { tvps: 1.0 },
            2: { tvps: 1.5, manaRegen: 1.2 },
            3: { tvps: 2.5, manaRegen: 1.5, manaConsumptionReduce: 0.15 },
            4: { tvps: 4.0, manaRegen: 2.0, manaConsumptionReduce: 0.25, stability: 30 }
        }
    },
    'liet_duong_cong': {
        id: 'liet_duong_cong',
        name: 'Liệt Dương Công',
        type: 'Linh Lực',
        element: 'Hỏa',
        quality: 'Hoàng Giai',
        description: 'Công pháp thuộc tính Hỏa, hấp thu linh khí mang tính nóng bỏng của mặt trời.',
        comprehendDifficulty: { baseTime: 75, difficultyName: 'Hỏa Cực Dễ Ngộ' },
        maxStage: 5,
        stageLabel: 'Trọng',
        stats: { atk: 15, mana: 10 },
        effects: { tvps: 1.3, fireDamage: 1.2 },
        masteryBonuses: {
            1: { tvps: 1.3 },
            2: { tvps: 1.8, fireDmg: 1.3 },
            3: { tvps: 2.8, fireDmg: 1.5, atk: 1.1 },
            4: { tvps: 4.5, fireDmg: 2.0, atk: 1.25, critChance: 0.1 }
        }
    },
    'han_thuy_quyet': {
        id: 'han_thuy_quyet',
        name: 'Hàn Thủy Quyết',
        type: 'Linh Lực',
        element: 'Thủy',
        quality: 'Hoàng Giai',
        description: 'Công pháp thuộc tính Thủy, linh lực mang tính hàn băng, giúp ổn định tâm tính.',
        maxStage: 5,
        stageLabel: 'Trọng',
        stats: { def: 10, mana: 30 },
        effects: { tvps: 1.3, iceDamage: 1.2 }
    },
    'thanh_moc_tam_kinh': {
        id: 'thanh_moc_tam_kinh',
        name: 'Thanh Mộc Tâm Kinh',
        type: 'Linh Lực',
        element: 'Mộc',
        quality: 'Hoàng Giai',
        description: 'Công pháp thuộc tính Mộc, tăng cường khả năng phục hồi và thọ nguyên.',
        maxStage: 5,
        stats: { hp: 50, mana: 10 },
        effects: { tvps: 1.4, healing: 1.5 },
        masteryBonuses: {
            1: { tvps: 1.4 },
            2: { tvps: 2.0, hpRegen: 1.1 },
            3: { tvps: 3.0, hpRegen: 1.3, maxHp: 1.15 },
            4: { tvps: 5.0, hpRegen: 1.6, maxHp: 1.3, lifespanBonus: 20 }
        }
    },
    'canh_kim_quyet': {
        id: 'canh_kim_quyet',
        name: 'Canh Kim Quyết',
        type: 'Linh Lực',
        element: 'Kim',
        quality: 'Hoàng Giai',
        description: 'Công pháp thuộc tính Kim, linh lực sắc bén như thần binh lợi khí.',
        maxStage: 5,
        stats: { atk: 25 },
        effects: { tvps: 1.2, penet: 0.1 }
    },
    'hau_tho_cong': {
        id: 'hau_tho_cong',
        name: 'Hậu Thổ Công',
        type: 'Linh Lực',
        element: 'Thổ',
        quality: 'Hoàng Giai',
        description: 'Công pháp thuộc tính Thổ, phòng ngự vững chãi như đại địa.',
        maxStage: 5,
        stageLabel: 'Tầng',
        stageNames: ['Đồng Bì', 'Thiết Cốt', 'Ngân Huyết', 'Kim Thân', 'Bất Diệt Thể'],
        stats: { def: 20, hp: 30 },
        effects: { tvps: 1.2, defMult: 1.15 }
    },
    // Body Refining Techniques
    'cuu_chuyen_kim_than': {
        id: 'cuu_chuyen_kim_than',
        name: 'Cửu Chuyển Kim Thân Quyết',
        type: 'Luyện Thể',
        element: 'Kim',
        quality: 'Huyền Giai',
        description: 'Môn luyện thể cực kỳ cường hãn, tu luyện đến đại thành có thể tay không đón thần binh.',
        comprehendDifficulty: { baseTime: 450, difficultyName: 'Luyện Thể Thâm Sâu' },
        maxStage: 9,
        stageLabel: 'Chuyển',
        stats: { hp: 500, def: 100 },
        effects: { bodyPs: 1.5, physRes: 0.2 },
        masteryBonuses: {
            1: { bodyPs: 1.5 },
            2: { bodyPs: 2.2, def: 1.2 },
            3: { bodyPs: 3.8, def: 1.5, physRes: 0.3 },
            4: { bodyPs: 7.0, def: 2.0, physRes: 0.5, counterDamage: 0.15 }
        }
    },
    'man_nguu_kinh': {
        id: 'man_nguu_kinh',
        name: 'Man Ngưu Kình',
        type: 'Luyện Thể',
        element: 'Thổ',
        quality: 'Hoàng Giai',
        description: 'Môn luyện thể nhập môn, tăng cường sức mạnh như trâu điên.',
        maxStage: 3,
        stats: { atk: 20, hp: 100 },
        effects: { bodyPs: 1.2 }
    },
    // Soul Techniques
    'u_minh_huy_ngan': {
        id: 'u_minh_huy_ngan',
        name: 'U Minh Huy Ngạn',
        type: 'Thần Thức',
        element: 'Thủy',
        quality: 'Huyền Giai',
        description: 'Tu luyện thần thức theo hướng âm hàn, có khả năng nhìn thấu ảo ảnh.',
        maxStage: 6,
        stats: { mana: 200, spd: 30 },
        effects: { soulPs: 1.5, perception: 20 }
    },
    'duong_than_quyet': {
        id: 'duong_than_quyet',
        name: 'Dưỡng Thần Quyết',
        type: 'Thần Thức',
        element: 'Mộc',
        quality: 'Hoàng Giai',
        description: 'Môn rèn luyện thần hồn cơ bản, giúp tinh thần minh mẫn.',
        maxStage: 3,
        stageLabel: 'Tầng',
        stats: { mana: 50 },
        effects: { soulPs: 1.2 }
    },
    'thanh_moc_truong_sinh_quyet': {
        id: 'thanh_moc_truong_sinh_quyet',
        name: 'Thanh Mộc Trường Sinh Quyết',
        type: 'Linh Lực',
        element: 'Mộc',
        quality: 'Huyền Giai',
        description: 'Bản biến dị mộc hệ của Trường Xuân Quyết, tập trung vào khả năng hồi phục và thọ nguyên cực mạnh.',
        maxStage: 9,
        stats: { hp: 200, mana: 50 },
        effects: { tvps: 1.8, healing: 2.0, lifespanBonus: 50 }
    },
    'huyen_thuy_nap_linh_quyet': {
        id: 'huyen_thuy_nap_linh_quyet',
        name: 'Huyền Thủy Nạp Linh Quyết',
        type: 'Linh Lực',
        element: 'Thủy',
        quality: 'Huyền Giai',
        description: 'Bản biến dị thủy hệ, linh lực tinh thuần như nước, giúp tốc độ hấp thu linh khí tăng mạnh.',
        maxStage: 9,
        stats: { mana: 300, def: 50 },
        effects: { tvps: 2.0, manaRegen: 1.5 }
    },
    'tu_duong_chan_khi': {
        id: 'tu_duong_chan_khi',
        name: 'Tử Dương Chân Khí',
        type: 'Linh Lực',
        element: 'Hỏa',
        quality: 'Huyền Giai',
        description: 'Bản biến dị hỏa hệ, mang theo tử khí của mặt trời buổi sớm, cực kỳ bá đạo.',
        maxStage: 9,
        stats: { atk: 150, spd: 20 },
        effects: { tvps: 1.6, fireDamage: 1.5 }
    },
    'truong_xuan_dao_kinh': {
        id: 'truong_xuan_dao_kinh',
        name: 'Trường Xuân Đạo Kinh',
        type: 'Linh Lực',
        element: 'Neutral',
        quality: 'Tiên Giai',
        description: 'Phiên bản tiến hóa cổ đại thất truyền của Trường Xuân Quyết. Đạo pháp tự nhiên, trường sinh bất tử.',
        comprehendDifficulty: { baseTime: 43200, difficultyName: 'Đạo Bản Vô Thượng' },
        maxStage: 12,
        stats: { hp: 1000, mana: 1000, atk: 500, def: 500, spd: 100 },
        effects: { tvps: 5.0, lifespanBonus: 1000, allRes: 0.3 }
    },
    'phong_loi_quyet': {
        id: 'phong_loi_quyet',
        name: 'Phong Lôi Quyết',
        type: 'Linh Lực',
        element: 'Lôi',
        quality: 'Huyền Giai',
        description: 'Công pháp hiếm gặp dung hợp giữa Phong và Lôi, linh lực cuồng bạo, tốc độ độn thuật cực nhanh.',
        maxStage: 9,
        stats: { atk: 100, spd: 150 },
        effects: { tvps: 2.0, thunderDmg: 1.5, dodge: 0.1 },
        compatibility: { 'Lôi': 1.5, 'Phong': 1.3, 'Thiên Linh Căn': 1.5 }
    },
    'truong_sinh_quyet': {
        id: 'truong_sinh_quyet',
        name: 'Trường Sinh Quyết',
        type: 'Linh Lực',
        element: 'Mộc',
        quality: 'Hoàng Giai',
        description: 'Công pháp cơ bản tập trung vào dưỡng sinh, giúp kéo dài thọ nguyên.',
        maxStage: 5,
        stats: { hp: 100 },
        effects: { tvps: 1.2, lifespanBonus: 100 }
    },
    'thanh_nguyen_kiem_quyet': {
        id: 'thanh_nguyen_kiem_quyet',
        name: 'Thanh Nguyên Kiếm Quyết',
        type: 'Linh Lực',
        element: 'Kim',
        quality: 'Huyền Giai',
        description: 'Kiếm quyết danh chấn Thiên Nam của Hàn Lập, mộc kim lưỡng hệ linh lực giao hòa, biến ảo khôn lường.',
        comprehendDifficulty: { baseTime: 1200, difficultyName: 'Kiếm Đạo Huyền Diệu' },
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { atk: 120, spd: 40 },
        effects: { tvps: 2.2, swordDmg: 1.25, pierce: 0.15 },
        compatibility: {
            'Kim': 1.3,
            'Mộc': 1.3,
            'Thiên Linh Căn': 1.6
        },
        divineAbilities: {
            3: 'thanh_nguyen_kiem_mang',
            5: 'ho_the_kiem_don',
            9: 'bach_nhap_kiem_tran'
        }
    },
    'dai_dien_quyet': {
        id: 'dai_dien_quyet',
        name: 'Đại Diễn Quyết',
        type: 'Thần Thức',
        element: 'Neutral',
        quality: 'Huyền Giai',
        description: 'Thần chí tu luyện chí pháp của Cực Âm Tổ Sư, luyện thành thần thức vượt xa cảnh giới, khống chế khôi lỗi cực đoan.',
        comprehendDifficulty: { baseTime: 1500, difficultyName: 'Thần Niệm Thần Bí' },
        maxStage: 7,
        stageLabel: 'Tầng',
        stats: { mana: 400, spd: 25 },
        effects: { soulPs: 2.5, perception: 35, cooldownReduction: 0.15 },
        divineAbilities: {
            3: 'dai_dien_than_niem',
            7: 'khoi_loi_vo_song'
        }
    },
    'minh_vuong_quyet': {
        id: 'minh_vuong_quyet',
        name: 'Minh Vương Quyết',
        type: 'Luyện Thể',
        element: 'Thổ',
        quality: 'Huyền Giai',
        description: 'Phật môn luyện thể cực đạo chi pháp, tu luyện đến cực hạn nhục thân bất hoại, phản chấn thương thế.',
        comprehendDifficulty: { baseTime: 1800, difficultyName: 'Bá Đạo Luyện Thể' },
        maxStage: 9,
        stageLabel: 'Trọng',
        stats: { hp: 1200, def: 350 },
        effects: { bodyPs: 2.4, physRes: 0.25, counterDamage: 0.2 },
        divineAbilities: {
            3: 'minh_vuong_kim_than',
            7: 'phat_mon_phat_quan'
        }
    },
    'phe_huyet_ma_cong': {
        id: 'phe_huyet_ma_cong',
        name: 'Phệ Huyết Ma Công',
        type: 'Linh Lực',
        element: 'Âm',
        quality: 'Huyền Giai',
        description: 'Ma đạo công pháp bá đạo cực tốc, thôn phệ tinh huyết địch nhân gia tăng tu vi, cực kỳ dễ tẩu hỏa.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { atk: 300, spd: 50 },
        effects: { tvps: 3.5, lifeSteal: 0.15, deviationChance: 2.0 },
        divineAbilities: {
            3: 'huyet_sat_cuong_bao',
            9: 'van_ma_phuc_the'
        }
    },
    'van_doc_hoa_cot_quyet': {
        id: 'van_doc_hoa_cot_quyet',
        name: 'Vạn Độc Hóa Cốt Quyết',
        type: 'Linh Lực',
        element: 'Mộc',
        quality: 'Huyền Giai',
        description: 'Độc môn tu luyện bí pháp, linh lực ẩn chứa kịch độc hóa cốt, ăn mòn phòng ngự đối phương.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { hp: 600, atk: 120 },
        effects: { tvps: 2.0, poisonDmg: 1.3, penet: 0.2 },
        divineAbilities: {
            3: 'van_doc_kiem_khi',
            9: 'thien_doc_phat_quan'
        }
    },
    'hu_thien_tran_phap_quyen': {
        id: 'hu_thien_tran_phap_quyen',
        name: 'Hư Thiên Trận Pháp Quyển',
        type: 'Linh Lực',
        element: 'Thổ',
        quality: 'Huyền Giai',
        description: 'Trận đạo tông sư truyền thừa thiên thư, dung hợp ngũ hành linh lực tạo lập trận pháp áp chế hoàn mỹ.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { def: 200, mana: 300 },
        effects: { tvps: 1.8, formationPower: 1.4, dodge: 0.15 },
        divineAbilities: {
            3: 'tran_phap_ap_che',
            9: 'bat_quai_ho_than'
        }
    },
    'thien_kiem_tong_cong_phap': {
        id: 'thien_kiem_tong_cong_phap',
        name: 'Thiên Kiếm Quyết',
        type: 'Linh Lực',
        element: 'Kim',
        quality: 'Địa Giai',
        description: 'Kiếm pháp trấn tông tối cao của Thiên Kiếm Tông, lấy kiếm thông linh khí, sắc bén vô song phá thiên trảm địa.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { atk: 180, spd: 30 },
        effects: { tvps: 2.2, critChance: 0.1, swordDmg: 1.25 }
    },
    'hoang_phong_coc_cong_phap': {
        id: 'hoang_phong_coc_cong_phap',
        name: 'Hoàng Phong Thần Sa Quyết',
        type: 'Linh Lực',
        element: 'Phong',
        quality: 'Huyền Giai',
        description: 'Độc môn công pháp tu luyện ra Hoàng Phong Thần Sa cuồng bạo, phòng ngự vững chãi, linh lực phong phú.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { def: 90, maxHp: 400 },
        effects: { tvps: 1.8, windDmg: 1.2, stability: 25 }
    },
    'huyen_am_coc_cong_phap': {
        id: 'huyen_am_coc_cong_phap',
        name: 'Huyền Âm Chân Kinh',
        type: 'Linh Lực',
        element: 'Thủy',
        quality: 'Địa Giai',
        description: 'Cổ thư tà môn Huyền Âm Cốc, hấp thụ u minh âm hàn chi khí, gia tăng oai khí ăn mòn kinh mạch đối thủ.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { maxHp: 500, atk: 100 },
        effects: { tvps: 2.0, lifesteal: 0.05, waterDmg: 1.2 }
    },
    'yem_nguyet_tong_cong_phap': {
        id: 'yem_nguyet_tong_cong_phap',
        name: 'Yểm Nguyệt Song Tu Quyết',
        type: 'Linh Lực',
        element: 'Neutral',
        quality: 'Địa Giai',
        description: 'Bí điển trấn phái Yểm Nguyệt Tông, song tu hợp nhất âm dương điều hòa khí hải, gia tốc cực thịnh đại đạo.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { mana: 300, spd: 40 },
        effects: { tvps: 2.5, xpBonus: 0.1, dodge: 0.05 }
    },
    'lac_van_tong_cong_phap': {
        id: 'lac_van_tong_cong_phap',
        name: 'Lạc Vân Kiếm Trận Biện',
        type: 'Linh Lực',
        element: 'Mộc',
        quality: 'Địa Giai',
        description: 'Kiếm trận huyền pháp Lạc Vân Tông, mộc linh biến hóa hóa sinh vạn linh kiếm võng bảo bọc bản tôn.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { def: 120, maxHp: 450 },
        effects: { tvps: 2.0, woodDmg: 1.25, shieldMult: 0.1 }
    },
    'thien_tinh_tong_cong_phap': {
        id: 'thien_tinh_tong_cong_phap',
        name: 'Thiên Tinh Trận Pháp Quyết',
        type: 'Linh Lực',
        element: 'Thổ',
        quality: 'Huyền Giai',
        description: 'Nguyên Vũ Quốc Thiên Tinh Tông trận thuật đỉnh cấp, thấu triệt tinh bàn hóa trận áp chế yêu quỷ cực tốt.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { def: 180, mana: 250 },
        effects: { tvps: 1.8, formationPower: 1.3, earthDmg: 1.2 }
    },
    'linh_thu_son_cong_phap': {
        id: 'linh_thu_son_cong_phap',
        name: 'Linh Thú Vạn Thú Quyết',
        type: 'Linh Lực',
        element: 'Neutral',
        quality: 'Huyền Giai',
        description: 'Ngự thú thần pháp của Linh Thú Sơn, huyết mạch tráng kiện cộng sinh linh oai oai chấn trần thế.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { maxHp: 600, atk: 90 },
        effects: { tvps: 1.8, beastExpBonus: 0.2, beastSuccess: 0.15 }
    },
    'thanh_hu_mon_cong_phap': {
        id: 'thanh_hu_mon_cong_phap',
        name: 'Thanh Hư Đạo Nguyên Kinh',
        type: 'Linh Lực',
        element: 'Neutral',
        quality: 'Huyền Giai',
        description: 'Chính tông tiên đạo dưỡng khí pháp của Thanh Hư Môn, khí tức dưỡng sinh dưỡng đạo yên tĩnh vô song.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { mana: 400, def: 80 },
        effects: { tvps: 2.0, healSuccess: 0.15, devRiskReduce: 0.3 }
    },
    'cu_kiem_mon_cong_phap': {
        id: 'cu_kiem_mon_cong_phap',
        name: 'Cự Kiếm Cương Thiết Thể',
        type: 'Luyện Thể',
        element: 'Kim',
        quality: 'Huyền Giai',
        description: 'Bá thể công pháp Cự Kiếm Môn, rèn luyện nhục thân cứng cỏi tựa kim cương bất hoại.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { atk: 250, def: 100 },
        effects: { tvps: 1.8, critDmg: 0.3, phyDmg: 1.2 }
    },
    'hoa_dao_o_cong_phap': {
        id: 'hoa_dao_o_cong_phap',
        name: 'Hóa Đao Thần Công',
        type: 'Linh Lực',
        element: 'Hỏa',
        quality: 'Huyền Giai',
        description: 'Tuyệt diệu đao thuật Hóa Đao Ổ, đao kình cuồng bạo nóng rực chém rách bầu trời cát bụi.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { atk: 180, spd: 35 },
        effects: { tvps: 1.8, fireDmg: 1.25, critChance: 0.05 }
    },
    'thien_khuyet_bao_cong_phap': {
        id: 'thien_khuyet_bao_cong_phap',
        name: 'Thiên Khuyết Hộ Thể Thuẫn',
        type: 'Linh Lực',
        element: 'Thổ',
        quality: 'Huyền Giai',
        description: 'Hộ pháp cương khí Thiên Khuyết Bảo, đúc thiết bì giáp kiên cố tựa giáp đá vạn trượng.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { def: 250, maxHp: 500 },
        effects: { tvps: 1.8, defPct: 0.15, shieldSuccess: 0.2 }
    },
    'quy_linh_mon_cong_phap': {
        id: 'quy_linh_mon_cong_phap',
        name: 'Quỷ Âm Huyền Pháp',
        type: 'Linh Lực',
        element: 'Neutral',
        quality: 'Địa Giai',
        description: 'Tuyệt học ngự quỷ tụ phách của Quỷ Linh Môn, hóa tà lực ăn mòn sinh lực tu tiên giả cực mạnh.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { atk: 140, mana: 300 },
        effects: { tvps: 2.0, poisonDmg: 1.3, xpBonus: 0.05 }
    },
    'hop_hoan_tong_cong_phap': {
        id: 'hop_hoan_tong_cong_phap',
        name: 'Âm Dương Hoan Lạc Quyết',
        type: 'Linh Lực',
        element: 'Neutral',
        quality: 'Địa Giai',
        description: 'Mị pháp điên cuồng Hợp Hoan Tông, hấp tinh đoạt phách dung hợp linh lực âm dương đệ nhất tà đạo.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { mana: 400, spd: 45 },
        effects: { tvps: 2.4, dodge: 0.08, xpBonus: 0.08 }
    },
    'ma_diem_mon_cong_phap': {
        id: 'ma_diem_mon_cong_phap',
        name: 'Thanh Dương Ma Hỏa Kinh',
        type: 'Linh Lực',
        element: 'Hỏa',
        quality: 'Địa Giai',
        description: 'Hỏa ma bí pháp thiêu đốt tiên mạch Ma Diễm Môn, hỏa độc ma trấp ăn mòn tiên cốt oanh kích tột cùng.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { atk: 220, maxHp: 350 },
        effects: { tvps: 2.1, fireDmg: 1.35, ignoreDef: 0.05 }
    },
    'thien_sat_tong_cong_phap': {
        id: 'thien_sat_tong_cong_phap',
        name: 'Thiên Sát Ma Quyết',
        type: 'Luyện Thể',
        element: 'Neutral',
        quality: 'Địa Giai',
        description: 'Sát ý ma công Thiên Sát Tông, lấy huyết hóa ma sát tăng vọt sức mạnh tột bực trong huyết chiến.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { atk: 200, def: 100 },
        effects: { tvps: 2.0, critChance: 0.08, phyDmg: 1.25 }
    },
    'ngu_linh_tong_cong_phap': {
        id: 'ngu_linh_tong_cong_phap',
        name: 'Vạn Côn Ngự Trùng Thuật',
        type: 'Linh Lực',
        element: 'Mộc',
        quality: 'Địa Giai',
        description: 'Huyền thuật điều phối ngự trùng Ngự Linh Tông, sai sử vạn linh trùng độc phong bế tiên mạch địch thủ.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { maxHp: 500, spd: 30 },
        effects: { tvps: 2.0, insectExpBonus: 0.25, insectSuccess: 0.2 }
    },
    'khoi_am_tong_cong_phap': {
        id: 'khoi_am_tong_cong_phap',
        name: 'Khôi Lỗi U Minh Kinh',
        type: 'Linh Lực',
        element: 'Thủy',
        quality: 'Địa Giai',
        description: 'U Linh Khôi Lỗi tiên thuật Khôi Âm Tông, tích lũy u minh âm khí thối luyện thi xác dũng mãnh.',
        maxStage: 9,
        stageLabel: 'Tầng',
        stats: { def: 150, maxHp: 400 },
        effects: { tvps: 2.0, corpseExpBonus: 0.25, corpseSuccess: 0.2 }
    }
};

export const SECRET_TECHNIQUES = {
    'huyet_don_thuat': {
        id: 'huyet_don_thuat',
        name: 'Huyết Độn Thuật',
        type: 'escape',
        quality: 'Huyền Giai',
        icon: '🩸',
        description: 'Đốt cháy tinh huyết để thoát khỏi chiến đấu ngay lập tức.',
        costs: { hp: 20, lifespan: 1 },
        cooldown: 0,
        effects: { escape: true },
        masteryBonuses: {
            1: { costHp: 20 },
            2: { costHp: 15 },
            3: { costHp: 10 },
            4: { costHp: 5, lifespanCost: 0 }
        }
    },
    'am_sat_thu_phap': {
        id: 'am_sat_thu_phap',
        name: 'Ám Sát Thủ Pháp',
        type: 'attack',
        quality: 'Huyền Giai',
        icon: '🗡️',
        description: 'Kỹ thuật ám sát lạnh lùng, nhắm vào điểm yếu đối phương.',
        costs: { mana: 30 },
        cooldown: 4,
        effects: { damageMult: 2.5, critChance: 0.3 },
        masteryBonuses: {
            1: { damageMult: 2.5 },
            2: { damageMult: 3.5, critChance: 0.35 },
            3: { damageMult: 5.0, critChance: 0.45 },
            4: { damageMult: 8.0, critChance: 0.6, ignoreDef: 0.2 }
        }
    },
    'thien_loi_kich': {
        id: 'thien_loi_kich',
        name: 'Thiên Lôi Kích',
        type: 'attack',
        quality: 'Địa Giai',
        icon: '⚡',
        description: 'Triệu hồi thiên lôi giáng xuống đầu kẻ thù.',
        costs: { mana: 100 },
        cooldown: 8,
        effects: { damageMult: 5.0, stun: true },
        masteryBonuses: {
            1: { damageMult: 5.0 },
            2: { damageMult: 7.0, costMana: 80 },
            3: { damageMult: 10.0, stun: true, critChance: 0.2 },
            4: { damageMult: 15.0, stun: true, critChance: 0.35, ignoreDef: 0.3 }
        }
    },
    // --- PROFESSION MASTERY SECRETS ---
    'bp_luyen_dan': {
        id: 'bp_luyen_dan',
        name: 'Đan Đạo Chân Giải',
        type: 'profession',
        quality: 'Huyền Giai',
        icon: '📜',
        description: 'Tăng cường hiểu biết về đan đạo. Mỗi tầng giúp tăng tỷ lệ thành công và kinh nghiệm đan đạo.',
        maxStage: 9,
        stageLabel: 'Tầng',
        masteryBonuses: {
            1: { alchemyExpBonus: 1.0, alchemySuccess: 1.0 },
            2: { alchemyExpBonus: 1.2, alchemySuccess: 1.05 },
            3: { alchemyExpBonus: 1.5, alchemySuccess: 1.15, doubleDanChance: 0.1 },
            4: { alchemyExpBonus: 2.0, alchemySuccess: 1.3, doubleDanChance: 0.25, autoPurify: true }
        }
    },
    'bp_luyen_khi': {
        id: 'bp_luyen_khi',
        name: 'Luyện Khí Tổng Cương',
        type: 'profession',
        quality: 'Huyền Giai',
        icon: '📜',
        description: 'Tăng cường hiểu biết về luyện khí. Mỗi tầng giúp tăng độ bền pháp bảo và tỷ lệ tinh luyện hoàn mỹ.',
        maxStage: 9,
        masteryBonuses: {
            1: { smithingExpBonus: 1.0 },
            2: { smithingExpBonus: 1.2, smithingSuccess: 1.05 },
            3: { smithingExpBonus: 1.5, smithingSuccess: 1.15, artifactDuraBonus: 20 },
            4: { smithingExpBonus: 2.0, smithingSuccess: 1.3, artifactDuraBonus: 50, perfectRefine: 0.1 }
        }
    },
    'bp_phu_luc': {
        id: 'bp_phu_luc',
        name: 'Thái Thượng Phù Kinh',
        type: 'profession',
        quality: 'Huyền Giai',
        icon: '📜',
        description: 'Tăng cường hiểu biết về phù lục. Mỗi tầng giúp tăng uy lực phù văn và tỷ lệ vẽ song phù.',
        maxStage: 9,
        masteryBonuses: {
            1: { talismanExpBonus: 1.0 },
            2: { talismanExpBonus: 1.2, talismanSuccess: 1.05 },
            3: { talismanExpBonus: 1.5, talismanSuccess: 1.15, talismanPower: 1.2 },
            4: { talismanExpBonus: 2.0, talismanSuccess: 1.3, talismanPower: 1.5, twinWrite: 0.2 }
        }
    },
    'thanh_nguyen_kiem_mang': {
        id: 'thanh_nguyen_kiem_mang',
        name: 'Thanh Nguyên Kiếm Mang',
        type: 'attack',
        quality: 'Huyền Giai',
        icon: '🗡️',
        description: 'Vung kiếm kích hoạt kiếm mang sắc bén bỏ qua 30% phòng ngự.',
        costs: { mana: 40 },
        cooldown: 5,
        effects: { damageMult: 3.2, ignoreDef: 0.3 }
    },
    'ho_the_kiem_don': {
        id: 'ho_the_kiem_don',
        name: 'Hộ Thể Kiếm Độn',
        type: 'buff',
        quality: 'Huyền Giai',
        icon: '🛡️',
        description: 'Kiếm khí quanh thân hình thành giáp độn tăng né tránh và phòng thủ.',
        costs: { mana: 50 },
        cooldown: 8,
        effects: { shield: 300, dodge: 0.3 }
    },
    'bach_nhap_kiem_tran': {
        id: 'bach_nhap_kiem_tran',
        name: 'Bách Nhập Kiếm Trận',
        type: 'attack',
        quality: 'Địa Giai',
        icon: '⚔️',
        description: 'Triệu hồi hàng trăm phi kiếm tụ hợp thành kiếm trận bao vây chém giết kẻ địch.',
        costs: { mana: 150 },
        cooldown: 12,
        effects: { damageMult: 7.5, critChance: 0.4 }
    },
    'dai_dien_than_niem': {
        id: 'dai_dien_than_niem',
        name: 'Đại Diễn Thần Niệm',
        type: 'attack',
        quality: 'Huyền Giai',
        icon: '🧠',
        description: 'Phóng ra thần niệm trùng kích vào thần hồn đối phương gây choáng.',
        costs: { mana: 60 },
        cooldown: 6,
        effects: { damageMult: 2.0, stun: true }
    },
    'khoi_loi_vo_song': {
        id: 'khoi_loi_vo_song',
        name: 'Khôi Lỗi Vô Song',
        type: 'buff',
        quality: 'Địa Giai',
        icon: '🤖',
        description: 'Kích hoạt cơ quan hỏa khí khôi lỗi, tăng cường 100% sát thương khôi lỗi.',
        costs: { mana: 100 },
        cooldown: 10,
        effects: { puppetDmgMult: 2.0 }
    },
    'minh_vuong_kim_than': {
        id: 'minh_vuong_kim_than',
        name: 'Minh Vương Kim Thân',
        type: 'buff',
        quality: 'Huyền Giai',
        icon: '🥋',
        description: 'Minh Vương hộ thể phát ra ánh sáng vàng, tăng phòng thủ 100% và phản hồi 30% sát thương.',
        costs: { hp: 10 },
        cooldown: 8,
        effects: { defMult: 2.0, reflectDmg: 0.3 }
    },
    'phat_mon_phat_quan': {
        id: 'phat_mon_phat_quan',
        name: 'Phật Môn Phật Quang',
        type: 'heal',
        quality: 'Địa Giai',
        icon: '📿',
        description: 'Phật quang phổ chiếu hồi phục lượng lớn sinh mệnh và hộ thân cực mạnh.',
        costs: { mana: 80 },
        cooldown: 10,
        effects: { healPct: 0.35, shield: 500 }
    },
    'huyet_sat_cuong_bao': {
        id: 'huyet_sat_cuong_bao',
        name: 'Huyết Sát Cuồng Bạo',
        type: 'attack',
        quality: 'Huyền Giai',
        icon: '🩸',
        description: 'Bạo kích ma huyết oanh kích đối phương hồi sinh mệnh bằng 40% sát thương gây ra.',
        costs: { hp: 15 },
        cooldown: 5,
        effects: { damageMult: 4.5, lifeSteal: 0.4 }
    },
    'van_ma_phuc_the': {
        id: 'van_ma_phuc_the',
        name: 'Vạn Ma Phục Thể',
        type: 'buff',
        quality: 'Địa Giai',
        icon: '😈',
        description: 'Triệu hoán ma thần hư ảnh nhập thể, tăng bạo kích và sát thương cực độ.',
        costs: { hp: 20, mana: 80 },
        cooldown: 15,
        effects: { atkMult: 1.8, critChance: 0.3 }
    },
    'van_doc_kiem_khi': {
        id: 'van_doc_kiem_khi',
        name: 'Vạn Độc Kiếm Khí',
        type: 'attack',
        quality: 'Huyền Giai',
        icon: '☣️',
        description: 'Kiếm khí ngập tràn kịch độc ăn mòn, gây sát thương liên tục mỗi lượt.',
        costs: { mana: 40 },
        cooldown: 6,
        effects: { damageMult: 2.2, poisonDot: 0.08 }
    },
    'thien_doc_phat_quan': {
        id: 'thien_doc_phat_quan',
        name: 'Thiên Độc Phát Quan',
        type: 'attack',
        quality: 'Địa Giai',
        icon: '🤢',
        description: 'Bộc phát làn sương độc toàn bản đồ, làm giảm phòng ngự và làm chậm đối phương.',
        costs: { mana: 100 },
        cooldown: 10,
        effects: { damageMult: 4.0, enemyDefReduce: 0.4 }
    },
    'tran_phap_ap_che': {
        id: 'tran_phap_ap_che',
        name: 'Trận Pháp Áp Chế',
        type: 'attack',
        quality: 'Huyền Giai',
        icon: '🕸️',
        description: 'Kích hoạt hư không pháp trận làm chậm tốc độ kẻ địch 50%.',
        costs: { mana: 50 },
        cooldown: 7,
        effects: { damageMult: 1.5, enemySpdReduce: 0.5 }
    },
    'bat_quai_ho_than': {
        id: 'bat_quai_ho_than',
        name: 'Bát Quái Hộ Thân',
        type: 'buff',
        quality: 'Địa Giai',
        icon: '☯️',
        description: 'Vẽ ra bát quái linh trận miễn dịch tất cả sát thương trong lượt hiện tại.',
        costs: { mana: 120 },
        cooldown: 12,
        effects: { invulnerable: true }
    },
    'thien_kiem_tong_bi_tich': {
        id: 'thien_kiem_tong_bi_tich',
        name: 'Kiếm Thuật: Vạn Kiếm Quy Tông',
        type: 'attack',
        quality: 'Địa Giai',
        icon: '⚔️',
        description: 'Kích hoạt cự đại kiếm trận, phóng ra vạn đạo phi kiếm bỏ qua 50% phòng ngự kẻ địch.',
        costs: { mana: 120 },
        cooldown: 5,
        effects: { damageMult: 3.5, ignoreDef: 0.5 }
    },
    'hoang_phong_coc_bi_tich': {
        id: 'hoang_phong_coc_bi_tich',
        name: 'Thuật Pháp: Hoàng Phong Thần Sa',
        type: 'stun',
        quality: 'Huyền Giai',
        icon: '🌪',
        description: 'Triệu hồi cự phong cát bụi mù mịt làm choáng (stun) đối phương trong 1 lượt.',
        costs: { mana: 80 },
        cooldown: 6,
        effects: { damageMult: 1.8, stun: true }
    },
    'huyen_am_coc_bi_tich': {
        id: 'huyen_am_coc_bi_tich',
        name: 'Bí Thuật: Huyền Âm Quỷ Trảo',
        type: 'heal',
        quality: 'Địa Giai',
        icon: '💀',
        description: 'Ảnh hồn quỷ trảo bạt mạng, chuyển hóa 40% sát thương gây ra thành lượng hồi phục máu bản thân.',
        costs: { mana: 90 },
        cooldown: 4,
        effects: { damageMult: 2.2, lifesteal: 0.4 }
    },
    'yem_nguyet_tong_bi_tich': {
        id: 'yem_nguyet_tong_bi_tich',
        name: 'Bí Thuật: Mị Ảnh Hoặc Thần',
        type: 'stun',
        quality: 'Địa Giai',
        icon: '🌙',
        description: 'Mị thuật mê hoặc thần hồn đỉnh cao, khống chế cứng làm choáng địch thủ 1 lượt.',
        costs: { mana: 70 },
        cooldown: 5,
        effects: { damageMult: 1.2, stun: true }
    },
    'lac_van_tong_bi_tich': {
        id: 'lac_van_tong_bi_tich',
        name: 'Thuật Pháp: Tử Cực Thần Quang',
        type: 'attack',
        quality: 'Địa Giai',
        icon: '🔮',
        description: 'Oanh tạc tử quang diệu linh bỏ qua hoàn toàn phòng ngự của kẻ địch cực bạo.',
        costs: { mana: 150 },
        cooldown: 7,
        effects: { damageMult: 4.0, ignoreDef: 1.0 }
    },
    'thien_tinh_tong_bi_tich': {
        id: 'thien_tinh_tong_bi_tich',
        name: 'Trận Pháp: Ngũ Hành Huyền Thuẫn',
        type: 'buff',
        quality: 'Huyền Giai',
        icon: '🛡',
        description: 'Bày ngũ hành trận thuẫn, hấp thu sát thương bằng 35% lượng máu tối đa.',
        costs: { mana: 60 },
        cooldown: 5,
        effects: { shieldMult: 0.35 }
    },
    'linh_thu_son_bi_tich': {
        id: 'linh_thu_son_bi_tich',
        name: 'Bí Thuật: Thú Huyết Cuồng Bạo',
        type: 'buff',
        quality: 'Huyền Giai',
        icon: '🩸',
        description: 'Đốt cháy thú huyết, tăng mạnh 30% công kích đồng thời hồi phục ngay 15% máu tối đa.',
        costs: { mana: 60, hp: 50 },
        cooldown: 6,
        effects: { damageMult: 2.0, healPct: 0.15 }
    },
    'thanh_hu_mon_bi_tich': {
        id: 'thanh_hu_mon_bi_tich',
        name: 'Bí Pháp: Thanh Hư Ngọc Lộ',
        type: 'heal',
        quality: 'Huyền Giai',
        icon: '💧',
        description: 'Chiết linh tịnh khí hồi phục sinh cơ cực đại, bổ sung 25% tối đa HP lẫn Mana.',
        costs: { mana: 40 },
        cooldown: 8,
        effects: { healPct: 0.25, manaHealPct: 0.25 }
    },
    'cu_kiem_mon_bi_tich': {
        id: 'cu_kiem_mon_bi_tich',
        name: 'Kiếm Thuật: Cự Kiếm Trảm Thiên',
        type: 'attack',
        quality: 'Huyền Giai',
        icon: '🗡',
        description: 'Trọng kiếm giáng hạ hủy thiên diệt địa, sát thương cực cao với 50% cơ hội chí mạng.',
        costs: { mana: 100 },
        cooldown: 6,
        effects: { damageMult: 5.0, critChance: 0.5 }
    },
    'hoa_dao_o_bi_tich': {
        id: 'hoa_dao_o_bi_tich',
        name: 'Kiếm Thuật: Đao Kình Thương Không',
        type: 'attack',
        quality: 'Huyền Giai',
        icon: '🔥',
        description: 'Chém mạnh đao ảnh xé toạc chân không, gây sát thương kèm hiệu ứng chảy máu rực rỡ.',
        costs: { mana: 90 },
        cooldown: 5,
        effects: { damageMult: 2.5, burn: true, burnDmg: 50 }
    },
    'thien_khuyet_bao_bi_tich': {
        id: 'thien_khuyet_bao_bi_tich',
        name: 'Bí Pháp: Thiên Khuyết Kim Giáp',
        type: 'buff',
        quality: 'Huyền Giai',
        icon: '🛡',
        description: 'Hóa thạch kim thành cương thể, gia tăng 50% phòng ngự toàn diện trong 3 lượt.',
        costs: { mana: 80 },
        cooldown: 6,
        effects: { buffDefPct: 0.5, duration: 3 }
    },
    'quy_linh_mon_bi_tich': {
        id: 'quy_linh_mon_bi_tich',
        name: 'Bí Thuật: Vạn Quỷ Cắn Xé',
        type: 'attack',
        quality: 'Địa Giai',
        icon: '👿',
        description: 'Quỷ ảnh oanh tạc hủ cốt linh thức, gây sát thương lớn và độc tố gặm nhấm tinh nguyên địch 4 lượt.',
        costs: { mana: 110 },
        cooldown: 7,
        effects: { damageMult: 2.0, poison: true, poisonDmg: 40 }
    },
    'hop_hoan_tong_bi_tich': {
        id: 'hop_hoan_tong_bi_tich',
        name: 'Mị Thuật: Mị Hoặc Chúng Sinh',
        type: 'debuff',
        quality: 'Địa Giai',
        icon: '💋',
        description: 'Dựng ảo hương điên loạn thần trí, suy giảm 40% tốc độ của đối thủ trong 3 lượt.',
        costs: { mana: 70 },
        cooldown: 6,
        effects: { enemySpdReduce: 0.4, duration: 3 }
    },
    'ma_diem_mon_bi_tich': {
        id: 'ma_diem_mon_bi_tich',
        name: 'Bí Pháp: U Minh Địa Hỏa',
        type: 'attack',
        quality: 'Địa Giai',
        icon: '🔥',
        description: 'Bộc phá dung nham nóng cháy thiêu rụi tiên căn, oanh tạc sát thương cùng thiêu đốt cực bạo.',
        costs: { mana: 100 },
        cooldown: 5,
        effects: { damageMult: 2.8, burn: true, burnDmg: 70 }
    },
    'thien_sat_tong_bi_tich': {
        id: 'thien_sat_tong_bi_tich',
        name: 'Bí Pháp: Sát Khí Xung Thiên',
        type: 'buff',
        quality: 'Địa Giai',
        icon: '👿',
        description: 'Hóa ma sát khí bọc nhiếp chiến ý, gia tăng mạnh mẽ 30% sát thương công kích trong 3 lượt.',
        costs: { mana: 75, hp: 80 },
        cooldown: 5,
        effects: { buffAtkPct: 0.3, duration: 3 }
    },
    'ngu_linh_tong_bi_tich': {
        id: 'ngu_linh_tong_bi_tich',
        name: 'Bí Thuật: Phệ Linh Ma Trùng',
        type: 'attack',
        quality: 'Địa Giai',
        icon: '🐛',
        description: 'Khu trù trùng cổ ăn giáp và sinh lực, gây sát thương lớn và giảm 30% phòng ngự đối thủ.',
        costs: { mana: 100 },
        cooldown: 6,
        effects: { damageMult: 2.2, enemyDefReduce: 0.3 }
    },
    'khoi_am_tong_bi_tich': {
        id: 'khoi_am_tong_bi_tich',
        name: 'Bí Thuật: Bộc Phá Thi Khôi',
        type: 'attack',
        quality: 'Địa Giai',
        icon: '💥',
        description: 'Sai khiến thi khôi lao vào kích nổ tự sát, gây oai lực khổng lồ kèm 50% cơ hội làm choáng 1 lượt.',
        costs: { mana: 130 },
        cooldown: 8,
        effects: { damageMult: 3.8, stunChance: 0.5 }
    }
};

export const getTechniqueById = (id) => TECHNIQUES[id];
export const getSecretTechniqueById = (id) => SECRET_TECHNIQUES[id];

