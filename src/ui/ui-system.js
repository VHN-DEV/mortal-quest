import { Preferences } from '@capacitor/preferences';
import { gsap } from 'gsap';
import { audioManager } from '../utils/audio-manager.js';
import { logger } from '../utils/logger.js';

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
        this.modalMessage.textContent = message;
        this.modalIcon.className = `ph ${icon} text-5xl text-cultivation-gold animate-bounce-subtle`;
        this.modalBtnConfirm.textContent = confirmText;
        this.modalBtnCancel.textContent = cancelText;
        this.modalBtnCancel.style.display = showCancel ? 'block' : 'none';

        this.toggleOverlay(this.modalOverlay, true);

        const cleanup = () => {
            this.toggleOverlay(this.modalOverlay, false);
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
                    this.toggleOverlay(this.modalOverlay, false, () => {
                        this.modalMessage.innerHTML = originalMessage; // Restore
                        this._restoreButtons(originalConfirmDisplay, originalCancelDisplay, originalCancelText);
                    });
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
                <h2 class="text-6xl font-charm text-cultivation-gold drop-shadow-[0_0_30px_rgba(212,175,55,0.9)]">ĐỘT PHÁ</h2>
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
                <h2 class="death-text text-7xl font-charm mb-4">MỆNH CHUNG</h2>
                <div class="w-32 h-0.5 bg-red-900/50 my-6"></div>
                <p class="death-quote text-sm italic text-gray-400"></p>
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
            'PHAM': { color: '#94a3b8', label: 'PHÀM GIAI', sfx: 'click', shake: false },
            'HOANG': { color: '#10b981', label: 'HOÀNG GIAI', sfx: 'success', shake: false },
            'HUYEN': { color: '#3b82f6', label: 'HUYỀN GIAI', sfx: 'success', shake: false },
            'DIA': { color: '#8b5cf6', label: 'ĐỊA GIAI', sfx: 'breakthrough', shake: 'medium' },
            'THIEN': { color: '#f59e0b', label: 'THIÊN GIAI', sfx: 'breakthrough', shake: 'high' },
            'TIEN': { color: '#ef4444', label: 'TIÊN KHÍ', sfx: 'breakthrough', shake: 'high', flash: true },
            'THAN': { color: '#d4af37', label: 'THẦN VẬT', sfx: 'breakthrough', shake: 'high', flash: true },
            'Hoàn Mỹ': { color: '#8b5cf6', label: 'HOÀN MỸ', sfx: 'success', shake: 'medium' },
            'Cực Phẩm': { color: '#f59e0b', label: 'CỰC PHẨM', sfx: 'breakthrough', shake: 'medium' },
            'Tiên Phẩm': { color: '#ef4444', label: 'TIÊN PHẨM', sfx: 'breakthrough', shake: 'high', flash: true }
        };

        return new Promise(async (resolve) => {
            overlay.classList.remove('hidden');
            overlay.classList.add('flex', 'opacity-100');

            for (const item of lootItems) {
                const config = rarityConfigs[item.quality] || rarityConfigs.PHAM;
                
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
                            <h3 class="text-4xl font-charm text-glow tracking-wider mb-2" style="color: ${config.color}; text-shadow: 0 0 20px ${config.color}66">${item.name}</h3>
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
            if (window.game && window.game.screens.map) window.game.screens.map.renderWorldList();
        } else if (screenId === 'screen-crafting-hub') {
            if (window.game && window.game.screens.systems) window.game.screens.systems.renderCraftingHub();
        } else if (screenId === 'screen-npc') {
            if (window.npcScreen) window.npcScreen.render();
        }
    }
}

