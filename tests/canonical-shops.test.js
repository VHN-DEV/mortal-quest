import { describe, it, expect } from 'vitest';
import { SHOPS } from '../src/configs/shop-data.js';
import { ITEMS } from '../src/configs/item-data.js';
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

  it('should have all 5 new canonical PNTT items defined in ITEMS', () => {
    expect(ITEMS['dien_dao_ngu_hanh_tran_ky']).toBeDefined();
    expect(ITEMS['kim_dien_hoan']).toBeDefined();
    expect(ITEMS['huyen_thien_tram_linh_kiem_manh_vo']).toBeDefined();
    expect(ITEMS['giao_long_lan']).toBeDefined();
    expect(ITEMS['kim_phe_trung_tinh_noan']).toBeDefined();

    expect(ITEMS['kim_dien_hoan'].isUnique).toBe(true);
    expect(ITEMS['huyen_thien_tram_linh_kiem_manh_vo'].quality.name).toBe('Huyền Thiên Chi Bảo');
    expect(ITEMS['kim_phe_trung_tinh_noan'].quality.name).toBe('Thông Thiên Linh Bảo');
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
    // Thai Nam should sell basic items and Than Hanh Phu
    const thaiNamItems = SHOPS['thai_nam_tieu_hoi'].sections['dan_duoc'];
    expect(thaiNamItems.some(i => i.id === 'ngung_khi_dan')).toBe(true);
    const thaiNamPhu = SHOPS['thai_nam_tieu_hoi'].sections['phu_luc'];
    expect(thaiNamPhu.some(i => i.id === 'than_hanh_phu')).toBe(true);

    // Te Van Cac should sell formation arrays including Dien Dao Ngu Hanh
    const teVanCacFormations = SHOPS['te_van_cac'].sections['tran_phap'];
    expect(teVanCacFormations.some(i => i.id === 'tran_do_tu_linh')).toBe(true);
    expect(teVanCacFormations.some(i => i.id === 'dien_dao_ngu_hanh_tran_ky')).toBe(true);

    // Luc Lien Dien should sell beast cores, Giao Long scales, Kim Phe Trung and Kim Dien Hoan
    const lucLienDienItems = SHOPS['luc_lien_dien'].sections['nguyen_lieu'];
    expect(lucLienDienItems.some(i => i.id === 'ha_pham_yeu_dan')).toBe(true);
    expect(lucLienDienItems.some(i => i.id === 'giao_long_lan')).toBe(true);
    const lucLienDienEggs = SHOPS['luc_lien_dien'].sections['ky_trung'];
    expect(lucLienDienEggs.some(i => i.id === 'kim_phe_trung_tinh_noan')).toBe(true);
    const lucLienDienPb = SHOPS['luc_lien_dien'].sections['phap_bao'];
    expect(lucLienDienPb.some(i => i.id === 'kim_dien_hoan')).toBe(true);

    // Hach Lien Thuong Minh should sell high-tier items like Chưởng Thiên Bình and Huyen Thien mảnh vỡ, Cửu Khúc Linh Sâm
    const hachLienItems = SHOPS['hach_lien_thuong_minh'].sections['phap_bao'];
    expect(hachLienItems.some(i => i.id === 'chuong_thien_binh')).toBe(true);
    const hachLienMaterials = SHOPS['hach_lien_thuong_minh'].sections['nguyen_lieu'];
    expect(hachLienMaterials.some(i => i.id === 'huyen_thien_tram_linh_kiem_manh_vo')).toBe(true);
    expect(hachLienMaterials.some(i => i.id === 'thien_nien_cuu_khuc_linh_sam')).toBe(true);
  });
});
