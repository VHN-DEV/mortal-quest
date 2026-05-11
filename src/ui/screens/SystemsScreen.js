import { state } from '../../state.js';
import { getLocationById } from '../../configs/map-data.js';

import { getItemById } from '../../configs/item-data.js';
import { ALCHEMY_RECIPES, getAlchemyLevelInfo, getFlameById, getCauldronById } from '../../configs/alchemy-data.js';
import { SMITHING_RECIPES, getSmithingLevelInfo } from '../../configs/smithing-data.js';
import { SEEDS, SOILS, FIELD_GRADES, FIELD_ATTRIBUTES, HERB_AGE_MILESTONES } from '../../configs/garden-data.js';
import { ALCHEMY_CERTIFICATIONS, GUILD_MISSIONS, ALCHEMY_ROOMS } from '../../configs/guild-data.js';
import { TOWER_LEVELS } from '../../configs/tower-data.js';
import { MOUNTAIN_LAYERS } from '../../configs/mountain-data.js';
import { SECTS, getSectById } from '../../configs/sect-data.js';
import { getRealmById } from '../../configs/realm-data.js';
import { SHOPS } from '../../configs/shop-data.js';
import { ASSETS } from '../../configs/asset-data.js';
import { PUPPET_RECIPES, PUPPET_GRADES } from '../../configs/puppet-data.js';
import { TALISMAN_RECIPES, getTalismanLevelInfo } from '../../configs/talisman-data.js';
import { BEASTS, BEAST_TYPES, BLOODLINES, getBeastLevelInfo } from '../../configs/beast-data.js';


/**
 * Quản lý giao diện của các hệ thống phụ (Alchemy, Shop, Sect, Guild, v.v.)
 * Tạm thời gom vào đây để dọn dẹp main.js. Sau này sẽ tách riêng từng cái.
 */
