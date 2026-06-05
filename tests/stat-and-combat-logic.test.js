import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Player } from '../src/core/player.js';
import { CombatEngine } from '../src/core/combat-engine.js';
import { state } from '../src/state.js';
import { EnemyGenerator } from '../src/core/enemy.js';

beforeEach(() => {
  state.ui = {
    toast: vi.fn(),
    alert: vi.fn()
  };
  state.systems = {
    time: { totalDays: 1 }
  };
});

describe('Standardized Player Stat Logic', () => {
  it('should not inflate luck, karma, or other attributes through repeated calculateStats() cycles', () => {
    const player = new Player();
    
    // Set initial values
    player.baseLuck = 60;
    player.luck = 60;
    player.baseKarma = 10;
    player.karma = 10;
    
    // Trigger multiple cycles of calculateStats
    player.calculateStats();
    player.calculateStats();
    player.calculateStats();
    
    // Values must remain deterministic and not double-accumulate
    expect(player.luck).toBe(60);
    expect(player.karma).toBe(10);
  });

  it('should initialize and preserve all advanced and elemental stats', () => {
    const player = new Player();
    
    // Elemental damage stats must be registered and initialized to 1.0 (neutral baseline multiplier)
    expect(player.advancedStats.woodDmg).toBe(1.0);
    expect(player.advancedStats.earthDmg).toBe(1.0);
    expect(player.advancedStats.metalDmg).toBe(1.0);
    expect(player.advancedStats.iceDmg).toBe(1.0);
    expect(player.advancedStats.poisonDmg).toBe(1.0);
    
    // Profession-specific stats must be initialized to 0
    expect(player.advancedStats.talismanSuccess).toBe(0);
    expect(player.advancedStats.smithingBonus).toBe(0);
    expect(player.advancedStats.puppetBonus).toBe(0);
    expect(player.advancedStats.successRate).toBe(0);
  });

  it('should correctly save and load base stats and advanced stats', () => {
    const player = new Player();
    player.baseLuck = 75;
    player.luck = 75;
    player.baseComprehension = 45;
    player.comprehension = 45;

    const savedData = player.save();
    
    // Expect serialized data to contain both base and current attributes
    expect(savedData.baseLuck).toBe(75);
    expect(savedData.luck).toBe(75);
    expect(savedData.baseComprehension).toBe(45);
    expect(savedData.comprehension).toBe(45);

    // Load serialized data into a fresh player instance
    const freshPlayer = new Player();
    freshPlayer.load(savedData);

    expect(freshPlayer.baseLuck).toBe(75);
    expect(freshPlayer.luck).toBe(75);
    expect(freshPlayer.baseComprehension).toBe(45);
    expect(freshPlayer.comprehension).toBe(45);
  });

  it('should permanently increase player base stats when using item effects', () => {
    const player = new Player();
    player.baseDivineSense = 60;
    player.divineSense = 60;

    // Use Linh Chi Tiên Thảo (+50 Divine Sense)
    player.inventory.addItem('linh_chi_tien_thao', 1);
    const result = player.inventory.useItem('linh_chi_tien_thao', 1);
    
    expect(result).toBe(true);
    expect(player.baseDivineSense).toBe(110);
    expect(player.divineSense).toBe(110);

    // Recalculating stats should maintain the new base value
    player.calculateStats();
    expect(player.divineSense).toBe(110);
  });

  it('should apply stats dynamically when equipment is equipped', () => {
    const player = new Player();
    const initialAtk = player.bonusStats.atk;

    // Equip phi_kiem_go (atk +5)
    player.equipment.weapon = 'phi_kiem_go';
    player.calculateStats();

    // Since phi_kiem_go is recognized by default, it should grant +5 atk
    expect(player.bonusStats.atk).toBe(initialAtk + 5);
  });

  it('should apply racial bonuses dynamically', () => {
    const player = new Player();
    
    // Set racialBonus
    player.racialBonus = {
      atk: 10,
      woodDmg: 1.15 // woodDmg is a multiplicative stat: base (1.0) * val (1.15) = 1.15
    };
    
    player.calculateStats();
    
    expect(player.bonusStats.atk).toBe(10);
    expect(player.advancedStats.woodDmg).toBeCloseTo(1.15, 5);
  });

  it('should apply physique bonuses dynamically when awakened', () => {
    const player = new Player();
    
    player.physique = {
      id: 'thien_loi_the',
      stage: 'SO_KHAI',
      awakened: true
    };
    
    player.calculateStats();
    
    // thien_loi_the has grade BAO (multiplier = 2.2), stage SO_KHAI (multiplier = 1.0) -> totalMult = 2.2
    // base thunderDmg bonus in configs/physique-data.js is 2.5
    // final bonus: 1 + (2.5 - 1) * 2.2 = 4.3
    expect(player.advancedStats.thunderDmg).toBeCloseTo(4.3, 5);
  });
});

describe('Dynamic Elemental Combat Multipliers', () => {
  const mockOnUpdate = vi.fn();
  const mockOnEnd = vi.fn();

  it('should correctly compute elemental multiplier for element advantage/disadvantage', () => {
    const mockPlayer = { advancedStats: {}, equipment: {} };
    const engine = new CombatEngine(mockPlayer, {}, mockOnUpdate, mockOnEnd);

    // Thủy khắc Hỏa (Advantage: +30%)
    expect(engine.getElementalMultiplier('Thủy', 'Hỏa')).toBe(1.30);

    // Hỏa bị Thủy khắc (Disadvantage: -20%)
    expect(engine.getElementalMultiplier('Hỏa', 'Thủy')).toBe(0.80);

    // Neutral matchups (1.0)
    expect(engine.getElementalMultiplier('Neutral', 'Hỏa')).toBe(1.0);
    expect(engine.getElementalMultiplier('Hỏa', 'Neutral')).toBe(1.0);
    expect(engine.getElementalMultiplier('Phong', 'Hỏa')).toBe(1.0);
  });
});

describe('Enemy Sect and Rogue Cultivator Generation', () => {
  it('should generate sect guard with correct sectId, name, skills and equipment when spawned at sect gate', () => {
    // Mock current location as a sect gate (e.g. thien_kiem_tong)
    state.currentLocId = 'thien_kiem_tong';
    
    // Generate until we get a humanoid sect guard
    let enemy;
    for (let i = 0; i < 50; i++) {
      enemy = EnemyGenerator.generate(15);
      if (enemy.race === 'HUMAN' || enemy.race === 'DEMON') {
        break;
      }
    }
    
    expect(enemy.sectId).toBe('thien_kiem_tong');
    expect(enemy.name).toContain('Thiên Kiếm Tông');
    expect(enemy.skills).toContain('BASIC_ATTACK');
    
    // Clean up
    state.currentLocId = '';
  });

  it('should randomly assign sect or Tán Tu status and appropriate gear/skills', () => {
    state.currentLocId = 'hoang_da'; // neutral zone
    
    // Generate 30 enemies to check distribution and presence of sectId / Tán Tu status
    let sectCount = 0;
    let rogueCount = 0;
    for (let i = 0; i < 30; i++) {
      const enemy = EnemyGenerator.generate(10);
      if (enemy.sectId) {
        sectCount++;
        expect(enemy.equipment.weapon).toBeDefined();
        expect(enemy.equipment.armor).toBeDefined();
      } else {
        rogueCount++;
        if (enemy.race === 'HUMAN' || enemy.race === 'DEMON') {
          expect(enemy.name).toContain('Tán Tu');
        }
      }
    }
    
    expect(sectCount + rogueCount).toBe(30);
    
    state.currentLocId = '';
  });
});
