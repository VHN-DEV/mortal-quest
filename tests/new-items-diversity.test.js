import { describe, it, expect, beforeEach } from 'vitest';
import { Player } from '../src/core/player.js';
import { ShopSystem } from '../src/systems/shop-system.js';
import { ITEMS, getItemById } from '../src/configs/item-data.js';
import { SEEDS } from '../src/configs/garden-data.js';
import { SHOPS } from '../src/configs/shop-data.js';

describe('New Items Diversity Integration Tests', () => {
  let player;
  let shopSystem;

  beforeEach(() => {
    player = new Player();
    player.vipLevel = 5; // bypass VIP restrictions
    player.addLingShi(10000000); // give enough currency
    shopSystem = new ShopSystem(player);
  });

  const expectedNewItemIds = [
    'ngan_tinh_thao',
    'linh_chung_ngan_tinh_thao',
    'cuu_u_linh_tuyet_lien',
    'linh_chung_cuu_u_linh_tuyet_lien',
    'thai_at_hoa_than_dan',
    'ho_menh_chan_nguyen_dan',
    'tu_cuc_ngo_dao_dan',
    'co_quan_phuc_nguyen_dan',
    'loi_dinh_than_binh',
    'ngu_hanh_ho_the_giap',
    'hu_vo_than_kinh',
    'cuu_loi_diet_the_phu',
    'thai_cuc_huyen_tran_do'
  ];

  it('should have all 13 new items registered in the database', () => {
    expectedNewItemIds.forEach(id => {
      const item = getItemById(id);
      expect(item, `Item with ID: ${id} should be registered`).toBeDefined();
      expect(item.id).toBe(id);
      expect(item.name).toBeTypeOf('string');
      expect(item.type).toBeTypeOf('string');
      expect(item.icon).toBeTypeOf('string');
      expect(item.quality).toBeTypeOf('object');
      expect(item.price).toBeTypeOf('number');
      expect(item.description).toBeTypeOf('string');
      expect(Array.isArray(item.categories)).toBe(true);
      expect(item.categories.length).toBeGreaterThan(0);
      expect(item.categories[0].category).toBeTypeOf('string');
    });
  });

  it('should register new seeds in the garden config', () => {
    const nganTinhThaoSeed = SEEDS.find(s => s.id === 'linh_chung_ngan_tinh_thao');
    expect(nganTinhThaoSeed).toBeDefined();
    expect(nganTinhThaoSeed.herbId).toBe('ngan_tinh_thao');
    expect(nganTinhThaoSeed.grade).toBe('LINH');

    const tuyetLienSeed = SEEDS.find(s => s.id === 'linh_chung_cuu_u_linh_tuyet_lien');
    expect(tuyetLienSeed).toBeDefined();
    expect(tuyetLienSeed.herbId).toBe('cuu_u_linh_tuyet_lien');
    expect(tuyetLienSeed.grade).toBe('HUYEN');
  });

  it('should list all new items in the van_bao_cac shop registry', () => {
    const shop = SHOPS['van_bao_cac'];
    expect(shop).toBeDefined();

    // Check dan_duoc
    const shopPills = shop.sections.dan_duoc.map(i => i.id);
    expect(shopPills).toContain('thai_at_hoa_than_dan');
    expect(shopPills).toContain('ho_menh_chan_nguyen_dan');
    expect(shopPills).toContain('tu_cuc_ngo_dao_dan');
    expect(shopPills).toContain('co_quan_phuc_nguyen_dan');

    // Check phap_bao
    const shopGears = shop.sections.phap_bao.map(i => i.id);
    expect(shopGears).toContain('loi_dinh_than_binh');
    expect(shopGears).toContain('ngu_hanh_ho_the_giap');
    expect(shopGears).toContain('hu_vo_than_kinh');

    // Check nguyen_lieu
    const shopMats = shop.sections.nguyen_lieu.map(i => i.id);
    expect(shopMats).toContain('ngan_tinh_thao');
    expect(shopMats).toContain('cuu_u_linh_tuyet_lien');

    // Check linh_dien
    const shopSeeds = shop.sections.linh_dien.map(i => i.id);
    expect(shopSeeds).toContain('linh_chung_ngan_tinh_thao');
    expect(shopSeeds).toContain('linh_chung_cuu_u_linh_tuyet_lien');

    // Check phu_luc
    const shopTalismans = shop.sections.phu_luc.map(i => i.id);
    expect(shopTalismans).toContain('cuu_loi_diet_the_phu');

    // Check tran_phap
    const shopFormations = shop.sections.tran_phap.map(i => i.id);
    expect(shopFormations).toContain('thai_cuc_huyen_tran_do');
  });

  it('should allow purchasing the new items through ShopSystem', () => {
    shopSystem.currentShopId = 'van_bao_cac';

    // Purchase a new pill
    const res = shopSystem.buyItem('ho_menh_chan_nguyen_dan', 1);
    expect(res.success).toBe(true);
    expect(player.inventory.hasItem('ho_menh_chan_nguyen_dan', 1)).toBe(true);

    // Purchase a new weapon
    const resWeapon = shopSystem.buyItem('loi_dinh_than_binh', 1);
    expect(resWeapon.success).toBe(true);
    expect(player.inventory.hasItem('loi_dinh_than_binh', 1)).toBe(true);
  });
});
