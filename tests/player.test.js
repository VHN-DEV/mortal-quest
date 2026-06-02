import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Player } from '../src/core/player.js';
import { state } from '../src/state.js';
import { getSecretTechniqueById } from '../src/configs/technique-data.js';

// Setup Mock UI and systems on state
beforeEach(() => {
  state.ui = {
    toast: vi.fn(),
    alert: vi.fn()
  };
  state.systems = {
    cheat: null
  };
});

describe('Player class', () => {
  it('should initialize with default attributes', () => {
    const player = new Player();
    
    expect(player.name).toBe('Phàm Nhân');
    expect(player.gender).toBe('male');
    expect(player.race).toBe('HUMAN');
    expect(player.realmId).toBe(0);
    expect(player.tuVi).toBe(0);
    
    expect(player.hp).toBe(100);
    expect(player.maxHp).toBe(100);
    expect(player.mana).toBe(50);
    expect(player.maxMana).toBe(50);
  });

  describe('Linh Thạch (Money) Operations', () => {
    it('should calculate total Linh Thạch correctly from inventory items', () => {
      const player = new Player();
      
      // Initialize with no money
      expect(player.lingShi).toBe(0);
      
      // Add 100 Hạ Phẩm Linh Thạch (1 Hạ = 1)
      player.addLingShi(100);
      expect(player.lingShi).toBe(100);
      
      // Add 2 Trung Phẩm Linh Thạch (1 Trung = 100)
      player.inventory.addItem('ling_thach_trung', 2);
      // Total should be 100 (Hạ) + 2 * 100 (Trung) = 300
      expect(player.lingShi).toBe(300);
    });

    it('should spend Linh Thạch with automatic currency priority and change conversion', () => {
      const player = new Player();
      
      // Add 1 Trung Phẩm Linh Thạch (value = 100)
      player.inventory.addItem('ling_thach_trung', 1);
      expect(player.lingShi).toBe(100);
      
      // Spend 30. It should consume 1 Trung and give back 70 Hạ.
      const success = player.spendLingShi(30);
      expect(success).toBe(true);
      expect(player.lingShi).toBe(70);
      
      expect(player.inventory.getItemQuantity('ling_thach_trung')).toBe(0);
      expect(player.inventory.getItemQuantity('ling_thach_ha')).toBe(70);
    });

    it('should return false when spending more Linh Thạch than available', () => {
      const player = new Player();
      player.addLingShi(50);
      
      const success = player.spendLingShi(60);
      expect(success).toBe(false);
      expect(player.lingShi).toBe(50); // Money not changed
    });
  });

  describe('calculateThienDaoApLuc', () => {
    it('should return 0 pressure for under 1 month (<= 360 game minutes)', () => {
      const player = new Player();
      expect(player.calculateThienDaoApLuc(0)).toBe(0);
      expect(player.calculateThienDaoApLuc(360)).toBe(0);
    });

    it('should scale from 0% to 10% pressure between 1 and 3 months (360 to 1080 game minutes)', () => {
      const player = new Player();
      // Midpoint: 2 months = 720 game minutes
      // pct = (720 - 360) / (1080 - 360) = 360 / 720 = 0.5
      // returns 0.5 * 10 = 5%
      expect(player.calculateThienDaoApLuc(720)).toBe(5);
      expect(player.calculateThienDaoApLuc(1080)).toBe(10);
    });

    it('should scale from 10% to 25% pressure between 3 and 6 months (1080 to 2160 game minutes)', () => {
      const player = new Player();
      // Midpoint: 4.5 months = 1620 game minutes
      // returns 10 + 0.5 * 15 = 17.5%
      expect(player.calculateThienDaoApLuc(1620)).toBe(17.5);
      expect(player.calculateThienDaoApLuc(2160)).toBe(25);
    });

    it('should scale up to 100% pressure after 2 years', () => {
      const player = new Player();
      expect(player.calculateThienDaoApLuc(8640)).toBe(100);
      expect(player.calculateThienDaoApLuc(10000)).toBe(100); // capped at 100%
    });
  });

  describe('calculateStability', () => {
    it('should keep stability high (100) if Tu Vi, Body and Soul realms are closely aligned', () => {
      const player = new Player();
      player.realmId = 2; // Luyện Khí tầng 2
      player.bodyRealmId = 2;
      player.soulRealmId = 2;
      player.stability = 100;
      
      player.calculateStability();
      
      expect(player.stability).toBe(100);
    });

    it('should slowly decay stability if Tu Vi is too far ahead of Body & Soul', () => {
      const player = new Player();
      player.realmId = 10; // Tu vi Luyện Khí tầng 10
      player.bodyRealmId = 1; // Thể chất thấp
      player.soulRealmId = 1; // Thần hồn thấp
      
      player.stability = 100;
      
      // targetStability should be 100 - (9 - 2) * 10 = 30
      player.calculateStability();
      
      expect(player.stability).toBeLessThan(100); // Decaying towards target
    });
  });

  describe('Củng Cố Căn Cơ and Nén Pháp Lực', () => {
    it('should convert excess Tu Vi into tinh_thuan when in condensing state at Đại Viên Mãn', () => {
      const player = new Player();
      player.tuViState = 'condensing';
      const expReq = player._getCurrentRealmExpRequired();
      player.tuVi = expReq;
      
      player.addTuVi(100);
      
      expect(player.tuVi).toBe(expReq); // capped
      expect(player.tinh_thuan).toBe(30); // 30% of 100
    });

    it('should convert excess Tu Vi into can_co when in consolidating state at Đại Viên Mãn', () => {
      const player = new Player();
      player.tuViState = 'consolidating';
      const expReq = player._getCurrentRealmExpRequired();
      player.tuVi = expReq;
      
      player.addTuVi(expReq * 0.1); // add 10% of expRequired
      
      expect(player.tuVi).toBe(expReq); // capped
      // canCoGain = (amount / expRequired) * 100 * 0.5 = 0.1 * 100 * 0.5 = 5%
      expect(player.can_co).toBe(5);
    });
  });

  describe('8 Primary Profession Manuals System', () => {
    it('should correctly classify all 8 manuals as 法术 (Pháp Thuật) and 辅助 (Phụ Trợ)', () => {
      const manuals = [
        'dan_dao_chan_giai',
        'luyen_khi_tong_cuong',
        'thai_thuong_phu_kinh',
        'co_quan_linh_ky',
        'cuu_u_luyen_thi_thuat',
        'tran_dao_thien_thu',
        'van_thu_ngu_phap',
        'thien_trung_bi_luc'
      ];

      manuals.forEach(id => {
        const tech = getSecretTechniqueById(id);
        expect(tech).not.toBeNull();
        expect(tech.category).toBe('Pháp Thuật');
        expect(tech.subCategory).toBe('Phụ Trợ');
      });
    });

    it('should allow player to learn and advance all 8 manuals as secret techniques', () => {
      const player = new Player();
      const manuals = [
        'dan_dao_chan_giai',
        'luyen_khi_tong_cuong',
        'thai_thuong_phu_kinh',
        'co_quan_linh_ky',
        'cuu_u_luyen_thi_thuat',
        'tran_dao_thien_thu',
        'van_thu_ngu_phap',
        'thien_trung_bi_luc'
      ];

      manuals.forEach(id => {
        expect(player.learnSecretTechnique(id)).toBe(true);
        expect(player.learnedSecretTechniques.some(s => s.id === id)).toBe(true);
      });
    });

    it('should apply correct exp bonuses for all 8 profession exp gains based on manual mastery levels', () => {
      const player = new Player();
      
      // Learn all manuals
      const manuals = [
        'dan_dao_chan_giai',
        'luyen_khi_tong_cuong',
        'thai_thuong_phu_kinh',
        'co_quan_linh_ky',
        'cuu_u_luyen_thi_thuat',
        'tran_dao_thien_thu',
        'van_thu_ngu_phap',
        'thien_trung_bi_luc'
      ];
      manuals.forEach(id => player.learnSecretTechnique(id));

      // 1. Alchemy (dan_dao_chan_giai - level 1 = 1.0x bonus)
      player.alchemyExp = 0;
      player.addAlchemyExp(50);
      expect(player.alchemyExp).toBe(50);

      // Upgrade dan_dao_chan_giai to level 2 (which gives 1.2x bonus)
      const alchSecret = player.learnedSecretTechniques.find(s => s.id === 'dan_dao_chan_giai');
      alchSecret.masteryLevel = 2;
      player.alchemyExp = 0;
      player.addAlchemyExp(50);
      expect(player.alchemyExp).toBe(60);

      // 2. Smithing (luyen_khi_tong_cuong - level 2 = 1.2x bonus)
      const smithSecret = player.learnedSecretTechniques.find(s => s.id === 'luyen_khi_tong_cuong');
      smithSecret.masteryLevel = 2;
      player.smithingExp = 0;
      player.addSmithingExp(50);
      expect(player.smithingExp).toBe(60);

      // 3. Talisman (thai_thuong_phu_kinh - level 2 = 1.2x bonus)
      const talSecret = player.learnedSecretTechniques.find(s => s.id === 'thai_thuong_phu_kinh');
      talSecret.masteryLevel = 2;
      player.talismanExp = 0;
      player.addTalismanExp(50);
      expect(player.talismanExp).toBe(60);

      // 4. Puppet (co_quan_linh_ky - level 2 = 1.2x bonus)
      const puppetSecret = player.learnedSecretTechniques.find(s => s.id === 'co_quan_linh_ky');
      puppetSecret.masteryLevel = 2;
      player.puppetExp = 0;
      player.addPuppetExp(50);
      expect(player.puppetExp).toBe(60);

      // 5. Corpse (cuu_u_luyen_thi_thuat - level 2 = 1.2x bonus)
      const corpseSecret = player.learnedSecretTechniques.find(s => s.id === 'cuu_u_luyen_thi_thuat');
      corpseSecret.masteryLevel = 2;
      player.corpseExp = 0;
      player.addCorpseExp(50);
      expect(player.corpseExp).toBe(60);

      // 6. Formation (tran_dao_thien_thu - level 2 = 1.2x bonus)
      const formSecret = player.learnedSecretTechniques.find(s => s.id === 'tran_dao_thien_thu');
      formSecret.masteryLevel = 2;
      player.formationExp = 0;
      player.addFormationExp(50);
      expect(player.formationExp).toBe(60);

      // 7. Beast (van_thu_ngu_phap - level 2 = 1.2x bonus)
      const beastSecret = player.learnedSecretTechniques.find(s => s.id === 'van_thu_ngu_phap');
      beastSecret.masteryLevel = 2;
      player.beastExp = 0;
      player.addBeastExp(50);
      expect(player.beastExp).toBe(60);

      // 8. Insect (thien_trung_bi_luc - level 2 = 1.2x bonus)
      const insectSecret = player.learnedSecretTechniques.find(s => s.id === 'thien_trung_bi_luc');
      insectSecret.masteryLevel = 2;
      player.insectExp = 0;
      player.addInsectExp(50);
      expect(player.insectExp).toBe(60);
    });
  });
});
