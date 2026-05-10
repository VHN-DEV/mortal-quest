import { NPC_TEMPLATES } from '../data/npcs.js';

export class NPC {
    constructor(templateId, realmId) {
        const template = NPC_TEMPLATES[templateId];
        this.type = template.type;
        this.title = template.title;
        this.name = this.generateName();
        this.portrait = template.portrait;
        this.personality = template.personalities[Math.floor(Math.random() * template.personalities.length)];
        this.realmId = realmId;
        this.relationship = 0; // -100 to 100
        this.dialogues = template.dialogues;
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
        if (this.relationship >= 50) return 'Bạn bè';
        if (this.relationship <= -50) return 'Kẻ thù';
        return 'Trung lập';
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
