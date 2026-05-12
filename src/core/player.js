import { getRealmById } from '../configs/realm-data.js';
import { Inventory } from './inventory.js';
import { getItemById } from '../configs/item-data.js';
import { getTechniqueById, getSecretTechniqueById, TECHNIQUE_LEVELS, TECHNIQUE_QUALITIES, MASTERY_LEVELS } from '../configs/technique-data.js';
import { getPhysiqueById, getPhysiqueAwakenBonus, PHYSIQUE_GRADES, PHYSIQUE_STAGES } from '../configs/physique-data.js';
import { ARTIFACT_SETS } from '../configs/artifact-data.js';

export class Player {
    constructor() {
        this.name = "Phàm Nhân";
        this.realmId = 1;
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
        this.bodyRealmId = 1;
        this.bodyExp = 0;
        this.soulRealmId = 1;
        this.soulExp = 0;
        this.cultivationFocus = 'tuvi'; // 'tuvi', 'body', 'soul'
        
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
        this.currentCauldron = 'pham_lu';
        this.currentFlame = 'linh_hoa';
        this.danPoison = 0;
        this.knownRecipes = []; // No default recipes
        this.ownedFlames = ['linh_hoa'];
        this.ownedCauldrons = ['pham_lu'];
        this.alchemyReputation = 0;
        this.currentAlchemyRoom = null;
        this.gardenPlots = [
            { grade: 'PHAM', attribute: 'NORMAL', seedId: null, age: 0, status: 'empty' },
            { grade: 'PHAM', attribute: 'NORMAL', seedId: null, age: 0, status: 'empty' },
            { grade: 'PHAM', attribute: 'NORMAL', seedId: null, age: 0, status: 'empty' }
        ];
        this.mountainSurvival = { oxygen: 100, toxicity: 0 };

        // Talisman System
        this.talismanLevel = 1;
        this.talismanExp = 0;
        this.currentTalismanPen = 'truc_phu_but';
        this.knownTalismanRecipes = [];
        this.ownedTalismanPens = ['truc_phu_but'];

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
        this.currentWorldId = 'nhan_gioi';
        this.currentLocId = null;

        // Formation System
        this.activeFormations = []; // { id, startTime, staminaConsumed }
        this.formationSlots = 1;
        this.formationLevel = 1;
        this.formationExp = 0;

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

        // --- Advanced Stats (Artifacts) ---
        this.advancedStats = {
            pierce: 0,
            soulPierce: 0,
            critRate: 0.05, 
            critDmg: 1.5,   
            fireDmg: 1.0,   
            qiAbsorb: 1.0,  
            lifeSteal: 0,
            soulRepress: 0,
            daoVun: 0,
            murderQi: 0
        };

        this.equipmentMetadata = {}; // { [slot]: { spirit, level, durability, extraStat: { type, value } } }
        this.recognizedItems = [];
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
        
        this.inventory.items.forEach(item => {
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
            this.inventory.items.forEach(item => {
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
        const priority = this.spiritStoneSettings.autoUsePriority;
        const mappings = {
            'HA': { id: 'ling_thach_ha', val: 1 },
            'TRUNG': { id: 'ling_thach_trung', val: 100 },
            'THUONG': { id: 'ling_thach_thuong', val: 10000 },
            'CUC': { id: 'ling_thach_cuc', val: 1000000 }
        };

        // Tiêu thụ theo thứ tự ưu tiên
        for (const gradeId of priority) {
            if (gradeId === 'CUC' && this.spiritStoneSettings.lockCucPham && amount < 1000000) continue;
            
            const gradeInfo = mappings[gradeId];
            const item = this.inventory.items.find(i => i.id === gradeInfo.id);
            
            if (item && item.quantity > 0) {
                const totalValAvailable = item.quantity * gradeInfo.val;
                if (totalValAvailable >= remaining) {
                    const countToUse = Math.ceil(remaining / gradeInfo.val);
                    const overpaid = (countToUse * gradeInfo.val) - remaining;
                    
                    this.inventory.removeItem(gradeInfo.id, countToUse);
                    remaining = 0;
                    
                    // Thối lại (Refund) nếu dùng đá cấp cao cho số lẻ
                    if (overpaid > 0) {
                        this.addLingShi(overpaid);
                    }
                    break;
                } else {
                    remaining -= totalValAvailable;
                    this.inventory.removeItem(gradeInfo.id, item.quantity);
                }
            }
        }

        if (remaining === 0) {
            this.totalSpent += amount;
            this.updateVipLevel();
            return true;
        }

        // Nếu vẫn còn nợ (do khóa Cực Phẩm hoặc logic khác), thử dùng nốt các loại khác không trong priority
        // (Implementation omitted for brevity, but recommended)
        
        return false;
    }

    addLingShi(amount) {
        if (amount === 0) return;
        
        // Nếu số lượng lớn (ví dụ > 10,000), có thể cân nhắc chia nhỏ hoặc giữ nguyên Hạ Phẩm.
        // Theo yêu cầu "không nên làm tròn", ta sẽ thêm trực tiếp vào loại tương ứng hoặc mặc định là Hạ Phẩm.
        if (amount > 0) {
            this.inventory.addItem('ling_thach_ha', amount);
        } else {
            // Trường hợp số âm (nợ), ta không thêm item mà trừ đi (nếu có logic xử lý nợ riêng)
            // Hiện tại spendLingShi đã xử lý việc trừ.
        }
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
        return getRealmById(type === 'tuvi' ? this.realmId : (type === 'body' ? this.bodyRealmId : this.soulRealmId), type);
    }

    update(delta, multiplier = 1.0) {
        this.lastUpdate = Date.now();

        // Independent progression for all three paths
        // Focused path gets full exp; non-focused paths only get 20% if they have their own technique.
        const focus = this.cultivationFocus || 'tuvi';

        const hasTuviTech = !!this.mainTechniqueId;
        const hasBodyTech = !!this.mainBodyTechniqueId;
        const hasSoulTech = !!this.mainSoulTechniqueId;

        const tuViGain = hasTuviTech ? this.tuViPerSecond * (focus === 'tuvi' ? 1.0 : 0.2) * multiplier * delta : 0;
        const bodyGain = hasBodyTech ? this.bodyExpPerSecond * (focus === 'body' ? 1.0 : 0.2) * multiplier * delta : 0;
        const soulGain = hasSoulTech ? this.soulExpPerSecond * (focus === 'soul' ? 1.0 : 0.2) * multiplier * delta : 0;

        this.tuVi += tuViGain;
        this.bodyExp += bodyGain;
        this.soulExp += soulGain;
        
        // Forced Breakthrough Check (Heavenly Dao)
        // If exp exceeds 150% of required, force breakthrough with higher risk
        const realm = this.getCurrentRealm(focus);
        const exp = focus === 'tuvi' ? this.tuVi : (focus === 'body' ? this.bodyExp : this.soulExp);
        if (exp >= realm.expRequired * 1.5) {
            const result = this.breakthrough(focus, true);
            this.pendingEvents.push({ 
                type: 'forced_breakthrough', 
                success: result.success, 
                msg: result.msg,
                path: focus
            });
        }
        
        // Regen
        this.stamina = Math.min(this.maxStamina, this.stamina + 0.1 * delta);
        this.mana = Math.min(this.maxMana, this.mana + 0.05 * delta);
        // Base regen is 0.2% per second, increased to 1% for better experience
        this.hp = Math.min(this.maxHp, this.hp + 0.01 * this.maxHp * delta);

        // Update Buffs
        this.updateBuffs(delta);
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

            if (focus === 'tuvi') {
                const gain = this.tuViPerSecond * 3 * totalMult;
                this.tuVi += gain;
            } else if (focus === 'body') {
                const gain = this.bodyExpPerSecond * 12 * totalMult;
                this.bodyExp += gain;
            } else if (focus === 'soul') {
                const gain = this.soulExpPerSecond * 12 * totalMult;
                this.soulExp += gain;
            }
            return { success: true, msg: "Tu luyện thành công." };
        }
        return { success: false, reason: `Không đủ tiêu hao để tu luyện (${cost.stamina} thể lực, ${cost.mana} linh lực).` };
    }

    canBreakthrough(type = 'tuvi') {
        const realm = this.getCurrentRealm(type);
        const exp = type === 'tuvi' ? this.tuVi : (type === 'body' ? this.bodyExp : this.soulExp);
        
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
            can: exp >= realm.expRequired, 
            reason: exp < realm.expRequired ? "Chưa đủ tích lũy." : "",
            expRequired: realm.expRequired
        };
    }

    getStability() {
        // Stability decreases if Tu Vi is too far ahead of Body or Soul
        const avgOthers = (this.bodyRealmId + this.soulRealmId) / 2;
        const diff = this.realmId - avgOthers;
        if (diff <= 2) return 100; // Stable
        if (diff <= 5) return 80;  // Slightly unstable
        if (diff <= 10) return 50; // Unstable - Risk of Qi Deviation
        return 20; // Critical instability
    }

    breakthrough(type = 'tuvi', isForced = false) {
        const check = this.canBreakthrough(type);
        if (check.can) {
            // Check for Qi Deviation risk
            let stability = this.getStability();
            if (isForced) stability *= 0.5; // Double risk for forced breakthrough
            
            const roll = Math.random() * 100;
            if (roll > stability) {
                // Qi Deviation!
                this.hp *= 0.3; // Heavy damage
                const penalty = isForced ? 0.6 : 0.8;
                if (type === 'tuvi') this.tuVi *= penalty;
                else if (type === 'body') this.bodyExp *= penalty;
                else if (type === 'soul') this.soulExp *= penalty;
                
                return { success: false, msg: isForced ? "Thiên Đạo cưỡng ép đột phá thất bại! Kinh mạch đứt đoạn, tu vi tổn thất nặng nề!" : "Tẩu hỏa nhập ma! Linh lực bạo tẩu làm tổn thương kinh mạch." };
            }

            if (type === 'tuvi') {
                this.tuVi -= check.expRequired;
                this.realmId++;
            } else if (type === 'body') {
                this.bodyExp -= check.expRequired;
                this.bodyRealmId++;
            } else if (type === 'soul') {
                this.soulExp -= check.expRequired;
                this.soulRealmId++;
            }
            
            this.calculateStats();
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

        // 1. Calculate BASE STATS (from Realms)
        const realmMult = Math.pow(1.8, realmLevel - 1);
        
        this.baseStats.maxMana = 50 * realmMult;
        this.baseStats.maxHp = 100 * realmMult;
        this.baseStats.atk = 10 * realmMult;
        this.baseStats.def = 5 * realmMult;
        this.baseStats.spd = 15 + (realmLevel * 5);

        // Body Realm adds to HP and Def
        this.baseStats.maxHp += 50 * (bodyLevel - 1) * Math.sqrt(realmLevel);
        this.baseStats.def += 10 * (bodyLevel - 1) * Math.sqrt(realmLevel);
        
        // Soul Realm adds to Mana and Spd
        this.baseStats.maxMana += 30 * (soulLevel - 1) * Math.sqrt(realmLevel);
        this.baseStats.spd += 5 * (soulLevel - 1);

        // 2. Initialize BONUS & ADVANCED STATS
        this.bonusStats = {
            atk: 0, def: 0, spd: 0, maxHp: 0, maxMana: 0,
            tuViSpeed: 1, bodyExpSpeed: 1, soulExpSpeed: 1
        };
        
        this.advancedStats = {
            pierce: 0, soulPierce: 0, critRate: 0.05, critDmg: 1.5,
            fireDmg: 1.0, qiAbsorb: 1.0, lifeSteal: 0,
            soulRepress: 0, daoVun: 0, murderQi: 0
        };

        // Apply Destiny Bonuses to Base or Bonus? Let's add to Base
        if (this.destinyStats) {
            if (this.destinyStats.atk) this.baseStats.atk += this.destinyStats.atk;
            if (this.destinyStats.def) this.baseStats.def += this.destinyStats.def;
            if (this.destinyStats.maxHp) this.baseStats.maxHp += this.destinyStats.maxHp;
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
        Object.values(this.equipment).forEach(itemId => {
            if (!itemId) return;
            equippedIds.push(itemId);
            const item = getItemById(itemId);
            if (!item || !item.stats) return;

            // Check if artifact is recognized
            // For life-bound items, they are always recognized. For others, check recognizedItems list.
            const isLifeBound = item.isLifeBound === true;
            const isRecognized = isLifeBound || (this.recognizedItems && this.recognizedItems.includes(itemId)) || item.isRecognized !== false;
            
            const mult = isRecognized ? 1.0 : 0.3; // 70% penalty if not recognized

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
                if (this.inventory.items.length >= this.inventory.maxSlots) return false;
                this.inventory.addItem(this.equipment[slot], 1);
            }
            this.equipment[slot] = itemId;
            this.inventory.removeItem(itemId, 1);
            this.calculateStats();
            return true;
        }
        return false;
    }

    getEquipSlotForItemType(itemType) {
        const legacyMap = {
            weapon: 'attackArtifact',
            armor: 'defenseArtifact',
            treasure: 'supportArtifact',
            accessory: 'soulArtifact'
        };
        return legacyMap[itemType] || itemType;
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
            if (this.inventory.items.length >= this.inventory.maxSlots) return false;
            const itemId = this.equipment[slot];
            if (this.inventory.addItem(itemId, 1)) {
                this.equipment[slot] = null;
                this.calculateStats();
                return true;
            }
        }
        return false;
    }



    load(data) {
        if (!data) return;
        this.name = data.name || "Phàm Nhân";
        this.realmId = data.realmId || 1;
        this.tuVi = data.tuVi || 0;
        
        // Migration for old numeric lingShi
        if (typeof data.lingShi === 'number' && data.lingShi > 0) {
            // We'll handle this after inventory is loaded
            this._legacyLingShi = data.lingShi;
        }

        this.bodyRealmId = data.bodyRealmId || 1;
        this.bodyExp = data.bodyExp || 0;
        this.soulRealmId = data.soulRealmId || 1;
        this.soulExp = data.soulExp || 0;
        this.baseStats = data.baseStats || { atk: 10, def: 5, spd: 10, maxHp: 100, maxMana: 50, stamina: 100 };
        this.bonusStats = data.bonusStats || { atk: 0, def: 0, spd: 0, maxHp: 0, maxMana: 0, tuViSpeed: 1, bodyExpSpeed: 1, soulExpSpeed: 1 };
        this.cultivationFocus = data.cultivationFocus || 'tuvi';

        this.hp = data.hp || 100;
        this.mana = data.mana || 50;
        this.stamina = data.stamina || 100;
        const defaultEquipment = { head: null, necklace: null, weapon: null, armor: null, accessory: null, artifact: null, treasure: null, shoes: null };
        this.equipment = { ...defaultEquipment, ...(data.equipment || {}) };
        this.sectId = data.sectId || null;
        this.sectContribution = data.sectContribution || 0;
        
        if (data.inventory) {
            this.inventory.load(data.inventory);
        }

        this.spiritualRoot = data.spiritualRoot || null;
        this.physique = data.physique || null;
        this.origin = data.origin || null;
        this.luck = data.luck || 50;
        this.talents = data.talents || [];
        this.knownNPCs = data.knownNPCs || {};
        this.karma = data.karma || 0;
        this.party = data.party || [];

        this.alchemyLevel = data.alchemyLevel || 1;
        this.alchemyExp = data.alchemyExp || 0;
        this.currentCauldron = data.currentCauldron || 'pham_lu';
        this.currentFlame = data.currentFlame || 'linh_hoa';
        this.danPoison = data.danPoison || 0;
        this.knownRecipes = data.knownRecipes || ['ngung_khi_dan'];
        this.ownedFlames = data.ownedFlames || ['linh_hoa'];
        this.ownedCauldrons = data.ownedCauldrons || ['pham_lu'];
        this.alchemyReputation = data.alchemyReputation || 0;
        this.currentAlchemyRoom = data.currentAlchemyRoom || null;
        if (data.gardenPlots) {
            this.gardenPlots = data.gardenPlots.map(p => {
                if (p === null) return { grade: 'PHAM', attribute: 'NORMAL', seedId: null, age: 0, status: 'empty' };
                return p;
            });
        } else {
            this.gardenPlots = [
                { grade: 'PHAM', attribute: 'NORMAL', seedId: null, age: 0, status: 'empty' },
                { grade: 'PHAM', attribute: 'NORMAL', seedId: null, age: 0, status: 'empty' },
                { grade: 'PHAM', attribute: 'NORMAL', seedId: null, age: 0, status: 'empty' }
            ];
        }
        this.mountainSurvival = data.mountainSurvival || { oxygen: 100, toxicity: 0 };
        this.age = data.age || 18;
        this.maxAge = data.maxAge || 100;

        this.currentLocId = data.currentLocId || null;
        
        this.beastLevel = data.beastLevel || 1;
        this.beastExp = data.beastExp || 0;
        this.beasts = data.beasts || [];
        this.corpseLevel = data.corpseLevel || 1;
        this.corpseExp = data.corpseExp || 0;
        this.puppetLevel = data.puppetLevel || 1;
        this.puppetExp = data.puppetExp || 0;
        this.knownPuppetRecipes = data.knownPuppetRecipes || ['thiet_giap_khoi_loi'];
        this.refinedCorpses = data.refinedCorpses || [];

        this.formationLevel = data.formationLevel || 1;
        this.formationExp = data.formationExp || 0;

        this.smithingLevel = data.smithingLevel || 1;
        this.smithingExp = data.smithingExp || 0;
        this.smithingTool = data.smithingTool || null;
        this.knownSmithingRecipes = data.knownSmithingRecipes || [];
        this.ownedSmithingTools = data.ownedSmithingTools || [];

        this.currentTalismanPen = data.currentTalismanPen || 'truc_phu_but';
        this.knownTalismanRecipes = data.knownTalismanRecipes || ['hoa_cau_phu'];
        this.ownedTalismanPens = data.ownedTalismanPens || ['truc_phu_but'];
        
        this.mainTechniqueId = data.mainTechniqueId || null;
        this.mainBodyTechniqueId = data.mainBodyTechniqueId || null;
        this.mainSoulTechniqueId = data.mainSoulTechniqueId || null;
        this.learnedTechniques = data.learnedTechniques || [];
        this.learnedSecretTechniques = data.learnedSecretTechniques || [];
        this.equippedSecretTechniqueIds = data.equippedSecretTechniqueIds || [];
        this.secretTechniqueCooldowns = data.secretTechniqueCooldowns || {};
        this.techniquePoints = data.techniquePoints || 0;

        // Energy (Qi) System
        this.qiAccumulated = data.qiAccumulated || {};
        this.currentEnvironmentalQi = data.currentEnvironmentalQi || null;
        
        this.spiritStoneSettings = data.spiritStoneSettings || {
            autoUsePriority: ['HA', 'TRUNG', 'THUONG'],
            lockCucPham: true,
            minReserve: 0
        };

        this.buffs = data.buffs || [];
        this.unlockedProfessions = Array.isArray(data.unlockedProfessions) ? data.unlockedProfessions : [];
        this.insectLevel = data.insectLevel || 1;
        this.insectExp = data.insectExp || 0;
        
        this.calculateStats();
    }

    save() {
        return {
            name: this.name,
            realmId: this.realmId,
            tuVi: this.tuVi,
            lingShi: this.lingShi,
            bodyRealmId: this.bodyRealmId,
            bodyExp: this.bodyExp,
            soulRealmId: this.soulRealmId,
            soulExp: this.soulExp,
            cultivationFocus: this.cultivationFocus,
            hp: this.hp,
            mana: this.mana,
            stamina: this.stamina,
            equipment: this.equipment,
            inventory: this.inventory.save(),
            sectId: this.sectId,
            sectContribution: this.sectContribution,
            spiritualRoot: this.spiritualRoot,
            physique: this.physique,
            origin: this.origin,
            luck: this.luck,
            talents: this.talents,
            destinyRating: this.destinyRating,
            knownNPCs: this.knownNPCs,
            buffs: this.buffs,
            karma: this.karma,
            party: this.party,
            alchemyLevel: this.alchemyLevel,
            alchemyExp: this.alchemyExp,
            currentCauldron: this.currentCauldron,
            currentFlame: this.currentFlame,
            danPoison: this.danPoison,
            knownRecipes: this.knownRecipes,
            ownedFlames: this.ownedFlames,
            ownedCauldrons: this.ownedCauldrons,
            baseStats: this.baseStats,
            bonusStats: this.bonusStats,
            unlockedProfessions: this.unlockedProfessions,
            alchemyReputation: this.alchemyReputation,
            currentAlchemyRoom: this.currentAlchemyRoom,
            gardenPlots: this.gardenPlots,
            mountainSurvival: this.mountainSurvival,
            age: this.age,
            maxAge: this.maxAge,
            currentWorldId: this.currentWorldId,
            currentLocId: this.currentLocId,
            beastLevel: this.beastLevel,
            beastExp: this.beastExp,
            beasts: this.beasts,
            hatchingBeasts: this.hatchingBeasts,
            corpseLevel: this.corpseLevel,
            corpseExp: this.corpseExp,
            puppetLevel: this.puppetLevel,
            puppetExp: this.puppetExp,
            knownPuppetRecipes: this.knownPuppetRecipes,
            refinedCorpses: this.refinedCorpses,
            formationLevel: this.formationLevel,
            formationExp: this.formationExp,
            smithingLevel: this.smithingLevel,
            smithingExp: this.smithingExp,
            smithingTool: this.smithingTool,
            knownSmithingRecipes: this.knownSmithingRecipes,
            ownedSmithingTools: this.ownedSmithingTools,
            currentTalismanPen: this.currentTalismanPen,
            knownTalismanRecipes: this.knownTalismanRecipes,
            ownedTalismanPens: this.ownedTalismanPens,
            mainTechniqueId: this.mainTechniqueId,
            mainBodyTechniqueId: this.mainBodyTechniqueId,
            mainSoulTechniqueId: this.mainSoulTechniqueId,
            learnedTechniques: this.learnedTechniques,
            learnedSecretTechniques: this.learnedSecretTechniques,
            equippedSecretTechniqueIds: this.equippedSecretTechniqueIds,
            secretTechniqueCooldowns: this.secretTechniqueCooldowns,
            techniquePoints: this.techniquePoints,
            qiAccumulated: this.qiAccumulated,
            currentEnvironmentalQi: this.currentEnvironmentalQi,
            spiritStoneSettings: this.spiritStoneSettings,
            insectLevel: this.insectLevel,
            insectExp: this.insectExp,
            npcData: (typeof state !== 'undefined' && state.systems.npc) ? state.systems.npc.saveData() : null,
            socialData: (typeof state !== 'undefined' && state.systems.social) ? state.systems.social.getData() : null
        };
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

    removeFromParty(npcId) {
        const index = this.party.findIndex(npc => npc.id === npcId);
        if (index > -1) {
            this.party.splice(index, 1);
            return true;
        }
        return false;
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
}
