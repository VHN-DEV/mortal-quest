import { NPC_TEMPLATES, NPC_PERSONALITIES, NPC_GOALS, NPC_RELATIONSHIP_LEVELS, NPC_SPECIAL_RELATIONS, SPECIAL_NPCS } from '../configs/npc-data.js';
import { getRealmById } from '../configs/realm-data.js';
import { CREATION_ROOTS, CREATION_PHYSIQUES } from '../configs/creation-data.js';
import { WORLDS } from '../configs/map-data.js';
import { NPCAI } from './npc-ai.js';

export class NPC {
    constructor(templateId, realmId) {
        const isSpecial = SPECIAL_NPCS && SPECIAL_NPCS[templateId];
        const template = isSpecial ? SPECIAL_NPCS[templateId] : NPC_TEMPLATES[templateId];
        
        this.templateId = templateId;
        this.id = isSpecial ? template.id : Math.random().toString(36).substr(2, 9);
        this.type = isSpecial ? 'special' : template.type;
        this.role = isSpecial ? template.role : template.roles[Math.floor(Math.random() * template.roles.length)];
        this.title = template.title;
        this.name = isSpecial ? template.name : this.generateName();
        this.gender = isSpecial ? template.gender : (Math.random() > 0.5 ? 'Nam' : 'Nữ');
        this.age = isSpecial ? (100 + Math.floor(Math.random() * 200)) : (18 + Math.floor(Math.random() * 100));
        this.portrait = template.portrait;
        
        // Character Traits
        this.personalityIds = isSpecial ? [template.personality] : template.personalities;
        this.goalId = isSpecial ? template.goal : Object.keys(NPC_GOALS)[Math.floor(Math.random() * Object.keys(NPC_GOALS).length)];
        this.daoHeart = isSpecial ? 90 : 50 + Math.floor(Math.random() * 50); // 0-100
        this.luck = isSpecial ? 150 : 50 + Math.floor(Math.random() * 50);
        
        // Cultivation Attributes
        this.realmId = realmId;
        this.tuVi = 0;
        this.rootId = this.generateRoot();
        this.physiqueId = this.generatePhysique();
        
        // Social
        this.relationship = 0; // -100 to 100
        this.specialRelation = null; // 'dao_lu', 'su_do', etc.
        this.memory = []; // List of interactions: { type: 'saved_life', time: 123 }
        this.mood = 'Bình thường';
        
        this.dialogues = template.dialogues;
        this.isSpecial = isSpecial;
        this.desc = isSpecial ? template.desc : '';
        this.isRomanceable = isSpecial ? template.isRomanceable : false;
        
        // Schedule & Location
        this.activity = 'Tu luyện';
        this.currentLocId = null;
        this.currentWorldId = 'nhan_gioi';
        
        // Relatives (Karma System)
        this.relatives = [];
        
        // NPC Inventory for trading
        this.inventory = []; 
        this.lingShi = 0;
        this.generateInitialInventory();

        this.calculateStats();
    }

    generateInitialInventory() {
        // Base lingShi based on realm
        this.lingShi = 100 * Math.pow(2, this.realmId) + Math.floor(Math.random() * 500);

        // Based on type and realm, give some items
        const pills = ['ngung_khi_dan', 'truc_co_dan', 'thuy_tinh_dan'];
        const pillId = pills[Math.min(pills.length - 1, this.realmId - 1)] || 'ngung_khi_dan';
        
        if (this.type === 'thuong_nhan') {
            this.inventory.push({ id: 'ngung_khi_dan', quantity: 15 + Math.floor(Math.random() * 20), price: 150 });
            this.inventory.push({ id: 'truc_co_dan', quantity: 5 + Math.floor(Math.random() * 10), price: 2500 });
            this.inventory.push({ id: 'linh_thach_trung', quantity: 20, price: 100 });
            this.lingShi += 5000;
        } else {
            // Normal NPCs have some pills for cultivation
            this.inventory.push({ id: pillId, quantity: 2 + Math.floor(Math.random() * 5), price: 200 });
            
            // Random chance for a weapon or defensive item
            if (Math.random() > 0.5) {
                this.inventory.push({ id: 'thiet_giap_phu', quantity: 1, price: 500 });
            }
            if (Math.random() > 0.8) {
                this.inventory.push({ id: 'linh_thao_cuc_pham', quantity: 1, price: 1000 });
            }
        }
    }

