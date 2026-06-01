import { getRealmById, RACE_DATA, HUMAN_REALMS, BODY_REALMS, SOUL_REALMS, SWORD_PATH_REALMS, SOUL_PATH_REALMS, DEMON_REALMS, GHOST_REALMS, SPIRIT_BEAST_REALMS, BUDDHIST_REALMS, CONFUCIAN_REALMS, getSubRealmsOfCurrent } from '../configs/realm-data.js';
import { Inventory } from './inventory.js';
import { state } from '../state.js';
import { getItemById } from '../configs/item-data.js';
import { getTechniqueById, getSecretTechniqueById, TECHNIQUE_LEVELS, TECHNIQUE_QUALITIES, MASTERY_LEVELS } from '../configs/technique-data.js';
import { getPhysiqueById, getPhysiqueAwakenBonus, PHYSIQUE_GRADES, PHYSIQUE_STAGES } from '../configs/physique-data.js';
import { ARTIFACT_SETS } from '../configs/artifact-data.js';
import { CREATION_TRAITS, ROOT_ELEMENTS, SPECIAL_ELEMENTS } from '../configs/creation-data.js';
import { TITLES } from '../configs/fate-data.js';
import { getLocationById, WORLDS } from '../configs/map-data.js';
import { getSectById } from '../configs/sect-data.js';
import { CULTIVATION_PATHS } from '../configs/cultivation-paths.js';
import { getTechniqueTypeSlug } from '../configs/display-mappers.js';
import { getStatusEffectById, STATUS_EFFECT_TEMPLATES } from '../configs/status-effect-data.js';

export class Player {
    constructor() {
        this.name = "Phàm Nhân";
        this.gender = "male";
        this.avatar = "player_male";
        this.race = 'HUMAN'; // HUMAN, SPIRIT_BEAST, DEMON, etc.
        this.mainPath = null; // orthodox, ma_dao, quy_dao, yeu_tu (resolved in calculateStats)
        this.realmId = 0;
        this.tuVi = 0;
        this.buffs = []; // Array of { id, type, value, endTime }
        this.pendingEvents = [];
        
        // --- Cấu trúc Linh Thạch mới (Dựa trên vật phẩm) ---
        // this.lingShi sẽ được tính toán động từ Inventory
        this.totalSpent = 0;
        this.vipLevel = 0;
        this.spiritStoneSettings = {
            autoUsePriority: ['HA', 'TRUNG', 'THUONG'],
            lockCucPham: true,
            minReserve: 0
        };

        // Body & Soul systems
        this.bodyRealmId = 0;
        this.bodyExp = 0;
        this.soulRealmId = 0;
        this.soulExp = 0;
        
        // Multi-Path Advancement
        this.specializedPaths = {
            sword: { realmId: 0, exp: 0, name: 'Kiếm Tu' },
            soul_path: { realmId: 0, exp: 0, name: 'Hồn Tu' },
            buddhist: { realmId: 0, exp: 0, name: 'Phật Tu' },
            confucian: { realmId: 0, exp: 0, name: 'Nho Tu' }
        };

        this.cultivationFocus = 'tuvi'; // 'tuvi', 'body', 'soul', 'sword', etc.
        
        // Base Stats (Stored for UI display "Base (+Bonus)")
        this.baseStats = {
            atk: 10, def: 5, spd: 10, maxHp: 100, maxMana: 50, stamina: 100
        };
        this.bonusStats = {
            atk: 0, def: 0, spd: 0, maxHp: 0, maxMana: 0, tuViSpeed: 1, bodyExpSpeed: 1, soulExpSpeed: 1
        };
        
        this.maxHp = 100;
        this.hp = 100;
        this.maxMana = 50;
        this.mana = 50;
        this.maxStamina = 100;
        this.stamina = 100;
        
        this.atk = 10;
        this.def = 5;
        this.spd = 10;
        
        this.tuViPerSecond = 0;
        this.bodyExpPerSecond = 0;
        this.soulExpPerSecond = 0;
        
        // Meridian cycles progress for Tu Vi, Luyện Thể, and Thần Thức
        this.meridianCycles = {
            tuvi: { step: 0, count: 0 },
            body: { step: 0, count: 0 },
            soul: { step: 0, count: 0 }
        };
        
        // Equipment slots (Expanded for Artifact System)
        this.equipment = {
            head: null,
            necklace: null,
            weapon: null,    
            armor: null,
            accessory: null,
            shoes: null,
            // Artifacts
            attackArtifact: null,   // Pháp bảo chủ chiến
            defenseArtifact: null,  // Pháp bảo hộ thân
            flightArtifact: null,   // Phi hành pháp bảo
            spaceArtifact: null,    // Không gian pháp bảo
            formationArtifact: null, // Trận đạo pháp bảo
            supportArtifact: null,  // Phụ trợ pháp bảo
            soulArtifact: null      // Hồn đạo pháp bảo
        };
        
        this.inventory = new Inventory(this);
        this.lastUpdate = Date.now();
        
        // Sect info
        this.sectId = null;
        this.sectContribution = 0;
        this.sectRank = 'ngoai_mon';
        this.activeSectMissions = [];
        this.sectTournamentYear = -1;
        this.sectWanted = null;       // { sectId, sectName, expiresDay } — Lệnh Truy Sát
        this.sectWarStatus = false;   // Đang trong tình trạng Tông Môn Chiến
        this.sectWarExpiresDay = -1;  // Ngày kết thúc trạng thái chiến
        this.grandmasterSeclusion = { // Thái Thượng Bế Quan state
            isSecluded: true,
            releaseDay: 30            // Ngày Thái Thượng ra quan lần đầu
        };

        // Destiny properties
        this.age = 18;
        this.createdAt = Date.now();
        this.maxAge = 100;
        this.cheatSystemId = null;
        this.spiritualRoot = null;
        this.physique = {
            id: 'binh_thuong',
            stage: 'SO_KHAI',
            exp: 0,
            awakened: true,
            phenomenonActive: false
        };
        this.origin = null;
        this.luck = 50;
        this.talents = [];
        this.destinyRating = "Phàm mệnh";
        this.stability = 100; // 0-100%


        // Technique systems
        this.mainTechniqueId = null;
        this.mainBodyTechniqueId = null;
        this.mainSoulTechniqueId = null;
        this.mainEscapeId = null;
        this.mainDualId = null;
        this.equippedAuxiliaryIds = [];
        this.learnedTechniques = []; // Array of { id, stage, mastery, masteryLevel, quality }
        this.learnedSecretTechniques = []; // Array of { id, mastery, masteryLevel }
        this.equippedSecretTechniqueIds = [];
        this.comprehendingTechniques = []; // Array of { id, progress, durationLeft, totalDuration, isSecret }
        this.secretTechniqueCooldowns = {};
        this.techniquePoints = 0;
        this.customTechniques = []; // Stores player-created custom techniques
        this.deviationTime = 0;     // Remaining duration of deviation (Tẩu Hỏa Nhập Ma)
        this.karma = 0; // -1000 to 1000
        
        // Alchemy System
        this.alchemyLevel = 1;
        this.alchemyExp = 0;
        this.currentCauldron = null;
        this.currentFlame = null;
        this.danPoison = 0;
        this.knownRecipes = []; // No default recipes
        this.ownedFlames = [];
        this.ownedCauldrons = [];
        this.alchemyReputation = 0;
        this.currentAlchemyRoom = null;
        this.gardenPlots = [
            { grade: 'PHAM', attribute: 'NORMAL', seedId: null, age: 0, status: 'empty' },
            { grade: 'PHAM', attribute: 'NORMAL', seedId: null, age: 0, status: 'empty' },
            { grade: 'PHAM', attribute: 'NORMAL', seedId: null, age: 0, status: 'empty' }
        ];
        this.mountainSurvival = { oxygen: 100, toxicity: 0 };
        
        // --- Fate System (Nhân Quả - Danh Tiếng - Thiện Ác) ---
        this.fate = {
            reputation: 0,
            morality: 0, // Thiện (+) / Ác (-)
            merit: 0,    // Công đức
            sin: 0,      // Nghiệp lực
            karmaLinks: [], // { id, npcId, type, strength, description }
            titles: [],
            activeTitleId: null
        };
        
        this.isSecluded = false;
        this.party = [];

        // Talisman System
        this.talismanLevel = 1;
        this.talismanExp = 0;
        this.currentTalismanPen = null;
        this.knownTalismanRecipes = [];
        this.ownedTalismanPens = [];

        // Puppet System
        this.puppetLevel = 1;
        this.puppetExp = 0;
        this.knownPuppetRecipes = [];
        
        // Smithing System
        this.smithingLevel = 1;
        this.smithingExp = 0;
        this.smithingTool = null;
        this.knownSmithingRecipes = [];
        this.ownedSmithingTools = [];
        this.lifeBoundTreasureId = null;
        this.permanentLifespanBonus = 0;

        // Persistence of location
        this.currentLocId = null;
        this.explorationProgress = 0;
        this.gridExplorationState = null;

        // Formation System
        this.activeFormations = []; // { id, startTime, staminaConsumed }
        this.formationSlots = 1;
        this.formationLevel = 1;
        this.formationExp = 0;
        this.knownFormations = [];

        // Beast & Insect System
        this.beasts = [];
        this.hatchingBeasts = [];
        this.beastLevel = 1;
        this.beastExp = 0;
        this.insectLevel = 1;
        this.insectExp = 0;

        // Corpse System
        this.corpseLevel = 1;
        this.corpseExp = 0;
        this.refinedCorpses = [];
        this.knownCorpseRecipes = [];

        // Unlock System
        this.unlockedProfessions = []; // Start with empty to follow the doc.

        // Technique System
        this.knownNPCs = {};

        // --- Energy (Qi) System ---
        this.qiAccumulated = {}; // { [qiId]: { amount: 0, purity: 'TINH_THUAN' } }
        this.currentEnvironmentalQi = null; // { type, concentration, purity }

        // --- Advanced Stats (Artifacts & Elements) ---
        this.advancedStats = {
            pierce: 0,
            soulPierce: 0,
            critRate: 0.05, 
            critDmg: 1.5,   
            fireDmg: 1.0,   
            waterDmg: 1.0,
            thunderDmg: 1.0,
            poisonDmg: 1.0,
            qiAbsorb: 1.0,  
            lifeSteal: 0,
            soulRepress: 0,
            daoVun: 0,
            murderQi: 0,
            armorPen: 0,
            hpRegen: 0,
            poisonRes: 0,
            avoidRate: 0,
            crowdControl: 0,
            skillDmg: 1.0,
            statusRes: 0,
            iceControl: 0,
            dotDmg: 1.0,
            damageReduction: 0,
            techniqueMastery: 1.0
        };

        this.equipmentMetadata = {}; // { [slot]: { spirit, level, durability, extraStat: { type, value } } }
        this.recognizedItems = [];

        // Mining System
        this.miningState = {
            occupiedNodes: [], // { nodeId, startTime, lastClaimTime, health }
            discoveredNodes: ['mo_hoang_tho'], // Nodes player has found
            miningExp: 0,
            miningLevel: 1
        };

        // --- New Enhanced Stats ---
        this.comprehension = 10; // Ngộ tính: Ảnh hưởng tốc độ lĩnh ngộ và tu luyện
        this.heartDemon = 0;     // Tâm ma: 0-100%
        this.daoTam = 50;        // Đạo tâm: Chống tâm ma, ổn định linh lực
        this.divineSense = 50;   // Thần thức: Khống chế pháp bảo
        this.physiqueTalent = 50; // Căn cốt: HP và thể tu

        // --- Hệ thống Đại Viên Mãn (PNTT-style) ---
        // Thay thế forced breakthrough: người chơi chủ động chọn khi nào đột phá
        this.tuViState = 'accumulating'; // 'accumulating' | 'full' | 'condensing' | 'consolidating'
        this.tinh_thuan = 0;      // Pháp Lực Tinh Thuần — tích lũy khi Nén Pháp Lực
        this.can_co = 0;          // Căn Cơ (0-100) — tăng khi Củng Cố, bonus xác suất đột phá
        this.thien_dao_ap_luc = 0; // Áp Lực Thiên Đạo (0-100%) — tăng theo thời gian ở Viên Mãn
        this.thoiGianDaiVienMan = 0; // Số phút game-time đã ở trạng thái Tu Vi Viên Mãn

        // Luyện Thể — Thiên Địa quản (Khí huyết phản phệ)
        this.bodyState = 'accumulating'; // 'accumulating' | 'full' | 'danger'
        this.khi_huyet_ap_luc = 0;       // Khí Huyết Áp Lực (0-100) — tăng khi tích quá 100%
        this.thoiGianBodyVienMan = 0;    // Số phút game-time đã ở trạng thái Body Viên Mãn

        // Thần Thức — Thần Hồn quản (Thần hồn quá tải)
        this.soulState = 'accumulating'; // 'accumulating' | 'full' | 'danger'
        this.than_hon_qua_tai = 0;       // Thần Hồn Quá Tải (0-100) — tăng khi tích quá 100%
        this.thoiGianSoulVienMan = 0;    // Số phút game-time đã ở trạng thái Soul Viên Mãn
    }

    get lingShi() {
        if (!this.inventory) return 0;
        let total = 0;
        const mappings = {
            'ling_thach_ha': 1,
            'ling_thach_trung': 100,
            'ling_thach_thuong': 10000,
            'ling_thach_cuc': 1000000
        };
        
        this.inventory.allItems.forEach(item => {
            if (mappings[item.id]) {
                total += item.quantity * mappings[item.id];
            }
        });
        return total;
    }

    getFormattedLingShi() {
        const counts = {
            'ling_thach_ha': 0,
            'ling_thach_trung': 0,
            'ling_thach_thuong': 0,
            'ling_thach_cuc': 0
        };

        if (this.inventory) {
            this.inventory.allItems.forEach(item => {
                if (counts.hasOwnProperty(item.id)) {
                    counts[item.id] += item.quantity;
                }
            });
        }

        let res = [];
        if (counts['ling_thach_cuc'] > 0) res.push(`<span class="grade-cuc">${counts['ling_thach_cuc']} Cực</span>`);
        if (counts['ling_thach_thuong'] > 0) res.push(`<span class="grade-thuong">${counts['ling_thach_thuong']} Thượng</span>`);
        if (counts['ling_thach_trung'] > 0) res.push(`<span class="grade-trung">${counts['ling_thach_trung']} Trung</span>`);
        if (counts['ling_thach_ha'] > 0 || res.length === 0) res.push(`<span class="grade-ha">${counts['ling_thach_ha']} Hạ</span>`);
        
        return res.join(' ');
    }

    spendLingShi(amount) {
        if (this.lingShi < amount) return false;

        let remaining = amount;
        const priority = this.spiritStoneSettings?.autoUsePriority || ['HA', 'TRUNG', 'THUONG'];
        const mappings = {
            'HA': { id: 'ling_thach_ha', val: 1 },
            'TRUNG': { id: 'ling_thach_trung', val: 100 },
            'THUONG': { id: 'ling_thach_thuong', val: 10000 },
            'CUC': { id: 'ling_thach_cuc', val: 1000000 }
        };

        for (const gradeId of priority) {
            if (gradeId === 'CUC' && this.spiritStoneSettings?.lockCucPham && amount < 1000000) continue;
            
            const info = mappings[gradeId];
            const item = this.inventory.allItems.find(i => i.id === info.id);
            
            if (item && item.quantity > 0) {
                const totalValAvailable = item.quantity * info.val;
                if (totalValAvailable >= remaining) {
                    const countToUse = Math.ceil(remaining / info.val);
                    const overpaid = (countToUse * info.val) - remaining;
                    
                    this.inventory.removeItem(info.id, countToUse);
                    remaining = 0;
                    
                    if (overpaid > 0) {
                        this.addLingShi(overpaid);
                    }
                    break;
                } else {
                    remaining -= totalValAvailable;
                    this.inventory.removeItem(info.id, item.quantity);
                }
            }
        }

        if (remaining === 0) {
            if (state.systems.cheat) {
                state.systems.cheat.onAction('spend_lingshi', amount);
            }
            return true;
        }
        return false;
    }

    addLingShi(amount) {
        if (amount <= 0) return;
        this.inventory.addItem('ling_thach_ha', amount);
    }

    addTuVi(amount) {
        // Khi đã Đại Viên Mãn và đang Nén Pháp Lực: tu vi thô → tinh thuần
        if (this.tuViState === 'condensing' && this.tuVi >= this._getCurrentRealmExpRequired()) {
            this.tinh_thuan += amount * 0.3; // 30% chuyển hóa thành tinh thuần
        } else {
            this.tuVi += amount;
        }
    }

    _getCurrentRealmExpRequired() {
        const realm = this.getCurrentRealm('tuvi');
        return realm ? realm.expRequired : Infinity;
    }


    refineSpiritStone(itemId) {
        if (!this.inventory.hasItem(itemId, 1)) return { success: false, msg: "Không có linh thạch này." };
        
        const item = getItemById(itemId);
        if (!item || item.type !== 'spirit_stone') return { success: false, msg: "Vật phẩm không phải linh thạch." };

        const mappings = {
            'ling_thach_ha': { gain: 50, msg: "Hấp thu linh khí từ Hạ Phẩm Linh Thạch." },
            'ling_thach_trung': { gain: 5000, msg: "Luyện hóa Trung Phẩm Linh Thạch, linh lực tràn đầy!" },
            'ling_thach_thuong': { gain: 500000, msg: "Thượng Phẩm Linh Thạch tan chảy, tu vi tăng mạnh!" },
            'ling_thach_cuc': { gain: 50000000, msg: "Cực Phẩm Linh Thạch! Đại đạo chí giản, tu vi tiến triển cực nhanh!" }
        };

        const config = mappings[itemId];
        if (!config) return { success: false, msg: "Loại linh thạch này không thể luyện hóa trực tiếp." };

        this.inventory.removeItem(itemId, 1);
        const gain = config.gain * (this.advancedStats.qiAbsorb || 1.0);
        this.tuVi += gain;
        
        return { success: true, msg: config.msg + ` (Tu vi +${Math.floor(gain).toLocaleString()})`, gain };
    }

    crushStone(itemId, count = 1) {
        const ss = state.systems.spiritStone;
        if (ss) {
            return ss.crushStone(itemId, count);
        }
        return { success: false, msg: "Hệ thống linh thạch chưa sẵn sàng." };
    }

    updateVipLevel() {
        // Simple VIP tiers
        if (this.totalSpent >= 10000000) this.vipLevel = 5;
        else if (this.totalSpent >= 1000000) this.vipLevel = 4;
        else if (this.totalSpent >= 100000) this.vipLevel = 3;
        else if (this.totalSpent >= 10000) this.vipLevel = 2;
        else if (this.totalSpent >= 1000) this.vipLevel = 1;
    }

    getComprehension() {
        let comp = this.comprehension || 10;
        if (this.specializedPaths?.confucian?.realmId > 0) {
            comp *= 1.25;
        }
        return comp;
    }

    getCurrentRealm(type = 'tuvi') {
        let id;
        if (type === 'tuvi') id = this.realmId;
        else if (type === 'body') id = this.bodyRealmId;
        else if (type === 'soul') id = this.soulRealmId;
        else if (this.specializedPaths && this.specializedPaths[type]) id = this.specializedPaths[type].realmId;
        else id = 0;
        
        if (type === 'body') return BODY_REALMS.find(r => r.id === id) || BODY_REALMS[0];
        if (type === 'soul') return SOUL_REALMS.find(r => r.id === id) || SOUL_REALMS[0];
        if (type === 'sword') return SWORD_PATH_REALMS.find(r => r.id === id) || SWORD_PATH_REALMS[0];
        if (type === 'soul_path') return SOUL_PATH_REALMS.find(r => r.id === id) || SOUL_PATH_REALMS[0];
        if (type === 'buddhist') return BUDDHIST_REALMS.find(r => r.id === id) || BUDDHIST_REALMS[0];
        if (type === 'confucian') return CONFUCIAN_REALMS.find(r => r.id === id) || CONFUCIAN_REALMS[0];

        let list = HUMAN_REALMS;
        const mainPath = this.mainPath || (this.race === 'YAO' ? 'yeu_tu' : this.race === 'DEMON' ? 'ma_dao' : 'orthodox');
        if (mainPath === 'ma_dao') list = DEMON_REALMS;
        else if (mainPath === 'quy_dao') list = GHOST_REALMS;
        else if (mainPath === 'yeu_tu') list = SPIRIT_BEAST_REALMS;
        
        let found = list.find(r => r.id === id);
        if (!found) {
            const maxRealm = list[list.length - 1];
            if (maxRealm && id > maxRealm.id) found = maxRealm;
            else found = list[0];
        }
        return found;
    }

