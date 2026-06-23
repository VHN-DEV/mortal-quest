import { state } from '../../state.js';
import { getItemById } from '../../configs/item-data.js';
import { SEEDS, FIELD_GRADES, FIELD_ATTRIBUTES } from '../../configs/garden-data.js';
import { getAssetUrl } from '../../configs/asset-data.js';

const LINH_THUC_LEVELS = [
    { level: 1, name: 'Linh Thực Sư Sơ Cấp' },
    { level: 2, name: 'Linh Thực Sư Trung Cấp' },
    { level: 3, name: 'Linh Thực Sư Cao Cấp' },
    { level: 4, name: 'Linh Thực Đại Sư' },
    { level: 5, name: 'Linh Thực Tông Sư' },
    { level: 6, name: 'Linh Thực Tôn Giả' },
    { level: 7, name: 'Linh Thực Thiên Tôn' }
];

export class SpiritPlanterController {
    constructor(parentScreen) {
        this.parentScreen = parentScreen;
    }

    getLevelInfo(level) {
        return LINH_THUC_LEVELS.find(l => l.level === level) || { level, name: 'Linh Thực Sư Vô Danh' };
    }

    render() {
        if (!state.player) return;
        const player = state.player;

        // Level & EXP bar
        const lvlText = document.getElementById('linh-thuc-level-text');
        const expBar = document.getElementById('linh-thuc-exp-bar');
        const expText = document.getElementById('linh-thuc-exp-text');
        const nextLevelExp = Math.max(1, player.linhThucLevel * 100 * Math.pow(1.5, player.linhThucLevel - 1));
        if (lvlText) lvlText.textContent = this.getLevelInfo(player.linhThucLevel).name;
        if (expBar) expBar.style.width = `${Math.min(100, (player.linhThucExp / nextLevelExp) * 100)}%`;
        if (expText) expText.textContent = `${Math.floor(player.linhThucExp)} / ${Math.floor(nextLevelExp)} XP`;

        const view = document.getElementById('linh-thuc-plots-view');
        if (!view) return;

        const abodes = (player.abodes || []).filter(a => a.plots && a.plots.length > 0);
        if (abodes.length === 0) {
            view.innerHTML = '<div class="text-center py-10 text-gray-600 italic text-xs">Ngươi chưa có Động Phủ nào với linh điền...</div>';
            return;
        }

        view.innerHTML = '';
        abodes.forEach((abode, abodeIdx) => {
            const abodeSection = document.createElement('div');
            abodeSection.className = 'space-y-2';
            const headerHtml = `<h4 class="text-[10px] font-ancient text-green-400 uppercase tracking-widest border-l-2 border-green-600 pl-2 mb-3">${abode.name || `Động Phủ ${abodeIdx + 1}`} - Linh Điền</h4>`;
            abodeSection.innerHTML = headerHtml;

            (abode.plots || []).forEach((plot, plotIdx) => {
                const el = document.createElement('div');
                el.className = 'p-3 border border-gray-800 rounded-xl bg-white/5';
                const grade = FIELD_GRADES[plot.grade] || FIELD_GRADES['PHAM'];
                const attr = FIELD_ATTRIBUTES[plot.attribute] || FIELD_ATTRIBUTES['NORMAL'];

                if (!plot.plantedSeedId) {
                    // Empty plot: show seed options
                    const seedOptions = SEEDS.filter(s => (!s.attributeReq || s.attributeReq === 'NORMAL' || s.attributeReq === plot.attribute))
                        .map(s => `<option value="${s.id}">${getItemById(s.herbId)?.name || s.name}</option>`)
                        .join('');
                    el.innerHTML = `
                        <div class="flex items-center justify-between">
                            <div>
                                <span class="text-[10px] font-ancient text-gray-300">Ô ${plotIdx + 1} · ${grade.name} ${attr.icon}</span>
                                <div class="text-[9px] text-gray-600 italic mt-0.5">Đất trống</div>
                            </div>
                            <div class="flex items-center gap-2">
                                <select id="seed-select-${abodeIdx}-${plotIdx}" class="text-[9px] bg-gray-900 border border-gray-700 rounded px-1 py-1 text-gray-300">
                                    ${seedOptions}
                                </select>
                                <button class="px-3 py-1 text-[9px] btn-gold rounded-lg font-bold whitespace-nowrap"
                                    onclick="window.game.plantSeed(${abodeIdx}, ${plotIdx}, document.getElementById('seed-select-${abodeIdx}-${plotIdx}').value)">
                                    GIEO TRỒNG
                                </button>
                            </div>
                        </div>
                    `;
                } else {
                    const seed = SEEDS.find(s => s.id === plot.plantedSeedId);
                    const herb = seed ? getItemById(seed.herbId) : null;
                    const now = Date.now();
                    const growthProgress = plot.plantedAt
                        ? Math.min(100, ((now - plot.plantedAt) / ((seed?.baseGrowthTime || 300) * 1000 * grade.speedMult)) * 100)
                        : 0;
                    const ready = growthProgress >= 100;

                    el.innerHTML = `
                        <div class="flex items-center justify-between">
                            <div>
                                <span class="text-[10px] font-ancient text-gray-300">Ô ${plotIdx + 1} · ${grade.name} ${attr.icon}</span>
                                <div class="text-[9px] text-green-400 mt-0.5">${herb?.name || 'Linh Thảo'}</div>
                            </div>
                            <div class="flex items-center gap-2">
                                ${ready
                                    ? `<button class="px-3 py-1 text-[9px] bg-green-700 text-white rounded-lg font-bold whitespace-nowrap" onclick="window.game.harvestPlot(${abodeIdx}, ${plotIdx})">THU HOẠCH</button>`
                                    : `<div class="text-[9px] text-gray-500">${Math.floor(growthProgress)}%</div>`
                                }
                            </div>
                        </div>
                        <div class="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div class="h-full bg-green-500 rounded-full transition-all" style="width: ${growthProgress}%"></div>
                        </div>
                    `;
                }
                abodeSection.appendChild(el);
            });
            view.appendChild(abodeSection);
        });
    }
}
