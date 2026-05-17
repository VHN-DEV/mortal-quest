import { state } from '../state.js';
import { ITEMS } from '../configs/item-data.js';
import { WORLDS } from '../configs/map-data.js';
import { CREATION_SYSTEMS } from '../configs/creation-data.js';

// Rarity color configurations for rewards UI
export const REWARD_QUALITY_COLORS = {
    'Phàm Khí': 'text-gray-400',
    'Pháp Khí': 'text-qi-blue',
    'Linh Khí': 'text-qi-purple',
    'Pháp Bảo': 'text-amber-500',
    'Cổ Bảo': 'text-orange-500',
    'Linh Bảo': 'text-red-500',
    'Thông Thiên Linh Bảo': 'text-pink-500',
    'Tiên Khí': 'text-cyan-400'
};

export class CheatSystem {
    constructor(player, ui) {
        this.player = player;
        this.ui = ui;
        this.reset();
    }

    reset() {
        this.systemId = null; // Stored on Player, synced on init()
        
        // Sign-In System State
        this.signInState = {
            totalDays: 0,
            lastDayClaimed: -1,
            available: true
        };

        // Mission System State
        this.missionState = {
            currentMission: null, // { id, name, desc, type, target, current, reward, completed, claimed }
            lastDayRolled: -1
        };

        // Location Check-In System State
        this.locationState = {
            targetLocId: null,
            targetLocName: '',
            lastDayRolled: -1,
            claimed: false
        };

        // Reward Pending State (For Chests & 3-Choose-1 UI)
        this.pendingRewards = null; // Holds the currently rolled options
        this.claimStyle = 'direct'; // direct, chest, choose (from config)
        this.lastClaimedRewards = null; // Stored for direct rewards popup display
    }

    init() {
        if (!this.player) return;
        this.systemId = this.player.cheatSystemId;
        
        const sysConfig = (CREATION_SYSTEMS || []).find(s => s.id === this.systemId);
        if (sysConfig) {
            this.claimStyle = sysConfig.claimStyle || 'direct';
        }

        // Daily roll on first startup if empty
        this.onDayChanged();
    }

    /**
     * Called by TimeSystem when a new game day ticks
     */
    onDayChanged() {
        if (!this.player || !this.systemId) return;

        const currentDay = state.systems.time ? state.systems.time.totalDays : 0;

        // 1. Sign-In System Reset
        if (this.systemId === 'sign_in') {
            if (this.signInState.lastDayClaimed < currentDay) {
                this.signInState.available = true;
            }
        }

        // 2. Mission System Roll
        if (this.systemId === 'mission') {
            if (!this.missionState.currentMission || (this.missionState.currentMission.claimed && this.missionState.lastDayRolled < currentDay)) {
                this.rollNewMission(currentDay);
            }
        }

        // 3. Location Check-In System Roll
        if (this.systemId === 'check_in_loc') {
            if (!this.locationState.targetLocId || (this.locationState.claimed && this.locationState.lastDayRolled < currentDay)) {
                this.rollNewLocation(currentDay);
            }
        }

        // Update the main button text/UI if main screen is open
        if (typeof window.game?.refreshUI === 'function') {
            window.game.refreshUI();
        }
    }

    /**
     * Roll a new mission for daily cheat task
     */
    rollNewMission(day) {
        const missions = [
            { id: 'm_cultivate', name: 'Độ Tịch Tu Luyện', desc: 'Tích cực hấp thu linh khí thiên địa 5 lần.', type: 'cultivate', target: 5 },
            { id: 'm_seclusion', name: 'Nhập Định Ngộ Đạo', desc: 'Bế quan tu hành 1 lần để củng cố linh lực.', type: 'seclusion', target: 1 },
            { id: 'm_lingshi', name: 'Linh Thạch Tiêu Hao', desc: 'Tiêu hao 50 Linh thạch hạ phẩm để lưu thông khí vận.', type: 'spend_lingshi', target: 50 }
        ];

        // Check if player is already at peak realm to avoid rolling an uncompletable breakthrough mission
        const checkBreakthrough = this.player.canBreakthrough('tuvi');
        if (checkBreakthrough.reason !== "Đã đạt đến cảnh giới chí cao vô thượng, không thể đột phá thêm!") {
            missions.push({ id: 'm_breakthrough', name: 'Nghịch Thiên Đột Phá', desc: 'Tiến hành đột phá cảnh giới 1 lần.', type: 'breakthrough', target: 1 });
        }

        const roll = missions[Math.floor(Math.random() * missions.length)];
        
        this.missionState.currentMission = {
            id: roll.id,
            name: roll.name,
            desc: roll.desc,
            type: roll.type,
            target: roll.target,
            current: 0,
            completed: false,
            claimed: false
        };
        this.missionState.lastDayRolled = day;
    }

