import { state } from '../../state.js';
import { getItemById } from '../../configs/item-data.js';
import { CAM_CHE_RECIPES, getCamCheLevelInfo } from '../../configs/cam-che-data.js';

export class CamCheController {
    constructor(parentScreen) {
        this.parentScreen = parentScreen;
    }

    render() {
        if (!state.player) return;
        const player = state.player;

        const lvlText = document.getElementById('cam-che-level-text');
        const expBar = document.getElementById('cam-che-exp-bar');
        const expText = document.getElementById('cam-che-exp-text');
        const nextLevelExp = Math.max(1, player.camCheLevel * 100 * Math.pow(1.5, player.camCheLevel - 1));
        if (lvlText) lvlText.textContent = getCamCheLevelInfo(player.camCheLevel).name;
        if (expBar) expBar.style.width = `${Math.min(100, (player.camCheExp / nextLevelExp) * 100)}%`;
        if (expText) expText.textContent = `${Math.floor(player.camCheExp)} / ${Math.floor(nextLevelExp)} XP`;

        const view = document.getElementById('cam-che-recipes-view');
        if (!view) return;
        const known = player.knownCamCheRecipes || [];
        if (known.length === 0) {
            view.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa học được công thức cấm chế nào...</div>';
            return;
        }
        view.innerHTML = '';
        Object.values(CAM_CHE_RECIPES).filter(r => known.includes(r.id)).forEach(recipe => {
            const item = getItemById(recipe.id);
            if (!item) return;
            const locked = (player.camCheLevel || 1) < recipe.level;
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
                        <span class="text-xl">${item.icon || '🛡️'}</span>
                        <span class="font-bold text-cyan-300 font-ancient">${item.name}</span>
                    </div>
                    ${locked
                        ? `<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${recipe.level}</span>`
                        : `<button class="px-4 py-2 btn-gold text-[10px] font-bold rounded-lg" onclick="window.game.craftCamChe('${recipe.id}')">THIẾT LẬP</button>`
                    }
                </div>
                <div class="grid grid-cols-2 gap-1">${matHtml}</div>
                <div class="text-[9px] text-gray-500 italic">Pháp lực: ${recipe.manaCost} | Thể lực: ${recipe.staminaCost} | EXP: +${recipe.expGain} | Phòng thủ: +${recipe.defensePower}</div>
            `;
            view.appendChild(el);
        });
    }
}
