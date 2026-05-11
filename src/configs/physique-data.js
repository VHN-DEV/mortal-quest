/**
 * Hệ thống Thể Chất (Physique Data)
 */

export const PHYSIQUE_GRADES = {
    'PHAM': { id: 1, name: 'Phàm Thể', color: '#9ca3af', multiplier: 1.0 },
    'LINH': { id: 2, name: 'Linh Thể', color: '#4ade80', multiplier: 1.5 },
    'BAO': { id: 3, name: 'Bảo Thể', color: '#3b82f6', multiplier: 2.2 },
    'CHIEN': { id: 4, name: 'Chiến Thể', color: '#a855f7', multiplier: 3.0 },
    'THANH': { id: 5, name: 'Thánh Thể', color: '#f59e0b', multiplier: 4.5 },
    'DAO': { id: 6, name: 'Đạo Thể', color: '#ec4899', multiplier: 7.0 },
    'TIEN': { id: 7, name: 'Tiên Thể', color: '#ef4444', multiplier: 12.0 },
    'HONG_MONG': { id: 8, name: 'Hồng Mông Thể', color: '#ffffff', multiplier: 25.0 }
};

export const PHYSIQUE_STAGES = {
    'SO_KHAI': { id: 1, name: 'Sơ Khai', multiplier: 1.0 },
    'TIEU_THANH': { id: 2, name: 'Tiểu Thành', multiplier: 1.5 },
    'DAI_THANH': { id: 3, name: 'Đại Thành', multiplier: 2.5 },
    'VIEN_MAN': { id: 4, name: 'Viên Mãn', multiplier: 4.0 },
    'HOAN_MY': { id: 5, name: 'Hoàn Mỹ', multiplier: 7.0 }
};

export const PHYSIQUE_CATEGORIES = {
    'PHAM': 'Phàm Thể',
    'LINH': 'Linh Thể',
    'BAO': 'Bảo Thể',
    'CHIEN': 'Chiến Thể',
    'THANH': 'Thánh Thể',
    'DAO': 'Đạo Thể',
    'MA': 'Ma Thể',
    'HON': 'Hồn Thể',
    'YEU': 'Yêu Thể',
    'CAM_KY': 'Cấm Kỵ Thể Chất'
};

