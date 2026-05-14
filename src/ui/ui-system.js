import { Preferences } from '@capacitor/preferences';
import { gsap } from 'gsap';

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
        toast.className = `w-full p-4 bg-cultivation-dark/95 border-l-4 rounded-r-xl shadow-2xl relative overflow-hidden transform pointer-events-auto flex items-center space-x-3 opacity-0`;

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
        const closeToast = () => {
            gsap.to(toast, {
                y: -20,
                opacity: 0,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => toast.remove()
            });
        };

        closeBtn.onclick = (e) => {
            e.stopPropagation();
            closeToast();
        };

        this.notifContainer.appendChild(toast);

        // Animate in using GSAP
        gsap.fromTo(toast,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );

        // Auto remove after duration
        gsap.delayedCall(duration / 1000, () => {
            if (toast.parentElement) closeToast();
        });
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
    promptOptions(title, options, description = '') {
        return new Promise((resolve) => {
            const originalMessage = this.modalMessage.innerHTML;
            const originalConfirmDisplay = this.modalBtnConfirm.style.display;
            const originalCancelDisplay = this.modalBtnCancel.style.display;
            const originalCancelText = this.modalBtnCancel.textContent;

            this.modalTitle.textContent = title;
            this.modalIcon.className = `ph ph-list text-5xl text-qi-blue animate-bounce-subtle`;

            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'flex flex-col space-y-2 w-full mt-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar';

            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-ancient text-gray-300 transition-all active:scale-95 flex items-center justify-center space-x-2 group';
                btn.innerHTML = `
                    ${opt.icon ? `<i class="ph ${opt.icon} text-lg group-hover:scale-110 transition-transform"></i>` : ''}
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

            this.modalMessage.innerHTML = description ?
                `<div class="text-xs text-gray-400 mb-4 px-2 italic leading-relaxed border-l-2 border-qi-blue/30 pl-4">${description}</div>` : '';
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

            if (el.id === 'guide-overlay' || el.id === 'modal-overlay') {
                gsap.fromTo(el,
                    { opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" },
                    { opacity: 1, scale: 1, backdropFilter: "blur(8px)", duration: 0.4, ease: "power2.out" }
                );
            } else {
                gsap.fromTo(el,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3, ease: "power1.out" }
                );
            }

            // Add to stack if it's a major overlay
            if (el.id && (el.id.includes('overlay') || el.id === 'item-detail')) {
                document.body.classList.add('modal-open');
            }
        } else {
            gsap.to(el, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    el.classList.add('hidden');
                    el.classList.remove('flex');

                    // Check if any other overlays are still visible
                    const visibleOverlays = Array.from(document.querySelectorAll('.overlay-full:not(.hidden), .absolute.inset-0:not(.hidden)'))
                        .filter(node => {
                            const id = node.id || '';
                            return id.includes('overlay') || id === 'item-detail' || node.classList.contains('overlay-full');
                        });

                    if (visibleOverlays.length === 0) {
                        document.body.classList.remove('modal-open');
                    }
                }
            });
        }
    }

    /**
     * Diagnostic tool to log all currently visible overlays and potential blockers.
     */
    logActiveOverlays() {
        const overlays = Array.from(document.querySelectorAll('.overlay-full:not(.hidden), .absolute.inset-0:not(.hidden), [id*="overlay"]:not(.hidden)'));
        console.group('--- UI DIAGNOSTIC: ACTIVE OVERLAYS ---');
        if (overlays.length === 0) {
            console.log('No visible overlays detected.');
        } else {
            overlays.forEach(el => {
                const zIndex = window.getComputedStyle(el).zIndex;
                const pointerEvents = window.getComputedStyle(el).pointerEvents;
                console.log(`ID: %c${el.id || 'N/A'}%c, Class: ${el.className}, Z-Index: ${zIndex}, Pointer-Events: ${pointerEvents}`, 'color: #d4af37; font-weight: bold', 'color: inherit');
            });
        }
        console.log('Body classes:', document.body.className);
        console.groupEnd();
    }

    /**
     * Create a damage popup effect
     */
    createDamagePopup(anchor, value, crit) {
        const popup = document.createElement('div');
        popup.className = `damage-popup font-ancient font-bold pointer-events-none ${crit ? 'text-3xl text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-xl text-red-500'}`;
        popup.textContent = (value > 0 ? '-' : '+') + Math.abs(value);

        const app = document.getElementById('app');
        const appRect = app.getBoundingClientRect();
        const rect = anchor.getBoundingClientRect();

        popup.style.position = 'absolute';
        popup.style.left = `${rect.left - appRect.left + rect.width / 2}px`;
        popup.style.top = `${rect.top - appRect.top}px`;
        popup.style.zIndex = '1000';
        popup.style.transform = 'translate(-50%, -50%)';

        app.appendChild(popup);

        // GSAP Animation for damage popup
        const timeline = gsap.timeline({
            onComplete: () => popup.remove()
        });

        if (crit) {
            timeline.fromTo(popup,
                { scale: 0.5, opacity: 0 },
                { scale: 1.5, opacity: 1, duration: 0.2, ease: "back.out(2)" }
            )
                .to(popup, {
                    y: -60,
                    x: (Math.random() - 0.5) * 40,
                    opacity: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: "power1.in"
                }, "+=0.3");
        } else {
            timeline.fromTo(popup,
                { y: 0, opacity: 0 },
                { y: -30, opacity: 1, duration: 0.3, ease: "power2.out" }
            )
                .to(popup, {
                    y: -80,
                    x: (Math.random() - 0.5) * 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power1.in"
                }, "+=0.2");
        }
    }

    /**
     * Create a cultivation click particle
     */
    createClickParticle(x, y, type = 'tuvi') {
        const p = document.createElement('div');
        p.className = 'qi-particle w-1.5 h-1.5 rounded-full pointer-events-none';

        const colors = {
            tuvi: '#4fd1c5', // qi-blue
            body: '#ef4444', // qi-red
            soul: '#a855f7'  // qi-purple
        };

        const app = document.getElementById('app');
        const appRect = app.getBoundingClientRect();
        const color = colors[type] || colors.tuvi;

        p.style.position = 'absolute';
        p.style.left = `${x - appRect.left}px`;
        p.style.top = `${y - appRect.top}px`;
        p.style.zIndex = '9999';
        p.style.background = color;
        p.style.boxShadow = `0 0 10px ${color}`;

        app.appendChild(p);

        // Burst animation with GSAP
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        const targetX = Math.cos(angle) * velocity;
        const targetY = Math.sin(angle) * velocity;

        gsap.to(p, {
            x: targetX,
            y: targetY,
            opacity: 0,
            scale: 0,
            duration: 0.6 + Math.random() * 0.4,
            ease: "power2.out",
            onComplete: () => p.remove()
        });
    }

    /**
     * Show a flashy breakthrough effect
     */
    showBreakthroughEffect(realmName) {
        const effect = document.createElement('div');
        effect.className = 'absolute inset-0 z-[300] flex flex-col items-center justify-center pointer-events-none';
        effect.innerHTML = `
            <div class="breakthrough-glow absolute w-64 h-64 bg-cultivation-gold/20 rounded-full blur-[100px] opacity-0"></div>
            <div class="breakthrough-title opacity-0 scale-50">
                <h2 class="text-5xl font-charm text-cultivation-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]">ĐỘT PHÁ</h2>
                <p class="text-xl font-ancient text-white text-center mt-2 tracking-[0.5em] uppercase">${realmName}</p>
            </div>
        `;

        const app = document.getElementById('app');
        app.appendChild(effect);

        const glow = effect.querySelector('.breakthrough-glow');
        const title = effect.querySelector('.breakthrough-title');

        const tl = gsap.timeline({
            onComplete: () => effect.remove()
        });

        tl.to(glow, { opacity: 1, scale: 2, duration: 0.8, ease: "power2.out" })
            .to(title, { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)" }, "-=0.6")
            .to(glow, { opacity: 0, scale: 3, duration: 1.5, ease: "power1.in" }, "+=0.5")
            .to(title, { opacity: 0, y: -50, duration: 0.8, ease: "power2.in" }, "-=1");
    }

    /**
     * Switch between main screens
     */
    async switchScreen(screenId, btn) {
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

        // Save current screen to Preferences
        await Preferences.set({
            key: 'mortal_quest_current_screen',
            value: screenId
        });

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
        } else if (screenId === 'screen-npc') {
            if (window.npcScreen) window.npcScreen.render();
        }
    }
}

