import { SECTS, SECT_RANKS, GRANDMASTER_REWARDS } from '../configs/sect-data.js';
import { getRealmById } from '../configs/realm-data.js';
import { EnemyGenerator } from '../core/enemy.js';
import { getItemById } from '../configs/item-data.js';
import { NPCAI } from './npc-ai.js';
import { getTechniqueById, getSecretTechniqueById } from '../configs/technique-data.js';
import { findLocationName, findWorldIdByLocId, getLocationById } from '../configs/map-data.js';

const MISSION_TIERS = {
    0: {
        levelName: 'Phàm Giai',
        collectTargets: [
            { id: 'thanh_phuc_thao', name: 'Linh Thảo Thấp Phẩm', quantityRange: [5, 10] },
            { id: 'hat_giong_thanh_phuc_thao', name: 'Linh Chủng Linh Thảo', quantityRange: [3, 8] }
        ],
        killLocations: [
            { id: 'thanh_nguu_tran', name: 'Thanh Ngưu Trấn' },
            { id: 'that_huyen_mon', name: 'Thất Huyền Môn' },
            { id: null, name: 'Tự tìm' }
        ],
        killQuantityRange: [5, 10],
        rewards: {
            contributionRange: [20, 40],
            lingShiRange: [100, 200],
            tuViRange: [200, 400],
            items: ['ngung_khi_dan', 'tich_coc_dan', 'hoi_huyet_dan'],
            techniques: ['truong_xuan_nap_khi_quyet']
        }
    },
    1: {
        levelName: 'Linh Giai',
        collectTargets: [
            { id: 'tu_lam_hoa', name: 'Linh Thảo Trung Phẩm', quantityRange: [4, 8] },
            { id: 'thap_nien_hoang_tinh_thao', name: 'Linh Thảo 10 năm', quantityRange: [3, 6] }
        ],
        killLocations: [
            { id: 'thai_nhac_son_mach', name: 'Thái Nhạc Sơn Mạch' },
            { id: 'gia_nguyen_thanh', name: 'Gia Nguyên Thành' },
            { id: null, name: 'Tự tìm' }
        ],
        killQuantityRange: [8, 15],
        rewards: {
            contributionRange: [50, 90],
            lingShiRange: [300, 600],
            tuViRange: [600, 1000],
            items: ['truc_co_dan', 'thanh_tam_dan'],
            techniques: ['liet_duong_cong', 'han_thuy_quyet']
        }
    },
    2: {
        levelName: 'Huyền Giai',
        collectTargets: [
            { id: 'bach_nien_uan_co_thao', name: 'Linh Thảo 100 năm', quantityRange: [3, 5] },
            { id: 'hoa_diem_thao', name: 'Hỏa Diễm Thảo', quantityRange: [2, 4] }
        ],
        killLocations: [
            { id: 'thai_nam_coc', name: 'Thái Nam Cốc' },
            { id: 'thien_tinh_tong', name: 'Thiên Tinh Tông' },
            { id: null, name: 'Tự tìm' }
        ],
        killQuantityRange: [12, 18],
        bossTargets: [
            { name: 'Ma Tu Tà Ác', realmId: 15, hp: 15000, atk: 800, def: 400, spd: 40, locations: ['thai_nam_coc', 'thien_tinh_tong'] }
        ],
        rewards: {
            contributionRange: [120, 200],
            lingShiRange: [800, 1500],
            tuViRange: [1500, 2500],
            items: ['ket_dan_dan', 'song_tu_dieu_dan'],
            techniques: ['tech_kiem_quyet', 'tech_thuong_thien_kiem']
        }
    },
    3: {
        levelName: 'Địa Giai',
        collectTargets: [
            { id: 'thien_nien_cuu_khuc_linh_sam', name: 'Linh Thảo 1000 năm', quantityRange: [2, 4] },
            { id: 'u_minh_hoa', name: 'U Minh Hoa', quantityRange: [2, 3] }
        ],
        killLocations: [
            { id: 'huyet_sac_cam_dia', name: 'Huyết Sắc Cấm Địa' },
            { id: 'lac_van_tong', name: 'Lạc Vân Tông' },
            { id: null, name: 'Tự tìm' }
        ],
        killQuantityRange: [15, 22],
        bossTargets: [
            { name: 'Yêu Thú Thủ Lĩnh', realmId: 25, hp: 45000, atk: 2500, def: 1200, spd: 70, locations: ['huyet_sac_cam_dia', 'lac_van_tong'] },
            { name: 'Ma Tu Trưởng Lão', realmId: 28, hp: 55000, atk: 3200, def: 1500, spd: 80, locations: ['quy_linh_mon', 'ma_diem_mon'] }
        ],
        rewards: {
            contributionRange: [300, 500],
            lingShiRange: [2500, 4500],
            tuViRange: [5000, 8000],
            items: ['nguyen_anh_dan', 'hoa_nguyen_dan'],
            techniques: ['tech_van_kiem_quyet']
        }
    },
    4: {
        levelName: 'Thiên Giai',
        collectTargets: [
            { id: 'van_nien_huyet_linh_chi', name: 'Linh Thảo Vạn Năm', quantityRange: [1, 2] },
            { id: 'tien_tinh', name: 'Tiên Tinh', quantityRange: [2, 4] }
        ],
        killLocations: [
            { id: 'mo_lan_thao_nguyen', name: 'Mộ Lan Thảo Nguyên' },
            { id: 'thien_la_quoc', name: 'Thiên La Quốc' },
            { id: null, name: 'Tự tìm' }
        ],
        killQuantityRange: [20, 30],
        bossTargets: [
            { name: 'Yêu Vương Thượng Cổ', realmId: 35, hp: 120000, atk: 7500, def: 3500, spd: 110, locations: ['mo_lan_thao_nguyen', 'dot_ngot_thanh_dien'] },
            { name: 'Cổ Ma Đầu Vô Tự', realmId: 40, hp: 180000, atk: 11000, def: 5000, spd: 130, locations: ['thien_la_quoc', 'thien_sat_tong'] }
        ],
        rewards: {
            contributionRange: [800, 1500],
            lingShiRange: [8000, 15000],
            tuViRange: [15000, 30000],
            items: ['hoa_than_dan', 'tien_ngoc'],
            techniques: ['tech_thien_dao_phap']
        }
    }
};