export const PHYSIQUES = {
    // 1. Phàm Thể
    'binh_thuong': {
        id: 'binh_thuong',
        name: 'Phàm Thể',
        category: 'PHAM',
        grade: 'PHAM',
        desc: 'Cơ thể bình thường, không có buff đặc biệt.',
        bonus: { tvps: 1.0 }
    },

    // 2. Linh Thể
    'hoa_linh_the': {
        id: 'hoa_linh_the',
        name: 'Hỏa Linh Thể',
        category: 'LINH',
        grade: 'LINH',
        element: 'Hỏa',
        desc: 'Tăng hấp thu linh khí hỏa hệ, phù hợp công pháp hỏa.',
        bonus: { tvps: 1.5, fireDmg: 0.2 },
        evolution: 'cuu_duong_linh_the'
    },
    'thuy_linh_the': {
        id: 'thuy_linh_the',
        name: 'Thủy Linh Thể',
        category: 'LINH',
        grade: 'LINH',
        element: 'Thủy',
        desc: 'Tăng hấp thu linh khí thủy hệ.',
        bonus: { tvps: 1.5, waterDmg: 0.2 }
    },
    'loi_linh_the': {
        id: 'loi_linh_the',
        name: 'Lôi Linh Thể',
        category: 'LINH',
        grade: 'LINH',
        element: 'Lôi',
        desc: 'Sở hữu linh căn lôi bẩm sinh, sát thương lôi cực mạnh.',
        bonus: { tvps: 1.8, thunderDmg: 0.3 }
    },

    // 3. Bảo Thể
    'kim_cuong_bao_the': {
        id: 'kim_cuong_bao_the',
        name: 'Kim Cương Bảo Thể',
        category: 'BAO',
        grade: 'BAO',
        desc: 'Thân thể cứng như kim cương, phòng ngự cực mạnh.',
        bonus: { def: 50, maxHp: 200, bodyExpSpeed: 1.5 }
    },
    'truong_sinh_the': {
        id: 'truong_sinh_the',
        name: 'Trường Sinh Thể',
        category: 'BAO',
        grade: 'BAO',
        desc: 'Sinh mệnh lực dồi dào, tăng mạnh thọ nguyên.',
        bonus: { maxAge: 500, maxHp: 500, lifeSteal: 0.05 }
    },

    // 4. Chiến Thể
    'ba_vuong_chien_the': {
        id: 'ba_vuong_chien_the',
        name: 'Bá Vương Chiến Thể',
        category: 'CHIEN',
        grade: 'CHIEN',
        desc: 'Bản năng chiến đấu thiên bẩm, càng đánh càng mạnh.',
        bonus: { atk: 100, critRate: 0.1, critDmg: 0.5 }
    },
    'dau_chien_thanh_the': {
        id: 'dau_chien_thanh_the',
        name: 'Đấu Chiến Thánh Thể',
        category: 'CHIEN',
        grade: 'THANH',
        desc: 'Chiến thể cấp Thánh, uy áp thiên hạ.',
        bonus: { atk: 300, spd: 50, critRate: 0.2 },
        phenomenon: 'Chiến Thần Phụ Thể'
    },

    // 5. Thánh Thể
    'hoang_co_thanh_the': {
        id: 'hoang_co_thanh_the',
        name: 'Hoang Cổ Thánh Thể',
        category: 'THANH',
        grade: 'THANH',
        desc: 'Thân thể mạnh nhất từ cổ chí kim, HP và Phòng thủ cực cao.',
        bonus: { maxHp: 2000, def: 200, atk: 100, qiAbsorb: 2.0 },
        phenomenon: 'Kim Thân Bất Diệt'
    },
    'thai_duong_thanh_the': {
        id: 'thai_duong_thanh_the',
        name: 'Thái Dương Thánh Thể',
        category: 'THANH',
        grade: 'THANH',
        element: 'Dương',
        desc: 'Mang trong mình sức mạnh của mặt trời.',
        bonus: { tvps: 4.0, fireDmg: 1.0, qiAbsorb: 1.5 },
        phenomenon: 'Đại Nhật Lâm Không'
    },

    // 6. Đạo Thể
    'tien_thien_dao_the': {
        id: 'tien_thien_dao_the',
        name: 'Tiên Thiên Đạo Thể',
        category: 'DAO',
        grade: 'DAO',
        desc: 'Gần gũi với thiên đạo, dễ dàng cảm ngộ pháp tắc.',
        bonus: { tvps: 6.0, daoVun: 50, soulExpSpeed: 2.0 },
        phenomenon: 'Tử Khí Đông Lai'
    },
    'hon_don_the': {
        id: 'hon_don_the',
        name: 'Hỗn Độn Thể',
        category: 'DAO',
        grade: 'HONG_MONG',
        desc: 'Thể chất vạn cổ vô nhất, dung hợp mọi loại linh lực.',
        bonus: { tvps: 10.0, atk: 500, def: 300, maxHp: 5000, qiAbsorb: 5.0 },
        phenomenon: 'Hỗn Độn Khai Thiên',
        needAwaken: true
    },

    // 7. Ma Thể
    'thien_ma_the': {
        id: 'thien_ma_the',
        name: 'Thiên Ma Thể',
        category: 'MA',
        grade: 'THANH',
        desc: 'Ma khí bẩm sinh, chiến lực tăng vọt khi phẫn nộ.',
        bonus: { atk: 400, murderQi: 100, tvps: 3.5 },
        phenomenon: 'Ma Thần Hàng Thế'
    },

    // 8. Hồn Thể
    'thai_hu_hon_the': {
        id: 'thai_hu_hon_the',
        name: 'Thái Hư Hồn Thể',
        category: 'HON',
        grade: 'THANH',
        desc: 'Linh hồn cường đại, thần thức vô biên.',
        bonus: { maxMana: 2000, soulPierce: 0.3, soulExpSpeed: 3.0 }
    },

    // 9. Yêu Thể
    'chan_long_the': {
        id: 'chan_long_the',
        name: 'Chân Long Thể',
        category: 'YEU',
        grade: 'TIEN',
        desc: 'Mang huyết mạch Chân Long, thân thể cường hãn vô đối.',
        bonus: { maxHp: 10000, atk: 1000, def: 500, spd: 100 },
        phenomenon: 'Long Đằng Tứ Hải'
    },

    // 10. Cấm Kỵ
    'tuyet_mach_phe_the': {
        id: 'tuyet_mach_phe_the',
        name: 'Tuyệt Mạch Phế Thể',
        category: 'CAM_KY',
        grade: 'PHAM',
        desc: 'Kinh mạch bế tắc, không thể tu luyện bình thường nhưng ẩn chứa bí mật.',
        bonus: { tvps: 0.1, maxHp: 500, luck: 200 }
    },
    'thien_sat_co_tinh': {
        id: 'thien_sat_co_tinh',
        name: 'Thiên Sát Cô Tinh',
        category: 'CAM_KY',
        grade: 'BAO',
        desc: 'Khắc tinh của người thân, vạn sự xui xẻo nhưng mệnh cứng.',
        bonus: { luck: -100, atk: 200, murderQi: 50 }
    }
};

/**
 * Lấy thông tin thể chất theo ID
 */
export const getPhysiqueById = (id) => PHYSIQUES[id] || PHYSIQUES['binh_thuong'];

/**
 * Tính toán chỉ số bonus dựa trên mức độ thức tỉnh
 */
export const getPhysiqueAwakenBonus = (physiqueId, stageId) => {
    const physique = getPhysiqueById(physiqueId);
    const stage = PHYSIQUE_STAGES[stageId] || PHYSIQUE_STAGES['SO_KHAI'];
    const grade = PHYSIQUE_GRADES[physique.grade] || PHYSIQUE_GRADES['PHAM'];
    
    // Hệ số tổng hợp: Grade Multiplier * Stage Multiplier
    const totalMult = grade.multiplier * stage.multiplier;
    
    const finalBonus = {};
    for (const [key, value] of Object.entries(physique.bonus)) {
        if (typeof value === 'number') {
            // Các chỉ số như atk, def, hp là cộng thêm (flat), được nhân với hệ số thức tỉnh
            // Các chỉ số như tvps, qiAbsorb là nhân thêm (multiplier)
            if (['atk', 'def', 'maxHp', 'maxMana', 'maxAge', 'luck', 'daoVun', 'murderQi'].includes(key)) {
                finalBonus[key] = value * totalMult;
            } else {
                // Ví dụ tvps: 1.5 -> tăng 50% * totalMult
                finalBonus[key] = 1 + (value - 1) * totalMult;
            }
        }
    }
    
    return finalBonus;
};
