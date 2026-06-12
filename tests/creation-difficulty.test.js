import { describe, it, expect, beforeEach } from 'vitest';
import { CreationSystem } from '../src/systems/creation-system.js';
import { CREATION_DIFFICULTIES } from '../src/configs/creation-data.js';

describe('Character Creation Difficulty Levels', () => {
  let creationSystem;
  let mockUI;

  beforeEach(() => {
    mockUI = {
      toast: () => {},
      switchScreen: () => {},
      alert: () => {},
    };
    creationSystem = new CreationSystem(mockUI);
  });

  it('should initialize with default difficulty "thuong"', () => {
    expect(creationSystem.selectedDifficulty).toBe('thuong');
    expect(creationSystem.points).toBe(CREATION_DIFFICULTIES['thuong'].points);
  });

  it('should allow changing difficulty and updating points correctly', () => {
    // Change to Cực Dễ (1000 points)
    creationSystem.selectDifficulty('cuc_de');
    expect(creationSystem.selectedDifficulty).toBe('cuc_de');
    expect(creationSystem.points).toBe(1000); 

    // Change to Cực Khó (50 points)
    creationSystem.selectDifficulty('cuc_kho');
    expect(creationSystem.selectedDifficulty).toBe('cuc_kho');
    expect(creationSystem.points).toBe(50); 
  });

  it('should preserve selected difficulty when calling rollRandom()', () => {
    creationSystem.selectDifficulty('de');
    expect(creationSystem.selectedDifficulty).toBe('de');

    creationSystem.rollRandom();
    expect(creationSystem.selectedDifficulty).toBe('de');
  });

  it('should ignore invalid difficulty IDs', () => {
    creationSystem.selectDifficulty('thuong');
    creationSystem.selectDifficulty('invalid_difficulty');
    expect(creationSystem.selectedDifficulty).toBe('thuong');
  });

  it('should prevent buildPlayer if custom points are negative', () => {
    creationSystem.mode = 'custom';
    creationSystem.selectDifficulty('cuc_kho'); // 50 points
    creationSystem.startingLingShi = 10000; // Costs 100 points
    
    // Call buildPlayer - should return null because points calculated will be negative
    const player = creationSystem.buildPlayer();
    expect(player).toBeNull();
  });

  it('should recalculate points inside buildPlayer to avoid outdated state bypass', () => {
    creationSystem.mode = 'custom';
    creationSystem.selectDifficulty('cuc_kho'); // 50 points
    creationSystem.points = 100; // Artificially set points to positive value to mimic bypass attempt
    creationSystem.startingLingShi = 10000; // Costs 100 points

    const player = creationSystem.buildPlayer();
    expect(player).toBeNull(); // Recalculation should correctly trigger and block player build
  });
});
