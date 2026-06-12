import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Player } from '../src/core/player.js';
import { state } from '../src/state.js';
import { Game } from '../src/game.js';

describe('Ascension System Tests', () => {
    let player;
    let mockUi;
    let mockTravel;
    let gameInstance;

    beforeEach(() => {
        mockUi = {
            alert: vi.fn(),
            toast: vi.fn(),
            switchScreen: vi.fn()
        };

        mockTravel = {
            startTravel: vi.fn().mockReturnValue(true)
        };

        state.ui = mockUi;
        state.systems = {
            travel: mockTravel
        };

        // Create player
        player = new Player({ realmId: 0 }); // Start as Mortal
        state.player = player;

        // Instantiate Game to call ascendToSpiritRealm
        gameInstance = new Game();
        window.game = gameInstance;
    });

    it('should block ascension if player is below Hóa Thần stage (realmId < 26)', () => {
        player.realmId = 25; // Nguyên Anh Viên Mãn
        gameInstance.ascendToSpiritRealm();

        expect(mockUi.alert).toHaveBeenCalledWith(
            expect.stringContaining("Cảnh giới chưa đủ để phi thăng Linh Giới"),
            "Giới Hạn Cảnh Giới"
        );
        expect(mockTravel.startTravel).not.toHaveBeenCalled();
    });

    it('should block ascension if player is Hóa Thần stage but lacks protective items', () => {
        player.realmId = 26; // Hóa Thần Sơ Kỳ
        gameInstance.ascendToSpiritRealm();

        expect(mockUi.alert).toHaveBeenCalledWith(
            expect.stringContaining("Để an toàn vượt qua, ngươi cần có [Thượng Cổ Truyền Tống Lệnh] hoặc tiêu hao [Phá Không Phù]"),
            "Thiếu Vật Phẩm Hộ Thân"
        );
        expect(mockTravel.startTravel).not.toHaveBeenCalled();
    });

    it('should successfully ascend and travel to Spirit Realm if player is Hóa Thần and has Phá Không Phù', () => {
        player.realmId = 26; // Hóa Thần Sơ Kỳ
        player.inventory.addItem('pha_khong_phu', 1);

        gameInstance.ascendToSpiritRealm();

        expect(player.discoveredWorlds.includes('linh_gioi')).toBe(true);
        expect(mockTravel.startTravel).toHaveBeenCalledWith('phi_thang_dai');
        expect(mockUi.alert).toHaveBeenCalledWith(
            expect.stringContaining("Ngươi bước vào vết nứt không gian"),
            "Bắt Đầu Phi Thăng"
        );
    });

    it('should successfully ascend and travel to Spirit Realm if player is Hóa Thần and has Thượng Cổ Truyền Tống Lệnh', () => {
        player.realmId = 27; // Hóa Thần Trung Kỳ
        player.inventory.addItem('thuong_co_truyen_tong_lenh', 1);

        gameInstance.ascendToSpiritRealm();

        expect(player.discoveredWorlds.includes('linh_gioi')).toBe(true);
        expect(mockTravel.startTravel).toHaveBeenCalledWith('phi_thang_dai');
        expect(mockUi.alert).toHaveBeenCalledWith(
            expect.stringContaining("Ngươi bước vào vết nứt không gian"),
            "Bắt Đầu Phi Thăng"
        );
    });

    describe('Ancient Teleportation Array Tests', () => {
        beforeEach(() => {
            mockTravel.teleport = vi.fn().mockReturnValue(true);
            player.inventory.addItem('ha_pham_linh_thach', 200);
        });

        it('should block teleportation if player lacks Thượng Cổ Truyền Tống Lệnh', () => {
            state.currentLocId = 'thuong_co_truyen_tong_tran_thien_nam';
            gameInstance.activateAncientTeleport();

            expect(mockUi.alert).toHaveBeenCalledWith(
                expect.stringContaining("Nếu không có [Thượng Cổ Truyền Tống Lệnh] để hộ thân"),
                "Thiếu Truyền Tống Lệnh"
            );
            expect(mockTravel.teleport).not.toHaveBeenCalled();
        });

        it('should block teleportation if player has token but lacks enough Linh Thạch (100 required)', () => {
            state.currentLocId = 'thuong_co_truyen_tong_tran_thien_nam';
            player.inventory.addItem('thuong_co_truyen_tong_lenh', 1);
            const item = player.inventory.allItems.find(i => i.id === 'ha_pham_linh_thach');
            if (item) item.quantity = 50;

            gameInstance.activateAncientTeleport();

            expect(mockUi.toast).toHaveBeenCalledWith(
                expect.stringContaining("Không đủ Linh Thạch để kích hoạt trận pháp"),
                "error"
            );
            expect(mockTravel.teleport).not.toHaveBeenCalled();
        });

        it('should successfully teleport from Thiên Nam to Loạn Tinh Hải and deduct 100 Linh Thạch', () => {
            state.currentLocId = 'thuong_co_truyen_tong_tran_thien_nam';
            player.inventory.addItem('thuong_co_truyen_tong_lenh', 1);
            const item = player.inventory.allItems.find(i => i.id === 'ha_pham_linh_thach');
            if (item) item.quantity = 150;

            gameInstance.activateAncientTeleport();

            expect(player.lingShi).toBe(50);
            expect(mockTravel.teleport).toHaveBeenCalledWith('thuong_co_truyen_tong_tran_loan_tinh_hai');
            expect(mockUi.alert).toHaveBeenCalledWith(
                expect.stringContaining("Linh thạch khảm vào các mắt trận sáng rực lên"),
                "Kích Hoạt Truyền Tống Trận"
            );
        });

        it('should successfully teleport from Loạn Tinh Hải to Thiên Nam and deduct 100 Linh Thạch', () => {
            state.currentLocId = 'thuong_co_truyen_tong_tran_loan_tinh_hai';
            player.inventory.addItem('thuong_co_truyen_tong_lenh', 1);
            const item = player.inventory.allItems.find(i => i.id === 'ha_pham_linh_thach');
            if (item) item.quantity = 100;

            gameInstance.activateAncientTeleport();

            expect(player.lingShi).toBe(0);
            expect(mockTravel.teleport).toHaveBeenCalledWith('thuong_co_truyen_tong_tran_thien_nam');
        });
    });

    describe('Talisman Usage Tests', () => {
        beforeEach(() => {
            mockTravel.teleport = vi.fn().mockReturnValue(true);
            state.currentLocId = 'thai_nam_coc';
            state.currentWorldId = 'nhan_gioi';
            mockUi.showTeleportSelection = vi.fn();
        });

        it('should allow using thuan_di_phu to teleport to a random location in the same region', () => {
            player.inventory.addItem('thuan_di_phu', 2);
            
            const success = player.inventory.useItem('thuan_di_phu', 1);

            expect(success).toBe(true);
            expect(player.inventory.hasItem('thuan_di_phu')).toBe(true); // 1 left
            expect(mockTravel.teleport).toHaveBeenCalled();
        });

        it('should trigger target selection when using dai_dich_chuyen_phu', () => {
            player.inventory.addItem('dai_dich_chuyen_phu', 1);

            const success = player.inventory.useItem('dai_dich_chuyen_phu', 1);

            expect(success).toBe(true);
            expect(mockUi.showTeleportSelection).toHaveBeenCalled();
        });
    });
});
