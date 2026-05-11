import { state } from '../state.js';
import { SPIRIT_STONE_GRADES } from '../configs/spirit-stone-data.js';

/**
 * Quản lý giao diện Hệ thống Linh Thạch
 */
export class SpiritStoneUI {
    constructor() {
        this.initElements();
        this.initEvents();
    }

    initElements() {
        this.elOverlay = document.getElementById('spirit-stone-overlay');
        this.elBalance = document.getElementById('spirit-stone-balance');
        this.elHeaderLT = document.getElementById('header-lingshi-container');
        this.btnClose = document.getElementById('close-spirit-stone-btn');
        
        this.chkLockCuc = document.getElementById('ss-lock-cuc');
        this.chkAutoLow = document.getElementById('ss-auto-low');
    }

    initEvents() {
        if (this.elHeaderLT) {
            this.elHeaderLT.onclick = () => this.open();
        }

        if (this.btnClose) {
            this.btnClose.onclick = () => this.close();
        }

        if (this.chkLockCuc) {
            this.chkLockCuc.onchange = (e) => {
                if (state.player) state.player.spiritStoneSettings.lockCucPham = e.target.checked;
            };
        }

        if (this.chkAutoLow) {
            this.chkAutoLow.onchange = (e) => {
                if (state.player) {
                    state.player.spiritStoneSettings.autoUsePriority = e.target.checked 
                        ? ['HA', 'TRUNG', 'THUONG', 'CUC'] 
                        : ['THUONG', 'TRUNG', 'HA', 'CUC'];
                }
            };
        }
    }

    open() {
        if (!state.player) return;
        this.render();
        state.ui.toggleOverlay(this.elOverlay, true);
    }

    close() {
        state.ui.toggleOverlay(this.elOverlay, false);
    }

    render() {
        if (!state.player || !this.elBalance) return;

        // Render Balance
        this.elBalance.innerHTML = state.player.getFormattedLingShi();

        // Sync Settings
        if (this.chkLockCuc) this.chkLockCuc.checked = state.player.spiritStoneSettings.lockCucPham;
        
        // Cập nhật text hiển thị số lượng cụ thể từng loại nếu cần
        // ...
    }
}
