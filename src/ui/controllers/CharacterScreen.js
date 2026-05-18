import { state } from '../../state.js';
import { getSectById } from '../../configs/sect-data.js';
import { getTechniqueById, MASTERY_LEVELS } from '../../configs/technique-data.js';
import { getPhysiqueById, PHYSIQUE_GRADES, PHYSIQUE_STAGES } from '../../configs/physique-data.js';
import { RACE_DATA } from '../../configs/realm-data.js';
import { TITLES } from '../../configs/fate-data.js';

/**
 * Quản lý giao diện chỉ số nhân vật, cảnh giới và các thông tin liên quan.
 */
export class CharacterScreen {
    constructor() {
        this.initElements();
        this.initEvents();
    }

    initElements() {
        // Stats
        this.elCharHp = document.getElementById('char-hp');
        this.elCharAtk = document.getElementById('char-atk');
        this.elCharDef = document.getElementById('char-def');
        this.elCharSpd = document.getElementById('char-spd');
        this.elCharMana = document.getElementById('char-mana');
        this.elCharAge = document.getElementById('char-age');
        this.elCharRemainingAge = document.getElementById('char-remaining-age-container');
        this.elCharStability = document.getElementById('char-stability');
        this.elCharComprehension = document.getElementById('char-comprehension');
        
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
        this.elCharRace = document.getElementById('char-race');
        this.elCharGender = document.getElementById('char-gender');
        this.elCharTitle = document.getElementById('char-title');
        this.elCharDestinyRating = document.getElementById('char-destiny-rating');
        this.elRootName = document.getElementById('char-root-name');
        this.elRootElements = document.getElementById('char-root-elements');
        this.elRootPurity = document.getElementById('char-root-purity');
        this.elPhysique = document.getElementById('char-physique');
        this.elLuck = document.getElementById('char-luck');
        
        // Techniques
        this.elMainTech = document.getElementById('char-main-technique');
        this.elMainBodyTech = document.getElementById('char-main-body-technique');
        this.elMainSoulTech = document.getElementById('char-main-soul-technique');
        
        // Lists
        this.elCharPartyList = document.getElementById('char-party-list');
        this.elFormationList = document.getElementById('active-formations-list');
        this.elCharAdvancedStats = document.getElementById('char-advanced-stats');
        this.elSpecializedPaths = document.getElementById('char-specialized-paths');
        this.elCharTalentsList = document.getElementById('char-talents-list');
    }
    
    initEvents() {
        const btnSaveExit = document.getElementById('btn-save-exit');
        if (btnSaveExit) {
            btnSaveExit.onclick = async () => {
                if (window.game && window.game.saveAndExit) {
                    await window.game.saveAndExit();
                }
            };
        }
    }

