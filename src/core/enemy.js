import { getRealmById, RACE_DATA } from '../configs/realm-data.js';
import { ASSETS } from '../configs/asset-data.js';
import { SECTS } from '../configs/sect-data.js';
import { state } from '../state.js';
import { WORLDS, findWorldIdByLocId, getLocationRealmRange, generateRandomRealm } from '../configs/map-data.js';

export const SECT_GEAR = {
    'thien_kiem_tong': {
        weapon: { id: 'tinh_ha_phi_kiem', name: 'Tinh Hà Phi Kiếm' },
        armor: { id: 'thien_kiem_dao_bao', name: 'Thiên Kiếm Đạo Bào' },
        artifact: { id: 'kiem_y_ho_the_phu', name: 'Kiếm Ý Hộ Thể Phù' }
    },
    'hoang_phong_coc': {
        weapon: { id: 'hoang_phong_sa_kiem', name: 'Hoàng Phong Sa Kiếm' },
        armor: { id: 'hoang_phong_dao_bao', name: 'Hoàng Phong Đạo Bào' },
        artifact: { id: 'than_sa_tui', name: 'Thần Sa Túi' }
    },
    'huyen_am_coc': {
        weapon: { id: 'u_minh_quy_viem_kiem', name: 'U Minh Quỷ Viêm Kiếm' },
        armor: { id: 'huyen_am_phap_y', name: 'Huyền Âm Pháp Y' },
        artifact: { id: 'am_hon_phien', name: 'Âm Hồn Phiên' }
    },
    'yem_nguyet_tong': {
        weapon: { id: 'mi_anh_song_kiem', name: 'Mị Ảnh Song Kiếm' },
        armor: { id: 'yem_nguyet_bich_y', name: 'Yểm Nguyệt Bích Y' },
        artifact: { id: 'hoan_nguyet_kinh', name: 'Hoan Nguyệt Kính' }
    },
    'lac_van_tong': {
        weapon: { id: 'lac_van_linh_kiem', name: 'Lạc Vân Linh Kiếm' },
        armor: { id: 'lac_van_phap_y', name: 'Lạc Vân Pháp Y' },
        artifact: { id: 'than_nong_dinh', name: 'Thần Nông Đan Đỉnh' }
    },
    'thien_tinh_tong': {
        weapon: { id: 'tinh_than_tran_ban', name: 'Tinh Thần Trận Bản' },
        armor: { id: 'thien_tinh_bat_quai_y', name: 'Thiên Tinh Bát Quái Y' },
        artifact: { id: 'tinh_quang_tran_ky', name: 'Tinh Quang Trận Kỳ' }
    },
    'linh_thu_son': {
        weapon: { id: 'ngu_thu_linh_tien', name: 'Ngự Thú Linh Tiên' },
        armor: { id: 'van_thu_giap_y', name: 'Vạn Thú Giáp Y' },
        artifact: { id: 'linh_thu_ho_co', name: 'Linh Thú Hộ Cổ' }
    },
    'thanh_hu_mon': {
        weapon: { id: 'thanh_hu_phat_tran', name: 'Thanh Hư Phất Trần' },
        armor: { id: 'thanh_hu_dao_bao', name: 'Thanh Hư Đạo Bào' },
        artifact: { id: 'thanh_hu_ngoc_lo', name: 'Thanh Hư Ngọc Lộ' }
    },
    'cu_kiem_mon': {
        weapon: { id: 'huyen_thiet_trong_kiem', name: 'Huyền Thiết Trọng Kiếm' },
        armor: { id: 'cu_kiem_trong_giap', name: 'Cự Kiếm Trọng Giáp' },
        artifact: { id: 'dia_mach_thiet_thuan', name: 'Địa Mạch Thiết Thuẫn' }
    },
    'hoa_dao_o': {
        weapon: { id: 'cuong_phong_sat_dao', name: 'Cuồng Phong Sát Đao' },
        armor: { id: 'hoa_dao_thiet_y', name: 'Hóa Đao Thiết Y' },
        artifact: { id: 'hoa_dao_linh_sa', name: 'Hóa Đao Linh Sa' }
    },
    'thien_khuyet_bao': {
        weapon: { id: 'kim_luc_trong_kiem', name: 'Kim Lục Trọng Kiếm' },
        armor: { id: 'thien_khuyet_linh_giap', name: 'Thiên Khuyết Linh Giáp' },
        artifact: { id: 'kim_cuong_ho_hoa_phu', name: 'Kim Cương Hộ Hỏa Phù' }
    },
    'quy_linh_mon': {
        weapon: { id: 'quy_linh_sat_dao', name: 'Quỷ Linh Sát Đao' },
        armor: { id: 'quy_linh_ma_y', name: 'Quỷ Linh Ma Y' },
        artifact: { id: 'van_hon_ma_ky', name: 'Vạn Hồn Ma Kỳ' }
    },
    'hop_hoan_tong': {
        weapon: { id: 'hop_hoan_thuan_kiem', name: 'Hợp Hoan Thuần Kiếm' },
        armor: { id: 'hop_hoan_mi_y', name: 'Hợp Hoan Mị Y' },
        artifact: { id: 'phu_dung_tran_ban', name: 'Phù Dung Trận Bàn' }
    },
    'ma_diem_mon': {
        weapon: { id: 'thanh_duong_ma_kiem', name: 'Thanh Dương Ma Kiếm' },
        armor: { id: 'ma_diem_hoa_giap', name: 'Ma Diễm Hỏa Giáp' },
        artifact: { id: 'u_minh_dia_hoa_chau', name: 'U Minh Địa Hỏa Châu' }
    },
    'thien_sat_tong': {
        weapon: { id: 'thien_sat_chien_kich', name: 'Thiên Sát Chiến Kích' },
        armor: { id: 'thien_sat_ma_giap', name: 'Thiên Sát Ma Giáp' },
        artifact: { id: 'sat_khi_linh_phien', name: 'Sát Khí Linh Phiến' }
    },
    'ngu_linh_tong': {
        weapon: { id: 'van_con_tien', name: 'Vạn Côn Tiên' },
        armor: { id: 'ngu_linh_doc_y', name: 'Ngự Linh Độc Y' },
        artifact: { id: 'hap_huyet_trung_tui', name: 'Hấp Huyết Trùng Túi' }
    },
    'khoi_am_tong': {
        weapon: { id: 'khoi_loi_thiet_kiem', name: 'Khôi Lỗi Thiết Kiếm' },
        armor: { id: 'thi_khoi_thiet_giap', name: 'Thi Khôi Thiết Giáp' },
        artifact: { id: 'thiet_giap_khoi_loi', name: 'Thiết Giáp Khôi Lỗi' }
    }
};

