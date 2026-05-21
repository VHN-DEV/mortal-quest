import { state } from '../../state.js';
import { getItemById } from '../../configs/item-data.js';
import { SMITHING_RECIPES, getSmithingLevelInfo } from '../../configs/smithing-data.js';
import { PUPPET_RECIPES, PUPPET_GRADES } from '../../configs/puppet-data.js';
import { TALISMAN_RECIPES, getTalismanLevelInfo } from '../../configs/talisman-data.js';
import { BEASTS, BEAST_TYPES, BLOODLINES, getBeastLevelInfo } from '../../configs/beast-data.js';
import { ASSETS, getAssetUrl } from '../../configs/asset-data.js';
import { CORPSE_TYPES, getCorpseLevelInfo } from '../../configs/corpse-data.js';
import { getFlameById, getAlchemyLevelInfo } from '../../configs/alchemy-data.js';

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
                        <span class="text-xl mr-2">${item.image ? `<img src="${getAssetUrl(item.image)}" class="w-6 h-6 object-contain inline-block">` : (item.icon || '')}</span>
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
            corpse: 'screen-corpse'
        };

        const screenId = screens[type];
        if (screenId) {
            state.ui.switchScreen(screenId);
            if (type === 'alchemy' && this.parentScreen.alchemyController) this.parentScreen.alchemyController.renderAlchemy();
            if (type === 'smithing') this.renderSmithing();
            if (type === 'talisman') this.renderTalisman();
            if (type === 'formation') this.renderFormation();
            if (type === 'beast') this.renderBeast();
            if (type === 'puppet') this.renderPuppet();
            if (type === 'corpse') this.renderCorpse();
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
            const nextLevelExp = Math.max(1, state.player.puppetLevel * 100 * Math.pow(1.5, state.player.puppetLevel - 1));
            elBar.style.width = `${Math.min(100, (state.player.puppetExp / nextLevelExp) * 100)}%`;
        }

        if (view) {
            view.innerHTML = '';
            const known = PUPPET_RECIPES.filter(r => state.player.knownPuppetRecipes.includes(r.id));

            if (known.length === 0) {
                view.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa có bản thiết kế khôi lỗi nào...</div>';
                return;
            }

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

        // List View Rendering
        if (viewList && state.views.beast !== 'hatch') {
            viewList.innerHTML = '';

            // Filter beasts based on tab
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

                    const beastImg = ASSETS.beasts[beast.id];

                    const el = document.createElement('div');
                    el.className = 'p-4 border border-white/5 rounded-2xl bg-white/[0.02] flex items-center space-x-4';
                    el.innerHTML = `
                        <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0">
                            ${beastImg ? `<img src="${beastImg}" class="w-full h-full object-cover">` : `<span class="text-3xl">${data?.icon || '🐾'}</span>`}
                        </div>
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
        if (viewHatch && state.views.beast === 'hatch') {
            viewHatch.innerHTML = '';
            const eggs = state.player.inventory.allItems.filter(i => getItemById(i.id).type === 'beast_egg');
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
            { id: 'insect', key: 'insect', name: 'Khu Trùng Sư', level: state.player.insectLevel, exp: state.player.insectExp, getLevelInfo: (lvl) => ({ name: `Cấp ${lvl}` }) }
        ];

        professions.forEach(prof => {
            const levelEl = document.getElementById(`hub-${prof.id}-level`);
            const cardEl = levelEl?.closest('.hub-card');

            if (!levelEl || !cardEl) return;

            const isUnlocked = state.player.unlockedProfessions.includes(prof.id);

            // Re-bind onclick to handle both locked state and opening
            cardEl.onclick = () => window.game.openCrafting(prof.id);

            const biPhapMap = {
                'alchemy': 'Đan Đạo Chân Giải',
                'talisman': 'Thái Thượng Phù Kinh',
                'smithing': 'Luyện Khí Tổng Cương',
                'formation': 'Trận Đạo Thiên Thư',
                'puppet': 'Cơ Quan Linh Kỹ',
                'corpse': 'Cửu U Luyện Thi Thuật',
                'beast': 'Vạn Thú Ngự Pháp',
                'insect': 'Thiên Trùng Bí Lục'
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

        const view = document.getElementById('corpse-list');
        const elLvl = document.getElementById('corpse-level-text');
        const elBar = document.getElementById('corpse-exp-bar');

        if (elLvl) elLvl.textContent = getCorpseLevelInfo(state.player.corpseLevel).name;
        if (elBar) {
            const nextLevelExp = state.player.corpseLevel * 100 * Math.pow(1.5, state.player.corpseLevel - 1);
            elBar.style.width = `${(state.player.corpseExp / nextLevelExp) * 100}%`;
        }

        if (!view) return;
        view.innerHTML = '';

        // Refined Corpses list (Active)
        if (state.player.refinedCorpses.length > 0) {
            const activeHeader = document.createElement('h3');
            activeHeader.className = 'text-[10px] text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-1';
            activeHeader.textContent = 'Thi Hài Đang Khống Chế';
            view.appendChild(activeHeader);

            state.player.refinedCorpses.forEach((corpse, idx) => {
                const corpseImg = ASSETS.corpses[corpse.id];
                const el = document.createElement('div');
                el.className = 'p-4 border border-red-900/30 rounded-2xl bg-red-900/5 mb-4 flex items-center space-x-4';
                el.innerHTML = `
                    <div class="w-12 h-12 bg-red-950/20 rounded-2xl flex items-center justify-center overflow-hidden border border-red-900/20 flex-shrink-0">
                        ${corpseImg ? `<img src="${corpseImg}" class="w-full h-full object-cover">` : '<span class="text-3xl">🧟</span>'}
                    </div>
                    <div class="flex-grow">
                        <div class="flex justify-between items-center">
                            <h4 class="font-bold text-red-400">${corpse.name}</h4>
                            <span class="text-[9px] px-2 py-0.5 bg-red-500/10 text-red-500 rounded border border-red-500/20 font-bold uppercase">${corpse.quality}</span>
                        </div>
                        <div class="text-[9px] text-gray-500 mt-1">Cấp ${corpse.level} | ATK: ${corpse.stats.atk} | HP: ${corpse.stats.hp}</div>
                    </div>
                `;
                view.appendChild(el);
            });
        }

        const refiningHeader = document.createElement('h3');
        refiningHeader.className = 'text-[10px] text-gray-500 uppercase tracking-widest mt-6 mb-3 border-b border-white/5 pb-1';
        refiningHeader.textContent = 'Bản Vẽ Luyện Thi';
        view.appendChild(refiningHeader);

        const known = Object.values(CORPSE_TYPES).filter(t => state.player.knownCorpseRecipes.includes(t.id));

        if (known.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'text-center py-6 text-gray-700 italic text-xs';
            empty.textContent = 'Ngươi chưa có bí phương luyện thi nào...';
            view.appendChild(empty);
        } else {
            known.forEach(type => {
                const corpseImg = ASSETS.corpses[type.id];
                const el = document.createElement('div');
                el.className = 'p-4 border border-white/5 rounded-2xl bg-white/[0.02] mb-3 space-y-3';

                let materialsHTML = '';
                type.materials.forEach(mat => {
                    const matItem = getItemById(mat.id);
                    const count = state.player.inventory.allItems.find(i => i.id === mat.id)?.quantity || 0;
                    materialsHTML += `<div class="text-[9px] ${count >= mat.quantity ? 'text-gray-400' : 'text-red-500'}">${matItem?.name || mat.id} x${mat.quantity} (${count})</div>`;
                });

                const locked = state.player.corpseLevel < type.level;
                const successRate = Math.floor((0.7 - (type.level * 0.1) + (state.player.corpseLevel * 0.05)) * 100);

                el.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-red-950/20 rounded-2xl flex items-center justify-center overflow-hidden border border-red-900/20 flex-shrink-0 animate-pulse-subtle">
                            ${corpseImg ? `<img src="${corpseImg}" class="w-full h-full object-cover">` : '<span class="text-3xl">🧟</span>'}
                        </div>
                        <div>
                            <h4 class="font-ancient text-lg text-red-500">${type.name}</h4>
                            <p class="text-[9px] text-gray-500 mt-1">${type.description}</p>
                        </div>
                    </div>
                    ${locked ?
                        `<span class="text-[8px] text-red-500 uppercase font-bold">Cần Cấp ${type.level}</span>` :
                        `<button class="px-4 py-2 bg-red-900/20 text-red-400 text-[10px] font-bold rounded-xl border border-red-900/30" onclick="window.game.refineCorpse('${type.id}')">LUYỆN CHẾ</button>`
                    }
                </div>
                <div class="grid grid-cols-2 gap-2">${materialsHTML}</div>
                <div class="flex justify-between items-center text-[8px] text-gray-500 italic">
                    <span>Tỷ lệ thành công: ${successRate}%</span>
                    <span>Phản phệ: ${(100 - successRate)}%</span>
                </div>
            `;
                view.appendChild(el);
            });
        }
    }
}
