import { state } from '../../state.js';
import { getItemById } from '../../configs/item-data.js';
import { SHOPS } from '../../configs/shop-data.js';
import { ASSETS, getAssetUrl } from '../../configs/asset-data.js';
import { getTechniqueById, getSecretTechniqueById } from '../../configs/technique-data.js';

export class ShopController {
    constructor(parentScreen) {
        this.parentScreen = parentScreen;
        this.shopSubFilter = 'all';
        this.shopQualityFilter = 'all';
        this.shopSearchQuery = '';
        this.shopSortMode = 'default';
    }

    get elShopLingShi() { return this.parentScreen.elShopLingShi; }
    get elShopBuyView() { return this.parentScreen.elShopBuyView; }
    get elShopSellView() { return this.parentScreen.elShopSellView; }
    get elShopSellGrid() { return this.parentScreen.elShopSellGrid; }
    get elShopSectionNav() { return this.parentScreen.elShopSectionNav; }
    get elShopSubFilterNav() { return this.parentScreen.elShopSubFilterNav; }
    get elShopQualityFilterNav() { return this.parentScreen.elShopQualityFilterNav; }
    get elShopFiltersWrap() { return this.parentScreen.elShopFiltersWrap; }
    get btnShopTabBuy() { return this.parentScreen.btnShopTabBuy; }
    get btnShopTabSell() { return this.parentScreen.btnShopTabSell; }
    get elShopSearchInput() { return this.parentScreen.elShopSearchInput; }
    get elShopSortSelect() { return this.parentScreen.elShopSortSelect; }

    getQualityClass(quality) {
        return this.parentScreen.getQualityClass(quality);
    }

    getTechniqueCategoryForBook(itemData) {
        if (!itemData) return null;
        
        const isManualAction = itemData.action && (itemData.action.startsWith('open_') || itemData.action.includes('linh_the_luc') || itemData.effect?.type === 'unlock_profession');
        const isRecipe = itemData.type === 'recipe' || itemData.type === 'talisman_recipe' || isManualAction;
        if (isRecipe) {
            return 'Bí Pháp';
        }

        const techId = itemData.techniqueId;
        if (!techId) return null;

        const tech = getTechniqueById(techId);
        if (tech) {
            return tech.type; 
        }

        const secret = getSecretTechniqueById(techId);
        if (secret) {
            return secret.category;
        }

        return null;
    }

    renderShop() {
        if (!state.player) return;
        this.elShopLingShi.innerHTML = state.player.getFormattedLingShi();

        // Update VIP display
        const elVip = document.getElementById('shop-vip-level');
        if (elVip) {
            elVip.textContent = `VIP ${state.player.vipLevel}`;
            elVip.className = `px-2 py-0.5 rounded bg-gray-800 text-[8px] font-bold text-gray-400 border border-white/5 bg-vip-${state.player.vipLevel}`;
        }

        // Update Shop Title
        const elTitle = document.getElementById('shop-overlay-title');
        if (elTitle && state.systems.shop) {
            const shopData = SHOPS[state.systems.shop.currentShopId];
            if (shopData) {
                elTitle.textContent = shopData.name.split(' - ')[0];
            }
        }

        this.renderShopSections();
        this.renderShopSubFilters();

        // Style the tabs
        if (this.btnShopTabBuy && this.btnShopTabSell) {
            if (state.views.shop === 'buy') {
                this.btnShopTabBuy.className = "flex-grow py-3 text-cultivation-gold border-b-2 border-cultivation-gold text-xs";
                this.btnShopTabSell.className = "flex-grow py-3 text-gray-500 border-b-2 border-transparent text-xs";
            } else {
                this.btnShopTabBuy.className = "flex-grow py-3 text-gray-500 border-b-2 border-transparent text-xs";
                this.btnShopTabSell.className = "flex-grow py-3 text-cultivation-gold border-b-2 border-cultivation-gold text-xs";
            }
        }

        if (state.views.shop === 'buy') {
            this.elShopBuyView.classList.remove('hidden');
            this.elShopSellView.classList.add('hidden');
            // Special case: Dịch Vụ section has its own UI
            if (state.systems.shop && state.systems.shop.currentSection === 'dich_vu') {
                this.renderShopServices();
            } else {
                this.renderShopBuy();
            }
        } else {
            this.elShopBuyView.classList.add('hidden');
            this.elShopSellView.classList.remove('hidden');
            this.renderShopSell();
        }
    }