    /**
     * Roll a new destination for all-heaven location check-in
     */
    rollNewLocation(day) {
        const worldId = this.player.currentWorldId || 'nhan_gioi';
        const world = WORLDS[worldId];
        if (!world || !world.locations || world.locations.length === 0) return;

        // Filter locations that the player has unlocked or has access to
        const unlockedLocations = world.locations.filter(loc => {
            // Include safe locations or locations within player realm level
            return loc.minRealm <= (this.player.realmId || 0);
        });

        const targetList = unlockedLocations.length > 0 ? unlockedLocations : world.locations;
        const target = targetList[Math.floor(Math.random() * targetList.length)];

        this.locationState.targetLocId = target.id;
        this.locationState.targetLocName = target.name;
        this.locationState.lastDayRolled = day;
        this.locationState.claimed = false;
    }

    /**
     * Hook triggered by various gameplay actions to update mission progress
     */
    onAction(actionType, amount = 1) {
        if (this.systemId !== 'mission' || !this.missionState.currentMission) return;

        const mission = this.missionState.currentMission;
        if (mission.completed || mission.type !== actionType) return;

        mission.current = Math.min(mission.target, mission.current + amount);
        
        if (mission.current >= mission.target) {
            mission.completed = true;
            this.ui.toast(`Hệ Thống: Nhiệm vụ [${mission.name}] đã hoàn thành! Bấm vào để nhận thưởng.`, "success");
        }

        if (typeof window.game?.refreshUI === 'function') {
            window.game.refreshUI();
        }
    }

    /**
     * Checks if check-in criteria are met
     */
    canCheckIn() {
        if (this.systemId !== 'check_in_loc' || this.locationState.claimed) return false;
        // Checked in today if currently at the target location ID
        return state.currentLocId === this.locationState.targetLocId;
    }

    /**
     * Trigger Sign-In Action
     */
    actionSignIn() {
        if (this.systemId !== 'sign_in' || !this.signInState.available) return false;

        const currentDay = state.systems.time ? state.systems.time.totalDays : 0;
        this.signInState.totalDays++;
        this.signInState.lastDayClaimed = currentDay;
        this.signInState.available = false;

        this.generateRewards();
        return true;
    }

    /**
     * Trigger Mission Claim Action
     */
    actionClaimMission() {
        if (this.systemId !== 'mission' || !this.missionState.currentMission) return false;
        if (!this.missionState.currentMission.completed || this.missionState.currentMission.claimed) return false;

        this.missionState.currentMission.claimed = true;
        this.generateRewards();
        return true;
    }

    /**
     * Trigger Check-In Action
     */
    actionCheckIn() {
        if (!this.canCheckIn()) return false;

        this.locationState.claimed = true;
        this.generateRewards();
        return true;
    }

    /**
     * Generate interesting supreme rewards
     */
    generateRewards() {
        const pool = this.getRewardPool();
        
        // Let's roll 3 rewards.
        const rolled = [];
        
        // 1. Linh Thạch is always awarded
        const lingShiGrade = this.player.realmId >= 30 ? 'TRUNG' : 'HA';
        const lingShiQty = lingShiGrade === 'TRUNG' 
            ? Math.floor(Math.random() * 5) + 2 // 2-6 Trung Phẩm
            : Math.floor(Math.random() * 200) + 100; // 100-300 Hạ Phẩm

        rolled.push({
            type: 'lingshi',
            id: lingShiGrade === 'TRUNG' ? 'ling_thach_trung' : 'ling_thach_ha',
            qty: lingShiQty,
            name: `${lingShiQty} ${lingShiGrade === 'TRUNG' ? 'Trung Phẩm' : 'Hạ Phẩm'} Linh Thạch`,
            icon: lingShiGrade === 'TRUNG' ? '💠' : '💎',
            quality: lingShiGrade === 'TRUNG' ? 'Linh Khí' : 'Phàm Khí'
        });

        // 2 & 3: Roll 2 premium items
        for (let i = 0; i < 2; i++) {
            const itemRoll = pool[Math.floor(Math.random() * pool.length)];
            const itemData = ITEMS[itemRoll.id];
            
            rolled.push({
                type: 'item',
                id: itemRoll.id,
                qty: itemRoll.qty || 1,
                name: itemData ? itemData.name : itemRoll.id,
                icon: itemData ? itemData.icon : '🎁',
                quality: itemData ? itemData.quality : 'Linh Khí'
            });
        }

        // Configure pending rewards
        this.pendingRewards = rolled;

        // If claim style is direct, claim immediately
        if (this.claimStyle === 'direct') {
            this.applyRewardsDirectly();
        }
    }

    /**
     * Apply rewards directly to player state
     */
    applyRewardsDirectly() {
        if (!this.pendingRewards) return;

        this.lastClaimedRewards = [...this.pendingRewards]; // Save for direct UI alert

        this.pendingRewards.forEach(reward => {
            if (reward.type === 'lingshi') {
                this.player.addLingShi(reward.qty);
            } else {
                this.player.inventory.addItem(reward.id, reward.qty);
            }
        });

        this.pendingRewards = null;
        
        // If the day has advanced since the task was rolled, trigger onDayChanged to roll the next daily item immediately
        this.onDayChanged();
    }

