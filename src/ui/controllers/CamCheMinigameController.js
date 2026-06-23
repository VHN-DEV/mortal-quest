import { state } from '../../state.js';

export class CamCheMinigameController {
    constructor() {
        this.trigrams = ['乾', '坤', '震', '巽', '坎', '離', '艮', '兌'];
        
        this.overlay = null;
        this.title = null;
        this.sequenceContainer = null;
        this.timerText = null;
        this.timerBar = null;
        this.closeBtn = null;
        
        this.targetSequence = [];
        this.currentInputIdx = 0;
        this.timeLeft = 0;
        this.maxTime = 0;
        this.timerInterval = null;
        this.onCompleteCallback = null;
        
        // Flag to prevent double input or actions during transition
        this.active = false;
        
        // Lazy initialize elements on first call
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        this.overlay = document.getElementById('cam-che-minigame-overlay');
        this.title = document.getElementById('minigame-title');
        this.sequenceContainer = document.getElementById('minigame-sequence-container');
        this.timerText = document.getElementById('minigame-timer-text');
        this.timerBar = document.getElementById('minigame-timer-bar');
        this.closeBtn = document.getElementById('cam-che-minigame-close');
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.cancel());
        }
        
        const buttons = document.querySelectorAll('.minigame-trigram-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const trigram = btn.getAttribute('data-trigram');
                if (trigram) this.handleInput(trigram);
            });
        });
        
        this.initialized = true;
    }

    start(recipe, onComplete) {
        this.init();
        if (!this.overlay) return;

        this.onCompleteCallback = onComplete;
        this.currentInputIdx = 0;
        this.active = true;

        // Determine difficulty parameters based on recipe level
        let seqLength = 4;
        this.maxTime = 10.0;

        if (recipe.level >= 6) {
            seqLength = 6;
            this.maxTime = 6.0;
        } else if (recipe.level >= 3) {
            seqLength = 5;
            this.maxTime = 8.0;
        }

        this.timeLeft = this.maxTime;

        // Generate random target sequence
        this.targetSequence = [];
        for (let i = 0; i < seqLength; i++) {
            const randomIndex = Math.floor(Math.random() * this.trigrams.length);
            this.targetSequence.push(this.trigrams[randomIndex]);
        }

        // Render target sequence in the UI
        this.renderSequence();

        // Update timer representation
        this.updateTimerUI();

        // Title update
        if (this.title) {
            this.title.textContent = `Bát Quái: ${recipe.name || 'Cấm Chế'}`;
        }

        // Start timer tick
        if (this.timerInterval) clearInterval(this.timerInterval);
        const tickRate = 50; // ms
        this.timerInterval = setInterval(() => {
            this.timeLeft -= tickRate / 1000;
            if (this.timeLeft <= 0) {
                this.timeLeft = 0;
                this.updateTimerUI();
                this.fail("Hết thời gian! Lực lượng Thần Thức tiêu tán.");
            } else {
                this.updateTimerUI();
            }
        }, tickRate);

        // Show overlay
        state.ui.toggleOverlay(this.overlay, true);
    }

    renderSequence() {
        if (!this.sequenceContainer) return;
        this.sequenceContainer.innerHTML = '';

        this.targetSequence.forEach((trigram, idx) => {
            const el = document.createElement('div');
            el.className = 'w-9 h-9 rounded-full flex flex-col items-center justify-center border font-bold text-xs transition-all relative overflow-hidden ';
            
            // Map character to name
            const names = { '乾': 'Càn', '坤': 'Khôn', '震': 'Chấn', '巽': 'Tốn', '坎': 'Khảm', '離': 'Ly', '艮': 'Cấn', '兌': 'Đoài' };
            const name = names[trigram] || '';

            if (idx < this.currentInputIdx) {
                // Correctly solved
                el.className += 'bg-qi-jade/20 border-qi-jade text-qi-jade shadow-lg shadow-qi-jade/10 scale-105';
            } else if (idx === this.currentInputIdx) {
                // Current target
                el.className += 'bg-qi-blue/10 border-qi-blue text-qi-blue animate-pulse scale-110 border-2 shadow-lg shadow-qi-blue/20';
            } else {
                // Unsolved future
                el.className += 'bg-white/5 border-white/10 text-gray-500';
            }

            el.innerHTML = `
                <span>${trigram}</span>
                <span class="text-[6px] opacity-70 -mt-0.5">${name}</span>
            `;
            this.sequenceContainer.appendChild(el);
        });
    }

    updateTimerUI() {
        if (this.timerText) {
            this.timerText.textContent = `${Math.max(0, this.timeLeft).toFixed(1)}s`;
        }
        if (this.timerBar) {
            const percentage = (this.timeLeft / this.maxTime) * 100;
            this.timerBar.style.width = `${percentage}%`;
            
            // Change color dynamically
            if (percentage <= 25) {
                this.timerBar.className = 'h-full bg-red-500 transition-all';
                this.timerText.className = 'text-red-500 font-mono animate-pulse';
            } else if (percentage <= 50) {
                this.timerBar.className = 'h-full bg-amber-500 transition-all';
                this.timerText.className = 'text-amber-500 font-mono';
            } else {
                this.timerBar.className = 'h-full bg-gradient-to-r from-qi-jade to-emerald-400 transition-all';
                this.timerText.className = 'text-qi-jade font-mono';
            }
        }
    }

    handleInput(trigram) {
        if (!this.active) return;

        const expected = this.targetSequence[this.currentInputIdx];
        if (trigram === expected) {
            this.currentInputIdx++;
            this.renderSequence();
            
            // Success audio/visual effect (subtle scale up)
            if (this.currentInputIdx >= this.targetSequence.length) {
                this.success();
            }
        } else {
            this.fail("Khắc sai trận pháp! Linh khí ngược dòng phát nổ phản phệ.");
        }
    }

    success() {
        this.active = false;
        clearInterval(this.timerInterval);
        
        state.ui.toast("Bát quái khép lại, cấm chế bố trí hoàn mỹ!", "success");
        
        setTimeout(() => {
            state.ui.toggleOverlay(this.overlay, false);
            if (this.onCompleteCallback) this.onCompleteCallback(true);
        }, 600);
    }

    fail(message) {
        this.active = false;
        clearInterval(this.timerInterval);
        
        // Shake overlay container to indicate error
        if (this.overlay) {
            const inner = this.overlay.querySelector('.relative');
            if (inner) {
                inner.classList.add('animate-shake');
                setTimeout(() => inner.classList.remove('animate-shake'), 500);
            }
        }

        state.ui.toast(message, "error");
        
        setTimeout(() => {
            state.ui.toggleOverlay(this.overlay, false);
            if (this.onCompleteCallback) this.onCompleteCallback(false);
        }, 1000);
    }

    cancel() {
        this.active = false;
        clearInterval(this.timerInterval);
        state.ui.toggleOverlay(this.overlay, false);
        state.ui.toast("Bỏ dở bố trí cấm chế.", "info");
        // Materials are NOT consumed if cancelled before starting, but here we were already in it.
        // Wait, the materials were already spent when opening the minigame? Let's check how we handle it in game.js.
        // In game.js, we should ONLY consume materials if they fail or succeed, OR if we cancel we return materials.
        // Let's design it so materials are consumed only when minigame resolves (with success or fail). That is much cleaner!
        if (this.onCompleteCallback) this.onCompleteCallback(false, true); // true = cancelled
    }
}
