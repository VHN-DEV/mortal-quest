import './style.css';
import { Player } from './systems/player.js';
import { SaveSystem } from './systems/save.js';
import { EnemyGenerator, Enemy } from './systems/enemy.js';
import { CombatEngine } from './systems/combat.js';
import { getItemById } from './data/items.js';
import { getWorlds, getLocationById } from './data/maps.js';
import { getRandomEvent } from './data/events.js';
import { ASSETS } from './data/assets.js';
import { NPCSystem } from './systems/npc_system.js';
import { getRealmById } from './data/realms.js';
import { ShopSystem } from './systems/shop_system.js';
import { AlchemySystem } from './systems/alchemy_system.js';
import { GuildSystem } from './systems/guild_system.js';
import { GardenSystem } from './systems/garden_system.js';
import { MountainSystem } from './systems/mountain_system.js';
import { ALCHEMY_RECIPES, getAlchemyLevelInfo } from './data/alchemy_data.js';
import { SEEDS } from './data/garden_data.js';
import { MOUNTAIN_LAYERS } from './data/great_mountain_data.js';
import { ALCHEMY_CERTIFICATIONS, GUILD_MISSIONS, ALCHEMY_ROOMS } from './data/guild_data.js';
import { TOWER_LEVELS, TOWER_MASTERS } from './data/tower_data.js';
import { SECTS, getSectById } from './data/sects.js';
import { DestinySystem } from './systems/destiny_system.js';
import { NPC_STORIES } from './data/npc_stories.js';
import { UISystem } from './systems/ui_system.js';

// Global error handler
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Thiên Cơ Hỗn Loạn:', msg, '\nTại:', url, ':', lineNo, ':', columnNo, '\nChi tiết:', error);
    return false;
};

// State
let player, shopSystem, alchemySystem, guildSystem, gardenSystem, mountainSystem, ui;
let currentCombat = null;
let currentNPC = null;
let selectedItemId = null;
let currentWorldId = 'nhan_gioi';
let currentLocId = null;
let explorationProgress = 0;
let shopView = 'buy';
let alchemyView = 'recipes';
let currentDestiny = null;

// DOM Elements
const screens = document.querySelectorAll('.screen');
const navButtons = document.querySelectorAll('.nav-item');
const elHeaderPortrait = document.getElementById('header-portrait');
const elPlayerNameHeader = document.getElementById('player-name-header');
const elLingShiText = document.getElementById('ling-shi-text');
const elRealm = document.getElementById('current-realm');
const elProgress = document.getElementById('tu-vi-progress');
const elTuViText = document.getElementById('tu-vi-text');
const elPerSec = document.getElementById('tu-vi-per-sec');
const btnCultivate = document.getElementById('cultivate-btn');
const btnBreakthrough = document.getElementById('breakthrough-btn');
const elName = document.getElementById('player-name');

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

// Shop Overlay
const overlayShop = document.getElementById('shop-overlay');
const elShopBuyView = document.getElementById('shop-buy-view');
const elShopSellView = document.getElementById('shop-sell-view');
const elShopSellGrid = document.getElementById('shop-sell-grid');
const elShopLingShi = document.getElementById('shop-ling-shi');
const btnShopTabBuy = document.getElementById('shop-tab-buy');
const btnShopTabSell = document.getElementById('shop-tab-sell');
const btnCloseShop = document.getElementById('close-shop-btn');

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
const btnOpenStats = document.getElementById('open-stats-btn');
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
    player = new Player();
    const savedData = SaveSystem.load();
    
    if (!savedData) {
        showDestinySelection();
    } else {
        player.load(savedData);
        shopSystem = new ShopSystem(player);
        alchemySystem = new AlchemySystem(player, ui);
        guildSystem = new GuildSystem(player, ui);
        gardenSystem = new GardenSystem(player, ui);
        mountainSystem = new MountainSystem(player, ui);
        
        elPlayerNameHeader.textContent = player.name;
        elHeaderPortrait.src = ASSETS.portraits.player;
        document.getElementById('main-player-portrait').src = ASSETS.portraits.player;
    }
    
    ui = new UISystem();
    window.ui = ui; // Expose to window for console access
    
    update();
}