    generateRoot() {
        const roots = Object.keys(CREATION_ROOTS);
        // Weights: normal roots are more common
        const weights = [5, 10, 20, 30, 20, 15]; // Match CREATION_ROOTS order roughly
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        for (let i = 0; i < roots.length; i++) {
            if (random < weights[i]) return roots[i];
            random -= weights[i];
        }
        return 'tam_linh_can';
    }

    generatePhysique() {
        const physiques = Object.keys(CREATION_PHYSIQUES);
        if (Math.random() > 0.95) {
            return physiques[Math.floor(Math.random() * (physiques.length - 1))];
        }
        return 'bin_thuong';
    }

    calculateStats() {
        const realmMultiplier = Math.pow(1.6, this.realmId - 1);
        
        this.maxHp = 150 * realmMultiplier;
        this.atk = 15 * realmMultiplier;
        this.def = 8 * realmMultiplier;
        this.spd = 10 * realmMultiplier;
        
        // Role adjustments
        if (this.role === 'Tank') { this.maxHp *= 1.6; this.def *= 1.5; this.atk *= 0.8; }
        if (this.role === 'Healer') { this.maxHp *= 0.9; this.atk *= 0.6; this.spd *= 1.1; }
        if (this.role === 'Sword') { this.atk *= 1.4; this.spd *= 1.2; }

        // Supreme Demon adjustments
        if (this.templateId === 'ma_than') {
            this.maxHp *= 5.0;
            this.atk *= 4.0;
            this.def *= 3.0;
            this.spd *= 2.0;
        } else if (this.templateId === 'ma_vuong') {
            this.maxHp *= 3.5;
            this.atk *= 3.0;
            this.def *= 2.5;
            this.spd *= 1.7;
        } else if (this.templateId === 'ma_tuong') {
            this.maxHp *= 2.5;
            this.atk *= 2.0;
            this.def *= 2.0;
            this.spd *= 1.5;
        }
        
        this.hp = this.maxHp;
    }

    simulate(delta, worldTime, npcSystem) {
        if (this.hp <= 0) return; // Dead

        // 1. Cultivation & Item Usage
        let pillBonus = 1.0;
        // Check if NPC has pills to consume
        const pillIndex = this.inventory.findIndex(item => item.id.includes('_dan'));
        if (pillIndex !== -1 && Math.random() < 0.05 * delta) {
            this.inventory[pillIndex].quantity--;
            pillBonus = 2.0; // Double speed for this tick
            if (this.inventory[pillIndex].quantity <= 0) {
                this.inventory.splice(pillIndex, 1);
            }
        }

        const rootMultiplier = CREATION_ROOTS[this.rootId]?.bonus?.tvps || 1;
        const physiqueMultiplier = this.physiqueId !== 'bin_thuong' ? 1.5 : 1.0;
        const moodMultiplier = this.mood === 'Vui vẻ' ? 1.2 : (this.mood === 'U sầu' ? 0.8 : 1.0);
        
        const tuViGain = (this.realmId * 0.8) * rootMultiplier * physiqueMultiplier * moodMultiplier * pillBonus * delta;
        this.tuVi += tuViGain;
        
        // Breakthrough Logic
        const currentRealm = getRealmById(this.realmId);
        if (currentRealm && this.tuVi >= currentRealm.expRequired) {
            // Base chance 50%, up to +30% based on Dao Heart and Luck
            const successChance = 50 + (this.daoHeart / 100) * 15 + (this.luck / 100) * 15;
            const roll = Math.random() * 100;

            if (roll <= successChance) {
                // Success
                this.realmId++;
                this.tuVi = 0;
                this.calculateStats();
                this.mood = 'Vui vẻ';
                if (npcSystem && npcSystem.addNews) {
                    npcSystem.addNews(`[Đột Phá] ${this.name} đã đột phá thành công lên ${getRealmById(this.realmId).name}! Thiên địa dị tượng xuất hiện.`);
                }
            } else {
                // Failure
                this.tuVi = Math.floor(currentRealm.expRequired * 0.5); // Lose 50% exp
                this.mood = 'U sầu';
                
                // Death chance on failure (higher realms have higher death chance)
                const deathChance = this.realmId * 5; 
                const deathRoll = Math.random() * 100;
                
                if (deathRoll <= deathChance) {
                    this.hp = 0; // Died
                    if (npcSystem && npcSystem.addNews) {
                        npcSystem.addNews(`[Vẫn Lạc] ${this.name} trong lúc đột phá ${currentRealm.name} đã bị thiên kiếp đánh nát tàn hồn, thân tử đạo tiêu!`);
                    }
                } else {
                    if (npcSystem && npcSystem.addNews && Math.random() < 0.2) {
                        npcSystem.addNews(`[Thất Bại] ${this.name} trùng kích cảnh giới thất bại, kinh mạch tổn thương nghiêm trọng.`);
                    }
                }
            }
        }

        // 2. Activity / Schedule
        const totalMinutes = worldTime;
        const hour = Math.floor((totalMinutes / 60) % 24);
        
        if (hour >= 6 && hour < 18) {
            this.activity = Math.random() > 0.7 ? 'Giao dịch' : 'Tu luyện';
        } else {
            this.activity = Math.random() > 0.8 ? 'Thăm dò bí cảnh' : 'Bế quan';
        }

        // 3. Natural aging (simplified: 1 year per 1000 delta)
        if (Math.random() < 0.001 * delta) {
            this.age++;
        }
    }

