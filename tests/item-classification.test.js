import { describe, it, expect } from 'vitest';
import { classifyItem, ITEM_TYPES } from '../src/configs/item-classification.js';

describe('Mortal Quest Item Classification System', () => {
    it('should classify puppet items correctly', () => {
        const puppet = {
            id: 'thiet_giap_khoi_loi',
            name: 'Thiết Giáp Khôi Lỗi',
            type: ITEM_TYPES.KHOI_LOI
        };
        const result = classifyItem(puppet);
        expect(result.category).toBe('khoi_loi');
        expect(result.subcategory).toBe('linh_khoi');
    });

    it('should classify corpse items correctly', () => {
        const corpse = {
            id: 'thi_binh_so_cap',
            name: 'Thi Binh Sơ Cấp',
            type: ITEM_TYPES.THI_KHOI
        };
        const result = classifyItem(corpse);
        expect(result.category).toBe('khoi_loi');
        expect(result.subcategory).toBe('thi_khoi');
    });

    it('should classify alchemy recipes (Đan Phương) correctly', () => {
        const recipe = {
            id: 'dan_phuong_ngung_khi_dan',
            name: 'Đan Phương Ngưng Khí Đan',
            type: ITEM_TYPES.DAN_PHUONG
        };
        const result = classifyItem(recipe);
        expect(result.category).toBe('luyen_dan');
        expect(result.subcategory).toBe('dan_phuong');
    });

    it('should classify talisman items correctly', () => {
        const talisman = {
            id: 'hoa_cau_phu',
            name: 'Hỏa Cầu Phù',
            type: ITEM_TYPES.PHU_LUC
        };
        const result = classifyItem(talisman);
        expect(result.category).toBe('phu_luc');
        expect(result.subcategory).toBe('cong_kich');
    });

    it('should classify storage items (Túi Trữ Vật) correctly', () => {
        const storage = {
            id: 'tui_tru_vat_so_cap',
            name: 'Túi Trữ Vật Sơ Cấp',
            type: ITEM_TYPES.TUI_TRU_VAT
        };
        const result = classifyItem(storage);
        expect(result.category).toBe('ky_vat_di_bao');
        expect(result.subcategory).toBe('tui_tru_vat');
    });

    it('should classify services (Dịch Vụ) correctly', () => {
        const service = {
            id: 'ngo_dao_that',
            name: 'Ngộ Đạo Thất',
            type: ITEM_TYPES.DICH_VU
        };
        const result = classifyItem(service);
        expect(result.category).toBe('dich_vu');
        expect(result.subcategory).toBe('thue_phong');
    });

    it('should respect explicit overrides from categories array', () => {
        const item = {
            id: 'custom_item',
            name: 'Vật Phẩm Kỳ Lạ',
            categories: [
                { category: 'dac_biet', subcategory: 'tuy_chinh', subSubcategory: 'doc_nhat' }
            ]
        };
        const result = classifyItem(item);
        expect(result.category).toBe('dac_biet');
        expect(result.subcategory).toBe('tuy_chinh');
        expect(result.subSubcategory).toBe('doc_nhat');
    });
});