    renderShopSections() {
        if (!this.elShopSectionNav) return;
        const shop = state.systems.shop;

        const categories = [
            { id: 'dan_duoc', name: 'Đan Dược', icon: '💊' },
            { id: 'phap_bao', name: 'Trang Bị', icon: '⚔️' },
            { id: 'cong_phap', name: 'Bí Tịch', icon: '📜' },
            { id: 'bach_nghe', name: 'Bách Nghệ', icon: '⚒️' },
            { id: 'ky_vat', name: 'Kỳ Vật', icon: '💎' },
            { id: 'dich_vu', name: 'Dịch Vụ', icon: '🏮' }
        ];

        const currentButtons = this.elShopSectionNav.querySelectorAll('button');

        // Rebuild buttons if count doesn't match
        if (currentButtons.length !== categories.length) {
            this.elShopSectionNav.innerHTML = '';
            this.elShopSectionNav.dataset.shopId = shop.currentShopId;

            categories.forEach(cat => {
                const el = document.createElement('button');
                el.dataset.category = cat.id;
                el.onclick = () => {
                    if (state.systems.shop) {
                        state.systems.shop.currentSection = cat.id;
                        this.shopSubFilter = 'all';
                        this.shopQualityFilter = 'all';
                        this.renderShop();
                    }
                };
                this.elShopSectionNav.appendChild(el);
            });
        }

        // Update active class/text for each button
        this.elShopSectionNav.querySelectorAll('button').forEach(btn => {
            const catId = btn.dataset.category;
            const cat = categories.find(c => c.id === catId);
            const active = shop.currentSection === catId;
            btn.className = `px-4 py-2.5 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all whitespace-nowrap shrink-0 flex items-center space-x-2 ${active ? 'bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'text-gray-500 border border-white/5 hover:border-white/10 bg-white/[0.02]'}`;
            btn.innerHTML = `<span>${cat.icon}</span> <span>${cat.name}</span>`;
        });
    }

