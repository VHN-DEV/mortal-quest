import { CREATION_CONFIG, CREATION_RACES, CREATION_ROOTS, CREATION_PHYSIQUES, CREATION_ORIGINS, CREATION_TRAITS, CREATION_SCENARIOS } from '../configs/creation-data.js';
import { Player } from '../core/player.js';

const RANDOM_NAMES = [
    'Lâm Phong', 'Mộc Vân', 'Hàn Tuyết', 'Sở Thiên', 'Diệp Trần', 'Vân Mộng', 'Tần Mặc', 'Bạch Ly', 'Tiêu Dao', 'Nguyệt Nhi'
];


export class CreationSystem {
    constructor() {
        this.reset();
    }

    reset() {
        this.mode = 'custom';
        this.points = CREATION_CONFIG.BASE_POINTS;
        this.selectedRace = 'HUMAN';
        this.selectedRoot = 'ngu_hanh_linh_can';
        this.selectedPhysique = 'binh_thuong';
        this.selectedOrigin = 'tan_tu';
        this.selectedTraits = [];
        this.playerName = "Phàm Nhân";
        this.playerGender = "Nam";
        this.playerAge = 18;
        this.playerAvatar = "player_male";
        this.startingLingShi = 0;
        this.startingRealmId = 1;
    }

    selectOrigin(originId) {
        const origin = CREATION_ORIGINS[originId];
        if (!origin) return;
        this.selectedOrigin = originId;
        this.startingLingShi = origin.resources.lingShi;
        this.calculatePoints();
    }

    calculatePoints() {
        let total = CREATION_CONFIG.BASE_POINTS;
        
        // Race cost
        total -= CREATION_RACES[this.selectedRace].cost;

        // Root cost
        total -= CREATION_ROOTS[this.selectedRoot].cost;
        
        // Physique cost
        total -= CREATION_PHYSIQUES[this.selectedPhysique].cost;
        
        // Origin cost
        total -= CREATION_ORIGINS[this.selectedOrigin].cost;
        
        // Traits cost
        this.selectedTraits.forEach(traitId => {
            total -= CREATION_TRAITS[traitId].cost;
        });

        // Starting Ling Shi cost (1 point per 100 Ling Shi, if positive)
        if (this.startingLingShi > 0) {
            total -= Math.floor(this.startingLingShi / 100);
        }
        
        this.points = total;
        return total;
    }

    toggleTrait(traitId) {
        const index = this.selectedTraits.indexOf(traitId);
        if (index > -1) {
            this.selectedTraits.splice(index, 1);
        } else {
            const trait = CREATION_TRAITS[traitId];
            if (trait.type === 'advantage' && this.getAdvantageCount() >= CREATION_CONFIG.MAX_ADVANTAGES) return false;
            if (trait.type === 'disadvantage' && this.getDisadvantageCount() >= CREATION_CONFIG.MAX_DISADVANTAGES) return false;
            this.selectedTraits.push(traitId);
        }
        this.calculatePoints();
        return true;
    }

    getAdvantageCount() {
        return this.selectedTraits.filter(id => CREATION_TRAITS[id].type === 'advantage').length;
    }

    getDisadvantageCount() {
        return this.selectedTraits.filter(id => CREATION_TRAITS[id].type === 'disadvantage').length;
    }

    applyScenario(scenarioId) {
        const scenario = CREATION_SCENARIOS[scenarioId];
        if (!scenario) return;
        
        this.selectedRace = scenario.setup.race || 'HUMAN';
        this.selectedRoot = scenario.setup.root;
        this.selectedPhysique = scenario.setup.physique;
        this.selectedOrigin = scenario.setup.origin;
        this.selectedTraits = [...scenario.setup.traits];
        this.startingLingShi = CREATION_ORIGINS[this.selectedOrigin].resources.lingShi;
        this.startingRealmId = 1;
        this.calculatePoints();
    }