    update(delta, multiplier = 1.0) {
        this.lastUpdate = Date.now();
        this.playTime = (this.playTime || 0) + delta;

        // Skip passive ticking and regeneration entirely if the player is currently in combat!
        if (typeof state !== 'undefined' && state.currentCombat) {
            return;
        }

        // 1. Calculate Stability & Heart Demon progression
        this.calculateStability();

        // 2. Apply Stability Effects
        let stabilityMult = 1.0;
        if (this.stability > 90) stabilityMult = 1.2;
        else if (this.stability < 40) stabilityMult = 0.8;
        
        // 3. Independent progression for all three paths
        const focus = this.cultivationFocus || 'tuvi';

        const hasTuviTech = !!this.mainTechniqueId;
        const hasBodyTech = !!this.mainBodyTechniqueId;
        const hasSoulTech = !!this.mainSoulTechniqueId;

        // Comprehension Multiplier
        const compMult = 1 + (this.getComprehension() / 100);

        let finalMultiplier = multiplier * stabilityMult * compMult;
        if (this.isSecluded) finalMultiplier *= 5.0; // 5x gain during seclusion

        let tuViGain = hasTuviTech ? this.tuViPerSecond * (focus === 'tuvi' ? 1.0 : 0.2) * finalMultiplier * delta : 0;
        const bodyGain = hasBodyTech ? this.bodyExpPerSecond * (focus === 'body' ? 1.0 : 0.2) * finalMultiplier * delta : 0;
        const soulGain = hasSoulTech ? this.soulExpPerSecond * (focus === 'soul' ? 1.0 : 0.2) * finalMultiplier * delta : 0;

        const mainPath = this.mainPath || 'orthodox';
        if (mainPath === 'ma_dao') {
            tuViGain *= 1.2;
        }

        this.tuVi += tuViGain;
        this.bodyExp += bodyGain;
        this.soulExp += soulGain;

        if (this.specializedPaths && this.specializedPaths[focus]) {
            const baseSpecRate = 5.0 + (this.getComprehension() * 0.2);
            const specGain = baseSpecRate * finalMultiplier * delta;
            this.specializedPaths[focus].exp += specGain;
        }

        // 4. Seclusion Events (Randomized)
        if (this.isSecluded && Math.random() < 0.02 * delta) { // ~2% chance per second
            this.triggerSeclusionEvent();
        }

        // 5. Đại Viên Mãn System (PNTT-style: không ép đột phá, chỉ tích áp lực)
        const realm = this.getCurrentRealm(focus);
        let exp = this.tuVi;
        if (focus === 'body') exp = this.bodyExp;
        else if (focus === 'soul') exp = this.soulExp;
        else if (this.specializedPaths && this.specializedPaths[focus]) {
            exp = this.specializedPaths[focus].exp;
        }

        if (focus === 'tuvi') {
            this._updateDaiVienManState(realm, exp, delta);
        } else if (focus === 'body') {
            this._updateBodyVienManState(realm, exp, delta);
        } else if (focus === 'soul') {
            this._updateSoulVienManState(realm, exp, delta);
        }
        
        // 6. Regen
        let regenMult = 1.0;
        if (this.stability < 20) regenMult = 0.2; // Heart Demon suppresses regen

        const finalHpRegenMult = regenMult * (this.hpRegenMult !== undefined ? this.hpRegenMult : 1.0);
        const finalManaRegenMult = regenMult * (this.manaRegenMult !== undefined ? this.manaRegenMult : 1.0);

        if (this.isSecluded) {
            this.stamina = Math.min(this.maxStamina, this.stamina + 0.1 * delta * regenMult);
            this.mana = Math.min(this.maxMana, this.mana + 0.05 * this.maxMana * delta * finalManaRegenMult);
            this.hp = Math.min(this.maxHp, this.hp + 0.01 * this.maxHp * delta * finalHpRegenMult);
        } else {
            this.stamina = Math.min(this.maxStamina, this.stamina + 0.01 * delta * regenMult);
            this.mana = Math.min(this.maxMana, this.mana + 0.001 * this.maxMana * delta * finalManaRegenMult);
            this.hp = Math.min(this.maxHp, this.hp + 0.0002 * this.maxHp * delta * finalHpRegenMult);
        }

        // 6b. Apply Periodic Status Effect Ticks (DOT & Lifespan drain)
        if (this.buffs) {
            this.buffs.forEach(b => {
                if (b.effects) {
                    const stacks = b.stacks || 1;
                    if (b.effects.dot_hp) {
                        const hpLoss = Math.abs(b.effects.dot_hp) * this.maxHp * delta * stacks;
                        this.hp = Math.max(1, this.hp - hpLoss);
                    }
                    if (b.effects.dot_mana) {
                        const manaLoss = Math.abs(b.effects.dot_mana) * this.maxMana * delta * stacks;
                        this.mana = Math.max(0, this.mana - manaLoss);
                    }
                    if (b.effects.burn_lifespan) {
                        const ageInc = b.effects.burn_lifespan * delta * stacks;
                        this.age = Math.min(this.maxAge || 200, this.age + ageInc);
                    }
                }
            });
        }

        // Update Buffs
        this.updateBuffs(delta);

        // Tick down deviation status
        if (this.deviationTime > 0) {
            const oldTime = this.deviationTime;
            this.deviationTime = Math.max(0, this.deviationTime - delta);
            if (this.deviationTime === 0 && oldTime > 0) {
                this.pendingEvents.push({
                    type: 'deviation_end',
                    msg: "Kinh mạch dần ổn định, trạng thái Tẩu Hỏa Nhập Ma đã biến mất!"
                });
                this.calculateStats();
            }
        }

        // Tick technique and secret manual comprehension
        this.tickComprehendingTechniques(delta);

        // 8. Passive Mastery Gain for equipped techniques
        this.tickPassiveMastery(delta);

        // 7. Mortality Check
        this.checkMortality();
    }

    checkMortality() {
        if (this.age >= this.maxAge) {
            // Trigger Death
            if (window.game && window.game.handleDeath) {
                window.game.handleDeath("Thọ nguyên đã cạn, đại hạn đã tới. Ngươi đã hóa thành cát bụi giữa hồng trần...");
            }
        }
    }

    /**
     * Passive mastery accumulation per tick for all equipped techniques.
     * Rate scales with Ngộ Tính (comprehension), elemental compatibility, quality penalty,
     * and any active Ngộ Đạo Trà buff.
     */
    tickPassiveMastery(delta) {
        const equippedIds = [
            this.mainTechniqueId,
            this.mainBodyTechniqueId,
            this.mainSoulTechniqueId
        ].filter(Boolean);

        if (equippedIds.length === 0) return;

        // Mastery speed buff multiplier from Ngộ Đạo Trà
        const now = Date.now();
        let masteryBuffMult = 1.0;
        if (this.buffs) {
            const mastBuff = this.buffs.find(b => b.stat === 'mastery_speed' && b.endTime > now);
            if (mastBuff) masteryBuffMult = mastBuff.value;
        }

        // Comprehension multiplier: 50 comp = 1x, 100 comp = 1.5x, etc.
        const compMult = 1.0 + (this.getComprehension() || 30) / 100;

        // Base rate: gain ~1 mastery point every 100 seconds at 50 comp (no buffs)
        // This means full Nhập Môn -> Tiểu Thành (1000 pts) takes ~100,000s ≈ 28 hours passive
        const baseRate = 0.01; // points per second

        equippedIds.forEach(tid => {
            const entry = this.learnedTechniques ? this.learnedTechniques.find(t => t.id === tid) : null;
            if (!entry) return;

            // Quality penalty: higher-grade techniques are harder to master passively
            let qualityPenalty = 1.0;
            if (typeof getTechniqueById === 'function') {
                const techData = getTechniqueById(tid);
                if (techData && techData.grade) {
                    const gradePenalties = { 'ha': 1.0, 'trung': 0.8, 'thuong': 0.6, 'cuc': 0.4, 'thien': 0.2 };
                    qualityPenalty = gradePenalties[techData.grade] || 1.0;
                }
            }

            // Calculate final rate
            const rate = baseRate * compMult * masteryBuffMult * qualityPenalty;
            const gain = rate * delta;

            entry.mastery = (entry.mastery || 0) + gain;

            // Update mastery level threshold (import is already at top of file)
            // Use the MASTERY_LEVELS that's imported at the top of player.js
            if (typeof MASTERY_LEVELS !== 'undefined') {
                const currentMastery = MASTERY_LEVELS.filter(m => entry.mastery >= m.threshold).pop();
                if (currentMastery && currentMastery.id > (entry.masteryLevel || 1)) {
                    entry.masteryLevel = currentMastery.id;
                    this.pendingEvents.push({
                        type: 'seclusion_event',
                        eventType: 'insight',
                        msg: `✨ [ĐỘ THUẦN THỤC TĂNG CẤP] Sau bao năm dày công tu luyện, công pháp đã đạt đến cảnh giới ${currentMastery.name}!`
                    });
                }
            }
        });
    }


    triggerSeclusionEvent() {
        const events = [
            { type: 'insight', msg: "Ngươi đột nhiên ngộ ra một tia thiên địa quy tắc, tu vi tinh tiến!", effect: () => { this.tuVi += this.tuViPerSecond * 300; } },
            { type: 'qi_riot', msg: "Linh khí bạo động! Kinh mạch bị tổn thương nhẹ.", effect: () => { this.hp -= this.maxHp * 0.1; this.stability -= 10; } },
            { type: 'heart_demon', msg: "Tâm ma xuất hiện quấy nhiễu, đạo tâm lung lay.", effect: () => { this.heartDemon += 5; this.stability -= 15; } },
            { type: 'deep_trance', msg: "Ngươi rơi vào trạng thái thâm tầng định cảnh, ngộ tính tăng nhẹ.", effect: () => { this.comprehension += 0.1; } }
        ];
        const event = events[Math.floor(Math.random() * events.length)];
        event.effect();
        this.pendingEvents.push({ type: 'seclusion_event', msg: event.msg, eventType: event.type });
    }

    _updateDaiVienManState(realm, exp, delta) {
        if (this.tuVi < realm.expRequired) {
            if (this.tuViState !== 'accumulating') {
                this.tuViState = 'accumulating';
                this.thoiGianDaiVienMan = 0;
                this.thien_dao_ap_luc = 0;
                this.removeStatusEffect('ap_luc_thien_dao');
                this.removeStatusEffect('linh_khi_qua_tai');
                this.removeStatusEffect('chan_nguyen_bao_dong');
            }
            return;
        }

        // It is full!
        if (this.tuViState === 'accumulating') {
            this.tuViState = 'full';
            this.thoiGianDaiVienMan = 0;
            this.thien_dao_ap_luc = 0;
            this.pendingEvents.push({
                type: 'seclusion_event',
                eventType: 'insight',
                msg: `⚡ Cảnh giới của ngươi đã đạt đến [Đại Viên Mãn]! Thiên địa linh khí bão hòa, ngươi có thể Đột Phá ngay hoặc lựa chọn Củng Cố Căn Cơ / Nén Pháp Lực.`
            });
        }

        // Cap tuVi at expRequired if state is full or condensing
        if (this.tuViState === 'full' || this.tuViState === 'condensing') {
            this.tuVi = realm.expRequired;
        }

        // Calculate game time passed
        let gameMinutesPassed = 0;
        if (typeof state !== 'undefined' && state.systems && state.systems.time) {
            const timeSys = state.systems.time;
            gameMinutesPassed = delta * (timeSys.timeMultiplier || 2.0) / ((timeSys.tickRate || 10000) / 1000);
        } else {
            gameMinutesPassed = delta * 0.2;
        }

        this.thoiGianDaiVienMan += gameMinutesPassed;
        this.thien_dao_ap_luc = this.calculateThienDaoApLuc(this.thoiGianDaiVienMan);

        // Apply or remove ap_luc_thien_dao debuff
        if (this.thien_dao_ap_luc >= 25) {
            if (!this.hasStatusEffect('ap_luc_thien_dao')) {
                this.addStatusEffect('ap_luc_thien_dao', Infinity, 'Thiên Đạo');
            }
        } else {
            if (this.hasStatusEffect('ap_luc_thien_dao')) {
                this.removeStatusEffect('ap_luc_thien_dao');
            }
        }

        // Apply or remove linh_khi_qua_tai debuff
        if (this.thoiGianDaiVienMan >= 2160) {
            if (!this.hasStatusEffect('linh_khi_qua_tai')) {
                this.addStatusEffect('linh_khi_qua_tai', Infinity, 'Tu Vi Quá Đầy');
            }
        } else {
            if (this.hasStatusEffect('linh_khi_qua_tai')) {
                this.removeStatusEffect('linh_khi_qua_tai');
            }
        }

        // Heart demon passive growth based on Heavenly Dao pressure
        if (this.thien_dao_ap_luc > 0) {
            const factor = 0.0005;
            this.heartDemon = Math.min(100, this.heartDemon + this.thien_dao_ap_luc * delta * factor);
        }

        // Random risk of Qi Deviation or Heart Demon attacks when pressure is high
        if (this.thien_dao_ap_luc > 10) {
            const deviationChance = 0.0002 * (this.thien_dao_ap_luc / 10) * delta;
            if (Math.random() < deviationChance) {
                const stabilityLoss = Math.floor(this.thien_dao_ap_luc * 0.1) + 1;
                this.stability = Math.max(0, this.stability - stabilityLoss);
                this.hp = Math.max(1, this.hp - this.maxHp * 0.05);
                this.pendingEvents.push({
                    type: 'seclusion_event',
                    eventType: 'qi_riot',
                    msg: `⚠️ [CƠ THỂ QUÁ TẢI] Ở trạng thái Đại Viên Mãn quá lâu, áp lực Thiên Đạo quấn thân làm chân nguyên hỗn loạn! (HP -5%, Độ Ổn Định -${stabilityLoss}%)`
                });
            }
        }

        // Minor lightning tribulation strike when pressure exceeds 50%
        if (this.thien_dao_ap_luc >= 50) {
            const strikeChance = 0.0005 * delta;
            if (Math.random() < strikeChance) {
                const dmg = Math.floor(this.maxHp * 0.2);
                this.hp = Math.max(1, this.hp - dmg);
                this.stability = Math.max(0, this.stability - 10);
                this.addStatusEffect('thien_loi_gia_than', 300, 'Thiên Lôi Đánh Trúng');
                this.pendingEvents.push({
                    type: 'seclusion_event',
                    eventType: 'tribulation_strike',
                    msg: `⚡ [THIÊN LÔI ĐÁNH TRÚNG] Áp lực Thiên Đạo quá cao kích hoạt tiểu thiên kiếp! Một tia sét thiên lôi đột ngột giáng xuống! (HP -20%, Độ Ổn Định -10%, Nhận trạng thái Thiên Lôi Gia Thân)`
                });
            }
        }
    }

    /**
     * Luyện Thể Viên Mãn — Thiên Địa quản
     * Không có Thiên Kiếp, chỉ có tổn thương khí huyết nội tại nếu không đột phá kịp.
     * 100% = Viên Mãn | 120% = Cực Hạn | 150% = Tuyệt Đỉnh (cap cứng)
     */
    _updateBodyVienManState(realm, exp, delta) {
        const pct = exp / realm.expRequired;

        if (pct < 1.0) {
            // Chưa đủ — reset về bình thường
            if (this.bodyState !== 'accumulating') {
                this.bodyState = 'accumulating';
                this.khi_huyet_ap_luc = 0;
                this.thoiGianBodyVienMan = 0;
                this.removeStatusEffect('khi_huyet_bao_dong');
                this.removeStatusEffect('kinh_mach_ton_thuong');
            }
            return;
        }

        // Vừa đạt Viên Mãn lần đầu
        if (this.bodyState === 'accumulating') {
            this.bodyState = 'full';
            this.thoiGianBodyVienMan = 0;
            this.khi_huyet_ap_luc = 0;
            this.pendingEvents.push({
                type: 'seclusion_event',
                eventType: 'body_vien_man',
                msg: `🔴 [KHÍ HUYẾT VIÊN MÃN] Nhục thân đã đạt cực hạn cảnh giới này! Ngươi có thể Thuế Biến ngay hoặc tiếp tục tích lũy Khí Huyết lên Cực Hạn (120%) / Tuyệt Đỉnh (150%) để tăng thêm tiềm năng — nhưng rủi ro Khí Huyết Bạo Động sẽ tăng theo.`
            });
        }

        // Tuyệt Đỉnh: cap cứng ở 150%
        if (pct >= 1.5) {
            this.bodyExp = realm.expRequired * 1.5;
        }

        // Game time tracking
        let gameMinutesPassed = 0;
        if (typeof state !== 'undefined' && state.systems && state.systems.time) {
            const timeSys = state.systems.time;
            gameMinutesPassed = delta * (timeSys.timeMultiplier || 2.0) / ((timeSys.tickRate || 10000) / 1000);
        } else {
            gameMinutesPassed = delta * 0.2;
        }
        this.thoiGianBodyVienMan += gameMinutesPassed;

        // Khí huyết áp lực tăng tuyến tính theo mức tích lũy vượt chuẩn
        if (pct >= 1.0) {
            const overflowPct = Math.min(1.0, (pct - 1.0) / 0.5); // 0 tại 100%, 1.0 tại 150%
            const timeFactor = Math.min(1.0, this.thoiGianBodyVienMan / 2160); // 6 tháng
            this.khi_huyet_ap_luc = Math.min(100, overflowPct * 60 + timeFactor * 40);
        }

        // Khí Huyết Bạo Động debuff khi áp lực >= 25
        if (this.khi_huyet_ap_luc >= 25) {
            if (!this.hasStatusEffect('khi_huyet_bao_dong')) {
                this.addStatusEffect('khi_huyet_bao_dong', Infinity, 'Khí Huyết Bạo Động');
            }
        } else {
            if (this.hasStatusEffect('khi_huyet_bao_dong')) {
                this.removeStatusEffect('khi_huyet_bao_dong');
            }
        }

        // Kinh Mạch Tổn Thương debuff sau 3 tháng ở Viên Mãn
        if (this.thoiGianBodyVienMan >= 1080) {
            if (!this.hasStatusEffect('kinh_mach_ton_thuong')) {
                this.addStatusEffect('kinh_mach_ton_thuong', Infinity, 'Không Đột Phá Kịp Thời');
            }
        } else {
            if (this.hasStatusEffect('kinh_mach_ton_thuong')) {
                this.removeStatusEffect('kinh_mach_ton_thuong');
            }
        }

        // Random backlash khi tích lên Tuyệt Đỉnh hoặc áp lực cao
        if (this.khi_huyet_ap_luc >= 40) {
            const backlashChance = 0.0003 * (this.khi_huyet_ap_luc / 40) * delta;
            if (Math.random() < backlashChance) {
                const dmg = Math.floor(this.maxHp * 0.08);
                this.hp = Math.max(1, this.hp - dmg);
                const events = [
                    `💢 [NỨT CƠ] Khí huyết bạo trướng làm gân thịt nứt vỡ! (HP -${dmg})`,
                    `💥 [RẠN XƯƠNG] Cốt tủy chịu không nổi khí huyết cuồng nhiệt! (HP -${dmg})`,
                    `⚡ [KINH MẠCH TỔN THƯƠNG] Kinh lạc bị ép đến vỡ, khí huyết tản loạn! (HP -${dmg})`,
                ];
                this.pendingEvents.push({
                    type: 'seclusion_event',
                    eventType: 'body_backlash',
                    msg: events[Math.floor(Math.random() * events.length)]
                });
            }
        }
    }

    /**
     * Thần Thức Viên Mãn — Thần Hồn quản
     * Không có Thiên Kiếp, nhưng thần hồn quá tải lâu dài gây tâm ma, huyễn cảnh, mất trí nhớ.
     * 100% = Viên Mãn | 120% = Cực Hạn | 150% = Tuyệt Đỉnh (cap cứng)
     */
    _updateSoulVienManState(realm, exp, delta) {
        const pct = exp / realm.expRequired;

        if (pct < 1.0) {
            if (this.soulState !== 'accumulating') {
                this.soulState = 'accumulating';
                this.than_hon_qua_tai = 0;
                this.thoiGianSoulVienMan = 0;
                this.removeStatusEffect('than_hon_qua_tai_debuff');
                this.removeStatusEffect('huyen_canh');
            }
            return;
        }

        // Vừa đạt Viên Mãn lần đầu
        if (this.soulState === 'accumulating') {
            this.soulState = 'full';
            this.thoiGianSoulVienMan = 0;
            this.than_hon_qua_tai = 0;
            this.pendingEvents.push({
                type: 'seclusion_event',
                eventType: 'soul_vien_man',
                msg: `🌌 [THẦN HỒN VIÊN MÃN] Thần hồn đã viên mãn, sẵn sàng lột xác thăng cấp! Có thể đột phá ngay hoặc tiếp tục nén lên Cực Hạn (120%) / Tuyệt Đỉnh (150%) — nhưng thần hồn quá tải lâu sẽ sinh Tâm Ma và Huyễn Cảnh.`
            });
        }

        // Tuyệt Đỉnh: cap cứng ở 150%
        if (pct >= 1.5) {
            this.soulExp = realm.expRequired * 1.5;
        }

        // Game time tracking
        let gameMinutesPassed = 0;
        if (typeof state !== 'undefined' && state.systems && state.systems.time) {
            const timeSys = state.systems.time;
            gameMinutesPassed = delta * (timeSys.timeMultiplier || 2.0) / ((timeSys.tickRate || 10000) / 1000);
        } else {
            gameMinutesPassed = delta * 0.2;
        }
        this.thoiGianSoulVienMan += gameMinutesPassed;

        // Thần hồn quá tải tăng theo mức tích lũy và thời gian
        if (pct >= 1.0) {
            const overflowPct = Math.min(1.0, (pct - 1.0) / 0.5); // 0 tại 100%, 1.0 tại 150%
            const timeFactor = Math.min(1.0, this.thoiGianSoulVienMan / 2160); // 6 tháng
            this.than_hon_qua_tai = Math.min(100, overflowPct * 50 + timeFactor * 50);
        }

        // Thần Hồn Quá Tải debuff khi >= 25
        if (this.than_hon_qua_tai >= 25) {
            if (!this.hasStatusEffect('than_hon_qua_tai_debuff')) {
                this.addStatusEffect('than_hon_qua_tai_debuff', Infinity, 'Thần Hồn Ứ Đọng');
            }
        } else {
            if (this.hasStatusEffect('than_hon_qua_tai_debuff')) {
                this.removeStatusEffect('than_hon_qua_tai_debuff');
            }
        }

        // Tâm ma tăng thụ động do thần hồn quá tải
        if (this.than_hon_qua_tai > 0) {
            this.heartDemon = Math.min(100, this.heartDemon + this.than_hon_qua_tai * 0.0003 * delta);
        }

        // Huyễn Cảnh ngẫu nhiên sau 3 tháng
        if (this.than_hon_qua_tai >= 40) {
            const illusionChance = 0.0002 * (this.than_hon_qua_tai / 40) * delta;
            if (Math.random() < illusionChance) {
                this.addStatusEffect('huyen_canh', 120, 'Thần Hồn Quá Tải');
                this.heartDemon = Math.min(100, this.heartDemon + 5);
                const events = [
                    `🌀 [HUYỄN CẢNH] Thần hồn ứ đọng, huyễn cảnh xuất hiện — tâm thần lung lay! (Tâm Ma +5, nhận trạng thái Huyễn Cảnh)`,
                    `👁️ [TÂM MA XÂM THỰC] Thần hải quá tải, tâm ma thừa cơ xâm nhập thần hồn! (Tâm Ma +5)`,
                    `🧠 [THẦN HẢI NỨT VỠ] Thần thức cưỡng ép quá giới hạn, thần hải xuất hiện vết nứt! (Tâm Ma +5, Độ Ổn Định giảm)`,
                ];
                this.stability = Math.max(0, this.stability - 5);
                this.pendingEvents.push({
                    type: 'seclusion_event',
                    eventType: 'soul_overload',
                    msg: events[Math.floor(Math.random() * events.length)]
                });
            }
        }
    }

    calculateThienDaoApLuc(gameMinutes) {
        const ONE_MONTH = 360;
        const THREE_MONTHS = 1080;
        const SIX_MONTHS = 2160;
        const ONE_YEAR = 4320;
        const TWO_YEARS = 8640;

        if (gameMinutes <= ONE_MONTH) {
            return 0;
        } else if (gameMinutes <= THREE_MONTHS) {
            const pct = (gameMinutes - ONE_MONTH) / (THREE_MONTHS - ONE_MONTH);
            return pct * 10;
        } else if (gameMinutes <= SIX_MONTHS) {
            const pct = (gameMinutes - THREE_MONTHS) / (SIX_MONTHS - THREE_MONTHS);
            return 10 + pct * 15;
        } else if (gameMinutes <= ONE_YEAR) {
            const pct = (gameMinutes - SIX_MONTHS) / (ONE_YEAR - SIX_MONTHS);
            return 25 + pct * 25;
        } else {
            const pct = Math.min(1.0, (gameMinutes - ONE_YEAR) / (TWO_YEARS - ONE_YEAR));
            return 50 + pct * 50;
        }
    }

