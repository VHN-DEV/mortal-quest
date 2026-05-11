import { state } from './state.js';
import { Player } from './core/player.js';
import { SaveSystem } from './core/save-system.js';
import { UISystem } from './ui/ui-system.js';
import { ASSETS } from './configs/asset-data.js';
import { EnemyGenerator } from './core/enemy.js';
import { getLocationById } from './configs/map-data.js';
import { CombatEngine } from './core/combat-engine.js';

// Import Screens
import { MapScreen } from './ui/screens/MapScreen.js';
import { InventoryScreen } from './ui/screens/InventoryScreen.js';
import { CharacterScreen } from './ui/screens/CharacterScreen.js';
import { SystemsScreen } from './ui/screens/SystemsScreen.js';
import { BattleScreen } from './ui/screens/BattleScreen.js';

// Import Systems
import { ShopSystem } from './systems/shop-system.js';
import { AlchemySystem } from './systems/alchemy-system.js';
import { GuildSystem } from './systems/guild-system.js';
import { GardenSystem } from './systems/garden-system.js';
import { MountainSystem } from './systems/mountain-system.js';
import { TimeSystem } from './systems/time-system.js';
import { CraftingSystem } from './systems/crafting-system.js';
import { FormationSystem } from './systems/formation-system.js';
import { TalismanSystem } from './systems/talisman-system.js';
import { SmithingSystem } from './systems/smithing-system.js';
import { BeastSystem } from './systems/beast-system.js';
import { CorpseSystem } from './systems/corpse-system.js';
import { TechniqueSystem } from './systems/technique-system.js';
import { CreationSystem } from './systems/creation-system.js';
import { EnergySystem } from './systems/energy-system.js';

export class Game {
    constructor() {
        window.game = this; // Đảm bảo khả năng tương thích với các onclick trong HTML
        this.screens = {};
    }

    init() {
        console.log("%c🌌 Mortal Quest: Tái cấu trúc thành công!", "color: #4fd1c5; font-size: 14px; font-weight: bold;");
        
        // 1. Khởi tạo UI Core
        state.ui = new UISystem();
        window.ui = state.ui; // Compatibility with index.html onclicks
        
        // 2. Khởi tạo Screen Controllers
        this.screens.map = new MapScreen();
        this.screens.inventory = new InventoryScreen();
        this.screens.character = new CharacterScreen();
        this.screens.systems = new SystemsScreen();
        this.screens.battle = new BattleScreen();

        // 3. Khởi tạo Creation System (cho màn hình mới)
        state.systems.creation = new CreationSystem();

        // 4. Load dữ liệu
        const savedData = SaveSystem.load();

        if (!savedData) {
            this.showCreationScreen();
        } else {
            this.loadGame(savedData);
        }

        // 5. Vòng lặp game
        this.startLoop();

        // 6. Navigation
        this.initNavigation();

        // 7. Tự động lưu
        setInterval(() => this.saveGame(), 30000);
    }