    render() {
        if (!state.player) return;

        // Render basic stats
        // Render basic stats with safety checks for NaN
        if (this.elCharHp) {
            const hp = state.player.hp || 0;
            const maxHp = state.player.maxHp || 100;
            this.elCharHp.textContent = `${Math.floor(hp)} / ${Math.floor(maxHp)}`;
        }
        
        if (this.elCharAtk) {
            const base = Math.floor(state.player.baseStats.atk || 0);
            const bonus = Math.floor(state.player.bonusStats.atk || 0);
            this.elCharAtk.innerHTML = `${base} <span class="text-[8px] opacity-60 ml-1">(+${bonus})</span>`;
        }
        
        if (this.elCharDef) {
            const base = Math.floor(state.player.baseStats.def || 0);
            const bonus = Math.floor(state.player.bonusStats.def || 0);
            this.elCharDef.innerHTML = `${base} <span class="text-[8px] opacity-60 ml-1">(+${bonus})</span>`;
        }
        
        if (this.elCharSpd) {
            const base = Math.floor(state.player.baseStats.spd || 0);
            const bonus = Math.floor(state.player.bonusStats.spd || 0);
            this.elCharSpd.innerHTML = `${base} <span class="text-[8px] opacity-60 ml-1">(+${bonus})</span>`;
        }

        if (this.elCharMana) {
            const mana = state.player.mana || 0;
            const maxMana = state.player.maxMana || 50;
            this.elCharMana.textContent = `${Math.floor(mana)} / ${Math.floor(maxMana)}`;
        }

        // Render Age & Lifespan combined
        const playerAge = state.player.age || 0;
        const maxAge = state.player.maxAge || 100;
        const remaining = Math.max(0, maxAge - Math.floor(playerAge));
        
        if (this.elCharAge) {
            this.elCharAge.textContent = `${Math.floor(playerAge)} / ${maxAge}`;
        }
        
        if (this.elCharRemainingAge) {
            const colorClass = remaining < 10 ? 'text-red-500 animate-pulse' : (remaining < 50 ? 'text-cultivation-gold' : 'text-gray-400');
            this.elCharRemainingAge.innerHTML = `
                <span class="text-[8px] ${colorClass} opacity-80">(Còn ${remaining} năm)</span>
            `;
        }

        if (this.elCharStability) {
            const stability = state.player.stability || 100;
            this.elCharStability.textContent = `${Math.floor(stability)}%`;
            this.elCharStability.className = stability > 90 ? 'text-green-400' : (stability < 40 ? 'text-red-500' : 'text-cultivation-gold');
        }
        if (this.elCharComprehension) {
            const tier = state.player.getComprehensionTier();
            this.elCharComprehension.innerHTML = `
                <span class="font-mono font-bold">${Math.floor(state.player.comprehension || 0)}</span>
                <span class="ml-1 text-[7px] px-1.5 py-0.5 rounded font-bold uppercase whitespace-nowrap" style="color: ${tier.color}; background-color: ${tier.color}15; border: 1px solid ${tier.color}30" title="${tier.description}">${tier.name}</span>
            `;
        }

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

        if (this.elCharExpTuvi) this.elCharExpTuvi.textContent = `${Math.floor(state.player.tuVi || 0).toLocaleString()} / ${tuviRealm.expRequired.toLocaleString()}`;
        if (this.elCharExpBody) this.elCharExpBody.textContent = `${Math.floor(state.player.bodyExp || 0).toLocaleString()} / ${bodyRealm.expRequired.toLocaleString()}`;
        if (this.elCharExpSoul) this.elCharExpSoul.textContent = `${Math.floor(state.player.soulExp || 0).toLocaleString()} / ${soulRealm.expRequired.toLocaleString()}`;

        // Race Info
        if (this.elCharRace) {
            const raceInfo = RACE_DATA[state.player.race] || RACE_DATA.HUMAN;
            this.elCharRace.textContent = raceInfo.name;
            this.elCharRace.className = `text-xs font-bold race-${state.player.race.toLowerCase()}`;
        }
        if (this.elCharGender) {
            this.elCharGender.textContent = state.player.gender || "Nam";
        }
        
        if (this.elCharTitle) {
            const activeTitleId = state.player.fate?.activeTitleId;
            const title = TITLES.find(t => t.id === activeTitleId);
            this.elCharTitle.textContent = title ? title.name : "Vô Danh";
        }
        
        if (this.elCharDestinyRating) {
            this.elCharDestinyRating.textContent = state.player.destinyRating || "Phàm mệnh";
        }

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
        if (this.elRootName && this.elRootElements && this.elRootPurity && state.player.spiritualRoot) {
            const root = state.player.spiritualRoot;
            const rarityName = root.rarityName || 'Phàm';
            
            const ELEMENT_STYLES = {
                'Kim': { color: '#fcd34d', bg: 'rgba(252, 211, 77, 0.1)', border: 'rgba(252, 211, 77, 0.25)', shadow: 'rgba(252, 211, 77, 0.15)' },
                'Mộc': { color: '#4ade80', bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.25)', shadow: 'rgba(74, 222, 128, 0.15)' },
                'Thủy': { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.25)', shadow: 'rgba(59, 130, 246, 0.15)' },
                'Hỏa': { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.25)', shadow: 'rgba(239, 68, 68, 0.15)' },
                'Thổ': { color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)', border: 'rgba(217, 119, 6, 0.25)', shadow: 'rgba(217, 119, 6, 0.15)' },
                'Lôi': { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.25)', shadow: 'rgba(168, 85, 247, 0.15)' },
                'Băng': { color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.25)', shadow: 'rgba(6, 182, 212, 0.15)' },
                'Phong': { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', border: 'rgba(148, 163, 184, 0.25)', shadow: 'rgba(148, 163, 184, 0.15)' },
                'Độc': { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)', shadow: 'rgba(16, 185, 129, 0.15)' }
            };

            const defaultStyle = { color: '#ffffff', bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.15)', shadow: 'transparent' };

            let elementsText = '';
            if (root.proportions) {
                elementsText = Object.entries(root.proportions)
                    .map(([el, pct]) => {
                        const style = ELEMENT_STYLES[el] || defaultStyle;
                        return `<span class="px-2 py-0.5 rounded-full border text-[7.5px] font-bold tracking-wide transition-all hover:scale-105 shadow-sm whitespace-nowrap" style="color: ${style.color}; background-color: ${style.bg}; border-color: ${style.border}; box-shadow: 0 0 4px ${style.shadow}">${el} ${pct}%</span>`;
                    })
                    .join('');
            } else if (root.elements) {
                elementsText = root.elements.map(el => {
                    const style = ELEMENT_STYLES[el] || defaultStyle;
                    return `<span class="px-2 py-0.5 rounded-full border text-[7.5px] font-bold tracking-wide transition-all hover:scale-105 shadow-sm whitespace-nowrap" style="color: ${style.color}; background-color: ${style.bg}; border-color: ${style.border}; box-shadow: 0 0 4px ${style.shadow}">${el}</span>`;
                }).join('');
            }

            // Set root name (type only, colored by rarity)
            this.elRootName.innerHTML = `<span style="color: ${root.color}; text-shadow: 0 0 8px ${root.color}40" class="font-ancient font-black text-[11px] tracking-wide">${root.type}</span>`;
            
            // Set element pills
            this.elRootElements.innerHTML = elementsText;
            
            // Set purity details
            this.elRootPurity.innerHTML = `<span class="bg-white/5 border border-white/5 px-1.5 py-0.5 rounded-md">Độ Tinh Khiết: <span class="font-bold text-qi-blue font-mono">${root.purity}%</span></span>`;
        }
        if (this.elPhysique) {
            const phys = state.player.physique;
            if (phys && phys.id) {
                const physData = getPhysiqueById(phys.id);
                const grade = PHYSIQUE_GRADES[physData.grade];
                const stage = PHYSIQUE_STAGES[phys.stage];
                
                let text = `<span style="color: ${grade.color}">${physData.name}</span>`;
                if (physData.grade !== 'PHAM') {
                    text += ` <span class="text-[8px] opacity-60">[${stage.name}]</span>`;
                }
                
                if (!phys.awakened) {
                    text += ` <span class="text-[8px] text-red-500 font-bold">(CHƯA THỨC TỈNH)</span>`;
                } else if (phys.phenomenonActive && physData.phenomenon) {
                    text += ` <i class="ph ph-sparkle text-cultivation-gold text-[8px]" title="Dị tượng: ${physData.phenomenon}"></i>`;
                }
                
                this.elPhysique.innerHTML = text;
                this.elPhysique.title = physData.desc;
            } else {
                this.elPhysique.textContent = "Không";
            }
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
        
        // Advanced Stats
        this.renderAdvancedStats();
        
        // Talents
        this.renderTalents();
        
        // Energy (Qi)
        if (typeof window.game.renderEnergy === 'function') window.game.renderEnergy();
        
        // Specialized Paths
        this.renderSpecializedPaths();
    }

    renderTalents() {
        if (!this.elCharTalentsList || !state.player) return;
        
        const talents = {
            comprehension: { name: 'Ngộ Tính', icon: '🧠', color: 'bg-qi-blue' },
            luck: { name: 'Khí Vận', icon: '✨', color: 'bg-cultivation-gold' },
            daoTam: { name: 'Đạo Tâm', icon: '🛡️', color: 'bg-emerald-500' },
            divineSense: { name: 'Thần Thức', icon: '👁️', color: 'bg-qi-purple' },
            physiqueTalent: { name: 'Căn Cốt', icon: '🦴', color: 'bg-red-500' }
        };

        this.elCharTalentsList.innerHTML = Object.entries(talents).map(([key, data]) => {
            const val = state.player[key] || 50;
            return `
                <div class="space-y-1">
                    <div class="flex justify-between items-center text-[10px]">
                        <div class="flex items-center space-x-1">
                            <span class="opacity-80">${data.icon}</span>
                            <span class="text-gray-400 uppercase tracking-widest">${data.name}</span>
                        </div>
                        <span class="font-mono font-bold text-white">${val}</span>
                    </div>
                    <div class="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div class="h-full ${data.color} shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-all duration-500" style="width: ${val}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderSpecializedPaths() {
        if (!this.elSpecializedPaths || !state.player.specializedPaths) return;
        
        const activePaths = Object.entries(state.player.specializedPaths).filter(([_, path]) => path.realmId > 0);
        
        if (activePaths.length === 0) {
            this.elSpecializedPaths.innerHTML = '<div class="text-[9px] text-gray-600 italic">Chưa dấn thân vào con đường đặc biệt nào</div>';
            return;
        }

        this.elSpecializedPaths.innerHTML = activePaths.map(([key, path]) => {
            const realm = state.player.getCurrentRealm(key);
            const progress = Math.min(100, (path.exp / realm.expRequired) * 100);
            
            return `
                <div class="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-[10px] font-ancient text-qi-blue uppercase tracking-widest">${path.name}</span>
                        <span class="text-[9px] text-gray-500">${realm.name}</span>
                    </div>
                    <div class="h-1 bg-black/40 rounded-full overflow-hidden">
                        <div class="h-full bg-qi-blue shadow-[0_0_10px_rgba(79,209,197,0.5)] transition-all" style="width: ${progress}%"></div>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-[8px] text-gray-600">${Math.floor(path.exp).toLocaleString()} / ${realm.expRequired.toLocaleString()}</span>
                        <button onclick="window.game.breakthrough('${key}')" class="text-[8px] btn-gold px-2 py-0.5 rounded ${state.player.canBreakthrough(key).can ? 'animate-pulse' : 'opacity-50'}">ĐỘT PHÁ</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderAdvancedStats() {
        if (!this.elCharAdvancedStats || !state.player.advancedStats) return;
        
        const stats = state.player.advancedStats;
        const labels = {
            pierce: 'Phá Giáp',
            soulPierce: 'Phá Hồn',
            critRate: 'Bạo Kích',
            critDmg: 'Sát Thương Bạo',
            lifeSteal: 'Huyết Tế',
            soulRepress: 'Trấn Áp Thần Thức',
            daoVun: 'Đạo Vận',
            murderQi: 'Sát Khí',
            allRes: 'Kháng Tất Cả'
        };

        this.elCharAdvancedStats.innerHTML = Object.entries(labels).map(([key, label]) => {
            const val = stats[key] || 0;
            if (val === 0 || val === 1.0) return ''; // Hide empty stats
            
            let displayVal = val;
            if (['critRate', 'critDmg', 'pierce', 'soulPierce', 'lifeSteal', 'allRes', 'damageReduction'].includes(key)) {
                displayVal = (val * 100).toFixed(1) + '%';
            }

            return `
                <div class="flex justify-between items-center border-b border-white/5 py-1">
                    <span class="text-gray-500 text-[10px]">${label}:</span>
                    <span class="text-white font-mono text-[10px]">${displayVal}</span>
                </div>
            `;
        }).join('');
    }

    renderTechniqueInfo(element, techId) {
        if (!element) return;
        if (techId) {
            const tech = getTechniqueById(techId);
            const entry = state.player.learnedTechniques.find(t => t.id === techId);
            if (!tech || !entry) {
                element.textContent = "Không";
                return;
            }
            
            const mastery = MASTERY_LEVELS.find(m => m.id === (entry.masteryLevel || 1));
            const stageLabel = tech.stageLabel || 'Tầng';
            const stageName = (tech.stageNames && tech.stageNames[entry.stage - 1]) ? tech.stageNames[entry.stage - 1] : `${stageLabel} ${entry.stage || 1}`;
            
            element.textContent = `${tech.name} [${stageName}] (${mastery?.name || 'Nhập Môn'})`;
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
