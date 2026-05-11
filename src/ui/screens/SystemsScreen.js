import { state } from '../../state.js';
import { getItemById } from '../../configs/item-data.js';
import { ALCHEMY_RECIPES, getAlchemyLevelInfo, getFlameById, getCauldronById } from '../../configs/alchemy-data.js';
import { SMITHING_RECIPES, getSmithingLevelInfo } from '../../configs/smithing-data.js';
import { SEEDS } from '../../configs/garden-data.js';
import { ALCHEMY_CERTIFICATIONS, GUILD_MISSIONS, ALCHEMY_ROOMS } from '../../configs/guild-data.js';
import { TOWER_LEVELS } from '../../configs/tower-data.js';
import { MOUNTAIN_LAYERS } from '../../configs/mountain-data.js';
import { SECTS, getSectById } from '../../configs/sect-data.js';
import { getRealmById } from '../../configs/realm-data.js';

/**
 * Quản lý giao diện của các hệ thống phụ (Alchemy, Shop, Sect, Guild, v.v.)
 * Tạm thời gom vào đây để dọn dẹp main.js. Sau này sẽ tách riêng từng cái.
 */
export class SystemsScreen {
    constructor() {
        this.initElements();
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
        this.btnShopTabBuy = document.getElementById('shop-tab-buy');
        this.btnShopTabSell = document.getElementById('shop-tab-sell');

        // Other lists
        this.elGuildCerts = document.getElementById('guild-cert-list');
        this.elGuildMissions = document.getElementById('guild-mission-list');
        this.elGuildRooms = document.getElementById('guild-room-list');
        this.elTowerFloors = document.getElementById('tower-floor-list');
        this.elSectsView = document.getElementById('sects-view');
    }

    // --- ALCHEMY ---
    renderAlchemy() {
        if (!state.player) return;
        
        if (state.views.alchemy === 'recipes') {
            this.viewAlchemyRecipes.classList.remove('hidden');
            this.viewAlchemyGarden.classList.add('hidden');
        } else {
            this.viewAlchemyRecipes.classList.add('hidden');
            this.viewAlchemyGarden.classList.remove('hidden');
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
        if (cauldronName) cauldronName.textContent = getCauldronById(state.player.currentCauldron)?.name || 'Phàm Lư';
        if (flameName) flameName.textContent = getFlameById(state.player.currentFlame)?.name || 'Linh Hỏa';
    }

    renderRecipes() {
        this.viewAlchemyRecipes.innerHTML = '';
        const known = ALCHEMY_RECIPES.filter(r => state.player.knownRecipes.includes(r.id));
        
        if (known.length === 0) {
            this.viewAlchemyRecipes.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa học được đan phương nào...</div>';
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
                        <span class="text-xl mr-2">${resultItem.icon}</span>
                        <span class="font-bold quality-${qClass} font-ancient">${resultItem.name}</span>
                    </div>
                    ${locked ?
                        `<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${recipe.level}</span>` :
                        `<button class="px-4 py-2 btn-gold text-[10px] font-bold rounded-lg" onclick="window.game.craft('${recipe.id}')">LUYỆN CHẾ</button>`
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
                            `<button class="px-4 py-2 bg-qi-jade/10 text-qi-jade text-[10px] font-bold rounded-lg" onclick="window.game.harvest(${index})">THU HOẠCH</button>` :
                            `<div class="text-[10px] font-mono text-qi-blue">${Math.ceil(plot.remainingTime)}s</div>`
                        }
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
            this.elGardenPlots.appendChild(el);
        });
    }