    renderShopSubFilters() {
        if (!this.elShopSubFilterNav) return;
        const shop = state.systems.shop;
        if (!shop) return;

        this.renderShopQualityFilters();

        const section = shop.currentSection;
        let subFilters = [];

        if (section === 'phap_bao') {
            subFilters = [
                { id: 'all', name: 'TẤT CẢ' },
                { id: 'weapon', name: 'VŨ KHÍ' },
                { id: 'armor', name: 'GIÁP Y' },
                { id: 'accessory', name: 'TRANG SỨC' },
                { id: 'attackArtifact', name: 'CHỦ CHIẾN' },
                { id: 'defenseArtifact', name: 'HỘ THÂN' },
                { id: 'flightArtifact', name: 'PHI HÀNH' },
                { id: 'spaceArtifact', name: 'CÀN KHÔN' },
                { id: 'formationArtifact', name: 'TRẬN ĐẠO' },
                { id: 'supportArtifact', name: 'PHỤ TRỢ' },
                { id: 'soulArtifact', name: 'HỒN ĐẠO' }
            ];
        } else if (section === 'cong_phap') {
            subFilters = [
                { id: 'all', name: 'TẤT CẢ' },
                { id: 'Linh Lực', name: 'LINH LỰC' },
                { id: 'Luyện Thể', name: 'LUYỆN THỂ' },
                { id: 'Luyện Hồn', name: 'LUYỆN HỒN' },
                { id: 'Pháp Thuật', name: 'PHÁP THUẬT' },
                { id: 'Thần Thông', name: 'THẦN THÔNG' },
                { id: 'Thần Hồn Thuật', name: 'THẦN HỒN' },
                { id: 'Bí Pháp', name: 'BÍ PHÁP' }
            ];
        } else if (section === 'bach_nghe') {
            subFilters = [
                { id: 'all', name: 'TẤT CẢ' },
                { id: 'nguyen_lieu', name: 'NGUYÊN LIỆU' },
                { id: 'phu_luc', name: 'PHÙ LỤC' },
                { id: 'tran_phap', name: 'TRẬN PHÁP' },
                { id: 'luyen_khi', name: 'LUYỆN KHÍ' },
                { id: 'linh_dien', name: 'LINH ĐIỀN' }
            ];
        } else if (section === 'ky_vat') {
            subFilters = [
                { id: 'all', name: 'TẤT CẢ' },
                { id: 'tui_tru_vat', name: 'TRỮ VẬT' },
                { id: 'ky_trung', name: 'KỲ TRÙNG' },
                { id: 'linh_thu', name: 'LINH THÚ' }
            ];
        }

        if (this.elShopFiltersWrap) this.elShopFiltersWrap.classList.remove('hidden');

        if (subFilters.length === 0) {
            this.elShopSubFilterNav.innerHTML = '';
            this.elShopSubFilterNav.classList.add('hidden');
            return;
        }

        this.elShopSubFilterNav.classList.remove('hidden');
        this.elShopSubFilterNav.innerHTML = subFilters.map(f => {
            const active = this.shopSubFilter === f.id;
            return `
                <button data-subfilter="${f.id}" 
                    class="px-3.5 py-1.5 rounded-full text-[8px] font-ancient uppercase tracking-widest transition-all duration-200 shrink-0 border ${
                        active 
                            ? 'bg-qi-blue/20 text-qi-blue border-qi-blue/40 shadow-[0_0_8px_rgba(79,209,197,0.2)] font-bold active:scale-95' 
                            : 'bg-white/[0.02] text-gray-500 border-white/5 hover:border-white/10 active:scale-98'
                    }">
                    ${f.name}
                </button>
            `;
        }).join('');

        this.elShopSubFilterNav.querySelectorAll('button[data-subfilter]').forEach(btn => {
            btn.onclick = () => {
                this.shopSubFilter = btn.dataset.subfilter;
                this.renderShop();
            };
        });
    }

    renderShopQualityFilters() {
        if (!this.elShopQualityFilterNav) return;
        const shop = state.systems.shop;
        if (!shop) return;

        const section = shop.currentSection;
        const showQuality = ['phap_bao', 'dan_duoc', 'cong_phap', 'bach_nghe'].includes(section);

        if (!showQuality) {
            this.elShopQualityFilterNav.classList.add('hidden');
            this.elShopQualityFilterNav.innerHTML = '';
            return;
        }

        const qualities = [
            { id: 'all', name: 'TẤT CẢ PHẨM' },
            { id: 'Phàm Khí', name: 'PHÀM KHÍ' },
            { id: 'Pháp Khí', name: 'PHÁP KHÍ' },
            { id: 'Linh Khí', name: 'LINH KHÍ' },
            { id: 'Pháp Bảo', name: 'PHÁP BẢO' },
            { id: 'Cổ Bảo', name: 'CỔ BẢO' },
            { id: 'Linh Bảo', name: 'LINH BẢO' },
            { id: 'Thông Thiên Linh Bảo', name: 'THÔNG THIÊN' },
            { id: 'Tiên Khí', name: 'TIÊN KHÍ' },
            { id: 'Danh Khí', name: 'DANH KHÍ' }
        ];

        const qColors = {
            'Phàm Khí': 'text-gray-400 border-gray-500/20 bg-gray-500/5',
            'Pháp Khí': 'text-green-400 border-green-500/20 bg-green-500/5',
            'Linh Khí': 'text-qi-blue border-qi-blue/20 bg-qi-blue/5',
            'Pháp Bảo': 'text-purple-400 border-purple-500/20 bg-purple-500/5',
            'Cổ Bảo': 'text-orange-400 border-orange-500/20 bg-orange-500/5',
            'Linh Bảo': 'text-red-400 border-red-500/20 bg-red-500/5',
            'Thông Thiên Linh Bảo': 'text-cultivation-gold border-cultivation-gold/20 bg-cultivation-gold/5 font-bold shimmer-gold',
            'Tiên Khí': 'text-pink-400 border-pink-500/20 bg-pink-500/5',
            'Danh Khí': 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5 font-bold'
        };

        this.elShopQualityFilterNav.classList.remove('hidden');
        this.elShopQualityFilterNav.innerHTML = qualities.map(q => {
            const active = this.shopQualityFilter === q.id;
            const qColor = qColors[q.id] || 'text-gray-500 border-white/5';
            return `
                <button data-quality="${q.id}" 
                    class="px-3.5 py-1.5 rounded-full text-[8px] font-ancient uppercase tracking-widest transition-all duration-200 shrink-0 border ${
                        active 
                            ? (q.id === 'all' ? 'bg-cultivation-gold/20 text-cultivation-gold border-cultivation-gold/40 shadow-[0_0_8px_rgba(212,175,55,0.2)] font-bold active:scale-95' : `${qColor.replace('/5', '/20')} border-opacity-60 shadow-[0_0_8px_rgba(255,255,255,0.05)] font-bold active:scale-95`) 
                            : 'bg-white/[0.02] text-gray-500 border-white/5 hover:border-white/10 active:scale-98'
                    }">
                    ${q.name}
                </button>
            `;
        }).join('');

        this.elShopQualityFilterNav.querySelectorAll('button[data-quality]').forEach(btn => {
            btn.onclick = () => {
                this.shopQualityFilter = btn.dataset.quality;
                this.renderShop();
            };
        });
    }

