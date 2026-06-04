import { DI_LOI_DATA } from '../../configs/di-loi-data.js';
import { state } from '../../state.js';

/**
 * Màn hình hiển thị danh sách 10 loại Dị Lôi.
 */
export class DiLoiBangScreen {
    constructor() {
        this.initElements();
        this.initEvents();
    }

    initElements() {
        this.overlay = document.getElementById('di-loi-bang-overlay');
        this.listView = document.getElementById('di-loi-list-view');
        this.detailView = document.getElementById('di-loi-detail-view');

        this.btnClose = document.getElementById('close-di-loi-bang-btn');
        this.btnBack = document.getElementById('back-to-loi-list-btn');

        this.elDetailIcon = document.getElementById('di-loi-detail-icon');
        this.elDetailRank = document.getElementById('di-loi-detail-rank');
        this.elDetailName = document.getElementById('di-loi-detail-name');
        this.elDetailColor = document.getElementById('di-loi-detail-color');
        this.elDetailRarity = document.getElementById('di-loi-detail-rarity');
        this.elDetailOrigin = document.getElementById('di-loi-detail-origin');
        this.elDetailDesc = document.getElementById('di-loi-detail-desc');
        this.elDetailSpecial = document.getElementById('di-loi-detail-special');
    }

    initEvents() {
        if (this.btnClose) {
            this.btnClose.onclick = () => this.close();
        }
        if (this.btnBack) {
            this.btnBack.onclick = () => this.showList();
        }
    }

    open() {
        if (!this.overlay) return;
        state.ui.toggleOverlay('di-loi-bang-overlay', true);
        this.showList();
    }

    close() {
        state.ui.toggleOverlay('di-loi-bang-overlay', false);
    }

    showList() {
        this.listView.classList.remove('hidden');
        this.detailView.classList.add('hidden');
        this.renderList();
    }

    showDetail(diLoi) {
        this.listView.classList.add('hidden');
        this.detailView.classList.remove('hidden');

        this.elDetailIcon.innerHTML =
            '<i class="ph ph-lightning text-6xl"></i>';

        const icon =
            this.elDetailIcon.querySelector('i');

        this.elDetailRank.textContent = `Hạng ${diLoi.rank}`;
        this.elDetailName.textContent = diLoi.name;
        this.elDetailColor.textContent = diLoi.color;
        this.elDetailRarity.textContent = diLoi.rarity;
        this.elDetailOrigin.textContent = diLoi.origin;
        this.elDetailDesc.textContent = diLoi.description;
        this.elDetailSpecial.textContent = diLoi.special;

        const lightningColor =
            diLoi.lightningColor || '#3b82f6';

        const glowColor =
            diLoi.glowColor || lightningColor;

        if (icon) {
            icon.style.color = lightningColor;

            icon.style.filter = `
                drop-shadow(0 0 10px ${glowColor})
                drop-shadow(0 0 20px ${glowColor})
                drop-shadow(0 0 35px ${glowColor})
            `;
        }
    }

    buildCachedList() {
        if (this.cachedElements) return;
        this.cachedElements = [];

        DI_LOI_DATA.forEach(item => {
            const el = document.createElement('div');
            el.className = 'group relative bg-white/5 hover:bg-blue-950/20 border border-white/5 hover:border-blue-500/30 rounded-2xl p-4 flex items-center space-x-4 cursor-pointer transition-all active:scale-95';

            if (item.rank <= 5) {
                el.classList.remove('border-white/5');
                el.classList.add('border-cyan-500/20');
            }

            if (item.rank <= 3) {
                el.classList.add(
                    'bg-gradient-to-r',
                    'from-indigo-500/10',
                    'to-cyan-500/10'
                );
            }

            if (item.rank === 1) {
                el.classList.add(
                    'ring-1',
                    'ring-purple-400/30'
                );
            }

            const rarityClass = this.getRarityClass(item.rarity);

            el.innerHTML = `
                <div class="flex-none w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-sm font-ancient text-gray-400 group-hover:text-blue-500 transition-colors">
                    ${item.rank}
                </div>
                <div class="flex-grow">
                    <h4 class="text-sm font-charm text-white group-hover:text-blue-400 transition-colors">${item.name}</h4>
                    <div class="flex items-center space-x-2 mt-0.5">
                        <span class="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 uppercase">${item.color}</span>
                        <span class="text-[8px] font-bold ${rarityClass}">${item.rarity}</span>
                    </div>
                </div>
                <i
                    class="ph ph-lightning text-xl transition-all duration-300 group-hover:scale-125"
                    style="
                        color:${item.lightningColor || '#3b82f6'};
                        text-shadow:
                            0 0 5px ${item.glowColor || '#3b82f6'},
                            0 0 10px ${item.glowColor || '#3b82f6'};
                    ">
                </i>
            `;

            el.onclick = () => this.showDetail(item);
            this.cachedElements.push(el);
        });
    }

    renderList() {
        this.listView.innerHTML = '';
        this.buildCachedList();
        this.cachedElements.forEach(el => this.listView.appendChild(el));
    }

    getRarityClass(rarity) {
        switch (rarity) {
            case 'Thần Thoại': return 'text-red-500';
            case 'Thần': return 'text-orange-500';
            case 'Tiên': return 'text-purple-400';
            case 'Thiên': return 'text-blue-400';
            case 'Địa': return 'text-green-400';
            default: return 'text-gray-500';
        }
    }
}
