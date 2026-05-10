import { getRealmById } from '../data/realms.js';
import { Inventory } from './inventory.js';
import { getItemById } from '../data/items.js';

export class Player {
    constructor() {
        this.name = "Phàm Nhân";
        this.realmId = 1;
        this.tuVi = 0;
        this.lingShi = 100;
        
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
        
        // Equipment slots
        this.equipment = {
            weapon: null,    // itemId
            armor: null,
            accessory: null,
            treasure: null
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
    }

    getCurrentRealm() {
        return getRealmById(this.realmId);
    }

    update() {
        const now = Date.now();
        const delta = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;

        // Auto cultivation
        this.tuVi += this.tuViPerSecond * delta;
        
        // Regen
        this.stamina = Math.min(this.maxStamina, this.stamina + 0.1 * delta);
        this.mana = Math.min(this.maxMana, this.mana + 0.05 * delta);
        this.hp = Math.min(this.maxHp, this.hp + 0.02 * delta);
    }

    cultivate() {
        if (this.stamina >= 1) {
            this.stamina -= 1;
            this.tuVi += this.tuViPerSecond * 2;
            return true;
        }
        return false;
    }

    canBreakthrough() {
        const realm = this.getCurrentRealm();
        return this.tuVi >= realm.expRequired;
    }

    breakthrough() {
        if (this.canBreakthrough()) {
            this.realmId++;
            this.calculateStats();
            return true;
        }
        return false;
    }

    calculateStats() {
        // Base stats from realm
        const realmLevel = this.realmId;
        this.maxHp = 100 * Math.pow(1.5, realmLevel - 1);
        this.atk = 10 * Math.pow(1.4, realmLevel - 1);
        this.def = 5 * Math.pow(1.3, realmLevel - 1);
        this.spd = 10 + (realmLevel * 2);
        this.tuViPerSecond = 1 * Math.pow(1.2, realmLevel - 1);

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

        // Ensure current HP/Mana don't exceed max
        this.hp = Math.min(this.hp, this.maxHp);
        this.mana = Math.min(this.mana, this.maxMana);
    }

    equip(itemId) {
        const item = getItemById(itemId);
        if (!item || !item.type) return false;

        const slot = item.type; // weapon, armor, accessory, treasure
        if (this.equipment.hasOwnProperty(slot)) {
            // If slot is occupied, we need 1 slot to swap (the new item is already removed from inv, but old goes back)
            // Wait, the new item is removed AFTER checking if it's equippable.
            
            // Unequip current item if any
            if (this.equipment[slot]) {
                // If inventory is full, we can't unequip
                if (this.inventory.items.length >= this.inventory.maxSlots) {
                    return false; // No space to swap
                }
                this.inventory.addItem(this.equipment[slot], 1);
            }
            
            // Equip new item
            this.equipment[slot] = itemId;
            this.inventory.removeItem(itemId, 1);
            this.calculateStats();
            return true;
        }
        return false;
    }

    unequip(slot) {
        if (this.equipment[slot]) {
            // Check inventory space
            if (this.inventory.items.length >= this.inventory.maxSlots) {
                return false; 
            }
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
        this.hp = data.hp || 100;
        this.mana = data.mana || 50;
        this.stamina = data.stamina || 100;
        this.equipment = data.equipment || { weapon: null, armor: null, accessory: null, treasure: null };
        this.sectId = data.sectId || null;
        this.sectContribution = data.sectContribution || 0;
        
        if (data.inventory) {
            this.inventory.load(data.inventory);
        }

        // Load Destiny
        this.spiritualRoot = data.spiritualRoot || null;
        this.physique = data.physique || null;
        this.origin = data.origin || null;
        this.luck = data.luck || 50;
        this.talents = data.talents || [];
        // Load NPC systems
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

        this.calculateStats();
    }

    save() {
        return {
            name: this.name,
            realmId: this.realmId,
            tuVi: this.tuVi,
            lingShi: this.lingShi,
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
            mountainSurvival: this.mountainSurvival
        };
    }
}
