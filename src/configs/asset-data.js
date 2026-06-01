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
                bach_thanh_anh: getAssetUrl('portraits/bach_thanh_anh'),

        // New Special NPCs
        dong_ninh: getAssetUrl('portraits/dong_ninh'),
        han_chan_quan: getAssetUrl('portraits/han_chan_quan'),
        han_thien_quan: getAssetUrl('portraits/han_thien_quan'),
        hang_nga: getAssetUrl('portraits/hang_nga'),
        hua_lap_quoc: getAssetUrl('portraits/hua_lap_quoc'),
        lieu_mi: getAssetUrl('portraits/lieu_mi'),
        lieu_nguyet_nhi: getAssetUrl('portraits/lieu_nguyet_nhi'),
        ly_mo_uyen: getAssetUrl('portraits/ly_mo_uyen'),
        nam_cung_uyen: getAssetUrl('portraits/nam_cung_uyen'),
        natra: getAssetUrl('portraits/natra'),
        ngan_nguyet: getAssetUrl('portraits/ngan_nguyet'),
        ngao_at: getAssetUrl('portraits/ngao_at'),
        thien_van_tu: getAssetUrl('portraits/thien_van_tu'),
        tieu_ngan_nguyet: getAssetUrl('portraits/tieu_ngan_nguyet'),
        tu_do_nam: getAssetUrl('portraits/tu_do_nam'),
        vuong_co_than: getAssetUrl('portraits/vuong_co_than'),
        vuong_ma_than: getAssetUrl('portraits/vuong_ma_than'),
        vuong_ma_tu: getAssetUrl('portraits/vuong_ma_tu'),

        // Nameless NPCs replaced with proper names
        lac_ly: getAssetUrl('portraits/lac_ly'),
        thanh_huyen_nguyet: getAssetUrl('portraits/thanh_huyen_nguyet'),
        ho_tien_nhi: getAssetUrl('portraits/ho_tien_nhi'),
        bach_to_trinh: getAssetUrl('portraits/bach_to_trinh'),
        tuyet_kien: getAssetUrl('portraits/tuyet_kien'),
        hoa_thien_cot: getAssetUrl('portraits/hoa_thien_cot'),
        ly_lac: getAssetUrl('portraits/ly_lac'),
        to_dac_ky: getAssetUrl('portraits/to_dac_ky'),
        ngoc_vo_tam: getAssetUrl('portraits/ngoc_vo_tam'),
        ky_nhu_tuyet: getAssetUrl('portraits/ky_nhu_tuyet'),
        linh_nhu_van: getAssetUrl('portraits/linh_nhu_van'),
        vu_van_thac: getAssetUrl('portraits/vu_van_thac'),
        thanh_luan: getAssetUrl('portraits/thanh_luan'),
        phong_van_vo_ky: getAssetUrl('portraits/phong_van_vo_ky'),
        to_moc_thu: getAssetUrl('portraits/to_moc_thu'),
        cung_tu_vu: getAssetUrl('portraits/cung_tu_vu'),
        muc_thu_thuy: getAssetUrl('portraits/muc_thu_thuy'),
        lan_vong_co: getAssetUrl('portraits/lan_vong_co'),
        lam_nhuoc_tuyet: getAssetUrl('portraits/lam_nhuoc_tuyet'),
        han_nguyet_tam: getAssetUrl('portraits/han_nguyet_tam'),
        thu_dung: getAssetUrl('portraits/thu_dung'),
        tieu_huong: getAssetUrl('portraits/tieu_huong'),
        ngoc_dieu_nhan: getAssetUrl('portraits/ngoc_dieu_nhan'),
        thanh_nhi_nguyet: getAssetUrl('portraits/thanh_nhi_nguyet'),
        bach_tuyet_lien: getAssetUrl('portraits/bach_tuyet_lien'),
        my_do_toa: getAssetUrl('portraits/my_do_toa'),
        phong_linh_nhi: getAssetUrl('portraits/phong_linh_nhi'),
        hong_lien: getAssetUrl('portraits/hong_lien'),
        tu_nhuoc_tinh: getAssetUrl('portraits/tu_nhuoc_tinh'),
        minh_ha: getAssetUrl('portraits/minh_ha'),
        bang_linh: getAssetUrl('portraits/bang_linh'),
        thuy_tien: getAssetUrl('portraits/thuy_tien'),
        ha_tieu_nguyet: getAssetUrl('portraits/ha_tieu_nguyet'),
        an_so_ha: getAssetUrl('portraits/an_so_ha'),
        yen_nhu_ngoc: getAssetUrl('portraits/yen_nhu_ngoc'),
        kim_lien: getAssetUrl('portraits/kim_lien'),
        mong_dao: getAssetUrl('portraits/mong_dao'),
        giao_lang: getAssetUrl('portraits/giao_lang'),
        quynh_dao: getAssetUrl('portraits/quynh_dao'),
        tieu_vien: getAssetUrl('portraits/tieu_vien'),
        diep_pham: getAssetUrl('portraits/diep_phàm'),
        cultivator_male: getAssetUrl('players/player_male'),
        cultivator_female: getAssetUrl('players/player_female'),
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
        thanh_long: getAssetUrl('beasts/thanh_long'),
        giao_long: getAssetUrl('beasts/giao_long'),
        hac_xa: getAssetUrl('beasts/hac_xa'),
        hoa_viem: getAssetUrl('beasts/hoa_viem'),
        bang_hung: getAssetUrl('beasts/bang_hung'),
        con_bang: getAssetUrl('beasts/con_bang'),
        chu_tuoc: getAssetUrl('beasts/chu_tuoc'),
        u_minh_mong_diep: getAssetUrl('beasts/u-minh-mong-diep'),
        that_thai_thien_long: getAssetUrl('beasts/that_thai_thien_long')
    }, 'enemies', 'wolf'),

    // Yêu Thú (Linh Thú, Dị Thú...)
    beasts: createAssetProxy({
        cuu_vi_thien_ho: getAssetUrl('beasts/tu_tuoc'),
        thanh_van_hac: getAssetUrl('beasts/thanh_van_hac'),
        xich_diem_lang: getAssetUrl('beasts/ac_long'),
        loi_duc_su: getAssetUrl('beasts/cuu_dau'),
        thanh_long: getAssetUrl('beasts/thanh_long'),
        phe_kim_trung: getAssetUrl('aberrations/phe-kim-trung.svg'),
        bang_tam: getAssetUrl('beasts/bang_tam'),
        huyet_ngoc_tri_chu: getAssetUrl('aberrations/huyet-ngoc-tri-chu.svg'),
        phe_linh_trung: getAssetUrl('beasts/thanh_van_ly'),
        kim_tam: getAssetUrl('beasts/thanh_nguu'),
        thanh_van_ly: getAssetUrl('beasts/thanh_van_ly'),
        huyen_giap_dia_long: getAssetUrl('beasts/huyen-giap-dia-long'),
        u_minh_mong_diep: getAssetUrl('beasts/u-minh-mong-diep'),
        giao_long: getAssetUrl('beasts/giao_long'),
        hac_xa: getAssetUrl('beasts/hac_xa'),
        hoa_viem: getAssetUrl('beasts/hoa_viem'),
        ac_long: getAssetUrl('beasts/ac_long'),
        bang_hung: getAssetUrl('beasts/bang_hung'),
        chu_tuoc: getAssetUrl('beasts/chu_tuoc'),
        con_bang: getAssetUrl('beasts/con_bang'),
        cuu_dau: getAssetUrl('beasts/cuu_dau'),
        hoa_long: getAssetUrl('beasts/hoa_long'),
        linh_huu: getAssetUrl('beasts/linh_huu'),
        ngoc_long: getAssetUrl('beasts/ngoc_long'),
        phuong_hoang: getAssetUrl('beasts/phuong_hoang'),
        thanh_van_ly_thu: getAssetUrl('beasts/thanh-van-ly-thu'),
        thanh_nguu: getAssetUrl('beasts/thanh_nguu'),
        that_thai_thien_long: getAssetUrl('beasts/that_thai_thien_long'),
        tu_tuoc: getAssetUrl('beasts/tu_tuoc'),
        tu_van_hac: getAssetUrl('beasts/tu_van_hac'),
        bang_tam_svg: getAssetUrl('aberrations/bang-tam.svg'),
        huyet_ngoc_tri_chu_svg: getAssetUrl('aberrations/huyet-ngoc-tri-chu.svg'),
        phe_kim_trung_svg: getAssetUrl('aberrations/phe-kim-trung.svg'),
        hac_thiet_loi_thu: getAssetUrl('beasts/hac_thiet_loi_thu'),
    }, 'beasts', 'cuu_vi_thien_ho'),

    // Khôi lỗi & Thi hài
    puppets: createAssetProxy({
        thiet_giap_khoi_loi: getAssetUrl('locations/theme_chien_truong'),
        kiem_khoi: getAssetUrl('locations/theme_chien_truong'),
        thanh_vien_khoi_loi: getAssetUrl('puppets/thanh_vien_khoi_loi'),
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
        tu_vi: getAssetUrl('cultivation/tu_vi'),
        luyen_the: getAssetUrl('cultivation/luyen_the'),
        than_thuc: getAssetUrl('cultivation/than_thuc'),
    }, 'backgrounds', 'cultivation'),

    // Vật phẩm
    items: createAssetProxy({
        spirit_stone: getAssetUrl('items/spirit_stone'),
        healing_pill: getAssetUrl('items/healing_pill'),
        cuc_pham_linh_thach: getAssetUrl('items/cuc-pham-linh-thach'),
        ha_pham_linh_thach: getAssetUrl('items/ha_pham_linh_thach'),
        trung_pham_linh_thach: getAssetUrl('items/trung-pham-linh-thach'),
        thuong_pham_linh_thach: getAssetUrl('items/thuong-pham-linh-thach'),
    }, 'items', 'spirit_stone'),

    // Công pháp bí tịch
    techniques: createAssetProxy({
        truong_xuan_nap_khi_quyet: getAssetUrl('techniques/truong_xuan_nap_khi_quyet'),
        liet_duong_cong: getAssetUrl('techniques/liet_duong_cong'),
        han_thuy_quyet: getAssetUrl('techniques/han_thuy_quyet'),
        thanh_moc_tam_kinh: getAssetUrl('techniques/thanh_moc_tam_kinh'),
        canh_kim_quyet: getAssetUrl('techniques/canh_kim_quyet'),
        hau_tho_cong: getAssetUrl('techniques/hau_tho_cong'),
        man_nguu_kinh: getAssetUrl('techniques/man_nguu_kinh'),
        duong_than_quyet: getAssetUrl('techniques/duong_than_quyet'),
        truong_sinh_quyet: getAssetUrl('techniques/truong_sinh_quyet'),
        cuu_chuyen_kim_than: getAssetUrl('techniques/cuu_chuyen_kim_than'),
        u_minh_huy_ngan: getAssetUrl('techniques/u_minh_huy_ngan'),
        thanh_moc_truong_sinh_quyet: getAssetUrl('techniques/thanh_moc_truong_sinh_quyet'),
        huyen_thuy_nap_linh_quyet: getAssetUrl('techniques/huyen_thuy_nap_linh_quyet'),
        tu_duong_chan_khi: getAssetUrl('techniques/tu_duong_chan_khi'),
        phong_loi_quyet: getAssetUrl('techniques/phong_loi_quyet'),
        thanh_nguyen_kiem_quyet: getAssetUrl('techniques/thanh_nguyen_kiem_quyet'),
        dai_dien_quyet: getAssetUrl('techniques/dai_dien_quyet'),
        minh_vuong_quyet: getAssetUrl('techniques/minh_vuong_quyet'),
        phe_huyet_ma_cong: getAssetUrl('techniques/phe_huyet_ma_cong'),
        van_doc_hoa_cot_quyet: getAssetUrl('techniques/van_doc_hoa_cot_quyet'),
        hu_thien_tran_phap_quyen: getAssetUrl('techniques/hu_thien_tran_phap_quyen'),
        hoang_phong_coc_cong_phap: getAssetUrl('techniques/hoang_phong_coc_cong_phap'),
        thien_tinh_tong_cong_phap: getAssetUrl('techniques/thien_tinh_tong_cong_phap'),
        linh_thu_son_cong_phap: getAssetUrl('techniques/linh_thu_son_cong_phap'),
        thanh_hu_mon_cong_phap: getAssetUrl('techniques/thanh_hu_mon_cong_phap'),
        cu_kiem_mon_cong_phap: getAssetUrl('techniques/cu_kiem_mon_cong_phap'),
        hoa_dao_o_cong_phap: getAssetUrl('techniques/hoa_dao_o_cong_phap'),
        thien_khuyet_bao_cong_phap: getAssetUrl('techniques/thien_khuyet_bao_cong_phap'),
        thien_kiem_tong_cong_phap: getAssetUrl('techniques/thien_kiem_tong_cong_phap'),
        huyen_am_coc_cong_phap: getAssetUrl('techniques/huyen_am_coc_cong_phap'),
        yem_nguyet_tong_cong_phap: getAssetUrl('techniques/yem_nguyet_tong_cong_phap'),
        lac_van_tong_cong_phap: getAssetUrl('techniques/lac_van_tong_cong_phap'),
        quy_linh_mon_cong_phap: getAssetUrl('techniques/quy_linh_mon_cong_phap'),
        hop_hoan_tong_cong_phap: getAssetUrl('techniques/hop_hoan_tong_cong_phap'),
        ma_diem_mon_cong_phap: getAssetUrl('techniques/ma_diem_mon_cong_phap'),
        thien_sat_tong_cong_phap: getAssetUrl('techniques/thien_sat_tong_cong_phap'),
        ngu_linh_tong_cong_phap: getAssetUrl('techniques/ngu_linh_tong_cong_phap'),
        khoi_am_tong_cong_phap: getAssetUrl('techniques/khoi_am_tong_cong_phap'),
        truong_xuan_dao_kinh: getAssetUrl('techniques/truong_xuan_dao_kinh'),
        thai_at_kiem_quyet: getAssetUrl('techniques/thai_at_kiem_quyet'),
        cuu_u_ma_dien: getAssetUrl('techniques/cuu_u_ma_dien'),
    }, 'techniques', 'truong_xuan_nap_khi_quyet'),

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
