import { state } from '../../state.js';
import { getItemById } from '../../configs/item-data.js';
import { getLocationById } from '../../configs/map-data.js';
import { ALCHEMY_CERTIFICATIONS, GUILD_MISSIONS, ALCHEMY_ROOMS } from '../../configs/guild-data.js';
import { TOWER_LEVELS } from '../../configs/tower-data.js';
import { MOUNTAIN_LAYERS, MOUNTAIN_TIERS } from '../../configs/mountain-data.js';

export class MountainController {
    constructor(parentScreen) {
        this.parentScreen = parentScreen;
    }

    get elGuildCerts() { return this.parentScreen.elGuildCerts; }
    get elGuildMissions() { return this.parentScreen.elGuildMissions; }
    get elGuildRooms() { return this.parentScreen.elGuildRooms; }

    renderGuild() {
        if (!state.player) return;
        
        const elCerts = this.elGuildCerts;
        if (elCerts) {
            elCerts.innerHTML = '';
            ALCHEMY_CERTIFICATIONS.forEach(cert => {
                const locked = state.player.alchemyLevel < cert.requirements.alchemyLevel;
                const el = document.createElement('div');
                el.className = 'p-4 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center';
                el.innerHTML = `
                    <div>
                        <h4 class="text-sm font-ancient text-white">${cert.name}</h4>
                        <p class="text-[10px] text-gray-500">Phí: ${cert.requirements.fee} LT | Cần luyện: ${cert.task.quantity} ${getItemById(cert.task.targetId)?.name || 'đan dược'}</p>
                    </div>
                    <button class="px-3 py-1.5 bg-qi-blue text-black text-[10px] font-bold rounded-lg ${locked ? 'opacity-50' : ''}" 
                        onclick="window.game.guildCertify(${cert.level})">KHẢO HẠCH</button>
                `;
                elCerts.appendChild(el);
            });
        }

        const elMissions = document.getElementById('guild-mission-list');
        if (elMissions) {
            elMissions.innerHTML = '';
            GUILD_MISSIONS.forEach(mission => {
                const el = document.createElement('div');
                el.className = 'p-4 border border-white/5 rounded-xl bg-white/5 space-y-2';
                el.innerHTML = `
                    <div class="flex justify-between items-center">
                        <h4 class="text-sm font-ancient text-white">${mission.name}</h4>
                        <button class="px-3 py-1 bg-qi-purple text-white text-[10px] font-bold rounded-lg" 
                            onclick="window.game.guildMission('${mission.id}')">GIAO NỘP</button>
                    </div>
                    <p class="text-[10px] text-gray-400 italic">${mission.description}</p>
                    <p class="text-[9px] text-cultivation-gold">Thưởng: ${mission.rewards.lingShi} LT | Danh vọng: ${mission.rewards.reputation}</p>
                `;
                elMissions.appendChild(el);
            });
        }

        const elRooms = document.getElementById('guild-room-list');
        if (elRooms) {
            elRooms.innerHTML = '';
            ALCHEMY_ROOMS.forEach(room => {
                const active = state.player.currentAlchemyRoom === room.id;
                const el = document.createElement('div');
                el.className = `p-4 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center ${active ? 'border-cultivation-gold' : ''}`;
                el.innerHTML = `
                    <div>
                        <h4 class="text-sm font-ancient text-white">${room.name} ${active ? '⭐' : ''}</h4>
                        <p class="text-[10px] text-gray-500">Phí thuê: ${room.fee} LT | Tăng ${room.successBonus * 100}% thành công</p>
                    </div>
                    <button class="px-3 py-1.5 ${active ? 'bg-gray-800' : 'bg-cultivation-gold'} text-black text-[10px] font-bold rounded-lg" 
                        onclick="window.game.guildRent('${room.id}')">${active ? 'ĐANG THUÊ' : 'THUÊ'}</button>
                `;
                elRooms.appendChild(el);
            });
        }
    }

    renderTower() {
        const elFloors = document.getElementById('tower-floor-list');
        if (!elFloors) return;
        elFloors.innerHTML = '';

        Object.values(TOWER_LEVELS).forEach(floor => {
            const locked = state.player.alchemyLevel < floor.minAlchemyLevel;
            const el = document.createElement('div');
            el.className = `p-6 border border-white/5 rounded-2xl bg-white/5 space-y-3 ${locked ? 'opacity-40' : 'hover:border-cultivation-gold/50 cursor-pointer'}`;
            el.innerHTML = `
                <div class="flex justify-between items-center">
                    <h4 class="text-lg font-ancient text-cultivation-gold">${floor.name}</h4>
                    ${locked ? `<span class="text-[8px] text-red-500 uppercase font-ancient">Cần Cấp ${floor.minAlchemyLevel}</span>` : '<i class="ph ph-caret-right text-gray-500"></i>'}
                </div>
                <p class="text-xs text-gray-400">${floor.description}</p>
            `;
            if (!locked) el.onclick = () => state.ui.toast(`Đang tiến vào ${floor.name}...`, "success");
            elFloors.appendChild(el);
        });
    }

