/**
 * Quản lý trạng thái toàn cục của trò chơi.
 * Giúp tập trung dữ liệu và dễ dàng truy cập từ các module khác nhau.
 */
class GameState {
    constructor() {
        // Cốt lõi
        this.player = null;
        this.ui = null;
        
        // Hệ thống game
        this.systems = {
            shop: null,
            alchemy: null,
            guild: null,
            garden: null,
            mountain: null,
            time: null,
            crafting: null,
            formation: null,
            talisman: null,
            smithing: null,
            beast: null,
            corpse: null,
            technique: null,
            creation: null,
            energy: null,
            puppet: null
        };

        // Trạng thái hiện tại
        this.currentCombat = null;
        this.currentNPC = null;
        this.selectedItemId = null;
        this.currentWorldId = 'nhan_gioi';
        this.currentLocId = null;
        this.explorationProgress = 0;
        
        // View states
        this.views = {
            shop: 'buy',
            alchemy: 'recipes',
            beast: 'list',
            tech: 'cultivation'
        };

        this.currentDestiny = null;
        this.selectedTechId = null;
        this.autoCultivateInterval = null;
    }

    /**
     * Gán nhanh các system vào state
     */
    initSystems(systems) {
        Object.assign(this.systems, systems);
    }
}

export const state = new GameState();
