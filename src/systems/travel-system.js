import { state } from '../state.js';
import { getTravelRoute, findLocationName, findWorldIdByLocId, DANGER_LEVELS, getLocationById } from '../configs/map-data.js';
import { getItemById } from '../configs/item-data.js';
import { getRealmById } from '../configs/realm-data.js';

export class TravelSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        this.isTraveling = false;
        this.travelData = null; // { route, progress, totalTime, timer }
    }

    // Tốc độ di chuyển dựa trên Cảnh giới (Tu vi)
    getRealmSpeedMultiplier() {
        const r = this.player.realmId || 0;
        if (r < 1) return 1; // Phàm nhân
        if (r < 14) return 2; // Khinh Công (Luyện Khí)
        if (r < 18) return 5; // Phi Hành (Trúc Cơ)
        if (r < 22) return 15; // Độn Quang (Kết Đan)
        if (r < 26) return 50; // Hóa Kiếp (Nguyên Anh)
        if (r < 30) return 150; // Xuyên Không Ngắn (Hóa Thần)
        return 300; // Đại Thừa / Luyện Hư trở lên
    }

    // Tốc độ bổ sung từ Tọa Kỵ, Phi Chu
    getEquipmentSpeedMultiplier() {
        // 1. Kiểm tra phi chu được trang bị
        const equippedId = this.player.equipment ? this.player.equipment.flightArtifact : null;
        if (equippedId) {
            const item = getItemById(equippedId);
            if (item && item.stats && item.stats.spd) {
                return 1 + (item.stats.spd / 50);
            }
        }

        // 2. Nếu không trang bị, tìm phi chu tốt nhất trong túi đồ
        if (this.player.inventory && typeof this.player.inventory.allItems !== 'undefined') {
            const flightArtifacts = this.player.inventory.allItems
                .map(i => getItemById(i.id))
                .filter(item => item && item.type === 'flightArtifact');
            
            if (flightArtifacts.length > 0) {
                flightArtifacts.sort((a, b) => ((b.stats?.spd || 0) - (a.stats?.spd || 0)));
                const best = flightArtifacts[0];
                if (best && best.stats && best.stats.spd) {
                    return 1 + (best.stats.spd / 50);
                }
            }
        }

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

        // 1.5. Kiểm tra điều kiện đến Loạn Tinh Hải
        const toLocWorldId = findWorldIdByLocId(toLocId);
        const toLoc = getLocationById(toLocWorldId, toLocId);
        if (toLoc && toLoc.regionId === 'loan_tinh_hai') {
            const fromLocWorldId = findWorldIdByLocId(fromLocId);
            const fromLoc = getLocationById(fromLocWorldId, fromLocId);
            const isAlreadyThere = fromLoc && fromLoc.regionId === 'loan_tinh_hai';
            if (!isAlreadyThere) {
                const atTeleport = fromLocId === 'thuong_co_truyen_tong_tran';
                const hasTalisman = this.player.inventory && (
                    this.player.inventory.hasItem('pha_khong_phu') || 
                    this.player.inventory.hasItem('thun_di_phu') || 
                    this.player.inventory.hasItem('truyen_tong_lenh')
                );
                const hasBoat = this.player.inventory && (
                    this.player.inventory.hasItem('ngu_phong_phi_chu') || 
                    this.player.inventory.hasItem('linh_thuyen_so')
                );

                if (!atTeleport && !hasTalisman && !hasBoat) {
                    this.ui.toast("Không thể định vị giới diện Loạn Tinh Hải! Cần ở Thượng Cổ Truyền Tống Trận, hoặc có Phi Chu (Linh Thuyền, Phi Chu), hoặc có Truyền Tống Phù (Thuấn Di Phù, Phá Không Phù).", "error");
                    return false;
                }
            }
        }

        // 1.55. Kiểm tra giới hạn cảnh giới và thời gian mở của địa điểm mục tiêu
        if (toLoc) {
            // Kiểm tra cảnh giới tối thiểu
            if (this.player.realmId < toLoc.minRealm) {
                const reqRealmName = getRealmById(toLoc.minRealm)?.name || 'Cảnh giới cao hơn';
                this.ui.toast(`Cảnh giới không đủ để bước vào ${toLoc.name}! Yêu cầu: ${reqRealmName}`, "error");
                return false;
            }
            // Kiểm tra cảnh giới tối đa
            if (toLoc.maxRealm !== undefined && this.player.realmId > toLoc.maxRealm) {
                const failMsg = toLoc.maxRealmMessage || `Cảnh giới của ngươi quá cao để vào cấm địa này!`;
                this.ui.toast(failMsg, "error");
                return false;
            }
            // Kiểm tra thời gian mở bí cảnh
            if (toLoc.openingRules && state.systems.time) {
                const timeSys = state.systems.time;
                const { cycleYears, months, message } = toLoc.openingRules;
                const yearMatches = (timeSys.getYear() % cycleYears) === 0;
                const monthMatches = months.includes(timeSys.getMonth());
                if (!yearMatches || !monthMatches) {
                    this.ui.toast(`Bí cảnh ${toLoc.name} hiện đang đóng cửa! ${message || ''}`, "error");
                    return false;
                }
            }
        }

        // 1. Kiểm tra yêu cầu Hải Vực (Terrain: 'hai_vuc')
        if (route.terrain === 'hai_vuc') {
            const isKietDan = this.player.realmId >= 18;
            const hasVessel = this.player.equipment?.flightArtifact || (this.player.inventory?.allItems?.some(i => getItemById(i.id)?.type === 'flightArtifact'));
            if (!isKietDan && !hasVessel) {
                this.ui.toast("Vượt biển yêu cầu đạt Kết Đan kỳ (phi hành độn quang) hoặc sở hữu Phi Chu (Phi Hành Pháp Bảo) trong hành trang!", "error");
                return false;
            }
        }

        // 2. Kiểm tra dịch chuyển giới diện (fromWorld !== toWorld)
        const fromWorldId = findWorldIdByLocId(fromLocId);
        const toWorldId = findWorldIdByLocId(toLocId);
        if (fromWorldId && toWorldId && fromWorldId !== toWorldId) {
            // Yêu cầu cảnh giới tối thiểu tùy giới diện mục tiêu
            let minRealmReq = 26; // Hóa Thần cho Linh Giới
            let worldName = "Linh Giới";
            if (toWorldId === 'tien_gioi') {
                minRealmReq = 42; // Chân Tiên
                worldName = "Tiên Giới";
            }
            
            if (this.player.realmId < minRealmReq) {
                this.ui.toast(`Cảnh giới chưa đủ để phi thăng ${worldName}! Nhục thân ngươi sẽ bị lực lượng giới diện xé rách!`, "error");
                return false;
            }

            // Yêu cầu vật phẩm dịch chuyển
            const hasToken = this.player.inventory?.allItems?.some(i => i.id === 'truyen_tong_lenh');
            const hasTalisman = this.player.inventory?.allItems?.some(i => i.id === 'pha_khong_phu');

            if (!hasToken && !hasTalisman) {
                this.ui.toast("Dịch chuyển xuyên giới diện yêu cầu sở hữu [Thượng Cổ Truyền Tống Lệnh] hoặc tiêu hao [Phá Không Phù] để hộ thân!", "error");
                return false;
            }

            // Nếu không có lệnh bài vĩnh viễn nhưng có bùa tiêu hao, trừ bùa tiêu hao
            if (!hasToken && hasTalisman) {
                this.player.inventory.removeItem('pha_khong_phu', 1);
                this.ui.toast("[Phá Không Phù] hóa thành tro bụi sau khi chống đỡ áp lực hư không loạn lưu!", "warning");
            }
        }

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
            const hasVessel = this.player.equipment?.flightArtifact || (this.player.inventory?.allItems?.some(i => getItemById(i.id)?.type === 'flightArtifact'));
            const msgs = hasVessel
                ? [
                    "Phi chu ngự phong phá sóng, lướt nhanh trên tầng vân tiêu...",
                    "Từ trên phi chu nhìn xuống, mây trôi nước chảy tráng lệ khôn cùng.",
                    "Phi chu tự động phi hành theo la bàn, ngươi ngơi nghỉ tĩnh tọa dưỡng thần.",
                    "Linh quang hộ trướng rực rỡ, bảo vệ phi chu trước hư không cuồng phong."
                ]
                : [
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
