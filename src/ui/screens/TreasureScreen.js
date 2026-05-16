import { state } from '../../state.js';
import { getItemById } from '../../configs/item-data.js';
import { getAssetUrl } from '../../configs/asset-data.js';

export class TreasureScreen {
    constructor() {
        this.currentSlot = null;
        this.initElements();
        this.initEvents();
    }

    initElements() {
        this.elScreen = document.getElementById('screen-treasure');
        this.elIcon = document.getElementById('treasure-mgmt-icon');
        this.elName = document.getElementById('treasure-mgmt-name');
        this.elTier = document.getElementById('treasure-mgmt-tier');
        this.elDurabilityText = document.getElementById('treasure-mgmt-durability-text');
        this.elDurabilityBar = document.getElementById('treasure-mgmt-durability-bar');
        this.elSpiritText = document.getElementById('treasure-mgmt-spirit-text');
        this.elSpiritBar = document.getElementById('treasure-mgmt-spirit-bar');
        this.elStatsGrid = document.getElementById('treasure-mgmt-stats');

        this.btnClose = document.getElementById('btn-close-treasure');
        this.btnRecognize = document.getElementById('btn-treasure-recognize');
        this.btnNourish = document.getElementById('btn-treasure-nourish');
        this.btnRepair = document.getElementById('btn-treasure-repair');
        this.btnRefine = document.getElementById('btn-treasure-refine');
    }

    initEvents() {
        if (this.btnClose) {
            this.btnClose.onclick = () => state.ui.toggleOverlay(this.elScreen, false);
        }

        if (this.btnRecognize) {
            this.btnRecognize.onclick = () => {
                const res = state.systems.treasure.recognize(this.currentSlot);
                state.ui.alert(res.msg, res.success ? 'Thành Công' : 'Thất Bại');
                this.render();
            };
        }

        if (this.btnRepair) {
            this.btnRepair.onclick = () => {
                const res = state.systems.treasure.repair(this.currentSlot);
                state.ui.toast(res.msg, res.success ? 'success' : 'error');
                this.render();
            };
        }

        if (this.btnNourish) {
            this.btnNourish.onclick = () => {
                // Simplified: Nourish using generic materials in inventory
                const materials = state.player.inventory.allItems.filter(i => getItemById(i.id).type === 'material');
                if (materials.length === 0) {
                    state.ui.toast("Không có vật liệu phù hợp để nuôi dưỡng!", "error");
                    return;
                }
                
                const mat = materials[0];
                const res = state.systems.treasure.nourish(this.currentSlot, mat.id, 1);
                state.ui.toast(res.msg, res.success ? 'success' : 'error');
                this.render();
            };
        }

        if (this.btnRefine) {
            this.btnRefine.onclick = () => {
                const res = state.systems.treasure.refine(this.currentSlot);
                state.ui.toast(res.msg, res.success ? 'success' : 'error');
                this.render();
            };
        }
    }

    open(slot) {
        this.currentSlot = slot;
        this.render();
        state.ui.toggleOverlay(this.elScreen, true);
    }

    render() {
        if (!this.currentSlot || !state.player.equipment[this.currentSlot]) return;

        const itemId = state.player.equipment[this.currentSlot];
        const item = getItemById(itemId);
        const meta = state.player.equipmentMetadata[this.currentSlot] || { level: 1, spirit: 0, durability: 100 };

        if (item.image) {
            this.elIcon.innerHTML = `<img src="${getAssetUrl(item.image)}" class="w-16 h-16 object-contain mx-auto">`;
        } else {
            this.elIcon.textContent = item.icon || '';
        }
        this.elName.textContent = item.name;
        this.elTier.textContent = `${item.tier || 'PHAM_KHI'} | ${item.quality || 'Thường'}`;
        
        this.elDurabilityText.textContent = `${meta.durability}%`;
        this.elDurabilityBar.style.width = `${meta.durability}%`;
        
        const nextLevelSpirit = meta.level * 500;
        this.elSpiritText.textContent = `${meta.spirit.toFixed(0)}/${nextLevelSpirit}`;
        this.elSpiritBar.style.width = `${Math.min(100, (meta.spirit / nextLevelSpirit) * 100)}%`;

        // Render Stats
        let statsHtml = '';
        if (item.stats) {
            Object.entries(item.stats).forEach(([key, val]) => {
                statsHtml += `
                    <div class="flex justify-between border-b border-white/5 pb-1">
                        <span class="text-gray-500 uppercase">${key}:</span>
                        <span class="text-white">+${val}</span>
                    </div>
                `;
            });
        }
        
        if (meta.extraStat) {
            statsHtml += `
                <div class="flex justify-between border-b border-white/5 pb-1 text-qi-blue">
                    <span class="uppercase">${meta.extraStat.type}:</span>
                    <span>+${(meta.extraStat.value * 100).toFixed(1)}%</span>
                </div>
            `;
        }

        this.elStatsGrid.innerHTML = statsHtml || '<div class="col-span-2 text-center text-gray-500 italic">Không có chỉ số cộng thêm</div>';
    }
}
