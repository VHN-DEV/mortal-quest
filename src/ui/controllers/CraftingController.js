import { state } from '../../state.js';
import { getItemById } from '../../configs/item-data.js';
import { SMITHING_RECIPES, getSmithingLevelInfo } from '../../configs/smithing-data.js';
import { PUPPET_RECIPES, PUPPET_GRADES } from '../../configs/puppet-data.js';
import { TALISMAN_RECIPES, getTalismanLevelInfo } from '../../configs/talisman-data.js';
import { BEASTS, BEAST_TYPES, BLOODLINES, getBeastLevelInfo } from '../../configs/beast-data.js';
import { ASSETS, getAssetUrl } from '../../configs/asset-data.js';
import { CORPSE_TYPES, CORPSE_EVOLUTIONS, CORPSE_MODES, getCorpseLevelInfo } from '../../configs/corpse-data.js';
import { getFlameById, getAlchemyLevelInfo } from '../../configs/alchemy-data.js';
import { SECTS } from '../../configs/sect-data.js';
import { CLANS } from '../../configs/clan-data.js';

export class CraftingController {
    constructor(parentScreen) {
        this.parentScreen = parentScreen;
    }

    getQualityClass(quality) {
        return this.parentScreen.getQualityClass(quality);
    }

    renderSmithing() {
        const view = document.getElementById('smithing-recipes');
        if (!view) return;
        view.innerHTML = '';

        const toolName = document.getElementById('smithing-tool-name');
        const flameName = document.getElementById('smithing-flame-name');

        if (toolName) {
            const tool = state.player.smithingTool ? getItemById(state.player.smithingTool) : null;
            if (tool) {
                toolName.innerHTML = `<span class="text-white">${tool.name}</span>`;
            } else {
                toolName.innerHTML = `<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'luyen_khi')" class="ml-2 text-[8px] text-red-400 underline hover:text-white transition-colors">MUA NGAY</button>`;
            }
        }

        if (flameName) {
            const flame = getFlameById(state.player.currentFlame);
            if (flame) {
                flameName.innerHTML = `<span class="text-white">${flame.name}</span>`;
            } else {
                flameName.innerHTML = `<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-red-400 underline hover:text-white transition-colors">MUA NGAY</button>`;
            }
        }

        const lvlInfo = getSmithingLevelInfo(state.player.smithingLevel);
        const lvlText = document.getElementById('smithing-level-text');
        if (lvlText) lvlText.textContent = lvlInfo.name;

        const recipes = Object.values(SMITHING_RECIPES).filter(r => state.player.knownSmithingRecipes.includes(r.id));

        if (recipes.length === 0) {
            view.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được bản vẽ nào...</div>';
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
                const count = state.player.inventory.allItems.find(i => i.id === mat.id)?.quantity || 0;
                const enough = count >= mat.quantity;
                materialsHTML += `<div class="text-[10px] ${enough ? 'text-gray-400' : 'text-red-500'}">${matItem?.name || mat.id}: ${count}/${mat.quantity}</div>`;
            });

            const locked = state.player.smithingLevel < recipe.level;

