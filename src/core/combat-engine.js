import { getSecretTechniqueById } from '../configs/technique-data.js';
import { getFlameById } from '../configs/alchemy-data.js';
import { getItemById } from '../configs/item-data.js';

export class CombatEngine {
    constructor(player, enemy, onUpdate, onEnd) {
        this.player = player;
        this.enemy = enemy;
        this.onUpdate = onUpdate;
        this.onEnd = onEnd;
        this.turn = 0; // 0 for player, 1 for enemy
        this.log = [];
        this.isActive = true;
        this.playerDefending = false;
        this.enemyArchetype = this.getEnemyArchetype();
        this.status = {
            player: { stun: 0 },
            enemy: { burn: 0, burnPower: 0, stun: 0 }
        };
    }

    getEnemyArchetype() {
        if (this.enemy.spd >= this.enemy.atk * 0.9 && this.enemy.spd > this.enemy.def) return 'ASSASSIN';
        if (this.enemy.def >= this.enemy.atk * 0.8 && this.enemy.def > this.enemy.spd) return 'TANK';
        if (this.enemy.atk >= this.enemy.def * 1.2) return 'BERSERKER';
        return 'BALANCED';
    }

    start() {
        this.addLog(`Bắt đầu chiến đấu với ${this.enemy.name}!`);
        this.turn = this.player.spd >= this.enemy.spd ? 0 : 1;
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

        if (this.turn === 0) {
            if (this.status.player.stun > 0) {
                this.status.player.stun--;
                this.addLog("Bạn bị choáng, không thể hành động!");
                this.turn = 1;
                this.nextTurn();
                return;
            }
            this.addLog("Đến lượt của bạn. Hãy chọn hành động!");
            this.onUpdate('player-turn-start');
        } else {
            if (this.status.enemy.stun > 0) {
                this.status.enemy.stun--;
                this.addLog(`${this.enemy.name} bị choáng, bỏ lượt!`);
                this.turn = 0;
                this.nextTurn();
                return;
            }
            this.addLog(`Lượt của ${this.enemy.name}...`);
            this.onUpdate('player-turn-end');
            setTimeout(() => this.enemyAttack(), 1500);
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

        switch(type) {
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
        
        const pierce = this.player.advancedStats.pierce || 0;
        const effectiveEnemyDef = Math.floor(this.enemy.def * (1 - pierce));
        
        const damage = Math.max(1, this.player.atk - Math.floor(effectiveEnemyDef / 2));
        
        const critRate = this.player.advancedStats.critRate || 0.05;
        const crit = Math.random() < critRate;
        
        const critDmg = this.player.advancedStats.critDmg || 2.0;
        const finalDamage = crit ? Math.floor(damage * critDmg) : damage;
        
        this.enemy.hp -= finalDamage;
        this.addLog(`Bạn tấn công gây ${finalDamage} sát thương${crit ? " (BẠO KÍCH!)" : ""}.`);
        this.onUpdate('damage', { target: 'enemy', value: finalDamage, crit });
        
        // Party attacks
        if (this.player.party && this.player.party.length > 0) {
            this.player.party.forEach(npc => {
                const npcDamage = Math.max(1, Math.floor(npc.atk * 0.4) - Math.floor(this.enemy.def / 4));
                this.enemy.hp -= npcDamage;
                this.addLog(`${npc.name} (${npc.role}) hỗ trợ gây ${npcDamage} sát thương.`);
                this.onUpdate('damage', { target: 'enemy', value: npcDamage, crit: false });
            });
            
            // Coordinated bonus
            const bonus = Math.floor(finalDamage * 0.1 * this.player.party.length);
            this.enemy.hp -= bonus;
            this.addLog(`Liên kích tổ đội gây thêm ${bonus} sát thương!`);
        }
        
        this.endPlayerTurn();
    }

    playerDefend() {
        this.playerDefending = true;
        this.addLog("Bạn vận công phòng thủ, giảm sát thương nhận vào.");
        this.turn = 1;
        this.nextTurn();
    }

    playerSkill() {
        const equippedSecrets = this.player.equippedSecretTechniqueIds || [];
        const usableSecret = equippedSecrets.find(id => id);
        if (usableSecret) {
            this.playerSecretTechnique(usableSecret);
            return;
        }

        const damage = Math.floor(this.player.atk * 1.8);
        this.enemy.hp -= damage;
        this.addLog(`Bạn thi triển Linh Thuật gây ${damage} sát thương!`);
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
            this.addLog("Ngươi chưa có Dị Hỏa để thi triển chiêu này!");
            return;
        }

        const manaCost = 20;
        if (this.player.mana < manaCost) {
            this.addLog("Không đủ Linh Lực để dẫn động Dị Hỏa!");
            return;
        }

        this.player.mana -= manaCost;
        const damage = Math.floor(this.player.atk * flame.power * 1.5);
        this.enemy.hp -= damage;
        this.status.enemy.burn = Math.max(this.status.enemy.burn, 2);
        this.status.enemy.burnPower = Math.max(this.status.enemy.burnPower, this.player.atk * 0.2 * flame.power);
        this.addLog(`Bạn dẫn động ${flame.name} thi triển Hỏa Công gây ${damage} sát thương cực lớn!`);
        this.addLog(`${this.enemy.name} rơi vào trạng thái THIÊU ĐỐT!`);
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
        this.addLog(`Bạn dùng ${getItemById(potion.id)?.name || 'đan dược'}, điều tức hồi phục.`);
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
            this.addLog(`Bạn dùng ${data.name} thoát chiến.`);
            this.isActive = false;
            this.onEnd('escape');
            return;
        }
        this.endPlayerTurn();
    }

