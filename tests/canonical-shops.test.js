import { describe, it, expect } from 'vitest';
import { SHOPS } from '../src/configs/shop-data.js';
import { WORLDS, getLocationById, findWorldIdByLocId } from '../src/configs/map-data.js';

describe('Canonical Shops and Locations Integration', () => {
  it('should have all 4 canonical shops registered in SHOPS', () => {
    expect(SHOPS['thai_nam_tieu_hoi']).toBeDefined();
    expect(SHOPS['te_van_cac']).toBeDefined();
    expect(SHOPS['luc_lien_dien']).toBeDefined();
    expect(SHOPS['hach_lien_thuong_minh']).toBeDefined();

    expect(SHOPS['thai_nam_tieu_hoi'].name).toBe('Thái Nam Tiểu Hội - Tán Tu Họp Chợ');
    expect(SHOPS['te_van_cac'].name).toBe('Tề Vân Các - Trận Pháp Các');
    expect(SHOPS['luc_lien_dien'].name).toBe('Lục Liên Điện - Yêu Thú Thương Hội');
    expect(SHOPS['hach_lien_thuong_minh'].name).toBe('Hách Liên Thương Minh - Siêu Cấp Thương Hội');
  });

  it('should have all 4 locations defined as shops in WORLDS', () => {
    const locs = [
      { id: 'thai_nam_tieu_hoi', world: 'nhan_gioi' },
      { id: 'te_van_cac', world: 'nhan_gioi' },
      { id: 'luc_lien_dien', world: 'nhan_gioi' },
      { id: 'hach_lien_thuong_minh', world: 'linh_gioi' }
    ];

    locs.forEach(({ id, world }) => {
      const worldId = findWorldIdByLocId(id);
      expect(worldId).toBe(world);

      const loc = getLocationById(worldId, id);
      expect(loc).toBeDefined();
      expect(loc.type).toBe('shop');
      expect(loc.shopId).toBe(id);
    });
  });

  it('should verify that Te Van Cac belongs to Nguyen Vu Quoc subregion', () => {
    const loc = getLocationById('nhan_gioi', 'te_van_cac');
    expect(loc).toBeDefined();
    expect(loc.subRegionId).toBe('nguyen_vu_quoc');
    expect(loc.subRegionName).toBe('Nguyên Vũ Quốc');
  });

  it('should verify shop inventory has specific items matching lore', () => {
    // Thai Nam should sell basic items
    const thaiNamItems = SHOPS['thai_nam_tieu_hoi'].sections['dan_duoc'];
    expect(thaiNamItems.some(i => i.id === 'ngung_khi_dan')).toBe(true);

    // Te Van Cac should sell formation arrays
    const teVanCacFormations = SHOPS['te_van_cac'].sections['tran_phap'];
    expect(teVanCacFormations.some(i => i.id === 'tran_do_tu_linh')).toBe(true);

    // Luc Lien Dien should sell beast cores
    const lucLienDienItems = SHOPS['luc_lien_dien'].sections['nguyen_lieu'];
    expect(lucLienDienItems.some(i => i.id === 'ha_pham_yeu_dan')).toBe(true);

    // Hach Lien Thuong Minh should sell high-tier items like Chưởng Thiên Bình
    const hachLienItems = SHOPS['hach_lien_thuong_minh'].sections['phap_bao'];
    expect(hachLienItems.some(i => i.id === 'chuong_thien_binh')).toBe(true);
  });
});
