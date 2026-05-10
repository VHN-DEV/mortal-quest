import './styles/main.css';
console.log("%c🌌 Mortal Quest: Phàm Nhân Vấn Đạo - Khởi Động...", "color: #d4af37; font-size: 16px; font-weight: bold;");
import { Player } from './core/player.js';
import { SaveSystem } from './core/save-system.js';
import { EnemyGenerator, Enemy } from './core/enemy.js';
import { CombatEngine } from './core/combat-engine.js';
import { getItemById } from './configs/item-data.js';
import { getWorlds, getLocationById } from './configs/map-data.js';
import { getRandomEvent } from './configs/event-data.js';
import { ASSETS } from './configs/asset-data.js';
import { NPCSystem } from './systems/npc-system.js';
import { getRealmById } from './configs/realm-data.js';
import { ShopSystem } from './systems/shop-system.js';
import { AlchemySystem } from './systems/alchemy-system.js';
import { GuildSystem } from './systems/guild-system.js';
import { GardenSystem } from './systems/garden-system.js';
import { MountainSystem } from './systems/mountain-system.js';
import { ALCHEMY_RECIPES, getAlchemyLevelInfo } from './configs/alchemy-data.js';
import { SEEDS } from './configs/garden-data.js';
import { MOUNTAIN_LAYERS } from './configs/mountain-data.js';
import { ALCHEMY_CERTIFICATIONS, GUILD_MISSIONS, ALCHEMY_ROOMS } from './configs/guild-data.js';
import { TOWER_LEVELS, TOWER_MASTERS } from './configs/tower-data.js';
import { SECTS, getSectById } from './configs/sect-data.js';
import { DestinySystem } from './systems/destiny-system.js';
import { NPC_STORIES } from './configs/npc-story-data.js';
import { UISystem } from './ui/ui-system.js';
import { TimeSystem } from './systems/time-system.js';
import { CraftingSystem } from './systems/crafting-system.js';
import { FormationSystem } from './systems/formation-system.js';
import { TalismanSystem } from './systems/talisman-system.js';
import { TALISMAN_RECIPES, getTalismanLevelInfo } from './configs/talisman-data.js';
import { SmithingSystem } from './systems/smithing-system.js';
import { SMITHING_RECIPES, getSmithingLevelInfo } from './configs/smithing-data.js';
import { BeastSystem } from './systems/beast-system.js';
import { CorpseSystem } from './systems/corpse-system.js';
import { BEASTS, BEAST_TYPES, getBeastLevelInfo } from './configs/beast-data.js';
import { TechniqueSystem } from './systems/technique-system.js';
import { TECHNIQUES, SECRET_TECHNIQUES, getTechniqueById, getSecretTechniqueById, TECHNIQUE_LEVELS, MASTERY_LEVELS } from './configs/technique-data.js';
import { CreationSystem } from './systems/creation-system.js';
import { CREATION_ROOTS, CREATION_PHYSIQUES, CREATION_ORIGINS, CREATION_TRAITS, CREATION_SCENARIOS } from './configs/creation-data.js';

// Global error handler
window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.error('Thiên Cơ Hỗn Loạn:', msg, '\nTại:', url, ':', lineNo, ':', columnNo, '\nChi tiết:', error);
    return false;
};

// State
let player, shopSystem, alchemySystem, guildSystem, gardenSystem, mountainSystem, ui, timeSystem, craftingSystem, formationSystem, talismanSystem, smithingSystem, beastSystem, corpseSystem, techniqueSystem, creationSystem;
let currentCombat = null;
let currentNPC = null;
let selectedItemId = null;
let currentWorldId = 'nhan_gioi';
let currentLocId = null;
let explorationProgress = 0;
let shopView = 'buy';
let alchemyView = 'recipes';
let beastView = 'list';
let currentDestiny = null;
let techView = 'cultivation';
let selectedTechId = null;

// DOM Elements
const screens = document.querySelectorAll('.screen');
const navButtons = document.querySelectorAll('.nav-item');
console.log(`[UI] Đã tìm thấy ${screens.length} màn hình và ${navButtons.length} nút điều hướng.`);
const elHeaderPortrait = document.getElementById('header-portrait');
const elPlayerNameHeader = document.getElementById('player-name-header');
const elLingShiText = document.getElementById('ling-shi-text');
const elRealm = document.getElementById('current-realm');
const elProgress = document.getElementById('tu-vi-progress');
const elTuViText = document.getElementById('tu-vi-text');
const elPerSec = document.getElementById('tu-vi-per-sec');
const btnCultivate = document.getElementById('cultivate-btn');
const elAuraGlow = document.getElementById('aura-glow');
const elAuraBorder = document.getElementById('aura-border');
const autoCultivateToggle = document.getElementById('auto-cultivate-toggle');
let autoCultivateInterval = null;
const btnBreakthrough = document.getElementById('breakthrough-btn');

// Map
const viewWorlds = document.getElementById('map-world-view');
const viewLocations = document.getElementById('map-location-view');
const viewExplore = document.getElementById('map-explore-view');
const elWorldList = document.getElementById('world-list');
const elLocList = document.getElementById('location-list');
const elCurrentWorldName = document.getElementById('current-world-name');
const elCurrentLocName = document.getElementById('current-location-name');
const elExploreEvent = document.getElementById('explore-event-display');
const elExploreBar = document.getElementById('explore-bar');
const elExploreProgress = document.getElementById('explore-progress');
const elStaminaBar = document.getElementById('explore-stamina-bar');
const elManaBar = document.getElementById('explore-mana-bar');
const btnMove = document.getElementById('btn-move');
const btnEnterShop = document.getElementById('btn-enter-shop');
const btnEnterSect = document.getElementById('btn-enter-sect');
const btnEnterGuild = document.getElementById('btn-enter-guild');
const btnEnterTower = document.getElementById('btn-enter-tower');
const btnEnterMountain = document.getElementById('btn-enter-mountain');
const btnBackToWorlds = document.getElementById('back-to-worlds');
const btnBackToLocs = document.getElementById('back-to-locations');
const btnLeaveLoc = document.getElementById('btn-leave-loc');

// Character Tab
const elCharHp = document.getElementById('char-hp');
const elCharAtk = document.getElementById('char-atk');
const elCharDef = document.getElementById('char-def');
const elCharSpd = document.getElementById('char-spd');
const elCharMana = document.getElementById('char-mana');
const elCharSectInfo = document.getElementById('char-sect-info');
const equipmentSlots = document.querySelectorAll('.equipment-slot');

// NPC Overlay
const overlayNPC = document.getElementById('npc-overlay');
const elNpcPortrait = document.getElementById('npc-portrait');
const elNpcTitle = document.getElementById('npc-title');
const elNpcName = document.getElementById('npc-name');
const elNpcRealm = document.getElementById('npc-realm');
const elNpcDialogue = document.getElementById('npc-dialogue-box');
const btnNpcTalk = document.getElementById('btn-npc-talk');
const btnNpcTrade = document.getElementById('btn-npc-trade');
const btnNpcAttack = document.getElementById('btn-npc-attack');
const btnNpcLeave = document.getElementById('btn-npc-leave');

// Time HUD
const elTimeHour = document.getElementById('time-hour');
const elTimePeriod = document.getElementById('time-period');
const elTimeSeason = document.getElementById('time-season');
const elTimeDate = document.getElementById('time-date');
const elTimePhenomenon = document.getElementById('time-phenomenon');
const elApp = document.getElementById('app');
const btnSeclusion = document.getElementById('seclusion-btn');
const elCharAge = document.getElementById('char-age');

// Shop Overlay
const overlayShop = document.getElementById('shop-overlay');
const elShopBuyView = document.getElementById('shop-buy-view');
const elShopSellView = document.getElementById('shop-sell-view');
const elShopSellGrid = document.getElementById('shop-sell-grid');
const elShopLingShi = document.getElementById('shop-ling-shi');
const btnShopTabBuy = document.getElementById('shop-tab-buy');
const btnShopTabSell = document.getElementById('shop-tab-sell');
const btnCloseShop = document.getElementById('close-shop-btn');
const elShopSectionNav = document.getElementById('shop-section-nav');

// Sect Overlay
const overlaySects = document.getElementById('sects-overlay');
const btnCloseSects = document.getElementById('close-sects-btn');

// Inventory
const elInventoryGrid = document.getElementById('inventory-grid');
const elInventoryCapacity = document.getElementById('inventory-capacity');
const btnInventorySort = document.getElementById('btn-inventory-sort');
const elItemDetail = document.getElementById('item-detail');
const elDetailIcon = document.getElementById('detail-icon');
const elDetailName = document.getElementById('detail-name');
const elDetailType = document.getElementById('detail-type');
const elDetailDesc = document.getElementById('detail-desc');
const btnUseItem = document.getElementById('btn-use-item');
const btnEquipItem = document.getElementById('btn-equip-item');

// Battle
const overlayBattle = document.getElementById('battle-overlay');
const elBattlePlayerName = document.getElementById('battle-player-name');
const elBattleEnemyName = document.getElementById('battle-enemy-name');
const elEnemyImg = document.getElementById('enemy-img');
const elBattleLog = document.getElementById('battle-log');
const battleActions = document.getElementById('battle-actions');
const btnAttack = document.getElementById('btn-attack');
const btnDefend = document.getElementById('btn-defend');
const btnSkill = document.getElementById('btn-skill');

// Stats Modal
const modalStats = document.getElementById('stats-modal');
const btnResetGame = document.getElementById('reset-game-btn');
const btnCloseStats = document.getElementById('close-stats-btn');
const elStatHp = document.getElementById('stat-hp');
const elStatAtk = document.getElementById('stat-atk');
const elStatDef = document.getElementById('stat-def');
const elStatSpd = document.getElementById('stat-spd');
const elStatTvps = document.getElementById('stat-tvps');

// Destiny Overlay
const overlayDestiny = document.getElementById('destiny-overlay');
const elDestinyRootName = document.getElementById('destiny-root-name');
const elDestinyRootQuality = document.getElementById('destiny-root-quality');
const elDestinyRootBg = document.getElementById('destiny-root-bg');
const elDestinyPhysiqueName = document.getElementById('destiny-physique-name');
const elDestinyPhysiqueDesc = document.getElementById('destiny-physique-desc');
const elDestinyOriginName = document.getElementById('destiny-origin-name');
const elDestinyLuckValue = document.getElementById('destiny-luck-value');
const elDestinyTalentsList = document.getElementById('destiny-talents-list');
const elDestinyRating = document.getElementById('destiny-rating');
const btnRerollDestiny = document.getElementById('btn-reroll-destiny');
const btnConfirmDestiny = document.getElementById('btn-confirm-destiny');

// NPC Interactions
const btnNpcGift = document.getElementById('btn-npc-gift');
const btnNpcParty = document.getElementById('btn-npc-party');
const btnNpcDual = document.getElementById('btn-npc-dual');
const elCharPartyList = document.getElementById('char-party-list');
const elNpcStoryOptions = document.getElementById('npc-story-options');

// Guild Overlay
const overlayGuild = document.getElementById('guild-overlay');
const btnCloseGuild = document.getElementById('close-guild-btn');

// Tower Overlay
const overlayTower = document.getElementById('tower-overlay');
const btnCloseTower = document.getElementById('close-tower-btn');

// Mountain Overlay
const overlayMountain = document.getElementById('mountain-overlay');
const btnCloseMountain = document.getElementById('close-mountain-btn');
const btnMountainDeeper = document.getElementById('btn-mountain-deeper');
const btnMountainRetreat = document.getElementById('btn-mountain-retreat');

