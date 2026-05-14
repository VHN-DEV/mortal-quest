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

// Import Screens
import { MapScreen } from './ui/screens/MapScreen.js';
import { InventoryScreen } from './ui/screens/InventoryScreen.js';
import { CharacterScreen } from './ui/screens/CharacterScreen.js';
import { SystemsScreen } from './ui/screens/SystemsScreen.js';
import { BattleScreen } from './ui/screens/BattleScreen.js';
import { SpiritStoneUI } from './ui/spirit-stone-ui.js';
import { TreasureScreen } from './ui/screens/TreasureScreen.js';
import { FateScreen } from './ui/screens/FateScreen.js';
import { StartScreen } from './ui/screens/StartScreen.js';
import { SaveScreen } from './ui/screens/SaveScreen.js';
import { MiningScreen } from './ui/screens/MiningScreen.js';
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

export class Game {
    constructor() {
        window.game = this;
        this.screens = {};
    }

    async init() {
        await logger.init();

        state.ui = new UISystem();
        window.ui = state.ui;

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

        state.systems.creation = new CreationSystem();

        await SaveSystem.migrateLegacySave();
        
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
            'btn-npc-talk': 'Tương tác hội thoại NPC đang được bảo trì.',
            'btn-npc-party': 'Tính năng mời NPC vào đội đang được phát triển.',
            'btn-npc-dual': 'Tính năng luận bàn với NPC đang được phát triển.',
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
        if (state.systems.mountain && state.systems.mountain.isActive) state.systems.mountain.update(delta);
        if (state.systems.npc && state.systems.time) state.systems.npc.update(delta, state.systems.time.totalMinutes);
        if (state.systems.social) state.systems.social.update(delta);
        if (state.systems.fate) state.systems.fate.checkTribulation();
        if (state.systems.treasure) state.systems.treasure.update(delta);

        if (state.player.hp <= 0) this.handleDeath();
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
            mining: new MiningSystem(player, state.ui)
        });

        this.screens.fate.player = player;

        if (savedData) {
            if (savedData.npcData) state.systems.npc.loadData(savedData.npcData);
            if (savedData.socialData) state.systems.social.loadData(savedData.socialData);
            if (savedData.time) state.systems.time.load(savedData.time);
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
                    state.ui.spawnQiParticles(centerX, centerY, 15, result.type === 'tuvi' ? '#4FD1C5' : (result.type === 'body' ? '#F87171' : '#A78BFA'));
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

    enterSeclusion() {
        if (!state.player) return;
        if (state.player.isSecluded) return;
        state.player.isSecluded = true;
        state.ui.toast("Ngươi đã bắt đầu bế quan, tâm thần tĩnh lặng...", "success");
        this.refreshUI();
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

    restartFromDeath() {
        state.ui.alert("Thân thể của ngươi đã tan biến giữa hồng trần... Tu vi cả đời hóa thành hư không.", "VÔ THƯỜNG")
            .then(() => {
                SaveSystem.deleteSave(SaveSystem.currentSlot);
                state.player = null;
                state.currentCombat = null;
                state.currentLocId = null;
                state.explorationProgress = 0;
                location.reload();
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
            const stones = state.player.inventory.items.filter(i => {
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

    drawTalisman(typeId) {
        if (state.systems.talisman) {
            const res = state.systems.talisman.draw(typeId);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
            this.refreshUI();
        }
    }

    forge(typeId) {
        if (state.systems.smithing) {
            const res = state.systems.smithing.forge(typeId);
            state.ui.toast(res.msg, res.success ? 'success' : 'error');
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

    handleCombatEncounter(worldId, locId) {
        const loc = getLocationById(worldId, locId);
        const enemy = EnemyGenerator.generate(loc?.dangerLevel || 1);
        this.pendingEncounter = { worldId, locId, enemy };

        const playerPerc = state.player.advancedStats.perception || 5;
        const enemyPerc = enemy.perception || 5;
        const roll = Math.random() * 10 - 5;

        if (playerPerc > enemyPerc + roll) {
            const elDesc = document.getElementById('ambush-desc');
            if (elDesc) elDesc.textContent = `Thần thức nhạy bén giúp ngươi phát hiện một con ${enemy.name} đang ẩn nấp phía trước. Ngươi có muốn tập kích nó không?`;
            state.ui.toggleOverlay(document.getElementById('ambush-overlay'), true);
        } else if (enemyPerc > playerPerc + (Math.random() * 10)) {
            state.ui.toast(`Ngươi bị một con ${enemy.name} tập kích bất ngờ!`, 'error');
            setTimeout(() => this.startBattle(enemy), 1000);
        } else {
            this.startBattle(enemy);
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

    handleCombatEnd(result) {
        if (result === 'win') {
            const combat = state.currentCombat;
            if (combat?.enemy) {
                combat.enemy.inventory.forEach(item => {
                    state.player.inventory.addItem(item.id, item.quantity);
                    state.ui.toast(`Thu được ${getItemById(item.id)?.name} x${item.quantity}`, 'success');
                });
                const tuvi = combat.enemy.realmId * 50;
                state.player.addTuVi(tuvi);
                state.ui.toast(`Chiến thắng! Nhận được ${tuvi} Tu Vi.`, 'success');
            }
        } else if (result === 'lose') {
            this.handleDeath();
        }
        state.currentCombat = null;
        state.ui.switchScreen('screen-adventure', null);
        this.refreshUI();
    }

    startAmbush() {
        if (!this.pendingEncounter) return;
        state.ui.toggleOverlay(document.getElementById('ambush-overlay'), false);
        const successChance = 0.6 + ((state.player.advancedStats.perception || 5) / 100);
        if (Math.random() < successChance) {
            this.startBattle(this.pendingEncounter.enemy, 'player');
        } else {
            state.ui.toast("Tập kích thất bại! Ngươi đã bị đối phương phát hiện.", "warning");
            this.startBattle(this.pendingEncounter.enemy);
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

    async startCreationGame() {
        if (state.systems.creation) {
            const nameInput = document.getElementById('creation-name-input');
            state.systems.creation.playerName = nameInput?.value || "Phàm Nhân";
            const newPlayer = state.systems.creation.buildPlayer();
            if (newPlayer) {
                await this.loadGame(newPlayer.save());
                state.ui.toast("Bắt đầu hành trình tu tiên!", "success");
            } else {
                state.ui.toast("Không đủ điểm Thiên Duyên!", "error");
            }
        }
    }
}
