/**
 * DỮ LIỆU CÔNG HỘI LUYỆN DƯỢC SƯ
 */

export const ALCHEMY_CERTIFICATIONS = [
    {
        level: 1,
        name: "Khảo Hạch Nhất Phẩm",
        requirements: {
            alchemyLevel: 1,
            fee: 100
        },
        task: {
            targetId: 'ngung_khi_dan',
            quantity: 3,
            minQuality: 'Hạ Phẩm'
        },
        reward: {
            title: "Nhất Phẩm Huy Chương",
            reputation: 50,
            lingShi: 200
        }
    },
    {
        level: 2,
        name: "Khảo Hạch Nhị Phẩm",
        requirements: {
            alchemyLevel: 2,
            fee: 500
        },
        task: {
            targetId: 'truc_co_dan',
            quantity: 1,
            minQuality: 'Trung Phẩm'
        },
        reward: {
            title: "Nhị Phẩm Huy Chương",
            reputation: 150,
            lingShi: 1000
        }
    }
];

export const GUILD_MISSIONS = [
    {
        id: 'mission_1',
        name: 'Hỗ Trợ Thành Chủ',
        description: 'Thành chủ cần gấp 5 viên Ngưng Khí Đan để bồi dưỡng thân vệ.',
        targetId: 'ngung_khi_dan',
        quantity: 5,
        rewards: { lingShi: 500, reputation: 20 }
    },
    {
        id: 'mission_2',
        name: 'Cấp Cứu Trưởng Lão',
        description: 'Trưởng lão tông môn bị thương, cần 1 viên Bổ Nguyên Đan chất lượng Thượng Phẩm.',
        targetId: 'bo_nguyen_dan',
        quantity: 1,
        minQuality: 'Thượng Phẩm',
        rewards: { lingShi: 1200, reputation: 50, items: ['ma_thach_ha_pham'] }
    }
];

export const ALCHEMY_ROOMS = [
    {
        id: 'room_basic',
        name: 'Phòng Luyện Đan Phổ Thông',
        fee: 50,
        successBonus: 0.02,
        stabilityBonus: 0.05
    },
    {
        id: 'room_geo',
        name: 'Địa Hỏa Luyện Đan Thất',
        fee: 200,
        successBonus: 0.1,
        stabilityBonus: 0.15,
        qualityBonus: 0.1
    }
];
