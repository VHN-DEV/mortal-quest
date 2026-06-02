import { getItemById } from '../configs/item-data.js';

/**
 * Returns the CSS class for a given item quality.
 * @param {string} quality 
 * @returns {string}
 */
export function getQualityClass(quality) {
    let qKey = quality;
    if (quality && typeof quality === 'object') {
        qKey = quality.id || '';
    }

    const map = {
        'Phàm Khí': 'pham-khi',
        'Pháp Khí': 'phap-khi',
        'Linh Khí': 'linh-khi',
        'Pháp Bảo': 'phap-bao',
        'Cổ Bảo': 'co-bao',
        'Linh Bảo': 'linh-bao',
        'Thông Thiên Linh Bảo': 'thong-thien',
        'Tiên Khí': 'tien-khi',
        'Danh Khí': 'danh-khi',

        // Công Pháp (Giai system)
        'Phàm Giai': 'pham-khi',
        'Hoàng Giai': 'phap-khi',
        'Huyền Giai': 'linh-khi',
        'Địa Giai': 'phap-bao',
        'Thiên Giai': 'co-bao',
        'Linh Giai': 'linh-bao',
        'Thánh Giai': 'thong-thien',
        'Tiên Giai': 'tien-khi',
        'Đế Giai': 'danh-khi',
        'Đạo Giai': 'danh-khi',

        // Dị Hỏa / Dị Lôi
        'Phàm Hỏa': 'pham-khi', 'Phàm Lôi': 'pham-khi',
        'Linh Hỏa': 'linh-khi', 'Linh Lôi': 'linh-khi',
        'Địa Hỏa': 'phap-bao', 'Địa Lôi': 'phap-bao',
        'Thiên Hỏa': 'co-bao', 'Thiên Lôi': 'co-bao',
        'Thánh Hỏa': 'thong-thien', 'Thánh Lôi': 'thong-thien',
        'Tiên Hỏa': 'tien-khi', 'Tiên Lôi': 'tien-khi',
        'Đạo Hỏa': 'danh-khi', 'Đạo Lôi': 'danh-khi',
        'Hồng Mông Tổ Hỏa': 'danh-khi', 'Tổ Lôi': 'danh-khi',

        // Dan duoc strings & ids
        'pham': 'pham',
        'Phàm Phẩm': 'pham',
        'ha_pham': 'hoang',
        'Hạ Phẩm': 'hoang',
        'trung_pham': 'huyen',
        'Trung Phẩm': 'huyen',
        'thuong_pham': 'dia',
        'Thượng Phẩm': 'dia',
        'cuc_pham': 'thien',
        'Cực Phẩm': 'thien',
        'dan_van': 'linh-bao',
        'Đan Văn': 'linh-bao',
        'dan_bao': 'than',
        'Đan Bảo': 'than',
        'tien_dan': 'tien',
        'Tiên Đan': 'tien',

        // Compatibility
        'Hạ phẩm': 'pham', 'Trung phẩm': 'hoang', 'Thượng phẩm': 'huyen', 'Cực phẩm': 'dia', 'Hoàn Mỹ': 'thien', 'Tiên Phẩm': 'tien'
    };
    return map[qKey] || map[quality] || 'pham';
}

/**
 * Generates HTML for an item card.
 * @param {Object} item The item object from configs
 * @param {Object} options Configuration for the card
 * @returns {string}
 */
export function renderItemCard(item, options = {}) {
    const {
        showStock = false,
        stock = 0,
        showPrice = false,
        price = 0,
        showQuantity = false,
        quantity = 0,
        buttonText = null,
        buttonClass = '',
        onClick = ''
    } = options;

    const qClass = getQualityClass(item.quality);
    const displayQual = (item.quality && typeof item.quality === 'object') ? item.quality.name : item.quality;

    return `
        <div class="flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-xl hover:border-${qClass} transition-all">
            <div class="flex items-center space-x-3">
                <div class="text-2xl bg-black/60 p-2 rounded-lg border border-${qClass}/30">${item.icon}</div>
                <div>
                    <div class="text-sm font-bold text-white">${item.name}</div>
                    <div class="text-[9px] font-bold quality-${qClass}">
                        ${displayQual}${(displayQual.toLowerCase().includes('khí') || displayQual.toLowerCase().includes('bảo') || displayQual.toLowerCase().includes('phẩm') || displayQual.toLowerCase().includes('giai') || displayQual.toLowerCase().includes('hỏa') || displayQual.toLowerCase().includes('lôi') || ['Hoàn Mỹ', 'Tiên Khí', 'Linh Bảo', 'Danh Khí'].includes(displayQual)) ? '' : ' phẩm'} 
                        ${showStock ? `| Kho: ${stock}` : ''}
                        ${showQuantity ? `| x${quantity}` : ''}
                    </div>
                </div>
            </div>
            <div class="flex items-center space-x-3">
                ${showPrice ? `<div class="text-xs font-mono text-cultivation-gold whitespace-nowrap">${price} LT</div>` : ''}
                ${buttonText ? `
                    <button class="px-3 py-1 bg-qi-purple text-white text-[10px] font-bold rounded-lg hover:bg-purple-600 transition-all ${buttonClass}" 
                        onclick="${onClick}">
                        ${buttonText}
                    </button>` : ''}
            </div>
        </div>
    `;
}

/**
 * Generates HTML for a grid item (compact).
 * @param {Object} item 
 * @param {Object} options 
 */
export function renderGridItem(item, options = {}) {
    const { quantity = 0, price = 0, showPrice = false, isSelected = false, onClick = '' } = options;
    const qClass = getQualityClass(item.quality);

    return `
        <div class="p-2 border rounded-lg bg-black/20 flex flex-col items-center cursor-pointer transition-all border-${qClass}/30 ${isSelected ? 'bg-qi-blue/10 border-qi-blue' : 'hover:border-white/30'}"
             onclick="${onClick}">
            <div class="text-2xl mb-1">${item.icon}</div>
            ${quantity > 0 ? `<div class="text-[9px] text-gray-400">x${quantity}</div>` : ''}
            ${showPrice ? `<div class="text-[8px] text-cultivation-gold mt-1">${price} LT</div>` : ''}
        </div>
    `;
}

/**
 * Maps item quality to technique/manual quality if it is a cultivation technique/recipe/talisman recipe book.
 * @param {string} quality 
 * @param {string} type 
 * @returns {string}
 */
export function getDisplayQuality(quality, type) {
    if (quality && typeof quality === 'object') {
        return quality.name || '';
    }
    const isManualOrRecipe = ['sach_cong_phap', 'tuyet_ky', 'dan_phuong', 'don_phu'].includes(type);
    if (!isManualOrRecipe) return quality;

    const map = {
        'Phàm Khí': 'Phàm Giai',
        'Pháp Khí': 'Hoàng Giai',
        'Linh Khí': 'Huyền Giai',
        'Pháp Bảo': 'Địa Giai',
        'Cổ Bảo': 'Thiên Giai',
        'Linh Bảo': 'Linh Giai',
        'Thông Thiên Linh Bảo': 'Thánh Giai',
        'Tiên Khí': 'Tiên Giai',
        'Danh Khí': 'Đế Giai'
    };
    return map[quality] || quality;
}

