import { state } from '../../state.js';
import { getFlameById } from '../../configs/alchemy-data.js';

/**
 * Quản lý giao diện và logic của màn hình Chiến Đấu.
 */
export class BattleScreen {
    constructor() {
        this.initElements();
        this.initEvents();
    }

    initElements() {
        this.overlay = document.getElementById('battle-overlay');
        this.logEl = document.getElementById('battle-log');
        
        // Enemy elements
        this.enemyName = document.getElementById('battle-enemy-name');
        this.enemyHpBar = document.getElementById('battle-enemy-hp');
        this.enemyImg = document.getElementById('enemy-img');
        
        // Player elements
        this.playerName = document.getElementById('battle-player-name');
        this.playerHpBar = document.getElementById('battle-player-hp');
        
        // Actions
        this.actionContainer = document.getElementById('battle-actions');
        this.btnAttack = document.getElementById('btn-attack');
        this.btnDefend = document.getElementById('btn-defend');
        this.btnSkill = document.getElementById('btn-skill');
        this.btnFlame = document.getElementById('btn-flame');
        this.btnSecret = document.getElementById('btn-secret');
        this.secretCursor = 0;
    }

    initEvents() {
        if (this.btnAttack) this.btnAttack.onclick = () => this.handleAction('attack');
        if (this.btnDefend) this.btnDefend.onclick = () => this.handleAction('defend');
        if (this.btnSkill) this.btnSkill.onclick = () => this.handleAction('skill');
        if (this.btnFlame) this.btnFlame.onclick = () => this.handleAction('flame');
        if (this.btnSecret) this.btnSecret.onclick = () => {
            const secrets = (state.player?.equippedSecretTechniqueIds || []).filter(Boolean);
            if (secrets.length === 0) return;
            const id = secrets[this.secretCursor % secrets.length];
            this.handleAction('secret', id);
            this.secretCursor = (this.secretCursor + 1) % secrets.length;
            this.updateSecretButton();
        };
    }

    handleAction(type, payload = null) {
        if (state.currentCombat) {
            state.currentCombat.doAction(type, payload);
        }
    }

    render(type, data) {
        if (!state.currentCombat) return;

        const combat = state.currentCombat;

        switch(type) {
            case 'start':
                state.ui.toggleOverlay(this.overlay, true);
                this.enemyName.textContent = combat.enemy.name;
                this.playerName.textContent = state.player.name;
                this.updateHPs();
                this.logEl.innerHTML = '';
                this.checkFlameButton();
                this.updateSecretButton();
                break;
            case 'log':
                this.updateLog(combat.log);
                break;
            case 'damage':
                this.updateHPs();
                this.showDamage(data);
                break;
            case 'player-turn-start':
                this.actionContainer.classList.remove('hidden');
                break;
            case 'player-turn-end':
                this.actionContainer.classList.add('hidden');
                break;
            case 'end':
                this.actionContainer.classList.add('hidden');
                break;
        }
    }

    updateHPs() {
        const combat = state.currentCombat;
        const enemyHpPercent = (combat.enemy.hp / combat.enemy.maxHp) * 100;
        const playerHpPercent = (state.player.hp / state.player.maxHp) * 100;
        
        this.enemyHpBar.style.width = `${Math.max(0, enemyHpPercent)}%`;
        this.playerHpBar.style.width = `${Math.max(0, playerHpPercent)}%`;
    }

    updateLog(logs) {
        this.logEl.innerHTML = logs.map(msg => `<p class="mb-1">${msg}</p>`).join('');
        this.logEl.scrollTop = this.logEl.scrollHeight;
    }

    showDamage(data) {
        const anchor = data.target === 'enemy' ? this.enemyHpBar : this.playerHpBar;
        state.ui.createDamagePopup(anchor, data.value, data.crit);
    }

    checkFlameButton() {
        const flame = getFlameById(state.player.currentFlame);
        if (flame && flame.type === 'di_hoa') {
            this.btnFlame.classList.remove('hidden');
        } else {
            this.btnFlame.classList.add('hidden');
        }
    }

    updateSecretButton() {
        if (!this.btnSecret) return;
        const secrets = (state.player?.equippedSecretTechniqueIds || []).filter(Boolean);
        if (secrets.length === 0) {
            this.btnSecret.classList.add('hidden');
            return;
        }
        this.btnSecret.classList.remove('hidden');
        const current = secrets[this.secretCursor % secrets.length];
        this.btnSecret.textContent = `BÍ PHÁP (${this.secretCursor + 1}/${secrets.length})`;
        this.btnSecret.title = `Thi triển: ${current}`;
    }

    close() {
        state.ui.toggleOverlay(this.overlay, false);
    }
}
