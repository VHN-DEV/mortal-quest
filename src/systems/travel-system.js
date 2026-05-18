import { state } from '../state.js';
import { getTravelRoute, findLocationName, findWorldIdByLocId, DANGER_LEVELS } from '../configs/map-data.js';

export class TravelSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        this.isTraveling = false;
        this.travelData = null; // { route, progress, totalTime, timer }
    }

    // Tốc độ di chuyển dựa trên Cảnh giới (Tu vi)
    getRealmSpeedMultiplier() {
        const r = this.player.realm;
        if (r < 4) return 1; // Đi bộ / Khinh công (Luyện Khí sơ kỳ)
        if (r < 10) return 2; // Ngự Khí (Trúc Cơ)
        if (r < 16) return 5; // Phi Hành (Kết Đan)
        if (r < 22) return 15; // Độn Quang (Nguyên Anh)
        if (r < 28) return 50; // Xuyên Không Ngắn (Hóa Thần)
        return 100; // Đại Thừa trở lên
    }

    // Tốc độ bổ sung từ Tọa Kỵ, Phi Chu
    getEquipmentSpeedMultiplier() {
        // Tương lai có thể check player.equipment.mount hoặc ship
        return 1;
    }

    calculateTravelTime(distance) {
        const speed = 10 * this.getRealmSpeedMultiplier() * this.getEquipmentSpeedMultiplier();
        // Giả sử tốc độ cơ bản là 10 dặm/giờ (game time)
        // Khoảng cách 50 dặm -> 5 giờ. Tốc độ x5 (Trúc Cơ) -> 1 giờ.
        const hours = distance / speed;
        return hours;
    }

    // Return real-time milliseconds to simulate the journey
    calculateRealTimeDuration(distance) {
        // Rút gọn thời gian ngoài đời thực để không làm chán người chơi
        // Ví dụ: 50 dặm = 2 giây, 5000 dặm = 10 giây, 50000 dặm = 30 giây
        if (distance <= 100) return 3000; // 3 giây
        if (distance <= 1000) return 6000; // 6 giây
        if (distance <= 10000) return 12000; // 12 giây
        return 20000; // 20 giây tối đa
    }

    startTravel(toLocId) {
        if (this.isTraveling) return false;
        
        const fromLocId = state.currentLocId;
        const route = getTravelRoute(fromLocId, toLocId);

        if (!route) {
            this.ui.toast("Không tìm thấy đường đi tới địa điểm này!", "error");
            return false;
        }

        // Check requirements (Tu vi, Item)
        // ... handled in MapScreen typically before calling this, but double check here if needed

        const gameHours = this.calculateTravelTime(route.baseDistance);
        const realMs = this.calculateRealTimeDuration(route.baseDistance);

        this.isTraveling = true;
        this.travelData = {
            route,
            gameHours,
            realMs,
            startTime: Date.now(),
            logs: []
        };

        logger.info('system', `Bắt đầu hành trình từ ${findLocationName(fromLocId)} đến ${findLocationName(toLocId)}. Quãng đường: ${route.baseDistance} dặm.`);
        
        // Show Travel Overlay
        this.ui.showTravelOverlay(this.travelData);

        // Simulation Loop
        this.simulateJourney();

        return true;
    }

    simulateJourney() {
        const updateInterval = 1000; // 1 giây trigger 1 lần event
        
        this.travelData.timer = setInterval(() => {
            if (!this.isTraveling) return;

            const now = Date.now();
            const elapsed = now - this.travelData.startTime;
            const progress = Math.min(100, (elapsed / this.travelData.realMs) * 100);

            // Update UI Progress
            this.ui.updateTravelProgress(progress);

            // Generate Event if not finished
            if (progress < 100) {
                this.generateTravelEvent();
            } else {
                this.completeTravel();
            }

        }, updateInterval);
    }

    generateTravelEvent() {
        // Xác suất gặp sự kiện dựa vào Danger Level
        const dangerObj = DANGER_LEVELS[this.travelData.route.baseDanger];
        const isDangerous = dangerObj && (this.travelData.route.baseDanger !== 'an_toan');
        
        const rand = Math.random();
        let logMsg = "";
        let type = "info";

        if (isDangerous && rand < 0.2) {
            // Sự kiện xấu (Gặp yêu thú, thời tiết)
            if (Math.random() < 0.5) {
                logMsg = "Gặp một đàn yêu thú chặn đường, bạn phải tốn chút linh lực để xua đuổi.";
                type = "warning";
                // Có thể gọi player.modifyEnergy(...)
            } else {
                logMsg = "Thời tiết dị biến ở " + this.travelData.route.terrain + ", sương mù dày đặc làm giảm tầm nhìn.";
                type = "warning";
            }
        } else if (rand < 0.3) {
            // Sự kiện tốt (Thấy linh thảo, kỳ ngộ nhỏ)
            logMsg = "Tình cờ phát hiện một gốc linh thảo bên đường, thu thập được một chút tài nguyên.";
            type = "success";
            this.player.addLingShi(Math.floor(Math.random() * 10) + 1);
        } else {
            // Normal travel log
            const msgs = [
                "Phi kiếm xé gió, lướt qua những rặng núi trùng điệp...",
                "Ngắm nhìn cảnh sắc phàm trần từ trên cao, tâm tình tĩnh lặng.",
                "Hành trình vạn dặm, đạo tâm kiên định.",
                "Thưởng thức phong cảnh núi non hùng vĩ dọc đường đi."
            ];
            logMsg = msgs[Math.floor(Math.random() * msgs.length)];
        }

        this.travelData.logs.push({ msg: logMsg, type });
        this.ui.addTravelLog(logMsg, type);
    }

    completeTravel() {
        clearInterval(this.travelData.timer);
        this.isTraveling = false;
        
        const toLocId = this.travelData.route.to;
        const toWorldId = findWorldIdByLocId(toLocId);

        // Trừ thời gian trong game
        const minutesToAdvance = Math.floor(this.travelData.gameHours * 60);
        if (state.systems.time) {
            state.systems.time.advanceTime(minutesToAdvance);
        }

        // Đổi location
        state.currentWorldId = toWorldId;
        state.currentLocId = toLocId;
        if (window.game && window.game.saveGame) window.game.saveGame();

        this.ui.toast(`Đã đến ${findLocationName(toLocId)}!`, "success");
        this.ui.hideTravelOverlay();
        
        // Render destination
        if (window.game && window.game.screens && window.game.screens.map) {
            window.game.screens.map.startExploration(toLocId, true, true); // skipTravel = true
        }
    }

    abortTravel() {
        if (!this.isTraveling) return;
        clearInterval(this.travelData.timer);
        this.isTraveling = false;
        this.ui.toast("Hành trình bị hủy bỏ, bạn quay lại điểm xuất phát.", "warning");
        this.ui.hideTravelOverlay();
    }
}
