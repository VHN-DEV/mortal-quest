import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Player } from '../src/core/player.js';
import { TreasureSystem } from '../src/systems/treasure-system.js';
import { PuppetSystem } from '../src/systems/puppet-system.js';
import { state } from '../src/state.js';

beforeEach(() => {
  state.ui = {
    toast: vi.fn(),
    alert: vi.fn()
  };
});

describe('Treasure & Puppet Repair Mechanics', () => {
  describe('Dharma Treasure Repair (TreasureSystem)', () => {
    it('should fail dan_fire if realmId < 18 or durability < 80', () => {
      const player = new Player();
      const treasureSystem = new TreasureSystem(player, state.ui);

      // Setup equipment
      player.equipment.phap_bao = 'thanh_hong_kiem';
      player.equipmentMetadata.phap_bao = { level: 1, spirit: 0, durability: 79 };

      // Low realm (0) and durability 79: should fail
      player.realmId = 17;
      let res = treasureSystem.repair('phap_bao', 'dan_fire');
      expect(res.success).toBe(false);
      expect(res.msg).toContain('Kết Đan Kỳ');

      // High realm (18) but durability 79: should fail
      player.realmId = 18;
      res = treasureSystem.repair('phap_bao', 'dan_fire');
      expect(res.success).toBe(false);
      expect(res.msg).toContain('hư hại quá nặng');

      // High realm (18) and durability 85: should succeed
      player.equipmentMetadata.phap_bao.durability = 85;
      player.stamina = 100;
      player.mana = 500;
      res = treasureSystem.repair('phap_bao', 'dan_fire');
      expect(res.success).toBe(true);
      expect(player.equipmentMetadata.phap_bao.durability).toBe(100);
      expect(player.stamina).toBe(100 - (15 * 5)); // 85 -> 100: points = 15. Stamina cost = 15 * 5 = 75
      expect(player.mana).toBe(500 - (15 * 20)); // Mana cost = 15 * 20 = 300
    });

    it('should fail forge repair if no flame/tools or low smithing level', () => {
      const player = new Player();
      const treasureSystem = new TreasureSystem(player, state.ui);

      player.equipment.phap_bao = 'tinh_ha_phi_kiem'; // Recipe level 2
      player.equipmentMetadata.phap_bao = { level: 1, spirit: 0, durability: 50 };

      // No flame/tool
      let res = treasureSystem.repair('phap_bao', 'forge', 'tinh_kim');
      expect(res.success).toBe(false);
      expect(res.msg).toContain('Linh Hỏa và Dụng Cụ Rèn');

      // Has flame/tool but low smithing level
      player.currentFlame = 'linh_hoa';
      player.smithingTool = 'luyen_khi_dai';
      player.smithingLevel = 1; // Required: 2
      res = treasureSystem.repair('phap_bao', 'forge', 'tinh_kim');
      expect(res.success).toBe(false);
      expect(res.msg).toContain('Cấp Luyện Khí Sư chưa đủ');

      // Has skills but no materials
      player.smithingLevel = 2;
      res = treasureSystem.repair('phap_bao', 'forge', 'tinh_kim');
      expect(res.success).toBe(false);
      expect(res.msg).toContain('Không đủ nguyên liệu');

      // Success case
      player.inventory.addItem('tinh_kim', 1);
      player.addLingShi(500); // Has plenty of money
      res = treasureSystem.repair('phap_bao', 'forge', 'tinh_kim');
      expect(res.success).toBe(true);
      expect(player.equipmentMetadata.phap_bao.durability).toBe(100);
      expect(player.inventory.hasItem('tinh_kim', 1)).toBe(false);
    });

    it('should allow hire repair with proper material and high spirit stones cost', () => {
      const player = new Player();
      const treasureSystem = new TreasureSystem(player, state.ui);

      player.equipment.phap_bao = 'tinh_ha_phi_kiem';
      player.equipmentMetadata.phap_bao = { level: 1, spirit: 0, durability: 90 };

      // Lacks material
      let res = treasureSystem.repair('phap_bao', 'hire', 'tinh_kim');
      expect(res.success).toBe(false);
      expect(res.msg).toContain('Không đủ nguyên liệu');

      // Has material but lacks money (Needs (100-90)*15 = 150 Linh Thạch)
      player.inventory.addItem('tinh_kim', 1);
      player.inventory.removeItem('ha_pham_linh_thach', player.inventory.getItemQuantity('ha_pham_linh_thach'));
      player.inventory.removeItem('trung_pham_linh_thach', player.inventory.getItemQuantity('trung_pham_linh_thach'));
      res = treasureSystem.repair('phap_bao', 'hire', 'tinh_kim');
      expect(res.success).toBe(false);
      expect(res.msg).toContain('Không đủ Linh Thạch');

      // Success
      player.addLingShi(200);
      res = treasureSystem.repair('phap_bao', 'hire', 'tinh_kim');
      expect(res.success).toBe(true);
      expect(player.equipmentMetadata.phap_bao.durability).toBe(100);
      expect(player.inventory.hasItem('tinh_kim', 1)).toBe(false);
    });
  });

  describe('Puppet Repair (PuppetSystem)', () => {
    it('should require a compatible material to repair a puppet', () => {
      const player = new Player();
      const puppetSystem = new PuppetSystem(player, state.ui);

      // Create a puppet in inventory
      player.inventory.addItem('khoi_loi', 1, {
        uniqueId: 'p1',
        puppetId: 'thiet_giap_khoi_loi', // Recipe has huyen_thiet
        name: 'Thiết Giáp Khôi Lỗi',
        durability: 50,
        maxDurability: 100,
        deployed: false
      });

      // Lacks huyen_thiet: repair should fail
      let res = puppetSystem.repair('p1', 'huyen_thiet');
      expect(res.success).toBe(false);
      expect(res.msg).toContain('Thiếu nguyên liệu');

      // Has huyen_thiet but lacks money
      player.inventory.addItem('huyen_thiet', 1);
      res = puppetSystem.repair('p1', 'huyen_thiet');
      expect(res.success).toBe(false);
      expect(res.msg).toContain('Linh Thạch');

      // Success
      player.addLingShi(5000);
      res = puppetSystem.repair('p1', 'huyen_thiet');
      expect(res.success).toBe(true);
      const puppet = player.inventory.allItems.find(i => i.id === 'khoi_loi' && i.metadata?.uniqueId === 'p1');
      expect(puppet.metadata.durability).toBe(100);
      expect(player.inventory.hasItem('huyen_thiet', 1)).toBe(false);
    });
  });
});