// Initialization
function init() {
    // Initialize UI first so other systems can use it
    ui = new UISystem();
    window.ui = ui;

    creationSystem = new CreationSystem();

    const savedData = SaveSystem.load();

    if (!savedData) {
        ui.toggleOverlay(document.getElementById('screen-creation'), true);
        ui.toggleOverlay(document.getElementById('screen-main'), false);
        document.querySelector('header').classList.add('hidden');
        document.getElementById('time-hud').classList.add('hidden');
        document.querySelector('nav').classList.add('hidden');
        renderCreationScreen();
    } else {
        player = new Player();
        player.load(savedData);
        initGameSystems(player, savedData);
        ui.toggleOverlay(document.getElementById('screen-creation'), false);
        ui.toggleOverlay(document.getElementById('screen-main'), true);
        document.querySelector('header').classList.remove('hidden');
        document.getElementById('time-hud').classList.remove('hidden');
        document.querySelector('nav').classList.remove('hidden');
    }

    // Auto-save every 30 seconds
    setInterval(saveGame, 30000);

    if (btnSeclusion) btnSeclusion.onclick = handleSeclusion;

    // Focus Buttons
    const btnFocusTuvi = document.getElementById('focus-tuvi');
    const btnFocusBody = document.getElementById('focus-body');
    const btnFocusSoul = document.getElementById('focus-soul');
    const elCultivateText = document.getElementById('cultivate-btn-text');

    if (btnFocusTuvi) {
        const updateFocusUI = () => {
            [btnFocusTuvi, btnFocusBody, btnFocusSoul].forEach(btn => {
                btn.className = 'flex-grow py-2 text-gray-500 rounded-lg text-[9px] font-ancient uppercase tracking-widest border border-transparent transition-all';
            });

            // Remove all focus classes from aura
            if (elAuraGlow) elAuraGlow.className = 'absolute inset-16 rounded-full blur-3xl animate-pulse aura-glow';
            if (elAuraBorder) elAuraBorder.className = 'relative w-56 h-56 rounded-full overflow-hidden border shadow-[0_0_60px_rgba(212,175,55,0.15)] group aura-border';

            if (player.cultivationFocus === 'tuvi') {
                btnFocusTuvi.className = 'flex-grow py-2 bg-qi-blue/20 text-qi-blue rounded-lg text-[9px] font-ancient uppercase tracking-widest border border-qi-blue/30 transition-all focus-tuvi';
                if (elCultivateText) elCultivateText.innerHTML = '<i class="ph ph-sparkle mr-2 text-qi-blue"></i>THU NẠP LINH KHÍ';
                if (elAuraGlow) elAuraGlow.classList.add('focus-tuvi');
                if (elAuraBorder) elAuraBorder.classList.add('focus-tuvi');
            } else if (player.cultivationFocus === 'body') {
                btnFocusBody.className = 'flex-grow py-2 bg-red-900/20 text-red-400 rounded-lg text-[9px] font-ancient uppercase tracking-widest border border-red-500/30 transition-all focus-body';
                if (elCultivateText) elCultivateText.innerHTML = '<i class="ph ph-fire mr-2 text-red-500"></i>RÈN LUYỆN THÂN THỂ';
                if (elAuraGlow) elAuraGlow.classList.add('focus-body');
                if (elAuraBorder) elAuraBorder.classList.add('focus-body');
            } else if (player.cultivationFocus === 'soul') {
                btnFocusSoul.className = 'flex-grow py-2 bg-qi-purple/20 text-qi-purple rounded-lg text-[9px] font-ancient uppercase tracking-widest border border-qi-purple/30 transition-all focus-soul';
                if (elCultivateText) elCultivateText.innerHTML = '<i class="ph ph-eye mr-2 text-qi-purple"></i>NGƯNG TỤ THẦN NIỆM';
                if (elAuraGlow) elAuraGlow.classList.add('focus-soul');
                if (elAuraBorder) elAuraBorder.classList.add('focus-soul');
            }
        };

        btnFocusTuvi.onclick = () => { player.cultivationFocus = 'tuvi'; updateFocusUI(); };
        btnFocusBody.onclick = () => { player.cultivationFocus = 'body'; updateFocusUI(); };
        btnFocusSoul.onclick = () => { player.cultivationFocus = 'soul'; updateFocusUI(); };

        updateFocusUI();
    }

    // Auto-Cultivate Toggle
    if (autoCultivateToggle) {
        autoCultivateToggle.onchange = (e) => {
            if (e.target.checked) {
                ui.toast("Bắt đầu tự động tu hành...", "info");
                autoCultivateInterval = setInterval(() => {
                    if (player.stamina > 0) {
                        player.cultivate(0.7);
                        // Trigger a small visual effect at the center of the aura
                        const rect = elAuraBorder.getBoundingClientRect();
                        ui.createClickParticle(rect.left + rect.width/2, rect.top + rect.height/2);
                    } else {
                        autoCultivateToggle.checked = false;
                        clearInterval(autoCultivateInterval);
                        ui.toast("Thể lực cạn kiệt, tự động tu hành kết thúc.", "warning");
                    }
                }, 1000); // Once per second
            } else {
                clearInterval(autoCultivateInterval);
                ui.toast("Đã ngừng tự động tu hành.", "info");
            }
        };
    }

    // Multi-Breakthrough
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-bt-type')) {
            const type = e.target.dataset.type;
            handleTypeBreakthrough(type);
        }
    });

    // Beast Tabs
    const btnBeastTabList = document.getElementById('beast-tab-list');
    const btnBeastTabHatch = document.getElementById('beast-tab-hatch');
    if (btnBeastTabList && btnBeastTabHatch) {
        btnBeastTabList.onclick = () => {
            beastView = 'list';
            btnBeastTabList.className = 'flex-grow py-2 bg-qi-jade/10 text-qi-jade border border-qi-jade/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            btnBeastTabHatch.className = 'flex-grow py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            renderBeast();
        };
        btnBeastTabHatch.onclick = () => {
            beastView = 'hatch';
            btnBeastTabHatch.className = 'flex-grow py-2 bg-cultivation-gold/10 text-cultivation-gold border border-cultivation-gold/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            btnBeastTabList.className = 'flex-grow py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            renderBeast();
        };
    }

    // Technique System Init
    techniqueSystem = new TechniqueSystem(player);
    
    // Technique Event Listeners
    const btnNavTechnique = document.getElementById('nav-technique');
    const btnTechTabCultivation = document.getElementById('tech-tab-cultivation');
    const btnTechTabSecret = document.getElementById('tech-tab-secret');
    const btnTechBack = document.getElementById('tech-back-btn');

    if (btnNavTechnique) {
        btnNavTechnique.onclick = () => {
            ui.showLoading(true, "Đang Mở Tàng Kinh Các...");
            setTimeout(() => {
                ui.showLoading(false);
                switchScreen('screen-technique', btnNavTechnique);
                renderTechniques();
            }, 500);
        };
    }

    if (btnTechTabCultivation) {
        btnTechTabCultivation.onclick = () => {
            techView = 'cultivation';
            btnTechTabCultivation.className = 'flex-grow py-2 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            btnTechTabSecret.className = 'flex-grow py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            renderTechniques();
        };
    }

    if (btnTechTabSecret) {
        btnTechTabSecret.onclick = () => {
            techView = 'secret';
            btnTechTabSecret.className = 'flex-grow py-2 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            btnTechTabCultivation.className = 'flex-grow py-2 text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all';
            renderTechniques();
        };
    }

    if (btnTechBack) {
        btnTechBack.onclick = () => {
            document.getElementById('tech-list-view').classList.remove('hidden');
            document.getElementById('tech-detail-view').classList.add('hidden');
            selectedTechId = null;
        };
    }

    update();
}

async function handleTypeBreakthrough(type) {
    const res = player.breakthrough(type);
    if (res.success) {
        ui.toast(res.msg, 'success');
        saveGame();
        refreshUI();
    } else {
        ui.alert(res.msg, 'Phá Cảnh Thất Bại');
    }
}

async function handleSeclusion() {
    const options = [
        { label: 'Tập Trung: Tu Vi Linh Lực', value: 'tuvi' },
        { label: 'Tập Trung: Nhục Thân Luyện Thể', value: 'body' },
        { label: 'Tập Trung: Thần Thức Linh Hồn', value: 'soul' }
    ];

    const focus = await ui.promptOptions('Chọn Tâm Điểm Bế Quan', options);
    if (!focus) return;

    const timeOptions = [
        { label: 'Bế Quan 7 Ngày', value: 7 * 12 },
        { label: 'Bế Quan 1 Tháng', value: 30 * 12 },
        { label: 'Bế Quan 3 Tháng', value: 90 * 12 },
        { label: 'Bế Quan 1 Năm', value: 360 * 12 }
    ];

    const minutes = await ui.promptOptions('Chọn Thời Gian Bế Quan', timeOptions);
    if (!minutes) return;

    const staminaCost = Math.floor(minutes / 12) * 2;
    if (player.stamina < staminaCost) {
        ui.toast(`Cần ${staminaCost} Thể lực để bế quan lâu như vậy!`, 'error');
        return;
    }

    ui.showLoading(true, "Đang Bế Quan Tu Luyện...");

    setTimeout(() => {
        player.stamina -= staminaCost;

        // Calculate gains
        const secondsPassed = minutes * 60;
        if (focus === 'tuvi') player.tuVi += player.tuViPerSecond * secondsPassed;
        if (focus === 'body') player.bodyExp += player.bodyExpPerSecond * secondsPassed;
        if (focus === 'soul') player.soulExp += player.soulExpPerSecond * secondsPassed;

        // Advance world time
        timeSystem.advanceTime(minutes);

        if (gardenSystem) gardenSystem.update(secondsPassed);

        ui.showLoading(false);
        ui.alert(`Sau khi bế quan ${minutes / 12} ngày, căn cơ của bạn đã vững chắc hơn rất nhiều. Thân thể đã già đi một chút.`, 'Bế Quan Kết Thúc');

        refreshUI();
    }, 1500);
}

function saveGame() {
    if (player) {
        player.currentWorldId = currentWorldId;
        player.currentLocId = currentLocId;
        const data = player.save();
        if (timeSystem) data.time = timeSystem.save();
        SaveSystem.save(data);
        console.log('Thiên Cơ được lưu giữ.');
    }
}

function update() {
    if (!player) {
        requestAnimationFrame(update);
        return;
    }
    const now = Date.now();
    const delta = (now - player.lastUpdate) / 1000;

    // Calculate global cultivation multiplier
    let multiplier = 1.0;
    if (timeSystem) {
        const season = timeSystem.getSeason();
        if (season.bonus && season.bonus.tvps) multiplier *= season.bonus.tvps;
        if (timeSystem.currentPhenomenon && timeSystem.currentPhenomenon.effect.tvps) {
            multiplier *= timeSystem.currentPhenomenon.effect.tvps;
        }
    }

    if (formationSystem) {
        formationSystem.update(delta / 60);
        const buffs = formationSystem.getBuffs();
        multiplier *= buffs.tuViMult;
    }

    player.update(delta, multiplier);

    if (timeSystem) timeSystem.update(delta);

    // Update NPCs
    if (typeof updateNPCs === 'function') {
        updateNPCs(delta);
    }

    if (gardenSystem) gardenSystem.update(delta);
    if (mountainSystem && mountainSystem.isActive) {
        mountainSystem.update(delta);
        renderMountain();
    }

    // Check for death
    if (player.hp <= 0) {
        handleDeath();
    }

    render();
    requestAnimationFrame(update);
}

function handleDeath() {
    if (currentCombat) currentCombat.isActive = false;
    ui.toggleOverlay(overlayBattle, false);
    ui.toggleOverlay(overlayMountain, false);
    
    player.hp = Math.floor(player.maxHp * 0.1); // Revive with 10% HP
    const penalty = Math.floor(player.tuVi * 0.1);
    player.tuVi -= penalty;
    
    ui.alert(`Bạn đã kiệt sức và ngất đi. Sau khi được một vị ẩn sĩ cứu giúp, bạn tỉnh lại nhưng đã mất đi ${penalty.toLocaleString()} tu vi tích lũy.`, 'Thiên Đạo Luân Hồi');
    
    refreshUI();
}

function refreshUI() {
    render();
    renderCharacter();
    renderInventory();
    if (typeof renderAlchemy === 'function') renderAlchemy();
    if (typeof renderShop === 'function') renderShop();
    if (typeof renderCraftingHub === 'function') renderCraftingHub();
    if (typeof renderTechniques === 'function') renderTechniques();
}

function render() {
    const realm = player.getCurrentRealm();
    const progress = (player.tuVi / realm.expRequired) * 100;

    elRealm.textContent = realm.name;
    elProgress.style.width = `${Math.min(100, progress)}%`;
    elTuViText.textContent = `${Math.floor(player.tuVi).toLocaleString()} / ${realm.expRequired.toLocaleString()}`;

    // Calculate final TVPS with seasonal bonus
    let tvps = player.tuViPerSecond;
    if (timeSystem) {
        const season = timeSystem.getSeason();
        if (season.bonus && season.bonus.tvps) tvps *= season.bonus.tvps;
        if (timeSystem.currentPhenomenon && timeSystem.currentPhenomenon.effect.tvps) {
            tvps *= timeSystem.currentPhenomenon.effect.tvps;
        }
    }

    elPerSec.textContent = `+${tvps.toFixed(1)}/s`;
    elLingShiText.textContent = player.getFormattedLingShi();

    ui.toggleOverlay(btnBreakthrough, player.canBreakthrough('tuvi').can);

    if (currentCombat) updateBattleUI();

    if (!modalStats.classList.contains('hidden')) {
        elStatHp.textContent = `${Math.floor(player.hp)} / ${Math.floor(player.maxHp)}`;
        elStatAtk.textContent = Math.floor(player.atk);
        elStatDef.textContent = Math.floor(player.def);
        elStatSpd.textContent = Math.floor(player.spd);
        elStatTvps.textContent = `+${player.tuViPerSecond.toFixed(1)}/s`;
    }

    elStaminaBar.style.width = `${(player.stamina / player.maxStamina) * 100}%`;
    elManaBar.style.width = `${(player.mana / player.maxMana) * 100}%`;

    if (timeSystem) renderTime();

    // Update Technique Points display
    const elTechPoints = document.getElementById('tech-points');
    if (elTechPoints) {
        elTechPoints.textContent = player.techniquePoints || 0;
    }
}

function renderTime() {
    const t = timeSystem.getFormattedTime();
    elTimeHour.textContent = t.hourName;
    elTimePeriod.textContent = `(${t.period === 'Night' ? 'Ban Đêm' : 'Ban Ngày'})`;
    elTimeSeason.textContent = t.seasonName;
    elTimeSeason.style.borderColor = t.seasonColor;
    elTimeSeason.style.color = t.seasonColor;
    elTimeDate.textContent = `Ngày ${t.day} Tháng ${t.month} Năm ${t.year}`;

    if (t.phenomenon) {
        elTimePhenomenon.textContent = t.phenomenon;
        elTimePhenomenon.classList.remove('hidden');
    } else {
        elTimePhenomenon.classList.add('hidden');
    }

    // Apply visual filters
    elApp.classList.remove('time-night', 'time-blood-moon', 'time-spiritual-tide', 'time-eclipse');
    if (timeSystem.isNight()) elApp.classList.add('time-night');

    if (timeSystem.currentPhenomenon) {
        if (timeSystem.currentPhenomenon.id === 'blood_moon') elApp.classList.add('time-blood-moon');
        if (timeSystem.currentPhenomenon.id === 'spiritual_tide') elApp.classList.add('time-spiritual-tide');
        if (timeSystem.currentPhenomenon.id === 'eclipse') elApp.classList.add('time-eclipse');
    }
}

function getQualityClass(quality) {
    const map = { 'Phàm': 'pham', 'Hoàng': 'hoang', 'Huyền': 'huyen', 'Địa': 'dia', 'Thiên': 'thien', 'Tiên': 'tien', 'Thần': 'than' };
    return map[quality] || 'pham';
}

// --- MAP ---
function renderWorldList() {
    const worlds = getWorlds();
    elWorldList.innerHTML = '';
    Object.keys(worlds).forEach(id => {
        const w = worlds[id];
        const locked = player.realmId < w.minRealm;
        const el = document.createElement('div');
        el.className = `p-4 border rounded-xl bg-black/40 cursor-pointer transition-all ${locked ? 'opacity-50 grayscale' : 'hover:border-qi-purple border-gray-800'}`;
        el.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="text-xl font-bold font-ancient text-white">${w.name}</span>
                <span class="text-xs ${locked ? 'text-red-500' : 'text-qi-blue'}">${locked ? 'Cần: ' + getRealmById(w.minRealm).name : 'Đã mở'}</span>
            </div>
            <p class="text-xs text-gray-500 mt-2">${w.description}</p>
        `;
        if (!locked) el.onclick = () => selectWorld(id);
        elWorldList.appendChild(el);
    });
}

function selectWorld(id) {
    currentWorldId = id;
    const w = getWorlds()[id];
    elCurrentWorldName.textContent = w.name;
    ui.toggleOverlay(viewWorlds, false);
    ui.toggleOverlay(viewLocations, true);
    renderLocationList();
    if (timeSystem) timeSystem.timeMultiplier = 1.0;
}

function renderLocationList() {
    const w = getWorlds()[currentWorldId];
    elLocList.innerHTML = '';
    w.locations.forEach(loc => {
        const locked = player.realmId < loc.minRealm;
        const el = document.createElement('div');
        el.className = `p-4 border rounded-xl bg-black/40 cursor-pointer transition-all ${locked ? 'opacity-50 grayscale' : 'hover:border-qi-purple border-gray-800'}`;
        el.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="text-lg font-bold text-white">${loc.name}</span>
                <span class="text-[10px] px-2 py-0.5 rounded border border-red-900/50 text-red-500 uppercase">${loc.danger}</span>
            </div>
            <p class="text-[10px] text-gray-500 mt-1">${loc.description}</p>
        `;
        if (!locked) el.onclick = () => startExploration(loc.id);
        elLocList.appendChild(el);
    });
}

function updateNPCs(delta) {
    // Update known NPCs
    Object.values(player.knownNPCs).forEach(npc => {
        if (typeof npc.simulate === 'function') {
            npc.simulate(delta);
        }
    });

    // Update party members
    player.party.forEach(npc => {
        if (typeof npc.simulate === 'function') {
            npc.simulate(delta);
        }
    });
}

