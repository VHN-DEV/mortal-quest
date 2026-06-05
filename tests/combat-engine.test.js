import { describe, it, expect, vi } from 'vitest';
import { CombatEngine } from '../src/core/combat-engine.js';

describe('CombatEngine mechanics', () => {
  const mockOnUpdate = vi.fn();
  const mockOnEnd = vi.fn();

  describe('getEnemyArchetype', () => {
    it('should classify ASSASSIN if speed is high relative to attack and higher than defense', () => {
      const mockPlayer = { advancedStats: {}, equipment: {} };
      const assassinEnemy = { name: 'Thích Khách', hp: 100, maxHp: 100, atk: 50, def: 30, spd: 60 };
      
      const engine = new CombatEngine(mockPlayer, assassinEnemy, mockOnUpdate, mockOnEnd);
      expect(engine.getEnemyArchetype()).toBe('ASSASSIN');
    });

    it('should classify TANK if defense is high relative to attack and higher than speed', () => {
      const mockPlayer = { advancedStats: {}, equipment: {} };
      const tankEnemy = { name: 'Quy Giáp Yêu', hp: 200, maxHp: 200, atk: 40, def: 50, spd: 20 };
      
      const engine = new CombatEngine(mockPlayer, tankEnemy, mockOnUpdate, mockOnEnd);
      expect(engine.getEnemyArchetype()).toBe('TANK');
    });

    it('should classify BERSERKER if attack is significantly higher than defense', () => {
      const mockPlayer = { advancedStats: {}, equipment: {} };
      const berserkerEnemy = { name: 'Cuồng Chiến Binh', hp: 150, maxHp: 150, atk: 80, def: 30, spd: 40 };
      
      const engine = new CombatEngine(mockPlayer, berserkerEnemy, mockOnUpdate, mockOnEnd);
      expect(engine.getEnemyArchetype()).toBe('BERSERKER');
    });

    it('should classify BALANCED for general stats', () => {
      const mockPlayer = { advancedStats: {}, equipment: {} };
      const balancedEnemy = { name: 'Cân Bằng Giả', hp: 120, maxHp: 120, atk: 50, def: 45, spd: 45 };
      
      const engine = new CombatEngine(mockPlayer, balancedEnemy, mockOnUpdate, mockOnEnd);
      expect(engine.getEnemyArchetype()).toBe('BALANCED');
    });
  });

  describe('calculateRealmSuppression', () => {
    // getMajorRealmLevel maps realmId to major realm tiers:
    // Luyện Khí (1-13) -> Tier 1
    // Trúc Cơ (14-17) -> Tier 2
    // Kết Đan (18-21) -> Tier 3
    // Nguyên Anh (22-25) -> Tier 4
    
    it('should apply multiplier suppression for high realm against low realm', () => {
      const mockPlayer = { advancedStats: {}, equipment: {} };
      const enemy = { name: 'Yêu Thú Luyện Khí Kỳ', realmId: 5 }; // Tier 1
      
      const engine = new CombatEngine(mockPlayer, enemy, mockOnUpdate, mockOnEnd);
      
      const attacker = { realmId: 15 }; // Trúc Cơ Kỳ (Tier 2)
      const defender = { realmId: 5 };  // Luyện Khí Kỳ (Tier 1)
      
      const suppression = engine.calculateRealmSuppression(attacker, defender);
      // majorDiff = 1, subDiff = 10
      // mult = 1.0 + (1 * 0.5) + (10 * 0.05) = 2.0
      expect(suppression).toBeGreaterThan(1.0);
    });

    it('should penalize multiplier heavily when fighting a much stronger realm', () => {
      const mockPlayer = { advancedStats: {}, equipment: {} };
      const enemy = { name: 'Yêu Soái Nguyên Anh Kỳ', realmId: 23 }; // Tier 4
      
      const engine = new CombatEngine(mockPlayer, enemy, mockOnUpdate, mockOnEnd);
      
      const attacker = { realmId: 8 };   // Luyện Khí Kỳ (Tier 1)
      const defender = { realmId: 23 };  // Nguyên Anh Kỳ (Tier 4)
      
      const suppression = engine.calculateRealmSuppression(attacker, defender);
      // majorDiff = 3
      // mult = Math.pow(0.4, 3) - subDiff * 0.02 = 0.064 - 15 * 0.02 = -0.236 -> capped at Math.max(0.05, ...)
      expect(suppression).toBeLessThan(0.2);
    });

    it('should return 1.0 if realms are exactly equal', () => {
      const mockPlayer = { advancedStats: {}, equipment: {} };
      const enemy = { name: 'Đối Thủ Cân Cảnh', realmId: 14 };
      const engine = new CombatEngine(mockPlayer, enemy, mockOnUpdate, mockOnEnd);
      
      const attacker = { realmId: 14 };
      const defender = { realmId: 14 };
      
      expect(engine.calculateRealmSuppression(attacker, defender)).toBe(1.0);
    });
  });

  describe('calculateRacialSuppression', () => {
    it('should apply bloodline suppression for Dragons against Beasts', () => {
      const mockPlayer = { advancedStats: {}, equipment: {} };
      const enemy = { name: 'Thanh Vân Ly', race: 'SPIRIT_BEAST' };
      const engine = new CombatEngine(mockPlayer, enemy, mockOnUpdate, mockOnEnd);
      
      const dragonAttacker = { race: 'DRAGON' };
      const beastDefender = { race: 'SPIRIT_BEAST' };
      
      const suppression = engine.calculateRacialSuppression(dragonAttacker, beastDefender);
      expect(suppression).toBe(1.3);
    });

    it('should apply holy/righteous suppression for Buddhists against Demons', () => {
      const mockPlayer = { advancedStats: {}, equipment: {} };
      const enemy = { name: 'Tà Ma', race: 'DEMON' };
      const engine = new CombatEngine(mockPlayer, enemy, mockOnUpdate, mockOnEnd);
      
      const buddhistAttacker = { race: 'BUDDHIST' };
      const demonDefender = { race: 'DEMON' };
      
      const suppression = engine.calculateRacialSuppression(buddhistAttacker, demonDefender);
      expect(suppression).toBe(1.25);
    });

    it('should return 1.0 for standard matchups', () => {
      const mockPlayer = { advancedStats: {}, equipment: {} };
      const enemy = { name: 'Phàm Nhân', race: 'HUMAN' };
      const engine = new CombatEngine(mockPlayer, enemy, mockOnUpdate, mockOnEnd);
      
      const humanAttacker = { race: 'HUMAN' };
      const humanDefender = { race: 'HUMAN' };
      
      expect(engine.calculateRacialSuppression(humanAttacker, humanDefender)).toBe(1.0);
    });
  });

  describe('getElementalMultiplier', () => {
    it('should increase damage by 30% for elemental advantage', () => {
      const mockPlayer = { advancedStats: {}, equipment: {} };
      const engine = new CombatEngine(mockPlayer, {}, mockOnUpdate, mockOnEnd);
      
      // Thủy khắc Hỏa
      const mult = engine.getElementalMultiplier('Thủy', 'Hỏa');
      expect(mult).toBe(1.30);
    });

    it('should reduce damage by 20% for elemental disadvantage', () => {
      const mockPlayer = { advancedStats: {}, equipment: {} };
      const engine = new CombatEngine(mockPlayer, {}, mockOnUpdate, mockOnEnd);
      
      // Hỏa bị Thủy khắc
      const mult = engine.getElementalMultiplier('Hỏa', 'Thủy');
      expect(mult).toBe(0.80);
    });

    it('should keep damage neutral (1.0) when no elemental relation matches', () => {
      const mockPlayer = { advancedStats: {}, equipment: {} };
      const engine = new CombatEngine(mockPlayer, {}, mockOnUpdate, mockOnEnd);
      
      const mult = engine.getElementalMultiplier('Phong', 'Hỏa');
      expect(mult).toBe(1.0);
    });
  });

  describe('Phàm Nhân Combat Engine Upgraded Mechanics', () => {
    it('should calculate extreme realm suppression matrix correctly', () => {
      const mockPlayer = { advancedStats: {}, equipment: {} };
      const enemy = { name: 'Yêu Thú Luyện Khí Kỳ', realmId: 5 }; // Tier 1
      const engine = new CombatEngine(mockPlayer, enemy, mockOnUpdate, mockOnEnd);

      // 1. Extreme superiority (Tier 3 vs Tier 1) -> 8.65x
      const attacker1 = { realmId: 18 }; // Tier 3
      const defender1 = { realmId: 5 }; // Tier 1
      expect(engine.calculateRealmSuppression(attacker1, defender1)).toBe(8.65);

      // 2. Overwhelming gap (Tier 4 vs Tier 1) -> 20.85x
      const attacker2 = { realmId: 22 }; // Tier 4
      const defender2 = { realmId: 5 }; // Tier 1
      expect(engine.calculateRealmSuppression(attacker2, defender2)).toBe(20.85);

      // 3. Absolute godlike gap (Tier 5 vs Tier 1) -> 51.05x
      const attacker3 = { realmId: 26 }; // Tier 5
      const defender3 = { realmId: 5 }; // Tier 1
      expect(engine.calculateRealmSuppression(attacker3, defender3)).toBe(51.05);

      // 4. Heavy suppression against much higher (Tier 1 vs Tier 3) -> 0.005x (capped)
      expect(engine.calculateRealmSuppression(defender1, attacker1)).toBe(0.005);

      // 5. Total crushing (Tier 1 vs Tier 4) -> 0.005x (capped)
      expect(engine.calculateRealmSuppression(defender2, attacker2)).toBe(0.005);
    });

    it('should correctly process player attack with weakness and fatal strike rolls', () => {
      // 100% weakness strike chance, 0% fatal strike
      const player = {
        name: 'Tu Sĩ',
        hp: 100, maxHp: 100, mana: 50, maxMana: 50,
        atk: 100, def: 50, spd: 50, realmId: 14,
        advancedStats: {
          weaknessStrikeChance: 1.0,
          fatalStrikeChance: 0.0,
          critDmg: 1.5,
          fatalDmg: 3.0
        },
        equipment: {},
        calculateStats: vi.fn()
      };
      const enemy = { name: 'Quái', hp: 1000, maxHp: 1000, atk: 50, def: 20, spd: 50, realmId: 14 };
      const engine = new CombatEngine(player, enemy, mockOnUpdate, mockOnEnd);

      // Spy Math.random
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

      // Let's call playerAttack()
      engine.playerAttack();

      // Damage: (player.atk - enemy.def/2) * weakness strike multiplier
      // (100 - 10) * 1.5 = 135 -> enemy.hp = 1000 - 135 = 865
      expect(enemy.hp).toBe(865);

      randomSpy.mockRestore();
    });

    it('should trigger heart demon turn penalties correctly', () => {
      const player = {
        name: 'Tu Sĩ',
        hp: 100, maxHp: 100, mana: 100, maxMana: 100,
        atk: 50, def: 50, spd: 50, realmId: 14,
        advancedStats: { weaknessStrikeChance: 0.05, fatalStrikeChance: 0.02 },
        equipment: {},
        buffs: [],
        calculateStats: vi.fn()
      };
      const enemy = { name: 'Quái', hp: 100, maxHp: 100, atk: 50, def: 50, spd: 50, realmId: 14 };
      const engine = new CombatEngine(player, enemy, mockOnUpdate, mockOnEnd);
      engine.combatHeartDemon = 60; // Thần Thức Hỗn Loạn triggerable
      engine.turn = 0; // Player's turn

      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.1); // triggers 20% Thần Thức Hỗn Loạn
      const endTurnSpy = vi.spyOn(engine, 'endPlayerTurn').mockImplementation(() => {});

      engine.processTurnStatus();

      expect(endTurnSpy).toHaveBeenCalled();
      randomSpy.mockRestore();
    });

    it('should correctly handle Thần Thức (Divine Sense) resource and actions', () => {
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.9);
      const player = {
        name: 'Tu Sĩ',
        hp: 100, maxHp: 100, mana: 100, maxMana: 100,
        atk: 50, def: 50, spd: 50, realmId: 14,
        maxThanThuc: 100, thanThuc: 50,
        advancedStats: { weaknessStrikeChance: 0.05, fatalStrikeChance: 0.02 },
        equipment: { phap_bao_cong: 'thanh_hong_kiem' },
        recognizedItems: ['thanh_hong_kiem'],
        buffs: [],
        calculateStats: vi.fn()
      };
      const enemy = { name: 'Quái', hp: 500, maxHp: 500, atk: 50, def: 50, spd: 50, realmId: 14, maxThanThuc: 50, thanThuc: 50 };
      
      const engine = new CombatEngine(player, enemy, mockOnUpdate, mockOnEnd);

      // Test passive regeneration
      engine.turn = 0;
      engine.processTurnStatus();
      // Recovery = 2 + 2% maxThanThuc = 2 + 2 = 4 -> thanThuc becomes 54
      expect(player.thanThuc).toBe(54);

      // Test Luyện Tâm (Meditate) Thần Thức recovery
      player.thanThuc = 50;
      engine.playerMeditate();
      // recovery = 15% maxThanThuc = 15 -> thanThuc becomes 65
      expect(player.thanThuc).toBe(65);

      // Test Thần Thức Trấn Áp (Soul Repress) consumption & damage
      player.thanThuc = 50;
      engine.playerSoulRepress();
      // cost = 25 -> thanThuc becomes 25
      expect(player.thanThuc).toBe(25);
      // damage is calculated and enemy hp decreases
      expect(enemy.hp).toBeLessThan(500);

      // Test Artifact Attack consumption of both mana & thanThuc
      player.mana = 100;
      player.thanThuc = 50;
      engine.playerArtifactAttack();
      // costMana = 20 -> mana becomes 80
      expect(player.mana).toBe(80);
      // costThanThuc = 15 -> thanThuc becomes 35
      expect(player.thanThuc).toBe(35);

      randomSpy.mockRestore();
    });
  });

  describe('Combat Escape & Chase Mechanics', () => {
    it('should fail player escape if caught by enemy and set playerCannotEscape', () => {
      const player = {
        name: 'Tu Sĩ', spd: 10, advancedStats: {}, equipment: {}, inventory: { allItems: [] }
      };
      const enemy = { name: 'Thích Khách', spd: 100 }; // Much faster enemy
      const engine = new CombatEngine(player, enemy, mockOnUpdate, mockOnEnd);
      engine.turn = 0;
      engine.isActive = true;

      // Force catch
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.01);

      engine.playerEscape();

      expect(engine.playerCannotEscape).toBe(true);
      expect(engine.isActive).toBe(true);
      expect(mockOnUpdate).toHaveBeenCalledWith('escape-fail');

      randomSpy.mockRestore();
    });

    it('should prevent player escape if playerCannotEscape is already true', () => {
      const player = {
        name: 'Tu Sĩ', spd: 100, advancedStats: {}, equipment: {}, inventory: { allItems: [] }
      };
      const enemy = { name: 'Quái', spd: 10 };
      const engine = new CombatEngine(player, enemy, mockOnUpdate, mockOnEnd);
      engine.turn = 0;
      engine.isActive = true;
      engine.playerCannotEscape = true;

      const addLogSpy = vi.spyOn(engine, 'addLog');
      engine.playerEscape();

      expect(addLogSpy).toHaveBeenCalledWith(expect.stringContaining('không thể trốn chạy được nữa'));
      expect(engine.isActive).toBe(true);
    });

    it('should consume speed-boosting item and successfully chase enemy', () => {
      const allItems = [
        { id: 'phu_van_than_hanh_phu', quantity: 2 }
      ];
      const player = {
        name: 'Tu Sĩ',
        spd: 50,
        advancedStats: {},
        equipment: {},
        inventory: {
          allItems: allItems,
          removeItem: vi.fn((id, qty) => {
            const item = allItems.find(i => i.id === id);
            if (item) item.quantity -= qty;
          })
        }
      };
      const enemy = { name: 'Quái', spd: 60 };
      const engine = new CombatEngine(player, enemy, mockOnUpdate, mockOnEnd);
      engine.isActive = true;

      // Mock random to guarantee success (e.g. 0.05 < successChance)
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.01);

      // Chase with phu_van_than_hanh_phu (+30 spd)
      const success = engine.chaseEnemy('phu_van_than_hanh_phu');

      expect(success).toBe(true);
      expect(player.inventory.removeItem).toHaveBeenCalledWith('phu_van_than_hanh_phu', 1);
      expect(allItems[0].quantity).toBe(1);
      expect(engine.enemyCannotEscape).toBe(true);
      expect(engine.isActive).toBe(true);

      randomSpy.mockRestore();
    });

    it('should apply DEVIL_TRANSFORM skill boosting enemy ATK and DEF', () => {
      const player = { name: 'Tu Sĩ', hp: 100, maxHp: 100, def: 50, advancedStats: {}, equipment: {} };
      const enemy = { name: 'Ma Tu', hp: 100, maxHp: 100, atk: 50, def: 30, spd: 40 };
      const engine = new CombatEngine(player, enemy, mockOnUpdate, mockOnEnd);
      engine.isActive = true;

      engine.enemyUseSkill('DEVIL_TRANSFORM');

      expect(enemy.atk).toBe(70); // 50 * 1.4 = 70
      expect(enemy.def).toBe(39); // 30 * 1.3 = 39
    });

    it('should apply SOUL_DEVOUR skill dealing damage and healing the enemy', () => {
      const player = { name: 'Tu Sĩ', hp: 100, maxHp: 100, def: 10, advancedStats: {}, equipment: {} };
      const enemy = { name: 'Ma Tu', hp: 50, maxHp: 100, atk: 50, def: 30, spd: 40 };
      const engine = new CombatEngine(player, enemy, mockOnUpdate, mockOnEnd);
      engine.isActive = true;

      engine.enemyUseSkill('SOUL_DEVOUR');

      expect(player.hp).toBe(26);
      expect(enemy.hp).toBe(94);
    });
  });
});