    /**
     * Claim specific reward from the 3-Choose-1 pool
     */
    chooseReward(index) {
        if (!this.pendingRewards || this.pendingRewards.length === 0) return null;
        
        const chosen = this.pendingRewards[index];
        if (!chosen) return null;

        if (chosen.type === 'lingshi') {
            this.player.addLingShi(chosen.qty);
        } else {
            this.player.inventory.addItem(chosen.id, chosen.qty);
        }

        const oldPending = [...this.pendingRewards];
        this.pendingRewards = null;

        // If the day has advanced since the task was rolled, trigger onDayChanged to roll the next daily item immediately
        this.onDayChanged();

        return { chosen, all: oldPending };
    }

    /**
     * Load rewards library based on player realm
     */
    getRewardPool() {
        const realmId = this.player.realmId || 0;
        
        // Rơi phần thưởng đa dạng cực kỳ thú vị: đan dược, nguyên liệu chế đồ, công pháp, linh thảo quý
        const basePool = [
            // Đan Dược
            { id: 'ngung_khi_dan', qty: 2 },
            { id: 'bo_nguyen_dan', qty: 2 },
            { id: 'thanh_tam_dan', qty: 2 },
            { id: 'hoi_huyet_dan', qty: 3 },
            { id: 'tich_coc_dan', qty: 2 },

            // Linh thảo & Nguyên liệu
            { id: 'linh_thao_thap', qty: 5 },
            { id: 'linh_thao_trung', qty: 3 },
            { id: 'hoa_diem_thao', qty: 2 },
            { id: 'han_tuy_hoa', qty: 2 },
            { id: 'u_minh_hoa', qty: 1 },
            { id: 'thuy_tinh', qty: 3 },
            { id: 'ma_thach', qty: 2 },
            
            // Hạt giống
            { id: 'seed_linh_thao', qty: 3 },
            { id: 'seed_hoa_diem_thao', qty: 1 },
            { id: 'seed_han_tuy_hoa', qty: 1 },

            // Đan phương / Bản vẽ nhập môn
            { id: 'dp_ngung_khi_dan', qty: 1 },
            { id: 'dp_than_tam_dan', qty: 1 },
            { id: 'bv_thanh_hong_kiem', qty: 1 },
            { id: 'pv_hoa_cau_phu', qty: 1 },
            { id: 'td_tu_linh_tran', qty: 1 }
        ];

        // Mid-tier additions (Realm 10+)
        if (realmId >= 10) {
            basePool.push(
                { id: 'truc_co_dan', qty: 1 },
                { id: 'tui_tru_vat_trung', qty: 1 },
                { id: 'ho_tam_kinh', qty: 1 },
                { id: 'linh_thuyen_so', qty: 1 },
                { id: 'tran_ban_so', qty: 1 },
                { id: 'dp_truc_co_dan', qty: 1 },
                { id: 'dp_bo_nguyen_dan', qty: 1 },
                { id: 'bv_bat_quai_kinh', qty: 1 },
                { id: 'pv_kim_cuong_phu', qty: 1 },
                { id: 'pv_than_hanh_phu', qty: 1 },
                { id: 'td_ao_anh_tran', qty: 1 },
                { id: 'bp_thi_binh', qty: 1 }
            );
        }

        // High-tier additions (Realm 30+)
        if (realmId >= 30) {
            basePool.push(
                { id: 'tu_linh_chau', qty: 1 },
                { id: 'tui_tru_vat_cao', qty: 1 },
                { id: 'trung_thanh_van_ly', qty: 1 },
                { id: 'trung_u_minh_mong_diep', qty: 1 },
                { id: 'di_hoa_bang', qty: 1 },
                { id: 'di_loi_bang', qty: 1 },
                { id: 'linh_the_luc', qty: 1 },
                { id: 'phap_bao_luc', qty: 1 },
                { id: 'dp_ngung_anh_dan', qty: 1 },
                { id: 'bv_phi_kiem_tinh_ha', qty: 1 },
                { id: 'bv_long_lan_giap', qty: 1 },
                { id: 'pv_thun_di_phu', qty: 1 },
                { id: 'pv_thien_loi_phu', qty: 1 },
                { id: 'td_sat_kiem_tran', qty: 1 },
                { id: 'bp_thi_tuong', qty: 1 }
            );
        }

        return basePool;
    }

    /**
     * Serialize to save slot
     */
    save() {
        return {
            systemId: this.systemId,
            signInState: { ...this.signInState },
            missionState: { ...this.missionState },
            locationState: { ...this.locationState },
            claimStyle: this.claimStyle
        };
    }

    /**
     * Deserialize from save slot
     */
    load(data) {
        if (!data) return;
        this.systemId = data.systemId || this.systemId;
        if (data.signInState) this.signInState = { ...this.signInState, ...data.signInState };
        if (data.missionState) this.missionState = { ...this.missionState, ...data.missionState };
        if (data.locationState) this.locationState = { ...this.locationState, ...data.locationState };
        this.claimStyle = data.claimStyle || this.claimStyle;
    }
}
