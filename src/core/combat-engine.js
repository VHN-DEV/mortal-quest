import { getTechniqueById, getSecretTechniqueById } from '../configs/technique-data.js';
import { getFlameById } from '../configs/alchemy-data.js';
import { getItemById } from '../configs/item-data.js';
import { getStatusEffectById, STATUS_EFFECT_TEMPLATES } from '../configs/status-effect-data.js';
import { QUALITY_TYPES } from '../configs/item-classification.js';
import { COMBAT_STANCES, COMBAT_EVENTS } from '../configs/game-enums.js';


export class CombatEngine {
    constructor(player, enemy, onUpdate, onEnd, ambushType = null, environment = 'NORMAL') {
        this.player = player;
        this.enemy = enemy || { name: 'Vô Danh Kẻ Địch', hp: 100, maxHp: 100, atk: 10, def: 10, spd: 10, inventory: [] };
        
        if (typeof this.enemy === 'string') {
            console.error('CombatEngine: enemy is a string! This is a bug in the caller.', this.enemy);
            this.enemy = { name: 'Lỗi Dữ Liệu (' + this.enemy + ')', hp: 100, maxHp: 100, atk: 1, def: 1, spd: 1, inventory: [] };
        }
        
        this.onUpdate = onUpdate;
        this.onEnd = onEnd;
        this.ambushType = ambushType; 
        this.environment = environment; // 'NORMAL', 'FIRE', 'ICE', 'DEMON_QI', 'SPIRITUAL_TIDE'
        this.turn = 0; 
        this.playerAmbushBonus = false;
        this.log = [];
        this.isActive = true;
        this.playerDefending = false;
        this.playerDodging = false;
        this.playerChanting = null; // { turns, maxTurns, type, payload }
        this.enemyArchetype = this.getEnemyArchetype();
        this.status = {
            player: { stun: 0, shield: 0, speed: 0 },
            enemy: { burn: 0, burnPower: 0, stun: 0, shield: 0, speed: 0 }
        };
        this.enemy.buffs = this.enemy.buffs || [];
        this.turnOrder = [];
        this.calculateTurnOrder();
        
        // --- Module 1: Chiến Thế (Combat Stance) ---
        this.playerStance = 'NONE';
        
        // --- Module 2: Thiên Địa Dị Biến (Combat Events) ---
        this.combatEventTurnCounter = 0;
        this.activeCombatEvents = new Set();  // IDs of currently active event bonuses
        
        // --- Module 3: Đạo Tâm / Tâm Ma snapshot ---
        this.combatHeartDemon = Math.min(100, player.heartDemon || 0);
        this.combatDaoTam = Math.max(0, player.daoTam || 50);
        
    }

    getEnemyMultiplier(statKey) {
        let multiplier = 1.0;
        if (this.enemy.buffs) {
            this.enemy.buffs.forEach(b => {
                if (b.effects && b.effects[statKey]) {
                    const stacks = b.stacks || 1;
                    multiplier += b.effects[statKey] * stacks;
                }
            });
        }
        return Math.max(0.1, multiplier);
    }

    addEnemyStatusEffect(effectId) {
        const config = getStatusEffectById(effectId);
        if (!config) return;

        this.enemy.buffs = this.enemy.buffs || [];
        const existingIndex = this.enemy.buffs.findIndex(b => b.id === effectId);

        if (existingIndex > -1) {
            const effect = this.enemy.buffs[existingIndex];
            effect.stacks = Math.min(config.maxStacks || 1, (effect.stacks || 1) + 1);
            effect.duration = config.duration;
        } else {
            this.enemy.buffs.push({
                id: config.id,
                name: config.name,
                category: config.category,
                type: config.type,
                desc: config.desc,
                maxStacks: config.maxStacks || 1,
                stacks: 1,
                duration: config.duration,
                effects: config.effects
            });
        }
        this.addLog(`✨ Đòn đánh của ngươi khiến đối thủ chịu trạng thái <span class="text-red-400 font-bold">[${config.name}]</span>!`);
    }

    applyCombatStatusEffects(attacker, defender, isAttackerPlayer, damage, wasCrit) {
        if (isAttackerPlayer) {
            this.enemy.buffs = this.enemy.buffs || [];
            
            // 1. Kiếm tu: accumulates "Nội Thương"
            if (this.player.specializedPaths?.sword?.realmId > 0) {
                if (wasCrit || Math.random() < 0.35) {
                    this.addEnemyStatusEffect('noi_thuong_nhe');
                }
            }
            // 2. Độc tu: accumulates "Mộc Độc"
            if (this.player.specializedPaths?.poison?.realmId > 0) {
                if (Math.random() < 0.4) {
                    this.addEnemyStatusEffect('moc_doc');
                }
            }
            // 3. Hồn tu: accumulates "Thần Hồn Tổn Thương"
            if (this.player.specializedPaths?.soul_path?.realmId > 0 || this.player.specializedPaths?.soul?.realmId > 0) {
                if (Math.random() < 0.3) {
                    this.addEnemyStatusEffect('than_hon_ton_thuong');
                }
            }
            // 4. Thể tu: accumulates "Thần Hồn Chấn Động"
            if (this.player.specializedPaths?.body_path?.realmId > 0 || this.player.specializedPaths?.body?.realmId > 0) {
                if (Math.random() < 0.3) {
                    this.addEnemyStatusEffect('than_hon_chan_dong');
                }
            }
            // 5. Ma tu: accumulates "Tâm Ma Xâm Thực"
            if (this.player.mainPath === 'ma_dao') {
                if (Math.random() < 0.25) {
                    this.addEnemyStatusEffect('tam_ma_xam_thuc');
                }
            }
        } else {
            // Enemy attacking Player -> apply persistent player.addStatusEffect
            
            // Standard chance: 20% to apply "noi_thuong_nhe"
            if (Math.random() < 0.20) {
                this.player.addStatusEffect('noi_thuong_nhe', null, this.enemy.name);
                this.addLog(`⚠️ Linh khí chấn động mạnh! Bản thân bị tổn thương kinh mạch, tích tụ trạng thái <span class="text-yellow-500 font-bold">[Nội Thương Nhẹ]</span>.`);
            }
            
            // Critical hit: 45% chance to apply "Nội Thương" or "Kinh Mạch Tổn Thương"
            if (wasCrit && Math.random() < 0.45) {
                if (Math.random() < 0.5) {
                    this.player.addStatusEffect('noi_thuong', null, this.enemy.name);
                    this.addLog(`🚨 Huyết dịch ngược dòng! Chịu cự lực oanh kích chấn thương nặng, mắc trạng thái <span class="text-red-500 font-bold">[Nội Thương]</span>!`);
                } else {
                    this.player.addStatusEffect('kinh_mach_ton_thuong', null, this.enemy.name);
                    this.addLog(`⚡ Pháp lực phản phệ! Kinh mạch rạn nứt nghiêm trọng, mắc trạng thái <span class="text-red-500 font-bold">[Kinh Mạch Tổn Thương]</span>!`);
                }
            }

            // Archetype-based buildup:
            if (this.enemyArchetype === 'ASSASSIN' && Math.random() < 0.25) {
                const poisonType = Math.random() < 0.5 ? 'moc_doc' : 'hoa_doc';
                this.player.addStatusEffect(poisonType, null, this.enemy.name);
                this.addLog(`🐍 Độc khí xâm nhập! Ngươi bị trúng độc sâu sắc, mắc trạng thái <span class="text-green-500 font-bold">[${poisonType === 'moc_doc' ? 'Mộc Độc' : 'Hỏa Độc'}]</span>!`);
            }

            if (this.enemyArchetype === 'BERSERKER' && Math.random() < 0.3) {
                if (Math.random() < 0.5) {
                    this.player.addStatusEffect('than_hon_chan_dong', null, this.enemy.name);
                    this.addLog(`🌀 Thần hồn dao động! Đầu óc ù tai mê muội, mắc trạng thái <span class="text-purple-500 font-bold">[Thần Hồn Chấn Động]</span>.`);
                } else {
                    this.player.addStatusEffect('chan_nguyen_hon_loan', null, this.enemy.name);
                    this.addLog(`💥 Chân nguyên hỗn loạn! Cát khí tàn phá khí hải, mắc trạng thái <span class="text-orange-500 font-bold">[Chân Nguyên Hỗn Loạn]</span>.`);
                }
            }

            if (this.enemyArchetype === 'TANK' && Math.random() < 0.25) {
                const slowType = Math.random() < 0.5 ? 'tho_tre' : 'loi_phe';
                this.player.addStatusEffect(slowType, null, this.enemy.name);
                this.addLog(`⚡ Thân thể ngưng trệ! Ngươi bị tê liệt bởi pháp lực nặng nề, mắc trạng thái <span class="text-yellow-600 font-bold">[${slowType === 'tho_tre' ? 'Thổ Trệ' : 'Lôi Phệ'}]</span>.`);
            }
        }
    }

    calculateTurnOrder() {
        // Divine Sense (Perception) influences reaction speed
        const pSense = (this.player.advancedStats?.perception || 10) * 0.1;
        const eSense = (this.enemy.perception || 10) * 0.1;

        this.turnOrder = [
            { id: 'player', name: 'Ngươi', spd: this.player.spd + pSense },
            { id: 'enemy', name: this.enemy.name, spd: this.enemy.spd + eSense }
        ].sort((a, b) => b.spd - a.spd);
    }

    getEnemyArchetype() {
        if (this.enemy.spd >= this.enemy.atk * 0.9 && this.enemy.spd > this.enemy.def) return 'ASSASSIN';
        if (this.enemy.def >= this.enemy.atk * 0.8 && this.enemy.def > this.enemy.spd) return 'TANK';
        if (this.enemy.atk >= this.enemy.def * 1.2) return 'BERSERKER';
        return 'BALANCED';
    }

    calculateRealmSuppression(attacker, defender) {
        let mult = 1.0;
        const aRealm = attacker.realmId || 1;
        const dRealm = defender.realmId || 1;

        const getMajorRealmLevel = (realmId) => {
            if (!realmId || realmId === 0) return 0;
            if (realmId <= 13) return 1; // Luyện Khí / Yêu Thú
            if (realmId <= 17) return 2; // Trúc Cơ / Yêu Linh
            if (realmId <= 21) return 3; // Kết Đan / Yêu Tướng
            if (realmId <= 25) return 4; // Nguyên Anh / Yêu Soái
            if (realmId <= 29) return 5; // Hóa Thần / Yêu Vương
            if (realmId <= 33) return 6; // Luyện Hư / Yêu Hoàng
            if (realmId <= 37) return 7; // Hợp Thể / Yêu Tôn
            if (realmId <= 41) return 8; // Đại Thừa / Yêu Thánh
            if (realmId <= 45) return 9; // Độ Kiếp / Yêu Đế
            if (realmId <= 49) return 10; // Chân Tiên / Yêu Tiên
            if (realmId <= 53) return 11; // Kim Tiên
            if (realmId <= 60) return 12; // Thái Ất
            return 13; // Đại La / Đạo Tổ
        };

        const aMajor = getMajorRealmLevel(aRealm);
        const dMajor = getMajorRealmLevel(dRealm);

        if (aMajor > dMajor) {
            const majorDiff = aMajor - dMajor;
            const mults = { 1: 3.0, 2: 8.0, 3: 20.0 };
            mult = mults[majorDiff] || 50.0;
            const subDiff = aRealm - dRealm;
            mult += subDiff * 0.05;
            if (Math.random() < 0.15) {
                this.addLog(`<span class="text-cultivation-gold">Uy áp!</span> Cảnh giới cao áp chế kẻ yếu, uy lực tăng mạnh.`);
            }
        } else if (aMajor < dMajor) {
            const majorDiff = dMajor - aMajor;
            const subDiff = dRealm - aRealm;
            if (majorDiff === 1) {
                mult = 0.15;
            } else if (majorDiff === 2) {
                mult = 0.03;
            } else {
                mult = 0.01;
            }
            mult = Math.max(0.005, mult - subDiff * 0.002);
            if (Math.random() < 0.15) {
                this.addLog(`<span class="text-red-400">Trấn áp!</span> Cảnh giới kẻ địch quá cao, ngươi chịu áp chế cảnh giới nặng nề.`);
            }
        } else if (aRealm > dRealm) {
            const diff = aRealm - dRealm;
            mult = 1.0 + (diff * 0.05);
        } else if (aRealm < dRealm) {
            const diff = dRealm - aRealm;
            mult = Math.max(0.6, 1.0 - (diff * 0.05));
        }

        return mult;
    }

