import { ITEMS } from '../../configs/item-data.js';
import { state } from '../../state.js';
import { getAssetUrl } from '../../configs/asset-data.js';
import { PHAP_BAO_QUALITIES, ITEM_TYPES_METADATA, GAME_STATS } from '../../configs/game-enums.js';

/**
 * Màn hình hiển thị Vạn Bảo Lục - Danh sách các pháp bảo trong game.
 * Xếp hạng theo phẩm cấp và phân loại theo loại trang bị.
 */
export class PhapBaoLucScreen {
    constructor() {
        this.initElements();
        this.initEvents();
        
        this.qualityOrder = Object.values(PHAP_BAO_QUALITIES).map(q => q.name);
    }

    initElements() {
        this.overlay = document.getElementById('phap-bao-luc-overlay');
        this.listView = document.getElementById('phap-bao-list-view');
        this.detailView = document.getElementById('phap-bao-detail-view');
        
        this.btnClose = document.getElementById('close-phap-bao-luc-btn');
        this.btnBack = document.getElementById('back-to-phap-bao-list-btn');
        
        this.elDetailIcon = document.getElementById('phap-bao-detail-icon');
        this.elDetailQuality = document.getElementById('phap-bao-detail-quality');
        this.elDetailName = document.getElementById('phap-bao-detail-name');
        this.elDetailType = document.getElementById('phap-bao-detail-type');
        this.elDetailDesc = document.getElementById('phap-bao-detail-desc');
        this.elDetailStats = document.getElementById('phap-bao-detail-stats');
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
        state.ui.toggleOverlay('phap-bao-luc-overlay', true);
        this.showList();
    }

    close() {
        state.ui.toggleOverlay('phap-bao-luc-overlay', false);
    }

    showList() {
        this.listView.classList.remove('hidden');
        this.detailView.classList.add('hidden');
        this.renderList();
    }

    showDetail(item) {
        this.listView.classList.add('hidden');
        this.detailView.classList.remove('hidden');
        
        const color = this.getQualityColor(item.quality);

        // Render Icon or Image
        if (item.image && getAssetUrl(item.image)) {
            this.elDetailIcon.innerHTML = `<img src="${getAssetUrl(item.image)}" class="w-20 h-20 object-contain mx-auto filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">`;
            this.elDetailIcon.style.color = '';
            this.elDetailIcon.style.filter = '';
        } else {
            this.elDetailIcon.innerHTML = `<span class="text-5xl">${item.icon || "⚔️"}</span>`;
            this.elDetailIcon.style.color = color;
            this.elDetailIcon.style.filter = `drop-shadow(0 0 15px ${color}80)`;
        }

        this.elDetailQuality.textContent = item.quality;
        this.elDetailQuality.style.color = color;
        
        this.elDetailName.textContent = item.name;
        this.elDetailName.style.color = 'white';
        
        this.elDetailType.textContent = ITEM_TYPES_METADATA[item.type]?.name || item.type;
        
        // Render Description with Quick Links
        this.renderDescription(item.description);
        
        // Render stats
        this.elDetailStats.innerHTML = '';
        if (item.stats) {
            Object.entries(item.stats).forEach(([key, value]) => {
                const statRow = document.createElement('div');
                statRow.className = 'flex justify-between items-center text-xs py-1 border-b border-white/5';
                statRow.innerHTML = `
                    <span class="text-gray-500">${this.translateStat(key)}</span>
                    <span class="text-qi-blue font-mono">${value > 0 ? '+' : ''}${value}</span>
                `;
                this.elDetailStats.appendChild(statRow);
            });
        }
    }

    renderDescription(desc) {
        if (!this.elDetailDesc) return;
        
        // Pattern: [[item_id|display_name]]
        const regex = /\[\[(.*?)\|(.*?)\]\]/g;
        let html = desc.replace(regex, (match, id, name) => {
            return `<span class="item-link text-qi-blue underline cursor-pointer hover:text-white transition-colors" data-id="${id}">${name}</span>`;
        });
        
        this.elDetailDesc.innerHTML = html;
        
        // Gán sự kiện click cho các liên kết vừa tạo
        const links = this.elDetailDesc.querySelectorAll('.item-link');
        links.forEach(link => {
            link.onclick = (e) => {
                const id = e.target.dataset.id;
                const targetItem = ITEMS[id];
                if (targetItem) {
                    this.showDetail(targetItem);
                }
            };
        });
    }

    translateStat(stat) {
        return GAME_STATS[stat]?.name || stat;
    }

    getQualityColor(quality) {
        if (!quality) return '#ffffff';
        if (typeof quality === 'object') {
            return quality.color || '#ffffff';
        }
        const qObj = Object.values(PHAP_BAO_QUALITIES).find(q => q.name === quality || q.id === quality);
        return qObj?.color || '#ffffff';
    }

    buildCachedList() {
        if (this.cachedElements) return;
        this.cachedElements = [];

        const equipmentKeys = ['head', 'necklace', 'weapon', 'armor', 'accessory', 'shoes', 'phap_bao_khong_gian', 'phap_bao_thu', 'phap_bao_phi_hanh', 'phap_bao_phu_tro', 'phap_bao_tran', 'phap_bao_hon', 'phap_bao_cong'];
        const equipment = Object.values(ITEMS).filter(item => equipmentKeys.includes(item.type));
        const grouped = {};
        equipment.forEach(item => {
            if (!grouped[item.type]) grouped[item.type] = [];
            grouped[item.type].push(item);
        });

        const sortedTypes = equipmentKeys.filter(type => grouped[type]);

        sortedTypes.forEach(type => {
            const typeHeader = document.createElement('div');
            typeHeader.className = 'text-[10px] font-ancient text-gray-500 uppercase tracking-[0.3em] mt-6 mb-2 border-l-2 border-gray-700 pl-3';
            typeHeader.textContent = ITEM_TYPES_METADATA[type]?.name || type;
            this.cachedElements.push(typeHeader);

            const items = grouped[type];
            items.sort((a, b) => {
                const qa = this.qualityOrder.indexOf(typeof a.quality === 'object' ? a.quality.name : a.quality);
                const qb = this.qualityOrder.indexOf(typeof b.quality === 'object' ? b.quality.name : b.quality);
                return qb - qa;
            });

            items.forEach(item => {
                const el = document.createElement('div');
                el.className = 'group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl p-4 flex items-center space-x-4 cursor-pointer transition-all active:scale-95';
                
                const qualityColor = this.getQualityColor(item.quality);
                const contentIcon = (item.image && getAssetUrl(item.image)) 
                    ? `<img src="${getAssetUrl(item.image)}" class="w-8 h-8 object-contain">`
                    : `<span style="color: ${qualityColor}">${item.icon || '⚔️'}</span>`;

                el.innerHTML = `
                    <div class="flex-none w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-xl">
                        ${contentIcon}
                    </div>
                    <div class="flex-grow">
                        <h4 class="text-sm font-charm text-white group-hover:text-qi-blue transition-colors">${item.name}</h4>
                        <div class="flex items-center space-x-2 mt-0.5">
                            <span class="text-[9px] font-bold" style="color: ${qualityColor}">${item.quality}</span>
                        </div>
                    </div>
                    <i class="ph ph-caret-right text-gray-600 group-hover:text-white"></i>
                `;
                
                el.onclick = () => this.showDetail(item);
                this.cachedElements.push(el);
            });
        });
    }

    renderList() {
        this.listView.innerHTML = '';
        this.buildCachedList();
        this.cachedElements.forEach(el => this.listView.appendChild(el));
    }
}
