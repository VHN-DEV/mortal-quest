import { SEEDS, SOILS } from '../configs/garden_data.js';

export class GardenSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
    }

    update(delta) {
        this.player.gardenPlots.forEach(plot => {
            if (plot && plot.status === 'growing') {
                plot.remainingTime -= delta;
                if (plot.remainingTime <= 0) {
                    plot.remainingTime = 0;
                    plot.status = 'ready';
                }
            }
        });
    }

    plant(plotIndex, seedId) {
        const seed = SEEDS.find(s => s.id === seedId);
        if (this.player.gardenPlots[plotIndex] === null) {
            this.player.gardenPlots[plotIndex] = {
                seedId: seedId,
                startTime: Date.now(),
                remainingTime: seed.growthTime,
                status: 'growing'
            };
            return true;
        }
        return false;
    }

    harvest(plotIndex) {
        const plot = this.player.gardenPlots[plotIndex];
        if (plot && plot.status === 'ready') {
            const seed = SEEDS.find(s => s.id === plot.seedId);
            this.player.inventory.addItem(seed.resultId, 1);
            this.player.gardenPlots[plotIndex] = null;
            return true;
        }
        return false;
    }
}
