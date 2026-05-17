import { state } from './state.js';
import { Player } from './core/player.js';
import { SaveSystem } from './core/save-system.js';
import { UISystem } from './ui/ui-system.js';
import { ASSETS } from './configs/asset-data.js';
import { EnemyGenerator } from './core/enemy.js';
import { getLocationById } from './configs/map-data.js';
import { CombatEngine } from './core/combat-engine.js';
import { getItemById } from './configs/item-data.js';
import { Preferences } from '@capacitor/preferences';
import { getSectById } from './configs/sect-data.js';
import { getRealmById } from './configs/realm-data.js';
import { CREATION_SYSTEMS } from './configs/creation-data.js';

// Screens will be loaded dynamically
import { logger } from './utils/logger.js';
import { audioManager } from './utils/audio-manager.js';

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
import { TechniqueSystem } from './systems/technique-system.js';
import { CreationSystem } from './systems/creation-system.js';
import { EnergySystem } from './systems/energy-system.js';
import { SpiritStoneSystem } from './systems/spirit-stone-system.js';
import { PuppetSystem } from './systems/puppet-system.js';
import { TreasureSystem } from './systems/treasure-system.js';
import { NPCSystem } from './systems/npc-system.js';
import { SocialSystem } from './systems/social-system.js';
import { FateSystem } from './systems/fate-system.js';
import { MiningSystem } from './systems/mining-system.js';

import { MissionSystem } from './systems/MissionSystem.js';
import { MissionScreen } from './ui/screens/MissionScreen.js';
import { CheatSystem } from './systems/CheatSystem.js';
import { CheatSystemScreen } from './ui/screens/CheatSystemScreen.js';

export class Game {
    constructor() {
        window.game = this;
        this.handleDeath = this.handleDeath.bind(this);
        this.handleCombatEnd = this.handleCombatEnd.bind(this);
        this.startChase = this.startChase.bind(this);
        this.giveupChase = this.giveupChase.bind(this);
        this.audioManager = audioManager;
        this.screens = {};
    }

    async init() {
        await logger.init();

        state.ui = new UISystem();
        window.ui = state.ui;

        // Load Screens Dynamically
        const [
            { MapScreen }, { InventoryScreen }, { CharacterScreen }, { SystemsScreen },
            { BattleScreen }, { SpiritStoneUI }, { TreasureScreen }, { FateScreen },
            { StartScreen }, { SaveScreen }, { MiningScreen }, { DiHoaBangScreen },
            { DiLoiBangScreen }, { LinhTheLucScreen }, { PhapBaoLucScreen }, { ChungTocLucScreen },
            { KyTrungBangScreen }, { MissionScreen: MissionScreenImport }, { LootScreen }
        ] = await Promise.all([
            import('./ui/screens/MapScreen.js'),
            import('./ui/screens/InventoryScreen.js'),
            import('./ui/screens/CharacterScreen.js'),
            import('./ui/screens/SystemsScreen.js'),
            import('./ui/screens/BattleScreen.js'),
            import('./ui/spirit-stone-ui.js'),
            import('./ui/screens/TreasureScreen.js'),
            import('./ui/screens/FateScreen.js'),
            import('./ui/screens/StartScreen.js'),
            import('./ui/screens/SaveScreen.js'),
            import('./ui/screens/MiningScreen.js'),
            import('./ui/screens/DiHoaBangScreen.js'),
            import('./ui/screens/DiLoiBangScreen.js'),
            import('./ui/screens/LinhTheLucScreen.js'),
            import('./ui/screens/PhapBaoLucScreen.js'),
            import('./ui/screens/ChungTocLucScreen.js'),
            import('./ui/screens/KyTrungBangScreen.js'),
            import('./ui/screens/MissionScreen.js'),
            import('./ui/screens/LootScreen.js')
        ]);

        this.screens.map = new MapScreen();
        this.screens.inventory = new InventoryScreen();
        this.screens.character = new CharacterScreen();
        this.screens.systems = new SystemsScreen();
        this.screens.battle = new BattleScreen();
        this.screens.spiritStone = new SpiritStoneUI();
        this.screens.treasure = new TreasureScreen();
        this.screens.fate = new FateScreen(state.player, state.ui);
        this.screens.start = new StartScreen();
        this.screens.save = new SaveScreen();
        this.screens.mining = new MiningScreen();
        this.screens.diHoaBang = new DiHoaBangScreen();
        this.screens.diLoiBang = new DiLoiBangScreen();
        this.screens.linhTheLuc = new LinhTheLucScreen();
        this.screens.phapBaoLuc = new PhapBaoLucScreen();
        this.screens.chungTocLuc = new ChungTocLucScreen();
        this.screens.kyTrungBang = new KyTrungBangScreen();
        this.screens.mission = new MissionScreenImport();
        this.screens.loot = new LootScreen();
        this.screens.cheat = new CheatSystemScreen();

        state.systems.creation = new CreationSystem();

        const lastSlot = await SaveSystem.getLastSlot();
        
        if (lastSlot) {
            const savedData = await SaveSystem.load(lastSlot);
            if (savedData) {
                SaveSystem.currentSlot = lastSlot;
                await this.loadGame(savedData);
            } else {
                await this.showStartScreen();
            }
        } else {
            await this.showStartScreen();
        }

        this.startLoop();
        await this.initNavigation();
        this.initGlobalEvents();

        // Add global click sound
        document.addEventListener('click', (e) => {
            if (e.target.closest('button') || e.target.closest('.nav-item') || e.target.closest('.clickable')) {
                audioManager.playClick();
            }
        }, true);

        setInterval(async () => await this.saveGame(), 30000);
    }

