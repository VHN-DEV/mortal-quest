import { getTechniqueById, getSecretTechniqueById, MASTERY_LEVELS } from '../configs/technique-data.js';

export class TechniqueSystem {
    constructor(player) {
        this.player = player;
    }

    /**
     * Tăng độ thuần thục (Mastery) cho công pháp
     * @param {string} techId 
     * @param {number} amount 
     */
    addMastery(techId, amount) {
        const playerTech = this.player.learnedTechniques[techId];
        if (!playerTech) return false;

        playerTech.mastery += amount;
        
        // Cập nhật cấp độ thuần thục (không dùng logic này trực tiếp nhưng để hiển thị)
        const currentMastery = MASTERY_LEVELS.filter(m => playerTech.mastery >= m.threshold).pop();
        playerTech.masteryLevel = currentMastery.name;

        return true;
    }

    /**
     * Đột phá tầng (Stage) của công pháp
     * @param {string} techId 
     */
    breakthroughStage(techId) {
        const playerTech = this.player.learnedTechniques[techId];
        const techData = getTechniqueById(techId);
        if (!playerTech || !techData) return { success: false, msg: "Không tìm thấy công pháp." };

        if (playerTech.stage >= techData.stages) {
            return { success: false, msg: "Công pháp đã đạt đại viên mãn." };
        }

        // Điều kiện đột phá tầng: Cần tiêu tốn Linh Lực hoặc Technique Points
        const cost = playerTech.stage * 1000;
        if (this.player.tuVi < cost) {
            return { success: false, msg: `Cần ${cost} tu vi để đột phá tầng tiếp theo.` };
        }

        this.player.tuVi -= cost;
        playerTech.stage++;
        this.player.calculateStats();

        let msg = `Đột phá thành công! ${techData.name} đạt tầng ${playerTech.stage}.`;
        
        // Kiểm tra thần thông mới
        if (techData.divineAbilities && techData.divineAbilities[playerTech.stage]) {
            const abilityId = techData.divineAbilities[playerTech.stage];
            msg += ` Lĩnh ngộ thần thông mới: ${abilityId}!`;
            // Logic thêm thần thông vào danh sách kỹ năng của player
            this.player.learnSecretTechnique(abilityId);
        }

        return { success: true, msg };
    }

    /**
     * Dung hợp công pháp (Hậu kỳ)
     * @param {string} techId1 
     * @param {string} techId2 
     */
    fuseTechniques(techId1, techId2) {
        // Logic dung hợp phức tạp sẽ được implement sau
        return { success: false, msg: "Hệ thống dung hợp sẽ mở khóa ở cảnh giới cao hơn." };
    }

    /**
     * Sử dụng Bí Pháp trong chiến đấu
     * @param {string} secretId 
     */
    useSecretTechnique(secretId) {
        const secretData = getSecretTechniqueById(secretId);
        if (!secretData) return { success: false, msg: "Không tìm thấy bí pháp." };

        // Kiểm tra cooldown
        const now = Date.now();
        const lastUsed = this.player.secretTechniqueCooldowns[secretId] || 0;
        if (now - lastUsed < secretData.cooldown * 1000) {
            const remaining = Math.ceil((secretData.cooldown * 1000 - (now - lastUsed)) / 1000);
            return { success: false, msg: `Bí pháp đang hồi chiêu (${remaining}s).` };
        }

        // Kiểm tra chi phí
        if (secretData.cost) {
            if (secretData.cost.hp && this.player.hp < this.player.maxHp * secretData.cost.hp) {
                return { success: false, msg: "Khí huyết không đủ để thi triển bí pháp." };
            }
            if (secretData.cost.mana && this.player.mana < secretData.cost.mana) {
                return { success: false, msg: "Linh lực không đủ." };
            }
            if (secretData.cost.lifespan && this.player.age + secretData.cost.lifespan > this.player.maxAge) {
                return { success: false, msg: "Thọ nguyên không đủ để thi triển cấm thuật." };
            }

            // Trừ chi phí
            if (secretData.cost.hp) this.player.hp -= this.player.maxHp * secretData.cost.hp;
            if (secretData.cost.mana) this.player.mana -= secretData.cost.mana;
            if (secretData.cost.lifespan) this.player.age += secretData.cost.lifespan;
            if (secretData.cost.permanentAtkReduction) {
                // Implement permanent reduction logic here
                this.player.atk -= secretData.cost.permanentAtkReduction;
                this.player.calculateStats();
            }
        }

        // Cập nhật cooldown
        this.player.secretTechniqueCooldowns[secretId] = now;

        return { success: true, msg: `Thi triển ${secretData.name}!`, effect: secretData.effect };
    }
}