function startExploration(locId) {
    currentLocId = locId;
    const loc = getLocationById(currentWorldId, locId);
    elCurrentLocName.textContent = loc.name;
    explorationProgress = 0;
    ui.toggleOverlay(viewWorlds, false);
    ui.toggleOverlay(viewLocations, false);
    ui.toggleOverlay(viewExplore, true);
    updateExplorationUI();
    elExploreEvent.textContent = 'Bạn đã tới địa điểm.';

    // Set time flow for this location (default 1.0)
    if (timeSystem) {
        timeSystem.timeMultiplier = loc.timeRate || 1.0;
        if (timeSystem.timeMultiplier !== 1.0) {
            ui.toast(`Dòng chảy thời gian tại đây dường như khác biệt... (x${timeSystem.timeMultiplier})`, 'warning');
        }
    }

    // Shop
    ui.toggleOverlay(btnEnterShop, loc.id === 'van_bao_cac');

    // Sect
    ui.toggleOverlay(btnEnterSect, !!SECTS[loc.id]);

    // Guild
    ui.toggleOverlay(btnEnterGuild, loc.special === 'guild');

    // Tower
    ui.toggleOverlay(btnEnterTower, loc.special === 'tower');

    // Mountain
    ui.toggleOverlay(btnEnterMountain, loc.special === 'mountain');

    // Smooth scroll to top of exploration view
    viewExplore.scrollTop = 0;
    renderExplore();
}

function updateExplorationUI() {
    elExploreProgress.textContent = `Tiến độ: ${Math.floor(explorationProgress)}%`;
    elExploreBar.style.width = `${explorationProgress}%`;
}

function renderExplore() {
    const loc = getLocationById(currentWorldId, currentLocId);
    if (!loc) return;

    // Update background if location has one
    const bgUrl = loc.image || ASSETS.backgrounds[loc.id] || ASSETS.backgrounds.nhan_gioi;
    viewExplore.style.backgroundImage = `url('${bgUrl}')`;
    viewExplore.style.backgroundSize = 'cover';
    viewExplore.style.backgroundPosition = 'center';
}

btnMove.onclick = () => {
    if (player.stamina < 5) { alert('Không đủ thể lực!'); return; }
    player.stamina -= 5;

    // Each move consumes 1 game Giờ
    if (timeSystem) timeSystem.advanceTime(1);

    explorationProgress += 5 + Math.random() * 5;
    if (explorationProgress >= 100) explorationProgress = 100;
    updateExplorationUI();

    const loc = getLocationById(currentWorldId, currentLocId);

    // Adjust event probabilities based on time
    let probs = { ...loc.eventProbs };
    if (timeSystem && timeSystem.isNight()) {
        probs.combat = (probs.combat || 0) * 1.5;
        probs.loot = (probs.loot || 0) * 1.2;
    }

    const event = getRandomEvent(probs);

    if (event) {
        elExploreEvent.textContent = event.description;
        if (event.type === 'loot') {
            const resultMsg = event.result(player);
            const droppedShi = Math.floor(Math.random() * 10 * player.realmId);
            player.lingShi += droppedShi;
            setTimeout(() => { elExploreEvent.textContent = resultMsg + ` (+${droppedShi} LT)`; }, 1000);
        } else if (event.type === 'npc') {
            setTimeout(() => { 
                ui.toggleOverlay(overlayNPC, true);
                renderNPC();
            }, 1000);
        } else if (event.type === 'shop') {
            ui.toggleOverlay(overlayShop, true);
            renderShop();
        } else if (event.type === 'combat') {
            setTimeout(() => { startBattle(currentWorldId, currentLocId); }, 1000);
        }
    } else {
        elExploreEvent.textContent = 'Một chặng đường yên tĩnh.';
    }

    if (explorationProgress >= 100) {
        setTimeout(() => {
            ui.toast(`Bạn đã hoàn thành khám phá ${loc.name}!`, 'success');
            explorationProgress = 0;
            updateExplorationUI();
        }, 1500);
    }
};

// --- SHOP ---
btnEnterShop.onclick = () => {
    ui.showLoading(true, "Đang Bước Vào Vạn Bảo Thiên Các...");
    setTimeout(() => {
        ui.showLoading(false);
        ui.toggleOverlay(overlayShop, true);
        renderShop();
    }, 800);
};

btnCloseShop.onclick = () => ui.toggleOverlay(overlayShop, false);

btnEnterSect.onclick = () => {
    ui.showLoading(true, "Đang Bước Vào Tông Môn Thánh Địa...");
    setTimeout(() => {
        ui.showLoading(false);
        ui.toggleOverlay(overlaySects, true);
        renderSects();
    }, 800);
};

btnEnterGuild.onclick = () => {
    ui.showLoading(true, "Đang Bước Vào Công Hội Luyện Dược Sư...");
    setTimeout(() => {
        ui.showLoading(false);
        ui.toggleOverlay(overlayGuild, true);
        renderGuild();
    }, 800);
};

btnCloseGuild.onclick = () => ui.toggleOverlay(overlayGuild, false);

btnEnterTower.onclick = () => {
    ui.showLoading(true, "Đang Tiến Vào Thánh Địa Đan Tháp...");
    setTimeout(() => {
        ui.showLoading(false);
        ui.toggleOverlay(overlayTower, true);
        renderTower();
    }, 800);
};

btnCloseTower.onclick = () => ui.toggleOverlay(overlayTower, false);

btnEnterMountain.onclick = () => {
    ui.showLoading(true, "Đang Tiến Vào Thập Vạn Đại Sơn...");
    setTimeout(() => {
        ui.showLoading(false);
        ui.toggleOverlay(overlayMountain, true);
        mountainSystem.start();
        renderMountain();
    }, 1200);
};

btnCloseMountain.onclick = () => {
    mountainSystem.stop();
    ui.toggleOverlay(overlayMountain, false);
};

btnMountainDeeper.onclick = () => {
    mountainSystem.moveDeeper();
    renderMountain();
};

btnMountainRetreat.onclick = () => {
    mountainSystem.retreat();
    renderMountain();
};

btnBackToLocs.onclick = () => {
    ui.toggleOverlay(viewExplore, false);
    ui.toggleOverlay(viewLocations, true);
    if (timeSystem) timeSystem.timeMultiplier = 1.0;
};

btnLeaveLoc.onclick = () => {
    ui.toggleOverlay(viewExplore, false);
    ui.toggleOverlay(viewLocations, true);
    if (timeSystem) timeSystem.timeMultiplier = 1.0;
};

btnCloseSects.onclick = () => ui.toggleOverlay(overlaySects, false);

function renderShop() {
    elShopLingShi.textContent = player.getFormattedLingShi();
    
    // Update VIP display
    const elVip = document.getElementById('shop-vip-level');
    if (elVip) {
        elVip.textContent = `VIP ${player.vipLevel}`;
        elVip.className = `px-2 py-1 rounded text-[10px] font-bold bg-vip-${player.vipLevel}`;
    }

    if (shopView === 'buy') {
        elShopBuyView.classList.remove('hidden');
        elShopSellView.classList.add('hidden');
        elShopSectionNav.classList.remove('hidden');
        renderShopSections();
        renderShopBuy();
    } else {
        elShopBuyView.classList.add('hidden');
        elShopSellView.classList.remove('hidden');
        elShopSectionNav.classList.remove('hidden'); // Show sections for sell too
        renderShopSections();
        renderShopSell();
    }
}

function renderShopSections() {
    const sections = {
        'dan_duoc': '🧪 Đan Dược',
        'phap_bao': '⚔️ Pháp Bảo',
        'nguyen_lieu': '🌿 Nguyên Liệu',
        'cong_phap': '📖 Công Pháp',
        'tran_phap': '📜 Trận Pháp',
        'phu_luc': '📜 Phù Lục',
        'luyen_khi': '⚒️ Luyện Khí'
    };

    elShopSectionNav.innerHTML = '';
    Object.entries(sections).forEach(([id, name]) => {
        const btn = document.createElement('button');
        const isActive = shopSystem.currentSection === id;
        btn.className = `px-3 py-1.5 text-[10px] rounded-lg border transition-all ${isActive ? 'bg-qi-blue/20 border-qi-blue text-qi-blue' : 'bg-white/5 border-white/10 text-gray-400'}`;
        btn.textContent = name;
        btn.onclick = () => {
            shopSystem.currentSection = id;
            renderShop();
        };
        elShopSectionNav.appendChild(btn);
    });
}

