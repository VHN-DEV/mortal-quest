import { SECTS, SECT_RANKS, GRANDMASTER_REWARDS } from '../configs/sect-data.js';
import { getRealmById } from '../configs/realm-data.js';
import { EnemyGenerator } from '../core/enemy.js';
import { getItemById } from '../configs/item-data.js';
import { NPCAI } from './npc-ai.js';

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

        // 3 types: collect, kill, interact
        const missions = [];
        
        // Use time to make sure they refresh daily
        const currentDay = window.game && window.game.systems && window.game.systems.time ? window.game.systems.time.totalDays : 0;
        
        // Seeded random for consistent daily missions
        const seed = currentDay * 100 + rank.rankScore;
        const random = () => {
            let x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        const generateCollectMission = () => {
            const items = ['linh_thao', 'huyen_thi_thao', 'bang_linh_qua', 'linh_thach_trung', 'tinh_thiet'];
            const item = items[Math.floor(random() * items.length)];
            const itemData = getItemById('item_' + item) || { name: item };
            const req = 5 + Math.floor(random() * 10) * (rank.rankScore + 1);
            
            return {
                id: 'm_col_' + seed,
                type: 'collect',
                target: 'item_' + item,
                targetName: itemData.name,
                required: req,
                desc: `Thu thập ${req} ${itemData.name} nộp cho Chấp Sự Đường.`,
                reward: { contribution: 10 + req * 2, lingShi: 50 + req * 5 },
                difficulty: 'Dễ'
            };
        };

        const generateKillMission = () => {
            const req = 10 + Math.floor(random() * 20);
            return {
                id: 'm_kill_' + seed,
                type: 'kill',
                target: 'yêu thú',
                required: req,
                desc: `Tiêu diệt ${req} yêu thú quanh khu vực Tông Môn để bảo vệ linh mạch.`,
                reward: { contribution: 20 + req * 3, tuVi: 100 + req * 20 },
                difficulty: 'Trung bình'
            };
        };
        
        const generateBossMission = () => {
            return {
                id: 'm_boss_' + seed,
                type: 'boss',
                target: 'Ma Tu Tà Ác',
                required: 1,
                desc: `Truy sát một tên tà tu phản trắc đang lẩn trốn.`,
                reward: { contribution: 100 * (rank.rankScore + 1), lingShi: 500 * (rank.rankScore + 1) },
                difficulty: 'Khó'
            };
        };

        missions.push(generateCollectMission());
        missions.push(generateKillMission());
        if (rank.rankScore >= 1) missions.push(generateCollectMission()); // Extra for Noi Mon+
        if (rank.rankScore >= 2) missions.push(generateBossMission()); // Boss for Chan Truyen+

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
        this.player.activeSectMissions.forEach(m => {
            if (m.type === type) {
                if (type === 'kill') {
                    m.current += amount;
                    updated = true;
                } else if (type === 'boss' && m.target === target) {
                    m.current += amount;
                    updated = true;
                }
                // collect is evaluated at complete time
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

        this.player.activeSectMissions.splice(missionIdx, 1);
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
            { id: 'item_truc_co_dan', price: 200, type: 'contribution', minRankScore: 0 },
            { id: 'item_ngung_khi_dan', price: 50, type: 'contribution', minRankScore: 0 },
            { id: 'tech_kiem_quyet', name: 'Kiếm Quyết Cơ Bản', price: 500, type: 'contribution', minRankScore: 0, isTech: true },
            { id: 'item_ket_dan_dan', price: 1500, type: 'contribution', minRankScore: 1 },
            { id: 'tech_thuong_thien_kiem', name: 'Thượng Thiên Kiếm Khí', price: 2000, type: 'contribution', minRankScore: 1, isTech: true },
            { id: 'item_nguyen_anh_dan', price: 8000, type: 'contribution', minRankScore: 2 },
            { id: 'tech_van_kiem_quyet', name: 'Vạn Kiếm Quy Tông', price: 10000, type: 'contribution', minRankScore: 2, isTech: true },
            { id: 'item_hoa_than_dan', price: 25000, type: 'contribution', minRankScore: 3 },
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
                const enemy = EnemyGenerator.generate(enemyRealm);
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
            if (this.player.learnedTechniques.includes(itemId) || this.player.learnedSecretTechniques.includes(itemId)) {
                this.ui.toast("Ngươi đã học qua công pháp này rồi!", "warning");
                return;
            }
            this.player.sectContribution -= price;
            // Add as a learned technique - we simulate basic learning
            this.player.learnedSecretTechniques.push(itemId);
            this.ui.toast(`Lĩnh ngộ thành công bí kíp: ${itemName}!`, "success");
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
        
        const enemy = EnemyGenerator.generate(opponentRealm);
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