const SECT_SKILLS = {
    'thien_kiem_tong': ['SWORD_RAIN', 'GREEN_BAMBOO_SWORD'],
    'hoang_phong_coc': ['QI_BURST', 'SHIELD_UP'],
    'huyen_am_coc': ['SOUL_REPRESS', 'DEVIL_TRANSFORM'],
    'yem_nguyet_tong': ['VIRTUAL_SHADOW', 'QI_BURST'],
    'lac_van_tong': ['GREEN_BAMBOO_SWORD', 'HEAL_TECHNIQUE'],
    'thien_tinh_tong': ['FIVE_ELEMENTS_SHIELD', 'SHIELD_UP'],
    'linh_thu_son': ['BEAST_ROAR', 'QI_BURST'],
    'thanh_hu_mon': ['HEAL_TECHNIQUE', 'FIVE_ELEMENTS_SHIELD'],
    'cu_kiem_mon': ['SWORD_RAIN', 'SHIELD_UP'],
    'hoa_dao_o': ['SWORD_RAIN', 'VIRTUAL_SHADOW'],
    'thien_khuyet_bao': ['SHIELD_UP', 'FIVE_ELEMENTS_SHIELD'],
    'quy_linh_mon': ['SOUL_REPRESS', 'SOUL_DEVOUR'],
    'hop_hoan_tong': ['VIRTUAL_SHADOW', 'SOUL_DEVOUR'],
    'ma_diem_mon': ['BLOOD_SACRIFICE', 'POISON_MIST'],
    'thien_sat_tong': ['BLOOD_SACRIFICE', 'DEVIL_TRANSFORM'],
    'ngu_linh_tong': ['POISON_MIST', 'BEAST_SWALLOW'],
    'khoi_am_tong': ['SOUL_REPRESS', 'SHIELD_UP']
};

export class Enemy {
    get element() {
        if (this.race === 'DEMON') return 'Âm';
        if (this.race === 'DRAGON') return 'Lôi';
        if (this.race === 'GHOST' || this.race === 'ZOMBIE') return 'Âm';
        if (this.name.includes('Lôi') || this.name.includes('Sét')) return 'Lôi';
        if (this.name.includes('Hỏa') || this.name.includes('Lửa')) return 'Hỏa';
        if (this.name.includes('Băng') || this.name.includes('Tuyết')) return 'Băng';
        if (this.name.includes('Thủy') || this.name.includes('Nước')) return 'Thủy';
        if (this.name.includes('Mộc') || this.name.includes('Lục')) return 'Mộc';
        if (this.name.includes('Kim')) return 'Kim';
        if (this.name.includes('Thổ') || this.name.includes('Đá') || this.name.includes('Thạch')) return 'Thổ';

        const elements = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
        return elements[this.realmId % elements.length];
    }

