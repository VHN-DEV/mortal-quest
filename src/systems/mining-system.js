import { MINING_NODES, MINING_NODE_GRADES, MINING_ACTIONS } from '../configs/mining-data.js';
import { SPIRIT_STONE_GRADES } from '../configs/spirit-stone-data.js';

/**
 * Hệ thống Khai Khoáng (Mining System)
 * Quản lý việc khai thác tài nguyên và chiếm lĩnh linh mạch.
 */
export class MiningSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        
        // Trạng thái khai khoáng của người chơi
        if (!this.player.miningState) {
            this.player.miningState = {
                occupiedNodes: [], // { nodeId, startTime, lastClaimTime, health }
                discoveredNodes: ['mo_hoang_tho'], // Nodes player has found
                miningExp: 0,
                miningLevel: 1
            };
        }
    }

    /**
     * Khai thác thủ công (Manual Mine)
     * Tiêu tốn stamina để lấy tài nguyên ngay lập tức
     */
    mineManual(nodeId) {
        const node = MINING_NODES.find(n => n.id === nodeId);
        if (!node) return { success: false, msg: "Mỏ không tồn tại." };
        
        if (this.player.realmId < node.requiredRealm) {
            return { success: false, msg: `Cảnh giới của bạn quá thấp để khai thác tại ${node.name}.` };
        }

        const action = MINING_ACTIONS.MINE;
        if (this.player.stamina < action.staminaCost) {
            return { success: false, msg: "Bạn quá mệt mỏi để tiếp tục khai thác." };
        }

        // Thực hiện khai thác
        this.player.stamina -= action.staminaCost;
        const gradeData = MINING_NODE_GRADES[node.grade];
        
        // Tính toán phần thưởng
        const reward = this.calculateRewards(gradeData, 1);
        reward.forEach(item => {
            this.player.inventory.addItem(item.id, item.count);
        });

        this.addMiningExp(action.expGain);
        
        const rewardMsg = reward.map(r => `${r.count}x ${r.id}`).join(', ');
        this.ui?.toast(`Bạn đã khai thác ${node.name} và nhận được: ${rewardMsg}`, 'success');

        return { success: true, rewards: reward };
    }

    /**
     * Chiếm lĩnh linh mạch (Occupy Node)
     * Để nhận tài nguyên thụ động theo thời gian
     */
    occupyNode(nodeId) {
        const node = MINING_NODES.find(n => n.id === nodeId);
        if (!node) return { success: false, msg: "Mỏ không tồn tại." };

        if (this.player.miningState.occupiedNodes.some(on => on.nodeId === nodeId)) {
            return { success: false, msg: "Bạn đã chiếm lĩnh linh mạch này rồi." };
        }

        if (this.player.miningState.occupiedNodes.length >= this.getMaxOccupiedSlots()) {
            return { success: false, msg: "Số lượng linh mạch chiếm lĩnh đã đạt giới hạn." };
        }

        const action = MINING_ACTIONS.OCCUPY;
        if (this.player.stamina < action.staminaCost) {
            return { success: false, msg: "Không đủ thể lực để chiếm lĩnh linh mạch." };
        }

        this.player.stamina -= action.staminaCost;
        
        const now = window.game?.systems.time?.totalMinutes || 0;
        this.player.miningState.occupiedNodes.push({
            nodeId: nodeId,
            startTime: now,
            lastClaimTime: now,
            health: 100 // Tình trạng linh mạch
        });

        this.addMiningExp(action.expGain);
        this.ui?.toast(`Bạn đã chiếm lĩnh thành công ${node.name}. Linh thạch sẽ được tự động tích lũy.`, 'success');
        
        return { success: true };
    }

    /**
     * Thu thập tài nguyên tích lũy (Claim passive resources)
     */
    claimResources(nodeId) {
        const occupied = this.player.miningState.occupiedNodes.find(on => on.nodeId === nodeId);
        if (!occupied) return { success: false, msg: "Bạn không chiếm lĩnh linh mạch này." };

        const node = MINING_NODES.find(n => n.id === nodeId);
        const now = window.game?.systems.time?.totalMinutes || 0;
        const elapsedMinutes = now - occupied.lastClaimTime;

        if (elapsedMinutes < 60) {
            return { success: false, msg: "Tài nguyên chưa tích lũy đủ để thu thập (cần ít nhất 1 giờ game)." };
        }

        const gradeData = MINING_NODE_GRADES[node.grade];
        const hours = Math.floor(elapsedMinutes / 60);
        
        // Tính toán phần thưởng dựa trên thời gian
        const reward = this.calculateRewards(gradeData, hours);
        let success = true;
        reward.forEach(item => {
            if (!this.player.inventory.addItem(item.id, item.count)) {
                success = false;
            }
        });

        if (!success) {
            this.ui?.toast("Túi đồ đã đầy! Một số tài nguyên không thể thu thập.", "warning");
        }

        occupied.lastClaimTime = now - (elapsedMinutes % 60); // Reset time but keep remainder
        
        const rewardMsg = reward.map(r => `${r.count}x ${r.id}`).join(', ');
        this.ui?.toast(`Thu thập thành công từ ${node.name}: ${rewardMsg}`, 'success');

        return { success: true, rewards: reward };
    }

    /**
     * Bỏ chiếm lĩnh (Abandon node)
     */
    abandonNode(nodeId) {
        const index = this.player.miningState.occupiedNodes.findIndex(on => on.nodeId === nodeId);
        if (index === -1) return { success: false, msg: "Bạn không chiếm lĩnh linh mạch này." };

        // Thu thập nốt tài nguyên trước khi bỏ
        this.claimResources(nodeId);
        
        this.player.miningState.occupiedNodes.splice(index, 1);
        this.ui?.toast(`Đã từ bỏ quyền chiếm lĩnh linh mạch.`, 'info');
        return { success: true };
    }

    /**
     * Tính toán phần thưởng dựa trên cấp độ linh mạch và thời gian (giờ)
     */
    calculateRewards(gradeData, hours) {
        const rewards = [];
        const baseAmt = gradeData.baseProduction * hours;
        
        // Linh thạch chính của linh mạch
        const mainStoneId = gradeData.items[0];
        rewards.push({ id: mainStoneId, count: baseAmt });

        // Tỷ lệ xuất hiện linh thạch thuộc tính hoặc cao cấp hơn
        if (gradeData.items.length > 1) {
            for (let i = 1; i < gradeData.items.length; i++) {
                const chance = 0.2 / i; // Giảm dần tỷ lệ cho các vật phẩm hiếm
                const count = Math.floor(baseAmt * chance);
                if (count > 0) {
                    rewards.push({ id: gradeData.items[i], count: count });
                }
            }
        }

        return rewards;
    }

    addMiningExp(exp) {
        this.player.miningState.miningExp += exp;
        const nextLevelExp = this.player.miningState.miningLevel * 1000;
        if (this.player.miningState.miningExp >= nextLevelExp) {
            this.player.miningState.miningLevel++;
            this.player.miningState.miningExp -= nextLevelExp;
            this.ui?.toast(`Cấp độ Khai Khoáng tăng lên cấp ${this.player.miningState.miningLevel}!`, 'success');
        }
    }

    getMaxOccupiedSlots() {
        // Tăng theo cấp độ khai khoáng hoặc cảnh giới
        return 1 + Math.floor(this.player.miningState.miningLevel / 5) + Math.floor(this.player.realmId / 20);
    }

    /**
     * Xử lý sự kiện ngẫu nhiên khi đang chiếm lĩnh (được gọi từ TimeSystem)
     */
    processTimeEvents(minutes) {
        this.player.miningState.occupiedNodes.forEach(occupied => {
            const node = MINING_NODES.find(n => n.id === occupied.nodeId);
            const grade = MINING_NODE_GRADES[node.grade];
            
            // Tỷ lệ xảy ra biến cố (yêu thú tấn công, sập mỏ, tranh đoạt)
            if (Math.random() < (grade.danger * minutes / 1440)) { // danger scale per day
                this.triggerNodeEvent(occupied);
            }
        });
    }

    triggerNodeEvent(occupied) {
        const node = MINING_NODES.find(n => n.id === occupied.nodeId);
        const roll = Math.random();
        
        if (roll < 0.4) {
            this.ui?.toast(`Cảnh báo: Linh mạch ${node.name} đang bị yêu thú quấy phá! Sản lượng giảm sút.`, 'warning');
            occupied.health = Math.max(0, occupied.health - 10);
        } else if (roll < 0.7) {
            this.ui?.toast(`Cảnh báo: Có tu sĩ vãng lai đang dòm ngó linh mạch ${node.name} của bạn!`, 'warning');
            // Có thể dẫn đến chiến đấu nếu người chơi không đến xử lý
        } else {
            this.ui?.toast(`Tin tốt: Linh mạch ${node.name} vừa trải qua một đợt linh khí bùng phát, sản lượng tăng vọt!`, 'success');
            // Thêm trực tiếp tài nguyên
            this.player.inventory.addItem(MINING_NODE_GRADES[node.grade].items[0], 10);
        }
    }
}
