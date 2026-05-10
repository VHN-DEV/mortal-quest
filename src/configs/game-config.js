/**
 * CẤU HÌNH HỆ THỐNG PHÀM NHÂN VẤN ĐẠO
 * Bạn có thể thay đổi các giá trị dưới đây để cân bằng lại game.
 */

export const GAME_CONFIG = {
    // Tỷ lệ hồi phục
    REGEN_RATES: {
        STAMINA: 0.1,    // Thể lực mỗi giây
        MANA: 0.05,      // Linh lực mỗi giây
        HP: 0.02         // Khí huyết mỗi giây
    },

    // Hệ số chiến đấu
    COMBAT: {
        BASE_EXP_REWARD: 0.5,     // Tu vi nhận được = maxHp quái * hệ số này
        LOOT_CHANCE: {
            COMMON: 0.5,
            RARE: 0.2,
            LEGENDARY: 0.05
        },
        CRIT_CHANCE: 0.1,         // Tỷ lệ bạo kích cơ bản
        CRIT_MULTIPLIER: 2.0      // Hệ số sát thương bạo kích
    },

    // Hệ số NPC
    NPC: {
        MAX_PARTY_SIZE: 3,
        RELATIONSHIP_LEVELS: {
            DAO_LU: 90,
            TRI_KY: 70,
            BANG_HUU: 50
        },
        QI_DEVIATION_CHANCE: 0.05, // Tỷ lệ tẩu hỏa nhập ma khi song tu
        CULTIVATION_SPEED_MULT: 0.5 // Tốc độ tu luyện của NPC so với cảnh giới
    },

    // Khác
    STAMINA_COST_CULTIVATE: 1,
    STAMINA_COST_MOVE: 5,
    STAMINA_COST_MISSION: 10
};

// Bạn có thể thêm các mảng dữ liệu khác tại đây nếu muốn gộp chung
// Hoặc chỉnh sửa trực tiếp trong các file src/data/*.js
