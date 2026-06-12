import { describe, it, expect, beforeEach } from 'vitest';
import { Player } from '../src/core/player.js';
import { FormationSystem } from '../src/systems/formation-system.js';
import { TimeSystem } from '../src/systems/time-system.js';
import { CombatEngine } from '../src/core/combat-engine.js';
import { state } from '../src/state.js';

describe('Formation Master (Trận Pháp Sư) Unit Tests', () => {
    let player;
    let formationSystem;
    let timeSystem;
    let mockUi;

    beforeEach(() => {
        player = new Player({
            name: 'Hàn Lập',
            gender: 'Nam',
            realmId: 1
        });
        
        mockUi = {
            toast: () => {},
            screenShake: () => {}
        };
        
        // Mock global game object for compatibility
        window.game = {
            state: {
                ui: {
                    promptOptions: async (title, options, desc) => {
                        // Return first available option by default
                        return options[0]?.value;
                    }
                }
            },
            systems: {
                formation: null
            }
        };

        formationSystem = new FormationSystem(player, mockUi);
        window.game.systems.formation = formationSystem;

        player.activeFormations = [];
        player.knownFormations = [];
        player.formationSlots = 2;
        player.formationLevel = 1;
        player.stamina = 100;
        player.mana = 100;
        player.hp = 1000;
        player.maxHp = 1000;
        player.atk = 100;
        player.def = 100;
        player.maxMana = 200;

        player.addLingShi(1000);

        // Assign to imported state singleton
        state.systems.formation = formationSystem;
        state.systems.mining = null;
        state.player = player;

        timeSystem = new TimeSystem(player);
    });

    it('should normalize formation IDs correctly', () => {
        expect(formationSystem._normalizeId('tran_do_tu_linh')).toBe('tran_do_tu_linh_tran');
        expect(formationSystem._normalizeId('dien_dao_ngu_hanh')).toBe('dien_dao_ngu_hanh_tran_ky');
    });

    it('should activate and start setup duration', () => {
        player.knownFormations.push('tran_do_tu_linh_tran');
        const res = formationSystem.activateFormation('tran_do_tu_linh_tran');
        expect(res.success).toBe(true);
        expect(player.activeFormations.length).toBe(1);
        expect(player.activeFormations[0].setupTimeRemaining).toBe(10);
    });

    it('should consume Lingshi and complete setup over time', () => {
        player.knownFormations.push('tran_do_tu_linh_tran');
        formationSystem.activateFormation('tran_do_tu_linh_tran');

        // Initial setup time
        expect(player.activeFormations[0].setupTimeRemaining).toBe(10);

        // Advance 5 minutes
        timeSystem.advanceTime(5);
        expect(player.activeFormations[0].setupTimeRemaining).toBe(5);

        // Advance another 5 minutes (completes setup)
        timeSystem.advanceTime(5);
        expect(player.activeFormations[0].setupTimeRemaining).toBe(0);

        // Verify Lingshi consumption (Tụ Linh Trận costs 1 Lingshi per minute -> 10 Lingshi consumed)
        expect(player.lingShi).toBe(990);
    });

    it('should clean up formation when out of Lingshi', () => {
        player.knownFormations.push('tran_do_tu_linh_tran');
        formationSystem.activateFormation('tran_do_tu_linh_tran');
        
        // Remove player lingshi
        player.spendLingShi(player.lingShi);

        // Advance time -> should collapse
        timeSystem.advanceTime(1);
        expect(player.activeFormations.length).toBe(0);
    });

    it('should execute setup countdown and activate periodic effects in CombatEngine', async () => {
        player.knownFormations.push('tran_do_tu_linh_tran');
        
        const enemy = { name: 'Thạch Đầu Nhân', hp: 500, maxHp: 500, atk: 10, def: 10, spd: 10, buffs: [] };
        const combat = new CombatEngine(player, enemy, () => {}, () => {});
        
        // Deploy formation in combat
        player.unlockedProfessions = ['formation'];
        await combat.playerActivateFormation();

        // 1 turn has elapsed because activation ends player turn
        expect(player.activeFormations.length).toBe(1);
        expect(player.activeFormations[0].setupTimeRemaining).toBe(9);

        // Simulate 9 turns to complete setup (9 turns total)
        for (let i = 0; i < 9; i++) {
            combat.nextTurn();
        }

        // Setup should be complete
        expect(player.activeFormations[0].setupTimeRemaining).toBe(0);
    });
});
