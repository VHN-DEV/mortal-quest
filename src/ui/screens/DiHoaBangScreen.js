import { DI_HOA_DATA } from '../../configs/di-hoa-data.js';
import { state } from '../../state.js';

/**
 * Màn hình hiển thị danh sách 23 loại Dị Hỏa.
 */
export class DiHoaBangScreen {
    constructor() {
        this.initElements();
        this.initEvents();
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
        this.showList();
    }

    close() {
        state.ui.toggleOverlay('di-hoa-bang-overlay', false);
    }

    showList() {
        this.listView.classList.remove('hidden');
        this.detailView.classList.add('hidden');
        this.renderList();
    }

    showDetail(diHoa) {
        this.listView.classList.add('hidden');
        this.detailView.classList.remove('hidden');
        
        this.elDetailIcon.className = "text-6xl mb-4 flame-effect";
        this.elDetailIcon.textContent = "🔥"; // Default emoji, can be changed based on type/color
        this.elDetailRank.textContent = `Hạng ${diHoa.rank}`;
        this.elDetailName.textContent = diHoa.name;
        this.elDetailColor.textContent = diHoa.color;
        this.elDetailRarity.textContent = diHoa.rarity;
        this.elDetailOrigin.textContent = diHoa.origin;
        this.elDetailDesc.textContent = diHoa.description;
        this.elDetailSpecial.textContent = diHoa.special;

        // Dynamic icon color
        const colorMap = {
            "Trắng": "#ffffff",
            "Đen": "#333333",
            "Đỏ": "#ff4444",
            "Vàng": "#ffd700",
            "Xanh lá": "#44ff44",
            "Xanh biển": "#4444ff",
            "Tím": "#a020f0",
            "Bạc": "#c0c0c0"
        };

        let foundColor = "#ff4444";
        for (const [key, val] of Object.entries(colorMap)) {
            if (diHoa.color.includes(key)) {
                foundColor = val;
                break;
            }
        }
        this.elDetailIcon.style.color = foundColor;
        this.elDetailIcon.style.filter = `drop-shadow(0 0 15px ${foundColor}80)`;
    }

    renderList() {
        this.listView.innerHTML = '';
        
        DI_HOA_DATA.forEach(item => {
            const el = document.createElement('div');
            el.className = 'group relative bg-white/5 hover:bg-red-950/20 border border-white/5 hover:border-red-500/30 rounded-2xl p-4 flex items-center space-x-4 cursor-pointer transition-all active:scale-95';
            
            // Quality border color
            const rarityClass = this.getRarityClass(item.rarity);
            
            el.innerHTML = `
                <div class="flex-none w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-sm font-ancient text-gray-400 group-hover:text-red-500 transition-colors flame-effect">
                    ${item.rank}
                </div>
                <div class="flex-grow">
                    <h4 class="text-sm font-bold text-white group-hover:text-red-400 transition-colors">${item.name}</h4>
                    <div class="flex items-center space-x-2 mt-0.5">
                        <span class="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 uppercase">${item.color}</span>
                        <span class="text-[8px] font-bold ${rarityClass}">${item.rarity}</span>
                    </div>
                </div>
                <i class="ph ph-fire text-gray-600 group-hover:text-red-500"></i>
            `;
            
            el.onclick = () => this.showDetail(item);
            this.listView.appendChild(el);
        });
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