function renderShopBuy() {
    const inv = shopSystem.getShopInventory();
    elShopBuyView.innerHTML = '';
    inv.forEach(item => {
        const itemData = getItemById(item.id);
        if (!itemData) return;
        const qClass = getQualityClass(itemData.quality);
        const el = document.createElement('div');
        el.className = `flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-xl hover:border-${qClass}`;
        el.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="text-2xl bg-black/60 p-2 rounded-lg border border-${qClass}/30">${itemData.icon}</div>
                <div>
                    <div class="text-sm font-bold text-white">${itemData.name}</div>
                    <div class="text-[9px] font-bold quality-${qClass}">${itemData.quality} phẩm | Kho: ${item.stock}</div>
                </div>
            </div>
            <div class="flex items-center space-x-3">
                <div class="text-right">
                    <div class="text-[8px] text-gray-500 line-through">${itemData.price} LT</div>
                    <div class="text-xs font-mono text-cultivation-gold">${Math.floor(itemData.price * (1 - Math.min(0.25, player.vipLevel * 0.05)))} LT</div>
                </div>
                <button class="px-4 py-2 btn-gold text-[10px] font-bold rounded-lg transition-all ${item.stock <= 0 ? 'opacity-50 grayscale pointer-events-none' : ''}" onclick="window.game.buyItem('${item.id}')">
                    <i class="ph ph-shopping-cart-simple mr-1"></i>MUA
                </button>
            </div>
        `;
        elShopBuyView.appendChild(el);
    });
}

function renderShopSell() {
    elShopSellGrid.innerHTML = '';
    const sectionType = shopSystem.currentSection;
    
    player.inventory.items.forEach(item => {
        const itemData = getItemById(item.id);
        if (!itemData) return;

        // Simple mapping for filtering
        const typeMap = {
            'dan_duoc': ['consumable'],
            'phap_bao': ['weapon', 'armor', 'accessory', 'treasure'],
            'nguyen_lieu': ['material', 'herb', 'ore', 'wood'],
            'cong_phap': ['technique'],
            'tran_phap': ['formation'],
            'phu_luc': ['talisman'],
            'luyen_khi': ['material', 'smithing_tool']
        };

        if (sectionType && typeMap[sectionType] && !typeMap[sectionType].includes(itemData.type)) return;

        const qClass = getQualityClass(itemData.quality);
        const el = document.createElement('div');
        el.className = `p-2 border border-gray-800 rounded-lg bg-black/20 flex flex-col items-center cursor-pointer hover:border-${qClass}`;
        
        // Custom sell price logic
        let sellMult = 0.5;
        if (['material', 'herb', 'ore', 'wood'].includes(itemData.type)) sellMult = 0.3;

        el.innerHTML = `
            <div class="text-2xl mb-1">${itemData.icon}</div>
            <div class="text-[9px] text-gray-400">x${item.quantity}</div>
            <div class="text-[8px] text-cultivation-gold mt-1">${Math.floor(itemData.price * sellMult)} LT</div>
        `;
        el.onclick = () => {
            const res = shopSystem.sellItem(item.id, 1);
            ui.toast(res.msg, res.success ? 'success' : 'error');
            renderShopSell();
            elShopLingShi.textContent = player.getFormattedLingShi();
        };
        elShopSellGrid.appendChild(el);
    });
}

window.game = {
    buyItem: (id) => {
        const res = shopSystem.buyItem(id, 1);
        ui.toast(res.msg, res.success ? 'success' : 'error');
        renderShopBuy();
        elShopLingShi.textContent = Math.floor(player.lingShi);
    },
    showPlantMenu: async (index) => {
        // Simple plant for now
        if (player.inventory.hasItem('seed_linh_thao')) {
            gardenSystem.plant(index, 'seed_linh_thao');
            player.inventory.removeItem('seed_linh_thao', 1);
            renderAlchemy();
        } else {
            ui.toast("Bạn không có hạt giống nào!", "error");
        }
    },
    harvest: (index) => {
        if (gardenSystem.harvest(index)) {
            ui.toast("Đã thu hoạch linh thảo!", "success");
            renderAlchemy();
            renderInventory();
        }
    },
    craft: async (id) => {
        const res = await alchemySystem.craft(id);
        if (res.msg) ui.toast(res.msg, res.success ? 'success' : 'error');
        renderAlchemy();
        renderInventory();
    },
    doCraft: (id) => {
        const res = craftingSystem.craft(id);
        ui.toast(res.msg, res.success ? 'success' : 'error');
        renderCharacter();
        renderInventory();
    },
    removeFromParty: (npcId) => {
        if (player.removeFromParty(npcId)) {
            ui.toast("Đồng hành đã rời đội.", "info");
            renderCharacter();
        }
    },
    hatchBeast: (eggId) => {
        const res = beastSystem.hatch(eggId);
        ui.toast(res.msg, res.success ? 'success' : 'error');
        renderBeast();
        refreshUI();
    },
    feedBeast: (uniqueId) => {
        // Find best food available
        const foods = player.inventory.items.filter(i => getItemById(i.id).type === 'beast_food');
        if (foods.length === 0) {
            ui.toast("Bạn không có thức ăn linh thú!", "error");
            return;
        }
        const res = beastSystem.feed(uniqueId, foods[0].id);
        ui.toast(res.msg, res.success ? 'success' : 'error');
        renderBeast();
        refreshUI();
    },
    openCrafting: (type) => {
        const screens = document.querySelectorAll('.screen');
        const navButtons = document.querySelectorAll('.nav-item');
        
        screens.forEach(s => s.classList.add('hidden'));
        const target = document.getElementById(`screen-${type}`);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('animate-fade-in');
            if (type === 'alchemy') renderAlchemy();
            if (type === 'talisman') renderTalisman();
            if (type === 'smithing') renderSmithing();
            if (type === 'formation') renderFormation();
            if (type === 'corpse') renderCorpse();
            if (type === 'beast') renderBeast();
        }
    }
};

btnShopTabBuy.onclick = () => { shopView = 'buy'; btnShopTabBuy.className = 'flex-grow py-3 text-cultivation-gold border-b-2 border-cultivation-gold'; btnShopTabSell.className = 'flex-grow py-3 text-gray-500'; renderShop(); };
btnShopTabSell.onclick = () => { shopView = 'sell'; btnShopTabSell.className = 'flex-grow py-3 text-cultivation-gold border-b-2 border-cultivation-gold'; btnShopTabBuy.className = 'flex-grow py-3 text-gray-500'; renderShop(); };

// --- DESTINY SELECTION ---
function showDestinySelection() {
    ui.toggleOverlay(overlayDestiny, true);
    rerollDestiny();
}

function rerollDestiny() {
    currentDestiny = DestinySystem.generateDestiny();
    renderDestinyUI();
}

function renderDestinyUI() {
    const d = currentDestiny;
    elDestinyRootName.textContent = d.spiritualRoot.type;
    elDestinyRootName.style.color = d.spiritualRoot.color;
    elDestinyRootQuality.textContent = d.spiritualRoot.quality + " Phẩm";
    elDestinyRootQuality.style.color = d.spiritualRoot.color;
    elDestinyRootBg.style.background = `radial-gradient(circle, ${d.spiritualRoot.color} 0%, transparent 70%)`;

    if (d.physique) {
        elDestinyPhysiqueName.textContent = d.physique.name;
        elDestinyPhysiqueDesc.textContent = d.physique.desc;
    } else {
        elDestinyPhysiqueName.textContent = "Không có";
        elDestinyPhysiqueDesc.textContent = "Hầu hết phàm nhân đều không có thể chất đặc biệt.";
    }

    elDestinyOriginName.textContent = d.origin.name;
    elDestinyLuckValue.textContent = d.luck;

    elDestinyTalentsList.innerHTML = d.talents.map(t => `<span class="px-2 py-1 bg-white/10 rounded text-[9px] text-gray-300 border border-white/5">${t.name}</span>`).join('');

    elDestinyRating.textContent = d.destinyRating;
}

btnRerollDestiny.onclick = () => rerollDestiny();

btnConfirmDestiny.onclick = () => {
    // Apply destiny to player
    player.spiritualRoot = currentDestiny.spiritualRoot;
    player.physique = currentDestiny.physique;
    player.origin = currentDestiny.origin;
    player.luck = currentDestiny.luck;
    player.talents = currentDestiny.talents;
    player.destinyRating = currentDestiny.destinyRating;

    // Initial resources
    player.lingShi = currentDestiny.origin.resources.lingShi;

    player.calculateStats();

    // Initialize systems for the new player
    initGameSystems(player);

    ui.toggleOverlay(overlayDestiny, false);
    saveGame();

    elPlayerNameHeader.textContent = player.name;
    elHeaderPortrait.src = ASSETS.portraits.player;
    document.getElementById('main-player-portrait').src = ASSETS.portraits.player;

    ui.toast("Thức tỉnh thiên mệnh thành công!", "success");
};

function initGameSystems(player, savedData = null) {
    shopSystem = new ShopSystem(player);
    alchemySystem = new AlchemySystem(player, ui);
    guildSystem = new GuildSystem(player, ui);
    gardenSystem = new GardenSystem(player, ui);
    mountainSystem = new MountainSystem(player, ui);
    timeSystem = new TimeSystem(player, ui);
    craftingSystem = new CraftingSystem(player);
    formationSystem = new FormationSystem(player, ui);
    talismanSystem = new TalismanSystem(player, ui);
    smithingSystem = new SmithingSystem(player, ui);
    beastSystem = new BeastSystem(player, ui);
    corpseSystem = new CorpseSystem(player, ui);

    // Legacy support for older property names if any
    if (savedData && savedData.time) {
        timeSystem.load(savedData.time);
    }

    if (elPlayerNameHeader) elPlayerNameHeader.textContent = player.name;
    const mainPortrait = document.getElementById('main-player-portrait');
    if (mainPortrait) mainPortrait.src = ASSETS.portraits.player;

    // Restore location
    if (player.currentWorldId) {
        currentWorldId = player.currentWorldId;
        if (player.currentLocId) {
            currentLocId = player.currentLocId;
            startExploration(currentLocId);
        } else {
            renderWorldList();
        }
    }
}

// --- CHARACTER & EQUIPMENT ---
function renderCharacter() {
    elCharHp.textContent = `${Math.floor(player.hp)} / ${Math.floor(player.maxHp)}`;
    elCharAtk.textContent = Math.floor(player.atk);
    elCharDef.textContent = Math.floor(player.def);
    elCharSpd.textContent = Math.floor(player.spd);
    elCharMana.textContent = `${Math.floor(player.mana)} / ${Math.floor(player.maxMana)}`;
    if (elCharAge) elCharAge.textContent = `${Math.floor(player.age)} / ${player.maxAge}`;

    // Detailed Realms
    const tuviRealm = player.getCurrentRealm('tuvi');
    const bodyRealm = player.getCurrentRealm('body');
    const soulRealm = player.getCurrentRealm('soul');

    document.getElementById('char-realm-tuvi').textContent = tuviRealm.name;
    document.getElementById('char-realm-body').textContent = bodyRealm.name;
    document.getElementById('char-realm-soul').textContent = soulRealm.name;

    document.getElementById('char-progress-tuvi').style.width = `${Math.min(100, (player.tuVi / tuviRealm.expRequired) * 100)}%`;
    document.getElementById('char-progress-body').style.width = `${Math.min(100, (player.bodyExp / bodyRealm.expRequired) * 100)}%`;
    document.getElementById('char-progress-soul').style.width = `${Math.min(100, (player.soulExp / soulRealm.expRequired) * 100)}%`;

    document.getElementById('char-exp-tuvi').textContent = `${Math.floor(player.tuVi).toLocaleString()} / ${tuviRealm.expRequired.toLocaleString()}`;
    document.getElementById('char-exp-body').textContent = `${Math.floor(player.bodyExp).toLocaleString()} / ${bodyRealm.expRequired.toLocaleString()}`;
    document.getElementById('char-exp-soul').textContent = `${Math.floor(player.soulExp).toLocaleString()} / ${soulRealm.expRequired.toLocaleString()}`;

    // Highlight BT buttons if ready
    document.querySelectorAll('.btn-bt-type').forEach(btn => {
        const type = btn.dataset.type;
        if (player.canBreakthrough(type).can) {
            btn.classList.add('animate-pulse');
            btn.style.opacity = '1';
        } else {
            btn.classList.remove('animate-pulse');
            btn.style.opacity = '0.5';
        }
    });

    if (player.age >= player.maxAge) {
        ui.toast("Thọ nguyên sắp cạn, hãy mau chóng đột phá!", "error");
    }

    if (elCharSectInfo) {
        if (player.sectId) {
            const sect = getSectById(player.sectId);
            elCharSectInfo.textContent = sect.name;
            elCharSectInfo.className = 'text-xs text-qi-blue font-bold';
        } else {
            elCharSectInfo.textContent = 'Chưa gia nhập';
            elCharSectInfo.className = 'text-xs italic text-gray-500';
        }
    }

    // Destiny Info
    const elRoot = document.getElementById('char-root');
    const elPhysique = document.getElementById('char-physique');
    const elLuck = document.getElementById('char-luck');

    if (elRoot && player.spiritualRoot) {
        elRoot.textContent = player.spiritualRoot.type;
        elRoot.style.color = player.spiritualRoot.color;
    }

    if (elPhysique) {
        elPhysique.textContent = player.physique ? player.physique.name : "Không";
    }

    if (elLuck) elLuck.textContent = player.luck;

    // Main Technique
    const elMainTech = document.getElementById('char-main-technique');
    if (elMainTech) {
        if (player.mainTechniqueId) {
            const tech = TECHNIQUES[player.mainTechniqueId];
            const entry = player.learnedTechniques.find(t => t.id === player.mainTechniqueId);
            elMainTech.textContent = tech ? `${tech.name} (Tầng ${entry?.stage || 1})` : "Không";
        } else {
            elMainTech.textContent = "Không";
        }
    }

    // Render Party
    if (elCharPartyList) {
        if (player.party.length === 0) {
            elCharPartyList.innerHTML = '<div class="text-[9px] text-gray-600 italic">Chưa có đồng hành</div>';
        } else {
            elCharPartyList.innerHTML = player.party.map(npc => `
                <div class="flex justify-between items-center p-2 bg-white/5 border border-white/10 rounded-lg">
                    <div class="flex items-center space-x-2">
                        <img src="${npc.portrait}" class="w-6 h-6 rounded-full border border-cultivation-gold/30">
                        <div>
                            <div class="text-[10px] font-bold text-white">${npc.name}</div>
                            <div class="text-[8px] text-gray-400">${npc.role} - LV.${npc.realmId}</div>
                        </div>
                    </div>
                    <button onclick="window.game.removeFromParty('${npc.id}')" class="text-[8px] text-red-400 hover:text-red-300">RỜI ĐỘI</button>
                </div>
            `).join('');
        }
    }

    equipmentSlots.forEach(slot => {
        const type = slot.dataset.slot;
        const itemId = player.equipment[type];
        slot.innerHTML = '';
        
        // Clear any previous dynamic border classes
        const classesToRemove = Array.from(slot.classList).filter(c => c.startsWith('border-') && c !== 'border-white/20');
        slot.classList.remove(...classesToRemove);

        if (itemId) {
            const item = getItemById(itemId);
            if (item) {
                const qClass = getQualityClass(item.quality);
                slot.classList.remove('border-white/20');
                slot.classList.add(`border-${qClass}/50`);
                slot.innerHTML = `<span class="text-xl">${item.icon}</span>`;
                slot.onclick = () => {
                    if (player.unequip(type)) renderCharacter();
                };
            } else {
                slot.classList.add('border-white/20');
                const icons = { head: 'ph-crown', shoes: 'ph-sneaker', necklace: 'ph-diamond', artifact: 'ph-magic-wand', weapon: 'ph-sword', armor: 'ph-coat-hanger', accessory: 'ph-ring', treasure: 'ph-sparkle' };
                slot.innerHTML = `<i class="ph ${icons[type] || 'ph-question'} text-gray-600"></i>`;
                slot.onclick = null;
            }
        } else {
            slot.classList.add('border-white/20');
            const icons = { head: 'ph-crown', shoes: 'ph-sneaker', necklace: 'ph-diamond', artifact: 'ph-magic-wand', weapon: 'ph-sword', armor: 'ph-coat-hanger', accessory: 'ph-ring', treasure: 'ph-sparkle' };
            slot.innerHTML = `<i class="ph ${icons[type] || 'ph-question'} text-gray-600"></i>`;
            slot.onclick = null;
        }
    });

    // Render Formations
    const elFormationList = document.getElementById('active-formations-list');
    if (elFormationList) {
        if (player.activeFormations.length === 0) {
            elFormationList.innerHTML = '<div class="text-[9px] text-gray-600 italic">Chưa có trận pháp nào</div>';
        } else {
            elFormationList.innerHTML = player.activeFormations.map(f => `
                <div class="flex justify-between items-center p-2 bg-qi-blue/5 border border-qi-blue/20 rounded-lg">
                    <div class="flex items-center space-x-2">
                        <i class="ph ph-scroll text-qi-blue text-xs"></i>
                        <div class="text-[10px] font-bold text-white">${f.name}</div>
                    </div>
                    <div class="text-[8px] text-gray-400">Đang hoạt động</div>
                </div>
            `).join('');
        }
    }
}

// --- INVENTORY ---
function renderInventory() {
    elInventoryGrid.innerHTML = '';
    elInventoryCapacity.textContent = `${player.inventory.items.length}/${player.inventory.maxSlots}`;
    player.inventory.items.forEach(item => {
        const itemData = getItemById(item.id);
        if (!itemData) return;
        const displayQuality = (item.metadata && item.metadata.quality) ? item.metadata.quality : itemData.quality;
        const qClass = getQualityClass(displayQuality);
        const el = document.createElement('div');
        el.className = `p-2 border rounded-lg bg-black/20 flex flex-col items-center cursor-pointer transition-all border-${qClass}/30 ${selectedItemId === item.id ? 'bg-qi-blue/10 border-qi-blue' : 'hover:border-white/30'}`;
        el.innerHTML = `<div class="text-2xl mb-1">${itemData.icon}</div><div class="text-[10px] text-gray-400">x${item.quantity}</div>`;
        el.onclick = () => selectItem(item.id);
        elInventoryGrid.appendChild(el);
    });
}

function selectItem(id) {
    selectedItemId = id;
    const itemData = getItemById(id);
    if (!itemData) return;
    
    // Check for metadata quality (for crafted items)
    const playerItem = player.inventory.items.find(i => i.id === id);
    const displayQuality = (playerItem && playerItem.metadata && playerItem.metadata.quality) ? playerItem.metadata.quality : itemData.quality;
    
    const qClass = getQualityClass(displayQuality);
    elDetailIcon.textContent = itemData.icon;
    elDetailIcon.className = `text-3xl mr-3 bg-black/40 p-2 rounded-lg border border-${qClass}/50`;
    elDetailName.textContent = itemData.name;
    elDetailName.className = `font-bold quality-${qClass}`;
    elDetailType.textContent = `${displayQuality} phẩm | ${itemData.type}`;
    elDetailDesc.textContent = itemData.description;

    btnUseItem.style.display = itemData.type === 'consumable' ? 'block' : 'none';

    const equippable = ['weapon', 'armor', 'accessory', 'treasure'].includes(itemData.type);
    btnEquipItem.style.display = equippable ? 'block' : 'none';

    ui.toggleOverlay(elItemDetail, true);
    renderInventory();
}

btnEquipItem.onclick = () => {
    if (!selectedItemId) return;
    const itemData = getItemById(selectedItemId);
    
    if (itemData.type === 'formation') {
        const res = formationSystem.activateFormation(selectedItemId);
        ui.toast(res.msg, res.success ? 'success' : 'error');
        if (res.success) {
            ui.toggleOverlay(elItemDetail, false);
            refreshUI();
        }
    } else if (player.equip(selectedItemId)) {
        selectedItemId = null;
        ui.toggleOverlay(elItemDetail, false);
        renderInventory();
    }
};

btnInventorySort.onclick = () => { player.inventory.sortItems(); renderInventory(); };
btnUseItem.onclick = () => {
    if (selectedItemId && player.inventory.useItem(selectedItemId)) {
        if (!player.inventory.items.find(i => i.id === selectedItemId)) {
            selectedItemId = null;
            ui.toggleOverlay(elItemDetail, false);
        }
        refreshUI();
    }
};

// --- ALCHEMY & CRAFTING ---
const btnAlchemyTabRecipes = document.getElementById('alchemy-tab-recipes');
const btnAlchemyTabGarden = document.getElementById('alchemy-tab-garden');
const viewAlchemyRecipes = document.getElementById('alchemy-recipes-view');
const viewAlchemyGarden = document.getElementById('alchemy-garden-view');

btnAlchemyTabRecipes.onclick = () => {
    alchemyView = 'recipes';
    renderAlchemy();
};

btnAlchemyTabGarden.onclick = () => {
    alchemyView = 'garden';
    renderAlchemy();
};

function renderAlchemy() {
    const elRecipes = document.getElementById('alchemy-recipes-view');
    const elGarden = document.getElementById('alchemy-garden-view');
    const elLvlText = document.getElementById('alchemy-level-text');
    const elExpBar = document.getElementById('alchemy-exp-bar');

    // Toggle views
    if (alchemyView === 'recipes') {
        viewAlchemyRecipes.classList.remove('hidden');
        viewAlchemyGarden.classList.add('hidden');
        btnAlchemyTabRecipes.className = 'flex-grow py-3 btn-premium bg-qi-blue/10 text-qi-blue border-qi-blue/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest';
        btnAlchemyTabGarden.className = 'flex-grow py-3 btn-premium text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest';
    } else {
        viewAlchemyRecipes.classList.add('hidden');
        viewAlchemyGarden.classList.remove('hidden');
        btnAlchemyTabRecipes.className = 'flex-grow py-3 btn-premium text-gray-500 rounded-xl text-[10px] font-ancient uppercase tracking-widest';
        btnAlchemyTabGarden.className = 'flex-grow py-3 btn-premium bg-qi-blue/10 text-qi-blue border-qi-blue/30 rounded-xl text-[10px] font-ancient uppercase tracking-widest';
    }

    elRecipes.innerHTML = '';
    const lvlInfo = getAlchemyLevelInfo(player.alchemyLevel);
    elLvlText.textContent = lvlInfo.name;

    const nextLevelExp = player.alchemyLevel * 100 * Math.pow(1.5, player.alchemyLevel - 1);
    elExpBar.style.width = `${(player.alchemyExp / nextLevelExp) * 100}%`;

    if (alchemyView === 'recipes') {
        ALCHEMY_RECIPES.forEach(recipe => {
            const resultItem = getItemById(recipe.resultId);
            if (!resultItem) return;
            const qClass = getQualityClass(resultItem.quality);
            const el = document.createElement('div');
            el.className = 'p-4 border border-gray-800 rounded-2xl bg-white/5 space-y-3';

            let materialsHTML = '';
            recipe.materials.forEach(mat => {
                const matItem = getItemById(mat.id);
                if (!matItem) return;
                const playerMat = player.inventory.items.find(i => i.id === mat.id);
                const count = playerMat ? playerMat.quantity : 0;
                const enough = count >= mat.quantity;
                materialsHTML += `<div class="text-[10px] ${enough ? 'text-gray-400' : 'text-red-500'}">${matItem.name}: ${count}/${mat.quantity}</div>`;
            });

            const locked = player.alchemyLevel < recipe.level;

            el.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <span class="text-xl mr-2">${resultItem.icon}</span>
                        <span class="font-bold quality-${qClass} font-ancient">${resultItem.name}</span>
                    </div>
                    ${locked ?
                    `<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${recipe.level}</span>` :
                    `<button class="px-4 py-2 btn-gold text-[10px] font-bold rounded-lg active:scale-95 transition-all flex items-center justify-center" onclick="window.game.craft('${recipe.id}')">
                        <i class="ph ph-flask mr-1"></i>LUYỆN CHẾ
                    </button>`
                }
                </div>
                <div class="grid grid-cols-2 gap-1">${materialsHTML}</div>
                <div class="text-[9px] text-gray-500 italic">${recipe.description}</div>
                <div class="text-[8px] text-gray-600">Thời gian: ${recipe.time}s | Thành công cơ bản: ${recipe.baseSuccessRate * 100}%</div>
            `;
            elRecipes.appendChild(el);
        });
    } else {
        const elPlots = document.getElementById('garden-plots');
        elPlots.innerHTML = '';
        player.gardenPlots.forEach((plot, index) => {
            const el = document.createElement('div');
            el.className = 'p-4 border border-white/5 rounded-2xl bg-white/5 flex flex-col space-y-3';

            if (plot) {
                const seed = SEEDS.find(s => s.id === plot.seedId);
                const isReady = plot.status === 'ready';
                el.innerHTML = `
                    <div class="flex justify-between items-center">
                        <div>
                            <h4 class="text-xs font-ancient text-white">${seed.name}</h4>
                            <p class="text-[10px] text-gray-500">${isReady ? 'Đã chín muồi!' : 'Đang phát triển...'}</p>
                        </div>
                        ${isReady ?
                        `<button class="px-4 py-2 btn-premium bg-qi-jade/10 text-qi-jade text-[10px] font-bold rounded-lg flex items-center justify-center" onclick="window.game.harvest(${index})">
                            <i class="ph ph-hand-grabbing mr-1"></i>THU HOẠCH
                        </button>` :
                        `<div class="text-[10px] font-mono text-qi-blue">${Math.ceil(plot.remainingTime)}s</div>`
                    }
                    </div>
                    <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div class="h-full bg-green-500" style="width: ${((seed.growthTime - plot.remainingTime) / seed.growthTime) * 100}%"></div>
                    </div>
                `;
            } else {
                el.innerHTML = `
                    <div class="flex justify-between items-center">
                        <span class="text-xs text-gray-600 italic font-ancient">Mảnh đất trống</span>
                        <button class="px-4 py-2 bg-white/10 text-gray-400 text-[10px] font-bold rounded-lg" onclick="window.game.showPlantMenu(${index})">GIEO HẠT</button>
                    </div>
                `;
            }
            elPlots.appendChild(el);
        });
    }
}
// --- GUILD ---
function renderGuild() {
    const elCerts = document.getElementById('guild-cert-list');
    const elMissions = document.getElementById('guild-mission-list');
    const elRooms = document.getElementById('guild-room-list');

    elCerts.innerHTML = '';
    ALCHEMY_CERTIFICATIONS.forEach(cert => {
        const locked = player.alchemyLevel < cert.requirements.alchemyLevel;
        const el = document.createElement('div');
        el.className = 'p-4 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center';
        el.innerHTML = `
            <div>
                <h4 class="text-sm font-ancient text-white">${cert.name}</h4>
                <p class="text-[10px] text-gray-500">Phí: ${cert.requirements.fee} LT | Cần luyện: ${cert.task.quantity} ${getItemById(cert.task.targetId).name}</p>
            </div>
            <button class="px-4 py-2 bg-qi-blue text-black text-[10px] font-bold rounded-lg ${locked ? 'opacity-50' : ''}" 
                onclick="window.game.guildCertify(${cert.level})">KHẢO HẠCH</button>
        `;
        elCerts.appendChild(el);
    });

    elMissions.innerHTML = '';
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
        elMissions.appendChild(el);
    });

    elRooms.innerHTML = '';
    ALCHEMY_ROOMS.forEach(room => {
        const active = player.currentAlchemyRoom === room.id;
        const el = document.createElement('div');
        el.className = `p-4 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center ${active ? 'border-cultivation-gold' : ''}`;
        el.innerHTML = `
            <div>
                <h4 class="text-sm font-ancient text-white">${room.name} ${active ? '⭐' : ''}</h4>
                <p class="text-[10px] text-gray-500">Phí thuê: ${room.fee} LT | Tăng ${room.successBonus * 100}% thành công</p>
            </div>
            <button class="px-4 py-2 ${active ? 'bg-gray-800' : 'bg-cultivation-gold'} text-black text-[10px] font-bold rounded-lg" 
                onclick="window.game.guildRent('${room.id}')">${active ? 'ĐANG THUÊ' : 'THUÊ'}</button>
        `;
        elRooms.appendChild(el);
    });
}

