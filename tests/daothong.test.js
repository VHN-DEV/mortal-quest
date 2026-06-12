import { describe, it, expect } from 'vitest';
import { Player } from '../src/core/player.js';

describe('Dao Thong System Tests', () => {
  it('should default to Tap Tu for a new human player', () => {
    const player = new Player({ race: 'HUMAN' });
    player.calculateStats();
    expect(player.daoThong).toBe('Tạp Tu');
    expect(player.mainPath).toBe('orthodox');
  });

  it('should default to Yêu Tu for a spirit beast player', () => {
    const player = new Player({ race: 'YAO' });
    player.calculateStats();
    expect(player.daoThong).toBe('Yêu Tu');
    expect(player.mainPath).toBe('yeu_tu');
  });

  it('should default to Ma Tu for a demon player', () => {
    const player = new Player({ race: 'DEMON' });
    player.calculateStats();
    expect(player.daoThong).toBe('Ma Tu');
    expect(player.mainPath).toBe('ma_dao');
  });

  it('should identify orthodox cultivator upon learning orthodox technique', () => {
    const player = new Player({ race: 'HUMAN' });
    // Add an orthodox technique: Trường Xuân Nạp Khí Quyết (HOANG_GIAI)
    // HOANG_GIAI yields 50 base points. MasteryLevel 3 (Đại thành) yields 2.5x multiplier.
    // Total points = 50 * 2.5 = 125. Since 100 base + 125 = 225 (> 100 threshold), it should resolve to Đạo Môn (Pháp Tu).
    player.learnedTechniques.push({
      id: 'truong_xuan_nap_khi_quyet',
      stage: 1,
      mastery: 5000,
      masteryLevel: 3,
      quality: 'HOANG_GIAI'
    });
    player.calculateStats();
    expect(player.daoThong).toBe('Đạo Môn (Pháp Tu)');
    expect(player.mainPath).toBe('orthodox');
  });

  it('should identify Quỷ Tu if ghost-related techniques dominate', () => {
    const player = new Player({ race: 'HUMAN' });
    // Learn U Minh Huy Ngạn (HUYEN_GIAI, contains "U Minh")
    // HUYEN_GIAI yields 150 base points. MasteryLevel 4 (Viên mãn) yields 4x multiplier.
    // Total points = 150 * 4 = 600.
    player.learnedTechniques.push({
      id: 'u_minh_huy_ngan',
      stage: 1,
      mastery: 15000,
      masteryLevel: 4,
      quality: 'HUYEN_GIAI'
    });
    player.calculateStats();
    expect(player.daoThong).toBe('Quỷ Tu');
    expect(player.mainPath).toBe('quy_dao');
  });

  it('should identify Thể Tu if body refining techniques dominate', () => {
    const player = new Player({ race: 'HUMAN' });
    // Learn Cửu Chuyển Kim Thân Quyết (HUYEN_GIAI, Luyện Thể)
    // HUYEN_GIAI yields 150 base. MasteryLevel 4 (Viên mãn) yields 4x multiplier.
    // Total points = 600.
    player.learnedTechniques.push({
      id: 'cuu_chuyen_kim_than',
      stage: 1,
      mastery: 15000,
      masteryLevel: 4,
      quality: 'HUYEN_GIAI'
    });
    player.calculateStats();
    expect(player.daoThong).toBe('Thể Tu');
    expect(player.mainPath).toBe('orthodox');
  });

  it('should identify dual-cultivator path (Song Tu) if two paths are balanced', () => {
    const player = new Player({ race: 'HUMAN' });
    // Path 1: Thể Tu: Cửu Chuyển Kim Thân Quyết (HUYEN_GIAI, Luyện Thể) -> 600 points
    player.learnedTechniques.push({
      id: 'cuu_chuyen_kim_than',
      stage: 1,
      mastery: 15000,
      masteryLevel: 4,
      quality: 'HUYEN_GIAI'
    });
    // Path 2: Quỷ Tu: U Minh Huy Ngạn (HUYEN_GIAI, contains "U Minh") -> 600 points
    player.learnedTechniques.push({
      id: 'u_minh_huy_ngan',
      stage: 1,
      mastery: 15000,
      masteryLevel: 4,
      quality: 'HUYEN_GIAI'
    });

    player.calculateStats();
    // Highest path is Quỷ Tu (600), second highest is Thể Tu (600).
    // Second path is 100% of highest (>= 70% threshold).
    // So it should render "Quỷ Tu - Thể Tu Song Tu".
    expect(player.daoThong).toContain('Song Tu');
    expect(player.daoThong).toContain('Quỷ Tu');
    expect(player.daoThong).toContain('Thể Tu');
  });
});
