import './styles/main.css';
import { state } from './state.js';
import { Game } from './game.js';

// Legacy / Specialized Logic Imports (Will be modularized later)
import { EnemyGenerator, Enemy } from './core/enemy.js';
import { CombatEngine } from './core/combat-engine.js';
import { getItemById } from './configs/item-data.js';
import { getWorlds, getLocationById } from './configs/map-data.js';
import { ASSETS } from './configs/asset-data.js';
import { getRealmById, HUMAN_REALMS } from './configs/realm-data.js';
import { ALCHEMY_RECIPES } from './configs/alchemy-data.js';
import { SEEDS } from './configs/garden-data.js';
import { SECTS, getSectById } from './configs/sect-data.js';
import { CREATION_ROOTS, CREATION_PHYSIQUES, CREATION_ORIGINS, CREATION_TRAITS, CREATION_SCENARIOS } from './configs/creation-data.js';
import { PHYSIQUES } from './configs/physique-data.js';
import { NPCScreen } from './ui/screens/NPCScreen.js';

window.npcScreen = new NPCScreen();

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
    const elBodyProgress = document.getElementById('body-progress');
    const elBodyText = document.getElementById('body-text');
    const elSoulProgress = document.getElementById('soul-progress');
    const elSoulText = document.getElementById('soul-text');
    const elBtnBreakthrough = document.getElementById('breakthrough-btn');
    const elBtnCultivateText = document.getElementById('cultivate-btn-text');

    if (elRealm) elRealm.textContent = realm.name;
    if (elProgress) elProgress.style.width = `${Math.min(100, progress)}%`;
    if (elTuViText) elTuViText.textContent = `${Math.floor(player.tuVi).toLocaleString()} / ${realm.expRequired.toLocaleString()}`;

    let tvps = player.tuViPerSecond;
    if (state.systems.time) {
        const season = state.systems.time.getSeason();
        if (season.bonus && season.bonus.tvps) tvps *= season.bonus.tvps;
    }

    if (elPerSec) elPerSec.textContent = `+${tvps.toFixed(1)}/s`;
    if (elLingShiText) elLingShiText.innerHTML = player.getFormattedLingShi();

    const bodyRealm = player.getCurrentRealm('body');
    const soulRealm = player.getCurrentRealm('soul');
    const bodyPercent = Math.min(100, (player.bodyExp / bodyRealm.expRequired) * 100);
    const soulPercent = Math.min(100, (player.soulExp / soulRealm.expRequired) * 100);
    if (elBodyProgress) elBodyProgress.style.width = `${bodyPercent}%`;
    if (elSoulProgress) elSoulProgress.style.width = `${soulPercent}%`;
    if (elBodyText) elBodyText.textContent = `${Math.floor(bodyPercent)}%`;
    if (elSoulText) elSoulText.textContent = `${Math.floor(soulPercent)}%`;

    const focus = player.cultivationFocus || 'tuvi';
    const focusMap = {
        tuvi: { id: 'focus-tuvi', label: 'THU NẠP LINH KHÍ', icon: 'ph-sparkle' },
        body: { id: 'focus-body', label: 'RÈN LUYỆN NHỤC THÂN', icon: 'ph-fire' },
        soul: { id: 'focus-soul', label: 'TÔI LUYỆN THẦN THỨC', icon: 'ph-brain' }
    };
    Object.entries(focusMap).forEach(([key, data]) => {
        const btn = document.getElementById(data.id);
        if (!btn) return;
        const active = key === focus;
        const activeClass = key === 'tuvi'
            ? 'bg-qi-blue/20 text-qi-blue border border-qi-blue/30 focus-tuvi'
            : key === 'body'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 focus-body'
                : 'bg-qi-purple/20 text-qi-purple border border-qi-purple/30 focus-soul';
        btn.className = `flex-grow py-2 rounded-lg text-[8px] font-ancient uppercase tracking-widest transition-all ${active ? activeClass : 'text-gray-500 border border-transparent hover:text-white'}`;
    });
    if (elBtnCultivateText) {
        const cfg = focusMap[focus];
        elBtnCultivateText.innerHTML = `<i class="ph ${cfg.icon} mr-2"></i>${cfg.label}`;
    }
    if (elBtnBreakthrough) {
        const check = player.canBreakthrough(focus);
        elBtnBreakthrough.disabled = !check.can;
        elBtnBreakthrough.title = check.can ? '' : (check.reason || 'Chưa đủ điều kiện');
    }

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