window.game.guildCertify = async (lvl) => {
    const res = await guildSystem.certify(lvl);
    if (res) renderGuild();
};

window.game.guildMission = (id) => {
    const res = guildSystem.completeMission(id);
    if (res) renderGuild();
};

window.game.guildRent = (id) => {
    const res = guildSystem.rentRoom(id);
    if (res) renderGuild();
};

// --- TOWER ---
function renderTower() {
    const elFloors = document.getElementById('tower-floor-list');
    elFloors.innerHTML = '';

    TOWER_LEVELS.forEach(floor => {
        const locked = player.alchemyLevel < floor.minAlchemyLevel;
        const el = document.createElement('div');
        el.className = `p-6 border border-white/5 rounded-2xl bg-white/5 space-y-3 ${locked ? 'opacity-40' : 'hover:border-cultivation-gold/50 cursor-pointer'}`;
        el.innerHTML = `
            <div class="flex justify-between items-center">
                <h4 class="text-lg font-ancient text-cultivation-gold">${floor.name}</h4>
                ${locked ? `<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${floor.minAlchemyLevel}</span>` : '<i class="ph ph-caret-right text-gray-500"></i>'}
            </div>
            <p class="text-xs text-gray-400">${floor.description}</p>
        `;
        if (!locked) el.onclick = () => ui.toast(`Đang tiến vào ${floor.name}...`, "success");
        elFloors.appendChild(el);
    });
}

// --- MOUNTAIN ---
function renderMountain() {
    const elLayerName = document.getElementById('mountain-layer-name');
    const elLayerDesc = document.getElementById('mountain-layer-desc');
    const elOxyText = document.getElementById('mountain-oxygen-text');
    const elOxyBar = document.getElementById('mountain-oxygen-bar');
    const elToxText = document.getElementById('mountain-toxicity-text');
    const elToxBar = document.getElementById('mountain-toxicity-bar');

    const layer = MOUNTAIN_LAYERS.find(l => l.id === mountainSystem.currentLayer);
    elLayerName.textContent = layer.name;
    elLayerDesc.textContent = layer.description;

    elOxyText.textContent = `${Math.ceil(player.mountainSurvival.oxygen)}%`;
    elOxyBar.style.width = `${player.mountainSurvival.oxygen}%`;
    elToxText.textContent = `${Math.ceil(player.mountainSurvival.toxicity)}%`;
    elToxBar.style.width = `${player.mountainSurvival.toxicity}%`;

    // Check if player is dying
    if (player.hp <= 0) {
        mountainSystem.stop();
        overlayMountain.classList.add('hidden');
    }
}
function renderSects() {
    const elSects = document.getElementById('sects-view');
    elSects.innerHTML = '';

    if (player.sectId) {
        const sect = getSectById(player.sectId);
        elSects.innerHTML = `
            <div class="bg-white/5 rounded-2xl border border-qi-blue/30 overflow-hidden">
                <div class="h-32 relative">
                    <img src="${sect.portrait}" class="w-full h-full object-cover opacity-40">
                    <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div class="absolute bottom-4 left-4">
                        <h3 class="text-2xl font-ancient text-white">${sect.name}</h3>
                        <p class="text-[10px] text-qi-blue uppercase">Đệ tử nội môn</p>
                    </div>
                </div>
                <div class="p-4 space-y-4">
                    <div class="flex justify-between text-xs">
                        <span class="text-gray-500">Điểm cống hiến:</span>
                        <span class="text-cultivation-gold">${player.sectContribution}</span>
                    </div>
                    <h4 class="text-xs font-ancient text-gray-300 uppercase tracking-widest border-b border-white/10 pb-2">Nhiệm Vụ Tông Môn</h4>
                    <div class="space-y-3">
                        ${sect.missions.map(m => `
                            <div class="p-3 bg-black/40 rounded-lg border border-white/5 flex justify-between items-center">
                                <div>
                                    <div class="text-sm font-bold">${m.name}</div>
                                    <div class="text-[9px] text-gray-500">${m.desc}</div>
                                </div>
                                <button class="px-4 py-2 btn-premium bg-qi-purple/10 text-qi-purple text-[10px] font-bold rounded-lg flex items-center justify-center" onclick="window.game.doMission('${m.id}')">
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
            const canJoin = player.realmId >= sect.minRealm;
            const el = document.createElement('div');
            el.className = `p-4 border rounded-xl bg-black/40 space-y-3 ${canJoin ? 'border-gray-800' : 'opacity-50 grayscale'}`;
            el.innerHTML = `
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-ancient text-white">${sect.name}</h3>
                    <span class="text-[10px] ${canJoin ? 'text-qi-blue' : 'text-red-500'}">${canJoin ? 'Có thể gia nhập' : 'Cần: ' + getRealmById(sect.minRealm).name}</span>
                </div>
                <p class="text-xs text-gray-500">${sect.description}</p>
                <button class="w-full py-3 btn-premium bg-qi-blue/10 text-qi-blue text-xs font-bold rounded-xl flex items-center justify-center ${canJoin ? '' : 'hidden'}" onclick="window.game.joinSect('${sect.id}')">
                    <i class="ph ph-identification-badge mr-2"></i>GIA NHẬP TÔNG MÔN
                </button>
            `;
            elSects.appendChild(el);
        });
    }
}

window.game.joinSect = (id) => {
    player.sectId = id;
    player.calculateStats();
    ui.alert(`Bạn đã gia nhập ${getSectById(id).name}!`, "Gia Nhập Tông Môn");
    renderSects();
};

window.game.doMission = (id) => {
    const sect = getSectById(player.sectId);
    const mission = sect.missions.find(m => m.id === id);
    if (player.stamina >= mission.stamina) {
        player.stamina -= mission.stamina;
        player.sectContribution += mission.reward.contribution || 0;
        if (mission.reward.lingShi) player.lingShi += mission.reward.lingShi;
        if (mission.reward.tuVi) player.tuVi += mission.reward.tuVi;
        ui.toast(`Hoàn thành: ${mission.name}!`, "success");
        refreshUI();
    } else {
        ui.toast("Không đủ thể lực!", "warning");
    }
};

// --- TALISMAN SYSTEM ---
function renderTalisman() {
    const elRecipes = document.getElementById('talisman-recipes');
    const elLevelText = document.getElementById('talisman-level-text');
    const elExpBar = document.getElementById('talisman-exp-bar');
    const elPenName = document.getElementById('current-pen-name');

    if (!elRecipes) return;

    const levelInfo = getTalismanLevelInfo(player.talismanLevel);
    const nextLevelInfo = getTalismanLevelInfo(player.talismanLevel + 1);

    elLevelText.textContent = levelInfo.name;
    const progress = nextLevelInfo.exp > 0 ? (player.talismanExp / nextLevelInfo.exp) * 100 : 100;
    elExpBar.style.width = `${Math.min(100, progress)}%`;

    const pen = getItemById(player.currentTalismanPen);
    elPenName.textContent = pen ? pen.name : 'Chưa có bút';

    elRecipes.innerHTML = '';
    Object.values(TALISMAN_RECIPES).forEach(recipe => {
        const resultItem = getItemById(recipe.id);
        const el = document.createElement('div');
        el.className = 'p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3';

        let materialsHTML = '';
        recipe.materials.forEach(mat => {
            const matItem = getItemById(mat.id);
            if (!matItem) return;
            const playerMat = player.inventory.items.find(i => i.id === mat.id);
            const count = playerMat ? playerMat.quantity : 0;
            const enough = count >= mat.quantity;
            materialsHTML += `<div class="text-[10px] ${enough ? 'text-gray-400' : 'text-red-500'}">${matItem.name}: ${count}/${mat.quantity}</div>`;
        });

        const locked = player.talismanLevel < recipe.level;

        el.innerHTML = `
            <div class="flex justify-between items-center">
                <div class="flex items-center">
                    <span class="text-xl mr-2">${resultItem.icon}</span>
                    <span class="font-bold text-white font-ancient">${resultItem.name}</span>
                </div>
                ${locked ?
                `<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${recipe.level}</span>` :
                `<button class="px-4 py-2 btn-gold text-[10px] font-bold rounded-lg active:scale-95 transition-all flex items-center justify-center" onclick="window.game.drawTalisman('${recipe.id}')">
                    <i class="ph ph-pencil-line mr-1"></i>VẼ PHÙ
                </button>`
            }
            </div>
            <div class="grid grid-cols-2 gap-1">${materialsHTML}</div>
            <div class="text-[9px] text-gray-500 italic">${resultItem.description}</div>
            <div class="text-[8px] text-gray-600">Thành công cơ bản: ${recipe.baseSuccessRate * 100}% | EXP: +${recipe.expGain}</div>
        `;
        elRecipes.appendChild(el);
    });
}

