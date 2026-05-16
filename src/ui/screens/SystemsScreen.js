import { state } from '../../state.js';
import { getLocationById } from '../../configs/map-data.js';

import { getItemById } from '../../configs/item-data.js';
import { ALCHEMY_RECIPES, getAlchemyLevelInfo, getFlameById, getCauldronById } from '../../configs/alchemy-data.js';
import { SMITHING_RECIPES, getSmithingLevelInfo } from '../../configs/smithing-data.js';
import { SEEDS, SOILS, FIELD_GRADES, FIELD_ATTRIBUTES, HERB_AGE_MILESTONES } from '../../configs/garden-data.js';
import { ALCHEMY_CERTIFICATIONS, GUILD_MISSIONS, ALCHEMY_ROOMS } from '../../configs/guild-data.js';
import { TOWER_LEVELS } from '../../configs/tower-data.js';
import { MOUNTAIN_LAYERS, MOUNTAIN_TIERS } from '../../configs/mountain-data.js';
import { SECTS, getSectById } from '../../configs/sect-data.js';
import { getRealmById } from '../../configs/realm-data.js';
import { CORPSE_TYPES, getCorpseLevelInfo } from '../../configs/corpse-data.js';
import { SHOPS } from '../../configs/shop-data.js';
import { ASSETS, getAssetUrl } from '../../configs/asset-data.js';
import { PUPPET_RECIPES, PUPPET_GRADES } from '../../configs/puppet-data.js';
import { TALISMAN_RECIPES, getTalismanLevelInfo } from '../../configs/talisman-data.js';
import { BEASTS, BEAST_TYPES, BLOODLINES, getBeastLevelInfo } from '../../configs/beast-data.js';
import { getTechniqueById, getSecretTechniqueById, MASTERY_LEVELS } from '../../configs/technique-data.js';


/**
 * Quản lý giao diện của các hệ thống phụ (Alchemy, Shop, Sect, Guild, v.v.)
 * Tạm thời gom vào đây để dọn dẹp main.js. Sau này sẽ tách riêng từng cái.
 */
export class SystemsScreen {
    constructor() {
        this.shopSubFilter = 'all';
        this.shopQualityFilter = 'all';
        this.initElements();
        this.initEvents();
    }

    initElements() {
        // Alchemy
        this.btnAlchemyTabRecipes = document.getElementById('alchemy-tab-recipes');
        this.btnAlchemyTabGarden = document.getElementById('alchemy-tab-garden');
        this.viewAlchemyRecipes = document.getElementById('alchemy-recipes-view');
        this.viewAlchemyGarden = document.getElementById('alchemy-garden-view');
        this.elAlchemyLvlText = document.getElementById('alchemy-level-text');
        this.elAlchemyExpBar = document.getElementById('alchemy-exp-bar');
        this.elGardenPlots = document.getElementById('garden-plots');

        // Shop
        this.elShopLingShi = document.getElementById('shop-ling-shi');
        this.elShopBuyView = document.getElementById('shop-buy-view');
        this.elShopSellView = document.getElementById('shop-sell-view');
        this.elShopSellGrid = document.getElementById('shop-sell-grid');
        this.elShopSectionNav = document.getElementById('shop-section-nav');
        this.elShopSubFilterNav = document.getElementById('shop-subfilter-nav');
        this.elShopQualityFilterNav = document.getElementById('shop-quality-filter-nav');
        this.elShopFiltersWrap = document.getElementById('shop-filters-wrap');
        this.btnShopTabBuy = document.getElementById('shop-tab-buy');
        this.btnShopTabSell = document.getElementById('shop-tab-sell');

        // Other lists
        this.elGuildCerts = document.getElementById('guild-cert-list');

        // Technique Screen
        this.elTechListView = document.getElementById('tech-list-view');
        this.elTechDetailView = document.getElementById('tech-detail-view');
        this.elTechDetailContent = document.getElementById('tech-detail-content');
        this.elTechPoints = document.getElementById('tech-points');
        this.btnTechTabCultivation = document.getElementById('tech-tab-cultivation');
        this.btnTechTabSecret = document.getElementById('tech-tab-secret');
        this.btnTechBack = document.getElementById('tech-back-btn');
        this.elGuildMissions = document.getElementById('guild-mission-list');
        this.elGuildRooms = document.getElementById('guild-room-list');
        this.elTowerFloors = document.getElementById('tower-floor-list');
        this.elSectsView = document.getElementById('sects-view');
    }

    initEvents() {
        if (this.btnAlchemyTabRecipes) {
            this.btnAlchemyTabRecipes.onclick = () => {
                state.views.alchemy = 'recipes';
                this.renderAlchemy();
            };
        }
        if (this.btnAlchemyTabGarden) {
            this.btnAlchemyTabGarden.onclick = () => {
                state.views.alchemy = 'garden';
                this.renderAlchemy();
            };
        }
        if (this.btnShopTabBuy) {
            this.btnShopTabBuy.onclick = () => {
                state.views.shop = 'buy';
                this.renderShop();
            };
        }
        if (this.btnShopTabSell) {
            this.btnShopTabSell.onclick = () => {
                state.views.shop = 'sell';
                this.renderShop();
            };
        }
        // Technique Tabs
        if (this.btnTechTabCultivation) this.btnTechTabCultivation.onclick = () => this.renderTechniques('cultivation');
        if (this.btnTechTabSecret) this.btnTechTabSecret.onclick = () => this.renderTechniques('secret');
        if (this.btnTechBack) this.btnTechBack.onclick = () => {
            this.elTechListView.classList.remove('hidden');
            this.elTechDetailView.classList.add('hidden');
        };
    }

    // --- ALCHEMY ---
    renderAlchemy() {
        if (!state.player) return;

        const toolsContainer = document.getElementById('alchemy-tools-container');

        if (state.views.alchemy === 'recipes') {
            this.viewAlchemyRecipes.classList.remove('hidden');
            this.viewAlchemyGarden.classList.add('hidden');
            if (toolsContainer) toolsContainer.classList.remove('hidden');

            // Tab styles
            if (this.btnAlchemyTabRecipes) this.btnAlchemyTabRecipes.className = "flex-grow py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all";
            if (this.btnAlchemyTabGarden) this.btnAlchemyTabGarden.className = "flex-grow py-3 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all";
        } else {
            this.viewAlchemyRecipes.classList.add('hidden');
            this.viewAlchemyGarden.classList.remove('hidden');
            if (toolsContainer) toolsContainer.classList.add('hidden');

            // Tab styles
            if (this.btnAlchemyTabRecipes) this.btnAlchemyTabRecipes.className = "flex-grow py-3 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all";
            if (this.btnAlchemyTabGarden) this.btnAlchemyTabGarden.className = "flex-grow py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all";
        }

        const lvlInfo = getAlchemyLevelInfo(state.player.alchemyLevel);
        this.elAlchemyLvlText.textContent = lvlInfo.name;
        const nextLevelExp = state.player.alchemyLevel * 100 * Math.pow(1.5, state.player.alchemyLevel - 1);
        this.elAlchemyExpBar.style.width = `${(state.player.alchemyExp / nextLevelExp) * 100}%`;

        if (state.views.alchemy === 'recipes') {
            this.renderRecipes();
        } else {
            this.renderGarden();
        }

        const cauldronName = document.getElementById('alchemy-cauldron-name');
        const flameName = document.getElementById('alchemy-flame-name');

        if (cauldronName) {
            const cauldron = getCauldronById(state.player.currentCauldron);
            if (cauldron) {
                cauldronName.innerHTML = `<span class="text-white">${cauldron.name}</span>`;
            } else {
                cauldronName.innerHTML = `<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`;
            }
        }

        if (flameName) {
            const flame = getFlameById(state.player.currentFlame);
            if (flame) {
                flameName.innerHTML = `<span class="text-white">${flame.name}</span>`;
            } else {
                flameName.innerHTML = `<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`;
            }
        }
    }

