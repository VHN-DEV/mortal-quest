import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Player } from '../src/core/player.js';
import { SpiritStoneSystem } from '../src/systems/spirit-stone-system.js';
import { state } from '../src/state.js';

beforeEach(() => {
  state.ui = {
    toast: vi.fn(),
    alert: vi.fn()
  };
  state.systems = {
    energy: {
      absorbQi: vi.fn((qiType, amount) => ({ success: true, gain: amount }))
    }
  };
});

describe('Spirit Stone System - Absorption & Spirit Root Integration', () => {
  describe('Player spiritRoot Integration', () => {
    it('should dynamically return elements of spiritualRoot', () => {
      const player = new Player();
      
      // Initially spiritualRoot is null, so spiritRoot should be empty
      expect(player.spiritRoot).toEqual([]);

      // Set spiritualRoot
      player.spiritualRoot = {
        id: 'song_linh_can',
        elements: ['Kim', 'Mộc'],
        proportions: { 'Kim': 50, 'Mộc': 50 },
        multiplier: 1.15
      };

      // Getter should automatically reflect the elements
      expect(player.spiritRoot).toEqual(['Kim', 'Mộc']);

      // Modifying elements array directly should reflect immediately
      player.spiritualRoot.elements.push('Thủy');
      expect(player.spiritRoot).toEqual(['Kim', 'Mộc', 'Thủy']);
    });

    it('should handle no-op setter and serialization/deserialization safely', () => {
      const player = new Player();
      player.spiritualRoot = {
        id: 'thien_linh_can',
        elements: ['Hỏa'],
        multiplier: 1.25
      };

      // Calling setter should not crash
      player.spiritRoot = ['Kim']; // should be a no-op since it derives from spiritualRoot
      expect(player.spiritRoot).toEqual(['Hỏa']);

      // Serialize player data
      const savedData = player.save();
      expect(savedData.spiritRoot).toEqual(['Hỏa']);

      // Load player data
      const newPlayer = new Player();
      newPlayer.load(savedData);
      expect(newPlayer.spiritualRoot).toEqual(player.spiritualRoot);
      expect(newPlayer.spiritRoot).toEqual(['Hỏa']);
    });
  });

  describe('Spirit Stone Attribute Matching and Absorption Flow', () => {
    it('should absorb a normal spirit stone without attribute bonus', () => {
      const player = new Player();
      player.spiritualRoot = {
        id: 'thien_linh_can',
        elements: ['Hỏa'],
        multiplier: 1.25
      };

      // Add 5 normal spirit stones
      player.inventory.addItem('ha_pham_linh_thach', 5);

      const ssSystem = new SpiritStoneSystem(player, state.ui);
      const res = ssSystem.absorb('ha_pham_linh_thach', 5);

      expect(res.success).toBe(true);
      expect(state.systems.energy.absorbQi).toHaveBeenCalled();
      
      // Normal stone base Qi = 1.0 multiplier * 10 * 5 stones = 50 Qi
      // Normal stone quality = BINH_THUONG (multiplier 1.0)
      // Normal stone attribute = NORMAL (attrBonus = 1.0)
      // Total expected Qi = 50
      const callArgs = state.systems.energy.absorbQi.mock.calls[0];
      expect(callArgs[0]).toBe('linh_khi');
      expect(callArgs[1]).toBe(50);
      expect(player.inventory.getItemQuantity('ha_pham_linh_thach')).toBe(0);
    });

    it('should apply 1.5x bonus when absorbing spirit stone matching player elements', () => {
      const player = new Player();
      player.spiritualRoot = {
        id: 'thien_linh_can',
        elements: ['Hỏa'],
        multiplier: 1.25
      };

      // Add 2 fire spirit stones (attribute: FIRE -> Hỏa)
      player.inventory.addItem('hoa_linh_thach', 2);

      const ssSystem = new SpiritStoneSystem(player, state.ui);
      const res = ssSystem.absorb('hoa_linh_thach', 2);

      expect(res.success).toBe(true);
      // Fire stone base Qi = 1.0 multiplier * 10 * 2 stones = 20 Qi
      // Quality: BINH_THUONG (multiplier 1.0)
      // AttrBonus: 1.5 (FIRE translated to Hỏa, matching player elements)
      // Total expected Qi = 20 * 1.0 * 1.5 = 30
      const callArgs = state.systems.energy.absorbQi.mock.calls[0];
      expect(callArgs[0]).toBe('viem_khi'); // FIRE maps to viem_khi
      expect(callArgs[1]).toBe(30);
      expect(player.inventory.getItemQuantity('hoa_linh_thach')).toBe(0);
    });

    it('should NOT apply bonus when absorbing spirit stone not matching player elements', () => {
      const player = new Player();
      player.spiritualRoot = {
        id: 'thien_linh_can',
        elements: ['Thổ'], // Only earth element, does not match FIRE
        multiplier: 1.25
      };

      player.inventory.addItem('hoa_linh_thach', 2);

      const ssSystem = new SpiritStoneSystem(player, state.ui);
      const res = ssSystem.absorb('hoa_linh_thach', 2);

      expect(res.success).toBe(true);
      // Expected Qi = 20 * 1.0 * 1.0 = 20 (no bonus)
      const callArgs = state.systems.energy.absorbQi.mock.calls[0];
      expect(callArgs[1]).toBe(20);
    });

    it('should apply 2.0x bonus when player on MA path absorbs DEMON stone', () => {
      const player = new Player();
      player.path = 'MA';
      player.spiritualRoot = {
        id: 'thien_linh_can',
        elements: ['Kim'],
        multiplier: 1.25
      };

      player.inventory.addItem('ma_linh_thach', 1);

      const ssSystem = new SpiritStoneSystem(player, state.ui);
      const res = ssSystem.absorb('ma_linh_thach', 1);

      expect(res.success).toBe(true);
      // Demon stone base Qi = 1.0 multiplier * 10 * 1 stone = 10 Qi
      // Path MA + DEMON attribute = 2.0x bonus
      // Total expected Qi = 10 * 1.0 * 2.0 = 20
      const callArgs = state.systems.energy.absorbQi.mock.calls[0];
      expect(callArgs[0]).toBe('ma_khi');
      expect(callArgs[1]).toBe(20);
    });
  });
});
