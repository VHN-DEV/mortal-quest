import { state } from '../../state.js';
import { getFlameById } from '../../configs/alchemy-data.js';
import { getSecretTechniqueById } from '../../configs/technique-data.js';
import { ASSETS, getAssetUrl } from '../../configs/asset-data.js';
import { gsap } from 'gsap';
import { audioManager } from '../../utils/audio-manager.js';

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
        this.enemyPortraitBtn = document.getElementById('enemy-portrait-btn');
        this.enemyStatsModal = document.getElementById('battle-enemy-stats-modal');
        this.btnCloseEnemyStats = document.getElementById('btn-close-enemy-stats');
        
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
        
        // Actions & Tabs
        this.tabs = document.querySelectorAll('.combat-tab');
        this.panes = document.querySelectorAll('.tab-pane');
        this.actionContainer = document.querySelector('#battle-tab-content').parentElement;

        this.btnAttack = document.getElementById('btn-attack');
        this.btnSwordIntent = document.getElementById('btn-sword-intent');
        this.btnDefend = document.getElementById('btn-defend');
        this.btnDodge = document.getElementById('btn-dodge');
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
        this.btnSoulRepress = document.getElementById('btn-soul-repress');
        this.btnEscape = document.getElementById('btn-escape');

        this.chantingContainer = document.getElementById('battle-chanting-container');
        this.chantingText = document.getElementById('chanting-turns');
        this.chantingBar = document.getElementById('chanting-progress');

        this.secretList = document.getElementById('battle-secret-list');
    }

    initEvents() {
        // Tab switching
        this.tabs.forEach(tab => {
            tab.onclick = () => this.switchTab(tab.dataset.tab);
        });

        // Actions
        if (this.btnAttack) this.btnAttack.onclick = () => this.handleAction('attack');
        if (this.btnSwordIntent) this.btnSwordIntent.onclick = () => this.handleAction('sword-intent');
        if (this.btnDefend) this.btnDefend.onclick = () => this.handleAction('defend');
        if (this.btnDodge) this.btnDodge.onclick = () => this.handleAction('dodge');
        if (this.btnSkill) this.btnSkill.onclick = () => this.handleAction('skill');
        if (this.btnFlame) this.btnFlame.onclick = () => this.handleAction('flame');
        if (this.btnPotion) this.btnPotion.onclick = () => this.handleAction('potion');
        if (this.btnTalisman) this.btnTalisman.onclick = () => this.handleAction('talisman');
        if (this.btnBeast) this.btnBeast.onclick = () => this.handleAction('beast');
        if (this.btnFormation) this.btnFormation.onclick = () => this.handleAction('formation');
        if (this.btnPuppet) this.btnPuppet.onclick = () => this.handleAction('puppet');
        if (this.btnCorpse) this.btnCorpse.onclick = () => this.handleAction('corpse');
        if (this.btnInsect) this.btnInsect.onclick = () => this.handleAction('insect');
        if (this.btnSoulRepress) this.btnSoulRepress.onclick = () => this.handleAction('soul-repress');
        if (this.btnEscape) this.btnEscape.onclick = () => this.handleAction('escape');
        if (this.btnSecret) this.btnSecret.onclick = () => this.toggleSecretList();

        // Enemy Stats Modal events
        if (this.enemyPortraitBtn) {
            this.enemyPortraitBtn.onclick = () => this.showEnemyStats();
        }
        if (this.btnCloseEnemyStats) {
            this.btnCloseEnemyStats.onclick = () => this.hideEnemyStats();
        }
    }

    switchTab(tabId) {
        this.tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
        this.panes.forEach(p => p.classList.toggle('hidden', p.id !== `tab-${tabId}`));
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
                audioManager.playBgm('battle');
                this.enemyName.textContent = combat.enemy.name;
                if (this.playerName) this.playerName.textContent = state.player.name;
                if (this.playerImg) {
                    const portraitKey = state.player.avatar || (['female', 'Nữ'].includes(state.player.gender) ? 'cultivator_female' : 'cultivator_male');
                    this.playerImg.src = ASSETS.portraits[portraitKey] || ASSETS.portraits.player;
                }
                if (this.enemyRealm) this.enemyRealm.textContent = combat.enemy.realmName || 'Vô Danh';
                if (this.enemyImg) this.enemyImg.src = combat.enemy.image || ASSETS.enemies.wolf;
                if (this.battleBg) {
                    const loc = state.player.currentLocationId;
                    this.battleBg.style.backgroundImage = `url('${getAssetUrl(`locations/${loc}`)}')`;
                }
                this.updateHPs();
                this.updateStatusEffects();
                this.logEl.innerHTML = '';
                this.updateProfessionTabs();
                this.updateSpecialActions();
                this.updateSecretButton();
                this.updateTurnIndicator(combat.turn);
                this.updateTimeline();
                this.updateChantingUI();
                this.switchTab('cong');
                break;
            case 'log':
                this.updateLog(combat.log);
                break;
            case 'damage':
                this.updateHPs();
                this.showDamage(data);
                this.updateStatusEffects();
                if (data.value > 0) {
                    audioManager.playSfx(data.crit ? 'combat_crit' : 'combat_hit');
                    if (data.crit || data.value > (state.player.maxHp * 0.1)) {
                        state.ui.screenShake(data.crit ? 'high' : 'medium');
                    }
                }
                break;
            case 'player-turn-start':
                this.actionContainer.classList.remove('hidden');
                this.updateProfessionTabs();
                this.hideSecretList();
                this.updateTurnIndicator(0);
                this.updateChantingUI();
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
                this.updateChantingUI();
                break;
            case 'loot':
                this.handlePostBattleLoot(data.enemy);
                break;
            case 'end':
                this.actionContainer.classList.add('hidden');
                audioManager.playBgm('main');
                break;
        }
    }

    handlePostBattleLoot(enemy) {
        const isMonster = ['SPIRIT_BEAST', 'DRAGON', 'ZOMBIE', 'GHOST'].includes(enemy.race);

        if (isMonster) {
            // Hiển thị lựa chọn thu thập cho Yêu Thú
            const options = [
                { label: 'Thu Thập Nguyên Liệu', value: 'materials', icon: 'ph-flask', desc: 'Mổ xẻ lấy nội đan, huyết nhục, xương cốt... (Dùng luyện đan, luyện khí)' },
                { label: 'Thu Thập Xác (Luyện Thi)', value: 'corpse', icon: 'ph-skull', desc: 'Giữ nguyên thi thể để bán hoặc luyện chế thi khôi.' },
                { label: 'Lục Soát Đồ Đạc', value: 'search', icon: 'ph-hand-pointing', desc: 'Tìm xem trên người nó có vật phẩm gì rơi rớt không.' }
            ];

            state.ui.promptOptions(`Chiến Lợi Phẩm: ${enemy.name}`, options, "Ngươi muốn xử lý thi thể này như thế nào?")
                .then(choice => {
                    if (choice === 'materials') {
                        this.extractMonsterMaterials(enemy);
                        setTimeout(() => state.currentCombat?.onEnd('win'), 1000);
                    } else if (choice === 'corpse') {
                        this.collectMonsterCorpse(enemy);
                        setTimeout(() => state.currentCombat?.onEnd('win'), 1000);
                    } else if (choice === 'search') {
                        window.game.screens.loot.open(enemy);
                    }
                });
        } else {
            // Đối với Tu sĩ/Chủng tộc thông minh -> Mở màn hình Loot PUBG
            window.game.screens.loot.open(enemy);
        }
    }

    extractMonsterMaterials(enemy) {
        const drops = [];
        // Tỷ lệ rơi nguyên liệu dựa trên level/realm
        const count = 1 + Math.floor(enemy.realmId / 10);
        
        // 1. Yêu Đan (100%)
        const danId = enemy.realmId >= 40 ? 'yeu_dan_trung' : 'yeu_dan_so';
        state.player.inventory.addItem(danId, 1);
        drops.push(`[1x ${danId === 'yeu_dan_trung' ? 'Yêu Đan Trung Cấp' : 'Yêu Đan Sơ Cấp'}]`);

        // 2. Yêu Huyết
        if (Math.random() < 0.7) {
            state.player.inventory.addItem('yeu_huyet', count);
            drops.push(`[${count}x Yêu Thú Tinh Huyết]`);
        }

        // 3. Yêu Cốt
        if (Math.random() < 0.5) {
            state.player.inventory.addItem('yeu_cot', count);
            drops.push(`[${count}x Yêu Thú Cốt]`);
        }

        state.ui.alert(`Ngươi thuần thục mổ xẻ ${enemy.name}, thu được: ${drops.join(', ')}`, "Thu Thập Nguyên Liệu");
    }

    collectMonsterCorpse(enemy) {
        state.player.inventory.addItem('xac_yeu_thu', 1, { 
            originalName: enemy.name, 
            realmId: enemy.realmId,
            race: enemy.race 
        });
        state.ui.toast(`Đã thu hồi xác của ${enemy.name} vào túi trữ vật.`, "success");
    }

    updateHPs() {
        const combat = state.currentCombat;
        const enemyHpPercent = (combat.enemy.hp / combat.enemy.maxHp) * 100;
        const playerHpPercent = (state.player.hp / state.player.maxHp) * 100;
        const playerManaPercent = (state.player.mana / state.player.maxMana) * 100;
        
        if (this.enemyHpBar) {
            gsap.to(this.enemyHpBar, { width: `${Math.max(0, enemyHpPercent)}%`, duration: 0.5, ease: "power2.out" });
        }
        if (this.playerHpBar) {
            gsap.to(this.playerHpBar, { width: `${Math.max(0, playerHpPercent)}%`, duration: 0.5, ease: "power2.out" });
        }
        if (this.playerManaBar) {
            gsap.to(this.playerManaBar, { width: `${Math.max(0, playerManaPercent)}%`, duration: 0.5, ease: "power2.out" });
        }
        
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

        // Active turn glowing border enhancements
        const playerCard = document.getElementById('player-card');
        const enemyCard = document.getElementById('enemy-card');
        if (playerCard && enemyCard) {
            if (turn === 0) {
                playerCard.classList.add('combat-active-turn-player');
                enemyCard.classList.remove('combat-active-turn-enemy');
            } else {
                playerCard.classList.remove('combat-active-turn-player');
                enemyCard.classList.add('combat-active-turn-enemy');
            }
        }
    }

    updateTimeline() {
        if (!this.timeline || !state.currentCombat) return;
        
        const combat = state.currentCombat;
        const order = combat.turnOrder || [];

        this.timeline.innerHTML = order.map(entity => {
            const isActive = (entity.id === 'player' && combat.turn === 0) || (entity.id === 'enemy' && combat.turn === 1);
            const portraitKey = state.player.avatar || (['female', 'Nữ'].includes(state.player.gender) ? 'cultivator_female' : 'cultivator_male');
            const img = entity.id === 'player' ? (ASSETS.portraits[portraitKey] || ASSETS.portraits.player) : (combat.enemy.image || ASSETS.enemies.wolf);
            
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
            Object.entries(combat.status.enemy).forEach(([key, value]) => {
                if (value > 0) {
                    let icon = 'ph-fire';
                    let color = 'text-red-500';
                    if (key === 'stun') { icon = 'ph-lightning'; color = 'text-yellow-500'; }
                    this.enemyStatusContainer.innerHTML += `<div class="w-4 h-4 bg-black/40 border border-white/10 rounded flex items-center justify-center text-[8px] ${color}" title="${key}"><i class="ph ${icon}"></i></div>`;
                }
            });
        }

        if (this.playerStatusContainer) {
            this.playerStatusContainer.innerHTML = '';
            Object.entries(combat.status.player).forEach(([key, value]) => {
                if (value > 0) {
                    let icon = 'ph-lightning';
                    let color = 'text-yellow-500';
                    this.playerStatusContainer.innerHTML += `<div class="w-4 h-4 bg-black/40 border border-white/10 rounded flex items-center justify-center text-[8px] ${color}" title="${key}"><i class="ph ${icon}"></i></div>`;
                }
            });
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

        // Slide/attack kinetic animations for cards
        const targetCard = data.target === 'enemy' ? document.getElementById('enemy-card') : document.getElementById('player-card');
        const attackerCard = data.target === 'enemy' ? document.getElementById('player-card') : document.getElementById('enemy-card');
        const targetImg = data.target === 'enemy' ? this.enemyImg : this.playerImg;

        // Trigger combat VFX
        this.spawnCombatVfx(targetCard, attackerCard, data);

        if (attackerCard && data.value > 0) {
            const slideY = data.target === 'enemy' ? -15 : 15; // Player slides up (-15), Enemy slides down (+15)
            gsap.to(attackerCard, {
                y: slideY,
                duration: 0.12,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
            });
        }

        // Shake target card
        if (targetCard && data.value > 0) {
            gsap.fromTo(targetCard, 
                { x: -6 }, 
                { x: 6, duration: 0.04, repeat: 6, yoyo: true, ease: "none", onComplete: () => {
                    gsap.set(targetCard, { x: 0 });
                }}
            );
        } else if (targetImg && data.value > 0) {
            gsap.fromTo(targetImg, 
                { x: -5 }, 
                { x: 5, duration: 0.05, repeat: 5, yoyo: true, ease: "none", onComplete: () => {
                    gsap.set(targetImg, { x: 0 });
                }}
            );
        }

        // Flash target red
        if (targetImg && data.value > 0) {
            gsap.fromTo(targetImg, 
                { filter: "brightness(2) sepia(1) saturate(10) hue-rotate(-50deg)" }, 
                { filter: "brightness(1) sepia(0) saturate(1) hue-rotate(0deg)", duration: 0.4 }
            );
        }
    }

    spawnCombatVfx(targetCard, attackerCard, data) {
        const arena = document.getElementById('battle-arena');
        if (!arena) return;

        const arenaRect = arena.getBoundingClientRect();
        
        // Find coordinates of target card
        const tRect = targetCard ? targetCard.getBoundingClientRect() : null;
        if (!tRect) return;

        const tCenterX = tRect.left - arenaRect.left + tRect.width / 2;
        const tCenterY = tRect.top - arenaRect.top + tRect.height / 2;

        // Find coordinates of attacker card
        let aCenterX = tCenterX;
        let aCenterY = tCenterY;
        if (attackerCard) {
            const aRect = attackerCard.getBoundingClientRect();
            aCenterX = aRect.left - arenaRect.left + aRect.width / 2;
            aCenterY = aRect.top - arenaRect.top + aRect.height / 2;
        }

        const type = data.actionType || 'attack';
        const isCrit = data.crit || false;

        // Define a helper for spawning spark particles
        const spawnSparks = (cx, cy, color, count = 12, size = 6) => {
            for (let i = 0; i < count; i++) {
                const spark = document.createElement('div');
                spark.className = 'absolute rounded-full pointer-events-none z-[110]';
                spark.style.width = `${size}px`;
                spark.style.height = `${size}px`;
                spark.style.backgroundColor = color;
                spark.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
                spark.style.left = `${cx}px`;
                spark.style.top = `${cy}px`;
                arena.appendChild(spark);

                const angle = Math.random() * Math.PI * 2;
                const distance = 40 + Math.random() * 80;
                const destX = Math.cos(angle) * distance;
                const destY = Math.sin(angle) * distance;

                gsap.to(spark, {
                    x: destX,
                    y: destY,
                    scale: 0.2,
                    opacity: 0,
                    duration: 0.4 + Math.random() * 0.4,
                    ease: "power2.out",
                    onComplete: () => spark.remove()
                });
            }
        };

        // 1. CHÍ MẠNG / CRIT arena shockwave
        if (isCrit && data.value > 0) {
            const shock = document.createElement('div');
            shock.className = 'arena-shockwave';
            arena.appendChild(shock);
            gsap.fromTo(shock,
                { scale: 0.4, opacity: 0.8 },
                { scale: 2.2, opacity: 0, duration: 0.5, ease: "power3.out", onComplete: () => shock.remove() }
            );

            // Shake the screen a little extra
            state.ui.screenShake('medium');
        }

        // 2. Specific effects based on type
        if (type === 'miss') {
            // Do nothing, text popup handled by showDamage
            return;
        }

        if (type === 'attack') {
            // Standard Slash trail
            const slash = document.createElement('div');
            slash.className = 'combat-slash-effect';
            const color = data.target === 'enemy' ? '#4fd1c5' : '#ef4444';
            slash.style.setProperty('--slash-color', color);
            slash.style.left = `${tCenterX - 110}px`;
            slash.style.top = `${tCenterY - 2}px`;
            
            const rotation = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 20);
            slash.style.transform = `rotate(${rotation}deg) scaleY(2)`;
            arena.appendChild(slash);

            gsap.fromTo(slash, 
                { width: 0, opacity: 1 },
                { width: 220, opacity: 0, scaleY: 0.2, duration: 0.22, ease: "power2.out", onComplete: () => {
                    slash.remove();
                    spawnSparks(tCenterX, tCenterY, color, 8, 5);
                }}
            );
        }
        else if (type === 'sword-intent') {
            // Spawn 3 rapid flying swords from attacker to target
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    if (this.overlay && !this.overlay.classList.contains('hidden')) {
                        const sword = document.createElement('div');
                        sword.className = 'absolute pointer-events-none z-[120]';
                        sword.style.width = '35px';
                        sword.style.height = '2px';
                        const color = '#4fd1c5';
                        sword.style.background = `linear-gradient(90deg, ${color}, transparent)`;
                        sword.style.boxShadow = `0 0 8px ${color}`;
                        
                        // Start slightly offset around the attacker center
                        const startX = aCenterX + (Math.random() - 0.5) * 40;
                        const startY = aCenterY + (Math.random() - 0.5) * 40;
                        sword.style.left = `${startX}px`;
                        sword.style.top = `${startY}px`;

                        const destX = tCenterX + (Math.random() - 0.5) * 30;
                        const destY = tCenterY + (Math.random() - 0.5) * 30;

                        const angle = Math.atan2(destY - startY, destX - startX) * 180 / Math.PI;
                        sword.style.transform = `rotate(${angle}deg) scaleX(0)`;
                        arena.appendChild(sword);

                        gsap.timeline()
                            .to(sword, { scaleX: 1.5, duration: 0.1, ease: "power1.out" })
                            .to(sword, {
                                x: destX - startX,
                                y: destY - startY,
                                duration: 0.22,
                                ease: "power2.in"
                            })
                            .to(sword, {
                                opacity: 0,
                                scaleX: 0,
                                duration: 0.05,
                                onComplete: () => {
                                    sword.remove();
                                    spawnSparks(destX, destY, color, 5, 4);
                                }
                            });
                    }
                }, i * 120);
            }
        }
        else if (type === 'flame') {
            // Rising sparks and fire blast
            spawnSparks(tCenterX, tCenterY, '#f97316', 20, 8);
            
            const fireBlast = document.createElement('div');
            fireBlast.className = 'absolute rounded-full border border-orange-500 pointer-events-none z-[105]';
            fireBlast.style.left = `${tCenterX}px`;
            fireBlast.style.top = `${tCenterY}px`;
            fireBlast.style.transform = 'translate(-50%, -50%)';
            arena.appendChild(fireBlast);

            gsap.fromTo(fireBlast,
                { width: 10, height: 10, opacity: 1, borderWidth: 4, boxShadow: '0 0 10px #f97316' },
                { width: 150, height: 150, opacity: 0, borderWidth: 0.5, duration: 0.45, ease: "power2.out", onComplete: () => fireBlast.remove() }
            );
        }
        else if (type === 'soul-repress') {
            // Expanding purple mental shockwaves
            const color = '#a855f7';
            for (let i = 0; i < 2; i++) {
                setTimeout(() => {
                    if (this.overlay && !this.overlay.classList.contains('hidden')) {
                        const ripple = document.createElement('div');
                        ripple.className = 'soul-ripple';
                        ripple.style.left = `${tCenterX}px`;
                        ripple.style.top = `${tCenterY}px`;
                        arena.appendChild(ripple);

                        gsap.fromTo(ripple,
                            { width: 15, height: 15, opacity: 1, borderWidth: 3 },
                            { width: 160, height: 160, opacity: 0, borderWidth: 0.5, duration: 0.55, ease: "power2.out", onComplete: () => ripple.remove() }
                        );
                        spawnSparks(tCenterX, tCenterY, color, 6, 5);
                    }
                }, i * 200);
            }
        }
        else if (type === 'skill') {
            // Linh Pháp / Spell - colored blast matching the skill or typical jade/blue
            const color = '#38bdf8'; // Sky blue
            spawnSparks(tCenterX, tCenterY, color, 16, 7);

            const blast = document.createElement('div');
            blast.className = 'absolute rounded-full pointer-events-none z-[105]';
            blast.style.background = `radial-gradient(circle, ${color}33 0%, transparent 70%)`;
            blast.style.left = `${tCenterX}px`;
            blast.style.top = `${tCenterY}px`;
            blast.style.transform = 'translate(-50%, -50%)';
            arena.appendChild(blast);

            gsap.fromTo(blast,
                { width: 20, height: 20, opacity: 1 },
                { width: 180, height: 180, opacity: 0, duration: 0.5, ease: "power2.out", onComplete: () => blast.remove() }
            );
        }
        else if (type === 'secret') {
            // Secret technique - mega golden effect!
            const secretId = data.secretId || '';
            let color = '#fbbf24'; // Gold
            let count = 25;
            let size = 8;
            
            if (secretId.includes('ho_the_kiem_don') || secretId.includes('thanh_nguyen')) {
                color = '#22d3ee'; // Cyan
            } else if (secretId.includes('huyet_sat') || secretId.includes('ma_diem')) {
                color = '#ef4444'; // Red
            } else if (secretId.includes('van_doc')) {
                color = '#22c55e'; // Green
            }

            spawnSparks(tCenterX, tCenterY, color, count, size);

            // Double expanding rings
            for (let j = 0; j < 2; j++) {
                const ring = document.createElement('div');
                ring.className = 'absolute rounded-full border border-white pointer-events-none z-[105]';
                ring.style.borderColor = color;
                ring.style.left = `${tCenterX}px`;
                ring.style.top = `${tCenterY}px`;
                ring.style.transform = 'translate(-50%, -50%)';
                arena.appendChild(ring);

                gsap.fromTo(ring,
                    { width: 10, height: 10, opacity: 1, borderWidth: 5, boxShadow: `0 0 15px ${color}` },
                    { width: 200 + j * 40, height: 200 + j * 40, opacity: 0, borderWidth: 0.2, duration: 0.5 + j * 0.15, ease: "power3.out", onComplete: () => ring.remove() }
                );
            }
        }
        else if (['beast', 'puppet', 'corpse', 'insect', 'formation', 'party'].includes(type)) {
            // Summon types - nature/summon green or gold
            const color = type === 'corpse' ? '#6b7280' : (type === 'insect' ? '#eab308' : '#10b981');
            spawnSparks(tCenterX, tCenterY, color, 12, 6);
        }
    }

    updateProfessionTabs() {
        const unlocked = new Set(state.player?.unlockedProfessions || []);
        
        if (state.player?.mainPath === 'quy_dao') {
            unlocked.add('corpse');
        }
        if (state.player?.specializedPaths?.soul_path?.realmId > 0) {
            unlocked.add('soul_path');
        }

        const tabs = {
            'talisman': 'phu',
            'beast': 'thu-thu',
            'formation': 'tran',
            'puppet': 'loi',
            'corpse': 'thi',
            'insect': 'trung',
            'soul_path': 'hon'
        };

        Object.entries(tabs).forEach(([prof, tabId]) => {
            const tabBtn = document.querySelector(`.combat-tab[data-tab="${tabId}"]`);
            if (tabBtn) tabBtn.classList.toggle('hidden', !unlocked.has(prof));
        });
    }

    updateSpecialActions() {
        // Sword intent
        if (state.player.specializedPaths?.sword?.realmId > 0) {
            this.btnSwordIntent.classList.remove('hidden');
        }

        // Flame
        const flame = getFlameById(state.player.currentFlame);
        if (flame && flame.type === 'di_hoa') {
            this.btnFlame.classList.remove('hidden');
        }
    }

    updateSecretButton() {
        if (!this.btnSecret) return;
        const secrets = (state.player?.equippedSecretTechniqueIds || []).filter(Boolean);
        this.btnSecret.classList.toggle('hidden', secrets.length === 0);
    }

    updateChantingUI() {
        const combat = state.currentCombat;
        if (combat && combat.playerChanting) {
            this.chantingContainer.classList.remove('hidden');
            this.chantingText.textContent = `Còn ${combat.playerChanting.turns} lượt`;
            const percent = (1 - combat.playerChanting.turns / combat.playerChanting.maxTurns) * 100;
            this.chantingBar.style.width = `${percent}%`;
        } else {
            this.chantingContainer.classList.add('hidden');
        }
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
        const categorized = {
            'Pháp Thuật': [],
            'Thần Thông': [],
            'Thần Hồn Thuật': [],
            'Bí Pháp': []
        };
        
        secrets.forEach(id => {
            const cd = state.player.secretTechniqueCooldowns?.[id] || 0;
            const item = getSecretTechniqueById(id);
            if (!item) return;
            const cat = item.category || 'Bí Pháp';
            const remainMs = (item.cooldown || 0) * 1000 - (now - cd);
            const remain = Math.max(0, Math.ceil(remainMs / 1000));
            const disabled = remain > 0;
            if (categorized[cat]) {
                categorized[cat].push({ id, item, remain, disabled });
            }
        });

        const categories = ['Pháp Thuật', 'Thần Thông', 'Thần Hồn Thuật', 'Bí Pháp'];
        const catColors = {
            'Pháp Thuật': 'text-teal-400 border-teal-500/20 bg-teal-500/5',
            'Thần Thông': 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5 shimmer-gold',
            'Thần Hồn Thuật': 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
            'Bí Pháp': 'text-red-400 border-red-500/20 bg-red-500/5'
        };

        let html = '';
        categories.forEach(cat => {
            const list = categorized[cat];
            if (list.length === 0) return;
            
            html += `
                <div class="mb-2">
                    <div class="text-[7px] uppercase tracking-[0.2em] font-ancient px-2 py-1 ${catColors[cat]} rounded-xl font-bold mb-1.5 flex justify-between items-center">
                        <span>${cat}</span>
                    </div>
                    <div class="space-y-1">
                        ${list.map(({ id, item, remain, disabled }) => {
                            // Realm lock verification on click check
                            let isLocked = false;
                            if (cat === 'Thần Thông' && item.requiredRealmId && state.player.realmId < item.requiredRealmId) {
                                isLocked = true;
                            }
                            const displayDisabled = disabled || isLocked;
                            
                            return `
                                <button data-secret-id="${id}" ${displayDisabled ? 'disabled' : ''} 
                                    class="w-full text-left px-3 py-2 rounded-xl border border-white/5 ${displayDisabled ? 'opacity-40 cursor-not-allowed bg-black/20' : 'hover:bg-white/5 active:scale-98'} text-[10px] font-ancient flex justify-between items-center transition-all duration-200">
                                    <span class="flex items-center space-x-1">
                                        <span>${item.icon || '✨'}</span>
                                        <span class="font-bold text-white">${item.name}</span>
                                        ${isLocked ? `<span class="text-[6px] px-1 bg-red-500/20 text-red-300 rounded border border-red-500/30 uppercase">Yêu cầu Trúc Cơ</span>` : ''}
                                    </span>
                                    ${remain > 0 ? `<span class="text-gray-500 font-mono italic">${remain}s</span>` : ''}
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        });

        this.secretList.innerHTML = html;
        
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

    showEnemyStats() {
        const combat = state.currentCombat;
        if (!combat || !combat.enemy) return;

        const enemy = combat.enemy;
        const imgEl = document.getElementById('enemy-stats-img');
        const nameEl = document.getElementById('enemy-stats-name');
        const raceEl = document.getElementById('enemy-stats-race');
        
        if (imgEl) imgEl.src = enemy.image || ASSETS.enemies.wolf;
        if (nameEl) nameEl.textContent = enemy.name;
        
        const races = {
            'HUMAN': 'Nhân Tộc',
            'SPIRIT_BEAST': 'Yêu Tộc',
            'DEMON': 'Ma Tộc',
            'DRAGON': 'Long Tộc',
            'ZOMBIE': 'Thi Tộc',
            'GHOST': 'Quỷ Tộc'
        };
        if (raceEl) raceEl.textContent = races[enemy.race] || enemy.race;
        
        const hpEl = document.getElementById('enemy-stats-hp');
        const manaEl = document.getElementById('enemy-stats-mana');
        const atkEl = document.getElementById('enemy-stats-atk');
        const defEl = document.getElementById('enemy-stats-def');
        const spdEl = document.getElementById('enemy-stats-spd');
        const senseEl = document.getElementById('enemy-stats-sense');

        if (hpEl) hpEl.textContent = `${Math.floor(enemy.hp)}/${Math.floor(enemy.maxHp)}`;
        if (manaEl) manaEl.textContent = `${Math.floor(enemy.mana)}/${Math.floor(enemy.maxMana)}`;
        if (atkEl) atkEl.textContent = Math.floor(enemy.atk);
        if (defEl) defEl.textContent = Math.floor(enemy.def);
        if (spdEl) spdEl.textContent = Math.floor(enemy.spd);
        if (senseEl) senseEl.textContent = Math.floor(enemy.perception);

        const comprehensionEl = document.getElementById('enemy-stats-comprehension');
        const physiqueEl = document.getElementById('enemy-stats-physique');
        const daotamEl = document.getElementById('enemy-stats-daotam');
        const heartdemonEl = document.getElementById('enemy-stats-heartdemon');

        if (comprehensionEl) comprehensionEl.textContent = Math.floor(enemy.comprehension || 10);
        if (physiqueEl) physiqueEl.textContent = Math.floor(enemy.physiqueTalent || 50);
        if (daotamEl) daotamEl.textContent = Math.floor(enemy.daoTam || 50);
        if (heartdemonEl) heartdemonEl.textContent = `${Math.floor(enemy.heartDemon || 0)}%`;

        // Populate advanced stats
        const advContainer = document.getElementById('enemy-advanced-stats-container');
        if (advContainer) {
            const advStats = enemy.advancedStats || {};

            const labels = {
                critRate: { label: 'Tỷ lệ bạo kích', val: (v) => `${Math.round(v * 100)}%`, color: 'text-red-400' },
                critDmg: { label: 'Sát thương bạo kích', val: (v) => `${v.toFixed(1)}x`, color: 'text-red-500' },
                pierce: { label: 'Xuyên giáp', val: (v) => `${Math.round(v * 100)}%`, color: 'text-yellow-400' },
                damageReduction: { label: 'Giảm sát thương', val: (v) => `${Math.round(v * 100)}%`, color: 'text-qi-jade' },
                lifeSteal: { label: 'Hút máu', val: (v) => `${Math.round(v * 100)}%`, color: 'text-red-600' }
            };

            let advHtml = '';
            Object.entries(labels).forEach(([key, cfg]) => {
                const val = advStats[key] || 0;
                if (val > 0 || key === 'critRate' || key === 'critDmg') {
                    advHtml += `
                        <div class="flex justify-between items-center py-1 border-b border-white/[0.02]">
                            <span class="text-gray-500 text-[9px]">${cfg.label}</span>
                            <span class="font-bold ${cfg.color} font-mono text-[9px]">${cfg.val(val)}</span>
                        </div>
                    `;
                }
            });

            // Element multipliers
            const elementLabels = {
                fireDmg: { label: 'Hỏa Sát', color: 'text-orange-400' },
                waterDmg: { label: 'Thủy Sát', color: 'text-blue-400' },
                thunderDmg: { label: 'Lôi Sát', color: 'text-purple-400' },
                poisonDmg: { label: 'Độc Sát', color: 'text-green-400' }
            };
            Object.entries(elementLabels).forEach(([key, cfg]) => {
                const val = advStats[key] || 1.0;
                if (val > 1.0) {
                    advHtml += `
                        <div class="flex justify-between items-center py-1 border-b border-white/[0.02]">
                            <span class="text-gray-500 text-[9px]">${cfg.label}</span>
                            <span class="font-bold ${cfg.color} font-mono text-[9px]">+${Math.round((val - 1) * 100)}%</span>
                        </div>
                    `;
                }
            });

            advContainer.innerHTML = advHtml || '<p class="text-center text-gray-600 text-[8px] py-2">Không có thuộc tính đặc biệt</p>';
        }

        if (this.enemyStatsModal) {
            this.enemyStatsModal.classList.remove('hidden');
        }
    }

    hideEnemyStats() {
        if (this.enemyStatsModal) {
            this.enemyStatsModal.classList.add('hidden');
        }
    }

    close() {
        // Also ensure stats modal is hidden when combat closes
        this.hideEnemyStats();
        state.ui.toggleOverlay(this.overlay, false);
    }
}
