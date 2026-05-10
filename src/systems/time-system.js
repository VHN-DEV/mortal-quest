import { HOURS, SEASONS, PHENOMENA } from '../configs/time-data.js';

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
        this.tickRate = 60000; // 1 real minute = 1 game Giờ
        
        this.currentPhenomenon = null;
        this.phenomenonEndTime = 0;
        this.timeMultiplier = 1.0;
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

        // Randomly trigger phenomena every Giờ
        if (elapsed >= this.tickRate && !this.currentPhenomenon) {
            this.checkRandomPhenomena();
        }
    }

    advanceTime(minutes) {
        const oldDay = this.getDay();
        const oldMonth = this.getMonth();
        const oldYear = this.getYear();

        this.totalMinutes += minutes;
        
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
    }

    onMonthChanged() {
        this.ui.toast(`Tháng mới đã đến: Tháng ${this.getMonth()}`, "info");
    }

    onYearChanged() {
        this.ui.toast(`Chúc mừng năm mới! Năm ${this.getYear()}`, "success");
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
        if (data) {
            this.totalMinutes = data.totalMinutes || 0;
            this.lastTickTime = Date.now();
        }
    }

    save() {
        return {
            totalMinutes: this.totalMinutes
        };
    }
}
