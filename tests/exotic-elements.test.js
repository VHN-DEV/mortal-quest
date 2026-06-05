import { describe, it, expect, beforeEach } from 'vitest';
import { Player } from '../src/core/player.js';
import { ShopSystem } from '../src/systems/shop-system.js';
import { ITEMS, getItemById } from '../src/configs/item-data.js';
import { TECHNIQUES } from '../src/configs/technique-data.js';
import { SHOPS } from '../src/configs/shop-data.js';
import { ITEM_TYPES } from '../src/configs/item-classification.js';

describe('Exotic Flames & Lightnings Integration Tests', () => {
  let player;
  let shopSystem;

  beforeEach(() => {
    player = new Player();
    player.vipLevel = 5; // bypass VIP restrictions
    player.addLingShi(100000000); // give enough currency
    shopSystem = new ShopSystem(player);
  });

  const exoticFlames = [
    'da_xa_co_de', 'hu_vo_thon_viem', 'tinh_lien_yeu_hoa', 'kim_de_phan_thien_viem',
    'sinh_linh_chi_diem', 'bat_hoang_pha_diet_diem', 'cuu_u_kim_to_hoa', 'hong_lien_nghiep_hoa',
    'tam_thien_diem_thuong_hoa', 'cuu_u_phong_viem', 'cot_loi_linh_hoa', 'cuu_long_loi_cuong_hoa',
    'quy_linh_dia_hoa', 'van_lac_tam_viem', 'hai_tam_diem', 'hoa_van_thuy_viem',
    'phan_thien_liet_diem', 'phong_loi_no_diem', 'thanh_lien_dia_tam_hoa', 'long_phuong_diem',
    'luc_dao_luan_hoi_diem', 'van_thu_linh_hoa', 'huyen_hoang_viem'
  ];

  const exoticLightnings = [
    'hon_don_tu_tieu', 'cuu_tiao_diet_the', 'thai_hu_hu_khong', 'dai_nhat_kim_o',
    'huyen_am_cuu_u', 'thanh_min_at_moc', 'bac_minh_han_sat', 'tu_cuc_ma_diet',
    'thien_cuong_chinh_phap', 'xich_viem_bao_loi'
  ];

  it('should have all 23 exotic flames registered in item database', () => {
    exoticFlames.forEach(id => {
      const item = getItemById(id);
      expect(item, `Flame: ${id} should be registered`).toBeDefined();
      expect(item.id).toBe(id);
      expect(item.type).toBe(ITEM_TYPES.DI_HOA);
      expect(item.effect).toBeDefined();
      expect(item.effect.type).toBe('refine_flame');
      expect(item.effect.value).toBe(id);
    });
  });

  it('should have all 10 exotic lightnings registered in item database', () => {
    exoticLightnings.forEach(id => {
      const item = getItemById(id);
      expect(item, `Lightning: ${id} should be registered`).toBeDefined();
      expect(item.id).toBe(id);
      expect(item.type).toBe(ITEM_TYPES.DI_LOI);
      expect(item.effect).toBeDefined();
      expect(item.effect.type).toBe('refine_lightning');
      expect(item.effect.value).toBe(id);
    });
  });

  it('should have new techniques registered in technique-data.js', () => {
    expect(TECHNIQUES['phan_quyet']).toBeDefined();
    expect(TECHNIQUES['phan_quyet'].name).toBe('Phần Quyết');
    
    expect(TECHNIQUES['cuu_thien_van_loi_quyet']).toBeDefined();
    expect(TECHNIQUES['cuu_thien_van_loi_quyet'].name).toBe('Cửu Thiên Vạn Lôi Quyết');
  });

  it('should have new weapons, cauldron, and technique books registered as items', () => {
    expect(getItemById('phan_thien_dinh')).toBeDefined();
    expect(getItemById('hon_don_loi_thap')).toBeDefined();
    expect(getItemById('phan_quyet_cong_phap')).toBeDefined();
    expect(getItemById('cuu_thien_van_loi_quyet_cong_phap')).toBeDefined();
  });

  it('should display these items in shop listings', () => {
    const shop = SHOPS['van_bao_cac'];
    expect(shop).toBeDefined();

    // Check cauldron
    const shopDanLu = shop.sections.luyen_dan.map(i => i.id);
    expect(shopDanLu).toContain('phan_thien_dinh');

    // Check pagoda weapon
    const shopPhapBao = shop.sections.phap_bao.map(i => i.id);
    expect(shopPhapBao).toContain('hon_don_loi_thap');

    // Check technique books
    const shopCongPhap = shop.sections.cong_phap.map(i => i.id);
    expect(shopCongPhap).toContain('phan_quyet_cong_phap');
    expect(shopCongPhap).toContain('cuu_thien_van_loi_quyet_cong_phap');

    // Check exotic flames and lightnings in nguyen_lieu section
    const shopNguyenLieu = shop.sections.nguyen_lieu.map(i => i.id);
    exoticFlames.forEach(id => {
      expect(shopNguyenLieu).toContain(id);
    });
    exoticLightnings.forEach(id => {
      expect(shopNguyenLieu).toContain(id);
    });
  });

  it('should allow player to purchase and use/refine exotic flames', () => {
    const testFlame = 'hu_vo_thon_viem';
    shopSystem.currentShopId = 'van_bao_cac';

    // Purchase
    const buyRes = shopSystem.buyItem(testFlame, 1);
    expect(buyRes.success).toBe(true);
    expect(player.inventory.hasItem(testFlame, 1)).toBe(true);

    // Use / Refine
    expect(player.ownedFlames.includes(testFlame)).toBe(false);
    const useRes = player.inventory.useItem(testFlame, 1);
    expect(useRes).toBe(true);
    expect(player.ownedFlames.includes(testFlame)).toBe(true);
    expect(player.currentFlame).toBe(testFlame);
    expect(player.inventory.hasItem(testFlame, 1)).toBe(false);
  });

  it('should allow player to purchase and use/refine exotic lightnings', () => {
    const testLightning = 'hon_don_tu_tieu';
    shopSystem.currentShopId = 'van_bao_cac';

    // Purchase
    const buyRes = shopSystem.buyItem(testLightning, 1);
    expect(buyRes.success).toBe(true);
    expect(player.inventory.hasItem(testLightning, 1)).toBe(true);

    // Use / Refine
    expect(player.ownedLightnings.includes(testLightning)).toBe(false);
    const useRes = player.inventory.useItem(testLightning, 1);
    expect(useRes).toBe(true);
    expect(player.ownedLightnings.includes(testLightning)).toBe(true);
    expect(player.currentLightning).toBe(testLightning);
    expect(player.inventory.hasItem(testLightning, 1)).toBe(false);
  });
});
