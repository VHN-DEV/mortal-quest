// import './styles/main.css'; // Removed for static server compatibility
import { state } from './state.js';
import { Game } from './game.js';
import { gsap } from 'gsap';

// Legacy / Specialized Logic Imports (Will be modularized later)
import { EnemyGenerator, Enemy } from './core/enemy.js';
import { CombatEngine } from './core/combat-engine.js';
import { getItemById } from './configs/item-data.js';
import { getWorlds, getLocationById } from './configs/map-data.js';
import { ASSETS, preloadAssets } from './configs/asset-data.js';
import { getRealmById, HUMAN_REALMS } from './configs/realm-data.js';
import { ALCHEMY_RECIPES } from './configs/alchemy-data.js';
import { SEEDS } from './configs/garden-data.js';
import { SECTS, getSectById } from './configs/sect-data.js';
import { CREATION_CONFIG, CREATION_RACES, CREATION_ROOTS, ROOT_RARITY, SECONDARY_TALENTS, CREATION_PHYSIQUES, CREATION_ORIGINS, CREATION_TRAITS, CREATION_SCENARIOS, ROOT_ELEMENTS, SPECIAL_ELEMENTS, CREATION_ARTIFACTS, CREATION_SYSTEMS } from './configs/creation-data.js';
import { PHYSIQUES } from './configs/physique-data.js';
import { TITLES } from './configs/fate-data.js';
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
document.addEventListener('DOMContentLoaded', async () => {
    const elLoading = document.getElementById('loading-screen');
    const elBar = document.getElementById('loading-bar');
    const elPercent = document.getElementById('loading-percent');
    const elText = document.getElementById('loading-text');

    try {
        // Bắt đầu preload tài nguyên
        await preloadAssets((percent, text) => {
            // Sử dụng GSAP để làm mượt chuyển động của thanh progress
            if (elBar) {
                gsap.to(elBar, {
                    width: `${percent}%`,
                    duration: 0.5,
                    ease: "power1.out"
                });
            }
            if (elPercent) elPercent.textContent = `${percent}%`;
            if (elText) elText.textContent = text;
        });

        // Khởi tạo game engine
        await game.init();

        // Ẩn màn hình loading với hiệu ứng GSAP premium
        if (elLoading) {
            const tl = gsap.timeline({
                onComplete: () => {
                    elLoading.remove();
                    // Auto-start game logic if needed
                }
            });

            tl.to(elLoading, {
                opacity: 0,
                scale: 1.05,
                duration: 1,
                ease: "power2.inOut",
                pointerEvents: "none"
            });
            
            // Subtle entrance animation for the main app
            gsap.from("#app", {
                opacity: 0,
                y: 10,
                duration: 1,
                delay: 0.5,
                ease: "power2.out"
            });
        }
    } catch (err) {
        console.error('Lỗi khởi động game:', err);
        if (elText) elText.textContent = 'Lỗi nạp linh khí. Vui lòng làm mới trang.';
    }
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
    if (elProgress) {
        // Sử dụng style.width trực tiếp thay vì GSAP trong vòng lặp render mỗi khung hình
        // để tránh xung đột hoạt ảnh và đảm bảo khớp 100% với con số hiển thị.
        elProgress.style.width = `${Math.min(100, progress)}%`;
    }
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

    // Circular Progress Update
    const circleTuVi = document.getElementById('circle-tu-vi');
    const circleBody = document.getElementById('circle-body');
    const circleSoul = document.getElementById('circle-soul');

    if (circleTuVi) {
        const circumference = 301.6;
        const offset = circumference - (Math.min(100, progress) / 100) * circumference;
        circleTuVi.style.strokeDashoffset = offset;
    }
    if (circleBody) {
        const circumference = 276.5;
        const offset = circumference - (bodyPercent / 100) * circumference;
        circleBody.style.strokeDashoffset = offset;
    }
    if (circleSoul) {
        const circumference = 251.3;
        const offset = circumference - (soulPercent / 100) * circumference;
        circleSoul.style.strokeDashoffset = offset;
    }

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
    luck: 'Khí vận',
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
    maxAge: 'Thọ nguyên',
    spdPercent: 'Tốc độ (%)',
    avoidRate: 'Né tránh',
    maxMana: 'Mana tối đa',
    techniqueMastery: 'Lĩnh ngộ công pháp',
    breakthroughChance: 'Tỉ lệ đột phá',
    comprehension: 'Ngộ tính',
    daoTam: 'Đạo tâm',
    divineSense: 'Thần thức',
    physique: 'Căn cốt',
    allRes: 'Kháng Tất Cả'
};

const formatCreationBonus = (bonus = {}) => {
    const normalized = { ...bonus, ...(bonus.stats || {}) };
    delete normalized.stats;

    const multiplierStats = [
        'tvps', 'alchemySuccess', 'bodyExpSpeed', 'soulExpSpeed',
        'qiAbsorb', 'critRate', 'critDmg', 'lifeSteal',
        'pierce', 'soulPierce', 'fireDmg', 'waterDmg', 'thunderDmg', 'allRes'
    ];

    return Object.entries(normalized)
        .map(([key, value]) => {
            if (typeof value !== 'number') return null;
            const label = CREATION_BONUS_LABELS[key] || key;

            if (multiplierStats.includes(key) || key === 'techniqueMastery' || key === 'breakthroughChance') {
                let percent;
                if (['critRate', 'critDmg', 'lifeSteal', 'pierce', 'soulPierce', 'fireDmg', 'waterDmg', 'thunderDmg', 'breakthroughChance', 'allRes'].includes(key)) {
                    percent = Math.round(value * 100);
                } else {
                    // For tvps, 1.2 means +20%, 4.0 means +300%
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

    if (origin?.startingTitle) {
        const title = TITLES.find(t => t.id === origin.startingTitle);
        if (title) lines.push(`Danh hiệu: [${title.name}]`);
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
        elPointsNote.textContent = 'Điểm dùng để tùy chỉnh. Điểm thừa sẽ chuyển hóa thành May mắn và Ngộ tính.';
    }

    if (elStatsPreview) {
        // Base stats for a new player (starting realm)
               const root = CREATION_ROOTS[sys.selectedRoot] || {};
        const phys = PHYSIQUES[sys.selectedPhysique] || {};
        const origin = CREATION_ORIGINS[sys.selectedOrigin] || {};
        const race = CREATION_RACES[sys.selectedRace] || {};
        
        const rootElementsStr = sys.selectedRootElements.map(e => {
            const el = ROOT_ELEMENTS[e] || SPECIAL_ELEMENTS[e] || { icon: '✨' };
            return `${el.icon} ${e}`;
        }).join(', ');

        elStatsPreview.innerHTML = `
            <div class="space-y-2">
                <div class="flex justify-between items-center border-b border-white/5 pb-1">
                    <span class="opacity-60">Chủng tộc</span>
                    <span class="font-medium">${race.name}</span>
                </div>
                <div class="flex justify-between items-start border-b border-white/5 pb-1">
                    <span class="opacity-60">Linh căn</span>
                    <div class="text-right">
                        <div class="font-medium" style="color: ${ROOT_RARITY[sys.rootRarity].color}">
                            ${ROOT_RARITY[sys.rootRarity].name} ${root.name}
                        </div>
                        <div class="text-[8px] text-qi-blue opacity-80">
                            Tinh khiết: ${sys.rootPurity}% · ${rootElementsStr}
                        </div>
                    </div>
                </div>
                    <span class="opacity-60">Thể chất</span>
                    <span class="font-medium">${phys.name || 'Phàm Thể'}</span>
                </div>
                <div class="flex justify-between items-center border-b border-white/5 pb-1">
                    <span class="opacity-60">Xuất thân</span>
                    <span class="font-medium">${origin.name}</span>
                </div>
            </div>
        `;

        const realmLevel = sys.startingRealmId ?? 0;
        const realmMult = realmLevel > 0 ? Math.pow(1.8, realmLevel - 1) : 1.0;

        const base = {
            atk: (10 + (realmLevel * 5)) * realmMult,
            def: (5 + (realmLevel * 2)) * realmMult,
            maxHp: (100 + (realmLevel * 20)) * realmMult,
            mana: (50 + (realmLevel * 50)) * realmMult,
            spd: (15 + (realmLevel * 5)) * realmMult,
            luck: 50,
            karma: 0,
            maxAge: 100 + (realmLevel * 50),
            critRate: 0.05,
            alchemySuccess: 0,
            qiAbsorb: 1.0
        };

        const raceBonus = CREATION_RACES[sys.selectedRace]?.bonus || {};
        const rootBonus = CREATION_ROOTS[sys.selectedRoot]?.bonus || {};
        const physBonus = PHYSIQUES[sys.selectedPhysique]?.bonus || {};
        const traitBonus = sys.selectedTraits.reduce((acc, traitId) => {
            const bonus = CREATION_TRAITS[traitId]?.bonus || {};
            Object.entries(bonus).forEach(([k, v]) => {
                if (k === 'stats') {
                    Object.entries(v).forEach(([sk, sv]) => acc[sk] = (acc[sk] || 0) + sv);
                } else {
                    acc[k] = (acc[k] || 0) + v;
                }
            });
            return acc;
        }, {});

        // Elemental bonuses
        const elementBonus = sys.selectedRootElements.reduce((acc, elName) => {
            const el = ROOT_ELEMENTS[elName] || SPECIAL_ELEMENTS[elName];
            if (el && el.bonus) {
                Object.entries(el.bonus).forEach(([k, v]) => {
                    if (['fireDmg', 'waterDmg', 'thunderDmg', 'poisonDmg', 'skillDmg', 'dotDmg', 'qiAbsorb'].includes(k)) {
                        acc[k] = (acc[k] || 1) * v;
                    } else {
                        acc[k] = (acc[k] || 0) + v;
                    }
                });
            }
            return acc;
        }, {});

        const sumFlat = (key) => (raceBonus[key] || 0) + (rootBonus[key] || 0) + (physBonus[key] || 0) + (traitBonus[key] || 0) + (elementBonus[key] || 0);

        // Multiplier logic for TVPS & Qi Absorb
        const tvpsBonus = (raceBonus.tvps || 1) * (rootBonus.tvps || 1) * (physBonus.tvps || 1) * (traitBonus.tvps || 1) * (elementBonus.tvps || 1);
        const qiBonus = (raceBonus.qiAbsorb || 1) * (rootBonus.qiAbsorb || 1) * (physBonus.qiAbsorb || 1) * (traitBonus.qiAbsorb || 1) * (elementBonus.qiAbsorb || 1);

        const previewStats = [
            { label: 'Công', value: Math.floor(base.atk + sumFlat('atk')), color: 'text-red-400' },
            { label: 'Thủ', value: Math.floor(base.def + sumFlat('def')), color: 'text-blue-400' },
            { label: 'Sinh lực', value: Math.floor(base.maxHp + sumFlat('maxHp')), color: 'text-emerald-400' },
            { label: 'Mana', value: Math.floor(base.mana + sumFlat('mana') + sumFlat('maxMana')), color: 'text-purple-400' },
            { label: 'Tốc', value: Math.floor(base.spd + sumFlat('spd')), color: 'text-yellow-400' },
            { label: 'Thọ nguyên', value: Math.floor(base.maxAge + sumFlat('maxAge')), color: 'text-orange-400' },
            { label: 'May mắn', value: Math.floor(base.luck + sumFlat('luck')), color: 'text-cyan-400' },
            { label: 'Nghiệp lực', value: Math.floor(base.karma + sumFlat('karma')), color: 'text-rose-500' },
            { label: 'Bạo kích', value: `${Math.round((base.critRate + sumFlat('critRate')) * 100)}%`, color: 'text-red-500' },
            { label: 'Hấp thu', value: `x${qiBonus.toFixed(1)}`, color: 'text-qi-jade' },
            { label: 'Luyện đan', value: `+${Math.round(sumFlat('alchemySuccess') * 100)}%`, color: 'text-emerald-500' },
            { label: 'Tu vi/s', value: `+${Math.round((tvpsBonus - 1) * 100)}%`, color: 'text-cultivation-gold' }
        ];

        elStatsPreview.innerHTML = previewStats.map(stat => {
            const numVal = typeof stat.value === 'number' ? stat.value : null;
            const text = numVal !== null ? `${numVal}` : stat.value;
            // Highlight if stat is boosted above base
            let isBoosted = false;
            const key = Object.keys(base).find(k => CREATION_BONUS_LABELS[k] === stat.label);
            if (key) {
                if (numVal !== null) isBoosted = numVal > base[key];
                else if (stat.label === 'Tu vi/s') isBoosted = stat.value !== '+0%';
                else if (stat.label === 'Hấp thu') isBoosted = qiBonus > 1.0;
                else if (stat.label === 'Luyện đan') isBoosted = sumFlat('alchemySuccess') > 0;
                else if (stat.label === 'Bạo kích') isBoosted = (base.critRate + sumFlat('critRate')) > base.critRate;
            }

            return `
                <div class="rounded-xl border border-white/10 bg-black/35 px-2 py-2 text-center transition-all hover:border-white/20">
                    <div class="text-[7px] text-gray-500 uppercase tracking-tighter mb-0.5">${stat.label}</div>
                    <div class="text-[10px] md:text-xs font-bold ${isBoosted ? stat.color : 'text-gray-400'}">${text}</div>
                </div>
            `;
        }).join('');

        // --- Bonus from leftover points preview ---
        if (sys.points > 0) {
            const luckBonus = Math.floor(sys.points * 0.5);
            const compBonus = (sys.points * 0.1).toFixed(1);
            const tuviBonus = sys.points * 100;
            const rating = sys.getDestinyRating(sys.points);

            const bonusEl = document.createElement('div');
            bonusEl.className = 'col-span-full mt-2 p-2 bg-qi-blue/10 border border-qi-blue/20 rounded-xl text-[8px] text-qi-blue italic text-center animate-pulse';
            bonusEl.innerHTML = `
                <i class="ph ph-sparkle mr-1"></i> Nghịch Thiên Cải Mệnh: ${rating} 
                (May mắn +${luckBonus}, Ngộ tính +${compBonus}, Tu vi +${tuviBonus})
            `;
            elStatsPreview.appendChild(bonusEl);
        }
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
        const availableRealms = HUMAN_REALMS.filter(realm => realm.id <= 64);
        elStartingRealmSelect.innerHTML = availableRealms.map(realm => `
            <option value="${realm.id}">${realm.name}</option>
        `).join('');
        elStartingRealmSelect.value = String(sys.startingRealmId ?? 0);
        elStartingRealmSelect.onchange = (e) => {
            sys.startingRealmId = parseInt(e.target.value, 10);
            if (isNaN(sys.startingRealmId)) sys.startingRealmId = 0;
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

    // Race List
    const elRaces = document.getElementById('creation-races-list');
    if (elRaces) {
        elRaces.innerHTML = Object.values(CREATION_RACES).map(r => {
            const active = sys.selectedRace === r.id;
            const bonuses = (formatCreationBonus(r.bonus) || 'Chỉ số cơ bản').split(' · ');
            return `
                <button onclick="window.game.selectCreationRace('${r.id}')" 
                    class="q-card min-w-[140px] ${active ? 'active text-red-400 border-red-400' : 'text-gray-400 border-white/10'}">
                    <div class="flex justify-between items-start gap-2">
                        <div class="q-title ${active ? 'text-red-400' : ''}">${r.name}</div>
                        <div class="q-cost">
                            <i class="ph ph-users"></i>
                            ${r.cost}
                        </div>
                    </div>
                    <div class="q-desc">${r.desc}</div>
                    <div class="q-bonus-list">
                        ${bonuses.map(b => `<span class="q-bonus-tag" style="color: #f87171; background: rgba(248, 113, 113, 0.1); border-color: rgba(248, 113, 113, 0.2)">${b}</span>`).join('')}
                    </div>
                </button>
            `;
        }).join('');
    }

    if (elRoots) {
        elRoots.innerHTML = Object.values(CREATION_ROOTS).map(r => {
            const active = sys.selectedRoot === r.id;
            const bonuses = (formatCreationBonus(r.bonus) || 'Chỉ số cơ bản').split(' · ');
            
            // Element selection logic
            let elementsHtml = '';
            if (active) {
                const isSpecial = r.id === 'di_linh_can' || r.id === 'thien_linh_can';
                const elements = isSpecial ? { ...ROOT_ELEMENTS, ...SPECIAL_ELEMENTS } : ROOT_ELEMENTS;
                
                // For Ngu Hanh, always show all 5
                if (r.id === 'ngu_hanh_linh_can') {
                    elementsHtml = `
                        <div class="mt-3 pt-3 border-t border-white/5">
                            <div class="flex flex-wrap gap-1">
                                ${['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'].map(name => {
                                    const e = ROOT_ELEMENTS[name];
                                    return `<span class="text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 opacity-60">${e.icon} ${e.name}</span>`;
                                }).join('')}
                            </div>
                        </div>
                    `;
                } else {
                    elementsHtml = `
                        <div class="mt-3 pt-3 border-t border-white/5">
                            <div class="text-[8px] uppercase tracking-wider text-qi-blue font-bold opacity-60 mb-2">Chọn Thuộc Tính (${sys.selectedRootElements.length}/${r.quantity})</div>
                            <div class="flex flex-wrap gap-1.5">
                                ${Object.values(elements).map(e => {
                                    const elActive = sys.selectedRootElements.includes(e.name);
                                    const disabled = !elActive && sys.selectedRootElements.length >= r.quantity && r.quantity > 1;
                                    return `
                                        <button onclick="event.stopPropagation(); window.game.toggleCreationRootElement('${e.name}')" 
                                            class="px-2 py-1 rounded-md border text-[8px] flex flex-col items-center gap-0.5 transition-all
                                            ${elActive ? 'bg-qi-blue/20 border-qi-blue text-white' : 'bg-black/40 border-white/10 text-gray-400 opacity-60 hover:opacity-100'}
                                            ${disabled ? 'cursor-not-allowed grayscale' : 'cursor-pointer'}"
                                            ${disabled ? 'disabled' : ''}>
                                            <div class="flex items-center gap-1">
                                                <span>${e.icon}</span>
                                                <span class="font-ancient">${e.name}</span>
                                            </div>
                                        </button>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }
            }

            return `
                <div onclick="window.game.selectCreationRoot('${r.id}')" 
                    class="q-card cursor-pointer ${active ? 'active border-qi-blue' : 'text-gray-400 border-white/10'}">
                    <div class="flex justify-between items-start gap-2">
                        <div class="q-title ${active ? 'text-qi-blue' : ''}">${r.name}</div>
                        <div class="q-cost">
                            <i class="ph ph-lightning"></i>
                            ${r.cost}
                        </div>
                    </div>
                    <div class="q-desc">${r.desc}</div>
                    <div class="q-bonus-list">
                        ${bonuses.map(b => `<span class="q-bonus-tag" style="color: #60a5fa; background: rgba(96, 165, 250, 0.1); border-color: rgba(96, 165, 250, 0.2)">${b}</span>`).join('')}
                    </div>
                    ${elementsHtml}
                </div>
            `;
        }).join('');
    }

    // Secondary Talents List
    const elTalentsList = document.getElementById('creation-talents-list');
    const elTalentsHeader = document.querySelector('#creation-talents-container span');
    
    if (elTalentsHeader && !document.getElementById('reroll-talents-btn')) {
        const btn = document.createElement('button');
        btn.id = 'reroll-talents-btn';
        btn.className = 'p-1.5 rounded-lg bg-qi-blue/10 border border-qi-blue/20 text-qi-blue hover:bg-qi-blue/20 transition-all flex items-center space-x-1';
        btn.onclick = () => window.game.rerollCreationTalents();
        btn.innerHTML = `<i class="ph ph-arrows-clockwise text-[10px]"></i> <span class="text-[8px] font-bold">Xí Ngầu</span>`;
        
        const wrapper = elTalentsHeader.parentElement;
        if (wrapper) {
            const controls = wrapper.querySelector('.flex.items-center.space-x-2');
            if (controls) controls.prepend(btn);
        }
    }

    if (elTalentsList) {
        elTalentsList.innerHTML = Object.values(SECONDARY_TALENTS).map(t => {
            const baseVal = sys.talents[t.id];
            const totalVal = sys.getTalentValue(t.id);
            const bonus = totalVal - baseVal;
            
            let color = 'text-gray-400';
            if (totalVal > 80) color = 'text-cultivation-gold';
            else if (totalVal > 60) color = 'text-qi-blue';
            
            return `
                <div class="flex flex-col space-y-1.5 p-2 rounded-xl bg-black/40 border border-white/5">
                    <div class="flex justify-between items-center">
                        <span class="text-[9px] font-ancient text-white/80 uppercase tracking-widest">${t.name}</span>
                        <div class="flex items-center space-x-1.5">
                            ${bonus !== 0 ? `<span class="text-[8px] ${bonus > 0 ? 'text-green-400' : 'text-red-400'}">${bonus > 0 ? '+' : ''}${bonus}</span>` : ''}
                            <span class="text-xs font-mono font-bold ${color}">${totalVal}</span>
                        </div>
                    </div>
                    <div class="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div class="h-full bg-qi-blue shadow-[0_0_8px_rgba(79,209,197,0.3)]" style="width: ${Math.min(100, totalVal)}%"></div>
                    </div>
                    <div class="text-[7px] text-gray-600 italic leading-tight">${t.desc}</div>
                </div>
            `;
        }).join('');
    }

    if (elPhysiques) {
        elPhysiques.innerHTML = Object.values(CREATION_PHYSIQUES).map(p => {
            const active = sys.selectedPhysique === p.id;
            const physData = PHYSIQUES[p.id] || p; // Fallback to p if not in PHYSIQUES
            const bonuses = (formatCreationBonus(physData.bonus) || 'Chỉ số cơ bản').split(' · ');
            return `
                <button onclick="window.game.selectCreationPhysique('${p.id}')" 
                    class="q-card ${active ? 'active text-qi-purple border-qi-purple' : 'text-gray-400 border-white/10'} w-full">
                    <div class="flex justify-between items-start gap-2">
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
                    <div class="flex justify-between items-start gap-2">
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

    // Cheat Systems List
    const elSystems = document.getElementById('creation-systems-list');
    if (elSystems) {
        elSystems.innerHTML = CREATION_SYSTEMS.map(s => {
            const active = sys.selectedCheatSystem === s.id;
            return `
                <button onclick="window.game.selectCreationCheatSystem('${s.id}')" 
                    class="q-card text-left ${active ? 'active border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'text-gray-400 border-white/10'} w-full transition-all duration-300">
                    <div class="flex justify-between items-start gap-2">
                        <div class="flex items-center space-x-2">
                            <span class="text-base text-amber-400"><i class="${s.icon}"></i></span>
                            <div class="q-title font-ancient ${active ? 'text-cultivation-gold' : 'text-white/80'}">${s.name}</div>
                        </div>
                        <div class="text-[8px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-cultivation-gold uppercase font-bold tracking-wider">
                            ${s.difficulty}
                        </div>
                    </div>
                    <div class="q-desc mt-1.5 text-left">${s.desc}</div>
                    <div class="q-bonus-list mt-2 flex flex-wrap gap-1">
                        <span class="q-bonus-tag text-[8px] font-ancient" style="color: #fbbf24; background: rgba(251, 191, 36, 0.1); border-color: rgba(251, 191, 36, 0.2)">
                            Kiểu nhận: ${s.claimStyle === 'direct' ? 'Nhận Trực Tiếp' : s.claimStyle === 'chest' ? 'Rương Ngẫu Nhiên' : 'Chọn 1 Trong 3'}
                        </span>
                    </div>
                </button>
            `;
        }).join('');
    }


    // --- Artifacts List ---
    const elArtifacts = document.getElementById('creation-artifacts-list');
    if (elArtifacts) {
        const RARITY_COLOR = {
            'Danh Khí':             { text: 'text-red-400', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
            'Tiên Khí':             { text: 'text-cyan-400', bg: 'rgba(34,211,238,0.1)', border: 'rgba(34,211,238,0.3)' },
            'Thông Thiên Linh Bảo': { text: 'text-amber-400', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
        };

        elArtifacts.innerHTML = Object.values(CREATION_ARTIFACTS)
            .filter(a => a.rarity === 'Danh Khí')
            .map(a => {
                const active = sys.selectedArtifact === a.id;
                const col = RARITY_COLOR[a.rarity] || { text: 'text-gray-400', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' };
                return `
                    <button onclick="window.game.selectCreationArtifact('${a.id}')"
                        class="q-card w-full ${active ? 'active' : 'border-white/10'}"
                        style="${active ? `border-color: ${col.border}; box-shadow: 0 0 12px ${col.border};` : ''}"
                    >
                        <div class="flex justify-between items-start gap-2">
                            <div class="q-title ${active ? col.text : ''}">${a.name}</div>
                            <div class="q-cost" style="color: #f87171;">
                                <i class="ph ph-star"></i>
                                -${a.cost}
                            </div>
                        </div>
                        <div class="q-desc">${a.desc}</div>
                        <div class="q-bonus-list mt-2">
                            <span class="q-bonus-tag" style="color: ${col.text.replace('text-', '')}; background: ${col.bg}; border-color: ${col.border}">${a.rarity}</span>
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

    const btnCreationBack = document.getElementById('btn-creation-back');
    if (btnCreationBack) {
        btnCreationBack.onclick = () => {
            window.game.showStartScreen();
        };
    }

};

// Global error handler
window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.error('Thiên Cơ Hỗn Loạn:', msg, '\nTại:', url, ':', lineNo, ':', columnNo, '\nChi tiết:', error);
    return false;
};
