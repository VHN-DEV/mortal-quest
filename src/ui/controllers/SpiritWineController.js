import { state } from '../../state.js';
import { getItemById } from '../../configs/item-data.js';
import { SPIRIT_WINE_RECIPES, getSpiritWineLevelInfo } from '../../configs/spirit-wine-data.js';

export class SpiritWineController {
    constructor(parentScreen) {
        this.parentScreen = parentScreen;
    }

    render() {
        if (!state.player) return;
        const player = state.player;

        // Level & EXP bar
        const lvlText = document.getElementById('linh-tuu-level-text');
        const expBar = document.getElementById('linh-tuu-exp-bar');
        const expText = document.getElementById('linh-tuu-exp-text');
        const nextLevelExp = Math.max(1, player.spiritWineLevel * 100 * Math.pow(1.5, player.spiritWineLevel - 1));
        if (lvlText) lvlText.textContent = getSpiritWineLevelInfo(player.spiritWineLevel).name;
        if (expBar) expBar.style.width = `${Math.min(100, (player.spiritWineExp / nextLevelExp) * 100)}%`;
        if (expText) expText.textContent = `${Math.floor(player.spiritWineExp)} / ${Math.floor(nextLevelExp)} XP`;

        // Recipes
        const view = document.getElementById('linh-tuu-recipes-view');
        if (!view) return;
        const known = player.knownWineRecipes || [];
        if (known.length === 0) {
            view.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa học được công thức linh tửu nào...</div>';
            return;
        }
        view.innerHTML = '';
        Object.values(SPIRIT_WINE_RECIPES).filter(r => known.includes(r.id)).forEach(recipe => {
            const item = getItemById(recipe.id);
            if (!item) return;
            const locked = (player.spiritWineLevel || 1) < recipe.level;
            let matHtml = '';
            recipe.materials.forEach(mat => {
                const matItem = getItemById(mat.id);
                const have = player.inventory.allItems.find(i => i.id === mat.id)?.quantity || 0;
                const ok = have >= mat.quantity;
                matHtml += `<div class="text-[10px] ${ok ? 'text-gray-400' : 'text-red-400'}">${matItem?.name || mat.id}: ${have}/${mat.quantity}</div>`;
            });
            const el = document.createElement('div');
            el.className = 'p-4 border border-gray-800 rounded-2xl bg-white/5 space-y-3';
            el.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <span class="text-xl">${item.icon || '🍶'}</span>
                        <span class="font-bold text-amber-300 font-ancient">${item.name}</span>
                    </div>
                    ${locked
                        ? `<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${recipe.level}</span>`
                        : `<button class="px-4 py-2 btn-gold text-[10px] font-bold rounded-lg" onclick="window.game.brewSpiritWine('${recipe.id}')">CHƯNG CẤT</button>`
                    }
                </div>
                <div class="grid grid-cols-2 gap-1">${matHtml}</div>
                <div class="text-[9px] text-gray-500 italic">Thể lực: ${recipe.staminaCost} | Pháp lực: ${recipe.manaCost} | EXP: +${recipe.expGain}</div>
            `;
            view.appendChild(el);
        });
    }
}
