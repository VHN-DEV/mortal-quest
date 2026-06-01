import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Player } from '../src/core/player.js';
import { Inventory } from '../src/core/inventory.js';
import { state } from '../src/state.js';
import { getItemById } from '../src/configs/item-data.js';

// Setup Mock UI on state
beforeEach(() => {
  state.ui = {
    toast: vi.fn(),
    alert: vi.fn()
  };
});

describe('PNTT Dynamic Item Effects', () => {
  it('should permanently increase player divine sense and max mana when consuming Linh Chi Tiên Thảo', () => {
    const player = new Player();
    player.divineSense = 100;
    player.baseStats.maxMana = 1000;
    player.maxMana = 1000;
    player.mana = 500;

    const inventory = player.inventory;
    inventory.addItem('linh_chi_tien_cao', 1);

    const used = inventory.useItem('linh_chi_tien_cao', 1);
    expect(used).toBe(true);

    // Assert stats are permanently increased
    expect(player.divineSense).toBe(150); // 100 + 50
    expect(player.bonusStats.maxMana).toBe(200); // bonus is exactly +200
    expect(player.maxMana).toBe(250); // base (50 at starting realm) + bonus (200) = 250
  });

  it('should purify and increase spiritual root purity when below 100%', () => {
    const player = new Player();
    player.spiritualRoot = {
      id: 'song_linh_can',
      type: 'Song Linh Căn (Kim - Thủy) (Cân Bằng)',
      elements: ['Kim', 'Thủy'],
      proportions: { 'Kim': 50, 'Thủy': 50 },
      purity: 80,
      multiplier: 1.6
    };

    const inventory = player.inventory;
    inventory.addItem('bich_hue_linh_can', 1);

    const used = inventory.useItem('bich_hue_linh_can', 1);
    expect(used).toBe(true);

    // Purity should go from 80% to 90%
    expect(player.spiritualRoot.purity).toBe(90);
    expect(player.spiritualRoot.multiplier).toBeCloseTo(1.8, 5); // (1.6 / 0.8) * 0.9 = 1.8
    expect(player.divineSense).toBe(550); // 50 (default) + 500
  });

  it('should refine, strip an element, and upgrade spiritual root classification when purity is 100%', () => {
    const player = new Player();
    player.spiritualRoot = {
      id: 'tam_linh_can',
      type: 'Tam Linh Căn (Kim - Mộc - Thủy) (Cân Bằng)',
      elements: ['Kim', 'Mộc', 'Thủy'],
      proportions: { 'Kim': 33, 'Mộc': 33, 'Thủy': 34 },
      purity: 100,
      multiplier: 1.5
    };

    const inventory = player.inventory;
    inventory.addItem('bich_hue_linh_can', 1);

    const used = inventory.useItem('bich_hue_linh_can', 1);
    expect(used).toBe(true);

    // Elements should shrink by 1: from 3 down to 2
    expect(player.spiritualRoot.elements.length).toBe(2);
    expect(player.spiritualRoot.elements).not.toContain('Thủy'); // Popped last element
    expect(player.spiritualRoot.id).toBe('song_linh_can');
    expect(player.spiritualRoot.type).toContain('Song Linh Căn');
    expect(player.spiritualRoot.proportions['Kim']).toBe(50);
    expect(player.spiritualRoot.proportions['Mộc']).toBe(50);
    expect(player.spiritualRoot.proportions['Thủy']).toBeUndefined();
    expect(player.spiritualRoot.multiplier).toBeGreaterThan(1.5);
  });
});
