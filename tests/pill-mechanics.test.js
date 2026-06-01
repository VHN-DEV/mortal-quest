import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Inventory } from '../src/core/inventory.js';
import { Player } from '../src/core/player.js';
import { state } from '../src/state.js';

// Setup Mock UI on state
beforeEach(() => {
  state.ui = {
    toast: vi.fn(),
    alert: vi.fn()
  };
  state.systems = {
    time: {
      totalDays: 1
    }
  };
});

describe('Pill Toxicity and Resistance Mechanics', () => {
  it('should initialize player with pill stats', () => {
    const player = new Player();
    expect(player.danPoison).toBe(0);
    expect(player.pillResistance).toEqual({});
    expect(player.dailyPillStats).toEqual({ day: 0, count: 0 });
  });

  it('should enforce daily absorption limit based on realm', () => {
    const player = new Player();
    player.realmId = 1; // Luyện Khí (limit: 5)
    player.dailyPillStats = { day: 1, count: 0 };
    
    const inv = new Inventory(player);
    player.inventory = inv;
    
    // Add 6 pills
    inv.addItem('ngung_khi_dan', 6);
    
    // Consume 5 pills (allowed)
    let res = inv.useItem('ngung_khi_dan', 5);
    expect(res).toBe(true);
    expect(player.dailyPillStats.count).toBe(5);
    
    // Try to consume the 6th pill (should block)
    res = inv.useItem('ngung_khi_dan', 1);
    expect(res).toBe(false);
    expect(player.dailyPillStats.count).toBe(5);
    expect(state.ui.toast).toHaveBeenCalledWith(
      expect.stringContaining('Kinh mạch hôm nay đã đạt giới hạn hấp thu'),
      'warning'
    );
  });

  it('should apply diminishing returns (kháng thuốc) with consecutive consumption', () => {
    const player = new Player();
    player.realmId = 1; // Luyện Khí (limit: 5)
    player.dailyPillStats = { day: 1, count: 0 };
    player.tuVi = 0;
    
    const inv = new Inventory(player);
    player.inventory = inv;
    
    // Add 4 Ngưng Khí Đan (base value: 500 exp)
    inv.addItem('ngung_khi_dan', 4);
    
    // 1st pill: 100% effectiveness (500 exp)
    inv.useItem('ngung_khi_dan', 1);
    expect(player.tuVi).toBe(500);
    expect(player.pillResistance['ngung_khi_dan']).toBe(1);
    
    // 2nd pill: 70% effectiveness (350 exp)
    inv.useItem('ngung_khi_dan', 1);
    expect(player.tuVi).toBe(500 + 350);
    expect(player.pillResistance['ngung_khi_dan']).toBe(2);

    // 3rd pill: 30% effectiveness (150 exp)
    inv.useItem('ngung_khi_dan', 1);
    expect(player.tuVi).toBe(500 + 350 + 150);
    expect(player.pillResistance['ngung_khi_dan']).toBe(3);

    // 4th pill: 10% effectiveness (50 exp)
    inv.useItem('ngung_khi_dan', 1);
    expect(player.tuVi).toBe(500 + 350 + 150 + 50);
    expect(player.pillResistance['ngung_khi_dan']).toBe(4);
  });

  it('should bypass resistance levels with perfect pill veins (đan văn)', () => {
    const player = new Player();
    player.realmId = 1;
    player.dailyPillStats = { day: 1, count: 0 };
    player.tuVi = 0;
    
    const inv = new Inventory(player);
    player.inventory = inv;
    
    // Consume 1 standard pill first to build 1 level of resistance
    inv.addItem('ngung_khi_dan', 1);
    inv.useItem('ngung_khi_dan', 1);
    expect(player.pillResistance['ngung_khi_dan']).toBe(1);
    
    // Next pill would normally get 70% effectiveness
    // But let's use a Cực Phẩm pill (danVeins: 6 -> bypasses 1 level of resistance back to 100%)
    inv.addItem('ngung_khi_dan', 1, { danVeins: 6 });
    player.tuVi = 0; // reset to check exact exp added
    inv.useItem('ngung_khi_dan', 1);
    
    expect(player.tuVi).toBe(500); // 100% gain!
  });

  it('should apply 50% effectiveness decay per tier difference (realm penalty)', () => {
    const player = new Player();
    player.realmId = 14; // Trúc Cơ Tầng 1 (Tier 2 player)
    player.dailyPillStats = { day: 1, count: 0 };
    player.tuVi = 0;
    
    const inv = new Inventory(player);
    player.inventory = inv;
    
    // Ngưng Khí Đan is a Tier 1 pill. Tier difference = 1, so 50% decay (250 exp)
    inv.addItem('ngung_khi_dan', 1);
    inv.useItem('ngung_khi_dan', 1);
    expect(player.tuVi).toBe(250);
  });

  it('should accumulate danPoison based on pill quality minus danVeins', () => {
    const player = new Player();
    player.realmId = 1;
    player.dailyPillStats = { day: 1, count: 0 };
    
    const inv = new Inventory(player);
    player.inventory = inv;
    
    // Add standard pill (base poison: 15)
    inv.addItem('ngung_khi_dan', 1);
    inv.useItem('ngung_khi_dan', 1);
    expect(player.danPoison).toBe(15);
    
    // Add high quality pill with Hoàn Mỹ veins (danVeins: 9 -> 0 toxicity)
    inv.addItem('ngung_khi_dan', 1, { danVeins: 9 });
    inv.useItem('ngung_khi_dan', 1);
    expect(player.danPoison).toBe(15); // Stays at 15
  });

  it('should decay danPoison passively and accelerate 10x in seclusion', () => {
    const player = new Player();
    player.danPoison = 50;
    
    // Normal update tick (10 seconds) -> decays by 0.005 * delta
    player.update(10);
    expect(player.danPoison).toBe(50 - 0.005 * 10);
    
    // Seclusion update tick (10 seconds) -> decays by 0.05 * delta
    player.isSecluded = true;
    player.update(10);
    expect(player.danPoison).toBe(50 - 0.005 * 10 - 0.05 * 10);
  });
});
