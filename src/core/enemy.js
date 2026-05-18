import { getRealmById, RACE_DATA } from '../configs/realm-data.js';
import { ASSETS } from '../configs/asset-data.js';
import { SECTS } from '../configs/sect-data.js';

export class Enemy {
    get element() {
        if (this.race === 'DEMON') return 'Âm';
        if (this.race === 'DRAGON') return 'Lôi';
        if (this.race === 'GHOST' || this.race === 'ZOMBIE') return 'Âm';
        if (this.name.includes('Lôi') || this.name.includes('Sét')) return 'Lôi';
        if (this.name.includes('Hỏa') || this.name.includes('Lửa')) return 'Hỏa';
        if (this.name.includes('Băng') || this.name.includes('Tuyết')) return 'Băng';
        if (this.name.includes('Thủy') || this.name.includes('Nước')) return 'Thủy';
        if (this.name.includes('Mộc') || this.name.includes('Lục')) return 'Mộc';
        if (this.name.includes('Kim')) return 'Kim';
        if (this.name.includes('Thổ') || this.name.includes('Đá') || this.name.includes('Thạch')) return 'Thổ';
        
        const elements = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
        return elements[this.realmId % elements.length];
    }

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
        
        // Keep HP & Mana percentage
        const hpPercent = this.maxHp ? (this.hp / this.maxHp) : 1.0;
        const manaPercent = this.maxMana ? (this.mana / this.maxMana) : 1.0;

        this.maxHp = Math.floor(100 * baseMultiplier * variance * raceMults.hp);
        this.atk = Math.floor(10 * baseMultiplier * variance * raceMults.atk);
        this.def = Math.floor(5 * baseMultiplier * variance * raceMults.def);
        this.spd = Math.floor((10 + (this.realmId * 1.5)) * variance * raceMults.spd);
        
        this.maxMana = Math.floor(50 * baseMultiplier);
        this.perception = Math.floor(5 + (this.realmId * 1.8) * variance);

        // Initialize Advanced Stats
        this.advancedStats = {
            pierce: 0,
            soulPierce: 0,
            critRate: 0.05, 
            critDmg: 1.5,   
            fireDmg: 1.0,   
            waterDmg: 1.0,
            thunderDmg: 1.0,
            poisonDmg: 1.0,
            lifeSteal: 0,
            soulRepress: 0,
            damageReduction: 0,
            allRes: 0,
            techniqueMastery: 1.0
        };

        // Base advanced stats scaled by cultivation realm
        this.advancedStats.critRate += this.realmId * 0.01; // 1% crit rate per realm level
        this.advancedStats.critDmg += this.realmId * 0.02; // +2% crit damage per realm level
        this.advancedStats.pierce += this.realmId * 0.008; // Xuyên giáp tăng dần theo cảnh giới
        this.advancedStats.damageReduction = 1 - (1 / (1 + (this.realmId * 0.025))); // Giảm sát thương tăng theo cảnh giới

        // Racial advanced stats adjustments
        if (this.race === 'DEMON') {
            this.advancedStats.lifeSteal += 0.05 + this.realmId * 0.005; // Ma tộc có sẵn khả năng hút máu
        } else if (this.race === 'DRAGON') {
            this.advancedStats.damageReduction += 0.1; // Long tộc mình đồng da sắt
            this.advancedStats.thunderDmg += 0.2; // Lôi long bẩm sinh điều khiển sấm sét
        } else if (this.race === 'SPIRIT_BEAST') {
            this.advancedStats.critRate += 0.03; // Yêu thú dã tính có tỷ lệ bạo kích cao hơn
        } else if (this.race === 'GHOST') {
            this.advancedStats.pierce += 0.05; // Quỷ hồn công kích vô hình dễ xuyên phòng ngự
        }

        // Apply equipment bonuses dynamically (generic loop over stats)
        const equippedItems = [this.equipment.weapon, this.equipment.armor, this.equipment.artifact].filter(Boolean);
        equippedItems.forEach(item => {
            if (!item.stats) return;
            
            Object.entries(item.stats).forEach(([k, v]) => {
                if (k === 'atk') this.atk += v;
                else if (k === 'def') this.def += v;
                else if (k === 'spd') this.spd += v;
                else if (k === 'hp') this.maxHp += v;
                else if (k === 'mana') this.maxMana += v;
                else if (this.advancedStats.hasOwnProperty(k)) {
                    if (['fireDmg', 'waterDmg', 'thunderDmg', 'poisonDmg', 'qiAbsorb'].includes(k)) {
                        this.advancedStats[k] *= (1 + v);
                    } else {
                        this.advancedStats[k] += v;
                    }
                }
            });
        });

        // Set final HP and Mana keeping percentage
        this.hp = Math.round(this.maxHp * hpPercent);
        this.mana = Math.round(this.maxMana * manaPercent);
    }
}

export class EnemyGenerator {
    static generate(playerRealmId) {
        const types = [
            { name: 'Yêu Lang', img: ASSETS.enemies.wolf, statMult: 0.8, race: 'SPIRIT_BEAST' },
            { name: 'Hắc Hổ', img: ASSETS.enemies.black_tiger, statMult: 1.0, race: 'SPIRIT_BEAST' },
            { name: 'Tán Tu', img: ASSETS.enemies.rogue_cultivator, statMult: 1.1, race: 'HUMAN' },
            { name: 'Ma Tu', img: ASSETS.enemies.demon_cultivator, statMult: 1.3, race: 'DEMON' },
            { name: 'Lôi Long', img: ASSETS.enemies.dragon, statMult: 2.0, race: 'DRAGON' },
            { name: 'Hành Thi', img: ASSETS.enemies.zombie, statMult: 0.7, race: 'ZOMBIE' },
            { name: 'Quỷ Hồn', img: ASSETS.enemies.ghost, statMult: 0.9, race: 'GHOST' }
        ];

        const targetRealm = Math.max(1, playerRealmId + Math.floor(Math.random() * 5) - 2);
        const typeData = types[Math.floor(Math.random() * types.length)];
        
        const enemy = new Enemy(targetRealm, typeData);

        // Intercept for Sect Guard spawning at Sect Gates
        const currentLocId = window.state?.currentLocId || '';
        const sect = SECTS[currentLocId];
        if (sect && (enemy.race === 'HUMAN' || enemy.race === 'DEMON')) {
            let title = 'Đệ tử Ngoại môn';
            if (targetRealm >= 30) {
                title = 'Trưởng lão';
            } else if (targetRealm >= 15) {
                title = 'Đệ tử Nội môn';
            }
            enemy.name = `${title} ${sect.name} (${enemy.realmName})`;
            
            // Apply rare scroll loot drop (12% chance)
            if (Math.random() < 0.12) {
                const dropPassive = Math.random() < 0.7;
                const dropItemId = dropPassive ? `item_${currentLocId}_t` : `item_${currentLocId}_s`;
                enemy.inventory.push({ id: dropItemId, quantity: 1 });
            }
        }

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

