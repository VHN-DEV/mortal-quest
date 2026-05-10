import { getTechniqueById, getSecretTechniqueById, MASTERY_LEVELS, TECHNIQUE_LEVELS } from '../configs/technique-data.js';

export class TechniqueSystem {
    constructor(player) {
        this.player = player;
    }

    /**
     * Lấy thông tin cấp độ thuần thục dựa trên điểm
     * @param {number} mastery 
     */
    getMasteryLevel(mastery) {
        return MASTERY_LEVELS.filter(m => mastery >= m.threshold).pop() || MASTERY_LEVELS[0];
    }

    /**
     * Tăng độ thuần thục (Mastery) cho công pháp
     * @param {string} techId 
     * @param {number} amount 
     */
    addMastery(techId, amount) {
        const playerTech = this.player.learnedTechniques.find(t => t.id === techId);
        if (!playerTech) return false;

        playerTech.mastery += amount;
        
        // Cập nhật cấp độ thuần thục
        const currentMastery = MASTERY_LEVELS.filter(m => playerTech.mastery >= m.threshold).pop();
        playerTech.masteryLevel = currentMastery.name;

        // Kiểm tra tiến hóa nếu đạt Viên Mãn
        if (currentMastery.name === 'Viên Mãn') {
            this.checkEvolution(techId);
        }

        return true;
    }

    /**
     * Đột phá tầng (Stage) của công pháp
     * @param {string} techId 
     */
    breakthroughStage(techId) {
        const playerTech = this.player.learnedTechniques.find(t => t.id === techId);
        const techData = getTechniqueById(techId);
        if (!playerTech || !techData) return { success: false, msg: "Không tìm thấy công pháp." };

        if (playerTech.stage >= techData.maxStage) {
            return { success: false, msg: "Công pháp đã đạt đại viên mãn." };
        }

        // Điều kiện đột phá tầng: Cần tiêu tốn Linh Lực hoặc Technique Points
        const cost = playerTech.stage * 1000;
        if (this.player.tuVi < cost) {
            return { success: false, msg: `Cần ${cost} tu vi để đột phá tầng tiếp theo.` };
        }

        this.player.tuVi -= cost;
        playerTech.stage++;
        
        // Kiểm tra biến dị (Mutation) khi đột phá
        const mutationResult = this.checkMutation(techId);
        
        this.player.calculateStats();

        const stageName = (techData.stageNames && techData.stageNames[playerTech.stage - 1]) 
            ? `: ${techData.stageNames[playerTech.stage - 1]}` 
            : "";
            
        let msg = `Đột phá thành công! ${techData.name} đạt tầng ${playerTech.stage}${stageName}.`;
        
        if (mutationResult.mutated) {
            msg = `Kinh ngạc! Trong quá trình đột phá, ${techData.name} đã biến dị thành ${mutationResult.newName}!`;
        }

        // Kiểm tra thần thông mới
        if (techData.divineAbilities && techData.divineAbilities[playerTech.stage]) {
            const abilityId = techData.divineAbilities[playerTech.stage];
            msg += ` Lĩnh ngộ thần thông mới: ${abilityId}!`;
            this.player.learnSecretTechnique(abilityId);
        }

        return { success: true, msg };
    }

    /**
     * Kiểm tra biến dị công pháp
     * @param {string} techId 
     */
    checkMutation(techId) {
        const techData = getTechniqueById(techId);
        if (!techData || !techData.mutations) return { mutated: false };

        for (const mutation of techData.mutations) {
            // Kiểm tra điều kiện (thường là linh căn)
            const rootMatches = this.player.spiritualRoot && this.player.spiritualRoot.type.includes(mutation.condition);
            
            if (rootMatches && Math.random() < mutation.chance) {
                const newTechData = getTechniqueById(mutation.id);
                if (newTechData) {
                    // Thực hiện biến dị: Thay thế công pháp cũ bằng công pháp mới
                    const playerTech = this.player.learnedTechniques.find(t => t.id === techId);
                    const oldStage = playerTech.stage;
                    const oldMastery = playerTech.mastery;
                    
                    // Xóa công pháp cũ
                    this.player.learnedTechniques = this.player.learnedTechniques.filter(t => t.id !== techId);
                    
                    // Thêm công pháp mới
                    this.player.learnTechnique(mutation.id, playerTech.quality.id || 'BINH_THUONG');
                    const newPlayerTech = this.player.learnedTechniques.find(t => t.id === mutation.id);
                    newPlayerTech.stage = oldStage;
                    newPlayerTech.mastery = oldMastery;
                    
                    // Cập nhật main technique nếu cần
                    if (this.player.mainTechniqueId === techId) this.player.mainTechniqueId = mutation.id;
                    if (this.player.mainBodyTechniqueId === techId) this.player.mainBodyTechniqueId = mutation.id;
                    if (this.player.mainSoulTechniqueId === techId) this.player.mainSoulTechniqueId = mutation.id;
                    
                    return { mutated: true, newId: mutation.id, newName: newTechData.name };
                }
            }
        }
        return { mutated: false };
    }