function update() {
    const now = Date.now();
    const delta = (now - player.lastUpdate) / 1000;
    
    player.update();
    
    // Update NPCs
    if (typeof updateNPCs === 'function') {
        updateNPCs(delta);
    }

    if (gardenSystem) gardenSystem.update(delta);
    if (mountainSystem && mountainSystem.isActive) {
        mountainSystem.update(delta);
        renderMountain();
    }

    render();
    requestAnimationFrame(update);
}

function render() {
    const realm = player.getCurrentRealm();
    const progress = (player.tuVi / realm.expRequired) * 100;
    
    elRealm.textContent = realm.name;
    elProgress.style.width = `${Math.min(100, progress)}%`;
    elTuViText.textContent = `${Math.floor(player.tuVi).toLocaleString()} / ${realm.expRequired.toLocaleString()}`;
    elPerSec.textContent = `+${player.tuViPerSecond.toFixed(1)}/s`;
    elLingShiText.textContent = Math.floor(player.lingShi).toLocaleString();

    if (player.canBreakthrough()) btnBreakthrough.classList.remove('hidden');
    else btnBreakthrough.classList.add('hidden');

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
    viewWorlds.classList.add('hidden');
    viewLocations.classList.remove('hidden');
    renderLocationList();
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
    updateExplorationUI();
    viewLocations.classList.add('hidden');
    viewExplore.classList.remove('hidden');
    elExploreEvent.textContent = 'Bạn đã tới địa điểm.';
    
    // Check if this is a shop location
    if (loc.id === 'van_bao_cac') {
        btnEnterShop.classList.remove('hidden');
    } else {
        btnEnterShop.classList.add('hidden');
    }

    // Check if this is a sect location
    if (SECTS[loc.id]) {
        btnEnterSect.classList.remove('hidden');
    } else {
        btnEnterSect.classList.add('hidden');
    }

    // Check if this is a guild location
    if (loc.special === 'guild') btnEnterGuild.classList.remove('hidden');
    else btnEnterGuild.classList.add('hidden');

    if (loc.special === 'tower') btnEnterTower.classList.remove('hidden');
    else btnEnterTower.classList.add('hidden');

    if (loc.special === 'mountain') btnEnterMountain.classList.remove('hidden');
    else btnEnterMountain.classList.add('hidden');

    renderExplore();
}

function updateExplorationUI() {
    elExploreProgress.textContent = `Tiến độ: ${Math.floor(explorationProgress)}%`;
    elExploreBar.style.width = `${explorationProgress}%`;
}

btnMove.onclick = () => {
    if (player.stamina < 5) { alert('Không đủ thể lực!'); return; }
    player.stamina -= 5;
    explorationProgress += 5 + Math.random() * 5;
    if (explorationProgress >= 100) explorationProgress = 100;
    updateExplorationUI();

    const loc = getLocationById(currentWorldId, currentLocId);
    const event = getRandomEvent(loc.eventProbs);

    if (event) {
        elExploreEvent.textContent = event.description;
        if (event.type === 'loot') {
            const resultMsg = event.result(player);
            const droppedShi = Math.floor(Math.random() * 10 * player.realmId);
            player.lingShi += droppedShi;
            setTimeout(() => { elExploreEvent.textContent = resultMsg + ` (+${droppedShi} LT)`; }, 1000);
        } else if (event.type === 'npc') {
            setTimeout(() => { openNPCInteraction(); }, 1000);
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
        overlayShop.classList.remove('hidden');
        renderShop();
    }, 800);
};

btnCloseShop.onclick = () => overlayShop.classList.add('hidden');

btnEnterSect.onclick = () => {
    ui.showLoading(true, "Đang Bước Vào Tông Môn Thánh Địa...");
    setTimeout(() => {
        ui.showLoading(false);
        overlaySects.classList.remove('hidden');
        renderSects();
    }, 800);
};

btnEnterGuild.onclick = () => {
    ui.showLoading(true, "Đang Bước Vào Công Hội Luyện Dược Sư...");
    setTimeout(() => {
        ui.showLoading(false);
        overlayGuild.classList.remove('hidden');
        renderGuild();
    }, 800);
};