    calculateStability() {
        // Stability decreases if Tu Vi is too far ahead of Body or Soul
        const avgOthers = (this.bodyRealmId + this.soulRealmId) / 2;
        const diff = this.realmId - avgOthers;
        
        let targetStability = 100;
        if (diff > 2) targetStability = 100 - (diff - 2) * 10;
        
        const mainPath = this.mainPath || 'orthodox';
        if (mainPath === 'ma_dao') {
            targetStability -= 15;
        }

        targetStability = Math.max(0, Math.min(100, targetStability));

        // Smooth transition
        let decayRate = 0.1;
        let recoveryRate = 0.05;
        
        if (this.specializedPaths?.buddhist?.realmId > 0) {
            decayRate *= 0.5;
            recoveryRate *= 2.0;
            targetStability = Math.min(100, targetStability + 10);
        }
        
        if (mainPath === 'ma_dao') {
            decayRate *= 1.5;
        }

        if (this.stability > targetStability) this.stability -= decayRate;
        else if (this.stability < targetStability) this.stability += recoveryRate;

        // Heart Demon growth if stability is low
        if (this.stability < 30) {
            this.heartDemon += this.mainDualId ? 0.025 : 0.01;
        } else {
            this.heartDemon = Math.max(0, this.heartDemon - (this.mainDualId ? 0.002 : 0.005));
        }

        // Song Tu (Dual Cultivation) risks and benefits
        if (this.mainDualId) {
            // If stability is low, high risk of tẩu hỏa nhập ma
            if (this.stability < 30 && this.deviationTime <= 0) {
                if (Math.random() < 0.005) { // 0.5% chance per second tick
                    this.deviationTime = 300; // 5 minutes (300 seconds)
                    this.hp = Math.max(1, this.hp - this.maxHp * 0.2);
                    this.pendingEvents.push({
                        type: 'deviation_start',
                        msg: "🔴 Tâm Cảnh suy sụp! Song Tu Linh Lực phản phệ, đạo tâm của ngươi bị tà khí xâm lấn, rơi vào trạng thái Tẩu Hỏa Nhập Ma!"
                    });
                    this.calculateStats();
                }
            }
        }
    }

    updateBuffs(delta) {
        if (!this.buffs || this.buffs.length === 0) return;
        
        const now = Date.now();
        const beforeCount = this.buffs.length;
        
        this.buffs.forEach(b => {
            if (b.duration !== undefined && b.duration !== null && b.duration !== Infinity) {
                b.duration = Math.max(0, b.duration - delta);
                b.endTime = now + b.duration * 1000;
            }
        });

        // Filter out expired status effects
        this.buffs = this.buffs.filter(b => {
            if (b.duration !== undefined) {
                return b.duration > 0 || b.duration === Infinity;
            }
            return b.endTime > now;
        });
        
        if (this.buffs.length !== beforeCount) {
            this.calculateStats();
        }
    }

    addBuff(buff) {
        // Legacy buff compatibility
        const endTime = Date.now() + (buff.duration || 0);
        const index = this.buffs.findIndex(b => b.id === buff.id);
        if (index > -1) {
            this.buffs[index].endTime = endTime;
            this.buffs[index].value = buff.value;
        } else {
            this.buffs.push({
                ...buff,
                endTime
            });
        }
        this.calculateStats();
    }

    addStatusEffect(effectId, duration = null, source = "Chiến đấu") {
        const config = getStatusEffectById(effectId);
        if (!config) return;

        const existingIndex = this.buffs.findIndex(b => b.id === effectId);
        const finalDuration = duration !== null ? duration : config.duration;
        const now = Date.now();
        const endTime = finalDuration === Infinity ? Infinity : now + finalDuration * 1000;

        if (existingIndex > -1) {
            const effect = this.buffs[existingIndex];
            effect.stacks = Math.min(config.maxStacks || 1, (effect.stacks || 1) + 1);
            effect.duration = finalDuration;
            effect.endTime = endTime;
        } else {
            this.buffs.push({
                id: config.id,
                name: config.name,
                category: config.category,
                type: config.type,
                icon: config.icon,
                desc: config.desc,
                maxStacks: config.maxStacks || 1,
                stacks: 1,
                duration: finalDuration,
                combatTurns: config.combatTurns,
                isCureable: config.isCureable,
                effects: config.effects,
                source: source,
                startTime: now,
                endTime: endTime
            });
        }
        this.calculateStats();
    }

    removeStatusEffect(effectId) {
        const beforeCount = this.buffs.length;
        this.buffs = this.buffs.filter(b => b.id !== effectId);
        if (this.buffs.length !== beforeCount) {
            this.calculateStats();
        }
    }

    hasStatusEffect(effectId) {
        return this.buffs.some(b => b.id === effectId);
    }

    getStatusEffect(effectId) {
        return this.buffs.find(b => b.id === effectId) || null;
    }


    // --- Fate Methods ---
    addReputation(amount) {
        this.fate.reputation += amount;
    }

    addMorality(amount) {
        this.fate.morality = Math.max(-2000, Math.min(2000, this.fate.morality + amount));
    }

    addKarma(sin, merit) {
        this.fate.sin += sin;
        this.fate.merit += merit;
    }

    addKarmaLink(link) {
        // link: { id, type, npcId, description }
        this.fate.karmaLinks.push({
            ...link,
            timestamp: Date.now()
        });
    }

    killNPC(npcId) {
        if (!state.systems.npc) return;
        const npcSystem = state.systems.npc;
        const npc = npcSystem.npcs.find(n => n.id === npcId);
        if (npc) {
            npc.hp = 0;
            npcSystem.handleKarmaFallout(npc, this);
            
            // Add sin for killing an NPC (can be modified based on morality)
            this.addKarma(50, 0); 

            // Loot NPC
            let lootMsg = '';
            if (npc.lingShi > 0) {
                this.addLingShi(npc.lingShi);
                lootMsg += `💎 ${npc.lingShi} Linh thạch`;
            }
            if (npc.inventory && npc.inventory.length > 0) {
                for (const item of npc.inventory) {
                    if (window.game && window.game.receiveItem) {
                        window.game.receiveItem(item.id, item.quantity);
                    }
                }
                if (lootMsg) lootMsg += ' và ';
                lootMsg += `${npc.inventory.length} loại bảo vật`;
            }

            if (npcSystem.addNews) {
                npcSystem.addNews(`[Sát Trận] ${this.name} đã nhẫn tâm tiêu diệt ${npc.name}, cướp sạch tài sản!`);
            }
            
            this.pendingEvents.push({
                type: 'npc_killed',
                msg: `Bạn đã tiêu diệt ${npc.name}. Nhân quả đã được gieo xuống... ${lootMsg ? `\nThu hoạch: ${lootMsg}` : ''}`
            });
        }
    }

    unlockTitle(titleId) {
        if (!this.fate.titles.includes(titleId)) {
            this.fate.titles.push(titleId);
            return true;
        }
        return false;
    }

    equipTitle(titleId) {
        if (this.fate.titles.includes(titleId) || titleId === null) {
            this.fate.activeTitleId = titleId;
            this.calculateStats();
            return true;
        }
        return false;
    }

    cultivate(efficiency = 1.0) {
        const focus = this.cultivationFocus || 'tuvi';
        
        // Require technique to cultivate
        const hasTech = (focus === 'tuvi' && this.mainTechniqueId) || 
                        (focus === 'body' && this.mainBodyTechniqueId) || 
                        (focus === 'soul' && this.mainSoulTechniqueId);
        
        if (!hasTech) {
            return { success: false, reason: "Ngươi chưa có công pháp phù hợp để dẫn dắt linh lực!" };
        }

        const costs = {
            tuvi: { stamina: 1, mana: 0 },
            body: { stamina: 2, mana: 0 },
            soul: { stamina: 0.5, mana: 5 }
        };
        const cost = costs[focus] || costs.tuvi;

        if (this.stamina >= cost.stamina && this.mana >= cost.mana) {
            this.stamina -= cost.stamina;
            this.mana -= cost.mana;
            
            // Influence of Spiritual Root (1.0 to 3.0x)
            const rootMult = (this.spiritualRoot && this.spiritualRoot.multiplier) ? this.spiritualRoot.multiplier : 1.0;
            const luckBonus = ((this.luck || 50) / 100) * 0.2; // Max 20% bonus from luck
            
            // Random variance (0.9x to 1.1x)
            const variance = 0.9 + Math.random() * 0.2;
            
            const totalMult = rootMult * (1 + luckBonus) * variance * efficiency;

            let gain = 0;
            // Minimum gain = 1.5% of current realm requirement, so early game always shows visible progress
            const realm = this.getCurrentRealm(focus);
            const minGain = Math.max(1, Math.floor((realm.expRequired || 500) * 0.015));
            if (focus === 'tuvi') {
                gain = Math.max(minGain, this.tuViPerSecond * 3 * totalMult);
                this.tuVi += gain;
            } else if (focus === 'body') {
                gain = Math.max(minGain, this.bodyExpPerSecond * 12 * totalMult);
                this.bodyExp += gain;
            } else if (focus === 'soul') {
                gain = Math.max(minGain, this.soulExpPerSecond * 12 * totalMult);
                this.soulExp += gain;
            }

            // Increment meridian cycle step
            if (!this.meridianCycles) {
                this.meridianCycles = {
                    tuvi: { step: 0, count: 0 },
                    body: { step: 0, count: 0 },
                    soul: { step: 0, count: 0 }
                };
            }
            const cycle = this.meridianCycles[focus] || { step: 0, count: 0 };
            let currentRealmId = this.realmId;
            if (focus === 'body') currentRealmId = this.bodyRealmId;
            else if (focus === 'soul') currentRealmId = this.soulRealmId;
            else if (this.specializedPaths && this.specializedPaths[focus]) {
                currentRealmId = this.specializedPaths[focus].realmId;
            }
            const subRealms = getSubRealmsOfCurrent(currentRealmId, focus, this.race, this.mainPath);
            const maxSteps = subRealms.length > 1 ? subRealms.length : 10;
            cycle.step = (cycle.step + 1) % maxSteps;
            
            let cycleCompleted = false;
            let cycleBonus = 0;
            if (cycle.step === 0) {
                cycle.count++;
                cycleCompleted = true;
                
                // Award cycle completion bonus: equivalent to 10 seconds of passive gains
                const baseRates = {
                    tuvi: this.tuViPerSecond,
                    body: this.bodyExpPerSecond,
                    soul: this.soulExpPerSecond
                };
                const baseRate = baseRates[focus] || 1;
                cycleBonus = baseRate * 12 * totalMult;
                
                if (focus === 'tuvi') {
                    this.tuVi += cycleBonus;
                } else if (focus === 'body') {
                    this.bodyExp += cycleBonus;
                } else if (focus === 'soul') {
                    this.soulExp += cycleBonus;
                }
            }
            this.meridianCycles[focus] = cycle;

            let msg = '';
            if (focus === 'tuvi') {
                msg = cycleCompleted 
                    ? `Chu thiên đại tuần hoàn hoàn tất! Lĩnh ngộ đại đạo (+${Math.floor(cycleBonus).toLocaleString()} Exp)` 
                    : "Tu luyện thành công.";
            } else if (focus === 'body') {
                msg = cycleCompleted 
                    ? `Tôi cốt viên mãn! Tôi Thể Hoàn Tất (+${Math.floor(cycleBonus).toLocaleString()} Exp)` 
                    : "Tôi cốt thành công.";
            } else if (focus === 'soul') {
                msg = cycleCompleted 
                    ? `Tụ hồn ngưng tụ! Thần Niệm Thông Đạt (+${Math.floor(cycleBonus).toLocaleString()} Exp)` 
                    : "Định thần thành công.";
            }

            return { 
                success: true, 
                msg, 
                gain, 
                type: focus,
                cycleCompleted,
                cycleBonus,
                step: cycle.step,
                count: cycle.count
            };
        }
        return { success: false, reason: `Không đủ tiêu hao để tu luyện (${cost.stamina} thể lực, ${cost.mana} linh lực).` };
    }

    absorbBubble(rawName, type = 'tuvi', sizeMult = 1.0) {
        const focus = type;
        
        // Influence of Spiritual Root (1.0 to 3.0x)
        const rootMult = (this.spiritualRoot && this.spiritualRoot.multiplier) ? this.spiritualRoot.multiplier : 1.0;
        const luckBonus = ((this.luck || 50) / 100) * 0.2; // Max 20% bonus from luck
        const totalMult = rootMult * (1 + luckBonus);
        
        let elementMult = 1.0;
        
        // Different multipliers and logic per focus type
        if (focus === 'tuvi') {
            // Check element match via elements array (more reliable than name string matching)
            const rootElements = (this.spiritualRoot && this.spiritualRoot.elements) ? this.spiritualRoot.elements : [];
            if (rootElements.includes(rawName)) {
                elementMult = 1.5;
            } else if (this.spiritualRoot && this.spiritualRoot.name && this.spiritualRoot.name.includes(rawName)) {
                // Fallback: name-based check for compatibility
                elementMult = 1.5;
            }
        } else if (focus === 'body') {
            // Body refiner has a bonus based on special physique
            if (this.physique && this.physique.name) {
                elementMult = 1.3;
            }
        } else if (focus === 'soul') {
            // Soul refiner has a bonus based on active Titles / Soul Talents
            if (this.fate && this.fate.titles && this.fate.titles.length > 0) {
                elementMult = 1.3;
            }
        }
        
        // Minimum gain = 2% of current realm requirement scaled by bubble size
        const bubbleRealm = this.getCurrentRealm(focus);
        const minBubbleGain = Math.max(1, Math.floor((bubbleRealm.expRequired || 500) * 0.02 * sizeMult));

        // Exp gain (free from stamina/mana cost)
        let baseExp = 0;
        if (focus === 'tuvi') {
            baseExp = Math.max(minBubbleGain, this.tuViPerSecond * 3 * totalMult * elementMult * sizeMult);
            this.tuVi += baseExp;
        } else if (focus === 'body') {
            baseExp = Math.max(minBubbleGain, this.bodyExpPerSecond * 12 * totalMult * elementMult);
            this.bodyExp += baseExp;
        } else if (focus === 'soul') {
            baseExp = Math.max(minBubbleGain, this.soulExpPerSecond * 12 * totalMult * elementMult);
            this.soulExp += baseExp;
        } else if (this.specializedPaths && this.specializedPaths[focus]) {
            const baseSpecRate = 5.0 + (this.getComprehension() * 0.2);
            baseExp = Math.max(minBubbleGain, baseSpecRate * 3 * totalMult * elementMult * sizeMult);
            this.specializedPaths[focus].exp += baseExp;
        }
        
        // Increment cultivation steps
        if (!this.meridianCycles) {
            this.meridianCycles = {
                tuvi: { step: 0, count: 0 },
                body: { step: 0, count: 0 },
                soul: { step: 0, count: 0 }
            };
        }
        const cycle = this.meridianCycles[focus] || { step: 0, count: 0 };
        let currentRealmId = this.realmId;
        if (focus === 'body') currentRealmId = this.bodyRealmId;
        else if (focus === 'soul') currentRealmId = this.soulRealmId;
        else if (this.specializedPaths && this.specializedPaths[focus]) {
            currentRealmId = this.specializedPaths[focus].realmId;
        }
        const subRealms = getSubRealmsOfCurrent(currentRealmId, focus, this.race, this.mainPath);
        const maxSteps = subRealms.length > 1 ? subRealms.length : 10;
        cycle.step = (cycle.step + 1) % maxSteps;
        
        let cycleCompleted = false;
        let cycleBonus = 0;
        if (cycle.step === 0) {
            cycle.count++;
            cycleCompleted = true;
            
            // Award cycle completion bonus
            const baseRates = {
                tuvi: this.tuViPerSecond,
                body: this.bodyExpPerSecond,
                soul: this.soulExpPerSecond
            };
            const baseRate = baseRates[focus] || 1;
            cycleBonus = baseRate * 12 * totalMult * elementMult;
            
            if (focus === 'tuvi') {
                this.tuVi += cycleBonus;
            } else if (focus === 'body') {
                this.bodyExp += cycleBonus;
            } else if (focus === 'soul') {
                this.soulExp += cycleBonus;
            }
        }
        this.meridianCycles[focus] = cycle;
        
        // Formulate custom lore-friendly success messages
        let msg = '';
        if (focus === 'tuvi') {
            msg = cycleCompleted
                ? `Hấp thu ${rawName} Linh Khí! Đại chu thiên hoàn tất (+${Math.floor(cycleBonus).toLocaleString()} Exp)`
                : `Hấp thu ${rawName} Linh Khí (+${Math.floor(baseExp).toLocaleString()} Exp)`;
        } else if (focus === 'body') {
            msg = cycleCompleted
                ? `Dẫn nhập ${rawName}! Tôi Thể Hoàn Tất (+${Math.floor(cycleBonus).toLocaleString()} Exp)`
                : `Hấp thu ${rawName} tôi cốt (+${Math.floor(baseExp).toLocaleString()} Exp)`;
        } else if (focus === 'soul') {
            msg = cycleCompleted
                ? `Định thần ${rawName}! Thần Niệm Thông Đạt (+${Math.floor(cycleBonus).toLocaleString()} Exp)`
                : `Tụ hợp ${rawName} hồn quang (+${Math.floor(baseExp).toLocaleString()} Exp)`;
        }
        
        return {
            success: true,
            gain: baseExp,
            type: focus,
            cycleCompleted,
            cycleBonus,
            step: cycle.step,
            count: cycle.count,
            elementMatched: elementMult > 1.0,
            msg
        };
    }

    canBreakthrough(type = 'tuvi') {
        const realm = this.getCurrentRealm(type);
        if (!realm) return { can: false, reason: "Cảnh giới không hợp lệ." };

        // Peak Realm Protection: block if already at max realm
        let list = HUMAN_REALMS;
        if (type === 'body') list = BODY_REALMS;
        else if (type === 'soul') list = SOUL_REALMS;
        else if (type === 'sword') list = SWORD_PATH_REALMS;
        else if (type === 'soul_path') list = SOUL_PATH_REALMS;
        else if (type === 'buddhist') list = BUDDHIST_REALMS;
        else if (type === 'confucian') list = CONFUCIAN_REALMS;
        else {
            const mainPath = this.mainPath || 'orthodox';
            if (mainPath === 'ma_dao') list = DEMON_REALMS;
            else if (mainPath === 'quy_dao') list = GHOST_REALMS;
            else if (mainPath === 'yeu_tu') list = SPIRIT_BEAST_REALMS;
            else list = HUMAN_REALMS;
        }
        const maxRealm = list[list.length - 1];
        const currentId = type === 'tuvi' ? this.realmId : (type === 'body' ? this.bodyRealmId : (type === 'soul' ? this.soulRealmId : (this.specializedPaths[type]?.realmId || 0)));
        if (maxRealm && currentId >= maxRealm.id) {
            return { can: false, isMax: true, reason: "Đã đạt đến cảnh giới chí cao vô thượng, không thể đột phá thêm!" };
        }

        let currentExp = 0;
        if (type === 'tuvi') currentExp = this.tuVi;
        else if (type === 'body') currentExp = this.bodyExp;
        else if (type === 'soul') currentExp = this.soulExp;
        else if (this.specializedPaths[type]) currentExp = this.specializedPaths[type].exp;

        // Special requirements for Tu Vi breakthroughs
        if (type === 'tuvi') {
            const nextRealmId = this.realmId + 1;
            // Example requirements from prompt
            if (nextRealmId === 18) { // Kết Đan
                if (this.bodyRealmId < 3) return { can: false, reason: "Nhục thân cần đạt Luyện Cốt để chịu được Kim Đan ngưng tụ." };
            }
            if (nextRealmId === 22) { // Nguyên Anh
                if (this.soulRealmId < 3) return { can: false, reason: "Thần thức cần đạt Thần Hải để ngưng tụ Nguyên Anh." };
            }
            if (nextRealmId === 26) { // Hóa Thần
                if (this.soulRealmId < 4) return { can: false, reason: "Thần thức cần đạt Hóa Thần Niệm." };
            }
            if (nextRealmId === 38) { // Đại Thừa
                if (this.bodyRealmId < 8) return { can: false, reason: "Nhục thân cần đạt Bất Diệt Thể để chống Thiên Kiếp." };
            }
        }

        // 3-tier breakthrough system: 100% / 120% / 150%
        const pct = currentExp / realm.expRequired;
        let tier = null;
        if (pct >= 1.5)      tier = 'tuyet_dinh'; // Tuyệt Đỉnh
        else if (pct >= 1.2) tier = 'cuc_han';    // Cực Hạn
        else if (pct >= 1.0) tier = 'vien_man';   // Viên Mãn

        const tierNames = {
            vien_man:   '🟡 Viên Mãn (100%)',
            cuc_han:    '🟠 Cực Hạn (120%)',
            tuyet_dinh: '🔴 Tuyệt Đỉnh (150%)'
        };

        return {
            can: tier !== null,
            tier,
            tierName: tier ? tierNames[tier] : null,
            pct,
            reason: tier === null ? `Cần thêm ${Math.ceil(realm.expRequired - currentExp).toLocaleString()} exp để đột phá.` : '',
            expRequired: realm.expRequired
        };
    }

    getStability() {
        return this.stability;
    }

    getBreakthroughSuccessRate(type = 'tuvi') {
        let baseRate = this.getStability();
        const mainPath = this.mainPath || 'orthodox';
        if (mainPath === 'ma_dao') baseRate -= 10;
        if (this.specializedPaths?.buddhist?.realmId > 0) baseRate += 10;

        // Status effect breakthrough modifications
        if (this.buffs) {
            this.buffs.forEach(b => {
                if (b.effects && b.effects.breakthrough_rate) {
                    baseRate += b.effects.breakthrough_rate * 100 * (b.stacks || 1);
                }
            });
        }

        // Per-system bonuses and penalties
        const check = this.canBreakthrough(type);
        const tier = check.tier || 'vien_man';

        // Tier bonus (shared base for all systems)
        const tierBonus = { vien_man: 0, cuc_han: 15, tuyet_dinh: 30 };
        baseRate += tierBonus[tier] || 0;

        if (type === 'tuvi') {
            // Tu Vi: can_co and tinh_thuan bonus, thien_dao_ap_luc penalty
            const realm = this.getCurrentRealm('tuvi');
            const maxTinhThuan = realm ? realm.expRequired : 1000;
            baseRate += (this.can_co || 0) * 0.5;                                   // +0 to +50%
            baseRate += Math.min(30, ((this.tinh_thuan || 0) / maxTinhThuan) * 30); // +0 to +30%
            baseRate -= (this.thien_dao_ap_luc || 0) * 0.3;                         // -0 to -30%
        } else if (type === 'body') {
            // Luyện Thể: tier bonus amplified (+20%/+40%), khi_huyet_ap_luc penalty
            const extraTierBonus = { vien_man: 0, cuc_han: 5, tuyet_dinh: 10 }; // extra on top
            baseRate += extraTierBonus[tier] || 0;
            baseRate -= (this.khi_huyet_ap_luc || 0) * 0.2;                         // -0 to -20%
        } else if (type === 'soul') {
            // Thần Thức: tier bonus moderate, than_hon_qua_tai penalty
            const extraTierBonus = { vien_man: 0, cuc_han: -5, tuyet_dinh: -10 }; // lower than body
            baseRate += extraTierBonus[tier] || 0;
            baseRate -= (this.than_hon_qua_tai || 0) * 0.25;                        // -0 to -25%
        }

        baseRate = Math.max(5, Math.min(100, baseRate));
        const fatePenalty = window.game?.systems?.fate?.getBreakthroughPenalty() || 1.0;
        baseRate *= fatePenalty;
        return Math.floor(Math.max(5, Math.min(100, baseRate)));
    }