    generateName() {
        if (this.templateId === 'ma_than') {
            return 'Thái Sơ Ma Thần';
        }
        if (this.templateId === 'ma_vuong') {
            return 'Vô Thượng Ma Vương';
        }
        if (this.type === 'ma_binh' || this.templateId === 'ma_binh') {
            const prefixes = ['Hắc Sát', 'Huyết Lang', 'Dạ Xoa', 'U Hồn', 'Thiết Giáp', 'Cửu U', 'Tịch Diệt', 'Huyền Âm'];
            const suffixes = ['Ma Binh', 'Vệ Sĩ', 'Quỷ Binh', 'Ma Tốt', 'Hắc Vệ'];
            return prefixes[Math.floor(Math.random() * prefixes.length)] + ' ' + suffixes[Math.floor(Math.random() * suffixes.length)];
        }
        if (this.type === 'ma_dan' || this.templateId === 'ma_dan') {
            const prefixes = ['U Hồn', 'Dạ Xoa', 'Ma Nhân', 'U Linh', 'Hắc Diện', 'Vong Linh'];
            const givenNames = ['Ma Dân', 'Thôn Dân', 'Trấn Dân', 'Lão Yêu', 'Cô Nương', 'Tiểu Quỷ'];
            return prefixes[Math.floor(Math.random() * prefixes.length)] + ' ' + givenNames[Math.floor(Math.random() * givenNames.length)];
        }

        const surnames = ['Thanh', 'Lâm', 'Diệp', 'Hàn', 'Trần', 'Lý', 'Vương', 'Tiêu', 'Mộ Dung', 'Âu Dương'];
        const givenNames = ['Phong', 'Vân', 'Lôi', 'Lão Ma', 'Tiên Tử', 'Đạo Nhân', 'Minh', 'Nguyệt', 'Thiên', 'Kiếm'];
        return surnames[Math.floor(Math.random() * surnames.length)] + ' ' + givenNames[Math.floor(Math.random() * givenNames.length)];
    }

    addMemory(type) {
        this.memory.push({ type, time: Date.now() });
        // Max 10 memories
        if (this.memory.length > 10) this.memory.shift();
        
        // Impact favorability
        if (type === 'saved_life') this.changeRelationship(30);
        if (type === 'gift_low') this.changeRelationship(5);
        if (type === 'gift_high') this.changeRelationship(20);
        if (type === 'betrayed') this.changeRelationship(-50);
        if (type === 'stole_treasure') this.changeRelationship(-30);
        if (type === 'attacked') this.changeRelationship(-20);
        if (type === 'become_dao_lu') this.changeRelationship(50);
        if (type === 'become_disciple') this.changeRelationship(30);
    }