btnCloseGuild.onclick = () => overlayGuild.classList.add('hidden');

btnEnterTower.onclick = () => {
    ui.showLoading(true, "Đang Tiến Vào Thánh Địa Đan Tháp...");
    setTimeout(() => {
        ui.showLoading(false);
        overlayTower.classList.remove('hidden');
        renderTower();
    }, 800);
};

btnCloseTower.onclick = () => overlayTower.classList.add('hidden');

btnEnterMountain.onclick = () => {
    ui.showLoading(true, "Đang Tiến Vào Thập Vạn Đại Sơn...");
    setTimeout(() => {
        ui.showLoading(false);
        overlayMountain.classList.remove('hidden');
        mountainSystem.start();
        renderMountain();
    }, 1200);
};

btnCloseMountain.onclick = () => {
    mountainSystem.stop();
    overlayMountain.classList.add('hidden');
};

btnMountainDeeper.onclick = () => {
    mountainSystem.moveDeeper();
    renderMountain();
};

btnMountainRetreat.onclick = () => {
    mountainSystem.retreat();
    renderMountain();
};

btnCloseSects.onclick = () => overlaySects.classList.add('hidden');

function renderShop() {
    elShopLingShi.textContent = Math.floor(player.lingShi);
    if (shopView === 'buy') {
        elShopBuyView.classList.remove('hidden');
        elShopSellView.classList.add('hidden');
        renderShopBuy();
    } else {
        elShopBuyView.classList.add('hidden');
        elShopSellView.classList.remove('hidden');
        renderShopSell();
    }
}

function renderShopBuy() {
    const inv = shopSystem.getShopInventory();
    elShopBuyView.innerHTML = '';
    inv.forEach(item => {
        const itemData = getItemById(item.id);
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
                <div class="text-xs font-mono text-cultivation-gold">${itemData.price} LT</div>
                <button class="px-3 py-1 bg-qi-purple text-white text-[10px] font-bold rounded-lg hover:bg-purple-600 transition-all ${item.stock <= 0 ? 'opacity-50 grayscale' : ''}" onclick="window.game.buyItem('${item.id}')">MUA</button>
            </div>
        `;
        elShopBuyView.appendChild(el);
    });
}

function renderShopSell() {
    elShopSellGrid.innerHTML = '';
    player.inventory.items.forEach(item => {
        const itemData = getItemById(item.id);
        const qClass = getQualityClass(itemData.quality);
        const el = document.createElement('div');
        el.className = `p-2 border border-gray-800 rounded-lg bg-black/20 flex flex-col items-center cursor-pointer hover:border-${qClass}`;
        el.innerHTML = `
            <div class="text-2xl mb-1">${itemData.icon}</div>
            <div class="text-[9px] text-gray-400">x${item.quantity}</div>
            <div class="text-[8px] text-cultivation-gold mt-1">${Math.floor(itemData.price * 0.5)} LT</div>
        `;
        el.onclick = () => {
            const res = shopSystem.sellItem(item.id, 1);
            ui.toast(res.msg, res.success ? 'success' : 'error');
            renderShopSell();
            elShopLingShi.textContent = Math.floor(player.lingShi);
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
    }
};

btnShopTabBuy.onclick = () => { shopView = 'buy'; btnShopTabBuy.className = 'flex-grow py-3 text-cultivation-gold border-b-2 border-cultivation-gold'; btnShopTabSell.className = 'flex-grow py-3 text-gray-500'; renderShop(); };
btnShopTabSell.onclick = () => { shopView = 'sell'; btnShopTabSell.className = 'flex-grow py-3 text-cultivation-gold border-b-2 border-cultivation-gold'; btnShopTabBuy.className = 'flex-grow py-3 text-gray-500'; renderShop(); };

// --- DESTINY SELECTION ---
function showDestinySelection() {
    overlayDestiny.classList.remove('hidden');
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
    shopSystem = new ShopSystem(player);
    craftingSystem = new CraftingSystem(player);

    overlayDestiny.classList.add('hidden');
    SaveSystem.save(player.save());
    
    elPlayerNameHeader.textContent = player.name;
    elHeaderPortrait.src = ASSETS.portraits.player;
    document.getElementById('main-player-portrait').src = ASSETS.portraits.player;
    
    ui.toast("Thức tỉnh thiên mệnh thành công!", "success");
};

// --- CHARACTER & EQUIPMENT ---
function renderCharacter() {
    elCharHp.textContent = `${Math.floor(player.hp)} / ${Math.floor(player.maxHp)}`;
    elCharAtk.textContent = Math.floor(player.atk);
    elCharDef.textContent = Math.floor(player.def);
    elCharSpd.textContent = Math.floor(player.spd);
    elCharMana.textContent = `${Math.floor(player.mana)} / ${Math.floor(player.maxMana)}`;
    
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
                    <button onclick="window.removeFromParty('${npc.id}')" class="text-[8px] text-red-400 hover:text-red-300">RỜI ĐỘI</button>
                </div>
            `).join('');
        }
    }

    equipmentSlots.forEach(slot => {
        const type = slot.dataset.slot;
        const itemId = player.equipment[type];
        slot.innerHTML = '';
        if (itemId) {
            const item = getItemById(itemId);
            const qClass = getQualityClass(item.quality);
            slot.className = `absolute w-12 h-12 border bg-black/60 rounded-lg flex items-center justify-center equipment-slot border-${qClass}/50`;
            slot.innerHTML = `<span class="text-xl">${item.icon}</span>`;
            slot.onclick = () => {
                if (player.unequip(type)) renderCharacter();
            };
        } else {
            slot.className = `absolute w-12 h-12 border border-white/20 bg-black/40 rounded-lg flex items-center justify-center equipment-slot`;
            const icons = { weapon: 'ph-sword', armor: 'ph-coat-hanger', accessory: 'ph-ring', treasure: 'ph-magic-wand' };
            slot.innerHTML = `<i class="ph ${icons[type]} text-gray-600"></i>`;
            slot.onclick = null;
        }
        
        // Position them manually to match CSS grid in HTML
        const positions = {
            weapon: 'top: 1rem; left: 1rem;',
            armor: 'top: 5rem; left: 1rem;',
            accessory: 'top: 9rem; left: 1rem;',
            treasure: 'top: 13rem; left: 1rem;'
        };
        slot.style = positions[type];
    });
}

