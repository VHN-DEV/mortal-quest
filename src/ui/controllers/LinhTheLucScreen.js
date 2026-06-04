import { LINH_THE_DATA } from '../../configs/linh-the-data.js';
import { state } from '../../state.js';

/**
 * Màn hình hiển thị danh sách 30 loại Linh Thể.
 */
export class LinhTheLucScreen {
    constructor() {
        this.rendered = false;
        this.initElements();
        this.initEvents();
        this.buildCachedList();
    }

    initElements() {
        this.overlay = document.getElementById('linh-the-luc-overlay');
        this.listView = document.getElementById('linh-the-list-view');
        this.detailView = document.getElementById('linh-the-detail-view');

        this.btnClose = document.getElementById('close-linh-the-luc-btn');
        this.btnBack = document.getElementById('back-to-the-list-btn');

        this.elDetailIcon = document.getElementById('linh-the-detail-icon');
        this.elDetailRank = document.getElementById('linh-the-detail-rank');
        this.elDetailName = document.getElementById('linh-the-detail-name');
        this.elDetailTitle = document.getElementById('linh-the-detail-title');
        this.elDetailRarity = document.getElementById('linh-the-detail-rarity');
        this.elDetailDesc = document.getElementById('linh-the-detail-desc');
        this.elDetailSpecial = document.getElementById('linh-the-detail-special');
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
        state.ui.toggleOverlay('linh-the-luc-overlay', true);
        if (!this.rendered) {
            this.renderList();
            this.rendered = true;
        }
        this.showList();
    }

    close() {
        state.ui.toggleOverlay('linh-the-luc-overlay', false);
    }

    showList() {
        this.listView.classList.remove('hidden');
        this.detailView.classList.add('hidden');
        this.listView.scrollTop = 0;
    }

    showDetail(item) {
        this.listView.classList.add('hidden');
        this.detailView.classList.remove('hidden');
        this.detailView.scrollTop = 0;

        const rarityColors = {
            'Thần Thoại': '#f87171',
            'Thần':       '#fbbf24',
            'Tiên':       '#a78bfa',
            'Thiên':      '#60a5fa',
            'Địa':        '#34d399'
        };
        const color = rarityColors[item.rarity] || '#a78bfa';

        this.elDetailIcon.textContent = '🌌';
        this.elDetailIcon.style.color = color;
        this.elDetailIcon.style.filter = `drop-shadow(0 0 15px ${color}80)`;

        this.elDetailRank.textContent = `Hạng ${item.rank}`;
        this.elDetailRank.style.color = color;

        this.elDetailName.textContent = item.name;
        this.elDetailName.style.textShadow = `0 0 15px ${color}80`;

        this.elDetailTitle.textContent = `"${item.title}"`;
        this.elDetailRarity.textContent = item.rarity;
        this.elDetailDesc.textContent = item.description;
        this.elDetailSpecial.textContent = item.special;
        this.elDetailSpecial.style.color = color;
    }

    buildCachedList() {
        if (this.cachedElements) return;
        this.cachedElements = [];

        const rarityColors = {
            'Thần Thoại': '#f87171',
            'Thần':       '#fbbf24',
            'Tiên':       '#a78bfa',
            'Thiên':      '#60a5fa',
            'Địa':        '#34d399'
        };

        LINH_THE_DATA.forEach(item => {
            const el = document.createElement('div');
            el.className = 'linh-the-item-card group';

            const color = rarityColors[item.rarity] || '#a78bfa';
            const glowHex = color + '40';

            el.style.setProperty('--item-color', color);
            el.style.setProperty('--item-border-color', color + '30');
            el.style.setProperty('--item-bg-dim', color + '0d');
            el.style.setProperty('--item-glow-dim', color + '26');
            el.style.setProperty('--item-bg-hover', color + '26');
            el.style.setProperty('--item-glow-hover', color + '66');

            // Rank-tier visual badges
            if (item.rank === 1) {
                el.classList.add('rank-1');
            } else if (item.rank <= 5) {
                el.classList.add('rank-top3');
            } else if (item.rank <= 10) {
                el.classList.add('rank-top10');
            }

            const rarityClass = this.getRarityClass(item.rarity);

            el.innerHTML = `
                <div class="rank-circle">
                    ${item.rank}
                </div>
                <div class="flex-grow min-w-0">
                    <h4 class="text-sm font-charm text-white transition-colors truncate">${item.name}</h4>
                    <div class="flex items-center space-x-2 mt-0.5">
                        <span class="text-[8px] text-gray-500 italic truncate">"${item.title}"</span>
                        <span class="text-[8px] font-bold flex-none ${rarityClass}">${item.rarity}</span>
                    </div>
                </div>
                <i class="ph ph-sparkle text-xl flex-none"></i>
            `;

            el.onclick = () => this.showDetail(item);
            this.cachedElements.push(el);
        });
    }

    renderList() {
        this.listView.innerHTML = '';
        this.buildCachedList();
        
        // Render first 8 elements immediately to make the UI responsive and render instantly
        const firstBatch = this.cachedElements.slice(0, 8);
        firstBatch.forEach(el => this.listView.appendChild(el));

        // Delay rendering of the remaining items to avoid blocking the thread during overlay opening
        setTimeout(() => {
            if (this.listView) {
                const remaining = this.cachedElements.slice(8);
                remaining.forEach(el => this.listView.appendChild(el));
            }
        }, 100);
    }

    getRarityClass(rarity) {
        switch (rarity) {
            case 'Thần Thoại': return 'text-red-400';
            case 'Thần':       return 'text-amber-400';
            case 'Tiên':       return 'text-purple-400';
            case 'Thiên':      return 'text-blue-400';
            case 'Địa':        return 'text-emerald-400';
            default:           return 'text-gray-500';
        }
    }
}
