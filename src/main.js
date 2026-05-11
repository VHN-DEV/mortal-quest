import './styles/main.css';
import { state } from './state.js';
import { Game } from './game.js';

// Legacy / Specialized Logic Imports (Will be modularized later)
import { EnemyGenerator, Enemy } from './core/enemy.js';
import { CombatEngine } from './core/combat-engine.js';
import { getItemById } from './configs/item-data.js';
import { getWorlds, getLocationById } from './configs/map-data.js';
import { ASSETS } from './configs/asset-data.js';
import { getRealmById } from './configs/realm-data.js';
import { ALCHEMY_RECIPES } from './configs/alchemy-data.js';
import { SEEDS } from './configs/garden-data.js';
import { SECTS, getSectById } from './configs/sect-data.js';
import { CREATION_ROOTS, CREATION_PHYSIQUES, CREATION_ORIGINS, CREATION_TRAITS, CREATION_SCENARIOS } from './configs/creation-data.js';

/**
 * Entry point của ứng dụng.
 * Khởi tạo Game engine và quản lý các logic chuyển tiếp.
 */

// Khởi tạo Game
const game = new Game();
window.game = game; // Global access cho onclick trong HTML
window.state = state;

// Khi DOM sẵn sàng, bắt đầu game
document.addEventListener('DOMContentLoaded', () => {
    game.init();
});

// --- COMPATIBILITY LAYER ---
// Các hàm này được gọi từ HTML hoặc các file JS cũ. 
// Chúng ta mapping chúng vào game instance.

window.refreshUI = () => game.refreshUI();
window.switchScreen = (screenId, btn) => state.ui.switchScreen(screenId, btn);

// --- RE-IMPLEMENTING MISSING LOGIC (TEMPORARY) ---
// Một số logic phức tạp chưa được tách sang Screen sẽ nằm ở đây hoặc SystemsScreen.

window.renderMainStats = () => {
    const player = state.player;
    if (!player) return;
    
    const realm = player.getCurrentRealm();
    const progress = (player.tuVi / realm.expRequired) * 100;

    const elRealm = document.getElementById('current-realm');
    const elProgress = document.getElementById('tu-vi-progress');
    const elTuViText = document.getElementById('tu-vi-text');
    const elPerSec = document.getElementById('tu-vi-per-sec');
    const elLingShiText = document.getElementById('ling-shi-text');

    if (elRealm) elRealm.textContent = realm.name;
    if (elProgress) elProgress.style.width = `${Math.min(100, progress)}%`;
    if (elTuViText) elTuViText.textContent = `${Math.floor(player.tuVi).toLocaleString()} / ${realm.expRequired.toLocaleString()}`;

    let tvps = player.tuViPerSecond;
    if (state.systems.time) {
        const season = state.systems.time.getSeason();
        if (season.bonus && season.bonus.tvps) tvps *= season.bonus.tvps;
    }

    if (elPerSec) elPerSec.textContent = `+${tvps.toFixed(1)}/s`;
    if (elLingShiText) elLingShiText.textContent = player.getFormattedLingShi();
    
    renderTimeHUD();
};

window.renderTimeHUD = () => {
    if (!state.systems.time) return;
    
    const t = state.systems.time.getFormattedTime();
    
    const elHour = document.getElementById('time-hour');
    const elPeriod = document.getElementById('time-period');
    const elSeason = document.getElementById('time-season');
    const elDate = document.getElementById('time-date');
    const elPhenomenon = document.getElementById('time-phenomenon');
    
    if (elHour) elHour.textContent = t.hourName;
    if (elPeriod) elPeriod.textContent = `(${t.period === 'Day' ? 'Ban Ngày' : 'Ban Đêm'})`;
    if (elSeason) {
        elSeason.textContent = t.seasonName;
        elSeason.style.color = t.seasonColor;
        elSeason.style.borderColor = `${t.seasonColor}4d`; // 30% opacity hex
    }
    if (elDate) elDate.textContent = `Ngày ${t.day} Tháng ${t.month} Năm ${t.year}`;
    
    if (elPhenomenon) {
        if (t.phenomenon) {
            elPhenomenon.textContent = t.phenomenon;
            elPhenomenon.classList.remove('hidden');
        } else {
            elPhenomenon.classList.add('hidden');
        }
    }
};