const CREATION_BONUS_LABELS = {
    atk: 'Công',
    def: 'Thủ',
    maxHp: 'Sinh lực',
    spd: 'Tốc',
    mana: 'Mana',
    luck: 'May mắn',
    karma: 'Nghiệp',
    tvps: 'Tu vi/s',
    alchemySuccess: 'Tỉ lệ luyện đan',
    bodyExpSpeed: 'Tốc độ nhục thân',
    soulExpSpeed: 'Tốc độ thần thức',
    qiAbsorb: 'Hấp thu linh khí',
    critRate: 'Bạo kích',
    critDmg: 'ST Bạo kích',
    lifeSteal: 'Hút máu',
    pierce: 'Xuyên thấu',
    soulPierce: 'Xuyên hồn',
    daoVun: 'Đạo vận',
    murderQi: 'Sát khí',
    fireDmg: 'ST Hỏa',
    waterDmg: 'ST Thủy',
    thunderDmg: 'ST Lôi',
    maxAge: 'Thọ nguyên'
};

const formatCreationBonus = (bonus = {}) => {
    const normalized = { ...bonus, ...(bonus.stats || {}) };
    delete normalized.stats;

    const multiplierStats = [
        'tvps', 'alchemySuccess', 'bodyExpSpeed', 'soulExpSpeed', 
        'qiAbsorb', 'critRate', 'critDmg', 'lifeSteal', 
        'pierce', 'soulPierce', 'fireDmg', 'waterDmg', 'thunderDmg'
    ];

    return Object.entries(normalized)
        .map(([key, value]) => {
            if (typeof value !== 'number') return null;
            const label = CREATION_BONUS_LABELS[key] || key;
            
            if (multiplierStats.includes(key)) {
                // If it's a multiplier like 1.5, show +50%. If it's a flat rate like 0.1, show +10%.
                // For critRate/critDmg it might be 0.1 meaning +10%
                let percent;
                if (['critRate', 'critDmg', 'lifeSteal', 'pierce', 'soulPierce', 'fireDmg', 'waterDmg', 'thunderDmg'].includes(key)) {
                    percent = Math.round(value * 100);
                } else {
                    percent = Math.round((value - 1) * 100);
                }
                
                if (percent === 0) return null;
                return `${label} ${percent > 0 ? '+' : ''}${percent}%`;
            }
            
            if (value === 0) return null;
            return `${label} ${value > 0 ? '+' : ''}${value}`;
        })
        .filter(Boolean)
        .join(' · ');
};