window.game.drawTalisman = (id) => {
    const res = talismanSystem.draw(id);
    ui.toast(res.msg, res.success ? 'success' : 'error');
    renderTalisman();
    refreshUI();
};

// --- SMITHING SYSTEM ---
function renderSmithing() {
    const elRecipes = document.getElementById('smithing-recipes');
    const elLevelText = document.getElementById('smithing-level-text');
    const elExpBar = document.getElementById('smithing-exp-bar');
    const elToolName = document.getElementById('smithing-tool-name');
    const elFlameName = document.getElementById('smithing-flame-name');

    if (!elRecipes) return;

    const levelInfo = getSmithingLevelInfo(player.smithingLevel);
    const nextInfo = getSmithingLevelInfo(player.smithingLevel + 1);

    elLevelText.textContent = levelInfo.name;
    const progress = nextInfo.exp > 0 ? (player.smithingExp / nextInfo.exp) * 100 : 100;
    elExpBar.style.width = `${Math.min(100, progress)}%`;

    const tool = getItemById(player.smithingTool);
    elToolName.textContent = tool ? tool.name : 'Chưa có';
    
    const flame = getFlameById(player.currentFlame);
    elFlameName.textContent = flame ? flame.name : 'Linh Hỏa Cơ Bản';

    elRecipes.innerHTML = '';
    Object.values(SMITHING_RECIPES).forEach(recipe => {
        const resultItem = getItemById(recipe.id);
        const el = document.createElement('div');
        el.className = 'p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3';

        let materialsHTML = '';
        recipe.materials.forEach(mat => {
            const matItem = getItemById(mat.id);
            const count = player.inventory.getItemQuantity(mat.id);
            const enough = count >= mat.quantity;
            materialsHTML += `<div class="text-[10px] ${enough ? 'text-gray-400' : 'text-red-500'}">${matItem.name}: ${count}/${mat.quantity}</div>`;
        });

        const locked = player.smithingLevel < recipe.level;

        el.innerHTML = `
            <div class="flex justify-between items-center">
                <div class="flex items-center">
                    <span class="text-xl mr-2">${resultItem.icon}</span>
                    <span class="font-bold text-white font-ancient">${resultItem.name}</span>
                </div>
                ${locked ?
                `<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${recipe.level}</span>` :
                `<button class="px-4 py-2 btn-gold text-[10px] font-bold rounded-lg active:scale-95 transition-all flex items-center justify-center" onclick="window.game.forgeItem('${recipe.id}')">
                    <i class="ph ph-hammer mr-1"></i>RÈN
                </button>`
            }
            </div>
            <div class="grid grid-cols-2 gap-1">${materialsHTML}</div>
            <div class="text-[9px] text-gray-500 italic">${resultItem.description}</div>
            <div class="text-[8px] text-gray-600">Thành công cơ bản: ${recipe.baseSuccessRate * 100}% | EXP: +${recipe.expGain}</div>
        `;
        elRecipes.appendChild(el);
    });
}

function renderCraftingHub() {
    const elAlchemyLvl = document.getElementById('hub-alchemy-level');
    const elTalismanLvl = document.getElementById('hub-talisman-level');
    const elSmithingLvl = document.getElementById('hub-smithing-level');
    const elFormationLvl = document.getElementById('hub-formation-level');
    const elCorpseLvl = document.getElementById('hub-corpse-level');
    const elBeastLvl = document.getElementById('hub-beast-level');

    if (elAlchemyLvl && typeof getAlchemyLevelInfo === 'function') {
        const info = getAlchemyLevelInfo(player.alchemyLevel);
        elAlchemyLvl.textContent = `${info.name} (Cấp ${player.alchemyLevel})`;
    }
    if (elTalismanLvl && typeof getTalismanLevelInfo === 'function') {
        const info = getTalismanLevelInfo(player.talismanLevel);
        elTalismanLvl.textContent = `${info.name} (Cấp ${player.talismanLevel})`;
    }
    if (elSmithingLvl && typeof getSmithingLevelInfo === 'function') {
        const info = getSmithingLevelInfo(player.smithingLevel);
        elSmithingLvl.textContent = `${info.name} (Cấp ${player.smithingLevel})`;
    }
    if (elFormationLvl) elFormationLvl.textContent = `Trận Pháp Sư (Cấp ${player.formationLevel})`;
    if (elCorpseLvl) elCorpseLvl.textContent = `Luyện Thi Sư (Cấp ${player.corpseLevel})`;
    if (elBeastLvl) elBeastLvl.textContent = `Ngự Thú Sư (Cấp ${player.beastLevel})`;
}

function renderBeast() {
    const elList = document.getElementById('beast-list-view');
    const elHatch = document.getElementById('beast-hatch-view');
    const elBeastLvlText = document.getElementById('beast-level-text');
    const elBeastExpBar = document.getElementById('beast-exp-bar');

    if (elBeastLvlText) elBeastLvlText.textContent = `Ngự Thú Sư (Cấp ${player.beastLevel})`;
    if (elBeastExpBar) {
        const nextExp = Math.floor(100 * Math.pow(player.beastLevel, 2));
        elBeastExpBar.style.width = `${(player.beastExp / nextExp) * 100}%`;
    }

    if (beastView === 'list') {
        elList?.classList.remove('hidden');
        elHatch?.classList.add('hidden');
        renderBeastList();
    } else {
        elList?.classList.add('hidden');
        elHatch?.classList.remove('hidden');
        renderBeastHatch();
    }
}

function renderBeastList() {
    const el = document.getElementById('beast-list-view');
    if (!el) return;
    el.innerHTML = '';
    if (player.beasts.length === 0) {
        el.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa có linh thú nào. Hãy đi ấp trứng hoặc thu phục chúng!</div>';
        return;
    }

    player.beasts.forEach(beast => {
        const beastData = BEASTS[beast.id];
        if (!beastData) return;
        const card = document.createElement('div');
        card.className = 'bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center space-x-4';
        card.innerHTML = `
            <div class="text-4xl">${beastData.icon}</div>
            <div class="flex-grow">
                <div class="flex justify-between">
                    <span class="text-white font-bold">${beast.name}</span>
                    <span class="text-[10px] text-cultivation-gold uppercase">LV.${beast.level}</span>
                </div>
                <div class="text-[9px] text-gray-500">${beastData.type} | Loyalty: ${beast.loyalty}%</div>
                <div class="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                    <div class="h-full bg-qi-jade shadow-[0_0_5px_rgba(0,168,107,0.5)]" style="width: ${(beast.exp / getBeastLevelInfo(beast.level).expRequired) * 100}%"></div>
                </div>
            </div>
            <button onclick="window.game.feedBeast('${beast.uniqueId}')" class="px-3 py-1.5 bg-qi-jade/20 text-qi-jade rounded-lg text-[10px] uppercase font-ancient border border-qi-jade/30 active:scale-95 transition-all">Cho ăn</button>
        `;
        el.appendChild(card);
    });
}