    playerSummonBeast() {
        if (!this.player.unlockedProfessions?.includes('beast')) {
            this.addLog("Chưa mở khóa Ngự Thú nên không thể triệu hồi linh thú!");
            return;
        }
        const beast = this.player.beasts?.[0];
        if (!beast) {
            this.addLog("Chưa có linh thú chiến đấu để triệu hồi!");
            return;
        }
        const levelBonus = (this.player.beastLevel || 1) * 10;
        const dmg = Math.max(1, Math.floor((beast.stats?.atk || this.player.atk * 0.4) * 0.7 + levelBonus));
        this.enemy.hp -= dmg;
        this.addLog(`Linh thú ${beast.name} xuất chiến, gây ${dmg} sát thương!`);
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
            this.addLog("Chưa mở khóa Ngự Trùng Thuật!");
            return;
        }
        const lvl = this.player.insectLevel || 1;
        const swarmDmg = Math.max(1, Math.floor(this.player.atk * 0.5 + lvl * 20));
        this.enemy.hp -= swarmDmg;
        this.addLog(`Kỳ trùng bầy đàn cắn xé gây ${swarmDmg} sát thương!`);
        this.onUpdate('damage', { target: 'enemy', value: swarmDmg, crit: false });
        this.status.enemy.burn = Math.max(this.status.enemy.burn, 1);
        this.status.enemy.burnPower = Math.max(this.status.enemy.burnPower, lvl * 8);
        this.endPlayerTurn();
    }

    playerSecretTechnique(secretId) {
        if (!secretId) return;
        
        const secretData = getSecretTechniqueById(secretId);
        if (!secretData) return;

        const now = Date.now();
        const lastUsed = this.player.secretTechniqueCooldowns[secretId] || 0;
        if (now - lastUsed < secretData.cooldown * 1000) {
            this.addLog(`Bí pháp ${secretData.name} chưa hồi xong!`);
            return;
        }

        // Apply cost
        if (secretData.cost) {
            if (secretData.cost.hp && this.player.hp < this.player.maxHp * secretData.cost.hp) {
                this.addLog("Khí huyết không đủ để thi triển bí pháp!");
                return;
            }
            if (secretData.cost.mana && this.player.mana < secretData.cost.mana) {
                this.addLog("Linh lực không đủ để thi triển bí pháp!");
                return;
            }
            if (secretData.cost.lifespan && this.player.age + secretData.cost.lifespan > this.player.maxAge) {
                this.addLog("Thọ nguyên không đủ để thi triển bí pháp này!");
                return;
            }
            if (secretData.cost.hp) this.player.hp -= Math.floor(this.player.maxHp * secretData.cost.hp);
            if (secretData.cost.mana) this.player.mana -= secretData.cost.mana;
            if (secretData.cost.lifespan) this.player.age += secretData.cost.lifespan;
        }

        this.player.secretTechniqueCooldowns[secretId] = now;

        let damage = 0;
        if (secretData.effect.type === 'damage') {
            damage = secretData.effect.value;
            this.enemy.hp -= damage;
            this.addLog(`Bạn thi triển ${secretData.name} gây ${damage} sát thương!`);
        } else if (secretData.effect.atkMultiplier) {
            damage = Math.floor(this.player.atk * secretData.effect.atkMultiplier);
            this.enemy.hp -= damage;
            this.addLog(`Bạn kích hoạt ${secretData.name}, bộc phát ${damage} sát thương!`);
        } else if (secretData.effect.type === 'escape') {
            this.addLog(`Bạn thi triển ${secretData.name} và thoát khỏi trận chiến!`);
            setTimeout(() => this.onEnd('escape'), 1000);
            this.isActive = false;
            return;
        }

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
        let damage = Math.max(1, this.enemy.atk - Math.floor(this.player.def / 2));
        if (this.enemyArchetype === 'ASSASSIN' && Math.random() < 0.35) {
            const truePart = Math.floor(this.enemy.atk * 0.3);
            const normalPart = Math.max(1, this.enemy.atk - Math.floor(this.player.def * 0.35));
            damage = truePart + normalPart;
            this.addLog(`${this.enemy.name} thi triển thân pháp, xuyên qua phòng ngự!`);
            if (Math.random() < 0.15) this.status.player.stun = Math.max(this.status.player.stun, 1);
        } else if (this.enemyArchetype === 'BERSERKER' && Math.random() < 0.25) {
            damage = Math.floor(damage * 1.4);
            this.addLog(`${this.enemy.name} vung đòn bạo kích hung mãnh!`);
        } else if (this.enemyArchetype === 'TANK' && Math.random() < 0.3) {
            this.enemy.def = Math.floor(this.enemy.def * 1.1);
            this.addLog(`${this.enemy.name} vận giáp khí, phòng ngự gia tăng!`);
        }
        if (this.playerDefending) {
            damage = Math.floor(damage * 0.3);
            this.playerDefending = false;
        }

        this.player.hp -= damage;
        this.addLog(`${this.enemy.name} tấn công gây ${damage} sát thương.`);
        this.onUpdate('damage', { target: 'player', value: damage, crit: false });

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
                    // Penalty: Artifact is less effective
                    this.addLog(`Không đủ Linh Lực, [${item.name}] mất hiệu lực!`);
                }
            }

            // Durability loss
            if (Math.random() > 0.95) {
                if (!this.player.equipmentMetadata[slot]) {
                    this.player.equipmentMetadata[slot] = { spirit: 0, level: 1, durability: 100 };
                }
                const meta = this.player.equipmentMetadata[slot];
                meta.durability = Math.max(0, meta.durability - 1);
                if (meta.durability === 0) {
                    this.addLog(`[${item.name}] đã bị hỏng!`);
                }
            }
        });
        
        // Ensure stats are updated if durability changed
        this.player.calculateStats();
    }

    win() {
        this.isActive = false;
        this.addLog("Chiến thắng!");
        const reward = Math.floor(this.enemy.maxHp * 0.5);
        this.player.tuVi += reward;
        this.addLog(`Nhận được ${reward} tu vi.`);
        
        // Loot logic
        const lootItems = [];
        if (Math.random() > 0.5) lootItems.push('linh_thao_thap');
        if (Math.random() > 0.8) lootItems.push('ngung_khi_dan');
        if (Math.random() > 0.7) lootItems.push('hoi_huyet_dan');
        
        lootItems.forEach(itemId => {
            this.player.inventory.addItem(itemId, 1);
            this.addLog(`Nhận được vật phẩm: [${itemId}]`);
        });

        this.onUpdate('end');
        setTimeout(() => this.onEnd('win'), 2500);
    }

    lose() {
        this.isActive = false;
        this.addLog("Thất bại...");
        const penalty = Math.floor(this.player.tuVi * 0.05);
        this.player.tuVi -= penalty;
        this.addLog(`Mất ${penalty} tu vi.`);
        this.onUpdate('end');
        setTimeout(() => this.onEnd('lose'), 2500);
    }
}
