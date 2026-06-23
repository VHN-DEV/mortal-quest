import { state } from '../../state.js';
import { getLocationById, findWorldIdByLocId } from '../../configs/map-data.js';
import { getItemById } from '../../configs/item-data.js';
import { SEEDS, FIELD_GRADES, FIELD_ATTRIBUTES } from '../../configs/garden-data.js';

export class DongPhuScreen {
    constructor() {
        this.activeLocationId = null;
        this.activeTab = 'garden'; // 'garden' | 'formation' | 'puppet'
        
        this.initElements();
    }

    initElements() {
        this.overlay = document.getElementById('dong-phu-overlay');
        this.elTitle = document.getElementById('dong-phu-title');
        this.elLocText = document.getElementById('dong-phu-loc-text');
        this.elContent = document.getElementById('dong-phu-content');
        
        // Views
        this.viewGarden = document.getElementById('dong-phu-garden-view');
        this.viewFormation = document.getElementById('dong-phu-formation-view');
        this.viewPuppet = document.getElementById('dong-phu-puppet-view');
        
        // Tabs
        this.tabGarden = document.getElementById('dong-phu-tab-garden');
        this.tabFormation = document.getElementById('dong-phu-tab-formation');
        this.tabPuppet = document.getElementById('dong-phu-tab-puppet');

        // Dynamic Sub-Containers
        this.elGardenPlots = document.getElementById('dong-phu-garden-plots');
        this.elFormationStatus = document.getElementById('dong-phu-formation-status');
        this.elFormationsList = document.getElementById('dong-phu-formations-list');
        this.elDeployedPuppets = document.getElementById('dong-phu-deployed-puppets');
        this.elPuppetsList = document.getElementById('dong-phu-puppets-list');
        
        // Footer elements
        this.elSpiritualQi = document.getElementById('dong-phu-spiritual-qi');
        this.elDefenseRating = document.getElementById('dong-phu-defense-rating');
    }

    open(locationId) {
        this.activeLocationId = locationId;
        this.activeTab = 'garden';
        state.ui.toggleOverlay(this.overlay, true);
        this.render();
    }

    setTab(tab) {
        this.activeTab = tab;
        
        // Update tabs styling
        const activeClass = "flex-grow py-2.5 bg-qi-jade/10 text-qi-jade border border-qi-jade/20 rounded-xl text-[9px] font-ancient uppercase tracking-wider font-bold transition-all";
        const inactiveClass = "flex-grow py-2.5 text-gray-500 rounded-xl text-[9px] font-ancient uppercase tracking-wider font-bold transition-all";
        
        this.tabGarden.className = tab === 'garden' ? activeClass : inactiveClass;
        this.tabFormation.className = tab === 'formation' ? activeClass : inactiveClass;
        this.tabPuppet.className = tab === 'puppet' ? activeClass : inactiveClass;
        
        // Toggle views
        this.viewGarden.classList.toggle('hidden', tab !== 'garden');
        this.viewFormation.classList.toggle('hidden', tab !== 'formation');
        this.viewPuppet.classList.toggle('hidden', tab !== 'puppet');
        
        this.render();
    }

    render() {
        if (!state.player || !this.activeLocationId) return;

        const abode = state.player.abodes.find(a => a.locationId === this.activeLocationId);
        if (!abode) {
            state.ui.toggleOverlay(this.overlay, false);
            return;
        }

        const worldId = findWorldIdByLocId(this.activeLocationId) || state.currentWorldId || 'nhan_gioi';
        const loc = getLocationById(worldId, this.activeLocationId);
        const locName = loc ? loc.name : 'Vô Danh';
        
        // Update Title & Location Text
        if (this.elTitle) this.elTitle.textContent = abode.name || `Động Phủ ${locName}`;
        if (this.elLocText) this.elLocText.textContent = locName;

        // Footer Info
        if (this.elSpiritualQi) {
            let qiText = 'Bình Thường';
            if (loc?.danger === 'trung_cap') qiText = 'Khá Tốt';
            if (loc?.danger === 'nguy_hiem') qiText = 'Phong Phú';
            this.elSpiritualQi.textContent = qiText;
        }
        if (this.elDefenseRating) {
            const defensePower = state.systems.dongPhu ? state.systems.dongPhu.getAbodeDefensePower(abode) : 0;
            this.elDefenseRating.textContent = defensePower.toLocaleString();
        }

        // Render Active Tab Content
        if (this.activeTab === 'garden') {
            this.renderGarden(abode);
        } else if (this.activeTab === 'formation') {
            this.renderFormation(abode);
        } else if (this.activeTab === 'puppet') {
            this.renderPuppet(abode);
        }
    }