    renderShopBuy() {
        const shop = state.systems.shop;
        let inv = shop.getShopInventory();

        this.elShopBuyView.innerHTML = '';

        // Search Filter
        if (this.shopSearchQuery) {
            inv = inv.filter(item => {
                const itemData = getItemById(item.id);
                return itemData && itemData.name.toLowerCase().includes(this.shopSearchQuery);
            });
        }

        // Sub-filter
        if (this.shopSubFilter !== 'all') {
            inv = inv.filter(item => {
                const itemData = getItemById(item.id);
                if (!itemData) return false;

                if (shop.currentSection === 'phap_bao') {
                    return itemData.type === this.shopSubFilter;
                } else if (shop.currentSection === 'cong_phap') {
                    const techCategory = this.getTechniqueCategoryForBook(itemData);
                    return techCategory === this.shopSubFilter;
                } else if (['bach_nghe', 'ky_vat'].includes(shop.currentSection)) {
                    const shopData = SHOPS[shop.currentShopId];
                    const sectionItems = shopData.sections[this.shopSubFilter] || [];
                    return sectionItems.some(i => i.id === item.id);
                }
                return true;
            });
        }

        // Quality Filter
        if (this.shopQualityFilter !== 'all') {
            inv = inv.filter(item => {
                const itemData = getItemById(item.id);
                return itemData && itemData.quality === this.shopQualityFilter;
            });
        }

        // Sorting
        if (this.shopSortMode !== 'default') {
            inv.sort((a, b) => {
                const dataA = getItemById(a.id);
                const dataB = getItemById(b.id);
                if (!dataA || !dataB) return 0;

                if (this.shopSortMode === 'price-asc') return dataA.price - dataB.price;
                if (this.shopSortMode === 'price-desc') return dataB.price - dataA.price;
                if (this.shopSortMode === 'quality') {
                    const qOrder = ['Phàm Khí', 'Pháp Khí', 'Linh Khí', 'Pháp Bảo', 'Cổ Bảo', 'Linh Bảo', 'Thông Thiên Linh Bảo', 'Tiên Khí', 'Danh Khí', 'Hạ phẩm', 'Trung phẩm', 'Thượng phẩm', 'Cực phẩm', 'Hoàn Mỹ'];
                    return qOrder.indexOf(dataB.quality) - qOrder.indexOf(dataA.quality);
                }
                return 0;
            });
        }

        if (inv.length === 0) {
            this.elShopBuyView.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Không tìm thấy bảo vật phù hợp...</div>';
            return;
        }

        inv.forEach(item => {
            const itemData = getItemById(item.id);
            if (!itemData) return;

            const qClass = this.getQualityClass(itemData.quality);

            const el = document.createElement('div');
            el.className = `flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-xl hover:border-${qClass} cursor-pointer transition-colors duration-200`;
            el.onclick = () => {
                if (window.game.screens.inventory) {
                    window.game.screens.inventory.selectItem(item.id, true);
                }
            };

            const info = document.createElement('div');
            info.className = 'flex items-center space-x-3';
            info.innerHTML = `
                <div class="text-2xl bg-black/60 p-2 rounded-lg border border-${qClass}/30">${(itemData.image && getAssetUrl(itemData.image)) ? `<img src="${getAssetUrl(itemData.image)}" class="w-8 h-8 object-contain">` : (itemData.icon || '')}</div>
                <div>
                    <div class="text-sm font-bold text-white">${itemData.name}</div>
                    <div class="text-[9px] font-bold quality-${qClass}">${itemData.quality}${(itemData.quality.toLowerCase().includes('khí') || itemData.quality.toLowerCase().includes('bảo') || itemData.quality.toLowerCase().includes('phẩm') || itemData.quality.toLowerCase().includes('giai') || itemData.quality.toLowerCase().includes('hỏa') || itemData.quality.toLowerCase().includes('lôi') || ['Hoàn Mỹ', 'Tiên Khí', 'Linh Bảo', 'Danh Khí'].includes(itemData.quality)) ? '' : ' phẩm'} | Kho: ${item.stock}</div>
                </div>
            `;

            const finalPrice = Math.floor(itemData.price * (1 - Math.min(0.25, state.player.vipLevel * 0.05)));
            const isVipLocked = item.minVip && state.player.vipLevel < item.minVip;

            const btnContainer = document.createElement('div');
            btnContainer.className = 'flex items-center space-x-3';
            btnContainer.innerHTML = `
                <div class="text-right">
                    <div class="text-[8px] text-gray-500 line-through">${itemData.price} LT</div>
                    <div class="text-xs font-mono text-cultivation-gold whitespace-nowrap">${finalPrice} LT</div>
                    ${isVipLocked ? `<div class="text-[7px] text-red-500 font-bold uppercase animate-pulse">Yêu cầu VIP ${item.minVip}</div>` : ''}
                </div>
            `;

            const btn = document.createElement('button');
            const isOutOfStock = item.stock <= 0;
            btn.className = `px-3 py-1.5 btn-gold text-[10px] font-bold rounded-lg whitespace-nowrap ${isOutOfStock || isVipLocked ? 'opacity-50 grayscale pointer-events-none' : ''}`;
            btn.innerHTML = `<i class="ph ph-shopping-cart-simple mr-1"></i>TRAO ĐỔI`;
            btn.onclick = (e) => {
                e.stopPropagation();
                window.game.buyItem(item.id);
            };

            btnContainer.appendChild(btn);
            el.appendChild(info);
            el.appendChild(btnContainer);
            this.elShopBuyView.appendChild(el);
        });
    }

