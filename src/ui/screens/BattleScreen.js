import { state } from '../../state.js';
import { getFlameById } from '../../configs/alchemy-data.js';
import { getSecretTechniqueById } from '../../configs/technique-data.js';

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
        this.btnPotion = document.getElementById('btn-potion');
        this.btnTalisman = document.getElementById('btn-talisman');
        this.btnBeast = document.getElementById('btn-beast');
        this.btnFormation = document.getElementById('btn-formation');
        this.btnPuppet = document.getElementById('btn-puppet');
        this.btnCorpse = document.getElementById('btn-corpse');
        this.btnInsect = document.getElementById('btn-insect');
        this.secretCursor = 0;
        this.secretList = document.getElementById('battle-secret-list');
    }

    initEvents() {
        if (this.btnAttack) this.btnAttack.onclick = () => this.handleAction('attack');
        if (this.btnDefend) this.btnDefend.onclick = () => this.handleAction('defend');
        if (this.btnSkill) this.btnSkill.onclick = () => this.handleAction('skill');
        if (this.btnFlame) this.btnFlame.onclick = () => this.handleAction('flame');
        if (this.btnPotion) this.btnPotion.onclick = () => this.handleAction('potion');
        if (this.btnTalisman) this.btnTalisman.onclick = () => this.handleAction('talisman');
        if (this.btnBeast) this.btnBeast.onclick = () => this.handleAction('beast');
        if (this.btnFormation) this.btnFormation.onclick = () => this.handleAction('formation');
        if (this.btnPuppet) this.btnPuppet.onclick = () => this.handleAction('puppet');
        if (this.btnCorpse) this.btnCorpse.onclick = () => this.handleAction('corpse');
        if (this.btnInsect) this.btnInsect.onclick = () => this.handleAction('insect');
        if (this.btnSecret) this.btnSecret.onclick = () => this.toggleSecretList();
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
                this.updateProfessionButtons();
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
                this.updateProfessionButtons();
                this.hideSecretList();
                break;
            case 'player-turn-end':
                this.actionContainer.classList.add('hidden');
                this.hideSecretList();
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

    updateProfessionButtons() {
        const unlocked = new Set(state.player?.unlockedProfessions || []);
        const mapping = [
            ['talisman', this.btnTalisman],
            ['beast', this.btnBeast],
            ['formation', this.btnFormation],
            ['puppet', this.btnPuppet],
            ['corpse', this.btnCorpse],
            ['insect', this.btnInsect]
        ];
        mapping.forEach(([profession, button]) => {
            if (!button) return;
            button.classList.toggle('hidden', !unlocked.has(profession));
        });
    }

    updateSecretButton() {
        if (!this.btnSecret) return;
        const secrets = (state.player?.equippedSecretTechniqueIds || []).filter(Boolean);
        if (secrets.length === 0) {
            this.btnSecret.classList.add('hidden');
            return;
        }
        this.btnSecret.classList.remove('hidden');
        this.btnSecret.textContent = `BÍ PHÁP (${secrets.length})`;
        this.btnSecret.title = `Mở danh sách bí pháp đã trang bị`;
    }

    toggleSecretList() {
        if (!this.secretList) return;
        const secrets = (state.player?.equippedSecretTechniqueIds || []).filter(Boolean);
        if (secrets.length === 0) return;
        const hidden = this.secretList.classList.contains('hidden');
        if (!hidden) {
            this.hideSecretList();
            return;
        }
        const now = Date.now();
        this.secretList.innerHTML = secrets.map((id) => {
            const cd = state.player.secretTechniqueCooldowns?.[id] || 0;
            const item = getSecretTechniqueById(id);
            const name = item?.name || id;
            const remainMs = (item?.cooldown || 0) * 1000 - (now - cd);
            const remain = Math.max(0, Math.ceil(remainMs / 1000));
            const disabled = remain > 0;
            return `<button data-secret-id="${id}" ${disabled ? 'disabled' : ''} class="w-full text-left px-2 py-1 rounded border border-white/10 ${disabled ? 'opacity-50' : 'hover:bg-white/10'} text-[10px]">${name}${disabled ? ` (CD: ${remain}s)` : ''}</button>`;
        }).join('');
        this.secretList.querySelectorAll('button[data-secret-id]').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.secretId;
                this.handleAction('secret', id);
                this.hideSecretList();
            };
        });
        this.secretList.classList.remove('hidden');
    }

    hideSecretList() {
        if (this.secretList) this.secretList.classList.add('hidden');
    }

    close() {
        state.ui.toggleOverlay(this.overlay, false);
    }
}