    // --- SHOP ---
    renderShop() {
        this.elShopLingShi.textContent = state.player.getFormattedLingShi();
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

    renderShopBuy() {
        const inv = state.systems.shop.getShopInventory();
        this.elShopBuyView.innerHTML = '';
        inv.forEach(item => {
            const itemData = getItemById(item.id);
            if (!itemData) return;
            const qClass = this.getQualityClass(itemData.quality);
            const el = document.createElement('div');
            el.className = `flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-xl`;
            el.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="text-2xl">${itemData.icon}</div>
                    <div>
                        <div class="text-sm font-bold text-white">${itemData.name}</div>
                        <div class="text-[9px] font-bold quality-${qClass}">${itemData.quality} phẩm</div>
                    </div>
                </div>
                <button class="px-4 py-2 btn-gold text-[10px] font-bold rounded-lg" onclick="window.game.buyItem('${item.id}')">
                    ${itemData.price} LT
                </button>
            `;
            this.elShopBuyView.appendChild(el);
        });
    }

    renderShopSell() {
        this.elShopSellGrid.innerHTML = '';
        state.player.inventory.items.forEach(item => {
            const itemData = getItemById(item.id);
            if (!itemData) return;
            const qClass = this.getQualityClass(itemData.quality);
            const el = document.createElement('div');
            el.className = `p-2 border border-gray-800 rounded-lg bg-black/20 flex flex-col items-center cursor-pointer hover:border-${qClass}`;
            el.innerHTML = `
                <div class="text-2xl mb-1">${itemData.icon}</div>
                <div class="text-[9px] text-gray-400">x${item.quantity}</div>
            `;
            el.onclick = () => window.game.sellItem(item.id, 1);
            this.elShopSellGrid.appendChild(el);
        });
    }

    // --- GUILD ---
    renderGuild() {
        this.elGuildCerts.innerHTML = '';
        ALCHEMY_CERTIFICATIONS.forEach(cert => {
            const el = document.createElement('div');
            el.className = 'p-4 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center';
            el.innerHTML = `
                <h4 class="text-sm font-ancient text-white">${cert.name}</h4>
                <button class="px-4 py-2 bg-qi-blue text-black text-[10px] font-bold rounded-lg" onclick="window.game.guildCertify(${cert.level})">KHẢO HẠCH</button>
            `;
            this.elGuildCerts.appendChild(el);
        });
    }

    getQualityClass(quality) {
        const map = { 'Phàm': 'pham', 'Hoàng': 'hoang', 'Huyền': 'huyen', 'Địa': 'dia', 'Thiên': 'thien', 'Tiên': 'tien', 'Thần': 'than' };
        return map[quality] || 'pham';
    }

    renderSmithing() {
        const view = document.getElementById('smithing-recipes');
        if (!view) return;
        view.innerHTML = '';

        const toolName = document.getElementById('smithing-tool-name');
        const flameName = document.getElementById('smithing-flame-name');
        if (toolName) toolName.textContent = state.player.smithingTool ? getItemById(state.player.smithingTool)?.name : 'Chưa có';
        if (flameName) flameName.textContent = getFlameById(state.player.currentFlame)?.name || 'Linh Hỏa Cơ Bản';

        const lvlInfo = getSmithingLevelInfo(state.player.smithingLevel);
        const lvlText = document.getElementById('smithing-level-text');
        if (lvlText) lvlText.textContent = lvlInfo.name;

        const recipes = Object.values(SMITHING_RECIPES).filter(r => state.player.knownSmithingRecipes.includes(r.id));
        
        if (recipes.length === 0) {
            view.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa học được bản vẽ nào...</div>';
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
                const count = state.player.inventory.items.find(i => i.id === mat.id)?.quantity || 0;
                const enough = count >= mat.quantity;
                materialsHTML += `<div class="text-[10px] ${enough ? 'text-gray-400' : 'text-red-500'}">${matItem?.name || mat.id}: ${count}/${mat.quantity}</div>`;
            });

            const locked = state.player.smithingLevel < recipe.level;

            el.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <span class="text-xl mr-2">${item.icon}</span>
                        <span class="font-bold quality-${qClass} font-ancient">${item.name}</span>
                    </div>
                    ${locked ?
                        `<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${recipe.level}</span>` :
                        `<button class="px-4 py-2 btn-gold text-[10px] font-bold rounded-lg" onclick="window.game.forge('${recipe.id}')">RÈN ĐÚC</button>`
                    }
                </div>
                <div class="grid grid-cols-2 gap-1">${materialsHTML}</div>
                <div class="text-[9px] text-gray-500 italic">Thể lực: ${recipe.staminaCost} | Linh lực: ${recipe.manaCost}</div>
            `;
            view.appendChild(el);
        });
    }

    openCrafting(type) {
        // Toggle specific crafting sub-screens
        const craftingScreens = ['screen-alchemy', 'screen-talisman', 'screen-smithing', 'screen-formation', 'screen-corpse', 'screen-beast'];
        craftingScreens.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.add('hidden');
                el.classList.remove('flex');
            }
        });

        const target = document.getElementById(`screen-${type}`);
        if (target) {
            state.ui.toggleOverlay(target, true);
            if (type === 'alchemy') this.renderAlchemy();
            if (type === 'smithing') this.renderSmithing();
        }
    }
}