    breakthrough(type = 'tuvi', isForced = false, rateBonus = 0) {
        const check = this.canBreakthrough(type);
        if (!check.can) {
            return { success: false, msg: check.reason || "Chưa đủ điều kiện đột phá." };
        }

        const tier = check.tier || 'vien_man';
        let stability = this.getBreakthroughSuccessRate(type);
        if (isForced) stability *= 0.5;
        if (rateBonus) stability += rateBonus * 100;
        stability = Math.max(5, Math.min(100, stability));

        const roll = Math.random() * 100;

        if (roll > stability) {
            // ======== ĐỘT PHÁ THẤT BẠI ========
            const daoTamProt = (this.daoTam || 50) / 200; // 0-50% protection

            if (type === 'tuvi') {
                // Tẩu hỏa nhập ma — chân nguyên đảo lộn
                this.hp *= 0.1;
                const tuViPenalty = isForced ? 0.5 : 0.7;
                this.tuVi *= tuViPenalty;
                // Kiểm tra mất cân bằng Tu Vi-Body-Soul
                const diffBody = this.realmId - this.bodyRealmId;
                const diffSoul = this.realmId - this.soulRealmId;
                let extra = '';
                if (diffBody > 5) { this.hp *= (0.5 + daoTamProt); extra += ' Thân thể không chịu nổi linh lực bạo tẩu!'; }
                if (diffSoul > 5) { this.stability -= 20 * (1 - daoTamProt); this.heartDemon += 10 * (1 - daoTamProt); extra += ' Tâm ma thừa cơ xâm nhập!'; }
                this.addStatusEffect('tau_hoa_nhap_ma', 300, 'Đột Phá Thất Bại');
                // Reset PNTT fields
                this.tinh_thuan = 0; this.can_co = 0;
                this.thoiGianDaiVienMan = 0; this.thien_dao_ap_luc = 0;
                this.tuViState = 'accumulating';
                return { success: false, msg: `💀 Tẩu hỏa nhập ma! Chân nguyên đảo lộn, tu vi tổn thất nặng!${extra}` };

            } else if (type === 'body') {
                // Luyện Thể thất bại — gãy nền móng nhục thân, không tẩu hỏa
                this.hp *= 0.3; // nhẹ hơn Tu Vi
                const bodyPenalty = 0.7;
                this.bodyExp *= bodyPenalty;
                this.bodyState = 'accumulating';
                this.khi_huyet_ap_luc = 0;
                this.thoiGianBodyVienMan = 0;
                this.removeStatusEffect('khi_huyet_bao_dong');
                this.removeStatusEffect('kinh_mach_ton_thuong');
                const bodyMsgs = ['💢 Thuế Biến thất bại! Khí huyết phản phệ làm nhục thân nứt vỡ!', '💥 Gãy nền móng luyện thể! Cơ thể cần thời gian hồi phục.'];
                this.addStatusEffect('trong_thuong', 600, 'Thuế Biến Thất Bại');
                return { success: false, msg: bodyMsgs[Math.floor(Math.random() * bodyMsgs.length)] };

            } else if (type === 'soul') {
                // Thần Thức thất bại — thần hồn tổn thương
                const soulPenalty = 0.7;
                this.soulExp *= soulPenalty;
                this.soulState = 'accumulating';
                this.than_hon_qua_tai = 0;
                this.thoiGianSoulVienMan = 0;
                this.removeStatusEffect('than_hon_qua_tai_debuff');
                this.heartDemon = Math.min(100, this.heartDemon + 15 * (1 - daoTamProt));
                this.stability = Math.max(0, this.stability - 10);
                this.addStatusEffect('than_hon_ton_thuong', 900, 'Thần Hồn Lột Xác Thất Bại');
                return { success: false, msg: `🌌 Thần hồn lột xác thất bại! Thần hải lung lay, tâm ma xâm thực!` };

            } else {
                // Specialized path fallback
                if (this.specializedPaths[type]) this.specializedPaths[type].exp *= 0.7;
                return { success: false, msg: 'Đột phá thất bại!' };
            }
        }

        // ======== ĐỘT PHÁ THÀNH CÔNG ========
        const realm = this.getCurrentRealm(type);
        const tierBonusMap = { vien_man: 0, cuc_han: 0.10, tuyet_dinh: 0.20 }; // HP/DEF bonus %
        const tierBonus = tierBonusMap[tier] || 0;

        if (type === 'tuvi') {
            this.tuVi = Math.max(0, this.tuVi - realm.expRequired);
            this.realmId++;

            // Bonus từ tinh_thuan (Nén Pháp Lực)
            if (this.tinh_thuan > 0) {
                const pureRatio = Math.min(1.0, this.tinh_thuan / realm.expRequired);
                const bonus = pureRatio * 0.15 + tierBonus;
                this.atk = Math.round(this.atk * (1 + bonus));
                this.def = Math.round(this.def * (1 + bonus));
                this.maxHp = Math.round(this.maxHp * (1 + bonus));
                this.hp = this.maxHp;
                this.pendingEvents.push({ type: 'seclusion_event', eventType: 'insight',
                    msg: `💎 [NGƯNG TỤ TINH ANH] Đột phá thành công! Pháp lực tinh thuần nâng căn cơ phi thường! (+${((pureRatio * 0.15 + tierBonus) * 100).toFixed(1)}% thuộc tính)` });
            } else if (tierBonus > 0) {
                this.maxHp = Math.round(this.maxHp * (1 + tierBonus));
                this.hp = this.maxHp;
                this.pendingEvents.push({ type: 'seclusion_event', eventType: 'insight',
                    msg: `✨ [${tier === 'cuc_han' ? 'CỰC HẠN' : 'TUYỆT ĐỈNH'}] Nền tảng vững chắc giúp cảnh giới mới thăng hoa! (+${(tierBonus * 100).toFixed(0)}% HP)` });
            }

            // Reset Tu Vi fields
            this.tinh_thuan = 0; this.can_co = 0;
            this.thoiGianDaiVienMan = 0; this.thien_dao_ap_luc = 0;
            this.tuViState = 'accumulating';
            this.removeStatusEffect('ap_luc_thien_dao');
            this.removeStatusEffect('linh_khi_qua_tai');

        } else if (type === 'body') {
            this.bodyExp = Math.max(0, this.bodyExp - realm.expRequired);
            this.bodyRealmId++;

            // Bonus maxHp từ tier
            const hpBonus = { vien_man: 0.05, cuc_han: 0.12, tuyet_dinh: 0.20 }[tier] || 0.05;
            this.maxHp = Math.round(this.maxHp * (1 + hpBonus));
            this.hp = this.maxHp;
            if (hpBonus > 0.05) {
                this.pendingEvents.push({ type: 'seclusion_event', eventType: 'body_breakthrough',
                    msg: `🔴 [NHỤC THÂN THUẾ BIẾN] Thuế Biến thành công! Nhục thân tái sinh mạnh mẽ hơn! (Max HP +${(hpBonus * 100).toFixed(0)}%)` });
            }

            // Reset Body fields
            this.bodyState = 'accumulating';
            this.khi_huyet_ap_luc = 0; this.thoiGianBodyVienMan = 0;
            this.removeStatusEffect('khi_huyet_bao_dong');
            this.removeStatusEffect('kinh_mach_ton_thuong');

        } else if (type === 'soul') {
            this.soulExp = Math.max(0, this.soulExp - realm.expRequired);
            this.soulRealmId++;

            // Bonus thần thức từ tier + giảm tâm ma
            const divineBonus = { vien_man: 0.05, cuc_han: 0.12, tuyet_dinh: 0.20 }[tier] || 0.05;
            this.divineSense = Math.round(this.divineSense * (1 + divineBonus));
            const demonReduced = Math.floor(10 + divineBonus * 50);
            this.heartDemon = Math.max(0, this.heartDemon - demonReduced);
            if (divineBonus > 0.05) {
                this.pendingEvents.push({ type: 'seclusion_event', eventType: 'soul_breakthrough',
                    msg: `🌌 [THẦN HỒN LỘT XÁC] Thần hồn lột xác thành công! Thần thức đột phá thăng hoa! (Thần Thức +${(divineBonus * 100).toFixed(0)}%, Tâm Ma -${demonReduced})` });
            }

            // Reset Soul fields
            this.soulState = 'accumulating';
            this.than_hon_qua_tai = 0; this.thoiGianSoulVienMan = 0;
            this.removeStatusEffect('than_hon_qua_tai_debuff');
            this.removeStatusEffect('huyen_canh');

        } else if (this.specializedPaths[type]) {
            this.specializedPaths[type].exp -= realm.expRequired;
            this.specializedPaths[type].realmId++;
        }

        this.calculateStats();
        this.stability = Math.min(100, this.stability + ((this.daoTam || 50) / 10));

        const successMsgs = {
            tuvi: '⚡ Đột phá Tu Vi thành công!',
            body: '💪 Thuế Biến Nhục Thân thành công!',
            soul: '✨ Thần Hồn Lột Xác thành công!',
        };
        return { success: true, tier, msg: successMsgs[type] || 'Đột phá thành công!' };
    }

    getEnvironmentalQiMultiplier() {
        if (typeof state === 'undefined') return 1.0;
        const locId = state.currentLocId || 'thanh_van_tran';
        
        let loc = null;
        for (const world of Object.values(WORLDS)) {
            loc = world.locations.find(l => l.id === locId);
            if (loc) break;
        }

        // Town (Thanh Vân Trấn) or default baseline
        let energies = [{ type: 'linh_khi', concentration: 10 }];
        if (loc && loc.energies && loc.energies.length > 0) {
            energies = loc.energies;
        }

        let proportions = {};
        if (this.spiritualRoot) {
            if (this.spiritualRoot.proportions) {
                Object.entries(this.spiritualRoot.proportions).forEach(([el, pct]) => {
                    proportions[el] = pct / 100;
                });
            } else if (this.spiritualRoot.elements) {
                const count = this.spiritualRoot.elements.length;
                this.spiritualRoot.elements.forEach(el => {
                    proportions[el] = 1.0 / count;
                });
            }
        }
        
        if (Object.keys(proportions).length === 0) {
            // Default Phàm Nhân or no root (balanced elements)
            proportions = { 'Kim': 0.2, 'Mộc': 0.2, 'Thủy': 0.2, 'Hỏa': 0.2, 'Thổ': 0.2 };
        }

        // Check if we need SPECIAL_ELEMENTS from creation-data.js
        // We will assume window.SPECIAL_ELEMENTS or we can just redefine the base mapping here if needed.
        // Let's define the mutated base mapping locally to avoid import issues if not already imported.
        const mutatedBases = {
            'Lôi': ['Kim', 'Thủy'],
            'Băng': ['Thủy'],
            'Phong': ['Mộc', 'Thổ'],
            'Độc': ['Mộc'],
            'Quang': ['Kim', 'Hỏa'],
            'Ám': ['Thủy', 'Thổ']
        };

        // Get location specific elementQi or default balanced
        const defaultQi = {
            'Kim': 15, 'Mộc': 15, 'Thủy': 15, 'Hỏa': 15, 'Thổ': 15,
            'Phong': 5, 'Lôi': 5, 'Băng': 5, 'Quang': 5, 'Ám': 5
        };
        const elementQi = (loc && loc.elementQi) ? loc.elementQi : defaultQi;

        // Get overall Linh Qi concentration in the area
        let areaConcentration = 10;
        let hasLinhKhi = false;
        energies.forEach(eng => {
            if (eng.type === 'linh_khi' || eng.type === 'tien_khi') {
                areaConcentration = Math.max(areaConcentration, eng.concentration);
                hasLinhKhi = true;
            }
        });
        if (!hasLinhKhi && energies.length > 0) {
            areaConcentration = Math.max(...energies.map(e => e.concentration || 0));
        }

        // Calculate environmental Qi absorption based on local distribution
        let totalAbsorbedQi = 0;
        
        // Sum up Qi absorption for each of player's root elements
        Object.entries(proportions).forEach(([elName, elPct]) => {
            let pct = elementQi[elName] || 0;
            
            // If it's a mutated element and the direct element is low, try absorbing from base elements at reduced efficiency
            if (mutatedBases[elName]) {
                let basePctSum = 0;
                mutatedBases[elName].forEach(baseEl => {
                    basePctSum += elementQi[baseEl] || 0;
                });
                // Base elements convert to mutated Qi at 40% efficiency
                const convertedPct = basePctSum * 0.4;
                // Take whichever is higher: direct mutated Qi or converted base Qi
                if (convertedPct > pct) {
                    pct = convertedPct;
                }
            }

            // Get elemental Qi from composition grid
            let elQi = areaConcentration * (pct / 20);
            
            // Baseline very thin Qi if not present in the location at all
            if (pct === 0) {
                elQi = 0.5;
            }
            
            totalAbsorbedQi += elQi * elPct;
        });

        // Normalize the multiplier: standard starter town has Qi = 10 -> mult = 1.0
        const mult = totalAbsorbedQi / 10;
        
        // Keep within safe minimum bound so it never completely freezes
        return Math.max(0.02, mult);
    }