export class SystemsScreen {
    constructor() {
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
        this.btnShopTabBuy = document.getElementById('shop-tab-buy');
        this.btnShopTabSell = document.getElementById('shop-tab-sell');

        // Other lists
        this.elGuildCerts = document.getElementById('guild-cert-list');
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
                        <button class="px-4 py-2 bg-qi-jade/10 text-qi-jade text-[10px] font-bold rounded-xl border border-qi-jade/20 active:scale-95 transition-all" onclick="window.game.harvest(${index})">THU HOẠCH</button>
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

        this.renderShopSections();
        
        // Cập nhật style cho tab
        if (this.btnShopTabBuy && this.btnShopTabSell) {
            if (state.views.shop === 'buy') {
                this.btnShopTabBuy.className = "flex-grow py-3 text-cultivation-gold border-b-2 border-cultivation-gold text-xs";
                this.btnShopTabSell.className = "flex-grow py-3 text-gray-500 text-xs";
            } else {
                this.btnShopTabBuy.className = "flex-grow py-3 text-gray-500 text-xs";
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
        const shopData = SHOPS[shop.currentShopId];
        
        this.elShopSectionNav.innerHTML = '';
        Object.keys(shopData.sections).forEach(sectionKey => {
            const active = shop.currentSection === sectionKey;
            const el = document.createElement('button');
            el.className = `px-4 py-2 rounded-xl text-[10px] font-ancient uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${active ? 'bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/30' : 'text-gray-500 border border-transparent'}`;
            
            // Map section names to Vietnamese
            const names = {
                'dan_duoc': 'Đan Dược',
                'phap_bao': 'Pháp Bảo',
                'nguyen_lieu': 'Nguyên Liệu',
                'cong_phap': 'Công Pháp',
                'tran_phap': 'Trận Pháp',
                'phu_luc': 'Phù Lục',
                'luyen_khi': 'Luyện Khí',
                'bi_tich': 'Bí Tịch'
            };
            el.textContent = names[sectionKey] || sectionKey;
            el.onclick = () => {
                shop.currentSection = sectionKey;
                this.renderShop();
            };
            this.elShopSectionNav.appendChild(el);
        });
    }

    renderShopBuy() {
        const inv = state.systems.shop.getShopInventory();
        this.elShopBuyView.innerHTML = '';
        inv.forEach(item => {
            const itemData = getItemById(item.id);
            if (!itemData) return;
            const qClass = this.getQualityClass(itemData.quality);
            
            const el = document.createElement('div');
            el.className = `flex items-center justify-between p-3 bg-black/40 border border-gray-800 rounded-xl hover:border-${qClass}`;
            
            const info = document.createElement('div');
            info.className = 'flex items-center space-x-3';
            info.innerHTML = `
                <div class="text-2xl bg-black/60 p-2 rounded-lg border border-${qClass}/30">${itemData.icon}</div>
                <div>
                    <div class="text-sm font-bold text-white">${itemData.name}</div>
                    <div class="text-[9px] font-bold quality-${qClass}">${itemData.quality} phẩm | Kho: ${item.stock}</div>
                </div>
            `;
            
            const finalPrice = Math.floor(itemData.price * (1 - Math.min(0.25, state.player.vipLevel * 0.05)));

            const btnContainer = document.createElement('div');
            btnContainer.className = 'flex items-center space-x-3';
            btnContainer.innerHTML = `
                <div class="text-right">
                    <div class="text-[8px] text-gray-500 line-through">${itemData.price} LT</div>
                    <div class="text-xs font-mono text-cultivation-gold">${finalPrice} LT</div>
                </div>
            `;

            const btn = document.createElement('button');
            btn.className = `px-4 py-2 btn-gold text-[10px] font-bold rounded-lg ${item.stock <= 0 ? 'opacity-50 grayscale pointer-events-none' : ''}`;
            btn.innerHTML = `<i class="ph ph-shopping-cart-simple mr-1"></i>MUA`;
            btn.onclick = () => window.game.buyItem(item.id);
            
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
        
        state.player.inventory.items.forEach(item => {
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

            const qClass = this.getQualityClass(itemData.quality);
            
            let sellMult = 0.5;
            if (['material', 'herb', 'ore', 'wood'].includes(itemData.type)) sellMult = 0.3;

            const el = document.createElement('div');
            el.className = `p-2 border border-gray-800 rounded-lg bg-black/20 flex flex-col items-center cursor-pointer hover:border-${qClass} transition-all active:scale-95`;
            el.innerHTML = `
                <div class="text-2xl mb-1">${itemData.icon}</div>
                <div class="text-[9px] text-gray-400">x${item.quantity}</div>
                <div class="text-[8px] text-cultivation-gold mt-1">${Math.floor(itemData.price * sellMult)} LT</div>
            `;
            el.onclick = () => {
                const res = state.systems.shop.sellItem(item.id, 1);
                state.ui.toast(res.msg, res.success ? 'success' : 'error');
                this.renderShopSell();
                this.elShopLingShi.innerHTML = state.player.getFormattedLingShi();
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
                <button class="px-4 py-2 bg-qi-blue text-black text-[10px] font-bold rounded-lg ${locked ? 'opacity-50' : ''}" 
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
                    <button class="px-4 py-2 ${active ? 'bg-gray-800' : 'bg-cultivation-gold'} text-black text-[10px] font-bold rounded-lg" 
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
        const elOxyText = document.getElementById('mountain-oxygen-text');
        const elOxyBar = document.getElementById('mountain-oxygen-bar');
        const elToxText = document.getElementById('mountain-toxicity-text');
        const elToxBar = document.getElementById('mountain-toxicity-bar');

        if (!state.player.mountainSurvival) return;

        const layer = MOUNTAIN_LAYERS.find(l => l.id === state.systems.mountain.currentLayer);
        if (elLayerName) elLayerName.textContent = layer.name;
        if (elLayerDesc) elLayerDesc.textContent = layer.description;

        if (elOxyText) elOxyText.textContent = `${Math.ceil(state.player.mountainSurvival.oxygen)}%`;
        if (elOxyBar) elOxyBar.style.width = `${state.player.mountainSurvival.oxygen}%`;
        if (elToxText) elToxText.textContent = `${Math.ceil(state.player.mountainSurvival.toxicity)}%`;
        if (elToxBar) elToxBar.style.width = `${state.player.mountainSurvival.toxicity}%`;

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
            elSects.innerHTML = `
                <div class="bg-white/5 rounded-2xl border border-qi-blue/30 overflow-hidden">
                    <div class="h-32 relative">
                        <img src="${sect.portrait || ASSETS.backgrounds.sect}" class="w-full h-full object-cover opacity-40">
                        <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                        <div class="absolute bottom-4 left-4">
                            <h3 class="text-2xl font-ancient text-white">${sect.name}</h3>
                            <p class="text-[10px] text-qi-blue uppercase">Đệ tử nội môn</p>
                        </div>
                    </div>
                    <div class="p-4 space-y-4">
                        <div class="flex justify-between text-xs">
                            <span class="text-gray-500">Điểm cống hiến:</span>
                            <span class="text-cultivation-gold">${state.player.sectContribution || 0}</span>
                        </div>
                        <h4 class="text-xs font-ancient text-gray-300 uppercase tracking-widest border-b border-white/10 pb-2">Nhiệm Vụ Tông Môn</h4>
                        <div class="space-y-3">
                            ${sect.missions.map(m => `
                                <div class="p-3 bg-black/40 rounded-lg border border-white/5 flex justify-between items-center">
                                    <div>
                                        <div class="text-sm font-bold">${m.name}</div>
                                        <div class="text-[9px] text-gray-500">${m.desc}</div>
                                    </div>
                                    <button class="px-4 py-2 bg-qi-purple/10 text-qi-purple text-[10px] font-bold rounded-lg flex items-center justify-center border border-qi-purple/20" onclick="window.game.doMission('${m.id}')">
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
                const canJoin = state.player.realmId >= sect.minRealm;
                const el = document.createElement('div');
                el.className = `p-4 border rounded-xl bg-black/40 space-y-3 ${canJoin ? 'border-gray-800' : 'opacity-50 grayscale'}`;
                el.innerHTML = `
                    <div class="flex justify-between items-center">
                        <h3 class="text-xl font-ancient text-white">${sect.name}</h3>
                        <span class="text-[10px] ${canJoin ? 'text-qi-blue' : 'text-red-500'}">${canJoin ? 'Có thể gia nhập' : 'Cần: ' + getRealmById(sect.minRealm).name}</span>
                    </div>
                    <p class="text-xs text-gray-500">${sect.description}</p>
                    <button class="w-full py-3 bg-qi-blue/10 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-xl flex items-center justify-center ${canJoin ? '' : 'hidden'}" onclick="window.game.joinSect('${sect.id}')">
                        <i class="ph ph-identification-badge mr-2"></i>GIA NHẬP TÔNG MÔN
                    </button>
                `;
                elSects.appendChild(el);
            });
        }
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
        const craftingScreens = ['screen-crafting-hub', 'screen-alchemy', 'screen-talisman', 'screen-smithing', 'screen-formation', 'screen-corpse', 'screen-beast', 'screen-puppet'];
        craftingScreens.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.add('hidden');
                el.classList.remove('flex');
            }
        });

        const target = document.getElementById(`screen-${type}`);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('flex');
            
            if (type === 'alchemy') this.renderAlchemy();
            if (type === 'talisman') this.renderTalisman();
            if (type === 'smithing') this.renderSmithing();
            if (type === 'formation') this.renderFormation();
            if (type === 'corpse') this.renderCorpse();
            if (type === 'beast') this.renderBeast();
            if (type === 'puppet') this.renderPuppet();
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
            const nextLevelExp = state.player.puppetLevel * 100 * Math.pow(1.5, state.player.puppetLevel - 1);
            elBar.style.width = `${(state.player.puppetExp / nextLevelExp) * 100}%`;
        }

        if (view) {
            view.innerHTML = '';
            PUPPET_RECIPES.forEach(recipe => {
                const el = document.createElement('div');
                el.className = 'p-5 border border-white/5 rounded-3xl bg-white/[0.02] space-y-4 group hover:border-qi-blue/30 transition-all';

                let materialsHTML = '';
                recipe.materials.forEach(mat => {
                    const matItem = getItemById(mat.id);
                    const count = state.player.inventory.items.find(i => i.id === mat.id)?.quantity || 0;
                    const enough = count >= mat.quantity;
                    materialsHTML += `
                        <div class="flex justify-between items-center bg-black/20 p-2 rounded-xl border ${enough ? 'border-white/5' : 'border-red-500/20'}">
                            <span class="text-[10px] text-gray-400">${matItem?.name || mat.id}</span>
                            <span class="text-[10px] font-mono ${enough ? 'text-qi-jade' : 'text-red-500'}">${count}/${mat.quantity}</span>
                        </div>
                    `;
                });

                const locked = state.player.puppetLevel < recipe.skillLevel;

                el.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/10 group-hover:scale-110 transition-transform">🤖</div>
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
            const nextLevelExp = state.player.talismanLevel * 100 * Math.pow(1.5, state.player.talismanLevel - 1);
            elBar.style.width = `${(state.player.talismanExp / nextLevelExp) * 100}%`;
        }

        if (view) {
            view.innerHTML = '';
            Object.values(TALISMAN_RECIPES).forEach(recipe => {
                const el = document.createElement('div');
                el.className = 'p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3';

                let materialsHTML = '';
                recipe.materials.forEach(mat => {
                    const matItem = getItemById(mat.id);
                    const count = state.player.inventory.hasItem(mat.id) ? state.player.inventory.items.find(i => i.id === mat.id).quantity : 0;
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
        const tabList = document.getElementById('beast-tab-list');
        const tabHatch = document.getElementById('beast-tab-hatch');

        if (!state.views.beast) state.views.beast = 'list';

        if (state.views.beast === 'list') {
            viewList.classList.remove('hidden');
            viewHatch.classList.add('hidden');
            tabList.classList.add('bg-qi-jade/10', 'text-qi-jade', 'border-qi-jade/20');
            tabHatch.classList.remove('bg-qi-jade/10', 'text-qi-jade', 'border-qi-jade/20');
        } else {
            viewList.classList.add('hidden');
            viewHatch.classList.remove('hidden');
            tabList.classList.remove('bg-qi-jade/10', 'text-qi-jade', 'border-qi-jade/20');
            tabHatch.classList.add('bg-qi-jade/10', 'text-qi-jade', 'border-qi-jade/20');
        }

        // List View
        if (viewList) {
            viewList.innerHTML = '';
            if (state.player.beasts.length === 0) {
                viewList.innerHTML = '<div class="text-center py-10 text-gray-600 italic">Ngươi chưa có linh thú nào...</div>';
            } else {
                state.player.beasts.forEach(beast => {
                    const data = BEASTS[beast.id];
                    const lvlInfo = getBeastLevelInfo(beast.level);
                    const blood = BLOODLINES[beast.bloodline];
                    
                    const el = document.createElement('div');
                    el.className = 'p-4 border border-white/5 rounded-2xl bg-white/[0.02] flex items-center space-x-4';
                    el.innerHTML = `
                        <div class="text-4xl">${data?.icon || '🐾'}</div>
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
        if (viewHatch) {
            viewHatch.innerHTML = '';
            const eggs = state.player.inventory.items.filter(i => getItemById(i.id).type === 'beast_egg');
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
        if (tabList) tabList.onclick = () => { state.views.beast = 'list'; this.renderBeast(); };
        if (tabHatch) tabHatch.onclick = () => { state.views.beast = 'hatch'; this.renderBeast(); };
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

        // Diagrams in Inventory
        const diagrams = state.player.inventory.items.filter(i => getItemById(i.id).type === 'formation_diagram');
        const diagramHeader = document.createElement('h3');
        diagramHeader.className = 'text-[10px] text-gray-500 uppercase tracking-widest mt-6 mb-2';
        diagramHeader.textContent = 'Trận Đồ Trong Túi';
        view.appendChild(diagramHeader);

        if (diagrams.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'text-center py-6 text-gray-700 italic text-xs';
            empty.textContent = 'Trống rỗng...';
            view.appendChild(empty);
        } else {
            diagrams.forEach(d => {
                const item = getItemById(d.id);
                const isActive = state.player.activeFormations.some(af => af.id === d.id);
                const el = document.createElement('div');
                el.className = 'p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3 flex justify-between items-center';
                el.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">📜</div>
                        <div>
                            <h4 class="text-sm font-bold text-white">${item.name}</h4>
                            <p class="text-[9px] text-gray-500">${item.description || ''}</p>
                        </div>
                    </div>
                    ${isActive ? 
                        '<span class="text-[9px] text-qi-purple font-bold">ĐÃ KÍCH HOẠT</span>' :
                        `<button class="px-4 py-2 bg-qi-purple/10 text-qi-purple text-[10px] rounded-xl border border-qi-purple/20" onclick="window.game.activateFormation('${d.id}')">KÍCH HOẠT</button>`
                    }
                `;
                view.appendChild(el);
            });
        }
    }

    renderCorpse() {
        const view = document.getElementById('corpse-list');
        if (view) {
            view.innerHTML = `
                <div class="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div class="text-6xl opacity-20">⚰️</div>
                    <div class="space-y-2">
                        <h3 class="text-lg font-ancient text-gray-500">Luyện Thi Đại Pháp</h3>
                        <p class="text-xs text-gray-600 italic max-w-[200px]">Tính năng đang được Thiên Đạo hoàn thiện, hãy quay lại sau.</p>
                    </div>
                </div>
            `;
        }
    }
}
