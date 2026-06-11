import { HOURS, SEASONS, PHENOMENA } from '../configs/time-data.js';
import { WORLDS } from '../configs/map-data.js';
import { BEASTS } from '../configs/beast-data.js';
import { SECTS, SECT_RANKS } from '../configs/sect-data.js';
import { state } from '../state.js';

export class TimeSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        
        // Time state - Start at a random historical point (Year 1000 to 9000)
        // 12 hours/day * 30 days/month * 12 months/year = 4320 minutes per year
        const randomStartYear = 1000 + Math.floor(Math.random() * 8000);
        const randomDayOffset = Math.floor(Math.random() * 30 * 12); // Random month/day
        this.totalMinutes = (randomStartYear * 12 * 30 * 12) + randomDayOffset;
        
        this.lastTickTime = Date.now();
        this.tickRate = 10000; // 10 real seconds = 1 game Giờ (was 60s)
        
        this.currentPhenomenon = null;
        this.phenomenonEndTime = 0;
        this.timeMultiplier = 2.0; // 1 real second = 1.2 game Giờ (1 year = ~1 real hour)
    }

    update(delta) {
        const now = Date.now();
        const elapsed = (now - this.lastTickTime) * this.timeMultiplier;
        
        if (elapsed >= this.tickRate) {
            const ticks = Math.floor(elapsed / this.tickRate);
            this.advanceTime(ticks);
            this.lastTickTime = now - (elapsed % this.tickRate) / this.timeMultiplier;
        }

        // Check phenomenon expiration
        if (this.currentPhenomenon && this.totalMinutes >= this.phenomenonEndTime) {
            this.currentPhenomenon = null;
            this.ui.toast("Thiên tượng đã biến mất.", "info");
        }

        // Update UI
        if (this.ui.updateTimeUI) {
            this.ui.updateTimeUI(this.getFormattedTime());
        }

        // Randomly trigger phenomena every Giờ
        if (elapsed >= this.tickRate && !this.currentPhenomenon) {
            this.checkRandomPhenomena();
        }
    }

    skipTime(minutes) {
        this.advanceTime(minutes);
        logger.info('system', `Time Skipped: ${minutes} mins`);
    }

    advanceTime(minutes) {
        const oldDay = this.getDay();
        const oldMonth = this.getMonth();
        const oldYear = this.getYear();

        this.totalMinutes += minutes;
        
        // Process Mining Events
        const mSystem = state.systems.mining;
        if (mSystem) {
            mSystem.processTimeEvents(minutes);
        }

        // Age the player (simplified: 1 game year = some age increment)
        // Let's say 1 game year = 1 year of life
        const yearsPassed = this.getYear() - oldYear;
        if (yearsPassed > 0) {
            this.player.age += yearsPassed;
        }

        // Trigger events
        if (this.getDay() !== oldDay) this.onDayChanged();
        if (this.getMonth() !== oldMonth) this.onMonthChanged();
        if (this.getYear() !== oldYear) this.onYearChanged();
    }

    // Helper getters
    get totalDays() {
        return Math.floor(this.totalMinutes / 12);
    }

    getHour() {
        const hourIndex = this.totalMinutes % 12;
        return HOURS[hourIndex];
    }

    getDay() {
        return Math.floor(this.totalMinutes / 12) % 30 + 1;
    }

    getMonth() {
        return Math.floor(this.totalMinutes / (12 * 30)) % 12 + 1;
    }

    getYear() {
        return Math.floor(this.totalMinutes / (12 * 30 * 12)) + 1;
    }

    getSeason() {
        const month = this.getMonth();
        if (month >= 1 && month <= 3) return SEASONS[0]; // Spring
        if (month >= 4 && month <= 6) return SEASONS[1]; // Summer
        if (month >= 7 && month <= 9) return SEASONS[2]; // Autumn
        return SEASONS[3]; // Winter
    }

    isNight() {
        return this.getHour().period === 'Night';
    }

    checkRandomPhenomena() {
        PHENOMENA.forEach(p => {
            if (Math.random() < p.chance) {
                this.currentPhenomenon = p;
                this.phenomenonEndTime = this.totalMinutes + p.duration;
                this.ui.toast(`${p.name}: ${p.description}`, "warning");
            }
        });
    }

    onDayChanged() {
        // Daily resets or events
        if (state.systems.cheat) {
            state.systems.cheat.onDayChanged();
        }
    }

    onMonthChanged() {
        this.ui.toast(`Tháng mới đã đến: Tháng ${this.getMonth()}`, "info");

        // Monthly resources from Origin (Family/Sect)
        if (this.player.origin && this.player.origin.monthlyResources) {
            const monthly = this.player.origin.monthlyResources;
            if (monthly.lingShi > 0) {
                this.player.addLingShi(monthly.lingShi);
                this.ui.toast(`Nhận bổng lộc hàng tháng từ ${this.player.origin.name}: +${monthly.lingShi} Linh Thạch`, "success");
            }
            if (monthly.items && monthly.items.length > 0) {
                monthly.items.forEach(itemId => {
                    this.player.inventory.addItem(itemId, 1);
                });
                this.ui.toast(`Nhận bổng lộc đan dược từ ${this.player.origin.name}: ${monthly.items.length} viên`, "success");
            }
        }

        // Monthly resources from Sect (if character has pre-joined a sect/clan)
        if (this.player.sectId) {
            const sectData = SECTS[this.player.sectId];
            if (sectData) {
                const rankKey = this.player.sectRank || 'ngoai_mon';
                const rankInfo = SECT_RANKS[rankKey];
                const sectStipend = rankInfo && rankInfo.salary !== undefined ? rankInfo.salary : 50;
                
                this.player.addLingShi(sectStipend);
                this.ui.toast(`Nhận bổng lộc tháng từ ${sectData.name} (${rankInfo?.name || 'Ngoại Môn Đệ Tử'}): +${sectStipend} Linh Thạch`, "success");
            }
        }
        
        // Scan for Secret Realms opening this month
        this.checkSecretRealms();
    }

    onYearChanged() {
        this.ui.toast(`Chúc mừng năm mới! Năm ${this.getYear()}`, "success");
        
        // PNTT Periodic Tribulations check
        if (state.player && typeof window.game !== 'undefined' && typeof window.game.triggerPeriodicTribulation === 'function') {
            window.game.triggerPeriodicTribulation(this.getYear());
        }

        // Increment Natal Dharma Treasure nourishment
        if (state.player && state.player.natalTreasure) {
            state.player.natalTreasure.nourishYears = (state.player.natalTreasure.nourishYears || 0) + 1;
            state.player.calculateStats();
            this.ui.toast(`⚡ Bản Mệnh Pháp Bảo [${state.player.natalTreasure.name}] hấp thu tinh hoa đan điền của ngươi thêm 1 năm (Đã ôn dưỡng: ${state.player.natalTreasure.nourishYears} năm, uy lực tăng ${state.player.natalTreasure.nourishYears * 5}%)!`, "success");
        }

        // Auction House event every 5 years
        if (this.getYear() % 5 === 0) {
            if (state.systems.npc) {
                state.systems.npc.addNews(`[Đại Đấu Giá] Vạn Bảo Các long trọng tổ chức Đại Đấu Giá Hội, kính mời các bậc đại năng tứ phương tề tựu!`);
            }
        }

        // World Boss spawn (roughly 20% chance every year, max 1 boss)
        if (Math.random() < 0.2 && state.worldEvents.activeBosses.length === 0) {
            this.spawnWorldBoss();
        }
    }

    checkSecretRealms() {
        const y = this.getYear();
        const m = this.getMonth();
        
        for (const wId in WORLDS) {
            const locations = WORLDS[wId].locations;
            for (const lId in locations) {
                const loc = locations[lId];
                if (loc.openingRules) {
                    const isOpeningYear = (y % loc.openingRules.yearInterval === 0);
                    
                    // Only broadcast exactly on the opening month of the opening year
                    if (isOpeningYear && m === loc.openingRules.startMonth) {
                        if (state.systems.npc) {
                            state.systems.npc.addNews(`[Bí Cảnh Khai Mở] Thiên địa dị biến, sương mù tản đi! Bí cảnh [${loc.name}] tại ${WORLDS[wId].name} đã chính thức khai mở!`);
                        }
                    }
                }
            }
        }
    }

    spawnWorldBoss() {
        // Find all locations with danger level > 0
        const validLocs = [];
        for (const wId in WORLDS) {
            const locations = WORLDS[wId].locations;
            for (const lId in locations) {
                if (locations[lId].dangerLevel > 0) {
                    validLocs.push({ wId, lId, loc: locations[lId] });
                }
            }
        }
        
        if (validLocs.length === 0) return;
        
        const randomTarget = validLocs[Math.floor(Math.random() * validLocs.length)];
        const bossKeys = Object.keys(BEASTS);
        const randomBossId = bossKeys[Math.floor(Math.random() * bossKeys.length)];
        const bossData = BEASTS[randomBossId];
        
        const bossLevel = Math.max(10, randomTarget.loc.dangerLevel * 10 + Math.floor(Math.random() * 20));
        
        state.worldEvents.activeBosses.push({
            worldId: randomTarget.wId,
            locId: randomTarget.lId,
            bossId: randomBossId,
            level: bossLevel,
            spawnYear: this.getYear()
        });
        
        if (state.systems.npc) {
            state.systems.npc.addNews(`[Đại Yêu Thú] Oán khí ngút trời! Một con [${bossData.name}] bất ngờ giáng lâm tại ${randomTarget.loc.name}, tàn sát vô số sinh linh!`);
        }
    }

    getFormattedTime() {
        const h = this.getHour();
        const d = this.getDay();
        const m = this.getMonth();
        const y = this.getYear();
        const s = this.getSeason();
        return {
            hourName: h.name,
            day: d,
            month: m,
            year: y,
            worldEra: 'Kỷ Nguyên Thiên Đạo',
            seasonName: s.name,
            seasonColor: s.color,
            period: h.period,
            phenomenon: this.currentPhenomenon ? this.currentPhenomenon.name : null
        };
    }

    load(data) {
        if (data && typeof data.totalMinutes === 'number') {
            this.totalMinutes = data.totalMinutes;
            this.lastTickTime = Date.now();
        }
    }

    save() {
        return {
            totalMinutes: this.totalMinutes
        };
    }
}
