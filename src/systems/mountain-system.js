import { MOUNTAIN_LAYERS, MOUNTAIN_BEASTS, MOUNTAIN_EVENTS, MOUNTAIN_TIERS, MOUNTAIN_BOSSES } from '../configs/mountain-data.js';
import { state } from '../state.js';
import { Enemy } from '../core/enemy.js';
import { ASSETS } from '../configs/asset-data.js';

export class MountainSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        this.currentLayer = 'chan_nui';
        this.isActive = false;
        this.eventCooldown = 0;
        this.layerProgress = 0; // Current run progress
        
        // Persistent State (should be moved to state.js eventually)
        this.discovery = {}; // { layerId: progress % }
        this.bossDefeated = {}; // { tierId: boolean }
        this.timeInMountain = 0; // Internal mountain minutes
        this.reputation = 0; // Mountain reputation (Huyết Thủ Ma Quân etc)
    }

    start() {
        this.isActive = true;
        this.player.mountainSurvival = this.player.mountainSurvival || { oxygen: 100, toxicity: 0 };
        this.eventCooldown = 8;
        this.layerProgress = 0;
        
        // Resume from current layer or start at base
        if (!this.currentLayer) this.currentLayer = 'chan_nui';
        this.ui.toast("Bắt đầu hành trình thám hiểm Thập Vạn Đại Sơn...", "warning");
    }

    stop() {
        this.isActive = false;
        // Logic to finalize rewards or save state if needed
    }

    update(delta) {
        if (!this.isActive) return;

        const layer = MOUNTAIN_LAYERS.find(l => l.id === this.currentLayer);
        if (!layer) return;
        
        // Time Dilation: 10 days inside = 1 day outside (approx 10x scale for gameplay feel)
        const timeScale = 10;
        const internalDelta = delta * timeScale;
        this.timeInMountain += internalDelta;

        // Decrease oxygen, increase toxicity
        // Survival drain scales with layer difficulty and hazardScale
        const tier = MOUNTAIN_TIERS.find(t => t.id === layer.tier);
        const hazardMult = tier ? tier.hazardScale : 1.0;
        
        const survivalDrain = 0.05 * layer.survivalFactor * hazardMult * delta;
        this.player.mountainSurvival.oxygen = Math.max(0, this.player.mountainSurvival.oxygen - survivalDrain);
        this.player.mountainSurvival.toxicity = Math.min(100, this.player.mountainSurvival.toxicity + survivalDrain * 0.5);

        // Health penalties
        if (this.player.mountainSurvival.oxygen <= 0) {
            this.player.hp -= 2 * delta * hazardMult;
        }
        if (this.player.mountainSurvival.toxicity >= 100) {
            this.player.hp -= 5 * delta * hazardMult;
        }

        // Death check
        if (this.player.hp <= 0) {
            this.ui.toast("Ngươi đã kiệt sức và gục ngã giữa đại sơn mênh mông...", "error");
            this.stop();
            const overlay = document.getElementById('mountain-overlay');
            if (overlay) state.ui.toggleOverlay(overlay, false);
            return;
        }

        // Passive exploration progress
        if (this.layerProgress < 100) {
            const progressSpeed = 0.05 / layer.difficulty;
            this.layerProgress = Math.min(100, this.layerProgress + progressSpeed * delta);
            
            // Update global discovery
            this.discovery[this.currentLayer] = Math.max(this.discovery[this.currentLayer] || 0, this.layerProgress);
        }

        this.eventCooldown -= delta;
        if (this.eventCooldown <= 0) {
            this.triggerLayerEvent(layer, true);
            this.eventCooldown = 20 + Math.random() * 30;
        }
    }

    explore() {
        if (!this.isActive) return false;
        if (this.player.stamina < 2) {
            this.ui.toast("Thể lực không đủ để tiếp tục thám hiểm!", "error");
            return false;
        }

        const layer = MOUNTAIN_LAYERS.find(l => l.id === this.currentLayer);
        if (!layer) return false;

        this.player.stamina -= 2;
        
        // Visual feedback
        const overlay = document.getElementById('mountain-overlay');
        if (overlay) {
            overlay.classList.remove('animate-mountain-move');
            void overlay.offsetWidth; // Force reflow
            overlay.classList.add('animate-mountain-move');
        }

        const barText = document.getElementById('mountain-progress-text');
        if (barText) {
            barText.classList.remove('animate-progress-pop');
            void barText.offsetWidth;
            barText.classList.add('animate-progress-pop');
        }
        
        // Manual progress (faster)
        const progressGain = (5 + Math.random() * 5) / layer.difficulty;
        this.layerProgress = Math.min(100, this.layerProgress + progressGain);

        // Immediate event check
        this.triggerLayerEvent(layer);

        return true;
    }

    triggerLayerEvent(layer, isPassive = false) {
        const luck = this.player.luck || 50;
        const karma = this.player.karma || 0;
        const fateBias = Math.max(-0.25, Math.min(0.25, (luck - 50) / 200 + karma / 4000));

        const layerEvents = MOUNTAIN_EVENTS.filter(e => e.layer === 'any' || e.layer === layer.id);
        const rolled = layerEvents.find(e => Math.random() < (e.chance + fateBias * 0.1));
        
        if (rolled) {
            if (rolled.type === 'hazard') {
                const avoid = Math.random() < (0.2 + fateBias + (this.player.stats.spd / 1000));
                if (avoid) {
                    this.ui.toast(`${rolled.name}! Nhờ linh giác nhạy bén, ngươi đã tránh được hiểm cảnh.`, "warning");
                } else {
                    this.player.mountainSurvival.toxicity = Math.min(100, this.player.mountainSurvival.toxicity + 15);
                    this.player.hp -= (layer.difficulty * 10);
                    this.ui.toast(`${rolled.name}! Thân thể chịu tổn thương nặng nề.`, "error");
                }
            } else if (rolled.type === 'treasure') {
                this.handleTreasureEvent(rolled, fateBias);
            } else if (rolled.type === 'encounter') {
                this.handleEncounter(rolled);
            }
            return;
        }

        if (isPassive) return; 

        // Combat check
        const beastChance = 0.15 + (this.layerProgress / 500); // Higher progress = higher beast chance
        if (Math.random() < beastChance) {
            this.triggerBattle(layer);
        }
    }

    handleTreasureEvent(event, fateBias) {
        const jackpot = Math.random() < (0.1 + fateBias);
        const resources = MOUNTAIN_LAYERS.find(l => l.id === this.currentLayer)?.resources || [];
        const itemId = resources[Math.floor(Math.random() * resources.length)] || 'ling_thach_ha';
        
        if (jackpot) {
            this.player.inventory.addItem(itemId, 3);
            this.ui.toast(`Kỳ ngộ! Thu được ${jackpot ? '3x ' : '1x '} ${itemId}.`, "success");
        } else {
            const gain = Math.max(50, Math.floor(this.player.realmId * 5));
            this.player.addLingShi(gain);
            this.ui.toast(`${event.name}! Tìm thấy túi đồ bị bỏ lại, có ${gain} Linh Thạch.`, "success");
        }
    }

    async handleEncounter(event) {
        if (!event.options) return;
        
        const choice = await this.ui.promptOptions(
            event.name,
            event.options,
            event.description
        );

        if (choice === 'trade') {
            this.ui.toast("Đang mở giao diện giao dịch...", "info");
            // Logic for trading NPC
        } else if (choice === 'rob') {
            this.reputation -= 10;
            this.player.karma -= 50;
            this.ui.toast("Ngươi đã ra tay cướp bóc! Danh tiếng sụt giảm, sát khí tăng cao.", "error");
            this.triggerBattle(null, true); // Trigger combat with NPC
        } else {
            this.ui.toast("Ngươi quyết định lướt qua, không muốn dính líu thêm nhân quả.", "info");
        }
    }

    triggerBattle(layer, isNpc = false) {
        const layerBeasts = MOUNTAIN_BEASTS.filter(b => b.layer === (layer ? layer.id : this.currentLayer));
        const beast = layerBeasts[Math.floor(Math.random() * layerBeasts.length)] || MOUNTAIN_BEASTS[0];
        
        const enemyData = {
            name: isNpc ? "Tán Tu Độc Hành" : beast.name,
            img: isNpc ? ASSETS.npcs.merchant : ASSETS.enemies.wolf,
            statMult: 1.2 + (beast.level / 40),
            race: isNpc ? 'HUMAN' : (beast.race || 'SPIRIT_BEAST')
        };
        
        const enemy = new Enemy(beast.level + (isNpc ? 5 : 0), enemyData);
        this.ui.toast(`${isNpc ? 'Tu sĩ phục kích' : 'Yêu thú xuất hiện'}: ${enemyData.name}!`, "warning");
        
        if (window?.game?.startBattle) {
            window.game.startBattle(state.currentWorldId, state.currentLocId, null, enemy);
        }
    }

    moveDeeper() {
        const layer = MOUNTAIN_LAYERS.find(l => l.id === this.currentLayer);
        if (this.layerProgress < 100) {
            this.ui.toast("Ngươi chưa thám hiểm hết tầng này để có thể tìm được lối đi sâu hơn!", "info");
            return false;
        }

        // Check for Boss of current Tier
        const tierId = layer.tier;
        if (!this.bossDefeated[tierId]) {
            this.ui.toast(`Cảm nhận thấy uy áp cực mạnh phía trước! Ngươi phải đánh bại Chúa Tể vùng ${tierId} để tiến sâu hơn.`, "error");
            this.triggerBossBattle(tierId);
            return false;
        }

        const currentIndex = MOUNTAIN_LAYERS.findIndex(l => l.id === this.currentLayer);
        if (currentIndex < MOUNTAIN_LAYERS.length - 1) {
            const nextLayer = MOUNTAIN_LAYERS[currentIndex + 1];
            
            // Check realm requirement for Tier
            const nextTier = MOUNTAIN_TIERS.find(t => t.id === nextLayer.tier);
            if (this.player.realmId < nextTier.minRealm) {
                this.ui.toast(`Cảnh giới không đủ để chịu đựng áp lực tại ${nextLayer.name}!`, "error");
                return false;
            }

            this.currentLayer = nextLayer.id;
            this.layerProgress = 0;
            this.ui.toast(`Đã tiến vào ${nextLayer.name}!`, "warning");
            return true;
        } else {
            this.ui.toast("Ngươi đã chạm đến đỉnh cao nhất của Thánh Sơn!", "success");
        }
        return false;
    }

    triggerBossBattle(tierId) {
        const bossData = MOUNTAIN_BOSSES.find(b => b.tier === tierId);
        if (!bossData) return;

        const enemy = new Enemy(bossData.level, {
            name: bossData.name,
            img: ASSETS.enemies.dragon, // Boss visual
            statMult: 5.0, // High multiplier for bosses
            isBoss: true
        });

        this.ui.toast(`PHỤC KÍCH: ${bossData.name} xuất hiện!`, "error");
        
        if (window?.game?.startBattle) {
            window.game.startBattle(state.currentWorldId, state.currentLocId, null, enemy, (win) => {
                if (win) {
                    this.bossDefeated[tierId] = true;
                    this.ui.toast(`Chúc mừng! Ngươi đã đánh bại ${bossData.name} và có thể tiến sâu hơn.`, "success");
                }
            });
        }
    }

    retreat() {
        const currentIndex = MOUNTAIN_LAYERS.findIndex(l => l.id === this.currentLayer);
        if (currentIndex > 0) {
            const prevLayer = MOUNTAIN_LAYERS[currentIndex - 1];
            this.currentLayer = prevLayer.id;
            this.layerProgress = 100; // Keep progress if retreating
            this.ui.toast(`Lùi về ${prevLayer.name}...`, "info");
            return true;
        } else {
            this.ui.toast("Ngươi quyết định rời khỏi Đại Sơn.", "info");
            this.stop();
            const overlay = document.getElementById('mountain-overlay');
            if (overlay) state.ui.toggleOverlay(overlay, false);
            return true;
        }
    }
}
