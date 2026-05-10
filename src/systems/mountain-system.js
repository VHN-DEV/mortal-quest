import { MOUNTAIN_LAYERS, MOUNTAIN_BEASTS, MOUNTAIN_EVENTS } from '../configs/mountain-data.js';

export class MountainSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        this.currentLayer = 'ngoai_vi';
        this.isActive = false;
    }

    start() {
        this.isActive = true;
        this.player.mountainSurvival = { oxygen: 100, toxicity: 0 };
    }

    stop() {
        this.isActive = false;
    }

    update(delta) {
        if (!this.isActive) return;

        const layer = MOUNTAIN_LAYERS.find(l => l.id === this.currentLayer);
        
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
            this.currentLayer = MOUNTAIN_LAYERS[currentIndex - 1].id;
            this.ui.toast(`Lùi về ${this.currentLayer.name}...`, "info");
            return true;
        }
        return false;
    }
}
