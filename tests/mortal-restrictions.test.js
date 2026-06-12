import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Player } from '../src/core/player.js';
import { state } from '../src/state.js';
import { CraftingController } from '../src/ui/controllers/CraftingController.js';
import { AlchemySystem } from '../src/systems/alchemy-system.js';
import { TalismanSystem } from '../src/systems/talisman-system.js';
import { SmithingSystem } from '../src/systems/smithing-system.js';
import { FormationSystem } from '../src/systems/formation-system.js';
import { BeastSystem } from '../src/systems/beast-system.js';
import { CorpseSystem } from '../src/systems/corpse-system.js';

describe('Mortal Bách Nghệ Restriction Tests', () => {
    let player;
    let mockUi;

    beforeEach(() => {
        mockUi = {
            toast: vi.fn(),
            switchScreen: vi.fn()
        };

        state.ui = mockUi;
        player = new Player({ realmId: 0 }); // Starting as a Phàm Nhân
        state.player = player;
    });

    it('should block mortals from reading Jade Slips', () => {
        player.inventory.addItem('linh_gioi_phi_thang_luc', 1);
        const result = player.inventory.useItem('linh_gioi_phi_thang_luc', 1);
        expect(result).toBe(false);
        expect(mockUi.toast).toHaveBeenCalledWith(
            expect.stringContaining("chưa khai mở Thần Thức"),
            "error"
        );
    });

    it('should block mortals from reading recipes', () => {
        player.inventory.addItem('dan_phuong_ngung_khi_dan', 1);
        const result = player.inventory.useItem('dan_phuong_ngung_khi_dan', 1);
        expect(result).toBe(false);
        expect(mockUi.toast).toHaveBeenCalledWith(
            expect.stringContaining("Chưa học công pháp tu luyện linh lực"),
            "error"
        );
    });

    it('should block mortals from reading nested profession manuals', () => {
        player.inventory.addItem('dan_dao_chan_giai', 1);
        const result = player.inventory.useItem('dan_dao_chan_giai', 1);
        expect(result).toBe(false);
        expect(mockUi.toast).toHaveBeenCalledWith(
            expect.stringContaining("Chưa học công pháp tu luyện linh lực"),
            "error"
        );
    });

    it('should block mortals from refining Strange Flames or Lightning', () => {
        player.inventory.addItem('hu_vo_thon_viem', 1);
        const result = player.inventory.useItem('hu_vo_thon_viem', 1);
        expect(result).toBe(false);
        expect(mockUi.toast).toHaveBeenCalledWith(
            expect.stringContaining("Phàm nhân nhục nhãn phàm thai"),
            "error"
        );
    });

    it('should block mortals from entering Bách Nghệ screen', () => {
        const controller = new CraftingController(null);
        controller.openCrafting('alchemy');
        expect(mockUi.toast).toHaveBeenCalledWith(
            expect.stringContaining("Ngươi vẫn là phàm nhân"),
            "error"
        );
    });

    it('should block mortals from crafting in AlchemySystem', async () => {
        const alchemy = new AlchemySystem(player, mockUi);
        const result = await alchemy.craft('ngung_khi_dan');
        expect(result.success).toBe(false);
        expect(result.msg).toContain("Cảnh giới phàm nhân chưa có linh lực");
    });

    it('should block mortals from drawing in TalismanSystem', async () => {
        const talisman = new TalismanSystem(player, mockUi);
        const result = await talisman.draw('phu_van_hoa_cau_phu');
        expect(result.success).toBe(false);
        expect(result.msg).toContain("Cảnh giới phàm nhân chưa có linh lực");
    });

    it('should block mortals from forging in SmithingSystem', async () => {
        const smithing = new SmithingSystem(player, mockUi);
        const result = await smithing.forge('ha_pham_phi_kiem');
        expect(result.success).toBe(false);
        expect(result.msg).toContain("Cảnh giới phàm nhân chưa có linh lực");
    });

    it('should block mortals from setting up formations', () => {
        const formation = new FormationSystem(player, mockUi);
        const result = formation.activateFormation('tran_do_tu_linh_tran');
        expect(result.success).toBe(false);
        expect(result.msg).toContain("Cảnh giới phàm nhân chưa có linh lực");
    });

    it('should block mortals from hatching beasts', () => {
        const beast = new BeastSystem(player, mockUi);
        const result = beast.startHatching('linh_thu_dan', 0);
        expect(result.success).toBe(false);
        expect(result.msg).toContain("Cảnh giới phàm nhân chưa có linh lực");
    });

    it('should block mortals from refining corpses', () => {
        const corpse = new CorpseSystem(player, mockUi);
        const result = corpse.refine('tieu_quy');
        expect(result.success).toBe(false);
        expect(result.msg).toContain("Cảnh giới phàm nhân chưa có linh lực");
    });

    it('should allow cultivators (realmId >= 1) to use items and access systems', async () => {
        player.realmId = 1; // Elevate to Luyện Khí Kỳ

        player.inventory.addItem('dan_phuong_ngung_khi_dan', 1);
        const result = player.inventory.useItem('dan_phuong_ngung_khi_dan', 1);
        expect(result).toBe(true);

        const controller = new CraftingController(null);
        player.unlockedProfessions.push('alchemy');
        controller.openCrafting('alchemy');
        expect(mockUi.toast).not.toHaveBeenCalledWith(
            expect.stringContaining("Ngươi vẫn là phàm nhân"),
            expect.anything()
        );
    });
});
