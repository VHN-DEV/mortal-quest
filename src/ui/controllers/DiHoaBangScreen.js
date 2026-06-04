import { DI_HOA_DATA } from '../../configs/di-hoa-data.js';
import { state } from '../../state.js';

/**
 * Màn hình hiển thị danh sách 23 loại Dị Hỏa.
 */
export class DiHoaBangScreen {
    constructor() {
        this.initElements();
        this.initEvents();
        this.rendered = false;
        this.buildCachedList();
    }

    initElements() {
        this.overlay = document.getElementById('di-hoa-bang-overlay');
        this.listView = document.getElementById('di-hoa-list-view');
        this.detailView = document.getElementById('di-hoa-detail-view');

        this.btnClose = document.getElementById('close-di-hoa-bang-btn');
        this.btnBack = document.getElementById('back-to-list-btn');

        this.elDetailIcon = document.getElementById('di-hoa-detail-icon');
        this.elDetailRank = document.getElementById('di-hoa-detail-rank');
        this.elDetailName = document.getElementById('di-hoa-detail-name');
        this.elDetailColor = document.getElementById('di-hoa-detail-color');
        this.elDetailRarity = document.getElementById('di-hoa-detail-rarity');
        this.elDetailOrigin = document.getElementById('di-hoa-detail-origin');
        this.elDetailDesc = document.getElementById('di-hoa-detail-desc');
        this.elDetailSpecial = document.getElementById('di-hoa-detail-special');

        // Custom wrappers for dynamic theme styling
        this.elDetailIconWrap = document.getElementById('di-hoa-detail-icon-wrap');
        this.elDetailSpecialBox = document.getElementById('di-hoa-detail-special-box');
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
        state.ui.toggleOverlay('di-hoa-bang-overlay', true);
        if (!this.rendered) {
            this.renderList();
            this.rendered = true;
        }
        this.showList();
    }

    close() {
        state.ui.toggleOverlay('di-hoa-bang-overlay', false);
    }

    showList() {
        this.listView.classList.remove('hidden');
        this.detailView.classList.add('hidden');
        this.listView.scrollTop = 0;
    }

    showDetail(diHoa) {
        this.listView.classList.add('hidden');
        this.detailView.classList.remove('hidden');
        this.detailView.scrollTop = 0;

        this.elDetailIcon.className = "flame-effect";
        this.elDetailIcon.innerHTML = '<i class="ph ph-fire text-6xl"></i>';
        const icon = this.elDetailIcon.querySelector('i');
        
        this.elDetailRank.textContent = `Hạng ${diHoa.rank}`;
        this.elDetailName.textContent = diHoa.name;
        this.elDetailColor.textContent = diHoa.color;
        this.elDetailRarity.textContent = diHoa.rarity;
        this.elDetailOrigin.textContent = diHoa.origin;
        this.elDetailDesc.textContent = diHoa.description;
        this.elDetailSpecial.textContent = diHoa.special;

        // Dynamic icon color
        const flameColor = diHoa.flameColor || '#ff4444';
        const glowColor = diHoa.glowColor || flameColor;

        if (icon) {
            icon.style.color = flameColor;
            icon.style.filter = `
                drop-shadow(0 0 10px ${glowColor})
                drop-shadow(0 0 20px ${glowColor})
                drop-shadow(0 0 35px ${glowColor})
            `;
        }

        // Apply dynamic theme colors to the detail view
        const colorRgba = hexToRgba(flameColor, 0.2);
        const bgRgba = hexToRgba(flameColor, 0.08);

        if (this.elDetailIconWrap) {
            this.elDetailIconWrap.style.borderColor = hexToRgba(flameColor, 0.4);
            this.elDetailIconWrap.style.boxShadow = `0 0 35px ${hexToRgba(glowColor, 0.35)}`;
            const pingBg = this.elDetailIconWrap.querySelector('.animate-ping');
            if (pingBg) {
                pingBg.style.backgroundColor = hexToRgba(flameColor, 0.1);
            }
        }

        this.elDetailRank.style.color = flameColor;
        this.elDetailRank.style.textShadow = `0 0 8px ${hexToRgba(glowColor, 0.4)}`;
        this.elDetailName.style.textShadow = `0 0 15px ${hexToRgba(glowColor, 0.5)}`;
        this.elDetailColor.style.color = flameColor;

        if (this.elDetailSpecialBox) {
            this.elDetailSpecialBox.style.backgroundColor = bgRgba;
            this.elDetailSpecialBox.style.borderColor = colorRgba;
            const specialHeader = this.elDetailSpecialBox.querySelector('h4');
            if (specialHeader) {
                specialHeader.style.color = flameColor;
                specialHeader.style.borderColor = hexToRgba(flameColor, 0.15);
            }
            this.elDetailSpecial.style.color = glowColor;
        }
    }

    buildCachedList() {
        if (this.cachedElements) return;
        this.cachedElements = [];

        DI_HOA_DATA.forEach(item => {
            const el = document.createElement('div');
            el.className = 'dihoa-item-card group';

            const flameColor = item.flameColor || '#ff4444';
            const glowColor = item.glowColor || flameColor;
            
            // Set dynamic colors using CSS variables
            el.style.setProperty('--item-color', glowColor);
            el.style.setProperty('--item-flame-color', flameColor);
            el.style.setProperty('--item-border-color', hexToRgba(glowColor, 0.2));
            el.style.setProperty('--item-bg-dim', hexToRgba(glowColor, 0.05));
            el.style.setProperty('--item-glow-dim', hexToRgba(glowColor, 0.15));
            el.style.setProperty('--item-bg-hover', hexToRgba(glowColor, 0.15));
            el.style.setProperty('--item-glow-hover', hexToRgba(glowColor, 0.45));

            // Dynamic ranking classes
            if (item.rank === 1) {
                el.classList.add('rank-1');
            } else if (item.rank <= 3) {
                el.classList.add('rank-top3');
            } else if (item.rank <= 10) {
                el.classList.add('rank-top10');
            }

            const rarityClass = this.getRarityClass(item.rarity);

            el.innerHTML = `
                <div class="rank-circle">
                    ${item.rank}
                </div>
                <div class="flex-grow">
                    <h4 class="text-sm font-charm text-white transition-colors">${item.name}</h4>
                    <div class="flex items-center space-x-2 mt-0.5">
                        <span class="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 uppercase">${item.color}</span>
                        <span class="text-[8px] font-bold ${rarityClass}">${item.rarity}</span>
                    </div>
                </div>
                <i class="ph ph-fire text-xl"></i>
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
            case 'Thần Thoại': return 'text-red-500';
            case 'Thần': return 'text-orange-500';
            case 'Tiên': return 'text-purple-400';
            case 'Thiên': return 'text-blue-400';
            case 'Địa': return 'text-green-400';
            default: return 'text-gray-500';
        }
    }
}

// Helper to convert Hex to RGBA
function hexToRgba(hex, opacity) {
    if (!hex) return `rgba(255, 255, 255, ${opacity})`;
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
