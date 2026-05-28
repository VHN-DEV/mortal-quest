import { state } from '../../state.js';
import { SaveSystem } from '../../core/save-system.js';
import { ASSETS } from '../../configs/asset-data.js';
import { findLocationName } from '../../configs/map-data.js';
import { Capacitor } from '@capacitor/core';

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
        const transferHtml = `
            <!-- Device Transfer Section -->
            <div class="flex items-center justify-between p-4 rounded-3xl border border-white/10 bg-white/5 space-x-4 mb-2 shrink-0">
                <div class="flex flex-col">
                    <span class="text-xs text-cultivation-gold font-ancient uppercase tracking-wider">Chuyển Thiết Bị</span>
                    <span class="text-[9px] text-gray-500 mt-0.5">Xuất/Nhập lưu trữ sang máy khác</span>
                </div>
                <div class="flex space-x-2">
                    <button id="btn-export-saves" 
                        class="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-cultivation-gold/10 border border-cultivation-gold/30 text-[10px] font-bold text-cultivation-gold hover:bg-cultivation-gold/20 active:scale-95 transition-all">
                        <i class="ph ph-export text-xs"></i>
                        <span>Xuất</span>
                    </button>
                    <button id="btn-import-saves" 
                        class="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-qi-blue/10 border border-qi-blue/30 text-[10px] font-bold text-qi-blue hover:bg-qi-blue/20 active:scale-95 transition-all">
                        <i class="ph ph-import text-xs"></i>
                        <span>Nhập</span>
                    </button>
                </div>
            </div>
        `;

        this.container.innerHTML = `
            <div class="flex flex-col h-full p-6 space-y-6">
                <!-- Header -->
                <div class="flex items-center justify-between shrink-0">
                    <button id="btn-save-back" class="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400">
                        <i class="ph ph-arrow-left text-xl"></i>
                    </button>
                    <h2 class="text-2xl font-charm text-cultivation-gold">Mệnh Đồ Lục</h2>
                    <button id="btn-delete-all-saves" 
                        class="w-10 h-10 flex items-center justify-center rounded-full bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 active:scale-90"
                        title="Xóa toàn bộ lưu trữ"
                        onclick="event.stopPropagation(); window.game.deleteAllSaves()">
                        <i class="ph ph-trash text-xl"></i>
                    </button>
                </div>

                ${transferHtml}

                <div class="flex-grow space-y-4 overflow-y-auto custom-scroll pb-10">
                    ${[1, 2, 3, 4, 5].map(slot => this.renderSlot(slot, metadata[slot])).join('')}
                </div>
                
                <!-- Hidden file input for import -->
                <input type="file" id="import-save-file" accept=".json" style="display: none;" />
            </div>
        `;

        this.container.classList.remove('hidden');
        this.bindEvents();
    }

    renderSlot(slot, data) {
        if (!data) {
            return `
                <div onclick="window.game.startNewAtSlot(${slot})" 
                    class="group relative p-8 rounded-3xl border border-dashed border-white/10 bg-white/5 hover:bg-cultivation-gold/5 hover:border-cultivation-gold/30 transition-all cursor-pointer overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-cultivation-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="relative flex flex-col items-center justify-center space-y-4 py-4">
                        <div class="w-14 h-14 rounded-2xl border border-dashed border-white/20 flex items-center justify-center text-gray-500 group-hover:text-cultivation-gold group-hover:border-cultivation-gold group-hover:scale-110 transition-all duration-500">
                            <i class="ph ph-plus-circle text-3xl"></i>
                        </div>
                        <div class="text-center">
                            <p class="text-xs font-ancient text-gray-400 uppercase tracking-[0.2em] group-hover:text-cultivation-gold transition-colors">Kết Nhân Quả Mới</p>
                            <p class="text-[9px] text-gray-600 mt-1 uppercase tracking-widest">Ô Lưu Số ${slot}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        const portraitUrl = ASSETS.portraits[data.avatar] || ASSETS.portraits['player_male'];
        const playTimeFormatted = this.formatPlayTime(data.playTime || 0);

        return `
            <div class="relative group" id="save-slot-${slot}">
                <div onclick="window.game.loadSlot(${slot})" 
                    class="relative p-5 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-transparent to-black/40 hover:border-cultivation-gold/50 transition-all cursor-pointer active:scale-[0.98] overflow-hidden">
                    
                    <!-- Background Glow -->
                    <div class="absolute top-0 right-0 w-32 h-32 bg-cultivation-gold/5 blur-[40px] rounded-full -mr-16 -mt-16 pointer-events-none"></div>

                    <div class="flex items-center space-x-5">
                        <!-- Avatar Section -->
                        <div class="relative shrink-0">
                            <div class="w-20 h-20 rounded-2xl border border-cultivation-gold/30 overflow-hidden shadow-2xl relative z-10 bg-black/60">
                                <img src="${portraitUrl}" class="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700">
                            </div>
                            <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-cultivation-gold text-black rounded-lg flex items-center justify-center font-bold text-xs shadow-lg z-20 font-mono">
                                ${slot}
                            </div>
                        </div>

                        <!-- Info Section -->
                        <div class="flex-grow min-w-0 space-y-3">
                            <div class="flex flex-col items-start">
                                <h3 class="text-xl font-ancient text-white truncate drop-shadow-md">${data.name}</h3>
                                <div class="bg-cultivation-gold/10 px-1 rounded border border-cultivation-gold/30">
                                    <span class="text-[9px] text-cultivation-gold font-bold uppercase tracking-widest leading-none">${data.realm}</span>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div class="flex items-center space-x-2 text-gray-400 bg-white/5 px-2 py-2 rounded-lg border border-white/5">
                                    <i class="ph ph-hourglass text-cultivation-gold/60 text-[10px]"></i>
                                    <div class="flex w-100 justify-between">
                                        <span class="text-[7px] uppercase tracking-tighter text-gray-500">Tuổi</span>
                                        <span class="text-[10px] text-white font-mono leading-none">${data.age}</span>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-2 text-gray-400 bg-white/5 px-2 py-2 rounded-lg border border-white/5">
                                    <i class="ph ph-clock-counter-clockwise text-qi-blue/60 text-[10px]"></i>
                                    <div class="flex w-100 justify-between">
                                        <span class="text-[7px] uppercase tracking-tighter text-gray-500">Thời gian</span>
                                        <span class="text-[10px] text-white font-mono leading-none">${playTimeFormatted}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex items-center space-x-2 text-gray-400 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                                <i class="ph ph-map-pin-line text-qi-jade/70"></i>
                                <span class="text-[10px] text-gray-300 truncate font-ancient tracking-wider uppercase">${findLocationName(data.area)}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                        <div class="flex items-center text-[9px] text-gray-600 font-mono">
                             <i class="ph ph-calendar-blank mr-1.5"></i>
                             <span>${this.formatDate(data.updatedAt)}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                             ${data.title ? `<span class="px-2 py-0.5 bg-qi-purple/20 text-qi-purple rounded-lg border border-qi-purple/30 text-[8px] uppercase tracking-widest font-bold">${data.title}</span>` : ''}
                        </div>
                    </div>
                </div>

                <!-- Action Menu Button -->
                <button class="btn-save-menu absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-cultivation-gold hover:bg-cultivation-gold/10 rounded-2xl transition-all active:scale-90"
                        onclick="event.stopPropagation(); window.game.showSaveMenu(${slot})">
                    <i class="ph ph-dots-three-circle-vertical text-2xl"></i>
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

        const btnExport = document.getElementById('btn-export-saves');
        if (btnExport) {
            btnExport.onclick = (e) => {
                e.stopPropagation();
                window.game.exportSaves();
            };
        }

        const btnImport = document.getElementById('btn-import-saves');
        if (btnImport) {
            btnImport.onclick = (e) => {
                e.stopPropagation();
                window.game.importSaves();
            };
        }

        const fileInput = document.getElementById('import-save-file');
        if (fileInput) {
            fileInput.onchange = async (e) => {
                const file = e.target.files[0];
                const targetSlot = fileInput.dataset.targetSlot ? parseInt(fileInput.dataset.targetSlot, 10) : null;
                if (file) {
                    const reader = new FileReader();
                    reader.onload = async (evt) => {
                        try {
                            const data = JSON.parse(evt.target.result);
                            await window.game.importSavesData(data, targetSlot);
                            // Reset input
                            fileInput.value = '';
                            delete fileInput.dataset.targetSlot;
                        } catch (err) {
                            state.ui.toast('Lỗi đọc file: Định dạng JSON không hợp lệ', 'error');
                        }
                    };
                    reader.readAsText(file);
                }
            };
        }
    }
}
