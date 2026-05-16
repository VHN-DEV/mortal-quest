import { getRealmById, RACE_DATA } from '../configs/realm-data.js';
import { Inventory } from './inventory.js';
import { state } from '../state.js';
import { getItemById } from '../configs/item-data.js';
import { getTechniqueById, getSecretTechniqueById, TECHNIQUE_LEVELS, TECHNIQUE_QUALITIES, MASTERY_LEVELS } from '../configs/technique-data.js';
import { getPhysiqueById, getPhysiqueAwakenBonus, PHYSIQUE_GRADES, PHYSIQUE_STAGES } from '../configs/physique-data.js';
import { ARTIFACT_SETS } from '../configs/artifact-data.js';
import { CREATION_TRAITS, ROOT_ELEMENTS, SPECIAL_ELEMENTS } from '../configs/creation-data.js';
import { TITLES } from '../configs/fate-data.js';

export class Player {
    constructor() {
        this.name = "Phàm Nhân";
        this.gender = "Nam";
        this.avatar = "player_male";
        this.race = 'HUMAN'; // HUMAN, SPIRIT_BEAST, DEMON, etc.
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
        this.mainTechniqueId = null;
        this.mainBodyTechniqueId = null;
        this.mainSoulTechniqueId = null;
        
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

        // Destiny properties
        this.age = 18;
        this.createdAt = Date.now();
        this.maxAge = 100;
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
        this.learnedTechniques = []; // Array of { id, stage, mastery, masteryLevel, quality }
        this.learnedSecretTechniques = []; // Array of { id, mastery, masteryLevel }
        this.equippedSecretTechniqueIds = [];
        this.secretTechniqueCooldowns = {};
        this.techniquePoints = 0;
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
        this.age = 18;
        this.maxAge = 100; // Base human lifespan

        // Persistence of location
        this.currentLocId = null;
        this.explorationProgress = 0;

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
        this.mainTechniqueId = null;
        this.learnedTechniques = []; // Array of { id, stage, mastery }
        this.learnedSecretTechniqueIds = [];
        this.equippedSecretTechniqueIds = []; // up to 3 slots
        this.techniquePoints = 0;
        this.knownNPCs = {};
        this.pendingEvents = []; // To communicate forced events to UI

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
            lifesteal: 0
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
        this.stability = 100;    // Độ ổn định: 0-100%
        this.heartDemon = 0;     // Tâm ma: 0-100%
        this.daoTam = 50;        // Đạo tâm: Chống tâm ma, ổn định linh lực
        this.divineSense = 50;   // Thần thức: Khống chế pháp bảo
        this.physiqueTalent = 50; // Căn cốt: HP và thể tu
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

        return remaining === 0;
    }

    addLingShi(amount) {
        if (amount <= 0) return;
        this.inventory.addItem('ling_thach_ha', amount);
    }

    addTuVi(amount) {
        this.tuVi += amount;
    }