    initGlobalEvents() {
        const portrait = document.getElementById('header-portrait-container');
        if (portrait) {
            let clickCount = 0;
            let lastClick = 0;
            portrait.addEventListener('click', () => {
                const now = Date.now();
                if (now - lastClick < 500) {
                    clickCount++;
                    if (clickCount >= 2) {
                        this.emergencyUIReset();
                        clickCount = 0;
                    }
                } else {
                    clickCount = 0;
                }
                lastClick = now;
            });
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
        if (cultivateBtn) cultivateBtn.onclick = () => {
            if (state.player.isSecluded) {
                state.ui.toast("Đang bế quan, không thể tu luyện tích cực!", "warning");
                return;
            }
            this.cultivate();
        };

        const breakthroughBtn = document.getElementById('breakthrough-btn');
        if (breakthroughBtn) breakthroughBtn.onclick = () => this.breakthrough();

        const autoCultivate = document.getElementById('auto-cultivate-toggle');
        if (autoCultivate) autoCultivate.onchange = (e) => this.toggleAutoCultivate(e.target.checked);

        const btnBattleCrush = document.getElementById('btn-battle-crush');
        if (btnBattleCrush) btnBattleCrush.onclick = () => this.playerCrushStone();

        const seclusionBtn = document.getElementById('seclusion-btn');
        if (seclusionBtn) seclusionBtn.onclick = () => {
            if (state.player.isSecluded) this.exitSeclusion();
            else this.enterSeclusion();
        };

        const btnOpenCheat = document.getElementById('btn-open-cheat-system');
        if (btnOpenCheat) btnOpenCheat.onclick = () => {
            if (this.screens.cheat) this.screens.cheat.open();
        };


        const muteBtn = document.getElementById('btn-toggle-mute');
        if (muteBtn) {
            muteBtn.onclick = async () => {
                const muted = await audioManager.toggleMute();
                this.updateMuteIcon(muted);
            };
            // Initial state
            this.updateMuteIcon(audioManager.isMuted);
        }

        this.bindPlaceholderButtons();
    }

    bindPlaceholderButtons() {
        const placeholderBinds = {
            'btn-npc-talk': { msg: 'Ngươi cố gắng bắt chuyện, nhưng vị đạo hữu này có vẻ đang nhập định sâu.', type: 'info' },
            'btn-npc-party': { msg: 'Tính năng kết bạn đồng hành đang được phát triển.', type: 'info' },
            'btn-npc-dual': { msg: 'Luận bàn đạo pháp hiện chưa khả dụng.', type: 'info' },
            'btn-npc-attack': { msg: 'Ngươi cảm nhận được sát khí, nhưng quy tắc trấn nhỏ ngăn cản việc động thủ.', type: 'warning' },
            'btn-npc-leave': { msg: 'NPC rời đi trong làn sương mù...', type: 'info' },
            'btn-reroll-destiny': { msg: 'Thiên mệnh đã định, không thể cưỡng cầu lúc này.', type: 'info' },
            'btn-confirm-destiny': { msg: 'Duyên phận đã kết nối với nhân gian.', type: 'success' }
        };

        Object.entries(placeholderBinds).forEach(([id, data]) => {
            const btn = document.getElementById(id);
            if (btn && !btn.onclick) {
                btn.onclick = () => {
                    state.ui.toast(data.msg, data.type);
                    if (id === 'btn-npc-attack') state.ui.screenShake('medium');
                };
            }
        });
    }

    async initNavigation() {
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
                btn.onclick = async () => {
                    await state.ui.switchScreen(screenId, btn);
                    if (screenId === 'screen-technique') {
                        this.screens.systems.renderTechniques(state.activeTechTab || 'cultivation');
                    } else if (screenId === 'screen-crafting-hub') {
                        this.screens.systems.renderCraftingHub();
                    } else if (screenId === 'screen-npc') {
                        if (window.npcScreen) window.npcScreen.render();
                    }
                };
            }
        });

        // Global UI events
        const elHeaderPortraitContainer = document.getElementById('header-portrait-container');
        if (elHeaderPortraitContainer) {
            elHeaderPortraitContainer.onclick = () => {
                const btnChar = document.getElementById('nav-character');
                state.ui.switchScreen('screen-character', btnChar);
            };
        }

        // Restore last screen if exists
        if (state.player) {
            const { value: savedScreen } = await Preferences.get({ key: 'mortal_quest_current_screen' });

            if (savedScreen && savedScreen !== 'screen-start' && savedScreen !== 'screen-creation') {
                const btnId = Object.keys(navMappings).find(key => navMappings[key] === savedScreen);
                const btn = document.getElementById(btnId);
                if (btn) {
                    await btn.onclick();

                    // If we are on adventure, ensure the sub-view is also restored
                    if (savedScreen === 'screen-adventure' && this.screens.map) {
                        await this.screens.map.restoreView();
                    }
                    this.initOverlayButtons();
                    return;
                }
            }

            // Default to main screen if no valid saved screen
            const mainBtn = document.getElementById('nav-main');
            if (mainBtn) await mainBtn.onclick();
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
            'close-stats-btn': 'stats-modal',
            'btn-close-guide': 'guide-overlay',
            'btn-guide-got-it': 'guide-overlay'
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

        const btnExplore = document.getElementById('btn-mountain-explore');
        if (btnExplore) btnExplore.onclick = () => this.mountainExplore();

        const btnDeeper = document.getElementById('btn-mountain-deeper');
        if (btnDeeper) btnDeeper.onclick = () => this.mountainDeeper();

        const btnRetreat = document.getElementById('btn-mountain-retreat');
        if (btnRetreat) btnRetreat.onclick = () => this.mountainRetreat();

        const btnAmbushStart = document.getElementById('btn-ambush-start');
        if (btnAmbushStart) btnAmbushStart.onclick = () => this.startAmbush();

        const btnAmbushEscape = document.getElementById('btn-ambush-escape');
        if (btnAmbushEscape) btnAmbushEscape.onclick = () => this.escapeAmbush();

        const btnChaseStart = document.getElementById('btn-chase-start');
        if (btnChaseStart) btnChaseStart.onclick = () => this.startChase();

        const btnChaseGiveup = document.getElementById('btn-chase-giveup');
        if (btnChaseGiveup) btnChaseGiveup.onclick = () => this.giveupChase();
    }

    // --- Core Lifecycle ---
    startLoop() {
        const loop = () => {
            if (state.player) {
                const now = Date.now();
                const delta = (now - state.player.lastUpdate) / 1000;
                this.update(delta);
                this.render();
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    update(delta) {
        state.player.update(delta, 1.0);
        
        // Handle Pending Events
        if (state.player.pendingEvents && state.player.pendingEvents.length > 0) {
            const events = [...state.player.pendingEvents];
            state.player.pendingEvents = [];
            
            events.forEach(ev => {
                if (ev.type === 'seclusion_event') {
                    state.ui.toast(ev.msg, ev.eventType === 'insight' ? 'success' : 'warning');
                } else if (ev.type === 'forced_breakthrough') {
                    state.ui.alert(ev.msg, ev.success ? 'Thiên Đạo Ban Ân' : 'Thiên Đạo Phạt Tội');
                }
            });
        }

        if (state.systems.time) state.systems.time.update(delta);
        if (state.systems.garden) state.systems.garden.update(delta);
        if (state.systems.mission) state.systems.mission.update();
        if (state.systems.mining) state.systems.mining.processTimeEvents(delta / 60); // minutes
        if (state.systems.mountain && state.systems.mountain.isActive) state.systems.mountain.update(delta);
        if (state.systems.npc && state.systems.time) state.systems.npc.update(delta, state.systems.time.totalMinutes);
        if (state.systems.social) state.systems.social.update(delta);
        if (state.systems.fate) state.systems.fate.checkTribulation();
        if (state.systems.treasure) state.systems.treasure.update(delta);

        if (state.player.hp <= 0) window.game.handleDeath();
    }

    render() {
        if (typeof window.renderMainStats === 'function') window.renderMainStats();
    }

    refreshUI() {
        if (!state.player) return;
        if (typeof window.renderMainStats === 'function') window.renderMainStats();
        this.screens.map.renderWorldList();
        this.screens.inventory.render();
        this.screens.character.render();

        if (this.screens.systems) {
            this.screens.systems.renderAlchemy();
            this.screens.systems.renderShop();
            this.screens.systems.renderMountain();
            this.screens.systems.renderSects();
            this.screens.systems.renderGuild();
            this.screens.systems.renderTower();
        }
        if (this.screens.spiritStone) this.screens.spiritStone.render();
        if (this.screens.mining) this.screens.mining.render();

        // Update Cheat System button
        const elSystemContainer = document.getElementById('main-cheat-system-container');
        if (elSystemContainer) {
            const hasCheat = state.player && !!state.player.cheatSystemId;
            elSystemContainer.classList.toggle('hidden', !hasCheat);
            if (hasCheat) {
                const elSystemName = document.getElementById('main-cheat-system-name');
                if (elSystemName) {
                    const sysConfig = (CREATION_SYSTEMS || []).find(s => s.id === state.player.cheatSystemId);
                    elSystemName.textContent = sysConfig ? sysConfig.name : 'Hệ Thống Bàn Tay Vàng';
                }
            }
        }
    }


    // --- Persistence ---
    async saveGame() {
        if (state.player) {
            state.player.currentWorldId = state.currentWorldId;
            state.player.currentLocId = state.currentLocId;
            state.player.explorationProgress = state.explorationProgress;
            const data = state.player.save();
            if (state.systems.time) data.time = state.systems.time.save();
            if (state.systems.npc) data.npcData = state.systems.npc.saveData();
            if (state.systems.social) data.socialData = state.systems.social.getData();
            if (state.systems.cheat) data.cheat = state.systems.cheat.save();
            if (state.systems.mountain) {
                data.mountain = {
                    discovery: state.systems.mountain.discovery,
                    bossDefeated: state.systems.mountain.bossDefeated,
                    reputation: state.systems.mountain.reputation,
                    currentLayer: state.systems.mountain.currentLayer
                };
            }

            const metadata = {
                name: state.player.name,
                realm: state.player.getCurrentRealm().name,
                realmId: state.player.realmId,
                age: state.player.age,
                area: state.currentLocId || 'Thanh Vân Trấn',
                playTime: state.player.playTime || 0,
                avatar: state.player.avatar || 'player_male',
                updatedAt: Date.now()
            };

            await SaveSystem.save(SaveSystem.currentSlot, data, metadata);
            await SaveSystem.setLastSlot(SaveSystem.currentSlot);
        }
    }

    async loadGame(savedData) {
        state.player = new Player();
        state.player.load(savedData);

        // SYNC STATE IMMEDIATELY
        state.currentWorldId = state.player.currentWorldId || 'nhan_gioi';
        state.currentLocId = state.player.currentLocId || 'thanh_van_tran';
        state.explorationProgress = state.player.explorationProgress || 0;

        state.ui.resetUIState();
        this.initSystems(state.player, savedData);

        const nonGameScreens = ['screen-creation', 'screen-start', 'screen-save'];
        nonGameScreens.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });

        const elementsToShow = ['header', '#time-hud', 'nav'];
        elementsToShow.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.classList.remove('hidden');
        });

        // Ensure we don't restore to a start/creation screen after loading
        const { value: currentStoredScreen } = await Preferences.get({ key: 'mortal_quest_current_screen' });
        
        // Fix: If we are in a boot state or no screen saved, default to main
        if (!currentStoredScreen || ['screen-start', 'screen-creation', 'screen-save'].includes(currentStoredScreen)) {
            await Preferences.set({ key: 'mortal_quest_current_screen', value: 'screen-main' });
            state.ui.switchScreen('screen-main', document.getElementById('nav-main'));
        } else {
            // If we have a stored screen, switch to it (useful for startCreationGame)
            state.ui.switchScreen(currentStoredScreen, document.querySelector(`.nav-item[onclick*="${currentStoredScreen}"]`));
        }

        await SaveSystem.setLastSlot(SaveSystem.currentSlot);

        audioManager.playBgm('main');
        this.refreshUI();
    }

    async loadSlot(slot) {
        const savedData = await SaveSystem.load(slot);
        if (savedData) {
            SaveSystem.currentSlot = slot;
            await this.loadGame(savedData);
        } else {
            state.ui.toast(`Không tìm thấy dữ liệu ở Slot ${slot}`, 'error');
        }
    }

    async saveAndExit() {
        if (!state.player) return;
        await this.saveGame();
        if (state.autoCultivateInterval) {
            clearInterval(state.autoCultivateInterval);
            state.autoCultivateInterval = null;
        }
        state.player = null;
        await SaveSystem.setLastSlot(null);
        await this.showStartScreen();
        audioManager.playBgm('start');
        state.ui.toast('Đã lưu và thoát về màn hình chính', 'success');
    }

    async startNewAtSlot(slot) {
        const metadata = await SaveSystem.getAllMetadata();
        if (metadata[slot]) {
            const confirmed = await state.ui.confirm(`Ô lưu số ${slot} đã có dữ liệu. Ngươi có chắc muốn xóa bỏ hành trình cũ để bắt đầu lại từ đầu không?`, 'Xác Nhận Ghi Đè');
            if (!confirmed) return;
        }
        SaveSystem.currentSlot = slot;
        this.showCreationScreen();
    }

    async deleteSlot(slot) {
        const confirmed = await state.ui.confirm(`Ngươi có chắc muốn xóa bỏ đạo quả ở ô lưu số ${slot}? Hành động này không thể hoàn tác!`, 'Cảnh Báo Diệt Môn');
        if (confirmed) {
            await SaveSystem.deleteSave(slot);
            await this.screens.save.render();
            state.ui.toast(`Đã xóa dữ liệu ở ô số ${slot}`, 'info');
        }
    }

    showSaveMenu(slot) {
        const options = [
            { label: 'Tiếp Tục Chơi', value: 'load', icon: 'ph-play' },
            { label: 'Đổi Tên Nhân Vật', value: 'rename', icon: 'ph-pencil' },
            { label: 'Xóa Dữ Liệu', value: 'delete', icon: 'ph-trash' },
            { label: 'Sao Lưu (Backup)', value: 'backup', icon: 'ph-copy' },
            { label: 'Thống Kê Chi Tiết', value: 'stats', icon: 'ph-chart-bar' }
        ];

        state.ui.promptOptions('Lựa Chọn Hành Trình', options, `Quản lý ô lưu số ${slot}`)
            .then(async action => {
                if (action === 'load') await this.loadSlot(slot);
                else if (action === 'delete') await this.deleteSlot(slot);
                else if (action === 'rename') {
                    const newName = prompt('Nhập tên mới:');
                    if (newName) {
                        await SaveSystem.renameSave(slot, newName);
                        await this.screens.save.render();
                    }
                } else if (action === 'backup') {
                    state.ui.toast('Tính năng sao lưu đám mây đang được phát triển.', 'info');
                } else if (action === 'stats') {
                    state.ui.toast('Tính năng xem thống kê chi tiết đang được phát triển.', 'info');
                }
            });
    }

    // --- Systems Initialization ---
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
            social: new SocialSystem(),
            fate: new FateSystem(player, state.ui),
            mining: new MiningSystem(player, state.ui),
            mission: new MissionSystem(),
            cheat: new CheatSystem(player, state.ui)
        });

        state.systems.mission.init();
        state.systems.cheat.init();

        this.screens.fate.player = player;

        if (savedData) {
            if (savedData.npcData) state.systems.npc.loadData(savedData.npcData);
            if (savedData.socialData) state.systems.social.loadData(savedData.socialData);
            if (savedData.time) state.systems.time.load(savedData.time);
            if (savedData.cheat) state.systems.cheat.load(savedData.cheat);
            if (savedData.mountain) {
                state.systems.mountain.discovery = savedData.mountain.discovery || {};
                state.systems.mountain.bossDefeated = savedData.mountain.bossDefeated || {};
                state.systems.mountain.reputation = savedData.mountain.reputation || 0;
                state.systems.mountain.currentLayer = savedData.mountain.currentLayer || 'chan_nui';
            }
        } else {
            state.systems.npc.generate('tan_tu', 1, 'thanh_van_tran');
            state.systems.npc.generate('thuong_nhan', 3, 'thanh_van_tran');
            state.systems.npc.generate('sect_elder', 10, 'thanh_van_tong');
            state.systems.npc.generate('thien_kieu', 5, 'linh_vong_son');
        }

        const elName = document.getElementById('player-name-header');
        if (elName) elName.textContent = player.name;

        const portraitKey = player.avatar || (player.gender === 'Nữ' ? 'player_female' : 'player_male');
        const portraitUrl = ASSETS.portraits[portraitKey];

        const elPortrait = document.getElementById('header-portrait');
        if (elPortrait) elPortrait.src = portraitUrl;

        const mainPortrait = document.getElementById('main-player-portrait');
        if (mainPortrait) mainPortrait.src = portraitUrl;

        const charPortrait = document.querySelector('#screen-character img');
        if (charPortrait) charPortrait.src = portraitUrl;

        if (player.currentWorldId) {
            state.currentWorldId = player.currentWorldId;
            state.currentLocId = player.currentLocId;
            state.explorationProgress = player.explorationProgress || 0;
        }
    }

    // --- Character Actions ---
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

        if (result.success && result.gain > 0) {
            const btn = document.getElementById('cultivate-btn');
            if (btn) {
                state.ui.showStatUpEffect(btn, `+${Math.floor(result.gain)} ${result.type === 'tuvi' ? 'Tu Vi' : (result.type === 'body' ? 'Khí Huyết' : 'Thần Niệm')}`);
                
                // Spawn particles from center of portrait to outward
                const portrait = document.getElementById('aura-border');
                if (portrait) {
                    const rect = portrait.getBoundingClientRect();
                    const appRect = document.getElementById('app').getBoundingClientRect();
                    const centerX = rect.left - appRect.left + rect.width / 2;
                    const centerY = rect.top - appRect.top + rect.height / 2;
                    
                    const count = state.player.isSecluded ? 5 : 15;
                    const particleColor = result.type === 'tuvi' ? '#4FD1C5' : (result.type === 'body' ? '#F87171' : '#A78BFA');
                    
                    state.ui.spawnQiParticles(centerX, centerY, count, particleColor);
                }
            }
        }

        if (typeof window.renderMainStats === 'function') window.renderMainStats();
        this.refreshUI();
    }

    async breakthrough() {
        if (!state.player) return;
        const focus = state.player.cultivationFocus || 'tuvi';
        const result = state.player.breakthrough(focus);
        if (result && result.msg) state.ui.toast(result.msg, result.success ? 'success' : 'error');
        if (result && result.success) {
            state.ui.showBreakthroughEffect(state.player.getCurrentRealm(focus).name);
            await this.saveGame();
        }
        this.refreshUI();
    }

    setCultivationFocus(focus) {
        if (!state.player || !['tuvi', 'body', 'soul'].includes(focus)) return;
        state.player.cultivationFocus = focus;
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

    async enterSeclusion() {
        if (!state.player) return;
        if (state.player.isSecluded) return;

        const options = [
            { label: 'Bế quan 1 năm', value: 1, icon: 'ph-moon' },
            { label: 'Bế quan 10 năm', value: 10, icon: 'ph-moon-stars' },
            { label: 'Bế quan 50 năm', value: 50, icon: 'ph-stars' },
            { label: 'Bế quan 100 năm', value: 100, icon: 'ph-yin-yang' }
        ];

        const durationYears = await state.ui.promptOptions(
            "Định Hình Bế Quan",
            options,
            "Ngươi muốn bế quan trong bao lâu? Trong thời gian này, tu vi sẽ tăng trưởng vượt bậc nhưng thọ nguyên cũng sẽ cạn kiệt tương ứng."
        );

        if (!durationYears) return;

        // Calculate total minutes: 12 months * 30 days * 12 hours = 4320 mins/year
        const totalMinutes = durationYears * 4320;
        
        // Calculate expected tuvi gain
        // Seclusion gives 5x multiplier. delta is not available here, so we simulate 1s intervals
        // Player.js: tuViGain = tuViPerSecond * focusMult * finalMultiplier * delta
        // finalMultiplier = multiplier * stabilityMult * compMult * seclusionMult(5.0)
        
        // Simplified calculation for summary:
        const focus = state.player.cultivationFocus || 'tuvi';
        const rate = focus === 'tuvi' ? state.player.tuViPerSecond : (focus === 'body' ? state.player.bodyExpPerSecond : state.player.soulExpPerSecond);
        const baseGainPerMins = rate * 60; // Rate is per second, but let's assume 1 min game = 1s real for calculation
        const seclusionMult = 5.0;
        const totalGain = baseGainPerMins * totalMinutes * seclusionMult * (1 + (state.player.comprehension / 100));

        const confirm = await state.ui.confirm(
            `Ngươi chắc chắn muốn bế quan ${durationYears} năm? Dự kiến tu vi sẽ tăng thêm khoảng ${Math.floor(totalGain).toLocaleString()} điểm.`,
            "Xác Nhận Nhập Định"
        );

        if (!confirm) return;

        state.ui.showLoading(true, "Đang thâm tầng định cảnh...");
        
        // Advance time
        if (state.systems.time) {
            state.systems.time.skipTime(totalMinutes);
        }

        // Apply gain to player (TimeSystem.advanceTime handles age, but we need to apply TuVi manually or through skip logic)
        // Since we don't have a fast-forward simulation of every second, we apply a bulk gain
        state.player.tuVi += (focus === 'tuvi' ? totalGain : totalGain * 0.2);
        state.player.bodyExp += (focus === 'body' ? totalGain : totalGain * 0.2);
        state.player.soulExp += (focus === 'soul' ? totalGain : totalGain * 0.2);

        // Check for breakthroughs during seclusion
        state.player.isSecluded = true; // Temporary set to true for trigger check
        for (let i = 0; i < durationYears; i++) {
            if (Math.random() < 0.1) state.player.triggerSeclusionEvent();
        }
        state.player.isSecluded = false;

        setTimeout(() => {
            state.ui.showLoading(false);
            state.ui.alert(
                `Sau ${durationYears} năm bế quan khổ tu, ngươi đã xuất quan. Tuổi hiện tại: ${state.player.age}. Tu vi tinh tiến vượt bậc!`,
                "Xuất Quan Đại Cát"
            );
            this.refreshUI();
            this.saveGame();
        }, 2000);
    }

    exitSeclusion() {
        if (!state.player) return;
        if (!state.player.isSecluded) return;
        state.player.isSecluded = false;
        state.ui.toast("Ngươi đã xuất quan, cảm thấy tu vi có chút tinh tiến.", "info");
        this.refreshUI();
    }

    refine(itemId) {
        if (!state.player) return;
        const result = state.player.refineSpiritStone(itemId);
        if (result.success) {
            state.ui.toast(result.msg, 'success');
            const btn = document.querySelector(`[onclick*="refine('${itemId}')"]`);
            if (btn) state.ui.showStatUpEffect(btn, `+${Math.floor(result.gain)} Tu Vi`, 'text-cyan-400');
            this.refreshUI();
        } else {
            state.ui.toast(result.msg, 'error');
        }
    }

    handleDeath(reason = "Ngươi đã vẫn lạc...") {
        if (state.isDead) return;
        state.isDead = true;

        const source = this.getRebirthProtectionSource();
        if (source && this.consumeRebirthProtection(source)) {
            // Rebirth logic
            state.player.hp = Math.max(1, Math.floor(state.player.maxHp * 0.2));
            state.player.mana = Math.floor(state.player.maxMana * 0.1);
            
            // If it was age death, give some bonus years
            if (state.player.age >= state.player.maxAge) {
                state.player.age = Math.max(0, state.player.maxAge - 10); // Extend 10 years
            }

            state.isDead = false;
            state.ui.toast('Ngươi đã chết, nhưng nhờ thủ đoạn bảo mệnh/trùng sinh nên thoát kiếp.', 'warning', 7000);
            this.refreshUI();
            return;
        }
        this.restartFromDeath(reason);
    }

    async restartFromDeath(reason = null) {
        const quotes = [
            "Tu vi cả đời hóa thành hư không, mây khói tan biến...",
            "Trăm năm tu đạo, một sớm thành không.",
            "Cát bụi lại trở về với cát bụi.",
            "Hồng trần cuồn cuộn, mệnh số đã tận."
        ];
        const quote = reason || quotes[Math.floor(Math.random() * quotes.length)];
        
        await state.ui.showDeathScreen(quote);
        
        await SaveSystem.deleteSave(SaveSystem.currentSlot);
        state.player = null;
        state.currentCombat = null;
        state.currentLocId = null;
        state.explorationProgress = 0;
        
        // Return to start screen instead of reload
        await Preferences.remove({ key: 'mortal_quest_current_screen' });
        await SaveSystem.setLastSlot(null);
        
        // Reset App state
        const elementsToHide = ['header', '#time-hud', 'nav', '.overlay-full', '.screen'];
        elementsToHide.forEach(s => {
            const els = document.querySelectorAll(s);
            els.forEach(el => el.classList.add('hidden'));
        });
        
        await this.showStartScreen();
        audioManager.playBgm('start');
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
        if (source.type === 'technique') return true;
        return false;
    }

    // --- World & Navigation Actions ---
    openShop(view, shopId = null, section = null) {
        if (state.systems.shop) {
            state.views.shop = view || 'buy';
            if (shopId) state.systems.shop.currentShopId = shopId;
            if (section) state.systems.shop.currentSection = section;
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

    openMining() {
        if (this.screens.mining) this.screens.mining.render();
        state.ui.switchScreen('screen-mining', null);
    }

    // --- System Actions ---
    buyItem(itemId, quantity = 1) {
        if (state.systems.shop) {
            const res = state.systems.shop.buyItem(itemId, quantity);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    sellItem(itemId, quantity = 1) {
        if (state.systems.shop) {
            const res = state.systems.shop.sellItem(itemId, quantity);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
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

    mineManual(nodeId) {
        if (state.systems.mining) {
            const res = state.systems.mining.mineManual(nodeId);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    occupyNode(nodeId) {
        if (state.systems.mining) {
            const res = state.systems.mining.occupyNode(nodeId);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    claimMiningResources(nodeId) {
        if (state.systems.mining) {
            const res = state.systems.mining.claimResources(nodeId);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    abandonNode(nodeId) {
        state.ui.confirm('Ngươi có chắc muốn từ bỏ linh mạch này? Tất cả sản lượng chưa thu thập sẽ biến mất!', 'Xác Nhận')
            .then(confirmed => {
                if (confirmed && state.systems.mining) {
                    const res = state.systems.mining.abandonNode(nodeId);
                    state.ui.toast(res.msg, res.success ? 'info' : 'error');
                    this.refreshUI();
                }
            });
    }

    playerCrushStone() {
        if (state.player) {
            const stones = state.player.inventory.allItems.filter(i => {
                const data = getItemById(i.id);
                return data && data.type === 'spirit_stone';
            });
            if (stones.length === 0) {
                state.ui.toast('Ngươi không có Linh Thạch để bóp nát!', 'error');
                return;
            }
            const stoneToCrush = stones[0];
            const res = state.player.crushStone(stoneToCrush.id, 1);
            if (res.success) {
                state.ui.toast(res.msg, 'success');
                if (state.currentCombat && state.currentCombat.engine) {
                    state.currentCombat.engine.doAction('spirit_stone');
                }
            } else {
                state.ui.toast(res.msg, 'error');
            }
            this.refreshUI();
        }
    }

    upgradeField(index) {
        if (state.systems.garden) {
            const res = state.systems.garden.upgradeField(index);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            if (res.success) this.showFieldMenu(index);
            this.refreshUI();
        }
    }

    resetField(index) {
        if (state.systems.garden) {
            state.ui.confirm('Ngươi có chắc muốn nhổ bỏ linh thảo này?', 'Xác Nhận')
                .then(confirmed => {
                    if (confirmed) {
                        state.systems.garden.resetPlot(index);
                        state.ui.toast('Đã dọn dẹp ô đất.', 'info');
                        this.refreshUI();
                    }
                });
        }
    }

    showPlantMenu(index) {
        const seeds = state.player.inventory.allItems.filter(i => i.id.startsWith('seed_'));
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

    async craft(recipeId) {
        if (state.systems.alchemy) {
            const res = await state.systems.alchemy.craft(recipeId);
            if (!res.success) state.ui.toast(res.msg, 'error');
            this.refreshUI();
        }
    }

    async harvest(index) {
        if (state.systems.garden) {
            const res = state.systems.garden.harvest(index);
            if (!res.success) state.ui.toast(res.msg, 'error');
            this.refreshUI();
        }
    }

    async drawTalisman(typeId) {
        if (state.systems.talisman) {
            const res = await state.systems.talisman.draw(typeId);
            if (!res.success) state.ui.toast(res.msg, 'error');
            this.refreshUI();
        }
    }

    async forge(typeId) {
        if (state.systems.smithing) {
            const res = await state.systems.smithing.forge(typeId);
            if (!res.success) state.ui.toast(res.msg, 'error');
            this.refreshUI();
        }
    }

    craftPuppet(typeId) {
        if (state.systems.puppet) {
            const res = state.systems.puppet.craft(typeId);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    activateFormation(id) {
        if (state.systems.formation) {
            const res = state.systems.formation.activate(id);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    deactivateFormation(id) {
        if (state.systems.formation) {
            const res = state.systems.formation.deactivate(id);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    openCrafting(type) {
        if (this.screens.systems) this.screens.systems.openCrafting(type);
    }

    openCraftingHub() {
        if (this.screens.systems) this.screens.systems.openCraftingHub();
    }

    cultivateTechnique(id, isSecret) {
        if (state.systems.technique) {
            const res = state.systems.technique.cultivate(id, isSecret);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            if (res.success) {
                this.screens.systems.renderTechniqueDetail(id, isSecret);
                state.player.calculateStats();
            }
            this.refreshUI();
        }
    }

    breakthroughTechnique(id, isSecret) {
        if (state.systems.technique) {
            const res = state.systems.technique.breakthrough(id, isSecret);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            if (res.success) {
                this.screens.systems.renderTechniqueDetail(id, isSecret);
                state.player.calculateStats();
            }
            this.refreshUI();
        }
    }

    setMainTechnique(id) {
        if (state.player) {
            const success = state.player.setMainTechnique(id);
            if (success) {
                state.ui.toast("Đã thiết lập làm Công Pháp Chủ Tu!", "success");
                if (this.screens.systems) {
                    this.screens.systems.renderTechniqueDetail(id, false);
                }
            } else {
                state.ui.toast("Không thể thiết lập Công Pháp này!", "error");
            }
            this.refreshUI();
        }
    }

    // --- Combat Actions ---
    startBattle(enemy, ambushType = null, onEndOverride = null) {
        if (!state.player || !enemy) return;
        state.currentCombat = new CombatEngine(
            state.player,
            enemy,
            (type, data) => this.screens.battle.render(type, data),
            (result) => {
                if (typeof onEndOverride === 'function') onEndOverride(result === 'win');
                this.handleCombatEnd(result);
            },
            ambushType
        );
        state.ui.switchScreen('battle', null);
        this.screens.battle.render('start');
        state.currentCombat.start();
    }

    handleCombatEncounter(worldId, locId, onEnd = null) {
        const loc = getLocationById(worldId, locId);
        const enemy = EnemyGenerator.generate(loc?.dangerLevel || 1);
        this.pendingEncounter = { worldId, locId, enemy, onEnd };

        const playerPerc = state.player.advancedStats.perception || 5;
        const enemyPerc = enemy.perception || 5;
        const roll = Math.random() * 10 - 5;

        if (playerPerc > enemyPerc + roll) {
            const elDesc = document.getElementById('ambush-desc');
            if (elDesc) elDesc.textContent = `Thần thức nhạy bén giúp ngươi phát hiện một con ${enemy.name} đang ẩn nấp phía trước. Ngươi có muốn tập kích nó không?`;
            state.ui.toggleOverlay(document.getElementById('ambush-overlay'), true);
        } else if (enemyPerc > playerPerc + (Math.random() * 10)) {
            state.ui.toast(`Ngươi bị một con ${enemy.name} tập kích bất ngờ!`, 'error');
            setTimeout(() => this.startBattle(enemy, null, onEnd), 1000);
        } else {
            this.startBattle(enemy, null, onEnd);
        }
    }

    resolveInitialCombatPhase(type) {
        if (!state.currentCombat) return;
        if (type === 'attack') {
            if (state.currentCombat.resolveInitialPhase) state.currentCombat.resolveInitialPhase('attack');
            this.refreshUI();
        } else if (type === 'evade') {
            const success = state.currentCombat.resolveInitialPhase?.('evade');
            if (success) {
                state.ui.toast("Ngươi đã né tránh thành công!", "success");
                state.currentCombat = null;
                state.ui.switchScreen('screen-adventure', null);
            }
            this.refreshUI();
        }
    }

    async handleCombatEnd(result) {
        if (result === 'win') {
            const combat = state.currentCombat;
            if (combat?.enemy) {
                // Collect all loot to show in one flashy popup if needed
                const loot = combat.enemy.inventory || [];
                for (const item of loot) {
                    await window.game.receiveItem(item.id, item.quantity);
                }
                const tuvi = combat.enemy.realmId * 50;
                state.player.addTuVi(tuvi);
                state.ui.toast(`Chiến thắng! Nhận được ${tuvi} Tu Vi.`, 'success');
            }
        } else if (result === 'lose') {
            window.game.handleDeath();
        }
        
        if (this.screens.battle) {
            this.screens.battle.close();
        }
        
        state.currentCombat = null;
        state.ui.switchScreen('screen-adventure', null);
        this.refreshUI();
    }

    startAmbush() {
        if (!this.pendingEncounter) return;
        state.ui.toggleOverlay(document.getElementById('ambush-overlay'), false);
        const successChance = 0.6 + ((state.player.advancedStats.perception || 5) / 100);
        const { enemy, onEnd } = this.pendingEncounter;
        if (Math.random() < successChance) {
            this.startBattle(enemy, 'player', onEnd);
        } else {
            state.ui.toast("Tập kích thất bại! Ngươi đã bị đối phương phát hiện.", "warning");
            this.startBattle(enemy, null, onEnd);
        }
        this.pendingEncounter = null;
    }

    escapeAmbush() {
        state.ui.toggleOverlay(document.getElementById('ambush-overlay'), false);
        state.ui.toast("Ngươi lặng lẽ lách mình qua kẻ địch, tránh được một cuộc chiến.", "info");
        this.pendingEncounter = null;
        this.refreshUI();
    }

    startChase() {
        if (state.currentCombat) {
            state.ui.toggleOverlay(document.getElementById('chase-overlay'), false);
            state.currentCombat.chaseEnemy?.();
        }
    }

    giveupChase() {
        if (state.currentCombat) {
            state.ui.toggleOverlay(document.getElementById('chase-overlay'), false);
            state.ui.toast("Ngươi quyết định không đuổi theo, kẻ địch đã trốn thoát thành công.", "info");
            state.currentCombat.onEnd?.('escape');
        }
    }

    startSpecialCombat(type, intensity) {
        if (type === 'heavenly_lightning') {
            const enemy = {
                id: 'heavenly_lightning',
                name: 'Thiên Kiếp Lôi Phạt',
                realmId: state.player.realmId + 2,
                hp: 5000 + (intensity * 2),
                maxHp: 5000 + (intensity * 2),
                atk: 100 + (intensity / 10),
                def: 50,
                spd: 150,
                skills: [{ name: 'Cửu Thiên Thần Lôi', damage: 2.0, type: 'thunder' }]
            };
            this.startBattle(enemy);
        }
    }

    // --- NPC Actions ---
    openNPC(npcId) {
        const npc = state.systems.npc?.getNPC(npcId);
        if (npc) this.openNPCDialogue(npc);
    }

    openNPCDialogue(npc) {
        if (this.screens.systems) {
            this.screens.systems.renderNPCDialogue(npc);
            state.ui.switchScreen('systems', null);
        }
    }

    openNPCGift(npcId) {
        state.systems.social?.openGiftMenu(npcId);
    }

    openNPCTrade(npcId) {
        if (state.systems.shop) {
            state.systems.shop.openNPCTrade(npcId);
            state.currentNPC = state.systems.npc?.getNPC(npcId);
            state.ui.toggleOverlay(document.getElementById('npc-trade-overlay'), true);
            this.renderNPCTrade();
        }
    }

    renderNPCTrade() {
        if (this.screens.systems) this.screens.systems.renderNPCTrade();
    }

    buyNPCItem(itemId) {
        if (state.systems.shop) {
            const res = state.systems.shop.buyNPCItem(itemId);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.renderNPCTrade();
            this.refreshUI();
        }
    }

    sellNPCItem(itemId) {
        if (state.systems.shop) {
            const res = state.systems.shop.sellNPCItem(itemId);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.renderNPCTrade();
            this.refreshUI();
        }
    }

    socialAction(npcId, actionType) {
        if (state.systems.social) {
            const res = state.systems.social.performAction(npcId, actionType);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            if (this.screens.systems && state.activeSystemTab === 'npc') {
                const npc = state.systems.npc.getNPC(npcId);
                if (npc) this.openNPCDialogue(npc);
            }
            this.refreshUI();
        }
    }

    updateMuteIcon(muted) {
        const icon = document.getElementById('mute-icon');
        if (icon) {
            icon.className = muted ? 'ph ph-speaker-slash' : 'ph ph-speaker-high';
        }
        
        const startIcon = document.getElementById('btn-start-settings');
        if (startIcon) {
            startIcon.className = (muted ? 'ph ph-speaker-slash' : 'ph ph-speaker-high') + ' hover:text-cultivation-gold cursor-pointer transition-all hover:scale-125 drop-shadow-md';
            startIcon.title = muted ? 'Bật âm thanh' : 'Tắt âm thanh';
        }
    }

    // --- Utility ---
    emergencyUIReset() {
        console.warn('--- EMERGENCY UI RESET TRIGGERED ---');
        state.ui?.logActiveOverlays();
        state.ui?.showLoading(false);
        const overlays = ['shop-overlay', 'guild-overlay', 'mountain-overlay', 'tower-overlay', 'sects-overlay', 'modal-overlay', 'battle-overlay', 'spirit-stone-overlay', 'item-detail', 'chase-overlay', 'guide-overlay'];
        overlays.forEach(id => {
            const el = document.getElementById(id);
            if (el) state.ui.toggleOverlay(el, false);
        });
        document.body.classList.remove('overflow-hidden');
        state.ui?.toast('Đã hoàn tác giao diện khẩn cấp!', 'success');
    }

    async showStartScreen() {
        state.ui.switchScreen('screen-start');
        await this.screens.start.render();
        audioManager.playBgm('start');
        ['header', '#time-hud', 'nav'].forEach(s => document.querySelector(s)?.classList.add('hidden'));
    }

    showCreationScreen() {
        state.ui.switchScreen('screen-creation');
        ['header', '#time-hud', 'nav'].forEach(s => document.querySelector(s)?.classList.add('hidden'));
        if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
    }

    selectCreationMode(mode) {
        if (state.systems.creation) {
            state.systems.creation.mode = mode;
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    selectCreationAvatar(avatar) {
        if (state.systems.creation) {
            state.systems.creation.playerAvatar = avatar;
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    selectCreationGender(gender) {
        if (state.systems.creation) {
            state.systems.creation.playerGender = gender;
            // Also update avatar to match gender
            state.systems.creation.playerAvatar = gender === 'Nam' ? 'player_male' : 'player_female';
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    selectCreationRace(raceId) {
        if (state.systems.creation) {
            state.systems.creation.selectedRace = raceId;
            state.systems.creation.calculatePoints();
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    selectCreationRoot(rootId) {
        if (state.systems.creation) {
            state.systems.creation.selectRoot(rootId);
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    selectCreationRootTab(tab) {
        if (state.systems.creation) {
            state.systems.creation.rootTab = tab;
            state.systems.creation.resetProportions();
            state.systems.creation.calculatePoints();
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    selectCreationMutatedElement(element) {
        if (state.systems.creation) {
            state.systems.creation.selectedRoot = 'di_linh_can';
            state.systems.creation.selectedRootElements = [element];
            state.systems.creation.selectedRootElementProportions = { [element]: 100 };
            state.systems.creation.calculatePoints();
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    toggleCreationRootElement(element) {
        if (state.systems.creation) {
            state.systems.creation.toggleRootElement(element);
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    adjustCreationRootProportion(element, value) {
        if (state.systems.creation) {
            if (state.systems.creation.rootTab === 'normal') {
                state.systems.creation.adjustNormalElementProportion(element, value);
            } else {
                state.systems.creation.adjustElementProportion(element, value);
            }
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    selectCreationPhysique(physId) {
        if (state.systems.creation) {
            state.systems.creation.selectedPhysique = physId;
            state.systems.creation.calculatePoints();
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    selectCreationOrigin(originId) {
        if (state.systems.creation) {
            state.systems.creation.selectOrigin(originId);
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    selectCreationCheatSystem(systemId) {
        if (state.systems.creation) {
            state.systems.creation.selectCheatSystem(systemId);
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }


    selectCreationArtifact(artifactId) {
        if (state.systems.creation) {
            state.systems.creation.selectArtifact(artifactId);
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    toggleCreationTrait(traitId) {
        if (state.systems.creation) {
            state.systems.creation.toggleTrait(traitId);
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    adjustStartingLingShi(amount) {
        if (state.systems.creation) {
            state.systems.creation.startingLingShi = Math.max(0, state.systems.creation.startingLingShi + amount);
            state.systems.creation.calculatePoints();
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    rerollCreationTalents() {
        if (state.systems.creation) {
            state.systems.creation.rerollTalents();
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    async startCreationGame() {
        if (state.systems.creation) {
            const nameInput = document.getElementById('creation-name-input');
            state.systems.creation.playerName = nameInput?.value || "Phàm Nhân";
            const newPlayer = state.systems.creation.buildPlayer();
            if (newPlayer) {
                // Reset map view preference for new journey
                await Preferences.set({ key: 'mortal_quest_map_view', value: 'worlds' });
                await this.loadGame(newPlayer.save());
                state.ui.toast("Bắt đầu hành trình tu tiên!", "success");
            } else {
                state.ui.toast("Không đủ điểm Thiên Duyên!", "error");
            }
        }
    }

    /**
     * Helper to give items to player with UI feedback (flashy for high rarity)
     */
    async receiveItem(itemId, quantity = 1, metadata = {}, customMessage = null) {
        if (!state.player) return false;
        
        const itemData = getItemById(itemId);
        if (!itemData) return false;

        const success = state.player.inventory.addItem(itemId, quantity, metadata);
        if (success) {
            // Check for Chân Vũ Nho Quán set completion
            if (itemId === 'chan_vu_nho_quan_ta' || itemId === 'chan_vu_nho_quan_huu') {
                const otherPartId = itemId === 'chan_vu_nho_quan_ta' ? 'chan_vu_nho_quan_huu' : 'chan_vu_nho_quan_ta';
                if (state.player.inventory.hasItem(otherPartId)) {
                    state.player.inventory.removeItem(itemId, 1);
                    state.player.inventory.removeItem(otherPartId, 1);
                    return this.receiveItem('chan_vu_nho_quan', 1, {}, "Chân Vũ Nho Quán đã hoàn thiện!");
                }
            }

            const quality = (metadata && metadata.quality) || itemData.quality || 'Phàm Khí';
            const flashyQualities = ['Pháp Bảo', 'Cổ Bảo', 'Linh Bảo', 'Thông Thiên Linh Bảo', 'Tiên Khí', 'Danh Khí'];
            
            // Check for legendary appearance trigger (items with poem)
            if (itemData.poem) {
                await state.ui.showArtifactAppearance(itemData);
            } else if (flashyQualities.includes(quality)) {
                // Show flashy UI
                await state.ui.showAcquiredLoot({
                    ...itemData,
                    quantity,
                    quality: metadata?.quality || itemData.quality // Use metadata quality if available
                });
            } else {
                // Show standard toast
                state.ui.toast(customMessage || `Đã nhận: ${itemData.name} x${quantity}`, 'success');
            }
            this.refreshUI();
        } else {
            state.ui.toast("Túi đồ đã đầy!", "error");
        }
        return success;
    }

    // --- MINING SYSTEM BRIDGES ---
    mineManual(nodeId) {
        if (!state.systems.mining) return;
        const res = state.systems.mining.mineManual(nodeId);
        if (res.success && this.screens.mining) this.screens.mining.render();
    }
    occupyNode(nodeId) {
        if (!state.systems.mining) return;
        const res = state.systems.mining.occupyNode(nodeId);
        if (res.success && this.screens.mining) this.screens.mining.render();
    }
    claimMiningResources(nodeId) {
        if (!state.systems.mining) return;
        const res = state.systems.mining.claimResources(nodeId);
        if (res.success && this.screens.mining) this.screens.mining.render();
    }
    abandonNode(nodeId) {
        if (!state.systems.mining) return;
        const res = state.systems.mining.abandonNode(nodeId);
        if (res.success && this.screens.mining) this.screens.mining.render();
    }
}