    calculateRacialSuppression(attacker, defender) {
        let mult = 1.0;
        const aRace = attacker.race;
        const dRace = defender.race;

        // Long Tộc áp chế các loại thú khác
        if (aRace === 'DRAGON' && (dRace === 'SPIRIT_BEAST' || dRace === 'ZOMBIE')) {
            mult *= 1.3;
            this.addLog(`<span class="text-yellow-500">Long Uy!</span> Huyết mạch áp chế khiến đối phương run rẩy.`);
        }

        // Phật/Nho khắc chế Ma/Quỷ
        if ((aRace === 'BUDDHIST' || aRace === 'CONFUCIAN') && (dRace === 'DEMON' || dRace === 'GHOST')) {
            mult *= 1.25;
            this.addLog(`<span class="text-blue-400">Chính khí!</span> Khắc chế tà ma ngoại đạo.`);
        }

        return mult;
    }

    getElementalMultiplier(attackerElement, defenderElement) {
        if (!attackerElement || !defenderElement || attackerElement === 'Neutral' || defenderElement === 'Neutral') {
            return 1.0;
        }

        const counterMap = {
            'Thủy': 'Hỏa',
            'Hỏa': 'Kim',
            'Kim': 'Mộc',
            'Mộc': 'Thổ',
            'Thổ': 'Thủy',
            'Phong': 'Thổ',
            'Lôi': 'Âm',
            'Băng': 'Thủy',
            'Âm': 'Dương',
            'Dương': 'Âm'
        };

        if (counterMap[attackerElement] === defenderElement) {
            this.addLog(`<span class="text-emerald-400 font-bold">Ngũ Hành Tương Khắc!</span> Thuộc tính [${attackerElement}] khắc chế [${defenderElement}], tăng 30% sát thương!`);
            return 1.30;
        }

        if (counterMap[defenderElement] === attackerElement) {
            this.addLog(`<span class="text-orange-400">Ngũ Hành Bị Khắc!</span> Thuộc tính [${attackerElement}] bị [${defenderElement}] khắc chế, giảm 20% sát thương!`);
            return 0.80;
        }

        return 1.0;
    }

    start() {
        if (this.ambushType === 'player') {
            this.addLog(`<span class="text-red-500 font-bold">TẬP KÍCH THÀNH CÔNG!</span> Ngươi giành được tiên cơ, lần công kích đầu tiên tăng mạnh bạo kích.`);
            this.turn = 0;
            this.playerAmbushBonus = true;
        } else if (this.ambushType === 'enemy') {
            this.addLog(`<span class="text-red-600 font-bold">BỊ TẬP KÍCH!</span> Đối phương xuất hiện bất ngờ, ngươi rơi vào thế bị động.`);
            this.turn = 1;
        } else {
            this.addLog(`Khởi động cuộc chiến với ${this.enemy.name}!`);
            this.turn = this.turnOrder[0].id === 'player' ? 0 : 1;
        }
        this.nextTurn();
    }

    addLog(msg) {
        this.log.push(msg);
        if (this.log.length > 8) this.log.shift();
        this.onUpdate('log');
    }

    nextTurn() {
        if (!this.isActive) return;
        this.processTurnStatus();
        if (!this.isActive) return;
        
        this.onUpdate('turn', { turn: this.turn });

        if (this.turn === 1) {
            this.enemyTurn();
        } else {
            // [SONG TU BENEFIT & BACKLASH]
            if (this.player.mainDualId) {
                // Yin-Yang balance mana recovery: +5% max mana
                const dualManaRegen = Math.floor(this.player.maxMana * 0.05);
                if (dualManaRegen > 0) {
                    this.player.mana = Math.min(this.player.maxMana, this.player.mana + dualManaRegen);
                    this.addLog(`☯️ [Song Tu] Huyết mạch âm dương hòa hợp, hồi phục +${dualManaRegen} linh lực!`);
                }
                
                // Low-stability backlash check (< 30%)
                if (this.player.stability < 30) {
                    if (Math.random() < 0.02) { // 2% chance per player turn start
                        const backlashDmg = Math.floor(this.player.maxHp * 0.10);
                        this.player.hp = Math.max(1, this.player.hp - backlashDmg);
                        this.status.player.instability = Math.max(this.status.player.instability || 0, 3); // 3 turns of stat reductions
                        this.addLog(`🔴 <span class="text-red-500 font-bold">TẨU HỎA NHẬP MA!</span> Linh lực song tu phản phệ khiến đạo tâm điên đảo, chịu ${backlashDmg} sát thương và giảm 30% chiến lực trong 3 lượt!`);
                        this.onUpdate('damage', { target: 'player', value: backlashDmg, crit: true, actionType: 'backlash' });
                        if (this.player.hp <= 1 && this.player.hp > 0) {
                            this.player.hp = 0;
                            this.lose();
                            return;
                        }
                    }
                }
            }

            // Check for Chanting
            if (this.playerChanting) {
                this.playerChanting.turns--;
                this.addLog(`Đang tích tụ linh lực cho <span class="text-cultivation-gold">${this.playerChanting.name}</span>... (Còn ${this.playerChanting.turns} lượt)`);
                
                if (this.playerChanting.turns <= 0) {
                    this.executeChanting();
                } else {
                    setTimeout(() => {
                        this.turn = 1;
                        this.nextTurn();
                    }, 1500);
                }
                return;
            }

            if (this.status.player.stun > 0) {
                this.status.player.stun--;
                this.addLog("Ngươi đang bị <span class='text-yellow-500'>CHOÁNG</span>, không thể hành động!");
                setTimeout(() => {
                    this.turn = 1;
                    this.nextTurn();
                }, 1000);
            } else {
                this.onUpdate('player-turn-start');
            }
        }
    }

    executeChanting() {
        const chant = this.playerChanting;
        this.playerChanting = null;
        this.addLog(`<span class="text-cultivation-gold font-bold">NIỆM CHÚ HOÀN TẤT!</span> Ngươi thi triển ${chant.name}!`);
        
        if (chant.type === 'secret') {
            this.playerSecretTechnique(chant.payload, true); // true to skip checks
        } else if (chant.type === 'skill') {
            this.playerSkill(true);
        }
    }

    enemyTurn() {
        if (!this.isActive) return;

        // 1. Check for escape if HP is very low (< 15%)
        if (this.enemy.hp < this.enemy.maxHp * 0.15 && Math.random() < 0.6) {
            this.enemyEscape();
            return;
        }

        // 2. Check for healing pills if HP is low (< 30%)
        if (this.enemy.hp < this.enemy.maxHp * 0.3) {
            const pillIndex = (this.enemy.inventory || []).findIndex(i => {
                const data = getItemById(i.id);
                return data?.type === 'dan_duoc' && data.effect?.type === 'heal';
            });
            if (pillIndex !== -1 && Math.random() < 0.7) {
                const pill = this.enemy.inventory[pillIndex];
                const data = getItemById(pill.id);
                const heal = Math.floor(this.enemy.maxHp * (data.effect.value || 0.2));
                this.enemy.hp = Math.min(this.enemy.maxHp, this.enemy.hp + heal);
                this.addLog(`${this.enemy.name} uống một viên <span class="text-green-400">${data.name}</span>, thương thế khép lại!`);
                pill.quantity--;
                if (pill.quantity <= 0) this.enemy.inventory.splice(pillIndex, 1);

                setTimeout(() => {
                    this.turn = 0;
                    this.nextTurn();
                }, 1500);
                return;
            }
        }

        // 3. Check for offensive items (Talismans)
        const offensiveItemIndex = (this.enemy.inventory || []).findIndex(i => {
            const data = getItemById(i.id);
            return data?.type === 'talisman' && (data.effect?.type === 'damage' || data.effect?.stat === 'def');
        });
        if (offensiveItemIndex !== -1 && Math.random() < 0.3) {
            this.enemyUseItem(offensiveItemIndex);
            return;
        }

        // 4. Decide between Skill or Normal Attack
        const usableSkills = (this.enemy.skills || []).filter(s => s !== 'BASIC_ATTACK');
        if (usableSkills.length > 0 && Math.random() < 0.4 && (this.enemy.mana || 0) >= 20) {
            const skill = usableSkills[Math.floor(Math.random() * usableSkills.length)];
            setTimeout(() => this.enemyUseSkill(skill), 1000);
        } else {
            setTimeout(() => this.enemyAttack(), 1000);
        }
    }

    enemyUseSkill(skillId) {
        if (!this.isActive) return;

        this.enemy.mana -= 20;
        let damage = Math.floor(this.enemy.atk * 1.5);
        let msg = "";

        switch (skillId) {
            case 'QI_BURST':
                msg = `${this.enemy.name} bộc phát linh lực toàn thân, oanh kích về phía ngươi!`;
                damage = Math.floor(this.enemy.atk * 1.8);
                break;
            case 'HEAL_TECHNIQUE': {
                const heal = Math.floor(this.enemy.maxHp * 0.25);
                this.enemy.hp = Math.min(this.enemy.maxHp, this.enemy.hp + heal);
                msg = `${this.enemy.name} thi triển mật thuật trị thương, khí sắc khôi phục!`;
                damage = 0;
                break;
            }
            default:
                msg = `${this.enemy.name} thi triển kỹ năng đặc thù!`;
        }

        if (damage > 0) {
            const dr = this.player.advancedStats.damageReduction || 0;
            let allRes = this.player.advancedStats.allRes || 0;
            if (this.player.mainDualId) {
                allRes += 0.10; // Song Tu Yin-Yang balance boost
            }
            const finalDmg = Math.max(1, Math.floor((damage - Math.floor(this.player.def / 2)) * (1 - dr) * (1 - allRes)));
            this.player.hp -= finalDmg;
            this.addLog(msg + ` Gây ${finalDmg} sát thương.`);
            this.onUpdate('damage', { target: 'player', value: finalDmg, crit: true, actionType: 'skill', skillId: skillId });
        } else {
            this.addLog(msg);
        }

        if (this.player.hp <= 0) {
            this.player.hp = 0;
            this.lose();
        } else {
            this.turn = 0;
            this.nextTurn();
        }
    }

    enemyUseItem(index) {
        if (!this.isActive) return;
        const item = this.enemy.inventory[index];
        const data = getItemById(item.id);

        if (!data) return;

        if (data.effect?.type === 'damage') {
            const dmg = data.effect.value || 100;
            this.player.hp -= dmg;
            this.addLog(`${this.enemy.name} kích hoạt <span class="text-orange-500">${data.name}</span>, oanh tạc gây ${dmg} sát thương!`);
            this.onUpdate('damage', { target: 'player', value: dmg, crit: true, actionType: 'talisman' });
        } else if (data.effect?.type === 'buff' && data.effect.stat === 'def') {
            this.enemy.def += (data.effect.value || 50);
            this.addLog(`${this.enemy.name} sử dụng ${data.name}, phòng ngự tăng mạnh!`);
        }

        item.quantity--;
        if (item.quantity <= 0) this.enemy.inventory.splice(index, 1);

        if (this.player.hp <= 0) {
            this.player.hp = 0;
            this.lose();
        } else {
            setTimeout(() => {
                this.turn = 0;
                this.nextTurn();
            }, 1000);
        }
    }

    enemyEscape() {
        this.addLog(`<span class="text-yellow-400">${this.enemy.name} cảm thấy bất ổn, đang tìm cách thoát thân!</span>`);
        this.isActive = false;
        this.onUpdate('enemy-escape-attempt');
        // Safety fallback: if chase overlay is never interacted with, end combat after 60s
        this._escapeTimeout = setTimeout(() => {
            if (!this.isActive) {
                this.onEnd?.('escape');
            }
        }, 60000);
    }

    chaseEnemy() {
        // Clear the safety fallback timeout since the player has interacted
        if (this._escapeTimeout) {
            clearTimeout(this._escapeTimeout);
            this._escapeTimeout = null;
        }

        const playerSpd = this.player.spd;
        const enemySpd = this.enemy.spd;

        let flightBonus = 0;
        if (this.player.equipment.flightArtifact) {
            const artifact = getItemById(this.player.equipment.flightArtifact);
            flightBonus = artifact?.stats?.spd || 20;
        }

        let successChance = 0.4 + ((playerSpd + flightBonus - enemySpd) / 100);
        if (isNaN(successChance)) successChance = 0.4;
        successChance = Math.max(0.1, Math.min(0.9, successChance));
        
        const success = Math.random() < successChance;

        if (success) {
            this.isActive = true;
            this.addLog("<span class='text-qi-blue'>Ngươi dồn lực vào đôi chân, thành công đuổi kịp kẻ địch!</span>");
            this.turn = 0; // Player gets to move
            this.nextTurn();
            return true;
        } else {
            this.addLog("<span class='text-gray-500'>Đối phương tốc độ quá nhanh, chớp mắt đã biến mất tận chân trời...</span>");
            setTimeout(() => this.onEnd('escape'), 1500);
            return false;
        }
    }

