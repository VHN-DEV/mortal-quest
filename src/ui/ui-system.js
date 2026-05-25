import { Preferences } from '@capacitor/preferences';
import { gsap } from 'gsap';
import { state } from '../state.js';
import { audioManager } from '../utils/audio-manager.js';
import { logger } from '../utils/logger.js';
import { getAssetUrl } from '../configs/asset-data.js';
import { getItemById } from '../configs/item-data.js';
import { findLocationName, DANGER_LEVELS, getWorlds, getLocationById } from '../configs/map-data.js';
import { getRealmById } from '../configs/realm-data.js';

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
        this.modalInputContainer = document.getElementById('modal-input-container');
        this.modalInput = document.getElementById('modal-input');
        this.loadingOverlay = document.getElementById('loading-overlay');
        
        // Time Display Elements
        this.elTimeEra = document.getElementById('time-era');
        this.elTimeYearMonth = document.getElementById('time-date');
        this.elTimeSeason = document.getElementById('time-season');
        this.elTimeHour = document.getElementById('time-hour');
        this.elTimePeriod = document.getElementById('time-period');
        this.elTimePhenomenon = document.getElementById('time-phenomenon');

        // Tooltip
        this.elTooltip = document.getElementById('global-tooltip');
        
        // Track current screen in-memory for render performance optimization
        this.currentScreenId = 'screen-main';

        // Initialize smooth horizontal drag-scroll roll behavior
        this.initHorizontalScrollRoll();
    }

    updateTimeUI(time) {
        if (!this.elTimeYearMonth) return;
        
        this.elTimeYearMonth.textContent = `Ngày ${time.day} Tháng ${time.month} Năm ${time.year}`;
        
        if (this.elTimeHour) {
            this.elTimeHour.textContent = time.hourName;
        }

        if (this.elTimePeriod) {
            this.elTimePeriod.textContent = `(${time.period === 'Day' ? 'Ban Ngày' : 'Ban Đêm'})`;
        }
        
        if (this.elTimeSeason) {
            this.elTimeSeason.textContent = time.seasonName;
            this.elTimeSeason.style.color = time.seasonColor;
            this.elTimeSeason.style.borderColor = `${time.seasonColor}33`;
            this.elTimeSeason.style.backgroundColor = `${time.seasonColor}11`;
        }

        if (this.elTimePhenomenon) {
            if (time.phenomenon) {
                this.elTimePhenomenon.textContent = time.phenomenon;
                this.elTimePhenomenon.classList.remove('hidden');
            } else {
                this.elTimePhenomenon.classList.add('hidden');
            }
        }
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

        if (type === 'success') {
            audioManager.playSfx('success');
        }
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
        this.modalMessage.innerHTML = message;
        this.modalIcon.className = `ph ${icon} text-5xl text-cultivation-gold animate-bounce-subtle`;
        this.modalBtnConfirm.textContent = confirmText;
        this.modalBtnConfirm.style.display = 'block';
        this.modalBtnCancel.textContent = cancelText;
        this.modalBtnCancel.style.display = showCancel ? 'block' : 'none';

        this.toggleOverlay(this.modalOverlay, true);

        const cleanup = () => {
            this.toggleOverlay(this.modalOverlay, false);
            this.modalBtnConfirm.onclick = null;
            this.modalBtnCancel.onclick = null;
            if (this.modalInputContainer) this.modalInputContainer.classList.add('hidden');
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
     * Show a prompt with an input field
     */
    prompt(message, onConfirm, defaultValue = '', title = 'Thiên Đạo Truy Vấn') {
        this.modalTitle.textContent = title;
        this.modalMessage.innerHTML = message;
        this.modalIcon.className = `ph ph-question text-5xl text-cultivation-gold animate-bounce-subtle`;
        this.modalBtnConfirm.textContent = 'XÁC NHẬN';
        this.modalBtnConfirm.style.display = 'block';
        this.modalBtnCancel.textContent = 'HỦY BỎ';
        this.modalBtnCancel.style.display = 'block';

        if (this.modalInputContainer && this.modalInput) {
            this.modalInputContainer.classList.remove('hidden');
            this.modalInput.value = defaultValue;
            setTimeout(() => this.modalInput.focus(), 100);
        }

        this.toggleOverlay(this.modalOverlay, true);

        const cleanup = () => {
            this.toggleOverlay(this.modalOverlay, false);
            this.modalBtnConfirm.onclick = null;
            this.modalBtnCancel.onclick = null;
            if (this.modalInputContainer) this.modalInputContainer.classList.add('hidden');
        };

        this.modalBtnConfirm.onclick = () => {
            const value = this.modalInput ? this.modalInput.value : '';
            cleanup();
            if (onConfirm) onConfirm(value);
        };

        this.modalBtnCancel.onclick = () => {
            cleanup();
        };
    }

    /**
     * Show a list of options for the user to choose from
     */
    promptOptions(title, options, description = '', illustration = '') {
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
                const label = opt.label !== undefined ? opt.label : (opt.text !== undefined ? opt.text : '');
                const value = opt.value !== undefined ? opt.value : opt.id;
                const btn = document.createElement('button');
                btn.className = 'w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-ancient text-gray-300 transition-all active:scale-95 flex items-center justify-center space-x-2 group';
                btn.innerHTML = `
                    ${opt.icon ? `<i class="ph ${opt.icon} text-lg group-hover:scale-110 transition-transform"></i>` : ''}
                    <span>${label}</span>
                `;
                btn.onclick = () => {
                    this.toggleOverlay(this.modalOverlay, false, () => {
                        this.modalMessage.innerHTML = originalMessage; // Restore
                        this._restoreButtons(originalConfirmDisplay, originalCancelDisplay, originalCancelText);
                    });
                    resolve(value);
                };
                optionsContainer.appendChild(btn);
            });

            let contentHTML = '';
            if (illustration) {
                contentHTML += `
                    <div class="w-full h-36 rounded-2xl overflow-hidden border border-white/10 mb-4 shadow-lg shadow-black/80 relative">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                        <img src="${illustration}" class="w-full h-full object-cover">
                    </div>
                `;
            }
            if (description) {
                contentHTML += `<div class="text-xs text-gray-400 mb-4 px-2 italic leading-relaxed border-l-2 border-qi-blue/30 pl-4">${description}</div>`;
            }

            this.modalMessage.innerHTML = contentHTML;
            this.modalMessage.appendChild(optionsContainer);
            this.modalBtnConfirm.style.display = 'none';
            this.modalBtnCancel.style.display = 'block';
            this.modalBtnCancel.textContent = 'HỦY BỎ';

            this.modalBtnCancel.onclick = () => {
                this.toggleOverlay(this.modalOverlay, false, () => {
                    this.modalMessage.innerHTML = originalMessage;
                    this._restoreButtons(originalConfirmDisplay, originalCancelDisplay, originalCancelText);
                });
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
        if (this.modalInputContainer) this.modalInputContainer.classList.add('hidden');
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
    toggleOverlay(overlay, show, onComplete = null) {
        const el = typeof overlay === 'string' ? document.getElementById(overlay) : overlay;
        if (!el) return;

        // Kill any existing animations to prevent race conditions
        gsap.killTweensOf(el);

        if (show) {
            el.classList.remove('hidden');
            el.classList.add('flex');

            if (el.id === 'guide-overlay' || el.id === 'modal-overlay') {
                gsap.fromTo(el,
                    { opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" },
                    { opacity: 1, scale: 1, backdropFilter: "blur(8px)", duration: 0.4, ease: "power2.out", onComplete: () => {
                        if (onComplete) onComplete();
                    } }
                );
            } else {
                gsap.fromTo(el,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3, ease: "power1.out", onComplete: () => {
                        if (onComplete) onComplete();
                    } }
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

                    if (onComplete) onComplete();
                }
            });
        }
    }

    resetUIState() {
        const overlays = [
            'map-location-view', 'map-explore-view', 'shop-overlay', 'guild-overlay',
            'mountain-overlay', 'tower-overlay', 'sects-overlay', 'stats-modal',
            'guide-overlay', 'modal-overlay', 'chase-overlay', 'ambush-overlay',
            'loot-screen-overlay', 'mining-overlay', 'location-detail-overlay'
        ];

        overlays.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.add('hidden');
                el.classList.remove('flex');
                el.style.opacity = '0';
            }
        });
        document.body.classList.remove('modal-open');
    }

    /**
     * Diagnostic tool to log all currently visible overlays and potential blockers.
     */
    logActiveOverlays() {
        const overlays = Array.from(document.querySelectorAll('.overlay-full:not(.hidden), .absolute.inset-0:not(.hidden), [id*="overlay"]:not(.hidden)'));
        console.group('--- UI DIAGNOSTIC: ACTIVE OVERLAYS ---');
        if (overlays.length === 0) {
            logger.info('ui', 'No visible overlays detected.');
        } else {
            overlays.forEach(el => {
                const zIndex = window.getComputedStyle(el).zIndex;
                const pointerEvents = window.getComputedStyle(el).pointerEvents;
                logger.debug('ui', `Overlay diagnostic - ID: ${el.id || 'N/A'}, Class: ${el.className}, Z-Index: ${window.getComputedStyle(el).zIndex}`);
            });
        }
        logger.debug('ui', `Body classes: ${document.body.className}`);
        console.groupEnd();
    }

    /**
     * Create a screen shake effect
     */
    screenShake(intensity = 'medium') {
        const app = document.getElementById('app');
        if (!app) return;
        
        app.classList.remove('animate-screen-shake');
        // Force reflow
        void app.offsetWidth;
        app.classList.add('animate-screen-shake');
        
        if (intensity === 'high') {
            audioManager.playSfx('thunder'); // Optional thunder sound for heavy shake
        }
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
        this.screenShake('high');
        
        const effect = document.createElement('div');
        effect.className = 'absolute inset-0 z-[300] flex flex-col items-center justify-center pointer-events-none';
        effect.innerHTML = `
            <div class="breakthrough-glow absolute w-64 h-64 bg-cultivation-gold/40 rounded-full blur-[100px] opacity-0"></div>
            <div class="breakthrough-title opacity-0 scale-50">
                <h2 class="text-6xl font-charm text-cultivation-gold text-center drop-shadow-[0_0_30px_rgba(212,175,55,0.9)]">ĐỘT PHÁ</h2>
                <p class="text-2xl font-ancient text-white text-center mt-2 tracking-[0.6em] uppercase text-glow">${realmName}</p>
            </div>
            <div class="particles-burst absolute inset-0"></div>
        `;

        const app = document.getElementById('app');
        app.appendChild(effect);

        const glow = effect.querySelector('.breakthrough-glow');
        const title = effect.querySelector('.breakthrough-title');

        const tl = gsap.timeline({
            onComplete: () => effect.remove()
        });

        tl.to(glow, { opacity: 1, scale: 2.5, duration: 0.6, ease: "power4.out" })
            .to(title, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(2)" }, "-=0.4")
            .to(glow, { opacity: 0, scale: 4, duration: 1.2, ease: "power2.in" }, "+=0.8")
            .to(title, { opacity: 0, y: -100, scale: 1.2, duration: 0.8, ease: "power3.in" }, "-=0.8");

        // Spawn a lot of particles
        const rect = app.getBoundingClientRect();
        this.spawnQiParticles(rect.width / 2, rect.height / 2, 40, '#D4AF37');
        
        audioManager.playSfx('breakthrough');
    }

    /**
     * Show a subtle stat increase effect
     */
    showStatUpEffect(anchor, text, color = 'text-green-400') {
        const el = document.createElement('div');
        el.className = `absolute z-[500] font-ancient font-bold ${color} pointer-events-none animate-stat-up whitespace-nowrap`;
        el.textContent = text;
        
        const app = document.getElementById('app');
        const appRect = app.getBoundingClientRect();
        const rect = anchor.getBoundingClientRect();

        el.style.left = `${rect.left - appRect.left + rect.width / 2}px`;
        el.style.top = `${rect.top - appRect.top}px`;

        app.appendChild(el);
        setTimeout(() => el.remove(), 1600);
    }

    /**
     * Spawn QI particles at a specific position
     */
    spawnQiParticles(x, y, count = 10, color = '#4FD1C5') {
        const app = document.getElementById('app');
        let container = document.querySelector('.qi-particles');
        
        if (!container) {
            container = document.createElement('div');
            container.className = 'qi-particles absolute inset-0 pointer-events-none overflow-hidden';
            app.appendChild(container);
        }

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'absolute w-1 h-1 rounded-full pointer-events-none z-[60]';
            p.style.backgroundColor = color;
            p.style.boxShadow = `0 0 8px ${color}`;
            p.style.left = `${x}px`;
            p.style.top = `${y}px`;
            
            container.appendChild(p);

            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 120;
            const destX = Math.cos(angle) * distance;
            const destY = Math.sin(angle) * distance;
            const scale = 0.5 + Math.random() * 1.5;

            gsap.to(p, {
                x: destX,
                y: destY,
                opacity: 0,
                scale: 0,
                duration: 0.5 + Math.random() * 1,
                ease: "power2.out",
                onComplete: () => p.remove()
            });
        }
    }

    /**
     * Show a cinematic death screen
     */
    async showDeathScreen(message = "Thân thể của ngươi đã tan biến giữa hồng trần...") {
        let overlay = document.getElementById('death-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'death-overlay';
            overlay.className = 'fixed inset-0 flex flex-col items-center justify-center';
            overlay.innerHTML = `
                <h2 class="death-text text-7xl font-charm mb-4 text-center">MỆNH CHUNG</h2>
                <div class="w-32 h-0.5 bg-red-900/50 my-6"></div>
                <p class="death-quote text-sm italic text-gray-400 text-center px-10"></p>
                <div class="mt-20 opacity-0 death-actions transition-opacity duration-1000 delay-[5s]">
                    <button id="death-restart-btn" class="px-10 py-4 bg-red-900/20 border border-red-900/50 text-red-500 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-red-900/40 transition-all">Luân Hồi Chuyển Thế</button>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        const quote = overlay.querySelector('.death-quote');
        quote.textContent = message;
        
        overlay.style.display = 'flex';
        // Force reflow
        void overlay.offsetWidth;
        overlay.classList.add('show');
        
        audioManager.playSfx('death'); // Assuming there's a death sound

        return new Promise(resolve => {
            const btn = overlay.querySelector('#death-restart-btn');
            const actions = overlay.querySelector('.death-actions');
            
            setTimeout(() => actions.classList.add('opacity-100'), 5000);
            
            btn.onclick = () => {
                gsap.to(overlay, { 
                    opacity: 0, 
                    duration: 1, 
                    onComplete: () => {
                        overlay.style.display = 'none';
                        overlay.classList.remove('show');
                        resolve();
                    }
                });
            };
        });
    }

    /**
     * Show a flashy "Loot Acquired" effect
     * @param {Array|Object} items - Single item or array of items
     */
    async showAcquiredLoot(items) {
        const lootItems = Array.isArray(items) ? items : [items];
        if (lootItems.length === 0) return;

        const overlay = document.getElementById('loot-overlay');
        const container = document.getElementById('loot-container');
        const magicCircle = document.getElementById('loot-magic-circle');
        const hint = document.getElementById('loot-continue-hint');
        
        if (!overlay || !container) return;

        const rarityConfigs = {
            'Phàm Khí': { color: '#ffffff', label: 'PHÀM KHÍ', sfx: 'click', shake: false },
            'Pháp Khí': { color: '#10b981', label: 'PHÁP KHÍ', sfx: 'success', shake: false },
            'Linh Khí': { color: '#3b82f6', label: 'LINH KHÍ', sfx: 'success', shake: false },
            'Pháp Bảo': { color: '#8b5cf6', label: 'PHÁP BẢO', sfx: 'breakthrough', shake: 'medium' },
            'Cổ Bảo': { color: '#f59e0b', label: 'CỔ BẢO', sfx: 'breakthrough', shake: 'medium' },
            'Linh Bảo': { color: '#ef4444', label: 'LINH BẢO', sfx: 'breakthrough', shake: 'high' },
            'Thông Thiên Linh Bảo': { color: '#d4af37', label: 'THÔNG THIÊN', sfx: 'breakthrough', shake: 'high', flash: true },
            'Tiên Khí': { color: '#4fd1c5', label: 'TIÊN KHÍ', sfx: 'breakthrough', shake: 'high', flash: true, rainbow: true },
            'Danh Khí': { color: '#f87171', label: 'DANH KHÍ', sfx: 'thunder', shake: 'high', flash: true, premium: true },
        };

        return new Promise(async (resolve) => {
            overlay.classList.remove('hidden');
            overlay.classList.add('flex', 'opacity-100');

            for (const item of lootItems) {
                const config = rarityConfigs[item.quality] || rarityConfigs['Phàm Khí'];
                
                // Clear previous item
                container.innerHTML = '';
                hint.classList.add('opacity-0');
                
                // Set color for magic circle
                magicCircle.style.color = config.color;
                magicCircle.style.opacity = '0.4';

                const itemHtml = `
                    <div class="loot-item-card flex flex-col items-center opacity-0">
                        <div class="relative w-32 h-32 mb-8 group">
                            <div class="loot-item-glow absolute inset-[-40px] rounded-full blur-3xl opacity-60" style="background: radial-gradient(circle, ${config.color} 0%, transparent 70%)"></div>
                            <img src="${item.image}" class="w-full h-full object-contain relative z-10 drop-shadow-[0_0_20px_${config.color}]">
                            <div class="absolute inset-0 border-2 border-${item.quality.toLowerCase()} rounded-2xl opacity-20 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div class="text-center space-y-2">
                            <h3 class="text-4xl font-charm text-glow tracking-wider mb-2 ${config.rainbow ? 'quality-tien-khi' : ''}" style="color: ${config.rainbow ? 'transparent' : config.color}; text-shadow: 0 0 20px ${config.rainbow ? '#ffffff66' : config.color + '66'}">${item.name}</h3>
                            <div class="flex items-center justify-center space-x-4">
                                <div class="h-px w-8 bg-gradient-to-r from-transparent to-white/20"></div>
                                <span class="text-[10px] font-bold tracking-[0.4em] uppercase" style="color: ${config.color}">${config.label}</span>
                                <div class="h-px w-8 bg-gradient-to-l from-transparent to-white/20"></div>
                            </div>
                            <p class="text-xs text-white/40 font-ancient italic mt-4 max-w-[280px] leading-relaxed">"${item.description || 'Vật phẩm thần bí ẩn chứa linh lực dồi dào.'}"</p>
                        </div>
                    </div>
                `;
                container.innerHTML = itemHtml;
                const card = container.querySelector('.loot-item-card');

                // Play Sound
                audioManager.playSfx(config.sfx);
                
                // Effects
                if (config.shake) this.screenShake(config.shake);
                if (config.flash) {
                    const flash = document.createElement('div');
                    flash.className = 'rarity-flash fixed inset-0 z-[2000] bg-white opacity-0 pointer-events-none';
                    document.body.appendChild(flash);
                    gsap.to(flash, { opacity: 0.8, duration: 0.1, yoyo: true, repeat: 1, onComplete: () => flash.remove() });
                }

                // Animation
                await gsap.timeline()
                    .fromTo(card, { scale: 0.5, opacity: 0, y: 50 }, { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" })
                    .to(hint, { opacity: 1, duration: 1, ease: "power1.inOut" }, "-=0.2");

                // Wait for click
                await new Promise(r => {
                    const nextHandler = () => {
                        overlay.removeEventListener('click', nextHandler);
                        r();
                    };
                    overlay.addEventListener('click', nextHandler);
                });

                // Animate out before next item
                if (lootItems.length > 1 && lootItems.indexOf(item) < lootItems.length - 1) {
                    await gsap.to(card, { scale: 1.2, opacity: 0, duration: 0.4, ease: "power2.in" });
                }
            }

            // Close overlay
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    overlay.classList.add('hidden');
                    overlay.classList.remove('flex');
                    container.innerHTML = '';
                    resolve();
                }
            });
        });
    }

    /**
     * Smoothly transition screen
     */
    async switchScreen(screenId, btn) {
        this.currentScreenId = screenId;
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
        } else {
            console.warn('[DEBUG] Screen element NOT FOUND:', screenId);
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
            if (window.game && window.game.screens.map) window.game.screens.map.restoreView();
        } else if (screenId === 'screen-crafting-hub') {
            if (window.game && window.game.screens.systems) window.game.screens.systems.renderCraftingHub();
        } else if (screenId === 'screen-npc') {
            if (window.npcScreen) window.npcScreen.render();
        }
    }

    /**
     * Show a legendary cinematic appearance for high-tier artifacts
     */
    async showArtifactAppearance(item) {
        const overlay = document.getElementById('appearance-overlay');
        const img = document.getElementById('appearance-item-img');
        const name = document.getElementById('appearance-item-name');
        const poem1 = document.getElementById('appearance-poem-1');
        const poem2 = document.getElementById('appearance-poem-2');
        const btn = document.getElementById('appearance-continue');
        const magicCircle = overlay.querySelector('.appearance-magic-circle');
        const anomaly = overlay.querySelector('.appearance-bg-anomaly');
        const imgWrapper = overlay.querySelector('.appearance-item-image-wrapper');

        if (!overlay || !img) return;

        // Reset state
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
        overlay.style.opacity = '1';
        img.src = getAssetUrl(item.image);
        name.textContent = item.name;
        poem1.textContent = item.poem ? item.poem[0] : '';
        poem2.textContent = item.poem ? item.poem[1] : '';
        
        gsap.set([name, poem1, poem2, btn, magicCircle, anomaly, imgWrapper], { opacity: 0 });
        gsap.set(imgWrapper, { scale: 0.5 });
        gsap.set(name, { y: 20 });
        gsap.set(btn, { y: 20 });

        return new Promise(resolve => {
            const tl = gsap.timeline();

            // Phase 1: The Anomaly Begins
            tl.to(overlay, { backgroundColor: '#000', duration: 0.1 })
              .add(() => this.screenShake('high'))
              .to(anomaly, { opacity: 1, duration: 1, ease: "power2.out" })
              .to(magicCircle, { opacity: 1, scale: 1.2, duration: 1.5, ease: "power4.out" }, "-=0.5");

            // Phase 2: Item Emerges
            tl.to(imgWrapper, { opacity: 1, scale: 1, duration: 1.5, ease: "back.out(1.2)" }, "-=0.8")
              .to(name, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.5");

            // Phase 3: The Poem (Typewriter-ish)
            tl.to(poem1, { opacity: 1, duration: 1.5, ease: "power1.inOut" }, "+=0.5")
              .to(poem2, { opacity: 1, duration: 1.5, ease: "power1.inOut" }, "+=1.0")
              .to(btn, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "+=0.5");

            // Audio cues
            audioManager.playSfx('thunder');
            setTimeout(() => audioManager.playSfx('breakthrough'), 1000);

            btn.onclick = () => {
                gsap.to(overlay, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        overlay.classList.add('hidden');
                        overlay.classList.remove('flex');
                        resolve();
                    }
                });
            };
        });
    }

    showTooltip(itemId, event, metadata = {}) {
        if (!this.elTooltip) return;
        const item = getItemById(itemId);
        if (!item) return;

        const quality = metadata.quality || item.quality;
        const qClass = this.getQualityClass(quality);
        
        let statsHtml = '';
        if (item.stats) {
            statsHtml = `<div class="mt-2 pt-2 border-t border-white/5 space-y-1">` + 
                Object.entries(item.stats).map(([k, v]) => `
                    <div class="flex justify-between text-[8px]">
                        <span class="text-gray-500 uppercase">${this.getStatLabel(k)}</span>
                        <span class="text-qi-blue font-bold">+${v}</span>
                    </div>
                `).join('') + `</div>`;
        }

        this.elTooltip.innerHTML = `
            <div class="flex items-center space-x-2 mb-1">
                <div class="text-xl">${item.icon || '📦'}</div>
                <div class="flex flex-col">
                    <span class="text-[10px] font-bold text-white font-ancient quality-${qClass}">${item.name}</span>
                    <span class="text-[7px] text-gray-500 uppercase tracking-tighter">${quality}</span>
                </div>
            </div>
            <div class="text-[9px] text-gray-400 italic leading-tight">${item.description || ''}</div>
            ${statsHtml}
        `;

        this.elTooltip.classList.remove('hidden');
        this.elTooltip.style.opacity = '1';

        // Position tooltip relative to #app
        const app = document.getElementById('app');
        const appRect = app.getBoundingClientRect();
        const rect = this.elTooltip.getBoundingClientRect();
        
        const padding = 15;
        let x = event.clientX - appRect.left + padding;
        let y = event.clientY - appRect.top + padding;

        // Keep inside screen (viewport check)
        if (event.clientX + rect.width + padding > window.innerWidth) {
            x = event.clientX - appRect.left - rect.width - padding;
        }
        if (event.clientY + rect.height + padding > window.innerHeight) {
            y = event.clientY - appRect.top - rect.height - padding;
        }

        this.elTooltip.style.left = `${x}px`;
        this.elTooltip.style.top = `${y}px`;
    }

    hideTooltip() {
        if (!this.elTooltip) return;
        this.elTooltip.classList.add('hidden');
        this.elTooltip.style.opacity = '0';
    }

    getQualityClass(quality) {
        const map = {
            'Phàm Khí': 'pham-khi', 'Pháp Khí': 'phap-khi', 'Linh Khí': 'linh-khi', 'Pháp Bảo': 'phap-bao',
            'Cổ Bảo': 'co-bao', 'Linh Bảo': 'linh-bao', 'Thông Thiên Linh Bảo': 'thong-thien', 'Tiên Khí': 'tien-khi', 'Danh Khí': 'danh-khi',
            'Hạ phẩm': 'pham', 'Trung phẩm': 'hoang', 'Thượng phẩm': 'huyen', 'Cực phẩm': 'dia', 'Hoàn Mỹ': 'thien'
        };
        return map[quality] || 'pham';
    }

    getStatLabel(statKey) {
        const map = {
            atk: 'Công', def: 'Thủ', spd: 'Tốc', maxHp: 'Sinh lực', maxMana: 'Pháp lực', mana: 'Pháp lực',
            luck: 'Khí vận', critChance: 'Tỉ lệ bạo kích', critDamage: 'Sát thương bạo kích', karma: 'Nhân quả',
            lifespan: 'Thọ nguyên', qiAbsorb: 'Hấp thụ Linh khí', alchemyBonus: 'Tỉ lệ Luyện đan'
        };
        return map[statKey] || statKey;
    }

    // --- Travel System UI Methods ---
    
    showTravelOverlay(travelData) {
        const overlay = document.getElementById('travel-overlay');
        if (!overlay) return;

        const routeText = document.getElementById('travel-route-text');
        const dist = document.getElementById('travel-dist');
        const time = document.getElementById('travel-time');
        const danger = document.getElementById('travel-danger');
        const logsContainer = document.getElementById('travel-logs');
        const progressBar = document.getElementById('travel-progress-bar');
        const entity = document.getElementById('travel-entity');
        const btnAbort = document.getElementById('btn-abort-travel');

        if (routeText) {
            const fromName = findLocationName(travelData.route.from);
            const toName = findLocationName(travelData.route.to);
            routeText.textContent = `${fromName} → ${toName}`;
        }
        
        if (dist) dist.textContent = `${travelData.route.baseDistance} dặm`;
        
        if (time) {
            const days = (travelData.gameHours / 24).toFixed(1);
            time.textContent = `${days} ngày`;
        }

        if (danger) {
            const dangerObj = DANGER_LEVELS[travelData.route.baseDanger];
            danger.textContent = dangerObj ? dangerObj.name : travelData.route.baseDanger;
            danger.className = `font-bold text-lg danger-${travelData.route.baseDanger}`;
        }

        if (logsContainer) logsContainer.innerHTML = '';
        if (progressBar) progressBar.style.width = '0%';
        if (entity) entity.style.left = '6%';

        if (btnAbort) {
            btnAbort.onclick = () => {
                if (window.game && window.game.state && window.game.state.systems && window.game.state.systems.travel) {
                    window.game.state.systems.travel.abortTravel();
                } else if (state && state.systems && state.systems.travel) {
                    state.systems.travel.abortTravel();
                }
            };
        }

        this.toggleOverlay(overlay, true);
    }

    updateTravelProgress(progress) {
        const progressBar = document.getElementById('travel-progress-bar');
        const entity = document.getElementById('travel-entity');
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        
        // Entity moves from 0% to 100% since it's aligned properly now
        if (entity) {
            entity.style.left = `${progress}%`;
        }
    }

    addTravelLog(msg, type = 'info') {
        const container = document.getElementById('travel-logs');
        if (!container) return;

        const el = document.createElement('div');
        el.className = `opacity-0 -translate-x-2 transition-all duration-300`;
        
        let colorClass = 'text-gray-300';
        let icon = 'ph-info';
        
        if (type === 'warning') {
            colorClass = 'text-yellow-400';
            icon = 'ph-warning text-yellow-500';
        } else if (type === 'error') {
            colorClass = 'text-red-400';
            icon = 'ph-warning-circle text-red-500';
        } else if (type === 'success') {
            colorClass = 'text-green-400';
            icon = 'ph-check-circle text-green-500';
        } else {
            icon = 'ph-wind text-qi-blue';
        }

        el.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="w-5 flex justify-center shrink-0 pt-0.5">
                    <i class="ph-fill ${icon} text-base"></i>
                </div>
                <p class="${colorClass} leading-relaxed flex-1">${msg}</p>
            </div>
        `;

        container.appendChild(el);
        
        // Triggers reflow and animates in
        setTimeout(() => {
            el.classList.remove('opacity-0', '-translate-x-2');
        }, 10);

        container.scrollTop = container.scrollHeight;
    }

    hideTravelOverlay() {
        const overlay = document.getElementById('travel-overlay');
        if (overlay) this.toggleOverlay(overlay, false);
    }

    showGuide() {
        const guide = document.getElementById('guide-overlay');
        if (guide) {
            this.toggleOverlay(guide, true);
            this.initGuideTabs();
            this.renderWorldTree();
        }
    }

    renderWorldTree() {
        const treeContainer = document.getElementById('guide-world-tree');
        if (!treeContainer) return;

        try {
            const worlds = getWorlds();
            let html = '';

            for (const [worldId, world] of Object.entries(worlds)) {
                html += `<div class="world-node space-y-1.5 border-b border-white/5 pb-2 last:border-b-0 last:pb-0">`;
                html += `
                    <div class="world-title flex items-center space-x-2 font-ancient text-cultivation-gold cursor-pointer hover:text-white transition-all py-1 select-none">
                        <i class="ph ph-caret-down text-xs transition-transform duration-300"></i>
                        <span class="tracking-wider uppercase font-bold text-[12px]">${world.name}</span>
                    </div>
                `;
                html += `<div class="world-children pl-4 border-l border-white/5 space-y-2.5 mt-0.5">`;

                // Group by regionName
                const regions = {};
                world.locations.forEach(loc => {
                    const rName = loc.regionName || 'Bí Cảnh Khác';
                    const sName = loc.subRegionName || 'Phân Khu Khác';
                    if (!regions[rName]) regions[rName] = {};
                    if (!regions[rName][sName]) regions[rName][sName] = [];
                    regions[rName][sName].push(loc);
                });

                for (const [rName, subregions] of Object.entries(regions)) {
                    let isLocked = false;
                    if (worldId === 'nhan_gioi' && rName === 'Loạn Tinh Hải') {
                        if (state) {
                            const currentLoc = state.currentLocId ? 
                                (typeof getLocationById === 'function' ? getLocationById(state.currentWorldId, state.currentLocId) : null)
                                : null;
                            const isAlreadyThere = currentLoc && currentLoc.regionId === 'loan_tinh_hai';
                            if (!isAlreadyThere) {
                                const atTeleport = state.currentLocId === 'thuong_co_truyen_tong_tran';
                                const hasTalisman = state.player?.inventory && (
                                    state.player.inventory.hasItem('pha_khong_phu') || 
                                    state.player.inventory.hasItem('thun_di_phu') || 
                                    state.player.inventory.hasItem('truyen_tong_lenh')
                                );
                                const hasBoat = state.player?.inventory && (
                                    state.player.inventory.hasItem('ngu_phong_phi_chu') || 
                                    state.player.inventory.hasItem('linh_thuyen_so')
                                );
                                if (!atTeleport && !hasTalisman && !hasBoat) {
                                    isLocked = true;
                                }
                            }
                        }
                    }

                    html += `<div class="region-node space-y-1">`;
                    html += `
                        <div class="region-title flex items-center space-x-2 text-white font-semibold cursor-pointer hover:text-cultivation-gold transition-all py-0.5 select-none text-[11px]">
                            <i class="ph ph-caret-down text-[10px] text-gray-500 transition-transform duration-300"></i>
                            <span>${rName} ${isLocked ? '🔒' : ''}</span>
                        </div>
                    `;
                    
                    if (isLocked) {
                        html += `<div class="region-children pl-4 border-l border-white/5 space-y-2 mt-0.5">`;
                        html += `
                            <div class="p-2 bg-red-950/20 border border-red-500/10 rounded-xl text-[9px] text-gray-500 italic leading-normal">
                                ⚠️ Để đến Loạn Tinh Hải, đạo hữu cần ở Thượng Cổ Truyền Tống Trận, hoặc có Phi Chu, hoặc mang theo Truyền Tống Phù.
                            </div>
                        `;
                        html += `</div>`;
                    } else {
                        html += `<div class="region-children pl-4 border-l border-white/5 space-y-2 mt-0.5">`;

                        for (const [sName, locs] of Object.entries(subregions)) {
                            const hasSubregion = sName !== 'Phân Khu Khác' && sName !== rName;
                            if (hasSubregion) {
                                html += `<div class="subregion-node space-y-1">`;
                                html += `
                                    <div class="subregion-title flex items-center space-x-2 text-qi-blue font-medium cursor-pointer hover:text-white transition-all py-0.5 select-none text-[10px]">
                                        <i class="ph ph-caret-down text-[8px] text-gray-500 transition-transform duration-300"></i>
                                        <span>${sName}</span>
                                    </div>
                                `;
                                html += `<div class="subregion-children pl-4 border-l border-white/5 space-y-1 mt-0.5">`;
                            }

                            locs.forEach(loc => {
                                const minLocked = state.player?.realmId < loc.minRealm;
                                const maxLocked = loc.maxRealm !== undefined && state.player?.realmId > loc.maxRealm;
                                
                                let isTimeLocked = false;
                                let timeMessage = '';
                                if (loc.openingRules && state.systems.time) {
                                    const timeSys = state.systems.time;
                                    const { cycleYears, months } = loc.openingRules;
                                    const yearMatches = (timeSys.getYear() % cycleYears) === 0;
                                    const monthMatches = months.includes(timeSys.getMonth());
                                    if (!yearMatches || !monthMatches) {
                                        isTimeLocked = true;
                                    }
                                }

                                const isLocLocked = minLocked || maxLocked || isTimeLocked;
                                let statusTag = '';
                                if (minLocked) statusTag = `<span class="text-[7px] px-1 bg-red-950/50 border border-red-500/20 text-red-400 rounded-sm font-sans scale-90">Cần ${getRealmById(loc.minRealm).name}</span>`;
                                else if (maxLocked) statusTag = `<span class="text-[7px] px-1 bg-red-950/50 border border-red-500/20 text-red-400 rounded-sm font-sans scale-90">Giới hạn Cảnh giới</span>`;
                                else if (isTimeLocked) statusTag = `<span class="text-[7px] px-1 bg-yellow-950/50 border border-yellow-500/20 text-yellow-400 rounded-sm font-sans scale-90">Đang đóng</span>`;

                                html += `
                                    <div class="loc-node flex items-center space-x-2 py-0.5 ${isLocLocked ? 'text-gray-600' : 'text-gray-400 hover:text-white'} transition-all text-[10px]">
                                        <span class="w-1 h-1 ${isLocLocked ? 'bg-gray-600' : 'bg-qi-blue/50'} rounded-full"></span>
                                        <span>${loc.name} ${isLocLocked ? '🔒' : ''}</span>
                                        ${statusTag}
                                        ${loc.danger === 'nguy_hiem' && !isLocLocked ? '<span class="text-[8px] px-1 bg-red-950/50 border border-red-500/20 text-red-400 rounded-sm font-sans scale-90">Nguy Hiểm</span>' : ''}
                                        ${loc.danger === 'an_toan' && !isLocLocked ? '<span class="text-[8px] px-1 bg-green-950/50 border border-green-500/20 text-green-400 rounded-sm font-sans scale-90">An Toàn</span>' : ''}
                                    </div>
                                `;
                            });

                            if (hasSubregion) {
                                html += `</div></div>`;
                            }
                        }

                        html += `</div>`;
                    }
                    html += `</div>`;
                }

                html += `</div></div>`; // close world children, world node
            }

            treeContainer.innerHTML = html;

            // Bind click collapse-expand logic using event delegation
            treeContainer.onclick = (e) => {
                const header = e.target.closest('.world-title, .region-title, .subregion-title');
                if (header) {
                    const parent = header.parentElement;
                    const children = parent.querySelector('.world-children, .region-children, .subregion-children');
                    const caret = header.querySelector('.ph-caret-down');
                    if (children) {
                        const isHidden = children.classList.contains('hidden');
                        if (isHidden) {
                            children.classList.remove('hidden');
                            if (caret) caret.style.transform = 'rotate(0deg)';
                        } else {
                            children.classList.add('hidden');
                            if (caret) caret.style.transform = 'rotate(-90deg)';
                        }
                    }
                }
            };

        } catch (err) {
            console.error('Failed to render world tree:', err);
            treeContainer.innerHTML = `<div class="text-red-400 text-center py-4">Cảm ứng thất bại: ${err.message}</div>`;
        }
    }

    initGuideTabs() {
        const overlay = document.getElementById('guide-overlay');
        if (!overlay) return;

        const tabBtns = overlay.querySelectorAll('.guide-tab-btn');
        const panes = overlay.querySelectorAll('.guide-tab-pane');

        tabBtns.forEach(btn => {
            btn.onclick = () => {
                // Remove active classes from all buttons
                tabBtns.forEach(b => {
                    b.classList.remove('active', 'border-cultivation-gold/45', 'text-cultivation-gold', 'bg-cultivation-gold/10');
                    b.classList.add('border-white/5', 'text-gray-400');
                });

                // Add active classes to clicked button
                btn.classList.add('active', 'border-cultivation-gold/45', 'text-cultivation-gold', 'bg-cultivation-gold/10');
                btn.classList.remove('border-white/5', 'text-gray-400');

                // Hide all panes
                panes.forEach(p => p.classList.add('hidden'));

                // Show targeted pane
                const tabId = btn.getAttribute('data-tab');
                const targetPane = overlay.querySelector(`#${tabId}`);
                if (targetPane) {
                    targetPane.classList.remove('hidden');
                }
            };
        });

        // Auto reset to default tab (Tân Thủ) when opened
        const defaultBtn = overlay.querySelector('.guide-tab-btn[data-tab="tab-intro"]');
        if (defaultBtn) {
            defaultBtn.click();
        }
     }

    initHorizontalScrollRoll() {
        const containers = document.querySelectorAll('.overflow-x-auto');
        containers.forEach(el => {
            let isDown = false;
            let startX;
            let scrollLeft;

            el.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - el.offsetLeft;
                scrollLeft = el.scrollLeft;
                el.style.scrollBehavior = 'auto';
            });
            el.addEventListener('mouseleave', () => {
                isDown = false;
            });
            el.addEventListener('mouseup', () => {
                isDown = false;
                el.style.scrollBehavior = 'smooth';
            });
            el.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - el.offsetLeft;
                const walk = (x - startX) * 1.5; // Drag sensitivity multiplier
                el.scrollLeft = scrollLeft - walk;
            });
        });
    }
}