    calculateStats() {
        const realmLevel = this.realmId;
        const bodyLevel = this.bodyRealmId;
        const soulLevel = this.soulRealmId;

        this.tuViPerSecond = 0;
        this.bodyExpPerSecond = 0;
        this.soulExpPerSecond = 0;
        this.hpRegenMult = 1.0;
        this.manaRegenMult = 1.0;

        // 0. Initialize BONUS & ADVANCED STATS
        this.bonusStats = {
            atk: 0, def: 0, spd: 0, maxHp: 0, maxMana: 0,
            tuViSpeed: 1, bodyExpSpeed: 1, soulExpSpeed: 1,
            maxAge: 0 
        };
        
        this.advancedStats = {
            pierce: 0, soulPierce: 0, critRate: 0.05, critDmg: 1.5,
            fireDmg: 1.0, waterDmg: 1.0, thunderDmg: 1.0, poisonDmg: 1.0, swordDmg: 1.0,
            qiAbsorb: 1.0, lifeSteal: 0, alchemySuccess: 0,
            soulRepress: 0, perception: 5 + (soulLevel * 2), daoVun: 0, murderQi: 0,
            allRes: 0, damageReduction: 0, techniqueMastery: 1.0, dodge: 0, reflectDmg: 0
        };

        // 1. Calculate BASE STATS (from Realms)
        const realmMult = realmLevel > 0 ? Math.pow(1.8, realmLevel - 1) : 1.0;
        
        const raceInfo = RACE_DATA[this.race || 'HUMAN'] || RACE_DATA.HUMAN;
        const raceMults = raceInfo.statMult;

        // Apply Racial Bonus from creation
        if (this.racialBonus) {
            Object.entries(this.racialBonus).forEach(([key, val]) => {
                if (key === 'tvps') this.bonusStats.tuViSpeed *= val;
                else if (key === 'soulExpSpeed') this.bonusStats.soulExpSpeed *= val;
                else if (key === 'bodyExpSpeed') this.bonusStats.bodyExpSpeed *= val;
                else if (key === 'maxAge') this.bonusStats.maxAge += val;
                else if (key === 'karma') this.karma += val;
                else if (this.advancedStats.hasOwnProperty(key)) {
                    if (['qiAbsorb', 'allRes', 'fireDmg', 'waterDmg', 'thunderDmg'].includes(key)) {
                        this.advancedStats[key] *= val;
                    } else {
                        this.advancedStats[key] += val;
                    }
                } else if (this.bonusStats.hasOwnProperty(key)) {
                    this.bonusStats[key] += val;
                } else if (this.baseStats.hasOwnProperty(key)) {
                    this.baseStats[key] += val;
                }
            });
        }

        this.baseStats.maxMana = 50 * realmMult;
        this.baseStats.maxHp = 100 * realmMult * raceMults.hp;
        this.baseStats.atk = 10 * realmMult * raceMults.atk;
        this.baseStats.def = 5 * realmMult * raceMults.def;
        this.baseStats.spd = (15 + (realmLevel * 5)) * raceMults.spd;

        // --- Body Realm Enhancement ---
        // Body Realm adds to HP and Def, and now Damage Reduction
        const bodyMult = bodyLevel > 0 ? Math.pow(1.2, bodyLevel - 1) : 1.0;
        this.baseStats.maxHp += 100 * Math.max(0, bodyLevel - 1) * bodyMult;
        this.baseStats.def += 20 * Math.max(0, bodyLevel - 1) * bodyMult;
        this.advancedStats.damageReduction = 1 - (1 / (1 + (bodyLevel * 0.05))); // Logarithmic DR

        // --- Soul Realm Enhancement ---
        // Soul Realm adds to Mana, Spd, Crit and Perception
        const soulMult = soulLevel > 0 ? Math.pow(1.15, soulLevel - 1) : 1.0;
        this.baseStats.maxMana += 60 * Math.max(0, soulLevel - 1) * soulMult;
        this.baseStats.spd += 10 * Math.max(0, soulLevel - 1) * soulMult;
        this.advancedStats.critRate += (soulLevel - 1) * 0.01;

        // --- Stability & Heart Demon Penalties ---
        if (this.stability < 40) {
            const penalty = 1 - (40 - this.stability) / 100;
            this.baseStats.atk *= penalty;
            this.baseStats.def *= penalty;
            this.baseStats.spd *= penalty;
        }
        if (this.heartDemon > 10) {
            const hdPenalty = 1 - (this.heartDemon / 200);
            this.baseStats.atk *= hdPenalty;
            this.advancedStats.critRate *= hdPenalty;
        }

        // 1.5 Specialized Path Bonuses
        if (this.specializedPaths.sword.realmId > 0) {
            this.baseStats.atk += 20 * this.specializedPaths.sword.realmId * Math.sqrt(realmLevel);
        }
        if (this.specializedPaths.soul_path.realmId > 0) {
            this.advancedStats.soulRepress += 0.05 * this.specializedPaths.soul_path.realmId;
        }


        // 2.3 Apply SPIRITUAL ROOT bonuses
        if (this.spiritualRoot) {
            if (this.spiritualRoot.multiplier) this.bonusStats.tuViSpeed *= this.spiritualRoot.multiplier;
            if (this.spiritualRoot.bonus) {
                const b = this.spiritualRoot.bonus;
                if (b.atk) this.baseStats.atk += b.atk;
                if (b.def) this.baseStats.def += b.def;
                if (b.maxHp) this.baseStats.maxHp += b.maxHp;
                if (b.maxAge) this.bonusStats.maxAge += b.maxAge;
                if (b.qiAbsorb) this.advancedStats.qiAbsorb *= b.qiAbsorb;
                if (b.allRes) this.advancedStats.allRes += b.allRes;
                if (b.techniqueMastery) this.advancedStats.techniqueMastery = (this.advancedStats.techniqueMastery || 1) * b.techniqueMastery;
            }

            // Apply Elemental Bonuses
            if (this.spiritualRoot.elements) {
                this.spiritualRoot.elements.forEach(elName => {
                    const elData = ROOT_ELEMENTS[elName];
                    if (elData && elData.bonus) {
                        Object.entries(elData.bonus).forEach(([key, val]) => {
                            if (this.advancedStats.hasOwnProperty(key)) {
                                if (['fireDmg', 'waterDmg', 'thunderDmg', 'poisonDmg', 'skillDmg', 'dotDmg', 'qiAbsorb'].includes(key)) {
                                    this.advancedStats[key] *= val;
                                } else {
                                    this.advancedStats[key] += val;
                                }
                            } else if (this.baseStats.hasOwnProperty(key)) {
                                this.baseStats[key] += val;
                            }
                        });
                    }
                });
            }
            
            // Apply Mutated Bonus
            if (this.spiritualRoot.mutatedElement) {
                const mutData = SPECIAL_ELEMENTS[this.spiritualRoot.mutatedElement];
                if (mutData && mutData.bonus) {
                    Object.entries(mutData.bonus).forEach(([key, val]) => {
                        if (this.advancedStats.hasOwnProperty(key)) {
                            if (['fireDmg', 'waterDmg', 'thunderDmg', 'poisonDmg', 'skillDmg', 'dotDmg', 'qiAbsorb'].includes(key)) {
                                this.advancedStats[key] *= val;
                            } else {
                                this.advancedStats[key] += val;
                            }
                        } else if (this.baseStats.hasOwnProperty(key)) {
                            this.baseStats[key] += val;
                        }
                    });
                }
            }
        }

        // Apply Physique Talent
        this.baseStats.maxHp *= (1 + ((this.physiqueTalent || 50) / 200));
        this.baseStats.def *= (1 + ((this.physiqueTalent || 50) / 500));

        // Apply Comprehension
        this.bonusStats.tuViSpeed *= (1 + ((this.getComprehension() || 50) / 200));

        // Apply Divine Sense
        this.advancedStats.perception = 10 + (soulLevel * 5) + ((this.divineSense || 50) / 5);

        // 2.2 Apply TALENT (Traits) bonuses
        if (this.talents && this.talents.length > 0) {
            this.talents.forEach(talent => {
                const trait = CREATION_TRAITS[talent.id];
                if (trait && trait.bonus) {
                    const b = trait.bonus;
                    Object.entries(b).forEach(([key, val]) => {
                        if (key === 'tvps') this.bonusStats.tuViSpeed *= val;
                        else if (key === 'atk') this.baseStats.atk += val;
                        else if (key === 'def') this.baseStats.def += val;
                        else if (key === 'maxHp') this.baseStats.maxHp += val;
                        else if (key === 'spd') this.baseStats.spd += val;
                        else if (key === 'luck') this.luck += val;
                        else if (key === 'maxAge') this.bonusStats.maxAge += val;
                        else if (this.advancedStats.hasOwnProperty(key)) {
                            if (['qiAbsorb', 'fireDmg', 'waterDmg', 'thunderDmg'].includes(key)) {
                                this.advancedStats[key] *= val;
                            } else {
                                this.advancedStats[key] += val;
                            }
                        }
                    });
                }
            });
        }

        // 2.5 Apply PHYSIQUE BONUSES
        if (this.physique && this.physique.id) {
            const physBonus = getPhysiqueAwakenBonus(this.physique.id, this.physique.stage);
            const physData = getPhysiqueById(this.physique.id);

            // Apply flat bonuses to Base Stats
            if (physBonus.atk) this.baseStats.atk += physBonus.atk;
            if (physBonus.def) this.baseStats.def += physBonus.def;
            if (physBonus.maxHp) this.baseStats.maxHp += physBonus.maxHp;
            if (physBonus.maxMana) this.baseStats.maxMana += physBonus.maxMana;
            if (physBonus.spd) this.baseStats.spd += physBonus.spd;
            if (physBonus.luck) this.luck += physBonus.luck;

            // Apply rate bonuses to Bonus Stats
            if (physBonus.tvps) this.bonusStats.tuViSpeed *= physBonus.tvps;
            if (physBonus.bodyExpSpeed) this.bonusStats.bodyExpSpeed *= physBonus.bodyExpSpeed;
            if (physBonus.soulExpSpeed) this.bonusStats.soulExpSpeed *= physBonus.soulExpSpeed;

            // Apply Advanced Stats
            if (physBonus.fireDmg) this.advancedStats.fireDmg *= physBonus.fireDmg;
            if (physBonus.qiAbsorb) this.advancedStats.qiAbsorb *= physBonus.qiAbsorb;
            if (physBonus.critRate) this.advancedStats.critRate += physBonus.critRate;
            if (physBonus.critDmg) this.advancedStats.critDmg += physBonus.critDmg;
            if (physBonus.pierce) this.advancedStats.pierce += physBonus.pierce;
            if (physBonus.soulPierce) this.advancedStats.soulPierce += physBonus.soulPierce;
            if (physBonus.lifeSteal) this.advancedStats.lifeSteal += physBonus.lifeSteal;
            if (physBonus.daoVun) this.advancedStats.daoVun += physBonus.daoVun;
            if (physBonus.murderQi) this.advancedStats.murderQi += physBonus.murderQi;

            // Handle non-awakened penalty (if applicable)
            if (physData.needAwaken && !this.physique.awakened) {
                this.bonusStats.tuViSpeed *= 0.1; // 90% penalty if not awakened
                this.advancedStats.qiAbsorb *= 0.1;
            }
        }

        // Apply technique bonuses (These usually affect rates and add flat/scaled bonuses)
        this.applyTechniqueToStats('tuvi', this.mainTechniqueId);
        this.applyTechniqueToStats('body', this.mainBodyTechniqueId);
        this.applyTechniqueToStats('soul', this.mainSoulTechniqueId);
        this.applyTechniqueToStats('escape', this.mainEscapeId);
        this.applyTechniqueToStats('dual', this.mainDualId);
        if (Array.isArray(this.equippedAuxiliaryIds)) {
            this.equippedAuxiliaryIds.forEach(auxId => {
                this.applyTechniqueToStats('auxiliary', auxId);
            });
        }

        // Apply secret technique bonuses
        this.applySecretTechniqueBonuses();

        // 3. Apply EQUIPMENT & ARTIFACT BONUSES
        const equippedIds = [];
        Object.entries(this.equipment).forEach(([slot, itemId]) => {
            if (!itemId) return;
            equippedIds.push(itemId);
            const item = getItemById(itemId);
            if (!item || !item.stats) return;

            // Check if artifact is recognized
            // For life-bound items, they are always recognized. For others, check recognizedItems list.
            const isLifeBound = item.isLifeBound === true;
            const isRecognized = isLifeBound || (this.recognizedItems && this.recognizedItems.includes(itemId)) || item.isRecognized !== false;
            
            let mult = isRecognized ? 1.0 : 0.3; // 70% penalty if not recognized

            // Durability penalty: apply IMMEDIATELY so it affects ALL stats from this item
            if (this.equipmentMetadata?.[slot]?.durability !== undefined &&
                this.equipmentMetadata[slot].durability < 20) {
                mult *= 0.5; // 50% penalty for broken artifacts — affects atk/def/pierce/extra etc.
            }

            if (item.stats.atk) this.bonusStats.atk += item.stats.atk * mult;
            if (item.stats.def) this.bonusStats.def += item.stats.def * mult;
            if (item.stats.spd) this.bonusStats.spd += item.stats.spd * mult;
            if (item.stats.hp) this.bonusStats.maxHp += item.stats.hp * mult;
            if (item.stats.mana) this.bonusStats.maxMana += item.stats.mana * mult;
            if (item.stats.tuViSpeed) this.bonusStats.tuViSpeed *= item.stats.tuViSpeed;
            if (item.stats.bodyExpSpeed) this.bonusStats.bodyExpSpeed *= item.stats.bodyExpSpeed;
            if (item.stats.soulExpSpeed) this.bonusStats.soulExpSpeed *= item.stats.soulExpSpeed;
            
            // Advanced Stats from items
            if (item.stats.pierce) this.advancedStats.pierce += item.stats.pierce * mult;
            if (item.stats.soulPierce) this.advancedStats.soulPierce += item.stats.soulPierce * mult;
            if (item.stats.critRate) this.advancedStats.critRate += item.stats.critRate * mult;
            if (item.stats.critDmg) this.advancedStats.critDmg += item.stats.critDmg * mult;
            if (item.stats.fireDmg) this.advancedStats.fireDmg *= (1 + item.stats.fireDmg * mult);
            if (item.stats.qiAbsorb) this.advancedStats.qiAbsorb *= (1 + item.stats.qiAbsorb * mult);
            if (item.stats.lifeSteal) this.advancedStats.lifeSteal += item.stats.lifeSteal * mult;
            if (item.stats.soulRepress) this.advancedStats.soulRepress += item.stats.soulRepress * mult;
            if (item.stats.daoVun) this.advancedStats.daoVun += item.stats.daoVun * mult;
            if (item.stats.murderQi) this.advancedStats.murderQi += item.stats.murderQi * mult;

            // Apply EXTRA STATS from metadata
            if (this.equipmentMetadata && this.equipmentMetadata[slot]) {
                const meta = this.equipmentMetadata[slot];

                if (meta.extraStat) {
                    const { type, value } = meta.extraStat;
                    if (this.advancedStats.hasOwnProperty(type)) {
                        this.advancedStats[type] += value * mult;
                    } else if (this.bonusStats.hasOwnProperty(type)) {
                        this.bonusStats[type] += value * mult;
                    }
                }
            }
        });

        // 3.5 Apply SET BONUSES
        this.applySetBonuses(equippedIds);

        // 4. Combine BASE and BONUS for final values
        this.maxHp = Math.max(1, (this.baseStats.maxHp || 0) + (this.bonusStats.maxHp || 0));
        this.maxMana = Math.max(1, (this.baseStats.maxMana || 0) + (this.bonusStats.maxMana || 0));
        this.atk = Math.max(0, (this.baseStats.atk || 0) + (this.bonusStats.atk || 0));
        this.def = Math.max(0, (this.baseStats.def || 0) + (this.bonusStats.def || 0));
        this.spd = Math.max(1, (this.baseStats.spd || 0) + (this.bonusStats.spd || 0));

        // Resolve mainPath defaults if null
        if (!this.mainPath) {
            if (this.race === 'YAO') this.mainPath = 'yeu_tu';
            else if (this.race === 'DEMON') this.mainPath = 'ma_dao';
            else this.mainPath = 'orthodox';
        }

        // Apply path-based stat modifiers
        if (this.mainPath === 'ma_dao') {
            this.atk *= 1.3;
            this.def *= 0.9;
            this.bonusStats.tuViSpeed *= 1.2;
        } else if (this.mainPath === 'quy_dao') {
            this.maxHp *= 1.2;
            this.spd *= 1.2;
        } else if (this.mainPath === 'yeu_tu') {
            this.maxHp *= 1.5;
            this.def *= 1.2;
        }

        // Specialized path modifiers
        if (this.specializedPaths?.buddhist?.realmId > 0) {
            this.def *= 1.15;
        }
        if (this.specializedPaths?.confucian?.realmId > 0) {
            this.spd *= 1.1;
        }
        if (this.specializedPaths?.sword?.realmId > 0) {
            this.advancedStats.pierce += 0.05 * this.specializedPaths.sword.realmId;
        }

        // 4. Apply TITLE bonuses
        if (this.fate.activeTitleId) {
            const title = TITLES.find(t => t.id === this.fate.activeTitleId);
            if (title && title.bonus) {
                Object.entries(title.bonus).forEach(([key, val]) => {
                    if (this.baseStats.hasOwnProperty(key)) this.baseStats[key] *= val;
                    else if (this.bonusStats.hasOwnProperty(key)) {
                        if (['tuViSpeed', 'bodyExpSpeed', 'soulExpSpeed'].includes(key)) {
                            this.bonusStats[key] *= val;
                        } else {
                            this.bonusStats[key] += val;
                        }
                    } else if (this.advancedStats.hasOwnProperty(key)) {
                        this.advancedStats[key] += val;
                    }
                });
            }
        }

        // Apply Sect bonuses
        if (this.sectId) {
            const sect = getSectById(this.sectId);
            if (sect && sect.bonus) {
                if (sect.bonus.atk) this.atk += sect.bonus.atk;
                if (sect.bonus.def) this.def += sect.bonus.def;
                if (sect.bonus.maxHp) this.maxHp += sect.bonus.maxHp;
                if (sect.bonus.spd) this.spd += sect.bonus.spd;
            }
            this.tuViPerSecond *= 1.05;
        }

        // Apply Buffs and Status Effects to final stats
        if (this.buffs) {
            this.buffs.forEach(b => {
                // Legacy buff processing
                if (b.stat) {
                    if (b.stat === 'atk') this.atk *= b.value;
                    else if (b.stat === 'def') this.def *= b.value;
                    else if (b.stat === 'spd') this.spd *= b.value;
                    else if (b.stat === 'maxHp') this.maxHp *= b.value;
                    else if (b.stat === 'maxMana') this.maxMana *= b.value;
                    else if (b.stat === 'tu_vi_speed') this.tuViPerSecond *= b.value;
                    else if (b.stat === 'body_speed') this.bodyExpPerSecond *= b.value;
                    else if (b.stat === 'soul_speed') this.soulExpPerSecond *= b.value;
                    return;
                }

                // New Status Effect processing
                if (b.effects) {
                    const stacks = b.stacks || 1;
                    Object.entries(b.effects).forEach(([statKey, modVal]) => {
                        const mult = 1 + (modVal * stacks);
                        if (statKey === 'atk') this.atk = Math.max(0, this.atk * mult);
                        else if (statKey === 'def') this.def = Math.max(0, this.def * mult);
                        else if (statKey === 'spd') this.spd = Math.max(1, this.spd * mult);
                        else if (statKey === 'maxHp') this.maxHp = Math.max(1, this.maxHp * mult);
                        else if (statKey === 'maxMana') this.maxMana = Math.max(1, this.maxMana * mult);
                        else if (statKey === 'tu_vi_speed') this.tuViPerSecond = Math.max(0, this.tuViPerSecond * mult);
                        else if (statKey === 'body_speed') this.bodyExpPerSecond = Math.max(0, this.bodyExpPerSecond * mult);
                        else if (statKey === 'soul_speed') this.soulExpPerSecond = Math.max(0, this.soulExpPerSecond * mult);
                        else if (statKey === 'hp_regen') this.hpRegenMult = Math.max(0, this.hpRegenMult * mult);
                        else if (statKey === 'mana_regen') this.manaRegenMult = Math.max(0, this.manaRegenMult * mult);
                        else if (statKey === 'critRate') {
                            this.advancedStats.critRate = Math.max(0, this.advancedStats.critRate + modVal * stacks);
                        }
                        else if (statKey === 'dodge') {
                            this.advancedStats.dodge = Math.max(0, this.advancedStats.dodge + modVal * stacks);
                        }
                        else if (statKey === 'divine_sense') {
                            this.divineSense = Math.max(1, (this.divineSense || 50) * mult);
                            this.advancedStats.perception = Math.max(1, this.advancedStats.perception * mult);
                        }
                    });
                }
            });
        }

        // Final application of artifact rate bonuses
        this.tuViPerSecond *= this.bonusStats.tuViSpeed;
        this.bodyExpPerSecond *= this.bonusStats.bodyExpSpeed;
        this.soulExpPerSecond *= this.bonusStats.soulExpSpeed;

        // Add Active Formations Bonus
        this.activeFormations.forEach(f => {
            if (f.id === 'tu_linh_tran') this.tuViPerSecond *= 1.2;
        });

        // Add Social System Bonuses
        if (typeof state !== 'undefined' && state.systems.social) {
            const social = state.systems.social;
            // Đạo lữ (Song Tu): Tăng 20% tốc độ tu luyện
            if (social.bonds.daoLu) {
                this.tuViPerSecond *= 1.2;
                
                // Thêm buff đặc biệt nếu ở cùng vị trí (Check trong update hoặc calculateStats)
                const daoLu = state.systems.npc.npcs.find(n => n.id === social.bonds.daoLu);
                if (daoLu && daoLu.location === this.currentLocId) {
                    this.tuViPerSecond *= 1.1; // Thêm 10% khi ở gần
                }
            }
            
            // Sư đồ: Tăng 15% tốc độ lĩnh ngộ (Trong thực tế có thể tăng exp luyện tập công pháp)
            if (social.bonds.mentor) {
                // Giả sử có bonus cho mastery speed
                this.bonusStats.tuViSpeed *= 1.05; // Tạm thời tăng nhẹ tu vi nếu là mentor
            }
        }
        
        // Add Energy (Qi) System Bonuses
        const energySystemRef = state?.systems?.energy;
        if (energySystemRef && typeof energySystemRef.getStatBonuses === 'function') {
            const energyBonuses = energySystemRef.getStatBonuses();
            this.atk += energyBonuses.atk || 0;
            this.def += energyBonuses.def || 0;
            this.maxHp += energyBonuses.hp || 0;
            this.maxMana += energyBonuses.mana || 0;
            this.spd += energyBonuses.spd || 0;
        }
        
        // Apply Environmental Qi Multiplier to Cultivation Speed
        this.tuViPerSecond *= this.getEnvironmentalQiMultiplier();
        
        // --- 7 CULTIVATION PATHS (CLASSES) SYSTEM ---
        this.cultivationPath = null;
        
        // Kiếm Tu (Sword Cultivator)
        if (this.mainTechniqueId === 'thanh_nguyen_kiem_quyet') {
            this.cultivationPath = 'Kiếm Tu';
            this.advancedStats.critRate += 0.15;
            this.advancedStats.pierce += 0.25;
            this.advancedStats.swordDmg *= 1.25;
        }
        // Pháp Tu (Spell Cultivator)
        else if (['liet_duong_cong', 'han_thuy_quyet', 'thanh_moc_tam_kinh', 'canh_kim_quyet', 'hau_tho_cong', 'phong_loi_quyet'].includes(this.mainTechniqueId)) {
            this.cultivationPath = 'Pháp Tu';
            this.advancedStats.fireDmg *= 1.2;
            this.advancedStats.waterDmg *= 1.2;
            this.advancedStats.thunderDmg *= 1.2;
            this.advancedStats.poisonDmg *= 1.2;
            this.maxMana = Math.floor(this.maxMana * 1.2);
        }
        // Ma Tu (Demon Cultivator)
        else if (this.mainTechniqueId === 'phe_huyet_ma_cong') {
            this.cultivationPath = 'Ma Tu';
            this.atk = Math.floor(this.atk * 1.25);
            this.advancedStats.lifeSteal += 0.25;
            // NOTE: karma drain was intentionally removed from calculateStats — it ran every second.
            // Karma penalty for Ma Tu should be applied ONCE when equipping the technique, not per-tick.
        }
        // Độc Tu (Poison Cultivator)
        else if (this.mainTechniqueId === 'van_doc_hoa_cot_quyet') {
            this.cultivationPath = 'Độc Tu';
            this.advancedStats.poisonDmg *= 1.3;
            this.advancedStats.pierce += 0.15;
        }
        // Trận Tu (Formation Cultivator)
        else if (this.mainTechniqueId === 'hu_thien_tran_phap_quyen') {
            this.cultivationPath = 'Trận Tu';
            this.advancedStats.dodge += 0.15;
            this.def = Math.floor(this.def * 1.2);
        }
        
        // Thể Tu (Body Cultivator) - Secondary or primary based on main body technique
        if (this.mainBodyTechniqueId && ['cuu_chuyen_kim_than', 'minh_vuong_quyet', 'man_nguu_kinh'].includes(this.mainBodyTechniqueId)) {
            if (!this.cultivationPath) this.cultivationPath = 'Thể Tu';
            this.maxHp = Math.floor(this.maxHp * 1.3);
            this.advancedStats.damageReduction = (this.advancedStats.damageReduction || 0) + 0.20;
        }
        
        // Hồn Tu (Soul Cultivator) - Secondary or primary based on main soul technique
        if (this.mainSoulTechniqueId && ['dai_dien_quyet', 'u_minh_huy_ngan', 'duong_than_quyet'].includes(this.mainSoulTechniqueId)) {
            if (!this.cultivationPath) this.cultivationPath = 'Hồn Tu';
            this.advancedStats.perception = Math.floor(this.advancedStats.perception * 1.4);
        }

        // Custom creation technique path matching
        if (!this.cultivationPath && this.mainTechniqueId) {
            const customTech = (this.customTechniques || []).find(t => t.id === this.mainTechniqueId);
            if (customTech) {
                this.cultivationPath = 'Cơ Duyên'; // Self-created custom path!
                this.atk = Math.floor(this.atk * 1.15);
                this.def = Math.floor(this.def * 1.15);
            }
        }
        
        // --- DEVIATION (TẨU HỎA NHẬP MA) DEBUFF ---
        if (this.deviationTime > 0) {
            this.atk = Math.max(1, Math.floor(this.atk * 0.5));
            this.def = Math.max(1, Math.floor(this.def * 0.5));
            this.spd = Math.max(1, Math.floor(this.spd * 0.5));
        }

        // 5. Finalize Secondary Stats
        const baseLifespan = raceInfo.baseLifespan || 100;
        const raceFactor = baseLifespan / 100;
        
        let realmAgeBonus = 0;
        const rId = this.realmId;
        
        if (rId === 0) {
            realmAgeBonus = 0;
        } else if (rId >= 1 && rId <= 13) {
            realmAgeBonus = rId * 2;
        } else if (rId >= 14 && rId <= 17) {
            realmAgeBonus = 100 + (rId - 13) * 10;
        } else if (rId >= 18 && rId <= 21) {
            realmAgeBonus = 400 + (rId - 17) * 25;
        } else if (rId >= 22 && rId <= 25) {
            realmAgeBonus = 900 + (rId - 21) * 50;
        } else if (rId >= 26 && rId <= 29) {
            realmAgeBonus = 1900 + (rId - 25) * 100;
        } else if (rId >= 30 && rId <= 33) {
            realmAgeBonus = 2900 + (rId - 29) * 150;
        } else if (rId >= 34 && rId <= 37) {
            realmAgeBonus = 4900 + (rId - 33) * 250;
        } else if (rId >= 38 && rId <= 41) {
            realmAgeBonus = 9900 + (rId - 37) * 500;
        } else {
            realmAgeBonus = 99999900;
        }
        
        this.maxAge = Math.floor(baseLifespan + realmAgeBonus * raceFactor + this.bonusStats.maxAge + (this.permanentLifespanBonus || 0));

        this.hp = Math.min(this.hp, this.maxHp);
        this.mana = Math.min(this.mana, this.maxMana);
    }

    applySetBonuses(equippedIds) {
        if (!ARTIFACT_SETS) return;

        Object.values(ARTIFACT_SETS).forEach(set => {
            const count = set.items.filter(id => equippedIds.includes(id)).length;
            if (count > 0) {
                // Apply bonuses for this count
                set.bonuses.forEach(bonus => {
                    if (count >= bonus.count) {
                        if (bonus.stats) {
                            if (bonus.stats.atk) this.bonusStats.atk += this.baseStats.atk * bonus.stats.atk;
                            if (bonus.stats.def) this.bonusStats.def += this.baseStats.def * bonus.stats.def;
                            if (bonus.stats.spd) this.bonusStats.spd += this.baseStats.spd * bonus.stats.spd;
                            if (bonus.stats.pierce) this.advancedStats.pierce += bonus.stats.pierce;
                            // Add more as needed
                        }
                    }
                });
            }
        });
    }


    applyTechniqueToStats(path, techId) {
        if (!techId) return;
        const techData = getTechniqueById(techId) || (this.customTechniques || []).find(t => t.id === techId);
        const playerTech = this.learnedTechniques.find(t => t.id === techId);
        if (!techData || !playerTech) return;

        const masteryLevel = playerTech.masteryLevel || 1;
        const qualityLevel = TECHNIQUE_LEVELS[techData.quality];
        const qualityMult = qualityLevel ? qualityLevel.multiplier : 1.0;

        // Use stage-specific bonuses if defined
        const masteryBonus = techData.masteryBonuses ? techData.masteryBonuses[masteryLevel] : null;
        const masteryMult = MASTERY_LEVELS.find(m => m.id === masteryLevel)?.multiplier || 1.0;
        
        // Attribute matching logic
        let attributeMult = 1.0;
        if (this.spiritualRoot) {
            // Use compatibility multiplier if defined, otherwise check for element match
            if (techData.compatibility) {
                const rootType = this.spiritualRoot.type;
                // Check for exact match or generic "Mixed" (Tạp) root
                if (techData.compatibility[rootType]) {
                    attributeMult = techData.compatibility[rootType];
                } else if (rootType.includes('Tạp') && techData.compatibility['Tạp']) {
                    attributeMult = techData.compatibility['Tạp'];
                } else if (rootType === 'Thiên Linh Căn' || this.spiritualRoot.id === 'thien_linh_can') {
                    attributeMult = 1.5; // Heaven Root gets 1.5x bonus for everything
                }
            } else if (techData.element) {
                // Legacy element match (50% bonus if technique matches spiritual root element)
                const rootId = this.spiritualRoot.id || '';
                if (this.spiritualRoot.type === 'Thiên Linh Căn' || rootId === 'thien_linh_can' || 
                    this.spiritualRoot.type.includes(techData.element)) {
                    attributeMult = 1.5;
                }
            }
        }

        const stageMult = 1 + ((playerTech.stage || 1) - 1) * 0.2;
        const finalMult = masteryMult * qualityMult * attributeMult * stageMult;

        // Apply path-specific cultivation rate
        if (path === 'tuvi') {
            const baseTvps = masteryBonus?.tvps || techData.effects?.tvps || 0;
            this.tuViPerSecond = baseTvps * finalMult;
        } else if (path === 'body') {
            const baseBodyPs = masteryBonus?.bodyPs || techData.effects?.bodyPs || 0;
            this.bodyExpPerSecond = baseBodyPs * finalMult;
        } else if (path === 'soul') {
            const baseSoulPs = masteryBonus?.soulPs || techData.effects?.soulPs || 0;
            this.soulExpPerSecond = baseSoulPs * finalMult;
        } else if (path === 'dual') {
            const baseTvps = masteryBonus?.tvps || techData.effects?.tvps || 0;
            this.tuViPerSecond += baseTvps * finalMult;
        } else if (path === 'auxiliary') {
            const baseTvps = masteryBonus?.tvps || techData.effects?.tvps || 0;
            this.tuViPerSecond += baseTvps * finalMult;
        }
        
        // Apply stat bonuses from technique
        if (techData.stats) {
            if (techData.stats.atk) this.bonusStats.atk += techData.stats.atk * finalMult;
            if (techData.stats.def) this.bonusStats.def += techData.stats.def * finalMult;
            if (techData.stats.hp) this.bonusStats.maxHp += techData.stats.hp * finalMult;
            if (techData.stats.mana) this.bonusStats.maxMana += techData.stats.mana * finalMult;
            if (techData.stats.spd) this.bonusStats.spd += techData.stats.spd * finalMult;
        }

        // Apply lifespan bonus and other advanced effects if defined in effects
        if (techData.effects) {
            if (techData.effects.lifespanBonus) this.bonusStats.maxAge += techData.effects.lifespanBonus * finalMult;
            if (techData.effects.allRes) this.advancedStats.allRes += techData.effects.allRes * finalMult;
            if (techData.effects.pierce) this.advancedStats.pierce += techData.effects.pierce * finalMult;
            if (techData.effects.dodge) this.advancedStats.dodge += techData.effects.dodge * finalMult;
            if (techData.effects.lifeSteal) this.advancedStats.lifeSteal += techData.effects.lifeSteal * finalMult;
            if (techData.effects.counterDamage) this.advancedStats.reflectDmg += techData.effects.counterDamage * finalMult;
            if (techData.effects.perception) this.advancedStats.perception += techData.effects.perception * finalMult;
            if (techData.effects.swordDmg) this.advancedStats.swordDmg *= (1 + (techData.effects.swordDmg - 1) * finalMult);
            if (techData.effects.poisonDmg) this.advancedStats.poisonDmg *= (1 + (techData.effects.poisonDmg - 1) * finalMult);
        }
    }