    renderRecipes() {
        this.viewAlchemyRecipes.innerHTML = '';
        const known = ALCHEMY_RECIPES.filter(r => state.player.knownRecipes.includes(r.id));

        if (known.length === 0) {
            this.viewAlchemyRecipes.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được đan phương nào...</div>';
            return;
        }

        known.forEach(recipe => {
            const resultItem = getItemById(recipe.resultId);
            if (!resultItem) return;
            const qClass = this.getQualityClass(resultItem.quality);
            const el = document.createElement('div');
            el.className = 'p-4 border border-gray-800 rounded-2xl bg-white/5 space-y-3';

            let materialsHTML = '';
            recipe.materials.forEach(mat => {
                const matItem = getItemById(mat.id);
                if (!matItem) return;
                const playerMat = state.player.inventory.items.find(i => i.id === mat.id);
                const count = playerMat ? playerMat.quantity : 0;
                const enough = count >= mat.quantity;
                materialsHTML += `<div class="text-[10px] ${enough ? 'text-gray-400' : 'text-red-500'}">${matItem.name}: ${count}/${mat.quantity}</div>`;
            });

            const locked = state.player.alchemyLevel < recipe.level;

            el.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <span class="text-xl mr-2">${resultItem.image ? `<img src="${getAssetUrl(resultItem.image)}" class="w-6 h-6 object-contain inline-block">` : (resultItem.icon || '')}</span>
                        <span class="font-bold quality-${qClass} font-ancient">${resultItem.name}</span>
                    </div>
                    ${locked ?
                    `<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${recipe.level}</span>` :
                    `<button class="px-3 py-1.5 btn-gold text-[10px] font-bold rounded-lg whitespace-nowrap" onclick="window.game.craft('${recipe.id}')">LUYỆN CHẾ</button>`
                }
                </div>
                <div class="grid grid-cols-2 gap-1">${materialsHTML}</div>
                <div class="text-[9px] text-gray-500 italic">${recipe.description}</div>
            `;
            this.viewAlchemyRecipes.appendChild(el);
        });
    }

    renderGarden() {
        this.elGardenPlots.innerHTML = '';
        state.player.gardenPlots.forEach((plot, index) => {
            const el = document.createElement('div');
            const gradeInfo = FIELD_GRADES[plot.grade] || FIELD_GRADES.PHAM;
            const attrInfo = FIELD_ATTRIBUTES[plot.attribute] || FIELD_ATTRIBUTES.NORMAL;

            el.className = `p-4 border rounded-3xl bg-white/5 flex flex-col space-y-4 transition-all hover:border-qi-jade/30 border-white/5 relative overflow-hidden`;

            // Background attribute icon
            const bgIcon = document.createElement('div');
            bgIcon.className = 'absolute -right-2 -bottom-2 text-4xl opacity-5 pointer-events-none';
            bgIcon.textContent = attrInfo.icon;
            el.appendChild(bgIcon);

            let contentHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center space-x-2">
                            <span class="text-[9px] px-2 py-0.5 rounded-full border bg-white/5 text-gray-400 border-white/10 uppercase font-bold">${gradeInfo.name}</span>
                            <span class="text-[9px] px-2 py-0.5 rounded-full border bg-white/5 text-[${attrInfo.color}] border-white/10 uppercase font-bold" style="color: ${attrInfo.color}">${attrInfo.icon} ${attrInfo.name}</span>
                        </div>
                    </div>
                    <button class="p-1.5 hover:bg-white/10 rounded-full transition-colors" onclick="window.game.showFieldMenu(${index})">
                        <i class="ph ph-gear text-gray-500 text-xs"></i>
                    </button>
                </div>
            `;

            if (plot.seedId) {
                const seed = SEEDS.find(s => s.id === plot.seedId);
                const herbItem = getItemById(seed.herbId);

                contentHTML += `
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/10">
                            ${herbItem?.icon || '🌱'}
                        </div>
                        <div class="flex-grow">
                            <h4 class="text-xs font-ancient text-white">${seed.name}</h4>
                            <div class="flex items-center space-x-2 mt-1">
                                <span class="text-[10px] text-qi-jade font-bold">${plot.stage}</span>
                                <span class="text-[9px] text-gray-500">(${Math.floor(plot.age)} năm)</span>
                            </div>
                        </div>
                        <button class="px-3 py-1.5 bg-qi-jade/10 text-qi-jade text-[10px] font-bold rounded-xl border border-qi-jade/20 active:scale-95 transition-all" onclick="window.game.harvest(${index})">THU HOẠCH</button>
                    </div>
                `;
            } else {
                contentHTML += `
                    <div class="flex flex-col items-center justify-center py-4 space-y-3">
                        <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                            <i class="ph ph-plus text-gray-600"></i>
                        </div>
                        <button class="px-6 py-2 bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] font-bold rounded-xl border border-white/10 transition-all" onclick="window.game.showPlantMenu(${index})">GIEO HẠT</button>
                    </div>
                `;
            }

            el.innerHTML += contentHTML;
            this.elGardenPlots.appendChild(el);
        });
    }

