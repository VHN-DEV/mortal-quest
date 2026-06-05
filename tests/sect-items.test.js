import { describe, it, expect } from 'vitest';
import { SECT_GEAR } from '../src/core/enemy.js';
import { getItemById } from '../src/configs/item-data.js';

describe('Sect and Rogue Cultivator (Tán Tu) Gear Validation', () => {
  it('should verify that all items referenced in SECT_GEAR exist in the global registry', () => {
    Object.entries(SECT_GEAR).forEach(([sectId, gear]) => {
      if (gear.weapon) {
        const item = getItemById(gear.weapon.id);
        expect(item, `Weapon ID '${gear.weapon.id}' for sect '${sectId}' must exist in item registry`).toBeDefined();
        expect(item.id, `Weapon ID mismatch`).toBe(gear.weapon.id);
        expect(item.name, `Weapon name mismatch`).toBeDefined();
      }

      if (gear.armor) {
        const item = getItemById(gear.armor.id);
        expect(item, `Armor ID '${gear.armor.id}' for sect '${sectId}' must exist in item registry`).toBeDefined();
        expect(item.id, `Armor ID mismatch`).toBe(gear.armor.id);
        expect(item.name, `Armor name mismatch`).toBeDefined();
      }

      if (gear.artifact) {
        const item = getItemById(gear.artifact.id);
        expect(item, `Artifact ID '${gear.artifact.id}' for sect '${sectId}' must exist in item registry`).toBeDefined();
        expect(item.id, `Artifact ID mismatch`).toBe(gear.artifact.id);
        expect(item.name, `Artifact name mismatch`).toBeDefined();
      }
    });
  });

  it('should verify that all Tán Tu (Rogue Cultivator) gear items exist in the global registry', () => {
    const tanTuGearIds = [
      'linh_thiet_kiem',
      'thanh_phong_kiem',
      'hoa_van_dao',
      'thuy_nguyet_kiem',
      'bang_suong_cham',
      'linh_thu_bi_y',
      'kim_ty_phap_y',
      'huyen_thiet_giap',
      'bat_quai_dao_y',
      'kim_cuong_ho_phu',
      'linh_quang_thuan',
      'ho_tam_nguyet_khi',
      'huyen_loi_chau'
    ];

    tanTuGearIds.forEach(id => {
      const item = getItemById(id);
      expect(item, `Tán Tu gear ID '${id}' must exist in item registry`).toBeDefined();
      expect(item.id).toBe(id);
      expect(item.name).toBeDefined();
      expect(item.description).toBeDefined();
    });
  });
});
