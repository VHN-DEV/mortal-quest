import { state } from '../../state.js';
import { getSectById } from '../../configs/sect-data.js';
import { getTechniqueById } from '../../configs/technique-data.js';

/**
 * Quản lý giao diện chỉ số nhân vật, cảnh giới và các thông tin liên quan.
 */
export class CharacterScreen {
    constructor() {
        this.initElements();
    }

    initElements() {
        // Stats
        this.elCharHp = document.getElementById('char-hp');
        this.elCharAtk = document.getElementById('char-atk');
        this.elCharDef = document.getElementById('char-def');
        this.elCharSpd = document.getElementById('char-spd');
        this.elCharMana = document.getElementById('char-mana');
        this.elCharAge = document.getElementById('char-age');
        
        // Realms
        this.elCharRealmTuvi = document.getElementById('char-realm-tuvi');
        this.elCharRealmBody = document.getElementById('char-realm-body');
        this.elCharRealmSoul = document.getElementById('char-realm-soul');
        
        // Progress Bars
        this.elCharProgTuvi = document.getElementById('char-progress-tuvi');
        this.elCharProgBody = document.getElementById('char-progress-body');
        this.elCharProgSoul = document.getElementById('char-progress-soul');
        
        // Exp Texts
        this.elCharExpTuvi = document.getElementById('char-exp-tuvi');
        this.elCharExpBody = document.getElementById('char-exp-body');
        this.elCharExpSoul = document.getElementById('char-exp-soul');
        
        // Info
        this.elCharSectInfo = document.getElementById('char-sect-info');
        this.elRoot = document.getElementById('char-root');
        this.elPhysique = document.getElementById('char-physique');
        this.elLuck = document.getElementById('char-luck');
        
        // Techniques
        this.elMainTech = document.getElementById('char-main-technique');
        this.elMainBodyTech = document.getElementById('char-main-body-technique');
        this.elMainSoulTech = document.getElementById('char-main-soul-technique');
        
        // Lists
        this.elCharPartyList = document.getElementById('char-party-list');
        this.elFormationList = document.getElementById('active-formations-list');
    }

    render() {
        if (!state.player) return;

        // Render basic stats
        if (this.elCharHp) this.elCharHp.textContent = `${Math.floor(state.player.hp)} / ${Math.floor(state.player.maxHp)}`;
        if (this.elCharAtk) this.elCharAtk.textContent = Math.floor(state.player.atk);
        if (this.elCharDef) this.elCharDef.textContent = Math.floor(state.player.def);
        if (this.elCharSpd) this.elCharSpd.textContent = Math.floor(state.player.spd);
        if (this.elCharMana) this.elCharMana.textContent = `${Math.floor(state.player.mana)} / ${Math.floor(state.player.maxMana)}`;
        if (this.elCharAge) this.elCharAge.textContent = `${Math.floor(state.player.age)} / ${state.player.maxAge}`;

        // Render Realms & Progress
        const tuviRealm = state.player.getCurrentRealm('tuvi');
        const bodyRealm = state.player.getCurrentRealm('body');
        const soulRealm = state.player.getCurrentRealm('soul');

        if (this.elCharRealmTuvi) this.elCharRealmTuvi.textContent = tuviRealm.name;
        if (this.elCharRealmBody) this.elCharRealmBody.textContent = bodyRealm.name;
        if (this.elCharRealmSoul) this.elCharRealmSoul.textContent = soulRealm.name;

        if (this.elCharProgTuvi) this.elCharProgTuvi.style.width = `${Math.min(100, (state.player.tuVi / tuviRealm.expRequired) * 100)}%`;
        if (this.elCharProgBody) this.elCharProgBody.style.width = `${Math.min(100, (state.player.bodyExp / bodyRealm.expRequired) * 100)}%`;
        if (this.elCharProgSoul) this.elCharProgSoul.style.width = `${Math.min(100, (state.player.soulExp / soulRealm.expRequired) * 100)}%`;

        if (this.elCharExpTuvi) this.elCharExpTuvi.textContent = `${Math.floor(state.player.tuVi).toLocaleString()} / ${tuviRealm.expRequired.toLocaleString()}`;
        if (this.elCharExpBody) this.elCharExpBody.textContent = `${Math.floor(state.player.bodyExp).toLocaleString()} / ${bodyRealm.expRequired.toLocaleString()}`;
        if (this.elCharExpSoul) this.elCharExpSoul.textContent = `${Math.floor(state.player.soulExp).toLocaleString()} / ${soulRealm.expRequired.toLocaleString()}`;

        // Breakthrough Buttons
        document.querySelectorAll('.btn-bt-type').forEach(btn => {
            const type = btn.dataset.type;
            if (state.player.canBreakthrough(type).can) {
                btn.classList.add('animate-pulse');
                btn.style.opacity = '1';
            } else {
                btn.classList.remove('animate-pulse');
                btn.style.opacity = '0.5';
            }
        });

        // Sect Info
        if (this.elCharSectInfo) {
            if (state.player.sectId) {
                const sect = getSectById(state.player.sectId);
                this.elCharSectInfo.textContent = sect.name;
                this.elCharSectInfo.className = 'text-xs text-qi-blue font-bold';
            } else {
                this.elCharSectInfo.textContent = 'Chưa gia nhập';
                this.elCharSectInfo.className = 'text-xs italic text-gray-500';
            }
        }

        // Destiny Info
        if (this.elRoot && state.player.spiritualRoot) {
            this.elRoot.textContent = state.player.spiritualRoot.type;
            this.elRoot.style.color = state.player.spiritualRoot.color;
        }
        if (this.elPhysique) {
            this.elPhysique.textContent = state.player.physique ? state.player.physique.name : "Không";
        }
        if (this.elLuck) this.elLuck.textContent = state.player.luck;

        // Techniques
        this.renderTechniqueInfo(this.elMainTech, state.player.mainTechniqueId);
        this.renderTechniqueInfo(this.elMainBodyTech, state.player.mainBodyTechniqueId);
        this.renderTechniqueInfo(this.elMainSoulTech, state.player.mainSoulTechniqueId);

        // Party
        this.renderParty();

        // Formations
        this.renderFormations();
        
        // Energy (Qi)
        if (typeof window.game.renderEnergy === 'function') window.game.renderEnergy();
    }

