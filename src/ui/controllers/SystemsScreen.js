import { state } from '../../state.js';
import { AlchemyController } from './AlchemyController.js';
import { ShopController } from './ShopController.js';
import { SectController } from './SectController.js';
import { CraftingController } from './CraftingController.js';
import { MountainController } from './MountainController.js';
import { TechniqueController } from './TechniqueController.js';

/**
 * Quản lý giao diện của các hệ thống phụ thông qua các Sub-Controllers (Delegates)
 */
export class SystemsScreen {
    constructor() {
        this.activeSectZone = null;
        this.initElements();
        
        // Instantiate modular sub-controllers
        this.alchemyController = new AlchemyController(this);
        this.shopController = new ShopController(this);
        this.sectController = new SectController(this);
        this.craftingController = new CraftingController(this);
        this.mountainController = new MountainController(this);
        this.techniqueController = new TechniqueController(this);
        
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
        this.btnTechMainTabCongPhap = document.getElementById('tech-main-tab-cong-phap');
        this.btnTechMainTabKyNang = document.getElementById('tech-main-tab-ky-nang');
        this.btnTechTabLinhLuc = document.getElementById('tech-tab-linh-luc');
        this.btnTechTabLuyenThe = document.getElementById('tech-tab-luyen-the');
        this.btnTechTabThanThuc = document.getElementById('tech-tab-than-thuc');
        this.btnTechTabPhapThuat = document.getElementById('tech-tab-phap-thuat');
        this.btnTechTabThanThong = document.getElementById('tech-tab-than-thong');
        this.btnTechTabThanHon = document.getElementById('tech-tab-than-hon');
        this.btnTechTabBiPhap = document.getElementById('tech-tab-bi-phap');
        this.elTechSubTabsCongPhap = document.getElementById('tech-sub-tabs-cong-phap');
        this.elTechSubTabsKyNang = document.getElementById('tech-sub-tabs-ky-nang');
        this.elTechSubcategoryContainer = document.getElementById('tech-subcategory-container');
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
                this.shopController.shopSearchQuery = e.target.value.toLowerCase().trim();
                this.renderShop();
            };
        }

        if (this.elShopSortSelect) {
            this.elShopSortSelect.onchange = (e) => {
                this.shopController.shopSortMode = e.target.value;
                this.renderShop();
            };
        }
        
        // Technique Main Tabs Switching
        if (this.btnTechMainTabCongPhap) {
            this.btnTechMainTabCongPhap.onclick = () => {
                state.activeMainTab = 'cong_phap';
                if (this.btnTechMainTabCongPhap) this.btnTechMainTabCongPhap.className = 'flex-1 text-center py-2.5 rounded-xl text-xs font-ancient uppercase tracking-widest transition-all font-bold bg-qi-blue/15 text-qi-blue border border-qi-blue/20';
                if (this.btnTechMainTabKyNang) this.btnTechMainTabKyNang.className = 'flex-1 text-center py-2.5 rounded-xl text-xs font-ancient uppercase tracking-widest transition-all font-bold text-gray-500 hover:text-gray-300';
                
                if (this.elTechSubTabsCongPhap) this.elTechSubTabsCongPhap.classList.remove('hidden');
                if (this.elTechSubTabsKyNang) this.elTechSubTabsKyNang.classList.add('hidden');
                if (this.elTechSubcategoryContainer) this.elTechSubcategoryContainer.classList.add('hidden');
                
                this.renderTechniques('linh_luc');
            };
        }

        if (this.btnTechMainTabKyNang) {
            this.btnTechMainTabKyNang.onclick = () => {
                state.activeMainTab = 'ky_nang';
                if (this.btnTechMainTabCongPhap) this.btnTechMainTabCongPhap.className = 'flex-1 text-center py-2.5 rounded-xl text-xs font-ancient uppercase tracking-widest transition-all font-bold text-gray-500 hover:text-gray-300';
                if (this.btnTechMainTabKyNang) this.btnTechMainTabKyNang.className = 'flex-1 text-center py-2.5 rounded-xl text-xs font-ancient uppercase tracking-widest transition-all font-bold bg-qi-blue/15 text-qi-blue border border-qi-blue/20';
                
                if (this.elTechSubTabsCongPhap) this.elTechSubTabsCongPhap.classList.add('hidden');
                if (this.elTechSubTabsKyNang) this.elTechSubTabsKyNang.classList.remove('hidden');
                if (this.elTechSubcategoryContainer) this.elTechSubcategoryContainer.classList.remove('hidden');
                
                this.renderTechniques('phap_thuat');
            };
        }

        // Technique Sub Tabs
        if (this.btnTechTabLinhLuc) this.btnTechTabLinhLuc.onclick = () => this.renderTechniques('linh_luc');
        if (this.btnTechTabLuyenThe) this.btnTechTabLuyenThe.onclick = () => this.renderTechniques('luyen_the');
        if (this.btnTechTabThanThuc) this.btnTechTabThanThuc.onclick = () => this.renderTechniques('than_thuc');
        if (this.btnTechTabPhapThuat) this.btnTechTabPhapThuat.onclick = () => this.renderTechniques('phap_thuat');
        if (this.btnTechTabThanThong) this.btnTechTabThanThong.onclick = () => this.renderTechniques('than_thong');
        if (this.btnTechTabThanHon) this.btnTechTabThanHon.onclick = () => this.renderTechniques('than_hon');
        if (this.btnTechTabBiPhap) this.btnTechTabBiPhap.onclick = () => this.renderTechniques('bi_phap');
        
        if (this.btnTechBack) this.btnTechBack.onclick = () => {
            this.elTechListView.classList.remove('hidden');
            this.elTechDetailView.classList.add('hidden');
            if (this.techniqueController) {
                this.techniqueController.activeDetailId = null;
                this.techniqueController.activeDetailIsSecret = null;
                this.techniqueController.renderTechniques(state.activeTechTab);
            }
        };
    }

    getQualityClass(quality) {
        if (!quality) return 'common';
        const q = quality.toLowerCase();
        if (q.includes('phàm') || q.includes('hạ')) return 'common';
        if (q.includes('pháp') || q.includes('trung')) return 'uncommon';
        if (q.includes('linh') || q.includes('thượng') || q.includes('danh')) return 'rare';
        if (q.includes('bảo') || q.includes('cực')) return 'epic';
        if (q.includes('cổ') || q.includes('hoàn mỹ')) return 'legendary';
        if (q.includes('tiên')) return 'mythic';
        return 'common';
    }

    // --- ALCHEMY ---
    renderAlchemy() {
        this.alchemyController.renderAlchemy();
    }

    renderRecipes() {
        this.alchemyController.renderRecipes();
    }

    renderGarden() {
        this.alchemyController.renderGarden();
    }

    // --- SHOP ---
    renderShop() {
        this.shopController.renderShop();
    }

    renderShopSections() {
        this.shopController.renderShopSections();
    }

    renderShopSubFilters() {
        this.shopController.renderShopSubFilters();
    }

    renderShopQualityFilters() {
        this.shopController.renderShopQualityFilters();
    }

    renderShopBuy() {
        this.shopController.renderShopBuy();
    }

    renderShopSell() {
        this.shopController.renderShopSell();
    }

    // --- SECTS ---
    renderSects() {
        this.sectController.renderSects();
    }

    renderSectZoneDetail(sect, zoneId) {
        this.sectController.renderSectZoneDetail(sect, zoneId);
    }

    handleSectZoneAction(zoneId, actionId) {
        this.sectController.handleSectZoneAction(zoneId, actionId);
    }

    // --- SMITHING & CRAFTING ---
    renderSmithing() {
        this.craftingController.renderSmithing();
    }

    openCrafting(type) {
        this.craftingController.openCrafting(type);
    }

    openCraftingHub() {
        this.craftingController.openCraftingHub();
    }

    renderCraftingHub() {
        this.craftingController.renderCraftingHub();
    }

    renderPuppet() {
        this.craftingController.renderPuppet();
    }

    renderTalisman() {
        this.craftingController.renderTalisman();
    }

    renderBeast() {
        this.craftingController.renderBeast();
    }

    renderFormation() {
        this.craftingController.renderFormation();
    }

    renderCorpse() {
        this.craftingController.renderCorpse();
    }

    // --- MOUNTAIN & GUILD ---
    renderGuild() {
        this.mountainController.renderGuild();
    }

    renderTower() {
        this.mountainController.renderTower();
    }

    renderMountain() {
        this.mountainController.renderMountain();
    }

    renderEnergy() {
        this.mountainController.renderEnergy();
    }

    // --- TECHNIQUES ---
    renderTechniques(tab) {
        this.techniqueController.renderTechniques(tab);
    }

    renderTechniqueDetail(id, isSecret) {
        this.techniqueController.renderTechniqueDetail(id, isSecret);
    }
}
