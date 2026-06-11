import { describe, it, expect, beforeEach } from 'vitest';
import { Player } from '../src/core/player.js';
import { BeastSystem } from '../src/systems/beast-system.js';
import { BEASTS } from '../src/configs/beast-data.js';

describe('Beast Rearing System Unit Tests', () => {
    let player;
    let beastSystem;
    let mockUi;

    beforeEach(() => {
        player = new Player({
            name: 'Linh Thú Test Sư',
            gender: 'Nam',
            realmId: 1
        });
        
        mockUi = {
            toast: () => {},
            screenShake: () => {}
        };
        
        beastSystem = new BeastSystem(player, mockUi);
        player.addLingShi(10000);
        player.hp = 1000;
        player.maxHp = 1000;
    });

    it('should initialize with empty incubation slots', () => {
        expect(player.hatchingBeasts).toBeDefined();
        expect(player.hatchingBeasts.length).toBe(3);
        expect(player.hatchingBeasts[0]).toBeNull();
    });

    it('should start hatching when egg is available', () => {
        player.inventory.addItem('thanh_van_hac_linh_noan', 2);
        
        const res = beastSystem.startHatching('thanh_van_hac_linh_noan', 0);
        expect(res.success).toBe(true);
        expect(player.hatchingBeasts[0]).not.toBeNull();
        expect(player.hatchingBeasts[0].status).toBe('hatching');
        expect(player.hatchingBeasts[0].beastId).toBe('thanh_van_hac');
        expect(player.inventory.getItemQuantity('thanh_van_hac_linh_noan')).toBe(1);
    });

    it('should allow speed up using Spirit Stones or Han Ngoc Tuy', () => {
        player.inventory.addItem('thanh_van_hac_linh_noan', 2);
        
        // 1. Spirit Stone speedup on Slot 0
        beastSystem.startHatching('thanh_van_hac_linh_noan', 0);
        const stoneRes = beastSystem.speedUpHatching(0, 'spirit_stone');
        expect(stoneRes.success).toBe(true);
        expect(player.lingShi).toBe(9900);
        
        // 2. Han Ngoc Tuy speedup on Slot 1 (Instant completed)
        beastSystem.startHatching('thanh_van_hac_linh_noan', 1);
        player.inventory.addItem('han_ngoc_tuy', 1);
        const tuyRes = beastSystem.speedUpHatching(1, 'spirit_dich');
        expect(tuyRes.success).toBe(true);
        expect(player.hatchingBeasts[1].status).toBe('completed');
        expect(player.hatchingBeasts[1].timeLeft).toBe(0);
    });

    it('should support Blood Contract (HP debuff) and Soul Contract (requires Divine Sense)', () => {
        player.inventory.addItem('thanh_van_hac_linh_noan', 1);
        player.inventory.addItem('han_ngoc_tuy', 1);
        beastSystem.startHatching('thanh_van_hac_linh_noan', 0);
        beastSystem.speedUpHatching(0, 'spirit_dich');
        
        // Try Soul Contract (should fail as divineSense starts low, e.g. 0)
        player.divineSense = 5;
        let claimRes = beastSystem.claimHatchedBeast(0, 'soul');
        expect(claimRes.success).toBe(false);
        
        // Upgrade divineSense and retry Soul Contract
        player.divineSense = 15;
        claimRes = beastSystem.claimHatchedBeast(0, 'soul');
        expect(claimRes.success).toBe(true);
        expect(player.beasts.length).toBe(1);
        expect(player.beasts[0].contractType).toBe('soul');
        expect(player.hatchingBeasts[0]).toBeNull();

        // Test Blood Contract
        player.inventory.addItem('thanh_van_hac_linh_noan', 1);
        player.inventory.addItem('han_ngoc_tuy', 1);
        beastSystem.startHatching('thanh_van_hac_linh_noan', 1);
        beastSystem.speedUpHatching(1, 'spirit_dich');

        const initialHp = player.hp;
        const claimBloodRes = beastSystem.claimHatchedBeast(1, 'blood');
        expect(claimBloodRes.success).toBe(true);
        expect(player.hp).toBeLessThan(initialHp); // HP should be reduced by 15%
        expect(player.bloodContractDebuffUntil).toBeGreaterThan(Date.now());
    });

    it('should support advanced feeding (metals for insects)', () => {
        player.inventory.addItem('ken_kim_tam', 1);
        player.inventory.addItem('han_ngoc_tuy', 1);
        beastSystem.startHatching('ken_kim_tam', 0);
        beastSystem.speedUpHatching(0, 'spirit_dich');
        player.divineSense = 20;
        const beast = beastSystem.claimHatchedBeast(0, 'soul').beast;
        
        // Feed standard beast food
        player.inventory.addItem('linh_thu_dan', 2);
        const feed1 = beastSystem.feed(beast.uniqueId, 'linh_thu_dan');
        expect(feed1.success).toBe(true);
        // expRequired is 100. feed gain is 100. Should cause a level up from 1 to 2
        expect(beast.level).toBe(2);
        expect(beast.exp).toBe(0);

        // Feed metal (since it is a Kim Tam, an insect, it accepts metals)
        player.inventory.addItem('tinh_kim', 1);
        const feedMetal = beastSystem.feed(beast.uniqueId, 'tinh_kim');
        expect(feedMetal.success).toBe(true);
        expect(beast.exp).toBeGreaterThan(0);
    });

    it('should support insect cannibalism with level/exp calculation and mutation chances', () => {
        // Create 2 insects
        const insect1 = {
            id: 'phe_linh_trung',
            uniqueId: 'ins1',
            name: 'Phệ Linh Trùng Alpha',
            level: 1,
            exp: 0,
            loyalty: 50,
            bloodline: 'PHAM',
            stats: { hp: 50, atk: 5, def: 2, spd: 15 },
            contractType: 'soul',
            status: 'normal'
        };
        const insect2 = {
            id: 'phe_linh_trung',
            uniqueId: 'ins2',
            name: 'Phệ Linh Trùng Beta',
            level: 3,
            exp: 50,
            loyalty: 50,
            bloodline: 'PHAM',
            stats: { hp: 50, atk: 5, def: 2, spd: 15 },
            contractType: 'soul',
            status: 'normal'
        };

        player.beasts = [insect1, insect2];
        const res = beastSystem.feedBeastWithBeast('ins1', 'ins2');
        expect(res.success).toBe(true);
        expect(player.beasts.length).toBe(1);
        expect(player.beasts[0].uniqueId).toBe('ins1');
        expect(player.beasts[0].exp).toBeGreaterThan(0);
    });

    it('should trigger Yêu Kiếp Celestial Tribulation at level 50+ evolution and support helper armor', () => {
        const highLvlInsect = {
            id: 'phe_kim_trung',
            uniqueId: 'pk1',
            name: 'Phệ Kim Trùng Cổ',
            level: 50,
            exp: 0,
            loyalty: 90,
            bloodline: 'THIEN',
            stats: { hp: 500, atk: 150, def: 200, spd: 60 },
            contractType: 'soul',
            status: 'normal'
        };

        player.beasts = [highLvlInsect];
        
        // Evolve without materials should fail
        let evoRes = beastSystem.evolve('pk1');
        expect(evoRes.success).toBe(false);

        // Add materials
        player.inventory.addItem('tinh_kim', 100);
        
        // Evolve with tribulation helpers
        player.inventory.addItem('long_lan_giap', 1);
        player.inventory.addItem('han_ngoc_tuy', 1);
        player.addLingShi(10000);

        evoRes = beastSystem.evolve('pk1', {
            useLingshi: true,
            useArmor: 'long_lan_giap',
            useHanNgocTuy: true
        });

        // Tỷ lệ thành công = 40% (base) + 20% (lingshi) + 30% (long_lan_giap) + 15% (han_ngoc_tuy) = 105% (capped at 95%)
        // Because of the random nature, it can fail 5% of the time, but mostly it will succeed.
        // Let's verify the result status
        if (evoRes.success) {
            expect(player.beasts[0].id).toBe('phe_kim_trung_vuong');
            expect(player.beasts[0].name).toBe('Phệ Kim Trùng Vương');
        } else {
            expect(player.beasts[0].status).toBe('injured');
            expect(evoRes.injured).toBe(true);
        }
    });
});