    renderShopSell() {
        this.elShopSellGrid.innerHTML = '';
        if (!state.player || !state.player.inventory) return;

        const sectionType = state.systems.shop.currentSection;
        const subFilter = this.shopSubFilter;

        let items = [...state.player.inventory.allItems];

        // Search Filter
        if (this.shopSearchQuery) {
            items = items.filter(item => {
                const itemData = getItemById(item.id);
                return itemData && itemData.name.toLowerCase().includes(this.shopSearchQuery);
            });
        }

        // Category/Section Filter
        items = items.filter(item => {
            const itemData = getItemById(item.id);
            if (!itemData) return false;

            const typeMap = {
                'dan_duoc': ['consumable'],
                'phap_bao': ['weapon', 'armor', 'accessory', 'treasure', 'head', 'necklace', 'shoes', 'attackArtifact', 'defenseArtifact', 'flightArtifact', 'spaceArtifact', 'formationArtifact', 'supportArtifact', 'soulArtifact'],
                'nguyen_lieu': ['material', 'herb', 'ore', 'wood'],
                'cong_phap': ['book', 'technique', 'recipe', 'talisman_recipe', 'consumable'],
                'tran_phap': ['formation'],
                'phu_luc': ['talisman'],
                'luyen_khi': ['material', 'smithing_tool'],
                'tui_tru_vat': ['consumable'],
                'ky_trung': ['consumable'],
                'linh_thu': ['supportArtifact']
            };

            const catMap = {
                'dan_duoc': ['dan_duoc'],
                'phap_bao': ['phap_bao'],
                'cong_phap': ['cong_phap'],
                'bach_nghe': ['nguyen_lieu', 'phu_luc', 'tran_phap', 'luyen_khi', 'linh_dien'],
                'ky_vat': ['tui_tru_vat', 'ky_trung', 'linh_thu']
            };

            const targetSections = catMap[sectionType] || [sectionType];
            const allowedTypes = targetSections.flatMap(s => typeMap[s] || []);

            if (allowedTypes.length > 0 && !allowedTypes.includes(itemData.type)) return false;

            // Specific filter for merged Công Pháp
            if (sectionType === 'cong_phap') {
                if (subFilter !== 'all') {
                    const techCategory = this.getTechniqueCategoryForBook(itemData);
                    if (techCategory !== subFilter) return false;
                } else {
                    const isManualAction = itemData.action && (itemData.action.startsWith('open_') || itemData.action.includes('linh_the_luc') || itemData.effect?.type === 'unlock_profession');
                    const isBook = (itemData.type === 'book' || itemData.type === 'technique') && !isManualAction;
                    const isRecipe = itemData.type === 'recipe' || itemData.type === 'talisman_recipe' || isManualAction;
                    if (!isBook && !isRecipe) return false;
                }
            }

            // Sub-filter for Bách Nghệ / Kỳ Vật
            if (['bach_nghe', 'ky_vat'].includes(sectionType) && subFilter !== 'all') {
                if (!typeMap[subFilter] || !typeMap[subFilter].includes(itemData.type)) return false;
            }

            // Sub-filter for Pháp Bảo
            if (sectionType === 'phap_bao' && subFilter !== 'all' && itemData.type !== subFilter) return false;

            // Specific filter for Túi Trữ Vật
            if (subFilter === 'tui_tru_vat' && itemData.action !== 'expand_inventory') return false;

            // Quality Filter
            if (this.shopQualityFilter !== 'all' && itemData.quality !== this.shopQualityFilter) return false;

            return true;
        });

        // Sorting
        if (this.shopSortMode !== 'default') {
            items.sort((a, b) => {
                const dataA = getItemById(a.id);
                const dataB = getItemById(b.id);
                if (!dataA || !dataB) return 0;

                if (this.shopSortMode === 'price-asc') return dataA.price - dataB.price;
                if (this.shopSortMode === 'price-desc') return dataB.price - dataA.price;
                if (this.shopSortMode === 'quality') {
                    const qOrder = ['Phàm Khí', 'Pháp Khí', 'Linh Khí', 'Pháp Bảo', 'Cổ Bảo', 'Linh Bảo', 'Thông Thiên Linh Bảo', 'Tiên Khí', 'Danh Khí', 'Hạ phẩm', 'Trung phẩm', 'Thượng phẩm', 'Cực phẩm', 'Hoàn Mỹ'];
                    return qOrder.indexOf(dataB.quality) - qOrder.indexOf(dataA.quality);
                }
                return 0;
            });
        }

        if (items.length === 0) {
            this.elShopSellGrid.innerHTML = '<div class="col-span-4 text-center py-10 text-gray-600 italic text-xs">Không có bảo vật nào để giao dịch...</div>';
            return;
        }

        items.forEach(item => {
            const itemData = getItemById(item.id);
            if (!itemData) return;

            const qClass = this.getQualityClass(itemData.quality);

            let sellMult = 0.5;
            if (['material', 'herb', 'ore', 'wood'].includes(itemData.type)) sellMult = 0.3;

            const el = document.createElement('div');
            el.className = `p-2 border border-gray-800 rounded-lg bg-black/20 flex flex-col items-center cursor-pointer hover:border-${qClass} transition-colors duration-200 active:scale-95`;
            el.innerHTML = `
                <div class="text-2xl mb-1">${(itemData.image && getAssetUrl(itemData.image)) ? `<img src="${getAssetUrl(itemData.image)}" class="w-8 h-8 object-contain">` : (itemData.icon || '')}</div>
                <div class="text-[9px] text-gray-400">x${item.quantity}</div>
                <div class="text-[8px] text-cultivation-gold mt-1">${Math.floor(itemData.price * sellMult)} LT</div>
            `;
            el.onclick = () => {
                if (window.game.screens.inventory) {
                    window.game.screens.inventory.selectItem(item.id, false, true);
                }
            };
            this.elShopSellGrid.appendChild(el);
        });
    }

