import { CREATION_RACES } from '../../configs/creation-data.js';
import { state } from '../../state.js';

/**
 * Màn hình hiển thị Vạn Tộc Thông Giám - Danh sách các chủng tộc trong game.
 */
export class ChungTocLucScreen {
    constructor() {
        this.initElements();
        this.initEvents();
    }

    initElements() {
        this.overlay = document.getElementById('chung-toc-luc-overlay');
        this.listView = document.getElementById('chung-toc-list-view');
        this.detailView = document.getElementById('chung-toc-detail-view');
        
        this.btnClose = document.getElementById('close-chung-toc-luc-btn');
        this.btnBack = document.getElementById('back-to-chung-toc-list-btn');
        
        this.elDetailIcon = document.getElementById('chung-toc-detail-icon');
        this.elDetailName = document.getElementById('chung-toc-detail-name');
        this.elDetailDesc = document.getElementById('chung-toc-detail-desc');
        this.elDetailStats = document.getElementById('chung-toc-detail-stats');
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
        state.ui.toggleOverlay('chung-toc-luc-overlay', true);
        this.showList();
    }

    close() {
        state.ui.toggleOverlay('chung-toc-luc-overlay', false);
    }

    showList() {
        this.listView.classList.remove('hidden');
        this.detailView.classList.add('hidden');
        this.renderList();
    }

    showDetail(race) {
        this.listView.classList.add('hidden');
        this.detailView.classList.remove('hidden');
        
        this.elDetailIcon.textContent = this.getRaceIcon(race.id);
        this.elDetailName.textContent = race.name;
        this.elDetailDesc.textContent = race.desc;
        
        // Render stats/bonuses
        this.elDetailStats.innerHTML = '';
        if (race.bonus) {
            Object.entries(race.bonus).forEach(([key, value]) => {
                const statRow = document.createElement('div');
                statRow.className = 'flex justify-between items-center text-xs py-1 border-b border-white/5';
                statRow.innerHTML = `
                    <span class="text-gray-500">${this.translateStat(key)}</span>
                    <span class="text-qi-jade font-mono">${value > 0 ? '+' : ''}${value}${this.isPercentage(key) ? '%' : ''}</span>
                `;
                this.elDetailStats.appendChild(statRow);
            });
        }

        const color = this.getRaceColor(race.id);
        this.elDetailIcon.style.color = color;
        this.elDetailIcon.style.filter = `drop-shadow(0 0 15px ${color}80)`;
    }

    getRaceIcon(id) {
        const icons = {
            'HUMAN': '👨‍👩‍👧‍👦',
            'DEMON': '👿',
            'SPIRIT_BEAST': '🦊',
            'DRAGON': '🐲'
        };
        return icons[id] || '👤';
    }

    getRaceColor(id) {
        const colors = {
            'HUMAN': '#60a5fa',
            'DEMON': '#ef4444',
            'SPIRIT_BEAST': '#34d399',
            'DRAGON': '#fbbf24'
        };
        return colors[id] || '#ffffff';
    }

    translateStat(stat) {
        const statsMap = {
            'tvps': 'Tốc Độ Tu Luyện',
            'soulExpSpeed': 'Tốc Độ Thần Thức',
            'atk': 'Công Kích',
            'def': 'Phòng Thủ',
            'karma': 'Khí Vận/Nghiệp Lực',
            'maxAge': 'Thọ Nguyên Thêm',
            'maxHp': 'Khí Huyết Tăng',
            'allRes': 'Kháng Tất Cả'
        };
        return statsMap[stat] || stat;
    }

    isPercentage(stat) {
        return ['allRes'].includes(stat);
    }

    buildCachedList() {
        if (this.cachedElements) return;
        this.cachedElements = [];
        
        Object.values(CREATION_RACES).forEach(race => {
            const el = document.createElement('div');
            el.className = 'group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl p-4 flex items-center space-x-4 cursor-pointer transition-all active:scale-95';
            
            const raceColor = this.getRaceColor(race.id);
            const raceIcon = this.getRaceIcon(race.id);
            
            el.innerHTML = `
                <div class="flex-none w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-2xl" style="color: ${raceColor}">
                    ${raceIcon}
                </div>
                <div class="flex-grow">
                    <h4 class="text-sm font-bold text-white group-hover:text-qi-blue transition-colors">${race.name}</h4>
                    <p class="text-[9px] text-gray-500 line-clamp-1">${race.desc}</p>
                </div>
                <i class="ph ph-caret-right text-gray-600 group-hover:text-white"></i>
            `;
            
            el.onclick = () => this.showDetail(race);
            this.cachedElements.push(el);
        });
    }

    renderList() {
        this.listView.innerHTML = '';
        this.buildCachedList();
        this.cachedElements.forEach(el => this.listView.appendChild(el));
    }
}
