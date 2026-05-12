import { getRealmById, RACE_DATA } from '../configs/realm-data.js';
import { ASSETS } from '../configs/asset-data.js';

export class Enemy {
    constructor(realmId, typeData) {
        this.realmId = realmId;
        this.race = typeData.race || 'HUMAN';
        this.typeData = typeData;
        
        const realm = getRealmById(this.realmId, 'tuvi', this.race);
        this.realmName = realm.name;
        this.name = `${typeData.name} (${this.realmName})`;
        this.image = typeData.img;
        this.statMult = typeData.statMult;
        
        this.inventory = [];
        this.equipment = { weapon: null, armor: null, artifact: null };
        this.skills = [];
        
        this.calculateStats();
    }

    calculateStats() {
        const raceInfo = RACE_DATA[this.race] || RACE_DATA.HUMAN;
        const raceMults = raceInfo.statMult;
        
        const baseMultiplier = Math.pow(1.4, this.realmId - 1) * this.statMult;
        const variance = 0.9 + Math.random() * 0.2;
        
        this.maxHp = Math.floor(100 * baseMultiplier * variance * raceMults.hp);
        this.hp = this.maxHp;
        this.atk = Math.floor(10 * baseMultiplier * variance * raceMults.atk);
        this.def = Math.floor(5 * baseMultiplier * variance * raceMults.def);
        this.spd = Math.floor((10 + (this.realmId * 1.5)) * variance * raceMults.spd);
        
        this.maxMana = Math.floor(50 * baseMultiplier);
        this.mana = this.maxMana;
        this.perception = Math.floor(5 + (this.realmId * 1.8) * variance);

        // Apply equipment bonuses
        if (this.equipment.weapon) {
            this.atk += (this.equipment.weapon.stats?.atk || 0);
            this.spd += (this.equipment.weapon.stats?.spd || 0);
        }
        if (this.equipment.armor) {
            this.def += (this.equipment.armor.stats?.def || 0);
            this.maxHp += (this.equipment.armor.stats?.hp || 0);
            if (this.hp > this.maxHp) this.hp = this.maxHp;
        }
        if (this.equipment.artifact) {
            this.atk += (this.equipment.artifact.stats?.atk || 0);
            this.def += (this.equipment.artifact.stats?.def || 0);
            this.maxMana += (this.equipment.artifact.stats?.mana || 0);
        }
    }
}

export class EnemyGenerator {
    static generate(playerRealmId) {
        const types = [
            { name: 'Yêu Lang', img: ASSETS.enemies.wolf, statMult: 0.8, race: 'SPIRIT_BEAST' },
            { name: 'Hắc Hổ', img: ASSETS.enemies.wolf, statMult: 1.0, race: 'SPIRIT_BEAST' },
            { name: 'Tán Tu', img: ASSETS.enemies.rogue, statMult: 1.1, race: 'HUMAN' },
            { name: 'Ma Tu', img: ASSETS.enemies.demon, statMult: 1.3, race: 'DEMON' },
            { name: 'Lôi Long', img: ASSETS.enemies.dragon, statMult: 2.0, race: 'DRAGON' },
            { name: 'Hành Thi', img: ASSETS.enemies.zombie, statMult: 0.7, race: 'ZOMBIE' },
            { name: 'Quỷ Hồn', img: ASSETS.enemies.ghost, statMult: 0.9, race: 'GHOST' }
        ];

        const targetRealm = Math.max(1, playerRealmId + Math.floor(Math.random() * 5) - 2);
        const typeData = types[Math.floor(Math.random() * types.length)];
        
        const enemy = new Enemy(targetRealm, typeData);

        // Populate Enemy Inventory & Equipment
        this.populateLoot(enemy);

        return enemy;
    }

    static populateLoot(enemy) {
        const isHumanoid = ['HUMAN', 'DEMON'].includes(enemy.race);
        
        // 1. Basic Loot (Common for all)
        if (Math.random() < 0.8) {
            enemy.inventory.push({ id: 'ling_thach_ha', quantity: Math.floor(Math.random() * 50 * enemy.realmId) });
        }

        // 2. Race Specific Loot
        if (enemy.race === 'SPIRIT_BEAST') {
            enemy.inventory.push({ id: 'yeu_dan_so', quantity: 1 });
            if (Math.random() < 0.3) enemy.inventory.push({ id: 'yeu_huyet', quantity: 1 });
        }

        // 3. Humanoid Equipment & Skills
        if (isHumanoid) {
            // Randomly equip items based on realm
            if (enemy.realmId >= 1) {
                enemy.equipment.weapon = { id: 'phi_kiem_go', name: 'Phi Kiếm Gỗ', stats: { atk: 10 + enemy.realmId * 5 } };
                enemy.equipment.armor = { id: 'ao_bo_so_cap', name: 'Áo Vải Tu Sĩ', stats: { def: 5 + enemy.realmId * 3 } };
            }
            if (enemy.realmId >= 10) {
                enemy.equipment.weapon = { id: 'thanh_hong_kiem', name: 'Thanh Hồng Kiếm', stats: { atk: 50 + enemy.realmId * 10 } };
                enemy.equipment.artifact = { id: 'ho_tam_kinh', name: 'Hộ Tâm Kính', stats: { def: 30, hp: 100 } };
            }

            // Skills
            enemy.skills.push('BASIC_ATTACK');
            if (enemy.realmId >= 5) enemy.skills.push('QI_BURST');
            if (enemy.realmId >= 15) enemy.skills.push('HEAL_TECHNIQUE');

            // Pills (for combat use)
            if (Math.random() < 0.5) enemy.inventory.push({ id: 'hoi_huyet_dan', quantity: 1 });
            if (enemy.realmId >= 10 && Math.random() < 0.3) enemy.inventory.push({ id: 'thanh_tam_dan', quantity: 1 });

            // Offensive items (Talismans)
            if (enemy.realmId >= 3 && Math.random() < 0.4) {
                enemy.inventory.push({ id: 'hoa_cau_phu', quantity: 1 });
            }
        }

        // 4. Random drops (Storage bag logic)
        if (Math.random() < 0.2) {
            const possibleItems = ['seed_linh_thao', 'linh_thao_thap', 'ngung_khi_dan', 'tich_coc_dan', 'kim_cuong_phu'];
            const randomItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
            enemy.inventory.push({ id: randomItem, quantity: 1 });
        }

        // Re-calculate stats with equipment
        enemy.calculateStats();
    }
}

