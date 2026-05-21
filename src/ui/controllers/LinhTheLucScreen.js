import { LINH_THE_DATA } from '../../configs/linh-the-data.js';
import { state } from '../../state.js';

/**
 * Màn hình hiển thị danh sách 15 loại Linh Thể.
 */
export class LinhTheLucScreen {
    constructor() {
        this.initElements();
        this.initEvents();
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
        this.showList();
    }

    close() {
        state.ui.toggleOverlay('linh-the-luc-overlay', false);
    }

    showList() {
        this.listView.classList.remove('hidden');
        this.detailView.classList.add('hidden');
        this.renderList();
    }

    showDetail(item) {
        this.listView.classList.add('hidden');
        this.detailView.classList.remove('hidden');
        
        this.elDetailIcon.textContent = "🌌"; 
        this.elDetailRank.textContent = `Hạng ${item.rank}`;
        this.elDetailName.textContent = item.name;
        this.elDetailTitle.textContent = `"${item.title}"`;
        this.elDetailRarity.textContent = item.rarity;
        this.elDetailDesc.textContent = item.description;
        this.elDetailSpecial.textContent = item.special;

        // Space/Nebula colors
        const rarityColors = {
            'Thần Thoại': '#f87171',
            'Thần': '#fbbf24',
            'Tiên': '#a78bfa',
            'Thiên': '#60a5fa',
            'Địa': '#34d399'
        };

        const color = rarityColors[item.rarity] || '#a78bfa';
        this.elDetailIcon.style.color = color;
        this.elDetailIcon.style.filter = `drop-shadow(0 0 15px ${color}80)`;
    }

    buildCachedList() {
        if (this.cachedElements) return;
        this.cachedElements = [];
        
        LINH_THE_DATA.forEach(item => {
            const el = document.createElement('div');
            el.className = 'group relative bg-white/5 hover:bg-purple-950/20 border border-white/5 hover:border-purple-500/30 rounded-2xl p-4 flex items-center space-x-4 cursor-pointer transition-all active:scale-95';
            
            const rarityClass = this.getRarityClass(item.rarity);
            
            el.innerHTML = `
                <div class="flex-none w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-sm font-ancient text-gray-400 group-hover:text-purple-400 transition-colors">
                    ${item.rank}
                </div>
                <div class="flex-grow">
                    <h4 class="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">${item.name}</h4>
                    <div class="flex items-center space-x-2 mt-0.5">
                        <span class="text-[8px] text-gray-500 italic">"${item.title}"</span>
                        <span class="text-[8px] font-bold ${rarityClass}">${item.rarity}</span>
                    </div>
                </div>
                <i class="ph ph-sparkle text-gray-600 group-hover:text-purple-500"></i>
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