       generateDialogue(player) {
        if (this.isSpecial && this.dialogues) {
            if (this.relationship >= 80 && this.dialogues.romance && this.isRomanceable) {
                return this.dialogues.romance[Math.floor(Math.random() * this.dialogues.romance.length)];
            }
            if (this.relationship >= 40 && this.dialogues.friendly) {
                return this.dialogues.friendly[Math.floor(Math.random() * this.dialogues.friendly.length)];
            }
            if (this.dialogues.meet) {
                return this.dialogues.meet[Math.floor(Math.random() * this.dialogues.meet.length)];
            }
        }

        const fate = player.fate;
        const fateSys = window.game?.systems?.fate;
        
        if (!fateSys) {
            return "Chào đạo hữu, con đường tu tiên vốn dĩ cô độc, gặp được nhau cũng là một cái duyên.";
        }

        const rep = fateSys.getReputationTier();
        const morality = fateSys.getMoralityScale();

        // 1. Memory priority
        if (this.memory.some(m => m.type === 'saved_life')) {
            return "Đa tạ đạo hữu đã cứu mạng, ân tình này tại hạ khắc cốt ghi tâm. Sau này nếu có việc gì cần, cứ việc phân phó.";
        }
        
        // 2. High Sin reaction (Moral conflict)
        if (fate.sin > 100) {
             if (morality.id.includes('ac') || morality.id === 'ma_dau') {
                  if (this.daoHeart > 70) return `Hừ, sát khí trên người ngươi nồng nặc như vậy, chắc chắn đã làm không ít chuyện thương thiên hại lý! Đạo bất đồng bất tương vi mưu, tránh xa ta ra!`;
                  return `Ha ha, sát khí thật nồng đậm! Đúng là đồng đạo trung nhân, nhìn ngươi ta lại thấy hứng khởi vô cùng. Có muốn cùng ta làm một vố lớn không?`;
             }
        }

        // 3. High Reputation reaction
        if (rep.min >= 10000) {
            return `Hóa ra là danh sĩ ${player.name} danh chấn thiên hạ! Quả nhiên khí độ bất phàm, trăm nghe không bằng một thấy. Tiền bối có gì chỉ giáo cho vãn bối không?`;
        }
        
        // 4. Relationship priority
        if (this.relationship >= 50) return "Gặp lại đạo hữu thật là có duyên, cảm giác như gặp lại cố nhân vậy. Không biết hôm nay đạo hữu có nhã hứng đàm đạo không?";
        if (this.relationship <= -50) return "Cút ngay! Ta không có gì để nói với hạng người như ngươi. Đừng để ta phải ra tay!";
        
        // 5. Default based on player morality
        if (morality.id.includes('thien')) return "Khí độ của đạo hữu thật chính trực, hào quang chính đạo lấp lánh, khiến tại hạ cảm thấy vô cùng tin tưởng. Tu tiên giới đầy rẫy hiểm ác, hiếm có người như ngươi.";
        if (morality.id.includes('ac') || morality.id === 'ma_dau') return "Nhìn ngươi không giống hạng người tốt lành gì, sát khí âm u, tốt nhất đừng có ý đồ xấu với ta. Ta không phải là kẻ dễ bị bắt nạt đâu.";
        
        return "Chào đạo hữu, con đường tu tiên vốn dĩ cô độc, gặp được nhau cũng là một cái duyên. Không biết đạo hữu tìm ta có việc gì?";
    }

    getRelationshipStatus() {
        if (this.specialRelation) {
            return NPC_SPECIAL_RELATIONS[this.specialRelation].name;
        }
        for (const level of NPC_RELATIONSHIP_LEVELS) {
            if (this.relationship >= level.min && this.relationship <= level.max) {
                return level.name;
            }
        }
        return 'Xa lạ';
    }
}

export class NPCSystem {
    constructor() {
        this.npcs = [];
        this.worldNews = [];
    }

    addNews(msg) {
        const timeStr = window.game && window.game.systems && window.game.systems.time 
            ? window.game.systems.time.getFormattedTime() 
            : '';
        this.worldNews.unshift({ msg, time: Date.now(), timeStr });
        if (this.worldNews.length > 50) this.worldNews.pop();
    }

