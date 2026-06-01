import { describe, it, expect, vi, beforeEach } from 'vitest';
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

describe('Inventory class', () => {
  it('should initialize with a basic bag of 20 slots', () => {
    const mockPlayer = {};
    const inv = new Inventory(mockPlayer);
    
    expect(inv.bags.length).toBe(1);
    expect(inv.bags[0].name).toBe('Túi Vải');
    expect(inv.bags[0].slots).toBe(20);
    expect(inv.bags[0].items.length).toBe(0);
    expect(inv.totalSlots).toBe(20);
    expect(inv.isFull).toBe(false);
  });

  it('should add item and stack quantity if same metadata', () => {
    const inv = new Inventory({});
    
    const added1 = inv.addItem('ling_thach_ha', 5);
    expect(added1).toBe(true);
    expect(inv.allItems.length).toBe(1);
    expect(inv.getItemQuantity('ling_thach_ha')).toBe(5);
    
    const added2 = inv.addItem('ling_thach_ha', 10);
    expect(added2).toBe(true);
    expect(inv.allItems.length).toBe(1); // Stays at 1 stack
    expect(inv.getItemQuantity('ling_thach_ha')).toBe(15);
  });

  it('should NOT stack items if metadata is different', () => {
    const inv = new Inventory({});
    
    inv.addItem('thanh_hong_kiem', 1, { quality: 'Pháp Khí', level: 1 });
    inv.addItem('thanh_hong_kiem', 1, { quality: 'Linh Khí', level: 2 });
    
    expect(inv.allItems.length).toBe(2);
    expect(inv.allItems[0].metadata.quality).toBe('Pháp Khí');
    expect(inv.allItems[1].metadata.quality).toBe('Linh Khí');
  });

  it('should remove item and decrease quantity or remove stack entirely', () => {
    const inv = new Inventory({});
    inv.addItem('seed_linh_thao', 10);
    
    const removedSome = inv.removeItem('seed_linh_thao', 4);
    expect(removedSome).toBe(true);
    expect(inv.getItemQuantity('seed_linh_thao')).toBe(6);
    expect(inv.allItems.length).toBe(1);
    
    const removedAll = inv.removeItem('seed_linh_thao', 6);
    expect(removedAll).toBe(true);
    expect(inv.getItemQuantity('seed_linh_thao')).toBe(0);
    expect(inv.allItems.length).toBe(0);
  });

  it('should correctly report if bag is full', () => {
    const inv = new Inventory({});
    
    // Fill up all 20 slots of basic_bag
    for (let i = 0; i < 20; i++) {
      inv.addItem(`item_${i}`, 1);
    }
    
    expect(inv.allItems.length).toBe(20);
    expect(inv.isFull).toBe(true);
    
    // Adding 21st unique item should fail
    const added = inv.addItem('tich_coc_dan', 1);
    expect(added).toBe(false);
    expect(inv.getItemQuantity('tich_coc_dan')).toBe(0);
  });

  it('should support adding additional bags (expanding slots)', () => {
    const inv = new Inventory({});
    expect(inv.totalSlots).toBe(20);
    
    inv.addBag('Túi Càn Khôn', 30, 'bag_can_khon');
    expect(inv.bags.length).toBe(2);
    expect(inv.totalSlots).toBe(50);
    expect(inv.isFull).toBe(false);
  });

  it('should transfer items between bags', () => {
    const inv = new Inventory({});
    inv.addBag('Túi Phụ', 10, 'bag_phu');
    
    inv.addItem('co_dai', 5);
    
    // Transfer from Bag 0 (first bag) to Bag 1 (second bag)
    const result = inv.transferItem(0, 0, 1);
    expect(result.success).toBe(true);
    
    expect(inv.bags[0].items.length).toBe(0);
    expect(inv.bags[1].items.length).toBe(1);
    expect(inv.bags[1].items[0].id).toBe('co_dai');
    expect(inv.bags[1].items[0].quantity).toBe(5);
  });

  it('should sort items of the same type based on quality', () => {
    const inv = new Inventory({});
    
    inv.addItem('tich_coc_dan', 1);    // Phàm Khí
    inv.addItem('truc_co_dan', 1);    // Linh Khí
    inv.addItem('ngung_khi_dan', 1);   // Pháp Khí
    
    inv.sortItems();
    
    // Should sort descending by quality: Linh Khí -> Pháp Khí -> Phàm Khí
    expect(inv.bags[0].items[0].id).toBe('truc_co_dan');
    expect(inv.bags[0].items[1].id).toBe('ngung_khi_dan');
    expect(inv.bags[0].items[2].id).toBe('tich_coc_dan');
  });
});