    processTurnStatus() {
        const now = Date.now();

        // Passive Thần Thức regeneration per turn
        if (this.turn === 0) {
            const recovery = 2 + Math.floor((this.player.maxThanThuc || 50) * 0.02);
            this.player.thanThuc = Math.min(this.player.maxThanThuc || 50, (this.player.thanThuc || 0) + recovery);
        } else if (this.turn === 1 && this.enemy) {
            const recovery = 2 + Math.floor((this.enemy.maxThanThuc || 50) * 0.02);
            this.enemy.thanThuc = Math.min(this.enemy.maxThanThuc || 50, (this.enemy.thanThuc || 0) + recovery);
        }

        // 1. Tick down enemy standard burn
        if (this.status.enemy.burn > 0 && this.enemy.hp > 0) {
            const burnDmg = Math.max(1, Math.floor(this.status.enemy.burnPower));
            this.enemy.hp -= burnDmg;
            this.status.enemy.burn--;
            this.addLog(`${this.enemy.name} bị Dị Hỏa thiêu đốt: -${burnDmg} HP.`);
            this.onUpdate('damage', { target: 'enemy', value: burnDmg, crit: false, actionType: 'burn' });
            if (this.enemy.hp <= 0) {
                this.enemy.hp = 0;
                this.win();
                return;
            }
        }

        const isPersistentStatus = (b) => {
            if (!b) return false;
            const cat = (b.category || '').toLowerCase();
            const id = (b.id || '').toLowerCase();
            return cat === 'poison' || cat === 'burn' || 
                   id.includes('doc') || id.includes('hoa') || 
                   id.includes('phe') || id.includes('tre') ||
                   id === 'moc_doc' || id === 'hoa_doc' || id === 'han_doc' || id === 'loi_phe' || id === 'tho_tre';
        };

        // 2. Tick down Player's persistent status effects (1 combat turn = 15 seconds)
        if (this.turn === 0 && this.player.buffs && this.player.buffs.length > 0) {
            this.player.buffs.forEach(b => {
                const isPersistent = isPersistentStatus(b);
                if (!isPersistent && b.duration !== undefined && b.duration !== null && b.duration !== Infinity) {
                    b.duration = Math.max(0, b.duration - 15);
                    b.endTime = now + b.duration * 1000;
                }

                // Process HP/Mana DOTs in combat
                if (b.effects) {
                    const stacks = b.stacks || 1;
                    if (b.effects.dot_hp) {
                        const hpLoss = Math.floor(Math.abs(b.effects.dot_hp) * this.player.maxHp * 15 * stacks);
                        this.player.hp = Math.max(1, this.player.hp - hpLoss);
                        this.addLog(`⚠️ Trạng thái [${b.name}] ăn mòn khí huyết: Bản thân mất -${hpLoss} HP!`);
                        this.onUpdate('damage', { target: 'player', value: hpLoss, crit: false, actionType: 'dot' });
                    }
                    if (b.effects.dot_mana) {
                        const manaLoss = Math.floor(Math.abs(b.effects.dot_mana) * this.player.maxMana * 15 * stacks);
                        this.player.mana = Math.max(0, this.player.mana - manaLoss);
                        const label = this.player.getEnergyLabel ? this.player.getEnergyLabel() : 'Linh Lực';
                        this.addLog(`🧪 Trạng thái [${b.name}] tiêu hao pháp lực: Bản thân mất -${manaLoss} ${label}!`);
                    }
                    if (b.effects.burn_lifespan) {
                        const ageInc = b.effects.burn_lifespan * 15 * stacks;
                        this.player.age = Math.min(this.player.maxAge || 200, this.player.age + ageInc);
                    }
                }
            });

            const countBefore = this.player.buffs.length;
            this.player.buffs = this.player.buffs.filter(b => {
                const isPersistent = isPersistentStatus(b);
                if (isPersistent) return true;
                if (b.duration !== undefined) {
                    return b.duration > 0 || b.duration === Infinity;
                }
                return b.endTime > now;
            });

            if (this.player.buffs.length !== countBefore) {
                this.player.calculateStats();
            }
        }

        // 3. Tick down Enemy's temporary status effects in combat
        if (this.turn === 1 && this.enemy.buffs && this.enemy.buffs.length > 0) {
            this.enemy.buffs.forEach(b => {
                const isPersistent = isPersistentStatus(b);
                if (!isPersistent && b.duration !== undefined && b.duration !== null && b.duration !== Infinity) {
                    b.duration = Math.max(0, b.duration - 15);
                }

                // Process HP DOTs on Enemy
                if (b.effects && b.effects.dot_hp && this.enemy.hp > 0) {
                    const stacks = b.stacks || 1;
                    const hpLoss = Math.max(1, Math.floor(Math.abs(b.effects.dot_hp) * this.enemy.maxHp * 15 * stacks));
                    this.enemy.hp = Math.max(0, this.enemy.hp - hpLoss);
                    this.addLog(`💥 ${this.enemy.name} chịu ảnh hưởng từ [${b.name}]: mất -${hpLoss} HP.`);
                    this.onUpdate('damage', { target: 'enemy', value: hpLoss, crit: false, actionType: 'dot' });
                    
                    if (this.enemy.hp <= 0) {
                        this.enemy.hp = 0;
                        this.win();
                        return;
                    }
                }
            });

            this.enemy.buffs = this.enemy.buffs.filter(b => {
                const isPersistent = isPersistentStatus(b);
                if (isPersistent) return true;
                return b.duration > 0 || b.duration === Infinity;
            });
        }

        // Tick down player instability (backlash or secret side-effects)
        if (this.status.player.instability > 0) {
            this.status.player.instability--;
            if (this.status.player.instability === 0) {
                this.addLog(`✨ Linh khí bình ổn, trạng thái chấn thương tẩu hỏa đã tiêu tán.`);
            }
        }

        // --- Module 1: THIỀN ĐỊNH THẾ Mana Regen per turn ---
        if (this.playerStance === 'DINH' && this.turn === 0) {
            const manaRegen = Math.floor(this.player.maxMana * (COMBAT_STANCES.DINH.manaRegen || 0.05));
            this.player.mana = Math.min(this.player.maxMana, this.player.mana + manaRegen);
            const label = this.player.getEnergyLabel ? this.player.getEnergyLabel() : 'Linh Lực';
            this.addLog(`🧘 [Thiền Định Thế] Nội tâm bình lặng, ${label} hồi +${manaRegen}.`);
        }

        // --- Module 2: Tâm Ma Bạo Phát check (Module 3 mechanic triggered here) ---
        if (this.turn === 0 && this.combatHeartDemon > 50 && this.playerStance !== 'DINH') {
            const hd = this.combatHeartDemon;
            
            // 20% Thần Thức Hỗn Loạn (choáng lượt) when > 50
            if (Math.random() < 0.20) {
                this.addLog(`⚠️ <span class="text-purple-400 font-ancient font-bold">THẦN THỨC HỖN LOẠN!</span> Tâm ma quấy nhiễu, thần hồn hoảng hốt, ngươi đứng yên không thể hành động!`);
                this.onUpdate('combat-event', { id: 'TAM_MA_BAO_PHAT', name: 'Thần Thức Hỗn Loạn', icon: '🧠', color: '#a855f7' });
                this.endPlayerTurn();
                return;
            }

            if (hd > 70 && hd <= 90) {
                // 25% Pháp Lực Rối Loạn (tiêu hao 15% maxMana)
                if (Math.random() < 0.25) {
                    const manaLoss = Math.floor(this.player.maxMana * 0.15);
                    this.player.mana = Math.max(0, this.player.mana - manaLoss);
                    const label = this.player.getEnergyLabel ? this.player.getEnergyLabel() : 'linh lực';
                    this.addLog(`⚠️ <span class="text-amber-500 font-ancient font-bold">PHÁP LỰC RỐI LOẠN!</span> Tâm ma phản phệ, linh khí hỗn loạn tiêu tán mất -${manaLoss} ${label}!`);
                    this.onUpdate('combat-event', { id: 'TAM_MA_BAO_PHAT', name: 'Pháp Lực Rối Loạn', icon: '🌀', color: '#d97706' });
                    this.onUpdate('damage', { target: 'player', value: 0, crit: false, actionType: 'dot' });
                }
            } else if (hd > 90) {
                // > 90: 20% Tẩu Hỏa Nhập Ma (5% maxHP self-damage + instability status for 2 turns)
                if (Math.random() < 0.20) {
                    const selfDmg = Math.floor(this.player.maxHp * 0.05);
                    this.player.hp = Math.max(1, this.player.hp - selfDmg);
                    this.status.player.instability = Math.max(this.status.player.instability, 2);
                    this.addLog(`⚠️ <span class="text-red-600 font-ancient font-bold">TẨU HỎA NHẬP MA!</span> Tâm ma xâm lấn hoàn toàn, kinh mạch nghịch chuyển tự thương, nhận -${selfDmg} HP và rơi vào trạng thái linh khí bất ổn!`);
                    this.onUpdate('combat-event', { id: 'TAM_MA_BAO_PHAT', name: 'Tẩu Hỏa Nhập Ma', icon: '👹', color: '#dc2626' });
                    this.onUpdate('damage', { target: 'player', value: selfDmg, crit: false, actionType: 'tam_ma' });
                    this.endPlayerTurn();
                    return;
                }
            }
        }

        // --- Module 2: Thiên Địa Dị Biến check every turn ---
        this.checkCombatEvents();
    }

    // Actions
    doAction(type, payload = null) {
        if (this.turn !== 0 || !this.isActive) return;

        this.playerDefending = false;

        switch (type) {
            case 'attack':
                this.playerAttack();
                break;
            case 'defend':
                this.playerDefend();
                break;
            case 'skill':
                this.playerSkill();
                break;
            case 'secret':
                this.playerSecretTechnique(payload);
                break;
            case 'flame':
                this.playerFlameAttack();
                break;
            case 'potion':
                this.playerUsePotion();
                break;
            case 'talisman':
                this.playerUseTalisman();
                break;
            case 'beast':
                this.playerSummonBeast();
                break;
            case 'formation':
                this.playerActivateFormation();
                break;
            case 'puppet':
                this.playerSummonPuppet();
                break;
            case 'corpse':
                this.playerSummonCorpse();
                break;
            case 'insect':
                this.playerSummonInsect();
                break;
            case 'escape':
                this.playerEscape();
                break;
            case 'linh_thach':
                this.playerCrushStone();
                break;
            case 'sword-intent':
                this.playerSwordIntent();
                break;
            case 'soul-repress':
                this.playerSoulRepress();
                break;
            case 'stance':
                this.playerSetStance(payload);
                break;
            case 'meditate':
                this.playerMeditate();
                break;
            case 'artifact':
                this.playerArtifactAttack();
                break;
        }
    }

    endPlayerTurn() {
        if (this.enemy.hp <= 0) {
            this.enemy.hp = 0;
            this.win();
        } else {
            this.turn = 1;
            this.nextTurn();
        }
    }

