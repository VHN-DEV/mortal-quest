import { describe, it, expect, beforeEach } from 'vitest';
import { CreationSystem } from '../src/systems/creation-system.js';
import { CLANS } from '../src/configs/clan-data.js';
import { SECTS } from '../src/configs/sect-data.js';
import { CREATION_ORIGINS } from '../src/configs/creation-data.js';
import { TimeSystem } from '../src/systems/time-system.js';

describe('Character Creation - Origin and Clan Integration', () => {
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

  it('should initialize selectedClanId as null', () => {
    expect(creationSystem.selectedClanId).toBeNull();
  });

  it('should reset selectedClanId when changing origins', () => {
    creationSystem.selectClanForOrigin('yen_gia_bao');
    expect(creationSystem.selectedClanId).toBe('yen_gia_bao');

    creationSystem.selectOrigin('tan_tu');
    expect(creationSystem.selectedClanId).toBeNull();
  });

  it('should correctly build player with clan choice (Yến Gia Bảo)', () => {
    creationSystem.selectOrigin('gia_toc');
    creationSystem.selectClanForOrigin('yen_gia_bao');
    
    creationSystem.points = 100;
    creationSystem.playerName = 'Yến Như Yên';

    const player = creationSystem.buildPlayer();
    
    expect(player).toBeDefined();
    expect(player.name).toBe('Yến Như Yên');
    expect(player.clanId).toBe('yen_gia_bao');
    expect(player.clanRank).toBe('ngoai_chi');
    expect(player.currentLocId).toBe('yen_gia_bao'); // Overridden start location to clan home

    // Verify starting technique learned
    const clanData = CLANS['yen_gia_bao'];
    const startingTech = clanData.libraryItems?.find(
        item => item.isTech && (item.minRankScore === undefined || item.minRankScore === 0)
    );
    if (startingTech) {
        expect(player.learnedTechniques.some(t => t.id === startingTech.id) || 
               player.learnedSecretTechniques.some(t => t.id === startingTech.id)).toBe(true);
    }
  });

  it('should correctly grant independent monthly resources for both Clan and Sect', () => {
    // 1. Create player belonging to Yen Gia Bao
    creationSystem.selectOrigin('gia_toc');
    creationSystem.selectClanForOrigin('yen_gia_bao');
    creationSystem.points = 100;
    creationSystem.playerName = 'Lục Tộc Nhân';
    
    const player = creationSystem.buildPlayer();
    
    // 2. Manually add player to Hoang Phong Coc sect to simulate dual-membership
    player.sectId = 'hoang_phong_coc';
    player.sectRank = 'ngoai_mon';
    
    const timeSystem = new TimeSystem(player, mockUI);

    const initialLingShi = player.lingShi;
    
    // Trigger month change
    timeSystem.onMonthChanged();

    // Rewards breakdown:
    // - Origin monthly stipend (gia_toc): +100 LingShi, 1x ngung_khi_dan
    // - Sect stipend (ngoai_mon): +50 LingShi, 1x ngung_khi_dan, 2x tich_coc_dan
    // - Clan stipend (ngoai_chi): +60 LingShi, 1x ngung_khi_dan, 2x tich_coc_dan
    
    const expectedLingShiGained = 100 + 50 + 60;
    expect(player.lingShi).toBe(initialLingShi + expectedLingShiGained);

    // Verify pills rewards
    // ngung_khi_dan should have been received from origin (1), sect (1), clan (1) -> total 3
    const ngungKhiDanQty = player.inventory.getItemQuantity('ngung_khi_dan');
    expect(ngungKhiDanQty).toBe(3);

    // tich_coc_dan should have been received from sect (2), clan (2) -> total 4
    const tichCocDanQty = player.inventory.getItemQuantity('tich_coc_dan');
    expect(tichCocDanQty).toBe(4);
  });
});