const formatOriginResources = (origin) => {
    const lingShi = origin?.resources?.lingShi || 0;
    const monthly = origin?.monthlyResources?.lingShi || 0;
    const items = origin?.resources?.items || [];
    const karma = origin?.resources?.karma || 0;
    
    const lines = [];
    if (lingShi !== 0) lines.push(`Linh thạch ${lingShi > 0 ? '+' : ''}${lingShi}`);
    if (monthly !== 0) lines.push(`Bổng lộc/tháng ${monthly > 0 ? '+' : ''}${monthly}`);
    if (karma !== 0) lines.push(`Nghiệp lực ${karma > 0 ? '+' : ''}${karma}`);
    
    if (items.length > 0) {
        const itemNames = items.map(id => {
            const item = getItemById(id);
            return item ? item.name : id;
        });
        lines.push(`Vật phẩm: ${itemNames.join(', ')}`);
    }
    
    return lines.join(' · ');
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
    const elPointsLabel = document.getElementById('creation-points-label');
    const elPointsNote = document.getElementById('creation-points-note');
    const elModeDescription = document.getElementById('creation-mode-description');
    const elStatsPreview = document.getElementById('creation-stats-preview');

    // Mode Buttons
    const btnCustom = document.getElementById('creation-mode-custom');
    if (btnCustom) {
        btnCustom.onclick = () => window.game.selectCreationMode('custom');
        btnCustom.className = `flex-grow py-3 text-[9px] md:text-[10px] font-ancient uppercase rounded-xl transition-all ${sys.mode === 'custom' ? 'bg-qi-blue/20 text-qi-blue border border-qi-blue/30' : 'text-gray-500'}`;
    }

    if (elPointsContainer) elPointsContainer.classList.remove('hidden');


    const modeDescriptions = {
        custom: 'Tùy Chỉnh: bạn có thể tự build hoặc bấm "Gợi ý ngẫu nhiên" để hệ thống xáo trộn nhanh rồi tinh chỉnh tiếp.'
    };

    if (elModeDescription) elModeDescription.textContent = modeDescriptions[sys.mode] || '';

    if (elPointsLabel && elPointsNote) {
        elPointsLabel.textContent = 'Điểm Tiên Duyên:';
        elPointsNote.textContent = 'Điểm dùng để tùy chỉnh xuất thân/tài nguyên.';
    }

    if (elStatsPreview) {
        const rootBonus = CREATION_ROOTS[sys.selectedRoot]?.bonus || {};
        const traitBonus = sys.selectedTraits.reduce((acc, traitId) => {
            const bonus = CREATION_TRAITS[traitId]?.bonus || {};
            Object.entries(bonus).forEach(([k, v]) => {
                acc[k] = (acc[k] || 0) + v;
            });
            return acc;
        }, {});

        const sumBonus = (key) => (rootBonus[key] || 0) + (traitBonus[key] || 0);
        const previewStats = [
            { label: 'Công', value: sumBonus('atk'), color: 'text-red-400' },
            { label: 'Thủ', value: sumBonus('def'), color: 'text-blue-400' },
            { label: 'Sinh lực', value: sumBonus('maxHp'), color: 'text-emerald-400' },
            { label: 'Tốc', value: sumBonus('spd'), color: 'text-yellow-400' },
            { label: 'Mana', value: sumBonus('mana'), color: 'text-purple-400' },
            { label: 'May mắn', value: sumBonus('luck'), color: 'text-cyan-400' },
            { label: 'Tu vi/s', value: `${sumBonus('tvps') >= 0 ? '+' : ''}${Math.round(sumBonus('tvps') * 100)}%`, color: 'text-cultivation-gold' }
        ];

        elStatsPreview.innerHTML = previewStats.map(stat => {
            const numVal = typeof stat.value === 'number' ? stat.value : null;
            const text = numVal !== null ? `${numVal >= 0 ? '+' : ''}${numVal}` : stat.value;
            const isNeutral = (numVal !== null && numVal === 0) || stat.value === '+0%';
            return `
                <div class="rounded-xl border border-white/10 bg-black/35 px-2 py-2 text-center">
                    <div class="text-[8px] text-gray-400 uppercase tracking-wider">${stat.label}</div>
                    <div class="text-xs font-bold ${isNeutral ? 'text-gray-500' : stat.color}">${text}</div>
                </div>
            `;
        }).join('');
    }
    // Starting Resources Panel (Custom only)
    const elResourcesPanel = document.getElementById('creation-resources-panel');
    if (elResourcesPanel) elResourcesPanel.classList.toggle('hidden', sys.mode !== 'custom');

    const elLingShiInput = document.getElementById('creation-lingshi-input');
    if (elLingShiInput) {
        elLingShiInput.value = sys.startingLingShi;
        elLingShiInput.onchange = (e) => {
            const val = parseInt(e.target.value) || 0;
            sys.startingLingShi = val;
            sys.calculatePoints();
            window.renderCreationScreen();
        };
    }

    if (elPoints) {
        elPoints.textContent = sys.points;
        elPoints.className = `text-xl md:text-2xl font-bold font-mono ${sys.points < 0 ? 'text-red-500' : 'text-qi-blue'}`;
    }

    const elStartingRealmSelect = document.getElementById('creation-starting-realm-select');
    if (elStartingRealmSelect) {
        const availableRealms = HUMAN_REALMS.filter(realm => realm.id <= 13);
        elStartingRealmSelect.innerHTML = availableRealms.map(realm => `
            <option value="${realm.id}">${realm.name}</option>
        `).join('');
        elStartingRealmSelect.value = String(sys.startingRealmId || 1);
        elStartingRealmSelect.onchange = (e) => {
            sys.startingRealmId = parseInt(e.target.value, 10) || 1;
        };
    }

    const elRerollContainer = document.getElementById('creation-reroll-container');
    if (elRerollContainer) elRerollContainer.classList.toggle('hidden', sys.mode !== 'custom');

    const btnReroll = document.getElementById('creation-reroll-btn');
    if (btnReroll) {
        btnReroll.onclick = () => {
            if (state.systems.creation) {
                state.systems.creation.rollRandom();
                window.renderCreationScreen();
            }
        };
    }

    // Name Input
    const elNameInput = document.getElementById('creation-name-input');
    if (elNameInput) {
        elNameInput.value = sys.playerName;
        elNameInput.oninput = (e) => sys.playerName = e.target.value;
    }

    // Gender Buttons
    const btnMale = document.getElementById('creation-gender-male');
    const btnFemale = document.getElementById('creation-gender-female');
    if (btnMale && btnFemale) {
        btnMale.className = `flex-grow py-2 text-[10px] font-ancient uppercase rounded-lg transition-all ${sys.playerGender === 'Nam' ? 'bg-qi-blue/20 text-qi-blue border border-qi-blue/30' : 'text-gray-500 hover:text-white'}`;
        btnFemale.className = `flex-grow py-2 text-[10px] font-ancient uppercase rounded-lg transition-all ${sys.playerGender === 'Nữ' ? 'bg-qi-blue/20 text-qi-blue border border-qi-blue/30' : 'text-gray-500 hover:text-white'}`;
    }

    // Age Input
    const elAgeInput = document.getElementById('creation-age-input');
    if (elAgeInput) {
        elAgeInput.value = sys.playerAge;
        elAgeInput.onchange = (e) => {
            sys.playerAge = parseInt(e.target.value) || 18;
            window.renderCreationScreen();
        };
    }

    // Avatar Gallery
    const elAvatarList = document.getElementById('creation-avatar-list');
    if (elAvatarList) {
        const avatars = ['player_male', 'player_female'];
        elAvatarList.innerHTML = avatars.map(key => {
            const active = sys.playerAvatar === key;
            const url = ASSETS.portraits[key] || '';
            return `
                <div onclick="window.game.selectCreationAvatar('${key}')" 
                    class="w-16 h-16 shrink-0 rounded-xl border-2 ${active ? 'border-qi-blue' : 'border-transparent'} overflow-hidden cursor-pointer hover:border-qi-blue/50 transition-all">
                    <img src="${url}" class="w-full h-full object-cover">
                </div>
            `;
        }).join('');
    }

    if (elRoots) {
        elRoots.innerHTML = Object.values(CREATION_ROOTS).map(r => {
            const active = sys.selectedRoot === r.id;
            const bonuses = (formatCreationBonus(r.bonus) || 'Chỉ số cơ bản').split(' · ');
            return `
                <button onclick="window.game.selectCreationRoot('${r.id}')" 
                    class="q-card ${active ? 'active text-qi-blue border-qi-blue' : 'text-gray-400 border-white/10'}">
                    <div class="flex justify-between items-start gap-2">
                        <div class="q-title ${active ? 'text-qi-blue' : ''}">${r.name}</div>
                        <div class="q-cost">
                            <i class="ph ph-lightning"></i>
                            ${r.cost}
                        </div>
                    </div>
                    <div class="q-desc">${r.desc}</div>
                    <div class="q-bonus-list">
                        ${bonuses.map(b => `<span class="q-bonus-tag">${b}</span>`).join('')}
                    </div>
                </button>
            `;
        }).join('');
    }

    if (elPhysiques) {
        elPhysiques.innerHTML = Object.values(CREATION_PHYSIQUES).map(p => {
            const active = sys.selectedPhysique === p.id;
            const physData = PHYSIQUES[p.id] || {};
            const bonuses = (formatCreationBonus(physData.bonus) || 'Không có chỉ số').split(' · ');
            return `
                <button onclick="window.game.selectCreationPhysique('${p.id}')" 
                    class="q-card ${active ? 'active text-qi-purple border-qi-purple' : 'text-gray-400 border-white/10'} w-full">
                    <div class="flex justify-between items-center gap-2">
                        <div class="q-title ${active ? 'text-qi-purple' : ''}">${p.name}</div>
                        <div class="q-cost">
                            <i class="ph ph-sparkle"></i>
                            ${p.cost}
                        </div>
                    </div>
                    <div class="q-desc">${p.desc}</div>
                    <div class="q-bonus-list">
                        ${bonuses.map(b => `<span class="q-bonus-tag" style="color: #a855f7; background: rgba(168, 85, 247, 0.1); border-color: rgba(168, 85, 247, 0.2)">${b}</span>`).join('')}
                    </div>
                </button>
            `;
        }).join('');
    }

    if (elOrigins) {
        elOrigins.innerHTML = Object.values(CREATION_ORIGINS).map(o => {
            const active = sys.selectedOrigin === o.id;
            const resources = (formatOriginResources(o) || '').split(' · ');
            return `
                <button onclick="window.game.selectCreationOrigin('${o.id}')" 
                    class="q-card ${active ? 'active text-qi-blue border-qi-blue' : 'text-gray-400 border-white/10'} w-full">
                    <div class="flex justify-between items-center gap-2">
                        <div class="q-title ${active ? 'text-qi-blue' : ''}">${o.name}</div>
                        <div class="q-cost">
                            <i class="ph ph-scroll"></i>
                            ${o.cost}
                        </div>
                    </div>
                    <div class="q-desc">${o.desc}</div>
                    <div class="q-bonus-list">
                        ${resources.map(r => `<span class="q-bonus-tag" style="color: #60a5fa; background: rgba(96, 165, 250, 0.1); border-color: rgba(96, 165, 250, 0.2)">${r}</span>`).join('')}
                    </div>
                </button>
            `;
        }).join('');
    }

    if (elTraits) {
        elTraits.innerHTML = Object.values(CREATION_TRAITS).map(t => {
            const active = sys.selectedTraits.includes(t.id);
            const bonuses = (formatCreationBonus(t.bonus) || 'Duyên phận').split(' · ');
            return `
                <button onclick="window.game.toggleCreationTrait('${t.id}')" 
                    class="q-card ${active ? 'active text-qi-jade border-qi-jade' : 'text-gray-400 border-white/10'}">
                    <div class="flex justify-between items-start gap-2">
                        <div class="q-title ${active ? 'text-qi-jade' : ''}">${t.name}</div>
                        <div class="q-cost">
                            <i class="ph ph-star"></i>
                            ${t.cost}
                        </div>
                    </div>
                    <div class="q-desc">${t.desc}</div>
                    <div class="q-bonus-list">
                        ${bonuses.map(b => `<span class="q-bonus-tag" style="color: #22c55e; background: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.2)">${b}</span>`).join('')}
                    </div>
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