    get level() {
        return this.realmId;
    }

    isRealmConcealed() {
        if (!state || !state.player) return false;

        const playerSense = state.player.divineSense || 50;
        const enemySense = this.divineSense || this.maxThanThuc || this.perception || 50;

        // 1. If enemy has an active concealment technique
        if (this.equippedConcealmentId === 'liem_khi_quyet' || this.equippedConcealmentId === 'quy_nguyen_thu_tuc_cong') {
            const threshold = this.equippedConcealmentId === 'quy_nguyen_thu_tuc_cong' ? 50 : 20;
            if (playerSense < enemySense + threshold) {
                return true;
            }
        }

        // 2. If enemy does NOT have a concealment technique, but their cultivation realm is higher than player's:
        if (this.realmId > state.player.realmId) {
            if (playerSense < enemySense) {
                return true;
            }
        }

        return false;
    }

    getDisplayName() {
        if (this.isRealmConcealed()) {
            const baseName = (this.typeData && this.typeData.name) ? this.typeData.name : 'Vô Danh Đối Thủ';
            return `${baseName} (Tu Vi: ???)`;
        }
        return this.name;
    }

    constructor(realmId, typeData, worldId = 'nhan_gioi') {
        this.realmId = realmId;
        this.race = typeData.race || 'HUMAN';
        this.typeData = typeData;
        this.worldId = worldId;

        const effectiveRealm = (this.worldId && WORLDS[this.worldId]?.maxRealmLimit && this.realmId > WORLDS[this.worldId].maxRealmLimit)
            ? WORLDS[this.worldId].maxRealmLimit
            : this.realmId;

        const realm = getRealmById(this.realmId, 'tuvi', this.race);
        const suppressedRealm = getRealmById(effectiveRealm, 'tuvi', this.race);

        if (this.realmId > effectiveRealm) {
            this.realmName = `${realm.name} -> ${suppressedRealm.name}`;
        } else {
            this.realmName = realm.name;
        }

        this.name = `${typeData.name} (${this.realmName})`;
        this.image = typeData.img;
        this.statMult = typeData.statMult;

        this.inventory = [];
        this.equipment = { weapon: null, armor: null, artifact: null };
        this.skills = [];
        this.sectId = null;

        // Initialize xianxia stats
        let physBonus = 0;
        let dsBonus = 0;
        let compBonus = 0;
        let dtBonus = 0;
        let hdBonus = 0;

        if (this.race === 'DEMON') {
            hdBonus += 15; // Ma tộc dễ bị tâm ma quấy nhiễu
            dsBonus += 5;
        } else if (this.race === 'DRAGON') {
            physBonus += 25; // Long tộc thân thể cường hãn
        } else if (this.race === 'SPIRIT_BEAST') {
            physBonus += 10;
            compBonus -= 5; // Thú tộc ngộ tính kém hơn nhân tộc
        } else if (this.race === 'GHOST') {
            dsBonus += 15; // Quỷ hồn thần thức mạnh
            physBonus -= 15; // Không có thân thể vật lý
        } else if (this.race === 'ZOMBIE') {
            physBonus += 15; // Thi tộc mình đồng da sắt
            dsBonus -= 10; // Mất đi thần trí
        }

        const baseVal = 40 + effectiveRealm * 2;
        const varianceVal = () => Math.floor(Math.random() * 15) - 7;

        this.comprehension = Math.max(5, Math.floor(10 + effectiveRealm * 0.5 + compBonus + (Math.random() * 6 - 3)));
        this.heartDemon = Math.max(0, Math.floor(Math.random() * 20 + hdBonus));
        this.daoTam = Math.max(10, Math.floor(baseVal + dtBonus + varianceVal()));
        this.divineSense = Math.max(10, Math.floor(baseVal + dsBonus + varianceVal()));
        this.physiqueTalent = Math.max(10, Math.floor(baseVal + physBonus + varianceVal()));

        this.calculateStats();
    }