            el.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <span class="text-xl mr-2">${(item.image && getAssetUrl(item.image)) ? `<img src="${getAssetUrl(item.image)}" class="w-6 h-6 object-contain inline-block">` : (item.icon || '')}</span>
                        <span class="font-bold quality-${qClass} font-ancient">${item.name}</span>
                    </div>
                    ${locked ?
                    `<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${recipe.level}</span>` :
                    `<button class="px-4 py-2 btn-gold text-[10px] font-bold rounded-lg whitespace-nowrap" onclick="window.game.forge('${recipe.id}')">${recipe.type === 'bag_upgrade' ? 'NÂNG CẤP' : 'RÈN ĐÚC'}</button>`
                }
                </div>
                <div class="grid grid-cols-2 gap-1">${materialsHTML}</div>
                <div class="text-[9px] text-gray-500 italic">Thể lực: ${recipe.staminaCost} | Linh lực: ${recipe.manaCost}</div>
            `;
            view.appendChild(el);
        });
    }

    openCrafting(type) {
        if (!state.player) return;

        if (state.player.realmId < 1) {
            state.ui.toast("Ngươi vẫn là phàm nhân, chưa tu luyện linh lực, thần thức chưa mở, làm sao hành nghề bách nghệ!", "error");
            return;
        }

        // Check if player is at an eligible location (Cave Abode, Sect, or Clan) (PNTT logic)
        const hasLocalAbode = state.player.abodes && state.player.abodes.some(a => a.locationId === state.currentLocId);
        const isSectBase = SECTS && SECTS[state.currentLocId];
        const isClanBase = CLANS && CLANS[state.currentLocId];
        
        if (!hasLocalAbode && !isSectBase && !isClanBase) {
            state.ui.toast("Không thể hành nghề bách nghệ tại đây! Cần ở trong Động Phủ của mình hoặc tại Tông Môn/Gia Tộc có linh mạch cố định.", "error");
            return;
        }

        // Bách nghệ block
        const isUnlocked = state.player.unlockedProfessions.includes(type);
        if (!isUnlocked) {
            state.ui.toast("Ngươi chưa nắm vững bí pháp của nghề này!", "error");
            return;
        }

        const screens = {
            alchemy: 'screen-alchemy',
            smithing: 'screen-smithing',
            talisman: 'screen-talisman',
            formation: 'screen-formation',
            beast: 'screen-beast',
            puppet: 'screen-puppet',
            corpse: 'screen-corpse',
            linh_thuc: 'screen-linh-thuc',
            linh_tuu: 'screen-linh-tuu',
            cam_che: 'screen-cam-che'
        };

        const screenId = screens[type];
        if (screenId) {
            state.ui.switchScreen(screenId);
            if (type === 'alchemy' && this.parentScreen && this.parentScreen.alchemyController) this.parentScreen.alchemyController.renderAlchemy();
            if (type === 'smithing') this.renderSmithing();
            if (type === 'talisman') this.renderTalisman();
            if (type === 'formation') this.renderFormation();
            if (type === 'beast') this.renderBeast();
            if (type === 'puppet') this.renderPuppet();
            if (type === 'corpse') this.renderCorpse();
            if (type === 'linh_thuc' && this.parentScreen?.spiritPlanterController) this.parentScreen.spiritPlanterController.render();
            if (type === 'linh_tuu' && this.parentScreen?.spiritWineController) this.parentScreen.spiritWineController.render();
            if (type === 'cam_che' && this.parentScreen?.camCheController) this.parentScreen.camCheController.render();
        }
    }

    openCraftingHub() {
        const craftingScreens = [
            'screen-alchemy', 'screen-talisman', 'screen-smithing', 'screen-formation',
            'screen-corpse', 'screen-beast', 'screen-puppet',
            'screen-linh-thuc', 'screen-linh-tuu', 'screen-cam-che'
        ];
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
        const viewRecipes = document.getElementById('puppet-recipes-view');
        const viewOwned = document.getElementById('puppet-owned-view');
        const tabCraft = document.getElementById('puppet-tab-craft');
        const tabOwned = document.getElementById('puppet-tab-owned');

        if (!state.views.puppet) state.views.puppet = 'craft';

        // Update Views Visibility
        if (state.views.puppet === 'owned') {
            if (viewRecipes) viewRecipes.classList.add('hidden');
            if (viewOwned) viewOwned.classList.remove('hidden');
        } else {
            if (viewRecipes) viewRecipes.classList.remove('hidden');
            if (viewOwned) viewOwned.classList.add('hidden');
        }

        // Update Tab Styles
        const activeClass = ['bg-qi-blue/10', 'text-qi-blue', 'border-qi-blue/20'];
        const inactiveClass = ['bg-transparent', 'text-gray-500', 'border-transparent'];

        [tabCraft, tabOwned].forEach(tab => {
            if (tab) {
                tab.classList.remove(...activeClass, ...inactiveClass);
                const isActive = (tab === tabCraft && state.views.puppet === 'craft') ||
                    (tab === tabOwned && state.views.puppet === 'owned');
                tab.classList.add(...(isActive ? activeClass : inactiveClass));
            }
        });

        // Update Level/Exp Display
        if (elLvl) elLvl.textContent = `Khôi Lỗi Sư - Cấp ${state.player.puppetLevel}`;
        if (elBar) {
            const nextLevelExp = Math.max(1, state.player.puppetLevel * 100 * Math.pow(1.5, state.player.puppetLevel - 1));
            elBar.style.width = `${Math.min(100, (state.player.puppetExp / nextLevelExp) * 100)}%`;
        }

        // Render Recipes View
        if (viewRecipes && state.views.puppet === 'craft') {
            viewRecipes.innerHTML = '';
            const known = PUPPET_RECIPES.filter(r => state.player.knownPuppetRecipes.includes(r.id));

            if (known.length === 0) {
                viewRecipes.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa có bản thiết kế khôi lỗi nào...</div>';
            } else {
                known.forEach(recipe => {
                    const el = document.createElement('div');
                    el.className = 'p-5 border border-white/5 rounded-3xl bg-white/[0.02] space-y-4 group hover:border-qi-blue/30 transition-all';

                    let materialsHTML = '';
                    recipe.materials.forEach(mat => {
                        const matItem = getItemById(mat.id);
                        const count = state.player.inventory.allItems.find(i => i.id === mat.id)?.quantity || 0;
                        const enough = count >= mat.quantity;
                        materialsHTML += `
                            <div class="flex justify-between items-center bg-black/20 p-2 rounded-xl border ${enough ? 'border-white/5' : 'border-red-500/20'}">
                                <span class="text-[10px] text-gray-400">${matItem?.name || mat.id}</span>
                                <span class="text-[10px] font-mono ${enough ? 'text-qi-jade' : 'text-red-500'}">${count}/${mat.quantity}</span>
                            </div>
                        `;
                    });

                    const locked = state.player.puppetLevel < recipe.skillLevel;
                    const puppetImg = ASSETS.puppets[recipe.id];

                    el.innerHTML = `
                        <div class="flex justify-between items-start">
                            <div class="flex items-center space-x-3">
                                <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 group-hover:scale-110 transition-transform">
                                    ${puppetImg ? `<img src="${puppetImg}" class="w-full h-full object-cover">` : '🤖'}
                                </div>
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
                    viewRecipes.appendChild(el);
                });
            }
        }

        // Render Owned View
        if (viewOwned && state.views.puppet === 'owned') {
            viewOwned.innerHTML = '';
            const owned = state.player.inventory.allItems.filter(i => i.id === 'khoi_loi' && i.metadata?.uniqueId);

            if (owned.length === 0) {
                viewOwned.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa sở hữu khôi lỗi nào. Hãy chọn tab Luyện Chế để chế tạo khôi lỗi!</div>';
            } else {
                owned.forEach(puppet => {
                    const meta = puppet.metadata;
                    const stats = meta.stats || {};
                    const isDeployed = meta.deployed || false;
                    const mode = meta.mode || 'COMBAT';
                    const durability = Math.floor(meta.durability !== undefined ? meta.durability : 100);
                    const maxDurability = meta.maxDurability || 100;
                    const hasIntel = meta.hasIntelligence || false;
                    const puppetImg = ASSETS.puppets[meta.puppetId];
                    
                    // Mode display name mapping
                    const modeNames = { COMBAT: 'Chiến Đấu', SCOUT: 'Trinh Thám', GATHER: 'Thu Thập', GUARD: 'Hộ Vệ' };
                    
                    // Calculate repair cost
                    const missingDur = maxDurability - durability;
                    const repairCost = Math.max(100, Math.floor(missingDur * 20 * (state.player.puppetLevel || 1)));

                    const el = document.createElement('div');
                    el.className = `p-4 border ${isDeployed ? 'border-qi-blue/30 bg-qi-blue/[0.02]' : 'border-white/5 bg-white/[0.02]'} rounded-2xl flex flex-col space-y-3`;

                    // Generate Mode Selection HTML if deployed
                    let modeSelectorHtml = '';
                    if (isDeployed) {
                        modeSelectorHtml = `
                            <div class="mt-2 flex flex-col space-y-1.5 border-t border-white/5 pt-2">
                                <span class="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Chế độ hoạt động:</span>
                                <div class="grid grid-cols-4 gap-1">
                                    ${['COMBAT', 'GUARD', 'GATHER', 'SCOUT'].map(m => {
                                        const active = mode === m;
                                        return `
                                            <button class="py-1 text-[8px] font-bold rounded-lg border transition-all ${active ? 'bg-qi-blue/20 text-qi-blue border-qi-blue/30' : 'bg-transparent text-gray-500 border-white/5 hover:border-white/15'}"
                                                onclick="window.game.setPuppetMode('${meta.uniqueId}', '${m}')">
                                                ${modeNames[m]}
                                            </button>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }

                    // Generate Repair Button if damaged
                    let repairBtnHtml = '';
                    if (durability < maxDurability) {
                        repairBtnHtml = `
                            <button class="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-xl text-[9px] font-bold active:scale-95 transition-all"
                                onclick="window.game.repairPuppet('${meta.uniqueId}')">
                                SỬA CHỮA (Cần NL & LT)
                            </button>
                        `;
                    }

                    el.innerHTML = `
                        <div class="flex items-start space-x-4">
                            <div class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0 relative">
                                ${puppetImg ? `<img src="${puppetImg}" class="w-full h-full object-cover">` : `<span class="text-3xl">🤖</span>`}
                                ${isDeployed ? `<span class="absolute top-0 right-0 bg-qi-blue text-black text-[7px] font-extrabold px-1 rounded-bl">XUẤT CHIẾN</span>` : ''}
                            </div>
                            <div class="flex-grow">
                                <div class="flex justify-between items-center">
                                    <h4 class="font-bold text-white text-sm flex items-center space-x-2">
                                        <span>${meta.name}</span>
                                        ${hasIntel ? `<span class="text-[7px] bg-amber-500/20 text-amber-400 px-1 rounded border border-amber-500/30 uppercase tracking-widest font-extrabold">⚡ LINH TRÍ</span>` : ''}
                                    </h4>
                                    <span class="text-[8px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full border border-white/10 font-mono">${meta.quality}</span>
                                </div>
                                <div class="text-[9px] text-gray-500 mt-0.5">Trạng thái: ${isDeployed ? `Đang hoạt động [${modeNames[mode]}]` : 'Nghỉ ngơi'}</div>
                                <div class="w-full h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden border border-white/5">
                                    <div class="h-full bg-gradient-to-r ${durability <= 20 ? 'from-red-500 to-orange-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]' : 'from-qi-blue to-qi-purple shadow-[0_0_4px_rgba(0,191,255,0.4)]'}" 
                                         style="width: ${(durability / maxDurability) * 100}%"></div>
                                </div>
                                <div class="flex justify-between text-[8px] text-gray-400 mt-1">
                                    <span>Độ bền: ${durability}/${maxDurability}</span>
                                    ${durability <= 20 ? '<span class="text-red-400 font-bold animate-pulse">⚠️ Sắp Hỏng</span>' : ''}
                                </div>
                            </div>
                        </div>

                        <!-- Puppet Stats Grid -->
                        <div class="grid grid-cols-3 gap-2 bg-white/[0.01] border border-white/5 rounded-xl p-2 text-center text-[9px]">
                            <div>
                                <span class="text-gray-500 block">Khí Huyết</span>
                                <span class="text-red-400 font-bold">${stats.hp || 0}</span>
                            </div>
                            <div>
                                <span class="text-gray-500 block">Công Kích</span>
                                <span class="text-yellow-400 font-bold">${stats.atk || 0}</span>
                            </div>
                            <div>
                                <span class="text-gray-500 block">Phòng Ngự</span>
                                <span class="text-blue-400 font-bold">${stats.def || 0}</span>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex items-center space-x-2 pt-1">
                            <button class="flex-grow py-1.5 text-[9px] font-bold rounded-xl border transition-all active:scale-95 ${isDeployed ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' : 'bg-qi-blue text-black border-qi-blue hover:opacity-90'}"
                                onclick="window.game.deployPuppet('${meta.uniqueId}')">
                                ${isDeployed ? 'THU HỒI' : 'XUẤT CHIẾN'}
                            </button>
                            ${repairBtnHtml}
                        </div>

                        ${modeSelectorHtml}
                    `;
                    viewOwned.appendChild(el);
                });
            }
        }

        // Event Listeners for Tabs
        if (tabCraft) tabCraft.onclick = () => { state.views.puppet = 'craft'; this.renderPuppet(); };
        if (tabOwned) tabOwned.onclick = () => { state.views.puppet = 'owned'; this.renderPuppet(); };
    }

    renderTalisman() {
        if (!state.player) return;
        const lvlInfo = getTalismanLevelInfo(state.player.talismanLevel);
        const elLvl = document.getElementById('talisman-level-text');
        const elBar = document.getElementById('talisman-exp-bar');
        const view = document.getElementById('talisman-recipes');

        if (elLvl) elLvl.textContent = lvlInfo.name;
        if (elBar) {
            const nextLevelExp = Math.max(1, state.player.talismanLevel * 100 * Math.pow(1.5, state.player.talismanLevel - 1));
            elBar.style.width = `${Math.min(100, (state.player.talismanExp / nextLevelExp) * 100)}%`;
        }

        // Update Pen Name
        const penName = document.getElementById('current-pen-name');
        if (penName) {
            const pen = state.player.currentTalismanPen ? getItemById(state.player.currentTalismanPen) : null;
            if (pen) {
                penName.innerHTML = `<span class="text-white">${pen.name}</span>`;
            } else {
                penName.innerHTML = `<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phu_luc')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`;
            }
        }

        if (view) {
            view.innerHTML = '';
            const known = Object.values(TALISMAN_RECIPES).filter(r => state.player.knownTalismanRecipes.includes(r.id));

            if (known.length === 0) {
                view.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được phù văn nào...</div>';
                return;
            }

            known.forEach(recipe => {
                const el = document.createElement('div');
                el.className = 'p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3';

                let materialsHTML = '';
                recipe.materials.forEach(mat => {
                    const matItem = getItemById(mat.id);
                    const count = state.player.inventory.allItems.find(i => i.id === mat.id)?.quantity || 0;
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
        const tabBeast = document.getElementById('beast-tab-beast');
        const tabInsect = document.getElementById('beast-tab-insect');
        const tabHatch = document.getElementById('beast-tab-hatch');

        if (!state.views.beast) state.views.beast = 'beast';

        // Update Views Visibility
        if (state.views.beast === 'hatch') {
            if (viewList) viewList.classList.add('hidden');
            if (viewHatch) viewHatch.classList.remove('hidden');
        } else {
            if (viewList) viewList.classList.remove('hidden');
            if (viewHatch) viewHatch.classList.add('hidden');
        }

        // Update Tab Styles
        const activeClass = ['bg-qi-jade/10', 'text-qi-jade', 'border-qi-jade/20'];
        const inactiveClass = ['bg-transparent', 'text-gray-500', 'border-transparent'];

        [tabBeast, tabInsect, tabHatch].forEach(tab => {
            if (tab) {
                tab.classList.remove(...activeClass, ...inactiveClass);
                const isActive = (tab === tabBeast && state.views.beast === 'beast') ||
                    (tab === tabInsect && state.views.beast === 'insect') ||
                    (tab === tabHatch && state.views.beast === 'hatch');
                tab.classList.add(...(isActive ? activeClass : inactiveClass));
            }
        });

        // Update Level/Exp Display
        const elLvl = document.getElementById('beast-level-text');
        const elExp = document.getElementById('beast-exp-bar');

        const curLevel = state.views.beast === 'insect' ? state.player.insectLevel : state.player.beastLevel;
        const curExp = state.views.beast === 'insect' ? state.player.insectExp : state.player.beastExp;

        if (elLvl) elLvl.textContent = `Cấp ${curLevel}`;
        if (elExp) {
            const nextLevelExp = Math.max(1, curLevel * 100 * Math.pow(1.5, curLevel - 1));
            elExp.style.width = `${Math.min(100, (curExp / nextLevelExp) * 100)}%`;
        }

        // Bind Click Evolve helper globally so it can be called from onclick
        window.game.clickEvolveBeast = async (beastUniqueId) => {
            const beast = state.player.beasts.find(b => b.uniqueId === beastUniqueId);
            if (!beast) return;
            const beastData = BEASTS[beast.id];
            if (!beastData || !beastData.evolutions) return;
            const evolution = beastData.evolutions.find(e => beast.level >= e.levelRequired);
            if (!evolution) return;

            if (evolution.levelRequired >= 50) {
                const optionsList = [
                    { id: 'cương_đới', name: '✊ Cương đới độ kiếp', desc: 'Chỉ dựa vào linh tính căn bản. Tỷ lệ thành công: 40%' }
                ];
                if (state.player.lingShi >= 5000) {
                    optionsList.push({ id: 'lingshi', name: '🔮 Lập Phản Lôi Trận (-5,000 LT)', desc: 'Tăng +20% tỷ lệ thành công.' });
                }
                if (state.player.inventory.hasItem('da_lan_giap', 1)) {
                    optionsList.push({ id: 'da_lan_giap', name: '🛡️ Tiêu hao Đá Lân Giáp', desc: 'Tăng +30% tỷ lệ thành công.' });
                }
                if (state.player.inventory.hasItem('long_lan_giap', 1)) {
                    optionsList.push({ id: 'long_lan_giap', name: '🐉 Tiêu hao Long Lân Giáp', desc: 'Vảy rồng hộ thể, tăng +30% tỷ lệ thành công.' });
                }
                if (state.player.lingShi >= 5000 && state.player.inventory.hasItem('da_lan_giap', 1) && state.player.inventory.hasItem('han_ngoc_tuy', 1)) {
                    optionsList.push({ id: 'all_da', name: '🌟 Lôi Trận + Đá Giáp + Hàn Ngọc Tủy', desc: 'Phòng hộ tối cao, tỷ lệ thành công: 95%' });
                }
                if (state.player.lingShi >= 5000 && state.player.inventory.hasItem('long_lan_giap', 1) && state.player.inventory.hasItem('han_ngoc_tuy', 1)) {
                    optionsList.push({ id: 'all_long', name: '🔥 Lôi Trận + Long Lân Giáp + Hàn Ngọc Tủy', desc: 'Đầy đủ chuẩn bị nghịch thiên, tỷ lệ thành công: 95%' });
                }

                const choice = await state.ui.promptOptions(
                    `⚡ HÓA HÌNH YÊU KIẾP: ĐỘ KIẾP TIẾN HÓA`,
                    optionsList,
                    `Tiến hóa lên ${evolution.newName || 'cấp mới'} yêu cầu linh thú vượt qua Yêu Kiếp lôi điện cuồng bạo. Ngươi muốn chuẩn bị hộ pháp thế nào?`
                );

                if (!choice) return;

                const evolveOptions = {};
                if (choice === 'lingshi') evolveOptions.useLingshi = true;
                else if (choice === 'da_lan_giap') evolveOptions.useArmor = 'da_lan_giap';
                else if (choice === 'long_lan_giap') evolveOptions.useArmor = 'long_lan_giap';
                else if (choice === 'all_da') {
                    evolveOptions.useLingshi = true;
                    evolveOptions.useArmor = 'da_lan_giap';
                    evolveOptions.useHanNgocTuy = true;
                } else if (choice === 'all_long') {
                    evolveOptions.useLingshi = true;
                    evolveOptions.useArmor = 'long_lan_giap';
                    evolveOptions.useHanNgocTuy = true;
                }

                window.game.evolveBeast(beastUniqueId, evolveOptions);
            } else {
                window.game.evolveBeast(beastUniqueId);
            }
        };

        // List View Rendering
        if (viewList && state.views.beast !== 'hatch') {
            viewList.innerHTML = '';

            const filteredBeasts = state.player.beasts.filter(beast => {
                const data = BEASTS[beast.id];
                if (!data) return false;
                if (state.views.beast === 'beast') {
                    return [BEAST_TYPES.LINH_THU, BEAST_TYPES.DI_THU, BEAST_TYPES.THAN_THU].includes(data.type);
                } else if (state.views.beast === 'insect') {
                    return [BEAST_TYPES.LINH_TRUNG, BEAST_TYPES.KY_TRUNG].includes(data.type);
                }
                return true;
            });

            if (filteredBeasts.length === 0) {
                const typeName = state.views.beast === 'beast' ? 'linh thú' : 'kỳ trùng';
                viewList.innerHTML = `<div class="text-center py-10 text-gray-600 italic">Ngươi chưa có ${typeName} nào...</div>`;
            } else {
                filteredBeasts.forEach(beast => {
                    const data = BEASTS[beast.id];
                    const lvlInfo = getBeastLevelInfo(beast.level);
                    const blood = BLOODLINES[beast.bloodline];
                    const isActive = state.player.activeBeast === beast.uniqueId || state.player.activeInsect === beast.uniqueId;
                    const isInjured = beast.status === 'injured';

                    const beastImg = ASSETS.beasts[beast.id];

                    // Find food in player inventory
                    const foodIds = ['linh_thu_dan', 'yeu_nhuc_tuoi', 'ha_pham_yeu_dan', 'trung_pham_yeu_dan'];
                    if (state.views.beast === 'insect') {
                        foodIds.push('huyen_thiet', 'tinh_kim');
                    }
                    
                    let foodOptionsHtml = '';
                    foodIds.forEach(fid => {
                        const qty = state.player.inventory.getItemQuantity(fid);
                        if (qty > 0) {
                            const name = getItemById(fid)?.name || fid;
                            foodOptionsHtml += `
                                <button class="px-2 py-1 bg-qi-jade/10 text-qi-jade border border-qi-jade/20 rounded-md text-[9px]" 
                                    onclick="window.game.feedBeast('${beast.uniqueId}', '${fid}')">
                                    ${name} (${qty})
                                </button>
                            `;
                        }
                    });

                    // Cannibalism options for insects
                    let cannibalHtml = '';
                    if (state.views.beast === 'insect') {
                        const targets = state.player.beasts.filter(b => b.uniqueId !== beast.uniqueId && [BEAST_TYPES.LINH_TRUNG, BEAST_TYPES.KY_TRUNG].includes(BEASTS[b.id]?.type));
                        if (targets.length > 0) {
                            let selectHtml = `<select class="bg-black/30 border border-white/10 rounded px-1 text-[9px] text-white flex-grow mr-2" id="cannibal-select-${beast.uniqueId}">`;
                            targets.forEach(t => {
                                selectHtml += `<option value="${t.uniqueId}">${t.name} (Lvl ${t.level})</option>`;
                            });
                            selectHtml += `</select>`;
                            cannibalHtml = `
                                <div class="mt-2 flex items-center bg-purple-950/20 p-2 border border-purple-500/10 rounded-xl">
                                    <span class="text-[9px] text-purple-400 font-bold mr-2 flex-shrink-0">🐾 CẮN NUỐT:</span>
                                    ${selectHtml}
                                    <button class="px-2 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md text-[9px]"
                                        onclick="const val = document.getElementById('cannibal-select-${beast.uniqueId}').value; if(val) window.game.feedBeastWithBeast('${beast.uniqueId}', val)">
                                        NUỐT
                                    </button>
                                </div>
                            `;
                        }
                    }

                    // Evolution path check
                    let evolutionHtml = '';
                    if (data && data.evolutions) {
                        const evo = data.evolutions.find(e => beast.level >= e.levelRequired);
                        if (evo) {
                            const isLoiKiep = evo.levelRequired >= 50;
                            let matChecked = true;
                            let matTextList = [];
                            if (evo.materials) {
                                evo.materials.forEach(m => {
                                    const hasQty = state.player.inventory.getItemQuantity(m.id);
                                    const mName = getItemById(m.id)?.name || m.id;
                                    const meets = hasQty >= m.quantity;
                                    if (!meets) matChecked = false;
                                    matTextList.push(`<span class="${meets ? 'text-green-400' : 'text-red-400'}">${mName} (${hasQty}/${m.quantity})</span>`);
                                });
                            }

                            evolutionHtml = `
                                <div class="mt-3 p-3 bg-qi-jade/5 border border-qi-jade/10 rounded-2xl flex flex-col space-y-2">
                                    <div class="flex justify-between items-center">
                                        <span class="text-[10px] font-bold text-qi-jade">${isLoiKiep ? '⚡ THIÊN KIẾP ĐỘT PHÁ' : '✨ TIẾN HÓA BẢN THỂ'}</span>
                                        <button class="px-3 py-1 bg-qi-jade text-black font-bold text-[9px] rounded-lg ${!matChecked ? 'opacity-50 cursor-not-allowed' : ''}" 
                                            ${matChecked ? `onclick="window.game.clickEvolveBeast('${beast.uniqueId}')"` : ''}>
                                            ${isLoiKiep ? 'ĐỘ KIẾP' : 'TIẾN HÓA'}
                                        </button>
                                    </div>
                                    <p class="text-[9px] text-gray-400">Yêu cầu: Cấp ${evo.levelRequired} & ${matTextList.join(', ')}</p>
                                </div>
                            `;
                        }
                    }

                    const el = document.createElement('div');
                    el.className = `p-4 border ${isActive ? 'border-qi-jade/30 bg-qi-jade/[0.02]' : 'border-white/5 bg-white/[0.02]'} rounded-2xl flex flex-col space-y-3`;
                    el.innerHTML = `
                        <div class="flex items-start space-x-4">
                            <div class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0 relative">
                                ${beastImg ? `<img src="${beastImg}" class="w-full h-full object-cover">` : `<span class="text-3xl">${data?.icon || '🐾'}</span>`}
                                ${isActive ? `<span class="absolute top-0 right-0 bg-qi-jade text-black text-[7px] font-extrabold px-1 rounded-bl">XUẤT CHIẾN</span>` : ''}
                            </div>
                            <div class="flex-grow">
                                <div class="flex justify-between items-center">
                                    <h4 class="font-bold text-white text-sm flex items-center space-x-2">
                                        <span>${beast.name}</span>
                                        ${isInjured ? `<span class="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-normal animate-pulse">Trọng Thương</span>` : ''}
                                    </h4>
                                    <span class="text-[9px] font-bold" style="color: ${blood.color}">${blood.name}</span>
                                </div>
                                <div class="text-[9px] text-gray-500 mt-0.5">Cấp ${beast.level} (${lvlInfo.name}) | Khế ước: ${beast.contractType === 'blood' ? '🩸 Huyết Khế' : '🔮 Hồn Khế'}</div>
                                <div class="w-full h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                                    <div class="h-full bg-qi-jade" style="width: ${(beast.exp / lvlInfo.expRequired) * 100}%"></div>
                                </div>
                                <div class="flex justify-between text-[8px] text-gray-400 mt-1">
                                    <span>Trung thành: ${beast.loyalty}/100</span>
                                    <span>EXP: ${beast.exp}/${lvlInfo.expRequired}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Beast Stats Grid -->
                        <div class="grid grid-cols-4 gap-2 bg-white/[0.01] border border-white/5 rounded-xl p-2 text-center text-[9px]">
                            <div>
                                <span class="text-gray-500 block">Khí Huyết</span>
                                <span class="text-red-400 font-bold">${beast.stats.hp}</span>
                            </div>
                            <div>
                                <span class="text-gray-500 block">Công Kích</span>
                                <span class="text-yellow-400 font-bold">${beast.stats.atk}</span>
                            </div>
                            <div>
                                <span class="text-gray-500 block">Phòng Ngự</span>
                                <span class="text-blue-400 font-bold">${beast.stats.def}</span>
                            </div>
                            <div>
                                <span class="text-gray-500 block">Tốc Độ</span>
                                <span class="text-green-400 font-bold">${beast.stats.spd}</span>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex space-x-2 pt-1">
                            <button class="flex-grow py-2 text-[10px] font-bold rounded-xl border ${isActive ? 'bg-qi-jade/10 text-qi-jade border-qi-jade/30' : 'bg-white/5 text-white border-white/10'}"
                                onclick="window.game.equipBeast('${beast.uniqueId}')">
                                ${isActive ? 'THU HỒI' : 'XUẤT CHIẾN'}
                            </button>
                        </div>

                        <!-- Feeding Section -->
                        <div class="mt-2 border-t border-white/5 pt-2">
                            ${isInjured ? `
                                <div class="bg-red-950/20 border border-red-500/15 rounded-xl p-2 flex flex-col space-y-2">
                                    <p class="text-[9px] text-red-400">Lôi kiếp tổn thương nghiêm trọng, chọn đan dược chữa trị:</p>
                                    <div class="flex space-x-2">
                                        <button class="flex-grow py-1 bg-red-900/30 text-red-300 border border-red-900/50 rounded-lg text-[9px] font-bold"
                                            onclick="window.game.feedBeast('${beast.uniqueId}', 'linh_thu_dan')">
                                            Linh Thú Đan x5 (${state.player.inventory.getItemQuantity('linh_thu_dan')}/5)
                                        </button>
                                        <button class="flex-grow py-1 bg-emerald-900/30 text-emerald-300 border border-emerald-900/50 rounded-lg text-[9px] font-bold"
                                            onclick="window.game.feedBeast('${beast.uniqueId}', 'han_ngoc_tuy')">
                                            Hàn Ngọc Tủy x1 (${state.player.inventory.getItemQuantity('han_ngoc_tuy')}/1)
                                        </button>
                                    </div>
                                </div>
                            ` : `
                                <span class="text-[9px] text-gray-500 block mb-1">Cho ăn nuôi dưỡng:</span>
                                <div class="flex flex-wrap gap-1">
                                    ${foodOptionsHtml || '<span class="text-[9px] text-gray-600 italic">Không có thức ăn thích hợp trong túi đồ...</span>'}
                                </div>
                            `}
                        </div>

                        ${cannibalHtml}
                        ${evolutionHtml}
                    `;
                    viewList.appendChild(el);
                });
            }
        }

        // Hatch View
        if (viewHatch && state.views.beast === 'hatch') {
            viewHatch.innerHTML = '';

            // Render Slots
            const slotsContainer = document.createElement('div');
            slotsContainer.className = 'space-y-3 bg-white/[0.01] border border-white/5 p-4 rounded-2xl mb-4';
            slotsContainer.innerHTML = `<h3 class="text-xs font-bold text-qi-jade mb-3 flex items-center"><i class="ph ph-cube mr-1"></i> LÒ ẤP LINH THÚ</h3>`;

            state.player.hatchingBeasts.forEach((slot, idx) => {
                const slotEl = document.createElement('div');
                slotEl.className = 'p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between';
                if (!slot) {
                    // Empty slot
                    slotEl.innerHTML = `
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-gray-600">
                                <span class="text-xl">🥚</span>
                            </div>
                            <div>
                                <h4 class="text-[11px] font-bold text-gray-500">Lò ấp trống</h4>
                                <p class="text-[9px] text-gray-600">Sẵn sàng đặt trứng</p>
                            </div>
                        </div>
                        <div class="text-[9px] text-gray-500 italic">Đặt trứng từ kho bên dưới</div>
                    `;
                } else if (slot.status === 'hatching') {
                    // Hatching progress
                    const pct = Math.min(100, Math.floor(((slot.totalTime - slot.timeLeft) / slot.totalTime) * 100));
                    const mins = Math.floor(slot.timeLeft / 60);
                    const secs = Math.floor(slot.timeLeft % 60);
                    slotEl.innerHTML = `
                        <div class="flex-grow mr-4">
                            <div class="flex justify-between items-center">
                                <h4 class="text-[11px] font-bold text-white">${slot.name}</h4>
                                <span class="text-[9px] text-yellow-400 font-bold">${mins}m ${secs}s</span>
                            </div>
                            <div class="w-full h-1.5 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                                <div class="h-full bg-qi-jade" style="width: ${pct}%"></div>
                            </div>
                            <div class="flex justify-between text-[8px] text-gray-500 mt-1">
                                <span>Tiến độ: ${pct}%</span>
                                <span>Gia tốc:</span>
                            </div>
                        </div>
                        <div class="flex flex-col space-y-1">
                            <button class="px-2 py-1 bg-qi-jade/10 text-qi-jade border border-qi-jade/20 rounded text-[8px]" 
                                onclick="window.game.speedUpHatching(${idx}, 'spirit_stone')">
                                Linh thạch (-10m)
                            </button>
                            <button class="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[8px]" 
                                onclick="window.game.speedUpHatching(${idx}, 'spirit_dich')">
                                Hàn Ngọc Tủy
                            </button>
                        </div>
                    `;
                } else if (slot.status === 'completed') {
                    // Claim contract selection
                    slotEl.innerHTML = `
                        <div class="flex-grow mr-4">
                            <h4 class="text-[11px] font-bold text-qi-jade flex items-center">
                                <span class="animate-bounce mr-1">🐣</span> ${slot.name} đã ấp nở!
                            </h4>
                            <p class="text-[8px] text-gray-500 mt-0.5">Chọn loại khế ước để nhận thú nuôi:</p>
                        </div>
                        <div class="flex space-x-1">
                            <button class="px-2 py-1 bg-red-950/40 text-red-400 border border-red-500/20 rounded text-[8px] font-bold" 
                                onclick="window.game.claimHatchedBeast(${idx}, 'blood')">
                                Huyết Khế (-15% HP)
                            </button>
                            <button class="px-2 py-1 bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 rounded text-[8px] font-bold" 
                                onclick="window.game.claimHatchedBeast(${idx}, 'soul')">
                                Hồn Khế (Thần Thức >= 10)
                            </button>
                        </div>
                    `;
                }
                slotsContainer.appendChild(slotEl);
            });
            viewHatch.appendChild(slotsContainer);

            // Render Eggs List in Inventory
            const eggsContainer = document.createElement('div');
            eggsContainer.innerHTML = `<h3 class="text-xs font-bold text-white mb-2"><i class="ph ph-bag-simple mr-1"></i> TRỨNG LINH THÚ TRONG TÚI</h3>`;
            const eggs = state.player.inventory.allItems.filter(i => getItemById(i.id).type === 'trung_linh_thu');
            
            if (eggs.length === 0) {
                eggsContainer.innerHTML += '<div class="text-center py-6 text-gray-600 italic">Ngươi không có trứng linh thú nào trong túi...</div>';
            } else {
                eggs.forEach(egg => {
                    const item = getItemById(egg.id);
                    const el = document.createElement('div');
                    el.className = 'p-3 border border-white/5 rounded-xl bg-white/[0.01] flex justify-between items-center mb-2';
                    
                    // Slot placement options if there is an empty slot
                    const emptyIdx = state.player.hatchingBeasts.findIndex(s => s === null);
                    let actionButton = '';
                    if (emptyIdx !== -1) {
                        actionButton = `<button class="px-3 py-1.5 bg-qi-jade text-black text-[9px] font-bold rounded-lg" onclick="window.game.startHatching('${egg.id}', ${emptyIdx})">ẤP NỞ (LÒ ${emptyIdx + 1})</button>`;
                    } else {
                        actionButton = `<span class="text-[8px] text-gray-600 italic">Lò ấp đầy</span>`;
                    }

                    el.innerHTML = `
                        <div class="flex items-center space-x-3">
                            <div class="text-2xl">${item.icon || '🥚'}</div>
                            <div>
                                <h4 class="text-[11px] font-bold text-white">${item.name}</h4>
                                <p class="text-[8px] text-gray-500">Số lượng: ${egg.quantity} | Ấp: ${Math.floor((item.hatchTime || 300) / 60)} phút</p>
                            </div>
                        </div>
                        ${actionButton}
                    `;
                    eggsContainer.appendChild(el);
                });
            }
            viewHatch.appendChild(eggsContainer);
        }

        // Events
        if (tabBeast) tabBeast.onclick = () => { state.views.beast = 'beast'; this.renderBeast(); };
        if (tabInsect) tabInsect.onclick = () => { state.views.beast = 'insect'; this.renderBeast(); };
        if (tabHatch) tabHatch.onclick = () => { state.views.beast = 'hatch'; this.renderBeast(); };
    }

    renderCraftingHub() {
        if (!state.player) return;

        const professions = [
            { id: 'alchemy', key: 'alchemy', name: 'Luyện Dược Sư', level: state.player.alchemyLevel, exp: state.player.alchemyExp, getLevelInfo: (lvl) => ({ name: `Cấp ${lvl}` }) },
            { id: 'talisman', key: 'talisman', name: 'Phù Sư', level: state.player.talismanLevel, exp: state.player.talismanExp, getLevelInfo: getTalismanLevelInfo },
            { id: 'smithing', key: 'smithing', name: 'Luyện Khí Sư', level: state.player.smithingLevel, exp: state.player.smithingExp, getLevelInfo: getSmithingLevelInfo },
            { id: 'formation', key: 'formation', name: 'Trận Pháp Sư', level: state.player.formationLevel, exp: state.player.formationExp, getLevelInfo: (lvl) => ({ name: `Cấp ${lvl}` }) },
            { id: 'puppet', key: 'puppet', name: 'Khôi Lỗi Sư', level: state.player.puppetLevel, exp: state.player.puppetExp, getLevelInfo: (lvl) => ({ name: `Cấp ${lvl}` }) },
            { id: 'corpse', key: 'corpse', name: 'Luyện Thi Sư', level: state.player.corpseLevel, exp: state.player.corpseExp, getLevelInfo: (lvl) => ({ name: `Cấp ${lvl}` }) },
            { id: 'beast', key: 'beast', name: 'Ngự Thú Sư', level: state.player.beastLevel, exp: state.player.beastExp, getLevelInfo: getBeastLevelInfo },
            { id: 'insect', key: 'insect', name: 'Khu Trùng Sư', level: state.player.insectLevel, exp: state.player.insectExp, getLevelInfo: (lvl) => ({ name: `Cấp ${lvl}` }) },
            { id: 'linh-thuc', key: 'linh_thuc', name: 'Linh Thực Sư', level: state.player.linhThucLevel, exp: state.player.linhThucExp, getLevelInfo: (lvl) => ({ name: `Cấp ${lvl}` }) },
            { id: 'linh-tuu', key: 'linh_tuu', name: 'Linh Tửu Sư', level: state.player.spiritWineLevel, exp: state.player.spiritWineExp, getLevelInfo: (lvl) => ({ name: `Cấp ${lvl}` }) },
            { id: 'cam-che', key: 'cam_che', name: 'Cấm Chế Sư', level: state.player.camCheLevel, exp: state.player.camCheExp, getLevelInfo: (lvl) => ({ name: `Cấp ${lvl}` }) }
        ];

        professions.forEach(prof => {
            const levelEl = document.getElementById(`hub-${prof.id}-level`);
            const cardEl = levelEl?.closest('.hub-card');

            if (!levelEl || !cardEl) return;

            const isUnlocked = state.player.unlockedProfessions.includes(prof.key);

            // Re-bind onclick to handle both locked state and opening
            cardEl.onclick = () => window.game.openCrafting(prof.key);

            const biPhapMap = {
                'alchemy': 'Đan Đạo Chân Giải',
                'talisman': 'Thái Thượng Phù Kinh',
                'smithing': 'Luyện Khí Tổng Cương',
                'formation': 'Trận Đạo Thiên Thư',
                'puppet': 'Cơ Quan Linh Kỹ',
                'corpse': 'Cửu U Luyện Thi Thuật',
                'beast': 'Vạn Thú Ngự Pháp',
                'insect': 'Thiên Trùng Bí Lục',
                'linh_thuc': 'Linh Thực Kinh',
                'linh_tuu': 'Cổ Phương Linh Tửu',
                'cam_che': 'Thiên Địa Cấm Pháp'
            };

            if (isUnlocked) {
                let lvlInfo;
                if (prof.id === 'alchemy') {
                    lvlInfo = getAlchemyLevelInfo(prof.level);
                } else {
                    lvlInfo = prof.getLevelInfo ? prof.getLevelInfo(prof.level) : { name: `Cấp ${prof.level}` };
                }
                const nextLevelExp = prof.level * 100 * Math.pow(1.5, prof.level - 1);
                const progress = Math.floor((prof.exp / nextLevelExp) * 100);

                levelEl.innerHTML = `${prof.name} - ${lvlInfo.name} <span class="text-white/30 ml-2">(${progress}%)</span>`;
                cardEl.classList.remove('opacity-40', 'grayscale');
                cardEl.classList.add('cursor-pointer');
            } else {
                levelEl.innerHTML = `
                    <div class="flex flex-col">
                        <span class="text-red-500/60 flex items-center"><i class="ph ph-lock-key mr-1"></i> Chưa mở khóa</span>
                        <span class="text-[7px] text-gray-600 italic mt-0.5">Cần: « ${biPhapMap[prof.id]} »</span>
                    </div>
                `;
                cardEl.classList.add('opacity-40', 'grayscale');
                cardEl.classList.remove('cursor-pointer');
            }
        });
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
                const statusText = af.setupTimeRemaining > 0 
                    ? `<span class="text-amber-500 animate-pulse">Đang bố trí (${Math.ceil(af.setupTimeRemaining)} phút)...</span>` 
                    : '<span class="text-qi-purple font-bold">Đang kích hoạt...</span>';
                el.innerHTML = `
                    <div>
                        <h4 class="font-bold text-qi-purple">${af.name}</h4>
                        <p class="text-[9px] mt-1">${statusText}</p>
                    </div>
                    <button class="px-4 py-2 bg-red-500/10 text-red-500 text-[10px] rounded-xl border border-red-500/20" onclick="window.game.deactivateFormation('${af.id}')">THU HỒI</button>
                `;
                view.appendChild(el);
            });
        }

        // Learned Diagrams
        const knownFormations = state.player.knownFormations || [];
        const diagramHeader = document.createElement('h3');
        diagramHeader.className = 'text-[10px] text-gray-500 uppercase tracking-widest mt-6 mb-2';
        diagramHeader.textContent = 'Trận Đồ Đã Lĩnh Ngộ';
        view.appendChild(diagramHeader);

        if (knownFormations.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'text-center py-6 text-gray-700 italic text-xs';
            empty.textContent = 'Trống rỗng...';
            view.appendChild(empty);
        } else {
            knownFormations.forEach(fid => {
                const item = getItemById(fid);
                if (!item) return;
                const isActive = state.player.activeFormations.some(af => af.id === fid);
                const el = document.createElement('div');
                el.className = 'p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3 flex justify-between items-center';
                el.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">${item.icon || '📜'}</div>
                        <div>
                            <h4 class="text-sm font-bold text-white">${item.name}</h4>
                            <p class="text-[9px] text-gray-500">${item.description || ''}</p>
                        </div>
                    </div>
                    ${isActive ?
                        '<span class="text-[9px] text-qi-purple font-bold">ĐÃ KÍCH HOẠT</span>' :
                        `<button class="px-4 py-2 bg-qi-purple/10 text-qi-purple text-[10px] rounded-xl border border-qi-purple/20" onclick="window.game.activateFormation('${fid}')">KÍCH HOẠT</button>`
                    }
                `;
                view.appendChild(el);
            });
        }
    }


    renderCorpse() {
        if (!state.player) return;

        // Elements
        const elLvl = document.getElementById('corpse-level-text');
        const elBar = document.getElementById('corpse-exp-bar');
        const elMax = document.getElementById('corpse-max-text');

        if (elLvl) elLvl.textContent = `Luyện Thi Sư - Cấp ${state.player.corpseLevel}`;
        if (elBar) {
            const nextLevelExp = Math.max(1, state.player.corpseLevel * 100 * Math.pow(1.5, state.player.corpseLevel - 1));
            elBar.style.width = `${Math.min(100, (state.player.corpseExp / nextLevelExp) * 100)}%`;
        }
        if (elMax) {
            const maxCorpses = Math.floor(state.player.corpseLevel / 2) + 1;
            const deployedCount = state.player.refinedCorpses.filter(c => c.deployed).length;
            elMax.textContent = `Xuất chiến: ${deployedCount}/${maxCorpses}`;
        }

        if (!state.views.corpse) state.views.corpse = 'owned';

        // Tab visiblity
        const ownedView = document.getElementById('corpse-owned-view');
        const craftView = document.getElementById('corpse-craft-view');
        const tabOwned = document.getElementById('corpse-tab-owned');
        const tabCraft = document.getElementById('corpse-tab-craft');

        const activeClass = ['bg-red-900/20', 'text-red-400', 'border-red-900/30'];
        const inactiveClass = ['bg-transparent', 'text-gray-500', 'border-transparent'];

        [tabOwned, tabCraft].forEach(tab => {
            if (!tab) return;
            tab.classList.remove(...activeClass, ...inactiveClass);
            const isActive = (tab === tabOwned && state.views.corpse === 'owned') ||
                (tab === tabCraft && state.views.corpse === 'craft');
            tab.classList.add(...(isActive ? activeClass : inactiveClass));
        });

        if (ownedView) ownedView.classList.toggle('hidden', state.views.corpse !== 'owned');
        if (craftView) craftView.classList.toggle('hidden', state.views.corpse !== 'craft');

        // ========================
        // OWNED VIEW
        // ========================
        if (ownedView && state.views.corpse === 'owned') {
            ownedView.innerHTML = '';

            if (state.player.refinedCorpses.length === 0) {
                ownedView.innerHTML = `
                    <div class="text-center py-16 text-gray-600">
                        <div class="text-5xl mb-4">🧟</div>
                        <p class="italic text-xs">Ngươi chưa có thi khôi nào.<br>Hãy chuyển sang tab Luyện Chế để bắt đầu.</p>
                    </div>`;
            } else {
                state.player.refinedCorpses.forEach((corpse) => {
                    const isDeployed = corpse.deployed;
                    const mode = corpse.mode || 'COMBAT';
                    const corpseImg = ASSETS.corpses?.[corpse.id];
                    const lvlPct = Math.min(100, Math.floor((corpse.exp / (corpse.nextLevelExp || 100)) * 100));

                    const modeNames = { COMBAT: '⚔️ Chiến Đấu', GATHER: '🌿 Thu Thập', GUARD: '🛡️ Hộ Vệ', PATROL: '👁️ Tuần Tra' };

                    // Find available foods
                    const foodMap = [
                        { itemId: 'yeu_thu_tinh_huyet', name: '🩸 Tinh Huyết', stat: 'atk' },
                        { itemId: 'ma_thach_ha_pham', name: '🪨 Ma Thạch', stat: 'all' },
                        { itemId: 'am_khi_tinh_tu', name: '💨 Âm Khí', stat: 'hp' },
                        { itemId: 'thi_chau', name: '💠 Thi Châu', stat: 'def' }
                    ];
                    let feedOptionsHtml = '';
                    foodMap.forEach(f => {
                        const qty = state.player.inventory.getItemQuantity(f.itemId);
                        if (qty > 0) {
                            feedOptionsHtml += `
                                <button class="px-2 py-1 bg-red-900/20 text-red-400 border border-red-900/30 rounded-md text-[9px]"
                                    onclick="window.game.feedCorpse('${corpse.uniqueId}', '${f.itemId}')">
                                    ${f.name} (${qty})
                                </button>`;
                        }
                    });

                    // Check evolution
                    let evolutionHtml = '';
                    const CORPSE_EVOLUTIONS_CHECK = {
                        'thi_binh': { toId: 'thi_tuong', levelRequired: 5 },
                        'thi_tuong': { toId: 'dong_giap_thi', levelRequired: 8 },
                        'dong_giap_thi': { toId: 'ngan_giap_thi', levelRequired: 12 },
                        'ngan_giap_thi': { toId: 'kim_giap_thi', levelRequired: 18 }
                    };
                    const evoData = CORPSE_EVOLUTIONS_CHECK[corpse.id];
                    if (evoData) {
                        const canEvo = corpse.level >= evoData.levelRequired;
                        evolutionHtml = `
                            <div class="mt-2 p-2 bg-red-950/20 border border-red-900/15 rounded-xl flex justify-between items-center">
                                <span class="text-[9px] text-red-400">✨ Tiến hóa → ${CORPSE_TYPES[evoData.toId]?.name || evoData.toId}</span>
                                <button class="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-md text-[9px] font-bold ${!canEvo ? 'opacity-40 cursor-not-allowed' : ''}"
                                    ${canEvo ? `onclick="window.game.evolveCorpse('${corpse.uniqueId}')"` : ''}>
                                    ${canEvo ? 'TIẾN HÓA' : `Cần Cấp ${evoData.levelRequired}`}
                                </button>
                            </div>`;
                    }

                    // Mode selector if deployed
                    let modeSelectorHtml = '';
                    if (isDeployed) {
                        const allModes = ['COMBAT', 'GATHER', 'GUARD', 'PATROL'];
                        modeSelectorHtml = `
                            <div class="mt-2 border-t border-white/5 pt-2">
                                <p class="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Chế độ hoạt động:</p>
                                <div class="grid grid-cols-4 gap-1">
                                    ${allModes.map(m => `
                                        <button class="py-1 text-[8px] font-bold rounded-lg border transition-all ${mode === m ? 'bg-red-900/30 text-red-400 border-red-900/30' : 'bg-transparent text-gray-500 border-white/5 hover:border-white/15'}"
                                            onclick="window.game.setCorpseMode('${corpse.uniqueId}', '${m}')">
                                            ${modeNames[m]}
                                        </button>`).join('')}
                                </div>
                            </div>`;
                    }

                    const el = document.createElement('div');
                    el.className = `p-4 border ${isDeployed ? 'border-red-900/40 bg-red-950/[0.08]' : 'border-white/5 bg-white/[0.02]'} rounded-2xl mb-3 space-y-3`;
                    el.innerHTML = `
                        <div class="flex items-start space-x-4">
                            <div class="w-14 h-14 bg-red-950/20 rounded-2xl flex items-center justify-center overflow-hidden border border-red-900/20 flex-shrink-0 relative">
                                ${corpseImg ? `<img src="${corpseImg}" class="w-full h-full object-cover">` : `<span class="text-3xl">${corpse.icon || '🧟'}</span>`}
                                ${isDeployed ? `<span class="absolute top-0 right-0 bg-red-700 text-white text-[7px] font-extrabold px-1 rounded-bl">XUẤT CHIẾN</span>` : ''}
                            </div>
                            <div class="flex-grow">
                                <div class="flex justify-between items-center">
                                    <h4 class="font-bold text-red-400 text-sm">${corpse.name}</h4>
                                    <span class="text-[8px] bg-red-900/20 text-red-500 px-2 py-0.5 rounded border border-red-900/20 font-bold uppercase">${corpse.quality}</span>
                                </div>
                                <div class="text-[9px] text-gray-500 mt-0.5">Cấp ${corpse.level} | ${isDeployed ? `[${modeNames[mode]}]` : 'Nghỉ ngơi'}</div>
                                <div class="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-red-900 to-red-600" style="width: ${lvlPct}%"></div>
                                </div>
                                <div class="flex justify-between text-[8px] text-gray-500 mt-0.5">
                                    <span>EXP: ${corpse.exp}/${corpse.nextLevelExp || 100}</span>
                                    <span>${lvlPct}%</span>
                                </div>
                            </div>
                        </div>

                        <!-- Stats -->
                        <div class="grid grid-cols-3 gap-2 bg-white/[0.01] border border-white/5 rounded-xl p-2 text-center text-[9px]">
                            <div><span class="text-gray-500 block">Khí Huyết</span><span class="text-red-400 font-bold">${(corpse.stats.hp || 0).toLocaleString()}</span></div>
                            <div><span class="text-gray-500 block">Công Kích</span><span class="text-yellow-400 font-bold">${(corpse.stats.atk || 0).toLocaleString()}</span></div>
                            <div><span class="text-gray-500 block">Phòng Ngự</span><span class="text-blue-400 font-bold">${(corpse.stats.def || 0).toLocaleString()}</span></div>
                        </div>

                        <!-- Action buttons -->
                        <div class="flex space-x-2">
                            <button class="flex-grow py-1.5 text-[9px] font-bold rounded-xl border transition-all active:scale-95 ${isDeployed ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' : 'bg-red-900/20 text-red-300 border-red-900/30 hover:bg-red-900/30'}"
                                onclick="window.game.deployCorpse('${corpse.uniqueId}')">
                                ${isDeployed ? 'THU HỒI' : 'XUẤT CHIẾN'}
                            </button>
                            <button class="px-3 py-1.5 bg-white/5 text-gray-400 border border-white/10 rounded-xl text-[9px] hover:bg-red-900/20 hover:text-red-400 transition-all active:scale-95"
                                onclick="if(confirm('Tán diệt ${corpse.name}? Sẽ thu hồi 30% nguyên liệu.')) window.game.dismantleCorpse('${corpse.uniqueId}')">
                                TÁN DIỆT
                            </button>
                        </div>

                        <!-- Feed section -->
                        ${feedOptionsHtml ? `
                        <div class="border-t border-white/5 pt-2">
                            <p class="text-[9px] text-gray-500 mb-1">Tế luyện nuôi dưỡng:</p>
                            <div class="flex flex-wrap gap-1">${feedOptionsHtml}</div>
                        </div>` : ''}

                        ${evolutionHtml}
                        ${modeSelectorHtml}
                    `;
                    ownedView.appendChild(el);
                });
            }
        }

        // ========================
        // CRAFT VIEW
        // ========================
        if (craftView && state.views.corpse === 'craft') {
            craftView.innerHTML = '';

            const known = Object.values(CORPSE_TYPES).filter(t => state.player.knownCorpseRecipes.includes(t.id));

            if (known.length === 0) {
                craftView.innerHTML = `
                    <div class="text-center py-16 text-gray-600">
                        <div class="text-4xl mb-3">📜</div>
                        <p class="italic text-xs">Ngươi chưa có bí phương luyện thi nào.<br>Hãy tìm kiếm sách pháp hoặc học từ sư phụ.</p>
                    </div>`;
            } else {
                known.forEach(type => {
                    const corpseImg = ASSETS.corpses?.[type.id];
                    const el = document.createElement('div');
                    el.className = 'p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3 space-y-3';

                    let materialsHTML = '';
                    type.materials.forEach(mat => {
                        const matItem = getItemById(mat.id);
                        const count = state.player.inventory.allItems.find(i => i.id === mat.id)?.quantity || 0;
                        const enough = count >= mat.quantity;
                        materialsHTML += `
                            <div class="flex justify-between items-center bg-black/20 p-1.5 rounded-lg border ${enough ? 'border-white/5' : 'border-red-500/20'}">
                                <span class="text-[10px] text-gray-400">${matItem?.name || mat.id}</span>
                                <span class="text-[10px] font-mono ${enough ? 'text-green-400' : 'text-red-500'}">${count}/${mat.quantity}</span>
                            </div>`;
                    });

                    const locked = state.player.corpseLevel < type.level;
                    const successRate = Math.floor(Math.max(10, Math.min(95, (0.7 - (type.level * 0.08) + (state.player.corpseLevel * 0.05)) * 100)));
                    const maxCorpses = Math.floor(state.player.corpseLevel / 2) + 1;
                    const atMax = state.player.refinedCorpses.length >= maxCorpses;

                    el.innerHTML = `
                        <div class="flex justify-between items-start">
                            <div class="flex items-center space-x-3">
                                <div class="w-12 h-12 bg-red-950/20 rounded-2xl flex items-center justify-center overflow-hidden border border-red-900/20 flex-shrink-0">
                                    ${corpseImg ? `<img src="${corpseImg}" class="w-full h-full object-cover">` : `<span class="text-3xl">${type.icon || '🧟'}</span>`}
                                </div>
                                <div>
                                    <h4 class="font-ancient text-lg text-red-500">${type.name}</h4>
                                    <p class="text-[9px] text-gray-500 mt-0.5">${type.description}</p>
                                </div>
                            </div>
                            ${locked ? `<span class="text-[8px] text-red-500 uppercase font-bold">Cần Cấp ${type.level}</span>` :
                            atMax ? `<span class="text-[8px] text-gray-500 uppercase font-bold">Đã đủ số lượng</span>` :
                            `<button class="px-4 py-2 bg-red-900/20 text-red-400 text-[10px] font-bold rounded-xl border border-red-900/30 active:scale-95" onclick="window.game.refineCorpse('${type.id}')">LUYỆN CHẾ</button>`}
                        </div>
                        <!-- Base Stats Preview -->
                        <div class="grid grid-cols-3 gap-2 bg-white/[0.01] border border-white/5 rounded-xl p-2 text-center text-[9px]">
                            <div><span class="text-gray-500 block">HP</span><span class="text-red-400 font-bold">${(type.stats.hp).toLocaleString()}</span></div>
                            <div><span class="text-gray-500 block">ATK</span><span class="text-yellow-400 font-bold">${(type.stats.atk).toLocaleString()}</span></div>
                            <div><span class="text-gray-500 block">DEF</span><span class="text-blue-400 font-bold">${(type.stats.def).toLocaleString()}</span></div>
                        </div>
                        <div class="grid grid-cols-2 gap-2">${materialsHTML}</div>
                        <div class="flex justify-between items-center text-[8px] text-gray-500 italic">
                            <span>Tỷ lệ thành công: <span class="text-green-400 font-bold">${successRate}%</span></span>
                            <span>Thu thập: <span class="text-yellow-400">${type.gatherBonus?.type || 'all'} x${type.gatherBonus?.multiplier?.toFixed(1) || '1.0'}</span></span>
                        </div>
                    `;
                    craftView.appendChild(el);
                });
            }
        }
    }

    setCorpseTab(tab) {
        state.views.corpse = tab;
        this.renderCorpse();
    }
}