    processNPCInteractions(delta) {
        if (Math.random() > 0.05 * delta) return; // Giới hạn tần suất tính toán

        const locGroups = {};
        for (const npc of this.npcs) {
            if (npc.hp <= 0) continue;
            const key = npc.currentWorldId + '_' + npc.currentLocId;
            if (!locGroups[key]) locGroups[key] = [];
            locGroups[key].push(npc);
        }

        for (const key in locGroups) {
            const group = locGroups[key];
            if (group.length < 2) continue;

            const npc1 = group[Math.floor(Math.random() * group.length)];
            const npc2 = group[Math.floor(Math.random() * group.length)];
            if (npc1.id === npc2.id) continue;

            if (npc1.goalId === 'bao_thu' || npc1.personalityIds.includes('dien_cuong') || npc1.personalityIds.includes('tham_lam')) {
                const powerDiff = npc1.realmId - npc2.realmId;
                if (powerDiff >= 0 && Math.random() < 0.3) {
                    npc2.hp = 0; 
                    this.addNews(`[Huyết Chiến] Vì tranh đoạt cơ duyên, ${npc1.name} đã hạ sát ${npc2.name} tại bản đồ!`);
                    this.handleKarmaFallout(npc2, null, npc1);
                } else if (powerDiff < -1 && Math.random() < 0.2) {
                    npc1.hp = 0; 
                    this.addNews(`[Tự Phù] ${npc1.name} muốn mai phục ${npc2.name} nhưng tài nghệ kém cỏi, bị phản sát tại chỗ!`);
                    this.handleKarmaFallout(npc1, null, npc2);
                }
            } else if (Math.random() < 0.05) {
                this.addNews(`[Luận Bàn] ${npc1.name} và ${npc2.name} gặp gỡ luận võ, cùng nhau thăng tiến tu vi!`);
                npc1.tuVi += 150 * npc1.realmId;
                npc2.tuVi += 150 * npc2.realmId;
                npc1.changeRelationship(10);
                npc2.changeRelationship(10);
            }
        }
    }

    generate(templateId, realmId, locationId, worldId = 'nhan_gioi') {
        const npc = new NPC(templateId, realmId);
        npc.currentLocId = locationId;
        npc.currentWorldId = worldId;
        this.npcs.push(npc);
        return npc;
    }

    update(delta, worldTime) {
        this.processNPCInteractions(delta);

        this.npcs.forEach(npc => {
            npc.simulate(delta, worldTime, this);
            
            // Map Movement (approx 1% chance per second to change location)
            if (Math.random() < 0.01 * delta) {
                const world = WORLDS[npc.currentWorldId];
                if (world && world.locations) {
                    const newLoc = NPCAI.decideMovement(npc, world.locations);
                    if (newLoc) {
                        npc.currentLocId = newLoc;
                    }
                }
            }
        });
    }

    getNPCsAtLocation(locId, worldId = 'nhan_gioi') {
        return this.npcs.filter(npc => npc.currentLocId === locId && npc.currentWorldId === worldId && npc.hp > 0);
    }

    triggerPlayerInteractions(player) {
        const locId = player.currentLocId;
        const worldId = player.currentWorldId || 'nhan_gioi';
        const npcsHere = this.getNPCsAtLocation(locId, worldId);
        
        for (const npc of npcsHere) {
            const interaction = NPCAI.evaluateMapInteraction(npc, player);
            if (interaction.action !== 'NONE') {
                player.pendingEvents.push({
                    type: 'npc_event',
                    npcId: npc.id,
                    action: interaction.action,
                    msg: interaction.msg
                });
                // Limit to one active interaction per tick to avoid spam
                break;
            }
        }
    }

    handleKarmaFallout(victimNpc, killerPlayer, killerNpc = null) {
        if (!victimNpc || !victimNpc.relatives) return;
        victimNpc.relatives.forEach(relativeId => {
            const rel = this.npcs.find(n => n.id === relativeId);
            if (rel) {
                rel.changeRelationship(-100);
                rel.goalId = 'bao_thu';
                rel.memory.push({ type: 'killed_relative', time: Date.now() });
                
                if (killerPlayer) {
                    killerPlayer.addKarmaLink({
                        id: 'karma_' + Date.now(),
                        npcId: rel.id,
                        type: 'vengeance',
                        strength: 100,
                        description: `${rel.name} thề sẽ giết ngươi để trả thù cho ${victimNpc.name}.`
                    });
                } else if (killerNpc) {
                    rel.addMemory('attacked');
                }
            }
        });
    }

    saveData() {
        return {
            npcs: this.npcs.map(npc => ({ ...npc })),
            worldNews: this.worldNews
        };
    }

    loadData(data) {
        if (!data) return;
        const npcsData = Array.isArray(data) ? data : data.npcs; // Support old saves
        if (npcsData) {
            this.npcs = npcsData.map(npcData => {
                const templateId = npcData.templateId || npcData.type;
                const npc = new NPC(templateId, npcData.realmId);
                Object.assign(npc, npcData);
                return npc;
            });
        }
        if (data.worldNews) {
            this.worldNews = data.worldNews;
        }
    }
}