    crushStone(itemId, count = 1) {
        if (state.systems.spiritStone) {
            return state.systems.spiritStone.crushStone(itemId, count);
        }
        return { success: false, msg: "Hệ thống Linh Thạch chưa khởi tạo." };
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

    getCurrentRealm(type = 'tuvi') {
        let id;
        if (type === 'tuvi') id = this.realmId;
        else if (type === 'body') id = this.bodyRealmId;
        else if (type === 'soul') id = this.soulRealmId;
        else if (this.specializedPaths[type]) id = this.specializedPaths[type].realmId;
        else id = 0;
        
        return getRealmById(id, type, this.race);
    }

    update(delta, multiplier = 1.0) {
        this.lastUpdate = Date.now();

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
        const compMult = 1 + (this.comprehension / 100);

        let finalMultiplier = multiplier * stabilityMult * compMult;
        if (this.isSecluded) finalMultiplier *= 5.0; // 5x gain during seclusion

        const tuViGain = hasTuviTech ? this.tuViPerSecond * (focus === 'tuvi' ? 1.0 : 0.2) * finalMultiplier * delta : 0;
        const bodyGain = hasBodyTech ? this.bodyExpPerSecond * (focus === 'body' ? 1.0 : 0.2) * finalMultiplier * delta : 0;
        const soulGain = hasSoulTech ? this.soulExpPerSecond * (focus === 'soul' ? 1.0 : 0.2) * finalMultiplier * delta : 0;

        this.tuVi += tuViGain;
        this.bodyExp += bodyGain;
        this.soulExp += soulGain;

        // 4. Seclusion Events (Randomized)
        if (this.isSecluded && Math.random() < 0.02 * delta) { // ~2% chance per second
            this.triggerSeclusionEvent();
        }
        
        // 5. Forced Breakthrough Check (Heavenly Dao)
        const realm = this.getCurrentRealm(focus);
        const exp = focus === 'tuvi' ? this.tuVi : (focus === 'body' ? this.bodyExp : this.soulExp);
        const timeSinceCreation = Date.now() - (this.createdAt || 0);
        
        if (exp >= realm.expRequired * 2.0 && timeSinceCreation > 10000) { // Only after 10 seconds of gameplay
            const result = this.breakthrough(focus, true);
            this.pendingEvents.push({ 
                type: 'forced_breakthrough', 
                success: result.success, 
                msg: result.msg,
                path: focus
            });
        }
        
        // 6. Regen
        let regenMult = 1.0;
        if (this.stability < 20) regenMult = 0.2; // Heart Demon suppresses regen

        this.stamina = Math.min(this.maxStamina, this.stamina + 0.1 * delta * regenMult);
        this.mana = Math.min(this.maxMana, this.mana + 0.05 * delta * regenMult);
        this.hp = Math.min(this.maxHp, this.hp + 0.01 * this.maxHp * delta * regenMult);

        // Update Buffs
        this.updateBuffs(delta);

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

    calculateStability() {
        // Stability decreases if Tu Vi is too far ahead of Body or Soul
        const avgOthers = (this.bodyRealmId + this.soulRealmId) / 2;
        const diff = this.realmId - avgOthers;
        
        let targetStability = 100;
        if (diff > 2) targetStability = 100 - (diff - 2) * 10;
        targetStability = Math.max(0, Math.min(100, targetStability));

        // Smooth transition
        if (this.stability > targetStability) this.stability -= 0.1;
        else if (this.stability < targetStability) this.stability += 0.05;

        // Heart Demon growth if stability is low
        if (this.stability < 30) {
            this.heartDemon += 0.01;
        } else {
            this.heartDemon = Math.max(0, this.heartDemon - 0.005);
        }
    }

    updateBuffs(delta) {
        if (!this.buffs || this.buffs.length === 0) return;
        
        const now = Date.now();
        const beforeCount = this.buffs.length;
        this.buffs = this.buffs.filter(b => b.endTime > now);
        
        if (this.buffs.length !== beforeCount) {
            this.calculateStats();
        }
    }

    addBuff(buff) {
        // buff: { id, stat, value, duration (ms) }
        const endTime = Date.now() + (buff.duration || 0);
        
        // Remove existing same type buff if needed or stack?
        // For now, replace if same id
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
            if (focus === 'tuvi') {
                gain = this.tuViPerSecond * 3 * totalMult;
                this.tuVi += gain;
            } else if (focus === 'body') {
                gain = this.bodyExpPerSecond * 12 * totalMult;
                this.bodyExp += gain;
            } else if (focus === 'soul') {
                gain = this.soulExpPerSecond * 12 * totalMult;
                this.soulExp += gain;
            }
            return { success: true, msg: "Tu luyện thành công.", gain, type: focus };
        }
        return { success: false, reason: `Không đủ tiêu hao để tu luyện (${cost.stamina} thể lực, ${cost.mana} linh lực).` };
    }

    canBreakthrough(type = 'tuvi') {
        const realm = this.getCurrentRealm(type);
        if (!realm) return { can: false, reason: "Cảnh giới không hợp lệ." };

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

        return { 
            can: currentExp >= realm.expRequired, 
            reason: currentExp < realm.expRequired ? `Cần thêm ${(realm.expRequired - currentExp).toLocaleString()} exp để đột phá.` : "",
            expRequired: realm.expRequired
        };
    }

    getStability() {
        return this.stability;
    }

    breakthrough(type = 'tuvi', isForced = false) {
        const check = this.canBreakthrough(type);
        if (check.can) {
            // Check for Qi Deviation risk
            let stability = this.getStability();
            if (isForced) stability *= 0.5; // Double risk for forced breakthrough
            
            // Apply Karma Penalty: Accumulated sins weigh down the soul
            const fatePenalty = window.game?.systems?.fate?.getBreakthroughPenalty() || 1.0;
            stability *= fatePenalty;
            
            const roll = Math.random() * 100;
            if (roll > stability) {
                // Qi Deviation!
                this.hp *= 0.1; // More severe damage
                const penalty = isForced ? 0.5 : 0.7;
                
                // Imbalance Penalty
                const tuViDiffBody = this.realmId - this.bodyRealmId;
                const tuViDiffSoul = this.realmId - this.soulRealmId;
                
                // Dao Heart protection
                const daoTamProtection = (this.daoTam || 50) / 200; // Up to 50% protection
                
                let extraMsg = "";
                if (tuViDiffBody > 5) {
                    this.hp *= (0.5 + daoTamProtection);
                    extraMsg += " Thân thể không chịu nổi linh lực bạo tẩu!";
                }
                if (tuViDiffSoul > 5) {
                    this.stability -= (20 * (1 - daoTamProtection));
                    this.heartDemon += (10 * (1 - daoTamProtection));
                    extraMsg += " Thần thức lung lay, tâm ma thừa cơ xâm nhập!";
                }

                if (type === 'tuvi') this.tuVi *= penalty;
                else if (type === 'body') this.bodyExp *= penalty;
                else if (type === 'soul') this.soulExp *= penalty;
                else if (this.specializedPaths[type]) this.specializedPaths[type].exp *= penalty;
                
                return { success: false, msg: (isForced ? "Thiên Đạo cưỡng ép đột phá thất bại! " : "Tẩu hỏa nhập ma! ") + extraMsg };
            }

            const realm = this.getCurrentRealm(type);
            if (type === 'tuvi') {
                this.tuVi -= realm.expRequired;
                this.realmId++;
            } else if (type === 'body') {
                this.bodyExp -= realm.expRequired;
                this.bodyRealmId++;
            } else if (type === 'soul') {
                this.soulExp -= realm.expRequired;
                this.soulRealmId++;
            } else if (this.specializedPaths[type]) {
                this.specializedPaths[type].exp -= realm.expRequired;
                this.specializedPaths[type].realmId++;
            }
            
            this.calculateStats();
            
            // Dao Heart increases stability after success
            this.stability = Math.min(100, this.stability + ((this.daoTam || 50) / 10));
            
            return { success: true, msg: isForced ? "Thiên Đạo cưỡng ép đột phá thành công! Ngươi may mắn thoát khỏi một kiếp." : "Đột phá thành công!" };
        }
        return { success: false, msg: check.reason || "Chưa đủ điều kiện đột phá." };
    }

    calculateStats() {
        const realmLevel = this.realmId;
        const bodyLevel = this.bodyRealmId;
        const soulLevel = this.soulRealmId;

        this.tuViPerSecond = 0;
        this.bodyExpPerSecond = 0;
        this.soulExpPerSecond = 0;

        // 0. Initialize BONUS & ADVANCED STATS
        this.bonusStats = {
            atk: 0, def: 0, spd: 0, maxHp: 0, maxMana: 0,
            tuViSpeed: 1, bodyExpSpeed: 1, soulExpSpeed: 1,
            maxAge: 0 
        };
        
        this.advancedStats = {
            pierce: 0, soulPierce: 0, critRate: 0.05, critDmg: 1.5,
            fireDmg: 1.0, waterDmg: 1.0, thunderDmg: 1.0,
            qiAbsorb: 1.0, lifeSteal: 0, alchemySuccess: 0,
            soulRepress: 0, perception: 5 + (soulLevel * 2), daoVun: 0, murderQi: 0,
            allRes: 0
        };

        // 1. Calculate BASE STATS (from Realms)
        const realmMult = realmLevel > 0 ? Math.pow(1.8, realmLevel - 1) : 1.0;
        
        const raceInfo = RACE_DATA[this.race || 'HUMAN'] || RACE_DATA.HUMAN;
        const raceMults = raceInfo.statMult;

        // Apply Racial Bonus from creation
        if (this.racialBonus) {
            Object.entries(this.racialBonus).forEach(([key, val]) => {
                if (this.advancedStats.hasOwnProperty(key)) {
                    if (['tvps', 'qiAbsorb', 'allRes', 'soulExpSpeed'].includes(key)) this.advancedStats[key] *= val;
                    else this.advancedStats[key] += val;
                } else if (this.bonusStats.hasOwnProperty(key)) {
                    if (key === 'tvps') this.bonusStats.tuViSpeed *= val;
                    else this.bonusStats[key] += val;
                } else if (this.baseStats.hasOwnProperty(key)) {
                    this.baseStats[key] += val;
                } else if (key === 'karma') {
                    this.karma += val;
                } else if (key === 'maxAge') {
                    this.bonusStats.maxAge += val;
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
        this.advancedStats.perception = 10 + (soulLevel * 5) + (this.comprehension * 0.5);

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
                    const elData = ROOT_ELEMENTS[elName] || SPECIAL_ELEMENTS[elName];
                    if (elData && elData.bonus) {
                        Object.entries(elData.bonus).forEach(([key, val]) => {
                            if (this.advancedStats.hasOwnProperty(key)) {
                                if (['fireDmg', 'waterDmg', 'thunderDmg', 'poisonDmg', 'skillDmg', 'dotDmg', 'qiAbsorb'].includes(key)) {
                                    this.advancedStats[key] *= val;
                                } else {
                                    this.advancedStats[key] += val;
                                }
                            }
                        });
                    }
                });
            }
        }

        // Apply Physique Talent
        this.baseStats.maxHp *= (1 + ((this.physiqueTalent || 50) / 200));
        this.baseStats.def *= (1 + ((this.physiqueTalent || 50) / 500));

        // Apply Comprehension
        this.bonusStats.tuViSpeed *= (1 + ((this.comprehension || 50) / 200));

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
                        this.advancedStats[type] += value;
                    } else if (this.bonusStats.hasOwnProperty(type)) {
                        this.bonusStats[type] += value;
                    }
                }
                
