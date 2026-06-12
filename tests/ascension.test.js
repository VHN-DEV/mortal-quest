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
});