    applySecretTechniqueBonuses() {
        this.learnedSecretTechniques.forEach(entry => {
            const data = getSecretTechniqueById(entry.id);
            if (!data || !data.masteryBonuses) return;

            const masteryBonus = data.masteryBonuses[entry.masteryLevel] || {};
            const stageMult = 1 + ((entry.stage || 1) - 1) * 0.3; // Secret techniques scale better with stage

            // Apply bonuses to player state or bonuses
            Object.entries(masteryBonus).forEach(([key, val]) => {
                const finalVal = val * stageMult;
                if (this.bonusStats.hasOwnProperty(key)) {
                    // If it's a multiplier-like stat (like tuViSpeed), multiply
                    if (key.toLowerCase().includes('speed') || key.toLowerCase().includes('bonus')) {
                        this.bonusStats[key] *= finalVal;
                    } else {
                        this.bonusStats[key] += finalVal;
                    }
                } else if (this.advancedStats.hasOwnProperty(key)) {
                    this.advancedStats[key] += finalVal;
                } else if (key === 'alchemyExpBonus') {
                    this.alchemyExpBonus = (this.alchemyExpBonus || 1.0) * finalVal;
                } else if (key === 'beastExpBonus') {
                    this.beastExpBonus = (this.beastExpBonus || 1.0) * finalVal;
                }
                // Add more custom mappings as needed for professions
            });
        });
    }


    equip(itemId) {
        const item = getItemById(itemId);
        if (!item || !item.type) return false;

        // Special Requirement Check: Thunder for items like Phong Loi Si
        if (item.requireThunder) {
            const hasThunderTech = this.learnedTechniques.some(t => {
                const techData = getTechniqueById(t.id);
                return techData && techData.element === 'Lôi';
            }) || (this.learnedSecretTechniques && this.learnedSecretTechniques.some(t => {
                return t.id.includes('loi') || t.id.includes('thunder');
            }));

            if (!hasThunderTech) {
                state.ui.toast(`Cần có công pháp hoặc bí thuật Lôi hệ để làm nguồn linh lực kích hoạt ${item.name}!`, "error");
                return false;
            }
        }

        // Specialized Profession Tools
        if (item.type === 'cauldron') {
            if (this.currentCauldron) {
                const oldItem = getItemById(this.currentCauldron);
                if (oldItem) this.inventory.addItem(this.currentCauldron, 1);
            }
            this.currentCauldron = itemId;
            if (!this.ownedCauldrons.includes(itemId)) this.ownedCauldrons.push(itemId);
            this.inventory.removeItem(itemId, 1);
            return true;
        }
        if (item.type === 'talisman_pen') {
            if (this.currentTalismanPen) {
                const oldItem = getItemById(this.currentTalismanPen);
                if (oldItem) this.inventory.addItem(this.currentTalismanPen, 1);
            }
            this.currentTalismanPen = itemId;
            if (!this.ownedTalismanPens.includes(itemId)) this.ownedTalismanPens.push(itemId);
            this.inventory.removeItem(itemId, 1);
            return true;
        }
        if (item.type === 'smithing_tool') {
            if (this.smithingTool) {
                const oldItem = getItemById(this.smithingTool);
                if (oldItem) this.inventory.addItem(this.smithingTool, 1);
            }
            this.smithingTool = itemId;
            if (!this.ownedSmithingTools.includes(itemId)) this.ownedSmithingTools.push(itemId);
            this.inventory.removeItem(itemId, 1);
            return true;
        }

        const slot = this.getEquipSlotForItemType(item.type);
        if (this.equipment.hasOwnProperty(slot)) {
            // Check requirement (Realm)
            if (item.tier) {
                const { ARTIFACT_TIERS } = require('../configs/artifact-data.js');
                const tierInfo = ARTIFACT_TIERS[item.tier];
                if (tierInfo && this.realmId < (tierInfo.id * 4 - 3)) { // Simple heuristic: each tier is ~4 realms
                    // Actually, let's just check the name/id mapping if needed, 
                    // but for now a simple check:
                    if (item.tier === 'PHAP_KHI' && this.realmId < 1) return false; // Luyện Khí 1
                    if (item.tier === 'LINH_KHI' && this.realmId < 10) return false; // Trúc Cơ 1 (9+1)
                }
            }

            if (this.equipment[slot]) {
                if (!this.inventory.addItem(this.equipment[slot], 1)) return false;
            }
            this.equipment[slot] = itemId;
            this.inventory.removeItem(itemId, 1);
            this.calculateStats();
            return true;
        }
        return false;
    }

    getEquipSlotForItemType(itemType) {
        return itemType;
    }

    recognizeArtifact(slot) {
        const itemId = this.equipment[slot];
        if (!itemId) return { success: false, msg: "Không có pháp bảo ở ô này!" };
        
        // This is tricky because we don't store individual item instances with state in the equipment object yet.
        // We'll need a way to track if the *equipped* item is recognized.
        // For now, let's assume if it's in equipment, we can "recognize" it.
        // In a real system, we'd need to update the item metadata in inventory OR a separate equipment state.
        
        if (this.hp < this.maxHp * 0.5) return { success: false, msg: "Trạng thái suy kiệt, không thể hiến tế tinh huyết!" };
        
        this.hp -= this.maxHp * 0.3; // Cost 30% HP
        this.mana = 0; // Drain all mana
        
        // Mark as recognized - we'll need to store this in a persistent way.
        // For this demo, let's add a list of recognized items to player.
        if (!this.recognizedItems) this.recognizedItems = [];
        if (!this.recognizedItems.includes(itemId)) this.recognizedItems.push(itemId);
        
        this.calculateStats();
        return { success: true, msg: "Nhận chủ thành công! Cảm nhận được sự liên kết tâm linh với pháp bảo." };
    }

    repairArtifact(slot) {
        const itemId = this.equipment[slot];
        if (!itemId) return { success: false, msg: "Không có pháp bảo ở ô này!" };
        
        const cost = 500; // Fixed cost for now
        if (this.lingShi < cost) return { success: false, msg: "Không đủ Linh Thạch để sửa chữa!" };
        
        this.spendLingShi(cost);
        // Durability logic would go here if we tracked instance state
        return { success: true, msg: "Sửa chữa hoàn tất! Linh tính của pháp bảo đã khôi phục." };
    }

    unequip(slot) {
        if (this.equipment[slot]) {
            const itemId = this.equipment[slot];
            if (this.inventory.addItem(itemId, 1)) {
                this.equipment[slot] = null;
                this.calculateStats();
                return true;
            }
        }
        return false;
    }



    removeFromParty(npcId) {
        const index = this.party.findIndex(npc => npc.id === npcId);
        if (index > -1) {
            this.party.splice(index, 1);
            return true;
        }
        return false;
    }

    addAlchemyExp(amount) {
        const secret = this.learnedSecretTechniques.find(s => s.id === 'bp_luyen_dan');
        const masteryLevel = secret?.masteryLevel || 1;
        const secretData = getSecretTechniqueById('bp_luyen_dan');
        const bonus = secretData?.masteryBonuses?.[masteryLevel]?.alchemyExpBonus || 1.0;
        
        this.alchemyExp += amount * bonus;
        const nextLevelExp = this.alchemyLevel * 100 * Math.pow(1.5, this.alchemyLevel - 1);
        if (this.alchemyExp >= nextLevelExp) {
            this.alchemyExp -= nextLevelExp;
            this.alchemyLevel++;
            return true;
        }
        return false;
    }

    addTalismanExp(amount) {
        const secret = this.learnedSecretTechniques.find(s => s.id === 'bp_phu_luc');
        const masteryLevel = secret?.masteryLevel || 1;
        const secretData = getSecretTechniqueById('bp_phu_luc');
        const bonus = secretData?.masteryBonuses?.[masteryLevel]?.talismanExpBonus || 1.0;

        this.talismanExp += amount * bonus;
        const nextLevelExp = this.talismanLevel * 100 * Math.pow(1.5, this.talismanLevel - 1);
        if (this.talismanExp >= nextLevelExp) {
            this.talismanExp -= nextLevelExp;
            this.talismanLevel++;
            return true;
        }
        return false;
    }

    addSmithingExp(amount) {
        const secret = this.learnedSecretTechniques.find(s => s.id === 'bp_luyen_khi');
        const masteryLevel = secret?.masteryLevel || 1;
        const secretData = getSecretTechniqueById('bp_luyen_khi');
        const bonus = secretData?.masteryBonuses?.[masteryLevel]?.smithingExpBonus || 1.0;

        this.smithingExp += amount * bonus;
        const nextLevelExp = this.smithingLevel * 100 * Math.pow(1.5, this.smithingLevel - 1);
        if (this.smithingExp >= nextLevelExp) {
            this.smithingExp -= nextLevelExp;
            this.smithingLevel++;
            return true;
        }
        return false;
    }

    addBeastExp(amount) {
        this.beastExp += amount;
        const nextLevelExp = this.beastLevel * 100 * Math.pow(1.5, this.beastLevel - 1);
        if (this.beastExp >= nextLevelExp) {
            this.beastExp -= nextLevelExp;
            this.beastLevel++;
            return true;
        }
        return false;
    }

    addInsectExp(amount) {
        this.insectExp += amount;
        const nextLevelExp = this.insectLevel * 100 * Math.pow(1.5, this.insectLevel - 1);
        if (this.insectExp >= nextLevelExp) {
            this.insectExp -= nextLevelExp;
            this.insectLevel++;
            return true;
        }
        return false;
    }

    addCorpseExp(amount) {
        this.corpseExp += amount;
        const nextLevelExp = this.corpseLevel * 100 * Math.pow(1.5, this.corpseLevel - 1);
        if (this.corpseExp >= nextLevelExp) {
            this.corpseExp -= nextLevelExp;
            this.corpseLevel++;
            return true;
        }
        return false;
    }

    addFormationExp(amount) {
        this.formationExp += amount;
        const nextLevelExp = this.formationLevel * 100 * Math.pow(1.5, this.formationLevel - 1);
        if (this.formationExp >= nextLevelExp) {
            this.formationExp -= nextLevelExp;
            this.formationLevel++;
            return true;
        }
        return false;
    }

    addPuppetExp(amount) {
        this.puppetExp += amount;
        const nextLevelExp = this.puppetLevel * 100 * Math.pow(1.5, this.puppetLevel - 1);
        if (this.puppetExp >= nextLevelExp) {
            this.puppetExp -= nextLevelExp;
            this.puppetLevel++;
            return true;
        }
        return false;
    }

    useItem(itemId) {
        const item = getItemById(itemId);
        if (!item || item.type !== 'consumable') return { success: false, msg: "Vật phẩm không thể sử dụng!" };

        if (!this.inventory.hasItem(itemId, 1)) return { success: false, msg: "Không đủ vật phẩm!" };

        let success = false;
        let msg = "";

        if (itemId === 'dan_giai_doc') {
            const beforeCount = this.buffs.length;
            this.buffs = this.buffs.filter(b => b.id !== 'hoa_doc' && b.id !== 'moc_doc' && !b.id.includes('doc'));
            success = true;
            if (this.buffs.length < beforeCount) {
                msg = `Sử dụng ${item.name}! Độc tố chướng khí tích tụ trong cơ thể đã bị thanh lý hoàn toàn!`;
            } else {
                msg = `Sử dụng ${item.name}! Linh mạch thanh khiết, không phát hiện độc tố ẩn tàng.`;
            }
        } else if (itemId === 'hoa_nguyen_dan') {
            const hadTauHoa = this.hasStatusEffect('tau_hoa_nhap_ma');
            const hadCanCo = this.hasStatusEffect('can_co_bat_on');
            this.removeStatusEffect('tau_hoa_nhap_ma');
            this.removeStatusEffect('can_co_bat_on');
            this.deviationTime = 0;
            success = true;
            if (hadTauHoa || hadCanCo) {
                msg = `Sử dụng ${item.name}! Pháp lực điên cuồng được quy đạo, trị khỏi hoàn toàn Tẩu Hỏa Nhập Ma và củng cố đạo cơ vững chắc!`;
            } else {
                msg = `Sử dụng ${item.name}! Đạo tâm được củng cố vô cùng kiên định!`;
            }
        } else if (item.effect) {
            const effect = item.effect;
            switch (effect.type) {
                case 'tu_vi':
                    this.tuVi += effect.value;
                    success = true;
                    msg = `Sử dụng ${item.name}, nhận được ${effect.value} tu vi!`;
                    break;
                case 'buff':
                    this.addBuff({
                        id: item.id,
                        stat: effect.stat,
                        value: effect.value,
                        duration: effect.duration * 1000
                    });
                    success = true;
                    msg = `Sử dụng ${item.name}, nhận được hiệu ứng ${effect.stat}!`;
                    break;
                case 'heal':
                    const healAmount = Math.floor(this.maxHp * effect.value);
                    this.hp = Math.min(this.maxHp, this.hp + healAmount);
                    success = true;
                    msg = `Sử dụng ${item.name}, hồi phục ${healAmount} HP!`;
                    break;
                case 'restore':
                    if (effect.hp) this.hp = Math.min(this.maxHp, this.hp + effect.hp);
                    if (effect.mana) this.mana = Math.min(this.maxMana, this.mana + effect.mana);
                    
                    // Also cure some internal injuries (nội thương)
                    let injuryCured = false;
                    const noiThuongNhe = this.getStatusEffect('noi_thuong_nhe');
                    const noiThuong = this.getStatusEffect('noi_thuong');
                    const trongThuong = this.getStatusEffect('trong_thuong');
                    
                    if (noiThuongNhe) {
                        if (noiThuongNhe.stacks > 1) {
                            noiThuongNhe.stacks--;
                        } else {
                            this.removeStatusEffect('noi_thuong_nhe');
                        }
                        injuryCured = true;
                    } else if (noiThuong) {
                        if (noiThuong.stacks > 1) {
                            noiThuong.stacks--;
                        } else {
                            this.removeStatusEffect('noi_thuong');
                        }
                        injuryCured = true;
                    } else if (trongThuong) {
                        if (trongThuong.stacks > 1) {
                            trongThuong.stacks--;
                        } else {
                            this.removeStatusEffect('trong_thuong');
                        }
                        injuryCured = true;
                    }
                    
                    success = true;
                    if (injuryCured) {
                        msg = `Sử dụng ${item.name}, khí huyết dồi dào, nội thương của ngươi đã dịu đi đáng kể!`;
                    } else {
                        msg = `Sử dụng ${item.name}, hồi phục trạng thái!`;
                    }
                    break;
                case 'unlock_profession':
                    if (this.unlockedProfessions.includes(effect.profession)) {
                        return { success: false, msg: "Ngươi đã lĩnh hội nghề này rồi!" };
                    }
                    this.unlockedProfessions.push(effect.profession);
                    if (effect.secretId) {
                        this.learnSecretTechnique(effect.secretId);
                    }
                    success = true;
                    msg = `Lĩnh hội thành công! Nghề ${effect.profession} đã được mở khóa trong Bách Nghệ Đường.`;
                    break;
                case 'technique_mastery': {
                    // Instantly add flat mastery to all equipped techniques
                    const masterGain = effect.value || 500;
                    const equippedIds = [this.mainTechniqueId, this.mainBodyTechniqueId, this.mainSoulTechniqueId].filter(Boolean);
                    if (equippedIds.length === 0) {
                        return { success: false, msg: "Ngươi chưa trang bị công pháp nào!" };
                    }
                    const techSys = state.systems && state.systems.technique;
                    if (techSys) {
                        equippedIds.forEach(tid => techSys.addMastery(tid, masterGain));
                    } else {
                        // Fallback: directly mutate
                        equippedIds.forEach(tid => {
                            const t = this.learnedTechniques.find(l => l.id === tid);
                            if (t) t.mastery = (t.mastery || 0) + masterGain;
                        });
                    }
                    success = true;
                    msg = `[ĐẠI NGỘ] Sử dụng ${item.name}! Toàn bộ công pháp đang tu luyện nhận thêm ${masterGain} điểm thuần thục!`;
                    break;
                }
                case 'technique_mastery_buff':
                    // Apply a timed buff that multiplies passive mastery gain rate
                    this.addBuff({
                        id: 'ngo_dao_buff',
                        stat: 'mastery_speed',
                        value: effect.value || 2.0,
                        duration: (effect.duration || 7200) * 1000
                    });
                    success = true;
                    msg = `Sử dụng ${item.name}! Tốc độ lĩnh ngộ công pháp tăng ${effect.value || 2}x trong ${Math.floor((effect.duration || 7200) / 3600)} giờ!`;
                    break;
            }
        }

        if (success) {
            this.inventory.removeItem(itemId, 1);
            this.calculateStats();
            return { success, msg };
        }

        return { success: false, msg: "Không có hiệu ứng nào xảy ra..." };
    }


    // Technique Methods
    getComprehensionTier() {
        const comp = this.getComprehension() || 30;
        if (comp < 30) {
            return { id: 'dan_don', name: 'Đần Độn', description: 'Khó hiểu công pháp, tốc độ tu luyện cực chậm', color: '#6b7280' };
        } else if (comp < 50) {
            return { id: 'binh_thuong', name: 'Bình Thường', description: 'Phổ thông đại chúng, hiểu biết bình thường', color: '#10b981' };
        } else if (comp < 70) {
            return { id: 'thong_minh', name: 'Thông Minh', description: 'Học nhanh hiểu rộng, tư duy nhạy bén', color: '#3b82f6' };
        } else if (comp < 90) {
            return { id: 'thien_tai', name: 'Thiên Tài', description: 'Lĩnh ngộ cực mạnh, trăm năm khó gặp', color: '#8b5cf6' };
        } else {
            return { id: 'yeu_nghiet', name: 'Yêu Nghiệt', description: 'Ngộ tính nghịch thiên, tự sáng lập đạo pháp', color: '#f59e0b' };
        }
    }

    getTechniqueComprehensionInfo(techId) {
        const tech = getTechniqueById(techId) || getSecretTechniqueById(techId) || (this.customTechniques || []).find(t => t.id === techId);
        if (!tech) return { baseTime: 60, difficultyName: 'Phổ Thông', element: 'Neutral', type: 'linh_luc' };
        
        const quality = tech.quality || 'Phàm Giai';
        let baseTime = 60;
        let difficultyName = 'Phổ Thông';
        
        if (tech.comprehendDifficulty) {
            baseTime = tech.comprehendDifficulty.baseTime;
            difficultyName = tech.comprehendDifficulty.difficultyName;
        } else {
            if (quality.includes('Phàm')) { baseTime = 30; difficultyName = 'Rất Dễ'; }
            else if (quality.includes('Hoàng')) { baseTime = 90; difficultyName = 'Dễ'; }
            else if (quality.includes('Huyền')) { baseTime = 300; difficultyName = 'Bình Thường'; }
            else if (quality.includes('Địa')) { baseTime = 900; difficultyName = 'Khó'; }
            else if (quality.includes('Thiên')) { baseTime = 2700; difficultyName = 'Cực Khó'; }
            else if (quality.includes('Linh')) { baseTime = 7200; difficultyName = 'Huyền Diệu'; }
            else if (quality.includes('Thánh')) { baseTime = 14400; difficultyName = 'Thần Bí'; }
            else if (quality.includes('Tiên')) { baseTime = 28800; difficultyName = 'Nghịch Thiên'; }
            else if (quality.includes('Đế')) { baseTime = 57600; difficultyName = 'Đế Khó'; }
            else if (quality.includes('Đạo')) { baseTime = 115200; difficultyName = 'Vô Thượng'; }
        }
        
        return { 
            baseTime, 
            difficultyName,
            element: tech.element || 'Neutral',
            type: getTechniqueTypeSlug(tech.type || 'linh_luc')
        };
    }

    startComprehendingTechnique(techId, isSecret = false) {
        const learned = isSecret 
            ? this.learnedSecretTechniques.some(t => t.id === techId)
            : this.learnedTechniques.some(t => t.id === techId);
        
        if (learned) {
            return { success: false, msg: `Ngươi đã lĩnh ngộ ${isSecret ? 'bí thuật' : 'công pháp'} này từ trước rồi!` };
        }

        const inProgress = this.comprehendingTechniques.some(t => t.id === techId);
        if (inProgress) {
            return { success: false, msg: `Ngươi đang trong quá trình lĩnh ngộ ${isSecret ? 'bí thuật' : 'công pháp'} này rồi!` };
        }

        const techData = isSecret 
            ? getSecretTechniqueById(techId) 
            : (getTechniqueById(techId) || (this.customTechniques || []).find(t => t.id === techId));
            
        if (!techData) {
            return { success: false, msg: "Không tìm thấy thông tin bí tịch!" };
        }

        const info = this.getTechniqueComprehensionInfo(techId);
        const totalDuration = info.baseTime;

        this.comprehendingTechniques.push({
            id: techId,
            progress: 0,
            durationLeft: totalDuration,
            totalDuration: totalDuration,
            isSecret: isSecret
        });

        return { 
            success: true, 
            msg: `Bắt đầu tham ngộ « ${techData.name} »! Độ khó: ${info.difficultyName}.` 
        };
    }