                // Durability penalty
                if (meta.durability < 20) {
                    mult *= 0.5; // Additional 50% penalty if artifact is broken
                }
            }
        });

        // 3.5 Apply SET BONUSES
        this.applySetBonuses(equippedIds);

        // 4. Combine BASE and BONUS for final values
        this.maxHp = this.baseStats.maxHp + this.bonusStats.maxHp;
        this.maxMana = this.baseStats.maxMana + this.bonusStats.maxMana;
        this.atk = this.baseStats.atk + this.bonusStats.atk;
        this.def = this.baseStats.def + this.bonusStats.def;
        this.spd = this.baseStats.spd + this.bonusStats.spd;

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

        // Apply Sect bonuses (Multiplier on total)
        if (this.sectId) {
            this.atk *= 1.1;
            this.def *= 1.1;
            this.maxHp *= 1.1;
            this.tuViPerSecond *= 1.05;
        }

        // Apply Buffs to final stats
        if (this.buffs) {
            this.buffs.forEach(b => {
                if (b.stat === 'atk') this.atk *= b.value;
                if (b.stat === 'def') this.def *= b.value;
                if (b.stat === 'spd') this.spd *= b.value;
                if (b.stat === 'maxHp') this.maxHp *= b.value;
                if (b.stat === 'maxMana') this.maxMana *= b.value;
                if (b.stat === 'tu_vi_speed') this.tuViPerSecond *= b.value;
                if (b.stat === 'body_speed') this.bodyExpPerSecond *= b.value;
                if (b.stat === 'soul_speed') this.soulExpPerSecond *= b.value;
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
        if (typeof energySystem !== 'undefined' && energySystem) {
            const energyBonuses = energySystem.getStatBonuses();
            this.atk += energyBonuses.atk || 0;
            this.def += energyBonuses.def || 0;
            this.maxHp += energyBonuses.hp || 0;
            this.maxMana += energyBonuses.mana || 0;
            this.spd += energyBonuses.spd || 0;
        }
        
        // 5. Finalize Secondary Stats
        const baseLifespan = raceInfo.baseLifespan || 100;
        this.maxAge = baseLifespan + (this.realmId * 50) + this.bonusStats.maxAge;

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
        const techData = getTechniqueById(techId);
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
                } else if (rootType === 'Thiên Linh Căn') {
                    attributeMult = 1.5; // Heaven Root gets 1.5x bonus for everything
                }
            } else if (techData.element) {
                // Legacy element match (50% bonus if technique matches spiritual root element)
                if (this.spiritualRoot.type === 'Thiên Linh Căn' || 
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
        }
        
        // Apply stat bonuses from technique
        if (techData.stats) {
            if (techData.stats.atk) this.bonusStats.atk += techData.stats.atk * finalMult;
            if (techData.stats.def) this.bonusStats.def += techData.stats.def * finalMult;
            if (techData.stats.hp) this.bonusStats.maxHp += techData.stats.hp * finalMult;
            if (techData.stats.mana) this.bonusStats.maxMana += techData.stats.mana * finalMult;
            if (techData.stats.spd) this.bonusStats.spd += techData.stats.spd * finalMult;
        }

        // Apply lifespan bonus if defined in effects
        if (techData.effects) {
            if (techData.effects.lifespanBonus) this.bonusStats.maxAge += techData.effects.lifespanBonus * finalMult;
            if (techData.effects.allRes) this.advancedStats.allRes += techData.effects.allRes * finalMult;
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

        if (item.effect) {
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
                    success = true;
                    msg = `Sử dụng ${item.name}, hồi phục trạng thái!`;
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
        if (techData.type === 'Linh Lực' && !this.mainTechniqueId) {
            this.mainTechniqueId = techId;
        } else if (techData.type === 'Luyện Thể' && !this.mainBodyTechniqueId) {
            this.mainBodyTechniqueId = techId;
        } else if (techData.type === 'Thần Thức' && !this.mainSoulTechniqueId) {
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

    setMainTechnique(techId) {
        const techEntry = this.learnedTechniques.find(t => t.id === techId);
        const techData = getTechniqueById(techId);
        if (techEntry && techData) {
            if (techData.type === 'Linh Lực') this.mainTechniqueId = techId;
            else if (techData.type === 'Luyện Thể') this.mainBodyTechniqueId = techId;
            else if (techData.type === 'Thần Thức') this.mainSoulTechniqueId = techId;
            
            if (typeof this.calculateStats === 'function') this.calculateStats();
            return true;
        }
        return false;
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
     * Chuyển đổi đối tượng Player thành dữ liệu JSON để lưu trữ
     */
    save() {
        return {
            name: this.name,
            gender: this.gender,
            avatar: this.avatar,
            race: this.race,
            realmId: this.realmId,
            tuVi: this.tuVi,
            age: this.age,
            maxAge: this.maxAge,
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
            
            // Resources
            spiritStoneSettings: { ...this.spiritStoneSettings },
            totalSpent: this.totalSpent,
            vipLevel: this.vipLevel,
            inventory: this.inventory.save(),
            
            // Techniques
            mainTechniqueId: this.mainTechniqueId,
            mainBodyTechniqueId: this.mainBodyTechniqueId,
            mainSoulTechniqueId: this.mainSoulTechniqueId,
            learnedTechniques: [...this.learnedTechniques],
            learnedSecretTechniques: [...this.learnedSecretTechniques],
            equippedSecretTechniqueIds: [...this.equippedSecretTechniqueIds],
            techniquePoints: this.techniquePoints,
            
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
            createdAt: this.createdAt,
            
            // External systems data
            npcData: (typeof state !== 'undefined' && state.systems.npc) ? state.systems.npc.saveData() : null,
            socialData: (typeof state !== 'undefined' && state.systems.social) ? state.systems.social.getData() : null
        };
    }

    /**
     * Khôi phục trạng thái Player từ dữ liệu JSON
     */
    load(data) {
        if (!data) return;

        // Basic Info
        this.name = data.name || this.name;
        this.gender = data.gender || this.gender;
        this.avatar = data.avatar || (this.gender === "Nữ" ? "player_female" : "player_male");
        this.race = data.race || this.race;
        this.realmId = data.realmId || this.realmId;
        this.tuVi = data.tuVi || 0;
        this.age = data.age || this.age;
        this.maxAge = data.maxAge || this.maxAge;
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
        this.learnedTechniques = data.learnedTechniques || [];
        this.learnedSecretTechniques = data.learnedSecretTechniques || [];
        this.equippedSecretTechniqueIds = data.equippedSecretTechniqueIds || [];
        this.techniquePoints = data.techniquePoints || 0;
        
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

        this.calculateStats();
    }
}