window.renderCreationScreen = () => {
    const sys = state.systems.creation;
    if (!sys) return;

    const elRoots = document.getElementById('creation-roots-grid');
    const elPhysiques = document.getElementById('creation-physiques-list');
    const elOrigins = document.getElementById('creation-origins-list');
    const elTraits = document.getElementById('creation-traits-grid');
    const elPoints = document.getElementById('creation-points-value');
    const elPointsContainer = document.getElementById('creation-points-container');
    
    // Mode Buttons
    const btnRandom = document.getElementById('creation-mode-random');
    const btnCustom = document.getElementById('creation-mode-custom');
    const btnSpecial = document.getElementById('creation-mode-special');

    if (btnRandom) {
        btnRandom.onclick = () => window.game.selectCreationMode('random');
        btnRandom.className = `flex-grow py-3 text-[9px] md:text-[10px] font-ancient uppercase rounded-xl transition-all ${sys.mode === 'random' ? 'bg-qi-blue/20 text-qi-blue border border-qi-blue/30' : 'text-gray-500'}`;
    }
    if (btnCustom) {
        btnCustom.onclick = () => window.game.selectCreationMode('custom');
        btnCustom.className = `flex-grow py-3 text-[9px] md:text-[10px] font-ancient uppercase rounded-xl transition-all ${sys.mode === 'custom' ? 'bg-qi-blue/20 text-qi-blue border border-qi-blue/30' : 'text-gray-500'}`;
    }
    if (btnSpecial) {
        btnSpecial.onclick = () => window.game.selectCreationMode('special');
        btnSpecial.className = `flex-grow py-3 text-[9px] md:text-[10px] font-ancient uppercase rounded-xl transition-all ${sys.mode === 'special' ? 'bg-qi-blue/20 text-qi-blue border border-qi-blue/30' : 'text-gray-500'}`;
    }

    if (elPointsContainer) elPointsContainer.classList.toggle('hidden', sys.mode !== 'custom');
    
    if (elPoints) {
        elPoints.textContent = sys.points;
        elPoints.className = `text-xl md:text-2xl font-bold font-mono ${sys.points < 0 ? 'text-red-500' : 'text-qi-blue'}`;
    }

    if (elRoots) {
        elRoots.innerHTML = Object.values(CREATION_ROOTS).map(r => {
            const active = sys.selectedRoot === r.id;
            return `
                <button onclick="window.game.selectCreationRoot('${r.id}')" 
                    class="p-4 bg-white/5 border ${active ? 'border-qi-blue bg-qi-blue/10' : 'border-white/10'} rounded-xl hover:border-qi-blue transition-all text-left">
                    <div class="${active ? 'text-qi-blue' : 'text-gray-300'} font-bold text-xs">${r.name}</div>
                    <div class="text-[8px] text-gray-500 mt-1">${r.desc}</div>
                    <div class="text-[8px] text-cultivation-gold mt-1">Hao phí: ${r.cost}</div>
                </button>
            `;
        }).join('');
    }

    if (elPhysiques) {
        elPhysiques.innerHTML = Object.values(CREATION_PHYSIQUES).map(p => {
            const active = sys.selectedPhysique === p.id;
            return `
                <button onclick="window.game.selectCreationPhysique('${p.id}')" 
                    class="w-full p-4 bg-white/5 border ${active ? 'border-qi-purple bg-qi-purple/10' : 'border-white/10'} rounded-xl hover:border-qi-purple transition-all text-left flex justify-between items-center">
                    <div>
                        <div class="${active ? 'text-qi-purple' : 'text-gray-300'} font-bold text-xs">${p.name}</div>
                        <div class="text-[8px] text-gray-500 mt-1">${p.desc}</div>
                    </div>
                    <div class="text-[8px] text-cultivation-gold">Hao phí: ${p.cost}</div>
                </button>
            `;
        }).join('');
    }

    if (elOrigins) {
        elOrigins.innerHTML = Object.values(CREATION_ORIGINS).map(o => {
            const active = sys.selectedOrigin === o.id;
            return `
                <button onclick="window.game.selectCreationOrigin('${o.id}')" 
                    class="w-full p-4 bg-white/5 border ${active ? 'border-qi-blue bg-qi-blue/10' : 'border-white/10'} rounded-xl hover:border-qi-blue transition-all text-left flex justify-between items-center">
                    <div>
                        <div class="${active ? 'text-qi-blue' : 'text-gray-300'} font-bold text-xs">${o.name}</div>
                        <div class="text-[8px] text-gray-500 mt-1">${o.desc}</div>
                    </div>
                    <div class="text-[8px] text-cultivation-gold">Hao phí: ${o.cost}</div>
                </button>
            `;
        }).join('');
    }

    if (elTraits) {
        elTraits.innerHTML = Object.values(CREATION_TRAITS).map(t => {
            const active = sys.selectedTraits.includes(t.id);
            return `
                <button onclick="window.game.toggleCreationTrait('${t.id}')" 
                    class="p-3 bg-white/5 border ${active ? 'border-qi-jade bg-qi-jade/10' : 'border-white/10'} rounded-xl hover:border-qi-jade transition-all text-left">
                    <div class="${active ? 'text-qi-jade' : 'text-gray-300'} font-bold text-[10px]">${t.name}</div>
                    <div class="text-[8px] text-gray-500 mt-1">${t.desc}</div>
                    <div class="text-[8px] text-cultivation-gold mt-1">Hao phí: ${t.cost}</div>
                </button>
            `;
        }).join('');
    }

    // Binds for fixed buttons
    const btnStart = document.getElementById('creation-start-btn');
    if (btnStart) {
        btnStart.onclick = () => window.game.startCreationGame();
        btnStart.disabled = sys.points < 0;
        btnStart.style.opacity = sys.points < 0 ? '0.5' : '1';
    }

    const btnGuide = document.getElementById('btn-open-guide');
    if (btnGuide) {
        btnGuide.onclick = () => {
            const guide = document.getElementById('guide-overlay');
            if (guide) guide.classList.remove('hidden');
        };
    }

    const btnCloseGuide = document.getElementById('btn-close-guide');
    const btnGuideGotIt = document.getElementById('btn-guide-got-it');
    const guideOverlay = document.getElementById('guide-overlay');
    if (btnCloseGuide && guideOverlay) btnCloseGuide.onclick = () => guideOverlay.classList.add('hidden');
    if (btnGuideGotIt && guideOverlay) btnGuideGotIt.onclick = () => guideOverlay.classList.add('hidden');
};

// Global error handler
window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.error('Thiên Cơ Hỗn Loạn:', msg, '\nTại:', url, ':', lineNo, ':', columnNo, '\nChi tiết:', error);
    return false;
};
