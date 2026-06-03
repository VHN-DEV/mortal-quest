import { Preferences } from '@capacitor/preferences';
import { gsap } from 'gsap';
import { state } from '../state.js';
import { audioManager } from '../utils/audio-manager.js';
import { logger } from '../utils/logger.js';
import { getAssetUrl } from '../configs/asset-data.js';
import { getItemById } from '../configs/item-data.js';
import { findLocationName, DANGER_LEVELS, getWorlds, getLocationById } from '../configs/map-data.js';
import { getDisplayQuality, getQualityClass } from '../utils/ui-utils.js';
import { PHAP_BAO_QUALITIES, GAME_STATS } from '../configs/game-enums.js';
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
        this.qiBubbleInterval = null;

        // Initialize smooth horizontal drag-scroll roll behavior
        this.initHorizontalScrollRoll();

        // Listen to visibility change to stop/start qi bubble system (prevent pile-up in background)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopQiBubbleSystem();
            } else {
                this.startQiBubbleSystem();
            }
        });

        // Initialize dynamic image zoom listener
        this.initImageZoomListener();
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
        const existing = Array.from(this.notifContainer.children).find(
            child => child.dataset.message === message
        );
        if (existing) return;

        const toast = document.createElement('div');
        toast.dataset.message = message;
        toast.dataset.type = type;
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

            // Select thematic icon based on title keywords
            let iconClass = 'ph-yin-yang';
            const lowerTitle = title.toLowerCase();
            if (lowerTitle.includes('chiến thắng') || lowerTitle.includes('chiến lợi phẩm') || lowerTitle.includes('loot') || lowerTitle.includes('bí bảo') || lowerTitle.includes('kho báu')) {
                iconClass = 'ph-treasure-chest';
            } else if (lowerTitle.includes('gặp') || lowerTitle.includes('bái kiến') || lowerTitle.includes('đối thoại') || lowerTitle.includes('npc') || lowerTitle.includes('tiên nhân')) {
                iconClass = 'ph-user-focus';
            } else if (lowerTitle.includes('tập kích') || lowerTitle.includes('bắt đầu') || lowerTitle.includes('cảnh báo') || lowerTitle.includes('lôi phạt') || lowerTitle.includes('kiếp') || lowerTitle.includes('chiến đấu')) {
                iconClass = 'ph-swords';
            } else if (lowerTitle.includes('lưu') || lowerTitle.includes('dữ liệu') || lowerTitle.includes('hành trình') || lowerTitle.includes('lưu trữ')) {
                iconClass = 'ph-scroll';
            } else if (lowerTitle.includes('lối ra') || lowerTitle.includes('lối xuống') || lowerTitle.includes('lối lên') || lowerTitle.includes('stairs') || lowerTitle.includes('cầu thang')) {
                iconClass = 'ph-stairs';
            } else if (lowerTitle.includes('cài đặt') || lowerTitle.includes('thiết lập') || lowerTitle.includes('hệ thống')) {
                iconClass = 'ph-gear-six';
            }

            const isSpinning = iconClass === 'ph-yin-yang' || iconClass === 'ph-gear-six';
            this.modalIcon.className = `ph ${iconClass} text-4xl text-cultivation-gold ${isSpinning ? 'animate-spin-slow' : 'animate-bounce-subtle'}`;

            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'flex flex-col space-y-2.5 w-full mt-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar';

            options.forEach(opt => {
                const label = opt.label !== undefined ? opt.label : (opt.text !== undefined ? opt.text : '');
                const value = opt.value !== undefined ? opt.value : opt.id;
                const btn = document.createElement('button');

                // Premium left-aligned list style for options
                btn.className = 'w-full py-3.5 px-4 bg-gradient-to-r from-white/[0.03] to-white/[0.01] hover:from-cultivation-gold/10 hover:to-transparent border border-white/5 hover:border-cultivation-gold/30 rounded-2xl text-xs font-ancient text-gray-300 hover:text-cultivation-gold transition-all duration-300 active:scale-[0.98] flex items-center justify-start space-x-3 group relative overflow-hidden shadow-sm';

                btn.innerHTML = `
                    <div class="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cultivation-gold/20 group-hover:border-cultivation-gold/40 transition-colors flex-shrink-0">
                        <i class="ph ${opt.icon || 'ph-caret-right'} text-sm text-gray-400 group-hover:text-cultivation-gold group-hover:translate-x-0.5 transition-all"></i>
                    </div>
                    <span class="text-left font-serif font-medium flex-grow leading-relaxed text-gray-200 group-hover:text-white transition-colors">${label}</span>
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
                    <div class="w-full h-36 rounded-2xl overflow-hidden border border-cultivation-gold/10 mb-4 shadow-lg shadow-black/80 relative">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                        <img src="${illustration}" class="w-full h-full object-cover">
                    </div>
                `;
            }
            if (description) {
                contentHTML += `
                    <div class="text-xs text-gray-300 mb-5 px-4 py-3 bg-white/[0.02] border-l-2 border-cultivation-gold rounded-r-xl italic font-serif leading-relaxed text-left relative overflow-hidden shadow-inner">
                        <div class="absolute right-2 bottom-1 opacity-[0.03] pointer-events-none">
                            <i class="ph ph-quotes text-5xl text-white"></i>
                        </div>
                        ${description}
                    </div>
                `;
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
                    {
                        opacity: 1, scale: 1, backdropFilter: "blur(8px)", duration: 0.4, ease: "power2.out", onComplete: () => {
                            if (onComplete) onComplete();
                        }
                    }
                );
            } else {
                gsap.fromTo(el,
                    { opacity: 0 },
                    {
                        opacity: 1, duration: 0.3, ease: "power1.out", onComplete: () => {
                            if (onComplete) onComplete();
                        }
                    }
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

        // Create the lightning flash overlay
        const flash = document.createElement('div');
        flash.className = 'lightning-flash-overlay absolute inset-0 bg-white z-[1250] pointer-events-none';
        const app = document.getElementById('app');
        app.appendChild(flash);
        gsap.to(flash, { opacity: 0, duration: 0.35, ease: "power2.out", onComplete: () => flash.remove() });

        const effect = document.createElement('div');
        effect.className = 'absolute inset-0 z-[1200] flex flex-col items-center justify-center pointer-events-none overflow-hidden';
        effect.innerHTML = `
            <div class="breakthrough-glow absolute w-72 h-72 bg-cultivation-gold/40 rounded-full blur-[100px] opacity-0" style="will-change: transform, opacity;"></div>
            <!-- Spinning Bagua Outline -->
            <div class="bagua-matrix-wrapper absolute w-[360px] h-[360px] opacity-0 scale-75 pointer-events-none z-0 flex items-center justify-center" style="will-change: transform, opacity;">
                <div class="bagua-matrix-bg w-full h-full pointer-events-none">
                    <svg viewBox="0 0 200 200" class="w-full h-full text-cultivation-gold/25">
                        <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" stroke-width="1" />
                        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" stroke-width="0.5" stroke-dasharray="6 3" />
                        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" stroke-width="0.8" />
                        <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" stroke-width="0.5" />
                        <path d="M100 5 L100 20 M100 180 L100 195 M5 100 L20 100 M180 100 L195 100" stroke="currentColor" stroke-width="1.5" />
                        <path d="M33 33 L44 44 M156 156 L167 167 M33 167 L44 156 M156 33 L167 44" stroke="currentColor" stroke-width="1.5" />
                        <path d="M100 70 A 15 15 0 0 0 100 100 A 15 15 0 0 1 100 130 A 30 30 0 0 0 100 70 Z" fill="currentColor" opacity="0.15" />
                        <path d="M100 70 A 15 15 0 0 0 100 100 A 15 15 0 0 1 100 130 A 30 30 0 0 1 100 70 Z" fill="none" stroke="currentColor" stroke-width="0.5" />
                        <circle cx="100" cy="85" r="3" fill="currentColor" />
                        <circle cx="100" cy="115" r="3" fill="currentColor" opacity="0.4" />
                    </svg>
                </div>
            </div>
            <!-- Breakthrough Title container -->
            <div class="breakthrough-title relative z-10 opacity-0 scale-50 text-center" style="will-change: transform, opacity;">
                <h2 class="text-7xl font-charm text-cultivation-gold drop-shadow-[0_0_35px_rgba(218,165,32,0.95)] tracking-widest">ĐỘT PHÁ</h2>
                <div class="w-32 h-[1px] bg-gradient-to-r from-transparent via-cultivation-gold to-transparent mx-auto my-3"></div>
                <p class="text-2xl font-ancient text-white tracking-[0.6em] uppercase text-glow">${realmName}</p>
            </div>
            <div class="particles-burst absolute inset-0"></div>
        `;

        app.appendChild(effect);

        const glow = effect.querySelector('.breakthrough-glow');
        const bagua = effect.querySelector('.bagua-matrix-wrapper');
        const title = effect.querySelector('.breakthrough-title');

        const tl = gsap.timeline({
            onComplete: () => effect.remove()
        });

        tl.to(glow, { opacity: 1, scale: 2.8, duration: 0.6, ease: "power4.out", force3D: true })
            .to(bagua, { opacity: 1, scale: 1, rotation: 90, duration: 2.2, ease: "power2.out", force3D: true }, "-=0.5")
            .to(title, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.8)", force3D: true }, "-=2.0")
            .to(glow, { opacity: 0, scale: 4.5, duration: 1.2, ease: "power2.in", force3D: true }, "+=0.4")
            .to(bagua, { opacity: 0, scale: 1.4, duration: 1.0, ease: "power2.in", force3D: true }, "-=1.0")
            .to(title, { opacity: 0, y: -120, scale: 1.1, duration: 0.8, ease: "power3.in", force3D: true }, "-=0.8");

        // Spawn a meridian-like expanding ring (CSS-animated for performance)
        const ring = document.createElement('div');
        ring.className = 'meridian-shockwave absolute z-[1150]';
        const rect = app.getBoundingClientRect();
        ring.style.left = `${rect.width / 2}px`;
        ring.style.top = `${rect.height / 2}px`;
        ring.style.setProperty('--focus-color', '#fbbf24');
        app.appendChild(ring);
        setTimeout(() => ring.remove(), 850);

        // Spawn gold stardust drifting downwards (Optimized particle count and styles to prevent lag)
        const pContainer = effect.querySelector('.particles-burst');
        const count = 10;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'absolute rounded-full pointer-events-none bg-cultivation-gold';
            const size = 2.0 + Math.random() * 3.0;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.opacity = `${0.6 + Math.random() * 0.4}`;
            p.style.willChange = 'transform, opacity';

            // Random start position near center
            const startX = rect.width / 2 + (Math.random() - 0.5) * 80;
            const startY = rect.height / 2 + (Math.random() - 0.5) * 80;
            p.style.left = `${startX}px`;
            p.style.top = `${startY}px`;
            pContainer.appendChild(p);

            const angle = Math.random() * Math.PI * 2;
            const speed = 40 + Math.random() * 100;
            const destX = Math.cos(angle) * speed;
            const destY = Math.sin(angle) * speed + 80; // Drift down extra

            gsap.to(p, {
                x: destX,
                y: destY,
                opacity: 0,
                scale: 0.2,
                duration: 0.8 + Math.random() * 0.8,
                ease: "power1.out",
                force3D: true
            });
        }

        audioManager.playSfx('breakthrough');
    }

    handleCultivationSuccess(result) {
        const portrait = document.getElementById('aura-border');
        if (!portrait) return;

        const rect = portrait.getBoundingClientRect();
        const app = document.getElementById('app');
        if (!app) return;

        const appRect = app.getBoundingClientRect();
        const centerX = rect.left - appRect.left + rect.width / 2;
        const centerY = rect.top - appRect.top + rect.height / 2;

        const type = result.type || 'tuvi';
        const color = type === 'tuvi' ? '#4FD1C5' : (type === 'body' ? '#F87171' : '#A78BFA');
        const glowClass = type === 'tuvi' ? 'pulse-glow-tuvi' : (type === 'body' ? 'pulse-glow-body' : 'pulse-glow-soul');

        // Number of particles
        const count = state.player.isSecluded ? 8 : 20;

        // Spiritual gathering vacuum effect
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'absolute rounded-full pointer-events-none z-[60]';
            p.style.width = '6px';
            p.style.height = '6px';
            p.style.backgroundColor = color;
            p.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
            p.style.willChange = 'transform, opacity';

            // Spawn evenly distributed along a circle outside the portrait with a tiny random jitter
            const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.15 - 0.075);
            const distance = 110 + Math.random() * 70; // 110px - 180px away (just outside avatar circle)
            const spawnX = centerX + Math.cos(angle) * distance;
            const spawnY = centerY + Math.sin(angle) * distance;

            p.style.left = `${spawnX}px`;
            p.style.top = `${spawnY}px`;

            app.appendChild(p);

            // Animate flying into the center
            gsap.to(p, {
                x: centerX - spawnX,
                y: centerY - spawnY,
                scale: 0.2,
                opacity: 0.3,
                duration: 0.45 + Math.random() * 0.3,
                ease: "power2.in",
                force3D: true,
                onComplete: () => {
                    p.remove();
                    // When first particles hit the center, trigger the portrait glow pulse
                    if (i === 0) {
                        portrait.classList.remove('pulse-glow-tuvi', 'pulse-glow-body', 'pulse-glow-soul');
                        // Force a reflow
                        void portrait.offsetWidth;
                        portrait.classList.add(glowClass);
                        // Auto remove class after animation completes (0.3s)
                        setTimeout(() => portrait.classList.remove(glowClass), 310);
                    }
                }
            });
        }
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
     * Spawn QI particles at a specific position (converging/spiraling inward)
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
            p.className = 'qi-trail-particle';
            p.style.setProperty('--element-color', color);
            p.style.left = `${x}px`;
            p.style.top = `${y}px`;
            p.style.transform = 'translate(-50%, -50%) scale(0)';
            p.style.opacity = '0';

            container.appendChild(p);

            const angle = Math.random() * Math.PI * 2;
            const startDist = 100 + Math.random() * 80;
            const spiralAngleOffset = (Math.random() > 0.5 ? 1 : -1) * (Math.PI / 2 + Math.random() * Math.PI);
            const delay = Math.random() * 0.15;

            const obj = { t: 0 };
            gsap.to(obj, {
                t: 1,
                duration: 0.5 + Math.random() * 0.35,
                delay: delay,
                ease: "power1.in",
                onUpdate: () => {
                    const t = obj.t;
                    const curX = x + Math.cos(angle + t * spiralAngleOffset) * (startDist * (1 - t));
                    const curY = y + Math.sin(angle + t * spiralAngleOffset) * (startDist * (1 - t));

                    p.style.left = `${curX}px`;
                    p.style.top = `${curY}px`;
                    p.style.transform = `translate(-50%, -50%) scale(${0.4 + t * 0.8})`;
                    p.style.opacity = `${t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85}`;
                },
                onComplete: () => {
                    p.remove();
                    this.triggerPortraitHitEffect(color);
                }
            });
        }
    }

    /**
     * Triggers a visual flash and pulse effect on the player portrait corresponding to the absorbed energy color
     */
    triggerPortraitHitEffect(color) {
        const auraGlow = document.getElementById('aura-glow');
        const auraBorder = document.getElementById('aura-border');

        if (auraGlow) {
            gsap.killTweensOf(auraGlow);
            gsap.fromTo(auraGlow,
                {
                    backgroundColor: color,
                    opacity: 0.8,
                    scale: 1.05
                },
                {
                    backgroundColor: 'rgba(79, 209, 197, 0.05)',
                    opacity: 0.35,
                    scale: 1.25,
                    duration: 0.5,
                    ease: "power2.out"
                }
            );
        }

        if (auraBorder) {
            gsap.killTweensOf(auraBorder);
            gsap.fromTo(auraBorder,
                {
                    borderColor: color,
                    boxShadow: `0 0 35px ${color}, inset 0 0 20px ${color}`
                },
                {
                    borderColor: 'rgba(212, 175, 55, 0.3)',
                    boxShadow: '0 0 60px rgba(212, 175, 55, 0.15)',
                    duration: 0.5,
                    ease: "power2.out"
                }
            );
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
            [PHAP_BAO_QUALITIES.PHAM_KHI.name]: { color: '#ffffff', label: 'PHÀM KHÍ', sfx: 'click', shake: false },
            [PHAP_BAO_QUALITIES.PHAP_KHI.name]: { color: '#10b981', label: 'PHÁP KHÍ', sfx: 'success', shake: false },
            [PHAP_BAO_QUALITIES.LINH_KHI.name]: { color: '#3b82f6', label: 'LINH KHÍ', sfx: 'success', shake: false },
            [PHAP_BAO_QUALITIES.PHAP_BAO.name]: { color: '#8b5cf6', label: 'PHÁP BẢO', sfx: 'breakthrough', shake: 'medium' },
            [PHAP_BAO_QUALITIES.CO_BAO.name]: { color: '#f59e0b', label: 'CỔ BẢO', sfx: 'breakthrough', shake: 'medium' },
            [PHAP_BAO_QUALITIES.LINH_BAO.name]: { color: '#ef4444', label: 'LINH BẢO', sfx: 'breakthrough', shake: 'high' },
            [PHAP_BAO_QUALITIES.THONG_THIEN_LINH_BAO.name]: { color: '#d4af37', label: 'THÔNG THIÊN', sfx: 'breakthrough', shake: 'high', flash: true },
            [PHAP_BAO_QUALITIES.TIEN_KHI.name]: { color: '#4fd1c5', label: 'TIÊN KHÍ', sfx: 'breakthrough', shake: 'high', flash: true, rainbow: true },
            [PHAP_BAO_QUALITIES.DANH_KHI.name]: { color: '#f87171', label: 'DANH KHÍ', sfx: 'thunder', shake: 'high', flash: true, premium: true },
        };

        overlay.classList.remove('hidden');
        overlay.classList.add('flex', 'opacity-100');

        for (const item of lootItems) {
            const qKey = typeof item.quality === 'object' ? (item.quality.name || '') : String(item.quality);
            const config = rarityConfigs[qKey] || rarityConfigs['Phàm Khí'];

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
                        <div class="absolute inset-0 border-2 border-${this.getQualityClass(item.quality)} rounded-2xl opacity-20 group-hover:opacity-100 transition-opacity"></div>
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
        await new Promise(r => {
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    overlay.classList.add('hidden');
                    overlay.classList.remove('flex');
                    container.innerHTML = '';
                    r();
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

        // Hide map overlays when switching away from adventure tab
        if (screenId !== 'screen-adventure') {
            const locView = document.getElementById('map-location-view');
            const expView = document.getElementById('map-explore-view');
            if (locView) {
                locView.classList.add('hidden');
                locView.classList.remove('flex');
                locView.style.opacity = '0';
            }
            if (expView) {
                expView.classList.add('hidden');
                expView.classList.remove('flex');
                expView.style.opacity = '0';
            }
        }

        if (screenId === 'screen-main') {
            this.startQiBubbleSystem();
        } else {
            this.stopQiBubbleSystem();
        }

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

        const displayQuality = getDisplayQuality(quality, item.type);

        this.elTooltip.innerHTML = `
            <div class="flex items-center space-x-2 mb-1">
                <div class="text-xl">${item.icon || '📦'}</div>
                <div class="flex flex-col">
                    <span class="text-[10px] font-bold text-white font-ancient quality-${qClass}">${item.name}</span>
                    <span class="text-[7px] text-gray-500 uppercase tracking-tighter">${displayQuality}</span>
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
        return getQualityClass(quality);
    }

    getStatLabel(statKey) {
        return GAME_STATS[statKey]?.name || statKey;
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
                    const isLoanTinhHai = rName === 'Loạn Tinh Hải' || Object.values(subregions).some(sub => sub.some(loc => loc.regionId === 'loan_tinh_hai'));
                    if (worldId === 'nhan_gioi' && isLoanTinhHai) {
                        if (state) {
                            const currentLoc = state.currentLocId ?
                                (typeof getLocationById === 'function' ? getLocationById(state.currentWorldId, state.currentLocId) : null)
                                : null;
                            const isAlreadyThere = currentLoc && currentLoc.regionId === 'loan_tinh_hai';
                            if (!isAlreadyThere) {
                                const atTeleport = state.currentLocId === 'thuong_co_truyen_tong_tran';
                                const hasTalisman = state.player?.inventory && (
                                    state.player.inventory.hasItem('pha_khong_phu') ||
                                    state.player.inventory.hasItem('thuan_di_phu') ||
                                    state.player.inventory.hasItem('thuong_co_truyen_tong_lenh')
                                );
                                const hasBoat = state.player?.inventory && (
                                    state.player.inventory.hasItem('ngu_phong_phi_chu') ||
                                    state.player.inventory.hasItem('thanh_phong_linh_chu')
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

    startQiBubbleSystem() {
        this.updateQiBubbleSystemState();
    }

    updateQiBubbleSystemState() {
        const focus = state.player?.cultivationFocus || 'tuvi';
        const hasTech = !!state.player?.mainTechniqueId;
        const shouldRun = this.currentScreenId === 'screen-main' && focus === 'tuvi' && hasTech;

        if (shouldRun) {
            if (!this.qiBubbleInterval) {
                // Initial spawn of 2 bubbles immediately
                setTimeout(() => this.spawnQiBubble(), 800);
                setTimeout(() => this.spawnQiBubble(), 2000);

                // Use dynamic rescheduling so each interval is independently random
                const scheduleNext = () => {
                    // Store as a timeout ID so stopQiBubbleSystem can clear it
                    this.qiBubbleInterval = setTimeout(() => {
                        if (this.currentScreenId === 'screen-main') {
                            this.spawnQiBubble();
                        }
                        // Only reschedule if system should still run
                        if (this.qiBubbleInterval !== null) {
                            scheduleNext();
                        }
                    }, 4000 + Math.random() * 2000);
                };
                scheduleNext();
            }
        } else {
            if (this.qiBubbleInterval) {
                this.stopQiBubbleSystem();
            }
        }
    }

    stopQiBubbleSystem() {
        if (this.qiBubbleInterval) {
            clearTimeout(this.qiBubbleInterval);
            this.qiBubbleInterval = null;
        }
        const container = document.getElementById('qi-bubbles-container');
        if (container) {
            container.innerHTML = '';
        }
    }

    spawnQiBubble() {
        const container = document.getElementById('qi-bubbles-container');
        if (!container || this.currentScreenId !== 'screen-main') return;

        const focus = state.player?.cultivationFocus || 'tuvi';
        const hasTech = !!state.player?.mainTechniqueId;
        if (focus !== 'tuvi' || !hasTech) return;

        let allowedBubbles = [];

        // Traditional location-based elemental Qi
        const loc = getLocationById(state.currentWorldId, state.currentLocId);
        const defaultQi = {
            'Kim': 15, 'Mộc': 15, 'Thủy': 15, 'Hỏa': 15, 'Thổ': 15,
            'Phong': 5, 'Lôi': 5, 'Băng': 5, 'Quang': 5, 'Ám': 5
        };
        const elementQi = loc?.elementQi || defaultQi;

        const elements = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ', 'Phong', 'Lôi', 'Băng', 'Quang', 'Ám'];
        const allowedElements = elements.filter(el => (elementQi[el] || 0) > 0);
        if (allowedElements.length === 0) return;

        // Weighted random selection based on elementQi proportions
        let totalWeight = 0;
        allowedElements.forEach(el => {
            totalWeight += (elementQi[el] || 0);
        });

        let randomElName = allowedElements[0];
        if (totalWeight > 0) {
            let randomWeight = Math.random() * totalWeight;
            for (const el of allowedElements) {
                randomWeight -= (elementQi[el] || 0);
                if (randomWeight <= 0) {
                    randomElName = el;
                    break;
                }
            }
        }
        const ELEMENT_CONFIGS = {
            'Kim': { color: '#D4AF37', name: 'Kim' },
            'Mộc': { color: '#2E8B57', name: 'Mộc' },
            'Thủy': { color: '#2563EB', name: 'Thủy' },
            'Hỏa': { color: '#DC2626', name: 'Hỏa' },
            'Thổ': { color: '#8B5A2B', name: 'Thổ' },
            'Phong': { color: '#A7C7E7', name: 'Phong' },
            'Lôi': { color: '#7C3AED', name: 'Lôi' },
            'Băng': { color: '#7DD3FC', name: 'Băng' },
            'Quang': { color: '#FDE68A', name: 'Quang' },
            'Ám': { color: '#312E81', name: 'Ám' }
        };
        const sizeMult = 0.85 + Math.random() * 0.35; // 0.85 to 1.2 (Bubble size range ~39px to ~55px)
        allowedBubbles.push({ ...ELEMENT_CONFIGS[randomElName], rawName: randomElName, type: 'tuvi', sizeMult });

        const cfg = allowedBubbles[0];
        if (!cfg) return;

        const bubble = document.createElement('div');
        bubble.className = 'qi-bubble';
        bubble.style.setProperty('--element-color', cfg.color);

        // Random horizontal start pos (allow full screen width)
        const startX = 5 + Math.random() * 90;
        bubble.style.left = `${startX}%`;
        bubble.style.bottom = `-60px`;

        // Dynamic visual bubble size
        bubble.style.width = `${Math.round(46 * sizeMult)}px`;
        bubble.style.height = `${Math.round(46 * sizeMult)}px`;

        // Drift and duration
        const driftX = Math.random() * 120 - 60;
        bubble.style.setProperty('--float-x', `${driftX}px`);

        const duration = 12 + Math.random() * 8;
        bubble.style.animationDuration = `${duration}s`;

        bubble.innerHTML = `
            <div class="qi-bubble-core" style="--element-color: ${cfg.color}"></div>
            <span class="text-[8px] text-white/95 font-bold uppercase tracking-wider mt-1 select-none font-ancient text-center leading-none">${cfg.name}</span>
        `;

        const handlePop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.popBubble(bubble, cfg);
        };
        bubble.onclick = handlePop;
        bubble.ontouchstart = handlePop;

        bubble.addEventListener('animationend', () => bubble.remove());
        container.appendChild(bubble);
    }

    popBubble(bubble, cfg, isAuto = false) {
        if (bubble.dataset.popped) return;
        bubble.dataset.popped = 'true';

        // Check suitability with player's root elements
        const playerElements = state.player?.spiritualRoot?.elements || [];
        const isCompatible = isAuto || playerElements.includes(cfg.rawName);

        const containerRect = document.getElementById('screen-main').getBoundingClientRect();
        const rect = bubble.getBoundingClientRect();
        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top + rect.height / 2;

        if (!isCompatible) {
            // Incompatible root: show warning and cancel pop
            if (window.audioManager && typeof window.audioManager.playSfx === 'function') {
                try {
                    window.audioManager.playSfx('deny');
                } catch (err) {
                    window.audioManager.playSfx('click');
                }
            }

            const warnText = document.createElement('div');
            warnText.className = 'absolute z-40 font-bold font-ancient text-[8px] text-red-500 pointer-events-none select-none filter drop-shadow-[0_0_3px_rgba(0,0,0,0.9)] warn-text-float-up';
            warnText.textContent = `Linh căn bất hợp (${cfg.name})`;
            warnText.style.left = `${x}px`;
            warnText.style.top = `${y}px`;
            warnText.style.transform = 'translate(-50%, -50%)';
            document.getElementById('screen-main').appendChild(warnText);

            warnText.addEventListener('animationend', () => warnText.remove());

            bubble.removeAttribute('data-popped');
            return;
        }

        if (!isAuto && window.audioManager && typeof window.audioManager.playSfx === 'function') {
            window.audioManager.playSfx('click');
        }

        // Spawn expanding pop ring
        const popRing = document.createElement('div');
        popRing.className = 'pop-ring';
        popRing.style.setProperty('--element-color', cfg.color);
        popRing.style.left = `${x}px`;
        popRing.style.top = `${y}px`;
        document.getElementById('screen-main').appendChild(popRing);
        setTimeout(() => popRing.remove(), 500);

        // Freeze bubble at its current animated position before stopping the keyframe animation
        const computedStyle = window.getComputedStyle(bubble);
        const currentBottom = computedStyle.bottom;
        const currentTransform = computedStyle.transform;

        bubble.style.bottom = currentBottom;
        bubble.style.transform = currentTransform;
        bubble.style.animation = 'none';

        // Force reflow
        void bubble.offsetHeight;

        // Remove bubble element smoothly using CSS Transitions
        bubble.style.transition = 'transform 0.15s ease-in, opacity 0.15s ease-in';
        bubble.style.transform = 'scale(0)';
        bubble.style.opacity = '0';
        bubble.addEventListener('transitionend', () => bubble.remove());
        setTimeout(() => bubble.remove(), 250);

        if (isAuto) {
            // Show gain text for auto absorb
            let tvps = state.player?.tuViPerSecond || 1;
            if (state.systems.time) {
                const season = state.systems.time.getSeason();
                if (season.bonus && season.bonus.tvps) tvps *= season.bonus.tvps;
            }
            const gainVal = Math.max(1, Math.floor(tvps * 2));
            const gainText = document.createElement('div');
            gainText.className = 'absolute z-40 font-bold font-mono text-[9px] text-qi-blue pointer-events-none select-none filter drop-shadow-[0_0_4px_rgba(79,209,197,0.8)] gain-text-float-up';
            gainText.textContent = `+${gainVal} Tu Vi (Hấp Thu)`;
            gainText.style.left = `${x}px`;
            gainText.style.top = `${y}px`;
            gainText.style.transform = 'translate(-50%, -50%)';
            document.getElementById('screen-main').appendChild(gainText);

            gainText.addEventListener('animationend', () => gainText.remove());
        } else {
            // Trigger controller absorb action with type and size multiplier
            if (window.game && typeof window.game.absorbBubble === 'function') {
                const result = window.game.absorbBubble(cfg.rawName, cfg.type, cfg.sizeMult);
                if (result && result.success) {
                    // Spawn beautiful floating +Exp text
                    const gainText = document.createElement('div');
                    gainText.className = 'absolute z-40 font-bold font-mono text-[9px] text-qi-blue pointer-events-none select-none filter drop-shadow-[0_0_4px_rgba(79,209,197,0.8)] gain-text-float-up';
                    gainText.textContent = `+${Math.floor(result.gain)} Tu Vi`;
                    gainText.style.left = `${x}px`;
                    gainText.style.top = `${y}px`;
                    gainText.style.transform = 'translate(-50%, -50%)';
                    document.getElementById('screen-main').appendChild(gainText);

                    gainText.addEventListener('animationend', () => gainText.remove());
                }
            }
        }

        // Spawn flying trail particles to portrait
        const portrait = document.getElementById('aura-border');
        if (portrait) {
            const portRect = portrait.getBoundingClientRect();
            const destX = portRect.left - containerRect.left + portRect.width / 2;
            const destY = portRect.top - containerRect.top + portRect.height / 2;

            // Reduce to 1 particle for auto-absorb, 2 for manual tap to preserve performance
            const numParticles = isAuto ? 1 : 2;
            for (let i = 0; i < numParticles; i++) {
                const p = document.createElement('div');
                p.className = 'qi-trail-particle';
                p.style.setProperty('--element-color', cfg.color);
                p.style.left = `${x}px`;
                p.style.top = `${y}px`;

                // Hardware accelerated transition
                p.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease-in, scale 0.6s ease-in';
                p.style.transform = 'translate(0px, 0px) scale(1)';
                document.getElementById('screen-main').appendChild(p);

                // Midpoint offsets for a curved path effect
                const midX = (Math.random() * 120 - 60);
                const midY = -(30 + Math.random() * 50);

                // Animate first to mid point, then to destination
                requestAnimationFrame(() => {
                    p.style.transform = `translate(${midX}px, ${midY}px) scale(1.2)`;

                    setTimeout(() => {
                        p.style.transform = `translate(${destX - x}px, ${destY - y}px) scale(0.3)`;
                        p.style.opacity = '0';
                    }, 200);
                });

                p.addEventListener('transitionend', () => p.remove());
            }
        }
    }

    spawnAndPopAutoQiBubble() {
        const container = document.getElementById('qi-bubbles-container');
        if (!container || this.currentScreenId !== 'screen-main') return;

        const playerElements = state.player?.spiritualRoot?.elements || ['Mộc'];
        if (playerElements.length === 0) return;

        // Get location element qi ratios
        const loc = getLocationById(state.currentWorldId, state.currentLocId);
        const defaultQi = {
            'Kim': 15, 'Mộc': 15, 'Thủy': 15, 'Hỏa': 15, 'Thổ': 15,
            'Phong': 5, 'Lôi': 5, 'Băng': 5, 'Quang': 5, 'Ám': 5
        };
        const elementQi = loc?.elementQi || defaultQi;

        // Intersection of player root elements and local positive qi elements
        const activePlayerElements = playerElements.filter(el => (elementQi[el] || 0) > 0);

        let randomElName = playerElements[0];
        if (activePlayerElements.length > 0) {
            let totalWeight = 0;
            activePlayerElements.forEach(el => {
                totalWeight += (elementQi[el] || 0);
            });

            if (totalWeight > 0) {
                let randomWeight = Math.random() * totalWeight;
                for (const el of activePlayerElements) {
                    randomWeight -= (elementQi[el] || 0);
                    if (randomWeight <= 0) {
                        randomElName = el;
                        break;
                    }
                }
            } else {
                randomElName = activePlayerElements[Math.floor(Math.random() * activePlayerElements.length)];
            }
        } else {
            // Fallback: pick any player root element equally
            randomElName = playerElements[Math.floor(Math.random() * playerElements.length)];
        }
        const ELEMENT_CONFIGS = {
            'Kim': { color: '#fcd34d', name: 'Kim' },
            'Mộc': { color: '#4ade80', name: 'Mộc' },
            'Thủy': { color: '#3b82f6', name: 'Thủy' },
            'Hỏa': { color: '#ef4444', name: 'Hỏa' },
            'Thổ': { color: '#d97706', name: 'Thổ' },
            'Phong': { color: '#94a3b8', name: 'Phong' },
            'Lôi': { color: '#fbbf24', name: 'Lôi' },
            'Băng': { color: '#60a5fa', name: 'Băng' },
            'Quang': { color: '#fffbeb', name: 'Quang' },
            'Ám': { color: '#a855f7', name: 'Ám' }
        };
        const cfg = {
            ...ELEMENT_CONFIGS[randomElName] || ELEMENT_CONFIGS['Mộc'],
            rawName: randomElName,
            type: 'tuvi',
            sizeMult: 0.85 + Math.random() * 0.35 // 0.85 to 1.2
        };

        const bubble = document.createElement('div');
        bubble.className = 'qi-bubble';
        bubble.style.setProperty('--element-color', cfg.color);
        bubble.style.animation = 'none';
        bubble.style.opacity = '0';
        bubble.style.transform = 'scale(0.5) translate(0px, 0px)';

        const startX = 25 + Math.random() * 50; // 25% to 75%
        const startY = 35 + Math.random() * 20; // 35% to 55%
        bubble.style.left = `${startX}%`;
        bubble.style.bottom = `${startY}%`;
        bubble.style.width = `${Math.round(46 * cfg.sizeMult)}px`;
        bubble.style.height = `${Math.round(46 * cfg.sizeMult)}px`;

        bubble.innerHTML = `
            <div class="qi-bubble-core" style="--element-color: ${cfg.color}"></div>
            <span class="text-[8px] text-white/95 font-bold uppercase tracking-wider mt-1 select-none font-ancient text-center leading-none">${cfg.name}</span>
        `;

        container.appendChild(bubble);

        const floatDuration = 0.8 + Math.random() * 0.4;
        bubble.style.transition = `transform ${floatDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${floatDuration}s ease-out`;

        requestAnimationFrame(() => {
            bubble.style.opacity = '1';
            bubble.style.transform = `scale(1) translate(${(Math.random() - 0.5) * 40}px, ${-50 - Math.random() * 30}px)`;
        });

        setTimeout(() => {
            this.popBubble(bubble, cfg, true);
        }, floatDuration * 1000);
    }

    handleCultivationSuccess(result) {
        if (!result || !result.success) return;

        const focus = result.type;
        const cycles = state.player.meridianCycles || {
            tuvi: { step: 0, count: 0 },
            body: { step: 0, count: 0 },
            soul: { step: 0, count: 0 }
        };
        const currentStep = cycles[focus].step;

        // Custom visual response depending on the refinement focus type
        const auraBorder = document.getElementById('aura-border');
        if (auraBorder) {
            auraBorder.classList.remove('pulse-glow-tuvi', 'pulse-glow-body', 'pulse-glow-soul');

            // Trigger reflow to restart CSS animation
            void auraBorder.offsetWidth;

            if (focus === 'tuvi') {
                auraBorder.classList.add('pulse-glow-tuvi');
            } else if (focus === 'body') {
                auraBorder.classList.add('pulse-glow-body');
            } else if (focus === 'soul') {
                auraBorder.classList.add('pulse-glow-soul');
            }
        }

        // Handle cycle completion rewards and cinematic effects
        if (result.cycleCompleted) {
            // Play cinematic sound
            if (focus === 'tuvi') audioManager.playSfx('levelup');
            else if (focus === 'body') audioManager.playSfx('combat_crit');
            else if (focus === 'soul') audioManager.playSfx('breakthrough');

            // Spawn shockwave from portrait center
            const portrait = document.getElementById('aura-border');
            if (portrait) {
                const containerRect = document.getElementById('screen-main').getBoundingClientRect();
                const rect = portrait.getBoundingClientRect();
                const x = rect.left - containerRect.left + rect.width / 2;
                const y = rect.top - containerRect.top + rect.height / 2;

                const shockwave = document.createElement('div');
                shockwave.className = 'meridian-shockwave';
                shockwave.style.setProperty('--focus-color', focus === 'tuvi' ? '#4fd1c5' : (focus === 'body' ? '#ef4444' : '#a855f7'));
                shockwave.style.left = `${x}px`;
                shockwave.style.top = `${y}px`;
                document.getElementById('screen-main').appendChild(shockwave);

                setTimeout(() => shockwave.remove(), 800);

                // Screen shake
                const screenMain = document.getElementById('screen-main');
                if (screenMain) {
                    screenMain.classList.add('screen-shake-effect');
                    setTimeout(() => screenMain.classList.remove('screen-shake-effect'), 400);
                }

                // Float cycle bonus popup
                const bonusPopup = document.createElement('div');
                bonusPopup.className = 'cycle-bonus-popup';

                let title = 'Đại Chu Thiên';
                let label = 'Exp';
                let textColor = 'text-qi-blue';

                if (focus === 'body') {
                    title = 'Tôi Thể Hoàn Tất';
                    textColor = 'text-red-400';
                } else if (focus === 'soul') {
                    title = 'Thần Niệm Thông Đạt';
                    textColor = 'text-purple-400';
                }

                bonusPopup.innerHTML = `
                    <div class="flex flex-col items-center justify-center filter drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]">
                        <span class="text-[7.5px] text-cultivation-gold uppercase tracking-[0.25em] font-ancient">${title}</span>
                        <span class="${textColor} text-[11px] font-black tracking-wider mt-0.5 font-ancient">
                            +${Math.floor(result.cycleBonus).toLocaleString()} ${label}
                        </span>
                    </div>
                `;
                // Position above portrait
                bonusPopup.style.left = `${rect.left + rect.width / 2}px`;
                bonusPopup.style.top = `${rect.top}px`;
                document.getElementById('app').appendChild(bonusPopup);
                setTimeout(() => bonusPopup.remove(), 1600);
            }
        }
    }

    initImageZoomListener() {
        document.addEventListener('click', (e) => {
            const img = e.target.closest('img');
            if (!img) return;

            // Define selectors where image zoom is allowed (ignoring tiny grid/list icons unless they are dynamic lists)
            const allowedSelectors = [
                '#detail-icon img',
                '#phap-bao-detail-icon img',
                '#treasure-detail-icon img',
                '#treasure-detail img',
                '#linh-the-detail-icon img',
                '#ky-trung-detail-icon img',
                '#di-hoa-detail-icon img',
                '#di-loi-detail-icon img',
                '#chung-toc-detail-icon img',
                '#npc-portrait',
                '#npc-trade-portrait',
                '#main-player-portrait',
                '#enemy-portrait-btn img',
                '#enemy-portrait img',
                '#enemy-img',
                '#beast-list-view img',
                '#corpse-list img',
                '#puppet-list img',
                '.save-slot img',
                '.save-card img',
                '.save-portrait img',
                '.character-avatar img',
                '#char-portrait img'
            ];

            const isZoomable = allowedSelectors.some(selector => img.matches(selector));
            if (isZoomable && img.src) {
                this.openImageZoom(img.src);
            }
        });

        // Add visual indicator (zoomable-image class) to those images dynamically via MutationObserver
        const observer = new MutationObserver(() => {
            const allowedSelectors = [
                '#detail-icon img',
                '#phap-bao-detail-icon img',
                '#treasure-detail-icon img',
                '#treasure-detail img',
                '#linh-the-detail-icon img',
                '#ky-trung-detail-icon img',
                '#di-hoa-detail-icon img',
                '#di-loi-detail-icon img',
                '#chung-toc-detail-icon img',
                '#npc-portrait',
                '#npc-trade-portrait',
                '#main-player-portrait',
                '#enemy-portrait-btn img',
                '#enemy-portrait img',
                '#enemy-img',
                '#beast-list-view img',
                '#corpse-list img',
                '#puppet-list img',
                '.save-slot img',
                '.save-card img',
                '.save-portrait img',
                '.character-avatar img',
                '#char-portrait img'
            ];

            allowedSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(img => {
                    if (!img.classList.contains('zoomable-image')) {
                        img.classList.add('zoomable-image');
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    openImageZoom(imgUrl) {
        if (!this.elZoomOverlay) {
            this.elZoomOverlay = document.getElementById('image-zoom-overlay');
            this.elZoomedImg = document.getElementById('zoomed-image');
            this.btnDownloadZoomed = document.getElementById('btn-download-zoomed');
        }
        if (!this.elZoomOverlay || !this.elZoomedImg) return;

        this.elZoomedImg.src = imgUrl;

        // Animate overlay open
        this.toggleOverlay(this.elZoomOverlay, true, () => {
            gsap.fromTo(this.elZoomedImg,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
            );
        });

        // Set up download click handler
        if (this.btnDownloadZoomed) {
            this.btnDownloadZoomed.onclick = (e) => {
                e.stopPropagation();
                this.downloadImage(imgUrl);
            };
        }
    }

    async downloadImage(url) {
        try {
            this.toast("Đang chuẩn bị tải ảnh...", "info");

            // Try fetching as a blob to bypass potential cross-origin issues
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const filename = url.split('/').pop().split('?')[0] || 'mortal-quest-asset.webp';
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(blobUrl);
            this.toast("Đã tải ảnh thành công!", "success");
        } catch (error) {
            console.error("Failed to download image via blob, falling back to direct link", error);
            // Fallback to direct download link (standard <a> tag)
            const filename = url.split('/').pop().split('?')[0] || 'mortal-quest-asset.webp';
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.target = "_blank";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.toast("Đã mở ảnh trong tab mới để tải về!", "success");
        }
    }
}
