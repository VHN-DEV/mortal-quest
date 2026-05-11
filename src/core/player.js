import { getRealmById } from '../configs/realm-data.js';
import { Inventory } from './inventory.js';
import { getItemById } from '../configs/item-data.js';
import { getTechniqueById, getSecretTechniqueById, TECHNIQUE_LEVELS, TECHNIQUE_QUALITIES } from '../configs/technique-data.js';

export class Player {
    constructor() {
        this.name = "Phàm Nhân";
        this.realmId = 1;
        this.tuVi = 0;
        this.lingShi = 1000; // Base Hạ Phẩm
        this.totalSpent = 0;
        this.vipLevel = 0;
        this.lingShiGrades = { ha: 1000, trung: 0, thuong: 0, cuc: 0 };

        // Body & Soul systems
        this.bodyRealmId = 1;
        this.bodyExp = 0;
        this.soulRealmId = 1;
        this.soulExp = 0;
        this.cultivationFocus = 'tuvi'; // 'tuvi', 'body', 'soul'
        
        // Base Stats
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
        
        // Equipment slots
        this.equipment = {
            head: null,
            necklace: null,
            weapon: null,    // itemId
            armor: null,
            accessory: null,
            artifact: null,
            treasure: null,
            shoes: null
        };
        
        this.inventory = new Inventory(this);
        this.lastUpdate = Date.now();
        
        // Sect info
        this.sectId = null;
        this.sectContribution = 0;

        // Destiny properties
        this.spiritualRoot = null;
        this.physique = null;
        this.origin = null;
        this.luck = 50;
        this.talents = [];
        this.destinyRating = "Phàm mệnh";

        // NPC & Story systems
        this.party = []; // Array of NPC objects
        this.knownNPCs = {}; // Map of id -> NPC object
        this.karma = 0; // -1000 to 1000
        
        // Alchemy System
        this.alchemyLevel = 1;
        this.alchemyExp = 0;
        this.currentCauldron = 'pham_lu';
        this.currentFlame = 'linh_hoa';
        this.danPoison = 0;
        this.knownRecipes = ['ngung_khi_dan']; // Start with basic recipe
        this.ownedFlames = ['linh_hoa'];
        this.ownedCauldrons = ['pham_lu'];
        this.alchemyReputation = 0;
        this.currentAlchemyRoom = null;
        this.gardenPlots = [null, null, null]; // 3 initial plots
        this.mountainSurvival = { oxygen: 100, toxicity: 0 };

        // Talisman System
        this.talismanLevel = 1;
        this.talismanExp = 0;
        this.currentTalismanPen = 'truc_phu_but';
        this.knownTalismanRecipes = ['hoa_cau_phu'];
        this.ownedTalismanPens = ['truc_phu_but'];
        
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

        // Beast System
        this.beasts = [];
        this.hatchingBeasts = [];
        this.beastLevel = 1;
        this.beastExp = 0;

        // Corpse System
        this.corpseLevel = 1;
        this.corpseExp = 0;
        this.refinedCorpses = [];

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
    }

    getFormattedLingShi() {
        let total = this.lingShi;
        const cuc = Math.floor(total / 1000000);
        total %= 1000000;
        const thuong = Math.floor(total / 10000);
        total %= 10000;
        const trung = Math.floor(total / 100);
        const ha = total % 100;

        let res = [];
        if (cuc > 0) res.push(`${cuc} Cực`);
        if (thuong > 0) res.push(`${thuong} Thượng`);
        if (trung > 0) res.push(`${trung} Trung`);
        if (ha > 0 || res.length === 0) res.push(`${ha} Hạ`);
        
        return res.join(' ');
    }

