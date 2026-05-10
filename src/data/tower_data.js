/**
 * DỮ LIỆU ĐAN THÁP (THÁNH ĐỊA LUYỆN ĐAN)
 */

export const TOWER_LEVELS = [
    {
        floor: 1,
        name: "Ngoại Tháp - Tầng 1",
        description: "Nơi tập trung các luyện dược sư trẻ tuổi tài năng.",
        minAlchemyLevel: 3,
        rewards: { expMult: 1.2 }
    },
    {
        floor: 2,
        name: "Nội Tháp - Tầng 2",
        description: "Chỉ dành cho những người có thần thức mạnh mẽ.",
        minAlchemyLevel: 5,
        rewards: { expMult: 1.5, qualityBonus: 0.1 }
    },
    {
        floor: 3,
        name: "Thánh Đan Điện",
        description: "Nơi cư ngụ của các bậc Đan Thánh.",
        minAlchemyLevel: 7,
        rewards: { expMult: 2.0, qualityBonus: 0.25 }
    }
];

export const TOWER_MASTERS = [
    {
        id: 'huyen_linh_tu',
        name: 'Huyền Linh Tử',
        title: 'Đan Thánh',
        description: 'Bậc thầy về dung hợp dị hỏa.',
        requirements: { alchemyLevel: 6, hasFlame: true }
    }
];
