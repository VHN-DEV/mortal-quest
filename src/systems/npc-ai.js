import { NPC_PERSONALITIES } from '../configs/npc-data.js';

export class NPCAI {
    static evaluateCombat(npc, opponent) {
        const powerDiff = npc.realmId - (opponent.realmId || 1);
        const hpPercent = npc.hp / npc.maxHp;
        
        // Traits influence
        const isArrogant = npc.personalityIds.includes('kieu_ngao');
        const isCrazy = npc.personalityIds.includes('dien_cuong');
        const isCunning = npc.personalityIds.includes('quy_quyet');
        const isCoward = npc.personalityIds.includes('da_nghi'); // Suspicious often leads to cautious/cowardly retreat
        
        // Base decision
        if (powerDiff > 5) return 'ATTACK'; // Much stronger
        if (powerDiff < -5 && !isArrogant && !isCrazy) return 'FLEE'; // Much weaker
        
        // Low health behavior
        if (hpPercent < 0.2) {
            if (isCrazy) return 'BERSERK'; // Fight even harder
            if (isArrogant) return 'ATTACK'; // Won't run
            if (isCunning) return 'SURRENDER'; // Try to trick or beg
            return 'FLEE';
        }
        
        // Relationship impact
        if (npc.relationship <= -80) return 'ATTACK';
        if (npc.relationship >= 50) return 'SUPPORT';
        
        return 'IDLE';
    }

    static evaluateTrade(npc, player, itemPrice) {
        const isGreedy = npc.personalityIds.includes('tham_lam');
        const isCunning = npc.personalityIds.includes('quy_quyet');
        const favorability = npc.relationship;
        
        let finalPrice = itemPrice;
        
        // Greed increases price
        if (isGreedy) finalPrice *= 1.3;
        
        // Favorability decreases price
        if (favorability > 50) finalPrice *= 0.8;
        if (favorability > 80) finalPrice *= 0.6;
        
        // Cunning might try to scam (not implemented yet, but could be a chance)
        
        return Math.floor(finalPrice);
    }

    static decideSocialAction(npc, player) {
        const favorability = npc.relationship;
        const isArrogant = npc.personalityIds.includes('kieu_ngao');
        const isKind = npc.personalityIds.includes('hoa_nha');
        
        if (favorability > 80) {
            if (npc.specialRelation === 'dao_lu') return 'SONG_TU';
            return 'INVITE_PARTY';
        }
        
        if (favorability > 50 && isKind) return 'GIVE_GIFT';
        
        if (favorability < -50) {
            if (isArrogant) return 'CHALLENGE';
            return 'THREATEN';
        }
        
        return 'TALK';
    }

    static decideMovement(npc, currentWorldLocations) {
        if (!currentWorldLocations || currentWorldLocations.length === 0) return null;
        
        // Vengeance goal has high priority to find the player, but for simplicity, we let them wander or track
        if (npc.goalId === 'bao_thu') {
            // High chance to move to a random location to search
            if (Math.random() < 0.8) {
                return currentWorldLocations[Math.floor(Math.random() * currentWorldLocations.length)].id;
            }
        }
        
        if (npc.goalId === 'thanh_tien') {
            // Move to safe/medium locations
            const safeLocs = currentWorldLocations.filter(l => l.danger === 'an_toan' || l.danger === 'ha_cap');
            if (safeLocs.length > 0 && Math.random() < 0.6) {
                return safeLocs[Math.floor(Math.random() * safeLocs.length)].id;
            }
        }
        
        // Default random movement
        if (Math.random() < 0.3) {
            return currentWorldLocations[Math.floor(Math.random() * currentWorldLocations.length)].id;
        }
        return npc.location; // stay
    }

    static evaluateMapInteraction(npc, player) {
        const favorability = npc.relationship;
        const isArrogant = npc.personalityIds.includes('kieu_ngao');
        const isCrazy = npc.personalityIds.includes('dien_cuong');
        const isGreedy = npc.personalityIds.includes('tham_lam');
        
        // Vengeance
        if (npc.goalId === 'bao_thu' && favorability <= -80) {
            return { action: 'TRUY_SAT', msg: `${npc.name} gầm lên: "Nạp mạng đi! Món nợ máu hôm nay phải trả!"` };
        }
        
        // Positive Actions
        if (favorability > 80 && Math.random() < 0.1) {
            if (npc.specialRelation === 'dao_lu') {
                 return { action: 'SONG_TU', msg: `${npc.name} mỉm cười dịu dàng: "Đạo hữu, tu vi của ta đang gặp bình cảnh, có thể cùng ta song tu không?"` };
            }
            return { action: 'GIFT_HIGH', msg: `${npc.name} tiến đến: "Ta vừa tìm được kỳ ngộ này, tặng cho ngươi!"` };
        }
        if (favorability > 30 && Math.random() < 0.05) {
            return { action: 'GIFT_LOW', msg: `${npc.name} vẫy chào: "Gặp lại đạo hữu, đây là chút tâm ý của ta."` };
        }
        
        // Negative Actions
        if (favorability < 0 && isGreedy && Math.random() < 0.05) {
            return { action: 'AN_TROM', msg: `${npc.name} lén lút tiếp cận túi đồ của bạn...` };
        }
        if ((favorability < -30 || isCrazy || isArrogant) && Math.random() < 0.02) {
             const powerDiff = npc.realmId - player.realmId;
             if (powerDiff > 0) {
                  return { action: 'CUOP_BOC', msg: `${npc.name} chặn đường: "Giao linh thạch ra đây, ta tha mạng cho!"` };
             } else if (isCrazy) {
                  return { action: 'LUAN_BAN', msg: `${npc.name} rút binh khí: "Mau đến đánh một trận phân cao thấp!"` };
             }
        }
        
        return { action: 'NONE' };
    }
}
