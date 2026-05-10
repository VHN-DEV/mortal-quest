import { getSecretTechniqueById } from '../configs/technique-data.js';

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

        if (this.turn === 0) {
            this.addLog("Đến lượt của bạn. Hãy chọn hành động!");
            this.onUpdate('player-turn-start');
        } else {
            this.addLog(`Lượt của ${this.enemy.name}...`);
            this.onUpdate('player-turn-end');
            setTimeout(() => this.enemyAttack(), 1500);
        }
    }

    // Actions
    doAction(type) {
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
                this.playerSecretTechnique(arguments[1]);
                break;
        }
    }

    playerAttack() {
        const damage = Math.max(1, this.player.atk - Math.floor(this.enemy.def / 2));
        const crit = Math.random() > 0.9;
        const finalDamage = crit ? damage * 2 : damage;
        
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
        
        if (this.enemy.hp <= 0) {
            this.enemy.hp = 0;
            this.win();
        } else {
            this.turn = 1;
            this.nextTurn();
        }
    }

    playerDefend() {
        this.playerDefending = true;
        this.addLog("Bạn vận công phòng thủ, giảm sát thương nhận vào.");
        this.turn = 1;
        this.nextTurn();
    }

    playerSkill() {
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

        let damage = Math.max(1, this.enemy.atk - Math.floor(this.player.def / 2));
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
