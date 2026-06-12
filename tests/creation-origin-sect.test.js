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

  it('should scale monthly sect pill stipend according to player cultivation realm', () => {
    creationSystem.selectOrigin('tong_mon');
    creationSystem.selectSectForOrigin('hoang_phong_coc');
    creationSystem.points = 100;
    creationSystem.playerName = 'Hàn Lập';
    
    const player = creationSystem.buildPlayer();
    const timeSystem = new TimeSystem(player, mockUI);

    // 1. Ở cảnh giới Luyện Khí (realmId = 1)
    player.realmId = 1;
    player.inventory.bags[0].items = []; // Clear inventory
    timeSystem.onMonthChanged();
    
    // Đan dược bổng lộc tông môn cho Luyện Khí: ngung_khi_dan và tich_coc_dan
    expect(player.inventory.getItemQuantity('ngung_khi_dan')).toBe(2); // 1 từ origin monthly resources + 1 từ tông môn
    expect(player.inventory.getItemQuantity('tich_coc_dan')).toBe(2);

    // 2. Ở cảnh giới Trúc Cơ (realmId = 14)
    player.realmId = 14;
    player.inventory.bags[0].items = []; // Clear inventory
    timeSystem.onMonthChanged();
    
    // Đan dược bổng lộc tông môn cho Trúc Cơ: tu_vi_dan và bo_nguyen_dan, cộng thêm ngung_khi_dan từ origin (1 viên)
    expect(player.inventory.getItemQuantity('tu_vi_dan')).toBe(1);
    expect(player.inventory.getItemQuantity('bo_nguyen_dan')).toBe(1);
    expect(player.inventory.getItemQuantity('ngung_khi_dan')).toBe(1); // Từ Origin
    expect(player.inventory.getItemQuantity('tich_coc_dan')).toBe(0);

    // 3. Ở cảnh giới Nguyên Anh (realmId = 22)
    player.realmId = 22;
    player.inventory.bags[0].items = []; // Clear inventory
    timeSystem.onMonthChanged();
    
    // Đan dược bổng lộc tông môn cho Nguyên Anh: ngo_dao_dan và lac_van_tien_dan, cộng thêm ngung_khi_dan từ origin
    expect(player.inventory.getItemQuantity('ngo_dao_dan')).toBe(1);
    expect(player.inventory.getItemQuantity('lac_van_tien_dan')).toBe(1);
    expect(player.inventory.getItemQuantity('ngung_khi_dan')).toBe(1); // Từ Origin
  });

  it('should initialize player starting realm and items based on origin and race', () => {
    creationSystem.mode = 'scenario';
    // 1. Tán tu human starting realm should be 0
    creationSystem.selectOrigin('tan_tu');
    creationSystem.playerName = 'Tán Tu Nhân';
    let player = creationSystem.buildPlayer();
    expect(player.realmId).toBe(0);
    expect(player.inventory.hasItem('linh_hu_tui')).toBe(false);

    // 2. Gia tộc human starting realm should be 1, and have linh_hu_tui
    creationSystem.selectOrigin('gia_toc');
    creationSystem.selectClanForOrigin('yen_gia_bao');
    player = creationSystem.buildPlayer();
    expect(player.realmId).toBe(1);
    expect(player.inventory.hasItem('linh_hu_tui')).toBe(true);

    // 3. Đại thế gia human starting realm should be 3, and have can_khon_tui
    creationSystem.selectOrigin('dai_gia_toc');
    creationSystem.selectClanForOrigin('yen_gia_bao');
    player = creationSystem.buildPlayer();
    expect(player.realmId).toBe(3);
    expect(player.inventory.hasItem('can_khon_tui')).toBe(true);

    // 4. Hồi quy giả human starting realm should be 5
    creationSystem.selectOrigin('hoi_quy_gia');
    player = creationSystem.buildPlayer();
    expect(player.realmId).toBe(5);
  });
});