    calculateStats() {
        const raceInfo = RACE_DATA[this.race] || RACE_DATA.HUMAN;
        const raceMults = raceInfo.statMult;

        const effectiveRealm = (this.worldId && WORLDS[this.worldId]?.maxRealmLimit && this.realmId > WORLDS[this.worldId].maxRealmLimit)
            ? WORLDS[this.worldId].maxRealmLimit
            : this.realmId;

        let baseMultiplier = Math.pow(1.8, effectiveRealm - 1) * this.statMult;
        if (this.realmId > effectiveRealm) {
            baseMultiplier *= 1.2; // 1.2x stats bonus for high-realm entity under suppression
        }
        const variance = 0.9 + Math.random() * 0.2;

        // Keep HP & Mana percentage
        const hpPercent = this.maxHp ? (this.hp / this.maxHp) : 1.0;
        const manaPercent = this.maxMana ? (this.mana / this.maxMana) : 1.0;

        // Base values scaled by realm
        let baseHp = 100 * baseMultiplier * raceMults.hp;
        let baseAtk = 10 * baseMultiplier * raceMults.atk;
        let baseDef = 5 * baseMultiplier * raceMults.def;
        let baseSpd = (15 + (effectiveRealm * 5)) * raceMults.spd;
        let baseMana = 50 * baseMultiplier;

        // 1. Simulated Luyện Thể (Body Realm)
        let bodyLevel = 1;
        if (this.race === 'DRAGON' || this.race === 'ZOMBIE') {
            bodyLevel = Math.max(1, Math.floor(effectiveRealm * 1.2));
        } else if (this.race === 'DEMON' || this.race === 'SPIRIT_BEAST') {
            bodyLevel = Math.max(1, Math.floor(effectiveRealm * 1.0));
        } else if (this.race === 'HUMAN') {
            bodyLevel = Math.max(1, Math.floor(effectiveRealm * 0.8));
        }
        const bodyMult = bodyLevel > 0 ? Math.pow(1.2, bodyLevel - 1) : 1.0;
        const bodyHpBonus = 100 * Math.max(0, bodyLevel - 1) * bodyMult;
        const bodyDefBonus = 20 * Math.max(0, bodyLevel - 1) * bodyMult;

        baseHp += bodyHpBonus;
        baseDef += bodyDefBonus;

        // 2. Simulated Thần Hồn (Soul Realm)
        let soulLevel = 1;
        if (this.race === 'GHOST') {
            soulLevel = Math.max(1, Math.floor(effectiveRealm * 1.3));
        } else if (this.race === 'HUMAN' || this.race === 'DEMON') {
            soulLevel = Math.max(1, Math.floor(effectiveRealm * 0.9));
        } else {
            soulLevel = Math.max(1, Math.floor(effectiveRealm * 0.6));
        }
        const soulMult = soulLevel > 0 ? Math.pow(1.15, soulLevel - 1) : 1.0;
        const soulManaBonus = 60 * Math.max(0, soulLevel - 1) * soulMult;
        const soulSpdBonus = 10 * Math.max(0, soulLevel - 1) * soulMult;

        baseMana += soulManaBonus;
        baseSpd += soulSpdBonus;

        // Apply physiqueTalent (căn cốt) just like player
        baseHp *= (1 + (this.physiqueTalent / 200));
        baseDef *= (1 + (this.physiqueTalent / 500));

        // 3. Simulated Công Pháp (Techniques) Multipliers
        const techMult = 1.0 + (effectiveRealm * 0.18) * this.statMult;
        baseHp *= techMult;
        baseAtk *= techMult;
        baseDef *= techMult;
        baseSpd *= (1.0 + (effectiveRealm * 0.03));

        this.maxHp = Math.floor(baseHp * variance);
        this.atk = Math.floor(baseAtk * variance);
        this.def = Math.floor(baseDef * variance);
        this.spd = Math.floor(baseSpd * variance);
        this.maxMana = Math.floor(baseMana);

        // Apply divineSense (thần thức) just like player to perception
        this.perception = Math.floor(10 + (soulLevel * 5) + (this.divineSense / 5));
        this.perception = Math.round(this.perception * variance);

        this.maxThanThuc = Math.floor(this.divineSense || 50);
        if (this.thanThuc === undefined) {
            this.thanThuc = this.maxThanThuc;
        } else {
            this.thanThuc = Math.min(this.maxThanThuc, this.thanThuc);
        }

        // Initialize Advanced Stats
        this.advancedStats = {
            pierce: 0,
            soulPierce: 0,
            critRate: 0.05,
            weaknessStrikeChance: 0.05,
            critDmg: 1.5,
            fireDmg: 1.0,
            waterDmg: 1.0,
            thunderDmg: 1.0,
            woodDmg: 1.0,
            earthDmg: 1.0,
            windDmg: 1.0,
            metalDmg: 1.0,
            iceDmg: 1.0,
            poisonDmg: 1.0,
            swordDmg: 1.0,
            lifeSteal: 0,
            soulRepress: 0,
            damageReduction: 0,
            allRes: 0,
            techniqueMastery: 1.0
        };

        // Base advanced stats scaled by cultivation realm
        this.advancedStats.critRate += effectiveRealm * 0.01;
        this.advancedStats.weaknessStrikeChance += effectiveRealm * 0.01;
        this.advancedStats.critDmg += effectiveRealm * 0.02;
        this.advancedStats.pierce += effectiveRealm * 0.008;
        this.advancedStats.damageReduction = 1 - (1 / (1 + (bodyLevel * 0.05))); // Match player DR formula

        // Racial advanced stats adjustments
        if (this.race === 'DEMON') {
            this.advancedStats.lifeSteal += 0.05 + effectiveRealm * 0.005;
        } else if (this.race === 'DRAGON') {
            this.advancedStats.damageReduction += 0.1;
            this.advancedStats.thunderDmg += 0.2;
        } else if (this.race === 'SPIRIT_BEAST') {
            this.advancedStats.critRate += 0.03;
            this.advancedStats.weaknessStrikeChance += 0.03;
        } else if (this.race === 'GHOST') {
            this.advancedStats.pierce += 0.05;
        }

        // Apply Heart Demon penalties if high
        if (this.heartDemon > 10) {
            const hdPenalty = 1 - (this.heartDemon / 200);
            this.atk = Math.round(this.atk * hdPenalty);
            this.advancedStats.critRate *= hdPenalty;
            this.advancedStats.weaknessStrikeChance *= hdPenalty;
        }

        // Apply equipment bonuses dynamically (generic loop over stats)
        const equippedItems = [this.equipment.weapon, this.equipment.armor, this.equipment.artifact].filter(Boolean);
        equippedItems.forEach(item => {
            if (!item.stats) return;

            Object.entries(item.stats).forEach(([k, v]) => {
                if (k === 'atk') this.atk += v;
                else if (k === 'def') this.def += v;
                else if (k === 'spd') this.spd += v;
                else if (k === 'hp') this.maxHp += v;
                else if (k === 'mana') this.maxMana += v;
                else if (this.advancedStats.hasOwnProperty(k)) {
                    if (['fireDmg', 'waterDmg', 'thunderDmg', 'poisonDmg', 'qiAbsorb'].includes(k)) {
                        this.advancedStats[k] *= (1 + v);
                    } else {
                        this.advancedStats[k] += v;
                    }
                }
            });
        });

        // 4. Natural Arsenal Scaling for Beasts (who don't wear gear)
        const isHumanoid = ['HUMAN', 'DEMON'].includes(this.race);
        if (!isHumanoid) {
            const gearMult = Math.pow(1.8, effectiveRealm - 1);
            this.atk += Math.round(15 * gearMult * variance);
            this.def += Math.round(10 * gearMult * variance);
            this.maxHp += Math.round(80 * gearMult * variance);
        }

        // Set final HP and Mana keeping percentage
        this.hp = Math.round(this.maxHp * hpPercent);
        this.mana = Math.round(this.maxMana * manaPercent);
    }
}

