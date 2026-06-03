import { describe, it, expect } from 'vitest';
import { TOWER_LEVELS, TOWER_MASTERS, CORPSE_LEVELS, CRAFTING_QUALITIES, getQualitySortOrder, getQualityObject } from '../src/configs/game-enums.js';
import { getCorpseLevelInfo } from '../src/configs/corpse-data.js';

describe('Mortal Quest Crafting & Tower Registries', () => {
    it('should correctly define and freeze Tower Levels and Masters', () => {
        expect(TOWER_LEVELS.FLOOR_1).toBeDefined();
        expect(TOWER_LEVELS.FLOOR_1.name).toBe("Ngoại Tháp - Tầng 1");
        expect(TOWER_LEVELS.FLOOR_1.minAlchemyLevel).toBe(3);
        expect(Object.isFrozen(TOWER_LEVELS)).toBe(true);

        expect(TOWER_MASTERS.HUYEN_LINH_TU).toBeDefined();
        expect(TOWER_MASTERS.HUYEN_LINH_TU.name).toBe("Huyền Linh Tử");
        expect(Object.isFrozen(TOWER_MASTERS)).toBe(true);
    });

    it('should look up corpse level names from CORPSE_LEVELS registry', () => {
        const firstLevel = getCorpseLevelInfo(0);
        expect(firstLevel.name).toBe("Nhập Môn Thi Sư");

        const secondLevel = getCorpseLevelInfo(1);
        expect(secondLevel.name).toBe("Nhất Giai Thi Sư");

        const maxLevel = getCorpseLevelInfo(99);
        expect(maxLevel.name).toBe("Thần Giai Thi Sư");
    });

    it('should correctly sort and look up CRAFTING_QUALITIES', () => {
        expect(CRAFTING_QUALITIES.HA_PHAM.name).toBe("Hạ Phẩm");
        expect(CRAFTING_QUALITIES.TIEN_PHAM.name).toBe("Tiên Phẩm");

        // getQualitySortOrder tests
        expect(getQualitySortOrder('Hạ Phẩm')).toBe(2);
        expect(getQualitySortOrder('Trung Phẩm')).toBe(3);
        expect(getQualitySortOrder('Thượng Phẩm')).toBe(4);
        expect(getQualitySortOrder('Cực Phẩm')).toBe(5);
        expect(getQualitySortOrder('Hoàn Mỹ')).toBe(6);
        expect(getQualitySortOrder('Tiên Phẩm')).toBe(7);

        // Sorting comparison test simulation
        const orderHa = getQualitySortOrder(CRAFTING_QUALITIES.HA_PHAM);
        const orderTrung = getQualitySortOrder(CRAFTING_QUALITIES.TRUNG_PHAM);
        expect(orderTrung).toBeGreaterThan(orderHa);
    });

    it('should look up qualities via getQualityObject', () => {
        const obj1 = getQualityObject('Hạ Phẩm');
        expect(obj1).toBeDefined();
        expect(obj1.id).toBe('ha_pham');

        const obj2 = getQualityObject('Thiên Giai Thi Sư');
        expect(obj2).toBeNull(); // It is not a quality, it is a level name

        const obj3 = getQualityObject('Nhập Môn Thi Sư');
        expect(obj3).toBeDefined();
        expect(obj3.id).toBe('nhap_mon');
    });
});