    renderGarden(abode) {
        if (!this.elGardenPlots) return;
        this.elGardenPlots.innerHTML = '';

        abode.gardenPlots.forEach((plot, index) => {
            const el = document.createElement('div');
            const gradeInfo = FIELD_GRADES[plot.grade] || FIELD_GRADES.PHAM;
            const attrInfo = FIELD_ATTRIBUTES[plot.attribute] || FIELD_ATTRIBUTES.NORMAL;

            el.className = `p-4 border rounded-3xl bg-white/5 flex flex-col space-y-4 transition-all hover:border-qi-jade/30 border-white/5 relative overflow-hidden`;

            // Background attribute icon
            const bgIcon = document.createElement('div');
            bgIcon.className = 'absolute -right-2 -bottom-2 text-4xl opacity-5 pointer-events-none';
            bgIcon.textContent = attrInfo.icon;
            el.appendChild(bgIcon);

            let contentHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center space-x-2">
                            <span class="text-[9px] px-2 py-0.5 rounded-full border bg-white/5 text-gray-400 border-white/10 uppercase font-bold">${gradeInfo.name}</span>
                            <span class="text-[9px] px-2 py-0.5 rounded-full border bg-white/5 border-white/10 uppercase font-bold" style="color: ${attrInfo.color}">${attrInfo.icon} ${attrInfo.name}</span>
                        </div>
                    </div>
                    <button class="p-1.5 hover:bg-white/10 rounded-full transition-colors" onclick="window.game.showFieldMenu(${index})">
                        <i class="ph ph-gear text-gray-500 text-xs"></i>
                    </button>
                </div>
            `;

            if (plot.seedId) {
                const seed = SEEDS.find(s => s.id === plot.seedId);
                const herbItem = getItemById(seed?.herbId);

                contentHTML += `
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/10 flex-shrink-0">
                            ${herbItem?.icon || '🌱'}
                        </div>
                        <div class="flex-grow min-w-0">
                            <h4 class="text-xs font-ancient text-white truncate">${seed?.name || 'Linh Thảo'}</h4>
                            <div class="flex items-center space-x-2 mt-1 flex-wrap gap-1">
                                <span class="text-[9px] px-1.5 py-0.5 rounded bg-qi-jade/10 text-qi-jade font-bold">${plot.stage}</span>
                                <span class="text-[9px] text-gray-400 font-bold">${Math.floor(plot.age)} năm</span>
                            </div>
                        </div>
                        <div class="flex flex-col space-y-1 flex-shrink-0">
                            <button class="px-2 py-1 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 active:scale-95 text-[9px] font-bold rounded-xl border border-purple-500/20 transition-all" onclick="window.game.useSpiritualLiquid(${index})">🧪 LINH DỊCH</button>
                            <button class="px-2 py-1 bg-qi-jade/10 text-qi-jade hover:bg-qi-jade/20 active:scale-95 text-[9px] font-bold rounded-xl border border-qi-jade/20 transition-all" onclick="window.game.harvest(${index})">THU HOẠCH</button>
                        </div>
                    </div>
                `;
            } else {
                contentHTML += `
                    <div class="flex flex-col items-center justify-center py-4 space-y-3">
                        <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                            <i class="ph ph-plus text-gray-600"></i>
                        </div>
                        <button class="px-6 py-2 bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] font-bold rounded-xl border border-white/10 transition-all" onclick="window.game.showPlantMenu(${index})">GIEO HẠT</button>
                    </div>
                `;
            }

            el.innerHTML += contentHTML;
            this.elGardenPlots.appendChild(el);
        });
    }

    renderFormation(abode) {
        if (!this.elFormationStatus || !this.elFormationsList) return;
        this.elFormationStatus.innerHTML = '';
        this.elFormationsList.innerHTML = '';

        // Active Formation Card
        if (abode.defensiveFormation) {
            const form = abode.defensiveFormation;
            const itemData = getItemById(form.id);
            this.elFormationStatus.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <span class="text-3xl">${itemData?.icon || '🏯'}</span>
                        <div>
                            <h4 class="text-xs font-bold text-white uppercase tracking-wider">${form.name}</h4>
                            <span class="text-[9px] text-qi-jade block font-semibold mt-0.5">Sức mạnh Hộ Phủ: +${form.stats?.formationPower || 200}</span>
                        </div>
                    </div>
                    <button class="px-3.5 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl border border-red-500/20 text-[9px] font-bold tracking-widest transition-all"
                        onclick="window.game.undeployFormation('${this.activeLocationId}')">THU HỒI</button>
                </div>
            `;
        } else {
            this.elFormationStatus.innerHTML = `
                <div class="flex flex-col items-center justify-center py-6 space-y-2">
                    <span class="text-3xl opacity-30">🏯</span>
                    <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Chưa Triển Khai Trận Pháp Hộ Sơn</span>
                    <span class="text-[8px] text-gray-600 text-center max-w-xs">Động Phủ không có Trận Pháp bảo hộ sẽ dễ bị đạo tặc hoặc yêu thú công phá, cướp đoạt tài nguyên!</span>
                </div>
            `;
        }

        // Available Formations in inventory
        const diagrams = state.player.inventory.allItems.filter(i => {
            return i.id.startsWith('tran_do_') || i.id === 'thai_cuc_huyen_tran_do';
        });

        if (diagrams.length === 0) {
            this.elFormationsList.innerHTML = `
                <div class="text-center py-6 text-gray-600 italic text-[10px]">Túi đồ không có trận đồ nào...</div>
            `;
        } else {
            diagrams.forEach(diag => {
                const itemData = getItemById(diag.id);
                const power = state.systems.dongPhu ? state.systems.dongPhu._getFormationPower(diag.id) : 200;
                const el = document.createElement('div');
                el.className = 'p-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all';
                el.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <span class="text-2xl">${itemData?.icon || '📜'}</span>
                        <div>
                            <div class="text-xs font-bold text-white">${itemData?.name || diag.id}</div>
                            <div class="text-[8px] text-gray-500 font-semibold mt-0.5">Sức phòng thủ: +${power} | Số lượng: ${diag.quantity}</div>
                        </div>
                    </div>
                    <button class="px-3 py-1.5 bg-qi-blue/10 text-qi-blue hover:bg-qi-blue/20 rounded-xl border border-qi-blue/20 text-[9px] font-bold tracking-widest transition-all"
                        onclick="window.game.deployFormation('${this.activeLocationId}', '${diag.id}')">KÍCH HOẠT</button>
                </div>
                `;
                this.elFormationsList.appendChild(el);
            });
        }
    }

    renderPuppet(abode) {
        if (!this.elDeployedPuppets || !this.elPuppetsList) return;
        this.elDeployedPuppets.innerHTML = '';
        this.elPuppetsList.innerHTML = '';

        // Deployed Puppets
        if (!abode.puppets || abode.puppets.length === 0) {
            this.elDeployedPuppets.innerHTML = `
                <div class="p-6 border rounded-3xl bg-white/5 border-white/5 flex flex-col items-center justify-center space-y-2">
                    <span class="text-3xl opacity-30">🤖</span>
                    <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Chưa Bố Trí Khôi Lỗi Trấn Thủ</span>
                    <span class="text-[8px] text-gray-600 text-center max-w-xs">Triển khai tối đa 3 Khôi Lỗi phòng thủ để hỗ trợ bảo hộ Động Phủ!</span>
                </div>
            `;
        } else {
            abode.puppets.forEach(p => {
                const el = document.createElement('div');
                el.className = 'p-4 bg-white/5 border border-white/5 rounded-3xl flex flex-col space-y-3';
                
                const durabilityPercent = Math.floor((p.metadata.durability / p.metadata.maxDurability) * 100);
                const atk = p.metadata.stats?.atk || 0;
                const def = p.metadata.stats?.def || 0;
                const totalStats = atk + def;

                el.innerHTML = `
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2.5">
                            <span class="text-2xl">🤖</span>
                            <div>
                                <h4 class="text-xs font-bold text-white">${p.metadata.name}</h4>
                                <span class="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-cultivation-gold border border-white/10 font-bold uppercase tracking-wide inline-block mt-0.5">${p.metadata.quality}</span>
                            </div>
                        </div>
                        <button class="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl border border-red-500/20 text-[9px] font-bold tracking-widest transition-all"
                            onclick="window.game.undeployPuppet('${this.activeLocationId}', '${p.metadata.uniqueId}')">THU HỒI</button>
                    </div>

                    <!-- Durability Bar -->
                    <div class="space-y-1">
                        <div class="flex justify-between text-[8px] text-gray-500 font-semibold">
                            <span>Độ Bền</span>
                            <span class="${durabilityPercent <= 20 ? 'text-red-500 animate-pulse' : 'text-gray-400'}">${Math.floor(p.metadata.durability)} / ${p.metadata.maxDurability}</span>
                        </div>
                        <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div class="h-full ${durabilityPercent <= 20 ? 'bg-red-500' : 'bg-qi-jade'}" style="width: ${durabilityPercent}%"></div>
                        </div>
                    </div>

                    <!-- Puppet Stats -->
                    <div class="grid grid-cols-2 gap-2 bg-black/30 p-2 rounded-xl text-center border border-white/5">
                        <div>
                            <span class="text-[7px] text-gray-500 block uppercase font-bold">Lực Tấn Công</span>
                            <span class="text-[10px] text-red-400 font-mono font-bold">${atk}</span>
                        </div>
                        <div>
                            <span class="text-[7px] text-gray-500 block uppercase font-bold">Lực Phòng Thủ</span>
                            <span class="text-[10px] text-qi-blue font-mono font-bold">${def}</span>
                        </div>
                    </div>
                `;
                this.elDeployedPuppets.appendChild(el);
            });
        }

        // Available Puppets in inventory
        const puppetsInInv = state.player.inventory.allItems.filter(i => i.id === 'khoi_loi' && i.metadata && !i.metadata.deployed);

        if (puppetsInInv.length === 0) {
            this.elPuppetsList.innerHTML = `
                <div class="text-center py-6 text-gray-600 italic text-[10px]">Túi đồ không có khôi lỗi nhàn rỗi...</div>
            `;
        } else {
            puppetsInInv.forEach(p => {
                const el = document.createElement('div');
                el.className = 'p-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all';
                const atk = p.metadata.stats?.atk || 0;
                const def = p.metadata.stats?.def || 0;
                
                el.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <span class="text-2xl">🤖</span>
                        <div>
                            <div class="text-xs font-bold text-white">${p.metadata.name} (${p.metadata.quality})</div>
                            <div class="text-[8px] text-gray-500 font-semibold mt-0.5">Công: ${atk} | Thủ: ${def} | Độ bền: ${Math.floor(p.metadata.durability)}%</div>
                        </div>
                    </div>
                    <button class="px-3 py-1.5 bg-qi-blue/10 text-qi-blue hover:bg-qi-blue/20 rounded-xl border border-qi-blue/20 text-[9px] font-bold tracking-widest transition-all"
                        onclick="window.game.deployPuppet('${this.activeLocationId}', '${p.metadata.uniqueId}')">BỐ TRÍ</button>
                `;
                this.elPuppetsList.appendChild(el);
            });
        }
    }
}
