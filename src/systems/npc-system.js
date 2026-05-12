import { NPC_TEMPLATES, NPC_PERSONALITIES, NPC_GOALS, NPC_RELATIONSHIP_LEVELS, NPC_SPECIAL_RELATIONS } from '../configs/npc-data.js';
import { getRealmById } from '../configs/realm-data.js';
import { CREATION_ROOTS, CREATION_PHYSIQUES } from '../configs/creation-data.js';

export class NPC {
    constructor(templateId, realmId) {
        const template = NPC_TEMPLATES[templateId];
        this.id = Math.random().toString(36).substr(2, 9);
        this.type = template.type;
        this.role = template.roles[Math.floor(Math.random() * template.roles.length)];
        this.title = template.title;
        this.name = this.generateName();
        this.gender = Math.random() > 0.5 ? 'Nam' : 'Nữ';
        this.age = 18 + Math.floor(Math.random() * 100);
        this.portrait = template.portrait;
        
        // Character Traits
        this.personalityIds = template.personalities;
        this.goalId = Object.keys(NPC_GOALS)[Math.floor(Math.random() * Object.keys(NPC_GOALS).length)];
        this.daoHeart = 50 + Math.floor(Math.random() * 50); // 0-100
        this.luck = Math.random() > 0.9 ? 150 : 50 + Math.floor(Math.random() * 50); // High luck for some
        
        // Cultivation Attributes
        this.realmId = realmId;
        this.tuVi = 0;
        this.rootId = this.generateRoot();
        this.physiqueId = this.generatePhysique();
        
        // Social
        this.relationship = 0; // -100 to 100
        this.specialRelation = null; // 'dao_lu', 'su_do', etc.
        this.memory = []; // List of interactions: { type: 'saved_life', time: 123 }
        this.mood = 'Bình thường';
        
        this.dialogues = template.dialogues;
        
        // Schedule & Location
        this.activity = 'Tu luyện';
        
        // NPC Inventory for trading
        this.inventory = []; 
        this.generateInitialInventory();

        this.calculateStats();
    }

    generateInitialInventory() {
        // Based on type, give some items
        if (this.type === 'thuong_nhan') {
            this.inventory.push({ id: 'ngung_khi_dan', quantity: 5 + Math.floor(Math.random() * 10), price: 150 });
            this.inventory.push({ id: 'truc_co_dan', quantity: 1 + Math.floor(Math.random() * 3), price: 2500 });
            this.inventory.push({ id: 'linh_thach_trung', quantity: 10, price: 100 });
        } else if (this.type === 'tan_tu') {
            this.inventory.push({ id: 'ngung_khi_dan', quantity: 2, price: 200 });
            this.inventory.push({ id: 'thiet_giap_phu', quantity: 1, price: 500 });
        }
        // Add more logic for other types
    }

    generateRoot() {
        const roots = Object.keys(CREATION_ROOTS);
        // Weights: normal roots are more common
        const weights = [5, 10, 20, 30, 20, 15]; // Match CREATION_ROOTS order roughly
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        for (let i = 0; i < roots.length; i++) {
            if (random < weights[i]) return roots[i];
            random -= weights[i];
        }
        return 'tam_linh_can';
    }

    generatePhysique() {
        const physiques = Object.keys(CREATION_PHYSIQUES);
        if (Math.random() > 0.95) {
            return physiques[Math.floor(Math.random() * (physiques.length - 1))];
        }
        return 'bin_thuong';
    }

    calculateStats() {
        const realmMultiplier = Math.pow(1.6, this.realmId - 1);
        
        this.maxHp = 150 * realmMultiplier;
        this.atk = 15 * realmMultiplier;
        this.def = 8 * realmMultiplier;
        this.spd = 10 * realmMultiplier;
        
        // Role adjustments
        if (this.role === 'Tank') { this.maxHp *= 1.6; this.def *= 1.5; this.atk *= 0.8; }
        if (this.role === 'Healer') { this.maxHp *= 0.9; this.atk *= 0.6; this.spd *= 1.1; }
        if (this.role === 'Sword') { this.atk *= 1.4; this.spd *= 1.2; }
        
        this.hp = this.maxHp;
    }

