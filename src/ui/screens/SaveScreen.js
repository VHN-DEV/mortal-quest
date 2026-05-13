import { state } from '../../state.js';
import { SaveSystem } from '../../core/save-system.js';
import { ASSETS } from '../../configs/asset-data.js';

export class SaveScreen {
    constructor() {
        this.container = document.getElementById('screen-save');
        this.init();
    }

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'screen-save';
            this.container.className = 'screen hidden flex flex-col h-full z-[210] bg-qi-ink overflow-hidden';
            document.querySelector('main').appendChild(this.container);
        }
    }

    async render() {
        const metadata = await SaveSystem.getAllMetadata();
        
        this.container.innerHTML = `
            <div class="flex flex-col h-full p-6 space-y-8">
                <!-- Header -->
                <div class="flex items-center justify-between">
                    <button id="btn-save-back" class="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400">
                        <i class="ph ph-arrow-left text-xl"></i>
                    </button>
                    <h2 class="text-2xl font-charm text-cultivation-gold">Mệnh Đồ Lục</h2>
                    <div class="w-10"></div>
                </div>

                <div class="flex-grow space-y-4 overflow-y-auto custom-scroll pb-10">
                    ${[1, 2, 3].map(slot => this.renderSlot(slot, metadata[slot])).join('')}
                </div>
            </div>
        `;

        this.container.classList.remove('hidden');
        this.bindEvents();
    }

    renderSlot(slot, data) {
        if (!data) {
            return `
                <div onclick="window.game.startNewAtSlot(${slot})" 
                    class="group relative p-6 rounded-3xl border border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-cultivation-gold/30 transition-all cursor-pointer">
                    <div class="flex flex-col items-center justify-center space-y-3 py-6">
                        <div class="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-gray-500 group-hover:text-cultivation-gold group-hover:scale-110 transition-all">
                            <i class="ph ph-plus text-2xl"></i>
                        </div>
                        <p class="text-[10px] font-ancient text-gray-500 uppercase tracking-widest">Khởi đầu hành trình mới</p>
                    </div>
                </div>
            `;
        }

        const portraitUrl = ASSETS.portraits[data.avatar] || ASSETS.portraits['player_male'];
        const playTimeFormatted = this.formatPlayTime(data.playTime || 0);

        return `
            <div class="relative group" id="save-slot-${slot}">
                <div onclick="window.game.loadSlot(${slot})" 
                    class="relative p-5 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent hover:border-cultivation-gold/50 transition-all cursor-pointer active:scale-[0.98]">
                    <div class="flex items-start space-x-4">
                        <div class="w-16 h-16 rounded-2xl border border-cultivation-gold/30 overflow-hidden shrink-0 shadow-lg">
                            <img src="${portraitUrl}" class="w-full h-full object-cover">
                        </div>
                        <div class="flex-grow min-w-0">
                            <div class="flex justify-between items-start">
                                <h3 class="text-lg font-ancient text-white truncate">${data.name}</h3>
                                <span class="text-[9px] text-cultivation-gold font-bold uppercase tracking-tighter">${data.realm}</span>
                            </div>
                            <div class="grid grid-cols-2 gap-y-1 mt-2 text-[9px] text-gray-400 font-ancient uppercase tracking-widest">
                                <div>Tuổi: <span class="text-white">${data.age}</span></div>
                                <div>Thời gian: <span class="text-white">${playTimeFormatted}</span></div>
                                <div class="col-span-2 flex items-center">
                                    <i class="ph ph-map-pin mr-1 text-qi-blue"></i>
                                    <span class="text-white truncate">${data.area}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer / Progress Meta -->
                    <div class="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[8px] text-gray-500">
                        <span>Lưu lần cuối: ${this.formatDate(data.updatedAt)}</span>
                        <div class="flex items-center space-x-2">
                             ${data.title ? `<span class="px-2 py-0.5 bg-qi-purple/20 text-qi-purple rounded-full border border-qi-purple/30">${data.title}</span>` : ''}
                        </div>
                    </div>
                </div>

                <!-- Context Menu Button -->
                <button class="btn-save-menu absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white"
                        onclick="event.stopPropagation(); window.game.showSaveMenu(${slot})">
                    <i class="ph ph-dots-three-vertical-bold text-xl"></i>
                </button>
            </div>
        `;
    }

    formatPlayTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    }

    formatDate(timestamp) {
        if (!timestamp) return 'Không rõ';
        const date = new Date(timestamp);
        return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    bindEvents() {
        const btnBack = document.getElementById('btn-save-back');
        if (btnBack) {
            btnBack.onclick = () => {
                state.ui.switchScreen('screen-start');
            };
        }
    }
}
