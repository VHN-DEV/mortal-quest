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
}
