import { getItemById } from '../configs/item-data.js';

/**
 * Returns the CSS class for a given item quality.
 * @param {string} quality 
 * @returns {string}
 */
export function getQualityClass(quality) {
    const map = {
        'Phàm': 'pham', 'Hoàng': 'hoang', 'Huyền': 'huyen', 'Địa': 'dia', 'Thiên': 'thien', 'Tiên': 'tien', 'Thần': 'than',
        'Tàn Khuyết': 'pham', 'Thường': 'hoang', 'Tinh Phẩm': 'huyen', 'Hoàn Mỹ': 'dia', 'Cực Phẩm': 'thien', 'Truyền Thuyết': 'tien', 'Thần Thoại': 'than',
        'Danh Khí': 'than', 'Danh Bảo': 'than'
    };
    return map[quality] || 'pham';
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

    return `
        <div class="flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-xl hover:border-${qClass} transition-all">
            <div class="flex items-center space-x-3">
                <div class="text-2xl bg-black/60 p-2 rounded-lg border border-${qClass}/30">${item.icon}</div>
                <div>
                    <div class="text-sm font-bold text-white">${item.name}</div>
                    <div class="text-[9px] font-bold quality-${qClass}">
                        ${item.quality}${(item.quality.toLowerCase().includes('phẩm') || ['Hoàn Mỹ', 'Truyền Thuyết', 'Thần Thoại'].includes(item.quality)) ? '' : ' phẩm'} 
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
