/**
 * Cấu hình toàn bộ tài nguyên hình ảnh của game.
 * Bạn có thể thay đổi các link này để cập nhật hình ảnh mới.
 */
const getAssetUrl = (name, type = 'images', ext = 'png') => {
    return new URL(`../assets/${type}/${name}.${ext}`, import.meta.url).href;
};

export const ASSETS = {
    // Nhân vật & NPC
    portraits: {
        player: getAssetUrl('player'),
        cultivator_male: getAssetUrl('cultivator'),
        cultivator_female: getAssetUrl('cultivator'),
        merchant: getAssetUrl('cultivator'),
        sect_elder: getAssetUrl('cultivator'),
        demon: getAssetUrl('cultivator'),
    },

    // Quái vật & Yêu thú
    enemies: {
        wolf: getAssetUrl('wolf'),
        dragon: getAssetUrl('dragon'),
        demon: getAssetUrl('cultivator'),
        rogue: getAssetUrl('cultivator'),
    },

    // Bối cảnh & Bản đồ
    backgrounds: {
        nhan_gioi: getAssetUrl('cultivation_bg'),
        linh_gioi: getAssetUrl('sect'),
        tien_gioi: getAssetUrl('sect'),
        forest: getAssetUrl('cultivation_bg'),
        cave: getAssetUrl('cultivation_bg'),
        sect: getAssetUrl('sect'),
        cultivation: getAssetUrl('cultivation_bg'),
    },

    // Sự kiện & Kỳ ngộ
    events: {
        ancient_cave: getAssetUrl('cultivation_bg'),
        spiritual_spring: getAssetUrl('cultivation_bg'),
        herb_discovery: getAssetUrl('cultivation_bg'),
        ambush: getAssetUrl('cultivation_bg'),
    },

    // UI Icons (Using emojis as fallbacks for icons)
    ui: {
        stamina: '⚡',
        mana: '💧',
        tu_vi: '🌸',
    }
};
