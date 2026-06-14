import { describe, it, expect, beforeEach } from 'vitest';
import { Enemy } from '../src/core/enemy.js';
import { NPC } from '../src/systems/npc-system.js';
import { state } from '../src/state.js';

describe('PNTT Divine Sense and Cultivation Concealment', () => {
  beforeEach(() => {
    // Setup player state
    state.player = {
      realmId: 5, // Trúc Cơ Trung Kỳ
      divineSense: 50,
      name: 'Hàn Lập'
    };
  });

  describe('Enemy Concealment Logic', () => {
    it('should NOT conceal cultivation if enemy has lower realm and player has equal divine sense', () => {
      const typeData = { name: 'Ma Tu Tà Ác', race: 'HUMAN' };
      const enemy = new Enemy(4, typeData);
      enemy.divineSense = 48;
      
      expect(enemy.isRealmConcealed()).toBe(false);
      expect(enemy.getDisplayName()).toBe('Ma Tu Tà Ác (Luyện Khí Sơ Kỳ (Tầng 4))');
    });

    it('should conceal cultivation if enemy has higher realm and superior divine sense', () => {
      const typeData = { name: 'Ma Tu Tà Ác', race: 'HUMAN' };
      const enemy = new Enemy(8, typeData);
      enemy.divineSense = 80;
      
      expect(enemy.isRealmConcealed()).toBe(true);
      expect(enemy.getDisplayName()).toBe('Ma Tu Tà Ác (Tu Vi: ???)');
    });

    it('should conceal cultivation if enemy uses Liem Khi Quyet and player sense is not high enough', () => {
      const typeData = { name: 'Ma Tu Tà Ác', race: 'HUMAN' };
      const enemy = new Enemy(4, typeData);
      enemy.divineSense = 40;
      enemy.equippedConcealmentId = 'liem_khi_quyet';
      
      // player sense is 50, enemy sense + 20 threshold is 60 -> should be concealed
      expect(enemy.isRealmConcealed()).toBe(true);
      expect(enemy.getDisplayName()).toBe('Ma Tu Tà Ác (Tu Vi: ???)');
    });

    it('should reveal cultivation if enemy uses Liem Khi Quyet but player sense is at least 20 points higher', () => {
      const typeData = { name: 'Ma Tu Tà Ác', race: 'HUMAN' };
      const enemy = new Enemy(4, typeData);
      enemy.divineSense = 30;
      enemy.equippedConcealmentId = 'liem_khi_quyet';
      
      // player sense is 50, enemy sense + 20 threshold is 50 -> should be revealed
      expect(enemy.isRealmConcealed()).toBe(false);
      expect(enemy.getDisplayName()).toBe('Ma Tu Tà Ác (Luyện Khí Sơ Kỳ (Tầng 4))');
    });

    it('should conceal cultivation if enemy uses Quy Nguyen Thu Tuc Cong and player sense is not high enough', () => {
      const typeData = { name: 'Trưởng Lão Ma Tông', race: 'HUMAN' };
      const enemy = new Enemy(12, typeData);
      enemy.divineSense = 40;
      enemy.equippedConcealmentId = 'quy_nguyen_thu_tuc_cong';
      
      // player sense is 50, enemy sense + 50 threshold is 90 -> should be concealed
      expect(enemy.isRealmConcealed()).toBe(true);
      expect(enemy.getDisplayName()).toBe('Trưởng Lão Ma Tông (Tu Vi: ???)');
    });

    it('should reveal cultivation if enemy uses Quy Nguyen Thu Tuc Cong but player sense is at least 50 points higher', () => {
      const typeData = { name: 'Trưởng Lão Ma Tông', race: 'HUMAN' };
      const enemy = new Enemy(12, typeData);
      enemy.divineSense = 40;
      enemy.equippedConcealmentId = 'quy_nguyen_thu_tuc_cong';
      state.player.divineSense = 90;
      
      // player sense is 90, enemy sense + 50 threshold is 90 -> should be revealed
      expect(enemy.isRealmConcealed()).toBe(false);
    });
  });

  describe('NPC Concealment Logic', () => {
    it('should conceal stats and realm if NPC is concealed', () => {
      const npc = new NPC('tan_tu', 8);
      npc.divineSense = 60;
      npc.equippedConcealmentId = 'liem_khi_quyet';
      
      // player sense is 50, NPC sense + 20 is 80 -> concealed
      expect(npc.isRealmConcealed()).toBe(true);
      expect(npc.getDisplayRealm()).toBe('Ẩn giấu');
      expect(npc.getDisplayRoot()).toBe('???');
      expect(npc.getDisplayPhysique()).toBe('???');
    });

    it('should NOT conceal stats and realm if player has high enough divine sense', () => {
      const npc = new NPC('tan_tu', 8);
      npc.divineSense = 30;
      npc.equippedConcealmentId = 'liem_khi_quyet';
      
      // player sense is 50, NPC sense + 20 is 50 -> revealed
      expect(npc.isRealmConcealed()).toBe(false);
      expect(npc.getDisplayRealm()).not.toBe('Ẩn giấu');
      expect(npc.getDisplayRoot()).not.toBe('???');
      expect(npc.getDisplayPhysique()).not.toBe('???');
    });
  });
});