    tickComprehendingTechniques(delta) {
        if (!this.comprehendingTechniques || this.comprehendingTechniques.length === 0) return;

        // Focus on the first technique in the queue
        const current = this.comprehendingTechniques[0];
        if (!current) return;

        const techData = current.isSecret 
            ? getSecretTechniqueById(current.id) 
            : (getTechniqueById(current.id) || (this.customTechniques || []).find(t => t.id === current.id));
            
        if (!techData) {
            this.comprehendingTechniques.shift();
            return;
        }

        const tier = this.getComprehensionTier();
        
        // 1. NGỘ TÍNH (Savvy / Comprehension)
        let savvySpeed = 1.0;
        if (tier.id === 'dan_don') savvySpeed = 0.5;
        else if (tier.id === 'binh_thuong') savvySpeed = 1.0;
        else if (tier.id === 'thong_minh') savvySpeed = 1.8;
        else if (tier.id === 'thien_tai') savvySpeed = 3.5;
        else if (tier.id === 'yeu_nghiet') savvySpeed = 8.0;

        // Savvy points scaling
        savvySpeed *= (1 + (this.getComprehension() || 0) / 100);

        // 2. LINH CĂN (Spiritual Root) Compatibility
        let rootMult = 1.0;
        let rootBonusText = '';
        const techElement = techData.element || 'Neutral';
        
        if (this.spiritualRoot) {
            if (techElement === 'Neutral') {
                if (this.spiritualRoot.type.includes('Thiên Linh Căn') || this.spiritualRoot.type.includes('Ngũ Hành')) {
                    rootMult = 1.2;
                    rootBonusText = 'Ngũ Hành/Thiên Linh (+20%)';
                }
            } else {
                let elPct = 0;
                if (this.spiritualRoot.proportions) {
                    elPct = (this.spiritualRoot.proportions[techElement] || 0) / 100;
                } else if (this.spiritualRoot.elements) {
                    if (this.spiritualRoot.elements.includes(techElement)) {
                        elPct = 1.0 / this.spiritualRoot.elements.length;
                    }
                }
                
                if (elPct > 0) {
                    if (this.spiritualRoot.type.includes('Thiên Linh Căn')) {
                        rootMult = 2.5;
                        rootBonusText = 'Thiên Linh Căn Thuần Khiết (+150%)';
                    } else if (this.spiritualRoot.type.includes('Dị Linh Căn')) {
                        rootMult = 2.2;
                        rootBonusText = 'Dị Linh Căn Biến Dị (+120%)';
                    } else if (this.spiritualRoot.type.includes('Ngũ Hành Linh Căn')) {
                        rootMult = 1.5;
                        rootBonusText = 'Ngũ Hành Hòa Hợp (+50%)';
                    } else {
                        rootMult = 1.0 + elPct * 1.5;
                        rootBonusText = `Linh Căn Tương Hợp (+${Math.round(elPct * 150)}%)`;
                    }
                } else {
                    rootMult = 0.3;
                    rootBonusText = 'Linh Căn Xung Khắc (-70%)';
                }
            }
        }

        // 3. THẦN HỒN / THẦN THỨC (Soul / Divine Sense)
        const soulMod = 1.0 + (this.divineSense || 0) / 200; // e.g. 100 points = +50% speed
        
        // 4. THỂ CHẤT (Physique) for Luyện Thể techniques
        let physiqueMult = 1.0;
        let physiqueBonusText = '';
        const isBodyRefining = getTechniqueTypeSlug(techData.type) === 'luyen_the';
        
        if (isBodyRefining && this.physique && this.physique.id) {
            const premiumPhysiques = ['hoang_co_thanh_the', 'kim_cuong_bao_the', 'van_menh_hu_vo', 'thon_thien_the', 'tu_la_huyet_the', 'chan_long_the', 'dau_chien_thanh_the', 'hon_don_the', 'tien_thien_thanh_the_dao_thai', 'vinh_hang_tien_the'];
            const elementPhysiquesMap = {
                'loi_linh_the': 'Lôi',
                'hoa_linh_the': 'Hỏa',
                'thuy_linh_the': 'Thủy',
                'thai_duong_thanh_the': 'Hỏa'
            };
            
            if (premiumPhysiques.includes(this.physique.id)) {
                physiqueMult = 2.5;
                physiqueBonusText = 'Thánh Thể/Cực Đạo Thể Luyện Thể (+150%)';
            } else if (elementPhysiquesMap[this.physique.id] && elementPhysiquesMap[this.physique.id] === techElement) {
                physiqueMult = 2.0;
                physiqueBonusText = 'Thể Chất Thuộc Tính Tương Hợp (+100%)';
            } else if (this.physique.id !== 'binh_thuong') {
                physiqueMult = 1.3;
                physiqueBonusText = 'Linh Thể Bổ Trợ (+30%)';
            }
        }

        // 5. KINH MẠCH (Meridians)
        let meridianMult = 1.0;
        let meridianBonusText = '';
        const hasKinhMachTanKhuyet = this.talents && this.talents.some(t => t.id === 'kinh_mach_tan_khuyet');
        const hasTuyetMachPheThe = this.physique && this.physique.id === 'tuyet_mach_phe_the';
        const hasTienThienDaoThe = this.physique && this.physique.id === 'tien_thien_dao_the';

        if (hasKinhMachTanKhuyet || hasTuyetMachPheThe) {
            meridianMult = 0.5;
            meridianBonusText = 'Kinh Mạch Bế Tắc (-50%)';
        } else if (hasTienThienDaoThe || (this.stability && this.stability > 80)) {
            meridianMult = 1.2;
            meridianBonusText = 'Kinh Mạch Hoàn Mỹ (+20%)';
        }

        // 6. HUYẾT MẠCH (Bloodline)
        let bloodlineMult = 1.0;
        let bloodlineBonusText = '';
        const isMaDaoOrigin = this.origin && this.origin.id === 'ma_dao';
        if ((this.race === 'DEMON' || isMaDaoOrigin) && techData.quality && (techData.quality.includes('Địa') || techData.quality.includes('Huyền')) && techData.description && (techData.description.includes('Ma') || techData.description.includes('Quỷ'))) {
            bloodlineMult = 1.8;
            bloodlineBonusText = 'Ma Tộc Huyết Mạch (+80%)';
        } else if (this.race === 'YAO' && techData.description && (techData.description.includes('Thú') || techData.description.includes('Yêu'))) {
            bloodlineMult = 1.8;
            bloodlineBonusText = 'Yêu Tộc Huyết Mạch (+80%)';
        }

        // --- Calculate Combined Speed Multiplier ---
        let speedMult = savvySpeed * rootMult * soulMod * physiqueMult * meridianMult * bloodlineMult;
        
        // Safety cap: minimum 0.05x speed
        speedMult = Math.max(0.05, speedMult);

        // Store breakdown for UI to render
        current.speedMult = speedMult;
        current.speedBreakdown = {
            savvy: savvySpeed,
            root: rootMult,
            rootText: rootBonusText,
            soul: soulMod,
            physique: physiqueMult,
            physiqueText: physiqueBonusText,
            meridian: meridianMult,
            meridianText: meridianBonusText,
            bloodline: bloodlineMult,
            bloodlineText: bloodlineBonusText
        };

        // --- BACKLASH CHECKS ---
        const quality = techData.quality || 'Phàm Giai';
        
        // Minimum divine sense requirements
        let minDivineSense = 0;
        if (quality.includes('Huyền')) minDivineSense = 30;
        else if (quality.includes('Địa')) minDivineSense = 60;
        else if (quality.includes('Thiên')) minDivineSense = 100;
        else if (quality.includes('Tiên') || quality.includes('Linh') || quality.includes('Thánh')) minDivineSense = 200;

        // Minimum physique talent (Căn Cốt) requirements for Luyện Thể
        let minCanCot = 0;
        if (isBodyRefining) {
            if (quality.includes('Huyền')) minCanCot = 30;
            else if (quality.includes('Địa')) minCanCot = 60;
            else if (quality.includes('Thiên')) minCanCot = 100;
        }

        // Trigger Backlash per second (adjusted for tick delta)
        const backlashChance = 0.015 * delta; // 1.5% chance per second of tick
        const isImmuneToBodyBacklash = this.physique && ['hoang_co_thanh_the', 'kim_cuong_bao_the', 'van_menh_hu_vo', 'chan_long_the', 'hon_don_the'].includes(this.physique.id);

        if (Math.random() < backlashChance) {
            // Check Soul Backlash
            if ((getTechniqueTypeSlug(techData.type) === 'than_thuc' || minDivineSense > 0) && (this.divineSense || 0) < minDivineSense) {
                const stabilityLoss = 5 + Math.floor(Math.random() * 6);
                const hpLoss = Math.floor((this.maxHp || 100) * (0.02 + Math.random() * 0.03));
                const manaLoss = Math.floor((this.maxMana || 50) * (0.05 + Math.random() * 0.05));

                this.stability = Math.max(0, (this.stability || 100) - stabilityLoss);
                this.hp = Math.max(1, (this.hp || 100) - hpLoss);
                this.mana = Math.max(0, (this.mana || 50) - manaLoss);

                this.pendingEvents.push({
                    type: 'seclusion_event',
                    eventType: 'backlash',
                    msg: `⚡ [THẦN HỒN PHẢN PHỆ] Công pháp « ${techData.name} » quá mức thâm sâu vượt trội Thần Thức hiện tại (${this.divineSense}/${minDivineSense})! Linh thức ngươi bị trùng kích dữ dội, chấn động linh hải! (Khấu trừ ${hpLoss} HP, ${manaLoss} Mana, -${stabilityLoss}% Độ Ổn Định)`
                });
            }

            // Check Physical Backlash
            if (isBodyRefining && minCanCot > 0 && (this.physiqueTalent || 0) < minCanCot && !isImmuneToBodyBacklash) {
                const stabilityLoss = 3 + Math.floor(Math.random() * 4);
                const hpLoss = Math.floor((this.maxHp || 100) * (0.04 + Math.random() * 0.04));

                this.stability = Math.max(0, (this.stability || 100) - stabilityLoss);
                this.hp = Math.max(1, (this.hp || 100) - hpLoss);

                this.pendingEvents.push({
                    type: 'seclusion_event',
                    eventType: 'backlash',
                    msg: `☠️ [NHỤC THÂN KIỆT SỨC] Thân thể không chịu nổi gánh nặng của công pháp Luyện Thể đòi hỏi Căn Cốt cao (${this.physiqueTalent}/${minCanCot})! Cơ nhục nứt rách, huyết khí hỗn loạn! (Khấu trừ ${hpLoss} HP, -${stabilityLoss}% Độ Ổn Định)`
                });
            }
        }

        // Automatic Stop Safeguard
        if (this.hp < (this.maxHp || 100) * 0.1) {
            this.pendingEvents.push({
                type: 'forced_breakthrough',
                success: false,
                msg: `⚠️ CẢNH BÁO TỬ VONG! Trạng thái khí huyết quá yếu ớt do Phản Phệ (<10% HP)! Quá trình tham ngộ « ${techData.name} » đã tự động đình chỉ để tránh tẩu hỏa nhập ma vong mạng!`
            });
            return;
        }

        // Apply background progress
        const secondsProgress = delta * speedMult;
        current.durationLeft = Math.max(0, current.durationLeft - secondsProgress);
        current.progress = Math.min(100, Math.floor(((current.totalDuration - current.durationLeft) / current.totalDuration) * 100));

        // Epiphany checks (Tỷ lệ đốn ngộ) - Scaled by Ngộ Tính & Khí Vận
        let epiphanyChancePerSec = 0.001;
        if (tier.id === 'dan_don') epiphanyChancePerSec = 0.0003;
        else if (tier.id === 'binh_thuong') epiphanyChancePerSec = 0.001;
        else if (tier.id === 'thong_minh') epiphanyChancePerSec = 0.003;
        else if (tier.id === 'thien_tai') epiphanyChancePerSec = 0.008;
        else if (tier.id === 'yeu_nghiet') epiphanyChancePerSec = 0.02;

        // Luck scaling on epiphany rate
        epiphanyChancePerSec *= (1 + (this.luck || 50) / 100);

        if (Math.random() < epiphanyChancePerSec * delta) {
            // Luck also increases epiphany boost power
            const luckBonus = (this.luck || 50) / 400; // e.g., 100 luck = +25% size boost
            const boostPercent = 0.25 + luckBonus + Math.random() * 0.25;
            const durationBoost = current.totalDuration * boostPercent;
            current.durationLeft = Math.max(0, current.durationLeft - durationBoost);
            current.progress = Math.min(100, Math.floor(((current.totalDuration - current.durationLeft) / current.totalDuration) * 100));

            this.pendingEvents.push({
                type: 'seclusion_event',
                eventType: 'insight',
                msg: `⚡ [ĐỐN NGỘ] Linh quang thiên địa bỗng hiển hiện! Đầu óc ngươi thông suốt cực đại, đại đạo chí giản, trực tiếp lĩnh ngộ vượt bậc « ${techData.name} »! (Tiến độ tăng vọt ${Math.round(boostPercent * 100)}%)`
            });
        }

        // Check completion
        if (current.durationLeft <= 0) {
            this.comprehendingTechniques.shift(); // Remove from queue

            if (current.isSecret) {
                this.learnSecretTechnique(current.id);
            } else {
                this.learnTechnique(current.id);
            }

            // High Savvy + Luck Hidden Talent bonus reward (Unlock hidden skill)
            let hiddenSkillMsg = '';
            // Base chance 25% for Thiên Tài, 80% for Yêu Nghiệt, scaled by Luck
            const hiddenRewardChance = (tier.id === 'yeu_nghiet' ? 0.8 : (tier.id === 'thien_tai' ? 0.25 : 0.05)) * (1 + (this.luck || 50) / 150);
            
            if (Math.random() < hiddenRewardChance) {
                const tpReward = Math.floor(Math.random() * 16) + 15; // 15 to 30 Technique Points
                this.techniquePoints = (this.techniquePoints || 0) + tpReward;
                hiddenSkillMsg = `\n\n✨ [THIÊN PHÚ BÁ KIỆT] Nhờ vào Ngộ Tính cấp ${tier.name} và Đại Khí Vận bẩm sinh, ngươi đã ngộ ra huyền cơ ẩn giấu bên trong bí tịch, tự đục đẽo ra chân lý nhận thêm ${tpReward} Điểm Công Pháp!`;
            }

            this.pendingEvents.push({
                type: 'forced_breakthrough',
                success: true,
                msg: `🎉 LĨNH NGỘ VIÊN MÃN!\n\nNgươi đã hoàn tất quá trình tham ngộ, chính thức nắm vững: « ${techData.name} »!${hiddenSkillMsg}`
            });
        }
    }

    learnTechnique(techId, qualityId = 'BINH_THUONG') {
        const existing = this.learnedTechniques.find(t => t.id === techId);
        if (existing) return false;
        
        const techData = getTechniqueById(techId);
        if (!techData) return false;

        this.learnedTechniques.push({
            id: techId,
            stage: 1,
            mastery: 0,
            masteryLevel: 1, // 1: Nhập Môn, 2: Tiểu Thành, 3: Đại Thành, 4: Viên Mãn
            quality: TECHNIQUE_QUALITIES[qualityId.toUpperCase()] || TECHNIQUE_QUALITIES.BINH_THUONG
        });

        // Auto-equip as main if none equipped for that path
        const techType = getTechniqueTypeSlug(techData.type);
        if (techType === 'linh_luc' && !this.mainTechniqueId) {
            this.mainTechniqueId = techId;
        } else if (techType === 'luyen_the' && !this.mainBodyTechniqueId) {
            this.mainBodyTechniqueId = techId;
        } else if (techType === 'than_thuc' && !this.mainSoulTechniqueId) {
            this.mainSoulTechniqueId = techId;
        }

        if (typeof this.calculateStats === 'function') this.calculateStats();
        return true;
    }

    learnSecretTechnique(secretId) {
        if (this.learnedSecretTechniques.find(s => s.id === secretId)) return false;
        const secretData = getSecretTechniqueById(secretId);
        if (!secretData) return false;

        this.learnedSecretTechniques.push({
            id: secretId,
            mastery: 0,
            masteryLevel: 1
        });
        
        // Auto-equip if slot available
        if (this.equippedSecretTechniqueIds.length < 3) {
            this.equippedSecretTechniqueIds.push(secretId);
        }
        return true;
    }

    gainTechniqueMastery(techId, amount, isSecret = false) {
        const list = isSecret ? this.learnedSecretTechniques : this.learnedTechniques;
        const entry = list.find(t => t.id === techId);
        if (!entry) return null;

        entry.mastery += amount;
        
        const currentLevel = entry.masteryLevel || 1;
        const nextLevel = MASTERY_LEVELS.find(m => m.id === currentLevel + 1);
        
        if (nextLevel && entry.mastery >= nextLevel.threshold) {
            entry.masteryLevel = nextLevel.id;
            this.calculateStats();
            return { leveledUp: true, newLevel: nextLevel.name };
        }
        return { leveledUp: false };
    }


    unlockProfession(id) {
        if (!this.unlockedProfessions.includes(id)) {
            this.unlockedProfessions.push(id);
            return true;
        }
        return false;
    }

    /**
     * Đột phá tầng (Layer) cho Bí Pháp
     */
    breakthroughSecretTechnique(id) {
        const secret = this.learnedSecretTechniques.find(s => s.id === id);
        const data = getSecretTechniqueById(id);
        
        if (!secret || !data) return { success: false, msg: "Không tìm thấy bí pháp." };
        
        const maxStage = data.maxStage || 1;
        if (secret.stage >= maxStage) {
            return { success: false, msg: "Bí pháp đã đạt đại viên mãn, không thể đột phá thêm." };
        }
        
        if (secret.masteryLevel < 4) {
            return { success: false, msg: "Cần đạt đến cảnh giới Viên Mãn mới có thể đột phá tầng tiếp theo." };
        }

        // Cost calculation (can be adjusted)
        const costTuVi = secret.stage * 5000 * (data.quality === 'Địa' ? 2 : data.quality === 'Thiên' ? 5 : 1);
        
        if (this.tuVi < costTuVi) {
            return { success: false, msg: `Chưa đủ Tu Vi để đột phá. Cần: ${costTuVi.toLocaleString()} Tu Vi.` };
        }

        this.tuVi -= costTuVi;
        secret.stage++;
        secret.mastery = 0;
        secret.masteryLevel = 1; // Reset to Nhập Môn at new layer

        this.calculateStats();
        return { 
            success: true, 
            msg: `Chúc mừng! Ngươi đã đột phá ${data.name} lên Tầng ${secret.stage}!`,
            stage: secret.stage
        };
    }

    // --- Physique Methods ---
    
    awakePhysique() {
        if (!this.physique || this.physique.awakened) return { success: false, msg: "Thể chất đã thức tỉnh hoặc không tồn tại." };
        
        const physData = getPhysiqueById(this.physique.id);
        if (!physData.needAwaken) return { success: false, msg: "Thể chất này không cần thức tỉnh đặc biệt." };

        // Requirements could be added here (e.g., item, realm)
        this.physique.awakened = true;
        this.physique.phenomenonActive = true;
        
        this.calculateStats();
        return { 
            success: true, 
            msg: `Thức tỉnh thành công: ${physData.name}!`, 
            phenomenon: physData.phenomenon 
        };
    }

    evolvePhysique() {
        const physData = getPhysiqueById(this.physique.id);
        if (!physData.evolution) return { success: false, msg: "Thể chất này đã đạt đến giới hạn, không thể tiến hóa." };

        const nextPhysId = physData.evolution;
        const nextPhysData = getPhysiqueById(nextPhysId);

        // Evolution logic: Usually requires "Viên Mãn" or "Hoàn Mỹ" stage
        if (this.physique.stage !== 'VIEN_MAN' && this.physique.stage !== 'HOAN_MY') {
            return { success: false, msg: "Cần đạt đến cảnh giới Viên Mãn mới có thể tiến hóa thể chất." };
        }

        this.physique.id = nextPhysId;
        this.physique.stage = 'SO_KHAI'; // Reset stage for new physique
        
        this.calculateStats();
        return { success: true, msg: `Thể chất đã tiến hóa thành: ${nextPhysData.name}!` };
    }

    gainPhysiqueExp(amount) {
        if (!this.physique) return;
        this.physique.exp += amount;
        
        // Simple level up logic for stages
        const stageOrder = ['SO_KHAI', 'TIEU_THANH', 'DAI_THANH', 'VIEN_MAN', 'HOAN_MY'];
        const currentIndex = stageOrder.indexOf(this.physique.stage);
        
        const expRequired = 1000 * Math.pow(5, currentIndex);
        if (this.physique.exp >= expRequired && currentIndex < stageOrder.length - 1) {
            this.physique.exp -= expRequired;
            this.physique.stage = stageOrder[currentIndex + 1];
            this.calculateStats();
            return { leveledUp: true, newStage: this.physique.stage };
        }
        return { leveledUp: false };
    }