    renderTechniqueInfo(element, techId) {
        if (!element) return;
        if (techId) {
            const tech = getTechniqueById(techId);
            const entry = state.player.learnedTechniques.find(t => t.id === techId);
            element.textContent = tech ? `${tech.name} (${entry?.stage || 1})` : "Không";
        } else {
            element.textContent = "Không";
        }
    }

    renderParty() {
        if (!this.elCharPartyList) return;
        if (state.player.party.length === 0) {
            this.elCharPartyList.innerHTML = '<div class="text-[9px] text-gray-600 italic">Chưa có đồng hành</div>';
        } else {
            this.elCharPartyList.innerHTML = state.player.party.map(npc => `
                <div class="flex justify-between items-center p-2 bg-white/5 border border-white/10 rounded-lg">
                    <div class="flex items-center space-x-2">
                        <img src="${npc.portrait}" class="w-6 h-6 rounded-full border border-cultivation-gold/30">
                        <div>
                            <div class="text-[10px] font-bold text-white">${npc.name}</div>
                            <div class="text-[8px] text-gray-400">${npc.role} - LV.${npc.realmId}</div>
                        </div>
                    </div>
                    <button onclick="window.game.removeFromParty('${npc.id}')" class="text-[8px] text-red-400 hover:text-red-300">RỜI ĐỘI</button>
                </div>
            `).join('');
        }
    }

    renderFormations() {
        if (!this.elFormationList) return;
        if (state.player.activeFormations.length === 0) {
            this.elFormationList.innerHTML = '<div class="text-[9px] text-gray-600 italic">Chưa có trận pháp nào</div>';
        } else {
            this.elFormationList.innerHTML = state.player.activeFormations.map(f => `
                <div class="flex justify-between items-center p-2 bg-qi-blue/5 border border-qi-blue/20 rounded-lg">
                    <div class="flex items-center space-x-2">
                        <i class="ph ph-scroll text-qi-blue text-xs"></i>
                        <div class="text-[10px] font-bold text-white">${f.name}</div>
                    </div>
                    <div class="text-[8px] text-gray-400">Đang hoạt động</div>
                </div>
            `).join('');
        }
    }
}