    /**
     * Render services section (Dịch Vụ) — Ngộ Đạo Thất rental and more.
     */
    renderShopServices() {
        if (!this.elShopBuyView) return;
        this.elShopBuyView.innerHTML = '';

        const now = Date.now();
        const ngoBuff = (state.player?.buffs || []).find(b => b.id === 'ngo_dao_that' && b.endTime > now);
        const remainingHours = ngoBuff ? Math.ceil((ngoBuff.endTime - now) / 3600000) : 0;
        const isActive = !!ngoBuff;

        const card = document.createElement('div');
        card.className = 'p-4 rounded-2xl border border-purple-500/30 bg-purple-900/10 space-y-3';
        card.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="text-4xl">🏮</div>
                <div>
                    <div class="text-sm font-bold text-purple-300">Ngộ Đạo Thất</div>
                    <div class="text-[9px] text-gray-400 mt-0.5">Phòng lĩnh ngộ đặc biệt với trận pháp dẫn linh nồng đậm, tốc độ thuần thục công pháp tăng x10.</div>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-2 text-center text-[9px]">
                <div class="p-2 rounded-xl bg-black/40 border border-white/5">
                    <div class="text-purple-400 font-bold text-xs">×10</div>
                    <div class="text-gray-500">Lĩnh ngộ</div>
                </div>
                <div class="p-2 rounded-xl bg-black/40 border border-white/5">
                    <div class="text-cultivation-gold font-bold text-xs">Bế Quan</div>
                    <div class="text-gray-500">Tương thích</div>
                </div>
                <div class="p-2 rounded-xl bg-black/40 border border-white/5">
                    <div class="text-green-400 font-bold text-xs">${isActive ? `Còn ${remainingHours}h` : 'Chưa thuê'}</div>
                    <div class="text-gray-500">Trạng thái</div>
                </div>
            </div>
            <div class="space-y-1 text-[9px] text-gray-500">
                <div>📌 Giá thuê: <span class="text-cultivation-gold">1.000</span> Linh Thạch / ngày</div>
                <div>📌 Tác dụng tốt nhất khi kết hợp với Bế Quan</div>
                <div>📌 Dùng kèm Ngộ Đạo Đan để tăng hiệu quả tối đa</div>
            </div>
            ${isActive
                ? `<div class="py-2 text-center text-[10px] font-bold text-purple-300 border border-purple-500/30 rounded-xl animate-pulse">✨ Đang ở trong Ngộ Đạo Thất — Còn ${remainingHours} giờ</div>`
                : `<button onclick="window.game.rentNgoDaoThat('shop')" class="w-full py-2.5 rounded-xl text-[11px] font-bold text-black bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 active:scale-95 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]">🏮 THUÊ NGỘ ĐẠO THẤT</button>`
            }
        `;
        this.elShopBuyView.appendChild(card);

        // Spacer + hint
        const hint = document.createElement('div');
        hint.className = 'text-center text-[9px] text-gray-600 italic pt-2';
        hint.textContent = '— Thêm dịch vụ sẽ được mở khóa khi cảnh giới tiến bộ —';
        this.elShopBuyView.appendChild(hint);
    }
}
