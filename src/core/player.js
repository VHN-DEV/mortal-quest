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
        
        this.tuViPerSecond = 1;
        this.bodyExpPerSecond = 0.2;
        this.soulExpPerSecond = 0.2;
        
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
        this.knownRecipes = ['ngung_khi_dan'];
        this.alchemyReputation = 0;
        this.currentAlchemyRoom = null;
        this.gardenPlots = [null, null, null]; // 3 initial plots
        this.mountainSurvival = { oxygen: 100, toxicity: 0 };

        // Talisman System
        this.talismanLevel = 1;
        this.talismanExp = 0;
        this.currentTalismanPen = 'truc_phu_but';
        this.knownTalismanRecipes = ['hoa_cau_phu'];
        
        // Alchemy Expanded
        this.currentCauldron = 'pham_lu';
        this.currentFlame = 'linh_hoa';
        this.knownAlchemyTechniques = {};
        this.alchemyExp = 0;
        this.alchemyLevel = 1;

        // Smithing System
        this.smithingLevel = 1;
        this.smithingExp = 0;
        this.smithingTool = null;
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
        
        const tuViGain = this.tuViPerSecond * (focus === 'tuvi' ? 1.0 : 0.2) * multiplier * delta;
        const bodyGain = this.bodyExpPerSecond * (focus === 'body' ? 1.0 : 0.2) * multiplier * delta;
        const soulGain = this.soulExpPerSecond * (focus === 'soul' ? 1.0 : 0.2) * multiplier * delta;

        this.tuVi += tuViGain;
        this.bodyExp += bodyGain;
        this.soulExp += soulGain;
        
        // Regen
        this.stamina = Math.min(this.maxStamina, this.stamina + 0.1 * delta);
        this.mana = Math.min(this.maxMana, this.mana + 0.05 * delta);
        // Base regen is 0.2% per second, increased to 1% for better experience
        this.hp = Math.min(this.maxHp, this.hp + 0.01 * this.maxHp * delta);
    }

    cultivate(efficiency = 1.0) {
        if (this.stamina >= 1) {
            this.stamina -= 1;
            const focus = this.cultivationFocus || 'tuvi';
            
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
            return true;
        }
        return false;
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

        return { can: exp >= realm.expRequired, reason: exp < realm.expRequired ? "Chưa đủ tích lũy." : "" };
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

    breakthrough(type = 'tuvi') {
        const check = this.canBreakthrough(type);
        if (check.can) {
            // Check for Qi Deviation risk on Tu Vi breakthrough
            if (type === 'tuvi') {
                const stability = this.getStability();
                const roll = Math.random() * 100;
                if (roll > stability) {
                    // Qi Deviation!
                    this.hp *= 0.5;
                    this.tuVi *= 0.8;
                    return { success: false, msg: "Tẩu hỏa nhập ma! Linh lực bạo tẩu làm tổn thương kinh mạch." };
                }
            }

            if (type === 'tuvi') this.realmId++;
            else if (type === 'body') this.bodyRealmId++;
            else if (type === 'soul') this.soulRealmId++;
            
            this.calculateStats();
            return { success: true, msg: "Đột phá thành công!" };
        }
        return { success: false, msg: check.reason || "Chưa đủ điều kiện đột phá." };
    }

    calculateStats() {
        // Base stats from realm
        const realmLevel = this.realmId;
        const bodyLevel = this.bodyRealmId;
        const soulLevel = this.soulRealmId;

        // Tu Vi primarily increases Mana and Base stats
        this.maxMana = 50 * Math.pow(1.6, realmLevel - 1);
        this.tuViPerSecond = 1 * Math.pow(1.2, realmLevel - 1);
        
        // Body Realm primarily increases HP and Def
        this.maxHp = 100 * Math.pow(1.5, realmLevel - 1) * Math.pow(1.3, bodyLevel - 1);
        this.def = 5 * Math.pow(1.3, realmLevel - 1) * Math.pow(1.4, bodyLevel - 1);
        this.atk = 10 * Math.pow(1.4, realmLevel - 1) * Math.pow(1.2, bodyLevel - 1);
        
        // Soul Realm increases Mana, Spd and provides utility bonuses
        this.maxMana += 20 * (soulLevel - 1);
        this.spd = 10 + (realmLevel * 2) + (soulLevel * 3);
        
        // Lifespan increases with realm
        const lifespans = [100, 200, 500, 1000, 2000, 5000, 10000, 50000, 100000, 1000000];
        this.maxAge = lifespans[realmLevel - 1] || 1000000;

        // Add equipment bonuses
        Object.values(this.equipment).forEach(itemId => {
            if (itemId) {
                const item = getItemById(itemId);
                if (item && item.stats) {
                    if (item.stats.atk) this.atk += item.stats.atk;
                    if (item.stats.def) this.def += item.stats.def;
                    if (item.stats.spd) this.spd += item.stats.spd;
                    if (item.stats.tvps) this.tuViPerSecond += item.stats.tvps;
                    if (item.stats.maxHp) this.maxHp += item.stats.maxHp;
                }
            }
        });

        // Add Spiritual Root Bonus
        if (this.spiritualRoot) {
            this.tuViPerSecond *= this.spiritualRoot.multiplier;
        }

        // Add Physique Bonus
        if (this.physique && this.physique.bonus) {
            const b = this.physique.bonus;
            if (b.maxHp) this.maxHp += b.maxHp;
            if (b.atk) this.atk += b.atk;
            if (b.def) this.def += b.def;
            if (b.spd) this.spd += b.spd;
            if (b.tvps) this.tuViPerSecond *= b.tvps;
            if (b.luck) this.luck += b.luck;
        }

        // Add Talent Bonuses
        this.talents.forEach(t => {
            if (t.bonus) {
                if (t.bonus.atk) this.atk += t.bonus.atk;
                if (t.bonus.spd) this.spd += t.bonus.spd;
                if (t.bonus.tvps) this.tuViPerSecond *= t.bonus.tvps;
                if (t.bonus.mana) this.maxMana += t.bonus.mana;
            }
        });

        // Add Sect Bonus
        if (this.sectId) {
            // Basic sect bonus: +10% to all main stats
            this.atk *= 1.1;
            this.def *= 1.1;
            this.maxHp *= 1.1;
            this.tuViPerSecond *= 1.05;
        }

        // Add Active Formations Bonus
        this.activeFormations.forEach(f => {
            // Formations are handled in mountain-system usually, but we add base buffs here
            if (f.id === 'tu_linh_tran') this.tuViPerSecond *= 1.2;
        });

        // Add Destiny Bonuses (if implemented via points/stats)
        if (this.destinyStats) {
            if (this.destinyStats.atk) this.atk += this.destinyStats.atk;
            if (this.destinyStats.def) this.def += this.destinyStats.def;
        }

        // Add Technique Bonuses
        if (this.mainTechniqueId) {
            const techData = getTechniqueById(this.mainTechniqueId);
            const playerTech = this.learnedTechniques.find(t => t.id === this.mainTechniqueId);
            
            if (techData && playerTech && techData.effects) {
                const stageMult = 1 + (playerTech.stage - 1) * 0.1;
                const qualityLevel = TECHNIQUE_LEVELS[techData.quality];
                const qualityMult = qualityLevel ? qualityLevel.multiplier : 1.0;
                
                const finalMult = stageMult * qualityMult;
                
                if (techData.effects.tvps) this.tuViPerSecond *= (1 + (techData.effects.tvps - 1) * finalMult);
                if (techData.effects.atk) this.atk += techData.effects.atk * finalMult;
                if (techData.effects.def) this.def += techData.effects.def * finalMult;
                if (techData.effects.maxHp) this.maxHp += techData.effects.maxHp * finalMult;
                if (techData.effects.mana) this.maxMana += techData.effects.mana * finalMult;
                if (techData.effects.spd) this.spd += techData.effects.spd * finalMult;
            }
        }

        // Ensure current HP/Mana don't exceed max
        this.hp = Math.min(this.hp, this.maxHp);
        this.mana = Math.min(this.mana, this.maxMana);
    }

    equip(itemId) {
        const item = getItemById(itemId);
        if (!item || !item.type) return false;

        // Specialized Profession Tools
        if (item.type === 'cauldron') {
            this.currentCauldron = itemId;
            this.inventory.removeItem(itemId, 1);
            return true;
        }
        if (item.type === 'talisman_pen') {
            this.currentTalismanPen = itemId;
            this.inventory.removeItem(itemId, 1);
            return true;
        }
        if (item.type === 'smithing_tool') {
            this.smithingTool = itemId;
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
        
        this.mainTechniqueId = data.mainTechniqueId || null;
        this.learnedTechniques = data.learnedTechniques || {};
        this.equippedSecretTechniqueIds = data.equippedSecretTechniqueIds || [];
        this.secretTechniqueCooldowns = data.secretTechniqueCooldowns || {};
        this.techniquePoints = data.techniquePoints || 0;

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
            mainTechniqueId: this.mainTechniqueId,
            learnedTechniques: this.learnedTechniques,
            equippedSecretTechniqueIds: this.equippedSecretTechniqueIds,
            secretTechniqueCooldowns: this.secretTechniqueCooldowns,
            techniquePoints: this.techniquePoints
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

        if (!this.mainTechniqueId) {
            this.mainTechniqueId = techId;
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
        const tech = this.learnedTechniques.find(t => t.id === techId);
        if (tech) {
            this.mainTechniqueId = techId;
            if (typeof this.calculateStats === 'function') this.calculateStats();
            return true;
        }
        return false;
    }
}
