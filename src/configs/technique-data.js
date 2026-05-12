export const TECHNIQUE_QUALITIES = {
    'BINH_THUONG': { id: 1, name: 'Bình Thường', multiplier: 1.0 },
    'UU_TU': { id: 2, name: 'Ưu Tú', multiplier: 1.2 },
    'TINH_ANH': { id: 3, name: 'Tinh Anh', multiplier: 1.5 },
    'HAOLAM': { id: 4, name: 'Hào Lam', multiplier: 2.0 },
    'HUYEN_THOAI': { id: 5, name: 'Huyền Thoại', multiplier: 3.0 },
    'THAN_THOAI': { id: 6, name: 'Thần Thoại', multiplier: 5.0 }
};

export const TECHNIQUE_LEVELS = {
    'Hoàng': { id: 1, name: 'Hoàng Cấp', multiplier: 1.0 },
    'Huyền': { id: 2, name: 'Huyền Cấp', multiplier: 1.5 },
    'Địa': { id: 3, name: 'Địa Cấp', multiplier: 2.5 },
    'Thiên': { id: 4, name: 'Thiên Cấp', multiplier: 4.0 },
    'Tiên': { id: 5, name: 'Tiên Cấp', multiplier: 7.0 },
    'Đạo': { id: 6, name: 'Đạo Cấp', multiplier: 12.0 }
};

export const MASTERY_LEVELS = [
    { id: 1, name: 'Nhập Môn', threshold: 0, multiplier: 1.0 },
    { id: 2, name: 'Tiểu Thành', threshold: 1000, multiplier: 1.5 },
    { id: 3, name: 'Đại Thành', threshold: 5000, multiplier: 2.5 },
    { id: 4, name: 'Viên Mãn', threshold: 15000, multiplier: 4.0 }
];

export const TECHNIQUES = {
    'truong_xuan_nap_khi_quyet': {
        id: 'truong_xuan_nap_khi_quyet',
        name: 'Trường Xuân Nạp Khí Quyết',
        type: 'Linh Lực',
        element: 'Neutral',
        quality: 'Hoàng',
        description: 'Công pháp nhập môn phổ thông được lưu truyền rộng rãi trong Nhân Giới. Ổn định, dễ tu luyện, ít tẩu hỏa nhập ma.',
        maxStage: 7,
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
        quality: 'Hoàng',
        description: 'Công pháp thuộc tính Hỏa, hấp thu linh khí mang tính nóng bỏng của mặt trời.',
        maxStage: 5,
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
        quality: 'Hoàng',
        description: 'Công pháp thuộc tính Thủy, linh lực mang tính hàn băng, giúp ổn định tâm tính.',
        maxStage: 5,
        stats: { def: 10, mana: 30 },
        effects: { tvps: 1.3, iceDamage: 1.2 }
    },
    'thanh_moc_tam_kinh': {
        id: 'thanh_moc_tam_kinh',
        name: 'Thanh Mộc Tâm Kinh',
        type: 'Linh Lực',
        element: 'Mộc',
        quality: 'Hoàng',
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
        quality: 'Hoàng',
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
        quality: 'Hoàng',
        description: 'Công pháp thuộc tính Thổ, phòng ngự vững chãi như đại địa.',
        maxStage: 5,
        stats: { def: 20, hp: 30 },
        effects: { tvps: 1.2, defMult: 1.15 }
    },
    // Body Refining Techniques
    'cuu_chuyen_kim_than': {
        id: 'cuu_chuyen_kim_than',
        name: 'Cửu Chuyển Kim Thân Quyết',
        type: 'Luyện Thể',
        element: 'Kim',
        quality: 'Huyền',
        description: 'Môn luyện thể cực kỳ cường hãn, tu luyện đến đại thành có thể tay không đón thần binh.',
        maxStage: 9,
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
        quality: 'Hoàng',
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
        quality: 'Huyền',
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
        quality: 'Hoàng',
        description: 'Môn rèn luyện thần hồn cơ bản, giúp tinh thần minh mẫn.',
        maxStage: 3,
        stats: { mana: 50 },
        effects: { soulPs: 1.2 }
    },
    'thanh_moc_truong_sinh_quyet': {
        id: 'thanh_moc_truong_sinh_quyet',
        name: 'Thanh Mộc Trường Sinh Quyết',
        type: 'Linh Lực',
        element: 'Mộc',
        quality: 'Huyền',
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
        quality: 'Huyền',
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
        quality: 'Huyền',
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
        quality: 'Tiên',
        description: 'Phiên bản tiến hóa cổ đại thất truyền của Trường Xuân Quyết. Đạo pháp tự nhiên, trường sinh bất tử.',
        maxStage: 12,
        stats: { hp: 1000, mana: 1000, atk: 500, def: 500, spd: 100 },
        effects: { tvps: 5.0, lifespanBonus: 1000, allRes: 0.3 }
    }
};

export const SECRET_TECHNIQUES = {
    'huyet_don_thuat': {
        id: 'huyet_don_thuat',
        name: 'Huyết Độn Thuật',
        type: 'escape',
        quality: 'Huyền',
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
        quality: 'Huyền',
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
        quality: 'Địa',
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
        quality: 'Huyền',
        icon: '📜',
        description: 'Tăng cường hiểu biết về đan đạo.',
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
        quality: 'Huyền',
        icon: '📜',
        description: 'Tăng cường hiểu biết về luyện khí.',
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
        quality: 'Huyền',
        icon: '📜',
        description: 'Tăng cường hiểu biết về phù lục.',
        masteryBonuses: {
            1: { talismanExpBonus: 1.0 },
            2: { talismanExpBonus: 1.2, talismanSuccess: 1.05 },
            3: { talismanExpBonus: 1.5, talismanSuccess: 1.15, talismanPower: 1.2 },
            4: { talismanExpBonus: 2.0, talismanSuccess: 1.3, talismanPower: 1.5, twinWrite: 0.2 }
            }
    }
};

export const getTechniqueById = (id) => TECHNIQUES[id];
export const getSecretTechniqueById = (id) => SECRET_TECHNIQUES[id];
