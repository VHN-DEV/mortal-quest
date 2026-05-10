import { REALMS } from '../configs/realm-data.js';
import { ASSETS } from '../configs/asset-data.js';

export class Enemy {
    constructor(realmId, typeData) {
        this.realmId = realmId;
        this.name = `${typeData.name} (Cấp ${realmId})`;
        this.image = typeData.img;
        this.statMult = typeData.statMult;
        this.calculateStats();
    }

    calculateStats() {
        const multiplier = Math.pow(1.4, this.realmId - 1) * this.statMult;
        const variance = 0.9 + Math.random() * 0.2; // 90% to 110%
        
        this.maxHp = Math.floor(100 * multiplier * variance);
        this.hp = this.maxHp;
        this.atk = Math.floor(10 * multiplier * variance);
        this.def = Math.floor(5 * multiplier * variance);
        this.spd = Math.floor(10 + (this.realmId * 1.5) * variance);
    }
}

export class EnemyGenerator {
    static generate(playerRealmId) {
        const types = [
            { name: 'Yêu Lang', img: ASSETS.enemies.wolf, statMult: 0.8 },
            { name: 'Hắc Hổ', img: ASSETS.enemies.wolf, statMult: 1.0 },
            { name: 'Tán Tu', img: ASSETS.enemies.rogue, statMult: 1.1 },
            { name: 'Ma Tu', img: ASSETS.enemies.demon, statMult: 1.3 },
            { name: 'Lôi Long', img: ASSETS.enemies.dragon, statMult: 2.0 }
        ];

        // Randomize target realm (+/- 2 realms)
        const targetRealm = Math.max(1, playerRealmId + Math.floor(Math.random() * 5) - 2);
        const typeData = types[Math.floor(Math.random() * types.length)];
        
        return new Enemy(targetRealm, typeData);
    }
}