export class EnemyGenerator {
    static generate(locIdOrRealmId, worldId = null, isBoss = false) {
        const types = [
            { name: 'Yêu Lang', img: ASSETS.enemies.wolf, statMult: 0.8, race: 'SPIRIT_BEAST' },
            { name: 'Hắc Hổ', img: ASSETS.enemies.black_tiger, statMult: 1.0, race: 'SPIRIT_BEAST' },
            { name: 'Tán Tu', img: ASSETS.enemies.rogue_cultivator, statMult: 1.1, race: 'HUMAN' },
            { name: 'Ma Tu', img: ASSETS.enemies.demon_cultivator, statMult: 1.3, race: 'DEMON' },
            { name: 'Lôi Long', img: ASSETS.enemies.dragon, statMult: 2.0, race: 'DRAGON' },
            { name: 'Hành Thi', img: ASSETS.enemies.zombie, statMult: 0.7, race: 'ZOMBIE' },
            { name: 'Quỷ Hồn', img: ASSETS.enemies.ghost, statMult: 0.9, race: 'GHOST' },
            { name: 'Thanh Long', img: ASSETS.enemies.thanh_long, statMult: 2.5, race: 'DRAGON' },
            { name: 'Giao Long', img: ASSETS.enemies.giao_long, statMult: 1.8, race: 'SPIRIT_BEAST' },
            { name: 'Hắc Xà', img: ASSETS.enemies.hac_xa, statMult: 1.4, race: 'SPIRIT_BEAST' },
            { name: 'Hỏa Viêm Thú', img: ASSETS.enemies.hoa_viem, statMult: 1.5, race: 'SPIRIT_BEAST' },
            { name: 'Băng Hùng', img: ASSETS.enemies.bang_hung, statMult: 1.3, race: 'SPIRIT_BEAST' },
            { name: 'Côn Bằng', img: ASSETS.enemies.con_bang, statMult: 2.8, race: 'DRAGON' },
            { name: 'Chu Tước', img: ASSETS.enemies.chu_tuoc, statMult: 2.3, race: 'SPIRIT_BEAST' },
            { name: 'U Minh Mộng Điệp', img: ASSETS.enemies.u_minh_mong_diep, statMult: 1.2, race: 'SPIRIT_BEAST' },
            { name: 'Thất Thái Thiên Long', img: ASSETS.enemies.that_thai_thien_long, statMult: 2.7, race: 'DRAGON' }
        ];

        let targetRealm;
        let finalWorldId = worldId || state?.currentWorldId || 'nhan_gioi';

        if (typeof locIdOrRealmId === 'number') {
            targetRealm = locIdOrRealmId;
        } else if (typeof locIdOrRealmId === 'string') {
            const locId = locIdOrRealmId;
            if (!worldId) {
                finalWorldId = findWorldIdByLocId(locId) || finalWorldId;
            }
            if (isBoss) {
                const range = getLocationRealmRange(finalWorldId, locId);
                targetRealm = range.max;
            } else {
                targetRealm = generateRandomRealm(finalWorldId, locId);
            }
        } else {
            // Fallback
            targetRealm = Math.max(1, (state?.player?.realmId || 1) + Math.floor(Math.random() * 5) - 2);
        }

        const typeData = types[Math.floor(Math.random() * types.length)];
        const enemy = new Enemy(targetRealm, typeData, finalWorldId);

        // Intercept for Sect Guard spawning at Sect Gates or random assignment
        const currentLocId = typeof locIdOrRealmId === 'string' ? locIdOrRealmId : (state?.currentLocId || '');
        const sect = SECTS[currentLocId];
        if (sect && (enemy.race === 'HUMAN' || enemy.race === 'DEMON')) {
            enemy.sectId = sect.id;
            let title = 'Đệ tử Ngoại môn';
            if (targetRealm >= 30) {
                title = 'Trưởng lão';
            } else if (targetRealm >= 15) {
                title = 'Đệ tử Nội môn';
            }
            enemy.name = `${title} ${sect.name} (${enemy.realmName})`;

            // Apply rare scroll loot drop (12% chance)
            if (Math.random() < 0.12) {
                const dropPassive = Math.random() < 0.7;
                const dropItemId = dropPassive ? `item_${currentLocId}_t` : `item_${currentLocId}_s`;
                enemy.inventory.push({ id: dropItemId, quantity: 1 });
            }
        } else if (enemy.race === 'HUMAN' || enemy.race === 'DEMON') {
            const roll = Math.random();
            if (roll < 0.45) {
                const sectKeys = Object.keys(SECTS);
                let possibleSects = [];
                if (enemy.race === 'DEMON') {
                    possibleSects = sectKeys.filter(k => SECTS[k].isDemonic || k === 'huyen_am_coc');
                } else {
                    possibleSects = sectKeys.filter(k => !SECTS[k].isDemonic && k !== 'huyen_am_coc');
                }
                if (possibleSects.length > 0) {
                    const chosenSectId = possibleSects[Math.floor(Math.random() * possibleSects.length)];
                    enemy.sectId = chosenSectId;
                    const chosenSect = SECTS[chosenSectId];

                    let title = 'Đệ tử Ngoại môn';
                    if (targetRealm >= 30) {
                        title = 'Trưởng lão';
                    } else if (targetRealm >= 15) {
                        title = 'Đệ tử Nội môn';
                    }
                    enemy.name = `${title} ${chosenSect.name} - ${typeData.name} (${enemy.realmName})`;
                }
            } else {
                enemy.sectId = null;
                enemy.name = `Tán Tu ${typeData.name} (${enemy.realmName})`;
            }
        }

        // Populate Enemy Inventory & Equipment
        this.populateLoot(enemy);

        return enemy;
    }

