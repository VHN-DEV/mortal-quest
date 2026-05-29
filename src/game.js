import { state } from './state.js';
import { Player } from './core/player.js';
import { SaveSystem, utf8_to_hex, hex_to_utf8 } from './core/save-system.js';
import { UISystem } from './ui/ui-system.js';
import { ASSETS } from './configs/asset-data.js';
import { EnemyGenerator } from './core/enemy.js';
import { getLocationById } from './configs/map-data.js';
import { CombatEngine } from './core/combat-engine.js';
import { getItemById } from './configs/item-data.js';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { getSectById, SECTS } from './configs/sect-data.js';
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
import { TravelSystem } from './systems/travel-system.js';
import { SectSystem } from './systems/sect-system.js';

import { MissionSystem } from './systems/MissionSystem.js';
import { MissionScreen } from './ui/controllers/MissionScreen.js';
import { CheatSystem } from './systems/CheatSystem.js';
import { CheatSystemScreen } from './ui/controllers/CheatSystemScreen.js';

function slugifyName(name) {
    if (!name) return 'VoDanh';
    return name.normalize('NFD')
               .replace(/[\u0300-\u036f]/g, '')
               .replace(/[đĐ]/g, 'd')
               .replace(/[^a-zA-Z0-9]/g, '')
               .trim();
}

export class Game {
    constructor() {
        window.game = this;
        this.state = state;
        this.systems = state.systems;
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
            import('./ui/controllers/MapScreen.js'),
            import('./ui/controllers/InventoryScreen.js'),
            import('./ui/controllers/CharacterScreen.js'),
            import('./ui/controllers/SystemsScreen.js'),
            import('./ui/controllers/BattleScreen.js'),
            import('./ui/spirit-stone-ui.js'),
            import('./ui/controllers/TreasureScreen.js'),
            import('./ui/controllers/FateScreen.js'),
            import('./ui/controllers/StartScreen.js'),
            import('./ui/controllers/SaveScreen.js'),
            import('./ui/controllers/MiningScreen.js'),
            import('./ui/controllers/DiHoaBangScreen.js'),
            import('./ui/controllers/DiLoiBangScreen.js'),
            import('./ui/controllers/LinhTheLucScreen.js'),
            import('./ui/controllers/PhapBaoLucScreen.js'),
            import('./ui/controllers/ChungTocLucScreen.js'),
            import('./ui/controllers/KyTrungBangScreen.js'),
            import('./ui/controllers/MissionScreen.js'),
            import('./ui/controllers/LootScreen.js')
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
                        this.screens.systems.renderTechniques(state.activeTechTab || 'linh_luc');
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
        let lastRenderTime = 0;
        const loop = () => {
            if (state.player) {
                const now = Date.now();
                const delta = (now - state.player.lastUpdate) / 1000;
                
                if (delta > 5.0) {
                    this.processOfflineProgress(delta);
                } else {
                    this.update(delta);
                }

                // Throttle visual rendering to 10 FPS (every 100ms) to dramatically reduce CPU & battery overhead
                if (now - lastRenderTime >= 100) {
                    this.render();
                    lastRenderTime = now;
                }
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    processOfflineProgress(delta) {
        if (!state.player) return;

        // Skip if the offline time is less than 5 seconds to avoid noise during transitions
        if (delta < 5.0) {
            state.player.lastUpdate = Date.now();
            return;
        }

        const player = state.player;
        const focus = player.cultivationFocus || 'tuvi';
        const hasTuviTech = !!player.mainTechniqueId;
        const hasBodyTech = !!player.mainBodyTechniqueId;
        const hasSoulTech = !!player.mainSoulTechniqueId;

        // Calculate stability and multipliers
        player.calculateStability();
        let stabilityMult = 1.0;
        if (player.stability > 90) stabilityMult = 1.2;
        else if (player.stability < 40) stabilityMult = 0.8;

        const compMult = 1 + (player.comprehension / 100);
        let finalMultiplier = stabilityMult * compMult;
        if (player.isSecluded) finalMultiplier *= 5.0;

        // Calculate O(1) gains
        const tuViGain = hasTuviTech ? player.tuViPerSecond * (focus === 'tuvi' ? 1.0 : 0.2) * finalMultiplier * delta : 0;
        const bodyGain = hasBodyTech ? player.bodyExpPerSecond * (focus === 'body' ? 1.0 : 0.2) * finalMultiplier * delta : 0;
        const soulGain = hasSoulTech ? player.soulExpPerSecond * (focus === 'soul' ? 1.0 : 0.2) * finalMultiplier * delta : 0;

        player.tuVi += tuViGain;
        player.bodyExp += bodyGain;
        player.soulExp += soulGain;

        // Stamina, Mana, HP regen
        let regenMult = player.stability < 20 ? 0.2 : 1.0;
        player.stamina = Math.min(player.maxStamina, player.stamina + 0.1 * delta * regenMult);
        player.mana = Math.min(player.maxMana, player.mana + 0.05 * delta * regenMult);
        player.hp = Math.min(player.maxHp, player.hp + 0.01 * player.maxHp * delta * regenMult);

        // Advance time in O(1)
        if (state.systems.time) {
            state.systems.time.totalMinutes += Math.floor(delta / 60);
        }

        // Set player lastUpdate to now to reset tick timing
        player.lastUpdate = Date.now();

        // Display beautiful notification to the user
        const mins = Math.floor(delta / 60);
        const hours = (delta / 3600).toFixed(1);
        const timeStr = mins >= 60 ? `${hours} giờ` : `${mins} phút`;

        if (Math.floor(tuViGain) > 0 || Math.floor(bodyGain) > 0 || Math.floor(soulGain) > 0) {
            let msg = `🧘‍♂️ **Bế Quan Tự Động (${timeStr})**:\n`;
            if (Math.floor(tuViGain) > 0) msg += `  · Tu Vi: +${Math.floor(tuViGain).toLocaleString()}\n`;
            if (Math.floor(bodyGain) > 0) msg += `  · Nhục Thân: +${Math.floor(bodyGain).toLocaleString()}\n`;
            if (Math.floor(soulGain) > 0) msg += `  · Thần Thức: +${Math.floor(soulGain).toLocaleString()}\n`;

            setTimeout(() => {
                state.ui.toast(msg, 'success');
            }, 1000);
        }
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
                } else if (ev.type === 'backlash') {
                    state.ui.alert(ev.msg, "Kinh Mạch Phản Phệ!");
                } else if (ev.type === 'deviation_end') {
                    state.ui.toast(ev.msg, "success");
                } else if (ev.type === 'npc_event') {
                    if (ev.action === 'TRUY_SAT') {
                        state.ui.alert(ev.msg, "Kẻ Thù Truy Sát!");
                    } else if (ev.action === 'CUOP_BOC' || ev.action === 'LUAN_BAN') {
                        state.ui.alert(ev.msg, "Đụng Độ!");
                    } else {
                        state.ui.toast(ev.msg, 'info');
                    }
                } else if (ev.type === 'npc_killed') {
                    state.ui.toast(ev.msg, 'error');
                } else if (ev.type === 'technique_breakthrough' || ev.type === 'technique_evolution') {
                    state.ui.alert(ev.msg, "Ngộ Đạo Thông Thiên");
                }
            });
        }

        if (state.systems.time) state.systems.time.update(delta);
        if (state.systems.garden) state.systems.garden.update(delta);
        if (state.systems.mission) state.systems.mission.update();
        if (state.systems.mining) state.systems.mining.processTimeEvents(delta / 60); // minutes
        if (state.systems.mountain && state.systems.mountain.isActive) state.systems.mountain.update(delta);
        if (state.systems.npc && state.systems.time) {
            state.systems.npc.update(delta, state.systems.time.totalMinutes);
            this.npcInteractionTimer = (this.npcInteractionTimer || 0) + delta;
            if (this.npcInteractionTimer > 10) { // Check every 10 real seconds
                this.npcInteractionTimer = 0;
                if (!state.player.isSecluded) {
                    state.systems.npc.triggerPlayerInteractions(state.player);
                }
            }
        }
        if (state.systems.social) state.systems.social.update(delta);
        if (state.systems.fate) state.systems.fate.checkTribulation();
        if (state.systems.treasure) state.systems.treasure.update(delta);