    renderMountain() {
        const elLayerName = document.getElementById('mountain-layer-name');
        const elLayerDesc = document.getElementById('mountain-layer-desc');
        const elLayerProgText = document.getElementById('mountain-layer-progress-text');
        const elLayerProgBar = document.getElementById('mountain-layer-progress-bar');
        const elOxyText = document.getElementById('mountain-oxygen-text');
        const elOxyBar = document.getElementById('mountain-oxygen-bar');
        const elToxText = document.getElementById('mountain-toxicity-text');
        const elToxBar = document.getElementById('mountain-toxicity-bar');

        if (!state.player.mountainSurvival) return;

        const mSys = state.systems.mountain;
        const layer = MOUNTAIN_LAYERS.find(l => l.id === mSys.currentLayer);
        const tier = MOUNTAIN_TIERS.find(t => t.id === layer.tier);

        if (elLayerName) {
            const tierColor = {
                'ngoai_son': 'text-green-400',
                'trung_son': 'text-blue-400',
                'noi_son': 'text-purple-400',
                'cam_khu': 'text-red-500'
            }[layer.tier] || 'text-red-400';

            elLayerName.innerHTML = `<span class="text-[10px] block opacity-60 uppercase tracking-tighter">${tier.name}</span>${layer.name}`;
            elLayerName.className = `text-2xl font-ancient ${tierColor} mb-1`;
        }

        if (elLayerDesc) elLayerDesc.textContent = layer.description;

        // Progress display (Global Discovery for this layer)
        const discovery = mSys.discovery[mSys.currentLayer] || 0;
        if (elLayerProgText) elLayerProgText.textContent = `${Math.floor(mSys.layerProgress)}% (Khám phá: ${Math.floor(discovery)}%)`;
        if (elLayerProgBar) elLayerProgBar.style.width = `${mSys.layerProgress}%`;

        // Survival Bars
        if (elOxyText) elOxyText.textContent = `${Math.ceil(state.player.mountainSurvival.oxygen)}%`;
        if (elOxyBar) elOxyBar.style.width = `${state.player.mountainSurvival.oxygen}%`;
        if (elToxText) elToxText.textContent = `${Math.ceil(state.player.mountainSurvival.toxicity)}%`;
        if (elToxBar) elToxBar.style.width = `${state.player.mountainSurvival.toxicity}%`;

        // Boss Status Indicator (Optional UI update)
        const btnDeeper = document.getElementById('btn-mountain-deeper');
        if (btnDeeper) {
            const bossDefeated = mSys.bossDefeated[layer.tier];
            if (mSys.layerProgress >= 100 && !bossDefeated) {
                btnDeeper.innerHTML = `<span class="relative z-10 text-xs font-bold text-red-500 uppercase tracking-[0.2em] animate-pulse">KHIÊU CHIẾN THỦ LĨNH</span>`;
            } else {
                btnDeeper.innerHTML = `<span class="relative z-10 text-xs font-bold text-red-400 uppercase tracking-[0.2em]">TẦNG KẾ TIẾP</span>`;
            }
        }

        // Check if player is dying
        if (state.player.hp <= 0) {
            state.systems.mountain.stop();
            state.ui.toggleOverlay(document.getElementById('mountain-overlay'), false);
        }
    }

    renderEnergy() {
        if (!state.player) return;

        const elEnvList = document.getElementById('env-energy-list');
        const elEnvPurity = document.getElementById('env-purity-tag');
        if (elEnvList && state.currentLocId) {
            const loc = getLocationById(state.currentWorldId, state.currentLocId);
            if (loc && loc.energies) {
                if (elEnvPurity && loc.energies.length > 0) {
                    const purityId = loc.energies[0].purity || 'TINH_THUAN';
                    const purity = state.systems.energy.getPurity(purityId);
                    elEnvPurity.textContent = purity.name;
                }

                elEnvList.innerHTML = loc.energies.map(e => {
                    const type = state.systems.energy.getEnergyType(e.type);
                    return `
                        <div class="flex flex-col items-center space-y-1">
                            <span class="text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">${type.icon}</span>
                            <div class="flex flex-col items-center">
                                <span class="text-[9px] text-white font-mono font-bold">${e.concentration}%</span>
                                <span class="text-[7px] text-gray-500 font-ancient uppercase tracking-widest">${type.name}</span>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                elEnvList.innerHTML = '';
            }
        }

    }
}
