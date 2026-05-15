import { state } from '../../state.js';

/**
 * Giao diện Bảng Nhiệm Vụ Tông Môn
 */
export class MissionScreen {
    constructor() {
        this.initElements();
        this.initEvents();
    }

    initElements() {
        this.el = document.getElementById('mission-screen');
        this.elList = document.getElementById('mission-list');
        this.btnClose = document.getElementById('btn-close-mission');
        this.btnRefresh = document.getElementById('btn-refresh-mission');
    }

    initEvents() {
        if (this.btnClose) {
            this.btnClose.onclick = () => this.close();
        }
        if (this.btnRefresh) {
            this.btnRefresh.onclick = () => {
                state.systems.mission.refreshMissions();
                this.render();
                state.ui.toast("Đã làm mới bảng nhiệm vụ", "success");
            };
        }
    }

    open() {
        state.ui.toggleOverlay(this.el, true);
        this.render();
    }

    close() {
        state.ui.toggleOverlay(this.el, false);
    }

    render() {
        if (!this.elList || !state.systems.mission) return;

        this.elList.innerHTML = '';
        const missions = state.systems.mission.missions;

        if (missions.length === 0) {
            this.elList.innerHTML = '<div class="text-center text-gray-500 py-10 italic">Hiện không có nhiệm vụ nào khả dụng...</div>';
            return;
        }

        missions.forEach(mission => {
            const card = document.createElement('div');
            const isActive = mission.status === 'active';
            const isReady = isActive && mission.progress >= mission.target;
            
            card.className = `mission-card p-4 rounded-xl border mb-3 transition-all ${isActive ? 'bg-qi-blue/5 border-qi-blue/30' : 'bg-white/5 border-white/10 hover:border-white/30'}`;
            
            const progressPercent = (mission.progress / mission.target) * 100;

            card.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="text-lg font-bold text-qi-blue font-ancient">${mission.title}</h3>
                        <p class="text-xs text-gray-400 mt-1">${mission.description}</p>
                    </div>
                    <div class="text-right">
                        <span class="text-qi-jade font-mono text-sm">${mission.reward.toLocaleString()} <i class="ph ph-coins"></i></span>
                    </div>
                </div>
                
                ${isActive ? `
                    <div class="mt-4">
                        <div class="flex justify-between text-[10px] mb-1">
                            <span class="text-gray-500">Tiến độ</span>
                            <span class="text-white">${mission.progress}/${mission.target}</span>
                        </div>
                        <div class="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                            <div class="h-full bg-qi-blue transition-all duration-500" style="width: ${progressPercent}%"></div>
                        </div>
                    </div>
                ` : ''}

                <div class="mt-4 flex justify-end">
                    ${!isActive ? `
                        <button class="btn-accept px-4 py-1 bg-qi-blue/20 border border-qi-blue/50 rounded-full text-xs hover:bg-qi-blue/40 transition-all">NHẬN NHIỆM VỤ</button>
                    ` : (isReady ? `
                        <button class="btn-complete px-4 py-1 bg-qi-jade/20 border border-qi-jade/50 rounded-full text-xs text-qi-jade hover:bg-qi-jade/40 transition-all animate-pulse">HOÀN THÀNH</button>
                    ` : `
                        <button class="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-500 cursor-not-allowed">ĐANG THỰC HIỆN</button>
                    `)}
                </div>
            `;

            // Event Listeners
            const btnAccept = card.querySelector('.btn-accept');
            if (btnAccept) {
                btnAccept.onclick = () => {
                    state.systems.mission.acceptMission(mission.id);
                    this.render();
                };
            }

            const btnComplete = card.querySelector('.btn-complete');
            if (btnComplete) {
                btnComplete.onclick = () => {
                    state.systems.mission.completeMission(mission.id);
                    this.render();
                };
            }

            this.elList.appendChild(card);
        });
    }
}