    static populateLoot(enemy) {
        const isHumanoid = ['HUMAN', 'DEMON'].includes(enemy.race);

        // Assign concealment technique
        enemy.equippedConcealmentId = null;
        if (enemy.realmId >= 3) {
            const roll = Math.random();
            if (enemy.race === 'GHOST') {
                enemy.equippedConcealmentId = 'liem_khi_quyet';
            } else if (isHumanoid) {
                if (roll < 0.25) {
                    enemy.equippedConcealmentId = 'liem_khi_quyet';
                } else if (roll < 0.35 && enemy.realmId >= 12) {
                    enemy.equippedConcealmentId = 'quy_nguyen_thu_tuc_cong';
                }
            } else if (enemy.race === 'SPIRIT_BEAST' && roll < 0.2) {
                enemy.equippedConcealmentId = 'liem_khi_quyet';
            }
        }

        // Assign escape technique
        enemy.mainEscapeId = null;
        if (enemy.realmId >= 3) {
            const roll = Math.random();
            if (isHumanoid) {
                if (roll < 0.15 && enemy.realmId >= 12) {
                    enemy.mainEscapeId = 'loi_don_thuat';
                } else if (roll < 0.25 && enemy.race === 'DEMON') {
                    enemy.mainEscapeId = 'huyet_don_thuat';
                } else if (roll < 0.4) {
                    enemy.mainEscapeId = 'la_yen_bo';
                }
            } else if (enemy.race === 'DRAGON' || enemy.race === 'GHOST') {
                if (roll < 0.5) {
                    enemy.mainEscapeId = 'loi_don_thuat';
                }
            } else if (enemy.race === 'SPIRIT_BEAST' && roll < 0.3) {
                enemy.mainEscapeId = 'la_yen_bo';
            }
        }

        // 1. Basic Loot (Common for all)
        if (Math.random() < 0.8) {
            enemy.inventory.push({ id: 'ha_pham_linh_thach', quantity: Math.floor(Math.random() * 50 * enemy.realmId) });
        }

        // 2. Race Specific Loot
        if (enemy.race === 'SPIRIT_BEAST') {
            enemy.inventory.push({ id: 'ha_pham_yeu_dan', quantity: 1 });
            if (Math.random() < 0.3) enemy.inventory.push({ id: 'yeu_thu_tinh_huyet', quantity: 1 });
        }

        // 3. Humanoid Equipment & Skills
        if (isHumanoid) {
            // Randomly equip items based on realm (with exponential gearMult scaling)
            const gearMult = Math.pow(1.8, enemy.realmId - 1);
            let weaponData = { id: 'phi_kiem_go', name: 'Phi Kiếm Gỗ' };
            let armorData = { id: 'tho_bo_pham_y', name: 'Áo Vải Tu Sĩ' };
            let artifactData = null;

            if (enemy.realmId >= 10) {
                weaponData = { id: 'thanh_hong_kiem', name: 'Thanh Hồng Kiếm' };
                artifactData = { id: 'ho_tam_kinh', name: 'Hộ Tâm Kính' };
            }

            const useSectGear = enemy.sectId && SECT_GEAR[enemy.sectId] && Math.random() < 0.75;
            if (useSectGear) {
                const sectG = SECT_GEAR[enemy.sectId];
                if (sectG.weapon) weaponData = sectG.weapon;
                if (sectG.armor) armorData = sectG.armor;
                if (sectG.artifact && enemy.realmId >= 8) artifactData = sectG.artifact;
            } else if (!enemy.sectId && Math.random() < 0.6) {
                // Custom random gear for Tán Tu
                const ranWeapons = [
                    { id: 'linh_thiet_kiem', name: 'Linh Thiết Kiếm' },
                    { id: 'thanh_phong_kiem', name: 'Thanh Phong Kiếm' },
                    { id: 'hoa_van_dao', name: 'Hỏa Vân Đao' },
                    { id: 'thuy_nguyet_kiem', name: 'Thủy Nguyệt Kiếm' },
                    { id: 'bang_suong_cham', name: 'Băng Sương Châm' }
                ];
                const ranArmors = [
                    { id: 'linh_thu_bi_y', name: 'Linh Thú Bì Y' },
                    { id: 'kim_ty_phap_y', name: 'Kim Ty Pháp Y' },
                    { id: 'huyen_thiet_giap', name: 'Huyền Thiết Giáp' },
                    { id: 'bat_quai_dao_y', name: 'Bát Quái Đạo Y' }
                ];
                const ranArtifacts = [
                    { id: 'kim_cuong_ho_phu', name: 'Kim Cương Hộ Phù' },
                    { id: 'linh_quang_thuan', name: 'Linh Quang Thuẫn' },
                    { id: 'ho_tam_nguyet_khi', name: 'Hộ Tâm Nguyệt Kính' },
                    { id: 'huyen_loi_chau', name: 'Huyền Lôi Châu' }
                ];

                weaponData = ranWeapons[Math.floor(Math.random() * ranWeapons.length)];
                armorData = ranArmors[Math.floor(Math.random() * ranArmors.length)];
                if (enemy.realmId >= 8) {
                    artifactData = ranArtifacts[Math.floor(Math.random() * ranArtifacts.length)];
                }
            }

            // Assign stats
            enemy.equipment.weapon = {
                id: weaponData.id,
                name: weaponData.name,
                stats: { atk: Math.round((enemy.realmId >= 10 ? 25 : 15) * gearMult) }
            };
            enemy.equipment.armor = {
                id: armorData.id,
                name: armorData.name,
                stats: { def: Math.round(8 * gearMult) }
            };
            if (artifactData) {
                enemy.equipment.artifact = {
                    id: artifactData.id,
                    name: artifactData.name,
                    stats: {
                        def: Math.round(12 * gearMult),
                        hp: Math.round(100 * gearMult)
                    }
                };
            }

            // Skills
            enemy.skills.push('BASIC_ATTACK');
            if (enemy.realmId >= 3) enemy.skills.push('QI_BURST');
            if (enemy.realmId >= 6) enemy.skills.push('SHIELD_UP');

            const useSectSkills = enemy.sectId && SECT_SKILLS[enemy.sectId] && Math.random() < 0.75;
            if (useSectSkills) {
                const sectS = SECT_SKILLS[enemy.sectId];
                if (enemy.realmId >= 8 && sectS[0]) {
                    enemy.skills.push(sectS[0]);
                }
                if (enemy.realmId >= 12 && sectS[1]) {
                    enemy.skills.push(sectS[1]);
                }
                // Fallback to fill up if they don't have enough skills
                if (enemy.realmId >= 10 && !enemy.skills.includes('SWORD_RAIN') && !enemy.skills.includes('SOUL_REPRESS')) {
                    enemy.skills.push(enemy.race === 'DEMON' ? 'SOUL_REPRESS' : 'SWORD_RAIN');
                }
                if (enemy.realmId >= 14 && !enemy.skills.includes('HEAL_TECHNIQUE')) {
                    enemy.skills.push('HEAL_TECHNIQUE');
                }
            } else {
                // Standard/Tán Tu skills
                if (enemy.realmId >= 10) {
                    if (enemy.race === 'DEMON') {
                        enemy.skills.push('BLOOD_SACRIFICE');
                        enemy.skills.push('SOUL_REPRESS');
                    } else {
                        enemy.skills.push('SWORD_RAIN');
                    }
                }
                if (enemy.realmId >= 12) {
                    if (enemy.race === 'DEMON') {
                        enemy.skills.push('DEVIL_TRANSFORM');
                        enemy.skills.push('SOUL_DEVOUR');
                    } else {
                        enemy.skills.push('FIVE_ELEMENTS_SHIELD');
                        enemy.skills.push('GREEN_BAMBOO_SWORD');
                    }
                }
                if (enemy.realmId >= 14) enemy.skills.push('HEAL_TECHNIQUE');
            }

            // Pills (for combat use)
            if (Math.random() < 0.5) enemy.inventory.push({ id: 'hoi_huyet_dan', quantity: 1 });
            if (enemy.realmId >= 10 && Math.random() < 0.3) enemy.inventory.push({ id: 'thanh_tam_dan', quantity: 1 });

            // Offensive items (Talismans)
            if (enemy.realmId >= 3 && Math.random() < 0.4) {
                enemy.inventory.push({ id: 'hoa_cau_phu', quantity: 1 });
            }
        } else {
            // Non-humanoid (Beasts, Dragons, Zombies, Ghosts) Skills allocation
            enemy.skills.push('BASIC_ATTACK');
            if (enemy.race === 'SPIRIT_BEAST' || enemy.race === 'DRAGON') {
                if (enemy.realmId >= 3) enemy.skills.push('BEAST_ROAR');
                if (enemy.realmId >= 8) {
                    if (enemy.name.includes('Lôi') || enemy.race === 'DRAGON') {
                        enemy.skills.push('LIGHTNING_TRIBULATION');
                    } else if (enemy.name.includes('Xà') || enemy.name.includes('Điệp')) {
                        enemy.skills.push('POISON_MIST');
                    } else {
                        enemy.skills.push('QI_BURST');
                    }
                }
                if (enemy.realmId >= 12) {
                    enemy.skills.push('SHIELD_UP');
                    enemy.skills.push('VIRTUAL_SHADOW');
                }
                if (enemy.realmId >= 15) {
                    enemy.skills.push('BEAST_SWALLOW');
                }
            } else if (enemy.race === 'GHOST') {
                enemy.skills.push('SOUL_REPRESS');
                if (enemy.realmId >= 8) enemy.skills.push('QI_BURST');
                if (enemy.realmId >= 12) enemy.skills.push('VIRTUAL_SHADOW');
            } else if (enemy.race === 'ZOMBIE') {
                if (enemy.realmId >= 5) enemy.skills.push('BEAST_ROAR');
                if (enemy.realmId >= 10) enemy.skills.push('SHIELD_UP');
                if (enemy.realmId >= 14) enemy.skills.push('DEVIL_TRANSFORM');
            }
        }

        // 4. Random drops (Storage bag logic)
        if (Math.random() < 0.2) {
            const possibleItems = ['hat_giong_thanh_phuc_thao', 'thanh_phuc_thao', 'ngung_khi_dan', 'tich_coc_dan', 'kim_cuong_phu'];
            const randomItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
            enemy.inventory.push({ id: randomItem, quantity: 1 });
        }

        // Re-calculate stats with equipment
        enemy.calculateStats();
    }
}

