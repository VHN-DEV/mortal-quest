export class UISystem {
    constructor() {
        this.notifContainer = document.getElementById('notification-container');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.modalContent = document.getElementById('modal-content');
        this.modalIcon = document.getElementById('modal-icon');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.modalBtnConfirm = document.getElementById('modal-btn-confirm');
        this.modalBtnCancel = document.getElementById('modal-btn-cancel');
        this.loadingOverlay = document.getElementById('loading-overlay');
    }

    /**
     * Show a temporary toast notification
     * @param {string} message 
     * @param {string} type 'info', 'success', 'warning', 'error'
     * @param {number} duration milliseconds
     */
    toast(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `w-full p-4 bg-cultivation-dark/95 border-l-4 rounded-r-xl shadow-2xl relative overflow-hidden transform translate-y-[-10px] opacity-0 transition-all duration-500 pointer-events-auto flex items-center space-x-3`;

        const colors = {
            info: 'border-qi-blue text-qi-blue',
            success: 'border-qi-jade text-qi-jade',
            warning: 'border-cultivation-gold text-cultivation-gold',
            error: 'border-red-500 text-red-500'
        };

        const icons = {
            info: 'ph-info',
            success: 'ph-sparkle',
            warning: 'ph-warning-octagon',
            error: 'ph-prohibit'
        };

        toast.classList.add(...(colors[type] || colors.info).split(' '));
        toast.innerHTML = `
            <i class="ph ${icons[type] || icons.info} text-xl flex-shrink-0"></i>
            <div class="flex-grow flex flex-col min-w-0">
                <span class="text-[9px] font-bold text-white/40 uppercase tracking-widest">${type}</span>
                <span class="text-xs font-bold text-white font-ancient leading-tight break-words">${message}</span>
            </div>
            <button class="toast-close p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
                <i class="ph ph-x text-sm"></i>
            </button>
            <div class="toast-progress" style="animation-duration: ${duration}ms"></div>
        `;

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            toast.style.transform = 'translateY(-10px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        };

        this.notifContainer.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        // Animate out and remove
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.transform = 'translateY(-10px)';
                toast.style.opacity = '0';
                toast.style.pointerEvents = 'none';
                setTimeout(() => toast.remove(), 500);
            }
        }, duration);
    }

    /**
     * Show a custom modal dialog
     */
    alert(message, title = 'Thiên Đạo Thông Báo') {
        return new Promise((resolve) => {
            this.showModal({
                title,
                message,
                confirmText: 'ĐÃ RÕ',
                showCancel: false,
                onConfirm: resolve
            });
        });
    }

    confirm(message, title = 'Xác Nhận Đạo Tâm') {
        return new Promise((resolve) => {
            this.showModal({
                title,
                message,
                showCancel: true,
                onConfirm: () => resolve(true),
                onCancel: () => resolve(false)
            });
        });
    }

    showModal({ title, message, icon = 'ph-info', confirmText = 'LĨNH CHỈ', cancelText = 'BÃI BÃI', showCancel = true, onConfirm, onCancel }) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.modalIcon.className = `ph ${icon} text-5xl text-cultivation-gold animate-bounce-subtle`;
        this.modalBtnConfirm.textContent = confirmText;
        this.modalBtnCancel.textContent = cancelText;
        this.modalBtnCancel.style.display = showCancel ? 'block' : 'none';

        this.modalOverlay.classList.remove('hidden');
        this.modalOverlay.classList.add('flex');

        const cleanup = () => {
            this.modalOverlay.classList.add('hidden');
            this.modalOverlay.classList.remove('flex');
            this.modalBtnConfirm.onclick = null;
            this.modalBtnCancel.onclick = null;
        };

        this.modalBtnConfirm.onclick = () => {
            cleanup();
            if (onConfirm) onConfirm();
        };

        this.modalBtnCancel.onclick = () => {
            cleanup();
            if (onCancel) onCancel();
        };
    }

    /**
     * Show a list of options for the user to choose from
     */
    promptOptions(title, options) {
        return new Promise((resolve) => {
            const originalMessage = this.modalMessage.innerHTML;
            const originalConfirmDisplay = this.modalBtnConfirm.style.display;
            const originalCancelDisplay = this.modalBtnCancel.style.display;
            const originalCancelText = this.modalBtnCancel.textContent;

            this.modalTitle.textContent = title;
            this.modalIcon.className = `ph ph-list text-5xl text-qi-blue mb-4 animate-bounce-subtle`;

            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'flex flex-col space-y-2 w-full mt-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar';

            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-ancient text-gray-300 transition-all active:scale-95 flex items-center justify-center space-x-2 group';
                btn.innerHTML = `
                    ${opt.icon ? `<span class="text-lg group-hover:scale-110 transition-transform">${opt.icon}</span>` : ''}
                    <span>${opt.label}</span>
                `;
                btn.onclick = () => {
                    this.toggleOverlay(this.modalOverlay, false);
                    this.modalMessage.innerHTML = originalMessage; // Restore
                    this._restoreButtons(originalConfirmDisplay, originalCancelDisplay, originalCancelText);
                    resolve(opt.value);
                };
                optionsContainer.appendChild(btn);
            });

            this.modalMessage.innerHTML = '';
            this.modalMessage.appendChild(optionsContainer);
            this.modalBtnConfirm.style.display = 'none';
            this.modalBtnCancel.style.display = 'block';
            this.modalBtnCancel.textContent = 'HỦY BỎ';

            this.modalBtnCancel.onclick = () => {
                this.toggleOverlay(this.modalOverlay, false);
                this.modalMessage.innerHTML = originalMessage;
                this._restoreButtons(originalConfirmDisplay, originalCancelDisplay, originalCancelText);
                resolve(null);
            };

            this.toggleOverlay(this.modalOverlay, true);
        });
    }

    _restoreButtons(confirmDisp, cancelDisp, cancelText) {
        this.modalBtnConfirm.style.display = confirmDisp;
        this.modalBtnCancel.style.display = cancelDisp;
        this.modalBtnCancel.textContent = cancelText;
        this.modalBtnCancel.onclick = null; // Reset
    }

    _rebindElements() {
        this.modalIcon = document.getElementById('modal-icon');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.modalBtnConfirm = document.getElementById('modal-btn-confirm');
        this.modalBtnCancel = document.getElementById('modal-btn-cancel');
    }

    showLoading(show, message = 'Đang Cảm Ứng Thiên Địa...') {
        const msgEl = this.loadingOverlay.querySelector('.text-xs');
        if (msgEl) msgEl.textContent = message;

        if (show) {
            this.loadingOverlay.classList.remove('hidden');
            this.loadingOverlay.classList.add('flex');
        } else {
            this.loadingOverlay.classList.add('hidden');
            this.loadingOverlay.classList.remove('flex');
        }
    }

    /**
     * Centralized overlay management with stack support
     */
    toggleOverlay(overlay, show) {
        const el = typeof overlay === 'string' ? document.getElementById(overlay) : overlay;
        if (!el) return;

        if (show) {
            el.classList.remove('hidden');
            el.classList.add('flex');
            // Force reflow for animation
            el.offsetHeight;
            
            if (el.id === 'guide-overlay' || el.id === 'modal-overlay') {
                el.classList.add('animate-zoom-in');
            } else {
                el.classList.add('animate-fade-in');
            }

            // Add to stack if it's a major overlay
            if (el.id && el.id.includes('overlay')) {
                document.body.classList.add('modal-open');
            }
        } else {
            el.classList.add('hidden');
            el.classList.remove('flex', 'animate-fade-in', 'animate-zoom-in');

            // Check if any other overlays are still visible
            const visibleOverlays = document.querySelectorAll('.fixed:not(.hidden)');
            if (visibleOverlays.length === 0) {
                document.body.classList.remove('modal-open');
            }
        }
    }

    /**
     * Create a damage popup effect
     */
    createDamagePopup(anchor, value, crit) {
        const popup = document.createElement('div');
        popup.className = `damage-popup ${crit ? 'text-2xl text-yellow-400 scale-125' : 'text-red-500'}`;
        popup.textContent = `-${value}`;

        const rect = anchor.getBoundingClientRect();
        popup.style.left = `${rect.left + rect.width / 2}px`;
        popup.style.top = `${rect.top}px`;

        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 1000);
    }

    /**
     * Create a cultivation click particle
     */
    createClickParticle(x, y, type = 'tuvi') {
        const p = document.createElement('div');
        p.className = 'qi-particle w-2 h-2';
        
        // Path-aligned colors
        const colors = {
            tuvi: 'var(--qi-blue)',
            body: 'var(--qi-red)',
            soul: 'var(--qi-purple)'
        };
        
        p.style.position = 'fixed';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.zIndex = '9999';
        p.style.background = `radial-gradient(circle, ${colors[type] || colors.tuvi} 0%, transparent 70%)`;
        p.style.boxShadow = `0 0 10px ${colors[type] || colors.tuvi}`;

        document.body.appendChild(p);
        setTimeout(() => p.remove(), 2000);
    }

    /**
     * Switch between main screens
     */
    switchScreen(screenId, btn) {
        const screens = document.querySelectorAll('.screen');
        const navButtons = document.querySelectorAll('.nav-item');
        
        screens.forEach(s => {
            s.classList.add('hidden');
            s.classList.remove('flex');
        });
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            targetScreen.classList.add('flex');
        }

        navButtons.forEach(b => {
            b.classList.remove('text-cultivation-gold', 'active');
            b.classList.add('text-gray-500');
        });

        if (btn) {
            btn.classList.add('text-cultivation-gold', 'active');
            btn.classList.remove('text-gray-500');
        }

        // Specific screen refresh logic
        if (screenId === 'screen-main') {
            if (typeof window.renderMainStats === 'function') window.renderMainStats();
        } else if (screenId === 'screen-character') {
            if (window.game && window.game.screens.character) window.game.screens.character.render();
        } else if (screenId === 'screen-inventory') {
            if (window.game && window.game.screens.inventory) window.game.screens.inventory.render();
        } else if (screenId === 'screen-adventure') {
            if (window.game && window.game.screens.map) window.game.screens.map.renderWorldList();
        } else if (screenId === 'screen-crafting-hub') {
            if (window.game && window.game.screens.systems) window.game.screens.systems.renderCraftingHub();
        }
    }
}