    simulate(delta, worldTime) {
        // 1. Cultivation
        const rootMultiplier = CREATION_ROOTS[this.rootId]?.bonus?.tvps || 1;
        const physiqueMultiplier = this.physiqueId !== 'bin_thuong' ? 1.5 : 1.0;
        const moodMultiplier = this.mood === 'Vui vẻ' ? 1.2 : (this.mood === 'U sầu' ? 0.8 : 1.0);
        
        const tuViGain = (this.realmId * 0.8) * rootMultiplier * physiqueMultiplier * moodMultiplier * delta;
        this.tuVi += tuViGain;
        
        // Breakthrough
        const currentRealm = getRealmById(this.realmId);
        if (currentRealm && this.tuVi >= currentRealm.expRequired) {
            this.realmId++;
            this.tuVi = 0;
            this.calculateStats();
            this.mood = 'Vui vẻ';
            console.log(`NPC ${this.name} đã đột phá lên ${getRealmById(this.realmId).name}`);
        }

        // 2. Activity / Schedule
        const totalMinutes = worldTime;
        const hour = Math.floor((totalMinutes / 60) % 24);
        
        if (hour >= 6 && hour < 18) {
            this.activity = Math.random() > 0.7 ? 'Giao dịch' : 'Tu luyện';
        } else {
            this.activity = Math.random() > 0.8 ? 'Thăm dò bí cảnh' : 'Bế quan';
        }

        // 3. Natural aging (simplified: 1 year per 1000 delta)
        if (Math.random() < 0.001 * delta) {
            this.age++;
        }
    }

    generateName() {
        const surnames = ['Thanh', 'Lâm', 'Diệp', 'Hàn', 'Trần', 'Lý', 'Vương', 'Tiêu', 'Mộ Dung', 'Âu Dương'];
        const givenNames = ['Phong', 'Vân', 'Lôi', 'Lão Ma', 'Tiên Tử', 'Đạo Nhân', 'Minh', 'Nguyệt', 'Thiên', 'Kiếm'];
        return surnames[Math.floor(Math.random() * surnames.length)] + ' ' + givenNames[Math.floor(Math.random() * givenNames.length)];
    }

    addMemory(type) {
        this.memory.push({ type, time: Date.now() });
        // Max 10 memories
        if (this.memory.length > 10) this.memory.shift();
        
        // Impact favorability
        if (type === 'saved_life') this.changeRelationship(30);
        if (type === 'gift_low') this.changeRelationship(5);
        if (type === 'gift_high') this.changeRelationship(20);
        if (type === 'betrayed') this.changeRelationship(-50);
        if (type === 'stole_treasure') this.changeRelationship(-30);
        if (type === 'attacked') this.changeRelationship(-20);
        if (type === 'become_dao_lu') this.changeRelationship(50);
        if (type === 'become_disciple') this.changeRelationship(30);
    }

    changeRelationship(amount) {
        this.relationship = Math.max(-100, Math.min(100, this.relationship + amount));
    }

    generateDialogue(player) {
        // AI Logic: Check memory first
        if (this.memory.some(m => m.type === 'saved_life')) {
            return "Đa tạ đạo hữu đã cứu mạng, ân tình này tại hạ khắc cốt ghi tâm.";
        }
        
        if (this.relationship >= 50) return "Gặp lại đạo hữu thật là có duyên, không biết hôm nay có nhã hứng đàm đạo không?";
        if (this.relationship <= -50) return "Cút ngay! Ta không có gì để nói với hạng người như ngươi.";
        
        return "Chào đạo hữu, con đường tu tiên vốn dĩ cô độc, gặp được nhau cũng là một cái duyên.";
    }

    getRelationshipStatus() {
        if (this.specialRelation) {
            return NPC_SPECIAL_RELATIONS[this.specialRelation].name;
        }
        for (const level of NPC_RELATIONSHIP_LEVELS) {
            if (this.relationship >= level.min && this.relationship <= level.max) {
                return level.name;
            }
        }
        return 'Xa lạ';
    }
}

export class NPCSystem {
    constructor() {
        this.npcs = [];
    }

    generate(templateId, realmId, locationId) {
        const npc = new NPC(templateId, realmId);
        npc.location = locationId;
        this.npcs.push(npc);
        return npc;
    }

    update(delta, worldTime) {
        this.npcs.forEach(npc => {
            npc.simulate(delta, worldTime);
        });
    }

    saveData() {
        return this.npcs.map(npc => ({ ...npc }));
    }

    loadData(data) {
        if (!data) return;
        this.npcs = data.map(npcData => {
            const npc = new NPC(npcData.type, npcData.realmId);
            Object.assign(npc, npcData);
            return npc;
        });
    }
}
