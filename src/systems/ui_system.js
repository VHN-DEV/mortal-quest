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
     */
    toast(message, type = 'info') {
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
            <i class="ph ${icons[type] || icons.info} text-xl"></i>
            <div class="flex flex-col">
                <span class="text-[10px] font-bold text-white/50 uppercase tracking-widest">${type}</span>
                <span class="text-xs font-bold text-white font-ancient leading-tight">${message}</span>
            </div>
            <div class="toast-progress" style="animation-duration: 5s"></div>
        `;

        this.notifContainer.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        // Animate out and remove
        setTimeout(() => {
            toast.style.transform = 'translateY(-10px)';
            toast.style.opacity = '0';
            toast.style.pointerEvents = 'none';
            setTimeout(() => toast.remove(), 500);
        }, 5000);
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
        this.modalIcon.className = `ph ${icon} text-5xl text-cultivation-gold mb-4 animate-bounce-subtle`;
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
            const originalContent = this.modalContent.innerHTML;
            
            this.modalTitle.textContent = title;
            this.modalIcon.className = `ph ph-list text-5xl text-qi-blue mb-4`;
            
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'flex flex-col space-y-2 w-full mt-4';
            
            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-ancient text-gray-300 transition-all active:scale-95';
                btn.textContent = opt.label;
                btn.onclick = () => {
                    this.modalOverlay.classList.add('hidden');
                    this.modalOverlay.classList.remove('flex');
                    this.modalContent.innerHTML = originalContent; // Restore
                    // Need to re-bind elements if innerHTML is replaced
                    this._rebindElements();
                    resolve(opt.value);
                };
                optionsContainer.appendChild(btn);
            });

            // Replace modal message with options
            this.modalMessage.innerHTML = '';
            this.modalMessage.appendChild(optionsContainer);
            this.modalBtnConfirm.style.display = 'none';
            this.modalBtnCancel.style.display = 'block';
            this.modalBtnCancel.textContent = 'HỦY BỎ';
            this.modalBtnCancel.onclick = () => {
                this.modalOverlay.classList.add('hidden');
                this.modalOverlay.classList.remove('flex');
                this.modalContent.innerHTML = originalContent;
                this._rebindElements();
                resolve(null);
            };

            this.modalOverlay.classList.remove('hidden');
            this.modalOverlay.classList.add('flex');
        });
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
}