    rollRandom() {
        this.reset();
        this.mode = 'custom';

        this.playerName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
        this.playerGender = Math.random() < 0.5 ? 'Nam' : 'Nữ';
        this.playerAge = Math.floor(Math.random() * 41) + 12;
        this.playerAvatar = this.playerGender === 'Nam' ? 'player_male' : 'player_female';

        const raceKeys = Object.keys(CREATION_RACES);
        this.selectedRace = raceKeys[Math.floor(Math.random() * raceKeys.length)];

        const rootKeys = Object.keys(CREATION_ROOTS);
        this.selectedRoot = rootKeys[Math.floor(Math.random() * rootKeys.length)];
        
        const physKeys = Object.keys(CREATION_PHYSIQUES);
        this.selectedPhysique = physKeys[Math.floor(Math.random() * physKeys.length)];
        
        const originKeys = Object.keys(CREATION_ORIGINS);
        this.selectedOrigin = originKeys[Math.floor(Math.random() * originKeys.length)];
        this.startingLingShi = CREATION_ORIGINS[this.selectedOrigin].resources.lingShi;
        this.startingRealmId = 1;
        
        // Random traits
        const traitKeys = Object.keys(CREATION_TRAITS);
        const count = Math.floor(Math.random() * 4);
        for (let i = 0; i < count; i++) {
            const randomTrait = traitKeys[Math.floor(Math.random() * traitKeys.length)];
            if (!this.selectedTraits.includes(randomTrait)) {
                this.selectedTraits.push(randomTrait);
            }
        }
        
        this.calculatePoints();
    }

    buildPlayer() {
        if (this.points < 0 && this.mode === 'custom') return null;
        
        const player = new Player();
        player.name = this.playerName;
        player.gender = this.playerGender;
        player.age = this.playerAge;
        player.avatar = this.playerAvatar;
        player.race = this.selectedRace;
        
        const race = CREATION_RACES[this.selectedRace];
        const root = CREATION_ROOTS[this.selectedRoot];
        const phys = CREATION_PHYSIQUES[this.selectedPhysique];
        const origin = CREATION_ORIGINS[this.selectedOrigin];
        
        // Apply Race
        player.racialBonus = race.bonus;

        // Apply Root
        player.spiritualRoot = {
            type: root.name,
            multiplier: root.bonus.tvps || 1.0,
            bonus: root.bonus, // Pass the whole bonus for calculateStats
            color: this.getRootColor(this.selectedRoot)
        };
        
        // Apply Physique
        player.physique = {
            id: phys.id,
            stage: 'SO_KHAI',
            exp: 0,
            awakened: true,
            phenomenonActive: false
        };
        
        // Apply Origin resources
        player.origin = origin;
        player.realmId = this.startingRealmId;
        player.bodyRealmId = this.startingRealmId;
        player.soulRealmId = this.startingRealmId;

        player.addLingShi(this.startingLingShi);
        origin.resources.items.forEach(itemId => player.inventory.addItem(itemId, 1));
        if (origin.resources.karma) player.karma = origin.resources.karma;
        
        // Apply Traits
        this.selectedTraits.forEach(traitId => {
            const trait = CREATION_TRAITS[traitId];
            player.talents.push({ id: trait.id, name: trait.name });
        });
        
        // Finalize stats (player.calculateStats will look at root, physique, and talents)
        player.calculateStats();
        player.hp = player.maxHp;
        player.mana = player.maxMana;
        
        return player;
    }

    getRootColor(rootId) {
        const colors = {
            'thien_linh_can': '#ec4899',
            'di_linh_can': '#f59e0b',
            'song_linh_can': '#3b82f6',
            'tam_linh_can': '#4ade80',
            'ngu_hanh_linh_can': '#ffffff',
            'tap_linh_can': '#9ca3af'
        };
        return colors[rootId] || '#ffffff';
    }
}
