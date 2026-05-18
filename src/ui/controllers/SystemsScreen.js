import { state } from '../../state.js';
import { getLocationById } from '../../configs/map-data.js';
import { getItemById } from '../../configs/item-data.js';
import { EnemyGenerator } from '../../core/enemy.js';
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
        this.shopSearchQuery = '';
        this.shopSortMode = 'default';
        this.activeSectZone = null;
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
        this.elShopSearchInput = document.getElementById('shop-search-input');
        this.elShopSortSelect = document.getElementById('shop-sort-select');

        // Other lists
        this.elGuildCerts = document.getElementById('guild-cert-list');

        // Technique Screen
        this.elTechListView = document.getElementById('tech-list-view');
        this.elTechDetailView = document.getElementById('tech-detail-view');
        this.elTechDetailContent = document.getElementById('tech-detail-content');
        this.elTechPoints = document.getElementById('tech-points');
        this.btnTechTabCultivation = document.getElementById('tech-tab-cultivation');
        this.btnTechTabSecret = document.getElementById('tech-tab-secret');
        this.btnTechTabCustom = document.getElementById('tech-tab-custom');
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

        if (this.elShopSearchInput) {
            this.elShopSearchInput.oninput = (e) => {
                this.shopSearchQuery = e.target.value.toLowerCase().trim();
                this.renderShop();
            };
        }

        if (this.elShopSortSelect) {
            this.elShopSortSelect.onchange = (e) => {
                this.shopSortMode = e.target.value;
                this.renderShop();
            };
        }
        // Technique Tabs
        if (this.btnTechTabCultivation) this.btnTechTabCultivation.onclick = () => this.renderTechniques('cultivation');
        if (this.btnTechTabSecret) this.btnTechTabSecret.onclick = () => this.renderTechniques('secret');
        if (this.btnTechTabCustom) this.btnTechTabCustom.onclick = () => this.renderTechniques('custom');
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
        const nextLevelExp = Math.max(1, state.player.alchemyLevel * 100 * Math.pow(1.5, state.player.alchemyLevel - 1));
        this.elAlchemyExpBar.style.width = `${Math.min(100, (state.player.alchemyExp / nextLevelExp) * 100)}%`;

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
                const playerMat = state.player.inventory.allItems.find(i => i.id === mat.id);
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
        
        const categories = [
            { id: 'dan_duoc', name: 'Đan Dược', icon: '💊' },
            { id: 'phap_bao', name: 'Trang Bị', icon: '⚔️' },
            { id: 'cong_phap', name: 'Bí Tịch', icon: '📜' },
            { id: 'bach_nghe', name: 'Bách Nghệ', icon: '⚒️' },
            { id: 'ky_vat', name: 'Kỳ Vật', icon: '💎' }
        ];

        const currentButtons = this.elShopSectionNav.querySelectorAll('button');

        // If buttons count doesn't match, rebuild
        if (currentButtons.length !== categories.length) {
            this.elShopSectionNav.innerHTML = '';
            this.elShopSectionNav.dataset.shopId = shop.currentShopId;

            categories.forEach(cat => {
                const el = document.createElement('button');
                el.dataset.category = cat.id;
                el.onclick = () => {
                    if (state.systems.shop) {
                        state.systems.shop.currentSection = cat.id;
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
        } else if (section === 'bach_nghe') {
            subFilters = [
                { id: 'all', name: '--- Lọc Loại Bách Nghệ ---' },
                { id: 'nguyen_lieu', name: 'Nguyên Liệu' },
                { id: 'phu_luc', name: 'Phù Lục' },
                { id: 'tran_phap', name: 'Trận Pháp' },
                { id: 'luyen_khi', name: 'Luyện Khí' },
                { id: 'linh_dien', name: 'Linh Điền' }
            ];
        } else if (section === 'ky_vat') {
            subFilters = [
                { id: 'all', name: '--- Lọc Loại Kỳ Vật ---' },
                { id: 'tui_tru_vat', name: 'Túi Trữ Vật' },
                { id: 'ky_trung', name: 'Kỳ Trùng' },
                { id: 'linh_thu', name: 'Linh Thú' }
            ];
        }

        // Search bar makes filters wrap always visible
        this.elShopFiltersWrap?.classList.remove('hidden');

        if (subFilters.length === 0) {
            this.elShopSubFilterNav.innerHTML = '';
            this.elShopSubFilterNav.classList.add('hidden');
            return;
        }

        this.elShopSubFilterNav.classList.remove('hidden');
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
        
        // Show quality filter for almost everything except curated lists or simple mats
        const showQuality = ['phap_bao', 'dan_duoc', 'cong_phap', 'bach_nghe'].includes(section);

        if (!showQuality) {
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

        this.elShopBuyView.innerHTML = '';

        // Apply Search Filter
        if (this.shopSearchQuery) {
            inv = inv.filter(item => {
                const itemData = getItemById(item.id);
                return itemData && itemData.name.toLowerCase().includes(this.shopSearchQuery);
            });
        }

        // Apply Sub-filter
        if (this.shopSubFilter !== 'all') {
            inv = inv.filter(item => {
                const itemData = getItemById(item.id);
                if (!itemData) return false;

                if (shop.currentSection === 'phap_bao') {
                    return itemData.type === this.shopSubFilter;
                } else if (shop.currentSection === 'cong_phap') {
                    const isManualAction = itemData.action && (itemData.action.startsWith('open_') || itemData.action.includes('linh_the_luc') || itemData.effect?.type === 'unlock_profession');
                    const isBook = (itemData.type === 'book' || itemData.type === 'technique') && !isManualAction;
                    const isRecipe = itemData.type === 'recipe' || itemData.type === 'talisman_recipe' || isManualAction;

                    if (this.shopSubFilter === 'cultivation') return isBook;
                    if (this.shopSubFilter === 'manual') return isRecipe;
                } else if (['bach_nghe', 'ky_vat'].includes(shop.currentSection)) {
                    // For grouped categories, sub-filter is the original section key
                    const shopData = SHOPS[shop.currentShopId];
                    const sectionItems = shopData.sections[this.shopSubFilter] || [];
                    return sectionItems.some(i => i.id === item.id);
                }
                return true;
            });
        }

        // Apply Quality Filter
        if (this.shopQualityFilter !== 'all') {
            inv = inv.filter(item => {
                const itemData = getItemById(item.id);
                return itemData && itemData.quality === this.shopQualityFilter;
            });
        }

        // Apply Sorting
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

        let items = [...state.player.inventory.allItems];

        // Apply Search Filter
        if (this.shopSearchQuery) {
            items = items.filter(item => {
                const itemData = getItemById(item.id);
                return itemData && itemData.name.toLowerCase().includes(this.shopSearchQuery);
            });
        }

        // Apply Category/Section Filter
        items = items.filter(item => {
            const itemData = getItemById(item.id);
            if (!itemData) return false;

            // Simple mapping for filtering
            const typeMap = {
                'dan_duoc': ['consumable'],
                'phap_bao': ['weapon', 'armor', 'accessory', 'treasure', 'head', 'necklace', 'shoes', 'attackArtifact', 'defenseArtifact', 'flightArtifact', 'spaceArtifact', 'formationArtifact', 'supportArtifact', 'soulArtifact'],
                'nguyen_lieu': ['material', 'herb', 'ore', 'wood'],
                'cong_phap': ['book', 'technique', 'recipe', 'talisman_recipe', 'consumable'], // Merged types
                'tran_phap': ['formation'],
                'phu_luc': ['talisman'],
                'luyen_khi': ['material', 'smithing_tool'],
                'tui_tru_vat': ['consumable'],
                'ky_trung': ['consumable'], // Usually eggs are consumable or special
                'linh_thu': ['supportArtifact']
            };

            // Mapping Category to its internal sections
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
                const isManualAction = itemData.action && (itemData.action.startsWith('open_') || itemData.action.includes('linh_the_luc'));
                const isBook = (itemData.type === 'book' || itemData.type === 'technique') && !isManualAction;
                const isRecipe = itemData.type === 'recipe' || itemData.type === 'talisman_recipe' || (itemData.type === 'consumable' && itemData.effect?.type === 'unlock_profession') || isManualAction;

                if (subFilter === 'cultivation' && !isBook) return false;
                if (subFilter === 'manual' && isBook) return false;
                if (subFilter === 'manual' && !isRecipe && !isBook) return false; // Fallback
                if (subFilter === 'all' && !isBook && !isRecipe) return false;
            }

            // Sub-filter for Bách Nghệ / Kỳ Vật (matches original section)
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

        // Apply Sorting
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
            
            // Check if player is viewing a detailed zone
            if (this.activeSectZone) {
                this.renderSectZoneDetail(sect, this.activeSectZone);
                return;
            }

            // Otherwise, render the main beautiful Sect dashboard and its 10 Zones!
            const zones = [
                { id: 'son_mon', name: 'Sơn Môn', icon: '⛩️', desc: 'Hộ tông đại trận, đệ tử canh phòng.' },
                { id: 'quang_truong', name: 'Quảng Trường Tông Môn', icon: '🏟️', desc: 'Nhiệm vụ, luận đạo học hỏi.' },
                { id: 'dai_dien', name: 'Đại Điện / Chủ Điện', icon: '🏛️', desc: 'Bái kiến Tông chủ & hội nghị trưởng lão.' },
                { id: 'tang_kinh_cac', name: 'Tàng Kinh Các', icon: '📚', desc: 'Nhiơi học công pháp & bí tịch truyền thừa.' },
                { id: 'luyen_dan', name: 'Luyện Đan Phòng', icon: '🧪', desc: 'Địa hỏa linh thất đan dược (+10% thành công).' },
                { id: 'luyen_khi', name: 'Luyện Khí Các', icon: '⚒️', desc: 'Đúc đập thần binh pháp bảo.' },
                { id: 'linh_thu', name: 'Linh Thú Viên', icon: '🦁', desc: 'Thuần thú ngự trùng dưỡng kỳ lân.' },
                { id: 'duoc_vien', name: 'Dược Viên / Linh Điền', icon: '🌿', desc: 'Tiên dược quý hiếm trồng trọt.' },
                { id: 'dong_phu', name: 'Động Phủ Đệ Tử', icon: '🛕', desc: 'Động phủ tu luyện cá nhân tĩnh cơ.' },
                { id: 'bi_canh', name: 'Bí Cảnh Thí Luyện', icon: '🗼', desc: 'Thí Luyện Tháp, vượt ải ảo ảnh.' }
            ];

            elSects.innerHTML = `
                <div class="bg-white/5 rounded-2xl border border-qi-blue/30 overflow-hidden mb-4 animate-fade-in">
                    <div class="h-32 relative">
                        <img src="${sect.portrait || ASSETS.backgrounds.sect}" class="w-full h-full object-cover opacity-40">
                        <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                        <div class="absolute bottom-4 left-4">
                            <h3 class="text-2xl font-ancient text-white">${sect.name}</h3>
                            <p class="text-[10px] text-qi-blue uppercase font-bold tracking-widest">${state.player.realmId >= 30 ? 'Trưởng lão tông môn' : state.player.realmId >= 15 ? 'Đệ tử Nội môn' : 'Đệ tử Ngoại môn'}</p>
                        </div>
                    </div>
                    <div class="p-4 flex justify-between items-center text-xs">
                        <span class="text-gray-400">Điểm cống hiến:</span>
                        <span class="text-cultivation-gold font-mono font-bold text-sm">${state.player.sectContribution || 0}</span>
                    </div>
                </div>

                <h4 class="text-xs font-ancient text-gray-300 uppercase tracking-widest border-b border-white/10 pb-2 mb-3">Khu Vực Tông Môn</h4>
                
                <div class="grid grid-cols-2 gap-3 pb-8">
                    ${zones.map(z => `
                        <div class="p-3 bg-black/40 hover:bg-black/60 rounded-xl border border-white/5 hover:border-qi-blue/30 cursor-pointer flex flex-col justify-between space-y-2 transition-all animate-fade-in" 
                             onclick="window.game.screens.systems.activeSectZone = '${z.id}'; window.game.screens.systems.renderSects();">
                            <div class="flex items-center space-x-2">
                                <span class="text-2xl">${z.icon}</span>
                                <div class="font-bold text-xs text-white">${z.name}</div>
                            </div>
                            <div class="text-[9px] text-gray-400 leading-tight">${z.desc}</div>
                            <div class="text-[8px] text-qi-blue font-bold flex items-center justify-end uppercase tracking-wider">
                                Đi tới <i class="ph ph-caret-right ml-0.5"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            const currentLocId = state.currentLocId;
            const currentSect = SECTS[currentLocId];
            
            if (currentSect) {
                const canJoin = state.player.realmId >= currentSect.minRealm;
                
                // Check recruitment month & year: even year, months 1-2
                const timeSys = state.systems.time;
                const isEvenYear = timeSys ? (timeSys.getYear() % 2 === 0) : true;
                const isRecruitMonth = timeSys ? (timeSys.getMonth() === 1 || timeSys.getMonth() === 2) : true;
                const isRecruiting = isEvenYear && isRecruitMonth;
                
                const el = document.createElement('div');
                el.className = `p-4 border rounded-xl bg-black/40 space-y-3 ${canJoin ? 'border-gray-800' : 'opacity-50 grayscale'}`;
                
                let btnHTML = '';
                if (isRecruiting) {
                    btnHTML = `
                        <button class="w-full py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-xl flex items-center justify-center ${canJoin ? '' : 'hidden'}" onclick="window.game.startRecruitmentExam('${currentSect.id}')">
                            <i class="ph ph-identification-badge mr-2"></i>THAM GIA KHẢO HẠCH
                        </button>
                    `;
                } else {
                    btnHTML = `
                        <div class="p-3 bg-white/5 border border-white/10 rounded-xl text-center space-y-1">
                            <span class="text-gray-400 text-[10px] font-bold uppercase tracking-wider">CHIÊU MỘ CHƯA MỞ</span>
                            <span class="text-[9px] text-gray-500">Mở lại: Tháng 1-2 năm chẵn</span>
                            <button disabled class="w-full mt-2 py-2 bg-gray-500/10 border border-gray-500/20 text-gray-500 text-[9px] font-bold rounded-lg uppercase tracking-wider flex items-center justify-center space-x-1">
                                <i class="ph ph-clock"></i><span>KHÔNG PHẢI MÙA TUYỂN</span>
                            </button>
                        </div>
                    `;
                }

                el.innerHTML = `
                    <div class="flex justify-between items-center">
                        <h3 class="text-xl font-ancient text-white">${currentSect.name}</h3>
                        <span class="text-[10px] ${canJoin ? 'text-qi-blue' : 'text-red-500'}">${canJoin ? 'Có thể bái nhập' : 'Cần: ' + getRealmById(currentSect.minRealm).name}</span>
                    </div>
                    <p class="text-xs text-gray-500">${currentSect.description}</p>
                    ${btnHTML}
                `;
                elSects.appendChild(el);
            } else {
                elSects.innerHTML = `
                    <div class="flex flex-col items-center justify-center text-center p-8 bg-black/40 border border-white/5 rounded-2xl space-y-4 animate-fade-in">
                        <i class="ph ph-castle-turret text-4xl text-gray-600 animate-pulse"></i>
                        <div>
                            <h3 class="text-base font-ancient text-white mb-1">Vô Môn Vô Phái</h3>
                            <p class="text-xs text-gray-500 max-w-[280px]">Ngươi chưa gia nhập bất kỳ tông môn nào. Hãy di chuyển đến một sơn môn trên Bản Đồ Lịch Luyện để tham gia khảo hạch bái nhập.</p>
                        </div>
                        <button onclick="state.ui.switchScreen('screen-adventure'); state.ui.toggleOverlay(document.getElementById('sects-overlay'), false);" class="px-6 py-2 bg-qi-blue/20 hover:bg-qi-blue/30 border border-qi-blue/30 text-qi-blue text-xs font-bold rounded-xl transition-all">
                            DI CHUYỂN ĐẾN BẢN ĐỒ
                        </button>
                    </div>
                `;
            }
        }
    }

    renderSectZoneDetail(sect, zoneId) {
        const elSects = document.getElementById('sects-view');
        if (!elSects) return;

        let contentHTML = '';
        
        switch (zoneId) {
            case 'son_mon':
                contentHTML = `
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🛡️ Hộ Sơn Đại Trận</div>
                            <p class="text-[10px] text-gray-400 mb-3">Trận pháp bảo vệ cổng sơn môn hùng vĩ. Khi linh khí đầy đủ, đệ tử ngoại môn cùng ngự quân bất khả xâm phạm.</p>
                            <div class="flex justify-between text-xs mb-2">
                                <span class="text-gray-500">Trạng thái đại trận:</span>
                                <span class="text-green-400 font-bold">Hoạt động ổn định (100%)</span>
                            </div>
                            <button class="w-full py-2 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('son_mon', 'reinforce_array')">
                                <i class="ph ph-lightning mr-1"></i> Truyền Linh Khí Gia Cố (-50 Linh Lực)
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">📜 Bia Đá Tông Quy</div>
                            <p class="text-[10px] text-gray-400 mb-3">Nơi ghi khắc 10 điều luật sắt của tông môn. Đọc và khắc ghi quy tắc củng cố tinh thần tu sĩ đạo tâm.</p>
                            <button class="w-full py-2 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('son_mon', 'vow_rules')">
                                <i class="ph ph-scroll mr-1"></i> Tuyên Thệ Tuân Thủ Tông Quy (Hàng Ngày)
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">💂 Sentinel Guard</div>
                            <p class="text-[10px] text-gray-400 mb-3">Thủ môn đệ tử chăm chỉ tuần tra an ninh tông môn.</p>
                            <button class="w-full py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('son_mon', 'talk_guard')">
                                <i class="ph ph-chat-centered-text mr-1"></i> Trò Chuyện Tuần Tra
                            </button>
                        </div>
                    </div>
                `;
                break;

            case 'quang_truong':
                contentHTML = `
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">💬 Luận Đạo Hội</div>
                            <p class="text-[10px] text-gray-400 mb-3">Tham gia đối chất linh thức luận đạo cùng đồng môn, so kè ngộ tính để đốn ngộ chân pháp.</p>
                            <button class="w-full py-2 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('quang_truong', 'debate_dao')">
                                <i class="ph ph-brain mr-1"></i> Bắt Đầu Luận Đạo (-20 Linh Lực)
                            </button>
                        </div>

                        <!-- SECT MISSIONS (INLINE MISSION BOARD) -->
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">📋 Bảng Ủy Thác Nhiệm Vụ</div>
                            <p class="text-[10px] text-gray-400 mb-3">Nhận và thực hiện các nhiệm vụ tông môn phân phó để tích lũy uy tín và điểm cống hiến.</p>
                            <div class="space-y-3 mt-2">
                                ${sect.missions.map(m => `
                                    <div class="p-3 bg-black/40 rounded-lg border border-white/5 flex justify-between items-center">
                                        <div>
                                            <div class="text-xs font-bold text-white">${m.name}</div>
                                            <div class="text-[8px] text-gray-500">${m.desc}</div>
                                        </div>
                                        <button class="px-3 py-1 bg-qi-purple/10 text-qi-purple text-[9px] font-bold rounded border border-qi-purple/20 flex items-center" onclick="window.game.doMission('${m.id}')">
                                            <i class="ph ph-scroll mr-0.5"></i>LÀM
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
                break;

            case 'dai_dien':
                contentHTML = `
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🙇 Thỉnh An Tông Chủ</div>
                            <p class="text-[10px] text-gray-400 mb-3">Cúi chào kính cẩn Tông Chủ tối cao, dâng cống hiến lòng trung thành nhận ân huệ hàng ngày.</p>
                            <button class="w-full py-2 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('dai_dien', 'bow_master')">
                                <i class="ph ph-crown mr-1"></i> Cúi chào Tông Chủ (Hàng Ngày)
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🧘 Giảng Kinh Phục Pháp</div>
                            <p class="text-[10px] text-gray-400 mb-3">Nghe giảng pháp giải đáp từ Truyền công Trưởng lão. Chi phí: 100 Linh Thạch dâng trà.</p>
                            <button class="w-full py-2 bg-qi-purple/10 hover:bg-qi-purple/20 text-qi-purple border border-qi-purple/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('dai_dien', 'listen_lecture')">
                                <i class="ph ph-student mr-1"></i> Bái nghe Thuyết Pháp (-100 Linh Thạch)
                            </button>
                        </div>
                    </div>
                `;
                break;

            case 'tang_kinh_cac':
                {
                    const passiveItemId = `item_${sect.id}_t`;
                    const activeItemId = `item_${sect.id}_s`;
                    const passiveItem = getItemById(passiveItemId);
                    const activeItem = getItemById(activeItemId);
                    
                    const hasPassive = passiveItem && state.player.learnedTechniques.some(t => t.id === passiveItem.techniqueId);
                    const hasActive = activeItem && state.player.learnedSecretTechniques.some(s => s.id === activeItem.secretId);
                    
                    let scripturesHTML = '';
                    if (passiveItem) {
                        const passiveBtn = hasPassive 
                            ? `<span class="text-[8px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">ĐÃ LĨNH HỘI</span>`
                            : `<button class="px-2 py-1 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold text-[9px] font-bold rounded border border-cultivation-gold/30 flex items-center transition-all" onclick="window.game.buySectScroll('${passiveItemId}', 200)">
                                <i class="ph ph-shopping-cart-simple mr-0.5"></i>200 Cống Hiến
                               </button>`;
                        scripturesHTML += `
                            <div class="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between items-center space-x-2">
                                <div class="flex-1">
                                    <div class="text-[11px] font-bold text-white flex items-center"><span class="text-sm mr-1">${passiveItem.icon}</span>${passiveItem.name}</div>
                                    <div class="text-[9px] text-gray-400 mt-0.5">${passiveItem.description}</div>
                                </div>
                                <div class="flex-shrink-0 text-right">
                                    ${passiveBtn}
                                </div>
                            </div>
                        `;
                    }
                    if (activeItem) {
                        const activeBtn = hasActive 
                            ? `<span class="text-[8px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">ĐÃ LĨNH HỘI</span>`
                            : `<button class="px-2 py-1 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue text-[9px] font-bold rounded border border-qi-blue/30 flex items-center transition-all" onclick="window.game.buySectScroll('${activeItemId}', 400)">
                                <i class="ph ph-shopping-cart-simple mr-0.5"></i>400 Cống Hiến
                               </button>`;
                        scripturesHTML += `
                            <div class="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between items-center space-x-2">
                                <div class="flex-1">
                                    <div class="text-[11px] font-bold text-white flex items-center"><span class="text-sm mr-1">${activeItem.icon}</span>${activeItem.name}</div>
                                    <div class="text-[9px] text-gray-400 mt-0.5">${activeItem.description}</div>
                                </div>
                                <div class="flex-shrink-0 text-right">
                                    ${activeBtn}
                                </div>
                            </div>
                        `;
                    }

                    contentHTML = `
                        <div class="space-y-4">
                            <p class="text-[10px] text-gray-400">Các công pháp và bí thuật thượng thừa của tông môn hoàn toàn bảo mật tuyệt đối, đệ tử tích cực lập công đức đổi cống hiến linh tinh trao học.</p>
                            <div class="grid grid-cols-1 gap-3">
                                ${scripturesHTML}
                            </div>
                        </div>
                    `;
                }
                break;

            case 'luyen_dan':
                contentHTML = `
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🔥 Địa Hỏa Thất (Đan Điện)</div>
                            <p class="text-[10px] text-gray-400 mb-3">Mượn đan lò hỏa mạch cực thịnh của tông môn, nâng cao tỷ lệ thành công chế luyện dược phẩm lên +10%!</p>
                            <button class="w-full py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="state.ui.toggleOverlay(document.getElementById('sects-overlay'), false); window.game.screens.systems.openCrafting('alchemy');">
                                <i class="ph ph-flame mr-1"></i> Vào Lò Luyện Đan (+10% Thành Công)
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🌿 Hiến Tặng Linh Thảo Dược</div>
                            <p class="text-[10px] text-gray-400 mb-3">Quyên góp 5 cọng Linh Thảo cấp thấp của bản thân đóng góp làm dược thô cho đan điện.</p>
                            <div class="flex justify-between text-[10px] text-gray-500 mb-2">
                                <span>Linh Thảo hiện có:</span>
                                <span class="font-bold text-white">${state.player.inventory.getItemQuantity('item_linh_thao')} / 5</span>
                            </div>
                            <button class="w-full py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('luyen_dan', 'donate_herbs')">
                                <i class="ph ph-hand-heart mr-1"></i> Quyên Hiến 5 Linh Thảo
                            </button>
                        </div>
                    </div>
                `;
                break;

            case 'luyen_khi':
                contentHTML = `
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">⚒️ Thiết Khí Các</div>
                            <p class="text-[10px] text-gray-400 mb-3">Nơi luyện pháp bảo khôi lỗi, cường hóa trang bị thần binh.</p>
                            <button class="w-full py-2 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="state.ui.toggleOverlay(document.getElementById('sects-overlay'), false); window.game.screens.systems.openCrafting('smithing');">
                                <i class="ph ph-hammer mr-1"></i> Bắt Đầu Chế Tạo Pháp Bảo
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">💎 Đóng Góp Linh Quặng</div>
                            <p class="text-[10px] text-gray-400 mb-3">Hiến hiếu linh thạch vụn nâng trợ kinh phí luyện đúc cơ khí cho các đệ tử rèn kiếm.</p>
                            <button class="w-full py-2 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('luyen_khi', 'donate_scrap')">
                                <i class="ph ph-coins mr-1"></i> Quyên Góp 200 Linh Thạch
                            </button>
                        </div>
                    </div>
                `;
                break;

            case 'linh_thu':
                contentHTML = `
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🦁 Vui Đùa Linh Thú</div>
                            <p class="text-[10px] text-gray-400 mb-3">Thân cận vui vẻ chải lông chăm nuôi cùng linh thú ngự thú vườn.</p>
                            <button class="w-full py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('linh_thu', 'play_beasts')">
                                <i class="ph ph-paw-print mr-1"></i> Tương Tác Linh Thú (-20 Linh Lực)
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🕸️ Bẫy Linh Trùng Hoang Dã</div>
                            <p class="text-[10px] text-gray-400 mb-3">Sử dụng thần thức sương bẫy săn tìm linh trùng hoang dã nấp ở linh viên. Có cơ hội bắt được Phệ Kim Trùng quý hiếm!</p>
                            <button class="w-full py-2 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('linh_thu', 'catch_insect')">
                                <i class="ph ph-bug mr-1"></i> Bẫy Kỳ Trùng (-30 Linh Lực)
                            </button>
                        </div>
                    </div>
                `;
                break;

            case 'duoc_vien':
                contentHTML = `
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🌿 Linh Điền Tông Môn</div>
                            <p class="text-[10px] text-gray-400 mb-3">Vào linh điền của tông môn phì nhiêu tụ tinh khí trồng trọt linh thảo tiên dược.</p>
                            <button class="w-full py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="state.ui.toggleOverlay(document.getElementById('sects-overlay'), false); window.game.screens.systems.openCrafting('alchemy');">
                                <i class="ph ph-plant mr-1"></i> Mở Linh Thảo Viên Trồng Trọt
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">💧 Chăm Sóc Tưới Linh Thảo</div>
                            <p class="text-[10px] text-gray-400 mb-3">Được phó thác tưới nước sương bổ linh căn cho các tiên mầm, thưởng hạt giống linh chi.</p>
                            <button class="w-full py-2 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('duoc_vien', 'water_garden')">
                                <i class="ph ph-drop mr-1"></i> Tưới Tắm Linh Thảo (-30 Linh Lực)
                            </button>
                        </div>
                    </div>
                `;
                break;

            case 'dong_phu':
                contentHTML = `
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🌀 Vận Công Đại Chu Thiên</div>
                            <p class="text-[10px] text-gray-400 mb-3">Động phủ tu luyện cá nhân linh khí dồi dào, xếp bằng chu thiên điều hòa chân khí chuyển hóa thọ tinh thành tu vi.</p>
                            <button class="w-full py-2 bg-qi-purple/10 hover:bg-qi-purple/20 text-qi-purple border border-qi-purple/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('dong_phu', 'circulate_qi')">
                                <i class="ph ph-infinity mr-1"></i> Vận Công Khai Huyệt (-100 Linh Lực)
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">💎 Thiết Lập Tụ Linh Trận</div>
                            <p class="text-[10px] text-gray-400 mb-3">Đầu tư linh thạch gia cố cường hóa pháp trận tụ nồng độ linh khí, mở mang ngộ đạo căn bản.</p>
                            <button class="w-full py-2 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('dong_phu', 'upgrade_array')">
                                <i class="ph ph-diamonds mr-1"></i> Gia Cố Pháp Trận (-500 Linh Thạch)
                            </button>
                        </div>
                    </div>
                `;
                break;

            case 'bi_canh':
                contentHTML = `
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">⚔️ Thí Luyện Ảo Ảnh</div>
                            <p class="text-[10px] text-gray-400 mb-3">Ảo ảnh ma đạo pháp trận do tổ sư thiết lập để mài giũa bản lĩnh chiến đấu cho đệ tử. Đánh thắng nhận Contribution tích lũy.</p>
                            <button class="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-xl transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('bi_canh', 'trial_fight')">
                                <i class="ph ph-sword mr-1"></i> Khiêu Chiến Ảo Ảnh Đệ Tử
                            </button>
                        </div>
                    </div>
                `;
                break;
        }

        const zone = [
            { id: 'son_mon', name: 'Sơn Môn', icon: '⛩️' },
            { id: 'quang_truong', name: 'Quảng Trường', icon: '🏟️' },
            { id: 'dai_dien', name: 'Đại Điện', icon: '🏛️' },
            { id: 'tang_kinh_cac', name: 'Tàng Kinh Các', icon: '📚' },
            { id: 'luyen_dan', name: 'Luyện Đan Phòng', icon: '🧪' },
            { id: 'luyen_khi', name: 'Luyện Khí Các', icon: '⚒️' },
            { id: 'linh_thu', name: 'Linh Thú Viên', icon: '🦁' },
            { id: 'duoc_vien', name: 'Dược Viên / Linh Điền', icon: '🌿' },
            { id: 'dong_phu', name: 'Động Phủ Đệ Tử', icon: '🛕' },
            { id: 'bi_canh', name: 'Bí Cảnh Thí Luyện', icon: '🗼' }
        ].find(z => z.id === zoneId);

        elSects.innerHTML = `
            <button class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center text-xs font-bold transition-all mb-4" 
                    onclick="window.game.screens.systems.activeSectZone = null; window.game.screens.systems.renderSects();">
                <i class="ph ph-arrow-left mr-1"></i> Quay Lại Tông Môn
            </button>

            <div class="bg-white/5 rounded-2xl border border-qi-blue/30 overflow-hidden mb-4 animate-fade-in">
                <div class="h-24 relative">
                    <img src="${sect.portrait || ASSETS.backgrounds.sect}" class="w-full h-full object-cover opacity-30">
                    <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div class="absolute bottom-3 left-4 flex items-center space-x-2">
                        <span class="text-3xl">${zone.icon}</span>
                        <div>
                            <h3 class="text-lg font-ancient text-white">${zone.name}</h3>
                            <p class="text-[8px] text-qi-blue uppercase tracking-widest">${sect.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pb-12 custom-scroll overflow-y-auto animate-fade-in">
                ${contentHTML}
            </div>
        `;
    }

    handleSectZoneAction(zoneId, actionId) {
        const currentDay = state.systems.time ? state.systems.time.totalDays : 0;
        
        switch (actionId) {
            case 'vow_rules':
                if (state.player.lastSectVowDay === currentDay) {
                    state.ui.toast("Hôm nay ngươi đã tuyên thệ rồi, không nên quá thường xuyên bái bản tông!", "warning");
                    return;
                }
                state.player.lastSectVowDay = currentDay;
                state.player.tuVi = (state.player.tuVi || 0) + 15;
                state.ui.toast("Ngươi chắp tay tuyên thệ tuân thủ Tông quy nghiêm nghị. Đạo tâm tu sĩ chấn chỉnh vững chắc! (+15 Tu vi)", "success");
                break;
                
            case 'reinforce_array':
                if (state.player.mana < 50) {
                    state.ui.toast("Linh lực bất túc, không đủ 50 Linh Lực truyền pháp gia cố trận pháp!", "error");
                    return;
                }
                state.player.mana -= 50;
                state.player.sectContribution = (state.player.sectContribution || 0) + 5;
                state.ui.toast("Ngươi dẫn tinh linh khí gia cố kết giới mạch trận thành công! Tông môn thưởng +5 Cống hiến!", "success");
                break;

            case 'talk_guard':
                {
                    const msgs = [
                        "Thủ môn đệ tử: Tu luyện không thèm chểnh mảng, kiên trì nhất định thành tựu thiên kiếp sơ kỳ!",
                        "Thủ môn đệ tử: Ngoại sơn môn phong quang vô cùng, có yêu điểu rình rập, đi đứng xin nhớ mang theo phi kiếm.",
                        "Thủ môn đệ tử: Cổ truyền tông đại trận vô cùng chắc chắn, tà ma ngoại đạo bất khả xâm phạm!"
                    ];
                    state.ui.toast(msgs[Math.floor(Math.random() * msgs.length)], "info");
                }
                break;

            case 'debate_dao':
                if (state.player.mana < 20) {
                    state.ui.toast("Linh lực cạn kiệt, tinh thần mệt mỏi!", "error");
                    return;
                }
                state.player.mana -= 20;
                {
                    const comp = state.player.advancedStats?.comprehension || 10;
                    const roll = Math.random() * 40;
                    if (comp >= roll) {
                        state.player.tuVi = (state.player.tuVi || 0) + 30;
                        state.player.sectContribution = (state.player.sectContribution || 0) + 8;
                        state.ui.toast("Biện luận xuất chúng! Lời nói chứa linh cơ đốn ngộ! Nhận +30 Tu vi, +8 Cống hiến!", "success");
                    } else {
                        state.player.tuVi = (state.player.tuVi || 0) + 10;
                        state.ui.toast("Tranh luận đạo tâm rơi vào thế bí, tuy nhiên vẫn thu hoạch được chút ngộ đạo. Nhận +10 Tu vi!", "info");
                    }
                }
                break;

            case 'bow_master':
                if (state.player.lastSectBowDay === currentDay) {
                    state.ui.toast("Hôm nay sư phụ bế quan bận rộn hội họp, ngày mai hãy tới thỉnh an!", "warning");
                    return;
                }
                state.player.lastSectBowDay = currentDay;
                state.player.sectContribution = (state.player.sectContribution || 0) + 15;
                state.ui.toast("Ngươi khấu đầu cung kính thỉnh an Tông Chủ tối cao. Nhận thưởng +15 Điểm Cống hiến!", "success");
                break;

            case 'listen_lecture':
                if (state.player.lastSectLectureDay === currentDay) {
                    state.ui.toast("Trưởng lão hôm nay đã truyền pháp xong rồi, hãy quay lại vào ngày mai!", "warning");
                    return;
                }
                if (state.player.gold < 100) {
                    state.ui.toast("Ngươi không đủ 100 Linh Thạch dâng kính trà lễ!", "error");
                    return;
                }
                state.player.gold -= 100;
                state.player.lastSectLectureDay = currentDay;
                state.player.tuVi = (state.player.tuVi || 0) + 150;
                state.ui.toast("Bái nghe Trưởng lão giảng giải đạo lý ngưng cốt. Thần khí sảng khoái đốn ngộ vô cùng! Nhận +150 Tu vi!", "success");
                break;

            case 'donate_herbs':
                {
                    const count = state.player.inventory.getItemQuantity('item_linh_thao');
                    if (count < 5) {
                        state.ui.toast("Ngươi bất túc 5 cọng Linh Thảo để đóng góp!", "error");
                        return;
                    }
                    state.player.inventory.removeItem('item_linh_thao', 5);
                    state.player.sectContribution = (state.player.sectContribution || 0) + 20;
                    state.ui.toast("Hiến quyên thành công 5 Linh Thảo cấp thấp làm linh dược thô. Nhận +20 Cống hiến!", "success");
                }
                break;

            case 'donate_scrap':
                if (state.player.gold < 200) {
                    state.ui.toast("Không đủ 200 Linh Thạch đóng góp khoáng vật chế khí!", "error");
                    return;
                }
                state.player.gold -= 200;
                state.player.sectContribution = (state.player.sectContribution || 0) + 10;
                state.ui.toast("Đóng góp 200 Linh Thạch chế tạo linh tài. Thủ Các Trưởng lão ghi nhận: +10 Cống hiến!", "success");
                break;

            case 'play_beasts':
                if (state.player.mana < 20) {
                    state.ui.toast("Linh lực mệt mỏi bất khả!", "error");
                    return;
                }
                state.player.mana -= 20;
                state.ui.toast("Ngươi ân cần tiếp xúc cho linh thú ăn linh thảo trong vườn. Linh thú tâm tình vui vẻ vô cùng!", "success");
                break;

            case 'catch_insect':
                if (state.player.lastSectCatchDay === currentDay) {
                    state.ui.toast("Hôm nay ngươi đã bắt sâu ở ngự thú viên rồi, hãy đợi ngày mai linh trùng bò ra!", "warning");
                    return;
                }
                if (state.player.mana < 30) {
                    state.ui.toast("Linh lực cạn kiệt không đủ ngự khí giăng lưới!", "error");
                    return;
                }
                state.player.mana -= 30;
                state.player.lastSectCatchDay = currentDay;
                if (Math.random() < 0.25) {
                    state.player.inventory.addItem('item_phe_kim_trung', 1);
                    state.ui.toast("💥 Thành công bắt được 1 con Phệ Kim Trùng hoang dã bò trên linh thạch!", "success");
                } else {
                    state.ui.toast("Hụt mất! Linh trùng bò rất nhanh đã lẩn trốn vào kẽ đá cấm địa.", "info");
                }
                break;

            case 'water_garden':
                if (state.player.lastSectWaterDay === currentDay) {
                    state.ui.toast("Linh điền đã nhận đủ linh lộ tưới tiêu hôm nay rồi!", "warning");
                    return;
                }
                if (state.player.mana < 30) {
                    state.ui.toast("Linh lực cạn kiệt bất khả xách sương dẫn thủy!", "error");
                    return;
                }
                state.player.mana -= 30;
                state.player.lastSectWaterDay = currentDay;
                {
                    const seeds = ['linh_chi_seed', 'nhan_sam_seed', 'tuyet_lien_seed'];
                    const chosen = seeds[Math.floor(Math.random() * seeds.length)];
                    state.player.inventory.addItem(chosen, 1);
                    state.player.sectContribution = (state.player.sectContribution || 0) + 15;
                    state.ui.toast("Tưới sương bắt sâu thảo điền chu đáo! Nhận +15 Cống hiến và 1 Hạt giống linh thảo ngẫu nhiên!", "success");
                }
                break;

            case 'circulate_qi':
                if (state.player.lastSectQiDay === currentDay) {
                    state.ui.toast("Kinh mạch chấn động bão hòa linh lực, bế quan tu luyện thêm sẽ đứt vỡ!", "warning");
                    return;
                }
                if (state.player.mana < 100) {
                    state.ui.toast("Linh khí bất túc đại chu thiên tuần hoàn (Cần 100 Linh Lực)!", "error");
                    return;
                }
                state.player.mana -= 100;
                state.player.lastSectQiDay = currentDay;
                {
                    const gain = Math.floor(state.player.atk * 15 + state.player.level * 50);
                    state.player.tuVi = (state.player.tuVi || 0) + gain;
                    state.ui.toast(`Xếp bằng đại chu thiên vận chuyển đạo pháp ngưng khí 36 vòng! Hấp thu vô vàn linh cơ: +${gain} Tu vi!`, "success");
                }
                break;

            case 'upgrade_array':
                if (state.player.gold < 500) {
                    state.ui.toast("Ngươi thiếu hụt 500 Linh Thạch cải tiến pháp trận động phủ!", "error");
                    return;
                }
                state.player.gold -= 500;
                state.player.tuVi = (state.player.tuVi || 0) + 300;
                state.ui.toast("Nâng cấp pháp trận tụ linh động phủ thành công! Nâng cao căn cơ tĩnh tâm hành thiền. Nhận +300 Tu vi!", "success");
                break;

            case 'trial_fight':
                if (state.player.hp < state.player.maxHp * 0.2) {
                    state.ui.toast("Trạng thái suy nhược cực độ khí huyết quá thấp bất khả thí luyện!", "error");
                    return;
                }
                {
                    const enemy = EnemyGenerator.generate(state.player.realmId);
                    enemy.name = `Ảo Ảnh Thí Luyện (${enemy.realmName})`;
                    enemy.inventory = []; // Clear scroll drops to avoid farming drops
                    
                    state.ui.toast("Kích hoạt Ảo Ảnh Pháp Trận, trận chiến mở màn!", "info");
                    
                    setTimeout(() => {
                        state.ui.toggleOverlay(document.getElementById('sects-overlay'), false);
                        
                        window.game.startBattle(enemy, null, (isWin) => {
                            if (isWin) {
                                state.player.sectContribution = (state.player.sectContribution || 0) + 50;
                                state.ui.toast("🏆 Thách đấu thành công ảo cảnh! Tông môn thưởng +50 Điểm Cống hiến!", "success");
                            } else {
                                state.ui.toast("Khiêu chiến thất bại! Cố gắng ngộ đạo thêm hãy quay lại.", "error");
                            }
                            
                            setTimeout(() => {
                                state.ui.toggleOverlay(document.getElementById('sects-overlay'), true);
                                window.game.screens.systems.renderSects();
                            }, 1200);
                        });
                    }, 800);
                }
                break;
        }

        window.game.saveState();
        window.game.refreshUI();
        this.renderSects();
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
            const nextLevelExp = Math.max(1, state.player.puppetLevel * 100 * Math.pow(1.5, state.player.puppetLevel - 1));
            elBar.style.width = `${Math.min(100, (state.player.puppetExp / nextLevelExp) * 100)}%`;
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

                const puppetImg = ASSETS.puppets[recipe.id];

                el.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 group-hover:scale-110 transition-transform">
                                ${puppetImg ? `<img src="${puppetImg}" class="w-full h-full object-cover">` : '🤖'}
                            </div>
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
            const nextLevelExp = Math.max(1, state.player.talismanLevel * 100 * Math.pow(1.5, state.player.talismanLevel - 1));
            elBar.style.width = `${Math.min(100, (state.player.talismanExp / nextLevelExp) * 100)}%`;
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
            const nextLevelExp = Math.max(1, curLevel * 100 * Math.pow(1.5, curLevel - 1));
            elExp.style.width = `${Math.min(100, (curExp / nextLevelExp) * 100)}%`;
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

                    const beastImg = ASSETS.beasts[beast.id];

                    const el = document.createElement('div');
                    el.className = 'p-4 border border-white/5 rounded-2xl bg-white/[0.02] flex items-center space-x-4';
                    el.innerHTML = `
                        <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0">
                            ${beastImg ? `<img src="${beastImg}" class="w-full h-full object-cover">` : `<span class="text-3xl">${data?.icon || '🐾'}</span>`}
                        </div>
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
            const eggs = state.player.inventory.allItems.filter(i => getItemById(i.id).type === 'beast_egg');
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
                const corpseImg = ASSETS.corpses[corpse.id];
                const el = document.createElement('div');
                el.className = 'p-4 border border-red-900/30 rounded-2xl bg-red-900/5 mb-4 flex items-center space-x-4';
                el.innerHTML = `
                    <div class="w-12 h-12 bg-red-950/20 rounded-2xl flex items-center justify-center overflow-hidden border border-red-900/20 flex-shrink-0">
                        ${corpseImg ? `<img src="${corpseImg}" class="w-full h-full object-cover">` : '<span class="text-3xl">🧟</span>'}
                    </div>
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
                const corpseImg = ASSETS.corpses[type.id];
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
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-red-950/20 rounded-2xl flex items-center justify-center overflow-hidden border border-red-900/20 flex-shrink-0 animate-pulse-subtle">
                            ${corpseImg ? `<img src="${corpseImg}" class="w-full h-full object-cover">` : '<span class="text-3xl">🧟</span>'}
                        </div>
                        <div>
                            <h4 class="font-ancient text-lg text-red-500">${type.name}</h4>
                            <p class="text-[9px] text-gray-500 mt-1">${type.description}</p>
                        </div>
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
        if (this.btnTechTabCultivation && this.btnTechTabSecret && this.btnTechTabCustom) {
            this.btnTechTabCultivation.className = 'flex-grow py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            this.btnTechTabSecret.className = 'flex-grow py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            this.btnTechTabCustom.className = 'flex-grow py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            
            if (tab === 'cultivation') {
                this.btnTechTabCultivation.className = 'flex-grow py-2 bg-qi-blue/20 text-qi-blue border border-qi-blue/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            } else if (tab === 'secret') {
                this.btnTechTabSecret.className = 'flex-grow py-2 bg-qi-purple/20 text-qi-purple border border-qi-purple/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            } else if (tab === 'custom') {
                this.btnTechTabCustom.className = 'flex-grow py-2 bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            }
        }

        if (this.elTechListView) {
            this.elTechListView.innerHTML = '';
            this.elTechListView.classList.remove('hidden');
            if (this.elTechDetailView) this.elTechDetailView.classList.add('hidden');

            if (tab === 'custom') {
                this.elTechListView.innerHTML = `
                    <div class="bg-black/40 p-5 rounded-3xl border border-white/5 space-y-6">
                        <div>
                            <h3 class="font-ancient text-cultivation-gold text-lg">Khai Tông Sáng Lập</h3>
                            <p class="text-[9px] text-gray-500 mt-1 uppercase tracking-widest">Tự Sáng Tạo Công Pháp Chí Cao</p>
                        </div>

                        <!-- Cost Alert -->
                        <div class="bg-white/[0.02] p-4 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                            <div class="space-y-1 w-full">
                                <div class="text-[9px] text-gray-500 uppercase tracking-wider mb-2">Tiêu hao sáng lập:</div>
                                <div class="flex justify-between items-center">
                                    <span class="font-mono ${state.player.tuVi >= 50000 ? 'text-qi-jade' : 'text-red-500'}">50,000 Tu Vi (${Math.floor(state.player.tuVi).toLocaleString()})</span>
                                    <span class="font-mono ${state.player.techniquePoints >= 100 ? 'text-qi-jade' : 'text-red-500'}">100 Điểm Công Pháp (${state.player.techniquePoints})</span>
                                </div>
                            </div>
                        </div>

                        <!-- Name Input -->
                        <div class="space-y-2">
                            <label class="text-[9px] text-gray-500 uppercase tracking-widest">Tên Công Pháp</label>
                            <input id="custom-tech-name" type="text" placeholder="Ví dụ: Cửu Thiên Đạo Quyết" 
                                class="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cultivation-gold transition-colors">
                        </div>

                        <!-- Element Select -->
                        <div class="space-y-2">
                            <label class="text-[9px] text-gray-500 uppercase tracking-widest">Thuộc Tính Ngũ Hành</label>
                            <select id="custom-tech-element" 
                                class="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cultivation-gold transition-colors">
                                <option value="Neutral">Hỗn Độn (Vô thuộc tính)</option>
                                <option value="Kim">Kim (Canh Kim Kiếm Khí)</option>
                                <option value="Mộc">Mộc (Trường Xuân Trường Sinh)</option>
                                <option value="Thủy">Thủy (Huyền Âm Chân Thủy)</option>
                                <option value="Hỏa">Hỏa (Tam Muội Chân Hỏa)</option>
                                <option value="Thổ">Thổ (Hậu Thổ Minh Vương)</option>
                                <option value="Phong">Phong (Cực Tốc Thần Phong)</option>
                                <option value="Lôi">Lôi (Ngũ Lôi Oanh Đỉnh)</option>
                                <option value="Băng">Băng (Cực Hàn Băng Sương)</option>
                                <option value="Âm">Âm (U Minh Ma Đạo)</option>
                                <option value="Dương">Dương (Thuần Dương Đạo Pháp)</option>
                            </select>
                        </div>

                        <!-- Stat Boost -->
                        <div class="space-y-2">
                            <label class="text-[9px] text-gray-500 uppercase tracking-widest">Thiên Hướng Cộng Thuộc Tính</label>
                            <select id="custom-tech-stat" 
                                class="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cultivation-gold transition-colors">
                                <option value="atk">Tăng Cường Công Kích (+180 Công Kích)</option>
                                <option value="hp">Hồi Linh Khí Huyết (+600 Sinh Mệnh)</option>
                                <option value="spd">Phi Thăng Tốc Độ (+15 Thân Pháp)</option>
                            </select>
                        </div>

                        <!-- Special Effect -->
                        <div class="space-y-2">
                            <label class="text-[9px] text-gray-500 uppercase tracking-widest">Hiệu Ứng Bẩm Sinh</label>
                            <select id="custom-tech-effect" 
                                class="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cultivation-gold transition-colors">
                                <option value="swordDmg">Kiếm Ý Thông Thiên (+15% Sát thương Kiếm)</option>
                                <option value="tvps">Linh Lực Tinh Thuần (+3.0 Tu Vi/s)</option>
                                <option value="lifeSteal">Huyết Ma Nghịch Thiên (+12% Hút Máu)</option>
                            </select>
                        </div>

                        <!-- Submit Button -->
                        <button id="custom-tech-submit"
                            class="w-full py-4 bg-cultivation-gold text-black text-xs font-bold rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all">
                            ⚡ KHAI TÔNG LẬP PHÁP
                        </button>
                    </div>
                `;

                // Wire Submit
                const btnSubmit = document.getElementById('custom-tech-submit');
                if (btnSubmit) {
                    btnSubmit.onclick = () => {
                        const name = document.getElementById('custom-tech-name').value;
                        const element = document.getElementById('custom-tech-element').value;
                        const statVal = document.getElementById('custom-tech-stat').value;
                        const effectVal = document.getElementById('custom-tech-effect').value;

                        if (!name || name.trim() === '') {
                            state.ui.toast("Tên công pháp không được để trống!", "error");
                            return;
                        }

                        // Map choice into stats/effects payload
                        const chosenStats = {};
                        if (statVal === 'atk') chosenStats.atk = 180;
                        else if (statVal === 'hp') chosenStats.hp = 600;
                        else if (statVal === 'spd') chosenStats.spd = 15;

                        const chosenEffects = {};
                        if (effectVal === 'swordDmg') chosenEffects.swordDmg = 1.15;
                        else if (effectVal === 'tvps') chosenEffects.tvps = 3.0;
                        else if (effectVal === 'lifeSteal') chosenEffects.lifeSteal = 0.12;

                        window.game.createCustomTechnique(name, element, chosenStats, chosenEffects);
                    };
                }
                
                if (this.elTechPoints) this.elTechPoints.textContent = state.player.techniquePoints || 0;
                return;
            }

            const isSecretTab = tab === 'secret';
            const compList = (state.player.comprehendingTechniques || []).filter(c => c.isSecret === isSecretTab);
            const list = isSecretTab ? state.player.learnedSecretTechniques : state.player.learnedTechniques;
            
            // 1. Render active/waiting comprehension progress bars
            if (compList.length > 0) {
                const header = document.createElement('div');
                header.className = 'mb-4 border-b border-white/5 pb-2 mt-2';
                header.innerHTML = `
                    <div class="flex justify-between items-center">
                        <h3 class="text-[10px] font-ancient text-cultivation-gold uppercase tracking-[0.2em] flex items-center">
                            <i class="ph ph-brain mr-1.5 animate-pulse text-xs"></i>
                            Đang Tham Ngộ Bí Tịch
                        </h3>
                        <span class="text-[8px] bg-cultivation-gold/10 text-cultivation-gold px-1.5 py-0.5 rounded border border-cultivation-gold/20 font-bold uppercase">${compList.length} Đang Đọc</span>
                    </div>
                `;
                this.elTechListView.appendChild(header);

                compList.forEach((current, idx) => {
                    const techData = current.isSecret 
                        ? getSecretTechniqueById(current.id) 
                        : (getTechniqueById(current.id) || (state.player.customTechniques || []).find(t => t.id === current.id));
                    
                    if (!techData) return;

                    const info = state.player.getTechniqueComprehensionInfo(current.id);
                    const timeRemaining = Math.max(0, current.durationLeft);
                    
                    let timeStr = '';
                    if (timeRemaining > 3600) {
                        const h = Math.floor(timeRemaining / 3600);
                        const m = Math.floor((timeRemaining % 3600) / 60);
                        timeStr = `${h}h ${m}m`;
                    } else if (timeRemaining > 60) {
                        const m = Math.floor(timeRemaining / 60);
                        const s = Math.floor(timeRemaining % 60);
                        timeStr = `${m}m ${s}s`;
                    } else {
                        timeStr = `${Math.ceil(timeRemaining)}s`;
                    }

                    const isActive = idx === 0;
                    const barColorClass = isSecretTab ? 'bg-qi-purple' : 'bg-qi-blue';
                    const activePill = isActive 
                        ? `<span class="text-[7px] px-1.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/25 rounded font-bold uppercase tracking-wider animate-pulse whitespace-nowrap">Đang Đọc</span>`
                        : `<span class="text-[7px] px-1.5 py-0.5 bg-gray-500/10 text-gray-400 border border-gray-500/25 rounded font-bold uppercase tracking-wider whitespace-nowrap">Đang Đợi</span>`;

                    let breakdownHtml = '';
                    if (isActive && current.speedBreakdown) {
                        const sb = current.speedBreakdown;
                        let physiqueRow = '';
                        if (sb.physique && sb.physique !== 1.0) {
                            physiqueRow = `
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">🦴</span> Thể Chất:</span>
                                    <span class="text-green-400 font-mono font-bold">${sb.physiqueText || 'Phù Hợp'} (${sb.physique.toFixed(2)}x)</span>
                                </div>
                            `;
                        }
                        let meridianRow = '';
                        if (sb.meridian && sb.meridian !== 1.0) {
                            meridianRow = `
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">🕸️</span> Kinh Mạch:</span>
                                    <span class="${sb.meridian < 1.0 ? 'text-red-400' : 'text-green-400'} font-mono font-bold">${sb.meridianText || 'Khơi Thông'} (${sb.meridian.toFixed(2)}x)</span>
                                </div>
                            `;
                        }
                        let bloodlineRow = '';
                        if (sb.bloodline && sb.bloodline !== 1.0) {
                            bloodlineRow = `
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">🩸</span> Huyết Mạch:</span>
                                    <span class="text-green-400 font-mono font-bold">${sb.bloodlineText || 'Huyết Trạch'} (${sb.bloodline.toFixed(2)}x)</span>
                                </div>
                            `;
                        }

                        breakdownHtml = `
                            <div class="mt-2 p-2 bg-black/20 border border-white/5 rounded-xl space-y-1 text-[8px] text-gray-400">
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">🧠</span> Ngộ Tính:</span>
                                    <span class="text-white font-mono font-bold">${sb.savvy.toFixed(2)}x</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">💧</span> Linh Căn:</span>
                                    <span class="${sb.root < 1.0 ? 'text-red-400' : 'text-green-400'} font-mono font-bold">${sb.rootText || 'Bình thường'} (${sb.root.toFixed(2)}x)</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="flex items-center"><span class="mr-1">👁️</span> Thần Thức:</span>
                                    <span class="text-white font-mono font-bold">${sb.soul.toFixed(2)}x</span>
                                </div>
                                ${physiqueRow}
                                ${meridianRow}
                                ${bloodlineRow}
                            </div>
                        `;
                    }

                    const el = document.createElement('div');
                    el.className = `p-4 border ${isActive ? 'border-cultivation-gold/30 bg-cultivation-gold/[0.02]' : 'border-white/5 bg-white/[0.01] opacity-70'} rounded-2xl mb-4 space-y-3 relative overflow-hidden`;
                    
                    if (isActive) {
                        el.classList.add('shadow-[0_0_15px_rgba(217,119,6,0.05)]');
                    }

                    el.innerHTML = `
                        <div class="flex justify-between items-start">
                            <div class="flex items-center space-x-3">
                                <div class="text-2xl">${techData.icon || (isSecretTab ? '✨' : '📜')}</div>
                                <div>
                                    <h4 class="text-sm font-bold text-white font-ancient flex items-center">
                                        ${techData.name}
                                        <span class="ml-2 text-[7px] px-1.5 py-0.2 bg-white/5 rounded text-gray-400 font-mono font-normal">${techData.quality || 'Hoàng Giai'}</span>
                                    </h4>
                                    <p class="text-[8px] text-gray-500 mt-0.5">Độ khó: <span class="font-bold text-cultivation-gold">${info.difficultyName}</span> | Còn lại: <span class="font-mono text-white">${timeStr}</span></p>
                                </div>
                            </div>
                            ${activePill}
                        </div>
                        <div class="space-y-1">
                            <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                                <div class="h-full ${barColorClass} transition-all duration-300" style="width: ${current.progress}%"></div>
                            </div>
                            <div class="flex justify-between items-center text-[8px] text-gray-500">
                                <span>Tiến độ: ${current.progress}%</span>
                                ${isActive ? `<span class="italic text-qi-blue font-bold">Tốc độ: ${(current.speedMult || 1.0).toFixed(2)}x</span>` : ''}
                            </div>
                            ${breakdownHtml}
                        </div>
                    `;
                    this.elTechListView.appendChild(el);
                });
            }

            // 2. Render learned techniques list below
            if (list.length === 0) {
                if (compList.length === 0) {
                    this.elTechListView.innerHTML = `<div class="text-center py-20 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ ${tab === 'cultivation' ? 'công pháp' : 'bí pháp'} nào...</div>`;
                }
            } else {
                if (compList.length > 0) {
                    const separator = document.createElement('div');
                    separator.className = 'mb-4 border-b border-white/5 pb-2 mt-6';
                    separator.innerHTML = `
                        <h3 class="text-[10px] font-ancient text-gray-500 uppercase tracking-[0.2em] flex items-center">
                            <i class="ph ph-scroll mr-1.5 text-xs"></i>
                            Công Pháp Đã Lĩnh Ngộ
                        </h3>
                    `;
                    this.elTechListView.appendChild(separator);
                }

                list.forEach(entry => {
                    const data = tab === 'cultivation' 
                        ? (getTechniqueById(entry.id) || (state.player.customTechniques || []).find(t => t.id === entry.id))
                        : getSecretTechniqueById(entry.id);
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
        const data = isSecret 
            ? getSecretTechniqueById(id) 
            : (getTechniqueById(id) || (state.player.customTechniques || []).find(t => t.id === id));
        if (!entry || !data) return;

        this.elTechListView.classList.add('hidden');
        this.elTechDetailView.classList.remove('hidden');

        const currentMasteryIdx = MASTERY_LEVELS.findIndex(m => m.id === (entry.masteryLevel || 1));
        const mastery = MASTERY_LEVELS[currentMasteryIdx];
        const nextMastery = MASTERY_LEVELS[currentMasteryIdx + 1];

        const stageLabel = data.stageLabel || 'Tầng';
        const stageName = (data.stageNames && data.stageNames[entry.stage - 1]) ? data.stageNames[entry.stage - 1] : `${stageLabel} ${entry.stage || 1}`;

        const canBreakthrough = entry.masteryLevel >= 4 && (entry.stage < (data.maxStage || 10));

        const isMain = !isSecret && (
            state.player.mainTechniqueId === id ||
            state.player.mainBodyTechniqueId === id ||
            state.player.mainSoulTechniqueId === id
        );

        let equipBtnHTML = '';
        if (!isSecret) {
            if (isMain) {
                equipBtnHTML = `
                    <button class="w-full py-4 bg-cultivation-gold/15 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-2xl cursor-default opacity-80" disabled>
                        <i class="ph ph-check-circle mr-1"></i> ĐANG CHỦ TU
                    </button>
                `;
            } else {
                equipBtnHTML = `
                    <button class="w-full py-4 bg-cultivation-gold text-black text-xs font-bold rounded-2xl active:scale-95 transition-all" onclick="window.game.setMainTechnique('${id}')">
                        <i class="ph ph-shield-star mr-1"></i> THIẾT LẬP CHỦ TU
                    </button>
                `;
            }
        }

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
                ${equipBtnHTML ? `<div class="mt-3">${equipBtnHTML}</div>` : ''}
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
