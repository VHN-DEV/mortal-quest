/**
 * Cấu hình toàn bộ tài nguyên hình ảnh của game.
 * Bạn có thể thay đổi các link này để cập nhật hình ảnh mới.
 */
const getAssetUrl = (path) => `/src/${path.startsWith('/') ? path.slice(1) : path}`;

export const ASSETS = {
    // Nhân vật & NPC
    portraits: {
        player: getAssetUrl('assets/images/player.png'),
        cultivator_male: getAssetUrl('assets/images/cultivator.png'),
        cultivator_female: getAssetUrl('assets/images/cultivator.png'),
        merchant: getAssetUrl('assets/images/cultivator.png'),
        sect_elder: getAssetUrl('assets/images/cultivator.png'),
        demon: getAssetUrl('assets/images/cultivator.png'),
    },

    // Quái vật & Yêu thú
    enemies: {
        wolf: getAssetUrl('assets/images/wolf.png'),
        dragon: getAssetUrl('assets/images/dragon.png'),
        demon: getAssetUrl('assets/images/cultivator.png'),
        rogue: getAssetUrl('assets/images/cultivator.png'),
    },

    // Bối cảnh & Bản đồ
    backgrounds: {
        nhan_gioi: getAssetUrl('assets/images/cultivation_bg.png'),
        linh_gioi: getAssetUrl('assets/images/sect.png'),
        tien_gioi: getAssetUrl('assets/images/sect.png'),
        forest: getAssetUrl('assets/images/cultivation_bg.png'),
        cave: getAssetUrl('assets/images/cultivation_bg.png'),
        sect: getAssetUrl('assets/images/sect.png'),
        cultivation: getAssetUrl('assets/images/cultivation_bg.png'),
    },

    // Sự kiện & Kỳ ngộ
    events: {
        ancient_cave: getAssetUrl('assets/images/cultivation_bg.png'),
        spiritual_spring: getAssetUrl('assets/images/cultivation_bg.png'),
        herb_discovery: getAssetUrl('assets/images/cultivation_bg.png'),
        ambush: getAssetUrl('assets/images/cultivation_bg.png'),
    },

    // UI Icons (Using emojis as fallbacks for icons)
    ui: {
        stamina: '⚡',
        mana: '💧',
        tu_vi: '🌸',
    }
};
