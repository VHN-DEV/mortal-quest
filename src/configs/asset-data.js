/**
 * Cấu hình toàn bộ tài nguyên hình ảnh của game.
 * Sử dụng import.meta.glob để đảm bảo Vite đóng gói chính xác các tài nguyên.
 */

// Tự động quét toàn bộ thư mục assets/images
const allImages = import.meta.glob('../assets/images/**/*.{webp,gif,svg,png}', { eager: true, query: '?url', import: 'default' });

/**
 * Preload all essential assets and track progress
 * @param {Function} onProgress - Callback(percent, text)
 */
export const preloadAssets = async (onProgress) => {
    const images = Object.keys(allImages);
    const total = images.length;
    let loaded = 0;

    const loadingTexts = [
        "Đang thu nạp linh khí...",
        "Đang ngưng tụ căn cốt...",
        "Đang khai mở thần thức...",
        "Đang kết nối thiên địa...",
        "Đang ổn định kinh mạch..."
    ];

    // Try to load images in batches to not overwhelm the browser
    const promises = images.map(async (key) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = img.onerror = () => {
                loaded++;
                const percent = Math.round((loaded / total) * 100);
                const text = loadingTexts[Math.floor(percent / 21)] || loadingTexts[0];
                onProgress(percent, text);
                resolve();
            };
            img.src = allImages[key];
        });
    });

    await Promise.all(promises);
};

/**
 * Lấy URL của tài nguyên dựa trên đường dẫn tương đối.
 * @param {string} path - Đường dẫn tính từ thư mục assets/images/ (VD: 'portraits/player_male')
 */
export const getAssetUrl = (path) => {
    if (!path) return '';
    
    const extensions = ['webp', 'png', 'jpg', 'jpeg', 'gif', 'svg'];
    
    // Nếu path đã có phần mở rộng
    if (path.includes('.')) {
        const fullPath = `../assets/images/${path}`;
        if (allImages[fullPath]) return allImages[fullPath];

        // Nếu không tìm thấy, thử tìm phiên bản .webp của nó (đặc biệt cho dữ liệu cũ từ save)
        const webpPath = path.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        if (webpPath !== path) {
            const fullWebpPath = `../assets/images/${webpPath}`;
            if (allImages[fullWebpPath]) return allImages[fullWebpPath];
        }

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

    // Yêu Thú (Linh Thú, Dị Thú...)
    beasts: createAssetProxy({
        thanh_van_ly: getAssetUrl('beasts/thanh-van-ly-thu'),
        dia_long: getAssetUrl('beasts/huyen-giap-dia-long'),
        mong_diep: getAssetUrl('beasts/u-minh-mong-diep'),
    }, 'beasts', 'thanh_van_ly'),

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
