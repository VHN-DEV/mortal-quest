import { state } from './state.js';
import { Player } from './core/player.js';
import { SaveSystem } from './core/save-system.js';
import { UISystem } from './ui/ui-system.js';
import { ASSETS } from './configs/asset-data.js';
import { EnemyGenerator } from './core/enemy.js';
import { getLocationById } from './configs/map-data.js';
import { CombatEngine } from './core/combat-engine.js';
import { getItemById } from './configs/item-data.js';

// Import Screens
import { MapScreen } from './ui/screens/MapScreen.js';
import { InventoryScreen } from './ui/screens/InventoryScreen.js';
import { CharacterScreen } from './ui/screens/CharacterScreen.js';
import { SystemsScreen } from './ui/screens/SystemsScreen.js';
import { BattleScreen } from './ui/screens/BattleScreen.js';
import { SpiritStoneUI } from './ui/spirit-stone-ui.js';
import { TreasureScreen } from './ui/screens/TreasureScreen.js';

// Import Systems
import { ShopSystem } from './systems/shop-system.js';
import { AlchemySystem } from './systems/alchemy-system.js';
import { GuildSystem } from './systems/guild-system.js';
import { GardenSystem } from './systems/garden-system.js';
import { FIELD_GRADES, FIELD_ATTRIBUTES } from './configs/garden-data.js';
import { MountainSystem } from './systems/mountain-system.js';
import { TimeSystem } from './systems/time-system.js';
import { CraftingSystem } from './systems/crafting-system.js';
import { FormationSystem } from './systems/formation-system.js';
import { TalismanSystem } from './systems/talisman-system.js';
import { SmithingSystem } from './systems/smithing-system.js';
import { BeastSystem } from './systems/beast-system.js';
import { CorpseSystem } from './systems/corpse-system.js';
import { CREATION_ORIGINS } from './configs/creation-data.js';
import { TechniqueSystem } from './systems/technique-system.js';
import { CreationSystem } from './systems/creation-system.js';
import { EnergySystem } from './systems/energy-system.js';
import { SpiritStoneSystem } from './systems/spirit-stone-system.js';
import { PuppetSystem } from './systems/puppet-system.js';
import { TreasureSystem } from './systems/treasure-system.js';
import { NPCSystem } from './systems/npc-system.js';
import { SocialSystem } from './systems/social-system.js';


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
        this.screens.spiritStone = new SpiritStoneUI();
        this.screens.treasure = new TreasureScreen();

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

        // 6. Navigation & Global Events
        this.initNavigation();
        this.initGlobalEvents();

        // 7. Tự động lưu
        setInterval(() => this.saveGame(), 30000);
    }

    initGlobalEvents() {
        const btnReset = document.getElementById('reset-game-btn');
        if (btnReset) {
            btnReset.onclick = () => this.resetGame();
        }

        const focusMap = {
            'focus-tuvi': 'tuvi',
            'focus-body': 'body',
            'focus-soul': 'soul'
        };
        Object.entries(focusMap).forEach(([id, focus]) => {
            const btn = document.getElementById(id);
            if (btn) btn.onclick = () => this.setCultivationFocus(focus);
        });

        const cultivateBtn = document.getElementById('cultivate-btn');
        if (cultivateBtn) cultivateBtn.onclick = () => this.cultivate();

        const breakthroughBtn = document.getElementById('breakthrough-btn');
        if (breakthroughBtn) breakthroughBtn.onclick = () => this.breakthrough();

        const autoCultivate = document.getElementById('auto-cultivate-toggle');
        if (autoCultivate) autoCultivate.onchange = (e) => this.toggleAutoCultivate(e.target.checked);

        const seclusionBtn = document.getElementById('seclusion-btn');
        if (seclusionBtn) seclusionBtn.onclick = () => this.enterSeclusion();

        this.bindPlaceholderButtons();
    }

    bindPlaceholderButtons() {
        const placeholderBinds = {
            'btn-npc-talk': 'Tương tác hội thoại NPC đang được bảo trì.',
            'btn-npc-gift': 'Tính năng tặng quà NPC đang được phát triển.',
            'btn-npc-party': 'Tính năng mời NPC vào đội đang được phát triển.',
            'btn-npc-dual': 'Tính năng luận bàn với NPC đang được phát triển.',
            'btn-npc-trade': 'Tính năng giao dịch NPC đang được phát triển.',
            'btn-npc-attack': 'Tính năng khiêu chiến NPC đang được phát triển.',
            'btn-npc-leave': 'Tính năng NPC hiện chưa mở.',
            'btn-reroll-destiny': 'Tính năng quay lại Thiên Mệnh đang được phát triển.',
            'btn-confirm-destiny': 'Tính năng xác nhận Thiên Mệnh đang được phát triển.'
        };

        Object.entries(placeholderBinds).forEach(([id, msg]) => {
            const btn = document.getElementById(id);
            if (btn && !btn.onclick) {
                btn.onclick = () => state.ui.toast(msg, 'info');
            }
        });
    }

    initNavigation() {
        const navMappings = {
            'nav-main': 'screen-main',
            'nav-adventure': 'screen-adventure',
            'nav-inventory': 'screen-inventory',
            'nav-character': 'screen-character',
            'nav-technique': 'screen-technique',
            'nav-crafting-hub': 'screen-crafting-hub',
            'nav-npc': 'screen-npc'
        };

        Object.entries(navMappings).forEach(([btnId, screenId]) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.onclick = () => {
                    state.ui.switchScreen(screenId, btn);
                    if (screenId === 'screen-technique') {
                        this.screens.systems.renderTechniques(state.activeTechTab || 'cultivation');
                    } else if (screenId === 'screen-crafting-hub') {
                        this.screens.systems.renderCraftingHub();
                    }
                };
            }
        });

        // Restore saved screen if player exists (game is loaded)
        if (state.player) {
            let savedScreen = localStorage.getItem('mortal_quest_current_screen');
            
            // Special case: If we were in battle, we reset to adventure screen at the current location
            if (savedScreen === 'screen-battle') {
                savedScreen = 'screen-adventure';
                localStorage.setItem('mortal_quest_current_screen', 'screen-adventure');
                // Ensure we go back to the explore view
                localStorage.setItem('mortal_quest_map_view', 'explore');
            }

            if (savedScreen) {
                const btnId = Object.keys(navMappings).find(key => navMappings[key] === savedScreen);
                if (btnId) {
                    const btn = document.getElementById(btnId);
                    if (btn) {
                        btn.click();
                        // If it's the adventure screen, we need to restore its sub-view
                        if (savedScreen === 'screen-adventure') {
                            this.screens.map.restoreView();
                        }
                        return;
                    }
                }
            }
            // Default to main screen if no saved screen
            const mainBtn = document.getElementById('nav-main');
            if (mainBtn) mainBtn.click();
        }

        // Specific character portrait click
        const elHeaderPortraitContainer = document.getElementById('header-portrait-container');
        if (elHeaderPortraitContainer) {
            elHeaderPortraitContainer.onclick = () => {
                const btnChar = document.getElementById('nav-character');
                state.ui.switchScreen('screen-character', btnChar);
            };
        }

        this.initOverlayButtons();
    }

    initOverlayButtons() {
        const closeButtons = {
            'close-shop-btn': 'shop-overlay',
            'close-guild-btn': 'guild-overlay',
            'close-mountain-btn': 'mountain-overlay',
            'close-tower-btn': 'tower-overlay',
            'close-sects-btn': 'sects-overlay',
            'close-stats-btn': 'stats-modal'
        };

        Object.entries(closeButtons).forEach(([btnId, overlayId]) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.onclick = () => {
                    const overlay = document.getElementById(overlayId);
                    if (overlay) state.ui.toggleOverlay(overlay, false);
                };
            }
        });

        // Mountain buttons
        const btnExplore = document.getElementById('btn-mountain-explore');
        if (btnExplore) btnExplore.onclick = () => this.mountainExplore();

        const btnDeeper = document.getElementById('btn-mountain-deeper');
        if (btnDeeper) btnDeeper.onclick = () => this.mountainDeeper();
        
        const btnRetreat = document.getElementById('btn-mountain-retreat');
        if (btnRetreat) btnRetreat.onclick = () => this.mountainRetreat();

        // Ambush buttons
        const btnAmbushStart = document.getElementById('btn-ambush-start');
        if (btnAmbushStart) btnAmbushStart.onclick = () => this.startAmbush();
        
        const btnAmbushEscape = document.getElementById('btn-ambush-escape');
        if (btnAmbushEscape) btnAmbushEscape.onclick = () => this.escapeAmbush();

        // Chase buttons
        const btnChaseStart = document.getElementById('btn-chase-start');
        if (btnChaseStart) btnChaseStart.onclick = () => this.startChase();
        
        const btnChaseGiveup = document.getElementById('btn-chase-giveup');
        if (btnChaseGiveup) btnChaseGiveup.onclick = () => this.giveupChase();
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
        
        const elementsToShow = ['header', '#time-hud', 'nav'];
        elementsToShow.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.classList.remove('hidden');
        });

        // Switch to the main cultivation screen and render it
        const mainNavBtn = document.querySelector('.nav-item[onclick*="screen-main"]');
        state.ui.switchScreen('screen-main', mainNavBtn);

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
            technique: new TechniqueSystem(player),
            spiritStone: new SpiritStoneSystem(player, state.ui),
            puppet: new PuppetSystem(player, state.ui),
            treasure: new TreasureSystem(player, state.ui),
            npc: new NPCSystem(),
            social: new SocialSystem()
        });

        if (savedData) {
            if (savedData.npcData) state.systems.npc.loadData(savedData.npcData);
            if (savedData.socialData) state.systems.social.loadData(savedData.socialData);
        } else {
            // Khởi tạo một số NPC mặc định cho thế giới mới
            state.systems.npc.generate('tan_tu', 1, 'thanh_van_tran');
            state.systems.npc.generate('thuong_nhan', 3, 'thanh_van_tran');
            state.systems.npc.generate('sect_elder', 10, 'thanh_van_tong');
            state.systems.npc.generate('thien_kieu', 5, 'linh_vong_son');
        }

        if (savedData && savedData.time) {
            state.systems.time.load(savedData.time);
        }

        if (savedData && savedData.mountain) {
            state.systems.mountain.discovery = savedData.mountain.discovery || {};
            state.systems.mountain.bossDefeated = savedData.mountain.bossDefeated || {};
            state.systems.mountain.reputation = savedData.mountain.reputation || 0;
            state.systems.mountain.currentLayer = savedData.mountain.currentLayer || 'chan_nui';
        }

        // Cập nhật giao diện cơ bản
        const elName = document.getElementById('player-name-header');
        if (elName) elName.textContent = player.name;
        
        // Cập nhật chân dung dựa trên avatar
        const portraitKey = player.avatar || (player.gender === 'Nữ' ? 'player_female' : 'player_male');
        const portraitUrl = ASSETS.portraits[portraitKey];

        const elPortrait = document.getElementById('header-portrait');
        if (elPortrait) elPortrait.src = portraitUrl;
        
        const mainPortrait = document.getElementById('main-player-portrait');
        if (mainPortrait) mainPortrait.src = portraitUrl;
        
        // Also update character screen portrait if it exists
        const charPortrait = document.querySelector('#screen-character img');
        if (charPortrait) charPortrait.src = portraitUrl;


        // Restore location
        if (player.currentWorldId) {
            state.currentWorldId = player.currentWorldId;
            state.currentLocId = player.currentLocId;
            state.explorationProgress = player.explorationProgress || 0;
            // Note: restoreView() is called in initNavigation to avoid redundant renders
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
        if (state.systems.npc && state.systems.time) state.systems.npc.update(delta, state.systems.time.totalMinutes);
        if (state.systems.social) state.systems.social.update(delta);
        
        if (state.player.hp <= 0) this.handleDeath();
    }

    render() {
        // Render thanh trạng thái chính (Top Bar)
        // Phần này có thể tách ra thành TopBarComponent.js
        if (typeof window.renderMainStats === 'function') window.renderMainStats();
    }

    refreshUI() {
        if (!state.player) return;
        // Render main cultivation screen stats
        if (typeof window.renderMainStats === 'function') window.renderMainStats();
        this.screens.map.renderWorldList();
        this.screens.inventory.render();
        this.screens.character.render();
        
        // Render các hệ thống khác (Alchemy, Shop, v.v.)
        if (this.screens.systems) {
            this.screens.systems.renderAlchemy();
            this.screens.systems.renderShop();
            this.screens.systems.renderMountain();
            this.screens.systems.renderSects();
            this.screens.systems.renderGuild();
            this.screens.systems.renderTower();
        }
        if (this.screens.spiritStone) {
            this.screens.spiritStone.render();
        }
    }

    saveGame() {
        if (state.player) {
            state.player.currentWorldId = state.currentWorldId;
            state.player.currentLocId = state.currentLocId;
            state.player.explorationProgress = state.explorationProgress;
            const data = state.player.save();
            if (state.systems.time) data.time = state.systems.time.save();
            if (state.systems.mountain) {
                data.mountain = {
                    discovery: state.systems.mountain.discovery,
                    bossDefeated: state.systems.mountain.bossDefeated,
                    reputation: state.systems.mountain.reputation,
                    currentLayer: state.systems.mountain.currentLayer
                };
            }
            SaveSystem.save(data);
        }
    }

    resetGame() {
        state.ui.confirm("Ngươi có chắc chắn muốn xóa hết tu vi để bắt đầu lại từ đầu? Hành động này không thể hoàn tác!", "Xác Nhận Luân Hồi")
            .then(confirmed => {
                if (confirmed) {
                    SaveSystem.clear();
                    location.reload();
                }
            });
    }

    getRebirthProtectionSource() {
        const p = state.player;
        if (!p) return null;

        const lifeSavingArtifactIds = ['phap_bao_bao_menh', 'truong_sinh_phu'];
        const rebirthArtifactIds = ['trung_sinh_chau', 'nirvana_linh_chau'];
        const soulSeizureTechniqueIds = ['doat_xa_bi_phap', 'linh_hon_neo'];

        const equippedIds = Object.values(p.equipment || {}).filter(Boolean);
        const inventoryIds = (p.inventory?.items || []).map(item => item.id);
        const learnedIds = [
            ...(p.learnedSecretTechniques || []).map(t => t.id),
            ...(p.learnedTechniques || []).map(t => t.id)
        ];

        const foundArtifact = [...lifeSavingArtifactIds, ...rebirthArtifactIds]
            .find(id => equippedIds.includes(id) || inventoryIds.includes(id));
        if (foundArtifact) return { type: 'artifact', id: foundArtifact };

        const foundTechnique = soulSeizureTechniqueIds.find(id => learnedIds.includes(id));
        if (foundTechnique) return { type: 'technique', id: foundTechnique };

        if (p.explorationProxy?.active) return { type: 'clone_proxy', id: 'exploration_proxy' };
        if (p.activeCloneExploration) return { type: 'clone_proxy', id: 'active_clone' };

        return null;
    }

    consumeRebirthProtection(source) {
        const p = state.player;
        if (!p || !source) return false;

        if (source.type === 'artifact') {
            if (p.inventory?.removeItem && p.inventory.removeItem(source.id, 1)) return true;
            // If currently equipped directly, also allow consume as one-time trigger
            const equippedSlot = Object.entries(p.equipment || {}).find(([, itemId]) => itemId === source.id);
            if (equippedSlot) {
                p.equipment[equippedSlot[0]] = null;
                return true;
            }
            return false;
        }

        if (source.type === 'clone_proxy') {
            if (p.explorationProxy?.active) {
                p.explorationProxy.active = false;
                return true;
            }
            if (p.activeCloneExploration) {
                p.activeCloneExploration = false;
                return true;
            }
            return false;
        }

        // Soul-retention technique: non-consumable by design
        if (source.type === 'technique') return true;

        return false;
    }

    restartFromDeath() {
        SaveSystem.clear();
        state.player = null;
        state.currentCombat = null;
        state.currentLocId = null;
        state.explorationProgress = 0;
        this.showCreationScreen();
        state.ui.toast('Thân tử đạo tiêu. Không có bảo mệnh, ngươi phải bắt đầu lại từ đầu.', 'error', 8000);
    }

    handleDeath() {
        const source = this.getRebirthProtectionSource();
        if (source && this.consumeRebirthProtection(source)) {
            state.player.hp = Math.max(1, Math.floor(state.player.maxHp * 0.2));
            state.player.mana = Math.floor(state.player.maxMana * 0.1);
            state.ui.toast('Ngươi đã chết, nhưng nhờ thủ đoạn bảo mệnh/trùng sinh nên thoát kiếp.', 'warning', 7000);
            this.refreshUI();
            return;
        }

        this.restartFromDeath();
    }

    setCultivationFocus(focus) {
        if (!state.player || !['tuvi', 'body', 'soul'].includes(focus)) return;
        state.player.cultivationFocus = focus;
        this.refreshUI();
    }

    cultivate() {
        if (!state.player) return;
        const result = state.player.cultivate();
        const message = result?.msg || result?.reason;
        
        if (state.autoCultivateInterval) {
            if (!result.success) {
                this.toggleAutoCultivate(false);
                const toggleBtn = document.getElementById('auto-cultivate-toggle');
                if (toggleBtn) toggleBtn.checked = false;
                if (message) state.ui.toast("Tự động tu luyện dừng lại: " + message, 'error');
            }
        } else {
            if (message) state.ui.toast(message, result.success ? 'success' : 'error');
        }
        
        this.refreshUI();
    }

    breakthrough() {
        if (!state.player) return;
        const focus = state.player.cultivationFocus || 'tuvi';
        const result = state.player.breakthrough(focus);
        if (result && result.msg) state.ui.toast(result.msg, result.success ? 'success' : 'error');
        this.refreshUI();
    }

    toggleAutoCultivate(enabled) {
        if (!state.player) return;
        if (enabled) {
            if (!state.autoCultivateInterval) {
                state.autoCultivateInterval = setInterval(() => this.cultivate(), 1200);
            }
        } else if (state.autoCultivateInterval) {
            clearInterval(state.autoCultivateInterval);
            state.autoCultivateInterval = null;
        }
    }

    enterSeclusion() {
        state.ui.toast("Tính năng Bế Quan đang được hoàn thiện. Hiện tại hãy dùng Tu luyện thường hoặc Auto.", "info");
    }

    // Các hàm helper để gọi từ HTML (window.game.xxx)
    openShop(view, shopId = null) { 
        if (state.systems.shop) {
            state.views.shop = view || 'buy';
            if (shopId) state.systems.shop.currentShopId = shopId;
            state.ui.toggleOverlay(document.getElementById('shop-overlay'), true);
            if (this.screens.systems) this.screens.systems.renderShop();
        }
    }
    
    openSect() { 
        state.ui.toggleOverlay(document.getElementById('sects-overlay'), true);
        if (this.screens.systems) this.screens.systems.renderSects();
    }
    
    openGuild() { 
        state.ui.toggleOverlay(document.getElementById('guild-overlay'), true);
        if (this.screens.systems) this.screens.systems.renderGuild();
    }
    
    openTower() { 
        state.ui.toggleOverlay(document.getElementById('tower-overlay'), true);
        if (this.screens.systems) this.screens.systems.renderTower();
    }
    
    openMountain() { 
        state.ui.toggleOverlay(document.getElementById('mountain-overlay'), true);
        if (state.systems.mountain) state.systems.mountain.start();
        if (this.screens.systems) this.screens.systems.renderMountain();
    }

    openAuction() {
        state.ui.toast("Vạn Bảo Thiên Các hiện chưa mở cuộc đấu giá nào. Hãy quay lại sau!", "info");
    }

    renderEnergy() {
        if (this.screens.systems) this.screens.systems.renderEnergy();
    }

    mountainExplore() {
        if (state.systems.mountain) {
            const success = state.systems.mountain.explore();
            if (success) this.refreshUI();
        }
    }

    mountainDeeper() {
        if (state.systems.mountain) {
            const success = state.systems.mountain.moveDeeper();
            if (success) this.refreshUI();
        }
    }

    mountainRetreat() {
        if (state.systems.mountain) {
            const success = state.systems.mountain.retreat();
            if (success) this.refreshUI();
        }
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
        const seeds = state.player.inventory.items.filter(i => i.id.startsWith('seed_'));
        const menu = document.getElementById('garden-menu-content');
        const title = document.getElementById('garden-menu-title');
        const subtitle = document.getElementById('garden-menu-subtitle');
        
        if (!menu || !title || !subtitle) return;

        title.textContent = 'Gieo Hạt Linh Thảo';
        subtitle.textContent = `Ô đất số ${index + 1}`;
        menu.innerHTML = '';
        
        if (seeds.length === 0) {
            menu.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Túi đồ không có hạt giống nào...</div>';
        } else {
            seeds.forEach(seed => {
                const itemData = getItemById(seed.id);
                const el = document.createElement('div');
                el.className = 'p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 cursor-pointer transition-all';
                el.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <span class="text-2xl">${itemData.icon || '🌱'}</span>
                        <div>
                            <div class="text-xs font-bold text-white">${itemData.name}</div>
                            <div class="text-[9px] text-gray-500 uppercase tracking-tighter">Số lượng: ${seed.quantity}</div>
                        </div>
                    </div>
                    <button class="px-4 py-2 bg-qi-jade/20 text-qi-jade text-[10px] font-bold rounded-xl border border-qi-jade/20">CHỌN</button>
                `;
                el.onclick = () => {
                    const res = state.systems.garden.plant(index, seed.id);
                    state.ui.toast(res.msg, res.success ? 'success' : 'error');
                    state.ui.toggleOverlay('garden-menu-overlay', false);
                    this.refreshUI();
                };
                menu.appendChild(el);
            });
        }
        state.ui.toggleOverlay('garden-menu-overlay', true);
    }

    showFieldMenu(index) {
        const plot = state.player.gardenPlots[index];
        const menu = document.getElementById('garden-menu-content');
        const title = document.getElementById('garden-menu-title');
        const subtitle = document.getElementById('garden-menu-subtitle');
        
        if (!menu || !title || !subtitle) return;

        title.textContent = 'Quản Lý Linh Điền';
        subtitle.textContent = `Ô đất số ${index + 1}`;
        menu.innerHTML = '';

        // Upgrade Section
        const grades = Object.keys(FIELD_GRADES);
        const curGradeIdx = grades.indexOf(plot.grade);
        if (curGradeIdx < grades.length - 1) {
            const nextGrade = grades[curGradeIdx + 1];
            const gInfo = FIELD_GRADES[nextGrade];
            const upEl = document.createElement('div');
            upEl.className = 'p-5 bg-gradient-to-r from-qi-jade/10 to-transparent border border-qi-jade/20 rounded-3xl space-y-3';
            upEl.innerHTML = `
                <div class="flex justify-between items-center">
                    <h4 class="text-xs font-bold text-qi-jade uppercase">Nâng cấp phẩm cấp</h4>
                    <span class="text-[10px] font-mono text-white">${gInfo.cost} LT</span>
                </div>
                <p class="text-[9px] text-gray-500">Nâng cấp lên ${gInfo.name} để tăng tốc độ sinh trưởng (${gInfo.speedMult}x).</p>
                <button class="w-full py-2.5 bg-qi-jade text-black text-[10px] font-bold rounded-xl active:scale-95 transition-all" onclick="window.game.upgradeField(${index})">NÂNG CẤP NGAY</button>
            `;
            menu.appendChild(upEl);
        }

        // Attribute Section
        const attrTitle = document.createElement('h4');
        attrTitle.className = 'text-[9px] text-gray-500 uppercase font-bold px-2 mt-4';
        attrTitle.textContent = 'Thay đổi thuộc tính (500 LT)';
        menu.appendChild(attrTitle);

        const attrGrid = document.createElement('div');
        attrGrid.className = 'grid grid-cols-2 gap-2';
        Object.values(FIELD_ATTRIBUTES).forEach(attr => {
            const isCurrent = plot.attribute === attr.id;
            const btn = document.createElement('button');
            btn.className = `p-3 rounded-2xl border text-[10px] font-bold flex items-center justify-center space-x-2 transition-all ${isCurrent ? 'bg-white/10 border-white/40 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`;
            btn.innerHTML = `<span>${attr.icon}</span> <span>${attr.name}</span>`;
            btn.onclick = () => {
                if (isCurrent) return;
                const res = state.systems.garden.setAttribute(index, attr.id);
                state.ui.toast(res.msg, res.success ? 'success' : 'error');
                if (res.success) this.showFieldMenu(index);
                this.refreshUI();
            };
            attrGrid.appendChild(btn);
        });
        menu.appendChild(attrGrid);

        state.ui.toggleOverlay('garden-menu-overlay', true);
    }

    upgradeField(index) {
        if (state.systems.garden) {
            const res = state.systems.garden.upgradeField(index);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            if (res.success) this.showFieldMenu(index);
            this.refreshUI();
        }
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

    handleCombatEncounter(worldId, locId) {
        const loc = getLocationById(worldId, locId);
        const enemy = EnemyGenerator.generate(loc.dangerLevel || 1);
        this.pendingEncounter = { worldId, locId, enemy };

        const playerPerc = state.player.advancedStats.perception || 5;
        const enemyPerc = enemy.perception || 5;

        // Kiểm tra phát hiện (Thần thức đối kháng)
        const roll = Math.random() * 10 - 5; // -5 to +5 variance
        if (playerPerc > enemyPerc + roll) {
            // Người chơi phát hiện quái trước
            const elDesc = document.getElementById('ambush-desc');
            if (elDesc) elDesc.textContent = `Thần thức nhạy bén giúp ngươi phát hiện một con ${enemy.name} đang ẩn nấp phía trước. Ngươi có muốn tập kích nó không?`;
            state.ui.toggleOverlay(document.getElementById('ambush-overlay'), true);
        } else if (enemyPerc > playerPerc + (Math.random() * 10)) {
            // Quái tập kích người chơi (xác suất cao hơn nếu thần thức thấp)
            state.ui.toast(`Ngươi bị một con ${enemy.name} tập kích bất ngờ!`, 'error');
            setTimeout(() => {
                this.startBattle(worldId, locId, 'enemy', enemy);
            }, 1000);
        } else {
            // Chạm trán bình thường
            this.startBattle(worldId, locId, null, enemy);
        }
    }

    startAmbush() {
        try {
            if (!this.pendingEncounter) return;
            state.ui.toggleOverlay(document.getElementById('ambush-overlay'), false);
            
            const perc = (state.player && state.player.advancedStats && state.player.advancedStats.perception) || 5;
            const successChance = 0.6 + (perc / 100);
            const success = Math.random() < successChance;

            if (success) {
                this.startBattle(this.pendingEncounter.worldId, this.pendingEncounter.locId, 'player', this.pendingEncounter.enemy);
            } else {
                state.ui.toast("Tập kích thất bại! Ngươi đã bị đối phương phát hiện.", "warning");
                this.startBattle(this.pendingEncounter.worldId, this.pendingEncounter.locId, null, this.pendingEncounter.enemy);
            }
            this.pendingEncounter = null;
        } catch (e) {
            console.error(e);
            state.ui.toast("Lỗi khi tập kích!", "error");
        }
    }

    escapeAmbush() {
        try {
            state.ui.toggleOverlay(document.getElementById('ambush-overlay'), false);
            state.ui.toast("Ngươi lặng lẽ lách mình qua kẻ địch, tránh được một cuộc chiến.", "info");
            this.pendingEncounter = null;
            this.refreshUI();
        } catch (e) {
            console.error(e);
            state.ui.toast("Lỗi khi lánh mặt!", "error");
        }
    }

    startChase() {
        if (!state.currentCombat) return;
        state.ui.toggleOverlay(document.getElementById('chase-overlay'), false);
        state.currentCombat.chaseEnemy();
    }

    giveupChase() {
        if (!state.currentCombat) return;
        state.ui.toggleOverlay(document.getElementById('chase-overlay'), false);
        state.ui.toast("Ngươi quyết định không đuổi theo, kẻ địch đã trốn thoát thành công.", "info");
        state.currentCombat.onEnd('escape');
    }

    startBattle(worldId, locId, ambushType = null, providedEnemy = null) {
        const loc = getLocationById(worldId, locId);
        const enemy = providedEnemy || EnemyGenerator.generate(loc.dangerLevel || 1);
        
        state.currentCombat = new CombatEngine(
            state.player, 
            enemy, 
            (type, data) => this.screens.battle.render(type, data),
            (result) => {
                this.screens.battle.close();
                this.refreshUI();
            },
            ambushType
        );
        
        this.screens.battle.render('start');
        state.currentCombat.start();
    }

    openCrafting(type) {
        this.screens.systems.openCrafting(type);
    }



    openNPCDialogue(npcId) {
        const npc = state.systems.npc.npcs.find(n => n.id === npcId);
        if (!npc) return;
        
        // Dynamic Dialogue based on AI
        const dialogue = npc.generateDialogue(state.player);
        state.ui.alert(dialogue, npc.name);
    }

    openNPCGift(npcId) {
        const npc = state.systems.npc.npcs.find(n => n.id === npcId);
        if (!npc) return;

        // Tìm vật phẩm có thể tặng (ví dụ Linh Thạch hoặc Đan Dược)
        const giftItem = state.player.inventory.items.find(i => i.id.includes('ling_thach') || i.id.includes('dan'));
        
        if (!giftItem) {
            state.ui.toast("Ngươi không có vật phẩm nào giá trị để tặng.", "warning");
            return;
        }

        const itemName = giftItem.name || giftItem.id;
        state.ui.confirm(`Ngươi có muốn tặng 1x ${itemName} cho ${npc.name}?`, (confirmed) => {
            if (confirmed) {
                state.player.inventory.removeItem(giftItem.id, 1);
                npc.addMemory(giftItem.id.includes('thuong') ? 'gift_high' : 'gift_low');
                state.ui.toast(`Ngươi đã tặng ${itemName} cho ${npc.name}. Hảo cảm tăng lên!`, "success");
                if (window.npcScreen) window.npcScreen.render();
            }
        });
    }

    openNPCTrade(npcId) {
        const npc = state.systems.npc.npcs.find(n => n.id === npcId);
        if (!npc) return;

        state.currentNPC = npc;
        state.ui.toggleOverlay(document.getElementById('npc-trade-overlay'), true);
        
        // Update Header
        const elPortrait = document.getElementById('npc-trade-portrait');
        const elName = document.getElementById('npc-trade-name');
        if (elPortrait) elPortrait.src = npc.portrait;
        if (elName) elName.textContent = `${npc.title} ${npc.name}`;

        this.renderNPCTrade();
    }

    renderNPCTrade() {
        const npc = state.currentNPC;
        if (!npc) return;

        const elStock = document.getElementById('npc-trade-stock');
        const elPlayerInv = document.getElementById('player-trade-inventory');
        const elLingshi = document.getElementById('player-trade-lingshi');

        if (elLingshi) elLingshi.innerHTML = state.player.getFormattedLingShi();

        // Render NPC Stock
        if (elStock) {
            elStock.innerHTML = npc.inventory.length === 0 ? 
                '<div class="text-center py-10 text-gray-600 italic text-[10px]">Đạo hữu này không có vật phẩm gì để bán...</div>' :
                npc.inventory.map(item => {
                    const data = getItemById(item.id);
                    // Adjust price based on relationship and personality
                    let price = item.price;
                    if (npc.relationship > 50) price *= 0.8; // 20% discount for friends
                    if (npc.personalityIds.includes('tham_lam')) price *= 1.5; // 50% extra for greedy NPCs

                    return `
                        <div class="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center space-x-3 hover:bg-white/10 transition-all">
                            <div class="w-10 h-10 rounded-lg bg-black border border-white/10 flex items-center justify-center">
                                <i class="ph-package text-xl text-qi-blue"></i>
                            </div>
                            <div class="flex-1">
                                <div class="text-xs font-bold text-white">${data?.name || item.id}</div>
                                <div class="text-[9px] text-gray-500">Số lượng: ${item.quantity}</div>
                            </div>
                            <button class="px-4 py-2 bg-qi-blue/20 hover:bg-qi-blue/30 border border-qi-blue/30 rounded-lg text-[10px] font-bold text-qi-blue" 
                                onclick="window.game.buyNPCItem('${item.id}', ${price})">
                                ${price} Linh Thạch
                            </button>
                        </div>
                    `;
                }).join('');
        }

        // Render Player Inventory (Simple version: only tradable things)
        if (elPlayerInv) {
            const tradableItems = state.player.inventory.items.filter(i => !i.id.includes('ling_thach'));
            elPlayerInv.innerHTML = tradableItems.length === 0 ?
                '<div class="text-center py-10 text-gray-600 italic text-[10px]">Ngươi không có vật phẩm gì để bán...</div>' :
                tradableItems.map(item => {
                    const price = 50; // Simple flat sell price to NPC for now
                    return `
                        <div class="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center space-x-3 hover:bg-white/10 transition-all">
                            <div class="w-10 h-10 rounded-lg bg-black border border-white/10 flex items-center justify-center">
                                <i class="ph-package text-xl text-qi-jade"></i>
                            </div>
                            <div class="flex-1">
                                <div class="text-xs font-bold text-white">${item.name || item.id}</div>
                                <div class="text-[9px] text-gray-500">Số lượng: ${item.quantity}</div>
                            </div>
                            <button class="px-4 py-2 bg-qi-jade/20 hover:bg-qi-jade/30 border border-qi-jade/30 rounded-lg text-[10px] font-bold text-qi-jade" 
                                onclick="window.game.sellNPCItem('${item.id}', ${price})">
                                Bán: ${price} LT
                            </button>
                        </div>
                    `;
                }).join('');
        }
    }

    buyNPCItem(itemId, price) {
        const npc = state.currentNPC;
        if (!npc || !state.player.spendLingShi(price)) {
            state.ui.toast("Không đủ Linh Thạch!", "error");
            return;
        }

        const stockItem = npc.inventory.find(i => i.id === itemId);
        if (stockItem && stockItem.quantity > 0) {
            stockItem.quantity--;
            if (stockItem.quantity <= 0) {
                npc.inventory = npc.inventory.filter(i => i.id !== itemId);
            }
            state.player.inventory.addItem(itemId, 1);
            state.ui.toast(`Giao dịch thành công! Nhận được ${itemId}.`, "success");
            this.renderNPCTrade();
            this.refreshUI();
        }
    }

    sellNPCItem(itemId, price) {
        if (state.player.inventory.removeItem(itemId, 1)) {
            state.player.addLingShi(price);
            state.ui.toast(`Bán thành công! Nhận được ${price} Linh Thạch.`, "success");
            this.renderNPCTrade();
            this.refreshUI();
        }
    }

    socialAction(npcId, type) {
        const npc = state.systems.npc.npcs.find(n => n.id === npcId);
        if (!npc) return;

        if (type === 'dao_lu') {
            if (state.systems.social.proposeDaoLu(npc)) {
                if (window.npcScreen) window.npcScreen.render();
            }
        } else if (type === 'su_do') {
            if (state.systems.social.requestMentorship(npc)) {
                if (window.npcScreen) window.npcScreen.render();
            }
        } else if (type === 'double_cultivate') {
            state.systems.social.performDoubleCultivation();
            if (window.npcScreen) window.npcScreen.render();
        }
    }

    openNPC() {
        state.ui.toast('Hệ thống NPC đang được bảo trì...', 'info');
    }











    forge(recipeId) {
        if (state.systems.smithing) {
            const res = state.systems.smithing.forge(recipeId);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    craftPuppet(recipeId) {
        if (state.systems.puppet) {
            const res = state.systems.puppet.craft(recipeId);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    drawTalisman(recipeId) {
        if (state.systems.talisman) {
            const res = state.systems.talisman.draw(recipeId);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    activateFormation(diagramId) {
        if (state.systems.formation) {
            const res = state.systems.formation.activateFormation(diagramId);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    deactivateFormation(diagramId) {
        if (state.systems.formation) {
            const res = state.systems.formation.deactivateFormation(diagramId);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    hatchBeast(eggId) {
        if (state.systems.beast) {
            const res = state.systems.beast.hatch(eggId);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    feedBeast(uniqueId, foodId) {
        if (state.systems.beast) {
            const res = state.systems.beast.feed(uniqueId, foodId);
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

    // --- Creation Methods ---
    selectCreationRoot(id) {
        if (state.systems.creation) {
            state.systems.creation.selectedRoot = id;
            state.systems.creation.calculatePoints();
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    selectCreationPhysique(id) {
        if (state.systems.creation) {
            state.systems.creation.selectedPhysique = id;
            state.systems.creation.calculatePoints();
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    selectCreationOrigin(id) {
        if (state.systems.creation) {
            state.systems.creation.selectedOrigin = id;
            // Sync starting resources from origin
            const origin = CREATION_ORIGINS[id];
            if (origin) {
                state.systems.creation.startingLingShi = origin.resources.lingShi;
            }
            state.systems.creation.calculatePoints();
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    toggleCreationTrait(id) {
        if (state.systems.creation) {
            state.systems.creation.toggleTrait(id);
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    selectCreationGender(gender) {
        if (state.systems.creation) {
            state.systems.creation.playerGender = gender;
            state.systems.creation.playerAvatar = (gender === 'Nữ' ? 'player_female' : 'player_male');
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    selectCreationAvatar(avatarKey) {
        if (state.systems.creation) {
            state.systems.creation.playerAvatar = avatarKey;
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    selectCreationMode(mode) {
        if (state.systems.creation) {
            state.systems.creation.mode = mode === 'custom' ? 'custom' : 'custom';
            state.systems.creation.calculatePoints();
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    adjustStartingLingShi(amount) {
        if (state.systems.creation) {
            state.systems.creation.startingLingShi += amount;
            // Limit minimum to -10,000 (huge debt) and maximum to 1,000,000
            state.systems.creation.startingLingShi = Math.max(-10000, Math.min(1000000, state.systems.creation.startingLingShi));
            state.systems.creation.calculatePoints();
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    startCreationGame() {
        if (state.systems.creation) {
            const nameInput = document.getElementById('creation-name-input');
            if (nameInput) state.systems.creation.playerName = nameInput.value || "Phàm Nhân";
            
            const newPlayer = state.systems.creation.buildPlayer();
            if (newPlayer) {
                this.loadGame(newPlayer.save());
                state.ui.toast("Bắt đầu hành trình tu tiên!", "success");
            } else {
                state.ui.toast("Không đủ điểm Thiên Duyên!", "error");
            }
        }
    }


    openCrafting(type) {
        if (this.screens.systems) {
            this.screens.systems.openCrafting(type);
        }
    }

    openCraftingHub() {
        if (this.screens.systems) {
            this.screens.systems.openCraftingHub();
        }
    }

    cultivateTechnique(id, isSecret) {
        const result = state.systems.technique.cultivate(id, isSecret);
        if (result.success) {
            state.ui.toast(result.msg, 'success');
            this.screens.systems.renderTechniqueDetail(id, isSecret);
            state.player.calculateStats();
            state.ui.updateHUD();
        } else {
            state.ui.toast(result.msg, 'error');
        }
    }

    breakthroughTechnique(id, isSecret) {
        let success = false;
        let msg = "";

        if (isSecret) {
            const res = state.player.breakthroughSecretTechnique(id);
            success = res.success;
            msg = res.msg;
        } else {
            // Main technique breakthrough (if implemented)
            success = false;
            msg = "Công pháp này hiện chưa hỗ trợ đột phá tầng.";
        }

        if (success) {
            state.ui.toast(msg, 'success');
            this.screens.systems.renderTechniqueDetail(id, isSecret);
            state.player.calculateStats();
            state.ui.updateHUD();
        } else {
            state.ui.toast(msg || "Không thể đột phá!", 'warning');
        }
    }
}
