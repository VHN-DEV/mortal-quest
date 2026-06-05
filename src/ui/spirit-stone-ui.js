import { state } from '../state.js';

/**
 * Quản lý giao diện Hệ thống Linh Thạch
 */
export class SpiritStoneUI {
    constructor() {
        this.initElements();
        this.initEvents();
        window.spiritStoneUI = this;
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
                if (state.player) {
                    state.player.spiritStoneSettings.lockCucPham = e.target.checked;
                    this.render();
                }
            };
        }

        if (this.chkAutoLow) {
            this.chkAutoLow.onchange = (e) => {
                if (state.player) {
                    state.player.spiritStoneSettings.autoUsePriority = e.target.checked 
                        ? ['HA', 'TRUNG', 'THUONG', 'CUC'] 
                        : ['THUONG', 'TRUNG', 'HA', 'CUC'];
                    this.render();
                }
            };
        }

        // Auto-refresh the balance whenever user merges, splits, or refines
        if (this.elOverlay) {
            this.elOverlay.addEventListener('click', (e) => {
                const btn = e.target.closest('button[onclick]');
                if (!btn) return;
                const onclickAttr = btn.getAttribute('onclick') || '';
                if (onclickAttr.includes('spiritStone.merge') || onclickAttr.includes('spiritStone.split') || onclickAttr.includes('refine')) {
                    setTimeout(() => {
                        this.render();
                        // Also update player display in main header if exists
                        if (typeof window.renderMainStats === 'function') {
                            window.renderMainStats();
                        }
                    }, 100);
                }
            }, true);
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

        // Render detailed per-grade balance in a beautiful way
        const gradeConfig = [
            { id: 'cuc_pham_linh_thach', label: 'Cực Phẩm', cls: 'text-pink-400 font-bold', icon: '🔴' },
            { id: 'thuong_pham_linh_thach', label: 'Thượng Phẩm', cls: 'text-cultivation-gold font-bold', icon: '🟡' },
            { id: 'trung_pham_linh_thach', label: 'Trung Phẩm', cls: 'text-qi-purple font-bold', icon: '🟣' },
            { id: 'ha_pham_linh_thach', label: 'Hạ Phẩm', cls: 'text-qi-blue font-bold', icon: '⚪' }
        ];

        const counts = {};
        gradeConfig.forEach(g => { counts[g.id] = 0; });
        if (state.player.inventory) {
            state.player.inventory.allItems.forEach(item => {
                if (counts.hasOwnProperty(item.id)) {
                    counts[item.id] += item.quantity;
                }
            });
        }

        this.elBalance.innerHTML = gradeConfig.map(g => {
            const qty = counts[g.id];
            return `<div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                <span class="text-xs">${g.icon}</span>
                <span class="${g.cls} font-mono text-sm">${qty.toLocaleString()}</span>
                <span class="text-gray-400 text-[10px]">${g.label}</span>
            </div>`;
        }).join('');

        // Sync Settings
        if (this.chkLockCuc) {
            this.chkLockCuc.checked = !!state.player.spiritStoneSettings?.lockCucPham;
        }
        if (this.chkAutoLow) {
            const priority = state.player.spiritStoneSettings?.autoUsePriority || [];
            this.chkAutoLow.checked = priority[0] === 'HA';
        }
    }
}
