import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Player } from '../src/core/player.js';
import { ShopSystem } from '../src/systems/shop-system.js';
import { getItemById } from '../src/configs/item-data.js';

describe('Unique / Relic Items System', () => {
  let player;
  let shopSystem;

  beforeEach(() => {
    player = new Player();
    // Initialize properties just in case
    player.vipLevel = 5; // to bypass any VIP constraints
    player.addLingShi(100000000); // unlimited lingshi
    shopSystem = new ShopSystem(player);
  });

  it('should identify legendary items as unique', () => {
    const chuongThienBinh = getItemById('chuong_thien_binh');
    const huThienDinh = getItemById('hu_thien_dinh');
    const batLinhXich = getItemById('bat_linh_xich');
    const nguyenHopNguCucSon = getItemById('nguyen_hop_ngu_cuc_son');
    
    expect(chuongThienBinh.isUnique).toBe(true);
    expect(huThienDinh.isUnique).toBe(true);
    expect(batLinhXich.isUnique).toBe(true);
    expect(nguyenHopNguCucSon.isUnique).toBe(true);
  });

  it('should report correct possession status', () => {
    expect(player.hasItemInPossession('hu_thien_dinh')).toBe(false);
    
    player.inventory.addItem('hu_thien_dinh', 1);
    expect(player.hasItemInPossession('hu_thien_dinh')).toBe(true);
  });

  it('should filter out unique items already in possession from shop catalog', () => {
    shopSystem.currentShopId = 'van_bao_cac';
    
    // hu_thien_dinh is in the shop catalog by default
    const inventoryBefore = shopSystem.getShopInventory();
    const hasCauldronBefore = inventoryBefore.some(i => i.id === 'hu_thien_dinh');
    expect(hasCauldronBefore).toBe(true);

    // Give player the item
    player.inventory.addItem('hu_thien_dinh', 1);
    
    // It should now be hidden from the shop catalog
    const inventoryAfter = shopSystem.getShopInventory();
    const hasCauldronAfter = inventoryAfter.some(i => i.id === 'hu_thien_dinh');
    expect(hasCauldronAfter).toBe(false);
  });

  it('should prevent buying duplicates of unique items', () => {
    shopSystem.currentShopId = 'van_bao_cac';

    // Purchase once
    const res1 = shopSystem.buyItem('hu_thien_dinh', 1);
    expect(res1.success).toBe(true);

    // Try to purchase again - should fail since it is now in possession
    const res2 = shopSystem.buyItem('hu_thien_dinh', 1);
    expect(res2.success).toBe(false);
    expect(res2.msg).toContain('chỉ có thể sở hữu một bản duy nhất');
  });
});
