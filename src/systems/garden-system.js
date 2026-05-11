import { SEEDS, FIELD_GRADES, FIELD_ATTRIBUTES, HERB_AGE_MILESTONES } from '../configs/garden-data.js';
import { getItemById } from '../configs/item-data.js';

export class GardenSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
    }

    /**
     * Cập nhật tăng trưởng linh thảo
     * delta: thời gian trôi qua tính bằng giây
     */
    update(delta) {
        if (!this.player.gardenPlots) return;

        this.player.gardenPlots.forEach(plot => {
            if (plot && plot.status === 'growing') {
                const seed = SEEDS.find(s => s.id === plot.seedId);
                if (!seed) return;

                // Tính toán tốc độ tăng trưởng
                let growthSpeed = 1.0;
                
                // Thưởng từ phẩm cấp điền
                const gradeInfo = FIELD_GRADES[plot.grade] || FIELD_GRADES.PHAM;
                growthSpeed *= gradeInfo.speedMult;

                // Thưởng từ thuộc tính (X2 nếu khớp)
                if (seed.attributeReq !== 'NORMAL') {
                    if (plot.attribute === seed.attributeReq) {
                        growthSpeed *= 2.0;
                    } else if (plot.attribute !== 'NORMAL') {
                        // Khác thuộc tính (Xung khắc)
                        growthSpeed *= 0.2;
                    } else {
                        // Điền thường trồng thảo có thuộc tính
                        growthSpeed *= 0.7;
                    }
                }

                // Cập nhật tuổi (age tính bằng giây "ảo")
                // Giả sử 1 "năm" dược liệu = 10 giây gốc
                const yearsGained = (delta * growthSpeed) / 10;
                plot.age += yearsGained;

                // Cập nhật mốc tuổi
                const currentMilestone = HERB_AGE_MILESTONES.find(m => plot.age >= m.years && (!HERB_AGE_MILESTONES[HERB_AGE_MILESTONES.indexOf(m)+1] || plot.age < HERB_AGE_MILESTONES[HERB_AGE_MILESTONES.indexOf(m)+1].years));
                if (currentMilestone) {
                    plot.stage = currentMilestone.name;
                }
            }
        });
    }

    plant(plotIndex, seedId) {
        const seed = SEEDS.find(s => s.id === seedId);
        if (!seed) return { success: false, msg: 'Hạt giống không tồn tại!' };

        // Kiểm tra túi đồ
        if (!this.player.inventory.hasItem(seedId, 1)) {
            return { success: false, msg: 'Không có hạt giống này!' };
        }

        if (!this.player.gardenPlots[plotIndex].seedId) {
            this.player.inventory.removeItem(seedId, 1);
            this.player.gardenPlots[plotIndex] = {
                ...this.player.gardenPlots[plotIndex],
                seedId: seedId,
                startTime: Date.now(),
                age: 0,
                stage: 'Mầm',
                status: 'growing'
            };
            return { success: true, msg: `Đã gieo ${seed.name}!` };
        }
        return { success: false, msg: 'Ô đất này đã có cây!' };
    }

    harvest(plotIndex) {
        const plot = this.player.gardenPlots[plotIndex];
        if (plot && plot.seedId) {
            const seed = SEEDS.find(s => s.id === plot.seedId);
            if (!seed) {
                this.resetPlot(plotIndex);
                return { success: false, msg: 'Lỗi dữ liệu hạt giống!' };
            }

            // Thu hoạch dựa trên tuổi
            const age = Math.floor(plot.age);
            if (age < 10) {
                return { success: false, msg: 'Linh thảo còn quá non, chưa thể thu hoạch!' };
            }

            // Thêm vật phẩm vào túi (kèm metadata tuổi nếu cần, hoặc tạo item khác nhau)
            // Hiện tại ta thêm item gốc
            this.player.inventory.addItem(seed.herbId, 1, { age: age, stage: plot.stage });
            
            this.resetPlot(plotIndex);
            return { success: true, msg: `Đã thu hoạch ${seed.name} (${plot.stage})!` };
        }
        return { success: false, msg: 'Không có gì để thu hoạch!' };
    }

    upgradeField(plotIndex) {
        const plot = this.player.gardenPlots[plotIndex];
        const grades = Object.keys(FIELD_GRADES);
        const currentIndex = grades.indexOf(plot.grade);
        
        if (currentIndex < grades.length - 1) {
            const nextGrade = grades[currentIndex + 1];
            const cost = FIELD_GRADES[nextGrade].cost;
            
            if (this.player.lingShi >= cost) {
                if (this.player.spendLingShi(cost)) {
                    plot.grade = nextGrade;
                    return { success: true, msg: `Đã nâng cấp lên ${FIELD_GRADES[nextGrade].name}!` };
                }
            } else {
                return { success: false, msg: 'Không đủ Linh Thạch!' };
            }
        }
        return { success: false, msg: 'Đã đạt cấp tối đa!' };
    }

    setAttribute(plotIndex, attrId) {
        const plot = this.player.gardenPlots[plotIndex];
        if (!FIELD_ATTRIBUTES[attrId]) return { success: false, msg: 'Thuộc tính không hợp lệ!' };
        
        const cost = 500; // Phí đổi thuộc tính
        if (this.player.lingShi >= cost) {
            if (this.player.spendLingShi(cost)) {
                plot.attribute = attrId;
                return { success: true, msg: `Đã chuyển sang thuộc tính ${FIELD_ATTRIBUTES[attrId].name}!` };
            }
        }
        return { success: false, msg: 'Không đủ Linh Thạch để chuyển đổi!' };
    }

    resetPlot(plotIndex) {
        const plot = this.player.gardenPlots[plotIndex];
        this.player.gardenPlots[plotIndex] = {
            grade: plot.grade || 'PHAM',
            attribute: plot.attribute || 'NORMAL',
            seedId: null,
            age: 0,
            status: 'empty'
        };
    }
}