function renderBeastHatch() {
    const el = document.getElementById('beast-hatch-view');
    if (!el) return;
    el.innerHTML = '';
    const eggs = player.inventory.items.filter(i => getItemById(i.id).type === 'beast_egg');
    
    if (eggs.length === 0) {
        el.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Trong túi không có trứng linh thú nào.</div>';
        return;
    }

    eggs.forEach(egg => {
        const item = getItemById(egg.id);
        const card = document.createElement('div');
        card.className = 'bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between';
        card.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="text-3xl">${item.icon}</div>
                <div>
                    <div class="text-white font-bold">${item.name}</div>
                    <div class="text-[9px] text-gray-500">Thời gian ấp: ${item.hatchTime}s</div>
                </div>
            </div>
            <button onclick="window.game.hatchBeast('${egg.id}')" class="px-4 py-2 bg-cultivation-gold text-black rounded-xl text-[10px] font-bold uppercase active:scale-95 transition-all shadow-lg shadow-cultivation-gold/20">Ấp Nở</button>
        `;
        el.appendChild(card);
    });
}

function renderFormation() {
    const el = document.getElementById('formation-list');
    if (!el) return;
    el.innerHTML = '';
    
    const formations = formationSystem.formations;
    Object.keys(formations).forEach(id => {
        const f = formations[id];
        const isActive = player.activeFormations.some(af => af.id === id);
        
        const card = document.createElement('div');
        card.className = `bg-white/5 border ${isActive ? 'border-qi-purple shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'border-white/10'} rounded-2xl p-4 flex items-center justify-between transition-all`;
        card.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="text-3xl">${isActive ? '🌀' : '📜'}</div>
                <div>
                    <div class="text-white font-bold">${f.name}</div>
                    <div class="text-[9px] text-gray-500">${isActive ? 'Đang kích hoạt' : 'Bố trận bằng trận đồ'}</div>
                    <div class="text-[8px] text-qi-purple uppercase tracking-tighter mt-1">Hao tốn: ${f.costPerTick} Hạ Phẩm / phút</div>
                </div>
            </div>
            <button onclick="window.game.toggleFormation('${id}')" class="px-4 py-2 ${isActive ? 'bg-red-900/40 text-red-400' : 'bg-qi-purple/20 text-qi-purple'} rounded-xl text-[10px] font-bold uppercase active:scale-95 transition-all border ${isActive ? 'border-red-900/50' : 'border-qi-purple/30'}">
                ${isActive ? 'Dừng' : 'Kích hoạt'}
            </button>
        `;
        el.appendChild(card);
    });
}

window.game.toggleFormation = (id) => {
    const isActive = player.activeFormations.some(af => af.id === id);
    let res;
    if (isActive) {
        res = formationSystem.deactivateFormation(id);
    } else {
        res = formationSystem.activateFormation(id);
    }
    ui.toast(res.msg, res.success ? 'success' : 'error');
    renderFormation();
    refreshUI();
};

function renderCorpse() {
    const el = document.getElementById('corpse-list');
    if (!el) return;
    el.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Cấm thuật Luyện Thi yêu cầu tu vi Ma Đạo.</div>';
}

window.game.forgeItem = (id) => {
    const res = smithingSystem.forge(id);
    ui.toast(res.msg, res.success ? 'success' : 'error');
    renderSmithing();
    refreshUI();
};

// --- NPC & COMBAT ---
function openNPCInteraction() {
    currentNPC = NPCSystem.generate(player.realmId);
    renderNPC();
    overlayNPC.classList.remove('hidden');
}

btnNpcTalk.onclick = () => {
    if (currentNPC) {
        currentNPC.relationship += 2;
        elNpcDialogue.textContent = currentNPC.getDialogue('friendly');
        renderNPC();
    }
};

btnNpcGift.onclick = () => {
    if (currentNPC) {
        if (player.lingShi >= 100) {
            player.lingShi -= 100;
            currentNPC.relationship += 10;
            elNpcDialogue.textContent = "Đa tạ đạo hữu, món quà này rất hợp ý ta!";
            renderNPC();
        } else {
            elNpcDialogue.textContent = "Ngươi không đủ linh thạch...";
        }
    }
};

btnNpcParty.onclick = () => {
    if (currentNPC) {
        if (player.party.length >= 3) {
            elNpcDialogue.textContent = "Tổ đội của ngươi đã đầy!";
            return;
        }
        if (currentNPC.relationship >= 50) {
            if (!player.party.find(p => p.id === currentNPC.id)) {
                player.party.push(currentNPC);
                elNpcDialogue.textContent = "Rất vinh hạnh được đồng hành cùng đạo hữu!";
                renderCharacter();
                renderNPC();
            } else {
                elNpcDialogue.textContent = "Ta đã ở trong tổ đội của ngươi rồi.";
            }
        } else {
            elNpcDialogue.textContent = "Ta và ngươi chưa đủ thân thiết để giao phó tính mạng.";
        }
    }
};

btnNpcDual.onclick = () => {
    if (currentNPC) {
        if (currentNPC.relationship >= 90) {
            // Chance of Qi deviation (5%)
            if (Math.random() < 0.05) {
                player.hp -= player.maxHp * 0.5;
                player.tuVi -= player.tuVi * 0.1;
                elNpcDialogue.textContent = "Á!!! Linh lực nghịch chuyển... Chúng ta tẩu hỏa nhập ma rồi!";
                ui.alert("Tẩu hỏa nhập ma! Bạn bị thương nặng và tổn thất tu vi.", "Tẩu Hỏa Nhập Ma");
            } else {
                player.tuViPerSecond *= 2;
                elNpcDialogue.textContent = "Âm dương giao hòa, vạn vật sinh sôi. Chúng ta bắt đầu thôi...";
                setTimeout(() => { player.calculateStats(); }, 60000);
            }
            overlayNPC.classList.add('hidden');
        } else {
            elNpcDialogue.textContent = "Ngươi nghĩ ta là người thế nào? Hãy tôn trọng ta!";
        }
    }
};

btnNpcTrade.onclick = () => {
    elNpcDialogue.textContent = "Ta có một vài món đồ tốt, ngươi xem qua thử?";
};

btnNpcAttack.onclick = () => {
    player.karma -= 20;
    currentNPC.relationship = -100;
    elNpcDialogue.textContent = currentNPC.getDialogue('hostile');
    setTimeout(() => {
        ui.toggleOverlay(overlayNPC, false);
        startBattleWithNPC(currentNPC);
    }, 1000);
};

btnNpcLeave.onclick = () => {
    ui.toggleOverlay(overlayNPC, false);
    if (currentNPC && !player.knownNPCs[currentNPC.id]) {
        player.knownNPCs[currentNPC.id] = currentNPC;
    }
    currentNPC = null;
};

window.removeFromParty = (id) => {
    player.party = player.party.filter(p => p.id !== id);
    renderCharacter();
};

function renderNPC() {
    if (!currentNPC) return;
    elNpcPortrait.src = currentNPC.portrait;
    elNpcTitle.textContent = currentNPC.title;
    elNpcName.textContent = `${currentNPC.name} (${currentNPC.getRelationshipStatus()}: ${currentNPC.relationship})`;
    elNpcRealm.textContent = getRealmById(currentNPC.realmId).name;

    // Check for story
    if (currentNPC.storyArcId && currentNPC.storyStep > 0) {
        const arc = NPC_STORIES[currentNPC.storyArcId];
        const step = arc.steps.find(s => s.id === currentNPC.storyStep);

        if (step) {
            elNpcDialogue.textContent = `[CỐT TRUYỆN: ${arc.name}] ${step.desc}`;
            elNpcStoryOptions.classList.remove('hidden');
            elNpcStoryOptions.innerHTML = step.options.map((opt, idx) => `
                <button onclick="window.game.handleStoryChoice(${idx})" class="w-full py-2 bg-qi-blue/20 border border-qi-blue/50 text-white text-xs rounded-lg hover:bg-qi-blue/40">${opt.text}</button>
            `).join('');
        } else {
            elNpcStoryOptions.classList.add('hidden');
            elNpcDialogue.textContent = currentNPC.getDialogue('meet');
        }
    } else {
        elNpcStoryOptions.classList.add('hidden');
        elNpcDialogue.textContent = currentNPC.getDialogue('meet');
    }
}

window.game.handleStoryChoice = (idx) => {
    if (!currentNPC || !currentNPC.storyArcId) return;

    const arc = NPC_STORIES[currentNPC.storyArcId];
    const step = arc.steps.find(s => s.id === currentNPC.storyStep);
    const option = step.options[idx];

    if (option.karma) player.karma += option.karma;
    if (option.relation) currentNPC.relationship += option.relation;
    if (option.reward) {
        if (option.reward.tuVi) player.tuVi += option.reward.tuVi;
        if (option.reward.items) {
            option.reward.items.forEach(id => player.inventory.addItem(id, 1));
        }
    }

    if (option.next === 'complete') {
        currentNPC.storyStep = 0;
        ui.alert("Bạn đã hoàn thành chuỗi cốt truyện của NPC này!", "Hoàn Thành Cốt Truyện");
    } else if (option.next === 'betrayed') {
        currentNPC.storyStep = 0;
        currentNPC.relationship = -100;
        ui.alert("Bạn đã phản bội NPC!", "Phản Bội");
    } else {
        currentNPC.storyStep = option.next;
    }

    refreshUI();
    renderNPC();
};

function startBattleWithNPC(npc) {
    const enemyData = { name: npc.name, img: npc.portrait, statMult: 1.2 };
    const enemy = new Enemy(npc.realmId, enemyData);
    initiateBattle(enemy);
}

function startBattle(worldId, locId) {
    const enemy = EnemyGenerator.generate(player.realmId);
    initiateBattle(enemy);
}

function initiateBattle(enemy) {
    elBattlePlayerName.textContent = player.name;
    elBattleEnemyName.textContent = enemy.name;
    elEnemyImg.src = enemy.image;
    elBattleLog.innerHTML = '';
    ui.toggleOverlay(overlayBattle, true);
    ui.toggleOverlay(battleActions, false);

    currentCombat = new CombatEngine(player, enemy,
        (type, data) => {
            if (type === 'damage') {
                const anchor = data.target === 'enemy' ? elEnemyImg : elBattlePlayerName;
                ui.createDamagePopup(anchor, data.value, data.crit);
            }
            if (type === 'player-turn-start') ui.toggleOverlay(battleActions, true);
            if (type === 'player-turn-end' || type === 'end') ui.toggleOverlay(battleActions, false);
        },
        (result) => {
            setTimeout(() => {
                ui.toggleOverlay(overlayBattle, false);
                currentCombat = null;
                if (result === 'win') {
                    const droppedShi = Math.floor(Math.random() * 20 * enemy.realmId);
                    const techPoints = Math.max(1, Math.floor(enemy.realmId / 2));
                    player.lingShi += droppedShi;
                    player.techniquePoints = (player.techniquePoints || 0) + techPoints;
                    ui.toast(`Đắc Thắng! +${droppedShi} Linh Thạch, +${techPoints} Điểm Công Pháp.`, "success");
                }
                refreshUI();
            }, 2000);
        }
    );
    currentCombat.start();
}

// --- UI & NAV ---
const elNav = document.querySelector('nav');
if (elNav) {
    elNav.addEventListener('click', (e) => {
        const btn = e.target.closest('.nav-item');
        if (!btn) return;

        const targetId = btn.id.replace('nav-', 'screen-');
        console.log(`[NAV] Chuyển đến: ${targetId}`);
        const targetScreen = document.getElementById(targetId);

        if (!targetScreen) {
            console.warn(`[NAV] Không tìm thấy màn hình: ${targetId}`);
            return;
        }

        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.add('hidden');
            s.classList.remove('animate-fade-in');
        });

        // Show target
        targetScreen.classList.remove('hidden');
        targetScreen.classList.add('animate-fade-in');

        // Update nav buttons
        document.querySelectorAll('.nav-item').forEach(b => {
            b.classList.remove('text-cultivation-gold', 'active');
            b.classList.add('text-gray-500');
        });

        btn.classList.add('text-cultivation-gold', 'active');
        btn.classList.remove('text-gray-500');

        // Specific screen triggers
        if (targetId === 'screen-adventure') {
            renderWorldList();
            ui.toggleOverlay(viewWorlds, true);
            ui.toggleOverlay(viewLocations, false);
            ui.toggleOverlay(viewExplore, false);
        } else if (targetId === 'screen-character') {
            renderCharacter();
        } else if (targetId === 'screen-inventory') {
            renderInventory();
        } else if (targetId === 'screen-alchemy') {
            renderAlchemy();
        } else if (targetId === 'screen-talisman') {
            renderTalisman();
        } else if (targetId === 'screen-smithing') {
            renderSmithing();
        } else if (targetId === 'screen-crafting-hub') {
            renderCraftingHub();
        }
    });
} else {
    console.error("[UI] Không tìm thấy phần tử <nav>!");
}

btnBackToWorlds.onclick = () => { ui.toggleOverlay(viewLocations, false); ui.toggleOverlay(viewWorlds, true); };
btnBackToLocs.onclick = () => { ui.toggleOverlay(viewExplore, false); ui.toggleOverlay(viewLocations, true); };

btnCultivate.addEventListener('click', (e) => {
    if (player.cultivate()) {
        ui.createClickParticle(e.clientX, e.clientY);
        // Optional: Add a subtle text popup or sound
    } else {
        ui.toast("Kiệt sức rồi, hãy nghỉ ngơi một chút!", "warning");
    }
});
btnBreakthrough.addEventListener('click', async () => {
    if (player.breakthrough()) {
        ui.alert('Chúc mừng Đạo hữu đã đột phá thành công, thực lực đại tăng!', 'Thiên Đạo Chúc Phúc');
        refreshUI();
    }
});

if (btnResetGame) {
    btnResetGame.onclick = async () => {
        const confirm = await ui.confirm("Bạn có chắc chắn muốn 'Trảm Trần Duyên', xóa bỏ mọi tu vi và bắt đầu lại từ đầu không? Hành động này không thể hoàn tác!");
        if (confirm) {
            localStorage.clear();
            location.reload(); // Reload will trigger init() which shows creation screen
        }
    };
}
btnCloseStats.onclick = () => ui.toggleOverlay(modalStats, false);

function updateBattleUI() {
    const p = currentCombat.player; const e = currentCombat.enemy;
    document.getElementById('battle-player-hp').style.width = `${(p.hp / p.maxHp) * 100}%`;
    document.getElementById('battle-enemy-hp').style.width = `${(e.hp / e.maxHp) * 100}%`;
    elBattleLog.innerHTML = currentCombat.log.map(msg => `<div class="mb-1">${msg}</div>`).join('');
    elBattleLog.scrollTop = elBattleLog.scrollHeight;
}

btnAttack.addEventListener('click', () => currentCombat?.doAction('attack'));
btnDefend.addEventListener('click', () => currentCombat?.doAction('defend'));
btnSkill.addEventListener('click', async () => {
    if (!currentCombat) return;
    const secrets = player.equippedSecretTechniqueIds.map(id => getSecretTechniqueById(id)).filter(s => s);
    if (secrets.length === 0) {
        ui.toast("Ngươi chưa trang bị bí pháp nào!", "warning");
        return;
    }

    const options = secrets.map(s => ({
        label: s.name,
        value: s.id,
        icon: s.icon || '✨'
    }));

    const selectedSecretId = await ui.promptOptions('Chọn Bí Pháp Thi Triển', options);
    if (selectedSecretId) {
        currentCombat.doAction('skill', selectedSecretId);
    }
});


init();

// --- TECHNIQUES & SECRETS ---
function renderTechniques() {
    const elList = document.getElementById('tech-list-view');
    const elPoints = document.getElementById('tech-points');
    if (!elList || !elPoints) return;

    elPoints.textContent = player.techniquePoints || 0;
    elList.innerHTML = '';

    if (techView === 'cultivation') {
        const learned = player.learnedTechniques || [];
        if (learned.length === 0) {
            elList.innerHTML = '<div class="text-center py-10 text-gray-500 italic font-ancient text-xs">Chưa học được công pháp nào...</div>';
        } else {
            learned.forEach(entry => {
                const tech = getTechniqueById(entry.id);
                if (!tech) return;
                const isMain = player.mainTechniqueId === entry.id;
                const mastery = techniqueSystem.getMasteryLevel(entry.mastery);
                const qClass = getQualityClass(tech.quality);
                
                const el = document.createElement('div');
                el.className = `p-4 rounded-2xl bg-white/5 border ${isMain ? 'border-qi-blue shadow-[0_0_15px_rgba(79,209,197,0.1)]' : 'border-white/10'} cursor-pointer hover:bg-white/10 transition-all group`;
                el.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <div class="text-sm font-bold text-white font-ancient flex items-center">
                                ${tech.name}
                                ${isMain ? '<span class="ml-2 px-1.5 py-0.5 bg-qi-blue/20 text-qi-blue text-[7px] border border-qi-blue/30 rounded uppercase tracking-widest">Đang Tu Luyện</span>' : ''}
                            </div>
                            <div class="text-[9px] uppercase tracking-widest quality-${qClass}">${tech.quality} Phẩm | ${tech.type}</div>
                        </div>
                        <div class="text-right">
                            <div class="text-[10px] text-gray-400 font-ancient tracking-widest uppercase">${mastery.name}</div>
                            <div class="text-[9px] text-qi-purple/60">Tầng ${entry.stage} / ${tech.maxStage}</div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2 mt-4">
                        <div class="flex-grow h-1 bg-white/5 rounded-full overflow-hidden">
                            <div class="h-full bg-qi-blue" style="width: ${(entry.mastery / mastery.next) * 100}%"></div>
                        </div>
                    </div>
                `;
                el.onclick = () => showTechniqueDetail(entry.id);
                elList.appendChild(el);
            });
        }
    } else {
        // Secrets
        const learned = player.learnedSecretTechniqueIds || [];
        if (learned.length === 0) {
            elList.innerHTML = '<div class="text-center py-10 text-gray-500 italic font-ancient text-xs">Chưa lĩnh hội được bí pháp nào...</div>';
        } else {
            learned.forEach(id => {
                const secret = getSecretTechniqueById(id);
                if (!secret) return;
                const isEquipped = player.equippedSecretTechniqueIds.includes(id);
                const qClass = getQualityClass(secret.quality);
                
                const el = document.createElement('div');
                el.className = `p-4 rounded-2xl bg-white/5 border ${isEquipped ? 'border-qi-purple' : 'border-white/10'} cursor-pointer hover:bg-white/10 transition-all group`;
                el.innerHTML = `
                    <div class="flex justify-between items-center">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center text-xl border border-white/10">${secret.icon || '📜'}</div>
                            <div>
                                <div class="text-sm font-bold text-white font-ancient">${secret.name}</div>
                                <div class="text-[9px] uppercase tracking-widest quality-${qClass}">${secret.quality} Phẩm | ${secret.type}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            ${isEquipped ? '<span class="px-1.5 py-0.5 bg-qi-purple/20 text-qi-purple text-[7px] border border-qi-purple/30 rounded uppercase tracking-widest">Đã Mang</span>' : ''}
                        </div>
                    </div>
                `;
                el.onclick = () => showSecretDetail(id);
                elList.appendChild(el);
            });
        }
    }
}

async function showTechniqueDetail(id) {
    const entry = player.learnedTechniques.find(t => t.id === id);
    const tech = getTechniqueById(id);
    if (!entry || !tech) return;

    selectedTechId = id;
    document.getElementById('tech-list-view').classList.add('hidden');
    document.getElementById('tech-detail-view').classList.remove('hidden');

    const detailContent = document.getElementById('tech-detail-content');
    const isMain = player.mainTechniqueId === id;
    const mastery = techniqueSystem.getMasteryLevel(entry.mastery);
    const bonus = techniqueSystem.calculateBonus(id);
    const qClass = getQualityClass(tech.quality);

    let statEffects = '';
    Object.entries(tech.stats).forEach(([stat, value]) => {
        const bonusVal = bonus[stat] || 0;
        const statName = { atk: 'Công Kích', def: 'Phòng Thủ', spd: 'Thân Pháp', hp: 'Khí Huyết', mana: 'Linh Lực' }[stat];
        statEffects += `<div class="flex justify-between text-xs"><span class="text-gray-500">${statName}:</span> <span class="text-white">+${bonusVal.toFixed(1)}</span></div>`;
    });

    detailContent.innerHTML = `
        <div class="bg-white/5 p-6 rounded-3xl border border-white/10 relative overflow-hidden">
            <div class="absolute -right-10 -top-10 text-[100px] opacity-5 pointer-events-none">📜</div>
            <h3 class="text-2xl font-bold text-white font-ancient mb-1">${tech.name}</h3>
            <div class="text-[10px] uppercase tracking-[0.2em] quality-${qClass} mb-4">${tech.quality} Phẩm | ${tech.type}</div>
            <p class="text-xs text-gray-400 italic mb-6">"${tech.description}"</p>
            
            <div class="space-y-4 pt-4 border-t border-white/5">
                <div class="flex justify-between items-center">
                    <span class="text-[10px] text-gray-500 uppercase">Tiến Độ Tầng:</span>
                    <span class="text-xs text-white">Tầng ${entry.stage} / ${tech.maxStage}</span>
                </div>
                <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-qi-blue" style="width: ${(entry.stage / tech.maxStage) * 100}%"></div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div class="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-2">
                <h4 class="text-[10px] text-gray-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">Thuộc Tính Cộng Thêm</h4>
                ${statEffects}
            </div>
            <div class="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-2">
                <h4 class="text-[10px] text-gray-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">Cấp Độ Thông Thạo</h4>
                <div class="text-xs text-white text-center py-2 font-ancient">${mastery.name}</div>
                <div class="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-qi-purple" style="width: ${(entry.mastery / mastery.next) * 100}%"></div>
                </div>
                <div class="text-[8px] text-gray-600 text-center">${entry.mastery} / ${mastery.next}</div>
            </div>
        </div>

        <div class="space-y-3">
            <button id="btn-tech-set-main" class="w-full py-4 ${isMain ? 'bg-gray-800 text-gray-500' : 'btn-premium bg-qi-blue/10 text-qi-blue'} rounded-2xl text-xs font-bold uppercase tracking-widest" ${isMain ? 'disabled' : ''}>
                ${isMain ? 'ĐANG TU LUYỆN' : 'THIẾT LẬP CÔNG PHÁP CHÍNH'}
            </button>
            <div class="grid grid-cols-2 gap-3">
                <button id="btn-tech-cultivate" class="py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-xs font-bold uppercase tracking-widest active:scale-95 transition-all">
                    TU LUYỆN (1 ĐIỂM)
                </button>
                <button id="btn-tech-breakthrough" class="py-4 bg-cultivation-gold/20 border border-cultivation-gold/30 text-cultivation-gold rounded-2xl text-xs font-bold uppercase tracking-widest active:scale-95 transition-all">
                    ĐỘT PHÁ TẦNG
                </button>
            </div>
        </div>
    `;

    document.getElementById('btn-tech-set-main').onclick = () => {
        if (player.setMainTechnique(id)) {
            ui.toast(`Đã chuyển sang tu luyện ${tech.name}`, 'success');
            showTechniqueDetail(id);
            refreshUI();
        }
    };

    document.getElementById('btn-tech-cultivate').onclick = () => {
        const res = techniqueSystem.cultivate(id);
        if (res.success) {
            ui.toast(res.msg, 'success');
            showTechniqueDetail(id);
            refreshUI();
        } else {
            ui.toast(res.msg, 'warning');
        }
    };

    document.getElementById('btn-tech-breakthrough').onclick = async () => {
        const confirm = await ui.confirm(`Đột phá lên Tầng ${entry.stage + 1} của ${tech.name}? Cần ${entry.stage * 100} Tu Vi.`);
        if (!confirm) return;

        const res = techniqueSystem.breakthroughStage(id);
        if (res.success) {
            ui.alert(res.msg, 'Đột Phá Thành Công');
            showTechniqueDetail(id);
            refreshUI();
        } else {
            ui.toast(res.msg, 'error');
        }
    };
}