export class SectSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
    }

    getSect() {
        if (!this.player || !this.player.sectId) return null;
        return SECTS[this.player.sectId] || null;
    }

    getRank() {
        if (!this.player || !this.player.sectRank) return SECT_RANKS['ngoai_mon'];
        return SECT_RANKS[this.player.sectRank] || SECT_RANKS['ngoai_mon'];
    }

    joinSect(sectId) {
        if (!SECTS[sectId]) return false;
        this.player.sectId = sectId;
        this.player.sectRank = 'ngoai_mon';
        this.player.sectContribution = 0;
        this.player.activeSectMissions = [];
        this.player.sectTournamentYear = -1;
        
        // Remove active missions from old sect if any
        if (this.ui) this.ui.toast(`Gia nhập ${SECTS[sectId].name} thành công! Trở thành Ngoại Môn Đệ Tử.`, "success");
        return true;
    }

    leaveSect() {
        if (!this.player.sectId) return;
        const sect = this.getSect();
        const currentDay = window.game?.systems?.time?.totalDays || 0;

        // Ghi Lệnh Truy Sát 30 ngày
        this.player.sectWanted = {
            sectId: this.player.sectId,
            sectName: sect ? sect.name : 'Tông Môn Cũ',
            expiresDay: currentDay + 30
        };

        this.player.sectId = null;
        this.player.sectRank = 'ngoai_mon';
        this.player.sectContribution = 0;
        this.player.activeSectMissions = [];
        this.player.sectWarStatus = false;

        if (this.ui) {
            this.ui.toast(`Phản Tông Xuất Môn! Lệnh Truy Sát được ban bố — các tu sĩ tông môn cũ sẽ truy sát ngươi trong 30 ngày!`, 'error');
            if (window.game?.systems?.npc) {
                window.game.systems.npc.addNews(`[Tông Môn] ${this.player.name} phản tông xuất môn khỏi ${sect?.name}! Lệnh truy sát được tuyên bố!`);
            }
        }
    }

    checkPromotion() {
        if (!this.player.sectId) return;
        const currentRank = this.getRank();
        
        const rankKeys = Object.keys(SECT_RANKS);
        let nextRankKey = null;
        
        for (let i = 0; i < rankKeys.length; i++) {
            if (rankKeys[i] === this.player.sectRank) {
                if (i + 1 < rankKeys.length) {
                    nextRankKey = rankKeys[i + 1];
                }
                break;
            }
        }

        if (!nextRankKey) return; // Already max rank

        const nextRank = SECT_RANKS[nextRankKey];
        if (this.player.realmId >= nextRank.minRealm && this.player.sectContribution >= nextRank.minContribution) {
            this.player.sectRank = nextRankKey;
            
            // Do not deduct contribution, just require having accumulated it, or deduct it if it costs contribution?
            // Let's deduct 50% of the requirement as "promotion fee"
            this.player.sectContribution -= Math.floor(nextRank.minContribution * 0.5);
            
            if (this.ui) {
                this.ui.alert(
                    `Chúc mừng! Ngươi đã thăng cấp thành ${nextRank.name} của tông môn!`, 
                    "Thăng Cấp Tông Môn"
                );
                
                // Trưởng Lão and up can broadcast news
                if (nextRank.rankScore >= 3 && window.game && window.game.systems && window.game.systems.npc) {
                    window.game.systems.npc.addNews(`[Tông Môn] ${this.player.name} vừa được sắc phong làm ${nextRank.name} tại ${this.getSect().name}!`);
                }
            }
        } else {
            if (this.ui) {
                this.ui.toast(`Chưa đủ điều kiện thăng cấp ${nextRank.name}. Yêu cầu: Cảnh giới ${getRealmById(nextRank.minRealm)?.name || nextRank.minRealm} và ${nextRank.minContribution} Cống hiến.`, "warning");
            }
        }
    }

    generateMissions() {
        const sect = this.getSect();
        if (!sect) return [];
        const rank = this.getRank();
        const rankScore = Math.min(4, rank.rankScore || 0);

        const missions = [];
        const currentDay = window.game && window.game.systems && window.game.systems.time ? window.game.systems.time.totalDays : 0;
        
        let seed = currentDay * 100 + rankScore;
        const random = () => {
            let x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        const tier = MISSION_TIERS[rankScore] || MISSION_TIERS[0];

        const generateCollect = (levelOffset = 0) => {
            const activeRankScore = Math.max(0, rankScore + levelOffset);
            const activeTier = MISSION_TIERS[activeRankScore] || MISSION_TIERS[0];
            const target = activeTier.collectTargets[Math.floor(random() * activeTier.collectTargets.length)];
            const qty = target.quantityRange[0] + Math.floor(random() * (target.quantityRange[1] - target.quantityRange[0] + 1));
            
            const contribution = activeTier.rewards.contributionRange[0] + Math.floor(random() * (activeTier.rewards.contributionRange[1] - activeTier.rewards.contributionRange[0] + 1));
            const lingShi = activeTier.rewards.lingShiRange[0] + Math.floor(random() * (activeTier.rewards.lingShiRange[1] - activeTier.rewards.lingShiRange[0] + 1));
            const tuVi = activeTier.rewards.tuViRange[0] + Math.floor(random() * (activeTier.rewards.tuViRange[1] - activeTier.rewards.tuViRange[0] + 1));
            
            const extraReward = {};
            const rewardRoll = random();
            if (rewardRoll < 0.15) {
                const itemId = activeTier.rewards.items[Math.floor(random() * activeTier.rewards.items.length)];
                extraReward.items = [{ id: itemId, quantity: 1 }];
            } else if (rewardRoll < 0.25) {
                const techId = activeTier.rewards.techniques[Math.floor(random() * activeTier.rewards.techniques.length)];
                extraReward.techniques = [techId];
            }
            
            return {
                id: `m_col_${activeRankScore}_${currentDay}_${Math.floor(random()*100)}`,
                type: 'collect',
                level: activeTier.levelName,
                target: target.id,
                targetName: target.name,
                required: qty,
                desc: `[Nhiệm Vụ ${activeTier.levelName}] Thu thập ${qty} ${target.name} giao cho Chấp Sự Đường.`,
                reward: { contribution, lingShi, tuVi, ...extraReward }
            };
        };

        const generateKill = (levelOffset = 0) => {
            const activeRankScore = Math.max(0, rankScore + levelOffset);
            const activeTier = MISSION_TIERS[activeRankScore] || MISSION_TIERS[0];
            const loc = activeTier.killLocations[Math.floor(random() * activeTier.killLocations.length)];
            const qty = activeTier.killQuantityRange[0] + Math.floor(random() * (activeTier.killQuantityRange[1] - activeTier.killQuantityRange[0] + 1));
            
            const contribution = activeTier.rewards.contributionRange[0] + Math.floor(random() * (activeTier.rewards.contributionRange[1] - activeTier.rewards.contributionRange[0] + 1));
            const lingShi = activeTier.rewards.lingShiRange[0] + Math.floor(random() * (activeTier.rewards.lingShiRange[1] - activeTier.rewards.lingShiRange[0] + 1));
            const tuVi = activeTier.rewards.tuViRange[0] + Math.floor(random() * (activeTier.rewards.tuViRange[1] - activeTier.rewards.tuViRange[0] + 1));
            
            const extraReward = {};
            const rewardRoll = random();
            if (rewardRoll < 0.15) {
                const itemId = activeTier.rewards.items[Math.floor(random() * activeTier.rewards.items.length)];
                extraReward.items = [{ id: itemId, quantity: 1 }];
            } else if (rewardRoll < 0.25) {
                const techId = activeTier.rewards.techniques[Math.floor(random() * activeTier.rewards.techniques.length)];
                extraReward.techniques = [techId];
            }
            
            const locDesc = loc.id ? `tại ${loc.name}` : `ở nơi bất kỳ (Tự tìm)`;
            
            return {
                id: `m_kill_${activeRankScore}_${currentDay}_${Math.floor(random()*100)}`,
                type: 'kill',
                level: activeTier.levelName,
                target: 'yêu thú',
                required: qty,
                locationId: loc.id,
                locationName: loc.name,
                desc: `[Nhiệm Vụ ${activeTier.levelName}] Tiêu diệt ${qty} yêu thú ${locDesc} để giữ vững cương thổ.`,
                reward: { contribution, lingShi, tuVi, ...extraReward }
            };
        };

        const generateBoss = () => {
            const activeTier = MISSION_TIERS[rankScore] || MISSION_TIERS[2];
            if (!activeTier.bossTargets) return null;
            
            const boss = activeTier.bossTargets[Math.floor(random() * activeTier.bossTargets.length)];
            const locId = boss.locations[Math.floor(random() * boss.locations.length)];
            const locName = findLocationName(locId) || locId;
            
            const contribution = Math.floor(activeTier.rewards.contributionRange[1] * 1.5);
            const lingShi = Math.floor(activeTier.rewards.lingShiRange[1] * 1.5);
            const tuVi = Math.floor(activeTier.rewards.tuViRange[1] * 1.5);
            
            const extraReward = {};
            if (random() < 0.5) {
                const itemId = activeTier.rewards.items[Math.floor(random() * activeTier.rewards.items.length)];
                extraReward.items = [{ id: itemId, quantity: 1 }];
            } else {
                const techId = activeTier.rewards.techniques[Math.floor(random() * activeTier.rewards.techniques.length)];
                extraReward.techniques = [techId];
            }
            
            return {
                id: `m_boss_${rankScore}_${currentDay}_${Math.floor(random()*100)}`,
                type: 'boss',
                level: activeTier.levelName,
                target: boss.name,
                targetName: boss.name,
                required: 1,
                locationId: locId,
                locationName: locName,
                bossRealmId: boss.realmId,
                bossStats: { hp: boss.hp, atk: boss.atk, def: boss.def, spd: boss.spd },
                desc: `[Nhiệm Vụ ${activeTier.levelName} - SĂN ĐUỔI] Tìm và tiêu diệt tà đầu ${boss.name} tại ${locName}.`,
                reward: { contribution, lingShi, tuVi, ...extraReward }
            };
        };

        missions.push(generateCollect(0));
        missions.push(generateKill(0));
        
        if (rankScore >= 1) {
            if (random() < 0.5) {
                missions.push(generateCollect(-1));
            } else {
                missions.push(generateKill(-1));
            }
        }
        
        if (rankScore >= 2) {
            const bossMission = generateBoss();
            if (bossMission) missions.push(bossMission);
        }

        return missions;
    }

    acceptMission(mission) {
        if (!this.player.sectId) return;
        if (this.player.activeSectMissions.length >= 3) {
            this.ui.toast("Không thể nhận quá 3 nhiệm vụ cùng lúc!", "error");
            return;
        }
        
        if (this.player.activeSectMissions.find(m => m.id === mission.id)) {
            this.ui.toast("Đã nhận nhiệm vụ này rồi!", "warning");
            return;
        }

        this.player.activeSectMissions.push({ ...mission, current: 0 });
        this.ui.toast(`Đã nhận nhiệm vụ: ${mission.desc}`, "success");
    }
    
    abandonMission(missionId) {
        this.player.activeSectMissions = this.player.activeSectMissions.filter(m => m.id !== missionId);
        this.ui.toast("Đã hủy nhiệm vụ!", "info");
    }

    updateMissionProgress(type, target, amount) {
        if (!this.player.sectId || this.player.activeSectMissions.length === 0) return;
        
        let updated = false;
        const currentLocId = window.state?.currentLocId || '';

        this.player.activeSectMissions.forEach(m => {
            // Check location constraint if specified
            if (m.locationId && m.locationId !== currentLocId) {
                return;
            }

            if (m.type === type) {
                if (type === 'kill') {
                    m.current = Math.min(m.required, m.current + amount);
                    updated = true;
                } else if (type === 'boss' && (m.target === target || target.includes(m.target))) {
                    m.current = Math.min(m.required, m.current + amount);
                    updated = true;
                }
            }
        });
        
        if (updated && this.ui && window.game) {
            window.game.refreshUI();
        }
    }

    completeMission(missionId) {
        const missionIdx = this.player.activeSectMissions.findIndex(m => m.id === missionId);
        if (missionIdx === -1) return;
        
        const mission = this.player.activeSectMissions[missionIdx];
        
        // Verify completion
        if (mission.type === 'collect') {
            const count = this.player.inventory.getItemQuantity(mission.target);
            if (count < mission.required) {
                this.ui.toast(`Chưa thu thập đủ ${mission.required} ${mission.targetName}. Đang có: ${count}`, "error");
                return;
            }
            this.player.inventory.removeItem(mission.target, mission.required);
        } else {
            if (mission.current < mission.required) {
                this.ui.toast(`Nhiệm vụ chưa hoàn thành (${mission.current}/${mission.required})`, "error");
                return;
            }
        }

        // Give rewards
        if (mission.reward.contribution) {
            this.player.sectContribution += mission.reward.contribution;
            this.ui.toast(`+${mission.reward.contribution} Điểm Cống hiến`, "success");
        }
        if (mission.reward.lingShi) {
            this.player.gold = (this.player.gold || 0) + mission.reward.lingShi;
            this.ui.toast(`+${mission.reward.lingShi} Linh Thạch`, "success");
        }
        if (mission.reward.tuVi) {
            this.player.tuVi += mission.reward.tuVi;
            this.ui.toast(`+${mission.reward.tuVi} Tu Vi`, "success");
        }

        // Give extra items
        if (mission.reward.items && mission.reward.items.length > 0) {
            mission.reward.items.forEach(itm => {
                this.player.inventory.addItem(itm.id, itm.quantity || 1);
                const itemData = getItemById(itm.id);
                this.ui.toast(`Nhận được: ${itemData?.name || itm.id} x${itm.quantity || 1}`, "success");
            });
        }

        // Give techniques
        if (mission.reward.techniques && mission.reward.techniques.length > 0) {
            mission.reward.techniques.forEach(techId => {
                const hasLearnedNormal = this.player.learnedTechniques.some(t => t.id === techId);
                const hasLearnedSecret = this.player.learnedSecretTechniques.some(t => t.id === techId);
                if (hasLearnedNormal || hasLearnedSecret) {
                    // Fallback reward since already learned: give a nice pill instead
                    this.player.inventory.addItem('ngung_khi_dan', 2);
                    this.ui.toast(`Nhận được: 2 Ngưng Khí Đan (thay thế Công Pháp đã biết)`, "success");
                    return;
                }

                const isMainTech = !!getTechniqueById(techId);
                if (isMainTech) {
                    this.player.learnTechnique(techId);
                    const techData = getTechniqueById(techId);
                    this.ui.toast(`Đốn ngộ công pháp: ${techData?.name || techId}!`, "success");
                } else if (getSecretTechniqueById(techId)) {
                    this.player.learnSecretTechnique(techId);
                    const techData = getSecretTechniqueById(techId);
                    this.ui.toast(`Đốn ngộ bí thuật: ${techData?.name || techId}!`, "success");
                }
            });
        }

        this.player.activeSectMissions.splice(missionIdx, 1);
    }

    huntMissionTarget(missionId) {
        const mission = this.player.activeSectMissions.find(m => m.id === missionId);
        if (!mission) return;
        
        if (mission.locationId) {
            const currentLocId = window.state?.currentLocId || '';
            if (currentLocId !== mission.locationId) {
                const locName = mission.locationName || mission.locationId;
                this.ui.toast(`Ngươi cần phải đến ${locName} mới có thể săn bắt!`, "warning");
                return;
            }
        }
        
        if (window.game) {
            const worldId = findWorldIdByLocId(window.state.currentLocId);
            const loc = getLocationById(worldId, window.state.currentLocId);
            const enemy = EnemyGenerator.generate(window.state.currentLocId, worldId);
            enemy.race = 'SPIRIT_BEAST';
            enemy.name = `Yêu Thú Chỉ Định (${enemy.realmName})`;
            
            this.ui.toast(`Ngươi phát hiện một con ${enemy.name}!`, "info");
            window.game.startBattle(enemy, null, (win) => {
                if (win) {
                    this.updateMissionProgress('kill', enemy.name, 1);
                    this.ui.toast(`Tiêu diệt yêu thú thành công!`, "success");
                }
            });
        }
    }

    challengeMissionBoss(missionId) {
        const mission = this.player.activeSectMissions.find(m => m.id === missionId);
        if (!mission) return;
        
        if (mission.locationId) {
            const currentLocId = window.state?.currentLocId || '';
            if (currentLocId !== mission.locationId) {
                const locName = mission.locationName || mission.locationId;
                this.ui.toast(`Ngươi cần phải đến ${locName} mới có thể truy sát!`, "warning");
                return;
            }
        }
        
        if (window.game) {
            const worldId = findWorldIdByLocId(window.state?.currentLocId) || window.state?.currentWorldId || 'nhan_gioi';
            const bossRealm = mission.bossRealmId || Math.max(1, this.player.realmId + 1);
            const enemy = EnemyGenerator.generate(bossRealm, worldId, true);
            
            enemy.id = 'sect_mission_boss_' + mission.id;
            enemy.name = `${mission.targetName || mission.target} (${enemy.realmName})`;
            
            if (mission.bossStats) {
                enemy.hp = mission.bossStats.hp;
                enemy.maxHp = mission.bossStats.hp;
                enemy.atk = mission.bossStats.atk;
                enemy.def = mission.bossStats.def;
                enemy.spd = mission.bossStats.spd;
            }
            
            enemy.isBoss = true;
            enemy.inventory = [];
            
            this.ui.toast(`Bắt đầu chiến đấu với ${enemy.name}!`, "info");
            
            window.game.startBattle(enemy, null, (win) => {
                if (win) {
                    this.updateMissionProgress('boss', enemy.name, 1);
                    this.ui.toast(`Chiến thắng! Hãy báo cáo Chấp Sự Đường để hoàn thành nhiệm vụ.`, "success");
                } else {
                    this.ui.toast(`Ngươi đã thất bại trước ${enemy.name}!`, "error");
                }
            });
        }
    }
    
    claimSalary() {
        const currentDay = window.game && window.game.systems && window.game.systems.time ? window.game.systems.time.totalDays : 0;
        
        if (this.player.sectSalaryDay === currentDay) {
            this.ui.toast("Hôm nay đã nhận bổng lộc rồi!", "warning");
            return;
        }
        
        const rank = this.getRank();
        if (rank.salary) {
            this.player.gold = (this.player.gold || 0) + rank.salary;
            this.player.sectSalaryDay = currentDay;
            this.ui.toast(`Nhận thành công bổng lộc ${rank.name}: +${rank.salary} Linh Thạch`, "success");
        }
    }

    getLibraryItems() {
        // Ưu tiên libraryItems riêng của sect, fallback về list chung
        const sect = this.getSect();
        if (sect && sect.libraryItems && sect.libraryItems.length > 0) {
            return sect.libraryItems;
        }
        // Default fallback list
        return [
            { id: 'truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'tech_kiem_quyet', name: 'Kiếm Quyết Cơ Bản', price: 500, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'tech_thuong_thien_kiem', name: 'Thượng Thiên Kiếm Khí', price: 2000, type: 'contribution', minRankScore: 1, isTech: true },
            { id: 'nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'tech_van_kiem_quyet', name: 'Vạn Kiếm Quy Tông', price: 10000, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 },
            { id: 'tech_thien_dao_phap', name: 'Thiên Đạo Vô Vị Pháp', price: 30000, type: 'contribution', minRankScore: 3, isTech: true },
        ];
    }

    getNextRankRequirements() {
        const rankKeys = Object.keys(SECT_RANKS);
        const currentIdx = rankKeys.indexOf(this.player.sectRank || 'ngoai_mon');
        if (currentIdx === -1 || currentIdx >= rankKeys.length - 1) return null;
        const nextRank = SECT_RANKS[rankKeys[currentIdx + 1]];
        const realmProgress = Math.min(1, this.player.realmId / nextRank.minRealm);
        const conProgress = Math.min(1, (this.player.sectContribution || 0) / nextRank.minContribution);
        return {
            rank: nextRank,
            realmProgress,
            conProgress,
            realmMet: this.player.realmId >= nextRank.minRealm,
            conMet: (this.player.sectContribution || 0) >= nextRank.minContribution,
        };
    }

    joinSectWar() {
        if (!this.player.sectId) {
            if (this.ui) this.ui.toast('Cần gia nhập Tông Môn trước!', 'error');
            return;
        }
        const sect = this.getSect();
        const enemies = sect.enemySects || [];
        if (enemies.length === 0) {
            if (this.ui) this.ui.toast('Tông Môn hiện đang trong thời bình, không có chiến sự.', 'info');
            return;
        }
        const enemySectId = enemies[Math.floor(Math.random() * enemies.length)];
        const enemySect = SECTS[enemySectId];
        const enemySectName = enemySect ? enemySect.name : 'Tông Môn Địch';

        if (this.ui) {
            this.ui.confirm(
                `Ngươi muốn xuất chinh chiến đấu chống lại ${enemySectName}? Đây là trận chiến sinh tử vì danh dự tông môn!`,
                'Tông Môn Chiến'
            ).then(confirmed => {
                if (!confirmed) return;
                const currentDay = window.game?.systems?.time?.totalDays || 0;
                this.player.sectWarStatus = true;
                this.player.sectWarExpiresDay = currentDay + 14;

                const enemyRealm = Math.max(1, this.player.realmId + 1);
                const enemy = EnemyGenerator.generate(enemyRealm, window.state?.currentWorldId);
                enemy.name = `Chiến Binh ${enemySectName}`;
                enemy.inventory = [];

                this.ui.toast(`Lao vào trận chiến với ${enemySectName}!`, 'info');
                setTimeout(() => {
                    window.game.startBattle(enemy, null, (isWin) => {
                        if (isWin) {
                            const reward = 300 * (this.getRank().rankScore + 1);
                            this.player.sectContribution += reward;
                            this.ui.toast(`Đại thắng! Tông Môn thưởng +${reward} Cống Hiến và Chiến Công Hiệu!`, 'success');
                            if (window.game?.systems?.npc) {
                                window.game.systems.npc.addNews(`[Chiến Sự] ${this.player.name} đại thắng chiến binh ${enemySectName}, giành vinh quang cho ${sect.name}!`);
                            }
                        } else {
                            this.ui.toast('Bại trận! Rút lui về tông môn dưỡng thương.', 'error');
                        }
                        setTimeout(() => {
                            if (window.game?.screens?.systems) window.game.screens.systems.renderSects();
                        }, 1200);
                    });
                }, 800);
            });
        }
    }

    audienceGrandmaster() {
        if (!this.player.sectId) return;
        const COST = 500; // Cống Hiến để yết kiến
        const currentDay = window.game?.systems?.time?.totalDays || 0;
        const gm = this.player.grandmasterSeclusion;

        // Tính trạng thái bế quan
        if (!gm) {
            this.player.grandmasterSeclusion = { isSecluded: false, releaseDay: currentDay + 30 };
        }

        // Cập nhật trạng thái bế quan theo ngày
        if (currentDay >= this.player.grandmasterSeclusion.releaseDay) {
            this.player.grandmasterSeclusion.isSecluded = false;
        }

        if (this.player.grandmasterSeclusion.isSecluded) {
            const daysLeft = this.player.grandmasterSeclusion.releaseDay - currentDay;
            // Trả phí để vẫn yết kiến trong khi bế quan
            if ((this.player.sectContribution || 0) < COST) {
                if (this.ui) this.ui.toast(`Thái Thượng đang Bế Quan — cần ${COST} Cống Hiến để quấy nhiễu, nhưng ngươi không đủ! (Còn ${daysLeft} ngày mới ra quan)`, 'error');
                return;
            }
            if (this.ui) {
                this.ui.confirm(
                    `Thái Thượng đang Bế Quan (còn ${daysLeft} ngày). Tốn ${COST} Cống Hiến để quấy nhiễu yết kiến?`,
                    'Yết Kiến Thái Thượng'
                ).then(ok => { if (ok) this._grantGrandmasterReward(COST); });
            }
        } else {
            // Đang ra quan — yết kiến miễn phí
            if (this.ui) {
                this.ui.confirm(
                    `Thái Thượng đang ra quan luyện tập. Đây là cơ hội hiếm hoi để yết kiến tầm đạo!`,
                    'Yết Kiến Thái Thượng'
                ).then(ok => {
                    if (ok) {
                        this._grantGrandmasterReward(0);
                        // Sau khi yết kiến, Thái Thượng bế quan 60 ngày nữa
                        this.player.grandmasterSeclusion.isSecluded = true;
                        this.player.grandmasterSeclusion.releaseDay = currentDay + 60;
                    }
                });
            }
        }
    }

    _grantGrandmasterReward(cost) {
        if (cost > 0) this.player.sectContribution -= cost;
        // Weighted random reward
        const rewards = GRANDMASTER_REWARDS;
        const totalWeight = rewards.reduce((s, r) => s + r.weight, 0);
        let roll = Math.random() * totalWeight;
        let chosen = rewards[0];
        for (const r of rewards) {
            roll -= r.weight;
            if (roll <= 0) { chosen = r; break; }
        }
        const resultText = chosen.effect(this.player);
        if (this.ui) {
            this.ui.alert(
                `${chosen.desc}.\n\n✨ Kết quả: ${resultText}`,
                'Ân Huệ Thái Thượng'
            );
        }
        if (window.game?.systems?.npc) {
            window.game.systems.npc.addNews(`[Tông Môn] ${this.player.name} được Thái Thượng yết kiến ban thưởng đặc ân!`);
        }
        this.player.grandmasterSeclusion.isSecluded = true;
        const currentDay = window.game?.systems?.time?.totalDays || 0;
        this.player.grandmasterSeclusion.releaseDay = currentDay + 60;
    }

    buyLibraryItem(itemId, price, isTech, itemName) {
        if (!this.player.sectId) return;
        
        if (this.player.sectContribution < price) {
            this.ui.toast("Không đủ điểm cống hiến!", "error");
            return;
        }

        if (isTech) {
            // Check if already learned correctly by scanning object array
            const hasLearnedNormal = this.player.learnedTechniques.some(t => t.id === itemId);
            const hasLearnedSecret = this.player.learnedSecretTechniques.some(t => t.id === itemId);
            if (hasLearnedNormal || hasLearnedSecret) {
                this.ui.toast("Ngươi đã học qua công pháp này rồi!", "warning");
                return;
            }
            
            // Check if it's a main technique or secret technique
            const isMainTech = !!getTechniqueById(itemId);
            if (isMainTech) {
                this.player.sectContribution -= price;
                this.player.learnTechnique(itemId);
                this.ui.toast(`Lĩnh ngộ thành công công pháp: ${itemName}!`, "success");
            } else if (getSecretTechniqueById(itemId)) {
                this.player.sectContribution -= price;
                this.player.learnSecretTechnique(itemId);
                this.ui.toast(`Lĩnh ngộ thành công bí thuật: ${itemName}!`, "success");
            } else {
                this.ui.toast("Bí tịch này thất truyền hoặc không thể tu luyện!", "error");
            }
        } else {
            this.player.sectContribution -= price;
            this.player.inventory.addItem(itemId, 1);
            this.ui.toast(`Trao đổi thành công 1 ${getItemById(itemId)?.name || itemId}!`, "success");
        }
    }
    
    startTournament() {
        if (!this.player.sectId) {
            this.ui.toast("Cần gia nhập Tông Môn để tham gia Đại Tỷ!", "error");
            return;
        }
        
        const currentYear = window.game && window.game.systems && window.game.systems.time ? window.game.systems.time.year : 0;
        
        if (this.player.sectTournamentYear === currentYear) {
            this.ui.toast("Đại Tỷ Tông Môn mỗi năm chỉ tổ chức 1 lần. Hãy quay lại vào năm sau!", "warning");
            return;
        }

        if (this.player.hp < this.player.maxHp * 0.3) {
            this.ui.toast("Trạng thái quá kém, không thể bước lên lôi đài!", "error");
            return;
        }
        
        const rank = this.getRank();
        
        this.ui.confirm(
            `Đăng ký tham gia Đại Tỷ Tông Môn dành cho ${rank.name}? Ngươi sẽ phải đánh 3 trận liên tiếp. Thắng lợi sẽ nhận thưởng phong hậu!`, 
            "Đại Tỷ Tông Môn"
        ).then(confirmed => {
            if (!confirmed) return;
            
            this.player.sectTournamentYear = currentYear;
            
            // Set up a tournament run in player state
            this.player.tournamentState = {
                currentRound: 1,
                maxRounds: 3,
                rankScore: rank.rankScore,
                rankName: rank.name
            };
            
            this.startTournamentRound();
        });
    }
    
    startTournamentRound() {
        const tState = this.player.tournamentState;
        if (!tState) return;
        
        if (tState.currentRound > tState.maxRounds) {
            // Tournament Won
            this.ui.alert(`Ngươi đã đánh bại toàn bộ đối thủ trong Đại Tỷ và bước lên đỉnh cao của ${tState.rankName}!`, "Quán Quân Đại Tỷ");
            
            // Rewards based on rank
            const rewardTuVi = 1000 * Math.pow(2, tState.rankScore);
            const rewardCongHien = 500 * (tState.rankScore + 1);
            
            this.player.tuVi += rewardTuVi;
            this.player.sectContribution += rewardCongHien;
            
            this.ui.toast(`Thưởng Quán Quân: +${rewardTuVi} Tu Vi, +${rewardCongHien} Cống Hiến!`, "success");
            
            // Auto check promotion after win
            this.checkPromotion();
            
            delete this.player.tournamentState;
            
            setTimeout(() => {
                if (window.game) {
                    state.ui.toggleOverlay(document.getElementById('sects-overlay'), true);
                    window.game.screens.systems.renderSects();
                }
            }, 1000);
            return;
        }
        
        // Generate opponent based on player's rank/realm
        // Opponents get slightly stronger each round
        let opponentRealm = this.player.realmId + (tState.currentRound - 2); 
        if (opponentRealm < 1) opponentRealm = 1;
        
        const enemy = EnemyGenerator.generate(opponentRealm, window.state?.currentWorldId);
        enemy.name = `Đồng Môn Sư ${tState.currentRound === 3 ? 'Huynh' : 'Đệ'}`;
        enemy.inventory = []; // No normal loot
        
        this.ui.toast(`Bắt đầu trận thứ ${tState.currentRound}: Chạm trán ${enemy.name}!`, "info");
        
        setTimeout(() => {
            state.ui.toggleOverlay(document.getElementById('sects-overlay'), false);
            
            window.game.startBattle(enemy, null, (isWin) => {
                if (isWin) {
                    tState.currentRound++;
                    // Restore 30% HP between matches as "Sect healing"
                    this.player.hp = Math.min(this.player.maxHp, this.player.hp + this.player.maxHp * 0.3);
                    this.startTournamentRound();
                } else {
                    this.ui.toast("Bị loại khỏi Đại Tỷ Tông Môn! Cố gắng tu luyện thêm.", "error");
                    delete this.player.tournamentState;
                    setTimeout(() => {
                        state.ui.toggleOverlay(document.getElementById('sects-overlay'), true);
                        window.game.screens.systems.renderSects();
                    }, 1500);
                }
            });
        }, 1500);
    }
}