    playerAttack() {
        this.triggerArtifacts('attack');

        const suppression = this.calculateRealmSuppression(this.player, this.enemy);
        const racialBonus = this.calculateRacialSuppression(this.player, this.enemy);
        
        // Environment bonus
        let envBonus = 1.0;
        if (this.environment === 'FIRE' && this.player.specializedPaths?.fire?.realmId > 0) envBonus = 1.2;
        if (this.environment === 'DEMON_QI' && this.player.race === 'DEMON') envBonus = 1.15;

        // Get elements and apply countered multiplier
        let playerElement = 'Neutral';
        if (this.player.mainTechniqueId) {
            const techData = getTechniqueById(this.player.mainTechniqueId) || (this.player.customTechniques || []).find(t => t.id === this.player.mainTechniqueId);
            if (techData && techData.element) {
                playerElement = techData.element;
            }
        }
        const enemyElement = this.enemy.element || 'Neutral';
        const elementalMult = this.getElementalMultiplier(playerElement, enemyElement);

        const pierce = this.player.advancedStats.pierce || 0;
        const effectiveEnemyDef = Math.max(1, Math.floor(this.enemy.def * this.getEnemyMultiplier('def') * (1 - pierce)));
        
        const eDr = this.enemy.advancedStats?.damageReduction || 0;
        const eAllRes = this.enemy.advancedStats?.allRes || 0;
        // --- Module 1: Chiến Thế ATK multiplier ---
        const stanceConfig = COMBAT_STANCES[this.playerStance] || COMBAT_STANCES.NONE;
        const stanceAtkMult = stanceConfig.atkMult || 1.0;

        let damage = Math.max(1, Math.floor((this.player.atk - Math.floor(effectiveEnemyDef / 2)) * suppression * racialBonus * envBonus * elementalMult * (1 - eDr) * (1 - eAllRes) * stanceAtkMult));

        // Instability debuff reduces physical attack damage by 30%
        if (this.status.player.instability > 0) {
            damage = Math.floor(damage * 0.7);
        }

        // --- Module 2: Sát Khí Tụ Tập event bonus (+10%) ---
        if (this.activeCombatEvents.has('SAT_KHI_TU_TAP')) {
            damage = Math.floor(damage * 1.1);
        }

        // Divine Sense (Perception) Accuracy/Crit
        const pSense = this.player.advancedStats?.perception || 10;
        const eSense = this.enemy.perception || 10;
        const hitChance = 0.85 + (pSense - eSense) * 0.005;
        
        if (Math.random() > hitChance) {
            this.addLog(`<span class="text-gray-500">Hụt!</span> Đối phương ảo ảnh chớp nhoáng, né tránh đòn đánh.`);
            this.onUpdate('damage', { target: 'enemy', value: 0, crit: false, actionType: 'miss' });
            this.endPlayerTurn();
            return;
        }

        let weaknessChance = this.player.advancedStats.weaknessStrikeChance || this.player.advancedStats.critRate || 0.05;
        weaknessChance += (pSense - eSense) * 0.002; // Divine sense helps finding weak points

        let fatalChance = this.player.advancedStats.fatalStrikeChance || 0.02;
        fatalChance += (pSense - eSense) * 0.001; // Divine sense also helps fatal strike

        if (this.ambushType === 'player' || this.playerAmbushBonus) {
            fatalChance += 0.30;
            weaknessChance += 0.40;
            this.playerAmbushBonus = false;
        }

        const isFatal = Math.random() < fatalChance;
        const isWeakness = !isFatal && (Math.random() < weaknessChance);

        let finalDamage = damage;
        let logMsg = '';
        let isCritReport = false;

        if (isFatal) {
            finalDamage = Math.floor(damage * 3.0);
            logMsg = `⚡☠️ <span class="text-purple-500 font-ancient font-extrabold uppercase animate-pulse">CHÍ TỬ KÍCH!</span> Đòn đánh cắn ngập vào mạch máu/yết hầu kẻ địch, gây cực hạn <span class="text-purple-400 font-bold">${finalDamage}</span> sát thương!`;
            isCritReport = true;
        } else if (isWeakness) {
            const weaknessMult = this.player.advancedStats.critDmg || 1.8;
            finalDamage = Math.floor(damage * weaknessMult);
            logMsg = `💥 <span class="text-amber-400 font-bold">SƠ HỞ KÍCH!</span> Ngươi bắt được sơ hở trong phòng thủ, gây <span class="text-amber-300 font-bold">${finalDamage}</span> sát thương!`;
            isCritReport = true;
        } else {
            const verb = this.getAttackVerb(this.player.race);
            logMsg = `Ngươi ${verb}, gây <span class="text-white">${finalDamage}</span> sát thương.`;
        }

        this.enemy.hp -= finalDamage;
        this.addLog(logMsg);
        this.onUpdate('damage', { target: 'enemy', value: finalDamage, crit: isCritReport, actionType: 'attack' });

        this.applyCombatStatusEffects(this.player, this.enemy, true, finalDamage, isWeakness || isFatal);

        this.handlePartyAssistance(finalDamage);
        this.endPlayerTurn();
    }

    playerSwordIntent() {
        // --- Module 1: SAT stance mana discount ---
        const stanceConf = COMBAT_STANCES[this.playerStance] || COMBAT_STANCES.NONE;
        const costMana = Math.floor(40 * (stanceConf.manaCostMult || 1.0));
        if (this.player.mana < costMana) {
            this.addLog("Linh lực không đủ để ngưng tụ Kiếm Ý!");
            return;
        }
        this.player.mana -= costMana;
        
        this.addLog("<span class='text-qi-blue font-ancient'>Kiếm Ý xung thiên!</span> Ngươi nhân kiếm hợp nhất, chém ra một kiếm tuyệt diệt.");
        
        const suppression = this.calculateRealmSuppression(this.player, this.enemy);
        // --- Module 1: SAT stance sword-intent bonus (+15%) for sword path ---
        let swordIntentMult = 2.5;
        if (this.playerStance === 'SAT' && (this.player.specializedPaths?.sword?.realmId || 0) > 0) {
            swordIntentMult = 2.5 * (1 + (COMBAT_STANCES.SAT.pathBonus?.bonus?.swordIntentDmg || 0));
        }
        const damage = Math.floor(this.player.atk * swordIntentMult * suppression);
        
        // Sword Intent ignores 80% defense
        const effectiveEnemyDef = Math.floor(this.enemy.def * 0.2); 
        
        // Kiếm Ý true damage scales with sword specialized path level
        const swordRealm = this.player.specializedPaths?.sword?.realmId || 0;
        const trueDmg = swordRealm * 15;
        const finalDmg = Math.max(1, damage - effectiveEnemyDef) + trueDmg;
        
        this.enemy.hp -= finalDmg;
        if (trueDmg > 0) {
            this.addLog(`Kiếm quang xé rách hư không, gây <span class="text-red-500 font-bold">${finalDmg}</span> sát thương (chứa ${trueDmg} sát thương thực từ Kiếm Ý)!`);
        } else {
            this.addLog(`Kiếm quang xé rách hư không, gây <span class="text-red-500 font-bold">${finalDmg}</span> sát thương!`);
        }
        this.onUpdate('damage', { target: 'enemy', value: finalDmg, crit: true, actionType: 'sword-intent' });
        
        this.endPlayerTurn();
    }

    playerDodge() {
        this.playerDodging = true;
        this.addLog("Ngươi triển khai thân pháp ảo ảnh, tăng khả năng né tránh lượt tới.");
        this.turn = 1;
        this.nextTurn();
    }

    getAttackVerb(race) {
        const verbs = {
            'HUMAN': 'vung kiếm tấn công',
            'SPIRIT_BEAST': 'tung trảo vồ tới',
            'DEMON': 'oanh tạc ma quang',
            'DRAGON': 'phun ra long tức',
            'BUDDHIST': 'đánh ra phật chưởng'
        };
        return verbs[race] || 'tấn công';
    }

    handlePartyAssistance(finalDamage) {
        if (this.player.party && this.player.party.length > 0) {
            this.player.party.forEach(npc => {
                const npcDamage = Math.max(1, Math.floor(npc.atk * 0.4) - Math.floor(this.enemy.def / 4));
                this.enemy.hp -= npcDamage;
                this.addLog(`${npc.name} (${npc.role}) hỗ trợ gây ${npcDamage} sát thương.`);
                this.onUpdate('damage', { target: 'enemy', value: npcDamage, crit: false, actionType: 'party' });
            });

            const bonus = Math.floor(finalDamage * 0.1 * this.player.party.length);
            this.enemy.hp -= bonus;
            this.addLog(`Liên kích tổ đội bộc phát thêm ${bonus} sát thương!`);
        }
    }

    playerDefend() {
        this.playerDefending = true;
        this.addLog("Ngươi vận chuyển chân khí, hình thành hộ thân linh giáp.");
        
        // Buddhist Path bonus: +10% max HP shield and light heal when defending
        const buddhistRealm = this.player.specializedPaths?.buddhist?.realmId || 0;
        if (buddhistRealm > 0) {
            const shieldAmt = Math.floor(this.player.maxHp * 0.1 * buddhistRealm);
            const healAmt = Math.floor(this.player.maxHp * 0.05 * buddhistRealm);
            
            this.status.player.shield = (this.status.player.shield || 0) + shieldAmt;
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmt);
            
            this.addLog(`☸️ [Phật Tu] Hộ Thể Kim Quang kích hoạt: Nhận +${shieldAmt} Giáp Hộ Thân và hồi phục +${healAmt} khí huyết!`);
        }

