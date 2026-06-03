import { getItemById } from '../configs/item-data.js';
import {
    PHAP_BAO_QUALITIES,
    DAN_DUOC_QUALITIES,
    CONG_PHAP_QUALITIES,
    DI_HOA_QUALITIES,
    DI_LOI_QUALITIES,
    LINH_THU_QUALITIES,
    ROOT_QUALITIES,
    SPIRIT_STONE_QUALITIES,
    PUPPET_GRADES,
    BEAST_BLOODLINES,
    LINH_THE_RARITIES
} from '../configs/game-enums.js';

// Combine all quality lists for dynamic lookup
const ALL_QUALITIES = [
    ...Object.values(PHAP_BAO_QUALITIES),
    ...Object.values(DAN_DUOC_QUALITIES),
    ...Object.values(CONG_PHAP_QUALITIES),
    ...Object.values(DI_HOA_QUALITIES),
    ...Object.values(DI_LOI_QUALITIES),
    ...Object.values(LINH_THU_QUALITIES),
    ...Object.values(ROOT_QUALITIES),
    ...Object.values(SPIRIT_STONE_QUALITIES),
    ...Object.values(PUPPET_GRADES),
    ...Object.values(BEAST_BLOODLINES),
    ...Object.values(LINH_THE_RARITIES)
];

/**
 * Returns the CSS class for a given item quality.
 * @param {string|object} quality 
 * @returns {string}
 */
export function getQualityClass(quality) {
    if (!quality) return 'pham';
    
    if (typeof quality === 'object') {
        return quality.cssClass || 'pham';
    }

    const qStr = String(quality);
    if (qStr === 'Tiên Phẩm') return 'tien';

    // Dynamic search in enums
    const qObj = ALL_QUALITIES.find(q => 
        q.id === quality || 
        q.name === quality || 
        q.name.toLowerCase() === qStr.toLowerCase()
    );
    if (qObj && qObj.cssClass) {
        return qObj.cssClass;
    }

    return 'pham';
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
    if (!quality) return '';
    const qName = typeof quality === 'object' ? (quality.name || '') : String(quality);
    const isManualOrRecipe = ['sach_cong_phap', 'tuyet_ky', 'dan_phuong', 'don_phu'].includes(type);
    if (!isManualOrRecipe) return qName;

    const map = {
        [PHAP_BAO_QUALITIES.PHAM_KHI.name]: CONG_PHAP_QUALITIES.PHAM_GIAI.name,
        [PHAP_BAO_QUALITIES.PHAP_KHI.name]: CONG_PHAP_QUALITIES.HOANG_GIAI.name,
        [PHAP_BAO_QUALITIES.LINH_KHI.name]: CONG_PHAP_QUALITIES.HUYEN_GIAI.name,
        [PHAP_BAO_QUALITIES.PHAP_BAO.name]: CONG_PHAP_QUALITIES.DIA_GIAI.name,
        [PHAP_BAO_QUALITIES.CO_BAO.name]: CONG_PHAP_QUALITIES.THIEN_GIAI.name,
        [PHAP_BAO_QUALITIES.LINH_BAO.name]: CONG_PHAP_QUALITIES.LINH_GIAI.name,
        [PHAP_BAO_QUALITIES.THONG_THIEN_LINH_BAO.name]: CONG_PHAP_QUALITIES.THANH_GIAI.name,
        [PHAP_BAO_QUALITIES.TIEN_KHI.name]: CONG_PHAP_QUALITIES.TIEN_GIAI.name,
        [PHAP_BAO_QUALITIES.DANH_KHI.name]: CONG_PHAP_QUALITIES.DE_GIAI.name
    };
    return map[qName] || qName;
}

