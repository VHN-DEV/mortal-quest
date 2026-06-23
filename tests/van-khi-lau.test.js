import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Player } from '../src/core/player.js';
import { Game } from '../src/game.js';
import { state } from '../src/state.js';
import { getItemById } from '../src/configs/item-data.js';

describe('Vạn Khí Lâu System', () => {
  let player;
  let game;

  beforeEach(() => {
    state.ui = {
      toast: vi.fn(),
      alert: vi.fn()
    };
    player = new Player();
    state.player = player;

    game = new Game();
    game.refreshUI = vi.fn();
  });

  describe('Custom Refining (Đặt Luyện Cổ Phương)', () => {
    it('should forge a recipe using own materials and pay fee', () => {
      // Recipe: 'thanh_hong_kiem', requires 5x huyen_thiet
      player.inventory.addItem('huyen_thiet', 5);
      player.addLingShi(1000); // 1000 LS fee

      game.vanKhiLauForge('thanh_hong_kiem', true);

      expect(player.inventory.getItemQuantity('huyen_thiet')).toBe(0);
      expect(player.lingShi).toBe(0);
      expect(player.inventory.hasItem('thanh_hong_kiem')).toBe(true);
    });

    it('should forge a recipe and automatically buy missing materials', () => {
      // Recipe: 'thanh_hong_kiem', requires 5x huyen_thiet
      // 'huyen_thiet' price is 200. Missing 5x huyen_thiet -> 5 * 200 = 1000.
      // Total cost: 1000 fee + 1000 materials = 2000.
      player.addLingShi(2000);

      game.vanKhiLauForge('thanh_hong_kiem', false);

      expect(player.lingShi).toBe(0);
      expect(player.inventory.hasItem('thanh_hong_kiem')).toBe(true);
    });

    it('should fail forge if not enough Linh Thạch', () => {
      // Recipe: 'thanh_hong_kiem', requires 5x huyen_thiet
      player.addLingShi(999); // Lacks 1 LS for fee

      game.vanKhiLauForge('thanh_hong_kiem', true);

      expect(player.inventory.hasItem('thanh_hong_kiem')).toBe(false);
    });
  });

  describe('Durability Repair (Khôi Phục Linh Tính)', () => {
    beforeEach(() => {
      player.equipment.phap_bao_cong = 'thanh_hong_kiem';
      player.equipmentMetadata.phap_bao_cong = { level: 1, spirit: 0, durability: 90 };
    });

    it('should repair normally without materials by paying higher fee', () => {
      // 10 durability points needed. Normal cost: 10 * 30 = 300 LS.
      player.addLingShi(300);

      game.vanKhiLauRepair('phap_bao_cong', false);

      expect(player.equipmentMetadata.phap_bao_cong.durability).toBe(100);
      expect(player.lingShi).toBe(0);
    });

    it('should repair with material discount by paying lower fee', () => {
      // 10 durability points needed. Material cost: 10 * 5 = 50 LS + 1x Huyền Thiết.
      player.inventory.addItem('huyen_thiet', 1);
      player.addLingShi(50);

      game.vanKhiLauRepair('phap_bao_cong', true);

      expect(player.equipmentMetadata.phap_bao_cong.durability).toBe(100);
      expect(player.inventory.getItemQuantity('huyen_thiet')).toBe(0);
      expect(player.lingShi).toBe(0);
    });
  });

  describe('Upgrade & Stat Scaling', () => {
    beforeEach(() => {
      player.equipment.phap_bao_cong = 'thanh_hong_kiem';
      player.equipmentMetadata.phap_bao_cong = { level: 1, spirit: 0, durability: 100 };
    });

    it('should upgrade equipment level by consuming materials and spirit stones', () => {
      // Upgrade from level 1 to 2. Cost: 1 * 2000 = 2000 LS + 1x Huyền Thiết.
      player.inventory.addItem('huyen_thiet', 1);
      player.addLingShi(2000);

      game.vanKhiLauUpgrade('phap_bao_cong');

      expect(player.equipmentMetadata.phap_bao_cong.level).toBe(2);
      expect(player.inventory.getItemQuantity('huyen_thiet')).toBe(0);
      expect(player.lingShi).toBe(0);
    });

    it('should apply level multiplier to player stats', () => {
      const item = getItemById('thanh_hong_kiem');
      const baseAtk = item.stats.atk; // 35

      // Equipping level 1 thanh_hong_kiem
      player.realmId = 1; // Needs cultivation level to equip
      player.equipmentMetadata.phap_bao_cong = { level: 1, spirit: 0, durability: 100 };
      player.calculateStats();
      const atkLevel1 = player.bonusStats.atk;

      // Equipping level 2 thanh_hong_kiem (+10%)
      player.equipmentMetadata.phap_bao_cong.level = 2;
      player.calculateStats();
      const atkLevel2 = player.bonusStats.atk;

      expect(atkLevel2).toBeGreaterThan(atkLevel1);
      expect(atkLevel2).toBeCloseTo(atkLevel1 * 1.1, 1);
    });
  });
});
