import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Game } from '../src/game.js';
import { state } from '../src/state.js';
import * as enemyModule from '../src/core/enemy.js';

vi.mock('../src/core/enemy.js', () => {
  return {
    EnemyGenerator: {
      generate: vi.fn().mockImplementation((dangerLevel) => {
        return {
          name: 'Bất Động Yêu Thú',
          realmId: dangerLevel,
          divineSense: global.testEnemySense || 50,
          inventory: [],
          calculateStats: vi.fn()
        };
      })
    }
  };
});

describe('Divine Sense, Concealment, and Escape Mechanics', () => {
  let gameInstance;

  beforeEach(() => {
    global.testEnemySense = 50;

    // Reset global state
    state.player = {
      divineSense: 50,
      stamina: 100,
      hp: 100,
      maxHp: 100,
      equippedAuxiliaryIds: [],
      mainTechniqueId: '',
      mainEscapeId: '',
      equippedSecretTechniqueIds: [],
      learnedSecretTechniques: [],
      gridExplorationState: {
        playerPos: { x: 1, y: 1 }
      },
      addTuVi: vi.fn(),
      addLingShi: vi.fn()
    };

    state.ui = {
      toggleOverlay: vi.fn(),
      toast: vi.fn(),
      switchScreen: vi.fn()
    };

    // Mock DOM elements
    const mockElement = {
      textContent: '',
      className: '',
      querySelector: vi.fn().mockReturnValue({ textContent: '' }),
      click: vi.fn()
    };

    global.document = {
      getElementById: vi.fn().mockReturnValue(mockElement),
      querySelector: vi.fn().mockReturnValue(mockElement)
    };

    gameInstance = new Game();
    gameInstance.startBattle = vi.fn();
    gameInstance.refreshUI = vi.fn();
  });

  it('should detect the player if they have no concealment and the enemy has higher divine sense', () => {
    state.player.divineSense = 40; // low divine sense
    global.testEnemySense = 60; // high divine sense of enemy

    gameInstance.handleCombatEncounter(1, 'some-loc', null, null, 'force_player', null, { x: 0, y: 0 });

    expect(gameInstance.pendingEncounter.isDetected).toBe(true);
    expect(gameInstance.pendingEncounter.detectionReason).toBe('no_concealment');
  });

  it('should NOT detect the player if they have a concealment technique equipped', () => {
    state.player.divineSense = 40;
    state.player.equippedAuxiliaryIds = ['liem_khi_quyet'];
    global.testEnemySense = 60;

    gameInstance.handleCombatEncounter(1, 'some-loc', null, null, 'force_player', null, { x: 0, y: 0 });

    expect(gameInstance.pendingEncounter.isDetected).toBe(false);
  });

  it('should pierce the player concealment if the enemy has overwhelmingly superior divine sense', () => {
    state.player.divineSense = 40;
    state.player.equippedAuxiliaryIds = ['liem_khi_quyet'];
    global.testEnemySense = 100; // enemy sense > player sense * 1.8 (40 * 1.8 = 72)

    gameInstance.handleCombatEncounter(1, 'some-loc', null, null, 'force_player', null, { x: 0, y: 0 });

    expect(gameInstance.pendingEncounter.isDetected).toBe(true);
    expect(gameInstance.pendingEncounter.detectionReason).toBe('pierced');
  });

  it('should succeed escape 100% with Loi Don Thuat costing stamina', () => {
    state.player.mainEscapeId = 'loi_don_thuat';
    state.player.stamina = 50;

    const enemy = enemyModule.EnemyGenerator.generate(5);
    gameInstance.pendingEncounter = {
      enemy,
      isDetected: true,
      prevPos: { x: 0, y: 0 },
      cell: { status: 'combat', resolved: false }
    };

    gameInstance.escapeAmbush();

    expect(state.player.stamina).toBe(30); // 50 - 20 = 30
    expect(state.player.gridExplorationState.playerPos).toEqual({ x: 0, y: 0 });
    expect(state.ui.toast).toHaveBeenCalledWith(
      expect.stringContaining('Lôi Độn Thuật thành công'),
      'success'
    );
  });

  it('should succeed escape 100% with Huyet Don Thuat costing hp and stamina', () => {
    state.player.learnedSecretTechniques = [{ id: 'huyet_don_thuat' }];
    state.player.hp = 100;
    state.player.stamina = 50;

    const enemy = enemyModule.EnemyGenerator.generate(5);
    gameInstance.pendingEncounter = {
      enemy,
      isDetected: true,
      prevPos: { x: 0, y: 0 },
      cell: { status: 'combat', resolved: false }
    };

    gameInstance.escapeAmbush();

    expect(state.player.stamina).toBe(45); // 50 - 5 = 45
    expect(state.player.hp).toBe(75); // 100 - 25 = 75
    expect(state.player.gridExplorationState.playerPos).toEqual({ x: 0, y: 0 });
    expect(state.ui.toast).toHaveBeenCalledWith(
      expect.stringContaining('Huyết Độn Thuật thành công'),
      'success'
    );
  });

  it('should fail escape due to lack of stamina and force battle', () => {
    state.player.mainEscapeId = 'loi_don_thuat';
    state.player.stamina = 5; // not enough stamina (requires 20)

    const enemy = enemyModule.EnemyGenerator.generate(5);
    gameInstance.pendingEncounter = {
      enemy,
      isDetected: true,
      onEnd: null
    };

    gameInstance.escapeAmbush();

    expect(state.ui.toast).toHaveBeenCalledWith(
      expect.stringContaining('Thể lực cạn kiệt'),
      'error'
    );
    expect(gameInstance.startBattle).toHaveBeenCalledWith(enemy, 'enemy', null);
  });
});