    /**
     * Kiểm tra tiến hóa công pháp
     * @param {string} techId 
     */
    checkEvolution(techId) {
        const techData = getTechniqueById(techId);
        if (!techData || !techData.evolution) return false;

        const playerTech = this.player.learnedTechniques.find(t => t.id === techId);
        const mastery = this.getMasteryLevel(playerTech.mastery);

        if (mastery.name === techData.evolution.condition) {
            const evoId = techData.evolution.id;
            const evoData = getTechniqueById(evoId);
            
            if (evoData) {
                // Tiến hóa!
                const oldStage = playerTech.stage;
                const oldMastery = playerTech.mastery;
                const oldQuality = playerTech.quality;

                // Thay thế
                this.player.learnedTechniques = this.player.learnedTechniques.filter(t => t.id !== techId);
                this.player.learnTechnique(evoId, 'BINH_THUONG'); // Evolution techniques usually have their own quality
                
                const newPlayerTech = this.player.learnedTechniques.find(t => t.id === evoId);
                newPlayerTech.stage = 1; // Reset stage or keep? Usually reset for higher tier
                newPlayerTech.mastery = 0; 
                
                if (this.player.mainTechniqueId === techId) this.player.mainTechniqueId = evoId;
                
                this.player.pendingEvents.push({
                    type: 'technique_evolution',
                    msg: `Chúc mừng! Công pháp ${techData.name} đã tiến hóa thành ${evoData.name}!`,
                    oldId: techId,
                    newId: evoId
                });
                
                return true;
            }
        }
        return false;
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

    /**
     * Tính toán chỉ số cộng thêm từ công pháp
     * @param {string} techId 
     */
    calculateBonus(techId) {
        const techData = getTechniqueById(techId);
        const playerTech = this.player.learnedTechniques.find(t => t.id === techId);
        if (!techData || !playerTech) return {};

        const stageMult = 1 + (playerTech.stage - 1) * 0.2;
        const qualityLevel = TECHNIQUE_LEVELS[techData.quality];
        const qualityMult = qualityLevel ? qualityLevel.multiplier : 1.0;
        
        // Attribute matching logic
        let attributeMult = 1.0;
        if (this.player.spiritualRoot) {
            if (techData.compatibility) {
                const rootType = this.player.spiritualRoot.type;
                if (techData.compatibility[rootType]) {
                    attributeMult = techData.compatibility[rootType];
                } else if (rootType.includes('Tạp') && techData.compatibility['Tạp']) {
                    attributeMult = techData.compatibility['Tạp'];
                } else if (rootType === 'Thiên Linh Căn') {
                    attributeMult = 1.5;
                }
            } else if (techData.element) {
                if (this.player.spiritualRoot.type === 'Thiên Linh Căn' || 
                    this.player.spiritualRoot.type.includes(techData.element)) {
                    attributeMult = 1.5;
                }
            }
        }

        const finalMult = stageMult * qualityMult * attributeMult;
        const result = {};
        if (techData.stats) {
            Object.entries(techData.stats).forEach(([stat, val]) => {
                result[stat] = val * finalMult;
            });
        }
        return result;
    }

    /**
     * Tu luyện công pháp để tăng độ thuần thục
     * @param {string} techId 
     */
    cultivate(techId) {
        const playerTech = this.player.learnedTechniques.find(t => t.id === techId);
        if (!playerTech) return { success: false, msg: "Không tìm thấy công pháp." };

        if (this.player.techniquePoints < 1) {
            return { success: false, msg: "Không đủ Điểm Công Pháp." };
        }

        this.player.techniquePoints -= 1;
        this.addMastery(techId, 10 + Math.floor(Math.random() * 10));
        
        return { success: true, msg: "Tu luyện thành công!" };
    }
}
