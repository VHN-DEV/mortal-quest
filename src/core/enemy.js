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

    get level() {
        return this.realmId;
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
        
        // Initialize xianxia stats
        let physBonus = 0;
        let dsBonus = 0;
        let compBonus = 0;
        let dtBonus = 0;
        let hdBonus = 0;
        
        if (this.race === 'DEMON') {
            hdBonus += 15; // Ma tộc dễ bị tâm ma quấy nhiễu
            dsBonus += 5;
        } else if (this.race === 'DRAGON') {
            physBonus += 25; // Long tộc thân thể cường hãn
        } else if (this.race === 'SPIRIT_BEAST') {
            physBonus += 10;
            compBonus -= 5; // Thú tộc ngộ tính kém hơn nhân tộc
        } else if (this.race === 'GHOST') {
            dsBonus += 15; // Quỷ hồn thần thức mạnh
            physBonus -= 15; // Không có thân thể vật lý
        } else if (this.race === 'ZOMBIE') {
            physBonus += 15; // Thi tộc mình đồng da sắt
            dsBonus -= 10; // Mất đi thần trí
        }
        
        const baseVal = 40 + this.realmId * 2;
        const varianceVal = () => Math.floor(Math.random() * 15) - 7;
        
        this.comprehension = Math.max(5, Math.floor(10 + this.realmId * 0.5 + compBonus + (Math.random() * 6 - 3)));
        this.heartDemon = Math.max(0, Math.floor(Math.random() * 20 + hdBonus));
        this.daoTam = Math.max(10, Math.floor(baseVal + dtBonus + varianceVal()));
        this.divineSense = Math.max(10, Math.floor(baseVal + dsBonus + varianceVal()));
        this.physiqueTalent = Math.max(10, Math.floor(baseVal + physBonus + varianceVal()));
        
        this.calculateStats();
    }

    calculateStats() {
        const raceInfo = RACE_DATA[this.race] || RACE_DATA.HUMAN;
        const raceMults = raceInfo.statMult;
        
        const baseMultiplier = Math.pow(1.8, this.realmId - 1) * this.statMult;
        const variance = 0.9 + Math.random() * 0.2;
        
        // Keep HP & Mana percentage
        const hpPercent = this.maxHp ? (this.hp / this.maxHp) : 1.0;
        const manaPercent = this.maxMana ? (this.mana / this.maxMana) : 1.0;

        // Base values scaled by realm
        let baseHp = 100 * baseMultiplier * raceMults.hp;
        let baseAtk = 10 * baseMultiplier * raceMults.atk;
        let baseDef = 5 * baseMultiplier * raceMults.def;
        let baseSpd = (15 + (this.realmId * 5)) * raceMults.spd;
        let baseMana = 50 * baseMultiplier;

        // 1. Simulated Luyện Thể (Body Realm)
        let bodyLevel = 1;
        if (this.race === 'DRAGON' || this.race === 'ZOMBIE') {
            bodyLevel = Math.max(1, Math.floor(this.realmId * 1.2));
        } else if (this.race === 'DEMON' || this.race === 'SPIRIT_BEAST') {
            bodyLevel = Math.max(1, Math.floor(this.realmId * 1.0));
        } else if (this.race === 'HUMAN') {
            bodyLevel = Math.max(1, Math.floor(this.realmId * 0.8));
        }
        const bodyMult = bodyLevel > 0 ? Math.pow(1.2, bodyLevel - 1) : 1.0;
        const bodyHpBonus = 100 * Math.max(0, bodyLevel - 1) * bodyMult;
        const bodyDefBonus = 20 * Math.max(0, bodyLevel - 1) * bodyMult;

        baseHp += bodyHpBonus;
        baseDef += bodyDefBonus;

        // 2. Simulated Thần Hồn (Soul Realm)
        let soulLevel = 1;
        if (this.race === 'GHOST') {
            soulLevel = Math.max(1, Math.floor(this.realmId * 1.3));
        } else if (this.race === 'HUMAN' || this.race === 'DEMON') {
            soulLevel = Math.max(1, Math.floor(this.realmId * 0.9));
        } else {
            soulLevel = Math.max(1, Math.floor(this.realmId * 0.6));
        }
        const soulMult = soulLevel > 0 ? Math.pow(1.15, soulLevel - 1) : 1.0;
        const soulManaBonus = 60 * Math.max(0, soulLevel - 1) * soulMult;
        const soulSpdBonus = 10 * Math.max(0, soulLevel - 1) * soulMult;

        baseMana += soulManaBonus;
        baseSpd += soulSpdBonus;

        // Apply physiqueTalent (căn cốt) just like player
        baseHp *= (1 + (this.physiqueTalent / 200));
        baseDef *= (1 + (this.physiqueTalent / 500));

        // 3. Simulated Công Pháp (Techniques) Multipliers
        const techMult = 1.0 + (this.realmId * 0.18) * this.statMult;
        baseHp *= techMult;
        baseAtk *= techMult;
        baseDef *= techMult;
        baseSpd *= (1.0 + (this.realmId * 0.03));

        this.maxHp = Math.floor(baseHp * variance);
        this.atk = Math.floor(baseAtk * variance);
        this.def = Math.floor(baseDef * variance);
        this.spd = Math.floor(baseSpd * variance);
        this.maxMana = Math.floor(baseMana);

        // Apply divineSense (thần thức) just like player to perception
        this.perception = Math.floor(10 + (soulLevel * 5) + (this.divineSense / 5));
        this.perception = Math.round(this.perception * variance);

        this.maxThanThuc = Math.floor(this.divineSense || 50);
        if (this.thanThuc === undefined) {
            this.thanThuc = this.maxThanThuc;
        } else {
            this.thanThuc = Math.min(this.maxThanThuc, this.thanThuc);
        }

        // Initialize Advanced Stats
        this.advancedStats = {
            pierce: 0,
            soulPierce: 0,
            critRate: 0.05, 
            weaknessStrikeChance: 0.05,
            critDmg: 1.5,   
            fireDmg: 1.0,   
            waterDmg: 1.0,
            thunderDmg: 1.0,
            woodDmg: 1.0,
            earthDmg: 1.0,
            windDmg: 1.0,
            metalDmg: 1.0,
            iceDmg: 1.0,
            poisonDmg: 1.0,
            swordDmg: 1.0,
            lifeSteal: 0,
            soulRepress: 0,
            damageReduction: 0,
            allRes: 0,
            techniqueMastery: 1.0
        };

        // Base advanced stats scaled by cultivation realm
        this.advancedStats.critRate += this.realmId * 0.01;
        this.advancedStats.weaknessStrikeChance += this.realmId * 0.01;
        this.advancedStats.critDmg += this.realmId * 0.02;
        this.advancedStats.pierce += this.realmId * 0.008;
        this.advancedStats.damageReduction = 1 - (1 / (1 + (bodyLevel * 0.05))); // Match player DR formula

        // Racial advanced stats adjustments
        if (this.race === 'DEMON') {
            this.advancedStats.lifeSteal += 0.05 + this.realmId * 0.005;
        } else if (this.race === 'DRAGON') {
            this.advancedStats.damageReduction += 0.1;
            this.advancedStats.thunderDmg += 0.2;
        } else if (this.race === 'SPIRIT_BEAST') {
            this.advancedStats.critRate += 0.03;
            this.advancedStats.weaknessStrikeChance += 0.03;
        } else if (this.race === 'GHOST') {
            this.advancedStats.pierce += 0.05;
        }

        // Apply Heart Demon penalties if high
        if (this.heartDemon > 10) {
            const hdPenalty = 1 - (this.heartDemon / 200);
            this.atk = Math.round(this.atk * hdPenalty);
            this.advancedStats.critRate *= hdPenalty;
            this.advancedStats.weaknessStrikeChance *= hdPenalty;
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

        // 4. Natural Arsenal Scaling for Beasts (who don't wear gear)
        const isHumanoid = ['HUMAN', 'DEMON'].includes(this.race);
        if (!isHumanoid) {
            const gearMult = Math.pow(1.8, this.realmId - 1);
            this.atk += Math.round(15 * gearMult * variance);
            this.def += Math.round(10 * gearMult * variance);
            this.maxHp += Math.round(80 * gearMult * variance);
        }

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
            { name: 'Quỷ Hồn', img: ASSETS.enemies.ghost, statMult: 0.9, race: 'GHOST' },
            { name: 'Thanh Long', img: ASSETS.enemies.thanh_long, statMult: 2.5, race: 'DRAGON' },
            { name: 'Giao Long', img: ASSETS.enemies.giao_long, statMult: 1.8, race: 'SPIRIT_BEAST' },
            { name: 'Hắc Xà', img: ASSETS.enemies.hac_xa, statMult: 1.4, race: 'SPIRIT_BEAST' },
            { name: 'Hỏa Viêm Thú', img: ASSETS.enemies.hoa_viem, statMult: 1.5, race: 'SPIRIT_BEAST' },
            { name: 'Băng Hùng', img: ASSETS.enemies.bang_hung, statMult: 1.3, race: 'SPIRIT_BEAST' },
            { name: 'Côn Bằng', img: ASSETS.enemies.con_bang, statMult: 2.8, race: 'DRAGON' },
            { name: 'Chu Tước', img: ASSETS.enemies.chu_tuoc, statMult: 2.3, race: 'SPIRIT_BEAST' },
            { name: 'U Minh Mộng Điệp', img: ASSETS.enemies.u_minh_mong_diep, statMult: 1.2, race: 'SPIRIT_BEAST' },
            { name: 'Thất Thái Thiên Long', img: ASSETS.enemies.that_thai_thien_long, statMult: 2.7, race: 'DRAGON' }
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
        
        // Assign concealment technique
        enemy.equippedConcealmentId = null;
        if (enemy.realmId >= 3) {
            const roll = Math.random();
            if (enemy.race === 'GHOST') {
                enemy.equippedConcealmentId = 'liem_khi_quyet';
            } else if (isHumanoid) {
                if (roll < 0.25) {
                    enemy.equippedConcealmentId = 'liem_khi_quyet';
                } else if (roll < 0.35 && enemy.realmId >= 12) {
                    enemy.equippedConcealmentId = 'quy_nguyen_thu_tuc_cong';
                }
            } else if (enemy.race === 'SPIRIT_BEAST' && roll < 0.2) {
                enemy.equippedConcealmentId = 'liem_khi_quyet';
            }
        }

        // Assign escape technique
        enemy.mainEscapeId = null;
        if (enemy.realmId >= 3) {
            const roll = Math.random();
            if (isHumanoid) {
                if (roll < 0.15 && enemy.realmId >= 12) {
                    enemy.mainEscapeId = 'loi_don_thuat';
                } else if (roll < 0.25 && enemy.race === 'DEMON') {
                    enemy.mainEscapeId = 'huyet_don_thuat';
                } else if (roll < 0.4) {
                    enemy.mainEscapeId = 'la_yen_bo';
                }
            } else if (enemy.race === 'DRAGON' || enemy.race === 'GHOST') {
                if (roll < 0.5) {
                    enemy.mainEscapeId = 'loi_don_thuat';
                }
            } else if (enemy.race === 'SPIRIT_BEAST' && roll < 0.3) {
                enemy.mainEscapeId = 'la_yen_bo';
            }
        }

        // 1. Basic Loot (Common for all)
        if (Math.random() < 0.8) {
            enemy.inventory.push({ id: 'ha_pham_linh_thach', quantity: Math.floor(Math.random() * 50 * enemy.realmId) });
        }

        // 2. Race Specific Loot
        if (enemy.race === 'SPIRIT_BEAST') {
            enemy.inventory.push({ id: 'ha_pham_yeu_dan', quantity: 1 });
            if (Math.random() < 0.3) enemy.inventory.push({ id: 'yeu_thu_tinh_huyet', quantity: 1 });
        }

        // 3. Humanoid Equipment & Skills
        if (isHumanoid) {
            // Randomly equip items based on realm (with exponential gearMult scaling)
            const gearMult = Math.pow(1.8, enemy.realmId - 1);
            if (enemy.realmId >= 1) {
                enemy.equipment.weapon = { 
                    id: 'phi_kiem_go', 
                    name: 'Phi Kiếm Gỗ', 
                    stats: { atk: Math.round(15 * gearMult) } 
                };
                enemy.equipment.armor = { 
                    id: 'tho_bo_pham_y', 
                    name: 'Áo Vải Tu Sĩ', 
                    stats: { def: Math.round(8 * gearMult) } 
                };
            }
            if (enemy.realmId >= 10) {
                enemy.equipment.weapon = { 
                    id: 'thanh_hong_kiem', 
                    name: 'Thanh Hồng Kiếm', 
                    stats: { atk: Math.round(25 * gearMult) } 
                };
                enemy.equipment.artifact = { 
                    id: 'ho_tam_kinh', 
                    name: 'Hộ Tâm Kính', 
                    stats: { def: Math.round(12 * gearMult), hp: Math.round(100 * gearMult) } 
                };
            }

            // Skills
            enemy.skills.push('BASIC_ATTACK');
            if (enemy.realmId >= 3) enemy.skills.push('QI_BURST');
            if (enemy.realmId >= 6) enemy.skills.push('SHIELD_UP');
            if (enemy.realmId >= 10) {
                if (enemy.race === 'DEMON') {
                    enemy.skills.push('BLOOD_SACRIFICE');
                    enemy.skills.push('SOUL_REPRESS');
                } else {
                    enemy.skills.push('SWORD_RAIN');
                }
            }
            if (enemy.realmId >= 14) enemy.skills.push('HEAL_TECHNIQUE');

            // Pills (for combat use)
            if (Math.random() < 0.5) enemy.inventory.push({ id: 'hoi_huyet_dan', quantity: 1 });
            if (enemy.realmId >= 10 && Math.random() < 0.3) enemy.inventory.push({ id: 'thanh_tam_dan', quantity: 1 });

            // Offensive items (Talismans)
            if (enemy.realmId >= 3 && Math.random() < 0.4) {
                enemy.inventory.push({ id: 'hoa_cau_phu', quantity: 1 });
            }
        } else {
            // Non-humanoid (Beasts, Dragons, Zombies, Ghosts) Skills allocation
            enemy.skills.push('BASIC_ATTACK');
            if (enemy.race === 'SPIRIT_BEAST' || enemy.race === 'DRAGON') {
                if (enemy.realmId >= 3) enemy.skills.push('BEAST_ROAR');
                if (enemy.realmId >= 8) {
                    if (enemy.name.includes('Lôi') || enemy.race === 'DRAGON') {
                        enemy.skills.push('LIGHTNING_TRIBULATION');
                    } else if (enemy.name.includes('Xà') || enemy.name.includes('Điệp')) {
                        enemy.skills.push('POISON_MIST');
                    } else {
                        enemy.skills.push('QI_BURST');
                    }
                }
                if (enemy.realmId >= 12) enemy.skills.push('SHIELD_UP');
            } else if (enemy.race === 'GHOST') {
                enemy.skills.push('SOUL_REPRESS');
                if (enemy.realmId >= 8) enemy.skills.push('QI_BURST');
            } else if (enemy.race === 'ZOMBIE') {
                if (enemy.realmId >= 5) enemy.skills.push('BEAST_ROAR');
                if (enemy.realmId >= 10) enemy.skills.push('SHIELD_UP');
            }
        }

        // 4. Random drops (Storage bag logic)
        if (Math.random() < 0.2) {
            const possibleItems = ['hat_giong_thanh_phuc_thao', 'thanh_phuc_thao', 'ngung_khi_dan', 'tich_coc_dan', 'kim_cuong_phu'];
            const randomItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
            enemy.inventory.push({ id: randomItem, quantity: 1 });
        }

        // Re-calculate stats with equipment
        enemy.calculateStats();
    }
}

