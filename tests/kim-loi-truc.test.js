import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Inventory } from '../src/core/inventory.js';
import { GardenSystem } from '../src/systems/garden-system.js';
import { SmithingSystem } from '../src/systems/smithing-system.js';
import { state } from '../src/state.js';
import { SEEDS } from '../src/configs/garden-data.js';
import { SMITHING_RECIPES } from '../src/configs/smithing-data.js';

describe('Kim Lôi Trúc and Thanh Trúc Phong Vân Kiếm system', () => {
    let player;
    let garden;
    let smithing;

    beforeEach(() => {
        // Mock state & global window game object
        state.ui = {
            toast: vi.fn(),
            alert: vi.fn()
        };

        state.systems = {
            mission: {
                onAction: vi.fn()
            }
        };

        player = {
            gardenPlots: [
                { grade: 'PHAM', attribute: 'NORMAL', seedId: null, age: 0, status: 'empty' },
                { grade: 'PHAM', attribute: 'LOI', seedId: null, age: 0, status: 'empty' }
            ],
            inventory: new Inventory(null),
            knownSmithingRecipes: [],
            smithingLevel: 4,
            smithingTool: 'luyen_khi_dai',
            currentFlame: 'linh_hoa',
            soulRealmId: 1,
            stamina: 500,
            mana: 500,
            lingShi: 100000,
            hp: 1000,
            spendLingShi(cost) {
                if (this.lingShi >= cost) {
                    this.lingShi -= cost;
                    return true;
                }
                return false;
            },
            addSmithingExp(exp) {
                return false;
            }
        };

        player.inventory.player = player;

        garden = new GardenSystem(player, state.ui);
        smithing = new SmithingSystem(player, state.ui);

        window.game = {
            receiveItem: vi.fn((itemId, quantity, metadata) => {
                player.inventory.addItem(itemId, quantity, metadata);
            }),
            refreshUI: vi.fn()
        };
    });

    it('should plant Kim Lôi Trúc seed successfully', () => {
        player.inventory.addItem('linh_chung_kim_loi_truc', 1);
        expect(player.inventory.hasItem('linh_chung_kim_loi_truc', 1)).toBe(true);

        const res = garden.plant(0, 'linh_chung_kim_loi_truc');
        expect(res.success).toBe(true);
        expect(player.gardenPlots[0].status).toBe('growing');
        expect(player.gardenPlots[0].seedId).toBe('linh_chung_kim_loi_truc');
        expect(player.inventory.hasItem('linh_chung_kim_loi_truc', 1)).toBe(false);
    });

    it('should accelerate growth using Spiritual Liquid', () => {
        player.inventory.addItem('linh_chung_kim_loi_truc', 1);
        garden.plant(0, 'linh_chung_kim_loi_truc');

        player.inventory.addItem('linh_dich_chuong_thien_binh', 1);
        expect(player.inventory.hasItem('linh_dich_chuong_thien_binh', 1)).toBe(true);

        const res = garden.useSpiritualLiquid(0);
        expect(res.success).toBe(true);
        expect(player.gardenPlots[0].age).toBe(1000);
        expect(player.gardenPlots[0].stage).toBe('1000 năm');
        expect(player.inventory.hasItem('linh_dich_chuong_thien_binh', 1)).toBe(false);
    });

    it('should reach Vạn Năm milestone after multiple liquid uses and harvest with metadata', () => {
        player.inventory.addItem('linh_chung_kim_loi_truc', 1);
        garden.plant(0, 'linh_chung_kim_loi_truc');

        // Use 10 spiritual liquids to reach 10,000 years
        for (let i = 0; i < 10; i++) {
            player.inventory.addItem('linh_dich_chuong_thien_binh', 1);
            garden.useSpiritualLiquid(0);
        }

        expect(player.gardenPlots[0].age).toBe(10000);
        expect(player.gardenPlots[0].stage).toBe('Vạn năm');

        const harvestRes = garden.harvest(0);
        expect(harvestRes.success).toBe(true);
        expect(player.gardenPlots[0].status).toBe('empty');

        const harvestedBamboo = player.inventory.allItems.find(i => i.id === 'kim_loi_truc');
        expect(harvestedBamboo).toBeDefined();
        expect(harvestedBamboo.metadata.age).toBe(10000);
        expect(harvestedBamboo.metadata.stage).toBe('Vạn năm');
    });

    it('should fail to forge Thanh Trúc Phong Vân Kiếm without blueprint or level requirements', async () => {
        player.inventory.addItem('kim_loi_truc', 1, { age: 10000, stage: 'Vạn Năm' });
        
        // No blueprint learned
        let res = await smithing.forge('thanh_truc_phong_van_kiem');
        expect(res.success).toBe(false);
        expect(res.msg).toContain('chưa có bản vẽ');

        // Learn blueprint but low smithing level
        player.knownSmithingRecipes.push('thanh_truc_phong_van_kiem');
        player.smithingLevel = 3;
        res = await smithing.forge('thanh_truc_phong_van_kiem');
        expect(res.success).toBe(false);
        expect(res.msg).toContain('Cần cấp Luyện Khí Sư');
    });

    it('should fail to forge Thanh Trúc Phong Vân Kiếm if bamboo is under 10,000 years old', async () => {
        player.knownSmithingRecipes.push('thanh_truc_phong_van_kiem');
        player.inventory.addItem('kim_loi_truc', 1, { age: 5000, stage: 'Năm Trăm Năm' });

        const res = await smithing.forge('thanh_truc_phong_van_kiem');
        expect(res.success).toBe(false);
        expect(res.msg).toContain('Cần ít nhất 1 thân Kim Lôi Trúc đạt niên thọ Vạn Năm');
    });

    it('should successfully forge Thanh Trúc Phong Vân Kiếm and grant age bonuses', async () => {
        player.knownSmithingRecipes.push('thanh_truc_phong_van_kiem');
        // Add 12,500 years old bamboo
        player.inventory.addItem('kim_loi_truc', 1, { age: 12500, stage: 'Vạn Năm' });

        // Forge
        vi.spyMockRestore && vi.spyMockRestore();
        vi.spyOn(Math, 'random').mockReturnValue(0.1); // Force success and high quality

        const res = await smithing.forge('thanh_truc_phong_van_kiem');
        expect(res.success).toBe(true);

        const sword = player.inventory.allItems.find(i => i.id === 'thanh_truc_phong_van_kiem');
        expect(sword).toBeDefined();
        expect(sword.metadata.age).toBe(12500);
        // atkBonus = (12500 - 10000) / 100 = 25
        expect(sword.metadata.atkBonus).toBe(25);
        // thunderBonus = (12500 - 10000) / 50 = 50
        expect(sword.metadata.thunderBonus).toBe(50);
        
        // Bamboo should be consumed
        expect(player.inventory.hasItem('kim_loi_truc', 1)).toBe(false);
    });
});