        this.turn = 1;
        this.nextTurn();
    }

    playerSoulRepress() {
        const costThanThuc = 25;
        if ((this.player.thanThuc || 0) < costThanThuc) {
            this.addLog("Thần Thức không đủ để thi triển Thần Thức Trấn Áp!");
            return;
        }
        this.player.thanThuc = Math.max(0, (this.player.thanThuc || 0) - costThanThuc);

        this.addLog("<span class='text-qi-purple font-ancient'>Thần Thức Trấn Áp!</span> Ngươi giải phóng thần hải hồn lực khổng lồ oanh tạc thần hồn đối phương (tiêu hao -25 Thần Thức).");

        const suppression = this.calculateRealmSuppression(this.player, this.enemy);
        
        // Soul Damage scales with maxThanThuc (Divine Sense capacity) and Soul Realm level
        const maxThanThuc = this.player.maxThanThuc || 50;
        const soulRealm = this.player.specializedPaths?.soul_path?.realmId || 1;
        
        let damage = Math.floor((maxThanThuc * 1.5 + soulRealm * 35) * suppression);
        const finalDmg = Math.max(1, damage);

        this.enemy.hp -= finalDmg;
        this.addLog(`Thần hồn đối phương rung động dữ dội, chịu <span class="text-purple-400 font-bold">${finalDmg}</span> hồn thương!`);
        this.onUpdate('damage', { target: 'enemy', value: finalDmg, crit: false, actionType: 'soul-repress' });

        // Chance to stun: 30% + (Thần Thức chênh lệch * 0.5%)
        const eMaxThanThuc = this.enemy.maxThanThuc || 50;
        const stunChance = 0.3 + (maxThanThuc - eMaxThanThuc) * 0.005;
        if (Math.random() < stunChance) {
            this.status.enemy.stun = Math.max(this.status.enemy.stun || 0, 1);
            this.addLog(`<span class="text-yellow-400 font-bold">CHOÁNG VÁNG!</span> Thần hồn đối phương bị đánh trúng, lâm vào trạng thái ngốc trệ.`);
        }

        this.endPlayerTurn();
    }

    playerEscape() {
        if (this.turn !== 0 || !this.isActive) return;

        const playerSpd = this.player.spd;
        const enemySpd = this.enemy.spd;

        // --- Check Độn Thuật slot (new system) ---
        let escapeChanceBonus = 0;
        let donThuatName = null;
        let donThuatFlavor = null;

        const escapeTechId = this.player.mainEscapeId;
        if (escapeTechId) {
            const escapeTechData = typeof getTechniqueById === 'function' ? getTechniqueById(escapeTechId) : null;
            const learnedEscape = this.player.learnedTechniques?.find(t => t.id === escapeTechId);
            if (escapeTechData && learnedEscape) {
                const masteryBonus = escapeTechData.masteryBonuses?.[learnedEscape.masteryLevel || 1] || {};
                escapeChanceBonus = masteryBonus.escapeChanceBonus ?? escapeTechData.effects?.escapeChanceBonus ?? 0;
                donThuatName = escapeTechData.name;

                if (escapeTechId === 'loi_don_thuat') {
                    donThuatFlavor = `<span class='text-yellow-300'>⚡ Ngươi hóa thân thành một đạo lôi quang, chớp mắt đã biến mất khỏi tầm mắt đối thủ!</span>`;
                } else if (escapeTechId === 'la_yen_bo') {
                    donThuatFlavor = `<span class='text-cyan-300'>🌫️ Thân pháp La Yên Bộ kích hoạt, người ngươi tan hòa vào làn khói mờ ảo!</span>`;
                } else {
                    donThuatFlavor = `<span class='text-qi-blue'>🏃 Ngươi vận <b>${donThuatName}</b> toàn lực, thoát ly vòng vây!</span>`;
                }
            }
        }

        // --- Check old escape secret techniques ---
        const equippedSecrets = (this.player.equippedSecretTechniqueIds || []).filter(Boolean);
        const hasEscapeSecret = equippedSecrets.some(id => {
            const data = getSecretTechniqueById(id);
            const now = Date.now();
            const lastUsed = this.player.secretTechniqueCooldowns[id] || 0;
            const isOffCooldown = (now - lastUsed) >= (data?.cooldown || 0) * 1000;
            return (data?.effects?.type === 'escape' || data?.type === 'escape') && isOffCooldown;
        });

        // --- Escape calculation ---
        // Base: player spd vs enemy spd. Độn Thuật adds flat escape bonus (0–1.0).
        const spdRatio = playerSpd / Math.max(1, enemySpd);
        const baseChance = Math.min(0.9, spdRatio * 0.5); // caps at 90% from speed
        const finalEscapeChance = Math.min(1.0, baseChance + escapeChanceBonus);

        const roll = Math.random();
        const escapeSuccess = roll <= finalEscapeChance || hasEscapeSecret;

        if (escapeSuccess) {
            if (donThuatFlavor) {
                this.addLog(donThuatFlavor);
            } else {
                this.addLog("<span class='text-qi-blue'>Ngươi vận dụng thân pháp cực hạn, thành công thoát khỏi chiến trường!</span>");
            }
            this.isActive = false;
            this.onUpdate('end');
            setTimeout(() => this.onEnd('escape'), 1500);
        } else {
            const failMsg = donThuatName
                ? `<span class='text-red-400'>Thoát thân thất bại! Dù đã vận <b>${donThuatName}</b>, đối phương vẫn truy kịp ngươi!</span>`
                : `<span class='text-red-400'>Thoát thân thất bại! Đối phương tốc độ quá nhanh, khóa chặt mọi đường lui!</span>`;
            this.addLog(failMsg);
            this.onUpdate('escape-fail');
            this.endPlayerTurn();
        }
    }

    playerSkill() {
        const equippedSecrets = this.player.equippedSecretTechniqueIds || [];
        const usableSecret = equippedSecrets.find(id => id);
        if (usableSecret) {
            this.playerSecretTechnique(usableSecret);
            return;
        }

        const manaCost = 10;
        if (this.player.mana < manaCost) {
            this.addLog("Linh lực không đủ để thi triển Linh Thuật!");
            return;
        }
        this.player.mana -= manaCost;

        const damage = Math.floor(this.player.atk * 1.8);
        this.enemy.hp -= damage;
        this.addLog(`Ngươi kết ấn thi triển Linh Thuật, oanh tạc gây ${damage} sát thương!`);
        this.onUpdate('damage', { target: 'enemy', value: damage, crit: true, actionType: 'skill' });

        if (this.enemy.hp <= 0) {
            this.enemy.hp = 0;
            this.win();
        } else {
            this.turn = 1;
            this.nextTurn();
        }
    }

    playerFlameAttack() {
        const flame = getFlameById(this.player.currentFlame || 'linh_hoa');
        if (!flame || flame.type !== 'di_hoa') {
            this.addLog("Ngươi chưa có Dị Hỏa để dẫn động!");
            return;
        }

        const manaCost = 25;
        if (this.player.mana < manaCost) {
            this.addLog("Linh lực cạn kiệt, không thể triệu hoán Dị Hỏa!");
            return;
        }

        this.player.mana -= manaCost;
        const damage = Math.floor(this.player.atk * flame.power * 2.0);
        this.enemy.hp -= damage;
        this.status.enemy.burn = Math.max(this.status.enemy.burn, 3);
        this.status.enemy.burnPower = Math.max(this.status.enemy.burnPower, this.player.atk * 0.3 * flame.power);
        this.addLog(`Ngươi dẫn động <span class="text-orange-500">${flame.name}</span>, hỏa diễm ngập trời gây ${damage} sát thương!`);
        this.addLog(`${this.enemy.name} bị <span class="text-red-500">THIÊU ĐỐT</span> bởi Dị Hỏa!`);
        this.onUpdate('damage', { target: 'enemy', value: damage, crit: true, actionType: 'flame' });

        this.endPlayerTurn();
    }

    playerUsePotion() {
        const potion = this.player.inventory.allItems.find(i => {
            const d = getItemById(i.id);
            return d?.type === 'dan_duoc' && (d.effect?.type === 'heal' || d.effect?.type === 'mana');
        });
        if (!potion) {
            this.addLog("Không có đan dược hồi phục để sử dụng!");
            return;
        }
        const potionName = getItemById(potion.id)?.name || 'đan dược';
        this.player.inventory.useItem(potion.id, 1);
        this.addLog(`Ngươi dùng ${potionName}, điều tức hồi phục.`);
        this.onUpdate('damage', { target: 'player', value: 0, crit: false, actionType: 'potion' }); // Force refresh HP/Mana bars immediately
        this.endPlayerTurn();
    }

    playerUseTalisman() {
        if (!this.player.unlockedProfessions?.includes('talisman')) {
            this.addLog("Chưa lĩnh hội bí pháp Phù Lục, không thể dùng phù trong chiến đấu!");
            return;
        }
        const talisman = this.player.inventory.allItems.find(i => getItemById(i.id)?.type === 'talisman');
        if (!talisman) {
            this.addLog("Không có phù lục khả dụng!");
            return;
        }
        const data = getItemById(talisman.id);
        this.player.inventory.removeItem(talisman.id, 1);
        if (data.effect?.type === 'damage') {
            const dmg = data.effect.value || 120;
            this.enemy.hp -= dmg;
            this.addLog(`Bạn kích hoạt ${data.name}, gây ${dmg} sát thương.`);
            this.onUpdate('damage', { target: 'enemy', value: dmg, crit: true, actionType: 'talisman' });
        } else if (data.effect?.type === 'buff' && data.effect.stat === 'def') {
            this.player.def += data.effect.value || 60;
            this.addLog(`${data.name} bảo hộ thân thể, phòng ngự tăng tạm thời!`);
        } else if (data.effect?.type === 'escape') {
            this.addLog(`Ngươi dùng ${data.name} thoát chiến.`);
            this.isActive = false;
            this.onUpdate('end');
            setTimeout(() => this.onEnd('escape'), 1500);
            return;
        }
        this.endPlayerTurn();
    }

    playerCrushStone() {
        const stone = this.player.inventory.allItems.find(i => getItemById(i.id)?.type === 'linh_thach');
        if (!stone) {
            this.addLog("Không có linh thạch để bóp nát!");
            return;
        }
        
        const res = this.player.crushStone(stone.id, 1);
        if (res.success) {
            this.addLog(`Ngươi bóp nát <span class="text-qi-blue">${getItemById(stone.id).name}</span>, hồi phục ${res.gain} Linh Lực!`);
            this.endPlayerTurn();
        } else {
            this.addLog(res.msg);
        }
    }

    playerSummonBeast() {
        if (!this.player.unlockedProfessions?.includes('beast')) {
            this.addLog("Chưa mở khóa Ngự Thú nên không thể triệu hồi linh thú!");
            return;
        }
        // Tìm linh thú (không phải kỳ trùng)
        const beast = (this.player.beasts || []).find(b => b.type !== 'Kỳ Trùng' && b.type !== 'Linh Trùng');
        if (!beast) {
            this.addLog("Chưa có linh thú chiến đấu để triệu hồi!");
            return;
        }
        const levelBonus = (beast.level || 1) * 5;
        const beastAtk = beast.stats?.atk || 50;
        const dmg = Math.max(1, Math.floor(beastAtk * 0.8 + levelBonus + (this.player.beastLevel || 1) * 10));
        
        this.enemy.hp -= dmg;
        this.addLog(`Linh thú <span class="text-green-400">${beast.name}</span> (Cấp ${beast.level}) xuất chiến, gây ${dmg} sát thương!`);
        this.onUpdate('damage', { target: 'enemy', value: dmg, crit: false, actionType: 'beast' });
        this.endPlayerTurn();
    }

    playerActivateFormation() {
        if (!this.player.unlockedProfessions?.includes('formation')) {
            this.addLog("Chưa lĩnh hội Trận Đạo, không thể triển khai trận pháp!");
            return;
        }
        const cost = 15;
        if (this.player.mana < cost) {
            this.addLog("Không đủ linh lực để khởi động trận pháp!");
            return;
        }
        this.player.mana -= cost;
        const levelBonus = (this.player.formationLevel || 1) * 20;
        const dmg = Math.max(1, Math.floor(this.player.atk * 1.2 + levelBonus));
        this.enemy.hp -= dmg;
        this.addLog(`Bạn bố trí trận pháp áp chế chiến trường, gây ${dmg} sát thương.`);
        this.onUpdate('damage', { target: 'enemy', value: dmg, crit: false, actionType: 'formation' });
        this.endPlayerTurn();
    }

    playerSummonPuppet() {
        if (!this.player.unlockedProfessions?.includes('puppet')) {
            this.addLog("Chưa mở khóa Khôi Lỗi Thuật!");
            return;
        }
        const puppet = this.player.inventory.allItems.find(i => i.id === 'khoi_loi');
        if (!puppet) {
            this.addLog("Chưa có khôi lỗi để triệu hồi chiến đấu!");
            return;
        }
        const qualityBonus = puppet.metadata?.quality === QUALITY_TYPES.TIEN_PHAM ? 1.5 : puppet.metadata?.quality === QUALITY_TYPES.HOAN_MY ? 1.3 : 1.0;
        const dmg = Math.max(1, Math.floor(this.player.atk * 0.9 * qualityBonus + (this.player.puppetLevel || 1) * 15));
        this.enemy.hp -= dmg;
        this.addLog(`Khôi lỗi xuất trận, cơ quan liên kích gây ${dmg} sát thương!`);
        this.onUpdate('damage', { target: 'enemy', value: dmg, crit: false, actionType: 'puppet' });
        this.endPlayerTurn();
    }

    playerSummonCorpse() {
        if (!this.player.unlockedProfessions?.includes('corpse') && this.player.mainPath !== 'quy_dao') {
            this.addLog("Chưa mở khóa Luyện Thi Thuật!");
            return;
        }
        const corpse = this.player.refinedCorpses?.[0];
        if (!corpse) {
            this.addLog("Không có thi khôi đã luyện để triệu hồi!");
            return;
        }
        let dmg = Math.max(1, Math.floor((corpse.stats?.atk || this.player.atk * 0.6) * 0.8 + (this.player.corpseLevel || 1) * 12));
        
        if (this.player.mainPath === 'quy_dao') {
            dmg = Math.floor(dmg * 1.3);
            this.addLog(`👻 [Quỷ Đạo] Triệu hồi Thi Khôi cực hạn! Thi khôi ${corpse.name} hung mãnh oanh kích gây ${dmg} sát thương!`);
        } else {
            this.addLog(`Thi khôi ${corpse.name} hung mãnh công kích gây ${dmg} sát thương!`);
        }
        
        this.enemy.hp -= dmg;
        this.onUpdate('damage', { target: 'enemy', value: dmg, crit: false, actionType: 'corpse' });
        if (Math.random() < 0.2) {
            this.status.enemy.stun = Math.max(this.status.enemy.stun, 1);
            this.addLog(`${this.enemy.name} bị thi khí trấn áp, choáng 1 lượt!`);
        }
        this.endPlayerTurn();
    }

    playerSummonInsect() {
        if (!this.player.unlockedProfessions?.includes('insect')) {
            this.addLog("Chưa mở khóa Khu Trùng Thuật!");
            return;
        }
        // Tìm kỳ trùng
        const insect = (this.player.beasts || []).find(b => b.type === 'Kỳ Trùng' || b.type === 'Linh Trùng');
        if (!insect) {
            this.addLog("Chưa có kỳ trùng để điều khiển!");
            return;
        }
        
        const lvl = insect.level || 1;
        const insectAtk = insect.stats?.atk || 40;
        const swarmDmg = Math.max(1, Math.floor(insectAtk * 0.6 + lvl * 15 + (this.player.insectLevel || 1) * 10));
        
        this.enemy.hp -= swarmDmg;
        this.addLog(`Bầy kỳ trùng <span class="text-yellow-500">${insect.name}</span> (Cấp ${insect.level}) cắn xé, gây ${swarmDmg} sát thương!`);
        this.onUpdate('damage', { target: 'enemy', value: swarmDmg, crit: false, actionType: 'insect' });
        
        // Hiệu ứng phụ: Độc (Burn)
        this.status.enemy.burn = Math.max(this.status.enemy.burn, 2);
        this.status.enemy.burnPower = Math.max(this.status.enemy.burnPower, (insect.stats?.atk || 10) * 0.2);
        
        this.endPlayerTurn();
    }

    playerSecretTechnique(secretId, skipChant = false) {
        if (!secretId) return;

        const secretData = getSecretTechniqueById(secretId);
        if (!secretData) return;

        // Verify cultivation realm requirement for Thần Thông (requires Trúc Cơ - realmId >= 4)
        if (secretData.category === 'Thần Thông' && secretData.requiredRealmId) {
            if (this.player.realmId < secretData.requiredRealmId) {
                this.addLog(`<span class="text-red-400 font-bold">Cảnh giới bất túc!</span> Ngươi cần đạt tới ít nhất Trúc Cơ Kỳ mới có thể cưỡng ép thi triển Thần Thông <span class="text-cultivation-gold">${secretData.name}</span>.`);
                return;
            }
        }

        // Check for preparation turns
        let prepTurns = secretData.preparationTurns || 0;
        if (prepTurns > 0 && !skipChant) {
            if (this.combatHeartDemon > 30) {
                prepTurns += 1;
                this.addLog(`⚠️ <span class="text-purple-400 font-ancient">TÂM MA KHẤP KHỞI!</span> Tâm ma quấy nhiễu, thời gian niệm chú tăng thêm 1 lượt!`);
            }
            this.playerChanting = {
                turns: prepTurns,
                maxTurns: prepTurns,
                type: 'secret',
                name: secretData.name,
                payload: secretId
            };
            this.addLog(`Ngươi bắt đầu niệm chú <span class="text-cultivation-gold">${secretData.name}</span>, linh lực cuồn cuộn...`);
            this.endPlayerTurn();
            return;
        }

        const now = Date.now();
        const lastUsed = this.player.secretTechniqueCooldowns[secretId] || 0;
        if (now - lastUsed < secretData.cooldown * 1000) {
            this.addLog(`Bí pháp ${secretData.name} chưa hồi xong!`);
            return;
        }

        const playerSecret = this.player.learnedSecretTechniques.find(s => s.id === secretId);
        const masteryLevel = playerSecret?.masteryLevel || 1;
        const masteryBonus = secretData.masteryBonuses ? secretData.masteryBonuses[masteryLevel] : null;

        // Apply cost
        const costHp = masteryBonus?.costHp || secretData.costs?.hp || 0;
        const costMana = masteryBonus?.costMana || secretData.costs?.mana || 0;
        const costLifespan = (masteryBonus?.lifespanCost !== undefined) ? masteryBonus.lifespanCost : (secretData.costs?.lifespan || 0);

        if (costHp && this.player.hp < this.player.maxHp * (costHp / 100)) {
            this.addLog("Khí huyết không đủ để thi triển bí pháp!");
            return;
        }
        if (costMana && this.player.mana < costMana) {
            this.addLog("Linh lực không đủ để thi triển bí pháp!");
            return;
        }
        if (costLifespan && this.player.age + costLifespan > this.player.maxAge) {
            this.addLog("Thọ nguyên không đủ để thi triển bí pháp này!");
            return;
        }

        if (costHp) this.player.hp -= Math.floor(this.player.maxHp * (costHp / 100));
        if (costMana) this.player.mana -= costMana;
        if (costLifespan) this.player.age += costLifespan;

        this.player.secretTechniqueCooldowns[secretId] = now;

        // Heart demon penalty: if > 90, using a secret technique or thần thông has 30% chance to cause backlash
        if (this.combatHeartDemon > 90 && Math.random() < 0.3) {
            const backlash = Math.floor(this.player.maxHp * 0.15);
            this.player.hp = Math.max(1, this.player.hp - backlash);
            this.addLog(`🚨 <span class="text-red-600 font-ancient font-bold">PHẢN THƯƠNG TÂM MA!</span> Ở trạng thái tột cùng Tâm Ma (>90), ngươi thi triển bí thuật bị phản phệ, chịu -${backlash} HP!`);
            this.onUpdate('damage', { target: 'player', value: backlash, crit: false, actionType: 'backlash' });
        }

        // [CATEGORY SPECIFIC BONUS] Pháp Thuật: 30% chance to refund 30% mana
        if (secretData.category === 'Pháp Thuật' && costMana > 0) {
            if (Math.random() < 0.3) {
                const refund = Math.floor(costMana * 0.3);
                if (refund > 0) {
                    this.player.mana = Math.min(this.player.maxMana, this.player.mana + refund);
                    this.addLog(`⚡ [Pháp Thuật] Pháp lực ngưng tụ cực nhanh, hoàn trả +${refund} linh lực!`);
                }
            }
        }

        // [CATEGORY SPECIFIC BONUS] Bí Pháp: 15% chance of temporary defense reduction (instability debuff for 1 turn)
        if (secretData.category === 'Bí Pháp') {
            if (Math.random() < 0.15) {
                this.status.player.instability = (this.status.player.instability || 0) + 1;
                this.addLog(`⚠️ [Bí Pháp] Thi triển nghịch thiên cấm thuật gây phản phệ chấn động kinh mạch, giảm 30% phòng thủ trong 1 lượt!`);
            }
        }

        // [CATEGORY SPECIFIC BONUS] Thần Hồn Thuật: 20% chance to stun the enemy for 1 turn
        if (secretData.category === 'Thần Hồn Thuật') {
            if (Math.random() < 0.20) {
                this.status.enemy.stun = Math.max(this.status.enemy.stun || 0, 1);
                this.addLog(`🌀 [Thần Hồn Thuật] Thần thức chấn kích thức hải, khiến đối thủ tinh thần hoảng hốt, CHOÁNG 1 lượt!`);
            }
        }

        if (secretData.effects?.type === 'escape' || secretData.type === 'escape') {
            this.addLog(`Ngươi thi triển ${secretData.name} và thoát khỏi trận chiến!`);
            this.isActive = false;
            this.onUpdate('end');
            setTimeout(() => this.onEnd('escape'), 1000);
            return;
        }

        const suppression = this.calculateRealmSuppression(this.player, this.enemy);
        const damageMult = masteryBonus?.damageMult || secretData.effects?.damageMult || 1.0;
        let critRate = masteryBonus?.critRate || secretData.effects?.critRate || 0;

        // [CATEGORY SPECIFIC BONUS] Bí Pháp: +15% crit rate bonus due to unstable burst power
        if (secretData.category === 'Bí Pháp') {
            critRate += 0.15;
        }

        let ignoreDefPct = secretData.effects?.ignoreDef || 0;
        if (secretId === 'thanh_nguyen_kiem_mang') {
            ignoreDefPct = 0.9;
        } else if (secretId.includes('thien_kiem_tong_bi_tich')) {
            ignoreDefPct = 0.5;
            this.addLog(`⚔️ [Vạn Kiếm Quy Tông] Kiếm quang tụ hội, phá vỡ 50% hộ thân linh giáp!`);
        } else if (secretId.includes('lac_van_tong_bi_tich')) {
            ignoreDefPct = 1.0;
            this.addLog(`🔮 [Tử Cực Thần Quang] Tử quang oanh kích diệu kỳ, phá hủy hoàn toàn 100% phòng ngự đối thủ!`);
        }

        // [CATEGORY SPECIFIC BONUS] Thần Thông: Ignore extra enemy defense scaling with stage + root match bonus
        if (secretData.category === 'Thần Thông') {
            // Ignored defense scales with stage (+3% per stage)
            ignoreDefPct = Math.max(ignoreDefPct, 0.10 + (playerSecret?.stage || 1) * 0.03);
            // Spiritual root compatibility boost (+15% defense ignore for matching or Thiên Linh Căn)
            const pRootId = this.player.spiritualRoot?.id || '';
            const pRootElements = this.player.spiritualRoot?.elements || [];
            if (pRootId === 'thien_linh_can' || (secretData.element && pRootElements.includes(secretData.element))) {
                ignoreDefPct = Math.min(1.0, ignoreDefPct + 0.15);
                this.addLog(`✨ Linh căn tương hợp kích phát Thần Thông dị động, gia tăng xuyên thấu hộ giáp đối địch!`);
            }
        }

        let effectiveEnemyDef = Math.floor(this.enemy.def * (1 - ignoreDefPct));
        let damage = Math.max(1, Math.floor((this.player.atk * damageMult - Math.floor(effectiveEnemyDef / 2)) * suppression));

        // Player deviation instability debuff reduces player damage by 30%
        if (this.status.player.instability > 0) {
            damage = Math.floor(damage * 0.7);
        }

        if (Math.random() < critRate) {
            damage = Math.floor(damage * 2.0);
            this.addLog(`⚡ Bí pháp bạo kích!`);
        }

        this.enemy.hp -= damage;
        this.addLog(`Ngươi thi triển ${secretData.name} bộc phát ${damage} sát thương!`);

        // Handle Specialized Active Effects
        if (secretId.includes('ho_the_kiem_don')) {
            const shieldAmt = Math.floor(this.player.maxHp * 0.25);
            this.status.player.shield = (this.status.player.shield || 0) + shieldAmt;
            this.playerDodging = true;
            this.addLog(`✨ [Kiếm Hộ] Kiếm khí đan xen hóa thành lôi thuẫn hộ thể (+${shieldAmt} Giáp), đồng thời thân pháp phi thăng khó lòng bị đánh trúng!`);
        }
        else if (secretId.includes('minh_vuong_kim_than')) {
            const shieldAmt = Math.floor(this.player.maxHp * 0.35);
            this.status.player.shield = (this.status.player.shield || 0) + shieldAmt;
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + Math.floor(this.player.maxHp * 0.15));
            this.addLog(`🛡️ [Kim Thân] Hóa thân Minh Vương bất hoại! Nhận ${shieldAmt} Giáp và lập tức phục hồi 15% khí huyết!`);
        }
        else if (secretId.includes('dai_dien_than_niem')) {
            this.status.enemy.stun = Math.max(this.status.enemy.stun, 1);
            this.addLog(`🌀 [Thần Niệm] Thần thức sắc bén ngưng tụ thành kim nhọn oanh tạc ý thức, khiến đối phương rơi vào trạng thái CHOÁNG 1 lượt!`);
        }
        else if (secretId.includes('huyet_sat_cuong_bao')) {
            const healAmt = Math.floor(damage * 0.40);
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmt);
            this.status.enemy.burn = Math.max(this.status.enemy.burn, 3);
            this.status.enemy.burnPower = Math.max(this.status.enemy.burnPower, this.player.atk * 0.15);
            this.addLog(`🩸 [Huyết Sát] Hút ${healAmt} khí huyết và gây chảy máu liên tục 3 lượt lên đối phương!`);
        }
        else if (secretId.includes('bat_quai_ho_than')) {
            const shieldAmt = this.player.maxHp * 2.0;
            this.status.player.shield = (this.status.player.shield || 0) + shieldAmt;
            this.addLog(`✨ [Bát Quái] Hộ thiên trận pháp giáng thế! Ngươi hoàn toàn miễn nhiễm sát thương (Hộ giáp ${shieldAmt}) trong lượt này!`);
        }
        else if (secretId.includes('van_doc_hoat_cot')) {
            this.status.enemy.burn = Math.max(this.status.enemy.burn, 4);
            this.status.enemy.burnPower = Math.max(this.status.enemy.burnPower, this.player.atk * 0.25);
            this.addLog(`☠️ [Vạn Độc] Thần kịch độc bám chặt vào kinh mạch kẻ địch, gây ăn mòn xương cốt liên tục trong 4 lượt!`);
        }
        else if (secretId.includes('hoang_phong_coc_bi_tich')) {
            this.status.enemy.stun = Math.max(this.status.enemy.stun, 1);
            this.addLog(`🌪️ [Hoàng Phong Thần Sa] Phong ba bão cát mù mịt oanh tạc khiến kẻ địch CHOÁNG 1 lượt!`);
        }
        else if (secretId.includes('huyen_am_coc_bi_tich')) {
            const healAmt = Math.floor(damage * 0.40);
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmt);
            this.addLog(`💀 [Huyền Âm Quỷ Trảo] Quỷ hồn phệ cốt, chuyển hóa hút ${healAmt} khí huyết khôi phục bản thân!`);
        }
        else if (secretId.includes('yem_nguyet_tong_bi_tich')) {
            this.status.enemy.stun = Math.max(this.status.enemy.stun, 1);
            this.addLog(`🌙 [Mị Ảnh Hoặc Thần] Thần thông mộng ảo mê hoặc tâm trí, khiến đối phương CHOÁNG 1 lượt!`);
        }
        else if (secretId.includes('thien_tinh_tong_bi_tich')) {
            const shieldAmt = Math.floor(this.player.maxHp * 0.35);
            this.status.player.shield = (this.status.player.shield || 0) + shieldAmt;
            this.addLog(`🛡️ [Ngũ Hành Huyền Thuẫn] Triển khai trận thuẫn hộ vệ quang mang (+${shieldAmt} Giáp)!`);
        }
        else if (secretId.includes('linh_thu_son_bi_tich')) {
            const healAmt = Math.floor(this.player.maxHp * 0.15);
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmt);
            this.addLog(`🩸 [Thú Huyết Cuồng Bạo] Đốt cháy tinh huyết bạo phát thú năng, lập tức phục hồi ${healAmt} khí huyết!`);
        }
        else if (secretId.includes('thanh_hu_mon_bi_tich')) {
            const healHp = Math.floor(this.player.maxHp * 0.25);
            const healMana = Math.floor(this.player.maxMana * 0.25);
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + healHp);
            this.player.mana = Math.min(this.player.maxMana, this.player.mana + healMana);
            this.addLog(`💧 [Thanh Hư Ngọc Lộ] Linh lộ sương mai tinh khiết khôi phục +${healHp} HP và +${healMana} Mana!`);
        }
        else if (secretId.includes('cu_kiem_mon_bi_tich')) {
            this.addLog(`🗡️ [Cự Kiếm Trảm Thiên] Thiên vân trọng kiếm rơi xuống như thần phạt hủy thiên diệt địa!`);
        }
        else if (secretId.includes('hoa_dao_o_bi_tich')) {
            this.status.enemy.burn = Math.max(this.status.enemy.burn, 3);
            this.status.enemy.burnPower = Math.max(this.status.enemy.burnPower, 50);
            this.addLog(`🔥 [Đao Kình Thương Không] Nhiệt huyết hỏa diễm quấn quanh đao quang gây CHẢY MÁU/THIÊU ĐỐT 3 lượt!`);
        }
        else if (secretId.includes('thien_khuyet_bao_bi_tich')) {
            const shieldAmt = Math.floor(this.player.def * 1.5);
            this.status.player.shield = (this.status.player.shield || 0) + shieldAmt;
            this.addLog(`🛡️ [Thiên Khuyết Kim Giáp] Kim thạch cường thân kết thành vách sắt vệ cơ (+${shieldAmt} Giáp)!`);
        }
        else if (secretId.includes('quy_linh_mon_bi_tich')) {
            this.status.enemy.burn = Math.max(this.status.enemy.burn, 4);
            this.status.enemy.burnPower = Math.max(this.status.enemy.burnPower, 40);
            this.addLog(`👿 [Vạn Quỷ Cắn Xé] Quỷ ảnh cắn nuốt kinh mạch tạo ra thần kịch độc gây ăn mòn cốt tinh 4 lượt!`);
        }
        else if (secretId.includes('hop_hoan_tong_bi_tich')) {
            this.enemy.spd = Math.floor(this.enemy.spd * 0.6);
            this.addLog(`💋 [Mị Hoặc Chúng Sinh] Hào quang hồng phấn giáng lâm làm suy giảm 40% Tốc độ kẻ địch!`);
        }
        else if (secretId.includes('ma_diem_mon_bi_tich')) {
            this.status.enemy.burn = Math.max(this.status.enemy.burn, 3);
            this.status.enemy.burnPower = Math.max(this.status.enemy.burnPower, 70);
            this.addLog(`🔥 [U Minh Địa Hỏa] Dung nham phún trào thiêu rụi kinh mạch đối phương liên tục 3 lượt!`);
        }
        else if (secretId.includes('thien_sat_tong_bi_tich')) {
            this.player.atk = Math.floor(this.player.atk * 1.3);
            this.addLog(`👿 [Sát Khí Xung Thiên] Ma sát quấn thân cuồng bạo kích phát chiến lực, tăng 30% công kích trận này!`);
        }
        else if (secretId.includes('ngu_linh_tong_bi_tich')) {
            this.enemy.def = Math.floor(this.enemy.def * 0.7);
            this.addLog(`🐛 [Phệ Linh Ma Trùng] Linh trùng gặm nhấm pháp lực hộ thể đối thủ, giảm 30% phòng ngự địch thủ!`);
        }
        else if (secretId.includes('khoi_am_tong_bi_tich')) {
            if (Math.random() < 0.5) {
                this.status.enemy.stun = Math.max(this.status.enemy.stun, 1);
                this.addLog(`💥 [Bộc Phá Thi Khôi] Thi khí chấn động, kích nổ khôi lỗi tiễn địch vào CHOÁNG 1 lượt!`);
            } else {
                this.addLog(`💥 [Bộc Phá Thi Khôi] Kích nổ thi khôi cực đại làm rung chuyển mặt đất!`);
            }
        }

        this.onUpdate('damage', { target: 'enemy', value: damage, crit: true, actionType: 'secret', secretId: secretId });

        if (this.enemy.hp <= 0) {
            this.enemy.hp = 0;
            this.win();
        } else {
            this.turn = 1;
            this.nextTurn();
        }
    }

    enemyAttack() {
        if (!this.isActive) return;

        this.triggerArtifacts('defense');
        
        const suppression = this.calculateRealmSuppression(this.enemy, this.player);
        const pSense = this.player.advancedStats?.perception || 10;
        const eSense = this.enemy.perception || 10;

        // [PASSIVE ESCAPE SLOT EFFECT] Hit chance reduced by player's passive dodge rate from Độn Thuật
        const pDodge = this.player.advancedStats?.dodge || 0;
        let hitChance = 0.85 + (eSense - pSense) * 0.005 - pDodge;
        if (this.playerDodging) {
            hitChance *= 0.4; // 60% reduction in hit chance
            this.playerDodging = false; // Consume dodge
        }
        hitChance = Math.max(0.1, Math.min(0.95, hitChance));

        if (Math.random() > hitChance) {
            this.addLog(`${this.enemy.name} tấn công nhưng ngươi đã né tránh thành công!`);
            this.onUpdate('damage', { target: 'player', value: 0, crit: false, actionType: 'miss' });
            this.turn = 0;
            this.nextTurn();
            return;
        }

        // Apply Enemy Armor Penetration (pierce)
        const ePierce = this.enemy.advancedStats?.pierce || 0;
        
        // [INSTABILITY DEFENSE PENALTY] Instability status reduces player's defense by 30%
        const instabilityMult = this.status.player.instability > 0 ? 0.7 : 1.0;
        const effectivePlayerDef = Math.floor(this.player.def * (1 - ePierce) * instabilityMult);

        // Get elements and apply countered multiplier
        let playerElement = 'Neutral';
        if (this.player.mainTechniqueId) {
            const techData = getTechniqueById(this.player.mainTechniqueId) || (this.player.customTechniques || []).find(t => t.id === this.player.mainTechniqueId);
            if (techData && techData.element) {
                playerElement = techData.element;
            }
        }
        const enemyElement = this.enemy.element || 'Neutral';
        const elementalMult = this.getElementalMultiplier(enemyElement, playerElement);

        const dr = this.player.advancedStats.damageReduction || 0;
        
        // [SONG TU PASSIVE RESIST] Song Tu slot adds +10% all elemental resistances in combat
        let allRes = this.player.advancedStats.allRes || 0;
        if (this.player.mainDualId) {
            allRes += 0.10;
        }
        
        const effectiveEnemyAtk = Math.max(1, Math.floor(this.enemy.atk * this.getEnemyMultiplier('atk')));
        let damage = Math.max(1, (effectiveEnemyAtk - Math.floor(effectivePlayerDef / 2)) * suppression * elementalMult * (1 - dr) * (1 - allRes));

        // Calculate Enemy Weakness Strike (Sơ Hở)
        let weaknessChance = this.enemy.advancedStats?.weaknessStrikeChance || this.enemy.advancedStats?.critRate || 0.05;
        weaknessChance += (eSense - pSense) * 0.002;
        let fatalChance = this.enemy.advancedStats?.fatalStrikeChance || 0.02;
        fatalChance += (eSense - pSense) * 0.001;

        if (this.ambushType === 'enemy') {
            fatalChance += 0.30;
            weaknessChance += 0.40;
        }

        const isFatal = Math.random() < fatalChance;
        const isWeakness = !isFatal && (Math.random() < weaknessChance);
        const critDmg = this.enemy.advancedStats?.critDmg || 1.5;

        let attackMsg = "";
        if (isFatal) {
            damage = Math.floor(damage * 3.0);
            attackMsg = `<span class="text-purple-500 font-bold font-ancient uppercase animate-pulse">ĐỐI PHƯƠNG ĐÁNH CHÍ TỬ!</span> Đòn đánh cắn ngập mạch máu hiểm độc của ${this.enemy.name}, gây <span class="text-purple-400 font-bold">${Math.floor(damage)}</span> sát thương!`;
        } else if (isWeakness) {
            damage = Math.floor(damage * critDmg);
            attackMsg = `<span class="text-red-500 font-bold">ĐỐI PHƯƠNG ĐÁNH VÀO SƠ HỞ!</span> ${this.enemy.name} đánh trúng hiểm yếu, gây ${Math.floor(damage)} sát thương!`;
        } else {
            attackMsg = `${this.enemy.name} lao đến tấn công, gây ${Math.floor(damage)} sát thương.`;
        }

        // Archetypes adjustments
        if (this.enemyArchetype === 'ASSASSIN' && Math.random() < 0.35) {
            const truePart = Math.floor(effectiveEnemyAtk * 0.4);
            const normalPart = Math.max(1, effectiveEnemyAtk - Math.floor(effectivePlayerDef * 0.3));
            damage = (truePart + normalPart) * suppression * (1 - dr) * (1 - allRes);
            if (isFatal) {
                damage = Math.floor(damage * 3.0);
                attackMsg = `${this.enemy.name} biến ảo khôn lường, xuyên qua sơ hở gây <span class="text-purple-400 font-bold">${Math.floor(damage)}</span> sát thương chí mạng!`;
            } else if (isWeakness) {
                damage = Math.floor(damage * critDmg);
                attackMsg = `${this.enemy.name} biến ảo khôn lường, xuyên qua sơ hở gây <span class="text-red-400 font-bold">${Math.floor(damage)}</span> sát thương sơ hở!`;
            } else {
                attackMsg = `${this.enemy.name} biến ảo khôn lường, xuyên qua sơ hở gây <span class="text-white">${Math.floor(damage)}</span> sát thương!`;
            }
            if (Math.random() < 0.2) {
                this.status.player.stun = Math.max(this.status.player.stun, 1);
                this.addLog(`Ngươi bị trấn áp, rơi vào trạng thái <span class="text-yellow-500">CHOÁNG</span>!`);
            }
        } else if (this.enemyArchetype === 'BERSERKER' && Math.random() < 0.3) {
            damage = Math.floor(damage * 1.5);
            attackMsg = `${this.enemy.name} cuồng bạo oanh kích, gây <span class="text-red-500 font-bold">${Math.floor(damage)}</span> sát thương cực lớn!`;
        } else if (this.enemyArchetype === 'TANK' && Math.random() < 0.3) {
            this.enemy.def = Math.floor(this.enemy.def * 1.2);
            this.addLog(`${this.enemy.name} vận kình khí, phòng ngự tăng vọt!`);
        }

        if (this.playerDefending) {
            damage = Math.floor(damage * 0.25);
            attackMsg = `Ngươi kịp thời phòng thủ, chỉ nhận ${Math.floor(damage)} sát thương từ đòn đánh của ${this.enemy.name}.`;
            this.playerDefending = false;
        }

        // Apply Enemy Lifesteal (lifeSteal)
        const eLifeSteal = this.enemy.advancedStats?.lifeSteal || 0;
        if (eLifeSteal > 0 && damage > 0) {
            const healAmount = Math.floor(damage * eLifeSteal);
            if (healAmount > 0) {
                this.enemy.hp = Math.min(this.enemy.maxHp, this.enemy.hp + healAmount);
                this.addLog(`${this.enemy.name} kích hoạt <span class="text-red-400">HÚT MÁU</span>, hồi phục ${healAmount} sinh mệnh!`);
            }
        }

        let finalPlayerDamage = Math.floor(damage);
        if (this.status.player.shield && this.status.player.shield > 0) {
            if (this.status.player.shield >= finalPlayerDamage) {
                this.status.player.shield -= finalPlayerDamage;
                this.addLog(`🛡️ Hộ giáp linh lực hấp thụ hoàn toàn ${finalPlayerDamage} sát thương! (Giáp còn: ${this.status.player.shield})`);
                finalPlayerDamage = 0;
            } else {
                finalPlayerDamage -= this.status.player.shield;
                this.addLog(`🛡️ Hộ giáp linh lực hấp thụ ${this.status.player.shield} sát thương! (Giáp vỡ)`);
                this.status.player.shield = 0;
            }
        }

        // --- Module 3: Đạo Tâm Hộ Thể — 25% block incoming hit when daoTam > 70 ---
        if (this.combatDaoTam > 70 && Math.random() < 0.25) {
            this.addLog(`✨ <span class="text-cyan-400 font-bold">Đạo Tâm Hộ Thể!</span> Đạo tâm kiến định như bàn thạch, đòn đánh của ${this.enemy.name} bị hóa giải hoàn toàn!`);
            this.onUpdate('damage', { target: 'player', value: 0, crit: false, actionType: 'dao_tam_block' });
            this.turn = 0;
            this.nextTurn();
            return;
        }

        this.player.hp -= finalPlayerDamage;
        
        // --- Module 1: Hộ Thân Thế mana regen on taking a hit ---
        if (this.playerStance === 'THU' && finalPlayerDamage > 0) {
            const stanceConf = COMBAT_STANCES.THU;
            const manaGain = Math.floor(this.player.maxMana * stanceConf.manaRegen);
            this.player.mana = Math.min(this.player.maxMana, this.player.mana + manaGain);
            if (manaGain > 0) {
                const label = this.player.getEnergyLabel ? this.player.getEnergyLabel() : 'Linh Lực';
                this.addLog(`🛡️ [Hộ Thân Thế] ${label} phản hồi +${manaGain}.`);
            }
        }
        this.addLog(attackMsg);
        this.onUpdate('damage', { target: 'player', value: finalPlayerDamage, crit, actionType: 'attack' });

        this.applyCombatStatusEffects(this.enemy, this.player, false, finalPlayerDamage, crit);

        if (this.player.hp <= 0) {
            this.player.hp = 0;
            this.lose();
        } else {
            this.turn = 0;
            this.nextTurn();
        }
    }

    triggerArtifacts(phase) {
        Object.entries(this.player.equipment).forEach(([slot, itemId]) => {
            if (!itemId || !slot.includes('Artifact')) return;

            const item = (typeof getItemById === 'function') ? getItemById(itemId) : null;
            if (!item || !item.stats) return;

            // Mana consumption
            const cost = item.stats.costMana || 0;
            if (cost > 0) {
                if (this.player.mana >= cost) {
                    this.player.mana -= cost;
                } else {
                    this.addLog(`Linh lực không đủ duy trì [${item.name}]!`);
                }
            }

            // Durability loss
            if (Math.random() > 0.98) {
                if (!this.player.equipmentMetadata[slot]) {
                    this.player.equipmentMetadata[slot] = { spirit: 0, level: 1, durability: 100 };
                }
                const meta = this.player.equipmentMetadata[slot];
                meta.durability = Math.max(0, meta.durability - 1);
                if (meta.durability === 0) {
                    this.addLog(`<span class="text-red-400">[${item.name}]</span> đã bị tổn hại nghiêm trọng, mất linh tính!`);
                }
            }
        });

        this.player.calculateStats();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MODULE 1: Chiến Thế (Combat Stance)
    // ─────────────────────────────────────────────────────────────────────────
    playerSetStance(stanceId) {
        if (!COMBAT_STANCES[stanceId]) return;
        if (this.playerStance === stanceId) {
            // Toggle off to NONE if already active
            this.playerStance = 'NONE';
            this.addLog(`Cười nhạt một tiếng, ngươi rút khỏi chiến thế, trở về trạng thái vô thế tự nhiên.`);
        } else {
            this.playerStance = stanceId;
            const conf = COMBAT_STANCES[stanceId];
            this.addLog(`<span class="font-ancient" style="color:${conf.color}">[${conf.icon} ${conf.name}]</span> Ngươi thần tâm chấn động, khai động chiến thế!`);
        }
        // Stance switching does NOT cost a turn — just emits a UI refresh
        this.onUpdate('stance', { stance: this.playerStance });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MODULE 2: Thiên Địa Dị Biến (Combat Events)
    // ─────────────────────────────────────────────────────────────────────────
    checkCombatEvents() {
        this.combatEventTurnCounter++;
        for (const [key, eventDef] of Object.entries(COMBAT_EVENTS)) {
            // Check interval
            if (this.combatEventTurnCounter % eventDef.checkInterval !== 0) continue;
            // Check condition
            if (!eventDef.condition(this)) continue;
            // Roll chance
            if (Math.random() > eventDef.chancePerCheck) continue;
            // Apply event
            this.applyEvent(key, eventDef);
        }
    }

    applyEvent(key, eventDef) {
        this.addLog(`<span class="${eventDef.logColor} font-ancient font-bold">${eventDef.icon} [ĐạI ĐẠO Dị BIẾ́N] ${eventDef.name}!</span> ${eventDef.desc}`);
        this.onUpdate('combat-event', { id: key, name: eventDef.name, icon: eventDef.icon, color: eventDef.color });

        switch (key) {
            case 'LINH_KHI_BAO_DONG': {
                // Random: buff or debuff to player (50/50)
                if (Math.random() < 0.5) {
                    const manaGain = Math.floor(this.player.maxMana * 0.1);
                    this.player.mana = Math.min(this.player.maxMana, this.player.mana + manaGain);
                    this.addLog(`🌀 Linh khí khuếch tán giúp ngươi hồi phục +${manaGain} Linh Lực.`);
                } else {
                    const hpLoss = Math.floor(this.player.maxHp * 0.04);
                    this.player.hp = Math.max(1, this.player.hp - hpLoss);
                    this.addLog(`🌀 Linh khí bạo loạn thâm nhập kinh mạch, ngươi mất -${hpLoss} khí huyết.`);
                    this.onUpdate('damage', { target: 'player', value: hpLoss, crit: false, actionType: 'event' });
                }
                break;
            }
            case 'THIEN_LOI_HOI_KICH': {
                const leiDmg = Math.floor(this.player.atk * 1.2);
                this.enemy.hp = Math.max(0, this.enemy.hp - leiDmg);
                this.addLog(`⚡ Thiên lôi giáng xuống, đánh bổ trợ thêm <span class="text-yellow-300 font-bold">${leiDmg}</span> sát thương!`);
                this.onUpdate('damage', { target: 'enemy', value: leiDmg, crit: true, actionType: 'event' });
                break;
            }
            case 'TAM_MA_TA_AP': {
                // Lose 5% HP but gain Tam Ma buff: next skill +20% dmg
                const hpLoss = Math.floor(this.player.maxHp * 0.05);
                this.player.hp = Math.max(1, this.player.hp - hpLoss);
                this.status.player.tamMaBuff = 1; // Lasts 1 turn
                this.addLog(`🩸 Tâm ma trỗi dậy, mất -${hpLoss} khí huyết nhưng pháp lực đột ngột bạo tăng! (Lượt tới: Bí Pháp +20%)`);
                this.onUpdate('damage', { target: 'player', value: hpLoss, crit: false, actionType: 'event' });
                break;
            }
            case 'LINH_KHI_TRIEU': {
                const manaGain = Math.floor(this.player.maxMana * 0.08);
                this.player.mana = Math.min(this.player.maxMana, this.player.mana + manaGain);
                this.addLog(`🌿 Linh khí triều dâng, hồi phục +${manaGain} Linh Lực.`);
                break;
            }
            case 'SAT_KHI_TU_TAP': {
                // Mark active — damage bonus applied in playerAttack
                this.activeCombatEvents.add('SAT_KHI_TU_TAP');
                this.addLog(`⚔️ Sát khí nhất tần! Mọi đòn tấn công +10% trong lượt này.`);
                break;
            }
        }
        // Clear turn-based active events after 1 turn
        if (key === 'SAT_KHI_TU_TAP') {
            setTimeout(() => this.activeCombatEvents.delete('SAT_KHI_TU_TAP'), 100);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MODULE 3: Luyện Tâm (Meditate)
    // ─────────────────────────────────────────────────────────────────────────
    playerMeditate() {
        // Calm the heart demon, regen some mana and divine sense, sacrifice the turn
        const heartDemonReduce = 5;
        const manaGain = Math.floor(this.player.maxMana * 0.08);
        const thanThucGain = Math.floor((this.player.maxThanThuc || 50) * 0.15);

        this.combatHeartDemon = Math.max(0, this.combatHeartDemon - heartDemonReduce);
        this.player.mana = Math.min(this.player.maxMana, this.player.mana + manaGain);
        this.player.thanThuc = Math.min(this.player.maxThanThuc || 50, (this.player.thanThuc || 0) + thanThucGain);
        
        const label = this.player.getEnergyLabel ? this.player.getEnergyLabel() : 'Linh Lực';
        this.addLog(`🧘 <span class="text-purple-400 font-ancient">Luyện Tâm!</span> Ngươi thu tâm thần, hóa giải Tâm Ma (-${heartDemonReduce}), hồi ${label} +${manaGain}, hồi Thần Thức +${thanThucGain}.`);
        this.onUpdate('damage', { target: 'player', value: 0, crit: false, actionType: 'meditate' });
        
        this.endPlayerTurn();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MODULE 4: Bản Mệnh Pháp Bảo Tấn Công
    // ─────────────────────────────────────────────────────────────────────────
    playerArtifactAttack() {
        const artifactId = this.player.equipment?.phap_bao_cong || this.player.lifeBoundTreasureId;
        if (!artifactId) {
            this.addLog('Ngươi không có Pháp Bảo chủ chiến nào có thể triệu hồi!');
            return;
        }
        const costMana = 20;
        const costThanThuc = 15;
        if (this.player.mana < costMana) {
            const label = this.player.getEnergyLabel ? this.player.getEnergyLabel() : 'Linh Lực';
            this.addLog(`⚠️ ${label} không đủ, cần tối thiểu ${costMana} để kích hoạt pháp bảo!`);
            return;
        }
        if ((this.player.thanThuc || 0) < costThanThuc) {
            this.addLog(`⚠️ Thần Thức không đủ, cần tối thiểu ${costThanThuc} để ngự dịch pháp bảo!`);
            return;
        }
        // Check recognized
        if (!(this.player.recognizedItems || []).includes(artifactId)) {
            this.addLog(`Pháp Bảo chưa được nhận chủ, không thể điều khiển linh hoạt trong chiến!`);
            return;
        }

        const item = getItemById(artifactId);
        if (!item) return;

        this.player.mana -= costMana;
        this.player.thanThuc = Math.max(0, (this.player.thanThuc || 0) - costThanThuc);

        const itemName = item.name || 'Pháp Bảo';
        const stats = item.stats || {};
        const meta = this.player.equipmentMetadata?.phap_bao_cong || { level: 1 };
        const levelMult = 1 + (meta.level - 1) * 0.1; // +10% per level

        // Base artifact damage: atk bonus from item stats + player atk contribution
        const atkBonus = stats.atk || 0;
        const piercePct = stats.pierce || 0;
        const lifeStealPct = stats.lifeSteal || 0;

        const suppression = this.calculateRealmSuppression(this.player, this.enemy);
        const effectiveDef = Math.max(1, Math.floor(this.enemy.def * (1 - piercePct) * this.getEnemyMultiplier('def')));
        let dmg = Math.max(5, Math.floor((this.player.atk * 0.5 + atkBonus) * suppression * levelMult) - Math.floor(effectiveDef / 2));

        if (this.combatHeartDemon > 70) {
            dmg = Math.floor(dmg * 0.7);
            this.addLog(`⚠️ <span class="text-purple-400 font-ancient">TÂM MA KHẤP KHỞI!</span> Tâm ma quấy nhiễu làm suy giảm khả năng điều khiển pháp bảo, sát thương pháp bảo giảm 30%!`);
        }

        // Tier bonuses for high-grade artifacts
        const quality = item.quality?.name || item.quality || '';
        let tierEffect = '';
        if (quality === 'Cổ Bảo' || quality === 'co_bao') {
            // Cổ Bảo: 20% stun chance
            if (Math.random() < 0.2) {
                this.status.enemy.stun = Math.max(this.status.enemy.stun || 0, 1);
                tierEffect = ' <span class="text-yellow-400">[Cổ Bảo Uy Năng: CHOÁNG VÁNG!]</span>';
            }
        } else if (quality === 'Linh Bảo' || quality === 'linh_bao') {
            // Linh Bảo: DOT burn 2 turns
            this.status.enemy.burn = Math.max(this.status.enemy.burn || 0, 2);
            this.status.enemy.burnPower = Math.max(this.status.enemy.burnPower || 0, dmg * 0.2);
            tierEffect = ' <span class="text-orange-400">[Linh Bảo Pháp Lực: THIÊU ĐỐT!]</span>';
        }

        this.enemy.hp -= dmg;
        const label = this.player.getEnergyLabel ? this.player.getEnergyLabel() : 'Linh Lực';
        this.addLog(`💙 <span class="text-qi-blue font-ancient">${itemName}</span> xuất kích vang dội, tiêu hao -${costMana} ${label} & -${costThanThuc} Thần Thức, gây <span class="text-qi-blue font-bold">${dmg}</span> sát thương!${tierEffect}`);
        this.onUpdate('damage', { target: 'enemy', value: dmg, crit: false, actionType: 'artifact' });

        // Life steal
        if (lifeStealPct > 0) {
            const heal = Math.floor(dmg * lifeStealPct);
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
            this.addLog(`Pháp bảo hút thu địch sinh mệnh, hồi phục +${heal} khí huyết.`);
        }

        if (this.enemy.hp <= 0) {
            this.enemy.hp = 0;
            this.win();
        } else {
            this.endPlayerTurn();
        }
    }

    win() {
        this.isActive = false;
        this.addLog("<span class=\"text-cultivation-gold font-bold text-lg\">ĐẠI THẮNG!</span> Kẻ địch đã bị tiêu diệt.");

        // Base Tu Vi reward
        const reward = Math.floor(this.enemy.maxHp * 0.8);
        this.player.tuVi += reward;
        this.addLog(`Luyện hóa khí huyết kẻ địch, nhận được ${reward} tu vi.`);

        // Combat Mastery Reward: fighting builds technique mastery
        this._awardCombatMastery();

        // Trigger Mission System
        if (state.systems.mission) {
            state.systems.mission.onAction('kill', 1);
        }

        // Notify UI to handle loot
        this.onUpdate('loot', { enemy: this.enemy });
    }

    /**
     * Award mastery to all equipped techniques after winning combat.
     * Gain scales with enemy strength and player comprehension.
     */
    _awardCombatMastery() {
        const equippedIds = [
            this.player.mainTechniqueId,
            this.player.mainBodyTechniqueId,
            this.player.mainSoulTechniqueId
        ].filter(Boolean);

        if (equippedIds.length === 0) return;

        // Base combat mastery = enemy level * 2 (min 5, max 200)
        const enemyLevel = this.enemy.level || 1;
        const compBonus = 1.0 + (this.player.comprehension || 30) / 100;
        const baseMastery = Math.min(200, Math.max(5, Math.floor(enemyLevel * 2 * compBonus)));

        const techSys = state.systems && state.systems.technique;
        equippedIds.forEach(tid => {
            if (techSys) {
                techSys.addMastery(tid, baseMastery);
            } else {
                const t = (this.player.learnedTechniques || []).find(l => l.id === tid);
                if (t) t.mastery = (t.mastery || 0) + baseMastery;
            }
        });

        if (baseMastery > 0) {
            this.addLog(`<span class="text-cultivation-gold">Kinh nghiệm chiến đấu đúc kết, toàn bộ công pháp nhận thêm <b>+${baseMastery}</b> điểm thuần thục.</span>`);
        }
    }


    lose() {
        this.isActive = false;
        this.addLog("<span class=\"text-red-500 font-bold text-lg\">THẢM BẠI...</span> Ngươi đã kiệt sức.");
        const penalty = Math.floor(this.player.tuVi * 0.1);
        this.player.tuVi = Math.max(0, this.player.tuVi - penalty);
        this.addLog(`Đạo cơ bị tổn hại, mất ${penalty} tu vi.`);
        this.onUpdate('end');
        setTimeout(() => this.onEnd('lose'), 3000);
    }
}