    spendLingShi(amount) {
        if (this.lingShi >= amount) {
            this.lingShi -= amount;
            this.totalSpent += amount;
            this.updateVipLevel();
            return true;
        }
        return false;
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
        // The focused path gets full exp, while others get 20%
        const focus = this.cultivationFocus || 'tuvi';
        
        // Check if has technique for the focused path to gain exp
        const hasTech = (focus === 'tuvi' && this.mainTechniqueId) || 
                        (focus === 'body' && this.mainBodyTechniqueId) || 
                        (focus === 'soul' && this.mainSoulTechniqueId);

        if (hasTech) {
            const tuViGain = this.tuViPerSecond * (focus === 'tuvi' ? 1.0 : 0.2) * multiplier * delta;
            const bodyGain = this.bodyExpPerSecond * (focus === 'body' ? 1.0 : 0.2) * multiplier * delta;
            const soulGain = this.soulExpPerSecond * (focus === 'soul' ? 1.0 : 0.2) * multiplier * delta;

            this.tuVi += tuViGain;
            this.bodyExp += bodyGain;
            this.soulExp += soulGain;
        }
        
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

        if (this.stamina >= 1) {
            this.stamina -= 1;
            
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
            return { success: true };
        }
        return { success: false, reason: "Kiệt sức rồi, hãy nghỉ ngơi một chút!" };
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
        // Base stats from realm
        const realmLevel = this.realmId;
        const bodyLevel = this.bodyRealmId;
        const soulLevel = this.soulRealmId;

        // Base rates are 0. MUST have technique to cultivate.
        this.tuViPerSecond = 0;
        this.bodyExpPerSecond = 0;
        this.soulExpPerSecond = 0;

        // TU VI level increases ALL base stats significantly
        const realmMult = Math.pow(1.8, realmLevel - 1);
        
        this.maxMana = 50 * realmMult;
        this.maxHp = 100 * realmMult;
        this.atk = 10 * realmMult;
        this.def = 5 * realmMult;
        this.spd = 15 + (realmLevel * 5);

        // Body Realm adds to HP and Def
        this.maxHp += 50 * (bodyLevel - 1) * Math.sqrt(realmLevel);
        this.def += 10 * (bodyLevel - 1) * Math.sqrt(realmLevel);
        
        // Soul Realm adds to Mana and Spd
        this.maxMana += 30 * (soulLevel - 1) * Math.sqrt(realmLevel);
        this.spd += 5 * (soulLevel - 1);

        // Apply Destiny Bonuses
        if (this.destinyStats) {
            if (this.destinyStats.atk) this.atk += this.destinyStats.atk;
            if (this.destinyStats.def) this.def += this.destinyStats.def;
            if (this.destinyStats.maxHp) this.maxHp += this.destinyStats.maxHp;
        }

        // Process Techniques for each path
        this.applyTechniqueToStats('tuvi', this.mainTechniqueId);
        this.applyTechniqueToStats('body', this.mainBodyTechniqueId);
        this.applyTechniqueToStats('soul', this.mainSoulTechniqueId);

        // Add Sect bonuses
        if (this.sectId) {
            this.atk *= 1.1;
            this.def *= 1.1;
            this.maxHp *= 1.1;
            this.tuViPerSecond *= 1.05;
        }

        // Add Active Formations Bonus
        this.activeFormations.forEach(f => {
            if (f.id === 'tu_linh_tran') this.tuViPerSecond *= 1.2;
        });
        
        // Add Energy (Qi) System Bonuses
        if (typeof energySystem !== 'undefined' && energySystem) {
            const energyBonuses = energySystem.getStatBonuses();
            this.atk += energyBonuses.atk || 0;
            this.def += energyBonuses.def || 0;
            this.maxHp += energyBonuses.hp || 0;
            this.maxMana += energyBonuses.mana || 0;
            this.spd += energyBonuses.spd || 0;
            // Soul/Thần thức bonus logic would go here if soul is tracked separately
        }
        
        // Ensure current HP/Mana don't exceed max
        this.hp = Math.min(this.hp, this.maxHp);
        this.mana = Math.min(this.mana, this.maxMana);
    }

