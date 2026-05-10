import { NPC_TEMPLATES } from '../data/npcs.js';

export class NPC {
    constructor(templateId, realmId) {
        const template = NPC_TEMPLATES[templateId];
        this.id = Math.random().toString(36).substr(2, 9);
        this.type = template.type;
        this.role = template.roles[Math.floor(Math.random() * template.roles.length)]; // Sword, Mage, Healer, Tank
        this.title = template.title;
        this.name = this.generateName();
        this.portrait = template.portrait;
        this.personality = template.personalities[Math.floor(Math.random() * template.personalities.length)];
        this.realmId = realmId;
        this.tuVi = 0;
        this.relationship = 0; // -100 to 100
        this.dialogues = template.dialogues;
        this.mood = 'Bình thường';
        this.goal = 'Trường sinh';
        
        // Story tracking
        this.storyArcId = template.storyArcs ? template.storyArcs[Math.floor(Math.random() * template.storyArcs.length)] : null;
        this.storyStep = this.storyArcId ? 1 : 0;
        
        this.calculateStats();
    }

    calculateStats() {
        const realmMultiplier = Math.pow(1.5, this.realmId - 1);
        this.maxHp = 100 * realmMultiplier;
        this.hp = this.maxHp;
        this.atk = 10 * realmMultiplier;
        this.def = 5 * realmMultiplier;
        
        // Role adjustments
        if (this.role === 'Tank') { this.maxHp *= 1.5; this.def *= 1.5; this.atk *= 0.7; }
        if (this.role === 'Healer') { this.maxHp *= 0.8; this.atk *= 0.5; }
        if (this.role === 'Sword') { this.atk *= 1.3; }
        this.hp = this.maxHp;
    }

    simulate(delta) {
        // NPCs cultivate over time
        const tuViGain = (this.realmId * 0.5) * delta;
        this.tuVi += tuViGain;
        
        // Chance to breakthrough
        if (this.tuVi > 1000 * Math.pow(2, this.realmId)) {
            this.realmId++;
            this.tuVi = 0;
            this.calculateStats();
            console.log(`NPC ${this.name} đột phá lên ${this.realmId}`);
        }
    }

    generateName() {
        const surnames = ['Thanh', 'Lâm', 'Diệp', 'Hàn', 'Trần', 'Lý', 'Vương'];
        const givenNames = ['Phong', 'Vân', 'Lôi', 'Lão Ma', 'Tiên Tử', 'Đạo Nhân'];
        return surnames[Math.floor(Math.random() * surnames.length)] + ' ' + givenNames[Math.floor(Math.random() * givenNames.length)];
    }

    getDialogue(key) {
        const list = this.dialogues[key] || this.dialogues['meet'];
        return list[Math.floor(Math.random() * list.length)];
    }

    getRelationshipStatus() {
        if (this.relationship >= 90) return 'Đạo lữ';
        if (this.relationship >= 70) return 'Tri kỷ';
        if (this.relationship >= 50) return 'Bằng hữu';
        if (this.relationship <= -50) return 'Kẻ thù';
        if (this.relationship <= -90) return 'Tử địch';
        return 'Người lạ';
    }
}

export class NPCSystem {
    static generate(playerRealmId) {
        const keys = Object.keys(NPC_TEMPLATES);
        const templateId = keys[Math.floor(Math.random() * keys.length)];
        const realmId = Math.max(1, playerRealmId + Math.floor(Math.random() * 5) - 2);
        return new NPC(templateId, realmId);
    }
}
