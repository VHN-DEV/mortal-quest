import { MOUNTAIN_LAYERS, MOUNTAIN_BEASTS, MOUNTAIN_EVENTS } from '../configs/mountain-data.js';
import { state } from '../state.js';

export class MountainSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        this.currentLayer = 'ngoai_vi';
        this.isActive = false;
        this.eventCooldown = 0;
    }

    start() {
        this.isActive = true;
        this.player.mountainSurvival = { oxygen: 100, toxicity: 0 };
        this.eventCooldown = 8;
    }

    stop() {
        this.isActive = false;
    }

    update(delta) {
        if (!this.isActive) return;

        const layer = MOUNTAIN_LAYERS.find(l => l.id === this.currentLayer);
        if (!layer) return;
        
        // Decrease oxygen, increase toxicity
        this.player.mountainSurvival.oxygen -= 0.1 * layer.survivalFactor * delta;
        this.player.mountainSurvival.toxicity += 0.05 * layer.survivalFactor * delta;

        // Health penalties
        if (this.player.mountainSurvival.oxygen <= 0) {
            this.player.hp -= 1 * delta;
            this.player.mountainSurvival.oxygen = 0;
        }
        if (this.player.mountainSurvival.toxicity >= 100) {
            this.player.hp -= 2 * delta;
            this.player.mountainSurvival.toxicity = 100;
        }

        this.eventCooldown -= delta;
        if (this.eventCooldown <= 0) {
            this.triggerLayerEvent(layer);
            this.eventCooldown = 8 + Math.random() * 7;
        }
    }

    triggerLayerEvent(layer) {
        const luck = this.player.luck || 50;
        const karma = this.player.karma || 0;
        const fateBias = Math.max(-0.25, Math.min(0.25, (luck - 50) / 200 + karma / 4000));

        const layerEvents = MOUNTAIN_EVENTS.filter(e => e.layer === 'any' || e.layer === layer.id);
        const rolled = layerEvents.find(e => Math.random() < e.chance);
        if (rolled) {
            if (rolled.type === 'hazard') {
                const avoid = Math.random() < (0.2 + fateBias);
                if (avoid) {
                    this.ui.toast(`${rolled.name}! Ngươi tránh được phần lớn độc chướng nhờ cảm ứng linh giác.`, "warning");
                } else {
                    this.player.mountainSurvival.toxicity = Math.min(100, this.player.mountainSurvival.toxicity + 12);
                    this.ui.toast(`${rolled.name}! Độc tính tăng mạnh.`, "error");
                }
            } else if (rolled.type === 'treasure') {
                const jackpot = Math.random() < (0.15 + fateBias);
                const gain = jackpot ? Math.max(60, Math.floor(this.player.realmId * 5)) : Math.max(20, Math.floor(this.player.realmId * 2));
                this.player.addLingShi(gain);
                this.ui.toast(`${rolled.name}! ${jackpot ? 'Cơ duyên đại cát, ' : ''}thu được ${gain} Linh Thạch.`, "success");
            } else if (rolled.type === 'weather') {
                this.player.mountainSurvival.oxygen = Math.max(0, this.player.mountainSurvival.oxygen - 15);
                this.ui.toast(`${rolled.name}! Không khí loãng đi nhanh chóng.`, "warning");
            }
            return;
        }

        const layerBeasts = MOUNTAIN_BEASTS.filter(b => b.layer === layer.id);
        if (layerBeasts.length > 0 && Math.random() < 0.2) {
            const beast = layerBeasts[Math.floor(Math.random() * layerBeasts.length)];
            this.ui.toast(`Yêu thú xuất hiện: ${beast.name} ${beast.icon}`, "warning");
            if (window?.game?.startBattle) {
                window.game.startBattle(state.currentWorldId, state.currentLocId);
            }
        }
    }

    moveDeeper() {
        const currentIndex = MOUNTAIN_LAYERS.findIndex(l => l.id === this.currentLayer);
        if (currentIndex < MOUNTAIN_LAYERS.length - 1) {
            const nextLayer = MOUNTAIN_LAYERS[currentIndex + 1];
            if (this.player.realmId >= nextLayer.minRealm) {
                this.currentLayer = nextLayer.id;
                this.ui.toast(`Đã tiến vào ${nextLayer.name}!`, "warning");
                return true;
            } else {
                this.ui.toast(`Cảnh giới không đủ để tiến vào ${nextLayer.name}!`, "error");
            }
        }
        return false;
    }

    retreat() {
        const currentIndex = MOUNTAIN_LAYERS.findIndex(l => l.id === this.currentLayer);
        if (currentIndex > 0) {
            const prevLayer = MOUNTAIN_LAYERS[currentIndex - 1];
            this.currentLayer = prevLayer.id;
            this.ui.toast(`Lùi về ${prevLayer.name}...`, "info");
            return true;
        }
        return false;
    }
}