    initNavigation() {
        const navMappings = {
            'nav-main': 'screen-main',
            'nav-adventure': 'screen-adventure',
            'nav-inventory': 'screen-inventory',
            'nav-character': 'screen-character',
            'nav-technique': 'screen-technique',
            'nav-crafting-hub': 'screen-crafting-hub'
        };

        Object.entries(navMappings).forEach(([btnId, screenId]) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.onclick = () => state.ui.switchScreen(screenId, btn);
            }
        });

        // Specific character portrait click
        const elHeaderPortraitContainer = document.getElementById('header-portrait-container');
        if (elHeaderPortraitContainer) {
            elHeaderPortraitContainer.onclick = () => {
                const btnChar = document.getElementById('nav-character');
                state.ui.switchScreen('screen-character', btnChar);
            };
        }
    }

    showCreationScreen() {
        state.ui.toggleOverlay(document.getElementById('screen-creation'), true);
        state.ui.toggleOverlay(document.getElementById('screen-main'), false);
        
        const elementsToHide = ['header', '#time-hud', 'nav'];
        elementsToHide.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.classList.add('hidden');
        });
        
        // window.renderCreationScreen() should still exist or be moved
        if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
    }

    loadGame(savedData) {
        state.player = new Player();
        state.player.load(savedData);
        
        this.initSystems(state.player, savedData);
        
        state.ui.toggleOverlay(document.getElementById('screen-creation'), false);
        state.ui.toggleOverlay(document.getElementById('screen-main'), true);
        
        const elementsToShow = ['header', '#time-hud', 'nav'];
        elementsToShow.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.classList.remove('hidden');
        });

        this.refreshUI();
    }

    initSystems(player, savedData = null) {
        state.initSystems({
            shop: new ShopSystem(player),
            alchemy: new AlchemySystem(player, state.ui),
            guild: new GuildSystem(player, state.ui),
            garden: new GardenSystem(player, state.ui),
            mountain: new MountainSystem(player, state.ui),
            time: new TimeSystem(player, state.ui),
            crafting: new CraftingSystem(player),
            formation: new FormationSystem(player, state.ui),
            talisman: new TalismanSystem(player, state.ui),
            smithing: new SmithingSystem(player, state.ui),
            beast: new BeastSystem(player, state.ui),
            corpse: new CorpseSystem(player, state.ui),
            energy: new EnergySystem(player, state.ui),
            technique: new TechniqueSystem(player)
        });

        if (savedData && savedData.time) {
            state.systems.time.load(savedData.time);
        }

        // Cập nhật giao diện cơ bản
        const elName = document.getElementById('player-name-header');
        if (elName) elName.textContent = player.name;
        
        const elPortrait = document.getElementById('header-portrait');
        if (elPortrait) elPortrait.src = ASSETS.portraits.player;
        
        const mainPortrait = document.getElementById('main-player-portrait');
        if (mainPortrait) mainPortrait.src = ASSETS.portraits.player;

        // Restore location
        if (player.currentWorldId) {
            state.currentWorldId = player.currentWorldId;
            state.currentLocId = player.currentLocId;
            this.screens.map.renderWorldList();
        }
    }

    startLoop() {
        const loop = () => {
            if (state.player) {
                const now = Date.now();
                const delta = (now - state.player.lastUpdate) / 1000;
                
                // Cập nhật logic game
                this.update(delta);
                
                // Render frame hiện tại
                this.render();
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    update(delta) {
        // Logic tu luyện, thời gian, v.v. (giống trong main.js cũ)
        // Tôi sẽ chuyển dần các phần này sang các system chuyên biệt
        state.player.update(delta, 1.0); // Simple for now
        if (state.systems.time) state.systems.time.update(delta);
        if (state.systems.garden) state.systems.garden.update(delta);
        if (state.systems.mountain && state.systems.mountain.isActive) state.systems.mountain.update(delta);
        
        if (state.player.hp <= 0) this.handleDeath();
    }

    render() {
        // Render thanh trạng thái chính (Top Bar)
        // Phần này có thể tách ra thành TopBarComponent.js
        if (typeof window.renderMainStats === 'function') window.renderMainStats();
    }

    refreshUI() {
        if (!state.player) return;
        this.screens.map.renderWorldList();
        this.screens.inventory.render();
        this.screens.character.render();
        
        // Render các hệ thống khác (Alchemy, Shop, v.v.)
        if (this.screens.systems) {
            this.screens.systems.renderAlchemy();
            this.screens.systems.renderShop();
        }
    }

    saveGame() {
        if (state.player) {
            state.player.currentWorldId = state.currentWorldId;
            state.player.currentLocId = state.currentLocId;
            const data = state.player.save();
            if (state.systems.time) data.time = state.systems.time.save();
            SaveSystem.save(data);
        }
    }

    handleDeath() {
        // Logic hồi sinh
        state.player.hp = Math.floor(state.player.maxHp * 0.1);
        state.ui.toast("Bạn đã kiệt sức và ngất đi...", "error");
        this.refreshUI();
    }

    // Các hàm helper để gọi từ HTML (window.game.xxx)
    openShop(view) { 
        if (state.systems.shop) {
            state.views.shop = view || 'buy';
            state.ui.toggleOverlay(document.getElementById('shop-overlay'), true);
            if (typeof window.renderShop === 'function') window.renderShop();
        }
    }
    
    openSect() { 
        state.ui.toggleOverlay(document.getElementById('sects-overlay'), true);
        if (typeof window.renderSects === 'function') window.renderSects();
    }
    
    openGuild() { 
        state.ui.toggleOverlay(document.getElementById('guild-overlay'), true);
        if (typeof window.renderGuild === 'function') window.renderGuild();
    }
    
    openTower() { 
        state.ui.toggleOverlay(document.getElementById('tower-overlay'), true);
        if (typeof window.renderTower === 'function') window.renderTower();
    }
    
    openMountain() { 
        state.ui.toggleOverlay(document.getElementById('mountain-overlay'), true);
        if (state.systems.mountain) state.systems.mountain.start();
        if (typeof window.renderMountain === 'function') window.renderMountain();
    }

    openAuction() {
        state.ui.toast("Vạn Bảo Thiên Các hiện chưa mở cuộc đấu giá nào. Hãy quay lại sau!", "info");
    }

    // Specialized actions
    craft(recipeId) {
        if (state.systems.alchemy) {
            const res = state.systems.alchemy.craft(recipeId);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    harvest(index) {
        if (state.systems.garden) {
            const res = state.systems.garden.harvest(index);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    showPlantMenu(index) {
        // ... Logic chọn hạt giống
        state.ui.toast("Menu gieo hạt đang được chuẩn bị...", "info");
    }

    buyItem(id) {
        if (state.systems.shop) {
            const res = state.systems.shop.buyItem(id, 1);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    sellItem(id, qty) {
        if (state.systems.shop) {
            const res = state.systems.shop.sellItem(id, qty);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    startBattle(worldId, locId) {
        const loc = getLocationById(worldId, locId);
        const enemy = EnemyGenerator.generate(loc.dangerLevel || 1);
        
        state.currentCombat = new CombatEngine(
            state.player, 
            enemy, 
            (type, data) => this.screens.battle.render(type, data),
            (result) => {
                this.screens.battle.close();
                this.refreshUI();
            }
        );
        
        this.screens.battle.render('start');
        state.currentCombat.start();
    }

    openCrafting(type) {
        this.screens.systems.openCrafting(type);
    }

    openShop(mode = 'buy') {
        state.views.shop = mode;
        state.ui.switchScreen('screen-shop');
        if (this.screens.systems) this.screens.systems.renderShop();
    }

    openNPC() {
        state.ui.toast('Hệ thống NPC đang được bảo trì...', 'info');
    }

    openSect() {
        state.ui.switchScreen('screen-sect');
    }

    openGuild() {
        state.ui.switchScreen('screen-guild');
    }

    openTower() {
        state.ui.switchScreen('screen-tower');
    }

    openMountain() {
        state.ui.switchScreen('screen-mountain');
    }

    openAuction() {
        state.ui.toast('Đấu giá trường chưa mở cửa!', 'warning');
    }

    forge(recipeId) {
        if (state.systems.smithing) {
            const res = state.systems.smithing.forge(recipeId);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    guildCertify(level) {
        if (state.systems.guild) {
            const res = state.systems.guild.certify(level);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }
}