        if (state.player.hp <= 0) window.game.handleDeath();
    }

    render() {
        if (typeof window.renderMainStats === 'function') window.renderMainStats();

        // Throttled technique screen real-time progress update (runs once per 1000ms)
        const now = Date.now();
        if (state.ui && state.ui.currentScreenId === 'screen-technique' && this.screens.systems) {
            if (now - (this.lastTechRenderTime || 0) >= 1000) {
                const activeTab = state.activeTechTab || 'linh_luc';
                const isDetailHidden = !this.screens.systems.elTechDetailView || this.screens.systems.elTechDetailView.classList.contains('hidden');
                
                if (isDetailHidden) {
                    if (['linh_luc', 'luyen_the', 'than_thuc', 'secret'].includes(activeTab)) {
                        this.screens.systems.renderTechniques(activeTab);
                    }
                } else {
                    const techCtrl = this.screens.systems.techniqueController;
                    if (techCtrl && techCtrl.activeDetailId) {
                        this.screens.systems.renderTechniqueDetail(techCtrl.activeDetailId, techCtrl.activeDetailIsSecret);
                    }
                }
                this.lastTechRenderTime = now;
            }
        }
    }

    refreshUI() {
        if (!state.player) return;
        if (typeof window.renderMainStats === 'function') window.renderMainStats();
        if (state.ui && typeof state.ui.updateQiBubbleSystemState === 'function') {
            state.ui.updateQiBubbleSystemState();
        }
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

    async deleteAllSaves() {
        const metadata = await SaveSystem.getAllMetadata();
        const saveCount = Object.keys(metadata).length;
        if (saveCount === 0) {
            state.ui.toast("Không có dữ liệu lưu trữ nào để xóa!", "info");
            return;
        }

        const confirmed1 = await state.ui.confirm(
            "Ngươi có chắc chắn muốn XÓA BỎ TOÀN BỘ đạo quả và dữ liệu của tất cả các ô lưu trữ? Hành động này sẽ diệt môn, xóa sổ hoàn toàn mọi tiến trình và KHÔNG thể hoàn tác!",
            "Cảnh Báo Diệt Môn Tối Cao"
        );
        if (!confirmed1) return;

        const confirmed2 = await state.ui.confirm(
            "Nhắc nhở cuối cùng: Toàn bộ công sức tu luyện của đạo hữu trên mọi ô lưu sẽ biến mất vĩnh viễn. Ngươi thực sự quyết định hủy diệt thế giới này chứ?",
            "Diệt Thế Chi Tai"
        );
        if (!confirmed2) return;

        await SaveSystem.clearAll();
        await this.screens.save.render();
        state.ui.toast("Toàn bộ Mệnh Đồ Lục đã bị xóa sạch cát bụi!", "success");
    }


    showSaveMenu(slot) {
        const options = [
            { label: 'Tiếp Tục Chơi', value: 'load', icon: 'ph-play' },
            { label: 'Đổi Tên Nhân Vật', value: 'rename', icon: 'ph-pencil' },
            { label: 'Xóa Dữ Liệu', value: 'delete', icon: 'ph-trash' },
            { label: 'Xuất Ô Lưu Này (Export)', value: 'export_slot', icon: 'ph-export' },
            { label: 'Nhập Đè Ô Lưu Này (Import)', value: 'import_slot', icon: 'ph-import' },
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
                } else if (action === 'export_slot') {
                    await this.exportSaves(slot);
                } else if (action === 'import_slot') {
                    await this.importSaves(slot);
                } else if (action === 'stats') {
                    state.ui.toast('Tính năng xem thống kê chi tiết đang được phát triển.', 'info');
                }
            });
    }

    async exportSaves(slot = null) {
        try {
            const options = [
                { label: 'Xuất Ra File (.json)', value: 'file', icon: 'ph-file-arrow-down' },
                { label: 'Sao Chép Mã Save (Văn Bản)', value: 'text', icon: 'ph-copy' }
            ];
            
            const title = slot ? `Xuất Ô Lưu Số ${slot}` : 'Xuất Toàn Bộ Mệnh Đồ';
            const subtitle = slot ? `Chọn hình thức xuất dữ liệu của ô lưu số ${slot} để chuyển thiết bị.` : 'Chọn hình thức xuất toàn bộ dữ liệu lưu trữ để chuyển thiết bị.';
            const choice = await state.ui.promptOptions(title, options, subtitle);
            if (!choice) return;
            
            state.ui.showLoading(true, 'Đang phong ấn đạo quả...');
            
            let saveData;
            let fileName;
            if (slot !== null) {
                saveData = await SaveSystem.exportSlotSave(slot);
                const charName = slugifyName(saveData.metadata?.name);
                fileName = `PhamNhanVanDao_Slot_${slot}_${charName}.json`;
            } else {
                saveData = await SaveSystem.exportAllSaves();
                fileName = `PhamNhanVanDao_AllSaves_${Date.now()}.json`;
            }
            
            const jsonStr = JSON.stringify(saveData);
            state.ui.showLoading(false);
            
            if (choice === 'file') {
                const isAndroid = Capacitor.getPlatform() === 'android';
                
                if (isAndroid) {
                    try {
                        const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
                        const writeResult = await Filesystem.writeFile({
                            path: fileName,
                            data: jsonStr,
                            directory: Directory.Cache,
                            encoding: Encoding.UTF8
                        });
                        
                        const { Share } = await import('@capacitor/share');
                        await Share.share({
                            title: slot ? `Sao Lưu Ô ${slot}` : 'Mệnh Đồ Lục Sao Lưu',
                            text: slot ? `File sao lưu ô lưu số ${slot} game Phàm Nhân Vấn Đạo` : 'File sao lưu toàn bộ game Phàm Nhân Vấn Đạo',
                            url: writeResult.uri,
                            dialogTitle: 'Lưu hoặc Chia Sẻ File Save'
                        });
                        state.ui.toast('Xuất file thành công!', 'success');
                    } catch (e) {
                        logger.error('save', 'Lỗi khi xuất file trên Android', e);
                        state.ui.toast('Lỗi xuất file. Hãy dùng hình thức Sao Chép Mã Save.', 'error');
                    }
                } else {
                    // Web fallback (cho kiểm thử trên môi trường web)
                    const blob = new Blob([jsonStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    state.ui.toast('Đã tải xuống file save!', 'success');
                }
            } else if (choice === 'text') {
                const hexStr = utf8_to_hex(jsonStr);
                try {
                    await navigator.clipboard.writeText(hexStr);
                    state.ui.toast('Mã save đã được sao chép vào bộ nhớ tạm. Hãy gửi mã này sang thiết bị mới để nhập!', 'success');
                } catch (err) {
                    state.ui.prompt('Sao chép thủ công mã save bên dưới:', () => {}, hexStr, 'Mã Save Của Bạn');
                }
            }
        } catch (e) {
            state.ui.showLoading(false);
            logger.error('save', 'Lỗi xuất save:', e);
            state.ui.toast(e.message || 'Có lỗi xảy ra khi xuất dữ liệu!', 'error');
        }
    }

    async importSaves(targetSlot = null) {
        try {
            const options = [
                { label: 'Nhập Từ File (.json)', value: 'file', icon: 'ph-file-arrow-up' },
                { label: 'Nhập Bằng Mã Save (Văn Bản)', value: 'text', icon: 'ph-keyboard' }
            ];
            
            const title = targetSlot ? `Nhập Đè Ô Lưu Số ${targetSlot}` : 'Nhập Mệnh Đồ';
            const choice = await state.ui.promptOptions(title, options, 'Chọn hình thức nhập dữ liệu lưu trữ để tiếp tục hành trình.');
            if (!choice) return;
            
            if (choice === 'file') {
                const fileInput = document.getElementById('import-save-file');
                if (fileInput) {
                    if (targetSlot) {
                        fileInput.dataset.targetSlot = targetSlot;
                    } else {
                        delete fileInput.dataset.targetSlot;
                    }
                    fileInput.click();
                } else {
                    state.ui.toast('Không tìm thấy cổng nhập file', 'error');
                }
            } else if (choice === 'text') {
                state.ui.prompt('Dán mã save đã sao chép ở thiết bị cũ vào đây:', async (code) => {
                    if (!code || code.trim() === '') return;
                    
                    state.ui.showLoading(true, 'Đang giải mã đạo quả...');
                    try {
                        const jsonStr = hex_to_utf8(code.trim());
                        const data = JSON.parse(jsonStr);
                        state.ui.showLoading(false);
                        await this.importSavesData(data, targetSlot);
                    } catch (err) {
                        state.ui.showLoading(false);
                        state.ui.toast('Mã save không hợp lệ hoặc bị lỗi định dạng!', 'error');
                    }
                }, '', targetSlot ? `Nhập Vào Ô ${targetSlot}` : 'Nhập Mã Save');
            }
        } catch (e) {
            state.ui.showLoading(false);
            logger.error('save', 'Lỗi nhập save:', e);
            state.ui.toast('Có lỗi xảy ra khi chuẩn bị nhập dữ liệu!', 'error');
        }
    }

    async importSavesData(data, targetSlot = null) {
        try {
            if (!data || (data.type !== 'mortal_quest_save_export' && data.type !== 'mortal_quest_slot_export')) {
                state.ui.toast('Dữ liệu lưu trữ không đúng định dạng Phàm Nhân Vấn Đạo!', 'error');
                return;
            }
            
            if (data.type === 'mortal_quest_save_export') {
                if (targetSlot !== null) {
                    const proceed = await state.ui.confirm(
                        'File bạn chọn chứa TOÀN BỘ các ô lưu trữ. Nếu đồng ý, TOÀN BỘ các ô hiện tại trên thiết bị sẽ bị ghi đè!',
                        'Xác Nhận Khôi Phục Toàn Bộ'
                    );
                    if (!proceed) return;
                } else {
                    const proceed = await state.ui.confirm(
                        'Bạn có chắc muốn nhập toàn bộ dữ liệu? Hành động này sẽ GHI ĐÈ và XÓA BỎ TOÀN BỘ các ô lưu trữ hiện tại!',
                        'Cảnh Báo Ghi Đè Toàn Bộ'
                    );
                    if (!proceed) return;
                }
                
                state.ui.showLoading(true, 'Đang trùng kiến mệnh đồ...');
                const success = await SaveSystem.importAllSaves(data);
                state.ui.showLoading(false);
                
                if (success) {
                    state.ui.toast('Nhập dữ liệu thành công!', 'success');
                    if (this.screens.save) {
                        await this.screens.save.render();
                    }
                } else {
                    state.ui.toast('Nhập dữ liệu thất bại!', 'error');
                }
            } else if (data.type === 'mortal_quest_slot_export') {
                let slot = targetSlot;
                
                if (slot === null) {
                    const slotChoices = [
                        { label: `Ô lưu số 1 (Ghi đè)`, value: '1' },
                        { label: `Ô lưu số 2 (Ghi đè)`, value: '2' },
                        { label: `Ô lưu số 3 (Ghi đè)`, value: '3' },
                        { label: `Ô lưu số 4 (Ghi đè)`, value: '4' },
                        { label: `Ô lưu số 5 (Ghi đè)`, value: '5' }
                    ];
                    
                    const charName = data.metadata?.name || 'Vô Danh';
                    const charRealm = data.metadata?.realm || 'Chưa Tu Luyện';
                    const selectedSlot = await state.ui.promptOptions(
                        'Chọn Ô Lưu Đích', 
                        slotChoices, 
                        `Phát hiện dữ liệu của đạo hữu [${charName} - ${charRealm}]. Vui lòng chọn ô lưu muốn ghi đè:`
                    );
                    if (!selectedSlot) return;
                    slot = parseInt(selectedSlot, 10);
                } else {
                    const charName = data.metadata?.name || 'Vô Danh';
                    const confirmed = await state.ui.confirm(
                        `Ngươi có chắc muốn nhập nhân vật [${charName}] đè vào Ô Lưu số ${slot} không? Dữ liệu cũ ở ô này sẽ biến mất!`,
                        `Xác Nhận Nhập Đè Ô ${slot}`
                    );
                    if (!confirmed) return;
                }
                
                state.ui.showLoading(true, `Đang nạp đạo quả vào ô ${slot}...`);
                const success = await SaveSystem.importSlotSave(slot, data);
                state.ui.showLoading(false);
                
                if (success) {
                    state.ui.toast(`Nhập dữ liệu vào ô ${slot} thành công!`, 'success');
                    if (this.screens.save) {
                        await this.screens.save.render();
                    }
                } else {
                    state.ui.toast('Nhập dữ liệu thất bại!', 'error');
                }
            }
        } catch (e) {
            state.ui.showLoading(false);
            logger.error('save', 'Lỗi nhập save:', e);
            state.ui.toast('Lỗi hệ thống khi nhập dữ liệu!', 'error');
        }
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
            travel: new TravelSystem(player, state.ui),
            sect: new SectSystem(player, state.ui),
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

            // --- MA GIỚI INITIAL POPULATION ---
            // 1 Ma Thần inside Thiên Ma Thành (Capital)
            state.systems.npc.generate('ma_than', 42, 'thien_ma_thanh');

            // 1 Ma Vương inside Thiên Ma Thành (Capital)
            state.systems.npc.generate('ma_vuong', 38, 'thien_ma_thanh');

            // 12 Ma Tướng, each guarding one of the 12 Ma Thành
            const demonCities = [
                { id: 'huyen_am_ma_thanh', name: 'Huyền Âm Ma Tướng', realm: 20 },
                { id: 'cuu_u_ma_thanh', name: 'Cửu U Ma Tướng', realm: 22 },
                { id: 'thien_ma_thanh', name: 'Thiên Ma Tướng', realm: 24 },
                { id: 'huyet_hai_ma_thanh', name: 'Huyết Hải Ma Tướng', realm: 26 },
                { id: 'vo_han_ma_thanh', name: 'Vô Hạn Ma Tướng', realm: 28 },
                { id: 'tich_diet_ma_thanh', name: 'Tịch Diệt Ma Tướng', realm: 30 },
                { id: 'phan_thien_ma_thanh', name: 'Phần Thiên Ma Tướng', realm: 32 },
                { id: 'sat_luc_ma_thanh', name: 'Sát Lục Ma Tướng', realm: 34 },
                { id: 'hac_am_ma_thanh', name: 'Hắc Ám Ma Tướng', realm: 36 },
                { id: 'loi_dinh_ma_thanh', name: 'Lôi Đình Ma Tướng', realm: 38 },
                { id: 'bang_phong_ma_thanh', name: 'Băng Phong Ma Tướng', realm: 40 },
                { id: 'u_minh_ma_thanh', name: 'U Minh Ma Tướng', realm: 42 }
            ];

            demonCities.forEach(city => {
                const mt = state.systems.npc.generate('ma_tuong', city.realm, city.id);
                mt.name = city.name;
            });

            // Scatter Ma Binh and Ma Dân across all demon areas
            const demonAreas = [
                'hac_tuyen_ma_thon', 'vong_hon_ma_thon',
                'thiet_huyen_ma_tran', 'huyen_quyet_ma_tran',
                'huyen_am_ma_thanh', 'cuu_u_ma_thanh', 'thien_ma_thanh', 'huyet_hai_ma_thanh',
                'vo_han_ma_thanh', 'tich_diet_ma_thanh', 'phan_thien_ma_thanh', 'sat_luc_ma_thanh',
                'hac_am_ma_thanh', 'loi_dinh_ma_thanh', 'bang_phong_ma_thanh', 'u_minh_ma_thanh'
            ];

            demonAreas.forEach(area => {
                // Determine appropriate realm based on the area's difficulty
                const isVillage = area.includes('thon');
                const isTown = area.includes('tran');
                const baseRealm = isVillage ? 1 : (isTown ? 6 : 14);

                // Spawn 1-2 Ma Binhs in each area
                const soldierCount = isVillage ? 1 : 2;
                for (let i = 0; i < soldierCount; i++) {
                    state.systems.npc.generate('ma_binh', baseRealm + Math.floor(Math.random() * 4), area);
                }

                // Spawn 1-3 Ma Dâns in each area
                const citizenCount = isVillage ? 3 : (isTown ? 2 : 1);
                for (let i = 0; i < citizenCount; i++) {
                    state.systems.npc.generate('ma_dan', baseRealm + Math.floor(Math.random() * 3), area);
                }
            });

            // --- SPAWN SPECIAL NPCS ---
            const specialNpcSpawns = {
                'han_phi_vu': { location: 'than_thu_coc', realm: 1 },
                'bach_tu_linh': { location: 'thanh_van_tong', realm: 8 },
                'du_nhuoc_nhan': { location: 'thien_uyen_thanh', realm: 30 },
                'phuong_ca': { location: 'linh_vong_son', realm: 12 },
                'phuong_vu': { location: 'quang_han_gioi', realm: 34 },
                'tran_tu_huyen': { location: 'quy_linh_mon', realm: 18 },
                'xich_nguyet': { location: 'thanh_dia_yeu_toc', realm: 24 },
                'han_lap': { location: 'bach_nhac_phong', realm: 42 },
                'tu_linh': { location: 'dieu_am_mon', realm: 30 },
                'kiem_vo_tam': { location: 'cu_kiem_mon', realm: 24 },
                'vo_danh': { location: 'hu_thien_dien_nhan', realm: 28 },
                'bang_nguyet': { location: 'tieu_cuc_cung', realm: 26 },
                'thanh_lien': { location: 'phat_tong', realm: 20 },
                'thanh_nhi': { location: 'thien_ho_toc', realm: 12 },
                'bach_minh_anh': { location: 'thai_nhat_mon', realm: 18 },
                'han_vien': { location: 'huyen_cot_dao', realm: 22 },
                'lan_anh': { location: 'dan_thap', realm: 20 },
                'minh_nguyet': { location: 'yem_nguyet_tong', realm: 16 },

                // New Special NPCs
                'dong_ninh': { location: 'tieu_cuc_cung', realm: 25 },
                'han_chan_quan': { location: 'thanh_van_tong', realm: 35 },
                'han_thien_quan': { location: 'loi_dinh_ma_thanh', realm: 38 },
                'hang_nga': { location: 'quang_han_gioi', realm: 42 },
                'hua_lap_quoc': { location: 'sat_luc_ma_thanh', realm: 20 },
                'lieu_mi': { location: 'huyen_cot_dao', realm: 22 },
                'lieu_nguyet_nhi': { location: 'dieu_am_mon', realm: 24 },
                'ly_mo_uyen': { location: 'dan_thap', realm: 25 },
                'nam_cung_uyen': { location: 'yem_nguyet_tong', realm: 38 },
                'natra': { location: 'thanh_van_tong', realm: 28 },
                'ngan_nguyet': { location: 'bach_nhac_phong', realm: 32 },
                'ngao_at': { location: 'thanh_dia_yeu_toc', realm: 30 },
                'thien_van_tu': { location: 'thien_uyen_thanh', realm: 36 },
                'tieu_ngan_nguyet': { location: 'thien_ho_toc', realm: 15 },
                'tu_do_nam': { location: 'linh_vong_son', realm: 35 },
                'vuong_co_than': { location: 'cu_kiem_mon', realm: 30 },
                'vuong_ma_than': { location: 'linh_vong_son', realm: 45 },
                'vuong_ma_tu': { location: 'linh_vong_son', realm: 40 }
            };

            Object.entries(specialNpcSpawns).forEach(([id, config]) => {
                state.systems.npc.generate(id, config.realm, config.location);
            });

            // --- Initialize Web of Relationships ---
            const hanLap = state.systems.npc.npcs.find(n => n.templateId === 'han_lap');
            const tuLinh = state.systems.npc.npcs.find(n => n.templateId === 'tu_linh');
            if (hanLap && tuLinh) {
                hanLap.relationship = 100;
                tuLinh.relationship = 100;
                hanLap.specialRelation = 'dao_lu';
                tuLinh.specialRelation = 'dao_lu';
                hanLap.relatives.push(tuLinh.id);
                tuLinh.relatives.push(hanLap.id);
            }

            // Relationship: Han Lap & Nam Cung Uyen (Dao Lu)
            const namCungUyen = state.systems.npc.npcs.find(n => n.templateId === 'nam_cung_uyen');
            if (hanLap && namCungUyen) {
                namCungUyen.relationship = 100;
                if (!hanLap.relatives.includes(namCungUyen.id)) hanLap.relatives.push(namCungUyen.id);
                if (!namCungUyen.relatives.includes(hanLap.id)) namCungUyen.relatives.push(hanLap.id);
            }

            // Relationship: Han Lap & Ngan Nguyet (Companion / Relative)
            const nganNguyet = state.systems.npc.npcs.find(n => n.templateId === 'ngan_nguyet');
            if (hanLap && nganNguyet) {
                nganNguyet.relationship = 100;
                if (!hanLap.relatives.includes(nganNguyet.id)) hanLap.relatives.push(nganNguyet.id);
                if (!nganNguyet.relatives.includes(hanLap.id)) nganNguyet.relatives.push(hanLap.id);
            }

            // Relationship: Vuong Lam & Ly Mo Uyen (Dao Lu)
            const vuongLam = state.systems.npc.npcs.find(n => n.templateId === 'vuong_ma_tu');
            const lyMoUyen = state.systems.npc.npcs.find(n => n.templateId === 'ly_mo_uyen');
            if (vuongLam && lyMoUyen) {
                vuongLam.relationship = 100;
                lyMoUyen.relationship = 100;
                vuongLam.specialRelation = 'dao_lu';
                lyMoUyen.specialRelation = 'dao_lu';
                vuongLam.relatives.push(lyMoUyen.id);
                lyMoUyen.relatives.push(vuongLam.id);
            }

            // Relationship: Vuong Lam & Tu Do Nam (Su Do)
            const tuDoNam = state.systems.npc.npcs.find(n => n.templateId === 'tu_do_nam');
            if (vuongLam && tuDoNam) {
                vuongLam.relationship = 100;
                tuDoNam.relationship = 100;
                vuongLam.specialRelation = 'su_do';
                vuongLam.relatives.push(tuDoNam.id);
                tuDoNam.relatives.push(vuongLam.id);
            }
        }

        const elName = document.getElementById('player-name-header');
        if (elName) elName.textContent = player.name;

        const portraitKey = player.avatar || (['female', 'Nữ'].includes(player.gender) ? 'player_female' : 'player_male');
        const portraitUrl = ASSETS.portraits[portraitKey];

        const elPortrait = document.getElementById('header-portrait');
        if (elPortrait) elPortrait.src = portraitUrl;

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
            if (state.systems.cheat) {
                state.systems.cheat.onAction('cultivate', 1);
            }

            // Skip visual effects if auto-cultivating to prevent performance lag
            if (!state.autoCultivateInterval) {
                // Delegate animation handling to UI system
                if (state.ui && typeof state.ui.handleCultivationSuccess === 'function') {
                    state.ui.handleCultivationSuccess(result);
                }

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
        }

        if (typeof window.renderMainStats === 'function') window.renderMainStats();
        this.refreshUI();
    }

    absorbBubble(rawName, type = 'tuvi', sizeMult = 1.0) {
        if (!state.player) return null;
        const result = state.player.absorbBubble(rawName, type, sizeMult);
        if (result.success) {
            if (state.ui && typeof state.ui.handleCultivationSuccess === 'function') {
                state.ui.handleCultivationSuccess(result);
            }
            if (typeof window.renderMainStats === 'function') window.renderMainStats();
            this.refreshUI();
        }
        return result;
    }

    async breakthrough(customFocus = null) {
        if (!state.player) return;
        const focus = customFocus || state.player.cultivationFocus || 'tuvi';

        // First check if they can breakthrough at all
        const canCheck = state.player.canBreakthrough(focus);
        if (!canCheck.can) {
            state.ui.toast(canCheck.reason || "Chưa đủ điều kiện đột phá!", "error");
            return;
        }

        let pillId = null;
        let pillName = '';
        let targetRealmName = '';
        let rateBonus = 0;

        if (focus === 'tuvi') {
            const currentRealmId = state.player.realmId;
            if (currentRealmId === 13) { pillId = 'truc_co_dan'; pillName = 'Trúc Cơ Đan'; targetRealmName = 'Trúc Cơ Kỳ'; rateBonus = 0.3; }
            else if (currentRealmId === 17) { pillId = 'ket_dan_dan'; pillName = 'Kết Đan Đan'; targetRealmName = 'Kết Đan Kỳ'; rateBonus = 0.2; }
            else if (currentRealmId === 21) { pillId = 'nguyen_anh_dan'; pillName = 'Nguyên Anh Đan'; targetRealmName = 'Nguyên Anh Kỳ'; rateBonus = 0.15; }
            else if (currentRealmId === 25) { pillId = 'hoa_than_dan'; pillName = 'Hóa Thần Đan'; targetRealmName = 'Hóa Thần Kỳ'; rateBonus = 0.1; }
        }

        let isForced = false;
        let finalRateBonus = 0;

        if (pillId) {
            const hasPill = state.player.inventory.hasItem(pillId);
            const baseStability = state.player.getStability();
            const fatePenalty = state.systems.fate?.getBreakthroughPenalty() || 1.0;
            const finalBaseRate = Math.min(100, baseStability * fatePenalty);

            if (hasPill) {
                const finalPillRate = Math.min(100, (baseStability + rateBonus * 100) * fatePenalty);
                const options = [
                    { id: 'use_pill', name: `💊 Sử dụng ${pillName} (Tăng +${rateBonus * 100}% tỷ lệ, còn lại ${state.player.inventory.getItemQuantity(pillId)} viên)`, desc: `Đảm bảo an toàn, nâng tỷ lệ thành công lên ${finalPillRate.toFixed(1)}%.` },
                    { id: 'force', name: '⚡ Cưỡng ép đột phá (Không dùng đan dược)', desc: `Đột phá tay không với tỷ lệ thành công cơ bản ${finalBaseRate.toFixed(1)}%. Rủi ro tẩu hỏa nhập ma nhân đôi!` },
                    { id: 'cancel', name: '❌ Hủy bỏ', desc: 'Chuẩn bị thêm linh lực trước khi hành sự.' }
                ];

                const choice = await state.ui.promptOptions(
                    `Đại Cảnh Giới Đột Phá: ${targetRealmName}`,
                    options,
                    `Ngươi đang đứng trước ngưỡng cửa đột phá lên ${targetRealmName}. Ngươi có muốn sử dụng đan dược hỗ trợ trong túi đồ để gia tăng tỷ lệ thành công không?`
                );

                if (choice === 'cancel' || !choice) {
                    state.ui.toast("Đột phá đã bị hủy bỏ.", "info");
                    return;
                }
                if (choice === 'use_pill') {
                    state.player.inventory.removeItem(pillId, 1);
                    finalRateBonus = rateBonus;
                } else if (choice === 'force') {
                    isForced = true;
                }
            } else {
                // Warning no pill
                const options = [
                    { id: 'force', name: '⚡ Cưỡng ép đột phá', desc: `Chấp nhận rủi ro cực cao, tỷ lệ thành công chỉ ${finalBaseRate.toFixed(1)}%.` },
                    { id: 'cancel', name: '❌ Hủy bỏ', desc: 'Trở lại tìm kiếm hoặc chế tạo đan dược.' }
                ];

                const choice = await state.ui.promptOptions(
                    `Đại Cảnh Giới Đột Phá: Không Có Đan Dược!`,
                    options,
                    `Ngươi đang cố gắng đột phá lên ${targetRealmName} nhưng trong rương không có ${pillName} hỗ trợ! Việc cưỡng ép đột phá tay không cực kỳ nguy hiểm, nguy cơ tẩu hỏa nhập ma nhân đôi. Ngươi vẫn muốn tiếp tục chứ?`
                );

                if (choice === 'cancel' || !choice) {
                    state.ui.toast("Đột phá đã bị hủy bỏ.", "info");
                    return;
                }
                isForced = true;
            }
        }

        const result = state.player.breakthrough(focus, isForced, finalRateBonus);
        if (result && result.msg) state.ui.toast(result.msg, result.success ? 'success' : 'error');
        if (result && result.success) {
            if (state.systems.cheat) {
                state.systems.cheat.onAction('breakthrough', 1);
            }
            state.ui.showBreakthroughEffect(state.player.getCurrentRealm(focus).name);
            await this.saveGame();
        }
        this.refreshUI();
    }

    setCultivationFocus(focus) {
        if (!state.player) return;
        const validFocuses = ['tuvi', 'body', 'soul', 'sword', 'soul_path', 'buddhist', 'confucian'];
        if (!validFocuses.includes(focus)) return;

        // Check if focus is specialized and not unlocked yet
        if (['sword', 'soul_path', 'buddhist', 'confucian'].includes(focus)) {
            if (!state.player.specializedPaths?.[focus] || state.player.specializedPaths[focus].realmId <= 0) {
                state.ui.toast("Chưa dấn thân vào con đường chuyên sâu này!", "error");
                return;
            }
        }

        state.player.cultivationFocus = focus;
        this.refreshUI();
        if (state.ui && typeof state.ui.startQiBubbleSystem === 'function') {
            state.ui.startQiBubbleSystem();
        }
    }

    async embarkPath(pathId) {
        if (!state.player) return;
        const res = state.player.embarkPath(pathId);
        if (res.success) {
            state.ui.toast(res.msg, "success");
            this.refreshUI();
        } else {
            state.ui.toast(res.msg, "error");
        }
    }

    async convertMainPath(newPathId) {
        if (!state.player) return;
        const res = state.player.convertMainPath(newPathId);
        if (res.success) {
            state.ui.toast(res.msg, "success");
            this.refreshUI();
        } else {
            state.ui.toast(res.msg, "error");
        }
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

    /**
     * Thuê Ngộ Đạo Thất tại Vạn Bảo Các hoặc dùng phòng trong Động Phủ.
     * Khi thuê thành công, buff `ngo_dao_that` sẽ kích hoạt, tăng passive mastery ×10 trong suốt thời gian thuê.
     */
    async rentNgoDaoThat(source = 'shop') {
        if (!state.player) return;

        const now = Date.now();
        const existingBuff = (state.player.buffs || []).find(b => b.stat === 'mastery_speed' && b.id === 'ngo_dao_that' && b.endTime > now);
        if (existingBuff) {
            const remainingHours = Math.ceil((existingBuff.endTime - now) / 3600000);
            state.ui.toast(`Ngươi đang ở trong Ngộ Đạo Thất! Còn ${remainingHours} giờ hiệu lực.`, 'info');
            return;
        }

        // Pricing: 1 day (72h real) = 1000 LS, 3 days = 2500 LS, 7 days = 5000 LS
        const rentalOptions = [
            { label: '1 Ngày (1.000 Linh Thạch)', value: 1, price: 1000, icon: 'ph-moon' },
            { label: '3 Ngày (2.500 Linh Thạch)', value: 3, price: 2500, icon: 'ph-moon-stars' },
            { label: '7 Ngày (5.000 Linh Thạch)', value: 7, price: 5000, icon: 'ph-stars' },
        ];

        const days = await state.ui.promptOptions(
            '🏮 Thuê Ngộ Đạo Thất',
            rentalOptions,
            'Ngộ Đạo Thất được bố trí đặc biệt với linh khí cực kỳ nồng đậm, phủ kín trận pháp dẫn linh, giúp tốc độ lĩnh ngộ công pháp tăng gấp 10 lần. Chọn thời gian thuê phòng:'
        );

        if (!days) return;
        const option = rentalOptions.find(o => o.value === days);
        if (!option) return;

        // Check and deduct Linh Shi
        if ((state.player.lingShi || 0) < option.price) {
            state.ui.toast(`Không đủ Linh Thạch! Cần ${option.price.toLocaleString()} Linh Thạch.`, 'error');
            return;
        }

        state.player.spendLingShi(option.price);

        // Apply the Ngộ Đạo Thất buff
        const durationMs = days * 24 * 3600 * 1000; // Real-time milliseconds
        state.player.addBuff({
            id: 'ngo_dao_that',
            name: 'Ngộ Đạo Thất',
            desc: `Đang ở trong Ngộ Đạo Thất: tốc độ lĩnh ngộ tăng x10 trong ${days} ngày`,
            stat: 'mastery_speed',
            value: 10.0,
            duration: durationMs
        });

        state.ui.toast(
            `✨ Thuê Ngộ Đạo Thất thành công! Tốc độ lĩnh ngộ công pháp tăng x10 trong ${days} ngày!`,
            'success'
        );
        this.refreshUI();
    }

    async enterSeclusion() {
        if (!state.player) return;
        if (state.player.isSecluded) return;

        const options = [
            { label: 'Bế quan 1 năm (Cần 360 Tịch Cốc Đan)', value: 1, icon: 'ph-moon' },
            { label: 'Bế quan 10 năm (Cần 3600 Tịch Cốc Đan)', value: 10, icon: 'ph-moon-stars' },
            { label: 'Bế quan 50 năm (Cần 18000 Tịch Cốc Đan)', value: 50, icon: 'ph-stars' },
            { label: 'Bế quan 100 năm (Cần 36000 Tịch Cốc Đan)', value: 100, icon: 'ph-yin-yang' }
        ];

        const durationYears = await state.ui.promptOptions(
            "Định Hình Bế Quan",
            options,
            "Ngươi muốn bế quan trong bao lâu? Trong thời gian này, tu vi sẽ tăng trưởng vượt bậc nhưng thọ nguyên cũng sẽ cạn kiệt tương ứng. Bạn phải chuẩn bị đủ Tịch Cốc Đan tương ứng với số ngày bế quan."
        );

        if (!durationYears) return;

        // Verify player has enough Tịch Cốc Đan
        const requiredPills = durationYears * 360;
        let currentPills = 0;
        if (state.player.inventory && state.player.inventory.bags) {
            for (const bag of state.player.inventory.bags) {
                const item = bag.items.find(i => i.id === 'tich_coc_dan');
                if (item) {
                    currentPills += item.quantity;
                }
            }
        }

        if (currentPills < requiredPills) {
            state.ui.alert(
                `Hành động thất bại! Bế quan trong ${durationYears} năm yêu cầu phải có đủ <span class="text-red-400 font-bold">${requiredPills.toLocaleString()} viên Tịch Cốc Đan</span> (mỗi viên duy trì 1 ngày).<br><br>
                Hiện tại ngươi chỉ có <span class="text-yellow-400 font-bold">${currentPills.toLocaleString()} viên</span>. Hãy chuẩn bị thêm rồi quay lại!`,
                "Thiếu Tịch Cốc Đan"
            );
            return;
        }

        // Calculate total minutes: 12 months * 30 days * 12 hours = 4320 mins/year
        const totalMinutes = durationYears * 4320;
        const totalSeconds = totalMinutes * 60;

        // Calculate expected tuvi gain
        const focus = state.player.cultivationFocus || 'tuvi';
        const rate = focus === 'tuvi' ? state.player.tuViPerSecond : (focus === 'body' ? state.player.bodyExpPerSecond : state.player.soulExpPerSecond);
        const baseGainPerMins = rate * 60;
        const seclusionMult = 5.0;
        const totalGain = baseGainPerMins * totalMinutes * seclusionMult * (1 + (state.player.comprehension / 100));

        // Calculate expected mastery gain
        const now = Date.now();
        const ngoDaoThatBuff = (state.player.buffs || []).find(b => b.id === 'ngo_dao_that' && b.endTime > now);
        const masteryBuffMult = ngoDaoThatBuff ? ngoDaoThatBuff.value : 1.0;
        const compMult = 1.0 + (state.player.comprehension || 30) / 100;
        const basePassiveRate = 0.01; // pts/sec
        const totalMasteryGain = Math.floor(basePassiveRate * compMult * masteryBuffMult * totalSeconds);

        const ngoDaoThatLabel = ngoDaoThatBuff
            ? `<br><span class="text-purple-400 font-bold">🏮 Ngộ Đạo Thất đang hoạt động! Thuần thục công pháp tăng thêm khoảng ${totalMasteryGain.toLocaleString()} điểm.</span>`
            : `<br><span class="text-gray-500 text-xs">💡 Thuê Ngộ Đạo Thất tại Vạn Bảo Các để tăng thêm thuần thục công pháp trong khi bế quan.</span>`;

        const confirm = await state.ui.confirm(
            `Ngươi chắc chắn muốn tiêu hao <span class="text-yellow-400 font-bold">${requiredPills.toLocaleString()} viên Tịch Cốc Đan</span> để bế quan trong ${durationYears} năm?<br><br>Dự kiến tu vi sẽ tăng thêm khoảng <span class="text-green-400 font-bold">${Math.floor(totalGain).toLocaleString()}</span> điểm.${ngoDaoThatLabel}`,
            "Xác Nhận Nhập Định"
        );

        if (!confirm) return;

        // Consume Tịch Cốc Đan
        let remainingToConsume = requiredPills;
        for (const bag of state.player.inventory.bags) {
            const index = bag.items.findIndex(i => i.id === 'tich_coc_dan');
            if (index > -1) {
                const item = bag.items[index];
                if (item.quantity > remainingToConsume) {
                    item.quantity -= remainingToConsume;
                    remainingToConsume = 0;
                    break;
                } else {
                    remainingToConsume -= item.quantity;
                    bag.items.splice(index, 1);
                }
            }
        }

        state.ui.showLoading(true, "Đang thâm tầng định cảnh...");

        // Advance time
        if (state.systems.time) {
            state.systems.time.skipTime(totalMinutes);
        }

        // Apply Tu Vi / Body / Soul gain
        state.player.tuVi += (focus === 'tuvi' ? totalGain : totalGain * 0.2);
        state.player.bodyExp += (focus === 'body' ? totalGain : totalGain * 0.2);
        state.player.soulExp += (focus === 'soul' ? totalGain : totalGain * 0.2);

        // Apply Mastery Gain to all equipped techniques
        if (totalMasteryGain > 0) {
            const equippedIds = [
                state.player.mainTechniqueId,
                state.player.mainBodyTechniqueId,
                state.player.mainSoulTechniqueId
            ].filter(Boolean);
            const techSys = state.systems && state.systems.technique;
            equippedIds.forEach(tid => {
                if (techSys) techSys.addMastery(tid, totalMasteryGain);
                else {
                    const t = (state.player.learnedTechniques || []).find(l => l.id === tid);
                    if (t) t.mastery = (t.mastery || 0) + totalMasteryGain;
                }
            });
        }

        // Check for breakthroughs during seclusion
        state.player.isSecluded = true;
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
            if (state.systems.cheat) {
                state.systems.cheat.onAction('seclusion', 1);
            }
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

    async buySectScroll(itemId, cost) {
        if (!state.player) return;
        if ((state.player.sectContribution || 0) < cost) {
            state.ui.toast(`Cống hiến tông môn không đủ! Cần thêm ${cost - (state.player.sectContribution || 0)} điểm.`, "error");
            return;
        }

        // Receive item.
        const received = await this.receiveItem(itemId, 1);
        if (received) {
            state.player.sectContribution = (state.player.sectContribution || 0) - cost;
            state.ui.toast(`Đổi thành công tuyệt học tông môn!`, "success");
            this.refreshUI();
            this.saveGame();
        }
    }

    joinSect(sectId) {
        this.startSectApplication(sectId);
    }

    async startSectApplication(sectId) {
        const sect = getSectById(sectId);
        if (!sect) return;

        // Check level requirement
        if (state.player.realmId < sect.minRealm) {
            const requiredRealm = getRealmById(sect.minRealm);
            state.ui.alert(
                `Nguyên Anh áp lực ép xuống! Sơn môn kết giới ngăn cản bước chân ngươi.<br><br>
                <span class="text-red-500 font-bold">Yêu cầu cảnh giới đạt từ: ${requiredRealm.name}</span><br>
                Cảnh giới hiện tại của ngươi chưa đủ để vượt qua kết giới sơn môn. Hãy tu luyện thêm rồi quay lại!`,
                "Kết Giới Sơn Môn Ngăn Cản"
            );
            return;
        }

        const root = state.player.spiritualRoot;
        let rootStr = "Chưa giác ngộ";
        let rootPurity = 0;
        if (root) {
            const colors = { 'Kim': 'text-yellow-400', 'Mộc': 'text-green-400', 'Thủy': 'text-blue-400', 'Hỏa': 'text-red-400', 'Thổ': 'text-amber-600', 'Lôi': 'text-purple-400 animate-pulse' };
            const elementsHTML = root.elements.map(el => `<span class="${colors[el] || 'text-white'} font-bold">${el}</span>`).join(', ');
            rootStr = `${root.type} [${elementsHTML}]`;
            rootPurity = root.purity || 0;
        }

        // Welcome text
        const welcomeText = `
            Ngươi đi tới chân núi sơn môn nguy nga lộng lẫy của <span class="text-cultivation-gold font-bold font-ancient">${sect.name}</span>.<br><br>
            Khói sương mờ ảo bao phủ các tòa lầu các, linh khí xung quanh đậm đặc đến mức hóa thành các tia linh quang bay lượn. Đệ tử tuần tra mặc y phục trang trọng khẽ cản lại: "Đạo hữu dừng chân, đây là sơn môn trọng địa. Ngươi tới đây muốn bái phỏng hay muốn cầu kiến Bái Nhập môn hạ?"<br><br>
            Ngoại môn Khảo Hạch Trưởng Lão hiển lộ thân ảnh, dùng thần niệm dò xét ngươi: "Muốn nhập tông ta? Hiện nay <span class="text-red-400 font-bold">chưa tới thời điểm đại tuyển chính thức</span> (Đại tuyển mở vào tháng 1-2 năm chẵn). Tuy nhiên tông môn vẫn mở rộng cơ duyên đặc cách nếu ngươi có tư chất vạn người có một hoặc cống hiến Linh Thạch công đức đắp nền!"<br><br>
            <span class="text-gray-400 font-bold">Thông tin căn cốt của ngươi:</span><br>
            - Linh Căn: ${rootStr} (Tinh thuần: <span class="text-cultivation-gold font-bold">${rootPurity}%</span>)<br>
            - Căn cốt (Physique): <span class="text-qi-blue font-bold">${state.player.physiqueTalent || 10}</span><br>
            - Ngộ tính (Comprehension): <span class="text-qi-purple font-bold">${state.player.comprehension || 10}</span>
        `;

        const choiceOptions = [
            { label: "Dựa vào thiên tư bái nhập (Check tư chất)", value: "talent", icon: "ph-sparkles" },
            { label: "Quyên hiến 1000 Linh Thạch công đức", value: "donate", icon: "ph-coins" },
            { label: "Thôi bái biệt rời đi", value: "leave", icon: "ph-door-open" }
        ];

        const choice = await state.ui.promptOptions("Bái Nhập Tông Môn - " + sect.name, choiceOptions, welcomeText);
        if (!choice || choice === "leave") {
            state.ui.toast("Ngươi chào hỏi rời đi.", "info");
            return;
        }

        if (choice === "talent") {
            // Check if player is a genius
            const isGenius = (state.player.comprehension >= 30) || (state.player.physiqueTalent >= 40) || (rootPurity >= 80);
            if (isGenius) {
                state.player.sectId = sectId;
                state.player.sectContribution = 50; // Starter contribution
                state.player.addReputation(20);

                await state.ui.alert(
                    `Trưởng Lão khảo hạch trợn tròn hai mắt, mừng rỡ nắm lấy tay ngươi:<br><br>
                    "Trời ơi! Thần thể căn cốt cực thịnh, linh căn tinh thuần tuyệt diệu bực này, quả thực là thiên tài vạn năm khó gặp! Không cần đợi đến mùa tuyển, tông môn ta lập tức đặc cách thu nhận ngươi!"<br><br>
                    <span class="text-green-400 font-bold">Bái nhập thành công! Nhận được Lệnh bài Ngoại môn và 50 cống hiến!</span>`,
                    "Đặc Cách Thu Nhận!"
                );

                state.player.calculateStats();
                this.refreshUI();
                this.openSect();
                this.saveGame();
            } else {
                await state.ui.alert(
                    `Trưởng Lão khảo hạch rờ qua căn cốt, khẽ lắc đầu từ chối:<br><br>
                    "Tư chất của đạo hữu tuy trung quy trung củ, nhưng chưa đạt tới cấp bậc linh thể hay ngộ tính nghịch thiên để ta phá lệ đặc cách bái nhập off-season. Hãy quyên hiến công đức hoặc đợi mùa tuyển trạch chính thức!"`,
                    "Tư Chất Chưa Đạt"
                );
            }
        } else if (choice === "donate") {
            if (state.player.lingShi < 1000) {
                state.ui.toast("Ngươi không có đủ 1000 Linh Thạch!", "error");
                return;
            }
            state.player.spendLingShi(1000);
            state.player.sectId = sectId;
            state.player.sectContribution = 100; // Starter points
            state.player.addReputation(-10); // Slight negative for hối lộ/bribe

            await state.ui.alert(
                `Ngươi dâng lên túi càn khôn chứa đầy 1000 Linh Thạch sáng lấp lánh.<br><br>
                Trưởng Lão nhanh như chớp cất vào tay áo, nét mặt lập tức hòa ái, tươi cười vuốt râu: "Hảo! Đạo tâm kiên định hướng phái thế này quả thực hiếm thấy! Đan dược, công pháp tu hành luôn cần tài lực ủng hộ. Bản phái phá lệ thu nhận ngươi làm đệ tử!"<br><br>
                <span class="text-green-400 font-bold">Bái nhập thành công! Nhận được Lệnh bài Ngoại môn và 100 cống hiến!</span>`,
                "Bái Nhập Nhờ Công Đức"
            );

            state.player.calculateStats();
            this.refreshUI();
            this.openSect();
            this.saveGame();
        }
    }

    async startRecruitmentExam(sectId) {
        const sect = getSectById(sectId);
        if (!sect) return;

        // Check level requirement
        if (state.player.realmId < sect.minRealm) {
            const requiredRealm = getRealmById(sect.minRealm);
            state.ui.alert(
                `Nguyên Anh áp lực ép xuống! Sơn môn kết giới ngăn cản bước chân ngươi.<br><br>
                <span class="text-red-500 font-bold">Yêu cầu cảnh giới đạt từ: ${requiredRealm.name}</span><br>
                Cảnh giới hiện tại của ngươi chưa đủ để vượt qua kết giới sơn môn. Hãy tu luyện thêm rồi quay lại!`,
                "Kết Giới Sơn Môn Ngăn Cản"
            );
            return;
        }

        // Welcome introduction
        const introText = `Ngươi bước tới sơn môn của <span class="text-cultivation-gold font-bold font-ancient">${sect.name}</span>.<br><br>
            Hai vị đệ tử gác cổng mặc y phục tiên phong đạo cốt chắp tay hành lễ: "Hôm nay sơn môn đại mở chiêu mộ đệ tử phong vân, đạo hữu tới đây muốn bái nhập tông môn ta sao?"<br><br>
            Ngươi được dẫn vào bên trong đại điện bái kiến Ngoại Môn Khảo Hạch Trưởng Lão. Vị trưởng lão râu tóc bạc phơ, ánh mắt như điện nhìn thẳng vào ngươi: "Muốn nhập tông ta, trước tiên phải qua khảo hạch tuyển chọn."`;

        const confirmExam = await state.ui.confirm(introText, "Khảo Hạch Gia Nhập - " + sect.name);
        if (!confirmExam) {
            state.ui.toast("Ngươi quyết định rời đi.", "info");
            return;
        }

        // Stage 1: Elder's Question (Dao Heart & Intention)
        const qTitle = "Khảo Hạch Tâm Tính";
        const qDesc = `Trưởng Lão vuốt râu hỏi: "Hỏi thế gian tu tiên vì cớ gì? Đạo tâm của ngươi hướng về điều chi khi bước chân vào con đường nghịch thiên cải mệnh này?"`;
        const qOptions = [
            { label: "Cầu trường sinh bất tử, siêu thoát luân hồi", value: "immortality", icon: "ph-shield-star" },
            { label: "Bảo vệ nhân gian, diệt trừ tà ma, hộ đạo hộ sinh", value: "righteousness", icon: "ph-heart" },
            { label: "Mưu cầu sức mạnh tuyệt đối, ngạo thị quần hùng", value: "power", icon: "ph-sword" }
        ];

        const choice1 = await state.ui.promptOptions(qTitle, qOptions, qDesc);
        if (!choice1) return;

        let elderReaction = "";
        if (choice1 === "immortality") {
            elderReaction = `Trưởng Lão khẽ gật đầu: "Tu tiên vì trường sinh, chí hướng căn bản của chúng tu sĩ, đạo tâm vô cùng thuần phác."`;
        } else if (choice1 === "righteousness") {
            elderReaction = `Trưởng Lão mỉm cười tán thưởng: "Hảo! Tâm hoài thiên hạ, có tư chất trở thành trụ cột của chính đạo."`;
            state.player.addMorality(10); // Moral boost!
        } else {
            elderReaction = `Trưởng Lão ánh mắt lóe lên: "Mưu cầu lực lượng? Tuy thẳng thắn nhưng dễ sa đọa vào ma đạo, cần phải mài giũa thêm."`;
            state.player.addMorality(-10); // Slight chaotic shift
        }

        // Stage 2: Spiritual Root Test
        const root = state.player.spiritualRoot;
        let rootEvaluation = "";
        let passesRootCheck = true;

        if (root) {
            const elementsStr = root.elements.map(el => {
                const colors = { 'Kim': 'text-yellow-400', 'Mộc': 'text-green-400', 'Thủy': 'text-blue-400', 'Hỏa': 'text-red-400', 'Thổ': 'text-amber-600', 'Lôi': 'text-purple-400 animate-pulse' };
                return `<span class="${colors[el] || 'text-white'} font-bold">${el}</span>`;
            }).join(', ');

            rootEvaluation = `Tiếp theo, Trưởng Lão đưa ra một miếng Hỗn Nguyên Kiểm Trắc Thạch: "Đặt tay lên đây, kích hoạt linh lực đo đạc linh căn linh tính."<br><br>
                Ngươi đặt tay lên linh thạch. Chỉ trong chốc lát, linh thạch tỏa ra hào quang rực rỡ, hiển thị <span class="font-bold font-ancient">${root.type}</span> gồm: [${elementsStr}] với độ tinh thuần cực cao đạt <span class="text-cultivation-gold font-bold">${root.purity}%</span>.<br><br>`;

            // Specific Sect logic for Spiritual Roots
            if (sectId === 'hoang_phong_coc') {
                if (root.id === 'thien_linh_can' || root.id === 'di_linh_can') {
                    rootEvaluation += `Trưởng Lão kinh ngạc đứng phắt dậy: "Trời cao ban ơn! Lại là ${root.type}! Tông môn ta đắc ý chí tôn linh căn thế này, tương lai đại hưng!"`;
                } else if (root.id === 'song_linh_can' || root.id === 'tam_linh_can') {
                    rootEvaluation += `Trưởng Lão gật đầu vui vẻ: "Tư chất trung thượng, Ngũ Hành Thuật Pháp của Hoàng Phong Cốc ta sẽ rất phù hợp với linh căn của ngươi."`;
                } else {
                    rootEvaluation += `Trưởng Lão khẽ chau mày thở dài: "${root.type}, tạp chất quá nhiều, tốc độ tu luyện cực chậm... Tuy nhiên Hoàng Phong Cốc hữu giáo vô loại, chỉ cần đạo tâm vững vàng vẫn có cơ hội."`;
                }
            } else if (sectId === 'thien_kiem_tong') {
                const hasKim = root.elements.includes('Kim');
                const hasLei = root.elements.includes('Lôi');
                if (hasKim || hasLei) {
                    rootEvaluation += `Trưởng Lão đại hỉ: "Tốt! Linh căn chứa linh tính ${hasKim ? 'Kim' : 'Lôi'}, cực kỳ thích hợp để tu luyện Kiếm Ý sắc bén vô song của Thiên Kiếm Tông!"`;
                } else if (root.id === 'thien_linh_can' || root.id === 'di_linh_can') {
                    rootEvaluation += `Trưởng Lão hài lòng: "Dù không phải Kim hệ nhưng ${root.type} là kỳ tài trăm năm khó gặp, kiếm đạo vạn pháp quy tông, gia nhập rất tốt!"`;
                } else {
                    rootEvaluation += `Trưởng Lão chần chừ: "Kiếm đạo cần sự thuần túy sắc bén. Linh căn của ngươi quá hỗn tạp, sợ rằng kiếm ý sẽ bị phân tán, rất khó ngộ kiếm..."`;
                    if (state.player.comprehension < 40) {
                        passesRootCheck = false;
                    }
                }
            } else if (sectId === 'huyen_am_coc') {
                const hasDark = root.elements.includes('Thủy') || root.elements.includes('Thổ') || root.elements.includes('Lôi') || root.elements.includes('Băng') || root.elements.includes('Phong');
                if (state.player.fate.morality < 0) {
                    rootEvaluation += `Trưởng Lão cười khà khà quỷ dị: "Đạo tâm mang sát khí, sát phạt quả quyết! Rất tốt, Huyền Âm Cốc ta thích nhất hạng tu sĩ phóng túng càn quấy này!"`;
                } else if (hasDark) {
                    rootEvaluation += `Trưởng Lão gật gù sương khói: "Hàn khí/âm khí dồi dào, thân thể rất thích hợp luyện chế thi khôi và ngự quỷ thuật."`;
                } else {
                    rootEvaluation += `Trưởng Lão hừ lạnh: "Chính khí quá thịnh, hoặc linh căn quá thuần dương, e rằng không dung hợp được với U Minh Quy Tắc của cốc ta..."`;
                    if (state.player.luck < 30) {
                        passesRootCheck = false;
                    }
                }
            } else {
                // Dynamic alignment assessments for newly added sects
                if (sect.isDemonic) {
                    // Demonic Sect Check
                    const moralityVal = state.player.fate ? (state.player.fate.morality || 0) : 0;
                    if (moralityVal > 30) {
                        rootEvaluation += `Trưởng Lão hừ lạnh một tiếng, quanh thân ma khí cuồn cuộn: "Hừ! Trên người ngươi toát ra một mùi hạo nhiên chính khí vô cùng khó ngửi! Huyền môn chính đạo ngoan cố e rằng không chịu nổi u sầu quy tắc cốc ta!"`;
                        if (state.player.luck < 40) {
                            passesRootCheck = false;
                        }
                    } else if (moralityVal < -10) {
                        rootEvaluation += `Trưởng Lão nở nụ cười dữ tợn tán thưởng: "Hắc hắc, tốt! Đạo tâm mang theo ma tính cuồng phóng, phi thường hợp khẩu vị ma môn cốc ta!"`;
                    } else {
                        rootEvaluation += `Trưởng Lão vuốt cằm bình thản: "Tư chất tuy bình thường, nhưng chỉ cần dám ra tay độc ác dứt khoát, vẫn có thể trở thành nanh vuốt ma môn ta."`;
                    }
                } else {
                    // Righteous Sect Check
                    const moralityVal = state.player.fate ? (state.player.fate.morality || 0) : 0;
                    if (moralityVal < -30) {
                        rootEvaluation += `Trưởng Lão sắc mặt lập tức trầm xuống, mắt mở trừng trừng nghiêm nghị: "Càn khôn chính đạo, bất dung ma khí! Thân thể ngươi sát nghiệt nặng nề, ma tâm che lấp linh trí, làm sao bái nhập thanh tu chi môn của ta?!"`;
                        if (state.player.luck < 40) {
                            passesRootCheck = false;
                        }
                    } else if (moralityVal > 10) {
                        rootEvaluation += `Trưởng Lão nụ cười ôn hòa như gió xuân gật gù: "Hảo! Khí chất trong sạch cương chính, tâm tính đoan chính phi thường thích hợp tu tập huyền môn diệu pháp của ta."`;
                    } else {
                        rootEvaluation += `Trưởng Lão cười khẽ chỉ giáo: "Đo lường bình hòa, tâm tính thiện ác trung lập, sau khi vào tông môn hãy nỗ lực hành thiện tích đức."`;
                    }
                }
            }
        } else {
            rootEvaluation = `Trưởng Lão xem xét cơ thể ngươi: "Nhục thân phàm nhân phi thường bình thường, không cảm ứng được linh thạch..."`;
            passesRootCheck = false;
        }

        await state.ui.alert(`${elderReaction}<br><br>${rootEvaluation}`, "Khảo Hạch Linh Căn");

        if (!passesRootCheck) {
            const canBribe = state.player.lingShi >= 500;
            const briberyText = canBribe ? `<br><br><span class="text-yellow-400 font-bold">Lựa chọn bí mật:</span> Ngươi có muốn lén lút "biếu" Trưởng Lão 500 Linh Thạch để ngài du di thông qua không?` : '';

            const bribeOptions = [
                { label: "Bái tạ rời đi, lần sau quay lại", value: "leave", icon: "ph-door-open" }
            ];
            if (canBribe) {
                bribeOptions.unshift({ label: "Biếu 500 Linh Thạch lót đường (Hối lộ)", value: "bribe", icon: "ph-coins" });
            }

            const bribeChoice = await state.ui.promptOptions("Kết Quả Khảo Hạch", bribeOptions, `Trưởng Lão lạnh lùng phất tay: "Tư chất quá kém, linh căn không hợp quy cách, không thể bái nhập tông môn ta! Hãy trở về đi!"${briberyText}`);

            if (bribeChoice === "bribe") {
                state.player.spendLingShi(500);
                state.player.addReputation(-20);
                state.player.addMorality(-15);
                state.ui.toast("Trưởng Lão khẽ vuốt tay, 500 linh thạch biến mất, ngài ho một tiếng gật đầu thông qua!", "success");
            } else {
                state.ui.toast("Ngươi đã trượt khảo hạch linh căn.", "warning");
                return;
            }
        }

        // Stage 3: Willpower & Attribute Check
        const finalTitle = "Thử Thách Ý Chí";
        const finalDesc = `Khảo hạch cuối cùng! Trưởng Lão vận hành Nguyên Anh oai áp bao trùm cả điện, không khí ngưng đọng cực độ nặng nề tựa ngàn cân ép xuống. Ngươi sẽ làm gì?`;
        const finalOptions = [
            { label: "Vận hành nhục thân khí huyết cưỡng kháng (Căn cốt check)", value: "physique", icon: "ph-barbell" },
            { label: "Giữ vững Đạo tâm như bàn thạch, tĩnh tâm chống đỡ (Đạo tâm check)", value: "daotam", icon: "ph-shield-chevron" },
            { label: "Vận dụng ngộ tính tìm kiếm kẽ hở luồng khí áp (Ngộ tính check)", value: "comprehension", icon: "ph-brain" }
        ];

        const choice3 = await state.ui.promptOptions(finalTitle, finalOptions, finalDesc);
        if (!choice3) return;

        let finalSuccess = false;
        let finalResultText = "";

        if (choice3 === "physique") {
            const checkVal = state.player.physiqueTalent || 50;
            if (checkVal >= 35) {
                finalSuccess = true;
                finalResultText = `Căn cốt dồi dào khí huyết toàn thân bộc phát như long hổ! Thân thể ngươi sừng sững gánh chịu toàn bộ uy áp Nguyên Anh mà không hề dao động.<br><br>
                    Trưởng Lão cười lớn đầy đắc ý: "Thần thể tráng kiện! Căn cốt tuyệt hảo! Ngươi chính là khối ngọc thô hiếm có!"`;
            } else {
                finalResultText = `Xương cốt vang lên những tiếng răng rắc đau đớn, khí huyết nghịch lưu phun ra ngụm máu tươi, ngươi khuỵu gối xuống nền đại điện.<br><br>
                    Trưởng Lão thở dài lắc đầu: "Nhục thân quá mức bạc nhược, không chịu nổi thiên phong thối luyện."`;
            }
        } else if (choice3 === "daotam") {
            const checkVal = state.player.daoTam || 50;
            if (checkVal >= 35) {
                finalSuccess = true;
                finalResultText = `Đạo tâm kiên định tựa thái sơn hằng cổ! Linh hồn tĩnh lặng không gợn sóng, phong ba bão táp Nguyên Anh áp lực chỉ như làn gió thoảng qua tai.<br><br>
                    Trưởng Lão chắp tay khen ngợi: "Ý chí vô song! Đạo tâm cứng cỏi như bàn thạch thế này, tương lai tu tiên lộ chắc chắn tiến cực xa!"`;
            } else {
                finalResultText = `Linh hồn rung chuyển kịch liệt, tâm ma thừa cơ cắn trả làm đầu óc trống rỗng hỗn loạn, ngã nhào ra đất thở dốc.<br><br>
                    Trưởng Lão lắc đầu nguội lạnh: "Ý chí bạc nhược, đạo tâm dao động, e là dễ sa chân ngã ngựa."`;
            }
        } else if (choice3 === "comprehension") {
            const checkVal = state.player.comprehension || 10;
            if (checkVal >= 20) {
                finalSuccess = true;
                finalResultText = `Thần thức nhạy bén cực độ! Trong nháy mắt, ngươi ngộ ra dòng chảy quy luật uy áp của Trưởng Lão, khéo léo lách mình nương theo luồng lực lượng mà hóa giải hoàn toàn oai áp.<br><br>
                    Trưởng Lão vuốt râu kinh ngạc thốt lên: "Ngộ tính kinh người! Cảm ngộ thiên địa huyền diệu cực kỳ nhanh chóng! Thật sự là thiên kiêu ngộ tính!"`;
            } else {
                finalResultText = `Cố gắng cảm ngộ nhưng trí óc mù tịt, lực lượng bá đạo Nguyên Anh ép thẳng vào kinh mạch khiến ngươi ngất xỉu chốc lát.<br><br>
                    Trưởng Lão lạnh lùng thở dài: "Tư chất ngộ tính quá tầm thường, khó mà lĩnh ngộ đại đạo huyền pháp."`;
            }
        }

        await state.ui.alert(finalResultText, "Kết Quả Khảo Hạch Ý Chí");

        if (finalSuccess) {
            // Welcome to the sect!
            state.player.sectId = sectId;
            state.player.sectContribution = 100;

            // Add starter items or money
            state.player.addLingShi(200);

            let giftMsg = "Được ban tặng: Lệnh Bài Ngoại Môn, 200 Linh Thạch và 100 Điểm Cống Hiến!";

            state.ui.alert(
                `🎉 <span class="text-green-400 font-bold font-charm">CHÚC MỪNG GIA NHẬP!</span> 🎉<br><br>
                Trưởng Lão mỉm cười đưa ra một chiếc Lệnh Bài Tông Môn: "Kể từ hôm nay, ngươi chính là đệ tử chính thức của <span class="text-cultivation-gold font-bold font-ancient">${sect.name}</span>! Hãy nỗ lực tu hành, cống hiến vì tông môn!"<br><br>
                <span class="text-qi-blue font-bold">${giftMsg}</span>`,
                "Bái Nhập Thành Công!"
            );

            state.player.calculateStats();
            this.refreshUI();
            this.openSect();
        } else {
            state.ui.toast("Khảo hạch thất bại. Hãy tu luyện thêm để thử thách lại!", "error");
        }
    }

    doMission(missionId) {
        if (!state.player.sectId) {
            state.ui.toast("Ngươi chưa gia nhập tông môn nào!", "error");
            return;
        }

        const sect = getSectById(state.player.sectId);
        if (!sect) {
            state.ui.toast("Không tìm thấy dữ liệu tông môn!", "error");
            return;
        }

        const mission = sect.missions.find(m => m.id === missionId);
        if (!mission) {
            state.ui.toast("Nhiệm vụ không tồn tại!", "error");
            return;
        }

        if (state.player.stamina < mission.stamina) {
            state.ui.toast(`Không đủ thể lực! Yêu cầu: ${mission.stamina} điểm.`, "error");
            return;
        }

        // Deduct stamina
        state.player.stamina -= mission.stamina;

        // Process rewards
        let rewardMsg = [];
        if (mission.reward.contribution) {
            state.player.sectContribution = (state.player.sectContribution || 0) + mission.reward.contribution;
            rewardMsg.push(`+${mission.reward.contribution} Điểm Cống Hiến`);
        }
        if (mission.reward.tuVi) {
            state.player.addTuVi(mission.reward.tuVi);
            rewardMsg.push(`+${mission.reward.tuVi} Tu Vi`);
        }
        if (mission.reward.lingShi) {
            state.player.addLingShi(mission.reward.lingShi);
            rewardMsg.push(`+${mission.reward.lingShi} Linh Thạch`);
        }

        // Play success effects
        state.ui.toast(`Ủy thác thành công: ${mission.name}! (${rewardMsg.join(', ')})`, "success");

        if (state.systems.cheat) {
            state.systems.cheat.onAction('do_mission', 1);
        }

        this.refreshUI();
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

    async setMainTechnique(id, method = null) {
        if (!state.player) return;

        const result = state.player.setMainTechnique(id, method);

        if (result && result.requireConfirmation) {
            if (result.type === 'secret') {
                // Bí pháp: hỏi đơn giản
                state.ui.showModal({
                    title: "TRANG BỊ BÍ PHÁP",
                    message: result.msg,
                    confirmText: "ĐỒNG Ý",
                    cancelText: "HỦY BỎ",
                    icon: "ph-warning",
                    showCancel: true,
                    onConfirm: () => {
                        this.setMainTechnique(id, 'equip_secret');
                    }
                });
            } else {
                // Công pháp: hiển thị 3 lựa chọn
                const hasPill = state.player.inventory.hasItem('hoa_nguyen_dan', 1);
                const perception = state.player.advancedStats?.perception || 0;
                const canTransform = perception >= 50 || state.player.realmId >= 10;

                const options = [
                    {
                        label: '⚡ Tán Công Trùng Tu — Mất 50% Tu Vi, giảm Đạo Tâm',
                        value: 'tan_cong',
                        icon: 'ph-lightning'
                    },
                    {
                        label: `💠 Dùng Hóa Nguyên Đan — An toàn ${hasPill ? '(Có sẵn ×1)' : '(Chưa có!)'}`,
                        value: 'hoa_nguyen_dan',
                        icon: 'ph-pill'
                    },
                    {
                        label: `🔄 Chuyển Hóa Pháp Lực — Suy nhược 10 phút ${canTransform ? '(Đủ điều kiện)' : '(Chưa đủ cảnh giới!)'}`,
                        value: 'chuyen_hoa',
                        icon: 'ph-arrows-clockwise'
                    }
                ];

                const chosen = await state.ui.promptOptions(
                    '⚠️ CẢNH BÁO PHẢN PHỆ',
                    options,
                    `<b>Thay đổi công pháp chủ tu rất nguy hiểm!</b><br><br>` +
                    `Mỗi công pháp có đường vận hành, cấu trúc pháp lực và thuộc tính khác nhau. ` +
                    `Đổi giữa chừng sẽ gây pháp lực xung đột, kinh mạch tổn thương, thậm chí tử vong.<br><br>` +
                    `Hãy chọn phương thức chuyển đổi:`
                );

                if (chosen) {
                    this.setMainTechnique(id, chosen);
                }
            }
        } else if (result && result.success) {
            let successMsg = "Đã thiết lập làm Công Pháp Chủ Tu!";
            if (method === 'tan_cong') {
                successMsg = "⚡ Tán công trùng tu thành công! Kinh mạch chấn động, tu vi tổn hao 50%...";
                state.ui.screenShake('high');
            } else if (method === 'hoa_nguyen_dan') {
                successMsg = "💠 Hóa Nguyên Đan phát tác, pháp lực chuyển hóa viên mãn! Tu vi bảo toàn.";
            } else if (method === 'chuyen_hoa') {
                successMsg = "🔄 Chuyển hóa pháp lực thành công! Nhưng thân thể suy nhược tạm thời...";
            }
            state.ui.toast(successMsg, "success");
            if (this.screens.systems) {
                this.screens.systems.renderTechniqueDetail(id, false);
            }
        } else {
            state.ui.toast(result?.msg || "Không thể thiết lập Công Pháp này!", "error");
        }
        this.refreshUI();
    }

    createCustomTechnique(name, element, chosenStats, chosenEffects) {
        if (state.systems.technique) {
            const res = state.systems.technique.createCustomTechnique(name, element, chosenStats, chosenEffects);
            if (res.success) {
                state.ui.toast(res.msg, 'success');
                if (this.screens.systems) {
                    this.screens.systems.renderTechniques('linh_luc');
                }
            } else {
                state.ui.toast(res.msg, 'error');
            }
            this.refreshUI();
            return res;
        }
        return { success: false, msg: "Lỗi hệ thống công pháp." };
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

    handleCombatEncounter(worldId, locId, onEnd = null, overrideImage = null) {
        const loc = getLocationById(worldId, locId);
        const enemy = EnemyGenerator.generate(loc?.dangerLevel || 1);
        if (overrideImage) enemy.image = overrideImage;
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
                const isGridExploration = !!state.player?.gridExplorationState;
                const lootScreenOpened = combat?.lootScreenOpened;

                if (!isGridExploration || !lootScreenOpened) {
                    // Collect all loot to show in one flashy popup if needed
                    const loot = combat.enemy.inventory || [];
                    for (const item of loot) {
                        await window.game.receiveItem(item.id, item.quantity);
                    }
                }
                const tuvi = combat.enemy.realmId * 50;
                state.player.addTuVi(tuvi);
                state.ui.toast(`Chiến thắng! Nhận được ${tuvi} Tu Vi.`, 'success');

                // Update Sect Mission progress
                if (state.player.sectId && window.game.systems?.sect) {
                    window.game.systems.sect.updateMissionProgress('kill', combat.enemy.name || '', 1);
                }
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
            if (state.currentCombat._escapeTimeout) {
                clearTimeout(state.currentCombat._escapeTimeout);
                state.currentCombat._escapeTimeout = null;
            }
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
        let npcObj = npc;
        if (typeof npc === 'string') {
            npcObj = state.systems.npc?.npcs.find(n => n.id === npc) || state.systems.npc?.npcs.find(n => n.templateId === npc);
        }
        if (npcObj && this.screens.systems) {
            this.screens.systems.renderNPCDialogue(npcObj);
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

    openAvatarSelector() {
        const modal = document.getElementById('creation-avatar-modal');
        if (modal) {
            modal.classList.remove('hidden');
            if (state.systems.creation) {
                state.systems.creation.avatarFilterGender = state.systems.creation.playerGender;
                state.systems.creation.avatarFilterRace = 'all';
            }
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    closeAvatarSelector() {
        const modal = document.getElementById('creation-avatar-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    filterAvatarGender(gender) {
        if (state.systems.creation) {
            const slug = (gender === 'male' || gender === 'Nam') ? 'male' : (gender === 'female' || gender === 'Nữ') ? 'female' : 'all';
            state.systems.creation.avatarFilterGender = slug;
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    filterAvatarRace(race) {
        if (state.systems.creation) {
            state.systems.creation.avatarFilterRace = race;
            if (typeof window.renderCreationScreen === 'function') window.renderCreationScreen();
        }
    }

    selectCreationGender(gender) {
        if (state.systems.creation) {
            const slug = (gender === 'male' || gender === 'Nam') ? 'male' : 'female';
            state.systems.creation.playerGender = slug;
            state.systems.creation.playerAvatar = slug === 'male' ? 'player_male' : 'player_female';
            state.systems.creation.avatarFilterGender = slug;
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
            state.systems.creation.toggleRootElement(element);
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
            state.systems.creation.adjustNormalElementProportion(element, value);
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

    openCreationSelectionModal(type) {
        if (typeof window.openCreationSelectionModal === 'function') {
            window.openCreationSelectionModal(type);
        }
    }

    closeCreationSelectionModal() {
        if (typeof window.closeCreationSelectionModal === 'function') {
            window.closeCreationSelectionModal();
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

    previewAvatar(url, name) {
        const modal = document.getElementById('creation-avatar-full-modal');
        const img = document.getElementById('creation-avatar-full-img');
        const nameEl = document.getElementById('creation-avatar-full-name');

        if (modal && img && nameEl) {
            img.src = url;
            nameEl.textContent = name;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }

    closeAvatarPreview() {
        const modal = document.getElementById('creation-avatar-full-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }
}
