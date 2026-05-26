import { CREATION_CONFIG, CREATION_RACES, CREATION_ROOTS, ROOT_RARITY, SECONDARY_TALENTS, CREATION_PHYSIQUES, CREATION_ORIGINS, CREATION_TRAITS, CREATION_SCENARIOS, ROOT_ELEMENTS, SPECIAL_ELEMENTS, CREATION_ARTIFACTS } from '../configs/creation-data.js';
import { WORLDS } from '../configs/map-data.js';
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
        this.rootTab = 'normal';
        this.selectedRoot = 'ngu_hanh_linh_can';
        this.selectedRootElements = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
        this.selectedRootElementProportions = { 'Kim': 20, 'Mộc': 20, 'Thủy': 20, 'Hỏa': 20, 'Thổ': 20 };
        this.selectedPhysique = 'binh_thuong';
        this.selectedOrigin = 'tan_tu';
        this.selectedTraits = [];
        this.playerName = "Phàm Nhân";
        this.playerGender = "male";
        this.playerAge = 18;
        this.playerAvatar = "player_male";
        this.startingLingShi = 0;
        this.startingRealmId = 0;
        this.selectedArtifact = 'none';
        this.selectedCheatSystem = null;
        this.selectedStartingLocation = 'auto'; // Added starting location
        this.avatarFilterGender = 'all';
        this.avatarFilterRace = 'all';

        // Secondary Talents (Values from 1-100)
        this.talents = {
            comprehension: Math.floor(Math.random() * 61) + 20, // 20-80
            luck: Math.floor(Math.random() * 61) + 20,
            daoTam: Math.floor(Math.random() * 61) + 20,
            divineSense: Math.floor(Math.random() * 61) + 20,
            physique: Math.floor(Math.random() * 61) + 20
        };

        this.rootRarity = 'PHAM';
        this.rootPurity = Math.floor(Math.random() * 41) + 30; // 30-70 initially
    }

    rerollTalents() {
        for (const key in this.talents) {
            this.talents[key] = Math.floor(Math.random() * 81) + 10; // 10-90
        }
        // Small cost or point penalty if needed, but for now free
        this.calculatePoints();
    }

    selectOrigin(originId) {
        const origin = CREATION_ORIGINS[originId];
        if (!origin) return;
        this.selectedOrigin = originId;
        this.startingLingShi = origin.resources.lingShi;
        this.calculatePoints();
    }

    selectArtifact(artifactId) {
        if (this.selectedArtifact === artifactId) {
            this.selectedArtifact = 'none';
        } else {
            this.selectedArtifact = artifactId;
        }
        this.calculatePoints();
    }

    selectCheatSystem(systemId) {
        if (this.selectedCheatSystem === systemId) {
            this.selectedCheatSystem = null;
        } else {
            this.selectedCheatSystem = systemId;
        }
    }


    resetProportions() {
        if (this.rootTab === 'normal') {
            this.selectedRootElements = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
            this.selectedRootElementProportions = { 'Kim': 20, 'Mộc': 20, 'Thủy': 20, 'Hỏa': 20, 'Thổ': 20 };
            this.selectedRoot = 'ngu_hanh_linh_can';
        } else {
            this.selectedRootElements = ['Lôi'];
            this.selectedRootElementProportions = { 'Lôi': 100 };
            this.selectedRoot = 'di_linh_can';
        }
    }

    adjustNormalElementProportion(targetElement, newValue) {
        newValue = Math.max(0, Math.min(100, Math.round(newValue)));
        const oldValue = this.selectedRootElementProportions[targetElement] || 0;
        const delta = newValue - oldValue;
        if (delta === 0) return;

        const allNormal = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
        const otherElements = allNormal.filter(el => el !== targetElement);

        // Sum of other active elements (value > 0)
        const activeOthers = otherElements.filter(el => (this.selectedRootElementProportions[el] || 0) > 0);
        const sumOthers = activeOthers.reduce((acc, el) => acc + (this.selectedRootElementProportions[el] || 0), 0);

        const remaining = 100 - newValue;

        if (sumOthers > 0 && remaining > 0) {
            let remainingDelta = remaining;
            activeOthers.forEach((el, index) => {
                const currentVal = this.selectedRootElementProportions[el] || 0;
                let newVal = 0;
                if (index === activeOthers.length - 1) {
                    newVal = remainingDelta;
                } else {
                    newVal = Math.round(remaining * (currentVal / sumOthers));
                    remainingDelta -= newVal;
                }
                this.selectedRootElementProportions[el] = Math.max(0, Math.min(100, newVal));
            });
        } else if (remaining > 0) {
            // If all others were 0, distribute equally
            let remainingDelta = remaining;
            otherElements.forEach((el, index) => {
                let newVal = 0;
                if (index === otherElements.length - 1) {
                    newVal = remainingDelta;
                } else {
                    newVal = Math.round(remaining / otherElements.length);
                    remainingDelta -= newVal;
                }
                this.selectedRootElementProportions[el] = Math.max(0, Math.min(100, newVal));
            });
        } else {
            // remaining === 0, meaning newValue === 100
            otherElements.forEach(el => {
                this.selectedRootElementProportions[el] = 0;
            });
        }

        this.selectedRootElementProportions[targetElement] = newValue;

        // Ensure total sum is exactly 100
        let sum = allNormal.reduce((acc, el) => acc + (this.selectedRootElementProportions[el] || 0), 0);
        let diff = 100 - sum;
        if (diff !== 0) {
            // Adjust the element with the maximum proportion (excluding targetElement if possible)
            let maxEl = otherElements[0];
            let maxVal = -1;
            otherElements.forEach(el => {
                const val = this.selectedRootElementProportions[el] || 0;
                if (val > maxVal) {
                    maxVal = val;
                    maxEl = el;
                }
            });
            if (maxEl && this.selectedRootElementProportions[maxEl] !== undefined) {
                this.selectedRootElementProportions[maxEl] = Math.max(0, Math.min(100, this.selectedRootElementProportions[maxEl] + diff));
            } else {
                this.selectedRootElementProportions[targetElement] = Math.max(0, Math.min(100, this.selectedRootElementProportions[targetElement] + diff));
            }
        }

        // Recalculate selectedRootElements
        this.selectedRootElements = allNormal.filter(el => (this.selectedRootElementProportions[el] || 0) > 0);

        // Update selectedRoot based on count
        const N = this.selectedRootElements.length;
        if (N === 1) {
            this.selectedRoot = 'thien_linh_can';
        } else if (N === 2) {
            this.selectedRoot = 'song_linh_can';
        } else if (N === 3) {
            this.selectedRoot = 'tam_linh_can';
        } else if (N === 4) {
            this.selectedRoot = 'nguy_linh_can';
        } else if (N === 5) {
            this.selectedRoot = 'ngu_hanh_linh_can';
        }

        this.checkMutation();
        this.calculatePoints();
    }

    adjustElementProportion(targetElement, newValue) {
        newValue = Math.max(0, Math.min(100, Math.round(newValue)));
        const N = this.selectedRootElements.length;
        if (N <= 1) {
            this.selectedRootElementProportions[targetElement] = 100;
            return;
        }

        const oldValue = this.selectedRootElementProportions[targetElement] || 0;
        const delta = newValue - oldValue;
        if (delta === 0) return;

        const otherElements = this.selectedRootElements.filter(el => el !== targetElement);
        const sumOthers = otherElements.reduce((acc, el) => acc + (this.selectedRootElementProportions[el] || 0), 0);

        if (sumOthers > 0) {
            let remainingDelta = -delta;
            otherElements.forEach((el, index) => {
                const currentVal = this.selectedRootElementProportions[el] || 0;
                let share = 0;
                if (index === otherElements.length - 1) {
                    share = remainingDelta;
                } else {
                    share = Math.round(-delta * (currentVal / sumOthers));
                    remainingDelta -= share;
                }
                this.selectedRootElementProportions[el] = Math.max(0, Math.min(100, currentVal + share));
            });
        } else {
            let remainingDelta = -delta;
            otherElements.forEach((el, index) => {
                const currentVal = this.selectedRootElementProportions[el] || 0;
                let share = 0;
                if (index === otherElements.length - 1) {
                    share = remainingDelta;
                } else {
                    share = Math.round(-delta / otherElements.length);
                    remainingDelta -= share;
                }
                this.selectedRootElementProportions[el] = Math.max(0, Math.min(100, currentVal + share));
            });
        }

        this.selectedRootElementProportions[targetElement] = newValue;
        this.sanitizeProportions();
    }

    sanitizeProportions() {
        const sum = this.selectedRootElements.reduce((acc, el) => acc + (this.selectedRootElementProportions[el] || 0), 0);
        const diff = 100 - sum;
        if (diff === 0) return;

        let maxEl = this.selectedRootElements[0];
        let maxVal = -1;
        this.selectedRootElements.forEach(el => {
            const val = this.selectedRootElementProportions[el] || 0;
            if (val > maxVal) {
                maxVal = val;
                maxEl = el;
            }
        });

        if (maxEl) {
            this.selectedRootElementProportions[maxEl] = Math.max(0, Math.min(100, (this.selectedRootElementProportions[maxEl] || 0) + diff));
        }

        this.checkMutation();
    }

    checkMutation() {
        this.isMutated = false;
        this.mutatedElement = null;

        const N = this.selectedRootElements.length;
        if (N === 2) {
            // Check if proportions are balanced (between 40% and 60%)
            let isBalanced = true;
            this.selectedRootElements.forEach(el => {
                const val = this.selectedRootElementProportions[el] || 0;
                if (val < 40 || val > 60) {
                    isBalanced = false;
                }
            });

            if (isBalanced) {
                const elements = [...this.selectedRootElements].sort().join('_');
                const recipes = {
                    'Kim_Thủy': 'Lôi',
                    'Thổ_Thủy': 'Băng', // Thủy + Thổ
                    'Mộc_Thổ': 'Phong',
                    'Mộc_Thủy': 'Độc',
                    'Hỏa_Kim': 'Quang', // Kim + Hỏa
                    'Hỏa_Thủy': 'Ám'    // Thủy + Hỏa
                };

                if (recipes[elements]) {
                    this.isMutated = true;
                    this.mutatedElement = recipes[elements];
                    this.selectedRoot = 'di_linh_can';
                    this.calculatePoints();
                    return;
                }
            }
        }
        
        // If not mutated, recalculate root type based on elements
        if (this.selectedRoot === 'di_linh_can') {
            if (N === 1) this.selectedRoot = 'thien_linh_can';
            else if (N === 2) this.selectedRoot = 'song_linh_can';
            else if (N === 3) this.selectedRoot = 'tam_linh_can';
            else if (N === 4) this.selectedRoot = 'nguy_linh_can';
            else if (N === 5) this.selectedRoot = 'ngu_hanh_linh_can';
            this.calculatePoints();
        }
    }

    getRootClassification() {
        const N = this.selectedRootElements.length;

        if (this.isMutated && this.mutatedElement) {
            return { name: `Dị Linh Căn (${this.mutatedElement})`, isBalanced: true, multiplierScale: 1.15 };
        }

        if (N === 1) {
            return { name: `Thiên Linh Căn (${this.selectedRootElements[0]})`, isBalanced: true, multiplierScale: 1.25 };
        }

        const ideal = 100 / N;
        let maxDeviation = 0;
        this.selectedRootElements.forEach(el => {
            const val = this.selectedRootElementProportions[el] || 0;
            const dev = Math.abs(val - ideal);
            if (dev > maxDeviation) maxDeviation = dev;
        });

        const rootName = CREATION_ROOTS[this.selectedRoot]?.name || 'Linh Căn';

        if (this.selectedRoot === 'ngu_hanh_linh_can') {
            if (maxDeviation > 15) {
                return { name: 'Tạp Linh Căn (Nhiều Tạp Chất)', isBalanced: false, multiplierScale: 0.6 };
            } else if (maxDeviation > 5) {
                return { name: 'Ngũ Hành Linh Căn (Lệch)', isBalanced: false, multiplierScale: 0.85 };
            } else {
                return { name: 'Ngũ Hành Linh Căn (Hòa Hợp)', isBalanced: true, multiplierScale: 1.15 };
            }
        }

        const elementsStr = this.selectedRootElements.join(' - ');
        if (maxDeviation > 15) {
            return { name: `${rootName} (${elementsStr}) (Bị Pha Tạp)`, isBalanced: false, multiplierScale: 0.7 };
        } else if (maxDeviation > 5) {
            return { name: `${rootName} (${elementsStr}) (Hơi Lệch)`, isBalanced: false, multiplierScale: 0.9 };
        } else {
            return { name: `${rootName} (${elementsStr}) (Cân Bằng)`, isBalanced: true, multiplierScale: 1.1 };
        }
    }

    selectRoot(rootId) {
        this.selectedRoot = rootId;
        this.rootTab = (rootId === 'di_linh_can' ? 'mutated' : 'normal');

        if (rootId === 'di_linh_can') {
            this.selectedRootElements = ['Lôi'];
            this.selectedRootElementProportions = { 'Lôi': 100 };
        } else {
            if (rootId === 'ngu_hanh_linh_can') {
                this.selectedRootElements = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
            } else if (rootId === 'thien_linh_can') {
                this.selectedRootElements = ['Hỏa'];
            } else if (rootId === 'song_linh_can') {
                this.selectedRootElements = ['Kim', 'Mộc'];
            } else if (rootId === 'tam_linh_can') {
                this.selectedRootElements = ['Kim', 'Mộc', 'Thủy'];
            } else if (rootId === 'nguy_linh_can') {
                this.selectedRootElements = ['Kim', 'Mộc', 'Thủy', 'Thổ'];
            }

            // Reinitialize proportions
            const N = this.selectedRootElements.length;
            const base = Math.floor(100 / N);
            const remainder = 100 - (base * N);

            this.selectedRootElementProportions = {};
            // Set active ones
            this.selectedRootElements.forEach((el, index) => {
                this.selectedRootElementProportions[el] = base + (index === 0 ? remainder : 0);
            });
            // Initialize others to 0 so slider can read
            const allNormal = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
            allNormal.forEach(el => {
                if (!this.selectedRootElementProportions[el]) {
                    this.selectedRootElementProportions[el] = 0;
                }
            });
        }
        this.calculatePoints();
    }

    toggleRootElement(element) {
        const root = CREATION_ROOTS[this.selectedRoot];
        if (root.id === 'ngu_hanh_linh_can') return; // Fixed

        const maxElements = {
            'thien_linh_can': 1,
            'di_linh_can': 1,
            'song_linh_can': 2,
            'tam_linh_can': 3,
            'nguy_linh_can': 4
        }[this.selectedRoot] || 1;

        if (this.selectedRootElements.includes(element)) {
            // Can't remove if only 1
            if (this.selectedRootElements.length > 1) {
                this.selectedRootElements = this.selectedRootElements.filter(e => e !== element);
            }
        } else {
            if (this.selectedRootElements.length < maxElements) {
                this.selectedRootElements.push(element);
            } else if (maxElements === 1) {
                this.selectedRootElements = [element];
            }
        }
        this.resetProportions();
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

        // Artifact cost
        if (this.selectedArtifact !== 'none') {
            total -= (CREATION_ARTIFACTS[this.selectedArtifact]?.cost || 0);
        }

        // Starting Ling Shi cost (1 point per 100 Ling Shi, if positive)
        if (this.startingLingShi > 0) {
            total -= Math.floor(this.startingLingShi / 100);
        }

        this.points = total;
        return total;
    }

    getTalentValue(talentId) {
        let base = this.talents[talentId] || 50;
        let bonus = 0;

        // From Race
        const race = CREATION_RACES[this.selectedRace];
        if (race.bonus && race.bonus[talentId]) bonus += race.bonus[talentId];

        // From Physique
        const phys = CREATION_PHYSIQUES[this.selectedPhysique];
        if (phys.bonus && phys.bonus[talentId]) bonus += phys.bonus[talentId];

        // From Traits
        this.selectedTraits.forEach(id => {
            const trait = CREATION_TRAITS[id];
            if (trait.bonus && trait.bonus[talentId]) bonus += trait.bonus[talentId];
        });

        return Math.max(1, Math.min(999, base + bonus));
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
        this.startingRealmId = 0;
        this.calculatePoints();
    }

    rollRandom() {
        this.reset();
        this.mode = 'custom';

        this.playerName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
        this.playerGender = Math.random() < 0.5 ? 'male' : 'female';
        this.playerAge = Math.floor(Math.random() * 41) + 12;
        this.playerAvatar = this.playerGender === 'male' ? 'player_male' : 'player_female';

        const raceKeys = Object.keys(CREATION_RACES);
        this.selectedRace = raceKeys[Math.floor(Math.random() * raceKeys.length)];

        // Roll Rarity
        const roll = Math.random();
        let accum = 0;
        for (const [key, data] of Object.entries(ROOT_RARITY)) {
            accum += data.chance;
            if (roll <= accum) {
                this.rootRarity = key;
                break;
            }
        }

        // Roll Purity
        this.rootPurity = Math.floor(Math.random() * 71) + 30; // 30-100

        this.selectedRoot = rootKeys[Math.floor(Math.random() * rootKeys.length)];
        // Dị linh căn is now generated via recipes naturally, so we convert random di_linh_can rolls into a valid pair
        if (this.selectedRoot === 'di_linh_can') {
            const diRecipes = [
                ['Kim', 'Thủy'], ['Thủy', 'Thổ'], ['Mộc', 'Thổ'], 
                ['Mộc', 'Thủy'], ['Kim', 'Hỏa'], ['Hỏa', 'Thủy']
            ];
            const chosenPair = diRecipes[Math.floor(Math.random() * diRecipes.length)];
            this.selectedRootElements = [...chosenPair];
            
            // Randomize slightly but keep within 40-60 ratio
            const el1Pct = Math.floor(Math.random() * 21) + 40; // 40 to 60
            const el2Pct = 100 - el1Pct;
            
            this.selectedRootElementProportions = {
                [chosenPair[0]]: el1Pct,
                [chosenPair[1]]: el2Pct
            };
            
            const allNormal = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
            allNormal.forEach(el => {
                if (!this.selectedRootElementProportions[el]) {
                    this.selectedRootElementProportions[el] = 0;
                }
            });
            this.checkMutation();
        } else {
            const normalElements = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
            // Shuffle
            const shuffled = [...normalElements].sort(() => Math.random() - 0.5);
            const qty = CREATION_ROOTS[this.selectedRoot].quantity;
            this.selectedRootElements = shuffled.slice(0, qty);

            this.selectedRootElementProportions = {};
            if (qty === 1) {
                this.selectedRootElementProportions[this.selectedRootElements[0]] = 100;
            } else {
                let remaining = 100;
                this.selectedRootElements.forEach((el, idx) => {
                    if (idx === qty - 1) {
                        this.selectedRootElementProportions[el] = remaining;
                    } else {
                        const min = 5;
                        const max = remaining - 5 * (qty - 1 - idx);
                        const val = Math.floor(Math.random() * (max - min + 1)) + min;
                        this.selectedRootElementProportions[el] = val;
                        remaining -= val;
                    }
                });
            }
            // Add inactive standard ones at 0%
            normalElements.forEach(el => {
                if (this.selectedRootElementProportions[el] === undefined) {
                    this.selectedRootElementProportions[el] = 0;
                }
            });
        }

        const physKeys = Object.keys(CREATION_PHYSIQUES);
        this.selectedPhysique = physKeys[Math.floor(Math.random() * physKeys.length)];

        const originKeys = Object.keys(CREATION_ORIGINS);
        this.selectedOrigin = originKeys[Math.floor(Math.random() * originKeys.length)];
        this.startingLingShi = CREATION_ORIGINS[this.selectedOrigin].resources.lingShi;
        this.startingRealmId = 0;

        // Random talents
        for (const key in this.talents) {
            this.talents[key] = Math.floor(Math.random() * 81) + 10; // 10-90
        }

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
        const rarityData = ROOT_RARITY[this.rootRarity];
        const classInfo = this.getRootClassification();
        const multiplier = (root.bonus.qiAbsorb || 1.0) * rarityData.multiplier * (this.rootPurity / 100) * classInfo.multiplierScale;

        player.spiritualRoot = {
            id: root.id,
            type: classInfo.name,
            elements: [...this.selectedRootElements],
            proportions: { ...this.selectedRootElementProportions },
            rarity: this.rootRarity,
            rarityName: rarityData.name,
            purity: this.rootPurity,
            multiplier: multiplier,
            bonus: root.bonus,
            color: rarityData.color,
            isMutated: this.isMutated,
            mutatedElement: this.mutatedElement
        };

        // Apply Talents
        player.comprehension = this.talents.comprehension;
        player.luck = this.talents.luck;
        player.daoTam = this.talents.daoTam;
        player.divineSense = this.talents.divineSense;
        player.physiqueTalent = this.talents.physique;

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
        const startingId = (this.selectedRace === 'HUMAN' ? 0 : 1);
        player.realmId = startingId;
        player.bodyRealmId = startingId;
        player.soulRealmId = startingId;

        player.addLingShi(this.startingLingShi);
        origin.resources.items.forEach(itemId => player.inventory.addItem(itemId, 1));
        if (origin.resources.karma) player.karma = origin.resources.karma;

        // Apply starting title if defined in origin
        if (origin.startingTitle) {
            player.unlockTitle(origin.startingTitle);
            player.equipTitle(origin.startingTitle);
        }

        // Apply Cheat System
        player.cheatSystemId = this.selectedCheatSystem;

        // Apply Traits
        this.selectedTraits.forEach(traitId => {
            const trait = CREATION_TRAITS[traitId];
            player.talents.push({ id: trait.id, name: trait.name });
        });

        // Apply Artifact
        if (this.selectedArtifact !== 'none') {
            player.inventory.addItem(this.selectedArtifact, 1);
        }

        // --- Handle leftover points conversion ---
        // Leftover points convert to Luck & Comprehension only.
        // Tu Vi bonus is intentionally excluded to prevent inflated starting values
        // that would break the cultivation bar display (e.g. 10,650 / 6,000).
        if (this.points > 0) {
            // 1 point = 0.5 Luck
            player.luck += Math.floor(this.points * 0.5);
            // 10 points = 1 Comprehension
            player.comprehension += this.points * 0.1;
        }

        // Apply Destiny Rating based on leftover points
        player.destinyRating = this.getDestinyRating(this.points);

        // --- DYNAMIC STARTING LOCATIONS (RACE + ORIGIN + STATUS/PHYSIQUE) ---
        let startWorldId = 'nhan_gioi';
        let startLocId = 'thanh_van_tran';

        if (this.selectedStartingLocation !== 'auto') {
            // Find which world this location belongs to
            // This requires searching WORLDS, which we'll do in the game layer.
            // But for here, we just set it. We'll resolve the worldId later if needed, 
            // or just assume it's set correctly by the system.
            // Let's import WORLDS or just use a helper later. Actually, `player.currentWorldId` 
            // will just be updated by the caller if needed, or we can resolve it now.
            // It's safer to resolve it now, but we don't have WORLDS imported.
            // Let's just set startLocId and leave worldId to be resolved.
            // Actually, we can import WORLDS from '../configs/map-data.js'. Let's do that!
            startLocId = this.selectedStartingLocation;
        } else {
            // 1. Race-based default worlds and areas
            if (this.selectedRace === 'DEMON') {
                startWorldId = 'ma_gioi';
                startLocId = 'hac_tuyen_ma_thon'; // Default Demon starting village
            } else if (this.selectedRace === 'YAO') {
                startWorldId = 'nhan_gioi';
                startLocId = 'van_thu_lam'; // Default Yêu Tộc forest
            } else {
                startWorldId = 'nhan_gioi';
                startLocId = 'thanh_van_tran'; // Default Human starting town
            }

            // 2. Adjust based on Origin (Xuất thân)
            if (this.selectedRace === 'DEMON') {
                if (this.selectedOrigin === 'gia_toc' || this.selectedOrigin === 'dai_gia_toc') {
                    startLocId = 'huyen_am_ma_thanh';
                } else if (this.selectedOrigin === 'tong_mon') {
                    startLocId = 'thiet_huyen_ma_tran';
                } else if (this.selectedOrigin === 'ma_dao') {
                    startLocId = 'u_minh_ma_thanh';
                } else if (this.selectedOrigin === 'vo_gia_cu' || this.selectedOrigin === 'no_nan') {
                    startLocId = 'vong_hon_ma_thon';
                } else if (this.selectedOrigin === 'thu_nguyen_du_hanh_gia' || this.selectedOrigin === 'hoi_quy_gia' || this.selectedOrigin === 'chuyen_sinh_gia') {
                    startLocId = 'thien_ma_thanh'; // Capital city
                }
            } else if (this.selectedRace === 'YAO') {
                if (this.selectedOrigin === 'gia_toc' || this.selectedOrigin === 'dai_gia_toc') {
                    startLocId = 'thien_van_thanh';
                } else if (this.selectedOrigin === 'tong_mon') {
                    startLocId = 'hoang_phong_coc';
                } else if (this.selectedOrigin === 'ma_dao') {
                    startLocId = 'huyen_am_coc';
                } else if (this.selectedOrigin === 'vo_gia_cu' || this.selectedOrigin === 'no_nan') {
                    startLocId = 'thap_van_dai_son';
                } else if (this.selectedOrigin === 'thu_nguyen_du_hanh_gia' || this.selectedOrigin === 'hoi_quy_gia' || this.selectedOrigin === 'chuyen_sinh_gia') {
                    startLocId = 'thoi_khong_bi_canh';
                    startWorldId = 'linh_gioi';
                }
            } else { // HUMAN
                if (this.selectedOrigin === 'gia_toc' || this.selectedOrigin === 'dai_gia_toc') {
                    startLocId = 'thien_van_thanh';
                } else if (this.selectedOrigin === 'tong_mon') {
                    startLocId = 'hoang_phong_coc';
                } else if (this.selectedOrigin === 'ma_dao') {
                    startLocId = 'huyen_am_coc';
                } else if (this.selectedOrigin === 'vo_gia_cu' || this.selectedOrigin === 'no_nan') {
                    startLocId = 'thanh_van_tran';
                } else if (this.selectedOrigin === 'thu_nguyen_du_hanh_gia' || this.selectedOrigin === 'hoi_quy_gia' || this.selectedOrigin === 'chuyen_sinh_gia') {
                    startLocId = 'thoi_khong_bi_canh';
                    startWorldId = 'linh_gioi';
                }
            }

            // 3. Adjust based on Physique / Status / Identity (Thân phận)
            // High-level physiques spawn in supreme spots!
            const premiumPhysiques = ['hon_don_the', 'tien_thien_thanh_the_dao_thai', 'vinh_hang_tien_the', 'hong_mong_dao_the', 'than_vuong_the', 'thuong_thien_phach_the', 'luan_hoi_the', 'van_menh_hu_vo'];
            if (premiumPhysiques.includes(this.selectedPhysique)) {
                if (this.selectedRace === 'DEMON') {
                    startLocId = 'thien_ma_thanh'; // Chaos/Supreme demon body starts in capital
                } else {
                    startLocId = 'thoi_khong_bi_canh';
                    startWorldId = 'linh_gioi'; // Grand human body starts in Spirit Realm secret boundary
                }
            } else if (this.selectedPhysique === 'thien_ma_the' || this.selectedPhysique === 'tu_la_huyet_the') {
                // Demon-bodied characters start in high danger demon zones
                if (this.selectedRace === 'DEMON') {
                    startLocId = 'sat_luc_ma_thanh';
                } else {
                    startLocId = 'huyen_am_coc'; // Human demon body starts in Dark Valley
                }
            }
        }

        if (this.selectedStartingLocation !== 'auto') {
            startWorldId = this.getStartingWorldId(startLocId) || startWorldId;
        }

        player.currentWorldId = startWorldId;
        player.currentLocId = startLocId;
        player.explorationProgress = 0;

        // Finalize stats (player.calculateStats will look at root, physique, and talents)
        player.calculateStats();
        player.hp = player.maxHp;
        player.mana = player.maxMana;

        return player;
    }

    getDestinyRating(points) {
        if (points >= 90) return "Chí tôn mệnh";
        if (points >= 60) return "Thần mệnh";
        if (points >= 30) return "Tiên mệnh";
        if (points >= 10) return "Linh mệnh";
        return "Phàm mệnh";
    }

    getStartingWorldId(locId) {
        for (const [worldId, world] of Object.entries(WORLDS)) {
            if (world.locations && world.locations.some(l => l.id === locId)) {
                return worldId;
            }
        }
        return null;
    }

    getRootColor(rootId) {
        const colors = {
            'thien_linh_can': '#ec4899',
            'di_linh_can': '#f59e0b',
            'song_linh_can': '#3b82f6',
            'tam_linh_can': '#4ade80',
            'ngu_hanh_linh_can': '#ffffff',
            'nguy_linh_can': '#9ca3af'
        };
        return colors[rootId] || '#ffffff';
    }
}
