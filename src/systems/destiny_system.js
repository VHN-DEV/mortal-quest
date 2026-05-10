import { ROOT_TYPES, ROOT_QUALITIES, PHYSIQUES, ORIGINS, TALENTS } from '../data/destiny.js';

export class DestinySystem {
    static generateDestiny() {
        const root = this.rollSpiritualRoot();
        const physique = this.rollPhysique();
        const origin = this.rollOrigin();
        const talents = this.rollTalents();
        const luck = Math.floor(Math.random() * 100);
        
        const destinyRating = this.evaluateDestiny(root, physique, luck, origin);
        
        return {
            spiritualRoot: root,
            physique: physique,
            origin: origin,
            talents: talents,
            luck: luck,
            destinyRating: destinyRating
        };
    }

    static rollSpiritualRoot() {
        const qualityKeys = Object.keys(ROOT_QUALITIES);
        const quality = qualityKeys[Math.floor(Math.random() * qualityKeys.length)];
        
        // Root Types: Single (10%), Double (30%), Triple (40%), Pentad (20%)
        const r = Math.random();
        let elementCount = 1;
        if (r < 0.1) elementCount = 1;
        else if (r < 0.4) elementCount = 2;
        else if (r < 0.8) elementCount = 3;
        else elementCount = 5;
        
        const allElements = [...ROOT_TYPES.BASIC];
        const elements = [];
        for (let i = 0; i < elementCount; i++) {
            const idx = Math.floor(Math.random() * allElements.length);
            elements.push(allElements.splice(idx, 1)[0]);
        }
        
        // Mutated chance (5%)
        let mutated = null;
        if (Math.random() < 0.05) {
            mutated = ROOT_TYPES.MUTATED[Math.floor(Math.random() * ROOT_TYPES.MUTATED.length)];
        }
        
        let typeName = "";
        if (mutated) typeName = `Biến dị ${mutated}`;
        else if (elementCount === 1) typeName = `Đơn linh căn (${elements[0]})`;
        else if (elementCount === 2) typeName = `Song linh căn`;
        else if (elementCount === 3) typeName = `Tam linh căn`;
        else typeName = `Ngũ hành tạp linh căn`;

        return {
            type: typeName,
            elements: elements,
            mutated: mutated,
            quality: quality,
            multiplier: ROOT_QUALITIES[quality].multiplier,
            color: ROOT_QUALITIES[quality].color
        };
    }

    static rollPhysique() {
        // 10% chance to have a special physique
        if (Math.random() < 0.1) {
            return PHYSIQUES[Math.floor(Math.random() * PHYSIQUES.length)];
        }
        return null;
    }

    static rollOrigin() {
        return ORIGINS[Math.floor(Math.random() * ORIGINS.length)];
    }

    static rollTalents() {
        const count = Math.floor(Math.random() * 3) + 1; // 1 to 3 talents
        const shuffled = [...TALENTS].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    static evaluateDestiny(root, physique, luck, origin) {
        let score = 0;
        score += root.multiplier * 20;
        if (physique) score += 50;
        score += luck;
        
        if (score < 50) return "Phàm mệnh";
        if (score < 100) return "Đại khí vãn thành";
        if (score < 150) return "Thiên kiêu";
        if (score < 200) return "Mệnh cách nghịch thiên";
        return "Có tư chất phi thăng";
    }
}
