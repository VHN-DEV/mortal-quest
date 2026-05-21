import { state } from '../../state.js';
import { getItemById } from '../../configs/item-data.js';
import { ALCHEMY_RECIPES, getAlchemyLevelInfo, getFlameById, getCauldronById } from '../../configs/alchemy-data.js';
import { SEEDS, FIELD_GRADES, FIELD_ATTRIBUTES } from '../../configs/garden-data.js';
import { ASSETS, getAssetUrl } from '../../configs/asset-data.js';

export class AlchemyController {
    constructor(parentScreen) {
        this.parentScreen = parentScreen;
    }

    get viewAlchemyRecipes() { return this.parentScreen.viewAlchemyRecipes; }
    get viewAlchemyGarden() { return this.parentScreen.viewAlchemyGarden; }
    get btnAlchemyTabRecipes() { return this.parentScreen.btnAlchemyTabRecipes; }
    get btnAlchemyTabGarden() { return this.parentScreen.btnAlchemyTabGarden; }
    get elAlchemyLvlText() { return this.parentScreen.elAlchemyLvlText; }
    get elAlchemyExpBar() { return this.parentScreen.elAlchemyExpBar; }
    get elGardenPlots() { return this.parentScreen.elGardenPlots; }

    getQualityClass(quality) {
        return this.parentScreen.getQualityClass(quality);
    }

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
        const nextLevelExp = Math.max(1, state.player.alchemyLevel * 100 * Math.pow(1.5, state.player.alchemyLevel - 1));
        this.elAlchemyExpBar.style.width = `${Math.min(100, (state.player.alchemyExp / nextLevelExp) * 100)}%`;

        if (state.views.alchemy === 'recipes') {
            this.renderRecipes();
        } else {
            this.renderGarden();
        }

        const cauldronName = document.getElementById('alchemy-cauldron-name');
        const flameName = document.getElementById('alchemy-flame-name');

        if (cauldronName) {
            const cauldron = getCauldronById(state.player.currentCauldron);
            if (cauldron) {
                cauldronName.innerHTML = `<span class="text-white">${cauldron.name}</span>`;
            } else {
                cauldronName.innerHTML = `<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`;
            }
        }

        if (flameName) {
            const flame = getFlameById(state.player.currentFlame);
            if (flame) {
                flameName.innerHTML = `<span class="text-white">${flame.name}</span>`;
            } else {
                flameName.innerHTML = `<span class="text-gray-500 italic">Chưa có</span> <button onclick="window.game.openShop('buy', 'van_bao_cac', 'phap_bao')" class="ml-2 text-[8px] text-qi-blue underline hover:text-white transition-colors">MUA NGAY</button>`;
            }
        }
    }

    renderRecipes() {
        this.viewAlchemyRecipes.innerHTML = '';
        const known = ALCHEMY_RECIPES.filter(r => state.player.knownRecipes.includes(r.id));

        if (known.length === 0) {
            this.viewAlchemyRecipes.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa lĩnh ngộ được đan phương nào...</div>';
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
                const playerMat = state.player.inventory.allItems.find(i => i.id === mat.id);
                const count = playerMat ? playerMat.quantity : 0;
                const enough = count >= mat.quantity;
                materialsHTML += `<div class="text-[10px] ${enough ? 'text-gray-400' : 'text-red-500'}">${matItem.name}: ${count}/${mat.quantity}</div>`;
            });

            const locked = state.player.alchemyLevel < recipe.level;

            el.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <span class="text-xl mr-2">${(resultItem.image && getAssetUrl(resultItem.image)) ? `<img src="${getAssetUrl(resultItem.image)}" class="w-6 h-6 object-contain inline-block">` : (resultItem.icon || '')}</span>
                        <span class="font-bold quality-${qClass} font-ancient">${resultItem.name}</span>
                    </div>
                    ${locked ?
                    `<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${recipe.level}</span>` :
                    `<button class="px-3 py-1.5 btn-gold text-[10px] font-bold rounded-lg whitespace-nowrap" onclick="window.game.craft('${recipe.id}')">LUYỆN CHẾ</button>`
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
                        <button class="px-3 py-1.5 bg-qi-jade/10 text-qi-jade text-[10px] font-bold rounded-xl border border-qi-jade/20 active:scale-95 transition-all" onclick="window.game.harvest(${index})">THU HOẠCH</button>
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
}
