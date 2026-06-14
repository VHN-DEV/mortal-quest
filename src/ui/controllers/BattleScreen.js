import { state } from '../../state.js';
import { getFlameById } from '../../configs/alchemy-data.js';
import { getSecretTechniqueById } from '../../configs/technique-data.js';
import { ASSETS, getAssetUrl } from '../../configs/asset-data.js';
import { gsap } from 'gsap';
import { audioManager } from '../../utils/audio-manager.js';
import { getSpeedItemsInInventory } from '../../core/combat-engine.js';
import { getItemById } from '../../configs/item-data.js';
import { getQualityColor } from '../../utils/ui-utils.js';

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
        this.playerThanThucBar = document.getElementById('battle-player-than-thuc');
        this.playerThanThucText = document.getElementById('player-than-thuc-text');
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

        // Module 3: Meditate button, dao-heart indicators
        this.btnMeditate = document.getElementById('btn-meditate');
        this.elTamMaIndicator = document.getElementById('player-tam-ma-indicator');
        this.elDaoTamIndicator = document.getElementById('player-dao-tam-indicator');
        this.elTamMaVal = document.getElementById('player-tam-ma-val');
        this.elDaoTamVal = document.getElementById('player-dao-tam-val');
        this.elDaoHeartRow = document.getElementById('player-daoheart-row');

        // Module 4: Artifact attack button
        this.btnArtifact = document.getElementById('btn-artifact');
        this.btnArtifactLabel = document.getElementById('btn-artifact-label');

        // Module 2: Combat event banner
        this.combatEventBanner = document.getElementById('combat-event-banner');

        // Talisman Selection elements
        this.playerTalismanModal = document.getElementById('battle-talisman-modal');
        this.btnTalismanClose = document.getElementById('battle-talisman-close');
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
        if (this.btnTalisman) this.btnTalisman.onclick = () => this.showTalismanModal();
        if (this.btnBeast) this.btnBeast.onclick = () => this.handleAction('beast');
        if (this.btnFormation) this.btnFormation.onclick = () => this.handleAction('formation');
        if (this.btnPuppet) this.btnPuppet.onclick = () => this.handleAction('puppet');
        if (this.btnCorpse) this.btnCorpse.onclick = () => this.handleAction('corpse');
        if (this.btnInsect) this.btnInsect.onclick = () => this.handleAction('insect');
        if (this.btnSoulRepress) this.btnSoulRepress.onclick = () => this.handleAction('soul-repress');
        if (this.btnEscape) this.btnEscape.onclick = () => this.handleAction('escape');
        if (this.btnSecret) this.btnSecret.onclick = () => this.toggleSecretList();


        // Module 3: Meditate button
        if (this.btnMeditate) this.btnMeditate.onclick = () => this.handleAction('meditate');

        // Module 4: Artifact button
        if (this.btnArtifact) this.btnArtifact.onclick = () => this.handleAction('artifact');

        // Enemy Stats Modal events
        if (this.enemyPortraitBtn) {
            this.enemyPortraitBtn.onclick = () => this.showEnemyStats();
        }
        if (this.btnCloseEnemyStats) {
            this.btnCloseEnemyStats.onclick = () => this.hideEnemyStats();
        }
        if (this.btnTalismanClose) {
            this.btnTalismanClose.onclick = () => this.hideTalismanModal();
        }
        if (this.playerTalismanModal) {
            this.playerTalismanModal.onclick = (e) => {
                if (e.target === this.playerTalismanModal) {
                    this.hideTalismanModal();
                }
            };
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
                if (this.btnEscape) this.btnEscape.classList.remove('hidden');
                this.enemyName.textContent = combat.enemy.getDisplayName ? combat.enemy.getDisplayName() : combat.enemy.name;
                if (this.playerName) this.playerName.textContent = state.player.name;
                if (this.playerImg) {
                    const portraitKey = state.player.avatar || (['female', 'Nữ'].includes(state.player.gender) ? 'cultivator_female' : 'cultivator_male');
                    this.playerImg.src = ASSETS.portraits[portraitKey] || ASSETS.portraits.player;
                }
                if (this.enemyRealm) {
                    this.enemyRealm.textContent = (combat.enemy.isRealmConcealed && combat.enemy.isRealmConcealed())
                        ? 'Không thể nhìn thấu'
                        : (combat.enemy.realmName || 'Vô Danh');
                }
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
                this.updateSpecialActions();
                this.hideSecretList();
                this.updateTurnIndicator(0);
                this.updateChantingUI();
                this.updateDaoHeartUI();
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
                
                // Show/hide chase items section dynamically
                const chaseItemsSection = document.getElementById('chase-items-section');
                const chaseItemsList = document.getElementById('chase-items-list');
                
                if (chaseItemsSection && chaseItemsList) {
                    const speedItems = getSpeedItemsInInventory(state.player);
                    if (speedItems.length > 0) {
                        chaseItemsSection.classList.remove('hidden');
                        chaseItemsList.innerHTML = speedItems.map(item => `
                            <button class="w-full p-2.5 bg-qi-jade/10 hover:bg-qi-jade/20 border border-qi-jade/30 rounded-xl text-[10px] font-bold text-qi-jade flex items-center justify-between transition-all active:scale-98"
                                    onclick="window.game.startChase('${item.id}')">
                                <span class="flex items-center space-x-1.5">
                                    <span>${item.icon}</span>
                                    <span>${item.name} (Còn ${item.quantity})</span>
                                </span>
                                <span class="text-[8px] bg-qi-jade/20 px-1.5 py-0.5 rounded font-mono">+${item.bonus} Tốc</span>
                            </button>
                        `).join('');
                    } else {
                        chaseItemsSection.classList.add('hidden');
                        chaseItemsList.innerHTML = '';
                    }
                }
                
                state.ui.toggleOverlay(document.getElementById('chase-overlay'), true);
                break;
            case 'turn':
                this.updateTimeline();
                this.updateTurnIndicator(data.turn);
                this.updateChantingUI();
                break;

            // Module 2: Combat event triggered
            case 'combat-event':
                this.showCombatEventBanner(data);
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
                    } else {
                        // Hủy bỏ — thoát chương trình chiến bình thường
                        state.currentCombat?.onEnd('win');
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
        const danId = enemy.realmId >= 40 ? 'trung_pham_yeu_dan' : 'ha_pham_yeu_dan';
        state.player.inventory.addItem(danId, 1);
        drops.push(`[1x ${danId === 'trung_pham_yeu_dan' ? 'Trung Phẩm Yêu Đan' : 'Hạ Phẩm Yêu Đan'}]`);

        // 2. Yêu Huyết
        if (Math.random() < 0.7) {
            state.player.inventory.addItem('yeu_thu_tinh_huyet', count);
            drops.push(`[${count}x Yêu Thú Tinh Huyết]`);
        }

        // 3. Yêu Cốt
        if (Math.random() < 0.5) {
            state.player.inventory.addItem('yeu_thu_cot', count);
            drops.push(`[${count}x Yêu Thú Cốt]`);
        }

        state.ui.toast(`Ngươi thuần thục mổ xẻ ${enemy.name}, thu được: ${drops.join(', ')}`, "success");
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
        const playerThanThucPercent = ((state.player.thanThuc || 0) / (state.player.maxThanThuc || 50)) * 100;
        
        if (this.enemyHpBar) {
            gsap.to(this.enemyHpBar, { width: `${Math.max(0, enemyHpPercent)}%`, duration: 0.5, ease: "power2.out" });
        }
        if (this.playerHpBar) {
            gsap.to(this.playerHpBar, { width: `${Math.max(0, playerHpPercent)}%`, duration: 0.5, ease: "power2.out" });
        }
        if (this.playerManaBar) {
            gsap.to(this.playerManaBar, { width: `${Math.max(0, playerManaPercent)}%`, duration: 0.5, ease: "power2.out" });
            const color = state.player.getEnergyColor ? state.player.getEnergyColor() : '#22d3ee';
            this.playerManaBar.style.background = `linear-gradient(to right, ${color}d0, ${color})`;
            this.playerManaBar.style.boxShadow = `0 0 8px ${color}60`;
        }
        if (this.playerThanThucBar) {
            gsap.to(this.playerThanThucBar, { width: `${Math.max(0, playerThanThucPercent)}%`, duration: 0.5, ease: "power2.out" });
        }
        
        if (this.enemyHpText) this.enemyHpText.textContent = `${Math.floor(combat.enemy.hp)}/${Math.floor(combat.enemy.maxHp)}`;
        if (this.playerHpText) this.playerHpText.textContent = `${Math.floor(state.player.hp)}/${Math.floor(state.player.maxHp)}`;
        if (this.playerManaText) {
            const label = state.player.getEnergyLabel ? state.player.getEnergyLabel() : 'Pháp Lực';
            this.playerManaText.textContent = `${label} ${Math.floor(state.player.mana)}/${Math.floor(state.player.maxMana)}`;
        }
        if (this.playerThanThucText) {
            this.playerThanThucText.textContent = `TS ${Math.floor(state.player.thanThuc || 0)}/${Math.floor(state.player.maxThanThuc || 50)}`;
        }
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
        // Module 5: Icon-prefixed log entries based on keywords
        const iconMap = [
            { test: /Sát Khí|Chiến Thế|Công Sát/i, icon: '⚔️' },
            { test: /Kiếm Ý|Kiếm Quang/i, icon: '💠' },
            { test: /Dị Hỏa|Thiêu Đốt|hỏa diêm/i, icon: '🔥' },
            { test: /Tâm Ma|Tẩu Hỏa/i, icon: '⚠️' },
            { test: /Pháp Bảo/i, icon: '💙' },
            { test: /Luyện Tâm|Thiền Định/i, icon: '🧘' },
            { test: /BẠO KHỨC|BẠO KÍCH/i, icon: '💥' },
            { test: /Hộ Thân|Phòng Ngự|Bảo Hộ/i, icon: '🛡️' },
            { test: /Đạo Tâm|Hộ Thể/i, icon: '✨' },
            { test: /Thiên Lôi|Thiên Địa/i, icon: '⚡' },
            { test: /Linh Khí Triều|Linh Khí Bạo/i, icon: '🌀' },
            { test: /BI Pháp|Bí Pháp|Bí Thuật/i, icon: '📜' },
            { test: /DạI THẮ́NG|THANH CONG/i, icon: '🏆' },
            { test: /THẢM BẠI/i, icon: '💀' }
        ];
        this.logEl.innerHTML = logs.map(msg => {
            let prefix = '';
            for (const { test, icon } of iconMap) {
                if (test.test(msg)) { prefix = `${icon} `; break; }
            }
            return `<p class="mb-1">${prefix}${msg}</p>`;
        }).join('');
        this.logEl.scrollTop = this.logEl.scrollHeight;
    }

    showDamage(data) {
        // Module 5: Colored floating numbers by actionType
        const colorMap = {
            'attack':      null,       // default white
            'crit':        '#fbbf24',  // gold
            'sword-intent':'#60a5fa',  // blue
            'soul-repress':'#a78bfa',  // purple
            'artifact':    '#4fd1c5',  // cyan/teal
            'event':       '#f97316',  // orange
            'tam_ma':      '#f43f5e',  // rose
            'flame':       '#f97316',  // orange
            'burn':        '#f97316',  // orange
            'skill':       '#34d399',  // emerald
        };
        const color = data.crit ? colorMap['crit'] : (colorMap[data.actionType] || null);
        state.ui.createDamagePopup(data.target === 'enemy' ? this.enemyHpBar : this.playerHpBar, data.value, data.crit, color);

        // Slide/attack kinetic animations for cards
        const targetCard = data.target === 'enemy' ? document.getElementById('enemy-card') : document.getElementById('player-card');
        const attackerCard = data.target === 'enemy' ? document.getElementById('player-card') : document.getElementById('enemy-card');
        const targetImg = data.target === 'enemy' ? this.enemyImg : this.playerImg;

        // Trigger combat VFX
        this.spawnCombatVfx(targetCard, attackerCard, data);

        if (attackerCard && data.value > 0) {
            const slideY = data.target === 'enemy' ? -15 : 15;
            gsap.to(attackerCard, {
                y: slideY,
                duration: 0.12,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
            });
        }

        // Shake target card — Module 5: intensity scales with damage%
        if (targetCard && data.value > 0) {
            const maxHp = data.target === 'enemy' ? state.currentCombat?.enemy?.maxHp : state.player?.maxHp;
            const pct = maxHp ? data.value / maxHp : 0;
            const shakeAmt = pct > 0.3 ? 10 : pct > 0.1 ? 6 : 3;
            const shakeRep = pct > 0.3 ? 10 : 6;
            gsap.fromTo(targetCard, 
                { x: -shakeAmt }, 
                { x: shakeAmt, duration: 0.04, repeat: shakeRep, yoyo: true, ease: "none", onComplete: () => {
                    gsap.set(targetCard, { x: 0 });
                }}
            );
            // Module 5: Flash low-HP enemy border
            if (data.target === 'enemy') this.flashEnemyLowHp();
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

        // Module 4: Artifact (Pháp Bảo Chủ Chiến) attack button
        if (this.btnArtifact && state.currentCombat) {
            const artifactId = state.player.equipment?.phap_bao_cong || state.player.lifeBoundTreasureId;
            const isRecognized = artifactId && (state.player.recognizedItems || []).includes(artifactId);
            if (isRecognized) {
                this.btnArtifact.classList.remove('hidden');
                if (this.btnArtifactLabel) {
                    const energyLabel = state.player.getEnergyLabel ? state.player.getEnergyLabel() : 'Linh Lực';
                    let shortLabel = 'L.Lực';
                    if (energyLabel === 'Chân Nguyên') shortLabel = 'C.Nguyên';
                    else if (energyLabel === 'Thiên Địa Nguyên Khí') shortLabel = 'Nguyên Khí';
                    this.btnArtifactLabel.textContent = `Pháp Bảo (30 ${shortLabel})`;
                }
            } else {
                this.btnArtifact.classList.add('hidden');
            }
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
        
        const isConcealed = enemy.isRealmConcealed && enemy.isRealmConcealed();

        if (nameEl) nameEl.textContent = isConcealed ? enemy.getDisplayName() : enemy.name;
        
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

        if (hpEl) hpEl.textContent = isConcealed ? '??? / ???' : `${Math.floor(enemy.hp)}/${Math.floor(enemy.maxHp)}`;
        if (manaEl) {
            const label = enemy.getEnergyLabel ? enemy.getEnergyLabel() : (enemy.realmId > 17 ? 'Chân Nguyên' : 'Linh Lực');
            if (manaEl.previousElementSibling) {
                manaEl.previousElementSibling.textContent = label;
            }
            manaEl.textContent = isConcealed ? '??? / ???' : `${Math.floor(enemy.mana)}/${Math.floor(enemy.maxMana)}`;
        }
        if (atkEl) atkEl.textContent = isConcealed ? '???' : Math.floor(enemy.atk);
        if (defEl) defEl.textContent = isConcealed ? '???' : Math.floor(enemy.def);
        if (spdEl) spdEl.textContent = isConcealed ? '???' : Math.floor(enemy.spd);
        if (senseEl) senseEl.textContent = isConcealed ? '???' : Math.floor(enemy.divineSense || enemy.maxThanThuc || enemy.perception || 50);

        const comprehensionEl = document.getElementById('enemy-stats-comprehension');
        const physiqueEl = document.getElementById('enemy-stats-physique');
        const daotamEl = document.getElementById('enemy-stats-daotam');
        const heartdemonEl = document.getElementById('enemy-stats-heartdemon');

        if (comprehensionEl) comprehensionEl.textContent = isConcealed ? '???' : Math.floor(enemy.comprehension || 10);
        if (physiqueEl) physiqueEl.textContent = isConcealed ? '???' : Math.floor(enemy.physiqueTalent || 50);
        if (daotamEl) daotamEl.textContent = isConcealed ? '???' : Math.floor(enemy.daoTam || 50);
        if (heartdemonEl) heartdemonEl.textContent = isConcealed ? '???' : `${Math.floor(enemy.heartDemon || 0)}%`;

        const advContainer = document.getElementById('enemy-advanced-stats-container');
        if (advContainer) {
            if (isConcealed) {
                advContainer.innerHTML = `
                    <div class="text-[10px] text-center text-yellow-500/80 py-4 font-ancient">
                        Thần thức bất lực, không thể thăm dò chi tiết!
                    </div>
                `;
            } else {
                const advStats = enemy.advancedStats || {};

                const labels = {
                    critRate: { label: 'Tỷ lệ sơ hở', val: (v) => `${Math.round((advStats.weaknessStrikeChance || v) * 100)}%`, color: 'text-red-400' },
                    critDmg: { label: 'Sát thương sơ hở', val: (v) => `${v.toFixed(1)}x`, color: 'text-red-500' },
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
        // Also ensure stats modal and talisman modal are hidden when combat closes
        this.hideEnemyStats();
        this.hideTalismanModal();
        state.ui.toggleOverlay(this.overlay, false);
        const chaseOverlay = document.getElementById('chase-overlay');
        if (chaseOverlay) {
            state.ui.toggleOverlay(chaseOverlay, false);
        }
    }

    showTalismanModal() {
        if (!this.playerTalismanModal) return;

        const combat = state.currentCombat;
        if (!combat) return;

        // Filter talismans in inventory
        const talismans = state.player.inventory.allItems.filter(i => {
            const data = getItemById(i.id);
            return data && (data.type === 'phu_luc' || data.type === 'talisman');
        });

        const listEl = document.getElementById('battle-talisman-list');
        const emptyEl = document.getElementById('battle-talisman-empty');

        if (talismans.length === 0) {
            if (listEl) listEl.innerHTML = '';
            if (emptyEl) emptyEl.classList.remove('hidden');
        } else {
            if (emptyEl) emptyEl.classList.add('hidden');
            if (listEl) {
                listEl.innerHTML = talismans.map(t => {
                    const data = getItemById(t.id);
                    const qualityName = t.metadata?.quality || 'Phàm Phẩm';
                    const qColor = getQualityColor(qualityName);
                    
                    let desc = data.description || '';
                    if (data.effect) {
                        let mult = 1.0;
                        if (qualityName === 'Hạ Phẩm') mult = 1.1;
                        else if (qualityName === 'Trung Phẩm') mult = 1.25;
                        else if (qualityName === 'Thượng Phẩm') mult = 1.5;
                        else if (qualityName === 'Cực Phẩm') mult = 1.8;
                        else if (qualityName === 'Hoàn Mỹ') mult = 2.2;
                        else if (qualityName === 'Tiên Phẩm') mult = 3.0;

                        if (data.effect.type === 'damage') {
                            const val = Math.floor(data.effect.value * mult);
                            const elem = data.effect.element === 'fire' ? 'Hỏa' : (data.effect.element === 'thunder' ? 'Lôi' : data.effect.element === 'ice' ? 'Băng' : 'Thường');
                            desc = `Gây ${val} sát thương thuộc tính ${elem}.`;
                        } else if (data.effect.type === 'temp_buff' || data.effect.type === 'buff') {
                            const val = Math.floor(data.effect.value * mult);
                            const dur = Math.floor(data.effect.duration * mult);
                            desc = `Tăng ${val} Phòng Thủ & Né Tránh trong ${dur} lượt.`;
                        } else if (data.effect.type === 'control') {
                            const dur = Math.floor(data.effect.duration * mult);
                            const name = data.effect.statusEffect === 'dinh_than' ? 'Định Thân' : 'Nhiếp Hồn';
                            desc = `Khống chế kẻ địch trạng thái [${name}] trong ${dur} lượt.`;
                        } else if (data.effect.type === 'escape') {
                            desc = `Thoát khỏi trận chiến lập tức.`;
                        }
                    }

                    return `
                        <button data-id="${t.id}" data-meta='${JSON.stringify(t.metadata || {})}' 
                            class="w-full flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#cca873]/50 hover:bg-white/[0.04] transition-all duration-200 active:scale-[0.98] text-left">
                            <div class="flex items-center space-x-3">
                                <div class="text-2xl p-1 bg-black/40 border border-white/5 rounded-xl flex items-center justify-center w-10 h-10 select-none">
                                    ${data.icon || '📜'}
                                </div>
                                <div>
                                    <div class="flex items-center space-x-1.5">
                                        <span class="text-xs font-bold text-white">${data.name}</span>
                                        <span class="text-[8px] font-semibold px-1 py-0.2 rounded border uppercase font-mono" style="color: ${qColor}; border-color: ${qColor}30; background-color: ${qColor}08;">
                                            ${qualityName}
                                        </span>
                                    </div>
                                    <p class="text-[9px] text-gray-400 mt-0.5 line-clamp-2 max-w-[185px]">${desc}</p>
                                </div>
                            </div>
                            <div class="flex flex-col items-end justify-center">
                                <span class="text-[10px] font-bold text-[#cca873] bg-[#cca873]/10 px-2 py-0.5 rounded-full font-mono">x${t.quantity}</span>
                            </div>
                        </button>
                    `;
                }).join('');

                // Set click handlers
                listEl.querySelectorAll('button[data-id]').forEach(btn => {
                    btn.onclick = () => {
                        const id = btn.dataset.id;
                        const meta = JSON.parse(btn.dataset.meta || '{}');
                        this.handleAction('talisman', { id, metadata: meta });
                        this.hideTalismanModal();
                    };
                });
            }
        }

        // Show modal with animation
        this.playerTalismanModal.classList.remove('hidden');
        setTimeout(() => {
            this.playerTalismanModal.classList.remove('opacity-0');
            const inner = this.playerTalismanModal.querySelector('.transform');
            if (inner) {
                inner.classList.remove('scale-95');
                inner.classList.add('scale-100');
            }
        }, 10);
    }

    hideTalismanModal() {
        if (!this.playerTalismanModal) return;
        this.playerTalismanModal.classList.add('opacity-0');
        const inner = this.playerTalismanModal.querySelector('.transform');
        if (inner) {
            inner.classList.remove('scale-100');
            inner.classList.add('scale-95');
        }
        setTimeout(() => {
            this.playerTalismanModal.classList.add('hidden');
        }, 300);
    }



    // ─────────────────────────────────────────────────────────────────────────
    // MODULE 3: updateDaoHeartUI — show/hide Tam Ma / Dao Tam indicators
    // ─────────────────────────────────────────────────────────────────────────
    updateDaoHeartUI() {
        const combat = state.currentCombat;
        if (!combat) return;
        const hd = combat.combatHeartDemon || 0;
        const dt = combat.combatDaoTam || 0;
        const showRow = hd > 30 || dt > 70;
        if (this.elDaoHeartRow) {
            this.elDaoHeartRow.classList.toggle('hidden', !showRow);
            this.elDaoHeartRow.style.display = showRow ? 'flex' : 'none';
        }
        if (this.elTamMaIndicator) {
            const show = hd > 30;
            this.elTamMaIndicator.classList.toggle('hidden', !show);
            this.elTamMaIndicator.style.display = show ? 'flex' : 'none';
            if (this.elTamMaVal) this.elTamMaVal.textContent = `${Math.floor(hd)}%`;
        }
        if (this.elDaoTamIndicator) {
            const show = dt > 70;
            this.elDaoTamIndicator.classList.toggle('hidden', !show);
            this.elDaoTamIndicator.style.display = show ? 'flex' : 'none';
            if (this.elDaoTamVal) this.elDaoTamVal.textContent = `${Math.floor(dt)}`;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MODULE 2: showCombatEventBanner — flash a temporary event notification
    // ─────────────────────────────────────────────────────────────────────────
    showCombatEventBanner(data) {
        if (!this.combatEventBanner || !data) return;
        this.combatEventBanner.textContent = `${data.icon} ${data.name}`;
        this.combatEventBanner.style.color = data.color || '#ffffff';
        this.combatEventBanner.style.borderColor = (data.color || '#ffffff') + '40';
        this.combatEventBanner.style.backgroundColor = (data.color || '#ffffff') + '15';
        this.combatEventBanner.classList.remove('hidden');
        // Auto-hide after 2.5s
        clearTimeout(this._eventBannerTimer);
        this._eventBannerTimer = setTimeout(() => {
            if (this.combatEventBanner) this.combatEventBanner.classList.add('hidden');
        }, 2500);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MODULE 5: flashEnemyLowHp — pulse enemy card border red when HP < 20%
    // ─────────────────────────────────────────────────────────────────────────
    flashEnemyLowHp() {
        if (!state.currentCombat) return;
        const enemy = state.currentCombat.enemy;
        const pct = enemy.hp / enemy.maxHp;
        const card = document.getElementById('enemy-card');
        if (!card) return;
        if (pct < 0.2) {
            card.style.borderColor = 'rgba(239,68,68,0.8)';
            card.style.boxShadow = '0 0 20px rgba(239,68,68,0.4)';
            // Keep flashing
            if (!this._lowHpFlashing) {
                this._lowHpFlashing = true;
                const flash = () => {
                    if (!state.currentCombat || state.currentCombat.enemy.hp / state.currentCombat.enemy.maxHp >= 0.2) {
                        this._lowHpFlashing = false;
                        if (card) { card.style.borderColor = ''; card.style.boxShadow = ''; }
                        return;
                    }
                    gsap.to(card, { borderColor: 'rgba(239,68,68,0.9)', boxShadow: '0 0 30px rgba(239,68,68,0.6)', duration: 0.4, yoyo: true, repeat: 1,
                        onComplete: () => setTimeout(flash, 600)
                    });
                };
                flash();
            }
        } else {
            this._lowHpFlashing = false;
            card.style.borderColor = '';
            card.style.boxShadow = '';
        }
    }
}
