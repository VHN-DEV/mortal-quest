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
};

window.renderCreationScreen = () => {
    const elRoots = document.getElementById('creation-roots');
    const elPhysiques = document.getElementById('creation-physiques');
    const elOrigins = document.getElementById('creation-origins');
    
    if (elRoots) {
        elRoots.innerHTML = CREATION_ROOTS.map(r => `
            <button onclick="window.game.selectCreationRoot('${r.id}')" id="root-${r.id}" class="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-qi-blue transition-all">
                <div class="text-qi-blue font-bold">${r.name}</div>
                <div class="text-[9px] text-gray-500">${r.desc}</div>
            </button>
        `).join('');
    }
    // ... Thêm logic render creation khác nếu cần
};

// Start Battle bridge
window.startBattle = (worldId, locId) => {
    const loc = getLocationById(worldId, locId);
    const enemy = EnemyGenerator.generate(loc.dangerLevel || 1);
    state.currentCombat = new CombatEngine(state.player, enemy, state.ui);
    state.currentCombat.start();
};

// Global error handler
window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.error('Thiên Cơ Hỗn Loạn:', msg, '\nTại:', url, ':', lineNo, ':', columnNo, '\nChi tiết:', error);
    return false;
};
