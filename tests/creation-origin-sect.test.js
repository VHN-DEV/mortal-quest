import { describe, it, expect, beforeEach } from 'vitest';
import { CreationSystem } from '../src/systems/creation-system.js';
import { SECTS } from '../src/configs/sect-data.js';
import { CREATION_ORIGINS } from '../src/configs/creation-data.js';
import { TimeSystem } from '../src/systems/time-system.js';

describe('Character Creation - Origin and Sect Integration', () => {
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

  it('should initialize selectedSectId as null', () => {
    expect(creationSystem.selectedSectId).toBeNull();
  });

  it('should reset selectedSectId when changing origins', () => {
    creationSystem.selectSectForOrigin('hoang_phong_coc');
    expect(creationSystem.selectedSectId).toBe('hoang_phong_coc');

    creationSystem.selectOrigin('tan_tu');
    expect(creationSystem.selectedSectId).toBeNull();
  });

  it('should correctly build player with righteous sect choice (Hoàng Phong Cốc)', () => {
    creationSystem.selectOrigin('tong_mon');
    creationSystem.selectSectForOrigin('hoang_phong_coc');
    
    // Set points to a positive value so validation passes
    creationSystem.points = 100;
    creationSystem.playerName = 'Hàn Lập';

    const player = creationSystem.buildPlayer();
    
    expect(player).toBeDefined();
    expect(player.name).toBe('Hàn Lập');
    expect(player.sectId).toBe('hoang_phong_coc');
    expect(player.sectRank).toBe('ngoai_mon');
    expect(player.currentLocId).toBe('hoang_phong_coc'); // Custom spawn overridden by chosen sect

    // verify that starting technique for Hoàng Phong Cốc has been learned
    // Hoàng Phong Cốc default tech is usually Trường Xuân Công or similar basic tech
    const sectData = SECTS['hoang_phong_coc'];
    const startingTech = sectData.libraryItems?.find(
        item => item.isTech && (item.minRankScore === undefined || item.minRankScore === 0)
    );
    if (startingTech) {
        expect(player.learnedTechniques.some(t => t.id === startingTech.id) || 
               player.learnedSecretTechniques.some(t => t.id === startingTech.id)).toBe(true);
    }
  });

  it('should correctly grant monthlyResources and monthly items stipend via TimeSystem', () => {
    creationSystem.selectOrigin('tong_mon');
    creationSystem.selectSectForOrigin('hoang_phong_coc');
    creationSystem.points = 100;
    creationSystem.playerName = 'Hàn Lập';
    
    const player = creationSystem.buildPlayer();
    const timeSystem = new TimeSystem(player, mockUI);

    // Initial resources
    const initialLingShi = player.lingShi;

    // Simulate new month
    timeSystem.onMonthChanged();

    // Player should receive:
    // 1. Origin monthly resources: +50 LingShi (tong_mon), +1 ngung_khi_dan
    // 2. Sect monthly resources: +50 LingShi
    expect(player.lingShi).toBe(initialLingShi + 50 + 50);
    
    // Ngưng khí đan should be added
    const hasNgungKhiDan = player.inventory.hasItem('ngung_khi_dan');
    expect(hasNgungKhiDan).toBe(true);
  });

  it('should scale monthly sect stipend according to player rank', () => {
    creationSystem.selectOrigin('tong_mon');
    creationSystem.selectSectForOrigin('hoang_phong_coc');
    creationSystem.points = 100;
    creationSystem.playerName = 'Hàn Lập';
    
    const player = creationSystem.buildPlayer();
    
    // Thăng chức lên Trưởng Lão (truong_lao)
    player.sectRank = 'truong_lao';
    
    const timeSystem = new TimeSystem(player, mockUI);
    const initialLingShi = player.lingShi;

    timeSystem.onMonthChanged();

    // Bổng lộc Trưởng Lão là 1500 Linh thạch.
    // Lương bổng tổng cộng = Linh thạch xuất thân (50) + Linh thạch chức vụ Trưởng Lão (1500) = 1550 Linh thạch.
    expect(player.lingShi).toBe(initialLingShi + 50 + 1500);
  });
});