// --- INVENTORY ---
function renderInventory() {
    elInventoryGrid.innerHTML = '';
    elInventoryCapacity.textContent = `${player.inventory.items.length}/${player.inventory.maxSlots}`;
    player.inventory.items.forEach(item => {
        const itemData = getItemById(item.id);
        const qClass = getQualityClass(itemData.quality);
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
    const qClass = getQualityClass(itemData.quality);
    elItemDetail.classList.remove('hidden');
    elDetailIcon.textContent = itemData.icon;
    elDetailIcon.className = `text-3xl mr-3 bg-black/40 p-2 rounded-lg border border-${qClass}/50`;
    elDetailName.textContent = itemData.name;
    elDetailName.className = `font-bold quality-${qClass}`;
    elDetailType.textContent = `${itemData.quality} phẩm | ${itemData.type}`;
    elDetailDesc.textContent = itemData.description;
    
    btnUseItem.style.display = itemData.type === 'consumable' ? 'block' : 'none';
    
    const equippable = ['weapon', 'armor', 'accessory', 'treasure'].includes(itemData.type);
    btnEquipItem.style.display = equippable ? 'block' : 'none';
    
    renderInventory();
}

btnEquipItem.onclick = () => {
    if (selectedItemId && player.equip(selectedItemId)) {
        selectedItemId = null;
        elItemDetail.classList.add('hidden');
        renderInventory();
    }
};

btnInventorySort.onclick = () => { player.inventory.sortItems(); renderInventory(); };
btnUseItem.onclick = () => {
    if (selectedItemId && player.inventory.useItem(selectedItemId)) {
        if (!player.inventory.items.find(i => i.id === selectedItemId)) { selectedItemId = null; elItemDetail.classList.add('hidden'); }
        renderInventory();
        render();
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
        btnAlchemyTabRecipes.className = 'flex-grow py-2 bg-qi-blue border border-qi-blue/50 rounded-lg text-[10px] font-ancient text-black uppercase';
        btnAlchemyTabGarden.className = 'flex-grow py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-ancient text-gray-500 uppercase';
    } else {
        viewAlchemyRecipes.classList.add('hidden');
        viewAlchemyGarden.classList.remove('hidden');
        btnAlchemyTabRecipes.className = 'flex-grow py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-ancient text-gray-500 uppercase';
        btnAlchemyTabGarden.className = 'flex-grow py-2 bg-qi-blue border border-qi-blue/50 rounded-lg text-[10px] font-ancient text-black uppercase';
    }

    elRecipes.innerHTML = '';
    const lvlInfo = getAlchemyLevelInfo(player.alchemyLevel);
    elLvlText.textContent = lvlInfo.name;
    
    const nextLevelExp = player.alchemyLevel * 100 * Math.pow(1.5, player.alchemyLevel - 1);
    elExpBar.style.width = `${(player.alchemyExp / nextLevelExp) * 100}%`;
    
    if (alchemyView === 'recipes') {
        ALCHEMY_RECIPES.forEach(recipe => {
            const resultItem = getItemById(recipe.resultId);
            const qClass = getQualityClass(resultItem.quality);
            const el = document.createElement('div');
            el.className = 'p-4 border border-gray-800 rounded-2xl bg-white/5 space-y-3';
            
            let materialsHTML = '';
            recipe.materials.forEach(mat => {
                const matItem = getItemById(mat.id);
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
                        `<button class="px-4 py-1.5 bg-qi-blue text-black text-[10px] font-bold rounded-lg active:scale-95 transition-all" onclick="window.game.craft('${recipe.id}')">LUYỆN CHẾ</button>`
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
                            `<button class="px-4 py-2 bg-green-500 text-black text-[10px] font-bold rounded-lg" onclick="window.game.harvest(${index})">THU HOẠCH</button>` :
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

window.game.showPlantMenu = async (index) => {
    // Simple plant for now
    if (player.inventory.hasItem('seed_linh_thao')) {
        gardenSystem.plant(index, 'seed_linh_thao');
        player.inventory.removeItem('seed_linh_thao', 1);
        renderAlchemy();
    } else {
        ui.toast("Bạn không có hạt giống nào!", "error");
    }
};

window.game.harvest = (index) => {
    if (gardenSystem.harvest(index)) {
        ui.toast("Đã thu hoạch linh thảo!", "success");
        renderAlchemy();
        renderInventory();
    }
};

window.game.craft = async (id) => {
    const res = await alchemySystem.craft(id);
    if (res.msg) ui.toast(res.msg, res.success ? 'success' : 'error');
    renderAlchemy();
    renderInventory();
};

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
                <p class="text-[10px] text-gray-500">Phí thuê: ${room.fee} LT | Tăng ${room.successBonus*100}% thành công</p>
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
                                <button class="px-3 py-1 bg-qi-purple text-white text-[10px] font-bold rounded" onclick="window.game.doMission('${m.id}')">NHẬN</button>
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
                <button class="w-full py-2 bg-qi-blue/10 border border-qi-blue/30 text-qi-blue text-xs font-bold rounded-lg ${canJoin ? '' : 'hidden'}" onclick="window.game.joinSect('${sect.id}')">GIA NHẬP</button>
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
        if (mission.reward.lingShi) player.lingShi += mission.reward.lingShi;
        if (mission.reward.tuVi) player.tuVi += mission.reward.tuVi;
        ui.toast(`Hoàn thành: ${mission.name}!`, "success");
        renderSects();
    } else {
        ui.toast('Không đủ thể lực!', "error");
    }
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
        overlayNPC.classList.add('hidden'); 
        startBattleWithNPC(currentNPC); 
    }, 1000); 
};

btnNpcLeave.onclick = () => { 
    overlayNPC.classList.add('hidden'); 
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
    
    renderNPC();
    SaveSystem.save(player.save());
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
    overlayBattle.classList.remove('hidden');
    battleActions.classList.add('hidden');

    currentCombat = new CombatEngine(player, enemy, 
        (type, data) => {
            if (type === 'damage') createDamagePopup(data.target, data.value, data.crit);
            if (type === 'player-turn-start') battleActions.classList.remove('hidden');
            if (type === 'player-turn-end' || type === 'end') battleActions.classList.add('hidden');
        }, 
        (result) => {
            setTimeout(() => {
                overlayBattle.classList.add('hidden');
                currentCombat = null;
                if (result === 'win') {
                    const droppedShi = Math.floor(Math.random() * 20 * enemy.realmId);
                    player.lingShi += droppedShi;
                    ui.toast(`Đắc Thắng! +${droppedShi} Linh Thạch.`, "success");
                }
                SaveSystem.save(player.save());
            }, 2000);
        }
    );
    currentCombat.start();
}

// --- UI & NAV ---
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.id.replace('nav-', 'screen-');
        screens.forEach(s => s.classList.add('hidden'));
        document.getElementById(targetId).classList.remove('hidden');
        navButtons.forEach(b => b.className = 'nav-item flex flex-col items-center flex-grow py-1 text-gray-500 transition-all');
        btn.className = 'nav-item flex flex-col items-center flex-grow py-1 text-cultivation-gold transition-all';

        if (targetId === 'screen-adventure') { renderWorldList(); viewWorlds.classList.remove('hidden'); viewLocations.classList.add('hidden'); viewExplore.classList.add('hidden'); }
        if (targetId === 'screen-character') renderCharacter();
        if (targetId === 'screen-inventory') renderInventory();
        if (targetId === 'screen-alchemy') renderAlchemy();
    });
});