    applyTechniqueToStats(path, techId) {
        if (!techId) return;
        const techData = getTechniqueById(techId);
        const playerTech = this.learnedTechniques.find(t => t.id === techId);
        if (!techData || !playerTech) return;

        const stageMult = 1 + (playerTech.stage - 1) * 0.2;
        const qualityLevel = TECHNIQUE_LEVELS[techData.quality];
        const qualityMult = qualityLevel ? qualityLevel.multiplier : 1.0;
        
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

        const finalMult = stageMult * qualityMult * attributeMult;

        // Apply path-specific cultivation rate
        if (path === 'tuvi' && techData.effects.tvps) {
            this.tuViPerSecond = techData.effects.tvps * finalMult;
        } else if (path === 'body' && techData.effects.bodyPs) {
            this.bodyExpPerSecond = techData.effects.bodyPs * finalMult;
        } else if (path === 'soul' && techData.effects.soulPs) {
            this.soulExpPerSecond = techData.effects.soulPs * finalMult;
        }
        
        // Apply stat bonuses from technique
        if (techData.stats) {
            if (techData.stats.atk) this.atk += techData.stats.atk * finalMult;
            if (techData.stats.def) this.def += techData.stats.def * finalMult;
            if (techData.stats.hp) this.maxHp += techData.stats.hp * finalMult;
            if (techData.stats.mana) this.maxMana += techData.stats.mana * finalMult;
            if (techData.stats.spd) this.spd += techData.stats.spd * finalMult;
        }
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

        const slot = item.type; // weapon, armor, accessory, treasure
        if (this.equipment.hasOwnProperty(slot)) {
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

    addAlchemyExp(amount) {
        this.alchemyExp += amount;
        const nextLevelExp = this.alchemyLevel * 100 * Math.pow(1.5, this.alchemyLevel - 1);
        if (this.alchemyExp >= nextLevelExp) {
            this.alchemyExp -= nextLevelExp;
            this.alchemyLevel++;
            return true;
        }
        return false;
    }

    load(data) {
        if (!data) return;
        this.name = data.name || "Phàm Nhân";
        this.realmId = data.realmId || 1;
        this.tuVi = data.tuVi || 0;
        this.lingShi = data.lingShi || 0;

        this.bodyRealmId = data.bodyRealmId || 1;
        this.bodyExp = data.bodyExp || 0;
        this.soulRealmId = data.soulRealmId || 1;
        this.soulExp = data.soulExp || 0;
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
        this.gardenPlots = data.gardenPlots || [null, null, null];
        this.mountainSurvival = data.mountainSurvival || { oxygen: 100, toxicity: 0 };
        this.age = data.age || 18;
        this.maxAge = data.maxAge || 100;

        this.currentLocId = data.currentLocId || null;
        
        this.beastLevel = data.beastLevel || 1;
        this.beastExp = data.beastExp || 0;
        this.beasts = data.beasts || [];
        this.hatchingBeasts = data.hatchingBeasts || [];

        this.corpseLevel = data.corpseLevel || 1;
        this.corpseExp = data.corpseExp || 0;
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
        this.learnedTechniques = data.learnedTechniques || [];
        this.equippedSecretTechniqueIds = data.equippedSecretTechniqueIds || [];
        this.secretTechniqueCooldowns = data.secretTechniqueCooldowns || {};
        this.techniquePoints = data.techniquePoints || 0;

        // Energy (Qi) System
        this.qiAccumulated = data.qiAccumulated || {};
        this.currentEnvironmentalQi = data.currentEnvironmentalQi || null;

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
            learnedTechniques: this.learnedTechniques,
            equippedSecretTechniqueIds: this.equippedSecretTechniqueIds,
            secretTechniqueCooldowns: this.secretTechniqueCooldowns,
            techniquePoints: this.techniquePoints,
            qiAccumulated: this.qiAccumulated,
            currentEnvironmentalQi: this.currentEnvironmentalQi
        };
    }

    addAlchemyExp(amount) {
        this.alchemyExp += amount;
        const nextLevel = Math.floor(Math.sqrt(this.alchemyExp / 100)) + 1;
        if (nextLevel > this.alchemyLevel) {
            this.alchemyLevel = nextLevel;
            return true;
        }
        return false;
    }

    addTalismanExp(amount) {
        this.talismanExp += amount;
        const nextLevel = Math.floor(Math.sqrt(this.talismanExp / 100)) + 1;
        if (nextLevel > this.talismanLevel) {
            this.talismanLevel = nextLevel;
            return true;
        }
        return false;
    }

    addSmithingExp(amount) {
        this.smithingExp += amount;
        const nextLevel = Math.floor(Math.sqrt(this.smithingExp / 1000)) + 1; // Smithing is harder
        if (nextLevel > this.smithingLevel) {
            this.smithingLevel = nextLevel;
            return true;
        }
        return false;
    }

    addBeastExp(amount) {
        this.beastExp += amount;
        const nextLevel = Math.floor(Math.sqrt(this.beastExp / 100)) + 1;
        if (nextLevel > this.beastLevel) {
            this.beastLevel = nextLevel;
            return true;
        }
        return false;
    }

    addCorpseExp(amount) {
        this.corpseExp += amount;
        const nextLevel = Math.floor(Math.sqrt(this.corpseExp / 100)) + 1;
        if (nextLevel > this.corpseLevel) {
            this.corpseLevel = nextLevel;
            return true;
        }
        return false;
    }

    addFormationExp(amount) {
        this.formationExp += amount;
        const nextLevel = Math.floor(Math.sqrt(this.formationExp / 100)) + 1;
        if (nextLevel > this.formationLevel) {
            this.formationLevel = nextLevel;
            return true;
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
        if (this.learnedSecretTechniqueIds.includes(secretId)) return false;
        const secretData = getSecretTechniqueById(secretId);
        if (!secretData) return false;

        this.learnedSecretTechniqueIds.push(secretId);
        
        // Auto-equip if slot available
        if (this.equippedSecretTechniqueIds.length < 3) {
            this.equippedSecretTechniqueIds.push(secretId);
        }
        return true;
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
}