    // --- SHOP ---
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
                // Shorten name for UI if needed, or just use the name
                elTitle.textContent = shopData.name.split(' - ')[0];
            }
        }

        this.renderShopSections();
        this.renderShopSubFilters();

        // Cập nhật style cho tab
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
            this.renderShopBuy();
        } else {
            this.elShopBuyView.classList.add('hidden');
            this.elShopSellView.classList.remove('hidden');
            this.renderShopSell();
        }
    }

    renderShopSections() {
        if (!this.elShopSectionNav) return;
        const shop = state.systems.shop;
        const shopData = SHOPS[shop.currentShopId];

        const sections = Object.keys(shopData.sections);
        const currentButtons = this.elShopSectionNav.querySelectorAll('button');

        // Map section names to Vietnamese
        const names = {
            'dan_duoc': 'Đan Dược',
            'phap_bao': 'Pháp Bảo',
            'nguyen_lieu': 'Nguyên Liệu',
            'cong_phap': 'Bí Tịch',
            'tran_phap': 'Trận Pháp',
            'phu_luc': 'Phù Lục',
            'luyen_khi': 'Luyện Khí',
            'linh_dien': 'Linh Điền',
            'ky_trung': 'Kỳ Trùng',
            'tui_tru_vat': 'Túi Trữ Vật'
        };

        // If buttons count doesn't match or shop changed, rebuild
        if (currentButtons.length !== sections.length || this.elShopSectionNav.dataset.shopId !== shop.currentShopId) {
            this.elShopSectionNav.innerHTML = '';
            this.elShopSectionNav.dataset.shopId = shop.currentShopId;

            sections.filter(s => s !== 'bi_tich').forEach(sectionKey => {
                const el = document.createElement('button');
                el.dataset.section = sectionKey;
                el.onclick = () => {
                    if (state.systems.shop) {
                        state.systems.shop.currentSection = sectionKey;
                        this.shopSubFilter = 'all'; // Reset sub-filter
                        this.shopQualityFilter = 'all'; // Reset quality filter
                        this.renderShop();
                    }
                };
                this.elShopSectionNav.appendChild(el);
            });
        }

        // Update classes and text for all buttons
        this.elShopSectionNav.querySelectorAll('button').forEach(btn => {
            const sectionKey = btn.dataset.section;
            const active = shop.currentSection === sectionKey;
            btn.className = `px-4 py-2 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${active ? 'bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/30' : 'text-gray-500 border border-transparent'}`;
            btn.textContent = names[sectionKey] || sectionKey;
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
                { id: 'all', name: '--- Lọc Loại Trang Bị ---' },
                { id: 'weapon', name: 'Linh Khí (Vũ Khí)' },
                { id: 'armor', name: 'Pháp Y (Giáp)' },
                { id: 'accessory', name: 'Trang Sức' },
                { id: 'attackArtifact', name: 'Pháp Bảo: Chủ Chiến' },
                { id: 'defenseArtifact', name: 'Pháp Bảo: Hộ Thân' },
                { id: 'flightArtifact', name: 'Pháp Bảo: Phi Hành' },
                { id: 'spaceArtifact', name: 'Pháp Bảo: Càn Khôn' },
                { id: 'formationArtifact', name: 'Pháp Bảo: Trận Đạo' },
                { id: 'supportArtifact', name: 'Pháp Bảo: Phụ Trợ' },
                { id: 'soulArtifact', name: 'Pháp Bảo: Hồn Đạo' }
            ];
        } else if (section === 'cong_phap') {
            subFilters = [
                { id: 'all', name: '--- Lọc Loại Bí Tịch ---' },
                { id: 'cultivation', name: 'Công Pháp Tu Luyện' },
                { id: 'manual', name: 'Bí Tịch Kỹ Năng' }
            ];
        }

        if (subFilters.length === 0) {
            this.elShopFiltersWrap?.classList.add('hidden');
            this.elShopSubFilterNav.innerHTML = '';
            return;
        }

        this.elShopFiltersWrap?.classList.remove('hidden');
        this.elShopSubFilterNav.className = "p-2";
        this.elShopSubFilterNav.innerHTML = `
            <select id="shop-subfilter-select" class="w-full bg-black/40 text-qi-blue border border-qi-blue/20 rounded-lg px-2 py-1.5 text-[9px] font-ancient uppercase tracking-widest outline-none transition-all focus:border-qi-blue/50">
                ${subFilters.map(f => `<option value="${f.id}" ${this.shopSubFilter === f.id ? 'selected' : ''}>${f.name}</option>`).join('')}
            </select>
        `;

        const select = this.elShopSubFilterNav.querySelector('#shop-subfilter-select');
        select.onchange = (e) => {
            this.shopSubFilter = e.target.value;
            this.renderShop();
        };
    }

    renderShopQualityFilters() {
        if (!this.elShopQualityFilterNav) return;
        const shop = state.systems.shop;
        if (!shop) return;

        const section = shop.currentSection;
        const isPhapBao = section === 'phap_bao';

        if (!isPhapBao) {
            this.elShopQualityFilterNav.classList.add('hidden');
            this.elShopSubFilterNav.classList.remove('border-r', 'border-white/5');
            this.elShopQualityFilterNav.innerHTML = '';
            return;
        }

        this.elShopSubFilterNav.classList.add('border-r', 'border-white/5');
        const qualities = [
            { id: 'all', name: 'Tất cả phẩm' },
            { id: 'Phàm Khí', name: 'Phàm Khí' },
            { id: 'Pháp Khí', name: 'Pháp Khí' },
            { id: 'Linh Khí', name: 'Linh Khí' },
            { id: 'Pháp Bảo', name: 'Pháp Bảo' },
            { id: 'Cổ Bảo', name: 'Cổ Bảo' },
            { id: 'Linh Bảo', name: 'Linh Bảo' },
            { id: 'Thông Thiên Linh Bảo', name: 'Thông Thiên Linh Bảo' },
            { id: 'Tiên Khí', name: 'Tiên Khí' },
            { id: 'Danh Khí', name: 'Danh Khí' }
        ];

        this.elShopQualityFilterNav.classList.remove('hidden');
        this.elShopQualityFilterNav.className = "p-2 flex-1 border-white/5";
        this.elShopQualityFilterNav.innerHTML = `
            <select id="shop-quality-select" class="w-full bg-black/40 text-cultivation-gold border border-cultivation-gold/20 rounded-lg px-2 py-1.5 text-[9px] font-ancient uppercase tracking-widest outline-none transition-all focus:border-cultivation-gold/50">
                ${qualities.map(q => `<option value="${q.id}" ${this.shopQualityFilter === q.id ? 'selected' : ''}>${q.name}</option>`).join('')}
            </select>
        `;

        const select = this.elShopQualityFilterNav.querySelector('#shop-quality-select');
        select.onchange = (e) => {
            this.shopQualityFilter = e.target.value;
            this.renderShop();
        };
    }

    renderShopBuy() {
        const shop = state.systems.shop;
        let inv = shop.getShopInventory();

        // Virtual Merge for Công Pháp and Bí Tịch
        if (shop.currentSection === 'cong_phap') {
            const shopData = SHOPS[shop.currentShopId];
            if (shopData.sections.bi_tich) {
                inv = [...inv, ...shopData.sections.bi_tich];
            }
        }

        this.elShopBuyView.innerHTML = '';

        inv.forEach(item => {
            const itemData = getItemById(item.id);
            if (!itemData) return;

            // Apply Sub-filter
            if (this.shopSubFilter !== 'all') {
                if (shop.currentSection === 'phap_bao') {
                    if (itemData.type !== this.shopSubFilter) return;
                } else if (shop.currentSection === 'cong_phap') {
                    const isManualAction = itemData.action && (itemData.action.startsWith('open_') || itemData.action.includes('linh_the_luc') || itemData.effect?.type === 'unlock_profession');
                    const isBook = (itemData.type === 'book' || itemData.type === 'technique') && !isManualAction;
                    const isRecipe = itemData.type === 'recipe' || itemData.type === 'talisman_recipe' || isManualAction;

                    if (this.shopSubFilter === 'cultivation' && !isBook) return;
                    if (this.shopSubFilter === 'manual' && !isRecipe) return;
                }
            }

            // Apply Quality Filter
            if (this.shopQualityFilter !== 'all') {
                if (itemData.quality !== this.shopQualityFilter) return;
            }
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
                <div class="text-2xl bg-black/60 p-2 rounded-lg border border-${qClass}/30">${itemData.image ? `<img src="${getAssetUrl(itemData.image)}" class="w-8 h-8 object-contain">` : (itemData.icon || '')}</div>
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

        state.player.inventory.items.forEach(item => {
            const itemData = getItemById(item.id);
            if (!itemData) return;

            // Simple mapping for filtering
            const typeMap = {
                'dan_duoc': ['consumable'],
                'phap_bao': ['weapon', 'armor', 'accessory', 'treasure', 'head', 'necklace', 'shoes', 'attackArtifact', 'defenseArtifact', 'flightArtifact', 'spaceArtifact', 'formationArtifact', 'supportArtifact', 'soulArtifact'],
                'nguyen_lieu': ['material', 'herb', 'ore', 'wood'],
                'cong_phap': ['book', 'technique', 'recipe', 'talisman_recipe', 'consumable'], // Merged types
                'tran_phap': ['formation'],
                'phu_luc': ['talisman'],
                'luyen_khi': ['material', 'smithing_tool'],
                'tui_tru_vat': ['consumable']
            };

            if (sectionType && typeMap[sectionType]) {
                if (!typeMap[sectionType].includes(itemData.type)) return;

                // Specific filter for merged Công Pháp
                if (sectionType === 'cong_phap') {
                    const isManualAction = itemData.action && (itemData.action.startsWith('open_') || itemData.action.includes('linh_the_luc'));
                    const isBook = (itemData.type === 'book' || itemData.type === 'technique') && !isManualAction;
                    const isRecipe = itemData.type === 'recipe' || itemData.type === 'talisman_recipe' || (itemData.type === 'consumable' && itemData.effect?.type === 'unlock_profession') || isManualAction;

                    if (subFilter === 'cultivation' && !isBook) return;
                    if (subFilter === 'manual' && isBook) return;
                    if (subFilter === 'manual' && !isRecipe && !isBook) return; // Fallback

                    // If no subfilter, only show books and recipes
                    if (subFilter === 'all' && !isBook && !isRecipe) return;
                }

                // Sub-filter for Pháp Bảo
                if (sectionType === 'phap_bao' && subFilter !== 'all' && itemData.type !== subFilter) return;

                // Specific filter for Túi Trữ Vật
                if (sectionType === 'tui_tru_vat' && itemData.action !== 'expand_inventory') return;

                // Quality Filter
                if (this.shopQualityFilter !== 'all' && itemData.quality !== this.shopQualityFilter) return;
            }

            const qClass = this.getQualityClass(itemData.quality);

            let sellMult = 0.5;
            if (['material', 'herb', 'ore', 'wood'].includes(itemData.type)) sellMult = 0.3;

            const el = document.createElement('div');
            el.className = `p-2 border border-gray-800 rounded-lg bg-black/20 flex flex-col items-center cursor-pointer hover:border-${qClass} transition-colors duration-200 active:scale-95`;
            el.innerHTML = `
                <div class="text-2xl mb-1">${itemData.image ? `<img src="${getAssetUrl(itemData.image)}" class="w-8 h-8 object-contain">` : (itemData.icon || '')}</div>
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

    // --- GUILD ---
    renderGuild() {
        if (!state.player) return;
        this.elGuildCerts.innerHTML = '';
        this.elGuildMissions = document.getElementById('guild-mission-list');
        this.elGuildRooms = document.getElementById('guild-room-list');

        ALCHEMY_CERTIFICATIONS.forEach(cert => {
            const locked = state.player.alchemyLevel < cert.requirements.alchemyLevel;
            const el = document.createElement('div');
            el.className = 'p-4 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center';
            el.innerHTML = `
                <div>
                    <h4 class="text-sm font-ancient text-white">${cert.name}</h4>
                    <p class="text-[10px] text-gray-500">Phí: ${cert.requirements.fee} LT | Cần luyện: ${cert.task.quantity} ${getItemById(cert.task.targetId)?.name || 'đan dược'}</p>
                </div>
                <button class="px-3 py-1.5 bg-qi-blue text-black text-[10px] font-bold rounded-lg ${locked ? 'opacity-50' : ''}" 
                    onclick="window.game.guildCertify(${cert.level})">KHẢO HẠCH</button>
            `;
            this.elGuildCerts.appendChild(el);
        });

        if (this.elGuildMissions) {
            this.elGuildMissions.innerHTML = '';
            GUILD_MISSIONS.forEach(mission => {
                const el = document.createElement('div');
                el.className = 'p-4 border border-white/5 rounded-xl bg-white/5 space-y-2';
                el.innerHTML = `
                    <div class="flex justify-between items-center">
                        <h4 class="text-sm font-ancient text-white">${mission.name}</h4>
                        <button class="px-3 py-1 bg-qi-purple text-white text-[10px] font-bold rounded-lg" 
                            onclick="window.game.guildMission('${mission.id}')">GIAO NỘP</button>
                    </div>
                    <p class="text-[10px] text-gray-400 italic">${mission.description}</p>
                    <p class="text-[9px] text-cultivation-gold">Thưởng: ${mission.rewards.lingShi} LT | Danh vọng: ${mission.rewards.reputation}</p>
                `;
                this.elGuildMissions.appendChild(el);
            });
        }

        if (this.elGuildRooms) {
            this.elGuildRooms.innerHTML = '';
            ALCHEMY_ROOMS.forEach(room => {
                const active = state.player.currentAlchemyRoom === room.id;
                const el = document.createElement('div');
                el.className = `p-4 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center ${active ? 'border-cultivation-gold' : ''}`;
                el.innerHTML = `
                    <div>
                        <h4 class="text-sm font-ancient text-white">${room.name} ${active ? '⭐' : ''}</h4>
                        <p class="text-[10px] text-gray-500">Phí thuê: ${room.fee} LT | Tăng ${room.successBonus * 100}% thành công</p>
                    </div>
                    <button class="px-3 py-1.5 ${active ? 'bg-gray-800' : 'bg-cultivation-gold'} text-black text-[10px] font-bold rounded-lg" 
                        onclick="window.game.guildRent('${room.id}')">${active ? 'ĐANG THUÊ' : 'THUÊ'}</button>
                `;
                this.elGuildRooms.appendChild(el);
            });
        }
    }

    renderTower() {
        const elFloors = document.getElementById('tower-floor-list');
        if (!elFloors) return;
        elFloors.innerHTML = '';

        TOWER_LEVELS.forEach(floor => {
            const locked = state.player.alchemyLevel < floor.minAlchemyLevel;
            const el = document.createElement('div');
            el.className = `p-6 border border-white/5 rounded-2xl bg-white/5 space-y-3 ${locked ? 'opacity-40' : 'hover:border-cultivation-gold/50 cursor-pointer'}`;
            el.innerHTML = `
                <div class="flex justify-between items-center">
                    <h4 class="text-lg font-ancient text-cultivation-gold">${floor.name}</h4>
                    ${locked ? `<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${floor.minAlchemyLevel}</span>` : '<i class="ph ph-caret-right text-gray-500"></i>'}
                </div>
                <p class="text-xs text-gray-400">${floor.description}</p>
            `;
            if (!locked) el.onclick = () => state.ui.toast(`Đang tiến vào ${floor.name}...`, "success");
            elFloors.appendChild(el);
        });
    }

    renderMountain() {
        const elLayerName = document.getElementById('mountain-layer-name');
        const elLayerDesc = document.getElementById('mountain-layer-desc');
        const elLayerProgText = document.getElementById('mountain-layer-progress-text');
        const elLayerProgBar = document.getElementById('mountain-layer-progress-bar');
        const elOxyText = document.getElementById('mountain-oxygen-text');
        const elOxyBar = document.getElementById('mountain-oxygen-bar');
        const elToxText = document.getElementById('mountain-toxicity-text');
        const elToxBar = document.getElementById('mountain-toxicity-bar');
        const elEventLog = document.getElementById('mountain-event-log');

        if (!state.player.mountainSurvival) return;

        const mSys = state.systems.mountain;
        const layer = MOUNTAIN_LAYERS.find(l => l.id === mSys.currentLayer);
        const tier = MOUNTAIN_TIERS.find(t => t.id === layer.tier);

        if (elLayerName) {
            const tierColor = {
                'ngoai_son': 'text-green-400',
                'trung_son': 'text-blue-400',
                'noi_son': 'text-purple-400',
                'cam_khu': 'text-red-500'
            }[layer.tier] || 'text-red-400';

            elLayerName.innerHTML = `<span class="text-[10px] block opacity-60 uppercase tracking-tighter">${tier.name}</span>${layer.name}`;
            elLayerName.className = `text-2xl font-ancient ${tierColor} mb-1`;
        }

        if (elLayerDesc) elLayerDesc.textContent = layer.description;

        // Progress display (Global Discovery for this layer)
        const discovery = mSys.discovery[mSys.currentLayer] || 0;
        if (elLayerProgText) elLayerProgText.textContent = `${Math.floor(mSys.layerProgress)}% (Khám phá: ${Math.floor(discovery)}%)`;
        if (elLayerProgBar) elLayerProgBar.style.width = `${mSys.layerProgress}%`;

        // Survival Bars
        if (elOxyText) elOxyText.textContent = `${Math.ceil(state.player.mountainSurvival.oxygen)}%`;
        if (elOxyBar) elOxyBar.style.width = `${state.player.mountainSurvival.oxygen}%`;
        if (elToxText) elToxText.textContent = `${Math.ceil(state.player.mountainSurvival.toxicity)}%`;
        if (elToxBar) elToxBar.style.width = `${state.player.mountainSurvival.toxicity}%`;

        // Boss Status Indicator (Optional UI update)
        const btnDeeper = document.getElementById('btn-mountain-deeper');
        if (btnDeeper) {
            const bossDefeated = mSys.bossDefeated[layer.tier];
            if (mSys.layerProgress >= 100 && !bossDefeated) {
                btnDeeper.innerHTML = `<span class="relative z-10 text-xs font-bold text-red-500 uppercase tracking-[0.2em] animate-pulse">KHIÊU CHIẾN THỦ LĨNH</span>`;
            } else {
                btnDeeper.innerHTML = `<span class="relative z-10 text-xs font-bold text-red-400 uppercase tracking-[0.2em]">TẦNG KẾ TIẾP</span>`;
            }
        }

        // Check if player is dying
        if (state.player.hp <= 0) {
            state.systems.mountain.stop();
            state.ui.toggleOverlay(document.getElementById('mountain-overlay'), false);
        }
    }

    renderSects() {
        const elSects = document.getElementById('sects-view');
        if (!elSects) return;
        elSects.innerHTML = '';

        if (state.player.sectId) {
            const sect = getSectById(state.player.sectId);
            elSects.innerHTML = `
                <div class="bg-white/5 rounded-2xl border border-qi-blue/30 overflow-hidden">
                    <div class="h-32 relative">
                        <img src="${sect.portrait || ASSETS.backgrounds.sect}" class="w-full h-full object-cover opacity-40">
                        <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                        <div class="absolute bottom-4 left-4">
                            <h3 class="text-2xl font-ancient text-white">${sect.name}</h3>
                            <p class="text-[10px] text-qi-blue uppercase">Đệ tử nội môn</p>
                        </div>
                    </div>
                    <div class="p-4 space-y-4">
                        <div class="flex justify-between text-xs">
                            <span class="text-gray-500">Điểm cống hiến:</span>
                            <span class="text-cultivation-gold">${state.player.sectContribution || 0}</span>
                        </div>
                        <h4 class="text-xs font-ancient text-gray-300 uppercase tracking-widest border-b border-white/10 pb-2">Ủy Thác Tông Môn</h4>
                        <div class="space-y-3">
                            ${sect.missions.map(m => `
                                <div class="p-3 bg-black/40 rounded-lg border border-white/5 flex justify-between items-center">
                                    <div>
                                        <div class="text-sm font-bold">${m.name}</div>
                                        <div class="text-[9px] text-gray-500">${m.desc}</div>
                                    </div>
                                    <button class="px-4 py-2 bg-qi-purple/10 text-qi-purple text-[10px] font-bold rounded-lg flex items-center justify-center border border-qi-purple/20" onclick="window.game.doMission('${m.id}')">
                                        <i class="ph ph-scroll mr-1"></i>LÀM
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else {
            Object.values(SECTS).forEach(sect => {
                const canJoin = state.player.realmId >= sect.minRealm;
                const el = document.createElement('div');
                el.className = `p-4 border rounded-xl bg-black/40 space-y-3 ${canJoin ? 'border-gray-800' : 'opacity-50 grayscale'}`;
                el.innerHTML = `
                    <div class="flex justify-between items-center">
                        <h3 class="text-xl font-ancient text-white">${sect.name}</h3>
                        <span class="text-[10px] ${canJoin ? 'text-qi-blue' : 'text-red-500'}">${canJoin ? 'Có thể bái nhập' : 'Cần: ' + getRealmById(sect.minRealm).name}</span>
                    </div>
                    <p class="text-xs text-gray-500">${sect.description}</p>
                    <button class="w-full py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-xl flex items-center justify-center ${canJoin ? '' : 'hidden'}" onclick="window.game.joinSect('${sect.id}')">
                        <i class="ph ph-identification-badge mr-2"></i>BÁI NHẬP TÔNG MÔN
                    </button>
                `;
                elSects.appendChild(el);
            });
        }
    }

    renderEnergy() {
        if (!state.player) return;

        const elEnvList = document.getElementById('env-energy-list');
        const elEnvPurity = document.getElementById('env-purity-tag');
        if (elEnvList && state.currentLocId) {
            const loc = getLocationById(state.currentWorldId, state.currentLocId);
            if (loc && loc.energies) {
                if (elEnvPurity && loc.energies.length > 0) {
                    const purityId = loc.energies[0].purity || 'TINH_THUAN';
                    const purity = state.systems.energy.getPurity(purityId);
                    elEnvPurity.textContent = purity.name;
                }

                elEnvList.innerHTML = loc.energies.map(e => {
                    const type = state.systems.energy.getEnergyType(e.type);
                    return `
                        <div class="flex flex-col items-center space-y-1">
                            <span class="text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">${type.icon}</span>
                            <div class="flex flex-col items-center">
                                <span class="text-[9px] text-white font-mono font-bold">${e.concentration}%</span>
                                <span class="text-[7px] text-gray-500 font-ancient uppercase tracking-widest">${type.name}</span>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                elEnvList.innerHTML = '';
            }
        }

        // Accumulated Qi (Character Screen)
        const elCharEnergyList = document.getElementById('char-energy-list');
        if (elCharEnergyList) {
            const entries = Object.entries(state.player.qiAccumulated).filter(([_, data]) => data.amount > 0);
            if (entries.length === 0) {
                elCharEnergyList.innerHTML = '<div class="text-[9px] text-gray-600 italic">Chưa có khí tức tích lũy</div>';
            } else {
                elCharEnergyList.innerHTML = entries.map(([typeId, data]) => {
                    const type = state.systems.energy.getEnergyType(typeId);
                    const purity = state.systems.energy.getPurity(data.purity);
                    const logAmount = Math.log10(data.amount + 1);
                    return `
                        <div class="p-2 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <span class="text-sm">${type.icon}</span>
                                <div>
                                    <div class="text-[9px] font-bold text-white font-ancient">${type.name}</div>
                                    <div class="text-[7px] text-qi-blue uppercase">${purity.name}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-[8px] font-mono text-gray-400">${Math.floor(data.amount).toLocaleString()} Qi</div>
                                <div class="text-[7px] text-cultivation-gold">+${(logAmount * 10).toFixed(1)} Bonus</div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    }

    getQualityClass(quality) {
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
            // Compatibility for sub-qualities if they appear in metadata
            'Hạ phẩm': 'pham', 'Trung phẩm': 'hoang', 'Thượng phẩm': 'huyen', 'Cực phẩm': 'dia', 'Hoàn Mỹ': 'thien'
        };
        return map[quality] || 'pham';
    }

    renderSmithing() {
        const view = document.getElementById('smithing-recipes');
        if (!view) return;
        view.innerHTML = '';

        const toolName = document.getElementById('smithing-tool-name');
        const flameName = document.getElementById('smithing-flame-name');

        if (toolName) {
            const tool = state.player.smithingTool ? getItemById(state.player.smithingTool) : null;
            if (tool) {
                toolName.innerHTML = `<span class="text-white">${tool.name}</span>`;
            } else {
                toolName.innerHTML = `<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'luyen_khi')" class="ml-2 text-[8px] text-red-400 underline hover:text-white transition-colors">MUA NGAY</button>`;
            }
        }

        if (flameName) {
            const flame = getFlameById(state.player.currentFlame);
            if (flame) {
                flameName.innerHTML = `<span class="text-white">${flame.name}</span>`;
            } else {
                flameName.innerHTML = `<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-red-400 underline hover:text-white transition-colors">MUA NGAY</button>`;
            }
        }

        const lvlInfo = getSmithingLevelInfo(state.player.smithingLevel);
        const lvlText = document.getElementById('smithing-level-text');
        if (lvlText) lvlText.textContent = lvlInfo.name;

        const recipes = Object.values(SMITHING_RECIPES).filter(r => state.player.knownSmithingRecipes.includes(r.id));

        if (recipes.length === 0) {
            view.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được bản vẽ nào...</div>';
            return;
        }

        recipes.forEach(recipe => {
            const item = getItemById(recipe.id);
            if (!item) return;
            const qClass = this.getQualityClass(item.quality);
            const el = document.createElement('div');
            el.className = 'p-4 border border-gray-800 rounded-2xl bg-white/5 space-y-3';

            let materialsHTML = '';
            recipe.materials.forEach(mat => {
                const matItem = getItemById(mat.id);
                const count = state.player.inventory.allItems.find(i => i.id === mat.id)?.quantity || 0;
                const enough = count >= mat.quantity;
                materialsHTML += `<div class="text-[10px] ${enough ? 'text-gray-400' : 'text-red-500'}">${matItem?.name || mat.id}: ${count}/${mat.quantity}</div>`;
            });

            const locked = state.player.smithingLevel < recipe.level;

            el.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <span class="text-xl mr-2">${item.image ? `<img src="${getAssetUrl(item.image)}" class="w-6 h-6 object-contain inline-block">` : (item.icon || '')}</span>
                        <span class="font-bold quality-${qClass} font-ancient">${item.name}</span>
                    </div>
                    ${locked ?
                    `<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${recipe.level}</span>` :
                    `<button class="px-4 py-2 btn-gold text-[10px] font-bold rounded-lg whitespace-nowrap" onclick="window.game.forge('${recipe.id}')">${recipe.type === 'bag_upgrade' ? 'NÂNG CẤP' : 'RÈN ĐÚC'}</button>`
                }
                </div>
                <div class="grid grid-cols-2 gap-1">${materialsHTML}</div>
                <div class="text-[9px] text-gray-500 italic">Thể lực: ${recipe.staminaCost} | Linh lực: ${recipe.manaCost}</div>
            `;
            view.appendChild(el);
        });
    }

    openCrafting(type) {
        if (!state.player) return;

        // Bách nghệ block
        const isUnlocked = state.player.unlockedProfessions.includes(type);
        if (!isUnlocked) {
            state.ui.toast("Ngươi chưa nắm vững bí pháp của nghề này!", "error");
            return;
        }

        const screens = {
            alchemy: 'screen-alchemy',
            smithing: 'screen-smithing',
            talisman: 'screen-talisman',
            formation: 'screen-formation',
            beast: 'screen-beast',
            puppet: 'screen-puppet',
            corpse: 'screen-corpse'
        };

        const screenId = screens[type];
        if (screenId) {
            state.ui.switchScreen(screenId);
            if (type === 'alchemy') this.renderAlchemy();
            if (type === 'smithing') this.renderSmithing();
            if (type === 'talisman') this.renderTalisman();
            if (type === 'formation') this.renderFormation();
            if (type === 'beast') this.renderBeast();
            if (type === 'puppet') this.renderPuppet();
            if (type === 'corpse') this.renderCorpse();
        }
    }

    openCraftingHub() {
        const craftingScreens = ['screen-alchemy', 'screen-talisman', 'screen-smithing', 'screen-formation', 'screen-corpse', 'screen-beast', 'screen-puppet'];
        craftingScreens.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.add('hidden');
                el.classList.remove('flex');
            }
        });

        const hub = document.getElementById('screen-crafting-hub');
        if (hub) {
            hub.classList.remove('hidden');
            hub.classList.add('flex');
        }
    }

    renderPuppet() {
        if (!state.player) return;

        const elLvl = document.getElementById('puppet-level-text');
        const elBar = document.getElementById('puppet-exp-bar');
        const view = document.getElementById('puppet-list');

        if (elLvl) elLvl.textContent = `Khôi Lỗi Sư - Cấp ${state.player.puppetLevel}`;
        if (elBar) {
            const nextLevelExp = state.player.puppetLevel * 100 * Math.pow(1.5, state.player.puppetLevel - 1);
            elBar.style.width = `${(state.player.puppetExp / nextLevelExp) * 100}%`;
        }

        if (view) {
            view.innerHTML = '';
            const known = PUPPET_RECIPES.filter(r => state.player.knownPuppetRecipes.includes(r.id));

            if (known.length === 0) {
                view.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa có bản thiết kế khôi lỗi nào...</div>';
                return;
            }

            known.forEach(recipe => {
                const el = document.createElement('div');
                el.className = 'p-5 border border-white/5 rounded-3xl bg-white/[0.02] space-y-4 group hover:border-qi-blue/30 transition-all';

                let materialsHTML = '';
                recipe.materials.forEach(mat => {
                    const matItem = getItemById(mat.id);
                    const count = state.player.inventory.allItems.find(i => i.id === mat.id)?.quantity || 0;
                    const enough = count >= mat.quantity;
                    materialsHTML += `
                        <div class="flex justify-between items-center bg-black/20 p-2 rounded-xl border ${enough ? 'border-white/5' : 'border-red-500/20'}">
                            <span class="text-[10px] text-gray-400">${matItem?.name || mat.id}</span>
                            <span class="text-[10px] font-mono ${enough ? 'text-qi-jade' : 'text-red-500'}">${count}/${mat.quantity}</span>
                        </div>
                    `;
                });

                const locked = state.player.puppetLevel < recipe.skillLevel;

                el.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/10 group-hover:scale-110 transition-transform">🤖</div>
                            <div>
                                <h4 class="font-ancient text-white text-lg">${recipe.name}</h4>
                                <div class="flex space-x-2 mt-1">
                                    <span class="text-[8px] px-2 py-0.5 bg-qi-blue/10 text-qi-blue rounded-full border border-qi-blue/20 uppercase font-bold">${PUPPET_GRADES[recipe.grade].name}</span>
                                    <span class="text-[8px] px-2 py-0.5 bg-white/5 text-gray-500 rounded-full border border-white/10 uppercase font-bold">${recipe.type}</span>
                                </div>
                            </div>
                        </div>
                        ${locked ?
                        `<div class="text-[9px] text-red-500 font-bold uppercase py-2">Cần Cấp ${recipe.skillLevel}</div>` :
                        `<button class="px-5 py-2.5 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue text-[10px] font-bold rounded-xl border border-qi-blue/20 active:scale-95 transition-all" onclick="window.game.craftPuppet('${recipe.id}')">LUYỆN CHẾ</button>`
                    }
                    </div>
                    <p class="text-[10px] text-gray-500 italic leading-relaxed">${recipe.description}</p>
                    <div class="grid grid-cols-2 gap-2">${materialsHTML}</div>
                `;
                view.appendChild(el);
            });
        }
    }

    renderTalisman() {
        if (!state.player) return;
        const lvlInfo = getTalismanLevelInfo(state.player.talismanLevel);
        const elLvl = document.getElementById('talisman-level-text');
        const elBar = document.getElementById('talisman-exp-bar');
        const view = document.getElementById('talisman-recipes');

        if (elLvl) elLvl.textContent = lvlInfo.name;
        if (elBar) {
            const nextLevelExp = state.player.talismanLevel * 100 * Math.pow(1.5, state.player.talismanLevel - 1);
            elBar.style.width = `${(state.player.talismanExp / nextLevelExp) * 100}%`;
        }

        // Update Pen Name
        const penName = document.getElementById('current-pen-name');
        if (penName) {
            const pen = state.player.currentTalismanPen ? getItemById(state.player.currentTalismanPen) : null;
            if (pen) {
                penName.innerHTML = `<span class="text-white">${pen.name}</span>`;
            } else {
                penName.innerHTML = `<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phu_luc')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`;
            }
        }

        if (view) {
            view.innerHTML = '';
            const known = Object.values(TALISMAN_RECIPES).filter(r => state.player.knownTalismanRecipes.includes(r.id));

            if (known.length === 0) {
                view.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được phù văn nào...</div>';
                return;
            }

            known.forEach(recipe => {
                const el = document.createElement('div');
                el.className = 'p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3';

                let materialsHTML = '';
                recipe.materials.forEach(mat => {
                    const matItem = getItemById(mat.id);
                    const count = state.player.inventory.allItems.find(i => i.id === mat.id)?.quantity || 0;
                    materialsHTML += `<div class="text-[9px] ${count >= mat.quantity ? 'text-gray-400' : 'text-red-500'}">${matItem.name} x${mat.quantity} (${count})</div>`;
                });

                const locked = state.player.talismanLevel < recipe.level;

                el.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-bold text-qi-blue">${recipe.name}</h4>
                        ${locked ?
                        `<span class="text-[8px] text-red-500 uppercase">Cần Cấp ${recipe.level}</span>` :
                        `<button class="px-3 py-1 bg-qi-blue/10 text-qi-blue text-[10px] rounded border border-qi-blue/20" onclick="window.game.drawTalisman('${recipe.id}')">VẼ PHÙ</button>`
                    }
                    </div>
                    <div class="grid grid-cols-2 gap-1 mb-2">${materialsHTML}</div>
                    <div class="text-[8px] text-gray-500 italic">Mana: ${recipe.manaCost} | Stamina: ${recipe.staminaCost}</div>
                `;
                view.appendChild(el);
            });
        }
    }

    renderBeast() {
        if (!state.player) return;
        const viewList = document.getElementById('beast-list-view');
        const viewHatch = document.getElementById('beast-hatch-view');
        const tabBeast = document.getElementById('beast-tab-beast');
        const tabInsect = document.getElementById('beast-tab-insect');
        const tabHatch = document.getElementById('beast-tab-hatch');

        if (!state.views.beast) state.views.beast = 'beast';

        // Update Views Visibility
        if (state.views.beast === 'hatch') {
            if (viewList) viewList.classList.add('hidden');
            if (viewHatch) viewHatch.classList.remove('hidden');
        } else {
            if (viewList) viewList.classList.remove('hidden');
            if (viewHatch) viewHatch.classList.add('hidden');
        }

        // Update Tab Styles
        const activeClass = ['bg-qi-jade/10', 'text-qi-jade', 'border-qi-jade/20'];
        const inactiveClass = ['bg-transparent', 'text-gray-500', 'border-transparent'];

        [tabBeast, tabInsect, tabHatch].forEach(tab => {
            if (tab) {
                tab.classList.remove(...activeClass, ...inactiveClass);
                const isActive = (tab === tabBeast && state.views.beast === 'beast') ||
                    (tab === tabInsect && state.views.beast === 'insect') ||
                    (tab === tabHatch && state.views.beast === 'hatch');
                tab.classList.add(...(isActive ? activeClass : inactiveClass));
            }
        });

        // Update Level/Exp Display
        const elLvl = document.getElementById('beast-level-text');
        const elExp = document.getElementById('beast-exp-bar');

        const curLevel = state.views.beast === 'insect' ? state.player.insectLevel : state.player.beastLevel;
        const curExp = state.views.beast === 'insect' ? state.player.insectExp : state.player.beastExp;

        if (elLvl) elLvl.textContent = `Cấp ${curLevel}`;
        if (elExp) {
            const nextLevelExp = curLevel * 100 * Math.pow(1.5, curLevel - 1);
            elExp.style.width = `${(curExp / nextLevelExp) * 100}%`;
        }

        // List View Rendering
        if (viewList && state.views.beast !== 'hatch') {
            viewList.innerHTML = '';

            // Filter beasts based on tab
            const filteredBeasts = state.player.beasts.filter(beast => {
                const data = BEASTS[beast.id];
                if (!data) return false;
                if (state.views.beast === 'beast') {
                    return [BEAST_TYPES.LINH_THU, BEAST_TYPES.DI_THU, BEAST_TYPES.THAN_THU].includes(data.type);
                } else if (state.views.beast === 'insect') {
                    return [BEAST_TYPES.LINH_TRUNG, BEAST_TYPES.KY_TRUNG].includes(data.type);
                }
                return true;
            });

            if (filteredBeasts.length === 0) {
                const typeName = state.views.beast === 'beast' ? 'linh thú' : 'kỳ trùng';
                viewList.innerHTML = `<div class="text-center py-10 text-gray-600 italic">Ngươi chưa có ${typeName} nào...</div>`;
            } else {
                filteredBeasts.forEach(beast => {
                    const data = BEASTS[beast.id];
                    const lvlInfo = getBeastLevelInfo(beast.level);
                    const blood = BLOODLINES[beast.bloodline];

                    const el = document.createElement('div');
                    el.className = 'p-4 border border-white/5 rounded-2xl bg-white/[0.02] flex items-center space-x-4';
                    el.innerHTML = `
                        <div class="text-4xl">${data?.icon || '🐾'}</div>
                        <div class="flex-grow">
                            <div class="flex justify-between items-center">
                                <h4 class="font-bold text-white">${beast.name}</h4>
                                <span class="text-[9px] font-bold" style="color: ${blood.color}">${blood.name}</span>
                            </div>
                            <div class="text-[9px] text-gray-500 mt-0.5">Cấp ${beast.level} (${lvlInfo.name})</div>
                            <div class="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                                <div class="h-full bg-qi-jade" style="width: ${(beast.exp / lvlInfo.expRequired) * 100}%"></div>
                            </div>
                        </div>
                    `;
                    viewList.appendChild(el);
                });
            }
        }

        // Hatch View
        if (viewHatch && state.views.beast === 'hatch') {
            viewHatch.innerHTML = '';
            const eggs = state.player.inventory.items.filter(i => getItemById(i.id).type === 'beast_egg');
            if (eggs.length === 0) {
                viewHatch.innerHTML = '<div class="text-center py-10 text-gray-600 italic">Ngươi không có trứng linh thú nào...</div>';
            } else {
                eggs.forEach(egg => {
                    const item = getItemById(egg.id);
                    const el = document.createElement('div');
                    el.className = 'p-4 border border-white/5 rounded-2xl bg-white/[0.02] flex justify-between items-center';
                    el.innerHTML = `
                        <div class="flex items-center space-x-3">
                            <div class="text-2xl">${item.icon}</div>
                            <div>
                                <h4 class="text-sm font-bold text-white">${item.name}</h4>
                                <p class="text-[9px] text-gray-500">Số lượng: ${egg.quantity}</p>
                            </div>
                        </div>
                        <button class="px-4 py-2 bg-qi-jade/10 text-qi-jade text-[10px] rounded-xl border border-qi-jade/20" onclick="window.game.hatchBeast('${egg.id}')">ẤP NỞ</button>
                    `;
                    viewHatch.appendChild(el);
                });
            }
        }

        // Events
        if (tabBeast) tabBeast.onclick = () => { state.views.beast = 'beast'; this.renderBeast(); };
        if (tabInsect) tabInsect.onclick = () => { state.views.beast = 'insect'; this.renderBeast(); };
        if (tabHatch) tabHatch.onclick = () => { state.views.beast = 'hatch'; this.renderBeast(); };
    }

    renderCraftingHub() {
        if (!state.player) return;

        const professions = [
            { id: 'alchemy', key: 'alchemy', name: 'Luyện Dược Sư', level: state.player.alchemyLevel, exp: state.player.alchemyExp, getLevelInfo: getAlchemyLevelInfo },
            { id: 'talisman', key: 'talisman', name: 'Phù Sư', level: state.player.talismanLevel, exp: state.player.talismanExp, getLevelInfo: getTalismanLevelInfo },
            { id: 'smithing', key: 'smithing', name: 'Luyện Khí Sư', level: state.player.smithingLevel, exp: state.player.smithingExp, getLevelInfo: getSmithingLevelInfo },
            { id: 'formation', key: 'formation', name: 'Trận Pháp Sư', level: state.player.formationLevel, exp: state.player.formationExp, getLevelInfo: (lvl) => ({ name: `Cấp ${lvl}` }) },
            { id: 'puppet', key: 'puppet', name: 'Khôi Lỗi Sư', level: state.player.puppetLevel, exp: state.player.puppetExp, getLevelInfo: (lvl) => ({ name: `Cấp ${lvl}` }) },
            { id: 'corpse', key: 'corpse', name: 'Luyện Thi Sư', level: state.player.corpseLevel, exp: state.player.corpseExp, getLevelInfo: (lvl) => ({ name: `Cấp ${lvl}` }) },
            { id: 'beast', key: 'beast', name: 'Ngự Thú Sư', level: state.player.beastLevel, exp: state.player.beastExp, getLevelInfo: getBeastLevelInfo },
            { id: 'insect', key: 'insect', name: 'Khu Trùng Sư', level: state.player.insectLevel, exp: state.player.insectExp, getLevelInfo: (lvl) => ({ name: `Cấp ${lvl}` }) }
        ];

        professions.forEach(prof => {
            const levelEl = document.getElementById(`hub-${prof.id}-level`);
            const cardEl = levelEl?.closest('.hub-card');

            if (!levelEl || !cardEl) return;

            const isUnlocked = state.player.unlockedProfessions.includes(prof.id);

            // Re-bind onclick to handle both locked state and opening
            cardEl.onclick = () => window.game.openCrafting(prof.id);

            const biPhapMap = {
                'alchemy': 'Đan Đạo Chân Giải',
                'talisman': 'Thái Thượng Phù Kinh',
                'smithing': 'Luyện Khí Tổng Cương',
                'formation': 'Trận Đạo Thiên Thư',
                'puppet': 'Cơ Quan Linh Kỹ',
                'corpse': 'Cửu U Luyện Thi Thuật',
                'beast': 'Vạn Thú Ngự Pháp',
                'insect': 'Thiên Trùng Bí Lục'
            };

            if (isUnlocked) {
                const lvlInfo = prof.getLevelInfo ? prof.getLevelInfo(prof.level) : { name: `Cấp ${prof.level}` };
                const nextLevelExp = prof.level * 100 * Math.pow(1.5, prof.level - 1);
                const progress = Math.floor((prof.exp / nextLevelExp) * 100);

                levelEl.innerHTML = `${prof.name} - ${lvlInfo.name} <span class="text-white/30 ml-2">(${progress}%)</span>`;
                cardEl.classList.remove('opacity-40', 'grayscale');
                cardEl.classList.add('cursor-pointer');
            } else {
                levelEl.innerHTML = `
                    <div class="flex flex-col">
                        <span class="text-red-500/60 flex items-center"><i class="ph ph-lock-key mr-1"></i> Chưa mở khóa</span>
                        <span class="text-[7px] text-gray-600 italic mt-0.5">Cần: « ${biPhapMap[prof.id]} »</span>
                    </div>
                `;
                cardEl.classList.add('opacity-40', 'grayscale');
                cardEl.classList.remove('cursor-pointer');
            }
        });
    }

    renderFormation() {
        if (!state.player) return;
        const view = document.getElementById('formation-list');
        if (!view) return;

        view.innerHTML = '';

        // Active Formations
        if (state.player.activeFormations.length > 0) {
            const activeHeader = document.createElement('h3');
            activeHeader.className = 'text-[10px] text-gray-500 uppercase tracking-widest mb-2';
            activeHeader.textContent = 'Trận Pháp Đang Hoạt Động';
            view.appendChild(activeHeader);

            state.player.activeFormations.forEach(af => {
                const el = document.createElement('div');
                el.className = 'p-4 border border-qi-purple/30 rounded-2xl bg-qi-purple/5 mb-4 flex justify-between items-center';
                el.innerHTML = `
                    <div>
                        <h4 class="font-bold text-qi-purple">${af.name}</h4>
                        <p class="text-[9px] text-gray-500 mt-1">Đang kích hoạt...</p>
                    </div>
                    <button class="px-4 py-2 bg-red-500/10 text-red-500 text-[10px] rounded-xl border border-red-500/20" onclick="window.game.deactivateFormation('${af.id}')">THU HỒI</button>
                `;
                view.appendChild(el);
            });
        }

        // Learned Diagrams
        const knownFormations = state.player.knownFormations || [];
        const diagramHeader = document.createElement('h3');
        diagramHeader.className = 'text-[10px] text-gray-500 uppercase tracking-widest mt-6 mb-2';
        diagramHeader.textContent = 'Trận Đồ Đã Lĩnh Ngộ';
        view.appendChild(diagramHeader);

        if (knownFormations.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'text-center py-6 text-gray-700 italic text-xs';
            empty.textContent = 'Trống rỗng...';
            view.appendChild(empty);
        } else {
            knownFormations.forEach(fid => {
                const item = getItemById(fid);
                if (!item) return;
                const isActive = state.player.activeFormations.some(af => af.id === fid);
                const el = document.createElement('div');
                el.className = 'p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3 flex justify-between items-center';
                el.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">${item.icon || '📜'}</div>
                        <div>
                            <h4 class="text-sm font-bold text-white">${item.name}</h4>
                            <p class="text-[9px] text-gray-500">${item.description || ''}</p>
                        </div>
                    </div>
                    ${isActive ?
                        '<span class="text-[9px] text-qi-purple font-bold">ĐÃ KÍCH HOẠT</span>' :
                        `<button class="px-4 py-2 bg-qi-purple/10 text-qi-purple text-[10px] rounded-xl border border-qi-purple/20" onclick="window.game.activateFormation('${fid}')">KÍCH HOẠT</button>`
                    }
                `;
                view.appendChild(el);
            });
        }
    }

    renderCorpse() {
        if (!state.player) return;

        const view = document.getElementById('corpse-list');
        const elLvl = document.getElementById('corpse-level-text');
        const elBar = document.getElementById('corpse-exp-bar');

        if (elLvl) elLvl.textContent = getCorpseLevelInfo(state.player.corpseLevel).name;
        if (elBar) {
            const nextLevelExp = state.player.corpseLevel * 100 * Math.pow(1.5, state.player.corpseLevel - 1);
            elBar.style.width = `${(state.player.corpseExp / nextLevelExp) * 100}%`;
        }

        if (!view) return;
        view.innerHTML = '';

        // Refined Corpses list (Active)
        if (state.player.refinedCorpses.length > 0) {
            const activeHeader = document.createElement('h3');
            activeHeader.className = 'text-[10px] text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-1';
            activeHeader.textContent = 'Thi Hài Đang Khống Chế';
            view.appendChild(activeHeader);

            state.player.refinedCorpses.forEach((corpse, idx) => {
                const el = document.createElement('div');
                el.className = 'p-4 border border-red-900/30 rounded-2xl bg-red-900/5 mb-4 flex items-center space-x-4';
                el.innerHTML = `
                    <div class="text-4xl opacity-80">🧟</div>
                    <div class="flex-grow">
                        <div class="flex justify-between items-center">
                            <h4 class="font-bold text-red-400">${corpse.name}</h4>
                            <span class="text-[9px] px-2 py-0.5 bg-red-500/10 text-red-500 rounded border border-red-500/20 font-bold uppercase">${corpse.quality}</span>
                        </div>
                        <div class="text-[9px] text-gray-500 mt-1">Cấp ${corpse.level} | ATK: ${corpse.stats.atk} | HP: ${corpse.stats.hp}</div>
                    </div>
                `;
                view.appendChild(el);
            });
        }

        const refiningHeader = document.createElement('h3');
        refiningHeader.className = 'text-[10px] text-gray-500 uppercase tracking-widest mt-6 mb-3 border-b border-white/5 pb-1';
        refiningHeader.textContent = 'Bản Vẽ Luyện Thi';
        view.appendChild(refiningHeader);

        const known = Object.values(CORPSE_TYPES).filter(t => state.player.knownCorpseRecipes.includes(t.id));

        if (known.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'text-center py-6 text-gray-700 italic text-xs';
            empty.textContent = 'Ngươi chưa có bí phương luyện thi nào...';
            view.appendChild(empty);
        } else {
            known.forEach(type => {
                const el = document.createElement('div');
                el.className = 'p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3 space-y-3';

                let materialsHTML = '';
                type.materials.forEach(mat => {
                    const matItem = getItemById(mat.id);
                    const count = state.player.inventory.allItems.find(i => i.id === mat.id)?.quantity || 0;
                    materialsHTML += `<div class="text-[9px] ${count >= mat.quantity ? 'text-gray-400' : 'text-red-500'}">${matItem?.name || mat.id} x${mat.quantity} (${count})</div>`;
                });

                const locked = state.player.corpseLevel < type.level;
                const successRate = Math.floor((0.7 - (type.level * 0.1) + (state.player.corpseLevel * 0.05)) * 100);

                el.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-ancient text-lg text-red-500">${type.name}</h4>
                        <p class="text-[9px] text-gray-500 mt-1">${type.description}</p>
                    </div>
                    ${locked ?
                        `<span class="text-[8px] text-red-500 uppercase font-bold">Cần Cấp ${type.level}</span>` :
                        `<button class="px-4 py-2 bg-red-900/20 text-red-400 text-[10px] font-bold rounded-xl border border-red-900/30" onclick="window.game.refineCorpse('${type.id}')">LUYỆN CHẾ</button>`
                    }
                </div>
                <div class="grid grid-cols-2 gap-2">${materialsHTML}</div>
                <div class="flex justify-between items-center text-[8px] text-gray-500 italic">
                    <span>Tỷ lệ thành công: ${successRate}%</span>
                    <span>Phản phệ: ${(100 - successRate)}%</span>
                </div>
            `;
                view.appendChild(el);
            });
        }
    }

    renderTechniques(tab = 'cultivation') {
        if (!state.player) return;

        state.activeTechTab = tab;

        // Update tab styles
        if (this.btnTechTabCultivation && this.btnTechTabSecret) {
            if (tab === 'cultivation') {
                this.btnTechTabCultivation.className = 'flex-grow py-2 bg-qi-blue/20 text-qi-blue border border-qi-blue/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
                this.btnTechTabSecret.className = 'flex-grow py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            } else {
                this.btnTechTabCultivation.className = 'flex-grow py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
                this.btnTechTabSecret.className = 'flex-grow py-2 bg-qi-purple/20 text-qi-purple border border-qi-purple/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            }
        }

        if (this.elTechListView) {
            this.elTechListView.innerHTML = '';
            this.elTechListView.classList.remove('hidden');
            if (this.elTechDetailView) this.elTechDetailView.classList.add('hidden');

            const list = tab === 'cultivation' ? state.player.learnedTechniques : state.player.learnedSecretTechniques;

            if (list.length === 0) {
                this.elTechListView.innerHTML = `<div class="text-center py-20 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ ${tab === 'cultivation' ? 'công pháp' : 'bí pháp'} nào...</div>`;
            } else {
                list.forEach(entry => {
                    const data = tab === 'cultivation' ? getTechniqueById(entry.id) : getSecretTechniqueById(entry.id);
                    if (!data) return;

                    const mastery = MASTERY_LEVELS.find(m => m.id === (entry.masteryLevel || 1));
                    const stageLabel = data.stageLabel || 'Tầng';
                    const stageName = (data.stageNames && data.stageNames[entry.stage - 1]) ? data.stageNames[entry.stage - 1] : `${stageLabel} ${entry.stage || 1}`;

                    const el = document.createElement('div');
                    el.className = `p-4 border ${tab === 'cultivation' ? 'border-qi-blue/10 bg-qi-blue/5' : 'border-qi-purple/10 bg-qi-purple/5'} rounded-2xl flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all mb-3`;
                    el.innerHTML = `
                        <div class="flex items-center space-x-4">
                            <div class="text-2xl">${data.icon || (tab === 'cultivation' ? '📜' : '✨')}</div>
                            <div>
                                <h4 class="text-sm font-bold text-white">${data.name}</h4>
                                <div class="flex items-center space-x-2 mt-1">
                                    <span class="text-[8px] px-1.5 py-0.5 bg-black/40 rounded border border-white/5 text-gray-400 font-mono">${stageName}</span>
                                    <span class="text-[8px] text-cultivation-gold font-bold">${mastery?.name || 'Nhập Môn'}</span>
                                </div>
                            </div>
                        </div>
                        <i class="ph ph-caret-right text-gray-600"></i>
                    `;
                    el.onclick = () => this.renderTechniqueDetail(entry.id, tab === 'secret');
                    this.elTechListView.appendChild(el);
                });
            }
        }

        if (this.elTechPoints) this.elTechPoints.textContent = state.player.techniquePoints || 0;
    }

    renderTechniqueDetail(id, isSecret) {
        if (!this.elTechDetailContent) return;

        const entry = isSecret ? state.player.learnedSecretTechniques.find(s => s.id === id) : state.player.learnedTechniques.find(t => t.id === id);
        const data = isSecret ? getSecretTechniqueById(id) : getTechniqueById(id);
        if (!entry || !data) return;

        this.elTechListView.classList.add('hidden');
        this.elTechDetailView.classList.remove('hidden');

        const currentMasteryIdx = MASTERY_LEVELS.findIndex(m => m.id === (entry.masteryLevel || 1));
        const mastery = MASTERY_LEVELS[currentMasteryIdx];
        const nextMastery = MASTERY_LEVELS[currentMasteryIdx + 1];

        const stageLabel = data.stageLabel || 'Tầng';
        const stageName = (data.stageNames && data.stageNames[entry.stage - 1]) ? data.stageNames[entry.stage - 1] : `${stageLabel} ${entry.stage || 1}`;

        const canBreakthrough = entry.masteryLevel >= 4 && (entry.stage < (data.maxStage || 10));

        this.elTechDetailContent.innerHTML = `
            <div class="flex flex-col items-center text-center space-y-4">
                <div class="text-6xl p-6 bg-white/5 rounded-full border border-white/10">${data.icon || '📜'}</div>
                <div>
                    <h3 class="text-2xl font-ancient text-white">${data.name}</h3>
                    <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">${data.quality || 'Phàm Khí'}${((data.quality || 'Phàm Khí').toLowerCase().includes('khí') || (data.quality || 'Phàm Khí').toLowerCase().includes('bảo') || (data.quality || 'Phàm Khí').toLowerCase().includes('phẩm') || (data.quality || 'Phàm Khí').toLowerCase().includes('giai') || (data.quality || 'Phàm Khí').toLowerCase().includes('hỏa') || (data.quality || 'Phàm Khí').toLowerCase().includes('lôi') || ['Hoàn Mỹ', 'Tiên Khí', 'Linh Bảo', 'Danh Khí'].includes(data.quality || 'Phàm Khí')) ? '' : ' Phẩm'} | ${stageName}</p>
                </div>
            </div>

            <div class="bg-black/40 p-5 rounded-3xl border border-white/5 space-y-4">
                <div class="flex justify-between items-end mb-1">
                    <span class="text-[9px] text-gray-500 uppercase tracking-widest">Độ Thuần Thục: ${mastery?.name || 'Nhập Môn'}</span>
                    <span class="text-[10px] font-mono text-white">${entry.mastery} / ${nextMastery?.threshold || 'MAX'}</span>
                </div>
                <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-cultivation-gold" style="width: ${entry.masteryLevel >= 4 ? 100 : (entry.mastery / (nextMastery?.threshold || 1)) * 100}%"></div>
                </div>
                
                <div class="grid grid-cols-2 gap-3 mt-6">
                    <button class="py-4 bg-qi-blue text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" onclick="window.game.cultivateTechnique('${id}', ${isSecret})">TU LUYỆN</button>
                    <button class="py-4 ${canBreakthrough ? 'bg-cultivation-gold' : 'bg-gray-800 opacity-50'} text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" 
                        onclick="window.game.breakthroughTechnique('${id}', ${isSecret})">ĐỘT PHÁ TẦNG</button>
                </div>
            </div>

            <div class="space-y-4">
                <h4 class="text-xs font-ancient text-gray-500 uppercase tracking-widest border-l-2 border-gray-500 pl-3">Mô tả & Hiệu ứng</h4>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs text-gray-400 leading-relaxed">
                    ${data.description || 'Không có mô tả.'}
                </div>
            </div>
        `;
    }
}
