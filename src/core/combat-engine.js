import { getSecretTechniqueById } from '../configs/technique-data.js';
import { getFlameById } from '../configs/alchemy-data.js';
import { getItemById } from '../configs/item-data.js';

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
        this.turnOrder = [];
        this.calculateTurnOrder();
    }

    calculateTurnOrder() {
        // Divine Sense (Perception) influences reaction speed
        const pSense = (this.player.perception || 10) * 0.1;
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

        if (aRealm > dRealm) {
            const diff = aRealm - dRealm;
            mult = 1.0 + (diff * 0.15); // 15% bonus per realm difference
            this.addLog(`<span class="text-cultivation-gold">Uy áp!</span> Cảnh giới cao áp chế kẻ yếu, uy lực tăng mạnh.`);
        } else if (aRealm < dRealm) {
            const diff = dRealm - aRealm;
            mult = Math.max(0.3, 1.0 - (diff * 0.2)); // 20% penalty per realm difference
            this.addLog(`<span class="text-red-400">Trấn áp!</span> Cảnh giới kẻ địch quá cao, ngươi cảm thấy khó thở.`);
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
            this.turn = this.player.spd >= this.enemy.spd ? 0 : 1;
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
                return data?.type === 'consumable' && data.effect?.type === 'heal';
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
            case 'HEAL_TECHNIQUE':
                const heal = Math.floor(this.enemy.maxHp * 0.25);
                this.enemy.hp = Math.min(this.enemy.maxHp, this.enemy.hp + heal);
                msg = `${this.enemy.name} thi triển mật thuật trị thương, khí sắc khôi phục!`;
                damage = 0;
                break;
            default:
                msg = `${this.enemy.name} thi triển kỹ năng đặc thù!`;
        }

        if (damage > 0) {
            const finalDmg = Math.max(1, damage - Math.floor(this.player.def / 2));
            this.player.hp -= finalDmg;
            this.addLog(msg + ` Gây ${finalDmg} sát thương.`);
            this.onUpdate('damage', { target: 'player', value: finalDmg, crit: true });
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
            this.onUpdate('damage', { target: 'player', value: dmg, crit: true });
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
    }

    chaseEnemy() {
        const playerSpd = this.player.spd;
        const enemySpd = this.enemy.spd;

        let flightBonus = 0;
        if (this.player.equipment.flightArtifact) {
            const artifact = getItemById(this.player.equipment.flightArtifact);
            flightBonus = artifact?.stats?.spd || 20;
        }

        const successChance = Math.max(0.1, Math.min(0.9, 0.4 + ((playerSpd + flightBonus - enemySpd) / 100)));
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
        if (this.status.enemy.burn > 0 && this.enemy.hp > 0) {
            const burnDmg = Math.max(1, Math.floor(this.status.enemy.burnPower));
            this.enemy.hp -= burnDmg;
            this.status.enemy.burn--;
            this.addLog(`${this.enemy.name} bị Dị Hỏa thiêu đốt: -${burnDmg} HP.`);
            this.onUpdate('damage', { target: 'enemy', value: burnDmg, crit: false });
            if (this.enemy.hp <= 0) {
                this.enemy.hp = 0;
                this.win();
            }
        }
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
            case 'spirit_stone':
                this.playerCrushStone();
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

        const pierce = this.player.advancedStats.pierce || 0;
        const effectiveEnemyDef = Math.floor(this.enemy.def * (1 - pierce));
        
        let damage = Math.max(1, Math.floor((this.player.atk - Math.floor(effectiveEnemyDef / 2)) * suppression * racialBonus * envBonus));

        // Divine Sense (Perception) Accuracy/Crit
        const pSense = this.player.perception || 10;
        const eSense = this.enemy.perception || 10;
        const hitChance = 0.85 + (pSense - eSense) * 0.005;
        
        if (Math.random() > hitChance) {
            this.addLog(`<span class="text-gray-500">Hụt!</span> Đối phương ảo ảnh chớp nhoáng, né tránh đòn đánh.`);
            this.onUpdate('damage', { target: 'enemy', value: 0, crit: false });
            this.endPlayerTurn();
            return;
        }

        let critRate = this.player.advancedStats.critRate || 0.05;
        critRate += (pSense - eSense) * 0.002; // Divine sense helps finding weak points

        if (this.playerAmbushBonus) {
            critRate += 0.4;
            this.playerAmbushBonus = false;
        }
        const crit = Math.random() < critRate;

        const critDmg = this.player.advancedStats.critDmg || 2.0;
        const finalDamage = crit ? Math.floor(damage * critDmg) : damage;

        this.enemy.hp -= finalDamage;
        if (crit) {
            this.addLog(`<span class="text-red-500 font-bold">BẠO KÍCH!</span> Ngươi nhìn thấu sơ hở, gây ${finalDamage} sát thương.`);
        } else {
            const verb = this.getAttackVerb(this.player.race);
            this.addLog(`Ngươi ${verb}, gây ${finalDamage} sát thương.`);
        }
        this.onUpdate('damage', { target: 'enemy', value: finalDamage, crit });

        this.handlePartyAssistance(finalDamage);
        this.endPlayerTurn();
    }

    playerSwordIntent() {
        const costMana = 40;
        if (this.player.mana < costMana) {
            this.addLog("Linh lực không đủ để ngưng tụ Kiếm Ý!");
            return;
        }
        this.player.mana -= costMana;
        
        this.addLog("<span class='text-qi-blue font-ancient'>Kiếm Ý xung thiên!</span> Ngươi nhân kiếm hợp nhất, chém ra một kiếm tuyệt diệt.");
        
        const suppression = this.calculateRealmSuppression(this.player, this.enemy);
        const damage = Math.floor(this.player.atk * 2.5 * suppression);
        
        // Sword Intent ignores 50% more defense
        const effectiveEnemyDef = Math.floor(this.enemy.def * 0.2); 
        const finalDmg = Math.max(1, damage - effectiveEnemyDef);
        
        this.enemy.hp -= finalDmg;
        this.addLog(`Kiếm quang xé rách hư không, gây <span class="text-red-500 font-bold">${finalDmg}</span> sát thương!`);
        this.onUpdate('damage', { target: 'enemy', value: finalDmg, crit: true });
        
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
                this.onUpdate('damage', { target: 'enemy', value: npcDamage, crit: false });
            });

            const bonus = Math.floor(finalDamage * 0.1 * this.player.party.length);
            this.enemy.hp -= bonus;
            this.addLog(`Liên kích tổ đội bộc phát thêm ${bonus} sát thương!`);
        }
    }

    playerDefend() {
        this.playerDefending = true;
        this.addLog("Ngươi vận chuyển chân khí, hình thành hộ thân linh giáp.");
        this.turn = 1;
        this.nextTurn();
    }

    playerEscape() {
        if (this.turn !== 0 || !this.isActive) return;

        const playerSpd = this.player.spd;
        const enemySpd = this.enemy.spd;

        // Check for escape secret techniques
        const equippedSecrets = (this.player.equippedSecretTechniqueIds || []).filter(Boolean);
        const hasEscapeSecret = equippedSecrets.some(id => {
            const data = getSecretTechniqueById(id);
            const now = Date.now();
            const lastUsed = this.player.secretTechniqueCooldowns[id] || 0;
            const isOffCooldown = (now - lastUsed) >= (data?.cooldown || 0) * 1000;
            return (data?.effects?.type === 'escape' || data?.type === 'escape') && isOffCooldown;
        });

        if (playerSpd > enemySpd || hasEscapeSecret) {
            this.addLog("<span class='text-qi-blue'>Ngươi vận dụng thân pháp cực hạn, thành công thoát khỏi chiến trường!</span>");
            this.isActive = false;
            this.onUpdate('end');
            setTimeout(() => this.onEnd('escape'), 1500);
        } else {
            this.addLog("<span class='text-red-400'>Thoát thân thất bại! Đối phương tốc độ quá nhanh, khóa chặt mọi đường lui!</span>");
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
        this.onUpdate('damage', { target: 'enemy', value: damage, crit: true });

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
        this.onUpdate('damage', { target: 'enemy', value: damage, crit: true });

        this.endPlayerTurn();
    }

    playerUsePotion() {
        const potion = this.player.inventory.items.find(i => {
            const d = getItemById(i.id);
            return d?.type === 'consumable' && (d.effect?.type === 'heal' || d.effect?.type === 'mana');
        });
        if (!potion) {
            this.addLog("Không có đan dược hồi phục để sử dụng!");
            return;
        }
        this.player.inventory.useItem(potion.id, 1);
        this.addLog(`Ngươi dùng ${getItemById(potion.id)?.name || 'đan dược'}, điều tức hồi phục.`);
        this.endPlayerTurn();
    }

    playerUseTalisman() {
        if (!this.player.unlockedProfessions?.includes('talisman')) {
            this.addLog("Chưa lĩnh hội bí pháp Phù Lục, không thể dùng phù trong chiến đấu!");
            return;
        }
        const talisman = this.player.inventory.items.find(i => getItemById(i.id)?.type === 'talisman');
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
            this.onUpdate('damage', { target: 'enemy', value: dmg, crit: true });
        } else if (data.effect?.type === 'buff' && data.effect.stat === 'def') {
            this.player.def += data.effect.value || 60;
            this.addLog(`${data.name} bảo hộ thân thể, phòng ngự tăng tạm thời!`);
        } else if (data.effect?.type === 'escape') {
            this.addLog(`Ngươi dùng ${data.name} thoát chiến.`);
            this.isActive = false;
            this.onEnd('escape');
            return;
        }
        this.endPlayerTurn();
    }

    playerCrushStone() {
        const stone = this.player.inventory.items.find(i => getItemById(i.id)?.type === 'spirit_stone');
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
        this.onUpdate('damage', { target: 'enemy', value: dmg, crit: false });
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
        this.onUpdate('damage', { target: 'enemy', value: dmg, crit: false });
        this.endPlayerTurn();
    }

    playerSummonPuppet() {
        if (!this.player.unlockedProfessions?.includes('puppet')) {
            this.addLog("Chưa mở khóa Khôi Lỗi Thuật!");
            return;
        }
        const puppet = this.player.inventory.items.find(i => i.id === 'khoi_loi_item');
        if (!puppet) {
            this.addLog("Chưa có khôi lỗi để triệu hồi chiến đấu!");
            return;
        }
        const qualityBonus = puppet.metadata?.quality === 'Tiên Phẩm' ? 1.5 : puppet.metadata?.quality === 'Hoàn Mỹ' ? 1.3 : 1.0;
        const dmg = Math.max(1, Math.floor(this.player.atk * 0.9 * qualityBonus + (this.player.puppetLevel || 1) * 15));
        this.enemy.hp -= dmg;
        this.addLog(`Khôi lỗi xuất trận, cơ quan liên kích gây ${dmg} sát thương!`);
        this.onUpdate('damage', { target: 'enemy', value: dmg, crit: false });
        this.endPlayerTurn();
    }

    playerSummonCorpse() {
        if (!this.player.unlockedProfessions?.includes('corpse')) {
            this.addLog("Chưa mở khóa Luyện Thi Thuật!");
            return;
        }
        const corpse = this.player.refinedCorpses?.[0];
        if (!corpse) {
            this.addLog("Không có thi khôi đã luyện để triệu hồi!");
            return;
        }
        const dmg = Math.max(1, Math.floor((corpse.stats?.atk || this.player.atk * 0.6) * 0.8 + (this.player.corpseLevel || 1) * 12));
        this.enemy.hp -= dmg;
        this.addLog(`Thi khôi ${corpse.name} hung mãnh công kích gây ${dmg} sát thương!`);
        this.onUpdate('damage', { target: 'enemy', value: dmg, crit: false });
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
        this.onUpdate('damage', { target: 'enemy', value: swarmDmg, crit: false });
        
        // Hiệu ứng phụ: Độc (Burn)
        this.status.enemy.burn = Math.max(this.status.enemy.burn, 2);
        this.status.enemy.burnPower = Math.max(this.status.enemy.burnPower, (insect.stats?.atk || 10) * 0.2);
        
        this.endPlayerTurn();
    }

    playerSecretTechnique(secretId, skipChant = false) {
        if (!secretId) return;

        const secretData = getSecretTechniqueById(secretId);
        if (!secretData) return;

        // Check for preparation turns
        const prepTurns = secretData.preparationTurns || 0;
        if (prepTurns > 0 && !skipChant) {
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

        if (secretData.effects?.type === 'escape' || secretData.type === 'escape') {
            this.addLog(`Ngươi thi triển ${secretData.name} và thoát khỏi trận chiến!`);
            setTimeout(() => this.onEnd('escape'), 1000);
            this.isActive = false;
            return;
        }

        const suppression = this.calculateRealmSuppression(this.player, this.enemy);
        const damageMult = masteryBonus?.damageMult || secretData.effects?.damageMult || 1.0;
        const critChance = masteryBonus?.critChance || secretData.effects?.critChance || 0;

        let damage = Math.floor(this.player.atk * damageMult * suppression);
        if (Math.random() < critChance) {
            damage = Math.floor(damage * 2.0);
            this.addLog(`Bí pháp bạo kích!`);
        }
        this.enemy.hp -= damage;
        this.addLog(`Ngươi thi triển ${secretData.name} bộc phát ${damage} sát thương!`);

        this.onUpdate('damage', { target: 'enemy', value: damage, crit: true });

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
        const pSense = this.player.perception || 10;
        const eSense = this.enemy.perception || 10;

        // Hit chance affected by dodge and perception
        let hitChance = 0.85 + (eSense - pSense) * 0.005;
        if (this.playerDodging) {
            hitChance *= 0.4; // 60% reduction in hit chance
            this.playerDodging = false; // Consume dodge
        }

        if (Math.random() > hitChance) {
            this.addLog(`${this.enemy.name} tấn công nhưng ngươi đã né tránh thành công!`);
            this.onUpdate('damage', { target: 'player', value: 0, crit: false });
            this.turn = 0;
            this.nextTurn();
            return;
        }

        let damage = Math.max(1, (this.enemy.atk - Math.floor(this.player.def / 2)) * suppression);
        let attackMsg = `${this.enemy.name} lao đến tấn công, gây ${Math.floor(damage)} sát thương.`;

        if (this.enemyArchetype === 'ASSASSIN' && Math.random() < 0.35) {
            const truePart = Math.floor(this.enemy.atk * 0.4);
            const normalPart = Math.max(1, this.enemy.atk - Math.floor(this.player.def * 0.3));
            damage = (truePart + normalPart) * suppression;
            attackMsg = `${this.enemy.name} biến ảo khôn lường, xuyên qua sơ hở gây ${Math.floor(damage)} sát thương!`;
            if (Math.random() < 0.2) {
                this.status.player.stun = Math.max(this.status.player.stun, 1);
                this.addLog(`Ngươi bị trấn áp, rơi vào trạng thái <span class="text-yellow-500">CHOÁNG</span>!`);
            }
        } else if (this.enemyArchetype === 'BERSERKER' && Math.random() < 0.3) {
            damage = Math.floor(damage * 1.5);
            attackMsg = `${this.enemy.name} cuồng bạo oanh kích, gây ${Math.floor(damage)} sát thương cực lớn!`;
        } else if (this.enemyArchetype === 'TANK' && Math.random() < 0.3) {
            this.enemy.def = Math.floor(this.enemy.def * 1.2);
            this.addLog(`${this.enemy.name} vận kình khí, phòng ngự tăng vọt!`);
        }

        if (this.playerDefending) {
            damage = Math.floor(damage * 0.25);
            attackMsg = `Ngươi kịp thời phòng thủ, chỉ nhận ${Math.floor(damage)} sát thương từ đòn đánh của ${this.enemy.name}.`;
            this.playerDefending = false;
        }

        this.player.hp -= Math.floor(damage);
        this.addLog(attackMsg);
        this.onUpdate('damage', { target: 'player', value: Math.floor(damage), crit: false });

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

    win() {
        this.isActive = false;
        this.addLog("<span class=\"text-cultivation-gold font-bold text-lg\">ĐẠI THẮNG!</span> Kẻ địch đã bị tiêu diệt.");

        // Base Tu Vi reward
        const reward = Math.floor(this.enemy.maxHp * 0.8);
        this.player.tuVi += reward;
        this.addLog(`Luyện hóa khí huyết kẻ địch, nhận được ${reward} tu vi.`);

        // Trigger Mission System
        if (state.systems.mission) {
            state.systems.mission.onAction('kill', 1);
        }

        // --- Nâng Cấp Hệ Thống Loot ---
        const drops = [];

        // 1. Drop ALL items from enemy inventory
        if (this.enemy.inventory && this.enemy.inventory.length > 0) {
            this.enemy.inventory.forEach(item => {
                if (item.quantity > 0) {
                    this.player.inventory.addItem(item.id, item.quantity);
                    const data = getItemById(item.id);
                    drops.push(`<span class="text-qi-blue">[${item.quantity}x ${data?.name || item.id}]</span>`);
                }
            });
        }

        // 2. Drop equipment (80% chance for each piece)
        if (this.enemy.equipment) {
            Object.values(this.enemy.equipment).forEach(item => {
                if (item && Math.random() < 0.8) {
                    this.player.inventory.addItem(item.id, 1);
                    const data = getItemById(item.id);
                    drops.push(`<span class="text-qi-purple">[1x ${data?.name || item.name || item.id}]</span>`);
                }
            });
        }

        // 3. Chance to drop "Storage Bag" (Túi trữ vật) if enemy is high level
        if (this.enemy.realmId >= 5 && Math.random() < 0.2) {
            this.player.inventory.addItem('tui_tru_vat_so', 1);
            drops.push(`<span class="text-cultivation-gold">[1x Túi Trữ Vật của đối thủ]</span>`);
        }

        if (drops.length > 0) {
            this.addLog(`Thu được chiến lợi phẩm: ${drops.join(', ')}`);
        } else {
            this.addLog("Kẻ địch nghèo rớt mồng tơi, không thu hoạch được gì thêm.");
        }

        this.onUpdate('end');
        setTimeout(() => this.onEnd('win'), 3000);
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
