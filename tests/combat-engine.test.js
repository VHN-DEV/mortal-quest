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
});
