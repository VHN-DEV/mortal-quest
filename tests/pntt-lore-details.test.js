import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Player } from '../src/core/player.js';
import { CombatEngine } from '../src/core/combat-engine.js';
import { TreasureSystem } from '../src/systems/treasure-system.js';
import { state } from '../src/state.js';

beforeEach(() => {
  state.ui = {
    toast: vi.fn(),
    alert: vi.fn()
  };
  state.systems = {};
});

describe('PNTT Lore Accuracy', () => {
  describe('Tịch Tà Thần Lôi Damage Scaling', () => {
    const createPlayerWithSwords = (evolutionState) => {
      const player = new Player();
      player.name = 'Hàn Lập';
      player.hp = 100;
      player.maxHp = 100;
      player.mana = 100;
      player.maxMana = 100;
      player.atk = 100;
      player.def = 50;
      player.spd = 50;
      player.realmId = 14;
      player.advancedStats = {
        weaknessStrikeChance: 0,
        fatalStrikeChance: 0,
        critDmg: 1.5,
        fatalDmg: 3.0
      };
      player.natalTreasure = {
        id: 'thanh_truc_phong_van_kiem',
        name: 'Thanh Trúc Phong Vân Kiếm',
        evolutionState: evolutionState
      };
      player.equipment = {};
      player.calculateStats = vi.fn();
      return player;
    };

    it('should scale Tịch Tà Thần Lôi by 15% at NONE state against DEMON', () => {
      const player = createPlayerWithSwords('NONE');
      const enemy = { name: 'Ma Cường Giả', hp: 1000, maxHp: 1000, atk: 50, def: 20, spd: 50, realmId: 14, race: 'DEMON' };
      const engine = new CombatEngine(player, enemy, vi.fn(), vi.fn());
      
      // Spy Math.random to not trigger anything random
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

      engine.playerAttack();

      // Base damage: player.atk - enemy.def / 2 = 100 - 10 = 90
      // Tịch Tà Thần Lôi damage: 90 * 0.15 = 13 (Math.floor(13.5))
      // Total damage: 90 + 13 = 103
      // Enemy HP: 1000 - 103 = 897
      expect(enemy.hp).toBe(897);
      randomSpy.mockRestore();
    });

    it('should scale Tịch Tà Thần Lôi by 20% at KIEM_TAM state against GHOST', () => {
      const player = createPlayerWithSwords('KIEM_TAM');
      const enemy = { name: 'Lệ Quỷ', hp: 1000, maxHp: 1000, atk: 50, def: 20, spd: 50, realmId: 14, race: 'GHOST' };
      const engine = new CombatEngine(player, enemy, vi.fn(), vi.fn());
      
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

      engine.playerAttack();

      // Base damage: 100 - 10 = 90
      // Tịch Tà Thần Lôi damage: 90 * 0.20 = 18
      // Total damage: 90 + 18 = 108
      // Enemy HP: 1000 - 108 = 892
      expect(enemy.hp).toBe(892);
      randomSpy.mockRestore();
    });

    it('should scale Tịch Tà Thần Lôi by 30% at KIEM_LINH state against DEMON', () => {
      const player = createPlayerWithSwords('KIEM_LINH');
      const enemy = { name: 'Ma Tu', hp: 1000, maxHp: 1000, atk: 50, def: 20, spd: 50, realmId: 14, race: 'DEMON' };
      const engine = new CombatEngine(player, enemy, vi.fn(), vi.fn());
      
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

      engine.playerAttack();

      // Base damage: 100 - 10 = 90
      // Tịch Tà Thần Lôi damage: 90 * 0.30 = 27
      // Total damage: 90 + 27 = 117
      // Enemy HP: 1000 - 117 = 883
      expect(enemy.hp).toBe(883);
      randomSpy.mockRestore();
    });

    it('should scale Tịch Tà Thần Lôi by 45% at TIEN_KHI state against GHOST', () => {
      const player = createPlayerWithSwords('TIEN_KHI');
      const enemy = { name: 'Quỷ Vương', hp: 1000, maxHp: 1000, atk: 50, def: 20, spd: 50, realmId: 14, race: 'GHOST' };
      const engine = new CombatEngine(player, enemy, vi.fn(), vi.fn());
      
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

      engine.playerAttack();

      // Base damage: 100 - 10 = 90
      // Tịch Tà Thần Lôi damage: 90 * 0.45 = 40 (Math.floor(40.5))
      // Total damage: 90 + 40 = 130
      // Enemy HP: 1000 - 130 = 870
      expect(enemy.hp).toBe(870);
      randomSpy.mockRestore();
    });
  });

  describe('Chưởng Thiên Bình Night-Only Condensation', () => {
    it('should only accumulate progress and condense Linh Dịch at Night', () => {
      const player = new Player();
      player.equipment.phap_bao = 'chuong_thien_binh';
      
      const treasureSystem = new TreasureSystem(player, state.ui);

      // Mock TimeSystem
      const mockTimeSystem = {
        isNight: vi.fn()
      };
      state.systems.time = mockTimeSystem;

      // 1. Daytime test
      mockTimeSystem.isNight.mockReturnValue(false);
      treasureSystem.update(100);

      // Progress should not change (still undefined or 0)
      expect(player.artifactData?.chuong_thien_binh?.progress || 0).toBe(0);
      expect(player.inventory.hasItem('linh_dich_chuong_thien_binh', 1)).toBe(false);

      // 2. Nighttime test - progresses
      mockTimeSystem.isNight.mockReturnValue(true);
      treasureSystem.update(100);
      expect(player.artifactData.chuong_thien_binh.progress).toBe(100);
      expect(player.inventory.hasItem('linh_dich_chuong_thien_binh', 1)).toBe(false);

      // 3. Nighttime test - reaches threshold (300)
      treasureSystem.update(200);
      // Reached 300: progress resets to 0 (300 - 300) and item added
      expect(player.artifactData.chuong_thien_binh.progress).toBe(0);
      expect(player.inventory.hasItem('linh_dich_chuong_thien_binh', 1)).toBe(true);
    });
  });
});
