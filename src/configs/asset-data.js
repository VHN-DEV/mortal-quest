/**
 * Cấu hình toàn bộ tài nguyên hình ảnh của game.
 * Sử dụng import.meta.glob để đảm bảo Vite đóng gói chính xác các tài nguyên.
 */

// Tự động quét toàn bộ thư mục assets/images
const allImages = import.meta.glob('../assets/images/**/*.{png,jpg,jpeg,webp,gif,svg}', { eager: true, query: '?url', import: 'default' });

/**
 * Lấy URL của tài nguyên dựa trên đường dẫn tương đối.
 * @param {string} path - Đường dẫn tính từ thư mục assets/images/ (VD: 'portraits/player_male')
 */
export const getAssetUrl = (path) => {
    if (!path) return '';
    
    const extensions = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'];
    
    // Nếu path đã có phần mở rộng
    if (path.includes('.')) {
        const fullPath = `../assets/images/${path}`;
        if (allImages[fullPath]) return allImages[fullPath];
        // Thử fix path nếu nó bắt đầu bằng / hoặc ./
        const cleanPath = path.replace(/^\.?\//, '');
        const fullCleanPath = `../assets/images/${cleanPath}`;
        if (allImages[fullCleanPath]) return allImages[fullCleanPath];
    }
    
    // Thử lần lượt các phần mở rộng
    for (const ext of extensions) {
        const fullPath = `../assets/images/${path}.${ext}`;
        if (allImages[fullPath]) return allImages[fullPath];
    }

    // Console warn only in dev
    if (import.meta.env.DEV) {
        console.warn(`[Asset Missing] Không tìm thấy ảnh: ${path}`);
    }
    
    return ''; 
};

// Helper to create a proxy that fallbacks to a default asset if key not found
const createAssetProxy = (data, category, defaultKey) => {
    return new Proxy(data, {
        get: (target, prop) => {
            if (prop in target) return target[prop];
            
            // Try to resolve dynamically
            const dynamicUrl = getAssetUrl(`${category}/${String(prop)}`);
            if (dynamicUrl) return dynamicUrl;
            
            // Fallback to default
            return target[defaultKey] || '';
        }
    });
};

export const ASSETS = {
    // Nhân vật & NPC
    portraits: createAssetProxy({
        player: getAssetUrl('players/player_male'),
        player_male: getAssetUrl('players/player_male'),
        player_female: getAssetUrl('players/player_female'),
        sect_elder: getAssetUrl('portraits/sect_elder'),
        merchant: getAssetUrl('portraits/merchant'),
        demon: getAssetUrl('portraits/demon'),
    }, 'portraits', 'player'),

    // Kẻ địch
    enemies: createAssetProxy({
        wolf: getAssetUrl('enemies/spirit_wolf'),
        dragon: getAssetUrl('enemies/fire_dragon'),
    }, 'enemies', 'wolf'),

    // Bối cảnh & Bản đồ
    backgrounds: createAssetProxy({
        nhan_gioi: getAssetUrl('backgrounds/sect_gate'),
        cave: getAssetUrl('backgrounds/cultivation_cave'),
        sect: getAssetUrl('backgrounds/sect_gate'),
        cultivation: getAssetUrl('backgrounds/cultivation_cave'),
    }, 'backgrounds', 'cultivation'),

    // Vật phẩm
    items: createAssetProxy({
        spirit_stone: getAssetUrl('items/spirit_stone'),
        healing_pill: getAssetUrl('items/healing_pill'),
    }, 'items', 'spirit_stone'),

    // Logos
    logos: createAssetProxy({
        main: getAssetUrl('logos/logo'),
    }, 'logos', 'main'),

    // UI (Non-proxied for icons)
    ui: {
        stamina: '⚡',
        mana: '💧',
        tu_vi: '🌸',
    }
};
