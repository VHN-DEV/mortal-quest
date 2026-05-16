import { KY_TRUNG_DATA } from '../../configs/ky-trung-data.js';
import { state } from '../../state.js';

/**
 * Màn hình hiển thị danh sách 10 loại Kỳ Trùng.
 */
export class KyTrungBangScreen {
    constructor() {
        this.initElements();
        this.initEvents();
    }

    initElements() {
        this.overlay = document.getElementById('ky-trung-bang-overlay');
        this.listView = document.getElementById('ky-trung-list-view');
        this.detailView = document.getElementById('ky-trung-detail-view');
        
        this.btnClose = document.getElementById('close-ky-trung-bang-btn');
        this.btnBack = document.getElementById('back-to-ky-trung-list-btn');
        
        this.elDetailIcon = document.getElementById('ky-trung-detail-icon');
        this.elDetailRank = document.getElementById('ky-trung-detail-rank');
        this.elDetailName = document.getElementById('ky-trung-detail-name');
        this.elDetailColor = document.getElementById('ky-trung-detail-color');
        this.elDetailRarity = document.getElementById('ky-trung-detail-rarity');
        this.elDetailOrigin = document.getElementById('ky-trung-detail-origin');
        this.elDetailDesc = document.getElementById('ky-trung-detail-desc');
        this.elDetailSpecial = document.getElementById('ky-trung-detail-special');
        this.elDetailBloodline = document.getElementById('ky-trung-detail-bloodline');
        this.elDetailRole = document.getElementById('ky-trung-detail-role');
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
        state.ui.toggleOverlay('ky-trung-bang-overlay', true);
        this.showList();
    }

    close() {
        state.ui.toggleOverlay('ky-trung-bang-overlay', false);
    }

    showList() {
        if (this.listView) this.listView.classList.remove('hidden');
        if (this.detailView) this.detailView.classList.add('hidden');
        this.renderList();
    }

    showDetail(item) {
        if (this.listView) this.listView.classList.add('hidden');
        if (this.detailView) this.detailView.classList.remove('hidden');
        
        this.elDetailIcon.className = "text-6xl mb-4 bug-effect";
        this.elDetailIcon.textContent = "🦗"; // Default emoji
        this.elDetailRank.textContent = `Hạng ${item.rank}`;
        this.elDetailName.textContent = item.name;
        this.elDetailColor.textContent = item.color;
        this.elDetailRarity.textContent = item.rarity;
        this.elDetailOrigin.textContent = item.origin;
        this.elDetailDesc.textContent = item.description;
        this.elDetailSpecial.textContent = item.special;
        
        if (this.elDetailBloodline) this.elDetailBloodline.textContent = item.bloodline || "Vô";
        if (this.elDetailRole) this.elDetailRole.textContent = item.role || "Không";

        // Dynamic icon color based on rarity
        const rarityColorMap = {
            "Tiên": "#fbbf24",
            "Thánh": "#ef4444",
            "Thiên": "#f97316",
            "Địa": "#a855f7",
            "Huyền": "#3b82f6",
            "Linh": "#22c55e",
            "Phàm": "#ffffff"
        };

        const foundColor = rarityColorMap[item.rarity] || "#94a3b8";
        this.elDetailIcon.style.color = foundColor;
        this.elDetailIcon.style.filter = `drop-shadow(0 0 15px ${foundColor}80)`;
    }

    renderList() {
        if (!this.listView) return;
        this.listView.innerHTML = '';
        
        KY_TRUNG_DATA.forEach(item => {
            const el = document.createElement('div');
            el.className = 'group relative bg-white/5 hover:bg-emerald-950/20 border border-white/5 hover:border-emerald-500/30 rounded-2xl p-4 flex items-center space-x-4 cursor-pointer transition-all active:scale-95';
            
            const rarityClass = this.getRarityClass(item.rarity);
            
            el.innerHTML = `
                <div class="flex-none w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-sm font-ancient text-gray-400 group-hover:text-emerald-500 transition-colors">
                    🦗
                </div>
                <div class="flex-grow">
                    <h4 class="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">${item.name}</h4>
                    <div class="flex items-center space-x-2 mt-0.5">
                        <span class="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 uppercase">${item.color}</span>
                        <span class="text-[8px] font-bold ${rarityClass}">${item.rarity}</span>
                    </div>
                </div>
                <i class="ph ph-caret-right text-gray-600 group-hover:text-emerald-500"></i>
            `;
            
            el.onclick = () => this.showDetail(item);
            this.listView.appendChild(el);
        });
    }

    getRarityClass(rarity) {
        switch (rarity) {
            case 'Tiên': return 'text-cultivation-gold';
            case 'Thánh': return 'text-red-500';
            case 'Thiên': return 'text-orange-500';
            case 'Địa': return 'text-purple-400';
            case 'Huyền': return 'text-blue-400';
            case 'Linh': return 'text-green-400';
            case 'Phàm': return 'text-white';
            default: return 'text-gray-500';
        }
    }
}
