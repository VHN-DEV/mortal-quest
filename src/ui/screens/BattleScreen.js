import { state } from '../../state.js';
import { getFlameById } from '../../configs/alchemy-data.js';
import { getSecretTechniqueById } from '../../configs/technique-data.js';
import { ASSETS, getAssetUrl } from '../../configs/asset-data.js';

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
        this.enemyHpText = document.getElementById('enemy-hp-text');
        this.enemyRealm = document.getElementById('battle-enemy-realm');
        this.enemyImg = document.getElementById('enemy-img');
        this.enemyStatusContainer = document.getElementById('enemy-status-effects');
        
        // Player elements
        this.playerName = document.getElementById('battle-player-name');
        this.playerHpBar = document.getElementById('battle-player-hp');
        this.playerHpText = document.getElementById('player-hp-text');
        this.playerManaBar = document.getElementById('battle-player-mana');
        this.playerManaText = document.getElementById('player-mana-text');
        this.playerImg = document.getElementById('battle-player-img');
        this.playerStatusContainer = document.getElementById('player-status-effects');
        
        // Turn indicator
        this.turnIndicator = document.getElementById('turn-indicator');
        this.battleBg = document.getElementById('battle-bg');
        this.timeline = document.getElementById('battle-timeline');
        
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
        this.btnEscape = document.getElementById('btn-escape');
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
        if (this.btnEscape) this.btnEscape.onclick = () => this.handleAction('escape');
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
                if (this.playerImg) this.playerImg.src = ASSETS.portraits.player;
                if (this.enemyRealm) this.enemyRealm.textContent = combat.enemy.realmName || 'Vô Danh';
                if (this.enemyImg) this.enemyImg.src = combat.enemy.image || ASSETS.enemies.wolf;
                if (this.battleBg) {
                    const loc = state.player.currentLocationId;
                    this.battleBg.style.backgroundImage = `url('${getAssetUrl(`locations/${loc}`)}')`;
                }
                this.updateHPs();
                this.updateStatusEffects();
                this.logEl.innerHTML = '';
                this.checkFlameButton();
                this.updateProfessionButtons();
                this.updateSecretButton();
                this.updateTurnIndicator(combat.turn);
                this.updateTimeline();
                if (this.btnEscape) this.btnEscape.classList.remove('hidden');
                break;
            case 'log':
                this.updateLog(combat.log);
                break;
            case 'damage':
                this.updateHPs();
                this.showDamage(data);
                this.updateStatusEffects();
                break;
            case 'player-turn-start':
                this.actionContainer.classList.remove('hidden');
                this.updateProfessionButtons();
                this.hideSecretList();
                this.updateTurnIndicator(0);
                break;
            case 'player-turn-end':
                this.actionContainer.classList.add('hidden');
                this.hideSecretList();
                this.updateTurnIndicator(1);
                break;
            case 'escape-fail':
                if (this.btnEscape) this.btnEscape.classList.add('hidden');
                break;
            case 'enemy-escape-attempt':
                this.actionContainer.classList.add('hidden');
                state.ui.toggleOverlay(document.getElementById('chase-overlay'), true);
                break;
            case 'turn':
                this.updateTimeline();
                this.updateTurnIndicator(data.turn);
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
        const playerManaPercent = (state.player.mana / state.player.maxMana) * 100;
        
        if (this.enemyHpBar) this.enemyHpBar.style.width = `${Math.max(0, enemyHpPercent)}%`;
        if (this.playerHpBar) this.playerHpBar.style.width = `${Math.max(0, playerHpPercent)}%`;
        if (this.playerManaBar) this.playerManaBar.style.width = `${Math.max(0, playerManaPercent)}%`;
        
        if (this.enemyHpText) this.enemyHpText.textContent = `${Math.floor(combat.enemy.hp)}/${Math.floor(combat.enemy.maxHp)}`;
        if (this.playerHpText) this.playerHpText.textContent = `${Math.floor(state.player.hp)}/${Math.floor(state.player.maxHp)}`;
        if (this.playerManaText) this.playerManaText.textContent = `${Math.floor(state.player.mana)}/${Math.floor(state.player.maxMana)}`;
    }

    updateTurnIndicator(turn) {
        if (!this.turnIndicator) return;
        if (turn === 0) {
            this.turnIndicator.textContent = 'Đến lượt ngươi';
            this.turnIndicator.className = 'px-3 py-1 rounded-full bg-qi-blue/10 border border-qi-blue/20 text-[8px] text-qi-blue font-ancient uppercase tracking-widest animate-pulse';
        } else {
            this.turnIndicator.textContent = 'Lượt đối phương';
            this.turnIndicator.className = 'px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[8px] text-red-400 font-ancient uppercase tracking-widest';
        }
    }

    updateTimeline() {
        if (!this.timeline || !state.currentCombat) return;
        
        const combat = state.currentCombat;
        const order = combat.turnOrder || [
            { id: 'player', name: 'Ngươi', spd: state.player.spd },
            { id: 'enemy', name: combat.enemy.name, spd: combat.enemy.spd }
        ];

        this.timeline.innerHTML = order.map(entity => {
            const isActive = (entity.id === 'player' && combat.turn === 0) || (entity.id === 'enemy' && combat.turn === 1);
            const img = entity.id === 'player' ? ASSETS.portraits.player : (combat.enemy.image || ASSETS.enemies.wolf);
            
            return `
                <div class="relative group">
                    <div class="w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${isActive ? 'border-qi-blue scale-110 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-white/10 opacity-60 grayscale'}">
                        <img src="${img}" class="w-full h-full object-cover">
                    </div>
                    ${isActive ? '<div class="absolute -right-1 -top-1 w-3 h-3 bg-qi-blue rounded-full border-2 border-black animate-pulse"></div>' : ''}
                    <div class="absolute left-12 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 backdrop-blur-md rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        <span class="text-[8px] text-white uppercase tracking-widest font-bold">${entity.name}</span>
                    </div>
                </div>
            `;
        }).join('<div class="w-[1px] h-4 bg-white/5"></div>');
    }

    updateStatusEffects() {
        const combat = state.currentCombat;
        if (!combat) return;

        if (this.enemyStatusContainer) {
            this.enemyStatusContainer.innerHTML = '';
            if (combat.status.enemy.burn > 0) {
                this.enemyStatusContainer.innerHTML += `<div class="w-4 h-4 bg-red-500/20 border border-red-500/50 rounded flex items-center justify-center text-[8px] text-red-500" title="Thiêu đốt"><i class="ph ph-fire"></i></div>`;
            }
            if (combat.status.enemy.stun > 0) {
                this.enemyStatusContainer.innerHTML += `<div class="w-4 h-4 bg-yellow-500/20 border border-yellow-500/50 rounded flex items-center justify-center text-[8px] text-yellow-500" title="Choáng"><i class="ph ph-lightning"></i></div>`;
            }
        }

        if (this.playerStatusContainer) {
            this.playerStatusContainer.innerHTML = '';
            if (combat.status.player.stun > 0) {
                this.playerStatusContainer.innerHTML += `<div class="w-4 h-4 bg-yellow-500/20 border border-yellow-500/50 rounded flex items-center justify-center text-[8px] text-yellow-500" title="Choáng"><i class="ph ph-lightning"></i></div>`;
            }
            if (combat.playerDefending) {
                this.playerStatusContainer.innerHTML += `<div class="w-4 h-4 bg-blue-500/20 border border-blue-500/50 rounded flex items-center justify-center text-[8px] text-blue-500" title="Phòng thủ"><i class="ph ph-shield"></i></div>`;
            }
        }
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