btnBackToWorlds.onclick = () => { viewLocations.classList.add('hidden'); viewWorlds.classList.remove('hidden'); };
btnBackToLocs.onclick = () => { viewExplore.classList.add('hidden'); viewLocations.classList.remove('hidden'); };

btnCultivate.addEventListener('click', (e) => { player.cultivate(); createClickParticle(e.clientX, e.clientY); });
btnBreakthrough.addEventListener('click', async () => { 
    if (player.breakthrough()) { 
        ui.alert('Chúc mừng Đạo hữu đã đột phá thành công, thực lực đại tăng!', 'Xung Kích Thành Công');
        SaveSystem.save(player.save()); 
    } 
});

function createDamagePopup(target, value, crit) {
    const popup = document.createElement('div');
    popup.className = `damage-popup ${crit ? 'text-2xl text-yellow-400 scale-125' : 'text-red-500'}`;
    popup.textContent = `-${value}`;
    const anchor = target === 'enemy' ? elEnemyImg : elBattlePlayerName;
    const rect = anchor.getBoundingClientRect();
    popup.style.left = `${rect.left + rect.width / 2}px`; popup.style.top = `${rect.top}px`;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
}

function createClickParticle(x, y) {
    const p = document.createElement('div');
    p.className = 'qi-particle w-2 h-2';
    p.style.left = `${x}px`; p.style.top = `${y}px`;
    document.querySelector('.qi-particles').appendChild(p);
    setTimeout(() => p.remove(), 3000);
}

btnOpenStats.onclick = () => modalStats.classList.remove('hidden');
btnCloseStats.onclick = () => modalStats.classList.add('hidden');

function updateBattleUI() {
    const p = currentCombat.player; const e = currentCombat.enemy;
    document.getElementById('battle-player-hp').style.width = `${(p.hp / p.maxHp) * 100}%`;
    document.getElementById('battle-enemy-hp').style.width = `${(e.hp / e.maxHp) * 100}%`;
    elBattleLog.innerHTML = currentCombat.log.map(msg => `<div class="mb-1">${msg}</div>`).join('');
    elBattleLog.scrollTop = elBattleLog.scrollHeight;
}

btnAttack.addEventListener('click', () => currentCombat?.doAction('attack'));
btnDefend.addEventListener('click', () => currentCombat?.doAction('defend'));
btnSkill.addEventListener('click', () => currentCombat?.doAction('skill'));

setInterval(() => SaveSystem.save(player.save()), 5000);
init();