async function showSecretDetail(id) {
    const secret = getSecretTechniqueById(id);
    if (!secret) return;

    selectedTechId = id;
    document.getElementById('tech-list-view').classList.add('hidden');
    document.getElementById('tech-detail-view').classList.remove('hidden');

    const detailContent = document.getElementById('tech-detail-content');
    const isEquipped = player.equippedSecretTechniqueIds.includes(id);
    const qClass = getQualityClass(secret.quality);

    let costDesc = '';
    if (secret.costs.hp) costDesc += `<div class="flex justify-between text-xs"><span class="text-gray-500">Tiêu hao HP:</span> <span class="text-red-400">${secret.costs.hp}%</span></div>`;
    if (secret.costs.mana) costDesc += `<div class="flex justify-between text-xs"><span class="text-gray-500">Tiêu hao Linh Lực:</span> <span class="text-blue-400">${secret.costs.mana}</span></div>`;
    if (secret.costs.lifespan) costDesc += `<div class="flex justify-between text-xs"><span class="text-gray-500">Tiêu hao Thọ Nguyên:</span> <span class="text-cultivation-gold">${secret.costs.lifespan} Năm</span></div>`;

    detailContent.innerHTML = `
        <div class="bg-white/5 p-6 rounded-3xl border border-white/10 relative overflow-hidden">
            <div class="absolute -right-10 -top-10 text-[100px] opacity-5 pointer-events-none">✨</div>
            <div class="w-16 h-16 bg-black/40 rounded-2xl flex items-center justify-center text-4xl border border-white/10 mb-4">${secret.icon || '📜'}</div>
            <h3 class="text-2xl font-bold text-white font-ancient mb-1">${secret.name}</h3>
            <div class="text-[10px] uppercase tracking-[0.2em] quality-${qClass} mb-4">${secret.quality} Phẩm | ${secret.type}</div>
            <p class="text-xs text-gray-400 italic mb-6">"${secret.description}"</p>
            
            <div class="space-y-4 pt-4 border-t border-white/5">
                <h4 class="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Cái Giá Phải Trả</h4>
                ${costDesc}
                <div class="flex justify-between text-xs border-t border-white/5 pt-2 mt-2">
                    <span class="text-gray-500">Thời gian hồi:</span>
                    <span class="text-white">${secret.cooldown} Lượt</span>
                </div>
            </div>
        </div>

        <div class="bg-black/40 p-6 rounded-2xl border border-white/5 space-y-3">
            <h4 class="text-[10px] text-gray-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">Hiệu Ứng Tuyệt Kỹ</h4>
            <div class="text-xs text-gray-300 leading-relaxed">
                ${secret.type === 'attack' ? 'Gây sát thương lớn lên kẻ địch dựa trên Công Kích và phẩm cấp bí pháp.' : ''}
                ${secret.type === 'escape' ? 'Sử dụng tàn ảnh hoặc huyết độn để thoát khỏi chiến đấu ngay lập tức.' : ''}
                ${secret.type === 'buff' ? 'Tăng mạnh các chỉ số chiến đấu trong thời gian ngắn.' : ''}
                ${secret.effects.damageMult ? `<br>Sát thương: x${secret.effects.damageMult}` : ''}
            </div>
        </div>

        <div class="space-y-3">
            <button id="btn-secret-equip" class="w-full py-4 ${isEquipped ? 'bg-red-900/20 text-red-400' : 'btn-premium bg-qi-purple/10 text-qi-purple'} rounded-2xl text-xs font-bold uppercase tracking-widest">
                ${isEquipped ? 'THÁO BỎ BÍ PHÁP' : 'TRANG BỊ BÍ PHÁP'}
            </button>
        </div>
    `;

    document.getElementById('btn-secret-equip').onclick = () => {
        if (isEquipped) {
            player.equippedSecretTechniqueIds = player.equippedSecretTechniqueIds.filter(sid => sid !== id);
            ui.toast('Đã tháo bỏ bí pháp', 'info');
        } else {
            if (player.equippedSecretTechniqueIds.length >= 3) {
                ui.toast('Chỉ có thể trang bị tối đa 3 bí pháp', 'warning');
                return;
            }
            player.equippedSecretTechniqueIds.push(id);
            ui.toast('Đã trang bị bí pháp', 'success');
        }
        showSecretDetail(id);
        refreshUI();
    };
}

// --- CHARACTER CREATION UI ---
function renderCreationScreen() {
    const mode = creationSystem.mode;
    
    // Update Mode Buttons
    document.getElementById('creation-mode-random').className = `flex-grow py-3 text-[10px] font-ancient uppercase rounded-xl transition-all ${mode === 'random' ? 'bg-qi-blue/20 text-qi-blue border border-qi-blue/30' : 'text-gray-500'}`;
    document.getElementById('creation-mode-custom').className = `flex-grow py-3 text-[10px] font-ancient uppercase rounded-xl transition-all ${mode === 'custom' ? 'bg-qi-blue/20 text-qi-blue border border-qi-blue/30' : 'text-gray-500'}`;
    document.getElementById('creation-mode-special').className = `flex-grow py-3 text-[10px] font-ancient uppercase rounded-xl transition-all ${mode === 'special' ? 'bg-qi-blue/20 text-qi-blue border border-qi-blue/30' : 'text-gray-500'}`;

    // Show/Hide Panels based on mode
    const pointsContainer = document.getElementById('creation-points-container');
    const scenariosPanel = document.getElementById('creation-scenarios-panel');
    const standardPanels = ['creation-roots-grid', 'creation-physiques-list', 'creation-origins-list', 'creation-traits-grid'].map(id => document.getElementById(id).parentElement);

    if (mode === 'special') {
        pointsContainer.classList.add('hidden');
        scenariosPanel.classList.remove('hidden');
        standardPanels.forEach(p => p.classList.add('hidden'));
        renderCreationScenarios();
    } else {
        pointsContainer.classList.toggle('hidden', mode === 'random');
        scenariosPanel.classList.add('hidden');
        standardPanels.forEach(p => p.classList.remove('hidden'));
        
        renderCreationRoots();
        renderCreationPhysiques();
        renderCreationOrigins();
        renderCreationTraits();
        updateCreationPoints();
    }

    // Set Listeners
    document.getElementById('creation-mode-random').onclick = () => { 
        ui.showLoading(true, "Đang Quay Thiên Mệnh...");
        setTimeout(() => {
            creationSystem.rollRandom(); 
            renderCreationScreen();
            ui.showLoading(false);
            ui.toast("Thiên mệnh đã định!", "success");
        }, 500);
    };
    document.getElementById('creation-mode-custom').onclick = () => { creationSystem.mode = 'custom'; renderCreationScreen(); };
    document.getElementById('creation-mode-special').onclick = () => { creationSystem.mode = 'special'; renderCreationScreen(); };
    
    document.getElementById('creation-name-input').oninput = (e) => { creationSystem.playerName = e.target.value || "Phàm Nhân"; };
    document.getElementById('creation-start-btn').onclick = handleCreationStart;
}

function updateCreationPoints() {
    const pointsEl = document.getElementById('creation-points-value');
    if (pointsEl) {
        pointsEl.textContent = creationSystem.points;
        pointsEl.className = `text-2xl font-bold font-mono ${creationSystem.points >= 0 ? 'text-qi-blue' : 'text-red-500'}`;
    }
}

function renderCreationRoots() {
    const grid = document.getElementById('creation-roots-grid');
    grid.innerHTML = Object.values(CREATION_ROOTS).map(root => `
        <button class="p-4 bg-black/40 border ${creationSystem.selectedRoot === root.id ? 'border-qi-blue bg-qi-blue/5' : 'border-white/5'} rounded-2xl text-left transition-all"
                onclick="window.creationSystem.selectedRoot = '${root.id}'; window.creationSystem.calculatePoints(); window.renderCreationScreen();">
            <div class="text-[10px] font-ancient text-qi-blue mb-1">${root.name}</div>
            <div class="text-[9px] text-gray-500 line-clamp-2">${root.desc}</div>
            <div class="mt-2 text-[10px] font-mono ${root.cost > 0 ? 'text-red-400' : 'text-green-400'}">${root.cost > 0 ? '-' : '+'}${Math.abs(root.cost)} Pts</div>
        </button>
    `).join('');
}

function renderCreationPhysiques() {
    const list = document.getElementById('creation-physiques-list');
    list.innerHTML = Object.values(CREATION_PHYSIQUES).map(phys => `
        <button class="w-full p-4 bg-black/40 border ${creationSystem.selectedPhysique === phys.id ? 'border-qi-blue bg-qi-blue/5' : 'border-white/5'} rounded-2xl text-left flex justify-between items-center transition-all"
                onclick="window.creationSystem.selectedPhysique = '${phys.id}'; window.creationSystem.calculatePoints(); window.renderCreationScreen();">
            <div>
                <div class="text-[10px] font-ancient text-qi-blue mb-1">${phys.name}</div>
                <div class="text-[9px] text-gray-500">${phys.desc}</div>
            </div>
            <div class="text-[10px] font-mono ${phys.cost > 0 ? 'text-red-400' : 'text-green-400'}">${phys.cost > 0 ? '-' : '+'}${Math.abs(phys.cost)} Pts</div>
        </button>
    `).join('');
}

function renderCreationOrigins() {
    const list = document.getElementById('creation-origins-list');
    list.innerHTML = Object.values(CREATION_ORIGINS).map(origin => `
        <button class="w-full p-4 bg-black/40 border ${creationSystem.selectedOrigin === origin.id ? 'border-qi-blue bg-qi-blue/5' : 'border-white/5'} rounded-2xl text-left flex justify-between items-center transition-all"
                onclick="window.creationSystem.selectedOrigin = '${origin.id}'; window.creationSystem.calculatePoints(); window.renderCreationScreen();">
            <div>
                <div class="text-[10px] font-ancient text-qi-purple mb-1">${origin.name}</div>
                <div class="text-[9px] text-gray-500">${origin.desc}</div>
            </div>
            <div class="text-[10px] font-mono ${origin.cost > 0 ? 'text-red-400' : 'text-green-400'}">${origin.cost > 0 ? '-' : '+'}${Math.abs(origin.cost)} Pts</div>
        </button>
    `).join('');
}

function renderCreationTraits() {
    const grid = document.getElementById('creation-traits-grid');
    grid.innerHTML = Object.values(CREATION_TRAITS).map(trait => {
        const isSelected = creationSystem.selectedTraits.includes(trait.id);
        return `
        <button class="p-4 bg-black/40 border ${isSelected ? 'border-qi-blue bg-qi-blue/5' : 'border-white/5'} rounded-2xl text-left transition-all"
                onclick="window.creationSystem.toggleTrait('${trait.id}'); window.renderCreationScreen();">
            <div class="text-[10px] font-ancient ${trait.type === 'advantage' ? 'text-cultivation-gold' : 'text-red-400'} mb-1">${trait.name}</div>
            <div class="text-[9px] text-gray-500 line-clamp-2">${trait.desc}</div>
            <div class="mt-2 text-[10px] font-mono ${trait.cost > 0 ? 'text-red-400' : 'text-green-400'}">${trait.cost > 0 ? '-' : '+'}${Math.abs(trait.cost)} Pts</div>
        </button>
        `;
    }).join('');
}

function renderCreationScenarios() {
    const list = document.getElementById('creation-scenarios-list');
    list.innerHTML = Object.values(CREATION_SCENARIOS).map(scen => `
        <button class="w-full p-6 bg-black/40 border border-white/5 rounded-3xl text-left hover:border-red-500/50 transition-all group"
                onclick="window.creationSystem.applyScenario('${scen.id}'); window.handleCreationStart();">
            <div class="text-xl font-charm text-red-400 mb-2 group-hover:text-red-300">${scen.name}</div>
            <div class="text-xs text-gray-400 italic mb-4">"${scen.desc}"</div>
            <div class="flex space-x-2">
                <span class="px-2 py-1 bg-white/5 rounded-lg text-[8px] uppercase text-gray-500">${CREATION_ROOTS[scen.setup.root].name}</span>
                <span class="px-2 py-1 bg-white/5 rounded-lg text-[8px] uppercase text-gray-500">${CREATION_PHYSIQUES[scen.setup.physique].name}</span>
            </div>
        </button>
    `).join('');
}

function handleCreationStart() {
    if (creationSystem.points < 0 && creationSystem.mode === 'custom') {
        ui.toast("Điểm Tiên Duyên không đủ!", "error");
        return;
    }

    ui.showLoading(true, "Đang Khởi Tạo Tiên Cơ...");
    
    setTimeout(() => {
        const newPlayer = creationSystem.buildPlayer();
        if (newPlayer) {
            player = newPlayer;
            initGameSystems(player, null);
            ui.toggleOverlay(document.getElementById('screen-creation'), false);
            ui.toggleOverlay(document.getElementById('screen-main'), true);
            document.querySelector('header').classList.remove('hidden');
            document.getElementById('time-hud').classList.remove('hidden');
            document.querySelector('nav').classList.remove('hidden');
            saveGame();
            refreshUI();
            ui.showLoading(false);
            ui.alert(`Đạo hữu ${player.name} thân mến, hành trình tu tiên của bạn bắt đầu từ đây. Hãy vững bước trên con đường tìm kiếm đại đạo!`, 'Thiên Cơ Khởi Động');
        } else {
            ui.showLoading(false);
            ui.toast("Khởi tạo thất bại!", "error");
        }
    }, 2000);
}

// Global exposure for onclick handlers
window.renderCreationScreen = renderCreationScreen;
window.handleCreationStart = handleCreationStart;
window.creationSystem = creationSystem;