    /**
     * Chuyển đổi công pháp chủ tu
     * @param {string} id - ID công pháp
     * @param {string} method - Phương thức đổi (null, 'tan_cong', 'hoa_nguyen_dan', 'chuyen_hoa', 'equip_secret')
     */
    setMainTechnique(id, method = null) {
        // Fetch technique data
        let techData = null;
        let isSecret = false;
        
        // 1. Check if it's a learned cultivation technique
        const learnedTech = this.learnedTechniques.find(t => t.id === id);
        if (learnedTech) {
            techData = typeof getTechniqueById === 'function' ? getTechniqueById(id) : null;
            if (!techData && this.customTechniques) {
                techData = this.customTechniques.find(t => t.id === id);
            }
        }
        
        // 2. Check if it's a learned secret technique
        if (!techData) {
            const learnedSecret = this.learnedSecretTechniques.find(s => s.id === id);
            if (learnedSecret) {
                techData = typeof getSecretTechniqueById === 'function' ? getSecretTechniqueById(id) : null;
                isSecret = true;
            }
        }

        if (!techData) {
            return { success: false, msg: "Không tìm thấy dữ liệu công pháp hoặc bí pháp." };
        }

        if (isSecret) {
            // Secret techniques equip logic (giới hạn 3 bí pháp)
            if (this.equippedSecretTechniqueIds && this.equippedSecretTechniqueIds.includes(id)) {
                 return { success: false, msg: "Bí pháp này đã được trang bị rồi." };
            }
            if (!this.equippedSecretTechniqueIds) this.equippedSecretTechniqueIds = [];
            if (this.equippedSecretTechniqueIds.length >= 3) {
                 if (method !== 'equip_secret') {
                     return { requireConfirmation: true, type: 'secret', msg: "Ngươi đã trang bị tối đa 3 bí pháp. Muốn thay thế bí pháp cũ nhất không?" };
                 } else {
                     this.equippedSecretTechniqueIds.shift();
                 }
            }
            this.equippedSecretTechniqueIds.push(id);
            if (typeof this.calculateStats === 'function') this.calculateStats();
            return { success: true, msg: `Đã trang bị bí pháp: ${techData.name}` };
        }

        const type = getTechniqueTypeSlug(techData.type);
        let currentMainId = null;

        if (type === 'linh_luc') {
            currentMainId = this.mainTechniqueId;
        } else if (type === 'luyen_the') {
            currentMainId = this.mainBodyTechniqueId;
        } else if (type === 'than_thuc') {
            currentMainId = this.mainSoulTechniqueId;
        } else if (type === 'don_thuat') {
            this.mainEscapeId = id;
            if (typeof this.calculateStats === 'function') this.calculateStats();
            return { success: true, msg: `Đã trang bị độn thuật: ${techData.name}` };
        } else if (type === 'song_tu') {
            this.mainDualId = id;
            if (typeof this.calculateStats === 'function') this.calculateStats();
            return { success: true, msg: `Đã trang bị công pháp song tu: ${techData.name}` };
        } else if (type === 'phu_tro') {
            if (!this.equippedAuxiliaryIds) this.equippedAuxiliaryIds = [];
            if (this.equippedAuxiliaryIds.includes(id)) {
                return { success: false, msg: "Công pháp phụ trợ này đã được trang bị rồi." };
            }
            if (this.equippedAuxiliaryIds.length >= 3) {
                this.equippedAuxiliaryIds.shift(); // Remove the oldest equipped auxiliary technique
            }
            this.equippedAuxiliaryIds.push(id);
            if (typeof this.calculateStats === 'function') this.calculateStats();
            return { success: true, msg: `Đã trang bị công pháp phụ trợ: ${techData.name}` };
        } else {
            return { success: false, msg: "Loại công pháp không hợp lệ để trang bị." };
        }

        if (currentMainId === id) {
            return { success: false, msg: "Công pháp này đang là chủ tu rồi." };
        }

        if (currentMainId && !method) {
            return { 
                requireConfirmation: true, 
                type: 'cultivation',
                msg: `Thay đổi công pháp chủ tu rất nguy hiểm do pháp lực xung đột. Đạo hữu muốn chọn cách thức nào để đổi công pháp?` 
            };
        }

        if (currentMainId && method) {
            if (method === 'tan_cong') {
                this.tuVi = Math.floor(this.tuVi * 0.5); // Mất 50% tu vi
                this.stability = (this.stability || 100) - 20;
                if (this.stability < 0) {
                    this.stability = 0;
                    this.heartDemon = (this.heartDemon || 0) + 10;
                }
            } else if (method === 'hoa_nguyen_dan') {
                if (this.inventory.hasItem('hoa_nguyen_dan', 1)) {
                    this.inventory.removeItem('hoa_nguyen_dan', 1);
                } else {
                    return { success: false, msg: "Ngươi không có Hóa Nguyên Đan! Hãy mua tại Vạn Bảo Các hoặc cửa hàng tông môn." };
                }
            } else if (method === 'chuyen_hoa') {
                const perception = this.advancedStats?.perception || 0;
                if (perception < 50 && this.realmId < 10) { // Ví dụ: Cần Kim Đan (10) hoặc Thần thức > 50
                    return { success: false, msg: "Thần thức hoặc cảnh giới chưa đủ để chuyển hóa pháp lực an toàn (Yêu cầu Thần Thức > 50 hoặc đạt tới Kim Đan kỳ)." };
                }
                // Thêm buff suy nhược 10 phút
                const now = Date.now();
                this.buffs.push({ id: 'suy_nhuoc_atk_' + now, name: 'Suy Nhược', desc: 'Suy nhược do chuyển hóa pháp lực', type: 'debuff', stat: 'atk', value: 0.5, duration: 600, startTime: now });
                this.buffs.push({ id: 'suy_nhuoc_def_' + now, name: 'Suy Nhược', desc: 'Suy nhược do chuyển hóa pháp lực', type: 'debuff', stat: 'def', value: 0.5, duration: 600, startTime: now });
                this.buffs.push({ id: 'suy_nhuoc_spd_' + now, name: 'Suy Nhược', desc: 'Suy nhược do chuyển hóa pháp lực', type: 'debuff', stat: 'spd', value: 0.5, duration: 600, startTime: now });
            }
        }

        if (type === 'linh_luc') {
            this.mainTechniqueId = id;
        } else if (type === 'luyen_the') {
            this.mainBodyTechniqueId = id;
        } else if (type === 'than_thuc') {
            this.mainSoulTechniqueId = id;
        }

        if (typeof this.calculateStats === 'function') this.calculateStats();

        return { success: true, msg: "Đã thiết lập công pháp chủ tu thành công." };
    }

    unequipTechnique(type, id = null) {
        const slug = getTechniqueTypeSlug(type);
        if (slug === 'don_thuat') {
            this.mainEscapeId = null;
        } else if (slug === 'song_tu') {
            this.mainDualId = null;
        } else if (slug === 'phu_tro') {
            if (id) {
                this.equippedAuxiliaryIds = (this.equippedAuxiliaryIds || []).filter(x => x !== id);
            } else {
                this.equippedAuxiliaryIds = [];
            }
        } else if (slug === 'bi_phap' || slug === 'secret') {
            if (id) {
                this.equippedSecretTechniqueIds = (this.equippedSecretTechniqueIds || []).filter(x => x !== id);
            }
        }
        if (typeof this.calculateStats === 'function') this.calculateStats();
        return { success: true, msg: "Đã tháo gỡ thành công." };
    }

    /**
     * Chuyển đổi đối tượng Player thành dữ liệu JSON để lưu trữ
     */
    save() {
        return {
            name: this.name,
            gender: this.gender,
            avatar: this.avatar,
            race: this.race,
            mainPath: this.mainPath,
            realmId: this.realmId,
            tuVi: this.tuVi,
            age: this.age,
            maxAge: this.maxAge,
            permanentLifespanBonus: this.permanentLifespanBonus || 0,
            path: this.path,
            hp: this.hp,
            maxHp: this.maxHp,
            mana: this.mana,
            maxMana: this.maxMana,
            stamina: this.stamina,
            maxStamina: this.maxStamina,
            lastUpdate: this.lastUpdate || Date.now(),
            playTime: this.playTime || 0,
            
            // Stats
            baseStats: { ...this.baseStats },
            bonusStats: { ...this.bonusStats },
            stats: { ...this.stats },
            advancedStats: { ...this.advancedStats },
            
            // Realms & Exp
            bodyRealmId: this.bodyRealmId,
            bodyExp: this.bodyExp,
            soulRealmId: this.soulRealmId,
            soulExp: this.soulExp,
            specializedPaths: JSON.parse(JSON.stringify(this.specializedPaths)),
            cultivationFocus: this.cultivationFocus,
            meridianCycles: JSON.parse(JSON.stringify(this.meridianCycles || {
                tuvi: { step: 0, count: 0 },
                body: { step: 0, count: 0 },
                soul: { step: 0, count: 0 }
            })),
            
            // Background & Destiny
            spiritualRoot: this.spiritualRoot,
            spiritRoot: this.spiritRoot ? [...this.spiritRoot] : [],
            physique: this.physique ? { ...this.physique } : null,
            origin: this.origin,
            talents: [...(this.talents || [])],
            destinyRating: this.destinyRating,
            luck: this.luck,
            karma: this.karma,
            fame: this.fame,
            evil: this.evil,
            fate: JSON.parse(JSON.stringify(this.fate)),
            cheatSystemId: this.cheatSystemId,
            
            // Resources
            spiritStoneSettings: { ...this.spiritStoneSettings },
            totalSpent: this.totalSpent,
            vipLevel: this.vipLevel,
            inventory: this.inventory.save(),
            
            // Techniques
            mainTechniqueId: this.mainTechniqueId,
            mainBodyTechniqueId: this.mainBodyTechniqueId,
            mainSoulTechniqueId: this.mainSoulTechniqueId,
            mainEscapeId: this.mainEscapeId,
            mainDualId: this.mainDualId,
            equippedAuxiliaryIds: [...(this.equippedAuxiliaryIds || [])],
            learnedTechniques: [...this.learnedTechniques],
            learnedSecretTechniques: [...this.learnedSecretTechniques],
            equippedSecretTechniqueIds: [...this.equippedSecretTechniqueIds],
            comprehendingTechniques: [...this.comprehendingTechniques],
            techniquePoints: this.techniquePoints,
            customTechniques: [...(this.customTechniques || [])],
            deviationTime: this.deviationTime || 0,
            
            // Professions & Systems
            unlockedProfessions: [...this.unlockedProfessions],
            alchemyLevel: this.alchemyLevel,
            alchemyExp: this.alchemyExp,
            currentCauldron: this.currentCauldron,
            currentFlame: this.currentFlame,
            knownRecipes: [...this.knownRecipes],
            ownedFlames: [...this.ownedFlames],
            ownedCauldrons: [...this.ownedCauldrons],
            alchemyReputation: this.alchemyReputation,
            danPoison: this.danPoison,
            
            smithingLevel: this.smithingLevel,
            smithingExp: this.smithingExp,
            smithingTool: this.smithingTool,
            knownSmithingRecipes: [...this.knownSmithingRecipes],
            
            talismanLevel: this.talismanLevel,
            talismanExp: this.talismanExp,
            currentTalismanPen: this.currentTalismanPen,
            knownTalismanRecipes: [...this.knownTalismanRecipes],
            
            formationLevel: this.formationLevel,
            formationExp: this.formationExp,
            activeFormations: [...this.activeFormations],
            formationSlots: this.formationSlots,
            knownFormations: [...this.knownFormations],
            
            puppetLevel: this.puppetLevel,
            puppetExp: this.puppetExp,
            knownPuppetRecipes: [...this.knownPuppetRecipes],
            
            corpseLevel: this.corpseLevel,
            corpseExp: this.corpseExp,
            refinedCorpses: [...this.refinedCorpses],
            knownCorpseRecipes: [...this.knownCorpseRecipes],
            
            beastLevel: this.beastLevel,
            beastExp: this.beastExp,
            insectLevel: this.insectLevel,
            insectExp: this.insectExp,
            beasts: [...this.beasts],
            hatchingBeasts: [...this.hatchingBeasts],
            
            gardenPlots: JSON.parse(JSON.stringify(this.gardenPlots)),
            mountainSurvival: { ...this.mountainSurvival },
            
            miningState: { ...this.miningState },
            equipment: { ...this.equipment },
            equipmentMetadata: { ...this.equipmentMetadata },
            recognizedItems: [...this.recognizedItems],
            
            // Social & Organization
            sectId: this.sectId,
            sectContribution: this.sectContribution,
            sectRank: this.sectRank,
            activeSectMissions: [...this.activeSectMissions],
            sectTournamentYear: this.sectTournamentYear,
            knownNPCs: { ...this.knownNPCs },
            party: [...this.party],
            
            // Energy & Environment
            qiAccumulated: { ...this.qiAccumulated },
            currentEnvironmentalQi: this.currentEnvironmentalQi ? { ...this.currentEnvironmentalQi } : null,
            
            // Misc
            buffs: [...this.buffs],
            isSecluded: this.isSecluded,
            currentWorldId: this.currentWorldId,
            currentLocId: this.currentLocId,
            explorationProgress: this.explorationProgress,
            gridExplorationState: this.gridExplorationState || null,
            createdAt: this.createdAt,
            
            // External systems data
            npcData: (typeof state !== 'undefined' && state.systems.npc) ? state.systems.npc.saveData() : null,
            socialData: (typeof state !== 'undefined' && state.systems.social) ? state.systems.social.getData() : null
        };
    }

    embarkPath(pathId) {
        const pathConfig = CULTIVATION_PATHS[pathId];
        if (!pathConfig) {
            return { success: false, msg: "Con đường tu luyện không hợp lệ." };
        }
        if (pathConfig.category !== 'specialized') {
            return { success: false, msg: "Đây không phải là một con đường chuyên sâu." };
        }

        // Check race requirements
        if (pathConfig.races && pathConfig.races.length > 0) {
            if (!pathConfig.races.includes(this.race)) {
                return { success: false, msg: `Chủng tộc ${this.race} không thể tu luyện con đường này.` };
            }
        }

        // Check required main path
        const mainPath = this.mainPath || 'orthodox';
        if (pathConfig.requiredMain && pathConfig.requiredMain.length > 0) {
            if (!pathConfig.requiredMain.includes(mainPath)) {
                const requiredNames = pathConfig.requiredMain.map(p => CULTIVATION_PATHS[p]?.name || p).join(', ');
                return { success: false, msg: `Con đường này yêu cầu hệ tu luyện chủ chốt là: ${requiredNames}.` };
            }
        }

        if (!this.specializedPaths) this.specializedPaths = {};
        if (!this.specializedPaths[pathId]) {
            this.specializedPaths[pathId] = { realmId: 0, exp: 0, name: pathConfig.name };
        }

        if (this.specializedPaths[pathId].realmId > 0) {
            return { success: false, msg: `Bạn đã bước vào con đường ${pathConfig.name} rồi.` };
        }

        // Embark! Set to realm level 1
        this.specializedPaths[pathId].realmId = 1;
        this.specializedPaths[pathId].exp = 0;
        this.calculateStats();

        return { success: true, msg: `Chúc mừng bạn đã bắt đầu tu luyện con đường ${pathConfig.name}!` };
    }

    convertMainPath(newPathId) {
        const newPathConfig = CULTIVATION_PATHS[newPathId];
        if (!newPathConfig) {
            return { success: false, msg: "Con đường tu luyện mới không hợp lệ." };
        }
        if (newPathConfig.category !== 'main') {
            return { success: false, msg: "Chỉ có thể chuyển đổi giữa các con đường tu luyện chính." };
        }

        const currentPath = this.mainPath || 'orthodox';
        if (currentPath === newPathId) {
            return { success: false, msg: "Bạn đã tu luyện con đường này rồi." };
        }

        // Check race requirements
        if (newPathConfig.races && !newPathConfig.races.includes(this.race)) {
            return { success: false, msg: `Chủng tộc ${this.race} không thể chuyển sang con đường này.` };
        }

        // Transition logic
        this.mainPath = newPathId;

        // Reset specialized paths that are no longer compatible
        let resetPaths = [];
        if (this.specializedPaths) {
            Object.entries(this.specializedPaths).forEach(([sid, pData]) => {
                if (pData.realmId > 0) {
                    const specConfig = CULTIVATION_PATHS[sid];
                    if (specConfig && specConfig.requiredMain && specConfig.requiredMain.length > 0) {
                        if (!specConfig.requiredMain.includes(newPathId)) {
                            pData.realmId = 0;
                            pData.exp = 0;
                            resetPaths.push(specConfig.name);
                        }
                    }
                }
            });
        }

        // Recalculate stats
        this.calculateStats();

        let msg = `Chuyển đổi thành công sang ${newPathConfig.name}!`;
        if (resetPaths.length > 0) {
            msg += ` Do không tương thích, các con đường chuyên sâu sau đã bị reset: ${resetPaths.join(', ')}.`;
        }

        return { success: true, msg };
    }

    /**
     * Khôi phục trạng thái Player từ dữ liệu JSON
     */
    load(data) {
        if (!data) return;

        // Basic Info
        this.name = data.name || this.name;
        this.gender = data.gender || this.gender;
        this.avatar = data.avatar || (['female', 'Nữ'].includes(this.gender) ? "player_female" : "player_male");
        this.race = data.race || this.race;
        this.mainPath = data.mainPath || null;
        this.realmId = data.realmId || this.realmId;
        this.tuVi = data.tuVi || 0;
        this.age = data.age || this.age;
        this.maxAge = data.maxAge || this.maxAge;
        this.permanentLifespanBonus = data.permanentLifespanBonus || 0;
        this.path = data.path || this.path;
        
        // Vitals
        this.maxHp = data.maxHp || this.maxHp;
        this.hp = data.hp !== undefined ? data.hp : this.maxHp;
        this.maxMana = data.maxMana || this.maxMana;
        this.mana = data.mana !== undefined ? data.mana : this.maxMana;
        this.maxStamina = data.maxStamina || this.maxStamina;
        this.stamina = data.stamina !== undefined ? data.stamina : this.maxStamina;
        
        this.lastUpdate = data.lastUpdate || Date.now();
        this.playTime = data.playTime || 0;
        this.createdAt = data.createdAt || Date.now();

        // Stats
        if (data.baseStats) this.baseStats = { ...this.baseStats, ...data.baseStats };
        if (data.bonusStats) this.bonusStats = { ...this.bonusStats, ...data.bonusStats };
        if (data.stats) this.stats = { ...this.stats, ...data.stats };
        if (data.advancedStats) this.advancedStats = { ...this.advancedStats, ...data.advancedStats };
        
        // Realms
        this.bodyRealmId = data.bodyRealmId || 1;
        this.bodyExp = data.bodyExp || 0;
        this.soulRealmId = data.soulRealmId || 1;
        this.soulExp = data.soulExp || 0;
        if (data.specializedPaths) this.specializedPaths = { ...this.specializedPaths, ...data.specializedPaths };
        this.cultivationFocus = data.cultivationFocus || 'tuvi';
        this.meridianCycles = data.meridianCycles || {
            tuvi: { step: 0, count: 0 },
            body: { step: 0, count: 0 },
            soul: { step: 0, count: 0 }
        };

        // Background
        this.spiritualRoot = data.spiritualRoot;
        this.spiritRoot = data.spiritRoot || [];
        this.physique = data.physique || null;
        this.origin = data.origin || null;
        this.talents = data.talents || [];
        this.destinyRating = data.destinyRating || "Phàm mệnh";
        
        this.luck = data.luck || 50;
        this.karma = data.karma || 0;
        this.fame = data.fame || 0;
        this.evil = data.evil || 0;
        if (data.fate) this.fate = { ...this.fate, ...data.fate };
        this.cheatSystemId = data.cheatSystemId || null;

        // Resources
        if (data.spiritStoneSettings) this.spiritStoneSettings = { ...this.spiritStoneSettings, ...data.spiritStoneSettings };
        this.totalSpent = data.totalSpent || 0;
        this.vipLevel = data.vipLevel || 0;
        

        if (data.inventory) {
            this.inventory.load(data.inventory);
        }
        
        // Techniques
        this.mainTechniqueId = data.mainTechniqueId || null;
        this.mainBodyTechniqueId = data.mainBodyTechniqueId || null;
        this.mainSoulTechniqueId = data.mainSoulTechniqueId || null;
        this.mainEscapeId = data.mainEscapeId || null;
        this.mainDualId = data.mainDualId || null;
        this.equippedAuxiliaryIds = data.equippedAuxiliaryIds || [];
        this.learnedTechniques = data.learnedTechniques || [];
        this.learnedSecretTechniques = data.learnedSecretTechniques || [];
        this.equippedSecretTechniqueIds = data.equippedSecretTechniqueIds || [];
        this.comprehendingTechniques = data.comprehendingTechniques || [];
        this.techniquePoints = data.techniquePoints || 0;
        this.customTechniques = data.customTechniques || [];
        this.deviationTime = data.deviationTime || 0;
        
        // Professions
        this.unlockedProfessions = Array.isArray(data.unlockedProfessions) ? data.unlockedProfessions : [];
        this.alchemyLevel = data.alchemyLevel || 1;
        this.alchemyExp = data.alchemyExp || 0;
        this.currentCauldron = data.currentCauldron || null;
        this.currentFlame = data.currentFlame || null;
        this.knownRecipes = data.knownRecipes || [];
        this.ownedFlames = data.ownedFlames || [];
        this.ownedCauldrons = data.ownedCauldrons || [];
        this.alchemyReputation = data.alchemyReputation || 0;
        this.danPoison = data.danPoison || 0;
        
        this.smithingLevel = data.smithingLevel || 1;
        this.smithingExp = data.smithingExp || 0;
        this.smithingTool = data.smithingTool || null;
        this.knownSmithingRecipes = data.knownSmithingRecipes || [];
        
        this.talismanLevel = data.talismanLevel || 1;
        this.talismanExp = data.talismanExp || 0;
        this.currentTalismanPen = data.currentTalismanPen || null;
        this.knownTalismanRecipes = data.knownTalismanRecipes || [];
        
        this.formationLevel = data.formationLevel || 1;
        this.formationExp = data.formationExp || 0;
        this.activeFormations = data.activeFormations || [];
        this.formationSlots = data.formationSlots || 1;
        this.knownFormations = data.knownFormations || [];
        
        this.puppetLevel = data.puppetLevel || 1;
        this.puppetExp = data.puppetExp || 0;
        this.knownPuppetRecipes = data.knownPuppetRecipes || [];
        
        this.corpseLevel = data.corpseLevel || 1;
        this.corpseExp = data.corpseExp || 0;
        this.refinedCorpses = data.refinedCorpses || [];
        this.knownCorpseRecipes = data.knownCorpseRecipes || [];
        
        this.beastLevel = data.beastLevel || 1;
        this.beastExp = data.beastExp || 0;
        this.insectLevel = data.insectLevel || 1;
        this.insectExp = data.insectExp || 0;
        this.beasts = data.beasts || [];
        this.hatchingBeasts = data.hatchingBeasts || [];
        
        if (data.gardenPlots) {
            this.gardenPlots = data.gardenPlots.map(p => {
                if (p === null) return { grade: 'PHAM', attribute: 'NORMAL', seedId: null, age: 0, status: 'empty' };
                return p;
            });
        }
        if (data.mountainSurvival) this.mountainSurvival = { ...this.mountainSurvival, ...data.mountainSurvival };
        
        this.miningState = data.miningState || this.miningState;
        if (data.equipment) {
            const defaultEquipment = { 
                head: null, necklace: null, weapon: null, armor: null, accessory: null, 
                attackArtifact: null, defenseArtifact: null, flightArtifact: null, 
                spaceArtifact: null, formationArtifact: null, supportArtifact: null, 
                soulArtifact: null, shoes: null 
            };
            this.equipment = { ...defaultEquipment, ...data.equipment };
        }
        this.equipmentMetadata = data.equipmentMetadata || {};
        this.recognizedItems = data.recognizedItems || [];
        
        // Organization
        this.sectId = data.sectId || null;
        this.sectContribution = data.sectContribution || 0;
        this.sectRank = data.sectRank || (this.sectId ? 'ngoai_mon' : 'ngoai_mon');
        this.activeSectMissions = data.activeSectMissions || [];
        this.sectTournamentYear = data.sectTournamentYear || -1;
        this.knownNPCs = data.knownNPCs || {};
        this.party = data.party || [];
        
        // Energy & Environment
        this.qiAccumulated = data.qiAccumulated || {};
        this.currentEnvironmentalQi = data.currentEnvironmentalQi || null;
        
        // Misc
        this.buffs = data.buffs || [];
        this.isSecluded = data.isSecluded || false;
        
        this.currentWorldId = data.currentWorldId || 'nhan_gioi';
        this.currentLocId = data.currentLocId || 'thanh_van_tran';
        this.explorationProgress = data.explorationProgress || 0;
        this.gridExplorationState = data.gridExplorationState || null;

        this.calculateStats();
    }
}
