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

        const techData = getTechniqueById(techId) || (this.player.customTechniques || []).find(t => t.id === techId);
        if (!techData) return false;

        playerTech.mastery += amount;
        
        // Cập nhật cấp độ thuần thục
        let currentMastery = MASTERY_LEVELS.filter(m => playerTech.mastery >= m.threshold).pop();
        playerTech.masteryLevel = currentMastery.id;

        // Nếu đạt Viên Mãn (id >= 4) và chưa đạt tối đa tầng (maxStage)
        if (currentMastery.id >= 4 && playerTech.stage < (techData.maxStage || 10)) {
            // Tự động đột phá lên tầng tiếp theo!
            playerTech.stage++;
            playerTech.mastery = 0; // Reset về Nhập Môn của tầng mới
            playerTech.masteryLevel = 1;

            const stageName = (techData.stageNames && techData.stageNames[playerTech.stage - 1]) 
                ? `: ${techData.stageNames[playerTech.stage - 1]}` 
                : "";

            // Thêm sự kiện đột phá tự động để hệ thống hiển thị thông báo
            this.player.pendingEvents.push({
                type: 'technique_breakthrough',
                msg: `🎉 Cảnh giới tăng vọt! Đạo hữu đã tự động đột phá ${techData.name} lên Tầng ${playerTech.stage}${stageName}!`
            });

            // Kiểm tra tiến hóa công pháp
            this.checkEvolution(techId);

            this.player.calculateStats();
        } else if (playerTech.stage >= (techData.maxStage || 10)) {
            // Nếu đã đạt tầng tối đa, giới hạn độ thuần thục tối đa ở Đại Viên Mãn
            const maxThreshold = MASTERY_LEVELS[MASTERY_LEVELS.length - 1].threshold; // 40000
            if (playerTech.mastery >= maxThreshold) {
                playerTech.mastery = maxThreshold;
                playerTech.masteryLevel = 5; // Đại Viên Mãn
            }
        }

        return true;
    }

    /**
     * Đột phá tầng (Stage) của công pháp
     * @param {string} techId 
     */
    breakthroughStage(techId) {
        const playerTech = this.player.learnedTechniques.find(t => t.id === techId);
        const techData = getTechniqueById(techId) || (this.player.customTechniques || []).find(t => t.id === techId);
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
            const rootMatches = this.player.spiritualRoot && 
                ((this.player.spiritualRoot.elements && this.player.spiritualRoot.elements.includes(mutation.condition)) || 
                 this.player.spiritualRoot.type.includes(mutation.condition));
            
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
        const techData = getTechniqueById(techId) || (this.player.customTechniques || []).find(t => t.id === techId);
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
                } else if ((this.player.spiritualRoot.quality === 'Tạp' || rootType.includes('Tạp')) && techData.compatibility['Tạp']) {
                    attributeMult = techData.compatibility['Tạp'];
                } else if (this.player.spiritualRoot.id === 'thien_linh_can') {
                    attributeMult = 1.5;
                }
            } else if (techData.element) {
                const rootId = this.player.spiritualRoot.id || '';
                if (rootId === 'thien_linh_can' || 
                    (this.player.spiritualRoot.elements && this.player.spiritualRoot.elements.includes(techData.element))) {
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
     * Tăng độ thuần thục cho Bí Pháp
     */
    addSecretMastery(secretId, amount) {
        const secret = this.player.learnedSecretTechniques.find(s => s.id === secretId);
        if (!secret) return false;

        secret.mastery += amount;
        const currentMastery = MASTERY_LEVELS.filter(m => secret.mastery >= m.threshold).pop();
        
        if (currentMastery.id > secret.masteryLevel) {
            secret.masteryLevel = currentMastery.id;
            return { leveledUp: true, newLevel: currentMastery.name };
        }
        return { leveledUp: false };
    }

    /**
     * Tu luyện công pháp để tăng độ thuần thục
     * @param {string} techId 
     * @param {boolean} isSecret
     */
    cultivate(techId, isSecret = false) {
        if (this.player.techniquePoints < 1) {
            return { success: false, msg: "Không đủ Điểm Công Pháp." };
        }

        const techData = isSecret ? getSecretTechniqueById(techId) : (getTechniqueById(techId) || (this.player.customTechniques || []).find(t => t.id === techId));
        if (!techData) return { success: false, msg: "Không tìm thấy công pháp." };

        this.player.techniquePoints -= 1;

        // Calculate root match multiplier
        let rootMult = 1.0;
        if (this.player.spiritualRoot && techData.element && techData.element !== 'Neutral') {
            const elName = techData.element;
            let elPct = 0;
            
            if (this.player.spiritualRoot.proportions) {
                elPct = (this.player.spiritualRoot.proportions[elName] || 0) / 100;
            } else if (this.player.spiritualRoot.elements) {
                if (this.player.spiritualRoot.elements.includes(elName)) {
                    elPct = 1.0 / this.player.spiritualRoot.elements.length;
                }
            }
            
            if (elPct > 0) {
                // Compatible: up to 2.5x speed
                rootMult = 1.0 + elPct * 1.5;
            } else {
                // Mismatched: 80% penalty
                rootMult = 0.2;
            }
        }

        // Epiphany (Đốn ngộ) - 2% chance to trigger massive mastery boost
        let epiphanyTriggered = false;
        let baseGain = 10 + Math.floor(Math.random() * 10);
        if (Math.random() < 0.02) {
            epiphanyTriggered = true;
            baseGain = 150 + Math.floor(Math.random() * 250);
        }

        const gain = Math.max(1, Math.floor(baseGain * rootMult));
        
        if (isSecret) {
            const res = this.addSecretMastery(techId, gain);
            let msgPrefix = epiphanyTriggered 
                ? `⚡ [ĐỐN NGỘ] Vạn vật đồng nhất, đạo pháp tự nhiên! Ngươi rơi vào trạng thái đốn ngộ! ` 
                : "";
            let msg = res.leveledUp ? `${msgPrefix}Lĩnh ngộ bí pháp tăng tiến! Đạt đến: ${res.newLevel}` : `${msgPrefix}Lĩnh ngộ bí pháp tăng thêm ${gain} điểm.`;
            if (rootMult > 1.2 && !epiphanyTriggered) {
                msg += ` (Linh căn tương hợp cực kỳ tốt! +${Math.round((rootMult - 1) * 100)}% tốc độ)`;
            } else if (rootMult < 0.5 && !epiphanyTriggered) {
                msg += ` (Linh căn bất tương hợp! Bị giảm ${Math.round((1 - rootMult) * 100)}% tốc độ)`;
            }
            return { success: true, msg };
        } else {
            this.addMastery(techId, gain);
            let msgPrefix = epiphanyTriggered 
                ? `⚡ [ĐỐN NGỘ] Linh quang bỗng hiện, đại triệt đại ngộ! Ngươi rơi vào trạng thái đốn ngộ! ` 
                : "";
            let msg = `${msgPrefix}Tu luyện thành công! Nhận ${gain} điểm thuần thục.`;
            if (rootMult > 1.2 && !epiphanyTriggered) {
                msg += ` (Linh căn tương hợp cực kỳ tốt! +${Math.round((rootMult - 1) * 100)}% tốc độ)`;
            } else if (rootMult < 0.5 && !epiphanyTriggered) {
                msg += ` (Linh căn bất tương hợp! Bị giảm ${Math.round((1 - rootMult) * 100)}% tốc độ)`;
            }
            return { success: true, msg };
        }
    }

    /**
     * Tự sáng tạo công pháp (Custom scripture creation)
     * @param {string} name Tên công pháp
     * @param {string} element Thuộc tính ngũ hành
     * @param {object} chosenStats Chỉ số lựa chọn cộng thêm
     * @param {object} chosenEffects Hiệu ứng lựa chọn
     */
    createCustomTechnique(name, element, chosenStats, chosenEffects) {
        if (!name || name.trim() === '') {
            return { success: false, msg: "Tên công pháp không được để trống." };
        }
        
        const costTuVi = 50000;
        const costTP = 100;
        if (this.player.tuVi < costTuVi) {
            return { success: false, msg: `Cần ${costTuVi} tu vi để tự sáng tạo công pháp.` };
        }
        if (this.player.techniquePoints < costTP) {
            return { success: false, msg: `Cần ${costTP} Điểm Công Pháp để tự sáng tạo công pháp.` };
        }

        // Deduct cost
        this.player.tuVi -= costTuVi;
        this.player.techniquePoints -= costTP;

        const customId = `custom_tech_${Date.now()}`;
        const newCustomTech = {
            id: customId,
            name: name,
            type: 'linh_luc',
            element: element || 'Neutral',
            quality: 'Địa Giai',
            description: `Công pháp chí cao do chính ${this.player.name} khai tông sáng lập, tích lũy thiên địa chi lực.`,
            maxStage: 9,
            stageLabel: 'Tầng',
            stats: chosenStats || { atk: 150, hp: 500 },
            effects: chosenEffects || { tvps: 3.0, swordDmg: 1.15 }
        };

        // Initialize customTechniques if not exists
        if (!this.player.customTechniques) this.player.customTechniques = [];
        this.player.customTechniques.push(newCustomTech);

        // Learn the technique
        this.player.learnedTechniques.push({
            id: customId,
            stage: 1,
            mastery: 0,
            masteryLevel: 1, // 1: Nhập Môn
            quality: { id: 'DIA_GIAI', name: 'Địa Giai', multiplier: 2.5 }
        });

        this.player.calculateStats();
        return {
            success: true,
            msg: `🎉 [ĐẠI THÀNH CÔNG] Chúc mừng đạo hữu! Đã tự sáng lập ra công pháp riêng biệt mang tên: "${name}"!`,
            techId: customId
        };
    }
}
