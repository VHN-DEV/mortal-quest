import { MOUNTAIN_LAYERS, MOUNTAIN_BEASTS, MOUNTAIN_EVENTS } from '../configs/mountain-data.js';
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
        this.layerProgress = 0;
    }

    start() {
        this.isActive = true;
        this.player.mountainSurvival = { oxygen: 100, toxicity: 0 };
        this.eventCooldown = 8;
        this.layerProgress = 0;
    }

    stop() {
        this.isActive = false;
    }

    update(delta) {
        if (!this.isActive) return;

        const layer = MOUNTAIN_LAYERS.find(l => l.id === this.currentLayer);
        if (!layer) return;
        
        // Decrease oxygen, increase toxicity
        const survivalDrain = 0.1 * layer.survivalFactor * delta;
        this.player.mountainSurvival.oxygen -= survivalDrain;
        this.player.mountainSurvival.toxicity += survivalDrain * 0.5;

        // Health penalties
        if (this.player.mountainSurvival.oxygen <= 0) {
            this.player.hp -= 1 * delta;
            this.player.mountainSurvival.oxygen = 0;
        }
        if (this.player.mountainSurvival.toxicity >= 100) {
            this.player.hp -= 2 * delta;
            this.player.mountainSurvival.toxicity = 100;
        }

        // Passive exploration progress (slower)
        if (this.layerProgress < 100) {
            this.layerProgress += (0.1 / layer.difficulty) * delta;
            if (this.layerProgress > 100) this.layerProgress = 100;
        }

        this.eventCooldown -= delta;
        if (this.eventCooldown <= 0) {
            // Passive events are triggered by the update loop occasionally
            this.triggerLayerEvent(layer, true);
            this.eventCooldown = 15 + Math.random() * 15;
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
                const avoid = Math.random() < (0.2 + fateBias);
                if (avoid) {
                    this.ui.toast(`${rolled.name}! Ngươi tránh được phần lớn nguy hiểm nhờ cảm ứng linh giác.`, "warning");
                } else {
                    this.player.mountainSurvival.toxicity = Math.min(100, this.player.mountainSurvival.toxicity + 15);
                    this.ui.toast(`${rolled.name}! Chịu ảnh hưởng nặng nề từ môi trường.`, "error");
                }
            } else if (rolled.type === 'treasure') {
                const jackpot = Math.random() < (0.15 + fateBias);
                const gain = jackpot ? Math.max(100, Math.floor(this.player.realmId * 8)) : Math.max(30, Math.floor(this.player.realmId * 3));
                this.player.addLingShi(gain);
                this.ui.toast(`${rolled.name}! ${jackpot ? 'Đại cơ duyên, ' : ''}thu được ${gain} Linh Thạch.`, "success");
            } else if (rolled.type === 'weather') {
                this.player.mountainSurvival.oxygen = Math.max(0, this.player.mountainSurvival.oxygen - 20);
                this.ui.toast(`${rolled.name}! Điều kiện sinh tồn trở nên khắc nghiệt hơn.`, "warning");
            }
            return;
        }

        if (isPassive) return; // Không kích hoạt quái thú phục kích khi đang đứng im

        const layerBeasts = MOUNTAIN_BEASTS.filter(b => b.layer === layer.id);
        if (layerBeasts.length > 0 && Math.random() < 0.15) {
            const beast = layerBeasts[Math.floor(Math.random() * layerBeasts.length)];
            
            // Generate enemy object
            const enemyData = {
                name: beast.name,
                img: ASSETS.enemies.wolf, // Use wolf as default for beasts
                statMult: 1.0 + (beast.level / 50),
                race: beast.race || 'SPIRIT_BEAST'
            };
            
            const enemy = new Enemy(beast.level, enemyData);
            
            this.ui.toast(`Yêu thú xuất hiện: ${beast.name} ${beast.icon}`, "warning");
            
            if (window?.game?.startBattle) {
                // Pass the generated enemy to startBattle
                window.game.startBattle(state.currentWorldId, state.currentLocId, null, enemy);
            }
        }
    }

    moveDeeper() {
        if (this.layerProgress < 100) {
            this.ui.toast("Ngươi chưa thám hiểm hết tầng này để có thể tiến sâu hơn!", "info");
            return false;
        }

        const currentIndex = MOUNTAIN_LAYERS.findIndex(l => l.id === this.currentLayer);
        if (currentIndex < MOUNTAIN_LAYERS.length - 1) {
            const nextLayer = MOUNTAIN_LAYERS[currentIndex + 1];
            if (this.player.realmId >= nextLayer.minRealm) {
                this.currentLayer = nextLayer.id;
                this.layerProgress = 0;
                this.ui.toast(`Đã tiến vào ${nextLayer.name}!`, "warning");
                return true;
            } else {
                this.ui.toast(`Cảnh giới không đủ để tiến vào ${nextLayer.name}!`, "error");
            }
        } else {
            this.ui.toast("Ngươi đã chạm đến điểm sâu nhất của Đại Sơn!", "success");
        }
        return false;
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
