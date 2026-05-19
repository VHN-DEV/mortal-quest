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

    // Fallback cho ảnh địa điểm chưa có ảnh riêng
    if (path.startsWith('locations/') && path !== 'locations/default') {
        const defaultPath = '../assets/images/locations/default.webp';
        if (allImages[defaultPath]) return allImages[defaultPath];
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
        player_legacy: getAssetUrl('players/player_legacy'),
        bach_tu_linh: getAssetUrl('portraits/bach_tu_linh'),
        du_nhuoc_nhan: getAssetUrl('portraits/du_nhuoc_nhan'),
        han_phi_vu: getAssetUrl('portraits/han_phi_vu'),
        phuong_ca: getAssetUrl('portraits/phuong_ca'),
        phuong_vu: getAssetUrl('portraits/phuong_vu'),
        tran_tu_huyen: getAssetUrl('portraits/tran_tu_huyen'),
        xich_nguyet: getAssetUrl('portraits/xich_nguyet'),
        sect_elder: getAssetUrl('portraits/sect_elder'),
        merchant: getAssetUrl('portraits/merchant'),
        demon: getAssetUrl('portraits/demon'),
        
        // Special NPCs mapped directly to their unique high-fidelity illustrations
        han_lap: getAssetUrl('portraits/han_lap'),
        tu_linh: getAssetUrl('portraits/tu_linh'),
        kiem_vo_tam: getAssetUrl('portraits/kiem_vo_tam'),
        vo_danh: getAssetUrl('portraits/vo_danh'),
        bang_nguyet: getAssetUrl('portraits/bang_nguyet'),
        thanh_lien: getAssetUrl('portraits/thanh_lien'),
        thanh_nhi: getAssetUrl('portraits/thanh_nhi'),
        bach_minh_anh: getAssetUrl('portraits/bach_minh_anh'),
        han_vien: getAssetUrl('portraits/han_vien'),
        lan_anh: getAssetUrl('portraits/lan_anh'),
        minh_nguyet: getAssetUrl('portraits/minh_nguyet'),
    }, 'portraits', 'player'),

    // Kẻ địch
    enemies: createAssetProxy({
        wolf: getAssetUrl('enemies/spirit_wolf'),
        dragon: getAssetUrl('enemies/fire_dragon'),
        black_tiger: getAssetUrl('enemies/black_tiger'),
        rogue_cultivator: getAssetUrl('enemies/rogue_cultivator'),
        demon_cultivator: getAssetUrl('enemies/demon_cultivator'),
        zombie: getAssetUrl('enemies/zombie'),
        ghost: getAssetUrl('enemies/demon_cultivator'),
    }, 'enemies', 'wolf'),

    // Yêu Thú (Linh Thú, Dị Thú...)
    beasts: createAssetProxy({
        thanh_van_ly: getAssetUrl('beasts/thanh-van-ly-thu'),
        dia_long: getAssetUrl('beasts/huyen-giap-dia-long'),
        mong_diep: getAssetUrl('beasts/u-minh-mong-diep'),
        
        // Insect Vector SVGs
        bang_tam: getAssetUrl('aberrations/bang-tam.svg'),
        huyet_ngoc_tri_chu: getAssetUrl('aberrations/huyet-ngoc-tri-chu.svg'),
        phe_kim_trung: getAssetUrl('aberrations/phe-kim-trung.svg'),
        
        // Spiritual Beasts fallback mapping to location themes
        phe_linh_trung: getAssetUrl('aberrations/luc-duc-suong-cong.svg'),
        kim_tam: getAssetUrl('aberrations/kim-giap-hac.svg'),
        thanh_van_hac: getAssetUrl('locations/theme_linh_ngoai'),
        xich_diem_lang: getAssetUrl('locations/theme_ma_uyen'),
        loi_duc_su: getAssetUrl('locations/theme_chien_truong'),
        cuu_vi_thien_ho: getAssetUrl('locations/theme_van_yeu'),
        thanh_long: getAssetUrl('locations/theme_hai_toc'),
    }, 'beasts', 'thanh_van_ly'),

    // Khôi lỗi & Thi hài
    puppets: createAssetProxy({
        thiet_giap_khoi_loi: getAssetUrl('locations/theme_chien_truong'),
        kiem_khoi: getAssetUrl('locations/theme_chien_truong'),
    }, 'puppets', 'thiet_giap_khoi_loi'),

    corpses: createAssetProxy({
        thi_binh: getAssetUrl('locations/theme_huyet_hai'),
        thi_tuong: getAssetUrl('locations/theme_huyet_hai'),
        dong_giap_thi: getAssetUrl('locations/theme_ma_uyen'),
    }, 'corpses', 'thi_binh'),

    // Sự kiện Thẻ Cảnh (Scenery Cards)
    events: createAssetProxy({
        rare_herb: getAssetUrl('locations/theme_van_yeu'),
        chaos_rift: getAssetUrl('locations/theme_khong_gian'),
        old_friend: getAssetUrl('locations/theme_linh_thanh'),
        demon_ritual: getAssetUrl('locations/theme_huyet_hai'),
        heavenly_tribulation: getAssetUrl('locations/theme_ma_uyen'),
        med_king_valley: getAssetUrl('locations/theme_linh_ngoai'),
        hidden_library: getAssetUrl('locations/theme_tien_phu'),
        death_match_arena: getAssetUrl('locations/theme_chien_truong'),
    }, 'events', 'rare_herb'),

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
        cuc_pham_linh_thach: getAssetUrl('items/cuc_pham_linh_thach'),
        ha_pham_linh_thach: getAssetUrl('items/ha_pham_linh_thach'),
        trung_pham_linh_thach: getAssetUrl('items/trung_pham_linh_thach'),
        thuong_pham_linh_thach: getAssetUrl('items/thuong_pham_linh_thach'),
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
