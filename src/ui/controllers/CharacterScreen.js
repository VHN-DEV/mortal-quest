import { state } from '../../state.js';
import { getSectById } from '../../configs/sect-data.js';
import { getTechniqueById, MASTERY_LEVELS } from '../../configs/technique-data.js';
import { getPhysiqueById } from '../../configs/physique-data.js';
import { RACE_DATA } from '../../configs/realm-data.js';
import { TITLES } from '../../configs/fate-data.js';
import { getGenderLabel } from '../../configs/display-mappers.js';
import { CULTIVATION_PATHS } from '../../configs/cultivation-paths.js';
import { ELEMENT_TYPES, STATUS_EFFECT_CATEGORIES, PHYSIQUE_GRADES, PHYSIQUE_STAGES } from '../../configs/game-enums.js';

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
        this.elCharHpBar = document.getElementById('char-hp-bar');
        this.elCharAtk = document.getElementById('char-atk');
        this.elCharDef = document.getElementById('char-def');
        this.elCharSpd = document.getElementById('char-spd');
        this.elCharMana = document.getElementById('char-mana');
        this.elCharManaBar = document.getElementById('char-mana-bar');
        this.elCharStamina = document.getElementById('char-stamina');
        this.elCharStaminaBar = document.getElementById('char-stamina-bar');
        this.elCharCritRate = document.getElementById('char-crit-rate');
        this.elCharDodge = document.getElementById('char-dodge');
        this.elCharAge = document.getElementById('char-age');
        this.elCharRemainingAge = document.getElementById('char-remaining-age-container');
        this.elCharStability = document.getElementById('char-stability');
        this.elCharBreakthroughRate = document.getElementById('char-breakthrough-rate');
        this.elCharComprehension = document.getElementById('char-comprehension');
        this.elCharDivineSense = document.getElementById('char-divine-sense');
        this.elCharPhysiqueTalent = document.getElementById('char-physique-talent');
        this.elCharDaoTam = document.getElementById('char-dao-tam');
        this.elCharDanPoison = document.getElementById('char-dan-poison');
        this.elCharDailyPills = document.getElementById('char-daily-pills');
        
        // Cultivation Main
        this.elCharRealmName = document.getElementById('char-realm-name');
        this.elCharRealmExpBar = document.getElementById('char-realm-exp-bar');
        this.elCharExpDetails = document.getElementById('char-exp-details');
        
        // Realms (Bottom detail progress cards)
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
        this.elCharCultivationPath = document.getElementById('char-cultivation-path');
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
        this.elSpecializedPaths = document.getElementById('char-specialized-paths');

        // Active Status Panels
        this.elCharStatusPanel = document.getElementById('char-status-effects-panel');
        this.elCharStatusList = document.getElementById('char-status-effects-list');

        // PNTT Elements
        this.elPnttPanel = document.getElementById('pntt-panel');
        this.elCharTanTienBadge = document.getElementById('char-tan-tien-badge');
        this.elCharNguyenThan = document.getElementById('char-nguyen-than');
        this.elCharTienKhieu = document.getElementById('char-tien-khieu');
        this.elBtnOpenTienKhieu = document.getElementById('btn-open-tien-khieu');

        this.elLawLoiVal = document.getElementById('law-loi-val');
        this.elLawHoaVal = document.getElementById('law-hoa-val');
        this.elLawThuyVal = document.getElementById('law-thuy-val');
        this.elLawPhongVal = document.getElementById('law-phong-val');
        this.elLawKhongGianVal = document.getElementById('law-khong_gian-val');
        this.elLawThoiGianVal = document.getElementById('law-thoi_gian-val');
        this.elLawLuanHoiVal = document.getElementById('law-luan_hoi-val');
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

        if (this.elBtnOpenTienKhieu) {
            this.elBtnOpenTienKhieu.onclick = async () => {
                if (state.player && typeof state.player.openTienKhieu === 'function') {
                    const res = state.player.openTienKhieu();
                    if (res.success) {
                        if (window.game && typeof window.game.saveGame === 'function') {
                            await window.game.saveGame();
                        }
                        if (window.game && typeof window.game.refreshUI === 'function') {
                            window.game.refreshUI();
                        }
                        state.ui.toast(res.msg, "success");
                    } else {
                        state.ui.toast(res.msg, "error");
                    }
                }
            };
        }

        // Event delegation for comprehending laws
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('.btn-comprehend-law');
            if (btn) {
                const lawId = btn.dataset.law;
                if (state.player && typeof state.player.comprehendLaw === 'function') {
                    const res = state.player.comprehendLaw(lawId);
                    if (res.success) {
                        if (window.game && typeof window.game.saveGame === 'function') {
                            await window.game.saveGame();
                        }
                        if (window.game && typeof window.game.refreshUI === 'function') {
                            window.game.refreshUI();
                        }
                        state.ui.toast(res.msg, "success");
                    } else {
                        state.ui.toast(res.msg, "error");
                    }
                }
            }
        });
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
        
        if (this.elCharHpBar) {
            const hp = state.player.hp || 0;
            const maxHp = state.player.maxHp || 100;
            this.elCharHpBar.style.width = `${Math.min(100, (hp / maxHp) * 100)}%`;
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

        if (this.elCharManaBar) {
            const mana = state.player.mana || 0;
            const maxMana = state.player.maxMana || 50;
            this.elCharManaBar.style.width = `${Math.min(100, (mana / maxMana) * 100)}%`;
        }

        if (this.elCharStamina) {
            const stamina = state.player.stamina || 0;
            const maxStamina = state.player.maxStamina || 100;
            this.elCharStamina.textContent = `${Math.floor(stamina)} / ${Math.floor(maxStamina)}`;
        }

        if (this.elCharStaminaBar) {
            const stamina = state.player.stamina || 0;
            const maxStamina = state.player.maxStamina || 100;
            this.elCharStaminaBar.style.width = `${Math.min(100, (stamina / maxStamina) * 100)}%`;
        }

        if (this.elCharCritRate) {
            const crit = state.player.advancedStats?.critRate || 0.05;
            this.elCharCritRate.textContent = `${Math.round(crit * 100)}%`;
        }

        if (this.elCharDodge) {
            const dodge = state.player.advancedStats?.dodge || 0;
            this.elCharDodge.textContent = `${Math.round(dodge * 100)}%`;
        }

        // Render Age & Lifespan combined
        const playerAge = state.player.age || 0;
        const maxAge = state.player.maxAge || 100;
        const remaining = Math.max(0, maxAge - Math.floor(playerAge));
        
        if (this.elCharAge) {
            this.elCharAge.textContent = `${Math.floor(playerAge)} / ${maxAge} tuổi`;
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
            this.elCharStability.className = stability > 90 ? 'text-green-400 font-bold' : (stability < 40 ? 'text-red-500 font-bold' : 'text-cultivation-gold font-bold');
        }

        if (this.elCharBreakthroughRate) {
            const btRate = state.player.getBreakthroughSuccessRate('tuvi');
            this.elCharBreakthroughRate.textContent = `${btRate}%`;
            this.elCharBreakthroughRate.className = btRate > 80 ? 'text-green-400 font-bold' : (btRate < 45 ? 'text-red-500 font-bold animate-pulse' : 'text-cyan-400 font-bold');
        }

        if (this.elCharDanPoison) {
            const danPoison = state.player.danPoison || 0;
            this.elCharDanPoison.textContent = `${Math.floor(danPoison)} / 100`;
            this.elCharDanPoison.className = danPoison > 75 ? 'text-red-500 font-bold font-mono animate-pulse' : (danPoison > 40 ? 'text-purple-400 font-bold font-mono' : 'text-gray-400 font-bold font-mono');
        }

        if (this.elCharDailyPills) {
            const dailyCount = state.player.dailyPillStats?.count || 0;
            const realmId = state.player.realmId || 1;
            let dailyLimit = 5;
            if (realmId <= 13) dailyLimit = 5;
            else if (realmId <= 17) dailyLimit = 7;
            else if (realmId <= 21) dailyLimit = 10;
            else if (realmId <= 25) dailyLimit = 12;
            else if (realmId <= 29) dailyLimit = 15;
            else dailyLimit = 20;

            this.elCharDailyPills.textContent = `${dailyCount} / ${dailyLimit}`;
            this.elCharDailyPills.className = dailyCount >= dailyLimit ? 'text-red-400 font-bold font-mono animate-pulse' : 'text-cyan-400 font-bold font-mono';
        }

        if (this.elCharComprehension) {
            const tier = state.player.getComprehensionTier();
            this.elCharComprehension.innerHTML = `
                <span class="font-mono font-bold">${Math.floor(state.player.getComprehension() || 0)}</span>
                <span class="ml-1 text-[7px] px-1.5 py-0.5 rounded font-bold uppercase whitespace-nowrap" style="color: ${tier.color}; background-color: ${tier.color}15; border: 1px solid ${tier.color}30" title="${tier.description}">${tier.name}</span>
            `;
        }
        if (this.elCharDivineSense) {
            this.elCharDivineSense.textContent = Math.floor(state.player.divineSense || 50);
        }
        if (this.elCharPhysiqueTalent) {
            this.elCharPhysiqueTalent.textContent = Math.floor(state.player.physiqueTalent || 50);
        }
        if (this.elCharDaoTam) {
            this.elCharDaoTam.textContent = Math.floor(state.player.daoTam || 50);
        }

        // Render Realms & Progress
        const tuviRealm = state.player.getCurrentRealm('tuvi');
        const bodyRealm = state.player.getCurrentRealm('body');
        const soulRealm = state.player.getCurrentRealm('soul');

        // Main Realm Bar
        if (this.elCharRealmName) {
            this.elCharRealmName.textContent = tuviRealm.name;
        }
        if (this.elCharExpDetails) {
            this.elCharExpDetails.textContent = `${Math.floor(state.player.tuVi || 0).toLocaleString()} / ${tuviRealm.expRequired.toLocaleString()}`;
        }
        if (this.elCharRealmExpBar) {
            this.elCharRealmExpBar.style.width = `${Math.min(100, (state.player.tuVi / tuviRealm.expRequired) * 100)}%`;
        }

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
            const genderLabel = getGenderLabel(state.player.gender);
            this.elCharRace.textContent = `${raceInfo.name} (${genderLabel})`;
            this.elCharRace.className = `text-xs font-bold race-${state.player.race.toLowerCase()}`;
        }
        
        // Cultivation Path Info
        if (this.elCharCultivationPath) {
            const mainPath = state.player.mainPath || 'orthodox';
            const pathName = {
                orthodox: 'Chính Thống',
                ma_dao: 'Ma Đạo',
                quy_dao: 'Quỷ Đạo',
                yeu_tu: 'Yêu Tu'
            }[mainPath] || 'Chính Thống';
            this.elCharCultivationPath.textContent = pathName;
            this.elCharCultivationPath.className = `text-xs font-bold path-${mainPath}`;
        }

        if (this.elCharGender) {
            this.elCharGender.textContent = getGenderLabel(state.player.gender);
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
            
            const defaultStyle = { color: '#ffffff', bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.15)', shadow: 'transparent' };

            let elementsText = '';
            if (root.proportions) {
                elementsText = Object.entries(root.proportions)
                    .map(([el, pct]) => {
                        const elEnum = Object.values(ELEMENT_TYPES).find(e => e.name === el);
                        const style = elEnum ? { color: elEnum.color, bg: elEnum.bg, border: elEnum.border, shadow: elEnum.shadow } : defaultStyle;
                        return `<span class="px-2 py-0.5 rounded-full border text-[7.5px] font-bold tracking-wide transition-all hover:scale-105 shadow-sm whitespace-nowrap" style="color: ${style.color}; background-color: ${style.bg}; border-color: ${style.border}; box-shadow: 0 0 4px ${style.shadow}">${el} ${pct}%</span>`;
                    })
                    .join('');
            } else if (root.elements) {
                elementsText = root.elements.map(el => {
                    const elEnum = Object.values(ELEMENT_TYPES).find(e => e.name === el);
                    const style = elEnum ? { color: elEnum.color, bg: elEnum.bg, border: elEnum.border, shadow: elEnum.shadow } : defaultStyle;
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
        
        // Energy (Qi)
        if (typeof window.game.renderEnergy === 'function') window.game.renderEnergy();
        
        // Specialized Paths
        this.renderSpecializedPaths();
        
        // Active Status Effects
        this.renderStatusEffects();

        // PNTT Cultivation Panel Render
        const showPntt = state.player.realmId >= 26 || state.player.isTanTien;
        if (showPntt) {
            if (this.elPnttPanel) this.elPnttPanel.classList.remove('hidden');
            if (this.elCharTanTienBadge) {
                if (state.player.isTanTien) {
                    this.elCharTanTienBadge.classList.remove('hidden');
                    this.elCharTanTienBadge.textContent = `TÁN TIÊN (${state.player.tanTienKiếpCount || 1} KIẾP)`;
                } else {
                    this.elCharTanTienBadge.classList.add('hidden');
                }
            }
            if (this.elCharNguyenThan) {
                const names = ["Chưa ngưng tụ", "Sơ cấp Nguyên Thần", "Trung cấp Nguyên Thần", "Cao cấp Nguyên Thần", "Tiên cấp Nguyên Thần", "Chí Tôn Nguyên Thần"];
                this.elCharNguyenThan.textContent = names[state.player.nguyenThanRank || 0] || "Chưa ngưng tụ";
            }
            if (this.elCharTienKhieu) {
                this.elCharTienKhieu.textContent = `${state.player.tienKhieuOpen || 0} / 108`;
            }

            // Law values
            const phapTac = state.player.phapTac || {};
            if (this.elLawLoiVal) this.elLawLoiVal.textContent = `${phapTac.loi || 0}%`;
            if (this.elLawHoaVal) this.elLawHoaVal.textContent = `${phapTac.hoa || 0}%`;
            if (this.elLawThuyVal) this.elLawThuyVal.textContent = `${phapTac.thuy || 0}%`;
            if (this.elLawPhongVal) this.elLawPhongVal.textContent = `${phapTac.phong || 0}%`;
            if (this.elLawKhongGianVal) this.elLawKhongGianVal.textContent = `${phapTac.khong_gian || 0}%`;
            if (this.elLawThoiGianVal) this.elLawThoiGianVal.textContent = `${phapTac.thoi_gian || 0}%`;
            if (this.elLawLuanHoiVal) this.elLawLuanHoiVal.textContent = `${phapTac.luan_hoi || 0}%`;
        } else {
            if (this.elPnttPanel) this.elPnttPanel.classList.add('hidden');
        }
    }

    renderSpecializedPaths() {
        if (!this.elSpecializedPaths || !state.player.specializedPaths) return;
        
        let html = '';

        // Render Specialized Paths
        html += `<div>
            <h4 class="text-[10px] text-qi-blue font-ancient tracking-widest uppercase mb-2">Nhánh Tu Luyện</h4>
            <div class="grid grid-cols-2 gap-2">`;
            
        const specializedIds = ['sword', 'soul_path', 'buddhist', 'confucian'];
        specializedIds.forEach(pid => {
            const pConfig = CULTIVATION_PATHS[pid];
            if (!pConfig) return;
            
            const playerPath = state.player.specializedPaths[pid];
            const isUnlocked = playerPath && playerPath.realmId > 0;
            
            if (isUnlocked) {
                const realm = state.player.getCurrentRealm(pid);
                const progress = Math.min(100, (playerPath.exp / realm.expRequired) * 100);
                const isFocused = state.player.cultivationFocus === pid;
                const canBt = state.player.canBreakthrough(pid).can;

                html += `
                    <div class="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-between space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-[10px] font-ancient text-qi-blue uppercase tracking-widest">${pConfig.name}</span>
                            <span class="text-[8px] text-gray-500">${realm.name}</span>
                        </div>
                        <div class="h-1 bg-black/40 rounded-full overflow-hidden">
                            <div class="h-full bg-qi-blue shadow-[0_0_10px_rgba(79,209,197,0.5)] transition-all" style="width: ${progress}%"></div>
                        </div>
                        <div class="flex justify-between items-center text-[8px]">
                            <span class="text-gray-600">${Math.floor(playerPath.exp).toLocaleString()} / ${realm.expRequired.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between items-center pt-1 border-t border-white/5">
                            <button onclick="window.game.setCultivationFocus('${pid}')" class="text-[8px] px-2 py-0.5 rounded font-ancient ${isFocused ? 'bg-qi-blue text-black font-bold' : 'bg-white/5 border border-white/10 text-gray-400'}">
                                ${isFocused ? 'ĐANG TU' : 'TẬP TRUNG'}
                            </button>
                            <button onclick="window.game.breakthrough('${pid}')" class="text-[8px] btn-gold px-2 py-0.5 rounded font-ancient ${canBt ? 'animate-pulse' : 'opacity-50'}">ĐỘT PHÁ</button>
                        </div>
                    </div>
                `;
            } else {
                // Check eligibility
                const isRaceCompatible = !pConfig.races || pConfig.races.includes(state.player.race);
                const mainPath = state.player.mainPath || 'orthodox';
                const isMainPathCompatible = !pConfig.requiredMain || pConfig.requiredMain.length === 0 || pConfig.requiredMain.includes(mainPath);
                
                let btnHtml = '';
                if (isRaceCompatible && isMainPathCompatible) {
                    btnHtml = `<button onclick="window.game.embarkPath('${pid}')" class="text-[8px] btn-gold px-2 py-0.5 rounded font-ancient">NHẬP ĐẠO</button>`;
                } else {
                    let reqText = '';
                    if (!isRaceCompatible) reqText = 'Chủng tộc';
                    else if (!isMainPathCompatible) {
                        const pathNames = pConfig.requiredMain.map(p => CULTIVATION_PATHS[p]?.name || p).join('/');
                        reqText = `Cần ${pathNames}`;
                    }
                    btnHtml = `<span class="text-[8px] text-red-500 font-bold opacity-60" title="${reqText}">${reqText}</span>`;
                }

                html += `
                    <div class="p-3 bg-white/5 border border-white/10 border-dashed rounded-xl flex flex-col justify-between space-y-2 opacity-70">
                        <div class="flex justify-between items-center">
                            <span class="text-[10px] font-ancient text-gray-400 uppercase tracking-widest">${pConfig.name}</span>
                            <span class="text-[8px] text-gray-600">Chưa Nhập Đạo</span>
                        </div>
                        <p class="text-[8px] text-gray-600 line-clamp-2">${pConfig.desc}</p>
                        <div class="flex justify-between items-center pt-1 border-t border-white/5">
                            <span class="text-[8px] text-gray-700">${pConfig.currency}</span>
                            ${btnHtml}
                        </div>
                    </div>
                `;
            }
        });
        html += `</div></div>`;

        this.elSpecializedPaths.innerHTML = html;
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

    renderStatusEffects() {
        if (!this.elCharStatusPanel || !this.elCharStatusList) return;

        const buffs = state.player.buffs || [];
        if (buffs.length === 0) {
            this.elCharStatusPanel.classList.add('hidden');
            return;
        }

        this.elCharStatusPanel.classList.remove('hidden');

        const now = Date.now();
        this.elCharStatusList.innerHTML = buffs.map(b => {
            const catEnum = STATUS_EFFECT_CATEGORIES[b.category] || Object.values(STATUS_EFFECT_CATEGORIES).find(c => c.name === b.category);
            const theme = catEnum ? {
                border: catEnum.borderClass || '',
                bg: catEnum.bgClass || '',
                text: catEnum.textClass || '',
                shadow: catEnum.shadowClass || ''
            } : { border: 'border-white/10', bg: 'bg-white/5', text: 'text-white', shadow: 'none' };
            const stacksLabel = b.stacks > 1 ? `<span class="ml-1 px-1 bg-black/60 rounded text-[7px] text-white font-bold font-mono">x${b.stacks}</span>` : '';
            
            let durLabel = 'Vô Hạn';
            if (b.duration !== undefined && b.duration !== null && b.duration !== Infinity) {
                const mins = Math.floor(b.duration / 60);
                const secs = Math.floor(b.duration % 60);
                durLabel = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
            }

            let details = `[Trạng Thái: ${b.name}]\nPhân Loại: ${catEnum?.name || b.category} (${b.type === 'buff' ? 'Cát Lợi' : 'Bất Lợi'})\n`;
            details += `Hiệu quả: ${b.desc}\n`;
            if (b.effects) {
                details += `Thuộc tính tăng/giảm:\n`;
                Object.entries(b.effects).forEach(([stat, val]) => {
                    const sign = val > 0 ? '+' : '';
                    const percent = Math.round(val * 100);
                    details += `  - ${stat.toUpperCase()}: ${sign}${percent}%\n`;
                });
            }
            if (b.curedBy) {
                details += `Cách giải: ${b.curedBy.join(', ')}\n`;
            }
            details += `Thời gian còn lại: ${durLabel}`;

            return `
                <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border ${theme.border} ${theme.bg} ${theme.text} ${theme.shadow} text-[9px] font-ancient transition-all hover:scale-105 select-none cursor-help relative group" title="${details}">
                    <span class="text-xs">${b.icon || '✨'}</span>
                    <span class="font-bold tracking-wide">${b.name}</span>
                    ${stacksLabel}
                    <span class="text-[7.5px] opacity-60 ml-1.5 font-mono border-l border-white/10 pl-1.5">${durLabel}</span>
                </div>
            `;
        }).join('');
    }
}
