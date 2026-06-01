/**
 * Cấu hình Hệ thống Trạng thái (Status Effects / Buff & Debuff)
 * Phù hợp với thế giới quan "Phàm Nhân Tu Tiên Truyện"
 */

export const STATUS_EFFECT_CATEGORIES = {
    BUFF: { id: 'BUFF', name: 'Tăng Cường', color: '#10B981' },
    DEBUFF: { id: 'DEBUFF', name: 'Suy Yếu', color: '#EF4444' },
    BODY: { id: 'BODY', name: 'Thể Chất', color: '#F59E0B' },
    SOUL: { id: 'SOUL', name: 'Thần Hồn', color: '#8B5CF6' },
    QI: { id: 'QI', name: 'Nguyên Khí', color: '#EC4899' },
    ELEMENTAL: { id: 'ELEMENTAL', name: 'Ngũ Hành', color: '#3B82F6' },
    CONTROL: { id: 'CONTROL', name: 'Khống Chế', color: '#6B7280' },
    TRIBULATION: { id: 'TRIBULATION', name: 'Thiên Kiếp', color: '#EF4444' }
};

export const STATUS_EFFECT_TEMPLATES = {
    // --- I. BUFF (TĂNG CƯỜNG) ---
    cuong_no: {
        id: 'cuong_no',
        name: 'Cuồng Nộ',
        category: 'BUFF',
        type: 'buff',
        icon: '🔥',
        desc: 'Bí thuật bộc phát kinh mạch giúp tăng mạnh Công kích (+30%) và Tốc độ (+20%), nhưng làm giảm Phòng ngự (-15%).',
        maxStacks: 1,
        duration: 120, // 2 phút
        combatTurns: 8,
        isCureable: false,
        effects: {
            atk: 0.3,
            spd: 0.2,
            def: -0.15
        }
    },
    thieu_dot_tinh_huyet: {
        id: 'thieu_dot_tinh_huyet',
        name: 'Thiêu Đốt Tinh Huyết',
        category: 'BUFF',
        type: 'buff',
        icon: '🩸',
        desc: 'Đốt cháy căn cơ tinh khí giúp tăng cường 50% toàn bộ thuộc tính, nhưng liên tục tự hao tổn Khí huyết và Thọ nguyên.',
        maxStacks: 1,
        duration: 60,
        combatTurns: 5,
        isCureable: false,
        effects: {
            atk: 0.5,
            def: 0.5,
            spd: 0.5,
            maxHp: 0.5,
            maxMana: 0.5,
            dot_hp: -0.02, // Mất 2% maxHP mỗi giây
            burn_lifespan: 0.05 // Hao tổn thọ nguyên theo giây
        }
    },
    linh_khi_sung_man: {
        id: 'linh_khi_sung_man',
        name: 'Linh Khí Sung Mãn',
        category: 'BUFF',
        type: 'buff',
        icon: '💎',
        desc: 'Linh khí tràn đầy khắp đan điền, gia tăng Tốc độ hồi pháp lực (+20%) và Uy lực pháp thuật (+15%).',
        maxStacks: 5,
        duration: 180,
        combatTurns: 12,
        isCureable: true,
        effects: {
            mana_regen: 0.2,
            spell_amp: 0.15
        }
    },
    tam_canh_minh_tinh: {
        id: 'tam_canh_minh_tinh',
        name: 'Tâm Cảnh Minh Tịnh',
        category: 'BUFF',
        type: 'buff',
        icon: '🧘',
        desc: 'Tâm thần thanh tĩnh không một gợn sóng, tăng mạnh Kháng Tâm Ma (+30%) và Tỷ lệ đột phá thành công (+20%).',
        maxStacks: 1,
        duration: 300,
        combatTurns: 20,
        isCureable: false,
        effects: {
            heart_demon_res: 0.3,
            breakthrough_rate: 0.2
        }
    },
    kim_cang_ho_the: {
        id: 'kim_cang_ho_the',
        name: 'Kim Cang Hộ Thể',
        category: 'BUFF',
        type: 'buff',
        icon: '🛡️',
        desc: 'Pháp thuật hoặc linh phù đúc thành hộ thể kim cang, tăng Phòng ngự (+40%) và Né tránh (+25%).',
        maxStacks: 3,
        duration: 150,
        combatTurns: 10,
        isCureable: true,
        effects: {
            def: 0.4,
            dodge: 0.25
        }
    },
    than_thuc_tang_phuc: {
        id: 'than_thuc_tang_phuc',
        name: 'Thần Thức Tăng Phúc',
        category: 'BUFF',
        type: 'buff',
        icon: '👁️',
        desc: 'Thần thức nhận được sự khuếch đại mạnh mẽ từ pháp bảo hoặc đan dược, tăng Thần thức (+30%) và Khống chế (+20%).',
        maxStacks: 1,
        duration: 180,
        combatTurns: 12,
        isCureable: true,
        effects: {
            divine_sense: 0.3,
            control_chance: 0.2
        }
    },

    // --- II. DEBUFF (SUY YẾU) & THỂ CHẤT ---
    noi_thuong_nhe: {
        id: 'noi_thuong_nhe',
        name: 'Nội Thương Nhẹ',
        category: 'BODY',
        type: 'debuff',
        icon: '⚠️',
        desc: 'Vết thương nội thể không nặng lắm, làm giảm nhẹ sức chiến đấu: -10% Công kích, -10% Tốc độ hồi máu.',
        maxStacks: 10,
        duration: 240, // 4 phút
        combatTurns: 15,
        isCureable: true,
        effects: {
            atk: -0.1,
            hp_regen: -0.1
        }
    },
    noi_thuong: {
        id: 'noi_thuong',
        name: 'Nội Thương',
        category: 'BODY',
        type: 'debuff',
        icon: '🤕',
        desc: 'Kinh mạch hoặc phủ tạng bị chấn động trung bình: -20% Công kích, -20% Tốc độ hồi máu.',
        maxStacks: 10,
        duration: 600, // 10 phút
        combatTurns: 30,
        isCureable: true,
        effects: {
            atk: -0.2,
            hp_regen: -0.2
        }
    },
    trong_thuong: {
        id: 'trong_thuong',
        name: 'Trọng Thương',
        category: 'BODY',
        type: 'debuff',
        icon: '🩸',
        desc: 'Ngũ tạng lục phủ tổn thương nghiêm trọng, nguyên khí tản mạn: -40% Công kích, -40% Tốc độ hồi máu, giảm mạnh tốc độ di chuyển.',
        maxStacks: 5,
        duration: 1200, // 20 phút
        combatTurns: 60,
        isCureable: true,
        effects: {
            atk: -0.4,
            spd: -0.2,
            hp_regen: -0.4
        }
    },
    hap_hoi: {
        id: 'hap_hoi',
        name: 'Hấp Hối',
        category: 'BODY',
        type: 'debuff',
        icon: '☠️',
        desc: 'Cận kề cái chết, thần thức mơ hồ, sinh mệnh lay lắt: -70% Công kích, -70% Tốc độ hồi phục, -30% Thân pháp.',
        maxStacks: 1,
        duration: Infinity, // Tồn tại vĩnh viễn đến khi trị thương
        combatTurns: 999,
        isCureable: true,
        effects: {
            atk: -0.7,
            def: -0.3,
            spd: -0.3,
            hp_regen: -0.7
        }
    },
    kinh_mach_ton_thuong: {
        id: 'kinh_mach_ton_thuong',
        name: 'Kinh Mạch Tổn Thương',
        category: 'BODY',
        type: 'debuff',
        icon: '⚡',
        desc: 'Kinh mạch vận hành linh khí bị nứt vỡ hoặc tắc nghẽn, làm giảm Hồi pháp lực (-50%) và Tốc độ tu luyện (-30%).',
        maxStacks: 5,
        duration: 900, // 15 phút
        combatTurns: 40,
        isCureable: true,
        effects: {
            mana_regen: -0.5,
            tu_vi_speed: -0.3
        }
    },
    chan_nguyen_hon_loan: {
        id: 'chan_nguyen_hon_loan',
        name: 'Chân Nguyên Hỗn Loạn',
        category: 'QI',
        type: 'debuff',
        icon: '🌀',
        desc: 'Pháp lực cuồn cuộn không theo quy luật, khiến tiêu hao Pháp lực khi sử dụng chiêu thức kỹ năng tăng thêm 50%.',
        maxStacks: 3,
        duration: 300,
        combatTurns: 15,
        isCureable: true,
        effects: {
            mana_cost: 0.5
        }
    },
    khi_huyet_suy_kiet: {
        id: 'khi_huyet_suy_kiet',
        name: 'Khí Huyết Suy Kiệt',
        category: 'BODY',
        type: 'debuff',
        icon: '🥀',
        desc: 'Thiếu hụt huyết khí nghiêm trọng, giảm Khí huyết tối đa (-30%) và giảm Hồi HP (-50%).',
        maxStacks: 5,
        duration: 600,
        combatTurns: 25,
        isCureable: true,
        effects: {
            maxHp: -0.3,
            hp_regen: -0.5
        }
    },
    linh_luc_kho_kiet: {
        id: 'linh_luc_kho_kiet',
        name: 'Linh Lực Khô Kiệt',
        category: 'QI',
        type: 'debuff',
        icon: '🥛',
        desc: 'Linh hải trống rỗng, linh lực cạn kiệt: Giảm Pháp lực tối đa (-50%) và giảm Uy lực chiêu thức pháp thuật (-30%).',
        maxStacks: 3,
        duration: 450,
        combatTurns: 20,
        isCureable: true,
        effects: {
            maxMana: -0.5,
            spell_amp: -0.3
        }
    },

    // --- III. DEBUFF THẦN HỒN ---
    than_hon_chan_dong: {
        id: 'than_hon_chan_dong',
        name: 'Thần Hồn Chấn Động',
        category: 'SOUL',
        type: 'debuff',
        icon: '🧠',
        desc: 'Bị công kích tinh thần hoặc bí thuật chấn nhiếp, làm giảm mạnh Thần thức (-30%).',
        maxStacks: 3,
        duration: 240,
        combatTurns: 10,
        isCureable: true,
        effects: {
            divine_sense: -0.3
        }
    },
    than_hon_ton_thuong: {
        id: 'than_hon_ton_thuong',
        name: 'Thần Hồn Tổn Thương',
        category: 'SOUL',
        type: 'debuff',
        icon: '🌌',
        desc: 'Thần hồn bị nứt rách hoặc tổn thương âm ỉ, làm giảm Tỷ lệ bạo kích (-30%) và Né tránh (-30%).',
        maxStacks: 3,
        duration: 900,
        combatTurns: 30,
        isCureable: true,
        effects: {
            critRate: -0.3,
            dodge: -0.3
        }
    },
    huyen_canh: {
        id: 'huyen_canh',
        name: 'Huyễn Cảnh',
        category: 'SOUL',
        type: 'debuff',
        icon: '🌀',
        desc: 'Tâm thần rơi vào ảo cảnh mơ hồ, giảm Né tránh (-25%) và có 20% xác suất đánh hụt kỹ năng.',
        maxStacks: 1,
        duration: 120,
        combatTurns: 5,
        isCureable: true,
        effects: {
            dodge: -0.25,
            miss_chance: 0.2
        }
    },
    nhiep_hon: {
        id: 'nhiep_hon',
        name: 'Nhiếp Hồn',
        category: 'SOUL',
        type: 'debuff',
        icon: '👁️‍🗨️',
        desc: 'Thần trí bị khống chế tuyệt đối, giảm 30% toàn bộ thuộc tính và bị Định thân (Choáng) không thể hành động.',
        maxStacks: 1,
        duration: 45,
        combatTurns: 2,
        isCureable: false,
        effects: {
            atk: -0.3,
            def: -0.3,
            spd: -0.3,
            stun: 1
        }
    },
    phong_hon: {
        id: 'phong_hon',
        name: 'Phong Hồn',
        category: 'SOUL',
        type: 'debuff',
        icon: '🔒',
        desc: 'Hồn lực bị khóa chặt, không thể sử dụng kỹ năng liên quan đến Thần thức hoặc Thần thuật.',
        maxStacks: 1,
        duration: 90,
        combatTurns: 4,
        isCureable: true,
        effects: {
            silence_soul: 1
        }
    },

    // --- IV. DEBUFF NGUYÊN KHÍ ---
    tau_hoa_nhap_ma: {
        id: 'tau_hoa_nhap_ma',
        name: 'Tẩu Hỏa Nhập Ma',
        category: 'QI',
        type: 'debuff',
        icon: '👹',
        desc: 'Pháp lực đi ngược chiều kinh mạch, tâm ma xâm lấn. Liên tục tự thiêu đốt Khí huyết (-1.5% maxHP/giây) và Pháp lực (-2% maxMana/giây).',
        maxStacks: 1,
        duration: Infinity, // Tồn tại vĩnh viễn đến khi đột phá hoặc uống đan dược giải trừ
        combatTurns: 999,
        isCureable: true,
        effects: {
            dot_hp: -0.015,
            dot_mana: -0.02
        }
    },
    can_co_bat_on: {
        id: 'can_co_bat_on',
        name: 'Căn Cơ Bất Ổn',
        category: 'QI',
        type: 'debuff',
        icon: '🧱',
        desc: 'Đột phá vội vã hoặc linh lực bất thuần khiến nền móng tu vi bất ổn, giảm Tỷ lệ đột phá thành công (-30%).',
        maxStacks: 1,
        duration: Infinity,
        combatTurns: 999,
        isCureable: true,
        effects: {
            breakthrough_rate: -0.3
        }
    },
    nguyen_khi_dai_thuong: {
        id: 'nguyen_khi_dai_thuong',
        name: 'Nguyên Khí Đại Thương',
        category: 'QI',
        type: 'debuff',
        icon: '🥀',
        desc: 'Tổn hao nguyên khí thâm căn cố đế, làm giảm 30% toàn bộ thuộc tính chiến đấu cốt lõi.',
        maxStacks: 1,
        duration: 1800, // 30 phút
        combatTurns: 80,
        isCureable: true,
        effects: {
            atk: -0.3,
            def: -0.3,
            spd: -0.3,
            maxHp: -0.3,
            maxMana: -0.3
        }
    },

    // --- V. NGŨ HÀNH TRẠNG THÁI ---
    hoa_doc: {
        id: 'hoa_doc',
        name: 'Hỏa Độc (Thiêu Đốt)',
        category: 'ELEMENTAL',
        type: 'debuff',
        icon: '🔥',
        desc: 'Nhiễm hỏa độc ngũ hành, thiêu đốt sinh mệnh cốt lõi: Mất 1.5% Khí huyết hiện tại mỗi giây/lượt.',
        maxStacks: 10,
        duration: 60,
        combatTurns: 5,
        isCureable: true,
        effects: {
            dot_hp: -0.015
        }
    },
    han_doc: {
        id: 'han_doc',
        name: 'Hàn Độc (Lạnh Cóng)',
        category: 'ELEMENTAL',
        type: 'debuff',
        icon: '❄️',
        desc: 'Băng hàn chi khí xâm nhập xương tủy, làm đông cứng thân pháp: Giảm Thân pháp/Tốc độ (-30%).',
        maxStacks: 5,
        duration: 90,
        combatTurns: 6,
        isCureable: true,
        effects: {
            spd: -0.3
        }
    },
    loi_phe: {
        id: 'loi_phe',
        name: 'Lôi Phệ (Tê Liệt)',
        category: 'ELEMENTAL',
        type: 'debuff',
        icon: '⚡',
        desc: 'Lôi điện lực tàn phá kinh thể, làm mất khả năng phòng ngự: Giảm mạnh Phòng thủ (-30%).',
        maxStacks: 5,
        duration: 60,
        combatTurns: 4,
        isCureable: true,
        effects: {
            def: -0.3
        }
    },
    moc_doc: {
        id: 'moc_doc',
        name: 'Mộc Độc (Độc Tố)',
        category: 'ELEMENTAL',
        type: 'debuff',
        icon: '🌿',
        desc: 'Cổ độc mộc sinh trưởng, hút sinh mệnh Khí huyết bổ sung cho đối thủ: Trừ 1% Khí huyết mỗi lượt/giây.',
        maxStacks: 10,
        duration: 120,
        combatTurns: 8,
        isCureable: true,
        effects: {
            dot_hp: -0.01
        }
    },
    tho_tre: {
        id: 'tho_tre',
        name: 'Thổ Trệ (Chậm Chạp)',
        category: 'ELEMENTAL',
        type: 'debuff',
        icon: '🪨',
        desc: 'Trọng lực thổ tính áp chế, làm mất đi khả năng xê dịch linh hoạt: Giảm Né tránh (-30%).',
        maxStacks: 5,
        duration: 90,
        combatTurns: 6,
        isCureable: true,
        effects: {
            dodge: -0.3
        }
    },

    // --- VI. KHỐNG CHẾ ---
    dinh_than: {
        id: 'dinh_than',
        name: 'Định Thân',
        category: 'CONTROL',
        type: 'debuff',
        icon: '🧘‍♂️',
        desc: 'Thân thể bị hóa đá hoặc giam cầm không thể cử động, giảm mạnh Né tránh (-50%) và choáng lượt.',
        maxStacks: 1,
        duration: 30,
        combatTurns: 2,
        isCureable: false,
        effects: {
            dodge: -0.5,
            stun: 1
        }
    },
    phong_linh: {
        id: 'phong_linh',
        name: 'Phong Linh',
        category: 'CONTROL',
        type: 'debuff',
        icon: '🔇',
        desc: 'Khóa chặt linh lực vận hành, phong bế pháp thuật khiến không thể sử dụng linh lực kỹ năng.',
        maxStacks: 1,
        duration: 60,
        combatTurns: 4,
        isCureable: true,
        effects: {
            silence_spell: 1
        }
    },
    tran_ap: {
        id: 'tran_ap',
        name: 'Trấn Áp',
        category: 'CONTROL',
        type: 'debuff',
        icon: '🏋️',
        desc: 'Sức mạnh thần cấp áp xuống đỉnh đầu, ép giảm 20% toàn bộ thuộc tính chiến đấu.',
        maxStacks: 3,
        duration: 120,
        combatTurns: 5,
        isCureable: false,
        effects: {
            atk: -0.2,
            def: -0.2,
            spd: -0.2
        }
    },
    cam_che: {
        id: 'cam_che',
        name: 'Cấm Chế Pháp Bảo',
        category: 'CONTROL',
        type: 'debuff',
        icon: '🕸️',
        desc: 'Trận pháp cấm chế hoặc phù văn ăn mòn pháp bảo, giảm 20% Phòng thủ và Công kích.',
        maxStacks: 3,
        duration: 120,
        combatTurns: 5,
        isCureable: true,
        effects: {
            atk: -0.2,
            def: -0.2
        }
    },
    phong_cam: {
        id: 'phong_cam',
        name: 'Phong Cấm Chiêu Thức',
        category: 'CONTROL',
        type: 'debuff',
        icon: '❌',
        desc: 'Bí thuật phong ấn uy lực kỹ năng, giảm 30% hiệu quả của tất cả chiêu thức.',
        maxStacks: 1,
        duration: 90,
        combatTurns: 4,
        isCureable: true,
        effects: {
            spell_amp: -0.3
        }
    },

    // --- VII. THIÊN KIẾP ---
    thien_loi_gia_than: {
        id: 'thien_loi_gia_than',
        name: 'Thiên Lôi Gia Thân',
        category: 'TRIBULATION',
        type: 'debuff',
        icon: '⚡',
        desc: 'Thiên lôi chi kiếp khóa chặt khí cơ, khiến sát thương lôi tính nhận vào tăng thêm 50%.',
        maxStacks: 1,
        duration: 300,
        combatTurns: 15,
        isCureable: false,
        effects: {
            thunder_damage_taken: 0.5
        }
    },
    tam_ma_xam_thuc: {
        id: 'tam_ma_xam_thuc',
        name: 'Tâm Ma Xâm Thực',
        category: 'TRIBULATION',
        type: 'debuff',
        icon: '👁️',
        desc: 'Tâm ma sinh sôi quấy nhiễu nguyên thần, làm giảm Tỷ lệ đột phá thành công (-20%) và tăng mạnh độ bất ổn căn cơ.',
        maxStacks: 1,
        duration: Infinity,
        combatTurns: 999,
        isCureable: true,
        effects: {
            breakthrough_rate: -0.2,
            stability: -0.3
        }
    },
    thien_dao_ap_che: {
        id: 'thien_dao_ap_che',
        name: 'Thiên Đạo Áp Chế',
        category: 'TRIBULATION',
        type: 'debuff',
        icon: '🌌',
        desc: 'Thiên uy tối cao áp chế vạn vật linh khí, giảm 20% toàn bộ thuộc tính chiến đấu và Tốc độ tu luyện.',
        maxStacks: 1,
        duration: 600,
        combatTurns: 20,
        isCureable: false,
        effects: {
            atk: -0.2,
            def: -0.2,
            spd: -0.2,
            tu_vi_speed: -0.2
        }
    },
    chan_nguyen_bao_dong: {
        id: 'chan_nguyen_bao_dong',
        name: 'Chân Nguyên Bạo Động',
        category: 'QI',
        type: 'debuff',
        icon: '💥',
        desc: 'Nén pháp lực không thành dẫn đến chân nguyên nổi loạn, giảm 30% Phòng ngự và mất 2% HP tối đa mỗi giây.',
        maxStacks: 1,
        duration: 300,
        combatTurns: 15,
        isCureable: true,
        effects: {
            def: -0.3,
            dot_hp: -0.02
        }
    },
    linh_khi_qua_tai: {
        id: 'linh_khi_qua_tai',
        name: 'Linh Khí Quá Tải',
        category: 'QI',
        type: 'debuff',
        icon: '🎈',
        desc: 'Linh lực tràn trề kinh mạch quá tải, giảm 20% Né tránh và 15% Tốc độ chiến đấu.',
        maxStacks: 1,
        duration: 600,
        combatTurns: 25,
        isCureable: true,
        effects: {
            dodge: -0.2,
            spd: -0.15
        }
    },
    ap_luc_thien_dao: {
        id: 'ap_luc_thien_dao',
        name: 'Áp Lực Thiên Đạo',
        category: 'TRIBULATION',
        type: 'debuff',
        icon: '⚡',
        desc: 'Nén cảnh giới quá lâu hứng chịu lực ép từ Thiên Đạo, giảm 15% Công kích và 10% Tốc độ tu luyện.',
        maxStacks: 1,
        duration: Infinity,
        combatTurns: 999,
        isCureable: false,
        effects: {
            atk: -0.15,
            tu_vi_speed: -0.10
        }
    },
    khi_huyet_bao_dong: {
        id: 'khi_huyet_bao_dong',
        name: 'Khí Huyết Bạo Động',
        category: 'BODY',
        type: 'debuff',
        icon: '🩸',
        desc: 'Khí huyết tích tụ quá mức bạo trướng kinh mạch, liên tục thiêu đốt nhục thân. Giảm 30% Phòng ngự và mất 1% HP tối đa mỗi giây.',
        maxStacks: 1,
        duration: Infinity,
        combatTurns: 999,
        isCureable: true,
        effects: {
            def: -0.3,
            dot_hp: -0.01
        }
    },
    than_hon_qua_tai_debuff: {
        id: 'than_hon_qua_tai_debuff',
        name: 'Thần Hồn Quá Tải',
        category: 'SOUL',
        type: 'debuff',
        icon: '🌌',
        desc: 'Thần hải chứa đựng quá nhiều thần hồn năng lượng, sinh ra huyễn ảo và làm giảm tập trung. Giảm 20% Thần thức, 15% Né tránh và +10% xác suất đánh hụt.',
        maxStacks: 1,
        duration: Infinity,
        combatTurns: 999,
        isCureable: false,
        effects: {
            divine_sense: -0.2,
            dodge: -0.15,
            miss_chance: 0.1,
            breakthrough_rate: -0.15
        }
    }
};

/**
 * Lấy cấu hình trạng thái theo ID
 * @param {string} id ID trạng thái
 * @returns {object|null} Cấu hình trạng thái hoặc null
 */
export function getStatusEffectById(id) {
    return STATUS_EFFECT_TEMPLATES[id] || null;
}
