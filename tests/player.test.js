import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Player } from '../src/core/player.js';
import { state } from '../src/state.js';
import { getSecretTechniqueById } from '../src/configs/technique-data.js';
import { getItemRequirements } from '../src/configs/artifact-data.js';

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
      player.inventory.addItem('trung_pham_linh_thach', 2);
      // Total should be 100 (Hạ) + 2 * 100 (Trung) = 300
      expect(player.lingShi).toBe(300);
    });

    it('should spend Linh Thạch with automatic currency priority and change conversion', () => {
      const player = new Player();
      
      // Add 1 Trung Phẩm Linh Thạch (value = 100)
      player.inventory.addItem('trung_pham_linh_thach', 1);
      expect(player.lingShi).toBe(100);
      
      // Spend 30. It should consume 1 Trung and give back 70 Hạ.
      const success = player.spendLingShi(30);
      expect(success).toBe(true);
      expect(player.lingShi).toBe(70);
      
      expect(player.inventory.getItemQuantity('trung_pham_linh_thach')).toBe(0);
      expect(player.inventory.getItemQuantity('ha_pham_linh_thach')).toBe(70);
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

  describe('PNTT Cultivation Mechanics', () => {
    it('should initialize PNTT properties correctly', () => {
      const player = new Player();
      expect(player.nguyenThanRank).toBe(0);
      expect(player.tienKhieuOpen).toBe(0);
      expect(player.phapTac).toEqual({ loi: 0, hoa: 0, thuy: 0, phong: 0, khong_gian: 0, thoi_gian: 0, luan_hoi: 0 });
      expect(player.isTanTien).toBe(false);
      expect(player.tanTienKiếpCount).toBe(0);
    });

    it('should apply stats scaling for Nguyên Thần and Tiên Khiếu', () => {
      const player = new Player();
      player.permanentStats = { atk: 100, def: 100, spd: 100 };
      
      // Open 10 Tiên Khiếu
      player.tienKhieuOpen = 10;
      // Calculate bonuses
      player.calculateStats();
      // Multiplier should be 1 + 10 * 0.01 = 1.10
      expect(player.atk).toBeGreaterThanOrEqual(110);

      // Upgrade Nguyên Thần
      player.nguyenThanRank = 3; // Cao cấp Nguyên Thần
      player.calculateStats();
      expect(player.divineSense).toBeGreaterThan(50); // Divine sense bonus applied
    });

    it('should handle openTienKhieu correctly', () => {
      const player = new Player();
      player.realmId = 42; // Chân Tiên (eligible)
      player.tuVi = 500000;
      
      // Should fail without Tiên Nguyên Thạch
      let res = player.openTienKhieu();
      expect(res.success).toBe(false);
      expect(res.msg).toContain('Tiên Nguyên Thạch');

      // Add 1 Tiên Nguyên Thạch
      player.inventory.addItem('tien_nguyen_thach', 1);

      // Spy Math.random to guarantee success
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.0);
      res = player.openTienKhieu();
      expect(res.success).toBe(true);
      expect(player.tienKhieuOpen).toBe(1);
      randomSpy.mockRestore();
    });

    it('should handle comprehendLaw correctly', () => {
      const player = new Player();
      player.realmId = 26; // Hóa Thần
      player.tuVi = 500000;
      player.stamina = 100;
      player.comprehension = 80;

      // Spy Math.random to guarantee success
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.0);
      const res = player.comprehendLaw('loi');
      expect(res.success).toBe(true);
      expect(player.phapTac.loi).toBeGreaterThan(0);
      expect(player.stamina).toBe(80); // cost deducted
    });
  });

  describe('PNTT Equipment and Natal Dharma Treasure', () => {
    it('should calculate equipment requirements correctly via getItemRequirements', () => {
      const item = { tier: 'LINH_KHI' };
      const req = getItemRequirements(item);
      expect(req.mana).toBe(150);
      expect(req.divineSense).toBe(40);
    });

    it('should check item requirements correctly and apply cubic penalty', () => {
      const player = new Player();
      player.maxMana = 100;
      player.divineSense = 20;

      const item = { tier: 'LINH_KHI', stats: { atk: 100 } };
      const res = player.checkItemRequirements(item);
      expect(res.meets).toBe(false);
      expect(res.penaltyMultiplier).toBeCloseTo(0.125);
    });

    it('should refine, upgrade, and binh giai natal treasure successfully', () => {
      const player = new Player();
      player.realmId = 18; // Kết Đan
      player.inventory.addItem('ha_pham_linh_thach', 200000);
      player.inventory.addItem('van_nien_thiet_moc', 1);
      player.inventory.addItem('tinh_kim', 5);

      // Refine
      const refineRes = player.refineNatalTreasure('thanh_truc_phong_van_kiem');
      expect(refineRes.success).toBe(true);
      expect(player.natalTreasure).not.toBeNull();
      expect(player.natalTreasure.name).toBe('Thanh Trúc Phong Vân Kiếm');
      expect(player.natalTreasure.level).toBe(1);

      // Upgrade
      player.tuVi = 500000;
      player.inventory.addItem('ha_pham_linh_thach', 100000);
      player.inventory.addItem('van_nien_thiet_moc', 1);
      
      const upgradeRes = player.upgradeNatalTreasure();
      expect(upgradeRes.success).toBe(true);
      expect(player.natalTreasure.level).toBe(2);

      // Binh giai
      player.hp = 1000;
      player.mana = 500;
      const binhGiaiRes = player.binhGiaiNatalTreasure();
      expect(binhGiaiRes.success).toBe(true);
      expect(player.natalTreasure).toBeNull();
      expect(player.hp).toBe(700); // 30% loss
      expect(player.mana).toBe(350); // 30% loss
    });
  });

  describe('Phàm Nhân Tu Tiên Advanced Stats Upgrades', () => {
    it('should map critRate to weaknessStrikeChance with backward compatibility', () => {
      const player = new Player();
      player.soulRealmId = 1;
      player.calculateStats();
      
      expect(player.weaknessStrikeChance).toBe(0.05);
      expect(player.fatalStrikeChance).toBe(0.02);
      expect(player.advancedStats.critRate).toBe(0.05);

      // Modify weaknessStrikeChance and check critRate
      player.weaknessStrikeChance = 0.12;
      expect(player.advancedStats.critRate).toBe(0.12);

      // Modify critRate and check weaknessStrikeChance
      player.advancedStats.critRate = 0.08;
      expect(player.weaknessStrikeChance).toBe(0.08);
      expect(player.advancedStats.weaknessStrikeChance).toBe(0.08);
    });

    it('should correctly scale weaknessStrikeChance and fatalStrikeChance based on Soul Realm level', () => {
      const player = new Player();
      player.soulRealmId = 5; // Level 5 Thần Hồn
      player.calculateStats();
      
      // Starting is 0.05, added (5 - 1) * 0.01 = 0.04 -> 0.09
      expect(player.weaknessStrikeChance).toBeCloseTo(0.09);
      // Starting is 0.02, added (5 - 1) * 0.002 = 0.008 -> 0.028
      expect(player.fatalStrikeChance).toBeCloseTo(0.028);
    });

    it('should reduce weaknessStrikeChance and fatalStrikeChance based on Heart Demon levels', () => {
      const player = new Player();
      player.soulRealmId = 1;
      player.heartDemon = 40; // > 10 penalty
      player.calculateStats();
      
      // hdPenalty = 1 - (40 / 200) = 0.8
      // weaknessStrikeChance = 0.05 * 0.8 = 0.04
      // fatalStrikeChance = 0.02 * 0.8 = 0.016
      expect(player.weaknessStrikeChance).toBeCloseTo(0.04);
      expect(player.fatalStrikeChance).toBeCloseTo(0.016);
    });
  });

  describe('Realm Discovery', () => {
    it('should initialize discoveredWorlds and knownWorlds with only the default world', () => {
      const player = new Player();
      expect(player.discoveredWorlds).toEqual(['nhan_gioi']);
      expect(player.knownWorlds).toEqual(['nhan_gioi']);
    });

    it('should save and load discoveredWorlds and knownWorlds correctly', () => {
      const player = new Player();
      player.discoverWorld('linh_gioi');
      player.knowWorld('ma_gioi');
      
      const saveData = player.save();
      expect(saveData.discoveredWorlds).toContain('nhan_gioi');
      expect(saveData.discoveredWorlds).toContain('linh_gioi');
      expect(saveData.knownWorlds).toContain('nhan_gioi');
      expect(saveData.knownWorlds).toContain('linh_gioi');
      expect(saveData.knownWorlds).toContain('ma_gioi');
      
      const newPlayer = new Player();
      newPlayer.load(saveData);
      expect(newPlayer.discoveredWorlds).toContain('nhan_gioi');
      expect(newPlayer.discoveredWorlds).toContain('linh_gioi');
      expect(newPlayer.knownWorlds).toContain('nhan_gioi');
      expect(newPlayer.knownWorlds).toContain('linh_gioi');
      expect(newPlayer.knownWorlds).toContain('ma_gioi');
    });

    it('should fallback to currentWorldId if discoveredWorlds is missing in loaded data', () => {
      const player = new Player();
      const saveData = player.save();
      delete saveData.discoveredWorlds;
      delete saveData.knownWorlds;
      saveData.currentWorldId = 'ma_gioi';
      
      const newPlayer = new Player();
      newPlayer.load(saveData);
      expect(newPlayer.discoveredWorlds).toEqual(['ma_gioi']);
      expect(newPlayer.knownWorlds).toEqual(['ma_gioi']);
    });

    it('should successfully know and discover worlds and reject duplicates', () => {
      const player = new Player();
      
      // knowWorld check
      expect(player.knowWorld('linh_gioi')).toBe(true);
      expect(player.knownWorlds).toContain('linh_gioi');
      expect(player.discoveredWorlds).not.toContain('linh_gioi');
      expect(player.knowWorld('linh_gioi')).toBe(false); // duplicate know

      // discoverWorld check
      expect(player.discoverWorld('linh_gioi')).toBe(true);
      expect(player.discoveredWorlds).toContain('linh_gioi');
      expect(player.discoverWorld('linh_gioi')).toBe(false); // duplicate discover
      
      // knowWorld after discover should be rejected
      expect(player.knowWorld('linh_gioi')).toBe(false);
    });
  });
});


